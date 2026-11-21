(function(){
'use strict';
/* Moduler 4. trinn: regneuttrykk og praktiske situasjoner – begge veier (KM13260) */
const MT = window.MT, G = MT.G, Q = MT.Q, S = MT.S;
const {int, pick, shuf} = MT, {sc, title} = S;
const uniq = a => a.filter((x, i, arr) => arr.indexOf(x) === i);
const ev = e => Function('return (' + e.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-') + ')')();
const E = (t, c) => G.eq(t, c);
const two = (r, lo, hi) => { const a = int(r, lo, hi); let b = int(r, lo, hi); while(b === a) b = int(r, lo, hi); return [a, b]; };

/* ---------- historier til ett-stegs regneuttrykk. Hver gir {text, q, expr, ans, calc} ---------- */
const ctx = {
  add:[(n, a, b, th) => `${n} har ${a} kroner og får ${b} kroner til.`, (n, a, b) => `Det er ${a} gutter og ${b} jenter i klassen.`, (n, a, b) => `${n} leste ${a} sider i går og ${b} sider i dag.`],
  sub:[(n, a, b) => `${n} har ${a} kuler og gir bort ${b}.`, (n, a, b) => `Det er ${a} gjester. ${b} av dem går hjem.`, (n, a, b) => `${n} har ${a} kroner og kjøper en ball til ${b} kroner.`],
  mul:[(n, a, b, th) => `Det er ${a} poser med ${b} ${th} i hver.`, (n, a, b) => `${n} kjøper ${a} blyanter til ${b} kroner hver.`, (n, a, b) => `Det er ${a} rader med ${b} stoler i hver rad.`],
  div:[(n, x, b, th) => `${x} ${th} deles likt mellom ${b} barn.`, (n, x, b) => `${n} har ${x} kroner. En bok koster ${b} kroner.`, (n, x, b) => `${x} elever skal sitte ${b} og ${b} ved hvert bord.`]
};
const Q_OF = {
  add:[(n) => `Hvor mange kroner har ${n} nå?`, () => 'Hvor mange er det i klassen til sammen?', (n) => `Hvor mange sider har ${n} lest til sammen?`],
  sub:[(n) => `Hvor mange kuler har ${n} igjen?`, () => 'Hvor mange gjester er igjen?', (n) => `Hvor mange kroner har ${n} igjen?`],
  mul:[(n, th) => `Hvor mange ${th} er det til sammen?`, (n) => `Hvor mye koster blyantene til sammen?`, () => 'Hvor mange stoler er det til sammen?'],
  div:[() => 'Hvor mange får hver?', (n) => `Hvor mange bøker kan ${n} kjøpe?`, () => 'Hvor mange bord trengs?']
};
const OPS = {add:'+', sub:'−', mul:'×', div:'÷'};
/* ett-stegs-historie: op = 'add'|'sub'|'mul'|'div'; k = hvilken kontekst (0–2) */
const story = (r, op, k, hard) => {
  const n = pick(r, MT.NAMES), th = pick(r, MT.THINGS)[1]; k = k == null ? int(r, 0, 2) : k;
  let a, b, x, expr, ans;
  if(op === 'add'){ [a, b] = two(r, hard ? 15 : 6, hard ? 65 : 30); expr = `${a} + ${b}`; ans = a + b; x = a; }
  else if(op === 'sub'){ [a, b] = two(r, hard ? 15 : 6, hard ? 65 : 30); if(a < b) [a, b] = [b, a]; expr = `${a} − ${b}`; ans = a - b; x = a; }
  else if(op === 'mul'){ a = int(r, 2, hard ? 9 : 6); b = int(r, 2, hard ? 9 : 7); if(a === b) b = b === 9 ? 8 : b + 1; expr = `${a} × ${b}`; ans = a * b; x = a; }
  else { const g = int(r, 2, hard ? 9 : 6), q = int(r, 2, hard ? 9 : 7); a = g * q; b = g; expr = `${a} ÷ ${b}`; ans = q; x = a; }
  const text = ctx[op][k](n, x, b, th);
  return {op, k, n, a:x, b, text, q:Q_OF[op][k](n, th), expr, ans, calc:expr.replace('×', '*').replace('÷', '/').replace('−', '-')};
};
const wrongExprs = (r, s) => {
  const x = s.a, y = s.b, cand = [];
  if(s.op === 'sub') cand.push(`${y} − ${x}`); if(s.op === 'div') cand.push(`${y} ÷ ${x}`);
  ['+', '−', '×', '÷'].forEach(o => { if(o === OPS[s.op]) return; if(o === '÷' && x % y !== 0) return; const hi = Math.max(x, y), lo = Math.min(x, y); cand.push(o === '−' ? `${hi} − ${lo}` : `${x} ${o} ${y}`); });
  return uniq(cand).filter(c => c !== s.expr && ev(c) !== ev(s.expr)).slice(0, 3);
};
const opName = {add:'pluss', sub:'minus', mul:'ganger', div:'delt på'};
const sayExpr = e => e.replace(/\+/g, 'pluss').replace(/−/g, 'minus').replace(/×/g, 'ganger').replace(/÷/g, 'delt på');

/* ---------- to-stegs-historier ---------- */
const twoStep = (r, k) => {
  const n = pick(r, MT.NAMES), th = pick(r, MT.THINGS)[1]; k = k == null ? int(r, 0, 4) : k; let a, b, c, text, expr, bad, q;
  if(k === 0){ a = int(r, 2, 6); b = int(r, 3, 8); c = int(r, 2, 9); text = `Det er ${a} poser med ${b} ${th} i hver, og ${c} ${th} ligger løse.`; expr = `${a} × ${b} + ${c}`; q = `Hvor mange ${th} er det til sammen?`; bad = [`${a} + ${b} + ${c}`, `${a} × ${b} × ${c}`, `${a} × ${b} − ${c}`, `${a} + ${b} × ${c}`]; }
  else if(k === 1){ a = int(r, 2, 6); b = int(r, 3, 8); c = int(r, 2, a * b - 1 > 9 ? 9 : a * b - 1); text = `Det er ${a} esker med ${b} ${th} i hver. ${c} ${th} blir ødelagt.`; expr = `${a} × ${b} − ${c}`; q = `Hvor mange ${th} er det igjen?`; bad = [`${a} × ${b} + ${c}`, `${a} + ${b} − ${c}`, `${a} × ${b} × ${c}`, `${a} − ${b} × ${c}`]; }
  else if(k === 2){ [a, b] = two(r, 10, 40); c = int(r, 5, 30); text = `${n} har ${a} kort, får ${b} kort av Ola og så ${c} kort av Mia.`; expr = `${a} + ${b} + ${c}`; q = `Hvor mange kort har ${n} nå?`; bad = [`${a} + ${b} − ${c}`, `${a} − ${b} + ${c}`, `${a} × ${b} + ${c}`, `${a} + ${b} × ${c}`]; }
  else if(k === 3){ const g = int(r, 2, 6), qq = int(r, 2, 8); b = g; a = g * qq; c = int(r, 2, 6); text = `${a} ${th} deles likt mellom ${b} barn. Hvert barn får ${c} ${th} til.`; expr = `${a} ÷ ${b} + ${c}`; q = `Hvor mange ${th} får hvert barn til sammen?`; bad = [`${a} ÷ ${b} − ${c}`, `${a} − ${b} + ${c}`, `${a} ÷ ${b} × ${c}`, `${a} + ${b} + ${c}`, `${a} + ${b} × ${c}`]; }
  else { [a, b] = two(r, 20, 50); c = int(r, 5, 18); text = `${n} har ${a} kroner, får ${b} kroner og bruker ${c} kroner.`; expr = `${a} + ${b} − ${c}`; q = `Hvor mange kroner har ${n} igjen?`; bad = [`${a} + ${b} + ${c}`, `${a} − ${b} + ${c}`, `${a} − ${b} − ${c}`, `${a} + ${b} × ${c}`]; }
  const v = ev(expr), opts = uniq(bad).filter(x => ev(x) !== v && ev(x) >= 0).slice(0, 3);
  return {text, q, expr, ans:v, opts, calc:expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-'), k};
};

/* ======================================================================
   Fra fortelling til regneuttrykk
   ====================================================================== */
MT.module({
  id:'uttrykk-fra-situasjon', rek:158, trinn:[4], maal:['KM13260'], tittel:'Fra fortelling til regneuttrykk', ikon:'📝', bygger:['regnefortellinger', 'gange-historier', 'deling-typer'],
  video:[
   {html:title('📝', 'Fra fortelling til regneuttrykk', S.sub('Skriv regnestykket som passer', 1.2)),
    no:'Av og til møter vi en fortelling og må finne regnestykket som passer. Et slikt regnestykke kalles et regneuttrykk. I dag lærer du å lage regneuttrykk til praktiske situasjoner.'},
   {html:sc(S.pop('<div class="mtcard" style="--c:#2563eb;padding:10px 16px;font-size:1.25rem">Mia har 8 kroner og får 5 kroner til.</div>', .2), S.row(S.pop(E('8 + 5 = 13', '#16a34a'), 1.4)), S.sub('Får mer → legg til', 2.2)),
    no:'Mia har åtte kroner og får fem kroner til. Hun får mer, så vi legger til. Regneuttrykket er åtte pluss fem. Svaret er tretten.'},
   {html:sc(S.pop('<div class="mtcard" style="--c:#2563eb;padding:10px 16px;font-size:1.25rem">Ola har 12 kuler og gir bort 4.</div>', .2), S.row(S.pop(E('12 − 4 = 8', '#16a34a'), 1.4)), S.sub('Gir bort → trekk fra', 2.2)),
    no:'Ola har tolv kuler og gir bort fire. Han mister noen, så vi trekker fra. Regneuttrykket er tolv minus fire. Ola har åtte kuler igjen.'},
   {html:sc(S.pop('<div class="mtcard" style="--c:#2563eb;padding:10px 16px;font-size:1.25rem">5 poser med 6 epler i hver.</div>', .2), S.row(S.pop(E('5 × 6 = 30', '#16a34a'), 1.4)), S.sub('Like store grupper → gange', 2.2)),
    no:'Fem poser med seks epler i hver. Det er like store grupper, så vi ganger. Regneuttrykket er fem ganger seks. Det er tretti epler.'},
   {html:sc(S.pop('<div class="mtcard" style="--c:#2563eb;padding:10px 16px;font-size:1.25rem">20 kjeks deles likt mellom 4 barn.</div>', .2), S.row(S.pop(E('20 ÷ 4 = 5', '#16a34a'), 1.4)), S.sub('Dele likt → dele', 2.2)),
    no:'Tjue kjeks deles likt mellom fire barn. Vi deler, så regneuttrykket er tjue delt på fire. Hvert barn får fem kjeks.'},
   {html:sc(S.pop('<div class="mtcard" style="--c:#2563eb;padding:10px 16px;font-size:1.25rem">3 bokser med 4 blyanter og 2 løse blyanter.</div>', .2), S.row(S.pop(E('3 × 4 + 2 = 14', '#16a34a'), 1.4)), S.sub('Først gange, så pluss', 2.2)),
    no:'Noen ganger trenger vi to steg. Tre bokser med fire blyanter og to løse blyanter. Først ganger vi, tre ganger fire er tolv. Så legger vi til to. Regneuttrykket er tre ganger fire pluss to, og svaret er fjorten.'},
   {html:sc(S.pop('<div class="mtcard" style="--c:#f97316;padding:10px 16px;font-size:1.2rem">Mia har 12 kort. Ola har 17. Hvor mange flere har Ola?</div>', .2), S.row(S.pop(E('17 − 12 = 5', '#16a34a'), 1.4)), S.sub('«Hvor mange flere» → finn forskjellen: trekk fra', 2.2)),
    no:'Pass på ord som hvor mange flere. Mia har tolv kort og Ola har sytten. Hvor mange flere har Ola? Vi finner forskjellen mellom dem. Sytten minus tolv er fem.'},
   {html:sc(S.big('Hva skjer i historien?', .2), S.sub('Nå øver vi!', 1.4)),
    no:'Tenk på hva som skjer i historien: legges det til, tas det bort, er det like store grupper, eller deles det likt? Da finner du regneuttrykket. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal <b>lage regneuttrykk</b> til praktiske situasjoner.',
   steg:['Les historien og finn tallene.', 'Tenk: <b>Hva skjer?</b> Får mer → pluss. Mister eller gir bort → minus. Like store grupper → gange. Dele likt → dele.', '«Hvor mange flere» og «hvor mange mangler» er forskjellen: minus.', 'Noen historier har <b>to steg</b>. Skriv ett steg om gangen: 3 × 4 + 2. Gange og dele regnes ut før pluss og minus.', 'Regn ut, og sjekk at svaret passer til historien.'],
   eks:['Mia har 8 kr og får 5 kr til: 8 + 5 = 13', '5 poser med 6 epler: 5 × 6 = 30', '3 bokser med 4 blyanter og 2 løse: 3 × 4 + 2 = 14'],
   ord:[['regneuttrykk', 'tall og regnetegn som viser en regning, for eksempel 8 + 5'], ['forskjell', 'hvor mye ett tall er større enn et annet'], ['to-stegs oppgave', 'en oppgave der du regner to ganger']],
   feil:['«Når det står flere, må jeg alltid legge til» – «hvor mange flere har Ola» er en subtraksjon.', '«3 × 4 + 2 er 3 × 6» – gange regnes ut først: 12 + 2 = 14.'],
   laerer:'KM13260: lage regneuttrykk til praktiske situasjoner. Dette er et overordnet mål som bygger på regnefortellingene fra 1.–2. trinn og gange/divisjon fra 3. trinn. Her kommer to-stegs-oppgaver og «forskjell»-situasjoner. Parentesregler er ikke et mål i 4. trinn; to-stegs-uttrykkene her kan regnes uten parenteser (gange og dele før pluss og minus).'
  },
  refleksjon:'Lag en historie til 12 − 5 og en historie til 12 ÷ 3. Hva er ulikt?',
  nivaaer:[
   {t:'Forstå: hva skjer i historien?', d:'Sjekk at du har forstått.', kind:'forstaa', make:(r, i) => {
     const k = i % 6;
     if(k === 0) return Q.choice(r, 'Hva kalles regnestykket du skriver til en historie, for eksempel 8 + 5?', 'Et regneuttrykk', ['Et eventyr', 'Et tegn', 'Et tall'], {keep:true, expl:'Tall og regnetegn som viser en regning kalles et regneuttrykk.'});
     if(k === 1) return Q.yn('Passer 8 + 5 til: «Mia har 8 kroner og får 5 kroner til»?', true, {expl:'Ja. Hun får mer, så vi legger til.'});
     if(k === 2) return Q.choice(r, 'Hvilket regneuttrykk passer til «5 poser med 6 epler i hver»?', '5 × 6', ['5 + 6', '6 − 5', '5 ÷ 6'], {keep:true, expl:'Like store grupper: gange.'});
     if(k === 3) return Q.yn('Passer 20 ÷ 4 til: «20 kjeks deles likt mellom 4 barn»?', true, {expl:'Ja. Vi deler likt.'});
     if(k === 4) return Q.choice(r, 'Mia har 12 kort og Ola har 17. Hvor mange flere har Ola? Hvilket regneuttrykk passer?', '17 − 12', ['17 + 12', '12 − 17', '17 × 12'], {keep:true, expl:'Forskjellen finner vi med subtraksjon: 17 − 12 = 5.'});
     return Q.choice(r, 'I 3 × 4 + 2: hva regner du først?', '3 × 4', ['4 + 2', '3 + 4', '2 × 3'], {keep:true, expl:'Gange regnes ut før pluss: 3 × 4 = 12, så 12 + 2 = 14.'});
   }},
   {t:'Velg riktig regneuttrykk', d:'Én regneart i historien.', n:12, make:(r, i) => {
     const op = ['add', 'sub', 'mul', 'div'][i % 4], s = story(r, op, null, i > 7);
     return Q.choice(r, `${s.text} ${s.q}<br>Hvilket regneuttrykk passer?`, s.expr, wrongExprs(r, s), {say:`${s.text} ${s.q} Hvilket regneuttrykk passer?`, expl:`Dette er ${op === 'add' ? 'å legge til' : op === 'sub' ? 'å ta bort' : op === 'mul' ? 'like store grupper' : 'å dele likt'}: ${s.expr} = ${s.ans}.`});
   }},
   {t:'Skriv uttrykk og regn ut', d:'Finn regneuttrykket og svaret.', n:12, make:(r, i) => {
     const op = ['add', 'sub', 'mul', 'div'][i % 4], s = story(r, op, null, i > 7);
     return Q.num(`${s.text} ${s.q} {?}`, s.ans, {say:`${s.text} ${s.q}`, calc:s.calc, hint:'Hva skjer i historien? Velg regneart først.', expl:`${s.expr} = ${s.ans}.`});
   }},
   {t:'Flere, færre, forskjell og pris', d:'Ord som lurer.', n:12, make:(r, i) => {
     const k = i % 6, n1 = pick(r, MT.NAMES); let n2 = pick(r, MT.NAMES); while(n2 === n1) n2 = pick(r, MT.NAMES);
     if(k === 0){ const [a, d] = two(r, 5, 30); const s = {expr:`${a} + ${d}`, a, b:d, op:'add'}; return Q.choice(r, `${n1} har ${a} kort. ${n2} har ${d} kort flere. Hvor mange kort har ${n2}?<br>Hvilket regneuttrykk passer?`, s.expr, [`${a} − ${d}`, `${a} × ${d}`, `${Math.max(a, d)} − ${Math.min(a, d)}`].filter(x => ev(x) !== a + d), {say:`${n1} har ${a} kort. ${n2} har ${d} kort flere. Hvor mange kort har ${n2}? Hvilket regneuttrykk passer?`, expl:`Flere enn: legg til. ${a} + ${d} = ${a + d}.`}); }
     if(k === 1){ let [a, d] = two(r, 8, 40); if(d >= a) d = int(r, 2, a - 1); return Q.choice(r, `${n1} har ${a} kort. ${n2} har ${d} kort færre. Hvor mange kort har ${n2}?<br>Hvilket regneuttrykk passer?`, `${a} − ${d}`, [`${a} + ${d}`, `${d} − ${a}`, `${a} × ${d}`], {say:`${n1} har ${a} kort. ${n2} har ${d} kort færre. Hvor mange kort har ${n2}? Hvilket regneuttrykk passer?`, expl:`Færre enn: trekk fra. ${a} − ${d} = ${a - d}.`}); }
     if(k === 2){ let [a, b] = two(r, 8, 40); if(a > b) [a, b] = [b, a]; return Q.choice(r, `${n1} har ${a} kort og ${n2} har ${b} kort. Hvor mange flere kort har ${n2}?<br>Hvilket regneuttrykk passer?`, `${b} − ${a}`, [`${b} + ${a}`, `${a} − ${b}`, `${b} × ${a}`], {say:`${n1} har ${a} kort og ${n2} har ${b} kort. Hvor mange flere kort har ${n2}? Hvilket regneuttrykk passer?`, expl:`Forskjellen finner vi ved å trekke fra: ${b} − ${a} = ${b - a}.`}); }
     if(k === 3){ let [a, b] = two(r, 20, 90); if(a > b) [a, b] = [b, a]; return Q.num(`${n1} har ${a} kroner. En ball koster ${b} kroner. Hvor mange kroner mangler ${n1}? {?}`, b - a, {say:`${n1} har ${a} kroner. En ball koster ${b} kroner. Hvor mange kroner mangler ${n1}?`, calc:`${b}-${a}`, expl:`${b} − ${a} = ${b - a}.`}); }
     if(k === 4){ const q = int(r, 3, 8), p = pick(r, [4, 5, 6, 7, 8, 9, 10, 12]); return Q.choice(r, `${q} like blyanter koster ${q * p} kroner til sammen. Hva koster én blyant?<br>Hvilket regneuttrykk passer?`, `${q * p} ÷ ${q}`, [`${q * p} × ${q}`, `${q * p} − ${q}`, `${q} ÷ ${q * p}`], {say:`${q} like blyanter koster ${q * p} kroner til sammen. Hva koster én blyant? Hvilket regneuttrykk passer?`, expl:`Del prisen likt: ${q * p} ÷ ${q} = ${p}.`}); }
     const q = int(r, 3, 8), p = pick(r, [4, 5, 6, 7, 8, 9, 10, 12]); return Q.num(`En blyant koster ${p} kroner. Hvor mange blyanter kan du kjøpe for ${q * p} kroner? {?}`, q, {say:`En blyant koster ${p} kroner. Hvor mange blyanter kan du kjøpe for ${q * p} kroner?`, calc:`${q * p}/${p}`, expl:`${q * p} ÷ ${p} = ${q}.`});
   }},
   {t:'To steg: velg uttrykket', d:'Historier med to regnearter.', n:10, make:(r, i) => {
     const s = twoStep(r, i % 5);
     return Q.choice(r, `${s.text} ${s.q}<br>Hvilket regneuttrykk passer?`, s.expr, s.opts, {say:`${s.text} ${s.q} Hvilket regneuttrykk passer?`, expl:`Skriv ett steg om gangen. Uttrykket ${s.expr} gir ${s.ans}.`});
   }},
   {t:'To steg: regn ut', d:'Gange og dele først.', n:10, make:(r, i) => {
     const s = twoStep(r, i % 5);
     return Q.num(`${s.text} ${s.q} {?}`, s.ans, {say:`${s.text} ${s.q}`, calc:s.calc, hint:'Skriv regneuttrykket først. Gange og dele før pluss og minus.', expl:`${s.expr} = ${s.ans}.`});
   }}
  ]
});

/* ======================================================================
   Fra regneuttrykk til fortelling
   ====================================================================== */
const stories = (op, r, a, b, n, th) => ctx[op].map(f => f(n, a, b, th));
const exprOf = (op, a, b) => `${a} ${OPS[op]} ${b}`;
MT.module({
  id:'situasjon-til-uttrykk', rek:160, trinn:[4], maal:['KM13260'], tittel:'Fra regneuttrykk til fortelling', ikon:'📖', bygger:['uttrykk-fra-situasjon'],
  video:[
   {html:title('📖', 'Fra regneuttrykk til fortelling', S.sub('Finn en historie som passer', 1.2)),
    no:'Nå snur vi på det. Vi har et regneuttrykk, og skal finne en praktisk situasjon som passer. Det er også viktig å kunne, og her finnes mange riktige svar.'},
   {html:sc(S.row(S.pop(E('15 − 6', '#2563eb'), .2)), S.pop('<div class="mtcard" style="--c:#16a34a;padding:10px 16px;font-size:1.2rem">Ola har 15 kuler og gir bort 6.</div>', 1.2), S.sub('Minus: noe tas bort', 2.2)),
    no:'Regneuttrykket er femten minus seks. En historie som passer: Ola har femten kuler og gir bort seks. Minus betyr at noe tas bort.'},
   {html:sc(S.row(S.pop(E('15 − 6', '#2563eb'), .2)), S.pop('<div class="mtcard" style="--c:#16a34a;padding:10px 16px;font-size:1.15rem">Det er 15 gjester. 6 av dem går hjem.</div>', 1.2), S.pop('<div class="mtcard" style="--c:#16a34a;padding:10px 16px;font-size:1.15rem">Mia har 15 kroner og kjøper en ball til 6 kroner.</div>', 2.4), S.sub('Mange historier passer til samme uttrykk', 3.4)),
    no:'Det finnes mange historier til samme regneuttrykk. Femten gjester og seks går hjem. Eller Mia har femten kroner og kjøper en ball til seks kroner. Alle passer til femten minus seks.'},
   {html:sc(S.row(S.pop(E('24 ÷ 4', '#2563eb'), .2)), S.pop('<div class="mtcard" style="--c:#16a34a;padding:10px 16px;font-size:1.15rem">24 kjeks deles likt mellom 4 barn.</div>', 1.2), S.pop('<div class="mtcard" style="--c:#f97316;padding:10px 16px;font-size:1.15rem">24 elever sitter 4 og 4 ved hvert bord.</div>', 2.4), S.sub('Deling og måling – to slags historier', 3.4)),
    no:'Tjuefire delt på fire kan være delingsdivisjon: tjuefire kjeks deles likt mellom fire barn. Eller målingsdivisjon: tjuefire elever sitter fire og fire ved hvert bord. Begge passer.'},
   {html:sc(S.row(S.pop(E('3 × 4', '#2563eb'), .2)), S.pop('<div class="mtcard" style="--c:#16a34a;padding:10px 16px;font-size:1.15rem">3 poser med 4 epler i hver.</div>', 1.2), S.pop('<div class="mtcard" style="--c:#dc2626;padding:10px 16px;font-size:1.15rem">Mia har 3 epler og får 4 epler til. ✖</div>', 2.4), S.sub('Plusshistorien passer ikke til gange', 3.4)),
    no:'Tre ganger fire. Tre poser med fire epler i hver passer. Men Mia har tre epler og får fire til, passer ikke. Det er en plusshistorie, og den gir tre pluss fire.'},
   {html:sc(S.row(S.pop(E('30 − ☐ = 12', '#2563eb'), .2)), S.pop('<div class="mtcard" style="--c:#16a34a;padding:10px 16px;font-size:1.15rem">Ola har 30 kr. Han kjøper en ball og har 12 kr igjen. Hva kostet ballen?</div>', 1.2), S.sub('Finn tallet som mangler: 30 − 18 = 12', 2.4)),
    no:'Av og til er et tall ukjent. Tretti minus hva er tolv? Historien: Ola har tretti kroner, kjøper en ball og har tolv kroner igjen. Hva kostet ballen? Tretti minus atten er tolv, så ballen kostet atten kroner.'},
   {html:sc(S.row(S.pop(E('3 × 4 + 2', '#2563eb'), .2)), S.pop('<div class="mtcard" style="--c:#16a34a;padding:10px 16px;font-size:1.15rem">3 bokser med 4 blyanter og 2 løse blyanter.</div>', 1.2), S.sub('To steg: først gange, så pluss', 2.2)),
    no:'Også uttrykk med to steg kan bli historier. Tre ganger fire pluss to: tre bokser med fire blyanter og to løse blyanter.'},
   {html:sc(S.big('Hvilken historie passer?', .2), S.sub('Nå øver vi!', 1.4)),
    no:'Husk å sjekke tallene og hva som skjer: legges det til, tas det bort, er det grupper, eller deles det? Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal finne <b>praktiske situasjoner</b> som passer til oppgitte regneuttrykk.',
   steg:['Se på regnetegnet: <b>+</b> legge til, <b>−</b> ta bort eller finne forskjell, <b>×</b> like store grupper, <b>÷</b> dele likt eller måle.', 'Lag en historie der tallene og det som skjer stemmer med uttrykket.', 'Det finnes <b>mange riktige historier</b> til samme uttrykk.', 'Hvis et tall mangler, finn det som gjør uttrykket riktig: 30 − ☐ = 12.', 'Sjekk: bruker historien samme tall og samme regneart?'],
   eks:['15 − 6: Ola har 15 kuler og gir bort 6.', '24 ÷ 4: 24 kjeks deles likt mellom 4 barn.', '3 × 4 + 2: 3 bokser med 4 blyanter og 2 løse blyanter.'],
   ord:[['situasjon', 'noe som skjer i virkeligheten'], ['uttrykk', 'tall og regnetegn, for eksempel 15 − 6'], ['ukjent tall', 'tallet du skal finne']],
   feil:['«15 − 6 passer til at Mia får 6 kroner til» – da må uttrykket være 15 + 6.', '«24 ÷ 4 passer bare til deling» – måling passer også.'],
   laerer:'KM13260, andre retning: finne praktiske situasjoner som passer til oppgitte regneuttrykk. La elevene lage egne historier og la klassen avgjøre om de passer. Ukjent-tall-oppgavene (☐) forbereder likninger senere.'
  },
  refleksjon:'Lag to ulike historier til 18 ÷ 3. Er de likt eller ulikt?',
  nivaaer:[
   {t:'Forstå: en historie, mange uttrykk', d:'Sjekk at du har forstått.', kind:'forstaa', make:(r, i) => {
     const k = i % 6;
     if(k === 0) return Q.yn('Kan flere ulike historier passe til samme regneuttrykk?', true, {expl:'Ja. 15 − 6 passer til mange ulike historier.'});
     if(k === 1) return Q.yn('Passer «Mia har 12 kuler og mister 5» til 12 + 5?', false, {expl:'Nei. Hun mister, så uttrykket er 12 − 5.'});
     if(k === 2) return Q.choice(r, 'Hva kan 3 × 4 bety i en historie?', '3 grupper med 4', ['3 og 4 som legges sammen', '3 minus 4', '3 delt på 4'], {keep:true, expl:'Gange betyr like store grupper: 3 grupper med 4.'});
     if(k === 3) return Q.yn('Kan 24 ÷ 4 både være deling og måling?', true, {expl:'Ja. Både «deles likt mellom 4» og «4 og 4 ved hvert bord» passer.'});
     if(k === 4) return Q.choice(r, 'Hvilket regnetegn passer til «noe tas bort»?', '−', ['+', '×', '÷'], {keep:true, expl:'Å ta bort er subtraksjon.'});
     return Q.yn('Kan du finne et tall som mangler i uttrykket 30 − ☐ = 12 ved å tenke 30 − 12?', true, {expl:'Ja. 30 − 12 = 18, og 30 − 18 = 12.'});
   }},
   {t:'Hvilken historie passer?', d:'Én av fire passer.', n:12, make:(r, i) => {
     const op = ['add', 'sub', 'mul', 'div'][i % 4], nm = pick(r, MT.NAMES), th = pick(r, MT.THINGS)[1]; let a, b, correct, others = [], expr;
     if(op === 'add' || op === 'sub'){ [a, b] = two(r, 8, 50); if(op === 'sub' && a < b) [a, b] = [b, a]; expr = exprOf(op, a, b); const k = int(r, 0, 2);
       correct = ctx[op][k](nm, a, b, th); const oth = op === 'add' ? 'sub' : 'add'; others = [ctx[oth][int(r, 0, 2)](nm, Math.max(a, b), Math.min(a, b), th), ctx.mul[int(r, 0, 2)](nm, a, b, th)]; if(op === 'add') others[0] = ctx.sub[int(r, 0, 2)](nm, Math.max(a, b), Math.min(a, b), th); }
     else if(op === 'mul'){ a = int(r, 2, 6); b = int(r, 3, 8); expr = `${a} × ${b}`; correct = ctx.mul[int(r, 0, 2)](nm, a, b, th); others = [ctx.add[int(r, 0, 2)](nm, a, b, th), ctx.sub[int(r, 0, 2)](nm, Math.max(a, b), Math.min(a, b), th)]; }
     else { const g = int(r, 2, 6), q = int(r, 3, 8); a = g * q; b = g; expr = `${a} ÷ ${b}`; correct = ctx.div[int(r, 0, 2)](nm, a, b, th); others = [ctx.add[int(r, 0, 2)](nm, a, b, th), ctx.sub[int(r, 0, 2)](nm, a, b, th), ctx.mul[int(r, 0, 2)](nm, a, b, th)]; }
     const wr = uniq(others).filter(x => x !== correct);
     return Q.choice(r, `Hvilken historie passer til ${expr}?`, correct, wr, {say:`Hvilken historie passer til ${sayExpr(expr)}?`, expl:`${expr} betyr ${op === 'add' ? 'å legge til' : op === 'sub' ? 'å ta bort' : op === 'mul' ? 'like store grupper' : 'å dele likt eller måle'}. Historien «${correct}» passer.`});
   }},
   {t:'Hvilken historie passer IKKE?', d:'Tre passer, én ikke.', n:12, make:(r, i) => {
     const op = ['add', 'sub', 'mul', 'div'][i % 4], nm = pick(r, MT.NAMES), th = pick(r, MT.THINGS)[1]; let a, b, expr, wrongOp;
     if(op === 'add' || op === 'sub'){ [a, b] = two(r, 8, 50); if(op === 'sub' && a < b) [a, b] = [b, a]; expr = exprOf(op, a, b); wrongOp = op === 'add' ? ['sub', Math.max(a, b), Math.min(a, b)] : ['add', a, b]; }
     else if(op === 'mul'){ a = int(r, 2, 6); b = int(r, 3, 8); expr = `${a} × ${b}`; wrongOp = ['add', a, b]; }
     else { const g = int(r, 2, 6), q = int(r, 3, 8); a = g * q; b = g; expr = `${a} ÷ ${b}`; wrongOp = ['sub', a, b]; }
     const good = stories(op, r, a, b, nm, th), bad = ctx[wrongOp[0]][int(r, 0, 2)](nm, wrongOp[1], wrongOp[2], th);
     return Q.choice(r, `Hvilken historie passer IKKE til ${expr}?`, bad, good, {say:`Hvilken historie passer ikke til ${sayExpr(expr)}?`, expl:`«${bad}» passer til ${wrongOp[0] === 'add' ? 'pluss' : 'minus'}, ikke til ${expr}.`});
   }},
   {t:'Tallet som mangler', d:'Finn det ukjente tallet i historien.', n:12, make:(r, i) => {
     const nm = pick(r, MT.NAMES), k = i % 7, th = pick(r, MT.THINGS)[1];
     if(k === 0){ const a = int(r, 20, 60), c = int(r, 5, a - 5); return Q.num(`${nm} har ${a} kroner, kjøper en ball og har ${c} kroner igjen. Hva kostet ballen?<br>${a} − {?} = ${c}`, a - c, {say:`${nm} har ${a} kroner, kjøper en ball og har ${c} kroner igjen. Hva kostet ballen?`, chk:`${a} - _ === ${c}`, expl:`${a} − ${a - c} = ${c}. Ballen kostet ${a - c} kroner.`}); }
     if(k === 1){ const b = int(r, 5, 30), c = int(r, b + 5, b + 40); return Q.num(`${nm} får ${b} kort til og har da ${c} kort. Hvor mange hadde ${nm} først?<br>{?} + ${b} = ${c}`, c - b, {say:`${nm} får ${b} kort til og har da ${c} kort. Hvor mange hadde ${nm} først?`, chk:`_ + ${b} === ${c}`, expl:`${c - b} + ${b} = ${c}.`}); }
     if(k === 2){ const a = int(r, 10, 50), c = int(r, a + 5, a + 40); return Q.num(`${nm} har ${a} kroner og vil ha ${c} kroner. Hvor mye mangler?<br>${a} + {?} = ${c}`, c - a, {say:`${nm} har ${a} kroner og vil ha ${c} kroner. Hvor mye mangler?`, chk:`${a} + _ === ${c}`, expl:`${a} + ${c - a} = ${c}.`}); }
     if(k === 3){ const g = int(r, 2, 6), q = int(r, 3, 9); return Q.num(`${g} poser har like mange ${th} i hver, til sammen ${g * q}. Hvor mange er det i hver pose?<br>${g} × {?} = ${g * q}`, q, {say:`${g} poser har like mange ${th} i hver, til sammen ${g * q}. Hvor mange er det i hver pose?`, chk:`${g} * _ === ${g * q}`, expl:`${g} × ${q} = ${g * q}.`}); }
     if(k === 4){ const b = int(r, 3, 9), g = int(r, 3, 8); return Q.num(`Noen barn får ${b} kjeks hver, til sammen ${b * g} kjeks. Hvor mange barn er det?<br>{?} × ${b} = ${b * g}`, g, {say:`Noen barn får ${b} kjeks hver, til sammen ${b * g} kjeks. Hvor mange barn er det?`, chk:`_ * ${b} === ${b * g}`, expl:`${g} × ${b} = ${b * g}.`}); }
     if(k === 5){ const b = int(r, 2, 6), q = int(r, 3, 9); return Q.num(`Noen kjeks deles likt på ${b} barn. Hvert barn får ${q} kjeks. Hvor mange kjeks var det?<br>{?} ÷ ${b} = ${q}`, b * q, {say:`Noen kjeks deles likt på ${b} barn. Hvert barn får ${q} kjeks. Hvor mange kjeks var det?`, chk:`_ / ${b} === ${q}`, expl:`${b * q} ÷ ${b} = ${q}.`}); }
     const q = int(r, 3, 8), x = int(r, 2, 6) * q; return Q.num(`${x} kjeks deles likt, og hvert barn får ${q} kjeks. Hvor mange barn er det?<br>${x} ÷ {?} = ${q}`, x / q, {say:`${x} kjeks deles likt, og hvert barn får ${q} kjeks. Hvor mange barn er det?`, chk:`${x} / _ === ${q}`, expl:`${x} ÷ ${x / q} = ${q}.`});
   }},
   {t:'To steg: hvilken historie?', d:'Uttrykk med to regnearter.', n:10, make:(r, i) => {
     const nm = pick(r, MT.NAMES), th = pick(r, MT.THINGS)[1], k = i % 3;
     if(k === 0){ const a = int(r, 2, 6), b = int(r, 3, 8), c = int(r, 2, 9);
       return Q.choice(r, `Hvilken historie passer til ${a} × ${b} + ${c}?`, `Det er ${a} poser med ${b} ${th} i hver, og ${c} ${th} ligger løse.`, [`Det er ${a} poser med ${b} ${th} i hver, og ${c} ${th} blir tatt bort.`, `${nm} har ${a} ${th}, får ${b} og så ${c}.`, `${a * b + c} ${th} deles likt mellom ${a} barn.`], {say:`Hvilken historie passer til ${a} ganger ${b} pluss ${c}?`, expl:`Først ${a} × ${b} (poser), så ${c} løse ${th} til.`}); }
     if(k === 1){ const a = int(r, 3, 6), b = int(r, 4, 8), c = int(r, 2, 9);
       return Q.choice(r, `Hvilken historie passer til ${a} × ${b} − ${c}?`, `Det er ${a} esker med ${b} ${th} i hver. ${c} ${th} blir ødelagt.`, [`Det er ${a} esker med ${b} ${th} i hver, og ${c} ${th} ligger løse.`, `${nm} har ${a} ${th}, gir bort ${b} og så ${c}.`, `${a * b} ${th} deles likt mellom ${c} barn.`], {say:`Hvilken historie passer til ${a} ganger ${b} minus ${c}?`, expl:`Først ${a} × ${b}, så tas ${c} bort.`}); }
     const [a, b] = two(r, 20, 50), c = int(r, 5, 18);
     return Q.choice(r, `Hvilken historie passer til ${a} + ${b} − ${c}?`, `${nm} har ${a} kroner, får ${b} kroner og bruker ${c} kroner.`, [`${nm} har ${a} kroner, får ${b} kroner og får ${c} kroner til.`, `${nm} har ${a} kroner, bruker ${b} kroner og får ${c} kroner.`, `${nm} kjøper ${a} blyanter til ${b} kroner hver.`], {say:`Hvilken historie passer til ${a} pluss ${b} minus ${c}?`, expl:`Først legges ${b} til ${a}, så tas ${c} bort.`});
   }}
  ]
});
})();
