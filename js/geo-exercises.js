(function(){
'use strict';
const A = window.App, Ex = A.Ex, G = A.Geo;
const {bi, shuffle, sample, pick, uniq} = A;
const Q = Ex.Q, FB = Ex.FB, def = Ex.def, NM = A.GEO_NAMES;

const choice = (id, lvl, mod, make, extra) => Object.assign({id, kind:'choice', lvl, mod, make}, extra || {});
const typed = (id, lvl, mod, make, extra) => Object.assign({id, kind:'type', lvl, mod, make}, extra || {});
const num = (id, lvl, mod, make, extra) => Object.assign({id, kind:'num', lvl, mod, make}, extra || {});
const fig = (svg, cls) => `<div class="fig ${cls || ''}">${svg}</div>`;
const nameBtn = n => `<div><b>${n}</b><div class="gloss zh">${NM[n].zh}</div></div>`;
const numOpts = (ans, lo) => { const c = uniq([ans + 1, ans - 1, ans + 2, ans - 2, ans + 3, ans + 4]).filter(v => v >= (lo || 0) && v !== ans);
  return shuffle([ans].concat(sample(c, 3))).map(v => ({html:`<span style="font-size:1.7rem">${v}</span>`, value:String(v)})); };
const seeded = A.seeded;

const DESC = {
  trekant:['En trekant har 3 hjørner og 3 kanter.', '三角形有 3 个顶点和 3 条边。'],
  firkant:['En firkant har 4 hjørner og 4 kanter. Denne er hverken kvadrat eller rektangel.', '四边形有 4 个顶点和 4 条边。这个既不是正方形，也不是长方形。'],
  kvadrat:['Et kvadrat har 4 rette hjørner og 4 like lange kanter.', '正方形有 4 个直角，4 条边一样长。'],
  rektangel:['Et rektangel har 4 rette hjørner. Kantene er like lange to og to.', '长方形有 4 个直角。对边一样长。'],
  femkant:['En femkant har 5 hjørner og 5 kanter.', '五边形有 5 个顶点和 5 条边。'],
  sekskant:['En sekskant har 6 hjørner og 6 kanter.', '六边形有 6 个顶点和 6 条边。'],
  sirkel:['En sirkel er helt rund og har ingen hjørner.', '圆是圆的，没有顶点。']
};
const QUADS = ['firkant', 'kvadrat', 'rektangel'];
const solidSvg = (name, vi) => { const col = [G.C.orange, G.C.blue, G.C.green, G.C.purple, G.C.red][(vi || 0) % 5];
  if(name === 'kube') return G.box(60, 60, 60, col).svg;
  if(name === 'prisme'){ const d = [[60, 60, 100], [95, 45, 60], [50, 80, 60]][(vi || 0) % 3]; return G.box(d[0], d[1], d[2], col).svg; }
  if(name === 'pyramide') return G.pyramid(70, 70, 70, col).svg;
  if(name === 'sylinder') return G.cylinder(28, 64, col).svg;
  if(name === 'kule') return G.sphere(38, col).svg;
  return G.triPrism(70, 60, 90, col).svg; };
const solidDesc = n => G.SOLIDS[n];

/* ---------- modul 0: figurer rundt oss ---------- */
def('g_intro', () => A.GEO_OBJECTS.map((o, i) => choice('g_intro:' + i, 1, 0, () => {
  const set = ['trekant', 'rektangel', 'sirkel', 'kube', 'kule', 'sylinder', 'prisme', 'pyramide'];
  const opts = shuffle([o[3]].concat(sample(set.filter(x => x !== o[3]), 3)));
  return {q:Q(`Hvilken figur ligner ${o[0]} på?`, `${o[1]}像什么图形？`), say:Q(`Hvilken figur ligner ${o[0]} på?`, `${o[1]}像什么图形？`), word:o[0],
    visual:`<div style="font-size:4.5rem">${o[2]}</div>`, layout:'grid', options:opts.map(n => ({html:nameBtn(n), value:n})), answer:o[3],
    fb:FB(`${o[0]} har form som ${/^[aeiouyæøå]/.test(o[3]) ? 'en' : 'en'} ${o[3]}.`, `${o[1]}的形状是[${o[3]}]（${NM[o[3]].zh}）。`), sayAfter:o[3]};
})));

/* ---------- modul 1: todimensjonale figurer ---------- */
def('g_shapeName', () => { const out = [];
  Object.keys(G.shapes).forEach(k => G.shapes[k].forEach((v, i) => out.push(choice(`g_shape:${k}:${i}`, v.lvl, 1, () => {
    const isQuad = QUADS.includes(k);
    let names;
    if(k === 'sekskant') names = shuffle(['femkant', 'sekskant', 'firkant', 'trekant']);
    else if(isQuad) names = shuffle(QUADS.concat([pick(['trekant', 'femkant'])]));
    else names = shuffle([k].concat(sample(['trekant', 'firkant', 'kvadrat', 'rektangel', 'femkant', 'sirkel'].filter(x => x !== k), 3)));
    return {q:Q(isQuad ? 'Hva heter figuren? Velg det mest presise navnet.' : 'Hva heter figuren?', isQuad ? '这个图形叫什么？选最准确的名称。' : '这个图形叫什么？'),
      say:Q('Hva heter figuren?', '这个图形叫什么？'), visual:fig(G.shapeSvg(k, i)), layout:'grid', options:names.map(n => ({html:nameBtn(n), value:n})), answer:k,
      fb:FB(DESC[k][0] + (isQuad && k !== 'firkant' ? ' Det er også en firkant, men vi bruker det mest presise navnet.' : ''), DESC[k][1] + (isQuad && k !== 'firkant' ? ' 它也是四边形，但我们用最准确的名称。' : '')), sayAfter:k};
  }))));
  return out; });

def('g_quadName', () => { const out = [];
  QUADS.forEach(k => G.shapes[k].forEach((v, i) => out.push(choice(`g_quad:${k}:${i}`, v.lvl, 1, () => ({
    q:Q('Hva heter firkanten? Velg det mest presise navnet.', '这个四边形叫什么？选最准确的名称。'), say:Q('Hva heter firkanten?', '这个四边形叫什么？'),
    visual:fig(G.shapeSvg(k, i)), layout:'row', options:shuffle(QUADS).map(n => ({html:nameBtn(n), value:n})), answer:k,
    fb:FB(DESC[k][0], DESC[k][1]), sayAfter:k}))))); return out; });

const cornerKinds = Object.keys(G.shapes).filter(k => k !== 'sekskant' || true);
def('g_shapeCorners', () => { const out = [];
  cornerKinds.forEach(k => G.shapes[k].forEach((v, i) => out.push(choice(`g_corn:${k}:${i}`, k === 'sirkel' ? 2 : v.lvl, 1, () => {
    const n = G.shapeCorners[k];
    return {q:Q('Hvor mange hjørner har figuren?', '这个图形有几个顶点？'), say:Q('Hvor mange hjørner har figuren?', '这个图形有几个顶点？'), visual:fig(G.shapeSvg(k, i, {dots:true})), layout:'row',
      options:numOpts(n), answer:String(n), fb:FB(DESC[k][0], DESC[k][1]), sayAfter:String(n)};
  })))); return out; });
def('g_shapeEdges', () => { const out = [];
  cornerKinds.filter(k => k !== 'sirkel').forEach(k => G.shapes[k].forEach((v, i) => out.push(choice(`g_edge:${k}:${i}`, v.lvl, 1, () => {
    const n = G.shapeCorners[k];
    return {q:Q('Hvor mange kanter har figuren?', '这个图形有几条边？'), say:Q('Hvor mange kanter har figuren?', '这个图形有几条边？'), visual:fig(G.shapeSvg(k, i)), layout:'row',
      options:numOpts(n, 1), answer:String(n), fb:FB(DESC[k][0], DESC[k][1]), sayAfter:String(n)};
  })))); return out; });
def('g_cornersType', () => { const out = [];
  cornerKinds.filter(k => k !== 'sekskant').forEach(k => G.shapes[k].forEach((v, i) => out.push(num(`g_cornT:${k}:${i}`, k === 'sirkel' ? 2 : v.lvl, 1, () => ({
    q:Q('Hvor mange hjørner har figuren?', '这个图形有几个顶点？'), say:Q('Hvor mange hjørner har figuren?', '这个图形有几个顶点？'), visual:fig(G.shapeSvg(k, i, {dots:true})),
    answer:G.shapeCorners[k], fb:FB(DESC[k][0], DESC[k][1]), sayAfter:String(G.shapeCorners[k])}))))); return out; });

/* ---------- modul 2: tredimensjonale figurer ---------- */
def('g_twoD3D', () => { const out = [];
  A.GEO_2D.forEach(k => [0, 1].forEach(i => { if(G.shapes[k][i] || i === 0) out.push(choice(`g_dim:${k}:${i}`, 1, 2, () => ({
    q:Q('Todimensjonal eller tredimensjonal?', '二维还是三维？'), say:Q('Todimensjonal eller tredimensjonal?', '二维还是三维？'), word:k, visual:fig(G.shapeSvg(k, i % G.shapes[k].length), 'md'), layout:'row',
    options:[{html:bi('todimensjonal', '二维（平的）'), value:'2'}, {html:bi('tredimensjonal', '三维（立体的）'), value:'3'}], answer:'2',
    fb:FB(`En ${k} er flat, altså todimensjonal. Du kan tegne den på papir.`, `[${k}]是平的，也就是二维的。可以画在纸上。`), sayAfter:k}))); }));
  A.GEO_3D.forEach(k => [0, 1].forEach(i => out.push(choice(`g_dim:${k}:${i}`, 1, 2, () => ({
    q:Q('Todimensjonal eller tredimensjonal?', '二维还是三维？'), say:Q('Todimensjonal eller tredimensjonal?', '二维还是三维？'), word:k, visual:fig(solidSvg(k, i), 'md'), layout:'row',
    options:[{html:bi('todimensjonal', '二维（平的）'), value:'2'}, {html:bi('tredimensjonal', '三维（立体的）'), value:'3'}], answer:'3',
    fb:FB(`${k.charAt(0).toUpperCase() + k.slice(1)} er tredimensjonal. Du kan holde den i hånden.`, `[${k}]是三维的。可以拿在手里。`), sayAfter:k})))));
  return out; });

def('g_solidName', () => { const out = [];
  A.GEO_3D.forEach(k => [0, 1, 2].forEach(i => { if(k === 'prisme' || i < 2) out.push(choice(`g_solid:${k}:${i}`, k === 'trekantprisme' ? 3 : 1, 2, () => {
    const names = shuffle([k].concat(sample(A.GEO_3D.filter(x => x !== k && (k !== 'trekantprisme' ? x !== 'trekantprisme' : true)), 3)));
    return {q:Q('Hva heter figuren?', '这个立体图形叫什么？'), say:Q('Hva heter figuren?', '这个立体图形叫什么？'), visual:fig(solidSvg(k, i), 'lg'), layout:'grid',
      options:names.map(n => ({html:nameBtn(n), value:n})), answer:k, fb:FB(`Dette er en ${k}. Den har ${solidDesc(k).faces}.`, `这是[${k}]（${NM[k].zh}）。它的面是：${solidDesc(k).facesZh}。`), sayAfter:k};
  })); })); return out; });

def('g_solidFacts', () => { const out = [], attrs = [['v', 'hjørner', '顶点'], ['e', 'kanter', '棱'], ['f', 'flater', '面']];
  ['kube', 'prisme', 'pyramide', 'trekantprisme'].forEach(k => attrs.forEach(a => out.push(choice(`g_sf:${k}:${a[0]}`, k === 'trekantprisme' ? 3 : (k === 'pyramide' ? 2 : 1), 2, () => {
    const s = solidDesc(k), n = s[a[0]];
    return {q:Q(`Hvor mange ${a[1]} har figuren?`, `这个立体图形有几个${a[2]}？`), say:Q(`Hvor mange ${a[1]} har figuren?`, `这个立体图形有几个${a[2]}？`), word:k, visual:fig(solidSvg(k, 0), 'lg'), layout:'row',
      options:numOpts(n, 1), answer:String(n), fb:FB(`${k.charAt(0).toUpperCase() + k.slice(1)}: ${s.v} hjørner, ${s.e} kanter og ${s.f} flater.`, `[${k}]：${s.v} 个顶点，${s.e} 条棱，${s.f} 个面。`), sayAfter:String(n)};
  })))); return out; });

def('g_facesQ', () => { const out = [], ks = ['kube', 'prisme', 'pyramide', 'sylinder', 'trekantprisme'];
  ks.forEach(k => {
    out.push(choice(`g_faces:a:${k}`, k === 'trekantprisme' ? 3 : 1, 2, () => {
      const others = shuffle([k].concat(sample(ks.filter(x => x !== k), 3)));
      return {q:Q('Hvilke flater har figuren?', '这个图形的面是哪一组？'), say:Q('Hvilke flater har figuren?', '这个图形的面是哪一组？'), word:k, visual:fig(solidSvg(k, 0), 'lg'), layout:'grid',
        options:others.map(n => ({html:fig(G.faceSet(solidDesc(n).fs), 'md'), value:n})), answer:k, fb:FB(`${k.charAt(0).toUpperCase() + k.slice(1)} har ${solidDesc(k).faces}.`, `[${k}]的面：${solidDesc(k).facesZh}。`), sayAfter:k};
    }));
    out.push(choice(`g_faces:b:${k}`, k === 'trekantprisme' ? 3 : 2, 2, () => {
      const others = shuffle([k].concat(sample(ks.filter(x => x !== k), 3)));
      return {q:Q('Hvilken figur kan du lage av disse flatene?', '用这些面可以做成哪个立体图形？'), say:Q('Hvilken figur kan du lage av disse flatene?', '用这些面可以做成哪个立体图形？'), visual:fig(G.faceSet(solidDesc(k).fs), 'lg'), layout:'grid',
        options:others.map(n => ({html:`<div>${fig(solidSvg(n, 0), 'md')}<div class="zh gloss">${n}</div></div>`, value:n})), answer:k, fb:FB(`${solidDesc(k).faces} gir en ${k}.`, `${solidDesc(k).facesZh}可以做成[${k}]。`), sayAfter:k};
    }));
  }); return out; });

/* ---------- modul 3: nett og klosser ---------- */
const cubeNetSvg = (cells, rot, flip) => G.cells(G.transformCells(cells, rot || 0, flip), {color:G.C.orange});
def('g_netCube', () => Array.from({length:20}, (_, n) => choice('g_netCube:' + n, n < 8 ? 2 : 3, 3, () => {
  const valid = pick(G.cubeNets()), bad = sample(G.badNets(), 3);
  const opts = shuffle([{k:'v', cells:valid.cells}].concat(bad.map((b, i) => ({k:'b' + i, cells:b.cells}))));
  return {q:Q('Hvilket av disse kan brettes til en kube?', '下面哪一个可以折成正方体？'), say:Q('Hvilket av disse kan brettes til en kube?', '下面哪一个可以折成正方体？'), layout:'grid',
    options:opts.map(o => ({html:fig(cubeNetSvg(o.cells, Math.floor(Math.random() * 4), Math.random() < .5), 'md'), value:o.k})), answer:'v',
    fb:FB('Et nett til en kube har 6 kvadrater som kan brettes sammen uten at to flater havner oppå hverandre.', '正方体的展开图有 6 个正方形，折起来时不会有两个面重叠。')};
})));
const NETS = [['pyramide', 0], ['prisme', 0], ['sylinder', 0], ['trekantprisme', 0], ['kube', 0], ['kube', 3], ['kube', 5], ['kube', 8]];
const netSvgOf = (k, i) => k === 'kube' ? cubeNetSvg(G.cubeNets()[i % 11].cells, 0, false) : G.netSvg(k);
def('g_netSolid', () => NETS.map((n, idx) => choice('g_netSolid:' + idx, n[0] === 'trekantprisme' ? 3 : (idx > 4 ? 2 : 1), 3, () => {
  const k = n[0], all = ['kube', 'prisme', 'pyramide', 'sylinder', 'trekantprisme'];
  const opts = shuffle([k].concat(sample(all.filter(x => x !== k), 3)));
  return {q:Q('Hvilken figur får du hvis du bretter nettet?', '把这个展开图折起来，会得到哪个立体图形？'), say:Q('Hvilken figur får du hvis du bretter nettet?', '把这个展开图折起来，会得到哪个立体图形？'), visual:fig(netSvgOf(k, n[1]), 'lg'), layout:'grid',
    options:opts.map(o => ({html:`<div>${fig(solidSvg(o, 0), 'md')}<div class="zh gloss">${o}</div></div>`, value:o})), answer:k,
    fb:FB(`Nettet brettes til en ${k}.`, `这个展开图折起来是[${k}]（${NM[k].zh}）。`), sayAfter:k};
})));
def('g_netFaces', () => { const L = [['kube', 3, 'kvadrater', 6, '正方形'], ['pyramide', 0, 'kvadrater', 1, '正方形'], ['pyramide', 0, 'trekanter', 4, '三角形'], ['prisme', 0, 'kvadrater', 2, '正方形'], ['prisme', 0, 'rektangler', 4, '长方形'],
  ['sylinder', 0, 'sirkler', 2, '圆'], ['trekantprisme', 0, 'trekanter', 2, '三角形'], ['trekantprisme', 0, 'rektangler', 3, '长方形']];
  return L.map((l, idx) => choice('g_netF:' + idx, l[0] === 'trekantprisme' ? 3 : 2, 3, () => ({
    q:Q(`Hvor mange ${l[2]} har nettet?`, `这个展开图有几个${l[4]}？`), say:Q(`Hvor mange ${l[2]} har nettet?`, `这个展开图有几个${l[4]}？`), visual:fig(netSvgOf(l[0], l[1]), 'lg'), layout:'row',
    options:numOpts(l[3], 1), answer:String(l[3]), fb:FB(`Nettet har ${l[3]} ${l[2]}. Det er nettet til en ${l[0]}.`, `这个展开图有 ${l[3]} 个${l[4]}。它是[${l[0]}]的展开图。`), sayAfter:String(l[3])}))); });

const rngB = seeded(4242);
const mkMaps = (count, size, maxH, lo, hi) => { const out = []; let guard = 0;
  while(out.length < count && guard++ < 5000){ const m = Array.from({length:size}, () => Array.from({length:size}, () => Math.floor(rngB() * (maxH + 1)))); const t = m.flat().reduce((a, b) => a + b, 0);
    if(t >= lo && t <= hi && m.flat().filter(v => v > 0).length >= size + 1 && !out.some(o => JSON.stringify(o) === JSON.stringify(m))) out.push(m); }
  return out; };
const MAPS3 = mkMaps(30, 3, 3, 6, 19), MAPS3b = mkMaps(24, 3, 3, 8, 22), MAPS2 = mkMaps(8, 2, 2, 3, 6);
const sumMap = m => m.flat().reduce((a, b) => a + b, 0);
const mapExpl = m => m.map(r => r.join('+')).join(' + ');
def('g_blocksCount', () => MAPS3.map((m, i) => choice('g_bc:' + i, i < 12 ? 2 : 3, 3, () => { const t = sumMap(m);
  return {q:Q('Hvor mange klosser består figuren av?', '这个图形由多少个小方块组成？'), say:Q('Hvor mange klosser består figuren av?', '这个图形由多少个小方块组成？'), visual:fig(G.blocks(m, {color:pick([G.C.orange, G.C.blue, G.C.green])}), 'lg'), layout:'row',
    options:numOpts(t, 1), answer:String(t), fb:FB(`Tell kolonne for kolonne, også klossene du ikke ser: ${mapExpl(m)} = ${t}.`, `一列一列地数，看不见的方块也要数：${mapExpl(m)} = ${t}。`), sayAfter:String(t)}; })));
def('g_blocksMissing', () => MAPS3b.map((m, i) => choice('g_bm:' + i, 3, 3, () => { const t = sumMap(m), miss = 27 - t;
  return {q:Q('Hvor mange klosser mangler for at det skal bli en kube (3 × 3 × 3)?', '还差多少个小方块才能拼成一个正方体（3 × 3 × 3）？'), say:Q('Hvor mange klosser mangler for at det skal bli en kube?', '还差多少个小方块才能拼成正方体？'), visual:fig(G.blocks(m, {color:G.C.orange}), 'lg'), layout:'row',
    options:numOpts(miss, 1), answer:String(miss), fb:FB(`En kube på 3 × 3 × 3 har 27 klosser. Figuren har ${t}. 27 − ${t} = ${miss}.`, `3 × 3 × 3 的正方体有 27 个小方块。这个图形有 ${t} 个。27 − ${t} = ${miss}。`), sayAfter:String(miss)}; })));
def('g_blocksMissingType', () => MAPS3b.slice(0, 12).map((m, i) => num('g_bmT:' + i, 3, 3, () => { const t = sumMap(m), miss = 27 - t;
  return {q:Q('Hvor mange klosser mangler for at det skal bli en kube (3 × 3 × 3)?', '还差多少个小方块才能拼成正方体（3 × 3 × 3）？'), say:Q('Hvor mange klosser mangler for at det skal bli en kube?', '还差多少个小方块才能拼成正方体？'), visual:fig(G.blocks(m, {color:G.C.blue}), 'lg'),
    answer:miss, min:1, fb:FB(`27 − ${t} = ${miss}.`, `27 − ${t} = ${miss}。`), sayAfter:String(miss)}; }))
  .concat(MAPS2.map((m, i) => num('g_bm2T:' + i, 2, 3, () => { const t = sumMap(m), miss = 8 - t;
    return {q:Q('Hvor mange klosser mangler for at det skal bli en kube (2 × 2 × 2)?', '还差多少个小方块才能拼成正方体（2 × 2 × 2）？'), say:Q('Hvor mange klosser mangler for at det skal bli en kube?', '还差多少个小方块才能拼成正方体？'), visual:fig(G.blocks(m, {color:G.C.green}), 'lg'),
      answer:miss, min:1, fb:FB(`En kube på 2 × 2 × 2 har 8 klosser. 8 − ${t} = ${miss}.`, `2 × 2 × 2 的正方体有 8 个小方块。8 − ${t} = ${miss}。`), sayAfter:String(miss)}; }))));

/* ---------- modul 4: vinkler ---------- */
const AK = {rett:['rett vinkel', '直角', 'Som hjørnet på et ark. 90°.', '像纸的角。90°。'], spiss:['spiss vinkel', '锐角', 'Mindre enn en rett vinkel.', '比直角小。'], stump:['stump vinkel', '钝角', 'Større enn en rett vinkel.', '比直角大。']};
const akBtn = k => `<div><b style="color:${({rett:'#16a34a', spiss:'#ef4444', stump:'#3b82f6'})[k]}">${AK[k][0]}</b><div class="gloss zh">${AK[k][1]}</div></div>`;
def('g_angleKind', () => { const out = [], L = [[25], [35], [45], [55], [65], [75], [80], [90, 0], [90, 30], [90, 60], [100], [110], [120], [130], [140], [150], [160], [170]];
  L.forEach((l, i) => [0, 1].forEach(v => out.push(choice(`g_ak:${l[0]}:${l[1] || 0}:${v}`, l[0] === 90 || Math.abs(l[0] - 90) > 20 ? 1 : 2, 4, () => {
    const deg = l[0], kind = G.kindOfAngle(deg), base = deg === 90 ? (l[1] || 0) + v * 15 : (v ? Math.max(0, (180 - deg) * .6) : undefined);
    return {q:Q('Hva slags vinkel er dette?', '这是什么角？'), say:Q('Hva slags vinkel er dette?', '这是什么角？'), visual:fig(G.angle(deg, {base}), 'lg'), layout:'row',
      options:shuffle(['rett', 'spiss', 'stump']).map(k => ({html:akBtn(k), value:k})), answer:kind, fb:FB(`${AK[kind][0].charAt(0).toUpperCase() + AK[kind][0].slice(1)}: ${AK[kind][2]}`, `${AK[kind][1]}：${AK[kind][3]}`), sayAfter:AK[kind][0]};
  })))); return out; });
def('g_angleCompare', () => [30, 45, 60, 75, 85, 95, 105, 120, 135, 150, 160, 170].map(deg => choice('g_ac:' + deg, Math.abs(deg - 90) < 15 ? 3 : 2, 4, () => {
  const ans = deg < 90 ? 'less' : 'more';
  return {q:Q('Er vinkelen mindre eller større enn en rett vinkel? (Den stiplede linjen er en rett vinkel.)', '这个角比直角小还是大？（红色虚线是直角。）'), say:Q('Er vinkelen mindre eller større enn en rett vinkel?', '这个角比直角小还是大？'),
    visual:fig(G.angle(deg, {base:0}).replace('</svg>', `<line x1="38" y1="82" x2="38" y2="20" stroke="#ef4444" stroke-width="3" stroke-dasharray="6 5"/></svg>`), 'lg'), layout:'row',
    options:[{html:bi('mindre enn rett vinkel', '比直角小'), value:'less'}, {html:bi('større enn rett vinkel', '比直角大'), value:'more'}], answer:ans,
    fb:ans === 'less' ? FB('Vinkelen er mindre enn en rett vinkel, så den er spiss.', '这个角比直角小，所以是锐角。') : FB('Vinkelen er større enn en rett vinkel, så den er stump.', '这个角比直角大，所以是钝角。'), sayAfter:ans === 'less' ? 'spiss vinkel' : 'stump vinkel'};
})));

/* ---------- påstander, gåter, ordforråd, omkrets ---------- */
def('g_facts', () => A.GEO_FACTS.map(f => choice('g_' + f.id, f.lvl, f.mod, () => ({
  q:Q('Stemmer det?', '对吗？'), say:Q('Stemmer det?', '对吗？'), word:f.no, visual:`<div class="bigword sm">${f.no}</div><div class="gloss zh">${f.zh}</div>`, layout:'row',
  options:[{html:bi('✔ Stemmer', '✔ 对'), value:'t'}, {html:bi('✖ Stemmer ikke', '✖ 不对'), value:'f'}], answer:f.t ? 't' : 'f', fb:FB(f.eNo, f.eZh), sayAfter:f.eNo}))));
def('g_riddles', () => A.GEO_RIDDLES.map(r => choice('g_' + r.id, r.lvl, r.mod, () => {
  const names = shuffle([r.ans].concat(sample(r.set.filter(x => x !== r.ans), 3)));
  return {q:Q(r.no, r.zh), say:Q(r.no, r.zh), layout:'grid', options:names.map(n => ({html:nameBtn(n), value:n})), answer:r.ans,
    fb:FB(`Jeg er en ${r.ans}!`, `我是[${r.ans}]（${NM[r.ans].zh}）！`), sayAfter:r.ans};
})));
def('g_perimeter', () => { const L = [[4, 2], [5, 3], [6, 2], [3, 3], [7, 2], [5, 5], [8, 3], [4, 4], [6, 4], [9, 2]];
  return L.map(([a, b], i) => num('g_per:' + i, 2, 5, () => { const sq = a === b, per = 2 * (a + b);
    const svg = G.svg(`<rect x="${50 - a * 5}" y="${50 - b * 5}" width="${a * 10}" height="${b * 10}" fill="#dcfce7" stroke="#16a34a" stroke-width="3"/><text x="50" y="${50 - b * 5 - 4}" text-anchor="middle" font-size="9" font-weight="800" font-family="sans-serif">${a} m</text><text x="${50 + a * 5 + 4}" y="52" font-size="9" font-weight="800" font-family="sans-serif">${b} m</text>`, '0 0 100 100');
    return {q:Q(sq ? `Et kvadrat har kanter på ${a} m. Hvor mange meter tau trenger du rundt hele kvadratet?` : `Et rektangel er ${a} m langt og ${b} m bredt. Hvor mange meter tau trenger du rundt hele rektangelet?`,
      sq ? `一个正方形的边长是 ${a} 米。围一圈需要多少米绳子？` : `一个长方形长 ${a} 米，宽 ${b} 米。围一圈需要多少米绳子？`), say:Q('Hvor mange meter tau trenger du rundt hele figuren?', '围一圈需要多少米绳子？'), visual:fig(svg, 'md'),
      answer:per, unit:' m', near:[a + b, a * b, 2 * a + b, a + 2 * b], ph:'? m', fb:FB(`${a} + ${b} + ${a} + ${b} = ${per} m.`, `${a} + ${b} + ${a} + ${b} = ${per} 米。`), sayAfter:String(per)}; })); });

/* ordforråd: kinesisk <-> norsk og lyd -> bilde */
const allNames = A.GEO_2D.concat(A.GEO_3D);
const nameSvg = n => A.GEO_2D.includes(n) ? G.shapeSvg(n, 0) : solidSvg(n, 0);
def('g_vocab', () => { const out = [];
  allNames.forEach(n => { const m = A.GEO_2D.includes(n) ? 1 : 2;
    out.push(choice('g_zh2no:' + n, 1, m, () => ({q:Q('Hva heter dette på norsk?', '这个用挪威语怎么说？'), say:Q('Hva heter dette på norsk?', '这个用挪威语怎么说？'), visual:`<div class="bigword">${NM[n].zh}</div>${fig(nameSvg(n), 'md')}`, layout:'grid',
      options:shuffle([n].concat(sample(allNames.filter(x => x !== n), 3))).map(o => ({html:`<span>${o}</span>`, value:o})), answer:n, fb:FB(`${NM[n].zh} = ${n}`, `${NM[n].zh} = [${n}]`), sayAfter:n}), {zhOnly:true})); });
  return out; });
def('g_listen', () => allNames.map(n => choice('g_listen:' + n, 1, A.GEO_2D.includes(n) ? 1 : 2, () => ({
  q:Q('Hør og velg riktig figur.', '听一听，选出正确的图形。'), say:Q('Hør og velg riktig figur.', '听一听，选出正确的图形。'), listen:n, visual:`<div class="big-emoji">👂</div>`, layout:'grid',
  options:shuffle([n].concat(sample((A.GEO_2D.includes(n) ? A.GEO_2D : A.GEO_3D).filter(x => x !== n), 3))).map(o => ({html:fig(nameSvg(o), 'md'), value:o})), answer:n,
  fb:FB(`Det var «${n}».`, `刚才是[${n}]（${NM[n].zh}）。`), sayAfter:n}), {speech:true})));

/* begreper (som i substantiv-delen). tegning -> ord bruker bare begreper som ikke kan forveksles */
const PIC_GROUPS = [['trekant', 'firkant', 'femkant', 'sirkel', 'kvadrat', 'rektangel'], ['kube', 'prisme', 'pyramide', 'sylinder', 'kule'], ['rett', 'spiss', 'stump'], ['kant', 'hjorne', 'flate', 'nett'], ['todim', 'tredim']];
const QUAD3 = ['firkant', 'kvadrat', 'rektangel'];
function picOptions(t, grp){
  let pool = grp.filter(k => k !== t.key);
  if(QUAD3.includes(t.key)) pool = pool.filter(k => !QUAD3.includes(k));       // en firkant kan også være kvadrat/rektangel
  else pool = pool.filter(k => !QUAD3.includes(k)).concat(sample(pool.filter(k => QUAD3.includes(k)), 1));
  let ks = sample(pool, 3);
  if(grp.length < 4) ks = grp.filter(k => k !== t.key).concat(sample(['kant', 'hjorne', 'flate', 'nett'].filter(k => k !== t.key && !grp.includes(k)), 3 - (grp.length - 1)));
  return shuffle([t].concat(ks.map(A.geoTerm)));
}

def('g_meta', () => { const out = [], T = A.GEO_TERMS;
  T.forEach(t => {
    const near = () => { const rest = T.filter(x => x.key !== t.key), low = rest.filter(x => x.mod <= t.mod), high = rest.filter(x => x.mod > t.mod); return sample(low, 3).concat(sample(high, 3)).slice(0, 3); };
    out.push(typed('g_meta:copy:' + t.key, 0, t.mod, () => ({q:Q('Skriv ordet.', '把这个词写下来。'), say:Q('Skriv ordet.', '把这个词写下来。'), word:t.no, visual:`<div><div class="bigword">${t.no}</div><div class="gloss zh">${A.ruby(t.zh, t.py)}</div></div>`,
      listen:t.no, answers:[t.no.replace(/ \(.*\)/, ''), t.no], ph:'…', fb:FB(`«${t.no}» – ${t.defNo}`, `[${t.no}]（${t.zh}）：${t.defZh}`), sayAfter:t.no}), {typeOnly:true}));
    out.push(typed('g_meta:dict:' + t.key, 0, t.mod, () => ({q:Q('Hør og skriv ordet.', '听一听，把这个词写下来。'), say:Q('Hør og skriv ordet.', '听一听，把这个词写下来。'), listen:t.no.replace(/ \(.*\)/, ''), visual:`<div class="big-emoji">👂</div>`,
      answers:[t.no.replace(/ \(.*\)/, ''), t.no], ph:'?', fb:FB(`Ordet er «${t.no}» – ${t.defNo}`, `这个词是[${t.no}]（${t.zh}）：${t.defZh}`), sayAfter:t.no}), {typeOnly:true}));
    const plain = x => x.no.replace(/ \(.*\)/, '');
    const grp = PIC_GROUPS.find(g => g.includes(t.key));
    if(t.art && grp) out.push(choice('g_meta:pic:' + t.key, 0, t.mod, () => ({q:Q('Hvilket ord passer til tegningen?', '哪个词和图画相配？'), say:Q('Hvilket ord passer til tegningen?', '哪个词和图画相配？'), visual:`<div class="termart">${t.artPlain}</div>`, layout:'grid',
      options:picOptions(t, grp).map(x => ({html:`<span>${plain(x)}</span>`, value:x.key})), answer:t.key, fb:FB(`«${t.no}» – ${t.defNo}`, `[${t.no}]（${t.zh}）：${t.defZh}`), sayAfter:plain(t)})));
    out.push(choice('g_meta:listen:' + t.key, 0, t.mod, () => ({q:Q('Hør og velg riktig ord.', '听一听，选出正确的词。'), say:Q('Hør og velg riktig ord.', '听一听，选出正确的词。'), listen:plain(t), visual:`<div class="big-emoji">👂</div>`, layout:'grid',
      options:shuffle([t].concat(near())).map(x => ({html:`<span>${plain(x)}</span>`, value:x.key})), answer:t.key, fb:FB(`Ordet er «${t.no}» – ${t.defNo}`, `这个词是[${t.no}]（${t.zh}）：${t.defZh}`), sayAfter:plain(t)}), {speech:true}));
    out.push(choice('g_meta:def:' + t.key, 0, t.mod, () => ({q:Q(`Hva betyr «${t.no}»?`, `[${t.no}]是什么意思？`), say:Q(`Hva betyr ${t.no}?`, `[${t.no}]是什么意思？`), word:t.no, visual:`<div class="bigword">${t.no}</div>`, layout:'col',
      options:shuffle([t].concat(near())).map(x => ({html:bi(x.defNo, x.defZh), value:x.key})), answer:t.key, fb:FB(`«${t.no}»: ${t.defNo}`, `[${t.no}]：${t.defZh}`), sayAfter:t.no})));
    out.push(choice('g_meta:term:' + t.key, 0, t.mod, () => ({q:Q('Hvilket begrep passer til beskrivelsen?', '哪个术语符合这个说明？'), say:Q('Hvilket begrep passer til beskrivelsen?', '哪个术语符合这个说明？'), visual:`<div class="bigword sm" style="max-width:520px">${bi(t.defNo, t.defZh)}</div>`, layout:'col',
      options:shuffle([t].concat(near())).map(x => ({html:`<span>${x.no}</span>`, value:x.key})), answer:t.key, fb:FB(`Det er «${t.no}»: ${t.defNo}`, `这是[${t.no}]：${t.defZh}`), sayAfter:t.no})));
  }); return out; });

/* ---------- omfattende oppgaver: sortering ---------- */
const binHtml = (no, zh) => `<span>${bi(no, zh)}</span>`;
const tile = (svg, w) => `<span class="fig sm" style="width:${w || 60}px;height:${w ? w * .85 : 52}px">${svg}</span>`;
const pickK = (rnd, a) => a[Math.floor(rnd() * a.length)];
def('g_sortShapeNames', () => Array.from({length:6}, (_, n) => ({id:'g_sortSN:' + n, kind:'sort', lvl:n < 3 ? 1 : 2, mod:1, make:() => {
  const rnd = seeded(100 + n * 7), kinds = ['trekant', 'firkant', 'kvadrat', 'rektangel', 'femkant'];
  const ks = shuffle(kinds.slice()).concat([pickK(rnd, kinds), pickK(rnd, kinds), pickK(rnd, kinds)]);
  return {title:Q('Hva heter figurene? Sorter dem.', '这些图形叫什么？请分类。'), say:Q('Hva heter figurene? Sorter dem.', '这些图形叫什么？请分类。'),
    bins:kinds.map((k, i) => ({key:k, html:`<span><b>${k}</b><br><span class="zh">${NM[k].zh}</span></span>`, color:['#ef4444', '#3b82f6', '#f59e0b', '#16a34a', '#a855f7'][i]})),
    items:ks.map((k, i) => ({id:n + ':' + i, html:tile(G.shapeSvg(k, Math.floor(rnd() * G.shapes[k].length)), 64), bin:k, fix:`figuren = ${k}`})),
    hint:Q('Velg det mest presise navnet. Et kvadrat er kvadrat (ikke bare firkant).', '选最准确的名称。正方形就叫 kvadrat（不只是 firkant）。')};
}})));
def('g_sortCorners', () => Array.from({length:6}, (_, n) => ({id:'g_sortC:' + n, kind:'sort', lvl:1, mod:1, make:() => {
  const rnd = seeded(200 + n * 11), kinds = ['trekant', 'firkant', 'kvadrat', 'rektangel', 'femkant', 'sirkel'];
  const ks = ['trekant', 'femkant', pickK(rnd, ['kvadrat', 'rektangel', 'firkant']), 'sirkel'].concat([0, 1, 2, 3].map(() => pickK(rnd, kinds)));
  const cs = {3:['#ef4444', '3 hjørner', '3 个顶点'], 4:['#3b82f6', '4 hjørner', '4 个顶点'], 5:['#a855f7', '5 hjørner', '5 个顶点'], 0:['#0ea5e9', 'ingen hjørner', '没有顶点']};
  return {title:Q('Hvor mange hjørner har figurene? Sorter dem.', '这些图形有几个顶点？请分类。'), say:Q('Hvor mange hjørner har figurene? Sorter dem.', '这些图形有几个顶点？请分类。'),
    bins:['3', '4', '5', '0'].map(c => ({key:c, html:binHtml(cs[c][1], cs[c][2]), color:cs[c][0]})),
    items:shuffle(ks).map((k, i) => ({id:n + ':' + i, html:tile(G.shapeSvg(k, Math.floor(rnd() * G.shapes[k].length), {dots:true}), 64), bin:String(G.shapeCorners[k]), fix:`${k} = ${G.shapeCorners[k]} hjørner`}))};
}})));
def('g_sort2d3d', () => Array.from({length:8}, (_, n) => ({id:'g_sort23:' + n, kind:'sort', lvl:n < 4 ? 1 : 2, mod:2, make:() => {
  const rnd = seeded(300 + n * 13), a = sample(A.GEO_2D, 4), b = sample(A.GEO_3D.filter(x => x !== 'trekantprisme' || n > 3), 4);
  return {title:Q('Todimensjonal eller tredimensjonal? Sorter figurene.', '二维还是三维？请给图形分类。'), say:Q('Todimensjonal eller tredimensjonal? Sorter figurene.', '二维还是三维？请给图形分类。'),
    bins:[{key:'2', html:binHtml('todimensjonal (flat)', '二维（平的）'), color:'#0ea5e9'}, {key:'3', html:binHtml('tredimensjonal', '三维（立体的）'), color:'#9333ea'}],
    items:shuffle(a.map((k, i) => ({id:n + 'a' + i, html:tile(G.shapeSvg(k, Math.floor(rnd() * G.shapes[k].length), {right:false}), 60), bin:'2', fix:`${k} = todimensjonal`}))
      .concat(b.map((k, i) => ({id:n + 'b' + i, html:tile(solidSvg(k, i), 66), bin:'3', fix:`${k} = tredimensjonal`}))))};
}})));
def('g_sortAngles', () => Array.from({length:8}, (_, n) => ({id:'g_sortA:' + n, kind:'sort', lvl:n < 4 ? 1 : 2, mod:4, make:() => {
  const rnd = seeded(400 + n * 17), degs = [], pools = {rett:[90], spiss:[30, 45, 60, 70, 80, 20], stump:[100, 115, 130, 145, 160]};
  ['rett', 'spiss', 'stump'].forEach(k => { degs.push(pickK(rnd, pools[k])); degs.push(pickK(rnd, pools[k])); }); degs.push(pickK(rnd, pools.spiss), pickK(rnd, pools.stump));
  const cs = {rett:'#16a34a', spiss:'#ef4444', stump:'#3b82f6'};
  return {title:Q('Rett, spiss eller stump? Sorter vinklene.', '直角、锐角还是钝角？请给角分类。'), say:Q('Rett, spiss eller stump? Sorter vinklene.', '直角、锐角还是钝角？请给角分类。'),
    bins:['rett', 'spiss', 'stump'].map(k => ({key:k, html:binHtml(AK[k][0], AK[k][1]), color:cs[k]})),
    items:shuffle(degs).map((d, i) => ({id:n + ':' + i, html:tile(G.angle(d, {base:d === 90 ? 0 : Math.max(0, (180 - d) * .5)}), 78), bin:G.kindOfAngle(d), fix:`${AK[G.kindOfAngle(d)][0]}`}))};
}})));
def('g_sortNets', () => Array.from({length:6}, (_, n) => ({id:'g_sortN:' + n, kind:'sort', lvl:n < 3 ? 2 : 3, mod:3, make:() => {
  const rnd = seeded(500 + n * 19), ks = ['kube', 'prisme', 'pyramide', 'sylinder'], cubes = G.cubeNets();
  const items = [{k:'kube', svg:cubeNetSvg(cubes[Math.floor(rnd() * 11)].cells, 0, false)}, {k:'prisme', svg:G.netSvg('prisme')}, {k:'pyramide', svg:G.netSvg('pyramide')}, {k:'sylinder', svg:G.netSvg('sylinder')},
    {k:'kube', svg:cubeNetSvg(cubes[Math.floor(rnd() * 11)].cells, Math.floor(rnd() * 4), rnd() < .5)}, {k:pickK(rnd, ['prisme', 'pyramide', 'sylinder']), svg:null}];
  items[5].svg = G.netSvg(items[5].k);
  return {title:Q('Hvilken figur blir dette? Sorter nettene.', '这些展开图会折成什么？请分类。'), say:Q('Hvilken figur blir dette? Sorter nettene.', '这些展开图会折成什么？请分类。'),
    bins:ks.map((k, i) => ({key:k, html:`<span><b>${k}</b><br><span class="zh">${NM[k].zh}</span></span>`, color:['#f59e0b', '#3b82f6', '#ef4444', '#16a34a'][i]})),
    items:shuffle(items).map((it, i) => ({id:n + ':' + i, html:tile(it.svg, 76), bin:it.k, fix:`nettet = ${it.k}`}))};
}})));

/* ---------- omfattende oppgaver: tabell og gåter ---------- */
const N15 = Array.from({length:15}, (_, i) => String(i));
def('g_table3d', () => { const sets = [['kube', 'prisme', 'pyramide'], ['kube', 'pyramide', 'trekantprisme'], ['prisme', 'pyramide', 'trekantprisme'], ['kube', 'prisme', 'trekantprisme'], ['pyramide', 'kube', 'prisme', 'trekantprisme'], ['trekantprisme', 'prisme', 'pyramide', 'kube']];
  return sets.map((s, n) => ({id:'g_t3d:' + n, kind:'grid', lvl:s.includes('trekantprisme') ? 3 : 2, mod:2, make:() => ({
    numeric:true, title:Q('Hvor mange hjørner, kanter og flater har figurene?', '这些立体图形各有几个顶点、棱和面？'), say:Q('Hvor mange hjørner, kanter og flater har figurene?', '这些立体图形各有几个顶点、棱和面？'),
    intro:Q('Tips: tenk på en eske. Hjørne = spiss, kant = linje, flate = flat side.', '提示：想一想盒子。顶点=尖角，棱=线，面=平的一面。'),
    head:['<span class="thead">&nbsp;</span>', '<b>hjørner</b><br><span class="z zh">顶点</span>', '<b>kanter</b><br><span class="z zh">棱</span>', '<b>flater</b><br><span class="z zh">面</span>'],
    rows:s.map(k => ({lead:`<span style="display:inline-block;width:78px">${fig(solidSvg(k, 0), 'md').replace('class="fig md"', 'class="fig md" style="width:78px;height:68px"')}</span><b>${k}</b>`, speak:k,
      cells:[{answers:[String(solidDesc(k).v)], opts:N15, ph:'?'}, {answers:[String(solidDesc(k).e)], opts:N15, ph:'?'}, {answers:[String(solidDesc(k).f)], opts:N15, ph:'?'}]}))}) })); });
def('g_riddleTask', () => { const rs = A.GEO_RIDDLES; return Array.from({length:6}, (_, n) => ({id:'g_rt:' + n, kind:'grid', lvl:n < 3 ? 2 : 3, mod:2, make:() => {
  const rnd = seeded(600 + n * 23), chosen = rs.map(r => [rnd(), r]).sort((a, b) => a[0] - b[0]).slice(0, 5).map(x => x[1]);
  return {title:Q('Gåter: Hvilken figur er jeg? Velg navnet.', '谜语：我是什么图形？选出名称。'), say:Q('Gåter: Hvilken figur er jeg? Velg navnet.', '谜语：我是什么图形？选出名称。'),
    intro:Q('Tips: tenk på flater, hjørner og kanter. Velg navnet i listen.', '提示：想一想面、顶点和棱。在列表里选出名称。'),
    head:null, rows:chosen.map(r => ({lead:`<span style="white-space:normal;display:block;min-width:200px">${bi(r.no.replace(' Hvilken figur er jeg?', ''), r.zh.replace(/我是什么.*$/, ''))}</span>`, cells:[{answers:[r.ans].concat(r.alts || []), opts:r.set, choiceOnly:true, ph:'…'}]}))};
}})); });

/* ---------- tegning på prikkpapir ---------- */
const allTypes = (an, t) => an.angles.every(a => a === t);
const rectLike = an => an.n === 4 && an.angles.every(a => a === 'rett');
const DR = [
  {id:'tri', pool:'g_drawShapes', lvl:1, mod:1, no:'Tegn en trekant.', zh:'画一个三角形。', check:an => an.n === 3},
  {id:'quad', pool:'g_drawShapes', lvl:1, mod:1, no:'Tegn en firkant.', zh:'画一个四边形。', check:an => an.n === 4},
  {id:'five', pool:'g_drawShapes', lvl:1, mod:1, no:'Tegn en femkant.', zh:'画一个五边形。', check:an => an.n === 5},
  {id:'quadnr', pool:'g_drawShapes', lvl:2, mod:1, no:'Tegn en firkant som ikke er et rektangel.', zh:'画一个不是长方形的四边形。', check:an => an.n === 4 && !an.angles.every(a => a === 'rett')},
  {id:'rect', pool:'g_drawQuads', lvl:1, mod:1, no:'Tegn et rektangel.', zh:'画一个长方形。', check:an => rectLike(an)},
  {id:'rect2', pool:'g_drawQuads', lvl:2, mod:1, no:'Tegn et rektangel som ikke er et kvadrat.', zh:'画一个不是正方形的长方形。', check:an => rectLike(an) && an.sides[0] !== an.sides[1]},
  {id:'square', pool:'g_drawQuads', lvl:1, mod:1, no:'Tegn et kvadrat.', zh:'画一个正方形。', check:an => rectLike(an) && an.sides.every(s => s === an.sides[0])},
  {id:'square2', pool:'g_drawQuads', lvl:2, mod:1, no:'Tegn et større kvadrat enn 2 × 2 ruter.', zh:'画一个比 2 × 2 格更大的正方形。', check:an => rectLike(an) && an.sides.every(s => s === an.sides[0]) && an.sides[0] >= 9},
  {id:'trir', pool:'g_drawAngles', lvl:1, mod:4, no:'Tegn en trekant med en rett vinkel.', zh:'画一个有直角的三角形。', check:an => an.n === 3 && an.angles.includes('rett')},
  {id:'tris', pool:'g_drawAngles', lvl:2, mod:4, no:'Tegn en trekant med en stump vinkel.', zh:'画一个有钝角的三角形。', check:an => an.n === 3 && an.angles.includes('stump')},
  {id:'trisp', pool:'g_drawAngles', lvl:2, mod:4, no:'Tegn en trekant der alle vinklene er spisse.', zh:'画一个三个角都是锐角的三角形。', check:an => an.n === 3 && allTypes(an, 'spiss')},
  {id:'stump', pool:'g_drawAngles', lvl:2, mod:4, no:'Tegn en figur med minst én stump vinkel.', zh:'画一个至少有一个钝角的图形。', check:an => an.angles.includes('stump')},
  {id:'spiss', pool:'g_drawAngles', lvl:2, mod:4, no:'Tegn en figur med minst én spiss vinkel.', zh:'画一个至少有一个锐角的图形。', check:an => an.angles.includes('spiss')},
  {id:'only', pool:'g_drawAngles', lvl:3, mod:4, no:'Tegn en figur som bare har rette vinkler (minst 4 hjørner).', zh:'画一个所有角都是直角的图形（至少 4 个顶点）。', check:an => an.n >= 4 && an.rightLike.every(Boolean)},
  {id:'all3', pool:'g_drawChallenge', lvl:3, mod:5, no:'Tegn en todimensjonal figur med minst 1 rett, 1 spiss og 1 stump vinkel.', zh:'画一个二维图形，至少有 1 个直角、1 个锐角和 1 个钝角。', check:an => an.angles.includes('rett') && an.angles.includes('spiss') && an.angles.includes('stump')},
  {id:'eight', pool:'g_drawChallenge', lvl:3, mod:5, no:'Tegn en todimensjonal figur som har minst 8 hjørner.', zh:'画一个至少有 8 个顶点的二维图形。', check:an => an.n >= 8}
];
A.GEO_DRAW = DR;
['g_drawShapes', 'g_drawQuads', 'g_drawAngles', 'g_drawChallenge'].forEach(pool => def(pool, () => DR.filter(d => d.pool === pool).map(d => ({id:'g_draw:' + d.id, kind:'draw', lvl:d.lvl, mod:d.mod, make:() => ({
  title:Q(d.no, d.zh), say:Q(d.no, d.zh), cols:8, rows:6, check:d.check,
  fbFail:FB('Det ble ikke riktig denne gangen. Les oppgaven en gang til og prøv å tenke på hjørner og vinkler.', '这次不太对。再读一遍题目，想一想顶点和角。')})}))));

/* ---------- trykk på vinkler ---------- */
const convex = pts => { let s = 0; const n = pts.length; for(let i = 0; i < n; i++){ const a = pts[i], b = pts[(i + 1) % n], c = pts[(i + 2) % n]; const cr = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]); if(cr !== 0){ if(s && Math.sign(cr) !== s) return false; s = Math.sign(cr); } } return true; };
const LIB = []; Object.keys(G.shapes).forEach(k => { if(k === 'sirkel') return; G.shapes[k].forEach(v => { if(v.pts && convex(v.pts)) LIB.push({k, pts:v.pts}); }); });
def('g_angleTap', () => { const out = []; ['rett', 'spiss', 'stump'].forEach((t, ti) => [0, 1, 2, 3].forEach(n => out.push({id:`g_atap:${t}:${n}`, kind:'angles', lvl:n < 2 ? 1 : 2, mod:4, make:() => {
  const rnd = seeded(700 + ti * 50 + n * 9); let polys, count;
  for(let tries = 0; tries < 200; tries++){ const chosen = LIB.map(l => [rnd(), l]).sort((a, b) => a[0] - b[0]).slice(0, 5).map(x => G.fit(G.rot(x[1].pts, Math.floor(rnd() * 8) * 15), 78));
    count = chosen.reduce((s, p) => s + p.filter((_, i) => G.kindOfAngle(G.angleDeg(p, i)) === t).length, 0); polys = chosen; if(count >= 2 && count <= 9) break; }
  const nm = {rett:['rette', '直'], spiss:['spisse', '锐'], stump:['stumpe', '钝']}[t];
  return {title:Q(`Trykk på alle de ${nm[0]} vinklene.`, `点出所有的${nm[1]}角。`), say:Q(`Trykk på alle de ${nm[0]} vinklene.`, `点出所有的${nm[1]}角。`), target:t, polys, count,
    hint:Q(`${AK[t][0].charAt(0).toUpperCase() + AK[t][0].slice(1)}: ${AK[t][2]}`, `${AK[t][1]}：${AK[t][3]}`)};
}}))); return out; });

/* ---------- tau-oppgaven: flervalg, eller fri skriving (tall) ---------- */
const ROPES = [[8, 2], [10, 3], [12, 4], [14, 5]];
const ropeOk = (v, side, tot) => { const all = v.concat([side]), mx = Math.max(...all); return v.reduce((a, b) => a + b, 0) + side === tot && v.every(x => x >= 1) && mx < tot - mx; };
const ropeMC = ROPES.map(([tot, side], n) => choice('g_ropeMC:' + n, 3, 5, () => {
  const rest = tot - side, good = [], badSum = [], badLong = [];
  for(let a = 1; a <= rest; a++) for(let b = a; b <= rest; b++){
    const c = rest - a - b; if(c >= b){ (ropeOk([a, b, c], side, tot) ? good : badLong).push([a, b, c]); }
    for(const d of [-2, -1, 1, 2]){ const c2 = rest - a - b + d; if(c2 >= b && c2 >= 1) badSum.push([a, b, c2]); } }
  const pickN = (arr, k) => sample(arr, k), g = pick(good);
  let wrong = pickN(badSum, 2).concat(pickN(badLong, 1)); if(wrong.length < 3) wrong = wrong.concat(pickN(badSum, 3 - wrong.length));
  const key = t => t.join(',');
  const seen = new Set([key(g)]); wrong = wrong.filter(t => { if(seen.has(key(t))) return false; seen.add(key(t)); return true; });
  while(wrong.length < 3) { const t = [1 + Math.floor(Math.random() * 3), 1 + Math.floor(Math.random() * 4), 1 + Math.floor(Math.random() * 5)].sort(); if(!seen.has(key(t)) && !ropeOk(t, side, tot)){ seen.add(key(t)); wrong.push(t); } }
  const fmtT = t => `${t[0]} m, ${t[1]} m og ${t[2]} m`;
  return {q:Q(`Mira, Mattis, Jon og Olga lager en firkant av et ${tot} m langt tau. Den ene siden er ${side} m. Hvilke lengder kan de tre andre sidene ha?`, `米拉、马蒂斯、约恩和奥尔加用一根 ${tot} 米长的绳子围成一个四边形。其中一条边是 ${side} 米。其余三条边可以是哪一组长度？`),
    say:Q(`Et tau er ${tot} meter. Du lager en firkant. Den ene siden er ${side} meter. Hvilke lengder kan de tre andre sidene ha?`, `绳子长 ${tot} 米。围成四边形，其中一条边是 ${side} 米。其余三条边可以是哪一组？`),
    layout:'col', options:shuffle([g].concat(wrong)).map(t => ({html:`<span style="font-size:1.4rem">${fmtT(t)}</span>`, value:key(t)})), answer:key(g),
    fb:FB(`Alle fire sidene skal til sammen bli ${tot} m: ${side} + ${g.join(' + ')} = ${tot}. Og ingen side kan være lengre enn summen av de andre.`, `四条边加起来要等于 ${tot} 米：${side} + ${g.join(' + ')} = ${tot}。而且最长的边不能比其余几条边加起来更长。`)};
}, {choiceOnly:true}));
def('g_rope', () => ropeMC.concat(ROPES.map(([tot, side], n) => ({id:'g_rope:' + n, kind:'free', typeOnly:true, lvl:3, mod:5, make:() => ({
  title:Q(`Mira, Mattis, Jon og Olga lager en firkant av et ${tot} m langt tau. Den ene siden er ${side} m. Hvor lange kan de andre sidene være? Finn to løsninger.`,
    `米拉、马蒂斯、约恩和奥尔加用一根 ${tot} 米长的绳子围成一个四边形。其中一条边是 ${side} 米。其余三条边可以有多长？找出两种答案。`),
  say:Q(`Et tau er ${tot} meter. Du lager en firkant. Den ene siden er ${side} meter. Hvor lange kan de andre sidene være?`, `绳子长 ${tot} 米。围成四边形，其中一条边是 ${side} 米。其余三条边可以多长？`),
  intro:Q(`Skriv lengdene på de tre andre sidene (hele meter). Til sammen skal alle fire sidene bli ${tot} m.`, `写出另外三条边的长度（整数米）。四条边加起来要等于 ${tot} 米。`),
  rows:2, fields:3, ph:'m',
  validate:vals => { const v = vals.map(Number); if(v.some(x => !Number.isInteger(x) || x < 1)) return {ok:false, no:'Skriv hele tall som er minst 1.', zh:'请写大于等于 1 的整数。'};
    const sum = v.reduce((a, b) => a + b, 0) + side; if(sum !== tot) return {ok:false, no:`Sidene blir til sammen ${sum} m. Det skal være ${tot} m.`, zh:`四条边加起来是 ${sum} 米，应该是 ${tot} 米。`};
    const all = v.concat([side]), mx = Math.max(...all); if(mx >= tot - mx) return {ok:false, no:'Den lengste siden er for lang. Da lukker ikke firkanten seg.', zh:'最长的边太长了，四边形围不起来。'};
    return {ok:true, key:v.slice().sort().join(',')}; },
  fbWin:FB('Flott! Det finnes mange løsninger.', '太棒了！答案不止一种。')})}))));

/* ---------- renderers ---------- */
const head = spec => `<div class="qtext"><span class="grow">${bi(spec.title.no, spec.title.zh)}</span><button class="spk say" type="button" title="Les opp">🔊</button></div>`;
const bar = (extra) => `<div class="typebox">${extra || ''}<button class="btn check" type="button"><span class="bi"><span class="no">Sjekk ✔</span><span class="zh">检查</span></span></button></div>`;

Ex.renderers.draw = function(spec, host, ctx){
  const S = 40, M = 26, cols = spec.cols, rows = spec.rows, W = M * 2 + (cols - 1) * S, H = M * 2 + (rows - 1) * S;
  host.innerHTML = `<div class="qcard">${head(spec)}<div class="small-note">${bi('Trykk på prikkene for å tegne. Trykk på det første punktet igjen for å lukke figuren.', '点击圆点来画图。再点一次第一个点，把图形封起来。')}</div>
    <div class="visual"><svg class="drawsvg" viewBox="0 0 ${W} ${H}"></svg></div><div class="hint"></div>
    <div class="typebox"><button class="btn sec undo" type="button"><span class="bi"><span class="no">↶ Angre</span><span class="zh">撤销</span></span></button><button class="btn sec reset" type="button"><span class="bi"><span class="no">🗑 Start på nytt</span><span class="zh">重画</span></span></button>
    <button class="btn check" type="button"><span class="bi"><span class="no">Sjekk ✔</span><span class="zh">检查</span></span></button></div></div>`;
  host.querySelector('.say').onclick = () => Ex.speakSpec(spec);
  const svg = host.querySelector('svg'), hint = host.querySelector('.hint'); let pts = [], closed = false, attempt = 0, done = false;
  const xy = p => [M + p[0] * S, M + p[1] * S];
  function draw(){
    let s = '';
    if(pts.length){ const px = pts.map(xy).map(p => p.join(',')).join(' ');
      s += closed ? `<polygon points="${px}" fill="#fed7aa" stroke="#ea580c" stroke-width="5" stroke-linejoin="round"/>` : `<polyline points="${px}" fill="none" stroke="#ea580c" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>`; }
    for(let j = 0; j < rows; j++) for(let i = 0; i < cols; i++){ const [x, y] = xy([i, j]), idx = pts.findIndex(p => p[0] === i && p[1] === j), on = idx >= 0;
      s += `<circle cx="${x}" cy="${y}" r="${on ? 8 : 4.5}" fill="${on ? (idx === 0 ? '#16a34a' : '#ea580c') : '#94a3b8'}"/>`; }
    svg.innerHTML = s; }
  svg.addEventListener('click', ev => { if(done || closed) return;
    const m = svg.getScreenCTM().inverse(), pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY; const q = pt.matrixTransform(m);
    const i = Math.round((q.x - M) / S), j = Math.round((q.y - M) / S); if(i < 0 || j < 0 || i >= cols || j >= rows) return;
    const [x, y] = xy([i, j]); if(Math.hypot(q.x - x, q.y - y) > S * .48) return;
    if(pts.length >= 3 && i === pts[0][0] && j === pts[0][1]){ closed = true; hint.textContent = ''; }
    else if(!pts.some(p => p[0] === i && p[1] === j)) pts.push([i, j]);
    draw(); });
  host.querySelector('.undo').onclick = () => { if(done) return; if(closed) closed = false; else pts.pop(); draw(); };
  host.querySelector('.reset').onclick = () => { if(done) return; pts = []; closed = false; hint.textContent = ''; draw(); };
  host.querySelector('.check').onclick = () => { if(done) return;
    if(!closed){ hint.innerHTML = '☝️ ' + bi('Klikk på det første (grønne) punktet for å lukke figuren.', '点一下第一个（绿色）点，把图形封起来。'); return; }
    attempt++; const an = G.analyze(pts);
    if(!an.ok || !an.simple){ hint.innerHTML = '🔴 ' + bi('Linjene krysser hverandre. Prøv en ny figur.', '线条交叉了。换一个图形再试。'); if(attempt >= 2) fin(false); return; }
    const ok = spec.check(an);
    if(ok) return fin(true);
    if(attempt >= 2) return fin(false);
    hint.innerHTML = '🔴 ' + bi('Ikke helt. Se på oppgaven og prøv en gang til.', '不太对。再看看题目，再试一次。'); };
  function fin(ok){ done = true; host.querySelectorAll('button.check,.undo,.reset').forEach(b => b.disabled = true);
    ctx.result({score:ok ? (attempt === 1 ? 1 : .5) : 0, ok:ok && attempt === 1, fb:ok ? FB('Riktig tegnet!', '画对了！') : spec.fbFail}); }
  draw(); if(A.settings.auto) Ex.speakSpec(spec);
};

Ex.renderers.angles = function(spec, host, ctx){
  const cw = 130, per = 3, n = spec.polys.length, rows = Math.ceil(n / per);
  host.innerHTML = `<div class="qcard">${head(spec)}<div class="small-note">${bi(`Det er ${spec.count} slike vinkler. ${spec.hint.no}`, `一共有 ${spec.count} 个这样的角。${spec.hint.zh}`)}</div>
    <div class="visual"><svg class="drawsvg" viewBox="0 0 ${per * cw} ${rows * cw}"></svg></div><div class="hint"></div>${bar()}</div>`;
  host.querySelector('.say').onclick = () => Ex.speakSpec(spec);
  const svg = host.querySelector('svg'), sel = new Set(); let done = false;
  const verts = []; let s = '';
  spec.polys.forEach((p, pi) => { const ox = (pi % per) * cw + 15, oy = Math.floor(pi / per) * cw + 15, pts = p.map(q => [q[0] + ox - 4, q[1] + oy - 4]);
    s += `<polygon points="${pts.map(q => q.map(v => +v.toFixed(1)).join(',')).join(' ')}" fill="#e0f2fe" stroke="#334155" stroke-width="3.5" stroke-linejoin="round"/>`;
    p.forEach((q, i) => verts.push({k:pi + ':' + i, x:pts[i][0], y:pts[i][1], kind:G.kindOfAngle(G.angleDeg(p, i))})); });
  svg.innerHTML = s + verts.map(v => `<circle class="vx" data-k="${v.k}" cx="${v.x.toFixed(1)}" cy="${v.y.toFixed(1)}" r="11" fill="#fff" fill-opacity=".7" stroke="#94a3b8" stroke-width="3"/>`).join('');
  svg.querySelectorAll('.vx').forEach(c => c.addEventListener('click', () => { if(done) return; const k = c.dataset.k; if(sel.has(k)){ sel.delete(k); c.setAttribute('fill', '#fff'); c.setAttribute('stroke', '#94a3b8'); } else { sel.add(k); c.setAttribute('fill', '#fde68a'); c.setAttribute('stroke', '#ea580c'); } }));
  host.querySelector('.check').onclick = () => { if(done) return; done = true; host.querySelector('.check').disabled = true; let hit = 0, wrong = 0;
    verts.forEach(v => { const c = svg.querySelector(`[data-k="${v.k}"]`), want = v.kind === spec.target, got = sel.has(v.k);
      if(want && got){ hit++; c.setAttribute('fill', '#86efac'); c.setAttribute('stroke', '#16a34a'); }
      else if(want){ c.setAttribute('fill', '#fff'); c.setAttribute('stroke', '#f59e0b'); c.setAttribute('stroke-dasharray', '4 3'); c.setAttribute('r', '13'); }
      else if(got){ wrong++; c.setAttribute('fill', '#fca5a5'); c.setAttribute('stroke', '#dc2626'); } });
    const sc = Math.max(0, (hit - wrong) / spec.count);
    ctx.result({score:sc, ok:sc >= .8, fb:null, extra:`${hit}/${spec.count}`}); };
  if(A.settings.auto) Ex.speakSpec(spec);
};

Ex.renderers.free = function(spec, host, ctx){
  let rowsHtml = '';
  for(let r = 0; r < spec.rows; r++){ rowsHtml += `<div class="typebox" data-r="${r}"><b>${r + 1}.</b> `; for(let f = 0; f < spec.fields; f++) rowsHtml += `<input class="ans" style="width:84px;font-size:1.3rem" inputmode="numeric" autocomplete="off" placeholder="${spec.ph}" data-r="${r}" data-f="${f}">`; rowsHtml += `<span class="rm" style="font-size:1.6rem"></span></div><div class="hint rmsg" data-r="${r}"></div>`; }
  host.innerHTML = `<div class="qcard">${head(spec)}<div class="small-note">${bi(spec.intro.no, spec.intro.zh)}</div><div style="margin-top:8px">${rowsHtml}</div><div class="hint gmsg"></div>${bar()}</div>`;
  host.querySelector('.say').onclick = () => Ex.speakSpec(spec);
  let attempt = 0, done = false; const okRows = new Set(), keys = new Set();
  host.querySelector('.check').onclick = () => { if(done) return; attempt++; let good = 0;
    for(let r = 0; r < spec.rows; r++){ const row = host.querySelector(`.typebox[data-r="${r}"]`), msg = host.querySelector(`.rmsg[data-r="${r}"]`), ins = [...row.querySelectorAll('input')];
      if(okRows.has(r)){ good++; continue; }
      const res = spec.validate(ins.map(i => i.value.trim() || '0'));
      if(res.ok && keys.has(res.key)){ row.querySelector('.rm').textContent = '🔁'; msg.innerHTML = bi('Samme løsning som før. Finn en ny!', '和前面的答案一样。找一个新的！'); continue; }
      if(res.ok){ okRows.add(r); keys.add(res.key); good++; row.querySelector('.rm').textContent = '✅'; msg.textContent = ''; ins.forEach(i => { i.readOnly = true; i.classList.add('ok'); }); }
      else { row.querySelector('.rm').textContent = '❌'; msg.innerHTML = bi(res.no, res.zh); ins.forEach(i => i.classList.add('bad')); } }
    host.querySelectorAll('input').forEach(i => i.addEventListener('input', () => i.classList.remove('bad')));
    if(good === spec.rows || attempt >= 2){ done = true; host.querySelector('.check').disabled = true; const sc = good / spec.rows;
      ctx.result({score:attempt === 1 ? sc : sc * .75, ok:good === spec.rows && attempt === 1, fb:good === spec.rows ? spec.fbWin : FB('Prøv å finne flere løsninger neste gang. Summen av sidene må bli riktig.', '下次再多找几种答案。四条边的和必须正确。')}); } };
  if(A.settings.auto) Ex.speakSpec(spec);
};
})();
