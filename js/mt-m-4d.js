(function(){
'use strict';
/* Moduler 4. trinn: egenskaper ved figurer (kanter, hjørner, flater og vinkler) og måling av volum (KM13261, KM13264) */
const MT = window.MT, G = MT.G, Q = MT.Q, S = MT.S;
const {int, pick, shuf} = MT, {sc, title} = S;
const uniq = a => a.filter((x, i, arr) => arr.indexOf(x) === i);
const E = (t, c) => G.eq(t, c);
const card = (t, c) => `<div class="mtcard" style="--c:${c || '#2563eb'};padding:10px 16px;font-size:1.2rem">${t}</div>`;

/* ======================================================================
   Kanter, hjørner og flater (KM13261)
   ====================================================================== */
const SOL = {
  cube:{n:'terning', f:6, k:12, h:8}, box:{n:'eske (rett prisme)', f:6, k:12, h:8}, pyramid:{n:'firkantpyramide', f:5, k:8, h:5},
  cylinder:{n:'sylinder'}, cone:{n:'kjegle'}, sphere:{n:'kule'}
};
const POLY = {triangle:['trekant', 3], square:['kvadrat', 4], rectangle:['rektangel', 4], rhombus:['ruter', 4], pentagon:['femkant', 5], hexagon:['sekskant', 6], octagon:['åttekant', 8]};
const solTbl = (hide, kinds) => G.tbl([['Figur', 'Flater', 'Kanter', 'Hjørner']].concat((kinds || ['cube', 'pyramid']).map(k => [SOL[k].n.replace(' (rett prisme)', ''), SOL[k].f, SOL[k].k, SOL[k].h].map((v, j) => hide && hide[0] === k && hide[1] === j - 1 ? '?' : v))), {head:true});
MT.module({
  id:'kanter-hjorner-flater', rek:162, trinn:[4], maal:['KM13261'], tittel:'Kanter, hjørner og flater', ikon:'🧊', bygger:['romfigurer', 'figurer-2d'],
  video:[
   {html:title('🧊', 'Kanter, hjørner og flater', S.sub('Egenskaper ved figurer', 1.2)),
    no:'I dag skal vi beskrive og utforske figurer ved hjelp av kanter, hjørner og flater. Vi ser på både flate figurer og romfigurer.'},
   {html:sc(S.row(S.pop(G.solid('cube', {s:150}), .2)), S.row(S.pop(E('flate', '#60a5fa'), 1.2), S.pop(E('kant', '#f97316'), 1.9), S.pop(E('hjørne', '#dc2626'), 2.6)), S.sub('Terningen har 6 flater, 12 kanter og 8 hjørner', 3.4)),
    no:'Se på terningen. En flate er en av sidene. En kant er der to flater møtes. Et hjørne er der flere kanter møtes. Terningen har seks flater, tolv kanter og åtte hjørner.'},
   {html:sc(S.row(S.pop(G.solid('pyramid', {s:150}), .2)), S.sub('Firkantpyramiden: 5 flater, 8 kanter, 5 hjørner', 1.4), S.row(S.pop(solTbl(null, ['cube', 'pyramid']), 2.4))),
    no:'Pyramiden har en firkantet bunn og fire trekantede flater. Den har fem flater, åtte kanter og fem hjørner. Vi kan ordne tallene i en tabell.'},
   {html:sc(S.row(S.pop(G.solid('cylinder', {s:120}), .2), S.pop(G.solid('cone', {s:120}), .9), S.pop(G.solid('sphere', {s:120}), 1.6)), S.sub('Noen figurer har buede flater – de kan rulle', 2.6)),
    no:'Noen romfigurer har buede flater. Sylinderen har to flate sirkler og en buet flate. Kjeglen har en flat sirkel og en spiss. Kulen har bare en buet flate og ingen kanter eller hjørner. Figurer med buede flater kan rulle.'},
   {html:sc(S.row(S.pop(G.poly('triangle', {corners:true, s:110}), .2), S.pop(G.poly('square', {corners:true, s:110}), .8), S.pop(G.poly('pentagon', {corners:true, s:110}), 1.4), S.pop(G.poly('hexagon', {corners:true, s:110}), 2)), S.sub('Flate figurer: like mange sider som hjørner', 3)),
    no:'Flate figurer har sider og hjørner. En trekant har tre sider og tre hjørner. Et kvadrat har fire. En femkant har fem, og en sekskant har seks. Antall sider er alltid lik antall hjørner.'},
   {html:sc(S.row(S.pop(card('Jeg har 5 flater, 8 kanter og 5 hjørner. Hvem er jeg?', '#2563eb'), .2)), S.row(S.pop(G.solid('pyramid', {s:120}), 1.4)), S.sub('En firkantpyramide!', 2.2)),
    no:'Vi kan bruke egenskapene til å finne en figur. Fem flater, åtte kanter og fem hjørner, hvem er jeg? Det er en firkantpyramide.'},
   {html:sc(S.big('Flater, kanter og hjørner', .2), S.sub('Nå øver vi!', 1.4)),
    no:'Husk: flater er sidene, kanter er der flater møtes, og hjørner er der kanter møtes. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal beskrive og utforske egenskaper ved <b>to- og tredimensjonale figurer</b> ved å bruke <b>kanter, hjørner og flater</b>.',
   steg:['<b>Flate:</b> en av sidene på en romfigur. Den kan være flat eller buet.', '<b>Kant:</b> der to flater møtes.', '<b>Hjørne:</b> der flere kanter møtes.', 'Terning og eske: 6 flater, 12 kanter, 8 hjørner. Firkantpyramide: 5 flater, 8 kanter, 5 hjørner.', 'Sylinder, kjegle og kule har buede flater og kan rulle. Kula har ingen kanter og ingen hjørner.', 'Flate figurer har like mange sider som hjørner: trekant 3, firkant 4, femkant 5, sekskant 6.'],
   eks:[solTbl(null, ['cube', 'box', 'pyramid']), 'Trekant: 3 sider og 3 hjørner'],
   ord:[['flate', 'en side på en romfigur'], ['kant', 'der to flater møtes'], ['hjørne', 'der kantene møtes'], ['tredimensjonal figur', 'en figur med lengde, bredde og høyde']],
   feil:['«En terning har 6 hjørner» – den har 8 hjørner og 6 flater.', '«En kule har 1 hjørne» – en kule har ingen hjørner og ingen kanter.'],
   laerer:'KM13261 (første del): egenskaper ved to- og tredimensjonale figurer. Modulen «Vinkler» tar for seg vinkler. Bruk gjerne konkrete modeller (esker, bokser, bygd av ispinner og plastelina) slik at elevene teller selv. Eulers formel (hjørner − kanter + flater = 2) er ikke et mål i 4. trinn, men kan være en spennende utforskning for de som vil.'
  },
  refleksjon:'Finn en gjenstand hjemme som er en rett eske. Tell flater, kanter og hjørner. Hva finner du?',
  nivaaer:[
   {t:'Forstå: flate, kant og hjørne', d:'Sjekk at du har forstått.', kind:'forstaa', make:(r, i) => {
     const k = i % 6;
     if(k === 0) return Q.choice(r, 'Hva kalles stedet der flere kanter møtes på en romfigur?', 'Et hjørne', ['En flate', 'En kant', 'En side av tallinjen'], {keep:true, expl:'Der kantene møtes er et hjørne.'});
     if(k === 1) return Q.choice(r, 'Hva kalles stedet der to flater møtes?', 'En kant', ['Et hjørne', 'En flate', 'En vinkel'], {keep:true, expl:'To flater møtes i en kant.'});
     if(k === 2) return Q.yn('Kan en flate være buet?', true, {expl:'Ja. En sylinder har en buet flate.'});
     if(k === 3) return Q.yn('Har en kule hjørner?', false, {expl:'Nei. En kule har bare én buet flate, ingen kanter og ingen hjørner.'});
     if(k === 4) return Q.yn('Har en trekant like mange sider som hjørner?', true, {expl:'Ja. Trekanten har 3 sider og 3 hjørner.'});
     return Q.choice(r, 'Hva er en av sidene på en terning?', 'En flate', ['Et hjørne', 'En kant', 'En tallinje'], {keep:true, expl:'Sidene på en romfigur kalles flater.'});
   }},
   {t:'Flate figurer: sider og hjørner', d:'Tell sider og hjørner.', n:10, make:(r, i) => {
     const kind = pick(r, Object.keys(POLY)), [nm, n] = POLY[kind];
     if(i % 2 === 0) return Q.num(`${G.poly(kind, {corners:true, s:120})}<br>Hvor mange hjørner har figuren? {?}`, n, {say:'Hvor mange hjørner har figuren?', expl:`Figuren har ${n} hjørner.`});
     return Q.num(`${G.poly(kind, {corners:true, s:120})}<br>Hvor mange sider har figuren? {?}`, n, {say:'Hvor mange sider har figuren?', expl:`Figuren har ${n} sider. En flat figur har like mange sider som hjørner.`});
   }},
   {t:'Romfigurer: tell flater, kanter og hjørner', d:'Terning, eske og pyramide.', n:12, make:(r, i) => {
     const kind = pick(r, ['cube', 'box', 'pyramid']), s = SOL[kind], what = i % 3, nm = s.n;
     if(i % 4 === 3){ const pairs = kind === 'pyramid' ? [['kanter', 'hjørner', s.k - s.h], ['kanter', 'flater', s.k - s.f]] : [['kanter', 'hjørner', s.k - s.h], ['kanter', 'flater', s.k - s.f], ['hjørner', 'flater', s.h - s.f]], pr = pick(r, pairs);
       return Q.num(`${G.solid(kind, {s:150})}<br>Figuren er en ${nm}. Hvor mange flere ${pr[0]} enn ${pr[1]} har den? {?}`, pr[2], {say:`Figuren er en ${nm}. Hvor mange flere ${pr[0]} enn ${pr[1]} har den?`, expl:`En ${nm} har ${s.f} flater, ${s.k} kanter og ${s.h} hjørner. Forskjellen er ${pr[2]}.`}); }
     const lab = ['flater', 'kanter', 'hjørner'][what], v = [s.f, s.k, s.h][what];
     return Q.num(`${G.solid(kind, {s:150})}<br>Figuren er en ${nm}. Hvor mange ${lab} har den? {?}`, v, {say:`Figuren er en ${nm}. Hvor mange ${lab} har den?`, hint:kind === 'pyramid' ? 'Tenk på bunnen og sidene. Bunnen er en firkant.' : 'Tenk på toppen, bunnen og sidene.', expl:`En ${nm} har ${s.f} flater, ${s.k} kanter og ${s.h} hjørner.`});
   }},
   {t:'Tabell: fyll ut', d:'Les av og regn ut.', n:10, make:(r, i) => {
     const kinds = shuf(r, ['cube', 'pyramid', 'box']).slice(0, 2), k = pick(r, kinds), j = int(r, 0, 2), v = [SOL[k].f, SOL[k].k, SOL[k].h][j], lab = ['flater', 'kanter', 'hjørner'][j];
     return Q.num(`${solTbl([k, j], kinds)}<br>Hvilket tall mangler? (${SOL[k].n.replace(' (rett prisme)', '')}, ${lab}) {?}`, v, {say:`Hvilket tall mangler? ${SOL[k].n}, ${lab}`, expl:`En ${SOL[k].n} har ${v} ${lab}.`});
   }},
   {t:'Hvilken figur er jeg?', d:'Bruk egenskapene.', n:12, make:(r, i) => {
     const bank = [
       ['Jeg har 5 flater, 8 kanter og 5 hjørner.', 'firkantpyramide'], ['Jeg har 6 flater som alle er like store kvadrater.', 'terning'],
       ['Jeg har to flate sirkler og en buet flate.', 'sylinder'], ['Jeg har én flat sirkel og én spiss.', 'kjegle'],
       ['Jeg har bare én flate, ingen kanter og ingen hjørner.', 'kule'], ['Jeg har 12 kanter og 8 hjørner, men flatene er ikke alle kvadrater.', 'eske'],
       ['Jeg har fire trekantede flater og en firkantet bunn.', 'firkantpyramide'], ['Jeg kan rulle, og jeg har en spiss.', 'kjegle'],
       ['Jeg er rund overalt og kan rulle i alle retninger.', 'kule'], ['Jeg har tre flater: to flate og en buet.', 'sylinder'], ['Jeg har 8 hjørner, og alle kantene mine er like lange.', 'terning'], ['Jeg kommer til en spiss, og bunnen min er en firkant.', 'firkantpyramide']
     ], b = pick(r, bank), names = ['terning', 'firkantpyramide', 'sylinder', 'kjegle', 'kule', 'eske'];
     return Q.choice(r, `${b[0]}<br>Hvilken figur er jeg?`, b[1], names.filter(x => x !== b[1]).slice(0, 5).sort(() => r() - .5).slice(0, 3), {say:b[0] + ' Hvilken figur er jeg?', expl:`Det er en ${b[1]}.`});
   }},
   {t:'Egenskaper og sortering', d:'Hvilken figur passer?', n:10, make:(r, i) => {
     const bank = [
       ['har ingen hjørner', ['sylinder', 'kule'], ['terning', 'eske', 'firkantpyramide']], ['har akkurat ett hjørne', ['kjegle'], ['terning', 'firkantpyramide', 'eske']],
       ['kan rulle', ['kule', 'sylinder', 'kjegle'], ['terning', 'eske', 'firkantpyramide']], ['har bare flate flater', ['terning', 'eske', 'firkantpyramide'], ['kule', 'sylinder', 'kjegle']],
       ['har fire trekantede flater', ['firkantpyramide'], ['terning', 'eske', 'sylinder']], ['har 12 kanter', ['terning'], ['firkantpyramide', 'sylinder', 'kjegle']],
       ['har 5 hjørner', ['firkantpyramide'], ['terning', 'kjegle', 'kule']], ['har en spiss og en flat sirkel', ['kjegle'], ['sylinder', 'kule', 'terning']]
     ], b = pick(r, bank), ans = pick(r, b[1]);
     return Q.choice(r, `Hvilken figur ${b[0]}?`, ans, shuf(r, b[2]).slice(0, 3), {say:`Hvilken figur ${b[0]}?`, expl:`${ans.charAt(0).toUpperCase() + ans.slice(1)} ${b[0]}.`});
   }}
  ]
});

/* ======================================================================
   Vinkler (KM13261)
   ====================================================================== */
const ART = {rectangle:'et', square:'et', triangle:'en', rhombus:'en', pentagon:'en', hexagon:'en'};
const kindOf = d => d < 90 ? 'spiss' : d === 90 ? 'rett' : 'stump';
const CLOCKS = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11];
MT.module({
  id:'vinkler', rek:164, trinn:[4], maal:['KM13261'], tittel:'Vinkler: rett, spiss og stump', ikon:'📐', bygger:['figurer-2d', 'kanter-hjorner-flater', 'klokka-kvarter'],
  video:[
   {html:title('📐', 'Vinkler', S.sub('Rett, spiss og stump', 1.2)),
    no:'En vinkel dannes der to streker møtes i et hjørne. I dag lærer du å sammenligne vinkler og å kjenne igjen rett, spiss og stump vinkel.'},
   {html:sc(S.pop(G.angle(90, {c:'#16a34a', label:'rett'}), .2), S.sub('Rett vinkel: som hjørnet på et ark', 1.4)),
    no:'Rett vinkel er som hjørnet på et ark. Den er også som hjørnet på en bok eller på et bord. Vi markerer den med en liten firkant i hjørnet.'},
   {html:sc(S.pop(G.angle(50, {c:'#f97316', label:'spiss'}), .2), S.sub('Spiss vinkel: mindre enn en rett vinkel', 1.4)),
    no:'En spiss vinkel er mindre enn en rett vinkel. Den ser smal ut, som tuppen av en blyant.'},
   {html:sc(S.pop(G.angle(130, {c:'#9333ea', label:'stump'}), .2), S.sub('Stump vinkel: større enn en rett vinkel', 1.4)),
    no:'En stump vinkel er større enn en rett vinkel, men mindre enn en rett linje. Den ser åpen og bred ut.'},
   {html:sc(S.row(S.pop(G.poly('rectangle', {s:130}), .2), S.pop(G.poly('triangle', {s:130}), .9), S.pop(G.poly('hexagon', {s:130}), 1.6)), S.sub('Et rektangel har 4 rette vinkler. Trekanten og sekskanten har ingen.', 2.6)),
    no:'Et rektangel har fire rette vinkler. Trekanten her har ingen rette vinkler, og sekskanten heller ikke. Vinkler hjelper oss å beskrive figurer.'},
   {html:sc(S.row(S.pop(G.clock(3, 0, {s:150}), .2), S.pop(G.clock(4, 0, {s:150}), 1.2)), S.sub('Kl. 3: rett vinkel. Kl. 4: stump vinkel.', 2.4)),
    no:'Vi finner også vinkler på klokka. Klokka tre har viserne en rett vinkel mellom seg. Klokka fire er vinkelen stump, større enn rett.'},
   {html:sc(S.row(S.pop(card('Hvordan sjekker jeg om en vinkel er rett?', '#2563eb'), .2)), S.sub('Legg hjørnet på et ark mot vinkelen', 1.4)),
    no:'Hvordan kan vi sjekke om en vinkel er rett? Legg hjørnet på et ark mot vinkelen. Passer det, er vinkelen rett. Er vinkelen mindre, er den spiss. Er den større, er den stump.'},
   {html:sc(S.big('Rett – spiss – stump', .2), S.sub('Nå øver vi!', 1.4)),
    no:'Husk: rett som hjørnet på et ark, spiss er mindre, og stump er større. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal beskrive og utforske egenskaper ved figurer ved å bruke <b>vinkler</b>.',
   steg:['En <b>vinkel</b> dannes der to streker møtes i et hjørne.', '<b>Rett vinkel:</b> som hjørnet på et ark. Den markeres med en liten firkant.', '<b>Spiss vinkel:</b> mindre enn en rett vinkel.', '<b>Stump vinkel:</b> større enn en rett vinkel.', 'Sjekk med hjørnet på et ark: passer, er mindre eller er større.', 'Et rektangel og et kvadrat har fire rette vinkler. En trekant kan ha én rett vinkel eller ingen.'],
   eks:[G.angle(90, {c:'#16a34a', label:'rett', w:130}) + G.angle(50, {c:'#f97316', label:'spiss', w:130}) + G.angle(130, {c:'#9333ea', label:'stump', w:130})],
   ord:[['vinkel', 'det som dannes der to streker møtes'], ['rett vinkel', 'som hjørnet på et ark (90°)'], ['spiss vinkel', 'mindre enn en rett vinkel'], ['stump vinkel', 'større enn en rett vinkel']],
   feil:['«En lang vinkel er større» – lengden på strekene har ingen betydning, det er åpningen som teller.', '«Alle hjørner på figurer er rette» – de er det bare i rektangel og kvadrat.'],
   laerer:'KM13261 (andre del): vinkler som beskrivelse av figurer. Vinkler måles ikke i grader i dette trinnet, men «rett vinkel er 90°» kan nevnes. Vanlig misoppfatning: at lengden på vinkelbeina avgjør størrelsen. Bruk et ark-hjørne eller en brettet lapp som «vinkelmåler».'
  },
  refleksjon:'Finn tre rette vinkler i klasserommet. Hva er de like?',
  nivaaer:[
   {t:'Forstå: rett, spiss og stump', d:'Sjekk at du har forstått.', kind:'forstaa', make:(r, i) => {
     const k = i % 6;
     if(k === 0) return Q.choice(r, 'Hvilken vinkel er som hjørnet på et ark?', 'Rett vinkel', ['Spiss vinkel', 'Stump vinkel', 'Ingen av dem'], {keep:true, expl:'Hjørnet på et ark er en rett vinkel.'});
     if(k === 1) return Q.yn('Er en spiss vinkel mindre enn en rett vinkel?', true, {expl:'Ja. Spiss betyr mindre enn rett.'});
     if(k === 2) return Q.yn('Er en stump vinkel mindre enn en rett vinkel?', false, {expl:'Nei. En stump vinkel er større enn en rett vinkel.'});
     if(k === 3) return Q.yn('Blir en vinkel større av at strekene tegnes lengre?', false, {expl:'Nei. Det er åpningen mellom strekene som avgjør.'});
     if(k === 4) return Q.choice(r, 'Hvordan sjekker du om en vinkel er rett?', 'Legger hjørnet på et ark mot den', ['Måler lengden på strekene', 'Teller hjørnene i rommet', 'Gjetter'], {keep:true, expl:'Passer arkhjørnet, er vinkelen rett.'});
     return Q.choice(r, 'Hvor mange rette vinkler har et rektangel?', '4', ['2', '3', '0'], {keep:true, expl:'Alle fire hjørnene i et rektangel er rette.'});
   }},
   {t:'Rett, spiss eller stump?', d:'Hvilken slags vinkel?', n:12, make:(r, i) => {
     const deg = pick(r, [30, 40, 50, 60, 75, 90, 90, 105, 120, 135, 150]), rot = deg <= 120 ? int(r, 0, 12) : 0;
     return Q.choice(r, `${G.angle(deg, {c:'#2563eb', rot, mark:false})}<br>Hva slags vinkel er dette?`, kindOf(deg), ['spiss', 'rett', 'stump'], {keep:true, say:'Hva slags vinkel er dette?', expl:deg === 90 ? 'Den er akkurat som hjørnet på et ark: rett.' : deg < 90 ? 'Den er mindre enn et arkhjørne: spiss.' : 'Den er større enn et arkhjørne: stump.'});
   }},
   {t:'Rette vinkler i figurer', d:'Tell de rette vinklene.', n:10, make:(r, i) => {
     const kind = pick(r, ['rectangle', 'square', 'triangle', 'rhombus', 'hexagon', 'pentagon']), n = (kind === 'rectangle' || kind === 'square') ? 4 : 0, nm = POLY[kind][0];
     if(i % 2 === 1) return Q.yn(`${G.poly(kind, {s:130})}<br>Er alle vinklene i ${ART[kind]} ${nm} rette vinkler?`, n === 4, {say:`Er alle vinklene i ${ART[kind]} ${nm} rette vinkler?`, expl:n ? 'Ja. Alle fire hjørner er rette vinkler.' : 'Nei. Hjørnene i denne figuren er ikke rette vinkler.'});
     return Q.num(`${G.poly(kind, {s:130})}<br>Figuren er ${ART[kind]} ${nm}. Hvor mange rette vinkler har den? {?}`, n, {say:`Figuren er ${nm}. Hvor mange rette vinkler har den?`, expl:n ? `Alle fire hjørner er rette vinkler.` : `Ingen av hjørnene er rette vinkler.`});
   }},
   {t:'Hvilken vinkel er størst?', d:'Sammenlign vinklene.', n:10, make:(r, i) => {
     const all = shuf(r, [25, 40, 55, 70, 90, 110, 125, 140, 155]), pickDeg = []; for(const d of all){ if(pickDeg.every(x => Math.abs(x - d) >= 25)) pickDeg.push(d); if(pickDeg.length === 3) break; }
     while(pickDeg.length < 3) pickDeg.push(pickDeg[0] + 30 * (pickDeg.length));
     const big = i % 2 === 0, L = ['A', 'B', 'C'], target = big ? Math.max(...pickDeg) : Math.min(...pickDeg), ans = L[pickDeg.indexOf(target)];
     const pics = `<span style="display:inline-flex;gap:6px;flex-wrap:wrap;justify-content:center">${pickDeg.map((d, j) => `<span style="text-align:center"><b style="font-size:1.4rem">${L[j]}</b><br>${G.angle(d, {w:150, len:62})}</span>`).join('')}</span>`;
     return Q.choice(r, `${pics}<br>Hvilken vinkel er ${big ? 'størst' : 'minst'}?`, ans, L.filter(x => x !== ans), {keep:true, say:`Hvilken vinkel er ${big ? 'størst' : 'minst'}?`, expl:`Den ${big ? 'største' : 'minste'} vinkelen har ${big ? 'bredest' : 'smalest'} åpning. Det er ${ans}.`});
   }},
   {t:'Vinkler på klokka', d:'Hva slags vinkel danner viserne?', n:10, make:(r, i) => {
     const h = pick(r, CLOCKS), deg = Math.min(h % 12 * 30, 360 - h % 12 * 30), k = kindOf(deg);
     return Q.choice(r, `${G.clock(h, 0, {s:150})}<br>Klokka er ${h}. Hva slags vinkel danner viserne? `, k, ['spiss', 'rett', 'stump'], {keep:true, say:`Klokka er ${h}. Hva slags vinkel danner viserne?`, expl:k === 'rett' ? 'Klokka 3 og 9 er viserne vinkelrette: rett vinkel.' : k === 'spiss' ? 'Viserne står tett sammen: spiss vinkel.' : 'Viserne står langt fra hverandre, men ikke på rett linje: stump vinkel.'});
   }},
   {t:'Rette vinkler rundt oss', d:'Finn dem i hverdagen.', n:10, make:(r, i) => {
     const bank = [['hjørnet på et A4-ark', true], ['hjørnet på en bok', true], ['hjørnet på en dør', true], ['hjørnet på et vindu', true], ['hjørnet på et bord', true], ['hjørnet på en pizzaeske', true], ['hjørnet på et sjakkbrett', true], ['hjørnet på en skjerm', true], ['hjørnet på en trekantet vimpel', false], ['kanten av en tallerken', false], ['spissen på en blyant', false], ['hjulet på en sykkel', false], ['toppen av et telt', false], ['en rund klokkeskive', false]];
     const pos = bank.filter(x => x[1]), neg = bank.filter(x => !x[1]);
     if(i % 3 === 2){ const b = pick(r, neg), wr = shuf(r, pos).slice(0, 3); return Q.choice(r, 'Hvor finner du IKKE en rett vinkel?', b[0], wr.map(x => x[0]), {say:'Hvor finner du ikke en rett vinkel?', expl:`${b[0].charAt(0).toUpperCase() + b[0].slice(1)} har ingen rett vinkel.`}); }
     const b = pick(r, pos), wr = shuf(r, neg).slice(0, 3);
     return Q.choice(r, 'Hvor finner du en rett vinkel?', b[0], wr.map(x => x[0]), {say:'Hvor finner du en rett vinkel?', expl:`${b[0].charAt(0).toUpperCase() + b[0].slice(1)} har en rett vinkel.`});
   }}
  ]
});

/* ======================================================================
   Måle volum (KM13264)
   ====================================================================== */
const cubePic = (l, b, h, o) => G.cubes(l, b, h, o);
MT.module({
  id:'maale-volum', rek:166, trinn:[4], maal:['KM13264'], tittel:'Måle volum: hvor mye plass?', ikon:'🧪', bygger:['maale-areal', 'romfigurer', 'maale-lengde'],
  video:[
   {html:title('🧪', 'Måle volum', S.sub('Hvor mye plass er det inni?', 1.2)),
    no:'Volum forteller hvor mye plass noe tar, eller hvor mye det er plass til inni. I dag måler vi volum på to måter: med kuber og med liter.'},
   {html:sc(S.row(S.pop(cubePic(3, 2, 1, {s:30}), .2)), S.sub('Ett lag: 3 × 2 = 6 klosser', 1.4)),
    no:'Vi fyller en eske med like store klosser. Her er første lag. Tre klosser langs og to klosser bortover. Tre ganger to er seks klosser i ett lag.'},
   {html:sc(S.row(S.pop(cubePic(3, 2, 3, {s:30, bottom:true}), .2)), S.sub('3 lag × 6 klosser = 18 klosser', 1.6)),
    no:'Nå har vi tre lag oppå hverandre. Hvert lag har seks klosser. Tre ganger seks er atten klosser. Volumet er atten klosser.'},
   {html:sc(S.row(S.pop(E('1 cm³ = 1 kubikkcentimeter', '#2563eb'), .2)), S.sub('En standardkloss: 1 cm lang, 1 cm bred og 1 cm høy', 1.4)),
    no:'Hvis hver kloss er en centimeter lang, bred og høy, kaller vi volumet til klossen en kubikkcentimeter. Det skrives cm og et lite hevet tre. Atten klosser er atten kubikkcentimeter.'},
   {html:sc(S.row(S.pop(G.jug(6, 10, {unit:'dl'}), .2)), S.sub('Flytende ting måler vi i liter og desiliter', 1.4)),
    no:'Vann og melk måler vi i liter og desiliter. Her er et målebeger. Vannet står på seks desiliter.'},
   {html:sc(S.row(S.pop(E('1 liter = 10 desiliter', '#16a34a'), .2)), S.row(S.pop(E('2 l = 20 dl', '#f97316'), 1.2), S.pop(E('30 dl = 3 l', '#f97316'), 2)), S.sub('Ti desiliter fyller en liter', 3)),
    no:'En liter er ti desiliter. To liter er tjue desiliter. Tretti desiliter er tre liter.'},
   {html:sc(S.row(S.pop('<span style="font-size:2.6rem">🥛 + 🥛 + 🥛 + 🥛 + 🥛 = 1 l</span>', .2)), S.sub('Et glass rommer 2 dl: 5 glass fyller 1 liter', 1.4)),
    no:'Vi kan også måle med glass eller krus. Hvis et glass rommer to desiliter, trenger vi fem glass for å fylle en liter. Fem ganger to er ti desiliter.'},
   {html:sc(S.big('Mål volum: klosser, liter og desiliter', .2), S.sub('Nå øver vi!', 1.4)),
    no:'Husk: volum er hvor mye plass. Vi måler det med klosser eller med liter og desiliter. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal <b>måle volum</b> i praktiske situasjoner med ikke-standardiserte og standardiserte måleenheter og samtale om resultatene.',
   steg:['<b>Volum</b> er hvor mye plass noe tar, eller hvor mye det er plass til.', '<b>Ikke-standardisert:</b> mål med klosser, kopper eller glass. Fortell hvilken enhet du brukte.', '<b>Standardisert:</b> kubikkcentimeter (cm³) for faste ting, og liter (l) og desiliter (dl) for væske.', 'Tell klosser: <b>lag × klosser i hvert lag</b>.', '<b>1 l = 10 dl.</b> 3 l = 30 dl.', 'Snakk om resultatet: er det rimelig? Hvilken enhet passer best?'],
   eks:[cubePic(3, 2, 3, {bottom:true, s:26}) + '<br>3 lag × 6 = 18 klosser = 18 cm³', '2 l = 20 dl · 30 dl = 3 l'],
   ord:[['volum', 'hvor mye plass noe tar'], ['liter (l)', 'måleenhet for væske'], ['desiliter (dl)', 'en tidel av en liter'], ['kubikkcentimeter (cm³)', 'volumet til en kloss som er 1 cm på alle sider']],
   feil:['«Volum og areal er det samme» – areal er flate, volum er plass.', '«1 liter er 100 desiliter» – 1 liter er 10 desiliter.'],
   laerer:'KM13264: måle volum i praktiske situasjoner med ikke-standardiserte og standardiserte enheter og samtale om resultatene. La elevene måle med krus, glass og enhetsterninger, og snakke om resultatene (hvorfor ble svarene ulike? hvilken enhet passer?). Hver terning her er 1 cm³ (cm kubikk). ml (1 l = 1000 ml) og cl kan introduseres senere.'
  },
  refleksjon:'Hvor mange glass à 2 dl trenger du for å fylle en kanne på 2 liter? Forklar hvordan du tenker.',
  nivaaer:[
   {t:'Forstå: hva er volum?', d:'Sjekk at du har forstått.', kind:'forstaa', make:(r, i) => {
     const k = i % 6;
     if(k === 0) return Q.choice(r, 'Hva forteller volum?', 'Hvor mye plass noe tar', ['Hvor langt noe er', 'Hvor tungt noe er', 'Hvor gammelt noe er'], {keep:true, expl:'Volum er hvor mye plass noe tar eller rommer.'});
     if(k === 1) return Q.yn('Er 1 liter det samme som 10 desiliter?', true, {expl:'Ja. 1 l = 10 dl.'});
     if(k === 2) return Q.choice(r, 'Hvilken enhet passer best for å måle en kanne med juice?', 'liter', ['kilometer', 'gram', 'kvadratmeter'], {keep:true, expl:'Væske måler vi i liter og desiliter.'});
     if(k === 3) return Q.yn('Er volum og areal det samme?', false, {expl:'Nei. Areal er flate, volum er plass.'});
     if(k === 4) return Q.choice(r, 'Hva er en kubikkcentimeter?', 'Volumet til en kloss som er 1 cm på alle sider', ['En lengde på 1 cm', 'En flate på 1 cm', 'En liter'], {keep:true, expl:'1 cm³ er volumet til en liten terning med side 1 cm.'});
     return Q.yn('Kan du måle volum med glass og kopper?', true, {expl:'Ja, ikke-standardiserte enheter fungerer også. Fortell hvilken enhet du brukte.'});
   }},
   {t:'Tell klosser i ett lag', d:'Rader × klosser i hver rad.', n:10, make:(r, i) => {
     const l = int(r, 2, 6), b = int(r, 2, 4);
     return Q.num(`${cubePic(l, b, 1, {s:30})}<br>Hvor mange klosser er det i laget? {?}`, l * b, {say:'Hvor mange klosser er det i laget?', calc:`${l}*${b}`, hint:'Tell klosser langs, og ganger med klosser bortover.', expl:`${l} klosser langs og ${b} bortover: ${l} × ${b} = ${l * b}.`});
   }},
   {t:'Tell klosser i blokken', d:'Lag × klosser i hvert lag.', n:12, make:(r, i) => {
     const l = int(r, 2, 4), b = int(r, 2, 3), h = int(r, 2, 4), k = i % 3;
     if(k === 0) return Q.num(`${cubePic(l, b, h, {s:26, bottom:true})}<br>Hvor mange klosser er det i det nederste laget (oransje)? {?}`, l * b, {say:'Hvor mange klosser er det i det nederste laget?', calc:`${l}*${b}`, expl:`${l} × ${b} = ${l * b}.`});
     if(k === 1) return Q.num(`${cubePic(l, b, h, {s:26, bottom:true})}<br>Hvor mange lag er det? {?}`, h, {say:'Hvor mange lag er det?', expl:`Tell lagene oppover: ${h}.`});
     return Q.num(`${cubePic(l, b, h, {s:26, bottom:true})}<br>Hver kloss er 1 cm³. Hva er volumet til blokken? {?} cm³`, l * b * h, {say:'Hver kloss er 1 kubikkcentimeter. Hva er volumet til blokken?', calc:`${l}*${b}*${h}`, hint:'Klosser i ett lag ganger antall lag.', expl:`${l * b} klosser i hvert lag og ${h} lag: ${l * b} × ${h} = ${l * b * h} cm³.`});
   }},
   {t:'Les av målebegeret', d:'Hvor mye vann er det?', n:10, make:(r, i) => {
     if(i % 2 === 0){ const v = int(r, 1, 9); return Q.num(`${G.jug(v, 10, {unit:'dl'})}<br>Hvor mange desiliter vann er det i begeret? {?} dl`, v, {say:'Hvor mange desiliter vann er det i begeret?', expl:`Vannet står på ${v} dl.`}); }
     const v = int(r, 1, 4); return Q.num(`${G.jug(v, 5, {unit:'l', every:1})}<br>Hvor mange liter vann er det i kannen? {?} l`, v, {say:'Hvor mange liter vann er det i kannen?', expl:`Vannet står på ${v} l.`});
   }},
   {t:'Liter og desiliter', d:'1 liter er 10 desiliter.', n:12, make:(r, i) => {
     const k = i % 4;
     if(k === 0){ const l = int(r, 2, 9); return Q.num(`${l} l = {?} dl`, l * 10, {say:`${l} liter er hvor mange desiliter?`, calc:`${l}*10`, expl:`1 l = 10 dl, så ${l} l = ${l * 10} dl.`}); }
     if(k === 1){ const l = int(r, 2, 9); return Q.num(`${l * 10} dl = {?} l`, l, {say:`${l * 10} desiliter er hvor mange liter?`, calc:`${l * 10}/10`, expl:`10 dl = 1 l, så ${l * 10} dl = ${l} l.`}); }
     if(k === 2){ const l = int(r, 1, 5), d = int(r, 1, 9); return Q.num(`${l} l ${d} dl = {?} dl`, l * 10 + d, {say:`${l} liter og ${d} desiliter er hvor mange desiliter?`, calc:`${l}*10+${d}`, expl:`${l} l = ${l * 10} dl, og ${l * 10} + ${d} = ${l * 10 + d} dl.`}); }
     const l = int(r, 2, 8), d = int(r, 1, 9); return Q.choice(r, `Hva er mest? ${l} l eller ${l * 10 - d} dl`, `${l} l`, [`${l * 10 - d} dl`], {keep:true, say:`Hva er mest? ${l} liter eller ${l * 10 - d} desiliter?`, expl:`${l} l = ${l * 10} dl, og ${l * 10} er mer enn ${l * 10 - d}.`});
   }},
   {t:'Hvor mange passer?', d:'Glass, kopper og kanner.', n:10, make:(r, i) => {
     const size = pick(r, [1, 2, 5]), lit = int(r, 1, 3), nm = pick(r, MT.NAMES), k = i % 3;
     if(k === 0) return Q.num(`Et glass rommer ${size} dl. Hvor mange glass trengs for å fylle ${lit} l? {?}`, lit * 10 / size, {say:`Et glass rommer ${size} desiliter. Hvor mange glass trengs for å fylle ${lit} liter?`, calc:`${lit * 10}/${size}`, hint:'Gjør om liter til desiliter først.', expl:`${lit} l = ${lit * 10} dl. ${lit * 10} ÷ ${size} = ${lit * 10 / size}.`});
     if(k === 1){ const n = int(r, 3, 9); return Q.num(`${nm} heller ${n} glass med ${size} dl i en kanne. Hvor mange dl er det i kanna? {?} dl`, n * size, {say:`${nm} heller ${n} glass med ${size} desiliter i en kanne. Hvor mange desiliter er det i kanna?`, calc:`${n}*${size}`, expl:`${n} × ${size} = ${n * size} dl.`}); }
     const used = int(r, 2, 8); return Q.num(`En kanne rommer 1 l. ${nm} heller ut ${used} dl. Hvor mange dl er igjen? {?} dl`, 10 - used, {say:`En kanne rommer 1 liter. ${nm} heller ut ${used} desiliter. Hvor mange desiliter er igjen?`, calc:`10-${used}`, expl:`1 l = 10 dl, og 10 − ${used} = ${10 - used}.`});
   }},
   {t:'Sammenlign volum', d:'Hvilken eske rommer mest?', n:10, make:(r, i) => {
     const mk = () => [int(r, 2, 4), int(r, 2, 3), int(r, 1, 3)];
     let A = mk(), B = mk(); const same = i % 5 === 4; if(same){ B = [A[1], A[0], A[2]]; }
     const va = A[0] * A[1] * A[2], vb = B[0] * B[1] * B[2];
     const pics = `<span style="display:inline-flex;gap:14px;flex-wrap:wrap;justify-content:center"><span style="text-align:center"><b style="font-size:1.4rem">A</b><br>${cubePic(A[0], A[1], A[2], {s:22})}</span><span style="text-align:center"><b style="font-size:1.4rem">B</b><br>${cubePic(B[0], B[1], B[2], {s:22})}</span></span>`;
     const ans = va > vb ? 'A' : va < vb ? 'B' : 'Like mye';
     return Q.choice(r, `${pics}<br>Alle klossene er like store. Hvilken blokk har størst volum?`, ans, ['A', 'B', 'Like mye'], {keep:true, say:'Alle klossene er like store. Hvilken blokk har størst volum?', expl:`A har ${va} klosser og B har ${vb} klosser. ${ans === 'Like mye' ? 'Like mye.' : ans + ' har størst volum.'}`});
   }}
  ],
  drill:{tittel:'Liter og desiliter', layout:'row', cols:4, n:[48, 27], make:(r, i, hard) => {
    const k = i % (hard ? 4 : 2), l = int(r, 2, 9);
    if(k === 0) return {t:`${l} l = ☐ dl`, ans:l * 10};
    if(k === 1) return {t:`${l * 10} dl = ☐ l`, ans:l};
    if(k === 2){ const d = int(r, 1, 9); return {t:`${l} l ${d} dl = ☐ dl`, ans:l * 10 + d}; }
    const d = int(r, 1, 9); return {t:`${l * 10 + d} dl = ${l} l ☐ dl`, ans:d}; }}
});
})();
