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
const w = (p, n, o) => Object.assign({p, w:n}, o || {});

A.ADJ_MODULES = [
 {id:0, emoji:'💡', color:'#f59e0b', no:'Hvorfor lære adjektiv?', zh:'为什么要学形容词？', steps:[
   S.video('adj_why', 'Se videoen: hvorfor?', '看视频：为什么？'),
   S.terms(['adjektiv'], 'Ordet «adjektiv»', '「形容词」这个词'),
   S.practice('Hvorfor lærer vi dette?', '我们为什么学这个？', ['aj_why'], 6, {maxMod:0}),
   S.practice('Ord vi skal bruke', '我们要用的单词', ['aj_zh', 'aj_listen'], 8, {maxLvl:1}),
   S.loop('Terp ordet «adjektiv»', '反复练习「形容词」这个词', ['aj_meta'], 5, {maxMod:0})
 ]},
 {id:1, emoji:'🔎', color:'#0ea5e9', no:'Hva er et adjektiv?', zh:'什么是形容词？', steps:[
   S.video('adj_what', 'Se videoen: adjektiv', '看视频：形容词'),
   S.terms(['adjektiv', 'substantiv', 'verb', 'farge', 'størrelse', 'følelse'], 'Begreper', '概念卡片'),
   S.practice('Er det et adjektiv?', '这是形容词吗？', ['aj_isadj'], 8, {maxLvl:1}),
   S.practice('Hva slags adjektiv er det?', '这是哪一类形容词？', ['aj_cat'], 8, {maxLvl:1}),
   S.practice('Substantiv, verb eller adjektiv?', '名词、动词还是形容词？', ['aj_kind'], 8, {maxLvl:1}),
   S.practice('Finn adjektivet i setningen', '在句子里找形容词', ['aj_sent'], 6, {maxLvl:0}),
   S.task('Finn adjektivene (lett)', '找形容词（简单）', ['aj_find'], 1, {maxLvl:0}),
   S.task('Sorter: farge, størrelse, følelse, egenskap', '分类：颜色、大小、心情、特点', ['aj_sortcat'], 1, {maxLvl:1}),
   S.task('Hør og skriv adjektivet', '听写形容词', ['aj_dict_word'], 1, {maxLvl:1}),
   S.task('Finn adjektivene', '找形容词', ['aj_find'], 1, {maxLvl:1}),
   S.loop('Øv til du er trygg: adjektiv', '练到有把握：形容词', [w('aj_isadj', 2), w('aj_cat', 2), w('aj_kind', 2), w('aj_sent', 1), w('aj_pic', 1), w('aj_meta', 1)], 6, {maxLvl:1, maxMod:1, adaptive:true})
 ]},
 {id:2, emoji:'↔️', color:'#e11d48', no:'Motsetninger', zh:'反义词', steps:[
   S.video('adj_opp', 'Se videoen: motsetninger', '看视频：反义词'),
   S.terms(['motsetning'], 'Begreper', '概念卡片'),
   S.practice('Hva er motsetningen?', '反义词是什么？', ['aj_opp'], 8, {maxLvl:1}),
   S.practice('Hvilket ord passer til bildet?', '哪个词和图片相配？', ['aj_pic'], 8, {maxLvl:1}),
   S.practice('Skriv motsetningen', '写出反义词', ['aj_oppType'], 8, {maxLvl:1}),
   S.task('Skriv motsetningene', '写出反义词（表格）', ['aj_opp_table'], 1, {maxLvl:1}),
   S.practice('Flere motsetninger', '更多反义词', [w('aj_opp', 3), w('aj_oppType', 3), w('aj_pic', 1)], 10, {maxLvl:2}),
   S.task('Skriv motsetningene (flere ord)', '写出反义词（更多词）', ['aj_opp_table'], 1, {maxLvl:2}),
   S.loop('Øv til du er trygg: motsetninger', '练到有把握：反义词', [w('aj_opp', 3), w('aj_oppType', 3), w('aj_pic', 1), w('aj_zh', 1), w('aj_listen', 1)], 8, {maxLvl:1, maxMod:2, adaptive:true})
 ]},
 {id:3, emoji:'🎨', color:'#ec4899', no:'Adjektiv med en, ei og et', zh:'形容词和 en、ei、et', steps:[
   S.video('adj_gender', 'Se videoen: en stor hund, et stort hus', '看视频：en stor hund、et stort hus'),
   S.terms(['grunnform', 'etform'], 'Begreper', '概念卡片'),
   S.practice('Velg riktig form', '选出正确的形式', ['aj_gender'], 8, {maxLvl:1, maxMod:3}),
   S.task('Sorter: +t, +tt eller ingen endring', '分类：加 t、加 tt 还是不变', ['aj_sortrule'], 1, {maxLvl:1}),
   S.practice('Skriv adjektivet', '写出形容词', ['aj_genderType'], 6, {maxLvl:1}),
   S.task('Skriv et-formen', '写出 et 形式', ['aj_forms_n'], 1, {maxLvl:1}),
   S.practice('Hva skjer foran et-ord?', '用在 et 名词前会怎样？', ['aj_rule'], 8, {maxLvl:2}),
   S.practice('Flere adjektiv', '更多形容词', [w('aj_gender', 3), w('aj_genderType', 2), w('aj_rule', 1)], 10, {maxLvl:2, maxMod:3}),
   S.task('Skriv et-formen (flere ord)', '写出 et 形式（更多词）', ['aj_forms_n'], 1, {maxLvl:2}),
   S.loop('Øv til du er trygg: en, ei, et', '练到有把握：en、ei、et', [w('aj_gender', 4), w('aj_genderType', 2), w('aj_rule', 1), w('aj_isadj', 1)], 8, {maxLvl:1, maxMod:3, adaptive:true})
 ]},
 {id:4, emoji:'➕', color:'#9333ea', no:'Flertall og bestemt form', zh:'复数和定指形式', steps:[
   S.video('adj_plural', 'Se videoen: flertall og bestemt form', '看视频：复数和定指形式'),
   S.terms(['flertallsform', 'dendetde'], 'Begreper', '概念卡片'),
   S.practice('Velg flertall', '选择复数', ['aj_pl', 'aj_sing'], 8, {maxLvl:1, maxMod:4}),
   S.task('Sorter: en/ei, et eller flertall', '分类：en/ei、et 还是复数', ['aj_sortform'], 1, {maxLvl:1}),
   S.practice('Skriv flertall', '写出复数', ['aj_plType'], 6, {maxLvl:1}),
   S.practice('den, det eller de?', 'den、det 还是 de？', ['aj_denDetDe'], 8, {maxLvl:1}),
   S.practice('Bestemt form: den store hunden', '定指形式：den store hunden', ['aj_def'], 8, {maxLvl:1}),
   S.practice('Skriv bestemt form', '写出定指形式', ['aj_defType'], 6, {maxLvl:1}),
   S.task('Skriv et-form og flertall', '写出 et 形式和复数', ['aj_forms_all'], 1, {maxLvl:1}),
   S.task('Skriv flertall (flere ord)', '写出复数（更多词）', ['aj_forms_pl'], 1, {maxLvl:2}),
   S.task('Hør og skriv formen', '听写：各种形式', ['aj_dict_form'], 1, {maxLvl:2}),
   S.loop('Øv til du er trygg: flertall og bestemt form', '练到有把握：复数和定指', [w('aj_pl', 3), w('aj_plType', 2), w('aj_def', 3), w('aj_denDetDe', 3), w('aj_defType', 1), w('aj_gender', 1)], 10, {maxLvl:1, maxMod:4, adaptive:true})
 ]},
 {id:5, emoji:'⭐', color:'#f97316', no:'Spesielle adjektiv', zh:'特殊的形容词', steps:[
   S.video('adj_special', 'Se videoen: spesielle adjektiv', '看视频：特殊的形容词'),
   S.terms(['liten'], 'Begreper', '概念卡片'),
   S.practice('liten, lita, lite, små', 'liten、lita、lite、små', ['aj_liten'], 8, {maxLvl:1}),
   S.practice('Skriv riktig form av «liten»', '写出 [liten] 的正确形式', ['aj_litenType'], 6, {maxLvl:1}),
   S.practice('Flertall: gamle, åpne, blå', '复数：gamle、åpne、blå', ['aj_special'], 8, {maxLvl:2}),
   S.practice('Hva skjer foran et-ord?', '用在 et 名词前会怎样？', ['aj_rule'], 8, {maxLvl:3}),
   S.task('Sorter: +t, +tt eller ingen endring', '分类：加 t、加 tt 还是不变', ['aj_sortrule'], 1, {maxLvl:2}),
   S.practice('Flere spesielle adjektiv', '更多特殊的形容词', [w('aj_special', 3), w('aj_liten', 2), w('aj_gender', 2, {min:2}), w('aj_pl', 2)], 10, {maxLvl:3, maxMod:5}),
   S.loop('Øv til du er trygg: spesielle adjektiv', '练到有把握：特殊的形容词', [w('aj_liten', 3), w('aj_litenType', 2), w('aj_special', 3), w('aj_rule', 1), w('aj_gender', 1)], 8, {maxLvl:3, maxMod:5, adaptive:true})
 ]},
 {id:6, emoji:'📊', color:'#0ea5e9', no:'Sammenligning', zh:'比较', steps:[
   S.video('adj_cmp', 'Se videoen: stor, større, størst', '看视频：stor、større、størst'),
   S.terms(['gradbøying', 'komparativ', 'superlativ'], 'Begreper', '概念卡片'),
   S.practice('Fullfør rekka: komparativ', '完成这一行：比较级', ['aj_cmpKomp'], 8, {maxLvl:1}),
   S.practice('Fullfør rekka: superlativ', '完成这一行：最高级', ['aj_cmp'], 8, {maxLvl:1}),
   S.practice('Velg riktig i setningen', '在句子里选出正确的形式', ['aj_cmpSent'], 8, {maxLvl:1}),
   S.task('Skriv komparativ og superlativ', '写出比较级和最高级', ['aj_forms_cmp'], 1, {maxLvl:1}),
   S.practice('Skriv riktig form', '写出正确的形式', [w('aj_cmpType', 3), w('aj_cmpSentType', 2)], 8, {maxLvl:2}),
   S.task('Skriv komparativ og superlativ (flere ord)', '写出比较级和最高级（更多词）', ['aj_forms_cmp'], 1, {maxLvl:2}),
   S.loop('Øv til du er trygg: sammenligning', '练到有把握：比较', [w('aj_cmp', 2), w('aj_cmpKomp', 2), w('aj_cmpSent', 3), w('aj_cmpType', 2), w('aj_cmpSentType', 1)], 8, {maxLvl:1, maxMod:6, adaptive:true})
 ]},
 {id:7, emoji:'🏆', color:'#16a34a', no:'Adjektiv i setninger', zh:'句子里的形容词', steps:[
   S.video('adj_sent', 'Se videoen: adjektiv i setninger', '看视频：句子里的形容词'),
   S.terms(['predikativ'], 'Begreper', '概念卡片'),
   S.practice('Etter «er»: velg riktig form', 'er 后面：选出正确的形式', ['aj_pred'], 8, {maxLvl:1}),
   S.practice('Skriv adjektivet etter «er»', '写出 er 后面的形容词', ['aj_predType'], 6, {maxLvl:1}),
   S.task('Bygg setninger', '拼句子', ['aj_build'], 2, {maxLvl:1}),
   S.practice('To adjektiv foran substantivet', '名词前面有两个形容词', ['aj_two'], 6, {maxLvl:3}),
   S.task('Finn adjektivene (vanskelig)', '找形容词（较难）', ['aj_find'], 1, {maxLvl:2}),
   S.task('Bygg setninger (vanskeligere)', '拼句子（较难）', ['aj_build'], 2, {maxLvl:2}),
   S.loop('Mesterprøven: alt blandet', '大师测验：全部混合', [w('aj_isadj', 1), w('aj_opp', 1), w('aj_gender', 2), w('aj_pl', 2), w('aj_def', 2), w('aj_denDetDe', 1), w('aj_pred', 2), w('aj_cmp', 1), w('aj_cmpSent', 1), w('aj_liten', 1), w('aj_special', 1), w('aj_meta', 1)], 10, {maxLvl:2, maxMod:7, adaptive:true})
 ]}
];

/* øvingsrommet */
A.ADJ_ROOM = [
  {no:'Alt blandet', zh:'全部混合', emoji:'🎲', pools:['aj_isadj', 'aj_cat', 'aj_opp', 'aj_gender', 'aj_pl', 'aj_def', 'aj_denDetDe', 'aj_pred', 'aj_cmp', 'aj_cmpSent', 'aj_liten', 'aj_special', 'aj_meta']},
  {no:'Er det et adjektiv?', zh:'这是形容词吗？', emoji:'🔎', pools:['aj_isadj', 'aj_kind', 'aj_cat', 'aj_sent', 'aj_find', 'aj_sortcat']},
  {no:'Motsetninger', zh:'反义词', emoji:'↔️', pools:['aj_opp', 'aj_oppType', 'aj_pic', 'aj_opp_table']},
  {no:'en, ei og et', zh:'en、ei 和 et', emoji:'🎨', pools:['aj_gender', 'aj_genderType', 'aj_rule', 'aj_sortrule', 'aj_forms_n']},
  {no:'Flertall', zh:'复数', emoji:'➕', pools:['aj_pl', 'aj_plType', 'aj_sing', 'aj_forms_pl', 'aj_sortform']},
  {no:'Bestemt form', zh:'定指形式', emoji:'🔦', pools:['aj_def', 'aj_defType', 'aj_denDetDe']},
  {no:'Alle formene', zh:'所有形式', emoji:'4️⃣', pools:['aj_forms_all', 'aj_sortform', 'aj_pred', 'aj_predType']},
  {no:'liten og andre spesielle', zh:'liten 和其他特殊形容词', emoji:'⭐', pools:['aj_liten', 'aj_litenType', 'aj_special', 'aj_rule']},
  {no:'Sammenligning', zh:'比较', emoji:'📊', pools:['aj_cmp', 'aj_cmpKomp', 'aj_cmpSent', 'aj_cmpType', 'aj_cmpSentType', 'aj_forms_cmp']},
  {no:'Etter «er»', zh:'er 后面', emoji:'🏷️', pools:['aj_pred', 'aj_predType', 'aj_two']},
  {no:'Bygg setninger', zh:'拼句子', emoji:'🧱', pools:['aj_build']},
  {no:'Hør og skriv (diktat)', zh:'听写', emoji:'👂', pools:['aj_dict_word', 'aj_dict_form', 'aj_listen', 'aj_genderType', 'aj_plType']},
  {no:'Begreper', zh:'概念', emoji:'🃏', pools:['aj_meta']},
  {no:'Ordforråd', zh:'词汇', emoji:'📚', pools:['aj_zh', 'aj_listen', 'aj_pic']}
];
})();
