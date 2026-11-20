(function(){
'use strict';
/* Gangesystemet: 8 skriveark med fasit. Samme lenke (#s=<tall>) gir samme ark, så fasiten stemmer. */
const A = window.App, GS = A.GS, G = GS.G, MG = A.MG;
const ans = t => `<span class="ans">${t}</span>`;
const bl = (key, v, w) => key ? `<span class="fl">${ans(v)}</span>` : `<span class="bl" style="min-width:${w || 14}mm"></span>`;
const tag = g => `<span class="gt" style="--c:${G[g].c};--bg:${G[g].bg}">${G[g].emoji} ${G[g].short}</span>`;

const header = (n, noT, zhT, noI, zhI, key) => `
  <div class="shead"><div class="stitle"><span class="num">${n}</span><div><h2>${noT}${key ? ' · FASIT' : ''}</h2><div class="zh">${zhT}${key ? ' · 答案' : ''}</div></div></div>
  <div class="who">Navn / 姓名: <span class="ln"></span> &nbsp; Dato / 日期: <span class="ln s"></span> &nbsp; ⭐⭐⭐</div></div>
  <div class="instr">✏️ ${noI}<br><span class="zh">${zhI}</span></div>`;
const sheet = (key, n, noT, zhT, noI, zhI, ref, body) => `<section class="sheet ${key ? 'key' : 'sheetwrap'}">${header(n, noT, zhT, noI, zhI, key)}${ref ? `<div class="ref">💡 ${ref}</div>` : ''}${body}</section>`;
const h3 = (l, no, zh) => `<h3>${l} · ${no} <span class="zh">${zh}</span></h3>`;
const eq = (key, a, b, w) => `<div class="eq"><span class="q">${a} × ${b} =</span> ${bl(key, a * b, w || 13)}</div>`;
const grid = (cls, items) => `<div class="eg ${cls}">${items.join('')}</div>`;

/* ---- ark 1: systemet ---- */
function s1(d, key){
  const rows = GS.GROUPS.map(g => `<span class="kk" style="--c:${g.c};--bg:${key ? g.bg : '#fff'}"><i></i> <b>${g.short}</b> ${g.no} <span class="zh">${g.zh}</span></span>`).join('');
  const table = `<div class="tbc">${GS.table(key ? {all:true} : {})}</div>`;
  const cnt = GS.GROUPS.map(g => `<span class="cnt" style="--c:${g.c}">${tag(g.id)} ${bl(key, GS.FACTS[g.id].length, 10)}</span>`).join('');
  const fun = [[100, 'Hele tabellen'], [55, 'uten speilvendte'], [28, 'uten 1-, 2-, 10-gangen'], [21, 'uten 5-gangen'], [15, 'uten like × like'], [10, 'uten 9-regelen']].map((s, i) => i === 0 ? `<span class="fn"><span class="fa"><b>100</b></span><small>${s[1]}</small></span>` : `<span class="fn"><span class="fa">→ ${bl(key, s[0], 11)}</span><small>${s[1]}</small></span>`).join('');
  return sheet(key, 1, 'Systemet: fra 100 til 10', '整体思路：从 100 到 10',
    'Fargelegg tabellen med rett farge. Spør i denne rekkefølgen: 1) Er en av faktorene 1, 2 eller 10? 2) Er en av dem 5? 3) Er de like? 4) Er en av dem 9? 5) Ellers: må læres.',
    '给乘法表涂上正确的颜色。按这个顺序问：1）有一个因数是 1、2 或 10 吗？2）有 5 吗？3）两个因数相同吗？4）有 9 吗？5）都不是：要背下来。',
    '<b>Speilvendte</b> (5 × 6 = 6 × 5) behøver du bare lære én gang. Tell derfor bare den ene halvdelen: rutene der kolonnetallet er lik eller større enn radtallet. <span class="zh">对称的算式只需学一次，所以只数一半：列数不小于行数的格子。</span>',
    `<div class="kl">${rows}</div>${table}
     ${h3('A', 'Hvor mange regnestykker i hver farge?', '每种颜色有几道算式？')}<div class="cnts">${cnt}<span class="cnt"><b>Sum</b> ${bl(key, 55, 10)}</span></div>
     ${h3('B', 'Slik krymper tabellen', '乘法表是这样变小的')}<div class="funl">${fun}</div>`);
}

/* ---- ark 2: speilvendte + 1-, 2-, 10-gangen ---- */
function s2(d, key){
  const mir = f => `<div class="eq"><span class="q">${f[0]} × ${f[1]} = ${f[0] * f[1]}</span> &nbsp;→&nbsp; <span class="q">${f[1]} × ${f[0]} =</span> ${bl(key, f[0] * f[1], 12)}</div>`;
  const miss = f => `<div class="eq"><span class="q">${f[2] ? f[0] + ' × ' + bl(key, f[1], 10) : bl(key, f[1], 10) + ' × ' + f[0]} = ${f[0] * f[1]}</span></div>`;
  return sheet(key, 2, 'Speilvendte og 1-, 2-, 10-gangen', '对称的算式和 1、2、10 的乘法',
    'A: Bruk det du vet og skriv det speilvendte regnestykket. B: Regn ut. C: Hvilket tall mangler?',
    'A：利用已知的，写出对称的算式。B：计算。C：缺哪个数？',
    '<b>× 1</b> samme tall · <b>× 10</b> en null bak · <b>× 2</b> dobbelt (tallet + tallet) <span class="zh">× 1 数不变 · × 10 后面加 0 · × 2 是两倍</span>',
    `${h3('A', 'Speilvendt', '对称')}${grid('c2', d.mir.map(mir))}${h3('B', 'Regn ut', '计算')}${grid('c3', d.easy.map(f => eq(key, f[0], f[1])))}${h3('C', 'Hva mangler?', '缺哪个数？')}${grid('c3', d.easyMiss.map(miss))}`);
}

/* ---- ark 3: 5-gangen ---- */
function s3(d, key){
  const half = n => `<div class="eq w"><span class="q">${n} × 5: &nbsp; ${n} × 10 = ${bl(key, n * 10, 13)} &nbsp; halvparten = ${bl(key, n * 5, 13)}</span></div>`;
  const even = n => `<div class="eq w"><span class="q">${n} × 5: &nbsp; halvparten av ${n} = ${bl(key, n / 2, 9)} &nbsp; null bak = ${bl(key, n * 5, 12)}</span></div>`;
  return sheet(key, 3, '5-gangen', '5 的乘法',
    'A: Gang med 10 og ta halvparten. B: Partall: ta halvparten av tallet og sett en null bak. C: Regn ut.',
    'A：先乘 10，再取一半。B：偶数：先取数的一半，再在后面加 0。C：计算。',
    '<b>y × 5 = (y × 10) ÷ 2</b> &nbsp; Svaret ender alltid på <b>0</b> eller <b>5</b>. <span class="zh">答案的个位总是 0 或 5。</span>',
    `${h3('A', 'Halvparten av 10-gangen', '10 的乘法的一半')}${grid('c1', d.halfN.map(half))}${h3('B', 'Partall', '偶数')}${grid('c1', d.evenN.map(even))}${h3('C', 'Regn ut', '计算')}${grid('c3', d.five.map(f => eq(key, f[0], f[1])))}`);
}

/* ---- ark 4: kvadrattall ---- */
function s4(d, key){
  const sq = n => `<div class="tk sqk"><div class="tt"><b>${n} × ${n} =</b> ${bl(key, n * n, 11)}</div>${MG.dots(n, n, {s:9, r:3.4, c1:G.sq.c})}</div>`;
  const odd = `<div class="oddl"><b>9</b>${[7, 9, 11, 13, 15, 17].map((k, i) => ` <span class="pl">+${k}</span> → ${bl(key, [16, 25, 36, 49, 64, 81][i], 11)}`).join('')}</div>`;
  const row = f => `<div class="eq"><span class="q">${f[0]} × ${f[1]} =</span> ${bl(key, f[0] * f[1], 13)} <span class="chk">${key ? (f[0] === f[1] ? ans('✓') : '') : '☐'} <small>like × like</small></span></div>`;
  return sheet(key, 4, 'Like × like (kvadrattall)', '相同两数相乘（平方数）',
    'A: Skriv svaret. Tell prikkene hvis du er usikker. B: Legg til neste oddetall. C: Regn ut, og kryss av når det er like × like.',
    'A：写出答案。不确定就数点。B：每次加下一个奇数。C：计算；如果是两个相同的数相乘，就打勾。',
    '<b>3 × 3 = 9 · 4 × 4 = 16 · 6 × 6 = 36 · 7 × 7 = 49 · 8 × 8 = 64 · 9 × 9 = 81</b> &nbsp; (2 × 2, 5 × 5 og 10 × 10 kan du fra de lette gangene) <span class="zh">2 × 2、5 × 5、10 × 10 在简单的乘法里已经会了</span>',
    `${h3('A', 'Kvadrater', '正方形')}<div class="tg c3">${[3, 4, 6, 7, 8, 9].map(sq).join('')}</div>${h3('B', 'Neste oddetall', '下一个奇数')}${odd}${h3('C', 'Like × like?', '相同两数相乘？')}${grid('c3', d.sqMix.map(row))}`);
}

/* ---- ark 5: 9-gangen ---- */
function s5(d, key){
  const nine = f => { const n = f[0] === 9 ? f[1] : f[0]; return `<div class="eq w"><span class="q">${f[0]} × ${f[1]} = ${n} × 10 − ${n} = ${bl(key, n * 10, 11)} − ${bl(key, n, 8)} = ${bl(key, n * 9, 11)}</span></div>`; };
  const chk = n => `<div class="eq w"><span class="q">${n} × 9 = ${bl(key, n * 9, 11)} &nbsp; sifrene: ${bl(key, Math.floor(n * 9 / 10), 7)} + ${bl(key, n * 9 % 10, 7)} = ${bl(key, 9, 7)}</span></div>`;
  return sheet(key, 5, '9-gangen med regel', '9 的乘法（有规则）',
    'A: Gang med 10 og trekk fra tallet. B: Regn ut og sjekk at sifrene i svaret blir 9 til sammen. C: Regn ut.',
    'A：先乘 10，再减去这个数。B：计算，并检查答案的两个数字加起来是否是 9。C：计算。',
    '<b>y × 9 = (y × 10) − y</b> &nbsp; 7 × 9 = 70 − 7 = 63 &nbsp; Sjekk: 6 + 3 = 9 <span class="zh">先乘 10，再减去这个数。检查：6 + 3 = 9</span>',
    `${h3('A', 'Gang med 10, trekk fra', '乘 10，再减')}${grid('c1', d.nine.map(nine))}${h3('B', 'Sjekk sifrene', '检查数字')}${grid('c1', d.nineN.map(chk))}${h3('C', 'Regn ut', '计算')}${grid('c3', d.nineMix.map(f => eq(key, f[0], f[1])))}`);
}

/* ---- ark 6: de 10 som må pugges ---- */
function s6(d, key){
  const dbl2 = n => `<div class="eq w"><span class="q">${n} × 4: &nbsp; ${n} → ${bl(key, n * 2, 11)} → ${bl(key, n * 4, 11)}</span></div>`;
  const dbl3 = n => `<div class="eq w"><span class="q">${n} × 8: &nbsp; ${n} → ${bl(key, n * 2, 10)} → ${bl(key, n * 4, 10)} → ${bl(key, n * 8, 10)}</span></div>`;
  const use = [
    `<div class="eq w"><span class="q">3 × 7 = 2 × 7 + 7 = ${bl(key, 14, 9)} + 7 = ${bl(key, 21, 10)}</span></div>`,
    `<div class="eq w"><span class="q">6 × 7 = 5 × 7 + 7 = ${bl(key, 35, 9)} + 7 = ${bl(key, 42, 10)}</span></div>`,
    `<div class="eq w"><span class="q">3 × 6 = 2 × (3 × 3) = 2 × ${bl(key, 9, 9)} = ${bl(key, 18, 10)}</span></div>`,
    `<div class="eq w"><span class="q">Rekka 5, 6, 7, 8: &nbsp; 56 = ${bl(key, 7, 8)} × ${bl(key, 8, 8)}</span></div>`
  ];
  return sheet(key, 6, 'De 10 som må pugges', '要背的 10 个',
    'A: Doble to ganger (× 4). B: Doble tre ganger (× 8). C: Bruk det du kan. D: Skriv svaret uten hjelp, og ta tiden!',
    'A：连续翻两倍（× 4）。B：连续翻三倍（× 8）。C：用你已经会的。D：不看提示写答案，并计时！',
    '<b>3 × 4 = 12 · 3 × 6 = 18 · 3 × 7 = 21 · 3 × 8 = 24 · 4 × 6 = 24 · 4 × 7 = 28 · 4 × 8 = 32 · 6 × 7 = 42 · 6 × 8 = 48 · 7 × 8 = 56</b>',
    `${h3('A', '4-gangen = doble to ganger', '4 的乘法 = 翻两倍')}<div class="eg c2">${[3, 6, 7, 8].map(dbl2).join('')}</div>${h3('B', '8-gangen = doble tre ganger', '8 的乘法 = 翻三倍')}<div class="eg c2">${[3, 4, 6, 7].map(dbl3).join('')}</div>${h3('C', 'Bruk det du kan', '用你已经会的')}<div class="eg c1">${use.join('')}</div>${h3('D', 'Uten hjelp · Tid: ____ min', '不看提示 · 用时')}${grid('c4', d.learn.map(f => eq(key, f[0], f[1], 11)))}`);
}

/* ---- ark 7: hvilken regel gjelder? ---- */
function s7(d, key){
  const head = `<div class="rh"><span class="rq"></span>${GS.GROUPS.map(g => `<span class="rb">${tag(g.id)}</span>`).join('')}<span class="ra">svar</span></div>`;
  const row = f => { const c = GS.classify(f[0], f[1]);
    return `<div class="rr"><span class="rq"><b>${f[0]} × ${f[1]}</b></span>${GS.GROUPS.map(g => `<span class="rb"><i class="bx" style="--c:${g.c}">${key && g.id === c.g ? ans('✓') : ''}</i></span>`).join('')}<span class="ra">${bl(key, f[0] * f[1], 12)}</span></div>`; };
  return sheet(key, 7, 'Hvilken regel gjelder?', '用哪条规则？',
    'Sett kryss i riktig rute. Spør i riktig rekkefølge: 1·2·10? → 5? → like? → 9? → ellers må det læres. Regn så ut svaret.',
    '在正确的格子里打勾。按顺序问：1·2·10？→ 5？→ 相同？→ 9？→ 否则要背下来。然后算出答案。',
    '<b>1·2·10</b> lett &nbsp; <b>5</b> halvparten av × 10 &nbsp; <b>y × y</b> kvadrattall &nbsp; <b>9</b> (y × 10) − y &nbsp; <b>Pugg</b> de 10 <span class="zh">简单 · 10 的一半 · 平方数 · 9 的规则 · 要背的 10 个</span>',
    `<div class="rt">${head}${d.which.map(row).join('')}</div>`);
}

/* ---- ark 8: mesterprøve – hele tabellen ---- */
function s8(d, key){
  let t = `<table class="gfill"><tr><th>×</th>${Array.from({length:10}, (_, i) => `<th>${i + 1}</th>`).join('')}</tr>`;
  for(let a = 1; a <= 10; a++){
    t += `<tr><th>${a}</th>`;
    for(let b = 1; b <= 10; b++) t += `<td${key ? ` class="g-${GS.classify(a, b).g}"` : ''}>${key ? ans(a * b) : ''}</td>`;
    t += '</tr>';
  }
  t += '</table>';
  return sheet(key, 8, 'Mesterprøve: hele tabellen', '大考验：整个乘法表',
    'Fyll ut hele tabellen. Start med det som er lett (1, 2, 10 og 5), så kvadrattallene og 9-gangen, og til slutt de 10 du må pugge. Tid: ____ min &nbsp; Riktige: ____ / 100',
    '填写整个乘法表。先做简单的（1、2、10 和 5），再做平方数和 9 的乘法，最后是要背的 10 个。用时：____ 分钟　答对：____ / 100',
    `<span class="kl2">${GS.GROUPS.map(g => `<span class="kk" style="--c:${g.c};--bg:${key ? g.bg : '#fff'}"><i></i> ${g.short}</span>`).join('')}</span>`,
    `<div class="tbc">${t}</div>`);
}

/* ---- data ---- */
function build(seed){
  const rnd = A.seeded(seed), d = {};
  const shuf = a => a.map(x => [rnd(), x]).sort((p, q) => p[0] - q[0]).map(x => x[1]);
  const ordered = (gid, filter) => { const out = []; GS.FACTS[gid].forEach(f => { out.push([f[0], f[1]]); if(f[0] !== f[1]) out.push([f[1], f[0]]); }); return filter ? out.filter(filter) : out; };
  const take = (list, n) => shuf(list).slice(0, n);
  const allOrdered = GS.GROUPS.flatMap(g => ordered(g.id));
  d.mir = take(allOrdered.filter(f => f[0] !== f[1] && f[0] >= 3 && f[1] >= 3), 6);
  const easyOrd = ordered('easy', f => !(f[0] === 1 && f[1] === 1));
  d.easy = take(easyOrd, 18);
  d.easyMiss = take(easyOrd, 6).map(f => [f[0], f[1], rnd() < .5]);
  d.halfN = shuf([3, 4, 5, 6, 7, 8, 9]).slice(0, 6);
  d.evenN = shuf([4, 6, 8, 12, 14, 16]).slice(0, 4);
  d.five = take(ordered('five'), 12);
  d.sqMix = take(ordered('sq').concat(take(ordered('learn').concat(ordered('nine')), 8)), 12);
  d.sqMix = shuf(d.sqMix);
  d.nine = take(ordered('nine'), 6);
  d.nineN = shuf([3, 4, 6, 7, 8]).slice(0, 4);
  d.nineMix = take(ordered('nine').concat([[9, 9]]), 12);
  d.learn = shuf(ordered('learn'));
  const pickG = (gid, n) => take(ordered(gid), n);
  d.which = shuf(GS.GROUPS.flatMap(g => pickG(g.id, 4)));
  return d;
}

A.GsWorksheets = {
  build(seed){
    const d = build(seed), sheets = [s1, s2, s3, s4, s5, s6, s7, s8];
    return {sheets:sheets.map(f => f(d, false)).join(''), keys:sheets.map(f => f(d, true)).join('')};
  }
};
})();
