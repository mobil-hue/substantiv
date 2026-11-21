(function(){
'use strict';
/* Moduler: mønster (KM13236), geometriske figurer (KM13237) og måling (KM13240) */
const A = window.App, MT = window.MT, G = MT.G, Q = MT.Q, S = MT.S, B = MT.B;
const {int, pick, shuf} = MT, {sc, pop, fade, big, sub, row, chip, title} = S;
const uniq = a => a.filter((x, i) => a.indexOf(x) === i);
const range = (a, b) => Array.from({length:b - a + 1}, (_, i) => a + i);

/* ======================================================================
   Mønster: repeterende enheter (KM13236)
   ====================================================================== */
const POOL = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠', '⭐', '🌙', '🍎', '🍌', '🍇', '🌸'];
const PATS = ['AB', 'AAB', 'ABB', 'ABC', 'AABB'];
const unitOf = (r, pat) => { const items = shuf(r, POOL), map = {}; let k = 0; return pat.split('').map(ch => map[ch] || (map[ch] = items[k++])); };
const rep = (u, n) => Array.from({length:n}, (_, i) => u[i % u.length]);
const spoken = a => a.map(x => ({'🔴':'rød', '🔵':'blå', '🟢':'grønn', '🟡':'gul', '🟣':'lilla', '🟠':'oransje', '⭐':'stjerne', '🌙':'måne', '🍎':'eple', '🍌':'banan', '🍇':'drue', '🌸':'blomst', '?':'hva mangler'}[x] || x)).join(', ');
MT.module({
  id:'moenster-gjentar', rek:16, trinn:[1], maal:['KM13236'], tittel:'Mønster: den delen som gjentar seg', ikon:'🔁', bygger:[],
  video:[
   {html:title('🔁', 'Mønster', S.sub('Noe som gjentar seg', 1.2)),
    no:'Nå skal vi se på mønster. Et mønster er noe som gjentar seg, igjen og igjen, på samme måte.'},
   {html:sc(S.pop(G.seq(rep(['🔴', '🔵'], 8)), .2), S.sub('rød, blå, rød, blå, rød, blå …', 1.4)),
    no:'Her er et mønster. Rød, blå, rød, blå, rød, blå. Det gjentar seg hele tiden. Kan du se hva som kommer etterpå? Rød! Og så blå.'},
   {html:sc(S.pop(G.seq(rep(['🔴', '🔵'], 6)), .2), S.row(S.pop(G.eq('enhet', '#f97316'), 1.2), S.pop(G.seq(['🔴', '🔵']), 1.6)), S.sub('Den delen som gjentar seg, kalles enheten', 2.6)),
    no:'Den delen som gjentar seg, kaller vi den repeterende enheten. Her er enheten: rød, blå. Det er to figurer. Hele mønsteret er bare denne enheten gjentatt.'},
   {html:sc(S.pop(G.seq(rep(['🍎', '🍎', '🍌'], 9)), .2), S.row(S.pop(G.eq('enhet', '#f97316'), 1.2), S.pop(G.seq(['🍎', '🍎', '🍌']), 1.6)), S.sub('Her har enheten tre deler', 2.6)),
    no:'Her er et annet mønster. Eple, eple, banan, eple, eple, banan. Enheten er eple, eple, banan. Den har tre deler. Enheter kan være korte eller lange.'},
   {html:sc(S.pop(G.seq(['🔴', '🔵', '🟢', '🔴', '🔵', '🟢', '🔴', '?']), .2), S.sub('Se på enheten – hva kommer så?', 1.6)),
    no:'Vi kan fortsette et mønster. Rød, blå, grønn, rød, blå, grønn, rød. Hva kommer så? Enheten er rød, blå, grønn. Vi er på rød, så neste er blå.'},
   {html:sc(S.pop(G.seq(['🔴', '🔵', '🔵', '🟢', '🔴', '🟢', '🔵']), .2), S.sub('Dette er ikke et mønster – ingenting gjentar seg', 1.6)),
    no:'Men pass på. Her er rød, blå, blå, grønn, rød, grønn, blå. Det er ikke noe som gjentar seg på samme måte. Da er det ikke et mønster.'},
   {html:sc(S.row(S.pop(G.eq('A B A B', '#2563eb'), .2), S.pop(G.eq('A A B A A B', '#16a34a'), 1), S.pop(G.eq('A B C A B C', '#f97316'), 1.8)), S.sub('Vi kan beskrive mønster med bokstaver', 2.8)),
    no:'Vi kan beskrive et mønster med bokstaver. A, B, A, B. Eller A, A, B, A, A, B. Eller A, B, C, A, B, C. Hver bokstav står for en ting, for eksempel en farge.'},
   {html:sc(S.row(S.pop('<span style="font-size:3rem">🧦</span>', .2), S.pop('<span style="font-size:3rem">🧱</span>', .8), S.pop('<span style="font-size:3rem">🥁</span>', 1.4), S.pop('<span style="font-size:3rem">🌻</span>', 2)), S.sub('Mønster finnes i klær, fliser, rytmer og natur', 2.8)),
    no:'Mønster finnes overalt. På klær, på fliser, i musikk og i naturen. Du kan klappe et mønster: klapp, stamp, klapp, stamp. Nå skal du lage og finne mønster selv!'}
  ],
  tekst:{
   mal:'Du skal kjenne igjen og beskrive <b>repeterende enheter</b> i mønster, og lage egne mønster.',
   steg:['Se på rekka: gjentar noe seg på samme måte?', 'Finn <b>enheten</b>: den korteste delen som gjentar seg (for eksempel 🔴🔵).', 'Fortsett mønsteret ved å gjenta enheten.', 'Beskriv med ord eller bokstaver: A B A B, A A B A A B …', 'Lag selv: velg en enhet og gjenta den.'],
   eks:[G.seq(rep(['🔴', '🔵'], 6)) + '<br>enhet: 🔴🔵 (A B)', G.seq(rep(['🍎', '🍎', '🍌'], 6)) + '<br>enhet: 🍎🍎🍌 (A A B)'],
   ord:[['mønster', 'noe som gjentar seg på samme måte'], ['repeterende enhet', 'den delen som gjentar seg'], ['gjenta', 'gjøre det samme om igjen']],
   feil:['«Alle rekker er mønster» – i et mønster må noe gjenta seg likt hver gang.', '«Enheten er hele rekka» – enheten er den korteste delen som gjentar seg.'],
   laerer:'KM13236: kjenne igjen og beskrive repeterende enheter og lage egne mønster. Bruk konkreter (perler, klosser, klappelyder). Be elevene beskrive mønsteret med ord («først to røde, så en blå») og med bokstaver, og forklare hvordan de vet hva som kommer videre. Vekstmønster og tallmønster (hopptelling) kommer i andre moduler.'
  },
  refleksjon:'Lag et mønster med perler eller klosser, og fortell hva enheten din er.',
  nivaaer:[
   {t:'Forstå: hva er et mønster?', d:'Sjekk at du har forstått mønster og enhet.', kind:'forstaa', make:(r, i) => {
     const pat = pick(r, PATS), u = unitOf(r, pat), k = i % 5;
     if(k === 0) return Q.choice(r, 'Hva er et mønster?', 'Noe som gjentar seg på samme måte', ['Noe som er pent', 'Noe som er rødt', 'Mange ting i tilfeldig rekkefølge'], {expl:'I et mønster gjentar en enhet seg igjen og igjen.'});
     if(k === 1) return Q.choice(r, `${G.seq(rep(u, u.length * 3))}<br>Hva er enheten?`, G.seq(u), [G.seq(u.slice(0, -1)), G.seq(u.concat([u[0]])), G.seq(u.map((x, j) => j === u.length - 1 ? pick(r, POOL.filter(p => !u.includes(p))) : x))], {say:'Hva er den repeterende enheten?', expl:`Enheten er ${spoken(u)}. Den gjentar seg.`});
     if(k === 2){ const rnd = shuf(r, POOL).slice(0, 7); return Q.yn(`${G.seq(rnd)}<br>Er dette et mønster?`, false, {say:'Er dette et mønster?', expl:'Nei. Ingenting gjentar seg på samme måte.'}); }
     if(k === 3) return Q.yn(`${G.seq(rep(u, u.length * 3))}<br>Er dette et mønster?`, true, {say:'Er dette et mønster?', expl:`Ja. Enheten ${spoken(u)} gjentar seg.`});
     return Q.num(`Hvor mange deler har enheten ${G.seq(u)}? {?}`, u.length, {say:'Hvor mange deler har enheten?', expl:`Enheten har ${u.length} deler.`});
   }},
   {t:'Fortsett mønsteret', d:'Hva kommer etterpå?', n:10, make:(r, i) => {
     const pat = pick(r, PATS), u = unitOf(r, pat), n = u.length * 2 + int(r, 0, u.length - 1), ans = u[n % u.length], opts = uniq(u.concat([pick(r, POOL.filter(p => !u.includes(p)))]));
     return Q.choice(r, `${G.seq(rep(u, n).concat(['?']))}<br>Hva kommer så?`, ans, opts, {say:`${spoken(rep(u, n))}. Hva kommer så?`, expl:`Enheten er ${spoken(u)}. Etter ${spoken([rep(u, n)[n - 1]])} kommer ${spoken([ans])}.`});
   }},
   {t:'Finn enheten', d:'Hva er den delen som gjentar seg?', n:10, make:(r, i) => {
     const pat = pick(r, PATS), u = unitOf(r, pat), shown = rep(u, u.length * 3), other = pick(r, POOL.filter(p => !u.includes(p)));
     if(i % 3 === 2) return Q.num(`${G.seq(shown)}<br>Hvor mange deler har enheten? {?}`, u.length, {say:'Hvor mange deler har enheten?', expl:`Enheten er ${spoken(u)}: ${u.length} deler.`});
     return Q.choice(r, `${G.seq(shown)}<br>Hvilken er enheten?`, G.seq(u), [G.seq(u.slice(0, -1)), G.seq(u.concat([u[0]])), G.seq(u.map((x, j) => j === 0 ? other : x))], {say:'Hvilken er enheten som gjentar seg?', expl:`Enheten er ${spoken(u)}.`});
   }},
   {t:'Finn det som mangler eller er feil', d:'Fyll inn i midten, og finn feilen.', n:10, make:(r, i) => {
     const pat = pick(r, PATS), u = unitOf(r, pat), full = rep(u, u.length * 3), p = int(r, 2, full.length - 3);
     if(i % 2 === 0){ const opts = uniq(u.concat([pick(r, POOL.filter(x => !u.includes(x)))])); return Q.choice(r, `${G.seq(full.map((x, j) => j === p ? '?' : x))}<br>Hva mangler?`, full[p], opts, {say:'Hva mangler i mønsteret?', expl:`Enheten er ${spoken(u)}, så det som mangler er ${spoken([full[p]])}.`}); }
     const wrong = pick(r, POOL.filter(x => x !== full[p])), shown = full.map((x, j) => j === p ? wrong : x);
     return Q.num(`${G.seq(shown)}<br>Hvilken figur er feil? Skriv nummeret (1–${full.length}): {?}`, p + 1, {say:'Hvilken figur er feil? Skriv nummeret.', expl:`Figur nummer ${p + 1} skulle vært ${spoken([full[p]])}.`});
   }},
   {t:'Beskriv og lag mønster', d:'Bokstaver, plass i rekka og telling.', n:10, make:(r, i) => {
     const k = i % 3;
     if(k === 0){ const pat = pick(r, ['AAB', 'ABB', 'ABC', 'AABB']), u = unitOf(r, pat), wrongP = shuf(r, PATS.filter(x => x !== pat && x.length >= 2)).slice(0, 3);
       return Q.choice(r, `Hvilken rekke har mønsteret <b>${pat.split('').join(' ')}</b>?`, G.seq(rep(u, pat.length * 2)), wrongP.map(w => G.seq(rep(unitOf(r, w), pat.length * 2))), {say:`Hvilken rekke har mønsteret ${pat.split('').join(', ')}?`, expl:`${pat.split('').join(' ')} betyr at enheten har ${pat.length} deler: ${spoken(u)}.`}); }
     if(k === 1){ const pat = pick(r, ['ABC', 'AAB', 'ABB']), u = unitOf(r, pat), nth = int(r, 7, 12); return Q.choice(r, `Enheten er ${G.seq(u)}. Hva er figur nummer ${nth}?`, rep(u, nth)[nth - 1], uniq(u.concat([pick(r, POOL.filter(x => !u.includes(x)))])), {say:`Enheten er ${spoken(u)}. Hva er figur nummer ${nth}?`, expl:`Rekka: ${spoken(rep(u, nth))}. Nummer ${nth} er ${spoken([rep(u, nth)[nth - 1]])}.`}); }
     const pat = pick(r, ['AAB', 'ABB', 'ABC']), u = unitOf(r, pat), who = u[0], cntU = u.filter(x => x === who).length, reps = int(r, 3, 5);
     return Q.num(`Du gjentar enheten ${G.seq(u)} ${reps} ganger. Hvor mange ${who} får du til sammen? {?}`, cntU * reps, {say:`Du gjentar enheten ${spoken(u)} ${reps} ganger. Hvor mange ${spoken([who])} får du til sammen?`, expl:`${cntU} i hver enhet, ${reps} ganger: ${Array.from({length:reps}, () => cntU).join(' + ')} = ${cntU * reps}.`});
   }}
  ]
});

/* ======================================================================
   Plane figurer (KM13237)
   ====================================================================== */
const F2 = {circle:{n:'sirkel', c:0, s:0}, triangle:{n:'trekant', c:3, s:3}, square:{n:'kvadrat', c:4, s:4}, rectangle:{n:'rektangel', c:4, s:4}, pentagon:{n:'femkant', c:5, s:5}, hexagon:{n:'sekskant', c:6, s:6}, octagon:{n:'åttekant', c:8, s:8}};
const F2K = Object.keys(F2);
MT.module({
  id:'figurer-2d', rek:27, trinn:[1], maal:['KM13237'], tittel:'Figurer rundt oss: sirkel, trekant, firkant og flere', ikon:'🔷', bygger:['grupper-egenskaper'],
  video:[
   {html:title('🔷', 'Figurer rundt oss', S.sub('Se, tegn og beskriv', 1.2)),
    no:'Rundt oss er det figurer overalt. Nå skal vi lære navnene på noen vanlige figurer og beskrive hva som kjennetegner dem.'},
   {html:sc(S.row(S.pop(G.poly('circle', {s:90}), .2), S.pop(G.poly('triangle', {s:90}), 1), S.pop(G.poly('square', {s:90}), 1.8), S.pop(G.poly('rectangle', {s:90}), 2.6)), S.row(...['sirkel', 'trekant', 'kvadrat', 'rektangel'].map((t, i) => S.chip(t, '#2563eb', .5 + i * .8)))),
    no:'Dette er en sirkel. Dette er en trekant. Dette er et kvadrat. Og dette er et rektangel. Kvadrat og rektangel kaller vi også firkanter.'},
   {html:sc(S.row(S.pop(G.poly('triangle', {s:100, corners:true}), .2), S.pop(G.poly('square', {s:100, corners:true}), 1.2), S.pop(G.poly('pentagon', {s:100, corners:true}), 2.2)), S.sub('hjørner: 3 · 4 · 5', 3)),
    no:'Figurer har hjørner. Hjørnene er her vi ser de røde prikkene. En trekant har tre hjørner. Et kvadrat har fire hjørner. En femkant har fem hjørner.'},
   {html:sc(S.row(S.pop(G.poly('triangle', {s:90}), .2), S.pop(G.poly('square', {s:90}), 1), S.pop(G.poly('hexagon', {s:90}), 1.8)), S.sub('sider: 3 · 4 · 6', 2.6)),
    no:'Figurer har også sider. Sidene er de rette linjene rundt figuren. Trekanten har tre sider. Kvadratet har fire sider. Sekskanten har seks sider. Antall sider og antall hjørner er alltid like.'},
   {html:sc(S.row(S.pop(G.poly('circle', {s:100}), .2)), S.sub('Sirkelen har ingen hjørner og ingen rette sider', 1.2)),
    no:'Sirkelen er spesiell. Den har ingen hjørner, og ingen rette sider. Den er rund hele veien.'},
   {html:sc(S.row(S.pop(G.poly('square', {s:90}), .2), S.pop(G.poly('rectangle', {s:90}), 1.2)), S.sub('Kvadrat: alle sidene er like lange · Rektangel: to og to sider er like lange', 2.4)),
    no:'Hva er forskjellen på et kvadrat og et rektangel? Begge har fire hjørner. I et kvadrat er alle sidene like lange. I et rektangel er to og to sider like lange.'},
   {html:sc(S.row(...['🕐', '🪟', '🚸', '🍕', '🖼️', '🍪'].map((e, i) => S.pop(`<span style="font-size:3rem">${e}</span>`, .2 + i * .5))), S.sub('Finn figurer i nærmiljøet: klokke, vindu, skilt …', 3.4)),
    no:'Du kan finne figurer i nærmiljøet ditt. Klokka er en sirkel. Vinduet er et rektangel. Trafikkskiltet kan være en trekant. Pizzastykket ligner på en trekant. Se deg rundt hjemme og ute!'},
   {html:sc(S.row(S.pop('<div class="mtcard" style="--c:#2563eb;padding:8px">' + G.poly('triangle', {s:60}) + G.poly('rectangle', {s:60}) + '<br>har hjørner</div>', .2), S.pop('<div class="mtcard" style="--c:#16a34a;padding:8px">' + G.poly('circle', {s:60}) + G.poly('oval', {s:60}) + '<br>ingen hjørner</div>', 1.2)), S.sub('Vi kan sortere figurer etter egenskaper', 2.4)),
    no:'Vi kan sortere figurer etter egenskaper. Her er de som har hjørner, og her er de som ikke har hjørner. Du kan sortere på flere måter, men må kunne forklare hvorfor. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal utforske, tegne og beskrive geometriske figurer fra nærmiljøet, og sortere dem etter egenskaper og forklare hvorfor.',
   steg:['Se på figuren: er den rund, eller har den rette sider?', 'Tell <b>hjørnene</b> og <b>sidene</b> (like mange).', 'Navn: sirkel (0), trekant (3), firkant (4: kvadrat og rektangel), femkant (5), sekskant (6) …', 'Sorter etter en egenskap, for eksempel «antall hjørner», og <b>forklar</b> hvorfor.'],
   eks:[G.poly('triangle', {s:70, corners:true}) + ' trekant: 3 hjørner, 3 sider', G.poly('rectangle', {s:70, corners:true}) + ' rektangel: 4 hjørner, 4 sider', G.poly('circle', {s:70}) + ' sirkel: ingen hjørner'],
   ord:[['hjørne', 'punktet der to sider møtes'], ['side', 'den rette linjen mellom to hjørner'], ['kvadrat', 'firkant der alle sider er like lange'], ['rektangel', 'firkant der to og to sider er like lange']],
   feil:['«En sirkel har ett hjørne» – en sirkel har ingen hjørner.', '«Et kvadrat er ikke en firkant» – kvadrat og rektangel er begge firkanter.'],
   laerer:'KM13237: utforske, tegne og beskrive geometriske figurer fra nærmiljøet og argumentere for måter å sortere dem på. Bruk gjenstander (vindu, klokke, bok), tegning og klipping. La elevene sortere samme figurer på flere måter og begrunne («jeg sorterte etter antall hjørner fordi …»). Geometri 4. trinn (se «Geometri») bygger videre.'
  },
  refleksjon:'Finn tre figurer hjemme. Hva heter de, og hvor mange hjørner har de?',
  nivaaer:[
   {t:'Forstå: hjørner og sider', d:'Sjekk at du har forstått figurene.', kind:'forstaa', make:(r, i) => {
     const k = i % 5, f = pick(r, ['triangle', 'pentagon', 'hexagon']);
     if(k === 0) return Q.yn('Har en sirkel hjørner?', false, {expl:'Nei. En sirkel er rund og har ingen hjørner.'});
     if(k === 1) return Q.yn(`Har ${F2[f].n === 'trekant' ? 'en' : 'en'} ${F2[f].n} like mange hjørner som sider?`, true, {expl:'Ja. En figur med rette sider har alltid like mange hjørner som sider.'});
     if(k === 2) return Q.choice(r, 'Hva er forskjellen på et kvadrat og et rektangel?', 'I et kvadrat er alle sidene like lange', ['Kvadratet har flere hjørner', 'Rektanglet er rundt', 'Det er ingen forskjell'], {expl:'Begge har 4 hjørner. Bare i kvadratet er alle sidene like lange.'});
     if(k === 3) return Q.choice(r, 'Hva kaller vi kvadrat og rektangel samlet?', 'Firkanter', ['Trekanter', 'Sirkler', 'Femkanter'], {expl:'Begge har fire hjørner og fire sider.'});
     return Q.num(`Hvor mange hjørner har en ${F2[f].n}? {?}`, F2[f].c, {say:`Hvor mange hjørner har en ${F2[f].n}?`, expl:`En ${F2[f].n} har ${F2[f].c} hjørner.`});
   }},
   {t:'Navn på figurer', d:'Hva heter figuren?', n:10, make:(r, i) => {
     const f = pick(r, F2K), others = shuf(r, F2K.filter(x => x !== f)).slice(0, 3);
     return Q.choice(r, `${G.poly(f, {s:90, c:pick(r, ['#60a5fa', '#34d399', '#f472b6', '#fbbf24'])})}<br>Hva heter figuren?`, F2[f].n, others.map(x => F2[x].n), {say:'Hva heter figuren?', expl:`Figuren heter ${F2[f].n}.`});
   }},
   {t:'Tell hjørner og sider', d:'Hvor mange hjørner eller sider?', n:10, make:(r, i) => {
     const f = pick(r, F2K.filter(x => x !== 'circle')), c = i % 2 === 0;
     return Q.num(`${G.poly(f, {s:100, corners:true})}<br>Hvor mange ${c ? 'hjørner' : 'sider'} har figuren? {?}`, F2[f].c, {say:`Hvor mange ${c ? 'hjørner' : 'sider'} har figuren?`, expl:`${F2[f].n}: ${F2[f].c} hjørner og ${F2[f].s} sider.`, hint:c ? 'Tell de røde prikkene.' : 'Sidene er like mange som hjørnene.'});
   }},
   {t:'Figurer rundt oss', d:'Hvilken figur ligner tingen?', n:10, make:(r, i) => {
     const T = [['🕐', 'klokka', 'sirkel'], ['🪟', 'vinduet', 'rektangel'], ['🍕', 'pizzastykket', 'trekant'], ['🖼️', 'bildet', 'rektangel'], ['🍪', 'kjeksen', 'sirkel'], ['⚽', 'ballen sett fra siden', 'sirkel'], ['📺', 'tv-skjermen', 'rektangel'], ['🎲', 'terningen sett forfra', 'kvadrat'], ['🚸', 'skiltet', 'trekant'], ['🪙', 'mynten', 'sirkel']];
     const t = pick(r, T), opts = ['sirkel', 'trekant', 'kvadrat', 'rektangel', 'femkant'];
     return Q.choice(r, `<span style="font-size:3rem">${t[0]}</span><br>Hvilken figur ligner ${t[1]} mest på?`, t[2], shuf(r, opts.filter(x => x !== t[2])).slice(0, 3), {say:`Hvilken figur ligner ${t[1]} mest på?`, expl:`${t[1][0].toUpperCase() + t[1].slice(1)} ligner ${t[2] === 'kvadrat' || t[2] === 'rektangel' ? 'et' : 'en'} ${t[2]}.`});
   }},
   {t:'Sorter og forklar', d:'Sorter figurene og begrunn hvorfor.', n:10, make:(r, i) => {
     const set = shuf(r, F2K).slice(0, 6), k = i % 3;
     if(k === 0){ const n = pick(r, [0, 3, 4]); const cnt = set.filter(f => F2[f].c === n).length; if(!cnt && n !== 0) return null; return Q.num(`${set.map(f => G.poly(f, {s:56})).join('')}<br>Hvor mange figurer har ${n} hjørner? {?}`, cnt, {say:`Hvor mange figurer har ${n} hjørner?`, expl:`Tell figurene med ${n} hjørner: ${cnt}.`}); }
     if(k === 1){ const P = [[['square', 'rectangle'], 'De har begge 4 hjørner og 4 sider'], [['circle', 'oval'], 'De har ingen hjørner'], [['pentagon', 'hexagon'], 'De har begge flere enn 4 hjørner'], [['triangle', 'triangle'], 'De har begge 3 hjørner og 3 sider']], p = pick(r, P), all = P.map(x => x[1]).concat(['De er begge runde og store']);
       return Q.choice(r, `${p[0].map(f => G.poly(f, {s:70})).join('')}<br>Hvorfor kan disse sorteres i samme gruppe?`, p[1], shuf(r, all.filter(x => x !== p[1])).slice(0, 3), {say:'Hvorfor kan disse sorteres i samme gruppe?', expl:p[1] + '.'}); }
     const rules = [['har hjørner', f => F2[f].c > 0], ['har mer enn 4 hjørner', f => F2[f].c > 4], ['har 3 hjørner', f => F2[f].c === 3]], rule = pick(r, rules), ok = set.filter(rule[1]);
     if(ok.length === 0 || ok.length === set.length) return null;
     const odd = set.find(f => !rule[1](f)); return Q.choice(r, `${set.map(f => G.poly(f, {s:56})).join('')}<br>Regel: «figuren ${rule[0]}». Hvilken figur passer <b>ikke</b>?`, F2[odd].n, set.filter(f => rule[1](f)).slice(0, 3).map(f => F2[f].n).concat([F2[odd].n]), {say:`Regel: figuren ${rule[0]}. Hvilken figur passer ikke?`, expl:`${F2[odd].n} har ${F2[odd].c} hjørner, og passer ikke.`});
   }}
  ]
});

/* ======================================================================
   Romfigurer (KM13237)
   ====================================================================== */
const F3 = {sphere:{n:'kule', f:0, k:0, h:0, roll:true, stack:false}, cube:{n:'terning', f:6, k:12, h:8, roll:false, stack:true}, box:{n:'kloss (rett eske)', f:6, k:12, h:8, roll:false, stack:true}, cylinder:{n:'sylinder', f:2, k:2, h:0, roll:true, stack:true}, cone:{n:'kjegle', f:1, k:1, h:1, roll:true, stack:false}, pyramid:{n:'pyramide', f:5, k:8, h:5, roll:false, stack:false}};
const F3K = Object.keys(F3);
MT.module({
  id:'romfigurer', rek:28, trinn:[1, 2], maal:['KM13237'], tittel:'Romfigurer: kule, terning, sylinder og flere', ikon:'🧊', bygger:['figurer-2d'],
  video:[
   {html:title('🧊', 'Romfigurer', S.sub('Figurer du kan holde i', 1.2)),
    no:'Nå skal vi se på figurer som du kan holde i hånden. De kalles romfigurer, fordi de tar plass i rommet.'},
   {html:sc(S.row(...F3K.map((k, i) => S.pop(G.solid(k, {s:90}), .2 + i * .5))), S.row(...['kule', 'terning', 'kloss', 'sylinder', 'kjegle', 'pyramide'].map((t, i) => S.chip(t, '#2563eb', 3.4 + i * .5)))),
    no:'Dette er en kule. En terning. En kloss, som også kalles en rett eske. En sylinder. En kjegle. Og en pyramide.'},
   {html:sc(S.row(...['⚽', '🎲', '📦', '🥫', '🍦', '🏔️'].map((e, i) => S.pop(`<span style="font-size:3rem">${e}</span>`, .2 + i * .5))), S.sub('Ball = kule · terning · eske = kloss · boks = sylinder · iskrem = kjegle', 3.4)),
    no:'Du finner romfigurer overalt. En ball er en kule. En spillterning er en terning. En eske er en kloss. En hermetikkboks er en sylinder. Et iskrem-horn er en kjegle. Og et fjell kan ligne en pyramide.'},
   {html:sc(S.row(S.pop(G.solid('sphere', {s:80}), .2), S.pop(G.solid('cylinder', {s:80}), 1), S.pop(G.solid('cone', {s:80}), 1.8)), S.sub('Disse kan rulle', 2.8)),
    no:'Noen romfigurer kan rulle. Kula ruller. Sylinderen ruller på siden. Og kjegla ruller i en sirkel. Terningen og klossen kan ikke rulle, for de har flate sider og kantete hjørner.'},
   {html:sc(S.row(S.pop(G.solid('cube', {s:90}), .2), S.pop(G.solid('box', {s:90}), 1), S.pop(G.solid('cylinder', {s:90}), 1.8)), S.sub('Disse kan stables', 2.8)),
    no:'Noen kan stables oppå hverandre. Terninger og klosser kan stables fint, fordi de har flate sider. Sylindere kan stables når de står opp. Kuler og kjegler stables dårlig.'},
   {html:sc(S.row(S.pop(G.solid('cube', {s:110}), .2)), S.row(S.pop(G.eq('6 flater', '#2563eb'), 1), S.pop(G.eq('12 kanter', '#f97316'), 1.8), S.pop(G.eq('8 hjørner', '#16a34a'), 2.6))),
    no:'La oss se nøye på terningen. Den har seks flate sider, som vi kaller flater. Hver flate er et kvadrat. Den har tolv kanter, der to flater møtes. Og åtte hjørner.'},
   {html:sc(S.row(S.pop(G.solid('sphere', {s:90}), .2), S.pop(G.solid('cylinder', {s:90}), 1), S.pop(G.solid('cone', {s:90}), 1.8)), S.sub('Kule: ingen flate flater · Sylinder: 2 · Kjegle: 1', 2.8)),
    no:'Ikke alle har mange flater. Kula har ingen flate flater, bare en rund overflate. Sylinderen har to flate flater, og de er sirkler. Kjegla har én flat flate, også en sirkel.'},
   {html:sc(S.row(S.pop('<div class="mtcard" style="--c:#2563eb;padding:8px">' + G.solid('sphere', {s:60}) + G.solid('cylinder', {s:60}) + G.solid('cone', {s:60}) + '<br>kan rulle</div>', .2), S.pop('<div class="mtcard" style="--c:#16a34a;padding:8px">' + G.solid('cube', {s:60}) + G.solid('box', {s:60}) + G.solid('pyramid', {s:60}) + '<br>kan ikke rulle</div>', 1.2)), S.sub('Sorter etter egenskaper – og forklar!', 2.4)),
    no:'Nå kan du sortere romfigurer etter egenskaper, for eksempel om de kan rulle. Husk å forklare hvorfor du har sortert slik. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal kjenne igjen romfigurer, finne dem i nærmiljøet og sortere dem etter egenskaper.',
   steg:['Navn: <b>kule, terning, kloss, sylinder, kjegle, pyramide</b>.', 'Kan den <b>rulle</b>? (kule, sylinder, kjegle)', 'Kan den <b>stables</b>? (terning, kloss, sylinder)', 'Terning og kloss: <b>6 flater, 12 kanter, 8 hjørner</b>.', 'Sorter og forklar: «Jeg sorterte etter om de kan rulle.»'],
   eks:[G.solid('cube', {s:80}) + ' terning: 6 flater, 12 kanter, 8 hjørner', G.solid('cylinder', {s:80}) + ' sylinder: 2 flate flater (sirkler)'],
   ord:[['flate', 'en flat side på en romfigur'], ['kant', 'der to flater møtes'], ['hjørne', 'der kantene møtes']],
   feil:['«En terning er en firkant» – terningen er en romfigur; flatene er firkanter (kvadrat).', '«En kule har flater» – kula har ingen flate flater.'],
   laerer:'KM13237: utforske romfigurer fra nærmiljøet (bokser, baller, esker, kjegler …) og argumentere for måter å sortere dem på etter egenskaper. La barna føle og teste: ruller/stables/glir. Skill mellom plane figurer (to dimensjoner) og romfigurer (tre dimensjoner).'
  },
  refleksjon:'Finn en kule, en sylinder og en kloss hjemme. Hvordan er de like, og hvordan er de ulike?',
  nivaaer:[
   {t:'Forstå: egenskaper', d:'Sjekk at du har forstått romfigurene.', kind:'forstaa', make:(r, i) => {
     const k = i % 5;
     if(k === 0) return Q.yn('Kan en kule stables godt?', false, {expl:'Nei. Kula har ingen flate sider og ruller av gårde.'});
     if(k === 1) return Q.choice(r, 'Hvilken romfigur har ingen flate sider?', 'Kule', ['Terning', 'Kloss', 'Pyramide'], {expl:'Kula er rund overalt.'});
     if(k === 2) return Q.yn('Har en terning like mange flater som en kloss (rett eske)?', true, {expl:'Ja. Begge har 6 flater, 12 kanter og 8 hjørner.'});
     if(k === 3) return Q.choice(r, 'Hva er en romfigur?', 'En figur du kan holde i hånden', ['En figur som bare kan tegnes flat', 'En tegning på papir', 'Et tall'], {expl:'Romfigurer tar plass i rommet.'});
     return Q.yn('Kan en sylinder rulle?', true, {expl:'Ja, den ruller på den runde siden.'});
   }},
   {t:'Navn på romfigurer', d:'Hva heter figuren?', n:10, make:(r, i) => {
     const f = pick(r, F3K), others = shuf(r, F3K.filter(x => x !== f && !(f === 'cube' && x === 'box') && !(f === 'box' && x === 'cube'))).slice(0, 3);
     return Q.choice(r, `${G.solid(f, {s:90})}<br>Hva heter figuren?`, F3[f].n, others.map(x => F3[x].n), {say:'Hva heter figuren?', expl:`Figuren heter ${F3[f].n}.`});
   }},
   {t:'Rulle eller stable?', d:'Hvilke egenskaper har figuren?', n:10, make:(r, i) => {
     const f = pick(r, F3K), roll = i % 2 === 0;
     return Q.yn(`${G.solid(f, {s:90})}<br>Kan figuren ${roll ? 'rulle' : 'stables'}?`, roll ? F3[f].roll : F3[f].stack, {say:`Kan figuren ${roll ? 'rulle' : 'stables'}?`, expl:`${F3[f].n[0].toUpperCase() + F3[f].n.slice(1)} ${(roll ? F3[f].roll : F3[f].stack) ? 'kan' : 'kan ikke'} ${roll ? 'rulle' : 'stables'}.`});
   }},
   {t:'Romfigurer rundt oss', d:'Hvilken romfigur ligner tingen?', n:10, make:(r, i) => {
     const T = [['⚽', 'ballen', 'kule'], ['🎲', 'spillterningen', 'terning'], ['📦', 'esken', 'kloss (rett eske)'], ['🥫', 'hermetikkboksen', 'sylinder'], ['🍦', 'iskrem-hornet', 'kjegle'], ['🏀', 'basketballen', 'kule'], ['🧃', 'drikkeboksen', 'kloss (rett eske)'], ['🔋', 'batteriet', 'sylinder'], ['🥁', 'trommen', 'sylinder'], ['📚', 'boka', 'kloss (rett eske)']];
     const t = pick(r, T), opts = ['kule', 'terning', 'kloss (rett eske)', 'sylinder', 'kjegle', 'pyramide'];
     return Q.choice(r, `<span style="font-size:3rem">${t[0]}</span><br>Hvilken romfigur ligner ${t[1]}?`, t[2], shuf(r, opts.filter(x => x !== t[2])).slice(0, 3), {say:`Hvilken romfigur ligner ${t[1]}?`, expl:`${t[1][0].toUpperCase() + t[1].slice(1)} ligner en ${t[2]}.`});
   }},
   {t:'Flater, kanter og hjørner', d:'Tell og sorter etter egenskaper.', n:10, make:(r, i) => {
     const k = i % 4;
     if(k === 0){ const f = pick(r, ['cube', 'box']), w = pick(r, [['flater', 6], ['kanter', 12], ['hjørner', 8]]); return Q.num(`${G.solid(f, {s:100})}<br>Hvor mange ${w[0]} har ${F3[f].n === 'terning' ? 'en terning' : 'en kloss'}? {?}`, w[1], {say:`Hvor mange ${w[0]} har ${F3[f].n === 'terning' ? 'en terning' : 'en kloss'}?`, expl:`Terning og kloss har 6 flater, 12 kanter og 8 hjørner.`}); }
     if(k === 1) return Q.choice(r, 'Hvilken romfigur har <b>ingen</b> hjørner?', pick(r, ['Kule', 'Sylinder']), ['Terning', 'Pyramide', 'Kloss (rett eske)'], {say:'Hvilken romfigur har ingen hjørner?', expl:'Kule og sylinder har ingen hjørner.'});
     if(k === 2) return Q.choice(r, `${G.solid('cylinder', {s:90})}<br>Hvilken form har de flate flatene på en sylinder?`, 'Sirkel', ['Kvadrat', 'Trekant', 'Rektangel'], {say:'Hvilken form har de flate flatene på en sylinder?', expl:'Topp og bunn på en sylinder er sirkler.'});
     return Q.num(`${G.solid('pyramid', {s:100})}<br>Pyramiden har bunnflate som er et kvadrat, og fire trekanter. Hvor mange flater har den til sammen? {?}`, 5, {say:'Pyramiden har en bunnflate som er et kvadrat, og fire trekanter. Hvor mange flater har den til sammen?', expl:'1 kvadrat + 4 trekanter = 5 flater.'});
   }}
  ]
});

/* ======================================================================
   Måle lengde (KM13240)
   ====================================================================== */
const OBJ = [['blyanten', '#f59e0b'], ['pinnen', '#a16207'], ['stripa', '#3b82f6'], ['båndet', '#ec4899'], ['strikken', '#16a34a'], ['kritten', '#9ca3af']];
MT.module({
  id:'maale-lengde', rek:43, trinn:[1, 2], maal:['KM13240'], tittel:'Måle lengde: binders, linjal, centimeter og meter', ikon:'📏', bygger:['tall-11-20', 'tallinje'],
  video:[
   {html:title('📏', 'Måle lengde', S.sub('Hvor lang er den?', 1.2)),
    no:'Hvor lang er blyanten din? Hvor høy er du? Når vi vil vite hvor langt noe er, måler vi lengde.'},
   {html:sc(S.pop('<div style="text-align:center"><div style="height:22px;background:#f59e0b;width:260px;border-radius:8px;margin:4px auto"></div><div style="height:22px;background:#3b82f6;width:180px;border-radius:8px;margin:4px auto"></div></div>', .2), S.sub('Den øverste er lengst. Den nederste er kortest.', 1.4)),
    no:'Vi kan sammenligne direkte. Legg tingene ved siden av hverandre, med start på samme sted. Da ser vi hvilken som er lengst og hvilken som er kortest.'},
   {html:sc(S.pop('<div style="text-align:center"><div style="height:34px;background:#f59e0b;width:240px;border-radius:8px;margin:0 auto;color:#fff;font-weight:900;line-height:34px">blyant</div><div style="font-size:2.2rem;margin-top:4px;letter-spacing:-.05em">📎📎📎📎📎📎</div></div>', .2), S.sub('Blyanten er 6 binders lang', 1.6)),
    no:'Vi kan måle med noe som er likt hele tiden, for eksempel binders. Vi legger bindersen etter hverandre, uten mellomrom og uten å legge dem over hverandre. Blyanten er seks binders lang.'},
   {html:sc(S.row(S.pop('<div style="text-align:center;font-size:2.2rem">👣👣👣👣<div class="mtsm">Mias skritt</div></div>', .2), S.pop('<div style="text-align:center;font-size:2.2rem">👣👣👣<div class="mtsm">Olas skritt</div></div>', 1.2)), S.sub('Samme rom – ulikt tall. Enheten må være lik!', 2.4)),
    no:'Men skritt er ikke like lange for alle. Mia tar fire skritt, og Ola tar tre skritt over det samme rommet. Tallene blir ulike fordi enhetene er ulike. Derfor trenger vi en enhet som er lik for alle.'},
   {html:sc(S.pop(G.ruler(12, {obj:{from:0, to:9, label:'blyant'}}), .2), S.sub('Start på 0. Blyanten er 9 centimeter', 1.4)),
    no:'En slik felles enhet er centimeter. Vi bruker en linjal. Linjalen skal starte på null, der blyanten starter. Blyanten slutter på ni. Blyanten er ni centimeter lang. Vi skriver 9 cm.'},
   {html:sc(S.pop(G.ruler(12, {obj:{from:3, to:10, label:'stripe'}}), .2), S.sub('Fra 3 til 10: 10 − 3 = 7 cm', 1.4)),
    no:'Noen ganger starter ikke tingen på null. Her starter stripen på tre og slutter på ti. Da teller vi hoppene fra tre til ti, eller regner ti minus tre. Det er sju centimeter.'},
   {html:sc(S.row(S.pop(G.eq('1 meter = 100 cm', '#2563eb'), .2), S.pop('<span style="font-size:3rem">🚪</span>', 1), S.pop(G.eq('2 meter', '#f97316'), 1.4)), S.sub('Lange ting måler vi i meter', 2.2)),
    no:'Store ting måler vi i meter. En meter er hundre centimeter. En dør er omtrent to meter høy. Små ting måler vi i centimeter, for eksempel en blyant.'},
   {html:sc(S.big('Omtrent hvor lang? Gjett først – mål etterpå!', .2), S.sub('Nå øver vi!', 1.4)),
    no:'Før du måler, kan du gjette hvor langt det er. Så måler du, og snakker om hvor nær du var. Det kalles å gjøre et overslag. Nå skal du øve på å måle lengde!'}
  ],
  tekst:{
   mal:'Du skal måle lengde i praktiske situasjoner, først med ikke-standardiserte enheter (binders, skritt) og så med <b>centimeter</b> og <b>meter</b>, og snakke om resultatene.',
   steg:['Sammenlign først: legg tingene ved siden av hverandre med start på samme sted.', 'Mål med like store enheter, uten mellomrom og overlapp (for eksempel binders).', 'Med linjal: start på <b>0</b>, les av hvor tingen slutter. Starter den ikke på 0: <b>slutt − start</b>.', '<b>1 m = 100 cm.</b> Små ting i cm, store ting i m.', 'Gjett først (overslag), mål så, og snakk om forskjellen.'],
   eks:[G.ruler(12, {obj:{from:0, to:9, label:'blyant'}}) + '<br>9 cm', G.ruler(12, {obj:{from:3, to:10, label:'stripe'}}) + '<br>10 − 3 = 7 cm'],
   ord:[['lengde', 'hvor langt noe er'], ['centimeter (cm)', 'liten standardenhet; 100 cm = 1 m'], ['meter (m)', 'stor standardenhet'], ['overslag', 'en god gjetning før du måler']],
   feil:['«Jeg startet på 1 på linjalen» – start på 0.', '«5 binders er det samme som 5 cm» – binders og cm er ulike enheter.'],
   laerer:'KM13240 (lengde): praktisk måling med ikke-standardiserte og standardiserte enheter, og samtale om resultatene. La barna måle ting i klasserommet og sammenligne resultater med ulike enheter (poenget: enheten må være lik for å kunne sammenligne). Masse følger i egen modul.'
  },
  refleksjon:'Mål to ting med binders. Hvorfor blir svaret ulikt hvis du bruker skritt i stedet?',
  nivaaer:[
   {t:'Forstå: hvorfor lik enhet?', d:'Sjekk at du har forstått måling.', kind:'forstaa', make:(r, i) => {
     const k = i % 6, a = int(r, 3, 8);
     if(k === 0) return Q.choice(r, 'Hvorfor trenger vi en enhet som er lik hele tiden?', 'For å kunne sammenligne målene', ['Det ser pent ut', 'Fordi linjaler er gule', 'Det trenger vi ikke'], {expl:'Hvis enhetene er ulike, kan vi ikke sammenligne tallene.'});
     if(k === 1) return Q.choice(r, 'Hvor skal du starte når du måler med linjal?', 'På 0', ['På 1', 'På 10', 'Hvor som helst'], {expl:'Linjalen skal starte på 0 der tingen starter.'});
     if(k === 2) return Q.yn(`Er ${a} binders det samme som ${a} cm?`, false, {expl:'Nei. Binders og centimeter er ulike enheter.'});
     if(k === 3) return Q.num(`1 meter er {?} centimeter`, 100, {expl:'1 m = 100 cm.'});
     if(k === 4) return Q.choice(r, 'Hva bør du gjøre før du måler?', 'Gjette hvor langt det er (overslag)', ['Kaste linjalen', 'Måle to ganger med ulike enheter', 'Ingenting'], {expl:'Et overslag hjelper deg å vurdere om svaret ditt er rimelig.'});
     return Q.yn('Skal bindersene ligge uten mellomrom når du måler?', true, {expl:'Ja. Mellomrom eller overlapp gir feil resultat.'});
   }},
   {t:'Måle med binders', d:'Hvor mange binders er det?', n:10, make:(r, i) => {
     const n = int(r, 3, 9), o = pick(r, OBJ);
     return Q.num(`<div style="text-align:center"><div style="height:30px;background:${o[1]};width:${n * 36}px;max-width:100%;border-radius:8px;margin:0 auto"></div><div style="font-size:1.9rem;letter-spacing:-.04em;line-height:1.2">${'📎'.repeat(n)}</div></div>Hvor mange binders lang er ${o[0]}? {?}`, n, {say:`Hvor mange binders lang er ${o[0]}?`, expl:`Tell bindersene: ${n}.`});
   }},
   {t:'Les av linjalen (fra 0)', d:'Hvor mange centimeter?', n:10, make:(r, i) => {
     const max = int(r, 8, 14), n = int(r, 3, max - 1), o = pick(r, OBJ);
     return Q.num(`${G.ruler(max, {obj:{from:0, to:n, label:o[0]}})}<br>Hvor lang er ${o[0]}? {?} cm`, n, {say:`Hvor lang er ${o[0]} i centimeter?`, expl:`Den starter på 0 og slutter på ${n}: ${n} cm.`});
   }},
   {t:'Linjal fra et annet startpunkt', d:'Slutt minus start.', n:10, make:(r, i) => {
     const max = int(r, 10, 14), a = int(r, 1, 5), b = int(r, a + 2, max - 1), o = pick(r, OBJ);
     return Q.num(`${G.ruler(max, {obj:{from:a, to:b, label:o[0]}})}<br>Hvor lang er ${o[0]}? {?} cm`, b - a, {say:`Hvor lang er ${o[0]} i centimeter?`, calc:`${b}-${a}`, expl:`Den starter på ${a} og slutter på ${b}: ${b} − ${a} = ${b - a} cm.`, hint:'Tell hoppene fra start til slutt.'});
   }},
   {t:'Lengre eller kortere?', d:'Sammenlign lengder.', n:10, make:(r, i) => {
     const a = int(r, 4, 20), b = int(r, 4, 20), n1 = pick(r, ['blyanten', 'pinnen']), n2 = pick(r, ['kritten', 'strikken']); if(a === b) return null;
     if(i % 2 === 0) return Q.choice(r, `${n1[0].toUpperCase() + n1.slice(1)} er ${a} cm. ${n2[0].toUpperCase() + n2.slice(1)} er ${b} cm. Hvilken er lengst?`, a > b ? n1 : n2, [n1, n2], {keep:true, say:`${n1} er ${a} centimeter. ${n2} er ${b} centimeter. Hvilken er lengst?`, expl:`${Math.max(a, b)} er mer enn ${Math.min(a, b)}.`});
     return Q.num(`${n1[0].toUpperCase() + n1.slice(1)} er ${Math.max(a, b)} cm. ${n2[0].toUpperCase() + n2.slice(1)} er ${Math.min(a, b)} cm. Hvor mange cm lengre er ${n1}? {?}`, Math.abs(a - b), {say:`${n1} er ${Math.max(a, b)} centimeter. ${n2} er ${Math.min(a, b)} centimeter. Hvor mange centimeter lengre er ${n1}?`, calc:`${Math.max(a, b)}-${Math.min(a, b)}`, expl:`${Math.max(a, b)} − ${Math.min(a, b)} = ${Math.abs(a - b)} cm.`});
   }},
   {t:'Meter og centimeter', d:'Velg enhet og regn om.', n:10, make:(r, i) => {
     const k = i % 3;
     if(k === 0){ const T = [['en blyant', 'cm'], ['en dør', 'm'], ['et fotballmål (bredden)', 'm'], ['en binders', 'cm'], ['en skolevei', 'm'], ['en viskelær', 'cm']]; const t = pick(r, T); return Q.choice(r, `Hvilken enhet passer best for å måle ${t[0]}?`, t[1] === 'cm' ? 'centimeter (cm)' : 'meter (m)', [t[1] === 'cm' ? 'meter (m)' : 'centimeter (cm)'], {keep:false, say:`Hvilken enhet passer best for å måle ${t[0]}?`, expl:t[1] === 'cm' ? 'Små ting måler vi i centimeter.' : 'Store ting måler vi i meter.'}); }
     if(k === 1){ const m = int(r, 1, 5); return Q.num(`${m} m = {?} cm`, m * 100, {say:`${m} meter er hvor mange centimeter?`, calc:`${m}*100`, expl:`1 m = 100 cm, så ${m} m = ${m * 100} cm.`}); }
     const m = int(r, 1, 5); return Q.num(`${m * 100} cm = {?} m`, m, {say:`${m * 100} centimeter er hvor mange meter?`, expl:`100 cm = 1 m, så ${m * 100} cm = ${m} m.`});
   }}
  ]
});

/* ======================================================================
   Måle masse (KM13240)
   ====================================================================== */
const MAS = [['en sukkerpose', 'kg', 1], ['en binders', 'g', 1], ['en kaffekopp med vann', 'g', 200], ['en skolesekk', 'kg', 4], ['en brødskive', 'g', 30], ['en katt', 'kg', 4], ['en eple', 'g', 150], ['en elev', 'kg', 25]];
MT.module({
  id:'maale-masse', rek:45, trinn:[2], maal:['KM13240'], tittel:'Måle masse: tyngre, lettere, gram og kilogram', ikon:'⚖️', bygger:['maale-lengde'],
  video:[
   {html:title('⚖️', 'Måle masse', S.sub('Tyngre og lettere', 1.2)),
    no:'Nå skal vi måle masse, altså hvor tungt noe er. I hverdagen sier vi ofte vekt, men matematikken sier masse.'},
   {html:sc(S.pop(G.balance('🪨', '🍎', 9, 3), .2), S.sub('Den tyngste siden går ned', 1.6)),
    no:'Vi kan sammenligne med en balansevekt. Den siden som er tyngst, går ned. Her er steinen tyngre enn eplet. Eplet er lettere enn steinen.'},
   {html:sc(S.pop(G.balance('🍎', '🧱🧱🧱', 3, 3), .2), S.sub('Eplet veier like mye som 3 klosser', 1.6)),
    no:'Vi kan måle med noe som er likt hele tiden, for eksempel klosser. Når vekta står i ro, veier eplet like mye som tre klosser. Eplet er tre klosser tungt.'},
   {html:sc(S.pop(G.balance('🍎', '🍐🍐', 3, 4), .2), S.sub('Bruk samme enhet for å sammenligne', 1.6)),
    no:'Husk at enheten må være lik. Hvis vi måler to ting med de samme klossene, kan vi sammenligne hvem som er tyngst. Det med flest klosser er tyngst.'},
   {html:sc(S.row(S.pop(G.dial(3, 10), .2), S.pop(G.eq('3 kg', '#2563eb'), 1)), S.sub('Standardenhet: kilogram (kg)', 2)),
    no:'Standardenhetene for masse er gram og kilogram. Her er en vekt. Viseren peker på tre. Det er tre kilogram. Vi skriver 3 kg.'},
   {html:sc(S.row(S.pop(G.eq('1 kg = 1000 g', '#2563eb'), .2)), S.row(...[['🍞', '1 brødskive: 30 g'], ['🥛', '1 liter melk: 1 kg'], ['🎒', 'skolesekk: 4 kg']].map((x, i) => S.pop(`<div class="mtcard" style="--c:#f97316"><span style="font-size:2.2rem">${x[0]}</span><br>${x[1]}</div>`, 1 + i * .8))), S.sub('Små ting i gram, tunge ting i kilogram', 3.6)),
    no:'Små ting måler vi i gram. Store og tunge ting måler vi i kilogram. Ett kilogram er tusen gram. En brødskive er omtrent tretti gram. En liter melk er omtrent ett kilogram. En skolesekk kan være fire kilogram.'},
   {html:sc(S.big('Gjett først – veie etterpå!', .2), S.sub('Nå øver vi!', 1.4)),
    no:'Før du veier, kan du gjette. Hva tror du er tyngst? Så veier du og sammenligner med gjettingen din. Nå skal du øve på masse!'}
  ],
  tekst:{
   mal:'Du skal måle masse i praktiske situasjoner med klosser (ikke-standard) og med <b>gram</b> og <b>kilogram</b>, og snakke om resultatene.',
   steg:['Sammenlign med balansevekt: den tyngste siden går ned.', 'Mål med like enheter (for eksempel klosser): veier eplet like mye som 3 klosser?', 'Standardenheter: <b>gram (g)</b> og <b>kilogram (kg)</b>. 1 kg = 1000 g.', 'Les av en vekt: se hva viseren peker på.', 'Gjett først, veie etterpå.'],
   eks:[G.balance('🍎', '🧱🧱🧱', 3, 3) + '<br>1 eple = 3 klosser', G.dial(3, 10) + '<br>3 kg'],
   ord:[['masse', 'hvor tungt noe er (i hverdagen: vekt)'], ['gram (g)', 'liten enhet'], ['kilogram (kg)', 'stor enhet; 1 kg = 1000 g']],
   feil:['«Det største er alltid tyngst» – en ballong er stor, men lett.', '«1 kg = 100 g» – 1 kg = 1000 g.'],
   laerer:'KM13240 (masse): praktisk veiing med balansevekt og vekt, ikke-standardiserte og standardiserte enheter. La elevene veie ting i klasserommet og skille mellom størrelse og masse.'
  },
  refleksjon:'Hva er tyngre: en sukkerpose eller en skolesekk? Hvordan kan du sjekke det?',
  nivaaer:[
   {t:'Forstå: tyngre og lettere', d:'Sjekk at du har forstått masse.', kind:'forstaa', make:(r, i) => {
     const k = i % 5;
     if(k === 0) return Q.choice(r, 'Hva skjer med den siden på balansevekta som er tyngst?', 'Den går ned', ['Den går opp', 'Den står i ro', 'Den forsvinner'], {expl:'Den tyngste siden trekkes ned.'});
     if(k === 1) return Q.yn('Er alltid den største tingen den tyngste?', false, {expl:'Nei. En ballong er stor, men veldig lett.'});
     if(k === 2) return Q.num('1 kg = {?} g', 1000, {expl:'1 kilogram er 1000 gram.'});
     if(k === 3) return Q.choice(r, 'Når balansevekta står i ro, hva betyr det?', 'Begge sidene veier like mye', ['Den ene siden er tyngst', 'Vekta er ødelagt', 'Det er ingenting på den'], {expl:'I likevekt veier begge sider like mye.'});
     return Q.yn('Må vi bruke like store klosser for å kunne sammenligne masse?', true, {expl:'Ja. Enhetene må være like.'});
   }},
   {t:'Tyngre eller lettere?', d:'Se på balansevekta.', n:10, make:(r, i) => {
     const P = [['🪨', 9], ['🍎', 3], ['🪶', 1], ['📚', 6], ['🥔', 4], ['🎈', 1], ['🧱', 7], ['🍇', 2]], a = pick(r, P), b = pick(r, P.filter(x => x[0] !== a[0]));
     if(a[1] === b[1]) return null;
     if(i % 2 === 0) return Q.choice(r, `${G.balance(a[0], b[0], a[1], b[1])}<br>Hvilken er tyngst?`, a[1] > b[1] ? 'Venstre' : 'Høyre', ['Venstre', 'Høyre'], {keep:true, say:'Hvilken er tyngst?', expl:'Den siden som går ned er tyngst.'});
     return Q.yn(`${G.balance(a[0], b[0], a[1], b[1])}<br>Er tingen til venstre lettere enn tingen til høyre?`, a[1] < b[1], {say:'Er tingen til venstre lettere enn tingen til høyre?', expl:'Den siden som går opp er lettest.'});
   }},
   {t:'Veie med klosser', d:'Hvor mange klosser?', n:10, make:(r, i) => {
     const n = int(r, 2, 9), m = int(r, 2, 9), o = pick(r, ['🍎', '🥔', '📚', '🍐']);
     if(i % 2 === 0) return Q.num(`${G.balance(o, '🧱', n, n)}<br>${G.objs('🧱', n, {per:5, s:'1.6rem'})}<br>Vekta står i ro. Hvor mange klosser veier ${o} like mye som? {?}`, n, {say:`Vekta står i ro. Hvor mange klosser veier ${o} like mye som?`, expl:`Tell klossene: ${n}.`});
     if(n === m) return null; return Q.num(`${o} veier ${n} klosser. ${pick(r, ['🍉', '🎃'])} veier ${Math.max(n, m) + 3} klosser. Hvor mange klosser tyngre er den siste? {?}`, Math.max(n, m) + 3 - n, {say:`Den første veier ${n} klosser. Den andre veier ${Math.max(n, m) + 3} klosser. Hvor mange klosser tyngre er den andre?`, calc:`${Math.max(n, m) + 3}-${n}`, expl:`${Math.max(n, m) + 3} − ${n} = ${Math.max(n, m) + 3 - n}.`});
   }},
   {t:'Les av vekta', d:'Hvor mye viser viseren?', n:10, make:(r, i) => {
     if(i % 2 === 0){ const v = int(r, 1, 9); return Q.num(`${G.dial(v, 10)}<br>Hvor mange kg viser vekta? {?} kg`, v, {say:'Hvor mange kilogram viser vekta?', expl:`Viseren peker på ${v}: ${v} kg.`}); }
     const v = int(r, 1, 9) * 100; return Q.num(`${G.dial(v, 1000, {unit:'g', step:100})}<br>Hvor mange gram viser vekta? {?} g`, v, {say:'Hvor mange gram viser vekta?', expl:`Viseren peker på ${v}: ${v} g.`});
   }},
   {t:'Gram og kilogram', d:'Velg enhet og regn om.', n:10, make:(r, i) => {
     const k = i % 3;
     if(k === 0){ const t = pick(r, [['en sukkerpose', 'kilogram (kg)'], ['en binders', 'gram (g)'], ['en brødskive', 'gram (g)'], ['en skolesekk', 'kilogram (kg)'], ['en katt', 'kilogram (kg)'], ['et eple', 'gram (g)']]); return Q.choice(r, `Hvilken enhet passer best for å veie ${t[0]}?`, t[1], [t[1].startsWith('gram') ? 'kilogram (kg)' : 'gram (g)'], {say:`Hvilken enhet passer best for å veie ${t[0]}?`, expl:t[1].startsWith('gram') ? 'Små ting veier vi i gram.' : 'Tunge ting veier vi i kilogram.'}); }
     if(k === 1){ const m = int(r, 1, 6); return Q.num(`${m} kg = {?} g`, m * 1000, {say:`${m} kilogram er hvor mange gram?`, calc:`${m}*1000`, expl:`1 kg = 1000 g, så ${m} kg = ${m * 1000} g.`}); }
     const m = int(r, 1, 6); return Q.num(`${m * 1000} g = {?} kg`, m, {say:`${m * 1000} gram er hvor mange kilogram?`, expl:`1000 g = 1 kg, så ${m * 1000} g = ${m} kg.`});
   }}
  ]
});
})();
