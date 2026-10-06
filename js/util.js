(function(){
'use strict';
const A = window.App = window.App || {};
const mem = {};

A.store = {
  get(k, d){ try{ const v = localStorage.getItem('sub_'+k); return v==null ? d : JSON.parse(v); }catch(e){ return (k in mem) ? mem[k] : d; } },
  set(k, v){ mem[k] = v; try{ localStorage.setItem('sub_'+k, JSON.stringify(v)); }catch(e){} }
};
A.settings = Object.assign({lang:'both', rate:0.85, pinyin:true, auto:true}, A.store.get('settings', {}));
A.applyLang = function(){
  const b = document.body;
  b.classList.remove('lang-both','lang-no','lang-zh');
  b.classList.add('lang-'+A.settings.lang);
  b.classList.toggle('no-pinyin', !A.settings.pinyin);
};
A.saveSettings = function(){ A.store.set('settings', A.settings); A.applyLang(); };

A.esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
A.shuffle = a => { a = a.slice(); for(let i=a.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; } return a; };
A.pick = a => a[Math.floor(Math.random()*a.length)];
A.sample = (a,n) => A.shuffle(a).slice(0,n);
A.sleep = ms => new Promise(r => setTimeout(r, ms));
A.uniq = a => Array.from(new Set(a));
A.seeded = function(seed){ return function(){ seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed>>>15, 1|seed); t = t + Math.imul(t ^ t>>>7, 61|t) ^ t; return ((t ^ t>>>14)>>>0)/4294967296; }; };

// tospråklig tekst. [x] i en streng = norsk ord (leses med norsk stemme, vises fet)
A.m = s => String(s).replace(/\[([^\]]+)\]/g, '<b class="nw">$1</b>');
A.bi = (no, zh, cls) => `<span class="bi ${cls||''}"><span class="no">${A.m(no)}</span><span class="zh">${A.m(zh)}</span></span>`;
A.ruby = (zh, py) => `<ruby>${zh}<rt>${py}</rt></ruby>`;

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

function findVoice(l){
  const cands = l === 'no' ? ['nb-no','no-no','nn-no','nb','no'] : ['zh-cn','cmn-hans-cn','zh-tw','zh-hk','zh'];
  const norm = v => (v.lang || '').replace('_','-').toLowerCase();
  for(const c of cands){ const v = voices.find(v => norm(v) === c); if(v) return v; }
  const pre = l === 'no' ? ['nb','no','nn'] : ['zh','cmn'];
  for(const c of pre){ const v = voices.find(v => norm(v).startsWith(c)); if(v) return v; }
  return null;
}
function speakOne(text, l){
  return new Promise(res => {
    if(!supported){ setTimeout(res, 500 + text.length*70); return; }
    const u = new SpeechSynthesisUtterance(text);
    const v = findVoice(l);
    if(v){ u.voice = v; u.lang = v.lang; } else u.lang = (l === 'no' ? 'nb-NO' : 'zh-CN');
    u.rate = A.settings.rate;
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
    await speakOne(s.t, s.l);
  }
  return my === token;
};
A.sayNo = text => A.say(A.parseSegs(text, 'no'));
A.sayBi = function(no, zh){
  const L = A.settings.lang, segs = [];
  if(L !== 'zh' && no) segs.push(...A.parseSegs(no, 'no'));
  if(L !== 'no' && zh) segs.push(...A.parseSegs(zh, 'zh'));
  return A.say(segs);
};
})();
