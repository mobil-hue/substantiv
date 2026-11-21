(function(){
'use strict';
/* Mengdetrening: rene regneoppgaver (mange om gangen) til modulene. A = vanlig, B (hard) = utfordring.
   Brukes både på skjermen (#/m/<id>/drill) og som eget ark (matte-ark.html, del «Mengdetrening»). */
const MT = window.MT, G = MT.G, {int, pick, shuf} = MT, AR = MT.arith;
const D = (id, spec) => { if(MT.byId[id]) MT.byId[id].drill = spec; };
const mix = (r, hard, easy, tough) => (hard && r() < .6) ? tough() : easy();
const frame = (a, b, o) => G.frame(a, b, Object.assign({s:15}, o || {}));

/* ---------- små tall ---------- */
D('legge-sammen', {tittel:'Pluss med tierramme (sum til 10)', layout:'pic', cols:3, n:[24, 20], make:(r, i, hard) => {
  const s = int(r, hard ? 5 : 3, hard ? 10 : 6), a = int(r, 0, s), b = s - a; return {t:`${a} + ${b} =`, ans:s, pic:frame(a, b)}; }});
D('addisjon-til-10', {tittel:'Plusstykker med sum til 10', layout:'row', cols:4, n:[64, 30], make:(r, i, hard) => {
  const s = int(r, hard ? 6 : 3, 10), a = int(r, 0, s), b = s - a, k = hard ? int(r, 0, 3) : 0;
  if(k === 1) return {t:`${a} + ☐ = ${s}`, ans:b}; if(k === 2) return {t:`☐ + ${b} = ${s}`, ans:a}; return {t:`${a} + ${b} =`, ans:s}; }});
D('trekke-fra', {tittel:'Minusstykker til 10 (ta bort)', layout:{a:'pic', b:'row'}, cols:{a:3, b:4}, n:[60, 30], make:(r, i, hard) => {
  const a = int(r, hard ? 5 : 3, 10), b = int(r, 0, a);
  if(!hard) return {t:`${a} − ${b} =`, ans:a - b, pic:frame(a, 0, {cross:b})};
  const k = int(r, 0, 2); if(k === 1) return {t:`${a} − ☐ = ${a - b}`, ans:b}; return {t:`${a} − ${b} =`, ans:a - b}; }});
D('addisjon-10-20', {tittel:'Pluss over 10 (fyll tieren)', layout:{a:'pic', b:'row'}, cols:{a:3, b:4}, n:[60, 30], make:(r, i, hard) => {
  const a = int(r, hard ? 4 : 6, 9), b = int(r, Math.max(2, 11 - a), 9);
  if(!hard) return {t:`${a} + ${b} =`, ans:a + b, pic:G.frame(a, b, {s:12, frames:2})};
  const k = int(r, 0, 2); if(k === 1) return {t:`${a} + ☐ = ${a + b}`, ans:b}; return {t:`${a} + ${b} =`, ans:a + b}; }});
D('subtraksjon-til-20', {tittel:'Minus fra 11–20 (gå ned til 10)', layout:{a:'pic', b:'row'}, cols:{a:3, b:4}, n:[60, 30], make:(r, i, hard) => {
  const s = int(r, 12, hard ? 20 : 16), b = int(r, Math.max(2, s - 10 + 1), 9); if(b >= s) return null;
  if(!hard) return {t:`${s} − ${b} =`, ans:s - b, pic:G.frame(s, 0, {s:12, frames:2, cross:b})};
  const k = int(r, 0, 2); if(k === 1) return {t:`${s} − ☐ = ${s - b}`, ans:b}; if(k === 2) return {t:`☐ − ${b} = ${s - b}`, ans:s}; return {t:`${s} − ${b} =`, ans:s - b}; }});
D('bytte-rekkefolge', {tittel:'Bytt og regn: pluss i begge rekkefølger', layout:'row', cols:3, n:[48, 30], make:(r, i, hard) => {
  const a = int(r, 1, 3), b = hard ? int(r, 11, 60) : int(r, 4, 9), k = int(r, 0, 2);
  if(k === 1) return {t:`${a} + ${b} = ☐ + ${a}`, ans:b};
  return {t:k ? `${b} + ${a} =` : `${a} + ${b} =`, ans:a + b}; }});
D('gruppere-tre-tall', {tittel:'Tre tall: velg lette par', layout:'row', cols:3, n:[36, 24], make:(r, i, hard) => {
  const a = int(r, 2, 8), b = 10 - a, c = hard ? int(r, 11, 70) : int(r, 2, 9), o = shuf(r, [a, b, c]);
  if(hard && r() < .4){ const x = int(r, 12, 69), y = int(r, 2, 9); return {t:`${x} + ${y} + ${10 - y} =`, ans:x + 10}; }
  return {t:`${o.join(' + ')} =`, ans:a + b + c}; }});
D('hopptelling', {tittel:'Fortsett rekka', layout:'row', cols:2, n:[28, 20], make:(r, i, hard) => {
  const d = pick(r, hard ? [3, 4, 5, 10, 6, 7] : [2, 5, 10]), s = pick(r, hard ? [int(r, 1, 30), int(r, 0, 6) * d] : [0, d, 2 * d]), fwd = !(hard && r() < .3), seq = Array.from({length:5}, (_, j) => fwd ? s + j * d : s + 4 * d - j * d);
  return {t:`${seq.slice(0, 4).join(', ')}, ☐`, ans:seq[4]}; }});

/* ---------- tosifret i hodet ---------- */
const bigAdd = (r, hard) => { const k = int(r, 0, hard ? 4 : 3); let a, b;
  if(k === 0){ a = int(r, 1, 8) * 10; b = int(r, 1, 9 - a / 10 + 1 > 9 ? 9 : 10 - a / 10) * 10; return [a, b]; }
  if(k === 1){ const t = int(r, 1, 9), e = int(r, 0, 8); return [t * 10 + e, int(r, 1, 9 - e)]; }
  if(k === 2){ const t = int(r, 1, 6); return [t * 10 + int(r, 0, 9), int(r, 1, 3) * 10]; }
  if(k === 3){ const e = int(r, 0, 5), e2 = int(r, 0, 9 - e); return [int(r, 1, 4) * 10 + e, int(r, 1, 4) * 10 + e2]; }
  return [int(r, 1, 6) * 10 + int(r, 5, 9), int(r, 5, 9)]; };
D('addisjon-tosifret', {tittel:'Pluss med tosifrede tall i hodet', layout:'row', cols:4, n:[64, 30], make:(r, i, hard) => { const [a, b] = bigAdd(r, hard); if(a + b > 100) return null; return {t:`${a} + ${b} =`, ans:a + b}; }});
D('subtraksjon-tosifret', {tittel:'Minus med tosifrede tall i hodet', layout:'row', cols:4, n:[64, 30], make:(r, i, hard) => {
  const k = int(r, 0, hard ? 4 : 3);
  if(k === 0){ const a = int(r, 2, 10), b = int(r, 1, a - 1); return {t:`${a * 10} − ${b * 10} =`, ans:(a - b) * 10}; }
  if(k === 1){ const t = int(r, 1, 9), e = int(r, 2, 9), b = int(r, 1, e); return {t:`${t * 10 + e} − ${b} =`, ans:t * 10 + e - b}; }
  if(k === 2){ const t = int(r, 3, 9), e = int(r, 0, 9), b = int(r, 1, t - 1); return {t:`${t * 10 + e} − ${b * 10} =`, ans:t * 10 + e - b * 10}; }
  if(k === 3){ const t = int(r, 3, 9), e = int(r, 2, 9), t2 = int(r, 1, t - 1), e2 = int(r, 0, e); return {t:`${t * 10 + e} − ${t2 * 10 + e2} =`, ans:(t - t2) * 10 + e - e2}; }
  const t = int(r, 3, 9), e = int(r, 1, 4), b = int(r, e + 1, 9); return {t:`${t * 10 + e} − ${b} =`, ans:t * 10 + e - b}; }});

/* ---------- oppstilling (vertikale regnestykker) ---------- */
const colItem = (op, a, b) => ({t:`${a} ${op} ${b}`, ans:op === '+' ? a + b : a - b, col:{op, a, b}});
D('oppstilling-addisjon', {tittel:'Oppstilling: pluss uten veksling', layout:'col', cols:5, n:[30, 20], make:(r, i, hard) => { const [a, b] = hard ? (i % 2 ? AR.genAdd(r, 3, 3, false) : AR.genAdd(r, 3, 2, false)) : AR.genAdd(r, 2, i % 3 ? 2 : 1, false); return colItem('+', Math.max(a, b), Math.min(a, b)); }});
D('oppstilling-subtraksjon', {tittel:'Oppstilling: minus uten veksling', layout:'col', cols:5, n:[30, 20], make:(r, i, hard) => { const [a, b] = hard ? AR.genSub(r, 3, i % 2 ? 3 : 2, false) : AR.genSub(r, 2, i % 3 ? 2 : 1, false); return colItem('−', a, b); }});
D('veksling-addisjon', {tittel:'Oppstilling: pluss med veksling (mente)', layout:'col', cols:5, n:[30, 20], make:(r, i, hard) => { const p = hard ? (i % 2 ? AR.genAddWhere(r, 3, 2, x => x.any, [458, 67]) : AR.genAddWhere(r, 2, 2, x => x.sums[1] >= 10, [68, 57])) : AR.genAddWhere(r, 2, 2, (x, p, q) => p % 10 + q % 10 >= 10 && x.sums[1] < 10 && p + q <= 99, [38, 27]); return colItem('+', p[0], p[1]); }});
D('veksling-subtraksjon', {tittel:'Oppstilling: minus med veksling', layout:'col', cols:5, n:[30, 20], make:(r, i, hard) => { const [a, b] = hard ? AR.genSub(r, 3, i % 2 ? 2 : 3, true, false) : AR.genSub(r, 2, 2, true); if(a <= b) return null; return colItem('−', a, b); }});

/* ---------- likhetstegn ---------- */
D('likhetstegn', {tittel:'Begge sider like: finn tallet som mangler', layout:'row', cols:3, n:[36, 24], make:(r, i, hard) => {
  const a = int(r, 1, hard ? 12 : 8), b = int(r, 1, hard ? 12 : 8), c = int(r, 1, a + b - 1), k = int(r, 0, hard ? 3 : 1);
  if(k === 0) return {t:`${a} + ${b} = ${c} + ☐`, ans:a + b - c};
  if(k === 1) return {t:`${a + b} = ${a} + ☐`, ans:b};
  if(k === 2) return {t:`☐ + ${b} = ${a + b + 2} − 2`, ans:a}; return {t:`${a + b + c} − ☐ = ${a + b}`, ans:c}; }});
})();
