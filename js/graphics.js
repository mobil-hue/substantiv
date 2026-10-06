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
})();
