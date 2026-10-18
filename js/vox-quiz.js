(function(){
'use strict';
/* Norsk Voksenopplæring – øktkjører: viser spørsmål, tar imot svar, gir tilbakemelding og oppdaterer repetisjonssystemet. */
const A = window.App, V = A.Vox, B = V.Build, {h, esc, shuffle} = A;
const T = (en, zh) => A.bi(en, zh);
const Q = V.Quiz = {active:null};
const PRAISE = [['Correct!', '答对了！'], ['Great!', '太棒了！'], ['Well done!', '做得好！'], ['Yes!', '对！'], ['Excellent!', '很好！'], ['Nice one!', '不错！']];
const WHY = {
  digraph:['Correct. Tip: the letters are æ, ø and å (you wrote ae, oe or aa).', '正确。提示：字母是 æ、ø、å（你写的是 ae、oe 或 aa）。'],
  accent:['Almost! Watch the letters æ, ø and å.', '差一点！注意字母 æ、ø、å。'],
  typo:['Almost! Check the spelling.', '差一点！检查一下拼写。'],
  article:['Almost! Nouns need the article (en / ei / et).', '差一点！名词要带冠词（en / ei / et）。'],
  gender:['Right word, wrong article.', '词对了，冠词不对。'],
  hint:['Correct, but you used a hint.', '答对了，但用了提示。'],
  retry:['Correct on the second try.', '第二次答对了。']
};

/* ---------- økten ---------- */
Q.stop = function(){
  const a = Q.active; if(!a) return;
  document.removeEventListener('keydown', a.onKey, true);
  clearInterval(a.timer); clearTimeout(a.auto);
  Q.active = null; A.Speech.stop();
};

/* cfg: {title, ids, count, modes, input, auto, smart, art, fast, timed, steps, learn}   hooks: {onExit, onAgain, onPractice} */
Q.run = function(root, cfg, hooks){
  Q.stop(); hooks = hooks || {};
  const pool = cfg.ids.map(V.item).filter(Boolean), ctx = {pool};
  // bare ord/fraser som minst én valgt oppgavetype passer for (f.eks. bare substantiv ved «kjønn»)
  let usable = cfg.ids;
  if(!cfg.steps && cfg.modes && cfg.modes.length){
    const ms = cfg.modes.map(B.mode).filter(m => m && B.inputOK(m, cfg.input));
    const f = cfg.ids.filter(id => { const it = V.item(id); return it && ms.some(m => B.applies(m, it)); });
    if(f.length) usable = f;
  }
  // «kjønn» og «bøying» øver egne ferdigheter: velg ord etter hvor godt de er øvd i akkurat den ferdigheten
  const only = k => cfg.modes && cfg.modes.length && cfg.modes.every(m => m === k);
  const fct = only('gender') ? '#g' : only('forms') ? '#f' : '';
  const queue = cfg.steps ? null : V.pick(usable.map(id => id + fct), cfg.count, {smart:cfg.smart}).map(k => fct ? k.slice(0, -fct.length) : k);
  const st = {n:0, qi:0, total:cfg.steps ? cfg.steps.length : queue.length, ok:0, almost:0, bad:0, streak:0, best:0, missed:[], retry:[], t0:Date.now(), cur:null, locked:false, done:false, hints:0, results:new Map()};
  Q.active = st; st.cfg = cfg;
  root.innerHTML = `<div class="session vq">
    <div class="sbar"><button class="x" id="vqX" title="Close / 关闭">✕</button><div class="stitle">${T(cfg.title.en, cfg.title.zh)}</div><div class="prog"><i id="vqProg"></i></div><span class="streak" id="vqStat"></span></div>
    <div class="qcard vq-card" id="vqCard"></div><div id="vqFb"></div></div>`;
  const $ = s => root.querySelector(s);
  $('#vqX').onclick = () => { Q.stop(); if(hooks.onExit) hooks.onExit(st); };
  if(cfg.timed){ st.deadline = Date.now() + cfg.timed * 1000; st.timer = setInterval(() => { if(Date.now() >= st.deadline){ if(!st.done) end(); } else bar(); }, 250); }

  function bar(){
    $('#vqProg').style.width = Math.min(100, Math.round(100 * st.qi / Math.max(1, st.total))) + '%';
    const left = cfg.timed ? ` ⏱ ${Math.max(0, Math.ceil((st.deadline - Date.now()) / 1000))}` : '';
    $('#vqStat').textContent = `✓ ${st.ok}${st.almost + st.bad ? ' ✗ ' + (st.almost + st.bad) : ''} 🔥 ${st.streak}${left}`;
  }

  /* ---- neste spørsmål ---- */
  function next(){
    if(st.done) return;
    clearTimeout(st.auto); $('#vqFb').innerHTML = '';
    let q = null;
    const mainLeft = cfg.steps ? st.qi < cfg.steps.length : st.qi < queue.length;
    const r = st.retry.findIndex(x => st.n - x.at >= 3);
    if(r >= 0 || (!mainLeft && st.retry.length)){
      // feil svar kommer tilbake litt senere i økta
      const item = st.retry.splice(r >= 0 ? r : 0, 1)[0].item;
      q = B.make(item, cfg, ctx); q.retry = true;
    } else if(!mainLeft) return end();
    else if(cfg.steps){ q = cfg.steps[st.qi++](); if(!q) return next(); }
    else {
      const item = V.item(queue[st.qi++]);
      if(!item) return next();
      const m = B.chooseMode(item, cfg);
      if(m && m.k === 'match'){
        // et parspill bruker 4 ord til fra køen
        const others = []; let removed = 0;
        const fits = o => o && o.type === 'w' && o.id !== item.id && !others.includes(o) && ![item, ...others].some(x => B.sharesMeaning(x, o));
        for(let i = st.qi; i < queue.length && others.length < 4; i++){ const o = V.item(queue[i]); if(fits(o)){ others.push(o); queue.splice(i, 1); i--; removed++; } }
        const filler = shuffle(pool.filter(x => fits(x)));
        while(others.length < 4 && filler.length){ const f = filler.shift(); if(fits(f)) others.push(f); }
        q = others.length >= 3 ? B.match([item, ...others], ctx) : B.rec(item, ctx);
        if(q.mode === 'match') st.total = Math.max(st.total - removed, st.qi);
      } else q = B.make(item, cfg, ctx, m);
      q.retry = false;
    }
    st.n++; show(q);
  }

  /* ---- vis spørsmål ---- */
  function show(q){
    st.cur = q; st.locked = false; st.hints = 0; q.usedHint = false;
    const card = $('#vqCard');
    card.innerHTML = `<div class="vq-head">${T(q.head.en, q.head.zh)}${q.retry ? `<span class="tag retry">↻ ${T('again', '再来一次')}</span>` : ''}</div><div class="vq-body">${q.promptHtml || ''}</div><div class="vq-ans" id="vqAns"></div>`;
    const ans = card.querySelector('#vqAns');
    ({choice:renderChoice, type:renderType, build:renderBuild, match:renderMatch, card:renderCard, intro:renderIntro})[q.kind](q, ans);
    bar();
    if(q.speakOnShow && (q.force || V.prefs.auto)) V.say(q.speakOnShow);
    if(q.kind === 'type'){ const i = ans.querySelector('input'); if(i && !('ontouchstart' in window)) setTimeout(() => i.focus(), 30); }
  }

  /* ---- flervalg ---- */
  function renderChoice(q, ans){
    const box = h('div', {class:'opts ' + (q.cols || 'row')});
    q.options.forEach((o, i) => {
      const b = h('button', {type:'button', class:'opt', html:`<span class="optn">${i + 1}</span><span class="optc">${o.html}</span>`});
      b.onclick = () => {
        if(st.locked) return;
        const res = o.ok ? 'ok' : (o.res || 'bad');
        box.querySelectorAll('.opt').forEach(x => x.classList.add('lock'));
        b.classList.add(res === 'ok' ? 'ok' : res === 'almost' ? 'mid' : 'bad');
        if(res !== 'ok') box.children[q.options.findIndex(x => x.ok)].classList.add('ok');
        answered(res, {picked:o, why:res === 'almost' ? 'custom' : undefined});
      };
      box.append(b);
    });
    ans.append(box);
  }

  /* ---- skrive ---- */
  function renderType(q, ans){
    const wrap = h('div', {class:'vq-type', html:`<div class="typebox"><input class="ans vq-in" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="answer"></div>
      <div class="keys">${['æ', 'ø', 'å'].map(c => `<button type="button" data-ch="${c}">${c}</button>`).join('')}</div>
      ${q.note ? `<div class="small-note">${T(q.note.en, q.note.zh)}</div>` : ''}
      <div class="vq-hintline" id="vqHint"></div>
      <div class="row vq-tools"><button type="button" class="btn" id="vqCheck"><span class="bi"><span class="no">Check</span><span class="zh">检查</span></span></button>
      <button type="button" class="pill" id="vqHintBtn">💡 ${T('Hint', '提示')}</button><button type="button" class="pill" id="vqSkip">${T("I don't know", '我不知道')}</button></div>`});
    ans.append(wrap);
    const inp = wrap.querySelector('input');
    wrap.querySelectorAll('[data-ch]').forEach(b => b.onclick = () => { const s = inp.selectionStart == null ? inp.value.length : inp.selectionStart, e = inp.selectionEnd == null ? s : inp.selectionEnd; inp.value = inp.value.slice(0, s) + b.dataset.ch + inp.value.slice(e); inp.focus(); inp.setSelectionRange(s + 1, s + 1); });
    const check = () => {
      if(st.locked) return;
      const r = q.accept(inp.value);
      if(r.res === 'empty'){ inp.classList.add('shake'); setTimeout(() => inp.classList.remove('shake'), 400); return; }
      inp.readOnly = true; inp.classList.add(r.res === 'ok' ? 'ok' : r.res === 'almost' ? 'mid' : 'bad');
      answered(r.res, {why:r.why, typed:inp.value});
    };
    wrap.querySelector('#vqCheck').onclick = check;
    inp.addEventListener('keydown', e => { if(e.key === 'Enter'){ e.preventDefault(); if(!st.locked) check(); } });
    wrap.querySelector('#vqHintBtn').onclick = () => { if(st.locked) return; st.hints++; q.usedHint = true; wrap.querySelector('#vqHint').textContent = B.hintFor(q.target, st.hints); inp.focus(); };
    wrap.querySelector('#vqSkip').onclick = () => { if(st.locked) return; inp.readOnly = true; inp.classList.add('bad'); answered('bad', {skipped:true}); };
  }

  /* ---- bygg setningen ---- */
  function renderBuild(q, ans){
    const toks = shuffle(q.tokens.map((t, i) => ({t, i}))), line = [];
    const wrap = h('div', {class:'vq-build', html:`<div class="line" id="vbLine"></div><div class="pool" id="vbPool"></div>
      <div class="row vq-tools"><button type="button" class="btn" id="vbCheck"><span class="bi"><span class="no">Check</span><span class="zh">检查</span></span></button>
      <button type="button" class="pill" id="vbClear">↺ ${T('Clear', '清除')}</button><button type="button" class="pill" id="vbSkip">${T("I don't know", '我不知道')}</button></div>`});
    ans.append(wrap);
    const L = wrap.querySelector('#vbLine'), P = wrap.querySelector('#vbPool');
    const draw = () => {
      L.innerHTML = ''; P.innerHTML = '';
      line.forEach((x, k) => L.append(h('button', {type:'button', class:'tile', onclick:() => { if(st.locked) return; line.splice(k, 1); toks.push(x); draw(); }}, x.t)));
      toks.forEach((x, k) => P.append(h('button', {type:'button', class:'tile', onclick:() => { if(st.locked) return; toks.splice(k, 1); line.push(x); draw(); }}, x.t)));
    };
    draw();
    wrap.querySelector('#vbCheck').onclick = () => {
      if(st.locked || !line.length) return;
      const r = q.accept(line.map(x => x.t).join(' '));
      L.classList.add(r.res === 'ok' ? 'okline' : 'badline'); answered(r.res, {typed:line.map(x => x.t).join(' ')});
    };
    wrap.querySelector('#vbClear').onclick = () => { if(st.locked) return; toks.push(...line.splice(0)); draw(); };
    wrap.querySelector('#vbSkip').onclick = () => { if(st.locked) return; answered('bad', {skipped:true}); };
  }

  /* ---- parspill ---- */
  function renderMatch(q, ans){
    const wrap = h('div', {class:'vq-match', html:`<div class="mcol" id="mcL"></div><div class="mcol" id="mcR"></div>`});
    ans.append(wrap);
    let selL = null, left = q.left.length; const wrong = new Set();
    const mk = (side, it) => {
      const b = h('button', {type:'button', class:'opt mt', html:it.html}); b.dataset.id = it.id;
      b.onclick = () => {
        if(st.locked || b.classList.contains('done')) return;
        if(side === 'L'){
          wrap.querySelectorAll('#mcL .opt').forEach(x => x.classList.remove('sel')); selL = it.id; b.classList.add('sel');
          if(it.say && V.prefs.speak) V.say(it.say, {force:true});
          return;
        }
        if(!selL){ b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 400); return; }
        const lb = wrap.querySelector(`#mcL .opt[data-id="${CSS.escape(selL)}"]`);
        if(selL === it.id){
          lb.classList.remove('sel'); lb.classList.add('done', 'ok'); b.classList.add('done', 'ok'); left--; selL = null;
          if(!left) answered(wrong.size ? 'almost' : 'ok', {items:[...q.items].reduce((m, x) => (m[x.id] = wrong.has(x.id) ? 'almost' : 'ok', m), {})});
        } else {
          wrong.add(selL); wrong.add(it.id);
          lb.classList.add('bad'); b.classList.add('bad'); setTimeout(() => { lb.classList.remove('bad', 'sel'); b.classList.remove('bad'); }, 500); selL = null;
        }
      };
      return b;
    };
    q.left.forEach(it => wrap.querySelector('#mcL').append(mk('L', it)));
    q.right.forEach(it => wrap.querySelector('#mcR').append(mk('R', it)));
  }

  /* ---- kort (snu og vurder) ---- */
  function renderCard(q, ans){
    const w = q.item;
    const front = w.type === 'w' ? `<div class="vq-big"><span class="vq-nb">${V.dispHtml(w)}</span>${V.spkItem(w)}</div>${posLine(w)}` : `<div class="vq-big sm"><span class="vq-nb">${esc(w.nb)}</span>${V.spkItem(w)}</div>`;
    $('#vqCard .vq-body').innerHTML = front;
    const wrap = h('div', {class:'vq-flip', html:`<button type="button" class="btn big" id="vfShow"><span class="bi"><span class="no">Show answer</span><span class="zh">显示答案</span></span></button>`});
    ans.append(wrap);
    const rate = res => () => answered(res, {});
    wrap.querySelector('#vfShow').onclick = () => {
      st.flipped = true;
      wrap.innerHTML = `<div class="vq-back">${V.detailHtml(w)}</div><div class="rate">
        <button type="button" class="rbtn bad" data-r="bad">😕<span>${T("Didn't know", '不会')}</span></button>
        <button type="button" class="rbtn mid" data-r="almost">🤔<span>${T('Almost', '差不多')}</span></button>
        <button type="button" class="rbtn good" data-r="ok">😀<span>${T('Knew it', '会了')}</span></button></div>`;
      wrap.querySelectorAll('.rbtn').forEach(b => b.onclick = rate(b.dataset.r));
      if(V.prefs.auto && w.type === 'w' && w.ex) V.say(w.ex);
    };
    st.flipped = false;
  }
  const posLine = w => w.type === 'w' ? `<div class="vq-pos">${T(V.POS[w.pos].en, V.POS[w.pos].zh)}</div>` : '';

  /* ---- introduksjon av nye ord ---- */
  function renderIntro(q, ans){
    $('#vqCard .vq-body').innerHTML = V.detailHtml(q.item);
    ans.append(h('div', {class:'row', html:`<button type="button" class="btn big" id="vqNextI"><span class="bi"><span class="no">Got it ▶</span><span class="zh">明白了 ▶</span></span></button>`}));
    ans.querySelector('#vqNextI').onclick = () => { V.srs.touch(q.item.id); V.saveSummary(); next(); };
    st.locked = false;
  }

  /* ---- svar og tilbakemelding ---- */
  function answered(res, info){
    if(st.locked) return; st.locked = true; info = info || {};
    const q = st.cur;
    if(q.usedHint && res === 'ok'){ res = 'almost'; info.why = 'hint'; }
    // lagre i repetisjonssystemet (ikke for ekstra forsøk)
    if(!q.retry){
      if(q.mode === 'match') q.items.forEach(it => { const r = info.items ? info.items[it.id] : res; V.srs.rec(it.id, r, q.cap); V.daily.log(r); });
      else { V.srs.rec(q.item.id + (q.facet || ''), res, q.cap); V.daily.log(res); }
      V.saveSummary();
    }
    st[res]++;
    if(res === 'ok'){ st.streak++; st.best = Math.max(st.best, st.streak); } else st.streak = 0;
    if(res !== 'ok' && !q.retry){
      (q.mode === 'match' ? q.items.filter(it => info.items && info.items[it.id] !== 'ok') : [q.item]).forEach(it => { if(!st.missed.includes(it)) st.missed.push(it); st.retry.push({item:it, at:st.n}); });
    }
    bar();
    feedback(q, res, info);
    if(q.after && V.prefs.auto && q.mode !== 'rec') V.say(q.after);
  }
  function feedback(q, res, info){
    const fb = $('#vqFb'), cls = res === 'ok' ? 'good' : res === 'almost' ? 'mid' : 'bad', em = res === 'ok' ? '✅' : res === 'almost' ? '🟡' : '❌';
    let msg;
    if(res === 'ok'){ const p = PRAISE[Math.floor(Math.random() * PRAISE.length)]; msg = T(p[0], p[1]) + (info.why && WHY[info.why] ? `<div class="vq-why">${T(WHY[info.why][0], WHY[info.why][1])}</div>` : ''); }
    else if(res === 'almost'){ const w = info.why === 'custom' && q.almostMsg ? [q.almostMsg.en, q.almostMsg.zh] : (WHY[info.why] || ['Almost!', '差一点！']); msg = T(w[0], w[1]) + `<div class="vq-aw-wrap">${q.answerHtml || ''}</div>`; }
    else msg = (info.skipped ? T('Here is the answer:', '答案是：') : T('Not quite. The answer is:', '不太对。答案是：')) + `<div class="vq-aw-wrap">${q.answerHtml || ''}</div>`;
    const item = q.item;
    const body = cfg.fast ? '' : (q.mode === 'match'
      ? `<div class="vq-learn">${q.items.map(it => `<div class="vq-pair"><b>${V.dispHtml(it)}</b>${V.spkItem(it, {noSlow:true})} — ${V.meanHtml(it)}</div>`).join('')}</div>`
      : `<div class="vq-learn"><div class="vc-top"><span class="vd-nb">${item.type === 'p' ? esc(item.nb) : V.dispHtml(item)}</span>${V.spkItem(item)}</div><div class="vd-mean">${V.meanHtml(item)}</div>${item.type === 'w' && item.ex ? V.exampleHtml(item) : ''}
         ${(item.type === 'w' && (V.formRows(item).length || item.note)) || (item.type === 'p' && item.note) ? `<details class="vq-more"><summary>${T('More: forms and notes', '更多：词形和说明')}</summary>${V.detailHtml(item, {only:'extra'})}</details>` : ''}</div>`);
    fb.innerHTML = `<div class="fbar ${cls}"><span class="em">${em}</span><div class="msg">${msg}</div><button type="button" class="btn" id="vqNext"><span class="bi"><span class="no">Next ▶</span><span class="zh">下一个 ▶</span></span></button></div>${body}`;
    $('#vqNext').onclick = nextBtn; $('#vqNext').focus({preventScroll:true});
    if(cfg.fast) st.auto = setTimeout(nextBtn, res === 'ok' ? 700 : 1800);
    else $('#vqNext').scrollIntoView({block:'nearest', behavior:'smooth'});
  }
  function nextBtn(){ if(st.done) return; clearTimeout(st.auto); next(); }

  /* ---- slutt ---- */
  function end(){
    if(st.done) return; st.done = true; clearInterval(st.timer); clearTimeout(st.auto); A.Speech.stop();
    const total = st.ok + st.almost + st.bad, pct = total ? Math.round(100 * st.ok / total) : 0, secs = Math.round((Date.now() - st.t0) / 1000);
    const missed = st.missed;
    $('#vqFb').innerHTML = '';
    $('#vqProg').style.width = '100%';
    $('#vqCard').innerHTML = `<div class="end vq-end"><div class="big-emoji">${pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : '💪'}</div>
      <h2>${total ? T('Well done!', '做得好！') : T('Finished', '完成')}</h2>
      ${total ? `<div class="sumrow"><div><b>${st.ok}/${total}</b><span>${T('correct first time', '一次答对')}</span></div><div><b>${pct}%</b><span>${T('accuracy', '正确率')}</span></div><div><b>${st.best}</b><span>${T('best streak', '最长连对')}</span></div><div><b>${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}</b><span>${T('time', '用时')}</span></div></div>` : ''}
      ${missed.length ? `<h3>${T('To review', '需要复习')}</h3><div class="vq-missed">${missed.slice(0, 12).map(it => `<div class="vq-pair"><b>${it.type === 'p' ? esc(it.nb) : V.dispHtml(it)}</b>${V.spkItem(it, {noSlow:true})} — ${V.meanHtml(it)}</div>`).join('')}${missed.length > 12 ? `<div class="small-note">+${missed.length - 12}</div>` : ''}</div>` : (total ? `<p>${T('No mistakes. Perfect!', '没有错误，太棒了！')}</p>` : '')}
      <div class="row" style="margin-top:14px">
        ${cfg.learn ? (cfg.learn.more ? `<button type="button" class="btn big" id="vqMore"><span class="bi"><span class="no">▶ ${esc(cfg.learn.label.en)}</span><span class="zh">${esc(cfg.learn.label.zh)}</span></span></button>` : '') : `<button type="button" class="btn big" id="vqAgain"><span class="bi"><span class="no">▶ Another round</span><span class="zh">再来一轮</span></span></button>`}
        ${missed.length ? `<button type="button" class="btn sec" id="vqPrac"><span class="bi"><span class="no">🎯 Practise the mistakes</span><span class="zh">练习错题</span></span></button>` : ''}
        <button type="button" class="btn sec" id="vqDone"><span class="bi"><span class="no">✔ Back</span><span class="zh">返回</span></span></button></div></div>`;
    const g = id => $('#' + id);
    if(g('vqAgain')) g('vqAgain').onclick = () => hooks.onAgain && hooks.onAgain(st);
    if(g('vqMore')) g('vqMore').onclick = () => cfg.learn.more();
    if(g('vqPrac')) g('vqPrac').onclick = () => hooks.onPractice && hooks.onPractice(missed.map(m => m.id), st);
    g('vqDone').onclick = () => { Q.stop(); if(hooks.onExit) hooks.onExit(st); };
    V.saveSummary();
  }

  /* ---- tastatur ---- */
  st.onKey = function(e){
    if(!Q.active || Q.active !== st || e.ctrlKey || e.metaKey || e.altKey) return;
    const tag = (e.target.tagName || '').toLowerCase(), typing = tag === 'input' || tag === 'textarea';
    const q = st.cur; if(!q) return;
    if(e.key === 'Enter'){
      if(st.done || tag === 'button') return;
      if(st.locked){ e.preventDefault(); nextBtn(); }
      else if(q.kind === 'intro'){ e.preventDefault(); const b = $('#vqNextI'); if(b) b.click(); }
      else if(q.kind === 'card' && !st.flipped){ e.preventDefault(); const b = $('#vfShow'); if(b) b.click(); }
      return;
    }
    if(typing || st.done) return;
    if(/^[1-9]$/.test(e.key)){
      if(q.kind === 'choice' && !st.locked){ const o = $$('#vqAns .opt')[+e.key - 1]; if(o){ e.preventDefault(); o.click(); } }
      else if(q.kind === 'card' && st.flipped && !st.locked){ const r = ({1:'bad', 2:'almost', 3:'ok'})[e.key]; const b = r && $('.rbtn[data-r="' + r + '"]'); if(b) b.click(); }
    } else if(e.key === ' ' && q.item){ e.preventDefault(); if(q.kind === 'card' && !st.flipped){ const b = $('#vfShow'); if(b) b.click(); } else if(q.speakOnShow) V.say(q.speakOnShow, {force:true}); }
  };
  const $$ = s => root.querySelectorAll(s);
  document.addEventListener('keydown', st.onKey, true);
  next();
};

/* ---------- dagens økt: først repetisjon av det som er forfalt, så nye ord (introduksjon + oppgaver) ---------- */
function freshSteps(fresh, ctx){
  const steps = [];
  fresh.forEach(it => steps.push(() => B.intro(it)));
  shuffle(fresh).forEach(it => steps.push(() => it.type === 'w' ? B.rec(it, ctx) : B.psay(it, ctx)));
  const hear = V.prefs.speak && A.Speech.supported;
  shuffle(fresh).forEach(it => steps.push(() => it.type === 'w' ? (hear ? B.lmean(it, ctx) : B.rev(it, ctx, 'choice')) : (hear ? B.phear(it, ctx) : B.psay(it, ctx))));
  return steps;
}
Q.daily = function(root, plan, hooks, base){
  const items = ids => ids.map(V.item).filter(Boolean);
  const due = items(plan.due.slice(0, 20)), fresh = items(plan.fresh.slice(0, 6));
  if(!due.length && !fresh.length) return false;
  const ids = A.uniq([...plan.due, ...plan.fresh, ...(plan.wide || [])]), ctx = {pool:items(ids)};
  const cfg = Object.assign({}, base, {ids, auto:true, smart:true});
  const steps = due.map(it => () => B.make(it, cfg, ctx));
  steps.push(...freshSteps(fresh, ctx));
  Q.run(root, Object.assign({}, cfg, {steps, count:steps.length, title:{en:"Today's session", zh:'今日练习'}}), hooks);
  return true;
};

/* ---------- nye ord: introduksjon + oppgaver ---------- */
Q.learnBatch = function(root, specs, hooks, size){
  const ids = V.resolveAll(specs).filter(id => V.srs.box(id) === 0);
  if(!ids.length) return false;
  size = size || 5;
  const batch = ids.slice(0, size).map(V.item), pool = V.resolveAll(specs).map(V.item).filter(Boolean), ctx = {pool};
  const steps = freshSteps(batch, ctx);
  const more = ids.length - batch.length;
  Q.run(root, {title:{en:'Learn new words', zh:'学习新词'}, ids:batch.map(i => i.id), steps, learn:{more:more > 0 ? () => Q.learnBatch(root, specs, hooks, size) : null, label:{en:`Learn ${Math.min(size, more)} more (${more} left)`, zh:`再学 ${Math.min(size, more)} 个（还剩 ${more} 个）`}},
    count:steps.length, input:'choice', modes:[], auto:false}, hooks);
  return true;
};
})();
