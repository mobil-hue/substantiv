(function(){
'use strict';
const A = window.App;

/* art | ubestemt entall | bestemt entall | ubestemt flertall | bestemt flertall | kinesisk | pinyin | emoji | gruppe | nivå */
const RAW = `
en|hund|hunden|hunder|hundene|狗|gǒu|🐶|dyr|1
en|katt|katten|katter|kattene|猫|māo|🐱|dyr|1
en|fisk|fisken|fisker|fiskene|鱼|yú|🐟|dyr|1
en|fugl|fuglen|fugler|fuglene|鸟|niǎo|🐦|dyr|1
en|hest|hesten|hester|hestene|马|mǎ|🐴|dyr|1
en|bil|bilen|biler|bilene|汽车|qìchē|🚗|ting|1
en|stol|stolen|stoler|stolene|椅子|yǐzi|🪑|ting|1
en|ball|ballen|baller|ballene|球|qiú|⚽|ting|1
en|sko|skoen|sko|skoene|鞋子|xiézi|👟|ting|3
en|banan|bananen|bananer|bananene|香蕉|xiāngjiāo|🍌|ting|1
en|sykkel|sykkelen|sykler|syklene|自行车|zìxíngchē|🚲|ting|2
en|jakke|jakken|jakker|jakkene|外套|wàitào|🧥|ting|1
en|gutt|gutten|gutter|guttene|男孩|nánhái|👦|person|1
en|lærer|læreren|lærere|lærerne|老师|lǎoshī|👨‍🏫|person|2
en|venn|vennen|venner|vennene|朋友|péngyou|👫|person|1
en|mann|mannen|menn|mennene|男人|nánrén|👨|person|3
en|skole|skolen|skoler|skolene|学校|xuéxiào|🏫|sted|1
en|by|byen|byer|byene|城市|chéngshì|🏙️|sted|2
en|butikk|butikken|butikker|butikkene|商店|shāngdiàn|🏪|sted|1
en|park|parken|parker|parkene|公园|gōngyuán|🏞️|sted|1
en|strand|stranden|strender|strendene|海滩|hǎitān|🏖️|sted|3
en|appelsin|appelsinen|appelsiner|appelsinene|橙子|chéngzi|🍊|ting|1
en|dag|dagen|dager|dagene|天|tiān|📆|ting|2
en|pizza|pizzaen|pizzaer|pizzaene|披萨|pīsà|🍕|ting|1
en|ballong|ballongen|ballonger|ballongene|气球|qìqiú|🎈|ting|1
en|telefon|telefonen|telefoner|telefonene|电话|diànhuà|📱|ting|1
en|bamse|bamsen|bamser|bamsene|玩具熊|wánjùxióng|🧸|ting|1
en|fot|foten|føtter|føttene|脚|jiǎo|🦶|ting|3
en|blomst|blomsten|blomster|blomstene|花|huā|🌸|ting|2
ei|jente|jenta|jenter|jentene|女孩|nǚhái|👧|person|1
ei|dame|dama|damer|damene|女士|nǚshì|👩|person|2
ei|bok|boka|bøker|bøkene|书|shū|📖|ting|3
ei|dør|døra|dører|dørene|门|mén|🚪|ting|2
ei|klokke|klokka|klokker|klokkene|钟|zhōng|🕐|ting|1
ei|seng|senga|senger|sengene|床|chuáng|🛏️|ting|1
ei|lue|lua|luer|luene|帽子|màozi|🧢|ting|2
ei|veske|veska|vesker|veskene|包|bāo|👜|ting|1
ei|kake|kaka|kaker|kakene|蛋糕|dàngāo|🍰|ting|1
ei|mus|musa|mus|musene|老鼠|lǎoshǔ|🐭|dyr|3
ei|ku|kua|kyr|kyrne|奶牛|nǎiniú|🐄|dyr|3
ei|gate|gata|gater|gatene|街道|jiēdào|🛣️|sted|1
ei|flaske|flaska|flasker|flaskene|瓶子|píngzi|🍼|ting|1
ei|hånd|hånda|hender|hendene|手|shǒu|✋|ting|3
ei|uke|uka|uker|ukene|星期|xīngqī|📅|ting|2
ei|øy|øya|øyer|øyene|岛|dǎo|🏝️|sted|3
ei|bølge|bølga|bølger|bølgene|波浪|bōlàng|🌊|ting|2
et|barn|barnet|barn|barna|孩子|háizi|🧒|person|3
et|egg|egget|egg|eggene|蛋|dàn|🥚|ting|2
et|tre|treet|trær|trærne|树|shù|🌳|ting|3
et|fly|flyet|fly|flyene|飞机|fēijī|✈️|ting|2
et|tog|toget|tog|togene|火车|huǒchē|🚆|ting|2
et|brød|brødet|brød|brødene|面包|miànbāo|🍞|ting|2
et|glass|glasset|glass|glassene|杯子|bēizi|🥛|ting|2
et|vindu|vinduet|vinduer|vinduene|窗户|chuānghu|🪟|ting|2
et|bilde|bildet|bilder|bildene|图片|túpiàn|🖼️|ting|1
et|hjerte|hjertet|hjerter|hjertene|心|xīn|❤️|ting|1
et|fjell|fjellet|fjell|fjellene|山|shān|⛰️|sted|2
et|land|landet|land|landene|国家|guójiā|🌍|sted|2
et|sykehus|sykehuset|sykehus|sykehusene|医院|yīyuàn|🏥|sted|2
et|dyr|dyret|dyr|dyrene|动物|dòngwù|🐾|dyr|2
et|spill|spillet|spill|spillene|游戏|yóuxì|🎮|ting|2
et|telt|teltet|telt|teltene|帐篷|zhàngpeng|⛺|ting|2
et|øre|øret|ører|ørene|耳朵|ěrduo|👂|ting|2
et|øye|øyet|øyne|øynene|眼睛|yǎnjing|👁️|ting|3
et|hus|huset|hus|husene|房子|fángzi|🏠|sted|2
et|eple|eplet|epler|eplene|苹果|píngguǒ|🍎|ting|1
`.trim().split('\n').map(l => l.split('|'));

A.WORDS = RAW.map((r, i) => ({
  i, art:r[0], no:r[1], be:r[2], uf:r[3], bf:r[4], zh:r[5], py:r[6], emoji:r[7], cat:r[8], lvl:+r[9]
}));
A.ue_uf_same = w => w.no === w.uf;

A.FORMS = [
  {key:'ue', no:'ubestemt entall',  zh:'不定单数', py:'bùdìng dānshù',  color:'#f97316', tagNo:'én', tagZh:'一个'},
  {key:'be', no:'bestemt entall',   zh:'定指单数', py:'dìngzhǐ dānshù', color:'#0d9488', tagNo:'den ene', tagZh:'那一个'},
  {key:'uf', no:'ubestemt flertall',zh:'不定复数', py:'bùdìng fùshù',   color:'#9333ea', tagNo:'mange', tagZh:'很多个'},
  {key:'bf', no:'bestemt flertall', zh:'定指复数', py:'dìngzhǐ fùshù',  color:'#a16207', tagNo:'alle disse', tagZh:'那些'}
];
A.formMeta = k => A.FORMS.find(f => f.key === k);
A.formOf = (w, k) => k === 'ue' ? w.no : w[k];
A.label = (w, k) => k === 'ue' ? `${w.art} ${w.no}` : w[k];
A.CATS = {
  person:{no:'person', zh:'人',   emoji:'🧑', color:'#2563eb', art:'en'},
  dyr:   {no:'dyr',    zh:'动物', emoji:'🐾', color:'#16a34a', art:'et'},
  ting:  {no:'ting',   zh:'东西', emoji:'📦', color:'#d97706', art:'en'},
  sted:  {no:'sted',   zh:'地方', emoji:'📍', color:'#9333ea', art:'et'}
};
A.GEN = {
  en:{color:'#2563eb', no:'en-ord', zh:'en 名词'},
  ei:{color:'#db2777', no:'ei-ord', zh:'ei 名词'},
  et:{color:'#16a34a', no:'et-ord', zh:'et 名词'}
};

/* ikke-substantiv: [norsk, kinesisk, type] */
A.NONNOUNS = [
  ['løpe','跑','verb'],['spise','吃','verb'],['sove','睡觉','verb'],['hoppe','跳','verb'],['le','笑','verb'],
  ['lese','读','verb'],['synge','唱歌','verb'],['danse','跳舞','verb'],['leke','玩','verb'],['tegne','画画','verb'],
  ['svømme','游泳','verb'],['gå','走','verb'],
  ['stor','大的','adj'],['liten','小的','adj'],['rød','红色的','adj'],['glad','开心的','adj'],['rask','快的','adj'],
  ['kald','冷的','adj'],['snill','善良的','adj'],['ny','新的','adj'],['varm','热的','adj'],['pen','漂亮的','adj'],['gul','黄色的','adj'],
  ['og','和','annet'],['jeg','我','annet'],['du','你','annet'],['nå','现在','annet'],['her','这里','annet']
].map(r => ({no:r[0], zh:r[1], kind:r[2]}));
A.KIND = {
  verb:{no:'et verb', zh:'动词', descNo:'Det er noe du gjør.', descZh:'它表示你做的事。'},
  adj: {no:'et adjektiv', zh:'形容词', descNo:'Det sier hvordan noe er.', descZh:'它说明事物怎么样。'},
  annet:{no:'ikke et substantiv', zh:'不是名词', descNo:'Det er ikke et navn på en person, et dyr, en ting eller et sted.', descZh:'它不是人、动物、东西或地方的名字。'}
};

/* egennavn og skrivemåte (stor/liten bokstav) */
A.NAMES = [
  {no:'Ola', zh:'奥拉（男孩的名字）', type:'person'},
  {no:'Mia', zh:'米娅（女孩的名字）', type:'person'},
  {no:'Lars', zh:'拉尔斯（男孩的名字）', type:'person'},
  {no:'Sara', zh:'萨拉（女孩的名字）', type:'person'},
  {no:'Kari', zh:'卡里（女孩的名字）', type:'person'},
  {no:'Pelle', zh:'佩勒（狗的名字）', type:'dyr'},
  {no:'Norge', zh:'挪威', type:'sted'},
  {no:'Kina', zh:'中国', type:'sted'},
  {no:'Oslo', zh:'奥斯陆', type:'sted'},
  {no:'Bergen', zh:'卑尔根', type:'sted'}
];
/* skrives med liten bokstav (felle!) */
A.LOWER = [
  {no:'mandag', zh:'星期一'}, {no:'fredag', zh:'星期五'}, {no:'søndag', zh:'星期日'},
  {no:'januar', zh:'一月'}, {no:'juni', zh:'六月'}, {no:'desember', zh:'十二月'},
  {no:'norsk', zh:'挪威语'}, {no:'kinesisk', zh:'中文'}
];

/* begreper. mod = første modul der begrepet læres */
A.TERMS = [
  {key:'substantiv', no:'substantiv', zh:'名词', py:'míngcí', defNo:'Et ord for en person, et dyr, en ting eller et sted.', defZh:'表示人、动物、东西或地方的词。', ex:'hund · jente · bil · skole', mod:0, color:'#f97316'},
  {key:'verb', no:'verb', zh:'动词', py:'dòngcí', defNo:'Et ord for noe du gjør.', defZh:'表示做什么事的词。', ex:'løpe · spise · sove', mod:0, color:'#0ea5e9'},
  {key:'adjektiv', no:'adjektiv', zh:'形容词', py:'xíngróngcí', defNo:'Et ord som sier hvordan noe er.', defZh:'说明事物怎么样的词。', ex:'stor · rød · glad', mod:0, color:'#22c55e'},
  {key:'egennavn', no:'egennavn', zh:'专有名词', py:'zhuānyǒu míngcí', defNo:'Navn på en bestemt person, et dyr eller et sted. Det skrives med stor bokstav.', defZh:'某个特定的人、动物或地方的名字，要用大写字母开头。', ex:'Ola · Mia · Norge · Oslo', mod:1, color:'#e11d48'},
  {key:'stor', no:'stor bokstav', zh:'大写字母', py:'dàxiě zìmǔ', defNo:'A, B, C … Vi bruker stor bokstav i egennavn og først i setningen.', defZh:'A、B、C……专有名词和句子开头要用大写字母。', ex:'Norge · Oslo · Jeg', mod:1, color:'#e11d48'},
  {key:'liten', no:'liten bokstav', zh:'小写字母', py:'xiǎoxiě zìmǔ', defNo:'a, b, c … Vanlige substantiv skrives med liten bokstav.', defZh:'a、b、c……普通名词用小写字母。', ex:'hund · skole · mandag', mod:1, color:'#e11d48'},
  {key:'artikkel', no:'artikkel', zh:'冠词', py:'guàncí', defNo:'Det lille ordet foran substantivet: en, ei eller et.', defZh:'名词前面的小词：en、ei 或 et。', ex:'en hund · ei jente · et hus', mod:2, color:'#8b5cf6'},
  {key:'en-ord', no:'en-ord', zh:'en 名词', py:'en míngcí', defNo:'Substantiv som bruker «en». Fargen er blå.', defZh:'用 en 的名词，颜色是蓝色。', ex:'en hund · en bil', mod:2, color:'#2563eb'},
  {key:'ei-ord', no:'ei-ord', zh:'ei 名词', py:'ei míngcí', defNo:'Substantiv som bruker «ei». Fargen er rosa.', defZh:'用 ei 的名词，颜色是粉色。', ex:'ei jente · ei bok', mod:2, color:'#db2777'},
  {key:'et-ord', no:'et-ord', zh:'et 名词', py:'et míngcí', defNo:'Substantiv som bruker «et». Fargen er grønn.', defZh:'用 et 的名词，颜色是绿色。', ex:'et hus · et eple', mod:2, color:'#16a34a'},
  {key:'entall', no:'entall', zh:'单数', py:'dānshù', defNo:'Bare én ting.', defZh:'只有一个。', ex:'en bil', mod:3, color:'#f97316'},
  {key:'flertall', no:'flertall', zh:'复数', py:'fùshù', defNo:'Mange ting.', defZh:'很多个。', ex:'biler', mod:3, color:'#9333ea'},
  {key:'ubestemt', no:'ubestemt', zh:'不定（不特指）', py:'bùdìng', defNo:'Vi vet ikke hvilken. En hvilken som helst.', defZh:'不知道是哪一个，随便哪一个。', ex:'en bil · biler', mod:4, color:'#f97316'},
  {key:'bestemt', no:'bestemt', zh:'定指（特指）', py:'dìngzhǐ', defNo:'Vi vet hvilken. Den vi snakker om.', defZh:'知道是哪一个，就是我们在说的那一个。', ex:'bilen · bilene', mod:4, color:'#0d9488'},
  {key:'ue', no:'ubestemt entall', zh:'不定单数', py:'bùdìng dānshù', defNo:'Én, vi vet ikke hvilken: en bil.', defZh:'一个，不知道是哪一个：en bil。', ex:'en bil', mod:5, color:'#f97316'},
  {key:'be', no:'bestemt entall', zh:'定指单数', py:'dìngzhǐ dānshù', defNo:'Den ene vi vet om: bilen.', defZh:'我们知道的那一个：bilen。', ex:'bilen', mod:5, color:'#0d9488'},
  {key:'uf', no:'ubestemt flertall', zh:'不定复数', py:'bùdìng fùshù', defNo:'Mange, vi vet ikke hvilke: biler.', defZh:'很多个，不知道是哪些：biler。', ex:'biler', mod:5, color:'#9333ea'},
  {key:'bf', no:'bestemt flertall', zh:'定指复数', py:'dìngzhǐ fùshù', defNo:'Alle de vi vet om: bilene.', defZh:'我们知道的那些：bilene。', ex:'bilene', mod:5, color:'#a16207'}
];
A.term = k => A.TERMS.find(t => t.key === k);

/* tekster til «finn substantivene». {ord} = substantiv. lvl 0: bare ubestemt form */
A.TEXTS = [
  {id:'e1', lvl:0, no:'Jeg ser en {hund}, en {katt} og en {fugl}.', zh:'我看见一只狗、一只猫和一只鸟。'},
  {id:'e2', lvl:0, no:'Jeg har en {ball}, ei {bok} og et {eple}.', zh:'我有一个球、一本书和一个苹果。'},
  {id:'e3', lvl:0, no:'Jeg går til en {skole}. Der er en {lærer} og mange {barn}.', zh:'我去一所学校。那里有一位老师和很多孩子。'},
  {id:'t1', lvl:1, no:'Jeg har en {hund}. {Hunden} er stor. Den leker med en {ball}.', zh:'我有一只狗。这只狗很大。它在玩一个球。'},
  {id:'t2', lvl:1, no:'Det er en {katt} på {stolen}. {Katten} sover. Den er glad.', zh:'椅子上有一只猫。猫在睡觉。它很开心。'},
  {id:'t3', lvl:1, no:'I {parken} er det mange {barn}. {Mia} leker med {ballene}. Jeg ser en {fugl}.', zh:'公园里有很多孩子。米娅在玩球。我看见一只鸟。'},
  {id:'t4', lvl:1, no:'Vi spiser et {eple} og en {banan}. {Eplet} er rødt. {Bananen} er gul.', zh:'我们吃一个苹果和一根香蕉。苹果是红色的。香蕉是黄色的。'},
  {id:'t5', lvl:1, no:'{Læreren} står ved {døra}. Hun har en {bok}. {Elevene} sitter på {stolene}.', zh:'老师站在门边。她有一本书。学生们坐在椅子上。'},
  {id:'t6', lvl:2, no:'På {stranden} i {Norge} er det {sol}. En {gutt} bygger et {slott}. En {jente} bader.', zh:'在挪威的海滩上有阳光。一个男孩在堆一座城堡。一个女孩在游泳。'},
  {id:'t7', lvl:2, no:'{Ola} går til {butikken}. Han kjøper {brød} og en {flaske} {melk}. Så går han hjem.', zh:'奥拉去商店。他买面包和一瓶牛奶。然后他回家。'},
  {id:'t8', lvl:2, no:'{Toget} kjører til {byen}. Mange {barn} sitter på {toget}. De ser {fjell} og {trær} ute av {vinduet}.', zh:'火车开往城市。很多孩子坐在火车上。他们从窗户看到山和树。'},
  {id:'t9', lvl:2, no:'I {klassen} er det tjue {elever}. {Jenta} har en rød {jakke}. {Gutten} har en blå {lue}.', zh:'班里有二十个学生。那个女孩有一件红外套。那个男孩有一顶蓝帽子。'},
  {id:'t10', lvl:2, no:'Jeg har en {venn}. {Vennen} min heter {Ola}. Han bor i et stort {hus}. Vi spiller {spill} og spiser {kake}.', zh:'我有一个朋友。我的朋友叫奥拉。他住在一座大房子里。我们玩游戏，吃蛋糕。'}
];

/* tekster der egennavn er skrevet med liten bokstav. {ord} = må ha stor bokstav */
A.CAPS_TEXTS = [
  {id:'c1', lvl:1, no:'Jeg heter {mia}. Jeg bor i {oslo}.', zh:'我叫米娅。我住在奥斯陆。'},
  {id:'c2', lvl:1, no:'{ola} er fra {norge}. Han er ni år.', zh:'奥拉来自挪威。他九岁。'},
  {id:'c3', lvl:1, no:'{sara} har en hund. Hunden heter {pelle}.', zh:'萨拉有一只狗。狗叫佩勒。'},
  {id:'c4', lvl:1, no:'Min venn {lars} kommer fra {bergen}. Vi går på skole sammen.', zh:'我的朋友拉尔斯来自卑尔根。我们一起上学。'},
  {id:'c5', lvl:1, no:'{kari} reiser til {kina}. Hun besøker familien.', zh:'卡里去中国。她去看望家人。', note:true},
  {id:'c6', lvl:2, no:'I dag er det mandag. {mia} har norsk på skolen.', zh:'今天是星期一。米娅在学校上挪威语课。', note:true},
  {id:'c7', lvl:2, no:'Vi bor i {norge}. Vi snakker norsk og kinesisk. {ola} snakker norsk.', zh:'我们住在挪威。我们说挪威语和中文。奥拉说挪威语。', note:true},
  {id:'c8', lvl:2, no:'I juni reiser {sara} og {lars} til {bergen}.', zh:'六月，萨拉和拉尔斯去卑尔根。', note:true}
];

/* setninger. {ord} = substantiv */
A.SENTENCES = [
  {id:'s1', lvl:0, no:'Jeg har en {hund}.', zh:'我有一只狗。'},
  {id:'s2', lvl:0, no:'Jeg ser en {fugl}.', zh:'我看见一只鸟。'},
  {id:'s3', lvl:0, no:'Hun har ei {bok}.', zh:'她有一本书。'},
  {id:'s4', lvl:0, no:'Vi spiser et {eple}.', zh:'我们吃一个苹果。'},
  {id:'s5', lvl:0, no:'Du har en rød {ball}.', zh:'你有一个红球。'},
  {id:'s6', lvl:0, no:'Han kjøper en {banan}.', zh:'他买一根香蕉。'},
  {id:'s7', lvl:0, no:'Jeg ser et {fly}.', zh:'我看见一架飞机。'},
  {id:'s8', lvl:0, no:'Hun har en {venn}.', zh:'她有一个朋友。'},
  {id:'s9', lvl:1, no:'{Katten} sover på {stolen}.', zh:'猫在椅子上睡觉。'},
  {id:'s10', lvl:1, no:'{Barna} leker i {parken}.', zh:'孩子们在公园里玩。'},
  {id:'s11', lvl:1, no:'{Jenta} leser ei {bok}.', zh:'女孩在读一本书。'},
  {id:'s12', lvl:1, no:'{Gutten} sparker {ballen}.', zh:'男孩踢球。'},
  {id:'s13', lvl:1, no:'{Læreren} åpner {døra}.', zh:'老师打开门。'},
  {id:'s14', lvl:1, no:'{Fuglene} synger i {treet}.', zh:'鸟儿们在树上唱歌。'},
  {id:'s15', lvl:1, no:'{Bilene} står i {gata}.', zh:'汽车们停在街上。'},
  {id:'s16', lvl:1, no:'{Hestene} løper ute.', zh:'马儿们在外面跑。'},
  {id:'s17', lvl:1, no:'{Mia} leser ei {bok}.', zh:'米娅在读一本书。'},
  {id:'s18', lvl:1, no:'{Ola} bor i {Oslo}.', zh:'奥拉住在奥斯陆。'},
  {id:'s19', lvl:1, no:'{Sara} har en {katt}.', zh:'萨拉有一只猫。'},
  {id:'s20', lvl:1, no:'{Lars} spiser et {eple}.', zh:'拉尔斯吃一个苹果。'}
];

/* parser: "Jeg har en {hund}." -> tokens */
A.parseMarked = function(str){
  const re = /\{([^}]+)\}|(\p{L}+)|([^\s\p{L}{}]+)|(\s+)/gu;
  const out = []; let m;
  while((m = re.exec(str))){
    if(m[1] != null) out.push({t:m[1], mark:true, word:true});
    else if(m[2] != null) out.push({t:m[2], mark:false, word:true});
    else if(m[3] != null) out.push({t:m[3], word:false});
    else out.push({t:' ', word:false, sp:true});
  }
  return out;
};
A.plain = str => str.replace(/[{}]/g, '');
})();
