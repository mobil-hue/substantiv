(function(){
'use strict';
/* Illustrasjoner til begrepskortene i geometri: t.art = HTML med tegninger */
const A = window.App, G = A.Geo, S = G.shapes;
const f1 = v => +v.toFixed(1);
const fg = (svg, cls, c) => `<span class="ta"><span class="fig ${cls || 'md'}">${svg}</span>${c || ''}</span>`;
const row = (...a) => `<div class="artrow">${a.join('')}</div>`;
const capt = (no, zh) => `<div class="artcap">${A.bi(no, zh)}</div>`;
const cp = (c, no, zh) => c ? capt(no, zh) : '';
const shape = (k, vi, o) => G.shapeSvg(k, vi || 0, o);
const solid = n => G.solidSvg(n);
const over = (svg, extra) => svg.replace('</svg>', extra + '</svg>');

// kant og hjørne utheva på en flat figur
const edgeOn = (k, vi, ei) => { const p = S[k][vi].pts, a = p[ei], b = p[(ei + 1) % p.length];
  return over(shape(k, vi, {right:false}), `<line x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}" stroke="#ef4444" stroke-width="8" stroke-linecap="round"/>`); };
const cornerOn = (k, vi, ci) => { const p = S[k][vi].pts[ci];
  return over(shape(k, vi, {right:false}), `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="9" fill="#ef4444" stroke="#fff" stroke-width="3"/>`); };
// små streker på kantene: like lange kanter har like mange streker
const ticks = (pts, counts) => { let t = '';
  pts.forEach((p, i) => { const q = pts[(i + 1) % pts.length], n = counts[i]; if(!n) return;
    const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L, ux = dx / L, uy = dy / L;
    for(let k = 0; k < n; k++){ const off = (k - (n - 1) / 2) * 6;
      t += `<line x1="${f1(mx + ux * off + nx * 6)}" y1="${f1(my + uy * off + ny * 6)}" x2="${f1(mx + ux * off - nx * 6)}" y2="${f1(my + uy * off - ny * 6)}" stroke="#dc2626" stroke-width="3.5" stroke-linecap="round"/>`; } });
  return t; };
const withTicks = (k, vi, counts) => over(shape(k, vi), ticks(S[k][vi].pts, counts));

const CROSS = [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1], [3, 1]];
const ART = {
  figur:c => row(fg(shape('trekant'), 'sm'), fg(shape('firkant'), 'sm'), fg(shape('sirkel'), 'sm'), fg(solid('kube'), 'sm')),
  todim:c => row(fg(shape('trekant'), 'md'), fg(shape('firkant'), 'md'), fg(shape('sirkel'), 'md')) + cp(c, 'flat: lengde og bredde', '平的：长度和宽度'),
  tredim:c => row(fg(solid('kube'), 'md'), fg(solid('kule'), 'md'), fg(solid('pyramide'), 'md')) + cp(c, 'lengde, bredde og høyde', '长度、宽度和高度'),
  kant:c => row(fg(edgeOn('trekant', 0, 0), 'md'), fg(G.cubeMark('kant'), 'md')) + cp(c, 'kant = linjen mellom to hjørner', '边 = 两个顶点之间的线'),
  hjorne:c => row(fg(cornerOn('trekant', 0, 0), 'md'), fg(G.cubeMark('hjorne'), 'md')) + cp(c, 'hjørne = der kantene møtes', '顶点 = 几条边相交的地方'),
  trekant:c => row(fg(shape('trekant', 0, {dots:true}), 'md')) + cp(c, '3 hjørner · 3 kanter', '3 个顶点 · 3 条边'),
  firkant:c => row(fg(shape('firkant', 0, {dots:true}), 'md')) + cp(c, '4 hjørner · 4 kanter', '4 个顶点 · 4 条边'),
  femkant:c => row(fg(shape('femkant', 0, {dots:true}), 'md')) + cp(c, '5 hjørner · 5 kanter', '5 个顶点 · 5 条边'),
  sirkel:c => row(fg(shape('sirkel', 0), 'md')) + cp(c, 'helt rund · ingen hjørner', '完全是圆的 · 没有顶点'),
  kvadrat:c => row(fg(withTicks('kvadrat', 0, [1, 1, 1, 1]), 'md')) + cp(c, '4 rette hjørner · 4 like lange kanter', '4 个直角 · 4 条边一样长'),
  rektangel:c => row(fg(withTicks('rektangel', 0, [1, 2, 1, 2]), 'md')) + cp(c, '4 rette hjørner · like lange kanter to og to', '4 个直角 · 对边一样长'),
  flate:c => row(fg(G.cubeMark('flate'), 'md')) + cp(c, 'flate = en flat side', '面 = 平的一面'),
  kube:c => row(fg(solid('kube'), 'md')) + cp(c, '6 kvadrater', '6 个正方形'),
  prisme:c => row(fg(solid('prisme'), 'md')) + cp(c, 'som en eske', '像一个盒子'),
  pyramide:c => row(fg(solid('pyramide'), 'md')) + cp(c, '1 kvadrat og 4 trekanter', '1 个正方形和 4 个三角形'),
  sylinder:c => row(fg(solid('sylinder'), 'md')) + cp(c, '2 sirkler og en rund side', '2 个圆和一个弯曲的侧面'),
  kule:c => row(fg(solid('kule'), 'md')) + cp(c, 'helt rund', '完全是圆的'),
  nett:c => row(fg(G.cells(CROSS, {color:G.C.orange}), 'md'), `<span class="artarrow">➜</span>`, fg(solid('kube'), 'md')) + cp(c, 'nett: brettet ut flat', '展开图：展开铺平'),
  vinkel:c => row(fg(G.angle(55, {base:10}), 'md')) + cp(c, 'der to linjer møtes', '两条线相交的地方'),
  rett:c => row(fg(G.angle(90, {base:0, label:'90°'}), 'md')) + cp(c, 'som hjørnet på et ark', '像纸的角'),
  spiss:c => row(fg(G.angle(40, {base:15, label:'<90°'}), 'md')) + cp(c, 'mindre enn rett vinkel', '比直角小'),
  stump:c => row(fg(G.angle(130, {base:5, label:'>90°'}), 'md')) + cp(c, 'større enn rett vinkel', '比直角大')
};
A.GEO_TERMS.forEach(t => { if(ART[t.key]){ t.art = ART[t.key](true); t.artPlain = ART[t.key](false); } });
})();
