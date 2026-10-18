(function(){
'use strict';
const A = window.App, MG = A.MG, N = A.N;
const S = {
  video:(v, no, zh) => ({t:'video', v, no, zh}),
  terms:(keys, no, zh) => ({t:'terms', keys, no, zh}),
  practice:(no, zh, pools, n, o) => ({t:'practice', no, zh, n, spec:Object.assign({pools}, o)}),
  task:(no, zh, pools, n, o) => ({t:'task', no, zh, n, spec:Object.assign({pools}, o)}),
  loop:(no, zh, pools, goal, o) => ({t:'loop', no, zh, goal, spec:Object.assign({pools}, o)})
};
const w = (p, x) => ({p, w:x});

/* ---------- begreper med tegninger ---------- */
const cap = (no, zh) => `<div class="artcap">${A.bi(no, zh)}</div>`;
const lab = (v, no, c) => `<span class="eqx" style="--c:${c}"><b>${v}</b><small>${no}</small></span>`;
const eqLab = (hi) => `<div class="eqlab">${lab(4, 'faktor', hi === 'p' ? '#cbd5e1' : '#2563eb')}<span>×</span>${lab(3, 'faktor', hi === 'p' ? '#cbd5e1' : '#2563eb')}<span>=</span>${lab(12, 'produkt', hi === 'f' ? '#cbd5e1' : '#16a34a')}</div>`;
const chips = (arr, op, cols) => `<div class="mexpr"><div>${arr.map((v, i) => `<span class="chp" style="--c:${cols[i % cols.length]}">${v}</span>`).join(` ${op} `)}</div></div>`;
const roundLine = (a, R) => MG.roundLine(a, R);
const placeTbl = n => { const names = ['hundre', 'tier', 'ener'], d = String(n).split(''); return `<table class="mshift"><tr>${names.map(t => `<th>${t}</th>`).join('')}</tr><tr>${d.map((x, i) => `<td class="v" style="color:${['#2563eb', '#f97316', '#16a34a'][i]}">${x}</td>`).join('')}</tr></table>`; };

const TERMS = [
  {key:'gange', no:'gange (multiplikasjon)', zh:'乘法', py:'chéngfǎ', defNo:'Å legge sammen like store grupper. 4 × 3 betyr 3 + 3 + 3 + 3.', defZh:'把大小相同的几组合起来。4 × 3 就是 3 + 3 + 3 + 3。', ex:'4 × 3 = 12', mod:0, color:'#16a34a',
    art:c => `${MG.groups(4, 3, '🍎', '🧺', {small:true})}<div class="mq" style="font-size:2rem;margin-top:6px">3 + 3 + 3 + 3 = 4 × 3 = 12</div>` + (c ? cap('4 grupper med 3', '4 组，每组 3 个') : '')},
  {key:'faktor', no:'faktor', zh:'因数', py:'yīnshù', defNo:'Et av tallene du ganger sammen. I 4 × 3 er både 4 og 3 faktorer.', defZh:'相乘的每一个数。在 4 × 3 里，4 和 3 都是因数。', ex:'4 × 3', mod:0, color:'#2563eb',
    art:c => eqLab('f') + (c ? cap('tallene du ganger', '相乘的数') : '')},
  {key:'produkt', no:'produkt', zh:'积', py:'jī', defNo:'Svaret når du ganger. I 4 × 3 = 12 er 12 produktet.', defZh:'相乘的结果。在 4 × 3 = 12 里，12 是积。', ex:'4 × 3 = 12', mod:0, color:'#16a34a',
    art:c => eqLab('p') + (c ? cap('svaret på gange', '乘法的结果') : '')},
  {key:'gangetabell', no:'gangetabell', zh:'乘法表', py:'chéngfǎbiǎo', defNo:'En oversikt over svarene når du ganger tall fra 1 til 10.', defZh:'1 到 10 相乘的所有答案的表格。', ex:'3 × 7 = 21', mod:1, color:'#2563eb',
    art:c => MG.mtable({small:true, marks:{'3x7':'#fde68a'}}) + (c ? cap('7 ganger 3 står i rad 3 og kolonne 7', '第 3 行第 7 列是 3 × 7') : '')},
  {key:'bytte', no:'bytte om', zh:'交换位置', py:'jiāohuàn wèizhi', defNo:'Når du ganger, kan du bytte om tallene. Svaret blir det samme.', defZh:'做乘法时可以交换两个数的位置，结果不变。', ex:'3 × 7 = 7 × 3', mod:1, color:'#9333ea',
    art:c => `<div class="row" style="gap:18px;align-items:center">${MG.dots(3, 7, {s:16, r:6})}<span style="font-size:1.8rem">=</span>${MG.dots(7, 3, {s:16, r:6, c1:'#f97316'})}</div>` + (c ? cap('3 × 7 = 7 × 3 = 21', '3 × 7 = 7 × 3 = 21') : '')},
  {key:'dobbelt', no:'dobbelt', zh:'两倍', py:'liǎng bèi', defNo:'To ganger like mye. Dobbelt av 6 er 12.', defZh:'同样多的两份。6 的两倍是 12。', ex:'6 + 6 = 12', mod:1, color:'#f97316',
    art:c => `<div class="row" style="gap:14px;align-items:center">${MG.dots(2, 3, {s:20, r:7})}<span style="font-size:1.8rem">+</span>${MG.dots(2, 3, {s:20, r:7, c1:'#f97316'})}</div>` + (c ? cap('dobbelt av 6 er 12', '6 的两倍是 12') : '')},
  {key:'halvparten', no:'halvparten', zh:'一半', py:'yībàn', defNo:'Del i to like deler. Halvparten av 12 er 6.', defZh:'平均分成两份。12 的一半是 6。', ex:'12 → 6 og 6', mod:1, color:'#0ea5e9',
    art:c => MG.dots(2, 6, {s:20, r:7, split:3}) + (c ? cap('halvparten av 12 er 6', '12 的一半是 6') : '')},
  {key:'plassverdi', no:'plassverdi', zh:'数位', py:'shùwèi', defNo:'Hvor mye et siffer er verdt, etter hvilken plass det står på: enere, tiere eller hundrer.', defZh:'一个数字的值取决于它所在的位置：个位、十位还是百位。', ex:'276 = 2 hundrer + 7 tiere + 6 enere', mod:2, color:'#dc2626',
    art:c => placeTbl(276) + (c ? cap('2 hundrer, 7 tiere, 6 enere', '2 个百、7 个十、6 个一') : '')},
  {key:'utvidet', no:'utvidet form', zh:'展开式', py:'zhǎnkāishì', defNo:'Å dele opp et tall etter plassverdi: 276 = 200 + 70 + 6.', defZh:'按数位把一个数拆开：276 = 200 + 70 + 6。', ex:'276 = 200 + 70 + 6', mod:3, color:'#9333ea',
    art:c => `<div class="mexpr"><div class="mq" style="font-size:2.2rem">276</div><div>⬇</div></div>` + chips([200, 70, 6], '+', ['#2563eb', '#f97316', '#16a34a']) + (c ? cap('hvert siffer for seg', '每个数字分开') : '')},
  {key:'rutenett', no:'rutenett', zh:'方格图（面积模型）', py:'fānggé tú', defNo:'Et rektangel delt i ruter. Hver rute viser et delprodukt.', defZh:'一个分成几格的长方形，每一格是一个部分的乘积。', ex:'276 × 3', mod:3, color:'#14b8a6',
    art:c => MG.area([200, 70, 6], [3], {cells:[['600', '210', '18']], total:'= 828'}) + (c ? cap('600 + 210 + 18 = 828', '600 + 210 + 18 = 828') : '')},
  {key:'sum', no:'sum', zh:'和', py:'hé', defNo:'Svaret når du legger sammen.', defZh:'相加的结果。', ex:'600 + 210 + 18 = 828', mod:3, color:'#16a34a',
    art:c => `<div class="eqlab">${lab(600, 'ledd', '#2563eb')}<span>+</span>${lab(210, 'ledd', '#2563eb')}<span>+</span>${lab(18, 'ledd', '#2563eb')}<span>=</span>${lab(828, 'sum', '#16a34a')}</div>` + (c ? cap('sum = svaret på pluss', '和 = 加法的结果') : '')},
  {key:'avrunde', no:'runde av', zh:'凑整', py:'còuzhěng', defNo:'Å gjøre et tall om til et rundt tall som er lettere å regne med: 298 er nesten 300.', defZh:'把一个数变成容易计算的整数：298 差不多是 300。', ex:'298 ≈ 300', mod:4, color:'#f59e0b',
    art:c => roundLine(298, 300) + (c ? cap('298 er nesten 300', '298 差不多是 300') : '')},
  {key:'rette', no:'rette opp', zh:'补偿', py:'bǔcháng', defNo:'Etter at du har rundet av, må du trekke fra eller legge til det du la på for mye.', defZh:'凑整之后，要把多加的减掉（或多减的加回来）。', ex:'300 × 3 − 2 × 3', mod:4, color:'#f59e0b',
    art:c => `<div class="mexpr"><div>298 × 3</div><div>= 300 × 3 <span style="color:#dc2626">− 2 × 3</span></div><div>= 900 <span style="color:#dc2626">− 6</span> = <span class="g">894</span></div></div>` + (c ? cap('trekk fra det du la på for mye', '把多加的减掉') : '')},
  {key:'differanse', no:'differanse', zh:'差', py:'chā', defNo:'Svaret når du trekker fra.', defZh:'相减的结果。', ex:'900 − 6 = 894', mod:4, color:'#dc2626',
    art:c => `<div class="eqlab">${lab(900, '', '#2563eb')}<span>−</span>${lab(6, '', '#2563eb')}<span>=</span>${lab(894, 'differanse', '#dc2626')}</div>` + (c ? cap('differanse = svaret på minus', '差 = 减法的结果') : '')},
  {key:'mente', no:'mente', zh:'进位', py:'jìnwèi', defNo:'Tierne du tar med til neste plass i oppstillingen.', defZh:'竖式计算中，把十位的数带到下一位。', ex:'6 × 3 = 18: skriv 8, mente 1', mod:5, color:'#ef4444',
    art:c => MG.column(276, 3, {res:['8'], carry:[0, 1], active:1}) + (c ? cap('6 × 3 = 18: skriv 8, mente 1', '6 × 3 = 18：写 8，进位 1') : '')},
  {key:'oppstilling', no:'oppstilling', zh:'竖式', py:'shùshì', defNo:'Å skrive gangestykket under hverandre og regne ett siffer om gangen, fra høyre mot venstre.', defZh:'把算式上下对齐写出来，从右往左一位一位地算。', ex:'276 × 3 = 828', mod:5, color:'#3b82f6',
    art:c => MG.column(276, 3, {res:['8', '2', '8'], carry:[0, 1, 2]}) + (c ? cap('gamlemåten', '传统竖式') : '')}
];
// art vises med tekst (t.art) eller uten (t.artPlain)
TERMS.forEach(t => { const f = t.art; t.art = f(true); t.artPlain = f(false); });
A.MULT_TERMS = TERMS;
A.multTerm = k => TERMS.find(t => t.key === k);

/* ---------- moduler ---------- */
A.MULT_MODULES = [
 {id:0, emoji:'🍎', color:'#16a34a', no:'Hva er gange?', zh:'什么是乘法？', steps:[
   S.video('mul_intro', 'Se videoen: hva er gange?', '看视频：什么是乘法？'),
   S.terms(['gange', 'faktor', 'produkt'], 'Begreper', '概念卡片'),
   S.practice('Hvor mange til sammen?', '一共有多少？', ['m_groups'], 6, {}),
   S.practice('Skriv som gange', '写成乘法', ['m_addmul'], 6, {}),
   S.practice('Rader og kolonner', '行和列', ['m_array', 'm_arrayEq'], 6, {}),
   S.practice('Ord og tall', '文字和数字', ['m_words'], 6, {}),
   S.practice('Gange med 0 og 1', '乘 0 和乘 1', ['m_zero1'], 6, {}),
   S.loop('Øv til du er trygg: hva er gange?', '练到有把握：什么是乘法', [w('m_groups', 2), w('m_addmul', 1), w('m_array', 2), w('m_arrayEq', 1), w('m_words', 1), w('m_zero1', 1)], 8, {maxLvl:1, adaptive:true})
 ]},
 {id:1, emoji:'🔢', color:'#2563eb', no:'Gangetabellen og knepene', zh:'乘法表和小窍门', steps:[
   S.video('mul_table', 'Se videoen: gangetabellen og knepene', '看视频：乘法表和小窍门'),
   S.terms(['gangetabell', 'bytte', 'dobbelt', 'halvparten'], 'Begreper', '概念卡片'),
   S.practice('2-, 5- og 10-gangen', '2、5 和 10 的乘法', ['m_tab_easy'], 8, {}),
   S.practice('Bytt om tallene', '交换位置', ['m_swap'], 6, {}),
   S.practice('Hvilket knep passer?', '哪个小窍门合适？', ['m_knep'], 6, {maxLvl:1}),
   S.practice('3-, 4- og 9-gangen', '3、4 和 9 的乘法', ['m_tab_mid'], 8, {}),
   S.practice('6-, 7- og 8-gangen', '6、7 和 8 的乘法', ['m_tab_hard'], 8, {}),
   S.practice('Hvilket tall mangler?', '缺哪个数？', ['m_missing'], 8, {maxLvl:2}),
   S.loop('Øv til du er trygg: gangetabellen', '练到有把握：乘法表', [w('m_tabs', 4), w('m_missing', 2), w('m_swap', 1), w('m_knep', 1)], 10, {maxLvl:1, adaptive:true})
 ]},
 {id:2, emoji:'🔟', color:'#dc2626', no:'Gange med 10, 100 og 1000', zh:'乘 10、100 和 1000', steps:[
   S.video('mul_ten', 'Se videoen: gange med 10, 100 og 1000', '看视频：乘 10、100 和 1000'),
   S.terms(['plassverdi'], 'Begreper', '概念卡片'),
   S.practice('Gange med 10', '乘 10', ['m_x10'], 6, {}),
   S.practice('Gange med 100', '乘 100', ['m_x100'], 6, {}),
   S.practice('Gange med 1 000', '乘 1 000', ['m_x1000'], 6, {}),
   S.practice('Hva skjer med sifrene?', '数字会怎么变？', ['m_place'], 6, {}),
   S.practice('Tiere og hundrer: 30 × 4', '整十整百：30 × 4', ['m_tens'], 8, {maxLvl:1}),
   S.task('Trinn for trinn: nuller', '一步一步：0 的个数', ['m_calcTen'], 3, {maxLvl:1}),
   S.loop('Øv til du er trygg: tiere, hundrer og tusener', '练到有把握：十、百、千', [w('m_ten', 3), w('m_tens', 2), w('m_calcTen', 1), w('m_place', 1)], 8, {maxLvl:1, adaptive:true})
 ]},
 {id:3, emoji:'🧩', color:'#9333ea', no:'Del opp tallet', zh:'拆分数', steps:[
   S.video('mul_split', 'Se videoen: del opp tallet og rutenett', '看视频：拆分数和方格图'),
   S.terms(['utvidet', 'rutenett', 'sum'], 'Begreper', '概念卡片'),
   S.practice('Hvilken oppdeling passer?', '怎么拆才对？', ['m_splitMC'], 6, {maxLvl:1}),
   S.practice('Hva står i ruten?', '格子里写什么？', ['m_areaRead'], 6, {maxLvl:1}),
   S.task('Trinn for trinn: tosifret tall', '一步一步：两位数', ['m_split2'], 3, {maxLvl:1}),
   S.task('Trinn for trinn: tresifret tall', '一步一步：三位数', ['m_split3'], 3, {maxLvl:2}),
   S.loop('Øv til du er trygg: del opp tallet', '练到有把握：拆分数', [w('m_splitMC', 1), w('m_areaRead', 1), w('m_split2', 2), w('m_split3', 1)], 6, {maxLvl:1, adaptive:true})
 ]},
 {id:4, emoji:'🎯', color:'#f59e0b', no:'Runde av og rette opp', zh:'凑整和补偿', steps:[
   S.video('mul_round', 'Se videoen: runde av, dobbelt og halvparten', '看视频：凑整、两倍和一半'),
   S.terms(['avrunde', 'rette', 'differanse'], 'Begreper', '概念卡片'),
   S.task('Dobbelt og halvparten', '两倍和一半', ['m_double'], 3, {maxLvl:1}),
   S.task('Runde av og rette opp: 2-sifret', '凑整再补偿：两位数', ['m_round'], 3, {maxLvl:1}),
   S.task('276 × 3 = 300 × 3 − 24 × 3', '276 × 3 = 300 × 3 − 24 × 3', ['m_round'], 3, {maxLvl:3}),
   S.practice('Hvilket knep passer best?', '哪个方法最合适？', ['m_pick'], 6, {}),
   S.loop('Øv til du er trygg: knepene', '练到有把握：小窍门', [w('m_pick', 2), w('m_round', 2), w('m_double', 2), w('m_split2', 1)], 6, {maxLvl:2, adaptive:true})
 ]},
 {id:5, emoji:'📚', color:'#3b82f6', no:'Gamlemåten: oppstilling med mente', zh:'传统竖式和进位', steps:[
   S.video('mul_standard', 'Se videoen: gamlemåten med mente', '看视频：竖式和进位'),
   S.terms(['mente', 'oppstilling'], 'Begreper', '概念卡片'),
   S.practice('Hva blir mente?', '进位是多少？', ['m_carry'], 6, {maxLvl:1}),
   S.task('Trinn for trinn: to sifre', '一步一步：两位数', ['m_std2'], 3, {maxLvl:1}),
   S.task('Trinn for trinn: tre sifre', '一步一步：三位数', ['m_std3'], 3, {maxLvl:2}),
   S.task('Trinn for trinn: fire sifre', '一步一步：四位数', ['m_std4'], 2, {}),
   S.loop('Øv til du er trygg: gamlemåten', '练到有把握：竖式', [w('m_carry', 1), w('m_std2', 2), w('m_std3', 2), w('m_std4', 1)], 5, {maxLvl:2, adaptive:true})
 ]},
 {id:6, emoji:'📝', color:'#0d9488', no:'Tekstoppgaver', zh:'应用题', steps:[
   S.video('mul_story', 'Se videoen: tekstoppgaver', '看视频：应用题'),
   S.practice('Pluss, minus eller gange?', '加、减还是乘？', ['m_storyPick'], 6, {}),
   S.practice('Hvilket regnestykke?', '哪个算式？', ['m_storyEq'], 6, {maxLvl:1}),
   S.task('Tekstoppgaver med små tall', '数小的应用题', ['m_story1'], 3, {}),
   S.task('Tekstoppgaver med tosifrede tall', '两位数的应用题', ['m_story2'], 3, {}),
   S.task('Tekstoppgaver med tresifrede tall', '三位数的应用题', ['m_story3'], 2, {}),
   S.loop('Øv til du er trygg: tekstoppgaver', '练到有把握：应用题', [w('m_storyPick', 1), w('m_storyEq', 1), w('m_story1', 2), w('m_story2', 2), w('m_story3', 1)], 5, {maxLvl:2, adaptive:true})
 ]},
 {id:7, emoji:'🏆', color:'#a855f7', no:'Utfordringer og mesterprøven', zh:'挑战和大师测验', steps:[
   S.task('Rutenett med to-sifret × to-sifret', '方格图：两位数乘两位数', ['m_area22'], 2, {}),
   S.task('Gamlemåten: to-sifret × to-sifret', '竖式：两位数乘两位数', ['m_std22'], 2, {}),
   S.loop('Mesterprøven: alt blandet', '大师测验：全部混合', [w('m_tabs', 3), w('m_ten', 1), w('m_missing', 1), w('m_mixCalc', 3), w('m_story2', 1), w('m_storyPick', 1)], 10, {maxLvl:1, adaptive:true})
 ]}
];

A.MULT_ROOM = [
  {no:'Alt blandet', zh:'全部混合', emoji:'🎲', pools:['m_tabs', 'm_missing', 'm_ten', 'm_tens', 'm_mixCalc', 'm_story1', 'm_storyPick']},
  {no:'Gangetabellen (alle)', zh:'乘法表（全部）', emoji:'🔢', pools:['m_tabs']},
  {no:'2-, 5- og 10-gangen', zh:'2、5 和 10 的乘法', emoji:'🔟', pools:['m_tab_easy']},
  {no:'3-, 4- og 9-gangen', zh:'3、4 和 9 的乘法', emoji:'🔢', pools:['m_tab_mid']},
  {no:'6-, 7- og 8-gangen', zh:'6、7 和 8 的乘法', emoji:'🔢', pools:['m_tab_hard']},
  {no:'Hvilket tall mangler?', zh:'缺哪个数？', emoji:'❓', pools:['m_missing']},
  {no:'Gange med 10, 100, 1 000', zh:'乘 10、100、1 000', emoji:'🔟', pools:['m_ten', 'm_place']},
  {no:'Tiere og hundrer: 30 × 4', zh:'整十整百：30 × 4', emoji:'🧮', pools:['m_tens', 'm_calcTen']},
  {no:'Del opp tallet og rutenett', zh:'拆分数和方格图', emoji:'🧩', pools:['m_splitMC', 'm_areaRead', 'm_split2', 'm_split3']},
  {no:'Runde av og rette opp', zh:'凑整和补偿', emoji:'🎯', pools:['m_round', 'm_pick']},
  {no:'Dobbelt og halvparten', zh:'两倍和一半', emoji:'✌️', pools:['m_double']},
  {no:'Gamlemåten (oppstilling)', zh:'传统竖式', emoji:'📚', pools:['m_carry', 'm_std2', 'm_std3', 'm_std4']},
  {no:'Tekstoppgaver', zh:'应用题', emoji:'📝', pools:['m_storyPick', 'm_storyEq', 'm_story1', 'm_story2', 'm_story3']},
  {no:'Utfordring: to-sifret × to-sifret', zh:'挑战：两位数乘两位数', emoji:'🏆', pools:['m_area22', 'm_std22']}
];
})();
