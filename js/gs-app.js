(function(){
'use strict';
/* Gangesystemet: forside (tabellen som krymper + læringsløype), treningsmodus, fremgang */
const A = window.App, GS = A.GS, {h, bi} = A, G = GS.G;
const app = document.getElementById('app');
const GIDS = GS.GROUPS.map(g => g.id);

/* ---------- oppryddning, timere ---------- */
let cleanups = [];
const onLeave = fn => cleanups.push(fn);
function leave(){ A.Video.stop(); A.Speech.stop(); cleanups.forEach(f => { try{ f(); }catch(e){} }); cleanups = []; }
const later = (fn, ms) => { const t = setTimeout(fn, ms); onLeave(() => clearTimeout(t)); return t; };
const speechOn = () => A.speakKey() !== 'off';

/* ---------- valg og fremgang ---------- */
const PREF = Object.assign({input:'mix', help:'ask', explain:false, n:20, sel:GIDS.slice()}, A.store.get('gs_prefs', {}));
if(!Array.isArray(PREF.sel) || !PREF.sel.length) PREF.sel = GIDS.slice();
const savePref = () => A.store.set('gs_prefs', PREF);
const getPath = () => A.store.get('gs_path', {});
function mark(id, what){ const p = getPath(); p[id] = Object.assign(p[id] || {}, {[what]:1}); A.store.set('gs_path', p); }
const spotStat = () => A.store.get('gs_spot', {});
const pct = (r, n) => n ? Math.round(100 * r / n) : 0;

/* læringsløypa: video + øving per steg */
const PATH = [
  {id:'system', emoji:'🧩', v:'gs_system', practice:null, no:'Systemet: fra 100 til 10', zh:'整体思路：从 100 到 10', sub:['Hvorfor du ikke må pugge alle 100', '为什么不用背全部 100 个']},
  {id:'mirror', emoji:'🪞', v:'gs_mirror', practice:'#/mirror', no:'Speilvendte regnestykker', zh:'对称的算式', sub:['3 × 7 = 7 × 3 · 55 igjen', '3 × 7 = 7 × 3 · 剩 55 个']},
  {id:'easy', emoji:'🟢', v:'gs_easy', practice:'#/train/easy', g:'easy', no:'1-, 2- og 10-gangen', zh:'1、2 和 10 的乘法', sub:['Lett! 27 bort · 28 igjen', '很简单！去掉 27 个 · 剩 28 个']},
  {id:'five', emoji:'🟠', v:'gs_five', practice:'#/train/five', g:'five', no:'5-gangen', zh:'5 的乘法', sub:['Halvparten av 10-gangen · 21 igjen', '10 的乘法的一半 · 剩 21 个']},
  {id:'sq', emoji:'🟦', v:'gs_square', practice:'#/train/sq', g:'sq', no:'Like × like (y × y)', zh:'相同两数相乘（y × y）', sub:['6 kvadrattall · 15 igjen', '6 个平方数 · 剩 15 个']},
  {id:'nine', emoji:'🩷', v:'gs_nine', practice:'#/train/nine', g:'nine', no:'9-gangen med regel', zh:'9 的乘法（有规则）', sub:['y × 9 = (y × 10) − y · 10 igjen', 'y × 9 = (y × 10) − y · 剩 10 个']},
  {id:'learn', emoji:'🟣', v:'gs_learn', practice:'#/train/learn', g:'learn', no:'De 10 som må pugges', zh:'要背的 10 个', sub:['Med triks: doble, 5-6-7-8', '有窍门：翻倍、5-6-7-8']},
  {id:'which', emoji:'🔍', v:'gs_which', practice:'#/spot', no:'Hvilken regel gjelder?', zh:'用哪条规则？', sub:['Fire spørsmål i riktig rekkefølge', '按顺序问四个问题']},
  {id:'all', emoji:'🏆', v:null, practice:'#/train/all', no:'Alt sammen', zh:'全部合起来', sub:['Hele tabellen, med regelhjelp', '整个乘法表，带规则提示']}
];

/* ---------- topp-knapper ---------- */
const cycle = (opts, cur) => opts[(opts.findIndex(o => o[0] === cur) + 1) % opts.length][0];
function syncPills(){
  document.getElementById('pLang').textContent = A.LANG_OPTS.find(o => o[0] === A.settings.lang)[1];
  const s = document.getElementById('pSound'); s.textContent = A.SPEAK_OPTS.find(o => o[0] === A.speakKey())[1]; s.classList.toggle('on', A.settings.auto !== false);
  document.querySelectorAll('.optgrp').forEach(g => g.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.k === (g.dataset.g === 'speak' ? A.speakKey() : A.settings.lang))));
}
A.onSettings = syncPills;
document.getElementById('pLang').onclick = () => A.setLangKey(cycle(A.LANG_OPTS, A.settings.lang));
document.getElementById('pSound').onclick = () => { const k = cycle(A.SPEAK_OPTS, A.speakKey()); A.setSpeakKey(k); if(k !== 'off') A.sayBi('Norsk opplesing', '中文朗读'); };

/* ---------- små byggeklosser ---------- */
const btn = (id, no, zh, cls) => `<button type="button" class="btn ${cls || ''}" id="${id}"><span class="bi"><span class="no">${no}</span><span class="zh">${zh}</span></span></button>`;
const radio = (name, list, cur) => `<span class="optgrp" data-r="${name}">${list.map(o => `<button type="button" class="pill ${String(o[0]) === String(cur) ? 'on' : ''}" data-k="${o[0]}">${o[1]}</button>`).join('')}</span>`;
function bindRadio(root, name, cb){
  root.querySelectorAll(`.optgrp[data-r="${name}"] button`).forEach(b => b.onclick = () => {
    root.querySelectorAll(`.optgrp[data-r="${name}"] button`).forEach(x => x.classList.toggle('on', x === b)); cb(b.dataset.k);
  });
}
const crumb = (href, no, zh) => `<a class="crumb" href="${href}">← ${bi(no || 'Tilbake', zh || '返回')}</a>`;
function ruleInto(host, a, b, full, onHow){
  host.innerHTML = GS.ruleHTML(a, b, full) + (!full && onHow ? `<div style="text-align:center;margin-top:8px"><button type="button" class="btn sec" id="gHow"><span class="bi"><span class="no">Vis hvordan →</span><span class="zh">看怎么算 →</span></span></button></div>` : '');
  const how = host.querySelector('#gHow'); if(how) how.onclick = onHow;
  const say = host.querySelector('.rb-say'); if(say) say.onclick = () => GS.sayExplain(a, b);
}

/* =====================================================================
   FORSIDE
   ===================================================================== */
function home(){
  const pr = getPath();
  const next = PATH.find(p => !(pr[p.id] && ((!p.v || pr[p.id].v) && (!p.practice || pr[p.id].p))));
  const sure = GS.sureCount(GS.ALL);
  app.innerHTML = '';
  const root = h('div', {class:'gs-home'});
  root.innerHTML = `
  <div class="hero"><div class="big-emoji">🧩</div><div class="grow"><h1>${bi('Gangetabellen som system', '把乘法表当作一个系统')}</h1>
    <div>${bi('Fra 100 ruter til 10 regnestykker – ett steg om gangen.', '从 100 个格子到 10 道算式——一次学一步。')}</div></div>
    <a class="btn big sec" href="#/video/gs_system" style="text-decoration:none"><span class="bi"><span class="no">🎬 Se oversiktsvideoen</span><span class="zh">看整体介绍视频</span></span></a></div>

  <div class="card gx" id="gx"><h2>${bi('Slik krymper tabellen', '乘法表是这样变小的')}</h2>
    <div class="gx-steps" id="gxSteps"></div>
    <div class="gx-cap" id="gxCap"></div>
    <div class="gx-tbl" id="gxTbl"></div>
    <div class="gx-legend" id="gxLegend"></div>
    <div id="gxFun"></div>
    <div class="gx-rule" id="gxRule"><div class="small-note">${bi('👆 Trykk på en rute for å se hvilken regel som gjelder.', '👆 点一个格子，看看用哪条规则。')}</div></div>
  </div>

  <h2 class="gs-sec">${bi('Lær systemet – trinn for trinn', '一步一步学这个系统')} <span class="gs-secsub">${bi(`${sure} av 55 regnestykker er sikre`, `55 道算式中已掌握 ${sure} 道`)}</span></h2>
  <div class="steps" id="gPath"></div>

  <h2 class="gs-sec">${bi('Treningsmodus', '练习模式')}</h2>
  <div class="grid" id="gModes"></div>
  <div class="small-note" style="margin-top:16px">${bi('Vil du ha mer? ', '想要更多？')} <a class="crumb" href="gs-ark.html">${bi('📝 Arbeidsark (skriv ut)', '📝 练习纸（打印）')}</a> · <a class="crumb" href="multiplikasjon.html">${bi('Gange – lær og øv', '乘法：学习和练习')}</a> · <a class="crumb" href="gange.html">${bi('Gangespill', '乘法小游戏')}</a></div>`;
  app.append(root);

  /* --- tabell-utforsker --- */
  let step = 1, all = false, sel = null, timer = null;
  const stepsEl = root.querySelector('#gxSteps'), capEl = root.querySelector('#gxCap'), tblEl = root.querySelector('#gxTbl'), legEl = root.querySelector('#gxLegend'), funEl = root.querySelector('#gxFun'), ruleEl = root.querySelector('#gxRule');
  onLeave(() => clearInterval(timer));
  stepsEl.innerHTML = GS.STEPS.map(s => `<button type="button" class="pill gx-st" data-n="${s.n}" style="--c:${s.bar}">${s.n}</button>`).join('') +
    `<button type="button" class="pill gx-st" data-n="all" style="--c:#fde68a">🎨 <span class="bi" style="display:inline"><span class="no">Regler</span><span class="zh">规则</span></span></button>` +
    `<button type="button" class="pill" id="gxPlay">▶ <span class="bi" style="display:inline"><span class="no">Spill av</span><span class="zh">播放</span></span></button>`;
  legEl.innerHTML = GS.GROUPS.map(g => `<span class="gl" style="--c:${g.c};--bg:${g.bg}"><i></i>${bi(g.no, g.zh)}</span>`).join('');
  function paint(){
    const S = GS.STEPS[step - 1];
    stepsEl.querySelectorAll('.gx-st').forEach(b => b.classList.toggle('on', all ? b.dataset.n === 'all' : b.dataset.n === String(step)));
    capEl.innerHTML = all ? `<b>${bi('Alle regler i én tabell', '一张表里的所有规则')}</b><div class="small-note">${bi('Hver farge er en regel. De lyse rutene er speilvendte.', '每种颜色是一条规则。浅色格子是对称的。')}</div>`
      : `<b>${step}. ${bi(S.no, S.zh)}</b><div class="small-note">${bi(S.sub[0], S.sub[1])}</div>`;
    tblEl.innerHTML = all ? GS.table({all:true, sel}) : GS.table({step, sel});
    legEl.style.display = all || step >= 3 ? '' : 'none';
    funEl.innerHTML = all ? '' : GS.funnel(step);
  }
  stepsEl.querySelectorAll('.gx-st').forEach(b => b.onclick = () => { clearInterval(timer); if(b.dataset.n === 'all'){ all = true; } else { all = false; step = +b.dataset.n; } paint(); });
  root.querySelector('#gxPlay').onclick = () => {
    clearInterval(timer); all = false; step = 1; paint();
    timer = setInterval(() => { if(step >= 7){ clearInterval(timer); return; } step++; paint(); }, 1700);
  };
  tblEl.addEventListener('click', e => {
    const td = e.target.closest('td[data-a]'); if(!td) return;
    const a = +td.dataset.a, b = +td.dataset.b; sel = [a, b]; paint();
    ruleInto(ruleEl, a, b, true);
    ruleEl.insertAdjacentHTML('afterbegin', `<div class="gx-q">${a} × ${b} = ${a * b}</div>`);
    ruleEl.scrollIntoView({behavior:'smooth', block:'nearest'});
  });
  paint();

  /* --- læringsløype --- */
  const pEl = root.querySelector('#gPath');
  PATH.forEach((p, i) => {
    const st = pr[p.id] || {}, done = (!p.v || st.v) && (!p.practice || st.p);
    const el = h('div', {class:`step gpath ${done ? 'done' : p === next ? 'next' : ''}`, html:
      `<div class="ico">${p.emoji}</div><div class="tx"><b>${i + 1}.</b> ${bi(p.no, p.zh)}<div class="small-note" style="text-align:left">${bi(p.sub[0], p.sub[1])}</div>
       <div class="gp-btns">${p.v ? `<a class="pill ${st.v ? 'ok' : ''}" href="#/video/${p.v}">🎬 ${bi('Video', '视频')}${st.v ? ' ✓' : ''}</a>` : ''}${p.practice ? `<a class="pill ${st.p ? 'ok' : ''}" href="${p.practice}">✏️ ${bi('Øv', '练习')}${st.p ? ' ✓' : ''}</a>` : ''}</div></div>
       <div class="st">${done ? '✅' : p === next ? '👉' : ''}</div>`});
    pEl.append(el);
  });

  /* --- treningsmodus --- */
  const M = [
    {c:'#7c3aed', e:'📋', no:'Hele tabellen', zh:'整个乘法表', d:['Alle regnestykker blandet. Trykk ❓ for å få vite hvilken regel som gjelder.', '所有算式混在一起。点 ❓ 就能知道用哪条规则。'], href:'#/train/all'},
    {c:'#16a34a', e:'🎯', no:'Øv på en gruppe', zh:'练习一组', d:['Velg gruppen du vil øve på:', '选择你想练习的一组：'], groups:true},
    {c:'#2563eb', e:'🔍', no:'Regelspotter', zh:'找规则', d:['Se regnestykket og velg hvilken regel som gjelder.', '看算式，选择用哪条规则。'], href:'#/spot'},
    {c:'#9333ea', e:'🃏', no:'Pugge-kort', zh:'背诵卡片', d:['Se, tenk, snu kortet. De 10 (og gjerne kvadrattallene).', '看一看、想一想、翻卡片。那 10 个（还有平方数）。'], href:'#/cards/learn'},
    {c:'#dc2626', e:'⚡', no:'Fartsrunde', zh:'速度挑战', d:['60 sekunder. Hvor mange rekker du?', '60 秒。你能做对几道？'], href:'#/speed'},
    {c:'#0d9488', e:'🪞', no:'Speilvendte', zh:'对称的算式', d:['Du vet 3 × 7 = 21. Hva er 7 × 3?', '你知道 3 × 7 = 21。那 7 × 3 呢？'], href:'#/mirror'},
    {c:'#f97316', e:'📊', no:'Min fremgang', zh:'我的进度', d:['Se hvilke regnestykker som sitter, og hva du sliter med.', '看看哪些算式已经会了，哪些还有困难。'], href:'#/stats'}
  ];
  const mEl = root.querySelector('#gModes');
  M.forEach(m => {
    const el = h('div', {class:'mod hubcard', style:`--c:${m.c}`, html:`<div class="em">${m.e}</div><h3>${bi(m.no, m.zh)}</h3><div class="hubdesc">${bi(m.d[0], m.d[1])}</div>` +
      (m.groups ? `<div class="gm-groups">${GS.GROUPS.map(g => `<a class="gbadge big" href="#/train/${g.id}" style="--c:${g.c};--bg:${g.bg}">${g.emoji} ${g.short}</a>`).join('')}</div>` : '')});
    if(m.href){ el.onclick = () => { location.hash = m.href; }; el.tabIndex = 0; el.onkeydown = e => { if(e.key === 'Enter') location.hash = m.href; }; el.style.cursor = 'pointer'; }
    else el.style.cursor = 'default';
    mEl.append(el);
  });
}

/* =====================================================================
   VIDEO
   ===================================================================== */
function videoPage(id){
  const V = A.VIDEOS[id]; if(!V){ location.hash = '#/'; return; }
  const i = PATH.findIndex(p => p.v === id), step = PATH[i];
  const nextV = PATH.slice(i + 1).find(p => p.v);
  app.innerHTML = `<div class="gs-vp">${crumb('#/')}<h1>${V.emoji} ${bi(V.no, V.zh)}</h1><div id="vh"></div>
    <div class="gs-after">${step && step.practice ? `<a class="btn" href="${step.practice}" style="text-decoration:none"><span class="bi"><span class="no">✏️ Øv på dette</span><span class="zh">练习这个</span></span></a>` : ''}
    ${nextV ? `<a class="btn sec" href="#/video/${nextV.v}" style="text-decoration:none"><span class="bi"><span class="no">Neste video ›</span><span class="zh">下一个视频 ›</span></span></a>` : ''}</div></div>`;
  A.Video.play(app.querySelector('#vh'), id, () => { if(step) mark(step.id, 'v'); location.hash = step && step.practice ? step.practice : '#/'; });
}

/* =====================================================================
   OPPSETT (felles for treningsmodus)
   ===================================================================== */
const MODES = {
  train:{emoji:'📋', opts:['groups', 'help', 'input', 'n', 'explain']},
  cards:{emoji:'🃏', opts:['groups', 'n'], no:'Pugge-kort', zh:'背诵卡片'},
  speed:{emoji:'⚡', opts:['groups', 'input'], no:'Fartsrunde (60 sekunder)', zh:'速度挑战（60 秒）'},
  spot:{emoji:'🔍', opts:['n'], no:'Regelspotter', zh:'找规则'},
  mirror:{emoji:'🪞', opts:['input', 'n'], no:'Speilvendte regnestykker', zh:'对称的算式'}
};
function setup(mode, gid){
  const M = MODES[mode];
  const single = (mode === 'train' || mode === 'cards') && gid && gid !== 'all' && G[gid];
  const t = mode === 'train' ? (single ? {no:G[gid].no, zh:G[gid].zh} : {no:'Hele tabellen', zh:'整个乘法表'}) : {no:M.no, zh:M.zh};
  const cfg = {mode, gid, sel:single ? [gid] : (mode === 'speed' || mode === 'train' ? PREF.sel.slice() : ['learn']), help:PREF.help, input:PREF.input, n:PREF.n, explain:PREF.explain};
  if(mode === 'cards' && !single) cfg.sel = ['learn', 'sq'];
  const has = k => M.opts.includes(k);
  const row = (lab, zh, inner) => `<div class="gs-opt"><div class="gs-ol">${bi(lab, zh)}</div><div>${inner}</div></div>`;
  app.innerHTML = '';
  const root = h('div', {class:'gs-setup'});
  const color = single ? G[gid].c : '#7c3aed';
  root.innerHTML = `${crumb('#/')}<div class="card" style="border-top:8px solid ${color}"><h1 style="margin-top:0">${M.emoji} ${bi(t.no, t.zh)}</h1>
    ${mode === 'train' && !single ? `<div class="small-note" style="text-align:left">${bi('Hele tabellen, alle regnestykker. Trykk ❓ under oppgaven for å få vite hvilken regel som gjelder.', '整个乘法表，所有算式。点题目下面的 ❓，就能知道用哪条规则。')}</div>` : ''}
    ${mode === 'spot' ? `<div class="small-note" style="text-align:left">${bi('Du får et regnestykke. Velg hvilken regel (gruppe) det hører til. Husk de fire spørsmålene!', '给你一道算式。选择它属于哪条规则（哪一组）。记住那四个问题！')}</div>` : ''}
    ${mode === 'speed' ? `<div class="small-note" style="text-align:left">${bi('Svar på så mange du kan på 60 sekunder. Ingen hjelp underveis.', '60 秒内尽量多答。中途没有提示。')}</div>` : ''}
    ${mode === 'cards' ? `<div class="small-note" style="text-align:left">${bi('Se på regnestykket, tenk på svaret, og snu kortet. Si så ærlig om du kunne den.', '看算式，想答案，然后翻卡片。再诚实地说你是否会。')}</div>` : ''}
    ${has('groups') ? row('Hvilke grupper?', '哪些组？', `<span class="optgrp" id="sGroups">${GS.GROUPS.map(g => `<button type="button" class="gchip ${cfg.sel.includes(g.id) ? 'on' : ''}" data-g="${g.id}" style="--c:${g.c};--bg:${g.bg}">${g.emoji} ${g.short} <small>${GS.FACTS[g.id].length}</small></button>`).join('')}</span>`) : ''}
    ${has('help') ? row('Hjelp med regelen', '规则提示', radio('help', [['show', '👀 Vis regelen'], ['ask', '❓ Med knapp'], ['after', '🙈 Bare etter feil']], cfg.help)) : ''}
    ${has('input') ? row('Svar', '回答方式', radio('input', [['choice', '✅ Flervalg'], ['type', '⌨️ Skriv inn'], ['mix', '🎲 Tilfeldig']], cfg.input)) : ''}
    ${has('n') ? row('Antall oppgaver', '题目数量', radio('n', [[10, '10'], [20, '20'], [40, '40']], cfg.n)) : ''}
    ${has('explain') ? row('Forklaring', '解释', `<label class="gs-chk"><input type="checkbox" id="sExplain" ${cfg.explain ? 'checked' : ''}> ${bi('Forklar etter hvert svar', '每次答完都解释')}</label>`) : ''}
    <div style="text-align:center;margin-top:16px">${btn('sStart', '▶ Start', '开始', 'big')}</div></div>`;
  app.append(root);
  const startBtn = root.querySelector('#sStart');
  const upd = () => { startBtn.disabled = !cfg.sel.length; };
  const gEl = root.querySelector('#sGroups');
  if(gEl) gEl.querySelectorAll('button').forEach(b => b.onclick = () => {
    const g = b.dataset.g, i = cfg.sel.indexOf(g);
    if(i >= 0) cfg.sel.splice(i, 1); else cfg.sel.push(g);
    b.classList.toggle('on', i < 0); upd();
  });
  bindRadio(root, 'help', k => { cfg.help = k; });
  bindRadio(root, 'input', k => { cfg.input = k; });
  bindRadio(root, 'n', k => { cfg.n = +k; });
  const ex = root.querySelector('#sExplain'); if(ex) ex.onchange = () => { cfg.explain = ex.checked; };
  startBtn.onclick = () => {
    PREF.help = cfg.help; PREF.input = cfg.input; PREF.n = cfg.n; PREF.explain = cfg.explain;
    if(mode === 'train' && !single) PREF.sel = cfg.sel.slice();
    if(mode === 'speed') PREF.sel = cfg.sel.slice();
    savePref();
    cfg.pool = [].concat(...cfg.sel.map(g => GS.FACTS[g]));
    cfg.pathId = mode === 'train' ? (single ? gid : (cfg.sel.length === 5 ? 'all' : null)) : mode === 'spot' ? 'which' : mode === 'mirror' ? 'mirror' : null;
    cfg.title = t;
    ({train:runCalc, speed:runCalc, cards:runCards, spot:runSpot, mirror:runMirror})[mode](cfg);
  };
  upd();
}

/* ---------- økt: felles ramme ---------- */
function shell(cfg, color){
  const root = h('div', {class:'session gs-sess', html:`<div class="sbar"><button class="x" type="button" title="Avslutt">✕</button><div class="stitle" style="color:${color || '#7c3aed'}">${bi(cfg.title.no, cfg.title.zh)}</div><div class="prog"><i></i></div><div class="streak"></div></div><div class="qhost"></div>`});
  app.innerHTML = ''; app.append(root);
  root.querySelector('.x').onclick = () => { leave(); route(true); };
  const prog = root.querySelector('.prog i'), streak = root.querySelector('.streak');
  return {root, host:root.querySelector('.qhost'), setProg(p){ prog.style.width = Math.max(0, Math.min(100, p * 100)) + '%'; }, setStreak(n){ streak.textContent = n >= 2 ? '🔥 ' + n : ''; }};
}
function endScreen(sh, cfg, o){
  const p = pct(o.right, o.tried);
  if(cfg.pathId && o.tried >= Math.min(8, cfg.n || 8) && p >= 70) mark(cfg.pathId, 'p');
  const miss = []; const seen = new Set();
  (o.wrongs || []).forEach(f => { const k = GS.key(f[0], f[1]); if(!seen.has(k)){ seen.add(k); miss.push(f); } });
  sh.setProg(1);
  sh.host.innerHTML = `<div class="end"><div class="big-emoji">${p >= 90 ? '🏆' : p >= 70 ? '🎉' : '💪'}</div><h2>${bi(o.speed ? `${o.right} riktige på 60 sekunder!` : `${o.right} av ${o.tried} riktige (${p} %)`, o.speed ? `60 秒答对 ${o.right} 道！` : `${o.tried} 道中答对 ${o.right} 道（${p}%）`)}</h2>
    ${o.extra || ''}
    ${miss.length ? `<div class="gs-miss"><div class="rb-tt">${bi('Øv mer på disse (trykk for å se regelen):', '多练这些（点一下看规则）：')}</div><div class="row">${miss.map(f => `<button type="button" class="gfact" data-a="${f[0]}" data-b="${f[1]}" style="--c:${G[GS.classify(f[0], f[1]).g].c};--bg:${G[GS.classify(f[0], f[1]).g].bg}">${f[0]} × ${f[1]} = ${f[0] * f[1]}</button>`).join('')}</div><div id="gMissRule"></div></div>` : `<div class="small-note">${bi('Ingen feil – flott!', '没有错——太棒了！')}</div>`}
    <div class="row" style="margin-top:16px;justify-content:center">${btn('eAgain', '↻ Øv igjen', '再练一次')}${btn('eSet', '⚙️ Endre valg', '更改设置', 'sec')}${btn('eHome', '🏠 Til forsiden', '回首页', 'sec')}</div></div>`;
  sh.host.querySelectorAll('.gs-miss .gfact').forEach(b => b.onclick = () => ruleInto(sh.host.querySelector('#gMissRule'), +b.dataset.a, +b.dataset.b, true));
  sh.host.querySelector('#eAgain').onclick = () => { leave(); ({train:runCalc, speed:runCalc, cards:runCards, spot:runSpot, mirror:runMirror})[cfg.mode](cfg); };
  sh.host.querySelector('#eSet').onclick = () => { leave(); route(true); };
  sh.host.querySelector('#eHome').onclick = () => { location.hash = '#/'; };
  if(speechOn() && p >= 70) A.sayBi(o.speed ? `${o.right} riktige!` : 'Bra jobbet!', o.speed ? `答对 ${o.right} 道！` : '做得好！');
}
function options(a, b){
  const ans = a * b, set = new Set([ans]);
  for(const x of A.shuffle([a * (b + 1), a * (b - 1), (a + 1) * b, (a - 1) * b, ans + 10, ans - 10, ans + 1, ans - 1, ans + 2, ans - 2])){ if(set.size >= 4) break; if(x > 0 && x !== ans) set.add(x); }
  return A.shuffle([...set]);
}
const padHTML = () => `<div class="gdisp empty" id="gDisp">${A.bi('skriv svaret', '输入答案')}</div><div class="gpad">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button type="button" class="gkey" data-k="${n}">${n}</button>`).join('')}<button type="button" class="gkey del" data-k="del">⌫</button><button type="button" class="gkey" data-k="0">0</button><button type="button" class="gkey ok" data-k="ok">OK</button></div>`;
const fbar = (cls, emoji, msgHTML, nextLabel) => `<div class="fbar ${cls}"><span class="em">${emoji}</span><div class="msg">${msgHTML}</div>${nextLabel ? btn('gNext', nextLabel[0], nextLabel[1]) : ''}</div>`;

/* =====================================================================
   HELE TABELLEN / GRUPPE / FARTSRUNDE
   ===================================================================== */
function runCalc(cfg){
  const timed = cfg.mode === 'speed', pool = cfg.pool;
  const color = cfg.sel.length === 1 ? G[cfg.sel[0]].c : '#7c3aed';
  const sh = shell(cfg, color);
  let queue = GS.pickFacts(pool, timed ? 200 : cfg.n), i = 0, right = 0, tried = 0, streak = 0, locked = false, typed = '', cur = null, over = false, best = 0;
  const wrongs = [], requeued = new Set();
  let left = 60, tick = null;
  if(timed){
    tick = setInterval(() => { left -= .25; sh.setProg(left / 60); if(left <= 0){ clearInterval(tick); over = true; finish(); } }, 250);
    onLeave(() => clearInterval(tick)); sh.setProg(1);
  }
  const keyH = e => {
    if(!cur || cur.mode !== 'type' || cur.done) return;
    if(/^\d$/.test(e.key)) key(e.key); else if(e.key === 'Backspace') key('del'); else if(e.key === 'Enter') key('ok');
  };
  document.addEventListener('keydown', keyH); onLeave(() => document.removeEventListener('keydown', keyH));

  function next(){
    if(over) return;
    if(!timed && i >= queue.length) return finish();
    if(timed && i >= queue.length) queue = queue.concat(GS.pickFacts(pool, 100));
    const f = queue[i++], flip = f[0] !== f[1] && Math.random() < .5;
    const a = flip ? f[1] : f[0], b = flip ? f[0] : f[1];
    const m = cfg.input === 'mix' ? (Math.random() < .5 ? 'choice' : 'type') : cfg.input;
    cur = {a, b, ans:a * b, helped:false, done:false, mode:m, f}; locked = false; typed = '';
    draw();
  }
  function draw(){
    const {a, b, mode} = cur, g = G[GS.classify(a, b).g];
    sh.host.innerHTML = `<div class="qcard gq" style="--c:${g.c};--bg:${g.bg}">
      <div class="gq-eq"><span>${a} × ${b} =</span> <span class="gq-q" id="gAns">?</span> <button class="spk" id="gSay" type="button" title="🔊">🔊</button></div>
      <div class="gq-in">${mode === 'choice' ? `<div class="gchoices">${options(a, b).map(o => `<button type="button" class="gchoice" data-v="${o}">${o}</button>`).join('')}</div>` : padHTML()}</div>
      ${!timed && cfg.help === 'ask' ? `<div class="gq-ctl"><button type="button" class="btn sec" id="gAsk"><span class="bi"><span class="no">❓ Hvilken regel gjelder?</span><span class="zh">用哪条规则？</span></span></button></div>` : ''}
      <div id="gFb"></div><div class="gq-rule" id="gRule"></div></div>`;
    sh.host.querySelector('#gSay').onclick = () => GS.sayQ(a, b);
    sh.host.querySelectorAll('.gchoice').forEach(b => b.onclick = () => submit(+b.dataset.v, b));
    sh.host.querySelectorAll('.gkey').forEach(b => b.onclick = () => key(b.dataset.k));
    const rule = sh.host.querySelector('#gRule');
    const showRule = full => ruleInto(rule, a, b, full, full ? null : () => { cur.helped = true; showRule(true); });
    const ask = sh.host.querySelector('#gAsk');
    if(ask) ask.onclick = () => { ask.parentNode.remove(); showRule(false); };
    if(!timed && cfg.help === 'show') showRule(false);
    cur.showRule = showRule;
    if(!timed && speechOn()) GS.sayQ(a, b);
  }
  function key(k){
    if(locked || !cur) return;
    if(k === 'del') typed = typed.slice(0, -1);
    else if(k === 'ok'){ if(typed) submit(+typed); return; }
    else if(typed.length < 3) typed += k;
    const d = sh.host.querySelector('#gDisp'); if(!d) return;
    d.textContent = typed || (A.settings.lang === 'zh' ? '输入答案' : 'skriv svaret'); d.classList.toggle('empty', !typed);
  }
  function submit(v, btnEl){
    if(locked || !cur || cur.done) return;
    locked = true; cur.done = true; tried++;
    const {a, b, ans} = cur, ok = v === ans, ansEl = sh.host.querySelector('#gAns'), fb = sh.host.querySelector('#gFb');
    ansEl.textContent = ans; ansEl.classList.add(ok ? 'good' : 'bad');
    if(btnEl) btnEl.classList.add(ok ? 'good' : 'bad');
    sh.host.querySelectorAll('.gchoice').forEach(x => { x.disabled = true; if(+x.dataset.v === ans) x.classList.add('good'); });
    if(ok){
      right++; streak++; best = Math.max(best, streak);
      GS.record(a, b, cur.helped ? 'help' : 'ok');
      sh.setStreak(streak); if(!timed) sh.setProg(i / queue.length);
      if(timed){ later(next, 220); return; }
      if(cfg.explain || cur.helped){
        cur.showRule(true);
        fb.innerHTML = fbar('good', '✅', bi('Riktig!', '对了！'), ['Neste ›', '下一题 ›']); fb.querySelector('#gNext').onclick = next;
      } else {
        fb.innerHTML = fbar('good', '✅', bi(`Riktig! ${a} × ${b} = ${ans}`, `对了！${a} × ${b} = ${ans}`));
        later(next, 900);
      }
    } else {
      streak = 0; sh.setStreak(0); wrongs.push([a, b]); GS.record(a, b, 'wrong');
      const k = GS.key(a, b);
      if(!requeued.has(k) && !timed){ requeued.add(k); queue.splice(Math.min(queue.length, i + 3), 0, cur.f); }
      if(timed){
        fb.innerHTML = fbar('bad', '❌', bi(`${a} × ${b} = ${ans}`, `${a} × ${b} = ${ans}`));
        later(next, 750); return;
      }
      sh.setProg(i / queue.length);
      cur.showRule(true);
      fb.innerHTML = fbar('bad', '❌', bi(`Ikke helt. ${a} × ${b} = ${ans}`, `不对。${a} × ${b} = ${ans}`), ['Neste ›', '下一题 ›']);
      fb.querySelector('#gNext').onclick = next;
      if(speechOn()) GS.sayEq(a, b);
    }
  }
  function finish(){
    clearInterval(tick);
    let extra = '';
    if(timed){
      const bestSaved = A.store.get('gs_best', 0), nb = Math.max(bestSaved, right);
      if(right > bestSaved) A.store.set('gs_best', right);
      extra = `<div class="small-note">${bi(`Beste fartsrunde: ${nb}`, `最好成绩：${nb}`)}${right > bestSaved && bestSaved ? ' 🎊' : ''} · ${bi(`Riktig: ${right} av ${tried}`, `答对 ${tried} 道中的 ${right} 道`)}</div>`;
      if(!cfg.pathId && cfg.sel.length === 5) mark('all', 'p');
    }
    endScreen(sh, cfg, {right, tried, wrongs, speed:timed, extra});
  }
  next();
}

/* =====================================================================
   PUGGE-KORT
   ===================================================================== */
function runCards(cfg){
  const color = cfg.sel.length === 1 ? G[cfg.sel[0]].c : '#9333ea';
  const sh = shell(cfg, color);
  const queue = GS.pickFacts(cfg.pool, cfg.n), requeued = new Set();
  let i = 0, right = 0, tried = 0;
  const wrongs = [];
  function next(){
    if(i >= queue.length) return endScreen(sh, cfg, {right, tried, wrongs});
    const f = queue[i++], flip = f[0] !== f[1] && Math.random() < .5, a = flip ? f[1] : f[0], b = flip ? f[0] : f[1], g = G[GS.classify(a, b).g];
    sh.setProg((i - 1) / queue.length);
    sh.host.innerHTML = `<div class="qcard gcard" style="--c:${g.c};--bg:${g.bg}"><div class="gcard-b">${GS.badge(GS.classify(a, b).g)}</div>
      <div class="gq-eq"><span>${a} × ${b}</span> <span class="gq-q">?</span> <button class="spk" id="gSay" type="button">🔊</button></div>
      <div class="small-note">${bi('Tenk på svaret, så snur du kortet.', '先想答案，再翻卡片。')}</div>
      <div id="gBack"><div style="text-align:center;margin-top:10px">${btn('gShow', '👀 Vis svaret', '看答案', 'big')}</div></div></div>`;
    sh.host.querySelector('#gSay').onclick = () => GS.sayQ(a, b);
    if(speechOn()) GS.sayQ(a, b);
    sh.host.querySelector('#gShow').onclick = () => {
      sh.host.querySelector('.gq-q').outerHTML = `<span class="gq-q good">= ${a * b}</span>`;
      const back = sh.host.querySelector('#gBack');
      back.innerHTML = `<div id="gRule"></div><div class="small-note" style="margin-top:8px">${bi('Kunne du den?', '你会吗？')}</div><div class="row" style="justify-content:center;margin-top:6px">${btn('gNo', '😕 Ikke ennå', '还不会', 'sec')}${btn('gYes', '✅ Kunne den', '我会', '')}</div>`;
      ruleInto(back.querySelector('#gRule'), a, b, true);
      if(speechOn()) GS.sayEq(a, b);
      const fin = ok => {
        tried++;
        if(ok){ right++; GS.record(a, b, 'ok'); }
        else { wrongs.push([a, b]); GS.record(a, b, 'wrong'); const k = GS.key(a, b); if(!requeued.has(k)){ requeued.add(k); queue.splice(Math.min(queue.length, i + 3), 0, f); } }
        next();
      };
      back.querySelector('#gYes').onclick = () => fin(true);
      back.querySelector('#gNo').onclick = () => fin(false);
    };
  }
  next();
}

/* =====================================================================
   REGELSPOTTER
   ===================================================================== */
function runSpot(cfg){
  const sh = shell(cfg, '#2563eb');
  const queue = []; let lastG = null;
  for(let k = 0; k < cfg.n; k++){
    let g; do g = A.pick(GIDS); while(g === lastG && GIDS.length > 1); lastG = g;
    const f = A.pick(GS.FACTS[g]), flip = f[0] !== f[1] && Math.random() < .5;
    queue.push(flip ? [f[1], f[0]] : f.slice());
  }
  let i = 0, right = 0, tried = 0, streak = 0;
  const wrongs = [];
  function next(){
    if(i >= queue.length) return endScreen(sh, cfg, {right, tried, wrongs});
    const [a, b] = queue[i++], c = GS.classify(a, b);
    sh.setProg((i - 1) / queue.length);
    sh.host.innerHTML = `<div class="qcard gq" style="--c:#2563eb"><div class="gq-eq"><span>${a} × ${b}</span> <button class="spk" id="gSay" type="button">🔊</button></div>
      <div class="small-note">${bi('Hvilken regel gjelder? (Husk de fire spørsmålene.)', '用哪条规则？（记住那四个问题。）')}</div>
      <div class="gspot">${GS.GROUPS.map(g => `<button type="button" class="gsp" data-g="${g.id}" style="--c:${g.c};--bg:${g.bg}"><span class="e">${g.emoji}</span><b>${g.short}</b><small>${bi(g.no, g.zh)}</small></button>`).join('')}</div>
      <div id="gFb"></div><div id="gRule"></div></div>`;
    sh.host.querySelector('#gSay').onclick = () => GS.sayQ(a, b);
    if(speechOn()) GS.sayQ(a, b);
    sh.host.querySelectorAll('.gsp').forEach(bt => bt.onclick = () => {
      const ok = bt.dataset.g === c.g; tried++;
      sh.host.querySelectorAll('.gsp').forEach(x => { x.disabled = true; if(x.dataset.g === c.g) x.classList.add('good'); });
      if(!ok) bt.classList.add('bad');
      const st = spotStat(), s = st[c.g] || (st[c.g] = {r:0, w:0}); if(ok) s.r++; else s.w++; A.store.set('gs_spot', st);
      if(ok){ right++; streak++; } else { streak = 0; wrongs.push([a, b]); }
      sh.setStreak(streak);
      ruleInto(sh.host.querySelector('#gRule'), a, b, true);
      const fb = sh.host.querySelector('#gFb');
      fb.innerHTML = fbar(ok ? 'good' : 'bad', ok ? '✅' : '❌', ok ? bi('Riktig regel!', '规则选对了！') : bi('Ikke helt – se spørsmålene over.', '不对——看上面的问题。'), ['Neste ›', '下一题 ›']);
      fb.querySelector('#gNext').onclick = next;
    });
  }
  next();
}

/* =====================================================================
   SPEILVENDTE
   ===================================================================== */
function runMirror(cfg){
  const sh = shell(cfg, '#0d9488');
  const pool = GS.ALL.filter(f => f[0] !== f[1] && f[0] >= 2);
  const queue = GS.pickFacts(pool, cfg.n);
  let i = 0, right = 0, tried = 0, streak = 0, locked = false, typed = '', cur = null;
  const wrongs = [];
  const keyH = e => { if(!cur || cur.mode !== 'type' || cur.done) return; if(/^\d$/.test(e.key)) key(e.key); else if(e.key === 'Backspace') key('del'); else if(e.key === 'Enter') key('ok'); };
  document.addEventListener('keydown', keyH); onLeave(() => document.removeEventListener('keydown', keyH));
  function next(){
    if(i >= queue.length) return endScreen(sh, cfg, {right, tried, wrongs});
    const f = queue[i++], flip = Math.random() < .5, a = flip ? f[1] : f[0], b = flip ? f[0] : f[1];
    cur = {a, b, ans:a * b, done:false, mode:cfg.input === 'mix' ? (Math.random() < .5 ? 'choice' : 'type') : cfg.input}; locked = false; typed = '';
    sh.setProg((i - 1) / queue.length);
    sh.host.innerHTML = `<div class="qcard gq" style="--c:#0d9488;--bg:#c8f0e8"><div class="small-note">${bi('Du vet:', '你知道：')}</div>
      <div class="gq-eq"><span>${a} × ${b} = ${a * b}</span></div><div class="gm-dots">${A.MG.dots(a, b, {s:14, r:5})}</div>
      <div class="small-note">${bi('Da vet du også:', '那么你也知道：')}</div>
      <div class="gq-eq"><span>${b} × ${a} =</span> <span class="gq-q" id="gAns">?</span></div>
      <div class="gq-in">${cur.mode === 'choice' ? `<div class="gchoices">${options(b, a).map(o => `<button type="button" class="gchoice" data-v="${o}">${o}</button>`).join('')}</div>` : padHTML()}</div><div id="gFb"></div></div>`;
    sh.host.querySelectorAll('.gchoice').forEach(bt => bt.onclick = () => submit(+bt.dataset.v, bt));
    sh.host.querySelectorAll('.gkey').forEach(bt => bt.onclick = () => key(bt.dataset.k));
    if(speechOn()) A.sayBi(`${a} × ${b} = ${a * b}`, `${a} × ${b} = ${a * b}`);
  }
  function key(k){
    if(locked || !cur) return;
    if(k === 'del') typed = typed.slice(0, -1); else if(k === 'ok'){ if(typed) submit(+typed); return; } else if(typed.length < 3) typed += k;
    const d = sh.host.querySelector('#gDisp'); if(!d) return; d.textContent = typed || (A.settings.lang === 'zh' ? '输入答案' : 'skriv svaret'); d.classList.toggle('empty', !typed);
  }
  function submit(v, bt){
    if(locked || cur.done) return; locked = true; cur.done = true; tried++;
    const {a, b, ans} = cur, ok = v === ans, ansEl = sh.host.querySelector('#gAns');
    ansEl.textContent = ans; ansEl.classList.add(ok ? 'good' : 'bad');
    if(bt) bt.classList.add(ok ? 'good' : 'bad');
    sh.host.querySelectorAll('.gchoice').forEach(x => { x.disabled = true; if(+x.dataset.v === ans) x.classList.add('good'); });
    sh.host.querySelector('.gm-dots').innerHTML = `<div class="row" style="align-items:center;justify-content:center;gap:14px">${A.MG.dots(a, b, {s:12, r:4.5})}<span style="font-size:1.6rem">⟲</span>${A.MG.dots(b, a, {s:12, r:4.5, c1:'#f97316'})}</div>`;
    if(ok){ right++; streak++; } else { streak = 0; wrongs.push([a, b]); }
    sh.setStreak(streak);
    const fb = sh.host.querySelector('#gFb');
    fb.innerHTML = fbar(ok ? 'good' : 'bad', ok ? '✅' : '❌', ok ? bi(`Riktig! ${b} × ${a} = ${a} × ${b} = ${ans}`, `对了！${b} × ${a} = ${a} × ${b} = ${ans}`) : bi(`Snu rutenettet: ${b} × ${a} = ${a} × ${b} = ${ans}`, `把方阵转一下：${b} × ${a} = ${a} × ${b} = ${ans}`), ['Neste ›', '下一题 ›']);
    fb.querySelector('#gNext').onclick = next;
  }
  next();
}

/* =====================================================================
   FREMGANG
   ===================================================================== */
function statsPage(){
  const lv = GS.level, tot = GS.ALL.length, sure = GS.sureCount(GS.ALL);
  let seenN = 0, r = 0, w = 0;
  GS.ALL.forEach(f => { const s = GS.stat(f[0], f[1]); if(s && s.r + s.w){ seenN++; r += s.r; w += s.w; } });
  const worst = GS.ALL.map(f => ({f, s:GS.stat(f[0], f[1])})).filter(x => x.s && x.s.w).sort((p, q) => p.s.b - q.s.b || q.s.w - p.s.w).slice(0, 8);
  const sp = spotStat();
  app.innerHTML = `<div class="gs-stats">${crumb('#/')}<div class="card"><h1 style="margin-top:0">📊 ${bi('Min fremgang', '我的进度')}</h1>
    <div class="sum"><div><b>${sure}/${tot}</b><span>${A.settings.lang === 'zh' ? '已掌握' : 'sikre regnestykker'}</span></div><div><b>${seenN}</b><span>${A.settings.lang === 'zh' ? '已练习' : 'øvd'}</span></div><div><b>${r + w ? pct(r, r + w) + '%' : '–'}</b><span>${A.settings.lang === 'zh' ? '一次答对' : 'rett første gang'}</span></div><div><b>${A.store.get('gs_best', 0)}</b><span>${A.settings.lang === 'zh' ? '最佳速度' : 'beste fartsrunde'}</span></div></div>
    <div class="small-note" style="text-align:left">${bi('Fargen viser hvor sikker du er. Trykk på en rute for å se regelen.', '颜色表示你掌握的程度。点一个格子看规则。')}</div>
    <div class="gx-tbl" id="stTbl">${GS.table({level:lv})}</div>
    <div class="gx-legend"><span class="gl lv-sure"><i></i>${bi('sikker', '已掌握')}</span><span class="gl lv-learning"><i></i>${bi('lærer', '在学')}</span><span class="gl lv-weak"><i></i>${bi('sliter', '困难')}</span><span class="gl lv-new"><i></i>${bi('ikke øvd', '未练习')}</span></div>
    <div id="stRule"></div></div>
    <div class="card"><h2 style="margin-top:0">${bi('Per gruppe', '按分组')}</h2>${GS.GROUPS.map(g => { const n = GS.FACTS[g.id].length, s = GS.sureCount(GS.FACTS[g.id]); return `<a class="gst-bar" href="#/train/${g.id}" style="--c:${g.c};--bg:${g.bg}"><span class="l">${GS.badge(g.id)} ${bi(g.no, g.zh)}</span><span class="b"><i style="width:${pct(s, n)}%"></i></span><span class="n">${s}/${n}</span></a>`; }).join('')}</div>
    ${worst.length ? `<div class="card"><h2 style="margin-top:0">${bi('Sliter mest med', '最有困难的')}</h2><div class="row" style="justify-content:flex-start">${worst.map(x => `<button type="button" class="gfact" data-a="${x.f[0]}" data-b="${x.f[1]}" style="--c:${G[GS.classify(x.f[0], x.f[1]).g].c};--bg:${G[GS.classify(x.f[0], x.f[1]).g].bg}">${x.f[0]} × ${x.f[1]} = ${x.f[0] * x.f[1]} <small>${x.s.w}×${A.settings.lang === 'zh' ? '错' : 'feil'}</small></button>`).join('')}</div></div>` : ''}
    <div class="card"><h2 style="margin-top:0">${bi('Regelspotter', '找规则')}</h2>${GS.GROUPS.map(g => { const s = sp[g.id] || {r:0, w:0}; return `<div class="gst-bar" style="--c:${g.c};--bg:${g.bg}"><span class="l">${GS.badge(g.id)}</span><span class="b"><i style="width:${pct(s.r, s.r + s.w)}%"></i></span><span class="n">${s.r + s.w ? pct(s.r, s.r + s.w) + '%' : '–'}</span></div>`; }).join('')}</div>
    <div style="text-align:center;margin:14px 0"><button class="btn sec" id="stReset" type="button"><span class="bi"><span class="no">Nullstill fremgang</span><span class="zh">重置进度</span></span></button></div></div>`;
  const showRule = (a, b) => { const el = app.querySelector('#stRule'); ruleInto(el, a, b, true); el.insertAdjacentHTML('afterbegin', `<div class="gx-q">${a} × ${b} = ${a * b}</div>`); el.scrollIntoView({behavior:'smooth', block:'nearest'}); };
  app.querySelector('#stTbl').addEventListener('click', e => { const td = e.target.closest('td[data-a]'); if(td) showRule(+td.dataset.a, +td.dataset.b); });
  app.querySelectorAll('.gfact[data-a]').forEach(b => b.onclick = () => showRule(+b.dataset.a, +b.dataset.b));
  app.querySelector('#stReset').onclick = () => { if(confirm('Slette all fremgang? / 删除所有进度？')){ GS.resetStats(); A.store.set('gs_path', {}); A.store.set('gs_spot', {}); A.store.set('gs_best', 0); statsPage(); } };
}

/* =====================================================================
   RUTING
   ===================================================================== */
function route(again){
  if(!again) leave();
  const parts = (location.hash.replace(/^#\/?/, '') || '').split('/');
  const r = parts[0], arg = parts[1];
  window.scrollTo(0, 0);
  A.store.set('last', {s:'gs', href:'gangesystem.html'});
  if(r === 'video') return videoPage(arg);
  if(r === 'train') return setup('train', G[arg] ? arg : 'all');
  if(r === 'cards') return setup('cards', G[arg] ? arg : 'all');
  if(r === 'spot') return setup('spot');
  if(r === 'speed') return setup('speed');
  if(r === 'mirror') return setup('mirror');
  if(r === 'stats') return statsPage();
  home();
}
window.addEventListener('hashchange', () => route());
A.applyLang(); syncPills(); GS.saveSummary(); route();
})();
