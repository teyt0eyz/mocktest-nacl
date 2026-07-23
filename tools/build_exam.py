# -*- coding: utf-8 -*-
"""Rebuild nacl_mocktest_data.json.

Goal: 5 exam sets, each following the blueprint's per-category question-type
counts, with EVERY question text unique across the whole exam (no repeats
within or across sets). Number-base questions now cover binary→(8,10,16) etc.,
and a large Cyber-Security incident/principle bank is included.

Pools per category+type are assembled from:
  1. existing vetted distinct questions  (tools/existing_pool.json)
  2. hand-authored new bank               (tools/bank.py)
  3. parametric generators                (tools/gen.py)  — maths categories

Then dealt round-robin into the 5 sets so each set gets its quota, all unique.
"""
import json, random, sys, os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)

import gen
import bank

RNG = random.Random(20260724)   # deterministic build

# ─── load inputs ──────────────────────────────────────────────────────
existing = json.load(open(os.path.join(HERE, 'existing_pool.json'), encoding='utf-8'))
src = json.load(open(os.path.join(ROOT, 'nacl_mocktest_data.json'), encoding='utf-8'))

CATS = existing  # keeps name / question_counts / points_total order

def norm(t):
    return ' '.join(str(t).strip().lower().split())

# ─── build a big pool per category, grouped by type ───────────────────
def new_bank_for(ci):
    return {0: bank.CAT0, 2: bank.CAT2, 4: bank.CAT4,
            5: bank.CAT5, 6: bank.CAT6, 7: bank.CAT7}.get(ci, [])

def param_for(ci):
    """Return generated questions to top-up maths-heavy categories."""
    if ci == 1:   # number base — regenerate fully
        return gen.numberbase_pool(RNG, per_kind=7)
    if ci == 3:   # applied maths
        return (gen.modular_pool(RNG, 14) + gen.numberbase_pool(RNG, per_kind=3)
                + gen.series_pool(RNG, 10))
    if ci == 4:   # networks — subnet maths top-up
        return gen.subnet_pool(RNG, n_hosts=16, n_split=14)
    if ci == 7:   # logic — series / probability / arithmetic
        return (gen.series_pool(RNG, 40) + gen.probability_pool(RNG, 14)
                + gen.modular_pool(RNG, 20))
    return []

CLAIMED = set()   # question texts already assigned to some category, exam-wide

def collect_pool(ci):
    """type -> list[question dict], all with globally-unique normalised text."""
    cat = CATS[ci]
    pools = {'mc': [], 'ms': [], 'written': []}

    def add(q):
        k = norm(q['question'])
        if k in CLAIMED:
            return
        CLAIMED.add(k)
        pools[q['type']].append(q)

    # 1) existing vetted (skip CAT1: fully regenerated for base-8 coverage)
    if ci != 1:
        for q in cat['questions']:
            add(q)
    # 2) authored bank
    for q in new_bank_for(ci):
        add(q)
    # 3) parametric
    for q in param_for(ci):
        add(q)
    return pools

# ─── deal a type's pool into 5 sets, `n` each, all unique ──────────────
def deal(pool, n_per_set, n_sets=5):
    need = n_per_set * n_sets
    items = pool[:]
    RNG.shuffle(items)
    if len(items) < need:
        raise RuntimeError(f'SHORT: need {need}, have {len(items)}')
    # round-robin keeps "hard/easy" spread evenly across sets
    sets = [[] for _ in range(n_sets)]
    idx = 0
    for s in range(n_sets):
        for _ in range(n_per_set):
            sets[s].append(items[idx]); idx += 1
    return sets

# ─── assemble the 5 sets ──────────────────────────────────────────────
set_categories = [[] for _ in range(5)]
global_seen = set()
report = []

# CAT1 gets an explicitly balanced deal so every set contains binary→8/10/16
NB_SETS = gen.numberbase_sets(RNG)
for grp in NB_SETS:
    for q in grp:
        CLAIMED.add(norm(q['question']))

for ci, cat in enumerate(CATS):
    counts = cat['question_counts']
    dealt = {}
    if ci == 1:
        dealt['mc'] = NB_SETS   # 5 sets × 5 questions, coverage guaranteed
        report.append(f'  CAT1 mc: balanced deal (bin→8/10/16 each set)')
    else:
        pools = collect_pool(ci)
        for t in ('mc', 'ms', 'written'):
            n = counts.get(t, 0)
            if n == 0:
                continue
            dealt[t] = deal(pools[t], n)
            report.append(f'  CAT{ci} {t}: pool={len(pools[t])} need={n*5}')
    for s in range(5):
        qs = []
        for t in ('mc', 'ms', 'written'):
            if t in dealt:
                qs.extend(dealt[t][s])
        RNG.shuffle(qs)
        # guard: no duplicate text anywhere in the exam
        for q in qs:
            k = norm(q['question'])
            assert k not in global_seen, f'DUP: {q["question"]}'
            global_seen.add(k)
        set_categories[s].append({
            'name': cat['name'],
            'points_total': cat['points_total'],
            'question_counts': counts,
            'questions': qs,
        })

# ─── renumber IDs sequentially, recompute points, write out ───────────
POINTS = {'mc': 2, 'ms': 5, 'written': 5}
qid = 0
sets_out = []
for s in range(5):
    cats = set_categories[s]
    for cat in cats:
        pts = 0
        for q in cat['questions']:
            qid += 1
            q['id'] = f'Q{qid:04d}'
            # canonical key order
            keys = ['id', 'type', 'subtopic', 'question']
            if 'options' in q:
                keys.append('options')
            keys += ['answer', 'explanation']
            newq = {k: q[k] for k in keys if k in q}
            q.clear(); q.update(newq)
            pts += POINTS[q['type']]
        cat['points_total'] = pts
    sets_out.append({
        'set_id': s + 1,
        'set_name': src['sets'][s]['set_name'],
        'categories': cats,
    })

out = {
    'exam_info': src['exam_info'],
    'scoring_rules': src['scoring_rules'],
    'sets': sets_out,
}

# refresh exam_info totals from what we actually built
tq = sum(len(c['questions']) for c in sets_out[0]['categories'])
ts = sum(c['points_total'] for c in sets_out[0]['categories'])
from collections import Counter
tc = Counter()
for c in sets_out[0]['categories']:
    for q in c['questions']:
        tc[q['type']] += 1
out['exam_info']['total_questions'] = tq
out['exam_info']['total_score'] = ts
out['exam_info']['question_type_counts'] = {
    'multiple_choice_5options': tc['mc'],
    'multiple_selection': tc['ms'],
    'written_response': tc['written'],
}

with open(os.path.join(ROOT, 'nacl_mocktest_data.json'), 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=1)

print('\n'.join(report))
print(f'\nBuilt: per-set questions={tq}  score={ts}  types={dict(tc)}')
print(f'Total distinct question texts across exam: {len(global_seen)} (expect {tq*5})')
