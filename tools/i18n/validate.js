#!/usr/bin/env node
/* Sjekker språkfilene i js/i18n/: syntaks, manglende og ukjente id-er, og at alle tall ({1} {2} …) fra den norske teksten er med.
 * Kjør fra repo-roten: node tools/i18n/validate.js [språk …]   (standard: alle) */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..', '..'), DIR = path.join(ROOT, 'js', 'i18n');
const master = JSON.parse(fs.readFileSync(path.join(__dirname, 'master.json'), 'utf8'));
const langs = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(DIR).filter(f => f !== 'keys.js').map(f => f.replace('.js', ''));
// tekster som bare er tall (like på alle språk) trenger ikke oversettelse
const digitsOnly = e => !/[A-Za-zÆØÅæøå]/.test(e.no.replace(/y/g, ''));
let bad = 0;
for(const l of langs){
  const file = path.join(DIR, l + '.js'); let dict = null;
  try { vm.runInNewContext(fs.readFileSync(file, 'utf8'), { window:{ App:{ addLang:(c, o) => { dict = o; } } } }); }
  catch(e){ console.log(`✗ ${l}: syntaksfeil – ${e.message}`); bad++; continue; }
  const issues = [];
  for(const e of master){
    const t = dict[e.id], n = (e.no.match(/#/g) || []).length;
    if(t == null){ if(!digitsOnly(e)) issues.push(`mangler ${e.id}: ${e.ex.slice(0, 50)}`); continue; }
    if(!String(t).trim()) issues.push(`tom ${e.id}`);
    const found = new Set((String(t).match(/\{(\d+)\}/g) || []).map(x => +x.slice(1, -1)));
    for(let i = 1; i <= n; i++) if(!found.has(i)) issues.push(`tall {${i}} mangler i ${e.id}: ${String(t).slice(0, 60)}`);
    for(const f of found) if(f > n) issues.push(`ukjent {${f}} i ${e.id}`);
  }
  const ids = new Set(master.map(e => e.id));
  Object.keys(dict).forEach(k => { if(!ids.has(+k)) issues.push(`ukjent id ${k}`); });
  console.log(`${issues.length ? '✗' : '✓'} ${l}: ${Object.keys(dict).length} tekster${issues.length ? ', ' + issues.length + ' problemer' : ''}`);
  issues.slice(0, 15).forEach(i => console.log('   ' + i)); bad += issues.length;
}
process.exit(bad ? 1 : 0);
