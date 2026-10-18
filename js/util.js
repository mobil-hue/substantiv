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
A.applyLang = function(){
  const b = document.body;
  b.classList.remove('lang-both','lang-no','lang-zh');
  b.classList.add('lang-'+A.settings.lang);
  b.classList.toggle('no-pinyin', !A.settings.pinyin);
};
A.saveSettings = function(){ A.store.set('settings', A.settings); A.applyLang(); };

// valg som gjelder ett fag (svarmåte: flervalg / skriv inn / tilfeldig, trinn for trinn)
A.subject = window.SUBJECT || 'noun';
const PREF_DEFAULT = {noun:{input:'mix'}, geo:{input:'choice'}, mult:{input:'mix', guide:true}};
A.prefs = Object.assign({input:'mix'}, PREF_DEFAULT[A.subject] || {}, A.store.get('prefs_' + A.subject, {}));
A.savePrefs = function(){ A.store.set('prefs_' + A.subject, A.prefs); };

// valg av tekstspråk og opplesing (brukes i video, innstillinger og menyen)
A.LANG_OPTS = [['both', '🌐 NO + 中文'], ['no', '🇳🇴 Norsk'], ['zh', '🇨🇳 中文']];
A.SPEAK_OPTS = [['no', '🔊 Norsk'], ['zh', '🔊 中文'], ['both', '🔊 Norsk + 中文'], ['off', '🔇 Av']];
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
A.bi = (no, zh, cls) => String(no).trim() === String(zh).trim() ? `<span class="bi ${cls||''}"><span>${A.m(no)}</span></span>` : `<span class="bi ${cls||''}"><span class="no">${A.m(no)}</span><span class="zh">${A.m(zh)}</span></span>`;
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

const VOICE_CANDS = {no:['nb-no','no-no','nn-no','nb','no'], zh:['zh-cn','cmn-hans-cn','zh-tw','zh-hk','zh'], en:['en-gb','en-us','en-au','en']};
const VOICE_PRE = {no:['nb','no','nn'], zh:['zh','cmn'], en:['en']};
const LANG_CODE = {no:'nb-NO', zh:'zh-CN', en:'en-GB'};
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
  if(sp !== 'no' && zh) segs.push(...A.parseSegs(zh, 'zh'));
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
