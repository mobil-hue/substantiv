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
const w = (p, x) => ({p, w:x});

A.GEO_MODULES = [
 {id:0, emoji:'🌍', color:'#f59e0b', no:'Figurer rundt oss', zh:'我们身边的图形', steps:[
   S.video('geo_intro', 'Se videoen: figurer rundt oss', '看视频：我们身边的图形'),
   S.terms(['figur', 'todim', 'tredim'], 'Begreper', '概念卡片'),
   S.practice('Hvilken figur ligner det på?', '它像什么图形？', ['g_intro'], 6, {maxMod:0}),
   S.practice('Hva betyr ordet?', '这个词是什么意思？', ['g_meta'], 6, {maxMod:0}),
   S.loop('Øv begrepene til du er trygg', '练习概念，直到有把握', ['g_meta'], 5, {maxMod:0})
 ]},
 {id:1, emoji:'🔺', color:'#ef4444', no:'Todimensjonale figurer', zh:'平面图形', steps:[
   S.video('geo_2d', 'Se videoen: flate figurer', '看视频：平面图形'),
   S.terms(['kant', 'hjorne', 'trekant', 'firkant', 'femkant', 'sirkel'], 'Begreper', '概念卡片'),
   S.practice('Hva heter figuren?', '这个图形叫什么？', ['g_shapeName'], 8, {maxLvl:1, maxMod:1}),
   S.practice('Hvor mange hjørner?', '有几个顶点？', ['g_shapeCorners'], 8, {maxLvl:1}),
   S.practice('Hvor mange kanter?', '有几条边？', ['g_shapeEdges'], 6, {maxLvl:1}),
   S.task('Sorter etter antall hjørner', '按顶点数分类', ['g_sortCorners'], 1, {maxLvl:1}),
   S.video('geo_firkant', 'Se videoen: kvadrat og rektangel', '看视频：正方形和长方形'),
   S.terms(['kvadrat', 'rektangel'], 'Begreper', '概念卡片'),
   S.practice('Firkanter: hva heter den?', '四边形：它叫什么？', ['g_quadName'], 8, {maxLvl:1}),
   S.task('Hva heter figurene? Sorter dem', '这些图形叫什么？分类', ['g_sortShapeNames'], 1, {maxLvl:1}),
   S.task('Tegn figurer på prikkpapir', '在点阵纸上画图形', ['g_drawShapes'], 2, {maxLvl:1}),
   S.task('Tegn rektangel og kvadrat', '画长方形和正方形', ['g_drawQuads'], 2, {maxLvl:1}),
   S.practice('Stemmer det?', '对吗？', ['g_facts'], 6, {maxMod:1, maxLvl:2}),
   S.loop('Øv til du er trygg: flate figurer', '练到有把握：平面图形', [w('g_shapeName', 3), w('g_shapeCorners', 2), w('g_shapeEdges', 1), w('g_quadName', 2), w('g_facts', 1), w('g_meta', 1)], 8, {maxLvl:1, maxMod:1, adaptive:true})
 ]},
 {id:2, emoji:'📦', color:'#3b82f6', no:'Tredimensjonale figurer', zh:'立体图形', steps:[
   S.video('geo_3d', 'Se videoen: romfigurer', '看视频：立体图形'),
   S.terms(['flate', 'kube', 'prisme', 'pyramide', 'sylinder', 'kule'], 'Begreper', '概念卡片'),
   S.practice('Todimensjonal eller tredimensjonal?', '二维还是三维？', ['g_twoD3D'], 8, {maxMod:2}),
   S.practice('Hva heter figuren?', '这个立体图形叫什么？', ['g_solidName'], 8, {maxLvl:1}),
   S.practice('Hjørner, kanter og flater', '顶点、棱和面', ['g_solidFacts'], 8, {maxLvl:2}),
   S.task('Fyll ut tabellen', '填表', ['g_table3d'], 1, {maxLvl:2}),
   S.practice('Hvilke flater har figuren?', '这个图形有哪些面？', ['g_facesQ'], 6, {maxLvl:2}),
   S.task('Sorter: flat eller romfigur', '分类：平面还是立体', ['g_sort2d3d'], 1, {maxLvl:1}),
   S.practice('Hør og velg figuren', '听一听，选图形', ['g_listen'], 6, {maxMod:2}),
   S.practice('Gåter: hvilken figur er jeg?', '谜语：我是什么图形？', ['g_riddles'], 6, {maxMod:2, maxLvl:2}),
   S.loop('Øv til du er trygg: romfigurer', '练到有把握：立体图形', [w('g_solidName', 3), w('g_solidFacts', 2), w('g_twoD3D', 2), w('g_facesQ', 1), w('g_riddles', 2), w('g_facts', 1), w('g_meta', 1), w('g_listen', 1)], 8, {maxLvl:1, maxMod:2, adaptive:true})
 ]},
 {id:3, emoji:'🧊', color:'#14b8a6', no:'Fra 3D til 2D: nett og klosser', zh:'从立体到平面：展开图和小方块', steps:[
   S.video('geo_net', 'Se videoen: nett og klosser', '看视频：展开图和小方块'),
   S.terms(['nett'], 'Begreper', '概念卡片'),
   S.practice('Hvilken figur blir nettet?', '这个展开图折成什么？', ['g_netSolid'], 6, {maxLvl:2}),
   S.practice('Hvilket nett er en kube?', '哪个是正方体的展开图？', ['g_netCube'], 6, {maxLvl:2}),
   S.practice('Hvor mange flater har nettet?', '展开图有几个面？', ['g_netFaces'], 6, {maxLvl:2}),
   S.task('Sorter nettene', '给展开图分类', ['g_sortNets'], 1, {maxLvl:2}),
   S.practice('Hvor mange klosser?', '有多少个小方块？', ['g_blocksCount'], 6, {maxLvl:2}),
   S.practice('Hvor mange klosser mangler?', '还差多少个小方块？', ['g_blocksMissing'], 5, {maxLvl:3}),
   S.practice('Regn ut: klosser som mangler', '计算：还差几个小方块', ['g_blocksMissingType'], 4, {maxLvl:3}),
   S.practice('Stemmer det?', '对吗？', ['g_facts'], 6, {maxMod:3, maxLvl:2}),
   S.loop('Øv til du er trygg: nett og klosser', '练到有把握：展开图和小方块', [w('g_netSolid', 2), w('g_netCube', 2), w('g_netFaces', 1), w('g_blocksCount', 2), w('g_blocksMissing', 2), w('g_facts', 1), w('g_meta', 1)], 8, {maxLvl:2, maxMod:3, adaptive:true})
 ]},
 {id:4, emoji:'📐', color:'#16a34a', no:'Vinkler', zh:'角', steps:[
   S.video('geo_angles', 'Se videoen: vinkler', '看视频：角'),
   S.terms(['vinkel', 'rett', 'spiss', 'stump'], 'Begreper', '概念卡片'),
   S.practice('Hva slags vinkel er dette?', '这是什么角？', ['g_angleKind'], 8, {maxLvl:1}),
   S.practice('Mindre eller større enn en rett vinkel?', '比直角小还是大？', ['g_angleCompare'], 6, {maxLvl:2}),
   S.task('Trykk på vinklene', '点出这些角', ['g_angleTap'], 2, {maxLvl:1}),
   S.task('Sorter vinklene', '给角分类', ['g_sortAngles'], 1, {maxLvl:1}),
   S.task('Tegn figurer med vinkler', '画有指定角的图形', ['g_drawAngles'], 2, {maxLvl:2}),
   S.practice('Stemmer det?', '对吗？', ['g_facts'], 6, {maxMod:4, maxLvl:2}),
   S.loop('Øv til du er trygg: vinkler', '练到有把握：角', [w('g_angleKind', 3), w('g_angleCompare', 2), w('g_facts', 1), w('g_meta', 1)], 8, {maxLvl:1, maxMod:4, adaptive:true})
 ]},
 {id:5, emoji:'🧩', color:'#9333ea', no:'Finn ut: gåter og utfordringer', zh:'想一想：谜题和挑战', steps:[
   S.video('geo_puzzle', 'Se videoen: finn ut', '看视频：想一想'),
   S.practice('Gåter: hvilken figur er jeg?', '谜语：我是什么图形？', ['g_riddles'], 8, {maxLvl:2}),
   S.task('Gåter: velg navnet', '谜语：选出名称', ['g_riddleTask'], 1, {maxLvl:2}),
   S.task('Tau-oppgaven', '绳子问题', ['g_rope'], 1),
   S.task('Tegn utfordringer', '画图挑战', ['g_drawChallenge'], 2),
   S.practice('Hvor mye tau rundt figuren?', '围一圈要多少绳子？', ['g_perimeter'], 6),
   S.practice('Klosser: hvor mange mangler?', '小方块：还差几个？', ['g_blocksMissingType'], 4),
   S.loop('Mesterprøven: alt blandet', '大师测验：全部混合', [w('g_shapeName', 2), w('g_shapeCorners', 1), w('g_quadName', 1), w('g_solidName', 2), w('g_solidFacts', 1), w('g_facesQ', 1), w('g_netSolid', 1), w('g_blocksCount', 1), w('g_angleKind', 2), w('g_riddles', 2), w('g_facts', 2), w('g_perimeter', 1), w('g_meta', 1)], 10, {maxLvl:1, adaptive:true})
 ]}
];

A.GEO_ROOM = [
  {no:'Alt blandet', zh:'全部混合', emoji:'🎲', pools:['g_shapeName', 'g_shapeCorners', 'g_quadName', 'g_solidName', 'g_solidFacts', 'g_facesQ', 'g_netSolid', 'g_blocksCount', 'g_angleKind', 'g_riddles', 'g_facts', 'g_perimeter', 'g_meta']},
  {no:'Todimensjonale figurer', zh:'平面图形', emoji:'🔺', pools:['g_shapeName', 'g_shapeCorners', 'g_shapeEdges', 'g_quadName', 'g_sortShapeNames', 'g_sortCorners']},
  {no:'Tegne på prikkpapir', zh:'在点阵纸上画图', emoji:'✏️', pools:['g_drawShapes', 'g_drawQuads', 'g_drawAngles', 'g_drawChallenge']},
  {no:'Tredimensjonale figurer', zh:'立体图形', emoji:'📦', pools:['g_twoD3D', 'g_solidName', 'g_solidFacts', 'g_facesQ', 'g_table3d', 'g_sort2d3d']},
  {no:'Nett og klosser', zh:'展开图和小方块', emoji:'🧊', pools:['g_netSolid', 'g_netCube', 'g_netFaces', 'g_sortNets', 'g_blocksCount', 'g_blocksMissing', 'g_blocksMissingType']},
  {no:'Vinkler', zh:'角', emoji:'📐', pools:['g_angleKind', 'g_angleCompare', 'g_angleTap', 'g_sortAngles']},
  {no:'Gåter og utfordringer', zh:'谜题和挑战', emoji:'🧩', pools:['g_riddles', 'g_riddleTask', 'g_rope', 'g_perimeter']},
  {no:'Stemmer det?', zh:'对吗？', emoji:'✔', pools:['g_facts']},
  {no:'Begreper', zh:'概念', emoji:'🃏', pools:['g_meta']},
  {no:'Hør og velg', zh:'听一听，选一选', emoji:'👂', pools:['g_listen', 'g_vocab']}
];
})();
