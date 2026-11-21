/* Lager docs/matte-oversikt.md (moduler, kompetansemål, forkunnskaper) fra modulregisteret. Krever server på :8765. */
const {chromium} = require('playwright'), fs = require('fs');
(async () => {
  const b = await chromium.launch(), p = await b.newPage(); await p.goto('http://localhost:8765/matte.html');
  const d = await p.evaluate(() => ({mods:MT.mods.slice().sort((a, b) => a.ord - b.ord).map(m => ({id:m.id, t:m.tittel, tr:m.trinn.join('–'), maal:m.maal, by:m.bygger.map(x => MT.byId[x].tittel), lv:m.nivaaer.map(l => l.t), sc:m.video.length})), aims:MT.SETS[0].maal}));
  const aim = k => (d.aims.find(a => a.k === k) || {}).t || '';
  let s = '# Matematikk etter kompetansemål: oversikt over modulene\n\nGenerert av `tools/mt-oversikt.js`. Rekkefølgen er et forslag; «bygger på» viser forkunnskaper.\n\n## Moduler i anbefalt rekkefølge\n\n| # | Modul | Trinn | Kompetansemål | Bygger på | Nivåer | Scener |\n|---|---|---|---|---|---|---|\n';
  d.mods.forEach((m, i) => { s += `| ${i + 1} | ${m.t} | ${m.tr} | ${m.maal.join(', ')} | ${m.by.join('; ') || '–'} | ${m.lv.length} | ${m.sc} |\n`; });
  s += '\n## Kompetansemål (1.–2. trinn) og modulene som dekker dem\n\n';
  d.aims.forEach(a => { const ms = d.mods.filter(m => m.maal.includes(a.k)); s += `- **${a.k}** ${a.t}: ${ms.length ? ms.map(m => m.t).join('; ') : '_ikke laget ennå_'}\n`; });
  s += '\n## Nivåer per modul\n\n'; d.mods.forEach(m => { s += `**${m.t}**\n` + m.lv.map((l, i) => `${i + 1}. ${l}`).join('\n') + '\n\n'; });
  fs.writeFileSync('docs/matte-oversikt.md', s); console.log('skrevet', d.mods.length, 'moduler'); await b.close();
})();
