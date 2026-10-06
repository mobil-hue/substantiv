(function(){
'use strict';
const A = window.App;
const S = {
  video:(v, no, zh) => ({t:'video', v, no, zh}),
  terms:(keys, no, zh) => ({t:'terms', keys, no, zh}),
  practice:(no, zh, pools, n, o) => ({t:'practice', no, zh, n, spec:Object.assign({pools}, o)}),
  task:(no, zh, pools, n, o) => ({t:'task', no, zh, n, spec:Object.assign({pools}, o)}),
  loop:(no, zh, pools, goal, o) => ({t:'loop', no, zh, goal, spec:Object.assign({pools}, o)})
};

A.MODULES = [
 {id:0, emoji:'💡', color:'#f59e0b', no:'Hvorfor lære substantiv?', zh:'为什么要学名词？', steps:[
   S.video('why', 'Se videoen: hvorfor?', '看视频：为什么？'),
   S.terms(['substantiv'], 'Ordet «substantiv»', '「名词」这个词'),
   S.practice('Hvorfor lærer vi dette?', '我们为什么学这个？', ['why'], 6, {maxMod:0}),
   S.practice('Ord vi skal bruke', '我们要用的单词', ['zhMatch', 'listen'], 8, {maxLvl:1}),
   S.loop('Terp ordet «substantiv»', '反复练习「名词」这个词', ['meta'], 5, {maxMod:0})
 ]},
 {id:1, emoji:'🔎', color:'#0ea5e9', no:'Hva er et substantiv?', zh:'什么是名词？', steps:[
   S.video('what', 'Se videoen: substantiv', '看视频：名词'),
   S.terms(['substantiv', 'verb', 'adjektiv', 'egennavn', 'stor', 'liten'], 'Begreper', '概念卡片'),
   S.practice('Er det et substantiv?', '这是名词吗？', ['isnoun'], 8, {maxLvl:1, maxMod:1}),
   S.practice('Person, dyr, ting eller sted?', '人、动物、东西还是地方？', ['cat'], 8, {maxLvl:1}),
   S.task('Finn substantivene (lett)', '找名词（简单）', ['find'], 1, {maxLvl:0}),
   S.practice('Substantiv, verb eller adjektiv?', '名词、动词还是形容词？', ['kind'], 8, {maxLvl:1}),
   S.practice('Finn substantivet i setningen', '在句子里找名词', ['sentNoun'], 6, {maxLvl:0}),
   S.practice('Egennavn: stor eller liten bokstav?', '专有名词：大写还是小写？', ['caps'], 8, {maxMod:1}),
   S.practice('Skriv med riktig bokstav', '用正确的字母书写', ['capsType'], 6, {maxMod:1}),
   S.task('Finn ordene som må ha stor bokstav', '找出必须大写的词', ['findcaps'], 1, {maxLvl:1}),
   S.task('Sorter: person, dyr, ting, sted', '分类：人、动物、东西、地方', ['sortcat'], 1, {maxLvl:1}),
   S.loop('Øv til du er trygg: substantiv', '练到有把握：名词', [{p:'isnoun', w:2}, {p:'cat', w:2}, {p:'kind', w:1}, {p:'caps', w:1}, {p:'capsType', w:1}, {p:'meta', w:1}], 6, {maxLvl:1, maxMod:1, adaptive:true})
 ]},
 {id:2, emoji:'🎨', color:'#ec4899', no:'en, ei og et', zh:'en、ei 和 et', steps:[
   S.video('gender', 'Se videoen: en, ei, et', '看视频：en、ei、et'),
   S.terms(['artikkel', 'en-ord', 'ei-ord', 'et-ord'], 'Begreper', '概念卡片'),
   S.practice('Velg: en, ei eller et?', '选择：en、ei 还是 et？', ['art'], 8, {maxLvl:1}),
   S.task('Bygg setningen', '拼句子', ['build'], 2, {maxLvl:0}),
   S.task('Sorter: en, ei eller et?', '分类：en、ei 还是 et？', ['sortbox'], 1, {maxLvl:1}),
   S.practice('Flere ord: en, ei, et', '更多单词：en、ei、et', [{p:'art', w:4}, {p:'meta', w:1, min:2}], 10, {maxLvl:2, maxMod:2}),
   S.task('Diktat med en, ei, et', '听写：加上 en、ei、et', ['dict_art'], 1, {maxLvl:1}),
   S.task('Sorter: flere ord', '分类：更多单词', ['sortbox'], 1, {maxLvl:2}),
   S.loop('Øv til du er trygg: en, ei, et', '练到有把握：en、ei、et', [{p:'art', w:4}, {p:'zhMatch', w:1}, {p:'listen', w:1}, {p:'meta', w:1}], 8, {maxLvl:1, maxMod:2, adaptive:true})
 ]},
 {id:3, emoji:'➕', color:'#9333ea', no:'Entall og flertall', zh:'单数和复数', steps:[
   S.video('plural', 'Se videoen: entall og flertall', '看视频：单数和复数'),
   S.terms(['entall', 'flertall'], 'Begreper', '概念卡片'),
   S.practice('Entall eller flertall?', '单数还是复数？', ['sing'], 6, {maxLvl:1, maxMod:3}),
   S.practice('Velg flertall', '选择复数', ['pl'], 8, {maxLvl:1}),
   S.task('Skriv flertall', '写出复数', ['forms_uf'], 1, {maxLvl:1}),
   S.practice('Skriv flertall (enkeltord)', '写出复数（单个单词）', ['plType'], 6, {maxLvl:2}),
   S.task('Skriv flertall (flere ord)', '写出复数（更多单词）', ['forms_uf'], 1, {maxLvl:2}),
   S.practice('Spesielle flertall', '特别的复数', [{p:'pl', w:2}, {p:'plType', w:2}, {p:'sing', w:1}, {p:'meta', w:1, min:1}], 10, {maxLvl:3, maxMod:3}),
   S.loop('Øv til du er trygg: flertall', '练到有把握：复数', [{p:'pl', w:3}, {p:'plType', w:3}, {p:'sing', w:2}, {p:'art', w:1}, {p:'meta', w:1}], 8, {maxLvl:1, maxMod:3, adaptive:true})
 ]},
 {id:4, emoji:'🔦', color:'#0d9488', no:'Ubestemt og bestemt', zh:'不定和定指', steps:[
   S.video('definite', 'Se videoen: ubestemt og bestemt', '看视频：不定和定指'),
   S.terms(['ubestemt', 'bestemt'], 'Begreper', '概念卡片'),
   S.practice('Ubestemt eller bestemt?', '不定还是定指？', ['ubes'], 6, {maxLvl:1, maxMod:4}),
   S.practice('Velg bestemt form', '选择定指形式', ['bes'], 8, {maxLvl:1}),
   S.task('Skriv bestemt form', '写出定指形式', ['forms_be'], 1, {maxLvl:1}),
   S.practice('Skriv bestemt form (enkeltord)', '写出定指形式（单个单词）', ['besType'], 6, {maxLvl:2}),
   S.task('Skriv bestemt form (flere ord)', '写出定指形式（更多单词）', ['forms_be'], 1, {maxLvl:2}),
   S.loop('Øv til du er trygg: bestemt form', '练到有把握：定指形式', [{p:'bes', w:3}, {p:'besType', w:3}, {p:'ubes', w:2}, {p:'pl', w:1}, {p:'meta', w:1}], 8, {maxLvl:1, maxMod:4, adaptive:true})
 ]},
 {id:5, emoji:'4️⃣', color:'#a16207', no:'De fire formene', zh:'四种形式', steps:[
   S.video('forms', 'Se videoen: de fire formene', '看视频：四种形式'),
   S.terms(['ue', 'be', 'uf', 'bf'], 'Navnene på formene', '四种形式的名字'),
   S.practice('Hva heter formen?', '这个形式叫什么？', [{p:'nameMatch', w:1, min:2}, {p:'formName', w:3}], 8, {maxLvl:1}),
   S.task('Sorter formene', '给形式分类', ['matchforms'], 1, {maxLvl:1}),
   S.practice('Hvilket ord passer til bildet?', '哪个词和图片相配？', ['pic'], 8, {maxLvl:1}),
   S.practice('Skriv formen', '写出这个形式', ['formWrite'], 8, {maxLvl:1}),
   S.task('Alle fire formene', '四种形式', ['forms_all'], 1, {maxLvl:1}),
   S.task('Sorter formene (flere ord)', '给形式分类（更多单词）', ['matchforms'], 1, {maxLvl:2}),
   S.task('Alle fire formene (flere ord)', '四种形式（更多单词）', ['forms_all'], 1, {maxLvl:2}),
   S.task('Diktat: formene', '听写：各种形式', ['dict_form'], 1, {maxLvl:1}),
   S.loop('Øv til du er trygg: fire former', '练到有把握：四种形式', [{p:'formName', w:3}, {p:'formWrite', w:3}, {p:'pic', w:2}, {p:'nameMatch', w:1}, {p:'meta', w:1}], 10, {maxLvl:1, adaptive:true})
 ]},
 {id:6, emoji:'🕵️', color:'#16a34a', no:'Finn substantivene', zh:'找出名词', steps:[
   S.video('find', 'Se videoen: finn substantivene', '看视频：找出名词'),
   S.terms(['substantiv', 'egennavn'], 'Begreper', '概念卡片'),
   S.task('Finn substantivene', '找出名词', ['find'], 1, {maxLvl:1}),
   S.practice('Hvilket ord er substantiv?', '哪个词是名词？', ['sentNoun'], 8, {maxLvl:1}),
   S.task('Bygg setninger', '拼句子', ['build'], 2, {maxLvl:1}),
   S.task('Finn substantivene (vanskelig)', '找出名词（较难）', ['find'], 1, {maxLvl:2}),
   S.task('Stor bokstav i egennavn', '专有名词要大写', ['findcaps'], 1, {maxLvl:2}),
   S.task('Diktat', '听写', ['dict_word'], 1, {maxLvl:2}),
   S.loop('Mesterprøven: alt blandet', '大师测验：全部混合', [{p:'isnoun', w:1}, {p:'cat', w:1}, {p:'art', w:2}, {p:'pl', w:2}, {p:'bes', w:2}, {p:'formName', w:2}, {p:'formWrite', w:2}, {p:'sentNoun', w:2}, {p:'caps', w:1}, {p:'capsType', w:1}, {p:'meta', w:1}, {p:'zhMatch', w:1}], 10, {maxLvl:1, adaptive:true})
 ]}
];

/* øvingsrommet: fritt valg, uendelig løkke til man er trygg */
A.ROOM = [
  {no:'Alt blandet', zh:'全部混合', emoji:'🎲', pools:['isnoun','cat','art','pl','bes','formName','formWrite','sentNoun','caps','capsType','meta','zhMatch','kind']},
  {no:'Er det et substantiv?', zh:'这是名词吗？', emoji:'🔎', pools:['isnoun','kind','sentNoun']},
  {no:'Person, dyr, ting, sted', zh:'人、动物、东西、地方', emoji:'🐾', pools:['cat','sortcat']},
  {no:'Stor bokstav i egennavn', zh:'专有名词大写', emoji:'🔠', pools:['caps','capsType','findcaps']},
  {no:'en, ei og et', zh:'en、ei 和 et', emoji:'🎨', pools:['art','sortbox','dict_art']},
  {no:'Flertall', zh:'复数', emoji:'➕', pools:['pl','plType','sing','forms_uf']},
  {no:'Bestemt form', zh:'定指形式', emoji:'🔦', pools:['bes','besType','ubes','forms_be']},
  {no:'De fire formene', zh:'四种形式', emoji:'4️⃣', pools:['formName','formWrite','pic','nameMatch','matchforms','forms_all']},
  {no:'Finn substantivene', zh:'找出名词', emoji:'🕵️', pools:['find','sentNoun']},
  {no:'Bygg setninger', zh:'拼句子', emoji:'🧱', pools:['build']},
  {no:'Hør og skriv (diktat)', zh:'听写', emoji:'👂', pools:['dict_word','dict_art','dict_form','listen','plType']},
  {no:'Begreper', zh:'概念', emoji:'🃏', pools:['meta']},
  {no:'Ordforråd', zh:'词汇', emoji:'📚', pools:['zhMatch','listen']}
];
})();
