(function(){
'use strict';
/* Moduler 3. trinn: strategier for addisjon og subtraksjon, sammenhengen mellom dem (KM13243, KM13244) */
const A = window.App, MT = window.MT, G = MT.G, Q = MT.Q, S = MT.S, B = MT.B, AR = MT.arith;
const {int, pick, shuf} = MT, {sc, pop, fade, big, sub, row, chip, title} = S;
const uniq = a => a.filter((x, i) => a.indexOf(x) === i);
const STRAT_ADD = ['Del opp i tiere og enere', 'Rund opp og juster', 'Doble og nesten-doble', 'Gi og ta (gjør det ene tallet til en tier)'];
const near10 = n => { const e = n % 10; return e >= 8 || e <= 1 && n > 10; };   // ender på 8, 9 (opp) eller 0/1

/* ======================================================================
   Strategier for addisjon (KM13243)
   ====================================================================== */
const addTask = (r, hard) => {
  const k = int(r, 0, 3);
  if(k === 0){ const a = int(r, 12, hard ? 78 : 58), b = int(r, 12, 40); return {a, b, s:0}; }                              // del opp
  if(k === 1){ const a = int(r, 21, hard ? 76 : 66), b = pick(r, [19, 29, 39, 49, 28, 38]); return {a, b, s:1}; }          // rund opp
  if(k === 2){ const a = int(r, 12, hard ? 49 : 39); return {a, b:a + pick(r, [0, 1, 1, 2]), s:2}; }                     // dobbel
  const a = pick(r, [38, 37, 28, 49, 58, 39, 48]), b = int(r, 23, 56); return {a, b, s:3};                                 // gi og ta
};
const stratIndex = (a, b) => (Math.abs(a - b) <= 2 && a >= 12) ? 2 : (near10(a) || near10(b)) ? (Math.min(a, b) % 10 >= 7 && Math.max(a, b) % 10 >= 7 ? 3 : 1) : 0;
MT.module({
  id:'strategier-addisjon', rek:100, trinn:[3], maal:['KM13243'], tittel:'Strategier for pluss: velg den lure måten', ikon:'🧮', bygger:['addisjon-tosifret', 'veksling-addisjon', 'gruppere-tre-tall'],
  video:[
   {html:title('🧮', 'Strategier for pluss', S.sub('Mange måter – velg den lureste', 1.2)),
    no:'Nå skal vi lære flere strategier for å legge sammen. En strategi er en måte å regne på. Du kan regne samme stykke på flere måter, og en god regner velger den som passer til tallene.'},
   {html:sc(S.row(S.pop(G.eq('47 + 26', '#2563eb'), .2)), S.row(S.pop(G.eq('40 + 20 = 60', '#16a34a'), 1.2), S.pop(G.eq('7 + 6 = 13', '#f97316'), 2)), S.big('60 + 13 = 73', 3), S.sub('Strategi 1: del opp i tiere og enere', 3.8)),
    no:'Strategi én: del opp i tiere og enere. Førtisju pluss tjueseks. Først tierne: førti pluss tjue er seksti. Så enerne: sju pluss seks er tretten. Seksti pluss tretten er syttitre.'},
   {html:sc(S.pop(G.nline(40, 80, {every:10, tick:5, marks:[{v:47, label:'47', c:'#16a34a'}], hops:[{a:47, b:67, label:'+20', c:'#f97316'}, {a:67, b:73, label:'+6', c:'#f97316'}], w:700}), .2), S.sub('Hopp: 47 + 20 = 67, 67 + 6 = 73', 1.6)),
    no:'Strategi to: hopp på tallinjen. Vi starter på førtisju og hopper tjue, til syttisju. Nei, til sekstisju. Så hopper vi seks til, og lander på syttitre. Vi kan hoppe tiere først og enere etterpå.'},
   {html:sc(S.row(S.pop(G.eq('48 + 29', '#2563eb'), .2)), S.row(S.pop(G.eq('29 er nesten 30', '#f97316'), 1)), S.row(S.pop(G.eq('48 + 30 = 78', '#16a34a'), 2), S.pop(G.eq('78 − 1 = 77', '#dc2626'), 3)), S.sub('Strategi 2: rund opp og juster', 3.8)),
    no:'Strategi tre: rund opp og juster. Førtiåtte pluss tjueni. Tjueni er nesten tretti. Førtiåtte pluss tretti er syttiåtte. Men vi la til én for mye, så vi trekker fra én. Svaret er syttisju.'},
   {html:sc(S.row(S.pop(G.eq('25 + 26', '#2563eb'), .2), S.pop(G.eq('25 + 25 = 50', '#16a34a'), 1.2), S.pop(G.eq('50 + 1 = 51', '#f97316'), 2.2)), S.sub('Strategi 3: doble og nesten-doble', 3.2)),
    no:'Strategi fire: doble og nesten-doble. Tjuefem pluss tjueseks er nesten dobbelt av tjuefem. Tjuefem pluss tjuefem er femti. Så legger vi til én. Svaret er femtien.'},
   {html:sc(S.row(S.pop(G.eq('38 + 45', '#2563eb'), .2), S.pop(G.eq('gi 2 fra 45 til 38', '#f97316'), 1.2)), S.row(S.pop(G.eq('40 + 43 = 83', '#16a34a'), 2.2)), S.sub('Strategi 4: gi og ta – gjør ett tall til en tier', 3.2)),
    no:'Strategi fem: gi og ta. Trettiåtte pluss førtifem. Vi tar to fra førtifem og gir dem til trettiåtte. Da blir det førti pluss førtitre. Det er enkelt: åttitre. Summen blir den samme.'},
   {html:sc(S.row(S.pop(G.eq('34 + 25 → del opp', '#2563eb'), .2)), S.row(S.pop(G.eq('59 + 37 → rund opp', '#f97316'), 1.2)), S.row(S.pop(G.eq('35 + 36 → nesten-dobbel', '#16a34a'), 2.2)), S.sub('Se på tallene først – velg så strategi', 3.4)),
    no:'Hvordan velger vi? Se på tallene først. Trettifire pluss tjuefem passer for å dele opp. Femtini pluss trettisju har et tall nesten på en tier, så rund opp. Trettifem pluss trettiseks er nesten dobbelt.'},
   {html:sc(S.big('Overslag: er svaret rimelig?', .2), S.row(S.pop(G.eq('59 + 37 ≈ 60 + 40 = 100', '#16a34a'), 1.2)), S.sub('Nå øver vi!', 2.4)),
    no:'Husk å sjekke at svaret er rimelig. Femtini pluss trettisju er omtrent seksti pluss førti, altså hundre. Da vet vi at svaret ikke kan være åtti eller hundre og tjue. Nå skal du øve på strategier!'}
  ],
  tekst:{
   mal:'Du skal bruke hensiktsmessige <b>strategier</b> for addisjon til å regne og løse problemer, og forklare hvorfor strategien virker.',
   steg:['<b>Del opp:</b> tiere for seg, enere for seg: 47 + 26 = (40 + 20) + (7 + 6) = 60 + 13 = 73.', '<b>Rund opp og juster:</b> 48 + 29 = 48 + 30 − 1 = 77.', '<b>Doble og nesten-doble:</b> 25 + 26 = 25 + 25 + 1 = 51.', '<b>Gi og ta:</b> 38 + 45 = 40 + 43 = 83.', '<b>Se på tallene først</b>, velg strategi, og sjekk at svaret er rimelig (overslag).'],
   eks:['47 + 26: 40 + 20 = 60, 7 + 6 = 13, 73', '48 + 29: 48 + 30 = 78, 78 − 1 = 77', '25 + 26: 25 + 25 = 50, 50 + 1 = 51'],
   ord:[['strategi', 'en måte å regne på'], ['overslag', 'en rask omtrentlig utregning for å sjekke'], ['kompensere', 'justere tilbake etter å ha rundet av']],
   feil:['«48 + 29 = 48 + 30 = 78» – du la til én for mye; trekk fra 1: 77.', '«Det finnes bare én riktig strategi» – flere kan gi riktig svar; velg den som er lettest for tallene.'],
   laerer:'KM13243: velge hensiktsmessige strategier for addisjon og subtraksjon i problemer fra lek og hverdag. Poenget er fleksibilitet og begrunnelse, ikke at alle bruker samme metode. La elevene forklare «hvorfor virker det?» med tallinje, klosser eller regnestykket skrevet ut. Oppstilling (skriftlig regning) er en strategi til, og beskrives i modulene før denne.'
  },
  refleksjon:'Regn 59 + 36 på to ulike måter. Hvilken var lettest, og hvorfor?',
  nivaaer:[
   {t:'Forstå: hvorfor virker strategiene?', d:'Sjekk at du har forstått strategiene.', kind:'forstaa', make:(r, i) => {
     const k = i % 6, a = pick(r, [28, 38, 48, 58, 68]), b = pick(r, [19, 29, 39]), x = int(r, 12, 44);
     if(k === 0) return Q.yn(`Er ${a} + ${b} det samme som ${a} + ${b + 1} − 1?`, true, {expl:`Ja: ${b + 1} er 1 mer enn ${b}, så vi trekker fra 1 igjen.`});
     if(k === 1) return Q.yn(`Er ${x} + ${x + 1} det samme som ${x} + ${x} + 1?`, true, {expl:`Ja. ${x + 1} er ${x} + 1.`});
     if(k === 2) return Q.choice(r, `${a} + ${b}: hva er lurt?`, 'Runde opp og justere', ['Dele i enere og tiere hver for seg', 'Doble tallet', 'Telle fra 1'], {keep:false, say:`${a} pluss ${b}. Hva er lurt?`, expl:`${b} er nesten ${b + 1}, så ${a} + ${b + 1} − 1 er enkelt.`});
     if(k === 3) return Q.choice(r, 'Hva er en strategi?', 'En måte å regne på', ['Et svar', 'Et regnetegn', 'En tallrekke'], {expl:'En strategi er en måte å regne et stykke på.'});
     if(k === 4) return Q.yn(`Gir 40 + 20 + 7 + 6 samme sum som 47 + 26?`, true, {expl:'Ja: 47 = 40 + 7 og 26 = 20 + 6.'});
     return Q.yn('Kan samme stykke regnes på flere måter?', true, {expl:'Ja. Velg den som passer best til tallene.'});
   }},
   {t:'Del opp i tiere og enere', d:'Tiere for seg og enere for seg.', n:10, make:(r, i) => {
     const a = int(r, 21, 68), b = int(r, 12, 39), ta = Math.floor(a / 10) * 10, tb = Math.floor(b / 10) * 10, ea = a % 10, eb = b % 10; if(a + b > 120) return null;
     if(i % 3 === 0) return Q.num(`${a} + ${b}: tierne ${ta} + ${tb} = {?}`, ta + tb, {say:`${a} pluss ${b}. Tierne ${ta} pluss ${tb} er?`, calc:`${ta}+${tb}`, expl:`${ta} + ${tb} = ${ta + tb}.`});
     if(i % 3 === 1) return Q.num(`${a} + ${b}: enerne ${ea} + ${eb} = {?}`, ea + eb, {say:`${a} pluss ${b}. Enerne ${ea} pluss ${eb} er?`, calc:`${ea}+${eb}`, expl:`${ea} + ${eb} = ${ea + eb}.`});
     return Q.num(`${a} + ${b} = {?}`, a + b, {say:`${a} pluss ${b}`, calc:`${a}+${b}`, expl:`${ta} + ${tb} = ${ta + tb}, ${ea} + ${eb} = ${ea + eb}, ${ta + tb} + ${ea + eb} = ${a + b}.`, hint:`Del opp: ${ta} + ${tb} og ${ea} + ${eb}.`});
   }},
   {t:'Rund opp og juster', d:'Gjør det ene tallet til en tier – juster etterpå.', n:10, make:(r, i) => {
     const a = int(r, 21, 66), b = pick(r, [19, 29, 39, 49, 28, 38]), up = Math.ceil(b / 10) * 10, d = up - b;
     if(i % 3 === 0) return Q.num(`${a} + ${b} = ${a} + ${up} − ${d}. ${a} + ${up} = {?}`, a + up, {say:`${a} pluss ${b} er ${a} pluss ${up} minus ${d}. Hva er ${a} pluss ${up}?`, calc:`${a}+${up}`, expl:`${a} + ${up} = ${a + up}.`});
     if(i % 3 === 1) return Q.num(`${a} + ${b}: først ${a + up}. Så trekker du fra ${d}. Svaret er {?}`, a + b, {say:`${a} pluss ${b}: først ${a + up}. Så trekker du fra ${d}. Hva er svaret?`, calc:`${a}+${b}`, expl:`${a + up} − ${d} = ${a + b}.`});
     return Q.num(`${a} + ${b} = {?}`, a + b, {say:`${a} pluss ${b}`, calc:`${a}+${b}`, expl:`${a} + ${up} = ${a + up}, og ${a + up} − ${d} = ${a + b}.`, hint:`${b} er nesten ${up}. Regn ${a} + ${up}, og trekk fra ${d}.`});
   }},
   {t:'Doble og nesten-doble', d:'Bruk at to like tall er lett å legge sammen.', n:10, make:(r, i) => {
     const x = int(r, 12, 49), e = pick(r, [0, 1, 1, 2]), b = x + e;
     if(i % 3 === 0) return Q.num(`${x} + ${x} = {?}`, 2 * x, {say:`${x} pluss ${x}`, calc:`${x}+${x}`, expl:`Dobbelt av ${x} er ${2 * x}.`});
     if(i % 3 === 1 && e) return Q.num(`${x} + ${b} = ${x} + ${x} + ${e}. ${x} + ${x} = {?}`, 2 * x, {say:`${x} pluss ${b} er ${x} pluss ${x} pluss ${e}. Hva er ${x} pluss ${x}?`, calc:`${x}+${x}`, expl:`${x} + ${x} = ${2 * x}.`});
     return Q.num(`${x} + ${b} = {?}`, x + b, {say:`${x} pluss ${b}`, calc:`${x}+${b}`, expl:`${x} + ${x} = ${2 * x}, og ${e} til: ${x + b}.`, hint:`Dobbelt av ${x} er ${2 * x}.`});
   }},
   {t:'Velg strategi', d:'Se på tallene og velg den lureste måten.', n:10, make:(r, i) => {
     const t = addTask(r, false), a = t.a, b = t.b, names = ['Del opp i tiere og enere', 'Rund opp og juster', 'Doble og nesten-doble'];
     const idx = (Math.abs(a - b) <= 2) ? 2 : (b % 10 >= 8) ? 1 : 0; if(a + b > 140) return null;
     return Q.choice(r, `Hvilken strategi passer best for <b>${a} + ${b}</b>?`, names[idx], names.filter((_, j) => j !== idx), {say:`Hvilken strategi passer best for ${a} pluss ${b}?`, expl:idx === 2 ? `${a} og ${b} er nesten like: dobbel og juster.` : idx === 1 ? `${b} er nesten ${Math.ceil(b / 10) * 10}: rund opp og juster.` : `Her kan vi dele opp i tiere og enere.`});
   }},
   {t:'Regn selv med en strategi', d:'Regn pluss med strategien du velger, og sjekk med overslag.', n:12, make:(r, i) => {
     const t = addTask(r, true), a = t.a, b = t.b; if(a + b > 150) return null;
     if(i % 4 === 3) return Q.yn(`Overslag: ${a} + ${b} er omtrent ${Math.round(a / 10) * 10 + Math.round(b / 10) * 10}. Er det rimelig at svaret er ${a + b + 10 * pick(r, [1, 2])}?`, false, {say:`Overslag: ${a} pluss ${b} er omtrent ${Math.round(a / 10) * 10 + Math.round(b / 10) * 10}. Er det rimelig at svaret er ${a + b + 20}?`, expl:`Riktig svar er ${a + b}.`});
     return Q.num(`${a} + ${b} = {?}`, a + b, {say:`${a} pluss ${b}`, calc:`${a}+${b}`, expl:`${a} + ${b} = ${a + b}. Overslag: ${Math.round(a / 10) * 10} + ${Math.round(b / 10) * 10} = ${Math.round(a / 10) * 10 + Math.round(b / 10) * 10}.`});
   }}
  ],
  drill:{tittel:'Pluss med to- og tresifrede tall', layout:'row', cols:4, n:[56, 30], make:(r, i, hard) => { const t = addTask(r, hard), a = t.a + (hard && r() < .4 ? 100 : 0), b = t.b; if(a + b > 199) return null; return {t:`${a} + ${b} =`, ans:a + b}; }}
});

/* ======================================================================
   Strategier for subtraksjon (KM13243)
   ====================================================================== */
const subTask = (r, hard) => {
  const k = int(r, 0, 3);
  if(k === 0){ const a = int(r, 41, hard ? 98 : 88), b = int(r, 13, 38); if(a - b < 5 || (a % 10 >= b % 10)) return null; return {a, b, s:0}; }
  if(k === 1){ const b = pick(r, [19, 29, 39, 28, 38, 18]), a = int(r, 51, hard ? 98 : 88); return {a, b, s:1}; }
  if(k === 2){ const b = int(r, 31, 88), a = b + int(r, 3, 9); return {a, b, s:2}; }
  const a = pick(r, [100, 100, 90, 80, 70]), b = int(r, 12, 68); return {a, b, s:2};
};
MT.module({
  id:'strategier-subtraksjon', rek:102, trinn:[3], maal:['KM13243'], tittel:'Strategier for minus: telle opp, runde og dele', ikon:'🔻', bygger:['subtraksjon-tosifret', 'veksling-subtraksjon', 'strategier-addisjon'],
  video:[
   {html:title('🔻', 'Strategier for minus', S.sub('Mange måter – velg den lureste', 1.2)),
    no:'Nå skal vi lære strategier for å trekke fra. Akkurat som i pluss finnes det flere måter å regne på, og du kan velge den som passer best.'},
   {html:sc(S.row(S.pop(G.eq('74 − 38', '#2563eb'), .2)), S.row(S.pop(G.eq('74 − 30 = 44', '#16a34a'), 1.2), S.pop(G.eq('44 − 8 = 36', '#f97316'), 2.2)), S.sub('Strategi 1: trekk fra i to steg – tiere først, så enere', 3.2)),
    no:'Strategi én: trekk fra i to steg. Syttifire minus trettiåtte. Først trekker vi fra tretti: det blir førtifire. Så trekker vi fra åtte: det blir trettiseks.'},
   {html:sc(S.row(S.pop(G.eq('63 − 29', '#2563eb'), .2)), S.row(S.pop(G.eq('63 − 30 = 33', '#16a34a'), 1.2), S.pop(G.eq('33 + 1 = 34', '#dc2626'), 2.2)), S.sub('Strategi 2: rund opp og juster – trakk fra 1 for mye, så legg til 1', 3.2)),
    no:'Strategi to: rund opp og juster. Sekstitre minus tjueni. Tjueni er nesten tretti. Sekstitre minus tretti er trettitre. Men vi trakk fra én for mye, så vi legger til én. Svaret er trettifire.'},
   {html:sc(S.pop(G.nline(76, 84, {marks:[{v:78, label:'78', c:'#16a34a'}, {v:82, label:'82', c:'#2563eb'}], hops:[{a:78, b:80, label:'+2', c:'#f97316'}, {a:80, b:82, label:'+2', c:'#f97316'}], w:560}), .2), S.sub('82 − 78: hvor langt er det fra 78 til 82? 2 + 2 = 4', 1.6)),
    no:'Strategi tre: tell opp. Åttito minus syttiåtte. Tallene ligger nær hverandre. Vi spør: hvor langt er det fra syttiåtte til åttito? Fra syttiåtte til åtti er to. Fra åtti til åttito er to. To pluss to er fire.'},
   {html:sc(S.pop(G.nline(0, 100, {every:10, tick:5, marks:[{v:37, label:'37', c:'#16a34a'}], hops:[{a:37, b:40, label:'+3', c:'#f97316'}, {a:40, b:100, label:'+60', c:'#f97316'}], w:700}), .2), S.sub('100 − 37: 3 + 60 = 63', 1.6)),
    no:'Tell opp er smart når vi trekker fra hundre. Hundre minus trettisju. Fra trettisju til førti er tre. Fra førti til hundre er seksti. Tre pluss seksti er sekstitre.'},
   {html:sc(S.row(S.pop(G.eq('82 − 39', '#2563eb'), .2)), S.row(S.pop(G.eq('+1 på begge', '#f97316'), 1.2), S.pop(G.eq('83 − 40 = 43', '#16a34a'), 2.2)), S.sub('Strategi 4: lik forskjell – forskjellen blir den samme', 3.2)),
    no:'Strategi fire: lik forskjell. Åttito minus trettini. Vi legger til én på begge tallene. Åttitre minus førti. Det er lett: førtitre. Forskjellen mellom tallene er den samme.'},
   {html:sc(S.row(S.pop(G.eq('74 − 38 → to steg', '#2563eb'), .2)), S.row(S.pop(G.eq('63 − 29 → rund opp', '#f97316'), 1.2)), S.row(S.pop(G.eq('82 − 78 → tell opp', '#16a34a'), 2.2)), S.sub('Se på tallene først – velg så strategi', 3.4)),
    no:'Hvordan velger vi? Er tallene nær hverandre, teller vi opp. Er det ene tallet nesten en tier, runder vi. Ellers trekker vi fra i to steg.'},
   {html:sc(S.big('Sjekk med pluss: svaret + tallet = det du startet med', .2), S.sub('Nå øver vi!', 1.4)),
    no:'Husk å sjekke med pluss. Trettiseks pluss trettiåtte er syttifire. Da stemmer det. Nå skal du øve på strategier for minus!'}
  ],
  tekst:{
   mal:'Du skal bruke hensiktsmessige <b>strategier</b> for subtraksjon, og forklare hvorfor de virker.',
   steg:['<b>To steg:</b> 74 − 38 = 74 − 30 − 8 = 44 − 8 = 36.', '<b>Rund opp og juster:</b> 63 − 29 = 63 − 30 + 1 = 34.', '<b>Tell opp:</b> 82 − 78: hvor langt fra 78 til 82? 2 + 2 = 4. Også 100 − 37 = 3 + 60 = 63.', '<b>Lik forskjell:</b> 82 − 39 = 83 − 40 = 43.', 'Se på tallene først. <b>Sjekk med pluss.</b>'],
   eks:['74 − 38: 74 − 30 = 44, 44 − 8 = 36', '63 − 29: 63 − 30 = 33, 33 + 1 = 34', '82 − 78: 78 → 80 → 82: 2 + 2 = 4'],
   ord:[['differanse', 'forskjellen mellom to tall'], ['tell opp', 'finne forskjellen ved å telle fra det minste til det største tallet'], ['kontroll', 'sjekke svaret med motsatt regneart']],
   feil:['«63 − 29 = 63 − 30 = 33» – du trakk fra én for mye; legg til 1: 34.', '«Jeg trekker alltid det minste fra det største i hver kolonne» – i oppstilling må det øverste tallet være størst; bruk veksling.'],
   laerer:'KM13243: strategier for subtraksjon i hoderegning. «Tell opp» er særlig effektiv når tallene er nær hverandre eller når du trekker fra 100. Be elevene velge strategi etter tallene og begrunne. Koble til tallinja.'
  },
  refleksjon:'Hvordan regner du 100 − 37 på en lur måte? Forklar med tallinja.',
  nivaaer:[
   {t:'Forstå: hvorfor virker strategiene?', d:'Sjekk at du har forstått.', kind:'forstaa', make:(r, i) => {
     const k = i % 6, a = int(r, 51, 90), b = pick(r, [19, 29, 39]);
     if(k === 0) return Q.yn(`Er ${a} − ${b} det samme som ${a} − ${b + 1} + 1?`, true, {expl:`Ja: ${b + 1} er 1 mer enn ${b}. Da trakk vi fra 1 for mye, og legger til 1.`});
     if(k === 1) return Q.yn(`Er 100 − 37 det samme som å telle opp fra 37 til 100?`, true, {expl:'Ja. Forskjellen er hvor langt det er fra 37 til 100.'});
     if(k === 2) return Q.choice(r, '82 − 78: hva er lurt?', 'Telle opp fra 78 til 82', ['Dele i tiere og enere', 'Doble tallet', 'Runde opp 82 til 100'], {say:'Åttito minus syttiåtte. Hva er lurt?', expl:'Tallene er nær hverandre: forskjellen er 4.'});
     if(k === 3) return Q.yn('Er 82 − 39 det samme som 83 − 40?', true, {expl:'Ja. Legger vi 1 til begge tallene, blir forskjellen den samme.'});
     if(k === 4) return Q.choice(r, 'Hvordan kan du sjekke et minusstykke?', 'Legge til: svaret + tallet du trakk fra', ['Trekke fra en gang til', 'Dele på to', 'Gjette'], {expl:'Hvis 36 + 38 = 74, stemmer 74 − 38 = 36.'});
     return Q.yn('Kan samme minusstykke regnes på flere måter?', true, {expl:'Ja. Velg den som passer best.'});
   }},
   {t:'Trekk fra i to steg', d:'Tiere først, så enere.', n:10, make:(r, i) => {
     const a = int(r, 51, 98), b = int(r, 12, 48), tb = Math.floor(b / 10) * 10, eb = b % 10; if(a - b < 3) return null;
     if(i % 3 === 0) return Q.num(`${a} − ${b}: først ${a} − ${tb} = {?}`, a - tb, {say:`${a} minus ${b}. Først ${a} minus ${tb}.`, calc:`${a}-${tb}`, expl:`${a} − ${tb} = ${a - tb}.`});
     if(i % 3 === 1) return Q.num(`${a} − ${b}: ${a - tb} − ${eb} = {?}`, a - b, {say:`${a} minus ${b}. ${a - tb} minus ${eb}.`, calc:`${a - tb}-${eb}`, expl:`${a - tb} − ${eb} = ${a - b}.`});
     return Q.num(`${a} − ${b} = {?}`, a - b, {say:`${a} minus ${b}`, calc:`${a}-${b}`, expl:`${a} − ${tb} = ${a - tb}, ${a - tb} − ${eb} = ${a - b}.`, hint:`Trekk fra ${tb} først, så ${eb}.`});
   }},
   {t:'Rund opp og juster', d:'Trekk fra en tier, og juster etterpå.', n:10, make:(r, i) => {
     const a = int(r, 51, 98), b = pick(r, [19, 29, 39, 28, 38, 18]), up = Math.ceil(b / 10) * 10, d = up - b;
     if(i % 3 === 0) return Q.num(`${a} − ${b} = ${a} − ${up} + ${d}. ${a} − ${up} = {?}`, a - up, {say:`${a} minus ${b} er ${a} minus ${up} pluss ${d}. Hva er ${a} minus ${up}?`, calc:`${a}-${up}`, expl:`${a} − ${up} = ${a - up}.`});
     if(i % 3 === 1) return Q.num(`${a} − ${b}: først ${a - up}. Så legger du til ${d}. Svaret er {?}`, a - b, {say:`${a} minus ${b}: først ${a - up}. Så legger du til ${d}. Hva er svaret?`, calc:`${a}-${b}`, expl:`${a - up} + ${d} = ${a - b}.`});
     return Q.num(`${a} − ${b} = {?}`, a - b, {say:`${a} minus ${b}`, calc:`${a}-${b}`, expl:`${a} − ${up} = ${a - up}, ${a - up} + ${d} = ${a - b}.`, hint:`${b} er nesten ${up}. Trekk fra ${up} og legg til ${d}.`});
   }},
   {t:'Tell opp til tallet', d:'Finn forskjellen ved å telle opp.', n:10, make:(r, i) => {
     if(i % 2 === 0){ const b = int(r, 31, 88), a = b + int(r, 3, 9); const to10 = Math.ceil(b / 10) * 10; if(to10 >= a) return null; return Q.num(`${a} − ${b}: hvor langt er det fra ${b} til ${a}? {?}`, a - b, {say:`${a} minus ${b}. Hvor langt er det fra ${b} til ${a}?`, calc:`${a}-${b}`, expl:`${b} → ${to10} er ${to10 - b}, ${to10} → ${a} er ${a - to10}: ${a - b}.`, hint:G.nline(b - 1, a + 1, {marks:[{v:b, label:b, c:'#16a34a'}, {v:a, label:a, c:'#2563eb'}], w:520, every:1})}); }
     const b = int(r, 12, 68), a = pick(r, [100, 100, 90]); const to10 = Math.ceil(b / 10) * 10; return Q.num(`${a} − ${b} = {?}`, a - b, {say:`${a} minus ${b}`, calc:`${a}-${b}`, expl:`${b} → ${to10}: ${to10 - b}. ${to10} → ${a}: ${a - to10}. Til sammen ${a - b}.`, hint:`Tell opp: først til neste tier (${to10}), så til ${a}.`});
   }},
   {t:'Velg strategi', d:'Se på tallene og velg den lureste måten.', n:10, make:(r, i) => {
     const t = subTask(r, false); if(!t) return null; const a = t.a, b = t.b, names = ['Trekke fra i to steg', 'Runde opp og justere', 'Telle opp'];
     const idx = (a - b <= 12) ? 2 : (b % 10 >= 8) ? 1 : 0; if(a - b < 2) return null;
     return Q.choice(r, `Hvilken strategi passer best for <b>${a} − ${b}</b>?`, names[idx], names.filter((_, j) => j !== idx), {say:`Hvilken strategi passer best for ${a} minus ${b}?`, expl:idx === 2 ? `Tallene er nær hverandre (forskjell ${a - b}): tell opp.` : idx === 1 ? `${b} er nesten ${Math.ceil(b / 10) * 10}: runde opp og justere.` : 'Her passer det å trekke fra tiere først, så enere.'});
   }},
   {t:'Regn selv og sjekk', d:'Regn minus med strategi, og sjekk med pluss.', n:12, make:(r, i) => {
     const t = subTask(r, true); if(!t) return null; const a = t.a, b = t.b; if(a - b < 2) return null;
     if(i % 4 === 3) return Q.yn(`${a} − ${b} = ${a - b + pick(r, [1, 2, 10])}. Sjekk med pluss. Stemmer det?`, false, {say:`${a} minus ${b} er ${a - b + 1}. Sjekk med pluss. Stemmer det?`, expl:`Riktig svar er ${a - b}, for ${a - b} + ${b} = ${a}.`});
     return Q.num(`${a} − ${b} = {?}`, a - b, {say:`${a} minus ${b}`, calc:`${a}-${b}`, expl:`${a} − ${b} = ${a - b}. Sjekk: ${a - b} + ${b} = ${a}.`});
   }}
  ],
  drill:{tittel:'Minus med to- og tresifrede tall', layout:'row', cols:4, n:[56, 30], make:(r, i, hard) => { const t = subTask(r, hard); if(!t) return null; const a = t.a + (hard && r() < .4 ? 100 : 0); if(a - t.b < 2) return null; return {t:`${a} − ${t.b} =`, ans:a - t.b}; }}
});

/* ======================================================================
   Sammenhengen mellom addisjon og subtraksjon (KM13244)
   ====================================================================== */
const famNums = r => { const a = int(r, 12, 59), b = int(r, 12, 59); return [a, b, a + b]; };
MT.module({
  id:'add-sub-sammenheng', rek:104, trinn:[3], maal:['KM13244'], tittel:'Pluss og minus hører sammen', ikon:'🔗', bygger:['strategier-addisjon', 'strategier-subtraksjon', 'oppstilling-subtraksjon'],
  video:[
   {html:title('🔗', 'Pluss og minus hører sammen', S.sub('Motsatte regnearter', 1.2)),
    no:'Nå skal vi utforske hvordan addisjon og subtraksjon henger sammen. Det er den store ideen som gjør at vi kan sjekke svar og regne på lure måter.'},
   {html:sc(S.pop(G.bar(65, 38, 27, {w:320}), .2), S.row(S.pop(G.eq('38 + 27 = 65', '#16a34a'), 1.2), S.pop(G.eq('27 + 38 = 65', '#16a34a'), 1.8)), S.row(S.pop(G.eq('65 − 27 = 38', '#dc2626'), 2.6), S.pop(G.eq('65 − 38 = 27', '#dc2626'), 3.2))),
    no:'Her er tre tall som hører sammen: trettiåtte, tjuesju og sekstifem. To deler gir en hel. Trettiåtte pluss tjuesju er sekstifem. Og motsatt: sekstifem minus tjuesju er trettiåtte. Dette er en regnefamilie.'},
   {html:sc(S.pop(G.bar(65, 38, 27, {w:320, q:1}), .2), S.row(S.pop(G.eq('38 + ☐ = 65', '#2563eb'), 1.2)), S.row(S.pop(G.eq('65 − 38 = 27', '#dc2626'), 2.2)), S.sub('Ukjent tall: bruk det motsatte', 3)),
    no:'Når et tall mangler, bruker vi det motsatte. Trettiåtte pluss hva er sekstifem? Vi regner sekstifem minus trettiåtte. Det er tjuesju. Ukjent ledd i pluss finner vi med minus.'},
   {html:sc(S.row(S.pop(G.eq('☐ − 27 = 38', '#2563eb'), .2)), S.row(S.pop(G.eq('38 + 27 = 65', '#16a34a'), 1.2)), S.sub('Ukjent tall i minus: bruk pluss', 2)),
    no:'Det virker også andre veien. Hva minus tjuesju er trettiåtte? Vi tenker pluss: trettiåtte pluss tjuesju er sekstifem. Det som manglet var sekstifem.'},
   {html:sc(S.pop(G.col('+', 38, 27, {ans:65, carry:{t:'1'}}), .2), S.sub('Sjekk: 65 − 27 = 38 ✔', 1.6)),
    no:'Vi kan bruke dette til å sjekke svar. Her har vi regnet i oppstilling: trettiåtte pluss tjuesju er sekstifem. Sjekk med minus: sekstifem minus tjuesju er trettiåtte. Da stemmer det.'},
   {html:sc(S.row(S.pop(G.eq('91 − 86', '#2563eb'), .2)), S.row(S.pop(G.eq('86 + ☐ = 91', '#f97316'), 1.2)), S.big('☐ = 5', 2.2), S.sub('Lurt: tenk pluss når tallene er nær hverandre', 3)),
    no:'Vi kan bruke sammenhengen til å regne lurt. Nitti-en minus åttiseks. I stedet for å trekke fra kan vi tenke: åttiseks pluss hva er nitti-en? Fem. Derfor er svaret fem.'},
   {html:sc(S.pop(G.nline(86, 91, {marks:[{v:86, label:'86', c:'#16a34a'}, {v:91, label:'91', c:'#2563eb'}], hops:[{a:86, b:91, label:'5', c:'#f97316'}], w:520}), .2), S.sub('Forskjellen er avstanden mellom tallene', 1.6)),
    no:'På tallinja ser vi det tydelig. Avstanden fra åttiseks til nitti-en er fem. Så pluss og minus handler om det samme: avstanden mellom to tall.'},
   {html:sc(S.big('Pluss ↔ minus: motsatte regnearter', .2), S.sub('Nå øver vi!', 1.4)),
    no:'Husk: addisjon og subtraksjon er motsatte regnearter. Bruk det til å finne ukjente tall, til å sjekke svar og til å regne lurt. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal forklare og utforske <b>sammenhengene mellom addisjon og subtraksjon</b> i hoderegning og skriftlig regning.',
   steg:['<b>Regnefamilie:</b> 38 + 27 = 65, 27 + 38 = 65, 65 − 27 = 38, 65 − 38 = 27.', '<b>Ukjent ledd i pluss:</b> 38 + ☐ = 65 → ☐ = 65 − 38.', '<b>Ukjent tall i minus:</b> ☐ − 27 = 38 → ☐ = 38 + 27. Og 65 − ☐ = 27 → ☐ = 65 − 27.', '<b>Sjekk svaret</b> med motsatt regneart.', '<b>Lurt:</b> 91 − 86 → 86 + ☐ = 91 → 5.'],
   eks:[G.bar(65, 38, 27, {w:240}) + '<br>38 + 27 = 65 · 65 − 27 = 38', '91 − 86 = 5 fordi 86 + 5 = 91'],
   ord:[['motsatt regneart', 'pluss og minus opphever hverandre'], ['regnefamilie', 'fire regnestykker med de samme tre tallene'], ['kontroll', 'sjekke svaret med motsatt regneart']],
   feil:['«☐ − 27 = 38 → ☐ = 38 − 27» – motsatt av minus er pluss: 38 + 27 = 65.', '«65 − 27 = 27 − 65» – i minus kan vi ikke bytte rekkefølge.'],
   laerer:'KM13244: forklare og utforske sammenhenger mellom addisjon og subtraksjon i hoderegning og skriftlig regning. Bruk stangmodell og tallinje. Kontroll med motsatt regneart er et viktig vurderingsverktøy elevene selv kan bruke.'
  },
  refleksjon:'Forklar hvorfor du kan sjekke 65 − 27 = 38 ved å regne 38 + 27.',
  nivaaer:[
   {t:'Forstå: motsatte regnearter', d:'Sjekk at du har forstått sammenhengen.', kind:'forstaa', make:(r, i) => {
     const [a, b, c] = famNums(r), k = i % 6;
     if(k === 0) return Q.yn(`${a} + ${b} = ${c}. Betyr det at ${c} − ${b} = ${a}?`, true, {expl:'Ja. Pluss og minus er motsatte regnearter.'});
     if(k === 1) return Q.yn(`${a} + ${b} = ${c}. Betyr det at ${c} − ${c} = ${a}?`, false, {expl:`Nei. ${c} − ${c} = 0. Riktig: ${c} − ${b} = ${a} eller ${c} − ${a} = ${b}.`});
     if(k === 2) return Q.choice(r, `Hvordan finner du ☐ i ${a} + ☐ = ${c}?`, `${c} − ${a}`, [`${c} + ${a}`, `${a} − ${c}`, `${a} + ${c}`], {say:`Hvordan finner du hva som mangler i ${a} pluss hva er ${c}?`, expl:`Det motsatte av pluss er minus: ${c} − ${a} = ${b}.`});
     if(k === 3) return Q.choice(r, `Hvordan finner du ☐ i ☐ − ${b} = ${a}?`, `${a} + ${b}`, [`${a} − ${b}`, `${b} − ${a}`, `${c} − ${b}`].filter(x => x !== `${a} + ${b}`), {say:`Hvordan finner du hva som mangler i hva minus ${b} er ${a}?`, expl:`Det motsatte av minus er pluss: ${a} + ${b} = ${c}.`});
     if(k === 4) return Q.choice(r, 'Hvordan sjekker du at 65 − 27 = 38?', 'Regne 38 + 27', ['Regne 65 − 38 en gang til', 'Regne 27 + 65', 'Gjette'], {expl:'38 + 27 = 65, så det stemmer.'});
     return Q.yn('Er pluss og minus motsatte regnearter?', true, {expl:'Ja. Det ene opphever det andre.'});
   }},
   {t:'Regnefamilie', d:'Bruk ett regnestykke til å finne de andre.', n:10, make:(r, i) => {
     const [a, b, c] = famNums(r), k = i % 4;
     if(k === 0) return Q.num(`${a} + ${b} = ${c}. Hva er ${c} − ${b}? {?}`, a, {say:`${a} pluss ${b} er ${c}. Hva er ${c} minus ${b}?`, calc:`${c}-${b}`, expl:`${c} − ${b} = ${a}.`});
     if(k === 1) return Q.num(`${a} + ${b} = ${c}. Hva er ${c} − ${a}? {?}`, b, {say:`${a} pluss ${b} er ${c}. Hva er ${c} minus ${a}?`, calc:`${c}-${a}`, expl:`${c} − ${a} = ${b}.`});
     if(k === 2) return Q.num(`${c} − ${b} = ${a}. Hva er ${a} + ${b}? {?}`, c, {say:`${c} minus ${b} er ${a}. Hva er ${a} pluss ${b}?`, calc:`${a}+${b}`, expl:`${a} + ${b} = ${c}.`});
     return Q.num(`${G.bar(c, a, b, {w:300, q:'w'})}<br>${a} + ${b} = {?}`, c, {say:`${a} pluss ${b}`, calc:`${a}+${b}`, expl:`Delene ${a} og ${b} gir helheten ${c}.`});
   }},
   {t:'Finn det ukjente tallet', d:'Bruk det motsatte for å finne tallet som mangler.', n:10, make:(r, i) => {
     const [a, b, c] = famNums(r), k = i % 3;
     if(k === 0) return Q.num(`${a} + {?} = ${c}`, b, {chk:`${a}+_===${c}`, say:`${a} pluss hva er ${c}?`, expl:`${c} − ${a} = ${b}, for ${a} + ${b} = ${c}.`, hint:`Regn ${c} − ${a}.`});
     if(k === 1) return Q.num(`{?} − ${b} = ${a}`, c, {chk:`_-${b}===${a}`, say:`Hva minus ${b} er ${a}?`, expl:`${a} + ${b} = ${c}, så ${c} − ${b} = ${a}.`, hint:`Regn ${a} + ${b}.`});
     return Q.num(`${c} − {?} = ${a}`, b, {chk:`${c}-_===${a}`, say:`${c} minus hva er ${a}?`, expl:`${c} − ${a} = ${b}, for ${c} − ${b} = ${a}.`, hint:`Regn ${c} − ${a}.`});
   }},
   {t:'Sjekk svaret', d:'Bruk motsatt regneart til å finne feil.', n:10, make:(r, i) => {
     const [a, b, c] = famNums(r), k = i % 4, off = pick(r, [1, 10, -10, 2]);
     if(k === 0) return Q.yn(`${a} + ${b} = ${c + off}. Sjekk: ${c + off} − ${b} = ? Stemmer det?`, false, {say:`${a} pluss ${b} er ${c + off}. Stemmer det?`, expl:`${c + off} − ${b} = ${a + off}, ikke ${a}. Riktig svar er ${c}.`});
     if(k === 1) return Q.yn(`${c} − ${b} = ${a}. Sjekk: ${a} + ${b} = ? Stemmer det?`, true, {say:`${c} minus ${b} er ${a}. Stemmer det?`, expl:`${a} + ${b} = ${c}. Det stemmer.`});
     if(k === 2) return Q.yn(`${c} − ${b} = ${a + off}. Sjekk: ${a + off} + ${b} = ? Stemmer det?`, false, {say:`${c} minus ${b} er ${a + off}. Stemmer det?`, expl:`${a + off} + ${b} = ${c + off}, ikke ${c}. Riktig svar er ${a}.`});
     return Q.choice(r, `Hva kan du regne for å sjekke at ${c} − ${b} = ${a}?`, `${a} + ${b}`, [`${c} + ${b}`, `${a} − ${b}`, `${c} − ${a} − ${b}`], {say:`Hva kan du regne for å sjekke at ${c} minus ${b} er ${a}?`, expl:`${a} + ${b} = ${c}.`});
   }},
   {t:'Tenk pluss i minus', d:'Regn lurt ved å bruke sammenhengen.', n:10, make:(r, i) => {
     if(i % 2 === 0){ const b = int(r, 31, 88), d = int(r, 3, 9), a = b + d; return Q.num(`${a} − ${b}: ${b} + {?} = ${a}`, d, {chk:`${b}+_===${a}`, say:`${a} minus ${b}. ${b} pluss hva er ${a}?`, expl:`${b} + ${d} = ${a}, så ${a} − ${b} = ${d}.`}); }
     const b = int(r, 12, 88), a = pick(r, [100, 100, 90]), x = a - b; return Q.num(`${a} − ${b}: ${b} + {?} = ${a}`, x, {chk:`${b}+_===${a}`, say:`${a} minus ${b}. ${b} pluss hva er ${a}?`, expl:`${b} + ${x} = ${a}, så ${a} − ${b} = ${x}.`, hint:`Tell opp fra ${b} til ${a}.`});
   }}
  ],
  drill:{tittel:'Finn det ukjente tallet (pluss og minus)', layout:'row', cols:3, n:[48, 30], make:(r, i, hard) => { const a = int(r, hard ? 12 : 5, hard ? 70 : 40), b = int(r, hard ? 12 : 5, hard ? 70 : 40), c = a + b, k = int(r, 0, 3);
    if(k === 0) return {t:`${a} + ☐ = ${c}`, ans:b}; if(k === 1) return {t:`☐ + ${b} = ${c}`, ans:a}; if(k === 2) return {t:`${c} − ☐ = ${a}`, ans:b}; return {t:`☐ − ${b} = ${a}`, ans:c}; }}
});
})();
