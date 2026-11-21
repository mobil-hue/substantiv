(function(){
'use strict';
/* Moduler: problemløsing, regning over tiere, regneegenskaper og tallinje i regning (KM13234, KM13235, KM13233) */
const A = window.App, MT = window.MT, G = MT.G, Q = MT.Q, S = MT.S, B = MT.B;
const {int, pick, shuf} = MT, {sc, pop, fade, big, sub, row, chip, title} = S;
const range = (a, b) => Array.from({length:b - a + 1}, (_, i) => a + i);
const cnt = (n, t) => n === 1 ? '1 ' + t[2] : n + ' ' + t[1];
const hop = (a, op, b, o) => { const e = op === '+' ? a + b : a - b; return G.nline(Math.max(0, Math.min(a, e) - 1), Math.max(a, e) + 1, Object.assign({marks:[{v:a, label:a, c:'#16a34a'}], hops:[{a, b:e, label:(op === '+' ? '+' : '−') + b, c:op === '+' ? '#f97316' : '#dc2626'}], w:560}, o || {})); };
const two = (r, a) => { const x = pick(r, MT.NAMES); return [x, pick(r, MT.NAMES.filter(y => y !== x))]; };

/* ======================================================================
   A11. Regnefortellinger (lage og løse problemer)
   ====================================================================== */
// historier: {text, eq, ans, kind}
const stories = {
  plus(r, big){ const [n] = two(r), t = pick(r, MT.THINGS), a = int(r, 2, big ? 12 : 8), b = int(r, 2, big ? 20 - a : 9 - a < 2 ? 2 : 9 - a); const s = pick(r, [0, 1]);
    return s ? {text:`${n} har ${cnt(a, t)}. ${n} får ${b} til. Hvor mange har ${n} nå?`, eq:`${a} + ${b}`, ans:a + b} : {text:`I en kurv er det ${cnt(a, t)}. I en annen kurv er det ${cnt(b, t)}. Hvor mange er det til sammen?`, eq:`${a} + ${b}`, ans:a + b}; },
  minus(r, big){ const [n, m] = two(r), t = pick(r, MT.THINGS), a = int(r, 5, big ? 20 : 10), b = int(r, 1, a - 1); const s = pick(r, [0, 1]);
    return s ? {text:`${n} har ${cnt(a, t)}. ${n} gir bort ${b}. Hvor mange er igjen?`, eq:`${a} − ${b}`, ans:a - b} : {text:`Det er ${cnt(a, t)} på bordet. ${b} blir tatt bort. Hvor mange er igjen?`, eq:`${a} − ${b}`, ans:a - b}; },
  compare(r){ const [n, m] = two(r), t = pick(r, MT.THINGS), a = int(r, 5, 15), b = int(r, 1, a - 1); return {text:`${n} har ${cnt(a, t)}. ${m} har ${b}. Hvor mange flere har ${n}?`, eq:`${a} − ${b}`, ans:a - b}; },
  missStart(r){ const [n] = two(r), t = pick(r, MT.THINGS), b = int(r, 2, 8), s = int(r, b + 2, 16); return {text:`${n} hadde noen ${t[1]}. Så fikk ${n} ${b} til. Nå har ${n} ${s}. Hvor mange hadde ${n} først?`, eq:`${s} − ${b}`, ans:s - b}; },
  missChange(r){ const [n] = two(r), t = pick(r, MT.THINGS), a = int(r, 2, 10), s = int(r, a + 1, 18); return {text:`${n} har ${cnt(a, t)}. Så fikk ${n} flere. Nå har ${n} ${s}. Hvor mange fikk ${n}?`, eq:`${s} − ${a}`, ans:s - a}; }
};
MT.module({
  id:'regnefortellinger', rek:39, trinn:[1, 2], maal:['KM13234'], tittel:'Regnefortellinger: lage og løse problemer', ikon:'📖', bygger:['addisjon-til-10', 'trekke-fra'],
  video:[
   {html:title('📖', 'Regnefortellinger', S.sub('Fra historie til regnestykke', 1.2)),
    no:'Matte finnes i lek og hverdag. Nå skal vi lære å løse regnefortellinger. Det er korte historier der vi må finne ut hva vi skal regne.'},
   {html:sc(S.row(S.pop(G.eq('1. Les og forstå', '#2563eb'), .2), S.pop(G.eq('2. Tegn eller tenk', '#16a34a'), 1.2), S.pop(G.eq('3. Skriv regnestykket', '#f97316'), 2.2), S.pop(G.eq('4. Regn og svar', '#9333ea'), 3.2)), S.sub('Fire steg', 4.2)),
    no:'Vi bruker fire steg. Først leser vi og forstår historien. Så tegner eller tenker vi. Så skriver vi regnestykket. Og til slutt regner vi og svarer med ord.'},
   {html:sc(S.pop(G.objs('🍎', 4, {s:'2.2rem'}) + '<span style="font-size:2rem;font-weight:900"> + </span>' + G.objs('🍏', 3, {s:'2.2rem'}), .2), S.sub('Ola har 4 epler. Han får 3 til.', 1.2), S.big('4 + 3 = 7', 2.4)),
    no:'Ola har fire epler. Han får tre til. Hvor mange har han nå? Noe blir lagt til, så vi legger sammen. Fire pluss tre er sju. Ola har sju epler.'},
   {html:sc(S.pop(G.objs('🍪', 8, {s:'2rem', cross:3}), .2), S.sub('Mia har 8 kjeks. Hun gir bort 3.', 1.2), S.big('8 − 3 = 5', 2.4)),
    no:'Mia har åtte kjeks. Hun gir bort tre. Hvor mange er igjen? Noe blir tatt bort, så vi trekker fra. Åtte minus tre er fem. Mia har fem kjeks igjen.'},
   {html:sc(S.pop(G.frame(7, 0, {s:22}), .2), S.pop(G.frame(4, 0, {s:22}), 1.2), S.sub('Hvor mange flere? Sammenlign', 2.2), S.big('7 − 4 = 3', 3)),
    no:'Noen ganger skal vi sammenligne. Lars har sju klistremerker. Kari har fire. Hvor mange flere har Lars? Vi finner forskjellen. Sju minus fire er tre. Lars har tre flere.'},
   {html:sc(S.pop(G.bar(8, 3, 5, {w:300, q:1}), .2), S.sub('Mia fikk 3 til. Nå har hun 8. Hvor mange hadde hun først?', 1.4), S.big('8 − 3 = 5', 2.6)),
    no:'Av og til er det starten som mangler. Mia fikk tre epler til. Nå har hun åtte. Hvor mange hadde hun først? Tegn en stang. Hele er åtte, delen hun fikk er tre. Det hun hadde først, er åtte minus tre, altså fem.'},
   {html:sc(S.big('5 + 2 = 7', .2), S.sub('Lag din egen historie!', 1.2), S.pop(G.eq('Jeg har 5 biler og får 2 til …', '#f97316'), 2)),
    no:'Du kan også lage egne historier! Hva passer til fem pluss to er lik sju? For eksempel: Jeg har fem biler og får to til. Da har jeg sju biler. Nå skal du øve på regnefortellinger!'}
  ],
  tekst:{
   mal:'Du skal løse og lage <b>regnefortellinger</b> fra lek og hverdag med addisjon og subtraksjon.',
   steg:['<b>Les</b> historien og finn ut hva som skjer.', '<b>Tegn</b> eller tenk: legges det til, tas det bort, eller sammenlignes det?', '<b>Skriv</b> regnestykket.', '<b>Regn</b> ut og svar med ord: «Mia har 5 kjeks igjen.»'],
   eks:['«Ola har 4 epler og får 3 til.» → 4 + 3 = 7', '«Mia har 8 kjeks og gir bort 3.» → 8 − 3 = 5', '«Lars har 7, Kari har 4. Hvor mange flere har Lars?» → 7 − 4 = 3'],
   ord:[['regnefortelling', 'en liten historie med en regneoppgave'], ['regnestykke', 'tall og regnetegn, for eksempel 8 − 3'], ['svar med ord', 'en hel setning som svarer på spørsmålet']],
   feil:['«Det står til sammen, så jeg legger alltid sammen» – tenk på hva som skjer i historien, ikke bare på ord.', '«Jeg tar tallene og pluss» – spør deg selv om det blir mer eller mindre.'],
   laerer:'KM13234 handler om å bruke addisjon og subtraksjon til å lage og løse problemer fra lek og hverdag. Oppgaver av typen «ukjent start» og «hvor mange flere?» er vanskeligere enn «legge til/ta bort» fordi regnestykket ikke følger historiens rekkefølge. La elevene tegne, bruke konkreter og lage egne historier.'
  },
  refleksjon:'Lag en regnefortelling som passer til 9 − 4 = 5, og skriv svaret med ord.',
  nivaaer:[
   {t:'Forstå: hva skjer i historien?', d:'Hva skal du regne?', kind:'forstaa', make:(r, i) => {
     const k = i % 6, [n, m] = two(r), t = pick(r, MT.THINGS), a = int(r, 5, 9), b = int(r, 2, 4);
     if(k === 0) return Q.choice(r, `${n} har ${cnt(a, t)} og får ${b} til. Hva skal du gjøre?`, 'Legge sammen', ['Trekke fra'], {keep:true, say:`${n} har ${cnt(a, t)} og får ${b} til. Hva skal du gjøre?`, expl:`Det kommer flere, så vi legger sammen: ${a} + ${b}.`});
     if(k === 1) return Q.choice(r, `${n} har ${cnt(a, t)} og gir bort ${b}. Hva skal du gjøre?`, 'Trekke fra', ['Legge sammen'], {keep:true, say:`${n} har ${cnt(a, t)} og gir bort ${b}. Hva skal du gjøre?`, expl:`Noe blir borte, så vi trekker fra: ${a} − ${b}.`});
     if(k === 2) return Q.choice(r, `${n} har ${a}. ${m} har ${b}. Hvor mange flere har ${n}? Hva skal du regne?`, `${a} − ${b}`, [`${a} + ${b}`, `${b} − ${a}`], {say:`${n} har ${a}. ${m} har ${b}. Hvor mange flere har ${n}? Hva skal du regne?`, keep:true, expl:'Når vi sammenligner, finner vi forskjellen med minus.'});
     if(k === 3) return Q.choice(r, 'Hva er det lurt å spørre seg først?', 'Hva skjer i historien?', ['Hvilket tall er størst?', 'Hvilket ord står først?', 'Hvor mange ord er det?'], {expl:'Vi må forstå hva som skjer: legges det til, tas det bort, eller sammenlignes det?'});
     if(k === 4) return Q.choice(r, 'Hva gjør du etter at du har regnet ut svaret?', 'Svarer med ord', ['Starter på nytt', 'Skriver bare tallet', 'Gjør ingenting'], {expl:'Vi svarer med en setning, for eksempel «Mia har 5 kjeks igjen».'});
     return Q.yn(`Passer regnestykket ${a} + ${b} til historien «${n} har ${cnt(a, t)} og gir bort ${b}»?`, false, {say:`Passer regnestykket ${a} pluss ${b} til historien: ${n} har ${cnt(a, t)} og gir bort ${b}?`, expl:`Nei. Noe tas bort, så regnestykket er ${a} − ${b}.`});
   }},
   {t:'Pluss-historier', d:'Løs historier der noe legges til.', n:10, make:(r, i) => { const s = stories.plus(r, i > 4); return Q.num(`${s.text} {?}`, s.ans, {say:s.text, calc:s.eq, expl:`Regnestykket er ${s.eq} = ${s.ans}.`, hint:`Tegn eller tenk: legges det til? Regnestykke: ${s.eq}.`}); }},
   {t:'Minus-historier', d:'Løs historier der noe tas bort.', n:10, make:(r, i) => { const s = stories.minus(r, i > 4); return Q.num(`${s.text} {?}`, s.ans, {say:s.text, calc:s.eq.replace('−', '-'), expl:`Regnestykket er ${s.eq} = ${s.ans}.`, hint:`Tas det bort? Regnestykke: ${s.eq}.`}); }},
   {t:'Velg regnestykket', d:'Hvilket regnestykke passer til historien?', n:10, make:(r, i) => {
     const kinds = ['plus', 'minus', 'compare', 'missStart', 'missChange'], s = stories[kinds[i % 5]](r, false);
     const [x, y] = s.eq.split(/ [+−] /).map(Number), isPlus = s.eq.includes('+'), a = x, b = y, ans = s.eq;
     const opts = [isPlus ? `${a} − ${b}` : `${a} + ${b}`, `${b} ${isPlus ? '−' : '+'} ${a}`, `${a} ${isPlus ? '+' : '−'} ${b + 1}`].filter(o => o !== ans);
     return Q.choice(r, `${s.text}<br>Hvilket regnestykke passer?`, ans, opts, {keep:false, say:s.text + ' Hvilket regnestykke passer?', expl:`Regnestykket er ${ans}. Svaret er ${s.ans}.`});
   }},
   {t:'Hvor mange flere? Ukjent tall', d:'Sammenlign og finn tallet som mangler.', n:10, make:(r, i) => { const s = [stories.compare, stories.missStart, stories.missChange, stories.compare, stories.minus][i % 5](r, false); return Q.num(`${s.text} {?}`, s.ans, {say:s.text, calc:s.eq.replace('−', '-'), expl:`Regnestykket er ${s.eq} = ${s.ans}.`, hint:G.bar(Math.max(...s.eq.split(/ [+−] /).map(Number)), Math.min(...s.eq.split(/ [+−] /).map(Number)), s.ans, {w:260, q:1})}); }},
   {t:'Lag fortellingen', d:'Velg historien som passer til regnestykket.', n:10, make:(r, i) => {
     const a = int(r, 3, 9), b = int(r, 1, a - 1), t = pick(r, MT.THINGS), [n, m] = two(r), plus = i % 2 === 0, e = plus ? `${a} + ${b}` : `${a} − ${b}`;
     const good = plus ? `${n} har ${cnt(a, t)} og får ${b} til.` : `${n} har ${cnt(a, t)} og gir bort ${b}.`;
     const bad = [plus ? `${n} har ${cnt(a, t)} og gir bort ${b}.` : `${n} har ${cnt(a, t)} og får ${b} til.`, `${n} har ${cnt(b, t)} og ${m} har ${cnt(a + b, t)}.`.replace(/\.$/, '. Hvor mange er det til sammen?'), `${n} har ${cnt(a + 1, t)} og gir bort ${b}.`];
     return Q.choice(r, `Hvilken historie passer til <b>${e}</b>?`, good, plus ? [bad[0], bad[2]] : [bad[0], bad[2]], {say:`Hvilken historie passer til ${e}?`, expl:`${e} betyr ${plus ? 'at noe legges til' : 'at noe tas bort'}: «${good}»`});
   }}
  ]
});

/* ======================================================================
   A3. Addisjon 10–20 (over tieren)
   ====================================================================== */
const twoFrames = (a, b, s) => G.frame(a, b, {s:s || 24, frames:2});
MT.module({
  id:'addisjon-10-20', rek:50, trinn:[1, 2], maal:['KM13234'], tittel:'Addisjon over 10: fyll tieren først', ikon:'🧮', bygger:['addisjon-til-10', 'tall-11-20'],
  video:[
   {html:title('🧮', 'Legge sammen over 10', S.sub('Fyll tieren først', 1.2)),
    no:'Nå skal vi legge sammen tall der svaret blir mer enn ti, for eksempel åtte pluss fem. Det er ikke vanskelig hvis vi bruker tierrammen smart.'},
   {html:sc(S.pop(twoFrames(8, 5, 30), .2), S.sub('8 + 5: to frames', 1.4)),
    no:'Her er åtte blå prikker og fem oransje prikker. Den første rammen har åtte blå. Det mangler to for å fylle den. Vi trenger en ny ramme for resten.'},
   {html:sc(S.pop(twoFrames(10, 3, 30), .2), S.row(S.pop(G.eq('8 + 2 = 10', '#16a34a'), 1.2), S.pop(G.eq('10 + 3 = 13', '#2563eb'), 2.2)), S.sub('Flytt 2 fra de 5 til å fylle tieren', 3.4)),
    no:'Vi flytter to av de oransje prikkene inn i den første rammen. Nå er den full: ti. Da er det tre prikker igjen. Ti og tre er tretten. Åtte pluss fem er tretten.'},
   {html:sc(S.row(S.pop(G.eq('5 = 2 + 3', '#f97316'), .2)), S.row(S.pop(G.eq('8 + 2 = 10', '#16a34a'), 1.2), S.pop('<span style="font-size:2rem;font-weight:900">→</span>', 1.8), S.pop(G.eq('10 + 3 = 13', '#2563eb'), 2.4)), S.sub('Dele det ene tallet så vi får 10', 3.4)),
    no:'Hvordan tenker vi? Vi deler fem i to og tre. Åtte pluss to blir ti. Ti pluss tre blir tretten. Vi bruker at ti er et lett tall å regne med.'},
   {html:sc(S.pop(twoFrames(10, 4, 30), .2), S.row(S.pop(G.eq('7 + 3 = 10', '#16a34a'), 1.2), S.pop(G.eq('10 + 4 = 14', '#2563eb'), 2.2)), S.sub('7 + 7: del 7 i 3 og 4', 3)),
    no:'Et nytt eksempel: sju pluss sju. Sju trenger tre for å bli ti. Del det andre sju i tre og fire. Sju pluss tre er ti. Ti pluss fire er fjorten. Sju pluss sju er fjorten.'},
   {html:sc(S.pop(G.blocks({t:1, e:3}, {u:8}), .2), S.pop(G.pv({t:1, e:3}), 1.2), S.sub('13 = 1 tier og 3 enere', 2.2)),
    no:'Dette passer med det vi vet om tall. Tretten er en tier og tre enere. Når vi fyller tieren og har tre til overs, får vi nettopp en tier og tre enere.'},
   {html:sc(S.big('9 + 6 = ?', .2), S.sub('Hvor mange mangler 9 til 10? 1. Så 10 + 5 = 15', 1.4)),
    no:'Prøv selv: ni pluss seks. Hvor mange mangler ni til ti? Én. Ta én fra seks. Da blir det ti pluss fem, altså femten. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal legge sammen to ensifrede tall der summen er over 10 (for eksempel 8 + 5) ved å <b>fylle tieren først</b>.',
   steg:['Se hvor mange som mangler for å få <b>10</b>.', '<b>Del</b> det andre tallet: først det som trengs, så resten.', 'Regn: første tall + det som trengs = <b>10</b>.', 'Legg til resten: 10 + resten.'],
   eks:[twoFrames(10, 3, 22) + '<br>8 + 5 → 8 + <b>2</b> = 10, 10 + <b>3</b> = <b>13</b>', '7 + 6 → 7 + 3 = 10, 10 + 3 = <b>13</b>'],
   ord:[['fylle tieren', 'legge til akkurat så mye at du får 10'], ['dele et tall', 'skrive tallet som to mindre tall: 5 = 2 + 3']],
   feil:['«8 + 5 = 12» – sjekk: 8 + 2 = 10, og 3 til gir 13.', '«Jeg teller og mister tellinga» – bruk tierrammen og fyll tieren.'],
   laerer:'Dette er første skritt mot å regne «over tierovergangen» med forståelse (KM13234). Strategien bygger på tiervenner (forrige modul) og posisjonssystemet: 13 = 10 + 3. La barna tegne to tierrammer og flytte prikker. Ikke gå til å pugge fakta uten at barnet forstår hvorfor 8 + 5 = 13.'
  },
  refleksjon:'Forklar hvordan du regner 9 + 4 ved å fylle tieren først.',
  nivaaer:[
   {t:'Forstå: fylle tieren', d:'Sjekk at du har forstått metoden.', kind:'forstaa', make:(r, i) => {
     const a = int(r, 6, 9), b = int(r, 11 - a, 9), need = 10 - a, rest = b - need, k = i % 5;
     if(k === 0) return Q.num(`${a} + ${b}: hvor mange mangler ${a} for å bli 10? {?}`, need, {say:`${a} pluss ${b}. Hvor mange mangler ${a} for å bli ti?`, expl:`${a} + ${need} = 10.`, hint:twoFrames(a, b, 20)});
     if(k === 1) return Q.num(`${a} + ${b}: du bruker ${need} av ${b} til å fylle tieren. Hvor mange er igjen av ${b}? {?}`, rest, {say:`${a} pluss ${b}. Du bruker ${need} av ${b} til å fylle tieren. Hvor mange er igjen?`, expl:`${b} − ${need} = ${rest}.`});
     if(k === 2) return Q.yn(`Er ${a} + ${b} det samme som 10 + ${rest}?`, true, {expl:`Ja: ${a} + ${need} = 10, og ${b} = ${need} + ${rest}.`});
     if(k === 3) return Q.choice(r, `Hvorfor fyller vi tieren først?`, 'Fordi 10 er lett å regne med', ['Fordi 10 er størst', 'Fordi det er en regel uten grunn', 'Fordi vi må telle på fingrene'], {expl:'Ti er et lett tall: 10 + 3 = 13 er en tier og tre enere.'});
     return Q.num(`10 + ${rest} = {?}`, 10 + rest, {calc:`10+${rest}`, expl:`10 og ${rest} er ${10 + rest}.`});
   }},
   {t:'Sum 11–14 med bilde', d:'Regn med tierrammer som hjelp.', n:10, make:(r, i) => {
     const s = int(r, 11, 14), a = int(r, s - 9, 9), b = s - a;
     if(a < 2 || b < 2 || b > 9) return null;
     return Q.num(`${twoFrames(a, b, 22)}<br>${a} + ${b} = {?}`, s, {calc:`${a}+${b}`, expl:`${a} + ${10 - a} = 10, og ${b - (10 - a)} til er ${s}.`});
   }},
   {t:'Sum til 18', d:'Regn over tieren – tierrammen som hjelp når du trenger den.', n:10, make:(r, i) => {
     const a = int(r, 4, 9), b = int(r, Math.max(2, 11 - a), 9);
     return Q.num(`${a} + ${b} = {?}`, a + b, {calc:`${a}+${b}`, expl:`${a} + ${10 - a} = 10, og ${b - (10 - a)} til: ${a + b}.`, hint:twoFrames(a, b, 20) + `<br>Fyll tieren: ${a} + ${10 - a} = 10. Så ${b - (10 - a)} til.`});
   }},
   {t:'Del og fyll', d:'Regn i to steg: fyll tieren, så legg til resten.', n:10, make:(r, i) => {
     const a = int(r, 6, 9), b = int(r, 11 - a, 9), need = 10 - a, rest = b - need, k = i % 3;
     if(k === 0) return Q.num(`${a} + ${b} = ${a} + ${need} + ${rest}. ${a} + ${need} = {?}`, 10, {calc:`${a}+${need}`, expl:`${a} + ${need} = 10.`});
     if(k === 1) return Q.num(`${a} + ${b} = 10 + ${rest}. Svaret er {?}`, 10 + rest, {calc:`10+${rest}`, say:`${a} pluss ${b} er ti pluss ${rest}. Hva er svaret?`, expl:`10 + ${rest} = ${10 + rest}.`});
     return Q.num(`${a} + ${b} = {?}`, a + b, {calc:`${a}+${b}`, expl:`${a} + ${need} = 10, 10 + ${rest} = ${a + b}.`, hint:`Fyll tieren: ${a} + ${need} = 10. Så 10 + ${rest}.`});
   }},
   {t:'Mix og fart', d:'Plusstykker med sum 11–18, blandet.', n:12, make:(r, i) => { const a = int(r, 2, 9), b = int(r, Math.max(2, 11 - a), 9); return Q.num(`${a} + ${b} = {?}`, a + b, {calc:`${a}+${b}`, expl:`${a} + ${10 - a < b ? 10 - a : b} = ${10 - a < b ? 10 : a + b}…${a + b}.`.replace(/…/, ', så '), hint:twoFrames(a, b, 20)}); }}
  ]
});

/* ======================================================================
   A7. Subtraksjon til 20 (under tieren)
   ====================================================================== */
MT.module({
  id:'subtraksjon-til-20', rek:52, trinn:[1, 2], maal:['KM13234'], tittel:'Subtraksjon til 20: gå ned til 10 først', ikon:'🔻', bygger:['trekke-fra', 'tall-11-20'],
  video:[
   {html:title('🔻', 'Trekke fra under 20', S.sub('Gå ned til 10 først', 1.2)),
    no:'Nå skal vi trekke fra tall mellom ti og tjue, for eksempel tretten minus fem. Vi gjør det i to enkle steg.'},
   {html:sc(S.pop(G.frame(13, 0, {s:28, frames:2, cross:5}), .2), S.sub('13 − 5: ta bort 5', 1.4)),
    no:'Her er tretten prikker. Vi skal ta bort fem. Først tar vi bort de tre som ligger i den øverste rammen. Da står vi igjen med ti. Så tar vi bort to til. Det blir åtte.'},
   {html:sc(S.row(S.pop(G.eq('13 − 3 = 10', '#dc2626'), .2), S.pop('<span style="font-size:2rem;font-weight:900">→</span>', .8), S.pop(G.eq('10 − 2 = 8', '#dc2626'), 1.4)), S.sub('5 = 3 + 2', 2.6)),
    no:'Vi deler fem i tre og to. Tretten minus tre er ti. Ti minus to er åtte. Tretten minus fem er åtte.'},
   {html:sc(G.nline(5, 13, {marks:[{v:5, label:'5', c:'#16a34a'}, {v:13, label:'13', c:'#2563eb'}], hops:[{a:5, b:10, label:'+5', c:'#f97316'}, {a:10, b:13, label:'+3', c:'#f97316'}], w:620}), S.sub('Eller: hvor langt er det fra 5 til 13?', 1.8)),
    no:'Vi kan også tenke addisjon. Hva må vi legge til fem for å komme til tretten? Fem pluss fem er ti. Så tre til. Fem og tre er åtte. Så fem pluss åtte er tretten, og tretten minus fem er åtte.'},
   {html:sc(S.pop(G.frame(15, 0, {s:28, frames:2, cross:8}), .2), S.row(S.pop(G.eq('15 − 5 = 10', '#dc2626'), 1.2), S.pop(G.eq('10 − 3 = 7', '#dc2626'), 2.2)), S.sub('15 − 8: del 8 i 5 og 3', 3.2)),
    no:'Femten minus åtte. Åtte er fem og tre. Femten minus fem er ti. Ti minus tre er sju. Femten minus åtte er sju.'},
   {html:sc(S.big('14 − 6 = ?', .2), S.sub('14 − 4 = 10, 10 − 2 = 8', 1.2)),
    no:'Prøv selv: fjorten minus seks. Ta fire først, så er du på ti. Så ta to til. Svaret er åtte. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal trekke fra et ensifret tall fra et tall mellom 11 og 20 (for eksempel 13 − 5) ved å <b>gå ned til 10 først</b>, og se sammenhengen med addisjon.',
   steg:['Se hvor mange du må ta bort for å komme ned til <b>10</b> (enerne i tallet).', '<b>Del</b> det du skal trekke fra: først dette, så resten.', 'Ta bort første del → du er på 10.', 'Ta bort resten fra 10.'],
   eks:[G.frame(13, 0, {s:20, frames:2, cross:5}) + '<br>13 − 5 → 13 − 3 = 10, 10 − 2 = <b>8</b>', '15 − 8 → 15 − 5 = 10, 10 − 3 = <b>7</b>'],
   ord:[['gå ned til 10', 'trekke fra akkurat nok til å få 10'], ['regnefamilie', 'pluss og minus med de samme tre tallene']],
   feil:['«13 − 5 = 12» – du må ta bort fem hele tiden: 13 − 3 = 10, så 2 til: 8.'],
   laerer:'Her kobles subtraksjon til posisjonssystemet (11–19 = 10 + ener) og til addisjon som motsatt regneart. To strategier: gå ned til 10 og tenk addisjon (hva mangler?). Begge bygger forståelse for veksling i skriftlig subtraksjon senere.'
  },
  refleksjon:'Forklar hvordan du regner 16 − 9 på to ulike måter.',
  nivaaer:[
   {t:'Forstå: gå ned til 10', d:'Sjekk at du har forstått metoden.', kind:'forstaa', make:(r, i) => {
     const e = int(r, 3, 8), s = 10 + e, b = int(r, e + 1, 9), first = e, rest = b - e, k = i % 5;
     if(k === 0) return Q.num(`${s} − ${b}: hvor mye må du ta bort for å komme ned til 10? {?}`, e, {say:`${s} minus ${b}. Hvor mye må du ta bort for å komme ned til ti?`, expl:`${s} − ${e} = 10.`, hint:G.frame(s, 0, {s:18, frames:2, cross:b})});
     if(k === 1) return Q.num(`${s} − ${b}: du tar bort ${e} og kommer til 10. Hvor mye må du ta bort til? {?}`, rest, {say:`${s} minus ${b}. Du tar bort ${e} og kommer til ti. Hvor mye må du ta bort til?`, expl:`${b} − ${e} = ${rest}.`});
     if(k === 2) return Q.num(`10 − ${rest} = {?}`, 10 - rest, {calc:`10-${rest}`, expl:`10 − ${rest} = ${10 - rest}.`});
     if(k === 3) return Q.yn(`${b} + ${s - b} = ${s}. Betyr det at ${s} − ${b} = ${s - b}?`, true, {say:`${b} pluss ${s - b} er ${s}. Betyr det at ${s} minus ${b} er ${s - b}?`, expl:'Ja. Pluss og minus hører sammen i en regnefamilie.'});
     return Q.choice(r, 'Hva gjør vi først når vi skal regne 14 − 6?', 'Tar bort 4 for å komme ned til 10', ['Legger til 6', 'Tar bort 14', 'Teller bakover fra 6'], {expl:'14 − 4 = 10. Så tar vi bort 2 til: 8.'});
   }},
   {t:'Tall til 14 med bilde', d:'Trekk fra med tierrammer som hjelp.', n:10, make:(r, i) => {
     const s = int(r, 11, 14), b = int(r, s - 9, 9) , bb = Math.max(2, b);
     if(bb > 9 || s - bb < 1) return null;
     return Q.num(`${G.frame(s, 0, {s:20, frames:2, cross:bb})}<br>${s} − ${bb} = {?}`, s - bb, {calc:`${s}-${bb}`, expl:`${s} − ${bb} = ${s - bb}.`});
   }},
   {t:'Tall til 20', d:'Regn minusstykker fra 11 til 20.', n:10, make:(r, i) => { const s = int(r, 12, 20), b = int(r, Math.max(2, s - 10 + 1), 9); if(b >= s) return null; return Q.num(`${s} − ${b} = {?}`, s - b, {calc:`${s}-${b}`, expl:`${s} − ${s - 10} = 10, og ${b - (s - 10)} til: ${s - b}.`, hint:G.frame(s, 0, {s:18, frames:2, cross:b}) + `<br>Ta bort ${s - 10} først (da er du på 10), så resten.`}); }},
   {t:'Gå ned til 10', d:'Regn i to steg.', n:10, make:(r, i) => {
     const e = int(r, 3, 8), s = 10 + e, b = int(r, e + 1, 9), rest = b - e, k = i % 3;
     if(k === 0) return Q.num(`${s} − ${b} = ${s} − ${e} − ${rest}. ${s} − ${e} = {?}`, 10, {calc:`${s}-${e}`, expl:`${s} − ${e} = 10.`});
     if(k === 1) return Q.num(`${s} − ${b} = 10 − ${rest}. Svaret er {?}`, 10 - rest, {calc:`10-${rest}`, say:`${s} minus ${b} er ti minus ${rest}. Hva er svaret?`, expl:`10 − ${rest} = ${10 - rest}.`});
     return Q.num(`${s} − ${b} = {?}`, s - b, {calc:`${s}-${b}`, expl:`${s} − ${e} = 10, 10 − ${rest} = ${s - b}.`, hint:`Gå ned til 10: ${s} − ${e} = 10. Så 10 − ${rest}.`});
   }},
   {t:'Mix: minus og regnefamilier', d:'Blandede minusstykker og tenk addisjon.', n:12, make:(r, i) => {
     const k = i % 3, s = int(r, 11, 20), b = int(r, 2, 9); if(b >= s - 1) return null;
     if(k === 0) return Q.num(`${s} − ${b} = {?}`, s - b, {calc:`${s}-${b}`, expl:`${s} − ${b} = ${s - b}.`, hint:`Tenk: ${b} + ? = ${s}.`});
     if(k === 1) return Q.num(`${b} + {?} = ${s}`, s - b, {chk:`${b}+_===${s}`, say:`${b} pluss hva er ${s}?`, expl:`${s} − ${b} = ${s - b}.`});
     return Q.num(`${s - b} + ${b} = ${s}. Hva er ${s} − ${s - b}? {?}`, b, {calc:`${s}-${s - b}`, say:`${s - b} pluss ${b} er ${s}. Hva er ${s} minus ${s - b}?`, expl:`Regnefamilie: ${s} − ${s - b} = ${b}.`});
   }}
  ]
});

/* ======================================================================
   K1. Bytte rekkefølge
   ====================================================================== */
MT.module({
  id:'bytte-rekkefolge', rek:54, trinn:[1, 2], maal:['KM13235'], tittel:'Bytte rekkefølge i addisjon', ikon:'🔄', bygger:['addisjon-til-10'],
  video:[
   {html:title('🔄', 'Bytte rekkefølge', S.sub('3 + 5 = 5 + 3', 1.2)),
    no:'Nå skal vi lære noe lurt om addisjon. Vi kan bytte rekkefølgen på tallene vi legger sammen, og svaret blir det samme.'},
   {html:sc(S.row(S.pop(G.frame(3, 5, {s:28}), .2), S.pop('<span style="font-size:2.2rem;font-weight:900">=</span>', 1), S.pop(G.frame(5, 3, {s:28}), 1.4)), S.big('3 + 5 = 5 + 3', 2.6)),
    no:'Her er tre blå og fem oransje prikker. Her er fem blå og tre oransje. Det er like mange prikker til sammen: åtte. Tre pluss fem er det samme som fem pluss tre.'},
   {html:sc(S.row(S.pop(G.bar(8, 3, 5, {w:250}), .2), S.pop(G.bar(8, 5, 3, {w:250}), 1.2)), S.sub('Delene bytter plass – helheten er den samme', 2.2)),
    no:'På stangen ser vi det også. Når delene bytter plass, er helheten den samme. Det gjelder alltid for pluss.'},
   {html:sc(S.row(S.pop(hop(2, '+', 7, {w:420}), .2)), S.row(S.pop(hop(7, '+', 2, {w:420}), 1.4)), S.sub('Start med det største: færre hopp', 2.6)),
    no:'Dette kan hjelpe oss. To pluss sju: vi kan starte på to og telle sju steg. Eller bytte og starte på sju og telle bare to steg: åtte, ni. Det er mye raskere. Svaret er ni.'},
   {html:sc(S.row(S.pop(G.eq('4 + 38 = 38 + 4', '#2563eb'), .2)), S.big('38 + 4 = 42', 1.4), S.sub('Sett det største tallet først', 2.4)),
    no:'Det virker også med store tall. Fire pluss trettiåtte er det samme som trettiåtte pluss fire. Det er lettere å starte på trettiåtte og legge til fire: førtito.'},
   {html:sc(S.row(S.pop(G.eq('5 − 2 = 3', '#16a34a'), .2), S.pop(G.eq('2 − 5 = ?', '#dc2626'), 1.2)), S.big('minus kan IKKE byttes', 2.2)),
    no:'Men pass på! Det virker bare for pluss. Fem minus to er tre. Men to minus fem går ikke. Vi kan ikke bytte rekkefølge i minus.'},
   {html:sc(S.row(S.pop(G.col('+', 37, 5, {noans:true, nohead:true}), .2), S.pop('<span style="font-size:2.2rem;font-weight:900">=</span>', 1), S.pop(G.col('+', 5, 37, {noans:true, nohead:true}), 1.4)), S.sub('I oppstilling blir svaret det samme', 2.4)),
    no:'Også i oppstilling får vi samme svar. Trettisju pluss fem er førtito, og fem pluss trettisju er førtito. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal bruke at man kan <b>bytte rekkefølge</b> i addisjon (a + b = b + a) når du regner i hodet og skriftlig.',
   steg:['Se på regnestykket: kan du bytte plass på tallene?', 'Pluss: ja – svaret er det samme (3 + 5 = 5 + 3).', 'Sett det <b>største tallet først</b> og tell videre: 2 + 7 → 7 + 2.', 'Minus: <b>nei</b> – 5 − 2 er ikke det samme som 2 − 5.'],
   eks:[G.frame(3, 5, {s:20}) + ' = ' + G.frame(5, 3, {s:20}) + '<br>3 + 5 = 5 + 3 = 8', '4 + 38 → 38 + 4 = <b>42</b>'],
   ord:[['kommutativ egenskap', 'at man kan bytte rekkefølge og få samme svar (gjelder pluss, ikke minus)'], ['sum', 'svaret på pluss']],
   feil:['«7 − 3 = 3 − 7» – i minus kan vi ikke bytte.', '«2 + 9 er vanskeligere enn 9 + 2» – de er like mye, men 9 + 2 er lettere å regne.'],
   laerer:'KM13235: kommutative egenskaper ved addisjon i hoderegning og skriftlig regning. Når barn forstår at 3 + 5 = 5 + 3, halveres faktamengden og tellingen blir lettere (start på det største). Bruk konkreter, tierramme og stang. Kontrast med minus.'
  },
  refleksjon:'Hvorfor kan vi bytte rekkefølge i pluss, men ikke i minus? Forklar med et eksempel.',
  nivaaer:[
   {t:'Forstå: bytte i pluss og minus', d:'Sjekk at du har forstått hva som kan byttes.', kind:'forstaa', make:(r, i) => {
     const a = int(r, 2, 9), b = int(r, 2, 9), k = i % 5;
     if(k === 0) return Q.yn(`Er ${a} + ${b} det samme som ${b} + ${a}?`, true, {expl:`Ja: begge er ${a + b}.`});
     if(k === 1) return Q.yn(`Er ${a + b} − ${a} det samme som ${a} − ${a + b}?`, false, {say:`Er ${a + b} minus ${a} det samme som ${a} minus ${a + b}?`, expl:'Nei. I minus kan vi ikke bytte rekkefølge.'});
     if(k === 2) return Q.choice(r, `Du skal regne 2 + ${a + 4}. Hva er lurt?`, `Bytte til ${a + 4} + 2 og telle 2 videre`, ['Telle fra 0', 'Trekke fra', 'Gjette'], {say:`Du skal regne to pluss ${a + 4}. Hva er lurt?`, expl:'Start på det største tallet, og tell videre det lille.'});
     if(k === 3) return Q.choice(r, 'I hvilken regneart kan vi bytte rekkefølge?', 'Pluss', ['Minus', 'Begge', 'Ingen'], {expl:'Bytte virker for pluss, ikke for minus.'});
     return Q.yn(`Er ${a} + ${b} + 0 det samme som ${b} + ${a}?`, true, {expl:'Å legge til 0 forandrer ingenting.'});
   }},
   {t:'Samme sum', d:'Bytt plass og få samme svar.', n:10, make:(r, i) => {
     const a = int(r, 1, 9), b = int(r, 1, 9), k = i % 3;
     if(k === 0) return Q.num(`${a} + ${b} = ${b} + {?}`, a, {chk:`${b}+_===${a + b}`, say:`${a} pluss ${b} er lik ${b} pluss hva?`, expl:`${a} + ${b} = ${b} + ${a}.`, hint:G.frame(a, b, {s:22})});
     if(k === 1) return Q.num(`{?} + ${a} = ${a} + ${b}`, b, {chk:`_+${a}===${a + b}`, expl:`Bytt plass: ${a} + ${b} = ${b} + ${a}.`});
     return Q.num(`${a} + ${b} = {?}, og ${b} + ${a} = ${a + b}`, a + b, {calc:`${a}+${b}`, expl:`Begge er ${a + b}.`});
   }},
   {t:'Start med det største', d:'Bytt og tell videre fra det største.', n:10, make:(r, i) => {
     const a = int(r, 1, 3), b = int(r, 5, 9);
     return Q.num(`${a} + ${b} = {?}`, a + b, {calc:`${a}+${b}`, say:`${a} pluss ${b}`, expl:`Bytt til ${b} + ${a}. Start på ${b} og tell ${a} videre: ${a + b}.`, hint:hop(b, '+', a)});
   }},
   {t:'Større tall', d:'Bytt rekkefølge også med tosifrede tall.', n:10, make:(r, i) => {
     const a = int(r, 2, 9), b = int(r, 11, 80), b1 = b % 10 + a >= 10 ? b - b % 10 + 1 : b, k = i % 3, big = b1;
     if(k === 0) return Q.num(`${a} + ${big} = ${big} + {?}`, a, {chk:`${big}+_===${a + big}`, expl:`${a} + ${big} = ${big} + ${a}.`});
     if(k === 1) return Q.num(`${a} + ${big} = {?}`, a + big, {calc:`${a}+${big}`, say:`${a} pluss ${big}`, expl:`Bytt: ${big} + ${a} = ${a + big}.`, hint:`Start på ${big} og legg til ${a}.`});
     return Q.num(`${G.col('+', a, big, {nohead:true, ans:a + big, blank:[0, 1]})}<br>Svaret er: {?}`, a + big, {say:`${a} pluss ${big}`, expl:`${a} + ${big} = ${big} + ${a} = ${a + big}.`});
   }},
   {t:'Sant eller usant?', d:'Hva kan byttes?', n:10, make:(r, i) => {
     const a = int(r, 3, 15), b = int(r, 2, a - 1), plus = i % 2 === 0;
     return plus ? Q.yn(`Er <b>${a} + ${b} = ${b} + ${a}</b> riktig?`, true, {expl:`Ja, ${a} + ${b} = ${a + b}, og ${b} + ${a} = ${a + b}.`}) : Q.yn(`Er <b>${a} − ${b} = ${b} − ${a}</b> riktig?`, false, {expl:`Nei. ${a} − ${b} = ${a - b}, men ${b} − ${a} går ikke.`});
   }}
  ]
});

/* ======================================================================
   K2. Gruppere tre tall
   ====================================================================== */
MT.module({
  id:'gruppere-tre-tall', rek:64, trinn:[2], maal:['KM13235'], tittel:'Legge sammen tre tall: velg lette par', ikon:'🧩', bygger:['addisjon-10-20', 'bytte-rekkefolge'],
  video:[
   {html:title('🧩', 'Legge sammen tre tall', S.sub('Velg lette par', 1.2)),
    no:'Hva gjør vi når vi skal legge sammen tre tall? Her kommer en lur idé: vi kan velge hvilke to vi legger sammen først.'},
   {html:sc(S.row(S.pop(G.frame(6, 4, {s:26}), .2), S.pop('<span style="font-size:2.4rem;font-weight:900">+</span>', .8), S.pop(G.objs('🔴', 7, {s:'1.7rem'}), 1.2)), S.sub('6 + 4 + 7', 2)),
    no:'Her skal vi regne seks pluss fire pluss sju. Seks og fire er tiervenner. De blir ti. Så er det bare å legge til sju. Ti pluss sju er sytten.'},
   {html:sc(S.big('(6 + 4) + 7 = 10 + 7 = 17', .2), S.big('6 + (4 + 7) = 6 + 11 = 17', 1.4), S.sub('Parentes: regn dette først', 2.8)),
    no:'Vi bruker parentes for å vise hva vi regner først. Seks pluss fire, i parentes, pluss sju er sytten. Seks pluss, fire pluss sju, i parentes, er også sytten. Svaret blir det samme uansett hvordan vi grupperer.'},
   {html:sc(S.row(S.pop(G.eq('8 + 5 + 2', '#2563eb'), .2)), S.row(S.pop(G.eq('8 + 2 = 10', '#16a34a'), 1.2), S.pop(G.eq('10 + 5 = 15', '#f97316'), 2.2)), S.sub('Bytt rekkefølge og velg lette par', 3.2)),
    no:'Vi kan også kombinere med å bytte rekkefølge. Åtte pluss fem pluss to. Åtte og to er tiervenner. Vi legger dem sammen først: ti. Så pluss fem: femten.'},
   {html:sc(S.row(S.pop(G.eq('28 + 9 + 1', '#2563eb'), .2)), S.row(S.pop(G.eq('9 + 1 = 10', '#16a34a'), 1.2), S.pop(G.eq('28 + 10 = 38', '#f97316'), 2.2)), S.sub('Se etter par som blir 10', 3.2)),
    no:'Også med store tall: tjueåtte pluss ni pluss én. Ni og én blir ti. Da er det bare tjueåtte pluss ti, som er trettiåtte.'},
   {html:sc(S.pop(G.col('+', 24, [15, 31], {nohead:true, ans:70}), .2), S.sub('Tre tall i oppstilling: kolonne for kolonne', 1.4)),
    no:'Vi kan også legge sammen tre tall i oppstilling. Vi starter med enerne: fire pluss fem pluss én er ti... altså null enere og en tier å ta med. Her bruker vi tall uten veksling for å øve først.'},
   {html:sc(S.big('3 tall – velg lette par!', .2), S.sub('Nå øver vi!', 1.2)),
    no:'Husk: ved tre tall kan du velge hvilke to du legger sammen først. Se etter tiervenner. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal legge sammen tre tall og bruke at du kan <b>velge hvilke to du legger sammen først</b> (assosiativ egenskap).',
   steg:['Se på de tre tallene. Finnes det to som blir <b>10</b> (tiervenner) eller et lett tall?', 'Legg dem sammen først (bruk gjerne parentes).', 'Legg til det tredje tallet.', 'Du kan bytte rekkefølge på tallene for å få de lette sammen.'],
   eks:['6 + 4 + 7 = (6 + 4) + 7 = 10 + 7 = <b>17</b>', '8 + 5 + 2 = (8 + 2) + 5 = 10 + 5 = <b>15</b>', '28 + 9 + 1 = 28 + (9 + 1) = 28 + 10 = <b>38</b>'],
   ord:[['parentes ( )', 'det som står i parentes, regner vi først'], ['assosiativ egenskap', 'vi kan gruppere tallene på ulike måter og få samme sum']],
   feil:['«(6 + 4) + 7 og 6 + (4 + 7) gir ulike svar» – begge er 17.'],
   laerer:'KM13235: assosiative egenskaper, i hoderegning og skriftlig regning. La elevene oppdage at «hvilke to man legger sammen først» ikke påvirker summen, og bruke det aktivt: tiervenner først. Skriftlig regning med tre tall i oppstilling bygger på kolonneadisjon.'
  },
  refleksjon:'Hvordan regner du 7 + 8 + 3 på en lur måte? Forklar.',
  nivaaer:[
   {t:'Forstå: velg lette par', d:'Sjekk at du har forstått gruppering.', kind:'forstaa', make:(r, i) => {
     let a = int(r, 2, 8), b = 10 - a, c = int(r, 2, 9), k = i % 4; while(c === a || c === b) c = int(r, 2, 9);
     if(k === 0) return Q.yn(`Er (${a} + ${b}) + ${c} det samme som ${a} + (${b} + ${c})?`, true, {expl:`Ja. Begge er ${a + b + c}. Vi kan gruppere som vi vil.`});
     if(k === 1) return Q.choice(r, `Du skal regne <b>${a} + ${c} + ${b}</b>. Hvilket par er lurt å legge sammen først?`, `${a} og ${b}`, [`${a} og ${c}`, `${c} og ${b}`].filter(x => c !== a && c !== b ? true : false), {say:`Du skal regne ${a} pluss ${c} pluss ${b}. Hvilket par er lurt å legge sammen først?`, expl:`${a} + ${b} = 10, og 10 er lett å regne videre med.`});
     if(k === 2) return Q.num(`(${a} + ${b}) + ${c} = 10 + ${c} = {?}`, 10 + c, {calc:`10+${c}`, say:`${a} pluss ${b} pluss ${c}`, expl:`${a} + ${b} = 10, 10 + ${c} = ${10 + c}.`});
     return Q.choice(r, 'Hva betyr en parentes i et regnestykke?', 'Det inni parentesen regner vi først', ['Det er et minus', 'Det er et svar', 'Det kan strykes'], {expl:'Parentesen viser hva vi regner først.'});
   }},
   {t:'Tre små tall', d:'Legg sammen tre tall, sum til 20.', n:10, make:(r, i) => { const a = int(r, 1, 7), b = int(r, 1, 7), c = int(r, 1, 7); return Q.num(`${a} + ${b} + ${c} = {?}`, a + b + c, {calc:`${a}+${b}+${c}`, expl:`${a} + ${b} = ${a + b}, ${a + b} + ${c} = ${a + b + c}.`, hint:G.frame(a, b, {s:18, frames:2}) + ' + ' + G.objs('🔴', c, {s:'1.2rem'})}); }},
   {t:'Finn tiervennene', d:'Legg sammen de to som blir 10 først.', n:10, make:(r, i) => {
     const a = int(r, 2, 8), b = 10 - a, c = int(r, 2, 9), ord = shuf(r, [a, b, c]), k = i % 2;
     if(k === 0) return Q.num(`${ord.join(' + ')} = {?}`, 10 + c, {calc:ord.join('+'), say:`${ord.join(' pluss ')}`, expl:`${a} + ${b} = 10. 10 + ${c} = ${10 + c}.`, hint:`Se etter to tall som blir 10: ${a} og ${b}.`});
     return Q.choice(r, `Hvilke to tall blir 10? &nbsp; <b>${ord.join(' &nbsp; ')}</b>`, `${Math.min(a, b)} og ${Math.max(a, b)}`, [`${Math.min(a, c)} og ${Math.max(a, c)}`, `${Math.min(b, c)} og ${Math.max(b, c)}`, `${a + 1} og ${b + 1}`].filter(x => x !== `${Math.min(a, b)} og ${Math.max(a, b)}`), {say:`Hvilke to tall blir ti? ${ord.join(', ')}`, expl:`${a} + ${b} = 10.`});
   }},
   {t:'Parenteser', d:'Regn det i parentes først.', n:10, make:(r, i) => {
     const a = int(r, 2, 9), b = int(r, 2, 9), c = int(r, 2, 9), k = i % 2;
     return k ? Q.num(`${a} + (${b} + ${c}) = {?}`, a + b + c, {calc:`${a}+(${b}+${c})`, expl:`(${b} + ${c}) = ${b + c}. ${a} + ${b + c} = ${a + b + c}.`}) : Q.num(`(${a} + ${b}) + ${c} = {?}`, a + b + c, {calc:`(${a}+${b})+${c}`, expl:`(${a} + ${b}) = ${a + b}. ${a + b} + ${c} = ${a + b + c}.`});
   }},
   {t:'Tre tall i oppstilling', d:'Legg sammen tre tosifrede tall (uten veksling).', n:10, make:(r, i) => {
     const e = [int(r, 0, 3), int(r, 0, 3), int(r, 0, 3)], t = [int(r, 1, 3), int(r, 1, 3), int(r, 1, 3)], n = e.map((x, j) => t[j] * 10 + x), s = n[0] + n[1] + n[2];
     return Q.num(`${G.col('+', n[0], [n[1], n[2]], {nohead:true})}<br>Hva er summen? {?}`, s, {say:`${n[0]} pluss ${n[1]} pluss ${n[2]}`, calc:n.join('+'), expl:`Enere: ${e[0]} + ${e[1]} + ${e[2]} = ${e[0] + e[1] + e[2]}. Tiere: ${t[0]} + ${t[1]} + ${t[2]} = ${t[0] + t[1] + t[2]}. Svar: ${s}.`});
   }}
  ]
});

/* ======================================================================
   T9b. Tallinjen i regning
   ====================================================================== */
MT.module({
  id:'tallinje-regning', rek:56, trinn:[2], maal:['KM13233', 'KM13234'], tittel:'Tallinjen i regning og problemløsing', ikon:'🦘', bygger:['tallinje', 'addisjon-til-10', 'trekke-fra'],
  video:[
   {html:title('🦘', 'Regne på tallinjen', S.sub('Hopp mot høyre og venstre', 1.2)),
    no:'Tallinjen er et godt hjelpemiddel når vi regner. Vi kan hoppe på den. Pluss er hopp mot høyre, og minus er hopp mot venstre.'},
   {html:sc(S.pop(hop(4, '+', 3), .2), S.big('4 + 3 = 7', 1.6)),
    no:'Fire pluss tre. Vi starter på fire. Så hopper vi tre steg mot høyre. Vi lander på sju. Fire pluss tre er sju.'},
   {html:sc(S.pop(hop(9, '-', 4), .2), S.big('9 − 4 = 5', 1.6)),
    no:'Ni minus fire. Vi starter på ni. Så hopper vi fire steg mot venstre. Vi lander på fem. Ni minus fire er fem.'},
   {html:sc(G.nline(8, 13, {marks:[{v:8, label:'8', c:'#16a34a'}], hops:[{a:8, b:10, label:'+2', c:'#f97316'}, {a:10, b:13, label:'+3', c:'#f97316'}], w:560}), S.big('8 + 5 = 8 + 2 + 3 = 13', 1.8)),
    no:'Vi kan hoppe i to steg. Åtte pluss fem: først hopper vi to, så er vi på ti. Så hopper vi tre til. Vi lander på tretten. Å hoppe til ti først, er ofte lurt.'},
   {html:sc(G.nline(3, 12, {marks:[{v:3, label:'3', c:'#16a34a'}, {v:12, label:'12', c:'#2563eb'}], hops:[{a:3, b:12, label:'?', c:'#9333ea'}], w:600}), S.sub('Hvor langt er det fra 3 til 12? 9', 1.6)),
    no:'Tallinjen kan også vise avstand. Hvor langt er det fra tre til tolv? Vi kan hoppe fra tre og til tolv. Det er ni steg. Avstanden er tolv minus tre, altså ni.'},
   {html:sc(S.row(S.pop('<span style="font-size:3rem">🚌</span>', .2)), S.sub('Bussen er ved holdeplass 12 og skal til 20. Hvor mange holdeplasser er det igjen?', 1.2), S.pop(G.nline(12, 20, {hops:[{a:12, b:20, label:'?', c:'#9333ea'}], w:560}), 2.4)),
    no:'Vi kan bruke tallinjen til problemer. Bussen er ved holdeplass tolv og skal til tjue. Hvor mange holdeplasser er det igjen? Fra tolv til tjue er det åtte steg.'},
   {html:sc(S.big('+ mot høyre · − mot venstre', .2), S.sub('Nå øver vi!', 1.2)),
    no:'Husk: pluss er mot høyre, og minus er mot venstre. Nå skal du øve på å regne med tallinjen!'}
  ],
  tekst:{
   mal:'Du skal bruke tallinjen til å regne pluss og minus, finne avstand og løse problemer.',
   steg:['Start på det første tallet.', '<b>Pluss:</b> hopp mot høyre. <b>Minus:</b> hopp mot venstre.', 'Du kan hoppe i flere steg (for eksempel til 10 først).', 'Avstand mellom to tall = det store minus det lille.'],
   eks:[hop(4, '+', 3, {w:360}) + '<br>4 + 3 = 7', hop(9, '-', 4, {w:360}) + '<br>9 − 4 = 5'],
   ord:[['avstand', 'hvor langt det er mellom to tall'], ['hopp', 'steg på tallinjen']],
   feil:['«Minus er hopp mot høyre» – minus er mot venstre.', '«Jeg teller startstreken som 1» – start på tallet du skal begynne på, og tell hoppene.'],
   laerer:'KM13233 andre del: tallinjen som regnemodell og i problemløsing. Tallinjen kobler tall, rekkefølge og avstand og bygger bro til «hva mangler?» og til regning over tiere.'
  },
  refleksjon:'Vis hvordan du regner 8 + 6 på tallinjen i to hopp.',
  nivaaer:[
   {t:'Forstå: hopp på tallinjen', d:'Sjekk at du har forstått retning og avstand.', kind:'forstaa', make:(r, i) => {
     const a = int(r, 4, 9), b = int(r, 2, 4), k = i % 5;
     if(k === 0) return Q.choice(r, 'Hvilken vei hopper vi når vi <b>legger til</b>?', 'Mot høyre', ['Mot venstre', 'Opp', 'Ned'], {expl:'Større tall står til høyre.'});
     if(k === 1) return Q.choice(r, 'Hvilken vei hopper vi når vi <b>trekker fra</b>?', 'Mot venstre', ['Mot høyre', 'Opp', 'Ned'], {expl:'Mindre tall står til venstre.'});
     if(k === 2) return Q.num(`${G.nline(a, a + b, {hops:[{a, b:a + b, label:'?', c:'#9333ea'}], w:480})}<br>Hvor langt er hoppet? {?}`, b, {say:'Hvor langt er hoppet?', expl:`${a + b} − ${a} = ${b}.`});
     if(k === 3) return Q.yn(`Lander du på ${a + b} hvis du starter på ${a} og hopper ${b} mot høyre?`, true, {expl:`${a} + ${b} = ${a + b}.`});
     return Q.num(`Fra ${a} til ${a + b}: hvor mange steg? {?}`, b, {expl:`${a + b} − ${a} = ${b}.`});
   }},
   {t:'Les hoppet', d:'Hvilket regnestykke viser hoppet?', n:10, make:(r, i) => {
     const a = int(r, 3, 10), b = int(r, 2, 6), plus = r() < .5, e = plus ? a + b : a - b, st = plus ? `${a} + ${b} = ${e}` : `${a} − ${b} = ${e}`;
     return Q.choice(r, `${hop(a, plus ? '+' : '-', b, {w:520})}<br>Hvilket regnestykke viser hoppet?`, st, [plus ? `${a} − ${b} = ${a - b}` : `${a} + ${b} = ${a + b}`, `${b} + ${a} = ${a + b + 1}`.replace(/= .*/, '= ' + (plus ? e + 1 : e - 1)), `${a} ${plus ? '+' : '−'} ${b + 1} = ${plus ? e + 1 : e - 1}`].filter(x => x !== st), {say:'Hvilket regnestykke viser hoppet?', expl:`Start på ${a}, hopp ${b} mot ${plus ? 'høyre' : 'venstre'}: ${st}.`});
   }},
   {t:'Regn med hopp', d:'Regn pluss og minus på tallinjen.', n:10, make:(r, i) => {
     const plus = i % 2 === 0, a = int(r, 5, 14), b = plus ? int(r, 2, 6) : int(r, 2, Math.min(6, a - 1)), e = plus ? a + b : a - b;
     return Q.num(`${a} ${plus ? '+' : '−'} ${b} = {?}`, e, {calc:`${a}${plus ? '+' : '-'}${b}`, expl:`Start på ${a} og hopp ${b} mot ${plus ? 'høyre' : 'venstre'}: ${e}.`, hint:hop(a, plus ? '+' : '-', b)});
   }},
   {t:'Hopp over 10', d:'Hopp til 10 først, så resten.', n:10, make:(r, i) => {
     const plus = i % 2 === 0;
     if(plus){ const a = int(r, 6, 9), b = int(r, 11 - a, 9), need = 10 - a; return Q.num(`${a} + ${b}: hopp ${need} til 10, så ${b - need} til. Svaret er {?}`, a + b, {calc:`${a}+${b}`, say:`${a} pluss ${b}. Hopp ${need} til ti, så ${b - need} til. Hva er svaret?`, expl:`${a} + ${need} = 10, 10 + ${b - need} = ${a + b}.`, hint:G.nline(a, a + b, {marks:[{v:a, label:a, c:'#16a34a'}], hops:[{a, b:10, label:'+' + need}, {a:10, b:a + b, label:'+' + (b - need)}], w:560})}); }
     const s = int(r, 12, 17), b = int(r, s - 10 + 1, 9), down = s - 10; return Q.num(`${s} − ${b}: hopp ${down} ned til 10, så ${b - down} til. Svaret er {?}`, s - b, {calc:`${s}-${b}`, say:`${s} minus ${b}. Hopp ${down} ned til ti, så ${b - down} til. Hva er svaret?`, expl:`${s} − ${down} = 10, 10 − ${b - down} = ${s - b}.`, hint:G.nline(s - b, s, {marks:[{v:s, label:s, c:'#16a34a'}], hops:[{a:s, b:10, label:'−' + down, c:'#dc2626'}, {a:10, b:s - b, label:'−' + (b - down), c:'#dc2626'}], w:560})});
   }},
   {t:'Avstand og problemer', d:'Hvor langt er det? Bruk tallinjen i problemer.', n:10, make:(r, i) => {
     const a = int(r, 2, 12), b = a + int(r, 3, 9), k = i % 3, n = pick(r, MT.NAMES);
     if(k === 0) return Q.num(`Hvor langt er det fra ${a} til ${b} på tallinjen? {?}`, b - a, {say:`Hvor langt er det fra ${a} til ${b} på tallinjen?`, calc:`${b}-${a}`, expl:`${b} − ${a} = ${b - a}.`, hint:G.nline(a, b, {hops:[{a, b, label:'?', c:'#9333ea'}], w:540})});
     if(k === 1) return Q.num(`Bussen er ved holdeplass ${a} og skal til holdeplass ${b}. Hvor mange holdeplasser er det igjen? {?}`, b - a, {say:`Bussen er ved holdeplass ${a} og skal til holdeplass ${b}. Hvor mange holdeplasser er det igjen?`, calc:`${b}-${a}`, expl:`${b} − ${a} = ${b - a}.`, hint:G.nline(a, b, {hops:[{a, b, label:'?', c:'#9333ea'}], w:540})});
     return Q.num(`${n} står på trinn ${a} i en trapp og går opp ${b - a} trinn. Hvilket trinn står ${n} på nå? {?}`, b, {say:`${n} står på trinn ${a} i en trapp og går opp ${b - a} trinn. Hvilket trinn står ${n} på nå?`, calc:`${a}+${b - a}`, expl:`${a} + ${b - a} = ${b}.`, hint:hop(a, '+', b - a)});
   }}
  ]
});
})();
