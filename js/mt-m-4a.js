(function(){
'use strict';
/* Moduler 4. trinn: divisjon – måling og deling, representasjoner og strategier (KM13255, KM13256, KM13257) */
const A = window.App, MT = window.MT, G = MT.G, Q = MT.Q, S = MT.S, B = MT.B;
const {int, pick, shuf} = MT, {sc, pop, fade, big, sub, row, chip, title} = S;
const uniq = a => a.filter((x, i) => a.indexOf(x) === i);
const range = (a, b) => Array.from({length:b - a + 1}, (_, i) => a + i);
const mgp = (g, n, e) => G.groups(Array.from({length:g}, () => [e, n, Math.min(n, 5)]), {s:'1.5rem'});
const HOLD = [['pose', 'poser'], ['eske', 'esker'], ['kurv', 'kurver'], ['boks', 'bokser'], ['bil', 'biler']];
const PEOPLE = ['barn', 'venner', 'elever', 'lag'];

/* ======================================================================
   Måling og deling (KM13255)
   ====================================================================== */
const dstory = {
  del(r, hard){ const g = hard ? int(r, 2, 10) : pick(r, [2, 3, 4, 5, 10]), q = int(r, 2, hard ? 12 : 10), t = pick(r, MT.THINGS), nm = pick(r, MT.NAMES), pl = pick(r, PEOPLE); return {text:`${nm} deler ${g * q} ${t[1]} likt mellom ${g} ${pl}. Hvor mange ${t[1]} får hver?`, eq:`${g * q} ÷ ${g}`, ans:q, calc:`${g * q}/${g}`, kind:'del'}; },
  maal(r, hard){ const n = hard ? int(r, 2, 10) : pick(r, [2, 3, 4, 5, 10]), g = int(r, 2, hard ? 12 : 10), t = pick(r, MT.THINGS), h = pick(r, HOLD.slice(0, 4)); return {text:`${g * n} ${t[1]} pakkes i ${h[1]} med ${n} i hver. Hvor mange ${h[1]} trengs?`, eq:`${g * n} ÷ ${n}`, ans:g, calc:`${g * n}/${n}`, kind:'maal'}; },
  tid(r){ const d = pick(r, [10, 15, 20, 30, 5]); return {text:`En film varer 60 minutter. Hver episode er ${d} minutter. Hvor mange episoder går det på en time?`, eq:`60 ÷ ${d}`, ans:60 / d, calc:`60/${d}`, kind:'maal'}; },
  penger(r){ const p = pick(r, [5, 10, 20, 25]), n = int(r, 2, 8), nm = pick(r, MT.NAMES); return {text:`${nm} har ${p * n} kroner. En bok koster ${p} kroner. Hvor mange bøker kan ${nm} kjøpe?`, eq:`${p * n} ÷ ${p}`, ans:n, calc:`${p * n}/${p}`, kind:'maal'}; },
  lengde(r){ const d = pick(r, [2, 3, 4, 5]), n = int(r, 3, 10); return {text:`En snor på ${d * n} meter kuttes i biter på ${d} meter. Hvor mange biter blir det?`, eq:`${d * n} ÷ ${d}`, ans:n, calc:`${d * n}/${d}`, kind:'maal'}; },
  del2(r){ const g = pick(r, [2, 4, 5, 10]), q = int(r, 3, 12), nm = pick(r, MT.NAMES); return {text:`${nm} har ${g * q} kroner og deler dem likt på ${g} spareposer. Hvor mye blir det i hver pose?`, eq:`${g * q} ÷ ${g}`, ans:q, calc:`${g * q}/${g}`, kind:'del'}; }
};
MT.module({
  id:'deling-typer', rek:140, trinn:[4], maal:['KM13255'], tittel:'Delingsdivisjon og målingsdivisjon', ikon:'➗', bygger:['dele-likt', 'gange-historier'],
  video:[
   {html:title('➗', 'To måter å dele på', S.sub('Delingsdivisjon og målingsdivisjon', 1.2)),
    no:'Divisjon kan bety to ulike ting. I dag skal vi se på begge og lære å kjenne forskjell på dem i praktiske situasjoner.'},
   {html:sc(S.pop(G.objs('🍎', 12, {per:6, s:'1.6rem'}), .2), S.sub('12 epler deles likt mellom 3 barn. Hvor mange får hver?', 1.2), S.pop(mgp(3, 4, '🍎'), 2.2), S.row(S.pop(G.eq('12 ÷ 3 = 4', '#16a34a'), 3.2))),
    no:'Først delingsdivisjon. Tolv epler deles likt mellom tre barn. Vi vet hvor mange barn det er, og vi finner hvor mange hvert barn får. Hvert barn får fire epler.'},
   {html:sc(S.pop(G.objs('🍎', 12, {per:6, s:'1.6rem'}), .2), S.sub('12 epler pakkes i poser med 3 i hver. Hvor mange poser?', 1.2), S.pop(mgp(4, 3, '🍎'), 2.2), S.row(S.pop(G.eq('12 ÷ 3 = 4', '#f97316'), 3.2))),
    no:'Så målingsdivisjon. Tolv epler pakkes i poser, med tre epler i hver pose. Vi vet hvor mange det er i hver pose, og vi finner hvor mange poser vi får. Det blir fire poser.'},
   {html:sc(S.row(S.pop(G.eq('delingsdivisjon: kjenner antall deler → finner hvor mange i hver', '#16a34a'), .2)), S.row(S.pop(G.eq('målingsdivisjon: kjenner størrelsen på delene → finner hvor mange deler', '#f97316'), 1.4)), S.sub('Samme regnestykke – to ulike historier', 2.6)),
    no:'Begge historiene har regnestykket tolv delt på tre er fire. Men historiene er ulike. I delingsdivisjon finner vi hvor mange hver får. I målingsdivisjon måler vi hvor mange ganger tre går opp i tolv.'},
   {html:sc(S.row(S.pop('<span style="font-size:3rem">🎬</span>', .2), S.pop(G.eq('60 ÷ 15 = 4', '#f97316'), 1)), S.sub('60 minutter, 15 minutter hver episode: 4 episoder – måling', 2)),
    no:'Tid og penger bruker ofte målingsdivisjon. En film varer seksti minutter og hver episode er femten minutter. Hvor mange episoder? Seksti delt på femten er fire. Vi måler seksti med femten.'},
   {html:sc(S.row(S.pop(G.eq('50 kr ÷ 10 kr = 5 bøker', '#f97316'), .2), S.pop(G.eq('50 kr ÷ 5 barn = 10 kr hver', '#16a34a'), 1.2)), S.sub('Penger: både måling og deling', 2)),
    no:'Med femti kroner og bøker til ti kroner kan vi kjøpe fem bøker: det er måling. Deler vi femti kroner likt på fem barn, får hvert barn ti kroner: det er deling.'},
   {html:sc(S.pop(G.objs('🧑', 25, {per:10, s:'1.1rem'}), .2), S.row(S.pop(G.eq('25 ÷ 4 = 6 rest 1', '#2563eb'), 1.2)), S.sub('25 personer, 4 i hver bil: 6 biler er ikke nok – 7 biler!', 2.2)),
    no:'Noen ganger går det ikke opp. Tjuefem personer skal i biler med plass til fire. Tjuefem delt på fire er seks, rest en. Seks biler er ikke nok, for én person blir igjen. Vi trenger sju biler.'},
   {html:sc(S.big('Hva kjenner du? Hva leter du etter?', .2), S.sub('Nå øver vi!', 1.4)),
    no:'Spør deg selv: hva vet jeg, og hva leter jeg etter? Så vet du om det er deling eller måling. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal utforske og bruke <b>målings- og delingsdivisjon</b> i praktiske situasjoner.',
   steg:['<b>Delingsdivisjon:</b> du vet <b>hvor mange deler</b>, og finner hvor mange i hver. (12 epler på 3 barn: 4 hver.)', '<b>Målingsdivisjon:</b> du vet <b>hvor stor hver del er</b>, og finner hvor mange deler. (12 epler i poser på 3: 4 poser.)', 'Begge skrives <b>12 ÷ 3 = 4</b>, men historiene er ulike.', 'Går det ikke opp, får du en <b>rest</b>: 25 ÷ 4 = 6 rest 1. Tenk gjennom hva rest betyr i situasjonen.', 'Tid, penger og lengde er ofte målingsdivisjon.'],
   eks:['12 ÷ 3 = 4 (deling: 4 hver) · 12 ÷ 3 = 4 (måling: 4 poser)', '60 min ÷ 15 min = 4 episoder', '25 ÷ 4 = 6 rest 1 → 7 biler'],
   ord:[['delingsdivisjon', 'dele likt på et gitt antall'], ['målingsdivisjon', 'finne hvor mange ganger et tall går opp i et annet'], ['rest', 'det som blir til overs']],
   feil:['«Alle delestykker går opp» – noen har rest.', '«25 ÷ 4 = 6, så seks biler» – én person blir til overs, så vi trenger sju biler.'],
   laerer:'KM13255: utforske og bruke målings- og delingsdivisjon i praktiske situasjoner. Dette bygger videre på «dele likt» fra 3. trinn, med større tall, ulike kontekster og rest. Be elevene alltid begrunne: «Hva vet jeg? Hva leter jeg etter?»'
  },
  refleksjon:'Lag en historie til 24 ÷ 6 som er delingsdivisjon, og en som er målingsdivisjon.',
  nivaaer:[
   {t:'Forstå: deling eller måling?', d:'Sjekk at du har forstått.', kind:'forstaa', make:(r, i) => {
     const k = i % 6, g = int(r, 2, 6), q = int(r, 3, 9);
     if(k === 0) return Q.choice(r, `${g * q} kuler deles likt mellom ${g} barn. Hva slags divisjon er det?`, 'Delingsdivisjon', ['Målingsdivisjon'], {keep:true, say:`${g * q} kuler deles likt mellom ${g} barn. Hva slags divisjon er det?`, expl:'Vi vet antall deler (barn) og finner hvor mange hver får.'});
     if(k === 1) return Q.choice(r, `${g * q} kuler pakkes i poser med ${q} i hver. Hva slags divisjon er det?`, 'Målingsdivisjon', ['Delingsdivisjon'], {keep:true, say:`${g * q} kuler pakkes i poser med ${q} i hver. Hva slags divisjon er det?`, expl:'Vi vet størrelsen på hver pose og finner hvor mange poser.'});
     if(k === 2) return Q.yn(`Kan ${g * q} ÷ ${g} brukes både til deling og måling?`, true, {expl:'Ja. Regnestykket er det samme, men historiene er ulike.'});
     if(k === 3) return Q.choice(r, 'Hva sier du til deg selv for å finne ut hvilken divisjon det er?', 'Hva vet jeg, og hva leter jeg etter?', ['Hvilket tall er størst?', 'Hvor mange ord er det?', 'Hvem har flest?'], {expl:'Vet du antall deler eller størrelsen på delene?'});
     if(k === 4) return Q.yn('Går alle delestykker opp (uten rest)?', false, {expl:'Nei. 25 ÷ 4 = 6 rest 1.'});
     return Q.yn('Er «hvor mange episoder på 15 minutter går det på 60 minutter» målingsdivisjon?', true, {expl:'Ja. Vi måler 60 minutter med 15 minutter.'});
   }},
   {t:'Delingsdivisjon', d:'Hvor mange får hver?', n:10, make:(r, i) => { const s = i % 3 === 2 ? dstory.del2(r) : dstory.del(r, i > 4); return Q.num(`${s.text} {?}`, s.ans, {say:s.text, calc:s.calc, expl:`${s.eq} = ${s.ans}, for ${s.eq.split(' ÷ ')[1]} × ${s.ans} = ${s.eq.split(' ÷ ')[0]}.`, hint:'Tenk gange: hvilket tall ganger du med for å få det som skal deles?'}); }},
   {t:'Målingsdivisjon', d:'Hvor mange grupper (ganger går tallet opp)?', n:10, make:(r, i) => { const s = [dstory.maal, dstory.tid, dstory.penger, dstory.lengde, dstory.maal][i % 5](r, i > 4); return Q.num(`${s.text} {?}`, s.ans, {say:s.text, calc:s.calc, expl:`${s.eq} = ${s.ans}.`, hint:'Hvor mange ganger går tallet opp?'}); }},
   {t:'Hvilken type?', d:'Deling eller måling?', n:10, make:(r, i) => { const s = pick(r, [dstory.del, dstory.maal, dstory.tid, dstory.penger, dstory.lengde, dstory.del2])(r, false); return Q.choice(r, `${s.text}<br>Hva slags divisjon er det?`, s.kind === 'del' ? 'Delingsdivisjon' : 'Målingsdivisjon', ['Delingsdivisjon', 'Målingsdivisjon'], {keep:true, say:s.text + ' Hva slags divisjon er det?', expl:s.kind === 'del' ? 'Vi vet antall deler og finner hvor mange i hver: deling.' : 'Vi vet størrelsen på hver del og finner hvor mange deler: måling.'}); }},
   {t:'Når det ikke går opp', d:'Rest og praktiske valg.', n:10, make:(r, i) => {
     const d = int(r, 3, 8), q = int(r, 2, 9), rest = int(r, 1, d - 1), n = d * q + rest, k = i % 3;
     if(k === 0) return Q.num(`${n} ÷ ${d}: hvor mange hele grupper på ${d} får du? {?}`, q, {say:`${n} delt på ${d}: hvor mange hele grupper på ${d} får du?`, expl:`${d} × ${q} = ${d * q}, og ${n} − ${d * q} = ${rest} blir til overs.`});
     if(k === 1) return Q.num(`${n} ÷ ${d}: hvor mange blir til overs (resten)? {?}`, rest, {say:`${n} delt på ${d}: hvor mange blir til overs?`, expl:`${d} × ${q} = ${d * q}. ${n} − ${d * q} = ${rest}.`});
     return Q.num(`${n} personer skal kjøre bil. Det er plass til ${d} i hver bil. Hvor mange biler trengs? {?}`, q + 1, {say:`${n} personer skal kjøre bil. Det er plass til ${d} i hver bil. Hvor mange biler trengs?`, expl:`${n} ÷ ${d} = ${q} rest ${rest}. De siste ${rest} trenger også en bil: ${q + 1} biler.`});
   }},
   {t:'Praktiske situasjoner', d:'Tid, penger, lengde og deling.', n:12, make:(r, i) => { const s = [dstory.tid, dstory.penger, dstory.lengde, dstory.del2, dstory.del, dstory.maal][i % 6](r, i > 6); return Q.num(`${s.text} {?}`, s.ans, {say:s.text, calc:s.calc, expl:`${s.eq} = ${s.ans}.`}); }}
  ],
  drill:{tittel:'Delestykker (2- til 10-gangen baklengs)', layout:'row', cols:4, n:[56, 30], make:(r, i, hard) => {
    const d = hard ? int(r, 2, 10) : pick(r, [2, 3, 4, 5, 10]), q = int(r, 2, hard ? 12 : 10); return {t:`${d * q} ÷ ${d} =`, ans:q}; }}
});

/* ======================================================================
   Representasjoner av divisjon (KM13256)
   ====================================================================== */
const tabDiv = (n, hide, cols) => G.tbl([['Antall grupper'].concat(range(1, cols || 5)), ['Til sammen'].concat(range(1, cols || 5).map(k => k === hide ? '?' : k * n))]);
MT.module({
  id:'divisjon-representasjoner', rek:142, trinn:[4], maal:['KM13256'], tittel:'Divisjon på mange måter: tegning, tallinje, stang og tabell', ikon:'🔀', bygger:['deling-typer', 'gange-representasjoner'],
  video:[
   {html:title('🔀', 'Divisjon på mange måter', S.sub('Tall, tekst, tegning og konkreter', 1.2)),
    no:'Akkurat som gange kan divisjon vises på mange måter. I dag skal vi se samme divisjonsstykke som ting, tegning, tallinje, stang, tabell, tekst og tall.'},
   {html:sc(S.pop(mgp(4, 6, '🍎'), .2), S.sub('Tegning: 24 epler i 4 like grupper', 1.4), S.row(S.pop(G.eq('24 ÷ 4 = 6', '#16a34a'), 2.4))),
    no:'Tegning: tjuefire epler deles i fire like grupper. Det blir seks i hver gruppe. Tjuefire delt på fire er seks.'},
   {html:sc(S.pop(G.nline(0, 24, {every:6, tick:1, hops:range(0, 3).map(k => ({a:k * 6, b:(k + 1) * 6, label:'+6', c:'#f97316'})), marks:[{v:0, label:'0', c:'#16a34a'}], w:700}), .2), S.sub('Tallinje: hvor mange hopp på 6 til 24? 4', 1.6)),
    no:'Tallinje: vi hopper med seks til vi kommer til tjuefire. Det blir fire hopp. Tjuefire delt på seks er fire. Det er målingsdivisjon.'},
   {html:sc(S.pop(G.partbar(24, 4), .2), S.sub('Stang: 24 delt i 4 like deler – hver del er 6', 1.4)),
    no:'Stang: Hele stangen er tjuefire. Vi deler den i fire like deler. Hver del er seks.'},
   {html:sc(S.pop(tabDiv(6, 0), .2), S.sub('Tabell: 4 grupper gir 24 – så 24 ÷ 6 = 4', 1.6)),
    no:'Tabell: seks i hver gruppe. Med fire grupper har vi tjuefire. Vi kan lese av hvor mange grupper som trengs for å få tjuefire.'},
   {html:sc(S.row(S.pop(G.eq('24 ÷ 4 = 6', '#16a34a'), .2), S.pop(G.eq('6 × 4 = 24', '#2563eb'), 1)), S.sub('Tall: divisjon og gange hører sammen', 2)),
    no:'Tallsymboler: tjuefire delt på fire er seks, og seks ganger fire er tjuefire. Divisjon og gange hører sammen.'},
   {html:sc(S.pop('<div class="mtcard" style="--c:#f97316;padding:10px 16px;font-size:1.3rem">24 kuler deles likt mellom 4 barn. Hvor mange får hver?</div>', .2), S.sub('Tekst: en historie til regnestykket', 1.6)),
    no:'Tekst: tjuefire kuler deles likt mellom fire barn. Hvor mange får hver? En historie forteller hva som skjer. Vi kan gå fra tekst til tegning til tall.'},
   {html:sc(S.big('Samme divisjon – mange måter', .2), S.sub('Nå øver vi!', 1.2)),
    no:'Husk: ting, tegning, tallinje, stang, tabell, tekst og tall viser det samme. Nå skal du øve på å oversette mellom dem!'}
  ],
  tekst:{
   mal:'Du skal bruke <b>tall, tekst, tegning og konkreter</b> til å utforske divisjon på ulike måter og <b>oversette</b> mellom dem.',
   steg:['<b>Tegning:</b> grupper eller rader. 24 i 4 grupper → 6 i hver.', '<b>Tallinje:</b> hopp med like store hopp til tallet: 24 med hopp 6 → 4 hopp.', '<b>Stang:</b> hele stangen er det som skal deles.', '<b>Tabell:</b> les av hvor mange grupper som gir tallet.', '<b>Tall:</b> 24 ÷ 4 = 6 og 6 × 4 = 24.', '<b>Tekst:</b> lag eller les en historie til regnestykket.'],
   eks:[G.partbar(24, 4, {w:260}) + '<br>24 ÷ 4 = 6', tabDiv(6, 0)],
   ord:[['stangmodell', 'en stang som deles i like deler'], ['tallinje', 'rett strek med tall i rekkefølge'], ['representasjon', 'en måte å vise noe på']],
   feil:['«I tabellen er svaret antall grupper ganger antall grupper» – svaret er antall grupper ganger størrelsen på hver gruppe.', '«Stangen deles i deler av ulik størrelse» – i divisjon deles den i like deler.'],
   laerer:'KM13256: bruke tall, tekst, tegning og konkreter til å utforske divisjon på ulike måter og oversette mellom representasjonene. Parallell til gange-representasjoner. Vis alltid minst to representasjoner for samme regnestykke.'
  },
  refleksjon:'Vis 18 ÷ 3 på tre ulike måter. Hva er likt, og hva er ulikt?',
  nivaaer:[
   {t:'Forstå: samme divisjon – mange måter', d:'Sjekk at du har forstått.', kind:'forstaa', make:(r, i) => {
     const d = pick(r, [2, 3, 4, 5, 6]), q = int(r, 3, 9), n = d * q, k = i % 6;
     if(k === 0) return Q.yn(`Kan ${n} ÷ ${d} = ${q} vises som ${q} hopp med ${d} på tallinja?`, true, {expl:`Ja: ${q} hopp med ${d} er ${n}.`});
     if(k === 1) return Q.choice(r, `Hvilken gangesetning hører til ${n} ÷ ${d} = ${q}?`, `${q} × ${d} = ${n}`, [`${q} + ${d} = ${n}`, `${n} × ${d} = ${q}`, `${d} − ${q} = ${n}`], {say:`Hvilken gangesetning hører til ${n} delt på ${d} er ${q}?`, expl:'Divisjon og gange hører sammen.'});
     if(k === 2) return Q.yn('Er det bare én måte å vise divisjon på?', false, {expl:'Nei. Tegning, tallinje, stang, tabell, tekst og tall viser alle divisjon.'});
     if(k === 3) return Q.choice(r, 'I en stangmodell for 24 ÷ 4, hva er hele stangen?', '24', ['4', '6', '28'], {expl:'Hele stangen er det som skal deles: 24.'});
     if(k === 4) return Q.yn('Er «oversette» å vise det samme på en annen måte?', true, {expl:'Ja. For eksempel fra tegning til regnestykke.'});
     return Q.choice(r, `På en tallinje hopper du ${d} om gangen fra 0 til ${n}. Hva sier antall hopp?`, `Svaret på ${n} ÷ ${d}`, [`Svaret på ${n} − ${d}`, `Svaret på ${n} + ${d}`, `Ingenting`], {say:`På en tallinje hopper du ${d} om gangen fra null til ${n}. Hva sier antall hopp?`, expl:`${q} hopp: ${n} ÷ ${d} = ${q}.`});
   }},
   {t:'Fra tegning til divisjon', d:'Hvilket regnestykke passer til tegningen?', n:10, make:(r, i) => {
     const g = int(r, 2, 5), q = int(r, 2, 6), n = g * q, e = pick(r, MT.THINGS)[0];
     return Q.choice(r, `${mgp(g, q, e)}<br>${n} er delt i ${g} like grupper. Hvilket regnestykke passer?`, `${n} ÷ ${g} = ${q}`, uniq([`${n} − ${g} = ${q}`, `${n} × ${g} = ${q}`, `${g} ÷ ${n} = ${q}`, `${n} ÷ ${q} = ${g + 1}`]).filter(x => x !== `${n} ÷ ${g} = ${q}`).slice(0, 3), {say:`${n} er delt i ${g} like grupper. Hvilket regnestykke passer?`, expl:`${n} ÷ ${g} = ${q}.`});
   }},
   {t:'Tallinje: hvor mange hopp?', d:'Hopp til tallet.', n:10, make:(r, i) => {
     const d = pick(r, [2, 3, 4, 5, 6]), q = int(r, 3, 7), n = d * q;
     return Q.num(`${G.nline(0, n, {every:d, tick:1, hops:range(0, q - 1).map(k => ({a:k * d, b:(k + 1) * d, label:'+' + d, c:'#f97316'})), marks:[{v:0, label:'0', c:'#16a34a'}], w:Math.min(700, 80 + n * 26)})}<br>Hoppene er ${d} lange. Hvor mange hopp trengs for å komme til ${n}? {?}`, q, {say:`Hoppene er ${d} lange. Hvor mange hopp trengs for å komme til ${n}?`, calc:`${n}/${d}`, expl:`${n} ÷ ${d} = ${q} hopp.`});
   }},
   {t:'Stangmodell', d:'Del stangen i like deler.', n:10, make:(r, i) => {
     const p = int(r, 2, 6), q = int(r, 2, 9), n = p * q;
     if(i % 2 === 0) return Q.num(`${G.partbar(n, p, {part:'?'})}<br>Stangen er ${n} og deles i ${p} like deler. Hvor stor er hver del? {?}`, q, {say:`Stangen er ${n} og deles i ${p} like deler. Hvor stor er hver del?`, calc:`${n}/${p}`, expl:`${n} ÷ ${p} = ${q}.`});
     return Q.num(`${G.partbar('?', p, {part:q, total:'?'})}<br>Hver del er ${q}, og det er ${p} deler. Hvor stor er hele stangen? {?}`, n, {say:`Hver del er ${q}, og det er ${p} deler. Hvor stor er hele stangen?`, calc:`${p}*${q}`, expl:`${p} × ${q} = ${n}.`});
   }},
   {t:'Fra tekst til regnestykke', d:'Hvilket regnestykke og hvilken tegning passer?', n:10, make:(r, i) => {
     const s = [dstory.del, dstory.maal, dstory.del2, dstory.lengde][i % 4](r, false), n = +s.eq.split(' ÷ ')[0], d = +s.eq.split(' ÷ ')[1];
     return Q.choice(r, `${s.text}<br>Hvilket regnestykke passer?`, s.eq, uniq([`${d} ÷ ${n}`, `${n} − ${d}`, `${n} × ${d}`]).filter(x => x !== s.eq), {say:s.text + ' Hvilket regnestykke passer?', expl:`Regnestykket er ${s.eq} = ${s.ans}.`});
   }},
   {t:'Tabell', d:'Les av tabellen.', n:10, make:(r, i) => {
     const n = int(r, 3, 9), g = int(r, 2, 5);
     if(i % 3 === 0) return Q.num(`${tabDiv(n, 0)}<br>Hvor mange grupper på ${n} trengs for å få ${g * n}? {?}`, g, {say:`Hvor mange grupper på ${n} trengs for å få ${g * n}?`, calc:`${g * n}/${n}`, expl:`I tabellen står ${g * n} under ${g} grupper: ${g * n} ÷ ${n} = ${g}.`});
     if(i % 3 === 1) return Q.num(`${tabDiv(n, g)}<br>Hva står i ruten med spørsmålstegn? {?}`, g * n, {say:'Hva står i ruten med spørsmålstegn?', calc:`${g}*${n}`, expl:`${g} × ${n} = ${g * n}.`});
     return Q.num(`${tabDiv(n, 0)}<br>${g * n} ÷ ${n} = {?}`, g, {say:`${g * n} delt på ${n}`, calc:`${g * n}/${n}`, expl:`Les av hvor mange grupper som gir ${g * n}: ${g}.`});
   }}
  ]
});

/* ======================================================================
   Divisjonsstrategier (KM13257)
   ====================================================================== */
const strategies = ['Tenk gange', 'Halvere (til ÷ 2 og ÷ 4)', 'Dele opp i tiere og enere'];
MT.module({
  id:'divisjon-strategier', rek:144, trinn:[4], maal:['KM13257'], tittel:'Divisjonsstrategier: tenk gange, halver og del opp', ikon:'🧠', bygger:['divisjon-representasjoner', 'gange-dele-opp', 'dobling-halvering'],
  video:[
   {html:title('🧠', 'Divisjonsstrategier', S.sub('Mange måter å dele på', 1.2)),
    no:'Nå skal vi lære flere strategier for divisjon. En god regner velger strategi etter tallene, og kan forklare hvorfor den virker.'},
   {html:sc(S.row(S.pop(G.eq('56 ÷ 7 = ?', '#2563eb'), .2)), S.row(S.pop(G.eq('7 × ? = 56', '#16a34a'), 1.2), S.pop(G.eq('7 × 8 = 56', '#16a34a'), 2)), S.sub('Strategi 1: tenk gange', 3)),
    no:'Strategi én: tenk gange. Femtiseks delt på sju. Vi spør: sju ganger hva er femtiseks? Sju ganger åtte er femtiseks. Så svaret er åtte. Det hjelper å kunne gangetabellen.'},
   {html:sc(S.row(S.pop(G.eq('48 ÷ 4', '#2563eb'), .2)), S.row(S.pop(G.eq('48 ÷ 2 = 24', '#16a34a'), 1.2), S.pop(G.eq('24 ÷ 2 = 12', '#16a34a'), 2.2)), S.sub('Strategi 2: halver to ganger – ÷4 er halvt av halvt', 3.2)),
    no:'Strategi to: halvering. Å dele på fire er det samme som å halvere to ganger. Førtiåtte delt på fire. Halvparten av førtiåtte er tjuefire. Halvparten av tjuefire er tolv. Svaret er tolv.'},
   {html:sc(S.row(S.pop(G.eq('84 ÷ 4', '#2563eb'), .2)), S.row(S.pop(G.eq('80 ÷ 4 = 20', '#16a34a'), 1.2), S.pop(G.eq('4 ÷ 4 = 1', '#f97316'), 2)), S.big('20 + 1 = 21', 2.8), S.sub('Strategi 3: del opp i tiere og enere', 3.6)),
    no:'Strategi tre: del opp. Åttifire er åtti og fire. Åtti delt på fire er tjue. Fire delt på fire er en. Tjue pluss en er tjueen. Vi deler opp tallet vi skal dele, i lette deler.'},
   {html:sc(S.row(S.pop(G.eq('72 ÷ 6', '#2563eb'), .2)), S.row(S.pop(G.eq('60 + 12 = 72', '#f97316'), 1.2)), S.row(S.pop(G.eq('60 ÷ 6 = 10', '#16a34a'), 2.2), S.pop(G.eq('12 ÷ 6 = 2', '#16a34a'), 3)), S.big('10 + 2 = 12', 3.8), S.sub('Velg deler som går opp i tallet du deler på', 4.6)),
    no:'Vi må velge delene smart. Syttito delt på seks. Vi deler syttito i seksti og tolv, fordi begge går opp i seks. Seksti delt på seks er ti. Tolv delt på seks er to. Ti pluss to er tolv.'},
   {html:sc(S.row(S.pop(G.eq('72 = 50 + 22 ✖', '#dc2626'), .2)), S.sub('Dårlig oppdeling: 22 går ikke opp i 6', 1.4)),
    no:'Hvis vi deler syttito i femti og tjueto, blir det vanskelig, fordi femti og tjueto ikke går opp i seks. Velg deler som går opp.'},
   {html:sc(S.row(S.pop(G.eq('Sjekk: 12 × 6 = 72 ✔', '#16a34a'), .2)), S.sub('Sjekk alltid med gange', 1.4)),
    no:'Sjekk alltid svaret med gange. Tolv ganger seks er syttito. Da stemmer det. Divisjon og gange er motsatte regnearter.'},
   {html:sc(S.big('Velg strategi etter tallene', .2), S.sub('Nå øver vi!', 1.2)),
    no:'Se på tallene først. Kjenner du gangetabellen? Tenk gange. Skal du dele på to eller fire? Halver. Er tallet stort? Del opp. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal bruke og <b>forklare ulike divisjonsstrategier</b>.',
   steg:['<b>Tenk gange:</b> 56 ÷ 7 = ? → 7 × ? = 56 → 8.', '<b>Halver:</b> ÷ 2 er halvparten. ÷ 4 er halvparten to ganger: 48 → 24 → 12.', '<b>Del opp:</b> 84 ÷ 4 = (80 ÷ 4) + (4 ÷ 4) = 20 + 1 = 21.', 'Velg <b>deler som går opp</b> i tallet du deler på: 72 ÷ 6 = (60 ÷ 6) + (12 ÷ 6) = 12.', '<b>Sjekk med gange.</b>'],
   eks:['56 ÷ 7 = 8, fordi 7 × 8 = 56', '48 ÷ 4: 48 → 24 → 12', '84 ÷ 4 = 20 + 1 = 21', '72 ÷ 6 = 10 + 2 = 12'],
   ord:[['strategi', 'en måte å regne på'], ['halvere', 'dele på 2'], ['kontroll', 'sjekke med den motsatte regnearten']],
   feil:['«84 ÷ 4 = 20 + 4 = 24» – del også enerne: 4 ÷ 4 = 1.', '«72 ÷ 6 = 50 ÷ 6 + 22 ÷ 6» – velg deler som går opp i 6.'],
   laerer:'KM13257: bruke og forklare ulike divisjonsstrategier. Strategiene bygger på gangetabellen, dobling/halvering og distributiv egenskap. Standardalgoritmen for divisjon kommer senere. La elevene forklare hvorfor oppdelingen virker.'
  },
  refleksjon:'Regn 96 ÷ 4 på to måter og forklar begge.',
  nivaaer:[
   {t:'Forstå: hvorfor virker strategiene?', d:'Sjekk at du har forstått.', kind:'forstaa', make:(r, i) => {
     const d = pick(r, [3, 4, 5, 6]), a = int(r, 2, 6), b = int(r, 1, 5), n = d * (10 * a + b), k = i % 6;
     if(k === 0) return Q.yn(`Er ${n} ÷ ${d} det samme som ${d * 10 * a} ÷ ${d} + ${d * b} ÷ ${d}?`, true, {expl:`Ja: ${n} = ${d * 10 * a} + ${d * b}.`});
     if(k === 1) return Q.yn(`Er ${d * 8} ÷ 4 det samme som å halvere ${d * 8} to ganger?`, true, {expl:'Ja. ÷ 4 er halvparten av halvparten.'});
     if(k === 2) return Q.choice(r, 'Hvordan sjekker du et delestykke?', 'Med gange', ['Med pluss', 'Med minus', 'Det trengs ikke'], {expl:'Hvis 72 ÷ 6 = 12, må 12 × 6 = 72.'});
     if(k === 3) return Q.yn('Kan du dele opp tallet du skal dele i hvilke deler som helst?', false, {expl:'Nei. Del opp i deler som går opp i tallet du deler på.'});
     if(k === 4) return Q.choice(r, '56 ÷ 7: hva er lurt å tenke?', '7 × ? = 56', ['56 + 7', '56 − 7', '7 ÷ 56'], {say:'56 delt på 7: hva er lurt å tenke?', expl:'7 × 8 = 56.'});
     return Q.yn('Kan samme delestykke regnes på flere måter?', true, {expl:'Ja. Velg strategi etter tallene.'});
   }},
   {t:'Tenk gange', d:'Bruk gangetabellen baklengs.', n:10, make:(r, i) => { const d = int(r, 2, 10), q = int(r, 2, 10); return Q.num(`${d * q} ÷ ${d} = {?}`, q, {say:`${d * q} delt på ${d}`, calc:`${d * q}/${d}`, expl:`${d} × ${q} = ${d * q}, så ${d * q} ÷ ${d} = ${q}.`, hint:`${d} × ? = ${d * q}`}); }},
   {t:'Halvere (÷ 2 og ÷ 4)', d:'Halver én eller to ganger.', n:10, make:(r, i) => {
     const q = int(r, 3, 20), four = i % 2 === 0, n = (four ? 4 : 2) * q * (four ? 1 : 1);
     if(four) return Q.num(`${n} ÷ 4: halvparten av ${n} er ${n / 2}. Halvparten av ${n / 2} er {?}`, q, {say:`${n} delt på 4. Halvparten av ${n} er ${n / 2}. Halvparten av ${n / 2} er?`, calc:`${n}/4`, expl:`${n} → ${n / 2} → ${q}.`});
     return Q.num(`${n} ÷ 2 = {?}`, q, {say:`${n} delt på 2`, calc:`${n}/2`, expl:`Halvparten av ${n} er ${q}.`});
   }},
   {t:'Del opp i tiere og enere', d:'Del opp tallet du deler.', n:10, make:(r, i) => {
     const d = pick(r, [2, 3, 4, 5]), a = int(r, 1, 4), b = int(r, 1, 4), n = d * (10 * a + b), ta = d * 10 * a, tb = d * b;
     if(i % 3 === 0) return Q.num(`${n} ÷ ${d}: ${ta} ÷ ${d} = {?}`, 10 * a, {say:`${n} delt på ${d}. ${ta} delt på ${d} er?`, calc:`${ta}/${d}`, expl:`${ta} ÷ ${d} = ${10 * a}.`});
     if(i % 3 === 1) return Q.num(`${n} ÷ ${d}: ${10 * a} + ${b} = {?}`, 10 * a + b, {say:`${n} delt på ${d}. ${10 * a} pluss ${b} er?`, calc:`${10 * a}+${b}`, expl:`${ta} ÷ ${d} = ${10 * a} og ${tb} ÷ ${d} = ${b}. Sum ${10 * a + b}.`});
     return Q.num(`${n} ÷ ${d} = {?}`, 10 * a + b, {say:`${n} delt på ${d}`, calc:`${n}/${d}`, expl:`${n} = ${ta} + ${tb}. ${ta} ÷ ${d} = ${10 * a}, ${tb} ÷ ${d} = ${b}. Svar ${10 * a + b}.`, hint:`Del opp ${n} i ${ta} og ${tb}.`});
   }},
   {t:'Del opp smart', d:'Velg deler som går opp.', n:10, make:(r, i) => {
     const d = pick(r, [3, 4, 6, 7]), q = int(r, 11, 19), n = d * q, good = `${d * 10} + ${n - d * 10}`;
     if(i % 2 === 0){ const bad = uniq(range(3, 34).map(a => [n - a, a]).filter(p => p[0] % d !== 0 || p[1] % d !== 0).map(p => `${p[0]} + ${p[1]}`)); const picks = shuf(r, bad).slice(0, 3); return Q.choice(r, `Du skal regne <b>${n} ÷ ${d}</b>. Hvilken oppdeling av ${n} er smart?`, good, picks, {say:`Du skal regne ${n} delt på ${d}. Hvilken oppdeling av ${n} er smart?`, expl:`${d * 10} ÷ ${d} = 10 og ${n - d * 10} ÷ ${d} = ${q - 10}: begge går opp.`}); }
     return Q.num(`${n} ÷ ${d} = ${d * 10} ÷ ${d} + ${n - d * 10} ÷ ${d} = {?}`, q, {say:`${n} delt på ${d} er ${d * 10} delt på ${d} pluss ${n - d * 10} delt på ${d}. Hva er svaret?`, calc:`${n}/${d}`, expl:`10 + ${q - 10} = ${q}.`});
   }},
   {t:'Velg strategi og sjekk', d:'Velg den lureste strategien.', n:12, make:(r, i) => {
     const k = i % 4;
     if(k === 0){ const d = int(r, 3, 9), q = int(r, 3, 10); return Q.choice(r, `Hvilken strategi passer best for <b>${d * q} ÷ ${d}</b>?`, strategies[0], strategies.slice(1), {say:`Hvilken strategi passer best for ${d * q} delt på ${d}?`, expl:`${d} × ${q} = ${d * q}: tenk gange.`}); }
     if(k === 1){ const q = int(r, 6, 24), d = pick(r, [2, 4]); return Q.choice(r, `Hvilken strategi passer best for <b>${d * q} ÷ ${d}</b>?`, strategies[1], [strategies[0], strategies[2]], {say:`Hvilken strategi passer best for ${d * q} delt på ${d}?`, expl:'Å dele på 2 og 4 kan gjøres ved å halvere.'}); }
     if(k === 2){ const d = pick(r, [3, 4, 5]), a = int(r, 2, 5), b = int(r, 1, 3); return Q.num(`${d * (10 * a + b)} ÷ ${d} = {?}`, 10 * a + b, {say:`${d * (10 * a + b)} delt på ${d}`, calc:`${d * (10 * a + b)}/${d}`, expl:`Del opp: ${d * 10 * a} ÷ ${d} + ${d * b} ÷ ${d} = ${10 * a} + ${b}.`}); }
     const d = int(r, 3, 9), q = int(r, 12, 25); return Q.yn(`${d * q} ÷ ${d} = ${q + pick(r, [1, 2, 10])}. Sjekk med gange: ${q + 1} × ${d}. Stemmer det?`, false, {say:`${d * q} delt på ${d} er ${q + 1}. Sjekk med gange. Stemmer det?`, expl:`Riktig svar er ${q}, for ${q} × ${d} = ${d * q}.`});
   }}
  ],
  drill:{tittel:'Divisjon med to- og tresifrede tall', layout:'row', cols:4, n:[48, 30], make:(r, i, hard) => {
    if(!hard){ const d = int(r, 2, 10), q = int(r, 2, 10); return {t:`${d * q} ÷ ${d} =`, ans:q}; }
    const d = pick(r, [2, 3, 4, 5, 6, 7]), q = int(r, 11, 29); return {t:`${d * q} ÷ ${d} =`, ans:q}; }}
});
})();
