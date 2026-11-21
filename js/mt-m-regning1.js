(function(){
'use strict';
/* Moduler: addisjon og subtraksjon – begrep og regnefakta (KM13234, KM13242, KM13233) */
const A = window.App, MT = window.MT, G = MT.G, Q = MT.Q, S = MT.S, B = MT.B;
const {int, pick, shuf} = MT, {sc, pop, fade, big, sub, row, chip, title} = S;
const range = (a, b) => Array.from({length:b - a + 1}, (_, i) => a + i);
const cnt = (n, t) => n === 1 ? '1 ' + t[2] : n + ' ' + t[1];
const PL = '<span style="font-size:2rem;font-weight:900"> + </span>', MI = '<span style="font-size:2rem;font-weight:900"> − </span>', EQ = '<span style="font-size:2rem;font-weight:900"> = </span>';
const addPic = (a, b, e1, e2) => `<span class="mtg">${G.objs(e1, a, {per:5, s:'1.7rem'})}${PL}${G.objs(e2, b, {per:5, s:'1.7rem'})}</span>`;
const E2 = [['🍎', '🍏'], ['🔴', '🔵'], ['⭐', '🌟'], ['🐟', '🐠'], ['🚗', '🚙']];
const hop = (a, op, b, o) => { const e = op === '+' ? a + b : a - b; return G.nline(Math.max(0, Math.min(a, e) - 1), Math.max(a, e) + 1, Object.assign({marks:[{v:a, label:a, c:'#16a34a'}], hops:[{a, b:e, label:(op === '+' ? '+' : '−') + b, c:op === '+' ? '#f97316' : '#dc2626'}], w:540}, o || {})); };
const wrongs = (r, ans, lo, hi) => { const o = []; [ans - 1, ans + 1, ans - 2, ans + 2, ans + 10, ans - 10].forEach(x => { if(x >= lo && x <= hi && x !== ans) o.push(x); }); return shuf(r, o).slice(0, 3); };

/* ======================================================================
   A1. Legge sammen
   ====================================================================== */
MT.module({
  id:'legge-sammen', rek:30, trinn:[1], maal:['KM13234'], tittel:'Legge sammen: hva addisjon betyr', ikon:'➕', bygger:['mengde-10'],
  video:[
   {html:title('➕', 'Å legge sammen', S.sub('Addisjon', 1.2)),
    no:'Nå skal vi lære å legge sammen. Det kalles addisjon. Vi bruker addisjon hver dag, for eksempel når vi skal finne ut hvor mange vi er til sammen.'},
   {html:sc(S.row(S.pop(G.objs('🍎', 3, {s:'2.6rem'}), .2), S.pop('<span style="font-size:2.4rem;font-weight:900"> og </span>', 1), S.pop(G.objs('🍏', 2, {s:'2.6rem'}), 1.6)), S.sub('Mia har 3 epler og får 2 til. Hvor mange har hun nå?', 3)),
    no:'Mia har tre epler. Så får hun to epler til. Hvor mange epler har Mia nå? Vi legger sammen eplene. Ett, to, tre, fire, fem. Mia har fem epler.'},
   {html:sc(S.big('3 + 2 = 5', .2), S.row(S.pop(G.eq('+ pluss: legge til, legge sammen', '#f97316'), 1.2), S.pop(G.eq('= er lik: like mye som', '#2563eb'), 2.2)), S.sub('Svaret kalles summen', 3.4)),
    no:'Vi skriver det som et regnestykke: tre pluss to er lik fem. Plusstegnet betyr å legge sammen. Likhetstegnet betyr at det er like mye. Svaret på et plusstykke kalles summen. Summen av tre og to er fem.'},
   {html:sc(S.row(S.pop(G.frame(3, 2, {s:36}), .2), S.pop(G.bar(5, 3, 2, {w:260}), 1.4)), S.sub('To deler blir til en hel mengde', 2.6)),
    no:'Her ser vi det i en tierramme. Tre blå prikker og to oransje prikker. Til sammen fem prikker. Vi kan også tegne det som en stang. To deler som sammen blir en hel. Tre og to er fem.'},
   {html:sc(G.nline(0, 10, {marks:[{v:3, label:'start 3', c:'#16a34a'}], hops:[3, 4].map(a => ({a, b:a + 1, label:'+1', c:'#f97316'})), w:600}), S.sub('Vi trenger ikke telle alt på nytt: start på 3 og tell videre', 1.8)),
    no:'Vi trenger ikke å telle alt på nytt. Vi vet at vi har tre. Så starter vi på tre og teller videre to steg: fire, fem. Svaret er fem.'},
   {html:sc(S.row(S.pop(G.eq('4 + 0 = 4', '#6b7280'), .2), S.pop(G.eq('0 + 6 = 6', '#6b7280'), 1.2)), S.sub('Å legge til null forandrer ingenting', 2.2)),
    no:'Hva skjer hvis vi legger til null? Fire pluss null er fire. Ingenting ble lagt til. Null pluss seks er seks. Å legge til null forandrer ikke tallet.'},
   {html:sc(S.pop(addPic(4, 3, '🚗', '🚙'), .2), S.big('4 + 3 = 7', 1.4), S.sub('Skriv regnestykket til bildet', 2.4)),
    no:'Nå kan du se på et bilde og skrive regnestykket. Her er fire røde biler og tre gule biler. Fire pluss tre er sju. Nå skal du øve på å legge sammen!'}
  ],
  tekst:{
   mal:'Du skal forstå hva det vil si å <b>legge sammen</b> (addisjon), og kunne skrive og løse enkle plusstykker.',
   steg:['Se hvor mange du har fra før.', 'Se hvor mange som <b>kommer til</b>.', 'Skriv regnestykket: <b>første tall + andre tall = summen</b>.', 'Tell alle sammen, eller start på det første tallet og tell videre.'],
   eks:[addPic(3, 2, '🍎', '🍏') + '<br><b>3 + 2 = 5</b>', G.frame(4, 3, {s:24}) + '<br><b>4 + 3 = 7</b>'],
   ord:[['addisjon', 'å legge sammen'], ['pluss (+)', 'legge til'], ['er lik (=)', 'like mye som'], ['sum', 'svaret på et plusstykke']],
   feil:['«3 + 2 = 32» – plusstegnet betyr å legge sammen, ikke å skrive tallene etter hverandre.', '«Jeg teller fra begynnelsen og får feil» – pek på ett ting om gangen, eller start på det første tallet og tell videre.'],
   laerer:'Addisjon introduseres som «å legge sammen/legge til» (KM13234). Gå fra konkreter via bilde og tierramme til symbol (3 + 2 = 5), og øv på å oversette begge veier: fortelling ↔ bilde ↔ regnestykke. Vis også «tell videre fra første tall» som en mer effektiv strategi enn å telle alt.'
  },
  refleksjon:'Fortell en liten historie som passer til 5 + 2 = 7.',
  nivaaer:[
   {t:'Forstå: hva betyr å legge sammen?', d:'Sjekk at du har forstått addisjon.', kind:'forstaa', make:(r, i) => {
     const a = int(r, 2, 6), b = int(r, 1, 4), k = i % 5, n = pick(r, MT.NAMES);
     if(k === 0) return Q.choice(r, 'Hva betyr tegnet <b>+</b>?', 'Legge sammen', ['Ta bort', 'Er lik', 'Like mange'], {expl:'Plusstegnet betyr å legge til eller legge sammen.'});
     if(k === 1) return Q.choice(r, 'Hva kalles svaret på et plusstykke?', 'Summen', ['Differansen', 'Tallordet', 'Tierne'], {expl:'Svaret på en addisjon kalles summen.'});
     if(k === 2) return Q.choice(r, `${n} har ${a} kuler og får ${b} til. Skal du legge til eller ta bort?`, 'Legge til', ['Ta bort'], {keep:true, expl:'Det kommer flere kuler, så vi legger til.'});
     if(k === 3) return Q.num(`4 + 0 = {?}`, 4, {calc:'4+0', expl:'Å legge til null forandrer ikke tallet.'});
     return Q.yn(`Er ${a} + ${b} det samme som ${a + b}?`, true, {expl:`Ja: ${a} + ${b} = ${a + b}.`});
   }},
   {t:'Se og legg sammen', d:'Bilder med to grupper: hvor mange til sammen?', n:10, make:(r, i) => {
     const a = int(r, 1, 5), b = int(r, 1, 5), e = pick(r, E2);
     return (i % 2 ? Q.num : (x, y, o) => Q.near(r, x, y, o))(`${addPic(a, b, e[0], e[1])}<br>Hvor mange er det til sammen? {?}`, a + b, {say:'Hvor mange er det til sammen?', calc:`${a}+${b}`, expl:`${a} og ${b} er ${a + b}.`, hint:G.frame(a, b, {s:24})});
   }},
   {t:'Legg sammen (sum til 10)', d:'Regn plusstykker med sum til 10.', n:10, make:(r, i) => {
     const s = int(r, 4, 10), a = int(r, 1, s - 1), b = s - a, k = i % 3;
     if(k === 0) return Q.num(`${G.frame(a, b, {s:26})}<br>${a} + ${b} = {?}`, s, {calc:`${a}+${b}`, say:`${a} pluss ${b}`, expl:`${a} blå og ${b} oransje: ${s} til sammen.`});
     return Q.num(`${a} + ${b} = {?}`, s, {calc:`${a}+${b}`, expl:`${a} og ${b} er ${s}.`, hint:G.frame(a, b, {s:24})});
   }},
   {t:'Fra bilde til regnestykke', d:'Velg regnestykket som passer.', n:10, make:(r, i) => {
     const a = int(r, 1, 6), b = int(r, 1, 5), e = pick(r, E2), k = i % 2;
     if(k === 0) return Q.choice(r, `${addPic(a, b, e[0], e[1])}<br>Hvilket regnestykke passer?`, `${a} + ${b} = ${a + b}`, [`${a} + ${b} = ${a + b + 1}`, `${a} + ${a} = ${a + a}`, `${b} + ${b + 1} = ${b + b + 1}`].filter(x => x !== `${a} + ${b} = ${a + b}`), {say:'Hvilket regnestykke passer til bildet?', expl:`${a} og ${b} gir ${a + b}.`});
     return Q.choice(r, `${G.frame(a, b, {s:22})}<br>Hvilket regnestykke passer?`, `${a} + ${b} = ${a + b}`, [`${a + 1} + ${b} = ${a + b + 1}`, `${a} + ${b + 1} = ${a + b + 1}`, `${a} + ${b} = ${a + b - 1}`], {say:'Hvilket regnestykke passer til tierrammen?', expl:`Blå: ${a}, oransje: ${b}, til sammen ${a + b}.`});
   }},
   {t:'Telle videre', d:'Start på det første tallet og tell videre.', n:10, make:(r, i) => {
     const a = int(r, 3, 9), b = int(r, 1, 4), n = pick(r, MT.NAMES);
     return Q.num(`${n} har ${a}. ${n} får ${b} til. Start på ${a} og tell videre ${b} steg. Hvor mange har ${n} nå? {?}`, a + b, {say:`${n} har ${a}. ${n} får ${b} til. Start på ${a} og tell videre. Hvor mange har ${n} nå?`, calc:`${a}+${b}`, expl:`${a}, ${range(1, b).map(x => a + x).join(', ')}. Svaret er ${a + b}.`, hint:hop(a, '+', b)});
   }}
  ]
});

/* ======================================================================
   A2. Addisjon til 10
   ====================================================================== */
MT.module({
  id:'addisjon-til-10', rek:32, trinn:[1], maal:['KM13234'], tittel:'Addisjon til 10: summer, manglende tall og tiervenner', ikon:'🔟', bygger:['legge-sammen'],
  video:[
   {html:title('🔟', 'Plusstykker til 10', S.sub('Se sammenhenger', 1.2)),
    no:'Nå skal vi bli trygge på plusstykkene med sum opp til ti. Vi leter etter sammenhenger, så vi ikke trenger å telle hver gang.'},
   {html:sc(S.row(...[[0, 5], [1, 4], [2, 3]].map((p, i) => S.pop(G.frame(p[0], p[1], {s:22}), .2 + i * .8))), S.row(...[[3, 2], [4, 1], [5, 0]].map((p, i) => S.pop(G.frame(p[0], p[1], {s:22}), 2.6 + i * .8))), S.sub('Alle måter å lage 5 på', 5)),
    no:'Her er alle måtene å lage fem på. Null og fem. En og fire. To og tre. Tre og to. Fire og en. Fem og null. Hver gang er summen fem. Når det ene tallet øker, minker det andre.'},
   {html:sc(S.row(...[[1, 9], [2, 8], [3, 7], [4, 6], [5, 5]].map((p, i) => S.pop(G.eq(p[0] + ' + ' + p[1] + ' = 10', '#16a34a'), .2 + i * .7))), S.pop(G.frame(7, 3, {s:30}), 4), S.sub('Tiervenner: to tall som blir 10', 5)),
    no:'Noen par er spesielt viktige. De som blir ti. Én og ni. To og åtte. Tre og sju. Fire og seks. Fem og fem. Vi kaller dem tiervenner. Når du kan dem, har du god hjelp til alt annet.'},
   {html:sc(S.pop(G.bar(7, 3, 4, {w:300, q:1}), .2), S.big('3 + ? = 7', 1.4), S.sub('Hva mangler?', 2.4)),
    no:'Noen ganger mangler et tall. Tre pluss hva er sju? Se på stangen. Hele stangen er sju. Den ene delen er tre. Den andre delen er det som mangler: fire. Tre og fire er sju.'},
   {html:sc(S.row(...[1, 2, 3, 4, 5].map((n, i) => S.pop(G.eq(n + ' + ' + n + ' = ' + 2 * n, '#9333ea'), .2 + i * .7))), S.sub('Dobbelt: to like tall', 4.2)),
    no:'Det er også lett å regne med to like tall. Én og én er to. To og to er fire. Tre og tre er seks. Fire og fire er åtte. Fem og fem er ti. Det kalles å doble.'},
   {html:sc(S.row(S.pop(G.frame(6, 3, {s:30}), .2)), S.big('6 + 3 = 9', 1.2), S.sub('Nå øver vi!', 2.2)),
    no:'Nå kjenner du mange sammenhenger. Seks pluss tre er ni. Sju pluss tre er ti. Nå skal du øve til du kan plusstykkene med en gang!'}
  ],
  tekst:{
   mal:'Du skal kunne plusstykkene med sum opp til 10, finne tallet som mangler (<b>3 + ? = 7</b>) og kunne <b>tiervennene</b>.',
   steg:['Bruk tierrammen: to farger som sammen fyller opp.', 'Tiervenner: 1+9, 2+8, 3+7, 4+6, 5+5.', 'Manglende tall: se på hele og delen du har. Det som mangler er resten.', 'Dobbelt: 1+1, 2+2, 3+3, 4+4, 5+5.'],
   eks:[G.frame(4, 6, {s:22}) + '<br>4 + 6 = 10 (tiervenner)', G.bar(8, 3, 5, {w:260, q:1}) + '<br>3 + ? = 8 → 5'],
   ord:[['tiervenner', 'to tall som blir 10 til sammen'], ['manglende tall', 'tallet som må til for å få svaret'], ['doble', 'legge sammen to like tall']],
   feil:['«3 + ? = 7 betyr 3 + 7» – du leter etter tallet som må <b>til</b> 3 for å få 7: 4.'],
   laerer:'Mål: trygghet i addisjonsfakta til 10 (KM13234), bygget på forståelse for del–hel og tiervenner – ikke på ren pugg. Bruk tierrammen, stang og konkreter. Manglende ledd (3 + ? = 7) forbereder subtraksjon som «hva mangler?».'
  },
  refleksjon:'Hvorfor er tiervenner nyttige? Gi et eksempel.',
  nivaaer:[
   {t:'Forstå: sammenhenger til 10', d:'Sjekk at du ser sammenhengene.', kind:'forstaa', make:(r, i) => {
     const a = int(r, 1, 9), k = i % 5;
     if(k === 0) return Q.choice(r, 'Hva er <b>tiervenner</b>?', 'To tall som blir 10 til sammen', ['To like tall', 'Tall som slutter på 0', 'To tall som blir 5'], {expl:'For eksempel 3 og 7, 4 og 6, 5 og 5.'});
     if(k === 1) return Q.num(`${G.bar(10, a, 10 - a, {w:260, q:1})}<br>${a} + ? = 10. Hva mangler? {?}`, 10 - a, {say:`${a} pluss hva er ti?`, chk:`${a}+_===10`, expl:`Hele stangen er 10, den ene delen er ${a}, resten er ${10 - a}.`});
     if(k === 2) return Q.yn(`Er ${a} + ${10 - a} = 10?`, true, {expl:`Ja, ${a} og ${10 - a} er tiervenner.`});
     if(k === 3) return Q.yn(`Er ${a} + ${a} = ${2 * a}? (to like tall)`, true, {expl:`Ja, ${a} og ${a} er ${2 * a}. Det kalles å doble.`});
     return Q.yn(`Er ${a} + 3 = 3 + ${a}?`, true, {expl:`Ja, svaret er ${a + 3} begge veier.`});
   }},
   {t:'Sum til 5', d:'Plusstykker med sum opp til 5.', n:10, make:(r, i) => { const a = int(r, 0, 5), b = int(r, 0, 5 - a); return Q.num(`${a} + ${b} = {?}`, a + b, {calc:`${a}+${b}`, expl:`${a} og ${b} er ${a + b}.`, hint:G.frame(a, b, {s:24})}); }},
   {t:'Sum til 10', d:'Plusstykker med sum opp til 10.', n:10, make:(r, i) => { const a = int(r, 1, 9), b = int(r, 1, 10 - a); return Q.num(`${a} + ${b} = {?}`, a + b, {calc:`${a}+${b}`, expl:`${a} og ${b} er ${a + b}.`, hint:G.frame(a, b, {s:24})}); }},
   {t:'Hva mangler?', d:'Finn tallet som mangler.', n:10, make:(r, i) => {
     const s = int(r, 4, 10), a = int(r, 1, s - 1), b = s - a, k = i % 2;
     return k ? Q.num(`${a} + {?} = ${s}`, b, {chk:`${a}+_===${s}`, say:`${a} pluss hva er ${s}?`, expl:`${s} − ${a} = ${b}, for ${a} + ${b} = ${s}.`, hint:G.bar(s, a, b, {w:260, q:1})}) : Q.num(`{?} + ${b} = ${s}`, a, {chk:`_+${b}===${s}`, say:`Hva pluss ${b} er ${s}?`, expl:`${a} + ${b} = ${s}.`, hint:G.bar(s, a, b, {w:260, q:0})});
   }},
   {t:'Tiervenner og doble', d:'Raske fakta som du skal kunne.', n:10, make:(r, i) => {
     const a = int(r, 1, 9), k = i % 3;
     if(k === 0) return Q.num(`${a} + {?} = 10`, 10 - a, {chk:`${a}+_===10`, say:`${a} pluss hva er ti?`, expl:`${a} og ${10 - a} er tiervenner.`, hint:G.frame(a, 10 - a, {s:24})});
     if(k === 1){ const d = int(r, 1, 5); return Q.num(`${d} + ${d} = {?}`, 2 * d, {calc:`${d}+${d}`, expl:`Dobbelt av ${d} er ${2 * d}.`}); }
     return Q.near(r, `Hva er tiervennen til <b>${a}</b>?`, 10 - a, {say:`Hva er tiervennen til ${a}?`, expl:`${a} + ${10 - a} = 10.`});
   }}
  ]
});

/* ======================================================================
   A6. Trekke fra
   ====================================================================== */
const takePic = (a, b, e) => G.objs(e, a, {per:5, s:'1.9rem', cross:b});
MT.module({
  id:'trekke-fra', rek:34, trinn:[1], maal:['KM13234'], tittel:'Trekke fra: hva subtraksjon betyr', ikon:'➖', bygger:['legge-sammen'],
  video:[
   {html:title('➖', 'Å trekke fra', S.sub('Subtraksjon', 1.2)),
    no:'Nå skal vi lære å trekke fra. Det kalles subtraksjon. Vi bruker det når noe blir borte, eller når vi vil sammenligne to mengder.'},
   {html:sc(S.pop(takePic(5, 2, '🍎'), .2), S.sub('Mia har 5 epler og spiser 2. Hvor mange er igjen?', 1.6), S.big('5 − 2 = 3', 2.6)),
    no:'Mia har fem epler. Så spiser hun to. Hvor mange epler er det igjen? Vi tar bort to. Da er det tre igjen. Fem minus to er lik tre.'},
   {html:sc(S.row(S.pop(G.eq('− minus: ta bort', '#dc2626'), .2), S.pop(G.eq('= er lik: like mye som', '#2563eb'), 1.2)), S.sub('Svaret kalles differansen', 2.4)),
    no:'Minustegnet betyr å ta bort. Likhetstegnet betyr at det er like mye. Svaret på et minusstykke kalles differansen.'},
   {html:sc(S.row(S.pop(G.frame(7, 0, {s:26}), .2), S.pop(G.frame(4, 0, {s:26}), 1.2)), S.big('7 − 4 = 3', 2.2), S.sub('Hvor mange flere? Sammenlign', 3)),
    no:'Vi bruker også minus for å sammenligne. Ola har sju kuler. Mia har fire. Hvor mange flere har Ola? Vi finner forskjellen: sju minus fire er tre. Ola har tre flere.'},
   {html:sc(S.pop(G.bar(7, 4, 3, {w:300, q:1}), .2), S.big('4 + ? = 7', 1.4), S.sub('Hva mangler? Det er også minus: 7 − 4', 2.4)),
    no:'Minus kan også svare på spørsmålet: hva mangler? Fire pluss hva er sju? Det mangler tre. Da er sju minus fire lik tre.'},
   {html:sc(S.row(S.pop(G.eq('3 + 4 = 7', '#16a34a'), .2), S.pop(G.eq('4 + 3 = 7', '#16a34a'), .9)), S.row(S.pop(G.eq('7 − 3 = 4', '#dc2626'), 1.8), S.pop(G.eq('7 − 4 = 3', '#dc2626'), 2.5)), S.sub('Pluss og minus hører sammen: en regnefamilie', 3.5)),
    no:'Pluss og minus hører sammen. Tre pluss fire er sju. Fire pluss tre er sju. Sju minus tre er fire. Sju minus fire er tre. Disse fire regnestykkene kalles en regnefamilie. De bruker de samme tre tallene.'},
   {html:sc(S.row(S.pop(G.eq('5 − 0 = 5', '#6b7280'), .2), S.pop(G.eq('5 − 5 = 0', '#6b7280'), 1.2)), S.sub('Nå øver vi!', 2.4)),
    no:'Hvis vi tar bort null, er alt igjen: fem minus null er fem. Tar vi bort alt, er det null igjen: fem minus fem er null. Nå skal du øve på å trekke fra!'}
  ],
  tekst:{
   mal:'Du skal forstå hva det vil si å <b>trekke fra</b> (subtraksjon), på tre måter: <b>ta bort</b>, <b>sammenligne</b> («hvor mange flere?») og <b>hva mangler?</b>.',
   steg:['Ta bort: start med hele mengden, ta bort så mange du skal – det som er igjen er svaret.', 'Sammenligne: sett to mengder ved siden av hverandre – differansen er hvor mange flere.', 'Hva mangler? 4 + ? = 7 er det samme som 7 − 4.', 'Sjekk: svaret + det du tok bort = det du startet med.'],
   eks:[takePic(6, 2, '🍪') + '<br><b>6 − 2 = 4</b>', 'Regnefamilie: 3 + 4 = 7 · 4 + 3 = 7 · 7 − 3 = 4 · 7 − 4 = 3'],
   ord:[['subtraksjon', 'å trekke fra'], ['minus (−)', 'ta bort'], ['differanse', 'svaret på et minusstykke; forskjellen'], ['regnefamilie', 'fire regnestykker med de samme tre tallene']],
   feil:['«5 − 2 = 7» – minus betyr å ta bort, så svaret blir mindre.', '«2 − 5 er det samme som 5 − 2» – nei, i minus er rekkefølgen viktig.'],
   laerer:'Subtraksjon har tre betydninger: ta bort, sammenligne (differanse) og komplement (hva mangler). Alle tre trengs for å løse problemer (KM13234). Regnefamilien viser at addisjon og subtraksjon henger sammen, noe som gjør det lettere å kontrollere svar.'
  },
  refleksjon:'Fortell en historie som passer til 8 − 3 = 5.',
  nivaaer:[
   {t:'Forstå: hva betyr å trekke fra?', d:'Sjekk at du har forstått subtraksjon.', kind:'forstaa', make:(r, i) => {
     const a = int(r, 5, 9), b = int(r, 2, 4), k = i % 6, n = pick(r, MT.NAMES);
     if(k === 0) return Q.choice(r, 'Hva betyr tegnet <b>−</b>?', 'Ta bort', ['Legge sammen', 'Er lik', 'Mange'], {expl:'Minus betyr å ta bort (trekke fra).'});
     if(k === 1) return Q.choice(r, `${n} har ${a} kuler og gir bort ${b}. Skal du legge til eller ta bort?`, 'Ta bort', ['Legge til'], {keep:true, expl:'Kulene blir borte, så vi tar bort.'});
     if(k === 2) return Q.num(`3 + 4 = 7. Hva er 7 − 3? {?}`, 4, {say:'Tre pluss fire er sju. Hva er sju minus tre?', calc:'7-3', expl:'Regnefamilie: 3 + 4 = 7, så 7 − 3 = 4 og 7 − 4 = 3.'});
     if(k === 3) return Q.yn('Er 5 − 2 det samme som 2 − 5?', false, {expl:'Nei. Du kan ikke ta bort 5 fra 2. I minus er rekkefølgen viktig.'});
     if(k === 4) return Q.choice(r, 'Hva kalles svaret på et minusstykke?', 'Differansen', ['Summen', 'Tallordet', 'Tieren'], {expl:'Svaret på en subtraksjon kalles differansen.'});
     return Q.num(`${a} − ${a} = {?}`, 0, {calc:`${a}-${a}`, expl:'Tar du bort alt, er det null igjen.'});
   }},
   {t:'Ta bort (til 10)', d:'Bilder: hvor mange er igjen?', n:10, make:(r, i) => {
     const a = int(r, 3, 10), b = int(r, 1, a - 1), e = pick(r, MT.THINGS)[0];
     return (i % 2 ? Q.num : (x, y, o) => Q.near(r, x, y, o))(`${takePic(a, b, e)}<br>Hvor mange er <b>igjen</b> når du tar bort de som er krysset ut? {?}`, a - b, {say:'Hvor mange er igjen når du tar bort de som er krysset ut?', calc:`${a}-${b}`, expl:`${a} − ${b} = ${a - b}.`});
   }},
   {t:'Trekke fra (til 10)', d:'Minusstykker med tall til 10.', n:10, make:(r, i) => {
     const a = int(r, 3, 10), b = int(r, 0, a), k = i % 3;
     return Q.num(`${k === 0 ? G.frame(a, 0, {s:24, cross:b}) + '<br>' : ''}${a} − ${b} = {?}`, a - b, {calc:`${a}-${b}`, expl:`${a} − ${b} = ${a - b}.`, hint:G.frame(a, 0, {s:24, cross:b})});
   }},
   {t:'Hvor mange flere?', d:'Sammenlign mengder og finn forskjellen.', n:10, make:(r, i) => {
     const a = int(r, 4, 10), b = int(r, 1, a - 1), n = pick(r, MT.NAMES), m = pick(r, MT.NAMES.filter(x => x !== n)), k = i % 2;
     if(k === 0) return Q.num(`${G.frame(a, 0, {s:20})} &nbsp; ${G.frame(b, 0, {s:20})}<br>Hvor mange flere prikker er det i den første rammen? {?}`, a - b, {say:'Hvor mange flere prikker er det i den første rammen?', calc:`${a}-${b}`, expl:`${a} − ${b} = ${a - b}.`});
     return Q.num(`${n} har ${a} klistremerker. ${m} har ${b}. Hvor mange flere har ${n}? {?}`, a - b, {say:`${n} har ${a} klistremerker. ${m} har ${b}. Hvor mange flere har ${n}?`, calc:`${a}-${b}`, expl:`${a} − ${b} = ${a - b}.`, hint:G.bar(a, b, a - b, {w:260, q:1})});
   }},
   {t:'Regnefamilier', d:'Pluss og minus hører sammen.', n:10, make:(r, i) => {
     const a = int(r, 1, 8), b = int(r, 1, 9 - a), s = a + b, k = i % 4;
     if(k === 0) return Q.num(`${a} + ${b} = ${s}. Hva er ${s} − ${a}? {?}`, b, {say:`${a} pluss ${b} er ${s}. Hva er ${s} minus ${a}?`, calc:`${s}-${a}`, expl:`Regnefamilie: ${s} − ${a} = ${b}.`});
     if(k === 1) return Q.num(`${a} + ${b} = ${s}. Hva er ${s} − ${b}? {?}`, a, {say:`${a} pluss ${b} er ${s}. Hva er ${s} minus ${b}?`, calc:`${s}-${b}`, expl:`Regnefamilie: ${s} − ${b} = ${a}.`});
     if(k === 2) return Q.num(`${a} + {?} = ${s}, så ${s} − ${a} = ${b}`, b, {say:`${a} pluss hva er ${s}?`, chk:`${a}+_===${s}`, expl:`${a} + ${b} = ${s}.`});
     return Q.num(`${G.bar(s, a, b, {w:260, q:1})}<br>${s} − ${a} = {?}`, b, {say:`${s} minus ${a}`, calc:`${s}-${a}`, expl:`Hele er ${s}, den ene delen er ${a}, resten er ${b}.`});
   }}
  ]
});

/* ======================================================================
   L1. Likhetstegnet
   ====================================================================== */
const bal = (l, r, lv, rv) => G.balance(l, r, lv, rv);
MT.module({
  id:'likhetstegn', rek:36, trinn:[1, 2], maal:['KM13242'], tittel:'Likhetstegnet: begge sider er like mye', ikon:'⚖️', bygger:['legge-sammen', 'trekke-fra'],
  video:[
   {html:title('⚖️', 'Likhetstegnet', S.sub('Begge sider er like mye', 1.2)),
    no:'Nå skal vi se nærmere på likhetstegnet. Mange tror at det betyr svaret kommer nå. Men det betyr noe annet og mye viktigere.'},
   {html:sc(S.pop(bal('3 + 4', '7', 7, 7), .2), S.sub('= betyr: det er like mye på begge sider', 1.6)),
    no:'Se på denne vekta. På venstre side ligger tre pluss fire. På høyre side ligger sju. Vekta står i ro, for det er like mye på begge sider. Det er det likhetstegnet betyr: like mye på begge sider.'},
   {html:sc(S.row(S.big('3 + 4 = 7', .2), S.big('7 = 3 + 4', 1.4)), S.sub('Begge er riktige!', 2.6)),
    no:'Derfor kan vi skrive tre pluss fire er lik sju. Men vi kan også skrive sju er lik tre pluss fire. Begge er riktige. Likhetstegnet er ikke en pil som sier svaret kommer her.'},
   {html:sc(S.pop(bal('3 + 4', '5 + 2', 7, 7), .2), S.big('3 + 4 = 5 + 2', 1.4), S.sub('To ulike regnestykker med samme verdi', 2.4)),
    no:'Begge sider kan være regnestykker. Tre pluss fire er sju. Fem pluss to er også sju. Så tre pluss fire er lik fem pluss to. Det er like mye på begge sider.'},
   {html:sc(S.pop(bal('3 + 4', '5 + 3', 7, 8), .2), S.big('3 + 4 ≠ 5 + 3', 1.4), S.sub('Ikke like mye: vekta heller', 2.4)),
    no:'Hva hvis det ikke er like mye? Tre pluss fire er sju. Fem pluss tre er åtte. Da heller vekta. Sidene er ikke like, og da kan vi ikke bruke likhetstegnet. Vi skriver et strek over likhetstegnet.'},
   {html:sc(S.pop(bal('3 + 4', '5 + ?', 7, 7), .2), S.big('3 + 4 = 5 + ?', 1.4), S.sub('7 = 5 + 2, så ? er 2', 2.4)),
    no:'Nå kan vi finne tall som mangler. Tre pluss fire er lik fem pluss hva? Venstre side er sju. Høyre side må også bli sju. Fem pluss to er sju. Det som mangler er to.'},
   {html:sc(S.row(S.pop(G.eq('=', '#2563eb'), .2)), S.big('like mye på begge sider', 1), S.sub('Nå øver vi!', 2)),
    no:'Husk: Likhetstegnet betyr at det er like mye på begge sider. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal bruke likhetstegnet (=) riktig: det viser at to uttrykk har <b>samme verdi</b>, altså er like mye.',
   steg:['Regn ut verdien til venstre side.', 'Regn ut verdien til høyre side.', 'Er verdiene like? Da kan du skrive =. Ellers: ≠ (ikke lik).', 'Mangler et tall? Finn tallet som gjør at begge sider får samme verdi.'],
   eks:[bal('3 + 4', '5 + 2', 7, 7) + '<br>3 + 4 = 5 + 2', '8 = 5 + 3 &nbsp; (tallet kan stå først)', '4 + 5 = 6 + <b>3</b>'],
   ord:[['likhetstegn (=)', 'viser at begge sider er like mye verdt'], ['uttrykk', 'tall eller regnestykke, for eksempel 3 + 4'], ['verdi', 'hva uttrykket er verdt, for eksempel verdien av 3 + 4 er 7']],
   feil:['«3 + 4 = 7 + 2» (jeg skriver videre) – nei: 3 + 4 er 7, ikke 9. Likhetstegnet sier «like mye».', '«8 = 5 + 3 er galt fordi svaret står først» – det er riktig: begge sider er 8.'],
   laerer:'KM13242: likhetstegnet som relasjon (ikke «gjør dette»-signal). Typiske misoppfatninger: «=» som «og svaret er». Bruk balansevekt, snu likninger (7 = 3 + 4), uttrykk på begge sider (3 + 4 = 5 + 2) og manglende ledd (8 + ? = 5 + 6).'
  },
  refleksjon:'Hva betyr likhetstegnet? Forklar med vekta.',
  nivaaer:[
   {t:'Forstå: hva betyr =?', d:'Sjekk at du har forstått likhetstegnet.', kind:'forstaa', make:(r, i) => {
     const a = int(r, 2, 6), b = int(r, 2, 6), k = i % 5;
     if(k === 0) return Q.choice(r, 'Hva betyr likhetstegnet <b>=</b>?', 'Det er like mye på begge sider', ['Svaret kommer nå', 'Legg sammen', 'Ta bort'], {expl:'Likhetstegnet viser at begge sider har samme verdi.'});
     if(k === 1) return Q.yn(`Er <b>${a + b} = ${a} + ${b}</b> riktig?`, true, {expl:`Ja, begge sider er ${a + b}.`});
     if(k === 2) return Q.yn(`Er <b>${a} + ${b} = ${a + b + 1}</b> riktig?`, false, {expl:`${a} + ${b} er ${a + b}, ikke ${a + b + 1}.`});
     if(k === 3) return Q.yn(`Kan vi skrive tallet først og regnestykket etterpå, for eksempel <b>${a + b} = ${a} + ${b}</b>?`, true, {say:`Kan vi skrive tallet først og regnestykket etterpå?`, expl:'Ja. Likhetstegnet virker begge veier.'});
     return Q.yn(`Er <b>${a} + ${b} = ${b} + ${a}</b> riktig?`, true, {expl:`Begge sider er ${a + b}.`});
   }},
   {t:'Sant eller usant?', d:'Er begge sider like mye?', n:10, make:(r, i) => {
     const a = int(r, 1, 9), b = int(r, 1, 9), c = int(r, 1, 9), d = a + b - c, ok = r() < .5, forms = i % 3;
     let L, R, truth;
     if(forms === 0){ L = `${a} + ${b}`; R = ok ? `${a + b}` : `${a + b + pick(r, [-1, 1, 2])}`; }
     else if(forms === 1){ L = `${a + b}`; R = ok ? `${a} + ${b}` : `${a} + ${b + pick(r, [1, 2])}`; }
     else { const c2 = int(r, 1, a + b - 1); L = `${a} + ${b}`; R = ok ? `${c2} + ${a + b - c2}` : `${c2} + ${a + b - c2 + pick(r, [1, 2])}`; }
     const vL = eval(L), vR = eval(R);
     return Q.choice(r, `Er det riktig? &nbsp; <b>${L} = ${R}</b>`, vL === vR ? 'Sant' : 'Usant', ['Sant', 'Usant'], {keep:true, say:`Er det riktig? ${L.replace('+', 'pluss')} er lik ${R.replace('+', 'pluss')}`, expl:`Venstre side er ${vL}. Høyre side er ${vR}. ${vL === vR ? 'Like mye, så det er sant.' : 'Ikke like mye, så det er usant.'}`, hint:bal(L, R, vL, vR)});
   }},
   {t:'Begge sider', d:'Finn tallet som gjør begge sider like.', n:10, make:(r, i) => {
     const a = int(r, 1, 8), b = int(r, 1, 8), c = int(r, 1, a + b - 1), d = a + b - c;
     return Q.num(`${a} + ${b} = ${c} + {?}`, d, {chk:`${c}+_===${a + b}`, say:`${a} pluss ${b} er lik ${c} pluss hva?`, expl:`Venstre side er ${a + b}. ${c} + ${d} = ${a + b}.`, hint:bal(`${a} + ${b}`, `${c} + ?`, a + b, a + b)});
   }},
   {t:'Snu og regn', d:'Tallet står først, eller ukjent på venstre side.', n:10, make:(r, i) => {
     const a = int(r, 1, 9), b = int(r, 1, 9), s = a + b, k = i % 4;
     if(k === 0) return Q.num(`${s} = ${a} + {?}`, b, {chk:`${a}+_===${s}`, expl:`${a} + ${b} = ${s}.`});
     if(k === 1) return Q.num(`{?} = ${a} + ${b}`, s, {calc:`${a}+${b}`, expl:`${a} + ${b} = ${s}.`});
     if(k === 2) return Q.num(`{?} + ${b} = ${s}`, a, {chk:`_+${b}===${s}`, expl:`${s} − ${b} = ${a}.`});
     return Q.num(`${s + 2} − {?} = ${s}`, 2, {chk:`${s + 2}-_===${s}`, expl:`${s + 2} − 2 = ${s}.`});
   }},
   {t:'Større, mindre eller lik', d:'Sammenlign to uttrykk.', n:10, make:(r, i) => {
     const a = int(r, 1, 9), b = int(r, 1, 9), c = int(r, 1, 9), d = int(r, 1, 9), vL = a + b, vR = c + d;
     if(i % 2) return Q.choice(r, `Hvilket tegn passer? &nbsp; <b>${a} + ${b} ○ ${c} + ${d}</b>`, vL > vR ? '>' : vL < vR ? '<' : '=', ['>', '<', '='], {keep:true, say:`Er ${a} pluss ${b} større, mindre eller lik ${c} pluss ${d}?`, expl:`Venstre: ${vL}. Høyre: ${vR}.`});
     const ans = `${c} + ${a + b - c}`; const o = [`${c} + ${a + b - c + 1}`, `${c + 1} + ${a + b - c + 1}`, `${a + b - c} + ${c + 2}`]; const cc = int(r, 1, a + b - 1);
     return Q.choice(r, `Hvilket uttrykk er like mye som <b>${a} + ${b}</b>?`, `${cc} + ${a + b - cc}`, [`${cc} + ${a + b - cc + 1}`, `${cc + 1} + ${a + b - cc + 1}`, `${cc} + ${a + b - cc - 1}`].filter(x => eval(x) !== a + b), {say:`Hvilket uttrykk er like mye som ${a} pluss ${b}?`, expl:`${a} + ${b} = ${a + b}, og ${cc} + ${a + b - cc} = ${a + b}.`});
   }}
  ]
});
})();
