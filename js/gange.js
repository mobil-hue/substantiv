(function(){
'use strict';
const MIN = 2, MAX = 10, KEY = 'gange_v1';
const $ = id => document.getElementById(id);

/* ---------- lagring ---------- */
let S = { points: 0, facts: {} };   // facts["8x7"] = {r: riktige, w: gale} (kun første forsøk)
try{ const v = JSON.parse(localStorage.getItem(KEY)); if(v && v.facts) S = v; }catch(e){}
const save = () => { try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} };
const fact = (a, b) => S.facts[a + 'x' + b] || (S.facts[a + 'x' + b] = { r: 0, w: 0 });
const fmt = n => String(n).replace('.', ',');

/* ---------- utvalg: litt mer av de man er dårlig på ---------- */
function weight(a, b){
  const f = S.facts[a + 'x' + b]; if(!f) return 1;
  return 1 + 1.5 * f.w / (f.r + f.w + 2);          // 1 … ca. 2,5
}
let last = '';
function pickFact(){
  const all = [];
  for(let a = MIN; a <= MAX; a++) for(let b = MIN; b <= MAX; b++) if(a + 'x' + b !== last) all.push([a, b, weight(a, b)]);
  let r = Math.random() * all.reduce((s, x) => s + x[2], 0);
  for(const x of all){ r -= x[2]; if(r <= 0) return x; }
  return all[all.length - 1];
}
const shuffle = a => { a = a.slice(); for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* ---------- tall som ord (norsk og kinesisk) ---------- */
const NO1 = ['null','en','to','tre','fire','fem','seks','sju','åtte','ni','ti','elleve','tolv','tretten','fjorten','femten','seksten','sytten','atten','nitten'];
const NO10 = ['','','tjue','tretti','førti','femti','seksti','sytti','åtti','nitti'];
function no(n){
  if(n === 100) return 'hundre';
  if(n < 20) return NO1[n];
  return NO10[Math.floor(n / 10)] + (n % 10 ? NO1[n % 10] : '');
}
const ZH1 = '零一二三四五六七八九';
function zh(n){
  if(n === 100) return '一百';
  if(n < 10) return ZH1[n];
  const t = Math.floor(n / 10), o = n % 10;
  return (t > 1 ? ZH1[t] : '') + '十' + (o ? ZH1[o] : '');
}

/* ---------- tale ---------- */
const tts = 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
let voices = [];
if(tts){ const lv = () => { try{ voices = speechSynthesis.getVoices() || []; }catch(e){} }; lv(); try{ speechSynthesis.onvoiceschanged = lv; }catch(e){} }
function voice(l){
  const pre = l === 'no' ? ['nb', 'no', 'nn'] : ['zh', 'cmn'];
  const norm = v => (v.lang || '').replace('_', '-').toLowerCase();
  for(const p of pre){ const v = voices.find(v => norm(v).startsWith(p)); if(v) return v; }
  return null;
}
let speakToken = 0;
function speakOne(text, l){
  return new Promise(res => {
    if(!tts){ res(); return; }
    const u = new SpeechSynthesisUtterance(text), v = voice(l);
    if(v){ u.voice = v; u.lang = v.lang; } else u.lang = l === 'no' ? 'nb-NO' : 'zh-CN';
    u.rate = 0.85;
    let done = false;
    const fin = () => { if(!done){ done = true; res(); } };
    u.onend = fin; u.onerror = fin; setTimeout(fin, 6000);
    try{ speechSynthesis.speak(u); }catch(e){ fin(); }
  });
}
async function sayEquation(a, b){
  const my = ++speakToken;
  if(!tts) return;
  try{ speechSynthesis.cancel(); }catch(e){}
  await new Promise(r => setTimeout(r, 40));
  await speakOne(`${no(a)} ganger ${no(b)} er ${no(a * b)}`, 'no');
  if(my !== speakToken) return;
  await speakOne(`${zh(a)}乘以${zh(b)}等于${zh(a * b)}`, 'zh');
}

/* ---------- spill ---------- */
const BALL = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#a855f7'];
let cur = null, typed = '', locked = false;

function newQuestion(){
  const [a, b] = pickFact();
  last = a + 'x' + b;
  cur = { a, b, ans: a * b, attempt: 1 };
  draw();
}

function options(){
  const { a, b, ans } = cur, set = new Set([ans]);
  const near = shuffle([a * (b + 1), a * (b - 1), (a + 1) * b, (a - 1) * b, ans + 10, ans - 10, ans + 1, ans - 1, ans + 2, ans - 2]);
  for(const x of near){ if(set.size >= 4) break; if(x > 0 && x !== ans) set.add(x); }
  return shuffle([...set]);
}

function hintHTML(){
  const { a, b } = cur;
  let h = `<div class="hint"><div class="cap">${a} × 1, ${a} × 2, … ${a} × 10 &nbsp;·&nbsp; ${a} baller i hver stolpe</div><div class="cols">`;
  for(let i = 1; i <= 10; i++){
    const color = BALL[(i - 1) % BALL.length];
    h += `<div class="col${i === b ? ' target' : ''}" style="animation-delay:${(i - 1) * 90}ms">`
      + Array.from({ length: a }, () => `<span class="ball" style="background:${color}"></span>`).join('')
      + `<div class="n">${i}</div>`
      + (i === b ? `<div class="s unk">?</div>` : `<div class="s">${a * i}</div>`)
      + `</div>`;
  }
  return h + `</div></div>`;
}

function draw(){
  const g = $('game'), { a, b, attempt } = cur;
  cur.mode = Math.random() < .5 ? 'choice' : 'type';
  typed = ''; locked = false;
  let h = `<div class="q">${a} × ${b} <span class="eq">=</span> ?</div>`;
  if(attempt === 2) h += `<div class="msg bad">Ikke helt! Se på stolpene – hva er ${a} × ${b}? <small>(½ poeng)</small></div>` + hintHTML();
  h += `<div class="mode">${cur.mode === 'choice' ? 'Velg riktig svar' : 'Skriv svaret'}</div>`;
  if(cur.mode === 'choice'){
    h += `<div class="choices">${options().map(o => `<button class="choice" data-v="${o}">${o}</button>`).join('')}</div>`;
  } else {
    h += `<div class="disp empty" id="disp">tast inn svar</div><div class="pad">`
      + [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button class="key" data-k="${n}">${n}</button>`).join('')
      + `<button class="key del" data-k="del">⌫</button><button class="key" data-k="0">0</button><button class="key ok" data-k="ok">OK</button></div>`;
  }
  h += `<div class="msg" id="msg"></div>`;
  g.innerHTML = h;
  g.querySelectorAll('.choice').forEach(b => b.onclick = () => submit(+b.dataset.v, b));
  g.querySelectorAll('.key').forEach(b => b.onclick = () => key(b.dataset.k));
}

function key(k){
  if(locked) return;
  if(k === 'del') typed = typed.slice(0, -1);
  else if(k === 'ok'){ if(typed) submit(+typed); return; }
  else if(typed.length < 3) typed += k;
  const d = $('disp'); if(!d) return;
  d.textContent = typed || 'tast inn svar'; d.classList.toggle('empty', !typed);
}
document.addEventListener('keydown', e => {
  if(!cur || cur.mode !== 'type') return;
  if(/^\d$/.test(e.key)) key(e.key); else if(e.key === 'Backspace') key('del'); else if(e.key === 'Enter') key('ok');
});

function submit(v, btn){
  if(locked) return;
  locked = true;
  const { a, b, ans, attempt } = cur, f = fact(a, b), msg = $('msg');
  if(v === ans){
    const p = attempt === 1 ? 1 : .5;
    S.points += p;
    if(attempt === 1) f.r++;
    if(btn) btn.classList.add('good');
    msg.className = 'msg good'; msg.textContent = `Riktig! +${fmt(p)}`;
    save(); render();
    setTimeout(newQuestion, attempt === 1 ? 800 : 1400);
    return;
  }
  if(btn) btn.classList.add('bad');
  if(attempt === 1){
    f.w++; save(); render();
    msg.className = 'msg bad'; msg.textContent = 'Feil';
    setTimeout(() => { cur.attempt = 2; draw(); $('game').scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 600);
    return;
  }
  reveal();
}

function reveal(){
  const { a, b, ans } = cur;
  $('game').innerHTML = `<div class="reveal"><div class="big">${a} × ${b} = ${ans}</div>`
    + `<div class="l">${a} ganger ${b} er ${ans}</div>`
    + `<div class="l zh">${zh(a)}乘以${zh(b)}等于${zh(ans)}</div></div>`
    + `<div style="text-align:center;display:flex;gap:10px;justify-content:center;flex-wrap:wrap">`
    + `<button class="btn sec" id="again">🔊 Hør igjen</button><button class="btn" id="next">Neste ›</button></div>`;
  $('again').onclick = () => sayEquation(a, b);
  $('next').onclick = () => { speakToken++; try{ speechSynthesis.cancel(); }catch(e){} newQuestion(); };
  sayEquation(a, b);
}

/* ---------- statistikk ---------- */
function heatColor(f){
  if(!f || f.r + f.w === 0) return null;
  const e = f.w / (f.r + f.w);                      // 0 = alltid riktig, 1 = alltid feil
  return `hsl(${Math.round(125 * (1 - e))},70%,${e > .5 ? 62 : 70}%)`;
}
function render(){
  $('pts').textContent = fmt(S.points);
  let right = 0, wrong = 0;
  const seen = [];
  for(let a = MIN; a <= MAX; a++) for(let b = MIN; b <= MAX; b++){
    const f = S.facts[a + 'x' + b]; if(!f) continue;
    right += f.r; wrong += f.w;
    if(f.w) seen.push({ a, b, w: f.w, n: f.r + f.w, rate: f.w / (f.r + f.w) });
  }
  seen.sort((x, y) => y.rate - x.rate || y.w - x.w);
  const tot = right + wrong, pct = tot ? Math.round(100 * right / tot) : 0;
  let h = `<h2>📊 Statistikk</h2><div class="sum"><div><b>${fmt(S.points)}</b><span>poeng totalt</span></div>`
    + `<div><b>${tot}</b><span>oppgaver</span></div><div><b>${tot ? pct + '%' : '–'}</b><span>rett første gang</span></div></div>`
    + `<div class="small" style="margin-bottom:4px">Hver rute er en gangeoppgave (rad × kolonne). Tallet er % rett første gang.</div><div class="heat"><div class="h">×</div>`;
  for(let b = MIN; b <= MAX; b++) h += `<div class="h">${b}</div>`;
  for(let a = MIN; a <= MAX; a++){
    h += `<div class="h">${a}</div>`;
    for(let b = MIN; b <= MAX; b++){
      const f = S.facts[a + 'x' + b], c = heatColor(f);
      h += `<div${c ? ` style="background:${c}"` : ''} title="${a} × ${b}">${c ? Math.round(100 * f.r / (f.r + f.w)) : ''}</div>`;
    }
  }
  h += `</div><div class="legend"><span><i style="background:hsl(125,70%,70%)"></i>sikker</span><span><i style="background:hsl(60,70%,70%)"></i>usikker</span>`
    + `<span><i style="background:hsl(0,70%,62%)"></i>sliter</span><span><i style="background:#f3f4f6"></i>ikke øvd</span></div>`;
  if(seen.length){
    h += `<h2>Sliter mest med</h2><ul class="worst">` + seen.slice(0, 5).map(x =>
      `<li>${x.a} × ${x.b} = ${x.a * x.b}<span>${x.w} feil av ${x.n}</span></li>`).join('') + `</ul>`;
  } else h += `<div class="small">Ingen feil ennå – bra!</div>`;
  h += `<p style="text-align:center"><button class="btn sec" id="reset">Nullstill statistikk</button></p>`;
  $('stats').innerHTML = h;
  $('reset').onclick = () => { if(confirm('Slette alle poeng og all statistikk?')){ S = { points: 0, facts: {} }; save(); render(); } };
}

render();
newQuestion();
})();
