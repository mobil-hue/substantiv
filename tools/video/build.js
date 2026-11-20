#!/usr/bin/env node
/* Bygger introduksjonsvideoen (norsk og engelsk) som mp4 + undertekster + kapitler + YouTube-beskrivelse.
 *
 * Bruk (fra repo-roten):
 *   Piper (gratis, lokalt):  TTS=piper PIPER_PY=<python med piper-tts> PIPER_DIR=<mappe med .onnx-modeller> node tools/video/build.js
 *   Azure:  AZURE_SPEECH_KEY=... AZURE_SPEECH_REGION=westeurope node tools/video/build.js
 *   Valgfritt: SITE=www.skoleboken.com (standard), PIPER_NO_MODEL / PIPER_NO_SPEAKER / PIPER_EN_MODEL / PIPER_EN_SPEAKER / PIPER_SPEED
 *
 * Valg:
 *   --lang no,en          hvilke språk (standard: begge)
 *   --only gs_system,outro  bare disse delene (gs_system gs_mirror gs_easy gs_five gs_square gs_nine gs_learn gs_which outro)
 *   --preview             raskere og lavere kvalitet (færre bilder per sekund)
 *   Uten TTS og nøkkel lages en STUM prøveversjon med estimert tid.
 *
 * Krever: node, playwright (chromium), ffmpeg/ffprobe, curl. Resultat: tools/video/out/ (ikke i git).
 */
const { chromium } = require('playwright');
const { execFileSync, spawnSync } = require('child_process');
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..', '..'), OUT = path.join(__dirname, 'out');
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i < 0 ? d : (process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : true); };
const LANGS = String(arg('lang', 'no,en')).split(',');
const ONLY = arg('only', null) ? String(arg('only')).split(',') : null;
const PREVIEW = !!arg('preview', false);
const KEY = process.env.AZURE_SPEECH_KEY || '', REGION = process.env.AZURE_SPEECH_REGION || 'westeurope';
const SITE = process.env.SITE || 'www.skoleboken.com';
const TTS = (process.env.TTS || (KEY ? 'azure' : 'silent')).toLowerCase();
const PIPER = { py:process.env.PIPER_PY || 'python3', dir:process.env.PIPER_DIR || path.join(__dirname, 'piper'),
  no:{ model:process.env.PIPER_NO_MODEL || 'no_NO-nvcc-medium', speaker:process.env.PIPER_NO_SPEAKER || '0' },
  en:{ model:process.env.PIPER_EN_MODEL || 'en_GB-cori-high', speaker:process.env.PIPER_EN_SPEAKER || '' } };
const voiceId = l => TTS === 'piper' ? `piper:${PIPER[l].model}:${PIPER[l].speaker}:${process.env.PIPER_SPEED || '1.08'}` : TTS === 'azure' ? VOICE[l].name : 'silent';
const VOICE = {no:{name:process.env.VOICE_NO || 'nb-NO-PernilleNeural', loc:'nb-NO'}, en:{name:process.env.VOICE_EN || 'en-GB-SoniaNeural', loc:'en-GB'}};
const FPS_FAST = PREVIEW ? 8 : 15, FPS_SLOW = PREVIEW ? 4 : 8, PAD = 0.9;
const TITLES = {
  gs_system:['Introduksjon: fra 100 til 10', 'Introduction: from 100 to 10'], gs_mirror:['Speilvendte regnestykker', 'Mirror facts'],
  gs_easy:['1-, 2- og 10-gangen', 'The 1, 2 and 10 times tables'], gs_five:['5-gangen', 'The 5 times table'],
  gs_square:['Like × like (kvadrattall)', 'Like × like (square numbers)'], gs_nine:['9-gangen med regel', 'The 9 times table with a rule'],
  gs_learn:['De 10 som må pugges', 'The 10 facts to memorize'], gs_which:['Hvilken regel gjelder?', 'Which rule applies?'], o1:['Gratis å bruke', 'Free to use']
};

const sh = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] }).toString();
const dur = f => parseFloat(sh('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', f]));
const mkdir = d => fs.mkdirSync(d, { recursive: true });
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ts = (s, comma) => { const ms = Math.round(s * 1000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, x = Math.floor(ms / 1000) % 60; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(x).padStart(2, '0')}${comma ? ',' : '.'}${String(ms % 1000).padStart(3, '0')}`; };

/* ---------- tale ---------- */
function speak(text, lang, file){
  if(fs.existsSync(file)) return;
  if(TTS === 'piper'){
    const m = PIPER[lang], wav = file + '.wav', txt = file + '.txt'; fs.writeFileSync(txt, text);
    const args = ['-m', 'piper', '-m', path.join(PIPER.dir, m.model + '.onnx'), '-i', txt, '-f', wav, '--sentence-silence', '0.3', '--length-scale', process.env.PIPER_SPEED || '1.08'];
    if(m.speaker !== '') args.push('-s', m.speaker);
    const r = spawnSync(PIPER.py, args, { encoding:'utf8' });
    if(r.status !== 0) throw new Error('Piper feilet (' + lang + '): ' + (r.stderr || '').slice(-300));
    sh('ffmpeg', ['-y', '-i', wav, '-ar', '24000', '-ac', '1', '-codec:a', 'libmp3lame', '-q:a', '3', file]);
    fs.unlinkSync(wav); fs.unlinkSync(txt); return;
  }
  if(TTS !== 'azure'){   // stum prøveversjon: estimert lengde
    const secs = Math.max(2, text.length * 0.068 + 0.6);
    sh('ffmpeg', ['-y', '-f', 'lavfi', '-i', 'anullsrc=r=24000:cl=mono', '-t', secs.toFixed(2), '-c:a', 'libmp3lame', file]); return;
  }
  const v = VOICE[lang];
  const ssml = `<speak version='1.0' xml:lang='${v.loc}'><voice name='${v.name}'><prosody rate='-4%'>${esc(text)}</prosody></voice></speak>`;
  const body = file + '.ssml'; fs.writeFileSync(body, ssml);
  const r = spawnSync('curl', ['-sS', '--fail-with-body', '-X', 'POST', `https://${REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
    '-H', `Ocp-Apim-Subscription-Key: ${KEY}`, '-H', 'Content-Type: application/ssml+xml', '-H', 'X-Microsoft-OutputFormat: audio-24khz-96kbitrate-mono-mp3',
    '-H', 'User-Agent: gangesystem-video', '--data-binary', '@' + body, '-o', file], { encoding: 'utf8' });
  fs.unlinkSync(body);
  if(r.status !== 0){ if(fs.existsSync(file)) fs.unlinkSync(file); throw new Error('Talesyntese feilet (' + lang + '): ' + (r.stderr || '').slice(0, 300)); }
}

/* ---------- statisk server ---------- */
function serve(){
  const types = {'.html':'text/html;charset=utf-8', '.js':'text/javascript;charset=utf-8', '.css':'text/css', '.woff2':'font/woff2', '.png':'image/png', '.svg':'image/svg+xml'};
  return new Promise(res => { const s = http.createServer((q, r) => { const p = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); if(!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()){ r.writeHead(404); r.end(); return; }
    r.writeHead(200, {'Content-Type':types[path.extname(p)] || 'application/octet-stream'}); fs.createReadStream(p).pipe(r); }).listen(0, '127.0.0.1', () => res(s)); });
}

/* skjermbilder av appen til avslutningen (tas automatisk, så de alltid stemmer med siden) */
async function makeShots(browser, port){
  const dir = path.join(OUT, 'shots'); mkdir(dir);
  const base = `http://127.0.0.1:${port}`, settings = sup => JSON.stringify({lang:'both', speak:'no', rate:.85, pinyin:false, auto:false, v:2, sup});
  const ctx = await browser.newContext({ viewport:{ width:390, height:760 }, deviceScaleFactor:2 });
  const open = async (sup, extra) => { const p = await ctx.newPage(); await p.addInitScript(([s, x]) => { localStorage.setItem('sub_settings', s); Object.keys(x || {}).forEach(k => localStorage.setItem(k, x[k])); }, [settings(sup), extra]); return p; };
  // 1: tabellen som krymper (engelsk)
  let p = await open('en'); await p.goto(base + '/gangesystem.html'); await p.waitForSelector('.gs-home');
  await p.click('.gx-st[data-n="3"]'); await p.evaluate(() => document.getElementById('gx').scrollIntoView()); await p.waitForTimeout(300);
  await p.screenshot({ path:path.join(dir, 'shot-en.png') }); await p.close();
  // 2: regelhjelp etter feil svar (arabisk)
  p = await open('ar', { sub_gs_prefs:JSON.stringify({input:'choice', help:'ask', explain:false, n:10, sel:['easy', 'five', 'sq', 'nine', 'learn']}) });
  await p.goto(base + '/gangesystem.html#/train/nine'); await p.click('#sStart'); await p.waitForSelector('.gchoice');
  const eq = await p.evaluate(() => document.querySelector('.gq-eq span').textContent), m = eq.match(/(\d+) × (\d+)/), vals = await p.$$eval('.gchoice', b => b.map(x => +x.dataset.v));
  await p.click(`.gchoice[data-v="${vals.find(v => v !== m[1] * m[2])}"]`); await p.waitForSelector('.rulebox'); await p.evaluate(() => document.querySelector('.qcard').scrollIntoView()); await p.waitForTimeout(300);
  await p.screenshot({ path:path.join(dir, 'shot-ar.png') }); await p.close();
  // 3: fremgang (thai) med litt eksempeldata
  const facts = {}; for(let x = 1; x <= 10; x++) for(let y = x; y <= 10; y++){ const r = (x * 7 + y * 13) % 11, b = r < 1 ? 0 : r < 3 ? 1 : r < 5 ? 2 : r < 8 ? 4 : 5; facts[x + '-' + y] = { r:b + 1, w:b === 0 ? 2 : 0, h:0, b, t:Date.now() }; }
  p = await open('th', { sub_gs_facts:JSON.stringify(facts) });
  await p.goto(base + '/gangesystem.html#/stats'); await p.waitForSelector('.gs-stats'); await p.waitForTimeout(300);
  await p.screenshot({ path:path.join(dir, 'shot-th.png') }); await p.close();
  // arbeidsark og fasit
  const ctx2 = await browser.newContext({ viewport:{ width:900, height:1200 }, deviceScaleFactor:1.2 }); p = await ctx2.newPage();
  await p.goto(base + '/gs-ark.html#s=2026'); await p.waitForSelector('.sheet');
  await p.locator('.sheetwrap').first().screenshot({ path:path.join(dir, 'ark.png') });
  await p.evaluate(() => document.body.classList.add('show-key')); await p.locator('.key').first().screenshot({ path:path.join(dir, 'fasit.png') });
  await ctx2.close(); await ctx.close();
}

(async () => {
  mkdir(OUT);
  const server = await serve(), port = server.address().port;
  const browser = await chromium.launch();
  await makeShots(browser, port);
  const ctx = await browser.newContext({ viewport: { width: 960, height: 540 }, deviceScaleFactor: 1280 / 960 });
  const page = await ctx.newPage();
  page.on('pageerror', e => { throw e; });
  await page.goto(`http://127.0.0.1:${port}/tools/video/export.html?site=${encodeURIComponent(SITE)}`);
  await page.waitForFunction('window.__ready === true');
  await page.evaluate(() => document.fonts.ready);
  let scenes = await page.evaluate(() => window.__scenes());
  if(ONLY) scenes = scenes.filter(s => ONLY.includes(s.id));
  console.log(`${scenes.length} scener · språk: ${LANGS.join(', ')} · ${TTS === 'piper' ? 'Piper-tale' : TTS === 'azure' ? 'Azure-tale (' + REGION + ')' : 'STUM prøveversjon (ingen tale)'}${PREVIEW ? ' · preview' : ''} · ${SITE}`);

  for(const lang of LANGS){
    const L = path.join(OUT, lang), AUD = path.join(L, 'audio'), FR = path.join(L, 'frames'), SEG = path.join(L, 'seg');
    [AUD, FR, SEG].forEach(mkdir);
    const segs = [], cues = [], chapters = []; let clock = 0, lastId = null;
    for(let n = 0; n < scenes.length; n++){
      const sc = scenes[n], text = lang === 'no' ? sc.noSpeech : sc.enSpeech;
      const hash = crypto.createHash('md5').update(voiceId(lang) + '|' + text).digest('hex').slice(0, 12);
      const audio = path.join(AUD, `${String(n).padStart(3, '0')}-${hash}.mp3`);
      speak(text, lang, audio);
      const adur = dur(audio), total = adur + PAD;
      // bilder
      const animEnd = await page.evaluate(([id, i]) => window.__show(id, i), [sc.id, sc.i]);
      const dir = path.join(FR, String(n).padStart(3, '0')); fs.rmSync(dir, { recursive: true, force: true }); mkdir(dir);
      const list = []; let t = 0, k = 0;
      while(t < total - 1e-6){
        const talking = t < adur, fast = t * 1000 < animEnd + 120;
        const dt = fast ? 1 / FPS_FAST : (talking ? Math.min(1 / FPS_SLOW, adur - t) : total - t);
        await page.evaluate(([ms, tk]) => window.__time(ms, tk), [t * 1000, talking]);
        const f = path.join(dir, `f${String(k++).padStart(5, '0')}.jpg`);
        await page.screenshot({ path: f, type: 'jpeg', quality: PREVIEW ? 78 : 92 });
        list.push(`file '${f}'\nduration ${Math.max(dt, 0.02).toFixed(4)}`); t += dt;
      }
      list.push(`file '${path.join(dir, `f${String(k - 1).padStart(5, '0')}.jpg`)}'`);
      fs.writeFileSync(path.join(dir, 'list.txt'), list.join('\n'));
      const seg = path.join(SEG, `${String(n).padStart(3, '0')}.mp4`);
      sh('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', path.join(dir, 'list.txt'), '-i', audio, '-filter_complex', `[0:v]fps=25,format=yuv420p[v];[1:a]aresample=44100,apad[a]`,
        '-map', '[v]', '-map', '[a]', '-t', total.toFixed(3), '-c:v', 'libx264', '-crf', PREVIEW ? '28' : '20', '-preset', PREVIEW ? 'veryfast' : 'medium', '-c:a', 'aac', '-b:a', '160k', '-ac', '2', seg]);
      segs.push(seg);
      fs.rmSync(dir, { recursive: true, force: true });      // bildene er brukt
      // undertekster: del på setninger, fordel tiden etter lengde
      const shown = lang === 'no' ? sc.no : sc.en, parts = shown.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g).map(s => s.trim()).filter(Boolean), sum = parts.reduce((a, p) => a + p.length, 0);
      let c = clock + 0.15; parts.forEach(p => { const d = adur * p.length / sum; cues.push({ a:c, b:c + d, t:p }); c += d; });
      if(sc.id !== lastId && TITLES[sc.id]){ chapters.push({ t:clock, title:TITLES[sc.id][lang === 'no' ? 0 : 1] }); }
      lastId = sc.id;
      clock += total;
      process.stdout.write(`\r${lang}: scene ${n + 1}/${scenes.length}  ${ts(clock).slice(0, 8)}   `);
    }
    process.stdout.write('\n');
    const listf = path.join(L, 'segments.txt'); fs.writeFileSync(listf, segs.map(s => `file '${s}'`).join('\n'));
    const final = path.join(OUT, `gangesystemet-${lang}${TTS === 'silent' ? '-STUM-PREVIEW' : ''}.mp4`);
    sh('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', listf, '-c', 'copy', '-movflags', '+faststart', final]);
    fs.writeFileSync(path.join(OUT, `gangesystemet-${lang}.srt`), cues.map((c, i) => `${i + 1}\n${ts(c.a, true)} --> ${ts(c.b, true)}\n${c.t}\n`).join('\n'));
    const fm = s => { const m = Math.floor(s / 60), x = Math.floor(s % 60); return `${m}:${String(x).padStart(2, '0')}`; };
    const chap = chapters.map((c, i) => `${i === 0 ? '0:00' : fm(c.t)} ${c.title}`).join('\n');
    const desc = lang === 'no'
      ? `Gangetabellen som system: lær hele den lille gangetabellen (1–10) uten å pugge alle 100 ruter.\n\nI denne videoen går vi gjennom hele systemet, steg for steg: fra 100 regnestykker til bare 10 som må pugges. Speilvendte regnestykker, 1-, 2- og 10-gangen, 5-gangen, like × like (kvadrattall), 9-gangen med regel – og hvordan du finner ut hvilken regel som gjelder.\n\nHelt gratis på ${SITE}: se alle videoene, øv på hver gruppe og på hele tabellen med forklaring av regelen, og skriv ut arbeidsark med fasit. Passer for barn og voksne som lærer norsk. Appen er på norsk med støtte på ni språk: engelsk, kinesisk, arabisk, spansk, polsk, ukrainsk, thai, tagalog og somali. Videoen har norsk tale med norske og engelske undertekster.\n\nDette er et hobbyprosjekt, 100 % laget med AI. Det har vært fokus på innhold og funksjonalitet. Oversettelsene er også laget med AI, og vi tar gjerne imot rettelser.\n\nKapitler:\n${chap}\n`
      : `The times table as a system: learn the whole small multiplication table (1–10) without memorizing all 100 squares.\n\nIn this video we go through the whole system step by step: from 100 facts down to just 10 that you have to memorize. Mirror facts, the 1, 2 and 10 times tables, the 5 times table, like × like (square numbers), the 9 times table with a rule – and how to find out which rule applies.\n\nCompletely free at ${SITE}: watch all the videos, practise each group and the whole table with the rule explained, and print worksheets with answer keys. Suitable for children and for adults learning Norwegian. The app is in Norwegian with support in nine languages: English, Chinese, Arabic, Spanish, Polish, Ukrainian, Thai, Tagalog and Somali. The video has English narration with Norwegian and English subtitles.\n\nThis is a hobby project, 100% made with AI. The focus has been on content and functionality. The translations are also made with AI, and corrections are welcome.\n\nChapters:\n${chap}\n`;
    fs.writeFileSync(path.join(OUT, `beskrivelse-${lang}.txt`), desc);
    console.log(`  → ${path.relative(ROOT, final)}  (${fm(clock)})`);
  }
  await browser.close(); server.close();
})().catch(e => { console.error('\nFEIL:', e.message); process.exit(1); });
