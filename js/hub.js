(function(){
'use strict';
/* Rotmenyen. Nye fag og opplegg legges til i PROGRAMS (og evt. SECTIONS). */
const A = window.App, {h, bi} = A;
const app = document.getElementById('app');

const SECTIONS = [
  {id:'norsk', emoji:'🇳🇴', no:'Norsk', zh:'挪威语', color:'#2563eb'},
  {id:'matte', emoji:'🔢', no:'Matematikk', zh:'数学', color:'#f97316'},
  {id:'voksen', emoji:'🧑‍🏫', no:'Norsk Voksenopplæring', zh:'成人挪威语', color:'#0f766e'}
];
// sum = nøkkel til fremgangen programmet lagrer (sub_sum_<sum>)
const PROGRAMS = [
  {section:'norsk', id:'substantiv', href:'substantiv.html', sum:'noun', emoji:'📘', color:'#f97316',
   no:'Substantiv', zh:'名词',
   desc:['Hva et substantiv er, en/ei/et, entall og flertall, bestemt og ubestemt form.', '什么是名词、en/ei/et、单数和复数、定指和不定指。'],
   links:[['ark.html', '📝 Skriveark', '练习纸'], ['docs/substantiv-jukselapp.pdf', '🧾 Jukselapp', '速查表'], ['docs/substantiv-boyingstabell.pdf', '📊 Bøyingstabell', '变形表'], ['teacher.html', '👩‍🏫 Lærer', '教师页']]},
  {section:'matte', id:'multiplikasjon', href:'multiplikasjon.html', sum:'mult', emoji:'✖️', color:'#16a34a',
   no:'Gange – lær og øv', zh:'乘法：学习和练习',
   desc:['Hva gange er, gangetabellen, knep, gange med 10/100/1000, regnestrategier og «gamlemåten». Med mengdetrening.', '什么是乘法、乘法表、小窍门、乘 10/100/1000、计算策略和竖式计算。含大量练习。'],
   links:[['multiplikasjon.html#/drill', '🏋️ Mengdetrening', '大量练习'], ['mult-ark.html', '📝 Skriveark', '练习纸'], ['docs/gange-jukselapp.pdf', '🧾 Jukselapp', '速查表'], ['multiplikasjon-laerer.html', '👩‍🏫 Lærer', '教师页']]},
  {section:'matte', id:'geometri', href:'geometri.html', sum:'geo', emoji:'📐', color:'#3b82f6',
   no:'Geometri', zh:'几何',
   desc:['Matematikk 4, kapittel 4: figurer, kanter og hjørner, romfigurer, nett og klosser, vinkler.', '数学 4 年级第 4 章：图形、边和顶点、立体图形、展开图和小方块、角。'],
   links:[['geo-ark.html', '📝 Skriveark', '练习纸'], ['docs/geometri-jukselapp.pdf', '🧾 Jukselapp', '速查表'], ['geometri-laerer.html', '👩‍🏫 Lærer', '教师页']]},
  {section:'matte', id:'gange', href:'gange.html', sum:null, emoji:'🎯', color:'#a855f7',
   no:'Gangespill (rask trening)', zh:'乘法小游戏（快速练习）',
   desc:['Raskt spill med gangetabellen 2–10: poeng, statistikk og hjelp med baller.', '乘法表 2–10 的快速小游戏：积分、统计和小球提示。'], links:[]},
  // Norsk Voksenopplæring: norsk for kinesisktalende voksne (norsk, engelsk og kinesisk)
  {section:'voksen', id:'vox-top100', href:'voksen.html#/deck/top:1-100', sum:'vox_top100', unit:['ord lært', '个词已学会'], emoji:'🔟', color:'#0f766e',
   no:'De 100 vanligste ordene', zh:'最常用的 100 个词',
   desc:['De viktigste ordene på norsk, med uttale, forklaring, eksempel og quiz. Norsk, engelsk og kinesisk.', '挪威语最重要的词：发音、详细解释、例句和测验。挪威语、英语和中文。'],
   links:[['voksen.html#/learn/top:1-100', '🆕 Lær nye ord', '学新词'], ['voksen.html#/quiz/top:1-100', '🧠 Quiz', '测验']]},
  {section:'voksen', id:'vox-top500', href:'voksen.html#/deck/top:1-500', sum:'vox_top500', unit:['ord lært', '个词已学会'], emoji:'5️⃣', color:'#0d9488',
   no:'De 500 vanligste ordene', zh:'最常用的 500 个词',
   desc:['De 500 mest brukte ordene i pakker på 50. Smart repetisjon av det du glemmer.', '最常用的 500 个词，每 50 个一组。智能复习容易忘记的词。'],
   links:[['voksen.html#/quiz/top:1-500', '🧠 Quiz', '测验']]},
  {section:'voksen', id:'vox-words', href:'voksen.html#/', sum:'vox_words', unit:['ord lært', '个词已学会'], emoji:'🧺', color:'#14b8a6',
   no:'Hverdagsord', zh:'日常词汇',
   desc:['Dyr, fisk, mat, klær, skog, kroppen, helse, rom og utstyr i huset, by og transport og mer.', '动物、鱼、食物、衣服、森林、身体、健康、房间和家用物品、城市和交通等。'],
   links:[['voksen.html#/words', '🔎 Ordliste', '词汇表']]},
  {section:'voksen', id:'vox-phrases', href:'voksen.html#/', sum:'vox_phrases', unit:['setninger lært', '个句子已学会'], emoji:'💬', color:'#7c3aed',
   no:'Hverdagssetninger', zh:'日常句子',
   desc:['Setninger du trenger: i butikken, hos legen, på apoteket, buss og tog, NAV, bolig, telefon og bank.', '日常需要的句子：商店、看医生、药店、公交和火车、NAV、住房、电话和银行。'],
   links:[['voksen.html#/sound', '🔤 Uttale', '发音'], ['voksen.html#/settings', '⚙️ Stemme', '语音设置']]}
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

/* ---------- fremgang ---------- */
function progress(p){
  if(p.sum){ const s = A.store.get('sum_' + p.sum, null); return s && s.total ? s : null; }
  try{ const g = JSON.parse(localStorage.getItem('gange_v1')); if(g && g.facts){ const n = Object.keys(g.facts).length; return {pts:g.points, n}; } }catch(e){}
  return null;
}
const fmt = n => String(Math.round(n * 10) / 10).replace('.', ',');

function card(p){
  const pr = progress(p), pct = pr && pr.total ? Math.round(pr.done / pr.total * 100) : 0;
  let st = '';
  if(pr && pr.total){ const u = p.unit; st = `<div class="mbar"><i style="width:${pct}%"></i></div><div class="small-note" style="text-align:left">${u ? bi(`${pr.done} av ${pr.total} ${u[0]}`, `${pr.done} / ${pr.total} ${u[1]}`) : bi(`${pr.done} av ${pr.total} steg fullført`, `已完成 ${pr.done} / ${pr.total} 步`)}</div>`; }
  else if(pr && pr.pts != null) st = `<div class="small-note" style="text-align:left">${bi(`⭐ ${fmt(pr.pts)} poeng`, `⭐ ${fmt(pr.pts)} 分`)}</div>`;
  else st = `<div class="small-note" style="text-align:left">${bi('Ikke startet ennå', '还没有开始')}</div>`;
  const el = h('div', {class:'mod hubcard', style:`--c:${p.color}`, tabindex:'0', role:'link', onclick:() => { location.href = p.href; }, html:
    `<div class="em">${p.emoji}</div><h3>${bi(p.no, p.zh)}</h3><div class="hubdesc">${bi(p.desc[0], p.desc[1])}</div>${st}
     <div class="hubgo"><span class="btn"><span class="bi"><span class="no">${pr && pr.done ? '▶ Fortsett' : '▶ Start'}</span><span class="zh">${pr && pr.done ? '继续' : '开始'}</span></span></span></div>
     <div class="hublinks">${p.links.map(l => `<a class="pill" href="${l[0]}" ${/\.pdf$/.test(l[0]) ? 'target="_blank"' : ''}><span class="bi"><span class="no">${l[1]}</span><span class="zh">${l[2]}</span></span></a>`).join('')}</div>`});
  el.addEventListener('keydown', e => { if(e.key === 'Enter') location.href = p.href; });
  el.querySelectorAll('.hublinks a').forEach(a => a.addEventListener('click', e => e.stopPropagation()));
  return el;
}

function build(){
  const root = h('div');
  const last = A.store.get('last', null), lp = last && PROGRAMS.find(p => p.sum === last.s);
  root.innerHTML = `<div class="hero"><div class="big-emoji">🎓</div><div class="grow"><h1>${bi('Hva vil du lære i dag?', '今天想学什么？')}</h1>
      <div>${bi('Velg et fag. Litt hver dag!', '选一个科目。每天一点点！')}</div></div>
      ${lp ? `<a class="btn big sec" href="${last.href || lp.href}" style="text-decoration:none"><span class="bi"><span class="no">▶ Fortsett: ${lp.no}</span><span class="zh">继续：${lp.zh}</span></span></a>` : ''}</div>
    <div class="card hublang"><div class="vl-row"><span class="vl-lab">${bi('Opplesing', '朗读')}</span>${A.optGroup('speak')}</div>
      <div class="vl-row"><span class="vl-lab">${bi('Tekst', '文字')}</span>${A.optGroup('lang')}</div>
      <div class="small-note">${bi('Norsk er hovedspråket. Kinesisk er støtte.', '挪威语是主要语言，中文是辅助。')}</div></div>`;
  SECTIONS.forEach(sec => {
    const list = PROGRAMS.filter(p => p.section === sec.id);
    if(!list.length) return;
    root.append(h('h2', {class:'hubsec', style:`color:${sec.color}`, html:`${sec.emoji} ${bi(sec.no, sec.zh)}`}));
    const grid = h('div', {class:'grid'}); list.forEach(p => grid.append(card(p))); root.append(grid);
  });
  app.innerHTML = ''; app.append(root);
  A.bindOptGroups(root);
}
A.applyLang(); syncPills(); build();
})();
