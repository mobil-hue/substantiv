(function(){
'use strict';
/* Korte videoer til grunnkursene (substantiv og adjektiv): få ord, ett poeng om gangen */
const A = window.App;
const card = (e, l, z, c, d, sz) => `<div class="vcard pop" style="--c:${c};--d:${d}s"><div class="e" style="font-size:${sz || 3.4}rem">${e}</div><div class="l">${l}</div>${z ? `<div class="z">${z}</div>` : ''}</div>`;
const title = (emoji, no, zh) => `<div class="scene"><div class="big-emoji bounce">${emoji}</div><h2 class="up">${A.bi(no, zh)}</h2></div>`;
const bubble = (h, d) => `<div class="pop sub" style="--d:${d || 0}s">${h}</div>`;
const AC = '#16a34a';
const C = {en:'#2563eb', ei:'#db2777', et:'#16a34a'};
const art = a => A.artChip(a);
const nc = (a, noun, e, d, zh) => card(e, `${art(a)}${noun}`, zh, C[a], d);                         // en hund
const ac = (a, adj, noun, e, d, sz) => card(e, `${art(a)}<span style="color:${AC};font-weight:900">${adj}</span> ${noun}`, '', C[a], d, sz); // en stor hund

Object.assign(A.VIDEOS, {

nb_what: {
  no:'Ord for ting', zh:'表示东西的词', emoji:'📗',
  scenes:[
   {html:title('📗', 'Hva er et substantiv?', '什么是名词？'), no:'Hei! Vi starter helt enkelt. Hva er et substantiv?', zh:'你好！我们从最简单的开始。什么是名词？'},
   {html:`<div class="scene"><div class="row">${card('🐶', 'hund', '狗', '#16a34a', .2)}${card('🚗', 'bil', '汽车', '#d97706', 1)}${card('👧', 'jente', '女孩', '#2563eb', 1.8)}${card('🏠', 'hus', '房子', '#9333ea', 2.6)}</div></div>`,
    no:'Alt har et navn. Hund. Bil. Jente. Hus.', zh:'每样东西都有名字。[hund]，狗。[bil]，汽车。[jente]，女孩。[hus]，房子。'},
   {html:`<div class="scene"><div class="row">${card('👧', 'person', '人', '#2563eb', .2, 2.6)}${card('🐶', 'dyr', '动物', '#16a34a', .9, 2.6)}${card('🚗', 'ting', '东西', '#d97706', 1.6, 2.6)}${card('🏫', 'sted', '地方', '#9333ea', 2.3, 2.6)}</div>${bubble(A.bi('substantiv = navn', '名词 = 名字'), 3.2)}</div>`,
    no:'Navn på personer, dyr, ting og steder heter substantiv.', zh:'人、动物、东西和地方的名字，叫做名词，挪威语是[substantiv]。'},
   {html:`<div class="scene"><div class="row">${card('🐶', 'hund ✔', 'substantiv', '#16a34a', .2)}${card('🏃', 'løpe ✖', '动词，不是名词', '#dc2626', 1.2)}</div></div>`,
    no:'Hund er et substantiv. Løpe er ikke et substantiv, for det er noe du gjør.', zh:'[hund]是名词。[løpe]不是名词，因为它是你做的事。'},
   {html:title('🚀', 'Nå øver vi!', '现在来练习！'), no:'Nå øver vi litt. Ta det i ditt eget tempo!', zh:'现在我们来练一练。按你自己的节奏来！'}
  ]},

nb_gender: {
  no:'en, ei og et', zh:'en、ei 和 et', emoji:'🎨',
  scenes:[
   {html:title('🎨', 'en, ei eller et?', 'en、ei 还是 et？'), no:'På norsk sier vi en, ei eller et foran ordet.', zh:'在挪威语里，词的前面要说 [en]、[ei] 或 [et]。'},
   {html:`<div class="scene"><div class="row">${nc('en', 'hund', '🐶', .2)}${nc('ei', 'jente', '👧', 1.2)}${nc('et', 'hus', '🏠', 2.2)}</div></div>`,
    no:'En hund. Ei jente. Et hus.', zh:'[en hund]，[ei jente]，[et hus]。'},
   {html:`<div class="scene"><div class="row">${nc('en', 'bil', '🚗', .2)}${nc('en', 'katt', '🐱', .8)}${nc('en', 'stol', '🪑', 1.4)}</div>${bubble(A.bi('en-ord · blå', 'en 名词 · 蓝色'), 2.2)}</div>`,
    no:'Mange ord bruker en. En bil. En katt. En stol.', zh:'很多词用 [en]。[en bil]，[en katt]，[en stol]。'},
   {html:`<div class="scene"><div class="row">${nc('ei', 'bok', '📖', .2)}${nc('ei', 'seng', '🛏️', .8)}${nc('ei', 'kake', '🍰', 1.4)}</div>${bubble(A.bi('ei-ord · rosa', 'ei 名词 · 粉色'), 2.2)}</div>`,
    no:'Noen ord bruker ei. Ei bok. Ei seng. Ei kake.', zh:'有些词用 [ei]。[ei bok]，[ei seng]，[ei kake]。'},
   {html:`<div class="scene"><div class="row">${nc('et', 'eple', '🍎', .2)}${nc('et', 'bilde', '🖼️', .8)}${nc('et', 'tog', '🚆', 1.4)}</div>${bubble(A.bi('et-ord · grønn', 'et 名词 · 绿色'), 2.2)}</div>`,
    no:'Og noen ord bruker et. Et eple. Et bilde. Et tog.', zh:'还有些词用 [et]。[et eple]，[et bilde]，[et tog]。'},
   {html:`<div class="scene"><div class="bigword pop">${art('en')}hund · ${art('ei')}jente · ${art('et')}hus</div>${bubble(A.bi('Lær ordet sammen med en, ei eller et!', '把词和 en、ei 或 et 一起记！'), 1.6)}</div>`,
    no:'Tips: lær alltid ordet sammen med en, ei eller et.', zh:'小窍门：学词的时候，一定要连同 en、ei 或 et 一起学。'}
  ]},

nb_plural: {
  no:'Én eller flere', zh:'一个或很多个', emoji:'➕',
  scenes:[
   {html:title('➕', 'Én eller flere?', '一个还是很多个？'), no:'Noen ganger er det bare én ting. Noen ganger er det flere.', zh:'有时候只有一个，有时候有很多个。'},
   {html:`<div class="scene"><div class="row">${card('🚗', 'en bil', '一辆车', '#f97316', .2, 3.6)}${card('🚗🚗🚗', 'biler', '很多辆车', '#9333ea', 1.2, 3.6)}</div></div>`,
    no:'En bil. Mange biler. Én er entall. Flere er flertall.', zh:'[en bil]，一辆车。很多[biler]，车。一个是单数[entall]，很多个是复数[flertall]。'},
   {html:`<div class="scene"><div class="row">${card('🐶', 'en hund', '', '#f97316', .2, 3)}${card('🐶🐶🐶', 'hunder', '', '#9333ea', 1.2, 3)}${card('🐱', 'en katt', '', '#f97316', 2.2, 3)}${card('🐱🐱🐱', 'katter', '', '#9333ea', 3.2, 3)}</div></div>`,
    no:'En hund, hunder. En katt, katter.', zh:'[en hund]，[hunder]。[en katt]，[katter]。'},
   {html:`<div class="scene"><div class="row"><span class="chip pop" style="--c:#9333ea;font-size:2rem">+ er</span></div><div class="bigword pop" style="--d:1s">hund → hund<b style="color:#9333ea">er</b></div><div class="bigword pop" style="--d:2s">bil → bil<b style="color:#9333ea">er</b></div></div>`,
    no:'Oftest legger vi til er. Hund, hunder. Bil, biler.', zh:'通常加 [er]。[hund]，[hunder]。[bil]，[biler]。'},
   {html:title('🚀', 'Nå øver vi!', '现在来练习！'), no:'Nå øver vi på entall og flertall.', zh:'现在我们来练习单数和复数。'}
  ]},

nb_def: {
  no:'Bilen, hunden', zh:'那辆车、那只狗', emoji:'🔦',
  scenes:[
   {html:title('🔦', 'bilen og hunden', 'bilen 和 hunden'), no:'Nå skal vi lære å si den bilen, og den hunden.', zh:'现在我们来学怎么说“那辆车”和“那只狗”。'},
   {html:`<div class="scene"><div class="row">${card('🚗', 'en bil', '一辆车（任何一辆）', '#f97316', .2)}${card('🚗', 'bilen', '那辆车（我们知道的）', '#0d9488', 1.4)}</div></div>`,
    no:'En bil. Det kan være en hvilken som helst bil. Bilen. Da vet vi hvilken bil.', zh:'[en bil]，可能是任何一辆车。[bilen]，我们知道是哪一辆车。'},
   {html:`<div class="scene"><div class="row">${card('🐶', `${art('en')}hund → hund<b>en</b>`, '', '#2563eb', .2)}${card('👧', `${art('ei')}jente → jent<b>a</b>`, '', '#db2777', 1.4)}${card('🏠', `${art('et')}hus → hus<b>et</b>`, '', '#16a34a', 2.6)}</div></div>`,
    no:'Vi legger til en, a eller et bak ordet. Hunden. Jenta. Huset.', zh:'在词后面加 [en]、[a] 或 [et]。[hunden]，[jenta]，[huset]。'},
   {html:`<div class="scene"><div class="bigword pop">Jeg ser <b style="color:#f97316">en hund</b>.</div><div class="bigword pop" style="--d:1.6s"><b style="color:#0d9488">Hunden</b> er snill.</div></div>`,
    no:'Jeg ser en hund. Hunden er snill. Nå vet vi hvilken hund.', zh:'[Jeg ser en hund.]我看见一只狗。[Hunden er snill.]那只狗很善良。现在我们知道是哪只狗了。'},
   {html:title('🚀', 'Nå øver vi!', '现在来练习！'), no:'Nå øver vi på ubestemt og bestemt form.', zh:'现在我们来练习不定形式和定指形式。'}
  ]},

adjb_what: {
  no:'Hvordan er det?', zh:'它怎么样？', emoji:'🐱',
  scenes:[
   {html:title('🐱', 'Hva er et adjektiv?', '什么是形容词？'), no:'Hei! I dag lærer vi hva et adjektiv er.', zh:'你好！今天我们来学什么是形容词。'},
   {html:`<div class="scene"><div class="row">${card('🐘', 'stor', '大的', AC, .2)}${card('🍎', 'rød', '红的', '#dc2626', 1)}${card('🧊', 'kald', '冷的', '#0ea5e9', 1.8)}${card('🆕', 'ny', '新的', '#f59e0b', 2.6)}</div>${bubble(A.bi('Hvordan er det?', '它怎么样？'), 3.4)}</div>`,
    no:'Et adjektiv sier hvordan noe er. Stor. Rød. Kald. Ny.', zh:'[adjektiv]，形容词，说明事物怎么样。[stor]，大的。[rød]，红的。[kald]，冷的。[ny]，新的。'},
   {html:`<div class="scene"><div class="row">${ac('en', 'stor', 'hund', '🐕', .2, 4.6)}${ac('en', 'liten', 'hund', '🐕', 1.2, 1.6)}</div>${bubble(A.bi('en stor hund · en liten hund', '一只大狗 · 一只小狗'), 2.2)}</div>`,
    no:'En stor hund. En liten hund. Adjektivet sier hvordan hunden er.', zh:'[en stor hund]，大狗。[en liten hund]，小狗。形容词说明狗怎么样。'},
   {html:`<div class="scene"><div class="row">${ac('et', 'rødt', 'eple', '🍎', .2)}${ac('et', 'grønt', 'eple', '🍏', 1.2)}</div></div>`,
    no:'Et rødt eple. Et grønt eple. Adjektivet sier hvilket eple.', zh:'[et rødt eple]，红苹果。[et grønt eple]，绿苹果。形容词说明是哪个苹果。'},
   {html:title('🚀', 'Nå øver vi!', '现在来练习！'), no:'Nå øver vi på adjektiv.', zh:'现在我们来练习形容词。'}
  ]},

adjb_gender: {
  no:'en stor hund, et stort hus', zh:'en stor hund、et stort hus', emoji:'🎨',
  scenes:[
   {html:title('🎨', 'en stor hund – et stort hus', '一只大狗 – 一座大房子'), no:'Adjektivet endrer seg litt. Se på en og et.', zh:'形容词会稍微变化。看 [en] 和 [et]。'},
   {html:`<div class="scene"><div class="row">${ac('en', 'stor', 'hund', '🐕', .2, 3.4)}${ac('ei', 'stor', 'bok', '📖', 1.2, 3.4)}</div>${bubble(A.bi('en og ei: stor', 'en 和 ei：stor'), 2.4)}</div>`,
    no:'Foran en og ei sier vi stor. En stor hund. Ei stor bok.', zh:'在 [en] 和 [ei] 前面说 [stor]。[en stor hund]，[ei stor bok]。'},
   {html:`<div class="scene"><div class="row">${ac('et', 'stort', 'hus', '🏠', .2, 3.4)}</div>${bubble(A.bi('et: stor + t = stort', 'et：stor + t = stort'), 1.2)}</div>`,
    no:'Foran et legger vi til t. Et stort hus.', zh:'在 [et] 前面加 [t]。[et stort hus]。'},
   {html:`<div class="scene"><div class="row">${ac('et', 'rødt', 'eple', '🍎', .2, 3)}${ac('et', 'varmt', 'hus', '🔥🏠', 1.2, 3)}${ac('et', 'kaldt', 'glass', '🧊🥛', 2.2, 3)}</div>${bubble(A.bi('rød → rødt · varm → varmt · kald → kaldt', 'rød → rødt · varm → varmt · kald → kaldt'), 3)}</div>`,
    no:'Rød, rødt. Varm, varmt. Kald, kaldt. Husk t foran et!', zh:'[rød]，[rødt]。[varm]，[varmt]。[kald]，[kaldt]。记住 [et] 前面加 [t]！'},
   {html:title('🚀', 'Nå øver vi!', '现在来练习！'), no:'Nå øver vi på en, ei og et med adjektiv.', zh:'现在我们来练习形容词和 en、ei、et。'}
  ]},

adjb_plural: {
  no:'store hunder', zh:'很多只大狗', emoji:'➕',
  scenes:[
   {html:title('➕', 'store hunder', '很多只大狗'), no:'Hva gjør adjektivet når det er mange?', zh:'有很多个的时候，形容词怎么变？'},
   {html:`<div class="scene"><div class="row">${ac('en', 'stor', 'hund', '🐕', .2, 3.4)}<div class="vcard pop" style="--c:#9333ea;--d:1.2s"><div class="e" style="font-size:3.4rem">🐕🐕</div><div class="l"><span style="color:${AC};font-weight:900">store</span> hunder</div></div></div>${bubble(A.bi('flertall: + e', '复数：+ e'), 2.2)}</div>`,
    no:'En stor hund. Mange store hunder. I flertall legger vi til e.', zh:'[en stor hund]。很多[store hunder]。复数加 [e]。'},
   {html:`<div class="scene"><div class="row"><div class="vcard pop" style="--c:#9333ea;--d:.2s"><div class="e">🍎🍎</div><div class="l"><span style="color:${AC};font-weight:900">røde</span> epler</div></div><div class="vcard pop" style="--c:#9333ea;--d:1.2s"><div class="e">🐱🐱</div><div class="l"><span style="color:${AC};font-weight:900">snille</span> katter</div></div><div class="vcard pop" style="--c:#9333ea;--d:2.2s"><div class="e">🏠🏠</div><div class="l"><span style="color:${AC};font-weight:900">store</span> hus</div></div></div></div>`,
    no:'Røde epler. Snille katter. Store hus. Alle får e.', zh:'[røde epler]，[snille katter]，[store hus]。都加 [e]。'},
   {html:title('🚀', 'Nå øver vi!', '现在来练习！'), no:'Nå øver vi på flertall.', zh:'现在我们来练习复数。'}
  ]}
});
})();
