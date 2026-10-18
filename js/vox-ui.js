(function(){
'use strict';
/* Norsk Voksenopplæring – visninger: oversikt, pakker, ordliste, quiz-oppsett, statistikk, uttale og innstillinger. */
const A = window.App, V = A.Vox, Q = V.Quiz, B = V.Build, {h, esc} = A;
const T = (en, zh) => A.bi(en, zh);
const app = document.getElementById('app');
const R = {};
const DEF_Q = {count:20, input:'mix', auto:true, smart:true, fast:false, modes:['rec', 'rev', 'lmean', 'lword', 'cloze', 'gender', 'forms', 'phear', 'psay', 'pbuild', 'pcloze', 'ptype', 'pdict'], specs:['top:1-100']};

/* ---------- små byggeklosser ---------- */
const dtitle = d => `<span class="dt-no">${esc(d.no)}</span><span class="dt-tr"><span class="m-en">${esc(d.en)}</span><span class="m-zh">${esc(d.zh)}</span></span>`;
const vbar = p => p.n ? `<div class="vbar"><i class="s" style="width:${100 * p.sure / p.n}%"></i><i class="k" style="width:${100 * p.known / p.n}%"></i><i class="l" style="width:${100 * p.learn / p.n}%"></i></div>` : '';
const crumb = (href, en, zh) => `<a class="crumb" href="${href}">← ${T(en, zh)}</a>`;
const itemHtml = it => it.type === 'p' ? esc(it.nb) : V.dispHtml(it);
const speechNote = function(){
  const s = V.speechInfo();
  if(!s.supported) return `<div class="vwarn-box">${T('This browser cannot read aloud. Use Chrome, Edge or Safari for the best results.', '此浏览器不支持朗读。请使用 Chrome、Edge 或 Safari 以获得最佳效果。')}</div>`;
  if(!s.voice) return `<div class="vwarn-box">${T('No Norwegian voice found on this device. Sound may be wrong or missing.', '这台设备上没有找到挪威语语音，声音可能不对或没有声音。')} <a href="#/settings">${T('How to add one', '如何添加')}</a></div>`;
  return '';
};
const goto = hash => { if(location.hash === hash) route(); else location.hash = hash; };

/* ---------- plan for dagens økt ---------- */
function dailyPlan(){
  const track = A.store.get('vox_track', ['top:1-100']), now = Date.now();
  const due = [...V.words, ...V.phrases].map(x => x.id).filter(id => V.isDue(id, now));
  const fresh = V.resolveAll(track).filter(id => V.srs.box(id) === 0);
  return {due, fresh, track};
}
function startSession(cfg){
  const hooks = {
    onExit:() => route(),
    onAgain:() => startSession(cfg),
    onPractice:ids => startSession(Object.assign({}, cfg, {ids, count:Math.max(6, ids.length * 2), smart:false, timed:0, fast:false, title:{en:'Practise the mistakes', zh:'练习错题'}}))
  };
  Q.run(app, cfg, hooks); window.scrollTo(0, 0);
}
const quizCfg = (ids, over) => { const s = Object.assign({}, DEF_Q, A.store.get('vox_quiz', {})); return Object.assign({title:{en:'Quiz', zh:'测验'}, ids, count:s.count, modes:s.modes && s.modes.length ? s.modes : DEF_Q.modes, input:s.input, auto:s.auto, smart:s.smart, fast:false, timed:0}, over || {}); };

/* ---------- dagens ord (samme ord hele dagen) ---------- */
function wordOfTheDay(){
  const key = V.daily.key(); let seed = 0; for(const c of key) seed = (seed * 31 + c.charCodeAt(0)) | 0;
  const pool = V.words.filter(x => x.ex && V.status(x.id) !== 'sure');
  if(!pool.length) return null;
  const rnd = A.seeded(seed);
  return pool[Math.floor(rnd() * pool.length)];
}

/* ================= Oversikt ================= */
R[''] = function(){
  const plan = dailyPlan(), today = V.daily.today(), streak = V.daily.streak(), wod = wordOfTheDay();
  const nNew = Math.min(6, plan.fresh.length), nDue = plan.due.length;
  const root = h('div');
  const topAll = V.top.map(w => w.id);
  const cardTop = (spec, emoji, en, zh, no, ids) => {
    const p = V.progress(ids);
    return `<a class="mod vcard-d" href="#/deck/${spec}" style="--c:#0f766e"><div class="em">${emoji}</div><h3>${esc(no)}<small>${T(en, zh)}</small></h3>${vbar(p)}
      <div class="small-note" style="text-align:left">${T(`${p.done} of ${p.n} words known`, `已掌握 ${p.done} / ${p.n} 个词`)}</div></a>`;
  };
  const packs = V.topPacks().map(spec => {
    const [a, b] = spec.slice(4).split('-'), p = V.progress(V.resolve(spec)), pct = p.n ? Math.round(100 * p.done / p.n) : 0;
    return `<a class="pack" href="#/deck/${spec}" style="--p:${pct}%" title="${pct}%"><b>${a}–${b}</b><small>${pct}%</small></a>`;
  }).join('');
  const deckCard = d => { const ids = d.ids, p = V.progress(ids);
    return `<a class="mod vcard-d" href="#/deck/${d.id}" style="--c:${d.kind === 'phrases' ? '#7c3aed' : '#0d9488'}"><div class="em">${d.emoji}</div><h3>${dtitle(d)}</h3>${vbar(p)}
      <div class="small-note" style="text-align:left">${T(`${p.done} / ${p.n} known`, `已掌握 ${p.done} / ${p.n}`)}${p.due ? ` · <b class="duetag">${T(`${p.due} due`, `${p.due} 个待复习`)}</b>` : ''}</div></a>`; };
  const words = V.decks.filter(d => d.kind === 'words'), phrases = V.decks.filter(d => d.kind === 'phrases');
  root.innerHTML = `
    <div class="hero vhero"><div class="big-emoji">🧑‍🏫</div><div class="grow"><h1>${T('Norwegian for adults', '成人挪威语')}</h1>
      <div>${T('Words and sentences for daily life in Norway — with sound, quizzes and smart repetition.', '在挪威日常生活所需的单词和句子——有发音、测验和智能复习。')}</div></div></div>
    ${speechNote()}
    <div class="card vdaily"><div class="vd-l"><h2>${T("Today's session", '今日练习')}</h2>
      <div class="vd-nums"><span><b>${nDue}</b> ${T('to review', '待复习')}</span><span><b>${nNew}</b> ${T('new words', '新词')}</span><span><b>${today[0]}</b> ${T('answers today', '今天已答')}</span><span><b>${streak}</b> ${T('day streak', '连续天数')}</span></div>
      <div class="small-note" style="text-align:left">${T('Smart: words you find difficult come back more often. Start with the Top 100 and work your way on.', '智能安排：难的词会更频繁地出现。先学最常用的 100 个词，再逐步往后。')}</div></div>
      <div class="row vd-r"><button type="button" class="btn big" id="vDaily"><span class="bi"><span class="no">▶ Start</span><span class="zh">开始</span></span></button>
        <a class="btn sec" href="#/quiz" style="text-decoration:none"><span class="bi"><span class="no">⚙️ Custom quiz</span><span class="zh">自选测验</span></span></a></div></div>
    ${wod ? `<div class="card vwod"><div class="small-note" style="text-align:left">☀️ ${T('Word of the day', '今日单词')}</div>
      <div class="vd-head"><span class="vd-nb">${V.dispHtml(wod)}</span>${V.spkItem(wod)}</div><div class="vd-mean">${V.meanHtml(wod)}</div>
      <div class="vd-ex"><div class="vd-exnb">${V.exHtml(wod)} ${V.spk(wod.ex)}</div><div class="vd-extr"><span class="m-en">${esc(wod.exEn)}</span><span class="m-zh">${esc(wod.exZh)}</span></div></div>
      <details class="vq-more"><summary>${T('Forms and notes', '词形和说明')}</summary>${V.detailHtml(wod, {only:'extra'})}</details></div>` : ''}
    <details class="card vhow"><summary>ℹ️ ${T('How it works', '使用方法')}</summary><ol>
      <li><b>${T('Learn', '学习')}</b> — ${T('new words come with a card: sound, forms, an example and notes.', '新词配有单词卡：发音、词形变化、例句和说明。')}</li>
      <li><b>${T('Quiz', '测验')}</b> — ${T('easy exercises first (multiple choice, listening), then harder ones (writing, dictation, word forms). You choose the exercise types and how to answer.', '先做简单题（选择题、听力），再做难题（书写、听写、词形变化）。题型和答题方式由你选择。')}</li>
      <li><b>${T('Repeat', '复习')}</b> — ${T('words return after 10 minutes, 1 day, 3 days, a week … Mistakes come back sooner.', '单词会在 10 分钟、1 天、3 天、一周……后再次出现，答错的会更快回来。')}</li>
      <li><b>${T('Colours', '颜色')}</b> — ${T('grey = new, yellow = learning, light green = known, dark green = sure.', '灰色＝未学，黄色＝学习中，浅绿＝已掌握，深绿＝很熟。')}</li>
      <li>🔊 ${T('plays a word, 🐢 plays it slowly. Pick a voice and speed under ⚙️.', '点 🔊 听发音，点 🐢 听慢速。在 ⚙️ 里选择语音和语速。')}</li></ol></details>
    <h2 class="hubsec">🔟 ${T('Most frequent words', '最常用的词')}</h2>
    <div class="grid">${cardTop('top:1-100', '🔟', 'The 100 most frequent words', '最常用的 100 个词', 'Topp 100', V.resolve('top:1-100'))}${cardTop('top:1-' + V.top.length, '5️⃣', 'The ' + V.top.length + ' most frequent words', '最常用的 ' + V.top.length + ' 个词', 'Topp ' + V.top.length, topAll)}</div>
    <div class="packs-wrap"><div class="small-note" style="text-align:left">${T('Study in packs of 50 words:', '每 50 个词一组学习：')}</div><div class="packs">${packs}</div></div>
    <h2 class="hubsec">🧺 ${T('Everyday words', '日常词汇')}</h2><div class="grid">${words.map(deckCard).join('')}</div>
    <h2 class="hubsec">💬 ${T('Everyday sentences', '日常句子')}</h2><div class="grid">${phrases.map(deckCard).join('')}</div>
    <h2 class="hubsec">🧰 ${T('Tools', '工具')}</h2>
    <div class="row" style="justify-content:flex-start"><a class="btn sec" href="#/words" style="text-decoration:none"><span class="bi"><span class="no">🔎 Word list</span><span class="zh">词汇表</span></span></a>
      <a class="btn sec" href="#/sound" style="text-decoration:none"><span class="bi"><span class="no">🔤 Sounds &amp; alphabet</span><span class="zh">发音和字母表</span></span></a>
      <a class="btn sec" href="#/stats" style="text-decoration:none"><span class="bi"><span class="no">📊 My progress</span><span class="zh">我的进度</span></span></a>
      <a class="btn sec" href="#/settings" style="text-decoration:none"><span class="bi"><span class="no">⚙️ Settings &amp; voice</span><span class="zh">设置和语音</span></span></a></div>
    <p class="small-note vcredit">${T('Ranking of the most frequent words: Norwegian film subtitles (OpenSubtitles 2018, hermitdave/FrequencyWords, CC BY-SA 4.0), grouped by lemma and edited for learners. Words, translations and examples were written for this app; please report mistakes.', '最常用词的排名依据：挪威语电影字幕（OpenSubtitles 2018，hermitdave/FrequencyWords，CC BY-SA 4.0），按词条归并并为学习者做了整理。单词、翻译和例句均为本应用编写，发现错误请告知。')}</p>`;
  app.innerHTML = ''; app.append(root);
  root.querySelector('#vDaily').onclick = () => {
    plan.wide = V.resolveAll(plan.track).slice(0, 300);
    const hooks = {onExit:() => route(), onAgain:() => route(), onPractice:ids => startSession(quizCfg(ids, {title:{en:'Practise the mistakes', zh:'练习错题'}, smart:false, count:Math.max(6, ids.length * 2)}))};
    if(!Q.daily(app, plan, hooks, quizCfg([], {input:'mix', modes:DEF_Q.modes}))) goto('#/deck/top:1-100');
    else window.scrollTo(0, 0);
  };
};

/* ================= Pakke / liste ================= */
function rowHtml(it){
  const st = V.status(it.id);
  return `<div class="vrow" data-id="${esc(it.id)}"><div class="vrow-main"><span class="dot st-${st}" title="${st}"></span>${it.rank ? `<small class="rk">${it.rank}</small>` : ''}<div class="vrow-nb">${itemHtml(it)}</div><div class="vrow-mean">${V.meanHtml(it)}</div>${V.spkItem(it, {noSlow:true})}<span class="chev">▾</span></div><div class="vrow-detail"></div></div>`;
}
function bindRows(root){
  root.querySelectorAll('.vrow-main').forEach(m => { m.onclick = e => {
    if(e.target.closest('[data-say]')) return;
    const row = m.parentElement, open = row.classList.toggle('open'), d = row.querySelector('.vrow-detail');
    if(open && !d.innerHTML){ const it = V.item(row.dataset.id); d.innerHTML = V.detailHtml(it, {progress:true}); }
  }; });
}
R.deck = function(spec){
  const info = V.specInfo(spec), ids = V.resolve(spec), items = ids.map(V.item).filter(Boolean);
  const p = V.progress(ids), root = h('div');
  A.store.set('vox_track', [spec]);
  const isTop = spec.startsWith('top:'), isPhrase = items.length && items[0].type === 'p';
  const packs = isTop ? V.topPacks().map(s => { const [a, b] = s.slice(4).split('-'); return `<a class="pack${s === spec ? ' cur' : ''}" href="#/deck/${s}"><b>${a}–${b}</b></a>`; }).join('') : '';
  root.innerHTML = `${crumb('#/', 'Home', '首页')}
    <div class="vdeckhead"><div class="em">${info.emoji}</div><div><h1>${esc(info.no)}</h1><div class="gloss"><span class="m-en">${esc(info.en)}</span><span class="m-zh">${esc(info.zh)}</span></div></div></div>
    ${vbar(p)}<div class="vsum"><span><i class="d sure"></i>${T(`${p.sure} sure`, `${p.sure} 熟练`)}</span><span><i class="d known"></i>${T(`${p.known} known`, `${p.known} 已掌握`)}</span><span><i class="d learn"></i>${T(`${p.learn} learning`, `${p.learn} 学习中`)}</span><span><i class="d new"></i>${T(`${p.fresh} new`, `${p.fresh} 未学`)}</span>${p.due ? `<span class="duetag">⏰ ${T(`${p.due} due`, `${p.due} 个待复习`)}</span>` : ''}</div>
    ${isTop ? `<div class="packs" style="margin:8px 0">${packs}</div>` : ''}
    ${speechNote()}
    <div class="row vact" style="justify-content:flex-start">
      <button type="button" class="btn big" id="dLearn"${p.fresh ? '' : ' disabled'}><span class="bi"><span class="no">🆕 Learn new ${isPhrase ? 'sentences' : 'words'} (${p.fresh})</span><span class="zh">学习新${isPhrase ? '句子' : '词'}（${p.fresh}）</span></span></button>
      <button type="button" class="btn" id="dQuiz"><span class="bi"><span class="no">🧠 Quiz</span><span class="zh">测验</span></span></button>
      <button type="button" class="btn sec" id="dCards"><span class="bi"><span class="no">🃏 Flashcards</span><span class="zh">单词卡</span></span></button>
      <a class="btn sec" href="#/quiz/${encodeURIComponent(spec)}" style="text-decoration:none"><span class="bi"><span class="no">⚙️ Choose exercises</span><span class="zh">选择题型</span></span></a></div>
    <div class="card vfilter"><input type="search" class="ans" id="dQ" placeholder="🔎 …" aria-label="search" style="width:100%;font-size:1.1rem">
      <div class="optgrp" id="dF"><button type="button" class="pill on" data-f="all">${T('All', '全部')}</button><button type="button" class="pill" data-f="new">${T('New', '未学')}</button><button type="button" class="pill" data-f="learn">${T('Learning', '学习中')}</button><button type="button" class="pill" data-f="known">${T('Known', '已掌握')}</button></div></div>
    <div class="vlist" id="dList">${items.map(rowHtml).join('')}</div>`;
  app.innerHTML = ''; app.append(root);
  bindRows(root);
  root.querySelector('#dLearn').onclick = () => goto('#/learn/' + encodeURIComponent(spec));
  root.querySelector('#dQuiz').onclick = () => startSession(quizCfg(ids, {title:{en:info.en, zh:info.zh}}));
  root.querySelector('#dCards').onclick = () => startSession(quizCfg(ids, {title:{en:'Flashcards', zh:'单词卡'}, modes:['card'], input:'mix', auto:false}));
  let f = 'all';
  const apply = () => {
    const q = V.norm(root.querySelector('#dQ').value);
    root.querySelectorAll('.vrow').forEach(r => {
      const it = V.item(r.dataset.id), st = V.status(r.dataset.id);
      const okF = f === 'all' || (f === 'new' && st === 'new') || (f === 'learn' && st === 'learn') || (f === 'known' && (st === 'known' || st === 'sure'));
      r.classList.toggle('hidden', !(okF && (!q || it.hay.includes(q))));
    });
  };
  root.querySelector('#dQ').oninput = apply;
  root.querySelectorAll('#dF [data-f]').forEach(b => b.onclick = () => { f = b.dataset.f; root.querySelectorAll('#dF [data-f]').forEach(x => x.classList.toggle('on', x === b)); apply(); });
};

/* ================= Lær nye ord ================= */
R.learn = function(spec){
  A.store.set('vox_track', [spec]);
  const hooks = {onExit:() => { location.hash = '#/deck/' + encodeURIComponent(spec); }, onPractice:ids => startSession(quizCfg(ids, {title:{en:'Practise the mistakes', zh:'练习错题'}, smart:false, count:Math.max(6, ids.length * 2)}))};
  if(!Q.learnBatch(app, [spec], hooks)){
    app.innerHTML = `<div class="end"><div class="big-emoji">🎉</div><h2>${T("You have seen all words in this pack", '这一组的词你都看过了')}</h2>
      <div class="row"><a class="btn big" href="#/deck/${encodeURIComponent(spec)}" style="text-decoration:none"><span class="bi"><span class="no">▶ Back to the list</span><span class="zh">返回列表</span></span></a></div></div>`;
  }
};

/* ================= Ordliste / søk ================= */
R.words = function(){
  const root = h('div');
  const decks = V.decks.filter(d => d.kind !== 'rank');
  root.innerHTML = `${crumb('#/', 'Home', '首页')}<h1>🔎 ${T('Word list', '词汇表')}</h1>
    <p>${T('Search in Norwegian, English or Chinese. Tap a word for the full explanation.', '可用挪威语、英语或中文搜索。点击单词查看详细解释。')}</p>
    <div class="card"><input type="search" class="ans" id="wQ" placeholder="🔎 hund · dog · 狗" aria-label="search" style="width:100%;font-size:1.2rem">
      <div class="row" style="margin-top:8px;justify-content:flex-start;gap:8px">
        <select class="ans sel" id="wType" style="width:auto;font-size:1rem"><option value="">${'Words + sentences / 单词+句子'}</option><option value="w">${'Words / 单词'}</option><option value="p">${'Sentences / 句子'}</option></select>
        <select class="ans sel" id="wDeck" style="width:auto;font-size:1rem"><option value="">${'All lists / 全部'}</option><option value="top">${'Most frequent / 最常用'}</option>${decks.map(d => `<option value="${d.id}">${d.emoji} ${esc(d.no)}</option>`).join('')}</select>
        <select class="ans sel" id="wPos" style="width:auto;font-size:1rem"><option value="">${'Any type / 全部词类'}</option>${Object.entries(V.POS).map(([k, v]) => `<option value="${k}">${v.en} / ${v.zh}</option>`).join('')}</select></div></div>
    <div class="small-note" id="wCount" style="margin:8px 0"></div><div class="vlist" id="wList"></div>`;
  app.innerHTML = ''; app.append(root);
  const list = root.querySelector('#wList'), cnt = root.querySelector('#wCount');
  let shown = 80;
  const run = () => {
    const q = V.norm(root.querySelector('#wQ').value), ty = root.querySelector('#wType').value, dk = root.querySelector('#wDeck').value, ps = root.querySelector('#wPos').value;
    let all = [...V.words, ...V.phrases];
    if(ty) all = all.filter(x => x.type === ty);
    if(dk) all = all.filter(x => dk === 'top' ? x.rank : x.decks.includes(dk));
    if(ps) all = all.filter(x => x.pos === ps);
    if(q) all = all.filter(x => x.hay.includes(q)).sort((a, b) => (V.norm(a.nb) === q ? -1 : 0) - (V.norm(b.nb) === q ? -1 : 0) || (a.nb.toLowerCase().startsWith(q) ? -1 : 1) - (b.nb.toLowerCase().startsWith(q) ? -1 : 1));
    else all = all.slice().sort((a, b) => (a.rank || 9999) - (b.rank || 9999) || a.nb.localeCompare(b.nb, 'nb'));
    cnt.textContent = all.length + ' ✓';
    list.innerHTML = all.slice(0, shown).map(rowHtml).join('') + (all.length > shown ? `<button type="button" class="btn sec" id="wMore" style="margin:10px auto;display:block">+ ${all.length - shown}</button>` : '');
    bindRows(list);
    const more = list.querySelector('#wMore'); if(more) more.onclick = () => { shown += 120; run(); };
  };
  ['#wQ', '#wType', '#wDeck', '#wPos'].forEach(s => root.querySelector(s).oninput = () => { shown = 80; run(); });
  run();
};

/* ================= Quiz-oppsett ================= */
R.quiz = function(arg){
  const saved = Object.assign({}, DEF_Q, A.store.get('vox_quiz', {}));
  const S = Object.assign({}, saved, {specs:arg ? arg.split('+').filter(Boolean) : (saved.specs && saved.specs.length ? saved.specs : ['top:1-100'])});
  const root = h('div');
  const save = () => A.store.set('vox_quiz', S);
  const addable = () => {
    const opt = (v, label) => `<option value="${esc(v)}">${esc(label)}</option>`;
    return `<option value="">＋ ${'Add… / 添加…'}</option>
      <optgroup label="${'Most frequent / 最常用'}">${['top:1-100', 'top:1-' + V.top.length, ...V.topPacks()].map(s => opt(s, V.specInfo(s).emoji + ' ' + V.specInfo(s).no)).join('')}</optgroup>
      <optgroup label="${'Everyday words / 日常词汇'}">${V.decks.filter(d => d.kind === 'words').map(d => opt(d.id, d.emoji + ' ' + d.no)).join('')}</optgroup>
      <optgroup label="${'Sentences / 句子'}">${V.decks.filter(d => d.kind === 'phrases').map(d => opt(d.id, d.emoji + ' ' + d.no)).join('')}</optgroup>
      <optgroup label="${'Other / 其他'}">${['words', 'phrases', 'mine', 'weak'].map(s => opt(s, V.specInfo(s).emoji + ' ' + V.specInfo(s).no)).join('')}</optgroup>`;
  };
  const draw = () => {
    const ids = V.resolveAll(S.specs), nW = ids.filter(id => V.item(id) && V.item(id).type === 'w').length, nP = ids.length - nW;
    const speakOk = V.prefs.speak && A.Speech.supported;
    const modeBtn = m => {
      const inputBad = !B.inputOK(m, S.input), audioBad = m.audio && !speakOk, on = S.modes.includes(m.k) && !inputBad && !audioBad;
      return `<button type="button" class="tgl${on ? ' on' : ''}${inputBad || audioBad ? ' off' : ''}" data-m="${m.k}"${inputBad || audioBad ? ' data-dis="1"' : ''}><span class="te">${m.emoji}</span><span class="tt">${T(m.en, m.zh)}<small><span class="m-en">${esc(m.de)}</span><span class="m-zh">${esc(m.dz)}</span></small></span><span class="tc">✔</span></button>`;
    };
    root.innerHTML = `${crumb('#/', 'Home', '首页')}<h1>⚙️ ${T('Custom quiz', '自选测验')}</h1>
      <div class="card"><h3>${T('1. What do you want to practise?', '1. 练习什么？')}</h3>
        <div class="chips">${S.specs.map(s => { const i = V.specInfo(s); return `<span class="chip" style="--c:#0f766e">${i.emoji} ${esc(i.no)} <button type="button" class="chx" data-rm="${esc(s)}" title="remove">✕</button></span>`; }).join('')}</div>
        <select class="ans sel" id="qAdd" style="width:auto;font-size:1rem;margin-top:8px">${addable()}</select>
        <div class="small-note" style="text-align:left">${T(`${nW} words and ${nP} sentences selected`, `已选 ${nW} 个单词和 ${nP} 个句子`)}</div></div>
      <div class="card"><h3>${T('2. Exercise types', '2. 题型')}</h3>
        <div class="small-note" style="text-align:left">${T('Pick one or more. With «auto-level» easy exercises come first for new words.', '可多选。开启“自动难度”后，新词先做简单题。')}</div>
        ${!speakOk ? `<div class="vwarn-box">${T('Sound is off or not supported — listening exercises are hidden.', '声音已关闭或不受支持——听力题型已隐藏。')}</div>` : ''}
        <h4>${T('Words', '单词')}</h4><div class="tglgrid" id="qW">${B.MODES.filter(m => m.fam !== 'p').map(modeBtn).join('')}</div>
        <h4>${T('Sentences', '句子')}</h4><div class="tglgrid" id="qP">${B.MODES.filter(m => m.fam === 'p').map(modeBtn).join('')}</div>
        <div class="row" style="justify-content:flex-start;margin-top:8px"><button type="button" class="pill" id="qAll">${T('Select all', '全选')}</button><button type="button" class="pill" id="qNone">${T('Clear', '清除')}</button></div></div>
      <div class="card"><h3>${T('3. How do you answer?', '3. 怎么答题？')}</h3>
        <div class="optgrp" id="qIn">${[['choice', '✅ Multiple choice · 选择题'], ['type', '⌨️ Write · 输入'], ['mix', '🎲 Mixed · 混合']].map(o => `<button type="button" class="pill${S.input === o[0] ? ' on' : ''}" data-k="${o[0]}">${o[1]}</button>`).join('')}</div>
        <label class="chk"><input type="checkbox" id="qArt"${V.prefs.art ? ' checked' : ''}> ${T('Writing nouns: include the article (en / ei / et)', '写名词时带上冠词（en / ei / et）')}</label></div>
      <div class="card"><h3>${T('4. Options', '4. 选项')}</h3>
        <div class="optgrp" id="qN">${[10, 20, 40, 80].map(n => `<button type="button" class="pill${S.count === n ? ' on' : ''}" data-n="${n}">${n}</button>`).join('')}</div>
        <label class="chk"><input type="checkbox" id="qSmart"${S.smart ? ' checked' : ''}> ${T('Smart selection: repeat what I find difficult, new words step by step', '智能选题：难的多复习，新词循序渐进')}</label>
        <label class="chk"><input type="checkbox" id="qAuto"${S.auto ? ' checked' : ''}> ${T('Auto-level: easier exercises for new words, harder for known ones', '自动难度：新词用简单题，熟悉的词用难题')}</label>
        <label class="chk"><input type="checkbox" id="qFast"${S.fast ? ' checked' : ''}> ${T('⚡ Speed round: 60 seconds, multiple choice, no pauses', '⚡ 速度赛：60 秒，选择题，不停顿')}</label></div>
      <div class="row" style="margin:16px 0"><button type="button" class="btn big" id="qGo"><span class="bi"><span class="no">▶ Start</span><span class="zh">开始</span></span></button></div>
      <div class="small-note" id="qMsg" style="min-height:1.4em;color:var(--bad)"></div>`;
    root.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { S.specs = S.specs.filter(s => s !== b.dataset.rm); save(); draw(); });
    root.querySelector('#qAdd').onchange = e => { const v = e.target.value; if(v && !S.specs.includes(v)) S.specs.push(v); save(); draw(); };
    root.querySelectorAll('[data-m]').forEach(b => b.onclick = () => {
      if(b.dataset.dis) return;
      const k = b.dataset.m, i = S.modes.indexOf(k); if(i >= 0) S.modes.splice(i, 1); else S.modes.push(k); save(); draw();
    });
    root.querySelector('#qAll').onclick = () => { S.modes = B.MODES.map(m => m.k); save(); draw(); };
    root.querySelector('#qNone').onclick = () => { S.modes = []; save(); draw(); };
    root.querySelectorAll('#qIn [data-k]').forEach(b => b.onclick = () => { S.input = b.dataset.k; save(); draw(); });
    root.querySelectorAll('#qN [data-n]').forEach(b => b.onclick = () => { S.count = +b.dataset.n; save(); draw(); });
    root.querySelector('#qArt').onchange = e => { V.prefs.art = e.target.checked; V.savePrefs(); };
    root.querySelector('#qSmart').onchange = e => { S.smart = e.target.checked; save(); };
    root.querySelector('#qAuto').onchange = e => { S.auto = e.target.checked; save(); };
    root.querySelector('#qFast').onchange = e => { S.fast = e.target.checked; save(); };
    root.querySelector('#qGo').onclick = () => {
      const items = ids.map(V.item).filter(Boolean), msg = root.querySelector('#qMsg');
      if(!items.length){ msg.textContent = 'Pick something to practise. / 请先选择练习内容。'; return; }
      const input = S.fast ? 'choice' : S.input;
      const modes = S.modes.filter(k => { const m = B.mode(k); return m && B.inputOK(m, input) && items.some(it => B.applies(m, it)); });
      if(!modes.length){ msg.textContent = 'No selected exercise fits these words/sentences. / 所选题型不适用于这些内容。'; return; }
      A.store.set('vox_track', S.specs.slice(0, 1));
      startSession({title:{en:'Quiz', zh:'测验'}, ids, count:S.fast ? 200 : S.count, modes, input, auto:S.auto, smart:S.smart, fast:S.fast, timed:S.fast ? 60 : 0});
    };
  };
  save();
  app.innerHTML = ''; app.append(root); draw();
};

/* ================= Statistikk ================= */
R.stats = function(){
  const root = h('div');
  const all = [...V.words, ...V.phrases], ids = all.map(x => x.id), p = V.progress(ids);
  const days = []; for(let i = 13; i >= 0; i--){ const k = V.daily.key(Date.now() - i * 86400000), a = V.daily.d[k] || [0, 0]; days.push({k, n:a[0], ok:a[1]}); }
  const max = Math.max(10, ...days.map(d => d.n));
  const weak = V.weakIds().map(V.item).filter(Boolean).sort((a, b) => { const x = V.srs.d[a.id], y = V.srs.d[b.id]; return x[3] / x[2] - y[3] / y[2]; }).slice(0, 15);
  const decks = V.decks.map(d => ({d, p:V.progress(d.ids)}));
  root.innerHTML = `${crumb('#/', 'Home', '首页')}<h1>📊 ${T('My progress', '我的进度')}</h1>
    <div class="card"><div class="sumrow"><div><b>${p.done}</b><span>${T('words & sentences known', '已掌握的词和句')}</span></div><div><b>${p.learn}</b><span>${T('in progress', '学习中')}</span></div><div><b>${p.due}</b><span>${T('due for review', '待复习')}</span></div><div><b>${V.daily.streak()}</b><span>${T('day streak', '连续天数')}</span></div><div><b>${V.daily.total()}</b><span>${T('answers in total', '累计答题')}</span></div></div>
      ${vbar(p)}<div class="small-note">${T('Known = answered correctly again after at least one day (spaced repetition).', '“已掌握”＝隔了至少一天后再次答对（间隔复习）。')}</div></div>
    <div class="card"><h3>${T('Last 14 days', '最近 14 天')}</h3><div class="vdays">${days.map(d => `<div class="vday" title="${d.k}: ${d.n}"><i style="height:${Math.round(100 * d.n / max)}%"></i><small>${d.k.slice(8)}</small></div>`).join('')}</div></div>
    <div class="card"><h3>${T('By list', '按词表')}</h3><div class="vstat">${decks.map(({d, p}) => `<a class="vsrow" href="#/deck/${d.kind === 'rank' ? 'top:1-' + V.top.length : d.id}"><span>${d.emoji} ${esc(d.no)}</span>${vbar(p)}<small>${p.done}/${p.n}</small></a>`).join('')}</div></div>
    <div class="card"><h3>${T('My difficult ones', '我的难点')}</h3>${weak.length ? `<div class="vlist">${weak.map(rowHtml).join('')}</div><div class="row" style="margin-top:10px"><button type="button" class="btn" id="sPrac"><span class="bi"><span class="no">🎯 Practise these</span><span class="zh">练习这些</span></span></button></div>` : `<div class="small-note">${T('Nothing yet. Keep practising!', '还没有，继续练习吧！')}</div>`}</div>
    <div class="row"><button type="button" class="btn sec" id="sReset"><span class="bi"><span class="no">🗑 Reset all progress</span><span class="zh">清除所有进度</span></span></button></div>`;
  app.innerHTML = ''; app.append(root); bindRows(root);
  const pr = root.querySelector('#sPrac'); if(pr) pr.onclick = () => startSession(quizCfg(weak.map(w => w.id), {title:{en:'My difficult ones', zh:'我的难点'}, smart:false, count:Math.max(10, weak.length * 2)}));
  root.querySelector('#sReset').onclick = () => { if(confirm('Delete all progress in Norwegian for adults? / 要清除“成人挪威语”的所有进度吗？')){ V.srs.reset(); V.daily.d = {}; A.store.set('vox_days', {}); V.saveSummary(); R.stats(); } };
};

/* ================= Uttale og alfabet ================= */
const SOUNDS = [
  {t:['Special vowels', '特别的元音'], intro:['Norwegian has three extra letters at the end of the alphabet: æ, ø, å. Listen and copy.', '挪威语字母表最后有三个特殊字母：æ、ø、å。多听多模仿。'], items:[
    {s:'å', say:['båt', 'gå', 'påske'], tip:['like “o” in Mandarin 哦 (ò) or English “law”', '像普通话的“哦”(ò)，或英语 law 里的 aw']},
    {s:'æ', say:['være', 'vær', 'ærlig'], tip:['an open “e”, like the “a” in English “cat”', '开口的“e”，像英语 cat 里的 a']},
    {s:'ø', say:['øl', 'søster', 'kjøre'], tip:['say “e” (诶) with rounded lips — like German ö or French “eu”', '嘴唇圆起来发“诶”——像德语 ö 或法语 eu']},
    {s:'y', say:['by', 'ny', 'hyggelig'], tip:['exactly like Mandarin ü (鱼 yú)', '和普通话的 ü（鱼 yú）一样']},
    {s:'u', say:['hus', 'ut', 'uke'], tip:['a special Norwegian vowel: lips rounded and pushed forward, tongue forward. Listen and copy.', '挪威语特有的元音：圆唇前伸，舌位靠前。多听多模仿。']}]},
  {t:['Tricky consonants', '容易出错的辅音'], intro:['Many letter groups are pronounced differently from how they look.', '很多字母组合的读音和写法不一样。'], items:[
    {s:'hv', say:['hva', 'hvor', 'hvem'], tip:['the h is silent: hva = “va”. Use English v (teeth on lip), not w.', 'h 不发音：hva 读 “va”。要用 v（上齿咬下唇），不是 w。']},
    {s:'hj  gj  lj', say:['hjem', 'hjelp', 'gjøre'], tip:['the first letter is silent; you hear “j” like English y in “yes”', '第一个字母不发音；读 “j”，像英语 yes 里的 y']},
    {s:'kj  tj', say:['kjøre', 'kjære', 'tjue'], tip:['a soft “ch” made far forward in the mouth, close to Mandarin x (谢 xiè)', '舌面靠前的轻“ch”音，接近普通话的 x（谢 xiè）']},
    {s:'sj  skj', say:['sjø', 'skje', 'sjokolade'], tip:['like English “sh” (Mandarin sh is close). Also «sk» before i, y, øy: ski, sky', '像英语 sh（接近普通话 sh）。i、y、øy 前的 sk 也读这个音：ski、sky']},
    {s:'ng', say:['lang', 'ring', 'sang'], tip:['one sound, like Mandarin -ng (e.g. 请 qǐng): do not pronounce a separate g', '一个音，像普通话的 -ng（如“请”）：不要单独读 g']},
    {s:'rs  rt  rd  rn  rl', say:['norsk', 'kart', 'bord', 'barn'], tip:['in Eastern Norwegian the r joins the next letter with the tongue curled back (retroflex) — Mandarin speakers already know this tongue position from zh, ch, sh', '东部挪威语中 r 和后面的字母连成卷舌音——说普通话的人从 zh、ch、sh 已经熟悉这个舌位']},
    {s:'b  d  g', say:['bil', 'dag', 'god'], tip:['voiced: your vocal cords vibrate (touch your throat). Mandarin b, d, g are not voiced.', '浊音：声带要振动（手摸喉咙）。普通话的 b、d、g 不是浊音。']}]},
  {t:['Silent letters', '不发音的字母'], intro:['Some letters are written but not pronounced.', '有些字母写出来但不发音。'], items:[
    {s:'d', say:['hund', 'land', 'ved'], tip:['often silent at the end after n, l or a vowel', '常在词尾 n、l 或元音后不发音']},
    {s:'t', say:['det'], tip:['«det» is pronounced “de”', '«det» 读 “de”']},
    {s:'-ig', say:['viktig', 'ferdig', 'riktig'], tip:['the g is silent: viktig = “vik-ti”', 'g 不发音：viktig 读 “vik-ti”']}]},
  {t:['Long and short vowels', '长元音和短元音'], intro:['After a vowel: ONE consonant = long vowel, TWO consonants = short vowel. This changes the word!', '元音后面：一个辅音＝长元音，两个辅音＝短元音。这会改变单词！'], items:[
    {s:'tak – takk', say:['tak', 'takk'], tip:['roof – thanks', '屋顶 – 谢谢']},
    {s:'mat – matt', say:['mat', 'matt'], tip:['food – dull', '食物 – 暗淡的']},
    {s:'hel – hell', say:['hel', 'hell'], tip:['whole – luck', '完整的 – 运气']}]},
  {t:['Melody and rhythm', '语调和节奏'], intro:['Norwegian has a sing-song melody, but no tones like Mandarin: the pitch does not change the basic word meaning. Do not use Mandarin tones. Stress the first syllable of most words, and listen a lot — copy the rhythm of whole sentences.', '挪威语有起伏的语调，但没有像普通话那样的声调：音高不会改变词的基本意思。不要套用普通话的声调。多数词重音在第一个音节。多听，模仿整句话的节奏。'], items:[
    {s:'Hvordan har du det?', say:['Hvordan har du det?'], tip:['listen to the melody of a whole sentence', '听整句话的语调']},
    {s:'Jeg heter Li, og jeg kommer fra Kina.', say:['Jeg heter Li, og jeg kommer fra Kina.'], tip:['say it after the voice', '跟着语音读']}]}
];
R.sound = function(){
  const root = h('div');
  root.innerHTML = `${crumb('#/', 'Home', '首页')}<h1>🔤 ${T('Sounds & alphabet', '发音和字母表')}</h1>${speechNote()}
    <div class="card"><h3>${T('The alphabet (29 letters)', '字母表（29 个字母）')}</h3>
      <div class="alpha">${'ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ'.split('').map(l => `<span class="${'ÆØÅ'.includes(l) ? 'sp' : ''}">${l}</span>`).join('')}</div>
      <div class="small-note" style="text-align:left">${T('Æ, Ø and Å come last. C, Q, W, X and Z are used almost only in foreign words.', 'Æ、Ø、Å 排在最后。C、Q、W、X、Z 几乎只出现在外来词中。')}</div></div>
    ${SOUNDS.map(sec => `<div class="card"><h3>${T(sec.t[0], sec.t[1])}</h3><p class="small-note" style="text-align:left">${T(sec.intro[0], sec.intro[1])}</p>
      <div class="vsounds">${sec.items.map(it => `<div class="vsnd"><div class="vs-s">${esc(it.s)}</div><div class="vs-b"><div class="vs-w">${it.say.map(w => `<button type="button" class="pill" data-say="${esc(w)}" data-force="1">🔊 ${esc(w)}</button>`).join('')}</div><div class="vs-t">${T(it.tip[0], it.tip[1])}</div></div></div>`).join('')}</div></div>`).join('')}`;
  app.innerHTML = ''; app.append(root);
};

/* ================= Innstillinger ================= */
let redrawVoices = null;
R.settings = function(){
  const root = h('div');
  const draw = () => {
    const vs = A.Speech.voices('no'), cur = A.Speech.current('no'), s = V.speechInfo();
    root.innerHTML = `${crumb('#/', 'Home', '首页')}<h1>⚙️ ${T('Settings & voice', '设置和语音')}</h1>
      <div class="card"><h3>${T('Meaning language', '释义语言')}</h3><div class="small-note" style="text-align:left">${T('Which language is shown for meanings and instructions.', '单词意思和说明使用的语言。')}</div>
        <div class="optgrp" id="sMean">${V.MEAN_OPTS.map(o => `<button type="button" class="pill${V.prefs.mean === o[0] ? ' on' : ''}" data-k="${o[0]}">${o[1]}</button>`).join('')}</div></div>
      <div class="card"><h3>🔊 ${T('Sound', '声音')}</h3>
        <label class="chk"><input type="checkbox" id="sSpeak"${V.prefs.speak ? ' checked' : ''}> ${T('Read Norwegian aloud', '朗读挪威语')}</label>
        <label class="chk"><input type="checkbox" id="sAuto"${V.prefs.auto ? ' checked' : ''}> ${T('Play automatically when a word or answer appears', '单词或答案出现时自动播放')}</label>
        <h4>${T('Norwegian voice', '挪威语语音')}</h4>
        ${vs.length ? `<select class="ans sel" id="sVoice" style="font-size:1rem"><option value="">${'Automatic / 自动'}</option>${vs.map(v => `<option value="${esc(v.name)}"${v.name === cur && (A.settings.voice || {}).no ? ' selected' : ''}>${esc(v.name)} (${esc(v.lang)}${v.local ? '' : ', online'})</option>`).join('')}</select>
          <div class="small-note" style="text-align:left">${T(`Using now: ${cur || '—'}`, `当前使用：${cur || '—'}`)}</div>` : `<div class="vwarn-box">${s.supported ? T('No Norwegian voice found.', '没有找到挪威语语音。') : T('This browser cannot read aloud.', '此浏览器不支持朗读。')}</div>`}
        <label class="chk" style="display:block">${T('Speed', '语速')}: <b id="sRv">${V.prefs.rate.toFixed(2)}</b><input type="range" id="sRate" min="0.5" max="1.1" step="0.05" value="${V.prefs.rate}" style="width:100%"></label>
        <label class="chk" style="display:block">${T('Slow button (🐢)', '慢速按钮（🐢）')}: <b id="sSv">${V.prefs.slow.toFixed(2)}</b><input type="range" id="sSlow" min="0.3" max="0.9" step="0.05" value="${V.prefs.slow}" style="width:100%"></label>
        <div class="row" style="justify-content:flex-start"><button type="button" class="btn" id="sTest"><span class="bi"><span class="no">🔊 Test voice</span><span class="zh">试听语音</span></span></button>
          <button type="button" class="pill" id="sTestSlow">🐢</button></div>
        <details class="vq-more"><summary>${T('How to add a Norwegian voice', '如何添加挪威语语音')}</summary>
          <ul class="vhelp"><li><b>Windows</b>: ${T('Settings → Time & language → Speech → Add voices → Norwegian (Bokmål). Restart the browser.', '设置 → 时间和语言 → 语音 → 添加语音 → 挪威语（书面）。重启浏览器。')}</li>
          <li><b>Android</b>: ${T('Settings → System → Languages → Text-to-speech → Google → Install voice data → Norwegian.', '设置 → 系统 → 语言 → 文字转语音 → Google → 安装语音数据 → 挪威语。')}</li>
          <li><b>iPhone / iPad</b>: ${T('Settings → Accessibility → Spoken Content → Voices → Norwegian → download “Nora” or “Henrik”.', '设置 → 辅助功能 → 朗读内容 → 声音 → 挪威语 → 下载 “Nora” 或 “Henrik”。')}</li>
          <li><b>Mac</b>: ${T('System Settings → Accessibility → Spoken Content → System voice → Manage voices → Norwegian.', '系统设置 → 辅助功能 → 朗读内容 → 系统声音 → 管理声音 → 挪威语。')}</li>
          <li><b>Chrome / Edge</b>: ${T('Online voices (Google, Microsoft) appear automatically when you are connected.', '联网时会自动出现在线语音（Google、Microsoft）。')}</li></ul></details></div>
      <div class="card"><h3>${T('Writing', '书写')}</h3>
        <label class="chk"><input type="checkbox" id="sArt"${V.prefs.art ? ' checked' : ''}> ${T('Nouns need the article (en / ei / et) when written', '书写名词时要带冠词（en / ei / et）')}</label></div>`;
    root.querySelectorAll('#sMean [data-k]').forEach(b => b.onclick = () => { V.prefs.mean = b.dataset.k; V.savePrefs(); V.applyMean(); syncPills(); draw(); });
    root.querySelector('#sSpeak').onchange = e => { V.prefs.speak = e.target.checked; V.savePrefs(); syncPills(); };
    root.querySelector('#sAuto').onchange = e => { V.prefs.auto = e.target.checked; V.savePrefs(); };
    root.querySelector('#sArt').onchange = e => { V.prefs.art = e.target.checked; V.savePrefs(); };
    const sv = root.querySelector('#sVoice'); if(sv) sv.onchange = () => { A.Speech.choose('no', sv.value); draw(); };
    root.querySelector('#sRate').oninput = e => { V.prefs.rate = +e.target.value; V.savePrefs(); root.querySelector('#sRv').textContent = V.prefs.rate.toFixed(2); };
    root.querySelector('#sSlow').oninput = e => { V.prefs.slow = +e.target.value; V.savePrefs(); root.querySelector('#sSv').textContent = V.prefs.slow.toFixed(2); };
    root.querySelector('#sTest').onclick = () => V.say('Hei! Jeg heter Nora. Hvordan har du det i dag?', {force:true});
    root.querySelector('#sTestSlow').onclick = () => V.say('Hei! Jeg heter Nora. Hvordan har du det i dag?', {force:true, slow:true});
  };
  app.innerHTML = ''; app.append(root); draw();
  redrawVoices = draw;
};

/* ================= toppknapper, ruting ================= */
function syncPills(){
  const m = document.getElementById('pMean'); m.textContent = '🌐 ' + (V.MEAN_OPTS.find(o => o[0] === V.prefs.mean) || V.MEAN_OPTS[0])[1].replace('English + 中文', 'EN + 中文').replace('English', 'EN');
  const s = document.getElementById('pSound'); s.textContent = V.prefs.speak ? '🔊' : '🔇'; s.classList.toggle('on', V.prefs.speak);
}
document.getElementById('pMean').onclick = () => { const i = V.MEAN_OPTS.findIndex(o => o[0] === V.prefs.mean); V.prefs.mean = V.MEAN_OPTS[(i + 1) % V.MEAN_OPTS.length][0]; V.savePrefs(); V.applyMean(); syncPills(); };
document.getElementById('pSound').onclick = () => { V.prefs.speak = !V.prefs.speak; V.savePrefs(); if(!V.prefs.speak) A.Speech.stop(); syncPills(); if(V.prefs.speak) V.say('Norsk opplesing', {force:true}); };
document.getElementById('logo').onclick = () => goto('#/');
document.addEventListener('click', e => {
  const b = e.target.closest('[data-say]'); if(!b) return;
  e.preventDefault(); V.say(b.dataset.say, {force:true, slow:b.dataset.slow === '1'});
});

function remember(name, arg){
  if(!['deck', 'quiz', 'learn'].includes(name)) return;
  const spec = arg.split('+')[0]; let s = 'vox_words';
  if(spec.startsWith('top:')){ const to = +spec.split('-')[1]; s = to <= 100 ? 'vox_top100' : 'vox_top500'; }
  else { const d = V.deckById.get(spec); if(d && d.kind === 'phrases') s = 'vox_phrases'; }
  A.store.set('last', {s, href:'voksen.html#/' + name + (arg ? '/' + arg : '')});
}
function route(){
  Q.stop();
  const parts = location.hash.replace(/^#\/?/, '').split('/'), name = parts[0] || '', arg = parts.slice(1).join('/');
  let a = arg; try{ a = decodeURIComponent(arg); }catch(e){}
  (R[name] || R[''])(a);
  window.scrollTo(0, 0);
  remember(name, arg);
}
window.addEventListener('hashchange', route);
A.Speech.onVoices(() => { if(redrawVoices && location.hash === '#/settings') redrawVoices(); });
V.applyMean(); syncPills();
if(V.words.length || V.phrases.length) route();
else app.innerHTML = `<div class="vwarn-box">Ingen data funnet. / No data found.</div>`;
V.route = route;
})();
