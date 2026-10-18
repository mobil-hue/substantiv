#!/usr/bin/env node
/* Validerer datafiler til Norsk Voksenopplæring (js/vox-*.js).
   Bruk:  node docs/vox-validate.js js/vox-a.js [js/vox-b.js ...] [--expect liste.tsv] [--summary]
   Formatet er beskrevet i docs/vox-format.md. Avslutter med kode 1 hvis det finnes feil. */
'use strict';
const fs = require('fs'), vm = require('vm');
const args = process.argv.slice(2);
const files = [], opt = {};
for(let i = 0; i < args.length; i++){
  if(args[i] === '--expect') opt.expect = args[++i];
  else if(args[i] === '--summary') opt.summary = true;
  else files.push(args[i]);
}
if(!files.length){ console.error('Bruk: node docs/vox-validate.js fil.js [flere filer] [--expect liste.tsv] [--summary]'); process.exit(2); }

const POS = new Set(['n', 'v', 'adj', 'adv', 'prep', 'conj', 'pron', 'det', 'num', 'intj', 'part', 'art']);
const KINDS = new Set(['rank', 'words', 'phrases']);
const CJK = /[㐀-鿿]/;
const errs = [], warns = [];
const E = (f, ln, m) => errs.push(`${f}:${ln}  FEIL  ${m}`);
const W = (f, ln, m) => warns.push(`${f}:${ln}  advarsel  ${m}`);
const ALLOWED_LATIN = /^(NAV|BankID|ID|SMS|WC|TV|PC|DNA|CT|MR|MRI|HIV|AS|DNB|T|IKEA|App|app|Wi|Fi|WiFi|USB|CD|DVD|GPS|OK|ok|CPR|CV|PDF|PIN|BMI|C|kg|km|cm|mm|ml|dl|l|g|m|NOK|kr|EU|EØS|SFO|HR|IT|VG|VGS|DM|GP|UTI|p|D|B|A|I|II|III|Rema|Kiwi|Coop|Meny|Vipps|Ruter|Skyss|Flytoget|Flybussen|AtB|Entur|E18|E6|LOL|ADHD|MR|RS|NTNU|UiO|OsloMet|Oslo|Norge|Bergen|Trondheim|Stavanger|Tromsø|Kristiansand|Drammen)$/;

function load(file){
  const sb = {}; sb.window = sb; sb.console = console; vm.createContext(sb);
  try{ vm.runInContext(fs.readFileSync(file, 'utf8'), sb, {filename:file}); }
  catch(e){ E(file, 0, 'Kan ikke kjøre filen: ' + e.message); return []; }
  const raw = sb.VOXRAW;
  if(!Array.isArray(raw) || !raw.length){ E(file, 0, 'Fant ingen VOXRAW.push(`...`)'); return []; }
  return raw;
}
function splitWords(s){ return s.split(/[\s,;:!?.()"“”«»]+/).filter(Boolean); }
const lc = s => s.toLowerCase();

const all = [];   // {file, ln, deck, kind, f:[...]}
const decks = {}; // id -> {kind, n}
for(const file of files){
  const blocks = load(file);
  let ln = 0;
  for(const block of blocks){
    let cur = null;
    for(const rawLine of String(block).split('\n')){
      ln++;
      const line = rawLine.trim();
      if(!line || line[0] === '#' || line.startsWith('//')) continue;
      if(line.startsWith('@deck')){
        const p = line.slice(5).split('|').map(s => s.trim());
        if(p.length !== 6){ E(file, ln, `@deck må ha 6 felt (id | emoji | norsk | engelsk | kinesisk | type) – fant ${p.length}`); continue; }
        if(!/^[a-z0-9-]+$/.test(p[0])) E(file, ln, 'deck-id må være a-z, 0-9 og bindestrek: ' + p[0]);
        if(!KINDS.has(p[5])) E(file, ln, 'ukjent deck-type ' + p[5] + ' (rank, words eller phrases)');
        if(!CJK.test(p[4])) E(file, ln, 'kinesisk tittel mangler kinesiske tegn');
        cur = {id:p[0], kind:p[5]}; decks[p[0]] = decks[p[0]] || {kind:p[5], n:0, notes:0, file};
        continue;
      }
      if(!cur){ E(file, ln, 'oppføring før første @deck'); continue; }
      if(/[`]|\$\{/.test(line)) E(file, ln, 'inneholder ` eller ${ (ikke tillatt)');
      const f = line.split('|').map(s => s.trim());
      all.push({file, ln, deck:cur.id, kind:cur.kind, f});
      decks[cur.id].n++;
    }
  }
}

/* ---------- sjekk av hver linje ---------- */
const seen = new Map();
let withNote = 0, wordCount = 0, phraseCount = 0, exMiss = 0;
for(const it of all){
  const {file, ln, f, kind} = it;
  if(kind === 'phrases'){
    phraseCount++;
    if(f.length !== 5){ E(file, ln, `frase må ha 5 felt (norsk | engelsk | kinesisk | s/h/b | merknad) – fant ${f.length}: «${f[0]}»`); continue; }
    const [nb, en, zh, k, note] = f;
    if(!nb || !en || !zh) E(file, ln, 'tomt felt i frase: «' + nb + '»');
    if(CJK.test(nb) || CJK.test(en)) E(file, ln, 'kinesiske tegn i norsk/engelsk felt: «' + nb + '»');
    if(!CJK.test(zh)) E(file, ln, 'kinesisk mangler kinesiske tegn: «' + nb + '»');
    if(!['s', 'h', 'b'].includes(k)) E(file, ln, 'type må være s (du sier), h (du hører) eller b (begge): «' + nb + '»');
    if(nb.length > 140) W(file, ln, 'veldig lang frase');
    if(note){ it.hasNote = true; if(CJK.test(note) && !note.includes('//')) W(file, ln, 'merknad med kinesisk uten « // »'); }
    const key = 'p:' + lc(nb);
    if(seen.has(key)) E(file, ln, `duplikat frase «${nb}» (også ${seen.get(key)})`); else seen.set(key, `${file}:${ln}`);
    if(note) withNote++;
    const zhLat = (zh.match(/[A-Za-z][A-Za-z-]{1,}/g) || []).filter(w => !ALLOWED_LATIN.test(w));
    if(zhLat.length) W(file, ln, 'latinske bokstaver i kinesisk (pinyin?): ' + zhLat.join(' '));
    continue;
  }
  /* ord */
  wordCount++;
  if(f.length !== 10){ E(file, ln, `ord må ha 10 felt (nb | pos | kjønn | former | en | zh | eks | eks-en | eks-zh | merknad) – fant ${f.length}: «${f[0]}»`); continue; }
  const [nb, pos, g, forms, en, zh, ex, exEn, exZh, note] = f;
  const tag = `«${nb}»`;
  if(!nb) { E(file, ln, 'tomt norsk ord'); continue; }
  if(CJK.test(nb) || CJK.test(en) || CJK.test(ex) || CJK.test(exEn)) E(file, ln, 'kinesiske tegn i norsk/engelsk felt: ' + tag);
  if(/^[A-ZÆØÅ]/.test(nb) && !/^[A-ZÆØÅ]{2,}/.test(nb)) W(file, ln, 'stor forbokstav i oppslagsord ' + tag);
  if(/^(å|en|ei|et) /i.test(nb)) E(file, ln, 'oppslagsordet skal ikke ha artikkel eller «å» foran: ' + tag);
  if(!POS.has(pos)) E(file, ln, `ukjent ordklasse «${pos}» ${tag}`);
  if(pos === 'n'){ if(!['en', 'ei', 'et'].includes(g)) E(file, ln, 'substantiv må ha kjønn en/ei/et ' + tag); } else if(g) E(file, ln, 'kjønn skal bare brukes på substantiv ' + tag);
  const fl = forms ? forms.split(',').map(s => s.trim()) : [];
  if(pos === 'n'){
    if(fl.length !== 3 || fl.some(x => !x)) E(file, ln, `substantiv skal ha 3 former (bestemt ent., ubestemt fl., bestemt fl.; «-» hvis ingen): ${tag} → «${forms}»`);
    else {
      const d = fl[0];
      if(d !== '-'){
        if(g === 'et' && !/(et|t)$/.test(d.split('/')[0])) W(file, ln, `bestemt form «${d}» ser ikke ut som et-ord ${tag}`);
        if(g === 'en' && !/(en|n)$/.test(d.split('/')[0])) W(file, ln, `bestemt form «${d}» ser ikke ut som en-ord ${tag}`);
        if(g === 'ei' && !/(a|en)(\/.*)?$/.test(d)) W(file, ln, `bestemt form «${d}» ser ikke ut som ei-ord ${tag}`);
      }
    }
  } else if(pos === 'v'){
    if(fl.length !== 4 || fl.some(x => !x)) E(file, ln, `verb skal ha 4 former (presens, preteritum, perfektum partisipp, imperativ; «-» hvis ingen): ${tag} → «${forms}»`);
  } else if(pos === 'adj'){
    if(fl.length !== 4 || fl.some(x => !x)) E(file, ln, `adjektiv skal ha 4 former (nøytrum, flertall, komparativ, superlativ; «-» hvis ingen): ${tag} → «${forms}»`);
  }
  if(!en || !zh) E(file, ln, 'mangler engelsk eller kinesisk ' + tag);
  if(zh && !CJK.test(zh)) E(file, ln, 'kinesisk mangler kinesiske tegn ' + tag);
  const zhLat = (zh.match(/[A-Za-z][A-Za-z-]{1,}/g) || []).filter(w => !ALLOWED_LATIN.test(w));
  if(zhLat.length) W(file, ln, 'latinske bokstaver i kinesisk (pinyin?) ' + tag + ': ' + zhLat.join(' '));
  if(pos === 'v' && en && !/^to /i.test(en)) W(file, ln, 'engelsk verb bør starte med «to » ' + tag);
  if(!ex || !exEn || !exZh) E(file, ln, 'mangler eksempelsetning (norsk, engelsk og kinesisk) ' + tag);
  else {
    if(!CJK.test(exZh)) E(file, ln, 'kinesisk eksempel mangler kinesiske tegn ' + tag);
    if(!/[.!?]$/.test(ex)) W(file, ln, 'eksempelsetningen bør slutte med . ! eller ? ' + tag);
    // finnes ordet (eller en av formene) i eksempelet?
    const cands = new Set([nb, ...fl.flatMap(x => x.split('/')).map(s => s.trim()), ...fl.flatMap(x => x.split('/')).map(s => s.replace(/^har /, ''))].filter(x => x && x !== '-').map(lc));
    const words = splitWords(lc(ex)), joined = ' ' + words.join(' ') + ' ';
    let hit = false;
    for(const c of cands){ if(c.includes(' ') ? joined.includes(' ' + c + ' ') : words.includes(c)){ hit = true; break; } }
    if(!hit){ exMiss++; W(file, ln, `eksempelet inneholder ikke ordet eller en av formene ${tag}: «${ex}»`); }
  }
  if(note){ withNote++; it.hasNote = true; if(CJK.test(note) && !note.includes('//')) W(file, ln, 'merknad med kinesisk uten « // » ' + tag); if(note.split('//').length > 2) E(file, ln, 'merknad har mer enn én « // » ' + tag); if(note.length > 420) W(file, ln, 'lang merknad ' + tag); }
  const key = nb.toLowerCase() + '~' + pos;
  if(seen.has(key)){
    const prev = seen.get(key), same = prev.split(':')[0] === file;
    (same ? E : W)(file, ln, `duplikat ${tag} (${pos}) – også ${prev}`);
  } else seen.set(key, `${file}:${ln}`);
}
/* ---------- forventet liste ---------- */
if(opt.expect){
  const exp = fs.readFileSync(opt.expect, 'utf8').split('\n').filter(Boolean).map(l => l.split('\t')[1]);
  const got = all.filter(x => x.kind === 'rank').map(x => x.f[0]);
  if(got.length !== exp.length) E(opt.expect, 0, `forventet ${exp.length} ord, fant ${got.length}`);
  const miss = exp.filter(x => !got.includes(x)), extra = got.filter(x => !exp.includes(x));
  if(miss.length) E(opt.expect, 0, 'mangler: ' + miss.join(', '));
  if(extra.length) W(opt.expect, 0, 'ikke på listen (erstattet?): ' + extra.join(', '));
  let first = -1; for(let i = 0; i < Math.min(got.length, exp.length); i++) if(got[i] !== exp[i]){ first = i; break; }
  if(first >= 0) W(opt.expect, 0, `rekkefølgen avviker fra listen første gang på plass ${first + 1}: forventet «${exp[first]}», fant «${got[first]}»`);
}

/* ---------- rapport ---------- */
const MAXP = 80;
if(errs.length) console.log(errs.slice(0, MAXP).join('\n') + (errs.length > MAXP ? `\n… og ${errs.length - MAXP} flere feil` : ''));
if(warns.length && !opt.summary) console.log(warns.slice(0, MAXP).join('\n') + (warns.length > MAXP ? `\n… og ${warns.length - MAXP} flere advarsler` : ''));
console.log('\nOppsummering');
Object.entries(decks).forEach(([id, d]) => console.log(`  ${id.padEnd(12)} ${d.kind.padEnd(8)} ${String(d.n).padStart(4)} oppføringer`));
console.log(`  ord: ${wordCount}, fraser: ${phraseCount}, med merknad: ${withNote}, eksempel uten ordet: ${exMiss}`);
console.log(`  ${errs.length} feil, ${warns.length} advarsler`);
process.exit(errs.length ? 1 : 0);
