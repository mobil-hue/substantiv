(function(){
'use strict';
/* Moduler: tall til 100, hundrere, telling (KM13241, KM13232, KM13230) */
const A = window.App, MT = window.MT, G = MT.G, Q = MT.Q, S = MT.S, B = MT.B, word = MT.word;
const {int, pick, shuf} = MT, {sc, pop, fade, big, sub, row, chip, title} = S;
const NO = n => A.N.no(n);
const uniq = a => a.filter((x, i) => a.indexOf(x) === i);
const nbrs = (r, n, lo, hi, d) => { const o = []; for(let k = 0; k < 80 && o.length < 3; k++){ const x = n + int(r, -(d || 12), d || 12); if(x >= lo && x <= hi && x !== n && !o.includes(x)) o.push(x); } return o; };
const wordFull = n => n >= 100 ? (n === 100 ? 'hundre' : (Math.floor(n / 100) === 1 ? 'hundre' : word(Math.floor(n / 100)) + ' hundre') + (n % 100 ? ' og ' + word(n % 100) : '')) : word(n);
MT.wordFull = wordFull;

/* ======================================================================
   4. Tall til 100
   ====================================================================== */
MT.module({
  id:'tall-til-100', rek:42, trinn:[2], maal:['KM13241', 'KM13232'], tittel:'Tall til 100: tallord, rekkefølge og hundrerutenett', ikon:'💯', bygger:['tiere-enere'],
  video:[
   {html:title('💯', 'Tall til 100', S.sub('Tallord, rekkefølge og sammenligning', 1.2)),
    no:'Nå skal vi bli trygge på alle tallene opp til hundre. Vi skal lese dem, skrive dem, sette dem i rekkefølge og sammenligne dem.'},
   {html:sc(G.grid({cs:27, hl:[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}), S.sub('Hundrerutenettet: ti i hver rad', 1.4)),
    no:'Her er hundrerutenettet. Det har ti rader med ti tall i hver. Rutene helt til høyre er hele tiere: ti, tjue, tretti, helt til hundre. Går vi ned én rad, blir tallet ti mer.'},
   {html:sc(S.row(...['tjue', 'tretti', 'førti', 'femti', 'seksti', 'sytti', 'åtti', 'nitti'].map((w, i) => S.chip(w, '#f97316', .2 + i * .5))), S.row(S.pop(G.eq('tjue + fem = tjuefem', '#2563eb'), 4.6), S.pop(G.eq('seksti + tre = sekstitre', '#16a34a'), 5.6))),
    no:'Tallordene følger et system. Først sier vi tieren: tjue, tretti, førti, femti, seksti, sytti, åtti, nitti. Så sier vi enerne. Tjue og fem er tjuefem. Seksti og tre er sekstitre.'},
   {html:sc(G.nline(40, 50, {marks:[{v:45, label:'45', c:'#f97316'}], w:600}), S.row(S.pop(G.eq('44 · før', '#6b7280'), .6), S.pop(G.eq('45', '#f97316'), 1.2), S.pop(G.eq('etter · 46', '#6b7280'), 1.8))),
    no:'Hvert tall har en nabo før og en nabo etter. Tallet før førtifem er førtifire. Tallet etter er førtiseks. Etter nittini kommer hundre.'},
   {html:sc(S.row(S.pop(G.blocks({t:3, e:8}, {u:6}), .2), S.pop(G.blocks({t:5, e:2}, {u:6}), 1.2)), S.big('52 > 38', 2.4), S.sub('Se på tierne først', 3.4)),
    no:'Hvilket tall er størst, trettiåtte eller femtito? Vi ser på tierne først. Fem tiere er mer enn tre tiere. Så femtito er størst. Femtito er større enn trettiåtte.'},
   {html:sc(S.row(S.pop(G.blocks({t:4, e:7}, {u:6}), .2), S.pop(G.blocks({t:4, e:3}, {u:6}), 1.2)), S.big('47 > 43', 2.4), S.sub('Like mange tiere? Se på enerne', 3.4)),
    no:'Hva hvis tierne er like? Førtisju og førtitre har begge fire tiere. Da ser vi på enerne. Sju er mer enn tre, så førtisju er størst. Tegnet peker mot det minste tallet.'},
   {html:sc(S.row(...[29, 41, 17].map((n, i) => S.pop(G.eq(n, '#2563eb'), .2 + i * .5))), S.pop('<span style="font-size:1.6rem;font-weight:900">↓ fra minst til størst</span>', 2), S.row(...[17, 29, 41].map((n, i) => S.pop(G.eq(n, '#16a34a'), 2.6 + i * .5)))),
    no:'Vi kan også sette tall i rekkefølge. Tjueni, førtien og sytten. Fra minst til størst blir det sytten, tjueni, førtien.'},
   {html:sc(S.row(S.pop(G.blocks({t:10}, {u:5, gap:6}), .2), S.pop('<span style="font-size:2.4rem;font-weight:900">=</span>', 1.2), S.pop(G.blocks({h:1}, {u:5}), 1.6)), S.big('10 tiere = 100', 2.6)),
    no:'Ti tiere er hundre. Hundre er det største tallet vi har med på hundrerutenettet. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal kunne lese, skrive, ordne og sammenligne tallene opp til 100, og bruke hundrerutenettet.',
   steg:['Les tallordet: tieren først, så eneren (tjue + fem = tjuefem).', 'Tallet <b>etter</b> er 1 mer, tallet <b>før</b> er 1 mindre. Tallet 10 mer står rett under i hundrerutenettet.', 'Sammenlign: se på <b>tierne først</b>. Er tierne like, se på enerne.', 'Større enn: >. Mindre enn: <. Den spisse enden peker mot det minste tallet.'],
   eks:['47 og 43: 4 tiere og 4 tiere, så se på enerne. 7 > 3, så <b>47 > 43</b>.', '29, 41, 17 i rekkefølge fra minst: <b>17, 29, 41</b>.'],
   ord:[['større enn (>)', 'har flere'], ['mindre enn (<)', 'har færre'], ['nabotall', 'tallet rett før og rett etter'], ['hundrerutenett', 'tallene 1–100 i ti rader']],
   feil:['«29 er større enn 41 fordi 9 er større enn 1» – tierne teller mest: 4 tiere er mer enn 2 tiere.', '«Etter 59 kommer 510» – etter 59 kommer 60.'],
   laerer:'Gjennom hundrerutenettet oversetter eleven mellom tallord, tallsymbol og posisjon (KM13241). Understrek at sammenligning starter med den høyeste plassverdien. Nabotall over tierskift (49→50, 59→60) er et vanlig snublested.'
  },
  refleksjon:'Hvorfor ser vi på tierne først når vi sammenligner 29 og 41?',
  nivaaer:[
   {t:'Forstå: tierne teller mest', d:'Sjekk at du har forstått rekkefølge og sammenligning.', kind:'forstaa', make:(r, i) => {
     const k = i % 4;
     if(k === 0){ const a = int(r, 11, 49), b = (int(r, 5, 9)) * 10 + int(r, 0, 9) ; const x = a, y = b > a ? b : 90 - int(r, 0, 5); return Q.choice(r, `Hva ser du på <b>først</b> når du sammenligner ${x} og ${y}?`, 'Tierne', ['Enerne', 'Det siste sifferet', 'Summen av sifrene'], {say:`Hva ser du på først når du sammenligner ${x} og ${y}?`, expl:'Tierne er mest verdt, så vi ser på dem først.'}); }
     if(k === 1){ const n = int(r, 11, 80); return Q.num(`Hva er 10 mer enn ${n}? {?}`, n + 10, {say:`Hva er ti mer enn ${n}?`, calc:`${n}+10`, expl:`I hundrerutenettet står tallet rett under. ${n} + 10 = ${n + 10}.`}); }
     if(k === 2){ const a = int(r, 2, 8) * 10 + int(r, 5, 9), b = (Math.floor(a / 10) + 1) * 10 + int(r, 0, 3); return Q.yn(`Er <b>${a}</b> større enn <b>${b}</b>?`, false, {expl:`${a} har ${Math.floor(a / 10)} tiere, ${b} har ${Math.floor(b / 10)} tiere. ${b} er størst.`}); }
     return Q.choice(r, 'Ti tiere er like mye som …', 'hundre', ['ti', 'tusen', 'tjue'], {keep:false, expl:'Ti tiere er 100.'});
   }},
   {t:'Tallord og tall', d:'Oversett mellom tallord og siffer.', n:10, make:(r, i) => {
     const n = int(r, 21, 99), w = word(n), k = i % 3, o = nbrs(r, n, 21, 99, 15);
     if(k === 0) return Q.choice(r, `Hvilket tall er <b>${w}</b>?`, n, o, {sort:true, nums:true, say:`Hvilket tall er ${w}?`, expl:`${w} = ${n}.`});
     if(k === 1) return Q.choice(r, `Hva heter <b>${n}</b>?`, w, o.map(word), {say:`Hva heter ${n}?`, expl:`${n} heter ${w}.`});
     return Q.num(`Skriv tallet: <b>${w}</b> = {?}`, n, {say:`Skriv tallet: ${w}`, expl:`${w} er ${Math.floor(n / 10)} tiere og ${n % 10} enere: ${n}.`});
   }},
   {t:'Før, etter og mellom', d:'Finn nabotall og tall som er 10 mer eller mindre.', n:10, make:(r, i) => {
     const n = int(r, 12, 98), k = i % 5;
     if(k === 0) return Q.num(`Tallet <b>etter</b> ${n} er {?}`, n + 1, {say:`Tallet etter ${n} er?`, expl:`${n} + 1 = ${n + 1}.`});
     if(k === 1) return Q.num(`Tallet <b>før</b> ${n} er {?}`, n - 1, {say:`Tallet før ${n} er?`, expl:`${n} − 1 = ${n - 1}.`});
     if(k === 2) return Q.num(`Hvilket tall ligger mellom ${n - 1} og ${n + 1}? {?}`, n, {say:`Hvilket tall ligger mellom ${n - 1} og ${n + 1}?`, expl:`Mellom ${n - 1} og ${n + 1} ligger ${n}.`});
     if(k === 3){ const m = int(r, 11, 85); return Q.num(`10 mer enn ${m} er {?}`, m + 10, {say:`Ti mer enn ${m} er?`, calc:`${m}+10`, expl:`Tieren øker med 1: ${m + 10}.`}); }
     const m = int(r, 21, 99); return Q.num(`10 mindre enn ${m} er {?}`, m - 10, {say:`Ti mindre enn ${m} er?`, calc:`${m}-10`, expl:`Tieren minker med 1: ${m - 10}.`});
   }},
   {t:'Sammenlign og ordne', d:'Større enn, mindre enn og rekkefølge.', n:10, make:(r, i) => {
     const k = i % 3; let a = int(r, 11, 99), b = int(r, 11, 99); if(a === b) b = a < 99 ? a + 1 : a - 1;
     if(k === 0) return Q.choice(r, `Hvilket tegn passer? &nbsp; <b>${a} ○ ${b}</b>`, a > b ? '>' : '<', ['>', '<', '='], {keep:true, say:`Er ${a} større enn eller mindre enn ${b}?`, expl:`${a} ${a > b ? 'er større enn' : 'er mindre enn'} ${b}. Sammenlign tierne først.`});
     if(k === 1){ const x = uniq([a, b, int(r, 11, 99)]); if(x.length < 3) x.push(((a + b) % 80) + 12); const big = r() < .5, ans = big ? Math.max(...x) : Math.min(...x); return Q.choice(r, `Hvilket tall er ${big ? '<b>størst</b>' : '<b>minst</b>'}? &nbsp; ${x.join(' &nbsp; ')}`, ans, x, {sort:true, nums:true, say:`Hvilket tall er ${big ? 'størst' : 'minst'}? ${x.join(', ')}`, expl:`${ans} er ${big ? 'størst' : 'minst'}.`}); }
     const x = uniq([a, b, int(r, 11, 99)]).slice(0, 3); if(x.length < 3) x.push(((a * 7 + b) % 80) + 12);
     const s = x.slice().sort((p, q) => p - q); return Q.choice(r, `Sett i rekkefølge fra minst til størst: &nbsp; <b>${x.join(', ')}</b>`, s.join(', '), shuf(r, [[0, 1, 2], [2, 1, 0], [1, 0, 2], [1, 2, 0], [0, 2, 1]]).map(p => p.map(j => s[j]).join(', ')).slice(0, 3), {say:`Sett i rekkefølge fra minst til størst: ${x.join(', ')}`, expl:`Fra minst til størst: ${s.join(', ')}.`});
   }},
   {t:'Hundrerutenettet', d:'Finn tall som mangler i hundrerutenettet.', n:10, make:(r, i) => {
     const row0 = int(r, 0, 6), from = row0 * 10 + 1, to = from + 29, hide = from + int(r, 0, 29), k = i % 2;
     return Q.num(`${G.grid({from, to, hide:[hide], cs:26})}<br>Hvilket tall mangler i ruten med spørsmålstegn? {?}`, hide, {say:'Hvilket tall mangler i ruten med spørsmålstegn?', expl:`Tallet etter er ${hide + 1 <= to ? hide + 1 : 'neste rad'}; ti mindre står over, ti mer under. Det er ${hide}.`, hint:'Se på nabotallene: tallet til venstre er 1 mindre, tallet over er 10 mindre.'});
   }}
  ]
});

/* ======================================================================
   5. Hundrere (100–999)
   ====================================================================== */
MT.module({
  id:'hundrerne', rek:66, trinn:[2], maal:['KM13232'], tittel:'Hundrere, tiere og enere (til 999)', ikon:'🧊', bygger:['tiere-enere', 'tall-til-100'],
  video:[
   {html:title('🧊', 'Hundrere, tiere og enere', S.sub('Tall over 100', 1.2)),
    no:'Nå skal vi se at samme system fungerer for større tall. Posisjonssystemet har en plass til hundrere, en til tiere og en til enere.'},
   {html:sc(S.row(S.pop(G.blocks({t:10}, {u:5, gap:6}), .2), S.pop('<span style="font-size:2.4rem;font-weight:900">=</span>', 1.2), S.pop(G.blocks({h:1}, {u:5}), 1.6)), S.sub('10 tiere = 1 hundrer', 2.4)),
    no:'Ti tiere er én hundrer. Vi tegner en hundrer som en stor flate med hundre ruter. Ti staver legges sammen til en flate.'},
   {html:sc(S.row(S.pop(G.blocks({h:3, t:4, e:5}, {u:5}), .2)), S.pop(G.pv({h:3, t:4, e:5}), 1.6), S.sub('3 hundrere · 4 tiere · 5 enere', 2.6)),
    no:'Her er tre hundrere, fire tiere og fem enere. I plasstabellen står tre på hundrerplassen, fire på tierplassen og fem på enerplassen. Tallet er tre hundre og førtifem. Vi skriver 345.'},
   {html:sc(S.row(S.big('300', .2, '#fca5a5'), S.plus('+', .8), S.big('40', 1.2, '#9cc4ff'), S.plus('+', 1.8), S.big('5', 2.2, '#9ef0b4')), S.big('= 345', 3)),
    no:'Tallet 345 kan skrives som tre hundre pluss førti pluss fem. Det kalles utvidet form. Hvert siffer har en verdi som avhenger av plassen.'},
   {html:sc(S.row(S.pop(G.pv({h:3, t:4, e:5}), .2), S.pop('<span style="font-size:2rem;font-weight:900">≠</span>', 1), S.pop(G.pv({h:5, t:4, e:3}), 1.4)), S.sub('345 og 543 er ikke det samme', 2.4)),
    no:'Tre hundre og førtifem er ikke det samme som fem hundre og førtitre. Sifrene er like, men de står på ulike plasser, og plassen bestemmer verdien.'},
   {html:sc(S.row(S.pop(G.blocks({h:3, e:5}, {u:5}), .2), S.pop(G.pv({h:3, t:0, e:5}), 1.2)), S.sub('305: ingen tiere – nullen holder plassen', 2.4)),
    no:'Hva med tre hundre og fem? Her er det ingen tiere. Nullen holder tierplassen, så tallet blir 305. Uten nullen ville det blitt 35, og det er et helt annet tall.'},
   {html:sc(S.row(S.pop(G.blocks({h:2, t:4, e:1}, {u:4}), .2), S.pop(G.blocks({h:2, t:7, e:0}, {u:4}), 1.2)), S.big('241 < 270', 2.4), S.sub('Hundrere først, så tiere, så enere', 3.4)),
    no:'For å sammenligne store tall ser vi på hundrerne først. Er de like, ser vi på tierne. Er de også like, ser vi på enerne. To hundre og førtien er mindre enn to hundre og sytti.'},
   {html:sc(G.chips([100, 200, 300, 400, 500, 600, 700, 800, 900], {c:'#dc2626'}), S.sub('Nå øver vi!', 1.6)),
    no:'Nå kan du lese og bygge tall opp til ni hundre og nittini. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal forstå tall opp til 999 som <b>hundrere, tiere og enere</b>, og kunne skrive, lese og sammenligne dem.',
   steg:['10 tiere veksles til 1 hundrer. 10 hundrere er 1 tusen.', 'Skriv hundrerne først, så tierne, så enerne: 3 hundrere, 4 tiere og 5 enere = <b>345</b>.', 'Utvidet form: 345 = 300 + 40 + 5.', 'Nullen holder plassen: 3 hundrere og 5 enere = <b>305</b>.', 'Sammenlign fra venstre: hundrere, så tiere, så enere.'],
   eks:[G.blocks({h:2, t:3, e:6}, {u:4}) + '<br>236 = 200 + 30 + 6', G.pv({h:4, t:0, e:7}) + '<br>407 = 4 hundrere, 0 tiere og 7 enere'],
   ord:[['hundrer', 'ti tiere, tallet 100'], ['plassverdi', 'hvor mye et siffer er verdt der det står'], ['utvidet form', 'tallet skrevet som sum: 345 = 300 + 40 + 5']],
   feil:['«Trehundreogfemti skrives 3005» – 350: 3 hundrere, 5 tiere, 0 enere.', '«Fem hundre og seks er 56» – 506. Nullen holder tierplassen.'],
   laerer:'Posisjonssystemet (KM13232) utvides med en ny plass. Flate, stav og kloss (base ti-materiell) gjør at barn ser at 10 av en slags alltid byttes mot 1 av neste slags – den samme tanken brukes i addisjon og subtraksjon med veksling.'
  },
  refleksjon:'Forklar forskjellen på 305 og 35 med klosser eller tegning.',
  nivaaer:[
   {t:'Forstå: hundrere, tiere og enere', d:'Sjekk at du har forstått plassverdi.', kind:'forstaa', make:(r, i) => {
     const h = int(r, 2, 9), t = int(r, 1, 9), e = int(r, 1, 9), n = h * 100 + t * 10 + e, k = i % 5;
     if(k === 0) return Q.choice(r, `I tallet <b>${n}</b>: hva er verdien til sifferet ${h}?`, h * 100, [h * 10, h, h * 1000], {sort:true, nums:true, say:`I tallet ${n}: hva er verdien til sifferet ${h}?`, expl:`${h} står på hundrerplassen: ${h} hundrere = ${h * 100}.`});
     if(k === 1) return Q.yn(`Er ${h * 100 + e} det samme som ${h * 10 + e}?`, false, {expl:`${h * 100 + e} er ${h} hundrere og ${e} enere. ${h * 10 + e} er ${h} tiere og ${e} enere.`});
     if(k === 2) return Q.num(`Hvor mange tiere er 1 hundrer? {?}`, 10, {say:'Hvor mange tiere er én hundrer?', expl:'1 hundrer = 10 tiere.'});
     if(k === 3) return Q.choice(r, `Hva betyr nullen i <b>${h}0${e}</b>?`, 'Ingen tiere', ['Ingen enere', 'Ingen hundrere', 'Ti tiere'], {say:`Hva betyr nullen i ${h}0${e}?`, expl:`Nullen står på tierplassen: det er 0 tiere.`});
     return Q.yn(`Er ${n} og ${e * 100 + t * 10 + h} det samme tallet?`, e === h, {expl:`Sifrene står på ulike plasser, så tallene er ulike.`});
   }},
   {t:'Klosser til tall', d:'Hvilket tall viser tegningen?', n:10, make:(r, i) => {
     const h = int(r, 1, 4), t = int(r, 0, 5), e = int(r, 0, 6), n = h * 100 + t * 10 + e;
     return Q.num(`${G.blocks({h, t, e}, {u:4})}<br>Hvilket tall viser tegningen? {?}`, n, {say:'Hvilket tall viser tegningen?', expl:`${h} hundrere, ${t} tiere og ${e} enere: ${n}.`, hint:'Tell flatene (100), stavene (10) og klossene (1).'});
   }},
   {t:'Plassverdi og tallord', d:'Finn verdien til sifrene og les tallord.', n:10, make:(r, i) => {
     const h = int(r, 1, 9), t = int(r, 0, 9), e = int(r, 0, 9), n = h * 100 + t * 10 + e, k = i % 4;
     if(k === 0) return Q.num(`${n} = {?} hundrere, ${t} tiere og ${e} enere`, h, {expl:`${n} har ${h} hundrere.`});
     if(k === 1){ const pos = pick(r, [['hundrerplassen', h], ['tierplassen', t], ['enerplassen', e]]); return Q.choice(r, `Hvilket siffer står på ${pos[0]} i ${n}?`, pos[1], [h, t, e, (pos[1] + 3) % 10], {sort:true, nums:true, say:`Hvilket siffer står på ${pos[0]} i ${n}?`, expl:`Les plassene fra venstre: hundrere ${h}, tiere ${t}, enere ${e}.`}); }
     if(k === 2){ const o = nbrs(r, n, 101, 999, 60); return Q.choice(r, `Hvilket tall er <b>${wordFull(n)}</b>?`, n, o, {sort:true, nums:true, say:`Hvilket tall er ${wordFull(n)}?`, expl:`${wordFull(n)} = ${n}.`}); }
     const val = pick(r, [['hundrerplassen', h * 100], ['tierplassen', t * 10], ['enerplassen', e]]); return Q.num(`I tallet ${n}: hva er verdien av sifferet på ${val[0]}? {?}`, val[1], {say:`I tallet ${n}: hva er verdien av sifferet på ${val[0]}?`, expl:`Verdien er ${val[1]}.`});
   }},
   {t:'Utvidet form', d:'Skriv tallet som en sum, og omvendt.', n:10, make:(r, i) => {
     const h = int(r, 1, 9), t = i % 3 === 0 ? 0 : int(r, 1, 9), e = i % 4 === 1 ? 0 : int(r, 1, 9), n = h * 100 + t * 10 + e, k = i % 3;
     if(k === 0) return Q.num(`${h * 100} + ${t * 10} + ${e} = {?}`, n, {calc:`${h * 100}+${t * 10}+${e}`, expl:`${h * 100} + ${t * 10} + ${e} = ${n}.`});
     if(k === 1) return Q.num(`${n} = ${h * 100} + ${t * 10} + {?}`, e, {expl:`Enerne i ${n} er ${e}.`});
     return Q.num(`${h} hundrere og ${e} enere (og ${t} tiere) = {?}`, n, {say:`${h} hundrere, ${t} tiere og ${e} enere er?`, expl:`${h} hundrere, ${t} tiere og ${e} enere: ${n}.`});
   }},
   {t:'Sammenlign og ordne', d:'Større, mindre og rekkefølge for tall til 999.', n:10, make:(r, i) => {
     const k = i % 3; let a = int(r, 101, 999), b = int(r, 101, 999); if(a === b) b = a + 1;
     if(k === 0) return Q.choice(r, `Hvilket tegn passer? &nbsp; <b>${a} ○ ${b}</b>`, a > b ? '>' : '<', ['>', '<', '='], {keep:true, say:`Er ${a} større enn eller mindre enn ${b}?`, expl:`Se på hundrerne først: ${Math.floor(a / 100)} og ${Math.floor(b / 100)}.`});
     if(k === 1){ const m = int(r, 101, 899), p = pick(r, [[100, 'hundre'], [10, 'ti']]); return Q.num(`${p[1][0].toUpperCase() + p[1].slice(1)} mer enn ${m} er {?}`, m + p[0], {say:`${p[1]} mer enn ${m} er?`, calc:`${m}+${p[0]}`, expl:`${p[1]} mer: ${m + p[0]}.`}); }
     const x = [a, b, int(r, 101, 999)]; if(new Set(x).size < 3) x[2] = a + b > 1500 ? 123 : 987; const s = x.slice().sort((p, q) => p - q);
     return Q.choice(r, `Hvilket tall er <b>størst</b>? &nbsp; ${x.join(' &nbsp; ')}`, s[2], x, {sort:true, nums:true, say:`Hvilket tall er størst? ${x.join(', ')}`, expl:`Størst er ${s[2]} (flest hundrere, eller flest tiere hvis hundrerne er like).`});
   }}
  ]
});

/* ======================================================================
   6. Telle framover og bakover
   ====================================================================== */
const rocket = (n, d) => S.pop('<span style="font-size:3.4rem">🚀</span>', d);
MT.module({
  id:'telle-fram-bak', rek:18, trinn:[1], maal:['KM13230'], tittel:'Telle framover og bakover', ikon:'🚀', bygger:['mengde-10'],
  video:[
   {html:title('🚀', 'Telle framover og bakover', S.sub('Start hvor du vil', 1.2)),
    no:'Nå skal vi telle. Vi skal telle framover, vi skal telle bakover, og vi skal starte på forskjellige tall.'},
   {html:sc(G.nline(0, 10, {hops:[0, 1, 2, 3, 4].map(k => ({a:k, b:k + 1, label:'+1', c:'#f97316'})), w:600}), S.sub('Framover: ett mer hver gang', 1.4)),
    no:'Når vi teller framover, går vi mot høyre på tallinjen. Null, en, to, tre, fire, fem. Hvert tall er én mer enn tallet før.'},
   {html:sc(S.row(rocket(1, 3.4), S.pop(G.chips([10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0], {c:'#dc2626'}), .2)), S.sub('Nedtelling: ett mindre hver gang', 1.2)),
    no:'Når vi teller bakover, går vi mot venstre. Ti, ni, åtte, sju, seks, fem, fire, tre, to, en, null! Oppskyting! Hvert tall er én mindre enn tallet før.'},
   {html:sc(G.nline(0, 15, {marks:[{v:6, label:'start', c:'#16a34a'}], hops:[6, 7, 8, 9].map(k => ({a:k, b:k + 1, c:'#f97316'})), w:620}), S.sub('Vi kan starte på et hvilket som helst tall', 1.6)),
    no:'Vi trenger ikke å starte på null eller på en. Vi kan starte på seks og telle videre: sju, åtte, ni, ti. Vi kan også starte på et høyt tall og telle bakover.'},
   {html:sc(G.chips([5, '?', 7], {c:'#2563eb'}), S.row(S.pop(G.eq('én mindre', '#6b7280'), .8), S.pop(G.eq('én mer', '#6b7280'), 1.4)), S.sub('Tallet før og tallet etter', 2)),
    no:'Tallet etter er det vi sier når vi teller ett steg videre. Tallet før er ett steg tilbake. Mellom fem og sju ligger seks.'},
   {html:sc(G.nline(15, 25, {marks:[{v:19, label:'19', c:'#2563eb'}, {v:20, label:'20', c:'#f97316'}], w:620}), S.sub('18, 19, 20, 21 – tallene fortsetter', 1.4)),
    no:'Hva kommer etter nitten? Tjue! Tallene stopper ikke ved nitten. Atten, nitten, tjue, tjueen, tjueto. Og bakover: tjueto, tjueen, tjue, nitten.'},
   {html:sc(S.row(S.pop(G.chips([12, 13, 14, '?', '?'], {c:'#2563eb'}), .2)), S.big('12 · 13 · 14 · 15 · 16', 1.6), S.sub('Hva er mønsteret? Ett mer hver gang', 2.8)),
    no:'Se på tallrekka tolv, tretten, fjorten. Hva kommer så? Femten og seksten. Mønsteret er at det blir ett mer hver gang. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal telle framover og bakover fra ulike startpunkter og forklare mønsteret i tellingen.',
   steg:['Framover: tallet <b>etter</b> er 1 mer (mot høyre på tallinjen).', 'Bakover: tallet <b>før</b> er 1 mindre (mot venstre).', 'Du kan starte på hvilket som helst tall.', 'Forklar mønsteret: «Det blir 1 mer (eller 1 mindre) for hvert tall.»'],
   eks:[G.chips([7, 8, 9, 10, 11], {c:'#3b82f6'}) + '<br>Framover fra 7', G.chips([12, 11, 10, 9, 8], {c:'#dc2626'}) + '<br>Bakover fra 12'],
   ord:[['framlengs', 'telle oppover: 1, 2, 3 …'], ['baklengs', 'telle nedover: 10, 9, 8 …'], ['startpunkt', 'tallet du begynner på'], ['mønster', 'noe som gjentar seg på samme måte']],
   feil:['«Etter 19 kommer 100» – etter 19 kommer 20.', '«Når jeg teller bakover, blir tallene større» – bakover blir tallene mindre.'],
   laerer:'KM13230 handler om telling som mer enn en rekke: valg av startpunkt, retning, og å forklare mønsteret. Øv også «tell fra 8 til 14», «tell tilbake fra 15». Se hopptelling-modulen for å telle med andre intervall.'
  },
  refleksjon:'Hvordan teller du bakover fra 14? Hva er mønsteret?',
  nivaaer:[
   {t:'Forstå: framover og bakover', d:'Sjekk at du har forstått retning og mønster.', kind:'forstaa', make:(r, i) => {
     const n = int(r, 4, 18), k = i % 4;
     if(k === 0) return Q.choice(r, 'Når vi teller bakover, blir tallene …', 'mindre', ['større', 'like store', 'tilfeldige'], {keep:false, say:'Når vi teller bakover, blir tallene …', expl:'Bakover betyr at vi går mot venstre på tallinjen, så tallene blir mindre.'});
     if(k === 1) return Q.yn(`Kan vi starte å telle på ${n}?`, true, {expl:'Ja! Vi kan starte på hvilket som helst tall.'});
     if(k === 2) return Q.choice(r, `Du teller: ${n}, ${n + 1}, ${n + 2}, ${n + 3}. Hva er mønsteret?`, 'Ett mer hver gang', ['Ett mindre hver gang', 'To mer hver gang', 'Det er ikke noe mønster'], {say:`Du teller: ${n}, ${n + 1}, ${n + 2}, ${n + 3}. Hva er mønsteret?`, expl:`${n + 1} er 1 mer enn ${n}, og slik fortsetter det.`});
     return Q.choice(r, `Du teller: ${n + 3}, ${n + 2}, ${n + 1}, ${n}. Hva er mønsteret?`, 'Ett mindre hver gang', ['Ett mer hver gang', 'To mindre hver gang', 'Det er ikke noe mønster'], {say:`Du teller: ${n + 3}, ${n + 2}, ${n + 1}, ${n}. Hva er mønsteret?`, expl:`Hvert tall er 1 mindre enn tallet før.`});
   }},
   {t:'Telle framover', d:'Fortsett tallrekka framover.', n:10, make:(r, i) => {
     const s = int(r, 0, 20), k = i % 3;
     if(k === 0) return Q.num(`${s}, ${s + 1}, ${s + 2}, {?}`, s + 3, {say:`${s}, ${s + 1}, ${s + 2}, hva kommer så?`, expl:`Ett mer: ${s + 3}.`});
     if(k === 1) return Q.num(`${s}, ${s + 1}, {?}, ${s + 3}`, s + 2, {say:`${s}, ${s + 1}, hvilket tall mangler, ${s + 3}?`, expl:`Mellom ${s + 1} og ${s + 3} kommer ${s + 2}.`});
     return Q.num(`${G.nline(s, s + 6, {hide:[s + 3], w:420, every:1})}<br>Hvilket tall mangler? {?}`, s + 3, {say:'Hvilket tall mangler?', expl:`Telle videre fra ${s}: ${s + 1}, ${s + 2}, ${s + 3}.`});
   }},
   {t:'Telle bakover', d:'Fortsett tallrekka bakover.', n:10, make:(r, i) => {
     const s = int(r, 5, 25), k = i % 3;
     if(k === 0) return Q.num(`${s}, ${s - 1}, ${s - 2}, {?}`, s - 3, {say:`${s}, ${s - 1}, ${s - 2}, hva kommer så?`, expl:`Ett mindre: ${s - 3}.`});
     if(k === 1) return Q.num(`${s}, {?}, ${s - 2}, ${s - 3}`, s - 1, {say:`${s}, hvilket tall mangler, ${s - 2}, ${s - 3}?`, expl:`Mellom ${s} og ${s - 2} kommer ${s - 1}.`});
     return Q.num(`Tell bakover fra ${s}. Hva er 3 tall bakover? {?}`, s - 3, {say:`Tell bakover fra ${s}. Hva er tre tall bakover?`, expl:`${s}, ${s - 1}, ${s - 2}, ${s - 3}. Du kommer til ${s - 3}.`});
   }},
   {t:'Før og etter, til 100', d:'Finn nabotall, også over tiere.', n:10, make:(r, i) => {
     const k = i % 4, tens = int(r, 1, 9) * 10;
     if(k === 0) return Q.num(`Tallet <b>etter</b> ${tens - 1} er {?}`, tens, {say:`Tallet etter ${tens - 1} er?`, expl:`${tens - 1} + 1 = ${tens}. Etter 9 enere kommer en ny tier.`});
     if(k === 1) return Q.num(`Tallet <b>før</b> ${tens} er {?}`, tens - 1, {say:`Tallet før ${tens} er?`, expl:`${tens} − 1 = ${tens - 1}.`});
     const n = int(r, 12, 97); if(k === 2) return Q.num(`Tallet før ${n} er {?} og tallet etter er ${n + 1}`, n - 1, {say:`Tallet før ${n} er?`, expl:`${n - 1}, ${n}, ${n + 1}.`});
     return Q.num(`${n - 2}, {?}, ${n}, ${n + 1}`, n - 1, {say:`${n - 2}, hvilket tall mangler, ${n}?`, expl:`Telle videre: ${n - 2}, ${n - 1}, ${n}, ${n + 1}.`});
   }},
   {t:'Start hvor som helst', d:'Tell et bestemt antall steg fra et startpunkt.', n:10, make:(r, i) => {
     const fwd = i % 2 === 0, st = int(r, 2, 6), s = int(r, fwd ? 5 : 7, 30), ans = fwd ? s + st : s - st;
     return Q.num(`Start på ${s} og tell ${st} ${fwd ? 'framover' : 'bakover'}. Hvilket tall kommer du til? {?}`, ans, {say:`Start på ${s} og tell ${st} ${fwd ? 'framover' : 'bakover'}. Hvilket tall kommer du til?`, calc:`${s}${fwd ? '+' : '-'}${st}`, expl:`${s}, ${Array.from({length:st}, (_, j) => fwd ? s + j + 1 : s - j - 1).join(', ')}. Du kommer til ${ans}.`, hint:G.nline(Math.max(0, Math.min(s, ans) - 2), Math.max(s, ans) + 2, {w:520, every:1})});
   }}
  ]
});

/* ======================================================================
   7. Hopptelling
   ====================================================================== */
const seqStr = (s, d, n) => Array.from({length:n}, (_, j) => s + j * d);
MT.module({
  id:'hopptelling', rek:44, trinn:[1, 2], maal:['KM13230'], tittel:'Hopptelling: telle med 2, 5 og 10', ikon:'🦘', bygger:['telle-fram-bak', 'tall-til-100'],
  video:[
   {html:title('🦘', 'Hopptelling', S.sub('Telle med 2, 5 og 10', 1.2)),
    no:'Nå skal vi telle på en ny måte. I stedet for å telle ett og ett, hopper vi. Det kalles hopptelling. Vi kan hoppe like langt hver gang, og vi kan starte hvor vi vil.'},
   {html:sc(G.nline(0, 12, {hops:[0, 2, 4, 6, 8, 10].map(a => ({a, b:a + 2, label:'+2', c:'#f97316'})), w:640}), S.sub('Telle med 2: 2, 4, 6, 8, 10, 12', 1.4)),
    no:'Her hopper vi to om gangen. Null, to, fire, seks, åtte, ti, tolv. Hvert hopp er like langt. Vi hopper med to. Differansen mellom tallene er to.'},
   {html:sc(G.nline(0, 25, {hops:[0, 5, 10, 15, 20].map(a => ({a, b:a + 5, label:'+5', c:'#2563eb'})), w:680}), S.sub('Telle med 5: 5, 10, 15, 20, 25', 1.6)),
    no:'Nå hopper vi fem om gangen. Fem, ti, femten, tjue, tjuefem. Ser du at tallene ender på fem og på null, annenhver gang?'},
   {html:sc(G.grid({cs:26, hl:[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}), S.sub('Telle med 10: hele tiere', 1.4)),
    no:'Når vi hopper med ti, går vi ned en rad i hundrerutenettet hver gang. Ti, tjue, tretti, førti, helt til hundre. Enersifferet er det samme hele tiden, og tierne øker med én.'},
   {html:sc(G.nline(0, 20, {marks:[{v:3, label:'start', c:'#16a34a'}], hops:[3, 5, 7, 9].map(a => ({a, b:a + 2, label:'+2', c:'#f97316'})), w:640}), S.sub('Start på 3: 3, 5, 7, 9, 11', 1.6)),
    no:'Vi kan starte et annet sted enn på null. Her starter vi på tre og hopper med to: tre, fem, sju, ni, elleve. Da får vi en helt annen rekke.'},
   {html:sc(G.nline(0, 30, {marks:[{v:30, label:'start', c:'#16a34a'}], hops:[30, 25, 20, 15].map(a => ({a, b:a - 5, label:'−5', c:'#dc2626'})), w:680}), S.sub('Bakover: 30, 25, 20, 15, 10', 1.6)),
    no:'Vi kan også hoppe bakover. Fra tretti hopper vi fem om gangen tilbake: tretti, tjuefem, tjue, femten, ti. Da blir tallene mindre.'},
   {html:sc(G.grid({cs:26, hl:[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100], to:60}), S.sub('Hvorfor ender 5-rekka på 0 eller 5?', 1.6)),
    no:'Hvorfor ender fem-rekka alltid på null eller fem? Fordi fem og fem er ti. Annenhver gang er vi på en hel tier. Og mellom ligger tallene som ender på fem. Slike mønstre kan vi forklare.'},
   {html:sc(G.chips([4, 9, 14, 19, '?'], {c:'#9333ea'}), S.big('differanse 5', 1.6), S.sub('Nå øver vi!', 2.6)),
    no:'Se på tallene fire, ni, fjorten, nitten. Hvor mye hopper vi? Fem hver gang. Det er differansen. Neste tall er tjuefire. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal telle med like hopp (2, 5, 10 og andre), fra ulike startpunkter, framover og bakover – og <b>forklare mønsteret</b>.',
   steg:['Bestem <b>startpunkt</b> og <b>hopp</b> (differansen).', 'Framover: legg til hoppet hver gang. Bakover: trekk fra hoppet.', 'Se etter mønster: ender tallene på det samme sifferet? Øker tierne med 1?', 'Forklar: «Hver gang legger jeg til 5, så tallene ender på 0 eller 5.»'],
   eks:[G.chips([2, 4, 6, 8, 10], {c:'#f97316'}) + ' hopp 2', G.chips([5, 10, 15, 20, 25], {c:'#2563eb'}) + ' hopp 5', G.chips([40, 30, 20, 10], {c:'#dc2626'}) + ' bakover med 10'],
   ord:[['hopptelling', 'telle med like store hopp'], ['differanse', 'hvor mye det er mellom to tall i rekka (størrelsen på hoppet)'], ['startpunkt', 'tallet vi begynner på']],
   feil:['«Telle med 5 fra 3 gir 5, 10, 15» – starter du på 3, blir det 3, 8, 13, 18.', '«Bakover med 10 fra 50 gir 60» – bakover betyr mindre: 40.'],
   laerer:'Hopptelling forbereder multiplikasjon (gruppering), men målet her er mønsterforståelse (KM13230): ulikt startpunkt, ulik differanse, og å forklare hvorfor mønsteret oppstår. Hundrerutenettet gjør mønstrene synlige.'
  },
  refleksjon:'Hvorfor ender tallene på 0 eller 5 når vi teller med 5 fra 0? Forklar med ord.',
  nivaaer:[
   {t:'Forstå: hopp og mønster', d:'Sjekk at du har forstått differanse og mønster.', kind:'forstaa', make:(r, i) => {
     const d = pick(r, [2, 3, 5, 10]), s = int(r, 1, 9), seq = seqStr(s, d, 4), k = i % 4;
     if(k === 0) return Q.num(`Hvor stort er hoppet i rekka <b>${seq.join(', ')}</b>? {?}`, d, {say:`Hvor stort er hoppet i rekka ${seq.join(', ')}?`, expl:`${seq[1]} − ${seq[0]} = ${d}.`});
     if(k === 1) return Q.choice(r, 'Hvorfor ender tallene på 0 eller 5 når vi teller med 5 fra 0?', 'Fordi 5 + 5 = 10, så annenhver gang er vi på en tier', ['Fordi 5 er et pent tall', 'Fordi det er tilfeldig', 'Fordi vi hopper bakover'], {say:'Hvorfor ender tallene på null eller fem når vi teller med fem fra null?', expl:'Fem og fem er ti. Så annenhver gang lander vi på en hel tier, og mellom lander vi på tall som ender på 5.'});
     if(k === 2) return Q.choice(r, 'Hva skjer med enersifferet når vi teller med 10?', 'Det er det samme hele tiden', ['Det øker med 1', 'Det øker med 10', 'Det blir 5'], {say:'Hva skjer med enersifferet når vi teller med ti?', expl:'Å legge til 10 øker bare tierne. Enerne er de samme: 3, 13, 23, 33 …'});
     return Q.yn(`Kan vi telle med 5 og starte på ${s}?`, true, {expl:`Ja, vi kan starte hvor vi vil: ${seqStr(s, 5, 4).join(', ')}.`});
   }},
   {t:'Telle med 2', d:'Hopp med 2 fra ulike startpunkter, framover og bakover.', n:10, make:(r, i) => {
     const fwd = i % 3 !== 2, s = fwd ? int(r, 0, 12) : int(r, 10, 24), d = fwd ? 2 : -2, seq = seqStr(s, d, 5), miss = int(r, 2, 4);
     return Q.num(`${seq.map((x, j) => j === miss ? '{?}' : x).join(', ')}<br>Hvilket tall mangler?`, seq[miss], {say:`Tell med ${fwd ? 'to' : 'to bakover'}. Hvilket tall mangler?`, expl:`Hopp ${fwd ? '+' : '−'}2 hver gang: ${seq.join(', ')}.`, hint:G.nline(Math.min(...seq) - 1, Math.max(...seq) + 1, {w:560, every:1})});
   }},
   {t:'Telle med 5 og 10', d:'Hopp med 5 og 10.', n:10, make:(r, i) => {
     const d = i % 2 ? 10 : 5, fwd = i % 4 !== 3, s = d === 10 ? int(r, 0, 4) * 10 : int(r, 0, 4) * 5, seq = fwd ? seqStr(s, d, 5) : seqStr(s + 4 * d, -d, 5), miss = int(r, 1, 4);
     return Q.num(`${seq.map((x, j) => j === miss ? '{?}' : x).join(', ')}<br>Hvilket tall mangler?`, seq[miss], {say:`Tell med ${d === 5 ? 'fem' : 'ti'}${fwd ? '' : ' bakover'}. Hvilket tall mangler?`, expl:`Hopp ${fwd ? '+' : '−'}${d}: ${seq.join(', ')}.`, hint:G.grid({cs:22, hl:seq, to:100})});
   }},
   {t:'Start hvor som helst', d:'Ulike startpunkter og ulike hopp.', n:10, make:(r, i) => {
     const d = pick(r, [2, 3, 4, 5, 10]), fwd = i % 3 !== 2, s = int(r, 1, 30) + (fwd ? 0 : d * 4), seq = seqStr(s, fwd ? d : -d, 5), miss = 4;
     return Q.num(`${seq.slice(0, 4).join(', ')}, {?}<br>Hvilket tall kommer så?`, seq[4], {say:`${seq.slice(0, 4).join(', ')}, hvilket tall kommer så?`, expl:`Hoppet er ${d} ${fwd ? 'framover' : 'bakover'}: ${seq[3]} ${fwd ? '+' : '−'} ${d} = ${seq[4]}.`});
   }},
   {t:'Forklar mønstre', d:'Finn hoppet og se hva som passer.', n:10, make:(r, i) => {
     const d = pick(r, [2, 3, 4, 5, 10]), s = int(r, 1, 20), seq = seqStr(s, d, 5), k = i % 3;
     if(k === 0) return Q.near(r, `Hvor stort er hoppet i rekka <b>${seq.join(', ')}</b>?`, d, {say:`Hvor stort er hoppet i rekka ${seq.join(', ')}?`, expl:`${seq[1]} − ${seq[0]} = ${d}.`});
     if(k === 1){ const wrong = seq[2] + 1 + (d > 2 ? 0 : 1), arr = seq.slice(0, 5); arr[3] = arr[3] + (d === 10 ? 3 : 1); return Q.choice(r, `Hvilket tall passer <b>ikke</b> i rekka? &nbsp; <b>${arr.join(', ')}</b>`, arr[3], arr.filter((_, j) => j !== 3), {say:`Hvilket tall passer ikke i rekka? ${arr.join(', ')}`, sort:true, nums:true, expl:`Rekka hopper ${d} hver gang. Etter ${arr[2]} skulle det komme ${arr[2] + d}.`}); }
     const yes = r() < .5, t = seq[4] + d * 2 + (yes ? 0 : 1); return Q.yn(`Kommer <b>${t}</b> i rekka <b>${seq.slice(0, 3).join(', ')}, …</b> (hopp ${d})?`, yes, {say:`Kommer ${t} i rekka ${seq.slice(0, 3).join(', ')}, med hopp ${d}?`, expl:yes ? `${seq.join(', ')}, ${seq[4] + d}, ${t}: ja, tallet kommer.` : `Rekka går ${seq.join(', ')}, ${seq[4] + d}, ${seq[4] + d * 2}. ${t} kommer ikke.`});
   }}
  ]
});
})();
