(function(){
'use strict';
/* Matematikk etter kompetansemål: modulregister, oppgavebyggere, fremgang, forside, modulside og øvingsløper.
   En modul = video (forståelse først) + nivåer (trening) + skriftlig forklaring + arbeidsark. */
const A = window.App, {h} = A;
const MT = window.MT = window.MT || {};
MT.mods = []; MT.byId = {}; MT.PASS = {tren:.8, forstaa:.75};
const B = no => A.bi(no, '');                         // norsk tekst (+ støttespråk når ordbok finnes)
MT.B = B;

/* ---------- tilfeldighet (alt som lages bruker en seedet generator r) ---------- */
MT.rng = A.seeded;
MT.int = (r, lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
MT.pick = (r, a) => a[Math.floor(r() * a.length)];
MT.shuf = (r, a) => { a = a.slice(); for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
MT.NAMES = ['Mia', 'Ola', 'Sara', 'Lars', 'Kari', 'Jon', 'Nora', 'Emil', 'Ida', 'Ali'];
MT.THINGS = [['🍎', 'epler', 'eple'], ['⭐', 'stjerner', 'stjerne'], ['🐟', 'fisker', 'fisk'], ['⚽', 'baller', 'ball'], ['🍪', 'kjeks', 'kjeks'], ['🚗', 'biler', 'bil'], ['🌸', 'blomster', 'blomst'], ['🐞', 'marihøner', 'marihøne'], ['📚', 'bøker', 'bok'], ['🍓', 'jordbær', 'jordbær']];

/* ---------- bøyning: 1 tier / 2 tiere, 1 ener / 2 enere, 1 hundrer / 2 hundrere ---------- */
MT.t1 = n => n === 1 ? '1 tier' : n + ' tiere';
MT.e1 = n => n === 1 ? '1 ener' : n + ' enere';
MT.h1 = n => n === 1 ? '1 hundrer' : n + ' hundrere';
MT.te = (t, e) => MT.t1(t) + ' og ' + MT.e1(e);
MT.hte = (h, t, e) => MT.h1(h) + ', ' + MT.t1(t) + ' og ' + MT.e1(e);

/* ---------- scenehjelpere til videoene ---------- */
const S = MT.S = {};
S.sc = (...p) => `<div class="scene">${p.join('')}</div>`;
S.title = (emoji, no, extra) => `<div class="scene"><div class="big-emoji bounce">${emoji}</div><h2 class="up">${B(no)}</h2>${extra || ''}</div>`;
S.pop = (html, d, st) => `<div class="pop" style="--d:${d || 0}s;${st || ''}">${html}</div>`;
S.fade = (html, d, st) => `<div class="fade" style="--d:${d || 0}s;${st || ''}">${html}</div>`;
S.big = (t, d, c) => `<div class="bigword pop" style="--d:${d || 0}s;${c ? 'color:' + c : ''}">${t}</div>`;
S.sub = (t, d) => `<div class="sub pop" style="--d:${d || 0}s">${B(t)}</div>`;
S.row = (...p) => `<div class="row" style="align-items:center">${p.join('')}</div>`;
S.plus = (t, d) => `<span class="pop" style="--d:${d || 0}s;font-size:2.6rem;font-weight:900">${t}</span>`;
S.ex = lines => `<div class="mexpr">${lines.map(l => `<div>${l}</div>`).join('')}</div>`;
S.chip = (t, c, d) => `<span class="chip pop" style="--c:${c || '#2563eb'};--d:${d || 0}s;font-size:1.5rem">${t}</span>`;

/* ---------- oppgavebyggere ---------- */
const plain = s => String(s).replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<table[\s\S]*?<\/table>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\{\?\}/g, ' … ').replace(/\s+/g, ' ').trim();
const Q = MT.Q = {};
Q.num = (stem, ans, o) => Object.assign({type:'num', stem, ans}, o || {});
// flervalg: svaralternativene stokkes med r (ellers rekkefølgen som gitt når o.keep)
Q.choice = (r, stem, ans, opts, o) => {
  o = o || {}; let list = []; const seen = new Set();
  [ans].concat(opts).forEach(x => { const k = String(x); if(!seen.has(k)){ seen.add(k); list.push(x); } });
  if(o.keep && opts.some(x => String(x) === String(ans))) list = opts.filter((x, i, a) => a.findIndex(y => String(y) === String(x)) === i);
  else if(o.sort) list.sort((a, b) => a - b); else list = MT.shuf(r, list);
  return Object.assign({type:'choice', stem, ans, opts:list}, o);
};
Q.yn = (stem, yes, o) => Object.assign({type:'choice', stem, ans:yes ? 'Ja' : 'Nei', opts:['Ja', 'Nei'], yn:true}, o || {});
// flervalg med tall nær svaret
Q.near = (r, stem, ans, o) => {
  const c = [ans - 1, ans + 1, ans - 2, ans + 2, ans + 10, ans - 10, ans + 3, ans - 3].filter(x => x >= 0 && x !== ans), pick = MT.shuf(r, c).slice(0, 3);
  return Q.choice(r, stem, ans, pick, Object.assign({sort:true, nums:true}, o || {}));
};
MT.sayOf = q => q.say != null ? q.say : plain(q.stem);

/* ---------- registeret ---------- */
let ordN = 0;
MT.module = function(d){
  d.ord = d.rek != null ? d.rek : ordN++; d.bygger = d.bygger || []; d.maal = d.maal || [];
  MT.mods.push(d); MT.byId[d.id] = d;
  A.VIDEOS['mt_' + d.id] = {no:d.tittel, zh:'', emoji:d.ikon, board:true, pause:2200, scenes:d.video.map(s => ({html:s.html, no:s.no, zh:''}))};
  return d;
};
MT.opens = id => MT.mods.filter(m => m.bygger.includes(id));

/* ---------- fremgang ---------- */
const getProg = () => A.store.get('mt_prog', {});
const saveProg = p => { A.store.set('mt_prog', p); summary(p); };
const modProg = id => getProg()[id] || {v:0, l:{}};
function summary(p){
  let done = 0, total = 0;
  MT.mods.forEach(m => { total += 1 + m.nivaaer.length; const x = (p || getProg())[m.id]; if(x){ done += x.v ? 1 : 0; m.nivaaer.forEach((l, i) => { if((x.l[i + 1] || 0) >= pass(l)) done++; }); } });
  A.store.set('sum_mt', {done, total});
}
const pass = l => Math.round(100 * (l.kind === 'forstaa' ? MT.PASS.forstaa : MT.PASS.tren));
function markVideo(id){ const p = getProg(); (p[id] = p[id] || {v:0, l:{}}).v = 1; saveProg(p); }
function setScore(id, n, pc){ const p = getProg(); const m = (p[id] = p[id] || {v:0, l:{}}); m.l[n] = Math.max(m.l[n] || 0, pc); saveProg(p); }
function state(m){
  const x = modProg(m.id), n = m.nivaaer.filter((l, i) => (x.l[i + 1] || 0) >= pass(l)).length;
  const any = x.v || Object.keys(x.l).length;
  return {v:x.v, n, total:m.nivaaer.length, st:(x.v && n === m.nivaaer.length) ? 'done' : any ? 'part' : 'new'};
}
MT.state = state;

/* ---------- små byggeklosser ---------- */
const app = document.getElementById('app');
let cleanups = [];
const onLeave = fn => cleanups.push(fn);
function leave(){ A.Video.stop(); A.Speech.stop(); cleanups.forEach(f => { try{ f(); }catch(e){} }); cleanups = []; }
const later = (fn, ms) => { const t = setTimeout(fn, ms); onLeave(() => clearTimeout(t)); return t; };
const speechOn = () => A.speakKey() !== 'off';
const say = t => { if(speechOn()) A.sayBi(t, ''); };
const btn = (id, no, cls) => `<button type="button" class="btn ${cls || ''}" id="${id}">${B(no)}</button>`;
const crumb = (href, no) => `<a class="crumb" href="${href}">← ${B(no || 'Tilbake')}</a>`;
const setOf = code => MT.SETS.find(s => s.maal.some(m => m.k === code));
const aimOf = code => { const s = setOf(code); return s ? s.maal.find(m => m.k === code) : null; };
const trinnTag = m => m.trinn.length > 1 ? `${m.trinn[0]}.–${m.trinn[m.trinn.length - 1]}. trinn` : `${m.trinn[0]}. trinn`;
const COLORS = ['#f97316', '#2563eb', '#16a34a', '#9333ea', '#0d9488', '#db2777', '#ca8a04', '#dc2626'];
const col = m => m.farge || COLORS[(m.ord) % COLORS.length];
const modLink = (m, extra) => { const s = state(m); return `<a class="mt-m ${s.st}" style="--c:${col(m)}" href="#/m/${m.id}"><span class="tr">${trinnTag(m)}</span><span class="ic">${m.ikon}</span><span class="tx"><b>${B(m.tittel)}</b><span class="s">${s.v ? '🎬✓ ' : '🎬 '}${s.n}/${s.total} ${B('nivåer')}</span></span><span class="mk">${s.st === 'done' ? '✅' : s.st === 'part' ? '🟡' : ''}</span></a>`; };

/* =====================================================================
   Skriftlig forklaring (brukes på modulsiden og på arbeidsark)
   ===================================================================== */
/* oversettelse (støttespråk) under en norsk tekst, hvis den finnes i ordboka – ellers ingenting */
const TX = (s, inline) => { if(!A.I18N || A.settings.lang === 'no') return ''; const r = A.trx(s, ''); if(!r.t) return ''; const rtl = A.isRtl(r.l); return `<${inline ? 'span' : 'div'} class="mt-tx${inline ? ' in' : ''}" lang="${r.l}"${rtl ? ' dir="rtl"' : ''}>${rtl ? A.ltrMath(r.t) : r.t}</${inline ? 'span' : 'div'}>`; };
MT.textHTML = (m, o) => {
  o = o || {}; const t = m.tekst || {}; let s = '';
  if(t.mal) s += `<h3>${B('Dette skal du lære')}</h3><p>${t.mal}</p>${TX(t.mal)}`;
  if(t.steg && t.steg.length) s += `<h3>${B('Slik gjør du')}</h3><ol>${t.steg.map(x => `<li>${x}${TX(x)}</li>`).join('')}</ol>`;
  if(t.eks && t.eks.length) s += `<h3>${B('Eksempler')}</h3>${t.eks.map(x => `<div class="ex">${x}${TX(x)}</div>`).join('')}`;
  if(t.ord && t.ord.length) s += `<h3>${B('Ord du må kunne')}</h3><dl>${t.ord.map(x => `<dt>${x[0]}${TX(x[0], true)}</dt><dd>${x[1]}${TX(x[1])}</dd>`).join('')}</dl>`;
  if(t.feil && t.feil.length) s += `<h3>${B('Vanlige feil')}</h3>${t.feil.map(x => `<div class="wrong">${x}${TX(x)}</div>`).join('')}`;
  if(m.refleksjon && !o.noRef) s += `<h3>${B('Tenk og forklar')}</h3><p>${m.refleksjon}</p>${TX(m.refleksjon)}`;
  if(t.laerer && o.teacher !== false) s += `<h3>${B('Til voksne og lærere')}</h3><p>${t.laerer}</p>`;
  return s;
};

/* =====================================================================
   Topp-knapper (som i de andre appene)
   ===================================================================== */
if(document.getElementById('pLang')){
const cycle = (opts, cur) => opts[(opts.findIndex(o => o[0] === cur) + 1) % opts.length][0];
function syncPills(){
  document.getElementById('pLang').textContent = A.LANG_OPTS.find(o => o[0] === A.settings.lang)[1];
  const s = document.getElementById('pSound'); s.textContent = A.SPEAK_OPTS.find(o => o[0] === A.speakKey())[1]; s.classList.toggle('on', A.settings.auto !== false);
  document.querySelectorAll('.optgrp').forEach(g => g.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.k === (g.dataset.g === 'speak' ? A.speakKey() : A.settings.lang))));
}
A.onSettings = syncPills;
document.getElementById('pLang').onclick = () => A.setLangKey(cycle(A.LANG_OPTS, A.settings.lang));
const pSup = document.getElementById('pSup');
pSup.innerHTML = '🌍 <span class="pt">' + A.esc(A.langOf(A.supLang()).name) + '</span>';
pSup.onclick = () => {
  const m = h('div', {class:'modal', html:`<div class="box" style="max-height:90vh;overflow:auto;text-align:left;max-width:460px"><h2 style="margin-top:0">🌍 ${B('Støttespråk')}</h2>
    <div class="small-note" style="text-align:left;margin-bottom:8px">Norsk er hovedspråket. Matematikkdelen er foreløpig bare på norsk; oversettelser til støttespråkene kommer. · The maths section is Norwegian-only for now; translations are coming.</div>
    <div id="lmList" class="lm-list"></div><div style="text-align:center;margin-top:12px"><button class="btn sec" id="lmClose" type="button">✕</button></div></div>`});
  document.body.append(m);
  const list = m.querySelector('#lmList');
  const draw = () => { list.innerHTML = A.LANGS.map(l => { const v = A.Speech.has(l.c); return `<button type="button" class="lm-b ${l.c === A.supLang() ? 'on' : ''}" data-c="${l.c}"><b${l.rtl ? ' dir="rtl"' : ''}>${A.esc(l.name)}</b><span>${A.esc(l.en)}</span><i>${v ? '🔊' : '🔇'}</i></button>`; }).join('');
    list.querySelectorAll('.lm-b').forEach(b => b.onclick = () => { A.settings.sup = b.dataset.c; if(A.settings.lang === 'no') A.settings.lang = 'both'; A.saveSettings(); location.reload(); }); };
  draw(); A.Speech.onVoices(draw);
  m.querySelector('#lmClose').onclick = () => m.remove(); m.addEventListener('click', e => { if(e.target === m) m.remove(); });
};
document.getElementById('pSound').onclick = () => { const k = cycle(A.SPEAK_OPTS, A.speakKey()); A.setSpeakKey(k); if(k !== 'off') A.sayBi('Norsk opplesing', ''); };

}

/* =====================================================================
   FORSIDE: kompetansemål etter trinn
   ===================================================================== */
let view = A.store.get('mt_view', 'maal');
function hub(setId){
  const sets = MT.SETS, cur = sets.find(s => s.id === setId) || sets[0];
  const first = MT.mods.find(m => !state(m).v || state(m).n < state(m).total), sum = A.store.get('sum_mt', {done:0, total:0});
  const root = h('div', {class:'mt-page'});
  const modsOf = s => MT.mods.filter(m => m.maal.some(k => s.maal.some(a => a.k === k)));
  // sett som dekker flere trinn (1.–2. trinn) kan filtreres på ett trinn; modulene har anbefalt trinn i m.trinn
  const grades = cur.id.includes('-') ? cur.id.split('-').map(Number) : null;
  let gsel = A.store.get('mt_grade', 'all'); if(!grades || (gsel !== 'all' && !grades.includes(+gsel))) gsel = 'all';
  const inGrade = m => gsel === 'all' || m.trinn.includes(+gsel);
  root.innerHTML = `<div class="hero" style="background:linear-gradient(135deg,#fb923c,#ea580c)"><div class="big-emoji">🔢</div><div class="grow"><h1>${B('Matematikk')}</h1>
      <div>${B('Etter kompetansemålene i læreplanen (LK20), trinn for trinn. Først forstå – så øve på flere nivåer.')}</div></div>
      ${first ? `<a class="btn big sec" href="#/m/${first.id}" style="text-decoration:none"><div>▶ ${B(sum.done ? 'Fortsett' : 'Start')}</div><div style="font-weight:700;font-size:.9em">${B(first.tittel)}</div></a>` : ''}</div>
    <div class="card" style="margin-top:12px"><div class="small-note" style="text-align:left"><b>${B('Slik er det bygd opp')}</b><br>${B('Hver modul tar for seg ett lite tema. Du ser en video som forklarer grundig, svarer på noen spørsmål for å sjekke at du har forstått, og trener deretter på flere nivåer – fra enkelt til vanskelig. Du kan også skrive ut forklaring og arbeidsark på tre nivåer, med fasit.')}<br><br>${B('Trykk på et ord med prikkete strek for å se hva det betyr på ditt språk.')}</div></div>
    ${window.Gate && !Gate.ok() ? `<div class="mt-note lockbanner">🔒 <b>Oversikten er åpen.</b> For å starte modulene må du ha passord. <a href="#" id="mtAsk">Skriv inn passord</a></div>` : ''}
    <div class="mt-tabs" id="mtTabs"></div>
    ${grades ? `<div class="mt-view" id="mtGrade"><b style="align-self:center">${B('Vis trinn')}:</b>${['all'].concat(grades).map(g => `<button type="button" class="pill ${String(g) === gsel ? 'on' : ''}" data-g="${g}">${g === 'all' ? B('Alle') : g + '. trinn'}</button>`).join('')}</div>` : ''}
    <div class="mt-view"><button type="button" class="pill ${view === 'maal' ? 'on' : ''}" data-v="maal">🎯 ${B('Etter kompetansemål')}</button><button type="button" class="pill ${view === 'rekke' ? 'on' : ''}" data-v="rekke">🧭 ${B('Anbefalt rekkefølge')}</button></div>
    <div id="mtBody"></div>
    <div class="mt-note">${B('Kompetansemålene er hentet fra læreplanen i matematikk (gyldig fra 1. august 2026). Moduler som ikke er laget ennå er merket. Alt innhold er laget med KI og bør leses gjennom av en lærer før det brukes i undervisningen.')}</div>`;
  app.innerHTML = ''; app.append(root);
  const tabs = root.querySelector('#mtTabs');
  sets.forEach(s => { const ms = modsOf(s), d = ms.filter(m => state(m).st === 'done').length;
    tabs.insertAdjacentHTML('beforeend', `<a class="pill ${s.id === cur.id ? 'on' : ''} ${ms.length ? 'has' : ''}" href="#/t/${s.id}" style="text-decoration:none">${s.label}${ms.length ? ` <small>${d}/${ms.length}</small>` : ''}</a>`); });
  root.querySelectorAll('.mt-view .pill[data-v]').forEach(b => b.onclick = () => { view = b.dataset.v; A.store.set('mt_view', view); hub(cur.id); });
  root.querySelectorAll('#mtGrade .pill').forEach(b => b.onclick = () => { A.store.set('mt_grade', b.dataset.g); hub(cur.id); });
  const body = root.querySelector('#mtBody');
  if(view === 'rekke'){
    const all = modsOf(cur).filter(inGrade).sort((a, b) => a.ord - b.ord);
    const leg = [...new Set([].concat(...cur.maal.map(a => MT.LEGACY[a.k] || [])))].map(k => MT.LEGACY_MODS[k]);
    body.innerHTML = `<h2 class="mt-sec">${cur.label}${grades && gsel !== 'all' ? ' · ' + gsel + '. trinn' : ''} <span class="mt-todo">${B('anbefalt rekkefølge')}</span></h2>` + (all.length ? `<div class="mt-note" style="margin-top:0">${B('Rekkefølgen er et forslag. Hver modul sier hva den bygger på – hopp over det du kan fra før.')}</div><div class="mt-path">${all.map((m, i) => { const s = state(m);
      return `<a class="mt-pi ${s.st === 'done' ? 'done' : ''}" href="#/m/${m.id}"><span class="n">${i + 1}</span><span class="ic">${m.ikon}</span><span class="tx"><b>${B(m.tittel)}</b><small>${trinnTag(m)}${m.bygger.length ? ' · ' + B('bygger på') + ' ' + m.bygger.map(b => (MT.byId[b] ? MT.byId[b].tittel : b)).join(', ') : ''}</small></span><span>${s.st === 'done' ? '✅' : s.st === 'part' ? '🟡' : ''}</span></a>`; }).join('')}</div>`
      : `<div class="mt-aim todo"><b>${B('Ingen moduler er laget for dette trinnet ennå.')}</b>${leg.length ? `<div class="mt-leg"><span class="mt-todo">${B('Finnes fra før:')}</span>${leg.map(l => `<a class="pill" href="${l.href}">${l.emoji} ${B(l.no)}</a>`).join('')}</div>` : ''}</div>`);
    body.insertAdjacentHTML('beforeend', legacyHTML());
    return;
  }
  body.innerHTML = `<h2 class="mt-sec">${cur.label} <span class="mt-todo">${cur.maal.length} ${B('kompetansemål')}</span></h2>
    <div class="mt-legend"><div><span class="mt-badge kon">🎯 ${B('Konkret mål')}</span> ${B('Ett eller to moduler er laget direkte for målet. Når du har tatt dem, har du nådd målet.')}</div>
    <div><span class="mt-badge abs">🧩 ${B('Overordnet mål')}</span> ${B('Et stort, abstrakt mål som ikke kan læres i én modul. Det bygges opp gjennom mange moduler – også fra tidligere temaer. Her ser du både de modulene som er laget særskilt for målet, og alle byggesteinene.')}</div></div>`;
  cur.maal.forEach(a => {
    const info = MT.aimInfo(a.k), own = info.own.filter(inGrade), bld = info.build.filter(inGrade), pre = info.bygger.filter(inGrade), leg = (MT.LEGACY[a.k] || []).map(k => MT.LEGACY_MODS[k]);
    const all = own.concat(bld), dn = all.filter(m => state(m).st === 'done').length, abs = info.type === 'abs', anyAll = info.own.length + info.build.length;
    const el = h('div', {class:'mt-aim ' + (abs ? 'abs ' : '') + (all.length ? '' : 'todo'), style:all.length ? `--c:${dn === all.length ? '#16a34a' : abs ? '#7c3aed' : '#f97316'}` : ''});
    const badge = abs ? `<span class="mt-badge abs">🧩 ${B('Overordnet mål')}</span>` : (all.length ? `<span class="mt-badge kon">🎯 ${B('Konkret mål')}</span>` : '');
    el.innerHTML = `<div class="mt-ah">${badge}<span class="km">${a.k}</span><span class="at">${B(a.t)}</span><span class="st">${all.length ? (dn === all.length ? '✅ ' : '') + dn + '/' + all.length + ' ' + B('moduler') : (leg.length ? '' : anyAll ? B('Ingen moduler for dette trinnet') : B('Ikke laget ennå'))}</span></div>` +
      (abs && all.length ? `<div class="mt-abs-note">${B(info.ord)}</div>` : '') +
      (all.length ? `<div class="mt-bar"><i style="width:${Math.round(100 * dn / all.length)}%"></i></div>` : '') +
      (own.length ? `<div class="mt-lab">${abs ? B('Laget særskilt for dette målet') : (own.length > 1 ? B('Modulene for dette målet') : B('Modulen for dette målet'))}</div><div class="mt-mods">${own.map(m => modLink(m)).join('')}</div>` : '') +
      (abs && bld.length ? `<details class="mt-build"><summary>${B('Byggesteiner')} (${bld.length}) – ${B('moduler som bygger opp målet')}</summary><div class="mt-mods">${bld.map(m => modLink(m)).join('')}</div></details>` : '') +
      (!abs && pre.length ? `<div class="mt-lab">${B('Bygger på')}</div><div class="mt-pre">${pre.map(m => `<a class="pill" href="#/m/${m.id}">${m.ikon} ${B(m.tittel)}${state(m).st === 'done' ? ' ✅' : ''}</a>`).join('')}</div>` : '') +
      (leg.length ? `<div class="mt-leg"><span class="mt-todo">${B('Finnes fra før:')}</span>${leg.map(l => `<a class="pill" href="${l.href}">${l.emoji} ${B(l.no)}</a>`).join('')}</div>` : '');
    body.append(el);
  });
  body.insertAdjacentHTML('beforeend', legacyHTML());
}
function legacyHTML(){
  const L = MT.LEGACY_MODS;
  return `<h2 class="mt-sec">${B('Andre matematikkmoduler (fra før)')}</h2><div class="mt-note" style="margin-top:0">${B('Disse ble laget før kompetansemål-menyen og dekker blant annet gange (3. trinn) og geometri (4. trinn).')}</div><div class="mt-mods">${Object.keys(L).map(k => `<a class="mt-m" style="--c:#7c3aed" href="${L[k].href}"><span class="ic">${L[k].emoji}</span><span class="tx"><b>${B(L[k].no)}</b></span></a>`).join('')}</div>`;
}

/* =====================================================================
   MODULSIDE
   ===================================================================== */
function modulePage(id){
  const m = MT.byId[id]; if(!m){ location.hash = '#/'; return; }
  const set = setOf(m.maal[0]), x = modProg(id), c = col(m);
  const rel = ids => ids.map(k => { const q = MT.byId[k]; if(!q) return ''; const s = state(q); return `<a class="${s.st === 'done' ? 'ok' : s.st === 'new' ? '' : ''}" href="#/m/${k}">${q.ikon} ${B(q.tittel)}${s.st === 'done' ? ' ✅' : ''}</a>`; }).join('');
  const op = MT.opens(id).map(q => q.id);
  const mk = (k) => `matte-ark.html#m=${id}&t=${k}`;
  app.innerHTML = `<div class="mt-page">${crumb('#/t/' + (set ? set.id : ''), 'Alle moduler')}
    <h1><span style="font-size:2.2rem">${m.ikon}</span> ${B(m.tittel)}</h1>
    <div class="mt-row"><span class="pill">${trinnTag(m)}</span>${m.maal.map(k => `<span class="pill" title="${A.esc(aimOf(k) ? aimOf(k).t : '')}">${k}</span>`).join('')}</div>
    ${m.maal.map(k => { if(!aimOf(k)) return ''; const inf = MT.aimInfo(k), abs = inf.type === 'abs', own = inf.own.includes(m), n = inf.own.length + inf.build.length;
      return `<div class="mt-goal ${abs ? 'abs' : ''}"><span class="km">${k} · ${abs ? '🧩 ' + B('Overordnet mål') : '🎯 ' + B('Konkret mål')}</span><div><b>${B(aimOf(k).t)}</b></div>` + (abs ? `<div class="mt-abs-note">${own ? B('Denne modulen er laget særskilt for målet.') : B('Denne modulen er én av byggesteinene.')} ${B('Hele målet bygges av ' + n + ' moduler.')} <a href="#/t/${setOf(k).id}">${B('Se alle')}</a></div>` : '') + `</div>`; }).join('')}
    ${Object.keys(MT.ABS).filter(k => !m.maal.includes(k) && (MT.ABS[k].bygg || []).includes(m.id) && aimOf(k)).map(k => { const inf = MT.aimInfo(k); return `<div class="mt-goal abs"><span class="km">${k} · 🧩 ${B('Overordnet mål')} · ${B('denne modulen er en byggestein')}</span><div><b>${B(aimOf(k).t)}</b></div><div class="mt-abs-note">${B('Hele målet bygges av ' + (inf.own.length + inf.build.length) + ' moduler.')} <a href="#/t/${setOf(k).id}">${B('Se alle')}</a></div></div>`; }).join('')}
    ${m.bygger.length ? `<div><b>${B('Bygger på')}:</b></div><div class="mt-rel">${rel(m.bygger)}</div>` : ''}
    ${op.length ? `<div><b>${B('Åpner for')}:</b></div><div class="mt-rel">${rel(op)}</div>` : ''}
    <h2 class="mt-sec">🎬 1. ${B('Forstå først: se videoen')}</h2><div id="mtVid"></div>
    <h2 class="mt-sec">✏️ 2. ${B('Øv på flere nivåer')}</h2><div id="mtLv"></div>
    ${m.drill ? `<h2 class="mt-sec">🏋️ ${B('Mengdetrening: mange oppgaver, rask regning')}</h2><div class="mt-note" style="margin-top:0">${B(m.drill.tittel)}. ${B('Når du har forstått, trenger du mange gjentakelser for å bli rask og sikker.')}</div><div class="mt-row"><a class="btn" href="#/m/${id}/drill" style="text-decoration:none">${B('▶ Mengdetrening på skjermen')}</a><a class="btn sec" href="#/m/${id}/drill/hard" style="text-decoration:none">${B('Utfordring')}</a><a class="btn sec" href="matte-ark.html#m=${id}&t=4" style="text-decoration:none">${B('🖨 Mengdetrening-ark')}</a></div>${(() => { const b = A.store.get('mt_drill', {})[id]; return b ? `<div class="mt-note">${B('Din beste runde: ' + b.best + ' riktige på ' + b.time + ' sekunder')}</div>` : ''; })()}` : ''}
    <h2 class="mt-sec">📖 3. ${B('Les og skriv ut')}</h2>
    <details class="mt-txt" open><summary style="font-weight:900;cursor:pointer">${B('Skriftlig forklaring')}</summary>${MT.textHTML(m, {teacher:false})}</details>
    <div class="mt-row"><a class="btn sec" href="${mk('0')}">${B('📄 Forklaringsark')}</a><a class="btn sec" href="${mk('1')}">${B('📝 Nivå 1')}</a><a class="btn sec" href="${mk('2')}">${B('📝 Nivå 2')}</a><a class="btn sec" href="${mk('3')}">${B('📝 Nivå 3')}</a>${m.drill ? `<a class="btn sec" href="${mk('4')}">${B('📝 Mengdetrening')}</a>` : ''}<a class="btn sec" href="${mk('all')}">${B('🖨️ Alt + fasit')}</a></div>
    ${m.tekst && m.tekst.laerer ? `<details class="mt-txt"><summary style="font-weight:900;cursor:pointer">${B('Til voksne og lærere')}</summary><p>${m.tekst.laerer}</p></details>` : ''}</div>`;
  A.Video.play(app.querySelector('#mtVid'), 'mt_' + id, () => { markVideo(id); modulePage(id); window.scrollTo(0, app.querySelector('#mtLv').offsetTop - 80); });
  const lv = app.querySelector('#mtLv');
  lv.innerHTML = m.nivaaer.map((l, i) => { const sc = modProg(id).l[i + 1], ok = (sc || 0) >= pass(l);
    return `<a class="mt-lv ${ok ? 'done' : ''} ${l.kind === 'forstaa' ? 'forstaa' : ''}" style="--c:${c};text-decoration:none;color:inherit" href="#/m/${id}/niv/${i + 1}"><span class="n">${ok ? '✅' : (l.kind === 'forstaa' ? '💡' : i + 1)}</span><span class="tx"><b>${B(l.t)}</b><small>${B(l.d)}</small></span><span class="sc">${sc != null ? sc + ' %' : ''}</span></a>`; }).join('') +
    `<div class="mt-note">${B('Du består et nivå med minst ' + Math.round(MT.PASS.tren * 100) + ' % riktig. Det går fint å prøve flere ganger.')}</div>`;
}

/* =====================================================================
   ØVINGSLØPER
   ===================================================================== */
function genQuestions(m, li){
  const l = m.nivaaer[li], n = l.n || (l.kind === 'forstaa' ? 6 : 10), r = MT.rng((Math.random() * 1e9) | 0), out = [], seen = new Set();
  for(let i = 0; out.length < n && i < n * 40; i++){
    const q = l.make(r, out.length); if(!q) continue;
    const k = (q.stem + '|' + q.ans).replace(/\s+/g, ''); if(seen.has(k)) continue; seen.add(k); out.push(q);
  }
  return out;
}
MT.gen = genQuestions;
/* ---------- mengdetrening (rene regneoppgaver, mange om gangen) ---------- */
// m.drill = {tittel, layout:'row'|'pic'|'col', cols, n:[ark, skjerm], make:(r, i, hard) => ({t:'7 + 5 =', ans:12, pic?:html, col?:{op,a,b}})}
MT.drillItems = (m, seed, hard, n) => {
  const r = MT.rng(seed * 977 + m.ord * 13 + (hard ? 5 : 0) + 1), out = [], seen = new Set();
  for(let k = 0; out.length < n && k < n * 40; k++){ const it = m.drill.make(r, k, !!hard); if(!it) continue; const key = it.t + '|' + it.ans; if(seen.has(key)) continue; seen.add(key); out.push(it); }
  for(let k = 0; out.length < Math.min(n, 24) && k < n * 40; k++){ const it = m.drill.make(r, k, !!hard); if(it) out.push(it); }   // lite utvalg: tillat gjentakelser
  return out;
};
const padHTML = () => `<div class="gdisp empty" id="gDisp">${B('skriv svaret')}</div><div class="gpad">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button type="button" class="gkey" data-k="${n}">${n}</button>`).join('')}<button type="button" class="gkey del" data-k="del">⌫</button><button type="button" class="gkey" data-k="0">0</button><button type="button" class="gkey ok" data-k="ok">OK</button></div>`;
const fbar = (cls, emoji, msg, next) => `<div class="fbar ${cls}"><span class="em">${emoji}</span><div class="msg">${msg}</div>${next ? btn('gNext', next) : ''}</div>`;
const stemHTML = q => String(q.stem).replace(/\{\?\}/g, '<span class="mtq" id="mtAns">?</span>');

function runLevel(id, li){
  const m = MT.byId[id], l = m && m.nivaaer[li]; if(!l){ location.hash = '#/'; return; }
  const c = col(m), queue = genQuestions(m, li), total = queue.length, wrong = [], results = [];
  const root = h('div', {class:'session mt-sess', html:`<div class="sbar"><button class="x" type="button" title="Avslutt">✕</button><div class="stitle" style="color:${c}">${m.ikon} ${B(l.t)}</div><div class="prog"><i></i></div><div class="streak"></div></div><div class="qhost"></div>`});
  app.innerHTML = ''; app.append(root);
  const host = root.querySelector('.qhost'), prog = root.querySelector('.prog i'), streakEl = root.querySelector('.streak');
  root.querySelector('.x').onclick = () => { location.hash = '#/m/' + id; };
  let i = 0, cur = null, locked = false, typed = '', right1 = 0, streak = 0;
  const keyH = e => { if(!cur || cur.q.type !== 'num' || cur.done) return; if(/^\d$/.test(e.key)) key(e.key); else if(e.key === 'Backspace') key('del'); else if(e.key === 'Enter') key('ok'); };
  document.addEventListener('keydown', keyH); onLeave(() => document.removeEventListener('keydown', keyH));
  const setProg = p => { prog.style.width = Math.max(0, Math.min(100, p * 100)) + '%'; };

  function next(){
    if(i >= queue.length) return finish();
    const q = queue[i++]; cur = {q, done:false, first:true, again:q._again}; locked = false; typed = ''; draw();
  }
  function draw(){
    const q = cur.q;
    const ctl = `<div class="mt-ctl">${q.hint ? `<button type="button" class="btn sec" id="gHint">${B('💡 Hjelp')}</button> ` : ''}<button class="spk" id="gSay" type="button" title="🔊">🔊</button></div>`;
    host.innerHTML = `<div class="qcard" style="--c:${c}"><div class="mt-stem" style="--c:${c}">${stemHTML(q)}</div>
      <div class="mt-in">${q.type === 'choice' ? `<div class="mt-chs ${q.yn ? '' : (q.nums ? 'nums' : (q.opts.some(o => String(o).length > 22) ? 'one' : ''))}">${q.opts.map(o => `<button type="button" class="gchoice" data-v="${A.esc(o)}">${o}</button>`).join('')}</div>` : padHTML()}</div>
      ${ctl}<div id="mtHint"></div><div id="gFb"></div></div>`;
    host.querySelectorAll('.gchoice').forEach(b => b.onclick = () => submit(b.dataset.v, b));
    host.querySelectorAll('.gkey').forEach(b => b.onclick = () => key(b.dataset.k));
    host.querySelector('#gSay').onclick = () => A.sayBi(MT.sayOf(q), '');
    const hb = host.querySelector('#gHint'); if(hb) hb.onclick = () => { host.querySelector('#mtHint').innerHTML = `<div class="mt-hint">${q.hint}</div>`; hb.remove(); cur.hinted = true; };
    if(speechOn()) A.sayBi(MT.sayOf(q), '');
  }
  function key(k){
    if(locked || !cur) return;
    if(k === 'del') typed = typed.slice(0, -1); else if(k === 'ok'){ if(typed) submit(typed); return; } else if(typed.length < 4) typed += k;
    const d = host.querySelector('#gDisp'), a = host.querySelector('#mtAns');
    if(d){ d.textContent = typed || 'skriv svaret'; d.classList.toggle('empty', !typed); }
    if(a) a.textContent = typed || '?';
  }
  function submit(v, btnEl){
    if(locked || !cur || cur.done) return;
    locked = true; cur.done = true; const q = cur.q, ok = String(v) === String(q.ans), fb = host.querySelector('#gFb'), a = host.querySelector('#mtAns');
    if(a){ a.textContent = q.ans; a.classList.add(ok ? 'good' : 'bad'); }
    if(btnEl) btnEl.classList.add(ok ? 'good' : 'bad');
    host.querySelectorAll('.gchoice').forEach(x => { x.disabled = true; if(String(x.dataset.v) === String(q.ans)) x.classList.add('good'); });
    const expl = q.expl ? `<div class="mt-expl" style="margin-top:6px;font-weight:700">${q.expl}</div>` : '';
    if(ok){
      streak++; streakEl.textContent = streak >= 2 ? '🔥 ' + streak : '';
      if(!q._again){ right1++; results.push(1); }
      setProg(i / queue.length);
      if(l.kind === 'forstaa' && q.expl){ fb.innerHTML = fbar('good', '✅', B('Riktig!') + expl, 'Neste ›'); fb.querySelector('#gNext').onclick = next; }
      else { fb.innerHTML = fbar('good', '✅', B('Riktig!') + (q.expl && q.showExpl ? expl : '')); later(next, q.showExpl ? 2200 : 850); }
    } else {
      streak = 0; streakEl.textContent = '';
      if(!q._again){ results.push(0); wrong.push(q); const q2 = Object.assign({}, q, {_again:true}); queue.splice(Math.min(queue.length, i + 2), 0, q2); }
      setProg(i / queue.length);
      fb.innerHTML = fbar('bad', '❌', B('Ikke helt. Riktig svar:') + ' ' + `<b>${q.key != null ? q.key : q.ans}</b>` + expl, 'Neste ›');
      fb.querySelector('#gNext').onclick = next;
      if(speechOn() && q.expl) A.sayBi(plain(q.expl), '');
    }
  }
  function finish(){
    const tr = results.length, pc = tr ? Math.round(100 * right1 / tr) : 0, need = pass(l), ok = pc >= need;
    setScore(id, li + 1, pc); setProg(1);
    const nextL = m.nivaaer[li + 1];
    host.innerHTML = `<div class="end"><div class="big-emoji">${pc >= 90 ? '🏆' : ok ? '🎉' : '💪'}</div><h2>${B(right1 + ' av ' + tr + ' riktige på første forsøk (' + pc + ' %)')}</h2>
      <div>${ok ? `<span class="mt-pass">✅ ${B('Nivået er bestått!')}</span>` : `<span class="mt-fail">${B('Du trenger ' + need + ' % for å bestå. Prøv igjen!')}</span>`}</div>
      ${wrong.length ? `<div class="gs-miss" style="margin-top:12px"><div class="rb-tt">${B('Dette ble feil – les forklaringen:')}</div>${wrong.slice(0, 5).map(q => `<div class="mt-aim todo" style="text-align:left;margin:6px 0"><div class="mt-stem" style="text-align:left;font-size:1.1rem;margin:0">${String(q.stem).replace(/\{\?\}/g, '<b>' + q.ans + '</b>')}</div>${q.expl ? `<div style="font-weight:700">${q.expl}</div>` : ''}</div>`).join('')}</div>` : `<div class="small-note">${B('Ingen feil – flott!')}</div>`}
      <div class="row" style="margin-top:16px;justify-content:center">${btn('eAgain', '↻ Øv igjen')}${ok && nextL ? `<a class="btn" href="#/m/${id}/niv/${li + 2}" style="text-decoration:none">${B('Neste nivå ›')}</a>` : ''}${!ok ? `<a class="btn sec" href="#/m/${id}" style="text-decoration:none">${B('🎬 Se videoen igjen')}</a>` : ''}<a class="btn sec" href="#/m/${id}" style="text-decoration:none">${B('Til modulen')}</a></div></div>`;
    host.querySelector('#eAgain').onclick = () => runLevel(id, li);
    if(speechOn() && ok) A.sayBi('Bra jobbet!', '');
  }
  next();
}

/* =====================================================================
   MENGDETRENING PÅ SKJERMEN: mange rene regneoppgaver på rad, med tid
   ===================================================================== */
function runDrill(id, hard){
  const m = MT.byId[id], d = m && m.drill; if(!d){ location.hash = '#/m/' + id; return; }
  const c = col(m), N = (d.n && d.n[1]) || 30, items = MT.drillItems(m, (Math.random() * 1e6) | 0, hard, N), total = items.length;
  const root = h('div', {class:'session mt-sess', html:`<div class="sbar"><button class="x" type="button" title="Avslutt">✕</button><div class="stitle" style="color:${c}">🏋️ ${B(d.tittel)}${hard ? ' · ' + B('utfordring') : ''}</div><div class="prog"><i></i></div><div class="streak" id="dTimer">0:00</div></div><div class="qhost"></div>`});
  app.innerHTML = ''; app.append(root);
  const host = root.querySelector('.qhost'), prog = root.querySelector('.prog i'), tEl = root.querySelector('#dTimer');
  root.querySelector('.x').onclick = () => { location.hash = '#/m/' + id; };
  let i = 0, typed = '', right = 0, locked = false, cur = null; const wrong = [], t0 = Date.now();
  const tick = setInterval(() => { const s = Math.floor((Date.now() - t0) / 1000); tEl.textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }, 500); onLeave(() => clearInterval(tick));
  const keyH = e => { if(!cur || locked) return; if(/^\d$/.test(e.key)) key(e.key); else if(e.key === 'Backspace') key('del'); else if(e.key === 'Enter') key('ok'); };
  document.addEventListener('keydown', keyH); onLeave(() => document.removeEventListener('keydown', keyH));
  function next(){
    if(i >= total) return finish();
    cur = items[i++]; typed = ''; locked = false; prog.style.width = ((i - 1) / total * 100) + '%';
    host.innerHTML = `<div class="qcard" style="--c:${c}"><div class="mt-stem" style="--c:${c}">${cur.pic ? cur.pic + '<br>' : ''}<span class="big">${cur.col ? G_col(cur.col) : (cur.t.includes('☐') ? cur.t.replace('☐', '{?}') : cur.t + ' {?}')}</span></div><div class="mt-in">${padHTML()}</div><div id="gFb"></div></div>`.replace('{?}', '<span class="mtq" id="mtAns">?</span>');
    host.querySelectorAll('.gkey').forEach(b => b.onclick = () => key(b.dataset.k));
  }
  const G_col = o => MT.G.colMini(o.op, o.a, o.b).replace(/<span class="r bxs">.*<\/span><\/span>$/, '</span>') + '<br><span class="mtq" id="mtAns">?</span>';
  function key(k){
    if(locked) return;
    if(k === 'del') typed = typed.slice(0, -1); else if(k === 'ok'){ if(typed) submit(); return; } else if(typed.length < 4) typed += k;
    const dsp = host.querySelector('#gDisp'), a = host.querySelector('#mtAns'); if(dsp){ dsp.textContent = typed || 'skriv svaret'; dsp.classList.toggle('empty', !typed); } if(a) a.textContent = typed || '?';
  }
  function submit(){
    locked = true; const ok = +typed === cur.ans, a = host.querySelector('#mtAns');
    if(a){ a.textContent = cur.ans; a.classList.add(ok ? 'good' : 'bad'); }
    if(ok){ right++; later(next, 260); } else { wrong.push(cur); host.querySelector('#gFb').innerHTML = fbar('bad', '❌', B('Riktig svar:') + ' ' + '<b>' + cur.ans + '</b>'); later(next, 1300); }
  }
  function finish(){
    clearInterval(tick); const sec = Math.round((Date.now() - t0) / 1000), all = A.store.get('mt_drill', {}), b = all[id];
    const better = !b || right > b.best || (right === b.best && sec < b.time); if(better && !hard){ all[id] = {best:right, time:sec}; A.store.set('mt_drill', all); }
    prog.style.width = '100%';
    host.innerHTML = `<div class="end"><div class="big-emoji">${right >= total * .9 ? '🏆' : right >= total * .7 ? '🎉' : '💪'}</div><h2>${B(right + ' av ' + total + ' riktige på ' + sec + ' sekunder')}</h2>
      ${wrong.length ? `<div class="gs-miss"><div class="rb-tt">${B('Øv mer på disse:')}</div><div class="row">${wrong.slice(0, 12).map(x => `<span class="gfact" style="--c:${c};--bg:#fff">${x.col ? x.col.a + ' ' + x.col.op + ' ' + x.col.b : x.t} ${x.ans}</span>`).join('')}</div></div>` : `<div class="small-note">${B('Ingen feil – flott!')}</div>`}
      <div class="row" style="margin-top:16px;justify-content:center">${btn('eAgain', '↻ Ny runde')}<a class="btn sec" href="#/m/${id}/drill${hard ? '' : '/hard'}" style="text-decoration:none">${B(hard ? 'Vanlig' : 'Utfordring')}</a><a class="btn sec" href="#/m/${id}" style="text-decoration:none">${B('Til modulen')}</a></div></div>`;
    host.querySelector('#eAgain').onclick = () => runDrill(id, hard);
  }
  next();
}

/* =====================================================================
   RUTING
   ===================================================================== */
function route(){
  leave();
  document.querySelectorAll('body > .modal').forEach(x => x.remove());
  const p = (location.hash.replace(/^#\/?/, '') || '').split('/');
  window.scrollTo(0, 0);
  A.store.set('last', {s:'mt', href:'matte.html'});
  if(p[0] === 'm' && window.Gate && !Gate.ok()){
    app.innerHTML = `<div class="mt-page"><div class="card" style="text-align:center;padding:34px 20px"><div style="font-size:3rem">🔒</div><h2>Modulene er låst</h2><p>Du kan se hele oversikten, men må ha passord for å starte modulene.</p><div class="row" style="justify-content:center;gap:10px;margin-top:14px"><button class="btn big" id="mtUnlock" type="button">🔓 Skriv inn passord</button><a class="btn sec" href="#/" style="text-decoration:none">‹ Til oversikten</a></div></div></div>`;
    const ask = () => Gate.ask(route, () => { location.hash = '#/'; });
    document.getElementById('mtUnlock').onclick = ask; ask(); return;
  }
  if(p[0] === 'm' && p[1] && MT.byId[p[1]]){ if(p[2] === 'drill') return runDrill(p[1], p[3] === 'hard'); if(p[2] === 'niv') return runLevel(p[1], Math.max(0, (+p[3] || 1) - 1)); return modulePage(p[1]); }
  if(p[0] === 't') return hub(p[1]);
  hub();
}
document.addEventListener('click', e => { if(e.target && e.target.id === 'mtAsk'){ e.preventDefault(); Gate.ask(route); } });
MT.start = () => { window.addEventListener('hashchange', route); A.applyLang(); if(A.onSettings) A.onSettings(); summary(); route(); };
})();
