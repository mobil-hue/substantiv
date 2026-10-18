(function(){
'use strict';
/* Mengdetrening: uendelig øving med valg av oppgavetyper, visning (tall / tekst / tall og tekst / bare tale) og svarmåte. */
const A = window.App, M = A.Mult, N = A.N, Ex = A.Ex, {h, bi, shuffle, pick} = A;
A.routes = A.routes || {};
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const fmtPts = n => String(Math.round(n * 10) / 10).replace('.', ',');

const TYPES = [
  {k:'table', emoji:'✖️', no:'Gangetabellen', zh:'乘法表', ex:'3 × 4'},
  {k:'missing', emoji:'❓', no:'Hva mangler?', zh:'缺哪个数？', ex:'3 × ? = 12'},
  {k:'ten', emoji:'🔟', no:'Gange med 10, 100 og 1 000', zh:'乘 10、100 和 1 000', ex:'7 × 100'},
  {k:'tens', emoji:'🧮', no:'Tiere og hundrer', zh:'整十整百', ex:'30 × 4'},
  {k:'two', emoji:'🔢', no:'To-sifret × ett-sifret', zh:'两位数 × 一位数', ex:'47 × 6'},
  {k:'three', emoji:'🔣', no:'Tre-sifret × ett-sifret', zh:'三位数 × 一位数', ex:'276 × 3'},
  {k:'story', emoji:'📝', no:'Tekstoppgaver', zh:'应用题', ex:'4 poser à 6'}
];
const PRES = [
  {k:'num', emoji:'🔢', no:'Tall', zh:'数字', ex:'3 × 4'},
  {k:'text', emoji:'🔤', no:'Tekst', zh:'文字', ex:'tre ganger fire'},
  {k:'both', emoji:'🔢🔤', no:'Tall og tekst', zh:'数字和文字', ex:'3 × 4 · tre ganger fire'},
  {k:'speech', emoji:'🔊', no:'Bare tale (norsk)', zh:'只听（挪威语）', ex:'oppgaven vises ikke'}
];
const DEF = {tables:[2, 3, 4, 5, 6, 7, 8, 9, 10], types:['table'], pres:['num', 'text', 'both'], only:null};
let cfg = Object.assign({}, DEF, A.store.get('drill', {}));
if(!cfg.types || !cfg.types.length) cfg.types = DEF.types;
if(!cfg.pres || !cfg.pres.length) cfg.pres = DEF.pres;
if(!cfg.tables || !cfg.tables.length) cfg.tables = DEF.tables;
const save = () => A.store.set('drill', cfg);

/* ---------- utvalg: litt mer av det eleven sliter med ---------- */
const weight = (a, b) => { const s = Ex.stat(`mf:${a}x${b}`); return s ? 1 + 1.5 * s.m / (s.s + 2) : 1.4; };
function pickFact(recent){
  const list = [];
  if(cfg.only && cfg.only.length) cfg.only.forEach(([a, b]) => list.push([a, b]));
  else cfg.tables.forEach(t => { for(let b = 2; b <= 10; b++) list.push(Math.random() < .5 ? [t, b] : [b, t]); });
  const c = list.filter(p => !recent.includes(`mf:${p[0]}x${p[1]}`)), src = c.length ? c : list;
  let r = Math.random() * src.reduce((s, p) => s + weight(p[0], p[1]), 0);
  for(const p of src){ r -= weight(p[0], p[1]); if(r <= 0) return p; }
  return src[src.length - 1];
}
const nz2 = () => { let a; do a = rnd(12, 98); while(a % 10 === 0); return a; };
const nz3 = () => { let a; do a = rnd(102, 998); while(a % 100 === 0); return a; };
const near2 = () => rnd(2, 10) * 10 - rnd(1, 3), near3 = () => rnd(2, 10) * 100 - rnd(1, 30);
const stdNum = len => { for(let t = 0; t < 200; t++){ const b = rnd(2, 9), a = rnd(Math.pow(10, len - 1), Math.pow(10, len) - 1); if(String(a).split('').some(d => d * b >= 10)) return [a, b]; } return [len === 2 ? 47 : 276, 3]; };

function nextItem(recent){
  const type = pick(cfg.types), pres = pick(cfg.pres);
  const mk = (id, kind, spec) => ({id, kind, lvl:0, mod:0, make:() => spec});
  if(type === 'table'){ const [a, b] = pickFact(recent); return mk(`mf:${a}x${b}`, 'num', M.fact(a, b, pres)); }
  if(type === 'missing'){ const [a, b] = pickFact(recent); return mk(`mm:${a}x${b}`, 'num', M.missing(a, b, pres)); }
  if(type === 'ten'){ const a = rnd(2, 99), k = rnd(1, 3); return mk(`md:ten:${a}e${k}`, 'num', M.ten(a, k, pres)); }
  if(type === 'tens'){ const z = [[1, 0], [0, 1], [2, 0], [1, 1], [0, 2], [3, 0], [2, 1], [1, 2]][rnd(0, 7)], m = rnd(2, 9), n = rnd(2, 9);
    return Math.random() < .5 ? mk(`md:tens:${m}x${n}z${z}`, 'num', M.tens(m, n, z[0], z[1], pres)) : mk(`md:tens:${m}x${n}z${z}`, 'calc', M.calcTen(m, n, z[0], z[1], pres)); }
  if(type === 'two'){ const r = Math.random();
    if(r < .3){ const a = nz2(), b = rnd(2, 9); return mk(`md:two:${a}x${b}`, 'calc', M.calcSplit(a, b, pres)); }
    if(r < .55){ const [a, b] = stdNum(2); return mk(`md:two:${a}x${b}`, 'calc', M.calcStd(a, b, pres)); }
    if(r < .75){ const a = near2(), b = rnd(3, 9); return mk(`md:two:${a}x${b}`, 'calc', M.calcRound(a, b, pres)); }
    const k = [4, 5, 8][rnd(0, 2)], a = k === 8 ? rnd(6, 25) : rnd(6, 49); return mk(`md:two:${a}x${k}`, 'calc', M.calcDouble(a, k, pres)); }
  if(type === 'three'){ const r = Math.random();
    if(r < .4){ const a = nz3(), b = rnd(2, 9); return mk(`md:three:${a}x${b}`, 'calc', M.calcSplit(a, b, pres)); }
    if(r < .75){ const [a, b] = stdNum(3); return mk(`md:three:${a}x${b}`, 'calc', M.calcStd(a, b, pres)); }
    const a = near3(), b = rnd(2, 9); return mk(`md:three:${a}x${b}`, 'calc', M.calcRound(a, b, pres)); }
  const kind = ['groups', 'price', 'rows', 'times', 'perday'][rnd(0, 4)], lvl = [1, 1, 2, 2, 3][rnd(0, 4)];
  const sp = M.story(kind, lvl, pres === 'num' ? 'text' : pres);
  return mk(`md:story:${kind}${lvl}:${sp.story.a}x${sp.story.b}`, 'calc', sp);
}

/* ---------- oppsett ---------- */
function tglHtml(arr, sel){
  return arr.map(x => `<button type="button" class="tgl${sel.includes(x.k) ? ' on' : ''}" data-k="${x.k}"><span class="te">${x.emoji}</span><span class="tt">${bi(x.no, x.zh)}<small>${x.ex}</small></span><span class="tc">✔</span></button>`).join('');
}
function setup(){
  const U = A.UI, root = h('div', {class:'drillsetup'});
  const weak = weakFacts();
  const draw = () => {
    root.innerHTML = `<div class="crumb" id="back">← ${bi('Hjem', '首页')}</div><h1>🏋️ ${bi('Mengdetrening', '大量练习')}</h1>
      <p>${bi('Velg hva du vil øve. Du kan endre valgene når du vil.', '选择想练习的内容。随时都可以修改。')}</p>
      <div class="card"><h3>${bi('1. Oppgavetyper', '1. 题型')}</h3><div class="tglgrid" id="gT">${tglHtml(TYPES, cfg.types)}</div></div>
      <div class="card"><h3>${bi('2. Hvilke tabeller?', '2. 哪些乘法表？')}</h3>
        <div class="tabchips">${[2, 3, 4, 5, 6, 7, 8, 9, 10].map(t => `<button type="button" class="tgl small${cfg.tables.includes(t) && !cfg.only ? ' on' : ''}" data-t="${t}">${t}</button>`).join('')}</div>
        <div class="row" style="margin-top:8px"><button class="pill" id="tAll">${bi('Alle', '全部')}</button><button class="pill" id="tEasy">${bi('2, 5, 10', '2、5、10')}</button><button class="pill" id="tHard">${bi('6, 7, 8, 9', '6、7、8、9')}</button>
        <button class="pill ${cfg.only ? 'on' : ''}" id="tWeak"${weak.length ? '' : ' disabled'}>${bi(`Bare de jeg sliter med${weak.length ? ' (' + weak.length + ')' : ''}`, `只练容易错的${weak.length ? '（' + weak.length + '）' : ''}`)}</button></div>
        <div class="small-note">${bi('Gjelder gangetabellen og «Hva mangler?».', '适用于“乘法表”和“缺哪个数？”。')}</div></div>
      <div class="card"><h3>${bi('3. Slik vises oppgaven', '3. 题目怎么显示')}</h3><div class="tglgrid" id="gP">${tglHtml(PRES, cfg.pres)}</div>
        <div class="small-note">${bi('Du kan velge flere. Tale: oppgaven vises ikke, men leses opp på norsk. Du kan høre den igjen så mange ganger du vil.', '可以多选。只听：题目不显示，用挪威语读出来。想听几遍都可以。')}</div></div>
      <div class="card"><h3>${bi('4. Slik svarer du', '4. 怎么答题')}</h3>
        <div class="optgrp" id="gI">${['choice', 'type', 'mix'].map(k => `<button type="button" class="pill ${A.prefs.input === k ? 'on' : ''}" data-k="${k}">${{choice:'✅ Flervalg · 选择题', type:'⌨️ Skriv inn · 输入答案', mix:'🎲 Tilfeldig · 随机'}[k]}</button>`).join('')}</div>
        <label class="chk"><input type="checkbox" id="guide" ${A.prefs.guide ? 'checked' : ''}> ${bi('Trinn for trinn i regneoppgaver (to- og tre-sifrede tall, tekstoppgaver)', '计算题一步一步引导（两位数、三位数、应用题）')}</label></div>
      <div class="row" style="margin:16px 0"><button class="btn big" id="go"><span class="bi"><span class="no">▶ Start</span><span class="zh">开始</span></span></button>
        <button class="btn sec" id="stats"><span class="bi"><span class="no">📊 Statistikk</span><span class="zh">统计</span></span></button></div>`;
    root.querySelector('#back').onclick = () => { location.hash = '#/'; };
    const multi = (sel, key, min) => root.querySelectorAll(sel + ' .tgl').forEach(b => b.onclick = () => { const k = b.dataset.k, i = cfg[key].indexOf(k);
      if(i >= 0){ if(cfg[key].length > min) cfg[key].splice(i, 1); } else cfg[key].push(k); save(); draw(); });
    multi('#gT', 'types', 1); multi('#gP', 'pres', 1);
    root.querySelectorAll('.tabchips .tgl').forEach(b => b.onclick = () => { const t = +b.dataset.t; cfg.only = null; const i = cfg.tables.indexOf(t);
      if(i >= 0){ if(cfg.tables.length > 1) cfg.tables.splice(i, 1); } else cfg.tables.push(t); cfg.tables.sort((x, y) => x - y); save(); draw(); });
    const setTabs = arr => () => { cfg.tables = arr.slice(); cfg.only = null; save(); draw(); };
    root.querySelector('#tAll').onclick = setTabs([2, 3, 4, 5, 6, 7, 8, 9, 10]); root.querySelector('#tEasy').onclick = setTabs([2, 5, 10]); root.querySelector('#tHard').onclick = setTabs([6, 7, 8, 9]);
    root.querySelector('#tWeak').onclick = () => { cfg.only = cfg.only ? null : weak.map(w => [w[0], w[1]]); save(); draw(); };
    root.querySelectorAll('#gI button').forEach(b => b.onclick = () => { A.prefs.input = b.dataset.k; A.savePrefs(); if(A.syncInput) A.syncInput(); draw(); });
    root.querySelector('#guide').onchange = e => { A.prefs.guide = e.target.checked; A.savePrefs(); };
    root.querySelector('#go').onclick = () => start();
    root.querySelector('#stats').onclick = () => { location.hash = '#/stats'; };
  };
  U.render(root); draw();
}

/* ---------- selve treningen ---------- */
function start(){
  const U = A.UI; let points = A.store.get('mult_pts', 0); const S = {n:0, pts:0, ok:0, first:0};
  U.Session({title:{no:'Mengdetrening', zh:'大量练习'}, endless:true,
    next:st => nextItem(st.recent),
    onResult:(res, cur, st, ok) => { points += res.score; S.pts += res.score; S.n++; if(ok) S.ok++; A.store.set('mult_pts', points); },
    status:st => `⭐ ${fmtPts(S.pts)} · 🔥 ${st.streak}`,
    onExit:() => summary(S), onAgain:() => start(), onFinish:() => summary(S)});
}
function summary(S){
  const U = A.UI;
  if(!S.n){ setup(); return; }
  const pct = Math.round(S.ok / S.n * 100), root = h('div', {class:'end', html:`<div class="big-emoji">${pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : '💪'}</div>
    <h2>${bi('Bra jobba!', '做得好！')}</h2><p>${bi(`${S.n} oppgaver · ${fmtPts(S.pts)} poeng · ${pct} % riktig første gang`, `${S.n} 道题 · ${fmtPts(S.pts)} 分 · 一次答对 ${pct}%`)}</p>
    <div class="row"><button class="btn big" id="more"><span class="bi"><span class="no">▶ Fortsett å øve</span><span class="zh">继续练习</span></span></button>
    <button class="btn sec" id="opts"><span class="bi"><span class="no">⚙️ Endre valg</span><span class="zh">修改选项</span></span></button>
    <button class="btn sec" id="st"><span class="bi"><span class="no">📊 Statistikk</span><span class="zh">统计</span></span></button></div>`});
  U.render(root);
  root.querySelector('#more').onclick = () => start();
  root.querySelector('#opts').onclick = () => setup();
  root.querySelector('#st').onclick = () => { location.hash = '#/stats'; };
  A.sayBi(pct >= 90 ? 'Fantastisk!' : 'Bra jobba!', pct >= 90 ? '太棒了！' : '做得好！');
}

/* ---------- statistikk ---------- */
function factStats(){
  const out = {};
  for(let a = 2; a <= 10; a++) for(let b = 2; b <= 10; b++){ const s = Ex.stat(`mf:${a}x${b}`); if(s) out[a + 'x' + b] = {a, b, n:s.s, w:s.m, r:s.s - s.m}; }
  return out;
}
function weakFacts(){
  return Object.values(factStats()).filter(f => f.w > 0).sort((x, y) => (y.w / y.n) - (x.w / x.n) || y.w - x.w).slice(0, 14).map(f => [f.a, f.b, f.w, f.n]);
}
const heat = f => { if(!f || !f.n) return null; const e = f.w / f.n; return `hsl(${Math.round(125 * (1 - e))},70%,${e > .5 ? 62 : 70}%)`; };
function statsView(){
  const U = A.UI, F = factStats(), pts = A.store.get('mult_pts', 0), root = h('div');
  let right = 0, tot = 0; Object.values(F).forEach(f => { right += f.r; tot += f.n; });
  const weak = weakFacts();
  let grid = `<div class="heat"><div class="hh">×</div>${Array.from({length:9}, (_, i) => `<div class="hh">${i + 2}</div>`).join('')}`;
  for(let a = 2; a <= 10; a++){ grid += `<div class="hh">${a}</div>`; for(let b = 2; b <= 10; b++){ const f = F[a + 'x' + b], c = heat(f);
    grid += `<div${c ? ` style="background:${c}"` : ''} title="${a} × ${b} = ${a * b}">${c ? Math.round(100 * f.r / f.n) : ''}</div>`; } }
  grid += '</div>';
  root.innerHTML = `<div class="crumb" id="back">← ${bi('Hjem', '首页')}</div><h1>📊 ${bi('Statistikk', '统计')}</h1>
    <div class="card"><div class="sumrow"><div><b>${fmtPts(pts)}</b><span>${bi('poeng totalt', '总积分')}</span></div><div><b>${tot}</b><span>${bi('gangestykker øvd', '练过的乘法题')}</span></div><div><b>${tot ? Math.round(100 * right / tot) + '%' : '–'}</b><span>${bi('riktig første gang', '一次答对')}</span></div></div>
      <div class="small-note">${bi('Hver rute er et gangestykke (rad × kolonne). Tallet er % riktig første gang.', '每个格子是一道乘法题（行 × 列）。数字是一次答对的百分比。')}</div>${grid}
      <div class="legend"><span><i style="background:hsl(125,70%,70%)"></i>${bi('sikker', '很熟')}</span><span><i style="background:hsl(60,70%,70%)"></i>${bi('usikker', '不太熟')}</span><span><i style="background:hsl(0,70%,62%)"></i>${bi('sliter', '常出错')}</span><span><i style="background:#f3f4f6"></i>${bi('ikke øvd', '没练过')}</span></div></div>
    <div class="card"><h3>${bi('Sliter mest med', '最容易错的')}</h3>${weak.length ? `<ul class="worst">${weak.slice(0, 8).map(w => `<li>${w[0]} × ${w[1]} = ${w[0] * w[1]}<span><span class="no">${w[2]} feil av ${w[3]}</span><span class="zh"> 错 ${w[2]} / ${w[3]}</span></span></li>`).join('')}</ul>
      <div class="row" style="margin-top:10px"><button class="btn" id="practiceWeak"><span class="bi"><span class="no">🎯 Øv på disse</span><span class="zh">练习这些</span></span></button></div>` : `<div class="small-note">${bi('Ingen feil ennå – bra!', '还没有错题——很好！')}</div>`}</div>
    <div class="row"><button class="btn big" id="go"><span class="bi"><span class="no">▶ Mengdetrening</span><span class="zh">大量练习</span></span></button>
    <button class="btn sec" id="reset"><span class="bi"><span class="no">🗑 Nullstill statistikk</span><span class="zh">清除统计</span></span></button></div>`;
  U.render(root);
  root.querySelector('#back').onclick = () => { location.hash = '#/'; };
  root.querySelector('#go').onclick = () => { location.hash = '#/drill'; };
  const pw = root.querySelector('#practiceWeak'); if(pw) pw.onclick = () => { cfg.only = weak.map(w => [w[0], w[1]]); cfg.types = ['table']; save(); start(); };
  root.querySelector('#reset').onclick = () => { if(confirm('Slette all statistikk og alle poeng i Gange? / 要清除乘法的所有统计和积分吗？')){ Ex.resetStats(/^(mf|mm|md|m_)/); A.store.set('mult_pts', 0); statsView(); } };
}

A.routes.drill = () => setup();
A.routes.stats = () => statsView();
A.Drill = {nextItem, cfg:() => cfg, TYPES, PRES};
})();
