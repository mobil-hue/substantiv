(function(){
'use strict';
/* Moduler 4. trinn: mønstre som vokser, strategi i spill, algoritmer med løkker, variabler og vilkår (KM13262, KM13263) */
const MT = window.MT, G = MT.G, Q = MT.Q, S = MT.S;
const {int, pick, shuf} = MT, {sc, title} = S;
const uniq = a => a.filter((x, i, arr) => arr.indexOf(x) === i);
const range = (a, b) => Array.from({length:b - a + 1}, (_, i) => a + i);
const E = (t, c) => G.eq(t, c);
const card = (t, c) => `<div class="mtcard" style="--c:${c || '#2563eb'};padding:10px 16px;font-size:1.2rem">${t}</div>`;
const seqTxt = (a, d, n, hide) => range(0, n - 1).map(k => k === hide ? '☐' : a + k * d);

/* ======================================================================
   Mønstre som vokser (KM13262)
   ====================================================================== */
const stairsN = n => n * (n + 1) / 2;
MT.module({
  id:'vekstmoenster', rek:168, trinn:[4], maal:['KM13262'], tittel:'Mønstre som vokser', ikon:'🌱', bygger:['moenster-gjentar', 'telle-fram-bak', 'hopptelling'],
  video:[
   {html:title('🌱', 'Mønstre som vokser', S.sub('Finn regelen og se langt fram', 1.2)),
    no:'Noen mønstre gjentar seg, men andre vokser. Hver figur er litt større enn den forrige. I dag skal vi utforske slike mønstre og finne regelen som styrer dem.'},
   {html:sc(S.row(S.pop(G.sticks(1), .2), S.pop(G.sticks(2), 1), S.pop(G.sticks(3), 1.8)), S.row(S.pop(E('4', '#ea580c'), 2.6), S.pop(E('7', '#ea580c'), 3), S.pop(E('10', '#ea580c'), 3.4)), S.sub('Hver ny firkant gir 3 pinner mer', 4.2)),
    no:'Her er firkanter laget av fyrstikker. Én firkant trenger fire pinner. To firkanter trenger syv. Tre firkanter trenger ti. Hver gang vi legger til en firkant, trenger vi tre nye pinner. Regelen er: legg til tre.'},
   {html:sc(S.row(S.pop(E('4, 7, 10, 13, 16, …', '#16a34a'), .2)), S.sub('Figur 5 har 16 pinner', 1.4), S.row(S.pop(G.sticks(5), 2.2))),
    no:'Med regelen kan vi regne ut neste figur uten å tegne den. Fire, sju, ti, tretten, seksten. Figur fem har seksten pinner. Vi sjekker ved å telle: det stemmer.'},
   {html:sc(S.row(S.pop(G.stairs(1), .2), S.pop(G.stairs(2), 1), S.pop(G.stairs(3), 1.8), S.pop(G.stairs(4), 2.6)), S.row(S.pop(E('1, 3, 6, 10, …', '#2563eb'), 3.6)), S.sub('Legg til 2, så 3, så 4 …', 4.4)),
    no:'Her er en trapp av prikker. Én prikk, tre prikker, seks prikker, ti prikker. Her er regelen litt annerledes: først legger vi til to, så tre, så fire. Det økende hoppet er også en regel.'},
   {html:sc(S.row(S.pop(E('2 → 4 → 8 → 16 → 32', '#9333ea'), .2)), S.sub('Dobling: gang med 2 hver gang', 1.4)),
    no:'Noen mønstre dobler seg. To, fire, åtte, seksten, trettito. Hver gang ganger vi med to. Slike mønstre vokser veldig raskt.'},
   {html:sc(S.row(S.pop(card('Mønsteret starter på 3 og øker med 4 hver gang. Hva er nummer 10?', '#2563eb'), .2)), S.row(S.pop(E('3 + 9 × 4 = 39', '#16a34a'), 1.6)), S.sub('Nummer 10 = start + 9 hopp', 2.6)),
    no:'Vi kan også hoppe langt fram. Mønsteret starter på tre og øker med fire. Hva er nummer ti? Fra nummer én til nummer ti er det ni hopp. Ni ganger fire er trettiseks, og tre pluss trettiseks er trettini.'},
   {html:sc(S.big('Finn regelen – bruk regelen', .2), S.sub('Nå øver vi!', 1.4)),
    no:'Husk: finn ut hvor mye mønsteret øker hver gang, og bruk regelen til å finne det du trenger. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal beskrive og utforske <b>mønstre</b> som vokser, og bruke regler til å finne hva som kommer.',
   steg:['Et <b>vekstmønster</b> blir større for hver figur.', 'Finn hvor mye som <b>legges til</b> hver gang (hopplengden).', 'Skriv regelen: «start på 4, legg til 3».', 'Bruk regelen til å finne neste figur uten å tegne.', 'Figur nummer n: start + (n − 1) hopp. Nummer 10 = start + 9 × hopplengden.', 'Noen mønstre dobler: ×2 hver gang.'],
   eks:[G.sticks(1, {s:22}) + ' ' + G.sticks(2, {s:22}) + ' ' + G.sticks(3, {s:22}) + '<br>4, 7, 10, … → legg til 3', G.stairs(3, {s:18}) + '<br>1, 3, 6, 10, … → legg til 2, 3, 4, …'],
   ord:[['vekstmønster', 'et mønster som blir større'], ['regel', 'beskriver hva som skjer hver gang'], ['dobling', 'å gange med 2']],
   feil:['«4, 7, 10: legg til 4» – fra 4 til 7 er det 3.', '«Figur 10 har 10 × 3 pinner» – husk startverdien: 3 × 10 + 1 = 31.'],
   laerer:'KM13262 (første del): strukturer og mønstre. Fokuser på å se og beskrive regelen med egne ord før en formel. De to modulene i denne gruppen («Mønstre som vokser» og «Mønstre i spill») bygger videre på «Mønster: den delen som gjentar seg» fra 1.–2. trinn.'
  },
  refleksjon:'Lag ditt eget vekstmønster med klosser eller tegning. Hva er regelen?',
  nivaaer:[
   {t:'Forstå: hva er et vekstmønster?', d:'Sjekk at du har forstått.', kind:'forstaa', make:(r, i) => {
     const k = i % 6, a = int(r, 2, 9), d = int(r, 2, 6);
     if(k === 0) return Q.yn('Blir figurene i et vekstmønster større og større?', true, {expl:'Ja. Det er det som kalles et vekstmønster.'});
     if(k === 1) return Q.choice(r, `I ${a}, ${a + d}, ${a + 2 * d}, ${a + 3 * d}: hva legger vi til hver gang?`, d, [d + 1, d + 2, a].filter(x => x !== d), {sort:true, nums:true, expl:`${a + d} − ${a} = ${d}.`});
     if(k === 2) return Q.yn('Kan du bruke en regel til å finne figur 20 uten å tegne alle de andre?', true, {expl:'Ja. Regelen sier hva som skjer hver gang.'});
     if(k === 3) return Q.choice(r, 'Hva gjør en dobling?', 'Ganger med 2', ['Legger til 2', 'Trekker fra 2', 'Deler på 2'], {keep:true, expl:'Dobbelt er to ganger så mye.'});
     if(k === 4) return Q.yn(`Er 1, 3, 6, 10 et mønster der vi legger til like mye hver gang?`, false, {expl:'Nei. Vi legger til 2, så 3, så 4: hoppet vokser.'});
     return Q.choice(r, 'Hva kaller vi det som styrer hva som skjer i et mønster?', 'En regel', ['Et tall', 'En farge', 'En tegning'], {keep:true, expl:'Regelen beskriver hva som skjer hver gang.'});
   }},
   {t:'Tallrekker: finn neste', d:'Hva legger vi til?', n:12, make:(r, i) => {
     const d = int(r, 2, i > 6 ? 12 : 8), a = int(r, 1, 30), seq = seqTxt(a, d, 4);
     if(i % 3 === 0) return Q.num(`${seq.join(', ')}, … Hva er neste tall? {?}`, a + 4 * d, {say:`${seq.join(', ')}. Hva er neste tall?`, calc:`${a}+${4 * d}`, hint:`Finn hvor mye det øker hver gang: ${a + d} − ${a}.`, expl:`Det øker med ${d} hver gang. ${a + 3 * d} + ${d} = ${a + 4 * d}.`});
     if(i % 3 === 1) return Q.num(`${seq.join(', ')}, … Hvor mye legger vi til hver gang? {?}`, d, {say:`${seq.join(', ')}. Hvor mye legger vi til hver gang?`, calc:`${a + d}-${a}`, expl:`${a + d} − ${a} = ${d}.`});
     const hole = int(r, 1, 3), s2 = seqTxt(a, d, 5, hole); return Q.num(`${s2.join(', ')}. Hvilket tall mangler? {?}`, a + hole * d, {say:`${s2.join(', ').replace('☐', 'hva')}. Hvilket tall mangler?`, calc:`${a}+${hole * d}`, expl:`Det øker med ${d} hver gang, så det manglende tallet er ${a + hole * d}.`});
   }},
   {t:'Fyrstikkfirkanter', d:'Pinner i figurene.', n:10, make:(r, i) => {
     const k = i % 4, n = int(r, 4, 9);
     if(k === 0) return Q.num(`${G.sticks(1)} ${G.sticks(2)} ${G.sticks(3)}<br>Figur 1 har 4 pinner, figur 2 har 7 og figur 3 har 10. Hvor mange pinner har figur 4? {?}`, 13, {say:'Figur 1 har 4 pinner, figur 2 har 7 og figur 3 har 10. Hvor mange pinner har figur 4?', calc:'10+3', expl:'Det legges til 3 pinner for hver nye firkant: 10 + 3 = 13.'});
     if(k === 1) return Q.num(`Det er ${n} firkanter på rad laget av fyrstikker. Hver ny firkant trenger 3 nye pinner, og den første trenger 4. Hvor mange pinner trengs? {?}`, 3 * n + 1, {say:`Det er ${n} firkanter på rad laget av fyrstikker. Hver ny firkant trenger 3 nye pinner, og den første trenger 4. Hvor mange pinner trengs?`, calc:`3*${n}+1`, hint:`Første firkant: 4. Så ${n - 1} firkanter til med 3 pinner hver.`, expl:`4 + ${n - 1} × 3 = ${3 * n + 1}.`});
     if(k === 2) return Q.num(`${G.sticks(n > 6 ? 6 : n)}<br>Hvor mange pinner trengs for ${n > 6 ? 6 : n} firkanter? {?}`, 3 * (n > 6 ? 6 : n) + 1, {say:`Hvor mange pinner trengs for ${n > 6 ? 6 : n} firkanter?`, calc:`3*${n > 6 ? 6 : n}+1`, expl:`Tre pinner per firkant og en ekstra til første: 3 × ${n > 6 ? 6 : n} + 1 = ${3 * (n > 6 ? 6 : n) + 1}.`});
     return Q.num(`Du har ${3 * n + 1} pinner. Hvor mange firkanter på rad kan du lage? {?}`, n, {say:`Du har ${3 * n + 1} pinner. Hvor mange firkanter på rad kan du lage?`, chk:`3 * _ + 1 === ${3 * n + 1}`, hint:'Trekk fra 1, og del på 3.', expl:`${3 * n + 1} − 1 = ${3 * n}, og ${3 * n} ÷ 3 = ${n}.`});
   }},
   {t:'Tårn og trapper', d:'Klosser og prikker som vokser.', n:10, make:(r, i) => {
     const k = i % 4, n = int(r, 4, 7);
     if(k === 0) return Q.num(`${G.stairs(1)} ${G.stairs(2)} ${G.stairs(3)} ${G.stairs(4)}<br>Trapp 1 har 1 prikk, trapp 2 har 3, trapp 3 har 6 og trapp 4 har 10. Hvor mange prikker har trapp 5? {?}`, 15, {say:'Trapp 1 har 1 prikk, trapp 2 har 3, trapp 3 har 6 og trapp 4 har 10. Hvor mange prikker har trapp 5?', calc:'10+5', expl:'Vi legger til 2, 3, 4, så 5: 10 + 5 = 15.'});
     if(k === 1) return Q.num(`${G.tower(3)}<br>Tårnet har 2 klosser på hvert lag. Hvor mange klosser er det i et tårn med ${n} lag? {?}`, 2 * n, {say:`Tårnet har to klosser på hvert lag. Hvor mange klosser er det i et tårn med ${n} lag?`, calc:`2*${n}`, expl:`${n} lag med 2 klosser: 2 × ${n} = ${2 * n}.`});
     if(k === 2) return Q.num(`${G.stairs(n > 6 ? 6 : n)}<br>Hvor mange prikker er det i trappen? {?}`, stairsN(n > 6 ? 6 : n), {say:'Hvor mange prikker er det i trappen?', hint:'Tell rad for rad: 1, 2, 3 …', expl:`${range(1, n > 6 ? 6 : n).join(' + ')} = ${stairsN(n > 6 ? 6 : n)}.`});
     const t = int(r, 3, 8); return Q.num(`${G.tower(t, {w:3})}<br>Tårnet har 3 klosser på hvert lag og ${t} lag. Hvor mange klosser er det? {?}`, 3 * t, {say:`Tårnet har tre klosser på hvert lag og ${t} lag. Hvor mange klosser er det?`, calc:`3*${t}`, expl:`3 × ${t} = ${3 * t}.`});
   }},
   {t:'Forklar regelen', d:'Hvilken regel passer?', n:10, make:(r, i) => {
     const a = int(r, 2, 8), d = int(r, 2, 7), dbl = i % 3 === 2;
     if(dbl){ const s = [a, a * 2, a * 4, a * 8]; return Q.choice(r, `${s.join(', ')}, … Hvilken regel passer?`, 'Gang med 2', [`Legg til ${a}`, `Legg til ${a * 2}`, 'Legg til 2'], {say:`${s.join(', ')}. Hvilken regel passer?`, expl:`${s[1]} er ${a} × 2, ${s[2]} er ${s[1]} × 2 og så videre.`}); }
     const s = [a, a + d, a + 2 * d, a + 3 * d]; return Q.choice(r, `${s.join(', ')}, … Hvilken regel passer?`, `Legg til ${d}`, [`Legg til ${d + 1}`, `Gang med ${d}`, `Legg til ${a}`].filter(x => x !== `Legg til ${d}`), {say:`${s.join(', ')}. Hvilken regel passer?`, expl:`${s[1]} − ${s[0]} = ${d}, og det er likt hver gang.`});
   }},
   {t:'Hopp langt fram', d:'Hva er nummer 10?', n:10, make:(r, i) => {
     const a = int(r, 1, 12), d = int(r, 2, 9), n = pick(r, [6, 8, 10, 12, 15, 20]), v = a + (n - 1) * d;
     if(i % 2 === 0) return Q.num(`Et mønster starter på ${a} og øker med ${d} hver gang. Hva er tall nummer ${n}? {?}`, v, {say:`Et mønster starter på ${a} og øker med ${d} hver gang. Hva er tall nummer ${n}?`, calc:`${a}+${n - 1}*${d}`, hint:`Fra tall 1 til tall ${n} er det ${n - 1} hopp.`, expl:`${n - 1} hopp à ${d} er ${(n - 1) * d}. ${a} + ${(n - 1) * d} = ${v}.`});
     return Q.num(`Et mønster starter på ${a} og øker med ${d} hver gang. Hvilket tall nummer er ${v}? {?}`, n, {say:`Et mønster starter på ${a} og øker med ${d} hver gang. Hvilket tall nummer er ${v}?`, chk:`${a} + (_ - 1) * ${d} === ${v}`, hint:'Trekk fra startverdien og del på hoppet. Legg til 1.', expl:`${v} − ${a} = ${(n - 1) * d}, ${(n - 1) * d} ÷ ${d} = ${n - 1} hopp, så det er tall nummer ${n}.`});
   }}
  ],
  drill:{tittel:'Neste tall i rekken', layout:'row', cols:2, n:[28, 20], make:(r, i, hard) => {
    const d = hard ? int(r, 3, 12) : pick(r, [2, 3, 4, 5, 10]), a = int(r, 0, hard ? 40 : 20), s = [a, a + d, a + 2 * d, a + 3 * d];
    return {t:`${s.join(', ')}, ☐`, ans:a + 4 * d}; }}
});

/* ======================================================================
   Mønstre i spill og lek (KM13262)
   ====================================================================== */
const DICE = {2:1, 3:2, 4:3, 5:4, 6:5, 7:6, 8:5, 9:4, 10:3, 11:2, 12:1};
MT.module({
  id:'spill-strategi', rek:170, trinn:[4], maal:['KM13262'], tittel:'Mønstre i spill: finn vinnerstrategien', ikon:'🎲', bygger:['vekstmoenster', 'dobling-halvering'],
  video:[
   {html:title('🎲', 'Mønstre i spill', S.sub('Se mønsteret og vinn oftere', 1.2)),
    no:'I mange spill finnes det mønstre. Hvis du ser mønsteret, kan du spille smartere. I dag utforsker vi mønstre på terninger, brett, kort og i et strategispill.'},
   {html:sc(S.row(S.pop(E('1 og 6', '#2563eb'), .2), S.pop(E('2 og 5', '#2563eb'), .8), S.pop(E('3 og 4', '#2563eb'), 1.4)), S.sub('På en terning er motsatte sider alltid 7 til sammen', 2.4)),
    no:'Se på en vanlig terning. Ett og seks er på motsatte sider. To og fem også. Og tre og fire. Hvert par blir sju til sammen. Det er et mønster.'},
   {html:sc(S.row(S.pop(E('7: 6 måter', '#16a34a'), .2), S.pop(E('6: 5 måter', '#f97316'), .8), S.pop(E('2: 1 måte', '#dc2626'), 1.4)), S.sub('To terninger: summen 7 er lettest å få', 2.4)),
    no:'Kaster du to terninger, kan du få sum mellom to og tolv. Men noen summer er lettere. Sju kan du få på seks måter. Seks på fem måter. To bare på én måte, to ener. Derfor er sju den vanligste summen.'},
   {html:sc(S.row(S.pop(E('8 × 8 = 64 ruter', '#2563eb'), .2), S.pop(E('64 ÷ 2 = 32 svarte', '#16a34a'), 1.2)), S.sub('Sjakkbrett: annenhver rute er svart', 2.2)),
    no:'Et sjakkbrett har åtte rader med åtte ruter. Det er seksti fire ruter. Annenhver rute er svart, så det er tretti to svarte og tretti to hvite.'},
   {html:sc(S.row(S.pop(card('Nim: 9 pinner. Ta 1, 2 eller 3. Den som tar siste pinne, vinner.', '#2563eb'), .2)), S.sub('Mål: la motstanderen sitte igjen med 4, 8, 12 …', 1.6)),
    no:'Nå et strategispill. Det ligger ni pinner. Vi tar en, to eller tre pinner om gangen. Den som tar den siste pinnen, vinner. Det finnes en vinnerstrategi.'},
   {html:sc(S.row(S.pop(E('Rest 4 = taper', '#dc2626'), .2), S.pop(E('Rest 8 = taper', '#dc2626'), .9), S.pop(E('Rest 12 = taper', '#dc2626'), 1.6)), S.sub('Etter ditt trekk: la det bli 4, 8 eller 12 igjen', 2.6)),
    no:'Hvis det er fire pinner igjen og det er din tur, taper du: uansett hvor mange du tar, tar motstanderen resten. Det samme gjelder åtte og tolv. Målet er å la motstanderen sitte igjen med fire, åtte, tolv og så videre.'},
   {html:sc(S.row(S.pop(E('9 ÷ 4 = 2 rest 1', '#16a34a'), .2)), S.sub('Ta 1 pinne først – da blir det 8 igjen', 1.4)),
    no:'Ni delt på fire er to, rest en. Resten er hvor mange vi skal ta først: én pinne. Da er det åtte igjen. Så tar vi alltid fire minus det motstanderen tar.'},
   {html:sc(S.big('Se mønsteret – vinn spillet', .2), S.sub('Nå øver vi!', 1.4)),
    no:'Husk: se etter mønstre i spill. De hjelper deg å regne ut hva som er smart. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal <b>beskrive og utforske strukturer og mønstre</b> i lek og spill.',
   steg:['På en terning er motsatte sider <b>7 til sammen</b>: 1–6, 2–5, 3–4.', 'Med to terninger er summen <b>7</b> vanligst (6 måter). 2 og 12 er sjeldnest (1 måte).', 'Et sjakkbrett har 8 × 8 = 64 ruter, og annenhver rute er svart.', 'I <b>Nim</b> (ta 1, 2 eller 3, siste pinne vinner) skal du la motstanderen sitte igjen med <b>4, 8, 12 …</b> pinner.', 'Finn ut hvor mange du skal ta først: rest etter å dele på 4.', 'Er antall delelig med 4 fra start, taper den som begynner (hvis motstanderen spiller smart).'],
   eks:['9 pinner: ta 1 → 8 igjen. Motstanderen tar x, du tar 4 − x.', 'Sum 7 med to terninger: 1+6, 2+5, 3+4, 4+3, 5+2, 6+1 → 6 måter.'],
   ord:[['strategi', 'en plan for å vinne et spill'], ['mønster', 'noe som gjentar seg eller følger en regel'], ['rest', 'det som blir til overs i en deling']],
   feil:['«Alle summer er like lette å få» – 7 er lettest med to terninger.', '«Det er bare flaks» – i Nim kan du vinne hver gang hvis du ser mønsteret.'],
   laerer:'KM13262 (andre del): strukturer og mønstre i lek og spill. Nim er velegnet til å spille i par før elevene får oppgavene: la dem først gjette strategien selv. Terningsummer kan utforskes konkret ved å kaste mange ganger og føre strekliste.'
  },
  refleksjon:'Spill Nim med en venn (15 pinner, ta 1–3). Hva legger du merke til?',
  nivaaer:[
   {t:'Forstå: mønstre i spill', d:'Sjekk at du har forstått.', kind:'forstaa', make:(r, i) => {
     const k = i % 6;
     if(k === 0) return Q.yn('Er det mønstre i mange spill?', true, {expl:'Ja. Å se mønstre hjelper deg å spille smartere.'});
     if(k === 1) return Q.choice(r, 'Hva er summen av øyne på to motsatte sider av en vanlig terning?', '7', ['6', '8', '12'], {keep:true, expl:'1+6, 2+5 og 3+4 gir alle 7.'});
     if(k === 2) return Q.choice(r, 'Hvilken sum er lettest å få med to terninger?', '7', ['2', '12', '3'], {keep:true, expl:'Sum 7 kan komme på 6 måter. 2 og 12 bare på én måte.'});
     if(k === 3) return Q.yn('Kan du vinne Nim hver gang hvis du kjenner strategien?', true, {expl:'Ja, hvis det ikke er delelig med 4 fra start og du begynner.'});
     if(k === 4) return Q.yn('Er et sjakkbrett 8 × 8 ruter?', true, {expl:'Ja: 64 ruter, 32 svarte og 32 hvite.'});
     return Q.choice(r, 'Hva kaller vi en plan for å vinne et spill?', 'En strategi', ['En kopi', 'En tegning', 'En regel om fusk'], {keep:true, expl:'En strategi er en plan for å vinne.'});
   }},
   {t:'Terninger', d:'Mønstre i øyne og summer.', n:12, make:(r, i) => {
     const k = i % 3;
     if(k === 0){ const x = int(r, 1, 6); return Q.num(`Motsatte sider på en terning er 7 til sammen. Hva er på motsatt side av ${x}? {?}`, 7 - x, {say:`Motsatte sider på en terning er sju til sammen. Hva er på motsatt side av ${x}?`, calc:`7-${x}`, expl:`7 − ${x} = ${7 - x}.`}); }
     if(k === 1){ const s = int(r, 2, 12); return Q.num(`Du kaster to terninger. På hvor mange måter kan du få summen ${s}? {?}`, DICE[s], {say:`Du kaster to terninger. På hvor mange måter kan du få summen ${s}?`, hint:`Skriv opp: ${s <= 7 ? '1 + ' + (s - 1) : '6 + ' + (s - 6)} …`, expl:`Antall måter å få summen ${s} er ${DICE[s]}.`}); }
     return Q.num(`En terning har øynene 1, 2, 3, 4, 5 og 6. Hvor mange øyne er det på terningen til sammen? {?}`, 21, {say:'En terning har øynene 1, 2, 3, 4, 5 og 6. Hvor mange øyne er det på terningen til sammen?', calc:'1+2+3+4+5+6', expl:'1 + 2 + 3 + 4 + 5 + 6 = 21. Eller: tre par à 7 = 21.'});
   }},
   {t:'Brett og kort', d:'Rutemønstre og kortstokk.', n:10, make:(r, i) => {
     const k = i % 4, n = pick(r, [4, 6, 8, 10]);
     if(k === 0) return Q.num(`Et sjakkbrett har ${n} rader med ${n} ruter. Hvor mange ruter er det? {?}`, n * n, {say:`Et sjakkbrett har ${n} rader med ${n} ruter. Hvor mange ruter er det?`, calc:`${n}*${n}`, expl:`${n} × ${n} = ${n * n}.`});
     if(k === 1) return Q.num(`Et sjakkbrett har ${n} × ${n} ruter, og annenhver rute er svart. Hvor mange er svarte? {?}`, n * n / 2, {say:`Et sjakkbrett har ${n} ganger ${n} ruter, og annenhver rute er svart. Hvor mange er svarte?`, calc:`${n * n}/2`, expl:`${n * n} ÷ 2 = ${n * n / 2}.`});
     if(k === 2) return Q.num(`En kortstokk har 4 farger med 13 kort i hver. Hvor mange kort er det? {?}`, 52, {say:'En kortstokk har fire farger med tretten kort i hver. Hvor mange kort er det?', calc:'4*13', expl:'4 × 13 = 52.'});
     const c = pick(r, [2, 3, 5, 6]); return Q.num(`I et spill får hver av ${c} spillere 7 kort. Hvor mange kort deles ut? {?}`, c * 7, {say:`I et spill får hver av ${c} spillere sju kort. Hvor mange kort deles ut?`, calc:`${c}*7`, expl:`${c} × 7 = ${c * 7}.`});
   }},
   {t:'Nim: hvor mange skal du ta?', d:'Du begynner. La motstanderen sitte igjen med 4, 8, 12 …', n:10, make:(r, i) => {
     const m = i < 6 ? 3 : pick(r, [2, 4]), base = m + 1; let N = int(r, base + 1, base * 4); if(N % base === 0) N += 1; const take = N % base;
     return Q.num(`Det er ${N} pinner. Dere tar 1 til ${m} pinner om gangen, og den som tar siste pinne vinner. Du begynner. Hvor mange pinner skal du ta? {?}`, take, {say:`Det er ${N} pinner. Dere tar en til ${m} pinner om gangen, og den som tar siste pinne vinner. Du begynner. Hvor mange pinner skal du ta?`, chk:`_ === ${N} % ${base}`, hint:`Del ${N} på ${base} og se på resten.`, expl:`${N} ÷ ${base} gir rest ${take}. Ta ${take}, så er det ${N - take} igjen (${base} går opp i det). Så tar du alltid ${base} minus det motstanderen tar.`});
   }},
   {t:'Nim: hvem vinner?', d:'Se på resten.', n:10, make:(r, i) => {
     const m = pick(r, [2, 3, 3, 4]), base = m + 1;
     if(i % 2 === 0){ const N = base * int(r, 2, 5); return Q.choice(r, `Det er ${N} pinner. Dere tar 1 til ${m} pinner om gangen, og den som tar siste pinne vinner. Begge spiller smart. Hvem vinner?`, 'Den andre spilleren', ['Den som begynner', 'Ingen'], {keep:true, say:`Det er ${N} pinner. Dere tar en til ${m} pinner om gangen, og den som tar siste pinne vinner. Begge spiller smart. Hvem vinner?`, expl:`${N} er delelig med ${base}. Den som begynner kan ikke unngå å la den andre ta siste pinne.`}); }
     let N = int(r, base + 1, base * 5); if(N % base === 0) N += 1;
     return Q.choice(r, `Det er ${N} pinner. Dere tar 1 til ${m} pinner om gangen, og den som tar siste pinne vinner. Begge spiller smart. Hvem vinner?`, 'Den som begynner', ['Den andre spilleren', 'Ingen'], {keep:true, say:`Det er ${N} pinner. Dere tar en til ${m} pinner om gangen, og den som tar siste pinne vinner. Begge spiller smart. Hvem vinner?`, expl:`${N} er ikke delelig med ${base}. Den som begynner tar ${N % base} og er da alltid i front.`});
   }}
  ]
});

/* ======================================================================
   Enkel «programmeringsmaskin» for algoritmene: linjer med to mellomrom innrykk
   ====================================================================== */
const indentOf = l => Math.floor((l.length - l.trimStart().length) / 2);
const parse = (lines, from, ind) => {
  const out = []; let i = from;
  while(i < lines.length){
    const ln = lines[i], d = indentOf(ln), t = ln.trim();
    if(d < ind) break;
    let m;
    if((m = t.match(/^gjenta (\d+) ganger:$/))){ const b = parse(lines, i + 1, d + 1); out.push({t:'rep', n:+m[1], body:b.out}); i = b.next; continue; }
    if((m = t.match(/^hvis (\w+) (>|<|=|er partall|er oddetall)\s*(\d*):$/))){ const th = parse(lines, i + 1, d + 1); let el = []; i = th.next;
      if(i < lines.length && indentOf(lines[i]) === d && lines[i].trim() === 'ellers:'){ const e = parse(lines, i + 1, d + 1); el = e.out; i = e.next; }
      out.push({t:'if', v:m[1], op:m[2], n:+m[3], then:th.out, els:el}); continue; }
    if((m = t.match(/^sett (\w+) til (\d+)$/))) out.push({t:'set', v:m[1], n:+m[2]});
    else if((m = t.match(/^legg til (\d+) i (\w+)$/))) out.push({t:'add', v:m[2], n:+m[1]});
    else if((m = t.match(/^ta bort (\d+) fra (\w+)$/))) out.push({t:'sub', v:m[2], n:+m[1]});
    else if((m = t.match(/^skriv (\w+)$/))) out.push({t:'say', e:m[1]});
    else if(t === 'frem') out.push({t:'fwd'});
    else if(t === 'snu høyre') out.push({t:'turn', k:1});
    else if(t === 'snu venstre') out.push({t:'turn', k:3});
    else throw new Error('ukjent linje: ' + t);
    i++;
  }
  return {out, next:i};
};
const runProg = (lines, st) => {
  const prog = parse(lines, 0, 0).out; st = Object.assign({vars:{}, said:[], x:0, y:0, d:0, steps:0, path:[]}, st || {}); st.path = [[st.x, st.y]];
  const D = [[1, 0], [0, 1], [-1, 0], [0, -1]], run = ss => ss.forEach(s => {
    if(s.t === 'rep') for(let k = 0; k < s.n; k++) run(s.body);
    else if(s.t === 'if'){ const v = st.vars[s.v]; const c = s.op === '>' ? v > s.n : s.op === '<' ? v < s.n : s.op === '=' ? v === s.n : s.op === 'er partall' ? v % 2 === 0 : v % 2 === 1; run(c ? s.then : s.els); }
    else if(s.t === 'set') st.vars[s.v] = s.n; else if(s.t === 'add') st.vars[s.v] += s.n; else if(s.t === 'sub') st.vars[s.v] -= s.n;
    else if(s.t === 'say') st.said.push(/^\d+$/.test(s.e) ? +s.e : st.vars[s.e]);
    else if(s.t === 'fwd'){ st.x += D[st.d][0]; st.y += D[st.d][1]; st.steps++; st.path.push([st.x, st.y]); }
    else if(s.t === 'turn') st.d = (st.d + s.k) % 4;
  });
  run(prog); return st;
};
const inGrid = (st, w, h) => st.path.every(p => p[0] >= 0 && p[0] < w && p[1] >= 0 && p[1] < h);
MT.runProg = runProg;

/* ======================================================================
   Algoritmer med løkker (KM13263)
   ====================================================================== */
const robotProg = (r, level) => {
  for(let t = 0; t < 400; t++){
    const n = int(r, 2, 5), m = int(r, 1, 3), k = level < 2 ? 0 : int(r, 0, 4); let lines;
    if(k === 0) lines = [`gjenta ${n} ganger:`, '  frem'];
    else if(k === 1) lines = ['frem', 'frem', 'snu høyre', `gjenta ${n} ganger:`, '  frem'];
    else if(k === 2) lines = [`gjenta ${m} ganger:`, '  frem', '  frem', '  snu høyre'];
    else if(k === 3) lines = [`gjenta ${n} ganger:`, '  frem', 'snu høyre', `gjenta ${m + 1} ganger:`, '  frem'];
    else lines = ['frem', 'snu høyre', `gjenta ${n - 1} ganger:`, '  frem', '  snu høyre', 'frem'];
    const sx = int(r, 0, 2), sy = int(r, 0, 2), st = runProg(lines, {x:sx, y:sy, d:0});
    if(inGrid(st, 6, 6) && st.steps >= 2) return {lines, st, sx, sy};
  }
  return {lines:['gjenta 3 ganger:', '  frem'], st:runProg(['gjenta 3 ganger:', '  frem'], {x:0, y:0}), sx:0, sy:0};
};
MT.module({
  id:'algoritmer-loekker', rek:172, trinn:[4], maal:['KM13263'], tittel:'Algoritmer og løkker: gjenta uten å skrive om igjen', ikon:'🔁', bygger:['instruksjoner', 'koordinat-instruksjoner'],
  video:[
   {html:title('🔁', 'Algoritmer og løkker', S.sub('Gjenta uten å skrive om igjen', 1.2)),
    no:'En algoritme er en trinnvis oppskrift som en maskin kan følge. I dag skal vi lage algoritmer med løkker. En løkke gjentar noe, så vi slipper å skrive det mange ganger.'},
   {html:sc(S.row(S.pop(G.robot({w:5, h:3, start:[0, 1], goal:[4, 1], path:[[0, 1], [1, 1], [2, 1], [3, 1], [4, 1]], cs:40}), .2)), S.row(S.pop(G.code(['frem', 'frem', 'frem', 'frem']), 1.2)), S.sub('Fire steg for å nå stjernen', 2.2)),
    no:'Roboten skal gå fire ruter til stjernen. Vi kan skrive frem fire ganger. Men det er mye å skrive om vi skal gå langt.'},
   {html:sc(S.row(S.pop(G.code(['gjenta 4 ganger:', '  frem']), .2)), S.sub('Løkken gjør det samme med to linjer', 1.4)),
    no:'Med en løkke blir det kortere. Gjenta fire ganger, frem. Linjen som er rykket inn, er det som gjentas.'},
   {html:sc(S.row(S.pop(G.code(['gjenta 3 ganger:', '  frem', '  snu høyre'], {hl:1}), .2)), S.sub('Alt som er rykket inn, gjentas hver gang', 1.6)),
    no:'Her gjentar vi to ting: frem og snu høyre, tre ganger. Alle linjene som er rykket inn, hører til løkken og kjøres hver gang.'},
   {html:sc(S.row(S.pop(G.robot({w:4, h:4, start:[0, 0], path:[[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2], [0, 1], [0, 0]], cs:42}), .2), S.pop(G.code(['gjenta 4 ganger:', '  frem', '  frem', '  snu høyre']), 1.4)), S.sub('En firkant: 4 × (2 steg og en sving)', 2.4)),
    no:'Med en løkke kan roboten gå i en firkant. Gjenta fire ganger: frem, frem, snu høyre. Det er to steg og en sving, fire ganger. Roboten kommer tilbake dit den startet.'},
   {html:sc(S.row(S.pop(E('4 × 2 = 8 steg', '#16a34a'), .2)), S.sub('Antall ganger × antall steg inni løkken', 1.4)),
    no:'Hvor mange steg går roboten til sammen? Løkken gjentas fire ganger, og i hver runde er det to steg. Fire ganger to er åtte steg.'},
   {html:sc(S.big('Én løkke i stedet for mange linjer', .2), S.sub('Nå øver vi!', 1.4)),
    no:'Husk: en løkke gjentar linjene som er rykket inn. Nå skal du øve på algoritmer med løkker!'}
  ],
  tekst:{
   mal:'Du skal <b>lage algoritmer</b> og uttrykke dem med <b>løkker</b>.',
   steg:['En <b>algoritme</b> er en trinnvis oppskrift som en maskin kan følge.', 'En <b>løkke</b> gjentar linjene som er rykket inn: «gjenta 4 ganger: frem».', 'Antall steg = antall ganger × antall steg inni løkken.', 'Pass på hva som er inni løkken, og hva som er utenfor.', 'Test algoritmen: følg den linje for linje, og sjekk at roboten ender der den skal.'],
   eks:[G.code(['gjenta 4 ganger:', '  frem', '  frem', '  snu høyre'])],
   ord:[['algoritme', 'trinnvis oppskrift for en maskin'], ['løkke', 'noe som gjentas flere ganger'], ['innrykk', 'linjer som er skjøvet inn og hører til løkken']],
   feil:['«Alle linjene gjentas» – bare de som er rykket inn.', '«gjenta 4 ganger: frem, frem betyr 4 steg» – det er 4 × 2 = 8 steg.'],
   laerer:'KM13263 (første del): lage algoritmer og uttrykke dem med løkker. Dette er ikke koding på skjerm, men «koding uten datamaskin»: elevene følger og skriver algoritmer på papir. Kan kombineres med gulv-robot (en elev er roboten). Variabler og vilkår kommer i neste modul.'
  },
  refleksjon:'Lag en algoritme med en løkke som får en venn til å gå i en firkant i klasserommet.',
  nivaaer:[
   {t:'Forstå: algoritmer og løkker', d:'Sjekk at du har forstått.', kind:'forstaa', make:(r, i) => {
     const k = i % 6, n = int(r, 3, 6);
     if(k === 0) return Q.choice(r, 'Hva er en algoritme?', 'En trinnvis oppskrift', ['Et tall', 'En tegning', 'Et regnetegn'], {keep:true, expl:'En algoritme er en oppskrift en maskin kan følge steg for steg.'});
     if(k === 1) return Q.yn('Gjentar en løkke noe flere ganger?', true, {expl:'Ja. Det er det en løkke gjør.'});
     if(k === 2) return Q.choice(r, 'Hvilke linjer gjentas i en løkke?', 'De som er rykket inn', ['Alle linjene', 'Den første linjen', 'Ingen'], {keep:true, expl:'Bare linjene som er rykket inn, hører til løkken.'});
     if(k === 3) return Q.yn(`Er «gjenta ${n} ganger: frem» kortere enn å skrive «frem» ${n} ganger?`, true, {expl:'Ja. To linjer i stedet for mange.'});
     if(k === 4) return Q.yn('Kan en løkke gjenta mer enn én ting?', true, {expl:'Ja. Alle linjene som er rykket inn, gjentas.'});
     return Q.choice(r, 'Hva betyr «snu høyre»?', 'Roboten svinger en kvart omgang med klokka', ['Roboten går fem steg', 'Roboten stopper', 'Roboten går bakover'], {keep:true, expl:'Snu høyre gir en rett vinkel til høyre.'});
   }},
   {t:'Hvor mange steg?', d:'Antall ganger × steg i løkken.', n:12, make:(r, i) => {
     const n = int(r, 2, 8), k = int(r, 1, 3), inside = Array.from({length:k}, () => '  frem'), extra = i % 3 === 2 ? [pick(r, ['frem', 'frem'])] : [];
     const lines = [`gjenta ${n} ganger:`].concat(inside).concat(i % 2 === 1 ? ['  snu høyre'] : []).concat(extra), st = runProg(lines, {x:20, y:20});
     return Q.num(`${G.code(lines)}<br>Hvor mange steg (frem) tar roboten til sammen? {?}`, st.steps, {say:'Hvor mange steg tar roboten til sammen?', hint:'Antall ganger i løkken ganger antall «frem» inni løkken. Husk det som står utenfor.', expl:`${n} ganger ${k} steg = ${n * k}${extra.length ? ', pluss ' + extra.length + ' steg etter løkken = ' + st.steps : ''}.`});
   }},
   {t:'Skriv med løkke', d:'Hvilket program gjør det samme?', n:10, make:(r, i) => {
     const n = int(r, 3, 9), k = i % 2 === 0 ? 1 : 2, seq = k === 1 ? 'frem' : 'frem, snu høyre', ok = `gjenta ${n} ganger: ${seq}`;
     const wrong = uniq([`gjenta ${n + 1} ganger: ${seq}`, `gjenta ${n} ganger: ${k === 1 ? 'snu høyre' : 'frem'}`, `${seq}, gjenta ${n} ganger`]).filter(x => x !== ok);
     const text = Array(n).fill(k === 1 ? 'frem' : 'frem, snu høyre').join(', ');
     return Q.choice(r, `Algoritmen er: ${text}.<br>Hvilket program med løkke gjør det samme?`, ok, wrong, {say:`Algoritmen er: ${text}. Hvilket program med løkke gjør det samme?`, expl:`${seq} skal gjentas ${n} ganger: ${ok}.`});
   }},
   {t:'Hvor ender roboten?', d:'Følg programmet. Start ser mot høyre.', n:10, make:(r, i) => {
     const p = robotProg(r, i < 3 ? 1 : 3), col = i < 3 ? true : i % 2 === 0;
     return Q.num(`${G.robot({w:6, h:6, start:[p.sx, p.sy], dir:'E', cs:36})}${G.code(p.lines)}<br>Roboten starter i kolonne ${p.sx}, rad ${p.sy} og ser mot høyre. Hvilken ${col ? 'kolonne' : 'rad'} ender den i? (Kolonnene teller fra 0 fra venstre, radene fra 0 ovenfra.) {?}`, col ? p.st.x : p.st.y, {say:`Roboten starter i kolonne ${p.sx}, rad ${p.sy} og ser mot høyre. Hvilken ${col ? 'kolonne' : 'rad'} ender den i?`, hint:'Følg programmet linje for linje. «Snu høyre»: fra høyre blir det ned.', expl:`Roboten ender i kolonne ${p.st.x}, rad ${p.st.y}.`});
   }},
   {t:'Fyll inn løkken', d:'Hvor mange ganger?', n:10, make:(r, i) => {
     const k = int(r, 1, 3), n = int(r, 2, 8), total = n * k;
     if(i % 2 === 0) return Q.num(`${G.code(['gjenta ☐ ganger:'].concat(Array(k).fill('  frem')))}<br>Roboten skal gå ${total} steg. Hvor mange ganger skal løkken gjentas? {?}`, n, {say:`Roboten skal gå ${total} steg. Hvor mange ganger skal løkken gjentas?`, chk:`_ * ${k} === ${total}`, hint:'Del antall steg på antall «frem» inni løkken.', expl:`${total} ÷ ${k} = ${n}.`});
     return Q.num(`Roboten går i en firkant: gjenta 4 ganger: frem ${k + 1} ganger, snu høyre. Hvor mange steg går den til sammen? {?}`, 4 * (k + 1), {say:`Roboten går i en firkant: gjenta fire ganger: frem ${k + 1} ganger, snu høyre. Hvor mange steg går den til sammen?`, calc:`4*${k + 1}`, expl:`4 × ${k + 1} = ${4 * (k + 1)}.`});
   }}
  ]
});

/* ======================================================================
   Variabler og vilkår (KM13263)
   ====================================================================== */
const VN = ['x', 'x', 'poeng', 'sum'];
MT.module({
  id:'algoritmer-variabler', rek:174, trinn:[4], maal:['KM13263'], tittel:'Variabler og vilkår: lagre og velg', ikon:'📦', bygger:['algoritmer-loekker', 'likevekt'],
  video:[
   {html:title('📦', 'Variabler og vilkår', S.sub('Lagre tall og ta valg', 1.2)),
    no:'I dag skal vi lage algoritmer som husker tall og tar valg. For å huske tall bruker vi variabler, og for å ta valg bruker vi vilkår.'},
   {html:sc(S.row(S.pop(E('x = 3', '#2563eb'), .2)), S.pop(G.code(['sett x til 3']), 1.2), S.sub('En variabel er en boks med navn som holder en verdi', 2.2)),
    no:'En variabel er som en boks med et navn. Her heter boksen x, og i den ligger tallet tre. Sett x til tre.'},
   {html:sc(S.row(S.pop(G.code(['sett x til 3', 'legg til 2 i x', 'skriv x']), .2)), S.row(S.pop(E('x = 3 → 5', '#16a34a'), 1.4)), S.sub('Verdien i boksen kan endres', 2.4)),
    no:'Verdien kan endres. Vi setter x til tre, og så legger vi til to. Nå ligger tallet fem i boksen. Når vi skriver x, kommer tallet fem.'},
   {html:sc(S.row(S.pop(G.code(['sett x til 0', 'gjenta 4 ganger:', '  legg til 3 i x', 'skriv x']), .2)), S.row(S.pop(E('0 → 3 → 6 → 9 → 12', '#16a34a'), 1.4)), S.sub('Variabel og løkke sammen: x blir 12', 2.4)),
    no:'Vi kan bruke variabel og løkke sammen. Vi starter på null og legger til tre, fire ganger. Verdien går fra null til tre, seks, ni og tolv. Programmet skriver tolv.'},
   {html:sc(S.row(S.pop(G.code(['sett x til 7', 'hvis x > 5:', '  skriv 1', 'ellers:', '  skriv 0']), .2)), S.row(S.pop(E('7 > 5 stemmer → skriver 1', '#16a34a'), 1.4)), S.sub('Vilkår: hvis det stemmer, gjør dette – ellers dette', 2.4)),
    no:'Nå et vilkår. Hvis x er større enn fem, skriver vi en, ellers skriver vi null. Her er x sju, og sju er større enn fem. Vilkåret stemmer, så programmet skriver en.'},
   {html:sc(S.row(S.pop(G.code(['sett x til 8', 'hvis x er partall:', '  legg til 1 i x', 'ellers:', '  legg til 2 i x']), .2)), S.row(S.pop(E('8 er partall → x blir 9', '#16a34a'), 1.4))),
    no:'Vilkår kan også sjekke partall. Hvis x er partall, legger vi til en, ellers legger vi til to. Åtte er partall, så vi legger til en, og x blir ni.'},
   {html:sc(S.big('Variabler husker, vilkår velger', .2), S.sub('Nå øver vi!', 1.4)),
    no:'Husk: en variabel husker et tall, og et vilkår velger hva som skjer. Følg programmet linje for linje. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal <b>lage algoritmer</b> og uttrykke dem med <b>variabler</b>, <b>vilkår</b> og løkker.',
   steg:['En <b>variabel</b> er en boks med navn som holder en verdi: «sett x til 3».', 'Verdien kan endres: «legg til 2 i x», «ta bort 1 fra x».', 'En <b>løkke</b> gjentar linjene som er rykket inn.', 'Et <b>vilkår</b> velger: «hvis x > 5: … ellers: …».', 'Følg programmet linje for linje, og skriv ned hva x er etter hver linje.'],
   eks:[G.code(['sett x til 0', 'gjenta 4 ganger:', '  legg til 3 i x', 'skriv x']) + '<br>Skriver 12', G.code(['sett x til 7', 'hvis x > 5:', '  skriv 1', 'ellers:', '  skriv 0']) + '<br>Skriver 1'],
   ord:[['variabel', 'en boks med navn som kan holde ulike verdier'], ['vilkår', 'et valg: hvis noe stemmer, gjør dette'], ['verdi', 'tallet som ligger i variabelen']],
   feil:['«x er alltid 3» – verdien kan endres underveis.', '«Både hvis- og ellers-delen kjøres» – bare én av dem.'],
   laerer:'KM13263 (andre del): algoritmer med variabler, vilkår og løkker. Kodespråket her er «pseudokode» på norsk, uavhengig av programmeringsspråk. Be elevene tegne boksen x og skrive verdien etter hver linje (sporing). Dette forbereder Scratch eller Python senere.'
  },
  refleksjon:'Lag en algoritme som begynner med x = 2 og ender med x = 14. Bruk gjerne en løkke.',
  nivaaer:[
   {t:'Forstå: variabel og vilkår', d:'Sjekk at du har forstått.', kind:'forstaa', make:(r, i) => {
     const k = i % 6, a = int(r, 2, 9);
     if(k === 0) return Q.choice(r, 'Hva er en variabel?', 'En boks med navn som holder en verdi', ['Et regnetegn', 'En løkke', 'Et tall som aldri endres'], {keep:true, expl:'Variabelen holder en verdi som kan endres.'});
     if(k === 1) return Q.num(`sett x til ${a}<br>legg til 2 i x<br>Hva er x nå? {?}`, a + 2, {say:`Sett x til ${a}. Legg til 2 i x. Hva er x nå?`, calc:`${a}+2`, expl:`${a} + 2 = ${a + 2}.`});
     if(k === 2) return Q.yn('Kan verdien i en variabel endres?', true, {expl:'Ja. Det er derfor den heter variabel.'});
     if(k === 3) return Q.choice(r, 'Hva gjør «hvis x > 5: … ellers: …»?', 'Velger hva som skal skje', ['Gjentar linjene', 'Sletter x', 'Skriver ut x'], {keep:true, expl:'Et vilkår velger mellom to veier.'});
     if(k === 4) return Q.yn('Kjøres både «hvis»-delen og «ellers»-delen hver gang?', false, {expl:'Nei. Bare én av dem kjøres.'});
     return Q.yn('Gjentar en løkke linjene som er rykket inn?', true, {expl:'Ja.'});
   }},
   {t:'Hva er x?', d:'Følg programmet linje for linje.', n:12, make:(r, i) => {
     const v = pick(r, VN), a = int(r, 2, 15), b = int(r, 1, 9), c = int(r, 1, 6); const lines = [`sett ${v} til ${a}`, `legg til ${b} i ${v}`], vals = [a, a + b];
     if(i % 3 === 1){ const t = Math.min(c, a + b - 1); lines.push(`ta bort ${t} fra ${v}`); vals.push(a + b - t); }
     if(i % 3 === 2){ lines.push(`legg til ${c} i ${v}`); vals.push(a + b + c); const t = Math.min(b, a + b + c); lines.push(`ta bort ${t} fra ${v}`); vals.push(a + b + c - t); }
     lines.push(`skriv ${v}`); const st = runProg(lines);
     return Q.num(`${G.code(lines)}<br>Hva skriver programmet? {?}`, st.said[0], {say:'Hva skriver programmet?', hint:`Skriv ned hva ${v} er etter hver linje.`, expl:`${v} blir: ${vals.join(' → ')}. Programmet skriver ${st.said[0]}.`});
   }},
   {t:'Variabel og løkke', d:'Legg til flere ganger.', n:12, make:(r, i) => {
     const a = int(r, 0, 10), n = int(r, 2, 8), d = int(r, 1, 6), minus = i % 3 === 2, v = pick(r, VN);
     const lines = [`sett ${v} til ${minus ? n * d + int(r, 0, 9) : a}`, `gjenta ${n} ganger:`, `  ${minus ? 'ta bort' : 'legg til'} ${d} ${minus ? 'fra' : 'i'} ${v}`, `skriv ${v}`], st = runProg(lines);
     return Q.num(`${G.code(lines)}<br>Hva skriver programmet? {?}`, st.said[0], {say:'Hva skriver programmet?', hint:`${minus ? 'Trekk' : 'Legg'} ${d} ${minus ? 'fra' : 'til'} ${n} ganger.`, expl:`${n} ganger ${d} er ${n * d}. ${minus ? 'Start − ' : 'Start + '}${n * d} gir ${st.said[0]}.`});
   }},
   {t:'Vilkår: hvis og ellers', d:'Hvilken vei velger programmet?', n:12, make:(r, i) => {
     const v = pick(r, VN), a = int(r, 2, 14), t = int(r, 4, 10), k = i % 3; let lines;
     if(k === 0) lines = [`sett ${v} til ${a}`, `hvis ${v} > ${t}:`, `  skriv ${v}`, 'ellers:', '  skriv 0'];
     else if(k === 1) lines = [`sett ${v} til ${a}`, `hvis ${v} er partall:`, `  legg til 1 i ${v}`, 'ellers:', `  legg til 2 i ${v}`, `skriv ${v}`];
     else lines = [`sett ${v} til ${a}`, `hvis ${v} < ${t}:`, `  legg til ${t} i ${v}`, 'ellers:', `  ta bort ${Math.min(t, a - 1)} fra ${v}`, `skriv ${v}`];
     const st = runProg(lines);
     return Q.num(`${G.code(lines)}<br>Hva skriver programmet? {?}`, st.said[0], {say:'Hva skriver programmet?', hint:'Sjekk først om vilkåret stemmer. Gå så inn i riktig del.', expl:`Svaret er ${st.said[0]}.`});
   }},
   {t:'Vilkår og løkke sammen', d:'Større programmer.', n:10, make:(r, i) => {
     const n = int(r, 3, 6), d = int(r, 1, 4), t = int(r, 6, 14), v = pick(r, VN);
     const lines = [`sett ${v} til 0`, `gjenta ${n} ganger:`, `  legg til ${d} i ${v}`, `hvis ${v} > ${t}:`, `  skriv ${v}`, 'ellers:', '  skriv 0'], st = runProg(lines);
     if(i % 2 === 0) return Q.num(`${G.code(lines)}<br>Hva skriver programmet? {?}`, st.said[0], {say:'Hva skriver programmet?', hint:`Først blir ${v} lik ${n * d}. Så sjekkes vilkåret.`, expl:`${v} blir ${n * d}. ${n * d} > ${t} ${n * d > t ? 'stemmer, så programmet skriver ' + v + ': ' + n * d : 'stemmer ikke, så programmet skriver 0'}.`});
     return Q.num(`${G.code(lines.slice(0, 3))}<br>Hva er ${v} etter løkken? {?}`, n * d, {say:`Hva er ${v} etter løkken?`, calc:`${n}*${d}`, expl:`${n} ganger ${d} = ${n * d}.`});
   }},
   {t:'Hvilket program?', d:'Finn programmet som gir riktig svar.', n:10, make:(r, i) => {
     const a = int(r, 1, 8), n = int(r, 2, 5), d = int(r, 2, 6), mk = (s, nn, dd) => [`sett x til ${s}`, `gjenta ${nn} ganger:`, `  legg til ${dd} i x`, 'skriv x'], target = runProg(mk(a, n, d)).said[0];
     const cands = [mk(a, n, d), mk(a, n + 1, d), mk(a + 1, n, d), mk(a, n, d + 1), mk(a, d, n)], opts = [], seen = new Set();
     cands.forEach((c, j) => { const val = runProg(c).said[0]; if(j === 0 || val !== target){ const txt = `sett x til ${c[0].split(' ')[3]}, gjenta ${c[1].split(' ')[1]} ganger: legg til ${c[2].trim().split(' ')[2]} i x`; if(!seen.has(txt)){ seen.add(txt); opts.push(txt); } } });
     const ok = opts[0]; return Q.choice(r, `Hvilket program skriver ${target}?`, ok, opts.slice(1, 4), {say:`Hvilket program skriver ${target}?`, expl:`${a} + ${n} × ${d} = ${target}.`});
   }}
  ]
});
})();
