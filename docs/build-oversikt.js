// Bygger oversikt.html og substantiv-oversikt.pdf (6 sider, A4). Kjør: node docs/build-oversikt.js
const fs = require('fs'), path = require('path');
const C = {ue:'#f97316', be:'#0d9488', uf:'#9333ea', bf:'#a16207', en:'#2563eb', ei:'#db2777', et:'#16a34a',
  person:'#2563eb', dyr:'#16a34a', ting:'#d97706', sted:'#9333ea', name:'#e11d48', ink:'#1e293b', mute:'#64748b', line:'#94a3b8'};
const FONT = `font-family="Noto Sans, DejaVu Sans, Noto Sans CJK SC, sans-serif"`;
const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" ${FONT} font-size="${o.size || 18}" font-weight="${o.w || 700}" fill="${o.fill || C.ink}" text-anchor="${o.a || 'middle'}" ${o.op ? `opacity="${o.op}"` : ''}>${s}</text>`;
const E = (x, y, ch, size, op) => `<text x="${x}" y="${y}" font-size="${size}" text-anchor="middle" ${op != null ? `opacity="${op}"` : ''}>${ch}</text>`;

/* barn. (x,y) = føttene. armTo = {dx,dy} i lokale koordinater (peker) */
function kid(x, y, o = {}) {
  const s = o.s || 1, hair = o.hair || '#6b4226', shirt = o.shirt || '#38bdf8';
  const arm = o.armTo ? `<line x1="14" y1="-62" x2="${o.armTo.dx}" y2="${o.armTo.dy}" stroke="#334155" stroke-width="10" stroke-linecap="round"/><line x1="14" y1="-62" x2="${o.armTo.dx}" y2="${o.armTo.dy}" stroke="#fde0c2" stroke-width="5.5" stroke-linecap="round"/>` : '';
  return `<g transform="translate(${x},${y}) scale(${s})">
    <rect x="-22" y="-80" width="44" height="80" rx="14" fill="${shirt}" stroke="#334155" stroke-width="3"/>
    <circle cx="0" cy="-104" r="24" fill="#fde0c2" stroke="#334155" stroke-width="3"/>
    <path d="M-24 -108 Q-20 -134 2 -131 Q26 -132 24 -108 Q8 -120 -24 -108Z" fill="${hair}"/>
    <circle cx="-8" cy="-102" r="3" fill="#1e293b"/><circle cx="8" cy="-102" r="3" fill="#1e293b"/>
    <path d="M-8 -93 Q0 -86 8 -93" stroke="#1e293b" stroke-width="3" fill="none" stroke-linecap="round"/>${arm}</g>`;
}
function speech(x, y, w, h, tail, lines) {
  const [tx, ty] = tail, bx = Math.min(Math.max(tx, x + 24), x + w - 50);
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="#fff" stroke="${C.line}" stroke-width="3"/>
    <polygon points="${bx},${y + h - 1} ${bx + 26},${y + h - 1} ${tx},${ty}" fill="#fff" stroke="${C.line}" stroke-width="3"/>
    <line x1="${bx + 2}" y1="${y + h}" x2="${bx + 24}" y2="${y + h}" stroke="#fff" stroke-width="5"/>
    ${lines.map((l, i) => T(x + w / 2, y + 32 + i * 28, l[0], {size: l[1] || 22, w: l[2] || 800, fill: l[3] || C.ink})).join('')}</g>`;
}
function cloud(cx, cy, rx, ry) {
  return `<g fill="#fff" stroke="${C.line}" stroke-width="3"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>
    ${[[-.7, -.7, .34], [-.2, -1, .36], [.35, -1, .38], [.8, -.6, .34], [1, 0, .3], [-.9, .1, .3], [.7, .7, .3], [-.3, .85, .3], [.2, 1, .26]].map(c => `<circle cx="${cx + c[0] * rx}" cy="${cy + c[1] * ry}" r="${c[2] * ry * 1.1}"/>`).join('')}</g>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx - 3}" ry="${ry - 3}" fill="#fff"/>`;
}
const dots = (x1, y1, x2, y2) => `<circle cx="${x1}" cy="${y1}" r="6" fill="#fff" stroke="${C.line}" stroke-width="2.5"/><circle cx="${(x1 + x2) / 2}" cy="${(y1 + y2) / 2}" r="9" fill="#fff" stroke="${C.line}" stroke-width="2.5"/>`;
/* merkelapp med snor */
function tag(x, y, w, l1, l2, color, tx, ty) {
  return `<g><line x1="${x + w / 2}" y1="${y + 46}" x2="${tx}" y2="${ty}" stroke="${color}" stroke-width="3" stroke-dasharray="5 4"/>
    <rect x="${x}" y="${y}" width="${w}" height="48" rx="12" fill="${color}"/>${T(x + w / 2, y + 22, l1, {size: 19, w: 900, fill: '#fff'})}${T(x + w / 2, y + 40, l2, {size: 13, w: 600, fill: '#fff'})}</g>`;
}
const svg = (h, inner, bg) => `<svg viewBox="0 0 720 ${h}" class="scene" style="background:${bg || '#f0f9ff'}">${inner}</svg>`;
const ground = (y, h, col) => `<rect x="0" y="${y}" width="720" height="${h}" fill="${col || '#bbf7d0'}"/>`;


/* ---------- kompakte scener til 2x2-ruten ---------- */
const WH = 'viewBox="0 0 360 232"';
const sc = (inner, bg) => `<svg ${WH} class="scene" style="background:${bg}">${inner}</svg>`;
const gr = `<rect x="0" y="196" width="360" height="36" fill="#bbf7d0"/>`;
const ringOne = (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="30" fill="rgba(13,148,136,.13)" stroke="${C.be}" stroke-width="4" stroke-dasharray="8 6"/>${E(cx + 30, cy - 26, '✨', 22)}`;
const thought = (n, txt, col) => sc(`${gr}${kid(52, 224, {s: .8})}${dots(86, 126, 108, 108)}${cloud(226, 66, 92, 42)}
  ${n === 1 ? E(226, 70, '🐶', 38) : E(226, 68, '🐶🐶🐶', 30)}${T(226, 101, txt, {size: 15, w: 900})}
  ${E(322, 190, '🐩', 26, .5)}${E(300, 150, '🐕', 26, .5)}`, '#fff');
const pointing = (group, l1, l2, col) => sc(`${gr}${kid(52, 224, {s: .8, armTo: {dx: group ? 130 : 138, dy: -26}})}
  ${speech(96, 8, 256, 64, [62, 114], [[l1, 19], [l2, 14, 700, col]])}
  ${group ? `<ellipse cx="246" cy="204" rx="92" ry="34" fill="rgba(161,98,7,.12)" stroke="${C.bf}" stroke-width="4" stroke-dasharray="8 6"/>${E(190, 214, '🐶', 44)}${E(246, 214, '🐶', 44)}${E(302, 214, '🐶', 44)}`
   : `${E(188, 214, '🐶', 44, .4)}${E(304, 214, '🐶', 44, .4)}${E(246, 216, '🐶', 52)}${ringOne(246, 202)}`}`, '#fff');
const cellUE = thought(1, 'Jeg vil ha en hund.'), cellUF = thought(3, 'Jeg vil ha hunder.');
const cellBE = pointing(false, 'Den hunden er søt!', 'Hunden er søt.', C.be), cellBF = pointing(true, 'De hundene er søte!', 'Hundene er søte.', C.bf);

const miniDogs = `<svg viewBox="0 0 250 84" style="width:100%;height:auto;background:#fffbeb;border-radius:2mm">
  ${E(40, 56, '🐶', 34, 1)}${E(92, 56, '🐶', 34)}${[40, 92].map(x => `<rect x="${x - 24}" y="62" width="48" height="18" rx="5" fill="#94a3b8"/>${T(x, 76, 'hund', {size: 12, fill: '#fff', w: 800})}`).join('')}
  ${T(66, 14, 'vanlig · 普通', {size: 10, fill: C.mute, w: 700})}
  ${E(190, 52, '🐶', 44)}<rect x="154" y="60" width="72" height="22" rx="6" fill="${C.name}"/>${T(190, 77, 'Pelle', {size: 16, fill: '#fff', w: 900})}
  <circle cx="171" cy="71" r="10" fill="none" stroke="#facc15" stroke-width="2.5"/>${T(190, 14, 'egennavn · 专有名词', {size: 10, fill: C.name, w: 800})}
</svg>`;

const css = `
@page{size:A4 landscape;margin:0}*{box-sizing:border-box}
body{margin:0;font-family:"Noto Sans","DejaVu Sans","Noto Sans CJK SC",sans-serif;color:#1f2937;font-size:8.5pt;line-height:1.33}
.page{width:297mm;height:210mm;padding:6mm 7mm;background:#fffaf0;overflow:hidden;display:grid;grid-template-rows:12mm 1fr;gap:3mm}
.top{display:flex;align-items:center;gap:5mm;border-bottom:2.5px solid #f97316}
.top h1{margin:0;font-size:19pt;color:#c2410c}.top .z{font-size:15pt;color:#475569;font-weight:800}.top .sp{flex:1}.top .chant{font-size:8.5pt;color:#475569;text-align:right}
.main{display:grid;grid-template-columns:88mm 1fr;gap:3.5mm;min-height:0}
.left{display:grid;grid-template-rows:auto auto 1fr;gap:3mm;min-height:0}
.card{background:#fff;border-radius:2.5mm;padding:2mm 2.6mm;box-shadow:0 0 0 1.3px #e5e7eb}
.card h2{margin:0 0 1mm;font-size:10pt;color:#c2410c;display:flex;justify-content:space-between;align-items:baseline}.card h2 .z{font-size:8.5pt;color:#475569}
.zh{color:#475569}b{color:#111827}
.chips{display:grid;grid-template-columns:repeat(4,1fr);gap:1.2mm;margin:1.2mm 0}
.chip{text-align:center;border-top:1.6mm solid var(--c);border-radius:1.5mm;background:#f8fafc;padding:.8mm 0;font-size:8.2pt;line-height:1.2}.chip .e{font-size:17pt;line-height:1.1}
.art{display:inline-block;color:#fff;border-radius:1.5mm;padding:0 1.6mm;font-weight:900}.en{background:${C.en}}.ei{background:${C.ei}}.et{background:${C.et}}
.ok{color:#15803d;font-weight:800}.bad{color:#dc2626;font-weight:800}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:1.4mm;margin-top:1mm}
.gcol{border-radius:2mm;padding:1.2mm 1.2mm;text-align:center;background:color-mix(in srgb,var(--c) 11%,#fff);border:1.4px solid var(--c);font-size:8.8pt}
.gcol .big{font-size:15pt;font-weight:900;color:#fff;background:var(--c);border-radius:1.6mm;display:block;line-height:1.25;margin-bottom:.8mm}
.gcol .e{font-size:13pt}.gcol small{display:block;color:var(--c);font-weight:800;font-size:7pt;line-height:1.2}
.right{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:8mm 6.5mm 1fr 6.5mm 1fr auto;gap:1.6mm;min-height:0}
.colh{border-radius:2mm;color:#fff;font-weight:900;text-align:center;font-size:9.5pt;display:flex;flex-direction:column;justify-content:center;line-height:1.15}.colh span{font-size:7.5pt;font-weight:700}
.rowh{grid-column:1 / 3;border-radius:2mm;color:#fff;font-weight:900;text-align:center;font-size:9.5pt;display:flex;align-items:center;justify-content:center;gap:2mm;line-height:1.1}
.rowh span{font-size:8.5pt;font-weight:700}
.cell{display:flex;flex-direction:column;min-height:0}.scene{width:100%;height:auto;border-radius:2.5mm 2.5mm 0 0;display:block;box-shadow:0 0 0 1.3px #e5e7eb}
.cap{background:#fff;border-radius:0 0 2.5mm 2.5mm;padding:1mm 2mm;box-shadow:0 0 0 1.3px #e5e7eb;font-size:8pt;line-height:1.25}.cap .nm{font-weight:900;font-size:9pt}
.ending{font-weight:900;border-bottom:.9mm solid currentColor}
.rules{grid-column:1 / 3;display:grid;grid-template-columns:1fr 1fr 1fr;gap:2mm}
.rules .card{font-size:7.8pt;padding:1.4mm 2.2mm}.rules b.t{color:#c2410c}
rt{font-size:5pt;color:#64748b;line-height:1}
`;
const R = (zh, py) => `<ruby>${zh}<rt>${py}</rt></ruby>`;
const art = a => `<span class="art ${a}">${a}</span>`;
const cap = (c, no, zh, ex, sentence, zhs) => `<div class="cap"><span class="nm" style="color:${c}">${no}</span> <span class="zh">${zh}</span> · <b>${ex}</b><br><span class="zh">${sentence}</span></div>`;
const colh = (c, no, zh) => `<div class="colh" style="background:${c}">${no}<span>${zh}</span></div>`;
const rowh = (c, no, zh) => `<div class="rowh" style="background:${c}">${no} <span>${zh}</span></div>`;

const html = `<!doctype html><html lang="nb"><head><meta charset="utf-8"><title>Substantiv 名词 – jukselapp</title><style>${css}</style></head><body><div class="page">
<div class="top"><h1>📘 Substantiv</h1><span class="z">${R('名词', 'míngcí')} · jukselapp 速查表</span><span class="sp"></span>
 <span class="chant">Lær ordet <b>sammen med en/ei/et</b> · 单词要和 en/ei/et 一起记</span></div>
<div class="main">
 <div class="left">
  <div class="card"><h2>1 · Substantiv <span class="z">${R('名词', 'míngcí')}</span></h2>
   Ord for <b>person, dyr, ting, sted</b>. Navn på alt rundt oss.<br><span class="zh">表示人、动物、东西、地方的词。是我们周围一切事物的名字。</span>
   <div class="chips"><div class="chip" style="--c:${C.person}"><div class="e">👧</div><b>person</b><br>人</div><div class="chip" style="--c:${C.dyr}"><div class="e">🐶</div><b>dyr</b><br>动物</div><div class="chip" style="--c:${C.ting}"><div class="e">⚽</div><b>ting</b><br>东西</div><div class="chip" style="--c:${C.sted}"><div class="e">🏫</div><b>sted</b><br>地方</div></div>
   <b>Test:</b> kan du si ${art('en')} ${art('ei')} ${art('et')} foran? <span class="zh">前面能加 en/ei/et 吗？</span><br>
   <span class="ok">✔ en hund</span> &nbsp; <span class="bad">✖ en løpe</span> <span class="zh">(verb 动词 = det du gjør 做的事)</span> &nbsp; <span class="bad">✖ en stor</span> <span class="zh">(adjektiv 形容词 = hvordan 怎么样)</span></div>
  <div class="card"><h2>2 · Egennavn <span class="z">${R('专有名词', 'zhuānyǒu míngcí')}</span></h2>
   Navn på <u>én bestemt</u> person/dyr/sted → <b style="color:${C.name}">STOR bokstav</b>.<br><span class="zh">特定的人/动物/地方的名字 → <b>大写</b>开头。</span>
   <div style="margin:1mm 0">${miniDogs}</div>
   <span class="ok" style="color:${C.name}">Ola · Mia · Pelle · Oslo · Norge · Kina</span><br>
   <b>liten bokstav</b> <span class="zh">小写</span>: hund · <b>mandag</b> · <b>juni</b> · <b>norsk</b> <span class="zh">(星期·月份·语言)</span></div>
  <div class="card"><h2>3 · en, ei, et <span class="z">${R('性别', 'xìngbié')} 阳 / 阴 / 中</span></h2>
   Hvert substantiv har et <b>kjønn</b> – lær det med ordet. <span class="zh">每个名词有“性”，要和单词一起记。</span>
   <div class="g3">
    <div class="gcol" style="--c:${C.en}"><span class="big">en</span><span class="e">🐶 🚗 🪑</span><br>en hund<br>en bil<small>hankjønn 阳性</small></div>
    <div class="gcol" style="--c:${C.ei}"><span class="big">ei</span><span class="e">👧 📖 🚪</span><br>ei jente<br>ei bok<small>hunkjønn 阴性</small></div>
    <div class="gcol" style="--c:${C.et}"><span class="big">et</span><span class="e">🏠 🍎 🧒</span><br>et hus<br>et eple<small>intetkjønn 中性</small></div></div>
   <span class="zh" style="font-size:7.5pt">不确定时常用 en。书面挪威语里 ei 名词也可以用 en（en bok）。</span></div>
 </div>

 <div class="right">
  ${colh(C.ue, 'ENTALL · én', '单数 · 一个')}${colh(C.uf, 'FLERTALL · mange', '复数 · 很多个')}
  ${rowh(C.ue, 'UBESTEMT', '— vi vet IKKE hvilken · 不定：不知道是哪一个')}
  <div class="cell">${cellUE}${cap(C.ue, 'ubestemt entall', '不定单数', 'en hund · ei jente · et hus', '想要一只狗——哪只都行', '')}</div>
  <div class="cell">${cellUF}${cap(C.uf, 'ubestemt flertall', '不定复数', 'hunder · jenter · hus', '想要几只狗——哪几只都行', '')}</div>
  ${rowh(C.be, 'BESTEMT', '— vi vet hvilken · 定指：知道是哪一个')}
  <div class="cell">${cellBE}${cap(C.be, 'bestemt entall', '定指单数', 'hunden · jenta · huset', '指着的那一只：那只狗真可爱！', '')}</div>
  <div class="cell">${cellBF}${cap(C.bf, 'bestemt flertall', '定指复数', 'hundene · jentene · husene', '指着的那几只：那些狗真可爱！', '')}</div>
  <div class="rules">
   <div class="card"><b class="t">Bestemt entall · 定指单数</b><br>${art('en')} +<span class="ending" style="color:${C.be}">en</span> hund<b>en</b> &nbsp; ${art('ei')} +<span class="ending" style="color:${C.be}">a</span> jent<b>a</b> &nbsp; ${art('et')} +<span class="ending" style="color:${C.be}">et</span> hus<b>et</b></div>
   <div class="card"><b class="t">Flertall · 复数</b> &nbsp;+<b>er</b>: bil<b>er</b>, jent<b>er</b><br>ingenting 不变: <b>hus</b>, <b>dyr</b>, <b>barn</b> · spesielle 特殊: mann→<b>menn</b>, bok→<b>bøker</b>, tre→<b>trær</b></div>
   <div class="card"><b class="t">Bestemt flertall · 定指复数</b><br>flertall +<span class="ending" style="color:${C.bf}">ene</span>: bil<b>ene</b>, hund<b>ene</b> · barn → barn<b>a</b></div>
  </div>
 </div>
</div></div></body></html>`;

fs.writeFileSync(path.join(__dirname, 'oversikt.html'), html);
(async () => {
  const { chromium } = require('/opt/node22/lib/node_modules/playwright');
  const b = await chromium.launch(); const pg = await b.newPage();
  await pg.goto('file://' + path.join(__dirname, 'oversikt.html'));
  await pg.pdf({ path: path.join(__dirname, 'substantiv-jukselapp.pdf'), format: 'A4', landscape: true, printBackground: true, preferCSSPageSize: true });
  await b.close(); console.log('ok');
})();
