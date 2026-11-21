/* Validerer alle matematikkmoduler (matte.html): oppgavegeneratorer, svar, alternativer, video og tekst.
   Bruk: NODE_PATH=$(npm root -g) node tools/mt-validate.js [antall-runder]   (krever at en server kjører på http://localhost:8765) */
const {chromium} = require('playwright');
const URL = process.env.URL || 'http://localhost:8765/matte.html';
(async () => {
  const rounds = +process.argv[2] || 40;
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push('pageerror: ' + e));
  await p.goto(URL); await p.waitForTimeout(400);
  const rep = await p.evaluate(rounds => {
    const MT = window.MT, bad = [], seenAll = {};
    const add = (m, l, msg, q) => bad.push(`${m}/${l}: ${msg}${q ? ' | ' + String(q.stem).replace(/<[^>]+>/g, '').slice(0, 90) : ''}`);
    MT.mods.forEach(m => {
      if(!m.video || m.video.length < 5) add(m.id, '-', 'video har under 5 scener');
      m.video.forEach((s, i) => { if(!s.html || !s.no || s.no.length < 20) add(m.id, 'video', 'scene ' + i + ' mangler tekst/bilde'); if(/undefined|NaN/.test(s.html + s.no)) add(m.id, 'video', 'undefined/NaN i scene ' + i); });
      if(!m.tekst || !m.tekst.mal || !m.tekst.steg || !m.refleksjon) add(m.id, '-', 'mangler skriftlig tekst/refleksjon');
      if(m.nivaaer.length < 3) add(m.id, '-', 'færre enn 3 nivåer');
      m.maal.forEach(k => { if(!MT.SETS.some(s => s.maal.some(a => a.k === k))) add(m.id, '-', 'ukjent kompetansemål ' + k); });
      m.bygger.forEach(k => { if(!MT.byId[k]) add(m.id, '-', 'bygger på ukjent modul ' + k); });
      m.nivaaer.forEach((l, li) => {
        const lid = 'niv' + (li + 1), stems = new Set(); let made = 0;
        for(let s = 0; s < rounds; s++){
          const r = MT.rng(s * 7717 + li * 31 + 11), n = l.n || (l.kind === 'forstaa' ? 6 : 10);
          for(let i = 0; i < n; i++){
            let q; try{ q = l.make(r, i); }catch(e){ add(m.id, lid, 'feil: ' + e.message); continue; }
            if(!q){ add(m.id, lid, 'make ga ingenting (i=' + i + ')'); continue; }
            made++; stems.add(q.stem + '|' + q.ans);
            const txt = [q.stem, q.expl, q.say, q.hint, (q.opts || []).join(' ')].join(' ');
            if(/undefined|NaN|\[object|Infinity/.test(txt)) add(m.id, lid, 'undefined/NaN i tekst', q);
            if(/--\d|\+-|\+ -/.test(q.stem.replace(/<[^>]+>/g, ''))) add(m.id, lid, 'negativt tall i stemmen', q);
            if(q.type === 'num'){
              if(!Number.isInteger(q.ans) || q.ans < 0 || q.ans > 9999) add(m.id, lid, 'ugyldig tallsvar ' + q.ans, q);
              if(!/\{\?\}/.test(q.stem)) add(m.id, lid, 'num uten {?}', q);
            } else if(q.type === 'choice'){
              const o = q.opts.map(String), u = new Set(o);
              if(u.size !== o.length) add(m.id, lid, 'dobbelte alternativer ' + o.join('/'), q);
              if(!u.has(String(q.ans))) add(m.id, lid, 'svaret mangler blant alternativene', q);
              if(o.length < 2) add(m.id, lid, 'færre enn 2 alternativer', q);
              if(q.yn && q.ans !== 'Ja' && q.ans !== 'Nei') add(m.id, lid, 'ja/nei-feil', q);
              if(q.nums && q.opts.some(x => !Number.isFinite(+x))) add(m.id, lid, 'ikke-tall i tallvalg', q);
            } else add(m.id, lid, 'ukjent type ' + q.type, q);
            if(q.chk){ let v; try{ v = Function('return (' + q.chk.replace(/_/g, '(' + q.ans + ')') + ')')(); }catch(e){ v = false; } if(!v) add(m.id, lid, 'chk feilet: ' + q.chk + ' med svar ' + q.ans, q); }
            if(q.calc){ if(!/^[0-9+\-*/() ]+$/.test(q.calc)) add(m.id, lid, 'ugyldig calc ' + q.calc, q); else { let v; try{ v = Function('return (' + q.calc + ')')(); }catch(e){ v = NaN; } if(v !== +q.ans) add(m.id, lid, `calc ${q.calc} = ${v}, men svaret er ${q.ans}`, q); } }
            if(q.expl == null && l.kind === 'forstaa') add(m.id, lid, 'forstå-oppgave uten forklaring', q);
          }
        }
        if(stems.size < (l.kind === 'forstaa' ? 5 : 12)) add(m.id, lid, 'for få ulike oppgaver (' + stems.size + ')');
        seenAll[m.id + '/' + lid] = stems.size;
      });
    });
    return {bad, mods:MT.mods.length, levels:MT.mods.reduce((a, m) => a + m.nivaaer.length, 0), variety:seenAll};
  }, rounds);
  console.log(`${rep.mods} moduler, ${rep.levels} nivåer, ${rounds} runder per nivå`);
  const pat = x => { const i = x.indexOf(': '); return x.slice(0, i) + x.slice(i).replace(/\d+/g, '#').replace(/\|.*$/, ''); }; const seenP = new Set(); const uniq = []; rep.bad.forEach(x => { const k = pat(x); if(!seenP.has(k)){ seenP.add(k); uniq.push(x); } });
  console.log(uniq.length ? uniq.slice(0, 80).join('\n') + (uniq.length > 80 ? `\n… og ${uniq.length - 80} til` : '') : 'Ingen feil funnet.');
  console.log('JS-feil: ' + (errs.length ? errs.join('\n') : 'ingen'));
  await b.close(); process.exit(uniq.length || errs.length ? 1 : 0);
})();
