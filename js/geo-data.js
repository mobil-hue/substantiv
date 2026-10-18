(function(){
'use strict';
const A = window.App;

/* navn: norsk, kinesisk, pinyin */
A.GEO_NAMES = {
  trekant:{zh:'三角形', py:'sānjiǎoxíng'}, firkant:{zh:'四边形', py:'sìbiānxíng'}, kvadrat:{zh:'正方形', py:'zhèngfāngxíng'},
  rektangel:{zh:'长方形', py:'chángfāngxíng'}, femkant:{zh:'五边形', py:'wǔbiānxíng'}, sekskant:{zh:'六边形', py:'liùbiānxíng'}, sirkel:{zh:'圆', py:'yuán'},
  kube:{zh:'正方体', py:'zhèngfāngtǐ'}, prisme:{zh:'棱柱（盒子）', py:'léngzhù'}, pyramide:{zh:'棱锥（金字塔）', py:'léngzhuī'},
  sylinder:{zh:'圆柱', py:'yuánzhù'}, kule:{zh:'球', py:'qiú'}, trekantprisme:{zh:'三棱柱', py:'sānléngzhù'}
};
A.GEO_2D = ['trekant', 'firkant', 'kvadrat', 'rektangel', 'femkant', 'sirkel'];
A.GEO_3D = ['kube', 'prisme', 'pyramide', 'sylinder', 'kule', 'trekantprisme'];

/* begreper. mod = første modul der begrepet læres */
A.GEO_TERMS = [
  {key:'figur', no:'figur', zh:'图形', py:'túxíng', defNo:'Noe du kan se eller tegne, for eksempel en trekant eller en kube.', defZh:'你能看到或画出来的东西，比如三角形或正方体。', ex:'trekant · kube', mod:0, color:'#f97316'},
  {key:'todim', no:'todimensjonal', zh:'二维（平面的）', py:'èrwéi', defNo:'Flat. Har lengde og bredde. Du kan tegne den på papir.', defZh:'平的。有长度和宽度。可以画在纸上。', ex:'trekant · firkant · sirkel', mod:0, color:'#0ea5e9'},
  {key:'tredim', no:'tredimensjonal', zh:'三维（立体的）', py:'sānwéi', defNo:'Har lengde, bredde og høyde. Du kan holde den i hånden.', defZh:'有长度、宽度和高度。可以拿在手里。', ex:'kube · kule · pyramide', mod:0, color:'#9333ea'},
  {key:'kant', no:'kant', zh:'边 / 棱', py:'biān / léng', defNo:'Linjen mellom to hjørner. På en flat figur heter den også sidekant.', defZh:'两个顶点之间的线。平面图形里也叫“边”。', ex:'en trekant har 3 kanter', mod:1, color:'#ef4444'},
  {key:'hjorne', no:'hjørne', zh:'顶点 / 角', py:'dǐngdiǎn', defNo:'Stedet der kantene møtes.', defZh:'几条边相交的地方。', ex:'en firkant har 4 hjørner', mod:1, color:'#ef4444'},
  {key:'trekant', no:'trekant', zh:'三角形', py:'sānjiǎoxíng', defNo:'3 hjørner og 3 kanter.', defZh:'3 个顶点，3 条边。', ex:'▲', mod:1, color:'#ef4444'},
  {key:'firkant', no:'firkant', zh:'四边形', py:'sìbiānxíng', defNo:'4 hjørner og 4 kanter.', defZh:'4 个顶点，4 条边。', ex:'▭ ◇', mod:1, color:'#3b82f6'},
  {key:'femkant', no:'femkant', zh:'五边形', py:'wǔbiānxíng', defNo:'5 hjørner og 5 kanter.', defZh:'5 个顶点，5 条边。', ex:'⬠', mod:1, color:'#a855f7'},
  {key:'sirkel', no:'sirkel', zh:'圆', py:'yuán', defNo:'Helt rund. Ingen hjørner.', defZh:'完全是圆的。没有顶点。', ex:'●', mod:1, color:'#0ea5e9'},
  {key:'kvadrat', no:'kvadrat', zh:'正方形', py:'zhèngfāngxíng', defNo:'En firkant med 4 rette hjørner og 4 like lange kanter.', defZh:'有 4 个直角、4 条边一样长的四边形。', ex:'■', mod:1, color:'#f59e0b'},
  {key:'rektangel', no:'rektangel', zh:'长方形', py:'chángfāngxíng', defNo:'En firkant med 4 rette hjørner. Kantene er like lange to og to.', defZh:'有 4 个直角的四边形。对边一样长。', ex:'▬', mod:1, color:'#16a34a'},
  {key:'flate', no:'flate', zh:'面', py:'miàn', defNo:'Den flate siden på en tredimensjonal figur.', defZh:'立体图形上平的那一面。', ex:'en kube har 6 flater', mod:2, color:'#f97316'},
  {key:'kube', no:'kube', zh:'正方体', py:'zhèngfāngtǐ', defNo:'6 flater som alle er kvadrater. 8 hjørner og 12 kanter.', defZh:'6 个面，全是正方形。8 个顶点，12 条棱。', ex:'🎲', mod:2, color:'#f59e0b'},
  {key:'prisme', no:'prisme', zh:'棱柱（盒子）', py:'léngzhù', defNo:'Som en eske. For eksempel 2 kvadrater og 4 rektangler.', defZh:'像一个盒子。比如 2 个正方形和 4 个长方形。', ex:'📦', mod:2, color:'#3b82f6'},
  {key:'pyramide', no:'pyramide', zh:'棱锥（金字塔）', py:'léngzhuī', defNo:'1 kvadrat og 4 trekanter. 5 flater.', defZh:'1 个正方形和 4 个三角形。5 个面。', ex:'🔺', mod:2, color:'#f59e0b'},
  {key:'sylinder', no:'sylinder', zh:'圆柱', py:'yuánzhù', defNo:'To sirkler og en rund side.', defZh:'两个圆和一个弯曲的侧面。', ex:'🥫', mod:2, color:'#22c55e'},
  {key:'kule', no:'kule', zh:'球', py:'qiú', defNo:'Helt rund. Ingen kanter og ingen hjørner.', defZh:'完全是圆的。没有棱，没有顶点。', ex:'⚽', mod:2, color:'#ef4444'},
  {key:'nett', no:'nett (utbrettet figur)', zh:'展开图', py:'zhǎnkāitú', defNo:'En tredimensjonal figur brettet ut flat.', defZh:'把立体图形展开铺平后的样子。', ex:'kube → 6 kvadrater', mod:3, color:'#14b8a6'},
  {key:'vinkel', no:'vinkel', zh:'角', py:'jiǎo', defNo:'Det som dannes der to linjer møtes.', defZh:'两条线相交形成的角。', ex:'∠', mod:4, color:'#0ea5e9'},
  {key:'rett', no:'rett vinkel', zh:'直角', py:'zhíjiǎo', defNo:'Som hjørnet på et ark. 90°.', defZh:'像纸的角。90°。', ex:'∟', mod:4, color:'#16a34a'},
  {key:'spiss', no:'spiss vinkel', zh:'锐角', py:'ruìjiǎo', defNo:'Mindre enn en rett vinkel. Spiss som en blyant.', defZh:'比直角小。像铅笔尖。', ex:'<90°', mod:4, color:'#ef4444'},
  {key:'stump', no:'stump vinkel', zh:'钝角', py:'dùnjiǎo', defNo:'Større enn en rett vinkel. Vid og åpen.', defZh:'比直角大。又宽又开。', ex:'>90°', mod:4, color:'#3b82f6'}
];
A.geoTerm = k => A.GEO_TERMS.find(t => t.key === k);

/* hverdagsting -> figur (modul 0) */
A.GEO_OBJECTS = [
  ['vindu', '窗户', '🪟', 'rektangel'], ['ball', '球', '⚽', 'kule'], ['terning', '骰子', '🎲', 'kube'], ['hermetikkboks', '罐头', '🥫', 'sylinder'],
  ['pizza (sett ovenfra)', '披萨（从上面看）', '🍕', 'sirkel'], ['trafikkskilt «fare»', '“危险”交通标志', '⚠️', 'trekant'], ['skoeske', '鞋盒', '📦', 'prisme'], ['pyramiden i Egypt', '埃及金字塔', '🏜️', 'pyramide']
];

/* gåter. opts = navn å velge mellom */
const O2 = ['trekant', 'firkant', 'kvadrat', 'rektangel', 'femkant', 'sirkel'], O3 = ['kube', 'prisme', 'pyramide', 'sylinder', 'kule', 'trekantprisme'];
A.GEO_RIDDLES = [
  {id:'r1', mod:1, lvl:1, set:O2, ans:'trekant', no:'Jeg har 3 hjørner og 3 kanter. Hvilken figur er jeg?', zh:'我有 3 个顶点和 3 条边。我是什么图形？'},
  {id:'r2', mod:1, lvl:1, set:O2, ans:'kvadrat', no:'Jeg har 4 rette hjørner. Alle kantene er like lange. Hvilken figur er jeg?', zh:'我有 4 个直角，4 条边都一样长。我是什么图形？'},
  {id:'r3', mod:1, lvl:1, set:O2, ans:'rektangel', no:'Jeg har 4 rette hjørner. Kantene er like lange to og to. Ikke alle er like. Hvilken figur er jeg?', zh:'我有 4 个直角。对边一样长，但不是四条边都一样长。我是什么图形？'},
  {id:'r4', mod:1, lvl:1, set:O2, ans:'sirkel', no:'Jeg har ingen hjørner. Jeg er helt rund. Hvilken figur er jeg?', zh:'我没有顶点。我是圆圆的。我是什么图形？'},
  {id:'r5', mod:1, lvl:1, set:O2, ans:'femkant', no:'Jeg har 5 hjørner og 5 kanter. Hvilken figur er jeg?', zh:'我有 5 个顶点和 5 条边。我是什么图形？'},
  {id:'r6', mod:1, lvl:2, set:O2, ans:'firkant', no:'Jeg har 4 kanter, men hjørnene mine er ikke rette. Hvilken figur er jeg?', zh:'我有 4 条边，但我的角不是直角。我是什么图形？'},
  {id:'r7', mod:2, lvl:1, set:O3, ans:'pyramide', no:'Jeg har 5 flater. 4 av flatene er trekanter. Hvilken figur er jeg?', zh:'我有 5 个面。其中 4 个面是三角形。我是什么立体图形？'},
  {id:'r8', mod:2, lvl:1, set:O3, ans:'kube', no:'Jeg har 6 flater. Alle flatene er kvadrater. Hvilken figur er jeg?', zh:'我有 6 个面。所有的面都是正方形。我是什么立体图形？'},
  {id:'r9', mod:2, lvl:2, set:O3, ans:'prisme', alts:['firkantet prisme', 'eske'], no:'Jeg har 6 flater. 2 av dem er kvadrater og 4 er rektangler. Hvilken figur er jeg?', zh:'我有 6 个面。2 个是正方形，4 个是长方形。我是什么立体图形？'},
  {id:'r10', mod:2, lvl:1, set:O3, ans:'kule', no:'Jeg er helt rund. Jeg har ingen kanter og ingen hjørner. Hvilken figur er jeg?', zh:'我是圆滚滚的。没有棱，也没有顶点。我是什么立体图形？'},
  {id:'r11', mod:2, lvl:1, set:O3, ans:'sylinder', no:'Jeg har 2 flate sirkler og en rund side. Hvilken figur er jeg?', zh:'我有 2 个平的圆和一个弯曲的侧面。我是什么立体图形？'},
  {id:'r12', mod:2, lvl:2, set:O3, ans:'kube', no:'Jeg har 8 hjørner og 12 kanter. Alle flatene mine er like. Hvilken figur er jeg?', zh:'我有 8 个顶点和 12 条棱。我所有的面都一样。我是什么立体图形？'},
  {id:'r13', mod:2, lvl:1, set:O3, ans:'pyramide', no:'Jeg har 5 flater. 1 kvadrat og 4 trekanter. Hvilken figur er jeg?', zh:'我有 5 个面：1 个正方形和 4 个三角形。我是什么立体图形？'},
  {id:'r14', mod:2, lvl:3, set:O3, ans:'trekantprisme', no:'Jeg har 5 flater. 2 av dem er trekanter og 3 er rektangler. Hvilken figur er jeg?', zh:'我有 5 个面。2 个是三角形，3 个是长方形。我是什么立体图形？'},
  {id:'r15', mod:2, lvl:2, set:O3, ans:'pyramide', no:'Jeg har 5 hjørner og 8 kanter. Hvilken figur er jeg?', zh:'我有 5 个顶点和 8 条棱。我是什么立体图形？'},
  {id:'r16', mod:2, lvl:2, set:O3, ans:'sylinder', no:'Jeg har ingen hjørner, men jeg har to flate sirkler. Hvilken figur er jeg?', zh:'我没有顶点，但我有两个平的圆。我是什么立体图形？'}
];

/* påstander: t = stemmer? */
A.GEO_FACTS = [
  {id:'f1', mod:1, lvl:1, t:true, no:'En trekant har 3 hjørner.', zh:'三角形有 3 个顶点。', eNo:'En trekant har 3 hjørner og 3 kanter.', eZh:'三角形有 3 个顶点和 3 条边。'},
  {id:'f2', mod:1, lvl:1, t:false, no:'En firkant har 5 kanter.', zh:'四边形有 5 条边。', eNo:'En firkant har 4 kanter. En femkant har 5.', eZh:'四边形有 4 条边。五边形才有 5 条。'},
  {id:'f3', mod:1, lvl:1, t:true, no:'En sirkel har ingen hjørner.', zh:'圆没有顶点。', eNo:'En sirkel er rund og har ingen hjørner.', eZh:'圆是圆的，没有顶点。'},
  {id:'f4', mod:1, lvl:1, t:true, no:'Et kvadrat har 4 like lange kanter.', zh:'正方形的 4 条边一样长。', eNo:'Alle kantene i et kvadrat er like lange.', eZh:'正方形的每条边都一样长。'},
  {id:'f5', mod:1, lvl:2, t:false, no:'Et rektangel har alltid 4 like lange kanter.', zh:'长方形的 4 条边总是一样长。', eNo:'Et rektangel har kanter som er like lange to og to.', eZh:'长方形是对边一样长。'},
  {id:'f6', mod:1, lvl:1, t:true, no:'En femkant har 5 hjørner og 5 kanter.', zh:'五边形有 5 个顶点和 5 条边。', eNo:'En femkant har 5 hjørner og 5 kanter.', eZh:'五边形有 5 个顶点和 5 条边。'},
  {id:'f7', mod:1, lvl:1, t:true, no:'Et rektangel har 4 rette hjørner.', zh:'长方形有 4 个直角。', eNo:'Alle hjørnene i et rektangel er rette.', eZh:'长方形的 4 个角都是直角。'},
  {id:'f8', mod:1, lvl:1, t:false, no:'En trekant har 4 kanter.', zh:'三角形有 4 条边。', eNo:'En trekant har 3 kanter.', eZh:'三角形有 3 条边。'},
  {id:'f9', mod:1, lvl:2, t:false, no:'Et kvadrat har 3 rette hjørner.', zh:'正方形有 3 个直角。', eNo:'Et kvadrat har 4 rette hjørner.', eZh:'正方形有 4 个直角。'},
  {id:'f10', mod:1, lvl:1, t:true, no:'En kant er linjen mellom to hjørner.', zh:'边就是两个顶点之间的线。', eNo:'En kant går mellom to hjørner.', eZh:'边连接两个顶点。'},
  {id:'f11', mod:2, lvl:1, t:true, no:'En kube har 6 flater.', zh:'正方体有 6 个面。', eNo:'En kube har 6 flater, 12 kanter og 8 hjørner.', eZh:'正方体有 6 个面、12 条棱、8 个顶点。'},
  {id:'f12', mod:2, lvl:1, t:false, no:'En kule har mange hjørner.', zh:'球有很多顶点。', eNo:'En kule har ingen hjørner og ingen kanter.', eZh:'球没有顶点，也没有棱。'},
  {id:'f13', mod:2, lvl:2, t:true, no:'En pyramide kan ha 1 kvadrat og 4 trekanter som flater.', zh:'棱锥可以有 1 个正方形和 4 个三角形作为面。', eNo:'Pyramiden har 5 flater: 1 kvadrat og 4 trekanter.', eZh:'这个棱锥有 5 个面：1 个正方形和 4 个三角形。'},
  {id:'f14', mod:2, lvl:1, t:true, no:'En sylinder har to flate sirkler.', zh:'圆柱有两个平的圆。', eNo:'En sylinder har to sirkler og en rund side.', eZh:'圆柱有两个圆和一个弯曲的侧面。'},
  {id:'f15', mod:2, lvl:1, t:true, no:'En kube har 12 kanter.', zh:'正方体有 12 条棱。', eNo:'En kube har 12 kanter.', eZh:'正方体有 12 条棱。'},
  {id:'f16', mod:2, lvl:1, t:false, no:'En sirkel er tredimensjonal.', zh:'圆是三维的。', eNo:'En sirkel er flat, altså todimensjonal.', eZh:'圆是平的，也就是二维的。'},
  {id:'f17', mod:2, lvl:1, t:false, no:'En kube er todimensjonal.', zh:'正方体是二维的。', eNo:'En kube er tredimensjonal. Du kan holde den i hånden.', eZh:'正方体是三维的。你可以拿在手里。'},
  {id:'f18', mod:2, lvl:1, t:true, no:'Alle flatene på en kube er kvadrater.', zh:'正方体所有的面都是正方形。', eNo:'En kube har 6 kvadrater som flater.', eZh:'正方体有 6 个正方形的面。'},
  {id:'f19', mod:2, lvl:2, t:false, no:'En pyramide med kvadrat som bunn har 4 flater.', zh:'底面是正方形的棱锥有 4 个面。', eNo:'Den har 5 flater: bunnen og 4 trekanter.', eZh:'它有 5 个面：底面和 4 个三角形。'},
  {id:'f20', mod:2, lvl:2, t:true, no:'Et prisme (en eske) har 8 hjørner.', zh:'棱柱（盒子）有 8 个顶点。', eNo:'En eske har 8 hjørner, 12 kanter og 6 flater.', eZh:'盒子有 8 个顶点、12 条棱、6 个面。'},
  {id:'f21', mod:3, lvl:1, t:true, no:'Nettet til en kube har 6 kvadrater.', zh:'正方体的展开图有 6 个正方形。', eNo:'Kuben har 6 flater, så nettet har 6 kvadrater.', eZh:'正方体有 6 个面，所以展开图有 6 个正方形。'},
  {id:'f22', mod:3, lvl:1, t:true, no:'Et nett er en flat figur som kan brettes til en tredimensjonal figur.', zh:'展开图是平的，可以折成立体图形。', eNo:'Et nett er en utbrettet figur.', eZh:'展开图就是展开铺平的图形。'},
  {id:'f23', mod:3, lvl:2, t:false, no:'Nettet til en pyramide (kvadrat som bunn) har 5 kvadrater.', zh:'棱锥（底面是正方形）的展开图有 5 个正方形。', eNo:'Det har 1 kvadrat og 4 trekanter.', eZh:'它有 1 个正方形和 4 个三角形。'},
  {id:'f24', mod:4, lvl:1, t:true, no:'En rett vinkel er 90°.', zh:'直角是 90°。', eNo:'En rett vinkel er som hjørnet på et ark.', eZh:'直角就像纸的角。'},
  {id:'f25', mod:4, lvl:1, t:false, no:'En spiss vinkel er større enn en rett vinkel.', zh:'锐角比直角大。', eNo:'En spiss vinkel er mindre enn en rett vinkel.', eZh:'锐角比直角小。'},
  {id:'f26', mod:4, lvl:1, t:true, no:'En stump vinkel er større enn en rett vinkel.', zh:'钝角比直角大。', eNo:'En stump vinkel er større enn en rett vinkel.', eZh:'钝角比直角大。'},
  {id:'f27', mod:4, lvl:1, t:true, no:'Alle fire hjørnene i et rektangel er rette vinkler.', zh:'长方形的 4 个角都是直角。', eNo:'Et rektangel har 4 rette vinkler.', eZh:'长方形有 4 个直角。'},
  {id:'f28', mod:4, lvl:2, t:true, no:'En trekant kan ha en stump vinkel.', zh:'三角形可以有一个钝角。', eNo:'Ja, noen trekanter har en vid, stump vinkel.', eZh:'是的，有些三角形有一个很宽的钝角。'},
  {id:'f29', mod:4, lvl:3, t:false, no:'En trekant kan ha tre rette vinkler.', zh:'三角形可以有三个直角。', eNo:'En trekant har høyst én rett vinkel.', eZh:'三角形最多只有一个直角。'},
  {id:'f30', mod:5, lvl:3, t:true, no:'Et kvadrat er også en spesiell slags rektangel.', zh:'正方形也是一种特殊的长方形。', eNo:'Et kvadrat har 4 rette hjørner, så det er et rektangel med like lange kanter.', eZh:'正方形有 4 个直角，所以它是边都一样长的长方形。'}
];
})();
