(function(){
'use strict';
const A = window.App;
const {bi, shuffle, sample, pick, uniq} = A;
const WS = A.WORDS;
const Ex = A.Ex = {pools:{}};
const defs = {}, cache = {};
const stats = A.store.get('stats', {});

Ex.note = function(id, ok){
  const s = stats[id] || (stats[id] = {s:0, m:0});
  s.s++; if(!ok) s.m++;
  A.store.set('stats', stats);
};
Ex.resetStats = () => { for(const k in stats) delete stats[k]; A.store.set('stats', stats); };
const def = (name, fn) => { defs[name] = fn; };
Ex.items = name => cache[name] || (cache[name] = defs[name]());
Ex.names = () => Object.keys(defs);

/* ---------- uttak (tilfeldig, men svake/nye først) ---------- */
const prio = it => { const s = stats[it.id]; return (s ? s.s*0.8 - s.m*1.6 : 0) + Math.random()*2; };
function passes(it, o){
  return (it.lvl || 0) <= (o.maxLvl == null ? 3 : o.maxLvl) && (it.mod || 0) <= (o.maxMod == null ? 9 : o.maxMod)
    && !(it.speech && !A.Speech.supported);
}
function takeFrom(name, o, used){
  const c = Ex.items(name).filter(it => passes(it, o) && !used.has(it.id));
  if(!c.length) return null;
  c.sort((a, b) => prio(a) - prio(b));
  used.add(c[0].id); return c[0];
}
Ex.draw = function(spec, n){
  const used = new Set(), out = [];
  const ps = spec.pools.map(p => typeof p === 'string' ? {p, w:1} : p);
  ps.forEach(p => { for(let i = 0; i < (p.min || 0); i++){ const it = takeFrom(p.p, spec, used); if(it) out.push(it); } });
  let live = ps.slice();
  while(out.length < n && live.length){
    const tot = live.reduce((s, p) => s + (p.w || 1), 0); let r = Math.random()*tot, ch = live[0];
    for(const p of live){ r -= (p.w || 1); if(r <= 0){ ch = p; break; } }
    const it = takeFrom(ch.p, spec, used);
    if(it) out.push(it); else live = live.filter(p => p !== ch);
  }
  return shuffle(out);
};
Ex.drawOne = function(spec, recent){
  const used = new Set(recent || []);
  let r = Ex.draw(spec, 1);
  if(r.length && used.has(r[0].id)){
    const alt = Ex.draw(spec, 6).filter(i => !used.has(i.id));
    if(alt.length) r = [alt[0]];
  }
  return r[0] || null;
};
Ex.counts = function(){
  const out = {small:0, task:0, pools:{}};
  Ex.names().forEach(n => {
    const it = Ex.items(n); const task = it.length && !['choice','type'].includes(it[0].kind);
    out.pools[n] = {n:it.length, task};
    if(task) out.task += it.length; else out.small += it.length;
  });
  return out;
};

const Q = (no, zh) => ({no, zh});
const FB = (no, zh) => ({no, zh});
const dot = c => `<span style="display:inline-block;width:46px;height:46px;border-radius:50%;background:${c}"></span>`;
const artBtn = a => `<span class="art g-${a}" style="font-size:1.7rem;padding:2px 18px">${a}</span>`;
const bigw = (h, sm) => `<div class="bigword ${sm ? 'sm' : ''}">${h}</div>`;
const gloss = z => `<div class="gloss zh">${z}</div>`;
const wordV = w => `<div>${A.fv(w, 'ue', true, true)}${gloss(w.zh)}</div>`;
const unc = (a, ex) => { const s = new Set(ex); return a.filter(x => !s.has(x)); };

function choice(id, lvl, mod, make, extra){ return Object.assign({id, kind:'choice', lvl, mod, make}, extra || {}); }
function typed(id, lvl, mod, make, extra){ return Object.assign({id, kind:'type', lvl, mod, make}, extra || {}); }

/* ---------- små oppgaver ---------- */

def('why', () => {
  const L = [
    ['Hvorfor lærer vi substantiv?','我们为什么要学名词？',
      [['Fordi vi trenger ord for personer, dyr, ting og steder','因为我们需要表示人、动物、东西和地方的词'],['Fordi lærere liker det','因为老师喜欢'],['Fordi det er et langt ord','因为它是一个长单词']],
      'Substantiv er navn på alt rundt oss. Uten dem kan vi ikke snakke om det vi ser.','名词是我们周围一切事物的名字。没有名词，我们就没法说出看到的东西。'],
    ['Hva skjer hvis du ikke kan ordet «eple»?','如果你不会说 [eple] 这个词，会怎么样？',
      [['Du kan ikke be om et eple','你没法要一个苹果'],['Du får to epler','你会得到两个苹果'],['Ingenting skjer','什么也不会发生']],
      'Du må kunne ordet for å be om det du vil ha.','你要会这个词，才能要你想要的东西。'],
    ['Hva er et substantiv?','什么是名词？',
      [['Et ord for en person, et dyr, en ting eller et sted','表示人、动物、东西或地方的词'],['Et ord for noe du gjør','表示做什么事的词'],['Et ord som sier hvordan noe er','说明事物怎么样的词']],
      'Substantiv = person, dyr, ting eller sted.','名词 = 人、动物、东西或地方。'],
    ['Bil, bilen, biler, bilene. Hva er sant?','[bil]、[bilen]、[biler]、[bilene]。哪句话是对的？',
      [['Substantiv har flere former','名词有好几种形式'],['Det er fire forskjellige ord','它们是四个完全不同的词'],['Bare én er riktig','只有一个是对的']],
      'Ett substantiv har fire former. Vi lærer dem alle!','一个名词有四种形式。我们会把它们都学会！'],
    ['Hvor bruker vi substantiv?','我们在哪里用名词？',
      [['Overalt: på skolen, i butikken, hjemme','到处都用：学校、商店、家里'],['Bare på skolen','只在学校'],['Aldri','从来不用']],
      'Vi bruker substantiv hele dagen.','我们一整天都在用名词。'],
    ['Hva hjelper deg å bli god i norsk?','什么能帮你学好挪威语？',
      [['Å øve litt hver dag','每天练习一点点'],['Å vente til i morgen','等到明天再说'],['Å aldri gjenta','从不复习']],
      'Litt hver dag gir best resultat!','每天一点点，效果最好！']
  ];
  return L.map((q, i) => choice('why:' + i, 0, 0, () => ({
    q:Q(q[0], q[1]), say:Q(q[0], q[1]), layout:'col',
    options:shuffle(q[2].map((o, k) => ({html:bi(o[0], o[1]), value:k}))), answer:0, fb:FB(q[3], q[4])
  })));
});

def('isnoun', () => {
  const mk = d => choice('isnoun:' + d.no, 1, 0, () => {
    let fbNo, fbZh;
    if(d.noun && d.name){ fbNo = `«${d.no}» er et egennavn, et substantiv. Egennavn skrives med STOR bokstav!`; fbZh = `[${d.no}]是专有名词，也是名词。专有名词要用大写字母开头！`; }
    else if(d.noun){ fbNo = `«${d.no}» er et substantiv.`; fbZh = `[${d.no}]是名词。`; }
    else { const k = A.KIND[d.kind]; fbNo = `«${d.no}» er ${k.no}. ${k.descNo}`; fbZh = `[${d.no}]是${k.zh}。${k.descZh}`; }
    return {q:Q('Er dette et substantiv?','这是名词吗？'), say:Q('Er dette et substantiv?','这是名词吗？'), word:d.no,
      visual:`<div>${bigw(d.no)}${gloss(d.zh)}</div>`,
      options:[{html:bi('Ja','是'), value:'y'}, {html:bi('Nei','不是'), value:'n'}], answer:d.noun ? 'y' : 'n', layout:'row',
      fb:FB(fbNo, fbZh), sayAfter:d.noun && d.w ? A.label(d.w, 'ue') : d.no};
  });
  return [].concat(WS.filter(w => w.lvl === 1).map(w => mk({no:w.no, zh:w.zh, noun:true, w})),
    A.NONNOUNS.map(n => mk({no:n.no, zh:n.zh, noun:false, kind:n.kind})),
    A.NAMES.map(n => mk({no:n.no, zh:n.zh, noun:true, name:true})));
});

def('kind', () => {
  const opts = () => [['substantiv','名词'],['verb','动词'],['adjektiv','形容词']];
  const mk = (word, zh, ans, fbNo, fbZh, id) => choice('kind:' + id, 1, 0, () => ({
    q:Q('Hva slags ord er dette?','这是什么词？'), say:Q('Hva slags ord er dette?','这是什么词？'), word,
    visual:`<div>${bigw(word)}${gloss(zh)}</div>`, layout:'row',
    options:shuffle(opts().map(o => ({html:bi(o[0], o[1]), value:o[0]}))), answer:ans, fb:FB(fbNo, fbZh)
  }));
  const out = [];
  A.NONNOUNS.filter(n => n.kind !== 'annet').forEach(n => {
    const ans = n.kind === 'verb' ? 'verb' : 'adjektiv', k = A.KIND[n.kind];
    out.push(mk(n.no, n.zh, ans, `«${n.no}» er ${k.no}. ${k.descNo}`, `[${n.no}]是${k.zh}。${k.descZh}`, n.no));
  });
  WS.filter(w => w.lvl === 1).forEach(w => out.push(mk(w.no, w.zh, 'substantiv', `«${w.no}» er et substantiv. Det er ${w.cat === 'ting' ? 'en ting' : w.cat === 'sted' ? 'et sted' : w.cat === 'dyr' ? 'et dyr' : 'en person'}.`, `[${w.no}]是名词。它是${A.CATS[w.cat].zh}。`, w.no)));
  return out;
});

def('cat', () => {
  const mk = (id, no, zh, emoji, cat, lvl, name) => choice('cat:' + id, lvl, 0, () => ({
    q:Q('Er det en person, et dyr, en ting eller et sted?','这是人、动物、东西还是地方？'), say:Q('Er det en person, et dyr, en ting eller et sted?','这是人、动物、东西还是地方？'), word:no,
    visual:`<div><div class="big-emoji">${emoji}</div>${bigw(no, true)}${gloss(zh)}</div>`, layout:'grid',
    options:Object.keys(A.CATS).map(k => ({html:`<div><div class="em">${A.CATS[k].emoji}</div>${bi(A.CATS[k].no, A.CATS[k].zh)}</div>`, value:k})), answer:cat,
    fb:FB(`«${no}» er ${A.CATS[cat].art} ${A.CATS[cat].no}.${name ? ' Egennavn: skriv med stor bokstav!' : ''}`, `[${no}]是${A.CATS[cat].zh}。${name ? '这是专有名词，要大写！' : ''}`)
  }));
  const emo = {Ola:'👦',Mia:'👧',Lars:'👦',Sara:'👧',Kari:'👧',Pelle:'🐕',Norge:'🇳🇴',Kina:'🇨🇳',Oslo:'🏙️',Bergen:'⛰️'};
  return WS.map(w => mk(w.no, w.no, w.zh, w.emoji, w.cat, w.lvl)).concat(A.NAMES.map(n => mk(n.no, n.no, n.zh, emo[n.no], n.type, 1, true)));
});

/* begreper: skriv, hør og skriv, norsk→kinesisk, kinesisk→norsk, + farger */
def('meta', () => {
  const out = [];
  A.TERMS.forEach(t => {
    const near = () => {
      const rest = A.TERMS.filter(x => x.key !== t.key);
      const low = rest.filter(x => x.mod <= t.mod), high = rest.filter(x => x.mod > t.mod);
      return sample(low, 3).concat(sample(high, 3)).slice(0, 3);
    };
    out.push(typed('meta:copy:' + t.key, 0, t.mod, () => ({
      q:Q('Skriv ordet.','把这个词写下来。'), say:Q('Skriv ordet.','把这个词写下来。'), word:t.no,
      visual:`<div>${bigw(t.no)}${gloss(`${A.ruby(t.zh, t.py)}`)}</div>`, listen:t.no, answers:[t.no], ph:t.no.replace(/./g, '·'),
      fb:FB(`«${t.no}» – ${t.defNo}`, `[${t.no}]（${t.zh}）：${t.defZh}`), sayAfter:t.no
    })));
    out.push(typed('meta:dict:' + t.key, 0, t.mod, () => ({
      q:Q('Hør og skriv ordet.','听一听，把这个词写下来。'), say:Q('Hør og skriv ordet.','听一听，把这个词写下来。'), listen:t.no,
      visual:`<div class="big-emoji">👂</div>`, answers:[t.no], ph:'?',
      fb:FB(`Ordet er «${t.no}» – ${t.defNo}`, `这个词是[${t.no}]（${t.zh}）：${t.defZh}`), sayAfter:t.no
    })));
    out.push(choice('meta:tozh:' + t.key, 0, t.mod, () => ({
      q:Q(`Hva betyr «${t.no}» på kinesisk?`, `[${t.no}]用中文是什么意思？`), say:Q(`Hva betyr ${t.no} på kinesisk?`, `[${t.no}]是什么意思？`),
      visual:bigw(t.no), layout:'col', options:shuffle([t].concat(near())).map(x => ({html:`<span>${x.zh}</span>`, value:x.key})), answer:t.key,
      fb:FB(`«${t.no}» = ${t.zh}. ${t.defNo}`, `[${t.no}] = ${t.zh}。${t.defZh}`), sayAfter:t.no
    })));
    out.push(choice('meta:tono:' + t.key, 0, t.mod, () => ({
      q:Q(`Hvilket norsk ord betyr «${t.zh}»?`, `哪个挪威语词的意思是「${t.zh}」？`), say:Q('Hvilket norsk ord er dette?','哪个挪威语词是这个意思？'),
      visual:`<div class="bigword">${A.ruby(t.zh, t.py)}</div>`, layout:'col', options:shuffle([t].concat(near())).map(x => ({html:`<span>${x.no}</span>`, value:x.key})), answer:t.key,
      fb:FB(`«${t.zh}» heter «${t.no}» på norsk. ${t.defNo}`, `「${t.zh}」挪威语叫[${t.no}]。${t.defZh}`), sayAfter:t.no
    })));
  });
  const G = [['en','#2563eb','blå','蓝色'],['ei','#db2777','rosa','粉色'],['et','#16a34a','grønn','绿色']];
  G.forEach(g => out.push(choice('meta:color:' + g[0], 0, 2, () => ({
    q:Q(`Hvilken farge har ${g[0]}-ord?`, `[${g[0]}]名词是什么颜色？`), say:Q(`Hvilken farge har ${g[0]}-ord?`, `[${g[0]}]名词是什么颜色？`),
    visual:`<div>${artBtn(g[0])}</div>`, layout:'row', options:shuffle(G).map(x => ({html:dot(x[1]), value:x[0]})), answer:g[0],
    fb:FB(`${g[0]}-ord er ${g[2]}.`, `[${g[0]}]名词是${g[3]}。`)
  }))));
  return out;
});

def('zhMatch', () => {
  const out = [];
  WS.forEach(w => {
    out.push(choice('zh2no:' + w.no, w.lvl, 0, () => {
      const others = sample(WS.filter(x => x !== w && x.art !== w.art).concat(sample(WS.filter(x => x !== w && x.art === w.art), 3)), 0);
      const d = sample(unc(WS, [w]), 3);
      return {q:Q('Hva heter dette på norsk?','这个用挪威语怎么说？'), say:Q('Hva heter dette på norsk?','这个用挪威语怎么说？'),
        visual:`<div><div class="big-emoji">${w.emoji}</div><div class="bigword sm">${w.zh}</div></div>`, layout:'row',
        options:shuffle([w].concat(d)).map(x => ({html:`<span>${A.artChip(x.art)}${x.no}</span>`, value:x.no})), answer:w.no,
        fb:FB(`${A.label(w, 'ue')} = ${w.zh}`, `${w.zh} = [${A.label(w, 'ue')}]`), sayAfter:A.label(w, 'ue')};
    }));
    out.push(choice('no2zh:' + w.no, w.lvl, 0, () => {
      const d = sample(unc(WS, [w]), 3);
      return {q:Q('Hva betyr dette på kinesisk?','这个中文是什么意思？'), say:Q('Hva betyr dette på kinesisk?','这个中文是什么意思？'), word:A.label(w, 'ue'),
        visual:`<div class="bigword">${A.artChip(w.art)}${w.no}</div>`, layout:'row',
        options:shuffle([w].concat(d)).map(x => ({html:`<span>${x.zh}</span>`, value:x.no})), answer:w.no,
        fb:FB(`${A.label(w, 'ue')} = ${w.zh} ${w.emoji}`, `[${A.label(w, 'ue')}] = ${w.zh} ${w.emoji}`), sayAfter:A.label(w, 'ue')};
    }));
  });
  return out;
});

def('listen', () => WS.map(w => choice('listen:' + w.no, w.lvl, 0, () => {
  const d = sample(WS.filter(x => x !== w && x.emoji !== w.emoji), 3);
  return {q:Q('Hør og velg riktig bilde.','听一听，选出正确的图片。'), say:Q('Hør og velg riktig bilde.','听一听，选出正确的图片。'), listen:A.label(w, 'ue'),
    visual:`<div class="big-emoji">👂</div>`, layout:'grid',
    options:shuffle([w].concat(d)).map(x => ({html:`<span class="em">${x.emoji}</span>`, value:x.no})), answer:w.no,
    fb:FB(`Det var «${A.label(w, 'ue')}» ${w.emoji}`, `刚才是[${A.label(w, 'ue')}] ${w.emoji}（${w.zh}）`), sayAfter:A.label(w, 'ue')};
}, {speech:true})));

def('art', () => WS.map(w => choice('art:' + w.no, w.lvl, 0, () => ({
  q:Q('Hvilket lite ord passer?','哪个小词合适？'), say:Q('Hvilket lite ord passer?','哪个小词合适？'), word:w.no,
  visual:`<div>${A.fv(w, 'ue', true, true)}${bigw('___ ' + w.no)}${gloss(w.zh)}</div>`, layout:'row',
  options:['en','ei','et'].map(a => ({html:artBtn(a), value:a})), answer:w.art,
  fb:FB(`${A.label(w, 'ue')} – «${w.no}» er et ${w.art}-ord.${w.art === 'ei' ? ' (I bokmål kan du også si «en ' + w.no + '», men vi øver på «ei».)' : ''}`,
        `[${A.label(w, 'ue')}] —— [${w.no}]是 ${w.art} 名词。${w.art === 'ei' ? '（在书面挪威语里也可以说 [en ' + w.no + ']，但我们练习用 [ei]。）' : ''}`),
  sayAfter:A.label(w, 'ue')
}))));

function plDistractors(w){
  const b = w.no;
  const c = uniq([b + 'er', b + 'e', b + 'en', b, b + 's', b + 'r', b + 'ene']).filter(x => !x.includes('ee') && x !== w.uf && x !== w.be && x !== w.bf);
  return sample(c, 2);
}
const irr = w => w.lvl === 3 ? [' Dette ordet er spesielt!', ' 这个词很特别！'] : ['', ''];

def('pl', () => WS.map(w => choice('pl:' + w.no, w.lvl, 0, () => ({
  q:Q('Mange! Hva heter flertall?','很多个！复数怎么说？'), say:Q('Mange! Hva heter flertall?','很多个！复数怎么说？'), word:A.label(w, 'ue'),
  visual:`${A.fv(w, 'ue', true, true)}<div class="arrow">➜</div><div>${bigw(A.label(w, 'ue'), true)}${A.fv(w, 'uf', true, true)}</div>`, layout:'row',
  options:shuffle([w.uf].concat(plDistractors(w))).map(x => ({html:`<span>${x}</span>`, value:x})), answer:w.uf,
  fb:FB(`${A.label(w, 'ue')} → ${w.uf}.${irr(w)[0]}`, `[${A.label(w, 'ue')}] → [${w.uf}]。${irr(w)[1]}`), sayAfter:`${A.label(w, 'ue')}. ${w.uf}.`
}))));

def('sing', () => {
  const out = [];
  WS.filter(w => w.no !== w.uf).forEach(w => ['ue', 'uf'].forEach(k => out.push(choice(`sing:${w.no}:${k}`, w.lvl, 3, () => ({
    q:Q('Entall eller flertall?','单数还是复数？'), say:Q('Entall eller flertall?','单数还是复数？'), word:A.label(w, k),
    visual:`<div>${bigw(A.label(w, k))}${gloss(w.zh)}</div>`, layout:'row',
    options:[{html:`<div>${A.formIcon('ue')}${bi('entall','单数')}</div>`, value:'ue'}, {html:`<div>${A.formIcon('uf')}${bi('flertall','复数')}</div>`, value:'uf'}], answer:k,
    fb:k === 'ue' ? FB(`«${A.label(w, k)}» er entall: bare én.`, `[${A.label(w, k)}]是单数：只有一个。`) : FB(`«${w.uf}» er flertall: mange.`, `[${w.uf}]是复数：很多个。`),
    sayAfter:A.label(w, k)
  })))));
  return out;
});

def('plType', () => WS.map(w => typed('plType:' + w.no, w.lvl, 0, () => ({
  q:Q('Skriv flertall.','写出复数。'), say:Q('Skriv flertall.','写出复数。'), word:A.label(w, 'ue'),
  visual:`${A.fv(w, 'ue', true, true)}<div class="arrow">➜</div><div>${bigw(A.label(w, 'ue'), true)}${A.fv(w, 'uf', true, true)}</div>`,
  listen:A.label(w, 'ue'), answers:[w.uf], ph:'…',
  fb:FB(`${A.label(w, 'ue')} → ${w.uf}.${irr(w)[0]}`, `[${A.label(w, 'ue')}] → [${w.uf}]。${irr(w)[1]}`), sayAfter:w.uf
}))));

def('bes', () => WS.map(w => choice('bes:' + w.no, w.lvl, 0, () => {
  const c = uniq(['en', 'a', 'et'].map(e => A.suffixed(w.no, e))).filter(x => x !== w.be);
  return {q:Q('Bestemt form: den ene vi vet om.','定指形式：我们知道的那一个。'), say:Q('Bestemt form. Hva heter det?','定指形式，怎么说？'), word:A.label(w, 'ue'),
    visual:`${A.fv(w, 'ue', true, true)}<div class="arrow">➜</div><div>${bigw(A.label(w, 'ue'), true)}${A.fv(w, 'be', true, true)}</div>`, layout:'row',
    options:shuffle([w.be].concat(sample(c, 2))).map(x => ({html:`<span>${x}</span>`, value:x})), answer:w.be,
    fb:FB(`${A.label(w, 'ue')} → ${w.be}. ${w.art}-ord: ${w.art === 'en' ? '+en' : w.art === 'ei' ? '+a' : '+et'}.`, `[${A.label(w, 'ue')}] → [${w.be}]。${w.art} 名词：${w.art === 'en' ? '加 -en' : w.art === 'ei' ? '加 -a' : '加 -et'}。`),
    sayAfter:`${A.label(w, 'ue')}. ${w.be}.`};
})));

def('ubes', () => {
  const out = [];
  WS.forEach(w => ['ue', 'be'].forEach(k => out.push(choice(`ubes:${w.no}:${k}`, w.lvl, 4, () => ({
    q:Q('Ubestemt eller bestemt?','不定还是定指？'), say:Q('Ubestemt eller bestemt?','不定还是定指？'), word:A.label(w, k),
    visual:`<div>${bigw(A.label(w, k))}${gloss(w.zh)}</div>`, layout:'row',
    options:[{html:`<div>${A.formIcon('ue')}${bi('ubestemt','不定')}</div>`, value:'ue'}, {html:`<div>${A.formIcon('be')}${bi('bestemt','定指')}</div>`, value:'be'}], answer:k,
    fb:k === 'ue' ? FB(`«${A.label(w, k)}» er ubestemt: vi vet ikke hvilken.`, `[${A.label(w, k)}]是不定：不知道是哪一个。`) : FB(`«${w.be}» er bestemt: vi vet hvilken.`, `[${w.be}]是定指：我们知道是哪一个。`),
    sayAfter:A.label(w, k)
  })))));
  return out;
});

def('besType', () => WS.map(w => typed('besType:' + w.no, w.lvl, 0, () => ({
  q:Q('Skriv bestemt form.','写出定指形式。'), say:Q('Skriv bestemt form.','写出定指形式。'), word:A.label(w, 'ue'),
  visual:`${A.fv(w, 'ue', true, true)}<div class="arrow">➜</div><div>${bigw(A.label(w, 'ue'), true)}${A.fv(w, 'be', true, true)}</div>`,
  listen:A.label(w, 'ue'), answers:[w.be], ph:'…',
  fb:FB(`${A.label(w, 'ue')} → ${w.be}`, `[${A.label(w, 'ue')}] → [${w.be}]`), sayAfter:w.be
}))));

def('formName', () => {
  const out = [];
  WS.forEach(w => A.FORMS.forEach(f => out.push(choice(`formName:${w.no}:${f.key}`, w.lvl, 0, () => ({
    q:Q('Hva heter denne formen?','这个形式叫什么名字？'), say:Q('Hva heter denne formen?','这个形式叫什么名字？'), word:A.label(w, f.key),
    visual:`<div>${A.fv(w, f.key, false, true)}<div class="bigword sm">${A.wordHTML(w, f.key)}</div></div>`, layout:'grid',
    options:A.FORMS.map(g => ({html:`<div>${A.formIcon(g.key)}${bi(g.no, g.zh)}</div>`, value:g.key})), answer:f.key,
    fb:FB(`«${A.label(w, f.key)}» er ${f.no}.`, `[${A.label(w, f.key)}]是${f.zh}。`), sayAfter:`${A.label(w, f.key)}. ${f.no}.`
  })))));
  return out;
});

def('formWrite', () => {
  const out = [];
  WS.forEach(w => ['be', 'uf', 'bf'].forEach(k => { const f = A.formMeta(k);
    out.push(typed(`formWrite:${w.no}:${k}`, w.lvl, 0, () => ({
      q:Q('Skriv formen.','写出这个形式。'), say:Q('Skriv formen.','写出这个形式。'), word:A.label(w, 'ue'),
      visual:`<div>${bigw(A.label(w, 'ue'), true)}<div style="margin:6px 0">${A.formChip(k)}</div>${A.fv(w, k, true, true)}</div>`,
      listen:A.label(w, 'ue'), answers:[w[k]], ph:'…',
      fb:FB(`${A.label(w, 'ue')} → ${f.no}: ${w[k]}`, `[${A.label(w, 'ue')}] → ${f.zh}：[${w[k]}]`), sayAfter:w[k]
    })));
  }));
  return out;
});

def('pic', () => {
  const out = [];
  WS.forEach(w => A.FORMS.forEach(f => out.push(choice(`pic:${w.no}:${f.key}`, w.lvl, 0, () => ({
    q:Q('Hvilket ord passer til bildet?','哪个词和图片相配？'), say:Q('Hvilket ord passer til bildet?','哪个词和图片相配？'),
    visual:A.fv(w, f.key, false, true), layout:'grid',
    options:shuffle(A.FORMS).map(g => ({html:`<span>${A.label(w, g.key)}</span>`, value:g.key})), answer:f.key,
    fb:FB(`${A.label(w, f.key)} = ${f.no}`, `[${A.label(w, f.key)}] = ${f.zh}`), sayAfter:A.label(w, f.key)
  })))));
  return out;
});

def('nameMatch', () => {
  const out = [];
  A.FORMS.forEach(f => {
    out.push(choice('nm:tono:' + f.key, 0, 5, () => ({
      q:Q(`Hva heter «${f.zh}» på norsk?`, `「${f.zh}」用挪威语怎么说？`), say:Q('Hva heter dette på norsk?','这个用挪威语怎么说？'),
      visual:`<div class="bigword">${A.ruby(f.zh, f.py)}</div>`, layout:'col',
      options:shuffle(A.FORMS).map(g => ({html:`<div>${A.formIcon(g.key)}<span>${g.no}</span></div>`, value:g.key})), answer:f.key,
      fb:FB(`«${f.zh}» = ${f.no}`, `「${f.zh}」= [${f.no}]`), sayAfter:f.no
    })));
    out.push(choice('nm:tozh:' + f.key, 0, 5, () => ({
      q:Q(`Hva betyr «${f.no}»?`, `[${f.no}]是什么意思？`), say:Q(`Hva betyr ${f.no}?`, `[${f.no}]是什么意思？`), word:f.no,
      visual:`<div>${A.formChip(f.key)}</div>`, layout:'col',
      options:shuffle(A.FORMS).map(g => ({html:`<span>${g.zh}</span>`, value:g.key})), answer:f.key,
      fb:FB(`«${f.no}» = ${f.zh}`, `[${f.no}] = ${f.zh}`), sayAfter:f.no
    })));
  });
  return out;
});

def('sentNoun', () => {
  const out = [];
  A.SENTENCES.forEach(s => {
    const toks = A.parseMarked(s.no).filter(t => t.word);
    const nouns = toks.filter(t => t.mark), others = toks.filter(t => !t.mark).map(t => t.t);
    nouns.forEach(n => out.push(choice(`sn:${s.id}:${n.t}`, s.lvl, 0, () => {
      const isName = A.NAMES.some(x => x.no === n.t);
      const pool = uniq(others.concat(sample(A.NONNOUNS.map(x => x.no), 5))).filter(x => x.toLowerCase() !== n.t.toLowerCase());
      const opts = shuffle([n.t].concat(sample(pool, 3)));
      return {q:Q('Hvilket ord er et substantiv?','哪个词是名词？'), say:Q('Hvilket ord er et substantiv?','哪个词是名词？'), word:A.plain(s.no),
        visual:`<div>${bigw(A.plain(s.no), true)}${gloss(s.zh)}</div>`, layout:'grid',
        options:opts.map(x => ({html:`<span>${x}</span>`, value:x})), answer:n.t,
        fb:FB(`«${n.t}» er et substantiv.${isName ? ' Egennavn: stor bokstav!' : ''}`, `[${n.t}]是名词。${isName ? '专有名词要大写！' : ''}`), sayAfter:A.plain(s.no)};
    })));
  });
  return out;
});

/* egennavn og stor/liten bokstav */
const LOWER_RULE = {mandag:['ukedager','星期'], fredag:['ukedager','星期'], søndag:['ukedager','星期'], januar:['måneder','月份'], juni:['måneder','月份'], desember:['måneder','月份'], norsk:['språk','语言'], kinesisk:['språk','语言']};
const cap = s => s[0].toUpperCase() + s.slice(1);
def('caps', () => {
  const out = [];
  A.NAMES.forEach(n => {
    out.push(choice('caps:n:' + n.no, 1, 1, () => ({
      q:Q('Hvilken skrivemåte er riktig?','哪种写法是对的？'), say:Q('Hvilken skrivemåte er riktig?','哪种写法是对的？'), word:n.no,
      visual:gloss(n.zh).replace('gloss zh', 'bigword sm zh'), layout:'row',
      options:shuffle([n.no, n.no.toLowerCase()]).map(x => ({html:`<span style="font-size:1.6rem">${x}</span>`, value:x})), answer:n.no,
      fb:FB(`«${n.no}» er et egennavn. Egennavn skrives med STOR bokstav.`, `[${n.no}]是专有名词，要用大写字母开头。`), sayAfter:n.no
    })));
    out.push(choice('caps:w:' + n.no, 1, 1, () => {
      const d = sample(WS.filter(w => w.lvl === 1), 2).map(w => w.no).concat(pick(A.LOWER).no);
      return {q:Q('Hvilket ord skrives med stor bokstav?','哪个词要用大写字母开头？'), say:Q('Hvilket ord skrives med stor bokstav?','哪个词要用大写字母开头？'),
        visual:'', layout:'grid', options:shuffle([n.no.toLowerCase()].concat(d)).map(x => ({html:`<span style="font-size:1.5rem">${x}</span>`, value:x})), answer:n.no.toLowerCase(),
        fb:FB(`«${cap(n.no.toLowerCase())}» er et egennavn. Det skrives med stor bokstav.`, `[${n.no}]是专有名词（${n.zh}），要大写。`), sayAfter:n.no};
    }));
  });
  A.LOWER.forEach(l => out.push(choice('caps:l:' + l.no, 1, 1, () => ({
    q:Q('Hvilken skrivemåte er riktig?','哪种写法是对的？'), say:Q('Hvilken skrivemåte er riktig?','哪种写法是对的？'), word:l.no,
    visual:gloss(l.zh).replace('gloss zh', 'bigword sm zh'), layout:'row',
    options:shuffle([l.no, cap(l.no)]).map(x => ({html:`<span style="font-size:1.6rem">${x}</span>`, value:x})), answer:l.no,
    fb:FB(`«${l.no}» skrives med liten bokstav. ${cap(LOWER_RULE[l.no][0])} er ikke egennavn.`, `[${l.no}]用小写字母。${LOWER_RULE[l.no][1]}不是专有名词。`), sayAfter:l.no
  }))));
  return out;
});
def('capsType', () => {
  const out = [];
  A.NAMES.forEach(n => out.push(typed('capsT:n:' + n.no, 1, 1, () => ({
    q:Q('Skriv navnet med riktig bokstav.','用正确的字母把名字写出来。'), say:Q('Skriv navnet med riktig bokstav.','用正确的字母把名字写出来。'), word:n.no,
    visual:`<div>${bigw(n.no.toLowerCase())}${gloss(n.zh)}<div class="small-note">${bi('Husk stor bokstav!','记得大写！')}</div></div>`, listen:n.no, answers:[n.no], caseSensitive:true, ph:'…',
    fb:FB(`«${n.no}» – egennavn, stor bokstav!`, `[${n.no}] —— 专有名词，要大写！`), sayAfter:n.no
  }))));
  A.LOWER.forEach(l => out.push(typed('capsT:l:' + l.no, 1, 1, () => ({
    q:Q('Skriv ordet riktig. Liten eller stor bokstav?','把这个词正确写出来。小写还是大写？'), say:Q('Skriv ordet riktig.','把这个词正确写出来。'), word:l.no,
    visual:`<div>${bigw(cap(l.no))}${gloss(l.zh)}<div class="small-note">${bi(`Tips: ${LOWER_RULE[l.no][0]} …`, `提示：${LOWER_RULE[l.no][1]}……`)}</div></div>`, listen:l.no, answers:[l.no], caseSensitive:true, ph:'…',
    fb:FB(`«${l.no}» skrives med liten bokstav.`, `[${l.no}]要用小写字母。`), sayAfter:l.no
  }))));
  return out;
});

/* ---------- omfattende oppgaver ---------- */
const rngBand = (lvl, seed) => A.seeded(seed + lvl*101);
function groupsByBand(){
  const out = [];
  [1, 2, 3].forEach(lvl => {
    const rnd = rngBand(lvl, 7);
    const ws = WS.filter(w => w.lvl === lvl).map(w => [rnd(), w]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
    const gs = []; for(let i = 0; i < ws.length; i += 3) gs.push(ws.slice(i, i + 3));
    if(gs.length > 1 && gs[gs.length - 1].length < 3){ const last = gs.pop(); gs[gs.length - 1].push(...last); }
    gs.forEach(g => out.push({lvl, words:g}));
  });
  return out.map((g, i) => Object.assign(g, {i}));
}
let _groups; const groups = () => _groups || (_groups = groupsByBand());

function formsTask(name, cols, titleNo, titleZh){
  def(name, () => groups().map(g => ({id:`${name}:${g.i}`, kind:'grid', lvl:g.lvl, mod:0, make:() => {
    const head = ['<span class="thead">&nbsp;</span>'].concat(['ue'].concat(cols).map(k => A.formHead(k)));
    return {title:Q(titleNo, titleZh), say:Q(titleNo, titleZh), head,
      intro:Q('Tips: bruk 💡 hvis du står fast. Trykk 🔊 for å høre ordet.','提示：卡住了就点 💡。点 🔊 可以听单词。'),
      rows:g.words.map(w => ({lead:`<span class="e" style="font-size:1.8rem">${w.emoji}</span>`, speak:A.label(w, 'ue'),
        cells:[{html:`<span class="bigword sm" style="white-space:nowrap">${A.artChip(w.art)}${w.no}</span>`}].concat(cols.map(k => ({answers:[w[k]], ph:'…'})))}))};
  }})));
}
formsTask('forms_uf', ['uf'], 'Skriv flertall.', '写出复数形式。');
formsTask('forms_be', ['be'], 'Skriv bestemt form.', '写出定指形式。');
formsTask('forms_all', ['be', 'uf', 'bf'], 'Skriv alle fire formene.', '写出四种形式。');

/* diktat */
let _dsets;
function dictSets(){
  if(_dsets) return _dsets;
  const rnd = A.seeded(33), out = [];
  const shuf = a => a.map(x => [rnd(), x]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
  const l1 = shuf(WS.filter(w => w.lvl === 1)), l2 = shuf(WS.filter(w => w.lvl <= 2));
  for(let i = 0; i < 3; i++) out.push({lvl:1, words:l1.slice(i*5, i*5 + 5)});
  for(let i = 0; i < 3; i++) out.push({lvl:2, words:l2.slice(i*5, i*5 + 5)});
  return (_dsets = out.map((s, i) => Object.assign(s, {i})));
}
function dictTask(name, mode){
  def(name, () => dictSets().map(s => ({id:`${name}:${s.i}`, kind:'grid', lvl:s.lvl, mod:0, speech:true, make:() => {
    const tNo = mode === 'form' ? 'Hør ordet. Skriv formen.' : mode === 'art' ? 'Hør og skriv med en, ei eller et.' : 'Hør og skriv ordet.';
    const tZh = mode === 'form' ? '听单词，写出要求的形式。' : mode === 'art' ? '听一听，写出 en、ei 或 et 加单词。' : '听一听，把单词写下来。';
    const keys = ['be', 'uf', 'bf'];
    return {title:Q(tNo, tZh), say:Q(tNo, tZh), head:null, caseSensitive:false, revealEmoji:true,
      intro:Q('Trykk 🔊 og skriv det du hører.','点 🔊，写下你听到的词。'),
      rows:s.words.map((w, k) => { const key = mode === 'form' ? keys[k % 3] : 'ue';
        return {lead:`<span class="gloss zh">${w.zh}</span>`, speak:mode === 'form' ? A.label(w, 'ue') : (mode === 'art' ? A.label(w, 'ue') : w.no), reveal:w.emoji,
          cells:(mode === 'form' ? [{html:A.formChip(key, true)}] : []).concat([{answers:[mode === 'art' ? A.label(w, 'ue') : mode === 'form' ? w[key] : w.no], ph:'…'}])}; })};
  }})));
}
dictTask('dict_word', 'word'); dictTask('dict_art', 'art'); dictTask('dict_form', 'form');

/* finn substantivene / finn ord som må ha stor bokstav */
def('find', () => A.TEXTS.map(t => ({id:'find:' + t.id, kind:'find', lvl:t.lvl, mod:0, make:() => ({
  mode:'noun', title:Q('Trykk på alle substantivene.','点出所有的名词。'), say:Q('Trykk på alle substantivene.','点出所有的名词。'), text:t.no, zh:t.zh,
  note:/\{(Mia|Ola|Norge|Oslo|Lars|Pelle)\}/.test(t.no) ? Q('Husk: egennavn (Mia, Ola, Norge …) er også substantiv!','记住：专有名词（Mia、Ola、Norge……）也是名词！') : null
})})));
def('findcaps', () => A.CAPS_TEXTS.map(t => ({id:'findcaps:' + t.id, kind:'find', lvl:t.lvl, mod:1, make:() => ({
  mode:'caps', title:Q('Trykk på ordene som må ha STOR bokstav.','点出必须用大写字母开头的词。'), say:Q('Trykk på ordene som må ha stor bokstav.','点出必须用大写字母开头的词。'), text:t.no, zh:t.zh,
  note:t.id >= 'c6' ? Q('Husk: ukedager, måneder og språk skrives med liten bokstav.','记住：星期、月份和语言用小写字母。') : null
})})));

/* sortering */
function pickSet(rnd, list, n){ return list.map(x => [rnd(), x]).sort((a, b) => a[0] - b[0]).slice(0, n).map(x => x[1]); }
def('sortbox', () => {
  const out = [], plan = [[1,2,2,2],[1,2,2,2],[1,2,2,2],[1,2,2,2],[2,2,2,3],[2,2,2,3],[2,2,2,3],[3,3,3,3],[3,3,3,3],[3,3,3,3]];
  plan.forEach((p, i) => {
    const rnd = A.seeded(500 + i*13), lvl = p[0];
    const ws = [].concat(...['en','ei','et'].map((a, k) => pickSet(rnd, WS.filter(w => w.art === a && w.lvl <= lvl), p[k+1] === 3 ? 3 : 2)));
    out.push({id:'sortbox:' + i, kind:'sort', lvl, mod:0, make:() => ({
      title:Q('Sorter ordene: en, ei eller et?','给单词分类：en、ei 还是 et？'), say:Q('Sorter ordene: en, ei eller et?','给单词分类：en、ei 还是 et？'),
      bins:['en','ei','et'].map(a => ({key:a, html:`<span class="art g-${a}" style="font-size:1.4rem">${a}</span>`, color:A.GEN[a].color})),
      items:ws.map(w => ({id:w.no, html:`<span class="e">${w.emoji}</span><span>${w.no}</span>`, bin:w.art, fix:`${A.label(w, 'ue')}`})),
      hint:Q('Trykk på et ord, så på riktig boks. (ei-ord kan også ha en i bokmål, men her øver vi på ei.)','先点一个词，再点正确的盒子。（在书面挪威语里 ei 名词也可以用 en，但这里我们练习 ei。）')})
    });
  });
  return out;
});
def('sortcat', () => {
  const out = [], plan = [1,1,1,1,1,1,3,3,3,3];
  plan.forEach((lvl, i) => {
    const rnd = A.seeded(900 + i*17);
    const ws = [].concat(...Object.keys(A.CATS).map(c => pickSet(rnd, WS.filter(w => w.cat === c && w.lvl <= lvl), 2)));
    out.push({id:'sortcat:' + i, kind:'sort', lvl:lvl === 1 ? 1 : 2, mod:0, make:() => ({
      title:Q('Er det en person, et dyr, en ting eller et sted?','是人、动物、东西还是地方？'), say:Q('Sorter ordene: person, dyr, ting eller sted?','给单词分类：人、动物、东西还是地方？'),
      bins:Object.keys(A.CATS).map(c => ({key:c, html:`<span>${A.CATS[c].emoji} ${bi(A.CATS[c].no, A.CATS[c].zh)}</span>`, color:A.CATS[c].color})),
      items:ws.map(w => ({id:w.no, html:`<span class="e">${w.emoji}</span><span>${w.no}</span>`, bin:w.cat, fix:`${w.no} = ${A.CATS[w.cat].no}`}))
    })});
  });
  return out;
});
def('matchforms', () => {
  const out = [];
  for(let i = 0; i < 8; i++){
    const lvl = i < 4 ? 1 : 2, rnd = A.seeded(1300 + i*19);
    const ws = pickSet(rnd, WS.filter(w => w.lvl <= lvl && w.no !== w.uf), 2);
    out.push({id:'match:' + i, kind:'sort', lvl, mod:0, make:() => ({
      title:Q('Hva heter formene? Sorter dem.','这些形式叫什么？请分类。'), say:Q('Hva heter formene? Sorter dem.','这些形式叫什么？请分类。'),
      bins:A.FORMS.map(f => ({key:f.key, html:`<span class="thead" style="--c:${f.color}">${A.formIcon(f.key, 40)}<span>${f.no}</span><span class="zh">${f.zh}</span></span>`, color:f.color})),
      items:[].concat(...ws.map(w => A.FORMS.map(f => ({id:w.no + f.key, html:`<span class="e">${w.emoji}</span><span>${A.label(w, f.key)}</span>`, bin:f.key, fix:`${A.label(w, f.key)} = ${f.no}`})))),
      hint:Q('Tips: ubestemt = vi vet ikke hvilken · bestemt = vi vet hvilken · entall = én · flertall = mange','提示：ubestemt = 不知道是哪个 · bestemt = 知道是哪个 · entall = 一个 · flertall = 很多个')
    })});
  }
  return out;
});

/* bygg setning */
def('build', () => A.SENTENCES.map(s => ({id:'build:' + s.id, kind:'build', lvl:s.lvl, mod:0, make:() => {
  const toks = A.parseMarked(s.no).filter(t => t.word || /[.!?]/.test(t.t));
  const words = []; toks.forEach(t => { if(t.word) words.push({t:t.t, noun:!!t.mark}); else if(words.length) words[words.length - 1].t += t.t; });
  return {title:Q('Bygg setningen. Husk stor bokstav først!','把句子拼出来。句首要大写！'), say:Q('Bygg setningen.','把句子拼出来。'), zh:s.zh, words, sentence:A.plain(s.no)};
}})));

/* ---------- visning ---------- */
const norm = (s, cs) => { s = String(s).trim().replace(/\s+/g, ' ').replace(/[.!?]+$/, ''); return cs ? s : s.toLowerCase(); };
const MSG_OK = [['Riktig!','对了！'],['Flott!','太棒了！'],['Bra jobba!','做得好！'],['Supert!','太好了！'],['Veldig bra!','非常好！']];
Ex.msgOk = () => pick(MSG_OK);

Ex.speakSpec = function(spec){
  if(spec.listen) return A.sayNo(spec.listen);
  const L = A.settings.lang, segs = [];
  if(spec.say){
    if(L !== 'zh') segs.push(...A.parseSegs(spec.say.no, 'no'));
    if(L !== 'no') segs.push(...A.parseSegs(spec.say.zh, 'zh'));
  }
  if(spec.word) segs.push(...A.parseSegs(spec.word, 'no'));
  return A.say(segs);
};
function keysRow(getInput){
  const d = A.h('div', {class:'keys'});
  ['æ','ø','å'].forEach(ch => d.append(A.h('button', {type:'button', onclick:() => { const i = getInput(); if(!i || i.readOnly) return; i.focus(); const p = i.selectionStart || i.value.length; i.value = i.value.slice(0, p) + ch + i.value.slice(p); i.setSelectionRange(p+1, p+1); }}, ch)));
  return d;
}
const head = (spec, extra) => `<div class="qtext"><span class="grow">${bi(spec.q ? spec.q.no : spec.title.no, spec.q ? spec.q.zh : spec.title.zh)}</span><button class="spk say" type="button" title="Les opp">🔊</button></div>${extra || ''}`;

function renderChoice(spec, host, ctx){
  host.innerHTML = `<div class="qcard">${head(spec)}<div class="visual">${spec.visual || ''}</div><div class="opts ${spec.layout || 'row'}"></div></div>`;
  host.querySelector('.say').onclick = () => Ex.speakSpec(spec);
  const box = host.querySelector('.opts'); let locked = false; const btns = [];
  spec.options.forEach(o => {
    const b = A.h('button', {class:'opt', type:'button', html:o.html});
    b.onclick = () => {
      if(locked) return; locked = true;
      const ok = o.value === spec.answer;
      b.classList.add(ok ? 'ok' : 'bad');
      if(!ok) btns.forEach((x, i) => { if(spec.options[i].value === spec.answer) x.classList.add('ok'); });
      btns.forEach(x => x.classList.add('lock'));
      ctx.result({score:ok ? 1 : 0, ok, fb:spec.fb, say:spec.sayAfter});
    };
    btns.push(b); box.append(b);
  });
  if(A.settings.auto) Ex.speakSpec(spec);
}

function renderType(spec, host, ctx){
  host.innerHTML = `<div class="qcard">${head(spec)}<div class="visual">${spec.visual || ''}</div>
    <div class="typebox"><input class="ans" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="${spec.ph || ''}"><button class="btn check" type="button"><span class="bi"><span class="no">Sjekk ✔</span><span class="zh">检查</span></span></button></div>
    <div class="keys-host"></div><div class="hint"></div></div>`;
  const inp = host.querySelector('input'), hintEl = host.querySelector('.hint'); let tries = 0, done = false;
  host.querySelector('.keys-host').append(keysRow(() => inp));
  host.querySelector('.say').onclick = () => Ex.speakSpec(spec);
  const ans = spec.answers[0];
  const doCheck = () => {
    if(done) return;
    const v = norm(inp.value, spec.caseSensitive); if(!v) return;
    const ok = spec.answers.some(a => norm(a, spec.caseSensitive) === v);
    if(ok){
      done = true; inp.classList.add('ok'); inp.readOnly = true;
      ctx.result({score:tries === 0 ? 1 : 0, ok:tries === 0, retryOk:tries > 0, fb:spec.fb, say:spec.sayAfter});
    } else {
      tries++; inp.classList.remove('shake'); void inp.offsetWidth; inp.classList.add('shake');
      if(tries === 1){
        inp.classList.add('bad');
        const hintTxt = ans.slice(0, 1) + ' ' + Array.from(ans.slice(1)).map(c => c === ' ' ? '  ' : '_').join(' ');
        hintEl.innerHTML = `💡 ${bi('Nesten! Prøv en gang til.','差一点！再试一次。')} <b style="letter-spacing:2px">${hintTxt}</b>`;
        inp.focus();
      } else {
        done = true; inp.value = ans; inp.classList.add('bad'); inp.readOnly = true;
        ctx.result({score:0, ok:false, fb:spec.fb, say:spec.sayAfter});
      }
    }
  };
  host.querySelector('.check').onclick = doCheck;
  inp.addEventListener('keydown', e => { if(e.key === 'Enter'){ e.preventDefault(); doCheck(); } });
  inp.addEventListener('input', () => inp.classList.remove('bad'));
  if(A.settings.auto) Ex.speakSpec(spec);
  setTimeout(() => { try{ inp.focus(); }catch(e){} }, 50);
}

function renderGrid(spec, host, ctx){
  const cs = !!spec.caseSensitive;
  let html = `<div class="qcard">${head(spec, spec.intro ? `<div class="small-note">${bi(spec.intro.no, spec.intro.zh)}</div>` : '')}<div class="tblwrap"><table class="tbl">`;
  if(spec.head) html += `<tr>${spec.head.map(h => `<th>${h}</th>`).join('')}</tr>`;
  spec.rows.forEach((r, ri) => {
    html += `<tr><td class="lead">${r.speak ? `<button class="spk rs" type="button" data-s="${A.esc(r.speak)}">🔊</button> ` : ''}${r.lead || ''}</td>`;
    r.cells.forEach((c, ci) => { html += c.answers ? `<td><input class="ans" data-r="${ri}" data-c="${ci}" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="${c.ph || ''}"></td>` : `<td>${c.html}</td>`; });
    html += '</tr>';
  });
  html += `</table></div><div class="keys-host"></div><div class="hint"></div>
    <div class="typebox"><button class="btn sec hintbtn" type="button"><span class="bi"><span class="no">💡 Hint</span><span class="zh">提示</span></span></button>
    <button class="btn check" type="button"><span class="bi"><span class="no">Sjekk ✔</span><span class="zh">检查</span></span></button></div></div>`;
  host.innerHTML = html;
  host.querySelector('.say').onclick = () => Ex.speakSpec(spec);
  host.querySelectorAll('.rs').forEach(b => b.onclick = () => A.sayNo(b.dataset.s));
  const inputs = []; let last = null;
  host.querySelectorAll('input.ans').forEach(el => {
    const r = spec.rows[+el.dataset.r], c = r.cells[+el.dataset.c];
    inputs.push({el, answers:c.answers, done:false, row:r});
    el.addEventListener('focus', () => last = el);
    el.addEventListener('input', () => el.classList.remove('bad'));
  });
  host.querySelector('.keys-host').append(keysRow(() => last || (inputs[0] && inputs[0].el)));
  const hintEl = host.querySelector('.hint'); let attempt = 0, first = 0, second = 0, finished = false;
  host.querySelector('.hintbtn').onclick = () => { inputs.filter(i => !i.done && !i.el.value).forEach(i => i.el.placeholder = i.answers[0].slice(0, 1) + '…'); };
  function finish(){
    finished = true; host.querySelectorAll('button.check,button.hintbtn').forEach(b => b.disabled = true);
    if(spec.revealEmoji) spec.rows.forEach((r, i) => { if(r.reveal) host.querySelectorAll('tr')[i + (spec.head ? 1 : 0)].querySelector('.lead').insertAdjacentHTML('beforeend', `<span style="font-size:1.8rem"> ${r.reveal}</span>`); });
    const sc = (first + 0.5*second) / inputs.length;
    ctx.result({score:sc, ok:sc >= 0.8, fb:null, extra:inputs.length});
  }
  const check = () => {
    if(finished) return; attempt++;
    const pend = inputs.filter(i => !i.done);
    if(pend.some(i => !i.el.value.trim()) && attempt === 1){ hintEl.innerHTML = '✏️ ' + bi('Fyll ut alle feltene først.','请先把每一格都填上。'); attempt--; return; }
    pend.forEach(i => {
      const v = norm(i.el.value, cs);
      if(i.answers.some(a => norm(a, cs) === v)){ i.done = true; i.el.classList.remove('bad'); i.el.classList.add('ok'); i.el.readOnly = true; attempt === 1 ? first++ : second++; }
      else { i.el.classList.add('bad'); i.el.classList.remove('shake'); void i.el.offsetWidth; i.el.classList.add('shake'); }
    });
    const left = inputs.filter(i => !i.done);
    if(!left.length) return finish();
    if(attempt >= 2){ left.forEach(i => { i.el.value = i.answers[0]; i.el.readOnly = true; }); return finish(); }
    hintEl.innerHTML = '🔴 ' + bi('Rett opp de røde feltene og sjekk igjen.','请改正红色的格子，再检查一次。');
  };
  host.querySelector('.check').onclick = check;
  host.addEventListener('keydown', e => { if(e.key === 'Enter' && e.target.tagName === 'INPUT'){ e.preventDefault(); check(); } });
  if(A.settings.auto) Ex.speakSpec(spec);
}

function renderFind(spec, host, ctx){
  const toks = A.parseMarked(spec.text), caps = spec.mode === 'caps';
  const nMark = toks.filter(t => t.mark).length;
  let body = '';
  toks.forEach((t, i) => { body += t.word ? `<span class="tok" data-i="${i}">${t.t}</span>` : (t.sp ? ' ' : A.esc(t.t)); });
  host.innerHTML = `<div class="qcard">${head(spec, `<div class="small-note">${caps ? bi(`Det er ${nMark} ord som må ha stor bokstav.`, `有 ${nMark} 个词必须大写。`) : bi(`Finn ${nMark} substantiv.`, `找出 ${nMark} 个名词。`)}</div>`)}
    <div class="text" style="margin-top:10px">${body}</div><div class="zhtext zh">${spec.zh}</div><div class="hint"></div>
    <div class="typebox"><button class="spk readtxt" type="button">📖</button><button class="btn check" type="button"><span class="bi"><span class="no">Ferdig ✔</span><span class="zh">完成</span></span></button></div></div>`;
  const plain = A.plain(spec.text);
  host.querySelector('.say').onclick = () => Ex.speakSpec(spec);
  host.querySelector('.readtxt').onclick = () => A.sayNo(plain);
  const sel = new Set(); let done = false;
  host.querySelectorAll('.tok').forEach(el => el.onclick = () => { if(done) return; const i = +el.dataset.i; if(sel.has(i)){ sel.delete(i); el.classList.remove('sel'); } else { sel.add(i); el.classList.add('sel'); } });
  host.querySelector('.check').onclick = () => {
    if(done) return; done = true; host.querySelector('.check').disabled = true;
    let hit = 0, wrong = 0;
    host.querySelectorAll('.tok').forEach(el => {
      const i = +el.dataset.i, t = toks[i], s = sel.has(i); el.classList.remove('sel');
      if(t.mark && s){ hit++; el.classList.add('ok'); if(caps) el.textContent = cap(t.t); }
      else if(t.mark){ el.classList.add('miss'); if(caps) el.textContent = cap(t.t); }
      else if(s){ wrong++; el.classList.add('bad'); }
    });
    const sc = Math.max(0, (hit - wrong) / nMark);
    host.querySelector('.hint').innerHTML = spec.note ? '💡 ' + bi(spec.note.no, spec.note.zh) : '';
    ctx.result({score:sc, ok:sc >= 0.8, fb:null, say:plain, extra:`${hit}/${nMark}`});
  };
  if(A.settings.auto) Ex.speakSpec(spec);
}

function renderSort(spec, host, ctx){
  host.innerHTML = `<div class="qcard">${head(spec, spec.hint ? `<div class="small-note">${bi(spec.hint.no, spec.hint.zh)}</div>` : `<div class="small-note">${bi('Trykk på et ord, så på riktig boks.','先点一个词，再点正确的盒子。')}</div>`)}
    <div class="pool" style="margin-top:10px"></div><div class="bins"></div><div class="hint"></div>
    <div class="typebox"><button class="btn check" type="button" disabled><span class="bi"><span class="no">Sjekk ✔</span><span class="zh">检查</span></span></button></div></div>`;
  host.querySelector('.say').onclick = () => Ex.speakSpec(spec);
  const pool = host.querySelector('.pool'), binsEl = host.querySelector('.bins'), checkBtn = host.querySelector('.check'), hintEl = host.querySelector('.hint');
  const items = spec.items.map(i => Object.assign({placed:null, state:''}, i));
  const binEls = {};
  spec.bins.forEach(b => {
    const el = A.h('div', {class:'bin', style:`--c:${b.color}`, html:`<h4>${b.html}</h4><div class="in"></div>`});
    el.onclick = () => { if(selected && !locked){ selected.placed = b.key; selected = null; draw(); } };
    binEls[b.key] = el.querySelector('.in'); binsEl.append(el);
  });
  let selected = null, attempt = 0, first = 0, second = 0, locked = false;
  function tile(it){
    const t = A.h('span', {class:'tile ' + (selected === it ? 'selx ' : '') + it.state, html:it.html});
    t.onclick = ev => { ev.stopPropagation(); if(locked || it.state === 'ok') return;
      if(it.placed){ it.placed = null; selected = it; it.state = ''; } else selected = (selected === it ? null : it);
      draw(); };
    return t;
  }
  function draw(){
    pool.innerHTML = ''; Object.values(binEls).forEach(e => e.innerHTML = '');
    items.forEach(it => (it.placed ? binEls[it.placed] : pool).append(tile(it)));
    checkBtn.disabled = locked || items.some(i => !i.placed);
  }
  checkBtn.onclick = () => {
    if(locked) return; attempt++;
    items.filter(i => i.state !== 'ok').forEach(i => {
      if(i.placed === i.bin){ i.state = 'ok'; attempt === 1 ? first++ : second++; } else i.state = 'bad';
    });
    const wrong = items.filter(i => i.state === 'bad');
    if(!wrong.length) return fin();
    if(attempt >= 2){ wrong.forEach(i => { i.placed = i.bin; }); return fin(); }
    wrong.forEach(i => { i.placed = null; });
    draw();
    pool.querySelectorAll('.tile').forEach(t => t.classList.add('bad'));
    hintEl.innerHTML = '🔴 ' + bi('Noen er feil. Flytt de røde ordene til riktig boks.','有几个放错了。把红色的词放到正确的盒子里。');
  };
  function fin(){
    locked = true; draw(); checkBtn.disabled = true;
    const sc = (first + 0.5*second) / items.length;
    const wrongOnes = items.filter(i => i.state === 'bad');
    ctx.result({score:sc, ok:sc >= 0.8, fb:null, extra:wrongOnes.length ? wrongOnes.map(i => i.fix).filter(Boolean).join(' · ') : ''});
  }
  items.forEach(i => i.state = '');
  draw();
  if(A.settings.auto) Ex.speakSpec(spec);
}

function renderBuild(spec, host, ctx){
  const words = shuffle(spec.words.map((w, i) => Object.assign({i}, w)));
  host.innerHTML = `<div class="qcard">${head(spec)}<div class="visual"><div class="bigword sm">${spec.zh}</div></div>
    <div class="line"></div><div class="pool" style="margin-top:12px"></div><div class="hint"></div>
    <div class="typebox"><button class="btn sec hear" type="button"><span class="bi"><span class="no">🔊 Hør setningen</span><span class="zh">听句子</span></span></button><button class="btn check" type="button" disabled><span class="bi"><span class="no">Sjekk ✔</span><span class="zh">检查</span></span></button></div></div>`;
  host.querySelector('.say').onclick = () => Ex.speakSpec(spec);
  host.querySelector('.hear').onclick = () => A.sayNo(spec.sentence);
  const line = host.querySelector('.line'), pool = host.querySelector('.pool'), chk = host.querySelector('.check'), hintEl = host.querySelector('.hint');
  let chosen = [], locked = false, attempt = 0;
  function draw(){
    line.innerHTML = ''; pool.innerHTML = '';
    chosen.forEach(w => line.append(A.h('span', {class:'tile ' + (w.st || ''), onclick:() => { if(locked) return; chosen = chosen.filter(x => x !== w); w.st = ''; draw(); }}, w.t)));
    words.filter(w => !chosen.includes(w)).forEach(w => pool.append(A.h('span', {class:'tile', onclick:() => { if(locked) return; chosen.push(w); draw(); }}, w.t)));
    chk.disabled = locked || chosen.length !== words.length;
  }
  chk.onclick = () => {
    attempt++;
    const okAll = chosen.every((w, k) => w.i === k);
    chosen.forEach((w, k) => { w.st = w.i === k ? 'ok' : 'bad'; });
    if(okAll){ locked = true; draw(); chk.disabled = true; return ctx.result({score:attempt === 1 ? 1 : 0.5, ok:attempt === 1, fb:null, say:spec.sentence}); }
    if(attempt >= 2){ chosen = words.slice().sort((a, b) => a.i - b.i); chosen.forEach(w => w.st = 'bad'); locked = true; draw(); chk.disabled = true; return ctx.result({score:0, ok:false, fb:null, say:spec.sentence, extra:spec.sentence}); }
    draw(); hintEl.innerHTML = '🔴 ' + bi('Nesten! Trykk på de røde ordene for å flytte dem.','差一点！点红色的词重新摆放。');
  };
  draw();
  if(A.settings.auto) Ex.speakSpec(spec);
}

Ex.render = function(item, host, ctx){
  const spec = item.make();
  ({choice:renderChoice, type:renderType, grid:renderGrid, find:renderFind, sort:renderSort, build:renderBuild})[item.kind](spec, host, ctx);
};
})();
