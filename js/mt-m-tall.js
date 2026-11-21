(function(){
'use strict';
/* Moduler: tall og mengder (KM13241, KM13232, KM13230, KM13231, KM13233, KM13228, KM13229) */
const A = window.App, MT = window.MT, G = MT.G, Q = MT.Q, S = MT.S, B = MT.B;
const {int, pick, shuf} = MT, {sc, pop, fade, big, sub, row, chip, title} = S;
const NO = n => A.N.no(n), ORD = ['null', 'én', 'to', 'tre', 'fire', 'fem', 'seks', 'sju', 'åtte', 'ni', 'ti'];
const objsOf = (r, n, o) => { const t = pick(r, MT.THINGS); return G.objs(t[0], n, o); };
const NAMES = MT.NAMES;

/* ======================================================================
   1. Tall og mengder 0–10
   ====================================================================== */
MT.module({
  id:'mengde-10', rek:10, trinn:[1], maal:['KM13241'], tittel:'Tall og mengder 0–10', ikon:'🍎', bygger:[],
  video:[
   {html:title('🍎', 'Tall og mengder 0 til 10', S.sub('Hvor mange er det?', 1.2)),
    no:'Hei! Nå skal vi forstå hva et tall egentlig er. Et tall forteller oss hvor mange det er av noe. Vi starter helt i begynnelsen.'},
   {html:sc(S.pop(G.objs('🍎', 3, {s:'3rem'}), .2), S.big('1 · 2 · 3', 2.4), S.sub('Det er 3 epler', 4.4)),
    no:'Her er noen epler. Vi teller dem. Ett. To. Tre. Det er tre epler. Tallet tre forteller oss hvor mange epler det er.'},
   {html:sc(S.row(S.pop(G.objs('⭐', 4, {s:'2.2rem'}), .2), S.plus('1', 1.6), S.plus('2', 2.4), S.plus('3', 3.2), S.plus('4', 4)), S.sub('Det siste tallet vi sier, forteller hvor mange', 5.2)),
    no:'Når vi teller, sier vi ett tall for hvert ting. Vi hopper aldri over noe, og vi teller aldri det samme to ganger. Det siste tallet vi sier, forteller hvor mange det er. Her er det fire stjerner.'},
   {html:sc(S.row(S.pop(G.objs('🍎', 5, {s:'2.2rem'}), .2), S.pop(G.frame(5, 0, {s:30}), 1.2)), S.row(S.pop(G.eq('5', '#2563eb'), 2.2), S.pop(G.eq('fem', '#f97316'), 3.2)), S.sub('Samme tall – fire måter å vise det på', 4.4)),
    no:'Tallet fem kan vises på mange måter. Med fem epler. Med fem prikker. Med tallsymbolet 5. Og med tallordet fem. Alt betyr det samme: så mange. Vi kan oversette mellom dem.'},
   {html:sc(S.row(S.pop(G.objs('🐟', 6, {s:'2rem'}), .2), S.pop(G.objs('🌸', 6, {s:'2rem'}), 1.2)), S.big('6 = 6', 2.4), S.sub('Tallet bryr seg ikke om hva vi teller', 3.4)),
    no:'Seks fisker og seks blomster. Det er ikke de samme tingene, men det er like mange. Tallet seks passer til begge. Et tall handler bare om hvor mange.'},
   {html:sc(S.row(S.pop(G.frame(6, 0, {s:34}), .2), S.pop(G.frame(8, 0, {s:34}), 1.4)), S.sub('Tierrammen: se mengden uten å telle', 2.6)),
    no:'Tierrammen hjelper oss å se mengder. Den har ti ruter, fem på hver rad. Her er seks: en full rad og en til. Her er åtte: en full rad og tre. Når du har øvd, ser du tallet med én gang.'},
   {html:sc(S.row(S.pop('<div class="mtcard" style="--c:#9ca3af;font-size:2.4rem">🍽️</div>', .2), S.big('0', 1.2)), S.sub('Null betyr ingenting', 2.2)),
    no:'Og så har vi tallet null. Null betyr ingenting. Her er en tom tallerken. Det er null kaker. Null er også et tall.'},
   {html:sc(S.row(S.pop(G.frame(4, 0, {s:30}), .2), S.pop(G.frame(7, 0, {s:30}), 1.2)), S.big('7 er mer enn 4 · 4 er mindre enn 7', 2.2), S.sub('Hvor mange mangler til 10? 7 og 3 er 10', 3.6)),
    no:'Vi kan sammenligne mengder. Sju er mer enn fire. Fire er mindre enn sju. Og vi kan spørre: hvor mange mangler til ti? Fra sju mangler det tre. Sju og tre er ti.'},
   {html:sc(G.chips([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], {c:'#3b82f6'}), S.sub('Nå skal du øve!', 1.6)),
    no:'Nå kan du tallene fra null til ti. Du vet at et tall forteller hvor mange, at det kan vises på mange måter, og at du kan sammenligne. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal forstå at et tall forteller <b>hvor mange</b> det er, og kunne vise tallene 0–10 med tall, ord, tegning og ting.',
   steg:['Pek på ett ting om gangen og si ett tall for hver. Ikke hopp over noe, og ikke tell noe to ganger.', 'Det <b>siste</b> tallet du sier, er svaret på «hvor mange?».', 'Bruk tierrammen: fem på hver rad. Se rader og rest i stedet for å telle ett og ett.', 'Sammenlign: hvilken mengde har flest? Hvor mange mangler til 10?'],
   eks:[G.objs('🍎', 4) + ' &nbsp;=&nbsp; ' + G.frame(4, 0, {s:26}) + ' &nbsp;=&nbsp; <b style="font-size:1.6rem">4</b> &nbsp;=&nbsp; <b style="font-size:1.4rem">fire</b>', G.frame(7, 0, {s:26}) + ' &nbsp; 7 og <b>3</b> er 10'],
   ord:[['tall', 'forteller hvor mange'], ['tallsymbol', 'sifferet, for eksempel 6'], ['tallord', 'tallet skrevet som ord, for eksempel seks'], ['mengde', 'en samling av ting, for eksempel fem epler'], ['tierramme', 'ramme med ti ruter, fem på hver rad']],
   feil:['«Jeg teller 5 epler, men tallet er 6 fordi jeg sa seks til slutt» – sjekk at du peker på ett ting for hvert tall.', '«To epler er mindre enn to stjerner fordi stjerner er større» – tallet handler om hvor mange, ikke hvor store tingene er.'],
   laerer:'Før symbolene: la barnet telle med konkreter (knapper, kuler) og koble hvert tall til en mengde. Hovedpoenget er kardinalitet (siste tall = antall), at tallet er det samme uansett hva man teller, og at samme tall kan vises på flere måter (KM13241). Bruk tierrammen til å få barn til å se mengder uten å telle ett og ett (subitizing).'
  },
  refleksjon:'Vis tallet 6 på tre ulike måter. Hva er likt, og hva er ulikt?',
  nivaaer:[
   {t:'Forstå: hva forteller et tall?', d:'Sjekk at du har forstått hva et tall er.', kind:'forstaa', make:(r, i) => {
     const k = i % 4;
     if(k === 0){ const n = int(r, 3, 9), t = pick(r, MT.THINGS); return Q.near(r, `Du teller ${t[1]} og sier: ${Array.from({length:n}, (_, j) => j + 1).join(', ')}. Hvor mange ${t[1]} er det?`, n, {expl:`Det siste tallet vi sier, forteller hvor mange. Vi sa ${n} sist, så det er ${n}.`}); }
     if(k === 1){ const n = int(r, 2, 8), same = r() < .5, m = same ? n : n + pick(r, [-1, 1]); return Q.yn(`${G.objs('🍎', n)} ${G.objs('⭐', m)}<br>Er det like mange epler som stjerner?`, same, {say:'Er det like mange epler som stjerner?', expl:same ? `Begge har ${n}. Tallet bryr seg bare om hvor mange.` : `Epler: ${n}. Stjerner: ${m}. Ikke like mange.`}); }
     if(k === 2){ const n = int(r, 2, 9); return Q.choice(r, `Fem epler og fem biler. Hva er likt?`, 'Hvor mange det er', ['Hvor store de er', 'Hva de heter', 'Hvilken farge de har'], {say:'Fem epler og fem biler. Hva er likt?', expl:'Tallet fem forteller bare hvor mange. Eple og bil er ikke like, men det er like mange.'}); }
     return Q.choice(r, 'Hva betyr tallet 0?', 'Ingenting', ['Én', 'Alt', 'Mange'], {keep:false, expl:'Null betyr at det ikke er noe der. En tom tallerken har null kaker.'});
   }},
   {t:'Tell og les tall', d:'Tell mengder fra 0 til 10 på ulike måter.', n:10, make:(r, i) => {
     const n = i === 0 ? 0 : int(r, 1, 10), k = i % 3, stem = n === 0 ? G.frame(0, 0, {s:30}) : k === 0 ? objsOf(r, n, {per:5}) : k === 1 ? G.frame(n, 0, {s:30}) : G.scatter(pick(r, MT.THINGS)[0], n, int(r, 1, 9999), {w:300, h:110, s:32});
     const q = (i % 2) ? Q.num : (a, b, o) => Q.near(r, a, b, o);
     return q(`${stem}<br>Hvor mange er det? {?}`, n, {say:'Hvor mange er det?', expl:n ? `Tell: ett for hvert ting. Det er ${n}.` : 'Det er ingenting. Det er null.', hint:G.frame(n, 0, {s:26}) + '<br>Se på tierrammen: fem på hver rad.'});
   }},
   {t:'Tall, ord og tegning', d:'Oversett mellom tallsymbol, tallord og tegning.', n:10, make:(r, i) => {
     const n = int(r, 0, 10), k = i % 4, others = () => shuf(r, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(x => x !== n)).slice(0, 3);
     if(k === 0) return Q.choice(r, `Hvilket tall er <b>${ORD[n]}</b>?`, n, others(), {sort:true, nums:true, say:`Hvilket tall er ${NO(n)}?`, expl:`${ORD[n]} skrives ${n}.`});
     if(k === 1) return Q.choice(r, `Hvilket tallord passer til <b>${n}</b>?`, ORD[n], others().map(x => ORD[x]), {say:`Hvilket tallord passer til ${n}?`, expl:`Tallet ${n} heter ${ORD[n]}.`});
     if(k === 2){ const o = others().slice(0, 2); return Q.choice(r, `Hvilken tegning viser <b>${n}</b>?`, G.frame(n, 0, {s:20}), o.map(x => G.frame(x, 0, {s:20})), {say:`Hvilken tegning viser ${n}?`, key:`tegningen med ${n} prikker`, expl:`Tell prikkene. Det skal være ${n}.`}); }
     return Q.num(`${G.objs(pick(r, MT.THINGS)[0], n, {per:5})}<br>Skriv tallet som passer: {?}`, n, {say:'Skriv tallet som passer.', expl:`Tell tingene. Det er ${n}.`});
   }},
   {t:'Mer, mindre og hvor mange til 10', d:'Sammenlign mengder og finn hva som mangler.', n:10, make:(r, i) => {
     const k = i % 3;
     if(k === 0){ const a = int(r, 1, 9); let b = int(r, 1, 9); const t = pick(r, MT.THINGS); const ans = a > b ? 'Venstre' : a < b ? 'Høyre' : 'Like mange';
       return Q.choice(r, `${G.frame(a, 0, {s:22})} &nbsp; ${G.frame(b, 0, {s:22})}<br>Hvilken ramme har flest prikker?`, ans, ['Venstre', 'Høyre', 'Like mange'], {keep:true, say:'Hvilken ramme har flest prikker?', expl:`Venstre: ${a}. Høyre: ${b}.`}); }
     if(k === 1){ const a = int(r, 0, 9); return Q.num(`${G.frame(a, 0, {s:28})}<br>Hvor mange mangler for å få 10? {?}`, 10 - a, {say:'Hvor mange mangler for å få 10?', expl:`${a} og ${10 - a} er 10. Det mangler ${10 - a}.`, hint:G.frame(a, 10 - a, {s:26}) + '<br>Fyll opp rammen til den er full.'}); }
     const x = shuf(r, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 3), big = r() < .5;
     return Q.choice(r, `Hvilket tall er ${big ? '<b>størst</b>' : '<b>minst</b>'}? &nbsp; <b>${x.join(' &nbsp; ')}</b>`, big ? Math.max(...x) : Math.min(...x), x, {sort:true, nums:true, say:`Hvilket tall er ${big ? 'størst' : 'minst'}? ${x.join(', ')}`, expl:`${big ? 'Størst' : 'Minst'} er ${big ? Math.max(...x) : Math.min(...x)}.`});
   }}
  ]
});
})();
