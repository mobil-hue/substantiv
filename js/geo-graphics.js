(function(){
'use strict';
const A = window.App;
const G = A.Geo = {};
const rad = d => d * Math.PI / 180;
const f1 = v => +v.toFixed(1);
const ps = pts => pts.map(p => f1(p[0]) + ',' + f1(p[1])).join(' ');

G.C = {red:'#ef4444', blue:'#3b82f6', green:'#22c55e', orange:'#f59e0b', purple:'#a855f7', teal:'#14b8a6', pink:'#ec4899', grey:'#94a3b8', sky:'#0ea5e9'};
G.shade = (hex, a) => {
  const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const t = a < 0 ? 0 : 255, p = Math.abs(a);
  r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
};
G.svg = (inner, vb, style) => `<svg viewBox="${vb || '0 0 100 100'}" ${style ? `style="${style}"` : ''} xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

/* ---------- geometri-hjelpere ---------- */
G.rot = (pts, deg, c) => { c = c || [50, 50]; const a = rad(deg), co = Math.cos(a), si = Math.sin(a);
  return pts.map(p => [c[0] + (p[0] - c[0]) * co - (p[1] - c[1]) * si, c[1] + (p[0] - c[0]) * si + (p[1] - c[1]) * co]); };
G.fit = (pts, box) => { box = box || 84;
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const s = box / Math.max(x1 - x0, y1 - y0), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  return pts.map(p => [50 + (p[0] - cx) * s, 50 + (p[1] - cy) * s]); };
G.angleDeg = (pts, i) => { const n = pts.length, a = pts[(i + n - 1) % n], v = pts[i], b = pts[(i + 1) % n];
  const ux = a[0] - v[0], uy = a[1] - v[1], wx = b[0] - v[0], wy = b[1] - v[1];
  return Math.acos(Math.max(-1, Math.min(1, (ux * wx + uy * wy) / (Math.hypot(ux, uy) * Math.hypot(wx, wy))))) * 180 / Math.PI; };
G.kindOfAngle = d => Math.abs(d - 90) < 1.5 ? 'rett' : d < 90 ? 'spiss' : 'stump';
const rightMark = (v, a, b, s) => { s = s || 9;
  const ux = a[0] - v[0], uy = a[1] - v[1], wx = b[0] - v[0], wy = b[1] - v[1], lu = Math.hypot(ux, uy), lw = Math.hypot(wx, wy);
  const u = [ux / lu * s, uy / lu * s], w = [wx / lw * s, wy / lw * s];
  return `<polyline points="${ps([[v[0] + u[0], v[1] + u[1]], [v[0] + u[0] + w[0], v[1] + u[1] + w[1]], [v[0] + w[0], v[1] + w[1]]])}" fill="none" stroke="#334155" stroke-width="2"/>`; };
G.poly = (pts, color, o) => { o = o || {};
  let s = `<polygon points="${ps(pts)}" fill="${G.shade(color, .72)}" stroke="${color}" stroke-width="${o.sw || 4}" stroke-linejoin="round"/>`;
  const n = pts.length;
  if(o.right) pts.forEach((p, i) => { if(G.kindOfAngle(G.angleDeg(pts, i)) === 'rett') s += rightMark(p, pts[(i + n - 1) % n], pts[(i + 1) % n]); });
  if(o.dots) pts.forEach(p => { s += `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="4.5" fill="#fff" stroke="${color}" stroke-width="2.5"/>`; });
  return s; };

/* ---------- todimensjonale figurer ---------- */
const regular = (n, start) => Array.from({length: n}, (_, i) => [50 + 42 * Math.cos(rad((start == null ? -90 : start) + 360 * i / n)), 50 + 42 * Math.sin(rad((start == null ? -90 : start) + 360 * i / n))]);
const V = {};
const fitAll = list => list.map(v => v.circle ? v : Object.assign({}, v, {pts:G.fit(v.pts)}));
V.trekant = fitAll([
  {pts:[[50,10],[92,82],[8,82]], lvl:1}, {pts:[[15,15],[15,85],[90,85]], lvl:1}, {pts:[[5,85],[95,85],[30,50]], lvl:2},
  {pts:[[20,85],[88,70],[45,12]], lvl:1}, {pts:[[50,5],[75,90],[25,90]], lvl:1}, {pts:G.rot([[15,15],[15,85],[90,85]], 40), lvl:2}]);
V.firkant = fitAll([
  {pts:[[25,25],[75,25],[92,80],[8,80]], lvl:1}, {pts:[[25,22],[92,22],[75,80],[8,80]], lvl:1}, {pts:[[50,5],[85,40],[50,95],[15,40]], lvl:1},
  {pts:[[50,15],[92,85],[50,60],[8,85]], lvl:2}, {pts:[[12,18],[88,28],[78,85],[22,70]], lvl:1}, {pts:[[15,20],[15,80],[85,80],[60,20]], lvl:1}]);
V.kvadrat = fitAll([
  {pts:[[20,20],[80,20],[80,80],[20,80]], lvl:1}, {pts:G.rot([[20,20],[80,20],[80,80],[20,80]], 45), lvl:2}, {pts:G.rot([[20,20],[80,20],[80,80],[20,80]], 20), lvl:2}]);
V.rektangel = fitAll([
  {pts:[[10,28],[90,28],[90,72],[10,72]], lvl:1}, {pts:[[28,10],[72,10],[72,90],[28,90]], lvl:1}, {pts:G.rot([[10,28],[90,28],[90,72],[10,72]], 25), lvl:2},
  {pts:[[8,38],[92,38],[92,62],[8,62]], lvl:1}]);
V.femkant = fitAll([
  {pts:regular(5), lvl:1}, {pts:[[50,8],[92,40],[78,90],[22,90],[8,40]], lvl:1}, {pts:[[15,25],[60,10],[92,45],[70,88],[20,75]], lvl:1}, {pts:G.rot(regular(5), 36), lvl:2}]);
V.sekskant = fitAll([{pts:regular(6, 0), lvl:3}, {pts:[[25,12],[75,12],[95,50],[75,88],[25,88],[5,50]], lvl:3}]);
V.sirkel = [{circle:true, lvl:1}];
G.SHAPE_COLOR = {trekant:G.C.red, firkant:G.C.blue, kvadrat:G.C.orange, rektangel:G.C.green, femkant:G.C.purple, sekskant:G.C.teal, sirkel:G.C.sky};
G.shapes = V;
G.shapeCorners = {trekant:3, firkant:4, kvadrat:4, rektangel:4, femkant:5, sekskant:6, sirkel:0};
G.shapeSvg = (kind, vi, o) => { o = o || {}; const v = V[kind][vi % V[kind].length], c = o.color || G.SHAPE_COLOR[kind];
  const inner = v.circle ? `<circle cx="50" cy="50" r="40" fill="${G.shade(c, .72)}" stroke="${c}" stroke-width="4"/>` : G.poly(v.pts, c, {right:o.right !== false, dots:o.dots});
  return G.svg(inner, '0 0 100 100', o.style); };

/* ---------- tredimensjonale figurer (skråprojeksjon) ---------- */
const pad = 10, K = .5, EDGE = '#334155';
const poly3 = (arr, fill) => `<polygon points="${ps(arr)}" fill="${fill}" stroke="${EDGE}" stroke-width="2.5" stroke-linejoin="round"/>`;
const dash = (a, b) => `<line x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}" stroke="${EDGE}" stroke-width="2" stroke-dasharray="5 4" opacity=".75"/>`;
const mk = (w, h, d) => { const W = w + d * K, H = h + d * K;
  return {W:W + 2 * pad, H:H + 2 * pad, P:(x, y, z) => [pad + x + z * K, pad + H - (y + z * K)]}; };
G.box = (w, h, d, color) => { const m = mk(w, h, d), P = m.P, c = color || G.C.blue;
  const front = [P(0,0,0), P(w,0,0), P(w,h,0), P(0,h,0)], top = [P(0,h,0), P(w,h,0), P(w,h,d), P(0,h,d)], right = [P(w,0,0), P(w,0,d), P(w,h,d), P(w,h,0)];
  return {w:m.W, h:m.H, svg:G.svg(dash(P(0,0,0), P(0,0,d)) + dash(P(0,0,d), P(w,0,d)) + dash(P(0,0,d), P(0,h,d)) +
    poly3(front, G.shade(c, .5)) + poly3(top, G.shade(c, .72)) + poly3(right, G.shade(c, .25)), `0 0 ${f1(m.W)} ${f1(m.H)}`)}; };
G.pyramid = (w, h, d, color) => { const m = mk(w, h, d), P = m.P, c = color || G.C.orange, A_ = P(w / 2, h, d / 2);
  const b0 = P(0,0,0), b1 = P(w,0,0), b2 = P(w,0,d), b3 = P(0,0,d);
  return {svg:G.svg(dash(b0, b3) + dash(b3, b2) + dash(b3, A_) + poly3([b0, b1, A_], G.shade(c, .5)) + poly3([b1, b2, A_], G.shade(c, .2)), `0 0 ${f1(m.W)} ${f1(m.H)}`)}; };
G.triPrism = (w, h, d, color) => { const m = mk(w, h, d), P = m.P, c = color || G.C.green;
  const a0 = P(0,0,0), b0 = P(w,0,0), c0 = P(w / 2,h,0), a1 = P(0,0,d), b1 = P(w,0,d), c1 = P(w / 2,h,d);
  return {svg:G.svg(dash(a1, b1) + poly3([a0, c0, c1, a1], G.shade(c, .72)) + poly3([b0, b1, c1, c0], G.shade(c, .25)) + poly3([a0, b0, c0], G.shade(c, .5)), `0 0 ${f1(m.W)} ${f1(m.H)}`)}; };
G.cylinder = (r, h, color) => { const c = color || G.C.green, ry = r * .38, W = 2 * r + 2 * pad, H = h + 2 * ry + 2 * pad, cx = pad + r, top = pad + ry, bot = pad + ry + h;
  return {svg:G.svg(`<path d="M${cx - r},${top} L${cx - r},${bot} A${r},${ry} 0 0 0 ${cx + r},${bot} L${cx + r},${top}" fill="${G.shade(c, .5)}" stroke="${EDGE}" stroke-width="2.5"/>
    <path d="M${cx - r},${bot} A${r},${ry} 0 0 1 ${cx + r},${bot}" fill="none" stroke="${EDGE}" stroke-width="2" stroke-dasharray="5 4" opacity=".75"/>
    <ellipse cx="${cx}" cy="${top}" rx="${r}" ry="${ry}" fill="${G.shade(c, .75)}" stroke="${EDGE}" stroke-width="2.5"/>`, `0 0 ${W} ${f1(H)}`)}; };
G.sphere = (r, color) => { const c = color || G.C.red, W = 2 * r + 2 * pad, cx = pad + r, cy = pad + r;
  return {svg:G.svg(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${G.shade(c, .45)}" stroke="${EDGE}" stroke-width="2.5"/>
    <path d="M${cx - r},${cy} A${r},${r * .3} 0 0 0 ${cx + r},${cy}" fill="none" stroke="${EDGE}" stroke-width="2" opacity=".75"/>
    <path d="M${cx - r},${cy} A${r},${r * .3} 0 0 1 ${cx + r},${cy}" fill="none" stroke="${EDGE}" stroke-width="2" stroke-dasharray="5 4" opacity=".5"/>
    <ellipse cx="${cx - r * .38}" cy="${cy - r * .45}" rx="${r * .2}" ry="${r * .12}" fill="#fff" opacity=".55" transform="rotate(-35 ${cx - r * .38} ${cy - r * .45})"/>`, `0 0 ${W} ${W}`)}; };
// navn -> tegning. (kube og prisme: samme boks, ulik form)
G.SOLIDS = {
  kube:{no:'kube', zh:'正方体', py:'zhèngfāngtǐ', draw:() => G.box(60, 60, 60, G.C.orange), color:G.C.orange, v:8, e:12, f:6, faces:'6 kvadrater', facesZh:'6 个正方形', fs:['k','k','k','k','k','k']},
  prisme:{no:'prisme', zh:'棱柱（长方体盒子）', py:'léngzhù', draw:() => G.box(60, 60, 100, G.C.blue), color:G.C.blue, v:8, e:12, f:6, faces:'2 kvadrater og 4 rektangler', facesZh:'2 个正方形和 4 个长方形', fs:['k','k','r','r','r','r']},
  pyramide:{no:'pyramide', zh:'棱锥（金字塔）', py:'léngzhuī', draw:() => G.pyramid(70, 70, 70, G.C.orange), color:G.C.orange, v:5, e:8, f:5, faces:'1 kvadrat og 4 trekanter', facesZh:'1 个正方形和 4 个三角形', fs:['k','t','t','t','t']},
  sylinder:{no:'sylinder', zh:'圆柱', py:'yuánzhù', draw:() => G.cylinder(28, 64, G.C.green), color:G.C.green, v:0, e:2, f:3, faces:'2 sirkler og 1 rektangel (rullet sammen)', facesZh:'2 个圆和 1 个长方形（卷起来）', fs:['s','s','r']},
  kule:{no:'kule', zh:'球', py:'qiú', draw:() => G.sphere(38, G.C.red), color:G.C.red, v:0, e:0, f:1, faces:'1 buet flate', facesZh:'1 个曲面', fs:['b']},
  trekantprisme:{no:'trekantprisme', zh:'三棱柱', py:'sānléngzhù', draw:() => G.triPrism(70, 60, 90, G.C.green), color:G.C.green, v:6, e:9, f:5, faces:'2 trekanter og 3 rektangler', facesZh:'2 个三角形和 3 个长方形', fs:['t','t','r','r','r']}
};
G.solidSvg = (name, style) => { const s = G.SOLIDS[name].draw().svg; return style ? s.replace('<svg ', `<svg style="${style}" `) : s; };

/* flate-symboler: k=kvadrat r=rektangel t=trekant s=sirkel b=buet */
G.faceIcon = (k, c) => { c = c || '#64748b'; const fill = G.shade(c, .7);
  return ({k:`<rect x="3" y="3" width="24" height="24" fill="${fill}" stroke="${c}" stroke-width="3"/>`, r:`<rect x="2" y="7" width="34" height="18" fill="${fill}" stroke="${c}" stroke-width="3"/>`,
    t:`<polygon points="16,3 30,28 2,28" fill="${fill}" stroke="${c}" stroke-width="3" stroke-linejoin="round"/>`, s:`<circle cx="16" cy="16" r="13" fill="${fill}" stroke="${c}" stroke-width="3"/>`,
    b:`<path d="M3 8 Q16 22 29 8 L29 24 Q16 34 3 24Z" fill="${fill}" stroke="${c}" stroke-width="3"/>`})[k]; };
G.faceSet = fs => { let x = 4; const parts = fs.map(k => { const w = k === 'r' ? 40 : 32, s = `<g transform="translate(${x},4)">${G.faceIcon(k, ({k:'#f59e0b', r:'#16a34a', t:'#ef4444', s:'#0ea5e9', b:'#ef4444'})[k])}</g>`; x += w; return s; });
  return G.svg(parts.join(''), `0 0 ${x + 4} 40`); };


// kube med ett element utheva: 'hjorne' | 'kant' | 'flate'
G.cubeMark = what => { const w = 60, h = 60, d = 60, m = mk(w, h, d), P = m.P, base = G.box(w, h, d, G.C.orange).svg; let hl = '';
  if(what === 'hjorne'){ const p = P(w, h, 0); hl = `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="9" fill="#ef4444" stroke="#fff" stroke-width="3"/>`; }
  if(what === 'kant'){ const a = P(w, h, 0), b = P(w, h, d); hl = `<line x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}" stroke="#ef4444" stroke-width="7" stroke-linecap="round"/>`; }
  if(what === 'flate'){ hl = `<polygon points="${ps([P(0,0,0), P(w,0,0), P(w,h,0), P(0,h,0)])}" fill="#ef4444" fill-opacity=".55" stroke="#ef4444" stroke-width="3"/>`; }
  return base.replace('</svg>', hl + '</svg>'); };

/* ---------- klosser (isometrisk) ---------- */
G.blocks = (hm, o) => { o = o || {}; const s = 20, cols = o.colors || [G.C.orange], rows = hm.length, cs = hm[0].length;
  const P = (x, y, z) => [(x - y) * s * .866, (x + y) * s * .5 - z * s];
  const cubes = []; for(let y = 0; y < rows; y++) for(let x = 0; x < cs; x++) for(let z = 0; z < hm[y][x]; z++) cubes.push({x, y, z});
  cubes.sort((a, b) => (a.x + a.y) - (b.x + b.y) || a.z - b.z);
  const col = o.color || cols[0];
  let out = '', xs = [], ys = [];
  cubes.forEach(c => { const {x, y, z} = c;
    const top = [P(x,y,z+1), P(x+1,y,z+1), P(x+1,y+1,z+1), P(x,y+1,z+1)], left = [P(x,y+1,z), P(x+1,y+1,z), P(x+1,y+1,z+1), P(x,y+1,z+1)], right = [P(x+1,y,z), P(x+1,y+1,z), P(x+1,y+1,z+1), P(x+1,y,z+1)];
    [top, left, right].forEach(f => f.forEach(p => { xs.push(p[0]); ys.push(p[1]); }));
    const e = G.shade(col, -.35);
    out += `<polygon points="${ps(left)}" fill="${G.shade(col, .15)}" stroke="${e}" stroke-width="1.4" stroke-linejoin="round"/><polygon points="${ps(right)}" fill="${G.shade(col, -.15)}" stroke="${e}" stroke-width="1.4" stroke-linejoin="round"/><polygon points="${ps(top)}" fill="${G.shade(col, .5)}" stroke="${e}" stroke-width="1.4" stroke-linejoin="round"/>`; });
  const x0 = Math.min(...xs) - 6, x1 = Math.max(...xs) + 6, y0 = Math.min(...ys) - 6, y1 = Math.max(...ys) + 6;
  return G.svg(out, `${f1(x0)} ${f1(y0)} ${f1(x1 - x0)} ${f1(y1 - y0)}`); };

/* ---------- vinkler ---------- */
G.angle = (deg, o) => { o = o || {}; const vx = 38, vy = 82, L = 62, a1 = rad(o.base == null ? Math.max(0, (180 - deg) / 2 - 20) : o.base), a2 = a1 + rad(deg);
  const e1 = [vx + L * Math.cos(a1), vy - L * Math.sin(a1)], e2 = [vx + L * Math.cos(a2), vy - L * Math.sin(a2)], c = o.color || G.C.blue;
  const r = 20, p1 = [vx + r * Math.cos(a1), vy - r * Math.sin(a1)], p2 = [vx + r * Math.cos(a2), vy - r * Math.sin(a2)];
  let mark;
  if(Math.abs(deg - 90) < .5){ const q = [vx + 14 * Math.cos(a1) + 14 * Math.cos(a2), vy - 14 * Math.sin(a1) - 14 * Math.sin(a2)], t1 = [vx + 14 * Math.cos(a1), vy - 14 * Math.sin(a1)], t2 = [vx + 14 * Math.cos(a2), vy - 14 * Math.sin(a2)];
    mark = `<polyline points="${ps([t1, q, t2])}" fill="none" stroke="#334155" stroke-width="2.5"/>`; }
  else mark = `<path d="M${f1(vx)},${f1(vy)} L${f1(p1[0])},${f1(p1[1])} A${r},${r} 0 0 0 ${f1(p2[0])},${f1(p2[1])} Z" fill="${G.shade(c, .6)}" stroke="${c}" stroke-width="2.5"/>`;
  return G.svg(`${mark}<line x1="${vx}" y1="${vy}" x2="${f1(e1[0])}" y2="${f1(e1[1])}" stroke="#334155" stroke-width="4" stroke-linecap="round"/><line x1="${vx}" y1="${vy}" x2="${f1(e2[0])}" y2="${f1(e2[1])}" stroke="#334155" stroke-width="4" stroke-linecap="round"/>${o.label ? `<text x="${f1(vx + 28)}" y="${vy + 14}" font-size="14" font-weight="800" fill="#334155" font-family="sans-serif">${o.label}</text>` : ''}`, '0 0 120 100'); };

/* ---------- utbrettede figurer (nett) ---------- */
G.cells = (cells, o) => { o = o || {}; const s = o.s || 20, c = o.color || G.C.blue;
  const rs = cells.map(x => x[0]), cs = cells.map(x => x[1]), r0 = Math.min(...rs), c0 = Math.min(...cs), r1 = Math.max(...rs), c1 = Math.max(...cs);
  const out = cells.map(([r, k]) => `<rect x="${4 + (k - c0) * s}" y="${4 + (r - r0) * s}" width="${s}" height="${s}" fill="${G.shade(c, .65)}" stroke="${c}" stroke-width="2"/>`).join('');
  return G.svg(out, `0 0 ${(c1 - c0 + 1) * s + 8} ${(r1 - r0 + 1) * s + 8}`); };
// terningrulling: er cellene et nett for en kube?
G.isCubeNet = cells => {
  const key = (r, c) => r + ',' + c, set = new Set(cells.map(x => key(x[0], x[1])));
  if(set.size !== 6) return false;
  const roll = (d, dir) => { const [t, b, n, s, e, w] = d;
    if(dir === 'e') return [w, e, n, s, t, b]; if(dir === 'w') return [e, w, n, s, b, t];
    if(dir === 'n') return [s, n, t, b, e, w]; return [n, s, b, t, e, w]; };
  const seen = new Map(), start = cells[0], q = [[start, [0, 1, 2, 3, 4, 5]]]; seen.set(key(start[0], start[1]), 1);
  const bottoms = new Set([1]); const vis = new Set([key(start[0], start[1])]);
  while(q.length){ const [cell, d] = q.shift(); const nb = [[0, 1, 'e'], [0, -1, 'w'], [-1, 0, 'n'], [1, 0, 's']];
    for(const [dr, dc, dir] of nb){ const r = cell[0] + dr, c = cell[1] + dc, k = key(r, c); if(!set.has(k) || vis.has(k)) continue;
      vis.add(k); const nd = roll(d, dir); bottoms.add(nd[1]); q.push([[r, c], nd]); } }
  return vis.size === 6 && bottoms.size === 6;
};
// alle heksominoer (35) -> gyldige (11) og ugyldige (24)
G.hexominoes = (() => {
  const norm = cells => { const r0 = Math.min(...cells.map(c => c[0])), c0 = Math.min(...cells.map(c => c[1])); return cells.map(c => [c[0] - r0, c[1] - c0]).sort((a, b) => a[0] - b[0] || a[1] - b[1]); };
  const sig = cells => cells.map(c => c.join(':')).join('|');
  const variants = cells => { const out = []; let cur = cells; for(let i = 0; i < 4; i++){ cur = cur.map(([r, c]) => [c, -r]); out.push(norm(cur)); out.push(norm(cur.map(([r, c]) => [r, -c]))); } return out; };
  const canon = cells => variants(cells).map(sig).sort()[0];
  let level = new Map([[canon([[0, 0]]), [[0, 0]]]]);
  for(let n = 2; n <= 6; n++){ const next = new Map();
    level.forEach(cells => { const have = new Set(cells.map(c => c.join(',')));
      cells.forEach(([r, c]) => [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => { const nr = r + dr, nc = c + dc; if(have.has(nr + ',' + nc)) return; const nn = norm(cells.concat([[nr, nc]])); const k = canon(nn); if(!next.has(k)) next.set(k, nn); })); });
    level = next; }
  return Array.from(level.values()).map(c => ({cells:c, valid:G.isCubeNet(c)}));
})();
G.cubeNets = () => G.hexominoes.filter(h => h.valid);
G.badNets = () => G.hexominoes.filter(h => !h.valid);
G.transformCells = (cells, rot, flip) => { let cur = cells; for(let i = 0; i < rot; i++) cur = cur.map(([r, c]) => [c, -r]); if(flip) cur = cur.map(([r, c]) => [r, -c]); return cur; };
// andre nett (egne tegninger)
G.netSvg = (kind, o) => { o = o || {}; const s = 22;
  const rect = (x, y, w, h, c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${G.shade(c, .65)}" stroke="${c}" stroke-width="2"/>`;
  const tri = (a, b, c_, col) => `<polygon points="${ps([a, b, c_])}" fill="${G.shade(col, .65)}" stroke="${col}" stroke-width="2" stroke-linejoin="round"/>`;
  if(kind === 'pyramide'){ const c = G.C.orange, x = 4 + s * 2, y = 4 + s * 2; // kvadrat i midten, trekant på hver side
    return G.svg(rect(x, y, s * 2, s * 2, c) + tri([x, y], [x + 2 * s, y], [x + s, y - 2 * s], c) + tri([x, y + 2 * s], [x + 2 * s, y + 2 * s], [x + s, y + 4 * s], c) + tri([x, y], [x, y + 2 * s], [x - 2 * s, y + s], c) + tri([x + 2 * s, y], [x + 2 * s, y + 2 * s], [x + 4 * s, y + s], c), `0 0 ${s * 8 + 8} ${s * 8 + 8}`); }
  if(kind === 'prisme'){ const c = G.C.blue; const w = s * 2, h = s * 4, x = 4, y = 4 + w;
    return G.svg([0, 1, 2, 3].map(i => rect(x + i * w, y, w, h, c)).join('') + rect(x + w, y - w, w, w, c) + rect(x + w, y + h, w, w, c), `0 0 ${w * 4 + 8} ${h + 2 * w + 8}`); }
  if(kind === 'sylinder'){ const c = G.C.green, r = 15, w = 100, h = 56, x = 4, y = 4 + 2 * r;
    return G.svg(rect(x, y, w, h, c) + `<circle cx="${x + 25}" cy="${y - r}" r="${r}" fill="${G.shade(c, .65)}" stroke="${c}" stroke-width="2"/><circle cx="${x + 25}" cy="${y + h + r}" r="${r}" fill="${G.shade(c, .65)}" stroke="${c}" stroke-width="2"/>`, `0 0 ${w + 8} ${h + 4 * r + 8}`); }
  if(kind === 'trekantprisme'){ const c = G.C.green, w = 36, h = 60, x = 4, y = 4 + 32;
    return G.svg([0, 1, 2].map(i => rect(x + i * w, y, w, h, c)).join('') + tri([x + w, y], [x + 2 * w, y], [x + 1.5 * w, y - 32], c) + tri([x + w, y + h], [x + 2 * w, y + h], [x + 1.5 * w, y + h + 32], c), `0 0 ${w * 3 + 8} ${h + 64 + 8}`); }
  return '';
};

/* ---------- analyse av tegnet polygon (prikkpapir) ---------- */
G.analyze = pts => {
  // fjern doble punkt og punkt på rett linje
  let p = pts.filter((q, i) => { const n = pts[(i + 1) % pts.length]; return q[0] !== n[0] || q[1] !== n[1]; });
  const clean = a => a.filter((q, i) => { const pr = a[(i + a.length - 1) % a.length], nx = a[(i + 1) % a.length]; return (q[0] - pr[0]) * (nx[1] - q[1]) - (q[1] - pr[1]) * (nx[0] - q[0]) !== 0; });
  p = clean(p); const n = p.length; if(n < 3) return {ok:false, n};
  const seg = i => [p[i], p[(i + 1) % n]];
  const orient = (a, b, c) => Math.sign((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]));
  const onSeg = (a, b, c) => Math.min(a[0], b[0]) <= c[0] && c[0] <= Math.max(a[0], b[0]) && Math.min(a[1], b[1]) <= c[1] && c[1] <= Math.max(a[1], b[1]);
  const inter = (a, b, c, d) => { const o1 = orient(a, b, c), o2 = orient(a, b, d), o3 = orient(c, d, a), o4 = orient(c, d, b);
    if(o1 !== o2 && o3 !== o4) return true; return (o1 === 0 && onSeg(a, b, c)) || (o2 === 0 && onSeg(a, b, d)) || (o3 === 0 && onSeg(c, d, a)) || (o4 === 0 && onSeg(c, d, b)); };
  let simple = true;
  for(let i = 0; i < n; i++) for(let j = i + 1; j < n; j++){ if(j === i + 1 || (i === 0 && j === n - 1)) continue; const [a, b] = seg(i), [c, d] = seg(j); if(inter(a, b, c, d)) simple = false; }
  let area2 = 0; for(let i = 0; i < n; i++){ const [a, b] = seg(i); area2 += a[0] * b[1] - b[0] * a[1]; }
  const sign = Math.sign(area2);
  const angles = p.map((v, i) => { const a = p[(i + n - 1) % n], b = p[(i + 1) % n]; const ux = a[0] - v[0], uy = a[1] - v[1], wx = b[0] - v[0], wy = b[1] - v[1];
    const dot = ux * wx + uy * wy, cross = (v[0] - a[0]) * (b[1] - v[1]) - (v[1] - a[1]) * (b[0] - v[0]);
    if(cross * sign < 0) return 'refleks'; return dot === 0 ? 'rett' : dot > 0 ? 'spiss' : 'stump'; });
  const sides = p.map((v, i) => { const b = p[(i + 1) % n]; return (v[0] - b[0]) ** 2 + (v[1] - b[1]) ** 2; });
  const rightLike = p.map((v, i) => { const a = p[(i + n - 1) % n], b = p[(i + 1) % n]; return (a[0] - v[0]) * (b[0] - v[0]) + (a[1] - v[1]) * (b[1] - v[1]) === 0; });
  return {ok:true, n, simple, angles, sides, rightLike, area:Math.abs(area2) / 2, pts:p};
};
})();
