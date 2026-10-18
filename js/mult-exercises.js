(function(){
'use strict';
/* Gange: oppgavebanker (pools). Tallene trekkes på nytt hver gang oppgaven vises. */
const A = window.App, Ex = A.Ex, M = A.Mult, N = A.N, MG = A.MG;
const {bi, shuffle, sample, pick, uniq} = A;
const Q = Ex.Q, FB = Ex.FB, def = Ex.def, fmt = N.fmt;
const T = Q;
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const slots = (name, n, lvl, mod, mk, kind) => Array.from({length:n}, (_, i) => ({id:`${name}:${i}`, kind, lvl:typeof lvl === 'function' ? lvl(i) : lvl, mod, make:() => mk(i)}));
const choiceHtml = s => `<span style="font-size:1.25rem">${s}</span>`;
const fl = x => [1, 2, 5, 10].includes(x) ? 1 : [3, 4, 9].includes(x) ? 2 : 3;
const lvlOf = (a, b) => Math.max(fl(a), fl(b));

/* ---------- modul 0: hva er gange? ---------- */
def('m_groups', () => slots('m_groups', 36, i => i < 14 ? 1 : 2, 0, i => {
  const g = rnd(2, i < 14 ? 5 : 9), k = rnd(2, i < 14 ? 5 : 9), th = pick(N.THINGS), ho = pick(N.HOLDERS), ans = g * k;
  const q = T(`Hvor mange ${th.pl} er det til sammen?`, `一共有多少${th.mw}${th.zh}？`);
  return {q, say:T(`${g} ${ho.pl} med ${k} ${th.pl} i hver. Hvor mange ${th.pl} er det til sammen?`, `${g} ${ho.zh}，每${ho.zh}有 ${k} ${th.mw}${th.zh}。一共有多少${th.mw}${th.zh}？`),
    visual:`${MG.groups(g, k, th.emoji, ho.emoji)}<div class="small-note" style="margin-top:6px">${bi(`${g} ${ho.pl} med ${k} ${th.pl} i hver`, `${g} ${ho.zh}，每${ho.zh} ${k} ${th.mw}`)}</div>`,
    answer:ans, near:[g + k, ans - k, ans + k, ans - g, ans + g].filter(v => v > 0), min:1, retry:true,
    hintHtml:`<div class="mexpr"><div>${Array(g).fill(k).join(' + ')} = ?</div></div>`,
    fb:T(`${Array(g).fill(k).join(' + ')} = ${ans}. Det er ${g} × ${k} = ${ans}.`, `${Array(g).fill(k).join(' + ')} = ${ans}。也就是 ${g} × ${k} = ${ans}。`), sayAfter:`${g} × ${k} = ${ans}`};
}, 'num'));

def('m_addmul', () => slots('m_addmul', 30, i => i < 12 ? 1 : 2, 0, i => {
  const g = rnd(2, 6), k = rnd(2, 9), right = `${g} × ${k}`, ans = g * k;
  const wrong = shuffle([`${g} + ${k}`, `${g} × ${g}`, `${g + 1} × ${k}`, `${g} × ${k + 1}`, `${k} + ${k}`]).filter(x => x !== right && x !== `${k} × ${g}`).slice(0, 3);
  return {q:T('Skriv som gange. Hvilket gangestykke passer?', '写成乘法。哪个乘法算式合适？'), say:T('Skriv som gange. Hvilket gangestykke passer?', '写成乘法。哪个乘法算式合适？'),
    visual:`<div class="mq">${Array(g).fill(k).join(' + ')} = ${ans}</div>`, layout:'row',
    options:shuffle([{html:choiceHtml(right), value:'ok'}].concat(wrong.map((w, j) => ({html:choiceHtml(w), value:'w' + j})))), answer:'ok',
    fb:T(`${Array(g).fill(k).join(' + ')} er ${g} ganger ${k}: ${right} = ${ans}. (${k} × ${g} gir samme svar.)`, `${Array(g).fill(k).join(' + ')} 就是 ${g} 个 ${k}：${right} = ${ans}。（${k} × ${g} 的结果一样。）`), sayAfter:`${g} × ${k} = ${ans}`};
}, 'choice'));

def('m_array', () => slots('m_array', 30, i => i < 12 ? 1 : 2, 0, i => {
  const r = rnd(2, i < 12 ? 5 : 8), c = rnd(2, i < 12 ? 6 : 9), ans = r * c;
  return {q:T('Hvor mange prikker er det?', '一共有多少个点？'), say:T('Hvor mange prikker er det?', '一共有多少个点？'), visual:`${MG.dots(r, c)}<div class="small-note" style="margin-top:6px">${bi(`${r} rader med ${c} prikker`, `${r} 行，每行 ${c} 个点`)}</div>`,
    answer:ans, near:[r + c, ans - c, ans + c, ans - r, ans + r].filter(v => v > 0), min:1, retry:true, hintHtml:`<div class="mexpr"><div>${Array(r).fill(c).join(' + ')} = ?</div></div>`,
    fb:T(`${r} rader med ${c} i hver rad: ${r} × ${c} = ${ans}.`, `${r} 行，每行 ${c} 个：${r} × ${c} = ${ans}。`), sayAfter:`${r} × ${c} = ${ans}`};
}, 'num'));

def('m_arrayEq', () => slots('m_arrayEq', 24, 1, 0, i => {
  const r = rnd(2, 6), c = rnd(2, 9), right = `${r} × ${c}`;
  const wrong = shuffle([`${r} + ${c}`, `${c} + ${c}`, `${r} × ${r}`, `${r + 1} × ${c}`, `${r} × ${c + 1}`]).filter(x => x !== right && x !== `${c} × ${r}`).slice(0, 3);
  return {q:T('Hvilket gangestykke passer til prikkene?', '哪个乘法算式和这些点相配？'), say:T('Hvilket gangestykke passer til prikkene?', '哪个乘法算式和这些点相配？'),
    visual:`${MG.dots(r, c)}`, layout:'row', options:shuffle([{html:choiceHtml(right), value:'ok'}].concat(wrong.map((w, j) => ({html:choiceHtml(w), value:'w' + j})))), answer:'ok',
    fb:T(`${r} rader med ${c} prikker: ${right} = ${r * c}.`, `${r} 行，每行 ${c} 个点：${right} = ${r * c}。`), sayAfter:`${r} × ${c} = ${r * c}`};
}, 'choice'));

def('m_words', () => slots('m_words', 30, 1, 0, i => {
  const a = rnd(2, 9), b = rnd(2, 9), toNum = i % 2 === 0, right = `${a} × ${b}`;
  const wrong = uniq(shuffle([`${b} × ${b}`, `${a} + ${b}`, `${a} × ${a}`, `${a + 1} × ${b}`, `${a} × ${b + 1}`]).filter(x => x !== right && x !== `${b} × ${a}`)).slice(0, 3);
  if(toNum) return {q:T('Hvilket gangestykke passer til ordene?', '哪个算式和这些词相配？'), say:T('Hvilket gangestykke passer til ordene?', '哪个算式和这些词相配？'), word:N.eqNo(a, b),
    visual:`<div class="mq txt"><span class="no">${N.eqNo(a, b)}</span></div><div class="gloss zh">${N.eqZh(a, b)}</div>`, layout:'row',
    options:shuffle([{html:choiceHtml(right), value:'ok'}].concat(wrong.map((w, j) => ({html:choiceHtml(w), value:'w' + j})))), answer:'ok', fb:T(`${N.eqNo(a, b)} skrives ${right}.`, `${N.eqZh(a, b)} 写成 ${right}。`), sayAfter:N.eqNo(a, b)};
  const wordsOpt = (x, y) => ({no:N.eqNo(x, y), zh:N.eqZh(x, y)});
  const wr = shuffle([[b, b], [a + 1, b], [a, a], [a, b + 1]]).filter(p => !(p[0] === a && p[1] === b) && !(p[0] === b && p[1] === a)).slice(0, 3);
  return {q:T('Hvilke ord passer til gangestykket?', '哪些词和这个算式相配？'), say:T('Hvilke ord passer til gangestykket?', '哪些词和这个算式相配？'), visual:`<div class="mq">${right}</div>`, layout:'col',
    options:shuffle([{html:bi(wordsOpt(a, b).no, wordsOpt(a, b).zh), value:'ok'}].concat(wr.map((p, j) => ({html:bi(wordsOpt(p[0], p[1]).no, wordsOpt(p[0], p[1]).zh), value:'w' + j})))), answer:'ok',
    fb:T(`${right} leses «${N.eqNo(a, b)}».`, `${right} 读作“${N.eqZh(a, b)}”。`), sayAfter:`${a} × ${b}`};
}, 'choice'));

def('m_zero1', () => {
  const out = [];
  for(let i = 0; i < 40; i++) out.push({id:'m_zero1:' + i, kind:'num', lvl:1, mod:0, make:() => {
    const n = rnd(2, 25), z = i % 2 === 0, left = Math.random() < .5, ans = z ? 0 : n;
    const sym = left ? `${n} × ${z ? 0 : 1} = ?` : `${z ? 0 : 1} × ${n} = ?`;
    return {q:T('Regn ut.', '计算。'), say:T(sym.replace(' = ?', '?'), sym.replace(' = ?', ' 等于多少？')), visual:`<div class="mq">${sym}</div>`, answer:ans, near:[n, 1, 0, n + 1, 10].filter(v => v >= 0 && v !== ans), min:0, retry:true,
      fb:z ? T('Hva som helst ganger 0 er 0. Ingen grupper, ingenting igjen.', '任何数乘 0 都得 0。没有一组，就什么也没有。') : T(`Ganger du med 1, blir tallet det samme: ${n}.`, `乘 1，数不变：${n}。`), sayAfter:ans};
  }});
  return out;
});

/* ---------- modul 1: gangetabellen ---------- */
const factPairs = [];
for(let a = 2; a <= 10; a++) for(let b = 2; b <= 10; b++) factPairs.push([a, b]);
const factItem = (a, b, mod) => ({id:`mf:${a}x${b}`, kind:'num', lvl:lvlOf(a, b), mod, make:() => M.fact(a, b)});
def('m_tabs', () => factPairs.map(([a, b]) => factItem(a, b, 1)));
for(let t = 2; t <= 10; t++){
  def('m_tab_' + t, () => { const out = []; const seen = new Set();
    for(let b = 1; b <= 10; b++) [[t, b], [b, t]].forEach(([x, y]) => { const k = x + 'x' + y; if(!seen.has(k)){ seen.add(k); if(x >= 2 && y >= 2 || b === 1) out.push(factItem(x, y, 1)); } });
    return out; });
}
// tabellene til sammen, delt opp etter knepene
const involving = set => factPairs.filter(([a, b]) => set.includes(a) || set.includes(b)).map(([a, b]) => factItem(a, b, 1));
def('m_tab_easy', () => involving([2, 5, 10]));
def('m_tab_mid', () => involving([3, 4, 9]));
def('m_tab_hard', () => involving([6, 7, 8]));

def('m_missing', () => factPairs.map(([a, b]) => ({id:`mm:${a}x${b}`, kind:'num', lvl:lvlOf(a, b), mod:1, make:() => M.missing(a, b)})));

def('m_swap', () => slots('m_swap', 24, i => i < 8 ? 1 : 2, 1, i => {
  let a = rnd(2, 9), b = rnd(2, 9); while(a === b) b = rnd(2, 9);
  const ans = a * b;
  return {q:T(`${a} × ${b} = ${ans}. Hva er ${b} × ${a}?`, `${a} × ${b} = ${ans}。${b} × ${a} 等于多少？`), say:T(`${a} × ${b} = ${ans}. Hva er ${b} × ${a}?`, `${a} × ${b} = ${ans}。${b} × ${a} 等于多少？`),
    visual:`<div class="row" style="gap:24px;align-items:center">${MG.dots(a, b, {s:16, r:6})}<span style="font-size:2rem">⟲</span>${MG.dots(b, a, {s:16, r:6, c1:'#f97316'})}</div>`,
    answer:ans, near:[ans + a, ans - b, ans + b, a + b].filter(v => v > 0 && v !== ans), min:1, retry:true,
    hintHtml:`<div>${bi('Du kan bytte om tallene. Svaret blir det samme.', '可以交换两个数。结果是一样的。')}</div>`,
    fb:T(`Du kan bytte om tallene: ${b} × ${a} = ${a} × ${b} = ${ans}.`, `两个数可以交换：${b} × ${a} = ${a} × ${b} = ${ans}。`), sayAfter:`${b} × ${a} = ${ans}`};
}, 'num'));

const KNEP = {2:['Dobbelt', '两倍'], 4:['Dobbelt og dobbelt', '两倍再两倍'], 5:['Halvparten av × 10', '× 10 的一半'], 9:['× 10 minus én', '× 10 再减一个'], 10:['Legg til en null', '后面添一个 0'],
  3:['× 2 og én til', '× 2 再加一个'], 6:['× 5 og én til', '× 5 再加一个'], 8:['Dobbelt av × 4', '× 4 的两倍']};
def('m_knep', () => { const out = []; let n = 0;
  [2, 3, 4, 5, 6, 8, 9, 10].forEach(f => [0, 1, 2].forEach(() => { const i = n++; out.push({id:'m_knep:' + i, kind:'choice', lvl:f === 6 || f === 8 ? 3 : (f === 3 || f === 4 || f === 9 ? 2 : 1), mod:1, make:() => {
    let o = rnd(2, 10); if(o === f) o = f === 10 ? 7 : 10; const wrong = sample(Object.keys(KNEP).map(Number).filter(x => x !== f), 3), tip = M.tip(f, o);
    return {q:T('Hvilket knep passer best?', '哪个小窍门最合适？'), say:T('Hvilket knep passer best?', '哪个小窍门最合适？'), visual:`<div class="mq">${f} × ${o}</div>`, layout:'col',
      options:shuffle([f].concat(wrong)).map(x => ({html:bi(KNEP[x][0], KNEP[x][1]), value:String(x)})), answer:String(f),
      fb:T(`${f}-gangen: ${KNEP[f][0].toLowerCase()}. ${tip.no}`, `${f} 的乘法：${KNEP[f][1]}。${tip.zh}`), sayAfter:`${f} × ${o} = ${f * o}`};
  }}); }));
  return out; });

/* ---------- modul 2: × 10, × 100, × 1000 ---------- */
const tenPool = (name, k, n, lvl) => def(name, () => slots(name, n, lvl, 2, i => M.ten(rnd(2, 99), k), 'num'));
tenPool('m_x10', 1, 30, 1); tenPool('m_x100', 2, 30, 2); tenPool('m_x1000', 3, 30, 2);
def('m_ten', () => [].concat(slots('m_ten1', 14, 1, 2, () => M.ten(rnd(2, 99), 1), 'num'), slots('m_ten2', 14, 2, 2, () => M.ten(rnd(2, 99), 2), 'num'), slots('m_ten3', 14, 2, 2, () => M.ten(rnd(2, 99), 3), 'num')));
def('m_tens', () => slots('m_tens', 40, i => i < 14 ? 1 : 2, 2, i => {
  const m = rnd(2, 9), n = rnd(2, 9), z = [[1, 0], [0, 1], [2, 0], [1, 1], [0, 2], [3, 0], [2, 1], [1, 2]][rnd(0, i < 14 ? 2 : 7)];
  return M.tens(m, n, z[0], z[1]);
}, 'num'));
def('m_calcTen', () => slots('m_calcTen', 40, i => i < 16 ? 1 : 2, 2, i => {
  const m = rnd(2, 9), n = rnd(2, 9), z = [[1, 0], [0, 1], [2, 0], [1, 1], [0, 2], [3, 0], [2, 1], [1, 2]][rnd(0, i < 16 ? 2 : 7)];
  return M.calcTen(m, n, z[0], z[1]);
}, 'calc'));
const PLACE = [
  ['Hva skjer med sifrene når du ganger med 10?', '乘 10 的时候，数字会怎么样？', [['De flytter en plass mot venstre, og vi fyller på med en null', '向左移动一位，后面补一个 0'], ['De flytter en plass mot høyre', '向右移动一位'], ['Ingenting, vi legger bare til 10', '什么也不变，只是加 10']], '7 × 10 = 70. Sifferet 7 flytter fra enerplassen til tierplassen.', '7 × 10 = 70。数字 7 从个位移到了十位。'],
  ['Hva skjer med sifrene når du ganger med 100?', '乘 100 的时候，数字会怎么样？', [['De flytter to plasser mot venstre, og vi fyller på med to nuller', '向左移动两位，后面补两个 0'], ['De flytter en plass mot venstre', '向左移动一位'], ['Vi legger til 100', '加上 100']], '4 × 100 = 400. To nuller bak.', '4 × 100 = 400。后面添两个 0。'],
  ['Hva er 35 × 10?', '35 × 10 等于多少？', [['350', '350'], ['45', '45'], ['3 500', '3 500']], '35 × 10 = 350. Sifrene flytter en plass.', '35 × 10 = 350。数字移动一位。'],
  ['Hva er 8 × 1 000?', '8 × 1 000 等于多少？', [['8 000', '8 000'], ['800', '800'], ['80 000', '80 000']], '8 × 1 000 = 8 000. Tre nuller bak.', '8 × 1 000 = 8 000。后面添三个 0。'],
  ['Hvor mange nuller får svaret når du ganger med 1 000?', '乘 1 000，答案后面添几个 0？', [['Tre', '三个'], ['To', '两个'], ['Fire', '四个']], '1 000 har tre nuller, så svaret får tre nuller bak.', '1 000 有三个 0，所以答案后面添三个 0。'],
  ['Hvilket tall er størst?', '哪个数最大？', [['6 × 100', '6 × 100'], ['6 × 10', '6 × 10'], ['60 × 1', '60 × 1']], '6 × 100 = 600. 6 × 10 = 60. 60 × 1 = 60.', '6 × 100 = 600。6 × 10 = 60。60 × 1 = 60。']];
def('m_place', () => PLACE.map((q, i) => ({id:'m_place:' + i, kind:'choice', lvl:1, mod:2, make:() => ({q:T(q[0], q[1]), say:T(q[0], q[1]), layout:'col',
  options:shuffle(q[2].map((o, k) => ({html:bi(o[0], o[1]), value:k}))), answer:0, fb:T(q[3], q[4]), sayAfter:''}) })));

/* ---------- modul 3: del opp tallet ---------- */
const nz2 = () => { let a; do a = rnd(12, 98); while(a % 10 === 0); return a; };
const nz3 = () => { let a; do a = rnd(102, 998); while(a % 100 === 0); return a; };
def('m_split2', () => slots('m_split2', 40, i => i < 16 ? 1 : 2, 3, i => M.calcSplit(nz2(), rnd(2, i < 16 ? 5 : 9)), 'calc'));
def('m_split3', () => slots('m_split3', 40, i => i < 12 ? 2 : 3, 3, i => M.calcSplit(nz3(), rnd(2, i < 12 ? 5 : 9)), 'calc'));
def('m_splitMC', () => slots('m_splitMC', 30, i => i < 14 ? 1 : 2, 3, i => {
  const a = i < 14 ? nz2() : nz3(), parts = M.digitsParts(a), right = parts.map(fmt).join(' + ');
  const wrong = M.splitWrong(a, parts);
  return {q:T(`Hvilken oppdeling passer for ${fmt(a)}?`, `${fmt(a)} 怎么拆才对？`), say:T(`Hvilken oppdeling passer for ${a}?`, `${a} 怎么拆才对？`), visual:`<div class="mq">${fmt(a)}</div>`, layout:'col',
    options:shuffle([{html:choiceHtml(right), value:'ok'}].concat(wrong.map((w, j) => ({html:choiceHtml(w.split(' + ').map(x => fmt(+x)).join(' + ')), value:'w' + j})))), answer:'ok',
    fb:T(`${fmt(a)} = ${right}. Hvert siffer får sin plassverdi.`, `${fmt(a)} = ${right}。每个数字有自己的数位。`), sayAfter:`${a}`};
}, 'choice'));
def('m_areaRead', () => slots('m_areaRead', 30, i => i < 12 ? 1 : 2, 3, i => {
  const a = i < 12 ? nz2() : nz3(), b = rnd(2, 9), parts = M.digitsParts(a), k = rnd(0, parts.length - 1), prods = parts.map(p => p * b);
  const cells = [prods.map((p, j) => j === k ? '?' : fmt(p))];
  return {q:T('Hva skal stå i den røde ruten?', '红色格子里应该写什么？'), say:T('Hva skal stå i den røde ruten?', '红色格子里应该写什么？'),
    visual:MG.area(parts, [b], {cells, hi:[0, k]}), answer:prods[k], near:[parts[k] / 10 * b, prods[k] * 10, parts[k] + b].filter(v => Number.isInteger(v) && v > 0 && v !== prods[k]), min:1, retry:true,
    hintHtml:`<div>${bi(`Gang tallet over ruten med tallet ved siden av: ${fmt(parts[k])} × ${b}.`, `把格子上方的数和左边的数相乘：${fmt(parts[k])} × ${b}。`)}</div>`,
    fb:T(`${fmt(parts[k])} × ${b} = ${fmt(prods[k])}.`, `${fmt(parts[k])} × ${b} = ${fmt(prods[k])}。`), sayAfter:`${parts[k]} × ${b} = ${prods[k]}`};
}, 'num'));

/* ---------- modul 4: runde av, dobling ---------- */
const rnd2 = () => { const R = rnd(2, 10) * 10, d = rnd(1, 3); return R - d; };
const rnd3 = () => { const R = rnd(2, 10) * 100, d = rnd(1, 30); return R - d; };
def('m_round', () => slots('m_round', 40, i => i < 16 ? 1 : (i < 28 ? 2 : 3), 4, i => i < 16 ? M.calcRound(rnd2(), rnd(3, 9)) : M.calcRound(rnd3(), rnd(2, i < 28 ? 5 : 9)), 'calc'));
def('m_double', () => slots('m_double', 45, i => i < 15 ? 1 : 2, 4, i => { const k = [4, 5, 8][i % 3]; return M.calcDouble(k === 8 ? rnd(6, 25) : k === 4 ? rnd(6, 49) : rnd(6, 60), k); }, 'calc'));
const PICK = [[99, 6, 'round'], [198, 3, 'round'], [49, 4, 'round'], [297, 2, 'round'], [98, 5, 'round'], [399, 3, 'round'], [24, 4, 'double'], [36, 4, 'double'], [15, 8, 'double'], [32, 4, 'double'], [18, 5, 'half'], [64, 5, 'half'], [46, 5, 'half'], [26, 5, 'half'], [203, 4, 'split'], [412, 2, 'split'], [321, 3, 'split'], [142, 3, 'split'], [51, 6, 'split'], [304, 2, 'split']];
const PICKN = {round:['Rund av og rett opp', '凑整再补偿'], double:['Dobbelt og dobbelt', '两倍再两倍'], half:['Gang med 10 og ta halvparten', '乘 10 再取一半'], split:['Del opp tallet', '拆分数']};
def('m_pick', () => PICK.map((p, i) => ({id:'m_pick:' + i, kind:'choice', lvl:i % 3 + 1 > 2 ? 2 : 1, mod:4, make:() => {
  const [a, b, k] = p, ans = a * b, wrongKeys = Object.keys(PICKN).filter(x => x !== k);
  const why = {round:[`${a} er nesten ${Math.ceil(a / (a > 99 ? 100 : 10)) * (a > 99 ? 100 : 10)}.`, `${a} 差不多是 ${Math.ceil(a / (a > 99 ? 100 : 10)) * (a > 99 ? 100 : 10)}。`], double:[`Ganger du med ${b}, kan du doble og doble.`, `乘 ${b} 可以翻倍再翻倍。`], half:['Ganger du med 5, kan du ta × 10 og så halvparten.', '乘 5 可以先乘 10 再取一半。'], split:[`${a} lar seg lett dele opp i hundrer, tiere og enere.`, `${a} 很容易拆成百、十、个。`]}[k];
  return {q:T('Hvilket knep passer best?', '哪个方法最合适？'), say:T(`Hvilket knep passer best til ${a} × ${b}?`, `${a} × ${b} 用哪个方法最合适？`), visual:`<div class="mq">${a} × ${b}</div>`, layout:'col',
    options:shuffle([k].concat(wrongKeys)).map(x => ({html:bi(PICKN[x][0], PICKN[x][1]), value:x})), answer:k,
    fb:T(`${PICKN[k][0]}. ${why[0]} ${a} × ${b} = ${ans}.`, `${PICKN[k][1]}。${why[1]}${a} × ${b} = ${ans}。`), sayAfter:`${a} × ${b} = ${ans}`};
}})));

/* ---------- modul 5: gamlemåten ---------- */
const stdNum = (len, carry) => { for(let t = 0; t < 400; t++){ const b = rnd(2, 9), digs = Array.from({length:len}, (_, i) => rnd(i === 0 ? 1 : 0, 9)); let a = +digs.join('');
    const ds = digs.slice().reverse(); let c = 0, any = false, ok = true; ds.forEach((d, i) => { const tt = d * b + c; if(i < len - 1 && tt >= 10) any = true; if(!carry && i < len - 1 && tt >= 10) ok = false; c = Math.floor(tt / 10); });
    if(ok && (carry ? any : true)) return [a, b]; }
  return [len === 2 ? 23 : len === 3 ? 342 : 3121, 3]; };
def('m_std2', () => slots('m_std2', 36, i => i < 12 ? 1 : 2, 5, i => { const [a, b] = stdNum(2, i >= 12 || i % 3 === 2); return M.calcStd(a, b); }, 'calc'));
def('m_std3', () => slots('m_std3', 36, i => i < 10 ? 2 : 3, 5, i => { const [a, b] = stdNum(3, i >= 10); return M.calcStd(a, b); }, 'calc'));
def('m_std4', () => slots('m_std4', 24, 3, 5, i => { const [a, b] = stdNum(4, i >= 6); return M.calcStd(a, b); }, 'calc'));
def('m_carry', () => slots('m_carry', 30, i => i < 12 ? 1 : 2, 5, i => {
  let d, b, t; do { d = rnd(2, 9); b = rnd(2, 9); t = d * b; } while(t < 10);
  const askMente = i % 2 === 0;
  return {q:askMente ? T(`${d} × ${b} = ${t}. Hva blir mente?`, `${d} × ${b} = ${t}。进位是多少？`) : T(`${d} × ${b} = ${t}. Hvilket siffer skriver du under streken?`, `${d} × ${b} = ${t}。横线下面写哪个数字？`),
    say:askMente ? T(`${d} × ${b} = ${t}. Hva blir mente?`, `${d} × ${b} = ${t}。进位是多少？`) : T(`${d} × ${b} = ${t}. Hvilket siffer skriver du under streken?`, `${d} × ${b} = ${t}。横线下面写哪个数字？`),
    visual:`<div class="mq">${t} = ${Math.floor(t / 10)} tiere + ${t % 10} enere</div><div class="small-note">${bi('Tierne blir mente. Enerne skriver du.', '十位变成进位，个位写下来。')}</div>`,
    answer:askMente ? Math.floor(t / 10) : t % 10, near:askMente ? [t % 10, t, Math.floor(t / 10) + 1] : [Math.floor(t / 10), t, t % 10 + 1], min:0, retry:true,
    fb:T(`${t} er ${Math.floor(t / 10)} tiere og ${t % 10} enere. Skriv ${t % 10}, mente ${Math.floor(t / 10)}.`, `${t} 是 ${Math.floor(t / 10)} 个十和 ${t % 10} 个一。写 ${t % 10}，进位 ${Math.floor(t / 10)}。`), sayAfter:`${t}`};
}, 'num'));

/* ---------- modul 6: tekstoppgaver ---------- */
const KINDS = ['groups', 'price', 'rows', 'times', 'perday'];
[1, 2, 3].forEach(lvl => def('m_story' + lvl, () => slots('m_story' + lvl, 30, lvl, 6, i => M.story(KINDS[i % 5], lvl), 'calc')));
def('m_storyEq', () => slots('m_storyEq', 30, i => i < 15 ? 1 : 2, 6, i => {
  const s = M.storyModel(KINDS[i % 5], 1), right = `${s.a} × ${s.b}`;
  const wrong = shuffle([`${s.a} + ${s.b}`, `${Math.max(s.a, s.b)} − ${Math.min(s.a, s.b)}`, `${s.a} × ${s.a}`, `${s.b} + ${s.b}`]).filter(x => x !== right).slice(0, 3);
  return {q:T('Hvilket regnestykke passer til oppgaven?', '哪个算式符合这道题？'), say:T('Hvilket regnestykke passer til oppgaven?', '哪个算式符合这道题？'), visual:`<div class="storybox"><span class="no">${s.no}</span><span class="zh">${s.zh}</span></div>`, layout:'row',
    options:shuffle([{html:choiceHtml(right), value:'ok'}].concat(wrong.map((w, j) => ({html:choiceHtml(w), value:'w' + j})))), answer:'ok',
    fb:T(`Like store grupper gir gange: ${right} = ${s.ans}${s.unit}.`, `每组一样多，用乘法：${right} = ${s.ans}${s.unit}。`), sayAfter:`${right} = ${s.ans}`};
}, 'choice'));
const OPS = [
  ['Mia har 4 epler. Ola har 6 epler. Hvor mange har de til sammen?', '米娅有 4 个苹果，奥拉有 6 个苹果。他们一共有几个？', 'plus'],
  ['Det er 5 poser med 3 epler i hver pose. Hvor mange epler er det?', '有 5 袋苹果，每袋 3 个。一共有几个苹果？', 'gange'],
  ['Sara har 12 klistremerker. Hun gir bort 5. Hvor mange har hun igjen?', '萨拉有 12 张贴纸，送出 5 张。她还剩几张？', 'minus'],
  ['Hver bok koster 20 kr. Hvor mye koster 4 bøker?', '每本书 20 克朗。4 本书多少钱？', 'gange'],
  ['Lars har 8 kuler. Jon har 3 kuler mer enn Lars. Hvor mange har Jon?', '拉尔斯有 8 颗弹珠。约恩比他多 3 颗。约恩有几颗？', 'plus'],
  ['Det er 6 rader med 7 stoler i hver rad. Hvor mange stoler er det?', '有 6 排椅子，每排 7 把。一共有几把椅子？', 'gange'],
  ['Kari har 30 kr. Hun kjøper en bok til 18 kr. Hvor mye har hun igjen?', '卡里有 30 克朗。她买了一本 18 克朗的书。还剩多少钱？', 'minus'],
  ['Hver dag leser Nora 8 sider. Hvor mange sider leser hun på 5 dager?', '诺拉每天读 8 页。5 天读多少页？', 'gange'],
  ['Emil har 9 blyanter og får 6 til. Hvor mange har han nå?', '埃米尔有 9 支铅笔，又得到 6 支。他现在有几支？', 'plus'],
  ['Ola har 5 kr. Mia har 4 ganger så mye. Hvor mye har Mia?', '奥拉有 5 克朗。米娅的钱是他的 4 倍。米娅有多少钱？', 'gange']];
const OPN = {plus:['pluss (+)', '加法 (+)'], minus:['minus (−)', '减法 (−)'], gange:['gange (×)', '乘法 (×)']};
def('m_storyPick', () => OPS.map((o, i) => ({id:'m_storyPick:' + i, kind:'choice', lvl:1, mod:6, make:() => ({q:T('Skal du bruke pluss, minus eller gange?', '应该用加法、减法还是乘法？'), say:T('Skal du bruke pluss, minus eller gange?', '应该用加法、减法还是乘法？'),
  visual:`<div class="storybox"><span class="no">${o[0]}</span><span class="zh">${o[1]}</span></div>`, layout:'row',
  options:shuffle(Object.keys(OPN)).map(k => ({html:bi(OPN[k][0], OPN[k][1]), value:k})), answer:o[2],
  fb:o[2] === 'gange' ? T('Like store grupper eller «så mange ganger»: bruk gange.', '每组一样多，或者“几倍”：用乘法。') : o[2] === 'plus' ? T('Du legger sammen to mengder: bruk pluss.', '把两个数量合起来：用加法。') : T('Du tar bort noe: bruk minus.', '拿走一部分：用减法。'), sayAfter:''}) })));

/* ---------- modul 7: to-sifret × to-sifret ---------- */
const two22 = () => { let b; do b = rnd(12, 49); while(b % 10 === 0); let a; do a = rnd(12, 49); while(a % 10 === 0); return [a, b]; };
def('m_area22', () => slots('m_area22', 24, 3, 7, () => { const [a, b] = two22(); return M.calcArea22(a, b); }, 'calc'));
def('m_std22', () => slots('m_std22', 24, 3, 7, () => { const [a, b] = two22(); return M.calcStd22(a, b); }, 'calc'));

/* ---------- blandede (til løkker og øvingsrom) ---------- */
def('m_mixCalc', () => [].concat(slots('m_mc1', 12, 2, 7, () => M.calcSplit(nz2(), rnd(2, 9)), 'calc'), slots('m_mc2', 12, 2, 7, () => M.calcRound(rnd2(), rnd(3, 9)), 'calc'),
  slots('m_mc3', 12, 2, 7, () => { const [a, b] = stdNum(3, true); return M.calcStd(a, b); }, 'calc'), slots('m_mc4', 9, 2, 7, () => M.calcDouble(rnd(6, 49), [4, 5][rnd(0, 1)]), 'calc')));
})();
