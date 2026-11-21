(function(){
'use strict';
/* Moduler: tid (klokke og kalender) og trinnvise instruksjoner (KM13238, KM13239) */
const A = window.App, MT = window.MT, G = MT.G, Q = MT.Q, S = MT.S, B = MT.B;
const {int, pick, shuf} = MT, {sc, pop, fade, big, sub, row, chip, title} = S;
const uniq = a => a.filter((x, i) => a.indexOf(x) === i);
const HW = ['tolv', 'ett', 'to', 'tre', 'fire', 'fem', 'seks', 'sju', 'åtte', 'ni', 'ti', 'elleve', 'tolv'];
const hw = h => HW[((h - 1) % 12) + 1];
const nx = h => h % 12 + 1;
const dig = (h, m) => String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
/* klokkeord: 3:30 = «halv fire», 3:45 = «kvart på fire» */
const kl = (h, m) => ({0:`klokka er ${hw(h)}`, 5:`fem over ${hw(h)}`, 10:`ti over ${hw(h)}`, 15:`kvart over ${hw(h)}`, 20:`tjue over ${hw(h)}`, 25:`fem på halv ${hw(nx(h))}`, 30:`halv ${hw(nx(h))}`, 35:`fem over halv ${hw(nx(h))}`, 40:`tjue på ${hw(nx(h))}`, 45:`kvart på ${hw(nx(h))}`, 50:`ti på ${hw(nx(h))}`, 55:`fem på ${hw(nx(h))}`})[m];
const hours = () => Array.from({length:12}, (_, i) => i + 1);
const clk = (h, m, s) => G.clock(h, m, {s:s || 140});
const wrongTimes = (r, h, m, step) => { const o = []; for(let k = 0; k < 60 && o.length < 3; k++){ const hh = k % 3 === 0 ? ((h + int(r, 1, 2) - 1) % 12) + 1 : h, mm = k % 3 === 1 ? ((m + step * int(r, 1, 3)) % 60) : (k % 3 === 2 ? ((m + 60 - step * int(r, 1, 3)) % 60) : m), key = dig(hh, mm); if(key !== dig(h, m) && !o.includes(key)) o.push(key); } return o; };

/* ======================================================================
   Klokka: hele og halve timer
   ====================================================================== */
MT.module({
  id:'klokka-hel-halv', rek:35.5, trinn:[1, 2], maal:['KM13238'], tittel:'Klokka: hele og halve timer', ikon:'🕒', bygger:['tall-11-20'],
  video:[
   {html:title('🕒', 'Klokka', S.sub('Hele og halve timer', 1.2)),
    no:'Nå skal vi lære å lese klokka. Klokka forteller oss hvilken tid det er. Vi bruker den hver eneste dag, for å vite når skolen begynner og når vi skal spise.'},
   {html:sc(S.pop(clk(3, 0, 170), .2), S.sub('Kort viser = timer · lang viser = minutter', 1.4)),
    no:'En klokke har to visere. Den korte viseren viser timene. Den lange viseren viser minuttene. Tallene går fra en til tolv, rundt hele klokka.'},
   {html:sc(S.row(S.pop(clk(3, 0, 150), .2), S.pop(G.digi(3, 0), 1.2)), S.sub('Lang viser på 12: hel time. Klokka er tre.', 2.2)),
    no:'Når den lange viseren peker på tolv, er det en hel time. Den korte viseren peker på tre. Da er klokka tre. En digital klokke viser det slik: null tre, null null.'},
   {html:sc(S.row(S.pop(clk(7, 0, 130), .2), S.pop(G.digi(7, 0), .8), S.pop(clk(11, 0, 130), 1.4), S.pop(G.digi(11, 0), 2)), S.sub('Klokka er sju · Klokka er elleve', 2.6)),
    no:'Her er klokka sju, og her er klokka elleve. Se på den korte viseren, og les av timen. Den lange viseren står på tolv hele tiden når det er hel time.'},
   {html:sc(S.row(S.pop(clk(3, 30, 150), .2), S.pop(G.digi(3, 30), 1.2)), S.sub('Lang viser på 6: halv time – 30 minutter', 2.2)),
    no:'Når den lange viseren peker på seks, har det gått en halv time. Det er tretti minutter. Her er den korte viseren mellom tre og fire. Klokka er tre og tretti.'},
   {html:sc(S.row(S.pop(clk(3, 30, 140), .2), S.pop(G.eq('halv fire', '#f97316'), 1.2)), S.sub('Halv fire = halvveis til fire. Klokka er 03:30', 2.4)),
    no:'Nå kommer noe som er litt rart på norsk. Vi sier halv fire, når klokka er tre og tretti. Halv fire betyr halvveis til fire, altså en halv time før fire. Det er ikke halv tre! Tenk: halvveis mellom tre og fire.'},
   {html:sc(S.row(S.pop(clk(8, 30, 120), .2), S.pop(G.eq('halv ni', '#f97316'), .8), S.pop(clk(12, 30, 120), 1.4), S.pop(G.eq('halv ett', '#f97316'), 2)), S.sub('08:30 = halv ni · 12:30 = halv ett', 2.8)),
    no:'Åtte og tretti er halv ni. Tolv og tretti er halv ett. Vi sier alltid timen som kommer etterpå.'},
   {html:sc(S.row(S.pop(G.digi(15, 0), .2), S.pop(G.eq('15:00 = klokka tre', '#2563eb'), 1)), S.sub('Digital klokke kan gå til 24', 2)),
    no:'En digital klokke kan også vise femten null null. Det er klokka tre på ettermiddagen. Nå vet du hel og halv time. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal lese av hele og halve timer på analog og digital klokke.',
   steg:['<b>Kort viser</b> = timer. <b>Lang viser</b> = minutter.', 'Lang viser på 12 = <b>hel time</b> (klokka er tre, 03:00).', 'Lang viser på 6 = <b>halv time</b> (30 minutter, 03:30).', 'På norsk sier vi <b>«halv fire»</b> for 03:30 – halvveis til fire.'],
   eks:[G.clock(3, 0, {s:100}) + ' ' + G.digi(3, 0) + '<br>klokka er tre', G.clock(3, 30, {s:100}) + ' ' + G.digi(3, 30) + '<br>halv fire'],
   ord:[['analog klokke', 'klokke med visere'], ['digital klokke', 'klokke med tall: 03:30'], ['hel time', 'minuttviseren på 12'], ['halv time', '30 minutter; minuttviseren på 6']],
   feil:['«Halv fire er 4:30» – halv fire er 3:30 (halvveis til fire).', '«Den lange viseren viser timene» – den korte viser timene.'],
   laerer:'KM13238 (klokke). Dette er første trinn: hele og halve timer, analog og digital. «Halv fire» er et typisk hinder – bruk tallinje/klokke og snakk om «halvveis til neste time». 24-timers digital visning introduseres lett.'
  },
  refleksjon:'Når står du opp og når legger du deg? Vis med hele eller halve timer på en klokke.',
  nivaaer:[
   {t:'Forstå: visere og halv time', d:'Sjekk at du har forstått klokka.', kind:'forstaa', make:(r, i) => {
     const h = int(r, 1, 12), k = i % 6;
     if(k === 0) return Q.choice(r, 'Hvilken viser viser timene?', 'Den korte', ['Den lange', 'Begge', 'Ingen'], {expl:'Den korte viseren viser timene, den lange viser minuttene.'});
     if(k === 1) return Q.num('Hvor mange minutter er en halv time? {?}', 30, {expl:'En halv time er 30 minutter.'});
     if(k === 2) return Q.choice(r, `Hva betyr «halv ${hw(nx(h))}»?`, dig(h, 30), [dig(nx(h), 30), dig(h, 0), dig(nx(h), 0)], {say:`Hva betyr halv ${hw(nx(h))}?`, expl:`Halv ${hw(nx(h))} er halvveis til ${hw(nx(h))}: ${hw(h)} og tretti.`});
     if(k === 3) return Q.choice(r, 'Når den lange viseren peker på 12, er klokka …', 'en hel time', ['en halv time', 'tolv minutter', 'ingenting'], {expl:'Lang viser på 12: hel time.'});
     if(k === 4) return Q.num('Når den lange viseren peker på 6, hvor mange minutter er det? {?}', 30, {expl:'6 × 5 = 30 minutter, en halv time.'});
     return Q.choice(r, 'Hvilken tid viser en digital klokke som viser 03:30?', 'Halv fire', ['Halv tre', 'Fire', 'Tre'], {say:'Hvilken tid viser en digital klokke som viser null tre, tretti?', expl:'03:30 er halv fire.'});
   }},
   {t:'Hele timer', d:'Les av klokka.', n:10, make:(r, i) => { const h = int(r, 1, 12); return Q.choice(r, `${clk(h, 0)}<br>Hvilken tid viser klokka?`, dig(h, 0), wrongTimes(r, h, 0, 5).map(x => x.slice(0, 3) + '00'), {say:'Hvilken tid viser klokka?', expl:`Kort viser på ${h}, lang viser på 12: klokka er ${hw(h)}.`}); }},
   {t:'Digital til analog', d:'Hvilken klokke viser tiden?', n:10, make:(r, i) => {
     const h = int(r, 1, 12), m = i % 2 ? 30 : 0, o = []; for(let k = 0; k < 40 && o.length < 2; k++){ const hh = int(r, 1, 12), mm = r() < .4 ? 30 - m : m; if((hh !== h || mm !== m) && !o.some(x => x[0] === hh && x[1] === mm)) o.push([hh, mm]); }
     return Q.choice(r, `${G.digi(h, m)}<br>Hvilken klokke viser samme tid?`, clk(h, m, 80), o.map(x => clk(x[0], x[1], 80)), {say:`Hvilken klokke viser ${dig(h, m)}?`, key:`klokka som viser ${dig(h, m)}`, expl:`${dig(h, m)}: kort viser på ${h}${m ? ' (litt over)' : ''}, lang viser på ${m ? 6 : 12}.`});
   }},
   {t:'Halve timer', d:'«Halv fire» betyr 03:30.', n:10, make:(r, i) => {
     const h = int(r, 1, 12);
     if(i % 2 === 0) return Q.choice(r, `${clk(h, 30)}<br>Hva sier vi?`, kl(h, 30), [`halv ${hw(h)}`, `klokka er ${hw(h)}`, `halv ${hw(nx(nx(h)))}`], {say:'Hva sier vi når klokka er slik?', expl:`Klokka er ${dig(h, 30)}. Vi sier ${kl(h, 30)}.`});
     return Q.choice(r, `${clk(h, 30)}<br>Hvilken tid viser klokka?`, dig(h, 30), wrongTimes(r, h, 30, 0).map(x => x.slice(0, 3) + '30').concat([dig(nx(h), 30)]).slice(0, 3), {say:'Hvilken tid viser klokka?', expl:`${hw(h)} og tretti: ${dig(h, 30)}.`});
   }},
   {t:'Hel eller halv: blandet', d:'Analog, digital og ord om hverandre.', n:10, make:(r, i) => {
     const h = int(r, 1, 12), m = r() < .5 ? 0 : 30, k = i % 3;
     if(k === 0) return Q.choice(r, `${clk(h, m)}<br>Hvilken tid viser klokka?`, dig(h, m), wrongTimes(r, h, m, 0), {say:'Hvilken tid viser klokka?', expl:`${dig(h, m)}.`});
     if(k === 1) return Q.choice(r, `Hva er «${m ? 'halv ' + hw(nx(h)) : 'klokka er ' + hw(h)}» på en digital klokke?`, dig(h, m), wrongTimes(r, h, m, 0), {say:`Hva er «${m ? 'halv ' + hw(nx(h)) : 'klokka er ' + hw(h)}» på en digital klokke?`, expl:`${m ? 'Halv ' + hw(nx(h)) : 'Klokka er ' + hw(h)} = ${dig(h, m)}.`});
     return Q.choice(r, `${G.digi(h, m)}<br>Hva sier vi?`, kl(h, m), uniq([kl(h, 30 - m), kl(nx(h), m), kl(h, m ? 0 : 30)].filter(x => x !== kl(h, m))), {say:`Hva sier vi når den digitale klokka viser ${dig(h, m)}?`, expl:`${dig(h, m)} = ${kl(h, m)}.`});
   }},
   {t:'Hvor lang tid?', d:'Hvor mange timer er det mellom to klokkeslett?', n:10, make:(r, i) => {
     const h = int(r, 1, 7), d = int(r, 1, 4), half = i % 3 === 0, from = half ? 'halv ' + hw(h + 1) : 'klokka ' + hw(h), to = half ? 'halv ' + hw(h + d + 1) : 'klokka ' + hw(h + d);
     return Q.num(`Fra ${from} til ${to}. Hvor mange timer er det? {?}`, d, {say:`Fra ${from} til ${to}. Hvor mange timer er det?`, calc:`${h + d}-${h}`, expl:`${h + d} − ${h} = ${d} timer.`, hint:'Tell timene på klokka eller tallinja.'});
   }}
  ]
});

/* ======================================================================
   Klokka: kvarter og minutter
   ====================================================================== */
const M5 = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
MT.module({
  id:'klokka-kvarter', rek:53, trinn:[2], maal:['KM13238'], tittel:'Klokka: kvarter og minutter', ikon:'🕞', bygger:['klokka-hel-halv', 'hopptelling'],
  video:[
   {html:title('🕞', 'Klokka: kvarter og minutter', S.sub('Telle med fem rundt klokka', 1.2)),
    no:'Nå skal vi lese klokka mer nøyaktig. Vi skal lese av minutter, og lære hva kvart over og kvart på betyr.'},
   {html:sc(S.pop(clk(3, 20, 160), .2), S.sub('Hvert tall = 5 minutter: 5, 10, 15, 20 …', 1.4)),
    no:'Minuttviseren går rundt klokka på en time. Hvert tall er fem minutter. Fra tolv til en er fem minutter. Til to er ti minutter. Vi teller med fem, akkurat som i hopptelling: fem, ti, femten, tjue.'},
   {html:sc(S.row(S.pop(clk(3, 10, 120), .2), S.pop(G.digi(3, 10), .8), S.pop(clk(3, 20, 120), 1.4), S.pop(G.digi(3, 20), 2)), S.sub('ti over tre · tjue over tre', 2.8)),
    no:'Her har minuttviseren gått til to. Det er ti minutter. Klokka er ti over tre. Her har den gått til fire, tjue minutter. Klokka er tjue over tre.'},
   {html:sc(S.row(S.pop(clk(3, 15, 130), .2), S.pop(G.digi(3, 15), .8), S.pop(G.eq('kvart over tre', '#f97316'), 1.4)), S.sub('Et kvarter = 15 minutter', 2.2)),
    no:'Når minuttviseren peker på tre, har det gått femten minutter. Det kalles et kvarter. Klokka er kvart over tre. Kvart betyr en fjerdedel av en time.'},
   {html:sc(S.row(S.pop(clk(3, 45, 130), .2), S.pop(G.digi(3, 45), .8), S.pop(G.eq('kvart på fire', '#f97316'), 1.4)), S.sub('45 minutter: et kvarter igjen til fire', 2.2)),
    no:'Når minuttviseren peker på ni, har det gått førtifem minutter. Det er bare et kvarter igjen til neste time. Klokka er kvart på fire.'},
   {html:sc(S.row(S.pop(clk(3, 25, 120), .2), S.pop(G.eq('fem på halv fire', '#f97316'), .8), S.pop(clk(3, 35, 120), 1.4), S.pop(G.eq('fem over halv fire', '#f97316'), 2)), S.sub('25 og 35 minutter', 2.8)),
    no:'Rundt halv time sier vi litt annerledes. Tre og tjuefem er fem på halv fire. Tre og trettifem er fem over halv fire. Vi bruker halv fire som holdepunkt.'},
   {html:sc(S.pop(G.nline(0, 60, {every:15, tick:5, hops:[{a:0, b:45, label:'45 min', c:'#f97316'}], w:700}), .2), S.sub('Fra 03:00 til 03:45 er det 45 minutter', 1.8)),
    no:'Vi kan regne hvor lang tid noe tar. Fra klokka tre til kvart på fire er det førtifem minutter. Fra tre til fire er det seseksti minutter, en hel time. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal lese av minutter på klokka (5-minutters-steg), bruke «kvart over», «kvart på» og «halv», og regne med minutter.',
   steg:['Hvert tall på klokka er <b>5 minutter</b>: tell med 5.', '<b>Kvarter</b> = 15 minutter: kvart over (:15), kvart på (:45).', 'Før halv: «fem på halv» (:25), «halv» (:30), «fem over halv» (:35).', 'Etter halv: «tjue på» (:40), «ti på» (:50) – de peker mot neste time.', '1 time = 60 minutter.'],
   eks:[G.clock(3, 15, {s:90}) + ' ' + G.digi(3, 15) + '<br>kvart over tre', G.clock(3, 45, {s:90}) + ' ' + G.digi(3, 45) + '<br>kvart på fire'],
   ord:[['kvarter', '15 minutter'], ['minutt', '60 minutter er 1 time'], ['over', 'minutter etter hel time'], ['på', 'minutter før neste hel time']],
   feil:['«Kvart over tre er 3:25» – kvart er 15 minutter: 3:15.', '«Kvart på fire er 4:15» – kvart på fire er 3:45.'],
   laerer:'Fortsettelse av klokka-hel-halv. Koble til hopptelling med 5. La elevene stille klokka selv og lese høyt: «Hva sier vi?». «Fem på halv» og «fem over halv» er vanskelige – ta dem til slutt.'
  },
  refleksjon:'Hvor lang tid bruker du på skoleveien? Vis start og slutt på en klokke.',
  nivaaer:[
   {t:'Forstå: minutter og kvarter', d:'Sjekk at du har forstått kvarter og minutter.', kind:'forstaa', make:(r, i) => {
     const h = int(r, 1, 12), k = i % 6;
     if(k === 0) return Q.num('Hvor mange minutter er et kvarter? {?}', 15, {expl:'Et kvarter er 15 minutter.'});
     if(k === 1) return Q.num('Hvor mange minutter er det i en time? {?}', 60, {expl:'1 time = 60 minutter.'});
     if(k === 2) return Q.choice(r, `Hva betyr «kvart på ${hw(nx(h))}»?`, dig(h, 45), [dig(nx(h), 45), dig(h, 15), dig(nx(h), 15)], {say:`Hva betyr kvart på ${hw(nx(h))}?`, expl:`Kvart på ${hw(nx(h))} er 45 minutter over ${hw(h)}: ${dig(h, 45)}.`});
     if(k === 3) return Q.choice(r, 'Hva er hvert tall på klokka verdt for minuttviseren?', '5 minutter', ['1 minutt', '10 minutter', '15 minutter'], {expl:'Fra ett tall til neste går det 5 minutter.'});
     if(k === 4) return Q.num('Når minuttviseren peker på 3, hvor mange minutter har gått? {?}', 15, {expl:'3 × 5 = 15 minutter.'});
     return Q.yn('Er «kvart over» og «kvart på» det samme?', false, {expl:'Nei. Kvart over er 15 minutter over hel time. Kvart på er 15 minutter før neste hele time.'});
   }},
   {t:'Telle minutter', d:'Hvor mange minutter over hel time?', n:10, make:(r, i) => { const h = int(r, 1, 12), m = pick(r, M5.filter(x => x !== 30)); return Q.num(`${clk(h, m)}<br>Hvor mange minutter har gått siden hel time? {?}`, m, {say:'Hvor mange minutter har gått siden hel time?', expl:`Minuttviseren peker på ${m / 5}. ${m / 5} × 5 = ${m}.`, hint:'Tell med 5 fra 12 og rundt.'}); }},
   {t:'Kvart over og kvart på', d:'Hva sier vi?', n:10, make:(r, i) => {
     const h = int(r, 1, 12), m = pick(r, [15, 45]);
     return Q.choice(r, `${clk(h, m)}<br>Hva sier vi?`, kl(h, m), uniq([kl(h, m === 15 ? 45 : 15), kl(nx(h), m), kl(h, 30), kl(h, 0)].filter(x => x !== kl(h, m))).slice(0, 3), {say:'Hva sier vi når klokka er slik?', expl:`${dig(h, m)} = ${kl(h, m)}.`});
   }},
   {t:'Les av digitalt', d:'Hvilken tid viser klokka?', n:10, make:(r, i) => { const h = int(r, 1, 12), m = pick(r, M5.concat([0])); return Q.choice(r, `${clk(h, m)}<br>Hvilken tid viser klokka?`, dig(h, m), wrongTimes(r, h, m, 5), {say:'Hvilken tid viser klokka?', expl:`Kort viser nær ${h}, lang viser på ${m / 5 || 12}: ${dig(h, m)}.`}); }},
   {t:'Klokkeord og digital tid', d:'Fra ord til tall og motsatt.', n:10, make:(r, i) => {
     const h = int(r, 1, 12), m = pick(r, M5.concat([0]));
     if(i % 2 === 0) return Q.choice(r, `Hva er «${kl(h, m)}» på en digital klokke?`, dig(h, m), wrongTimes(r, h, m, 5), {say:`Hva er ${kl(h, m)} på en digital klokke?`, expl:`${kl(h, m)} = ${dig(h, m)}.`});
     return Q.choice(r, `${G.digi(h, m)}<br>Hva sier vi?`, kl(h, m), uniq([kl(h, (m + 5) % 60), kl(h, (m + 55) % 60), kl(nx(h), m), kl(h, m === 0 ? 30 : 0)].filter(x => x !== kl(h, m))).slice(0, 3), {say:`Hva sier vi når den digitale klokka viser ${dig(h, m)}?`, expl:`${dig(h, m)} = ${kl(h, m)}.`});
   }},
   {t:'Hvor lang tid?', d:'Regn med minutter og timer.', n:10, make:(r, i) => {
     const k = i % 3;
     if(k === 0){ const h = int(r, 1, 11), a = pick(r, [0, 15, 30, 45]), b = pick(r, [0, 15, 30, 45].filter(x => x > a)); if(!b) return null; return Q.num(`Fra ${dig(h, a)} til ${dig(h, b)}. Hvor mange minutter er det? {?}`, b - a, {say:`Fra ${dig(h, a)} til ${dig(h, b)}. Hvor mange minutter er det?`, calc:`${b}-${a}`, expl:`${b} − ${a} = ${b - a} minutter.`}); }
     if(k === 1){ const h = int(r, 1, 9), d = int(r, 1, 3); return Q.num(`Fra ${dig(h, 0)} til ${dig(h + d, 0)}. Hvor mange minutter er det? {?}`, d * 60, {say:`Fra ${dig(h, 0)} til ${dig(h + d, 0)}. Hvor mange minutter er det?`, calc:`${d}*60`, expl:`${d} time${d > 1 ? 'r' : ''} = ${d} × 60 = ${d * 60} minutter.`}); }
     const m = pick(r, [10, 20, 25, 35, 40, 50]); return Q.num(`Det går ${m} minutter. Hvor mange minutter er det igjen til en hel time? {?}`, 60 - m, {say:`Det har gått ${m} minutter. Hvor mange minutter er det igjen til en hel time?`, calc:`60-${m}`, expl:`60 − ${m} = ${60 - m}.`});
   }}
  ]
});

/* ======================================================================
   Kalender
   ====================================================================== */
const UD = ['mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag', 'søndag'];
const MD = [['januar', 31], ['februar', 28], ['mars', 31], ['april', 30], ['mai', 31], ['juni', 30], ['juli', 31], ['august', 31], ['september', 30], ['oktober', 31], ['november', 30], ['desember', 31]];
MT.module({
  id:'kalender', rek:49, trinn:[1, 2], maal:['KM13238'], tittel:'Kalender: dager, uker og måneder', ikon:'📅', bygger:['telle-fram-bak', 'tall-11-20'],
  video:[
   {html:title('📅', 'Kalender', S.sub('Dager, uker og måneder', 1.2)),
    no:'Nå skal vi lære om kalenderen. Kalenderen hjelper oss å holde styr på dager, uker og måneder.'},
   {html:sc(S.row(...UD.map((d, i) => S.chip(d, i > 4 ? '#dc2626' : '#2563eb', .2 + i * .4))), S.sub('7 dager i en uke · helg: lørdag og søndag', 3.4)),
    no:'En uke har sju dager: mandag, tirsdag, onsdag, torsdag, fredag, lørdag og søndag. Lørdag og søndag kaller vi helgen. Etter søndag kommer mandag igjen.'},
   {html:sc(S.pop(G.cal({days:30, start:2, name:'april', hl:[]}), .2), S.sub('Hver rad er en uke', 1.4)),
    no:'Her er en side i kalenderen. Hver rad er en uke. Dagene står i rekkefølge, fra mandag til søndag. Tallene er datoene i måneden.'},
   {html:sc(S.row(...MD.slice(0, 6).map((m, i) => S.chip(m[0], '#16a34a', .2 + i * .35))), S.row(...MD.slice(6).map((m, i) => S.chip(m[0], '#f97316', 2.4 + i * .35))), S.sub('12 måneder i et år', 4.6)),
    no:'Et år har tolv måneder. Januar, februar, mars, april, mai, juni, juli, august, september, oktober, november og desember.'},
   {html:sc(S.row(S.pop(G.eq('31 dager: jan, mar, mai, jul, aug, okt, des', '#2563eb'), .2)), S.row(S.pop(G.eq('30 dager: apr, jun, sep, nov', '#16a34a'), 1.2)), S.row(S.pop(G.eq('februar: 28 dager', '#f97316'), 2.2))),
    no:'Månedene har ikke like mange dager. Noen har trettien, noen har tretti, og februar har bare tjueåtte dager. Vi kan telle det på kalenderen.'},
   {html:sc(S.pop(G.cal({days:30, start:2, name:'april', hl:[12]}), .2), S.sub('Hvilken ukedag er den 12.? Tell: 5. er lørdag … 12. er også lørdag', 1.4)),
    no:'Vi kan finne ukedager på kalenderen. Den tolvte står her. Gå opp til toppen av kolonnen og les av. Den tolvte april er en lørdag. Hver gang vi legger til sju dager, er det samme ukedag.'},
   {html:sc(S.pop(G.cal({days:30, start:2, name:'april', hl:[5, 12]}), .2), S.sub('Fra 5. til 12.: 7 dager = 1 uke', 1.4)),
    no:'Vi kan også regne dager. Fra den femte til den tolvte er det sju dager. Det er akkurat en uke. Tolv minus fem er sju.'},
   {html:sc(S.big('I går · i dag · i morgen', .2), S.sub('Nå øver vi!', 1.4)),
    no:'Husk: i går, i dag og i morgen. Kalenderen hjelper oss å planlegge. Nå skal du øve på dager, uker og måneder!'}
  ],
  tekst:{
   mal:'Du skal beskrive tid ved hjelp av kalender: ukedager, måneder, datoer og hvor mange dager det er mellom to datoer.',
   steg:['En uke har <b>7 dager</b>: man, tir, ons, tor, fre, lør, søn. Et år har <b>12 måneder</b>.', 'Les av ukedagen øverst i kolonnen til datoen.', 'Dager mellom to datoer: <b>slutt − start</b>. En uke senere = +7.', 'Månedene har 28, 30 eller 31 dager.'],
   eks:[G.cal({days:30, start:2, name:'april', hl:[12]}) + '<br>12. april er en lørdag'],
   ord:[['dato', 'dagen i måneden, for eksempel 12.'], ['ukedag', 'mandag, tirsdag …'], ['helg', 'lørdag og søndag']],
   feil:['«En uke har fem dager» – en uke har sju dager.', '«Etter desember kommer januar samme år» – etter desember begynner et nytt år.'],
   laerer:'KM13238 (kalender): bruk en ekte klasse-kalender og snakk om i går, i dag og i morgen. Regn dager mellom datoer og «en uke senere». Koble til telling og hopptelling (sju og sju).'
  },
  refleksjon:'Hvilken dato er det i dag? Hvor mange dager er det til neste helg?',
  nivaaer:[
   {t:'Forstå: uke og år', d:'Sjekk at du har forstått kalenderen.', kind:'forstaa', make:(r, i) => {
     const k = i % 6;
     if(k === 0) return Q.num('Hvor mange dager er det i en uke? {?}', 7, {expl:'7 dager: mandag til søndag.'});
     if(k === 1) return Q.num('Hvor mange måneder er det i et år? {?}', 12, {expl:'12 måneder, fra januar til desember.'});
     if(k === 2) return Q.choice(r, 'Hvilke dager er helg?', 'Lørdag og søndag', ['Mandag og tirsdag', 'Fredag og lørdag', 'Onsdag og torsdag'], {expl:'Helgen er lørdag og søndag.'});
     if(k === 3) return Q.choice(r, 'Hvilken måned har færrest dager?', 'Februar', ['Januar', 'April', 'Desember'], {expl:'Februar har 28 dager (29 i skuddår).'});
     if(k === 4) return Q.choice(r, 'Hvilken dag kommer etter søndag?', 'Mandag', ['Lørdag', 'Tirsdag', 'Fredag'], {expl:'Uka begynner på nytt med mandag.'});
     return Q.yn('Er hver rad i kalenderen en uke?', true, {expl:'Ja. Hver rad har sju dager.'});
   }},
   {t:'Ukedager', d:'Dagen før, dagen etter og telle dager.', n:10, make:(r, i) => {
     const d = int(r, 0, 6), k = i % 4;
     if(k === 0) return Q.choice(r, `Hvilken dag kommer etter ${UD[d]}?`, UD[(d + 1) % 7], shuf(r, UD.filter(x => x !== UD[(d + 1) % 7])).slice(0, 3), {say:`Hvilken dag kommer etter ${UD[d]}?`, expl:`Etter ${UD[d]} kommer ${UD[(d + 1) % 7]}.`});
     if(k === 1) return Q.choice(r, `Hvilken dag er dagen før ${UD[d]}?`, UD[(d + 6) % 7], shuf(r, UD.filter(x => x !== UD[(d + 6) % 7])).slice(0, 3), {say:`Hvilken dag er dagen før ${UD[d]}?`, expl:`Før ${UD[d]} kommer ${UD[(d + 6) % 7]}.`});
     if(k === 2){ const n = int(r, 2, 4); return Q.choice(r, `I dag er det ${UD[d]}. Hvilken dag er det om ${n} dager?`, UD[(d + n) % 7], shuf(r, UD.filter(x => x !== UD[(d + n) % 7])).slice(0, 3), {say:`I dag er det ${UD[d]}. Hvilken dag er det om ${n} dager?`, expl:`Tell ${n} dager fram fra ${UD[d]}: ${UD[(d + n) % 7]}.`}); }
     const a = int(r, 0, 3), b = int(r, a + 1, 4); return Q.num(`Hvor mange dager er det fra ${UD[a]} til ${UD[b]}? {?}`, b - a, {say:`Hvor mange dager er det fra ${UD[a]} til ${UD[b]}?`, calc:`${b}-${a}`, expl:`${UD[a]}, ${UD.slice(a + 1, b + 1).join(', ')}: ${b - a} dager.`});
   }},
   {t:'Måneder', d:'Rekkefølge og antall dager.', n:10, make:(r, i) => {
     const m = int(r, 0, 11), k = i % 4;
     if(k === 0) return Q.choice(r, `Hvilken måned kommer etter ${MD[m][0]}?`, MD[(m + 1) % 12][0], shuf(r, MD.map(x => x[0]).filter(x => x !== MD[(m + 1) % 12][0])).slice(0, 3), {say:`Hvilken måned kommer etter ${MD[m][0]}?`, expl:`Etter ${MD[m][0]} kommer ${MD[(m + 1) % 12][0]}.`});
     if(k === 1) return Q.choice(r, `Hvilken måned kommer før ${MD[m][0]}?`, MD[(m + 11) % 12][0], shuf(r, MD.map(x => x[0]).filter(x => x !== MD[(m + 11) % 12][0])).slice(0, 3), {say:`Hvilken måned kommer før ${MD[m][0]}?`, expl:`Før ${MD[m][0]} kommer ${MD[(m + 11) % 12][0]}.`});
     if(k === 2) return Q.num(`Hvor mange dager har ${MD[m][0]}? {?}`, MD[m][1], {say:`Hvor mange dager har ${MD[m][0]}?`, expl:`${MD[m][0][0].toUpperCase() + MD[m][0].slice(1)} har ${MD[m][1]} dager.`});
     return Q.num(`${MD[m][0][0].toUpperCase() + MD[m][0].slice(1)} er måned nummer … (januar = 1) {?}`, m + 1, {say:`${MD[m][0]} er måned nummer hvor mange, når januar er nummer en?`, expl:`${MD.slice(0, m + 1).map(x => x[0]).join(', ')}: nummer ${m + 1}.`});
   }},
   {t:'Les kalenderen', d:'Finn ukedager og datoer.', n:10, make:(r, i) => {
     const md = pick(r, MD), days = md[1], start = int(r, 0, 6), d = int(r, 1, days), name = md[0];
     if(i % 3 === 0) return Q.choice(r, `${G.cal({days, start, name, hl:[d]})}<br>Hvilken ukedag er den ${d}. ${name}?`, UD[(start + d - 1) % 7], shuf(r, UD.filter(x => x !== UD[(start + d - 1) % 7])).slice(0, 3), {say:`Hvilken ukedag er den ${d}. ${name}?`, expl:`Les av ukedagen øverst i kolonnen: ${UD[(start + d - 1) % 7]}.`});
     if(i % 3 === 1){ const wd = int(r, 0, 6); const first = 1 + ((wd - start + 7) % 7); return Q.num(`${G.cal({days, start, name})}<br>Hvilken dato er den første ${UD[wd]} i ${name}? {?}`, first, {say:`Hvilken dato er den første ${UD[wd]} i ${name}?`, expl:`Finn kolonnen for ${UD[wd]} og les av første dato: ${first}.`}); }
     const wd = int(r, 0, 6), cnt = [...Array(days)].filter((_, j) => (start + j) % 7 === wd).length;
     return Q.num(`${G.cal({days, start, name})}<br>Hvor mange ${UD[wd]}er er det i ${name}? {?}`, cnt, {say:`Hvor mange ${UD[wd]}er er det i ${name}?`, expl:`Tell datoene i ${UD[wd]}-kolonnen: ${cnt}.`});
   }},
   {t:'Hvor mange dager?', d:'Regn med datoer.', n:10, make:(r, i) => {
     const md = pick(r, MD), days = md[1], start = int(r, 0, 6), a = int(r, 1, days - 8), b = a + int(r, 2, 8), name = md[0];
     if(i % 2 === 0) return Q.num(`${G.cal({days, start, name, hl:[a, b]})}<br>Hvor mange dager er det fra den ${a}. til den ${b}.? {?}`, b - a, {say:`Hvor mange dager er det fra den ${a}. til den ${b}.?`, calc:`${b}-${a}`, expl:`${b} − ${a} = ${b - a} dager.`});
     return Q.num(`Det er den ${a}. ${name}. Hvilken dato er det en uke senere? {?}`, a + 7, {say:`Det er den ${a}. ${name}. Hvilken dato er det en uke senere?`, calc:`${a}+7`, expl:`En uke er 7 dager: ${a} + 7 = ${a + 7}.`});
   }}
  ]
});

/* ======================================================================
   Trinnvise instruksjoner og regler (KM13239)
   ====================================================================== */
const DIR = {'↑':[0, -1], '↓':[0, 1], '←':[-1, 0], '→':[1, 0]}, DS = {'↑':'opp', '↓':'ned', '←':'venstre', '→':'høyre'};
const sim = (st, cmds, w, h) => { let [x, y] = st; cmds.forEach(c => { const nxx = x + DIR[c][0], nyy = y + DIR[c][1]; if(nxx >= 0 && nyy >= 0 && nxx < w && nyy < h){ x = nxx; y = nyy; } }); return [x, y]; };
const arrows = c => c.join(' ');
const sayArr = c => c.map(x => DS[x]).join(', ');
// tilfeldig instruksjon som holder seg inne i rutenettet
const randProg = (r, st, len, w, h) => { const cmds = []; let [x, y] = st; for(let k = 0; k < len; k++){ const opts = Object.keys(DIR).filter(c => { const a = x + DIR[c][0], b = y + DIR[c][1]; return a >= 0 && b >= 0 && a < w && b < h; }); const c = pick(r, opts); cmds.push(c); x += DIR[c][0]; y += DIR[c][1]; } return cmds; };
const cellName = p => 'ABCDE'[p[0]] + (p[1] + 1);
MT.module({
  id:'instruksjoner', rek:47, trinn:[1, 2], maal:['KM13239'], tittel:'Regler og trinnvise instruksjoner', ikon:'🤖', bygger:['telle-fram-bak'],
  video:[
   {html:title('🤖', 'Trinnvise instruksjoner', S.sub('Steg for steg i riktig rekkefølge', 1.2)),
    no:'Nå skal vi lage og følge instruksjoner. En instruksjon er steg for steg, i en bestemt rekkefølge. Når vi følger reglene riktig, får vi riktig resultat.'},
   {html:sc(S.row(S.chip('1 Ta frem brød', '#2563eb', .2), S.chip('2 Smør på smør', '#16a34a', 1.2), S.chip('3 Legg på ost', '#f97316', 2.2), S.chip('4 Spis!', '#9333ea', 3.2)), S.sub('Rekkefølgen er viktig!', 4.4)),
    no:'Tenk på å lage en brødskive. Først tar du frem brød. Så smører du på smør. Så legger du på ost. Til slutt spiser du den. Hvis du spiser først, blir det ingen brødskive. Rekkefølgen er viktig.'},
   {html:sc(S.pop(G.robot({w:5, h:4, cs:48, start:[0, 3], goal:[2, 1], dir:'E', path:[[0, 3], [1, 3], [2, 3], [2, 2], [2, 1]]}), .2), S.sub('→ → ↑ ↑', 1.4)),
    no:'Her er en robot i et rutenett. Den skal til stjernen. Vi gir den en instruksjon med piler. Pil mot høyre betyr ett steg til høyre. Pil opp betyr ett steg opp.'},
   {html:sc(S.row(S.pop(G.eq('→', '#2563eb'), .2), S.pop(G.eq('→', '#2563eb'), .8), S.pop(G.eq('↑', '#16a34a'), 1.4), S.pop(G.eq('↑', '#16a34a'), 2)), S.sub('To høyre og to opp: roboten kommer til stjernen!', 2.8)),
    no:'Instruksjonen er: høyre, høyre, opp, opp. Roboten tar ett steg for hver pil. To til høyre og to opp. Nå står den på stjernen.'},
   {html:sc(S.pop(G.robot({w:5, h:4, cs:48, start:[0, 3], goal:[2, 1], dir:'E', path:[[0, 3], [0, 2], [0, 1], [1, 1], [2, 1]]}), .2), S.sub('↑ ↑ → →  – annen rekkefølge, men samme mål', 1.4)),
    no:'Kan vi bytte rekkefølge? Opp, opp, høyre, høyre kommer også til stjernen, men roboten tar en annen vei. Men bytter vi bare én pil, kan det gå galt. Vi må alltid sjekke om instruksjonen gir riktig resultat.'},
   {html:sc(S.row(S.pop(G.eq('→ → → →', '#2563eb'), .2), S.pop('<span style="font-size:2rem;font-weight:900">=</span>', .8), S.pop(G.eq('gjenta 4 ganger: →', '#f97316'), 1.4)), S.sub('Gjenta kan gjøre instruksjonen kortere', 2.4)),
    no:'Hvis noe skjer flere ganger, kan vi bruke gjenta. I stedet for å skrive pil høyre fire ganger, skriver vi: gjenta fire ganger, høyre. Det blir kortere og lettere å lese.'},
   {html:sc(S.row(S.pop('<div class="mtcard" style="--c:#2563eb;padding:8px 14px">🎲 Regel: kaster du partall, går du 2 steg. Kaster du oddetall, går du 1 steg.</div>', .2)), S.sub('Regler finnes også i leker og spill', 1.6)),
    no:'Regler finnes også i leker og spill. For eksempel: kaster du et partall på terningen, går du to steg. Kaster du et oddetall, går du ett steg. Alle må følge de samme reglene, ellers blir spillet urettferdig.'},
   {html:sc(S.big('Lag din egen instruksjon – la en venn følge den!', .2), S.sub('Nå øver vi!', 1.4)),
    no:'Du kan lage dine egne regler og instruksjoner. La en venn følge dem, og sjekk om hun kommer dit du ville. Hvis ikke, må vi finne feilen. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal lage og følge <b>regler</b> og <b>trinnvise instruksjoner</b> i lek og spill.',
   steg:['En instruksjon er <b>steg for steg</b> i en bestemt <b>rekkefølge</b>.', 'Piler: ↑ ett steg opp · ↓ ned · ← venstre · → høyre.', 'Følg ett steg om gangen og tegn veien.', '<b>Gjenta</b> gjør lange instruksjoner korte: «gjenta 3 ganger: →».', 'Sjekk instruksjonen din: kommer roboten dit du ville?'],
   eks:[G.robot({w:5, h:4, cs:40, start:[0, 3], goal:[2, 1], dir:'E', path:[[0, 3], [1, 3], [2, 3], [2, 2], [2, 1]]}) + '<br>→ → ↑ ↑'],
   ord:[['instruksjon', 'steg du skal følge'], ['regel', 'noe alle må følge i en lek eller et spill'], ['gjenta', 'gjøre det samme flere ganger'], ['rekkefølge', 'hva som kommer først, så, så']],
   feil:['«Rekkefølgen spiller ingen rolle» – ofte gjør den det.', '«Jeg telte startruta som et steg» – roboten står på startruta; første pil flytter den.'],
   laerer:'KM13239: lage og følge regler og trinnvise instruksjoner i lek og spill (begynnende algoritmisk tenkning). Kan gjøres uten skjerm (elever styrer hverandre i gymsalen). Programmering i engere forstand kommer senere (KM i 5.–7. trinn).'
  },
  refleksjon:'Lag en instruksjon med piler som flytter en venn fra døra til pulten din. Test den!',
  nivaaer:[
   {t:'Forstå: instruksjon og regel', d:'Sjekk at du har forstått.', kind:'forstaa', make:(r, i) => {
     const k = i % 5;
     if(k === 0) return Q.choice(r, 'Hva er en instruksjon?', 'Steg du følger i en bestemt rekkefølge', ['Et tall', 'En tegning', 'Et leketøy'], {expl:'En instruksjon sier hva du skal gjøre, steg for steg.'});
     if(k === 1) return Q.yn('Kan rekkefølgen på stegene ha noe å si?', true, {expl:'Ja. Å spise brødskiva før du har smurt den, gir et annet resultat.'});
     if(k === 2) return Q.choice(r, 'Hva betyr pilen ↑ til roboten?', 'Ett steg opp', ['Ett steg ned', 'Ett steg til høyre', 'Stå stille'], {expl:'Pil opp: ett steg opp i rutenettet.'});
     if(k === 3) return Q.choice(r, 'Hva betyr «gjenta 3 ganger: →»?', '→ → →', ['→', '→ → → → →', '← ← ←'], {expl:'Gjenta 3 ganger betyr å gjøre det samme 3 ganger.'});
     return Q.yn('Må alle spillerne følge de samme reglene i et spill?', true, {expl:'Ja. Ellers blir spillet urettferdig.'});
   }},
   {t:'Følg instruksjonen', d:'Hvor ender roboten?', n:10, make:(r, i) => {
     const w = 5, h = 5, st = [int(r, 0, 4), int(r, 0, 4)], len = int(r, 3, 6), cmds = randProg(r, st, len, w, h), end = sim(st, cmds, w, h);
     const others = shuf(r, Array.from({length:25}, (_, j) => [j % 5, Math.floor(j / 5)]).filter(p => !(p[0] === end[0] && p[1] === end[1]) && !(p[0] === st[0] && p[1] === st[1]))).slice(0, 2), letters = shuf(r, ['A', 'B', 'C']);
     const marks = [end].concat(others).map((p, j) => ({p, t:letters[j]}));
     return Q.choice(r, `${G.robot({w, h, cs:40, start:st, dir:'E', marks})}<br>Roboten følger: <b>${arrows(cmds)}</b><br>Hvor ender den?`, letters[0], ['A', 'B', 'C'], {keep:true, say:`Roboten følger: ${sayArr(cmds)}. Hvor ender den?`, key:letters[0], expl:`Start og følg én pil om gangen: ${arrows(cmds)}. Roboten ender på ${letters[0]}.`});
   }},
   {t:'Lag instruksjonen', d:'Hvilken instruksjon tar roboten til stjernen?', n:10, make:(r, i) => {
     const w = 5, h = 5; let st, goal; do{ st = [int(r, 0, 4), int(r, 0, 4)]; goal = [int(r, 0, 4), int(r, 0, 4)]; }while(Math.abs(st[0] - goal[0]) + Math.abs(st[1] - goal[1]) < 3 || Math.abs(st[0] - goal[0]) + Math.abs(st[1] - goal[1]) > 6);
     const hz = goal[0] > st[0] ? '→' : '←', vt = goal[1] > st[1] ? '↓' : '↑', cmds = shuf(r, Array(Math.abs(goal[0] - st[0])).fill(hz).concat(Array(Math.abs(goal[1] - st[1])).fill(vt))), wrong = [];
     for(let k = 0; k < 60 && wrong.length < 3; k++){ const c = cmds.slice(); const m = k % 3; if(m === 0) c.pop(); else if(m === 1) c.push(pick(r, Object.keys(DIR))); else { const j = int(r, 0, c.length - 1); c[j] = pick(r, Object.keys(DIR).filter(x => x !== c[j])); } const e = sim(st, c, w, h); if((e[0] !== goal[0] || e[1] !== goal[1]) && !wrong.some(x => arrows(x) === arrows(c)) && arrows(c) !== arrows(cmds)) wrong.push(c); }
     return Q.choice(r, `${G.robot({w, h, cs:40, start:st, goal, dir:'E'})}<br>Hvilken instruksjon tar roboten til stjernen?`, arrows(cmds), wrong.map(arrows), {say:'Hvilken instruksjon tar roboten til stjernen?', expl:`${Math.abs(goal[0] - st[0])} steg ${DS[hz]} og ${Math.abs(goal[1] - st[1])} steg ${DS[vt]}: ${arrows(cmds)}.`});
   }},
   {t:'Hvor mange steg?', d:'Minst mulig steg til stjernen.', n:10, make:(r, i) => {
     const w = 5, h = 5; let st, goal; do{ st = [int(r, 0, 4), int(r, 0, 4)]; goal = [int(r, 0, 4), int(r, 0, 4)]; }while(st[0] === goal[0] && st[1] === goal[1]);
     const d = Math.abs(goal[0] - st[0]) + Math.abs(goal[1] - st[1]);
     return Q.num(`${G.robot({w, h, cs:40, start:st, goal, dir:'E'})}<br>Hvor mange steg må roboten minst ta for å komme til stjernen? {?}`, d, {say:'Hvor mange steg må roboten minst ta for å komme til stjernen?', calc:`${Math.abs(goal[0] - st[0])}+${Math.abs(goal[1] - st[1])}`, expl:`${Math.abs(goal[0] - st[0])} sidelengs og ${Math.abs(goal[1] - st[1])} opp eller ned: ${d} steg.`});
   }},
   {t:'Gjenta og regler', d:'Gjenta-instruksjoner og spilleregler.', n:10, make:(r, i) => {
     if(i % 2 === 0){ const w = 5, h = 5, st = [int(r, 0, 1), int(r, 3, 4)], a = pick(r, ['→', '↑']), b = a === '→' ? '↑' : '→', na = int(r, 1, 2), nb = int(r, 1, 2), reps = int(r, 2, 3), cmds = []; for(let k = 0; k < reps; k++){ for(let j = 0; j < na; j++) cmds.push(a); for(let j = 0; j < nb; j++) cmds.push(b); }
       const end = sim(st, cmds, w, h); if(cmds.length > 8) return null; const others = shuf(r, Array.from({length:25}, (_, j) => [j % 5, Math.floor(j / 5)]).filter(p => !(p[0] === end[0] && p[1] === end[1]))).slice(0, 2), letters = shuf(r, ['A', 'B', 'C']);
       const ex = (n, c) => n > 1 ? `${n} × ${c}` : c; return Q.choice(r, `${G.robot({w, h, cs:40, start:st, dir:'E', marks:[end].concat(others).map((p, j) => ({p, t:letters[j]}))})}<br>Gjenta ${reps} ganger: <b>${(na > 1 ? [a, a] : [a]).concat(nb > 1 ? [b, b] : [b]).join(' ')}</b><br>Hvor ender roboten?`, letters[0], ['A', 'B', 'C'], {keep:true, key:letters[0], say:`Gjenta ${reps} ganger: ${sayArr((na > 1 ? [a, a] : [a]).concat(nb > 1 ? [b, b] : [b]))}. Hvor ender roboten?`, expl:`Hele instruksjonen er ${arrows(cmds)}. Roboten ender på ${letters[0]}.`}); }
     const rolls = Array.from({length:3}, () => int(r, 1, 6)), steps = rolls.reduce((s, x) => s + (x % 2 === 0 ? 2 : 1), 0);
     return Q.num(`Regel: partall på terningen = 2 steg, oddetall = 1 steg. Du kaster ${rolls.join(', ')}. Hvor mange steg går du til sammen? {?}`, steps, {say:`Regel: partall på terningen gir to steg, oddetall gir ett steg. Du kaster ${rolls.join(', ')}. Hvor mange steg går du til sammen?`, expl:rolls.map(x => `${x} er ${x % 2 === 0 ? 'partall: 2' : 'oddetall: 1'}`).join('; ') + `. Til sammen ${steps} steg.`});
   }}
  ]
});
})();
