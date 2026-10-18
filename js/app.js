(function(){
'use strict';
const A = window.App;
const {h, bi, shuffle, pick} = A;
const app = document.getElementById('app');
const SUBJ = A.subject;
const CFG = {
  noun:{MODS:A.MODULES, ROOMS:A.ROOM, TERMS:A.TERMS, PKEY:'progress', TKEY:'termKnow'},
  geo:{MODS:A.GEO_MODULES, ROOMS:A.GEO_ROOM, TERMS:A.GEO_TERMS, PKEY:'progress_geo', TKEY:'termKnow_geo'},
  mult:{MODS:A.MULT_MODULES, ROOMS:A.MULT_ROOM, TERMS:A.MULT_TERMS, PKEY:'progress_mult', TKEY:'termKnow_mult'}
}[SUBJ];
const MODS = CFG.MODS, ROOMS = CFG.ROOMS, TERMS = CFG.TERMS, PKEY = CFG.PKEY, TKEY = CFG.TKEY;
const termOf = k => TERMS.find(t => t.key === k);
A.progress = A.store.get(PKEY, {});
const termKnow = A.store.get(TKEY, {});
const lnk = (href, no, zh, blank) => `<a class="btn sec" href="${href}"${blank ? ' target="_blank"' : ''} style="text-decoration:none"><span class="bi"><span class="no">${no}</span><span class="zh">${zh}</span></span></a>`;
const INFO = {
  noun:{emoji:'📘', no:'Lær substantiv!', zh:'学习名词！', sub:['Litt hver dag. Se, hør, skriv og øv!', '每天一点点。看、听、写、练！'], home:'substantiv', cls:'', test:['Hei! Dette er substantiv. En hund, ei jente, et hus.', '你好！我们来学习名词。'],
    links:lnk('ark.html', '📝 Skriveark (skriv ut)', '练习纸（打印）') + lnk('docs/substantiv-jukselapp.pdf', '🧾 Jukselapp (PDF)', '速查表（PDF）', true) + lnk('docs/substantiv-boyingstabell.pdf', '📊 Bøyingstabell (PDF)', '变形表（PDF）', true) + lnk('teacher.html', '👩‍🏫 Lærer / fasit', '教师页 / 答案') + lnk('index.html', '🏠 Meny', '主菜单')},
  geo:{emoji:'📐', no:'Lær geometri!', zh:'学习几何！', sub:['Se figurer, tegn, tell og øv!', '看图形、画一画、数一数、多练习！'], home:'figur', cls:'', test:['Hei! Dette er geometri. En trekant, en kube, en rett vinkel.', '你好！我们来学习几何。'],
    links:lnk('geo-ark.html', '📝 Skriveark (skriv ut)', '练习纸（打印）') + lnk('docs/geometri-jukselapp.pdf', '🧾 Jukselapp (PDF)', '速查表（PDF）', true) + lnk('geometri-laerer.html', '👩‍🏫 Lærer / fasit', '教师页 / 答案') + lnk('index.html', '🏠 Meny', '主菜单')},
  mult:{emoji:'✖️', no:'Lær å gange!', zh:'学习乘法！', sub:['Lær knepene, regn trinn for trinn og øv mye!', '学会小窍门，一步一步地算，多多练习！'], home:'gange', cls:'', test:['Hei! Dette er gange. Tre ganger fire er tolv.', '你好！我们来学习乘法。三乘以四等于十二。'],
    hub:`<div class="card drillcard"><div class="grow"><h2 style="margin:0">🏋️ ${bi('Mengdetrening','大量练习')}</h2><div>${bi('Øv og øv! Velg tall, tekst eller tale, og flervalg eller skriv inn.','练了又练！选择数字、文字或语音，选择题或输入答案。')}</div></div>
      <div class="row"><a class="btn big" href="#/drill" style="text-decoration:none"><span class="bi"><span class="no">▶ Start</span><span class="zh">开始</span></span></a><a class="btn sec" href="#/stats" style="text-decoration:none"><span class="bi"><span class="no">📊 Statistikk</span><span class="zh">统计</span></span></a></div></div>`,
    links:lnk('mult-ark.html', '📝 Skriveark (skriv ut)', '练习纸（打印）') + lnk('multiplikasjon-laerer.html', '👩‍🏫 Lærer / fasit', '教师页 / 答案') + lnk('docs/gange-jukselapp.pdf', '🧾 Jukselapp (PDF)', '速查表（PDF）', true) + lnk('index.html', '🏠 Meny', '主菜单')}
}[SUBJ];

const key = (m, i) => `m${m}s${i}`;
const star = n => '⭐'.repeat(n) + '☆'.repeat(3 - n);
const ICON = {video:'🎬', terms:'🃏', practice:'✏️', task:'🧩', loop:'🔁'};
const modStars = m => MODS[m].steps.reduce((s, st, i) => s + ((A.progress[key(m, i)] || {}).stars || 0), 0);
const modDone = m => MODS[m].steps.filter((st, i) => (A.progress[key(m, i)] || {}).done).length;
function nextStep(){
  for(const m of MODS) for(let i = 0; i < m.steps.length; i++) if(!(A.progress[key(m.id, i)] || {}).done) return {m:m.id, i};
  return null;
}
// sammendrag til rotmenyen
function saveSummary(){
  const total = MODS.reduce((s, m) => s + m.steps.length, 0), done = MODS.reduce((s, m) => s + modDone(m.id), 0);
  A.store.set('sum_' + A.subject, {done, total});
}
function markDone(m, i, stars){
  const k = key(m, i), p = A.progress[k] || {};
  A.progress[k] = {done:true, stars:Math.max(p.stars || 0, stars || 0)};
  A.store.set(PKEY, A.progress); saveSummary();
}
function leave(){ A.Video.stop(); A.Speech.stop(); if(A._cleanup){ A._cleanup(); A._cleanup = null; } }
function render(node){ leave(); app.innerHTML = ''; app.append(node); window.scrollTo(0, 0); }

/* ---------- toppknapper ---------- */
const LANGS = [['both', '🌐 NO + 中文'], ['no', '🇳🇴 Norsk'], ['zh', '🇨🇳 中文']];
const SPEAKS = [{k:'no', a:true, t:'🔊 Norsk'}, {k:'zh', a:true, t:'🔊 中文'}, {k:'both', a:true, t:'🔊 Norsk + 中文'}, {k:null, a:false, t:'🔇 Av'}];
const curSpeak = () => A.settings.auto ? Math.max(0, SPEAKS.findIndex(x => x.k === A.settings.speak)) : 3;
function syncPills(){
  document.getElementById('pLang').textContent = LANGS.find(l => l[0] === A.settings.lang)[1];
  const s = document.getElementById('pSound'); s.textContent = SPEAKS[curSpeak()].t; s.classList.toggle('on', A.settings.auto);
  document.querySelectorAll('.optgrp').forEach(g => g.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.k === (g.dataset.g === 'speak' ? A.speakKey() : A.settings.lang))));
}
A.onSettings = syncPills;
document.getElementById('pLang').onclick = () => { const i = LANGS.findIndex(l => l[0] === A.settings.lang); A.settings.lang = LANGS[(i + 1) % 3][0]; A.saveSettings(); syncPills(); };
document.getElementById('pSound').onclick = () => {
  const n = SPEAKS[(curSpeak() + 1) % SPEAKS.length];
  if(n.a){ A.settings.auto = true; A.settings.speak = n.k; } else { A.settings.auto = false; A.Speech.stop(); }
  A.saveSettings(); syncPills();
  if(n.a) A.sayBi('Norsk opplesing', '中文朗读');
};
document.getElementById('logo').onclick = () => { location.hash = '#/'; route(); };
// svarmåte (flervalg / skriv inn / tilfeldig) gjelder matematikk-fagene
const INPUTS = [['choice', '✅ Flervalg', '选择题'], ['type', '⌨️ Skriv inn', '输入答案'], ['mix', '🎲 Tilfeldig', '随机']];
if(A.subject !== 'noun'){
  const pIn = h('button', {class:'pill', id:'pInput', title:'Svarmåte / 答题方式'});
  document.getElementById('pLang').before(pIn);
  const syncIn = () => { const t = INPUTS.find(x => x[0] === A.prefs.input)[1], sp = t.indexOf(' '); pIn.innerHTML = t.slice(0, sp) + '<span class="pt">' + t.slice(sp) + '</span>'; };
  pIn.onclick = () => { const i = INPUTS.findIndex(x => x[0] === A.prefs.input); A.prefs.input = INPUTS[(i + 1) % INPUTS.length][0]; A.savePrefs(); syncIn(); };
  A.syncInput = syncIn; syncIn();
}

/* ---------- hjem ---------- */
function home(){
  const nx = nextStep(), root = h('div');
  const term = Math.random() < 0.4 ? termOf(INFO.home) : pick(TERMS.filter(t => t.mod <= 6));
  const total = MODS.reduce((s, m) => s + m.steps.length, 0), done = MODS.reduce((s, m) => s + modDone(m.id), 0);
  root.innerHTML = `<div class="hero"><div class="big-emoji">${INFO.emoji}</div><div class="grow"><h1>${bi(INFO.no, INFO.zh)}</h1>
      <div>${bi(INFO.sub[0], INFO.sub[1])}</div>
      <div class="mbar" style="background:rgba(255,255,255,.35)"><i style="width:${Math.round(done / total * 100)}%;background:#fff"></i></div></div>
      <button class="btn big sec" id="goNext"><span class="bi"><span class="no">${nx ? (done ? '▶ Fortsett' : '▶ Start her') : '🏆 Øv mer'}</span><span class="zh">${nx ? (done ? '继续' : '从这里开始') : '多练习'}</span></span></button></div>
    <div class="today"><span class="bigword" style="font-size:2rem">🃏</span><div class="grow" style="flex:1"><div style="font-weight:800;color:var(--muted)">${bi('Dagens begrep','今日概念')}</div>
      <div class="term-big">${term.no} <span class="zh" style="font-size:1.1rem;color:var(--ink)">${A.ruby(term.zh, term.py)}</span></div><div>${bi(term.defNo, term.defZh)}</div>${term.art ? `<div class="termart sm" style="margin-top:6px">${term.art}</div>` : ''}</div>
      <button class="spk" id="tspk">🔊</button></div>
    ${INFO.hub || ''}
    <h2>${bi('Moduler','课程')}</h2><div class="grid" id="mods"></div>
    <div class="links"><button class="btn sec" id="lT"><span class="bi"><span class="no">🃏 Begreper</span><span class="zh">概念卡片</span></span></button>
      <button class="btn sec" id="lP"><span class="bi"><span class="no">🏋️ Øvingsrom</span><span class="zh">练习室</span></span></button>
      <button class="btn sec" id="lS"><span class="bi"><span class="no">⚙️ Innstillinger</span><span class="zh">设置</span></span></button>
      ${INFO.links}</div>`;
  const mods = root.querySelector('#mods');
  MODS.forEach(m => {
    const d = modDone(m.id), n = m.steps.length;
    mods.append(h('div', {class:'mod', style:`--c:${m.color}`, onclick:() => { location.hash = '#/m/' + m.id; }, html:
      `<div class="em">${m.emoji}</div><h3>${m.id}. ${bi(m.no, m.zh)}</h3><div class="stars">${star(Math.min(3, Math.round(modStars(m.id) / (n * 3) * 3 + (d === n ? 0.49 : 0))))}</div><div class="small-note" style="text-align:left">${d}/${n}</div><div class="mbar"><i style="width:${d / n * 100}%"></i></div>`}));
  });
  root.querySelector('#goNext').onclick = () => nx ? runStep(nx.m, nx.i) : (location.hash = '#/practice');
  root.querySelector('#tspk').onclick = () => A.sayTerm(term);
  root.querySelector('#lT').onclick = () => { location.hash = '#/terms'; };
  root.querySelector('#lP').onclick = () => { location.hash = '#/practice'; };
  root.querySelector('#lS').onclick = () => { location.hash = '#/settings'; };
  render(root);
}

function moduleView(id){
  const m = MODS[id], nx = nextStep(), root = h('div');
  root.innerHTML = `<div class="crumb" id="back">← ${bi('Alle moduler','所有课程')}</div><h1 style="color:${m.color}">${m.emoji} ${m.id}. ${bi(m.no, m.zh)}</h1><div class="steps"></div>`;
  const box = root.querySelector('.steps');
  m.steps.forEach((s, i) => {
    const p = A.progress[key(id, i)] || {}, isNext = nx && nx.m === id && nx.i === i;
    box.append(h('div', {class:'step' + (p.done ? ' done' : '') + (isNext ? ' next' : ''), onclick:() => runStep(id, i), html:
      `<div class="ico">${ICON[s.t]}</div><div class="tx"><b>${i + 1}.</b> ${bi(s.no, s.zh)}</div><div class="st">${p.done ? (s.t === 'video' || s.t === 'terms' ? '✅' : star(p.stars || 1)) : (isNext ? '👉' : '')}</div>`}));
  });
  root.querySelector('#back').onclick = () => { location.hash = '#/'; };
  render(root);
}

/* ---------- begreper (flashcards) ---------- */
function termsView(keys, onDone, titleHtml){
  let list = keys ? keys.map(termOf) : TERMS.slice().sort((a, b) => ((termKnow[b.key] || {m:0}).m - (termKnow[a.key] || {m:0}).m) + (Math.random() - .5));
  list = list.slice(); let idx = 0, flipped = false;
  const root = h('div', {class:'session'});
  function draw(){
    const t = list[idx]; flipped = false;
    root.innerHTML = `<div class="sbar"><button class="x" id="x">✖</button><div class="stitle">${titleHtml || bi('Begreper','概念卡片')}</div><div class="prog"><i style="width:${idx / list.length * 100}%"></i></div></div>
      <div class="fc" style="--c:${t.color}" id="fc"><div class="term">${t.no}</div>${t.art ? `<div class="termart">${t.art}</div>` : ''}<button class="spk" id="sp">🔊</button>
      <div class="small-note">${bi('Trykk på kortet for å snu','点卡片翻面')}</div></div>
      <div class="typebox" style="margin-top:14px"><span class="small-note">${idx + 1} / ${list.length}</span></div>`;
    root.querySelector('#x').onclick = () => { location.hash = '#/'; };
    const fc = root.querySelector('#fc');
    root.querySelector('#sp').onclick = e => { e.stopPropagation(); A.sayNo(t.no); };
    fc.onclick = () => {
      if(flipped) return; flipped = true;
      fc.innerHTML = `<div class="term">${t.no}</div><div class="zhsup zh">${A.ruby(t.zh, t.py)}</div>${t.art ? `<div class="termart sm">${t.art}</div>` : ''}<div class="def">${bi(t.defNo, t.defZh)}</div><div class="ex">${t.ex}</div>
        <button class="spk" id="sp2">🔊</button>
        <div class="typebox"><button class="btn sec" id="more"><span class="bi"><span class="no">🔁 Øv mer</span><span class="zh">再练练</span></span></button>
        <button class="btn" id="know"><span class="bi"><span class="no">✔ Jeg kan det</span><span class="zh">我会了</span></span></button></div>`;
      fc.querySelector('#sp2').onclick = e => { e.stopPropagation(); A.sayTerm(t); };
      const rec = ok => { const k = termKnow[t.key] || (termKnow[t.key] = {k:0, m:0}); ok ? k.k++ : k.m++; A.store.set(TKEY, termKnow); };
      fc.querySelector('#know').onclick = e => { e.stopPropagation(); rec(true); next(); };
      fc.querySelector('#more').onclick = e => { e.stopPropagation(); rec(false); list.push(t); next(); };
      A.sayTerm(t);
    };
    if(A.settings.auto) A.sayNo(t.no);
  }
  function next(){
    idx++;
    if(idx >= list.length || idx > 40){
      root.innerHTML = `<div class="end"><div class="big-emoji">🃏</div><h2>${bi('Bra jobba med begrepene!','概念学得不错！')}</h2><button class="btn big" id="ok"><span class="bi"><span class="no">Fortsett ➜</span><span class="zh">继续</span></span></button></div>`;
      root.querySelector('#ok').onclick = () => onDone ? onDone() : (location.hash = '#/');
      A.sayBi('Bra jobba med begrepene!', '概念学得不错！');
    } else draw();
  }
  render(root); draw();
}

/* ---------- øktkjører ---------- */
function Session(o){
  const root = h('div', {class:'session'});
  const isLoop = !!o.goal || !!o.endless, spec = o.spec || {};
  let queue = isLoop ? null : A.Ex.draw(spec, o.n), initial = queue ? queue.length : 0;
  const st = {correct:0, attempts:0, streak:0, best:0, asked:false, idx:0, recent:[]};
  let cur = null, resolved = false, goal = o.goal;
  root.innerHTML = `<div class="sbar"><button class="x" title="Avslutt">✖</button><div class="stitle">${bi(o.title.no, o.title.zh)}</div><div class="prog"><i></i></div><div class="streak"></div></div><div class="sstage"></div><div class="fbar hidden"></div>`;
  render(root);
  const stage = root.querySelector('.sstage'), fbar = root.querySelector('.fbar'), bar = root.querySelector('.prog i'), strk = root.querySelector('.streak');
  root.querySelector('.x').onclick = () => { o.onExit(); };
  const onKey = e => { if(e.key === 'Enter' && !fbar.classList.contains('hidden') && document.activeElement.tagName !== 'INPUT'){ const b = fbar.querySelector('.next'); if(b){ e.preventDefault(); b.click(); } } };
  document.addEventListener('keydown', onKey);
  A._cleanup = () => document.removeEventListener('keydown', onKey);

  const lvlFor = () => isLoop && o.adaptive ? Math.min(3, (spec.maxLvl || 1) + Math.floor(st.best / 4)) : spec.maxLvl;
  function updateBar(){
    if(o.endless){ bar.style.width = (st.attempts % 10) / 10 * 100 + '%'; strk.innerHTML = o.status ? o.status(st) : `🔥 ${st.streak}`; }
    else if(isLoop){ bar.style.width = Math.min(100, st.streak / goal * 100) + '%'; strk.innerHTML = `🔥 ${st.streak}/${goal}` + (st.best >= goal ? ' ' : ''); }
    else { const total = Math.max(initial, st.idx + queue.length); bar.style.width = (st.idx / total * 100) + '%'; strk.textContent = `${Math.min(st.idx + 1, total)}/${total}`; }
  }
  function show(){
    A.Speech.stop(); fbar.classList.add('hidden'); resolved = false;
    cur = o.next ? o.next(st) : isLoop ? A.Ex.drawOne(Object.assign({}, spec, {maxLvl:lvlFor()}), st.recent) : queue.shift();
    if(!cur){ return end(); }
    st.recent.push(cur.id); if(st.recent.length > 8) st.recent.shift();
    updateBar(); stage.innerHTML = '';
    A.Ex.render(cur, stage, {result});
  }
  function result(res){
    if(resolved) return; resolved = true;
    const ok = res.ok !== undefined ? res.ok : res.score >= 0.8;
    A.Ex.note(cur.id, ok);
    st.attempts++; if(ok) st.correct++;
    if(ok){ st.streak++; st.best = Math.max(st.best, st.streak); } else st.streak = 0;
    if(!isLoop){ st.idx++; if(!ok && !cur.retry && ['choice', 'type', 'num'].includes(cur.kind)) queue.push(Object.assign({}, cur, {retry:true})); }
    if(o.onResult) o.onResult(res, cur, st, ok);
    updateBar();
    const cls = res.score >= 0.8 ? 'good' : res.score >= 0.5 ? 'mid' : 'bad';
    const [okNo, okZh] = A.Ex.msgOk();
    let head;
    if(res.retryOk) head = bi('Riktig nå! Prøv å huske det neste gang.','这次对了！下次要记住哦。');
    else if(cls === 'good') head = bi(okNo, okZh);
    else if(cls === 'mid') head = bi('Nesten! Bra forsøk.','差一点！不错的尝试。');
    else head = bi('Ikke helt. Se på fasiten og prøv å huske.','不太对。看看答案，记住它。');
    const pct = (res.extra !== undefined && !res.fb) ? '' : '';
    let body = `<div><b>${head}</b>`;
    if(res.fb) body += `<div style="margin-top:4px;display:flex;gap:8px;align-items:center"><div style="flex:1">${bi(res.fb.no, res.fb.zh)}</div><button class="spk fbspk" type="button" title="Les opp forklaringen / 朗读解释">🔊</button></div>`;
    if(typeof res.extra === 'string' && res.extra) body += `<div style="margin-top:4px">📝 ${A.esc(res.extra)}</div>`;
    if(['grid', 'find', 'sort', 'build', 'calc'].includes(cur.kind)) body += `<div style="margin-top:4px">${Math.round(res.score * 100)}%</div>`;
    body += '</div>';
    fbar.className = 'fbar ' + cls;
    fbar.innerHTML = `<span class="em">${cls === 'good' ? '🎉' : cls === 'mid' ? '👍' : '💪'}</span><div class="msg">${body}</div><button class="btn next"><span class="bi"><span class="no">Neste ➜</span><span class="zh">下一题</span></span></button>`;
    fbar.querySelector('.next').onclick = proceed;
    const fsp = fbar.querySelector('.fbspk'); if(fsp) fsp.onclick = () => A.sayBi(res.fb.no, res.fb.zh);
    fbar.scrollIntoView({block:'nearest', behavior:'smooth'});
    if(res.say && A.settings.auto) setTimeout(() => A.sayNo(res.say), 250);
  }
  function proceed(){
    if(isLoop && !o.endless && st.best >= goal && !st.asked){ st.asked = true; return ask(); }
    if(!isLoop && !queue.length) return end();
    show();
  }
  function ask(){
    A.Speech.stop();
    const m = h('div', {class:'modal', html:`<div class="box"><div class="big-emoji">🎉</div><h2>${bi(`${goal} riktige på rad!`, `连续答对 ${goal} 题！`)}</h2><p>${bi('Føler du deg trygg?','你觉得有把握了吗？')}</p>
      <button class="btn big" id="yes"><span class="bi"><span class="no">✅ Ja, ferdig!</span><span class="zh">是的，完成！</span></span></button>
      <button class="btn sec" id="more"><span class="bi"><span class="no">🔁 Nei, øv mer</span><span class="zh">还想再练练</span></span></button></div>`});
    document.body.append(m);
    A.sayBi(`${goal} riktige på rad! Føler du deg trygg?`, `连续答对 ${goal} 题！你觉得有把握了吗？`);
    m.querySelector('#yes').onclick = () => { m.remove(); end(); };
    m.querySelector('#more').onclick = () => { m.remove(); goal += 5; show(); };
  }
  function end(){
    A.Speech.stop();
    const acc = st.attempts ? st.correct / st.attempts : 0;
    const stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1;
    stage.innerHTML = ''; fbar.classList.add('hidden');
    const e = h('div', {class:'end', html:`<div class="stars">${star(stars)}</div><h2>${bi('Ferdig!','完成！')}</h2>
      <p>${bi(`${st.correct} riktige av ${st.attempts}`, `${st.attempts} 题中答对 ${st.correct} 题`)}</p>
      <p>${bi(stars === 3 ? 'Fantastisk!' : stars === 2 ? 'Veldig bra!' : 'Bra innsats! Prøv igjen for flere stjerner.', stars === 3 ? '太棒了！' : stars === 2 ? '非常好！' : '很努力！再试一次可以拿到更多星星。')}</p>
      <div class="row"><button class="btn sec" id="again"><span class="bi"><span class="no">↻ Prøv igjen</span><span class="zh">再来一次</span></span></button>
      <button class="btn big" id="go"><span class="bi"><span class="no">Fortsett ➜</span><span class="zh">继续</span></span></button></div>`});
    stage.append(e);
    e.querySelector('#again').onclick = () => o.onAgain();
    e.querySelector('#go').onclick = () => { o.onFinish({stars, correct:st.correct, attempts:st.attempts}); };
    A.sayBi(stars === 3 ? 'Fantastisk!' : 'Bra jobba!', stars === 3 ? '太棒了！' : '做得好！');
  }
  if(!isLoop && !queue.length){ stage.innerHTML = `<div class="end">${bi('Ingen oppgaver funnet.','没有找到题目。')}</div>`; return; }
  show();
  return {stats:st};
}

/* ---------- steg ---------- */
function runStep(m, i){
  const mod = MODS[m], s = mod.steps[i];
  const backToModule = () => { location.hash = '#/m/' + m; route(); };
  const advance = () => { if(i + 1 < mod.steps.length) runStep(m, i + 1); else backToModule(); };
  if(s.t === 'video'){
    const root = h('div', {html:`<div class="crumb" id="back">← ${bi(mod.no, mod.zh)}</div><h2>🎬 ${bi(s.no, s.zh)}</h2><div id="vh"></div>`});
    render(root);
    root.querySelector('#back').onclick = backToModule;
    A.Video.play(root.querySelector('#vh'), s.v, () => { markDone(m, i, 3); advance(); });
  } else if(s.t === 'terms'){
    termsView(s.keys, () => { markDone(m, i, 3); advance(); }, bi(s.no, s.zh));
  } else {
    const o = {title:{no:s.no, zh:s.zh}, spec:s.spec, n:s.n, goal:s.t === 'loop' ? s.goal : 0, adaptive:!!s.spec.adaptive,
      onExit:backToModule, onAgain:() => runStep(m, i),
      onFinish:sum => { markDone(m, i, sum.stars); advance(); }};
    Session(o);
  }
}
A.runStep = runStep;

/* ---------- øvingsrom ---------- */
function practiceRoom(){
  let lvl = 1, goalN = 8;
  const root = h('div');
  const draw = () => {
    root.innerHTML = `<div class="crumb" id="back">← ${bi('Hjem','首页')}</div><h1>🏋️ ${bi('Øvingsrom','练习室')}</h1>
      <p>${bi('Velg tema. Du øver til du har riktig mange ganger på rad.','选一个主题。连续答对足够多次，就说明你有把握了。')}</p>
      <div class="card"><b>${bi('Nivå','难度')}:</b> ${[1, 2, 3].map(n => `<button class="pill ${n === lvl ? 'on' : ''}" data-l="${n}">${'⭐'.repeat(n)}</button>`).join(' ')}
      &nbsp; <b>${bi('Riktige på rad','连续答对')}:</b> ${[5, 8, 12].map(n => `<button class="pill ${n === goalN ? 'on' : ''}" data-g="${n}">${n}</button>`).join(' ')}</div>
      <div class="grid" id="room"></div>`;
    root.querySelector('#back').onclick = () => { location.hash = '#/'; };
    root.querySelectorAll('[data-l]').forEach(b => b.onclick = () => { lvl = +b.dataset.l; draw(); });
    root.querySelectorAll('[data-g]').forEach(b => b.onclick = () => { goalN = +b.dataset.g; draw(); });
    const box = root.querySelector('#room');
    ROOMS.forEach(r => box.append(h('div', {class:'mod', style:'--c:#f97316', html:`<div class="em">${r.emoji}</div><h3>${bi(r.no, r.zh)}</h3>`, onclick:() => start(r)})));
  };
  const start = r => Session({title:{no:r.no, zh:r.zh}, spec:{pools:r.pools, maxLvl:lvl}, goal:goalN, adaptive:true,
    onExit:() => { location.hash = '#/practice'; route(); }, onAgain:() => start(r), onFinish:() => { location.hash = '#/practice'; route(); }});
  render(root); draw();
}

/* ---------- innstillinger ---------- */
function settingsView(){
  const S = A.settings, root = h('div', {class:'settings'});
  const noV = A.Speech.has('no'), zhV = A.Speech.has('zh');
  root.innerHTML = `<div class="crumb" id="back">← ${bi('Hjem','首页')}</div><h1>⚙️ ${bi('Innstillinger','设置')}</h1>
    <div class="card"><label>${bi('Vis tekst på','文字显示')}
      <select id="sl">${LANGS.map(l => `<option value="${l[0]}" ${S.lang === l[0] ? 'selected' : ''}>${l[1]}</option>`).join('')}</select></label>
    <label>${bi('Opplesing på (forklaringer og oppgaver)','朗读语言（讲解和练习）')}
      <select id="ssp"><option value="no" ${S.speak === 'no' ? 'selected' : ''}>🇳🇴 Norsk</option><option value="zh" ${S.speak === 'zh' ? 'selected' : ''}>🇨🇳 中文</option><option value="both" ${S.speak === 'both' ? 'selected' : ''}>🇳🇴 + 🇨🇳 Norsk + 中文</option></select></label>
    ${A.subject !== 'noun' ? `<label>${bi('Svarmåte i oppgaver','答题方式')}
      <select id="sin">${INPUTS.map(x => `<option value="${x[0]}" ${A.prefs.input === x[0] ? 'selected' : ''}>${x[1]} · ${x[2]}</option>`).join('')}</select></label>` : ''}
    ${A.subject === 'mult' ? `<label><input type="checkbox" id="sguide" ${A.prefs.guide ? 'checked' : ''}> ${bi('Regneoppgaver: trinn for trinn','计算题：一步一步引导')}</label>` : ''}
    <label><input type="checkbox" id="spy" ${S.pinyin ? 'checked' : ''}> ${bi('Vis pinyin (拼音)','显示拼音')}</label>
    <label><input type="checkbox" id="sauto" ${S.auto ? 'checked' : ''}> ${bi('Les opp oppgavene automatisk','自动朗读题目')}</label>
    <label>${bi('Taletempo','语速')}
      <select id="sr"><option value="0.65" ${S.rate === 0.65 ? 'selected' : ''}>🐢 Sakte / 慢</option><option value="0.85" ${S.rate === 0.85 ? 'selected' : ''}>🙂 Normal / 正常</option><option value="1" ${S.rate === 1 ? 'selected' : ''}>🐇 Rask / 快</option></select></label></div>
    <div class="card"><b>${bi('Stemmer','语音')}</b>
      <p>🇳🇴 ${noV ? '✅ ' : '⚠️ '}${bi(noV ? 'Norsk stemme funnet' : 'Ingen norsk stemme funnet på denne enheten. Installer norsk tale i system-innstillingene.', noV ? '找到了挪威语语音' : '这台设备上没有找到挪威语语音。请在系统设置里安装挪威语语音。')}</p>
      <p>🇨🇳 ${zhV ? '✅ ' : '⚠️ '}${bi(zhV ? 'Kinesisk stemme funnet' : 'Ingen kinesisk stemme funnet på denne enheten.', zhV ? '找到了中文语音' : '这台设备上没有找到中文语音。')}</p>
      <div class="row"><button class="btn sec" id="t1"><span class="bi"><span class="no">🔊 Test norsk</span><span class="zh">测试挪威语</span></span></button>
      <button class="btn sec" id="t2"><span class="bi"><span class="no">🔊 Test kinesisk</span><span class="zh">测试中文</span></span></button></div></div>
    <div class="card"><button class="btn sec" id="reset"><span class="bi"><span class="no">🗑 Nullstill fremgang</span><span class="zh">清除学习进度</span></span></button></div>`;
  root.querySelector('#back').onclick = () => { location.hash = '#/'; };
  root.querySelector('#sl').onchange = e => { S.lang = e.target.value; A.saveSettings(); syncPills(); };
  root.querySelector('#ssp').onchange = e => { S.speak = e.target.value; S.auto = true; A.saveSettings(); syncPills(); A.sayBi('Norsk opplesing', '中文朗读'); };
  const sin = root.querySelector('#sin'); if(sin) sin.onchange = e => { A.prefs.input = e.target.value; A.savePrefs(); if(A.syncInput) A.syncInput(); };
  const sgd = root.querySelector('#sguide'); if(sgd) sgd.onchange = e => { A.prefs.guide = e.target.checked; A.savePrefs(); };
  root.querySelector('#spy').onchange = e => { S.pinyin = e.target.checked; A.saveSettings(); };
  root.querySelector('#sauto').onchange = e => { S.auto = e.target.checked; A.saveSettings(); syncPills(); };
  root.querySelector('#sr').onchange = e => { S.rate = +e.target.value; A.saveSettings(); };
  root.querySelector('#t1').onclick = () => A.sayNo(INFO.test[0]);
  root.querySelector('#t2').onclick = () => A.say(A.parseSegs(INFO.test[1], 'zh'));
  root.querySelector('#reset').onclick = () => { if(confirm('Nullstille all fremgang? / 要清除所有进度吗？')){ A.progress = {}; A.store.set(PKEY, {}); A.Ex.resetStats(SUBJ === 'mult' ? /^(mf|mm|md|m_)/ : SUBJ === 'geo' ? /^g_/ : undefined); location.hash = '#/'; route(); } };
  render(root);
}

/* ---------- ruter ---------- */
function route(){
  A.store.set('last', {s:A.subject, href:location.pathname.split('/').pop() || 'index.html'}); saveSummary();
  const p = location.hash.replace(/^#\/?/, '').split('/');
  if(A.routes && A.routes[p[0]]) A.routes[p[0]](p);
  else if(p[0] === 'm' && MODS[+p[1]]) moduleView(+p[1]);
  else if(p[0] === 'terms') termsView(null, null);
  else if(p[0] === 'practice') practiceRoom();
  else if(p[0] === 'settings') settingsView();
  else home();
}
A.UI = {Session, render, leave, termsView, bi};
window.addEventListener('hashchange', route);
A.applyLang(); syncPills(); route();
})();
