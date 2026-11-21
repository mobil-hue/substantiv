(function(){
'use strict';
/* Moduler: posisjonssystemet og tallrekka (KM13241, KM13232) */
const A = window.App, MT = window.MT, G = MT.G, Q = MT.Q, S = MT.S, B = MT.B;
const {int, pick, shuf} = MT, {sc, pop, fade, big, sub, row, chip, title} = S;
const NO = n => A.N.no(n);
const W19 = ['elleve', 'tolv', 'tretten', 'fjorten', 'femten', 'seksten', 'sytten', 'atten', 'nitten'];
const T10 = ['', '', 'tjue', 'tretti', 'førti', 'femti', 'seksti', 'sytti', 'åtti', 'nitti'];
const E1 = ['', 'en', 'to', 'tre', 'fire', 'fem', 'seks', 'sju', 'åtte', 'ni'];
const word = n => n === 0 ? 'null' : n === 10 ? 'ti' : n < 10 ? ['', 'én', 'to', 'tre', 'fire', 'fem', 'seks', 'sju', 'åtte', 'ni'][n] : n < 20 ? W19[n - 11] : n === 100 ? 'hundre' : T10[Math.floor(n / 10)] + E1[n % 10];
MT.word = word;
const dig = (r, n, ex) => { const s = new Set(); const o = []; for(let k = 0; k < 60 && o.length < 3; k++){ const x = ex ? ex(r) : n + int(r, -12, 12); if(x > 0 && x !== n && x <= 100 && !s.has(x)){ s.add(x); o.push(x); } } return o; };
const swapd = n => +String(n).split('').reverse().join('');

/* ======================================================================
   2. Tall 11–20
   ====================================================================== */
MT.module({
  id:'tall-11-20', rek:20, trinn:[1], maal:['KM13241', 'KM13232'], tittel:'Tall 11–20: ti og litt til', ikon:'🔟', bygger:['mengde-10'],
  video:[
   {html:title('🔟', 'Tallene fra 11 til 20', S.sub('Ti og litt til', 1.2)),
    no:'Nå skal vi lære tallene fra elleve til tjue. Det er tallene som er ti og litt til. Du kan allerede tallene til ti. Nå går vi videre.'},
   {html:sc(S.pop(G.frame(10, 0, {s:36}), .2), S.big('10', 1.4), S.sub('En full tierramme', 2.4)),
    no:'Her er en full tierramme. Ti ruter er fylt. Ti prikker. Når vi har ti, har vi en hel tier. Det er viktig å huske!'},
   {html:sc(S.pop(G.frame(10, 4, {s:36}), .2), S.row(S.big('10 + 4 = 14', 1.6)), S.sub('En tier og fire enere', 2.8)),
    no:'Nå legger vi til fire prikker. En full tierramme og fire til. Ti og fire er fjorten. Fjorten er en tier og fire enere.'},
   {html:sc(S.row(S.pop(G.blocks({t:1, e:4}, {u:9}), .2), S.pop(G.pv({t:1, e:4}), 1.4)), S.sub('1 tier · 4 enere → 14', 2.8)),
    no:'Vi kan tegne det slik. En stav er en tier, og de små klossene er enere. Tallet fjorten skrives med to sifre. Ettallet foran betyr én tier. Firetallet bak betyr fire enere.'},
   {html:sc(G.chips([11, 12, 13, 14, 15, 16, 17, 18, 19], {c:'#3b82f6'}), S.row(...W19.map((w, i) => S.chip(w, '#f97316', 1 + i * .55)))),
    no:'Tallordene må vi lære. Elleve. Tolv. Tretten. Fjorten. Femten. Seksten. Sytten. Atten. Nitten. Elleve og tolv er helt spesielle. Fra tretten ender ordene på ten, som betyr ti.'},
   {html:sc(S.row(S.pop(G.frame(10, 7, {s:30}), .2), S.pop(G.frame(10, 10, {s:30}), 1.4)), S.sub('17 = 10 + 7 · 20 = to tiere', 2.8)),
    no:'Sytten er ti og sju. Og når vi fyller opp enda en tierramme, har vi to tiere. To tiere er tjue.'},
   {html:sc(G.nline(10, 20, {marks:[{v:10, label:'10'}, {v:15, label:'', c:'#3b82f6'}], w:600}), S.sub('Tallene står på rekke: 10, 11, 12 … 19, 20', 1.4)),
    no:'Tallene står på rekke på tallinjen. Ti, elleve, tolv, helt til tjue. Hvert tall er én mer enn tallet før.'},
   {html:sc(S.row(S.pop(G.frame(10, 6, {s:28}), .2)), S.big('16 = 10 + 6', 1.2), S.sub('Nå øver vi!', 2.2)),
    no:'Nå vet du at tallene fra elleve til nitten er ti og litt til. Seksten er ti og seks. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal kunne telle, lese, skrive og vise tallene 11–20, og forstå at for eksempel 14 er <b>1 tier og 4 enere</b>.',
   steg:['Fyll en tierramme med ti. Det er <b>1 tier</b>.', 'Resten er <b>enere</b>: 10 og 4 er 14.', 'Skriv tallet med to sifre: tieren først (1), så enerne (4).', 'Lær tallordene: elleve, tolv, tretten, fjorten, femten, seksten, sytten, atten, nitten, tjue.'],
   eks:[G.frame(10, 4, {s:24}) + ' <b>14</b> = 10 + 4 = 1 tier og 4 enere = fjorten', G.pv({t:1, e:7})],
   ord:[['tier', 'ti ting samlet i én gruppe'], ['ener', 'en enkelt ting som ikke er i en tier'], ['sifferet', 'tegnet vi skriver et tall med, 0–9']],
   feil:['«Femten skrives 51» – tieren kommer først: 1 tier og 5 enere er 15.', '«Tolv er 102» – tolv er ti og to: 12.'],
   laerer:'Her begynner posisjonssystemet (KM13232): vi bygger bro mellom tierrammen (10 + litt), konkretene (en tier-stav og enere) og tosifrede tall. Vær tydelig på at tallordene elleve og tolv er uregelmessige, og at tretten–nitten kommer av «tre-ten» osv. Mange barn skriver tall baklengs (51 for 15) fordi de skriver slik vi sier tallordene i andre språk – la dem bygge tallet med tier og enere først.'
  },
  refleksjon:'Hvorfor er 14 «ti og fire»? Forklar med en tierramme.',
  nivaaer:[
   {t:'Forstå: ti og litt til', d:'Sjekk at du har forstått tier og ener.', kind:'forstaa', make:(r, i) => {
     const n = int(r, 11, 19), k = i % 4;
     if(k === 0) return Q.choice(r, `Hva betyr tallet <b>${n}</b>?`, `1 tier og ${MT.e1(n - 10)}`, [`${MT.t1(n - 10)} og 1 ener`, `1 tier og ${MT.e1(n)}`, `${MT.t1(n)}`], {keep:false, say:`Hva betyr tallet ${n}?`, expl:`${n} er ti og ${n - 10}: 1 tier og ${MT.e1(n - 10)}.`});
     if(k === 1) return Q.near(r, `Her er 1 full tierramme og ${n - 10} prikker til.<br>${G.frame(10, n - 10, {s:24})}<br>Hvilket tall er det?`, n, {say:`En full tierramme og ${n - 10} prikker til. Hvilket tall er det?`, expl:`10 og ${n - 10} er ${n}.`});
     if(k === 2) return Q.num(`I tallet <b>${n}</b>: hvor mange tiere er det? {?}`, 1, {say:`I tallet ${n}: hvor mange tiere er det?`, expl:`Alle tall fra 10 til 19 har 1 tier.`});
     return Q.yn(`Er 10 + ${n - 10} det samme som ${n}?`, true, {expl:`Ja. Ti og ${n - 10} er ${n}.`});
   }},
   {t:'Tell 11–20', d:'Tell mengder og skriv tallet.', n:10, make:(r, i) => {
     const n = int(r, 11, 20), k = i % 3, t = pick(r, MT.THINGS);
     const stem = k === 0 ? G.frame(Math.min(10, n), Math.max(0, n - 10), {s:24, frames:2}) : k === 1 ? G.objs(t[0], n, {per:10, s:'1.6rem'}) : G.scatter(t[0], n, int(r, 1, 9999), {w:320, h:130, s:30});
     return (i % 2 ? Q.num : (a, b, o) => Q.near(r, a, b, o))(`${stem}<br>Hvor mange er det? {?}`, n, {say:'Hvor mange er det?', expl:`${n} er 10 og ${n - 10}.`, hint:G.frame(10, n - 10, {s:24}) + '<br>Fyll først en tierramme (10). Tell så resten.'});
   }},
   {t:'Tallord og tegn 11–20', d:'Oversett mellom tallord og tall.', n:10, make:(r, i) => {
     const n = int(r, 11, 20), k = i % 4, w = word(n), o = dig(r, n, rr => int(rr, 10, 20));
     if(k === 0) return Q.choice(r, `Hvilket tall er <b>${w}</b>?`, n, o, {sort:true, nums:true, say:`Hvilket tall er ${w}?`, expl:`${w} = ${n}.`});
     if(k === 1) return Q.choice(r, `Hva heter <b>${n}</b>?`, w, o.map(word), {say:`Hva heter ${n}?`, expl:`${n} heter ${w}.`});
     if(k === 2) return Q.num(`Skriv tallet: <b>${w}</b> = {?}`, n, {say:`Skriv tallet: ${w}`, expl:`${w} = ${n}.`});
     return Q.choice(r, `Hvilken tegning viser <b>${w}</b>?`, G.frame(10, n - 10, {s:15}), o.slice(0, 2).map(x => G.frame(10, x - 10, {s:15})), {say:`Hvilken tegning viser ${w}?`, key:`tegningen med ${n} prikker`, expl:`${w} er ${n}: en full tierramme og ${n - 10} til.`});
   }},
   {t:'Ti og litt til', d:'Del tallene i tier og ener.', n:10, make:(r, i) => {
     const n = int(r, 11, 19), k = i % 4;
     if(k === 0) return Q.num(`10 + ${n - 10} = {?}`, n, {calc:`10+${n - 10}`, expl:`Ti og ${n - 10} er ${n}.`});
     if(k === 1) return Q.num(`${n} = 10 + {?}`, n - 10, {expl:`${n} er ti og ${n - 10}.`});
     if(k === 2) return Q.num(`${G.blocks({t:1, e:n - 10}, {u:7})}<br>Hvilket tall viser tegningen? {?}`, n, {say:'Hvilket tall viser tegningen?', expl:`1 tier og ${MT.e1(n - 10)} er ${n}.`});
     return Q.num(`I tallet ${n}: hvor mange enere er det <b>utenom</b> tieren? {?}`, n - 10, {say:`I tallet ${n}: hvor mange enere er det utenom tieren?`, expl:`${n} − 10 = ${n - 10}.`});
   }}
  ]
});

/* ======================================================================
   3. Tiere og enere (posisjonssystemet, 21–99)
   ====================================================================== */
MT.module({
  id:'tiere-enere', rek:40, trinn:[1, 2], maal:['KM13232', 'KM13241'], tittel:'Tiere og enere: plassen bestemmer verdien', ikon:'🧱', bygger:['tall-11-20'],
  video:[
   {html:title('🧱', 'Tiere og enere', S.sub('Plassen bestemmer verdien', 1.2)),
    no:'Nå skal vi forstå hvordan tall bygges opp. Det kalles posisjonssystemet. Det er den store ideen som gjør at vi kan skrive alle tall med bare ti sifre.'},
   {html:sc(S.pop(G.objs('🟡', 34, {per:10, s:'1.3rem'}), .2), S.sub('Mange ting er vanskelige å telle', 1.4)),
    no:'Her er mange gule kuler. Det er vanskelig å telle dem ett og ett. Da pakker vi dem i grupper på ti. Ti og ti og ti.'},
   {html:sc(S.row(S.pop(G.blocks({t:3, e:4}, {u:9}), .2)), S.pop(S.row(G.eq('3 tiere', '#2563eb'), G.eq('4 enere', '#16a34a')), 1.6), S.big('34', 3, '#ffe27a')),
    no:'Tre tiere og fire enere. Det er tre ganger ti og fire. Tre tiere er tretti. Og fire enere er fire. Tretti og fire er trettifire. Det skriver vi 34.'},
   {html:sc(S.pop(G.pv({t:3, e:4}), .2), S.big('30 + 4 = 34', 1.8), S.sub('Sifferet 3 står på tierplassen, så det betyr 30', 3)),
    no:'Sifferet har ulik verdi etter hvilken plass det står på. Tre på tierplassen betyr tretti. Fire på enerplassen betyr bare fire. Plassen bestemmer verdien.'},
   {html:sc(S.row(S.pop(G.blocks({t:3, e:4}, {u:6}), .2), S.pop('<span style="font-size:2rem;font-weight:900">≠</span>', 1), S.pop(G.blocks({t:4, e:3}, {u:6}), 1.4)), S.row(S.big('34', 2.4), S.big('43', 3)), S.sub('Samme sifre – ulik plass – ulikt tall', 3.6)),
    no:'Tretti-fire og førti-tre har de samme sifrene, men sifrene står på ulike plasser. Derfor er det helt forskjellige tall. Trettifire er mindre enn førtitre.'},
   {html:sc(S.row(S.pop(G.blocks({t:3, e:0}, {u:9}), .2), S.pop(G.pv({t:3, e:0}), 1.2)), S.sub('0 enere: nullen holder enerplassen', 2.4)),
    no:'Tretti er tre tiere og null enere. Nullen er viktig. Den holder plassen på enerplassen, slik at treeren blir stående på tierplassen. Uten null ville det blitt 3.'},
   {html:sc(S.row(S.pop(G.objs('🟡', 13, {per:10, s:'1.1rem'}), .2)), S.row(S.pop('<span style="font-size:2rem;font-weight:900">➡️</span>', 1.2), S.pop(G.blocks({t:1, e:3}, {u:8}), 1.8)), S.sub('Ti enere kan veksles til én tier', 2.8)),
    no:'Tretten enere kan vi pakke om. Ti enere blir til én tier. Da har vi én tier og tre enere. Det er det samme tallet. Dette kalles å veksle, og det kommer vi til å bruke mye når vi regner.'},
   {html:sc(G.chips([2, 3, 4, 5, 6, 7, 8, 9].map(x => x * 10), {c:'#2563eb'}), S.sub('20, 30, 40 … 90: tiere uten enere', 1.6)),
    no:'Tiere uten enere er tjue, tretti, førti, femti, seksti, sytti, åtti og nitti. Nå skal du øve på tiere og enere!'}
  ],
  tekst:{
   mal:'Du skal forstå at et tosifret tall er bygd av <b>tiere</b> og <b>enere</b>, at <b>plassen</b> til et siffer bestemmer verdien, og at ti enere kan <b>veksles</b> til én tier.',
   steg:['Pakk tingene i grupper på ti. Hver gruppe er en <b>tier</b>.', 'Det som blir til overs, er <b>enere</b>.', 'Skriv tieren først og enerne sist: 3 tiere og 4 enere = <b>34</b>.', 'Sifferet til venstre er tiere (verdi 10 hver), sifferet til høyre er enere (verdi 1 hver).', 'Har du 10 enere eller flere, kan du veksle ti av dem til en ny tier.'],
   eks:[G.blocks({t:4, e:7}, {u:7}) + '<br>4 tiere og 7 enere = 40 + 7 = <b>47</b>', G.pv({t:6, e:0}) + '<br>60 = 6 tiere og 0 enere', '23 enere = 2 tiere og 3 enere'],
   ord:[['posisjonssystemet', 'systemet der plassen til sifferet bestemmer verdien'], ['tierplassen', 'sifferet til venstre: hvor mange tiere'], ['enerplassen', 'sifferet til høyre: hvor mange enere'], ['veksle', 'bytte ti enere mot én tier (eller omvendt)']],
   feil:['«43 og 34 er det samme tallet fordi sifrene er like» – plassen avgjør: 43 = 4 tiere og 3 enere, 34 = 3 tiere og 4 enere.', '«Tretti er 3» – nullen holder enerplassen: 30 er 3 tiere og 0 enere.', '«4 tiere og 7 enere er 4 + 7 = 11» – tierne er 40, ikke 4: 40 + 7 = 47.'],
   laerer:'Dette er kjernen i KM13232. La barna bygge og pakke konkreter (kuler, tier-staver) og oversette mellom konkreter, tegning, plasstabell, tallord og tallsymbol. Den vanligste misforståelsen er å se tosifrede tall som to enkelttall side om side. Veksling (10 enere ↔ 1 tier) forberedes her og brukes direkte i addisjon og subtraksjon med veksling senere.'
  },
  refleksjon:'Forklar hvorfor 34 og 43 ikke er det samme tallet, selv om sifrene er like.',
  nivaaer:[
   {t:'Forstå: plassen bestemmer verdien', d:'Sjekk at du har forstått tiere og enere.', kind:'forstaa', make:(r, i) => {
     const t = int(r, 2, 9), e = int(r, 1, 9), n = t * 10 + e, k = i % 5;
     if(k === 0) return Q.choice(r, `I tallet <b>${n}</b>: hva betyr sifferet ${t}?`, `${MT.t1(t)} (${t * 10})`, [`${MT.e1(t)}`, `${t * 100}`, `${MT.t1(e)}`], {keep:false, say:`I tallet ${n}: hva betyr sifferet ${t}?`, expl:`${t} står på tierplassen, så det betyr ${MT.t1(t)}, altså ${t * 10}.`});
     if(k === 1) return Q.yn(`Er <b>${n}</b> og <b>${swapd(n)}</b> det samme tallet?`, false, {expl:`Nei. ${n} = ${MT.te(t, e)}. ${swapd(n)} = ${MT.te(e, t)}.`});
     if(k === 2) return Q.choice(r, `Hva gjør nullen i <b>${t * 10}</b>?`, 'Den holder enerplassen', ['Den betyr ti til', 'Den gjør tallet mindre', 'Den kan fjernes'], {say:`Hva gjør nullen i ${t * 10}?`, expl:`Nullen sier at det er 0 enere og holder plassen, så ${t} blir stående på tierplassen.`});
     if(k === 3) return Q.num(`Hvor mange tiere kan du pakke av ${t * 10 + e} kuler? {?}`, t, {say:`Hvor mange tiere kan du pakke av ${t * 10 + e} kuler?`, expl:`${t * 10 + e} = ${MT.te(t, e)}.`});
     return Q.yn(`Kan 10 enere byttes mot 1 tier?`, true, {expl:'Ja! Ti enere er like mye verdt som én tier. Det kalles å veksle.'});
   }},
   {t:'Klosser til tall', d:'Hvilket tall viser tegningen?', n:10, make:(r, i) => {
     const t = int(r, 1, 9), e = i % 4 === 0 ? 0 : int(r, 0, 9), n = t * 10 + e;
     return (i % 2 ? Q.num : (a, b, o) => Q.near(r, a, b, o))(`${G.blocks({t, e}, {u:6})}<br>Hvilket tall viser tegningen? {?}`, n, {say:'Hvilket tall viser tegningen?', expl:`${MT.te(t, e)}: ${t * 10} + ${e} = ${n}.`, hint:`Tell tierne først (hver er 10), så enerne.`});
   }},
   {t:'Tall til tiere og enere', d:'Del tallet i tiere og enere.', n:10, make:(r, i) => {
     const t = int(r, 1, 9), e = int(r, 0, 9), n = t * 10 + e, k = i % 4;
     if(k === 0) return Q.num(`${n} = {?} tiere og ${MT.e1(e)}`, t, {say:`${n} er hvor mange tiere og ${MT.e1(e)}?`, expl:`${n} har ${MT.t1(t)}.`});
     if(k === 1) return Q.num(`${n} = ${MT.t1(t)} og {?} enere`, e, {say:`${n} er ${MT.t1(t)} og hvor mange enere?`, expl:`${n} har ${MT.e1(e)}.`});
     if(k === 2) return Q.choice(r, `Hvilket siffer står på <b>tierplassen</b> i ${n}?`, t, [e, t + 1 > 9 ? 1 : t + 1, (t + 3) % 9 + 1].filter(x => x !== t), {sort:true, nums:true, say:`Hvilket siffer står på tierplassen i ${n}?`, expl:`I ${n} er tierplassen til venstre: ${t}.`});
     return Q.choice(r, `Hvilket siffer står på <b>enerplassen</b> i ${n}?`, e, [t, (e + 2) % 10, (e + 5) % 10].filter(x => x !== e), {sort:true, nums:true, say:`Hvilket siffer står på enerplassen i ${n}?`, expl:`I ${n} er enerplassen til høyre: ${e}.`});
   }},
   {t:'Bygg tallet', d:'Skriv tallet ut fra tiere, enere og utvidet form.', n:10, make:(r, i) => {
     const t = int(r, 1, 9), e = int(r, 0, 9), n = t * 10 + e, k = i % 4;
     if(k === 0) return Q.num(`${MT.te(t, e)} = {?}`, n, {calc:`${t}*10+${e}`, expl:`${MT.t1(t)} er ${t * 10}. ${t * 10} + ${e} = ${n}.`});
     if(k === 1) return Q.num(`${t * 10} + ${e} = {?}`, n, {calc:`${t * 10}+${e}`, expl:`${t * 10} og ${e} er ${n}.`});
     if(k === 2) return Q.num(`${n} = ${t * 10} + {?}`, e, {expl:`${n} − ${t * 10} = ${e}.`});
     return Q.num(`${G.pv({t:t, e:e})}<br>Hvilket tall? {?}`, n, {say:'Hvilket tall viser plasstabellen?', expl:`${MT.te(t, e)} er ${n}.`});
   }},
   {t:'Pakke og veksle', d:'Pakk om enere til tiere.', n:10, make:(r, i) => {
     const e = int(r, 11, 39), t = Math.floor(e / 10), rest = e % 10, k = i % 3;
     if(k === 0) return Q.num(`${G.objs('🟡', e, {per:10, s:'1rem'})}<br>Hvor mange tiere kan du pakke? {?}`, t, {say:`Hvor mange tiere kan du pakke av ${e}?`, expl:`${e} = ${MT.te(t, rest)}.`});
     if(k === 1) return Q.num(`Du har ${MT.e1(e)}. Hvor mange enere blir til overs når du har pakket så mange tiere som mulig? {?}`, rest, {say:`Du har ${MT.e1(e)}. Hvor mange enere blir til overs når du har pakket så mange tiere som mulig?`, expl:`${e} = ${MT.te(t, rest)}.`});
     return Q.choice(r, `Du har ${MT.e1(e)}. Veksler du ti enere mot en tier, hva har du da?`, `${MT.te(t, rest)}`, [`${MT.te(t + 1, rest)}`, `${MT.te(t, e)}`, `${MT.te(t - 1, rest + 10)}`].filter(x => x !== `${MT.te(t, rest)}`), {say:`Du har ${MT.e1(e)}. Veksler du så mange tiere du kan, hva har du da?`, expl:`${MT.e1(e)} = ${MT.te(t, rest)}.`});
   }}
  ]
});
})();
