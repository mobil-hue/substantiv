(function(){
'use strict';
/* Tallsvar-oppgaver (flervalg eller skriv inn etter innstillingen), og trinn-for-trinn-oppgaver.
   kind 'num'  : ett tall som svar. Vises som flervalg eller tastatur etter A.prefs.input.
   kind 'steps': flere delsvar, ett om gangen, med tavle som fylles ut.
   kind 'calc' : som 'steps', men eleven kan velge «trinn for trinn» av/på (A.prefs.guide). */
const A = window.App, Ex = A.Ex, {bi, shuffle, uniq} = A;
const fmt = Ex.fmtNum, Q = Ex.Q;

/* troverdige gale svar rundt et tall */
Ex.numOptions = function(ans, o){
  o = o || {};
  const min = o.min == null ? 0 : o.min, want = o.count || 4, out = [ans], seen = new Set([ans]);
  const add = v => { if(out.length < want && Number.isFinite(v) && v >= min && !seen.has(v)){ seen.add(v); out.push(v); } };
  shuffle(o.near || []).forEach(add);
  const gen = Math.abs(ans) >= 100
    ? [ans + 10, ans - 10, ans + 100, ans - 100, ans + 20, ans - 20, ans + 1, ans - 1, ans + 2, ans - 2]
    : [ans + 1, ans - 1, ans + 2, ans - 2, ans + 10, ans - 10, ans + 3, ans - 3, ans + 5, ans - 5];
  shuffle(gen.slice(0, 6)).concat(gen.slice(6)).forEach(add);
  for(let g = 1; out.length < want; g++) add(ans + 10 + g);
  return shuffle(out);
};
const numHtml = (v, unit) => `<span style="font-size:1.7rem">${fmt(v)}${unit || ''}</span>`;
const toChoice = spec => Object.assign({}, spec, {
  options:Ex.numOptions(spec.answer, {near:spec.near, min:spec.min}).map(v => ({html:numHtml(v, spec.unit), value:String(v)})),
  answer:String(spec.answer), layout:spec.layout || 'row'});
const toType = spec => Object.assign({}, spec, {answers:[String(spec.answer)], numeric:true, ph:spec.ph || '?'});
const head = Ex.head;
const speakQ = (q, say) => Ex.speakSpec({say:say || q});

/* flervalg der eleven får et nytt forsøk (med hjelp) etter første feil */
function renderChoiceRetry(spec, host, ctx){
  host.innerHTML = `<div class="qcard">${head(spec)}<div class="visual">${spec.visual || ''}</div><div class="opts ${spec.layout || 'row'}"></div><div class="hint"></div></div>`;
  host.querySelector('.say').onclick = () => Ex.speakSpec(spec);
  const box = host.querySelector('.opts'), hintEl = host.querySelector('.hint'), btns = []; let tries = 0, done = false;
  spec.options.forEach(o => {
    const b = A.h('button', {class:'opt', type:'button', html:o.html});
    b.onclick = () => {
      if(done || b.disabled) return;
      if(o.value === spec.answer){
        done = true; b.classList.add('ok'); btns.forEach(x => x.classList.add('lock'));
        ctx.result({score:tries ? .5 : 1, ok:tries === 0, retryOk:tries > 0, fb:spec.fb, say:spec.sayAfter}); return;
      }
      tries++; b.classList.add('bad'); b.disabled = true;
      if(tries === 1){
        hintEl.innerHTML = `💡 ${bi('Ikke helt! Se på hjelpen og prøv en gang til.', '不太对！看看提示，再试一次。')}` + (spec.hintHtml ? `<div style="margin-top:6px">${spec.hintHtml}</div>` : '');
        if(spec.sayHint) A.sayBi(spec.sayHint.no, spec.sayHint.zh);
      } else {
        done = true; btns.forEach((x, i) => { if(spec.options[i].value === spec.answer) x.classList.add('ok'); x.classList.add('lock'); });
        ctx.result({score:0, ok:false, fb:spec.fb, say:spec.sayAfter});
      }
    };
    btns.push(b); box.append(b);
  });
  if(A.settings.auto && !Ex.silent) Ex.speakSpec(spec);
}

/* kind 'num' */
function renderNum(spec, host, ctx, mode){
  mode = mode || Ex.inputMode();
  if(mode === 'type') return Ex.renderers.type(toType(spec), host, ctx);
  const cs = toChoice(spec);
  return spec.retry ? renderChoiceRetry(cs, host, ctx) : Ex.renderers.choice(cs, host, ctx);
}

/* kind 'steps' */
function renderSteps(spec, host, ctx){
  const steps = spec.steps, n = steps.length;
  let k = 0, first = 0, second = 0, failed = 0, finished = false;
  host.innerHTML = `<div class="qcard">${head(spec)}<div class="board visual">${spec.board0 || ''}</div><div class="wslines"></div><div class="stepbox"></div></div>`;
  host.querySelector('.say').onclick = () => Ex.speakSpec(spec);
  const boardEl = host.querySelector('.board'), linesEl = host.querySelector('.wslines'), boxEl = host.querySelector('.stepbox');
  const addLine = (st, good) => {
    if(st.line) linesEl.append(A.h('div', {class:'wsl ' + (good ? 'ok' : 'bad'), html:`<span class="ck">${good ? '✅' : '➡️'}</span><span>${st.line}</span>`}));
    if(st.board) boardEl.innerHTML = st.board;
  };
  function finish(){
    finished = true;
    const score = (first + .5 * second) / n;
    boxEl.innerHTML = '';
    ctx.result({score, ok:score >= .8, fb:spec.fb, say:spec.sayAfter});
  }
  function next(){ k++; if(k >= n) finish(); else showStep(); }
  function showStep(){
    const st = steps[k]; let tries = 0, done = false;
    const lockInput = () => { const i = boxEl.querySelector('input'); if(i) i.dataset.done = '1'; };
    boxEl.innerHTML = `<div class="stepask"><span class="sn">${k + 1}/${n}</span><div class="grow">${bi(st.ask.no, st.ask.zh)}</div><button class="spk sspk" type="button" title="Les opp / 朗读">🔊</button></div>
      <div class="stepin"></div><div class="hint"></div><div class="stepnext"></div>`;
    const inEl = boxEl.querySelector('.stepin'), hintEl = boxEl.querySelector('.hint'), nextEl = boxEl.querySelector('.stepnext');
    boxEl.querySelector('.sspk').onclick = () => Ex.speakSpec({say:st.say || st.ask});
    const hintText = () => st.hint ? `<div style="margin-top:4px">${bi(st.hint.no, st.hint.zh)}</div>` : '';
    const good = () => { done = true; lockInput(); tries ? second++ : first++; addLine(st, true); inEl.innerHTML = ''; hintEl.innerHTML = '✅'; setTimeout(() => { if(host.contains(boxEl)) next(); }, 650); };
    const bad = shown => {
      done = true; lockInput(); failed++; addLine(st, false);
      hintEl.innerHTML = `🔴 ${bi('Det riktige svaret er', '正确答案是')} <b>${shown}</b>.${st.explain ? `<div style="margin-top:4px">${bi(st.explain.no, st.explain.zh)}</div>` : ''}`;
      nextEl.innerHTML = `<button class="btn sec nxt" type="button"><span class="bi"><span class="no">Neste steg ➜</span><span class="zh">下一步</span></span></button>`;
      nextEl.querySelector('.nxt').onclick = next;
    };
    const wrong = shown => { tries++;
      if(tries === 1){ hintEl.innerHTML = `💡 ${bi('Ikke helt. Prøv en gang til.', '不太对。再试一次。')}${hintText()}`; return false; }
      bad(shown); return true; };
    const mode = st.choices ? 'choice' : (st.typeOnly ? 'type' : Ex.inputMode());
    if(mode === 'choice'){
      const opts = st.choices || Ex.numOptions(st.answer, {near:st.near, min:st.min}).map(v => ({html:numHtml(v), value:String(v)}));
      const ans = String(st.answer), btns = [];
      inEl.innerHTML = `<div class="opts ${st.layout || 'row'}"></div>`;
      const box = inEl.querySelector('.opts');
      opts.forEach(o => { const b = A.h('button', {class:'opt', type:'button', html:o.html});
        b.onclick = () => { if(done || b.disabled) return;
          if(String(o.value) === ans){ b.classList.add('ok'); btns.forEach(x => x.classList.add('lock')); good(); return; }
          b.classList.add('bad'); b.disabled = true;
          if(wrong(st.show || ans)){ btns.forEach((x, i) => { if(String(opts[i].value) === ans) x.classList.add('ok'); x.classList.add('lock'); }); } };
        btns.push(b); box.append(b); });
    } else {
      inEl.innerHTML = `<div class="typebox"><input class="ans num" type="text" inputmode="numeric" pattern="[0-9]*" readonly autocomplete="off" placeholder="${st.ph || '?'}"><button class="btn check" type="button"><span class="bi"><span class="no">Sjekk ✔</span><span class="zh">检查</span></span></button></div><div class="keys-host"></div>`;
      const inp = inEl.querySelector('input');
      const doCheck = () => { if(done) return; const v = Ex.normNum(inp.value); if(!v) return;
        if(v === Ex.normNum(String(st.answer))){ inp.classList.add('ok'); good(); return; }
        inp.classList.remove('shake'); void inp.offsetWidth; inp.classList.add('shake'); inp.classList.add('bad');
        if(wrong(st.show || fmt(st.answer))){ inp.value = String(st.answer); } };
      inEl.querySelector('.check').onclick = doCheck;
      inEl.querySelector('.keys-host').append(Ex.keypad(() => inp, doCheck));
      inp.addEventListener('input', () => inp.classList.remove('bad'));
      const onKey = e => { if(!document.body.contains(inp)){ document.removeEventListener('keydown', onKey); return; }
        if(done || e.ctrlKey || e.metaKey) return;
        if(/^\d$/.test(e.key)){ if(inp.value.length < 7) inp.value += e.key; inp.classList.remove('bad'); }
        else if(e.key === 'Backspace') inp.value = inp.value.slice(0, -1);
        else if(e.key === 'Enter'){ e.preventDefault(); doCheck(); } };
      document.addEventListener('keydown', onKey);
    }
    if(A.settings.auto && !Ex.silent){
      const q = st.say || st.ask;
      Ex.speakSpec({say:k === 0 && spec.say ? {no:spec.say.no + ' ' + q.no, zh:spec.say.zh + ' ' + q.zh} : q});
    }
  }
  if(!n){ finish(); return; }
  showStep();
}

/* kind 'calc': velg trinn for trinn (på) eller bare svaret (av) */
function renderCalc(spec, host, ctx){
  let resolved = false;
  const wrap = {result:r => { resolved = true; const t = host.querySelector('.gtoggle'); if(t) t.remove(); ctx.result(r); }};
  const draw = silent => {
    Ex.silent = !!silent;
    const guided = A.prefs.guide && !spec.noGuide;
    try{
      if(guided) renderSteps(Object.assign({}, spec, {q:null}), host, wrap);
      else {
        const free = Object.assign({}, spec, {say:spec.qsay || spec.say, visual:spec.visual || spec.board0 || '', retry:true,
          hintHtml:`<div>${bi('Tips: trykk «Trinn for trinn» for å få hjelp.', '提示：点“一步一步”可以得到帮助。')}</div>`});
        renderNum(free, host, wrap);
      }
    } finally { Ex.silent = false; }
    if(spec.noGuide) return;
    const card = host.querySelector('.qcard'), t = A.h('button', {class:'pill gtoggle' + (guided ? ' on' : ''), type:'button',
      html:`🪜 <span class="no">${guided ? 'Trinn for trinn: på' : 'Trinn for trinn: av'}</span><span class="zh">${guided ? ' 一步一步：开' : ' 一步一步：关'}</span>`});
    t.onclick = () => { if(resolved) return; A.prefs.guide = !A.prefs.guide; A.savePrefs(); A.Speech.stop(); draw(true); };
    card.insertBefore(t, card.querySelector('.visual') || card.firstChild.nextSibling);
  };
  draw(false);
}

Ex.renderers.num = renderNum;
Ex.renderers.steps = renderSteps;
Ex.renderers.calc = renderCalc;
})();
