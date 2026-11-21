(function(){
'use strict';
/* Moduler: partall/oddetall, tallinje, gruppering, tall i hverdagen (KM13231, KM13233, KM13228, KM13229) */
const A = window.App, MT = window.MT, G = MT.G, Q = MT.Q, S = MT.S, B = MT.B;
const {int, pick, shuf} = MT, {sc, pop, fade, big, sub, row, chip, title} = S;
const uniq = a => a.filter((x, i) => a.indexOf(x) === i);
const range = (a, b) => Array.from({length:b - a + 1}, (_, i) => a + i);

/* ======================================================================
   8. Partall og oddetall
   ====================================================================== */
const pairs = (n, e) => G.groups(Array.from({length:Math.ceil(n / 2)}, (_, i) => [e || '🧦', (i * 2 + 2 <= n) ? 2 : 1, 2]), {s:'1.6rem'});
MT.module({
  id:'partall-oddetall', rek:38, trinn:[1, 2], maal:['KM13231'], tittel:'Partall og oddetall', ikon:'🧦', bygger:['tall-11-20', 'legge-sammen'],
  video:[
   {html:title('🧦', 'Partall og oddetall', S.sub('Går det opp i par?', 1.2)),
    no:'Noen tall kan deles i par, og noen kan ikke. Nå skal vi utforske hva som er spesielt med partall og oddetall.'},
   {html:sc(S.pop(pairs(8), .2), S.sub('8 sokker: 4 par, ingen til overs', 1.6)),
    no:'Her er åtte sokker. Vi legger dem i par. Ett par, to par, tre par, fire par. Ingen sokker blir til overs. Da er åtte et partall.'},
   {html:sc(S.pop(pairs(7), .2), S.sub('7 sokker: 3 par og 1 til overs', 1.6)),
    no:'Her er sju sokker. Tre par, og én sokk blir alene. Én blir til overs. Da er sju et oddetall.'},
   {html:sc(S.row(S.pop(G.eq('Partall: ingen til overs', '#2563eb'), .2), S.pop(G.eq('Oddetall: én til overs', '#f97316'), 1.2)), S.sub('Partall kan deles likt i to', 2.4)),
    no:'Partall går opp i par, og kan deles likt i to. Oddetall har alltid én til overs, og kan ikke deles likt i to.'},
   {html:sc(G.grid({cs:26, to:40, hl:range(1, 40).filter(x => x % 2 === 0), hl2:range(1, 40).filter(x => x % 2 === 1)}), S.sub('Partall og oddetall veksler', 1.4)),
    no:'I tallrekka veksler de. Ett er et oddetall, to er et partall, tre er et oddetall, fire er et partall. Så fortsetter det. Null er også et partall.'},
   {html:sc(S.row(S.chip('2', '#2563eb', .2), S.chip('4', '#2563eb', .6), S.chip('6', '#2563eb', 1), S.chip('8', '#2563eb', 1.4), S.chip('0', '#2563eb', 1.8)), S.row(S.chip('1', '#f97316', 2.4), S.chip('3', '#f97316', 2.8), S.chip('5', '#f97316', 3.2), S.chip('7', '#f97316', 3.6), S.chip('9', '#f97316', 4)), S.sub('Se på sifferet helt til høyre', 5)),
    no:'Hvordan ser vi det på store tall? Se på sifferet helt til høyre. Slutter tallet på null, to, fire, seks eller åtte, er det et partall. Slutter det på en, tre, fem, sju eller ni, er det et oddetall. Trettiseks er partall. Førtisju er oddetall.'},
   {html:sc(S.row(S.pop(G.eq('partall + partall = partall', '#2563eb'), .2)), S.row(S.pop(G.eq('oddetall + oddetall = partall', '#16a34a'), 1.6)), S.row(S.pop(G.eq('partall + oddetall = oddetall', '#f97316'), 3)), S.sub('Se: 3 + 5 = 8', 4.4)),
    no:'Vi kan utforske hva som skjer når vi legger sammen. To partall gir et partall. To oddetall gir et partall, fordi de to som blir til overs, danner et par. Et partall og et oddetall gir et oddetall.'}
  ],
  tekst:{
   mal:'Du skal beskrive og utforske egenskapene til <b>partall</b> og <b>oddetall</b>.',
   steg:['Legg ting i par. Ingen til overs: <b>partall</b>. Én til overs: <b>oddetall</b>.', 'Se på sifferet <b>helt til høyre</b>: 0, 2, 4, 6, 8 er partall. 1, 3, 5, 7, 9 er oddetall.', 'Partall og oddetall <b>veksler</b> i tallrekka.', 'Utforsk: partall + partall = partall. Oddetall + oddetall = partall. Partall + oddetall = oddetall.'],
   eks:[pairs(6) + '<br>6 er partall (3 par)', pairs(5) + '<br>5 er oddetall (2 par og 1 til overs)'],
   ord:[['partall', 'tall som kan deles likt i to, 0, 2, 4, 6 …'], ['oddetall', 'tall som ikke kan deles likt i to, 1, 3, 5, 7 …'], ['par', 'to og to']],
   feil:['«0 er ikke et partall» – 0 går opp i par (ingen til overs), så 0 er et partall.', '«Sifferet foran avgjør» – det er sifferet helt til høyre (enersifferet) som avgjør.'],
   laerer:'KM13231 er et utforskende mål: barna skal beskrive egenskaper, ikke bare svare partall/oddetall. Bruk konkreter (sokker, kuler) til å vise «par og rest». La barna selv formulere og teste hypoteser om sum av partall og oddetall – og forklare hvorfor.'
  },
  refleksjon:'Hva skjer når du legger sammen to oddetall? Prøv noen eksempler og forklar hvorfor.',
  nivaaer:[
   {t:'Forstå: par og rest', d:'Sjekk at du har forstått partall og oddetall.', kind:'forstaa', make:(r, i) => {
     const k = i % 5, n = int(r, 3, 19);
     if(k === 0) return Q.choice(r, 'Hva betyr det at et tall er et partall?', 'Det kan deles i par uten noe til overs', ['Det er et stort tall', 'Det slutter på 5', 'Det kan ikke deles'], {expl:'Partall går opp i par: ingen blir til overs.'});
     if(k === 1) return Q.choice(r, 'Hvilket siffer avgjør om et tall er partall eller oddetall?', 'Sifferet helt til høyre', ['Sifferet helt til venstre', 'Alle sifrene til sammen', 'Det avgjør ikke noe siffer'], {expl:'Enersifferet (helt til høyre) avgjør: 0, 2, 4, 6, 8 → partall.'});
     if(k === 2) return Q.yn('Er 0 et partall?', true, {expl:'Ja. Null går opp i par uten rest.'});
     if(k === 3) return Q.yn(`${n} barn skal stille seg i par. Går det opp?`, n % 2 === 0, {expl:n % 2 ? `${n} er et oddetall. Ett barn blir alene.` : `${n} er et partall. Alle får en partner.`});
     return Q.choice(r, 'Hva skjer hvis du legger sammen to oddetall (for eksempel 3 + 5)?', 'Du får et partall', ['Du får et oddetall', 'Du får alltid 10', 'Det kommer an på'], {expl:'3 + 5 = 8. Hvert oddetall har én til overs, og de to som blir til overs danner et par.'});
   }},
   {t:'Par eller ikke?', d:'Partall eller oddetall: se på tegningen.', n:10, make:(r, i) => {
     const n = int(r, 1, 20), em = pick(r, ['🧦', '⭐', '🍎', '🐞', '🚗']);
     return Q.choice(r, `${pairs(n, em)}<br>Er det partall eller oddetall?`, n % 2 ? 'Oddetall' : 'Partall', ['Partall', 'Oddetall'], {keep:true, say:`Er det et partall eller et oddetall?`, expl:n % 2 ? `${Math.floor(n / 2)} par og 1 til overs: oddetall.` : `${n / 2} par og ingen til overs: partall.`});
   }},
   {t:'Partall og oddetall til 100', d:'Se på sifferet helt til høyre.', n:10, make:(r, i) => {
     const n = int(r, 11, 99), k = i % 2;
     if(k === 0) return Q.choice(r, `Er <b>${n}</b> et partall eller et oddetall?`, n % 2 ? 'Oddetall' : 'Partall', ['Partall', 'Oddetall'], {keep:true, say:`Er ${n} et partall eller et oddetall?`, expl:`${n} slutter på ${n % 10}, så det er et ${n % 2 ? 'oddetall' : 'partall'}.`});
     const ev = r() < .5, c = []; while(c.length < 3){ const x = int(r, 11, 99); if(x % 2 === (ev ? 1 : 0) && !c.includes(x)) c.push(x); } const ans = n % 2 === (ev ? 0 : 1) ? n : (n + 1);
     return Q.choice(r, `Hvilket tall er et <b>${ev ? 'partall' : 'oddetall'}</b>?`, ans, c, {sort:true, nums:true, say:`Hvilket tall er et ${ev ? 'partall' : 'oddetall'}?`, expl:`${ans} slutter på ${ans % 10}: ${ev ? 'partall' : 'oddetall'}.`});
   }},
   {t:'Neste og forrige', d:'Fortsett rekkene av partall og oddetall.', n:10, make:(r, i) => {
     const n = int(r, 4, 60), k = i % 4, e = n - n % 2, o = e + 1;
     if(k === 0) return Q.num(`Det neste partallet etter ${e} er {?}`, e + 2, {say:`Det neste partallet etter ${e} er?`, expl:`Partall hopper med 2: ${e + 2}.`});
     if(k === 1) return Q.num(`Det neste oddetallet etter ${o} er {?}`, o + 2, {say:`Det neste oddetallet etter ${o} er?`, expl:`Oddetall hopper med 2: ${o + 2}.`});
     if(k === 2) return Q.num(`${e}, ${e + 2}, {?}, ${e + 6}`, e + 4, {say:`${e}, ${e + 2}, hva mangler, ${e + 6}?`, expl:`Partall: hopp med 2.`});
     return Q.num(`Oddetallet rett før ${o + 2} er {?}`, o, {say:`Oddetallet rett før ${o + 2} er?`, expl:`${o + 2} − 2 = ${o}.`});
   }},
   {t:'Utforsk summer', d:'Hva blir summen: partall eller oddetall?', n:10, make:(r, i) => {
     const a = int(r, 1, 15), b = int(r, 1, 15), t = A.esc(a + ' + ' + b), s = a + b, k = i % 2;
     if(k === 0) return Q.choice(r, `${a} + ${b} = ${s}. Er summen partall eller oddetall?`, s % 2 ? 'Oddetall' : 'Partall', ['Partall', 'Oddetall'], {keep:true, say:`${a} pluss ${b} er ${s}. Er summen partall eller oddetall?`, expl:`${a} er ${a % 2 ? 'oddetall' : 'partall'}, ${b} er ${b % 2 ? 'oddetall' : 'partall'}, og ${s} er ${s % 2 ? 'oddetall' : 'partall'}.`});
     const p = pick(r, [['partall + partall', 'Partall'], ['oddetall + oddetall', 'Partall'], ['partall + oddetall', 'Oddetall']]);
     return Q.choice(r, `Hva blir svaret alltid når du regner <b>${p[0]}</b>?`, p[1], ['Partall', 'Oddetall'], {keep:true, say:`Hva blir svaret alltid når du regner ${p[0]}?`, expl:p[1] === 'Partall' && p[0].startsWith('odd') ? 'De to som blir til overs danner et par.' : p[1] === 'Partall' ? 'Par og par blir fortsatt par.' : 'Det blir én til overs.'});
   }}
  ]
});

/* ======================================================================
   9. Tallinjen
   ====================================================================== */
const hideAround = (from, to, h) => range(from, to).filter(x => x !== h);
MT.module({
  id:'tallinje', rek:25, trinn:[1, 2], maal:['KM13233'], tittel:'Tallinjen: plassere og lese av tall', ikon:'📏', bygger:['tall-11-20'],
  video:[
   {html:title('📏', 'Tallinjen', S.sub('Tallene står på rekke', 1.2)),
    no:'Nå skal vi lære om tallinjen. Tallinjen er som en linjal. Alle tallene står på rekke, i riktig rekkefølge.'},
   {html:sc(G.nline(0, 10, {w:620}), S.sub('Like langt mellom hver strek', 1.4)),
    no:'Her er en tallinje fra null til ti. Det er like langt fra en strek til den neste. Tallene blir større mot høyre og mindre mot venstre.'},
   {html:sc(G.nline(0, 10, {marks:[{v:7, label:'7', c:'#f97316'}], hops:[0, 1, 2, 3, 4, 5, 6].map(a => ({a, b:a + 1, c:'#94a3b8'})), w:620}), S.sub('Tell fra 0: 7 streker', 1.4)),
    no:'Hvor står sju? Vi starter på null og teller streker: en, to, tre, fire, fem, seks, sju. Der står sju. Tallet sju er sju streker fra null.'},
   {html:sc(G.nline(0, 20, {every:5, tick:1, marks:[{v:13, label:'?', c:'#f97316'}], w:700}), S.sub('13: tre streker etter 10', 1.4)),
    no:'På denne tallinjen står det bare tall på hver femte strek. Hvor står pila? Den er tre streker etter ti. Ti og tre er tretten.'},
   {html:sc(G.nline(0, 100, {every:10, tick:5, marks:[{v:70, label:'70', c:'#f97316'}, {v:65, label:'65', c:'#2563eb'}], w:720}), S.sub('Midt mellom 60 og 70 står 65', 1.6)),
    no:'Tallinjen kan gå helt til hundre. Her står det tall på hver tiende strek. Sytti står på sytti. Midt mellom seksti og sytti står sekstifem.'},
   {html:sc(G.nline(0, 10, {marks:[{v:3, label:'3', c:'#2563eb'}, {v:8, label:'8', c:'#f97316'}], w:620}), S.sub('Det største tallet står lengst til høyre', 1.4)),
    no:'Tallinjen hjelper oss å sammenligne. Åtte står lenger til høyre enn tre. Derfor er åtte større enn tre. Det tallet som står lengst til høyre, er størst.'},
   {html:sc(G.nline(40, 50, {marks:[{v:47, label:'47', c:'#f97316'}], w:620}), S.sub('En tallinje kan starte hvor som helst', 1.4)),
    no:'En tallinje trenger ikke å starte på null. Denne går fra førti til femti. Hvor står førtisju? Sju streker etter førti. Nå skal du øve på tallinjen!'}
  ],
  tekst:{
   mal:'Du skal plassere tall på tallinjen, lese av tall på tallinjen og forstå hvordan tallinjen er bygd opp.',
   steg:['Tallene står i rekkefølge og er <b>like langt fra hverandre</b>.', 'Større tall står til <b>høyre</b>, mindre tall til <b>venstre</b>.', 'Les av: finn nærmeste tall som står skrevet, og tell streker.', 'Mellom to tiere: midten er 5 mer (for eksempel 65 mellom 60 og 70).'],
   eks:[G.nline(0, 10, {marks:[{v:7, label:'7'}], w:420}), G.nline(0, 100, {every:10, tick:5, marks:[{v:35, label:'35'}], w:480})],
   ord:[['tallinje', 'en rett strek der tall står i rekkefølge'], ['strek (tick)', 'merke som viser et tall'], ['midt mellom', 'like langt til begge']],
   feil:['«Tallene på tallinjen kan stå ujevnt» – avstanden mellom to streker er alltid like stor.', '«Når jeg teller streker, teller jeg startstreken som 1» – start på 0 og tell hoppene.'],
   laerer:'KM13233 har to deler: å plassere tall (denne modulen) og å bruke tallinjen i regning (neste modul). Barn må forstå at tallinjen måler avstand fra null, ikke at hvert tall er en «boks» (som i hundrerutenettet).'
  },
  refleksjon:'Hvordan finner du ut hvor 13 står på en tallinje der bare 0, 5, 10, 15 og 20 er skrevet?',
  nivaaer:[
   {t:'Forstå: hvordan en tallinje virker', d:'Sjekk at du har forstått tallinjen.', kind:'forstaa', make:(r, i) => {
     const k = i % 4, a = int(r, 1, 7);
     if(k === 0) return Q.choice(r, 'Hvor står de <b>største</b> tallene på en tallinje?', 'Til høyre', ['Til venstre', 'I midten', 'Det varierer'], {expl:'Tall vokser mot høyre.'});
     if(k === 1) return Q.yn(`Er det like langt fra ${a} til ${a + 1} som fra ${a + 2} til ${a + 3}?`, true, {expl:'Ja. Avstanden mellom streker er alltid like stor.'});
     if(k === 2) return Q.num(`${G.nline(0, 10, {w:460, hide:[5]})}<br>Hvilket tall står midt mellom 0 og 10? {?}`, 5, {say:'Hvilket tall står midt mellom null og ti?', expl:'5 + 5 = 10, så fem er midt mellom 0 og 10.'});
     return Q.choice(r, `Hvilket tall står lengst til høyre på tallinjen?`, Math.max(a, a + 4), [a, a + 2, a + 1].map(x => x), {sort:true, nums:true, say:'Hvilket tall står lengst til høyre på tallinjen?', expl:'Det største tallet står lengst til høyre.'});
   }},
   {t:'Hvor peker pila? (til 20)', d:'Les av tallet som pila peker på.', n:10, make:(r, i) => {
     const to = i % 2 ? 20 : 10, n = int(r, 0, to);
     return Q.near(r, `${G.nline(0, to, {q:n, w:to === 10 ? 520 : 640})}<br>Hvilket tall viser pila?`, n, {say:'Hvilket tall viser pila?', expl:`Tell streker fra 0: det er ${n}.`});
   }},
   {t:'Tallene som mangler', d:'Skriv tallet som mangler på tallinjen.', n:10, make:(r, i) => {
     const f = int(r, 0, 14), to = f + 10, h = f + int(r, 1, 9);
     return Q.num(`${G.nline(f, to, {hide:[h], w:640})}<br>Hvilket tall mangler i ruten? {?}`, h, {say:'Hvilket tall mangler i ruten?', expl:`Telle fra ${f}: tallet i ruten er ${h}.`});
   }},
   {t:'Tallinje til 100', d:'Les av og plasser tall på tallinjen til 100.', n:10, make:(r, i) => {
     const n = int(r, 1, 19) * 5;
     return Q.choice(r, `${G.nline(0, 100, {every:10, tick:5, q:n, w:720})}<br>Hvilket tall viser pila?`, n, [n - 5, n + 5, n - 10, n + 10].filter(x => x > 0 && x < 100), {sort:true, nums:true, say:'Hvilket tall viser pila?', expl:`Pila står ${n % 10 ? 'midt mellom ' + (n - 5) + ' og ' + (n + 5) : 'på ' + n}.`});
   }},
   {t:'Mellom og nærmest', d:'Bruk tallinjen til å tenke om hvor tall ligger.', n:10, make:(r, i) => {
     const k = i % 4, t = int(r, 1, 8) * 10;
     if(k === 0) return Q.num(`Hvilket tall ligger midt mellom ${t} og ${t + 10}? {?}`, t + 5, {say:`Hvilket tall ligger midt mellom ${t} og ${t + 10}?`, expl:`Midt mellom to tiere er 5 mer: ${t + 5}.`, hint:G.nline(t, t + 10, {w:520, every:5})});
     if(k === 1){ const a = t + int(r, 1, 4), b = t + 10 + int(r, 1, 9); return Q.choice(r, `Hvilket tall ligger nærmest <b>${t + 10}</b>? &nbsp; <b>${a}</b> eller <b>${b}</b>`, Math.abs(a - t - 10) < Math.abs(b - t - 10) ? a : b, [a, b], {sort:true, nums:true, say:`Hvilket tall ligger nærmest ${t + 10}? ${a} eller ${b}?`, expl:`Avstanden fra ${a} er ${Math.abs(t + 10 - a)} og fra ${b} er ${Math.abs(b - t - 10)}.`}); }
     if(k === 2){ const a = int(r, 3, 17); return Q.num(`Hvilket tall ligger mellom ${a - 1} og ${a + 1}? {?}`, a, {say:`Hvilket tall ligger mellom ${a - 1} og ${a + 1}?`, expl:`${a - 1}, ${a}, ${a + 1}.`}); }
     const x = shuf(r, [int(r, 3, 9), int(r, 11, 19), int(r, 20, 29)]); return Q.choice(r, `Hvilket tall står lengst til <b>venstre</b> på tallinjen? &nbsp; ${x.join(' &nbsp; ')}`, Math.min(...x), x, {sort:true, nums:true, say:`Hvilket tall står lengst til venstre på tallinjen? ${x.join(', ')}`, expl:`Det minste tallet står lengst til venstre.`});
   }}
  ]
});

/* ======================================================================
   10. Gruppere etter egenskaper
   ====================================================================== */
const SH = [{s:'c', c:'#ef4444', n:'rød'}, {s:'c', c:'#3b82f6', n:'blå'}, {s:'q', c:'#ef4444', n:'rød'}, {s:'q', c:'#3b82f6', n:'blå'}, {s:'t', c:'#ef4444', n:'rød'}, {s:'t', c:'#3b82f6', n:'blå'}];
const mkShapes = (r, n) => Array.from({length:n}, () => { const b = pick(r, SH); return Object.assign({big:r() < .5}, b); });
const FORM = {c:'sirkler', q:'firkanter', t:'trekanter'};
MT.module({
  id:'grupper-egenskaper', rek:12, trinn:[1], maal:['KM13228'], tittel:'Gruppere etter egenskaper', ikon:'🧺', bygger:[],
  video:[
   {html:title('🧺', 'Gruppere etter egenskaper', S.sub('Sorter og forklar', 1.2)),
    no:'Nå skal vi sortere. Å sortere betyr å dele ting inn i grupper. Hver gruppe har noe til felles. Det kalles en egenskap.'},
   {html:sc(G.shapes([{s:'c', c:'#ef4444', big:1}, {s:'q', c:'#3b82f6', big:0}, {s:'t', c:'#ef4444', big:0}, {s:'c', c:'#3b82f6', big:1}, {s:'q', c:'#ef4444', big:1}, {s:'t', c:'#3b82f6', big:1}], {s:50}), S.sub('Hvilke egenskaper har figurene?', 1.2)),
    no:'Her er noen figurer. De har ulike egenskaper. De har ulike farger, ulike former og ulike størrelser. Hva kan vi sortere etter?'},
   {html:sc(S.row(S.pop('<div class="mtcard" style="--c:#ef4444;padding:10px">' + G.shapes([{s:'c', c:'#ef4444', big:1}, {s:'t', c:'#ef4444', big:0}, {s:'q', c:'#ef4444', big:1}], {s:46}) + '<br>røde</div>', .2), S.pop('<div class="mtcard" style="--c:#3b82f6;padding:10px">' + G.shapes([{s:'q', c:'#3b82f6', big:0}, {s:'c', c:'#3b82f6', big:1}, {s:'t', c:'#3b82f6', big:1}], {s:46}) + '<br>blå</div>', 1.4)), S.sub('Sortert etter farge', 2.4)),
    no:'Vi kan sortere etter farge. Her er alle de røde i én gruppe, og alle de blå i en annen. Egenskapen er farge.'},
   {html:sc(S.row(S.pop('<div class="mtcard" style="--c:#6b7280;padding:10px">' + G.shapes([{s:'c', c:'#ef4444', big:1}, {s:'c', c:'#3b82f6', big:1}], {s:46}) + '<br>sirkler</div>', .2), S.pop('<div class="mtcard" style="--c:#6b7280;padding:10px">' + G.shapes([{s:'q', c:'#3b82f6', big:0}, {s:'q', c:'#ef4444', big:1}], {s:46}) + '<br>firkanter</div>', 1.2), S.pop('<div class="mtcard" style="--c:#6b7280;padding:10px">' + G.shapes([{s:'t', c:'#ef4444', big:0}, {s:'t', c:'#3b82f6', big:1}], {s:46}) + '<br>trekanter</div>', 2.2)), S.sub('Samme figurer – sortert etter form', 3.2)),
    no:'Men vi kan også sortere de samme figurene på en annen måte. Etter form. Her er sirklene, firkantene og trekantene. Det går altså an å sortere på flere måter!'},
   {html:sc(S.row(S.pop(G.chips([2, 4, 6, 8], {c:'#2563eb'}), .2), S.pop(G.chips([1, 3, 5, 7], {c:'#f97316'}), 1.4)), S.sub('Tall kan også grupperes: partall og oddetall', 2.4)),
    no:'Tall kan også sorteres i grupper. Her er partall i en gruppe og oddetall i en annen. Vi kan også sortere i tall under ti og tall over ti.'},
   {html:sc(S.row(S.pop(G.objs('🍎', 3, {s:'2.4rem'}), .2), S.pop(G.objs('🍌', 1, {s:'2.4rem'}), 1.2)), S.sub('Hva passer ikke i gruppa?', 2)),
    no:'Hva passer ikke? Tre epler og en banan. Når reglen er frukt, passer alle. Når reglen er epler, passer ikke bananen. Hva som passer, avhenger av reglen vi velger.'},
   {html:sc(S.row(S.pop(G.eq('1. Velg en regel', '#2563eb'), .2), S.pop(G.eq('2. Sjekk at alle passer', '#16a34a'), 1.2), S.pop(G.eq('3. Finn en annen regel?', '#f97316'), 2.2)), S.sub('Nå øver vi!', 3.2)),
    no:'Når du sorterer, velger du først en regel. Så sjekker du at alle i gruppa passer til regelen. Og så kan du spørre deg selv: finnes det en annen måte å sortere på? Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal gruppere tall og mengder etter egenskaper, og reflektere over at de ofte kan grupperes på <b>flere måter</b>.',
   steg:['Se på tingene. Hvilke egenskaper har de? (farge, form, størrelse, antall, partall/oddetall …)', 'Velg en <b>regel</b> og sorter etter den.', 'Sjekk at alt i hver gruppe passer til regelen.', 'Spør deg selv: kan jeg sortere på en annen måte?'],
   eks:[G.shapes(SH.slice(0, 6).map((x, i) => Object.assign({big:i % 2}, x)), {s:34}) + '<br>Etter farge: 3 røde og 3 blå. Etter form: 2 sirkler, 2 firkanter, 2 trekanter.'],
   ord:[['egenskap', 'noe en ting har: farge, form, størrelse …'], ['gruppere / sortere', 'dele inn i grupper etter en regel'], ['regel', 'det som må passe for å være med i gruppa']],
   feil:['«Det finnes bare én riktig måte å sortere på» – ofte finnes flere, så lenge reglene er tydelige.', '«Gruppa har både røde og blå, men jeg sa røde» – alle i gruppa må passe til regelen.'],
   laerer:'KM13228 har to deler: å gruppere (konkreter og tall) og å reflektere over om det kan gjøres på flere måter. Be elevene begrunne: «Hva er regelen din?» og «Finnes det en annen måte?». Bruk gjerne uteliggende ting (kongler, knapper) i tillegg til oppgavene her.'
  },
  refleksjon:'Finn en gjenstand-samling hjemme (for eksempel sokker eller leker). Sorter den på to ulike måter. Hva er reglene dine?',
  nivaaer:[
   {t:'Forstå: regler og egenskaper', d:'Sjekk at du har forstått å sortere.', kind:'forstaa', make:(r, i) => {
     const k = i % 6;
     if(k === 4) return Q.choice(r, 'Du sorterer røde og blå figurer i to grupper. Hva er regelen?', 'Farge', ['Form', 'Størrelse', 'Tall'], {expl:'Du sorterer etter farge.'});
     if(k === 5) return Q.yn('Må alle i en gruppe passe til samme regel?', true, {expl:'Ja. Regelen sier hva som skal være med i gruppa.'});
     if(k === 0) return Q.yn('Kan de samme tingene sorteres på flere måter?', true, {expl:'Ja! For eksempel kan figurer sorteres etter farge, form eller størrelse.'});
     if(k === 1) return Q.choice(r, 'Hva trenger en gruppe?', 'En regel som alle passer til', ['Flest mulig ting', 'Bare røde ting', 'Et tall'], {expl:'Alle i gruppa må passe til samme regel.'});
     if(k === 2) return Q.choice(r, 'Hva er en <b>egenskap</b>?', 'Noe en ting har, for eksempel farge', ['Et tall', 'Et sted', 'En gruppe'], {expl:'Farge, form og størrelse er egenskaper.'});
     return Q.yn('Kan tallene 2, 4, 6 og 8 grupperes sammen?', true, {expl:'Ja: alle er partall (og alle er mindre enn 10).'});
   }},
   {t:'Sorter figurer', d:'Tell figurer med en bestemt egenskap.', n:10, make:(r, i) => {
     const sh = mkShapes(r, 8), k = i % 4; let cnt, q;
     if(k === 0){ const c = pick(r, ['rød', 'blå']); cnt = sh.filter(x => x.n === c).length; q = `Hvor mange figurer er ${c}e?`.replace('røde', 'røde'); q = `Hvor mange ${c === 'rød' ? 'røde' : 'blå'} figurer er det?`; }
     else if(k === 1){ const f = pick(r, ['c', 'q', 't']); cnt = sh.filter(x => x.s === f).length; q = `Hvor mange ${FORM[f]} er det?`; }
     else if(k === 2){ const b = r() < .5; cnt = sh.filter(x => !!x.big === b).length; q = `Hvor mange ${b ? 'store' : 'små'} figurer er det?`; }
     else { const f = pick(r, ['c', 'q', 't']), c = pick(r, ['rød', 'blå']); cnt = sh.filter(x => x.s === f && x.n === c).length; q = `Hvor mange ${FORM[f]} er ${c === 'rød' ? 'røde' : 'blå'}?`; }
     return Q.num(`${G.shapes(sh, {s:42})}<br>${q} {?}`, cnt, {say:q.replace('?', ''), expl:`Tell bare de som passer til egenskapen. Det er ${cnt}.`});
   }},
   {t:'Hva passer ikke?', d:'Finn den som ikke passer i gruppa.', n:10, make:(r, i) => {
     const sets = [
       () => { const f = ['🍎', '🍌', '🍓', '🍇'], a = ['🐶', '🐱', '🐟', '🐰']; const w = pick(r, a), grp = shuf(r, f).slice(0, 3); return {items:shuf(r, grp.concat(w)), ans:w, rule:'tre er frukt og én er dyr'}; },
       () => { const ev = shuf(r, [2, 4, 6, 8, 10, 12, 14, 16]).slice(0, 3), o = pick(r, [3, 5, 7, 9, 11]); return {items:shuf(r, ev.concat(o)), ans:o, rule:'tre er partall og én er oddetall'}; },
       () => { const od = shuf(r, [1, 3, 5, 7, 9, 11, 13]).slice(0, 3), o = pick(r, [2, 4, 6, 8, 10]); return {items:shuf(r, od.concat(o)), ans:o, rule:'tre er oddetall og én er partall'}; },
       () => { const lo = shuf(r, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), o = pick(r, [12, 15, 18, 21]); return {items:shuf(r, lo.concat(o)), ans:o, rule:'tre er mindre enn 10 og én er større enn 10'}; },
       () => { const f = shuf(r, ['🚗', '🚌', '🚲', '🚕']).slice(0, 3), o = pick(r, ['🌳', '🌸', '🌲']); return {items:shuf(r, f.concat(o)), ans:o, rule:'tre er kjøretøy og én er plante'}; }
     ];
     const s = sets[i % sets.length]();
     return Q.choice(r, `Hvilken passer <b>ikke</b> sammen med de andre? &nbsp; <span style="font-size:1.8rem">${s.items.join(' &nbsp; ')}</span>`, s.ans, s.items, {keep:true, say:'Hvilken passer ikke sammen med de andre?', expl:`Regel: ${s.rule}.`});
   }},
   {t:'Grupper av tall', d:'Finn regelen eller tallet som hører til.', n:10, make:(r, i) => {
     const k = i % 3;
     if(k === 0){ const g = pick(r, [[[2, 4, 6, 8], 'Partall'], [[1, 3, 5, 7], 'Oddetall'], [[12, 15, 18, 19], 'Tall over 10'], [[10, 20, 30, 40], 'Tall som slutter på 0'], [[11, 22, 33, 44], 'Tall med to like sifre']]); const wrong = ['Partall', 'Oddetall', 'Tall under 10', 'Tall som slutter på 5', 'Tall over 50'].filter(x => x !== g[1]); return Q.choice(r, `Hvilken regel passer for alle tallene i gruppa? &nbsp; <b>${g[0].join(', ')}</b>`, g[1], wrong.slice(0, 3), {say:`Hvilken regel passer for alle tallene i gruppa ${g[0].join(', ')}?`, expl:`Alle i gruppa er ${g[1].toLowerCase()}.`}); }
     if(k === 1){ const rule = pick(r, [['partall', x => x % 2 === 0], ['oddetall', x => x % 2 === 1], ['tall under 10', x => x < 10], ['tall over 10', x => x > 10]]); const pool = range(1, 20).filter(x => rule[1](x)), no = range(1, 20).filter(x => !rule[1](x)); const items = shuf(r, shuf(r, pool).slice(0, 3).concat(shuf(r, no)[0])); const ans = items.find(x => !rule[1](x)); return Q.choice(r, `Gruppa er <b>${rule[0]}</b>. Hvilket tall hører <b>ikke</b> til?`, ans, items, {sort:true, nums:true, say:`Gruppa er ${rule[0]}. Hvilket tall hører ikke til?`, expl:`${ans} er ikke ${rule[0]}.`}); }
     const t = int(r, 1, 8) * 10; return Q.yn(`Hører ${t + int(r, 1, 9)} til gruppa «tall som slutter på 0»?`, false, {expl:'Nei. Tall i gruppa må slutte på 0.'});
   }},
   {t:'Flere måter å sortere på', d:'Tenk over ulike måter å gruppere samme ting.', n:10, make:(r, i) => {
     const sh = mkShapes(r, 8), k = i % 3;
     if(k === 0){ const cs = uniq(sh.map(x => x.n)).length; return Q.num(`${G.shapes(sh, {s:42})}<br>Sorterer du etter <b>farge</b>: hvor mange grupper får du? {?}`, cs, {say:'Sorterer du etter farge: hvor mange grupper får du?', expl:`Det er ${cs} farger, så ${cs} grupper.`}); }
     if(k === 1){ const fs = uniq(sh.map(x => x.s)).length; return Q.num(`${G.shapes(sh, {s:42})}<br>Sorterer du etter <b>form</b>: hvor mange grupper får du? {?}`, fs, {say:'Sorterer du etter form: hvor mange grupper får du?', expl:`Det er ${fs} ulike former, så ${fs} grupper.`}); }
     return Q.yn(`Tallene <b>2, 4, 6, 8</b>: kan de sorteres både som «partall» og som «tall under 10»?`, true, {say:'Kan tallene 2, 4, 6 og 8 sorteres både som partall og som tall under 10?', expl:'Ja! Samme tall kan passe til flere regler.'});
   }}
  ]
});

/* ======================================================================
   11. Tall i hverdagen: lek, natur, kunst, musikk og bøker
   ====================================================================== */
MT.module({
  id:'tall-i-hverdagen', rek:14, trinn:[1, 2], maal:['KM13229'], tittel:'Tall rundt oss: lek, natur, kunst, musikk og bøker', ikon:'🌈', bygger:[],
  video:[
   {html:title('🌈', 'Tall rundt oss', S.sub('Lek, natur, kunst, musikk og bøker', 1.2)),
    no:'Tall finnes overalt! Ikke bare i matteboka. Nå skal vi utforske tall, mengder og telling i lek, i naturen, i kunst, i musikk og i bøker.'},
   {html:sc(S.row(S.pop('<span style="font-size:3rem">🪢</span>', .2), S.pop('<span style="font-size:3rem">🙈</span>', 1), S.pop('<span style="font-size:3rem">🎲</span>', 1.8)), S.sub('Hoppetau, gjemsel og terningspill', 2.6)),
    no:'I lek teller vi hele tiden. Vi teller hopp med hoppetau. Vi teller til tjue når vi leker gjemsel. Og vi teller prikker på terningen. Kan du telle høyt mens du hopper?'},
   {html:sc(S.row(S.pop(G.objs('🌸', 5, {s:'2.6rem'}), .2), S.pop(G.objs('🥚', 4, {s:'2.6rem'}), 1.4), S.pop(G.objs('🍂', 7, {s:'2.6rem'}), 2.6)), S.sub('Kronblad, egg i reiret, høstblader', 3.4)),
    no:'I naturen kan vi telle mange ting. Blomsten har fem kronblad. Det er fire egg i reiret. Og hvor mange høstblader ser du? Kanskje du kan telle hvor mange trær du ser på vei til skolen?'},
   {html:sc(G.shapes([{s:'c', c:'#ef4444', big:1}, {s:'q', c:'#3b82f6', big:1}, {s:'t', c:'#facc15', big:1}, {s:'c', c:'#ef4444', big:1}, {s:'q', c:'#3b82f6', big:1}, {s:'t', c:'#facc15', big:1}], {s:56}), S.sub('Et mønster i et bilde: rød, blå, gul, rød, blå, gul', 1.4)),
    no:'I billedkunst brukes tall og mønstre. Her er et bilde med figurer i et mønster. Rød sirkel, blå firkant, gul trekant. Så gjentar det seg. Kan du lage et eget bilde med tre røde, to blå og fire gule figurer?'},
   {html:sc(S.row(S.pop('<span style="font-size:3rem">🥁</span>', .2), S.chip('1', '#f97316', .8), S.chip('2', '#f97316', 1.4), S.chip('3', '#f97316', 2), S.chip('4', '#f97316', 2.6)), S.sub('Vi teller slag i musikken', 3.4)),
    no:'I musikk teller vi slag. En marsj har to eller fire slag i hver takt: en, to, tre, fire. En vals har tre slag: en, to, tre, en, to, tre. Klapp og tell sammen!'},
   {html:sc(S.row(S.pop(G.objs('🐐', 3, {s:'2.6rem'}), .2), S.pop(G.objs('🧙', 7, {s:'1.8rem', per:7}), 1.4)), S.sub('Tre bukker og sju dverger', 2.6)),
    no:'I bøker og eventyr finnes tall også. Tre bukker Bruse. Snehvit og de sju dvergene. Gullhår og de tre bjørnene. Hvilke eventyr kjenner du som har tall i seg?'},
   {html:sc(S.row(S.pop(G.eq('Utforsk: finn tall hjemme', '#16a34a'), .2), S.pop(G.eq('Tell, tegn, klapp og fortell', '#f97316'), 1.2)), S.sub('Nå skal du utforske!', 2.4)),
    no:'Nå er det din tur! Gå ut og utforsk. Finn tall hjemme og ute. Tell, tegn, klapp og fortell til en voksen hva du fant. Etterpå kan du svare på noen spørsmål her.'}
  ],
  tekst:{
   mal:'Du skal <b>utforske</b> tall, mengder og telling i lek, natur, billedkunst, musikk og barnelitteratur.',
   steg:['<b>Lek:</b> tell hopp, tell til 20 i gjemsel, tell prikker på terninger.', '<b>Natur:</b> tell kronblad, steiner, fugler, trær – sammenlign hvem som fant flest.', '<b>Billedkunst:</b> lag et bilde med et bestemt antall figurer, eller et mønster som gjentar seg.', '<b>Musikk:</b> klapp og tell slag: marsj (1-2-3-4), vals (1-2-3).', '<b>Bøker:</b> finn tall i eventyr: Tre bukker Bruse, Snehvit og de sju dvergene …'],
   eks:['Utforskekort (velg ett): «Finn 10 ting ute og sorter dem», «Lag et bilde med 5 røde og 3 blå figurer», «Klapp en rytme med 4 slag og tegn den», «Les en bok og skriv ned alle tall du finner».'],
   ord:[['mengde', 'hvor mange ting det er'], ['telle', 'si ett tall for hvert ting'], ['mønster', 'noe som gjentar seg']],
   feil:['Her finnes ingen «riktig» måte å utforske på – det viktigste er å telle, snakke om tall og være nysgjerrig.'],
   laerer:'KM13229 er et utforskende, tverrfaglig mål (tall i lek, natur, billedkunst, musikk og barnelitteratur). Appen kan bare støtte dette ved å vekke interessen og gi enkle oppgaver; selve utforskingen skjer best utendørs, i musikktimen, i kunst og mens man leser høyt. Bruk «Utforskekortene» på arbeidsarket som oppdrag, og la elevene dele funn i fellesskap.'
  },
  refleksjon:'Hvor fant du tall i dag? Fortell om ett sted der du telte noe.',
  nivaaer:[
   {t:'Forstå: tall finnes overalt', d:'Hva kan vi telle?', kind:'forstaa', make:(r, i) => {
     const k = i % 5;
     if(k === 3) return Q.choice(r, 'Hva kan vi telle i naturen?', 'Kronblad, steiner, fugler og trær', ['Ingenting', 'Bare tall på skilt', 'Bare ting vi har kjøpt'], {expl:'Naturen er full av ting å telle.'});
     if(k === 4) return Q.choice(r, 'Hvor finner vi tall i eventyr?', 'For eksempel tre bukker eller sju dverger', ['Ingen steder', 'Bare på siste side', 'Bare i bildene'], {expl:'Mange eventyr har tall i seg: Tre bukkene Bruse, Snehvit og de sju dvergene.'});
     if(k === 0) return Q.choice(r, 'Hvor kan vi finne tall og telling?', 'Overalt: i lek, natur, kunst, musikk og bøker', ['Bare i matteboka', 'Bare på skolen', 'Bare på klokka'], {expl:'Tall finnes overalt rundt oss!'});
     if(k === 1) return Q.choice(r, 'Hva teller vi i musikk?', 'Slag', ['Bokstaver', 'Fargestifter', 'Trær'], {expl:'Vi teller slag og takter: 1-2-3-4 i en marsj, 1-2-3 i en vals.'});
     return Q.yn('Kan vi utforske tall ute i naturen?', true, {expl:'Ja! Vi kan telle kronblad, steiner, fugler og mye mer.'});
   }},
   {t:'Tall i eventyr og lek', d:'Hvor mange? Fra eventyr, leker og regler.', n:10, make:(r, i) => {
     const items = [['Hvor mange bukker er det i «Tre bukkene Bruse»?', 3], ['Hvor mange dverger bor sammen med Snehvit?', 7], ['Hvor mange bjørner bor i huset i «Gullhår og de tre bjørnene»?', 3], ['Hvor mange små griser er det i «De tre små griser»?', 3], ['Hvor mange geitekillinger er det i «Ulven og de sju geitekillingene»?', 7], ['En vals har tre slag i hver takt. Hvor mange slag er det i én takt?', 3], ['En marsj har ofte fire slag i hver takt. Hvor mange slag er det i én takt?', 4], ['En terning har seks sider. Hvor mange sider har den?', 6], ['Hvor mange ben har en edderkopp?', 8], ['Hvor mange kronblad har blomsten på tegningen? ' + G.objs('🌼', 5), 5], ['Hvor mange egg er det i reiret? ' + G.objs('🥚', 4), 4], ['Hvor mange dager er det i en uke?', 7], ['Hvor mange fingre har du på én hånd?', 5]];
     const it = items[(i * 3 + int(r, 0, 12)) % items.length];
     return Q.near(r, it[0], it[1], {say:it[0].replace(/<[^>]+>/g, ''), expl:`Svaret er ${it[1]}.`});
   }},
   {t:'Tell og lag', d:'Tell i bilder, slag og mønstre.', n:10, make:(r, i) => {
     const k = i % 3, n = int(r, 3, 12), t = pick(r, MT.THINGS);
     if(k === 0) return Q.num(`${G.scatter(t[0], n, int(r, 1, 9999), {w:300, h:120, s:32})}<br>Hvor mange er det i bildet? {?}`, n, {say:'Hvor mange er det i bildet?', expl:`Tell rolig, ett for hvert. Det er ${n}.`});
     if(k === 1){ const b = int(r, 2, 4); return Q.num(`Du klapper en vals: 1-2-3, 1-2-3. Hvor mange slag klapper du i ${b} takter? {?}`, b * 3, {say:`Du klapper en vals med tre slag i hver takt. Hvor mange slag klapper du i ${b} takter?`, expl:`${Array.from({length:b}, () => 3).join(' + ')} = ${b * 3}.`}); }
     const a = int(r, 2, 5), b = int(r, 2, 5), c = int(r, 1, 4); return Q.num(`Du lager et bilde med ${a} røde, ${b} blå og ${c} gule figurer. Hvor mange figurer er det til sammen? {?}`, a + b + c, {say:`Du lager et bilde med ${a} røde, ${b} blå og ${c} gule figurer. Hvor mange figurer er det til sammen?`, calc:`${a}+${b}+${c}`, expl:`${a} + ${b} + ${c} = ${a + b + c}.`, hint:G.shapes([].concat(Array(a).fill({s:'c', c:'#ef4444', big:1}), Array(b).fill({s:'q', c:'#3b82f6', big:1}), Array(c).fill({s:'t', c:'#facc15', big:1})), {s:30})});
   }}
  ]
});
})();
