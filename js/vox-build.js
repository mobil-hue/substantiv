(function(){
'use strict';
/* Norsk Voksenopplæring – oppgavetyper (moduser), detaljvisning og spørsmålsbyggere. */
const A = window.App, V = A.Vox, {esc, shuffle, pick} = A;
const T = (en, zh) => A.bi(en, zh);
const B = V.Build = {};
const L = (en, zh) => ({en, zh});

/* ---------- små byggeklosser ---------- */
V.speakText = w => w.type === 'p' ? w.nb : V.disp(w);
V.spk = function(text, o){
  o = o || {};
  const t = esc(text);
  return `<button type="button" class="spk${o.big ? ' big' : ''}" data-say="${t}" title="Hør / Listen / 听">🔊</button>` +
         (o.noSlow ? '' : `<button type="button" class="spk slow" data-say="${t}" data-slow="1" title="Sakte / Slowly / 慢速">🐢</button>`);
};
V.spkItem = (w, o) => V.spk(V.speakText(w), o);
const bigWord = w => `<div class="vq-big"><span class="vq-nb">${V.dispHtml(w)}</span>${V.spkItem(w)}</div>`;
const posLine = w => w.type === 'w' ? `<div class="vq-pos">${T(V.POS[w.pos].en, V.POS[w.pos].zh)}</div>` : '';
const listenBlock = (w, hint) => `<div class="vq-listen">${V.spkItem(w, {big:true})}<div class="small-note">${T(hint || 'Listen as many times as you like', '想听几遍都可以')}</div></div>`;
const L_MEAN = w => `<div class="vq-big vq-mean">${V.meanHtml(w)}</div>`;

/* ---------- utvidet forklaring (ord og fraser) ---------- */
function formsHtml(w){
  let html = '';
  const rows = V.formRows(w);
  if(rows.length){
    html += `<table class="vd-forms">${rows.map(r => `<tr><th>${T(r.label[1], r.label[2])}<small>${esc(r.label[0])}</small></th><td>${w.pos === 'v' && r.label[0].startsWith('perfektum') ? 'har ' : ''}${esc(r.value)}</td></tr>`).join('')}</table>`;
  } else if(w.forms.length) html += `<div class="vd-rel"><span class="vd-lab">${T('Related forms', '相关形式')}</span> ${w.forms.map(esc).join(' · ')}</div>`;
  if(w.pos === 'n' && w.g === 'ei') html += `<div class="vd-hint">${T('Feminine nouns can also be used as masculine: «en ' + w.nb + '».', '阴性名词也可以当作阳性使用：«en ' + w.nb + '»。')}</div>`;
  return html;
}
const exampleHtml = w => `<div class="vd-ex"><div class="vd-exnb">${V.exHtml(w)} ${V.spk(w.ex)}</div><div class="vd-extr"><span class="m-en">${esc(w.exEn)}</span><span class="m-zh">${esc(w.exZh)}</span></div></div>`;
const noteBlock = w => w.note && (w.note.en || w.note.zh) ? `<div class="vd-note"><span class="vd-lab">💡</span><div>${V.noteHtml(w.note)}</div></div>` : '';
V.exampleHtml = exampleHtml;
function extraHtml(w){ return (w.type === 'w' ? formsHtml(w) : '') + noteBlock(w); }

V.detailHtml = function(w, o){
  o = o || {};
  if(o.only === 'extra') return extraHtml(w);
  const tags = [];
  if(w.type === 'w'){
    const p = V.POS[w.pos]; tags.push(`<span class="tag">${T(p.en, p.zh)} <i>${esc(p.no)}</i></span>`);
    if(w.rank) tags.push(`<span class="tag rank">#${w.rank}</span>`);
  } else tags.push(`<span class="tag">${{s:T('You say this', '你说'), h:T('You hear this', '你会听到'), b:T('Say or hear', '说或听')}[w.kind] || ''}</span>`);
  w.decks.forEach(id => { const d = V.deckById.get(id); if(d && d.kind !== 'rank') tags.push(`<span class="tag deck">${d.emoji} ${esc(d.no)}</span>`); });
  let html = `<div class="vd"><div class="vd-head"><span class="vd-nb">${w.type === 'p' ? esc(w.nb) : V.dispHtml(w)}</span>${V.spkItem(w)}</div>
    <div class="vd-tags">${tags.join('')}</div><div class="vd-mean">${V.meanHtml(w)}</div>`;
  if(w.type === 'w'){
    html += formsHtml(w);
    if(w.ex) html += exampleHtml(w);
  }
  html += noteBlock(w);
  if(o.progress){
    const s = V.srs.get(w.id), st = V.status(w.id);
    html += `<div class="vd-prog st-${st}">${st === 'new' ? T('Not practised yet', '还没有练习') : T(`Practised ${s.seen}×, ${s.right} correct`, `练习 ${s.seen} 次，答对 ${s.right} 次`)}</div>`;
  }
  return html + '</div>';
};

/* ---------- moduser ---------- */
/* fam: w = ord, p = fraser, wp = begge. input: choice | type | both | build | self | special. lvl: vanskegrad for auto-nivå. */
B.MODES = [
  {k:'card',   fam:'wp', emoji:'🃏', lvl:0, input:'self',    en:'Flashcards', zh:'单词卡', de:'Flip the card and rate yourself', dz:'翻卡片并自我评分'},
  {k:'rec',    fam:'w',  emoji:'👀', lvl:0, input:'choice',  en:'Norwegian → meaning', zh:'挪威语 → 意思', de:'See the word, choose the meaning', dz:'看单词，选意思'},
  {k:'rev',    fam:'w',  emoji:'🔁', lvl:1, input:'both',    en:'Meaning → Norwegian', zh:'意思 → 挪威语', de:'See the meaning, choose or write the word', dz:'看意思，选或写挪威语单词'},
  {k:'lmean',  fam:'w',  emoji:'🎧', lvl:1, input:'choice',  audio:true, en:'Listen → meaning', zh:'听 → 意思', de:'Hear the word, choose the meaning', dz:'听单词，选意思'},
  {k:'match',  fam:'w',  emoji:'🔗', lvl:1, input:'special', en:'Match pairs', zh:'配对', de:'Match 5 words with their meanings', dz:'把 5 个词和意思配对'},
  {k:'lword',  fam:'w',  emoji:'🔊', lvl:2, input:'both',    audio:true, en:'Listen → spelling', zh:'听 → 拼写', de:'Hear the word, choose or write it', dz:'听单词，选或写出来'},
  {k:'cloze',  fam:'w',  emoji:'🧩', lvl:2, input:'both',    en:'Fill in the sentence', zh:'句子填空', de:'Choose or write the missing word form', dz:'选或写缺失的词形'},
  {k:'gender', fam:'w',  emoji:'🚻', lvl:2, input:'choice',  en:'Gender: en / ei / et', zh:'名词性别：en / ei / et', de:'Pick the right article for the noun', dz:'给名词选对冠词'},
  {k:'forms',  fam:'w',  emoji:'🔧', lvl:3, input:'both',    en:'Word forms', zh:'词形变化', de:'Plural, past tense, comparative …', dz:'复数、过去式、比较级……'},
  {k:'phear',  fam:'p',  emoji:'🎧', lvl:0, input:'choice',  audio:true, en:'Listen → meaning', zh:'听 → 意思', de:'Hear the phrase, choose the meaning', dz:'听句子，选意思'},
  {k:'psay',   fam:'p',  emoji:'💬', lvl:1, input:'choice',  en:'What do you say?', zh:'该怎么说？', de:'See the meaning, choose the Norwegian phrase', dz:'看意思，选挪威语句子'},
  {k:'pbuild', fam:'p',  emoji:'🧱', lvl:2, input:'build',   en:'Build the sentence', zh:'拼句子', de:'Put the words in the right order', dz:'把单词排成正确的句子'},
  {k:'pcloze', fam:'p',  emoji:'🧩', lvl:2, input:'both',    en:'Fill in the gap', zh:'句子填空', de:'Choose or write the missing word', dz:'选或写缺失的词'},
  {k:'ptype',  fam:'p',  emoji:'⌨️', lvl:3, input:'type',    en:'Write the sentence', zh:'写句子', de:'See the meaning, write it in Norwegian', dz:'看意思，用挪威语写出来'},
  {k:'pdict',  fam:'p',  emoji:'✍️', lvl:3, input:'type',    audio:true, en:'Dictation', zh:'听写', de:'Hear the phrase, write it', dz:'听句子并写出来'}
];
B.mode = k => B.MODES.find(m => m.k === k);

const STOP = new Set('og i på er det jeg du han hun vi de den et en ei til med av for som at om å ikke har kan vil skal må bli var fra'.split(' '));
function clozeToken(p){
  const toks = p.nb.split(/\s+/).map((t, i) => ({t, i, w:t.replace(/[.,!?;:"“”«»()…]/g, '')}));
  if(toks.length < 3) return null;
  const c = toks.filter(x => x.w.length >= 4 && !STOP.has(x.w.toLowerCase()) && /^\p{L}+$/u.test(x.w));
  return c.length ? pick(c) : null;
}
B.applies = function(m, item){
  if(m.fam === 'w' && item.type !== 'w') return false;
  if(m.fam === 'p' && item.type !== 'p') return false;
  if(m.audio && !(V.prefs.speak && A.Speech.supported)) return false;
  switch(m.k){
    case 'gender': return item.pos === 'n' && !!item.forms[0] && item.forms[0] !== '-' && !/^[A-ZÆØÅ]{2,}/.test(item.nb);   // ikke ord uten entallsform eller forkortelser
    case 'forms': return !!V.FORMS[item.pos] && V.formRows(item).length > 0;
    case 'cloze': return !!item.ex && !!V.findForm(item, item.ex);
    case 'pcloze': return !!clozeToken(item);
    case 'pbuild': { const n = item.nb.split(/\s+/).length; return n >= 3 && n <= 12; }
    case 'match': return true;
    default: return true;
  }
};
B.inputOK = function(m, input){
  if(input === 'mix') return true;
  if(input === 'choice') return m.input !== 'type';
  return ['type', 'both', 'self'].includes(m.input);   // bare skriving
};
B.chooseMode = function(item, cfg){
  const box = V.srs.box(item.id);
  let ms = cfg.modes.map(B.mode).filter(m => m && B.applies(m, item) && B.inputOK(m, cfg.input));
  if(!ms.length) return null;
  if(cfg.auto){
    const lim = Math.max(1, Math.min(3, box));
    const ok = ms.filter(m => m.lvl <= lim);
    if(ok.length) ms = ok;   // bare de enkleste først – men aldri færre valg enn brukeren har gitt
  }
  const wts = ms.map(m => 1 + (cfg.auto && m.lvl === Math.min(3, box) ? 2 : 0));
  let r = Math.random() * wts.reduce((a, b) => a + b, 0);
  for(let i = 0; i < ms.length; i++){ r -= wts[i]; if(r <= 0) return ms[i]; }
  return ms[ms.length - 1];
};
B.inputFor = function(m, cfg, item){
  if(m.input !== 'both') return m.input;
  if(cfg.input === 'choice') return 'choice';
  if(cfg.input === 'type') return 'type';
  if(cfg.auto) return V.srs.box(item.id) >= 3 ? 'type' : 'choice';
  return Math.random() < .5 ? 'choice' : 'type';
};

/* ---------- hjelpere for flervalg ---------- */
// betydningene til et ord som enkeltord (engelsk og kinesisk): to ord med felles betydning er synonymer
function meanTokens(w){
  if(w._mt) return w._mt;
  const out = new Set();
  w.en.split(/[;,]/).forEach(t => { t = V.norm(t).replace(/\(.*?\)/g, '').replace(/^to /, '').trim(); if(t) out.add('e:' + t); });
  w.zh.split(/[；;，,]/).forEach(t => { t = t.replace(/（.*?）|\(.*?\)/g, '').trim(); if(t) out.add('z:' + t); });
  return (w._mt = out);
}
function sharesMeaning(a, b){ const A_ = meanTokens(a), B_ = meanTokens(b); for(const t of A_) if(B_.has(t)) return true; return false; }
B.sharesMeaning = sharesMeaning;
function distract(item, pool, n, o){
  o = o || {};
  const used = new Set([o.key ? o.key(item) : item.id]), out = [];
  const lists = [pool, item.type === 'w' ? V.words : V.phrases];
  for(const list of lists){
    let arr = list.filter(x => x.id !== item.id && x.type === item.type && (item.type !== 'w' || o.anyPos || x.pos === item.pos) && !(o.synonyms && x.type === 'w' && sharesMeaning(x, item)));
    if(o.near) arr = arr.map(x => [x, o.near(x)]).sort((a, b) => a[1] - b[1] || Math.random() - .5).slice(0, 14).map(a => a[0]);
    for(const x of shuffle(arr)){
      const k = o.key ? o.key(x) : x.id;
      if(used.has(k)) continue;
      used.add(k); out.push(x); if(out.length >= n) return out;
    }
  }
  return out;
}
const mkOpts = (right, wrongs, html) => shuffle([{html:html(right), ok:true, item:right}, ...wrongs.map(x => ({html:html(x), ok:false, item:x}))]);
const recKey = x => V.norm(x.en);
const nbKey = x => V.norm(x.nb);

/* ---------- skriftlige svar ---------- */
function typedWord(w){
  return function(val){
    let s = V.strip(val), art = null;
    const m = /^(en|ei|et|å)\s+(.+)$/.exec(s);
    if(m && w.pos !== 'art' && w.pos !== 'part'){ art = m[1]; s = m[2]; }
    const r = V.checkText(s, [w.nb]);
    if(r.res !== 'ok' && r.res !== 'almost') return r;
    if(w.pos === 'n'){
      const fine = art === w.g || (w.g === 'ei' && art === 'en');
      if(art && !fine) return {res:'almost', why:'gender'};
      if(!art && V.prefs.art) return {res:'almost', why:'article', base:r.res};
    }
    return r;
  };
}
const typedPhrase = p => val => V.checkText(val, [p.nb]);
function hintFor(target, level){
  const t = target.replace(/^(en|ei|et|å) /, ''), k = Math.min(level, Math.max(1, t.length - 1));
  return [...t].map((c, i) => i < k || !/\p{L}/u.test(c) ? c : '_').join(' ');
}
B.hintFor = hintFor;

/* ---------- byggere: ord ---------- */
B.rec = function(w, ctx){
  const wrong = distract(w, ctx.pool, 3, {key:recKey, synonyms:true});
  return {mode:'rec', kind:'choice', item:w, cap:3, head:L('What does it mean?', '这是什么意思？'), promptHtml:bigWord(w) + posLine(w), speakOnShow:V.speakText(w),
    options:mkOpts(w, wrong, V.meanHtml), cols:'row', answerHtml:V.meanHtml(w)};
};
B.lmean = function(w, ctx){
  const wrong = distract(w, ctx.pool, 3, {key:recKey, synonyms:true});
  return {mode:'lmean', kind:'choice', item:w, cap:3, head:L('Listen. What does it mean?', '听一听，这是什么意思？'), promptHtml:listenBlock(w), speakOnShow:V.speakText(w), force:true,
    options:mkOpts(w, wrong, V.meanHtml), cols:'row', answerHtml:V.meanHtml(w) + `<div class="vq-aw">${V.dispHtml(w)}</div>`};
};
B.rev = function(w, ctx, input){
  const q = {mode:'rev', item:w, answerHtml:`<div class="vq-aw">${V.dispHtml(w)}</div>`, after:V.speakText(w),
    promptHtml:L_MEAN(w) + posLine(w)};
  if(input === 'type'){
    Object.assign(q, {kind:'type', cap:6, head:L('Write it in Norwegian', '用挪威语写出来'), accept:typedWord(w), target:w.pos === 'n' && V.prefs.art ? V.disp(w) : w.nb});
    q.note = w.pos === 'n' && V.prefs.art ? L('Include en / ei / et.', '请带上冠词 en / ei / et。') : null;
  } else {
    const wrong = distract(w, ctx.pool, 3, {key:nbKey, synonyms:true});
    Object.assign(q, {kind:'choice', cap:3, head:L('Which Norwegian word is this?', '对应的挪威语是哪个？'), options:mkOpts(w, wrong, V.dispHtml), cols:'row'});
  }
  return q;
};
B.lword = function(w, ctx, input){
  const q = {mode:'lword', item:w, force:true, speakOnShow:V.speakText(w), promptHtml:listenBlock(w, 'Listen as many times as you like'), answerHtml:`<div class="vq-aw">${V.dispHtml(w)}</div>${V.meanHtml(w)}`};
  if(input === 'type'){
    Object.assign(q, {kind:'type', cap:6, head:L('Listen and write the word', '听并写出单词'), accept:typedWord(w), target:w.pos === 'n' && V.prefs.art ? V.disp(w) : w.nb});
  } else {
    const wrong = distract(w, ctx.pool, 3, {key:nbKey, near:x => V.lev(V.fold2(x.nb), V.fold2(w.nb))});
    Object.assign(q, {kind:'choice', cap:4, head:L('Listen. Which word do you hear?', '听一听，你听到的是哪个词？'), options:mkOpts(w, wrong, V.dispHtml), cols:'row'});
  }
  return q;
};
B.gender = function(w){
  const opts = ['en', 'ei', 'et'].map(g => ({html:`<span class="art g-${g} big">${g}</span>`, ok:g === w.g, res:(w.g === 'ei' && g === 'en') ? 'almost' : undefined, gender:g}));
  return {mode:'gender', kind:'choice', item:w, facet:'#g', cap:6, head:L('en, ei or et?', 'en、ei 还是 et？'), cols:'row three',
    promptHtml:`<div class="vq-big"><span class="vq-nb">${esc(w.nb)}</span>${V.spk(V.disp(w))}</div><div class="vq-mean sm">${V.meanHtml(w)}</div>`,
    options:opts, answerHtml:`<div class="vq-aw">${V.dispHtml(w)}</div>`, after:V.speakText(w), speakOnShow:null,
    almostMsg:L('Also correct in Bokmål, but the traditional feminine form is «ei ' + w.nb + '».', '在书面挪威语中也对，但传统的阴性形式是 «ei ' + w.nb + '»。')};
};
B.cloze = function(w, ctx, input){
  const f = V.findForm(w, w.ex); if(!f) return null;
  const cap = /^\p{Lu}/u.test(f.text), fix = s => cap ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  const before = esc(w.ex.slice(0, f.start)), after = esc(w.ex.slice(f.end));
  const q = {mode:'cloze', item:w, facet:'', after:w.ex, answerHtml:`<div class="vq-aw">${V.exHtml(w)}</div>`,
    promptHtml:`<div class="vq-sent">${before}<span class="blank">＿＿＿＿</span>${after}</div><div class="vq-extr"><span class="m-en">${esc(w.exEn)}</span><span class="m-zh">${esc(w.exZh)}</span></div>
      <div class="vq-hintword small-note">${T('Word:', '单词：')} <b>${V.dispHtml(w)}</b> — ${V.meanHtml(w)}</div>`};
  if(input === 'type'){
    Object.assign(q, {kind:'type', cap:6, head:L('Write the missing word (any form)', '写出缺失的词（注意词形）'), accept:v => V.checkText(v, [f.text]), target:f.text});
  } else {
    // forkastede alternativer: andre former av samme ord + samme form hos andre ord
    const idx = w.forms.findIndex(x => x.split('/').map(s => s.trim().replace(/^har /, '')).some(s => s.toLowerCase() === f.cand.toLowerCase()));
    const set = new Map(); const add = s => { const k = V.norm(s); if(s && s !== '-' && k !== V.norm(f.text) && !set.has(k)) set.set(k, fix(s)); };
    shuffle(V.formCands(w).filter(x => V.norm(x) !== V.norm(f.text))).slice(0, 2).forEach(add);
    distract(w, ctx.pool, 8, {key:nbKey}).forEach(x => { if(set.size < 3) add(idx >= 0 && x.forms[idx] ? x.forms[idx].split('/')[0].trim().replace(/^har /, '') : x.nb); });
    const opts = shuffle([{html:esc(f.text), ok:true}, ...[...set.values()].slice(0, 3).map(s => ({html:esc(s), ok:false}))]);
    Object.assign(q, {kind:'choice', cap:4, head:L('Choose the word that fits', '选出合适的词'), options:opts, cols:'row'});
  }
  return q;
};
/* bøyning: feil former lages av regler som elever ofte bruker */
function wrongForms(w, rowIdx){
  const n = w.nb, stem = n.replace(/e$/, ''), all = new Set([n, ...w.forms.flatMap(f => f.split('/').map(s => s.trim()))]);
  let c = [];
  if(w.pos === 'n') c = [[n + 'er', n + 'r', n + 'e', n + 'ene', n + 'en'], [n + 'er', n + 'r', n + 'e', n + 'ene', n + 'ar'], [n + 'ene', n + 'a', n + 'er', n + 'ne', n + 'ene']][rowIdx] || [];
  else if(w.pos === 'v') c = [[n + 'r', stem + 'er', stem + 'ar', n], [stem + 'et', stem + 'de', stem + 'te', stem + 'dde', n + 'et'], [stem + 't', stem + 'et', stem + 'dd', stem + 'tt', stem + 'de'], [n, stem, n + 'r', stem + 'er']][rowIdx] || [];
  else if(w.pos === 'adj') c = [[n + 't', n + 'et', n + 'a', n + 'e'], [n + 'e', n + 'er', n + 'ne', n + 'a'], [n + 'ere', n + 'are', n + 'er', 'mer ' + n], [n + 'est', n + 'ast', n + 'ste', 'mest ' + n]][rowIdx] || [];
  return c.filter(x => x && !all.has(x));
}
B.forms = function(w, ctx, input){
  const rows = V.formRows(w); if(!rows.length) return null;
  const labels = V.FORMS[w.pos];
  const r = pick(rows), rowIdx = labels.findIndex(l => l[0] === r.label[0]);
  const answers = r.value.split('/').map(s => s.trim());
  const shown = (w.pos === 'v' && rowIdx === 2 ? 'har ' : '') + answers[0];
  const q = {mode:'forms', item:w, facet:'#f', after:shown, answerHtml:`<div class="vq-aw">${esc(shown)}</div>`,
    promptHtml:`<div class="vq-big"><span class="vq-nb">${V.dispHtml(w)}</span>${V.spkItem(w)}</div><div class="vq-mean sm">${V.meanHtml(w)}</div>
      <div class="vq-ask">${T(r.label[1], r.label[2])} <small>${esc(r.label[0])}</small>?</div>`};
  if(input === 'type'){
    Object.assign(q, {kind:'type', cap:6, head:L('Write the form', '写出这个词形'), accept:v => V.checkText(v.replace(/^har /i, ''), answers), target:answers[0]});
  } else {
    const pool = new Map(); const add = s => { const k = V.norm(s); if(s && s !== '-' && !answers.some(a => V.norm(a) === k) && !pool.has(k)) pool.set(k, s); };
    wrongForms(w, rowIdx).forEach(add);
    rows.forEach(x => x.value.split('/').forEach(s => add(s.trim())));
    const wr = shuffle([...pool.values()]).slice(0, 3);
    if(wr.length < 2) return null;
    Object.assign(q, {kind:'choice', cap:4, head:L('Choose the correct form', '选出正确的词形'), options:shuffle([{html:esc(answers[0]), ok:true}, ...wr.map(s => ({html:esc(s), ok:false}))]), cols:'row'});
  }
  return q;
};
B.match = function(items, ctx){
  if(!Array.isArray(items)){
    const first = items, others = [];
    shuffle(ctx.pool.filter(x => x.type === 'w' && x.id !== first.id)).forEach(x => { if(others.length < 4 && ![first, ...others].some(y => sharesMeaning(x, y))) others.push(x); });
    if(others.length < 2) return null;
    items = [first, ...others];
  }
  const its = items.slice(0, 5);
  return {mode:'match', kind:'match', item:its[0], items:its, cap:3, head:L('Match each word with its meaning', '把每个词和它的意思配起来'),
    left:its.map(w => ({id:w.id, html:V.dispHtml(w), say:V.speakText(w)})), right:shuffle(its.map(w => ({id:w.id, html:V.meanHtml(w)})))};
};
B.card = function(w){
  return {mode:'card', kind:'card', item:w, cap:3, head:L('Do you know this?', '你认识这个词吗？'), speakOnShow:V.speakText(w)};
};
B.intro = function(w){
  return {mode:'intro', kind:'intro', item:w, head:L('New: listen and read', '新内容：听一听，读一读'), speakOnShow:V.speakText(w), force:true};
};

/* ---------- byggere: fraser ---------- */
const sentOpts = (p, wrongs, key) => shuffle([{html:key(p), ok:true}, ...wrongs.map(x => ({html:key(x), ok:false}))]);
B.phear = function(p, ctx){
  const wrong = distract(p, ctx.pool, 3, {key:recKey});
  return {mode:'phear', kind:'choice', item:p, cap:3, head:L('Listen. What does it mean?', '听一听，这是什么意思？'), promptHtml:listenBlock(p, 'You can play it again'), speakOnShow:p.nb, force:true,
    options:sentOpts(p, wrong, V.meanHtml), cols:'col', answerHtml:V.meanHtml(p) + `<div class="vq-aw sm">${esc(p.nb)}</div>`};
};
B.psay = function(p, ctx){
  const wrong = distract(p, ctx.pool, 3, {key:nbKey, near:x => Math.abs(x.nb.length - p.nb.length)});
  return {mode:'psay', kind:'choice', item:p, cap:3, head:L('How do you say this in Norwegian?', '用挪威语怎么说？'), promptHtml:L_MEAN(p),
    options:sentOpts(p, wrong, x => esc(x.nb)), cols:'col', answerHtml:`<div class="vq-aw sm">${esc(p.nb)}</div>`, after:p.nb};
};
B.pbuild = function(p){
  const toks = p.nb.split(/\s+/);
  return {mode:'pbuild', kind:'build', item:p, cap:6, head:L('Put the words in order', '把单词排成正确的句子'), promptHtml:L_MEAN(p), tokens:toks,
    accept:v => V.strip(v) === V.strip(p.nb) ? {res:'ok'} : {res:'bad'}, answerHtml:`<div class="vq-aw sm">${esc(p.nb)}</div>`, after:p.nb};
};
B.ptype = function(p){
  return {mode:'ptype', kind:'type', item:p, cap:6, head:L('Write it in Norwegian', '用挪威语写出来'), promptHtml:L_MEAN(p), accept:typedPhrase(p), target:p.nb,
    answerHtml:`<div class="vq-aw sm">${esc(p.nb)}</div>`, after:p.nb};
};
B.pdict = function(p){
  return {mode:'pdict', kind:'type', item:p, cap:6, head:L('Listen and write the sentence', '听并写出句子'), promptHtml:listenBlock(p, 'You can play it again'), speakOnShow:p.nb, force:true,
    accept:typedPhrase(p), target:p.nb, answerHtml:`<div class="vq-aw sm">${esc(p.nb)}</div>${V.meanHtml(p)}`};
};
B.pcloze = function(p, ctx, input){
  const tk = clozeToken(p); if(!tk) return null;
  const parts = p.nb.split(/\s+/), lead = tk.t.match(/^[^\p{L}]*/u)[0], trail = tk.t.match(/[^\p{L}]*$/u)[0];
  const shown = parts.map((t, i) => i === tk.i ? lead + '<span class="blank">＿＿＿＿</span>' + trail : esc(t)).join(' ');
  const q = {mode:'pcloze', item:p, after:p.nb, promptHtml:`<div class="vq-sent">${shown}</div><div class="vq-extr">${V.meanHtml(p)}</div>`, answerHtml:`<div class="vq-aw sm">${esc(p.nb)}</div>`};
  if(input === 'type'){
    Object.assign(q, {kind:'type', cap:6, head:L('Write the missing word', '写出缺失的词'), accept:v => V.checkText(v, [tk.w]), target:tk.w});
  } else {
    const have = new Set([V.norm(tk.w)]), wr = [];
    shuffle(V.phrases.filter(x => x.id !== p.id)).forEach(x => x.nb.split(/\s+/).map(t => t.replace(/[.,!?;:"“”«»()…]/g, '')).forEach(t => {
      if(wr.length < 3 && t.length >= 3 && /^\p{L}+$/u.test(t) && Math.abs(t.length - tk.w.length) <= 3 && !have.has(V.norm(t))){ have.add(V.norm(t)); wr.push(t); }
    }));
    Object.assign(q, {kind:'choice', cap:4, head:L('Choose the missing word', '选出缺失的词'), options:shuffle([{html:esc(tk.w), ok:true}, ...wr.map(s => ({html:esc(s), ok:false}))]), cols:'row'});
  }
  return q;
};

/* bygger ett spørsmål for et element */
B.make = function(item, cfg, ctx, m0){
  let m = m0 || B.chooseMode(item, cfg), q = null;
  for(let tries = 0; tries < 3 && m; tries++){
    const input = B.inputFor(m, cfg, item);
    q = B[m.k](item, ctx, input);
    if(q) break;
    m = B.chooseMode(item, Object.assign({}, cfg, {modes:cfg.modes.filter(k => k !== m.k)}));
  }
  return q || (item.type === 'w' ? B.rec(item, ctx) : B.psay(item, ctx));
};
})();
