(function(){
'use strict';
/* Norsk Voksenopplæring – kjerne: dataleser, repetisjonssystem (SRS), innstillinger, tale og tekstverktøy. */
const A = window.App, V = A.Vox = {}, esc = A.esc;
const CJK = /[㐀-鿿]/;
const MIN = 60000, DAY = 86400000;

/* ---------- ordklasser og bøyningsetiketter ---------- */
V.POS = {
  n:{no:'substantiv', en:'noun', zh:'名词'}, v:{no:'verb', en:'verb', zh:'动词'}, adj:{no:'adjektiv', en:'adjective', zh:'形容词'},
  adv:{no:'adverb', en:'adverb', zh:'副词'}, prep:{no:'preposisjon', en:'preposition', zh:'介词'}, conj:{no:'konjunksjon', en:'conjunction', zh:'连词'},
  pron:{no:'pronomen', en:'pronoun', zh:'代词'}, det:{no:'determinativ', en:'determiner', zh:'限定词'}, num:{no:'tallord', en:'numeral', zh:'数词'},
  intj:{no:'interjeksjon', en:'interjection', zh:'感叹词'}, part:{no:'partikkel', en:'particle', zh:'小品词'}, art:{no:'artikkel', en:'article', zh:'冠词'}
};
V.FORMS = {
  n:[['bestemt entall', 'definite singular', '单数定指'], ['ubestemt flertall', 'indefinite plural', '复数不定指'], ['bestemt flertall', 'definite plural', '复数定指']],
  v:[['presens', 'present', '现在时'], ['preteritum', 'past', '过去时'], ['perfektum partisipp', 'past participle', '过去分词'], ['imperativ', 'imperative', '命令式']],
  adj:[['intetkjønn (-t)', 'neuter (-t)', '中性 (-t)'], ['flertall / bestemt (-e)', 'plural / definite (-e)', '复数 / 定指 (-e)'], ['komparativ', 'comparative', '比较级'], ['superlativ', 'superlative', '最高级']]
};

/* ---------- innlasting av data (VOXRAW) ---------- */
V.words = []; V.phrases = []; V.decks = []; V.byId = new Map(); V.deckById = new Map();
function splitNote(s){
  if(!s) return null;
  const i = s.indexOf('//');
  if(i < 0) return CJK.test(s) ? {en:'', zh:s.trim()} : {en:s.trim(), zh:''};
  return {en:s.slice(0, i).trim(), zh:s.slice(i + 2).trim()};
}
(function load(){
  let rank = 0;
  (window.VOXRAW || []).forEach(block => {
    let cur = null;
    String(block).split('\n').forEach(line => {
      line = line.trim();
      if(!line || line[0] === '#' || line.startsWith('//')) return;
      if(line.startsWith('@deck')){
        const p = line.slice(5).split('|').map(s => s.trim());
        cur = V.deckById.get(p[0]);
        if(!cur){ cur = {id:p[0], emoji:p[1], no:p[2], en:p[3], zh:p[4], kind:p[5], ids:[]}; V.deckById.set(cur.id, cur); V.decks.push(cur); }
        return;
      }
      if(!cur) return;
      const f = line.split('|').map(s => s.trim());
      if(cur.kind === 'phrases'){
        if(f.length < 4) return;
        const id = 'p:' + f[0];
        if(V.byId.has(id)) return;
        const p = {id, type:'p', nb:f[0], en:f[1], zh:f[2], kind:f[3], note:splitNote(f[4]), decks:[cur.id]};
        p.hay = (p.nb + ' ' + p.en + ' ' + p.zh).toLowerCase();
        V.byId.set(id, p); V.phrases.push(p); cur.ids.push(id);
        return;
      }
      if(f.length < 9) return;
      const [nb, pos, g, forms, en, zh, ex, exEn, exZh, note] = f;
      const id = nb + '~' + pos;
      let w = V.byId.get(id);
      if(!w){
        w = {id, type:'w', nb, pos, g, forms:forms ? forms.split(',').map(s => s.trim()) : [], en, zh, ex, exEn, exZh, note:splitNote(note), decks:[], rank:0};
        w.hay = (nb + ' ' + w.forms.join(' ') + ' ' + en + ' ' + zh).toLowerCase();
        V.byId.set(id, w); V.words.push(w);
      }
      if(cur.kind === 'rank' && !w.rank) w.rank = ++rank;
      if(!w.decks.includes(cur.id)) w.decks.push(cur.id);
      if(!cur.ids.includes(id)) cur.ids.push(id);
    });
  });
  const order = {rank:0, words:1, phrases:2};
  V.decks = V.decks.map((d, i) => [d, i]).sort((a, b) => order[a[0].kind] - order[b[0].kind] || a[1] - b[1]).map(x => x[0]);
  V.top = V.words.filter(w => w.rank).sort((a, b) => a.rank - b.rank);
})();

/* ---------- utvalg ("pakker"): topp:1-100, tema-id, setnings-id, words, phrases ---------- */
V.packSize = 50;
V.resolve = function(spec){
  if(spec.startsWith('top:')){ const [a, b] = spec.slice(4).split('-').map(Number); return V.top.filter(w => w.rank >= a && w.rank <= b).map(w => w.id); }
  if(spec === 'words') return V.words.map(w => w.id);
  if(spec === 'phrases') return V.phrases.map(p => p.id);
  if(spec === 'mine') return Object.keys(V.srs.d).filter(k => !k.includes('#') && V.byId.has(k));
  if(spec === 'weak') return V.weakIds();
  const d = V.deckById.get(spec); return d ? d.ids.slice() : [];
};
V.resolveAll = specs => A.uniq([].concat(...specs.map(V.resolve)));
V.specInfo = function(spec){
  if(spec.startsWith('top:')){
    const [a, b] = spec.slice(4).split('-').map(Number);
    if(a === 1 && b === 100) return {emoji:'🔟', no:'Topp 100', en:'Top 100 words', zh:'最常用的 100 个词'};
    if(a === 1) return {emoji:'5️⃣', no:'Topp ' + b, en:'Top ' + b + ' words', zh:'最常用的 ' + b + ' 个词'};
    return {emoji:'🔢', no:`Ord ${a}–${b}`, en:`Words ${a}–${b}`, zh:`第 ${a}–${b} 个词`};
  }
  if(spec === 'words') return {emoji:'📚', no:'Alle ord', en:'All words', zh:'所有单词'};
  if(spec === 'phrases') return {emoji:'💬', no:'Alle setninger', en:'All phrases', zh:'所有句子'};
  if(spec === 'mine') return {emoji:'⭐', no:'Det jeg har øvd på', en:'What I have practised', zh:'我练习过的'};
  if(spec === 'weak') return {emoji:'🎯', no:'Mine vanskelige', en:'My difficult ones', zh:'我的难点'};
  const d = V.deckById.get(spec); return d ? {emoji:d.emoji, no:d.no, en:d.en, zh:d.zh} : {emoji:'❔', no:spec, en:spec, zh:spec};
};
V.topPacks = function(){
  const max = V.top.length, out = [];
  for(let a = 1; a <= max; a += V.packSize) out.push(`top:${a}-${Math.min(max, a + V.packSize - 1)}`);
  return out;
};
V.item = id => V.byId.get(id);
V.count = spec => V.resolve(spec).length;

/* ---------- repetisjon (SRS) ---------- */
/* [boks, forfall, forsøk, riktige, sist]. Boks 0 = ny, 1–2 = lærer, 3–4 = kjent (riktig igjen etter minst én dag), 5–6 = sikker. */
const INTERVAL = [0, 10 * MIN, DAY, 3 * DAY, 7 * DAY, 16 * DAY, 35 * DAY];
V.srs = {
  d:A.store.get('vox_srs', {}),
  save(){ A.store.set('vox_srs', this.d); },
  get(k){ const a = this.d[k]; return a ? {box:a[0], due:a[1], seen:a[2], right:a[3], last:a[4]} : null; },
  box(k){ const a = this.d[k]; return a ? a[0] : 0; },
  touch(k){ if(!this.d[k]){ this.d[k] = [1, Date.now() + INTERVAL[1], 0, 0, Date.now()]; this.save(); } },
  /* res: 'ok' | 'almost' | 'bad'. cap = høyeste boks dette svaret kan gi (gjenkjenning 3, gjenkalling 6). */
  rec(k, res, cap){
    const now = Date.now(), a = this.d[k] || [0, 0, 0, 0, 0], due = a[0] === 0 || now >= a[1];
    a[2]++; a[4] = now;
    if(res === 'ok'){ a[3]++; if(due){ a[0] = Math.max(a[0], Math.min(cap || 3, a[0] + 1), 1); a[1] = now + INTERVAL[a[0]]; } }
    else if(res === 'almost'){ a[0] = Math.max(1, a[0]); if(due) a[1] = now + INTERVAL[1]; }
    else { a[0] = Math.max(1, a[0] - 2); a[1] = now + INTERVAL[1]; }
    this.d[k] = a; this.save();
  },
  reset(prefix){ Object.keys(this.d).forEach(k => { if(!prefix || k.startsWith(prefix)) delete this.d[k]; }); this.save(); }
};
V.status = id => { const b = V.srs.box(id); return b === 0 ? 'new' : b <= 2 ? 'learn' : b <= 4 ? 'known' : 'sure'; };
V.isDue = (id, now) => { const a = V.srs.d[id]; return !!a && a[0] >= 1 && a[1] <= (now || Date.now()); };
V.weakIds = function(){
  return Object.keys(V.srs.d).filter(k => { if(k.includes('#') || !V.byId.has(k)) return false; const a = V.srs.d[k]; return a[2] >= 2 && a[3] / a[2] < 0.65; });
};
V.progress = function(ids){
  const r = {n:ids.length, fresh:0, learn:0, known:0, sure:0, due:0};
  const now = Date.now();
  ids.forEach(id => { const s = V.status(id); r[s === 'new' ? 'fresh' : s]++; if(V.isDue(id, now)) r.due++; });
  r.done = r.known + r.sure;
  return r;
};

/* ---------- daglig statistikk ---------- */
V.daily = {
  d:A.store.get('vox_days', {}),
  key:t => { const d = new Date(t || Date.now()); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); },
  log(res){
    const k = this.key(), a = this.d[k] || [0, 0]; a[0]++; if(res === 'ok') a[1]++; this.d[k] = a;
    const keys = Object.keys(this.d).sort(); while(keys.length > 90) delete this.d[keys.shift()];
    A.store.set('vox_days', this.d);
  },
  today(){ return this.d[this.key()] || [0, 0]; },
  streak(){
    let n = 0, t = Date.now();
    if(!this.d[this.key(t)]) t -= DAY;
    while(this.d[this.key(t)]){ n++; t -= DAY; }
    return n;
  },
  total(){ return Object.values(this.d).reduce((s, a) => s + a[0], 0); }
};

/* ---------- sammendrag til rotmenyen ---------- */
V.saveSummary = function(){
  const g = (key, ids) => { const p = V.progress(ids); A.store.set('sum_' + key, {done:p.done, total:p.n}); };
  g('vox_top100', V.resolve('top:1-100')); g('vox_top500', V.top.map(w => w.id));
  g('vox_words', V.words.filter(w => !w.rank).map(w => w.id)); g('vox_phrases', V.phrases.map(p => p.id));
};

/* ---------- innstillinger ---------- */
V.prefs = Object.assign({mean:'both', speak:true, rate:0.8, slow:0.55, auto:true, art:true, meanSpeak:false}, A.store.get('vox_prefs', {}));
V.savePrefs = () => A.store.set('vox_prefs', V.prefs);
V.applyMean = function(){
  const b = document.body; b.classList.remove('lang-both', 'lang-no', 'lang-zh');
  b.classList.add({both:'lang-both', en:'lang-no', zh:'lang-zh'}[V.prefs.mean] || 'lang-both');
};
V.MEAN_OPTS = [['both', 'English + 中文'], ['en', 'English'], ['zh', '中文']];

/* ---------- visning av ord ---------- */
V.disp = w => w.type === 'p' ? w.nb : (w.pos === 'n' ? w.g + ' ' + w.nb : w.pos === 'v' ? 'å ' + w.nb : w.nb);
V.dispHtml = function(w){
  if(w.type === 'p') return esc(w.nb);
  if(w.pos === 'n') return `<span class="art g-${w.g}">${esc(w.g)}</span>${esc(w.nb)}`;
  if(w.pos === 'v') return `<span class="art g-v">å</span>${esc(w.nb)}`;
  return esc(w.nb);
};
V.meanHtml = w => `<span class="m-en">${esc(w.en)}</span><span class="m-zh">${esc(w.zh)}</span>`;
V.noteText = (n, lang) => n ? ((lang === 'zh' ? n.zh : n.en) || '') : '';
V.noteHtml = n => n ? `${n.en ? `<span class="m-en">${esc(n.en)}</span>` : ''}${n.zh ? `<span class="m-zh">${esc(n.zh)}</span>` : ''}` : '';
V.formRows = function(w){
  const labels = V.FORMS[w.pos];
  if(!labels || !w.forms.length) return [];
  return labels.map((l, i) => ({label:l, value:w.forms[i] || '-', raw:w.forms[i] || ''})).filter(r => r.value && r.value !== '-');
};
// ord (og bøyningsformer) vi leter etter i eksempelsetningen
V.formCands = function(w){
  if(w._cands) return w._cands;
  const set = new Set([w.nb]);
  w.forms.forEach(f => f.split('/').forEach(x => { x = x.trim().replace(/^(har|å) /, ''); if(x && x !== '-') set.add(x); }));
  w._cands = [...set].sort((a, b) => b.length - a.length);
  return w._cands;
};
const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// finn ordet i eksempelsetningen: {start, end, text, cand}
V.findForm = function(w, sentence){
  if(!sentence) return null;
  for(const c of V.formCands(w)){
    const m = new RegExp('(^|[^\\p{L}\\p{N}])(' + reEsc(c) + ')(?![\\p{L}\\p{N}])', 'iu').exec(sentence);
    if(m) return {start:m.index + m[1].length, end:m.index + m[1].length + m[2].length, text:m[2], cand:c};
  }
  return null;
};
V.exHtml = function(w){
  const f = V.findForm(w, w.ex);
  return f ? esc(w.ex.slice(0, f.start)) + '<mark>' + esc(f.text) + '</mark>' + esc(w.ex.slice(f.end)) : esc(w.ex);
};

/* ---------- tekstverktøy ---------- */
V.norm = s => String(s == null ? '' : s).toLowerCase().normalize('NFC').replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim();
V.strip = s => V.norm(s).replace(/[.,!?;:"“”«»()…]/g, '').replace(/\s+/g, ' ').trim();
V.fold1 = s => s.replace(/æ/g, 'ae').replace(/ø/g, 'oe').replace(/å/g, 'aa');
V.fold2 = s => s.replace(/[æä]/g, 'a').replace(/[øö]/g, 'o').replace(/å/g, 'a').replace(/[éèê]/g, 'e');
V.lev = function(a, b){
  if(a === b) return 0;
  const m = a.length, n = b.length; if(!m) return n; if(!n) return m;
  let prev = Array.from({length:n + 1}, (_, i) => i);
  for(let i = 1; i <= m; i++){
    const cur = [i];
    for(let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
};
/* Sammenlign skrevet svar med godkjente svar. Returnerer {res:'ok'|'almost'|'bad'|'empty', why}. */
V.checkText = function(input, targets){
  const a = V.strip(input);
  if(!a) return {res:'empty'};
  let best = {res:'bad'};
  for(const t0 of targets){
    const t = V.strip(t0);
    if(a === t) return {res:'ok'};
    if(V.fold1(a) === V.fold1(t)) return {res:'ok', why:'digraph'};
    if(V.fold2(a) === V.fold2(t)) best = {res:'almost', why:'accent'};
    else if(best.res === 'bad'){
      const tol = t.length >= 30 ? 3 : t.length >= 14 ? 2 : t.length >= 5 ? 1 : 0;
      if(tol && V.lev(V.fold2(a), V.fold2(t)) <= tol) best = {res:'almost', why:'typo'};
    }
  }
  return best;
};

/* ---------- tale ---------- */
V.say = function(text, o){
  o = o || {};
  if(!text || (!V.prefs.speak && !o.force)) return Promise.resolve(false);
  const l = o.l || 'no';
  return A.say([{t:String(text).replace(/\s*\/\s*/g, ', '), l, r:o.slow ? V.prefs.slow : V.prefs.rate}]);
};
V.speechInfo = () => ({supported:A.Speech.supported, voice:A.Speech.has('no'), name:A.Speech.current('no')});

/* ---------- valg av neste ord (smart utvalg) ---------- */
/* ids: kandidater. n: antall. o.smart: forfalt først, så nye (i rekkefølge), så resten. */
V.pick = function(ids, n, o){
  o = o || {};
  if(!ids.length) return [];
  if(!o.smart){ const out = []; while(out.length < n) out.push(...A.shuffle(ids)); return out.slice(0, n); }
  const now = Date.now(), due = [], fresh = [], rest = [];
  ids.forEach(id => { const a = V.srs.d[id]; if(!a || a[0] === 0) fresh.push(id); else if(a[1] <= now) due.push(id); else rest.push(id); });
  due.sort((x, y) => V.srs.d[x][1] - V.srs.d[y][1]);
  const newMax = o.newMax != null ? o.newMax : Math.max(2, Math.ceil(n * 0.4));
  const err = id => { const a = V.srs.d[id]; return a && a[2] ? 1 - a[3] / a[2] : 0; };
  rest.sort((x, y) => (V.srs.d[x][0] - V.srs.d[y][0]) + (err(y) - err(x)) * 2 + (Math.random() - .5));
  const out = [].concat(due.slice(0, n));
  const takeNew = Math.min(newMax, n - out.length, fresh.length);
  out.push(...fresh.slice(0, takeNew));
  if(out.length < n) out.push(...rest.slice(0, n - out.length));
  if(out.length < n) out.push(...fresh.slice(takeNew, takeNew + n - out.length));
  // fyll opp ved å gjenta (små utvalg)
  const all = out.slice();
  while(out.length < n && all.length){ out.push(...A.shuffle(all)); }
  const res = out.slice(0, n);
  // bland litt, men la nye ord komme etter at de første er varmet opp
  return A.shuffle(res);
};

V.saveSummary();
})();
