#!/usr/bin/env node
/* Bygger språkfilene for matematikk fra tabellene i tools/i18n/mt/:
 *   words.tsv   ordhjelp: norsk ord (liten bokstav) + 10 kolonner  → js/i18n/mtw-<språk>.js
 *   chrome.tsv, narration.tsv, tekst.tsv  faste tekster (meny, knapper, modultitler, nivåer), fortellertekst i videoene og skriftlige forklaringer:
 *               norsk tekst med tall som # + 10 kolonner, tall som {1} {2} i oversettelsene
 *               → js/i18n/mt-keys.js og js/i18n/mt-<språk>.js (id-er fra 100000)
 * Kolonner: no, en, sv, zh, ar, es, pl, uk, th, tl, so.  Kjør fra repo-roten: node tools/i18n/build-mt.js
 */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..'), DIR = path.join(__dirname, 'mt'), OUT = path.join(ROOT, 'js', 'i18n');
const LANGS = ['en', 'sv', 'zh', 'ar', 'es', 'pl', 'uk', 'th', 'tl', 'so'];
const rd = f => fs.existsSync(path.join(DIR, f)) ? fs.readFileSync(path.join(DIR, f), 'utf8').split('\n').filter(l => l.trim() && !l.startsWith('#!')).map(l => l.split('\t')) : [];
const js = s => JSON.stringify(String(s));
let problems = 0;
const warn = m => { problems++; if(problems <= 40) console.log('  ! ' + m); };

// ---- ordhjelp
const words = rd('words.tsv'), W = {}; LANGS.forEach(l => W[l] = {});
words.forEach(r => { if(r.length !== 11){ warn(`ord «${r[0]}»: ${r.length} kolonner (skal være 11)`); return; }
  LANGS.forEach((l, i) => { const t = r[i + 1].trim(); if(t) W[l][r[0].trim().toLowerCase()] = t; else warn(`ord «${r[0]}»: mangler ${l}`); }); });
LANGS.forEach(l => fs.writeFileSync(path.join(OUT, `mtw-${l}.js`), `/* Generert av tools/i18n/build-mt.js fra tools/i18n/mt/words.tsv. Ordhjelp (norsk → ${l}); KI-oversatt, ikke lest av morsmålsbruker. */\n(window.MTW = window.MTW || {}).${l} = ${JSON.stringify(W[l])};\n`));

// ---- faste tekster
const chrome = ['chrome.tsv', 'narration.tsv', 'tekst.tsv'].flatMap(rd), keys = {}, D = {}; LANGS.forEach(l => D[l] = {}); let id = 100000;
chrome.forEach(r => { if(r.length !== 11){ warn(`tekst «${r[0].slice(0, 40)}»: ${r.length} kolonner`); return; }
  const key = r[0].trim(), n = (key.match(/#/g) || []).length; if(keys[key] != null){ warn('dobbel: ' + key.slice(0, 40)); return; }
  keys[key] = id;
  LANGS.forEach((l, i) => { const t = r[i + 1].trim(); if(!t){ warn(`«${key.slice(0, 40)}»: mangler ${l}`); return; }
    for(let k = 1; k <= n; k++) if(!t.includes(`{${k}}`)) warn(`«${key.slice(0, 40)}» ${l}: tall {${k}} mangler`);
    D[l][id] = t; });
  id++; });
fs.writeFileSync(path.join(OUT, 'mt-keys.js'), `/* Generert av tools/i18n/build-mt.js. Nøkkel = norsk tekst (tall → #), verdi = id. */\nObject.assign(window.App.KEYS, ${JSON.stringify(keys)});\n`);
LANGS.forEach(l => fs.writeFileSync(path.join(OUT, `mt-${l}.js`), `/* Generert av tools/i18n/build-mt.js fra tools/i18n/mt/chrome.tsv. ${l}: faste tekster i matematikk (KI-oversatt). {1} {2} … = tall fra den norske teksten. */\nwindow.App.addLang(${js(l)}, ${JSON.stringify(D[l])});\n`));
console.log(`${words.length} ord, ${chrome.length} faste tekster → js/i18n/mtw-*.js, mt-keys.js, mt-*.js` + (problems ? `, ${problems} merknader` : ''));
