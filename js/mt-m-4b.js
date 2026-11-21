(function(){
'use strict';
/* Moduler 4. trinn: de fire regneartene hører sammen, overslag og kritisk vurdering, regneuttrykk og situasjoner (KM13258, KM13259, KM13260) */
const A = window.App, MT = window.MT, G = MT.G, Q = MT.Q, S = MT.S, B = MT.B;
const {int, pick, shuf} = MT, {sc, pop, fade, big, sub, row, chip, title} = S;
const uniq = a => a.filter((x, i) => a.indexOf(x) === i);
const range = (a, b) => Array.from({length:b - a + 1}, (_, i) => a + i);
const ev = e => Function('return (' + e.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-') + ')')();
const r10 = n => Math.round(n / 10) * 10, r100 = n => Math.round(n / 100) * 100;
const mgp = (g, n, e) => G.groups(Array.from({length:g}, () => [e, n, Math.min(n, 5)]), {s:'1.5rem'});
const E = (t, c) => G.eq(t, c);

/* ======================================================================
   De fire regneartene hører sammen (KM13258)
   ====================================================================== */
const famAdd = (r) => { const a = int(r, 3, 40); let b = int(r, 3, 40); if(b === a) b = a + 1; return {a, b, c:a + b}; };
const famMul = (r, hard) => { const a = int(r, 2, hard ? 12 : 9); let b = int(r, 2, hard ? 12 : 9); if(b === a) b = a === 2 ? 3 : a - 1; return {a, b, c:a * b}; };
MT.module({
  id:'regnearter-familie', rek:150, trinn:[4], maal:['KM13258'], tittel:'De fire regneartene hører sammen', ikon:'👨‍👩‍👧‍👦', bygger:['add-sub-sammenheng', 'divisjon-strategier'],
  video:[
   {html:title('👨‍👩‍👧‍👦', 'De fire regneartene hører sammen', S.sub('Pluss, minus, gange og deling', 1.2)),
    no:'I dag skal vi se at de fire regneartene henger sammen. Pluss og minus er motsatte. Gange og deling er motsatte. Det kan hjelpe oss både i hoderegning og i skriftlig regning.'},
   {html:sc(S.row(S.pop(E('7 + 5 = 12', '#2563eb'), .2), S.pop(E('5 + 7 = 12', '#2563eb'), .9)), S.row(S.pop(E('12 − 5 = 7', '#f97316'), 1.8), S.pop(E('12 − 7 = 5', '#f97316'), 2.5)), S.sub('Tre tall – fire regnestykker: 7, 5 og 12', 3.4)),
    no:'Tallene sju, fem og tolv hører sammen. Sju pluss fem er tolv. Fem pluss sju er tolv. Tolv minus fem er sju. Og tolv minus sju er fem. Det er en regnefamilie med fire regnestykker.'},
   {html:sc(S.row(S.pop(E('4 × 6 = 24', '#16a34a'), .2), S.pop(E('6 × 4 = 24', '#16a34a'), .9)), S.row(S.pop(E('24 ÷ 6 = 4', '#9333ea'), 1.8), S.pop(E('24 ÷ 4 = 6', '#9333ea'), 2.5)), S.sub('Tre tall – fire regnestykker: 4, 6 og 24', 3.4)),
    no:'Slik er det også med gange og deling. Fire ganger seks er tjuefire. Seks ganger fire er tjuefire. Tjuefire delt på seks er fire. Og tjuefire delt på fire er seks. Pluss og minus er en familie, gange og deling er en annen.'},
   {html:sc(S.row(S.pop(E('4 × 6', '#2563eb'), .2)), S.row(S.pop(E('6 + 6 + 6 + 6 = 24', '#16a34a'), 1.2)), S.sub('Gange er gjentatt addisjon', 2.2)),
    no:'Gange og pluss er også i slekt. Fire ganger seks betyr at vi legger sammen seks fire ganger: seks pluss seks pluss seks pluss seks er tjuefire.'},
   {html:sc(S.row(S.pop(E('24 − 6 − 6 − 6 − 6 = 0', '#9333ea'), .2)), S.sub('Vi trekker fra 6 fire ganger – så 24 ÷ 6 = 4', 1.4)),
    no:'Og deling er gjentatt subtraksjon. Vi starter på tjuefire og trekker fra seks igjen og igjen. Etter fire ganger er vi nede på null. Derfor er tjuefire delt på seks lik fire.'},
   {html:sc(S.row(S.pop(E('56 ÷ 7 = ?', '#2563eb'), .2)), S.row(S.pop(E('7 × ? = 56', '#16a34a'), 1.2), S.pop(E('7 × 8 = 56', '#16a34a'), 2.0)), S.sub('Bruk familien: 56 ÷ 7 = 8', 2.9)),
    no:'Vi kan bruke regnefamilien. Hvis vi ikke husker femtiseks delt på sju, tenker vi: sju ganger hva er femtiseks? Sju ganger åtte er femtiseks. Altså er femtiseks delt på sju lik åtte.'},
   {html:sc(S.row(S.pop(E('6 × 7 = 42', '#2563eb'), .2)), S.row(S.pop(E('60 × 7 = 420', '#f97316'), 1.2), S.pop(E('420 ÷ 7 = 60', '#9333ea'), 2.1)), S.sub('Seks tiere ganger sju er 42 tiere', 3)),
    no:'Familien hjelper også med store tall. Seks ganger sju er førtito. Da er seksti ganger sju fire hundre og tjue, for seks tiere ganger sju er førtito tiere. Og fire hundre og tjue delt på sju er seksti.'},
   {html:sc(S.big('Tre tall – fire regnestykker', .2), S.sub('Nå øver vi!', 1.4)),
    no:'Husk at to regnearter alltid er motsatte. Bruk det du kan til å finne det du ikke kan. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal bruke hoderegning og skriftlig regning til å utforske og forklare <b>sammenhenger mellom de fire regneartene</b>.',
   steg:['<b>Pluss og minus er motsatte.</b> 7 + 5 = 12 gir 12 − 5 = 7 og 12 − 7 = 5.', '<b>Gange og deling er motsatte.</b> 4 × 6 = 24 gir 24 ÷ 6 = 4 og 24 ÷ 4 = 6.', '<b>Gange er gjentatt addisjon:</b> 4 × 6 = 6 + 6 + 6 + 6.', '<b>Deling er gjentatt subtraksjon:</b> hvor mange ganger kan du trekke fra 6 på vei ned fra 24?', 'Bruk det du kan: kan du 7 × 8 = 56, kan du også 56 ÷ 7 = 8.', 'Det virker også med tiere og hundrere: 6 × 7 = 42, så 60 × 7 = 420.'],
   eks:['7 + 5 = 12 · 5 + 7 = 12 · 12 − 5 = 7 · 12 − 7 = 5', '4 × 6 = 24 · 6 × 4 = 24 · 24 ÷ 6 = 4 · 24 ÷ 4 = 6', '6 × 7 = 42 → 60 × 7 = 420 → 420 ÷ 7 = 60'],
   ord:[['regnefamilie', 'tre tall som hører sammen i flere regnestykker'], ['motsatt regneart', 'pluss og minus, gange og deling'], ['gjentatt addisjon', 'å legge til det samme tallet flere ganger']],
   feil:['«12 − 5 = 5 − 12» – i subtraksjon og divisjon kan vi ikke bytte om tallene.', '«24 ÷ 6 = 6 ÷ 24» – bytter du tallene, blir det et annet regnestykke.'],
   laerer:'KM13258: bruke hoderegning og skriftlig regning til å utforske og forklare sammenhenger mellom de fire regneartene. Dette er et overordnet mål som bygges gjennom hele småskolen (jf. «Pluss og minus hører sammen» og divisjonsmodulene). Be elevene alltid forklare hvilken sammenheng de bruker.'
  },
  refleksjon:'Finn en regnefamilie med tallene 6, 9 og 54, og forklar hvordan du vet at de hører sammen.',
  nivaaer:[
   {t:'Forstå: tre tall – fire regnestykker', d:'Sjekk at du har forstått.', kind:'forstaa', make:(r, i) => {
     const k = i % 6, a = int(r, 3, 9), b = int(r, 3, 9);
     if(k === 0) return Q.yn(`Hører ${a} + ${b} = ${a + b} og ${a + b} − ${b} = ${a} til samme regnefamilie?`, true, {expl:'Ja. Pluss og minus er motsatte regnearter.'});
     if(k === 1) return Q.choice(r, 'Hvilken regneart er motsatt av gange?', 'Deling', ['Addisjon', 'Subtraksjon', 'Ingen'], {keep:true, expl:'Gange og deling er motsatte regnearter.'});
     if(k === 2){ const bb = int(r, 3, 5); return Q.yn(`Er ${a} × ${bb} det samme som ${Array(bb).fill(a).join(' + ')}?`, true, {expl:`Ja: ${a} × ${bb} betyr ${bb} ganger ${a}.`}); }
     if(k === 3) return Q.yn('Kan du tenke 7 × ? = 56 når du skal finne 56 ÷ 7?', true, {expl:'Ja. Delingen finner tallet du må gange med.'});
     if(k === 4) return Q.choice(r, 'Hvilket regnestykke hører IKKE til samme familie som 4, 6 og 24?', '6 + 4 = 24', ['4 × 6 = 24', '24 ÷ 4 = 6', '24 ÷ 6 = 4'], {expl:'6 + 4 er 10, ikke 24. De andre tre er riktige.'});
     return Q.yn('Er 12 − 5 det samme som 5 − 12?', false, {expl:'Nei. Rekkefølgen har betydning i subtraksjon.'});
   }},
   {t:'Regnefamilien', d:'Finn de andre regnestykkene.', n:10, make:(r, i) => {
     if(i % 2 === 0){ const f = famAdd(r), k = int(r, 0, 2);
       if(k === 0) return Q.num(`${f.a} + ${f.b} = ${f.c}, så ${f.c} − ${f.b} = {?}`, f.a, {say:`${f.a} pluss ${f.b} er ${f.c}, så ${f.c} minus ${f.b} er?`, calc:`${f.c}-${f.b}`, expl:`Minus er motsatt av pluss: ${f.c} − ${f.b} = ${f.a}.`});
       if(k === 1) return Q.num(`${f.a} + ${f.b} = ${f.c}, så ${f.c} − ${f.a} = {?}`, f.b, {say:`${f.a} pluss ${f.b} er ${f.c}, så ${f.c} minus ${f.a} er?`, calc:`${f.c}-${f.a}`, expl:`${f.c} − ${f.a} = ${f.b}.`});
       return Q.num(`${f.c} − ${f.b} = ${f.a}, så ${f.a} + ${f.b} = {?}`, f.c, {say:`${f.c} minus ${f.b} er ${f.a}, så ${f.a} pluss ${f.b} er?`, calc:`${f.a}+${f.b}`, expl:`Pluss er motsatt av minus: ${f.a} + ${f.b} = ${f.c}.`}); }
     const f = famMul(r, i > 5), k = int(r, 0, 2);
     if(k === 0) return Q.num(`${f.a} × ${f.b} = ${f.c}, så ${f.c} ÷ ${f.b} = {?}`, f.a, {say:`${f.a} ganger ${f.b} er ${f.c}, så ${f.c} delt på ${f.b} er?`, calc:`${f.c}/${f.b}`, expl:`Deling er motsatt av gange: ${f.c} ÷ ${f.b} = ${f.a}.`});
     if(k === 1) return Q.num(`${f.a} × ${f.b} = ${f.c}, så ${f.c} ÷ ${f.a} = {?}`, f.b, {say:`${f.a} ganger ${f.b} er ${f.c}, så ${f.c} delt på ${f.a} er?`, calc:`${f.c}/${f.a}`, expl:`${f.c} ÷ ${f.a} = ${f.b}.`});
     return Q.num(`${f.c} ÷ ${f.b} = ${f.a}, så ${f.a} × ${f.b} = {?}`, f.c, {say:`${f.c} delt på ${f.b} er ${f.a}, så ${f.a} ganger ${f.b} er?`, calc:`${f.a}*${f.b}`, expl:`Gange er motsatt av deling: ${f.a} × ${f.b} = ${f.c}.`});
   }},
   {t:'Hvilket hører ikke hjemme?', d:'Tre er riktige, ett er feil.', n:10, make:(r, i) => {
     if(i % 2 === 0){ const f = famAdd(r), good = [`${f.a} + ${f.b} = ${f.c}`, `${f.b} + ${f.a} = ${f.c}`, `${f.c} − ${f.a} = ${f.b}`, `${f.c} − ${f.b} = ${f.a}`], bad = pick(r, [`${f.a} − ${f.c} = ${f.b}`, `${f.c} + ${f.a} = ${f.b}`, `${f.a} + ${f.c} = ${f.b}`]);
       return Q.choice(r, `Tallene ${f.a}, ${f.b} og ${f.c} hører sammen. Hvilket regnestykke er FEIL?`, bad, shuf(r, good).slice(0, 3), {say:`Tallene ${f.a}, ${f.b} og ${f.c} hører sammen. Hvilket regnestykke er feil?`, expl:`${bad} kan ikke stemme. De andre følger av ${f.a} + ${f.b} = ${f.c}.`}); }
     const f = famMul(r, i > 5), good = [`${f.a} × ${f.b} = ${f.c}`, `${f.b} × ${f.a} = ${f.c}`, `${f.c} ÷ ${f.a} = ${f.b}`, `${f.c} ÷ ${f.b} = ${f.a}`], bad = pick(r, [`${f.a} ÷ ${f.c} = ${f.b}`, `${f.c} × ${f.a} = ${f.b}`, `${f.a} + ${f.b} = ${f.c}`]);
     return Q.choice(r, `Tallene ${f.a}, ${f.b} og ${f.c} hører sammen. Hvilket regnestykke er FEIL?`, bad, shuf(r, good).slice(0, 3), {say:`Tallene ${f.a}, ${f.b} og ${f.c} hører sammen. Hvilket regnestykke er feil?`, expl:`${bad} kan ikke stemme. De andre følger av ${f.a} × ${f.b} = ${f.c}.`});
   }},
   {t:'Gjentatt addisjon og subtraksjon', d:'Gange og deling i skjul.', n:10, make:(r, i) => {
     const a = int(r, 2, 9), b = int(r, 3, 7), k = i % 4;
     if(k === 0) return Q.num(`${Array(b).fill(a).join(' + ')} = {?}`, a * b, {say:`${Array(b).fill(a).join(' pluss ')}. Hva blir det?`, calc:Array(b).fill(a).join('+'), expl:`${b} ganger ${a}: ${b} × ${a} = ${a * b}.`});
     if(k === 1) return Q.num(`${a} + ${a} + ${a} = 3 × {?}`, a, {say:`${a} pluss ${a} pluss ${a} er tre ganger hva?`, chk:`${a}+${a}+${a} === 3 * _`, expl:`Du legger sammen ${a} tre ganger: 3 × ${a}.`});
     if(k === 2) return Q.num(`Hvor mange ganger kan du trekke fra ${a} fra ${a * b} før du kommer til 0? {?}`, b, {say:`Hvor mange ganger kan du trekke fra ${a} fra ${a * b} før du kommer til null?`, calc:`${a * b}/${a}`, expl:`${a * b} ÷ ${a} = ${b}. Så ${a * b} − ${a} gjort ${b} ganger gir 0.`});
     return Q.num(`${a * b} − ${Array(b).fill(a).join(' − ')} = 0. Altså er ${a * b} ÷ ${a} = {?}`, b, {say:`${a * b} minus ${a}, ${b} ganger, er null. Så ${a * b} delt på ${a} er?`, calc:`${a * b}/${a}`, expl:`Vi trekker fra ${a} hele ${b} ganger.`});
   }},
   {t:'Bruk det du kan', d:'Finn svaret fra et regnestykke du allerede vet.', n:12, make:(r, i) => {
     const k = i % 4;
     if(k === 0){ const f = famMul(r, i > 5); return Q.num(`Du vet at ${f.a} × ${f.b} = ${f.c}. Hva er da ${f.c} ÷ ${f.b}? {?}`, f.a, {say:`Du vet at ${f.a} ganger ${f.b} er ${f.c}. Hva er da ${f.c} delt på ${f.b}?`, calc:`${f.c}/${f.b}`, expl:`Deling er motsatt av gange.`}); }
     if(k === 1){ const f = famMul(r, i > 5); return Q.num(`Du vet at ${f.c} ÷ ${f.a} = ${f.b}. Hva er da ${f.b} × ${f.a}? {?}`, f.c, {say:`Du vet at ${f.c} delt på ${f.a} er ${f.b}. Hva er da ${f.b} ganger ${f.a}?`, calc:`${f.b}*${f.a}`, expl:'Gange er motsatt av deling.'}); }
     if(k === 2){ const f = {a:int(r, 15, 60), b:int(r, 12, 40)}; f.c = f.a + f.b; return Q.num(`Du vet at ${f.a} + ${f.b} = ${f.c}. Hva er da ${f.c} − ${f.b}? {?}`, f.a, {say:`Du vet at ${f.a} pluss ${f.b} er ${f.c}. Hva er da ${f.c} minus ${f.b}?`, calc:`${f.c}-${f.b}`, expl:'Minus er motsatt av pluss.'}); }
     const f = {a:int(r, 15, 60), b:int(r, 12, 40)}; f.c = f.a + f.b; return Q.num(`Du vet at ${f.c} − ${f.a} = ${f.b}. Hva er da ${f.b} + ${f.a}? {?}`, f.c, {say:`Du vet at ${f.c} minus ${f.a} er ${f.b}. Hva er da ${f.b} pluss ${f.a}?`, calc:`${f.b}+${f.a}`, expl:'Pluss er motsatt av minus.'});
   }},
   {t:'Tiere og hundrere', d:'Samme familie, større tall.', n:10, make:(r, i) => {
     const k = i % 5;
     if(k === 0 || k === 1){ const a = int(r, 2, 9), b = int(r, 2, 9), f = pick(r, [10, 100]); const big = a * f * b;
       return k === 0 ? Q.num(`Du vet at ${a} × ${b} = ${a * b}. Hva er da ${a * f} × ${b}? {?}`, big, {say:`Du vet at ${a} ganger ${b} er ${a * b}. Hva er da ${a * f} ganger ${b}?`, calc:`${a * f}*${b}`, expl:`${a} ${f === 10 ? 'tiere' : 'hundrere'} × ${b} = ${a * b} ${f === 10 ? 'tiere' : 'hundrere'} = ${big}.`})
         : Q.num(`Du vet at ${a} × ${b} = ${a * b}. Hva er da ${big} ÷ ${b}? {?}`, a * f, {say:`Du vet at ${a} ganger ${b} er ${a * b}. Hva er da ${big} delt på ${b}?`, calc:`${big}/${b}`, expl:`${big} ÷ ${b} = ${a * f}, for ${a * f} × ${b} = ${big}.`}); }
     const a = int(r, 12, 49), b = int(r, 2, 9), f = pick(r, [10, 100]);
     if(k === 2) return Q.num(`Du vet at ${a} + ${b} = ${a + b}. Hva er da ${a * 10} + ${b * 10}? {?}`, (a + b) * 10, {say:`Du vet at ${a} pluss ${b} er ${a + b}. Hva er da ${a * 10} pluss ${b * 10}?`, calc:`${a * 10}+${b * 10}`, expl:`Alt blir ti ganger så stort: ${(a + b) * 10}.`});
     if(k === 3) return Q.num(`Du vet at ${a + b} − ${b} = ${a}. Hva er da ${(a + b) * 10} − ${b * 10}? {?}`, a * 10, {say:`Du vet at ${a + b} minus ${b} er ${a}. Hva er da ${(a + b) * 10} minus ${b * 10}?`, calc:`${(a + b) * 10}-${b * 10}`, expl:`Alt blir ti ganger så stort: ${a * 10}.`});
     const c = int(r, 2, 9), d = int(r, 2, 9); return Q.num(`${c * d * 10} ÷ ${d} = {?}`, c * 10, {say:`${c * d * 10} delt på ${d}`, calc:`${c * d * 10}/${d}`, hint:`Tenk: ${c * d} ÷ ${d} = ${c}. Hvor mange tiere er det?`, expl:`${c * d} tiere delt på ${d} er ${c} tiere = ${c * 10}.`});
   }}
  ],
  drill:{tittel:'Manglende tall i gange og deling', layout:'row', cols:3, n:[48, 27], make:(r, i, hard) => {
    const a = int(r, 2, hard ? 12 : 9), b = int(r, 2, hard ? 12 : 9), c = a * b, k = i % 5;
    if(k === 0) return {t:`${a} × ☐ = ${c}`, ans:b};
    if(k === 1) return {t:`☐ × ${b} = ${c}`, ans:a};
    if(k === 2) return {t:`${c} ÷ ☐ = ${a}`, ans:b};
    if(k === 3) return {t:`☐ ÷ ${b} = ${a}`, ans:c};
    return {t:`${c} ÷ ${b} = ☐`, ans:a}; }}
});

/* ======================================================================
   Sjekk svaret med den motsatte regnearten (KM13258)
   ====================================================================== */
const addPair = (r, carry) => { for(let t = 0; t < 60; t++){ const a = int(r, 13, 79), b = int(r, 12, 79); if((a % 10 + b % 10 >= 10) === carry) return {a, b}; } return {a:38, b:27}; };
const subPair = (r, borrow) => { for(let t = 0; t < 80; t++){ const a = int(r, 31, 99), b = int(r, 12, a - 5); if((a % 10 < b % 10) === borrow) return {a, b}; } return {a:52, b:27}; };
MT.module({
  id:'kontroll-omvendt', rek:152, trinn:[4], maal:['KM13258'], tittel:'Sjekk svaret: bruk den motsatte regnearten', ikon:'🔍', bygger:['regnearter-familie', 'veksling-subtraksjon'],
  video:[
   {html:title('🔍', 'Sjekk svaret', S.sub('Bruk den motsatte regnearten', 1.2)),
    no:'Når vi regner skriftlig, kan vi gjøre feil. Men vi kan sjekke svaret ved å bruke den motsatte regnearten. I dag lærer du hvordan.'},
   {html:sc(S.row(S.pop(E('46 + 38 = 84', '#2563eb'), .2)), S.row(S.pop(E('Sjekk: 84 − 38 = 46 ✔', '#16a34a'), 1.2)), S.sub('Addisjon sjekkes med subtraksjon', 2.2)),
    no:'Førtiseks pluss trettiåtte er åttifire. Vi sjekker: åttifire minus trettiåtte er førtiseks. Det stemmer. Addisjon sjekkes med subtraksjon.'},
   {html:sc(S.row(S.pop(E('83 − 47 = 36', '#2563eb'), .2)), S.row(S.pop(E('Sjekk: 36 + 47 = 83 ✔', '#16a34a'), 1.2)), S.sub('Subtraksjon sjekkes med addisjon', 2.2)),
    no:'Åttitre minus førtisju er trettiseks. Vi sjekker: trettiseks pluss førtisju er åttitre. Det stemmer. Subtraksjon sjekkes med addisjon.'},
   {html:sc(S.row(S.pop(E('52 − 27 = 35 ?', '#dc2626'), .2)), S.row(S.pop(E('Sjekk: 35 + 27 = 62 ✖', '#dc2626'), 1.2)), S.row(S.pop(E('Riktig svar: 25', '#16a34a'), 2.2)), S.sub('62 er ikke 52 – her er det en feil', 3)),
    no:'Nå har noen regnet femtito minus tjuesju og fått trettifem. Vi sjekker: trettifem pluss tjuesju er sekstito. Men det skulle bli femtito. Så det er en feil. Riktig svar er tjuefem.'},
   {html:sc(S.row(S.pop(E('7 × 6 = 42', '#2563eb'), .2)), S.row(S.pop(E('Sjekk: 42 ÷ 6 = 7 ✔', '#16a34a'), 1.2)), S.sub('Gange sjekkes med deling', 2.2)),
    no:'Gange sjekkes med deling. Sju ganger seks er førtito. Vi sjekker: førtito delt på seks er sju. Det stemmer.'},
   {html:sc(S.row(S.pop(E('47 ÷ 6 = 7 rest 5', '#2563eb'), .2)), S.row(S.pop(E('Sjekk: 7 × 6 + 5 = 47 ✔', '#16a34a'), 1.2)), S.sub('Deling med rest: gange og legg til resten', 2.2)),
    no:'Deling kan vi sjekke med gange. Førtisju delt på seks er sju, rest fem. Vi sjekker: sju ganger seks er førtito, og pluss resten fem er førtisju. Det stemmer.'},
   {html:sc(S.big('Regn – og sjekk!', .2), S.sub('Nå øver vi!', 1.4)),
    no:'Husk å sjekke svaret med den motsatte regnearten. Da finner du feil selv. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal bruke hoderegning og skriftlig regning og <b>sjekke svaret med den motsatte regnearten</b>.',
   steg:['<b>Addisjon:</b> regn svaret minus det ene leddet. Du skal få det andre leddet.', '<b>Subtraksjon:</b> regn svaret pluss tallet du trakk fra. Du skal få tallet du startet med.', '<b>Multiplikasjon:</b> del svaret på den ene faktoren. Du skal få den andre.', '<b>Divisjon:</b> gang svaret med tallet du delte på. Legg til eventuell rest.', 'Stemmer det ikke, har du gjort en feil: regn på nytt.'],
   eks:['46 + 38 = 84 → 84 − 38 = 46 ✔', '83 − 47 = 36 → 36 + 47 = 83 ✔', '47 ÷ 6 = 7 rest 5 → 7 × 6 + 5 = 47 ✔'],
   ord:[['kontrollere', 'sjekke at svaret er riktig'], ['rest', 'det som blir til overs i en deling']],
   feil:['«I subtraksjon tar jeg alltid det minste sifferet fra det største» – 52 − 27 er ikke 35, men 25.', '«Når jeg legger sammen glemmer jeg overgangen til tierne» – 38 + 27 er 65, ikke 55.'],
   laerer:'KM13258: sammenhenger mellom regneartene i hoderegning og skriftlig regning. Her brukes sammenhengen aktivt som kontrollmetode, og vanlige feil (glemt veksling, minste fra største siffer) brukes som utgangspunkt for samtale.'
  },
  refleksjon:'Hvorfor kan du sjekke en subtraksjon ved å legge sammen? Forklar med et eksempel.',
  nivaaer:[
   {t:'Forstå: sjekk med motsatt regneart', d:'Sjekk at du har forstått.', kind:'forstaa', make:(r, i) => {
     const k = i % 6, p = addPair(r, true), s = subPair(r, true);
     if(k === 0) return Q.choice(r, `Hvordan kan du sjekke at ${p.a} + ${p.b} = ${p.a + p.b}?`, `Regne ${p.a + p.b} − ${p.b}`, [`Regne ${p.a + p.b} + ${p.b}`, `Regne ${p.a} × ${p.b}`, `Regne ${p.b} − ${p.a}`], {say:`Hvordan kan du sjekke at ${p.a} pluss ${p.b} er ${p.a + p.b}?`, expl:`Du trekker det ene leddet fra summen og skal få det andre: ${p.a + p.b} − ${p.b} = ${p.a}.`});
     if(k === 1) return Q.choice(r, `Hvordan kan du sjekke at ${s.a} − ${s.b} = ${s.a - s.b}?`, `Regne ${s.a - s.b} + ${s.b}`, [`Regne ${s.a - s.b} − ${s.b}`, `Regne ${s.a} + ${s.b}`, `Regne ${s.a} ÷ ${s.b}`], {say:`Hvordan kan du sjekke at ${s.a} minus ${s.b} er ${s.a - s.b}?`, expl:`Du legger sammen svaret og tallet du trakk fra, og skal få tallet du startet med: ${s.a - s.b} + ${s.b} = ${s.a}.`});
     if(k === 2) return Q.choice(r, 'Hva bruker du til å sjekke en multiplikasjon?', 'Divisjon', ['Addisjon', 'Subtraksjon', 'Ingenting'], {keep:true, expl:'Gange og deling er motsatte regnearter.'});
     if(k === 3) return Q.yn('Hvis kontrollen ikke stemmer, har du kanskje gjort en feil?', true, {expl:'Ja. Da bør du regne på nytt.'});
     if(k === 4) return Q.choice(r, 'For 47 ÷ 6 = 7 rest 5: hva regner du for å sjekke?', '7 × 6 + 5', ['7 × 6 − 5', '7 + 6 + 5', '47 × 6'], {say:'For 47 delt på 6 er 7 rest 5: hva regner du for å sjekke?', expl:'7 × 6 = 42, og 42 + 5 = 47.'});
     return Q.yn('Kan du alltid bytte om tallene i en subtraksjon uten å få en annen verdi?', false, {expl:'Nei. 8 − 3 er ikke det samme som 3 − 8.'});
   }},
   {t:'Sjekk addisjon', d:'Trekk fra og sammenlign.', n:10, make:(r, i) => {
     const p = addPair(r, i % 2 === 0), c = p.a + p.b;
     if(i % 3 === 0) return Q.num(`Sjekk: ${p.a} + ${p.b} = ${c}. Hva får du når du regner ${c} − ${p.b}? {?}`, p.a, {say:`Sjekk: ${p.a} pluss ${p.b} er ${c}. Hva får du når du regner ${c} minus ${p.b}?`, calc:`${c}-${p.b}`, expl:`${c} − ${p.b} = ${p.a}. Det er tallet vi startet med, så svaret stemmer.`});
     if(i % 3 === 1) return Q.num(`Sjekk: ${p.a} + ${p.b} = ${c}. Hva får du når du regner ${c} − ${p.a}? {?}`, p.b, {say:`Sjekk: ${p.a} pluss ${p.b} er ${c}. Hva får du når du regner ${c} minus ${p.a}?`, calc:`${c}-${p.a}`, expl:`${c} − ${p.a} = ${p.b}.`});
     const good = i % 2 === 0, shown = good ? c : c - 10, nm = pick(r, MT.NAMES);
     return Q.yn(`${nm} regnet ${p.a} + ${p.b} = ${shown}. Sjekk med ${shown} − ${p.b}. Er svaret riktig?`, good, {say:`${nm} regnet ${p.a} pluss ${p.b} er ${shown}. Sjekk med ${shown} minus ${p.b}. Er svaret riktig?`, expl:good ? `${shown} − ${p.b} = ${p.a}. Stemmer!` : `${shown} − ${p.b} = ${shown - p.b}, ikke ${p.a}. Svaret er feil. Riktig er ${c}.`});
   }},
   {t:'Sjekk subtraksjon', d:'Legg sammen og sammenlign.', n:10, make:(r, i) => {
     const p = subPair(r, i % 2 === 0), d = p.a - p.b;
     if(i % 3 === 0) return Q.num(`Sjekk: ${p.a} − ${p.b} = ${d}. Hva får du når du regner ${d} + ${p.b}? {?}`, p.a, {say:`Sjekk: ${p.a} minus ${p.b} er ${d}. Hva får du når du regner ${d} pluss ${p.b}?`, calc:`${d}+${p.b}`, expl:`${d} + ${p.b} = ${p.a}. Det er tallet vi startet med, så svaret stemmer.`});
     if(i % 3 === 1){ const good = i % 2 === 1, shown = good ? d : d + 10, nm = pick(r, MT.NAMES);
       return Q.yn(`${nm} regnet ${p.a} − ${p.b} = ${shown}. Sjekk med ${shown} + ${p.b}. Er svaret riktig?`, good, {say:`${nm} regnet ${p.a} minus ${p.b} er ${shown}. Sjekk med ${shown} pluss ${p.b}. Er svaret riktig?`, expl:good ? `${shown} + ${p.b} = ${p.a}. Stemmer!` : `${shown} + ${p.b} = ${shown + p.b}, ikke ${p.a}. Svaret er feil. Riktig er ${d}.`}); }
     return Q.num(`${p.a} − ${p.b} = {?}`, d, {say:`${p.a} minus ${p.b}`, calc:`${p.a}-${p.b}`, hint:`Sjekk etterpå: svaret + ${p.b} skal bli ${p.a}.`, expl:`${p.a} − ${p.b} = ${d}. Sjekk: ${d} + ${p.b} = ${p.a}.`});
   }},
   {t:'Sjekk gange og deling', d:'Gange sjekkes med deling.', n:10, make:(r, i) => {
     const a = int(r, 3, 9), b = int(r, 3, 9), c = a * b, k = i % 4;
     if(k === 0) return Q.num(`Sjekk: ${a} × ${b} = ${c}. Hva er ${c} ÷ ${b}? {?}`, a, {say:`Sjekk: ${a} ganger ${b} er ${c}. Hva er ${c} delt på ${b}?`, calc:`${c}/${b}`, expl:`${c} ÷ ${b} = ${a}. Det stemmer.`});
     if(k === 1) return Q.num(`Sjekk: ${c} ÷ ${a} = ${b}. Hva er ${b} × ${a}? {?}`, c, {say:`Sjekk: ${c} delt på ${a} er ${b}. Hva er ${b} ganger ${a}?`, calc:`${b}*${a}`, expl:`${b} × ${a} = ${c}. Det stemmer.`});
     const good = k === 2, shown = good ? c : c + int(r, 1, 3) * (r() < .5 ? 1 : -1), nm = pick(r, MT.NAMES);
     return Q.yn(`${nm} regnet ${a} × ${b} = ${shown}. Sjekk med ${shown} ÷ ${b}. Er svaret riktig?`, good, {say:`${nm} regnet ${a} ganger ${b} er ${shown}. Sjekk med ${shown} delt på ${b}. Er svaret riktig?`, expl:good ? `${shown} ÷ ${b} = ${a}. Stemmer!` : `${shown} går ikke opp i ${b}, eller gir ikke ${a}. Riktig svar er ${c}.`});
   }},
   {t:'Divisjon med rest – sjekk', d:'Gange og legg til resten.', n:10, make:(r, i) => {
     const d = int(r, 3, 9), q = int(r, 3, 9), rest = int(r, 1, d - 1), n = d * q + rest, k = i % 3;
     if(k === 0) return Q.num(`${n} ÷ ${d} = ${q} rest ${rest}. Sjekk: ${q} × ${d} + ${rest} = {?}`, n, {say:`${n} delt på ${d} er ${q} rest ${rest}. Sjekk: ${q} ganger ${d} pluss ${rest} er?`, calc:`${q}*${d}+${rest}`, expl:`${q} × ${d} = ${q * d}, og ${q * d} + ${rest} = ${n}. Det stemmer.`});
     if(k === 1){ const cands = uniq([`${q} rest ${rest}`, `${q + 1} rest ${rest}`, rest > 1 ? `${q} rest ${rest - 1}` : `${q} rest ${rest + 1 < d ? rest + 1 : rest}`]).filter(x => x !== `${q} rest ${rest}`);
       return Q.choice(r, `Hvilket svar er riktig for ${n} ÷ ${d}? Sjekk med gange.`, `${q} rest ${rest}`, cands, {say:`Hvilket svar er riktig for ${n} delt på ${d}? Sjekk med gange.`, expl:`${q} × ${d} + ${rest} = ${n}. De andre gir ikke ${n}.`}); }
     return Q.num(`${n} ÷ ${d}: hva er resten? Sjekk: ${q} × ${d} + {?} = ${n}`, rest, {say:`${n} delt på ${d}: hva er resten?`, chk:`${q}*${d} + _ === ${n}`, expl:`${n} − ${q * d} = ${rest}.`});
   }},
   {t:'Finn feilen', d:'Hva ble riktig svar?', n:10, make:(r, i) => {
     const nm = pick(r, MT.NAMES);
     if(i % 2 === 0){ const p = subPair(r, true), wrong = 10 * (Math.floor(p.a / 10) - Math.floor(p.b / 10)) + (p.b % 10 - p.a % 10), d = p.a - p.b;
       return Q.num(`${nm} regnet ${p.a} − ${p.b} = ${wrong}. Sjekk med ${wrong} + ${p.b}. Hva er riktig svar? {?}`, d, {say:`${nm} regnet ${p.a} minus ${p.b} er ${wrong}. Sjekk med ${wrong} pluss ${p.b}. Hva er riktig svar?`, calc:`${p.a}-${p.b}`, expl:`${wrong} + ${p.b} = ${wrong + p.b}, ikke ${p.a}. ${nm} tok det minste sifferet fra det største i enerne. Riktig: ${p.a} − ${p.b} = ${d}.`}); }
     const p = addPair(r, true), c = p.a + p.b, wrong = c - 10;
     return Q.num(`${nm} regnet ${p.a} + ${p.b} = ${wrong}. Sjekk med ${wrong} − ${p.b}. Hva er riktig svar? {?}`, c, {say:`${nm} regnet ${p.a} pluss ${p.b} er ${wrong}. Sjekk med ${wrong} minus ${p.b}. Hva er riktig svar?`, calc:`${p.a}+${p.b}`, expl:`${wrong} − ${p.b} = ${wrong - p.b}, ikke ${p.a}. ${nm} glemte å ta med tieren fra enerne. Riktig: ${p.a} + ${p.b} = ${c}.`});
   }}
  ]
});

/* ======================================================================
   Overslag (KM13259)
   ====================================================================== */
MT.module({
  id:'overslag', rek:154, trinn:[4], maal:['KM13259'], tittel:'Overslag: omtrent hvor mye?', ikon:'🎯', bygger:['regnearter-familie', 'tall-til-100', 'hundrerne', 'strategier-addisjon'],
  video:[
   {html:title('🎯', 'Overslag', S.sub('Omtrent hvor mye?', 1.2)),
    no:'Noen ganger trenger vi ikke et helt nøyaktig svar. Da lager vi et overslag. Et overslag er et godt gjett som er lett å regne ut. I dag lærer du å lage overslag.'},
   {html:sc(S.pop(G.nline(40, 50, {marks:[{v:47, label:'47', c:'#2563eb'}], hops:[{a:47, b:50, label:'nærmest', c:'#16a34a'}], w:560}), .2), S.sub('47 er nærmere 50 enn 40: 47 ≈ 50', 1.6)),
    no:'Først avrunding. Førtisju ligger mellom førti og femti. Det er nærmest femti. Vi sier at førtisju er omtrent femti. Tegnet for omtrent er to bølgete streker.'},
   {html:sc(S.row(S.pop(E('0, 1, 2, 3, 4 → ned', '#f97316'), .2)), S.row(S.pop(E('5, 6, 7, 8, 9 → opp', '#16a34a'), 1.2)), S.sub('Se på enerne når du runder av til nærmeste tier', 2.2)),
    no:'Regelen: Se på enerne. Er det null, en, to, tre eller fire, runder vi ned. Er det fem, seks, sju, åtte eller ni, runder vi opp.'},
   {html:sc(S.row(S.pop(E('48 + 31', '#2563eb'), .2)), S.row(S.pop(E('50 + 30 = 80', '#16a34a'), 1.2)), S.sub('Overslag: omtrent 80 (nøyaktig: 79)', 2.2)),
    no:'Overslag for pluss: Førtiåtte pluss trettien. Vi runder av til femti og tretti, og regner femti pluss tretti. Det er åtti. Det nøyaktige svaret er nittenogsytti, så overslaget er veldig nær.'},
   {html:sc(S.row(S.pop(E('203 − 98', '#2563eb'), .2)), S.row(S.pop(E('200 − 100 = 100', '#16a34a'), 1.2)), S.sub('Overslag: omtrent 100 (nøyaktig: 105)', 2.2)),
    no:'Overslag for minus: Tohundre og tre minus nittiåtte. Vi runder av til tohundre og hundre. Tohundre minus hundre er hundre. Det nøyaktige svaret er hundre og fem.'},
   {html:sc(S.row(S.pop(E('19 × 4', '#2563eb'), .2)), S.row(S.pop(E('20 × 4 = 80', '#16a34a'), 1.2)), S.sub('Overslag: omtrent 80 (nøyaktig: 76)', 2.2)),
    no:'Overslag for gange: Nitten ganger fire. Nitten er nesten tjue, og tjue ganger fire er åtti. Det nøyaktige svaret er syttiseks. Overslaget er et godt gjett.'},
   {html:sc(S.row(S.pop(E('9 × 8 = 172 ?', '#dc2626'), .2)), S.row(S.pop(E('10 × 8 = 80 → 172 er alt for stort', '#dc2626'), 1.2)), S.sub('Er svaret rimelig?', 2.2)),
    no:'Overslag hjelper oss å se om et svar er rimelig. Noen har regnet ni ganger åtte og fått hundre og syttito. Overslag: ti ganger åtte er åtti. Hundre og syttito er altfor stort. Svaret kan ikke være riktig.'},
   {html:sc(S.pop(G.scatter('🍪', 38, 3, {w:360, h:190, s:24}), .2), S.sub('Omtrent 40 kjeks – tell i grupper på 10', 1.4)),
    no:'Vi kan også anslå antall. Se på kjeksene. Tell ti og ti sammen i hodet. Det er omtrent førti kjeks. Vi trenger ikke telle en og en.'},
   {html:sc(S.big('Rund av – regn lett – sjekk at det er rimelig', .2), S.sub('Nå øver vi!', 1.4)),
    no:'Husk: Rund av til lette tall, regn, og spør om svaret er rimelig. Nå skal du øve på overslag!'}
  ],
  tekst:{
   mal:'Du skal <b>estimere</b> og <b>gjøre overslag</b>, og vurdere om svar er rimelige.',
   steg:['<b>Rund av</b> til nærmeste tier: se på enerne. 0–4 runder ned, 5–9 runder opp.', 'For hundrere ser du på tierne: 47 → 50, 347 → 300, 360 → 400.', '<b>Overslag for pluss og minus:</b> rund begge tall av og regn med de runde tallene.', '<b>Overslag for gange:</b> rund det store tallet av, og gang: 19 × 4 ≈ 20 × 4 = 80.', 'Bruk overslag til å sjekke om et svar er <b>rimelig</b>.', '<b>Anslå antall</b> ved å telle i grupper på 10.'],
   eks:['48 + 31 ≈ 50 + 30 = 80 (nøyaktig 79)', '203 − 98 ≈ 200 − 100 = 100 (nøyaktig 105)', '19 × 4 ≈ 20 × 4 = 80 (nøyaktig 76)'],
   ord:[['overslag', 'et regnestykke med runde tall som gir omtrent svaret'], ['anslå', 'gjette omtrent hvor mange eller hvor mye'], ['≈', 'omtrent lik'], ['rimelig', 'som kan stemme']],
   feil:['«Et overslag er helt nøyaktig» – det er et godt gjett, ikke et fasitsvar.', '«45 rundes ned til 40» – 5 runder opp: 45 ≈ 50.'],
   laerer:'KM13259: estimere, gjøre overslag, forklare tenkemåter og vurdere kritisk. Dette er et overordnet mål som trenes i alle regnemoduler. Her trener vi avrunding og overslag; i «Er løsningen rimelig?» trener vi kritisk vurdering av løsninger og modeller. Bruk gjerne «Er det rimelig?» som fast spørsmål.'
  },
  refleksjon:'Når er et overslag nok, og når trenger vi et nøyaktig svar? Gi et eksempel på hver.',
  nivaaer:[
   {t:'Forstå: hva er et overslag?', d:'Sjekk at du har forstått.', kind:'forstaa', make:(r, i) => {
     const k = i % 6, n = pick(r, [23, 37, 44, 56, 62, 78, 85, 91]);
     if(k === 0) return Q.yn('Er et overslag helt nøyaktig?', false, {expl:'Nei. Et overslag er et godt gjett som er lett å regne ut.'});
     if(k === 1) return Q.choice(r, `Hva er ${n} avrundet til nærmeste tier?`, r10(n), [r10(n) + 10, r10(n) - 10, r10(n) + 20].filter(x => x > 0), {sort:true, nums:true, expl:`Se på enerne i ${n}: ${n % 10 < 5 ? 'under 5, så vi runder ned' : '5 eller mer, så vi runder opp'}.`});
     if(k === 2) return Q.choice(r, 'Hva betyr tegnet ≈ ?', 'omtrent lik', ['nøyaktig lik', 'større enn', 'mindre enn'], {keep:true, expl:'Tegnet ≈ leses «omtrent lik».'});
     if(k === 3) return Q.yn('Kan du bruke et overslag til å se om et svar er rimelig?', true, {expl:'Ja. Hvis svaret er veldig forskjellig fra overslaget, er det sannsynligvis feil.'});
     if(k === 4) return Q.choice(r, 'Hvilket tall runder du OPP når du runder til nærmeste tier?', '45', ['41', '43', '44'], {keep:true, expl:'Enerne 5–9 runder opp. 45 → 50.'});
     return Q.yn('Skal 63 rundes av til 60 (nærmeste tier)?', true, {expl:'Ja. 3 er under 5, så vi runder ned.'});
   }},
   {t:'Avrund til nærmeste tier', d:'Se på enerne.', n:12, make:(r, i) => {
     let n = int(r, 11, 98); if(n % 10 === 0) n += 3;
     return Q.num(`Rund av ${n} til nærmeste tier: {?}`, r10(n), {say:`Rund av ${n} til nærmeste tier.`, chk:`_ === ${r10(n)}`, expl:`Enerne i ${n} er ${n % 10}, så vi runder ${n % 10 < 5 ? 'ned' : 'opp'}: ${r10(n)}.`, hint:'0–4 runder ned. 5–9 runder opp.'});
   }},
   {t:'Avrund til nærmeste hundre', d:'Se på tierne.', n:10, make:(r, i) => {
     let n = int(r, 101, 989); if(n % 100 === 0) n += 7;
     return Q.num(`Rund av ${n} til nærmeste hundre: {?}`, r100(n), {say:`Rund av ${n} til nærmeste hundre.`, chk:`_ === ${r100(n)}`, expl:`Tierne i ${n} er ${Math.floor(n / 10) % 10}, så vi runder ${Math.floor(n / 10) % 10 < 5 ? 'ned' : 'opp'}: ${r100(n)}.`, hint:'Se på tierne. 0–4 runder ned, 5–9 runder opp.'});
   }},
   {t:'Overslag: pluss og minus', d:'Rund av og regn.', n:12, make:(r, i) => {
     const big = i >= 8, f = big ? r100 : r10, nm = big ? 'hundre' : 'tier', a = big ? int(r, 120, 890) : int(r, 12, 89), b = big ? int(r, 110, 760) : int(r, 12, 79), plus = i % 2 === 0;
     const hi = Math.max(a, b), lo = Math.min(a, b);
     if(plus) return Q.num(`Rund av hvert tall til nærmeste ${nm}. ${a} + ${b} ≈ {?}`, f(a) + f(b), {say:`Rund av hvert tall til nærmeste ${nm}. ${a} pluss ${b} er omtrent?`, chk:`_ === ${f(a)} + ${f(b)}`, expl:`${a} ≈ ${f(a)} og ${b} ≈ ${f(b)}. ${f(a)} + ${f(b)} = ${f(a) + f(b)}. (Nøyaktig: ${a + b}.)`});
     return Q.num(`Rund av hvert tall til nærmeste ${nm}. ${hi} − ${lo} ≈ {?}`, f(hi) - f(lo), {say:`Rund av hvert tall til nærmeste ${nm}. ${hi} minus ${lo} er omtrent?`, chk:`_ === ${f(hi)} - ${f(lo)}`, expl:`${hi} ≈ ${f(hi)} og ${lo} ≈ ${f(lo)}. ${f(hi)} − ${f(lo)} = ${f(hi) - f(lo)}. (Nøyaktig: ${hi - lo}.)`});
   }},
   {t:'Overslag: gange', d:'Rund av og gang.', n:10, make:(r, i) => {
     const a = int(r, 12, 98), b = int(r, 2, 9);
     return Q.num(`Rund av ${a} til nærmeste tier og gang. ${a} × ${b} ≈ {?}`, r10(a) * b, {say:`Rund av ${a} til nærmeste tier og gang. ${a} ganger ${b} er omtrent?`, chk:`_ === ${r10(a)} * ${b}`, expl:`${a} ≈ ${r10(a)}. ${r10(a)} × ${b} = ${r10(a) * b}. (Nøyaktig: ${a * b}.)`});
   }},
   {t:'Er svaret rimelig?', d:'Bruk overslag til å sjekke.', n:10, make:(r, i) => {
     const nm = pick(r, MT.NAMES), good = r() < .5, m = i % 3;
     if(m === 0){ const a = int(r, 21, 79), b = int(r, 21, 79), c = a + b, shown = good ? c : c + pick(r, [100, 90]);
       return Q.yn(`${nm} regnet ${a} + ${b} = ${shown}. Er svaret rimelig?`, good, {say:`${nm} regnet ${a} pluss ${b} er ${shown}. Er svaret rimelig?`, expl:`Overslag: ${r10(a)} + ${r10(b)} = ${r10(a) + r10(b)}. ${good ? shown + ' er nær det. Rimelig!' : shown + ' er langt fra det. Ikke rimelig. Riktig er ' + c + '.'}`}); }
     if(m === 1){ const a = int(r, 40, 99), b = int(r, 12, 39), c = a - b, shown = good ? c : c + pick(r, [100, 50, 60]);
       return Q.yn(`${nm} regnet ${a} − ${b} = ${shown}. Er svaret rimelig?`, good, {say:`${nm} regnet ${a} minus ${b} er ${shown}. Er svaret rimelig?`, expl:`Overslag: ${r10(a)} − ${r10(b)} = ${r10(a) - r10(b)}. ${good ? shown + ' er nær det. Rimelig!' : shown + ' er langt fra det. Ikke rimelig. Riktig er ' + c + '.'}`}); }
     const a = int(r, 21, 79), b = int(r, 3, 9), c = a * b, shown = good ? c : (r() < .5 ? c * 10 : Math.round(c / 10));
     return Q.yn(`${nm} regnet ${a} × ${b} = ${shown}. Er svaret rimelig?`, good, {say:`${nm} regnet ${a} ganger ${b} er ${shown}. Er svaret rimelig?`, expl:`Overslag: ${r10(a)} × ${b} = ${r10(a) * b}. ${good ? shown + ' er nær det. Rimelig!' : shown + ' er langt fra det. Ikke rimelig. Riktig er ' + c + '.'}`});
   }},
   {t:'Overslag i hverdagen', d:'Penger, antall og avgjørelser.', n:10, make:(r, i) => {
     const k = i % 3, nm = pick(r, MT.NAMES);
     if(k === 0){ const a = int(r, 12, 48), b = int(r, 12, 48); return Q.num(`${nm} kjøper en bok til ${a} kroner og en penn til ${b} kroner. Omtrent hvor mange kroner bruker ${nm}? Rund av hver pris til nærmeste tier. {?}`, r10(a) + r10(b), {say:`${nm} kjøper en bok til ${a} kroner og en penn til ${b} kroner. Omtrent hvor mange kroner bruker ${nm}?`, chk:`_ === ${r10(a)} + ${r10(b)}`, expl:`${a} ≈ ${r10(a)} og ${b} ≈ ${r10(b)}: ${r10(a) + r10(b)} kroner.`}); }
     if(k === 1){ for(let t = 0; t < 80; t++){ const p = [int(r, 12, 59), int(r, 12, 59), int(r, 12, 59)], s = p[0] + p[1] + p[2];
         if(Math.abs(s - 100) >= 16){ const ok = s <= 100; return Q.yn(`${nm} har 100 kroner. Varene koster ${p.join(', ')} kroner. Er 100 kroner nok?`, ok, {say:`${nm} har 100 kroner. Varene koster ${p[0]}, ${p[1]} og ${p[2]} kroner. Er 100 kroner nok?`, expl:`Overslag: ${r10(p[0])} + ${r10(p[1])} + ${r10(p[2])} = ${r10(p[0]) + r10(p[1]) + r10(p[2])}. ${ok ? 'Det er under 100, så pengene holder.' : 'Det er over 100, så pengene holder ikke.'}`}); } }
       return Q.yn('Er 100 kroner nok til varer til 20, 30 og 40 kroner?', true, {expl:'20 + 30 + 40 = 90.'}); }
     const n = int(r, 24, 42), ans = r10(n); const cand = uniq([ans, ans + 30, ans * 2, ans + 60]).filter(x => Math.abs(x - n) >= 15 || x === ans);
     return Q.choice(r, `${G.scatter(pick(r, ['🍪', '⭐', '🐟', '🍎']), n, int(r, 1, 99), {w:360, h:180, s:24})}<br>Omtrent hvor mange er det? Velg det beste anslaget.`, ans, cand, {say:'Omtrent hvor mange er det? Velg det beste anslaget.', sort:true, nums:true, expl:`Tell i grupper på ti i hodet. Det er omtrent ${ans}.`});
   }}
  ],
  drill:{tittel:'Avrunding og overslag', layout:'row', cols:4, n:[48, 27], make:(r, i, hard) => {
    if(hard){ if(i % 3 === 0){ let n = int(r, 101, 989); if(n % 100 === 0) n += 7; return {t:`${n} ≈ ☐`, ans:r100(n)}; }
      if(i % 3 === 1){ const a = int(r, 12, 89), b = int(r, 12, 79); return {t:`${a} + ${b} ≈ ☐`, ans:r10(a) + r10(b)}; }
      const a = int(r, 41, 99), b = int(r, 12, 39); return {t:`${a} − ${b} ≈ ☐`, ans:r10(a) - r10(b)}; }
    let n = int(r, 11, 98); if(n % 10 === 0) n += 3; return {t:`${n} ≈ ☐`, ans:r10(n)}; }}
});

/* ======================================================================
   Er løsningen rimelig? Vurder tenkemåter og modeller (KM13259)
   ====================================================================== */
const FACTS = [
  ['Et barn i 4. klasse er omtrent 140 cm høy.', true], ['Et barn i 4. klasse er omtrent 14 m høy.', false],
  ['En skolesekk veier omtrent 4 kg.', true], ['En skolesekk veier omtrent 40 kg.', false],
  ['Et glass rommer omtrent 2 dl.', true], ['Et glass rommer omtrent 2 liter.', false],
  ['En skoletime varer omtrent 45 minutter.', true], ['En skoletime varer omtrent 45 timer.', false],
  ['En blyant er omtrent 18 cm lang.', true], ['En blyant er omtrent 18 m lang.', false],
  ['En bok koster omtrent 150 kroner.', true], ['En bok koster omtrent 15 000 kroner.', false],
  ['En klasse har omtrent 25 elever.', true], ['En klasse har omtrent 2500 elever.', false],
  ['Et egg veier omtrent 60 gram.', true], ['Et egg veier omtrent 6 kg.', false],
  ['En vanlig dør er omtrent 2 m høy.', true], ['En vanlig dør er omtrent 20 cm høy.', false]
];
MT.module({
  id:'vurdere-kritisk', rek:156, trinn:[4], maal:['KM13259'], tittel:'Er løsningen rimelig? Vurder tenkemåter og modeller', ikon:'🕵️', bygger:['overslag', 'kontroll-omvendt'],
  video:[
   {html:title('🕵️', 'Er løsningen rimelig?', S.sub('Vurder egne og andres løsninger', 1.2)),
    no:'En god regner stoler ikke blindt på svaret. En god regner spør: Er dette rimelig? Kan jeg sjekke det på en annen måte? I dag lærer du å vurdere løsninger kritisk.'},
   {html:sc(S.row(S.pop('<span style="font-size:2.4rem">👧</span>', .2), S.pop(E('Mia: 24 ÷ 4 = 20', '#dc2626'), .8)), S.row(S.pop('<span style="font-size:2.4rem">👦</span>', 1.6), S.pop(E('Ola: 24 ÷ 4 = 6', '#16a34a'), 2.2)), S.sub('Hvem har rett? Sjekk: 6 × 4 = 24 ✔, 20 × 4 = 80 ✖', 3.2)),
    no:'Mia og Ola har regnet tjuefire delt på fire. Mia fikk tjue og Ola fikk seks. Hvem har rett? Vi sjekker med gange. Seks ganger fire er tjuefire. Tjue ganger fire er åtti. Så Ola har rett. Mia trakk fire fra i stedet for å dele.'},
   {html:sc(S.pop(E('«En blyant koster 450 kroner»', '#dc2626'), .2), S.sub('Er det rimelig? Tenk på hva du vet om priser.', 1.4)),
    no:'Noen sier at en blyant koster firehundre og femti kroner. Er det rimelig? Nei. Vi vet at en blyant koster ti, tjue kroner. Bruk det du vet om verden til å vurdere svaret.'},
   {html:sc(S.pop(mgp(5, 4, '⚽'), .2), S.sub('Historien sier: 3 poser med 4 baller. Passer tegningen?', 1.6), S.row(S.pop(E('Nei: 5 poser ≠ 3 poser', '#dc2626'), 2.6))),
    no:'En modell eller tegning må passe til historien. Historien sier tre poser med fire baller. Men tegningen viser fem poser. Da passer ikke tegningen. Tell antall poser og antall i hver pose.'},
   {html:sc(S.row(S.pop(E('Mia: 38 + 27 = 38 + 20 + 7 = 65', '#2563eb'), .2)), S.row(S.pop(E('Ola: 38 + 27 = 40 + 27 − 2 = 65', '#16a34a'), 1.2)), S.sub('To ulike tenkemåter – begge riktige', 2.2)),
    no:'Noen ganger har to personer regnet ulikt, men begge har rett. Mia legger til tjue og så sju. Ola runder opp til førti og trekker fra to. Begge får sekstifem. Det finnes ofte flere gode måter.'},
   {html:sc(S.pop(E('«Gange gjør alltid tallet større»', '#dc2626'), .2), S.row(S.pop(E('7 × 1 = 7', '#16a34a'), 1.4)), S.sub('Ett moteksempel er nok til å vise at noe ikke alltid stemmer', 2.4)),
    no:'Noen sier at når du ganger, blir svaret alltid større. Stemmer det? Sju ganger en er sju. Det er ikke større. Ett eksempel som ikke passer, kalles et moteksempel. Ett moteksempel er nok til å vise at påstanden ikke alltid stemmer.'},
   {html:sc(S.row(S.pop(E('1. Hva spør oppgaven om?', '#2563eb'), .2)), S.row(S.pop(E('2. Er svaret rimelig?', '#16a34a'), 1.2)), S.row(S.pop(E('3. Kan jeg sjekke på en annen måte?', '#f97316'), 2.2))),
    no:'Tre spørsmål kan du stille deg selv. Én: Hva spør oppgaven om? To: Er svaret rimelig? Tre: Kan jeg sjekke svaret på en annen måte?'},
   {html:sc(S.big('Tenk kritisk – sjekk selv', .2), S.sub('Nå øver vi!', 1.4)),
    no:'Husk å vurdere løsninger kritisk, både dine egne og andres. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal <b>forklare tenkemåter</b> og <b>vurdere kritisk</b> egne og andres modeller og løsninger i praktiske situasjoner.',
   steg:['Spør: <b>Hva spør oppgaven om?</b>', 'Spør: <b>Er svaret rimelig?</b> Bruk overslag og det du vet om verden.', 'Spør: <b>Kan jeg sjekke på en annen måte?</b> Bruk motsatt regneart.', '<b>Passer modellen?</b> Tegningen må vise det samme som historien.', 'Ulike tenkemåter kan begge være riktige. Forklar hvorfor de virker.', 'Ett <b>moteksempel</b> viser at en påstand ikke alltid stemmer.'],
   eks:['«450 kroner for en blyant» er ikke rimelig.', '38 + 27: 38 + 20 + 7 = 65 og 40 + 27 − 2 = 65.', '«Gange gjør alltid større» – men 7 × 1 = 7.'],
   ord:[['rimelig', 'som kan stemme'], ['modell', 'tegning eller figur som viser en situasjon'], ['moteksempel', 'et eksempel som viser at en påstand ikke alltid stemmer'], ['tenkemåte', 'måten du tenker og regner på']],
   feil:['«Hvis svaret ser fint ut, er det riktig» – sjekk alltid.', '«Bare én måte å regne på kan være riktig» – ofte finnes flere.'],
   laerer:'KM13259: estimere, gjøre overslag, forklare tenkemåter og vurdere kritisk egne og andres modeller og løsninger i praktiske situasjoner. Dette er et overordnet mål; modulen «Overslag» trener estimering, denne trener vurdering. Bruk gjerne feil fra elevenes egne arbeid som utgangspunkt for samtale (uten å utpeke elever).'
  },
  refleksjon:'Finn en påstand i matematikk som ser riktig ut, men som ikke alltid stemmer. Vis et moteksempel.',
  nivaaer:[
   {t:'Forstå: tenk kritisk', d:'Sjekk at du har forstått.', kind:'forstaa', make:(r, i) => {
     const k = i % 6;
     if(k === 0) return Q.choice(r, 'Hvilket spørsmål hjelper deg å vurdere et svar?', 'Er svaret rimelig?', ['Hvem regnet først?', 'Hvor pen er skriften?', 'Er tallet stort?'], {keep:true, expl:'Spør alltid om svaret er rimelig.'});
     if(k === 1) return Q.yn('Kan to ulike tenkemåter begge gi riktig svar?', true, {expl:'Ja. Det finnes ofte flere gode måter å regne på.'});
     if(k === 2) return Q.yn('Er ett moteksempel nok til å vise at en påstand ikke alltid stemmer?', true, {expl:'Ja. Ett eksempel som ikke passer er nok.'});
     if(k === 3) return Q.yn('Må en tegning passe til historien den skal vise?', true, {expl:'Ja. Tegningen må vise det samme som historien.'});
     if(k === 4) return Q.choice(r, 'Hva bruker du til å sjekke et svar på en annen måte?', 'Den motsatte regnearten', ['Et dyrt viskelær', 'Tilfeldig gjetning', 'Et nytt navn'], {keep:true, expl:'Pluss sjekkes med minus, og gange med deling.'});
     return Q.yn('Er svaret riktig bare fordi det «ser fint ut»?', false, {expl:'Nei. Sjekk svaret.'});
   }},
   {t:'Hvem har regnet riktig?', d:'To tenkemåter – én er feil.', n:10, make:(r, i) => {
     const nms = shuf(r, MT.NAMES).slice(0, 2), flip = r() < .5;
     if(i % 2 === 0){ const p = addPair(r, true), c = p.a + p.b, t = Math.floor(p.b / 10) * 10, e = p.b % 10;
       const good = `${p.a} + ${t} = ${p.a + t}, ${p.a + t} + ${e} = ${c}`, bad = `${Math.floor(p.a / 10) * 10 + t} + ${(p.a % 10 + e) % 10} = ${Math.floor(p.a / 10) * 10 + t + (p.a % 10 + e) % 10}`;
       const lines = flip ? [[nms[0], good], [nms[1], bad]] : [[nms[0], bad], [nms[1], good]], rightName = flip ? nms[0] : nms[1];
       return Q.choice(r, `Regn ${p.a} + ${p.b}.<br><b>${lines[0][0]}:</b> ${lines[0][1]}<br><b>${lines[1][0]}:</b> ${lines[1][1]}<br>Hvem har regnet riktig?`, rightName, [nms[0], nms[1]], {keep:true, say:`Regn ${p.a} pluss ${p.b}. Hvem har regnet riktig?`, expl:`${p.a} + ${p.b} = ${c}. Den som glemmer tieren fra enerne får ${c - 10}.`}); }
     const p = subPair(r, true), d = p.a - p.b, t = Math.floor(p.b / 10) * 10, e = p.b % 10;
     const good = `${p.a} − ${t} = ${p.a - t}, ${p.a - t} − ${e} = ${d}`, wr = 10 * (Math.floor(p.a / 10) - Math.floor(p.b / 10)) + (p.b % 10 - p.a % 10), bad = `${p.b % 10} − ${p.a % 10} = ${p.b % 10 - p.a % 10}, så svaret er ${wr}`;
     const lines = flip ? [[nms[0], good], [nms[1], bad]] : [[nms[0], bad], [nms[1], good]], rightName = flip ? nms[0] : nms[1];
     return Q.choice(r, `Regn ${p.a} − ${p.b}.<br><b>${lines[0][0]}:</b> ${lines[0][1]}<br><b>${lines[1][0]}:</b> ${lines[1][1]}<br>Hvem har regnet riktig?`, rightName, [nms[0], nms[1]], {keep:true, say:`Regn ${p.a} minus ${p.b}. Hvem har regnet riktig?`, expl:`${p.a} − ${p.b} = ${d}. Den som tar minste siffer fra største i enerne får feil svar.`});
   }},
   {t:'Passer tegningen til historien?', d:'Tell poser og antall.', n:10, make:(r, i) => {
     const g = int(r, 2, 5), n = int(r, 3, 6), e = pick(r, MT.THINGS), good = i % 2 === 0;
     const wrongKind = r() < .5;
     const gg = good ? g : (wrongKind ? g + 1 : g), nn = good ? n : (wrongKind ? n : n + 1);
     return Q.yn(`Historie: ${g} poser med ${n} ${e[1]} i hver.<br>${mgp(gg, nn, e[0])}<br>Passer tegningen til historien?`, good, {say:`Historie: ${g} poser med ${n} ${e[1]} i hver. Passer tegningen til historien?`, expl:good ? `Tegningen viser ${g} poser med ${n} i hver. Det passer.` : `Tegningen viser ${gg} poser med ${nn} i hver, men historien sier ${g} poser med ${n} i hver.`});
   }},
   {t:'Er dette rimelig?', d:'Bruk det du vet om verden.', n:10, make:(r, i) => { const f = pick(r, FACTS); return Q.yn(`${f[0]}<br>Er det rimelig?`, f[1], {say:f[0] + ' Er det rimelig?', expl:f[1] ? 'Ja, det passer med hva vi vet.' : 'Nei, det stemmer ikke med hva vi vet. Sjekk enhetene.'}); }},
   {t:'Rimelig svar i regneoppgaver', d:'Overslag avgjør.', n:10, make:(r, i) => {
     const nm = pick(r, MT.NAMES);
     if(i % 2 === 0){ const g = int(r, 3, 9), n = int(r, 4, 9), c = g * n, good = r() < .5, shown = good ? c : c * 10;
       return Q.yn(`${nm} regnet at ${g} barn som får ${n} kjeks hver trenger ${shown} kjeks til sammen. Er svaret rimelig?`, good, {say:`${nm} regnet at ${g} barn som får ${n} kjeks hver trenger ${shown} kjeks til sammen. Er svaret rimelig?`, expl:good ? `${g} × ${n} = ${c}. Det stemmer.` : `${g} × ${n} er ${c}, ikke ${shown}. ${shown} er ti ganger for mye.`}); }
     const a = int(r, 24, 66), b = int(r, 24, 66), ans = r10(a) + r10(b);
     return Q.choice(r, `${nm} har ${a} kroner og får ${b} kroner til. Omtrent hvor mye har ${nm} nå?`, ans, [ans * 10, Math.round(ans / 10), ans + 100], {say:`${nm} har ${a} kroner og får ${b} kroner til. Omtrent hvor mye har ${nm} nå?`, sort:true, nums:true, expl:`${r10(a)} + ${r10(b)} = ${ans}.`});
   }},
   {t:'Moteksempel', d:'Finn eksemplet som viser at påstanden er feil.', n:10, make:(r, i) => {
     const k = i % 6, nm = pick(r, MT.NAMES);
     if(k === 0){ const a = int(r, 3, 9), p = shuf(r, [[2, 3], [3, 4], [2, 5], [4, 3], [5, 2], [6, 2]]).slice(0, 3);
       return Q.choice(r, `${nm} sier: «Når jeg ganger to tall, blir svaret alltid større enn begge tallene.» Hvilket regnestykke viser at ${nm} tar feil?`, `${a} × 1 = ${a}`, p.map(x => `${x[0]} × ${x[1]} = ${x[0] * x[1]}`), {say:`${nm} sier: Når jeg ganger to tall, blir svaret alltid større enn begge tallene. Hvilket regnestykke viser at ${nm} tar feil?`, expl:`${a} × 1 = ${a}. Det er ikke større enn ${a}.`}); }
     if(k === 1){ const a = int(r, 4, 9), p = shuf(r, [[12, 3], [20, 5], [24, 4], [18, 6], [16, 2]]).slice(0, 3);
       return Q.choice(r, `${nm} sier: «Når jeg deler, blir svaret alltid mindre enn tallet jeg deler.» Hvilket regnestykke viser at ${nm} tar feil?`, `${a} ÷ 1 = ${a}`, p.map(x => `${x[0]} ÷ ${x[1]} = ${x[0] / x[1]}`), {say:`${nm} sier: Når jeg deler, blir svaret alltid mindre enn tallet jeg deler. Hvilket regnestykke viser at ${nm} tar feil?`, expl:`${a} ÷ 1 = ${a}. Det er like stort, ikke mindre.`}); }
     if(k === 2){ const bad = pick(r, [5, 7, 11, 13, 17, 19, 23, 25]), good = shuf(r, [9, 15, 21, 27, 33]).slice(0, 3);
       return Q.choice(r, `${nm} sier: «Alle oddetall kan deles på 3 uten rest.» Hvilket tall viser at ${nm} tar feil?`, bad, good, {say:`${nm} sier: Alle oddetall kan deles på 3 uten rest. Hvilket tall viser at ${nm} tar feil?`, sort:true, nums:true, expl:`${bad} er et oddetall, men ${bad} kan ikke deles på 3 uten rest.`}); }
     if(k === 3){ const bad = pick(r, [6, 10, 14, 18, 22, 26]), good = shuf(r, [8, 12, 16, 20, 24, 28]).slice(0, 3);
       return Q.choice(r, `${nm} sier: «Alle partall kan deles på 4 uten rest.» Hvilket tall viser at ${nm} tar feil?`, bad, good, {say:`${nm} sier: Alle partall kan deles på 4 uten rest. Hvilket tall viser at ${nm} tar feil?`, sort:true, nums:true, expl:`${bad} er et partall, men ${bad} kan ikke deles på 4 uten rest.`}); }
     if(k === 4){ const a = int(r, 3, 9), p = shuf(r, [[4, 3], [5, 2], [6, 5], [7, 4]]).slice(0, 3);
       return Q.choice(r, `${nm} sier: «Når jeg legger sammen to tall, blir svaret alltid større enn begge tallene.» Hvilket regnestykke viser at ${nm} tar feil?`, `${a} + 0 = ${a}`, p.map(x => `${x[0]} + ${x[1]} = ${x[0] + x[1]}`), {say:`${nm} sier: Når jeg legger sammen to tall, blir svaret alltid større enn begge tallene. Hvilket regnestykke viser at ${nm} tar feil?`, expl:`${a} + 0 = ${a}. Det er ikke større.`}); }
     const a = int(r, 3, 9), p = shuf(r, [[9, 2], [8, 3], [12, 5], [15, 6]]).slice(0, 3);
     return Q.choice(r, `${nm} sier: «Når jeg trekker fra, blir svaret alltid mindre enn tallet jeg startet med.» Hvilket regnestykke viser at ${nm} tar feil?`, `${a} − 0 = ${a}`, p.map(x => `${x[0]} − ${x[1]} = ${x[0] - x[1]}`), {say:`${nm} sier: Når jeg trekker fra, blir svaret alltid mindre enn tallet jeg startet med. Hvilket regnestykke viser at ${nm} tar feil?`, expl:`${a} − 0 = ${a}. Det er like stort, ikke mindre.`});
   }},
   {t:'Forklar tenkemåten', d:'Bruk det du vet til å finne neste.', n:10, make:(r, i) => {
     const a = int(r, 3, 9), b = int(r, 3, 9), known = a * (b - 1), c = a * b;
     if(i % 2 === 0) return Q.choice(r, `Du vet at ${a} × ${b - 1} = ${known}. Hvordan finner du ${a} × ${b}?`, `${known} + ${a}`, [`${known} + ${b}`, `${known} + ${b - 1}`, `${known} × 2`].filter(x => x !== `${known} + ${a}`), {say:`Du vet at ${a} ganger ${b - 1} er ${known}. Hvordan finner du ${a} ganger ${b}?`, expl:`${a} × ${b} er én ${a}-er mer enn ${a} × ${b - 1}: ${known} + ${a} = ${c}.`});
     const dbl = a * b; return Q.choice(r, `Du vet at ${a} × ${b} = ${dbl}. Hvordan finner du ${a} × ${b * 2}?`, `${dbl} × 2`, [`${dbl} + 2`, `${dbl} + ${a}`, `${dbl} − ${a}`].filter(x => x !== `${dbl} × 2`), {say:`Du vet at ${a} ganger ${b} er ${dbl}. Hvordan finner du ${a} ganger ${b * 2}?`, expl:`${b * 2} er dobbelt så mye som ${b}, så svaret blir dobbelt så stort: ${dbl} × 2 = ${dbl * 2}.`});
   }}
  ]
});
})();
