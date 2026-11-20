(function(){
'use strict';
const A = window.App;
const art = a => `<span class="art ${a}">${a}</span>`;
const bi = (no, zh) => `<span class="no">${no}</span> <span class="zh">${zh}</span>`;
const GC = {en:'#2563eb', ei:'#db2777', et:'#16a34a'};
const nonLit = a => a.m !== 'liten';

/* ordvalg: stokket med seed, brukes i rekkefølge så arkene får ulike ord */
function picker(list, seed){
  const rnd = A.seeded(seed), pool = list.map(w => [rnd(), w]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
  let i = 0;
  return n => { const out = []; for(let k = 0; k < n; k++) out.push(pool[i++ % pool.length]); return out; };
}
const header = (n, titleNo, titleZh, instrNo, instrZh) => `
  <div class="shead"><div class="stitle"><span class="num">${n}</span><div><h2>${titleNo}</h2><div class="zh">${titleZh}</div></div></div>
  <div class="who">Navn / 姓名: <span class="ln"></span> &nbsp; Dato / 日期: <span class="ln s"></span> &nbsp; ⭐⭐⭐</div></div>
  <div class="instr">✏️ ${instrNo}<br><span class="zh">${instrZh}</span></div>`;
const th = (no, zh, c) => `<th style="border-color:${c}"><b style="color:${c}">${no}</b><br><span class="z">${zh}</span></th>`;
const lead = a => `<td class="lead"><div class="lw"><span class="em">${a.emoji}</span><div><b>${a.m}</b><br><span class="zh sm">${a.zh}</span></div></div></td>`;
const fw = (key, v) => `<td class="wr">${key ? `<span class="ans">${v}</span>` : ''}</td>`;
const blank = (key, v, w) => `<span class="blank" style="min-width:${w || 20}mm">${key ? `<span class="ans">${v}</span>` : ''}</span>`;
const wrap = (key, inner) => `<section class="sheet ${key ? 'key' : 'sheetwrap'}">${inner}</section>`;
const tag = key => key ? '· FASIT' : '';
const tagZh = key => key ? '· 答案' : '';
const sg = (a, k) => k === 2 ? a.n : a.m;

/* 1: grunnform → et-form og flertall */
function sheetForms(as, key){
  return wrap(key, header(1, `Adjektivets former ${tag(key)}`, `形容词的形式 ${tagZh(key)}`, 'Grunnformen er gitt. Skriv et-formen og flertall.', '基本形式已经给出。写出 et 形式和复数形式。') +
   `<div class="ref"><b>Husk:</b> en/ei: <b>stor</b> &nbsp;·&nbsp; et: +t → <b>stort</b> &nbsp;·&nbsp; flertall: +e → <b>store</b> &nbsp;·&nbsp; <span class="zh">et 名词通常加 t，复数加 e。</span><br>
    <small>hvit → hvitt (+tt) · billig → billig (ingen endring) · grønn → grønt · gammel → gamle · blå → blå</small></div>
    <table class="gt"><tr><th class="lh">${bi('Adjektiv', '形容词')}<br><span class="z">en / ei</span></th>${th('et', '中性', GC.et)}${th('flertall', '复数', '#9333ea')}</tr>
    ${as.map(a => `<tr>${lead(a)}${fw(key, a.n)}${fw(key, a.pl)}</tr>`).join('')}</table>
    <div class="ref" style="margin-top:4mm"><b>Spesielt: liten</b> &nbsp; en <b>liten</b> hund · ei <b>lita</b> jente · et <b>lite</b> hus · <b>små</b> hunder · den/det <b>lille</b> huset <span class="zh">· liten 很特殊！</span></div>`);
}
/* 2: fyll inn riktig form */
function sheetFill(items, key){
  const cell = ([a, k, w]) => `<div class="ai"><span class="em">${w.emoji}</span><span>${art(['en', 'ei', 'et'][k])} ${blank(key, sg(a, k), 22)} <b>${w.no}</b></span><span class="zh sm">(${a.m})</span></div>`;
  return wrap(key, header(2, `Fyll inn riktig form ${tag(key)}`, `填上正确的形式 ${tagZh(key)}`, 'Skriv adjektivet i riktig form. Se på en, ei eller et!', '写出形容词的正确形式。看清是 en、ei 还是 et！') +
    `<div class="ref">${art('en')} <b>stor</b> &nbsp;·&nbsp; ${art('ei')} <b>stor</b> &nbsp;·&nbsp; ${art('et')} <b>stort</b> (+t) &nbsp;·&nbsp; <span class="zh">en 和 ei 用基本形式，et 加 t。</span></div>
    <div class="aigrid">${items.map(cell).join('')}</div>
    <div class="ref" style="margin-top:4mm">⭐ <b>Bonus:</b> Skriv tre setninger med adjektiv: <i>Jeg har et … hus.</i> / 用形容词写三个句子。<br><span class="ln full"></span><span class="ln full"></span><span class="ln full"></span></div>`);
}
/* 3: motsetninger */
function sheetOpp(as, key){
  const cell = a => `<div class="ai"><span class="em">${a.emoji}</span><b>${a.m}</b><span style="font-size:14pt">↔</span>${blank(key, a.opp, 30)}<span class="zh sm">${a.zh}</span></div>`;
  return wrap(key, header(3, `Motsetninger ${tag(key)}`, `反义词 ${tagZh(key)}`, 'Skriv ordet som betyr det motsatte.', '写出意思相反的词。') +
    `<div class="aigrid" style="grid-template-columns:1fr">${as.map(cell).join('')}</div>
    <div class="ref" style="margin-top:4mm"><b>Tips:</b> Lær ordene i par: stor ↔ liten, varm ↔ kald, ny ↔ gammel. <span class="zh">成对地学单词。</span></div>`);
}
/* 4: bestemt form */
function sheetDef(items, key){
  const cell = ([a, k, w]) => { const art_ = k === 2 ? 'det' : 'den'; return `<div class="ai"><span class="em">${w.emoji}</span><span><b>${art_}</b> ${blank(key, a.pl, 24)} <b>${w.be}</b></span><span class="zh sm">(${a.m})</span></div>`; };
  return wrap(key, header(4, `Bestemt form ${tag(key)}`, `定指形式 ${tagZh(key)}`, 'Skriv adjektivet i bestemt form: den / det + e-form + substantiv.', '写出形容词的定指形式：den / det + e 形式 + 名词。') +
    `<div class="ref"><b>den</b> store hunden (en/ei) &nbsp;·&nbsp; <b>det</b> store huset (et) &nbsp;·&nbsp; <b>de</b> store hundene (flertall)<br><span class="zh">en/ei 名词用 den，et 名词用 det，复数用 de。形容词用 e 形式。</span></div>
    <div class="aigrid">${items.map(cell).join('')}</div>
    <div class="ref" style="margin-top:4mm"><b>Skriv flertall:</b> <b>de</b> ___ ${blank(key, 'store', 24)} <span class="zh">hundene &nbsp;·&nbsp; de ___ (liten): </span> ${blank(key, 'små', 24)}</div>`);
}
/* 5: sammenligning */
function sheetCmp(as, sents, key){
  const rows = as.map(a => `<tr>${lead(a)}<td class="giv">${a.m}</td>${fw(key, a.cmp)}${fw(key, a.sup)}</tr>`).join('');
  const ss = sents.map(s => `<div class="ai"><span class="em">${s[0]}</span><span>${s[1].replace('___', blank(key, s[3], 26))}</span><span class="zh sm">(${s[2]})</span></div>`).join('');
  return wrap(key, header(5, `Sammenligning ${tag(key)}`, `比较 ${tagZh(key)}`, 'Skriv komparativ og superlativ. Fyll så inn i setningene.', '写出比较级和最高级。然后填空完成句子。') +
    `<div class="ref"><b>stor – større – størst</b> &nbsp;·&nbsp; +ere / +est &nbsp;·&nbsp; <b>god – bedre – best</b> · <b>liten – mindre – minst</b> &nbsp;·&nbsp; større <b>enn</b> · like stor <b>som</b></div>
    <table class="gt"><tr><th class="lh">${bi('Adjektiv', '形容词')}</th>${th('grunnform', '基本形式', '#2563eb')}${th('komparativ', '比较级', '#14b8a6')}${th('superlativ', '最高级', '#7c3aed')}</tr>${rows}</table>
    <div class="aigrid" style="grid-template-columns:1fr;margin-top:4mm">${ss}</div>`);
}
/* 6: sorter og skriv */
function sheetSort(as, key){
  const col = r => { const mine = as.filter(a => a.rule === r); const R = A.ADJ_RULES[r], lines = Math.max(5, mine.length);
    return `<div class="scol" style="border-color:${R.color}"><div class="sh" style="background:${R.color}">${R.no} <span class="zh">${R.zh}</span></div>
      ${Array.from({length:lines}, (_, i) => `<div class="sl">${key && mine[i] ? `<span class="ans">${mine[i].m} → ${mine[i].n}</span>` : ''}</div>`).join('')}</div>`; };
  return wrap(key, header(6, `Sorter og skriv et-formen ${tag(key)}`, `分类并写出 et 形式 ${tagZh(key)}`, 'Skriv hvert adjektiv i riktig kolonne. Skriv også et-formen: stor → stort.', '把每个形容词写进正确的一栏，并写出 et 形式：stor → stort。') +
    `<div class="wordbox">${as.map(a => `<span class="wb"><span class="em">${a.emoji}</span>${a.m}<small class="zh">${a.zh}</small></span>`).join('')}</div>
    <div class="scols">${col('t')}${col('tt')}${col('same')}</div>
    <div class="ref" style="margin-top:4mm"><b>Husk:</b> ${['t', 'tt', 'same'].map(r => `<b style="color:${A.ADJ_RULES[r].color}">${A.ADJ_RULES[r].no}</b>: ${A.ADJ_RULES[r].exNo}`).join(' &nbsp;·&nbsp; ')}</div>`);
}

A.AdjWorksheets = {
  build(level, seed){
    const pool = A.ADJ.filter(a => a.lvl <= level && nonLit(a));
    const pk = picker(pool, seed), pkOpp = picker(pool.filter(a => a.opp), seed + 3), pkCmp = picker(pool.filter(a => a.cmp && !/ /.test(a.cmp)), seed + 5), pkRule = picker(pool.filter(a => ['t', 'tt', 'same'].includes(a.rule)), seed + 9);
    const rnd = A.seeded(seed + 77);
    const mkItems = (n, ks) => pk(n).map(a => { const k = ks[Math.floor(rnd() * ks.length)]; return [a, k, A.ADJ_NOUN(a, k)]; });
    const forms = pk(8), fill = mkItems(14, [0, 1, 2]), opp = pkOpp(12), def = mkItems(10, [0, 2]), cmp = pkCmp(7);
    // sorteringsark: like mange av hver regel
    const sort = [].concat(...['t', 'tt', 'same'].map(r => pickN(pool.filter(a => a.rule === r), 4, seed + r.length)));
    const sents = [['🐘', 'Elefanten er ___ enn musa.', 'stor', 'større'], ['🚗', 'Bilen er ___ enn sykkelen.', 'rask', 'raskere'], ['🐘', 'Elefanten er ___ av alle dyr.', 'stor', 'størst'], ['👦', 'Ola er like ___ som Lars.', 'høy', 'høy']];
    const html = key => [sheetForms(forms, key), sheetFill(fill, key), sheetOpp(opp, key), sheetDef(def, key), sheetCmp(cmp, sents, key), sheetSort(sort, key)].join('');
    return {sheets:html(false), keys:html(true)};
  }
};
function pickN(list, n, seed){ const rnd = A.seeded(seed); return list.map(x => [rnd(), x]).sort((a, b) => a[0] - b[0]).slice(0, n).map(x => x[1]); }
})();
