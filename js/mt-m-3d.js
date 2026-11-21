(function(){
'use strict';
/* Moduler 3. trinn (resten): areal, koordinatsystem og instruksjoner i koordinatsystemet (KM13253, KM13251, KM13252) */
const A = window.App, MT = window.MT, G = MT.G, Q = MT.Q, S = MT.S, B = MT.B;
const {int, pick, shuf} = MT, {sc, pop, fade, big, sub, row, chip, title} = S;
const uniq = a => a.filter((x, i) => a.indexOf(x) === i);
const range = (a, b) => Array.from({length:b - a + 1}, (_, i) => a + i);
const rect = (w, h, x0, y0) => { const c = []; for(let y = 0; y < h; y++) for(let x = 0; x < w; x++) c.push([(x0 || 0) + x, (y0 || 0) + y]); return c; };
// L-figur: søyle a bred og H høy, med bunn W bred og b høy
const lshape = (a, H, W, b) => { const k = new Set(); rect(a, H).concat(rect(W, b, 0, H - b)).forEach(c => k.add(c[0] + ',' + c[1])); return [...k].map(s => s.split(',').map(Number)); };

/* ======================================================================
   Måle areal (KM13253)
   ====================================================================== */
MT.module({
  id:'maale-areal', rek:130, trinn:[3], maal:['KM13253'], tittel:'Måle areal: hvor mye flate?', ikon:'🟦', bygger:['maale-lengde', 'gange-grupper'],
  video:[
   {html:title('🟦', 'Måle areal', S.sub('Hvor stor er flaten?', 1.2)),
    no:'Nå skal vi måle areal. Areal forteller hvor stor en flate er, altså hvor mye plass den tar på et underlag.'},
   {html:sc(S.pop(G.areaGrid({w:4, h:3}), .2), S.sub('Dekk flaten med like store ruter og tell dem: 12 ruter', 1.6)),
    no:'Vi kan måle areal ved å dekke flaten med like store ruter. Her er det tolv ruter. Arealet er tolv ruter.'},
   {html:sc(S.row(S.pop('<span style="font-size:3rem">🟫</span>', .2), S.pop('<span style="font-size:3rem">📄</span>', 1)), S.sub('Fliser, post-it-lapper, ark: ikke-standard måleenheter', 1.8), S.sub('Rutene må være like store!', 3)),
    no:'Vi kan bruke fliser, lapper eller ark som måleenhet. Men rutene må være like store, og vi må dekke flaten uten hull og uten å legge dem oppå hverandre.'},
   {html:sc(S.pop(G.areaGrid({w:5, h:3, dim:true}), .2), S.sub('Standard enhet: kvadratcentimeter (cm²) – en rute er 1 cm × 1 cm', 1.4)),
    no:'Matematikere bruker en felles enhet: kvadratcentimeter. En kvadratcentimeter er en rute som er en centimeter bred og en centimeter høy. Dette rektanglet er fem centimeter bredt og tre centimeter høyt.'},
   {html:sc(S.pop(G.areaGrid({w:5, h:3, dim:true}), .2), S.row(S.pop(G.eq('3 rader med 5 ruter', '#2563eb'), 1.2), S.pop(G.eq('3 × 5 = 15 cm²', '#16a34a'), 2))),
    no:'Vi trenger ikke å telle hver rute. Det er tre rader med fem ruter i hver rad. Det er gange! Tre ganger fem er femten. Arealet er femten kvadratcentimeter.'},
   {html:sc(S.pop(G.areaGrid({cells:lshape(2, 4, 5, 2), s:26}), .2), S.row(S.pop(G.eq('søylen: 2 × 4 = 8', '#2563eb'), 1.2), S.pop(G.eq('resten: 3 × 2 = 6', '#f97316'), 2)), S.big('8 + 6 = 14', 2.8)),
    no:'Figurer som ikke er rektangler, kan vi dele opp. Her deler vi figuren i to rektangler. Det første er to ganger fire, åtte. Det andre er tre ganger to, seks. Åtte pluss seks er fjorten ruter.'},
   {html:sc(S.row(S.pop(G.areaGrid({w:4, h:3, s:22}), .2), S.pop(G.areaGrid({w:3, h:3, s:22}), 1)), S.row(S.pop(G.eq('12 > 9', '#16a34a'), 1.8)), S.sub('Sammenlign arealer: den med flest ruter er størst', 2.6)),
    no:'Vi kan sammenligne arealer. Den første figuren har tolv ruter og den andre har ni. Tolv er mer enn ni, så den første har størst areal.'},
   {html:sc(S.row(S.pop(G.eq('1 m² = 1 m × 1 m', '#2563eb'), .2), S.pop('<span style="font-size:3rem">🏫</span>', 1)), S.sub('Store flater: kvadratmeter (m²)', 2)),
    no:'Store flater, som et gulv, måler vi i kvadratmeter. En kvadratmeter er en rute som er en meter bred og en meter lang. Små flater måler vi i kvadratcentimeter. Nå skal du øve på areal!'}
  ],
  tekst:{
   mal:'Du skal måle <b>areal</b> i praktiske situasjoner med ikke-standardiserte (fliser, lapper) og standardiserte enheter (cm², m²).',
   steg:['Areal = hvor mange <b>like store ruter</b> som dekker flaten (uten hull og overlapp).', 'Standard enhet: <b>cm²</b> (1 cm × 1 cm) for små flater og <b>m²</b> (1 m × 1 m) for store.', '<b>Rektangel:</b> rader × ruter i hver rad. 3 × 5 = 15 cm².', 'Sammensatt figur: <b>del opp</b> i rektangler og legg sammen.', 'Sammenlign arealer: tell eller regn ut, og sammenlign.'],
   eks:[G.areaGrid({w:5, h:3, dim:true, s:24}) + '<br>3 × 5 = 15 cm²', G.areaGrid({cells:lshape(2, 4, 5, 2), s:22}) + '<br>8 + 6 = 14 ruter'],
   ord:[['areal', 'hvor stor en flate er'], ['kvadratcentimeter (cm²)', 'rute på 1 cm × 1 cm'], ['kvadratmeter (m²)', 'rute på 1 m × 1 m']],
   feil:['«Areal er det samme som omkrets» – areal er flaten inni (ruter), omkrets er veien rundt.', '«Fliser av ulik størrelse går fint» – enhetene må være like store.'],
   laerer:'KM13253: måle arealer i praktiske situasjoner. Start med å dekke flater (fliser, post-it) og tell, før formelen «rader × ruter». Skill tydelig mellom areal (ruter) og lengde/omkrets. Bruk kvadratcentimeter-papir.'
  },
  refleksjon:'Hvordan kan du finne arealet til bordet ditt uten linjal? Hva kan du bruke som enhet?',
  nivaaer:[
   {t:'Forstå: hva er areal?', d:'Sjekk at du har forstått areal.', kind:'forstaa', make:(r, i) => {
     const w = int(r, 2, 6), h = int(r, 2, 5), k = i % 6;
     if(k === 0) return Q.choice(r, 'Hva forteller areal?', 'Hvor stor en flate er', ['Hvor lang en strek er', 'Hvor tung noe er', 'Hvor høyt noe er'], {expl:'Areal er størrelsen på en flate.'});
     if(k === 1) return Q.yn('Må rutene som dekker en flate være like store?', true, {expl:'Ja. Ellers kan vi ikke sammenligne.'});
     if(k === 2) return Q.choice(r, 'Hvilken enhet bruker vi for små flater?', 'cm²', ['cm', 'kg', 'liter'], {expl:'Kvadratcentimeter, cm², er en rute på 1 cm × 1 cm.'});
     if(k === 3) return Q.yn(`Har et rektangel på ${w} cm × ${h} cm areal ${w * h} cm²?`, true, {expl:`${h} rader med ${w}: ${w} × ${h} = ${w * h}.`});
     if(k === 4) return Q.choice(r, 'Hvilken enhet passer for å måle arealet av et gulv?', 'm²', ['cm', 'g', 'dl'], {expl:'Store flater måler vi i kvadratmeter.'});
     return Q.yn('Er areal det samme som lengden rundt figuren?', false, {expl:'Nei. Lengden rundt kalles omkrets. Areal er flaten innenfor.'});
   }},
   {t:'Tell rutene', d:'Hvor mange ruter dekker figuren?', n:10, make:(r, i) => {
     const cells = i % 3 === 2 ? lshape(int(r, 1, 2), int(r, 3, 4), int(r, 3, 5), int(r, 1, 2)) : rect(int(r, 2, 6), int(r, 2, 4));
     return Q.num(`${G.areaGrid({cells, s:30})}<br>Hvor mange ruter er arealet? {?}`, cells.length, {say:'Hvor mange ruter er arealet?', expl:`Tell rutene: ${cells.length}.`});
   }},
   {t:'Rektangel: rader × ruter', d:'Regn ut arealet i cm².', n:10, make:(r, i) => {
     const w = int(r, 2, 8), h = int(r, 2, 6);
     if(i % 2 === 0) return Q.num(`${G.areaGrid({w, h, dim:true, s:24})}<br>Hva er arealet? {?} cm²`, w * h, {say:'Hva er arealet i kvadratcentimeter?', calc:`${w}*${h}`, expl:`${h} rader med ${w} ruter: ${h} × ${w} = ${w * h} cm².`});
     return Q.num(`Et rektangel er ${w} cm bredt og ${h} cm høyt. Hvor stort er arealet? {?} cm²`, w * h, {say:`Et rektangel er ${w} centimeter bredt og ${h} centimeter høyt. Hvor stort er arealet?`, calc:`${w}*${h}`, expl:`${w} × ${h} = ${w * h} cm².`, hint:G.areaGrid({w:Math.min(w, 8), h, s:18})});
   }},
   {t:'Sammensatte figurer', d:'Del opp i rektangler.', n:10, make:(r, i) => {
     const a = int(r, 1, 3), H = int(r, 3, 5), W = a + int(r, 2, 4), b = int(r, 1, H - 1), cells = lshape(a, H, W, b), area = a * H + (W - a) * b;
     if(i % 2 === 0) return Q.num(`${G.areaGrid({cells, s:26})}<br>Hvor mange ruter er arealet? {?}`, area, {say:'Hvor mange ruter er arealet?', calc:`${a * H}+${(W - a) * b}`, expl:`Søylen: ${a} × ${H} = ${a * H}. Resten: ${W - a} × ${b} = ${(W - a) * b}. Til sammen ${area}.`, hint:'Del figuren i to rektangler.'});
     return Q.num(`En L-figur består av et rektangel på ${a} × ${H} ruter og et på ${W - a} × ${b} ruter. Hvor mange ruter er det til sammen? {?}`, area, {say:`En L-figur består av et rektangel på ${a} ganger ${H} ruter og et på ${W - a} ganger ${b} ruter. Hvor mange ruter er det til sammen?`, calc:`${a}*${H}+${(W - a)}*${b}`, expl:`${a * H} + ${(W - a) * b} = ${area}.`});
   }},
   {t:'Sammenlign arealer', d:'Hvilken figur har størst areal?', n:10, make:(r, i) => {
     const w1 = int(r, 2, 6), h1 = int(r, 2, 4), w2 = int(r, 2, 6), h2 = int(r, 2, 4), a1 = w1 * h1, a2 = w2 * h2; if(a1 === a2) return null;
     if(i % 2 === 0) return Q.choice(r, `${G.areaGrid({w:w1, h:h1, s:20})} &nbsp; ${G.areaGrid({w:w2, h:h2, s:20, c:'#fbbf24'})}<br>Hvilken figur har størst areal?`, a1 > a2 ? 'Blå figur' : 'Gul figur', ['Blå figur', 'Gul figur'], {keep:true, say:'Hvilken figur har størst areal?', expl:`Blå: ${a1} ruter. Gul: ${a2} ruter.`});
     return Q.num(`Rektangel A er ${w1} × ${h1} cm. Rektangel B er ${w2} × ${h2} cm. Hvor mange cm² har det største mer enn det minste? {?}`, Math.abs(a1 - a2), {say:`Rektangel A er ${w1} ganger ${h1} centimeter. Rektangel B er ${w2} ganger ${h2} centimeter. Hvor mange kvadratcentimeter har det største mer enn det minste?`, calc:`${Math.max(a1, a2)}-${Math.min(a1, a2)}`, expl:`A: ${a1} cm². B: ${a2} cm². Forskjellen er ${Math.abs(a1 - a2)}.`});
   }},
   {t:'cm² og m²', d:'Velg enhet.', n:10, make:(r, i) => {
     const T = [['et frimerke', 'cm²'], ['et gulv i et klasserom', 'm²'], ['et ark', 'cm²'], ['en fotballbane', 'm²'], ['en post-it-lapp', 'cm²'], ['en stue', 'm²'], ['et bokomslag', 'cm²'], ['en skolegård', 'm²'], ['en lekeplass', 'm²'], ['et visittkort', 'cm²']], t = pick(r, T);
     return Q.choice(r, `Hvilken enhet passer best for å måle arealet av ${t[0]}?`, t[1], [t[1] === 'cm²' ? 'm²' : 'cm²'], {keep:false, say:`Hvilken enhet passer best for å måle arealet av ${t[0]}?`, expl:t[1] === 'cm²' ? 'Små flater måler vi i cm².' : 'Store flater måler vi i m².'});
   }}
  ],
  drill:{tittel:'Areal av rektangler', layout:{a:'pic', b:'row'}, cols:{a:3, b:3}, n:[24, 30], make:(r, i, hard) => {
    const w = int(r, 2, hard ? 12 : 7), h = int(r, 2, hard ? 9 : 5);
    return hard ? {t:`Areal av ${w} × ${h} cm =`, ans:w * h} : {t:`${h} × ${w} =`, ans:w * h, pic:G.areaGrid({w, h, s:12})}; }}
});

/* ======================================================================
   Koordinatsystem (KM13251)
   ====================================================================== */
const P = (x, y) => `(${x}, ${y})`;
const COL = ['#ef4444', '#2563eb', '#16a34a', '#9333ea'];
MT.module({
  id:'koordinatsystem', rek:132, trinn:[3], maal:['KM13251'], tittel:'Koordinatsystem: navngi og plassere punkter', ikon:'📍', bygger:['tallinje'],
  video:[
   {html:title('📍', 'Koordinatsystem', S.sub('Finn punkter med to tall', 1.2)),
    no:'Nå skal vi lære om koordinatsystemet. Det er en måte å si nøyaktig hvor et punkt er, ved hjelp av to tall.'},
   {html:sc(S.pop(G.coord(6, {}), .2), S.sub('To tallinjer: x bortover, y oppover. De møtes i 0.', 1.6)),
    no:'Et koordinatsystem har to tallinjer. Den ene går bortover, og kalles x-aksen. Den andre går oppover, og kalles y-aksen. De møtes i null. Det punktet kalles origo.'},
   {html:sc(S.pop(G.coord(6, {points:[{x:3, y:2, t:'A (3, 2)'}], path:[[0, 0], [3, 0], [3, 2]]}), .2), S.sub('Først bort 3, så opp 2: punktet (3, 2)', 1.6)),
    no:'For å finne et punkt går vi først bortover og så oppover. Punktet A: tre bort og to opp. Vi skriver tre komma to, i parentes. De to tallene kalles koordinater.'},
   {html:sc(S.pop(G.coord(6, {points:[{x:3, y:2, t:'(3, 2)', c:'#ef4444'}, {x:2, y:3, t:'(2, 3)', c:'#2563eb'}]}), .2), S.sub('(3, 2) og (2, 3) er ulike punkter. Rekkefølgen er viktig!', 1.6)),
    no:'Rekkefølgen er viktig. Tre komma to og to komma tre er ikke det samme punktet. Det første tallet er alltid bortover, og det andre er alltid oppover.'},
   {html:sc(S.pop(G.coord(6, {points:[{x:0, y:4, t:'(0, 4)'}, {x:5, y:0, t:'(5, 0)', c:'#16a34a'}]}), .2), S.sub('Punkter på aksene: ett av tallene er 0', 1.6)),
    no:'Punkter på aksene har null som den ene koordinaten. Null komma fire ligger på y-aksen. Fem komma null ligger på x-aksen.'},
   {html:sc(S.pop(G.coord(6, {points:[{x:1, y:1, t:'A'}, {x:5, y:1, t:'B', c:'#2563eb'}, {x:5, y:4, t:'C', c:'#16a34a'}, {x:1, y:4, t:'D', c:'#9333ea'}], path:[[1, 1], [5, 1], [5, 4], [1, 4]], close:true}), .2), S.sub('Punkter kan danne figurer: her et rektangel', 1.6)),
    no:'Vi kan sette punkter sammen til figurer. Her er fire punkter som danner et rektangel: A, B, C og D. Vi kan navngi hvert punkt med en bokstav og koordinater.'},
   {html:sc(S.row(S.pop(G.eq('Eksperimenter: flytt punktet!', '#2563eb'), .2)), S.row(S.pop(G.eq('(2, 2) → 3 bort → (5, 2)', '#f97316'), 1.2), S.pop(G.eq('(5, 2) → 2 opp → (5, 4)', '#f97316'), 2.2)), S.sub('Flytter vi bort, endres første tall. Flytter vi opp, endres andre tall.', 3.2)),
    no:'Vi kan eksperimentere. Flytter vi et punkt bortover, endres det første tallet. Flytter vi det oppover, endres det andre tallet. Prøv selv!'},
   {html:sc(S.big('(bort, opp)', .2), S.sub('Nå øver vi!', 1.2)),
    no:'Husk: først bort, så opp. Nå skal du øve på å lese og plassere punkter i koordinatsystemet!'}
  ],
  tekst:{
   mal:'Du skal <b>eksperimentere med, navngi og plassere punkter</b> i koordinatsystemet.',
   steg:['To tallinjer: <b>x</b> (bortover) og <b>y</b> (oppover). De møtes i <b>origo (0, 0)</b>.', 'Et punkt har to <b>koordinater</b>: (<b>x</b>, <b>y</b>) = (bort, opp).', 'Les av: gå <b>først bortover</b>, <b>så oppover</b>.', 'Rekkefølgen er viktig: (3, 2) ≠ (2, 3).', 'Flytter du bortover, endres x. Flytter du oppover, endres y.'],
   eks:[G.coord(5, {s:28, points:[{x:3, y:2, t:'(3, 2)'}]}), 'Origo er (0, 0).'],
   ord:[['koordinatsystem', 'to tallinjer som står vinkelrett på hverandre'], ['koordinater', 'de to tallene som viser hvor et punkt er'], ['x-akse / y-akse', 'tallinja bortover / oppover'], ['origo', 'punktet (0, 0)']],
   feil:['«(3, 2) betyr 2 bort og 3 opp» – første tall er bortover (x), andre er oppover (y).', '«Jeg leser av y først» – x kommer alltid først.'],
   laerer:'KM13251: eksperimentere med, navngi og plassere punkter i første kvadrant. Bruk en minnekrok: «først bort, så opp» (eller «gå inn døra, så opp trappa»). La elevene plassere punkter selv og lage figurer.'
  },
  refleksjon:'Plasser tre punkter i et koordinatsystem. Skriv koordinatene deres, og forklar hvordan du fant dem.',
  nivaaer:[
   {t:'Forstå: x og y', d:'Sjekk at du har forstått koordinatene.', kind:'forstaa', make:(r, i) => {
     const x = int(r, 1, 5), y = int(r, 1, 5), k = i % 6;
     if(k === 0) return Q.choice(r, `Hva betyr punktet <b>${P(x, y)}</b>?`, `${x} bort og ${y} opp`, [`${y} bort og ${x} opp`, `${x} opp og ${y} bort`, `${x + y} bort`], {say:`Hva betyr punktet ${x} komma ${y}?`, expl:`Først bortover (${x}), så oppover (${y}).`});
     if(k === 1) return Q.choice(r, 'Hvilket tall kommer først i koordinatene?', 'Det som sier hvor langt bortover', ['Det som sier hvor langt oppover', 'Det største tallet', 'Det minste tallet'], {expl:'x kommer først.'});
     if(k === 2) return Q.yn(`Er ${P(x, y)} og ${P(y, x)} det samme punktet?`, x === y, {say:`Er ${x} komma ${y} og ${y} komma ${x} det samme punktet?`, expl:x === y ? 'Ja, her er tallene like.' : 'Nei. Rekkefølgen er viktig.'});
     if(k === 3) return Q.choice(r, 'Hva kaller vi punktet (0, 0)?', 'Origo', ['Toppen', 'Midten av y-aksen', 'Enden'], {expl:'Origo er der aksene møtes.'});
     if(k === 4) return Q.choice(r, 'Hvilken akse går bortover?', 'x-aksen', ['y-aksen', 'Begge', 'Ingen'], {expl:'x-aksen er den vannrette.'});
     return Q.yn(`Ligger punktet (${x}, 0) på x-aksen?`, true, {expl:'Ja. y = 0 betyr at punktet ligger på x-aksen.'});
   }},
   {t:'Les av punktet', d:'Hvilke koordinater har punktet?', n:10, make:(r, i) => {
     const x = int(r, 0, 6), y = int(r, 0, 6), opts = shuf(r, uniq([P(y, x), P(x + 1 > 6 ? x - 1 : x + 1, y), P(x, y + 1 > 6 ? y - 1 : y + 1), P(x, y)]).filter(o => o !== P(x, y))).slice(0, 3);
     return Q.choice(r, `${G.coord(6, {points:[{x, y, t:'P'}]})}<br>Hvilke koordinater har punktet P?`, P(x, y), opts, {say:'Hvilke koordinater har punktet P?', expl:`Gå ${x} bortover og ${y} oppover: ${P(x, y)}.`});
   }},
   {t:'Hvilket punkt?', d:'Finn bokstaven som passer til koordinatene.', n:10, make:(r, i) => {
     const set = new Set(); while(set.size < 4) set.add(int(r, 0, 6) + ',' + int(r, 0, 6)); const pts = [...set].map(s => s.split(',').map(Number)), L = ['A', 'B', 'C', 'D'], pick1 = int(r, 0, 3);
     if(pts.some((p, a) => pts.some((q, b) => a !== b && p[0] === q[1] && p[1] === q[0]))) return null;
     return Q.choice(r, `${G.coord(6, {points:pts.map((p, j) => ({x:p[0], y:p[1], t:L[j], c:COL[j]}))})}<br>Hvilket punkt har koordinatene <b>${P(pts[pick1][0], pts[pick1][1])}</b>?`, L[pick1], L, {keep:true, say:`Hvilket punkt har koordinatene ${pts[pick1][0]} komma ${pts[pick1][1]}?`, expl:`${pts[pick1][0]} bort og ${pts[pick1][1]} opp: punkt ${L[pick1]}.`});
   }},
   {t:'Flytt punktet', d:'Hvor havner punktet?', n:10, make:(r, i) => {
     const x = int(r, 0, 3), y = int(r, 0, 3), dx = int(r, 0, 3), dy = int(r, 0, 3); if(dx + dy === 0) return null;
     const ans = P(x + dx, y + dy), opts = shuf(r, uniq([P(x + dy, y + dx), P(x + dx, y), P(x, y + dy), P(x + dx + 1, y + dy)]).filter(o => o !== ans)).slice(0, 3);
     return Q.choice(r, `Punktet ${P(x, y)} flyttes ${dx} bort og ${dy} opp. Hvor havner det?`, ans, opts, {say:`Punktet ${x} komma ${y} flyttes ${dx} bort og ${dy} opp. Hvor havner det?`, expl:`x: ${x} + ${dx} = ${x + dx}. y: ${y} + ${dy} = ${y + dy}. ${ans}.`, hint:G.coord(6, {points:[{x, y, t:'start'}]})});
   }},
   {t:'Figurer i koordinatsystemet', d:'Hvilket punkt mangler?', n:10, make:(r, i) => {
     const x1 = int(r, 0, 2), y1 = int(r, 0, 2), w = int(r, 2, 4), h = int(r, 2, 4), c = [[x1, y1], [x1 + w, y1], [x1 + w, y1 + h], [x1, y1 + h]], miss = int(r, 0, 3), ans = P(c[miss][0], c[miss][1]);
     const opts = shuf(r, uniq([P(c[(miss + 2) % 4][0], c[(miss + 2) % 4][1]), P(c[miss][1], c[miss][0]), P(c[miss][0] + 1, c[miss][1]), P(c[miss][0], c[miss][1] + 1)]).filter(o => o !== ans)).slice(0, 3);
     const shown = c.filter((_, j) => j !== miss);
     return Q.choice(r, `${G.coord(6, {points:shown.map((p, j) => ({x:p[0], y:p[1], t:P(p[0], p[1]), c:COL[j]}))})}<br>Tre hjørner i et rektangel er tegnet. Hvilke koordinater har det fjerde hjørnet?`, ans, opts, {say:'Tre hjørner i et rektangel er tegnet. Hvilke koordinater har det fjerde hjørnet?', expl:`Rektangelet har hjørnene ${c.map(p => P(p[0], p[1])).join(', ')}. Det som mangler er ${ans}.`});
   }},
   {t:'Tallene i koordinatene', d:'x og y.', n:10, make:(r, i) => {
     const x = int(r, 0, 7), y = int(r, 0, 7), k = i % 3;
     if(k === 0) return Q.num(`I punktet ${P(x, y)}: x-koordinaten er {?}`, x, {say:`I punktet ${x} komma ${y}: hva er x-koordinaten?`, expl:`x er det første tallet: ${x}.`});
     if(k === 1) return Q.num(`I punktet ${P(x, y)}: y-koordinaten er {?}`, y, {say:`I punktet ${x} komma ${y}: hva er y-koordinaten?`, expl:`y er det andre tallet: ${y}.`});
     return Q.num(`Hvor mange steg bortover må du gå fra origo (0, 0) til ${P(x, y)}? {?}`, x, {say:`Hvor mange steg bortover må du gå fra origo til ${x} komma ${y}?`, expl:`x = ${x}.`});
   }}
  ]
});

/* ======================================================================
   Regler og instruksjoner i koordinatsystemet (KM13252)
   ====================================================================== */
const SD = {'høyre':[1, 0], 'venstre':[-1, 0], 'opp':[0, 1], 'ned':[0, -1]};
const instr = steps => steps.map(s => `${s[1]} ${s[0]}`).join(', ');
const apply = (st, steps) => { let [x, y] = st; steps.forEach(s => { x += SD[s[0]][0] * s[1]; y += SD[s[0]][1] * s[1]; }); return [x, y]; };
MT.module({
  id:'koordinat-instruksjoner', rek:134, trinn:[3], maal:['KM13252'], tittel:'Regler og instruksjoner i koordinatsystemet', ikon:'🗺️', bygger:['koordinatsystem', 'instruksjoner'],
  video:[
   {html:title('🗺️', 'Instruksjoner i koordinatsystemet', S.sub('Lag og følg regler', 1.2)),
    no:'Nå skal vi bruke koordinatsystemet i lek og spill. Vi skal lage og følge regler og trinnvise instruksjoner for å flytte oss rundt.'},
   {html:sc(S.pop(G.coord(6, {points:[{x:1, y:1, t:'start'}, {x:4, y:3, t:'mål', c:'#16a34a'}], path:[[1, 1], [4, 1], [4, 3]]}), .2), S.sub('Instruksjon: 3 høyre, 2 opp', 1.6)),
    no:'Her starter vi i en, en. Instruksjonen er: tre til høyre, to opp. Først flytter vi oss tre bortover. Da er vi i fire, en. Så to oppover. Da er vi i fire, tre.'},
   {html:sc(S.row(S.pop(G.eq('(1, 1)', '#2563eb'), .2), S.pop('<span style="font-size:2rem;font-weight:900">→</span>', .8), S.pop(G.eq('3 høyre: (4, 1)', '#2563eb'), 1.4), S.pop('<span style="font-size:2rem;font-weight:900">→</span>', 2), S.pop(G.eq('2 opp: (4, 3)', '#16a34a'), 2.6)), S.sub('Høyre og venstre endrer x. Opp og ned endrer y.', 3.6)),
    no:'Husk hva som endres. Når vi flytter til høyre eller venstre, endres det første tallet. Når vi flytter opp eller ned, endres det andre tallet.'},
   {html:sc(S.pop(G.coord(6, {points:[{x:1, y:1, t:'A'}, {x:5, y:1, t:'B', c:'#2563eb'}, {x:5, y:4, t:'C', c:'#16a34a'}, {x:1, y:4, t:'D', c:'#9333ea'}], path:[[1, 1], [5, 1], [5, 4], [1, 4]], close:true}), .2), S.sub('Tegn figur: (1,1) → (5,1) → (5,4) → (1,4) → (1,1)', 1.8)),
    no:'Vi kan også tegne figurer med en instruksjon. Gå til en, en. Så til fem, en. Så til fem, fire. Så til en, fire. Og tilbake til en, en. Da har vi tegnet et rektangel.'},
   {html:sc(S.pop(G.coord(6, {points:[{x:2, y:3, t:'treff!', c:'#dc2626'}, {x:3, y:3, c:'#dc2626'}, {x:4, y:3, c:'#dc2626'}]}), .2), S.sub('Spill «senke skip»: du skyter på (3, 3) – treff!', 1.6)),
    no:'Koordinater brukes også i spill, for eksempel å senke skip. Skipet ligger på tre punkter. Skyter du på tre, tre, er det treff. Skyter du på fem, en, er det forbi.'},
   {html:sc(S.row(S.pop(G.eq('Regel: går du nedover, mister du 1 liv', '#f97316'), .2)), S.sub('Vi kan lage egne regler i leker og spill', 1.6)),
    no:'Vi kan lage egne regler. For eksempel: den som havner på et rødt punkt, må gå tilbake til start. Alle må følge reglene, og reglene må være tydelige.'},
   {html:sc(S.big('Start · instruksjon · mål', .2), S.sub('Nå øver vi!', 1.2)),
    no:'Husk: finn startpunktet, følg instruksjonen steg for steg, og skriv koordinatene til slutt. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal <b>lage og følge regler og trinnvise instruksjoner</b> i lek og spill knyttet til koordinatsystemet.',
   steg:['Finn <b>startpunktet</b>.', 'Følg instruksjonen <b>ett steg om gangen</b>: høyre/venstre endrer <b>x</b>, opp/ned endrer <b>y</b>.', 'Skriv <b>koordinatene</b> til slutt.', 'Figurer tegnes ved å gå fra punkt til punkt.', 'Regler i spill (senke skip): <b>treff</b> når koordinatene er på skipet.'],
   eks:[G.coord(6, {s:26, points:[{x:1, y:1, t:'start'}, {x:4, y:3, t:'mål', c:'#16a34a'}], path:[[1, 1], [4, 1], [4, 3]]}) + '<br>3 høyre, 2 opp: (1, 1) → (4, 3)'],
   ord:[['instruksjon', 'steg du følger i rekkefølge'], ['regel', 'noe alle må følge i en lek eller et spill'], ['treff', 'når du skyter på et punkt der skipet ligger']],
   feil:['«Opp endrer x» – opp og ned endrer y; høyre og venstre endrer x.', '«Jeg byttet x og y i svaret» – skriv (x, y): først bort, så opp.'],
   laerer:'KM13252 knytter «regler og trinnvise instruksjoner» (KM13239) til koordinatsystemet. Spill som «senke skip» og skattejakt gir motivasjon. La elevene lage egne instruksjoner og bytte med en ved siden av.'
  },
  refleksjon:'Lag en instruksjon som flytter en venn fra (1, 1) til (4, 3). Test den!',
  nivaaer:[
   {t:'Forstå: instruksjon og koordinater', d:'Sjekk at du har forstått.', kind:'forstaa', make:(r, i) => {
     const k = i % 5;
     if(k === 0) return Q.choice(r, 'Hva endres når du flytter til høyre?', 'x', ['y', 'Begge', 'Ingen'], {expl:'Høyre og venstre endrer x.'});
     if(k === 1) return Q.choice(r, 'Hva endres når du flytter opp?', 'y', ['x', 'Begge', 'Ingen'], {expl:'Opp og ned endrer y.'});
     if(k === 2) return Q.yn('Spiller det noen rolle hvilket punkt du starter på?', true, {expl:'Ja. Instruksjonen flytter deg fra startpunktet.'});
     if(k === 3) return Q.yn('Må alle spillerne følge de samme reglene?', true, {expl:'Ja. Ellers blir spillet urettferdig.'});
     return Q.choice(r, 'Hva gjør du etter at du har fulgt instruksjonen?', 'Skriver koordinatene til punktet du kom til', ['Starter på nytt', 'Hopper over det siste steget', 'Ingenting'], {expl:'Slutt med å skrive koordinatene (x, y).'});
   }},
   {t:'Følg instruksjonen', d:'Hvor ender du?', n:10, make:(r, i) => {
     const st = [int(r, 1, 3), int(r, 1, 3)], steps = genSteps(r, st, int(r, 2, 3)), end = apply(st, steps), ans = P(end[0], end[1]);
     const opts = shuf(r, uniq([P(end[1], end[0]), P(end[0] + 1 > 6 ? end[0] - 1 : end[0] + 1, end[1]), P(end[0], end[1] + 1 > 6 ? end[1] - 1 : end[1] + 1), P(st[0], st[1])]).filter(o => o !== ans)).slice(0, 3);
     return Q.choice(r, `${G.coord(6, {points:[{x:st[0], y:st[1], t:'start'}]})}<br>Start i ${P(st[0], st[1])}. Instruksjon: <b>${instr(steps)}</b>. Hvor ender du?`, ans, opts, {say:`Start i ${st[0]} komma ${st[1]}. Instruksjon: ${instr(steps)}. Hvor ender du?`, expl:steps.reduce((t, x, j) => { const a2 = apply(st, steps.slice(0, j + 1)); return t + `${x[1]} ${x[0]} → ${P(a2[0], a2[1])}. `; }, '') + `Du ender i ${ans}.`});
   }},
   {t:'Lag instruksjonen', d:'Hvilken instruksjon tar deg til målet?', n:10, make:(r, i) => {
     const st = [int(r, 1, 4), int(r, 1, 4)], goal = [int(r, 1, 5), int(r, 1, 5)]; const dx = goal[0] - st[0], dy = goal[1] - st[1]; if(!dx || !dy) return null;
     const hd = dx > 0 ? 'høyre' : 'venstre', vd = dy > 0 ? 'opp' : 'ned', good = `${Math.abs(dx)} ${hd}, ${Math.abs(dy)} ${vd}`;
     const wrong = uniq([`${Math.abs(dy)} ${hd}, ${Math.abs(dx)} ${vd}`, `${Math.abs(dx)} ${dx > 0 ? 'venstre' : 'høyre'}, ${Math.abs(dy)} ${vd}`, `${Math.abs(dx)} ${hd}, ${Math.abs(dy)} ${dy > 0 ? 'ned' : 'opp'}`, `${Math.abs(dx) + 1} ${hd}, ${Math.abs(dy)} ${vd}`]).filter(x => x !== good).slice(0, 3);
     return Q.choice(r, `${G.coord(6, {points:[{x:st[0], y:st[1], t:'start'}, {x:goal[0], y:goal[1], t:'mål', c:'#16a34a'}]})}<br>Hvilken instruksjon tar deg fra start ${P(st[0], st[1])} til mål ${P(goal[0], goal[1])}?`, good, wrong, {say:`Hvilken instruksjon tar deg fra ${st[0]} komma ${st[1]} til ${goal[0]} komma ${goal[1]}?`, expl:`x: ${st[0]} → ${goal[0]} er ${Math.abs(dx)} ${hd}. y: ${st[1]} → ${goal[1]} er ${Math.abs(dy)} ${vd}.`});
   }},
   {t:'Spillet «senke skip»', d:'Treff eller forbi?', n:10, make:(r, i) => {
     const horiz = r() < .5, x0 = int(r, 1, 3), y0 = int(r, 1, 5), ship = horiz ? [[x0, y0], [x0 + 1, y0], [x0 + 2, y0]] : [[y0 < 4 ? x0 : x0, y0 > 3 ? y0 - 2 : y0], [x0, (y0 > 3 ? y0 - 2 : y0) + 1], [x0, (y0 > 3 ? y0 - 2 : y0) + 2]];
     const hit = r() < .5, shot = hit ? pick(r, ship) : [int(r, 0, 6), int(r, 0, 6)], isHit = ship.some(p => p[0] === shot[0] && p[1] === shot[1]);
     return Q.yn(`${G.coord(6, {points:ship.map(p => ({x:p[0], y:p[1], c:'#dc2626'}))})}<br>Skipet er de røde punktene. Du skyter på <b>${P(shot[0], shot[1])}</b>. Er det treff?`, isHit, {say:`Skipet er de røde punktene. Du skyter på ${shot[0]} komma ${shot[1]}. Er det treff?`, expl:isHit ? `${P(shot[0], shot[1])} er et av skipets punkter: treff!` : `${P(shot[0], shot[1])} er ikke på skipet: forbi.`});
   }},
   {t:'Tegn figuren', d:'Hvilken figur tegner du?', n:10, make:(r, i) => {
     const x = int(r, 0, 2), y = int(r, 0, 2), w = int(r, 2, 4), h = int(r, 2, 4), k = i % 3;
     const pts = k === 2 ? [[x, y], [x + w, y], [x, y + h]] : [[x, y], [x + w, y], [x + w, y + (k === 1 ? w : h)], [x, y + (k === 1 ? w : h)]], name = k === 2 ? 'trekant' : k === 1 ? 'kvadrat' : (w === h ? 'kvadrat' : 'rektangel');
     if(k === 0 && w === h) return null;
     return Q.choice(r, `${G.coord(6, {path:pts, close:true, points:pts.map((p, j) => ({x:p[0], y:p[1], c:COL[j % 4]}))})}<br>Du går ${pts.map(p => P(p[0], p[1])).join(' → ')} og tilbake til start. Hvilken figur tegner du?`, name, ['trekant', 'rektangel', 'kvadrat', 'femkant'].filter(o => o !== name).slice(0, 3), {say:`Du går ${pts.map(p => p[0] + ' komma ' + p[1]).join(', ')} og tilbake til start. Hvilken figur tegner du?`, expl:`${pts.length} punkter gir ${pts.length === 3 ? 'en trekant' : w === h || k === 1 ? 'et kvadrat (alle sidene like lange)' : 'et rektangel'}.`});
   }},
   {t:'Tell stegene', d:'Hvor mange ruter flytter du?', n:10, make:(r, i) => {
     const st = [int(r, 1, 3), int(r, 1, 3)], steps = genSteps(r, st, 3), tot = steps.reduce((a, b) => a + b[1], 0);
     return Q.num(`Instruksjon: <b>${instr(steps)}</b>. Hvor mange ruter flytter du til sammen? {?}`, tot, {say:`Instruksjon: ${instr(steps)}. Hvor mange ruter flytter du til sammen?`, calc:steps.map(x => x[1]).join('+'), expl:`${steps.map(x => x[1]).join(' + ')} = ${tot}.`});
   }}
  ]
});
function genSteps(r, st, n){
  const steps = []; let [x, y] = st;
  for(let k = 0; k < n; k++){
    const room = {'høyre':6 - x, 'venstre':x, 'opp':6 - y, 'ned':y}, dirs = Object.keys(room).filter(d => room[d] >= 1 && !(steps.length && steps[steps.length - 1][0] === d)), d = pick(r, dirs), a = int(r, 1, Math.min(3, room[d]));
    steps.push([d, a]); x += SD[d][0] * a; y += SD[d][1] * a;
  }
  return steps;
}
})();
