(function(){
'use strict';
/* Gange: byggeklosser til oppgavene. Hver funksjon lager en «spec» som motoren kan vise:
   kind 'num'  (ett tall som svar)  og  kind 'calc' (trinn for trinn eller bare svaret). */
const A = window.App, N = A.N, MG = A.MG;
const {bi, shuffle, sample, pick, uniq} = A;
const T = (no, zh) => ({no, zh});
const fmt = N.fmt, esc = A.esc;
const M = A.Mult = {};
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const P10 = k => Math.pow(10, k);
const exprBoard = lines => `<div class="mexpr">${lines.map(l => `<div>${l}</div>`).join('')}</div>`;
const znames = ['个位', '十位', '百位', '千位'], nnames = ['enerne', 'tierne', 'hundrene', 'tusenene'];

/* ---------- hvordan oppgaven vises: tall, tekst, tall + tekst eller bare tale ---------- */
M.pres = function(p){ if(p) return p; const r = Math.random(); return r < .6 ? 'num' : r < .85 ? 'both' : 'text'; };
function present(pres, o){
  const hear = `<div class="hearbox"><button class="spk hearq" type="button" data-listen="${esc(o.listen)}" title="Hør igjen / 再听一遍">🔊</button><div class="small-note">${bi('Trykk for å høre oppgaven igjen', '点一下可以再听一遍')}</div></div>`;
  const out = {q:T('Regn ut.', '计算。')};
  if(pres === 'speech'){ out.visual = hear; out.listen = o.listen; out.forceSpeak = true; out.q = T('Lytt og regn ut.', '听一听，然后计算。'); }
  else if(pres === 'text') out.visual = `<div><div class="mq txt"><span class="no">${o.wNo}</span></div><div class="gloss zh">${o.wZh}</div></div>`;
  else if(pres === 'both') out.visual = `<div><div class="mq">${o.sym}</div><div class="mqs"><span class="no">${o.wNo}</span><span class="zh">${o.wZh}</span></div></div>`;
  else out.visual = `<div class="mq">${o.sym}</div>`;
  return out;
}
M.present = present;

/* ---------- knep for gangetabellen ---------- */
M.tip = function(a, b){
  const has = x => a === x || b === x, o = x => a === x ? b : a;
  const r = (no, zh) => T(no, zh);
  if(has(0)) return r('Hva som helst ganger 0 er 0.', '任何数乘 0 都得 0。');
  if(has(1)) return r(`Ganger du med 1, blir tallet det samme: ${o(1)}.`, `乘 1，数不变：${o(1)}。`);
  if(has(10)) return r(`× 10: legg til en null. ${o(10)} × 10 = ${o(10) * 10}.`, `× 10：后面添一个 0。${o(10)} × 10 = ${o(10) * 10}。`);
  if(has(2)) return r(`× 2 er dobbelt. ${o(2)} + ${o(2)} = ${o(2) * 2}.`, `× 2 就是两倍。${o(2)} + ${o(2)} = ${o(2) * 2}。`);
  if(has(5)) return r(`× 5 er halvparten av × 10. ${o(5)} × 10 = ${o(5) * 10}, og halvparten er ${o(5) * 5}.`, `× 5 是 × 10 的一半。${o(5)} × 10 = ${o(5) * 10}，一半是 ${o(5) * 5}。`);
  if(has(9)) return r(`× 9 er × 10 minus én ${o(9)}. ${o(9) * 10} − ${o(9)} = ${o(9) * 9}.`, `× 9 = × 10 再减一个 ${o(9)}。${o(9) * 10} − ${o(9)} = ${o(9) * 9}。`);
  if(has(4)) return r(`× 4 er dobbelt og dobbelt. ${o(4)} → ${o(4) * 2} → ${o(4) * 4}.`, `× 4 就是两倍再两倍。${o(4)} → ${o(4) * 2} → ${o(4) * 4}。`);
  if(has(3)) return r(`× 3 er × 2 og så én til. ${o(3) * 2} + ${o(3)} = ${o(3) * 3}.`, `× 3 = × 2 再加一个。${o(3) * 2} + ${o(3)} = ${o(3) * 3}。`);
  if(has(6)) return r(`× 6 er × 5 og så én til. ${o(6) * 5} + ${o(6)} = ${o(6) * 6}.`, `× 6 = × 5 再加一个。${o(6) * 5} + ${o(6)} = ${o(6) * 6}。`);
  if(has(8)) return r(`× 8 er dobbelt av × 4. ${o(8) * 4} + ${o(8) * 4} = ${o(8) * 8}.`, `× 8 是 × 4 的两倍。${o(8) * 4} + ${o(8) * 4} = ${o(8) * 8}。`);
  return r('7 × 7 = 5 × 7 + 2 × 7 = 35 + 14 = 49.', '7 × 7 = 5 × 7 + 2 × 7 = 35 + 14 = 49。');
};

/* ---------- små tallsvar ---------- */
M.fact = function(a, b, pres){
  pres = M.pres(pres);
  const ans = a * b, tp = M.tip(a, b);
  const p = present(pres, {sym:`${a} × ${b} = ?`, wNo:N.eqNo(a, b), wZh:N.eqZh(a, b), listen:`Hva er ${a} × ${b}?`});
  return Object.assign(p, {say:T(`Hva er ${a} × ${b}?`, `${a} × ${b} 等于多少？`), answer:ans, min:0, retry:true,
    near:[a * (b + 1), a * (b - 1), (a + 1) * b, (a - 1) * b].filter(v => v > 0),
    hintHtml:MG.ballCols(Math.min(a, 10), Math.min(b, 10)),
    fb:T(`${a} × ${b} = ${ans}. ${N.eqNo(a, b)} er ${N.no(ans)}. ${tp.no}`, `${a} × ${b} = ${ans}。${N.eqZh(a, b)}等于${N.zh(ans)}。${tp.zh}`), sayAfter:`${a} × ${b} = ${ans}`});
};
M.missing = function(a, b, pres){
  pres = M.pres(pres);
  const prod = a * b, left = Math.random() < .5;
  const sym = left ? `${a} × ? = ${prod}` : `? × ${a} = ${prod}`;
  const wNo = left ? `${N.no(a)} ganger hva er ${N.no(prod)}` : `hva ganger ${N.no(a)} er ${N.no(prod)}`;
  const wZh = left ? `${N.zh(a)}乘以几等于${N.zh(prod)}` : `几乘以${N.zh(a)}等于${N.zh(prod)}`;
  const listen = left ? `${a} ganger hvilket tall er ${prod}?` : `Hvilket tall ganger ${a} er ${prod}?`;
  const p = present(pres, {sym, wNo, wZh, listen});
  p.q = pres === 'speech' ? T('Lytt. Hvilket tall mangler?', '听一听。缺哪个数？') : T('Hvilket tall mangler?', '缺哪个数？');
  return Object.assign(p, {say:T(left ? `${a} ganger hvilket tall er ${prod}?` : `Hvilket tall ganger ${a} er ${prod}?`, left ? `${a} 乘以几等于 ${prod}？` : `几乘以 ${a} 等于 ${prod}？`),
    answer:b, min:1, retry:true, near:[b + 1, b - 1, b + 2, Math.max(1, b - 2)],
    hintHtml:MG.ballCols(Math.min(a, 10), 0),
    fb:T(`${a} × ${b} = ${prod}, så tallet som mangler er ${b}.`, `${a} × ${b} = ${prod}，所以缺的数是 ${b}。`), sayAfter:`${a} × ${b} = ${prod}`});
};
M.ten = function(a, k, pres){
  pres = M.pres(pres);
  const f = P10(k), ans = a * f;
  const p = present(pres, {sym:`${a} × ${fmt(f)} = ?`, wNo:`${N.no(a)} ganger ${N.no(f)}`, wZh:`${N.zh(a)}乘以${N.zh(f)}`, listen:`Hva er ${a} × ${f}?`});
  return Object.assign(p, {say:T(`Hva er ${a} × ${f}?`, `${a} × ${f} 等于多少？`), answer:ans, min:0, retry:true,
    near:[a * P10(k - 1), a * P10(k + 1), a * P10(k + 2)].filter(v => v > 0 && v !== ans),
    hintHtml:MG.shift10(a, k),
    fb:T(`Ganger du med ${fmt(f)}, flytter sifrene seg ${k} ${k === 1 ? 'plass' : 'plasser'} mot venstre. ${a} × ${fmt(f)} = ${fmt(ans)}.`, `乘 ${fmt(f)}，数字向左移动 ${k} 位。${a} × ${fmt(f)} = ${fmt(ans)}。`), sayAfter:`${a} × ${f} = ${ans}`});
};
M.tens = function(m, n, i, j, pres){
  pres = M.pres(pres);
  const A_ = m * P10(i), B_ = n * P10(j), z = i + j, base = m * n, ans = base * P10(z);
  const p = present(pres, {sym:`${fmt(A_)} × ${fmt(B_)} = ?`, wNo:`${N.no(A_)} ganger ${N.no(B_)}`, wZh:`${N.zh(A_)}乘以${N.zh(B_)}`, listen:`Hva er ${A_} × ${B_}?`});
  return Object.assign(p, {say:T(`Hva er ${A_} × ${B_}?`, `${A_} × ${B_} 等于多少？`), answer:ans, min:0, retry:true,
    near:[base, ans * 10, base * P10(Math.max(0, z - 1))].filter(v => v > 0 && v !== ans),
    hintHtml:`<div class="mexpr"><div>${m} × ${n} = ${base}</div><div class="dim">${z} ${z === 1 ? 'null' : 'nuller'} ${A.settings.lang === 'zh' ? '' : ''}→ ${fmt(ans)}</div></div>`,
    fb:T(`Regn ${m} × ${n} = ${base}. Så legger du til ${z} ${z === 1 ? 'null' : 'nuller'} bak: ${fmt(A_)} × ${fmt(B_)} = ${fmt(ans)}.`, `先算 ${m} × ${n} = ${base}，再在后面添 ${z} 个 0：${fmt(A_)} × ${fmt(B_)} = ${fmt(ans)}。`), sayAfter:`${A_} × ${B_} = ${ans}`});
};

/* ---------- hjelpere til «trinn for trinn» ---------- */
function digitsParts(n){ const s = String(n), L = s.length, out = []; for(let i = 0; i < L; i++){ const d = +s[i]; if(d) out.push(d * P10(L - 1 - i)); } return out; }
M.digitsParts = digitsParts;
const zerosOf = p => String(p).length - 1;
const ansNear = ans => [ans + 10, ans - 10, ans + 100, ans - 100, ans + 1, ans - 1].filter(v => v > 0);
const choiceHtml = s => `<span style="font-size:1.25rem">${s}</span>`;
// felles ramme: vising, tittel, og at tale-oppgaver ikke kan «hjelpes» med trinnene
function wrapCalc(m, pres, expr){
  pres = M.pres(pres);
  const p = present(pres, expr);
  return Object.assign({q:p.q, qsay:T(`Hva er ${expr.plain}?`, `${expr.plain} 等于多少？`), visual:p.visual, listen:p.listen, forceSpeak:p.forceSpeak, noGuide:pres === 'speech', min:0}, m);
}
const eqExpr = (a, b) => ({sym:`${fmt(a)} × ${fmt(b)} = ?`, wNo:`${N.no(a)} ganger ${N.no(b)}`, wZh:`${N.zh(a)}乘以${N.zh(b)}`, listen:`Hva er ${a} × ${b}?`, plain:`${a} × ${b}`});

/* 1) del opp tallet (utvidet form) + rutenett */
function splitWrong(a, parts){
  const ds = String(a).split('').map(Number), L = ds.length, right = parts.join(' + '), cands = [];
  const sh = parts.map(p => p >= 10 ? p / 10 : p);
  cands.push(ds.filter(Boolean).join(' + '));
  cands.push(sh.join(' + '));
  cands.push([parts[0] * 10].concat(parts.slice(1)).join(' + '));
  cands.push(ds.slice().reverse().map((d, i) => d * P10(L - 1 - i)).filter(Boolean).join(' + '));
  cands.push(parts.map((p, i) => i === parts.length - 1 && p < 10 ? p * 10 : p).join(' + '));
  cands.push(parts.map((p, i) => i === 1 ? p * 10 : p).join(' + '));
  const ok = uniq(cands).filter(s => s !== right && s.split(' + ').reduce((x, y) => x + (+y), 0) !== a);
  return sample(ok, 3);
}
M.splitWrong = splitWrong;
M.calcSplit = function(a, b, pres){
  const parts = digitsParts(a), prods = parts.map(p => p * b), ans = a * b, sym = `${fmt(a)} × ${b}`;
  const cells = n => [prods.map((p, i) => i < n ? fmt(p) : '')];
  const right = parts.map(fmt).join(' + '), wrong = splitWrong(a, parts);
  const steps = [{
    ask:T(`Del opp ${fmt(a)}. Hvilken oppdeling passer?`, `把 ${fmt(a)} 拆开。哪一种拆法对？`), say:T(`Del opp ${a}. Hvilken oppdeling passer?`, `把 ${a} 拆开。哪一种拆法对？`),
    choices:shuffle([{html:choiceHtml(right), value:'ok'}].concat(wrong.map((w, i) => ({html:choiceHtml(w.split(' + ').map(x => fmt(+x)).join(' + ')), value:'w' + i})))), layout:'col', answer:'ok', show:right,
    line:`${fmt(a)} = ${right}`, board:MG.area(parts, [b], {cells:cells(0)}),
    hint:T('Tenk på plassverdi: hundrer, tiere og enere.', '想一想数位：百位、十位、个位。'), explain:T(`${fmt(a)} = ${right}. Hvert siffer får sin plassverdi.`, `${fmt(a)} = ${right}。每个数字有自己的数位。`)}];
  parts.forEach((p, i) => {
    const z = zerosOf(p), lead = p / P10(z);
    steps.push({ask:T(`${fmt(p)} × ${b} = ?`, `${fmt(p)} × ${b} = ?`), say:T(`${p} × ${b}`, `${p} × ${b}`), answer:prods[i], near:[lead * b, prods[i] * 10, prods[i] / 10].filter(v => Number.isInteger(v) && v > 0 && v !== prods[i]),
      line:`${fmt(p)} × ${b} = ${fmt(prods[i])}`, board:MG.area(parts, [b], {cells:cells(i + 1), hi:[0, i]}),
      hint:z ? T(`Regn først ${lead} × ${b} = ${lead * b}. Legg så til ${z} ${z === 1 ? 'null' : 'nuller'}.`, `先算 ${lead} × ${b} = ${lead * b}，再添 ${z} 个 0。`) : T('Bruk gangetabellen.', '用乘法表。'),
      explain:z ? T(`${lead} × ${b} = ${lead * b}, og så ${z} ${z === 1 ? 'null' : 'nuller'}: ${fmt(prods[i])}.`, `${lead} × ${b} = ${lead * b}，再添 ${z} 个 0：${fmt(prods[i])}。`) : T(`${p} × ${b} = ${prods[i]}.`, `${p} × ${b} = ${prods[i]}。`)});
  });
  steps.push({ask:T(`Legg sammen: ${prods.map(fmt).join(' + ')} = ?`, `加起来：${prods.map(fmt).join(' + ')} = ?`), say:T(`Legg sammen: ${prods.join(' + ')}`, `加起来：${prods.join(' + ')}`), answer:ans, near:ansNear(ans),
    line:`${prods.map(fmt).join(' + ')} = ${fmt(ans)}`, board:MG.area(parts, [b], {cells:[prods.map(fmt)], total:`= ${fmt(ans)}`}),
    hint:T('Legg sammen delsvarene ett og ett.', '把各部分的结果一个一个加起来。'), explain:T(`${prods.map(fmt).join(' + ')} = ${fmt(ans)}.`, `${prods.map(fmt).join(' + ')} = ${fmt(ans)}。`)});
  const chain = parts.map(p => `${fmt(p)} × ${b}`).join(' + ');
  return wrapCalc({title:T(`Regn ut ${sym}. Del opp tallet.`, `计算 ${sym}。用拆分数的方法。`), say:T(`Regn ut ${a} × ${b}. Del opp tallet.`, `计算 ${a} × ${b}。用拆分数的方法。`),
    board0:MG.area([a], [b], {cells:[[sym]]}), steps, answer:ans, near:ansNear(ans),
    fb:T(`${sym} = ${chain} = ${prods.map(fmt).join(' + ')} = ${fmt(ans)}.`, `${sym} = ${chain} = ${prods.map(fmt).join(' + ')} = ${fmt(ans)}。`), sayAfter:`${a} × ${b} = ${ans}`}, pres, eqExpr(a, b));
};

/* 2) runde av og rette opp: 276 × 3 = 300 × 3 − 24 × 3 */
M.calcRound = function(a, b, pres){
  const L = String(a).length, R = Math.ceil(a / P10(L - 1)) * P10(L - 1), d = R - a, ans = a * b, sym = `${fmt(a)} × ${b}`, rb = R * b, db = d * b;
  const rd = L === 2 ? 10 : 100;
  const lines = n => {
    const L1 = `${sym}`, L2 = `= (${fmt(R)} − ${d}) × ${b}`, L3 = `= ${fmt(R)} × ${b} − ${d} × ${b}`, L4 = `= ${fmt(rb)} − ${fmt(db)}`, L5 = `= ${fmt(ans)}`;
    return exprBoard([L1, n >= 2 ? L2 : '', n >= 4 ? L3 : '', n >= 5 ? L4 : '', n >= 6 ? `<span class="g">${L5}</span>` : ''].filter(Boolean));
  };
  const steps = [
    {ask:T(`Hvilket rundt tall ligger ${fmt(a)} nærmest oppover?`, `${fmt(a)} 向上最接近哪个整${L === 2 ? '十' : '百'}数？`), say:T(`Hvilket runde tall ligger ${a} nærmest oppover?`, `${a} 向上最接近哪个整${L === 2 ? '十' : '百'}数？`),
      answer:R, near:[R - rd, R + rd, R - rd / 10 * 5].filter(v => v > 0 && v !== R), line:`${fmt(a)} er nesten ${fmt(R)}`, board:lines(1),
      hint:T(`Se på ${L === 2 ? 'tierne' : 'hundrene'} og gå opp til neste runde tall.`, `看${L === 2 ? '十位' : '百位'}，往上取到下一个整数。`), explain:T(`${fmt(a)} er nesten ${fmt(R)}.`, `${fmt(a)} 差不多是 ${fmt(R)}。`)},
    {ask:T(`Hvor mye mangler ${fmt(a)} til ${fmt(R)}?`, `${fmt(a)} 还差多少到 ${fmt(R)}？`), say:T(`Hvor mye mangler ${a} til ${R}?`, `${a} 还差多少到 ${R}？`),
      answer:d, near:[d + 1, Math.max(1, d - 1), d + 10].filter(v => v > 0 && v !== d), min:1, line:`${fmt(R)} − ${fmt(a)} = ${d}, så ${fmt(a)} = ${fmt(R)} − ${d}`, board:lines(2),
      hint:T(`Regn ${fmt(R)} − ${fmt(a)}.`, `算 ${fmt(R)} − ${fmt(a)}。`), explain:T(`${fmt(R)} − ${fmt(a)} = ${d}.`, `${fmt(R)} − ${fmt(a)} = ${d}。`)},
    {ask:T(`${fmt(R)} × ${b} = ?`, `${fmt(R)} × ${b} = ?`), say:T(`${R} × ${b}`, `${R} × ${b}`), answer:rb, near:[rb / 10, rb * 10, (R - rd) * b].filter(v => Number.isInteger(v) && v > 0 && v !== rb),
      line:`${fmt(R)} × ${b} = ${fmt(rb)}`, board:lines(3),
      hint:T(`Regn ${R / P10(L - 1)} × ${b} = ${R / P10(L - 1) * b} og legg til ${L - 1} ${L === 2 ? 'null' : 'nuller'}.`, `先算 ${R / P10(L - 1)} × ${b} = ${R / P10(L - 1) * b}，再添 ${L - 1} 个 0。`), explain:T(`${fmt(R)} × ${b} = ${fmt(rb)}.`, `${fmt(R)} × ${b} = ${fmt(rb)}。`)},
    {ask:T(`${d} × ${b} = ?`, `${d} × ${b} = ?`), say:T(`${d} × ${b}`, `${d} × ${b}`), answer:db, near:[db + 1, db - 1, db + 10].filter(v => v > 0 && v !== db),
      line:`${d} × ${b} = ${fmt(db)}`, board:lines(4), hint:T('Regn den lille biten for seg.', '把小的那一部分单独算出来。'), explain:T(`${d} × ${b} = ${fmt(db)}.`, `${d} × ${b} = ${fmt(db)}。`)},
    {ask:T(`Trekk fra: ${fmt(rb)} − ${fmt(db)} = ?`, `减去：${fmt(rb)} − ${fmt(db)} = ?`), say:T(`Trekk fra: ${rb} − ${db}`, `减去：${rb} − ${db}`), answer:ans, near:[rb + db, ans + 10, ans - 10, ans + 100].filter(v => v > 0 && v !== ans),
      line:`${fmt(rb)} − ${fmt(db)} = ${fmt(ans)}`, board:lines(6), hint:T('Du la til for mye, så nå må du trekke fra igjen.', '多加了一些，所以现在要减掉。'), explain:T(`${fmt(rb)} − ${fmt(db)} = ${fmt(ans)}.`, `${fmt(rb)} − ${fmt(db)} = ${fmt(ans)}。`)}];
  return wrapCalc({title:T(`Regn ut ${sym}. Rund av og rett opp.`, `计算 ${sym}。先凑整，再补偿。`), say:T(`Regn ut ${a} × ${b}. Rund av og rett opp.`, `计算 ${a} × ${b}。先凑整，再补偿。`),
    board0:exprBoard([sym, `<span class="dim">${fmt(a)} = ${fmt(R)} − ${d}  ?</span>`]), steps, answer:ans, near:ansNear(ans),
    fb:T(`${sym} = ${fmt(R)} × ${b} − ${d} × ${b} = ${fmt(rb)} − ${fmt(db)} = ${fmt(ans)}.`, `${sym} = ${fmt(R)} × ${b} − ${d} × ${b} = ${fmt(rb)} − ${fmt(db)} = ${fmt(ans)}。`), sayAfter:`${a} × ${b} = ${ans}`}, pres, eqExpr(a, b));
};

/* 3) dobbelt, dobbelt igjen / halvparten av × 10 */
M.calcDouble = function(a, kind, pres){
  const sym = `${a} × ${kind}`, ans = a * kind; let steps, title, titleZh, chain, boards;
  const lines = arr => exprBoard(arr);
  if(kind === 5){
    const t = a * 10;
    steps = [{ask:T(`${a} × 10 = ?`, `${a} × 10 = ?`), say:T(`${a} × 10`, `${a} × 10`), answer:t, near:[a * 5, a * 100, a + 10], line:`${a} × 10 = ${fmt(t)}`, board:lines([sym, `${a} × 10 = ${fmt(t)}`]),
        hint:T('Legg til en null.', '后面添一个 0。'), explain:T(`${a} × 10 = ${fmt(t)}.`, `${a} × 10 = ${fmt(t)}。`)},
      {ask:T(`Ta halvparten av ${fmt(t)}. Hva blir det?`, `取 ${fmt(t)} 的一半。是多少？`), say:T(`Ta halvparten av ${t}.`, `取 ${t} 的一半。`), answer:ans, near:[t / 10, ans + 5, ans - 5, ans * 2].filter(v => v > 0 && v !== ans),
        line:`halvparten av ${fmt(t)} = ${fmt(ans)}`, board:lines([sym, `${a} × 10 = ${fmt(t)}`, `<span class="g">halvparten av ${fmt(t)} = ${fmt(ans)}</span>`]),
        hint:T(`Del ${fmt(t)} i to like deler.`, `把 ${fmt(t)} 平分成两份。`), explain:T(`Halvparten av ${fmt(t)} er ${fmt(ans)}.`, `${fmt(t)} 的一半是 ${fmt(ans)}。`)}];
    title = `Regn ut ${sym}. Gang med 10 og ta halvparten.`; titleZh = `计算 ${sym}。先乘 10，再取一半。`; chain = `${a} × 10 = ${fmt(t)}, halvparten er ${fmt(ans)}`;
  } else {
    const n = kind === 4 ? 2 : 3; let cur = a; steps = []; const ls = [sym];
    for(let i = 0; i < n; i++){
      const nx = cur * 2; ls.push(i === n - 1 ? `<span class="g">${fmt(cur)} × 2 = ${fmt(nx)}</span>` : `${fmt(cur)} × 2 = ${fmt(nx)}`);
      steps.push({ask:T(i === 0 ? `Dobbelt av ${fmt(cur)}. Hva blir det?` : `Dobbelt igjen: ${fmt(cur)} × 2 = ?`, i === 0 ? `${fmt(cur)} 的两倍是多少？` : `再翻一倍：${fmt(cur)} × 2 = ?`), say:T(i === 0 ? `Dobbelt av ${cur}.` : `Dobbelt igjen: ${cur} × 2`, i === 0 ? `${cur} 的两倍。` : `再翻一倍：${cur} × 2`),
        answer:nx, near:[cur + 2, nx + 10, nx - 10, cur * 3].filter(v => v > 0 && v !== nx), line:`${fmt(cur)} × 2 = ${fmt(nx)}`, board:lines(ls.slice()),
        hint:T(`${fmt(cur)} + ${fmt(cur)}.`, `${fmt(cur)} + ${fmt(cur)}。`), explain:T(`${fmt(cur)} × 2 = ${fmt(nx)}.`, `${fmt(cur)} × 2 = ${fmt(nx)}。`)});
      cur = nx;
    }
    title = kind === 4 ? `Regn ut ${sym}. Dobbelt og dobbelt.` : `Regn ut ${sym}. Dobbelt tre ganger.`; titleZh = kind === 4 ? `计算 ${sym}。翻一倍，再翻一倍。` : `计算 ${sym}。连续翻三倍。`;
    chain = steps.map(s => s.line).join(', ');
  }
  return wrapCalc({title:T(title, titleZh), say:T(title, titleZh), board0:exprBoard([sym]), steps, answer:ans, near:ansNear(ans),
    fb:T(`${sym}: ${chain}. Svaret er ${fmt(ans)}.`, `${sym}：${chain}。答案是 ${fmt(ans)}。`), sayAfter:`${a} × ${kind} = ${ans}`}, pres, {sym:`${a} × ${kind} = ?`, wNo:N.eqNo(a, kind), wZh:N.eqZh(a, kind), listen:`Hva er ${a} × ${kind}?`, plain:`${a} × ${kind}`});
};

/* 4) tiere, hundrer og tusener: 30 × 4, 20 × 30 */
M.calcTen = function(m, n, i, j, pres){
  const A_ = m * P10(i), B_ = n * P10(j), z = i + j, base = m * n, ans = base * P10(z), sym = `${fmt(A_)} × ${fmt(B_)}`;
  const steps = [
    {ask:T(`Regn først uten nullene: ${m} × ${n} = ?`, `先不管 0：${m} × ${n} = ?`), say:T(`Regn først uten nullene: ${m} × ${n}`, `先不管 0：${m} × ${n}`), answer:base, near:[base + m, base - m, base + n].filter(v => v > 0 && v !== base),
      line:`${m} × ${n} = ${base}`, board:exprBoard([sym, `${m} × ${n} = ${base}`]), hint:T('Bruk gangetabellen.', '用乘法表。'), explain:T(`${m} × ${n} = ${base}.`, `${m} × ${n} = ${base}。`)},
    {ask:T(`Hvor mange nuller står det bak ${fmt(A_)} og ${fmt(B_)} til sammen?`, `${fmt(A_)} 和 ${fmt(B_)} 后面一共有几个 0？`), say:T(`Hvor mange nuller står det bak ${A_} og ${B_} til sammen?`, `${A_} 和 ${B_} 后面一共有几个 0？`), answer:z, min:0, near:[z + 1, Math.max(1, z - 1), z + 2],
      line:`${z} ${z === 1 ? 'null' : 'nuller'}`, board:exprBoard([sym, `${m} × ${n} = ${base}`, `${z} ${z === 1 ? 'null' : 'nuller'}`]), hint:T('Tell nullene i begge tallene.', '数一数两个数后面的 0。'), explain:T(`${fmt(A_)} har ${i}, ${fmt(B_)} har ${j}. Til sammen ${z}.`, `${fmt(A_)} 有 ${i} 个，${fmt(B_)} 有 ${j} 个。一共 ${z} 个。`)},
    {ask:T(`Legg nullene bak ${base}. Hva blir ${sym}?`, `在 ${base} 后面添上这些 0。${sym} 等于多少？`), say:T(`Legg nullene bak ${base}. Hva blir ${A_} × ${B_}?`, `在 ${base} 后面添上这些 0。${A_} × ${B_} 等于多少？`), answer:ans, near:[base, ans * 10, base * P10(Math.max(0, z - 1))].filter(v => v > 0 && v !== ans),
      line:`${sym} = ${fmt(ans)}`, board:exprBoard([sym, `${m} × ${n} = ${base}`, `${z} ${z === 1 ? 'null' : 'nuller'}`, `<span class="g">${sym} = ${fmt(ans)}</span>`]), hint:T(`${base} og så ${z} ${z === 1 ? 'null' : 'nuller'} bak.`, `${base} 后面再添 ${z} 个 0。`), explain:T(`${base} med ${z} ${z === 1 ? 'null' : 'nuller'} bak er ${fmt(ans)}.`, `${base} 后面添 ${z} 个 0 是 ${fmt(ans)}。`)}];
  return wrapCalc({title:T(`Regn ut ${sym}.`, `计算 ${sym}。`), say:T(`Regn ut ${A_} × ${B_}.`, `计算 ${A_} × ${B_}。`), board0:exprBoard([sym]), steps, answer:ans, near:[base, ans * 10, ans / 10].filter(v => v > 0 && v !== ans),
    fb:T(`${m} × ${n} = ${base}, og ${z} ${z === 1 ? 'null' : 'nuller'} bak. ${sym} = ${fmt(ans)}.`, `${m} × ${n} = ${base}，后面添 ${z} 个 0。${sym} = ${fmt(ans)}。`), sayAfter:`${A_} × ${B_} = ${ans}`}, pres, eqExpr(A_, B_));
};

/* 5) gamlemåten: oppstilling med mente */
M.calcStd = function(a, b, pres){
  const ds = String(a).split('').map(Number).reverse(), L = ds.length, ans = a * b, sym = `${fmt(a)} × ${b}`;
  const steps = [], res = [], carry = []; let c = 0;
  const place = ['enerne', 'tierne', 'hundrene', 'tusenene', 'titusenene'];
  for(let i = 0; i < L; i++){
    const cIn = c, t = ds[i] * b + cIn, unit = t % 10, cOut = Math.floor(t / 10), last = i === L - 1, needCarry = !last && cOut > 0;
    const line1 = `${ds[i]} × ${b}${cIn ? ' + ' + cIn : ''} = ${t}`;
    res[i] = String(unit); if(last && cOut) res[i + 1] = String(cOut); else if(!last && cOut) carry[i + 1] = cOut;
    const after = {res:res.slice(), carry:carry.slice(), active:last ? undefined : i + 1};
    const askNo = i === 0 ? `Start med enerne: ${ds[i]} × ${b} = ?` : cIn ? `${place[i][0].toUpperCase() + place[i].slice(1)}: ${ds[i]} × ${b} + ${cIn} (mente) = ?` : `${place[i][0].toUpperCase() + place[i].slice(1)}: ${ds[i]} × ${b} = ?`;
    const askZh = i === 0 ? `从个位开始：${ds[i]} × ${b} = ?` : cIn ? `${znames[i]}：${ds[i]} × ${b} + ${cIn}（进位）= ?` : `${znames[i]}：${ds[i]} × ${b} = ?`;
    const s1 = {ask:T(askNo, askZh), say:T(askNo, askZh), answer:t, near:[t + 1, t - 1, ds[i] * b, t + 10].filter(v => v >= 0 && v !== t), line:line1,
      hint:cIn ? T(`Regn ${ds[i]} × ${b} først, og legg til mente ${cIn}.`, `先算 ${ds[i]} × ${b}，再加上进位 ${cIn}。`) : T('Bruk gangetabellen.', '用乘法表。'), explain:T(line1 + '.', line1 + '。')};
    if(needCarry){
      s1.board = undefined; steps.push(s1);
      const right = `skriv ${unit}, mente ${cOut}`;
      let opts = uniq([right, `skriv ${cOut}, mente ${unit}`, `skriv ${t}, mente 0`, `skriv ${unit}, mente 0`, `skriv ${unit}, mente ${cOut + 1}`]);
      const wrongs = opts.filter(x => x !== right).slice(0, 3);
      steps.push({ask:T(`${t}: hva skriver du under streken, og hva er mente?`, `${t}：下面写什么？进位是多少？`), say:T(`${t}. Hva skriver du under streken, og hva er mente?`, `${t}。下面写什么？进位是多少？`),
        choices:shuffle([{html:choiceHtml(right), value:'ok'}].concat(wrongs.map((w, k) => ({html:choiceHtml(w), value:'w' + k})))), layout:'col', answer:'ok', show:right,
        line:`${t} → ${right}`, board:MG.column(a, b, after), hint:T('Skriv bare enerne under streken. Tierne blir mente.', '只把个位写在横线下面，十位变成进位。'),
        explain:T(`${t} er ${cOut} tiere og ${unit} enere. Skriv ${unit}, og ta med ${cOut} som mente.`, `${t} 是 ${cOut} 个十和 ${unit} 个一。写下 ${unit}，进位 ${cOut}。`)});
    } else { s1.board = MG.column(a, b, after); steps.push(s1); }
    c = cOut;
  }
  steps.push({ask:T('Les av svaret under streken. Hva er svaret?', '读出横线下面的答案。答案是多少？'), say:T('Les av svaret under streken. Hva er svaret?', '读出横线下面的答案。答案是多少？'), answer:ans, near:ansNear(ans),
    line:`${sym} = ${fmt(ans)}`, board:MG.column(a, b, {res:res.slice(), carry:[]}), hint:T('Les sifrene under streken fra venstre mot høyre.', '从左到右读横线下面的数字。'), explain:T(`${sym} = ${fmt(ans)}.`, `${sym} = ${fmt(ans)}。`)});
  return wrapCalc({title:T(`Regn ut ${sym} på gamlemåten (oppstilling).`, `用竖式计算 ${sym}。`), say:T(`Regn ut ${a} × ${b} på gamlemåten.`, `用竖式计算 ${a} × ${b}。`),
    board0:MG.column(a, b, {active:0}), steps, answer:ans, near:ansNear(ans),
    fb:T(`${sym} = ${fmt(ans)}. Start bakerst med enerne, skriv ett siffer om gangen, og ta med mente.`, `${sym} = ${fmt(ans)}。从个位开始，每次写一个数字，别忘了进位。`), sayAfter:`${a} × ${b} = ${ans}`}, pres, eqExpr(a, b));
};

/* 6) to-sifret × to-sifret: rutenett og oppstilling */
M.calcArea22 = function(a, b, pres){
  const ap = digitsParts(a), bp = digitsParts(b), ans = a * b, sym = `${a} × ${b}`;
  const cells = n => bp.map((q, r) => ap.map((p, c) => (r * ap.length + c) < n ? fmt(p * q) : ''));
  const steps = []; let k = 0; const all = [];
  bp.forEach((q, r) => ap.forEach((p, c) => { all.push(p * q);
    steps.push({ask:T(`${fmt(p)} × ${fmt(q)} = ?`, `${fmt(p)} × ${fmt(q)} = ?`), say:T(`${p} × ${q}`, `${p} × ${q}`), answer:p * q, near:[p * q * 10, p * q / 10, p + q].filter(v => Number.isInteger(v) && v > 0 && v !== p * q),
      line:`${fmt(p)} × ${fmt(q)} = ${fmt(p * q)}`, board:MG.area(ap, bp, {cells:cells(++k), hi:[r, c]}),
      hint:T('Regn tallene uten nuller først, og legg til nullene til slutt.', '先不管 0，最后再把 0 添上。'), explain:T(`${fmt(p)} × ${fmt(q)} = ${fmt(p * q)}.`, `${fmt(p)} × ${fmt(q)} = ${fmt(p * q)}。`)}); }));
  steps.push({ask:T(`Legg sammen alle fire: ${all.map(fmt).join(' + ')} = ?`, `把四个结果加起来：${all.map(fmt).join(' + ')} = ?`), say:T(`Legg sammen: ${all.join(' + ')}`, `加起来：${all.join(' + ')}`), answer:ans, near:ansNear(ans),
    line:`${all.map(fmt).join(' + ')} = ${fmt(ans)}`, board:MG.area(ap, bp, {cells:cells(99), total:`= ${fmt(ans)}`}), hint:T('Legg sammen to og to.', '两个两个地加。'), explain:T(`${all.map(fmt).join(' + ')} = ${fmt(ans)}.`, `${all.map(fmt).join(' + ')} = ${fmt(ans)}。`)});
  return wrapCalc({title:T(`Regn ut ${sym} med rutenett.`, `用方格图计算 ${sym}。`), say:T(`Regn ut ${a} × ${b} med rutenett.`, `用方格图计算 ${a} × ${b}。`), board0:MG.area(ap, bp, {cells:bp.map(() => ap.map(() => '?'))}),
    steps, answer:ans, near:ansNear(ans), fb:T(`${sym} = ${all.map(fmt).join(' + ')} = ${fmt(ans)}.`, `${sym} = ${all.map(fmt).join(' + ')} = ${fmt(ans)}。`), sayAfter:`${a} × ${b} = ${ans}`}, pres, eqExpr(a, b));
};
M.calcStd22 = function(a, b, pres){
  const b1 = b % 10, b10 = b - b1, p1 = a * b1, p2 = a * b10, ans = a * b, sym = `${a} × ${b}`;
  const rows = n => [{lb:'', v:fmt(a)}, {lb:`× ${b}`, v:''}].slice(0, 0).concat([{lb:`${a} × ${b1}`, v:n >= 1 ? fmt(p1) : '?'}, {lb:`${a} × ${b10}`, v:n >= 2 ? fmt(p2) : '?'}, {lb:'sum', v:n >= 3 ? fmt(ans) : '?', cls:'sum'}]);
  const steps = [
    {ask:T(`Ganger med enerne først: ${a} × ${b1} = ?`, `先乘个位：${a} × ${b1} = ?`), say:T(`${a} × ${b1}`, `${a} × ${b1}`), answer:p1, near:[p1 + 10, p1 - 10, a * b10].filter(v => v > 0 && v !== p1),
      line:`${a} × ${b1} = ${fmt(p1)}`, board:MG.partials(rows(1)), hint:T('Bruk oppstilling med mente om du vil.', '需要的话可以用竖式。'), explain:T(`${a} × ${b1} = ${fmt(p1)}.`, `${a} × ${b1} = ${fmt(p1)}。`)},
    {ask:T(`Så tierne: ${a} × ${b10} = ?`, `再乘十位：${a} × ${b10} = ?`), say:T(`${a} × ${b10}`, `${a} × ${b10}`), answer:p2, near:[a * (b10 / 10), p2 * 10, p2 + 10].filter(v => v > 0 && v !== p2),
      line:`${a} × ${b10} = ${fmt(p2)}`, board:MG.partials(rows(2)), hint:T(`Regn ${a} × ${b10 / 10} og legg til en null.`, `先算 ${a} × ${b10 / 10}，再添一个 0。`), explain:T(`${a} × ${b10 / 10} = ${a * b10 / 10}, og en null bak: ${fmt(p2)}.`, `${a} × ${b10 / 10} = ${a * b10 / 10}，后面添一个 0：${fmt(p2)}。`)},
    {ask:T(`Legg sammen: ${fmt(p1)} + ${fmt(p2)} = ?`, `加起来：${fmt(p1)} + ${fmt(p2)} = ?`), say:T(`Legg sammen: ${p1} + ${p2}`, `加起来：${p1} + ${p2}`), answer:ans, near:ansNear(ans),
      line:`${fmt(p1)} + ${fmt(p2)} = ${fmt(ans)}`, board:MG.partials(rows(3)), hint:T('Legg sammen.', '加起来。'), explain:T(`${fmt(p1)} + ${fmt(p2)} = ${fmt(ans)}.`, `${fmt(p1)} + ${fmt(p2)} = ${fmt(ans)}。`)}];
  return wrapCalc({title:T(`Regn ut ${sym} på gamlemåten.`, `用竖式的方法计算 ${sym}。`), say:T(`Regn ut ${a} × ${b} på gamlemåten.`, `用竖式的方法计算 ${a} × ${b}。`),
    board0:MG.partials(rows(0)), steps, answer:ans, near:ansNear(ans),
    fb:T(`${sym} = ${a} × ${b1} + ${a} × ${b10} = ${fmt(p1)} + ${fmt(p2)} = ${fmt(ans)}.`, `${sym} = ${a} × ${b1} + ${a} × ${b10} = ${fmt(p1)} + ${fmt(p2)} = ${fmt(ans)}。`), sayAfter:`${a} × ${b} = ${ans}`}, pres, eqExpr(a, b));
};

/* ---------- tekstoppgaver ---------- */
const NAMES = N.NAMES, THINGS = N.THINGS, HOLDERS = N.HOLDERS;
M.storyModel = function(kind, lvl){
  const [nm, nz] = pick(NAMES), [nm2, nz2] = pick(NAMES.filter(x => x[0] !== nm)), th = pick(THINGS), ho = pick(HOLDERS);
  const small = () => rnd(2, 9), big = () => lvl === 3 ? rnd(101, 499) : lvl === 2 ? rnd(11, 49) : rnd(2, 9);
  let a, b, no, zh, emoji = th.emoji, holder = ho.emoji, unit = '';
  if(kind === 'groups'){ a = small(); b = big();
    no = `${nm} har ${a} ${ho.pl} med ${b} ${th.pl} i hver ${ho.sg}. Hvor mange ${th.pl} er det til sammen?`;
    zh = `${nz}有 ${a} ${ho.zh}${th.zh}，每${ho.zh}有 ${b} ${th.mw}。一共有多少${th.mw}${th.zh}？`; }
  else if(kind === 'price'){ a = small(); b = lvl === 3 ? rnd(101, 299) : lvl === 2 ? rnd(11, 49) : rnd(2, 9); unit = ' kr';
    no = `En ${th.sg} koster ${b} kr. Hvor mye koster ${a} ${th.pl}?`; zh = `一${th.mw}${th.zh}要 ${b} 克朗。${a} ${th.mw}${th.zh}要多少钱？`; }
  else if(kind === 'rows'){ a = small(); b = big(); emoji = '🪑'; holder = '';
    no = `Det er ${a} rader med ${b} stoler i hver rad. Hvor mange stoler er det?`; zh = `有 ${a} 排椅子，每排 ${b} 把。一共有多少把椅子？`; }
  else if(kind === 'times'){ a = small(); b = big();
    no = `${nm} har ${b} ${th.pl}. ${nm2} har ${a} ganger så mange. Hvor mange ${th.pl} har ${nm2}?`;
    zh = `${nz}有 ${b} ${th.mw}${th.zh}。${nz2}的数量是${nz}的 ${a} 倍。${nz2}有多少${th.mw}${th.zh}？`; holder = ''; }
  else { a = small(); b = big(); emoji = '📖'; holder = '';
    no = `Hver dag leser ${nm} ${b} sider. Hvor mange sider leser ${nm} på ${a} dager?`; zh = `${nz}每天读 ${b} 页。${a} 天一共读多少页？`; }
  return {kind, lvl, a, b, ans:a * b, no, zh, emoji, holder, unit, nm};
};
M.story = function(kind, lvl, pres){
  pres = M.pres(pres);
  const s = M.storyModel(kind, lvl), card = `<div class="storybox"><span class="no">${s.no}</span><span class="zh">${s.zh}</span></div>`;
  const pic = lvl === 1 && s.holder ? `<div style="margin-top:8px">${MG.groups(s.a, Math.min(s.b, 9), s.emoji, s.holder, {small:true})}</div>` : '';
  const out = {q:T('Les oppgaven og regn ut.', '读题，然后计算。')};
  if(pres === 'speech'){ const h = present('speech', {listen:s.no}); out.visual = h.visual; out.listen = s.no; out.forceSpeak = true; out.q = T('Lytt og regn ut.', '听一听，然后计算。'); }
  else out.visual = card + pic;
  const sub = lvl === 1 ? null : M.calcSplit(s.a > s.b ? s.a : s.b, s.a > s.b ? s.b : s.a, 'num');
  const eqRight = `${s.a} × ${s.b}`, wrong = shuffle([`${s.a} + ${s.b}`, `${Math.max(s.a, s.b)} − ${Math.min(s.a, s.b)}`, `${s.b} + ${s.b} + ${s.a}`, `${s.a} × ${s.a}`]).filter(x => x !== eqRight && x !== `${s.b} × ${s.a}`).slice(0, 3);
  const eqStep = {ask:T('Hvilket regnestykke passer til oppgaven?', '哪一个算式符合这道题？'), say:T('Hvilket regnestykke passer til oppgaven?', '哪一个算式符合这道题？'),
    choices:shuffle([{html:choiceHtml(eqRight), value:'ok'}].concat(wrong.map((w, i) => ({html:choiceHtml(w), value:'w' + i})))), layout:'row', answer:'ok', show:eqRight, line:`${eqRight}`,
    board:sub ? sub.board0 : `<div class="storybox"><span class="no">${eqRight} = ?</span></div>`,
    hint:T('Det er like store grupper. Da bruker vi gange.', '每组一样多，所以用乘法。'), explain:T(`Like store grupper: ${eqRight}.`, `每组一样多：${eqRight}。`)};
  let steps;
  if(sub){ steps = [eqStep].concat(sub.steps); }
  else steps = [eqStep, {ask:T(`Regn ut ${eqRight}.`, `计算 ${eqRight}。`), say:T(`Regn ut ${s.a} × ${s.b}`, `计算 ${s.a} × ${s.b}`), answer:s.ans, near:ansNear(s.ans).concat([s.a + s.b]).filter(v => v > 0 && v !== s.ans),
    line:`${eqRight} = ${fmt(s.ans)}`, board:`<div class="storybox"><span class="no">${eqRight} = ${fmt(s.ans)}</span></div>`, hint:T('Bruk gangetabellen.', '用乘法表。'), explain:T(`${eqRight} = ${fmt(s.ans)}.`, `${eqRight} = ${fmt(s.ans)}。`)}];
  steps.forEach(st => { if(st.board) st.board = card + st.board; });
  const fbNo = `${eqRight} = ${fmt(s.ans)}${s.unit}.`, ans = s.ans;
  return Object.assign(out, {title:T('Tekstoppgave: les og regn ut.', '应用题：读题并计算。'), say:T(s.no, s.zh), qsay:T(s.no, s.zh), board0:card + pic,
    steps, answer:ans, unit:s.unit, near:ansNear(ans).concat([s.a + s.b]).filter(v => v > 0 && v !== ans), min:0, noGuide:pres === 'speech',
    fb:T(`${fbNo} Svar: ${fmt(ans)}${s.unit}.`, `${eqRight} = ${fmt(ans)}${s.unit}。答案：${fmt(ans)}${s.unit}。`), sayAfter:`${eqRight} = ${ans}`, story:s});
};
})();
