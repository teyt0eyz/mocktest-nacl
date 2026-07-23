"""Parametric, deterministic question generators for the NACL mock exam.

Every generator returns question dicts in the storage schema:
    {type, subtopic, question, options:[5], answer:<int>, explanation}
All maths is computed in Python so the stored answer is always correct.
Distractors are built to be plausible but never equal to the correct value.
"""
import random

# ─── low-level helpers ────────────────────────────────────────────────
def _bin(n):  return format(n, 'b')
def _oct(n):  return format(n, 'o')
def _hex(n):  return format(n, 'X')
def _dec(n):  return str(n)

def make_mc(question, correct, distractors, subtopic, explanation=''):
    """Assemble a 5-option MC. `correct` and `distractors` are strings.
    Pads/dedupes distractors and returns the stored answer index."""
    opts = [correct]
    for d in distractors:
        if len(opts) >= 5:
            break
        if d not in opts:
            opts.append(d)
    # never ship fewer than 5 options — pad with numeric neighbours if numeric
    filler = 1
    while len(opts) < 5:
        if correct.lstrip('-').isdigit():
            cand = str(int(correct) + filler)
        else:
            cand = f'{correct} ({filler})'
        if cand not in opts:
            opts.append(cand)
        filler += 1
    return {
        'type': 'mc', 'subtopic': subtopic, 'question': question,
        'options': opts, 'answer': 0, 'explanation': explanation,
    }
    # answer index kept at 0 here; caller shuffles via _finalize below


def _finalize(rng, q):
    """Shuffle option order and fix the answer index. Keeps data honest even
    though the front-end also shuffles at runtime."""
    correct_val = q['options'][q['answer']]
    order = q['options'][:]
    rng.shuffle(order)
    q['options'] = order
    q['answer'] = order.index(correct_val)
    return q


# ─── number-base conversions (CAT1) ───────────────────────────────────
def numberbase_pool(rng, per_kind=8):
    """Balanced pool covering binary→(8,10,16), decimal→(2,16), hex→(10,2),
    octal→10, plus binary arithmetic and bitwise ops."""
    out = []
    used = set()

    def uniq(v):
        if v in used:
            return False
        used.add(v); return True

    def near(n, base_fn, k=6):
        """distractors: neighbouring values rendered in the target base."""
        ds = []
        for delta in (1, -1, 2, -2, 3, -3, 4, 8, -4):
            m = n + delta
            if m > 0:
                ds.append(base_fn(m))
            if len(ds) >= k:
                break
        return ds

    # binary → octal / decimal / hex
    for target, fn, label in ((8, _oct, 'ฐานแปด (octal)'),
                              (10, _dec, 'ฐานสิบ'),
                              (16, _hex, 'ฐานสิบหก (hex)')):
        made = 0
        while made < per_kind:
            n = rng.randint(9, 250)
            key = ('b2', target, n)
            if not uniq(key):
                continue
            b = _bin(n)
            q = make_mc(
                f'เลขฐานสอง {b} มีค่าเท่ากับเลขใน{label}ตรงกับข้อใด',
                fn(n), near(n, fn), 'การแปลงเลขฐาน',
                f'{b}(2) = {n}(10) = {fn(n)}({target})')
            out.append(_finalize(rng, q)); made += 1

    # decimal → binary / hex
    for target, fn, label in ((2, _bin, 'ฐานสอง'), (16, _hex, 'ฐานสิบหก (hex)')):
        made = 0
        while made < per_kind:
            n = rng.randint(17, 255)
            key = ('d2', target, n)
            if not uniq(key):
                continue
            q = make_mc(
                f'เลขฐานสิบ {n} แปลงเป็นเลขใน{label}ได้ตรงกับข้อใด',
                fn(n), near(n, fn), 'การแปลงเลขฐาน',
                f'{n}(10) = {fn(n)}({target})')
            out.append(_finalize(rng, q)); made += 1

    # hex → decimal, octal → decimal
    made = 0
    while made < per_kind:
        n = rng.randint(20, 255)
        if not uniq(('h2d', n)):
            continue
        q = make_mc(
            f'เลขฐานสิบหก {_hex(n)} มีค่าเท่ากับเลขฐานสิบใด',
            _dec(n), near(n, _dec), 'การแปลงเลขฐาน',
            f'{_hex(n)}(16) = {n}(10)')
        out.append(_finalize(rng, q)); made += 1
    made = 0
    while made < per_kind:
        n = rng.randint(9, 255)
        if not uniq(('o2d', n)):
            continue
        q = make_mc(
            f'เลขฐานแปด (octal) {_oct(n)} มีค่าเท่ากับเลขฐานสิบใด',
            _dec(n), near(n, _dec), 'การแปลงเลขฐาน',
            f'{_oct(n)}(8) = {n}(10)')
        out.append(_finalize(rng, q)); made += 1

    # binary arithmetic (answer in binary)
    ops = [('+', lambda a, b: a + b), ('-', lambda a, b: a - b),
           ('*', lambda a, b: a * b)]
    made = 0
    while made < per_kind * 2:
        sym, f = rng.choice(ops)
        a = rng.randint(4, 60); b = rng.randint(2, 30)
        if sym == '-' and a <= b:
            a, b = b + rng.randint(1, 20), b
        r = f(a, b)
        if r <= 0 or not uniq(('ba', sym, a, b)):
            continue
        q = make_mc(
            f'จงหาผลลัพธ์ของ {_bin(a)} {sym} {_bin(b)} (เลขฐานสอง) แล้วตอบเป็นเลขฐานสอง',
            _bin(r), near(r, _bin), 'การคำนวณเลขฐานสอง',
            f'{a} {sym} {b} = {r} → {_bin(r)}(2)')
        out.append(_finalize(rng, q)); made += 1

    # bitwise (answer in decimal)
    bops = [('AND', '&', lambda a, b: a & b),
            ('OR', '|', lambda a, b: a | b),
            ('XOR', '^', lambda a, b: a ^ b)]
    made = 0
    while made < per_kind * 2:
        name, sym, f = rng.choice(bops)
        a = rng.randint(5, 63); b = rng.randint(5, 63)
        r = f(a, b)
        if not uniq(('bit', sym, a, b)):
            continue
        q = make_mc(
            f'จงหาผลลัพธ์ของ {a} {sym} {b} (ดำเนินการแบบ Bitwise {name}) ตอบเป็นเลขฐานสิบ',
            _dec(r), near(r, _dec) + [_dec(a & b if sym != '&' else a | b)],
            'การดำเนินการระดับบิต',
            f'{a}({_bin(a)}) {sym} {b}({_bin(b)}) = {r}')
        out.append(_finalize(rng, q)); made += 1

    return out


def _conv_mc(rng, n, base, fn, label, from_label='ฐานสอง', src_fn=_bin):
    def near(k=6):
        ds = []
        for delta in (1, -1, 2, -2, 3, -3, 4, 8, -4, 5):
            m = n + delta
            if m > 0 and fn(m) != fn(n):
                ds.append(fn(m))
            if len(ds) >= k:
                break
        return ds
    q = make_mc(
        f'เลข{from_label} {src_fn(n)} มีค่าเท่ากับเลขใน{label}ตรงกับข้อใด',
        fn(n), near(), 'การแปลงเลขฐาน',
        f'{src_fn(n)} = {n}(10) = {fn(n)}')
    return _finalize(rng, q)


def numberbase_sets(rng, n_sets=5):
    """Return n_sets lists of 5 unique number-base questions each, with a
    GUARANTEED spread: every set contains a binary→octal, binary→decimal and
    binary→hex conversion, plus two rotating extras (other conversions /
    binary arithmetic / bitwise). Directly answers the 'no base-8/10/16'
    complaint by construction."""
    used_n = {'o': set(), 'd': set(), 'h': set()}

    def pick(kind):
        while True:
            n = rng.randint(10, 250)
            if n not in used_n[kind]:
                used_n[kind].add(n); return n

    # rotating extra builders (each returns one finalized question)
    def dec2bin():
        n = rng.randint(17, 255)
        q = make_mc(f'เลขฐานสิบ {n} แปลงเป็นเลขในฐานสองได้ตรงกับข้อใด',
                    _bin(n), [_bin(n + d) for d in (1, -1, 2, -2, 4)],
                    'การแปลงเลขฐาน', f'{n}(10) = {_bin(n)}(2)')
        return _finalize(rng, q)
    def dec2hex():
        n = rng.randint(20, 255)
        q = make_mc(f'เลขฐานสิบ {n} แปลงเป็นเลขในฐานสิบหก (hex) ได้ตรงกับข้อใด',
                    _hex(n), [_hex(n + d) for d in (1, -1, 2, -2, 16)],
                    'การแปลงเลขฐาน', f'{n}(10) = {_hex(n)}(16)')
        return _finalize(rng, q)
    def hex2dec():
        n = rng.randint(20, 255)
        q = make_mc(f'เลขฐานสิบหก {_hex(n)} มีค่าเท่ากับเลขฐานสิบใด',
                    _dec(n), [_dec(n + d) for d in (1, -1, 2, -2, 16)],
                    'การแปลงเลขฐาน', f'{_hex(n)}(16) = {n}(10)')
        return _finalize(rng, q)
    def oct2dec():
        n = rng.randint(9, 250)
        q = make_mc(f'เลขฐานแปด (octal) {_oct(n)} มีค่าเท่ากับเลขฐานสิบใด',
                    _dec(n), [_dec(n + d) for d in (1, -1, 2, -2, 8)],
                    'การแปลงเลขฐาน', f'{_oct(n)}(8) = {n}(10)')
        return _finalize(rng, q)
    def b_arith():
        sym, f = rng.choice([('+', lambda a, b: a + b), ('*', lambda a, b: a * b)])
        a = rng.randint(4, 40); b = rng.randint(2, 12); r = f(a, b)
        q = make_mc(
            f'จงหาผลลัพธ์ของ {_bin(a)} {sym} {_bin(b)} (เลขฐานสอง) แล้วตอบเป็นเลขฐานสอง',
            _bin(r), [_bin(r + d) for d in (1, -1, 2, -2, 3) if r + d > 0],
            'การคำนวณเลขฐานสอง', f'{a}{sym}{b}={r} → {_bin(r)}')
        return _finalize(rng, q)
    def bitwise():
        name, sym, f = rng.choice([('AND', '&', lambda a, b: a & b),
                                   ('OR', '|', lambda a, b: a | b),
                                   ('XOR', '^', lambda a, b: a ^ b)])
        a = rng.randint(5, 63); b = rng.randint(5, 63); r = f(a, b)
        q = make_mc(
            f'จงหาผลลัพธ์ของ {a} {sym} {b} (ดำเนินการแบบ Bitwise {name}) ตอบเป็นเลขฐานสิบ',
            _dec(r), [_dec(r + d) for d in (1, -1, 2, -2, 3)],
            'การดำเนินการระดับบิต', f'{a}{sym}{b}={r}')
        return _finalize(rng, q)

    extras = [dec2bin, dec2hex, hex2dec, oct2dec, b_arith, bitwise,
              b_arith, bitwise, dec2hex, oct2dec]
    rng.shuffle(extras)

    sets = []
    ei = 0
    seen_text = set()

    def fresh(builder):
        nonlocal ei
        for _ in range(50):
            q = builder()
            if q['question'] not in seen_text:
                seen_text.add(q['question']); return q
        return q

    for s in range(n_sets):
        qs = [
            _conv_mc(rng, pick('o'), 8, _oct, 'ฐานแปด (octal)'),
            _conv_mc(rng, pick('d'), 10, _dec, 'ฐานสิบ'),
            _conv_mc(rng, pick('h'), 16, _hex, 'ฐานสิบหก (hex)'),
            fresh(extras[ei % len(extras)]),
            fresh(extras[(ei + 1) % len(extras)]),
        ]
        ei += 2
        for q in qs:
            seen_text.add(q['question'])
        sets.append(qs)
    return sets


# ─── subnetting maths (CAT4) ──────────────────────────────────────────
def subnet_pool(rng, n_hosts=14, n_split=10):
    out = []; used = set()
    # usable hosts for a given prefix (/16../30 → 15 distinct prefixes)
    made = 0; guard = 0
    while made < n_hosts and guard < 5000:
        guard += 1
        p = rng.randint(16, 29)
        if ('h', p) in used:
            continue
        used.add(('h', p))
        hosts = (1 << (32 - p)) - 2
        ds = [str(hosts + 1), str(hosts - 1), str(hosts * 2 + 2),
              str((1 << (32 - p))), str(max(1, hosts // 2))]
        q = make_mc(
            f'เครือข่ายที่มี Subnet Mask /{p} รองรับจำนวน Host ที่ใช้งานได้จริงสูงสุดกี่เครื่อง',
            str(hosts), ds, 'Subnetting',
            f'2^(32-{p}) - 2 = {hosts}')
        out.append(_finalize(rng, q)); made += 1
    # number of subnets when splitting /a → /b
    made = 0; guard = 0
    while made < n_split and guard < 5000:
        guard += 1
        a = rng.randint(12, 26); b = rng.randint(a + 1, min(a + 7, 30))
        if ('s', a, b) in used:
            continue
        used.add(('s', a, b))
        cnt = 1 << (b - a)
        ds = [str(max(1, cnt // 2)), str(cnt * 2), str(b - a), str(cnt + 1)]
        q = make_mc(
            f'หากแบ่ง Subnet จาก /{a} เป็น /{b} จะได้ Subnet ทั้งหมดกี่วง',
            str(cnt), ds, 'Subnetting',
            f'2^({b}-{a}) = {cnt}')
        out.append(_finalize(rng, q)); made += 1
    return out


# ─── number series & probability & arithmetic (CAT7 / CAT3) ───────────
def series_pool(rng, n=30):
    out = []; used = set()
    builders = []

    # arithmetic progression
    def ap():
        a = rng.randint(2, 12); d = rng.randint(2, 15)
        seq = [a + d * i for i in range(4)]
        return seq, seq[-1] + d
    # geometric
    def gp():
        a = rng.randint(1, 4); r = rng.choice([2, 3])
        seq = [a * r ** i for i in range(4)]
        return seq, seq[-1] * r
    # squares
    def sq():
        s = rng.randint(2, 9)
        seq = [(s + i) ** 2 for i in range(4)]
        return seq, (s + 4) ** 2
    # fibonacci-like
    def fib():
        a = rng.randint(1, 5); b = rng.randint(a, a + 6)
        seq = [a, b, a + b, a + 2 * b]
        return seq, 2 * a + 3 * b
    # add increasing
    def tri():
        a = rng.randint(1, 6); step = rng.randint(1, 4)
        seq = [a]; inc = step
        for _ in range(3):
            seq.append(seq[-1] + inc); inc += step
        return seq, seq[-1] + inc

    builders = [ap, gp, sq, fib, tri]
    while len(out) < n:
        seq, ans = rng.choice(builders)()
        key = tuple(seq)
        if key in used or ans <= 0:
            continue
        used.add(key)
        ds = [str(ans + rng.choice([1, 2, 3])), str(ans - rng.choice([1, 2, 3])),
              str(ans + rng.choice([5, 6, 7])), str(int(ans * 1.5) + 1)]
        q = make_mc(
            f"จากอนุกรม {', '.join(map(str, seq))}, ... ตัวเลขถัดไปคือข้อใด",
            str(ans), ds, 'อนุกรมตัวเลข',
            f'รูปแบบให้ผลลัพธ์ = {ans}')
        out.append(_finalize(rng, q))
    return out


def _pick_distinct(rng, correct, candidates, k=4):
    """Return k distinct distractors, none equal to `correct`."""
    pool = [c for c in dict.fromkeys(candidates) if c != correct]
    return pool[:k]


def probability_pool(rng, n=12):
    out = []; used = set()

    def coins():
        k = rng.randint(2, 4)
        correct = f'1/{2**k}'
        cands = [f'1/{2**(k-1)}', f'1/{2**(k+1)}', f'{k}/{2**k}',
                 f'1/{2*k}', '1/2', f'3/{2**k}']
        return (f'โยนเหรียญ {k} เหรียญพร้อมกัน โอกาสที่จะออกหัวทั้งหมดเท่ากับเท่าใด',
                correct, cands)
    def dice():
        t = rng.choice([('ออกเลขคู่', '1/2'), ('ออกเลข 6', '1/6'),
                        ('ออกเลขมากกว่า 4', '1/3'), ('ออกเลขเฉพาะ (2, 3, 5)', '1/2'),
                        ('ออกเลข 1 หรือ 2', '1/3')])
        return (f'ทอยลูกเต๋า 1 ลูก โอกาสที่จะ{t[0]}เท่ากับเท่าใด',
                t[1], ['1/6', '1/4', '2/3', '5/6', '1/2', '1/3'])
    def cards():
        t = rng.choice([('ไพ่โพแดง (Hearts)', '1/4'), ('ไพ่เอซ (Ace)', '1/13'),
                        ('ไพ่หน้า J/Q/K', '3/13'), ('ไพ่สีดำ', '1/2')])
        return (f'หยิบไพ่ 1 ใบจากสำรับ 52 ใบ โอกาสที่จะได้{t[0]}เท่ากับเท่าใด',
                t[1], ['1/4', '1/13', '1/52', '1/2', '3/13', '1/26'])

    templates = [coins, dice, cards]
    guard = 0
    while len(out) < n and guard < 800:
        guard += 1
        qtext, correct, cands = rng.choice(templates)()
        if qtext in used:
            continue
        ds = _pick_distinct(rng, correct, cands, 4)
        if len(ds) < 4:
            continue
        used.add(qtext)
        q = make_mc(qtext, correct, ds, 'ความน่าจะเป็น', '')
        out.append(_finalize(rng, q))
    return out


def modular_pool(rng, n=8):
    """Applied maths: modulo / remainder / gcd style (CAT3)."""
    out = []; used = set()
    guard = 0
    while len(out) < n and guard < 800:
        guard += 1
        kind = rng.choice(['mod', 'pow2', 'bytes'])
        if kind == 'mod':
            a = rng.randint(50, 400); m = rng.choice([7, 8, 16, 12, 10])
            key = ('mod', a, m)
            if key in used:
                continue
            used.add(key)
            r = a % m
            q = make_mc(f'{a} mod {m} มีค่าเท่ากับเท่าใด', str(r),
                        [str((r + 1) % m), str((r + 2) % m), str(m - r if m != r else 0), str(r + m)],
                        'เลขคณิตมอดุลาร์', f'{a} หารด้วย {m} เหลือเศษ {r}')
        elif kind == 'pow2':
            k = rng.randint(6, 16)
            key = ('p2', k)
            if key in used:
                continue
            used.add(key)
            v = 1 << k
            q = make_mc(f'2 ยกกำลัง {k} มีค่าเท่ากับเท่าใด', str(v),
                        [str(v * 2), str(v // 2), str(v + 2), str(v - 1)],
                        'เลขยกกำลังสอง', f'2^{k} = {v}')
        else:
            kb = rng.choice([2, 4, 8, 16, 32, 64])
            key = ('by', kb)
            if key in used:
                continue
            used.add(key)
            bits = kb * 8
            q = make_mc(f'ข้อมูลขนาด {kb} ไบต์ มีทั้งหมดกี่บิต', str(bits),
                        [str(kb), str(bits // 2), str(bits * 2), str(kb * 4)],
                        'หน่วยข้อมูล', f'{kb} ไบต์ × 8 = {bits} บิต')
        out.append(_finalize(rng, q))
    return out
