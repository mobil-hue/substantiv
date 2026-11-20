(function(){
'use strict';
const A = window.App, Ex = A.Ex;
const {bi, shuffle, sample, pick, uniq} = A;
const Q = Ex.Q, FB = Ex.FB, def = Ex.def;
const AD = A.ADJ, WS = A.WORDS;

const choice = (id, lvl, mod, make, extra) => Object.assign({id, kind:'choice', lvl, mod, make}, extra || {});
const typed = (id, lvl, mod, make, extra) => Object.assign({id, kind:'type', lvl, mod, make}, extra || {});
const bigw = (h, sm) => `<div class="bigword ${sm ? 'sm' : ''}">${h}</div>`;
const gloss = z => `<div class="gloss zh">${z}</div>`;
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const unc = (a, ex) => { const s = new Set(ex); return a.filter(x => !s.has(x)); };
const chip = (a, big) => `<span class="chip" style="--c:#16a34a;${big ? 'font-size:1.5rem' : ''}">${a.emoji} ${a.m}</span>`;
const blank = '<span class="blank-adj" style="display:inline-block;min-width:3.2em;border-bottom:4px solid #16a34a;margin:0 4px">&nbsp;</span>';
const artOf = k => ['en', 'ei', 'et'][k];

/* ---------- former ---------- */
const isLit = a => a.m === 'liten';
const sgForm = (a, k) => k === 2 ? a.n : (k === 1 && isLit(a) ? 'lita' : a.m);     // k: 0 en, 1 ei, 2 et
const sgOk = (a, k) => k === 1 && isLit(a) ? ['lita', 'liten'] : [sgForm(a, k)];       // godtatte svar
const plForm = a => a.pl;
const defSg = a => isLit(a) ? 'lille' : a.pl;
const defPl = a => a.pl;
const nounOf = (a, k) => A.ADJ_NOUN(a, k);
const wrongPool = a => uniq([a.m, a.n, a.pl, a.m + 't', a.m + 'e', a.m + 'et'].concat(isLit(a) ? ['lita', 'lille'] : []));
// 4 alternativer: riktig + 3 gale. «ok» = former som også er riktige og derfor ikke skal være med som gale svar
function opts4(a, correct, ok){
  const bad = new Set([correct].concat(ok || []));
  const pool = shuffle(wrongPool(a).filter(x => !bad.has(x))).slice(0, 3);
  return shuffle([correct].concat(pool)).map(v => ({html:`<span style="font-size:1.5rem;font-weight:800">${v}</span>`, value:v}));
}
const ruleNote = a => {
  if(isLit(a)) return ['«liten» er spesiell: en liten · ei lita · et lite · små.', '[liten]很特殊：[en liten] · [ei lita] · [et lite] · [små]。'];
  if(a.rule === 'same') return [`«${a.m}» får ikke -t: et ${a.n} …`, `[${a.m}]在 et 名词前不加 t：[et ${a.n}] …`];
  if(a.rule === 'tt') return [`${a.m} → ${a.n} (to t-er).`, `[${a.m}] → [${a.n}]（t 要双写）。`];
  if(/(nn|ll|kk|gg|mm)$/.test(a.m)) return [`${a.m} → ${a.n} (+t, og den doble konsonanten blir enkel).`, `[${a.m}] → [${a.n}]（加 t，双写的辅音变成一个）。`];
  return [`${a.m} → ${a.n} (+t).`, `[${a.m}] → [${a.n}]（加 t）。`];
};
const plNote = a => {
  if(isLit(a)) return ['«liten» blir «små» i flertall.', '[liten]的复数是[små]。'];
  if(a.m === a.pl) return [`«${a.m}» får ikke -e i flertall.`, `[${a.m}]的复数不加 e。`];
  if(['gammel', 'åpen', 'sulten', 'vakker'].includes(a.m)) return [`${a.m} → ${a.pl} (e-en forsvinner).`, `[${a.m}] → [${a.pl}]（e 要去掉）。`];
  if(/m$/.test(a.m) && a.pl === a.m + 'me') return [`${a.m} → ${a.pl} (m-en dobles).`, `[${a.m}] → [${a.pl}]（m 要双写）。`];
  return [`${a.m} → ${a.pl} (+e).`, `[${a.m}] → [${a.pl}]（加 e）。`];
};
const sentVisual = (w, html, a) => `<div><div class="big-emoji">${w.emoji}</div>${bigw(html)}<div style="margin-top:6px">${chip(a)} <span class="gloss zh" style="display:inline">${a.zh}</span></div></div>`;

/* ---------- modul 0: hvorfor ---------- */
def('aj_why', () => {
  const L = [
    ['Hva gjør adjektiv med språket vårt?','形容词让我们的语言发生什么变化？',
      [['De gjør det mer fargerikt og nøyaktig','让语言更丰富、更准确'],['De gjør setningene kortere','让句子变短'],['Ingenting','什么也没有']],
      'Med adjektiv kan du fortelle hvordan noe er: stor, rød, varm, glad.','用形容词可以说明事物怎么样：大的、红的、热的、开心的。'],
    ['«Jeg vil ha et eple.» Hva hvis du vil ha et RØDT eple?','[Jeg vil ha et eple.] 如果你想要一个红色的苹果呢？',
      [['Da bruker du adjektivet «rødt»','那就用形容词 [rødt]'],['Da bruker du verbet «rød»','那就用动词 [rød]'],['Da trenger du ikke si noe mer','那就不用多说了']],
      '«Et rødt eple» – adjektivet sier hvilket eple du mener.','[et rødt eple]——形容词说明你要的是哪个苹果。'],
    ['Hva er et adjektiv?','什么是形容词？',
      [['Et ord som sier hvordan noe er','说明事物怎么样的词'],['Et ord for noe du gjør','表示做什么事的词'],['Et navn på en person eller en ting','人或东西的名字']],
      'Adjektiv = hvordan noe er.','形容词 = 事物怎么样。'],
    ['Hva skjer med adjektivet på norsk?','在挪威语里，形容词会怎么样？',
      [['Det retter seg etter substantivet','会跟着名词变化'],['Det er alltid likt','永远不变'],['Det forsvinner','消失']],
      'en stor hund · et stort hus · store hunder – adjektivet endrer seg!','[en stor hund] · [et stort hus] · [store hunder]——形容词会变化！'],
    ['Hvilken setning høres riktig ut?','哪句话听起来是对的？',
      [['Jeg har et stort hus.','Jeg har et stort hus.'],['Jeg har et stor hus.','Jeg har et stor hus.'],['Jeg har et store hus.','Jeg har et store hus.']],
      'Et-ord får et-form: «et stort hus».','et 名词要用 et 形式：[et stort hus]。'],
    ['Hva hjelper deg å lære adjektiv?','什么能帮你学好形容词？',
      [['Å øve litt hver dag og lære motsetninger','每天练一点，学反义词'],['Å vente til i morgen','等到明天'],['Å aldri gjenta','从不复习']],
      'Litt hver dag – og lær ordene i par: stor og liten, varm og kald.','每天一点点——成对地学：stor 和 liten、varm 和 kald。']
  ];
  return L.map((q, i) => choice('aj_why:' + i, 0, 0, () => ({
    q:Q(q[0], q[1]), say:Q(q[0], q[1]), layout:'col',
    options:shuffle(q[2].map((o, k) => ({html:bi(o[0], o[1]), value:k}))), answer:0, fb:FB(q[3], q[4])
  })));
});

/* ---------- modul 1: hva er et adjektiv ---------- */
def('aj_isadj', () => {
  const mk = (word, zh, isAdj, fbNo, fbZh, id, lvl) => choice('aj_isadj:' + id, lvl, 1, () => ({
    q:Q('Er dette et adjektiv?', '这是形容词吗？'), say:Q('Er dette et adjektiv?', '这是形容词吗？'), word, visual:`<div>${bigw(word)}${gloss(zh)}</div>`, layout:'row',
    options:[{html:bi('Ja', '是'), value:'y'}, {html:bi('Nei', '不是'), value:'n'}], answer:isAdj ? 'y' : 'n', fb:FB(fbNo, fbZh), sayAfter:word}), {});
  const out = AD.filter(a => a.lvl <= 2).map(a => mk(a.m, a.zh, true, `«${a.m}» er et adjektiv. Det sier hvordan noe er.`, `[${a.m}]是形容词。它说明事物怎么样。`, a.m, a.lvl));
  A.ADJ_NONADJ.forEach(n => { const k = n.kind === 'verb' ? ['et verb', '动词', 'Det er noe du gjør.', '它表示做什么事。'] : n.kind === 'substantiv' ? ['et substantiv', '名词', 'Det er navnet på en ting, et dyr, en person eller et sted.', '它是东西、动物、人或地方的名字。'] : ['ikke et adjektiv', '不是形容词', 'Det sier ikke hvordan noe er.', '它不说明事物怎么样。'];
    out.push(mk(n.no, n.zh, false, `«${n.no}» er ${k[0]}. ${k[2]}`, `[${n.no}]是${k[1]}。${k[3]}`, n.no, 1)); });
  return out;
});
def('aj_kind', () => {
  const opts = [['substantiv', '名词'], ['verb', '动词'], ['adjektiv', '形容词']];
  const mk = (word, zh, ans, fbNo, fbZh, id, lvl) => choice('aj_kind:' + id, lvl, 1, () => ({
    q:Q('Hva slags ord er dette?', '这是什么词？'), say:Q('Hva slags ord er dette?', '这是什么词？'), word, visual:`<div>${bigw(word)}${gloss(zh)}</div>`, layout:'row',
    options:shuffle(opts.map(o => ({html:bi(o[0], o[1]), value:o[0]}))), answer:ans, fb:FB(fbNo, fbZh), sayAfter:word}));
  const out = AD.filter(a => a.lvl <= 2).map(a => mk(a.m, a.zh, 'adjektiv', `«${a.m}» er et adjektiv. Det sier hvordan noe er.`, `[${a.m}]是形容词。它说明事物怎么样。`, a.m, a.lvl));
  A.ADJ_NONADJ.filter(n => n.kind !== 'annet').forEach(n => { const v = n.kind === 'verb';
    out.push(mk(n.no, n.zh, n.kind, v ? `«${n.no}» er et verb. Det er noe du gjør.` : `«${n.no}» er et substantiv. Det er navnet på noe.`, v ? `[${n.no}]是动词。它表示做什么事。` : `[${n.no}]是名词。它是某样东西的名字。`, n.no, 1)); });
  return out;
});
def('aj_cat', () => AD.map(a => choice('aj_cat:' + a.m, a.lvl, 1, () => {
  const c = A.ADJ_CATS[a.cat];
  return {q:Q('Hva slags adjektiv er dette?', '这是哪一类形容词？'), say:Q('Hva slags adjektiv er dette?', '这是哪一类形容词？'), word:a.m,
    visual:`<div><div class="big-emoji">${a.emoji}</div>${bigw(a.m)}${gloss(a.zh)}</div>`, layout:'grid',
    options:Object.keys(A.ADJ_CATS).map(k => ({html:`<span>${A.ADJ_CATS[k].emoji} ${bi(A.ADJ_CATS[k].no, A.ADJ_CATS[k].zh)}</span>`, value:k})), answer:a.cat,
    fb:FB(`«${a.m}» sier noe om ${c.no}.`, `[${a.m}]说明的是${c.zh}。`), sayAfter:a.m};
})));
def('aj_zh', () => { const out = [];
  AD.forEach(a => {
    out.push(choice('aj_zh2no:' + a.m, a.lvl, 1, () => ({
      q:Q('Hva heter dette på norsk?', '这个用挪威语怎么说？'), say:Q('Hva heter dette på norsk?', '这个用挪威语怎么说？'),
      visual:`<div><div class="big-emoji">${a.emoji}</div><div class="bigword sm">${a.zh}</div></div>`, layout:'row',
      options:shuffle([a].concat(sample(unc(AD, [a]), 3))).map(x => ({html:`<span>${x.m}</span>`, value:x.m})), answer:a.m,
      fb:FB(`${a.m} = ${a.zh} ${a.emoji}`, `${a.zh} = [${a.m}] ${a.emoji}`), sayAfter:a.m}), {zhOnly:true}));
    out.push(choice('aj_no2zh:' + a.m, a.lvl, 1, () => ({
      q:Q('Hva betyr dette på kinesisk?', '这个中文是什么意思？'), say:Q('Hva betyr dette på kinesisk?', '这个中文是什么意思？'), word:a.m,
      visual:`<div class="bigword">${a.m}</div>`, layout:'row',
      options:shuffle([a].concat(sample(unc(AD, [a]), 3))).map(x => ({html:`<span>${x.zh}</span>`, value:x.m})), answer:a.m,
      fb:FB(`${a.m} = ${a.zh} ${a.emoji}`, `[${a.m}] = ${a.zh} ${a.emoji}`), sayAfter:a.m}), {zhOnly:true}));
  });
  return out; });
def('aj_listen', () => AD.map(a => choice('aj_listen:' + a.m, a.lvl, 1, () => ({
  q:Q('Hør og velg riktig bilde.', '听一听，选出正确的图片。'), say:Q('Hør og velg riktig bilde.', '听一听，选出正确的图片。'), listen:a.m,
  visual:`<div class="big-emoji">👂</div>`, layout:'grid',
  options:shuffle([a].concat(sample(AD.filter(x => x !== a && x.emoji !== a.emoji && x.cat === a.cat).concat(sample(AD.filter(x => x.cat !== a.cat), 3)).slice(0, 3), 3))).map(x => ({html:`<span class="em">${x.emoji}</span>`, value:x.m})), answer:a.m,
  fb:FB(`Det var «${a.m}» ${a.emoji}`, `刚才是[${a.m}] ${a.emoji}（${a.zh}）`), sayAfter:a.m}), {speech:true})));
def('aj_sent', () => { const out = [];
  A.ADJ_SENTENCES.forEach(s => {
    const toks = A.parseMarked(s.no).filter(t => t.word);
    toks.filter(t => t.mark).forEach((adjT, ai) => out.push(choice(`aj_sent:${s.id}:${ai}`, s.lvl, 1, () => {
      const others = toks.filter(t => !t.mark);
      const set = shuffle([adjT].concat(sample(others, Math.min(3, others.length))));
      return {q:Q('Hvilket ord er et adjektiv?', '哪个词是形容词？'), say:Q('Hvilket ord er et adjektiv?', '哪个词是形容词？'),
        visual:`<div><div class="bigword sm">${A.plain(s.no)}</div>${gloss(s.zh)}</div>`, layout:'row',
        options:set.map(t => ({html:`<span style="font-size:1.3rem">${t.t}</span>`, value:t.t})), answer:adjT.t,
        fb:FB(`«${adjT.t}» sier hvordan noe er. Det er et adjektiv.`, `[${adjT.t}]说明事物怎么样。它是形容词。`), sayAfter:A.plain(s.no)};
    })));
  });
  return out; });

/* ---------- modul 2: motsetninger ---------- */
const OPPS = () => AD.filter(a => a.opp);
const oppZh = m => A.adjZh(m);
def('aj_opp', () => OPPS().map(a => choice('aj_opp:' + a.m, a.lvl, 2, () => {
  const okOpp = A.adjOpps(a), notOk = x => x.m !== a.m && !okOpp.includes(x.m) && !okOpp.includes(x.opp) && x.opp !== a.m;
  const d = uniq(sample(AD.filter(x => notOk(x) && x.cat === a.cat), 2).concat(shuffle(AD.filter(notOk)))).slice(0, 3);
  const oe = A.adj(a.opp) ? A.adj(a.opp).emoji : '';
  return {q:Q(`Hva er motsetningen til «${a.m}»?`, `[${a.m}]的反义词是什么？`), say:Q(`Hva er motsetningen til ${a.m}?`, `[${a.m}]的反义词是什么？`), word:a.m,
    visual:`<div><div class="big-emoji">${a.emoji}</div>${bigw(a.m)}${gloss(a.zh)}</div>`, layout:'grid',
    options:shuffle([a.opp].concat(d.map(x => x.m))).map(m => ({html:`<span><b>${m}</b><div class="gloss zh">${oppZh(m)}</div></span>`, value:m})), answer:a.opp,
    fb:FB(`${a.m} ↔ ${a.opp}. ${cap(a.m)} er det motsatte av ${a.opp}.`, `[${a.m}] ↔ [${a.opp}]（${a.zh} ↔ ${oppZh(a.opp)}）。它们是反义词。`), sayAfter:`${a.m}. ${a.opp}`};
})));
def('aj_oppType', () => OPPS().map(a => typed('aj_oppType:' + a.m, a.lvl, 2, () => ({
  q:Q('Skriv motsetningen.', '写出反义词。'), say:Q('Skriv motsetningen.', '写出反义词。'), word:a.m,
  visual:`<div><div class="big-emoji">${a.emoji}</div>${bigw(a.m)}<div class="arrow">↔</div>${bigw('?')}${gloss(`${a.zh} ↔ ?`)}</div>`,
  listen:a.m, answers:A.adjOpps(a), ph:'…', fb:FB(`${a.m} ↔ ${a.opp}`, `[${a.m}] ↔ [${a.opp}]（${a.zh} ↔ ${oppZh(a.opp)}）`), sayAfter:a.opp
}))));
def('aj_pic', () => AD.filter(a => a.cat !== 'farge' || a.lvl <= 1).map(a => choice('aj_pic:' + a.m, a.lvl, 2, () => {
  const w = nounOf(a, 0);
  const same = AD.filter(x => x.m !== a.m && x.cat === a.cat && x.m !== a.opp);
  const d = sample(same.length >= 3 ? same : same.concat(AD.filter(x => x.cat !== a.cat)), 3);
  return {q:Q('Hvilket adjektiv passer til bildet?', '哪个形容词和图片相配？'), say:Q('Hvilket adjektiv passer til bildet?', '哪个形容词和图片相配？'),
    visual:`<div><div style="font-size:4.2rem">${a.emoji}</div>${gloss(a.zh)}</div>`, layout:'grid',
    options:shuffle([a].concat(d)).map(x => ({html:`<span><b>${x.m}</b></span>`, value:x.m})), answer:a.m,
    fb:FB(`${a.emoji} = ${a.m}`, `${a.emoji} = [${a.m}]（${a.zh}）`), sayAfter:a.m};
})));

/* ---------- modul 3: en, ei, et ---------- */
def('aj_gender', () => { const out = [];
  AD.forEach(a => [0, 1, 2].forEach(k => out.push(choice(`aj_gender:${a.m}:${k}`, a.lvl, 3, () => {
    const w = nounOf(a, k), ans = sgForm(a, k), nt = k === 2 ? ruleNote(a) : (isLit(a) ? ruleNote(a) : [`${cap(artOf(k))}-ord bruker grunnformen: ${artOf(k)} ${a.m} ${w.no}.`, `[${artOf(k)}]名词用基本形式：[${artOf(k)} ${a.m} ${w.no}]。`]);
    return {q:Q('Velg riktig form av adjektivet.', '选出形容词的正确形式。'), say:Q('Velg riktig form av adjektivet.', '选出形容词的正确形式。'), word:`${artOf(k)} ${ans} ${w.no}`,
      visual:sentVisual(w, `${A.artChip(artOf(k))} ${blank} ${w.no}`, a), layout:'row', options:opts4(a, ans, sgOk(a, k)), answer:ans,
      fb:FB(`${artOf(k)} ${ans} ${w.no}. ${nt[0]}`, `[${artOf(k)} ${ans} ${w.no}]。${nt[1]}`), sayAfter:`${artOf(k)} ${ans} ${w.no}`};
  }))));
  return out; });
def('aj_genderType', () => { const out = [];
  AD.forEach(a => [0, 1, 2].forEach(k => out.push(typed(`aj_genderT:${a.m}:${k}`, a.lvl, 3, () => {
    const w = nounOf(a, k), ans = sgForm(a, k), nt = ruleNote(a);
    return {q:Q('Skriv adjektivet i riktig form.', '写出形容词的正确形式。'), say:Q('Skriv adjektivet i riktig form.', '写出形容词的正确形式。'), word:`${artOf(k)} ${ans} ${w.no}`,
      visual:sentVisual(w, `${A.artChip(artOf(k))} ${blank} ${w.no}`, a), listen:`${artOf(k)} ${ans} ${w.no}`, answers:sgOk(a, k), ph:'…',
      fb:FB(`${artOf(k)} ${ans} ${w.no}. ${nt[0]}`, `[${artOf(k)} ${ans} ${w.no}]。${nt[1]}`), sayAfter:`${artOf(k)} ${ans} ${w.no}`};
  }))));
  return out; });
def('aj_rule', () => AD.filter(a => ['t', 'tt', 'same'].includes(a.rule)).map(a => choice('aj_rule:' + a.m, a.lvl, 3, () => {
  const r = A.ADJ_RULES[a.rule], w = nounOf(a, 2);
  return {q:Q('Hva skjer med adjektivet foran et-ord?', '形容词用在 et 名词前面时会怎样？'), say:Q('Hva skjer med adjektivet foran et-ord?', '形容词用在 et 名词前面时会怎样？'), word:a.m,
    visual:`<div>${chip(a, true)}${bigw(`en ${a.m} ${nounOf(a, 0).no} → et ___ ${w.no}`, true)}</div>`, layout:'col',
    options:Object.keys(A.ADJ_RULES).map(k => ({html:`<span>${bi(A.ADJ_RULES[k].no, A.ADJ_RULES[k].zh)}</span>`, value:k})), answer:a.rule,
    fb:FB(`et ${a.n} ${w.no}. ${ruleNote(a)[0]}`, `[et ${a.n} ${w.no}]。${ruleNote(a)[1]}`), sayAfter:`et ${a.n} ${w.no}`};
})));

/* ---------- modul 4: flertall og bestemt form ---------- */
def('aj_pl', () => AD.map(a => choice('aj_pl:' + a.m, a.lvl, 4, () => {
  const k = (a.i % 3), w = nounOf(a, k), ans = plForm(a), nt = plNote(a);
  return {q:Q('Velg riktig form: flertall.', '选出正确的形式：复数。'), say:Q('Velg riktig form: flertall.', '选出正确的形式：复数。'), word:`${ans} ${w.uf}`,
    visual:sentVisual(w, `${blank} ${w.uf}`, a), layout:'row', options:opts4(a, ans, []), answer:ans,
    fb:FB(`${ans} ${w.uf}. ${nt[0]}`, `[${ans} ${w.uf}]。${nt[1]}`), sayAfter:`${ans} ${w.uf}`};
})));
def('aj_plType', () => AD.map(a => typed('aj_plType:' + a.m, a.lvl, 4, () => {
  const k = (a.i % 3), w = nounOf(a, k), ans = plForm(a), nt = plNote(a);
  return {q:Q('Skriv adjektivet i flertall.', '写出形容词的复数形式。'), say:Q('Skriv adjektivet i flertall.', '写出形容词的复数形式。'), word:`${ans} ${w.uf}`,
    visual:sentVisual(w, `${blank} ${w.uf}`, a), listen:`${ans} ${w.uf}`, answers:[ans], ph:'…',
    fb:FB(`${ans} ${w.uf}. ${nt[0]}`, `[${ans} ${w.uf}]。${nt[1]}`), sayAfter:`${ans} ${w.uf}`};
})));
def('aj_sing', () => { const out = [];
  AD.forEach(a => [0, 2].forEach(k => out.push(choice(`aj_sing:${a.m}:${k}`, a.lvl, 4, () => {
    const w = nounOf(a, k), pl = k === 1;
    const phrase = [`${artOf(k)} ${sgForm(a, k)} ${w.no}`, `${plForm(a)} ${w.uf}`], sh = shuffle([0, 1]);
    return {q:Q('Hva er flertall? Velg frasen med flertall.', '哪个是复数？选出复数的短语。'), say:Q('Hva er flertall?', '哪个是复数？'),
      visual:`<div class="big-emoji">${w.emoji}</div>`, layout:'row', options:sh.map(i => ({html:`<span style="font-size:1.4rem;font-weight:800">${phrase[i]}</span>`, value:String(i)})), answer:'1',
      fb:FB(`«${phrase[1]}» er flertall. «${phrase[0]}» er entall.`, `[${phrase[1]}]是复数。[${phrase[0]}]是单数。`), sayAfter:phrase[1]};
  }))));
  return out; });
def('aj_def', () => { const out = [];
  AD.forEach(a => [0, 2].forEach(k => out.push(choice(`aj_def:${a.m}:${k}`, a.lvl, 4, () => {
    const w = nounOf(a, k), art = k === 2 ? 'det' : 'den', ans = defSg(a);
    return {q:Q('Velg riktig form i bestemt form.', '选出定指形式里的正确形式。'), say:Q('Velg riktig form i bestemt form.', '选出定指形式里的正确形式。'), word:`${art} ${ans} ${w.be}`,
      visual:sentVisual(w, `${art} ${blank} ${w.be}`, a), layout:'row', options:opts4(a, ans, []), answer:ans,
      fb:FB(`${art} ${ans} ${w.be}. Etter den/det/de bruker vi ${isLit(a) ? '«lille»' : 'e-formen'}.`, `[${art} ${ans} ${w.be}]。在 den/det/de 后面用${isLit(a) ? '[lille]' : ' e 形式'}。`), sayAfter:`${art} ${ans} ${w.be}`};
  }))));
  return out; });
def('aj_defType', () => { const out = [];
  AD.forEach(a => [0, 2].forEach(k => out.push(typed(`aj_defT:${a.m}:${k}`, a.lvl, 4, () => {
    const w = nounOf(a, k), art = k === 2 ? 'det' : 'den', ans = defSg(a);
    return {q:Q('Skriv adjektivet i bestemt form.', '写出形容词的定指形式。'), say:Q('Skriv adjektivet i bestemt form.', '写出形容词的定指形式。'), word:`${art} ${ans} ${w.be}`,
      visual:sentVisual(w, `${art} ${blank} ${w.be}`, a), listen:`${art} ${ans} ${w.be}`, answers:[ans], ph:'…',
      fb:FB(`${art} ${ans} ${w.be}.`, `[${art} ${ans} ${w.be}]。`), sayAfter:`${art} ${ans} ${w.be}`};
  }))));
  return out; });
def('aj_denDetDe', () => { const out = [];
  AD.filter(a => a.m !== 'liten' || true).forEach(a => [0, 1, 2, 3].forEach(k => out.push(choice(`aj_dd:${a.m}:${k}`, a.lvl, 4, () => {
    const pl = k === 3, w = nounOf(a, pl ? (a.i % 3) : k), ans = pl ? 'de' : (k === 2 ? 'det' : 'den'), ad = pl ? defPl(a) : defSg(a), nn = pl ? w.bf : w.be;
    const gen = pl ? 'flertall' : artOf(k) + '-ord';
    return {q:Q('Velg: den, det eller de?', '选择：den、det 还是 de？'), say:Q('Velg: den, det eller de?', '选择：den、det 还是 de？'), word:`${ans} ${ad} ${nn}`,
      visual:sentVisual(w, `<span style="border-bottom:4px solid #0d9488">___</span> ${ad} ${nn}`, a), layout:'row',
      options:['den', 'det', 'de'].map(v => ({html:`<span style="font-size:1.6rem;font-weight:800">${v}</span>`, value:v})), answer:ans,
      fb:FB(`${ans} ${ad} ${nn}. ${cap(nn)} er ${pl ? 'flertall' : 'et ' + gen}: ${pl ? 'de' : (k === 2 ? 'det' : 'den')}.`, `[${ans} ${ad} ${nn}]。[${nn}]是${pl ? '复数 → [de]' : gen + ' → [' + ans + ']'}。`), sayAfter:`${ans} ${ad} ${nn}`};
  }))));
  return out; });

/* ---------- modul 5: spesielle adjektiv ---------- */
const LIT = () => A.adj('liten');
def('aj_liten', () => { const a = LIT(), out = [];
  const FORMS = [['en', 'liten', 'sg', 0], ['ei', 'lita', 'sg', 1], ['et', 'lite', 'sg', 2], ['', 'små', 'pl'], ['den', 'lille', 'bsg', 0], ['det', 'lille', 'bsg', 2], ['de', 'små', 'bpl']];
  FORMS.forEach((f, fi) => [0, 1, 2].forEach(si => out.push(choice(`aj_liten:${fi}:${si}`, 1, 5, () => {
    const w = nounOf(a, typeof f[3] === 'number' ? f[3] : si), ans = f[1];
    const nn = f[2] === 'sg' ? w.no : f[2] === 'pl' ? w.uf : f[2] === 'bsg' ? w.be : w.bf, pre = f[0] ? f[0] + ' ' : '';
    const ok = f[0] === 'ei' ? ['liten'] : [];
    const opts = shuffle([ans].concat(sample(['liten', 'lita', 'lite', 'små', 'lille'].filter(x => x !== ans && !ok.includes(x)), 3)));
    return {q:Q('Velg riktig form av «liten».', '选出 [liten] 的正确形式。'), say:Q('Velg riktig form av liten.', '选出 liten 的正确形式。'), word:`${pre}${ans} ${nn}`,
      visual:sentVisual(w, `${pre}${blank} ${nn}`, a), layout:'row', options:opts.map(v => ({html:`<span style="font-size:1.5rem;font-weight:800">${v}</span>`, value:v})), answer:ans,
      fb:FB(`${pre}${ans} ${nn}. En liten · ei lita · et lite · små · den/det lille · de små.`, `[${pre}${ans} ${nn}]。[en liten] · [ei lita] · [et lite] · [små] · [den/det lille] · [de små]。`), sayAfter:`${pre}${ans} ${nn}`};
  }))));
  return out; });
def('aj_litenType', () => { const a = LIT(), out = [];
  [[0, 'en', ['liten']], [1, 'ei', ['lita', 'liten']], [2, 'et', ['lite']], ['pl', '', ['små']], ['bsg', 'den', ['lille']]].forEach((f, fi) => {
    [0, 1, 2].forEach(si => out.push(typed(`aj_litenT:${fi}:${si}`, 1, 5, () => {
      const kind = f[0], k = typeof kind === 'number' ? kind : si, w = nounOf(a, k);
      const nn = kind === 'pl' ? w.uf : kind === 'bsg' ? w.be : w.no, pre = kind === 'pl' ? '' : (kind === 'bsg' ? (k === 2 ? 'det ' : 'den ') : f[1] + ' ');
      return {q:Q('Skriv riktig form av «liten».', '写出 [liten] 的正确形式。'), say:Q('Skriv riktig form av liten.', '写出 liten 的正确形式。'), word:`${pre}${f[2][0]} ${nn}`,
        visual:sentVisual(w, `${pre}${blank} ${nn}`, a), listen:`${pre}${f[2][0]} ${nn}`, answers:f[2], ph:'…',
        fb:FB(`${pre}${f[2][0]} ${nn}.`, `[${pre}${f[2][0]} ${nn}]。`), sayAfter:`${pre}${f[2][0]} ${nn}`};
    })));
  });
  return out; });
const SPECIAL = ['blå', 'grå', 'gammel', 'åpen', 'sulten', 'vakker', 'tom', 'morsom', 'langsom', 'hvit', 'ny', 'svart', 'norsk', 'billig', 'trist'];
def('aj_special', () => AD.filter(a => SPECIAL.includes(a.m)).map(a => choice('aj_special:' + a.m, Math.min(a.lvl, 2), 5, () => {
  const nn = a.m === a.pl ? [`Hva er flertall av «${a.m}»?`, `[${a.m}]的复数是什么？`] : [`Hva er flertall av «${a.m}»?`, `[${a.m}]的复数是什么？`];
  const ans = a.pl, note = plNote(a);
  return {q:Q(nn[0], nn[1]), say:Q(nn[0], nn[1]), word:a.m, visual:`<div>${chip(a, true)}${bigw(`en ${a.m} ${nounOf(a, 0).no} → mange ___ ${nounOf(a, 0).uf}`, true)}</div>`, layout:'row',
    options:opts4(a, ans, []), answer:ans, fb:FB(`${ans}. ${note[0]}`, `[${ans}]。${note[1]}`), sayAfter:`${ans} ${nounOf(a, 0).uf}`};
})));

/* ---------- modul 6: sammenligning ---------- */
const CMP = () => AD.filter(a => a.cmp);
def('aj_cmp', () => CMP().map(a => choice('aj_cmp:' + a.m, a.lvl, 6, () => {
  const wrong = uniq([a.m + 'ere', a.m + 'est', a.cmp, a.sup, a.m, a.pl].filter(x => x !== a.sup && !/ /.test(x)));
  return {q:Q('Hva er superlativ? Fullfør rekka.', '最高级是什么？完成这一行。'), say:Q('Fullfør rekka.', '完成这一行。'), word:`${a.m}, ${a.cmp}, ${a.sup}`,
    visual:`<div><div class="big-emoji">${a.emoji}</div>${bigw(`${a.m} – ${a.cmp} – ___`, true)}${gloss(a.zh)}</div>`, layout:'row',
    options:shuffle([a.sup].concat(sample(wrong.filter(x => x !== a.cmp).concat([a.cmp]), 3))).map(v => ({html:`<span style="font-size:1.4rem;font-weight:800">${v}</span>`, value:v})), answer:a.sup,
    fb:FB(`${a.m} – ${a.cmp} – ${a.sup}`, `[${a.m}] – [${a.cmp}] – [${a.sup}]（${a.zh}）`), sayAfter:`${a.m}, ${a.cmp}, ${a.sup}`};
})));
def('aj_cmpKomp', () => CMP().filter(a => !/ /.test(a.cmp)).map(a => choice('aj_cmpK:' + a.m, a.lvl, 6, () => {
  const wrong = uniq([a.m + 'ere', a.m + 'est', a.sup, a.m + 'er', a.m].filter(x => x !== a.cmp));
  return {q:Q('Hva er komparativ? Fullfør rekka.', '比较级是什么？完成这一行。'), say:Q('Fullfør rekka.', '完成这一行。'), word:`${a.m}, ${a.cmp}, ${a.sup}`,
    visual:`<div><div class="big-emoji">${a.emoji}</div>${bigw(`${a.m} – ___ – ${a.sup}`, true)}${gloss(a.zh)}</div>`, layout:'row',
    options:shuffle([a.cmp].concat(sample(wrong, 3))).map(v => ({html:`<span style="font-size:1.4rem;font-weight:800">${v}</span>`, value:v})), answer:a.cmp,
    fb:FB(`${a.m} – ${a.cmp} – ${a.sup}`, `[${a.m}] – [${a.cmp}] – [${a.sup}]（${a.zh}）`), sayAfter:`${a.m}, ${a.cmp}, ${a.sup}`};
})));
def('aj_cmpType', () => { const out = [];
  CMP().forEach(a => { [['cmp', 'komparativ', '比较级'], ['sup', 'superlativ', '最高级']].forEach(f => out.push(typed(`aj_cmpT:${a.m}:${f[0]}`, a.lvl, 6, () => ({
    q:Q(`Skriv ${f[1]}.`, `写出${f[2]}。`), say:Q(`Skriv ${f[1]}.`, `写出${f[2]}。`), word:a.m,
    visual:`<div><div class="big-emoji">${a.emoji}</div>${bigw(f[0] === 'cmp' ? `${a.m} – ? – ${a.sup}` : `${a.m} – ${a.cmp} – ?`, true)}${gloss(a.zh)}</div>`, listen:a.m, answers:[a[f[0]]], ph:'…',
    fb:FB(`${a.m} – ${a.cmp} – ${a.sup}`, `[${a.m}] – [${a.cmp}] – [${a.sup}]（${a.zh}）`), sayAfter:`${a.m}, ${a.cmp}, ${a.sup}`})))); });
  return out; });
const CSENT = [
  ['🐘', 'Elefanten er ___ enn musa.', 'stor', 'større', 'cmp', '大象比老鼠大。', 1], ['🐭', 'Musa er ___ enn elefanten.', 'liten', 'mindre', 'cmp', '老鼠比大象小。', 1],
  ['🚗', 'Bilen er ___ enn sykkelen.', 'rask', 'raskere', 'cmp', '汽车比自行车快。', 1], ['⛰️', 'Fjellet er ___ enn huset.', 'høy', 'høyere', 'cmp', '山比房子高。', 1],
  ['🧊', 'Isen er ___ enn kaffen.', 'kald', 'kaldere', 'cmp', '冰比咖啡冷。', 1], ['☀️', 'Sommeren er ___ enn vinteren.', 'varm', 'varmere', 'cmp', '夏天比冬天暖和。', 1],
  ['📚', 'Boka er ___ enn avisa.', 'tykk', 'tykkere', 'cmp', '书比报纸厚。', 2], ['🐢', 'Skilpadden er ___ enn haren.', 'langsom', 'langsommere', 'cmp', '乌龟比兔子慢。', 2],
  ['👴', 'Bestefar er ___ enn pappa.', 'gammel', 'eldre', 'cmp', '爷爷比爸爸年纪大。', 2], ['🌹', 'Blomsten er ___ enn ugresset.', 'pen', 'penere', 'cmp', '花比杂草漂亮。', 2],
  ['💎', 'Gull er ___ enn jern.', 'dyr', 'dyrere', 'cmp', '黄金比铁贵。', 2], ['🪨', 'Steinen er ___ enn fjæra.', 'tung', 'tyngre', 'cmp', '石头比羽毛重。', 2],
  ['🐘', 'Elefanten er ___ av alle dyr.', 'stor', 'størst', 'sup', '大象是所有动物里最大的。', 1], ['🏔️', 'Dette fjellet er ___ av alle.', 'høy', 'høyest', 'sup', '这座山是所有山里最高的。', 1],
  ['🐆', 'Geparden er ___ av alle dyr.', 'rask', 'raskest', 'sup', '猎豹是所有动物里最快的。', 1], ['🍰', 'Denne kaka er ___ av alle.', 'god', 'best', 'sup', '这块蛋糕是所有里最好吃的。', 2],
  ['🧊', 'Det er ___ om vinteren.', 'kald', 'kaldest', 'sup', '冬天最冷。', 2], ['🌸', 'Denne blomsten er ___ av alle.', 'pen', 'penest', 'sup', '这朵花是所有花里最漂亮的。', 2],
  ['👦', 'Ola er like ___ som Lars.', 'høy', 'høy', 'like', '奥拉和拉尔斯一样高。', 1], ['🐕', 'Hunden er like ___ som katten.', 'stor', 'stor', 'like', '狗和猫一样大。', 1],
  ['🚲', 'Sykkelen er like ___ som bilen.', 'rask', 'rask', 'like', '自行车和汽车一样快。', 2], ['☕', 'Kaffen er like ___ som teen.', 'varm', 'varm', 'like', '咖啡和茶一样热。', 2]
];
def('aj_cmpSent', () => CSENT.map((s, i) => choice('aj_cmpS:' + i, s[6], 6, () => {
  const a = A.adj(s[2]), wr = uniq([a.m, a.cmp, a.sup, a.m + 'ere', a.m + 'est'].filter(x => x && !/ /.test(x) && x !== s[3]));
  const hint = s[4] === 'cmp' ? ['enn = 比', 'Vi bruker «enn» etter komparativ.'] : s[4] === 'sup' ? ['av alle = 所有里', 'Superlativ: mest av alt.'] : ['like … som = 和……一样', 'Like … som: vi bruker grunnformen.'];
  return {q:Q('Velg riktig form.', '选出正确的形式。'), say:Q('Velg riktig form.', '选出正确的形式。'), word:s[1].replace('___', s[3]),
    visual:`<div><div class="big-emoji">${s[0]}</div>${bigw(s[1].replace('___', blank), true)}<div style="margin-top:6px">${chip(a)} <span class="gloss zh" style="display:inline">${s[5]}</span></div></div>`, layout:'row',
    options:shuffle([s[3]].concat(sample(wr, 3))).map(v => ({html:`<span style="font-size:1.4rem;font-weight:800">${v}</span>`, value:v})), answer:s[3],
    fb:FB(`${s[1].replace('___', s[3])} ${hint[1]}`, `[${s[1].replace('___', s[3])}]${s[5]}`), sayAfter:s[1].replace('___', s[3])};
})));
def('aj_cmpSentType', () => CSENT.map((s, i) => typed('aj_cmpST:' + i, s[6], 6, () => {
  const a = A.adj(s[2]);
  return {q:Q('Skriv riktig form.', '写出正确的形式。'), say:Q('Skriv riktig form.', '写出正确的形式。'), word:s[1].replace('___', s[3]),
    visual:`<div><div class="big-emoji">${s[0]}</div>${bigw(s[1].replace('___', blank), true)}<div style="margin-top:6px">${chip(a)} <span class="gloss zh" style="display:inline">${s[5]}</span></div></div>`,
    listen:s[1].replace('___', s[3]), answers:[s[3]], ph:'…', fb:FB(`${s[1].replace('___', s[3])}`, `[${s[1].replace('___', s[3])}]${s[5]}`), sayAfter:s[1].replace('___', s[3])};
})));

/* ---------- modul 7: adjektiv i setninger ---------- */
def('aj_pred', () => { const out = [];
  AD.forEach(a => [0, 1, 2, 3].forEach(k => { if(k === 1 && isLit(a)) return;
    out.push(choice(`aj_pred:${a.m}:${k}`, a.lvl, 7, () => {
      const pl = k === 3, w = nounOf(a, pl ? (a.i % 3) : k), ans = pl ? plForm(a) : sgForm(a, k), subj = cap(pl ? w.bf : w.be), verb = pl ? 'er' : 'er';
      const ok = [];
      return {q:Q('Velg riktig form etter «er».', '选出 er 后面的正确形式。'), say:Q('Velg riktig form etter er.', '选出 er 后面的正确形式。'), word:`${subj} ${verb} ${ans}.`,
        visual:`<div><div class="big-emoji">${w.emoji}</div>${bigw(`${subj} ${verb} ${blank}.`)}<div style="margin-top:6px">${chip(a)} <span class="gloss zh" style="display:inline">${a.zh}</span></div></div>`, layout:'row',
        options:opts4(a, ans, ok), answer:ans,
        fb:FB(`${subj} ${verb} ${ans}. ${pl ? 'Flertall: ' + plNote(a)[0] : k === 2 ? 'Et-ord: ' + ruleNote(a)[0] : 'En/ei-ord: grunnformen.'}`, `[${subj} ${verb} ${ans}.]${pl ? plNote(a)[1] : k === 2 ? ruleNote(a)[1] : 'en/ei 名词：用基本形式。'}`), sayAfter:`${subj} ${verb} ${ans}.`};
    }));
  }));
  return out; });
def('aj_predType', () => { const out = [];
  AD.forEach(a => [0, 2, 3].forEach(k => out.push(typed(`aj_predT:${a.m}:${k}`, a.lvl, 7, () => {
    const pl = k === 3, w = nounOf(a, pl ? (a.i % 3) : k), ans = pl ? plForm(a) : sgForm(a, k), subj = cap(pl ? w.bf : w.be);
    return {q:Q('Skriv adjektivet i riktig form.', '写出形容词的正确形式。'), say:Q('Skriv adjektivet i riktig form.', '写出形容词的正确形式。'), word:`${subj} er ${ans}.`,
      visual:`<div><div class="big-emoji">${w.emoji}</div>${bigw(`${subj} er ${blank}.`)}<div style="margin-top:6px">${chip(a)} <span class="gloss zh" style="display:inline">${a.zh}</span></div></div>`,
      listen:`${subj} er ${ans}.`, answers:[ans], ph:'…', fb:FB(`${subj} er ${ans}.`, `[${subj} er ${ans}.]`), sayAfter:`${subj} er ${ans}.`};
  }))));
  return out; });
def('aj_two', () => { const out = [];   // to adjektiv foran samme substantiv: en stor, rød bil
  const P = [['stor', 'rød', 0], ['liten', 'svart', 2], ['ny', 'blå', 0], ['gammel', 'grå', 2], ['pen', 'gul', 1], ['varm', 'rød', 1], ['kald', 'hvit', 0], ['snill', 'flink', 0]];
  P.forEach((p, i) => {
    const a = A.adj(p[0]), b = A.adj(p[1]);
    [0, 2].forEach(k => { const w = A.WORDS.find(x => x.no === (k === 0 ? a.nouns[0] : a.nouns[2])), art = artOf(k); if(isLit(a) && k === 1) return;
      out.push(choice(`aj_two:${i}:${k}`, Math.max(a.lvl, b.lvl), 7, () => {
        const ans = `${sgForm(a, k)} og ${sgForm(b, k)}`, wrong = uniq([`${a.m} og ${b.m}`, `${a.n} og ${b.n}`, `${a.pl} og ${b.pl}`, `${a.m} og ${b.n}`, `${a.n} og ${b.m}`].filter(x => x !== ans));
        return {q:Q('Begge adjektivene må rette seg etter substantivet.', '两个形容词都要跟着名词变化。'), say:Q('Velg riktig setning.', '选出正确的句子。'), word:`${art} ${ans.replace(' og ', ' og ')} ${w.no}`,
          visual:`<div><div class="big-emoji">${w.emoji}</div>${bigw(`${A.artChip(art)} ___ ${w.no}`)}<div style="margin-top:6px">${chip(a)} ${chip(b)}</div></div>`, layout:'col',
          options:shuffle([ans].concat(sample(wrong, 3))).map(v => ({html:`<span style="font-size:1.3rem;font-weight:800">${art} ${v} ${w.no}</span>`, value:v})), answer:ans,
          fb:FB(`${art} ${ans} ${w.no}. Begge adjektivene får samme form.`, `[${art} ${ans} ${w.no}]。两个形容词用相同的形式。`), sayAfter:`${art} ${ans} ${w.no}`};
      }));
    });
  });
  return out; });

/* ---------- begreper ---------- */
def('aj_meta', () => { const out = [], T = A.ADJ_TERMS;
  T.forEach(t => {
    const near = () => sample(T.filter(x => x.key !== t.key), 3);
    out.push(typed('aj_meta:copy:' + t.key, 0, t.mod, () => ({
      q:Q('Skriv ordet.', '把这个词写下来。'), say:Q('Skriv ordet.', '把这个词写下来。'), word:t.no, visual:`<div>${bigw(t.no)}${gloss(A.ruby(t.zh, t.py))}</div>`, listen:t.no, answers:[t.no], ph:t.no.replace(/./g, '·'),
      fb:FB(`«${t.no}» – ${t.defNo}`, `[${t.no}]（${t.zh}）：${t.defZh}`), sayAfter:t.no})));
    out.push(choice('aj_meta:def:' + t.key, 0, t.mod, () => ({
      q:Q(`Hva betyr «${t.no}»?`, `[${t.no}]是什么意思？`), say:Q(`Hva betyr ${t.no}?`, `[${t.no}]是什么意思？`), word:t.no, visual:bigw(t.no), layout:'col',
      options:shuffle([t].concat(near())).map(x => ({html:bi(x.defNo, x.defZh), value:x.key})), answer:t.key, fb:FB(`«${t.no}»: ${t.defNo}`, `[${t.no}]：${t.defZh}`), sayAfter:t.no})));
    out.push(choice('aj_meta:term:' + t.key, 0, t.mod, () => ({
      q:Q('Hvilket begrep passer til beskrivelsen?', '哪个术语符合这个说明？'), say:Q('Hvilket begrep passer til beskrivelsen?', '哪个术语符合这个说明？'),
      visual:`<div class="bigword sm" style="max-width:520px">${bi(t.defNo, t.defZh)}</div>`, layout:'col', options:shuffle([t].concat(near())).map(x => ({html:`<span>${x.no}</span>`, value:x.key})), answer:t.key,
      fb:FB(`Det er «${t.no}»: ${t.defNo}`, `这是[${t.no}]：${t.defZh}`), sayAfter:t.no})));
  });
  return out; });

/* =====================  OMFATTENDE OPPGAVER  ===================== */
const th = (no, zh, c) => `<span class="thead" style="--c:${c}"><b>${no}</b><span class="zh">${zh}</span></span>`;
const H = {
  m:() => th('en / ei', '阳性/阴性', '#2563eb'), n:() => th('et', '中性', '#16a34a'), pl:() => th('flertall', '复数', '#9333ea'),
  cmp:() => th('komparativ', '比较级', '#14b8a6'), sup:() => th('superlativ', '最高级', '#7c3aed'), opp:() => th('motsetning', '反义词', '#e11d48')
};
function groupsOf(filter, seed, n){
  const out = [];
  [1, 2, 3].forEach(lvl => {
    const rnd = A.seeded(seed + lvl * 31), list = AD.filter(a => a.lvl === lvl && filter(a)).map(a => [rnd(), a]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
    const gs = []; for(let i = 0; i < list.length; i += n) gs.push(list.slice(i, i + n));
    if(gs.length > 1 && gs[gs.length - 1].length < Math.ceil(n / 2)){ const last = gs.pop(); gs[gs.length - 1].push(...last); }
    gs.forEach(g => out.push({lvl, words:g}));
  });
  return out.map((g, i) => Object.assign(g, {i}));
}
function formsTask(name, filter, cols, titleNo, titleZh, seed, mod){
  def(name, () => groupsOf(filter, seed, 3).map(g => ({id:`${name}:${g.i}`, kind:'grid', lvl:g.lvl, mod, make:() => ({
    title:Q(titleNo, titleZh), say:Q(titleNo, titleZh), intro:Q('Tips: bruk 💡 hvis du står fast. Trykk 🔊 for å høre ordet.', '提示：卡住了就点 💡。点 🔊 可以听单词。'),
    head:['<span class="thead">&nbsp;</span>'].concat([cols[0][2]()].concat(cols.slice(1).map(c => c[2]()))),
    rows:g.words.map(a => ({lead:`<span class="e" style="font-size:1.8rem">${a.emoji}</span>`, speak:a.m,
      cells:[{html:`<span class="bigword sm" style="white-space:nowrap">${cols[0][1](a)}</span>`}].concat(cols.slice(1).map(c => ({answers:[].concat(c[1](a)), ph:'…'})))}))
  })})));
}
const NOLIT = a => a.m !== 'liten';
formsTask('aj_forms_n', NOLIT, [['m', a => a.m, H.m], ['n', a => a.n, H.n]], 'Skriv et-formen.', '写出 et 形式。', 11, 3);
formsTask('aj_forms_pl', NOLIT, [['m', a => a.m, H.m], ['pl', a => a.pl, H.pl]], 'Skriv flertall.', '写出复数形式。', 17, 4);
formsTask('aj_forms_all', NOLIT, [['m', a => a.m, H.m], ['n', a => a.n, H.n], ['pl', a => a.pl, H.pl]], 'Skriv et-form og flertall.', '写出 et 形式和复数形式。', 23, 4);
formsTask('aj_forms_cmp', a => a.cmp && !/ /.test(a.cmp), [['m', a => a.m, () => th('grunnform', '基本形式', '#2563eb')], ['cmp', a => a.cmp, H.cmp], ['sup', a => a.sup, H.sup]], 'Skriv komparativ og superlativ.', '写出比较级和最高级。', 29, 6);
formsTask('aj_opp_table', a => a.opp, [['m', a => a.m, () => th('adjektiv', '形容词', '#16a34a')], ['opp', a => A.adjOpps(a), H.opp]], 'Skriv motsetningen.', '写出反义词。', 37, 2);

/* diktat */
let _dsets;
function dictSets(){
  if(_dsets) return _dsets;
  const rnd = A.seeded(41), shuf = a => a.map(x => [rnd(), x]).sort((x, y) => x[0] - y[0]).map(x => x[1]), out = [];
  const l1 = shuf(AD.filter(a => a.lvl === 1)), l2 = shuf(AD.filter(a => a.lvl <= 2));
  for(let i = 0; i < 2; i++) out.push({lvl:1, words:l1.slice(i * 5, i * 5 + 5)});
  for(let i = 0; i < 3; i++) out.push({lvl:2, words:l2.slice(i * 5, i * 5 + 5)});
  return (_dsets = out.map((s, i) => Object.assign(s, {i})));
}
def('aj_dict_word', () => dictSets().map(s => ({id:`aj_dict_word:${s.i}`, kind:'grid', lvl:s.lvl, mod:1, speech:true, make:() => ({
  title:Q('Hør og skriv adjektivet.', '听一听，把形容词写下来。'), say:Q('Hør og skriv adjektivet.', '听一听，把形容词写下来。'), head:null, caseSensitive:false, revealEmoji:true,
  intro:Q('Trykk 🔊 og skriv det du hører.', '点 🔊，写下你听到的词。'),
  rows:s.words.map(a => ({lead:`<span class="gloss zh">${a.zh}</span>`, speak:a.m, reveal:a.emoji, cells:[{answers:[a.m], ph:'…'}]}))
})})));
def('aj_dict_form', () => dictSets().map(s => ({id:`aj_dict_form:${s.i}`, kind:'grid', lvl:s.lvl, mod:4, speech:true, make:() => {
  const ws = s.words.filter(NOLIT), kinds = [['n', 'et'], ['pl', 'flertall'], ['n', 'et'], ['pl', 'flertall'], ['n', 'et']];
  return {title:Q('Hør og skriv formen.', '听一听，写出要求的形式。'), say:Q('Hør og skriv formen.', '听一听，写出要求的形式。'), head:null, caseSensitive:false,
    intro:Q('Trykk 🔊 og hør grunnformen. Skriv så formen som står i den grå ruten.', '点 🔊 听基本形式，然后写出灰色格子里要求的形式。'),
    rows:ws.map((a, k) => { const f = kinds[k % kinds.length]; return {lead:`<span class="gloss zh">${a.zh}</span>`, speak:a.m,
      cells:[{html:`<span class="chip" style="--c:${f[0] === 'n' ? '#16a34a' : '#9333ea'}">${f[1]}</span>`}, {answers:[a[f[0]]], ph:'…'}]}; })};
}})));

/* finn adjektivene */
def('aj_find', () => A.ADJ_TEXTS.map(t => ({id:'aj_find:' + t.id, kind:'find', lvl:t.lvl, mod:1, make:() => ({
  mode:'adj', title:Q('Trykk på alle adjektivene.', '点出所有的形容词。'), say:Q('Trykk på alle adjektivene.', '点出所有的形容词。'), text:t.no, zh:t.zh,
  note:Q('Husk: adjektiv sier hvordan noe er. Verb sier hva noe gjør.', '记住：形容词说明事物怎么样。动词说明做什么。')
})})));

/* sortering */
const sortItem = a => ({id:a.m, html:`<span class="e">${a.emoji}</span><span>${a.m}</span>`});
function pickSet(rnd, list, n){ return list.map(x => [rnd(), x]).sort((a, b) => a[0] - b[0]).slice(0, n).map(x => x[1]); }
def('aj_sortcat', () => { const out = [], plan = [1, 1, 1, 1, 2, 2, 2, 3];
  plan.forEach((lvl, i) => { const rnd = A.seeded(700 + i * 17);
    const ws = [].concat(...Object.keys(A.ADJ_CATS).map(c => pickSet(rnd, AD.filter(a => a.cat === c && a.lvl <= lvl), 2)));
    out.push({id:'aj_sortcat:' + i, kind:'sort', lvl:lvl === 1 ? 1 : 2, mod:1, make:() => ({
      title:Q('Hva sier adjektivet om? Sorter.', '这个形容词说明什么？请分类。'), say:Q('Sorter adjektivene: farge, størrelse, følelse eller egenskap?', '给形容词分类：颜色、大小、心情还是特点？'),
      bins:Object.keys(A.ADJ_CATS).map(c => ({key:c, html:`<span>${A.ADJ_CATS[c].emoji} ${bi(A.ADJ_CATS[c].no, A.ADJ_CATS[c].zh)}</span>`, color:A.ADJ_CATS[c].color})),
      items:ws.map(a => Object.assign(sortItem(a), {bin:a.cat, fix:`${a.m} = ${A.ADJ_CATS[a.cat].no}`}))})});
  });
  return out; });
def('aj_sortrule', () => { const out = [];
  for(let i = 0; i < 8; i++){ const lvl = i < 4 ? 1 : 2, rnd = A.seeded(900 + i * 19);
    const by = r => pickSet(rnd, AD.filter(a => a.rule === r && a.lvl <= lvl), 2);
    const ws = [].concat(by('t'), by('tt'), by('same'));
    out.push({id:'aj_sortrule:' + i, kind:'sort', lvl, mod:3, make:() => ({
      title:Q('Hva skjer foran et-ord? Sorter.', '用在 et 名词前会怎样？请分类。'), say:Q('Hva skjer med adjektivet foran et-ord? Sorter.', '形容词用在 et 名词前会怎样？请分类。'),
      bins:Object.keys(A.ADJ_RULES).map(k => ({key:k, html:`<span>${bi(A.ADJ_RULES[k].no, A.ADJ_RULES[k].zh)}</span>`, color:A.ADJ_RULES[k].color})),
      items:ws.map(a => Object.assign(sortItem(a), {bin:a.rule, fix:`${a.m} → ${a.n}`})),
      hint:Q('Tips: stor → stort (+t) · hvit → hvitt (+tt) · billig → billig (ingen endring)', '提示：stor → stort（+t）· hvit → hvitt（+tt）· billig → billig（不变）')})});
  }
  return out; });
def('aj_sortform', () => { const out = [];
  for(let i = 0; i < 8; i++){ const lvl = i < 4 ? 1 : 2, rnd = A.seeded(1100 + i * 23), as = pickSet(rnd, AD.filter(a => a.lvl <= lvl && NOLIT(a) && a.m !== 'blå' && a.m !== 'grå'), 2);
    const items = [];
    as.forEach(a => { const w0 = nounOf(a, 0), w2 = nounOf(a, 2);
      items.push({id:`${a.m}0`, html:`<span class="e">${w0.emoji}</span><span>en ${a.m} ${w0.no}</span>`, bin:'m', fix:`en ${a.m} ${w0.no} = en/ei`});
      items.push({id:`${a.m}2`, html:`<span class="e">${w2.emoji}</span><span>et ${a.n} ${w2.no}</span>`, bin:'n', fix:`et ${a.n} ${w2.no} = et`});
      items.push({id:`${a.m}p`, html:`<span class="e">${w0.emoji}</span><span>${a.pl} ${w0.uf}</span>`, bin:'pl', fix:`${a.pl} ${w0.uf} = flertall`}); });
    out.push({id:'aj_sortform:' + i, kind:'sort', lvl, mod:4, make:() => ({
      title:Q('Hvilken form er det? Sorter.', '这是哪种形式？请分类。'), say:Q('Hvilken form er det? Sorter.', '这是哪种形式？请分类。'),
      bins:[{key:'m', html:`<span>${bi('en / ei (grunnform)', 'en / ei（基本形式）')}</span>`, color:'#2563eb'}, {key:'n', html:`<span>${bi('et', 'et（中性）')}</span>`, color:'#16a34a'}, {key:'pl', html:`<span>${bi('flertall', '复数')}</span>`, color:'#9333ea'}],
      items:shuffle(items), hint:Q('Tips: en stor hund · et stort hus · store hunder', '提示：en stor hund · et stort hus · store hunder')})});
  }
  return out; });

/* bygg setning */
def('aj_build', () => A.ADJ_SENTENCES.map(s => ({id:'aj_build:' + s.id, kind:'build', lvl:s.lvl, mod:7, make:() => {
  const toks = A.parseMarked(s.no).filter(t => t.word || /[.!?]/.test(t.t));
  const words = []; toks.forEach(t => { if(t.word) words.push({t:t.t, noun:!!t.mark}); else if(words.length) words[words.length - 1].t += t.t; });
  return {title:Q('Bygg setningen. Husk stor bokstav først!', '把句子拼出来。句首要大写！'), say:Q('Bygg setningen.', '把句子拼出来。'), zh:s.zh, words, sentence:A.plain(s.no)};
}})));
})();
