/* ══════════════════════════════════════════════════════════
   NaCl Lab — Interview Prep
   Random interview questions, per-question timer, reveal answer.
   Data source: interview_questions.json
   ══════════════════════════════════════════════════════════ */
'use strict';

const DATA_URL = 'interview_questions.json';

/* ─── tiny helpers ─── */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
const store = (k, v) => {
  try {
    if (v === undefined) { const r = localStorage.getItem(k); return r ? JSON.parse(r) : null; }
    localStorage.setItem(k, JSON.stringify(v));
  } catch (_) { return null; }
};

/* ─── state ─── */
let DATA = null;
const cfg = { cats: new Set(), seconds: 90, auto: false, shuffle: true };
let session = null;   // { queue, pos, seen, revealedCount }
let timer = { id: null, remain: 0, elapsed: 0, paused: false };

/* ─── boot ─── */
(async function init() {
  // theme
  const savedTheme = store('nacl_theme');
  if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
  $('#btnTheme').addEventListener('click', toggleTheme);

  try {
    DATA = await (await fetch(DATA_URL, { cache: 'no-cache' })).json();
  } catch (e) {
    $('#main').innerHTML = '<div class="card pad-lg">โหลดคำถามไม่สำเร็จ กรุณาลองใหม่</div>';
    return;
  }
  DATA.categories.forEach(c => cfg.cats.add(c.id));   // default: all selected
  renderTopics();
  bindSetup();
  bindPractice();
  updateStartInfo();
})();

/* ─── theme ─── */
function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', cur);
  store('nacl_theme', cur);
}

/* ─── setup screen ─── */
function renderTopics() {
  const counts = {};
  DATA.questions.forEach(q => counts[q.category] = (counts[q.category] || 0) + 1);
  $('#topicGrid').innerHTML = DATA.categories.map(c => `
    <button class="topic-card is-on" data-cat="${c.id}" type="button" aria-pressed="true">
      <span class="topic-emoji">${c.emoji}</span>
      <span class="topic-name">${esc(c.name)}</span>
      <span class="topic-count">${counts[c.id] || 0} คำถาม</span>
      <span class="topic-check">✓</span>
    </button>`).join('');
  $$('#topicGrid .topic-card').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.cat;
    if (cfg.cats.has(id)) cfg.cats.delete(id); else cfg.cats.add(id);
    if (cfg.cats.size === 0) cfg.cats.add(id);        // keep at least one
    b.classList.toggle('is-on', cfg.cats.has(id));
    b.setAttribute('aria-pressed', cfg.cats.has(id));
    updateStartInfo();
  }));
}

function bindSetup() {
  $$('#timerSeg .seg-btn').forEach(b => b.addEventListener('click', () => {
    $$('#timerSeg .seg-btn').forEach(x => { x.classList.remove('is-on'); x.setAttribute('aria-checked','false'); });
    b.classList.add('is-on'); b.setAttribute('aria-checked','true');
    cfg.seconds = Number(b.dataset.sec);
  }));
  $('#optAuto').addEventListener('change', e => cfg.auto = e.target.checked);
  $('#optShuffleOrder').addEventListener('change', e => cfg.shuffle = e.target.checked);
  $('#btnStart').addEventListener('click', startSession);
  $$('[data-nav="home"]').forEach(b => b.addEventListener('click', goHome));
}

function poolQuestions() {
  return DATA.questions.filter(q => cfg.cats.has(q.category));
}
function updateStartInfo() {
  const n = poolQuestions().length;
  $('#startInfo').innerHTML = `พร้อมฝึก — <b>${n}</b> คำถาม จาก <b>${cfg.cats.size}</b> หัวข้อ`;
}

/* ─── session ─── */
function shuffled(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function startSession() {
  const pool = poolQuestions();
  if (!pool.length) return;
  session = { queue: cfg.shuffle ? shuffled(pool) : pool.slice(), pos: 0, viewed: 0, revealed: 0 };
  show('practice');
  loadQuestion();
}
function loadQuestion() {
  const total = session.queue.length;
  if (session.pos >= total) { endSession(); return; }   // finished the round → summary
  const q = session.queue[session.pos];
  session.viewed = session.pos + 1;
  const cat = DATA.categories.find(c => c.id === q.category);
  $('#qCat').textContent = `${cat.emoji} ${cat.short}`;
  $('#qCat').className = `cat-pill cat-${q.category}`;
  $('#qCount').textContent = `ข้อที่ ${session.pos + 1} / ${total}`;
  $('#qText').textContent = q.q;
  $('#answerList').innerHTML = (q.points || []).map(p => `<li>${esc(p)}</li>`).join('');
  $('#answerCard').hidden = true;
  $('#btnReveal').textContent = '👁 ดูแนวคำตอบ';
  $('#btnNext').textContent = (session.pos + 1 >= total) ? 'ดูสรุป →' : 'ข้อถัดไป →';
  startTimer();
}
function nextQuestion() {
  session.pos++;
  loadQuestion();
}
function reveal() {
  const card = $('#answerCard');
  card.hidden = !card.hidden;
  if (!card.hidden) { session.revealed++; $('#btnReveal').textContent = '🙈 ซ่อนคำตอบ'; }
  else $('#btnReveal').textContent = '👁 ดูแนวคำตอบ';
}

/* ─── timer ─── */
function fmt(s) { s = Math.max(0, Math.round(s)); return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`; }
function startTimer() {
  clearInterval(timer.id);
  timer.paused = false;
  timer.elapsed = 0;
  $('#btnPause').textContent = '⏸ พัก';
  const wrap = $('#timerWrap');
  if (cfg.seconds === 0) {                     // count-up stopwatch mode
    wrap.classList.add('countup'); wrap.classList.remove('danger','warn');
    $('#timerFill').style.width = '100%';
    $('#timerNum').textContent = '0:00';
    timer.id = setInterval(() => { if (!timer.paused) { timer.elapsed++; $('#timerNum').textContent = fmt(timer.elapsed); } }, 1000);
    return;
  }
  wrap.classList.remove('countup');
  timer.remain = cfg.seconds;
  paintTimer();
  timer.id = setInterval(() => {
    if (timer.paused) return;
    timer.remain--;
    paintTimer();
    if (timer.remain <= 0) {
      clearInterval(timer.id);
      $('#timerWrap').classList.add('danger');
      if (cfg.auto && $('#answerCard').hidden) reveal();
    }
  }, 1000);
}
function paintTimer() {
  const pct = Math.max(0, timer.remain / cfg.seconds * 100);
  $('#timerFill').style.width = pct + '%';
  $('#timerNum').textContent = fmt(timer.remain);
  const w = $('#timerWrap');
  w.classList.toggle('warn', timer.remain <= 10 && timer.remain > 5);
  w.classList.toggle('danger', timer.remain <= 5);
}
function togglePause() {
  if (cfg.seconds === 0 && !timer.id) return;
  timer.paused = !timer.paused;
  $('#btnPause').textContent = timer.paused ? '▶ เล่นต่อ' : '⏸ พัก';
}

/* ─── practice bindings ─── */
function bindPractice() {
  $('#btnReveal').addEventListener('click', reveal);
  $('#btnNext').addEventListener('click', nextQuestion);
  $('#btnPause').addEventListener('click', togglePause);
  $('#btnEnd').addEventListener('click', endSession);
  $('#btnAgain').addEventListener('click', startSession);   // new shuffled round, same topics
  $('#btnHome').addEventListener('click', goHome);
  document.addEventListener('keydown', e => {
    if ($('#practice').hidden) return;
    if (e.target.tagName === 'INPUT') return;
    if (e.code === 'Space') { e.preventDefault(); reveal(); }
    else if (e.code === 'ArrowRight' || e.code === 'Enter') { e.preventDefault(); nextQuestion(); }
    else if (e.key.toLowerCase() === 'p') { togglePause(); }
  });
}
function endSession() {
  clearInterval(timer.id);
  const done = session.viewed >= session.queue.length;
  $('#summaryLine').innerHTML =
    `${done ? 'ครบทุกข้อในรอบนี้แล้ว 🎉<br>' : ''}ฝึกไป <b>${session.viewed}</b> จาก <b>${session.queue.length}</b> คำถาม · เปิดดูแนวคำตอบ <b>${session.revealed}</b> ครั้ง<br>ทบทวนข้อที่ยังไม่มั่นใจอีกรอบได้เลย`;
  show('summary');
}

/* ─── navigation ─── */
function show(id) {
  ['setup','practice','summary'].forEach(s => $('#' + s).hidden = (s !== id));
  if (id !== 'practice') clearInterval(timer.id);
  window.scrollTo(0, 0);
}
function goHome() { clearInterval(timer.id); show('setup'); updateStartInfo(); }
