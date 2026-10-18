(function(){
'use strict';
/* Gange: tall som ord (norsk og kinesisk), regnestykker som tale, tekstoppgave-maler */
const A = window.App;
const N = A.N = {};

/* ---------- norske tallord ---------- */
const NO1 = ['null', 'en', 'to', 'tre', 'fire', 'fem', 'seks', 'sju', 'åtte', 'ni', 'ti', 'elleve', 'tolv', 'tretten', 'fjorten', 'femten', 'seksten', 'sytten', 'atten', 'nitten'];
const NO10 = ['', '', 'tjue', 'tretti', 'førti', 'femti', 'seksti', 'sytti', 'åtti', 'nitti'];
const no99 = n => n < 20 ? NO1[n] : NO10[Math.floor(n / 10)] + (n % 10 ? NO1[n % 10] : '');
function no999(n, afterThousand){
  const h = Math.floor(n / 100), r = n % 100; let s = '';
  if(h) s = h === 1 ? (afterThousand ? 'ett hundre' : 'hundre') : NO1[h] + ' hundre';
  if(r) s += (h ? ' og ' : '') + no99(r);
  return s;
}
N.no = function(n){
  n = Math.round(n);
  if(n === 0) return 'null';
  if(n < 0) return 'minus ' + N.no(-n);
  if(n < 1000) return no999(n);
  const th = Math.floor(n / 1000), r = n % 1000;
  let s = th === 1 ? 'tusen' : N.no(th) + ' tusen';
  if(r) s += (r < 100 ? ' og ' : ' ') + no999(r, true);
  return s;
};

/* ---------- kinesiske tallord ---------- */
const ZD = '零一二三四五六七八九';
function zh4(n){
  let s = '', zero = false;
  [[1000, '千'], [100, '百'], [10, '十'], [1, '']].forEach(([p, w]) => {
    const d = Math.floor(n / p) % 10;
    if(d){ if(zero){ s += '零'; zero = false; } s += ZD[d] + w; } else if(s) zero = true;
  });
  return s;
}
N.zh = function(n){
  n = Math.round(n);
  if(n === 0) return '零';
  if(n < 0) return '负' + N.zh(-n);
  if(n >= 10 && n < 20) return '十' + (n % 10 ? ZD[n % 10] : '');
  if(n < 10000) return zh4(n);
  const hi = Math.floor(n / 10000), lo = n % 10000;
  let s = (hi >= 10 && hi < 20 ? '十' + (hi % 10 ? ZD[hi % 10] : '') : (hi < 10000 ? zh4(hi) : N.zh(hi))) + '万';
  if(lo){ if(lo < 1000) s += '零'; s += zh4(lo); }
  return s;
};

/* tall med tusenskille (hardt mellomrom): 12 345 */
N.fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
/* regnestykke som tekst */
N.eqNo = (a, b) => `${N.no(a)} ganger ${N.no(b)}`;
N.eqZh = (a, b) => `${N.zh(a)}乘以${N.zh(b)}`;

/* ---------- regnestykker som tale: «276 × 3 = ?» → «to hundre og syttiseks ganger tre er …» ---------- */
A.spokenMath = function(text, lang){
  const zh = lang === 'zh', conv = zh ? N.zh : N.no;
  const op = zh ? {x:'乘以', p:'加', m:'减', e:'等于', d:'除以'} : {x:' ganger ', p:' pluss ', m:' minus ', e:' er ', d:' delt på '};
  let t = String(text);
  t = t.replace(/\s*×\s*/g, '\u0001x\u0001').replace(/\s*\+\s*/g, '\u0001p\u0001').replace(/\s*−\s*/g, '\u0001m\u0001').replace(/\s+-\s+/g, '\u0001m\u0001')
    .replace(/\s*÷\s*/g, '\u0001d\u0001').replace(/\s*=\s*/g, '\u0001e\u0001');
  t = t.replace(/\d{1,3}(?:[  ]\d{3})+|\d+/g, m => { const v = parseInt(m.replace(/[  ]/g, ''), 10); return Number.isFinite(v) ? conv(v) : m; });
  t = t.replace(/\u0001([xpmed])\u0001/g, (_, k) => op[k]);
  if(!zh) t = t.replace(/\bkr\b/g, 'kroner');
  return t.replace(/\s{2,}/g, ' ').trim();
};

/* ---------- tekstoppgaver ---------- */
const NAMES = [['Mia', '米娅'], ['Ola', '奥拉'], ['Sara', '萨拉'], ['Lars', '拉尔斯'], ['Kari', '卡里'], ['Jon', '约恩'], ['Nora', '诺拉'], ['Emil', '埃米尔']];
// item: et.sg/et.pl = entall/flertall ubestemt, zh = ord, mw = målord, emoji
const THINGS = [
  {sg:'eple', pl:'epler', zh:'苹果', mw:'个', emoji:'🍎'}, {sg:'kule', pl:'kuler', zh:'弹珠', mw:'颗', emoji:'🔮'}, {sg:'kjeks', pl:'kjeks', zh:'饼干', mw:'块', emoji:'🍪'},
  {sg:'blyant', pl:'blyanter', zh:'铅笔', mw:'支', emoji:'✏️'}, {sg:'klistremerke', pl:'klistremerker', zh:'贴纸', mw:'张', emoji:'⭐'}, {sg:'egg', pl:'egg', zh:'鸡蛋', mw:'个', emoji:'🥚'},
  {sg:'blomst', pl:'blomster', zh:'花', mw:'朵', emoji:'🌸'}, {sg:'ball', pl:'baller', zh:'球', mw:'个', emoji:'⚽'}, {sg:'bok', pl:'bøker', zh:'书', mw:'本', emoji:'📚'}, {sg:'drue', pl:'druer', zh:'葡萄', mw:'颗', emoji:'🍇'}
];
const HOLDERS = [
  {sg:'pose', pl:'poser', zh:'袋', emoji:'🛍️'}, {sg:'eske', pl:'esker', zh:'盒', emoji:'📦'}, {sg:'kurv', pl:'kurver', zh:'篮', emoji:'🧺'}, {sg:'boks', pl:'bokser', zh:'盒', emoji:'🥡'}, {sg:'skål', pl:'skåler', zh:'碗', emoji:'🥣'}
];
N.NAMES = NAMES; N.THINGS = THINGS; N.HOLDERS = HOLDERS;
})();
