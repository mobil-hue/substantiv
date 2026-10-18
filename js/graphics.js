(function(){
'use strict';
const A = window.App;

// små ikoner for de fire formene: 1 prikk / 1 prikk med ring / 3 prikker / 3 prikker med ring
A.formIcon = function(key, w){
  const f = A.formMeta(key), c = f.color, W = w || 46;
  const dot = (x) => `<circle cx="${x}" cy="20" r="6" fill="${c}"/>`;
  const ring1 = key === 'be' ? `<circle cx="30" cy="20" r="14" fill="none" stroke="${c}" stroke-width="3"/>` : '';
  const ring3 = key === 'bf' ? `<rect x="5" y="4" width="50" height="32" rx="16" fill="none" stroke="${c}" stroke-width="3"/>` : '';
  const dots = (key === 'ue' || key === 'be') ? dot(30) : dot(16) + dot(30) + dot(44);
  return `<svg viewBox="0 0 60 40" width="${W}" height="${W*2/3}" aria-hidden="true">${ring1}${ring3}${dots}</svg>`;
};
A.formChip = function(key, small){
  const f = A.formMeta(key);
  return `<span class="chip" style="--c:${f.color}">${A.formIcon(key, small ? 30 : 40)}<span>${f.no}</span></span>`;
};
A.formHead = function(key){
  const f = A.formMeta(key);
  return `<span class="thead" style="--c:${f.color}">${A.formIcon(key, 40)}<span>${f.no}</span><span class="zh">${f.zh}</span></span>`;
};

A.artChip = art => `<span class="art g-${art}">${art}</span>`;

A.endSplit = function(base, form){
  let i = 0; while(i < base.length && i < form.length && base[i] === form[i]) i++;
  return [form.slice(0, i), form.slice(i)];
};
// ord med uthevet ending. ue: artikkel + ord
A.wordHTML = function(w, key){
  if(key === 'ue') return `${A.artChip(w.art)}<span>${w.no}</span>`;
  const f = A.formMeta(key);
  const [stem, end] = A.endSplit(w.no, w[key]);
  return `<span>${stem}</span><span class="endg" style="color:${f.color}">${end}</span>`;
};

// grafikk for én form
A.fv = function(w, key, small, notag){
  const f = A.formMeta(key);
  const n = (key === 'uf' || key === 'bf') ? 3 : 1;
  const emos = Array.from({length:n}, () => `<span>${w.emoji}</span>`).join('');
  return `<div class="fv fv-${key} ${small ? 's' : ''}" style="--c:${f.color}">
    <div class="fv-stage"><div class="emos">${emos}</div></div>
    ${notag ? '' : `<div class="tag">${A.bi(f.tagNo, f.tagZh)}</div>`}</div>`;
};
// ord + grafikk
A.fvWord = function(w, key){
  return `<div style="text-align:center">${A.fv(w, key)}<div class="bigword sm">${A.wordHTML(w, key)}</div></div>`;
};

A.suffixed = function(w, end){
  if(w.endsWith('e')){
    if(end === 'en') return w + 'n';
    if(end === 'et') return w + 't';
    if(end === 'a') return w.slice(0, -1) + 'a';
  }
  return w + end;
};

/* ---------- tegninger til begrepskortene (t.art med tekst, t.artPlain uten) ---------- */
const Wd = n => A.WORDS.find(w => w.no === n);
const aRow = (...a) => `<div class="artrow">${a.join('')}</div>`;
const aCap = (c, no, zh) => c ? `<div class="artcap">${A.bi(no, zh)}</div>` : '';
const aCard = (emoji, word, color) => `<span class="artcard" style="--c:${color || '#94a3b8'}"><div class="artemo">${emoji}</div><div class="artword">${word}</div></span>`;
const gCard = (name) => { const w = Wd(name); return aCard(w.emoji, A.artChip(w.art) + w.no, A.GEN[w.art].color); };
const NOUN_ART = {
  substantiv:c => aRow(aCard('👧', 'jente', '#2563eb'), aCard('🐶', 'hund', '#16a34a'), aCard('🚗', 'bil', '#d97706'), aCard('🏫', 'skole', '#9333ea')) + aCap(c, 'person · dyr · ting · sted', '人 · 动物 · 东西 · 地方'),
  verb:c => aRow(aCard('🏃', 'løpe', '#0ea5e9'), aCard('🍽️', 'spise', '#0ea5e9'), aCard('😴', 'sove', '#0ea5e9')) + aCap(c, 'noe du gjør', '做的事'),
  adjektiv:c => aRow(aCard('🐘', 'stor', '#22c55e'), aCard('🍎', 'rød', '#22c55e'), aCard('😊', 'glad', '#22c55e')) + aCap(c, 'sier hvordan noe er', '说明事物怎么样'),
  egennavn:c => aRow(aCard('🧑', 'Ola', '#e11d48'), aCard('🐕', 'Pelle', '#e11d48'), aCard('🏙️', 'Oslo', '#e11d48'), aCard('🌍', 'Norge', '#e11d48')) + aCap(c, 'STOR bokstav!', '大写字母！'),
  stor:c => aRow(`<span class="artword" style="font-size:2.8rem;letter-spacing:8px;color:#e11d48">A B C</span>`) + aCap(c, 'Ola · Oslo · Jeg', '专有名词和句子开头要大写'),
  liten:c => aRow(`<span class="artword" style="font-size:2.8rem;letter-spacing:8px;color:#e11d48">a b c</span>`) + aCap(c, 'hund · skole · mandag', '普通名词用小写'),
  artikkel:c => aRow(aCard('🐶', A.artChip('en') + 'hund', A.GEN.en.color), aCard('👧', A.artChip('ei') + 'jente', A.GEN.ei.color), aCard('🏠', A.artChip('et') + 'hus', A.GEN.et.color)) + aCap(c, 'en · ei · et', '名词前面的小词'),
  'en-ord':c => aRow(gCard('hund'), gCard('bil'), gCard('stol')) + aCap(c, 'blå en', '蓝色的 en'),
  'ei-ord':c => aRow(gCard('jente'), gCard('bok'), gCard('dør')) + aCap(c, 'rosa ei', '粉色的 ei'),
  'et-ord':c => aRow(gCard('hus'), gCard('eple'), gCard('barn')) + aCap(c, 'grønn et', '绿色的 et'),
  entall:c => aRow(A.fv(Wd('bil'), 'ue', false, true), `<span class="artword" style="font-size:2.6rem">= 1</span>`) + aCap(c, 'bare én', '只有一个'),
  flertall:c => aRow(A.fv(Wd('bil'), 'uf', false, true), `<span class="artword" style="font-size:2.6rem">= 3</span>`) + aCap(c, 'mange', '很多个'),
  ubestemt:c => aRow(`<span class="artemo">😋</span>`, `<span class="bubble">Jeg vil ha en hund</span>`, `<span class="artemo">🐶🐕🐩</span>`) + aCap(c, 'vi vet ikke hvilken', '不知道是哪一个'),
  bestemt:c => aRow(`<span class="artemo">👉</span>`, aCard('🐕', 'Hunden er søt', A.formMeta('be').color)) + aCap(c, 'vi vet hvilken', '知道是哪一个'),
  ue:c => aRow(A.fv(Wd('bil'), 'ue', false, true), `<span class="artword">${A.wordHTML(Wd('bil'), 'ue')}</span>`) + aCap(c, 'én, vi vet ikke hvilken', '一个，不知道是哪一个'),
  be:c => aRow(A.fv(Wd('bil'), 'be', false, true), `<span class="artword">${A.wordHTML(Wd('bil'), 'be')}</span>`) + aCap(c, 'den ene vi vet om', '我们知道的那一个'),
  uf:c => aRow(A.fv(Wd('bil'), 'uf', false, true), `<span class="artword">${A.wordHTML(Wd('bil'), 'uf')}</span>`) + aCap(c, 'mange, vi vet ikke hvilke', '很多个，不知道是哪些'),
  bf:c => aRow(A.fv(Wd('bil'), 'bf', false, true), `<span class="artword">${A.wordHTML(Wd('bil'), 'bf')}</span>`) + aCap(c, 'alle de vi vet om', '我们知道的那些')
};
A.TERMS.forEach(t => { if(NOUN_ART[t.key]){ t.art = NOUN_ART[t.key](true); t.artPlain = NOUN_ART[t.key](false); } });
})();
