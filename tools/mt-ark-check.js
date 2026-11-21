/* Sjekker at arbeidsarkene (matte-ark.html) får plass på A4: sidetall i PDF mot forventet.
   Bruk: NODE_PATH=$(npm root -g) node tools/mt-ark-check.js   (krever server på http://localhost:8765) */
const {chromium} = require('playwright');
(async () => {
  const b = await chromium.launch(), p = await b.newPage({viewport:{width:900, height:1200}}), bad = [];
  await p.goto('http://localhost:8765/matte-ark.html'); await p.waitForTimeout(500);
  const ids = await p.evaluate(() => MT.mods.map(m => m.id));
  let n = 0;
  for(const id of ids){
    for(const seed of [11, 4242]){
      await p.evaluate(([id, seed]) => { history.replaceState(null, '', '#m=' + id + '&s=' + seed + '&t=all'); MT.ark.render(); }, [id, seed]);
      await p.waitForTimeout(250);
      const info = await p.evaluate(() => ({sheets:document.querySelectorAll('.sheetwrap .sheet').length, fit:[...document.querySelectorAll('.sheet.fit')].map(s => [s.dataset.n, s.scrollHeight - s.clientHeight]), keyOverflow:0}));
      document_print: {
        await p.setViewportSize({width:718, height:1200}); await p.emulateMedia({media:'print'}); await p.evaluate(() => { document.body.dataset.print = 'sheets'; });
        const pdf = await p.pdf({format:'A4', margin:{top:'10mm', bottom:'10mm', left:'10mm', right:'10mm'}, printBackground:true});
        const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
        const over = await p.evaluate(() => [...document.querySelectorAll('.sheet.fit')].filter(s => s.scrollHeight > s.clientHeight + 2).length);
        await p.emulateMedia({media:'screen'}); await p.setViewportSize({width:900, height:1200});
        if(pages > info.sheets + 1 || pages < info.sheets || over) bad.push(`${id} seed ${seed}: ${pages} sider (forventet ${info.sheets}), ${over} ark renner over`);
      }
      n++;
    }
  }
  console.log(n + ' ark-sett sjekket'); console.log(bad.length ? bad.join('\n') : 'Alle ark får plass på A4.');
  await b.close(); process.exit(bad.length ? 1 : 0);
})();
