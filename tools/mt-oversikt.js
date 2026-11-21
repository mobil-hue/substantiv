/* Lager docs/matte-oversikt.md (moduler, kompetansemål, forkunnskaper) fra modulregisteret. Krever server på :8765. */
const {chromium} = require('playwright'), fs = require('fs');
(async () => {
  const b = await chromium.launch(), p = await b.newPage(); await p.goto('http://localhost:8765/matte.html');
  const d = await p.evaluate(() => ({mods:MT.mods.slice().sort((a, b) => a.ord - b.ord).map(m => ({id:m.id, t:m.tittel, tr:m.trinn.join('–'), maal:m.maal, by:m.bygger.map(x => MT.byId[x].tittel), dr:!!m.drill, lv:m.nivaaer.map(l => l.t), sc:m.video.length})), sets:MT.SETS.map(x => ({l:x.label, maal:x.maal.map(a => Object.assign({}, a, {inf:(i => ({abs:i.type === 'abs', own:i.own.map(m => m.tittel), build:i.build.map(m => m.tittel)}))(MT.aimInfo(a.k))}))})).filter(x => MT.mods.some(m => m.maal.some(k => x.maal.some(a => a.k === k))))}));
  
  let s = '# Matematikk etter kompetansemål: oversikt over modulene\n\nGenerert av `tools/mt-oversikt.js`. Rekkefølgen er et forslag; «bygger på» viser forkunnskaper.\n\n## Moduler i anbefalt rekkefølge\n\n| # | Modul | Trinn | Kompetansemål | Bygger på | Nivåer | Scener | Mengdetrening |\n|---|---|---|---|---|---|---|---|\n';
  d.mods.forEach((m, i) => { s += `| ${i + 1} | ${m.t} | ${m.tr} | ${m.maal.join(', ')} | ${m.by.join('; ') || '–'} | ${m.lv.length} | ${m.sc} | ${m.dr ? 'ja' : '–'} |\n`; });
  s += '\n## Typer av kompetansemål\n\n- **🎯 Konkret mål**: ett til to moduler er laget direkte for målet.\n- **🧩 Overordnet (abstrakt) mål**: et stort mål som bygges opp gjennom mange moduler. Oversikten skiller mellom modulene som er laget særskilt for målet og byggesteinene.\n';
  d.sets.forEach(st => { s += `\n## Kompetansemål ${st.l} og modulene som dekker dem\n\n`; st.maal.forEach(a => { const i = a.inf; s += `- ${i.abs ? '🧩' : '🎯'} **${a.k}** ${a.t}: ` + (i.own.length || i.build.length ? (i.abs ? `_overordnet mål_. Laget særskilt for målet: ${i.own.join('; ') || '–'}. Byggesteiner (${i.build.length}): ${i.build.join('; ') || '–'}` : i.own.join('; ')) : '_ikke laget ennå_') + '\n'; }); });
  s += '\n## Nivåer per modul\n\n'; d.mods.forEach(m => { s += `**${m.t}**\n` + m.lv.map((l, i) => `${i + 1}. ${l}`).join('\n') + '\n\n'; });
  fs.writeFileSync('docs/matte-oversikt.md', s); console.log('skrevet', d.mods.length, 'moduler'); await b.close();
})();
