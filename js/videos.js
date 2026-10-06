(function(){
'use strict';
const A = window.App;
const W = n => A.WORDS.find(w => w.no === n);

/* små byggeklosser til scenene */
const card = (e, l, z, c, d) => `<div class="vcard pop" style="--c:${c};--d:${d}s"><div class="e">${e}</div><div class="l">${l}</div><div class="z">${z}</div></div>`;
const gcard = (name, d) => { const w = W(name); const c = A.GEN[w.art].color;
  return `<div class="vcard pop" style="--c:${c};--d:${d}s"><div class="e">${w.emoji}</div><div class="l">${A.artChip(w.art)}${w.no}</div><div class="z">${w.zh}</div></div>`; };
const fcard = (name, key, d) => { const w = W(name); const f = A.formMeta(key);
  return `<div class="vcard pop" style="--c:${f.color};--d:${d}s">${A.fv(w, key, true)}<div class="l">${A.wordHTML(w, key)}</div></div>`; };
const title = (emoji, no, zh, extra) => `<div class="scene"><div class="big-emoji bounce">${emoji}</div><h2 class="up">${A.bi(no, zh)}</h2>${extra || ''}</div>`;
const bubble = (h, d) => `<div class="pop sub" style="--d:${d || 0}s">${h}</div>`;
const chipRow = (list, d0) => `<div class="row">${list.map((c, i) => `<span class="chip pop" style="--c:${c[1]};--d:${(d0 || 0) + i * .5}s;font-size:1.5rem">${c[0]}</span>`).join('')}</div>`;
const sent = (toks, hlDelays) => `<div class="bigword" style="line-height:1.9">${toks.map((t, i) => `<span class="${hlDelays[i] != null ? 'hl' : ''}" style="--d:${hlDelays[i] || 0}s;border-radius:10px;padding:2px 6px">${t}</span>`).join(' ')}</div>`;

const catCards = d0 => `<div class="row">${card('👧','person','人','#2563eb',d0)}${card('🐶','dyr','动物','#16a34a',d0+.7)}${card('🚗','ting','东西','#d97706',d0+1.4)}${card('🏫','sted','地方','#9333ea',d0+2.1)}</div>`;

A.VIDEOS = {
why: {
  no:'Hvorfor lære substantiv?', zh:'为什么要学名词？', emoji:'💡',
  scenes:[
   {html: title('📚','Hvorfor lære substantiv?','为什么要学名词？'),
    no:'Hei! Hvorfor skal vi lære substantiv? Her kommer svaret.', zh:'你好！我们为什么要学名词？答案马上就来。'},
   {html:`<div class="scene"><div class="row"><div class="big-emoji pop">😋</div><div class="big-emoji pop" style="--d:.8s">🍎</div><div class="big-emoji pop" style="--d:1.6s">❓</div></div>${bubble(A.bi('Jeg vil ha et … ?','我想要一个……？'),2)}</div>`,
    no:'Tenk deg at du er sulten. Du vil ha et eple. Men du kjenner ikke ordet eple. Da får du ikke eplet.', zh:'想象你饿了，想要一个苹果。可是你不知道[eple]这个词。那你就拿不到苹果。'},
   {html:`<div class="scene">${catCards(.2)}${bubble(A.bi('substantiv','名词'), 2.9)}</div>`,
    no:'Ord for personer, dyr, ting og steder heter substantiv. Substantiv er navn på alt rundt oss.', zh:'表示人、动物、东西和地方的词，叫做名词，也就是[substantiv]。名词就是我们周围一切事物的名字。'},
   {html:`<div class="scene"><div class="row">${card('🏫','på skolen','在学校','#2563eb',.2)}${card('🏪','i butikken','在商店','#d97706',1)}${card('🏠','hjemme','在家里','#16a34a',1.8)}${card('🏥','hos legen','在医院','#dc2626',2.6)}</div></div>`,
    no:'Vi bruker substantiv hele dagen. På skolen. I butikken. Hjemme. Og hos legen.', zh:'我们一整天都在用名词。在学校、在商店、在家里，还有在医院。'},
   {html:`<div class="scene"><div class="row">${fcard('bil','ue',.2)}${fcard('bil','be',1.5)}${fcard('bil','uf',2.8)}${fcard('bil','bf',4.1)}</div></div>`,
    no:'På norsk endrer substantivene seg. Vi sier en bil, bilen, biler og bilene. Det er fire former!', zh:'在挪威语里，名词会变化。我们说[en bil]、[bilen]、[biler]、[bilene]。一共有四种形式！'},
   {html:`<div class="scene"><div class="bigword pop" style="color:#dc2626">✖ Jeg ser bil.</div><div class="bigword pop" style="--d:2.2s;color:#16a34a">✔ Jeg ser en bil.</div></div>`,
    no:'Hvis vi bruker feil form, høres det rart ut. Jeg ser bil, er feil. Jeg ser en bil, er riktig.', zh:'如果用错形式，听起来会很奇怪。[Jeg ser bil]是错的。[Jeg ser en bil]才是对的。'},
   {html:`<div class="scene"><div class="row"><div class="big-emoji pop">💬</div><div class="big-emoji pop" style="--d:.6s">📖</div><div class="big-emoji pop" style="--d:1.2s">✍️</div></div>${bubble(A.bi('snakke · lese · skrive','说 · 读 · 写'),1.8)}</div>`,
    no:'Når du kan substantiv, kan du snakke, lese og skrive mye bedre. Og du kan snakke med vennene dine på norsk!', zh:'学会了名词，你就能说得更好、读得更好，也写得更好。你还能用挪威语和朋友聊天！'},
   {html: title('🚀','Er du klar?','准备好了吗？'),
    no:'Vi lærer litt om gangen. Vi øver mye. Og vi gjentar det vi har lært. Er du klar? Nå starter vi!', zh:'我们一点一点地学，多多练习，还会反复复习。准备好了吗？我们开始吧！'}
  ]},

what: {
  no:'Hva er et substantiv?', zh:'什么是名词？', emoji:'🔎',
  scenes:[
   {html:`<div class="scene"><div class="big-emoji bounce">🔎</div><div class="row"><span class="syl pop" style="--d:.2s">sub</span><span class="syl pop" style="--d:1.2s">stan</span><span class="syl pop" style="--d:2.2s">tiv</span></div><h2 class="fade" style="--d:3s">${A.bi('substantiv','名词')}</h2></div>`,
    no:'Substantiv. Si det etter meg. Sub. Stan. Tiv. Substantiv!', zh:'名词，挪威语叫[substantiv]。跟我读：[sub]，[stan]，[tiv]，[substantiv]！'},
   {html:`<div class="scene">${catCards(.2)}</div>`,
    no:'Et substantiv er et ord for en person, et dyr, en ting eller et sted.', zh:'名词是表示人、动物、东西或地方的词。'},
   {html:`<div class="scene">${bubble(A.bi('person','人'),0)}<div class="row">${gcard('gutt',.3)}${gcard('jente',1)}${gcard('lærer',1.7)}${gcard('venn',2.4)}</div></div>`,
    no:'Personer. En gutt. Ei jente. En lærer. En venn. Alle er substantiv.', zh:'人。男孩、女孩、老师、朋友，都是名词。'},
   {html:`<div class="scene">${bubble(A.bi('dyr','动物'),0)}<div class="row">${gcard('hund',.3)}${gcard('katt',1)}${gcard('fisk',1.7)}${gcard('fugl',2.4)}</div></div>`,
    no:'Dyr. En hund. En katt. En fisk. En fugl. Alle er substantiv.', zh:'动物。狗、猫、鱼、鸟，都是名词。'},
   {html:`<div class="scene">${bubble(A.bi('ting','东西'),0)}<div class="row">${gcard('bil',.3)}${gcard('ball',1)}${gcard('bok',1.7)}${gcard('eple',2.4)}</div></div>`,
    no:'Ting. En bil. En ball. Ei bok. Et eple. Alle er substantiv.', zh:'东西。汽车、球、书、苹果，都是名词。'},
   {html:`<div class="scene">${bubble(A.bi('sted','地方'),0)}<div class="row">${gcard('skole',.3)}${gcard('butikk',1)}${gcard('park',1.7)}${gcard('by',2.4)}</div></div>`,
    no:'Steder. En skole. En butikk. En park. En by. Alle er substantiv.', zh:'地方。学校、商店、公园、城市，都是名词。'},
   {html:`<div class="scene"><div class="bigword pop" style="color:#16a34a">✔ ${A.artChip('en')} hund</div><div class="bigword pop" style="--d:2.4s;color:#dc2626">✖ ${A.artChip('en')} løpe</div></div>`,
    no:'Her er en test. Kan du si en, ei eller et foran ordet? En hund. Ja! Det er et substantiv. En løpe. Nei! Det er ikke et substantiv.', zh:'这里有个小测试：你能在这个词前面加 [en]、[ei] 或 [et] 吗？[en hund]，可以！是名词。[en løpe]，不行！不是名词。'},
   {html:`<div class="scene"><div class="row">${card('🏃','løpe · spise · sove','动词：做的事','#0ea5e9',.2)}${card('🐘','stor · rød · glad','形容词：怎么样','#22c55e',1.4)}</div>${bubble(A.bi('verb og adjektiv er ikke substantiv','动词和形容词不是名词'),2.8)}</div>`,
    no:'Løpe, spise og sove er verb. Det er noe du gjør. Stor, rød og glad er adjektiv. De sier hvordan noe er. Verb og adjektiv er ikke substantiv.', zh:'[løpe]、[spise]、[sove]是动词，表示做的事。[stor]、[rød]、[glad]是形容词，表示事物怎么样。动词和形容词不是名词。'},
   {html:`<div class="scene"><div class="row">${card('🧑','Ola','男孩的名字','#e11d48',.2)}${card('🐕','Pelle','狗的名字','#e11d48',1)}${card('🌍','Norge','国家的名字','#e11d48',1.8)}${card('🏙️','Oslo','城市的名字','#e11d48',2.6)}</div>${bubble(A.bi('egennavn = STOR bokstav!','专有名词 = 大写字母开头！'),3.4)}</div>`,
    no:'Noen substantiv er navn på en bestemt person, et dyr eller et sted. De heter egennavn. Ola. Pelle. Norge. Oslo. Egennavn skriver vi alltid med stor bokstav!', zh:'有些名词是特定的人、动物或地方的名字，叫做专有名词，挪威语是[egennavn]。[Ola]，[Pelle]，[Norge]，[Oslo]。专有名词一定要用大写字母开头！'},
   {html:`<div class="scene"><div class="row">${card('📅','mandag, juni','星期、月份','#6b7280',.2)}${card('🗣️','norsk, kinesisk','语言','#6b7280',1)}</div>${bubble(A.bi('liten bokstav!','小写字母！'),2)}</div>`,
    no:'Men pass på! Ukedager, måneder og språk skriver vi med liten bokstav. Mandag. Juni. Norsk. Kinesisk.', zh:'但是要注意！星期、月份和语言要用小写字母。[mandag]，[juni]，[norsk]，[kinesisk]。'},
   {html: title('🌟','Substantiv!','名词！',`<div class="sub fade" style="--d:.8s">${A.bi('person · dyr · ting · sted','人 · 动物 · 东西 · 地方')}</div>`),
    no:'Substantiv! Person, dyr, ting, sted. Si det en gang til: substantiv!', zh:'名词！人、动物、东西、地方。再说一遍：[substantiv]！'}
  ]},

gender: {
  no:'en, ei og et', zh:'en、ei 和 et', emoji:'🎨',
  scenes:[
   {html:`<div class="scene"><div class="big-emoji bounce">🧩</div>${chipRow([['en','#2563eb'],['ei','#db2777'],['et','#16a34a']],.3)}</div>`,
    no:'Alle norske substantiv har en liten venn foran seg: en, ei eller et.', zh:'每个挪威语名词前面都有一个小伙伴：[en]、[ei]或[et]。'},
   {html:`<div class="scene"><span class="chip" style="--c:#2563eb;font-size:1.6rem">en-ord</span><div class="row">${gcard('hund',.3)}${gcard('bil',1)}${gcard('stol',1.7)}</div></div>`,
    no:'Blå en. En hund. En bil. En stol. Dette er en-ord.', zh:'蓝色的 [en]。[en hund]，[en bil]，[en stol]。这些是 en 名词。'},
   {html:`<div class="scene"><span class="chip" style="--c:#db2777;font-size:1.6rem">ei-ord</span><div class="row">${gcard('jente',.3)}${gcard('bok',1)}${gcard('dør',1.7)}</div></div>`,
    no:'Rosa ei. Ei jente. Ei bok. Ei dør. Dette er ei-ord.', zh:'粉色的 [ei]。[ei jente]，[ei bok]，[ei dør]。这些是 ei 名词。'},
   {html:`<div class="scene"><span class="chip" style="--c:#16a34a;font-size:1.6rem">et-ord</span><div class="row">${gcard('hus',.3)}${gcard('eple',1)}${gcard('barn',1.7)}</div></div>`,
    no:'Grønn et. Et hus. Et eple. Et barn. Dette er et-ord.', zh:'绿色的 [et]。[et hus]，[et eple]，[et barn]。这些是 et 名词。'},
   {html:`<div class="scene"><div class="big-emoji pop">🤷</div><div class="bigword pop" style="--d:.8s">${A.artChip('en')} hund &nbsp;✔</div>${bubble(A.bi('Lær ordet sammen med en, ei eller et!','把单词和 en、ei、et 一起记！'),1.8)}</div>`,
    no:'Hvorfor? Det er bare slik. Lær ordet sammen med en, ei eller et. Ikke bare hund. En hund!', zh:'为什么？没有为什么，就是这样。记单词的时候，要把 [en]、[ei] 或 [et] 一起记。不要只记[hund]，要记[en hund]！'},
   {html:`<div class="scene"><div class="big-emoji bounce">💡</div>${bubble(A.bi('Usikker? Mange ord er en-ord.','不确定？很多词是 en 名词。'),.2)}${bubble(A.bi('Vi øver likevel på ei.','但我们还是要练习用 ei。'),1.6)}</div>`,
    no:'Et lite tips. Er du usikker, kan du ofte si en. Mange ord er en-ord. Mange ei-ord kan også bruke en i bokmål. Men vi øver på ei.', zh:'一个小提示：不确定的时候，常常可以用 [en]，因为很多词是 en 名词。在书面挪威语里，很多 ei 名词也可以用 [en]。不过我们还是要练习用 [ei]。'},
   {html:`<div class="scene"><div class="row">${gcard('hund',.2)}${gcard('jente',1.4)}${gcard('hus',2.6)}</div></div>`,
    no:'Oppsummering. En er blå. Ei er rosa. Et er grønn. Si: en hund. Ei jente. Et hus.', zh:'总结。[en]是蓝色，[ei]是粉色，[et]是绿色。跟我读：[en hund]，[ei jente]，[et hus]。'}
  ]},

plural: {
  no:'Entall og flertall', zh:'单数和复数', emoji:'➕',
  scenes:[
   {html:`<div class="scene"><div class="row">${fcard('bil','ue',.2)}<div class="big-emoji pop" style="--d:.8s">➡️</div>${fcard('bil','uf',1.4)}</div><h2 class="fade" style="--d:2s">${A.bi('entall · flertall','单数 · 复数')}</h2></div>`,
    no:'Entall betyr én. Flertall betyr mange.', zh:'[entall]就是一个，单数。[flertall]就是很多个，复数。'},
   {html:`<div class="scene">${fcard('bil','ue',.2)}<div class="bigword fade" style="--d:1s">1 = ${A.bi('entall','单数')}</div></div>`,
    no:'Entall. En bil. Bare én.', zh:'单数。[en bil]。只有一个。'},
   {html:`<div class="scene">${fcard('bil','uf',.2)}<div class="bigword fade" style="--d:1s">3 = ${A.bi('flertall','复数')}</div></div>`,
    no:'Flertall. Biler. Mange biler.', zh:'复数。[biler]。很多辆车。'},
   {html:`<div class="scene">${bubble(A.bi('De fleste ord får -er','大多数词加 -er'),0)}<div class="row">${['bil','jente','hund'].map((n,i)=>{const w=W(n);return `<div class="vcard pop" style="--c:#9333ea;--d:${.6+i*.8}s"><div class="e">${w.emoji}</div><div class="l">${A.label(w,'ue')}</div><div class="l">→ ${A.wordHTML(w,'uf')}</div></div>`}).join('')}</div></div>`,
    no:'De fleste ord får er på slutten. En bil, biler. Ei jente, jenter. En hund, hunder.', zh:'大多数词在结尾加 [er]。[en bil]，[biler]。[ei jente]，[jenter]。[en hund]，[hunder]。'},
   {html:`<div class="scene">${bubble(A.bi('Noen ord får ingenting!','有些词什么也不加！'),0)}<div class="row">${['hus','dyr','mus'].map((n,i)=>{const w=W(n);return `<div class="vcard pop" style="--c:#9333ea;--d:${.6+i*.8}s"><div class="e">${w.emoji}</div><div class="l">${A.label(w,'ue')}</div><div class="l">→ ${w.uf}</div></div>`}).join('')}</div></div>`,
    no:'Noen ord får ingenting! Et hus, to hus. Et dyr, to dyr. Ei mus, to mus.', zh:'有些词什么也不加！[et hus]，[to hus]。[et dyr]，[to dyr]。[ei mus]，[to mus]。'},
   {html:`<div class="scene">${bubble(A.bi('Noen ord endrer seg mye','有些词变化很大'),0)}<div class="row">${['mann','bok','tre','ku'].map((n,i)=>{const w=W(n);return `<div class="vcard pop" style="--c:#9333ea;--d:${.6+i*.8}s"><div class="e">${w.emoji}</div><div class="l">${A.label(w,'ue')}</div><div class="l">→ ${w.uf}</div></div>`}).join('')}</div></div>`,
    no:'Noen ord endrer seg mye. En mann, to menn. Ei bok, to bøker. Et tre, to trær. Ei ku, to kyr. Disse må vi huske.', zh:'有些词变化很大。[en mann]，[to menn]。[ei bok]，[to bøker]。[et tre]，[to trær]。[ei ku]，[to kyr]。这些要特别记住。'},
   {html:`<div class="scene"><div class="bigword pop">2 ${W('bil').uf}</div><div class="bigword pop" style="--d:.8s">3 ${W('hund').uf}</div><div class="bigword pop" style="--d:1.6s">${A.m('mange')} ${W('barn').uf}</div></div>`,
    no:'Tips: Etter to, tre og mange bruker vi flertall. To biler. Tre hunder. Mange barn.', zh:'小提示：在 [to]（二）、[tre]（三）和 [mange]（很多）后面，用复数形式。[to biler]，[tre hunder]，[mange barn]。'},
   {html: title('🌟','Entall og flertall','单数和复数',`<div class="row fade" style="--d:.6s">${fcard('katt','ue',0)}${fcard('katt','uf',0)}</div>`),
    no:'Oppsummering. Entall er én. En katt. Flertall er mange. Katter. Si det: en katt, katter.', zh:'总结。单数是一个：[en katt]。复数是很多个：[katter]。跟我读：[en katt]，[katter]。'}
  ]},

definite: {
  no:'Ubestemt og bestemt', zh:'不定和定指', emoji:'🔦',
  scenes:[
   {html:`<div class="scene"><div class="big-emoji bounce">🔦</div><h2 class="up">${A.bi('ubestemt · bestemt','不定 · 定指')}</h2></div>`,
    no:'Nå lærer vi to nye ord: ubestemt og bestemt.', zh:'现在我们学两个新词：[ubestemt]（不定）和[bestemt]（定指）。'},
   {html:`<div class="scene"><div class="row"><div class="big-emoji pop">🐶</div><div class="big-emoji pop" style="--d:.4s">🐕</div><div class="big-emoji pop" style="--d:.8s">🐩</div></div><div class="bigword fade" style="--d:1.2s;color:var(--ue)">Jeg ser en hund. ❓</div>${bubble(A.bi('ubestemt – vi vet ikke hvilken','不定 – 不知道是哪一个'),2)}</div>`,
    no:'Jeg ser en hund. Hvilken hund? Vi vet ikke. Det er ubestemt.', zh:'[Jeg ser en hund]。哪一只狗？我们不知道。这叫[ubestemt]，不特指。'},
   {html:`<div class="scene">${fcard('hund','be',.2)}<div class="bigword fade" style="--d:1s;color:var(--be)">Hunden er brun. 🎯</div>${bubble(A.bi('bestemt – vi vet hvilken','定指 – 知道是哪一个'),1.8)}</div>`,
    no:'Hunden er brun. Hvilken hund? Den hunden! Vi vet hvilken. Det er bestemt.', zh:'[Hunden er brun]。哪一只狗？就是那一只！我们知道是哪一只。这叫[bestemt]，特指。'},
   {html:`<div class="scene"><div class="row">${['hund','jente','hus'].map((n,i)=>{const w=W(n);return `<div class="vcard pop" style="--c:var(--be);--d:${.3+i*1.1}s"><div class="e">${w.emoji}</div><div class="l">${A.label(w,'ue')}</div><div class="l">↓</div><div class="l" style="font-size:1.5rem">${A.wordHTML(w,'be')}</div></div>`}).join('')}</div></div>`,
    no:'Bestemt form får en ending bakpå ordet. En hund blir hunden. Ei jente blir jenta. Et hus blir huset.', zh:'定指形式是在词的后面加一个结尾。[en hund]变成[hunden]。[ei jente]变成[jenta]。[et hus]变成[huset]。'},
   {html:`<div class="scene"><div class="row"><div class="vcard pop" style="--c:#2563eb;--d:.2s"><div class="l">${A.artChip('en')} en-ord</div><div class="bigword sm">+ <span class="endg" style="color:#2563eb">en</span></div></div><div class="vcard pop" style="--c:#db2777;--d:1.2s"><div class="l">${A.artChip('ei')} ei-ord</div><div class="bigword sm">+ <span class="endg" style="color:#db2777">a</span></div></div><div class="vcard pop" style="--c:#16a34a;--d:2.2s"><div class="l">${A.artChip('et')} et-ord</div><div class="bigword sm">+ <span class="endg" style="color:#16a34a">et</span></div></div></div></div>`,
    no:'Regelen er enkel. En-ord får en. Ei-ord får a. Et-ord får et.', zh:'规则很简单。en 名词加 [-en]，ei 名词加 [-a]，et 名词加 [-et]。'},
   {html:`<div class="scene"><div class="row">${fcard('bil','uf',.2)}<div class="big-emoji pop" style="--d:.9s">➡️</div>${fcard('bil','bf',1.4)}</div>${bubble(A.bi('flertall + ene','复数 + ene'),2.4)}</div>`,
    no:'Og i flertall? Biler blir bilene. Alle bilene! Slutten er ene. Barn blir barna, det er litt spesielt.', zh:'复数呢？[biler]变成[bilene]，那些车！结尾是 [-ene]。[barn]变成[barna]，这个比较特别。'},
   {html:`<div class="scene"><div class="row">${fcard('katt','ue',.2)}${fcard('katt','be',1.2)}</div><div class="bigword fade" style="--d:2s">en katt → katten</div></div>`,
    no:'Oppsummering. Ubestemt: en katt. Bestemt: katten. Vi vet hvilken katt!', zh:'总结。不定：[en katt]。定指：[katten]。我们知道是哪一只猫！'}
  ]},

forms: {
  no:'De fire formene', zh:'四种形式', emoji:'4️⃣',
  scenes:[
   {html:`<div class="scene"><div class="row">${fcard('bil','ue',.2)}${fcard('bil','be',.8)}${fcard('bil','uf',1.4)}${fcard('bil','bf',2)}</div><h2 class="fade" style="--d:2.6s">${A.bi('4 former','4 种形式')}</h2></div>`,
    no:'Hvert substantiv har fire former. Vi må lære navnene på dem!', zh:'每个名词有四种形式。我们要学会它们的名字！'},
   {html:`<div class="scene">${fcard('bil','ue',.2)}${A.formChip('ue')}<div class="sub fade" style="--d:.8s">${A.bi('Én bil. Vi vet ikke hvilken.','一辆车，不知道是哪一辆。')}</div></div>`,
    no:'Ubestemt entall. En bil. Én bil, vi vet ikke hvilken.', zh:'[ubestemt entall]，不定单数。[en bil]。一辆车，不知道是哪一辆。'},
   {html:`<div class="scene">${fcard('bil','be',.2)}${A.formChip('be')}<div class="sub fade" style="--d:.8s">${A.bi('Den ene bilen vi vet om.','我们知道的那一辆车。')}</div></div>`,
    no:'Bestemt entall. Bilen. Den ene bilen vi vet om.', zh:'[bestemt entall]，定指单数。[bilen]。我们知道的那一辆车。'},
   {html:`<div class="scene">${fcard('bil','uf',.2)}${A.formChip('uf')}<div class="sub fade" style="--d:.8s">${A.bi('Mange biler. Vi vet ikke hvilke.','很多辆车，不知道是哪些。')}</div></div>`,
    no:'Ubestemt flertall. Biler. Mange biler.', zh:'[ubestemt flertall]，不定复数。[biler]。很多辆车。'},
   {html:`<div class="scene">${fcard('bil','bf',.2)}${A.formChip('bf')}<div class="sub fade" style="--d:.8s">${A.bi('Alle bilene vi vet om.','我们知道的那些车。')}</div></div>`,
    no:'Bestemt flertall. Bilene. Alle bilene vi vet om.', zh:'[bestemt flertall]，定指复数。[bilene]。我们知道的那些车。'},
   {html:`<div class="scene"><div class="big-emoji bounce">🎤</div><div class="row">${A.FORMS.map((f,i)=>`<span class="hl" style="--d:${1.5+i*3}s;border-radius:16px;padding:4px">${A.formChip(f.key)}</span>`).join('')}</div></div>`,
    no:'Si etter meg! Ubestemt entall. Bestemt entall. Ubestemt flertall. Bestemt flertall.', zh:'跟我读！[ubestemt entall]，[bestemt entall]，[ubestemt flertall]，[bestemt flertall]。'},
   {html:`<div class="scene"><div class="row">${fcard('hus','ue',.2)}${fcard('hus','be',.9)}${fcard('hus','uf',1.6)}${fcard('hus','bf',2.3)}</div></div>`,
    no:'Et nytt ord. Et hus. Huset. Hus. Husene. Se, i flertall får hus ingen ending, men husene får ene.', zh:'再看一个词。[et hus]，[huset]，[hus]，[husene]。看，[hus]的复数不加结尾，但是[husene]要加 [ene]。'},
   {html:`<div class="scene"><div class="row">${fcard('jente','ue',.2)}${fcard('jente','be',.9)}${fcard('jente','uf',1.6)}${fcard('jente','bf',2.3)}</div><h2 class="fade" style="--d:3s">⭐</h2></div>`,
    no:'Og ei jente. Jenta. Jenter. Jentene. Nå kan du alle fire formene!', zh:'还有[ei jente]，[jenta]，[jenter]，[jentene]。现在你知道四种形式了！'}
  ]},

find: {
  no:'Finn substantivene', zh:'找出名词', emoji:'🕵️',
  scenes:[
   {html: title('🕵️','Finn substantivene','找出名词'),
    no:'Nå lærer vi å finne substantiv i en tekst. Du blir en detektiv!', zh:'现在我们学习在文章里找名词。你要当一名小侦探！'},
   {html:`<div class="scene"><div class="row">${card('1️⃣','Les setningen','读句子','#f97316',.2)}${card('2️⃣','Person, dyr, ting, sted?','是人、动物、东西还是地方？','#0d9488',1.2)}${card('3️⃣','Kan jeg si en, ei, et?','能加 en、ei、et 吗？','#9333ea',2.2)}</div></div>`,
    no:'Tre steg. Ett: Les setningen. To: Spør deg selv: er det en person, et dyr, en ting eller et sted? Tre: Kan jeg si en, ei eller et foran?', zh:'三个步骤。第一，读句子。第二，问自己：这是人、动物、东西还是地方？第三，前面能加 [en]、[ei] 或 [et] 吗？'},
   {html:`<div class="scene">${sent(['Jenta','leser','en','bok.'],[1,null,null,5.5])}<div class="fade sub" style="--d:1.4s">${A.bi('Jenta: ei jente ✔','Jenta：ei jente ✔')}</div><div class="fade sub" style="--d:3s">${A.bi('leser: noe hun gjør ✖ verb','leser：她做的事 ✖ 动词')}</div><div class="fade sub" style="--d:4.5s">${A.bi('bok: ei bok ✔','bok：ei bok ✔')}</div></div>`,
    no:'Jenta leser en bok. Jenta, ei jente, ja! Det er et substantiv. Leser, det er noe hun gjør. Det er et verb. Bok, ei bok, ja! Substantiv.', zh:'[Jenta leser en bok]。[Jenta]是[ei jente]，是名词！[leser]是她做的事，是动词。[bok]是[ei bok]，是名词！'},
   {html:`<div class="scene">${sent(['Hunden','bjeffer.'],[1.2,null])}${bubble(A.bi('hunden = en hund ✔','hunden = en hund ✔'),2.2)}${chipRow([['-en','#0d9488'],['-a','#0d9488'],['-et','#0d9488'],['-ene','#0d9488']],3.2)}</div>`,
    no:'Pass på! Substantiv kan stå i bestemt form. Hunden. Det er en hund, altså et substantiv. Se etter endingene en, a, et og ene.', zh:'注意！名词可以是定指形式。[Hunden]就是[en hund]，所以是名词。要留意结尾 [en]、[a]、[et] 和 [ene]。'},
   {html:`<div class="scene">${sent(['Barna','spiller','fotball.'],[1.2,null,3.2])}<div class="fade sub" style="--d:4s">${A.bi('2 substantiv · 1 verb','2 个名词 · 1 个动词')}</div></div>`,
    no:'Barna spiller fotball. Barna, flere barn, substantiv. Spiller, verb. Fotball, en fotball, substantiv.', zh:'[Barna spiller fotball]。[Barna]是很多个孩子，是名词。[spiller]是动词。[fotball]是[en fotball]，是名词。'},
   {html:`<div class="scene">${sent(['En','stor','hund.'],[null,null,1.5])}<div class="fade sub" style="--d:.8s">${A.bi('stor = adjektiv ✖','stor = 形容词 ✖')}</div></div>`,
    no:'En stor hund. Stor sier hvordan hunden er. Stor er et adjektiv, ikke et substantiv. Hund er substantivet.', zh:'[En stor hund]。[stor]说明狗怎么样，是形容词，不是名词。[hund]才是名词。'},
   {html:`<div class="scene">${sent(['Mia','bor','i','Oslo.'],[1.2,null,null,2.4])}${bubble(A.bi('Mia og Oslo er egennavn – stor bokstav!','Mia 和 Oslo 是专有名词，要大写！'),3.2)}</div>`,
    no:'Mia bor i Oslo. Mia og Oslo er også substantiv. De er egennavn, og de skrives med stor bokstav.', zh:'[Mia bor i Oslo]。[Mia]和[Oslo]也是名词。它们是专有名词，要用大写字母开头。'},
   {html: title('🏆','Du er en detektiv!','你是小侦探！',`<div class="sub fade" style="--d:.8s">${A.bi('person · dyr · ting · sted','人 · 动物 · 东西 · 地方')}</div>`),
    no:'Bra! Nå er du en substantiv-detektiv. Person, dyr, ting, sted. Nå øver vi!', zh:'太棒了！现在你是名词小侦探了。人、动物、东西、地方。现在我们来练习！'}
  ]}
};

/* ---------- avspiller ---------- */
let current = null;
A.Video = {
  stop(){ if(current){ current.cancel(); current = null; } A.Speech.stop(); },
  play(host, id, onEnd){
    A.Video.stop();
    const V = A.VIDEOS[id], n = V.scenes.length;
    let idx = 0, playing = false, run = 0, alive = true;
    host.innerHTML = `<div class="vwrap"><div class="stage"><div class="scenehost" style="width:100%"></div>
      <div class="startcard"><div class="big-emoji">${V.emoji}</div><h2>${A.bi(V.no, V.zh)}</h2>
      <button class="btn big start"><span class="bi"><span class="no">▶ Start videoen</span><span class="zh">开始看视频</span></span></button>
      <div class="small-note">🔊 ${A.bi('Lyd på. Skru opp volumet.','请打开声音。')}</div></div></div>
      <div class="vcap"><div class="no"></div><div class="zh"></div></div>
      <div class="vctl"><button class="spk prev" title="Forrige">⏮</button><button class="spk pp" title="Pause">⏸</button><button class="spk next" title="Neste">⏭</button><button class="spk redo" title="Fra start">🔁</button>
      <div class="dots">${V.scenes.map(() => '<i></i>').join('')}</div></div></div>`;
    const $ = s => host.querySelector(s);
    const sceneHost = $('.scenehost'), capNo = $('.vcap .no'), capZh = $('.vcap .zh'), dots = host.querySelectorAll('.dots i'), pp = $('.pp');
    function show(i){
      idx = i; const s = V.scenes[i];
      sceneHost.innerHTML = s.html;
      capNo.innerHTML = A.m(s.no); capZh.innerHTML = A.m(s.zh);
      dots.forEach((d, k) => d.classList.toggle('on', k <= i));
    }
    async function runScene(i){
      const my = ++run; show(i);
      if(!playing) return;
      const s = V.scenes[i];
      await A.sayBi(s.no, s.zh);
      if(!alive || my !== run || !playing) return;
      await A.sleep(900);
      if(!alive || my !== run || !playing) return;
      if(i < n - 1) runScene(i + 1); else finish();
    }
    function finish(){
      playing = false; pp.textContent = '▶';
      const o = document.createElement('div'); o.className = 'startcard';
      o.innerHTML = `<div class="big-emoji">🎉</div><h2>${A.bi('Ferdig!','看完了！')}</h2>
        <div class="row"><button class="btn sec again"><span class="bi"><span class="no">↻ Se på nytt</span><span class="zh">再看一遍</span></span></button>
        <button class="btn go"><span class="bi"><span class="no">Fortsett ➜</span><span class="zh">继续</span></span></button></div>`;
      $('.stage').append(o);
      o.querySelector('.again').onclick = () => { o.remove(); playing = true; pp.textContent = '⏸'; runScene(0); };
      o.querySelector('.go').onclick = () => { A.Video.stop(); onEnd && onEnd(); };
    }
    function halt(){ run++; A.Speech.stop(); }
    $('.start').onclick = () => { $('.startcard').remove(); playing = true; pp.textContent = '⏸'; runScene(0); };
    pp.onclick = () => { if(playing){ playing = false; pp.textContent = '▶'; halt(); } else { playing = true; pp.textContent = '⏸'; runScene(idx); } };
    $('.prev').onclick = () => { halt(); runScene(Math.max(0, idx - 1)); };
    $('.next').onclick = () => { halt(); if(idx < n - 1) runScene(idx + 1); else finish(); };
    $('.redo').onclick = () => { halt(); playing = true; pp.textContent = '⏸'; runScene(0); };
    show(0);
    current = { cancel(){ alive = false; run++; } };
  }
};
})();
