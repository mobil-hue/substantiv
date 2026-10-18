(function(){
'use strict';
/* Skriveark i gange: 6 ark med fasit. Samme lenke (#s=<tall>&l=<nivå>) gir samme ark, så fasiten stemmer. */
const A = window.App, M = A.Mult, MG = A.MG, N = A.N, fmt = N.fmt;
const bi = (no, zh) => `<span class="no">${no}</span> <span class="zh">${zh}</span>`;
const ans = t => `<span class="ans">${t}</span>`;
const bl = (key, v, w) => key ? `<span class="fl">${ans(v)}</span>` : `<span class="bl" style="min-width:${w || 17}mm"></span>`;
const P10 = k => Math.pow(10, k);

const header = (n, noT, zhT, noI, zhI, key) => `
  <div class="shead"><div class="stitle"><span class="num">${n}</span><div><h2>${noT}${key ? ' · FASIT' : ''}</h2><div class="zh">${zhT}${key ? ' · 答案' : ''}</div></div></div>
  <div class="who">Navn / 姓名: <span class="ln"></span> &nbsp; Dato / 日期: <span class="ln s"></span> &nbsp; ⭐⭐⭐</div></div>
  <div class="instr">✏️ ${noI}<br><span class="zh">${zhI}</span></div>`;

/* ---- ark 1: gangetabellen ---- */
function sheet1(d, key){
  const eq = f => `<div class="eq"><span class="q">${f.a} × ${f.b} =</span> ${bl(key, f.a * f.b, 13)}</div>`;
  const miss = f => `<div class="eq"><span class="q">${f.left ? f.a + ' × ' : ''}${f.left ? bl(key, f.b, 10) : bl(key, f.b, 10) + ' × ' + f.a} = ${f.a * f.b}</span></div>`;
  const swap = f => `<div class="eq"><span class="q">${f.a} × ${f.b} = ${f.a * f.b}</span> &nbsp;→&nbsp; <span class="q">${f.b} × ${f.a} =</span> ${bl(key, f.a * f.b, 12)}</div>`;
  return `<section class="sheet ${key ? 'key' : 'sheetwrap'}">${header(1, 'Gangetabellen', '乘法表', 'A: Regn ut. B: Hvilket tall mangler? C: Bytt om tallene. Bruk knepene!', 'A：计算。B：缺哪个数？C：交换两个数。用小窍门！', key)}
    <div class="ref">💡 <b>× 10</b> legg til en null · <b>× 2</b> dobbelt · <b>× 5</b> halvparten av × 10 · <b>× 4</b> dobbelt og dobbelt · <b>× 9</b> × 10 minus én · <b>× 3</b> × 2 og én til · <b>× 6</b> × 5 og én til · <b>× 8</b> dobbelt av × 4<br><span class="zh">× 10 添 0 · × 2 两倍 · × 5 是 × 10 的一半 · × 4 两倍再两倍 · × 9 是 × 10 再减一个 · × 3 是 × 2 再加一个 · × 6 是 × 5 再加一个 · × 8 是 × 4 的两倍</span></div>
    <h3>A · Regn ut <span class="zh">计算</span></h3><div class="eg c3">${d.facts.map(eq).join('')}</div>
    <h3>B · Hvilket tall mangler? <span class="zh">缺哪个数？</span></h3><div class="eg c3">${d.missing.map(miss).join('')}</div>
    <h3>C · Bytt om <span class="zh">交换位置</span></h3><div class="eg c2">${d.swaps.map(swap).join('')}</div></section>`;
}

/* ---- ark 2: gange med 10, 100, 1000 ---- */
function sheet2(d, key){
  const t1 = f => `<div class="eq"><span class="q">${f.a} × ${fmt(P10(f.k))} =</span> ${bl(key, fmt(f.a * P10(f.k)), 20)}</div>`;
  const t2 = f => `<div class="eq w"><span class="q">${fmt(f.A)} × ${fmt(f.B)}</span> &nbsp; ${f.m} × ${f.n} = ${bl(key, f.m * f.n, 10)} &nbsp; nuller: ${bl(key, f.z, 7)} &nbsp; svar: ${bl(key, fmt(f.ans), 20)}</div>`;
  const t3 = f => `<div class="eq"><span class="q">${fmt(f.v)} = ${f.m} × ${bl(key, fmt(f.k), 14)}</span></div>`;
  return `<section class="sheet ${key ? 'key' : 'sheetwrap'}">${header(2, 'Gange med 10, 100, 1 000', '乘 10、100、1 000', 'A: Regn ut. B: Regn uten nullene, tell nullene, og skriv svaret. C: Hva ganget vi med?', 'A：计算。B：先不管 0 来算，数一数 0 的个数，写出答案。C：乘了多少？', key)}
    <div class="ref">💡 Sifrene flytter seg 1, 2 eller 3 plasser mot venstre. <b>30 × 4</b>: regn 3 × 4 = 12 og legg til en null: 120. <span class="zh">数字向左移动 1、2 或 3 位。先算 3 × 4 = 12，再添一个 0。</span></div>
    <h3>A · Regn ut <span class="zh">计算</span></h3><div class="eg c3">${d.tens.map(t1).join('')}</div>
    <h3>B · Tiere og hundrer <span class="zh">整十整百</span></h3><div class="eg c1">${d.compound.map(t2).join('')}</div>
    <h3>C · Hva ganget vi med? <span class="zh">乘了什么？</span></h3><div class="eg c3">${d.back.map(t3).join('')}</div></section>`;
}

/* ---- ark 3: del opp tallet og rutenett ---- */
function sheet3(d, key){
  const grid = t => { const prods = t.parts.map(p => p * t.b);
    return `<div class="tk"><div class="tt"><b>${t.a} × ${t.b}</b></div>${MG.area(t.parts, [t.b], {cells:[prods.map((p, i) => key ? fmt(p) : '')], total:key ? '= ' + fmt(t.a * t.b) : ''})}
      <div class="sl">Sum: ${prods.map(p => bl(key, fmt(p), prods.length === 3 ? 9 : 12)).join(' + ')} = ${bl(key, fmt(t.a * t.b), 12)}</div></div>`; };
  const ext = t => `<div class="eq w"><span class="q">${t.a} = ${t.parts.map((p, i) => bl(key, p, 13)).join(' + ')}</span></div>`;
  const free = t => `<div class="tk f"><div class="tt"><b>${t.a} × ${t.b}</b> = </div><div class="sl">Del opp: ${bl(key, t.parts.join(' + '), 38)}</div><div class="sl">Regn: ${bl(key, t.parts.map(p => fmt(p * t.b)).join(' + '), 60)}</div><div class="sl">Svar: ${bl(key, fmt(t.a * t.b), 24)}</div></div>`;
  return `<section class="sheet ${key ? 'key' : 'sheetwrap'}">${header(3, 'Del opp tallet', '拆分数', 'A: Fyll ut rutenettet og legg sammen. B: Skriv tallet i utvidet form. C: Del opp, regn og skriv svar.', 'A：填写方格图并相加。B：写出数的展开式。C：拆开、计算、写出答案。', key)}
    <div class="ref">💡 <b>276 × 3</b> = (200 + 70 + 6) × 3 = 200 × 3 + 70 × 3 + 6 × 3 = 600 + 210 + 18 = 828 &nbsp;·&nbsp; <span class="zh">把数拆开，每部分分别乘，再加起来</span></div>
    <h3>A · Rutenett <span class="zh">方格图</span></h3><div class="tg c3">${d.grids.map(grid).join('')}</div>
    <h3>B · Utvidet form <span class="zh">展开式</span></h3><div class="eg c2">${d.ext.map(ext).join('')}</div>
    <h3>C · Del opp og regn ut <span class="zh">拆开并计算</span></h3><div class="tg c3">${d.free.map(free).join('')}</div></section>`;
}

/* ---- ark 4: runde av, dobbelt, halvparten ---- */
function sheet4(d, key){
  const rd = t => `<div class="eq w"><span class="q">${fmt(t.a)} × ${t.b} = ${bl(key, fmt(t.R), 12)} × ${t.b} − ${bl(key, t.d, 8)} × ${t.b} = ${bl(key, fmt(t.R * t.b), 13)} − ${bl(key, fmt(t.d * t.b), 11)} = ${bl(key, fmt(t.a * t.b), 14)}</span></div>`;
  const db = t => `<div class="eq w"><span class="q">${t.a} × ${t.k}: &nbsp; ${t.a} → ${bl(key, t.chain[1], 12)} → ${bl(key, t.chain[2], 12)}${t.k === 8 ? ' → ' + bl(key, t.chain[3], 12) : ''}</span> &nbsp; <span class="q">svar: ${bl(key, t.a * t.k, 14)}</span></div>`;
  const hf = t => `<div class="eq w"><span class="q">${t.a} × 5: &nbsp; ${t.a} × 10 = ${bl(key, fmt(t.a * 10), 14)} &nbsp; halvparten = ${bl(key, fmt(t.a * 5), 14)}</span></div>`;
  return `<section class="sheet ${key ? 'key' : 'sheetwrap'}">${header(4, 'Runde av, dobbelt og halvparten', '凑整、两倍和一半', 'A: Rund av og rett opp. B: Dobbelt og dobbelt (× 4) eller tre ganger (× 8). C: Gang med 10 og ta halvparten (× 5).', 'A：凑整再补偿。B：两倍再两倍（× 4）或三次两倍（× 8）。C：先乘 10 再取一半（× 5）。', key)}
    <div class="ref">💡 <b>276 × 3</b> = 300 × 3 − 24 × 3 = 900 − 72 = 828 &nbsp;·&nbsp; <b>298 × 3</b> = 300 × 3 − 2 × 3 = 900 − 6 = 894 <span class="zh">差不多是整数：先用整数乘，再减去多加的部分</span></div>
    <h3>A · Rund av og rett opp <span class="zh">凑整再补偿</span></h3><div class="eg c1">${d.round.map(rd).join('')}</div>
    <h3>B · Dobbelt <span class="zh">两倍</span></h3><div class="eg c1">${d.dbl.map(db).join('')}</div>
    <h3>C · Halvparten av × 10 <span class="zh">× 10 的一半</span></h3><div class="eg c1">${d.half.map(hf).join('')}</div></section>`;
}

/* ---- ark 5: gamlemåten ---- */
function colGrid(a, b, key){
  const ds = String(a).split('').map(Number), L = ds.length; let c = 0; const res = [], carry = [];
  for(let i = 0; i < L; i++){ const t = ds[L - 1 - i] * b + c, last = i === L - 1; res[i] = String(t % 10); if(last && t >= 10) res[i + 1] = String(Math.floor(t / 10)); else if(!last && t >= 10) carry[i + 1] = Math.floor(t / 10); c = Math.floor(t / 10); }
  const cell = (cls, v) => `<td class="${cls}">${v == null ? '' : v}</td>`;
  const pos = fn => { let h = ''; for(let p = 0; p <= L; p++) h += fn(L - p); return h; };
  return `<table class="cg"><tr class="cr"><td class="sg"></td>${pos(i => cell('c', key && i >= 1 && carry[i] ? ans(carry[i]) : ''))}</tr>
    <tr><td class="sg"></td>${pos(i => cell('d', i < L ? ds[L - 1 - i] : ''))}</tr>
    <tr><td class="sg">×</td>${pos(i => cell('d', i === 0 ? b : ''))}</tr>
    <tr class="rl"><td class="sg"></td><td colspan="${L + 1}"></td></tr>
    <tr><td class="sg"></td>${pos(i => cell('r', key && res[i] != null ? ans(res[i]) : ''))}</tr></table>`;
}
function sheet5(d, key){
  const blk = t => `<div class="tk g"><div class="tt"><b>${t.a} × ${t.b}</b></div>${colGrid(t.a, t.b, key)}</div>`;
  return `<section class="sheet ${key ? 'key' : 'sheetwrap'}">${header(5, 'Gamlemåten: oppstilling med mente', '传统竖式和进位', 'Regn ut på gamlemåten. Skriv mente over neste siffer, og skriv svaret under streken.', '用竖式计算。把进位写在下一位的上面，答案写在横线下面。', key)}
    <div class="ref">💡 <b>Start bakerst</b> · <b>skriv enerne</b> · <b>ta tierne med som mente</b> &nbsp; 276 × 3: 6 × 3 = 18 (skriv 8, mente 1) · 7 × 3 + 1 = 22 (skriv 2, mente 2) · 2 × 3 + 2 = 8 → 828 <span class="zh">从后面开始 · 写个位 · 十位进位</span></div>
    <div class="tg c3 big">${d.std.map(blk).join('')}</div></section>`;
}

/* ---- ark 6: tekstoppgaver ---- */
function sheet6(d, key){
  const st = (s, i) => `<div class="story"><div class="sn"><b>${i + 1}.</b> ${s.no}<br><span class="zh">${s.zh}</span></div>
    <div class="sl">Regnestykke / 算式: ${bl(key, `${s.a} × ${s.b} = ${fmt(s.ans)}`, 55)}</div><div class="sl">Svar / 答案: ${bl(key, `${fmt(s.ans)}${s.unit || ''}`, 40)}</div></div>`;
  return `<section class="sheet ${key ? 'key' : 'sheetwrap'}">${header(6, 'Tekstoppgaver', '应用题', 'Les nøye. Skriv regnestykket, regn ut, og skriv svaret.', '仔细读题。写出算式，计算，并写出答案。', key)}
    <div class="ref">💡 1. Hva vet vi? 2. Hva spør oppgaven om? 3. Pluss, minus eller gange? 4. Regn ut og sjekk om svaret er rimelig. <span class="zh">1. 知道什么？2. 问什么？3. 加、减还是乘？4. 计算并检查是否合理。</span></div>
    <div class="stories">${d.stories.map(st).join('')}</div></section>`;
}

/* ---- data ---- */
const shuf = (rnd, a) => a.map(x => [rnd(), x]).sort((p, q) => p[0] - q[0]).map(x => x[1]);
const ri = (rnd, a, b) => a + Math.floor(rnd() * (b - a + 1));
function build(level, seed){
  const rnd = A.seeded(seed), d = {}, orig = Math.random;
  Math.random = rnd;            // gjør oppgavegeneratorene i mult-calc.js deterministiske
  try {
    const tabs = level === 1 ? [2, 3, 4, 5, 10] : level === 2 ? [2, 3, 4, 5, 6, 7, 8, 9, 10] : [3, 4, 6, 7, 8, 9];
    const pairs = []; tabs.forEach(t => { for(let b = 2; b <= 10; b++) pairs.push(rnd() < .5 ? {a:t, b} : {a:b, b:t}); });
    const picked = shuf(rnd, pairs); d.facts = picked.slice(0, 27);
    d.missing = shuf(rnd, picked.slice(27)).slice(0, 9).map(f => Object.assign({}, f, {left:rnd() < .5}));
    d.swaps = shuf(rnd, pairs.filter(f => f.a !== f.b)).slice(0, 4);
    // ark 2
    d.tens = Array.from({length:12}, (_, i) => ({a:ri(rnd, 2, level === 1 ? 20 : 99), k:level === 1 ? 1 : level === 2 ? (i % 2 ? 2 : 1) : [1, 2, 3][i % 3]}));
    d.compound = Array.from({length:8}, (_, i) => { const m = ri(rnd, 2, 9), n = ri(rnd, 2, 9), z = [[1, 0], [0, 1], [2, 0], [1, 1], [0, 2], [3, 0], [2, 1], [1, 2]][level === 1 ? i % 3 : i % 8];
      return {m, n, A:m * P10(z[0]), B:n * P10(z[1]), z:z[0] + z[1], ans:m * n * P10(z[0] + z[1])}; });
    d.back = Array.from({length:6}, () => { const m = ri(rnd, 2, 99), k = [10, 100, 1000][ri(rnd, 0, level === 1 ? 0 : 2)]; return {m, k, v:m * k}; });
    // ark 3
    const nz = (lo, hi) => { let a; do a = ri(rnd, lo, hi); while(a % 10 === 0); return a; };
    const parts = a => M.digitsParts(a);
    d.grids = [nz(12, 98), nz(12, 98), level === 1 ? nz(12, 98) : nz(102, 998), nz(12, 98), level === 1 ? nz(12, 98) : nz(102, 998), level === 3 ? nz(102, 998) : nz(12, 98)].map((a, i) => ({a, b:ri(rnd, 2, level === 1 ? 5 : 9), parts:parts(a)}));
    d.ext = [nz(12, 98), nz(102, 998), nz(12, 98), nz(102, 998), nz(12, 98), nz(102, 998)].map(a => ({a, parts:parts(a)}));
    d.free = [nz(12, 98), level === 1 ? nz(12, 98) : nz(102, 998), level === 3 ? nz(102, 998) : nz(12, 98)].map(a => ({a, b:ri(rnd, 2, level === 1 ? 5 : 9), parts:parts(a)}));
    // ark 4
    d.round = Array.from({length:5}, (_, i) => { const big = level >= 2 && i >= 2, R = big ? ri(rnd, 2, 10) * 100 : ri(rnd, 2, 10) * 10, dd = big ? ri(rnd, 1, level === 3 ? 30 : 12) : ri(rnd, 1, 3), b = ri(rnd, 2, 9); return {a:R - dd, R, d:dd, b}; });
    d.dbl = Array.from({length:4}, (_, i) => { const k = i < 2 ? 4 : 8, a = ri(rnd, 6, k === 4 ? 49 : 25); return {a, k, chain:[a, a * 2, a * 4, a * 8]}; });
    d.half = Array.from({length:4}, () => ({a:ri(rnd, 6, level === 1 ? 30 : 90)}));
    // ark 5
    const stdNum = len => { for(let t = 0; t < 200; t++){ const b = ri(rnd, 2, 9), a = ri(rnd, P10(len - 1), P10(len) - 1); if(String(a).split('').some(x => x * b >= 10)) return {a, b}; } return {a:len === 2 ? 47 : len === 3 ? 276 : 1234, b:3}; };
    d.std = level === 1 ? [2, 2, 2, 2, 2, 3, 3, 3, 3].map(stdNum) : level === 2 ? [2, 2, 3, 3, 3, 3, 3, 4, 4].map(stdNum) : [3, 3, 3, 4, 4, 4, 4, 4, 4].map(stdNum);
    // ark 6
    const kinds = ['groups', 'price', 'rows', 'times', 'perday'];
    d.stories = shuf(rnd, kinds).slice(0, 5).map((k, i) => M.storyModel(k, level === 1 ? 1 : level === 2 ? (i < 3 ? 1 : 2) : (i < 2 ? 2 : 3)));
  } finally { Math.random = orig; }
  return d;
}

A.MultWorksheets = {
  build(level, seed){
    const d = build(level, seed), sheets = [sheet1, sheet2, sheet3, sheet4, sheet5, sheet6];
    return {sheets:sheets.map(f => f(d, false)).join(''), keys:sheets.map(f => f(d, true)).join('')};
  }
};
})();
