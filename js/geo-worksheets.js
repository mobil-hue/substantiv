(function(){
'use strict';
const A = window.App, G = A.Geo, NM = A.GEO_NAMES;
const bi = (no, zh) => `<span class="no">${no}</span> <span class="zh">${zh}</span>`;
const gf = (svg, w, h) => `<span class="gf" style="width:${w}px;height:${h || w * .86}px">${svg}</span>`;
const ans = t => `<span class="ans">${t}</span>`;
const shuf = (rnd, a) => a.map(x => [rnd(), x]).sort((p, q) => p[0] - q[0]).map(x => x[1]);

const header = (n, noT, zhT, noI, zhI, key) => `
  <div class="shead"><div class="stitle"><span class="num">${n}</span><div><h2>${noT}${key ? ' · FASIT' : ''}</h2><div class="zh">${zhT}${key ? ' · 答案' : ''}</div></div></div>
  <div class="who">Navn / 姓名: <span class="ln"></span> &nbsp; Dato / 日期: <span class="ln s"></span> &nbsp; ⭐⭐⭐</div></div>
  <div class="instr">✏️ ${noI}<br><span class="zh">${zhI}</span></div>`;

/* ---- ark 1: flate figurer ---- */
function sheet1(d, key){
  const rows = d.shapes.map(s => `<tr><td class="fg">${gf(G.shapeSvg(s.k, s.v), 82, 70)}</td><td class="wr">${key ? ans(s.k) : ''}</td><td class="wr n">${key ? ans(G.shapeCorners[s.k]) : ''}</td><td class="wr n">${key ? ans(s.k === 'sirkel' ? 0 : G.shapeCorners[s.k]) : ''}</td></tr>`).join('');
  return `<section class="sheet ${key ? 'key' : 'sheetwrap'}">${header(1, 'Flate figurer', '平面图形', 'Skriv navnet på figuren. Tell hjørner og kanter. Velg det mest presise navnet.', '写出图形的名称。数一数顶点和边。选最准确的名称。', key)}
    <div class="wordbox">${['trekant', 'firkant', 'kvadrat', 'rektangel', 'femkant', 'sirkel'].map(k => `<span class="wb">${k}<small class="zh">${NM[k].zh}</small></span>`).join('')}</div>
    <table class="gt c1"><tr><th>Figur<br><span class="zh">图形</span></th><th>Hva heter figuren?<br><span class="zh">叫什么？</span></th><th>Hjørner<br><span class="zh">顶点</span></th><th>Kanter<br><span class="zh">边</span></th></tr>${rows}</table>
    <div class="ref" style="margin-top:3mm">💡 En sirkel har ingen hjørner. <span class="zh">圆没有顶点。</span> &nbsp;·&nbsp; Kvadrat: 4 like kanter. Rektangel: like to og to. <span class="zh">正方形：4 条边一样长。长方形：对边一样长。</span></div></section>`;
}

/* ---- ark 2: romfigurer ---- */
function sheet2(d, key){
  const names = ['kube', 'prisme', 'pyramide', 'sylinder', 'kule', 'trekantprisme'];
  const a = d.solids.map(s => `<div class="sc"><div class="gfw">${gf(G.solidSvg(s), 94, 78)}</div><div class="wl">${key ? ans(s) : ''}</div></div>`).join('');
  const b = d.poly.map(s => `<tr><td class="fg">${gf(G.solidSvg(s), 68, 56)}</td><td class="nm">${key ? ans(s) : ''}</td><td class="wr n">${key ? ans(G.SOLIDS[s].v) : ''}</td><td class="wr n">${key ? ans(G.SOLIDS[s].e) : ''}</td><td class="wr n">${key ? ans(G.SOLIDS[s].f) : ''}</td></tr>`).join('');
  const c = d.dim.map(o => `<div class="dm"><div class="gfw">${gf(o.svg, 58, 50)}</div><div class="ch">${key ? (o.d === 2 ? '<b class="o">todimensjonal</b><br>tredimensjonal' : 'todimensjonal<br><b class="o">tredimensjonal</b>') : 'todimensjonal<br>tredimensjonal'}</div></div>`).join('');
  return `<section class="sheet ${key ? 'key' : 'sheetwrap'}">${header(2, 'Romfigurer', '立体图形', 'A: Skriv navnet. B: Tell hjørner, kanter og flater. C: Ring rundt riktig svar.', 'A：写出名称。B：数顶点、棱和面。C：圈出正确答案。', key)}
    <div class="wordbox">${names.map(k => `<span class="wb">${k}<small class="zh">${NM[k].zh}</small></span>`).join('')}</div>
    <h3>A · Hva heter figuren? <span class="zh">叫什么？</span></h3><div class="sg">${a}</div>
    <h3>B · Hjørner, kanter og flater <span class="zh">顶点、棱、面</span></h3>
    <table class="gt c2"><tr><th>Figur</th><th>Navn</th><th>Hjørner<br><span class="zh">顶点</span></th><th>Kanter<br><span class="zh">棱</span></th><th>Flater<br><span class="zh">面</span></th></tr>${b}</table>
    <h3>C · Todimensjonal eller tredimensjonal? <span class="zh">二维还是三维？</span></h3><div class="dg">${c}</div></section>`;
}

/* ---- ark 3: vinkler ---- */
const AKN = {rett:['rett', '直角'], spiss:['spiss', '锐角'], stump:['stump', '钝角']};
function polyWithMarks(p, key){
  const n = p.length; let s = `<polygon points="${p.map(q => q.map(v => v.toFixed(1)).join(',')).join(' ')}" fill="#f1f5f9" stroke="#334155" stroke-width="3.2" stroke-linejoin="round"/>`;
  p.forEach((q, i) => { const k = G.kindOfAngle(G.angleDeg(p, i)); const c = key ? ({rett:'#16a34a', spiss:'#ef4444', stump:'#3b82f6'})[k] : '#fff';
    s += `<circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="8.5" fill="${c}" stroke="${key ? c : '#64748b'}" stroke-width="2.4"/>`; });
  return G.svg(s, '0 0 100 100'); }
function sheet3(d, key){
  const a = d.angles.map((o, i) => `<div class="an"><div class="gfw">${gf(G.angle(o.deg, {base:o.base}), 100, 84)}</div><div class="wl">${key ? ans(AKN[G.kindOfAngle(o.deg)][0] + ' vinkel') : ''}</div></div>`).join('');
  const b = d.polys.map(p => `<div class="pp">${gf(polyWithMarks(p, key), 150, 150)}</div>`).join('');
  return `<section class="sheet ${key ? 'key' : 'sheetwrap'}">${header(3, 'Vinkler', '角', 'A: Skriv rett, spiss eller stump vinkel. B: Fargelegg ringene i hjørnene.', 'A：写出直角、锐角或钝角。B：给顶点的小圆涂色。', key)}
    <div class="ref"><b style="color:#16a34a">● rett vinkel</b> (90°, som hjørnet på et ark) <span class="zh">直角</span> &nbsp; <b style="color:#ef4444">● spiss vinkel</b> (mindre enn rett) <span class="zh">锐角</span> &nbsp; <b style="color:#3b82f6">● stump vinkel</b> (større enn rett) <span class="zh">钝角</span></div>
    <h3>A · Hva slags vinkel er dette? <span class="zh">这是什么角？</span></h3><div class="ag">${a}</div>
    <h3>B · Fargelegg: <b style="color:#16a34a">rett = grønn</b>, <b style="color:#ef4444">spiss = rød</b>, <b style="color:#3b82f6">stump = blå</b> <span class="zh">涂色：直角绿，锐角红，钝角蓝</span></h3><div class="pg">${b}</div></section>`;
}

/* ---- ark 4: prikkpapir ---- */
function dotGrid(pts, cols, rows){
  const S = 22, M = 14, W = M * 2 + (cols - 1) * S, H = M * 2 + (rows - 1) * S; let s = '';
  if(pts) s += `<polygon points="${pts.map(p => (M + p[0] * S) + ',' + (M + p[1] * S)).join(' ')}" fill="#fed7aa" fill-opacity=".7" stroke="#dc2626" stroke-width="3.5" stroke-linejoin="round"/>`;
  for(let j = 0; j < rows; j++) for(let i = 0; i < cols; i++) s += `<circle cx="${M + i * S}" cy="${M + j * S}" r="2.6" fill="#475569"/>`;
  return G.svg(s, `0 0 ${W} ${H}`); }
function sheet4(d, key){
  const boxes = d.tasks.map((t, i) => `<div class="db"><div class="dt"><b>${i + 1}.</b> ${bi(t.no, t.zh)}</div><div class="dgd">${dotGrid(key ? t.sol : null, 9, 6)}</div></div>`).join('');
  return `<section class="sheet ${key ? 'key' : 'sheetwrap'}">${header(4, 'Tegn på prikkpapir', '在点阵纸上画图', 'Bruk linjal. Tegn figuren ved å binde sammen prikkene.', '用尺子，把圆点连起来画出图形。', key)}
    <div class="dboxes">${boxes}</div>
    <div class="ref" style="margin-top:3mm">💡 ${key ? 'Fasiten viser ett forslag. Det finnes ofte mange riktige svar! <span class="zh">答案只是一种画法，通常有很多种正确答案！</span>' : 'Sjekk: Har figuren riktig antall hjørner? Er vinklene riktige? <span class="zh">检查：顶点数对吗？角对吗？</span>'}</div></section>`;
}

/* ---- ark 5: nett og klosser ---- */
function sheet5(d, key){
  const a = d.blocks.map(m => `<div class="bl"><div class="gfw">${gf(G.blocks(m, {color:'#f59e0b'}), 130, 112)}</div><div class="wl">Klosser: ${key ? ans(m.flat().reduce((x, y) => x + y, 0)) : '_____'}</div></div>`).join('');
  const b = d.missing.map(m => { const t = m.flat().reduce((x, y) => x + y, 0); return `<div class="bl"><div class="gfw">${gf(G.blocks(m, {color:'#3b82f6'}), 130, 112)}</div><div class="wl">Mangler: ${key ? ans(`27 − ${t} = ${27 - t}`) : '_____'}</div></div>`; }).join('');
  const c = d.nets.map(n => `<div class="nt"><div class="gfw">${gf(G.cells(G.transformCells(n.cells, n.rot, n.flip), {color:n.valid ? '#16a34a' : '#f59e0b'}), 108, 100)}</div><div class="ch">${key ? (n.valid ? '<b class="o">✔ kubenett</b>' : '✖ ikke kubenett') : '☐ kubenett &nbsp; ☐ ikke'}</div></div>`).join('');
  return `<section class="sheet ${key ? 'key' : 'sheetwrap'}">${header(5, 'Klosser og nett', '小方块和展开图', 'A: Hvor mange klosser? Tell også de du ikke ser. B: Hvor mange mangler for å lage en kube (3 × 3 × 3 = 27)? C: Hvilke er nett til en kube?', 'A：有几个小方块？看不见的也要数。B：还差几个才能拼成正方体（3×3×3＝27）？C：哪些是正方体的展开图？', key)}
    <h3>A · Tell klossene <span class="zh">数小方块</span></h3><div class="bg">${a}</div>
    <h3>B · Hvor mange mangler? <span class="zh">还差几个？</span></h3><div class="bg">${b}</div>
    <h3>C · Er det et nett til en kube? <span class="zh">是正方体的展开图吗？</span></h3><div class="ng">${c}</div></section>`;
}

/* ---- data (samme tall i ark og fasit) ---- */
const LIBPOLY = [[[1,1],[4,1],[1,4]], [[0,0],[6,0],[2,1]], [[1,1],[5,1],[5,4],[1,4]], [[1,1],[4,1],[4,4],[1,4]], [[1,1],[3,1],[3,3],[1,3]], [[0,0],[5,0],[5,1],[2,1],[2,4],[0,4]],
  [[1,0],[3,0],[4,1],[4,3],[3,4],[1,4],[0,3],[0,1]], [[0,0],[2,0],[3,1],[2,2],[0,2]], [[0,3],[2,0],[4,3]], [[0,0],[4,0],[5,3],[1,3]], [[1,1],[6,2],[4,4],[0,3]], [[0,0],[3,0],[3,3],[0,3]], [[0,0],[2,0],[2,3],[0,3]],
  [[0,0],[4,0],[4,2],[0,2]], [[1,0],[4,0],[3,3],[0,3]], [[0,1],[3,0],[6,1],[3,5]]];
function solutionFor(check, rnd){
  for(const p of LIBPOLY){ const an = G.analyze(p); if(an.ok && an.simple && check(an)) return p; }
  for(let t = 0; t < 30000; t++){ const k = 3 + Math.floor(rnd() * 7), p = []; for(let i = 0; i < k; i++) p.push([Math.floor(rnd() * 9), Math.floor(rnd() * 6)]); const an = G.analyze(p); if(an.ok && an.simple && an.n === p.length && check(an)) return p; }
  return null; }

A.GeoWorksheets = {
  solutionFor:(check) => solutionFor(check, A.seeded(7)),
  dotGrid:(pts) => dotGrid(pts, 9, 6),
  build(level, seed){
    const rnd = A.seeded(seed), d = {};
    // 1: figurer
    const kinds = shuf(rnd, ['trekant', 'firkant', 'kvadrat', 'rektangel', 'femkant', 'sirkel', pick(rnd, ['trekant', 'firkant', 'rektangel']), pick(rnd, ['femkant', 'kvadrat', 'trekant'])]);
    d.shapes = kinds.map(k => { const vs = G.shapes[k].map((v, i) => [v, i]).filter(x => x[0].lvl <= level).map(x => x[1]); return {k, v:vs[Math.floor(rnd() * vs.length)] || 0}; });
    // 2: romfigurer
    d.solids = shuf(rnd, ['kube', 'prisme', 'pyramide', 'sylinder', 'kule', 'trekantprisme']);
    d.poly = shuf(rnd, level >= 3 ? ['kube', 'prisme', 'pyramide', 'trekantprisme'] : ['kube', 'prisme', 'pyramide']).slice(0, 3);
    d.dim = shuf(rnd, [].concat(shuf(rnd, A.GEO_2D).slice(0, 3).map(k => ({d:2, svg:G.shapeSvg(k, 0, {right:false})})), shuf(rnd, ['kube', 'prisme', 'pyramide', 'sylinder', 'kule']).slice(0, 3).map(k => ({d:3, svg:G.solidSvg(k)}))));
    // 3: vinkler
    const sp = level === 1 ? [30, 45, 55, 70] : [25, 40, 60, 80, 85], st = level === 1 ? [105, 120, 135, 150] : [95, 105, 125, 145, 160];
    const angs = [{deg:90, base:0}, {deg:90, base:25}, {deg:90, base:50}, {deg:90, base:15}].concat(shuf(rnd, sp).slice(0, 4).map(deg => ({deg, base:Math.max(0, (180 - deg) * (.2 + rnd() * .5))})), shuf(rnd, st).slice(0, 4).map(deg => ({deg, base:Math.max(0, (180 - deg) * (.3 + rnd() * .5))})));
    d.angles = shuf(rnd, angs);
    const lib = []; Object.keys(G.shapes).forEach(k => { if(k !== 'sirkel') G.shapes[k].forEach(v => { if(v.pts) { const pts = v.pts, n = pts.length; let ok = true, sgn = 0; for(let i = 0; i < n; i++){ const a = pts[i], b = pts[(i + 1) % n], c = pts[(i + 2) % n], cr = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]); if(Math.abs(cr) > 1e-6){ if(sgn && Math.sign(cr) !== sgn) ok = false; sgn = Math.sign(cr); } } if(ok) lib.push(pts); } }); });
    d.polys = shuf(rnd, lib).slice(0, 3).map(p => G.fit(G.rot(p, Math.floor(rnd() * 8) * 15), 78));
    // 4: tegneoppgaver
    const cand = (A.GEO_DRAW || []).filter(t => t.lvl <= level && t.mod <= 4);
    d.tasks = shuf(rnd, cand).slice(0, 4).map(t => ({no:t.no, zh:t.zh, sol:solutionFor(t.check, rnd)}));
    // 5: klosser og nett
    const mm = (cnt, lo, hi) => { const out = []; let g = 0; while(out.length < cnt && g++ < 3000){ const m = Array.from({length:3}, () => Array.from({length:3}, () => Math.floor(rnd() * 4))); const t = m.flat().reduce((a, b) => a + b, 0); if(t >= lo && t <= hi && m.flat().filter(v => v > 0).length >= 4) out.push(m); } return out; };
    d.blocks = mm(4, 6, 16); d.missing = mm(2, 10, 22);
    const valid = shuf(rnd, G.cubeNets()).slice(0, 3), bad = shuf(rnd, G.badNets()).slice(0, 3);
    d.nets = shuf(rnd, valid.map(n => ({cells:n.cells, valid:true})).concat(bad.map(n => ({cells:n.cells, valid:false})))).map(n => Object.assign(n, {rot:Math.floor(rnd() * 4), flip:rnd() < .5}));
    const sheets = [sheet1, sheet2, sheet3, sheet4, sheet5];
    return {sheets:sheets.map(f => f(d, false)).join(''), keys:sheets.map(f => f(d, true)).join('')};
  }
};
function pick(rnd, a){ return a[Math.floor(rnd() * a.length)]; }
})();
