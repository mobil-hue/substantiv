(function(){
'use strict';
/* Grunnkurs: færre steg, bare de enkleste ordene, korte videoer og kun flervalg. Fullstendig kurs kommer etterpå. */
const A = window.App;
const S = {
  video:(v, no, zh) => ({t:'video', v, no, zh}),
  terms:(keys, no, zh) => ({t:'terms', keys, no, zh}),
  practice:(no, zh, pools, n, o) => ({t:'practice', no, zh, n, spec:Object.assign({pools, maxLvl:1}, o)}),
  task:(no, zh, pools, n, o) => ({t:'task', no, zh, n, spec:Object.assign({pools, maxLvl:1}, o)}),
  loop:(no, zh, pools, goal, o) => ({t:'loop', no, zh, goal, spec:Object.assign({pools, maxLvl:1}, o)})
};
const w = (p, n) => ({p, w:n});
// adjektiv som ikke tas med i grunnkurset: liten (spesiell), tt-adjektiv, doble konsonanter, gammel
const SK = {skip:':(liten|ny|blå|hvit|grønn|snill|gammel|grå|svart|søt|brun)(:|$)'};

A.BASIC_MODULES = {
 noun:[
  {id:0, emoji:'📗', color:'#f59e0b', no:'Ord for ting', zh:'表示东西的词', steps:[
    S.video('nb_what', 'Se videoen: hva er et substantiv?', '看视频：什么是名词？'),
    S.terms(['substantiv'], 'Ordet «substantiv»', '「名词」这个词'),
    S.practice('Person, dyr, ting eller sted?', '人、动物、东西还是地方？', ['cat'], 6),
    S.practice('Hva heter dette på norsk?', '这个用挪威语怎么说？', ['listen', 'zhMatch'], 6),
    S.loop('Øv litt til', '再练一练', ['cat', 'listen'], 4)
  ]},
  {id:1, emoji:'🎨', color:'#ec4899', no:'en, ei eller et?', zh:'en、ei 还是 et？', steps:[
    S.video('nb_gender', 'Se videoen: en, ei og et', '看视频：en、ei 和 et'),
    S.terms(['artikkel', 'en-ord', 'ei-ord', 'et-ord'], 'Begreper', '概念卡片'),
    S.practice('Velg: en, ei eller et?', '选择：en、ei 还是 et？', ['art'], 6),
    S.task('Sorter: en, ei eller et?', '分类：en、ei 还是 et？', ['sortbox'], 1),
    S.loop('Øv til du er trygg: en, ei, et', '练到有把握：en、ei、et', ['art'], 5)
  ]},
  {id:2, emoji:'➕', color:'#9333ea', no:'Én eller flere', zh:'一个或很多个', steps:[
    S.video('nb_plural', 'Se videoen: entall og flertall', '看视频：单数和复数'),
    S.terms(['entall', 'flertall'], 'Begreper', '概念卡片'),
    S.practice('Entall eller flertall?', '单数还是复数？', ['sing'], 6),
    S.practice('Velg flertall', '选择复数', ['pl'], 6),
    S.loop('Øv til du er trygg: flertall', '练到有把握：复数', [w('pl', 2), w('sing', 1)], 5)
  ]},
  {id:3, emoji:'🔦', color:'#0d9488', no:'Bilen og hunden', zh:'那辆车、那只狗', steps:[
    S.video('nb_def', 'Se videoen: bilen, hunden', '看视频：bilen、hunden'),
    S.terms(['ubestemt', 'bestemt'], 'Begreper', '概念卡片'),
    S.practice('Ubestemt eller bestemt?', '不定还是定指？', ['ubes'], 6),
    S.practice('Velg bestemt form', '选择定指形式', ['bes'], 6),
    S.loop('Øv til du er trygg: bestemt form', '练到有把握：定指形式', [w('bes', 2), w('ubes', 1)], 5)
  ]},
  {id:4, emoji:'🏁', color:'#16a34a', no:'Alt sammen', zh:'全部合在一起', steps:[
    S.terms(['ue', 'be', 'uf', 'bf'], 'De fire formene', '四种形式'),
    S.practice('Hva heter formen?', '这个形式叫什么？', ['formName'], 6),
    S.practice('Hvilket ord passer til bildet?', '哪个词和图片相配？', ['pic'], 6),
    S.task('Sorter formene', '给形式分类', ['matchforms'], 1),
    S.loop('Grunnkurs-prøven: alt blandet', '基础课测验：全部混合', [w('art', 2), w('pl', 2), w('bes', 2), w('formName', 2), w('pic', 1), w('cat', 1)], 8)
  ]}
 ],
 adj:[
  {id:0, emoji:'🐱', color:'#f59e0b', no:'Hvordan er det?', zh:'它怎么样？', steps:[
    S.video('adjb_what', 'Se videoen: hva er et adjektiv?', '看视频：什么是形容词？'),
    S.terms(['adjektiv'], 'Ordet «adjektiv»', '「形容词」这个词'),
    S.practice('Er det et adjektiv?', '这是形容词吗？', ['aj_isadj'], 6, SK),
    S.practice('Hvilket adjektiv passer til bildet?', '哪个形容词和图片相配？', ['aj_pic'], 6, SK),
    S.loop('Øv litt til', '再练一练', [w('aj_isadj', 1), w('aj_pic', 1)], 4, SK)
  ]},
  {id:1, emoji:'↔️', color:'#e11d48', no:'Motsetninger', zh:'反义词', steps:[
    S.video('adj_opp', 'Se videoen: motsetninger', '看视频：反义词'),
    S.terms(['motsetning'], 'Begreper', '概念卡片'),
    S.practice('Hva er motsetningen?', '反义词是什么？', ['aj_opp'], 6),
    S.practice('Hvilket ord passer til bildet?', '哪个词和图片相配？', ['aj_pic'], 6, SK),
    S.loop('Øv til du er trygg: motsetninger', '练到有把握：反义词', [w('aj_opp', 2), w('aj_pic', 1)], 5)
  ]},
  {id:2, emoji:'🎨', color:'#ec4899', no:'en stor hund, et stort hus', zh:'en stor hund、et stort hus', steps:[
    S.video('adjb_gender', 'Se videoen: en stor hund, et stort hus', '看视频：en stor hund、et stort hus'),
    S.terms(['grunnform', 'etform'], 'Begreper', '概念卡片'),
    S.practice('Velg riktig form', '选出正确的形式', ['aj_gender'], 6, SK),
    S.practice('Velg riktig form (en, ei eller et)', '选出正确的形式（en、ei 或 et）', ['aj_gender'], 6, SK),
    S.loop('Øv til du er trygg: en, ei, et', '练到有把握：en、ei、et', ['aj_gender'], 5, SK)
  ]},
  {id:3, emoji:'➕', color:'#9333ea', no:'store hunder', zh:'很多只大狗', steps:[
    S.video('adjb_plural', 'Se videoen: flertall', '看视频：复数'),
    S.terms(['flertallsform'], 'Begreper', '概念卡片'),
    S.practice('Velg flertall', '选择复数', ['aj_pl'], 6, SK),
    S.practice('Hva er flertall?', '哪个是复数？', ['aj_sing'], 6, SK),
    S.loop('Øv til du er trygg: flertall', '练到有把握：复数', [w('aj_pl', 2), w('aj_sing', 1)], 5, SK)
  ]},
  {id:4, emoji:'🏁', color:'#16a34a', no:'Alt sammen', zh:'全部合在一起', steps:[
    S.practice('Etter «er»: velg riktig form', 'er 后面：选出正确的形式', ['aj_pred'], 6, SK),
    S.practice('Alt blandet', '全部混合', [w('aj_gender', 2), w('aj_pl', 2), w('aj_pred', 2)], 8, SK),
    S.loop('Grunnkurs-prøven: alt blandet', '基础课测验：全部混合', [w('aj_isadj', 1), w('aj_opp', 1), w('aj_gender', 2), w('aj_pl', 2), w('aj_pred', 2)], 8, SK)
  ]}
 ]
};
A.BASIC_ROOM = {
 noun:[
  {no:'Alt blandet', zh:'全部混合', emoji:'🎲', pools:['cat', 'art', 'sing', 'pl', 'ubes', 'bes', 'formName', 'pic']},
  {no:'Person, dyr, ting, sted', zh:'人、动物、东西、地方', emoji:'🐾', pools:['cat']},
  {no:'en, ei og et', zh:'en、ei 和 et', emoji:'🎨', pools:['art', 'sortbox']},
  {no:'Flertall', zh:'复数', emoji:'➕', pools:['sing', 'pl']},
  {no:'Bestemt form', zh:'定指形式', emoji:'🔦', pools:['ubes', 'bes']},
  {no:'Ordforråd', zh:'词汇', emoji:'📚', pools:['zhMatch', 'listen']}
 ],
 adj:[
  {no:'Alt blandet', zh:'全部混合', emoji:'🎲', pools:['aj_isadj', 'aj_opp', 'aj_gender', 'aj_pl', 'aj_pred'], skip:SK.skip},
  {no:'Motsetninger', zh:'反义词', emoji:'↔️', pools:['aj_opp', 'aj_pic']},
  {no:'en, ei og et', zh:'en、ei 和 et', emoji:'🎨', pools:['aj_gender'], skip:SK.skip},
  {no:'Flertall', zh:'复数', emoji:'➕', pools:['aj_pl', 'aj_sing'], skip:SK.skip},
  {no:'Etter «er»', zh:'er 后面', emoji:'🏷️', pools:['aj_pred'], skip:SK.skip},
  {no:'Ordforråd', zh:'词汇', emoji:'📚', pools:['aj_zh', 'aj_listen']}
 ]
};
})();
