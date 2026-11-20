(function(){
'use strict';
/* Gangesystemet: 8 lærevideoer (samme avspiller som resten: animerte scener med norsk og kinesisk tale og tekst) */
const A = window.App, GS = A.GS, MG = A.MG, G = GS.G;

const scene = (...p) => `<div class="scene">${p.join('')}</div>`;
const title = (emoji, no, zh, extra) => `<div class="scene"><div class="big-emoji bounce">${emoji}</div><h2 class="up">${A.bi(no, zh)}</h2>${extra || ''}</div>`;
const bubble = (h, d) => `<div class="pop sub" style="--d:${d || 0}s">${h}</div>`;
const big = (t, d, c) => `<div class="bigword pop" style="--d:${d || 0}s;${c ? 'color:' + c : ''}">${t}</div>`;
const popIn = (h, d) => `<div class="pop" style="--d:${d || 0}s">${h}</div>`;
const fadeIn = (h, d) => `<div class="fade" style="--d:${d || 0}s">${h}</div>`;
const ex = lines => `<div class="mexpr">${lines.map(l => `<div>${l}</div>`).join('')}</div>`;
const tbl = (o, d) => fadeIn(GS.table(o), d == null ? .1 : d);
// regnestykke som farget brikke
const fact = (txt, g, d) => `<span class="gfact pop" style="--c:${G[g].c};--bg:${G[g].bg};--d:${d || 0}s">${txt}</span>`;
const facts = (list, g, d0, gap) => `<div class="row">${list.map((t, i) => fact(t, g, (d0 || 0) + i * (gap == null ? .6 : gap))).join('')}</div>`;
const chain = (arr, d0, color) => `<div class="row">${arr.map((v, i) => `<span class="chip pop" style="--c:${color || ['#2563eb', '#f97316', '#16a34a', '#a855f7'][i % 4]};--d:${(d0 || 0) + i * .7}s;font-size:1.6rem">${v}</span>`).join('<span class="pop" style="font-size:1.8rem;--d:' + ((d0 || 0) + .3) + 's">➜</span>')}</div>`;
const lab = (g, no, zh) => `<span class="gbadge big pop" style="--c:${G[g].c};--bg:${G[g].bg}">${G[g].emoji} ${A.bi(no, zh)}</span>`;

Object.assign(A.VIDEOS, {

gs_system: {
  no:'Gangetabellen som system', zh:'把乘法表当作一个系统', emoji:'🧩',
  scenes:[
   {html:title('🧩', 'Gangetabellen som system', '把乘法表当作一个系统'),
    no:'Hei! Gangetabellen har hundre ruter. Det høres mye ut. Men du trenger ikke pugge alle hundre!', zh:'你好！乘法表有一百个格子，听起来很多。但你不需要把一百个全部死记硬背！'},
   {html:scene(tbl({step:1}), bubble(A.bi('100 ruter', '100 个格子'), 1.2)),
    no:'Her er hele gangetabellen. Hundre ruter. La oss se hvor mange vi egentlig må pugge.', zh:'这是整个乘法表，一百个格子。我们来看看到底有多少需要背。'},
   {html:scene(tbl({step:2}), bubble(A.bi('speilvendte ut → 55', '去掉对称的 → 55'), 1.2)),
    no:'Først tar vi bort de speilvendte. 5 × 6 er det samme som 6 × 5. Da er det bare 55 igjen.', zh:'首先去掉对称的算式。5 × 6 和 6 × 5 的结果一样。这样只剩下 55 个。'},
   {html:scene(tbl({step:3}), bubble(A.bi('1-, 2- og 10-gangen ut → 28', '去掉 1、2、10 → 28'), 1.2)),
    no:'Så tar vi bort ett-gangen, to-gangen og ti-gangen. De er veldig lette. Da er det 28 igjen.', zh:'接着去掉 1、2 和 10 的乘法，它们非常容易。这样还剩 28 个。'},
   {html:scene(tbl({step:4}), bubble(A.bi('5-gangen ut → 21', '去掉 5 的乘法 → 21'), 1.2)),
    no:'Fem-gangen er også lett. Da er det 21 igjen.', zh:'5 的乘法也很容易。还剩 21 个。'},
   {html:scene(tbl({step:5}), bubble(A.bi('like × like ut → 15', '去掉相同两数相乘 → 15'), 1.2)),
    no:'Så kommer like ganger like. Det er kvadrattallene, og de er bare seks. Da er det 15 igjen.', zh:'接下来是相同两数相乘，也就是平方数，只有 6 个。还剩 15 个。'},
   {html:scene(tbl({step:6}), bubble(A.bi('9-regelen → 10 igjen', '9 的规则 → 剩 10 个'), 1.2)),
    no:'Ni-gangen har en regel. Fem regnestykker til forsvinner. Nå er det bare 10 igjen!', zh:'9 的乘法有一个规则，又去掉 5 个算式。现在只剩 10 个了！'},
   {html:scene(tbl({step:7}), bubble(A.bi('Det som må læres: 10', '要背的：10 个'), 1.2)),
    no:'Dette er de ti som må pugges. Alt det andre har en regel.', zh:'这就是要背的 10 个。其余的都有规则。'},
   {html:scene(chain([100, 55, 28, 21, 15, 10], .2), bubble(A.bi('ett steg om gangen', '一次学一步'), 4.6)),
    no:'Fra 100 til 10, steg for steg. Vi lærer ett steg om gangen. Er du klar?', zh:'从 100 个到 10 个，一步一步来。我们每次学一步。准备好了吗？'}
  ]},

gs_mirror: {
  no:'Speilvendte regnestykker', zh:'对称的算式', emoji:'🪞',
  scenes:[
   {html:title('🪞', 'Speilvendte regnestykker', '对称的算式'),
    no:'Nå lærer vi det første trikset: speilvendte regnestykker.', zh:'现在学第一个窍门：对称的算式。'},
   {html:scene(`<div class="row" style="align-items:center;gap:22px">${popIn(MG.dots(3, 7, {s:20, r:7}), .2)}<span class="pop" style="font-size:2.4rem;--d:1.2s">=</span>${popIn(MG.dots(7, 3, {s:20, r:7, c1:'#f97316'}), 1.8)}</div>`, big('3 × 7 = 7 × 3', 2.6)),
    no:'3 rader med 7 prikker. Snur vi rutenettet, får vi 7 rader med 3 prikker. Det er like mange prikker.', zh:'三行，每行七个点。把方阵转一下，就是七行，每行三个点。点的个数一样多。'},
   {html:scene(big('3 × 7 = 21', .2, '#2563eb'), big('7 × 3 = 21', 1.2, '#f97316')),
    no:'3 × 7 er 21. 7 × 3 er også 21. Svaret er det samme.', zh:'3 × 7 等于 21，7 × 3 也等于 21。答案相同。'},
   {html:scene(tbl({step:1, hi:[[3, 7], [7, 3]]}), bubble(A.bi('diagonalen', '对角线'), 1.4)),
    no:'I tabellen ligger de på hver sin side av diagonalen. Se: tre og sju her, og sju og tre her.', zh:'在乘法表里，它们分别在对角线的两侧。看：这里是 3 和 7，这里是 7 和 3。'},
   {html:scene(tbl({step:2}), bubble(A.bi('bare halve tabellen → 55', '只学半张表 → 55'), 1.2)),
    no:'Vi trenger bare den ene halvdelen. Da er det 55 regnestykker igjen.', zh:'我们只需要其中的一半，还剩 55 个算式。'},
   {html:scene(big('8 × 3 = 3 × 8', .2), big('= 24', 1.2, '#16a34a'), bubble(A.bi('det minste tallet først', '小的数放前面'), 2)),
    no:'Tips: Snu regnestykket, så det minste tallet kommer først. 8 × 3 blir 3 × 8. Det er ofte lettere.', zh:'小提示：把算式交换一下，让小的数在前面。8 × 3 变成 3 × 8，通常更容易。'},
   {html:title('🌟', 'Speilvendt!', '对称！', `<div class="sub fade" style="--d:.8s">${A.bi('Lær bare halve tabellen', '只学半张乘法表')}</div>`),
    no:'Bra! Nå vet du at du bare skal lære den halve tabellen.', zh:'很好！你现在知道只需要学半张乘法表。'}
  ]},

gs_easy: {
  no:'1-, 2- og 10-gangen', zh:'1、2 和 10 的乘法', emoji:'🟢',
  scenes:[
   {html:title('🟢', '1-, 2- og 10-gangen', '1、2 和 10 的乘法'),
    no:'Nå kommer tre veldig lette gangetabeller: ett-gangen, to-gangen og ti-gangen.', zh:'现在是三张非常简单的乘法表：1、2 和 10 的乘法。'},
   {html:scene(lab('easy', '1-gangen', '1 的乘法'), big('7 × 1 = 7', .6, G.easy.c), bubble(A.bi('samme tall', '数不变'), 1.6)),
    no:'Ett-gangen: Å gange med 1 gir det samme tallet. 7 × 1 er 7.', zh:'1 的乘法：乘 1，数不变。7 × 1 等于 7。'},
   {html:scene(lab('easy', '10-gangen', '10 的乘法'), fadeIn(MG.shift10(7, 1), .3), big('7 × 10 = 70', 1.4, G.easy.c), bubble(A.bi('en null bak', '后面加一个 0'), 2.2)),
    no:'Ti-gangen: Sett en null bak tallet. 7 × 10 er 70. 10 × 10 er 100.', zh:'10 的乘法：在数的后面加一个 0。7 × 10 等于 70。10 × 10 等于 100。'},
   {html:scene(lab('easy', '2-gangen', '2 的乘法'), popIn(MG.groups(2, 8, '🍎', '🧺', {small:true}), .3), big('8 × 2 = 8 + 8 = 16', 1.4, G.easy.c)),
    no:'To-gangen: Dobbelt! 8 × 2 er 8 + 8. Det er 16.', zh:'2 的乘法：就是两倍！8 × 2 等于 8 加 8，是 16。'},
   {html:scene(tbl({step:3}), bubble(A.bi('27 ruter er lette', '27 个格子很容易'), 1.2)),
    no:'Disse tre gjør at 27 ruter i tabellen er lette.', zh:'有了这三个，乘法表里 27 个格子都变得很简单。'},
   {html:scene(facts(['9 × 1 = 9', '9 × 2 = 18', '9 × 10 = 90'], 'easy', .2, 1)),
    no:'Prøv selv: 9 × 1, 9 × 2 og 9 × 10. Svarene er 9, 18 og 90.', zh:'试一试：9 × 1、9 × 2 和 9 × 10。答案是 9、18 和 90。'},
   {html:title('🌟', 'Du kan allerede 27!', '你已经会 27 个了！', `<div class="sub fade" style="--d:.8s">${A.bi('1-, 2- og 10-gangen', '1、2 和 10 的乘法')}</div>`),
    no:'Bra! Du kan allerede 27 regnestykker.', zh:'太棒了！你已经会 27 个算式了。'}
  ]},

gs_five: {
  no:'5-gangen', zh:'5 的乘法', emoji:'🟠',
  scenes:[
   {html:title('🟠', '5-gangen', '5 的乘法'),
    no:'Nå lærer vi fem-gangen. Den er også lett.', zh:'现在学 5 的乘法。它也很容易。'},
   {html:scene(fadeIn(MG.numline(5, 6), .2), bubble(A.bi('5, 10, 15, 20, 25, 30', '5、10、15、20、25、30'), 2)),
    no:'Tell med fem: 5, 10, 15, 20, 25, 30. Hvert hopp er fem.', zh:'五个五个地数：5、10、15、20、25、30。每一跳是 5。'},
   {html:scene(big('7 × 5 = ?', .1), ex(['7 × 10 = 70', 'halvparten: 70 ÷ 2 = <span class="g">35</span>']), bubble(A.bi('5 er halvparten av 10', '5 是 10 的一半'), 2.2)),
    no:'Fem er halvparten av ti. Så fem-gangen er halvparten av ti-gangen. 7 × 10 er 70, og halvparten er 35.', zh:'5 是 10 的一半，所以 5 的乘法就是 10 的乘法的一半。7 × 10 等于 70，一半是 35。'},
   {html:scene(big('8 × 5 = ?', .1), ex(['halvparten av 8 er 4', 'null bak: <span class="g">40</span>']), bubble(A.bi('partall: halver, null bak', '偶数：取一半，后面加 0'), 2.2)),
    no:'Er tallet et partall, kan du halvere tallet og sette en null bak. 8 × 5: halvparten av 8 er 4, null bak, 40.', zh:'如果是偶数，可以先取一半，再在后面加 0。8 × 5：8 的一半是 4，后面加 0，得到 40。'},
   {html:scene(`<div class="row">${[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((v, i) => `<span class="chp pop" style="--c:${v % 10 ? '#f97316' : '#2563eb'};--d:${i * .35}s;font-size:1.5rem;font-weight:900;color:var(--c)">${v}</span>`).join('')}</div>`, bubble(A.bi('slutter på 0 eller 5', '个位是 0 或 5'), 3.8)),
    no:'Svarene i fem-gangen ender alltid på 0 eller 5.', zh:'5 的乘法的答案，个位总是 0 或 5。'},
   {html:scene(tbl({step:4}), bubble(A.bi('5-gangen ut → 21', '去掉 5 的乘法 → 21'), 1.2)),
    no:'Fem-gangen tar bort 7 regnestykker til. Nå er det 21 igjen.', zh:'5 的乘法又去掉 7 个算式。现在剩 21 个。'},
   {html:title('🌟', '5-gangen', '5 的乘法', `<div class="sub fade" style="--d:.8s">${A.bi('halvparten av 10-gangen', '10 的乘法的一半')}</div>`),
    no:'Fem-gangen: halvparten av ti-gangen!', zh:'5 的乘法：就是 10 的乘法的一半！'}
  ]},

gs_square: {
  no:'Like × like (y × y)', zh:'相同两数相乘（y × y）', emoji:'🟦',
  scenes:[
   {html:title('🟦', 'Like × like', '相同两数相乘', `<div class="sub fade" style="--d:.6s">y × y</div>`),
    no:'Nå skal vi lære like ganger like. De heter kvadrattall.', zh:'现在学相同两数相乘，叫做平方数，挪威语是 [kvadrattall]。'},
   {html:scene(`<div class="row" style="align-items:flex-end;gap:20px">${popIn(MG.dots(3, 3, {s:22, r:8}), .2)}${popIn(MG.dots(4, 4, {s:22, r:8, c1:'#f97316'}), 1.4)}${popIn(MG.dots(5, 5, {s:22, r:8, c1:'#16a34a'}), 2.6)}</div>`, bubble(A.bi('kvadrat = firkant', '平方 = 正方形'), 3.6)),
    no:'3 rader med 3. 4 rader med 4. Prikkene blir en firkant, et kvadrat. Derfor heter det kvadrattall.', zh:'三行，每行三个。四行，每行四个。点排成一个正方形，所以叫平方数。'},
   {html:scene(facts(['3 × 3 = 9', '4 × 4 = 16', '6 × 6 = 36'], 'sq', .3, 1.2)),
    no:'Disse må vi pugge som en egen liten gruppe. 3 × 3 er 9. 4 × 4 er 16. 6 × 6 er 36.', zh:'这些要作为一小组背下来。3 × 3 等于 9，4 × 4 等于 16，6 × 6 等于 36。'},
   {html:scene(facts(['7 × 7 = 49', '8 × 8 = 64', '9 × 9 = 81'], 'sq', .3, 1.2)),
    no:'7 × 7 er 49. 8 × 8 er 64. 9 × 9 er 81.', zh:'7 × 7 等于 49，8 × 8 等于 64，9 × 9 等于 81。'},
   {html:scene(facts(['2 × 2', '5 × 5', '10 × 10'], 'easy', .3, 1), bubble(A.bi('kan du fra før', '你已经会了'), 3.4)),
    no:'2 × 2, 5 × 5 og 10 × 10 kan du allerede, fra de lette gangene. Dem trenger vi ikke her.', zh:'2 × 2、5 × 5 和 10 × 10 你已经会了，它们属于简单的乘法，这里不用再背。'},
   {html:scene(tbl({step:5}), bubble(A.bi('6 kvadrattall → 15 igjen', '6 个平方数 → 剩 15 个'), 1.2)),
    no:'Kvadrattallene ligger på diagonalen. Seks regnestykker. Nå er det 15 igjen.', zh:'平方数都在对角线上，一共 6 个算式。现在剩 15 个。'},
   {html:scene(chain([9, 16, 25, 36], .2, G.sq.c), bubble(A.bi('+7 · +9 · +11', '+7 · +9 · +11'), 2.8)),
    no:'Et lite triks: Legg til neste oddetall. 9 + 7 er 16. 16 + 9 er 25. 25 + 11 er 36.', zh:'一个小窍门：每次加下一个奇数。9 加 7 得 16，16 加 9 得 25，25 加 11 得 36。'},
   {html:title('🌟', 'Seks kvadrattall', '六个平方数', `<div class="sub fade" style="--d:.8s">${A.bi('9 · 16 · 36 · 49 · 64 · 81', '9 · 16 · 36 · 49 · 64 · 81')}</div>`),
    no:'Seks kvadrattall: 9, 16, 36, 49, 64 og 81. Øv på dem som en egen gruppe!', zh:'六个平方数：9、16、36、49、64 和 81。把它们当作一小组来练！'}
  ]},

gs_nine: {
  no:'9-gangen med regel', zh:'9 的乘法（有规则）', emoji:'🩷',
  scenes:[
   {html:scene(`<div class="big-emoji bounce">🩷</div>`, big('y × 9 = (y × 10) − y', .3, G.nine.c)),
    no:'Ni-gangen har en regel. Gang med ti, og trekk fra tallet én gang.', zh:'9 的乘法有一个规则：先乘 10，再减去这个数一次。'},
   {html:scene(popIn(MG.dots(7, 10, {split:9, c1:'#3b82f6', c2:'#cbd5e1', s:20, r:7}), .2), big('7 × 9 = 70 − 7 = 63', 1.8, G.nine.c)),
    no:'Hvorfor? Ni er én mindre enn ti. 7 rader med ti prikker er 70. Vi tar bort én prikk i hver rad, sju prikker. 70 − 7 er 63.', zh:'为什么？因为 9 比 10 少 1。七行，每行十个点，一共 70 个。每行去掉一个点，一共去掉 7 个。70 减 7 等于 63。'},
   {html:scene(`<div class="row">${['3 × 9 = 30 − 3 = 27', '4 × 9 = 40 − 4 = 36', '6 × 9 = 60 − 6 = 54', '7 × 9 = 70 − 7 = 63', '8 × 9 = 80 − 8 = 72'].map((t, i) => fact(t, 'nine', .2 + i * 1.5)).join('')}</div>`),
    no:'Her er alle fem: 3 × 9 er 27. 4 × 9 er 36. 6 × 9 er 54. 7 × 9 er 63. 8 × 9 er 72.', zh:'五个都在这里：3 × 9 等于 27，4 × 9 等于 36，6 × 9 等于 54，7 × 9 等于 63，8 × 9 等于 72。'},
   {html:scene(facts(['2 + 7 = 9', '3 + 6 = 9', '5 + 4 = 9', '6 + 3 = 9', '7 + 2 = 9'], 'nine', .2, .8), bubble(A.bi('27 · 36 · 54 · 63 · 72', '27 · 36 · 54 · 63 · 72'), 4.4)),
    no:'Se på svarene: 27, 36, 54, 63 og 72. Sifrene blir 9 til sammen! 2 + 7 er 9. Bruk det som en sjekk.', zh:'看看答案：27、36、54、63、72。每个答案的两个数字加起来都是 9！2 加 7 等于 9。用它来检查。'},
   {html:scene(big('9 × 9 = 90 − 9 = 81', .2, G.nine.c), bubble(A.bi('hører til kvadrattallene', '属于平方数那一组'), 1.4)),
    no:'Regelen virker også for 9 × 9: 90 − 9 er 81. Men den hører til kvadrattallene.', zh:'这个规则对 9 × 9 也有效：90 减 9 等于 81。不过它属于平方数那一组。'},
   {html:scene(tbl({step:6}), bubble(A.bi('9-regelen → 10 igjen', '9 的规则 → 剩 10 个'), 1.2)),
    no:'Ni-gangen tar bort 5 regnestykker. Nå er det bare 10 igjen!', zh:'9 的乘法去掉 5 个算式。现在只剩 10 个了！'},
   {html:title('🌟', '9-regelen', '9 的规则', `<div class="sub fade" style="--d:.8s">${A.bi('gang med 10, trekk fra tallet', '乘 10，再减去这个数')}</div>`),
    no:'Ni-regelen: gang med ti, og trekk fra tallet. Enkelt!', zh:'9 的规则：乘 10，再减去这个数。很简单！'}
  ]},

gs_learn: {
  no:'De ti som må pugges', zh:'要背的 10 个', emoji:'🟣',
  scenes:[
   {html:title('🟣', 'De ti som må pugges', '要背的 10 个'),
    no:'Nå er det bare 10 regnestykker igjen. Dem må vi pugge. Men vi har gode triks!', zh:'现在只剩 10 个算式了。这些要背下来，但我们有好窍门！'},
   {html:scene(tbl({step:7}), bubble(A.bi('10 regnestykker', '10 道算式'), 1.2)),
    no:'Her er de ti. De ligger i et lite område i midten av tabellen.', zh:'这就是那十个，它们集中在乘法表中间的一小块。'},
   {html:scene(`<div class="gl-list">${[['3-gangen', ['3 × 4 = 12', '3 × 6 = 18', '3 × 7 = 21', '3 × 8 = 24']], ['4-gangen', ['4 × 6 = 24', '4 × 7 = 28', '4 × 8 = 32']], ['6-gangen', ['6 × 7 = 42', '6 × 8 = 48']], ['7-gangen', ['7 × 8 = 56']]].map((r, i) => `<div class="gl-row"><span class="gl-l fade" style="--d:${i * 1.3}s">${r[0]}</span>${r[1].map((t, j) => fact(t, 'learn', i * 1.3 + .3 + j * .3)).join('')}</div>`).join('')}</div>`),
    no:'3-gangen: 3 × 4, 3 × 6, 3 × 7 og 3 × 8. 4-gangen: 4 × 6, 4 × 7 og 4 × 8. 6-gangen: 6 × 7 og 6 × 8. Og til slutt 7 × 8.', zh:'3 的乘法：3 × 4、3 × 6、3 × 7、3 × 8。4 的乘法：4 × 6、4 × 7、4 × 8。6 的乘法：6 × 7、6 × 8。最后是 7 × 8。'},
   {html:scene(lab('learn', '4-gangen: doble to ganger', '4 的乘法：翻两倍'), big('4 × 7 = 28', .3), chain([7, 14, 28], 1, G.learn.c)),
    no:'Trikset for fire-gangen: doble to ganger. 4 × 7: 7, 14, 28.', zh:'4 的乘法的窍门：连续翻两倍。4 × 7：7、14、28。'},
   {html:scene(lab('learn', '8-gangen: doble tre ganger', '8 的乘法：翻三倍'), big('6 × 8 = 48', .3), chain([6, 12, 24, 48], 1, G.learn.c)),
    no:'Trikset for åtte-gangen: doble tre ganger. 6 × 8: 6, 12, 24, 48.', zh:'8 的乘法的窍门：连续翻三倍。6 × 8：6、12、24、48。'},
   {html:scene(`<div class="row">${[['3 × 7', '= 2 × 7 + 7', '= 14 + 7 = <span class="g">21</span>', '#9333ea', .2], ['6 × 7', '= 5 × 7 + 7', '= 35 + 7 = <span class="g">42</span>', '#0d9488', 2.4]].map(c => `<div class="vcard pop" style="--c:${c[3]};--d:${c[4]}s">${ex([c[0], c[1], c[2]])}</div>`).join('')}</div>`),
    no:'7-gangen: bruk det du kan. 3 × 7 er to ganger 7 og én 7 til: 14 + 7 er 21. 6 × 7 er fem ganger 7 og én til: 35 + 7 er 42.', zh:'7 的乘法：用你已经会的。3 × 7 是两个 7 再加一个 7：14 加 7 等于 21。6 × 7 是五个 7 再加一个 7：35 加 7 等于 42。'},
   {html:scene(chain([5, 6, 7, 8], .2, G.learn.c), big('56 = 7 × 8', 3.4, G.learn.c)),
    no:'Siste: 7 × 8. Husk rekka 5, 6, 7, 8. 56 er 7 × 8.', zh:'最后一个：7 × 8。记住数列 5、6、7、8：56 等于 7 × 8。'},
   {html:title('🌟', '10 regnestykker', '10 道算式', `<div class="sub fade" style="--d:.8s">${A.bi('øv litt hver dag', '每天练一点')}</div>`),
    no:'Ti regnestykker. Øv litt hver dag, så sitter de snart!', zh:'十个算式。每天练一点，很快就能记住！'}
  ]},

gs_which: {
  no:'Hvilken regel gjelder?', zh:'用哪条规则？', emoji:'🔍',
  scenes:[
   {html:title('🔍', 'Hvilken regel gjelder?', '用哪条规则？'),
    no:'Hvordan vet du hvilken regel du skal bruke? Still fire spørsmål, i riktig rekkefølge.', zh:'怎么知道该用哪条规则？按顺序问四个问题。'},
   {html:scene(GS.flow(0)),
    no:'Spørsmål 1: Er en av faktorene 1, 2 eller 10? Da bruker du de lette triksene.', zh:'第一问：其中一个因数是 1、2 或 10 吗？那就用简单的窍门。'},
   {html:scene(GS.flow(1)),
    no:'Spørsmål 2: Er en av faktorene 5? Da bruker du fem-gangen: halvparten av ti-gangen.', zh:'第二问：其中一个因数是 5 吗？那就用 5 的乘法：10 的乘法的一半。'},
   {html:scene(GS.flow(2)),
    no:'Spørsmål 3: Er faktorene like? Da er det et kvadrattall, og det pugger du.', zh:'第三问：两个因数相同吗？那是平方数，要背下来。'},
   {html:scene(GS.flow(3)),
    no:'Spørsmål 4: Er en av faktorene 9? Da bruker du ni-regelen: gang med ti og trekk fra.', zh:'第四问：其中一个因数是 9 吗？那就用 9 的规则：先乘 10，再减去。'},
   {html:scene(GS.flow(4)),
    no:'Er svaret nei på alle fire, må du pugge den. Men det er bare 10 regnestykker.', zh:'如果四个问题的答案都是“不”，就要背下来。但只有 10 个算式。'},
   {html:scene(big('6 × 9', .1), fadeIn(GS.traceHTML(6, 9), .5), big('= 60 − 6 = 54', 3.2, G.nine.c)),
    no:'Eksempel: 6 × 9. 1, 2 eller 10? Nei. 5? Nei. Like? Nei. 9? Ja! Da er det ni-regelen: 60 − 6 er 54.', zh:'例子：6 × 9。1、2 或 10？不是。5？不是。相同？不是。9？是！用 9 的规则：60 减 6 等于 54。'},
   {html:scene(big('5 × 5', .1), fadeIn(GS.traceHTML(5, 5), .5), big('= 50 ÷ 2 = 25', 2.4, G.five.c)),
    no:'Eksempel: 5 × 5. 1, 2 eller 10? Nei. 5? Ja! Det er fem-gangen: halvparten av 50 er 25. Se: 5 × 5 hører til fem-gangen, ikke til kvadrattallene.', zh:'例子：5 × 5。1、2 或 10？不是。5？是！用 5 的乘法：50 的一半是 25。注意：5 × 5 属于 5 的乘法，不属于平方数。'},
   {html:scene(big('7 × 8', .1), fadeIn(GS.traceHTML(7, 8), .5), big('= 56', 3.2, G.learn.c)),
    no:'Eksempel: 7 × 8. Nei, nei, nei og nei. Da må du pugge den: 56.', zh:'例子：7 × 8。四个问题的答案都是“不”。那就要背下来：56。'},
   {html:title('🎯', 'Trykk på ❓', '点 ❓', `<div class="sub fade" style="--d:.8s">${A.bi('så får du vite hvilken regel som gjelder', '就能知道用哪条规则')}</div>`),
    no:'Når du øver, kan du alltid trykke på spørsmålstegnet. Da får du vite hvilken regel som gjelder.', zh:'练习时，你随时可以点问号，看看用的是哪条规则。'}
  ]}
});
})();
