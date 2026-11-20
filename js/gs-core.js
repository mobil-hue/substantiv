(function(){
'use strict';
/* Gangesystemet: gruppene (hvilken regel gjelder?), klassifisering, forklaringer, fremgang og tabelltegning.
   Systemet (fra «Den lille gangetabellen»): 100 ruter → speilvendte ut (55) → 1-, 2-, 10-gangen ut (28)
   → 5-gangen ut (21) → like × like ut (15) → 9-regelen ut (10) → de 10 som må læres. */
const A = window.App;
const GS = A.GS = window.GS = {};
const bi = A.bi;

/* ---------- grupper ---------- */
GS.GROUPS = [
  {id:'easy', emoji:'🟢', short:'1·2·10', bg:'#b9e07f', c:'#4d7c0f', no:'1-, 2- og 10-gangen', zh:'1、2、10 的乘法',
   rule:['Lett – tre små triks', '很简单——三个小窍门']},
  {id:'five', emoji:'🟠', short:'5', bg:'#fcd28a', c:'#b45309', no:'5-gangen', zh:'5 的乘法',
   rule:['y × 5 = halvparten av (y × 10)', 'y × 5 = (y × 10) 的一半']},
  {id:'sq', emoji:'🟦', short:'y × y', bg:'#a7e8d0', c:'#0f766e', no:'Like × like (kvadrattall)', zh:'相同两数相乘（平方数）',
   rule:['Pugges som en egen liten gruppe (6)', '作为一小组背下来（6 个）']},
  {id:'nine', emoji:'🩷', short:'9', bg:'#f9c0d8', c:'#be185d', no:'9-gangen med regel', zh:'9 的乘法（有规则）',
   rule:['y × 9 = (y × 10) − y', 'y × 9 = (y × 10) − y']},
  {id:'learn', emoji:'🟣', short:'Pugg', bg:'#d4cffa', c:'#5b21b6', no:'Må læres', zh:'要背下来的',
   rule:['Ingen enkel regel – pugg disse 10 (med triks)', '没有简单规则——背下这 10 个（有小窍门）']}
];
GS.G = {}; GS.GROUPS.forEach(g => { GS.G[g.id] = g; });
GS.MIRROR = {id:'mirror', emoji:'🪞', bg:'#e5e7eb', c:'#6b7280', no:'Speilvendte', zh:'对称的算式'};

/* regelen som faktisk brukes (undergrupper i 1-, 2-, 10-gangen) */
GS.RULES = {
  one:  {g:'easy', no:'1-gangen', zh:'1 的乘法', f:'y × 1 = y', line:['Gange med 1 gir det samme tallet', '乘 1，数不变']},
  ten:  {g:'easy', no:'10-gangen', zh:'10 的乘法', f:'y × 10 = y og en null bak', line:['Sett en null bak tallet', '在数的后面加一个 0']},
  two:  {g:'easy', no:'2-gangen', zh:'2 的乘法', f:'y × 2 = y + y', line:['Dobbelt: tallet pluss tallet', '两倍：这个数加这个数']},
  five: {g:'five', no:'5-gangen', zh:'5 的乘法', f:'y × 5 = (y × 10) ÷ 2', line:['Halvparten av ti-gangen', '10 的乘法的一半']},
  sq:   {g:'sq', no:'Kvadrattall', zh:'平方数', f:'y × y', line:['Like × like: pugges som en egen liten gruppe', '相同两数相乘：作为一小组背下来']},
  nine: {g:'nine', no:'9-gangen', zh:'9 的乘法', f:'y × 9 = (y × 10) − y', line:['Gang med 10 og trekk fra tallet én gang', '先乘 10，再减去这个数一次']},
  learn:{g:'learn', no:'Må læres', zh:'要背下来', f:'pugg + triks', line:['Ingen enkel regel – men du har triks', '没有简单规则——但有小窍门']}
};

/* ---------- klassifisering: i denne rekkefølgen ---------- */
GS.classify = function(a, b){
  const x = Math.min(a, b), y = Math.max(a, b);
  let sub;
  if(x === 1) sub = 'one';
  else if(y === 10) sub = 'ten';
  else if(x === 2) sub = 'two';
  else if(x === 5 || y === 5) sub = 'five';
  else if(x === y) sub = 'sq';
  else if(y === 9) sub = 'nine';
  else sub = 'learn';
  return {g:GS.RULES[sub].g, sub, x, y};
};

/* alle unike regnestykker (x ≤ y) per gruppe */
GS.FACTS = {easy:[], five:[], sq:[], nine:[], learn:[]};
GS.ALL = [];
for(let x = 1; x <= 10; x++) for(let y = x; y <= 10; y++){ GS.ALL.push([x, y]); GS.FACTS[GS.classify(x, y).g].push([x, y]); }

/* trinnene i tabellen: hvilket trinn et felt «tas ut» på */
GS.STEPS = [
  {n:1, count:100, bar:'#d6d3c4', no:'Hele tabellen', zh:'整个乘法表', sub:['100 ruter', '100 个格子']},
  {n:2, count:55, bar:'#d6d3c4', no:'Uten speilvendte', zh:'去掉对称的', sub:['55 unike (5 × 6 = 6 × 5)', '55 个不同的（5 × 6 = 6 × 5）']},
  {n:3, count:28, bar:'#9ac45b', no:'Uten 1-, 2- og 10-gangen', zh:'去掉 1、2、10 的乘法', sub:['28 igjen (27 lette bort)', '剩 28 个（27 个很容易）']},
  {n:4, count:21, bar:'#f9c26b', no:'Uten 5-gangen', zh:'去掉 5 的乘法', sub:['21 igjen (7 bort)', '剩 21 个（去掉 7 个）']},
  {n:5, count:15, bar:'#8fdcc0', no:'Like × like ut', zh:'去掉相同两数相乘', sub:['6 kvadrattall → 15 igjen', '6 个平方数 → 剩 15 个']},
  {n:6, count:10, bar:'#f4aecb', no:'Resten av 9-gangen ut', zh:'去掉 9 的乘法', sub:['5 med 9-regelen → 10 igjen', '5 个用 9 的规则 → 剩 10 个']},
  {n:7, count:10, bar:'#c4bdf5', no:'Det som må læres', zh:'要背的', sub:['10 regnestykker', '10 道算式']}
];
const REMOVAL = {easy:3, five:4, sq:5, nine:6, learn:7};
GS.removal = (a, b) => a > b ? 2 : REMOVAL[GS.classify(a, b).g];

/* ---------- fremgang (per unikt regnestykke) ---------- */
const SK = 'gs_facts';
let facts = A.store.get(SK, {});
GS.key = (a, b) => Math.min(a, b) + '-' + Math.max(a, b);
GS.stat = (a, b) => facts[GS.key(a, b)] || null;
// nivå: new (ikke øvd) · weak (sliter) · learning · sure (sikker)
GS.level = function(a, b){
  const s = GS.stat(a, b);
  if(!s || s.r + s.w === 0) return 'new';
  if(s.b >= 3) return 'sure';
  if(s.b >= 1) return 'learning';
  return 'weak';
};
GS.record = function(a, b, res){   // res: 'ok' | 'wrong' | 'help'
  const k = GS.key(a, b), s = facts[k] || (facts[k] = {r:0, w:0, h:0, b:0, t:0});
  if(res === 'ok'){ s.r++; s.b = Math.min(5, s.b + 1); }
  else if(res === 'wrong'){ s.w++; s.b = 0; }
  else s.h++;
  s.t = Date.now();
  A.store.set(SK, facts); GS.saveSummary();
};
GS.sureCount = list => list.filter(f => GS.level(f[0], f[1]) === 'sure').length;
GS.saveSummary = function(){ A.store.set('sum_gs', {done:GS.sureCount(GS.ALL), total:GS.ALL.length}); };
GS.resetStats = function(){ facts = {}; A.store.set(SK, facts); GS.saveSummary(); };
GS.weight = function(a, b){
  const s = GS.stat(a, b);
  if(!s || s.r + s.w === 0) return 3;
  return [6, 4, 2.5, 1.4, .8, .4][s.b];
};
/* trekk n regnestykker fra poolen: litt mer av det eleven sliter med, uten umiddelbar gjentakelse */
GS.pickFacts = function(pool, n){
  const out = []; let bag = [], prev = null;
  while(out.length < n){
    if(!bag.length) bag = pool.slice();
    let sum = bag.reduce((s, f) => s + GS.weight(f[0], f[1]), 0), r = Math.random() * sum, i = 0;
    for(; i < bag.length - 1; i++){ r -= GS.weight(bag[i][0], bag[i][1]); if(r <= 0) break; }
    let f = bag[i];
    if(prev && f[0] === prev[0] && f[1] === prev[1] && (bag.length > 1 || pool.length > 1)){
      const alt = bag.findIndex(g => !(g[0] === prev[0] && g[1] === prev[1]));
      if(alt >= 0){ i = alt; f = bag[i]; } else if(pool.length > 1){ bag = pool.slice(); continue; }
    }
    bag.splice(i, 1); out.push(f); prev = f;
  }
  return out;
};

/* ---------- triks for de 10 som må læres ---------- */
// chain = dobling (vises som brikker). t = forklaring med tall (leses opp)
const LEARN = {
  '3-4': {chain:[3, 6, 12], no:'4-gangen er å doble to ganger: 3, 6, 12.', zh:'4 的乘法就是连续翻两倍：3、6、12。'},
  '3-6': {no:'3 × 3 = 9, og så dobbelt: 9 + 9 = 18.', zh:'3 × 3 等于 9，再翻倍：9 + 9 = 18。'},
  '3-7': {no:'To ganger 7 er 14, og én 7 til: 14 + 7 = 21.', zh:'两个 7 是 14，再加一个 7：14 + 7 = 21。'},
  '3-8': {chain:[3, 6, 12, 24], no:'8-gangen er å doble tre ganger: 3, 6, 12, 24.', zh:'8 的乘法就是连续翻三倍：3、6、12、24。'},
  '4-6': {chain:[6, 12, 24], no:'4-gangen er å doble to ganger: 6, 12, 24.', zh:'4 的乘法就是连续翻两倍：6、12、24。'},
  '4-7': {chain:[7, 14, 28], no:'4-gangen er å doble to ganger: 7, 14, 28.', zh:'4 的乘法就是连续翻两倍：7、14、28。'},
  '4-8': {chain:[8, 16, 32], no:'4-gangen er å doble to ganger: 8, 16, 32.', zh:'4 的乘法就是连续翻两倍：8、16、32。'},
  '6-7': {no:'Fem ganger 7 er 35, og én 7 til: 35 + 7 = 42.', zh:'五个 7 是 35，再加一个 7：35 + 7 = 42。'},
  '6-8': {chain:[6, 12, 24, 48], no:'8-gangen er å doble tre ganger: 6, 12, 24, 48.', zh:'8 的乘法就是连续翻三倍：6、12、24、48。'},
  '7-8': {chain:[5, 6, 7, 8], chainNote:true, no:'Husk rekka 5, 6, 7, 8: 56 = 7 × 8.', zh:'记住数列 5、6、7、8：56 = 7 × 8。'}
};

/* ---------- spørsmålene som finner regelen ---------- */
GS.QUESTIONS = [
  {g:'easy', no:'Er en av faktorene 1, 2 eller 10?', zh:'其中一个因数是 1、2 或 10 吗？', test:(x, y) => x === 1 || x === 2 || y === 10},
  {g:'five', no:'Er en av faktorene 5?', zh:'其中一个因数是 5 吗？', test:(x, y) => x === 5 || y === 5},
  {g:'sq', no:'Er faktorene like (like × like)?', zh:'两个因数相同吗（like × like）？', test:(x, y) => x === y},
  {g:'nine', no:'Er en av faktorene 9?', zh:'其中一个因数是 9 吗？', test:(x, y) => x === 9 || y === 9},
  {g:'learn', no:'Ingen av dem → må læres', zh:'都不是 → 要背下来', test:() => true, last:true}
];
GS.trace = function(a, b){
  const x = Math.min(a, b), y = Math.max(a, b), out = [];
  for(const q of GS.QUESTIONS){
    const yes = q.test(x, y);
    out.push({g:q.g, no:q.no, zh:q.zh, yes, last:!!q.last});
    if(yes) break;
  }
  return out;
};
GS.traceHTML = function(a, b){
  return `<ol class="gtrace">${GS.trace(a, b).map(q => `<li class="${q.yes ? 'y' : 'n'}" style="--c:${GS.G[q.g].c};--bg:${GS.G[q.g].bg}"><span class="tk">${q.yes ? '✅' : '❌'}</span><span class="tx">${bi(q.no, q.zh)}</span>${q.yes ? `<span class="tg">${GS.badge(q.g)}</span>` : ''}</li>`).join('')}</ol>`;
};

/* ---------- forklaring på et regnestykke ---------- */
GS.explain = function(a, b){
  const c = GS.classify(a, b), R = GS.RULES[c.sub], G = GS.G[c.g], ans = a * b, steps = [];
  let n, chain = null;
  if(a > b) steps.push({no:`Snu først: ${a} × ${b} er det samme som ${b} × ${a}.`, zh:`先交换位置：${a} × ${b} 和 ${b} × ${a} 的结果一样。`});
  switch(c.sub){
    case 'one':
      n = c.y;
      steps.push({no:`Å gange med 1 gir det samme tallet: ${n} × 1 = ${n}.`, zh:`乘 1，数不变：${n} × 1 = ${n}。`});
      break;
    case 'ten':
      n = c.x;
      steps.push({no:`Sett en null bak ${n}: ${n} × 10 = ${ans}.`, zh:`在 ${n} 后面加一个 0：${n} × 10 = ${ans}。`});
      break;
    case 'two':
      n = c.y;
      steps.push({no:`Dobbelt: ${n} × 2 = ${n} + ${n} = ${ans}.`, zh:`两倍：${n} × 2 = ${n} + ${n} = ${ans}。`});
      break;
    case 'five':
      n = c.x === 5 ? c.y : c.x;
      steps.push({no:`Først 10-gangen: ${n} × 10 = ${n * 10}.`, zh:`先算 10 的乘法：${n} × 10 = ${n * 10}。`});
      steps.push({no:`Så halvparten: ${n * 10} ÷ 2 = ${ans}.`, zh:`再取一半：${n * 10} ÷ 2 = ${ans}。`});
      if(n % 2 === 0) steps.push({no:`Eller: halvparten av ${n} er ${n / 2}, og så en null bak: ${ans}.`, zh:`或者：${n} 的一半是 ${n / 2}，后面加 0：${ans}。`});
      steps.push({no:`Svaret i 5-gangen ender alltid på 0 eller 5.`, zh:`5 的乘法的答案，个位总是 0 或 5。`});
      break;
    case 'sq': {
      n = c.x; const m = n - 1;
      steps.push({no:`${n} × ${n} = ${ans} er et kvadrattall. Pugg det sammen med de andre kvadrattallene.`, zh:`${n} × ${n} = ${ans} 是平方数。和其他平方数一起背下来。`});
      steps.push({no:`Tips: ${m} × ${m} = ${m * m}, og ${m * m} + ${2 * n - 1} = ${ans}.`, zh:`提示：${m} × ${m} = ${m * m}，${m * m} + ${2 * n - 1} = ${ans}。`});
      break; }
    case 'nine': {
      n = c.x;
      steps.push({no:`Gang med 10: ${n} × 10 = ${n * 10}.`, zh:`先乘 10：${n} × 10 = ${n * 10}。`});
      steps.push({no:`Trekk fra ${n} én gang: ${n * 10} − ${n} = ${ans}.`, zh:`再减去一个 ${n}：${n * 10} − ${n} = ${ans}。`});
      steps.push({no:`Sjekk: sifrene i ${ans} blir 9 til sammen: ${Math.floor(ans / 10)} + ${ans % 10}.`, zh:`检查：${ans} 的两个数字加起来是 9：${Math.floor(ans / 10)} + ${ans % 10}。`});
      break; }
    default: {
      const t = LEARN[GS.key(a, b)];
      steps.push({no:`Ingen enkel regel – pugg ${c.x} × ${c.y} = ${ans}.`, zh:`没有简单规则——背下 ${c.x} × ${c.y} = ${ans}。`});
      if(t){ steps.push({no:'Trikset: ' + t.no, zh:'窍门：' + t.zh}); chain = t.chain ? {list:t.chain, note:!!t.chainNote} : null; }
    }
  }
  return {c, R, G, ans, steps, chain, n};
};
GS.badge = function(g, text){
  const G = GS.G[g] || GS.MIRROR;
  return `<span class="gbadge" style="--c:${G.c};--bg:${G.bg}">${G.emoji} ${text || G.short || ''}</span>`;
};
// spørsmål som kort (rule) eller med utregning (full)
GS.ruleHTML = function(a, b, full){
  const e = GS.explain(a, b), G = e.G, R = e.R;
  let h = `<div class="rulebox" style="--c:${G.c};--bg:${G.bg}"><div class="rb-h">${GS.badge(e.c.g)} <b>${bi(R.no, R.zh)}</b></div>
    <div class="rb-f">${R.f}</div><div class="rb-l">${bi(R.line[0], R.line[1])}</div>
    <div class="rb-t"><div class="rb-tt">${bi('Slik finner du regelen:', '这样找到规则：')}</div>${GS.traceHTML(a, b)}</div>`;
  if(full){
    h += `<div class="rb-s"><div class="rb-tt">${bi('Slik regner du:', '这样计算：')}</div><ol class="gsteps">${e.steps.map(s => `<li>${bi(s.no, s.zh)}</li>`).join('')}</ol>`;
    if(e.chain) h += `<div class="gchain">${e.chain.list.map((v, i) => `${i ? '<i>➜</i>' : ''}<b>${v}</b>`).join('')}${e.chain.note ? ` <span>= 7 × 8</span>` : ''}</div>`;
    if(e.c.sub === 'sq' && window.App.MG) h += `<div class="rb-dots">${A.MG.dots(e.n, e.n, {s:15, r:5.5, c1:G.c})}</div>`;
    h += `</div><button class="spk rb-say" type="button" title="🔊">🔊</button>`;
  }
  return h + '</div>';
};
GS.sayExplain = function(a, b){
  const e = GS.explain(a, b), no = [`${a} × ${b} = ${e.ans}.`, e.R.no + '.'].concat(e.steps.map(s => s.no)).join(' '), zh = [`${a} × ${b} = ${e.ans}。`, e.R.zh + '。'].concat(e.steps.map(s => s.zh)).join(' ');
  return A.sayBi(no, zh);
};
GS.sayEq = (a, b) => A.sayBi(`${a} × ${b} = ${a * b}`, `${a} × ${b} = ${a * b}`);
GS.sayQ = (a, b) => A.sayBi(`${a} × ${b}`, `${a} × ${b}`);

/* ---------- tegninger ---------- */
/* gangetabell 10 × 10.
   step: 1–7 (slik tabellen krymper) · all: alle felt farges etter regel · level(a,b): fremgangsfarger
   hi: [[a,b],…] ramme · interactive: felt kan trykkes (data-a, data-b) */
GS.table = function(o){
  o = o || {};
  let h = `<table class="gst${o.small ? ' sm' : ''}"><tr><th>×</th>${Array.from({length:10}, (_, i) => `<th>${i + 1}</th>`).join('')}</tr>`;
  for(let a = 1; a <= 10; a++){
    h += `<tr><th>${a}</th>`;
    for(let b = 1; b <= 10; b++){
      const g = GS.classify(a, b).g, cls = [];
      if(o.step){
        const r = GS.removal(a, b);
        if(r < o.step) cls.push('gone'); else if(r === o.step) cls.push(a > b ? 'mir' : 'g-' + g); else cls.push('keep');
      } else if(o.all){ cls.push('g-' + g); if(a > b) cls.push('dim'); }
      else if(o.level){ cls.push('lv-' + o.level(a, b), 'gb-' + g); }
      if(o.hi && o.hi.some(p => p[0] === a && p[1] === b)) cls.push('hi');
      if(o.sel && o.sel[0] === a && o.sel[1] === b) cls.push('sel');
      h += `<td class="${cls.join(' ')}" data-a="${a}" data-b="${b}">${a * b}</td>`;
    }
    h += '</tr>';
  }
  return h + '</table>';
};
/* «Slik krymper tabellen»: stolper */
GS.funnel = function(upTo){
  return `<div class="gfun">${GS.STEPS.filter(s => s.n <= (upTo || 7) && s.n !== 7).map(s => `<div class="gf-row"><b>${s.count}</b><span class="gf-bar" style="width:${s.count}%;background:${s.bar}"></span><i>${bi(s.no, s.zh)}</i></div>`).join('')}</div>`;
};
/* de fire spørsmålene som en rekke (hi = hvilken som er i fokus) */
GS.flow = function(hi){
  return `<div class="gflow">${GS.QUESTIONS.map((q, i) => { const G = GS.G[q.g];
    return `<div class="gfr pop ${hi === i ? 'hi' : hi != null ? 'lo' : ''}" style="--c:${G.c};--bg:${G.bg};--d:${i * .25}s"><span class="n">${q.last ? '→' : i + 1}</span><span class="q">${bi(q.no, q.zh)}</span><span class="r">${GS.badge(q.g)}</span></div>`; }).join('')}</div>`;
};
})();
