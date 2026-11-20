(function(){
'use strict';
const A = window.App;

/* grunnform (en/ei) | et-form | flertall og bestemt form | kinesisk | pinyin | emoji | gruppe | nivå | regel | motsatt | komparativ | superlativ | en-ord | ei-ord | et-ord
   regel: t = +t (stor → stort) · tt = +tt (hvit → hvitt) · same = ingen endring i et-form (billig) · sp = spesiell */
const RAW = `
stor|stort|store|大的|dà de|🐘|størrelse|1|t|liten|større|størst|hund|bok|hus
liten|lite|små|小的|xiǎo de|🐭|størrelse|1|sp|stor|mindre|minst|fisk|jente|eple
rød|rødt|røde|红色的|hóngsè de|🔴|farge|1|t||||bil|lue|eple
blå|blått|blå|蓝色的|lánsè de|🔵|farge|1|tt||||bil|veske|vindu
gul|gult|gule|黄色的|huángsè de|🟡|farge|1|t||||banan|klokke|hus
grønn|grønt|grønne|绿色的|lǜsè de|🟢|farge|1|t||||stol|dør|tre
hvit|hvitt|hvite|白色的|báisè de|⚪|farge|1|tt||||katt|seng|egg
svart|svart|svarte|黑色的|hēisè de|⚫|farge|2|same||||hest|veske|tog
brun|brunt|brune|棕色的|zōngsè de|🟤|farge|2|t||||hest|bok|brød
grå|grått|grå|灰色的|huīsè de|🩶|farge|2|tt||||katt|mus|hus
ny|nytt|nye|新的|xīn de|🆕|egenskap|1|tt|gammel|nyere|nyest|bil|bok|hus
gammel|gammelt|gamle|旧的，老的|jiù de, lǎo de|👴|egenskap|1|sp|ny|eldre|eldst|mann|dør|hus
pen|pent|pene|漂亮的|piàoliang de|🌸|egenskap|1|t|stygg|penere|penest|blomst|jente|bilde
stygg|stygt|stygge|丑的|chǒu de|👹|egenskap|3|t|pen|styggere|styggest|hund|dør|bilde
varm|varmt|varme|热的，暖和的|rè de|🔥|egenskap|1|t|kald|varmere|varmest|dag|lue|hus
kald|kaldt|kalde|冷的|lěng de|🧊|egenskap|1|t|varm|kaldere|kaldest|dag|flaske|glass
rask|raskt|raske|快的|kuài de|🏃|egenskap|1|t|langsom|raskere|raskest|hest|jente|tog
langsom|langsomt|langsomme|慢的|màn de|🐢|egenskap|2|t|rask|langsommere|langsomst|fugl|ku|dyr
snill|snilt|snille|善良的|shànliáng de|😊|følelse|1|t|slem|snillere|snillest|gutt|jente|barn
trist|trist|triste|难过的|nánguò de|😢|følelse|2|same|glad|tristere|tristest|gutt|jente|barn
sint|sint|sinte|生气的|shēngqì de|😠|følelse|2|same||sintere|sintest|hund|ku|barn
sulten|sultent|sultne|饿的|è de|🍽️|følelse|2|sp|mett|sultnere|sultnest|hund|ku|barn
flink|flinkt|flinke|能干的，聪明的|nénggàn de|🌟|egenskap|2|t||flinkere|flinkest|gutt|jente|barn
lang|langt|lange|长的|cháng de|📏|størrelse|1|t|kort|lengre|lengst|dag|gate|tog
kort|kort|korte|短的|duǎn de|✂️|størrelse|2|same|lang|kortere|kortest|dag|uke|spill
høy|høyt|høye|高的|gāo de|🗼|størrelse|1|t|lav|høyere|høyest|mann|dame|fjell
tykk|tykt|tykke|厚的|hòu de|📚|størrelse|2|t|tynn|tykkere|tykkest|jakke|bok|brød
tynn|tynt|tynne|薄的，瘦的|báo de|📄|størrelse|2|t|tykk|tynnere|tynnest|katt|bok|brød
tung|tungt|tunge|重的|zhòng de|🏋️|egenskap|2|t|lett|tyngre|tyngst|stol|dør|telt
lett|lett|lette|轻的，容易的|qīng de|🪶|egenskap|2|same|tung|lettere|lettest|ball|veske|telt
god|godt|gode|好的，好吃的|hǎo de|👍|egenskap|1|t|dårlig|bedre|best|venn|kake|brød
dårlig|dårlig|dårlige|坏的，差的|huài de|👎|egenskap|2|same|god|verre|verst|dag|seng|spill
billig|billig|billige|便宜的|piányi de|🏷️|egenskap|2|same|dyr|billigere|billigst|sykkel|veske|telt
dyr|dyrt|dyre|贵的|guì de|💎|egenskap|2|t|billig|dyrere|dyrest|bil|klokke|hus
ung|ungt|unge|年轻的|niánqīng de|🧒|egenskap|2|t|gammel|yngre|yngst|lærer|dame|dyr
søt|søtt|søte|甜的，可爱的|tián de|🍬|egenskap|2|tt||søtere|søtest|katt|kake|eple
ren|rent|rene|干净的|gānjìng de|✨|egenskap|2|t|skitten|renere|renest|bil|seng|glass
tom|tomt|tomme|空的|kōng de|🫙|egenskap|3|t|full|||ballong|flaske|glass
mørk|mørkt|mørke|暗的，深色的|àn de|🌑|egenskap|2|t|lys|mørkere|mørkest|dag|gate|telt
lys|lyst|lyse|亮的，浅色的|liàng de|💡|egenskap|2|t|mørk|lysere|lysest|dag|lue|hus
åpen|åpent|åpne|开着的|kāizhe de|🚪|egenskap|3|sp|lukket|||butikk|dør|vindu
vakker|vakkert|vakre|美丽的|měilì de|🌈|egenskap|3|sp||vakrere|vakrest|park|øy|fjell
morsom|morsomt|morsomme|有趣的|yǒuqù de|😄|egenskap|3|t||morsommere|morsomst|lærer|bok|spill
fin|fint|fine|好看的，不错的|hǎokàn de|👌|egenskap|1|t||finere|finest|bil|gate|bilde
rund|rundt|runde|圆的|yuán de|🟠|størrelse|3|t||||ball|klokke|vindu
norsk|norsk|norske|挪威的|nuówēi de|🇳🇴|egenskap|3|same||||gutt|jente|hus
kinesisk|kinesisk|kinesiske|中国的|zhōngguó de|🇨🇳|egenskap|3|same||||venn|bok|barn
interessant|interessant|interessante|有意思的|yǒuyìsi de|🤔|egenskap|3|same||mer interessant|mest interessant|lærer|bok|spill
`.trim().split('\n').map(l => l.split('|').map(s => s.trim()));

A.ADJ = RAW.map((r, i) => ({
  i, m:r[0], n:r[1], pl:r[2], zh:r[3], py:r[4], emoji:r[5], cat:r[6], lvl:+r[7], rule:r[8], opp:r[9] || null, cmp:r[10] || null, sup:r[11] || null,
  nouns:[r[12], r[13], r[14]]
}));
A.adj = m => A.ADJ.find(a => a.m === m);
// alle godtatte motsetninger (gammel ↔ ny, men også gammel ↔ ung)
A.adjOpps = a => [a.opp].concat(A.ADJ.filter(x => x.opp === a.m && x.m !== a.opp).map(x => x.m)).concat(A.ADJ.filter(x => x.m !== a.m && x.opp && x.opp === a.opp).map(x => x.m)).filter(Boolean).filter((v, i, r) => r.indexOf(v) === i && v !== a.m);
A.ADJ_NOUN = (a, k) => A.WORDS.find(w => w.no === a.nouns[k]);   // k: 0 = en, 1 = ei, 2 = et
// ordforråd: ord som mangler i listen over, men brukes som motsetning
A.ADJ_EXTRA = {
  glad:{zh:'开心的', py:'kāixīn de'}, slem:{zh:'坏心的，不友善的', py:'huài xīn de'}, mett:{zh:'饱的', py:'bǎo de'}, lav:{zh:'矮的，低的', py:'ǎi de'},
  skitten:{zh:'脏的', py:'zāng de'}, full:{zh:'满的', py:'mǎn de'}, lukket:{zh:'关着的', py:'guānzhe de'}
};
A.adjZh = m => { const a = A.adj(m); return a ? a.zh : (A.ADJ_EXTRA[m] || {}).zh || ''; };

A.ADJ_CATS = {
  farge:{no:'farge', zh:'颜色', emoji:'🎨', color:'#ec4899'},
  størrelse:{no:'størrelse', zh:'大小、长短', emoji:'📏', color:'#0ea5e9'},
  følelse:{no:'følelse', zh:'心情、感受', emoji:'😊', color:'#f59e0b'},
  egenskap:{no:'egenskap', zh:'特点、性质', emoji:'⭐', color:'#16a34a'}
};
/* et-form-regler */
A.ADJ_RULES = {
  t:{no:'+ t', zh:'加 t', color:'#2563eb', exNo:'stor → stort · rød → rødt · grønn → grønt', exZh:'双写的辅音要缩成一个：grønn → grønt'},
  tt:{no:'+ tt', zh:'加 tt', color:'#9333ea', exNo:'hvit → hvitt · blå → blått · ny → nytt', exZh:'以元音或 t 结尾的短词，t 要双写'},
  same:{no:'ingen endring', zh:'不变', color:'#16a34a', exNo:'billig · norsk · trist · svart · lett', exZh:'以 -ig、-sk、-st 等结尾的词，中性形式不变'}
};

/* hverdagsord som ikke er adjektiv: [norsk, kinesisk, type] */
A.ADJ_NONADJ = [
  ['hund','狗','substantiv'],['bil','汽车','substantiv'],['hus','房子','substantiv'],['bok','书','substantiv'],['jente','女孩','substantiv'],['eple','苹果','substantiv'],
  ['løpe','跑','verb'],['spise','吃','verb'],['sove','睡觉','verb'],['lese','读','verb'],['synge','唱歌','verb'],['hoppe','跳','verb'],['tegne','画画','verb'],['svømme','游泳','verb'],
  ['og','和','annet'],['jeg','我','annet'],['du','你','annet'],['her','这里','annet'],['nå','现在','annet']
].map(r => ({no:r[0], zh:r[1], kind:r[2]}));

/* begreper */
A.ADJ_TERMS = [
  {key:'adjektiv', no:'adjektiv', zh:'形容词', py:'xíngróngcí', defNo:'Et ord som sier hvordan noe er.', defZh:'说明事物怎么样的词。', ex:'stor · rød · glad · ny', mod:0, color:'#22c55e'},
  {key:'substantiv', no:'substantiv', zh:'名词', py:'míngcí', defNo:'Et ord for en person, et dyr, en ting eller et sted.', defZh:'表示人、动物、东西或地方的词。', ex:'hund · bok · hus', mod:1, color:'#f97316'},
  {key:'verb', no:'verb', zh:'动词', py:'dòngcí', defNo:'Et ord for noe du gjør.', defZh:'表示做什么事的词。', ex:'løpe · spise · sove', mod:1, color:'#0ea5e9'},
  {key:'farge', no:'farge', zh:'颜色', py:'yánsè', defNo:'Adjektiv som sier hvilken farge noe har.', defZh:'说明东西是什么颜色的形容词。', ex:'rød · blå · gul · grønn', mod:1, color:'#ec4899'},
  {key:'størrelse', no:'størrelse', zh:'大小', py:'dàxiǎo', defNo:'Adjektiv som sier hvor stort, langt eller høyt noe er.', defZh:'说明东西有多大、多长、多高的形容词。', ex:'stor · liten · lang · høy', mod:1, color:'#0ea5e9'},
  {key:'følelse', no:'følelse', zh:'心情', py:'xīnqíng', defNo:'Adjektiv som sier hvordan en person eller et dyr har det.', defZh:'说明人或动物心情怎么样的形容词。', ex:'glad · trist · sint · sulten', mod:1, color:'#f59e0b'},
  {key:'motsetning', no:'motsetning', zh:'反义词', py:'fǎnyìcí', defNo:'Et ord som betyr det motsatte.', defZh:'意思相反的词。', ex:'stor ↔ liten · varm ↔ kald', mod:2, color:'#e11d48'},
  {key:'grunnform', no:'grunnform', zh:'基本形式', py:'jīběn xíngshì', defNo:'Adjektivet slik det står i ordlisten. Vi bruker det med en og ei.', defZh:'词典里的形式。和 en、ei 名词连用。', ex:'en stor hund · ei stor bok', mod:3, color:'#2563eb'},
  {key:'etform', no:'et-form', zh:'中性形式（et）', py:'zhōngxìng xíngshì', defNo:'Adjektivet foran et-ord. Oftest legger vi til -t.', defZh:'用在 et 名词前面的形式。通常加 -t。', ex:'et stort hus · et rødt eple', mod:3, color:'#16a34a'},
  {key:'flertallsform', no:'flertallsform', zh:'复数形式', py:'fùshù xíngshì', defNo:'Adjektivet foran flertall. Vi legger til -e.', defZh:'用在复数名词前面的形式。加 -e。', ex:'store hunder · røde epler', mod:4, color:'#9333ea'},
  {key:'dendetde', no:'den / det / de', zh:'den / det / de（定指冠词）', py:'dìngzhǐ guàncí', defNo:'Foran et adjektiv i bestemt form: den store hunden, det store huset, de store hundene.', defZh:'形容词定指形式前面的小词：den store hunden（那只大狗）、det store huset、de store hundene。', ex:'den store hunden · det store huset · de store hundene', mod:4, color:'#0d9488'},
  {key:'liten', no:'liten – lita – lite – små', zh:'liten 的特殊变化', py:'liten de biànhuà', defNo:'Liten er spesiell: en liten hund, ei lita jente, et lite hus, små hunder.', defZh:'liten 是特殊的：en liten hund、ei lita jente、et lite hus、små hunder。', ex:'liten · lita · lite · små', mod:5, color:'#f97316'},
  {key:'gradbøying', no:'gradbøying', zh:'比较级和最高级', py:'bǐjiàojí hé zuìgāojí', defNo:'Vi kan sammenligne: stor, større, størst.', defZh:'我们可以做比较：stor（大）、større（更大）、størst（最大）。', ex:'stor – større – størst', mod:6, color:'#0ea5e9'},
  {key:'komparativ', no:'komparativ', zh:'比较级', py:'bǐjiàojí', defNo:'Mer av noe, brukes med «enn». Vi legger til -ere.', defZh:'更……，常和 enn（比）连用。通常加 -ere。', ex:'større enn · raskere enn', mod:6, color:'#14b8a6'},
  {key:'superlativ', no:'superlativ', zh:'最高级', py:'zuìgāojí', defNo:'Mest av alt. Vi legger til -est.', defZh:'最……。通常加 -est。', ex:'størst · raskest · penest', mod:6, color:'#9333ea'},
  {key:'predikativ', no:'etter «er»', zh:'放在 er 后面', py:'fàng zài er hòumiàn', defNo:'Etter «er» retter adjektivet seg også: Huset er stort. Husene er store.', defZh:'放在 er 后面，形容词也要跟着变：Huset er stort。Husene er store。', ex:'Hunden er stor. Huset er stort. Husene er store.', mod:7, color:'#a16207'}
];
A.adjTerm = k => A.ADJ_TERMS.find(t => t.key === k);

/* setninger. {ord} = adjektiv */
A.ADJ_TEXTS = [
  {id:'e1', lvl:0, no:'Jeg har en {stor} hund. Den er {snill}.', zh:'我有一只大狗。它很善良。'},
  {id:'e2', lvl:0, no:'Eplet er {rødt} og {søtt}.', zh:'苹果又红又甜。'},
  {id:'e3', lvl:0, no:'Det er et {lite} hus. Det er {gammelt}.', zh:'这是一座小房子。它很旧。'},
  {id:'t1', lvl:1, no:'Mia har en {ny} sykkel. Den er {blå} og {rask}.', zh:'米娅有一辆新自行车。它是蓝色的，很快。'},
  {id:'t2', lvl:1, no:'I dag er det {kaldt}. Jeg tar på en {varm} jakke og en {rød} lue.', zh:'今天很冷。我穿上一件暖和的外套，戴一顶红帽子。'},
  {id:'t3', lvl:1, no:'Ola er {glad}. Han har en {fin} bok og en {god} venn.', zh:'奥拉很开心。他有一本好看的书和一个好朋友。'},
  {id:'t4', lvl:1, no:'Katten er {liten} og {svart}. Den sover på en {myk} stol.', zh:'猫又小又黑。它睡在一把软软的椅子上。'},
  {id:'t5', lvl:1, no:'Det {høye} fjellet er {hvitt}. Himmelen er {blå}.', zh:'那座高高的山是白色的。天空是蓝色的。'},
  {id:'t6', lvl:2, no:'Vi bor i et {stort} og {gammelt} hus. Det har {store} vinduer og en {grønn} dør.', zh:'我们住在一座又大又旧的房子里。它有大窗户和一扇绿色的门。'},
  {id:'t7', lvl:2, no:'Læreren er {snill} og {morsom}. Hun leser en {spennende} bok for de {små} barna.', zh:'老师善良又有趣。她给小朋友们读一本精彩的书。'},
  {id:'t8', lvl:2, no:'Sara har en {sulten} hund. Hunden får {god} mat og {kaldt} vann.', zh:'萨拉有一只饿了的狗。狗得到好吃的食物和冷水。'},
  {id:'t9', lvl:2, no:'Det er en {vakker} dag. Sola er {varm}, og parken er {full} av {glade} barn.', zh:'今天天气真美。阳光很温暖，公园里满是开心的孩子。'},
  {id:'t10', lvl:2, no:'Lars er {trøtt}. Han har hatt en {lang} og {kald} dag på {norsk} skole.', zh:'拉尔斯很累。他在挪威的学校度过了又长又冷的一天。'}
];

/* setninger til «bygg setningen». {ord} = adjektiv */
A.ADJ_SENTENCES = [
  {id:'s1', lvl:0, no:'Jeg har en {stor} hund.', zh:'我有一只大狗。'},
  {id:'s2', lvl:0, no:'Eplet er {rødt}.', zh:'苹果是红色的。'},
  {id:'s3', lvl:0, no:'Hun har ei {ny} bok.', zh:'她有一本新书。'},
  {id:'s4', lvl:0, no:'Huset er {lite}.', zh:'房子很小。'},
  {id:'s5', lvl:0, no:'Du er {snill}.', zh:'你很善良。'},
  {id:'s6', lvl:0, no:'Det er et {pent} bilde.', zh:'这是一幅漂亮的画。'},
  {id:'s7', lvl:1, no:'Jeg ser en {rask} hest.', zh:'我看见一匹快马。'},
  {id:'s8', lvl:1, no:'Vi bor i et {gammelt} hus.', zh:'我们住在一座旧房子里。'},
  {id:'s9', lvl:1, no:'Hun har ei {varm} lue.', zh:'她有一顶暖和的帽子。'},
  {id:'s10', lvl:1, no:'Katten er {liten} og {svart}.', zh:'猫又小又黑。'},
  {id:'s11', lvl:1, no:'De {store} hundene løper.', zh:'那些大狗在跑。'},
  {id:'s12', lvl:1, no:'Barna er {glade}.', zh:'孩子们很开心。'},
  {id:'s13', lvl:1, no:'Den {røde} bilen er {rask}.', zh:'那辆红色的车很快。'},
  {id:'s14', lvl:1, no:'Det {gule} huset er {stort}.', zh:'那座黄色的房子很大。'},
  {id:'s15', lvl:2, no:'Elefanten er {større} enn musa.', zh:'大象比老鼠大。'},
  {id:'s16', lvl:2, no:'Bilen er {raskere} enn sykkelen.', zh:'汽车比自行车快。'},
  {id:'s17', lvl:2, no:'Fjellet er {høyest}.', zh:'这座山最高。'},
  {id:'s18', lvl:2, no:'Den {lille} jenta har en {ny} jakke.', zh:'那个小女孩有一件新外套。'}
];
})();
