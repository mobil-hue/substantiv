(function(){
'use strict';
const A = window.App, G = A.Geo;

/* byggeklosser */
const fg = (svg, cls) => `<div class="fig ${cls || 'md'}">${svg}</div>`;
const card = (inner, label, zh, color, d) => `<div class="vcard pop" style="--c:${color};--d:${d}s">${inner}<div class="l">${label}</div>${zh ? `<div class="z">${zh}</div>` : ''}</div>`;
const title = (emoji, no, zh, extra) => `<div class="scene"><div class="big-emoji bounce">${emoji}</div><h2 class="up">${A.bi(no, zh)}</h2>${extra || ''}</div>`;
const bubble = (h, d) => `<div class="pop sub" style="--d:${d || 0}s">${h}</div>`;
const shape = (k, i, o) => G.shapeSvg(k, i || 0, o);
const solid = (k, vi) => { const col = [G.C.orange, G.C.blue, G.C.green, G.C.purple, G.C.red][(vi || 0) % 5];
  if(k === 'kube') return G.box(60, 60, 60, G.C.orange).svg; if(k === 'prisme') return G.box(60, 60, 100, G.C.blue).svg; if(k === 'pyramide') return G.pyramid(70, 70, 70, G.C.orange).svg;
  if(k === 'sylinder') return G.cylinder(28, 64, G.C.green).svg; if(k === 'kule') return G.sphere(38, G.C.red).svg; return G.triPrism(70, 60, 90, col).svg; };
const col = k => G.SHAPE_COLOR[k] || '#64748b';
const netCells = (cells) => G.cells(cells, {color:G.C.orange});

// polygon med nummererte hjørner som dukker opp ett etter ett
const numbered = (pts, color, d0) => G.svg(G.poly(pts, color, {right:false}) + pts.map((p, i) =>
  `<g class="pop" style="--d:${(d0 || 0) + i * .9}s"><circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="9" fill="#fff" stroke="${color}" stroke-width="3"/><text x="${p[0].toFixed(1)}" y="${(p[1] + 4).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="900" font-family="sans-serif" fill="#334155">${i + 1}</text></g>`).join(''));
// små streker på kantene som viser like lange kanter
const tickSvg = (pts, counts, color) => { let t = '';
  pts.forEach((p, i) => { const q = pts[(i + 1) % pts.length], n = counts[i]; if(!n) return; const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L, ux = dx / L, uy = dy / L;
    for(let k = 0; k < n; k++){ const off = (k - (n - 1) / 2) * 6; t += `<line x1="${(mx + ux * off + nx * 6).toFixed(1)}" y1="${(my + uy * off + ny * 6).toFixed(1)}" x2="${(mx + ux * off - nx * 6).toFixed(1)}" y2="${(my + uy * off - ny * 6).toFixed(1)}" stroke="#dc2626" stroke-width="3.5" stroke-linecap="round"/>`; } });
  return G.svg(G.poly(pts, color, {right:true}) + t); };
const countChip = (n, color) => `<span class="chip" style="--c:${color};font-size:1.5rem">${n}</span>`;

const RECT = [[10, 28], [90, 28], [90, 72], [10, 72]], SQ = [[22, 22], [78, 22], [78, 78], [22, 78]];
const wide = svg => `<div style="width:min(100%,230px)">${svg}</div>`;

Object.assign(A.VIDEOS, {

geo_intro: {
  no:'Figurer rundt oss', zh:'我们身边的图形', emoji:'🌍',
  scenes:[
   {html:title('📐', 'Geometri – figurer rundt oss', '几何——我们身边的图形'),
    no:'Hei! I dag skal vi lære om figurer. Figurer finnes overalt rundt oss.', zh:'你好！今天我们来学习图形。图形在我们身边到处都有。'},
   {html:`<div class="scene"><div class="row">${[['🪟', 'vindu', 'rektangel', '#16a34a'], ['⚽', 'ball', 'kule', '#ef4444'], ['📦', 'eske', 'prisme', '#3b82f6'], ['🥫', 'boks', 'sylinder', '#22c55e'], ['⚠️', 'skilt', 'trekant', '#ef4444']]
      .map((o, i) => card(`<div class="e">${o[0]}</div>`, `${o[1]} → ${o[2]}`, A.GEO_NAMES[o[2]].zh, o[3], .3 + i * .9)).join('')}</div></div>`,
    no:'Et vindu har form som et rektangel. En ball er en kule. En eske er et prisme. En boks er en sylinder. Og et skilt kan være en trekant.', zh:'窗户的形状是[rektangel]，长方形。球是[kule]，球体。盒子是[prisme]，棱柱。罐头是[sylinder]，圆柱。标志牌可以是[trekant]，三角形。'},
   {html:`<div class="scene"><div class="row">${card(fg(shape('trekant', 0), 'sm') + fg(shape('firkant', 0), 'sm') + fg(shape('sirkel', 0), 'sm'), 'todimensjonal = flat', '二维 = 平的', '#0ea5e9', .2)}${card(fg(solid('kube'), 'sm') + fg(solid('kule'), 'sm') + fg(solid('pyramide'), 'sm'), 'tredimensjonal = romfigur', '三维 = 立体的', '#9333ea', 1.6)}</div></div>`,
    no:'Noen figurer er flate. De er todimensjonale. Du kan tegne dem på papir. Andre figurer kan du holde i hånden. De er tredimensjonale.', zh:'有些图形是平的，叫[todimensjonal]，二维，可以画在纸上。有些图形可以拿在手里，叫[tredimensjonal]，三维。'},
   {html:`<div class="scene"><div class="row">${card(fg(G.cubeMark('hjorne')), 'hjørne', '顶点', '#ef4444', .2)}${card(fg(G.cubeMark('kant')), 'kant', '棱', '#ef4444', 1.6)}${card(fg(G.cubeMark('flate')), 'flate', '面', '#ef4444', 3)}</div></div>`,
    no:'Disse tre ordene er viktige. Et hjørne er der kantene møtes. En kant er der to flater møtes. En flate er den flate siden.', zh:'这三个词很重要。[hjørne]是几条棱相交的地方，顶点。[kant]是两个面相交的地方，棱。[flate]是平的那一面，面。'},
   {html:`<div class="scene"><div class="row">${[['▲', 'flate figurer', '平面图形'], ['🧊', 'romfigurer', '立体图形'], ['📦', 'nett og klosser', '展开图和小方块'], ['∠', 'vinkler', '角'], ['🧩', 'gåter', '谜题']]
      .map((o, i) => card(`<div class="e">${o[0]}</div>`, `${i + 1}. ${o[1]}`, o[2], '#f97316', .2 + i * .7)).join('')}</div></div>`,
    no:'Vi skal lære om flate figurer, romfigurer, nett og klosser, vinkler og gåter. Og vi skal tegne mye!', zh:'我们要学习平面图形、立体图形、展开图和小方块、角，还有谜题。我们还要多多画图！'},
   {html:title('🚀', 'Er du klar?', '准备好了吗？'), no:'Er du klar? Da starter vi!', zh:'准备好了吗？那我们开始吧！'}
  ]},

geo_2d: {
  no:'Todimensjonale figurer', zh:'平面图形', emoji:'🔺',
  scenes:[
   {html:`<div class="scene"><div class="big-emoji bounce">📄</div><h2 class="up">${A.bi('todimensjonal = flat', '二维 = 平的')}</h2><div class="row fade" style="--d:.8s">${['trekant', 'firkant', 'femkant', 'sirkel'].map(k => fg(shape(k, 0), 'sm')).join('')}</div></div>`,
    no:'En todimensjonal figur er flat. Den har lengde og bredde, men ikke høyde. Du kan tegne den på papir.', zh:'[todimensjonal]的图形是平的。有长度和宽度，没有高度。可以画在纸上。'},
   {html:`<div class="scene"><div class="fig lg pop">${G.svg(G.poly(SQ, G.C.blue, {right:true}) + SQ.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="7" fill="#ef4444" stroke="#fff" stroke-width="2.5"/>`).join('') + `<line x1="${SQ[0][0]}" y1="${SQ[0][1]}" x2="${SQ[1][0]}" y2="${SQ[1][1]}" stroke="#ef4444" stroke-width="7" stroke-linecap="round"/>`)}</div>
      <div class="row fade" style="--d:1.2s"><span class="chip" style="--c:#ef4444;font-size:1.3rem">hjørne · 顶点</span><span class="chip" style="--c:#ef4444;font-size:1.3rem">kant · 边</span></div></div>`,
    no:'Et hjørne er der to kanter møtes. En kant er linjen mellom to hjørner.', zh:'[hjørne]是两条边相交的地方，顶点。[kant]是两个顶点之间的线，边。'},
   {html:`<div class="scene"><div class="fig lg">${numbered(V0('trekant'), G.C.red, .3)}</div><div class="fade" style="--d:3.2s">${countChip('3 hjørner · 3 kanter', G.C.red)}</div></div>`,
    no:'Trekanten har tre hjørner og tre kanter. Ett, to, tre.', zh:'[trekant]有 3 个顶点和 3 条边。一，二，三。'},
   {html:`<div class="scene"><div class="fig lg">${numbered(V0('firkant'), G.C.blue, .3)}</div><div class="fade" style="--d:4s">${countChip('4 hjørner · 4 kanter', G.C.blue)}</div></div>`,
    no:'Firkanten har fire hjørner og fire kanter. Ett, to, tre, fire.', zh:'[firkant]有 4 个顶点和 4 条边。一，二，三，四。'},
   {html:`<div class="scene"><div class="fig lg">${numbered(V0('femkant'), G.C.purple, .3)}</div><div class="fade" style="--d:4.8s">${countChip('5 hjørner · 5 kanter', G.C.purple)}</div></div>`,
    no:'Femkanten har fem hjørner og fem kanter. Ett, to, tre, fire, fem.', zh:'[femkant]有 5 个顶点和 5 条边。一，二，三，四，五。'},
   {html:`<div class="scene"><div class="fig lg pop">${shape('sirkel', 0)}</div><div class="fade" style="--d:1s">${countChip('ingen hjørner · 没有顶点', G.C.sky)}</div></div>`,
    no:'Sirkelen er helt rund. Den har ingen hjørner.', zh:'[sirkel]是圆圆的，没有顶点。'},
   {html:`<div class="scene"><div class="row">${[['trekant', 3], ['firkant', 4], ['femkant', 5], ['sirkel', 0]].map((o, i) => card(fg(shape(o[0], 0), 'sm'), o[0], `${o[1]} hjørner`, col(o[0]), .2 + i * .8)).join('')}</div></div>`,
    no:'Oppsummering. Trekant: tre hjørner. Firkant: fire. Femkant: fem. Sirkel: ingen.', zh:'总结。[trekant]：3 个顶点。[firkant]：4 个。[femkant]：5 个。[sirkel]：没有。'}
  ]},

geo_firkant: {
  no:'Firkanter: kvadrat og rektangel', zh:'四边形：正方形和长方形', emoji:'🟦',
  scenes:[
   {html:`<div class="scene"><div class="row">${[0, 1, 2, 4].map((i, k) => card(fg(shape('firkant', i), 'sm'), 'firkant', '', G.C.blue, .2 + k * .7)).join('')}</div>${bubble(A.bi('4 hjørner · 4 kanter', '4 个顶点 · 4 条边'), 3)}</div>`,
    no:'En firkant har fire hjørner og fire kanter. Det finnes mange slags firkanter.', zh:'[firkant]有 4 个顶点和 4 条边。四边形有很多种。'},
   {html:`<div class="scene"><div class="fig lg pop">${tickSvg(RECT, [1, 2, 1, 2], G.C.green)}</div><div class="fade" style="--d:1.4s">${A.bi('rektangel: 4 rette hjørner, kantene er like lange to og to', '长方形：4 个直角，对边一样长')}</div></div>`,
    no:'Et rektangel er en firkant med fire rette hjørner. Kantene er like lange to og to.', zh:'[rektangel]是有 4 个直角的四边形。对边一样长。'},
   {html:`<div class="scene"><div class="fig lg pop">${tickSvg(SQ, [1, 1, 1, 1], G.C.orange)}</div><div class="fade" style="--d:1.4s">${A.bi('kvadrat: 4 rette hjørner og 4 like lange kanter', '正方形：4 个直角，4 条边一样长')}</div></div>`,
    no:'Et kvadrat er en firkant med fire rette hjørner. Alle de fire kantene er like lange.', zh:'[kvadrat]是有 4 个直角的四边形。4 条边都一样长。'},
   {html:`<div class="scene"><div class="row">${card(`<div class="fig md">${tickSvg(SQ, [1, 1, 1, 1], G.C.orange)}</div>`, 'kvadrat', '4 like kanter', G.C.orange, .2)}${card(`<div class="fig md">${tickSvg(RECT, [1, 2, 1, 2], G.C.green)}</div>`, 'rektangel', 'like to og to', G.C.green, 1)}</div>
      <div class="pop" style="--d:2.2s"><span class="chip" style="--c:#16a34a;font-size:1.2rem">likt: 4 rette hjørner ✔</span> <span class="chip" style="--c:#dc2626;font-size:1.2rem">forskjellig: kantene</span></div></div>`,
    no:'Hva er likt? Begge har fire rette hjørner. Hva er forskjellig? I kvadratet er alle kantene like lange. I rektangelet er kantene like lange to og to.', zh:'什么一样？两个都有 4 个直角。什么不同？正方形的 4 条边一样长。长方形是对边一样长。'},
   {html:`<div class="scene"><div class="row">${card(`<div class="fig md">${shape('kvadrat', 0)}</div>`, 'kvadrat', '', G.C.orange, .2)}${card(`<div class="fig md">${shape('rektangel', 0)}</div>`, 'rektangel', '', G.C.green, .9)}${card(`<div class="fig md">${shape('firkant', 0)}</div>`, 'firkant', '', G.C.blue, 1.6)}</div>${bubble(A.bi('Velg det mest presise navnet', '选最准确的名称'), 2.6)}</div>`,
    no:'Både kvadratet og rektangelet er firkanter. Men vi bruker det mest presise navnet. Er det et kvadrat, så sier vi kvadrat.', zh:'正方形和长方形也都是四边形。但我们用最准确的名称。是正方形，就说[kvadrat]。'}
  ]},

geo_3d: {
  no:'Tredimensjonale figurer', zh:'立体图形', emoji:'🧊',
  scenes:[
   {html:`<div class="scene"><div class="fig lg pop">${solid('kube')}</div>${bubble(A.bi('lengde · bredde · høyde', '长 · 宽 · 高'), 1)}</div>`,
    no:'En tredimensjonal figur har lengde, bredde og høyde. Du kan holde den i hånden.', zh:'[tredimensjonal]的图形有长度、宽度和高度。可以拿在手里。'},
   {html:`<div class="scene"><div class="row">${['kube', 'prisme', 'pyramide', 'sylinder', 'kule'].map((k, i) => card(fg(solid(k), 'sm'), k, A.GEO_NAMES[k].zh, G.SOLIDS[k].color, .2 + i * .9)).join('')}</div></div>`,
    no:'Her er fem tredimensjonale figurer. Kube. Prisme. Pyramide. Sylinder. Kule.', zh:'这里有五种立体图形。[kube]，正方体。[prisme]，棱柱。[pyramide]，棱锥。[sylinder]，圆柱。[kule]，球。'},
   {html:`<div class="scene"><div class="row">${card(fg(G.cubeMark('flate')), 'flate', '面', '#ef4444', .2)}${card(fg(G.cubeMark('kant')), 'kant', '棱', '#ef4444', 1.4)}${card(fg(G.cubeMark('hjorne')), 'hjørne', '顶点', '#ef4444', 2.6)}</div></div>`,
    no:'En flate er en flat side. En kant er der to flater møtes. Et hjørne er der kantene møtes.', zh:'[flate]是平的一面。[kant]是两个面相交的地方。[hjørne]是几条棱相交的地方。'},
   {html:`<div class="scene"><div class="fig lg pop">${solid('kube')}</div><div class="row fade" style="--d:.8s">${countChip('6 flater', '#f97316')}${countChip('12 kanter', '#ef4444')}${countChip('8 hjørner', '#3b82f6')}</div></div>`,
    no:'En kube har seks flater, tolv kanter og åtte hjørner.', zh:'[kube]有 6 个面、12 条棱和 8 个顶点。'},
   {html:`<div class="scene"><div class="row">${['kube', 'prisme', 'pyramide'].map((k, i) => card(`<div class="fig sm">${solid(k)}</div><div class="fig md">${G.faceSet(G.SOLIDS[k].fs)}</div>`, G.SOLIDS[k].faces, G.SOLIDS[k].facesZh, G.SOLIDS[k].color, .2 + i * 1.3)).join('')}</div></div>`,
    no:'Flatene har ulike former. Kuben har seks kvadrater. Prismet har to kvadrater og fire rektangler. Pyramiden har ett kvadrat og fire trekanter.', zh:'面的形状不一样。[kube]有 6 个正方形。[prisme]有 2 个正方形和 4 个长方形。[pyramide]有 1 个正方形和 4 个三角形。'},
   {html:`<div class="scene"><div class="row">${card(fg(solid('sylinder'), 'sm') + fg(G.faceSet(['s', 's', 'r']), 'md'), 'sylinder', '2 sirkler + 1 rund side', '#22c55e', .2)}${card(fg(solid('kule'), 'sm'), 'kule', 'helt rund', '#ef4444', 1.2)}</div>${bubble(A.bi('ingen hjørner', '没有顶点'), 2.2)}</div>`,
    no:'Sylinderen har to sirkler og en rund side. Kulen er helt rund. De har ingen hjørner.', zh:'[sylinder]有两个圆和一个弯曲的侧面。[kule]是圆滚滚的。它们都没有顶点。'},
   {html:`<div class="scene"><table class="vt pop"><tr><th></th><th>flater</th><th>kanter</th><th>hjørner</th></tr><tr><td><b>kube</b></td><td>6</td><td>12</td><td>8</td></tr><tr><td><b>prisme</b></td><td>6</td><td>12</td><td>8</td></tr><tr><td><b>pyramide</b></td><td>5</td><td>8</td><td>5</td></tr></table><div class="small-note fade" style="--d:1s">面 · 棱 · 顶点</div></div>`,
    no:'Oppsummering. Kube: seks flater, tolv kanter, åtte hjørner. Prisme: det samme. Pyramide: fem flater, åtte kanter, fem hjørner.', zh:'总结。[kube]：6 个面，12 条棱，8 个顶点。[prisme]：一样。[pyramide]：5 个面，8 条棱，5 个顶点。'}
  ]},

geo_net: {
  no:'Fra tredimensjonal til todimensjonal', zh:'从立体到平面', emoji:'📦',
  scenes:[
   {html:title('📦', 'Nett – utbrettet figur', '展开图', `<div class="sub fade" style="--d:.8s">${A.bi('Brett ut en eske → en flat figur', '把盒子展开 → 一个平面图形')}</div>`),
    no:'Hva skjer hvis du bretter ut en eske? Du får en flat figur. Den heter et nett.', zh:'把盒子展开会怎么样？你会得到一个平面图形。它叫[nett]，展开图。'},
   {html:`<div class="scene"><div class="row">${card(fg(solid('prisme'), 'md'), 'prisme', '', G.C.blue, .2)}<div class="big-emoji pop" style="--d:.9s">➡️</div>${card(fg(G.netSvg('prisme'), 'md'), 'nettet', '2 kvadrater + 4 rektangler', G.C.blue, 1.5)}</div></div>`,
    no:'Her er et prisme og nettet til prismet. Nettet har to kvadrater og fire rektangler.', zh:'这是一个[prisme]和它的展开图。展开图有 2 个正方形和 4 个长方形。'},
   {html:`<div class="scene"><div class="row">${[0, 3, 8].map((i, k) => card(fg(netCells(G.cubeNets()[i].cells), 'md'), '6 kvadrater ✔', '', G.C.orange, .2 + k * 1)).join('')}</div></div>`,
    no:'En kube har seks flater, så nettet har seks kvadrater. Det finnes mange ulike nett. Alle disse kan brettes til en kube.', zh:'[kube]有 6 个面，所以展开图有 6 个正方形。展开图有很多种。下面这些都能折成正方体。'},
   {html:`<div class="scene"><div class="row">${card(fg(G.cells(G.badNets()[1].cells, {color:'#ef4444'}), 'md'), '✖ ikke et kubenett', '', '#dc2626', .2)}</div>${bubble(A.bi('To flater havner oppå hverandre', '有两个面会重叠'), 1.4)}</div>`,
    no:'Men ikke alle figurer med seks kvadrater er et nett. Her havner to flater oppå hverandre når du bretter. Det er ikke et nett for en kube.', zh:'但不是所有 6 个正方形的图形都是展开图。这个折起来会有两个面重叠。它不是正方体的展开图。'},
   {html:`<div class="scene"><div class="row">${card(fg(G.netSvg('pyramide'), 'md'), 'pyramide', '1 kvadrat + 4 trekanter', G.C.orange, .2)}${card(fg(solid('pyramide'), 'md'), 'pyramide', '', G.C.orange, 1.2)}</div></div>`,
    no:'Nettet til en pyramide har ett kvadrat og fire trekanter.', zh:'[pyramide]的展开图有 1 个正方形和 4 个三角形。'},
   {html:`<div class="scene"><div class="fig lg pop">${G.blocks([[3, 3, 2], [3, 1, 1], [2, 1, 0]], {color:G.C.orange})}</div>${bubble(A.bi('Tell kolonne for kolonne', '一列一列地数'), 1)}</div>`,
    no:'Nå skal vi telle klosser. Tell kolonne for kolonne, og husk klossene du ikke ser!', zh:'现在我们来数小方块。一列一列地数，别忘了看不见的方块！'},
   {html:`<div class="scene"><div class="row">${card(fg(G.blocks([[3, 3, 2], [3, 1, 1], [2, 1, 0]], {color:G.C.orange}), 'md'), '16 klosser', '', G.C.orange, .2)}${card(`<div class="e" style="font-size:2.4rem">27 − 16 = 11</div>`, 'mangler', '一个 3×3×3 的正方体有 27 个', '#ef4444', 1.4)}</div></div>`,
    no:'En kube på tre ganger tre ganger tre har tjuesju klosser. Her er det seksten. Det mangler elleve.', zh:'3×3×3 的正方体有 27 个小方块。这里有 16 个。还差 11 个。'}
  ]},

geo_angles: {
  no:'Vinkler', zh:'角', emoji:'📐',
  scenes:[
   {html:`<div class="scene"><div class="fig lg pop">${G.angle(60, {label:'vinkel'})}</div></div>`,
    no:'En vinkel dannes når to linjer møtes i et hjørne.', zh:'两条线在一个顶点相交，就形成一个[vinkel]，角。'},
   {html:`<div class="scene"><div class="row">${card(`<div class="fig md">${G.angle(90, {base:0})}</div>`, 'rett vinkel · 90°', '直角', '#16a34a', .2)}${card(`<div class="e">📄</div>`, 'som hjørnet på et ark', '像纸的角', '#16a34a', 1.2)}</div></div>`,
    no:'En rett vinkel er som hjørnet på et ark. Den er nitti grader.', zh:'[rett vinkel]像纸的角。它是 90 度。'},
   {html:`<div class="scene"><div class="fig lg pop">${G.angle(45, {base:0}).replace('</svg>', '<line x1="38" y1="82" x2="38" y2="20" stroke="#ef4444" stroke-width="3" stroke-dasharray="6 5"/></svg>')}</div>${bubble(A.bi('spiss vinkel: mindre enn rett vinkel', '锐角：比直角小'), 1)}</div>`,
    no:'En spiss vinkel er mindre enn en rett vinkel. Den er spiss som en blyant.', zh:'[spiss vinkel]比直角小。像铅笔尖一样尖。'},
   {html:`<div class="scene"><div class="fig lg pop">${G.angle(130, {base:0}).replace('</svg>', '<line x1="38" y1="82" x2="38" y2="20" stroke="#ef4444" stroke-width="3" stroke-dasharray="6 5"/></svg>')}</div>${bubble(A.bi('stump vinkel: større enn rett vinkel', '钝角：比直角大'), 1)}</div>`,
    no:'En stump vinkel er større enn en rett vinkel. Den er vid og åpen.', zh:'[stump vinkel]比直角大。又宽又开。'},
   {html:`<div class="scene"><div class="row">${card(`<div class="fig sm">${G.angle(50, {base:20})}</div>`, 'spiss', '< 90°', '#ef4444', .2)}${card(`<div class="fig sm">${G.angle(90, {base:20})}</div>`, 'rett', '= 90°', '#16a34a', 1)}${card(`<div class="fig sm">${G.angle(125, {base:10})}</div>`, 'stump', '> 90°', '#3b82f6', 1.8)}</div></div>`,
    no:'Sammenlign med en rett vinkel. Mindre enn rett: spiss. Akkurat rett: rett. Større enn rett: stump.', zh:'和直角比一比。比直角小：[spiss]，锐角。正好是直角：[rett]。比直角大：[stump]，钝角。'},
   {html:`<div class="scene"><div class="row">${card(`<div class="fig md">${G.svg(G.poly(RECT, G.C.green, {right:true}))}</div>`, 'rektangel: 4 rette vinkler', '长方形：4 个直角', G.C.green, .2)}${card(`<div class="fig md">${G.svg(G.poly(G.fit([[5, 85], [95, 85], [30, 50]]), G.C.red, {right:true}))}</div>`, 'en stump og to spisse', '一个钝角，两个锐角', G.C.red, 1.2)}</div></div>`,
    no:'I et rektangel er alle fire vinklene rette. I denne trekanten er én vinkel stump og to er spisse.', zh:'长方形的 4 个角都是直角。这个三角形有一个钝角和两个锐角。'}
  ]},

geo_puzzle: {
  no:'Finn ut: gåter og utfordringer', zh:'想一想：谜题和挑战', emoji:'🧩',
  scenes:[
   {html:title('🧩', 'Finn ut!', '想一想！', `<div class="row fade" style="--d:.6s"><span class="chip" style="--c:#f97316;font-size:1.3rem">les</span><span class="chip" style="--c:#0ea5e9;font-size:1.3rem">tegn</span><span class="chip" style="--c:#16a34a;font-size:1.3rem">prøv</span><span class="chip" style="--c:#9333ea;font-size:1.3rem">finn flere</span></div>`),
    no:'Nå skal du undersøke selv. Les oppgaven nøye. Tegn. Prøv. Og finn flere løsninger.', zh:'现在你要自己去探究。认真读题。画一画。试一试。再找出更多答案。'},
   {html:`<div class="scene"><div class="sub up">${A.bi('Jeg har 5 flater. 1 kvadrat og 4 trekanter. Hvilken figur er jeg?', '我有 5 个面：1 个正方形和 4 个三角形。我是什么图形？')}</div><div class="row">${card(fg(G.faceSet(['k', 't', 't', 't', 't']), 'md'), '5 flater', '', '#f59e0b', .4)}${card(fg(solid('pyramide'), 'md'), 'pyramide!', '', '#f59e0b', 3.2)}</div></div>`,
    no:'Her er en gåte. Jeg har fem flater. Ett kvadrat og fire trekanter. Hvilken figur er jeg? Jo, jeg er en pyramide!', zh:'这是一个谜语。我有 5 个面：1 个正方形和 4 个三角形。我是什么图形？对了，我是[pyramide]，棱锥！'},
   {html:`<div class="scene"><div class="sub up">${A.bi('Et tau på 10 m. En firkant. Den ene siden er 3 m.', '一根 10 米的绳子。围成四边形。一条边是 3 米。')}</div><div class="row">${card(`<div class="e" style="font-size:1.8rem">3 + 3 + 2 + 2 = 10</div>`, 'rektangel', '', G.C.green, 1.2)}${card(`<div class="e" style="font-size:1.8rem">3 + 4 + 1 + 2 = 10</div>`, 'firkant', '', G.C.blue, 2.4)}</div></div>`,
    no:'Et tau er ti meter langt. Du lager en firkant. Den ene siden er tre meter. Hvor lange kan de andre sidene være? Tre pluss tre pluss to pluss to er ti. Tre pluss fire pluss en pluss to er også ti. Det finnes flere løsninger!', zh:'绳子长 10 米。围成一个四边形。其中一条边是 3 米。其余的边可以多长？3＋3＋2＋2＝10。3＋4＋1＋2＝10 也可以。答案不止一种！'},
   {html:`<div class="scene"><div class="fig lg pop">${numbered(G.fit([[50, 5], [78, 15], [95, 42], [92, 70], [70, 92], [38, 92], [10, 75], [8, 35]]), G.C.purple, .3)}</div>${bubble(A.bi('Tegn en figur med minst 8 hjørner', '画一个至少有 8 个顶点的图形'), 3)}</div>`,
    no:'Kan du tegne en todimensjonal figur med minst åtte hjørner? Her er ett forslag. Du kan tegne en annen!', zh:'你能画一个至少有 8 个顶点的平面图形吗？这里有一个例子。你可以画一个不一样的！'},
   {html:title('🏆', 'Lykke til!', '祝你好运！', `<div class="sub fade" style="--d:.6s">${A.bi('Les · tegn · prøv · sjekk', '读 · 画 · 试 · 检查')}</div>`),
    no:'Husk: les nøye, tegn, prøv, og sjekk at du har riktig. Lykke til!', zh:'记住：认真读题，画一画，试一试，再检查对不对。祝你好运！'}
  ]}
});

function V0(k){ return G.shapes[k][0].pts; }
})();
