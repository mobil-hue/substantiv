(function(){
'use strict';
/* Moduler 3. trinn: multiplikasjon ved telling og gruppering, dobling og halvering, divisjon, problemløsing (KM13245, KM13254, KM13246) */
const A = window.App, MT = window.MT, G = MT.G, Q = MT.Q, S = MT.S, B = MT.B;
const {int, pick, shuf} = MT, {sc, pop, fade, big, sub, row, chip, title} = S;
const uniq = a => a.filter((x, i) => a.indexOf(x) === i);
const range = (a, b) => Array.from({length:b - a + 1}, (_, i) => a + i);
const mgp = (g, n, e) => G.groups(Array.from({length:g}, () => [e, n, Math.min(n, 5)]), {s:'1.5rem'});
const plus = (g, n) => Array(g).fill(n).join(' + ');
const FACT = [2, 3, 4, 5, 10];
const HOLD = [['pose', 'poser'], ['eske', 'esker'], ['kurv', 'kurver'], ['boks', 'bokser'], ['skål', 'skåler']];
const cnt = (n, t) => n === 1 ? '1 ' + t[2] : n + ' ' + t[1];
const hop = (d, g, o) => G.nline(0, d * g + (o && o.pad || d), Object.assign({every:d > 5 ? d : 1, hops:range(0, g - 1).map(k => ({a:k * d, b:(k + 1) * d, label:'+' + d, c:'#f97316'})), marks:[{v:0, label:'0', c:'#16a34a'}], w:Math.min(700, 60 + d * g * 26)}, o || {}));

/* ======================================================================
   Gange: like store grupper (KM13245)
   ====================================================================== */
MT.module({
  id:'gange-grupper', rek:110, trinn:[3], maal:['KM13245'], tittel:'Gange: like store grupper', ikon:'🍎', bygger:['bytte-rekkefolge', 'hopptelling', 'addisjon-til-10'],
  video:[
   {html:title('🍎', 'Gange: like store grupper', S.sub('Fra pluss til gange', 1.2)),
    no:'Nå skal vi lære om gange. Gange handler om like store grupper. Når vi forstår hva gange betyr, blir det mye lettere å regne.'},
   {html:sc(S.pop(mgp(3, 4, '🍎'), .2), S.sub('3 tallerkener med 4 epler på hver', 1.6)),
    no:'Her er tre tallerkener. På hver tallerken ligger fire epler. Det er tre grupper, og det er like mange i hver gruppe. Hvor mange epler er det til sammen?'},
   {html:sc(S.pop(mgp(3, 4, '🍎'), .2), S.big('4 + 4 + 4 = 12', 1.4), S.sub('Vi legger sammen gruppene', 2.4)),
    no:'Vi kan legge sammen gruppene. Fire pluss fire pluss fire er tolv. Det er tolv epler. Men hvis det er mange grupper, blir det mye å skrive.'},
   {html:sc(S.row(S.pop(G.eq('3 × 4', '#f97316'), .2), S.pop('<span style="font-size:2.2rem;font-weight:900">=</span>', .8), S.pop(G.eq('4 + 4 + 4', '#2563eb'), 1.4), S.pop('<span style="font-size:2.2rem;font-weight:900">=</span>', 2), S.pop(G.eq('12', '#16a34a'), 2.6)), S.sub('3 × 4: tre ganger fire = 3 grupper med 4', 3.4)),
    no:'Derfor har vi gange. Tre ganger fire betyr tre grupper med fire. Det er det samme som fire pluss fire pluss fire. Svaret er tolv. Gange er en rask måte å legge sammen like store grupper.'},
   {html:sc(S.row(S.pop(G.groups([['🍎', 3], ['🍎', 5], ['🍎', 2]]), .2)), S.sub('Ulike grupper: ikke gange!', 1.4)),
    no:'Men pass på. Her er det ikke like mange i hver gruppe: tre, fem og to. Da kan vi ikke bruke gange. Gange fungerer bare når gruppene er like store.'},
   {html:sc(S.row(S.pop(G.objs('🍎', 12, {per:4, s:'2rem'}), .2)), S.sub('3 rader med 4 – også 3 × 4', 1.4)),
    no:'Vi kan også ordne dem i rader. Her er tre rader, og det er fire i hver rad. Tre ganger fire er tolv. Rader og grupper er det samme tenkemåten.'},
   {html:sc(S.pop(G.nline(0, 14, {hops:[0, 4, 8].map(a => ({a, b:a + 4, label:'+4', c:'#f97316'})), marks:[{v:0, label:'0', c:'#16a34a'}], w:640}), .2), S.sub('3 hopp med 4: 4, 8, 12', 1.6)),
    no:'På tallinja blir det tre hopp, hvert hopp er fire langt. Fire, åtte, tolv. Vi lander på tolv.'},
   {html:sc(S.row(S.pop(G.eq('1 × 4 = 4', '#2563eb'), .2), S.pop(G.eq('0 × 4 = 0', '#2563eb'), 1)), S.sub('Nå øver vi!', 2)),
    no:'Én gruppe med fire er fire. Null grupper med fire er ingenting, altså null. Nå vet du hva gange betyr. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal beskrive og utforske <b>multiplikasjon ved telling og gruppering</b>: gange som like store grupper.',
   steg:['<b>3 × 4</b> betyr <b>3 grupper med 4</b>: 4 + 4 + 4.', 'Alle gruppene må være <b>like store</b>.', 'Du kan tegne grupper, rader eller hopp på tallinja.', 'Første tall = antall grupper. Andre tall = hvor mange i hver gruppe.', '1 × 4 = 4 og 0 × 4 = 0.'],
   eks:[mgp(3, 4, '🍎') + '<br>3 × 4 = 4 + 4 + 4 = 12', G.objs('⭐', 10, {per:5}) + '<br>2 × 5 = 10'],
   ord:[['multiplikasjon (gange)', 'å legge sammen like store grupper'], ['ganger (×)', 'tegnet for gange'], ['faktor', 'tallene du ganger med hverandre'], ['produkt', 'svaret på et gangestykke']],
   feil:['«3 × 4 betyr 3 + 4» – 3 × 4 betyr tre grupper med fire: 4 + 4 + 4.', '«3, 5 og 2 i gruppene er gange» – gruppene må være like store.'],
   laerer:'KM13245: beskrive og utforske multiplikasjon ved telling og gruppering. Start med konkreter (kuler på tallerkener), gå til tegning og rader, så symbol. Norsk tradisjon: «3 × 4» = 3 grupper med 4. Kommutativitet (3 × 4 = 4 × 3) behandles senere (KM13248).'
  },
  refleksjon:'Tegn 4 grupper med 3 prikker. Hvilket gangestykke og hvilket pluss-stykke passer?',
  nivaaer:[
   {t:'Forstå: hva betyr gange?', d:'Sjekk at du har forstått gange.', kind:'forstaa', make:(r, i) => {
     const g = int(r, 2, 5), n = int(r, 2, 6), k = i % 6;
     if(k === 0) return Q.choice(r, `Hva betyr <b>${g} × ${n}</b>?`, `${g} grupper med ${n}`, [`${g} + ${n}`, `${g} − ${n}`, `${g}${n}`], {say:`Hva betyr ${g} ganger ${n}?`, expl:`${g} × ${n} betyr ${g} grupper med ${n}: ${plus(g, n)}.`});
     if(k === 1){ const ok = r() < .5, grp = ok ? [['🍎', n], ['🍎', n], ['🍎', n]] : [['🍎', n], ['🍎', n + 1], ['🍎', n - 1 > 0 ? n - 1 : n + 2]]; return Q.yn(`${G.groups(grp)}<br>Er det like store grupper (kan vi bruke gange)?`, ok, {say:'Er det like store grupper? Kan vi bruke gange?', expl:ok ? 'Ja, det er like mange i hver gruppe.' : 'Nei, gruppene er ikke like store.'}); }
     if(k === 2) return Q.choice(r, `Hvilket pluss-stykke er det samme som <b>${g} × ${n}</b>?`, plus(g, n), [`${g} + ${n}`, plus(g + 1, n), plus(g, n + 1)].filter(x => x !== plus(g, n)), {say:`Hvilket pluss-stykke er det samme som ${g} ganger ${n}?`, expl:`${g} grupper med ${n}: ${plus(g, n)}.`});
     if(k === 3) return Q.num(`I ${g} × ${n}: hvor mange er det i hver gruppe? {?}`, n, {say:`I ${g} ganger ${n}: hvor mange er det i hver gruppe?`, expl:`Det andre tallet sier hvor mange det er i hver gruppe: ${n}.`});
     if(k === 4) return Q.num(`I ${g} × ${n}: hvor mange grupper er det? {?}`, g, {say:`I ${g} ganger ${n}: hvor mange grupper er det?`, expl:`Det første tallet sier hvor mange grupper det er: ${g}.`});
     return Q.yn('Er gange en rask måte å legge sammen like store grupper?', true, {expl:'Ja. 4 × 5 er det samme som 5 + 5 + 5 + 5.'});
   }},
   {t:'Se gruppene', d:'Tell like store grupper.', n:10, make:(r, i) => {
     const g = int(r, 2, 5), n = int(r, 2, 5), e = pick(r, MT.THINGS)[0];
     if(i % 2 === 0) return Q.num(`${mgp(g, n, e)}<br>Hvor mange er det til sammen? {?}`, g * n, {say:'Hvor mange er det til sammen?', calc:`${g}*${n}`, expl:`${g} grupper med ${n}: ${plus(g, n)} = ${g * n}.`, hint:plus(g, n) + ' = ?'});
     return Q.choice(r, `${mgp(g, n, e)}<br>Hvilket gangestykke passer?`, `${g} × ${n}`, [`${n} × ${g + 1}`, `${g} + ${n}`, `${g + 1} × ${n}`].filter(x => x !== `${g} × ${n}`), {say:'Hvilket gangestykke passer til bildet?', expl:`${g} grupper med ${n} er ${g} × ${n}.`});
   }},
   {t:'Gange som gjentatt pluss', d:'Skriv gange som pluss, og pluss som gange.', n:10, make:(r, i) => {
     const g = int(r, 2, 6), n = int(r, 2, 6), k = i % 3;
     if(k === 0) return Q.num(`${g} × ${n} = ${plus(g, n)} = {?}`, g * n, {say:`${g} ganger ${n} er ${plus(g, n).replace(/\+/g, 'pluss')}. Hva er summen?`, calc:`${g}*${n}`, expl:`${plus(g, n)} = ${g * n}.`});
     if(k === 1) return Q.num(`${plus(g, n)} = {?} × ${n}`, g, {say:`${plus(g, n).replace(/\+/g, 'pluss')} er hvor mange ganger ${n}?`, chk:`_*${n}===${g * n}`, expl:`Det er ${g} grupper med ${n}: ${g} × ${n}.`});
     return Q.num(`${plus(g, n)} = {?}`, g * n, {say:plus(g, n).replace(/\+/g, 'pluss'), calc:`${g}*${n}`, expl:`${g} × ${n} = ${g * n}.`, hint:`${g} × ${n}: ${g} grupper med ${n}.`});
   }},
   {t:'Rader og kolonner', d:'Gange i rader.', n:10, make:(r, i) => {
     const g = int(r, 2, 5), n = int(r, 3, 6), e = pick(r, MT.THINGS)[0], k = i % 3;
     if(k === 0) return Q.num(`${G.objs(e, g * n, {per:n, s:'1.7rem'})}<br>Hvor mange rader er det? {?}`, g, {say:'Hvor mange rader er det?', expl:`Tell radene: ${g}.`});
     if(k === 1) return Q.num(`${G.objs(e, g * n, {per:n, s:'1.7rem'})}<br>Hvor mange er det i hver rad? {?}`, n, {say:'Hvor mange er det i hver rad?', expl:`Tell i en rad: ${n}.`});
     return Q.num(`${G.objs(e, g * n, {per:n, s:'1.7rem'})}<br>${g} rader med ${n}: ${g} × ${n} = {?}`, g * n, {say:`${g} rader med ${n}. Hvor mange er det til sammen?`, calc:`${g}*${n}`, expl:`${plus(g, n)} = ${g * n}.`});
   }},
   {t:'Regn med grupper', d:'Regn gangestykker (også 0 og 1).', n:10, make:(r, i) => {
     const g = pick(r, i % 5 === 4 ? [0, 1] : [2, 3, 4, 5]), n = int(r, 2, 10);
     return Q.num(`${g} × ${n} = {?}`, g * n, {say:`${g} ganger ${n}`, calc:`${g}*${n}`, expl:g > 1 ? `${g} grupper med ${n}: ${plus(g, n)} = ${g * n}.` : `${g} gruppe${g === 1 ? '' : 'r'} med ${n} er ${g * n}.`, hint:n <= 6 && g >= 2 ? mgp(g, n, '🔵') : `${g} grupper med ${n}.`});
   }}
  ],
  drill:{tittel:'Gange med grupper', layout:{a:'pic', b:'row'}, cols:{a:3, b:4}, n:[30, 32], make:(r, i, hard) => {
    if(!hard){ const g = int(r, 2, 5), n = int(r, 2, 5); return {t:`${g} × ${n} =`, ans:g * n, pic:G.groups(Array.from({length:g}, () => ['🔵', n, Math.min(n, 5)]), {s:'1rem'})}; }
    const g = pick(r, [1, 2, 3, 4, 5, 10]), n = int(r, 2, 10); return r() < .3 ? {t:`${g} × ☐ = ${g * n}`, ans:n} : {t:`${g} × ${n} =`, ans:g * n}; }}
});

/* ======================================================================
   Gange og hopptelling (KM13245)
   ====================================================================== */
const tbl = (d, upto) => range(1, upto || 10).map(k => `${k} × ${d} = ${k * d}`).join(' · ');
MT.module({
  id:'gange-telling', rek:112, trinn:[3], maal:['KM13245'], tittel:'Gange og hopptelling: 2-, 5- og 10-gangen', ikon:'🦘', bygger:['gange-grupper', 'hopptelling'],
  video:[
   {html:title('🦘', 'Gange og hopptelling', S.sub('2-, 5- og 10-gangen', 1.2)),
    no:'Nå skal vi se at gange og hopptelling er det samme. Når vi hopper like langt flere ganger, regner vi gange.'},
   {html:sc(S.pop(G.nline(0, 10, {hops:[0, 2, 4, 6].map(a => ({a, b:a + 2, label:'+2', c:'#f97316'})), marks:[{v:0, label:'0', c:'#16a34a'}], w:620}), .2), S.row(S.pop(G.eq('4 hopp med 2: 2, 4, 6, 8', '#2563eb'), 1.4), S.pop(G.eq('4 × 2 = 8', '#16a34a'), 2.4))),
    no:'Her hopper vi to om gangen, fire ganger. To, fire, seks, åtte. Fire hopp med to er åtte. Vi skriver fire ganger to er åtte. Antall hopp først, så hvor langt hvert hopp er.'},
   {html:sc(S.row(S.pop('<span style="font-size:3rem">🖐️🖐️🖐️</span>', .2)), S.row(S.pop(G.eq('5, 10, 15', '#2563eb'), 1.2), S.pop(G.eq('3 × 5 = 15', '#16a34a'), 2))),
    no:'Fem-gangen kjenner du fra fingrene. Hver hånd har fem fingre. Tre hender er tre ganger fem. Fem, ti, femten. Tre ganger fem er femten.'},
   {html:sc(S.pop(G.grid({cs:26, hl:range(1, 10).map(k => k * 10)}), .2), S.row(S.pop(G.eq('6 × 10 = 60', '#16a34a'), 1.6)), S.sub('10-gangen: tiere – null bak', 2.4)),
    no:'Ti-gangen er tiere. Ti, tjue, tretti, førti, femti, seksti. Seks ganger ti er seksti. Vi setter bare en null bak tallet.'},
   {html:sc(S.row(S.pop(G.eq('1 × 5 = 5', '#2563eb'), .2), S.pop(G.eq('2 × 5 = 10', '#2563eb'), .6), S.pop(G.eq('3 × 5 = 15', '#2563eb'), 1)), S.row(S.pop(G.eq('4 × 5 = 20', '#2563eb'), 1.4), S.pop(G.eq('5 × 5 = 25', '#2563eb'), 1.8), S.pop(G.eq('6 × 5 = 30', '#2563eb'), 2.2)), S.sub('Hvert gangestykke er ett hopp til', 3)),
    no:'Slik blir fem-gangen. Ett ganger fem er fem. To ganger fem er ti. For hvert gangestykke hopper vi fem til. Se hvordan svarene ender på fem og null.'},
   {html:sc(S.row(S.pop(G.chips([2, 4, 6, 8, 10, 12, 14], {c:'#3b82f6'}), .2)), S.row(S.pop(G.chips([5, 10, 15, 20, 25, 30], {c:'#f97316'}), 1.4)), S.sub('2-gangen: partall · 5-gangen: slutter på 0 eller 5', 2.8)),
    no:'Se på mønsteret. To-gangen gir bare partall. Fem-gangen ender på null eller fem. Slike mønstre kan hjelpe deg å huske og sjekke.'},
   {html:sc(S.row(S.pop(G.objs('🔴', 15, {per:5, s:'1.6rem'}), .2), S.pop('<span style="font-size:2rem;font-weight:900"> = </span>', .8), S.pop(G.objs('🔴', 15, {per:3, s:'1.6rem'}), 1.4)), S.row(S.pop(G.eq('3 × 5 = 5 × 3', '#16a34a'), 2.2)), S.sub('Vend rutenettet: 3 rader med 5 = 5 rader med 3', 3)),
    no:'Vi kan vende rutenettet. Tre rader med fem er femten. Fem rader med tre er også femten. Tre ganger fem er det samme som fem ganger tre. Det blir en snarvei senere.'},
   {html:sc(S.big('Husker du ikke svaret? Hopp!', .2), S.sub('7 × 5: 5, 10, 15, 20, 25, 30, 35', 1.4)),
    no:'Hvis du ikke husker et gangestykke, kan du hoppe. Sju ganger fem: fem, ti, femten, tjue, tjuefem, tretti, trettifem. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal se sammenhengen mellom <b>hopptelling og gange</b>, og kunne 2-, 5- og 10-gangen (og begynne på 3 og 4) ved hjelp av telling og gruppering.',
   steg:['<b>Antall hopp × hvor langt hvert hopp er</b>: 4 × 2 = 4 hopp med 2 = 2, 4, 6, 8.', '2-gangen: bare partall. 5-gangen: ender på 0 eller 5. 10-gangen: tiere (null bak).', 'Husker du ikke svaret? <b>Hopp</b> eller <b>legg til</b> én gruppe til: 7 × 5 = 6 × 5 + 5.', 'Du kan vende rutenettet: 3 × 5 = 5 × 3.'],
   eks:[hop(2, 4) + '<br>4 × 2 = 8', 'Fem-gangen: ' + tbl(5, 6)],
   ord:[['hopptelling', 'telle med like store hopp'], ['gangetabell', 'liste med gangestykker for ett tall'], ['partall', 'tall i 2-gangen']],
   feil:['«5-gangen ender på 5» – den ender på 0 eller 5.', '«4 × 2 = 6» – 4 hopp med 2: 2, 4, 6, 8.'],
   laerer:'KM13245: utforske multiplikasjon ved telling og gruppering. Dette er kobling mellom hopptelling (KM13230) og gange. Elevene bruker telling for å finne svar og «legge til én gruppe». Mønstrene (partall, endesiffer) hjelper kontroll. Full gangetabell følger i 4. trinn.'
  },
  refleksjon:'Forklar hvordan du finner 6 × 5 uten å huske svaret.',
  nivaaer:[
   {t:'Forstå: hopp og gange', d:'Sjekk at du har forstått.', kind:'forstaa', make:(r, i) => {
     const g = int(r, 3, 6), d = pick(r, [2, 5, 10]), k = i % 6;
     if(k === 0) return Q.choice(r, `Hva betyr <b>${g} × ${d}</b> som hopptelling?`, `${g} hopp med ${d}`, [`${d} hopp med ${g + 1}`, `${g + d} hopp`, `${g} hopp med ${d + 1}`], {say:`Hva betyr ${g} ganger ${d} som hopptelling?`, expl:`${g} × ${d}: ${g} hopp, hvert hopp er ${d} langt.`});
     if(k === 1) return Q.choice(r, 'Hvilken gangetabell har bare partall?', '2-gangen', ['5-gangen', '3-gangen', '10-gangen (ender på 5)'], {expl:'To-gangen gir bare partall: 2, 4, 6, 8 …'});
     if(k === 2) return Q.choice(r, 'Hva ender svarene i 5-gangen på?', '0 eller 5', ['1 eller 6', '2 eller 7', 'Bare 5'], {expl:'5, 10, 15, 20 … ender på 5 og 0.'});
     if(k === 3) return Q.yn(`Er ${g} × 5 = ${(g - 1) * 5} + 5?`, true, {expl:`Ja. Ett hopp til: ${(g - 1) * 5} + 5 = ${g * 5}.`});
     if(k === 4) return Q.num('10-gangen: 6 × 10 = ? (tiere) {?}', 60, {expl:'6 tiere er 60.'});
     return Q.yn(`Er ${g} × 2 det samme som ${g} + ${g}?`, true, {expl:`Ja. 2 × ${g} og ${g} × 2 er begge dobbelt av ${g}.`.replace(/Ja.*/, `Ja. ${g} hopp med 2 er ${g * 2}, og ${g} + ${g} er også ${g * 2}.`)});
   }},
   {t:'Hopp på tallinjen', d:'Hvor lander du?', n:10, make:(r, i) => {
     const d = pick(r, [2, 3, 4, 5, 10]), g = int(r, 3, d === 10 ? 6 : 6);
     if(i % 2 === 0) return Q.num(`${hop(d, g)}<br>${g} hopp med ${d}: ${g} × ${d} = {?}`, g * d, {say:`${g} hopp med ${d}. Hvor lander du?`, calc:`${g}*${d}`, expl:`${g} hopp med ${d}: ${range(1, g).map(k => k * d).join(', ')}.`});
     return Q.num(`Du hopper ${d} om gangen, ${g} ganger fra 0. Hvor lander du? {?}`, g * d, {say:`Du hopper ${d} om gangen, ${g} ganger fra null. Hvor lander du?`, calc:`${g}*${d}`, expl:`${range(1, g).map(k => k * d).join(', ')}: ${g} × ${d} = ${g * d}.`, hint:hop(d, g)});
   }},
   {t:'2-gangen', d:'Hopp med 2.', n:10, make:(r, i) => {
     const g = int(r, 1, 10), k = i % 3;
     if(k === 0) return Q.num(`${g} × 2 = {?}`, g * 2, {say:`${g} ganger 2`, calc:`${g}*2`, expl:`${g} hopp med 2: ${g * 2}.`});
     if(k === 1) return Q.num(`${g} × 2 = ${g} + {?}`, g, {say:`${g} ganger 2 er ${g} pluss hva?`, chk:`${g}+_===${g * 2}`, expl:`Dobbelt av ${g}: ${g} + ${g}.`});
     return Q.num(`{?} × 2 = ${g * 2}`, g, {chk:`_*2===${g * 2}`, say:`Hvor mange ganger 2 er ${g * 2}?`, expl:`Hopp med 2 til ${g * 2}: ${g} hopp.`, hint:hop(2, g)});
   }},
   {t:'5- og 10-gangen', d:'Hopp med 5 og 10.', n:10, make:(r, i) => {
     const d = i % 2 ? 10 : 5, g = int(r, 1, 10), k = i % 3;
     if(k === 0) return Q.num(`${g} × ${d} = {?}`, g * d, {say:`${g} ganger ${d}`, calc:`${g}*${d}`, expl:d === 5 ? `${g} hopp med 5: ${g * 5}.` : `${g} tiere = ${g * 10}.`});
     if(k === 1) return Q.num(`{?} × ${d} = ${g * d}`, g, {chk:`_*${d}===${g * d}`, say:`Hvor mange ganger ${d} er ${g * d}?`, expl:`${g * d} / ${d} = ${g}: ${g} hopp.`, hint:hop(d, g, {pad:d})});
     return Q.num(`${g} × ${d} = ${g - 1} × ${d} + {?}`, d, {chk:`${g - 1}*${d}+_===${g * d}`, say:`${g} ganger ${d} er ${g - 1} ganger ${d} pluss hva?`, expl:`Ett hopp til: +${d}.`});
   }},
   {t:'Fra hopp til gangestykke', d:'Hvilket gangestykke passer?', n:10, make:(r, i) => {
     const d = pick(r, [2, 3, 4, 5, 10]), g = int(r, 3, 7), seq = range(1, g).map(k => k * d);
     return Q.choice(r, `${seq.join(', ')}<br>Hvilket gangestykke passer til hoppene?`, `${g} × ${d}`, [`${d} × ${g + 1}`, `${g + 1} × ${d}`, `${g} + ${d}`], {say:`${seq.join(', ')}. Hvilket gangestykke passer til hoppene?`, expl:`${g} hopp med ${d}: ${g} × ${d} = ${g * d}.`});
   }},
   {t:'Blandet: 2, 3, 4, 5 og 10', d:'Regn gangestykker med tabellene du har lært.', n:12, make:(r, i) => {
     const d = pick(r, [2, 3, 4, 5, 10, 5, 10, 2]), g = int(r, 2, 10);
     return Q.num(`${g} × ${d} = {?}`, g * d, {say:`${g} ganger ${d}`, calc:`${g}*${d}`, expl:`${g} hopp med ${d}: ${range(1, Math.min(g, 6)).map(k => k * d).join(', ')}${g > 6 ? ' …' : ''} = ${g * d}.`, hint:hop(d, Math.min(g, 8), {pad:d})});
   }}
  ],
  drill:{tittel:'2-, 5- og 10-gangen', layout:'row', cols:4, n:[64, 36], make:(r, i, hard) => {
    const d = pick(r, hard ? [2, 3, 4, 5, 10] : [2, 5, 10]), g = int(r, hard ? 1 : 2, 10), k = hard ? int(r, 0, 3) : (r() < .25 ? 1 : 0);
    if(k === 1) return {t:`${d} × ${g} =`, ans:g * d}; if(k === 2) return {t:`${g} × ☐ = ${g * d}`, ans:d}; if(k === 3) return {t:`☐ × ${d} = ${g * d}`, ans:g};
    return {t:`${g} × ${d} =`, ans:g * d}; }}
});

/* ======================================================================
   Dobling og halvering (KM13254)
   ====================================================================== */
const dbl2 = n => `${n * 10} + ${n * 10}`;
MT.module({
  id:'dobling-halvering', rek:114, trinn:[3], maal:['KM13254'], tittel:'Dobling og halvering', ikon:'🪞', bygger:['gange-grupper', 'addisjon-tosifret', 'partall-oddetall'],
  video:[
   {html:title('🪞', 'Dobling og halvering', S.sub('Dobbelt og halvt', 1.2)),
    no:'Nå skal vi lære å doble og halvere. Å doble betyr å ta to like deler. Å halvere betyr å dele i to like deler. De to hører sammen.'},
   {html:sc(S.row(S.pop(G.objs('🍎', 7, {per:7, s:'1.6rem'}), .2), S.pop(G.objs('🍎', 7, {per:7, s:'1.6rem'}), 1)), S.row(S.pop(G.eq('dobbelt av 7: 7 + 7 = 14', '#16a34a'), 1.8), S.pop(G.eq('2 × 7', '#2563eb'), 2.6))),
    no:'Her er sju epler. Dobbelt så mange er sju pluss sju. Det er fjorten. Å doble sju er det samme som to ganger sju. To like grupper.'},
   {html:sc(S.pop(G.objs('🍎', 14, {per:7, s:'1.6rem'}), .2), S.row(S.pop(G.eq('halvparten av 14 = 7', '#f97316'), 1.2), S.pop(G.eq('7 + 7 = 14', '#16a34a'), 2)), S.sub('Å halvere: dele i to like deler', 2.8)),
    no:'Nå går vi motsatt vei. Fjorten epler deler vi i to like deler. Hver del har sju. Halvparten av fjorten er sju, fordi sju pluss sju er fjorten.'},
   {html:sc(S.row(S.pop(G.eq('dobbelt: 1→2 · 2→4 · 3→6 · 4→8 · 5→10', '#16a34a'), .2)), S.row(S.pop(G.eq('halvt: 10→5 · 8→4 · 6→3 · 4→2 · 2→1', '#f97316'), 1.2)), S.sub('Dobbelt og halvt er motsatte', 2.4)),
    no:'Dobbelt av fire er åtte. Halvparten av åtte er fire. Dobling og halvering er motsatte. Det som er doblet, kan vi halvere, og tilbake.'},
   {html:sc(S.pop(G.pv({t:3, e:0}), .2), S.row(S.pop(G.eq('dobbelt av 3 tiere = 6 tiere', '#16a34a'), 1.2), S.pop(G.eq('dobbelt av 30 = 60', '#2563eb'), 2.2))),
    no:'Vi kan doble tiere akkurat som enere. Tre tiere doblet er seks tiere. Dobbelt av tretti er seksti. Halvparten av åtti er førti, fordi åtte tiere er fire tiere og fire tiere.'},
   {html:sc(S.row(S.pop(G.eq('46 = 40 + 6', '#2563eb'), .2)), S.row(S.pop(G.eq('dobbelt av 40 = 80', '#16a34a'), 1.2), S.pop(G.eq('dobbelt av 6 = 12', '#f97316'), 2)), S.big('80 + 12 = 92', 2.8)),
    no:'Hvordan dobler vi større tall? Del opp i tiere og enere. Førtiseks er førti og seks. Dobbelt av førti er åtti. Dobbelt av seks er tolv. Åtti pluss tolv er nittito.'},
   {html:sc(S.row(S.pop(G.eq('84 = 80 + 4', '#2563eb'), .2)), S.row(S.pop(G.eq('halvt av 80 = 40', '#16a34a'), 1.2), S.pop(G.eq('halvt av 4 = 2', '#f97316'), 2)), S.big('40 + 2 = 42', 2.8)),
    no:'Vi halverer på samme måte. Åttifire er åtti og fire. Halvparten av åtti er førti. Halvparten av fire er to. Førti pluss to er førtito.'},
   {html:sc(S.row(S.pop(G.eq('4 × 15: dobbelt av 15 = 30, dobbelt av 30 = 60', '#9333ea'), .2)), S.sub('Doble to ganger = 4 ganger', 1.4), S.sub('Nå øver vi!', 2.4)),
    no:'Hvis vi dobler to ganger, får vi fire ganger så mange. Dobbelt av femten er tretti. Dobbelt av tretti er seksti. Fire ganger femten er seksti. Nå skal du øve på dobling og halvering!'}
  ],
  tekst:{
   mal:'Du skal bruke <b>dobling og halvering</b> i hoderegning og skriftlig regning.',
   steg:['<b>Dobbelt</b> = to like deler: dobbelt av 7 = 7 + 7 = 14 = 2 × 7.', '<b>Halvparten</b> = dele i to like deler: halvparten av 14 = 7 (fordi 7 + 7 = 14).', 'Tosifret: <b>del opp</b>: dobbelt av 46 = 80 + 12 = 92. Halvparten av 84 = 40 + 2 = 42.', 'Dobbelt to ganger = <b>4 ganger</b>. Halvt to ganger = delt på 4.', 'Bare partall kan halveres i hele tall.'],
   eks:['dobbelt av 46: 40 → 80, 6 → 12, 80 + 12 = <b>92</b>', 'halvparten av 84: 80 → 40, 4 → 2, 40 + 2 = <b>42</b>', G.col('+', 46, 46, {ans:92, carry:{t:'1'}}) + '<br>dobbelt i oppstilling'],
   ord:[['dobbelt', 'to like deler: 2 × tallet'], ['halvparten', 'en av to like deler'], ['partall', 'tall som kan halveres uten rest']],
   feil:['«Halvparten av 9 er 4» – 9 er et oddetall og kan ikke halveres i hele tall.', '«Dobbelt av 46 er 812» – regn 40 + 40 og 6 + 6 hver for seg, så legg sammen: 80 + 12 = 92.'],
   laerer:'KM13254: bruke dobling og halvering i hoderegning og skriftlig regning. Dobling er multiplikasjon med 2 (kobler til KM13245), halvering er deling med 2. Skriftlig: dobling i oppstilling (pluss med mente). Strategi: del opp i tiere og enere. Brukes senere i 4-gangen (doble to ganger).'
  },
  refleksjon:'Forklar hvordan du regner ut halvparten av 76 i hodet.',
  nivaaer:[
   {t:'Forstå: dobbelt og halvt', d:'Sjekk at du har forstått dobling og halvering.', kind:'forstaa', make:(r, i) => {
     const n = int(r, 3, 12), k = i % 6;
     if(k === 0) return Q.yn(`Er dobbelt av ${n} det samme som ${n} + ${n}?`, true, {expl:`Ja: ${n} + ${n} = ${2 * n}.`});
     if(k === 1) return Q.yn(`Er halvparten av ${2 * n} det samme som ${n}?`, true, {expl:`Ja: ${n} + ${n} = ${2 * n}.`});
     if(k === 2) return Q.yn(`Kan du halvere ${2 * n + 1} i to like hele deler?`, false, {expl:`Nei. ${2 * n + 1} er et oddetall.`});
     if(k === 3) return Q.choice(r, 'Hva er dobbelt av et tall?', 'Tallet ganget med 2', ['Tallet delt på 2', 'Tallet pluss 2', 'Tallet minus 2'], {expl:'Dobbelt av 7 er 2 × 7 = 14.'});
     if(k === 4) return Q.choice(r, 'Hva er halvparten av et tall?', 'Tallet delt i to like deler', ['Tallet ganget med 2', 'Tallet pluss 2', 'Tallet minus 1'], {expl:'Halvparten av 14 er 7.'});
     return Q.yn('Er dobbelt og halvt motsatte?', true, {expl:'Ja. Dobbelt av 6 er 12, og halvparten av 12 er 6.'});
   }},
   {t:'Doble til 20', d:'Doble tall fra 1 til 10 (og litt over).', n:10, make:(r, i) => { const n = int(r, 2, 12), e = pick(r, MT.THINGS)[0]; return Q.num(`${G.objs(e, n, {per:6, s:'1.4rem'})}<br>Dobbelt av ${n} = {?}`, 2 * n, {say:`Dobbelt av ${n}`, calc:`2*${n}`, expl:`${n} + ${n} = ${2 * n}.`, hint:`${n} + ${n} = ?`}); }},
   {t:'Halvere partall til 20', d:'Halvparten av partall.', n:10, make:(r, i) => { const n = int(r, 2, 12) * 2, e = pick(r, MT.THINGS)[0]; return Q.num(`${G.objs(e, n, {per:8, s:'1.2rem'})}<br>Halvparten av ${n} = {?}`, n / 2, {say:`Halvparten av ${n}`, calc:`${n}/2`, expl:`${n / 2} + ${n / 2} = ${n}.`, hint:`Hvilket tall pluss seg selv er ${n}?`}); }},
   {t:'Tiere og tosifrede tall', d:'Doble og halvere større tall.', n:10, make:(r, i) => {
     const k = i % 4;
     if(k === 0){ const t = int(r, 1, 9); return Q.num(`Dobbelt av ${t * 10} = {?}`, t * 20, {say:`Dobbelt av ${t * 10}`, calc:`2*${t * 10}`, expl:`${t} tiere doblet er ${2 * t} tiere = ${t * 20}.`}); }
     if(k === 1){ const t = int(r, 1, 4), e = int(r, 1, 9), n = t * 10 + e; return Q.num(`Dobbelt av ${n}: ${t * 10} → ${t * 20}, ${e} → ${2 * e}. Svaret er {?}`, 2 * n, {say:`Dobbelt av ${n}. ${t * 10} dobles til ${t * 20}, ${e} dobles til ${2 * e}. Hva er svaret?`, calc:`2*${n}`, expl:`${t * 20} + ${2 * e} = ${2 * n}.`}); }
     if(k === 2){ const t = int(r, 1, 9) * 2, n = t * 10; return Q.num(`Halvparten av ${n} = {?}`, n / 2, {say:`Halvparten av ${n}`, calc:`${n}/2`, expl:`${t} tiere halvert er ${t / 2} tiere = ${n / 2}.`}); }
     const t = int(r, 1, 4) * 2, e = int(r, 1, 4) * 2, n = t * 10 + e; return Q.num(`Halvparten av ${n}: ${t * 10} → ${t * 5}, ${e} → ${e / 2}. Svaret er {?}`, n / 2, {say:`Halvparten av ${n}. ${t * 10} halveres til ${t * 5}, ${e} halveres til ${e / 2}. Hva er svaret?`, calc:`${n}/2`, expl:`${t * 5} + ${e / 2} = ${n / 2}.`});
   }},
   {t:'Doble og halvere to ganger', d:'Fire ganger så mange – og en fjerdedel.', n:10, make:(r, i) => {
     if(i % 2 === 0){ const n = int(r, 3, 25); return Q.num(`Doble ${n}, og doble svaret en gang til. Hva får du? {?}`, 4 * n, {say:`Doble ${n}, og doble svaret en gang til. Hva får du?`, calc:`4*${n}`, expl:`${n} → ${2 * n} → ${4 * n}. Det er 4 × ${n}.`}); }
     const n = int(r, 2, 15) * 4; return Q.num(`Halver ${n}, og halver svaret en gang til. Hva får du? {?}`, n / 4, {say:`Halver ${n}, og halver svaret en gang til. Hva får du?`, calc:`${n}/4`, expl:`${n} → ${n / 2} → ${n / 4}.`});
   }},
   {t:'Dobling i oppstilling og fortellinger', d:'Skriftlig dobling og tekstoppgaver.', n:10, make:(r, i) => {
     const k = i % 3;
     if(k === 0){ const n = int(r, 13, 49); return Q.num(`${G.col('+', n, n, {nohead:true})}<br>Dobbelt av ${n} = {?}`, 2 * n, {say:`Dobbelt av ${n}`, calc:`2*${n}`, expl:`${n} + ${n} = ${2 * n}.`}); }
     if(k === 1){ const n = int(r, 6, 24), nm = pick(r, MT.NAMES), nm2 = pick(r, MT.NAMES.filter(x => x !== nm)); return Q.num(`${nm} har ${n} kort. ${nm2} har dobbelt så mange. Hvor mange kort har ${nm2}? {?}`, 2 * n, {say:`${nm} har ${n} kort. ${nm2} har dobbelt så mange. Hvor mange kort har ${nm2}?`, calc:`2*${n}`, expl:`Dobbelt av ${n} er ${2 * n}.`}); }
     const n = int(r, 3, 20) * 2, nm = pick(r, MT.NAMES); return Q.num(`${nm} har ${n} kroner og gir bort halvparten. Hvor mye gir ${nm} bort? {?}`, n / 2, {say:`${nm} har ${n} kroner og gir bort halvparten. Hvor mye gir ${nm} bort?`, calc:`${n}/2`, expl:`Halvparten av ${n} er ${n / 2}.`});
   }}
  ],
  drill:{tittel:'Doble og halvere', layout:'row', cols:3, n:[48, 30], make:(r, i, hard) => {
    if(i % 2 === 0){ const n = hard ? (r() < .5 ? int(r, 11, 49) : int(r, 2, 9) * 10) : int(r, 2, 15); return {t:`Dobbelt av ${n} =`, ans:2 * n}; }
    const n = (hard ? (r() < .5 ? int(r, 6, 49) * 2 : int(r, 1, 9) * 20) : int(r, 1, 15) * 2); return {t:`Halvparten av ${n} =`, ans:n / 2}; }}
});

/* ======================================================================
   Divisjon: dele likt og dele i grupper (KM13246)
   ====================================================================== */
const share = (n, g, e) => `${G.objs(e, n, {per:Math.min(n, 10), s:'1.4rem'})}`;
MT.module({
  id:'dele-likt', rek:116, trinn:[3], maal:['KM13246'], tittel:'Dele likt: divisjon som motsatt av gange', ikon:'➗', bygger:['gange-grupper', 'trekke-fra'],
  video:[
   {html:title('➗', 'Dele likt', S.sub('Divisjon', 1.2)),
    no:'Nå skal vi lære å dele likt. Det kalles divisjon. Når vi deler likt, får alle like mange.'},
   {html:sc(S.pop(G.objs('🍎', 12, {per:6, s:'1.8rem'}), .2), S.sub('12 epler skal deles likt mellom 3 tallerkener', 1.4)),
    no:'Vi har tolv epler. De skal deles likt mellom tre tallerkener. Hvor mange epler kommer på hver tallerken?'},
   {html:sc(S.pop(mgp(3, 4, '🍎'), .2), S.row(S.pop(G.eq('12 ÷ 3 = 4', '#16a34a'), 1.4)), S.sub('Tolv delt på tre er fire', 2.2)),
    no:'Vi legger ett eple om gangen på hver tallerken, til alle er delt ut. Til slutt er det fire epler på hver tallerken. Tolv delt på tre er fire. Vi skriver tolv, delt på tre, er lik fire.'},
   {html:sc(S.pop(G.objs('🍎', 12, {per:6, s:'1.6rem'}), .2), S.sub('12 epler pakkes i poser med 4 i hver. Hvor mange poser?', 1.2), S.pop(mgp(3, 4, '🍎'), 2.2), S.row(S.pop(G.eq('12 ÷ 4 = 3', '#16a34a'), 3))),
    no:'Vi kan også dele på en annen måte. Tolv epler skal pakkes i poser, med fire epler i hver pose. Hvor mange poser trenger vi? Det blir tre poser. Tolv delt på fire er tre.'},
   {html:sc(S.row(S.pop(G.eq('3 × 4 = 12', '#2563eb'), .2)), S.row(S.pop(G.eq('12 ÷ 3 = 4', '#16a34a'), 1.2), S.pop(G.eq('12 ÷ 4 = 3', '#16a34a'), 2)), S.sub('Gange og deling hører sammen', 2.8)),
    no:'Gange og deling hører sammen. Tre ganger fire er tolv. Derfor er tolv delt på tre fire, og tolv delt på fire er tre. Det er en regnefamilie, akkurat som med pluss og minus.'},
   {html:sc(S.row(S.pop(G.eq('12 ÷ 3 = ? → 3 × ? = 12', '#f97316'), .2)), S.sub('Tenk gange når du deler!', 1.4)),
    no:'Du kan bruke gange for å dele. Hva er tolv delt på tre? Tenk: tre ganger hva er tolv? Tre ganger fire er tolv. Så svaret er fire.'},
   {html:sc(S.pop(G.objs('🍎', 10, {per:5, s:'1.6rem'}), .2), S.sub('10 epler til 3 barn: det går ikke opp – noen blir til overs', 1.4)),
    no:'Noen ganger går det ikke opp. Ti epler skal deles mellom tre barn. Hvert barn får tre, og ett eple blir til overs. Da sier vi at det er en rest. I dag øver vi på stykker som går opp.'},
   {html:sc(S.big('÷ = dele likt', .2), S.sub('Nå øver vi!', 1.2)),
    no:'Husk: divisjon er å dele likt, eller å finne hvor mange grupper vi får. Det hører sammen med gange. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal forstå <b>divisjon</b> som å dele likt og som å finne antall grupper, og se sammenhengen med gange.',
   steg:['<b>Dele likt:</b> 12 ÷ 3: 12 epler på 3 tallerkener → 4 på hver.', '<b>Hvor mange grupper:</b> 12 ÷ 4: poser med 4 i hver → 3 poser.', '<b>Regnefamilie:</b> 3 × 4 = 12 ⇒ 12 ÷ 3 = 4 og 12 ÷ 4 = 3.', '<b>Tenk gange:</b> 12 ÷ 3 = ? → 3 × ? = 12.', 'Noen ganger går det ikke opp (rest).'],
   eks:[mgp(3, 4, '🍎') + '<br>12 ÷ 3 = 4 · 12 ÷ 4 = 3', '15 ÷ 5 = 3, fordi 3 × 5 = 15'],
   ord:[['divisjon', 'å dele likt eller finne hvor mange grupper'], ['÷', 'delt på'], ['rest', 'det som blir til overs når det ikke går opp']],
   feil:['«12 ÷ 3 = 9» – du regnet minus. Tenk: 3 × ? = 12.', '«12 ÷ 3 og 3 ÷ 12 er det samme» – i divisjon kan vi ikke bytte rekkefølge.'],
   laerer:'KM13246 (divisjon): to betydninger – deling (fordele likt på et gitt antall) og gruppering (hvor mange grupper av en gitt størrelse). Kobling til gange via regnefamilier. Hold deg til divisjon uten rest i første omgang.'
  },
  refleksjon:'Du har 20 kuler. Vis to ulike måter å dele dem likt på.',
  nivaaer:[
   {t:'Forstå: dele likt', d:'Sjekk at du har forstått divisjon.', kind:'forstaa', make:(r, i) => {
     const g = int(r, 2, 5), n = int(r, 2, 6), k = i % 6;
     if(k === 0) return Q.choice(r, `Hva betyr <b>${g * n} ÷ ${g}</b>?`, `Dele ${g * n} likt på ${g}`, [`${g * n} + ${g}`, `${g * n} gange ${g}`, `${g * n} − ${g}`], {say:`Hva betyr ${g * n} delt på ${g}?`, expl:`${g * n} ÷ ${g} betyr å dele ${g * n} likt på ${g}: ${n} på hver.`});
     if(k === 1) return Q.choice(r, 'Hvilken regneart er det motsatte av gange?', 'Divisjon (dele)', ['Pluss', 'Minus', 'Ingen'], {expl:'Gange og divisjon hører sammen, som pluss og minus.'});
     if(k === 2) return Q.yn(`Er ${g * n} ÷ ${g} = ${n} fordi ${g} × ${n} = ${g * n}?`, true, {say:`${g * n} delt på ${g} er ${n}, fordi ${g} ganger ${n} er ${g * n}. Stemmer det?`, expl:'Ja. Gange og divisjon er en regnefamilie.'});
     if(k === 3) return Q.yn(`Er ${g * n} ÷ ${g} det samme som ${g} ÷ ${g * n}?`, false, {expl:'Nei. I divisjon kan vi ikke bytte rekkefølge.'});
     if(k === 4) return Q.choice(r, 'Hva gjør du når du deler likt?', 'Alle får like mange', ['Noen får mest', 'Du legger sammen', 'Du bytter tall'], {expl:'Å dele likt betyr at alle får like mange.'});
     return Q.yn('Går alle delestykker opp (uten rest)?', false, {expl:'Nei. 10 ÷ 3 går ikke opp: 3 på hver og 1 til overs.'});
   }},
   {t:'Dele likt på tallerkener', d:'Hvor mange på hver?', n:10, make:(r, i) => { const g = int(r, 2, 5), n = int(r, 2, 6), t = pick(r, MT.THINGS); return Q.num(`${share(g * n, g, t[0])}<br>${g * n} ${t[1]} deles likt på ${g} tallerkener. Hvor mange ${t[1]} på hver? {?}`, n, {say:`${g * n} ${t[1]} deles likt på ${g} tallerkener. Hvor mange på hver?`, calc:`${g * n}/${g}`, expl:`${g * n} ÷ ${g} = ${n}, for ${g} × ${n} = ${g * n}.`, hint:mgp(g, n, t[0])}); }},
   {t:'Hvor mange grupper?', d:'Pakk i grupper på like mange.', n:10, make:(r, i) => { const g = int(r, 2, 6), n = int(r, 2, 5), t = pick(r, MT.THINGS), h = pick(r, HOLD); return Q.num(`${share(g * n, g, t[0])}<br>${g * n} ${t[1]} pakkes i ${h[1]} med ${n} i hver. Hvor mange ${h[1]} trengs? {?}`, g, {say:`${g * n} ${t[1]} pakkes i ${h[1]} med ${n} i hver. Hvor mange ${h[1]} trengs?`, calc:`${g * n}/${n}`, expl:`${g * n} ÷ ${n} = ${g}, for ${g} × ${n} = ${g * n}.`, hint:mgp(g, n, t[0])}); }},
   {t:'Regnefamilien gange og deling', d:'Bruk gange til å dele.', n:10, make:(r, i) => {
     const g = int(r, 2, 5), n = int(r, 2, 10), k = i % 3;
     if(k === 0) return Q.num(`${g} × ${n} = ${g * n}. Hva er ${g * n} ÷ ${g}? {?}`, n, {say:`${g} ganger ${n} er ${g * n}. Hva er ${g * n} delt på ${g}?`, calc:`${g * n}/${g}`, expl:`${g * n} ÷ ${g} = ${n}.`});
     if(k === 1) return Q.num(`${g} × ${n} = ${g * n}. Hva er ${g * n} ÷ ${n}? {?}`, g, {say:`${g} ganger ${n} er ${g * n}. Hva er ${g * n} delt på ${n}?`, calc:`${g * n}/${n}`, expl:`${g * n} ÷ ${n} = ${g}.`});
     return Q.num(`${g * n} ÷ ${g} = {?}  (tenk: ${g} × ? = ${g * n})`, n, {say:`${g * n} delt på ${g}. Tenk: ${g} ganger hva er ${g * n}?`, calc:`${g * n}/${g}`, expl:`${g} × ${n} = ${g * n}, så ${g * n} ÷ ${g} = ${n}.`});
   }},
   {t:'Divisjon uten bilde', d:'Regn delestykker fra 2-, 3-, 4-, 5- og 10-gangen.', n:10, make:(r, i) => { const d = pick(r, [2, 3, 4, 5, 10, 5, 10]), q = int(r, 2, 10); return Q.num(`${d * q} ÷ ${d} = {?}`, q, {say:`${d * q} delt på ${d}`, calc:`${d * q}/${d}`, expl:`${d} × ${q} = ${d * q}, så ${d * q} ÷ ${d} = ${q}.`, hint:`${d} × ? = ${d * q}`}); }},
   {t:'Del og regn: blandet', d:'Gange og deling om hverandre.', n:12, make:(r, i) => {
     const d = pick(r, [2, 3, 4, 5, 10]), q = int(r, 2, 10), k = i % 3;
     if(k === 0) return Q.num(`${d * q} ÷ ${d} = {?}`, q, {say:`${d * q} delt på ${d}`, calc:`${d * q}/${d}`, expl:`${d} × ${q} = ${d * q}.`});
     if(k === 1) return Q.num(`${d} × ${q} = {?}`, d * q, {say:`${d} ganger ${q}`, calc:`${d}*${q}`, expl:`${d} × ${q} = ${d * q}.`});
     return Q.num(`${d * q} ÷ {?} = ${q}`, d, {chk:`${d * q}/_===${q}`, say:`${d * q} delt på hva er ${q}?`, expl:`${d} × ${q} = ${d * q}.`});
   }}
  ],
  drill:{tittel:'Dele likt: delestykker', layout:'row', cols:4, n:[56, 30], make:(r, i, hard) => {
    const d = pick(r, hard ? [2, 3, 4, 5, 10] : [2, 5, 10]), q = int(r, 2, 10), k = hard ? int(r, 0, 2) : 0;
    if(k === 1) return {t:`${d * q} ÷ ☐ = ${q}`, ans:d}; if(k === 2) return {t:`☐ ÷ ${d} = ${q}`, ans:d * q};
    return {t:`${d * q} ÷ ${d} =`, ans:q}; }}
});

/* ======================================================================
   Gange og deling i fortellinger (KM13246)
   ====================================================================== */
const story = {
  mult(r){ const g = pick(r, [2, 3, 4, 5]), n = int(r, 2, 10), t = pick(r, MT.THINGS), h = pick(r, HOLD), nm = pick(r, MT.NAMES), v = int(r, 0, 2);
    const txt = [`${nm} har ${g} ${h[1]} med ${n} ${t[1]} i hver. Hvor mange ${t[1]} er det til sammen?`, `${g} barn får ${n} ${t[1]} hver. Hvor mange ${t[1]} trengs til sammen?`, `Det er ${g} rader med ${n} stoler i en sal. Hvor mange stoler er det?`][v];
    return {text:txt, eq:`${g} × ${n}`, ans:g * n, calc:`${g}*${n}`}; },
  share(r){ const g = pick(r, [2, 3, 4, 5]), n = int(r, 2, 10), t = pick(r, MT.THINGS), nm = pick(r, MT.NAMES); return {text:`${nm} deler ${g * n} ${t[1]} likt mellom ${g} venner. Hvor mange ${t[1]} får hver?`, eq:`${g * n} ÷ ${g}`, ans:n, calc:`${g * n}/${g}`}; },
  group(r){ const g = pick(r, [2, 3, 4, 5]), n = pick(r, [2, 3, 4, 5, 10]), t = pick(r, MT.THINGS), h = pick(r, HOLD); return {text:`${g * n} ${t[1]} pakkes i ${h[1]} med ${n} i hver. Hvor mange ${h[1]} trengs?`, eq:`${g * n} ÷ ${n}`, ans:g, calc:`${g * n}/${n}`}; },
  two(r){ const g = pick(r, [2, 3, 4, 5]), n = int(r, 2, 6), x = int(r, 1, 6), t = pick(r, MT.THINGS), h = pick(r, HOLD), nm = pick(r, MT.NAMES); return {text:`${g} ${h[1]} har ${n} ${t[1]} i hver. ${nm} har også ${x} løse ${t[1]}. Hvor mange ${t[1]} er det til sammen?`, eq:`${g} × ${n} + ${x}`, ans:g * n + x, calc:`${g}*${n}+${x}`}; }
};
MT.module({
  id:'gange-historier', rek:118, trinn:[3], maal:['KM13246'], tittel:'Gange og deling i fortellinger', ikon:'📚', bygger:['gange-grupper', 'dele-likt', 'regnefortellinger'],
  video:[
   {html:title('📚', 'Gange og deling i fortellinger', S.sub('Fra historie til regnestykke', 1.2)),
    no:'Vi bruker gange og deling i lek og hverdag. Nå skal vi løse regnefortellinger med gange og deling.'},
   {html:sc(S.pop(mgp(4, 3, '🍎'), .2), S.sub('Mia har 4 poser med 3 epler i hver. Hvor mange epler er det?', 1.2), S.big('4 × 3 = 12', 2.4)),
    no:'Mia har fire poser med tre epler i hver. Hvor mange epler har hun? Det er like store grupper, så vi ganger. Fire ganger tre er tolv.'},
   {html:sc(S.pop(G.objs('🍪', 15, {per:5, s:'1.6rem'}), .2), S.sub('Ola deler 15 kjeks likt mellom 5 venner. Hvor mange får hver?', 1.2), S.big('15 ÷ 5 = 3', 2.4)),
    no:'Ola har femten kjeks. Han skal dele dem likt mellom fem venner. Da deler vi. Femten delt på fem er tre. Hver venn får tre kjeks.'},
   {html:sc(S.pop(G.objs('⚽', 20, {per:10, s:'1.4rem'}), .2), S.sub('20 baller skal i nett med 4 i hvert. Hvor mange nett?', 1.2), S.big('20 ÷ 4 = 5', 2.4)),
    no:'Tjue baller skal pakkes i nett, med fire baller i hvert nett. Hvor mange nett trenger vi? Vi deler tjue på fire. Det er fem nett.'},
   {html:sc(S.row(S.pop(G.eq('Like store grupper → gange', '#2563eb'), .2)), S.row(S.pop(G.eq('Dele likt eller pakke i grupper → deling', '#16a34a'), 1.2)), S.sub('Spør: er det like store grupper? Skal noe deles?', 2.4)),
    no:'Hvordan vet vi hva vi skal gjøre? Hvis vi har like store grupper og vil vite hvor mange til sammen, ganger vi. Hvis vi skal dele likt, eller vi vil vite hvor mange grupper vi får, deler vi.'},
   {html:sc(S.pop(mgp(3, 4, '🍎') + ' ' + G.objs('🍎', 2, {s:'1.5rem'}), .2), S.sub('3 poser med 4 epler, og 2 løse epler. Hvor mange epler?', 1.2), S.big('3 × 4 + 2 = 14', 2.4)),
    no:'Noen oppgaver har flere steg. Tre poser med fire epler og to løse epler. Først regner vi tre ganger fire, det er tolv. Så legger vi til de to løse. Det blir fjorten.'},
   {html:sc(S.row(S.pop(G.eq('4 × 5', '#2563eb'), .2), S.pop('<span style="font-size:2rem;font-weight:900">→</span>', .8), S.pop(G.eq('Det er 4 grupper med 5 …', '#f97316'), 1.4)), S.sub('Lag din egen fortelling til et regnestykke', 2.4)),
    no:'Du kan også lage egne fortellinger. Hva passer til fire ganger fem? For eksempel: fire barn får fem kort hver. Prøv å lage en fortelling til tolv delt på tre.'},
   {html:sc(S.big('Tegn · velg regneart · regn · svar med ord', .2), S.sub('Nå øver vi!', 1.4)),
    no:'Husk fire steg: tegn eller tenk, velg regneart, regn, og svar med ord. Nå skal du øve på fortellinger med gange og deling!'}
  ],
  tekst:{
   mal:'Du skal bruke <b>multiplikasjon og divisjon</b> til å lage og løse problemer fra lek og hverdag.',
   steg:['<b>Les</b> og tegn: er det like store grupper?', '<b>Gange</b> når du vet antall grupper og hvor mange i hver, og vil vite hvor mange til sammen.', '<b>Dele</b> når noe skal deles likt, eller du vil vite hvor mange grupper du får.', 'Flere steg? Regn ett om gangen: 3 × 4 + 2.', '<b>Svar med ord.</b> Lag også egne fortellinger.'],
   eks:['«4 poser med 3 epler» → 4 × 3 = 12', '«15 kjeks deles på 5 venner» → 15 ÷ 5 = 3', '«20 baller, 4 i hvert nett» → 20 ÷ 4 = 5'],
   ord:[['regnefortelling', 'en historie med en regneoppgave'], ['to steg', 'en oppgave der du må regne to ganger'], ['svar med ord', 'en hel setning som svarer på spørsmålet']],
   feil:['«Det står hver, så jeg ganger alltid» – tenk på hva som skjer i historien.', '«15 deles på 5, så 5 ÷ 15» – det som deles, står først: 15 ÷ 5.'],
   laerer:'KM13246: bruke multiplikasjon og divisjon til å lage og løse problemer fra lek og hverdag. Skill mellom deling og gruppering, og la elevene lage egne historier til regnestykker. To-stegsoppgaver kobler til KM13243.'
  },
  refleksjon:'Lag en regnefortelling til 12 ÷ 3. Tegn en skisse.',
  nivaaer:[
   {t:'Forstå: gange eller dele?', d:'Hva skal du regne?', kind:'forstaa', make:(r, i) => {
     const k = i % 6, g = pick(r, [2, 3, 4, 5]), n = int(r, 2, 6), nm = pick(r, MT.NAMES), t = pick(r, MT.THINGS), h = pick(r, HOLD);
     if(k === 0) return Q.choice(r, `${g} ${h[1]} med ${n} ${t[1]} i hver. Hvor mange ${t[1]} til sammen? Hva gjør du?`, 'Ganger', ['Deler'], {keep:true, say:`${g} ${h[1]} med ${n} ${t[1]} i hver. Hvor mange ${t[1]} til sammen? Hva gjør du?`, expl:'Like store grupper og vi vil vite hvor mange til sammen: gange.'});
     if(k === 1) return Q.choice(r, `${nm} skal dele ${g * n} ${t[1]} likt mellom ${g} venner. Hva gjør du?`, 'Deler', ['Ganger'], {keep:true, say:`${nm} skal dele ${g * n} ${t[1]} likt mellom ${g} venner. Hva gjør du?`, expl:'Noe skal deles likt: divisjon.'});
     if(k === 2) return Q.choice(r, `${g * n} ${t[1]} pakkes i ${h[1]} med ${n} i hver. Hvor mange ${h[1]} trengs? Hva gjør du?`, 'Deler', ['Ganger'], {keep:true, say:`${g * n} ${t[1]} pakkes i ${h[1]} med ${n} i hver. Hvor mange ${h[1]} trengs? Hva gjør du?`, expl:'Vi vil finne hvor mange grupper: divisjon.'});
     if(k === 3) return Q.choice(r, 'Hva er det lurt å gjøre først?', 'Tegne eller tenke på hva som skjer', ['Gange tallene', 'Dele tallene', 'Plusse tallene'], {expl:'Forstå historien først, så velg regneart.'});
     if(k === 4) return Q.choice(r, 'Hva gjør du når oppgaven har to steg?', 'Regner ett steg om gangen', ['Regner alt på én gang', 'Hopper over det siste', 'Gjetter'], {expl:'Først gange, så pluss: 3 × 4 + 2.'});
     return Q.yn('Skal du svare med en hel setning?', true, {expl:'Ja. «Mia har 12 epler.»'});
   }},
   {t:'Gange-historier', d:'Like store grupper: hvor mange til sammen?', n:10, make:(r, i) => { const s = story.mult(r); return Q.num(`${s.text} {?}`, s.ans, {say:s.text, calc:s.calc, expl:`Regnestykket er ${s.eq} = ${s.ans}.`, hint:`Like store grupper: ${s.eq}.`}); }},
   {t:'Dele-historier', d:'Dele likt og pakke i grupper.', n:10, make:(r, i) => { const s = i % 2 ? story.share(r) : story.group(r); return Q.num(`${s.text} {?}`, s.ans, {say:s.text, calc:s.calc, expl:`Regnestykket er ${s.eq} = ${s.ans}.`, hint:`Tenk gange: hva ganger du med for å få svaret?`}); }},
   {t:'Velg regnestykket', d:'Hvilket regnestykke passer til historien?', n:10, make:(r, i) => {
     const kinds = ['mult', 'share', 'group', 'two', 'mult'], s = story[kinds[i % 5]](r), parts = s.eq.split(/ [×÷+] /).map(Number); const [x, y] = parts, op = s.eq.includes('÷') ? '÷' : s.eq.includes('+') ? '+' : '×';
     const wrong = uniq(op === '÷' ? [`${y} ÷ ${x}`, `${x} × ${y}`, `${x} − ${y}`] : op === '×' ? [`${x} + ${y}`, `${x * y} ÷ ${x}`, `${x} − ${y}`] : [`${x} × ${y} − ${parts[2]}`, `${x} + ${y} + ${parts[2]}`, `${x} × ${y} × ${parts[2]}`]).filter(w => w !== s.eq);
     return Q.choice(r, `${s.text}<br>Hvilket regnestykke passer?`, s.eq, wrong.slice(0, 3), {say:s.text + ' Hvilket regnestykke passer?', expl:`Regnestykket er ${s.eq}. Svaret er ${s.ans}.`});
   }},
   {t:'To-stegs-historier', d:'Regn ett steg om gangen.', n:10, make:(r, i) => { const s = i % 2 ? story.two(r) : story.mult(r); return Q.num(`${s.text} {?}`, s.ans, {say:s.text, calc:s.calc, expl:`Regnestykket er ${s.eq} = ${s.ans}.`, hint:`Først ${s.eq.split(' + ')[0]}, så legg til resten.`}); }},
   {t:'Lag fortellingen', d:'Hvilken historie passer til regnestykket?', n:10, make:(r, i) => {
     const g = pick(r, [2, 3, 4, 5]), n = int(r, 2, 6), t = pick(r, MT.THINGS), h = pick(r, HOLD), nm = pick(r, MT.NAMES), div = i % 2 === 1, eq = div ? `${g * n} ÷ ${g}` : `${g} × ${n}`;
     const good = div ? `${nm} deler ${g * n} ${t[1]} likt mellom ${g} venner.` : `${nm} har ${g} ${h[1]} med ${n} ${t[1]} i hver.`;
     const bad = div ? [`${nm} har ${g * n} ${t[1]} og får ${n} til.`, `${nm} har ${g * n} ${t[1]} og får ${g} til.`, `${nm} har ${g * n} ${t[1]} og mister ${g}.`] : [`${nm} deler ${g * n} ${t[1]} likt mellom ${g} venner.`, `${nm} har ${g} ${t[1]} og får ${n} til.`, `${nm} har ${g} ${t[1]} og mister ${n}.`];
     return Q.choice(r, `Hvilken historie passer til <b>${eq}</b>?`, good, bad, {say:`Hvilken historie passer til ${eq.replace('×', 'ganger').replace('÷', 'delt på')}?`, expl:`${eq} passer til: «${good}»`});
   }}
  ]
});
})();
