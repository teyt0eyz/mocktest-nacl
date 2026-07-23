/* ══════════════════════════════════════════════════════════
   NACL Mock Test — application logic
   Data source: nacl_mocktest_data.json
   ══════════════════════════════════════════════════════════ */
(() => {
'use strict';

/* ─── constants ───────────────────────────────────────── */
const DATA_URL = 'nacl_mocktest_data.json';
const POINTS   = { mc: 2, ms: 5, written: 5 };   // 115*2 + 10*5 + 5*5 = 305
const LETTERS  = ['ก', 'ข', 'ค', 'ง', 'จ', 'ฉ', 'ช', 'ซ'];
const LS = { active: 'nacl.attempt.v1', history: 'nacl.history.v1', prefs: 'nacl.prefs.v1' };
const TYPE_LABEL = { mc: 'ปรนัย 5 ตัวเลือก', ms: 'เลือกหลายคำตอบ', written: 'เขียนตอบ' };

/* ─── state ───────────────────────────────────────────── */
let DATA = null;
let attempt = null;         // live attempt
let result  = null;         // graded result being displayed
let timerId = null;
let reviewFilter = 'wrong';
const draft = { mode: 'full', setId: 1, catIndex: 4 };

/* ─── tiny helpers ────────────────────────────────────── */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

function store(key, val) {
  try {
    if (val === undefined) { const r = localStorage.getItem(key); return r ? JSON.parse(r) : null; }
    if (val === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(val));
  } catch (_) { return null; }
}

function fmtTime(sec) {
  sec = Math.max(0, Math.round(sec));
  const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60;
  const pad = n => String(n).padStart(2, '0');
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

function fmtDate(ts) {
  return new Date(ts).toLocaleString('th-TH',
    { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

/* Fisher–Yates */
function shuffled(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Normalise a written answer for comparison: trim, lowercase, collapse spaces. */
const normWritten = s => String(s ?? '').trim().toLowerCase().replace(/\s+/g, ' ');

/* ─── view routing ────────────────────────────────────── */
function show(name) {
  $$('.view').forEach(v => v.classList.toggle('is-active', v.id === `view-${name}`));
  window.scrollTo(0, 0);
}

/* ══════════════════════════════════════════════════════
   BUILDING AN ATTEMPT
   ══════════════════════════════════════════════════════ */

/* Flatten one question into the shape the runner uses. */
function pack(q, catName) {
  return {
    qid: q.id, type: q.type, cat: catName, subtopic: q.subtopic || '',
    question: q.question,
    options: q.options ? q.options.slice() : null,
    answer: Array.isArray(q.answer) ? q.answer.slice() : q.answer,
    explanation: q.explanation || '',
    points: POINTS[q.type] ?? 0
  };
}

/* Re-order options and remap the answer indices accordingly. */
function shuffleOptions(item) {
  if (!item.options) return item;
  const order = shuffled(item.options.map((_, i) => i));   // order[new] = old
  const back  = new Map(order.map((oldI, newI) => [oldI, newI]));
  item.options = order.map(i => item.options[i]);
  item.answer  = Array.isArray(item.answer)
    ? item.answer.map(i => back.get(i)).sort((a, b) => a - b)
    : back.get(item.answer);
  return item;
}

function buildFullSet(setId) {
  const set = DATA.sets.find(s => s.set_id === setId);
  const items = [];
  set.categories.forEach(c => c.questions.forEach(q => items.push(pack(q, c.name))));
  return { items, label: `ข้อสอบ${set.set_name}`, setId };
}

/* Mixed set: same per-category question-type counts as the blueprint,
   drawn from all 5 sets with duplicate question texts removed. */
function buildMixSet() {
  const template = DATA.sets[0].categories;
  const items = [];
  template.forEach((cat, ci) => {
    const pool = [];
    const seen = new Set();
    DATA.sets.forEach(s => s.categories[ci].questions.forEach(q => {
      const key = normWritten(q.question);
      if (seen.has(key)) return;
      seen.add(key);
      pool.push(q);
    }));
    const byType = { mc: [], ms: [], written: [] };
    shuffled(pool).forEach(q => byType[q.type]?.push(q));
    Object.entries(cat.question_counts).forEach(([type, n]) => {
      byType[type].slice(0, n).forEach(q => items.push(pack(q, cat.name)));
    });
  });
  return { items, label: 'สุ่มคละจากทั้ง 5 ชุด', setId: null };
}

/* Category drill: unique questions of one category pulled from every set. */
function buildCategorySet(catIndex, limit) {
  const name = DATA.sets[0].categories[catIndex].name;
  const seen = new Set(), pool = [];
  DATA.sets.forEach(s => s.categories[catIndex].questions.forEach(q => {
    const key = normWritten(q.question);
    if (seen.has(key)) return;
    seen.add(key);
    pool.push(pack(q, name));
  }));
  const picked = shuffled(pool);
  return {
    items: limit > 0 ? picked.slice(0, limit) : picked,
    label: `ฝึกรายหมวด · ${name}`, setId: null
  };
}

function countCategoryPool(catIndex) {
  const seen = new Set();
  DATA.sets.forEach(s => s.categories[catIndex].questions.forEach(q => seen.add(normWritten(q.question))));
  return seen.size;
}

function startAttempt() {
  const opts = {
    penalty:  $('#optPenalty').checked,
    msRule:   $('#msRule').value,
    instant:  $('#optInstant').checked,
    autoNext: $('#optAutoNext').checked,
    shuffleQ: $('#optShuffleQ').checked,
    shuffleO: $('#optShuffleO').checked
  };
  const minutes = Number($('#timeLimit').value);

  let built;
  if (draft.mode === 'full')      built = buildFullSet(draft.setId);
  else if (draft.mode === 'mix')  built = buildMixSet();
  else                            built = buildCategorySet(draft.catIndex, Number($('#catCount').value));

  if (!built.items.length) { alert('ไม่พบคำถามในหมวดที่เลือก'); return; }

  let items = built.items;
  if (opts.shuffleQ) items = shuffled(items);
  if (opts.shuffleO) items = items.map(shuffleOptions);

  attempt = {
    id: Date.now(), mode: draft.mode, label: built.label, setId: built.setId,
    opts, limitSec: minutes * 60,
    startedAt: Date.now(), elapsed: 0,
    items, answers: {}, flags: {}, revealed: {}, current: 0
  };
  saveActive();
  show('exam');
  renderExam();
  startTimer();
}

/* ══════════════════════════════════════════════════════
   PERSISTENCE
   ══════════════════════════════════════════════════════ */
function saveActive() { if (attempt) store(LS.active, attempt); }
const loadActive  = () => store(LS.active);
const clearActive = () => store(LS.active, null);
const getHistory  = () => store(LS.history) || [];

function pushHistory(entry) {
  const h = getHistory();
  h.unshift(entry);
  store(LS.history, h.slice(0, 60));
}

function savePrefs() {
  store(LS.prefs, {
    timeLimit: $('#timeLimit').value, msRule: $('#msRule').value,
    penalty: $('#optPenalty').checked, instant: $('#optInstant').checked,
    autoNext: $('#optAutoNext').checked,
    shuffleQ: $('#optShuffleQ').checked, shuffleO: $('#optShuffleO').checked
  });
}

function loadPrefs() {
  const p = store(LS.prefs);
  if (!p) return;
  if (p.timeLimit != null) $('#timeLimit').value = p.timeLimit;
  if (p.msRule)            $('#msRule').value = p.msRule;
  $('#optPenalty').checked  = p.penalty !== false;
  $('#optAutoNext').checked = p.autoNext !== false;
  $('#optInstant').checked  = !!p.instant;
  $('#optShuffleQ').checked = !!p.shuffleQ;
  $('#optShuffleO').checked = !!p.shuffleO;
}

/* ══════════════════════════════════════════════════════
   TIMER
   ══════════════════════════════════════════════════════ */
function startTimer() {
  stopTimer();
  timerId = setInterval(() => {
    if (!attempt) return stopTimer();
    attempt.elapsed++;
    paintTimer();
    if (attempt.elapsed % 10 === 0) saveActive();
    if (attempt.limitSec && attempt.elapsed >= attempt.limitSec) {
      stopTimer();
      finish(true);
    }
  }, 1000);
  paintTimer();
}
function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }

function paintTimer() {
  const el = $('#timer');
  if (!attempt) return;
  el.classList.remove('is-warn', 'is-danger');
  if (attempt.limitSec) {
    const left = attempt.limitSec - attempt.elapsed;
    el.textContent = fmtTime(left);
    el.title = 'เวลาที่เหลือ';
    if (left <= 60) el.classList.add('is-danger');
    else if (left <= 300) el.classList.add('is-warn');
  } else {
    el.textContent = fmtTime(attempt.elapsed);
    el.title = 'เวลาที่ใช้ไป';
  }
}

/* ══════════════════════════════════════════════════════
   GRADING
   ══════════════════════════════════════════════════════ */
function isBlank(item, ans) {
  if (ans === undefined || ans === null) return true;
  if (item.type === 'ms') return !Array.isArray(ans) || ans.length === 0;
  if (item.type === 'written') return normWritten(ans) === '';
  return false;
}

/* Returns { state:'correct'|'wrong'|'blank', score } for one question. */
function gradeOne(item, ans, opts) {
  if (isBlank(item, ans)) return { state: 'blank', score: 0 };

  if (item.type === 'mc') {
    const ok = ans === item.answer;
    return { state: ok ? 'correct' : 'wrong', score: ok ? POINTS.mc : (opts.penalty ? -1 : 0) };
  }

  if (item.type === 'ms') {
    const correct = new Set(item.answer);
    const picked  = new Set(ans);
    const hit  = [...picked].filter(i => correct.has(i)).length;
    const miss = [...picked].filter(i => !correct.has(i)).length;
    const exact = hit === correct.size && miss === 0;
    if (opts.msRule === 'partial') {
      const ratio = clamp((hit - miss) / correct.size, 0, 1);
      return { state: exact ? 'correct' : (ratio > 0 ? 'partial' : 'wrong'),
               score: Math.round(POINTS.ms * ratio * 10) / 10 };
    }
    return { state: exact ? 'correct' : 'wrong', score: exact ? POINTS.ms : 0 };
  }

  // written — case-insensitive, whitespace-tolerant
  const ok = normWritten(ans) === normWritten(item.answer);
  return { state: ok ? 'correct' : 'wrong', score: ok ? POINTS.written : 0 };
}

function grade(a) {
  const perQ = a.items.map((item, i) => {
    const g = gradeOne(item, a.answers[i], a.opts);
    return { i, item, given: a.answers[i], ...g };
  });
  const cats = new Map();
  perQ.forEach(r => {
    if (!cats.has(r.item.cat)) cats.set(r.item.cat, { name: r.item.cat, max: 0, score: 0, correct: 0, wrong: 0, blank: 0, n: 0 });
    const c = cats.get(r.item.cat);
    c.n++; c.max += r.item.points; c.score += r.score;
    if (r.state === 'correct') c.correct++;
    else if (r.state === 'blank') c.blank++;
    else c.wrong++;
  });
  const max = perQ.reduce((s, r) => s + r.item.points, 0);
  const raw = perQ.reduce((s, r) => s + r.score, 0);
  const score = Math.round(raw * 10) / 10;
  return {
    perQ, cats: [...cats.values()], max, score,
    pct: max ? clamp(score / max * 100, 0, 100) : 0,
    correct: perQ.filter(r => r.state === 'correct').length,
    partial: perQ.filter(r => r.state === 'partial').length,
    wrong:   perQ.filter(r => r.state === 'wrong').length,
    blank:   perQ.filter(r => r.state === 'blank').length,
    total:   perQ.length,
    elapsed: a.elapsed, label: a.label, mode: a.mode, finishedAt: Date.now()
  };
}

/* ══════════════════════════════════════════════════════
   HOME SCREEN
   ══════════════════════════════════════════════════════ */
function renderHome() {
  const info = DATA.exam_info;
  const hist = getHistory();
  const best = hist.length ? Math.max(...hist.map(h => h.pct)) : null;

  $('#heroStats').innerHTML = [
    ['5', 'ชุดข้อสอบ'],
    [String(info.total_questions), 'ข้อ / ชุด'],
    [String(info.total_score), 'คะแนนเต็ม'],
    [best === null ? '—' : Math.round(best) + '%', 'สถิติดีที่สุด']
  ].map(([b, s]) => `<div class="hstat"><b>${b}</b><span>${s}</span></div>`).join('');

  // set cards
  const doneSets = new Set(hist.filter(h => h.mode === 'full' && h.setId).map(h => h.setId));
  $('#setGrid').innerHTML = DATA.sets.map(s => {
    const n = s.categories.reduce((t, c) => t + c.questions.length, 0);
    const pts = s.categories.reduce((t, c) => t + c.points_total, 0);
    return `<button class="set-card${s.set_id === draft.setId ? ' is-on' : ''}" data-set="${s.set_id}" type="button" role="radio" aria-checked="${s.set_id === draft.setId}">
      <b>${esc(s.set_name)}</b>
      <span class="set-meta">${n} ข้อ · ${pts} คะแนน · 8 หมวด</span>
      ${doneSets.has(s.set_id) ? '<span class="set-badge">เคยทำแล้ว</span>' : ''}
    </button>`;
  }).join('');

  // category rows
  $('#catList').innerHTML = DATA.sets[0].categories.map((c, i) => {
    const pool = countCategoryPool(i);
    return `<button class="cat-row${i === draft.catIndex ? ' is-on' : ''}" data-cat="${i}" type="button" role="radio" aria-checked="${i === draft.catIndex}">
      <span class="cat-num">${i + 1}</span>
      <span class="cat-name">${esc(c.name)}</span>
      <span class="cat-pts">${c.points_total} คะแนน · คลัง ${pool} ข้อ</span>
    </button>`;
  }).join('');

  renderResume();
  updateStartSummary();
}

function renderResume() {
  const a = loadActive();
  const bar = $('#resumeBar');
  if (!a) { bar.hidden = true; return; }
  const answered = Object.keys(a.answers || {}).length;
  bar.hidden = false;
  $('#resumeMeta').textContent = ` — ${a.label} · ตอบแล้ว ${answered}/${a.items.length} ข้อ · เริ่มเมื่อ ${fmtDate(a.startedAt)}`;
}

function updateStartSummary() {
  const el = $('#startSummary');
  let n, pts, what;
  if (draft.mode === 'full') {
    const set = DATA.sets.find(s => s.set_id === draft.setId);
    n = set.categories.reduce((t, c) => t + c.questions.length, 0);
    pts = set.categories.reduce((t, c) => t + c.points_total, 0);
    what = set.set_name;
  } else if (draft.mode === 'mix') {
    n = 130; pts = 305; what = 'สุ่มคละทุกชุด';
  } else {
    const limit = Number($('#catCount').value);
    const pool = countCategoryPool(draft.catIndex);
    n = limit > 0 ? Math.min(limit, pool) : pool;
    what = DATA.sets[0].categories[draft.catIndex].name;
    pts = null;
  }
  const t = Number($('#timeLimit').value);
  const time = t ? `${t} นาที` : 'ไม่จำกัดเวลา';
  el.innerHTML = `กำลังจะเริ่ม: <b>${esc(what)}</b> · <b>${n}</b> ข้อ${pts ? ` · เต็ม <b>${pts}</b> คะแนน` : ''} · ${time}`;
}

function setMode(mode) {
  draft.mode = mode;
  $$('.mode-card').forEach(b => {
    const on = b.dataset.mode === mode;
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-checked', on);
  });
  $('#setPicker').hidden = mode === 'category';
  $('#catPicker').hidden = mode !== 'category';
  if (mode === 'mix') $('#setPicker').hidden = true;
  updateStartSummary();
}

/* ══════════════════════════════════════════════════════
   EXAM SCREEN
   ══════════════════════════════════════════════════════ */
function renderExam() {
  $('#examTitle').textContent = attempt.label;
  renderQuestion();
  renderPalette();
  paintTimer();
}

function answeredCount() { return attempt.items.filter((_, i) => !isBlank(attempt.items[i], attempt.answers[i])).length; }

function renderQuestion() {
  const i = attempt.current;
  const item = attempt.items[i];
  const given = attempt.answers[i];
  const revealed = attempt.opts.instant && attempt.revealed[i];
  const g = revealed ? gradeOne(item, given, attempt.opts) : null;

  $('#examCat').textContent = item.cat;

  const tag = item.type === 'ms' ? '<span class="tag tag-ms">เลือกได้หลายคำตอบ</span>'
            : item.type === 'written' ? '<span class="tag tag-wr">เขียนตอบ</span>'
            : '<span class="tag">ปรนัย</span>';

  let body;
  if (item.type === 'written') {
    body = `<input class="written-in" id="writtenIn" type="text" autocomplete="off" spellcheck="false"
              placeholder="พิมพ์คำตอบของคุณ" value="${esc(given ?? '')}" ${revealed ? 'disabled' : ''}>
            <p class="hint">ตรวจคำตอบแบบไม่สนตัวพิมพ์เล็ก/ใหญ่ และตัดช่องว่างหัวท้ายให้อัตโนมัติ</p>`;
  } else {
    const multi = item.type === 'ms';
    const picked = multi ? new Set(given || []) : null;
    const correct = new Set(Array.isArray(item.answer) ? item.answer : [item.answer]);
    body = `<div class="opts" role="${multi ? 'group' : 'radiogroup'}">` + item.options.map((opt, oi) => {
      const on = multi ? picked.has(oi) : given === oi;
      let cls = 'opt' + (multi ? ' ms' : '') + (on ? ' is-on' : '');
      let mark = '';
      if (revealed) {
        if (correct.has(oi)) cls += ' is-correct';
        else if (on) cls += ' is-wrong';
        // distinguish "you picked this" from "this was correct but you missed it"
        if (on && correct.has(oi))       mark = '<span class="opt-mark ok">✓ คุณเลือก</span>';
        else if (on)                     mark = '<span class="opt-mark bad">✕ คุณเลือก</span>';
        else if (correct.has(oi))        mark = `<span class="opt-mark ok">${multi ? 'ตกหล่น — ต้องเลือกด้วย' : 'เฉลย'}</span>`;
      }
      return `<button class="${cls}" data-opt="${oi}" type="button" ${revealed ? 'disabled' : ''}
                aria-pressed="${on}">
                <span class="opt-key">${LETTERS[oi] || oi + 1}</span>
                <span class="opt-text">${esc(opt)}</span>
                ${mark}
              </button>`;
    }).join('') + '</div>';
  }

  // ms/written can't self-reveal on click, so give them an explicit check button
  let checkBtn = '';
  if (attempt.opts.instant && !revealed && item.type !== 'mc') {
    checkBtn = `<button class="btn btn-quiet check-btn" id="checkBtn" type="button"
                  ${isBlank(item, given) ? 'disabled' : ''}>ตรวจคำตอบข้อนี้</button>`;
  }

  let feedback = '';
  if (revealed) {
    const ok = g.state === 'correct';
    const correctText = item.type === 'written'
      ? esc(item.answer)
      : (Array.isArray(item.answer) ? item.answer : [item.answer]).map(x => `${LETTERS[x] || x + 1}. ${esc(item.options[x])}`).join(' / ');
    feedback = `<div class="feedback ${ok ? 'ok' : 'bad'}">
      <b>${ok ? '✓ ตอบถูก' : g.state === 'partial' ? '◐ ถูกบางส่วน' : '✕ ตอบผิด'} · ${g.score > 0 ? '+' : ''}${g.score} คะแนน</b>
      เฉลย: ${correctText}
      ${item.explanation ? `<div class="exp">${esc(item.explanation)}</div>` : ''}
    </div>`;
  }

  $('#qcard').innerHTML = `
    <div class="q-top">
      <span class="q-index">ข้อ ${i + 1}<span class="muted" style="font-weight:500"> / ${attempt.items.length}</span></span>
      ${tag}
      <span class="tag">${item.points} คะแนน</span>
      ${item.subtopic ? `<span class="tag tag-sub">${esc(item.subtopic)}</span>` : ''}
    </div>
    <h2 class="q-text">${esc(item.question)}</h2>
    ${body}
    ${checkBtn}
    ${feedback}`;

  if (item.type === 'written') {
    const inp = $('#writtenIn');
    if (inp) {
      inp.addEventListener('input', e => {
        setAnswer(i, e.target.value);
        const cb = $('#checkBtn');
        if (cb) cb.disabled = isBlank(item, e.target.value);
      });
      inp.addEventListener('keydown', e => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        if (attempt.opts.instant) reveal(i); else go(1);
      });
    }
  }
  $('#checkBtn')?.addEventListener('click', () => reveal(i));

  $('#prevBtn').disabled = i === 0;
  $('#nextBtn').textContent = i === attempt.items.length - 1 ? 'ข้อสุดท้ายแล้ว' : 'ข้อถัดไป →';
  $('#nextBtn').disabled = i === attempt.items.length - 1;
  $('#flagBtn').classList.toggle('is-on', !!attempt.flags[i]);

  const done = answeredCount();
  const pct = done / attempt.items.length * 100;
  $('#progFill').style.width = pct + '%';
  $('#progText').textContent = `ตอบแล้ว ${done} จาก ${attempt.items.length} ข้อ (${Math.round(pct)}%)`;
}

function setAnswer(i, value) {
  const item = attempt.items[i];
  if (isBlank(item, value)) delete attempt.answers[i];
  else attempt.answers[i] = value;
  saveActive();
  renderPalette();
  const done = answeredCount();
  $('#progFill').style.width = (done / attempt.items.length * 100) + '%';
  $('#progText').textContent = `ตอบแล้ว ${done} จาก ${attempt.items.length} ข้อ (${Math.round(done / attempt.items.length * 100)}%)`;
}

function reveal(i) {
  if (isBlank(attempt.items[i], attempt.answers[i])) return;
  attempt.revealed[i] = true;
  saveActive();
  renderQuestion();
}

function pickOption(oi) {
  const i = attempt.current;
  const item = attempt.items[i];
  if (attempt.opts.instant && attempt.revealed[i]) return;

  if (item.type === 'ms') {
    const cur = new Set(attempt.answers[i] || []);
    cur.has(oi) ? cur.delete(oi) : cur.add(oi);
    setAnswer(i, [...cur].sort((a, b) => a - b));
    renderQuestion();
    return;
  }
  setAnswer(i, oi);
  if (attempt.opts.instant) { reveal(i); return; }

  renderQuestion();
  if (attempt.opts.autoNext) {
    // brief pause so the selection is visible before moving on
    setTimeout(() => { if (attempt && attempt.current === i) go(1); }, 220);
  }
}

function go(delta) {
  const next = clamp(attempt.current + delta, 0, attempt.items.length - 1);
  if (next === attempt.current) return;
  attempt.current = next;
  saveActive();
  renderQuestion();
  renderPalette();
  closePalette();
}

function jumpTo(i) {
  attempt.current = clamp(i, 0, attempt.items.length - 1);
  saveActive();
  renderQuestion();
  renderPalette();
  closePalette();
}

function renderPalette() {
  const groups = [];
  attempt.items.forEach((item, i) => {
    let g = groups[groups.length - 1];
    if (!g || g.cat !== item.cat) { g = { cat: item.cat, idx: [] }; groups.push(g); }
    g.idx.push(i);
  });
  $('#paletteBody').innerHTML = groups.map(g => `
    <div class="pal-cat">${esc(g.cat)}</div>
    <div class="pal-grid">${g.idx.map(i => {
      const done = !isBlank(attempt.items[i], attempt.answers[i]);
      const cls = ['pal-btn', attempt.flags[i] ? 'flag' : (done ? 'done' : ''), i === attempt.current ? 'cur' : ''].filter(Boolean).join(' ');
      return `<button class="${cls}" data-jump="${i}" type="button" aria-label="ไปยังข้อ ${i + 1}">${i + 1}</button>`;
    }).join('')}</div>`).join('');
}

function openPalette() { $('#palette').classList.add('is-open'); $('#scrim').hidden = false; $('#paletteBtn').setAttribute('aria-expanded', 'true'); }
function closePalette() { $('#palette').classList.remove('is-open'); $('#scrim').hidden = true; $('#paletteBtn').setAttribute('aria-expanded', 'false'); }

/* ══════════════════════════════════════════════════════
   FINISH & RESULT
   ══════════════════════════════════════════════════════ */
function confirmSubmit() {
  const blank = attempt.items.length - answeredCount();
  const flagged = Object.values(attempt.flags).filter(Boolean).length;
  const lines = [];
  if (blank) lines.push(`<li>ยังไม่ได้ตอบ <b>${blank}</b> ข้อ (ได้ 0 คะแนน)</li>`);
  if (flagged) lines.push(`<li>ทำเครื่องหมายไว้ทบทวน <b>${flagged}</b> ข้อ</li>`);
  modal({
    title: 'ยืนยันการส่งคำตอบ?',
    body: lines.length ? `<ul style="margin:0;padding-left:1.15rem">${lines.join('')}</ul>` : 'คุณตอบครบทุกข้อแล้ว พร้อมส่งคำตอบ',
    ok: 'ส่งคำตอบ',
    onOk: () => finish(false)
  });
}

function finish(byTimeout) {
  stopTimer();
  result = grade(attempt);
  result.setId = attempt.setId;
  result.timedOut = !!byTimeout;
  pushHistory({
    id: attempt.id, label: result.label, mode: result.mode, setId: attempt.setId,
    score: result.score, max: result.max, pct: result.pct, total: result.total,
    correct: result.correct, wrong: result.wrong, blank: result.blank,
    elapsed: result.elapsed, finishedAt: result.finishedAt
  });
  clearActive();
  attempt = null;
  renderResult();
  show('result');
}

function scoreLevel(pct) {
  return pct >= 75 ? 'lv-hi' : pct >= 50 ? 'lv-mid' : pct >= 30 ? 'lv-low' : 'lv-bad';
}

function verdict(pct) {
  if (pct >= 80) return ['ยอดเยี่ยม! 🎉', 'ระดับนี้พร้อมลงสนามจริงแล้ว รักษาความสม่ำเสมอไว้'];
  if (pct >= 65) return ['ทำได้ดีมาก 👍', 'อีกนิดเดียว ลองไล่อุดหมวดที่คะแนนต่ำสุดด้านล่าง'];
  if (pct >= 50) return ['ผ่านครึ่งทางแล้ว 💪', 'เน้นฝึกรายหมวดที่ยังต่ำกว่า 50% จะขยับคะแนนได้เร็วที่สุด'];
  if (pct >= 30) return ['ยังต้องซ้อมอีกหน่อย 📚', 'ลองใช้โหมดฝึกรายหมวดกับ Networks และ Cloud ซึ่งมีน้ำหนักคะแนนสูงสุด'];
  return ['เริ่มต้นกันใหม่ 🌱', 'ค่อย ๆ ไล่ทีละหมวดด้วยโหมดฝึกรายหมวด แล้วกลับมาทำเต็มชุดอีกครั้ง'];
}

function renderResult() {
  const r = result;
  const [title, tip] = verdict(r.pct);
  const negNote = r.score < 0 ? ' (ติดลบจากการหักคะแนนข้อที่ตอบผิด)' : '';

  $('#resultHero').innerHTML = `
    <div class="score-ring" style="--pct:${r.pct}%">
      <div><b>${r.score}</b><small>จาก ${r.max} คะแนน</small></div>
    </div>
    <div class="result-info">
      <h2>${title}</h2>
      <p class="result-sub">${esc(r.label)} · ทำได้ <b>${r.pct.toFixed(1)}%</b>${negNote} · ใช้เวลา ${fmtTime(r.elapsed)}${r.timedOut ? ' · <b>หมดเวลา</b>' : ''}</p>
      <div class="chips">
        <span class="chip ok"><b>${r.correct}</b>ตอบถูก</span>
        ${r.partial ? `<span class="chip neu"><b>${r.partial}</b>ถูกบางส่วน</span>` : ''}
        <span class="chip bad"><b>${r.wrong}</b>ตอบผิด</span>
        <span class="chip neu"><b>${r.blank}</b>ไม่ได้ตอบ</span>
        <span class="chip neu"><b>${r.total}</b>ข้อทั้งหมด</span>
      </div>
      <p class="muted" style="margin:1rem 0 0;font-size:.9rem">${tip}</p>
    </div>`;

  const sorted = r.cats.slice().sort((a, b) => (a.score / a.max) - (b.score / b.max));
  $('#catBreakdown').innerHTML = `<div class="cat-bars">${sorted.map(c => {
    const pct = c.max ? clamp(c.score / c.max * 100, 0, 100) : 0;
    return `<div class="cat-bar-row">
      <span class="name">${esc(c.name)}</span>
      <span class="val">${c.score}/${c.max} · ${Math.round(pct)}%</span>
      <span class="track"><i class="${scoreLevel(pct)}" style="width:${pct}%"></i></span>
      <span class="muted" style="grid-column:1/-1;font-size:.79rem">ถูก ${c.correct} · ผิด ${c.wrong} · ไม่ตอบ ${c.blank} จาก ${c.n} ข้อ</span>
    </div>`;
  }).join('')}</div>`;

  renderReview();
}

function renderReview() {
  const rows = result.perQ.filter(r =>
    reviewFilter === 'all' ? true :
    reviewFilter === 'blank' ? r.state === 'blank' :
    r.state === 'wrong' || r.state === 'partial');

  if (!rows.length) {
    $('#reviewList').innerHTML = `<div class="card empty"><div class="big">🎯</div>
      ไม่มีข้อในหมวดนี้ — ${reviewFilter === 'wrong' ? 'คุณไม่ได้ตอบผิดเลย เยี่ยมมาก!' : 'คุณตอบครบทุกข้อ'}</div>`;
    return;
  }

  $('#reviewList').innerHTML = rows.map(r => {
    const it = r.item;
    const cls = r.state === 'correct' ? 'rv-ok' : r.state === 'blank' ? 'rv-blank' : 'rv-bad';
    const label = { correct: '✓ ตอบถูก', wrong: '✕ ตอบผิด', blank: '— ไม่ได้ตอบ', partial: '◐ ถูกบางส่วน' }[r.state];

    const fmtIdx = v => (Array.isArray(v) ? v : [v]).map(x => `${LETTERS[x] || x + 1}. ${esc(it.options[x])}`).join('<br>');
    const yours = r.state === 'blank' ? '<span class="muted">ไม่ได้ตอบ</span>'
                : it.type === 'written' ? esc(r.given)
                : fmtIdx(r.given);
    const right = it.type === 'written' ? esc(it.answer) : fmtIdx(it.answer);

    return `<article class="card rv ${cls}">
      <div class="rv-head">
        <span class="tag">ข้อ ${r.i + 1}</span>
        <span class="${r.state === 'correct' ? 'txt-ok' : r.state === 'blank' ? 'muted' : 'txt-bad'}">${label}</span>
        <span class="tag tag-sub">${esc(it.cat)}</span>
        ${it.subtopic ? `<span class="tag tag-sub">${esc(it.subtopic)}</span>` : ''}
        <span class="rv-score ${r.score > 0 ? 'txt-ok' : r.score < 0 ? 'txt-bad' : 'muted'}">${r.score > 0 ? '+' : ''}${r.score} / ${it.points}</span>
      </div>
      <p class="rv-q">${esc(it.question)}</p>
      <div class="rv-ans">
        <div><span>คำตอบคุณ</span><span class="${r.state === 'correct' ? 'txt-ok' : r.state === 'blank' ? '' : 'txt-bad'}">${yours}</span></div>
        <div><span>เฉลย</span><span class="txt-ok">${right}</span></div>
      </div>
      ${it.explanation ? `<div class="rv-exp"><b>คำอธิบาย:</b> ${esc(it.explanation)}</div>` : ''}
    </article>`;
  }).join('');
}

/* ══════════════════════════════════════════════════════
   HISTORY
   ══════════════════════════════════════════════════════ */
function renderHistory() {
  const h = getHistory();
  const body = $('#historyBody');
  if (!h.length) {
    body.innerHTML = `<div class="card empty"><div class="big">📊</div>
      <p>ยังไม่มีประวัติการทำข้อสอบ</p>
      <button class="btn btn-primary" data-nav="home" type="button">ไปเริ่มทำข้อสอบ</button></div>`;
    return;
  }
  const avg = h.reduce((s, x) => s + x.pct, 0) / h.length;
  const best = Math.max(...h.map(x => x.pct));
  body.innerHTML = `
    <div class="chips" style="margin-bottom:1.5rem">
      <span class="chip neu"><b>${h.length}</b>ครั้งที่ทำ</span>
      <span class="chip ok"><b>${best.toFixed(1)}%</b>ดีที่สุด</span>
      <span class="chip neu"><b>${avg.toFixed(1)}%</b>เฉลี่ย</span>
    </div>
    <div class="stack-md">${h.map(x => {
      const lv = x.pct >= 75 ? 'var(--ok)' : x.pct >= 50 ? 'var(--blue-600)' : x.pct >= 30 ? 'var(--warn)' : 'var(--bad)';
      return `<div class="hist-row">
        <div class="hist-pct" style="background:color-mix(in srgb,${lv} 14%,transparent);color:${lv}">${Math.round(x.pct)}%</div>
        <div class="hist-meta">
          <strong>${esc(x.label)}</strong>
          <span class="muted">${x.score}/${x.max} คะแนน · ถูก ${x.correct} · ผิด ${x.wrong} · ไม่ตอบ ${x.blank} · ${fmtTime(x.elapsed)}</span>
        </div>
        <div class="muted" style="font-size:.82rem;text-align:right">${fmtDate(x.finishedAt)}</div>
      </div>`;
    }).join('')}</div>
    <div style="margin-top:1.5rem;text-align:center">
      <button class="btn btn-quiet" id="clearHist" type="button">ล้างประวัติทั้งหมด</button>
    </div>`;

  $('#clearHist')?.addEventListener('click', () => modal({
    title: 'ล้างประวัติทั้งหมด?',
    body: 'ประวัติการทำข้อสอบทั้งหมดจะถูกลบออกจากเบราว์เซอร์นี้ และกู้คืนไม่ได้',
    ok: 'ลบทิ้ง',
    onOk: () => { store(LS.history, null); renderHistory(); renderHome(); }
  }));
}

/* ══════════════════════════════════════════════════════
   MODAL
   ══════════════════════════════════════════════════════ */
let modalOk = null;
function modal({ title, body, ok = 'ยืนยัน', onOk }) {
  $('#modalTitle').textContent = title;
  $('#modalBody').innerHTML = body;
  $('#modalOk').textContent = ok;
  modalOk = onOk;
  $('#modal').hidden = false;
  $('#modalOk').focus();
}
function closeModal() { $('#modal').hidden = true; modalOk = null; }

/* ══════════════════════════════════════════════════════
   EVENTS
   ══════════════════════════════════════════════════════ */
function wire() {
  // navigation
  document.addEventListener('click', e => {
    const nav = e.target.closest('[data-nav]');
    if (!nav) return;
    const to = nav.dataset.nav;
    if (to === 'history') { renderHistory(); show('history'); }
    else { renderHome(); show('home'); }
  });

  // theme
  $('#themeToggle').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('nacl.theme', next);
  });

  // home: mode / set / category selection
  $$('.mode-card').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));

  $('#setGrid').addEventListener('click', e => {
    const b = e.target.closest('[data-set]');
    if (!b) return;
    draft.setId = Number(b.dataset.set);
    $$('#setGrid .set-card').forEach(x => {
      const on = x === b;
      x.classList.toggle('is-on', on);
      x.setAttribute('aria-checked', on);
    });
    updateStartSummary();
  });

  $('#catList').addEventListener('click', e => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    draft.catIndex = Number(b.dataset.cat);
    $$('#catList .cat-row').forEach(x => {
      const on = x === b;
      x.classList.toggle('is-on', on);
      x.setAttribute('aria-checked', on);
    });
    updateStartSummary();
  });

  ['#timeLimit', '#catCount', '#msRule'].forEach(s => $(s).addEventListener('change', () => { updateStartSummary(); savePrefs(); }));
  ['#optPenalty', '#optInstant', '#optAutoNext', '#optShuffleQ', '#optShuffleO']
    .forEach(s => $(s).addEventListener('change', savePrefs));

  $('#startBtn').addEventListener('click', () => {
    const active = loadActive();
    if (active) {
      modal({
        title: 'มีข้อสอบที่ทำค้างอยู่',
        body: 'การเริ่มชุดใหม่จะล้างความคืบหน้าของชุดที่ทำค้างไว้ ต้องการเริ่มใหม่หรือไม่?',
        ok: 'เริ่มชุดใหม่',
        onOk: () => { clearActive(); startAttempt(); }
      });
      return;
    }
    startAttempt();
  });

  $('#heroStart').addEventListener('click', () => $('#startPanel').scrollIntoView({ block: 'start' }));

  $('#resumeBtn').addEventListener('click', () => {
    attempt = loadActive();
    if (!attempt) return renderResume();
    show('exam');
    renderExam();
    startTimer();
  });
  $('#discardBtn').addEventListener('click', () => modal({
    title: 'ล้างข้อสอบที่ทำค้าง?',
    body: 'คำตอบที่ทำไว้ทั้งหมดจะหายไป',
    ok: 'ล้างทิ้ง',
    onOk: () => { clearActive(); renderResume(); }
  }));

  // exam interactions
  $('#qcard').addEventListener('click', e => {
    const b = e.target.closest('[data-opt]');
    if (b && !b.disabled) pickOption(Number(b.dataset.opt));
  });
  $('#prevBtn').addEventListener('click', () => go(-1));
  $('#nextBtn').addEventListener('click', () => go(1));
  $('#flagBtn').addEventListener('click', () => {
    const i = attempt.current;
    attempt.flags[i] = !attempt.flags[i];
    saveActive();
    $('#flagBtn').classList.toggle('is-on', !!attempt.flags[i]);
    renderPalette();
  });
  $('#submitBtn').addEventListener('click', confirmSubmit);
  $('#paletteBtn').addEventListener('click', () => $('#palette').classList.contains('is-open') ? closePalette() : openPalette());
  $('#paletteClose').addEventListener('click', closePalette);
  $('#scrim').addEventListener('click', closePalette);
  $('#paletteBody').addEventListener('click', e => {
    const b = e.target.closest('[data-jump]');
    if (b) jumpTo(Number(b.dataset.jump));
  });

  // result
  $$('.seg-btn').forEach(b => b.addEventListener('click', () => {
    reviewFilter = b.dataset.filter;
    $$('.seg-btn').forEach(x => x.classList.toggle('is-on', x === b));
    renderReview();
  }));
  $('#retryBtn').addEventListener('click', () => { renderHome(); show('home'); $('#startPanel').scrollIntoView({ block: 'start' }); });

  // modal
  $('#modalOk').addEventListener('click', () => { const fn = modalOk; closeModal(); fn && fn(); });
  $('#modalCancel').addEventListener('click', closeModal);
  $('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });

  // keyboard shortcuts (exam only)
  document.addEventListener('keydown', e => {
    if (!$('#modal').hidden && e.key === 'Escape') return closeModal();
    if (!$('#view-exam').classList.contains('is-active') || !attempt) return;
    if (e.target.matches('input, textarea, select')) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    else if (e.key.toLowerCase() === 'f') { e.preventDefault(); $('#flagBtn').click(); }
    else if (e.key === 'Escape') closePalette();
    else if (/^[1-5]$/.test(e.key)) {
      const item = attempt.items[attempt.current];
      if (item.type !== 'written') { e.preventDefault(); pickOption(Number(e.key) - 1); }
    }
  });

  // don't lose an attempt on accidental close
  window.addEventListener('beforeunload', e => {
    if (attempt && Object.keys(attempt.answers).length) {
      saveActive();
      e.preventDefault();
      e.returnValue = '';
    }
  });
}

/* ══════════════════════════════════════════════════════
   BOOT
   ══════════════════════════════════════════════════════ */
(function initTheme() {
  const saved = localStorage.getItem('nacl.theme');
  if (saved) document.documentElement.dataset.theme = saved;
  else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) document.documentElement.dataset.theme = 'dark';
})();

fetch(DATA_URL)
  .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status} — หาไฟล์ ${DATA_URL} ไม่พบ`); return r.json(); })
  .then(json => {
    DATA = json;
    wire();
    loadPrefs();
    setMode('full');
    renderHome();
    show('home');
  })
  .catch(err => {
    $('#errorMsg').textContent = err.message;
    show('error');
  });

})();
