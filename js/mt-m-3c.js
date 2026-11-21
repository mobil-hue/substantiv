(function(){
'use strict';
/* Moduler 3. trinn (resten): representasjoner og egenskaper ved gange, likhets- og ulikhetstegn, likevekt, areal, koordinatsystem */
const A = window.App, MT = window.MT, G = MT.G, Q = MT.Q, S = MT.S, B = MT.B;
const {int, pick, shuf} = MT, {sc, pop, fade, big, sub, row, chip, title} = S;
const uniq = a => a.filter((x, i) => a.indexOf(x) === i);
const range = (a, b) => Array.from({length:b - a + 1}, (_, i) => a + i);
const mgp = (g, n, e) => G.groups(Array.from({length:g}, () => [e, n, Math.min(n, 5)]), {s:'1.5rem'});
const plus = (g, n) => Array(g).fill(n).join(' + ');
const HOLD = [['pose', 'poser'], ['eske', 'esker'], ['kurv', 'kurver'], ['boks', 'bokser'], ['skål', 'skåler']];

/* ======================================================================
   Representasjoner av multiplikasjon (KM13247)
   ====================================================================== */
const tabRow = (g, n, hide) => G.tbl([['Antall grupper'].concat(range(1, 5)), ['Til sammen'].concat(range(1, 5).map(k => k === hide ? '?' : k * n))], {head:false});
MT.module({
  id:'gange-representasjoner', rek:120, trinn:[3], maal:['KM13247'], tittel:'Gange på mange måter: ting, tegning, tall, tekst og tabell', ikon:'🔀', bygger:['gange-grupper', 'gange-telling'],
  video:[
   {html:title('🔀', 'Gange på mange måter', S.sub('Samme gange – fem måter å vise den på', 1.2)),
    no:'Gange kan vises på mange måter. I dag skal vi se samme gangestykke som ting, tegning, tall, tekst og tabell. Og vi skal oversette mellom dem.'},
   {html:sc(S.pop(mgp(3, 4, '🍎'), .2), S.sub('1. Konkreter: tre tallerkener med fire epler', 1.6)),
    no:'Først konkreter, altså ting vi kan holde i. Tre tallerkener med fire epler på hver. Vi kan flytte på dem og telle dem.'},
   {html:sc(S.row(S.pop(G.arr(3, 4), .2), S.pop(mgp(3, 4, '🔵'), 1)), S.sub('2. Tegning: rader og grupper', 2)),
    no:'Så tegning. Vi kan tegne prikker i tre rader med fire i hver rad. Eller tegne tre grupper med fire. Begge bildene viser det samme.'},
   {html:sc(S.row(S.pop(G.eq('3 × 4 = 12', '#16a34a'), .2), S.pop(G.eq('4 + 4 + 4 = 12', '#2563eb'), 1)), S.sub('3. Tallsymboler: gangestykke og pluss-stykke', 2)),
    no:'Så tallsymboler. Vi skriver tre ganger fire er tolv. Eller fire pluss fire pluss fire er tolv. Det er det samme.'},
   {html:sc(S.pop('<div class="mtcard" style="--c:#f97316;padding:10px 16px;font-size:1.3rem">Mia har 3 poser med 4 epler i hver. Hvor mange epler har hun?</div>', .2), S.sub('4. Tekst: en fortelling', 1.6)),
    no:'Så tekst. Mia har tre poser med fire epler i hver. Hvor mange epler har hun? En fortelling forteller hva som skjer.'},
   {html:sc(S.pop(tabRow(0, 4), .2), S.sub('5. Tabell: for hver pose legger vi til 4', 1.6)),
    no:'Til slutt en tabell. Én pose gir fire epler. To poser gir åtte. Tre poser gir tolv. For hver ny pose legger vi til fire. I tabellen ser vi mønsteret.'},
   {html:sc(S.row(S.pop(G.eq('ting', '#2563eb'), .2), S.pop(G.eq('tegning', '#16a34a'), .8), S.pop(G.eq('3 × 4', '#f97316'), 1.4), S.pop(G.eq('tekst', '#9333ea'), 2), S.pop(G.eq('tabell', '#0d9488'), 2.6)), S.sub('Vi kan gå fra hvilken som helst til en annen', 3.4)),
    no:'Nå kan vi oversette. Fra tegning til gangestykke. Fra gangestykke til tekst. Fra tekst til tabell. Å kunne se samme ting på flere måter hjelper oss å forstå gange.'},
   {html:sc(S.big('Samme tall – mange måter', .2), S.sub('Nå øver vi!', 1.2)),
    no:'Husk: ting, tegning, tall, tekst og tabell viser det samme. Nå skal du øve på å oversette mellom dem!'}
  ],
  tekst:{
   mal:'Du skal bruke <b>tallsymboler, tekst, tabeller, tegning og konkreter</b> til å vise gange på ulike måter, og <b>oversette</b> mellom dem.',
   steg:['<b>Konkreter:</b> grupper av ting.', '<b>Tegning:</b> grupper eller rader med prikker.', '<b>Tallsymboler:</b> 3 × 4 = 12 og 4 + 4 + 4 = 12.', '<b>Tekst:</b> «3 poser med 4 epler i hver».', '<b>Tabell:</b> 1 gruppe → 4, 2 grupper → 8, 3 grupper → 12.', 'Oversett: velg en måte, og vis den på en annen måte.'],
   eks:[G.arr(3, 4, {s:20}) + ' &nbsp; 3 × 4 = 12', tabRow(0, 4)],
   ord:[['representasjon', 'en måte å vise noe på (tegning, tall, tekst, tabell)'], ['oversette', 'vise det samme på en annen måte'], ['tabell', 'tall ordnet i rader og kolonner']],
   feil:['«3 × 4 betyr 4 grupper med 3 i denne tegningen» – les rader og grupper nøye: 3 rader med 4 er 3 × 4.', '«I tabellen øker svaret med antall grupper» – svaret øker med hvor mange det er i hver gruppe.'],
   laerer:'KM13247: representere multiplikasjon på ulike måter (tallsymboler, tekst, tabeller, tegning, konkreter) og oversette mellom dem. Be elevene alltid vise «samme gangestykke» med to representasjoner og forklare koblingen.'
  },
  refleksjon:'Vis 4 × 5 på tre ulike måter, og forklar hva som er likt.',
  nivaaer:[
   {t:'Forstå: samme gange – mange måter', d:'Sjekk at du har forstått.', kind:'forstaa', make:(r, i) => {
     const g = int(r, 2, 5), n = int(r, 2, 6), k = i % 6;
     if(k === 0) return Q.yn(`Kan ${g} × ${n} vises både som ${g} grupper med ${n} og som ${g} rader med ${n}?`, true, {expl:'Ja. Grupper og rader viser det samme.'});
     if(k === 1) return Q.choice(r, 'Hvilke representasjoner finnes for gange?', 'Ting, tegning, tallsymboler, tekst og tabell', ['Bare tallsymboler', 'Bare tegning', 'Bare tekst'], {expl:'Vi kan vise gange på mange måter.'});
     if(k === 2) return Q.yn(`Er ${plus(g, n)} en måte å skrive ${g} × ${n} på?`, true, {expl:`Ja: ${g} grupper med ${n}.`});
     if(k === 3) return Q.choice(r, 'Hva betyr det å «oversette» mellom representasjoner?', 'Vise det samme på en annen måte', ['Bytte ut tallene', 'Regne ut svaret', 'Gjøre det vanskeligere'], {expl:'For eksempel fra en tegning til et gangestykke.'});
     if(k === 4) return Q.yn('Gir en tabell for 4-gangen alltid 4 mer for hver ny gruppe?', true, {expl:'Ja. 4, 8, 12, 16 – hopptelling med 4.'});
     return Q.yn('Er det bare én riktig måte å vise et gangestykke på?', false, {expl:'Nei. Mange representasjoner er riktige.'});
   }},
   {t:'Fra tegning til gangestykke', d:'Hvilket gangestykke passer?', n:10, make:(r, i) => {
     const g = int(r, 2, 5), n = int(r, 2, 6), pic = i % 2 ? G.arr(g, n, {s:24}) : mgp(g, n, pick(r, ['🍎', '⭐', '🔵']));
     return Q.choice(r, `${pic}<br>Hvilket gangestykke passer til tegningen?`, `${g} × ${n}`, uniq([`${g} + ${n}`, `${g + 1} × ${n}`, `${g} × ${n + 1}`, `${g * n} × ${g}`]).filter(x => x !== `${g} × ${n}`).slice(0, 3), {say:'Hvilket gangestykke passer til tegningen?', expl:`${g} rader eller grupper med ${n}: ${g} × ${n} = ${g * n}.`});
   }},
   {t:'Fra gangestykke til tekst', d:'Hvilken fortelling passer?', n:10, make:(r, i) => {
     const g = int(r, 2, 5), n = int(r, 2, 6), t = pick(r, MT.THINGS), h = pick(r, HOLD), nm = pick(r, MT.NAMES);
     return Q.choice(r, `Hvilken historie passer til <b>${g} × ${n}</b>?`, `${nm} har ${g} ${h[1]} med ${n} ${t[1]} i hver.`, [`${nm} har ${g} ${t[1]} og får ${n} til.`, `${nm} deler ${g * n} ${t[1]} likt mellom ${g} venner.`, `${nm} har ${g * n} ${t[1]} og mister ${g}.`], {say:`Hvilken historie passer til ${g} ganger ${n}?`, expl:`${g} × ${n} betyr ${g} grupper med ${n}.`});
   }},
   {t:'Tabeller', d:'Fyll ut det som mangler i tabellen.', n:10, make:(r, i) => {
     const n = pick(r, [2, 3, 4, 5, 10]), g = int(r, 2, 5);
     if(i % 3 === 0) return Q.num(`${tabRow(0, n, g)}<br>Hva står i ruten med spørsmålstegn? {?}`, g * n, {say:'Hva står i ruten med spørsmålstegn?', calc:`${g}*${n}`, expl:`${g} grupper med ${n}: ${g} × ${n} = ${g * n}.`});
     if(i % 3 === 1) return Q.num(`${tabRow(0, n)}<br>Hvor mange er det i hver gruppe? {?}`, n, {say:'Hvor mange er det i hver gruppe?', expl:`Én gruppe er ${n}. Svaret øker med ${n} for hver gruppe.`});
     return Q.num(`${G.tbl([['Antall grupper', 2, 4, 6], ['Til sammen', 2 * n, 4 * n, '?']])}<br>Hva står i ruten med spørsmålstegn? {?}`, 6 * n, {say:'Hva står i ruten med spørsmålstegn?', calc:`6*${n}`, expl:`Hver gruppe er ${n}. 6 × ${n} = ${6 * n}.`});
   }},
   {t:'Fra tekst til tegning', d:'Hvilken tegning passer til historien?', n:10, make:(r, i) => {
     const g = int(r, 2, 4), n = int(r, 2, 5), t = pick(r, MT.THINGS), h = pick(r, HOLD), e = t[0];
     if(g === n) return null;
     const right = mgp(g, n, e), wrong = [mgp(n, g, e), mgp(g + 1, n, e), mgp(g, n + 1, e)].filter(x => x !== right && !(g === n));
     return Q.choice(r, `Det er ${g} ${h[1]} med ${n} ${t[1]} i hver. Hvilken tegning passer?`, right, wrong.slice(0, 3), {say:`Det er ${g} ${h[1]} med ${n} ${t[1]} i hver. Hvilken tegning passer?`, key:`tegningen med ${g} grupper med ${n}`, expl:`${g} grupper og ${n} i hver.`});
   }},
   {t:'Oversett mellom alle', d:'Tegning, tabell, tekst og tall om hverandre.', n:12, make:(r, i) => {
     const g = int(r, 2, 5), n = pick(r, [2, 3, 4, 5]), t = pick(r, MT.THINGS), h = pick(r, HOLD), k = i % 4;
     if(k === 0) return Q.num(`${G.arr(g, n, {s:22})}<br>Hvor mange er det til sammen? {?}`, g * n, {say:'Hvor mange er det til sammen?', calc:`${g}*${n}`, expl:`${g} × ${n} = ${g * n}.`});
     if(k === 1) return Q.num(`${tabRow(0, n)}<br>Hvor mange er det i 5 grupper? {?}`, 5 * n, {say:'Hvor mange er det i fem grupper?', calc:`5*${n}`, expl:`I tabellen: 5 grupper gir ${5 * n}.`});
     if(k === 2) return Q.num(`Det er ${g} ${h[1]} med ${n} ${t[1]} i hver. Hvor mange ${t[1]} er det til sammen? {?}`, g * n, {say:`Det er ${g} ${h[1]} med ${n} ${t[1]} i hver. Hvor mange er det til sammen?`, calc:`${g}*${n}`, expl:`${g} × ${n} = ${g * n}.`});
     return Q.num(`${g} × ${n} = ${plus(g, n)} = {?}`, g * n, {say:`${g} ganger ${n}`, calc:`${g}*${n}`, expl:`${plus(g, n)} = ${g * n}.`});
   }}
  ],
  drill:{tittel:'Gange: regn ut fra rutenett og tall', layout:{a:'pic', b:'row'}, cols:{a:3, b:4}, n:[30, 40], make:(r, i, hard) => {
    if(!hard){ const g = int(r, 2, 5), n = int(r, 2, 8); return {t:`${g} × ${n} =`, ans:g * n, pic:G.arr(g, n, {s:12})}; }
    const g = int(r, 2, 10), n = pick(r, [2, 3, 4, 5, 10]); return r() < .25 ? {t:`${g} × ☐ = ${g * n}`, ans:n} : {t:`${g} × ${n} =`, ans:g * n}; }}
});

/* ======================================================================
   Gange: bytte rekkefølge og gruppere (KM13248, del 1)
   ====================================================================== */
const trip = r => { const k = int(r, 0, 2); if(k === 0) return [2, 5, int(r, 3, 9)]; if(k === 1) return [4, 5, int(r, 2, 9)]; return [5, 2, int(r, 4, 9)]; };
MT.module({
  id:'gange-bytte', rek:122, trinn:[3], maal:['KM13248'], tittel:'Gange: bytte rekkefølge og velge lette par', ikon:'🔄', bygger:['gange-representasjoner'],
  video:[
   {html:title('🔄', 'Gange: bytte rekkefølge', S.sub('3 × 5 = 5 × 3', 1.2)),
    no:'Nå skal vi se på en lur egenskap ved gange. Vi kan bytte rekkefølge på tallene, og svaret blir det samme.'},
   {html:sc(S.row(S.pop(G.arr(3, 5, {s:24}), .2), S.pop('<span style="font-size:2.2rem;font-weight:900">=</span>', 1), S.pop(G.arr(5, 3, {s:24}), 1.4)), S.big('3 × 5 = 5 × 3', 2.6)),
    no:'Her er tre rader med fem prikker. Snur vi rutenettet, er det fem rader med tre prikker. Det er like mange prikker: femten. Tre ganger fem er det samme som fem ganger tre.'},
   {html:sc(S.row(S.pop(G.eq('2 × 9', '#2563eb'), .2), S.pop('<span style="font-size:2rem;font-weight:900">=</span>', .8), S.pop(G.eq('9 × 2', '#2563eb'), 1.4)), S.big('= 18', 2.2), S.sub('Bytt, så det blir lettest!', 3)),
    no:'Dette hjelper oss. Ni ganger to er det samme som to ganger ni. Vi kan velge den som er lettest, for eksempel to ganger ni, som er dobbelt av ni. Det halverer antall gangestykker vi må huske.'},
   {html:sc(S.row(S.pop(G.eq('12 ÷ 3 = 4', '#16a34a'), .2), S.pop(G.eq('3 ÷ 12 = ?', '#dc2626'), 1)), S.big('deling kan IKKE byttes', 2), S.sub('Det gjelder bare gange og pluss', 3)),
    no:'Men pass på. Det virker bare for gange. Tolv delt på tre er fire. Tre delt på tolv går ikke opp i hele tall. Vi kan ikke bytte rekkefølge i deling, og heller ikke i minus.'},
   {html:sc(S.row(S.pop(G.eq('2 × 5 × 7', '#2563eb'), .2)), S.row(S.pop(G.eq('2 × 5 = 10', '#16a34a'), 1.2), S.pop(G.eq('10 × 7 = 70', '#f97316'), 2.2)), S.sub('Velg lette par først', 3)),
    no:'Hva hvis vi ganger tre tall? To ganger fem ganger sju. Vi kan velge hvilke to vi ganger først. To ganger fem er ti. Og ti ganger sju er sytti. Det er mye lettere enn å begynne med fem ganger sju.'},
   {html:sc(S.row(S.pop(G.eq('(2 × 5) × 7 = 10 × 7 = 70', '#16a34a'), .2)), S.row(S.pop(G.eq('2 × (5 × 7) = 2 × 35 = 70', '#16a34a'), 1.2)), S.sub('Parentes: regn dette først. Svaret blir det samme.', 2.4)),
    no:'Vi bruker parentes for å vise hva vi regner først. To ganger fem, i parentes, ganger sju er sytti. To ganger, fem ganger sju, i parentes, er også sytti. Hvilke to vi ganger først, spiller ingen rolle for svaret.'},
   {html:sc(S.big('Bytt rekkefølge · velg lette par', .2), S.sub('Nå øver vi!', 1.2)),
    no:'Husk: i gange kan vi bytte rekkefølge og velge lette par. Det kaller vi regneegenskaper. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal bruke at man kan <b>bytte rekkefølge</b> (kommutativ) og <b>gruppere</b> (assosiativ) i gange, i hoderegning og skriftlig regning.',
   steg:['<b>Bytte:</b> 3 × 5 = 5 × 3 (snu rutenettet).', 'Velg den rekkefølgen som er <b>lettest</b>: 9 × 2 → 2 × 9.', '<b>Tre tall:</b> velg lette par først: 2 × 5 × 7 = (2 × 5) × 7 = 10 × 7 = 70.', '<b>Parentes</b> viser hva vi regner først.', 'Deling og minus kan <b>ikke</b> byttes.'],
   eks:[G.arr(3, 5, {s:18}) + ' = ' + G.arr(5, 3, {s:18}) + '<br>3 × 5 = 5 × 3 = 15', '2 × 5 × 7 = 10 × 7 = 70'],
   ord:[['kommutativ egenskap', 'bytte rekkefølge og få samme svar (gange og pluss)'], ['assosiativ egenskap', 'velge hvilke to tall du regner først'], ['faktor', 'et tall du ganger med']],
   feil:['«12 ÷ 3 = 3 ÷ 12» – deling kan ikke byttes.', '«2 × 5 × 7 = 2 × 5 + 7» – du må gange begge: 10 × 7.'],
   laerer:'KM13248 (kommutativ og assosiativ). Bruk rutenettet for å vise at 3 × 5 = 5 × 3. Egenskapene reduserer faktamengden og gjør hoderegning enklere (tiervenner i gange: 2 × 5). Distributiv egenskap følger i neste modul.'
  },
  refleksjon:'Hvorfor er 7 × 2 lettere å regne som 2 × 7?',
  nivaaer:[
   {t:'Forstå: hva kan byttes?', d:'Sjekk at du har forstått.', kind:'forstaa', make:(r, i) => {
     const a = int(r, 2, 9), b = int(r, 2, 9), k = i % 6;
     if(k === 0) return Q.yn(`Er ${a} × ${b} det samme som ${b} × ${a}?`, true, {expl:`Ja: begge er ${a * b}. Snu rutenettet.`});
     if(k === 1) return Q.yn(`Er ${a * b} ÷ ${a} det samme som ${a} ÷ ${a * b}?`, false, {expl:'Nei. I deling kan vi ikke bytte rekkefølge.'});
     if(k === 2) return Q.choice(r, 'I hvilke regnearter kan vi bytte rekkefølge?', 'Pluss og gange', ['Minus og deling', 'Alle fire', 'Ingen'], {expl:'a + b = b + a og a × b = b × a. Ikke for minus og deling.'});
     if(k === 3){ const t = trip(r); return Q.yn(`Er (${t[0]} × ${t[1]}) × ${t[2]} det samme som ${t[0]} × (${t[1]} × ${t[2]})?`, true, {expl:`Ja: begge er ${t[0] * t[1] * t[2]}.`}); }
     if(k === 4) return Q.choice(r, 'Hva betyr en parentes i et regnestykke?', 'Det inni parentesen regner vi først', ['Det er et minus', 'Det kan strykes', 'Det er svaret'], {expl:'Parentesen viser hva vi regner først.'});
     return Q.yn(`Gir ${a} × ${b} og ${b} × ${a} like mange prikker i et rutenett?`, true, {expl:'Ja. Rutenettet snus, men antall prikker er det samme.'});
   }},
   {t:'Snu rutenettet', d:'Samme antall prikker.', n:10, make:(r, i) => {
     const g = int(r, 2, 6), n = int(r, 2, 8); if(g === n) return null;
     if(i % 2 === 0) return Q.num(`${G.arr(g, n, {s:22})}<br>${g} × ${n} = {?} × ${g}`, n, {chk:`_*${g}===${g * n}`, say:`${g} ganger ${n} er hvor mange ganger ${g}?`, expl:`Snu rutenettet: ${n} rader med ${g}.`});
     return Q.num(`${G.arr(g, n, {s:22})}<br>Hvor mange prikker er det? {?}`, g * n, {say:'Hvor mange prikker er det?', calc:`${g}*${n}`, expl:`${g} × ${n} = ${n} × ${g} = ${g * n}.`});
   }},
   {t:'Bytt og regn', d:'Velg den lettest rekkefølgen.', n:10, make:(r, i) => {
     const a = int(r, 6, 10), b = pick(r, [2, 3, 4, 5]), k = i % 3;
     if(k === 0) return Q.num(`${a} × ${b} = ${b} × {?}`, a, {chk:`${b}*_===${a * b}`, say:`${a} ganger ${b} er ${b} ganger hva?`, expl:`${a} × ${b} = ${b} × ${a}.`});
     return Q.num(`${a} × ${b} = {?}`, a * b, {say:`${a} ganger ${b}`, calc:`${a}*${b}`, expl:`Bytt til ${b} × ${a} = ${a * b}.`, hint:`${b} × ${a}: ${b} grupper med ${a}.`});
   }},
   {t:'Tre tall: velg lette par', d:'Gang de to som er lettest først.', n:10, make:(r, i) => {
     const t = trip(r), o = shuf(r, t), prod = t[0] * t[1] * t[2], pairIdx = o.findIndex((x, j) => x * o[(j + 1) % 3] % 10 === 0 && x * o[(j + 1) % 3] <= 40);
     if(i % 2 === 0) return Q.num(`${o.join(' × ')} = {?}`, prod, {say:o.join(' ganger '), calc:o.join('*'), expl:`${t[0]} × ${t[1]} = ${t[0] * t[1]}, ${t[0] * t[1]} × ${t[2]} = ${prod}.`, hint:`Se etter to tall som gir 10 eller 20: ${t[0]} × ${t[1]}.`});
     return Q.choice(r, `Du skal regne <b>${o.join(' × ')}</b>. Hvilke to tall er lurt å gange først?`, `${t[0]} og ${t[1]}`, uniq([`${t[0]} og ${t[2]}`, `${t[1]} og ${t[2]}`]).filter(x => x !== `${t[0]} og ${t[1]}`), {say:`Du skal regne ${o.join(' ganger ')}. Hvilke to tall er lurt å gange først?`, expl:`${t[0]} × ${t[1]} = ${t[0] * t[1]} er lett.`});
   }},
   {t:'Parenteser', d:'Regn det i parentes først.', n:10, make:(r, i) => {
     const t = trip(r); if(i % 2 === 0) return Q.num(`(${t[0]} × ${t[1]}) × ${t[2]} = {?}`, t[0] * t[1] * t[2], {calc:`(${t[0]}*${t[1]})*${t[2]}`, expl:`(${t[0]} × ${t[1]}) = ${t[0] * t[1]}. ${t[0] * t[1]} × ${t[2]} = ${t[0] * t[1] * t[2]}.`});
     return Q.num(`${t[0]} × (${t[1]} × ${t[2]}) = {?}`, t[0] * t[1] * t[2], {calc:`${t[0]}*(${t[1]}*${t[2]})`, expl:`(${t[1]} × ${t[2]}) = ${t[1] * t[2]}. ${t[0]} × ${t[1] * t[2]} = ${t[0] * t[1] * t[2]}.`});
   }},
   {t:'Sant eller usant?', d:'Hva kan byttes og grupperes?', n:10, make:(r, i) => {
     const a = int(r, 3, 12), b = int(r, 2, 9), k = i % 4;
     if(k === 0) return Q.yn(`Er <b>${a} × ${b} = ${b} × ${a}</b> riktig?`, true, {expl:`Begge er ${a * b}.`});
     if(k === 1) return Q.yn(`Er <b>${a * b} ÷ ${b} = ${b} ÷ ${a * b}</b> riktig?`, false, {expl:'Nei. Deling kan ikke byttes.'});
     if(k === 2) return Q.yn(`Er <b>${a + b} − ${b} = ${b} − ${a + b}</b> riktig?`, false, {expl:'Nei. Minus kan ikke byttes.'});
     return Q.yn(`Er <b>${a} + ${b} = ${b} + ${a}</b> riktig?`, true, {expl:`Begge er ${a + b}.`});
   }}
  ],
  drill:{tittel:'Bytt og regn: gange i begge rekkefølger', layout:'row', cols:3, n:[42, 30], make:(r, i, hard) => {
    if(hard && i % 3 === 2){ const t = trip(r); return {t:`${shuf(r, t).join(' × ')} =`, ans:t[0] * t[1] * t[2]}; }
    const a = int(r, hard ? 6 : 2, hard ? 10 : 9), b = int(r, 2, hard ? 9 : 5), k = int(r, 0, 2);
    if(k === 0) return {t:`${a} × ${b} =`, ans:a * b}; if(k === 1) return {t:`${a} × ${b} = ${b} × ☐`, ans:a}; return {t:`${b} × ${a} =`, ans:a * b}; }}
});

/* ======================================================================
   Gange: dele opp (distributiv) (KM13248, del 2)
   ====================================================================== */
MT.module({
  id:'gange-dele-opp', rek:124, trinn:[3], maal:['KM13248'], tittel:'Gange: dele opp og regne lurt', ikon:'✂️', bygger:['gange-bytte', 'gange-telling', 'addisjon-tosifret'],
  video:[
   {html:title('✂️', 'Gange: dele opp', S.sub('7 × 6 = 5 × 6 + 2 × 6', 1.2)),
    no:'Nå skal vi lære en kjempelur måte å regne gange på. Vi deler opp det ene tallet i lette deler. Det kalles den distributive egenskapen.'},
   {html:sc(S.pop(G.arr(6, 7, {s:24}), .2), S.sub('7 × 6: seks rader med sju prikker', 1.4)),
    no:'Her er syv ganger seks, i seks rader med sju prikker. Det er litt vanskelig å huske. Men vi kan dele opp.'},
   {html:sc(S.pop(G.arr(6, 7, {s:24, split:5}), .2), S.row(S.pop(G.eq('5 × 6 = 30', '#2563eb'), 1.2), S.pop(G.eq('2 × 6 = 12', '#f97316'), 2)), S.sub('Dele rutenettet i to: 5 + 2', 2.8)),
    no:'Vi deler rutenettet i to deler: fem kolonner og to kolonner. Fem ganger seks er tretti. To ganger seks er tolv. Vi kjenner begge fra før.'},
   {html:sc(S.big('7 × 6 = 5 × 6 + 2 × 6', .2), S.big('= 30 + 12 = 42', 1.2), S.sub('Legg sammen delene', 2.2)),
    no:'Så legger vi sammen delene. Tretti pluss tolv er førtito. Sju ganger seks er førtito. Vi delte opp sju i fem og to.'},
   {html:sc(S.pop(G.arr(7, 8, {s:20, split:5}), .2), S.row(S.pop(G.eq('8 × 7 = 8 × 5 + 8 × 2', '#16a34a'), 1.2)), S.big('40 + 16 = 56', 2), S.sub('Del opp det tallet som er lettest', 3)),
    no:'Åtte ganger sju. Vi kan dele sju i fem og to. Åtte ganger fem er førti. Åtte ganger to er seksten. Førti pluss seksten er femtiseks. Velg å dele i fem, for fem-gangen er lett.'},
   {html:sc(S.row(S.pop(G.eq('4 × 23', '#2563eb'), .2)), S.row(S.pop(G.eq('4 × 20 = 80', '#16a34a'), 1.2), S.pop(G.eq('4 × 3 = 12', '#16a34a'), 2)), S.big('80 + 12 = 92', 2.8)),
    no:'Vi kan også dele store tall. Fire ganger tjuetre. Tjuetre er tjue og tre. Fire ganger tjue er åtti. Fire ganger tre er tolv. Åtti pluss tolv er nittito.'},
   {html:sc(S.pop(G.col('+', 80, 12, {ans:92, nohead:false}), .2), S.sub('Delproduktene legges sammen skriftlig', 1.4)),
    no:'Delproduktene kan vi legge sammen i oppstilling. Åtti pluss tolv er nittito. Slik bygger vi oss opp til skriftlig gange senere.'},
   {html:sc(S.big('Del opp – gang delene – legg sammen', .2), S.sub('Nå øver vi!', 1.2)),
    no:'Husk tre steg: del opp, gang hver del, og legg sammen. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal bruke at man kan <b>dele opp</b> et tall i et gangestykke (distributiv egenskap) i hoderegning og skriftlig regning.',
   steg:['Del opp det ene tallet i <b>lette deler</b>: 7 = 5 + 2.', 'Gang hver del: 5 × 6 = 30 og 2 × 6 = 12.', 'Legg sammen: 30 + 12 = <b>42</b>.', 'To sifre: <b>4 × 23 = 4 × 20 + 4 × 3 = 80 + 12 = 92</b>.', 'Tegn gjerne rutenettet delt i to.'],
   eks:[G.arr(6, 7, {s:16, split:5}) + '<br>7 × 6 = 5 × 6 + 2 × 6 = 30 + 12 = 42', '4 × 23 = 80 + 12 = 92'],
   ord:[['distributiv egenskap', 'å dele opp det ene tallet og gange hver del'], ['delprodukt', 'svaret på en av delene, for eksempel 5 × 6']],
   feil:['«7 × 6 = 5 × 6 + 2 = 32» – du må gange begge delene: 5 × 6 + 2 × 6.', '«4 × 23 = 4 × 20 + 3 = 83» – gang også 3 med 4: 4 × 3 = 12.'],
   laerer:'KM13248 (distributiv). Arealmodellen (rutenett delt i to) gjør egenskapen synlig. Strategien åpner for gangetabellene 6–9 («5 + noe») og for skriftlig gange i 4. trinn.'
  },
  refleksjon:'Vis hvordan du regner 8 × 6 ved å dele opp. Hvilken oppdeling var lettest?',
  nivaaer:[
   {t:'Forstå: hvorfor virker oppdeling?', d:'Sjekk at du har forstått.', kind:'forstaa', make:(r, i) => {
     const b = int(r, 6, 9), a = int(r, 2, 4) + 5, d = a - 5, k = i % 5;
     if(k === 0) return Q.yn(`Er ${a} × ${b} det samme som 5 × ${b} + ${d} × ${b}?`, true, {expl:`Ja: ${a} = 5 + ${d}. Hver del ganges med ${b}.`});
     if(k === 1) return Q.yn(`Er ${a} × ${b} det samme som 5 × ${b} + ${d}?`, false, {expl:`Nei. Du må også gange ${d} med ${b}: ${d} × ${b}.`});
     if(k === 2) return Q.choice(r, 'Hva gjør du når du deler opp et gangestykke?', 'Deler opp det ene tallet, ganger delene og legger sammen', ['Plusser alle tallene', 'Bytter gange med pluss', 'Gjetter'], {expl:'Del opp – gang delene – legg sammen.'});
     if(k === 3) return Q.yn(`Er 4 × 23 det samme som 4 × 20 + 4 × 3?`, true, {expl:'Ja: 23 = 20 + 3. 80 + 12 = 92.'});
     return Q.choice(r, `Hvordan kan du dele opp ${a} for å regne ${a} × ${b}?`, `5 + ${d}`, [`${d} + ${d}`, `${a} + 1`, `${a - 1} + 2`].filter(x => x !== `5 + ${d}`), {say:`Hvordan kan du dele opp ${a} for å regne ${a} ganger ${b}?`, expl:`5 + ${d} = ${a}. Fem-gangen er lett.`});
   }},
   {t:'Del opp rutenettet', d:'Regn delene i rutenettet.', n:10, make:(r, i) => {
     const c = int(r, 6, 9), g = int(r, 3, 6), d = c - 5;
     if(i % 2 === 0) return Q.num(`${G.arr(g, c, {s:20, split:5})}<br>5 × ${g} + ${d} × ${g} = {?}`, c * g, {say:`5 ganger ${g} pluss ${d} ganger ${g}`, calc:`5*${g}+${d}*${g}`, expl:`${5 * g} + ${d * g} = ${c * g}.`});
     return Q.num(`${G.arr(g, c, {s:20, split:5})}<br>Hvor mange prikker er det til sammen? {?}`, c * g, {say:'Hvor mange prikker er det til sammen?', calc:`${c}*${g}`, expl:`${c} × ${g} = 5 × ${g} + ${d} × ${g} = ${5 * g} + ${d * g} = ${c * g}.`});
   }},
   {t:'Dele opp et gangestykke', d:'Fyll ut oppdelingen.', n:10, make:(r, i) => {
     const a = int(r, 6, 9), b = int(r, 3, 9), d = a - 5, k = i % 3;
     if(k === 0) return Q.num(`${a} × ${b} = 5 × ${b} + {?} × ${b}`, d, {chk:`5*${b}+_*${b}===${a * b}`, say:`${a} ganger ${b} er 5 ganger ${b} pluss hva ganger ${b}?`, expl:`${a} = 5 + ${d}.`});
     if(k === 1) return Q.num(`${b} × ${a} = ${b} × 5 + ${b} × {?}`, d, {chk:`${b}*5+${b}*_===${b * a}`, say:`${b} ganger ${a} er ${b} ganger 5 pluss ${b} ganger hva?`, expl:`${a} = 5 + ${d}.`});
     return Q.num(`${a} × ${b} = ${5 * b} + {?}`, d * b, {chk:`${5 * b}+_===${a * b}`, say:`${a} ganger ${b} er ${5 * b} pluss hva?`, expl:`${d} × ${b} = ${d * b}.`});
   }},
   {t:'Regn med oppdeling', d:'Gangestykker fra 6-, 7-, 8- og 9-gangen.', n:12, make:(r, i) => {
     const a = int(r, 6, 9), b = int(r, 3, 9), d = a - 5; return Q.num(`${a} × ${b} = {?}`, a * b, {say:`${a} ganger ${b}`, calc:`${a}*${b}`, expl:`${a} × ${b} = 5 × ${b} + ${d} × ${b} = ${5 * b} + ${d * b} = ${a * b}.`, hint:G.arr(b, a, {s:18, split:5})});
   }},
   {t:'Tosifret × ensifret', d:'Del opp i tiere og enere.', n:10, make:(r, i) => {
     const g = int(r, 2, 5), t = int(r, 1, 4), e = int(r, 1, 4), n = t * 10 + e, k = i % 3;
     if(k === 0) return Q.num(`${g} × ${n} = ${g} × ${t * 10} + ${g} × ${e}. ${g} × ${t * 10} = {?}`, g * t * 10, {say:`${g} ganger ${n} er ${g} ganger ${t * 10} pluss ${g} ganger ${e}. Hva er ${g} ganger ${t * 10}?`, calc:`${g}*${t * 10}`, expl:`${g} × ${t} tiere = ${g * t} tiere = ${g * t * 10}.`});
     if(k === 1) return Q.num(`${g} × ${n}: ${g * t * 10} + ${g * e} = {?}`, g * n, {say:`${g} ganger ${n}. ${g * t * 10} pluss ${g * e} er?`, calc:`${g * t * 10}+${g * e}`, expl:`${g * t * 10} + ${g * e} = ${g * n}.`});
     return Q.num(`${g} × ${n} = {?}`, g * n, {say:`${g} ganger ${n}`, calc:`${g}*${n}`, expl:`${g} × ${t * 10} = ${g * t * 10}, ${g} × ${e} = ${g * e}, sum ${g * n}.`, hint:`Del opp ${n} = ${t * 10} + ${e}.`});
   }}
  ],
  drill:{tittel:'Gange med oppdeling (6-, 7-, 8-, 9-gangen)', layout:{a:'pic', b:'row'}, cols:{a:3, b:4}, n:[24, 36], make:(r, i, hard) => {
    if(!hard){ const a = int(r, 6, 9), b = int(r, 2, 5); return {t:`${a} × ${b} =`, ans:a * b, pic:G.arr(b, a, {s:12, split:5})}; }
    const k = int(r, 0, 3); if(k === 3){ const g = int(r, 2, 5), n = int(r, 11, 29); return {t:`${g} × ${n} =`, ans:g * n}; } const a = int(r, 6, 9), b = int(r, 6, 9); return {t:`${a} × ${b} =`, ans:a * b}; }}
});

/* ======================================================================
   Likhets- og ulikhetstegn (KM13249)
   ====================================================================== */
const sym = (a, b) => a > b ? '>' : a < b ? '<' : '=';
MT.module({
  id:'ulikhet', rek:126, trinn:[3], maal:['KM13249'], tittel:'Større enn, mindre enn og lik', ikon:'⚖️', bygger:['likhetstegn', 'tall-til-100'],
  video:[
   {html:title('⚖️', 'Større enn, mindre enn og lik', S.sub('>  <  =', 1.2)),
    no:'Nå skal vi bruke tegn til å sammenligne. Vi har tre tegn: større enn, mindre enn og lik.'},
   {html:sc(S.row(S.pop(G.objs('🍎', 7, {per:7, s:'1.6rem'}), .2), S.pop(G.objs('🍌', 4, {per:7, s:'1.6rem'}), 1)), S.big('7 > 4', 1.8), S.sub('7 er større enn 4', 2.6)),
    no:'Her er sju epler og fire bananer. Sju er mer enn fire. Vi skriver sju større enn fire. Den åpne siden av tegnet peker mot det største tallet.'},
   {html:sc(S.row(S.pop(G.eq('3 < 8', '#16a34a'), .2), S.pop(G.eq('5 = 5', '#2563eb'), 1)), S.sub('< mindre enn · = lik', 1.8)),
    no:'Tre er mindre enn åtte. Vi skriver tre mindre enn åtte. Femten er like mye som femten, og vi bruker likhetstegnet. Den spisse enden av tegnet peker mot det minste tallet.'},
   {html:sc(S.row(S.pop(G.eq('364 ○ 349', '#2563eb'), .2)), S.row(S.pop(G.eq('3 hundrere likt, 6 tiere > 4 tiere', '#f97316'), 1.2)), S.big('364 > 349', 2.2)),
    no:'Vi kan sammenligne store tall. Tre hundre og sekstifire og tre hundre og førtini. Hundrerne er like. Seks tiere er mer enn fire tiere. Så sekstifire er større.'},
   {html:sc(S.row(S.pop(G.eq('3 + 4 ○ 2 × 4', '#2563eb'), .2)), S.row(S.pop(G.eq('7  ○  8', '#f97316'), 1.2)), S.big('3 + 4 < 2 × 4', 2.2), S.sub('Regn ut begge sider først', 3)),
    no:'Vi kan også sammenligne regnestykker. Tre pluss fire er sju. To ganger fire er åtte. Sju er mindre enn åtte. Vi regner ut begge sidene først, og sammenligner svarene.'},
   {html:sc(S.row(S.pop(G.eq('1 m ○ 90 cm', '#2563eb'), .2)), S.row(S.pop(G.eq('100 cm > 90 cm', '#16a34a'), 1.2)), S.sub('Samme enhet først!', 2.2)),
    no:'Vi kan sammenligne størrelser, for eksempel lengder. En meter og nitti centimeter. En meter er hundre centimeter, og hundre er mer enn nitti. Vi må gjøre om til samme enhet først.'},
   {html:sc(S.big('38 < ☐ < 41 → ☐ = 39 eller 40', .2), S.sub('Nå øver vi!', 1.4)),
    no:'Vi kan også lete etter tall som passer. Hvilke tall er større enn trettiåtte og mindre enn førtien? Trettini og førti. Nå skal du øve på større enn, mindre enn og lik!'}
  ],
  tekst:{
   mal:'Du skal bruke <b>likhets- og ulikhetstegn</b> (=, &lt;, &gt;) til å sammenligne størrelser, mengder, uttrykk og tall.',
   steg:['<b>&gt;</b> «større enn»: 7 &gt; 4. <b>&lt;</b> «mindre enn»: 3 &lt; 8. <b>=</b> «lik»: 5 = 5.', 'Den <b>spisse</b> enden peker mot det <b>minste</b>.', '<b>Tall:</b> sammenlign sifrene fra venstre (hundrere, tiere, enere).', '<b>Uttrykk:</b> regn ut begge sider først.', '<b>Størrelser:</b> bruk samme enhet (1 m = 100 cm; 1 kg = 1000 g; 1 time = 60 min).'],
   eks:['364 &gt; 349', '3 + 4 &lt; 2 × 4 (7 &lt; 8)', '1 m &gt; 90 cm'],
   ord:[['større enn (&gt;)', 'har mer'], ['mindre enn (&lt;)', 'har mindre'], ['relasjon', 'en sammenheng mellom to ting']],
   feil:['«9 &lt; 8 fordi 9 kommer først» – sammenlign verdiene: 9 er større.', '«1 m &lt; 90 cm fordi 1 er mindre enn 90» – gjør om til samme enhet først.'],
   laerer:'KM13249: bruke likhets- og ulikhetstegn som relasjonelle symboler. Utvider KM13242 (likhetstegnet) og sammenligning av tall (KM13241). Sammenlign mengder, tall, uttrykk og størrelser; la elevene begrunne.'
  },
  refleksjon:'Finn tre tall som passer i 20 &lt; ☐ &lt; 30. Hvordan vet du at de passer?',
  nivaaer:[
   {t:'Forstå: hva betyr tegnene?', d:'Sjekk at du har forstått.', kind:'forstaa', make:(r, i) => {
     const a = int(r, 3, 9), b = a + int(r, 1, 5), k = i % 6;
     if(k === 0) return Q.choice(r, `Hva betyr <b>${a} &lt; ${b}</b>?`, `${a} er mindre enn ${b}`, [`${a} er større enn ${b}`, `${a} er lik ${b}`, `${a} pluss ${b}`], {say:`Hva betyr ${a} mindre enn ${b}?`, expl:`${a} er mindre enn ${b}.`});
     if(k === 1) return Q.yn(`Er ${b} &gt; ${a} riktig?`, true, {say:`Er ${b} større enn ${a} riktig?`, expl:`${b} er mer enn ${a}.`});
     if(k === 2) return Q.choice(r, 'Hvilken ende av tegnet peker mot det minste tallet?', 'Den spisse', ['Den åpne', 'Begge', 'Ingen'], {expl:'Den spisse enden peker på det minste tallet.'});
     if(k === 3) return Q.yn(`Er ${a} + ${b} = ${b} + ${a} riktig?`, true, {expl:`Begge sider er ${a + b}.`});
     if(k === 4) return Q.yn(`Kan vi sammenligne 1 m og 90 cm uten å gjøre om enheter?`, false, {expl:'Nei. Vi må bruke samme enhet: 100 cm og 90 cm.'});
     return Q.choice(r, 'Hva gjør du før du sammenligner to regnestykker?', 'Regner ut begge sider', ['Bytter plass', 'Plusser dem', 'Gjetter'], {expl:'Regn ut verdiene, og sammenlign dem.'});
   }},
   {t:'Mengder', d:'Sammenlign mengder med tegn.', n:10, make:(r, i) => {
     const a = int(r, 2, 12), b = int(r, 2, 12), e1 = pick(r, ['🍎', '⭐', '🔵']), e2 = pick(r, ['🍌', '🌸', '🟠']);
     return Q.choice(r, `${G.objs(e1, a, {per:6, s:'1.3rem'})} &nbsp; ○ &nbsp; ${G.objs(e2, b, {per:6, s:'1.3rem'})}<br>Hvilket tegn passer? (${a} ○ ${b})`, sym(a, b), ['>', '<', '='], {keep:true, say:`Sammenlign: ${a} og ${b}. Hvilket tegn passer?`, expl:`${a} ${sym(a, b) === '>' ? 'er større enn' : sym(a, b) === '<' ? 'er mindre enn' : 'er lik'} ${b}.`});
   }},
   {t:'Tall', d:'Sammenlign tall opp til 1000.', n:10, make:(r, i) => {
     const lim = i % 2 ? 99 : 999, a = int(r, 11, lim), b = r() < .15 ? a : (r() < .5 ? a + int(r, 1, 20) : int(r, 11, lim));
     return Q.choice(r, `Hvilket tegn passer? &nbsp; <b>${a} ○ ${b}</b>`, sym(a, b), ['>', '<', '='], {keep:true, say:`Er ${a} større enn, mindre enn eller lik ${b}?`, expl:`${a} ${sym(a, b) === '>' ? 'er større enn' : sym(a, b) === '<' ? 'er mindre enn' : 'er lik'} ${b}. Sammenlign fra venstre.`});
   }},
   {t:'Uttrykk', d:'Regn ut begge sider og sammenlign.', n:10, make:(r, i) => {
     const k = i % 3; let L, R, vl, vr;
     if(k === 0){ const a = int(r, 2, 9), b = int(r, 2, 9), c = int(r, 2, 9), d = int(r, 2, 9); L = `${a} + ${b}`; R = `${c} + ${d}`; vl = a + b; vr = c + d; }
     else if(k === 1){ const a = int(r, 2, 6), b = int(r, 2, 6), c = int(r, 2, 6), d = int(r, 2, 6); L = `${a} × ${b}`; R = `${c} × ${d}`; vl = a * b; vr = c * d; }
     else { const a = int(r, 2, 5), b = int(r, 2, 5), c = int(r, 3, 15); L = `${a} × ${b}`; R = `${c} + ${int(r, 1, 6)}`; vl = a * b; vr = eval(R); }
     return Q.choice(r, `Hvilket tegn passer? &nbsp; <b>${L} ○ ${R}</b>`, sym(vl, vr), ['>', '<', '='], {keep:true, say:`Sammenlign ${L.replace('×', 'ganger').replace('+', 'pluss')} og ${R.replace('×', 'ganger').replace('+', 'pluss')}`, expl:`${L} = ${vl}. ${R} = ${vr}. ${vl} ${sym(vl, vr) === '>' ? 'er større enn' : sym(vl, vr) === '<' ? 'er mindre enn' : 'er lik'} ${vr}.`});
   }},
   {t:'Størrelser', d:'Sammenlign lengder, masse og tid.', n:10, make:(r, i) => {
     const k = i % 3;
     if(k === 0){ const m = int(r, 1, 3), c = pick(r, [m * 100 - 20, m * 100, m * 100 + 30, m * 100 + 50]); return Q.choice(r, `Hvilket tegn passer? &nbsp; <b>${m} m ○ ${c} cm</b>`, sym(m * 100, c), ['>', '<', '='], {keep:true, say:`Sammenlign ${m} meter og ${c} centimeter`, expl:`${m} m = ${m * 100} cm. ${m * 100} ${sym(m * 100, c) === '>' ? 'er større enn' : sym(m * 100, c) === '<' ? 'er mindre enn' : 'er lik'} ${c}.`}); }
     if(k === 1){ const kg = int(r, 1, 3), g = pick(r, [kg * 1000 - 100, kg * 1000, kg * 1000 + 200, kg * 1000 + 500]); return Q.choice(r, `Hvilket tegn passer? &nbsp; <b>${kg} kg ○ ${g} g</b>`, sym(kg * 1000, g), ['>', '<', '='], {keep:true, say:`Sammenlign ${kg} kilogram og ${g} gram`, expl:`${kg} kg = ${kg * 1000} g.`}); }
     const t = int(r, 1, 3), mn = pick(r, [t * 60 - 10, t * 60, t * 60 + 15, t * 60 + 30]); return Q.choice(r, `Hvilket tegn passer? &nbsp; <b>${t} time${t > 1 ? 'r' : ''} ○ ${mn} minutter</b>`, sym(t * 60, mn), ['>', '<', '='], {keep:true, say:`Sammenlign ${t} time${t > 1 ? 'r' : ''} og ${mn} minutter`, expl:`${t} time${t > 1 ? 'r' : ''} = ${t * 60} minutter.`});
   }},
   {t:'Finn tall som passer', d:'Hvilket tall passer mellom grensene?', n:10, make:(r, i) => {
     const lo = int(r, 10, 90), w = int(r, 3, 6), ok = lo + int(r, 1, w - 1), others = [lo - 1, lo, lo + w, lo + w + 2].filter(x => x !== ok);
     return Q.choice(r, `Hvilket tall passer? &nbsp; <b>${lo} &lt; ☐ &lt; ${lo + w}</b>`, ok, shuf(r, others).slice(0, 3), {sort:true, nums:true, say:`Hvilket tall passer mellom ${lo} og ${lo + w}?`, expl:`Tallet må være større enn ${lo} og mindre enn ${lo + w}: ${ok} passer.`});
   }}
  ]
});

/* ======================================================================
   Likevekt (KM13250)
   ====================================================================== */
const bal = (l, r, lv, rv) => G.balance(l, r, lv, rv);
MT.module({
  id:'likevekt', rek:128, trinn:[3], maal:['KM13250'], tittel:'Likevekt: tall som mangler på vekta', ikon:'🧮', bygger:['likhetstegn', 'ulikhet'],
  video:[
   {html:title('🧮', 'Likevekt', S.sub('Balansevekta og tall som mangler', 1.2)),
    no:'Nå skal vi utforske likevekt. En vekt er i likevekt når begge sidene veier like mye. Vi skal bruke vekta til å finne tall som mangler.'},
   {html:sc(S.pop(bal('5', '3 + 2', 5, 5), .2), S.sub('Begge sider er 5: likevekt', 1.6)),
    no:'Her har vi fem på den ene siden, og tre pluss to på den andre. Begge sider veier fem. Vekta er i likevekt. Det er det samme som at fem er lik tre pluss to.'},
   {html:sc(S.pop(bal('☐ + 3', '8', 8, 8), .2), S.sub('Hva må ☐ være? 8 − 3 = 5', 1.6)),
    no:'Nå mangler det noe. På den ene siden ligger en ukjent boks og tre. På den andre siden ligger åtte. Vekta er i likevekt. Hva veier boksen? Åtte minus tre er fem. Boksen veier fem.'},
   {html:sc(S.pop(bal('5', '2', 5, 2), .2), S.sub('Ikke likevekt: 5 er tyngre enn 2', 1.6)),
    no:'Hvis sidene ikke veier like mye, heller vekta. Fem er tyngre enn to, så den siden går ned.'},
   {html:sc(S.row(S.pop(G.eq('5 på venstre, 2 på høyre', '#f97316'), .2)), S.row(S.pop(G.eq('legg til 3 på høyre', '#16a34a'), 1.2)), S.pop(bal('5', '2 + 3', 5, 5), 2), S.sub('Likevekt igjen', 3)),
    no:'Hva må vi gjøre for å få likevekt igjen? Det mangler tre på den lette siden. Vi legger tre til på høyre side. Nå er det fem på begge sider.'},
   {html:sc(S.row(S.pop(bal('6', '2 + 4', 6, 6), .2)), S.row(S.pop(G.eq('legg 5 på begge sider', '#2563eb'), 1.2)), S.pop(bal('6 + 5', '2 + 4 + 5', 11, 11), 2), S.sub('Det samme på begge sider – fortsatt likevekt', 3)),
    no:'Når vekta er i likevekt, kan vi legge det samme på begge sider, og den holder seg i likevekt. Vi kan også ta bort det samme fra begge sider. Dette er en kjempelur regel når vi skal finne tall som mangler.'},
   {html:sc(S.row(S.pop(G.eq('4 + ☐ = 11', '#2563eb'), .2)), S.row(S.pop(G.eq('ta bort 4 fra begge sider', '#16a34a'), 1.2)), S.big('☐ = 7', 2.2)),
    no:'Så kan vi finne ukjente tall. Fire pluss boks er elleve. Vi tar bort fire fra begge sider. Da står boks igjen på den ene siden, og sju på den andre. Boksen er sju.'},
   {html:sc(S.big('Likevekt: det samme på begge sider', .2), S.sub('Nå øver vi!', 1.2)),
    no:'Husk: i likevekt er begge sider like mye. Det vi gjør på den ene siden, må vi gjøre på den andre. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal utforske <b>likevekt</b> med tallsymboler, tegning og konkreter, og oversette mellom dem.',
   steg:['Vekta er i <b>likevekt</b> når begge sider veier like mye (=).', 'En side som er tyngst, <b>går ned</b>.', '<b>Ukjent:</b> ☐ + 3 = 8 → ta bort 3 fra begge sider → ☐ = 5.', 'Det du legger til eller tar bort, må du gjøre på <b>begge sider</b>.', 'Oversett mellom vekt, tall og likning.'],
   eks:[bal('☐ + 3', '8', 8, 8) + '<br>☐ + 3 = 8, så ☐ = 5', bal('6', '2 + 4', 6, 6) + '<br>6 = 2 + 4'],
   ord:[['likevekt', 'begge sider veier like mye'], ['ukjent tall', 'tallet vi leter etter (☐)'], ['likning', 'to uttrykk som er like, med et tall som mangler']],
   feil:['«☐ + 3 = 8, så ☐ = 8 + 3» – ta bort 3 fra begge sider: 8 − 3.', '«Jeg legger bare til på den ene siden» – du må gjøre det samme på begge sider.'],
   laerer:'KM13250: utforske likevekt med tallsymboler, tegning og konkreter (balansevekt) og oversette mellom dem. Forberedelse til likninger. Bruk en ekte balansevekt med klosser og en ukjent «pose».'
  },
  refleksjon:'Tegn en balansevekt for 7 = 4 + ☐, og finn tallet som mangler.',
  nivaaer:[
   {t:'Forstå: likevekt', d:'Sjekk at du har forstått.', kind:'forstaa', make:(r, i) => {
     const a = int(r, 3, 9), b = int(r, 2, 6), k = i % 5;
     if(k === 0) return Q.choice(r, 'Hva betyr det at vekta er i likevekt?', 'Begge sider veier like mye', ['Den ene siden er tyngst', 'Vekta er tom', 'Den er ødelagt'], {expl:'I likevekt er begge sider like mye verdt.'});
     if(k === 1) return Q.yn(`Du legger ${b} på bare én side av en vekt i likevekt. Heller vekta?`, true, {say:`Du legger ${b} på bare én side av en vekt i likevekt. Heller vekta?`, expl:'Ja. Den siden blir tyngst.'});
     if(k === 2) return Q.yn(`Vekta er i likevekt. Du legger ${b} på begge sider. Er den fortsatt i likevekt?`, true, {expl:'Ja. Du gjorde det samme på begge sider.'});
     if(k === 3) return Q.choice(r, `Vekta har ${a} på venstre og ${a - b} på høyre. Hva må du gjøre for å få likevekt?`, `Legge ${b} på høyre side`, [`Legge ${b} på venstre side`, `Ta bort ${a - b}`, 'Ingenting'], {say:`Vekta har ${a} på venstre og ${a - b} på høyre. Hva må du gjøre for å få likevekt?`, expl:`${a - b} + ${b} = ${a}.`});
     return Q.yn(`Er 3 + 4 = 7 en vekt i likevekt?`, true, {expl:'Ja. Begge sider er 7.'});
   }},
   {t:'Les vekta', d:'Finn tallet som mangler.', n:10, make:(r, i) => {
     const a = int(r, 2, 9), x = int(r, 2, 9), s = a + x;
     if(i % 2 === 0) return Q.num(`${bal('☐ + ' + a, s, s, s)}<br>Vekta er i likevekt. Hva veier ☐? {?}`, x, {chk:`_+${a}===${s}`, say:`Vekta er i likevekt. Hva veier boksen?`, expl:`${s} − ${a} = ${x}.`, hint:`Ta bort ${a} fra begge sider.`});
     return Q.num(`${bal(a + ' + ☐', s, s, s)}<br>Vekta er i likevekt. Hva veier ☐? {?}`, x, {chk:`${a}+_===${s}`, say:`Vekta er i likevekt. Hva veier boksen?`, expl:`${s} − ${a} = ${x}.`, hint:`Ta bort ${a} fra begge sider.`});
   }},
   {t:'Fra vekt til likning', d:'Hvilken likning passer til vekta?', n:10, make:(r, i) => {
     const a = int(r, 2, 8), x = int(r, 2, 8), s = a + x;
     return Q.choice(r, `${bal('☐ + ' + a, s, s, s)}<br>Hvilken likning passer til vekta?`, `☐ + ${a} = ${s}`, [`☐ − ${a} = ${s}`, `${a} − ☐ = ${s}`, `☐ + ${s} = ${a}`], {say:'Hvilken likning passer til vekta?', expl:`Venstre side er ☐ + ${a}, høyre side er ${s}.`});
   }},
   {t:'Få vekta i likevekt', d:'Hvor mye må du legge til?', n:10, make:(r, i) => {
     const hi = int(r, 6, 15), lo = int(r, 2, hi - 2), d = hi - lo, left = i % 2 === 0;
     return Q.num(`${left ? bal(hi, lo, hi, lo) : bal(lo, hi, lo, hi)}<br>Hvor mye må du legge til på den ${left ? 'høyre' : 'venstre'} siden for å få likevekt? {?}`, d, {say:`Hvor mye må du legge til på den ${left ? 'høyre' : 'venstre'} siden for å få likevekt?`, calc:`${hi}-${lo}`, expl:`${hi} − ${lo} = ${d}. ${lo} + ${d} = ${hi}.`});
   }},
   {t:'Det samme på begge sider', d:'Likevekt og regler for ukjente tall.', n:10, make:(r, i) => {
     const a = int(r, 2, 8), x = int(r, 2, 9), s = a + x, k = i % 3;
     if(k === 0) return Q.num(`${a} + ☐ = ${s}. Tar du bort ${a} fra begge sider, står ☐ = {?}`, x, {chk:`${s}-${a}===_`, say:`${a} pluss boks er ${s}. Tar du bort ${a} fra begge sider, hva er boksen?`, expl:`${s} − ${a} = ${x}.`});
     if(k === 1) return Q.yn(`${a} + ${x} = ${s}. Legger du ${a + 1} på begge sider, er det fortsatt likevekt?`, true, {expl:'Ja. Det samme på begge sider.'});
     return Q.num(`☐ + ${a} = ${s}. Hva er ☐? {?}`, x, {chk:`_+${a}===${s}`, say:`Boks pluss ${a} er ${s}. Hva er boksen?`, expl:`${s} − ${a} = ${x}.`});
   }}
  ]
});
})();
