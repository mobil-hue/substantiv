(function(){
'use strict';
/* Gange: lærevideoer (animerte scener med norsk og kinesisk tale og tekst) */
const A = window.App, MG = A.MG;

const card = (inner, label, zh, color, d) => `<div class="vcard pop" style="--c:${color};--d:${d}s">${inner}<div class="l">${label}</div>${zh ? `<div class="z">${zh}</div>` : ''}</div>`;
const title = (emoji, no, zh, extra) => `<div class="scene"><div class="big-emoji bounce">${emoji}</div><h2 class="up">${A.bi(no, zh)}</h2>${extra || ''}</div>`;
const bubble = (h, d) => `<div class="pop sub" style="--d:${d || 0}s">${h}</div>`;
const big = (t, d, c) => `<div class="bigword pop" style="--d:${d || 0}s;${c ? 'color:' + c : ''}">${t}</div>`;
const popIn = (h, d) => `<div class="pop" style="--d:${d || 0}s">${h}</div>`;
const fadeIn = (h, d) => `<div class="fade" style="--d:${d || 0}s">${h}</div>`;
const scene = (...p) => `<div class="scene">${p.join('')}</div>`;
const lab = (v, no, c) => `<span class="eqx" style="--c:${c}"><b>${v}</b><small>${no}</small></span>`;
const ex = lines => `<div class="mexpr">${lines.map(l => `<div>${l}</div>`).join('')}</div>`;
const chain = (arr, d0) => `<div class="row">${arr.map((v, i) => `<span class="chip pop" style="--c:${['#2563eb', '#f97316', '#16a34a', '#a855f7'][i % 4]};--d:${(d0 || 0) + i * .7}s;font-size:1.6rem">${v}</span>`).join('<span class="pop" style="font-size:1.8rem;--d:' + ((d0 || 0) + .3) + 's">➜</span>')}</div>`;
const chips = (arr, cols, d0) => `<div class="row">${arr.map((v, i) => `<span class="chp pop" style="--c:${cols[i % cols.length]};--d:${(d0 || 0) + i * .8}s;font-size:1.8rem;font-weight:900">${v}</span>`).join('')}</div>`;

Object.assign(A.VIDEOS, {

mul_intro: {
  no:'Hva er gange?', zh:'什么是乘法？', emoji:'✖️',
  scenes:[
   {html:title('✖️', 'Hva er gange?', '什么是乘法？'),
    no:'Hei! I dag skal vi lære hva gange er. Gange er veldig nyttig!', zh:'你好！今天我们来学习什么是乘法。乘法非常有用！'},
   {html:scene(popIn(MG.groups(4, 3, '🍎', '🧺'), .2), bubble(A.bi('Hvor mange epler til sammen?', '一共有多少个苹果？'), 2)),
    no:'Her er fire kurver. I hver kurv er det tre epler. Hvor mange epler er det til sammen?', zh:'这里有四个篮子。每个篮子里有三个苹果。一共有多少个苹果？'},
   {html:scene(fadeIn(MG.groups(4, 3, '🍎', '🧺', {small:true}), 0), big('3 + 3 + 3 + 3 = 12', 1.2)),
    no:'Vi kan legge sammen. Tre pluss tre pluss tre pluss tre er tolv.', zh:'我们可以把它们加起来。3 加 3 加 3 加 3 等于 12。'},
   {html:scene(fadeIn(MG.groups(4, 3, '🍎', '🧺', {small:true}), 0), big('4 × 3 = 12', .6, '#16a34a'), bubble(A.bi('4 grupper · 3 i hver gruppe', '4 组 · 每组 3 个'), 2)),
    no:'Det går fortere med gange. Fire ganger tre er tolv. Det betyr fire grupper med tre i hver.', zh:'用乘法更快。4 乘以 3 等于 12。意思是四组，每组三个。'},
   {html:scene(`<div class="eqlab pop" style="--d:.2s">${lab(4, 'faktor', '#2563eb')}<span>×</span>${lab(3, 'faktor', '#2563eb')}<span>=</span>${lab(12, 'produkt', '#16a34a')}</div>`, bubble(A.bi('faktor · faktor · produkt', '因数 · 因数 · 积'), 2.4)),
    no:'Tallene vi ganger, heter faktorer. Svaret heter produkt. Fire og tre er faktorer. Tolv er produktet.', zh:'相乘的数叫做因数，挪威语是 [faktor]。答案叫做积，挪威语是 [produkt]。4 和 3 是因数，12 是积。'},
   {html:scene(popIn(MG.dots(3, 5), .2), big('3 × 5 = 15', 1.4)),
    no:'Gange kan også være rader og kolonner. Tre rader med fem prikker. Tre ganger fem er femten.', zh:'乘法也可以是行和列。三行，每行五个点。3 乘以 5 等于 15。'},
   {html:scene(`<div class="row" style="align-items:center;gap:22px">${popIn(MG.dots(3, 5, {s:20, r:7}), .2)}<span class="pop" style="font-size:2.4rem;--d:1s">=</span>${popIn(MG.dots(5, 3, {s:20, r:7, c1:'#f97316'}), 1.6)}</div>`, big('3 × 5 = 5 × 3', 2.2)),
    no:'Vi kan bytte om tallene. Fem ganger tre er også femten. Svaret blir det samme.', zh:'我们可以交换两个数。5 乘以 3 也等于 15。结果是一样的。'},
   {html:scene(`<div class="row">${card('<div class="e">1️⃣</div>', '7 × 1 = 7', '乘 1，数不变', '#2563eb', .2)}${card('<div class="e">0️⃣</div>', '7 × 0 = 0', '乘 0，结果是 0', '#dc2626', 1.4)}</div>`),
    no:'Gange med en gir det samme tallet. Gange med null gir alltid null.', zh:'乘 1，数不变。乘 0，结果总是 0。'},
   {html:title('🚀', 'Nå øver vi!', '现在来练习！', `<div class="sub fade" style="--d:.8s">${A.bi('i butikken · med penger · når vi teller', '在商店里 · 算钱 · 数东西')}</div>`),
    no:'Gange hjelper oss å regne raskt, for eksempel i butikken. Nå skal du øve!', zh:'乘法可以帮我们快速计算，比如在商店里。现在来练习吧！'}
  ]},

mul_table: {
  no:'Gangetabellen og knepene', zh:'乘法表和小窍门', emoji:'🔢',
  scenes:[
   {html:title('🔢', 'Gangetabellen og knepene', '乘法表和小窍门'),
    no:'Nå lærer vi gangetabellen. Med noen gode knep blir den mye lettere!', zh:'现在我们来学乘法表。有了一些好窍门，就容易多了！'},
   {html:scene(popIn(MG.mtable({marks:{'3x7':'#fde68a'}, hiRow:3, hiCol:7}), .2), bubble(A.bi('3 × 7 = 21', '3 × 7 = 21'), 2.4)),
    no:'Dette er gangetabellen. Gå ned til rad tre, og bort til kolonne sju. Der står tjueen. Tre ganger sju er tjueen.', zh:'这是乘法表。找到第 3 行，再找到第 7 列，那里写着 21。3 乘以 7 等于 21。'},
   {html:scene(fadeIn(MG.shift10(7, 1), .2), big('7 × 10 = 70', 1.2), bubble(A.bi('Legg til en null', '后面添一个 0'), 2)),
    no:'Ti-gangen er lett. Legg til en null bakpå. Sju ganger ti er sytti.', zh:'10 的乘法很容易。在后面添一个 0。7 乘以 10 等于 70。'},
   {html:scene(`<div class="row">${card('<div class="bigword sm">8 × 2</div><div class="bigword sm" style="color:#16a34a">8 + 8 = 16</div>', 'To-gangen: dobbelt', '2 的乘法：两倍', '#f97316', .2)}${card('<div class="bigword sm">8 × 5</div><div class="bigword sm" style="color:#16a34a">80 → 40</div>', 'Fem-gangen: halvparten av ti-gangen', '5 的乘法：10 的乘法的一半', '#2563eb', 2)}</div>`),
    no:'To-gangen er dobbelt. Åtte ganger to er åtte pluss åtte, seksten. Fem-gangen er halvparten av ti-gangen. Åtte ganger ti er åtti, og halvparten er førti.', zh:'2 的乘法就是两倍。8 乘以 2 等于 8 加 8，是 16。5 的乘法是 10 的乘法的一半。8 乘以 10 是 80，一半是 40。'},
   {html:scene(`<div class="bigword sm pop" style="--d:.1s">6 × 4</div>${chain([6, 12, 24], .4)}<div class="bigword sm pop" style="--d:2.8s">6 × 8</div>${chain([6, 12, 24, 48], 3.1)}`),
    no:'Fire-gangen er dobbelt og dobbelt. Seks ganger fire: seks, tolv, tjuefire. Åtte-gangen er dobbelt tre ganger. Seks ganger åtte er førtiåtte.', zh:'4 的乘法是两倍再两倍。6 乘以 4：6、12、24。8 的乘法是连续翻三倍。6 乘以 8 等于 48。'},
   {html:scene(big('9 × 7', .1), ex(['10 × 7 = 70', '70 − 7 = <span class="g">63</span>']), bubble(A.bi('6 + 3 = 9 ✔', '6 + 3 = 9 ✔'), 3)),
    no:'Ni-gangen: ta ti-gangen og trekk fra én. Ni ganger sju er sytti minus sju, sekstitre. Se: sifrene i svaret blir ni til sammen. Seks pluss tre er ni.', zh:'9 的乘法：先乘 10，再减去一个数。9 乘以 7 等于 70 减 7，是 63。看，答案的数字加起来是 9。6 加 3 等于 9。'},
   {html:scene(`<div class="row">${card(ex(['3 × 7', '= 2 × 7 + 7', '= 14 + 7 = <span class="g">21</span>']), 'Tre-gangen: to ganger og én til', '3 的乘法：乘 2 再加一个', '#9333ea', .2)}${card(ex(['6 × 7', '= 5 × 7 + 7', '= 35 + 7 = <span class="g">42</span>']), 'Seks-gangen: fem ganger og én til', '6 的乘法：乘 5 再加一个', '#0d9488', 2.2)}</div>`),
    no:'Tre-gangen: to ganger og så en til. Tre ganger sju er fjorten pluss sju, tjueen. Seks-gangen: fem ganger og så en til. Seks ganger sju er trettifem pluss sju, førtito.', zh:'3 的乘法：先乘 2，再加一个。3 乘以 7 等于 14 加 7，是 21。6 的乘法：先乘 5，再加一个。6 乘以 7 等于 35 加 7，是 42。'},
   {html:scene(big('8 × 7', .1), ex(['4 × 7 = 28', '8 × 7 = 28 + 28 = <span class="g">56</span>']), bubble(A.bi('7 × 7 = 49', '7 × 7 = 49'), 2.6)),
    no:'Sju-gangen er litt vanskelig. Bytt om og bruk et knep du kan. Åtte ganger sju er dobbelt av fire ganger sju. Tjueåtte pluss tjueåtte er femtiseks. Og sju ganger sju er førtini.', zh:'7 的乘法有点难。可以交换位置，用你会的窍门。8 乘以 7 是 4 乘以 7 的两倍。28 加 28 等于 56。还有，7 乘以 7 等于 49。'},
   {html:title('🌟', 'Øv litt hver dag!', '每天练一点！', `<div class="sub fade" style="--d:.8s">${A.bi('Da sitter tabellen snart', '很快就能记住乘法表')}</div>`),
    no:'Mange gangestykker kan du allerede! Øv litt hver dag, så sitter tabellen snart.', zh:'很多乘法你已经会了！每天练一点，很快就能记住乘法表。'}
  ]},

mul_ten: {
  no:'Gange med 10, 100 og 1000', zh:'乘 10、100 和 1000', emoji:'🔟',
  scenes:[
   {html:title('🔟', 'Gange med 10, 100 og 1000', '乘 10、100 和 1 000'),
    no:'Nå lærer vi å gange med ti, hundre og tusen. Det er et smart triks med nuller.', zh:'现在我们来学乘 10、100 和 1 000。这里有一个关于 0 的聪明窍门。'},
   {html:scene(fadeIn(MG.shift10(7, 0), .2), bubble(A.bi('enere · tiere · hundrer · tusener', '个位 · 十位 · 百位 · 千位'), 1.6)),
    no:'Hvert siffer har en plass: enere, tiere, hundrer og tusener. Samme siffer har ulik verdi på ulike plasser.', zh:'每个数字都有自己的位置：个位、十位、百位和千位。同一个数字在不同的位置，值不同。'},
   {html:scene(fadeIn(MG.shift10(7, 1), .2), big('7 × 10 = 70', 1.4, '#16a34a')),
    no:'Når vi ganger med ti, flytter hvert siffer seg en plass mot venstre. Plassen til høyre fylles med en null. Sju ganger ti er sytti.', zh:'乘 10 的时候，每个数字向左移动一位，右边空出的位置补一个 0。7 乘以 10 等于 70。'},
   {html:scene(fadeIn(MG.shift10(7, 2), .2), big('7 × 100 = 700', 1.4, '#16a34a')),
    no:'Med hundre flytter sifferet seg to plasser. Det blir to nuller. Sju ganger hundre er sju hundre.', zh:'乘 100，数字向左移动两位，后面补两个 0。7 乘以 100 等于 700。'},
   {html:scene(fadeIn(MG.shift10(7, 3), .2), big('7 × 1 000 = 7 000', 1.4, '#16a34a')),
    no:'Med tusen flytter sifferet seg tre plasser. Det blir tre nuller. Sju ganger tusen er sju tusen.', zh:'乘 1 000，数字向左移动三位，后面补三个 0。7 乘以 1 000 等于 7 000。'},
   {html:scene(fadeIn(MG.shift10(35, 2), .2), big('35 × 100 = 3 500', 1.4, '#16a34a')),
    no:'Tell nullene i tallet du ganger med. Så mange nuller legger du bakpå. Trettifem ganger hundre er tre tusen fem hundre.', zh:'数一数乘数里有几个 0，答案后面就添几个 0。35 乘以 100 等于 3 500。'},
   {html:scene(big('30 × 4', .1), ex(['3 × 4 = 12', '+ en null bak', '30 × 4 = <span class="g">120</span>']), bubble(A.bi('Regn uten nullen, legg den til sist', '先不管 0，最后再添上'), 2.6)),
    no:'Hva er tretti ganger fire? Regn først tre ganger fire, det er tolv. Så legger vi til en null. Tretti ganger fire er hundre og tjue.', zh:'30 乘以 4 等于多少？先算 3 乘以 4，等于 12。再添一个 0。30 乘以 4 等于 120。'},
   {html:scene(big('20 × 30', .1), ex(['2 × 3 = 6', '+ to nuller bak', '20 × 30 = <span class="g">600</span>'])),
    no:'Og tjue ganger tretti? To ganger tre er seks. Det er to nuller til sammen. Svaret er seks hundre.', zh:'20 乘以 30 呢？2 乘以 3 等于 6。一共有两个 0。答案是 600。'},
   {html:title('🌟', 'Husk nullene!', '别忘了 0！', `<div class="sub fade" style="--d:.8s">${A.bi('Regn uten nullene. Legg dem til til slutt.', '先不管 0 来计算，最后再添上。')}</div>`),
    no:'Husk: regn uten nullene, og legg til alle nullene til slutt.', zh:'记住：先不管 0 来计算，最后把所有的 0 添上。'}
  ]},

mul_split: {
  no:'Del opp tallet', zh:'拆分数', emoji:'🧩',
  scenes:[
   {html:title('🧩', 'Del opp tallet', '拆分数'),
    no:'Hvordan regner vi store gangestykker? Vi deler opp tallet!', zh:'大的乘法怎么算？我们把数拆开！'},
   {html:scene(big('276 × 3 = ?', .2), bubble(A.bi('Vanskelig i hodet?', '在脑子里算很难？'), 1.4)),
    no:'Hva er to hundre og syttiseks ganger tre? Det er vanskelig å gjøre i hodet. Men vi kan dele opp tallet.', zh:'276 乘以 3 等于多少？在脑子里算很难。但是我们可以把这个数拆开。'},
   {html:scene(big('276', .1), popIn('⬇', .8), chips([200, 70, 6], ['#2563eb', '#f97316', '#16a34a'], 1.2), bubble(A.bi('utvidet form', '展开式'), 3.8)),
    no:'To hundre og syttiseks er to hundre pluss sytti pluss seks. Det kalles utvidet form.', zh:'276 等于 200 加 70 加 6。这叫做展开式，挪威语是 [utvidet form]。'},
   {html:scene(fadeIn(MG.area([200, 70, 6], [3], {cells:[['', '', '']]}), .2), bubble(A.bi('rutenett', '方格图'), 2.2)),
    no:'Vi tegner et rutenett. Over rutene står delene av tallet. Til venstre står tre.', zh:'我们画一个方格图。格子上面是拆开的各部分，左边是 3。'},
   {html:scene(fadeIn(MG.area([200, 70, 6], [3], {cells:[['600', '', '']], hi:[0, 0]}), .1), big('200 × 3 = 600', .6)),
    no:'To hundre ganger tre er seks hundre.', zh:'200 乘以 3 等于 600。'},
   {html:scene(fadeIn(MG.area([200, 70, 6], [3], {cells:[['600', '210', '']], hi:[0, 1]}), .1), big('70 × 3 = 210', .6)),
    no:'Sytti ganger tre er to hundre og ti.', zh:'70 乘以 3 等于 210。'},
   {html:scene(fadeIn(MG.area([200, 70, 6], [3], {cells:[['600', '210', '18']], hi:[0, 2], total:'600 + 210 + 18 = 828'}), .1)),
    no:'Seks ganger tre er atten. Til slutt legger vi sammen. Seks hundre pluss to hundre og ti pluss atten er åtte hundre og tjueåtte.', zh:'6 乘以 3 等于 18。最后把它们加起来。600 加 210 加 18 等于 828。'},
   {html:scene(fadeIn(MG.area([40, 7], [6], {cells:[['240', '42']], total:'240 + 42 = 282'}), .1), big('47 × 6 = 282', 1)),
    no:'Prøv med førtisju ganger seks. Førti ganger seks er to hundre og førti. Sju ganger seks er førtito. Til sammen to hundre og åttito.', zh:'再试试 47 乘以 6。40 乘以 6 等于 240。7 乘以 6 等于 42。加起来是 282。'},
   {html:title('🌟', 'Del opp, gang og legg sammen', '拆开、相乘、再相加', `<div class="sub fade" style="--d:.8s">${A.bi('Slik klarer du store gangestykker', '这样就能算大的乘法')}</div>`),
    no:'Del opp tallet, gang hver del, og legg sammen. Da klarer du store gangestykker!', zh:'把数拆开，每一部分分别相乘，再加起来。这样你就能算大的乘法了！'}
  ]},

mul_round: {
  no:'Runde av og rette opp', zh:'凑整和补偿', emoji:'🎯',
  scenes:[
   {html:title('🎯', 'Runde av og rette opp', '凑整和补偿'),
    no:'Noen tall er nesten runde. Da finnes det et lurt knep!', zh:'有些数差不多是整数。这时有一个聪明的窍门！'},
   {html:scene(big('298 × 3', .1), fadeIn(MG.roundLine(298, 300), 1)),
    no:'Hva er to hundre og nittiåtte ganger tre? Tallet er nesten tre hundre. Det er mye lettere å regne med tre hundre.', zh:'298 乘以 3 等于多少？298 差不多是 300。用 300 来算容易得多。'},
   {html:scene(ex(['298 × 3', `<span style="color:#2563eb">300 × 3 = 900</span>`])),
    no:'Tre hundre ganger tre er ni hundre.', zh:'300 乘以 3 等于 900。'},
   {html:scene(ex(['298 × 3', '300 × 3 = 900', `<span style="color:#dc2626">+ for mye: 2 × 3 = 6</span>`])),
    no:'Men nå har vi regnet med to for mye, for to hundre og nittiåtte er to mindre enn tre hundre. Vi må trekke fra to ganger tre, det er seks.', zh:'不过我们多算了 2，因为 298 比 300 少 2。所以要减去 2 乘以 3，也就是 6。'},
   {html:scene(ex(['298 × 3 = 300 × 3 − 2 × 3', '= 900 − 6', '= <span class="g">894</span>'])),
    no:'Ni hundre minus seks er åtte hundre og nittifire. Så to hundre og nittiåtte ganger tre er åtte hundre og nittifire.', zh:'900 减 6 等于 894。所以 298 乘以 3 等于 894。'},
   {html:scene(big('276 × 3', .1), ex(['= (300 − 24) × 3', '= 300 × 3 − 24 × 3', '= 900 − 72', '= <span class="g">828</span>'])),
    no:'Det virker også for to hundre og syttiseks. Det er tre hundre minus tjuefire. Tre hundre ganger tre er ni hundre. Tjuefire ganger tre er syttito. Ni hundre minus syttito er åtte hundre og tjueåtte.', zh:'276 也可以这样算。276 等于 300 减 24。300 乘以 3 等于 900。24 乘以 3 等于 72。900 减 72 等于 828。'},
   {html:scene(big('17 × 4', .1), chain([17, 34, 68], .5), bubble(A.bi('dobbelt og dobbelt', '两倍再两倍'), 2.6)),
    no:'Gange med fire: dobbelt og dobbelt. Sytten ganger fire. Dobbelt av sytten er trettifire. Dobbelt av trettifire er sekstiåtte.', zh:'乘 4：翻倍再翻倍。17 乘以 4。17 的两倍是 34。34 的两倍是 68。'},
   {html:scene(big('18 × 5', .1), ex(['18 × 10 = 180', 'halvparten av 180 = <span class="g">90</span>'])),
    no:'Gange med fem: gang med ti og ta halvparten. Atten ganger ti er hundre og åtti. Halvparten er nitti.', zh:'乘 5：先乘 10，再取一半。18 乘以 10 等于 180。一半是 90。'},
   {html:scene(`<div class="row">${card('<div class="e">🎯</div>', 'Nesten rundt tall: runde av', '差不多是整数：凑整', '#f59e0b', .2)}${card('<div class="e">✌️</div>', '× 4 og × 8: dobbelt', '× 4 和 × 8：翻倍', '#f97316', 1.2)}${card('<div class="e">✋</div>', '× 5: halvparten av × 10', '× 5：10 倍的一半', '#2563eb', 2.2)}${card('<div class="e">🧩</div>', 'Ellers: del opp tallet', '其他：拆分数', '#9333ea', 3.2)}</div>`),
    no:'Hvilket knep skal du velge? Er tallet nesten rundt, runder du av. Gange med fire eller åtte: dobbelt. Gange med fem: halvparten av ti. Ellers deler du opp tallet.', zh:'该选哪个窍门？数差不多是整数：凑整。乘 4 或 8：翻倍。乘 5：10 倍的一半。其他情况：拆分数。'},
   {html:title('🌟', 'Velg det lurte knepet', '选聪明的窍门', `<div class="sub fade" style="--d:.8s">${A.bi('Nå kan du regne på flere måter', '现在你会用好几种方法计算了')}</div>`),
    no:'Nå kan du regne på flere måter. Velg knepet som passer best!', zh:'现在你会用好几种方法计算了。选最合适的窍门吧！'}
  ]},

mul_standard: {
  no:'Gamlemåten: oppstilling med mente', zh:'传统竖式和进位', emoji:'📚',
  scenes:[
   {html:title('📚', 'Gamlemåten', '传统竖式'),
    no:'Nå lærer vi gamlemåten, som også kalles oppstilling. Den fungerer for alle tall!', zh:'现在我们来学传统方法，也叫竖式。它适用于所有的数！'},
   {html:scene(fadeIn(MG.column(276, 3, {active:0}), .1), bubble(A.bi('Start bakerst: enerne', '从个位开始'), 1.6)),
    no:'Vi skriver tallene under hverandre. Tre står under enerne. Vi starter bakerst, med enerne.', zh:'我们把数字上下对齐写出来。3 写在个位下面。从最后面的个位开始。'},
   {html:scene(fadeIn(MG.column(276, 3, {res:['8'], carry:[0, 1], active:1}), .1), big('6 × 3 = 18', .6), bubble(A.bi('skriv 8 · mente 1', '写 8 · 进位 1'), 1.6)),
    no:'Seks ganger tre er atten. Vi skriver åtte under streken. Tieren, én, tar vi med som mente.', zh:'6 乘以 3 等于 18。在横线下面写 8。十位上的 1 带到下一位，这叫进位，挪威语是 [mente]。'},
   {html:scene(fadeIn(MG.column(276, 3, {res:['8', '2'], carry:[0, 1, 2], active:2}), .1), big('7 × 3 + 1 = 22', .6), bubble(A.bi('skriv 2 · mente 2', '写 2 · 进位 2'), 1.6)),
    no:'Sju ganger tre er tjueen. Vi legger til mente en. Det blir tjueto. Vi skriver to, og tar med to som mente.', zh:'7 乘以 3 等于 21。再加上进位 1，是 22。写 2，进位 2。'},
   {html:scene(fadeIn(MG.column(276, 3, {res:['8', '2', '8'], carry:[0, 1, 2]}), .1), big('2 × 3 + 2 = 8', .6), bubble(A.bi('276 × 3 = 828', '276 × 3 = 828'), 1.6)),
    no:'To ganger tre er seks. Pluss mente to er åtte. Vi skriver åtte. Svaret er åtte hundre og tjueåtte.', zh:'2 乘以 3 等于 6。加上进位 2 是 8。写 8。答案是 828。'},
   {html:scene(fadeIn(MG.column(45, 3, {res:['5', '3', '1'], carry:[0, 1]}), .1), big('4 × 3 + 1 = 13', .6), bubble(A.bi('45 × 3 = 135', '45 × 3 = 135'), 1.6)),
    no:'Når vi kommer helt til venstre, skriver vi hele tallet. Fire ganger tre er tolv, pluss en er tretten. Vi skriver tretten. Svaret er hundre og trettifem.', zh:'算到最左边时，把整个数写下来。4 乘以 3 等于 12，加 1 是 13。写 13。答案是 135。'},
   {html:scene(`<div class="row">${card('<div class="e">⬅️</div>', 'Start bakerst', '从后面开始', '#2563eb', .2)}${card('<div class="e">✍️</div>', 'Skriv enerne', '写个位', '#16a34a', 1.2)}${card('<div class="e">🎒</div>', 'Ta tierne med som mente', '十位当作进位带上', '#ef4444', 2.2)}</div>`),
    no:'Husk tre ting: start bakerst, skriv enerne, og ta med tierne som mente.', zh:'记住三件事：从后面开始，写个位，把十位当作进位带上。'},
   {html:title('🌟', 'Gamlemåten fungerer alltid', '传统竖式总是有效', `<div class="sub fade" style="--d:.8s">${A.bi('Øv på oppstilling!', '多练习竖式！')}</div>`),
    no:'Gamlemåten fungerer for alle tall. Nå skal du øve på oppstilling!', zh:'传统竖式适用于所有的数。现在来练习竖式吧！'}
  ]},

mul_story: {
  no:'Tekstoppgaver', zh:'应用题', emoji:'📝',
  scenes:[
   {html:title('📝', 'Tekstoppgaver', '应用题'),
    no:'I tekstoppgaver må du selv finne ut hva du skal regne. Her er en god plan.', zh:'做应用题时，要自己想清楚该怎么算。这里有一个好办法。'},
   {html:scene(`<div class="storybox pop" style="--d:.1s"><span class="no">Mia har 4 poser med 6 kuler i hver pose. Hvor mange kuler har hun?</span><span class="zh">米娅有 4 袋弹珠，每袋有 6 颗。她一共有多少颗弹珠？</span></div>`, fadeIn(MG.groups(4, 6, '🔮', '🛍️', {small:true}), 1)),
    no:'Mia har fire poser med seks kuler i hver pose. Hvor mange kuler har hun?', zh:'米娅有四袋弹珠，每袋有六颗。她一共有多少颗弹珠？'},
   {html:scene(`<div class="bigword sm pop" style="--d:.1s">1. ${A.bi('Les nøye. Hva vet vi?', '仔细读题。我们知道什么？')}</div>`, chips(['4 poser', '6 kuler i hver'], ['#2563eb', '#f97316'], .8)),
    no:'Første steg: les nøye. Hva vet vi? Vi vet at det er fire poser, og seks kuler i hver pose.', zh:'第一步：仔细读题。我们知道什么？有四个袋子，每袋有六颗弹珠。'},
   {html:scene(`<div class="bigword sm pop" style="--d:.1s">2. ${A.bi('Hva spør oppgaven om?', '题目问什么？')}</div>`, bubble(A.bi('Hvor mange kuler til sammen?', '一共有多少颗弹珠？'), .9)),
    no:'Andre steg: hva spør oppgaven om? Hvor mange kuler det er til sammen.', zh:'第二步：题目问什么？问一共有多少颗弹珠。'},
   {html:scene(`<div class="bigword sm pop" style="--d:.1s">3. ${A.bi('Pluss, minus eller gange?', '加、减还是乘？')}</div>`, `<div class="row">${card('<div class="e">➕</div>', 'pluss', '合起来', '#94a3b8', .6)}${card('<div class="e">➖</div>', 'minus', '拿走', '#94a3b8', 1.2)}${card('<div class="e">✖️</div>', 'gange', '每组一样多', '#16a34a', 1.8)}</div>`),
    no:'Tredje steg: skal vi bruke pluss, minus eller gange? Vi har like store grupper. Da bruker vi gange. Fire ganger seks.', zh:'第三步：用加法、减法还是乘法？每组一样多，所以用乘法。4 乘以 6。'},
   {html:scene(big('4 × 6 = 24', .2, '#16a34a'), bubble(A.bi('Svar: Mia har 24 kuler.', '答案：米娅有 24 颗弹珠。'), 1.2)),
    no:'Fire ganger seks er tjuefire. Vi skriver et svar med ord: Mia har tjuefire kuler.', zh:'4 乘以 6 等于 24。我们用一句话写出答案：米娅有 24 颗弹珠。'},
   {html:scene(`<div class="row">${card('<div class="bigword sm">hver · ganger så mange</div>', '→ gange ✖️', '→ 乘法', '#16a34a', .2)}${card('<div class="bigword sm">flere · mer enn · får til</div>', '→ pluss ➕', '→ 加法', '#2563eb', 1.4)}${card('<div class="bigword sm">igjen · gir bort · mindre</div>', '→ minus ➖', '→ 减法', '#dc2626', 2.6)}</div>`),
    no:'Noen ord hjelper deg. Hver og ganger så mange betyr ofte gange. Flere og mer enn betyr ofte pluss. Igjen og gir bort betyr ofte minus.', zh:'有些词可以帮到你。“每”和“几倍”常常表示乘法。“多”和“又得到”常常表示加法。“还剩”和“送出”常常表示减法。'},
   {html:scene(bubble(A.bi('Er svaret rimelig?', '答案合理吗？'), .1), ex(['4 poser med nesten 6 kuler', 'det er omtrent 4 × 5 = 20', '24 passer ✔'])),
    no:'Til slutt: sjekk svaret. Er det rimelig? Fire poser med nesten seks kuler er omtrent tjue. Tjuefire passer bra.', zh:'最后：检查答案。合理吗？四袋，每袋差不多六颗，大约是二十。24 很合理。'},
   {html:title('🌟', 'Les, tenk og regn', '读题、思考、计算', `<div class="sub fade" style="--d:.8s">${A.bi('Nå øver vi på tekstoppgaver', '现在来练习应用题')}</div>`),
    no:'Les, tenk og regn! Nå øver vi på tekstoppgaver.', zh:'读题，思考，计算！现在我们来练习应用题。'}
  ]}
});
})();
