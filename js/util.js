(function(){
'use strict';
const A = window.App = window.App || {};
const mem = {};

A.store = {
  get(k, d){ try{ const v = localStorage.getItem('sub_'+k); return v==null ? d : JSON.parse(v); }catch(e){ return (k in mem) ? mem[k] : d; } },
  set(k, v){ mem[k] = v; try{ localStorage.setItem('sub_'+k, JSON.stringify(v)); }catch(e){} }
};
// lang = hvilken tekst som vises (norsk + kinesisk støtte). speak = hvilket språk som leses opp.
const savedSettings = A.store.get('settings', {});
A.settings = Object.assign({lang:'both', speak:'no', rate:0.85, pinyin:false, auto:true, v:2}, savedSettings);
if(!savedSettings.v){ // eldre lagrede innstillinger: norsk opplesing og uten pinyin som standard
  A.settings.v = 2; A.settings.pinyin = false; A.settings.speak = savedSettings.lang === 'zh' ? 'zh' : 'no';
  A.store.set('settings', A.settings);
}
/* ---------- støttespråk (sider med window.SUPPORT_LANGS = true) ----------
   Norsk er hovedspråk. Eleven velger støttespråk. Alle tekster står som A.bi(norsk, kinesisk);
   for andre språk slås den norske teksten opp i ordboka (A.dict, nøkkel = norsk tekst der tall er byttet med #). */
A.I18N = window.SUPPORT_LANGS === true;
A.LANGS = [
  {c:'zh', name:'中文', en:'Chinese', bcp:'zh-CN', test:'你好！这是语音测试。'},
  {c:'en', name:'English', en:'English', bcp:'en-GB', test:'Hello! This is a test of the voice.'},
  {c:'sv', name:'Svenska', en:'Swedish', bcp:'sv-SE', test:'Hej! Det här är ett test av rösten.'},
  {c:'ar', name:'العربية', en:'Arabic', bcp:'ar-SA', rtl:true, test:'مرحبا! هذا اختبار للصوت.'},
  {c:'es', name:'Español', en:'Spanish', bcp:'es-ES', test:'¡Hola! Esta es una prueba de la voz.'},
  {c:'pl', name:'Polski', en:'Polish', bcp:'pl-PL', test:'Cześć! To jest test głosu.'},
  {c:'uk', name:'Українська', en:'Ukrainian', bcp:'uk-UA', test:'Привіт! Це перевірка голосу.'},
  {c:'th', name:'ไทย', en:'Thai', bcp:'th-TH', test:'สวัสดี! นี่คือการทดสอบเสียง'},
  {c:'tl', name:'Tagalog', en:'Tagalog', bcp:'fil-PH', test:'Kumusta! Ito ay pagsubok ng boses.'},
  {c:'so', name:'Soomaali', en:'Somali', bcp:'so-SO', test:'Salaan! Kani waa tijaabo codka.'}
];
A.langOf = c => A.LANGS.find(l => l.c === c);
if(A.I18N && !A.settings.sup){   // første besøk: velg ut fra nettleserspråket (ellers engelsk)
  const nav = ((navigator.language || 'en').toLowerCase().split('-')[0]), map = {fil:'tl'};
  const c = map[nav] || nav;
  A.settings.sup = A.langOf(c) ? c : 'en'; A.store.set('settings', A.settings);
}
A.supLang = () => A.I18N ? (A.settings.sup || 'zh') : 'zh';
A.isRtl = c => !!(A.langOf(c) && A.langOf(c).rtl);
A.dict = {}; A.KEYS = {};
A.addLang = (c, o) => { A.dict[c] = Object.assign(A.dict[c] || {}, o); };
A.missingKeys = {};
const normKey = s => String(s).replace(/\d+/g, '#');
// {t: tekst, l: språket teksten faktisk er på}. Mangler oversettelsen: engelsk, og til sist ingenting (da vises bare norsk).
A.trx = function(no, zh){
  const L = A.supLang();
  if(window.COLLECT_KEYS) { const c = (A.collected = A.collected || {}); const k = normKey(no); if(!c[k]) c[k] = {zh, ex:String(no)}; }   // verktøy: samler alle tekster
  if(L === 'zh') return {t:zh, l:'zh'};
  const key = normKey(no), id = A.KEYS[key], nums = String(no).match(/\d+/g) || [];
  const fill = t => String(t).replace(/\{(\d+)\}/g, (m, i) => nums[i - 1] != null ? nums[i - 1] : m);
  let t = (A.dict[L] || {})[id];
  if(t != null) return {t:fill(t), l:L};
  A.missingKeys[L + '|' + key] = 1;
  t = (A.dict.en || {})[id];
  if(t != null) return {t:fill(t), l:'en'};
  return {t:'', l:L};
};
A.tr = (no, zh) => A.trx(no, zh).t;
A.ltrMath = t => String(t).replace(/(\d+(?:[ \u00a0]*[×+−÷=][ \u00a0]*\d+)+)/g, '<bdi dir="ltr">$1</bdi>');
// regnestykker i en høyre-til-venstre-tekst må ikke snus
const ltrMath = t => String(t).replace(/(\d+(?:[ \u00a0]*[×+−÷=][ \u00a0]*\d+)+)/g, '<bdi dir="ltr">$1</bdi>');
A.applyLang = function(){
  const b = document.body;
  b.classList.remove('lang-both','lang-no','lang-zh');
  b.classList.add('lang-'+A.settings.lang);
  b.classList.toggle('no-pinyin', !A.settings.pinyin);
};
A.saveSettings = function(){ A.store.set('settings', A.settings); A.applyLang(); };

// valg som gjelder ett fag (svarmåte: flervalg / skriv inn / tilfeldig, trinn for trinn)
A.subject = window.SUBJECT || 'noun';
A.course = window.COURSE || 'full';                       // 'basic' = grunnkurs
A.subjKey = A.subject + (A.course === 'basic' ? '_b' : '');
const PREF_DEFAULT = {noun:{input:'mix'}, geo:{input:'choice'}, mult:{input:'mix', guide:true}, adj:{input:'mix'}};
A.prefs = Object.assign({input:'mix'}, PREF_DEFAULT[A.subject] || {}, A.course === 'basic' ? {input:'choice'} : {}, A.store.get('prefs_' + A.subjKey, {}));
A.savePrefs = function(){ A.store.set('prefs_' + A.subjKey, A.prefs); };

// valg av tekstspråk og opplesing (brukes i video, innstillinger og menyen)
A.LANG_OPTS = [['both', '🌐 NO + 中文'], ['no', '🇳🇴 Norsk'], ['zh', '🇨🇳 中文']];
A.SPEAK_OPTS = [['no', '🔊 Norsk'], ['zh', '🔊 中文'], ['both', '🔊 Norsk + 中文'], ['off', '🔇 Av']];
A.relabelOpts = function(){
  if(!A.I18N) return;
  const n = (A.langOf(A.supLang()) || {}).name || '中文';
  A.LANG_OPTS[0][1] = '🌐 NO + ' + n; A.LANG_OPTS[2][1] = '🌐 ' + n;
  A.SPEAK_OPTS[1][1] = '🔊 ' + n; A.SPEAK_OPTS[2][1] = '🔊 Norsk + ' + n;
};
A.relabelOpts();
A.speakKey = () => A.settings.auto === false ? 'off' : (A.settings.speak || 'no');
A.setSpeakKey = function(k){
  if(k === 'off'){ A.settings.auto = false; if(A.Speech) A.Speech.stop(); } else { A.settings.auto = true; A.settings.speak = k; }
  A.saveSettings(); if(A.onSettings) A.onSettings();
};
A.setLangKey = function(k){ A.settings.lang = k; A.saveSettings(); if(A.onSettings) A.onSettings(); };
A.optGroup = function(kind){
  const opts = kind === 'speak' ? A.SPEAK_OPTS : A.LANG_OPTS, cur = kind === 'speak' ? A.speakKey() : A.settings.lang;
  return `<span class="optgrp" data-g="${kind}">${opts.map(o => `<button type="button" class="pill ${o[0] === cur ? 'on' : ''}" data-k="${o[0]}">${o[1]}</button>`).join('')}</span>`;
};
A.bindOptGroups = function(root, after){
  root.querySelectorAll('.optgrp').forEach(g => g.querySelectorAll('button').forEach(b => { b.onclick = e => {
    e.stopPropagation();
    const kind = g.dataset.g, k = b.dataset.k;
    if(kind === 'speak') A.setSpeakKey(k); else A.setLangKey(k);
    root.querySelectorAll(`.optgrp[data-g="${kind}"] button`).forEach(x => x.classList.toggle('on', x.dataset.k === k));
    if(after) after(kind, k);
  }; }));
};

A.esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
A.shuffle = a => { a = a.slice(); for(let i=a.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; } return a; };
A.pick = a => a[Math.floor(Math.random()*a.length)];
A.sample = (a,n) => A.shuffle(a).slice(0,n);
A.sleep = ms => new Promise(r => setTimeout(r, ms));
A.uniq = a => Array.from(new Set(a));
A.seeded = function(seed){ return function(){ seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed>>>15, 1|seed); t = t + Math.imul(t ^ t>>>7, 61|t) ^ t; return ((t ^ t>>>14)>>>0)/4294967296; }; };

// tospråklig tekst. [x] i en streng = norsk ord (leses med norsk stemme, vises fet)
A.m = s => String(s).replace(/\[([^\]]+)\]/g, '<b class="nw">$1</b>');
A.bi = (no, zh, cls) => {
  let attr = '';
  if(A.I18N){ const r = A.trx(no, zh); zh = r.t; if(r.l !== 'zh'){ attr = ` lang="${r.l}"` + (A.isRtl(r.l) ? ' dir="rtl"' : ''); if(A.isRtl(r.l)) zh = ltrMath(zh); } }
  return !zh || String(no).trim() === String(zh).trim() ? `<span class="bi ${cls||''}"><span>${A.m(no)}</span></span>` : `<span class="bi ${cls||''}"><span class="no">${A.m(no)}</span><span class="zh"${attr}>${A.m(zh)}</span></span>`;
};
A.ruby = (zh, py) => py ? `<ruby>${zh}<rt>${py}</rt></ruby>` : zh;

A.h = function(tag, props, ...kids){
  const el = document.createElement(tag);
  for(const k in (props||{})){
    const v = props[k];
    if(k === 'class') el.className = v;
    else if(k === 'html') el.innerHTML = v;
    else if(k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v);
  }
  for(const c of kids.flat()) if(c != null) el.append(c.nodeType ? c : document.createTextNode(c));
  return el;
};

/* ---------- tale ---------- */
const supported = 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
let voices = [];
let token = 0;
function loadVoices(){ try{ voices = speechSynthesis.getVoices() || []; }catch(e){ voices = []; } }
if(supported){ loadVoices(); try{ speechSynthesis.onvoiceschanged = loadVoices; }catch(e){} }

const VOICE_CANDS = {no:['nb-no','no-no','nn-no','nb','no'], zh:['zh-cn','cmn-hans-cn','zh-tw','zh-hk','zh'], en:['en-gb','en-us','en-au','en'],
  sv:['sv-se','sv-fi','sv'], ar:['ar-sa','ar-eg','ar-ae','ar'], es:['es-es','es-mx','es-us','es'], pl:['pl-pl','pl'], uk:['uk-ua','uk'], th:['th-th','th'], tl:['fil-ph','tl-ph','fil','tl'], so:['so-so','so']};
const VOICE_PRE = {no:['nb','no','nn'], zh:['zh','cmn'], en:['en'], sv:['sv'], ar:['ar'], es:['es'], pl:['pl'], uk:['uk'], th:['th'], tl:['fil','tl'], so:['so']};
const LANG_CODE = {no:'nb-NO', zh:'zh-CN', en:'en-GB', sv:'sv-SE', ar:'ar-SA', es:'es-ES', pl:'pl-PL', uk:'uk-UA', th:'th-TH', tl:'fil-PH', so:'so-SO'};
const vnorm = v => (v.lang || '').replace('_','-').toLowerCase();
function findVoice(l){
  const pref = (A.settings.voice || {})[l];   // stemme valgt av brukeren (navn)
  if(pref){ const pv = voices.find(v => v.name === pref); if(pv) return pv; }
  for(const c of (VOICE_CANDS[l] || VOICE_CANDS.zh)){ const v = voices.find(v => vnorm(v) === c); if(v) return v; }
  for(const c of (VOICE_PRE[l] || VOICE_PRE.zh)){ const v = voices.find(v => vnorm(v).startsWith(c)); if(v) return v; }
  return null;
}
function speakOne(text, l, rate){
  if(A.spokenMath) text = A.spokenMath(text, l);
  return new Promise(res => {
    if(!supported){ setTimeout(res, 500 + text.length*70); return; }
    const u = new SpeechSynthesisUtterance(text);
    const v = findVoice(l);
    if(v){ u.voice = v; u.lang = v.lang; } else u.lang = LANG_CODE[l] || 'zh-CN';
    u.rate = rate || A.settings.rate;
    let done = false, t;
    const fin = () => { if(done) return; done = true; clearTimeout(t); res(); };
    u.onend = fin; u.onerror = fin;
    t = setTimeout(fin, 3000 + text.length*250);
    try{ speechSynthesis.speak(u); }catch(e){ fin(); }
  });
}
A.Speech = {
  supported,
  has: l => !!findVoice(l),
  // alle stemmer for et språk (no / zh / en), og valgt stemme
  voices: l => voices.filter(v => (VOICE_PRE[l] || []).some(p => vnorm(v).startsWith(p))).map(v => ({name:v.name, lang:v.lang, local:!!v.localService})),
  current: l => { const v = findVoice(l); return v ? v.name : ''; },
  choose(l, name){ A.settings.voice = Object.assign({}, A.settings.voice || {}, {[l]: name || ''}); if(!name) delete A.settings.voice[l]; A.store.set('settings', A.settings); },
  onVoices(cb){ if(supported){ const prev = speechSynthesis.onvoiceschanged; try{ speechSynthesis.onvoiceschanged = () => { loadVoices(); if(prev) try{ prev(); }catch(e){} cb(); }; }catch(e){} } },
  stop(){ token++; if(supported){ try{ speechSynthesis.cancel(); }catch(e){} } }
};
// stemmevalg (felles for alle fag): velg blant stemmene som finnes på enheten. Lagres globalt i innstillingene.
A.voicePicker = function(host){
  const sup = A.supLang(), supInfo = A.langOf(sup) || {};
  const LBL = {no:['🇳🇴 Norsk stemme', '挪威语语音', 'Norwegian']};
  const TEST = {no:['Hei! Dette er en test av stemmen. En stor hund, et stort hus.', 'no']};
  if(sup === 'zh'){ LBL.zh = ['🇨🇳 Kinesisk stemme', '中文语音', 'Chinese']; TEST.zh = ['你好！这是语音测试。', 'zh']; }
  else { LBL[sup] = ['🔊 ' + supInfo.name + ' – ' + (supInfo.en || sup), supInfo.name, supInfo.en]; TEST[sup] = [supInfo.test || 'Hello', sup]; }
  function draw(){
    const pick = A.settings.voice || {};
    host.innerHTML = Object.keys(LBL).map(l => {
      const vs = A.Speech.voices(l), cur = A.Speech.current(l);
      return `<div class="vp-row" style="margin:8px 0"><b>${A.bi(LBL[l][0], LBL[l][1])}</b>
        ${vs.length ? `<select class="ans sel vp-sel" data-l="${l}" style="font-size:1rem;max-width:100%"><option value="">Automatisk / 自动</option>${vs.map(v => `<option value="${A.esc(v.name)}"${pick[l] === v.name ? ' selected' : ''}>${A.esc(v.name)} (${A.esc(v.lang)}${v.local ? '' : ', online'})</option>`).join('')}</select>
          <div class="small-note" style="text-align:left">${A.bi('Bruker nå: ' + (cur || '—'), '当前使用：' + (cur || '—'))}</div>`
        : `<div class="small-note" style="text-align:left">⚠️ ${A.Speech.supported ? A.bi('Ingen stemme funnet på denne enheten.', '这台设备上没有找到语音。') : A.bi('Nettleseren kan ikke lese opp.', '此浏览器不支持朗读。')}</div>`}
        <button type="button" class="btn sec vp-test" data-l="${l}"><span class="bi"><span class="no">🔊 Test</span><span class="zh">试听</span></span></button></div>`;
    }).join('');
    host.querySelectorAll('.vp-sel').forEach(sel => sel.onchange = () => { A.Speech.choose(sel.dataset.l, sel.value); draw(); A.say(A.parseSegs(TEST[sel.dataset.l][0], TEST[sel.dataset.l][1])); });
    host.querySelectorAll('.vp-test').forEach(b => b.onclick = () => A.say(A.parseSegs(TEST[b.dataset.l][0], TEST[b.dataset.l][1])));
  }
  draw(); A.Speech.onVoices(draw);
};
A.parseSegs = function(str, base){
  const out = []; const re = /\[([^\]]+)\]/g; let last = 0, m;
  while((m = re.exec(str))){
    if(m.index > last) out.push({t:str.slice(last, m.index), l:base});
    out.push({t:m[1], l:'no'}); last = re.lastIndex;
  }
  if(last < str.length) out.push({t:str.slice(last), l:base});
  return out.map(s => ({t:s.t.replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/[「」]/g,''), l:s.l})).filter(s => /[\p{L}\p{N}]/u.test(s.t));
};
A.say = async function(segs){
  const my = ++token;
  if(supported){ try{ speechSynthesis.cancel(); }catch(e){} await A.sleep(40); }
  for(const s of segs){
    if(my !== token) return false;
    await speakOne(s.t, s.l, s.r);
  }
  return my === token;
};
A.sayNo = text => A.say(A.parseSegs(text, 'no'));
// sayBi: leser opp på språket eleven har valgt (norsk, kinesisk eller begge)
A.sayBi = function(no, zh){
  const sp = A.settings.speak || 'no', segs = [];
  if(sp !== 'zh' && no) segs.push(...A.parseSegs(no, 'no'));
  if(sp !== 'no' && zh){
    let l = 'zh';
    if(A.I18N){ const r = A.trx(no, zh); zh = r.t; l = r.l; }
    if(zh) segs.push(...A.parseSegs(zh, l));
  }
  return A.say(segs);
};
// begrep: det norske ordet leses alltid på norsk, forklaringen på valgt språk
A.sayTerm = function(t){
  const sp = A.settings.speak || 'no', segs = A.parseSegs(t.no, 'no');
  if(sp !== 'zh') segs.push(...A.parseSegs(t.defNo, 'no'));
  if(sp !== 'no') segs.push(...A.parseSegs(t.defZh, 'zh'));
  return A.say(segs);
};
})();
