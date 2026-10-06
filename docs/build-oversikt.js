// Bygger oversikt.html og oversikt.pdf. Kjør: node docs/build-oversikt.js
const fs = require('fs'), path = require('path');
const COL = {ue:'#f97316', be:'#0d9488', uf:'#9333ea', bf:'#a16207', en:'#2563eb', ei:'#db2777', et:'#16a34a'};

function kid(x, arm){ // enkelt barn, x = senter, bakkenivå y=250
  return `<g transform="translate(${x},0)">
    <rect x="-24" y="172" width="48" height="78" rx="14" fill="#38bdf8" stroke="#334155" stroke-width="3"/>
    <circle cx="0" cy="150" r="24" fill="#fde0c2" stroke="#334155" stroke-width="3"/>
    <path d="M-24 146 Q-20 120 2 123 Q26 122 24 146 Q8 134 -24 146Z" fill="#6b4226"/>
    <circle cx="-8" cy="152" r="3" fill="#1e293b"/><circle cx="8" cy="152" r="3" fill="#1e293b"/>
    <path d="M-8 161 Q0 168 8 161" stroke="#1e293b" stroke-width="3" fill="none" stroke-linecap="round"/>
    ${arm || ''}
  </g>`;
}
const dogs = (xs, op) => xs.map((x, i) => `<text x="${x}" y="243" font-size="46" text-anchor="middle" opacity="${op && op[i] != null ? op[i] : 1}">🐶</text>`).join('');
function think(n, txt){
  const d = n === 1 ? `<text x="232" y="84" font-size="44" text-anchor="middle">🐶</text>` : `<text x="232" y="84" font-size="38" text-anchor="middle">🐶🐶🐶</text>`;
  return `<svg viewBox="0 0 360 260" class="scene">
    <circle cx="96" cy="136" r="6" fill="#fff" stroke="#94a3b8" stroke-width="2"/><circle cx="110" cy="116" r="9" fill="#fff" stroke="#94a3b8" stroke-width="2"/>
    <g transform="translate(0,22)"><g fill="#fff" stroke="#94a3b8" stroke-width="3"><ellipse cx="232" cy="62" rx="108" ry="46"/><circle cx="150" cy="44" r="26"/><circle cx="190" cy="22" r="26"/><circle cx="250" cy="18" r="28"/><circle cx="305" cy="40" r="26"/><circle cx="330" cy="78" r="22"/><circle cx="150" cy="82" r="24"/></g>
    <ellipse cx="232" cy="62" rx="106" ry="44" fill="#fff"/></g>
    <g transform="translate(0,0)">${d}<text x="232" y="114" font-size="17" font-weight="800" text-anchor="middle" fill="#1e293b">${txt}</text></g>
    ${kid(60)}
  </svg>`;
}
function point(group, line1, line2){
  const arm = `<line x1="18" y1="190" x2="${group ? 150 : 158}" y2="${group ? 204 : 206}" stroke="#334155" stroke-width="9" stroke-linecap="round"/><line x1="18" y1="190" x2="${group ? 150 : 158}" y2="${group ? 204 : 206}" stroke="#fde0c2" stroke-width="5" stroke-linecap="round"/>`;
  const ring = group
    ? `<ellipse cx="255" cy="226" rx="90" ry="38" fill="rgba(161,98,7,.10)" stroke="#a16207" stroke-width="4" stroke-dasharray="9 6"/>`
    : `<circle cx="255" cy="225" r="34" fill="rgba(13,148,136,.12)" stroke="#0d9488" stroke-width="4" stroke-dasharray="9 6"/><text x="272" y="192" font-size="22">✨</text>`;
  const ds = group ? dogs([195, 255, 315]) : dogs([195, 255, 315], [.4, 1, .4]);
  return `<svg viewBox="0 0 360 260" class="scene">
    <path d="M104 24 h236 a14 14 0 0 1 14 14 v50 a14 14 0 0 1 -14 14 h-198 l-40 34 l8 -34 h-6 a14 14 0 0 1 -14 -14 v-50 a14 14 0 0 1 14 -14z" fill="#fff" stroke="#94a3b8" stroke-width="3"/>
    <text x="230" y="58" font-size="19" font-weight="900" text-anchor="middle" fill="#1e293b">${line1}</text>
    <text x="230" y="86" font-size="14" font-weight="700" text-anchor="middle" fill="#64748b">${line2}</text>
    ${ring}${ds}${kid(60, arm)}
  </svg>`;
}

const css = `
@page{size:A4;margin:0}
*{box-sizing:border-box}
body{margin:0;font-family:"Noto Sans","DejaVu Sans","Noto Sans CJK SC","WenQuanYi Micro Hei",sans-serif;color:#1f2937;font-size:11.5pt;line-height:1.5}
.page{width:210mm;height:297mm;padding:11mm 12mm;page-break-after:always;position:relative;overflow:hidden;background:#fffaf0}
.page:last-child{page-break-after:auto}
h1{margin:0;font-size:25pt;color:#c2410c}h2{margin:0 0 2mm;font-size:16pt;color:#c2410c;border-bottom:3px solid #f97316;padding-bottom:1mm}
.zh{color:#475569}.no b,.zh b{color:#c2410c}
.sub{font-size:10pt;color:#64748b;margin-bottom:3mm}
.hdr{display:flex;align-items:baseline;gap:4mm;margin-bottom:3mm}
.num{background:#f97316;color:#fff;border-radius:50%;width:9mm;height:9mm;display:inline-flex;align-items:center;justify-content:center;font-weight:900}
.card{background:#fff;border-radius:4mm;padding:3.5mm;box-shadow:0 0 0 1.5px #e5e7eb;margin-bottom:3mm}
.cols{display:grid;gap:3mm}.c2{grid-template-columns:1fr 1fr}.c3{grid-template-columns:1fr 1fr 1fr}.c4{grid-template-columns:repeat(4,1fr)}
.cat{text-align:center;border-top:2mm solid var(--c);}
.cat .e{font-size:30pt;line-height:1.1}.cat b{font-size:13pt}
.art{display:inline-block;color:#fff;border-radius:2mm;padding:0 2.2mm;font-weight:900}
.en{background:${COL.en}}.ei{background:${COL.ei}}.et{background:${COL.et}}
.ok{color:#16a34a;font-weight:900}.bad{color:#dc2626;font-weight:900}
.big{font-size:14pt;font-weight:800}
.form{border-top:2.4mm solid var(--c);padding:2.5mm;text-align:center}
.form h3{margin:0;font-size:10.5pt;color:var(--c);white-space:nowrap}.form .z{font-size:10pt;color:var(--c);font-weight:700}
.form .ex{font-size:15pt;font-weight:900;margin-top:1mm}
.ending{font-weight:900;border-bottom:1.2mm solid currentColor}
table{border-collapse:collapse;width:100%;font-size:10.5pt}th,td{border:1.5px solid #e5e7eb;padding:1.6mm 2.2mm;text-align:left}th{background:#fff7ed}
.scene{width:100%;height:auto;background:#f0f9ff;border-radius:3mm}
.cap{text-align:center;margin-top:1mm;font-size:10.5pt}.cap .lbl{display:inline-block;color:#fff;border-radius:2mm;padding:0 2.5mm;font-weight:900}
.tip{background:#fef9c3;border-radius:3mm;padding:2.5mm;margin-top:2mm}
.foot{position:absolute;bottom:6mm;left:12mm;right:12mm;font-size:8.5pt;color:#94a3b8;display:flex;justify-content:space-between}
rt{font-size:6.5pt;color:#64748b;font-weight:600;line-height:1}ruby{ruby-position:over}.hd{padding-top:3mm!important}
.arrow{font-size:20pt;color:#94a3b8;text-align:center;align-self:center}
.chant{font-size:10.5pt;font-weight:900;text-align:center;line-height:1.7}
`;
const R = (zh, py) => `<ruby>${zh}<rt>${py}</rt></ruby>`;
const foot = n => `<div class="foot"><span>Substantiv · 名词 – oversikt / 总览</span><span>${n} / 5</span></div>`;
const art = a => `<span class="art ${a}">${a}</span>`;
const form = (k, no, zh, py, ex, em, note, zhNote) => `<div class="form card" style="--c:${COL[k]}"><h3>${no}</h3><div class="z">${R(zh, py)}</div><div style="font-size:18pt;white-space:nowrap">${em}</div><div class="ex">${ex}</div><div style="font-size:9.5pt">${note}<br><span class="zh">${zhNote}</span></div></div>`;

const html = `<!doctype html><html lang="nb"><head><meta charset="utf-8"><title>Substantiv 名词 – oversikt</title><style>${css}</style></head><body>

<!-- SIDE 1 -->
<div class="page">
 <div class="hdr"><h1>📘 Substantiv</h1><h1 style="color:#475569">${R('名词', 'míngcí')}</h1></div>
 <div class="sub">Oversikt på norsk og kinesisk · 挪威语和中文总览</div>

 <div class="card" style="background:#fff7ed;text-align:center"><span style="font-size:20pt;font-weight:900;color:#c2410c">sub · stan · tiv</span> &nbsp;🔊 &nbsp;<span style="font-size:13pt">Si det høyt! <span class="zh">大声读出来！</span></span></div>
 <h2>1 · Hvorfor lære substantiv? <span class="zh" style="font-size:12pt">为什么要学名词？</span></h2>
 <div class="card cols c2">
  <div><div class="big">🍎❓ Uten ordet «eple» får du ikke eplet.</div><div class="zh">不知道 <b>eple</b>（苹果）这个词，你就拿不到苹果。</div></div>
  <div><div class="big">🗣 Substantiv er navn på alt rundt oss.</div><div class="zh">名词是我们周围一切事物的名字。</div></div>
  <div><div class="big">🔁 Substantiv endrer form: en bil, bilen, biler, bilene.</div><div class="zh">名词会变形：一共有四种形式。</div></div>
  <div><div class="big">✅ Riktig form: «Jeg ser <u>en bil</u>». ❌ «Jeg ser bil».</div><div class="zh">用错形式，听起来很奇怪。</div></div>
 </div>

 <h2>2 · Hva er et substantiv? <span class="zh" style="font-size:12pt">什么是名词？</span></h2>
 <div class="card"><div class="big">Et substantiv er et ord for en <b>person</b>, et <b>dyr</b>, en <b>ting</b> eller et <b>sted</b>.</div>
 <div class="zh">名词是表示<b>人</b>、<b>动物</b>、<b>东西</b>或<b>地方</b>的词。</div></div>
 <div class="cols c4">
  <div class="card cat" style="--c:#2563eb"><div class="e">👧👦</div><b>person</b><br><span class="zh">人</span><br>gutt · jente<br>lærer · venn</div>
  <div class="card cat" style="--c:#16a34a"><div class="e">🐶🐱</div><b>dyr</b><br><span class="zh">动物</span><br>hund · katt<br>fisk · fugl</div>
  <div class="card cat" style="--c:#d97706"><div class="e">🚗⚽</div><b>ting</b><br><span class="zh">东西</span><br>bil · ball<br>bok · eple</div>
  <div class="card cat" style="--c:#9333ea"><div class="e">🏫🏞️</div><b>sted</b><br><span class="zh">地方</span><br>skole · park<br>butikk · by</div>
 </div>

 <div class="cols c2">
  <div class="card"><b>Test: kan du si en / ei / et foran?</b><br><span class="zh">测试：前面能加 en / ei / et 吗？</span><br>
   <span class="ok">✔ ${art('en')} hund</span> &nbsp; <span class="bad">✖ ${art('en')} løpe</span><br>
   <span class="no">løpe, spise = <b>verb</b> ${R('动词', 'dòngcí')}</span><br><span class="no">stor, rød = <b>adjektiv</b> ${R('形容词', 'xíngróngcí')}</span><br><span class="zh">动词和形容词不是名词。</span></div>
  <div class="card" style="background:#fff1f2"><b>Egennavn ${R('专有名词', 'zhuānyǒu míngcí')} → STOR bokstav</b><br><span class="zh">专有名词 → 大写字母开头</span><br>
   <span class="ok">Ola · Mia · Pelle · Norge · Oslo · Kina</span><br>
   <b>liten bokstav</b> <span class="zh">小写</span>: <span class="ok">mandag · juni · norsk · kinesisk</span><br><span class="zh">星期、月份、语言用小写。</span></div>
 </div>
 ${foot(1)}
</div>

<!-- SIDE 2 -->
<div class="page">
 <h2>3 · en, ei og et <span class="zh" style="font-size:12pt">冠词（小伙伴）</span></h2>
 <div class="card"><div class="big">Alle norske substantiv har en liten venn foran seg: ${art('en')} ${art('ei')} ${art('et')}</div>
  <div class="zh">每个名词前面都有一个小伙伴。记单词时要<b>一起记</b>：不是 <i>hund</i>，而是 <b>en hund</b>！</div></div>
 <div class="cols c3">
  <div class="card" style="border-top:2.4mm solid ${COL.en}"><div class="big">${art('en')}-ord <span class="zh">蓝色</span></div><div style="font-size:22pt">🐶 🚗 🪑</div>en hund<br>en bil<br>en stol</div>
  <div class="card" style="border-top:2.4mm solid ${COL.ei}"><div class="big">${art('ei')}-ord <span class="zh">粉色</span></div><div style="font-size:22pt">👧 📖 🚪</div>ei jente<br>ei bok<br>ei dør</div>
  <div class="card" style="border-top:2.4mm solid ${COL.et}"><div class="big">${art('et')}-ord <span class="zh">绿色</span></div><div style="font-size:22pt">🏠 🍎 🧒</div>et hus<br>et eple<br>et barn</div>
 </div>
 <div class="tip">💡 Usikker? Mange ord er en-ord. På bokmål kan ei-ord også bruke «en» (en bok), men vi øver på «ei». <span class="zh">不确定时常常可以用 en。书面挪威语里 ei 名词也可以用 en，但我们练习用 ei。</span></div>

 <h2 style="margin-top:6mm">4 · Entall og flertall <span class="zh" style="font-size:12pt">单数和复数</span></h2>
 <div class="cols" style="grid-template-columns:1fr auto 1fr;gap:4mm">
  <div class="card" style="border-top:2.4mm solid ${COL.ue};text-align:center"><div style="font-size:34pt">🚗</div><b>entall</b> ${R('单数', 'dānshù')}<br><span class="big">en bil</span><br><span class="zh">一个</span></div>
  <div class="arrow">➜</div>
  <div class="card" style="border-top:2.4mm solid ${COL.uf};text-align:center"><div style="font-size:34pt">🚗🚗🚗</div><b>flertall</b> ${R('复数', 'fùshù')}<br><span class="big">biler</span><br><span class="zh">很多个</span></div>
 </div>
 <table><tr><th>Regel / 规则</th><th>Eksempel / 例子</th></tr>
  <tr><td>De fleste ord får <b>-er</b> <span class="zh">大多数加 -er</span></td><td>en bil → <b>biler</b> · ei jente → <b>jenter</b> · en hund → <b>hunder</b></td></tr>
  <tr><td>Noen ord får <b>ingenting</b> <span class="zh">有些不变</span></td><td>et hus → <b>hus</b> · et dyr → <b>dyr</b> · ei mus → <b>mus</b> · et barn → <b>barn</b></td></tr>
  <tr><td>Noen ord <b>endrer seg</b> <span class="zh">有些变化很大</span></td><td>en mann → <b>menn</b> · ei bok → <b>bøker</b> · et tre → <b>trær</b> · ei ku → <b>kyr</b> · en fot → <b>føtter</b></td></tr>
  <tr><td>Etter <b>to, tre, mange</b> <span class="zh">在……后面用复数</span></td><td>to <b>biler</b> · tre <b>hunder</b> · mange <b>barn</b></td></tr></table>
 ${foot(2)}
</div>

<!-- SIDE 3 -->
<div class="page">
 <h2>5 · Ubestemt og bestemt <span class="zh" style="font-size:12pt">不定和定指</span></h2>
 <div class="card" style="padding:2.5mm"><span class="no"><b>ubestemt</b> = vi vet <u>ikke</u> hvilken. En hvilken som helst. <b>bestemt</b> = vi vet <u>hvilken</u>. Den vi peker på.</span><br>
  <span class="zh"><b>不定</b> = 不知道是哪一个，随便哪一个。<b>定指</b> = 知道是哪一个，就是手指着的那一个。</span></div>
 <div class="cols c2" style="gap:4mm">
  <div><div style="background:${COL.ue};color:#fff;border-radius:3mm 3mm 0 0;padding:1.5mm 3mm;font-weight:900">ubestemt entall · 不定单数</div>${think(1, 'Jeg vil ha en hund.')}
   <div class="cap"><b>«en hund»</b> – en hvilken som helst<br><span class="zh">想要一只狗——哪只都行</span></div></div>
  <div><div style="background:${COL.be};color:#fff;border-radius:3mm 3mm 0 0;padding:1.5mm 3mm;font-weight:900">bestemt entall · 定指单数</div>${point(false, 'Den hunden er søt!', 'Hunden er søt.')}
   <div class="cap"><b>«hunden»</b> – den ene vi peker på<br><span class="zh">指着的那一只：那只狗真可爱！</span></div></div>
  <div><div style="background:${COL.uf};color:#fff;border-radius:3mm 3mm 0 0;padding:1.5mm 3mm;font-weight:900">ubestemt flertall · 不定复数</div>${think(3, 'Jeg vil ha hunder.')}
   <div class="cap"><b>«hunder»</b> – noen hunder, vi vet ikke hvilke<br><span class="zh">想要几只狗——哪些都行</span></div></div>
  <div><div style="background:${COL.bf};color:#fff;border-radius:3mm 3mm 0 0;padding:1.5mm 3mm;font-weight:900">bestemt flertall · 定指复数</div>${point(true, 'De hundene er søte!', 'Hundene er søte.')}
   <div class="cap"><b>«hundene»</b> – alle de vi peker på<br><span class="zh">指着的那几只：那些狗真可爱！</span></div></div>
 </div>
 <h2 style="margin-top:4mm">Slik lager vi bestemt form <span class="zh" style="font-size:12pt">怎样变成定指形式</span></h2>
 <table><tr><th>Ordet / 词</th><th>ubestemt → bestemt</th><th>flertall → bestemt flertall</th></tr>
  <tr><td>${art('en')}-ord &nbsp;<span class="zh">加 -en</span></td><td>en hund → hund<span class="ending" style="color:${COL.be}">en</span></td><td rowspan="3" style="vertical-align:middle">Husk: <b>-ene</b> (hund<b>ene</b>, bil<b>ene</b>, jent<b>ene</b>)<br><span class="zh">复数一般加 -ene。<br>特别：barn → barn<b>a</b></span></td></tr>
  <tr><td>${art('ei')}-ord &nbsp;<span class="zh">加 -a</span></td><td>ei jente → jent<span class="ending" style="color:${COL.be}">a</span></td></tr>
  <tr><td>${art('et')}-ord &nbsp;<span class="zh">加 -et</span></td><td>et hus → hus<span class="ending" style="color:${COL.be}">et</span></td></tr></table>
 ${foot(3)}
</div>

<!-- SIDE 4 -->
<div class="page">
 <h2>6 · De fire formene <span class="zh" style="font-size:12pt">四种形式——要记住它们的名字！</span></h2>
 <div class="cols c4">
  ${form('ue', 'ubestemt entall', '不定单数', 'bùdìng dānshù', 'en bil', '🚗', 'én – vi vet ikke hvilken', '一个，不知道哪个')}
  ${form('be', 'bestemt entall', '定指单数', 'dìngzhǐ dānshù', 'bil<span class="ending">en</span>', '🚗🎯', 'den ene vi vet om', '知道的那一个')}
  ${form('uf', 'ubestemt flertall', '不定复数', 'bùdìng fùshù', 'biler', '🚗🚗🚗', 'mange – vi vet ikke hvilke', '很多，不知道哪些')}
  ${form('bf', 'bestemt flertall', '定指复数', 'dìngzhǐ fùshù', 'bil<span class="ending">ene</span>', '🚗🚗🚗🎯', 'alle vi vet om', '知道的那些')}
 </div>
 <div class="card chant" style="margin-top:2mm">🎤 <span style="color:${COL.ue}">ubestemt entall</span> · <span style="color:${COL.be}">bestemt entall</span> · <span style="color:${COL.uf}">ubestemt flertall</span> · <span style="color:${COL.bf}">bestemt flertall</span></div>
 <table><tr><th>ubestemt entall</th><th>bestemt entall</th><th>ubestemt flertall</th><th>bestemt flertall</th><th>中文</th></tr>
  <tr><td>${art('en')} bil</td><td>bil<b>en</b></td><td>bil<b>er</b></td><td>bil<b>ene</b></td><td>汽车</td></tr>
  <tr><td>${art('ei')} jente</td><td>jent<b>a</b></td><td>jent<b>er</b></td><td>jent<b>ene</b></td><td>女孩</td></tr>
  <tr><td>${art('et')} hus</td><td>hus<b>et</b></td><td>hus</td><td>hus<b>ene</b></td><td>房子</td></tr>
  <tr><td>${art('et')} barn</td><td>barn<b>et</b></td><td>barn</td><td>barn<b>a</b></td><td>孩子</td></tr>
  <tr><td>${art('en')} mann</td><td>mann<b>en</b></td><td><b>menn</b></td><td><b>menn</b>ene</td><td>男人</td></tr>
  <tr><td>${art('ei')} bok</td><td>bok<b>a</b></td><td><b>bøker</b></td><td><b>bøkene</b></td><td>书</td></tr>
  <tr><td>${art('en')} hund</td><td>hund<b>en</b></td><td>hund<b>er</b></td><td>hund<b>ene</b></td><td>狗</td></tr></table>

 <h2 style="margin-top:4mm">7 · Finn substantivene <span class="zh" style="font-size:12pt">怎样找名词</span></h2>
 <div class="cols c3">
  <div class="card"><b>1️⃣ Les setningen</b><br><span class="zh">读句子</span></div>
  <div class="card"><b>2️⃣ Person, dyr, ting eller sted?</b><br><span class="zh">是人、动物、东西还是地方？</span></div>
  <div class="card"><b>3️⃣ Kan jeg si en, ei, et foran?</b><br><span class="zh">前面能加 en、ei、et 吗？</span></div>
 </div>
 <div class="card big" style="text-align:center">
  <span style="background:#bbf7d0;padding:0 2mm;border-radius:2mm">Jenta</span> leser en <span style="background:#bbf7d0;padding:0 2mm;border-radius:2mm">bok</span>.
  &nbsp; · &nbsp; <span style="background:#bbf7d0;padding:0 2mm;border-radius:2mm">Mia</span> bor i <span style="background:#bbf7d0;padding:0 2mm;border-radius:2mm">Oslo</span>.<br>
  <span class="zh" style="font-size:10pt;font-weight:600">绿色 = 名词（jenta = ei jente, bok = ei bok；Mia 和 Oslo 是专有名词，要大写）。leser 是动词。</span></div>
 ${foot(4)}
</div>

<!-- SIDE 5 -->
<div class="page">
 <h2>Begreper – ordliste <span class="zh" style="font-size:12pt">术语表</span></h2>
 <table><tr><th>Norsk</th><th>中文 + 拼音</th><th>Hva betyr det? / 意思</th><th>Eksempel</th></tr>
  <tr><td><b>substantiv</b></td><td>${R('名词', 'míngcí')}</td><td>person, dyr, ting, sted<br><span class="zh">人、动物、东西、地方</span></td><td>hund · jente · bil · skole</td></tr>
  <tr><td><b>verb</b></td><td>${R('动词', 'dòngcí')}</td><td>noe du gjør <span class="zh">做的事</span></td><td>løpe · spise</td></tr>
  <tr><td><b>adjektiv</b></td><td>${R('形容词', 'xíngróngcí')}</td><td>hvordan noe er <span class="zh">怎么样</span></td><td>stor · rød</td></tr>
  <tr><td><b>egennavn</b></td><td>${R('专有名词', 'zhuānyǒu míngcí')}</td><td>navn på bestemt person/sted – STOR bokstav<br><span class="zh">特定的人/地方的名字，要大写</span></td><td>Ola · Norge · Oslo</td></tr>
  <tr><td><b>stor / liten bokstav</b></td><td>${R('大写 / 小写', 'dàxiě / xiǎoxiě')}</td><td>A, B, C / a, b, c</td><td>Norge / mandag</td></tr>
  <tr><td><b>artikkel</b></td><td>${R('冠词', 'guàncí')}</td><td>en, ei, et <span class="zh">名词前的小词</span></td><td>en hund · ei jente · et hus</td></tr>
  <tr><td><b>en-ord / ei-ord / et-ord</b></td><td>en / ei / et ${R('名词', 'míngcí')}</td><td>blå / rosa / grønn <span class="zh">蓝 / 粉 / 绿</span></td><td>en bil · ei bok · et eple</td></tr>
  <tr><td><b>entall</b></td><td>${R('单数', 'dānshù')}</td><td>én <span class="zh">一个</span></td><td>en bil</td></tr>
  <tr><td><b>flertall</b></td><td>${R('复数', 'fùshù')}</td><td>mange <span class="zh">很多个</span></td><td>biler</td></tr>
  <tr><td><b>ubestemt</b></td><td>${R('不定', 'bùdìng')}</td><td>vi vet ikke hvilken <span class="zh">不知道是哪个</span></td><td>en bil · biler</td></tr>
  <tr><td><b>bestemt</b></td><td>${R('定指', 'dìngzhǐ')}</td><td>vi vet hvilken <span class="zh">知道是哪个</span></td><td>bilen · bilene</td></tr></table>

 <h2 style="margin-top:5mm">De fire formene i ett blikk <span class="zh" style="font-size:12pt">四种形式一览</span></h2>
 <div class="cols c2">
  <div class="card" style="--c:${COL.ue}"><b style="color:${COL.ue}">1 ubestemt entall</b> ${R('不定单数', 'bùdìng dānshù')}<br>«Jeg vil ha <u>en hund</u>.» 💭🐶</div>
  <div class="card"><b style="color:${COL.be}">2 bestemt entall</b> ${R('定指单数', 'dìngzhǐ dānshù')}<br>«<u>Hunden</u> er søt.» 👉🐶</div>
  <div class="card"><b style="color:${COL.uf}">3 ubestemt flertall</b> ${R('不定复数', 'bùdìng fùshù')}<br>«Jeg vil ha <u>hunder</u>.» 💭🐶🐶🐶</div>
  <div class="card"><b style="color:${COL.bf}">4 bestemt flertall</b> ${R('定指复数', 'dìngzhǐ fùshù')}<br>«<u>Hundene</u> er søte.» 👉🐶🐶🐶</div>
 </div>
 <div class="tip" style="font-size:12pt">⭐ <b>Husk / 记住：</b> Lær ordet <b>sammen med en, ei eller et</b>. Øv litt hver dag. Si det høyt! <span class="zh">单词要和 en/ei/et 一起记。每天练一点点。大声说出来！</span></div>
 ${foot(5)}
</div>
</body></html>`;
// rydd bort et feilplassert spørsmålstegn-eksempel
const out = html.replace('', '');
fs.writeFileSync(path.join(__dirname, 'oversikt.html'), out.replace(/\$\{COL\.bf\}/g, COL.bf));
(async () => {
  const { chromium } = require('/opt/node22/lib/node_modules/playwright');
  const b = await chromium.launch(); const pg = await b.newPage();
  await pg.goto('file://' + path.join(__dirname, 'oversikt.html'));
  await pg.pdf({ path: path.join(__dirname, 'substantiv-oversikt.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
  await b.close(); console.log('ok');
})();
