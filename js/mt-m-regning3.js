(function(){
'use strict';
/* Moduler: regning med tosifrede tall, oppstilling og veksling (KM13234, KM13232) */
const A = window.App, MT = window.MT, G = MT.G, Q = MT.Q, S = MT.S, B = MT.B;
const {int, pick, shuf} = MT, {sc, pop, fade, big, sub, row, chip, title} = S;
const range = (a, b) => Array.from({length:b - a + 1}, (_, i) => a + i);

/* ---------- hjelpere for oppstilling ---------- */
const dg = n => [n % 10, Math.floor(n / 10) % 10, Math.floor(n / 100) % 10, Math.floor(n / 1000)];
const NAMES3 = ['enerne', 'tierne', 'hundrerne', 'tusenene'], ORD = ['e', 't', 'h', 'tu'];
// tall uten veksling i addisjon: hver kolonne har sum ≤ 9
function genAdd(r, na, nb, carry){
  for(let k = 0; k < 400; k++){
    const a = int(r, na === 1 ? 1 : Math.pow(10, na - 1), Math.pow(10, na) - 1), b = int(r, nb === 1 ? 1 : Math.pow(10, nb - 1), Math.pow(10, nb) - 1);
    if(addInfo(a, b).any === !!carry) return [a, b];
  }
  return carry ? [38, 27] : [34, 25];
}
function addInfo(a, b){
  const da = dg(a), db = dg(b); let c = 0, carries = {}, any = false, steps = [], sums = [];
  const n = Math.max(String(a).length, String(b).length);
  for(let i = 0; i < n; i++){
    const s = da[i] + db[i] + c; sums.push(s);
    steps.push(`${NAMES3[i][0].toUpperCase() + NAMES3[i].slice(1)}: ${da[i]} + ${db[i]}${c ? ' + ' + c + ' (mente)' : ''} = ${s}${s >= 10 ? ` → skriv ${s % 10} og mente 1` : ''}`);
    c = s >= 10 ? 1 : 0; if(c){ any = true; carries[ORD[i + 1]] = '1'; }
  }
  return {any, carries, steps, sums, total:a + b, carryOut:c};
}
function genAddWhere(r, na, nb, pred, fb){
  for(let k = 0; k < 800; k++){
    const a = int(r, na === 1 ? 1 : Math.pow(10, na - 1), Math.pow(10, na) - 1), b = int(r, nb === 1 ? 1 : Math.pow(10, nb - 1), Math.pow(10, nb) - 1), p = a >= b ? [a, b] : [b, a];
    if(pred(addInfo(p[0], p[1]), p[0], p[1])) return p;
  }
  return fb;
}
const addExpl = (a, b) => addInfo(a, b).steps.join('. ') + `. Svar: ${a + b}.`;
// subtraksjon: veksling
function subInfo(a, b){
  const da = dg(a), db = dg(b), cur = da.slice(), n = String(a).length, bor = {}, steps = []; let any = false;
  for(let i = 0; i < n; i++){
    if(cur[i] < db[i]){
      any = true; let j = i + 1; while(cur[j] === 0) j++;
      cur[j]--; for(let k = j - 1; k > i; k--) cur[k] = 9; cur[i] += 10;
      steps.push(`${NAMES3[i][0].toUpperCase() + NAMES3[i].slice(1)}: ${da[i]} − ${db[i]} går ikke. Veksle: ta 1 fra ${NAMES3[j]} (blir ${cur[j]}), ${NAMES3[i]} blir ${cur[i]}`);
    }
  }
  for(let i = 0; i < n; i++) if(cur[i] !== da[i]) bor[ORD[i]] = {cross:true, show:cur[i]};
  const res = [];
  for(let i = 0; i < n; i++) res.push(`${NAMES3[i]}: ${cur[i]} − ${db[i]} = ${cur[i] - db[i]}`);
  return {any, bor, steps, res, cur};
}
const subExpl = (a, b) => { const x = subInfo(a, b); return (x.steps.length ? x.steps.join('. ') + '. ' : '') + x.res.join('. ') + `. Svar: ${a - b}.`; };
function genSub(r, na, nb, borrow, noZeroMid){
  for(let k = 0; k < 600; k++){
    const a = int(r, Math.pow(10, na - 1), Math.pow(10, na) - 1), b = int(r, nb === 1 ? 1 : Math.pow(10, nb - 1), Math.min(a - 1, Math.pow(10, nb) - 1));
    if(b < 1 || b >= a) continue;
    if(subInfo(a, b).any !== !!borrow) continue;
    if(noZeroMid && (dg(a)[1] === 0 && na > 2)) continue;
    return [a, b];
  }
  return borrow ? [52, 27] : [58, 23];
}
const blocksOf = n => ({h:Math.floor(n / 100), t:Math.floor(n / 10) % 10, e:n % 10});
const col = (op, a, b, o) => G.col(op, a, b, Object.assign({nohead:false}, o || {}));

/* ======================================================================
   A4. Addisjon med tosifrede tall (hoderegning)
   ====================================================================== */
MT.module({
  id:'addisjon-tosifret', rek:60, trinn:[2], maal:['KM13234'], tittel:'Legge sammen tosifrede tall i hodet', ikon:'🧠', bygger:['addisjon-10-20', 'tiere-enere'],
  video:[
   {html:title('🧠', 'Legge sammen tosifrede tall', S.sub('Tiere for seg og enere for seg', 1.2)),
    no:'Nå skal vi legge sammen større tall i hodet. Hemmeligheten er å bruke det vi vet om tiere og enere.'},
   {html:sc(S.row(S.pop(G.blocks({t:3}, {u:7}), .2), S.plus('+', .8), S.pop(G.blocks({t:2}, {u:7}), 1.2)), S.big('3 tiere + 2 tiere = 5 tiere = 50', 2.2)),
    no:'Tretti pluss tjue. Tretti er tre tiere. Tjue er to tiere. Tre tiere og to tiere er fem tiere. Fem tiere er femti. Vi regner med tiere som om de var enere.'},
   {html:sc(S.row(S.pop(G.blocks({t:3, e:4}, {u:7}), .2), S.plus('+', .8), S.pop(G.blocks({e:5}, {u:7}), 1.2)), S.big('34 + 5 = 39', 2.2), S.sub('Bare enerne endrer seg', 3.2)),
    no:'Trettifire pluss fem. Her er det bare enerne vi legger til. Fire pluss fem er ni. Tierne er de samme. Svaret er trettini.'},
   {html:sc(S.row(S.pop(G.blocks({t:3, e:4}, {u:7}), .2), S.plus('+', .8), S.pop(G.blocks({t:2}, {u:7}), 1.2)), S.big('34 + 20 = 54', 2.2), S.sub('Bare tierne endrer seg', 3.2)),
    no:'Trettifire pluss tjue. Nå legger vi til to tiere. Tierne blir fem. Enerne er de samme. Svaret er femtifire.'},
   {html:sc(S.row(S.pop(G.blocks({t:3, e:4}, {u:6}), .2), S.plus('+', .8), S.pop(G.blocks({t:2, e:5}, {u:6}), 1.2)), S.row(S.pop(G.eq('30 + 20 = 50', '#2563eb'), 2.2), S.pop(G.eq('4 + 5 = 9', '#16a34a'), 3)), S.big('34 + 25 = 59', 3.8)),
    no:'Trettifire pluss tjuefem. Vi legger tierne sammen: tretti pluss tjue er femti. Og enerne sammen: fire pluss fem er ni. Femti pluss ni er femtini.'},
   {html:sc(G.nline(36, 44, {marks:[{v:38, label:'38', c:'#16a34a'}], hops:[{a:38, b:40, label:'+2', c:'#f97316'}, {a:40, b:43, label:'+3', c:'#f97316'}], w:560}), S.big('38 + 5 = 43', 1.8), S.sub('Fyll tieren først', 2.8)),
    no:'Hva hvis enerne blir ti eller mer? Trettiåtte pluss fem. Vi fyller tieren først: trettiåtte pluss to er førti. Så tre til. Førtitre. Vi bruker samme metode som da vi regnet over ti.'},
   {html:sc(S.big('Tiere + tiere · enere + enere', .2), S.sub('Nå øver vi!', 1.2)),
    no:'Husk: tiere regnes med tiere, og enere med enere. Når enerne blir for mange, fyller vi tieren først. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal legge sammen tosifrede tall <b>i hodet</b> ved å regne tiere med tiere og enere med enere.',
   steg:['<b>Tiere + tiere:</b> 30 + 20 = 5 tiere = 50.', '<b>Tosifret + ensifret:</b> bare enerne endres: 34 + 5 = 39.', '<b>Tosifret + tosifret:</b> tiere for seg, enere for seg: 34 + 25 → 30 + 20 = 50, 4 + 5 = 9, 50 + 9 = 59.', 'Blir enerne 10 eller mer: <b>fyll tieren</b> først: 38 + 5 → 38 + 2 = 40, 40 + 3 = 43.'],
   eks:['30 + 20 = <b>50</b>', '34 + 5 = <b>39</b>', '34 + 25 = <b>59</b>', '38 + 5 = 38 + 2 + 3 = <b>43</b>'],
   ord:[['hoderegning', 'regne uten å skrive ned alle stegene'], ['tiere og enere', 'plassene i et tosifret tall']],
   feil:['«34 + 25 = 519» – tierne og enerne legges sammen hver for seg, så 5 og 9.', '«38 + 5 = 313» – 8 + 5 = 13 enere = 1 tier og 3 enere; 3 tiere + 1 tier = 4 tiere: 43.'],
   laerer:'Hoderegning med tosifrede tall bygger på posisjonssystemet: tiere regnes som enkelttall av tiere. Overgangen (38 + 5) bruker samme «fyll tieren»-tenkning som 8 + 5. Dette er forarbeid til oppstilling og veksling.'
  },
  refleksjon:'Forklar hvordan du regner 47 + 26 i hodet.',
  nivaaer:[
   {t:'Forstå: tiere og enere', d:'Sjekk at du har forstått metoden.', kind:'forstaa', make:(r, i) => {
     const t = int(r, 2, 6), e = int(r, 1, 4), b = int(r, 1, 4), k = i % 6, n = t * 10 + e;
     if(k === 0) return Q.choice(r, `I ${n} + ${b}: hvilket siffer endrer seg?`, 'Enerne', ['Tierne', 'Begge', 'Ingen'], {say:`I ${n} pluss ${b}: hvilket siffer endrer seg?`, expl:`Vi legger til ${b} enere. Tierne er de samme: ${n + b}.`});
     if(k === 1) return Q.choice(r, `I ${n} + 20: hvilket siffer endrer seg?`, 'Tierne', ['Enerne', 'Begge', 'Ingen'], {say:`I ${n} pluss 20: hvilket siffer endrer seg?`, expl:`20 er 2 tiere. Tierne blir ${t + 2}. ${n + 20}.`});
     if(k === 2) return Q.num(`${t} tiere + 2 tiere = {?} tiere`, t + 2, {expl:`${t} + 2 = ${t + 2} tiere = ${(t + 2) * 10}.`});
     if(k === 3) return Q.yn(`Er ${n} + ${b + 10} det samme som ${n} + 10 + ${b}?`, true, {expl:'Ja: vi kan dele tallet i tiere og enere.'});
     if(k === 4) return Q.num(`${t * 10} + ${(t % 3 + 1) * 10} = {?}`, t * 10 + (t % 3 + 1) * 10, {calc:`${t * 10}+${(t % 3 + 1) * 10}`, expl:`Tiere regnes som enkelttall av tiere.`});
     return Q.choice(r, 'Hva er lurt for 38 + 5?', 'Fylle tieren: 38 + 2 = 40, så 3 til', ['Legge sammen alle sifrene', 'Bare gjette', 'Telle fra 1'], {expl:'38 + 2 = 40, og 3 til gir 43.'});
   }},
   {t:'Tiere og tiere', d:'Hele tiere pluss hele tiere.', n:10, make:(r, i) => { const a = int(r, 1, 8), b = int(r, 1, 9 - a + 1 > 9 ? 9 : 10 - a); return Q.num(`${a * 10} + ${b * 10} = {?}`, (a + b) * 10, {calc:`${a * 10}+${b * 10}`, expl:`${a} tiere + ${b} tiere = ${a + b} tiere = ${(a + b) * 10}.`, hint:G.blocks({t:a}, {u:6}) + ' + ' + G.blocks({t:b}, {u:6})}); }},
   {t:'Tosifret + ensifret', d:'Bare enerne endres (uten veksling).', n:10, make:(r, i) => { const t = int(r, 1, 9), e = int(r, 0, 8), b = int(r, 1, 9 - e), n = t * 10 + e; return Q.num(`${n} + ${b} = {?}`, n + b, {calc:`${n}+${b}`, expl:`${e} + ${b} = ${e + b}. Tierne er de samme: ${n + b}.`, hint:G.blocks(blocksOf(n), {u:6}) + ' + ' + G.blocks({e:b}, {u:6})}); }},
   {t:'Tosifret + tiere og tosifret', d:'Legg til tiere, og legg sammen to tosifrede tall (uten veksling).', n:10, make:(r, i) => {
     const t = int(r, 1, 5), e = int(r, 0, 8), n = t * 10 + e, b = int(r, 1, 4);
     if(i % 2 === 0) return Q.num(`${n} + ${b * 10} = {?}`, n + b * 10, {calc:`${n}+${b * 10}`, expl:`Tierne: ${t} + ${b} = ${t + b}. Enerne er ${e}. ${n + b * 10}.`});
     const t2 = int(r, 1, 9 - t - 0 > 4 ? 4 : 8 - t), e2 = int(r, 0, 9 - e); const m = t2 * 10 + e2; return Q.num(`${n} + ${m} = {?}`, n + m, {calc:`${n}+${m}`, expl:`${t * 10} + ${t2 * 10} = ${(t + t2) * 10}, ${e} + ${e2} = ${e + e2}, ${(t + t2) * 10} + ${e + e2} = ${n + m}.`, hint:`Tiere for seg og enere for seg: ${t * 10} + ${t2 * 10} og ${e} + ${e2}.`});
   }},
   {t:'Over tieren', d:'Enerne blir 10 eller mer: fyll tieren først.', n:10, make:(r, i) => {
     const t = int(r, 1, 8), e = int(r, 5, 9), b = int(r, 10 - e + 1, 9), n = t * 10 + e, need = 10 - e, k = i % 3;
     if(k === 0) return Q.num(`${n} + ${b} = ${n} + ${need} + ${b - need}. ${n} + ${need} = {?}`, (t + 1) * 10, {calc:`${n}+${need}`, expl:`${n} + ${need} = ${(t + 1) * 10}.`});
     if(k === 1) return Q.num(`${n} + ${b}: først ${(t + 1) * 10}, så ${b - need} til. Svaret er {?}`, n + b, {calc:`${n}+${b}`, say:`${n} pluss ${b}. Først ${(t + 1) * 10}, så ${b - need} til. Hva er svaret?`, expl:`${(t + 1) * 10} + ${b - need} = ${n + b}.`});
     return Q.num(`${n} + ${b} = {?}`, n + b, {calc:`${n}+${b}`, expl:`${n} + ${need} = ${(t + 1) * 10}, og ${b - need} til er ${n + b}.`, hint:G.nline(n, n + b, {marks:[{v:n, label:n, c:'#16a34a'}], hops:[{a:n, b:(t + 1) * 10, label:'+' + need}, {a:(t + 1) * 10, b:n + b, label:'+' + (b - need)}], w:560, every:Math.max(1, Math.ceil(b / 6))})});
   }}
  ]
});

/* ======================================================================
   A8. Subtraksjon med tosifrede tall (hoderegning)
   ====================================================================== */
MT.module({
  id:'subtraksjon-tosifret', rek:62, trinn:[2], maal:['KM13234'], tittel:'Trekke fra tosifrede tall i hodet', ikon:'🧠', bygger:['subtraksjon-til-20', 'tiere-enere'],
  video:[
   {html:title('🧠', 'Trekke fra tosifrede tall', S.sub('Tiere for seg og enere for seg', 1.2)),
    no:'Nå skal vi trekke fra tosifrede tall i hodet. Vi bruker det vi vet om tiere og enere, akkurat som i addisjon.'},
   {html:sc(S.pop(G.blocks({t:5}, {u:7}), .2), S.big('5 tiere − 2 tiere = 3 tiere = 30', 1.2), S.sub('50 − 20 = 30', 2.2)),
    no:'Femti minus tjue. Femti er fem tiere. Vi tar bort to tiere. Det blir tre tiere igjen. Tre tiere er tretti.'},
   {html:sc(S.row(S.pop(G.blocks({t:4, e:7}, {u:7}), .2)), S.big('47 − 5 = 42', 1.4), S.sub('Bare enerne endres', 2.4)),
    no:'Førtisju minus fem. Vi tar bort fem enere. Sju minus fem er to. Tierne er de samme. Svaret er førtito.'},
   {html:sc(S.row(S.pop(G.blocks({t:4, e:7}, {u:7}), .2)), S.big('47 − 20 = 27', 1.4), S.sub('Bare tierne endres', 2.4)),
    no:'Førtisju minus tjue. Vi tar bort to tiere. Fire tiere minus to tiere er to tiere. Enerne er de samme. Svaret er tjuesju.'},
   {html:sc(S.row(S.pop(G.eq('47 − 20 = 27', '#2563eb'), .2), S.pop(G.eq('27 − 3 = 24', '#16a34a'), 1.2)), S.big('47 − 23 = 24', 2.2), S.sub('Trekk fra tierne, så enerne', 3)),
    no:'Førtisju minus tjuetre. Først tar vi bort tjue: da er det tjuesju igjen. Så tar vi bort tre til: tjuefire. Svaret er tjuefire.'},
   {html:sc(G.nline(37, 44, {marks:[{v:43, label:'43', c:'#16a34a'}], hops:[{a:43, b:40, label:'−3', c:'#dc2626'}, {a:40, b:38, label:'−2', c:'#dc2626'}], w:560}), S.big('43 − 5 = 38', 1.8), S.sub('Gå ned til tieren først', 2.8)),
    no:'Hva hvis vi ikke har nok enere? Førtitre minus fem. Vi går ned til førti først: førtitre minus tre er førti. Så to til: trettiåtte. Svaret er trettiåtte.'},
   {html:sc(S.big('Tiere − tiere · enere − enere', .2), S.sub('Nå øver vi!', 1.2)),
    no:'Husk: tiere regnes med tiere, og enere med enere. Når vi ikke har nok enere, går vi ned til tieren først. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal trekke fra tosifrede tall <b>i hodet</b> ved å regne tiere med tiere og enere med enere.',
   steg:['<b>Tiere − tiere:</b> 50 − 20 = 30.', '<b>Tosifret − ensifret:</b> bare enerne endres: 47 − 5 = 42.', '<b>Tosifret − tosifret:</b> trekk fra tierne først, så enerne: 47 − 23 → 47 − 20 = 27, 27 − 3 = 24.', 'Mangler du enere: <b>gå ned til tieren</b> først: 43 − 5 → 43 − 3 = 40, 40 − 2 = 38.'],
   eks:['50 − 20 = <b>30</b>', '47 − 5 = <b>42</b>', '47 − 23 = <b>24</b>', '43 − 5 = 43 − 3 − 2 = <b>38</b>'],
   ord:[['hoderegning', 'regne uten å skrive ned alle stegene']],
   feil:['«47 − 23 = 36» – du har trukket mindre fra enerne (7 − 3 = 4) og mer fra tierne; sjekk hver kolonne.', '«43 − 5 = 42» – 3 − 5 går ikke; gå ned til 40 først: 38.'],
   laerer:'Parallelt med addisjon. Strategien «gå ned til tieren» bygger forståelse for veksling i skriftlig subtraksjon. Sjekk svar ved å legge sammen: 38 + 5 = 43.'
  },
  refleksjon:'Forklar hvordan du regner 64 − 27 i hodet.',
  nivaaer:[
   {t:'Forstå: tiere og enere', d:'Sjekk at du har forstått metoden.', kind:'forstaa', make:(r, i) => {
     const t = int(r, 3, 8), e = int(r, 5, 9), b = int(r, 1, 4), k = i % 6, n = t * 10 + e;
     if(k === 0) return Q.choice(r, `I ${n} − ${b}: hvilket siffer endrer seg?`, 'Enerne', ['Tierne', 'Begge', 'Ingen'], {say:`I ${n} minus ${b}: hvilket siffer endrer seg?`, expl:`Vi tar bort ${b} enere. Tierne er de samme: ${n - b}.`});
     if(k === 1) return Q.choice(r, `I ${n} − 20: hvilket siffer endrer seg?`, 'Tierne', ['Enerne', 'Begge', 'Ingen'], {say:`I ${n} minus 20: hvilket siffer endrer seg?`, expl:`20 er 2 tiere. Tierne blir ${t - 2}: ${n - 20}.`});
     if(k === 2) return Q.num(`${t} tiere − 2 tiere = {?} tiere`, t - 2, {expl:`${t} − 2 = ${t - 2} tiere = ${(t - 2) * 10}.`});
     if(k === 3) return Q.yn(`Er ${n} − ${b + 10} det samme som ${n} − 10 − ${b}?`, true, {expl:'Ja: vi kan ta bort tiere og enere hver for seg.'});
     if(k === 4) return Q.yn(`${n - b} + ${b} = ${n}. Stemmer ${n} − ${b} = ${n - b}?`, true, {expl:'Ja. Vi kan sjekke subtraksjon med addisjon.'});
     return Q.choice(r, 'Hva er lurt for 43 − 5?', 'Gå ned til 40 først: 43 − 3 = 40, så 2 til', ['Trekke 5 fra tierne', 'Bytte rekkefølge: 5 − 43', 'Bare gjette'], {expl:'43 − 3 = 40, og 2 til gir 38.'});
   }},
   {t:'Tiere minus tiere', d:'Hele tiere minus hele tiere.', n:10, make:(r, i) => { const a = int(r, 3, 10), b = int(r, 1, a - 1); return Q.num(`${a * 10} − ${b * 10} = {?}`, (a - b) * 10, {calc:`${a * 10}-${b * 10}`, expl:`${a} tiere − ${b} tiere = ${a - b} tiere = ${(a - b) * 10}.`, hint:G.blocks({t:a}, {u:6})}); }},
   {t:'Tosifret − ensifret', d:'Bare enerne endres (uten veksling).', n:10, make:(r, i) => { const t = int(r, 1, 9), e = int(r, 2, 9), b = int(r, 1, e), n = t * 10 + e; return Q.num(`${n} − ${b} = {?}`, n - b, {calc:`${n}-${b}`, expl:`${e} − ${b} = ${e - b}. Tierne er de samme: ${n - b}.`, hint:G.blocks(blocksOf(n), {u:6})}); }},
   {t:'Minus tiere og tosifret', d:'Trekk fra tiere og tosifrede tall (uten veksling).', n:10, make:(r, i) => {
     const t = int(r, 3, 9), e = int(r, 2, 9), n = t * 10 + e;
     if(i % 2 === 0){ const b = int(r, 1, t - 1); return Q.num(`${n} − ${b * 10} = {?}`, n - b * 10, {calc:`${n}-${b * 10}`, expl:`Tierne: ${t} − ${b} = ${t - b}. Enerne er ${e}. ${n - b * 10}.`}); }
     const t2 = int(r, 1, t - 1), e2 = int(r, 0, e), m = t2 * 10 + e2; return Q.num(`${n} − ${m} = {?}`, n - m, {calc:`${n}-${m}`, expl:`${n} − ${t2 * 10} = ${n - t2 * 10}, så − ${e2} = ${n - m}.`, hint:`Trekk fra tierne først (${t2 * 10}), så enerne (${e2}).`});
   }},
   {t:'Gå ned til tieren', d:'Ikke nok enere: gå ned til tieren først.', n:10, make:(r, i) => {
     const t = int(r, 3, 9), e = int(r, 1, 4), b = int(r, e + 1, 9), n = t * 10 + e, k = i % 3;
     if(k === 0) return Q.num(`${n} − ${b} = ${n} − ${e} − ${b - e}. ${n} − ${e} = {?}`, t * 10, {calc:`${n}-${e}`, expl:`${n} − ${e} = ${t * 10}.`});
     if(k === 1) return Q.num(`${n} − ${b}: først ${t * 10}, så ${b - e} til. Svaret er {?}`, n - b, {calc:`${n}-${b}`, say:`${n} minus ${b}. Først ${t * 10}, så ${b - e} til. Hva er svaret?`, expl:`${t * 10} − ${b - e} = ${n - b}.`});
     return Q.num(`${n} − ${b} = {?}`, n - b, {calc:`${n}-${b}`, expl:`${n} − ${e} = ${t * 10}, og ${b - e} til: ${n - b}.`, hint:G.nline(n - b, n, {marks:[{v:n, label:n, c:'#16a34a'}], hops:[{a:n, b:t * 10, label:'−' + e, c:'#dc2626'}, {a:t * 10, b:n - b, label:'−' + (b - e), c:'#dc2626'}], w:560, every:Math.max(1, Math.ceil(b / 6))})});
   }}
  ]
});

/* ======================================================================
   Oppstilling: addisjon
   ====================================================================== */
const rawAdd = '<pre class="mtmono">  34\n+  5</pre>';
MT.module({
  id:'oppstilling-addisjon', rek:70, trinn:[2], maal:['KM13234'], tittel:'Oppstilling: legge sammen kolonne for kolonne', ikon:'🏗️', bygger:['addisjon-tosifret', 'tiere-enere'],
  video:[
   {html:title('🏗️', 'Oppstilling: addisjon', S.sub('Kolonne for kolonne', 1.2)),
    no:'Når tallene blir store, er det lurt å skrive regnestykket ned. Det kalles oppstilling. Vi skriver tallene under hverandre og regner én kolonne om gangen.'},
   {html:sc(S.row(S.pop('<div><pre class="mtmono">  34\n+  5</pre><div class="mtsm">✖ feil: enerne må stå under enerne</div></div>', .2), S.pop('<div>' + G.col('+', 34, 5, {noans:true}) + '<div class="mtsm">✔ riktig</div></div>', 1.6))),
    no:'Det viktigste er at sifrene står på riktig plass. Enerne under enerne og tierne under tierne. Her står femmeren under tieren, og det er feil. Her står den under enerne, og det er riktig.'},
   {html:sc(S.row(S.pop(G.col('+', 34, 25, {ans:59, hl:[0], blank:[1]}), .2), S.pop(G.blocks({t:3, e:4}, {u:5}) + ' + ' + G.blocks({t:2, e:5}, {u:5}), 1.2)), S.sub('Start med enerne: 4 + 5 = 9', 2.4)),
    no:'Vi starter alltid med enerne, helt til høyre. Fire pluss fem er ni. Vi skriver ni under enerne.'},
   {html:sc(S.row(S.pop(G.col('+', 34, 25, {ans:59, hl:[1]}), .2)), S.sub('Så tierne: 3 + 2 = 5', 1.2), S.big('34 + 25 = 59', 2.2)),
    no:'Så regner vi tierne. Tre pluss to er fem. Vi skriver fem under tierne. Svaret er femtini.'},
   {html:sc(S.pop(G.col('+', 243, 135, {ans:378}), .2), S.sub('Det samme med flere sifre: 3+5, 4+3, 2+1', 1.4)),
    no:'Samme metode med tre sifre. Først enerne: tre pluss fem er åtte. Så tierne: fire pluss tre er sju. Så hundrerne: to pluss én er tre. Svaret er tre hundre og syttiåtte.'},
   {html:sc(S.row(S.pop(G.eq('34 + 25 ≈ 30 + 20 = 50', '#2563eb'), .2), S.pop(G.eq('59 er rimelig ✔', '#16a34a'), 1.4)), S.sub('Sjekk: er svaret rimelig?', 2.4)),
    no:'Husk å sjekke svaret. Trettifire pluss tjuefem er omtrent tretti pluss tjue, altså femti. Femtini er rimelig. Hadde vi fått åttifire, hadde vi tenkt at noe var feil.'},
   {html:sc(S.big('enere først – kolonne for kolonne', .2), S.sub('Nå øver vi!', 1.2)),
    no:'Husk: tallene under hverandre, enere først, kolonne for kolonne. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal legge sammen tall i <b>oppstilling</b>, kolonne for kolonne (uten veksling).',
   steg:['Skriv tallene <b>under hverandre</b>: enere under enere, tiere under tiere, hundrere under hundrere.', 'Trekk en strek under.', 'Regn <b>enerne først</b> (helt til høyre), så tierne, så hundrerne.', 'Sjekk om svaret er <b>rimelig</b> ved å runde av eller regne i hodet.'],
   eks:[G.col('+', 34, 25, {ans:59}), G.col('+', 243, 135, {ans:378}), G.col('+', 34, 5, {ans:39})],
   ord:[['oppstilling', 'tallene skrevet under hverandre'], ['kolonne', 'sifrene som står på samme plass (enere, tiere, hundrere)'], ['overslag', 'et omtrentlig svar du regner i hodet']],
   feil:['«34 + 5: femmeren settes under tieren» – eneren (5) hører til enerne (4).', '«Jeg regner tierne først» – start med enerne, til høyre.'],
   laerer:'Oppstilling er en kompakt notasjon for posisjonssystemet: hver kolonne er en plassverdi. Her uten veksling, slik at barnet først mestrer plassering og kolonneregning. Be dem knytte hver kolonne til klosser (enere, tiere, hundrere).'
  },
  refleksjon:'Hvorfor må enerne stå under enerne i oppstilling?',
  nivaaer:[
   {t:'Forstå: plassering og rekkefølge', d:'Sjekk at du har forstått oppstilling.', kind:'forstaa', make:(r, i) => {
     const a = int(r, 21, 69), b = int(r, 1, 8), k = i % 5, a1 = a - a % 10 + int(r, 0, 4), b1 = int(r, 1, 4);
     if(k === 0) return Q.choice(r, 'Hvilken kolonne regner vi først i oppstilling?', 'Enerne (til høyre)', ['Tierne (til venstre)', 'Det er likegyldig', 'Midten'], {expl:'Vi starter med enerne, helt til høyre.'});
     if(k === 1) return Q.yn(`${rawAdd}<br>Står sifrene på riktig plass i denne oppstillingen av 34 + 5?`, false, {say:'Står sifrene på riktig plass i denne oppstillingen av 34 pluss 5?', expl:'Nei. 5 er enere og må stå under 4, ikke under 3.'});
     if(k === 2) return Q.choice(r, 'Hvorfor må enerne stå under enerne?', 'Så vi legger sammen riktige plassverdier', ['Det ser pent ut', 'Fordi enerne er størst', 'Det spiller ingen rolle'], {expl:'Enere og tiere er ikke verdt like mye. Vi må legge sammen like ting.'});
     if(k === 3) return Q.num(`I ${a1 + 10} + ${b1 + 10}: hva er 0 + ... – hva er enerne lagt sammen: ${(a1 + 10) % 10} + ${(b1 + 10) % 10} = {?}`, (a1 + 10) % 10 + (b1 + 10) % 10, {say:`Hva er enerne lagt sammen?`, expl:'Vi legger enerne sammen først.'});
     return Q.yn('Er 34 + 25 omtrent 30 + 20?', true, {expl:'Ja: runder vi av, regner vi 30 + 20 = 50. Det gir et overslag.'});
   }},
   {t:'To-sifrede tall', d:'Regn i oppstilling uten veksling.', n:10, make:(r, i) => { const [a, b] = genAdd(r, 2, 2, false); return Q.num(`${col('+', a, b, {})}<br>Hva er svaret? {?}`, a + b, {say:`${a} pluss ${b}`, calc:`${a}+${b}`, expl:addExpl(a, b), hint:G.blocks(blocksOf(a), {u:5}) + ' + ' + G.blocks(blocksOf(b), {u:5})}); }},
   {t:'Ulik lengde og tre sifre', d:'Pass på plasseringen! Tall med ulikt antall sifre og tre sifre.', n:10, make:(r, i) => { const [a, b] = i % 2 ? genAdd(r, 3, 3, false) : genAdd(r, 2, 1, false); const [x, y] = r() < .5 ? [a, b] : [b, a]; const [p, q] = x >= y ? [x, y] : [y, x]; return Q.num(`${col('+', p, q, {})}<br>Hva er svaret? {?}`, p + q, {say:`${p} pluss ${q}`, calc:`${p}+${q}`, expl:addExpl(p, q)}); }},
   {t:'Hvilket siffer mangler?', d:'Finn sifferet som er blitt borte i svaret.', n:10, make:(r, i) => { const [a, b] = genAdd(r, i % 2 ? 3 : 2, i % 2 ? 2 : 2, false), s = a + b, pos = int(r, 0, String(s).length - 1); return Q.num(`${G.col('+', a, b, {ans:s, blank:[pos]})}<br>Hvilket siffer mangler i svaret? {?}`, dg(s)[pos], {say:'Hvilket siffer mangler i svaret?', expl:addExpl(a, b)}); }},
   {t:'Er svaret rimelig?', d:'Sjekk med overslag og oppdag feil.', n:10, make:(r, i) => {
     const [a, b] = genAdd(r, 2, i % 2 ? 2 : 1, false), s = a + b, k = i % 3;
     if(k === 0){ const wrong = String(b).length === 1 ? a - a % 10 + b * 10 + a % 10 : s + 20; return Q.choice(r, `${col('+', a, b, {noans:true})}<br>Hvilket svar er riktig?`, s, [wrong === s ? s + 30 : wrong, s + 10], {sort:true, nums:true, say:`${a} pluss ${b}. Hvilket svar er riktig?`, expl:`${addExpl(a, b)} Sjekk: ${a} + ${b} ≈ ${Math.round(a / 10) * 10} + ${Math.round(b / 10) * 10}.`}); }
     if(k === 1) return Q.yn(`Stemmer det at ${a} + ${b} = ${s + 10}?`, false, {expl:`${addExpl(a, b)}`});
     return Q.yn(`Stemmer det at ${a} + ${b} = ${s}?`, true, {expl:`${addExpl(a, b)}`});
   }}
  ]
});

/* ======================================================================
   Oppstilling: subtraksjon
   ====================================================================== */
MT.module({
  id:'oppstilling-subtraksjon', rek:72, trinn:[2], maal:['KM13234'], tittel:'Oppstilling: trekke fra kolonne for kolonne', ikon:'🏗️', bygger:['subtraksjon-tosifret', 'oppstilling-addisjon'],
  video:[
   {html:title('🏗️', 'Oppstilling: subtraksjon', S.sub('Kolonne for kolonne', 1.2)),
    no:'Nå skal vi trekke fra i oppstilling. Vi skriver tallene under hverandre og regner én kolonne om gangen, akkurat som i addisjon.'},
   {html:sc(S.row(S.pop(G.col('−', 47, 23, {noans:true}), .2)), S.sub('Det største tallet står øverst', 1.2)),
    no:'Det tallet vi tar bort fra, står øverst. Det er førtisju. Det vi tar bort, står under: tjuetre. Enerne står under enerne og tierne under tierne.'},
   {html:sc(S.row(S.pop(G.col('−', 47, 23, {ans:24, hl:[0], blank:[1]}), .2), S.pop(G.blocks({t:4, e:7}, {u:5}), 1.2)), S.sub('Enerne først: 7 − 3 = 4', 2.4)),
    no:'Vi starter med enerne. Sju minus tre er fire. Vi skriver fire under enerne.'},
   {html:sc(S.row(S.pop(G.col('−', 47, 23, {ans:24, hl:[1]}), .2)), S.sub('Så tierne: 4 − 2 = 2', 1.2), S.big('47 − 23 = 24', 2.2)),
    no:'Så tierne. Fire minus to er to. Vi skriver to under tierne. Svaret er tjuefire.'},
   {html:sc(S.pop(G.col('−', 586, 241, {ans:345}), .2), S.sub('Samme metode med tre sifre', 1.4)),
    no:'Samme metode med tre sifre. Først enerne: seks minus én er fem. Så tierne: åtte minus fire er fire. Så hundrerne: fem minus to er tre. Svaret er tre hundre og førtifem.'},
   {html:sc(S.row(S.pop(G.eq('47 − 23 = 24', '#dc2626'), .2), S.pop('<span style="font-size:2rem;font-weight:900">→</span>', .8), S.pop(G.eq('24 + 23 = 47 ✔', '#16a34a'), 1.4)), S.sub('Sjekk med addisjon', 2.4)),
    no:'Vi kan alltid sjekke svaret med pluss. Tjuefire pluss tjuetre er førtisju. Det stemmer. Da vet vi at svaret er riktig.'},
   {html:sc(S.big('enere først – det største øverst', .2), S.sub('Nå øver vi!', 1.2)),
    no:'Husk: det største tallet øverst, enere først, kolonne for kolonne. Og sjekk med pluss. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal trekke fra i <b>oppstilling</b>, kolonne for kolonne (uten veksling), og sjekke svaret med addisjon.',
   steg:['Skriv det <b>største tallet øverst</b>, og tallet du tar bort under – enere under enere, tiere under tiere.', 'Trekk en strek under.', 'Regn <b>enerne først</b>, så tierne, så hundrerne.', '<b>Sjekk</b> med addisjon: svaret + tallet du tok bort = tallet du startet med.'],
   eks:[G.col('−', 47, 23, {ans:24}), G.col('−', 586, 241, {ans:345}), G.col('−', 58, 6, {ans:52})],
   ord:[['oppstilling', 'tallene skrevet under hverandre'], ['sjekke med addisjon', 'svaret pluss det du tok bort skal bli det du startet med']],
   feil:['«Det største tallet kan stå nederst» – nei: det du trekker fra, står øverst.', '«7 − 3 og 4 − 2 – jeg setter svaret i feil rekkefølge» – skriv enerne under enerne.'],
   laerer:'Parallell med addisjon, uten veksling (der ingen kolonne krever «lån»). Understrek sammenhengen mellom subtraksjon og addisjon som sjekk.'
  },
  refleksjon:'Hvordan sjekker du at 47 − 23 = 24 er riktig?',
  nivaaer:[
   {t:'Forstå: oppstilling av minus', d:'Sjekk at du har forstått.', kind:'forstaa', make:(r, i) => {
     const [a, b] = genSub(r, 2, 2, false), k = i % 5;
     if(k === 0) return Q.choice(r, 'Hvilket tall skal stå øverst når du trekker fra i oppstilling?', 'Tallet du tar bort fra (det største)', ['Tallet du tar bort', 'Det minste tallet', 'Det spiller ingen rolle'], {expl:'Vi tar bort fra det store, så det står øverst.'});
     if(k === 1) return Q.choice(r, 'Hvilken kolonne regner vi først?', 'Enerne (til høyre)', ['Tierne', 'Hundrerne', 'Det spiller ingen rolle'], {expl:'Enerne først, helt til høyre.'});
     if(k === 2) return Q.yn(`${a} − ${b} = ${a - b}. Stemmer det fordi ${a - b} + ${b} = ${a}?`, true, {expl:'Ja. Vi sjekker subtraksjon med addisjon.'});
     if(k === 3) return Q.yn(`Kan vi bytte plass og regne ${b} − ${a} i stedet for ${a} − ${b}?`, false, {expl:'Nei. I minus kan vi ikke bytte rekkefølge.'});
     return Q.num(`${a} − ${b} = ${a - b} → sjekk: ${a - b} + ${b} = {?}`, a, {chk:`${a - b}+${b}===_`, say:`${a} minus ${b} er ${a - b}. Sjekk: ${a - b} pluss ${b} er?`, expl:`${a - b} + ${b} = ${a}. Det stemmer.`});
   }},
   {t:'To-sifrede tall', d:'Regn i oppstilling uten veksling.', n:10, make:(r, i) => { const [a, b] = genSub(r, 2, 2, false); return Q.num(`${col('−', a, b, {})}<br>Hva er svaret? {?}`, a - b, {say:`${a} minus ${b}`, calc:`${a}-${b}`, expl:subExpl(a, b), hint:G.blocks(blocksOf(a), {u:5})}); }},
   {t:'Ulik lengde og tre sifre', d:'Pass på plasseringen! Tall med ulikt antall sifre og tre sifre.', n:10, make:(r, i) => { const [a, b] = i % 2 ? genSub(r, 3, 3, false) : genSub(r, 2, 1, false); return Q.num(`${col('−', a, b, {})}<br>Hva er svaret? {?}`, a - b, {say:`${a} minus ${b}`, calc:`${a}-${b}`, expl:subExpl(a, b)}); }},
   {t:'Hvilket siffer mangler?', d:'Finn sifferet som er blitt borte i svaret.', n:10, make:(r, i) => { const [a, b] = genSub(r, i % 2 ? 3 : 2, 2, false), s = a - b, pos = int(r, 0, String(s).length - 1); return Q.num(`${G.col('−', a, b, {ans:s, blank:[pos]})}<br>Hvilket siffer mangler i svaret? {?}`, dg(s)[pos], {say:'Hvilket siffer mangler i svaret?', expl:subExpl(a, b)}); }},
   {t:'Sjekk svaret', d:'Bruk addisjon til å sjekke subtraksjon.', n:10, make:(r, i) => {
     const [a, b] = genSub(r, 2, i % 2 ? 2 : 1, false), s = a - b, k = i % 3;
     if(k === 0) return Q.yn(`${a} − ${b} = ${s + 10}. Stemmer det? (Sjekk: ${s + 10} + ${b} = ?)`, false, {expl:`${s + 10} + ${b} = ${s + 10 + b}, ikke ${a}. Riktig svar er ${s}.`});
     if(k === 1) return Q.yn(`${a} − ${b} = ${s}. Stemmer det? (Sjekk: ${s} + ${b} = ?)`, true, {expl:`${s} + ${b} = ${a}. Det stemmer.`});
     return Q.num(`${a} − ${b} = {?}`, s, {calc:`${a}-${b}`, expl:subExpl(a, b)});
   }}
  ]
});

/* ======================================================================
   Veksling i addisjon (mente)
   ====================================================================== */
MT.module({
  id:'veksling-addisjon', rek:74, trinn:[2], maal:['KM13234', 'KM13232'], tittel:'Addisjon med veksling (mente)', ikon:'🔁', bygger:['oppstilling-addisjon'],
  video:[
   {html:title('🔁', 'Addisjon med veksling', S.sub('Når enerne blir for mange', 1.2)),
    no:'Hva gjør vi når det blir ti eller flere i en kolonne? Da må vi veksle. Det gjør vi nå. Det kalles også mente.'},
   {html:sc(S.row(S.pop(G.blocks({t:2, e:7}, {u:6}), .2), S.plus('+', .8), S.pop(G.blocks({t:1, e:5}, {u:6}), 1.2)), S.big('27 + 15 = ?', 2.2)),
    no:'Tjuesju pluss femten. Her er klossene: to tiere og sju enere, og en tier og fem enere. Vi legger sammen enerne først.'},
   {html:sc(S.row(S.pop(G.blocks({e:12}, {u:6}), .2), S.pop('<span style="font-size:2rem;font-weight:900">=</span>', 1), S.pop(G.blocks({t:1, e:2}, {u:6}), 1.4)), S.sub('12 enere = 1 tier og 2 enere', 2.4)),
    no:'Sju pluss fem er tolv. Vi har tolv enere. Men tolv enere er mer enn en tier. Vi veksler ti enere til én tier. Da har vi én tier og to enere.'},
   {html:sc(G.col('+', 27, 15, {carry:{t:'1'}, ans:42, hl:[0], blank:[1]}), S.sub('Skriv 2 under enerne. Ta med 1 (mente) til tierne', 1.2)),
    no:'I oppstillingen skriver vi to under enerne. Og den ene tieren skriver vi som en liten en over tierne. Den kalles mente. Vi tar den med til tierne.'},
   {html:sc(G.col('+', 27, 15, {carry:{t:'1'}, ans:42, hl:[1]}), S.sub('Tierne: 1 + 2 + 1 = 4', 1.2), S.big('27 + 15 = 42', 2.2)),
    no:'Nå tierne: en pluss to pluss menten på en. Det blir fire. Svaret er førtito. Tjuesju pluss femten er førtito.'},
   {html:sc(G.col('+', 68, 57, {carry:{t:'1', h:'1'}, ans:125}), S.sub('Veksling i tierne også: 6 + 5 + 1 = 12 tiere = 1 hundrer og 2 tiere', 1.4)),
    no:'Noen ganger må vi veksle to ganger. Sekstiåtte pluss femtisju. Åtte pluss sju er femten: skriv fem, mente en. Seks pluss fem pluss en er tolv tiere. Det er en hundrer og to tiere. Svaret er hundre og tjuefem.'},
   {html:sc(S.big('Blir kolonnen 10 eller mer? Veksle!', .2), S.sub('Nå øver vi!', 1.2)),
    no:'Spør deg selv i hver kolonne: blir det ti eller mer? Hvis ja, skriv eneren og ta med tieren videre. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal legge sammen i oppstilling når en kolonne blir <b>10 eller mer</b>, og forstå hvorfor vi veksler.',
   steg:['Regn enerne. Blir summen 10 eller mer?', 'Ja: skriv <b>eneren</b> i svaret, og ta med <b>tieren</b> (mente) som en liten 1 over tierne.', 'Regn tierne: de to tierne + <b>menten</b>.', 'Blir tierne 10 eller mer: veksle på samme måte til hundrerne.'],
   eks:[G.col('+', 27, 15, {carry:{t:'1'}, ans:42}), G.col('+', 68, 57, {carry:{t:'1', h:'1'}, ans:125})],
   ord:[['veksle', 'bytte ti av en slags mot én av neste slags (10 enere = 1 tier)'], ['mente', 'den lille 1-eren vi tar med til neste kolonne']],
   feil:['«7 + 5 = 12, så jeg skriver 12 under enerne» – bare eneren (2) står der; tieren tas med.', '«Jeg glemmer menten» – legg den til når du regner tierne.'],
   laerer:'Veksling er posisjonssystemet i handling: 10 enere = 1 tier (KM13232). Knytt hver bokstav i algoritmen til klosser: veksle ti enere til en tier-stav. Barn som forstår hvorfor, gjør færre mekaniske feil.'
  },
  refleksjon:'Forklar med klosser hvorfor vi tar med en 1-er til tierne i 27 + 15.',
  nivaaer:[
   {t:'Forstå: hvorfor veksler vi?', d:'Sjekk at du har forstått mente.', kind:'forstaa', make:(r, i) => {
     const [a, b] = genAddWhere(r, 2, 2, (x, p, q) => p % 10 + q % 10 >= 10 && x.sums[1] < 10, [47, 36]), ones = a % 10 + b % 10, k = i % 6;
     if(k === 0) return Q.choice(r, `I ${a} + ${b}: ${a % 10} + ${b % 10} = ${ones}. Hva gjør vi med ${ones}?`, `Skriver ${ones % 10} under enerne og tar med 1 til tierne`, [`Skriver ${ones} under enerne`, `Skriver ${ones % 10} og glemmer resten`, `Skriver 1 under enerne`], {say:`I ${a} pluss ${b}: ${a % 10} pluss ${b % 10} er ${ones}. Hva gjør vi med ${ones}?`, expl:`${ones} enere = 1 tier og ${ones % 10} enere. Eneren skrives, tieren tas med.`});
     if(k === 1) return Q.num(`10 enere veksles til {?} tier`, 1, {expl:'10 enere er like mye som 1 tier.'});
     if(k === 2) return Q.choice(r, 'Hva betyr den lille 1-eren over tierne (menten)?', '1 tier fra enerne', ['1 ener', '1 hundrer', 'Ingenting'], {expl:'Menten er den ene tieren vi fikk da vi vekslet 10 enere.'});
     if(k === 3) return Q.yn(`Må du veksle i 23 + 14?`, false, {expl:'3 + 4 = 7. Det er under 10, så ingen veksling.'});
     if(k === 4) return Q.yn(`Må du veksle i 27 + 15?`, true, {expl:'7 + 5 = 12. Det er 10 eller mer, så vi veksler.'});
     return Q.num(`${ones} enere = 1 tier og {?} enere`, ones - 10, {expl:`${ones} − 10 = ${ones - 10}.`});
   }},
   {t:'Trenger du mente?', d:'Se på enerne: veksling eller ikke?', n:10, make:(r, i) => { const need = i % 2 === 0, [a, b] = genAdd(r, 2, 2, need); const o = a % 10 + b % 10; return Q.yn(`Må du veksle i <b>${a} + ${b}</b>? &nbsp; (${a % 10} + ${b % 10} = ${o})`, need, {say:`Må du veksle i ${a} pluss ${b}?`, expl:o >= 10 ? `${o} er 10 eller mer: ja, veksle.` : `${o} er under 10: ingen veksling.`}); }},
   {t:'Veksle enerne', d:'Del enerne i tier og ener.', n:10, make:(r, i) => { const [a, b] = genAddWhere(r, 2, 2, (x, p, q) => p % 10 + q % 10 >= 10 && x.sums[1] < 10, [47, 36]), o = a % 10 + b % 10; const k = i % 3;
     if(k === 0) return Q.num(`${a} + ${b}: enerne er ${a % 10} + ${b % 10} = ${o}. Hvilket siffer skriver du under enerne? {?}`, o % 10, {say:`${a} pluss ${b}: enerne er ${a % 10} pluss ${b % 10}, ${o}. Hvilket siffer skriver du under enerne?`, expl:`${o} = 1 tier og ${o % 10} enere.`});
     if(k === 1) return Q.num(`${G.col('+', a, b, {carry:{t:'1'}, ans:a + b, blank:[1, 2]})}<br>Tierne: ${Math.floor(a / 10)} + ${Math.floor(b / 10)} + 1 (mente) = {?}`, Math.floor(a / 10) + Math.floor(b / 10) + 1, {say:'Tierne: legg sammen med menten.', expl:`${Math.floor(a / 10)} + ${Math.floor(b / 10)} + 1 = ${Math.floor(a / 10) + Math.floor(b / 10) + 1}.`});
     return Q.num(`${a} + ${b} = {?}`, a + b, {calc:`${a}+${b}`, expl:addExpl(a, b), hint:G.col('+', a, b, {carry:a % 10 + b % 10 >= 10 ? {t:'1'} : {}, noans:true})}); }},
   {t:'Mente: tosifrede tall', d:'Regn i oppstilling med veksling.', n:10, make:(r, i) => { const [a, b] = genAddWhere(r, 2, 2, (x, p, q) => p % 10 + q % 10 >= 10 && x.sums[1] < 10 && p + q <= 99, [38, 27]); return Q.num(`${col('+', a, b, {})}<br>Hva er svaret? {?}`, a + b, {say:`${a} pluss ${b}`, calc:`${a}+${b}`, expl:addExpl(a, b), hint:G.blocks(blocksOf(a), {u:5}) + ' + ' + G.blocks(blocksOf(b), {u:5})}); }},
   {t:'Mente i tierne og tre sifre', d:'Veksling også i tierne, og tall med tre sifre.', n:10, make:(r, i) => { const [p, q] = i % 2 ? genAddWhere(r, 3, 2, x => x.any, [458, 67]) : genAddWhere(r, 2, 2, x => x.sums[1] >= 10, [68, 57]); return Q.num(`${col('+', p, q, {})}<br>Hva er svaret? {?}`, p + q, {say:`${p} pluss ${q}`, calc:`${p}+${q}`, expl:addExpl(p, q)}); }}
  ]
});

/* ======================================================================
   Veksling i subtraksjon (lån)
   ====================================================================== */
MT.module({
  id:'veksling-subtraksjon', rek:76, trinn:[2], maal:['KM13234', 'KM13232'], tittel:'Subtraksjon med veksling', ikon:'🔂', bygger:['oppstilling-subtraksjon', 'veksling-addisjon'],
  video:[
   {html:title('🔂', 'Subtraksjon med veksling', S.sub('Når enerne ikke strekker til', 1.2)),
    no:'Nå kommer det vanskeligste: å trekke fra når vi ikke har nok enere. Da må vi veksle. Det har vi øvd på i addisjon, nå gjør vi det andre veien.'},
   {html:sc(S.row(S.pop(G.blocks({t:5, e:2}, {u:6}), .2)), S.big('52 − 27 = ?', 1.2), S.sub('2 − 7 går ikke', 2.2)),
    no:'Femtito minus tjuesju. Her er klossene: fem tiere og to enere. Vi skal ta bort sju enere. Men vi har bare to. To minus sju går ikke.'},
   {html:sc(S.row(S.pop(G.blocks({t:5, e:2}, {u:6}), .2), S.pop('<span style="font-size:2rem;font-weight:900">→</span>', 1), S.pop(G.blocks({t:4, e:12}, {u:6}), 1.6)), S.sub('Veksle 1 tier til 10 enere: 4 tiere og 12 enere', 2.6)),
    no:'Da veksler vi en tier til ti enere. Nå har vi fire tiere og tolv enere. Det er det samme tallet, bare pakket på en annen måte.'},
   {html:sc(S.row(S.pop(G.col('−', 52, 27, {bor:{e:{show:12}, t:{cross:true, show:4}}, ans:25, hl:[0], blank:[1]}), .2)), S.sub('Enerne: 12 − 7 = 5', 1.4)),
    no:'I oppstillingen krysser vi ut femmeren og skriver fire. Over toeren skriver vi tolv. Nå kan vi trekke fra enerne: tolv minus sju er fem.'},
   {html:sc(G.col('−', 52, 27, {bor:{e:{show:12}, t:{cross:true, show:4}}, ans:25, hl:[1]}), S.sub('Tierne: 4 − 2 = 2', 1.2), S.big('52 − 27 = 25', 2.2)),
    no:'Så tierne: fire minus to er to. Svaret er tjuefem. Femtito minus tjuesju er tjuefem.'},
   {html:sc(S.row(S.pop(G.eq('25 + 27 = 52 ✔', '#16a34a'), .2)), S.sub('Sjekk med addisjon', 1.2)),
    no:'Vi sjekker alltid med pluss. Tjuefem pluss tjuesju er femtito. Det stemmer. Da er svaret riktig.'},
   {html:sc(G.col('−', 543, 218, {bor:{e:{show:13}, t:{cross:true, show:3}}, ans:325}), S.sub('Med hundrerne: 13 − 8 = 5 · 3 − 1 = 2 · 5 − 2 = 3', 1.4)),
    no:'Samme metode med tre sifre. Tre minus åtte går ikke. Veksle en tier: tretten minus åtte er fem. Tierne er nå tre: tre minus én er to. Hundrerne: fem minus to er tre. Svaret er tre hundre og tjuefem. Nå skal du øve!'}
  ],
  tekst:{
   mal:'Du skal trekke fra i oppstilling når du <b>ikke har nok enere</b> (veksling), og forstå hvorfor vi veksler.',
   steg:['Er eneren øverst <b>mindre</b> enn eneren nederst? Da må du veksle.', 'Ta <b>1 tier</b> fra tierne (tieren blir 1 mindre) og gi <b>10 enere</b> til enerne.', 'Trekk fra enerne (nå er det nok), så tierne, så hundrerne.', '<b>Sjekk</b> med addisjon.'],
   eks:[G.col('−', 52, 27, {bor:{e:{show:12}, t:{cross:true, show:4}}, ans:25}), G.col('−', 543, 218, {bor:{e:{show:13}, t:{cross:true, show:3}}, ans:325})],
   ord:[['veksle', 'bytte 1 tier mot 10 enere'], ['lån', 'det mange kaller å veksle i subtraksjon']],
   feil:['«7 − 2 i stedet for 2 − 7» – du kan ikke bytte rekkefølge i minus; veksle i stedet.', '«Jeg glemte å gjøre tieren 1 mindre» – når du tar en tier, har du én mindre igjen.'],
   laerer:'Veksling i subtraksjon er det motsatte av mente: 1 tier ↔ 10 enere. Bruk klosser og pakke/pakke-ut før algoritmen. Sjekk alltid med addisjon. Tall med null i midten (403 − 127) krever veksling over null og er ekstra krevende.'
  },
  refleksjon:'Forklar med klosser hvorfor vi gjør tieren 1 mindre når vi veksler i 52 − 27.',
  nivaaer:[
   {t:'Forstå: hvorfor veksler vi?', d:'Sjekk at du har forstått veksling i minus.', kind:'forstaa', make:(r, i) => {
     const [a, b] = genSub(r, 2, 2, true), ea = a % 10, k = i % 6, ta = Math.floor(a / 10);
     if(k === 0) return Q.choice(r, `I ${a} − ${b}: ${ea} − ${b % 10} går ikke. Hva gjør vi?`, 'Veksler 1 tier til 10 enere', ['Bytter plass på tallene', 'Trekker det minste fra det største', 'Gir opp'], {say:`I ${a} minus ${b}: ${ea} minus ${b % 10} går ikke. Hva gjør vi?`, expl:'Vi tar 1 tier og veksler den til 10 enere.'});
     if(k === 1) return Q.num(`1 tier veksles til {?} enere`, 10, {expl:'1 tier = 10 enere.'});
     if(k === 2) return Q.num(`${a} = ${ta - 1} tiere og {?} enere`, ea + 10, {say:`${a} er ${ta - 1} tiere og hvor mange enere?`, expl:`${ta} tiere og ${ea} enere = ${ta - 1} tiere og ${ea + 10} enere.`});
     if(k === 3) return Q.yn('Må du veksle i 47 − 23?', false, {expl:'7 − 3 går fint. Ingen veksling.'});
     if(k === 4) return Q.yn('Må du veksle i 42 − 27?', true, {expl:'2 − 7 går ikke. Vi må veksle.'});
     return Q.num(`${a} − ${b} = ${a - b}. Sjekk: ${a - b} + ${b} = {?}`, a, {chk:`${a - b}+${b}===_`, say:`${a} minus ${b} er ${a - b}. Sjekk: ${a - b} pluss ${b} er?`, expl:`${a - b} + ${b} = ${a}.`});
   }},
   {t:'Må du veksle?', d:'Se på enerne: veksling eller ikke?', n:10, make:(r, i) => { const need = i % 2 === 0, [a, b] = genSub(r, 2, 2, need); return Q.yn(`Må du veksle i <b>${a} − ${b}</b>? &nbsp; (${a % 10} − ${b % 10})`, need, {say:`Må du veksle i ${a} minus ${b}?`, expl:a % 10 < b % 10 ? `${a % 10} er mindre enn ${b % 10}: ja, veksle.` : `${a % 10} er ${a % 10 === b % 10 ? 'lik' : 'større enn'} ${b % 10}: ingen veksling.`}); }},
   {t:'Veksle først', d:'Skriv tallet med veksling.', n:10, make:(r, i) => { const [a, b] = genSub(r, 2, 2, true), ta = Math.floor(a / 10), ea = a % 10, k = i % 3;
     if(k === 0) return Q.num(`${a} = ${ta - 1} tiere og {?} enere`, ea + 10, {say:`${a} er ${ta - 1} tiere og hvor mange enere?`, expl:`1 tier veksles til 10 enere: ${ea} + 10 = ${ea + 10}.`, hint:G.blocks({t:ta, e:ea}, {u:6})});
     if(k === 1) return Q.num(`Etter veksling: ${ea + 10} − ${b % 10} = {?}`, ea + 10 - b % 10, {calc:`${ea + 10}-${b % 10}`, say:`Etter veksling: ${ea + 10} minus ${b % 10} er?`, expl:`${ea + 10} − ${b % 10} = ${ea + 10 - b % 10}.`});
     return Q.num(`${a} − ${b}: tierne blir ${ta - 1} − ${Math.floor(b / 10)} = {?}`, ta - 1 - Math.floor(b / 10), {calc:`${ta - 1}-${Math.floor(b / 10)}`, say:`${a} minus ${b}. Tierne blir ${ta - 1} minus ${Math.floor(b / 10)}. Hva er det?`, expl:`${ta - 1} − ${Math.floor(b / 10)} = ${ta - 1 - Math.floor(b / 10)}.`}); }},
   {t:'Veksling: tosifrede tall', d:'Regn i oppstilling med veksling.', n:10, make:(r, i) => { const [a, b] = genSub(r, 2, 2, true), si = subInfo(a, b); return Q.num(`${col('−', a, b, {})}<br>Hva er svaret? {?}`, a - b, {say:`${a} minus ${b}`, calc:`${a}-${b}`, expl:subExpl(a, b), hint:G.col('−', a, b, {bor:si.bor, noans:true}) + '<br>' + G.blocks(blocksOf(a), {u:5})}); }},
   {t:'Tre sifre og utfordring', d:'Veksling med tre sifre – og med null i midten.', n:10, make:(r, i) => { const [a, b] = i % 3 === 2 ? [403 + 100 * int(r, 0, 5) + 10 * 0, int(r, 101, 399)] : genSub(r, 3, i % 2 ? 2 : 3, true, true); if(a <= b) return null; const si = subInfo(a, b); return Q.num(`${col('−', a, b, {})}<br>Hva er svaret? {?}`, a - b, {say:`${a} minus ${b}`, calc:`${a}-${b}`, expl:subExpl(a, b), hint:G.col('−', a, b, {bor:si.bor, noans:true})}); }}
  ]
});
})();
