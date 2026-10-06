(function(){
'use strict';
const A = window.App;
const FCOL = {ue:'#f97316', be:'#0d9488', uf:'#9333ea', bf:'#a16207'};
const GCOL = A.GEN;

const art = a => `<span class="art ${a}">${a}</span>`;
const bi = (no, zh) => `<span class="no">${no}</span> <span class="zh">${zh}</span>`;
const th = k => { const f = A.formMeta(k); return `<th style="border-color:${f.color}"><span class="fi">${A.formIcon(k, 34)}</span><b style="color:${f.color}">${f.no}</b><br><span class="z">${f.zh}</span></th>`; };

/* ordvalg: stokket med seed, brukes i rekkefølge så arkene får ulike ord */
function wordPicker(level, seed){
  const rnd = A.seeded(seed);
  const pool = A.WORDS.filter(w => w.lvl <= level).map(w => [rnd(), w]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
  let i = 0;
  return n => { const out = []; for(let k = 0; k < n; k++) out.push(pool[i++ % pool.length]); return out; };
}
const header = (n, titleNo, titleZh, instrNo, instrZh) => `
  <div class="shead"><div class="stitle"><span class="num">${n}</span><div><h2>${titleNo}</h2><div class="zh">${titleZh}</div></div></div>
  <div class="who">Navn / 姓名: <span class="ln"></span> &nbsp; Dato / 日期: <span class="ln s"></span> &nbsp; ⭐⭐⭐</div></div>
  <div class="instr">✏️ ${instrNo}<br><span class="zh">${instrZh}</span></div>`;

/* 1: bøy ordet. gitt: ubestemt entall. skriv: bestemt entall, ubestemt flertall, bestemt flertall */
function sheetBoy(ws, key){
  const rows = ws.map(w => `<tr><td class="lead"><div class="lw"><span class="em">${w.emoji}</span><div><b>${art(w.art)} ${w.no}</b><br><span class="zh sm">${w.zh}</span></div></div></td>
    ${['be', 'uf', 'bf'].map(k => `<td class="wr">${key ? `<span class="ans">${w[k]}</span>` : ''}</td>`).join('')}</tr>`).join('');
  return `<section class="sheet ${key ? 'key' : 'sheetwrap'}">${header(1, `Bøying 1 ${key ? '· FASIT' : ''}`, `变形练习 1 ${key ? '· 答案' : ''}`,
    'Skriv de tre formene. Første ord er gitt.', '写出另外三种形式。第一个词已经给出。')}
    <div class="ref"><b>Husk:</b> bestemt entall: ${art('en')} +<b>en</b> &nbsp; ${art('ei')} +<b>a</b> &nbsp; ${art('et')} +<b>et</b> &nbsp;·&nbsp; flertall: +<b>er</b> (eller ingenting / spesielt) &nbsp;·&nbsp; bestemt flertall: +<b>ene</b></div>
    <table class="gt"><tr><th class="lh">${bi('Ord', '单词')}<br><span class="z">ubestemt entall 不定单数</span></th>${th('be')}${th('uf')}${th('bf')}</tr>${rows}</table></section>`;
}
/* 2: ett felt er gitt (tilfeldig form), skriv de tre andre */
function sheetMix(ws, key, rnd){
  const rows = ws.map(w => { const g = ['ue', 'be', 'uf', 'bf'][Math.floor(rnd() * 4)];
    return `<tr><td class="lead"><div class="lw"><span class="em">${w.emoji}</span><div><span class="zh sm">${w.zh}</span></div></div></td>
    ${['ue', 'be', 'uf', 'bf'].map(k => k === g ? `<td class="giv">${A.label(w, k)}</td>` : `<td class="wr">${key ? `<span class="ans">${A.label(w, k)}</span>` : ''}</td>`).join('')}</tr>`; }).join('');
  return `<section class="sheet ${key ? 'key' : 'sheetwrap'}">${header(2, `Bøying 2 – finn formene ${key ? '· FASIT' : ''}`, `变形练习 2 ——找出其他形式 ${key ? '· 答案' : ''}`,
    'Ett ord i hver rad er gitt (grått felt). Skriv de tre andre formene. Husk en / ei / et i ubestemt entall!', '每一行有一个格子已经写好（灰色）。写出另外三种形式。不定单数要写 en / ei / et！')}
    <table class="gt"><tr><th class="lh">${bi('Bilde', '图片')}</th>${th('ue')}${th('be')}${th('uf')}${th('bf')}</tr>${rows}</table>
    <div class="ref" style="margin-top:4mm"><b>Tips:</b> Si formene høyt: <i>ubestemt entall · bestemt entall · ubestemt flertall · bestemt flertall</i>. <span class="zh">大声读出四种形式的名字。</span></div></section>`;
}
/* 3: skriv en / ei / et */
function sheetArt(ws, key){
  const cell = w => `<div class="ai"><span class="em">${w.emoji}</span><span class="blank">${key ? `<span class="ans">${w.art}</span>` : ''}</span><b>${w.no}</b><span class="zh sm">${w.zh}</span></div>`;
  return `<section class="sheet ${key ? 'key' : 'sheetwrap'}">${header(3, `en, ei eller et? ${key ? '· FASIT' : ''}`, `en、ei 还是 et？ ${key ? '· 答案' : ''}`,
    'Skriv en, ei eller et foran ordet. Bruk fargene som hjelp.', '在词前面写上 en、ei 或 et。可以用颜色帮助记忆。')}
    <div class="ref">${art('en')} <b>en</b> hankjønn 阳性 &nbsp;·&nbsp; ${art('ei')} <b>ei</b> hunkjønn 阴性 &nbsp;·&nbsp; ${art('et')} <b>et</b> intetkjønn 中性 &nbsp;·&nbsp; <span class="zh">记单词时要连同 en/ei/et 一起记</span></div>
    <div class="aigrid">${ws.map(cell).join('')}</div>
    <div class="ref" style="margin-top:4mm">⭐ <b>Bonus:</b> Velg tre ord og skriv en hel setning. / 选三个词，各写一个完整的句子。<br><span class="ln full"></span><span class="ln full"></span><span class="ln full"></span></div></section>`;
}
/* 4: sorter i tre kolonner */
function sheetSort(ws, key){
  const col = a => { const mine = ws.filter(w => w.art === a); const lines = Math.max(6, mine.length);
    return `<div class="scol" style="border-color:${GCOL[a].color}"><div class="sh" style="background:${GCOL[a].color}">${a}-ord <span class="zh">${GCOL[a].zh}</span></div>
      ${Array.from({length: lines}, (_, i) => `<div class="sl">${key && mine[i] ? `<span class="ans">${a} ${mine[i].no}</span>` : ''}</div>`).join('')}</div>`; };
  return `<section class="sheet ${key ? 'key' : 'sheetwrap'}">${header(4, `Sorter ordene ${key ? '· FASIT' : ''}`, `给单词分类 ${key ? '· 答案' : ''}`,
    'Skriv hvert ord i riktig kolonne: en-ord, ei-ord eller et-ord. Skriv med en / ei / et foran.', '把每个词写进正确的一栏：en 名词、ei 名词或 et 名词。写的时候要带上 en / ei / et。')}
    <div class="wordbox">${ws.map(w => `<span class="wb"><span class="em">${w.emoji}</span>${w.no}<small class="zh">${w.zh}</small></span>`).join('')}</div>
    <div class="scols">${col('en')}${col('ei')}${col('et')}</div>
    <div class="ref" style="margin-top:4mm"><b>Husk:</b> På bokmål kan ei-ord også ha «en», men vi øver på «ei». <span class="zh">书面挪威语里 ei 名词也可以用 en，但我们练习用 ei。</span></div></section>`;
}

A.Worksheets = {
  build(level, seed){
    const pick = wordPicker(level, seed), rnd = A.seeded(seed + 77);
    // samme ord i ark og fasit: lag ordlister først
    const lists = {}, mk = (name, n) => lists[name] = pick(n);
    const l1 = mk('boy', 8), l2 = mk('mix', 8), l3 = mk('art', 20), l4 = mk('sort', 12);
    const gs = Array.from({length: 8}, () => Math.floor(rnd() * 4));
    const use = list => () => list.slice();
    const mixRnd = () => { let i = 0; return () => gs[i++ % 8] / 4 + 0.01; };
    const sheets = [
      [sheetBoy, use(l1), null], [sheetMix, use(l2), mixRnd], [sheetArt, use(l3), null], [sheetSort, use(l4), null]
    ];
    const html = key => sheets.map(([fn, p, r]) => fn(p(), key, r ? r() : undefined)).join('');
    return {sheets:html(false), keys:html(true)};
  }
};
})();
