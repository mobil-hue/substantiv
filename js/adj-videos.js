(function(){
'use strict';
const A = window.App;
const W = n => A.WORDS.find(w => w.no === n);

/* byggeklosser */
const card = (e, l, z, c, d) => `<div class="vcard pop" style="--c:${c};--d:${d}s"><div class="e">${e}</div><div class="l">${l}</div>${z ? `<div class="z">${z}</div>` : ''}</div>`;
const title = (emoji, no, zh, extra) => `<div class="scene"><div class="big-emoji bounce">${emoji}</div><h2 class="up">${A.bi(no, zh)}</h2>${extra || ''}</div>`;
const bubble = (h, d) => `<div class="pop sub" style="--d:${d || 0}s">${h}</div>`;
const chipRow = (list, d0) => `<div class="row">${list.map((c, i) => `<span class="chip pop" style="--c:${c[1]};--d:${(d0 || 0) + i * .5}s;font-size:1.5rem">${c[0]}</span>`).join('')}</div>`;
const sent = (toks, hl) => `<div class="bigword" style="line-height:1.9">${toks.map((t, i) => `<span class="${hl[i] != null ? 'hl' : ''}" style="--d:${hl[i] || 0}s;border-radius:10px;padding:2px 6px">${t}</span>`).join(' ')}</div>`;
const AC = '#16a34a';
// frase: en stor hund med adjektivet farget
const phr = (art, adj, noun, d) => `<div class="bigword pop" style="--d:${d || 0}s;white-space:nowrap">${A.artChip(art)}<span style="color:${AC};border-bottom:4px solid ${AC}">${adj}</span> ${noun}</div>`;
const ecard = (art, adj, noun, d, c, e, sz) => { const w = W(noun); return `<div class="vcard pop" style="--c:${c || A.GEN[art].color};--d:${d}s"><div class="e" style="font-size:${sz || 3}rem">${e || w.emoji}</div><div class="l">${A.artChip(art)}<span style="color:${AC};font-weight:900">${adj}</span> ${noun}</div></div>`; };
const pcard = (adj, e, d, c) => `<div class="vcard pop" style="--c:${c || AC};--d:${d}s"><div class="e">${e}</div><div class="l" style="color:${c || AC}">${adj}</div></div>`;
const pair = (a, b, ea, eb, za, zb, d) => `<div class="vcard pop" style="--c:#e11d48;--d:${d}s"><div class="e">${ea} ↔ ${eb}</div><div class="l">${a} ↔ ${b}</div><div class="z">${za} ↔ ${zb}</div></div>`;
const arrow = (a, b, d, c) => `<div class="vcard pop" style="--c:${c || '#2563eb'};--d:${d}s"><div class="l"><span style="color:${AC}">${a}</span> → <b style="color:${c || '#2563eb'}">${b}</b></div></div>`;

Object.assign(A.VIDEOS, {

adj_why: {
  no:'Hvorfor lære adjektiv?', zh:'为什么要学形容词？', emoji:'💡',
  scenes:[
   {html:title('🎨', 'Hvorfor lære adjektiv?', '为什么要学形容词？'),
    no:'Hei! Hvorfor skal vi lære adjektiv? Her kommer svaret.', zh:'你好！我们为什么要学形容词？答案马上就来。'},
   {html:`<div class="scene"><div class="row">${card('🍎', 'et eple', '一个苹果', '#64748b', .2)}${ecard('et', 'rødt', 'eple', 1.2, '#dc2626', '🍎')}${ecard('et', 'grønt', 'eple', 2.2, '#16a34a', '🍏')}</div></div>`,
    no:'Du vil ha et eple. Men hvilket? Et rødt eple eller et grønt eple? Adjektivene forteller oss det.', zh:'你想要一个苹果。可是要哪一个？红苹果还是绿苹果？[adjektiv]，也就是形容词，会告诉我们。'},
   {html:`<div class="scene"><div class="row">${ecard('en', 'stor', 'hund', .2, null, '🐕', 4.6)}${ecard('en', 'liten', 'hund', 1.2, null, '🐕', 1.6)}${ecard('en', 'snill', 'hund', 2.2, null, '🥰🐶', 2.6)}</div></div>`,
    no:'Uten adjektiv sier vi bare: en hund. Med adjektiv kan vi si: en stor hund, en liten hund, en snill hund.', zh:'没有形容词，我们只能说[en hund]，一只狗。有了形容词，我们可以说[en stor hund]，大狗，[en liten hund]，小狗，[en snill hund]，善良的狗。'},
   {html:`<div class="scene"><div class="row">${card('🎨', 'farge', '颜色', '#ec4899', .2)}${card('📏', 'størrelse', '大小', '#0ea5e9', .9)}${card('😊', 'følelse', '心情', '#f59e0b', 1.6)}${card('⭐', 'egenskap', '特点', '#16a34a', 2.3)}</div></div>`,
    no:'Adjektiv kan fortelle om farge, størrelse, følelser og egenskaper.', zh:'形容词可以说明颜色、大小、心情和特点。'},
   {html:`<div class="scene"><div class="row">${ecard('en', 'stor', 'hund', .2, null, '🐕', 4)}${ecard('et', 'stort', 'hus', 1.2, null, '🏠', 4)}<div class="vcard pop" style="--c:#9333ea;--d:2.2s"><div class="e" style="font-size:3.4rem">🐕🐕</div><div class="l"><span style="color:${AC};font-weight:900">store</span> hunder</div></div></div></div>`,
    no:'På norsk endrer adjektivet seg. En stor hund. Et stort hus. Store hunder. Det lærer vi!', zh:'在挪威语里，形容词会变化。[en stor hund]，[et stort hus]，[store hunder]。这就是我们要学的！'},
   {html:`<div class="scene"><div class="row"><div class="big-emoji pop">😊</div><div class="big-emoji pop" style="--d:.8s">😴</div><div class="big-emoji pop" style="--d:1.6s">🍽️</div></div>${bubble(A.bi('Jeg er glad. Jeg er trøtt. Jeg er sulten.', '我很开心。我很困。我饿了。'), 2.2)}</div>`,
    no:'Vi bruker adjektiv også når vi snakker om oss selv. Jeg er glad. Jeg er trøtt. Jeg er sulten.', zh:'我们说自己的时候也用形容词。[Jeg er glad]，我很开心。[Jeg er trøtt]，我很困。[Jeg er sulten]，我饿了。'},
   {html:title('🚀', 'Er du klar?', '准备好了吗？'), no:'Vi lærer litt om gangen, og vi øver mye. Er du klar? Nå starter vi!', zh:'我们一点一点地学，多多练习。准备好了吗？我们开始吧！'}
  ]},

adj_what: {
  no:'Hva er et adjektiv?', zh:'什么是形容词？', emoji:'🔎',
  scenes:[
   {html:`<div class="scene"><div class="big-emoji bounce">🔎</div><div class="row"><span class="syl pop" style="--d:.2s">ad</span><span class="syl pop" style="--d:1.1s">jek</span><span class="syl pop" style="--d:2s">tiv</span></div><h2 class="fade" style="--d:2.8s">${A.bi('adjektiv', '形容词')}</h2></div>`,
    no:'Adjektiv. Si det etter meg. Ad. Jek. Tiv. Adjektiv!', zh:'形容词，挪威语叫[adjektiv]。跟我读：[ad]，[jek]，[tiv]，[adjektiv]！'},
   {html:`<div class="scene"><div class="row">${pcard('stor', '🐘', .2)}${pcard('rød', '🍎', .9)}${pcard('glad', '😊', 1.6)}${pcard('ny', '🆕', 2.3)}</div>${bubble(A.bi('Hvordan er det?', '它怎么样？'), 3)}</div>`,
    no:'Et adjektiv er et ord som sier hvordan noe er. Stor. Rød. Glad. Ny.', zh:'[adjektiv]是说明事物怎么样的词。[stor]，大的。[rød]，红的。[glad]，开心的。[ny]，新的。'},
   {html:`<div class="scene"><div class="row">${card('🎨', 'farge', 'rød · blå · gul', '#ec4899', .2)}${card('📏', 'størrelse', 'stor · liten · lang', '#0ea5e9', 1.2)}${card('😊', 'følelse', 'glad · trist · sint', '#f59e0b', 2.2)}${card('⭐', 'egenskap', 'ny · gammel · snill', '#16a34a', 3.2)}</div></div>`,
    no:'Det finnes fire slags. Farge: rød, blå, gul. Størrelse: stor, liten, lang. Følelse: glad, trist, sint. Og egenskap: ny, gammel, snill.', zh:'有四类。颜色：[rød]，[blå]，[gul]。大小：[stor]，[liten]，[lang]。心情：[glad]，[trist]，[sint]。特点：[ny]，[gammel]，[snill]。'},
   {html:`<div class="scene">${sent(['Hunden', 'er', 'stor.'], [null, null, 1.6])}<div class="fade sub" style="--d:.8s">${A.bi('Hunden = substantiv', 'Hunden = 名词')}</div><div class="fade sub" style="--d:2.4s">${A.bi('stor = adjektiv ✔', 'stor = 形容词 ✔')}</div></div>`,
    no:'Hunden er stor. Hunden er et substantiv. Stor er et adjektiv. Det sier hvordan hunden er.', zh:'[Hunden er stor.]狗是名词，[stor]是形容词。它说明狗怎么样。'},
   {html:`<div class="scene">${phr('en', 'stor', 'hund', .3)}${bubble(A.bi('foran substantivet', '在名词前面'), 1.5)}<div style="height:10px"></div><div class="pop" style="--d:2.6s">${sent(['Hunden', 'er', 'stor.'], [null, null, .1])}</div>${bubble(A.bi('etter «er»', '在 er 后面'), 3)}</div>`,
    no:'Adjektivet kan stå foran substantivet: en stor hund. Eller etter er: hunden er stor.', zh:'形容词可以放在名词前面：[en stor hund]。也可以放在 [er] 后面：[hunden er stor]。'},
   {html:`<div class="scene">${sent(['Hunden', 'løper.'], [null, 1.2])}<div class="fade sub" style="--d:1s">${A.bi('løper = verb ✖ (noe den gjør)', 'løper = 动词 ✖（它做的事）')}</div><div style="height:6px"></div>${sent(['Hunden', 'er', 'rask.'], [null, null, 3])}<div class="fade sub" style="--d:3s">${A.bi('rask = adjektiv ✔', 'rask = 形容词 ✔')}</div></div>`,
    no:'Pass på: løper er et verb. Det er noe hunden gjør. Rask er et adjektiv. Det sier hvordan hunden er.', zh:'注意：[løper]是动词，是狗做的事。[rask]是形容词，说明狗怎么样。'},
   {html:`<div class="scene"><div class="row">${card('🐶', 'hund', 'substantiv', '#f97316', .2)}${card('🏃', 'løpe', 'verb', '#0ea5e9', .9)}${card('⭐', 'stor', 'adjektiv', '#16a34a', 1.6)}</div></div>`,
    no:'Hund er et substantiv. Løpe er et verb. Stor er et adjektiv. Nå kan du se forskjellen!', zh:'[hund]是名词，[løpe]是动词，[stor]是形容词。现在你能分清它们了！'}
  ]},

adj_opp: {
  no:'Motsetninger', zh:'反义词', emoji:'↔️',
  scenes:[
   {html:title('↔️', 'Motsetninger', '反义词'), no:'Mange adjektiv har en motsetning. Det er et ord som betyr det motsatte.', zh:'很多形容词都有反义词。就是意思相反的词。'},
   {html:`<div class="scene"><div class="row">${pair('stor', 'liten', '🐘', '🐭', '大', '小', .2)}${pair('varm', 'kald', '🔥', '🧊', '热', '冷', 1.4)}${pair('ny', 'gammel', '🆕', '👴', '新', '旧', 2.6)}</div></div>`,
    no:'Stor og liten. Varm og kald. Ny og gammel.', zh:'[stor]和[liten]，大和小。[varm]和[kald]，热和冷。[ny]和[gammel]，新和旧。'},
   {html:`<div class="scene"><div class="row">${pair('rask', 'langsom', '🐇', '🐢', '快', '慢', .2)}${pair('lang', 'kort', '📏', '✂️', '长', '短', 1.4)}${pair('tung', 'lett', '🏋️', '🪶', '重', '轻', 2.6)}</div></div>`,
    no:'Rask og langsom. Lang og kort. Tung og lett.', zh:'[rask]和[langsom]，快和慢。[lang]和[kort]，长和短。[tung]和[lett]，重和轻。'},
   {html:`<div class="scene"><div class="row">${pair('glad', 'trist', '😄', '😢', '开心', '难过', .2)}${pair('billig', 'dyr', '🏷️', '💎', '便宜', '贵', 1.4)}${pair('ren', 'skitten', '✨', '🪣', '干净', '脏', 2.6)}</div></div>`,
    no:'Glad og trist. Billig og dyr. Ren og skitten.', zh:'[glad]和[trist]，开心和难过。[billig]和[dyr]，便宜和贵。[ren]和[skitten]，干净和脏。'},
   {html:`<div class="scene"><div class="row">${pair('høy', 'lav', '🗼', '🛖', '高', '矮', .2)}${pair('full', 'tom', '🍼', '🫙', '满', '空', 1.4)}${pair('god', 'dårlig', '👍', '👎', '好', '坏', 2.6)}</div></div>`,
    no:'Høy og lav. Full og tom. God og dårlig.', zh:'[høy]和[lav]，高和矮。[full]和[tom]，满和空。[god]和[dårlig]，好和坏。'},
   {html:`<div class="scene"><div class="bigword pop">stor ↔ ?</div><div class="bigword pop" style="--d:1.8s;color:#e11d48">liten ✔</div>${bubble(A.bi('Lær ordene i par!', '成对地学单词！'), 3)}</div>`,
    no:'Tips: lær adjektivene i par. Hvis du kan stor, kan du også liten. Da lærer du to ord på en gang!', zh:'小窍门：成对地学形容词。会了[stor]，也就会了[liten]。一次学两个词！'}
  ]},

adj_gender: {
  no:'Adjektiv med en, ei og et', zh:'形容词和 en、ei、et', emoji:'🎨',
  scenes:[
   {html:`<div class="scene"><div class="big-emoji bounce">🎨</div><h2 class="up">${A.bi('en stor hund · ei stor bok · et stort hus', '一只大狗 · 一本厚书 · 一座大房子')}</h2></div>`,
    no:'Adjektivet retter seg etter substantivet. Se: en stor hund, ei stor bok, et stort hus.', zh:'形容词要跟着名词变化。看：[en stor hund]，[ei stor bok]，[et stort hus]。'},
   {html:`<div class="scene"><div class="row">${ecard('en', 'stor', 'hund', .2, null, '🐕', 4)}${ecard('ei', 'stor', 'bok', 1.2, null, '📖', 4)}</div>${bubble(A.bi('en-ord og ei-ord: grunnformen', 'en 名词和 ei 名词：基本形式'), 2.4)}</div>`,
    no:'Foran et en-ord og et ei-ord bruker vi grunnformen. Stor. Det er likt for en og ei.', zh:'在 en 名词和 ei 名词前面，我们用基本形式[grunnform]：[stor]。en 和 ei 一样。'},
   {html:`<div class="scene"><div class="row">${ecard('et', 'stort', 'hus', .2, null, '🏠', 4)}${ecard('et', 'rødt', 'eple', 1.4, '#dc2626', '🍎')}${ecard('et', 'nytt', 'bilde', 2.6, null, '🖼️✨')}</div>${bubble(A.bi('et-ord: legg til -t', 'et 名词：加 -t'), 3.4)}</div>`,
    no:'Foran et et-ord legger vi oftest til t. Et stort hus. Et rødt eple. Et nytt bilde.', zh:'在 et 名词前面，通常要加 [t]。[et stort hus]，[et rødt eple]，[et nytt bilde]。'},
   {html:`<div class="scene"><div class="row">${arrow('stor', 'stort', .2)}${arrow('rød', 'rødt', 1.1)}${arrow('varm', 'varmt', 2)}${arrow('kald', 'kaldt', 2.9)}</div></div>`,
    no:'Stor, stort. Rød, rødt. Varm, varmt. Kald, kaldt.', zh:'[stor]，[stort]。[rød]，[rødt]。[varm]，[varmt]。[kald]，[kaldt]。'},
   {html:`<div class="scene"><div class="row">${arrow('hvit', 'hvitt', .2, '#9333ea')}${arrow('blå', 'blått', 1.1, '#9333ea')}${arrow('ny', 'nytt', 2, '#9333ea')}${arrow('søt', 'søtt', 2.9, '#9333ea')}</div>${bubble(A.bi('noen får to t-er: +tt', '有些要加两个 t：+tt'), 3.7)}</div>`,
    no:'Noen adjektiv får to t-er. Hvit, hvitt. Blå, blått. Ny, nytt. Søt, søtt.', zh:'有些形容词要双写 t。[hvit]，[hvitt]。[blå]，[blått]。[ny]，[nytt]。[søt]，[søtt]。'},
   {html:`<div class="scene"><div class="row">${arrow('grønn', 'grønt', .2, '#0d9488')}${arrow('snill', 'snilt', 1.2, '#0d9488')}${arrow('tynn', 'tynt', 2.2, '#0d9488')}</div>${bubble(A.bi('to like konsonanter blir én', '两个相同的辅音变成一个'), 3.2)}</div>`,
    no:'Når adjektivet slutter på to like konsonanter, blir det bare én. Grønn, grønt. Snill, snilt. Tynn, tynt.', zh:'形容词以两个相同的辅音结尾时，只保留一个。[grønn]，[grønt]。[snill]，[snilt]。[tynn]，[tynt]。'},
   {html:`<div class="scene"><div class="row">${ecard('et', 'billig', 'telt', .2, '#16a34a', '⛺🏷️')}${ecard('et', 'norsk', 'hus', 1.3, '#16a34a', '🏠🇳🇴')}${ecard('et', 'trist', 'barn', 2.4, '#16a34a', '😢')}</div>${bubble(A.bi('ingen -t etter -ig, -sk, -st', '-ig、-sk、-st 结尾：不加 t'), 3.4)}</div>`,
    no:'Men adjektiv på ig, sk og st får ikke t. Et billig telt. Et norsk hus. Et trist barn.', zh:'但是以 [ig]、[sk]、[st] 结尾的形容词不加 t。[et billig telt]，[et norsk hus]，[et trist barn]。'},
   {html:`<div class="scene"><div class="row">${chipRow([['en stor hund', '#2563eb'], ['ei stor bok', '#db2777'], ['et stort hus', '#16a34a']], .2)}</div>${bubble(A.bi('Lær adjektivet sammen med substantivet!', '把形容词和名词一起记！'), 2)}</div>`,
    no:'Tips: lær adjektivet sammen med substantivet. En stor hund. Ei stor bok. Et stort hus.', zh:'小窍门：把形容词和名词一起记。[en stor hund]，[ei stor bok]，[et stort hus]。'}
  ]},

adj_plural: {
  no:'Flertall og bestemt form', zh:'复数和定指形式', emoji:'➕',
  scenes:[
   {html:title('➕', 'Flertall og bestemt form', '复数和定指形式'), no:'Nå skal vi lære adjektiv i flertall og i bestemt form.', zh:'现在我们来学形容词的复数形式和定指形式。'},
   {html:`<div class="scene"><div class="row"><div class="vcard pop" style="--c:#9333ea;--d:.2s"><div class="e" style="font-size:3.4rem">🐕🐕</div><div class="l"><span style="color:${AC};font-weight:900">store</span> hunder</div></div><div class="vcard pop" style="--c:#9333ea;--d:1.2s"><div class="e">🍎🍎</div><div class="l"><span style="color:${AC};font-weight:900">røde</span> epler</div></div><div class="vcard pop" style="--c:#9333ea;--d:2.2s"><div class="e">🏚️🏚️</div><div class="l"><span style="color:${AC};font-weight:900">gamle</span> hus</div></div></div>${bubble(A.bi('flertall: legg til -e', '复数：加 -e'), 3)}</div>`,
    no:'I flertall legger vi til e. Store hunder. Røde epler. Gamle hus. Alle substantiv bruker samme form: en, ei og et.', zh:'复数加 [e]。[store hunder]，[røde epler]，[gamle hus]。不管是 en、ei 还是 et 名词，都用同一个形式。'},
   {html:`<div class="scene"><div class="row">${arrow('blå', 'blå', .2, '#9333ea')}${arrow('grå', 'grå', 1.2, '#9333ea')}</div>${bubble(A.bi('blå og grå får ikke -e', 'blå 和 grå 不加 -e'), 2)}<div class="fade" style="--d:3s"><div class="bigword sm">blå biler · grå hus</div></div></div>`,
    no:'Blå og grå er spesielle. De får ikke e. Blå biler. Grå hus.', zh:'[blå]和[grå]很特殊，不加 e。[blå biler]，[grå hus]。'},
   {html:`<div class="scene"><div class="row">${arrow('gammel', 'gamle', .2, '#a16207')}${arrow('åpen', 'åpne', 1.2, '#a16207')}${arrow('vakker', 'vakre', 2.2, '#a16207')}</div>${bubble(A.bi('e-en forsvinner', 'e 要去掉'), 3)}</div>`,
    no:'Noen adjektiv mister en e. Gammel, gamle. Åpen, åpne. Vakker, vakre.', zh:'有些形容词要去掉一个 e。[gammel]，[gamle]。[åpen]，[åpne]。[vakker]，[vakre]。'},
   {html:`<div class="scene"><div class="row">${ecard('en', 'stor', 'hund', .2, null, '🐕', 4)}<div class="vcard pop" style="--c:#0d9488;--d:1.4s"><div class="e" style="font-size:4rem">🐕</div><div class="l"><b style="color:#0d9488">den</b> <span style="color:${AC};font-weight:900">store</span> hunden</div></div></div>${bubble(A.bi('bestemt form: den + e-form + hunden', '定指形式：den + e 形式 + hunden'), 2.6)}</div>`,
    no:'Bestemt form. Vi vet hvilken hund. Da sier vi: den store hunden. Vi bruker den, adjektivet med e, og substantivet i bestemt form.', zh:'定指形式。我们知道说的是哪只狗，就说：[den store hunden]。要用 [den]，加 e 的形容词，和定指形式的名词。'},
   {html:`<div class="scene"><div class="row"><div class="vcard pop" style="--c:#2563eb;--d:.2s"><div class="e" style="font-size:3.4rem">🐕</div><div class="l"><b>den</b> store hunden</div></div><div class="vcard pop" style="--c:#16a34a;--d:1.2s"><div class="e" style="font-size:3.4rem">🏠</div><div class="l"><b>det</b> store huset</div></div><div class="vcard pop" style="--c:#9333ea;--d:2.2s"><div class="e" style="font-size:3rem">🐕🐕</div><div class="l"><b>de</b> store hundene</div></div></div></div>`,
    no:'Den for en-ord og ei-ord. Det for et-ord. De for flertall. Den store hunden. Det store huset. De store hundene.', zh:'en 名词和 ei 名词用 [den]，et 名词用 [det]，复数用 [de]。[den store hunden]，[det store huset]，[de store hundene]。'},
   {html:`<div class="scene">${chipRow([['stor → store', '#9333ea'], ['gammel → gamle', '#a16207'], ['blå → blå', '#2563eb']], .2)}${bubble(A.bi('Flertall og bestemt form bruker samme e-form!', '复数和定指形式用同一个 e 形式！'), 2)}</div>`,
    no:'Lett! Flertall og bestemt form bruker nesten alltid den samme e-formen.', zh:'很简单！复数和定指形式几乎总是用同一个 e 形式。'}
  ]},

adj_special: {
  no:'Spesielle adjektiv', zh:'特殊的形容词', emoji:'⭐',
  scenes:[
   {html:title('⭐', 'Spesielle adjektiv', '特殊的形容词'), no:'Noen adjektiv følger ikke de vanlige reglene. Dem må vi lære spesielt.', zh:'有些形容词不遵守一般规则，我们要特别记住它们。'},
   {html:`<div class="scene"><div class="row">${ecard('en', 'liten', 'fisk', .2, null, '🐟', 1.6)}${ecard('ei', 'lita', 'jente', 1.2, null, '👧', 1.6)}${ecard('et', 'lite', 'eple', 2.2, null, '🍎', 1.6)}<div class="vcard pop" style="--c:#9333ea;--d:3.2s"><div class="e" style="font-size:1.6rem">🐟🐟</div><div class="l"><span style="color:${AC};font-weight:900">små</span> fisker</div></div></div></div>`,
    no:'Liten er helt spesiell. En liten fisk. Ei lita jente. Et lite eple. Små fisker.', zh:'[liten]非常特殊。[en liten fisk]，[ei lita jente]，[et lite eple]，[små fisker]。'},
   {html:`<div class="scene"><div class="row"><div class="vcard pop" style="--c:#0d9488;--d:.2s"><div class="e" style="font-size:1.6rem">🐟</div><div class="l"><b>den</b> <span style="color:${AC};font-weight:900">lille</span> fisken</div></div><div class="vcard pop" style="--c:#0d9488;--d:1.2s"><div class="e" style="font-size:1.6rem">🍎</div><div class="l"><b>det</b> <span style="color:${AC};font-weight:900">lille</span> eplet</div></div><div class="vcard pop" style="--c:#0d9488;--d:2.2s"><div class="e" style="font-size:1.6rem">🐟🐟</div><div class="l"><b>de</b> <span style="color:${AC};font-weight:900">små</span> fiskene</div></div></div></div>`,
    no:'I bestemt form sier vi lille. Den lille fisken. Det lille eplet. Men i flertall sier vi små: de små fiskene.', zh:'定指形式用 [lille]：[den lille fisken]，[det lille eplet]。复数用 [små]：[de små fiskene]。'},
   {html:`<div class="scene"><div class="row">${arrow('hvit', 'hvitt', .2, '#9333ea')}${arrow('blå', 'blått', 1.1, '#9333ea')}${arrow('grå', 'grått', 2, '#9333ea')}</div>${bubble(A.bi('+tt, og blå og grå får ikke -e', '+tt；blå 和 grå 复数不加 -e'), 2.9)}</div>`,
    no:'Hvit, hvitt. Blå, blått. Grå, grått. Og blå og grå får ikke e i flertall.', zh:'[hvit]，[hvitt]。[blå]，[blått]。[grå]，[grått]。[blå]和[grå]的复数不加 e。'},
   {html:`<div class="scene"><div class="row">${arrow('gammel', 'gamle', .2, '#a16207')}${arrow('åpen', 'åpne', 1.2, '#a16207')}${arrow('sulten', 'sultne', 2.2, '#a16207')}${arrow('vakker', 'vakre', 3.2, '#a16207')}</div>${bubble(A.bi('-el, -en, -er: e-en forsvinner', '-el、-en、-er：e 要去掉'), 4)}</div>`,
    no:'Adjektiv på el, en og er mister e-en i flertall: gamle, åpne, sultne, vakre.', zh:'以 [el]、[en]、[er] 结尾的形容词，复数要去掉 e：[gamle]，[åpne]，[sultne]，[vakre]。'},
   {html:`<div class="scene"><div class="row">${arrow('tom', 'tomme', .2, '#ec4899')}${arrow('morsom', 'morsomme', 1.4, '#ec4899')}${arrow('langsom', 'langsomme', 2.6, '#ec4899')}</div>${bubble(A.bi('-m: m-en dobles', '-m：m 要双写'), 3.4)}</div>`,
    no:'Adjektiv på m dobler m-en i flertall: tomme, morsomme, langsomme.', zh:'以 [m] 结尾的形容词，复数要双写 m：[tomme]，[morsomme]，[langsomme]。'},
   {html:`<div class="scene"><div class="row">${ecard('et', 'billig', 'telt', .2, null, '⛺🏷️')}${ecard('et', 'norsk', 'hus', 1.2, null, '🏠🇳🇴')}${ecard('et', 'kinesisk', 'barn', 2.2, null, '🧒🇨🇳')}${ecard('et', 'svart', 'tog', 3.2, null, '🚆⚫')}</div>${bubble(A.bi('ingen endring i et-form', 'et 形式不变'), 4)}</div>`,
    no:'Noen adjektiv blir ikke endret foran et-ord: et billig telt, et norsk hus, et kinesisk barn, et svart tog.', zh:'有些形容词用在 et 名词前不变：[et billig telt]，[et norsk hus]，[et kinesisk barn]，[et svart tog]。'}
  ]},

adj_cmp: {
  no:'Sammenligning', zh:'比较', emoji:'📊',
  scenes:[
   {html:title('📊', 'stor – større – størst', 'stor – større – størst'), no:'Vi kan sammenligne med adjektiv. Stor, større, størst.', zh:'我们可以用形容词做比较。[stor]，[større]，[størst]。'},
   {html:`<div class="scene"><div class="row"><div class="vcard pop" style="--c:#16a34a;--d:.2s"><div class="e" style="font-size:2.2rem">🐕</div><div class="l">stor</div></div><div class="vcard pop" style="--c:#14b8a6;--d:1.2s"><div class="e" style="font-size:3.4rem">🐎</div><div class="l">større</div></div><div class="vcard pop" style="--c:#7c3aed;--d:2.2s"><div class="e" style="font-size:4.8rem">🐘</div><div class="l">størst</div></div></div></div>`,
    no:'Hunden er stor. Hesten er større. Elefanten er størst.', zh:'狗很大，[stor]。马更大，[større]。大象最大，[størst]。'},
   {html:`<div class="scene"><div class="row">${pcard('rask', '🚲', .2)}${pcard('raskere', '🚗', 1.2, '#14b8a6')}${pcard('raskest', '✈️', 2.2, '#7c3aed')}</div>${bubble(A.bi('+ere  og  +est', '+ere 和 +est'), 2.2)}</div>`,
    no:'Det er enkelt. Legg til ere for mer. Legg til est for mest. Rask, raskere, raskest.', zh:'很简单。加 [ere] 表示更……，加 [est] 表示最……。[rask]，[raskere]，[raskest]。'},
   {html:`<div class="scene"><div class="bigword pop">🐘 Elefanten er <b style="color:#14b8a6">større enn</b> musa 🐭.</div>${bubble(A.bi('enn = 比', 'enn = 比'), 1.6)}<div class="bigword pop" style="--d:2.6s">🐕 Hunden er <b style="color:#2563eb">like stor som</b> katten 🐈.</div>${bubble(A.bi('like … som = 和……一样', 'like … som = 和……一样'), 3.6)}</div>`,
    no:'Vi sier større enn. Elefanten er større enn musa. Og like stor som, når to ting er like. Hunden er like stor som katten.', zh:'比较级后面用 [enn]：[Elefanten er større enn musa]。两样东西一样大，用 [like … som]：[Hunden er like stor som katten]。'},
   {html:`<div class="scene"><div class="bigword pop">🐘 Elefanten er <b style="color:#7c3aed">størst</b> av alle dyr.</div>${bubble(A.bi('av alle = 所有里', 'av alle = 所有里'), 1.8)}</div>`,
    no:'Og når noe er mest av alle, bruker vi superlativ. Elefanten er størst av alle dyr.', zh:'当某样东西在所有里是最……的，就用最高级[superlativ]。[Elefanten er størst av alle dyr.]'},
   {html:`<div class="scene"><div class="row">${pcard('god · bedre · best', '👍 👍👍 🏆', .2, '#e11d48')}${pcard('liten · mindre · minst', '🐘 🐕 🐜', 1.2, '#e11d48')}${pcard('gammel · eldre · eldst', '🧒 👨 👴', 2.2, '#e11d48')}${pcard('dårlig · verre · verst', '😕 😟 😡', 3.2, '#e11d48')}</div>${bubble(A.bi('Disse må vi lære utenat!', '这些要背下来！'), 4)}</div>`,
    no:'Noen er uregelmessige. God, bedre, best. Liten, mindre, minst. Gammel, eldre, eldst. Dårlig, verre, verst.', zh:'有些是不规则的。[god]，[bedre]，[best]。[liten]，[mindre]，[minst]。[gammel]，[eldre]，[eldst]。[dårlig]，[verre]，[verst]。'},
   {html:`<div class="scene"><div class="vcard pop" style="--c:#0ea5e9;--d:.2s"><div class="e">📖</div><div class="l">interessant · <b>mer</b> interessant · <b>mest</b> interessant</div></div>${bubble(A.bi('lange adjektiv: mer og mest', '长的形容词：mer 和 mest'), 1.6)}</div>`,
    no:'Lange adjektiv bruker mer og mest. Interessant, mer interessant, mest interessant.', zh:'较长的形容词用 [mer] 和 [mest]。[interessant]，[mer interessant]，[mest interessant]。'}
  ]},

adj_sent: {
  no:'Adjektiv i setninger', zh:'句子里的形容词', emoji:'🏆',
  scenes:[
   {html:title('🏆', 'Adjektiv i setninger', '句子里的形容词'), no:'Nå skal vi bruke adjektivene i hele setninger.', zh:'现在我们把形容词用到完整的句子里。'},
   {html:`<div class="scene"><div class="row"><div class="vcard pop" style="--c:#2563eb;--d:.2s"><div class="e">🐶</div><div class="l">Hunden er <b style="color:${AC}">stor</b>.</div></div><div class="vcard pop" style="--c:#16a34a;--d:1.4s"><div class="e">🏠</div><div class="l">Huset er <b style="color:${AC}">stort</b>.</div></div><div class="vcard pop" style="--c:#9333ea;--d:2.6s"><div class="e">🏠🏠</div><div class="l">Husene er <b style="color:${AC}">store</b>.</div></div></div></div>`,
    no:'Etter er retter adjektivet seg også. Hunden er stor. Huset er stort. Husene er store.', zh:'在 [er] 后面，形容词也要跟着变。[Hunden er stor.]，[Huset er stort.]，[Husene er store.]'},
   {html:`<div class="scene">${phr('en', 'stor', 'hund', .3)}<div class="pop" style="--d:1.2s"><div class="bigword" style="white-space:nowrap">${A.artChip('en')}<span style="color:${AC};border-bottom:4px solid ${AC}">stor</span><span style="color:#0ea5e9">,</span> <span style="color:#dc2626;border-bottom:4px solid #dc2626">rød</span> bil</div></div>${bubble(A.bi('Begge adjektivene får samme form.', '两个形容词用相同的形式。'), 2.2)}</div>`,
    no:'Vi kan bruke to adjektiv. En stor, rød bil. Begge adjektivene får samme form.', zh:'我们可以用两个形容词。[en stor, rød bil]。两个形容词用相同的形式。'},
   {html:`<div class="scene"><div class="bigword pop">Et <b style="color:${AC}">stort</b>, <b style="color:#dc2626">rødt</b> hus.</div><div class="bigword pop" style="--d:1.6s">Store, røde hus.</div></div>`,
    no:'Et stort, rødt hus. Store, røde hus. Husk å endre begge!', zh:'[Et stort, rødt hus.]，[Store, røde hus.]记得两个都要变！'},
   {html:`<div class="scene"><div class="row">${card('1️⃣', 'Hvilket substantiv?', '哪个名词？', '#f97316', .2)}${card('2️⃣', 'en, ei, et eller flertall?', 'en、ei、et 还是复数？', '#16a34a', 1.2)}${card('3️⃣', 'Velg riktig form', '选出正确的形式', '#9333ea', 2.2)}</div></div>`,
    no:'Slik gjør du. Ett: finn substantivet. To: er det en, ei, et eller flertall? Tre: velg riktig form av adjektivet.', zh:'这样做。第一步：找到名词。第二步：它是 en、ei、et 还是复数？第三步：选出形容词的正确形式。'},
   {html:title('🎉', 'Nå kan du adjektiv!', '你已经会形容词了！'), no:'Flott! Nå kan du bruke adjektiv i setninger. Øv litt hver dag, så blir du enda tryggere!', zh:'太棒了！你现在会在句子里用形容词了。每天练一点，你会更有把握！'}
  ]}
});
})();
