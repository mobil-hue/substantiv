#!/usr/bin/env node
/* Samler alle tekstene i gangesystemet som skal oversettes.
 * Går gjennom appen i nettleseren med støttespråk = kinesisk og lagrer hver norske tekst (tall byttet med #).
 * Skriver tools/i18n/master.json ([{id, no, zh}]) og js/i18n/keys.js (nøkkel → id). Id-ene er stabile:
 * eksisterende id-er beholdes, nye legges til bakerst. Kjør fra repo-roten: node tools/i18n/collect.js
 * Tester dekning for et språk: node tools/i18n/collect.js --check th
 */
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const CHECK = process.argv.includes('--check') ? process.argv[process.argv.indexOf('--check') + 1] : null;

function serve(){
  const types = {'.html':'text/html;charset=utf-8', '.js':'text/javascript;charset=utf-8', '.css':'text/css', '.woff2':'font/woff2'};
  return new Promise(res => { const s = http.createServer((q, r) => { const p = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
    if(!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()){ r.writeHead(404); r.end(); return; }
    r.writeHead(200, {'Content-Type':types[path.extname(p)] || 'application/octet-stream'}); fs.createReadStream(p).pipe(r); }).listen(0, '127.0.0.1', () => res(s)); });
}

(async () => {
  const server = await serve(), base = `http://127.0.0.1:${server.address().port}/gangesystem.html`;
  const browser = await chromium.launch(), ctx = await browser.newContext({ viewport: { width: 420, height: 900 } });
  await ctx.addInitScript(sup => {
    // samle først etter at gangesystemet er lastet (hopper over substantiv-tekstene som bygges ved innlasting)
    Object.defineProperty(window, 'COLLECT_KEYS', { get(){ return !!window.GS; } });
    localStorage.setItem('sub_settings', JSON.stringify({lang:'both', speak:'no', rate:.85, pinyin:false, auto:false, v:2, sup}));
  }, CHECK || 'zh');
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  const go = async h => { await p.goto(base + h); await p.waitForTimeout(250); };
  const grab = () => p.evaluate(() => ({ c: window.App.collected || {}, m: window.App.missingKeys || {} }));
  const all = {}, miss = {};
  const take = async () => { const g = await grab(); Object.assign(all, g.c); Object.assign(miss, g.m); };
  const answer = async ok => {
    const mode = await p.evaluate(() => document.querySelector('.gchoice') ? 'choice' : 'type');
    const eq = await p.evaluate(() => document.querySelector('.gq-eq span').textContent), m = eq.match(/(\d+) × (\d+)/), ans = m[1] * m[2];
    if(mode === 'choice'){ const vals = await p.$$eval('.gchoice', bs => bs.map(x => +x.dataset.v)); await p.click(`.gchoice[data-v="${ok ? ans : vals.find(x => x !== ans)}"]`); }
    else { for(const ch of String(ok ? ans : ans + 3)) await p.click(`.gkey[data-k="${ch}"]`); await p.click('.gkey[data-k="ok"]'); }
  };

  // forside + utforsker
  await go('#/'); await p.waitForSelector('.gs-home');
  for(const n of ['1', '2', '3', '4', '5', '6', '7', 'all']) await p.click(`.gx-st[data-n="${n}"]`);
  await p.click('#gxTbl td[data-a="7"][data-b="9"]');
  await p.click('#pSup'); await p.waitForSelector('.lm-list'); await take(); await p.click('#lmClose');
  await take();
  // alle regnestykkene (forklaringer) – dekker alle regel-maler og triks
  await p.evaluate(() => { for(let a = 1; a <= 10; a++) for(let b = 1; b <= 10; b++){ const d = document.createElement('div'); d.innerHTML = window.GS.ruleHTML(a, b, true); } });
  await take();
  // videoer
  for(const id of ['gs_system', 'gs_mirror', 'gs_easy', 'gs_five', 'gs_square', 'gs_nine', 'gs_learn', 'gs_which']){
    await go('#/video/' + id); await p.waitForSelector('.vwrap');
    await p.evaluate(id => { const A = window.App, V = A.VIDEOS[id]; A.trx(V.no, V.zh); V.scenes.forEach(s => A.trx(s.no, s.zh)); }, id);
    if(id === 'gs_system'){ await p.click('.start'); await p.click('.pp'); const n = await p.$$eval('.dots i', d => d.length); for(let i = 0; i < n; i++) await p.click('.next'); await p.waitForSelector('.startcard'); }
    await take();
  }
  // oppsett for alle moduser
  for(const r of ['#/train/all', '#/train/nine', '#/cards/learn', '#/speed', '#/spot', '#/mirror']){ await go(r); await p.waitForSelector('#sStart'); await take(); }
  // trening: ❓, hjelp, riktig, feil, forklar-etter-svar, skriving
  await go('#/train/all'); await p.waitForSelector('#sStart');
  await p.click('.optgrp[data-r="help"] button[data-k="show"]'); await p.click('.optgrp[data-r="input"] button[data-k="type"]'); await p.check('#sExplain');
  await p.click('#sStart'); await p.waitForSelector('.gq');
  await p.click('#gHow').catch(() => {}); await answer(true); await take();
  await p.waitForSelector('#gNext'); await p.click('#gNext'); await answer(false); await take(); await p.click('#gNext');
  for(let i = 0; i < 40 && !(await p.$('.end')); i++){ await answer(true); await p.waitForTimeout(150); const nx = await p.$('#gNext'); if(nx) await nx.click(); else await p.waitForTimeout(950); }
  await p.waitForSelector('.end', {timeout:8000}); await take();
  await go('#/train/nine'); await p.click('.optgrp[data-r="help"] button[data-k="ask"]'); await p.click('.optgrp[data-r="input"] button[data-k="choice"]'); await p.click('#sStart'); await p.waitForSelector('#gAsk');
  await p.click('#gAsk'); await p.click('#gHow'); await answer(false); await take();
  // regelspotter, kort, speilvendte
  await go('#/spot'); await p.click('#sStart'); await p.waitForSelector('.gsp'); await p.click('.gsp[data-g="learn"]'); await p.waitForSelector('#gNext'); await take();
  for(let i = 0; i < 25 && !(await p.$('.end')); i++){ const nx = await p.$('#gNext'); if(nx) await nx.click(); const bt = await p.$('.gsp:not([disabled])'); if(bt) await bt.click(); await p.waitForTimeout(80); }
  await take();
  await go('#/cards/learn'); await p.click('#sStart'); await p.click('#gShow'); await p.waitForSelector('#gYes'); await take();
  for(let i = 0; i < 25 && !(await p.$('.end')); i++){ await p.click('#gNo').catch(() => {}); const sh = await p.$('#gShow'); if(sh) await sh.click(); await p.waitForTimeout(60); }
  await take();
  await go('#/mirror'); await p.click('#sStart'); await p.waitForSelector('.gq'); await answer(false); await take();
  // fartsrunde til slutt (60 s)
  await go('#/speed'); await p.click('#sStart'); await p.waitForSelector('.gq'); await answer(true);
  await p.waitForSelector('.end', {timeout:75000}); await take();
  // fremgang (med data) og tilbakestilling
  await go('#/stats'); await p.waitForSelector('.gs-stats'); await take();

  await browser.close(); server.close();
  if(errs.length) console.log('SIDEFEIL:', errs.slice(0, 5));

  if(CHECK){   // dekningstest for ett språk
    const known = new Set(JSON.parse(fs.readFileSync(path.join(__dirname, 'master.json'), 'utf8')).map(e => e.no));
    const keys = Object.keys(miss).filter(k => k.startsWith(CHECK + '|')).map(k => k.slice(CHECK.length + 1)).filter(k => known.has(k));
    const fresh = Object.keys(all).filter(k => !known.has(k));
    console.log(`${CHECK}: ${Object.keys(all).length} tekster funnet, ${keys.length} mangler oversettelse` + (fresh.length ? `, ${fresh.length} nye tekster (kjør collect.js uten --check)` : ''));
    fresh.slice(0, 20).forEach(k => console.log('  ny:', k));
    keys.slice(0, 60).forEach(k => console.log('  mangler:', k));
    return;
  }
  const mp = path.join(__dirname, 'master.json');
  const old = fs.existsSync(mp) ? JSON.parse(fs.readFileSync(mp, 'utf8')) : [];
  const byNo = new Map(old.map(e => [e.no, e])); let next = old.reduce((m, e) => Math.max(m, e.id + 1), 0), added = 0;
  Object.keys(all).sort().forEach(no => { if(!byNo.has(no)){ const e = {id:next++, no, zh:all[no].zh, ex:all[no].ex}; old.push(e); byNo.set(no, e); added++; } });
  fs.writeFileSync(mp, JSON.stringify(old, null, 1));
  fs.mkdirSync(path.join(ROOT, 'js', 'i18n'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'js', 'i18n', 'keys.js'), '/* Generert av tools/i18n/collect.js. Nøkkel = norsk tekst (tall → #), verdi = id. */\nObject.assign(window.App.KEYS, ' + JSON.stringify(Object.fromEntries(old.map(e => [e.no, e.id]))) + ');\n');
  console.log(`${old.length} tekster totalt (${added} nye) → tools/i18n/master.json og js/i18n/keys.js`);
})().catch(e => { console.error('FEIL:', e.message); process.exit(1); });
