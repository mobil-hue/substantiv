(function(){
'use strict';
/* Matematikk: to typer kompetansemål.
   🎯 Konkret mål: ett til to moduler er laget direkte for målet (alle modulene som peker på det regnes som «egne»).
   🧩 Overordnet (abstrakt) mål: et stort mål som bygges opp gjennom mange moduler. Her er det oppført hvilke moduler som er laget
      særskilt for målet («egen»); alle andre moduler som peker på målet (maal) eller er listet i «bygg» er byggesteiner. Mål som ikke står her er konkrete. */
window.MT = window.MT || {};
window.MT.ABS = {
  KM13241:{egen:['mengde-10'], ord:'Å vise tall og mengder på mange måter og oversette mellom dem går gjennom alt arbeid med tall til 100.'},
  KM13232:{egen:['tiere-enere', 'hundrerne'], ord:'Posisjonssystemet bygges opp trinn for trinn: tallene til 20, tiere og enere, tall til 100, hundrere og så veksling i regning.'},
  KM13234:{egen:['regnefortellinger'], ord:'Å bruke addisjon og subtraksjon i lek og hverdag er målet for hele regnearbeidet i 1.–2. trinn.'},
  KM13258:{egen:['regnearter-familie', 'kontroll-omvendt'], ord:'Sammenhengene mellom de fire regneartene bygges gjennom hele småskolen: pluss og minus, gange og deling.',
    bygg:['legge-sammen', 'trekke-fra', 'add-sub-sammenheng', 'strategier-subtraksjon', 'gange-grupper', 'gange-telling', 'gange-bytte', 'gange-dele-opp', 'dobling-halvering', 'dele-likt', 'deling-typer', 'divisjon-representasjoner', 'divisjon-strategier']},
  KM13259:{egen:['overslag', 'vurdere-kritisk'], ord:'Å estimere, forklare tenkemåter og vurdere kritisk er noe vi trener i alle regnemoduler, ikke bare i ett tema.',
    bygg:['regnefortellinger', 'strategier-addisjon', 'strategier-subtraksjon', 'tallinje-regning', 'maale-lengde', 'maale-masse', 'maale-areal', 'maale-volum', 'kontroll-omvendt', 'ulikhet', 'gange-historier', 'deling-typer']},
  KM13260:{egen:['uttrykk-fra-situasjon', 'situasjon-til-uttrykk'], ord:'Å koble fortellinger og regneuttrykk bygger på alle regneartene og regnefortellingene fra tidligere trinn.',
    bygg:['regnefortellinger', 'legge-sammen', 'trekke-fra', 'likhetstegn', 'gange-grupper', 'gange-historier', 'gange-representasjoner', 'dele-likt', 'deling-typer', 'divisjon-representasjoner']}
};
/* hjelpefunksjon: del modulene som peker på et mål i egne moduler og byggesteiner */
window.MT.aimInfo = code => {
  const MT = window.MT, a = MT.ABS[code], all = MT.mods.filter(m => m.maal.includes(code)).sort((x, y) => x.ord - y.ord);
  if(!a) return {type:'kon', own:all, build:[], bygger:[...new Set([].concat(...all.map(m => m.bygger)))].filter(id => MT.byId[id] && !all.includes(MT.byId[id])).map(id => MT.byId[id]).sort((x, y) => x.ord - y.ord)};
  const own = a.egen.map(id => MT.byId[id]).filter(Boolean).sort((x, y) => x.ord - y.ord);
  const extra = (a.bygg || []).map(id => MT.byId[id]).filter(Boolean), build = [...new Set(all.concat(extra))].filter(m => !own.includes(m)).sort((x, y) => x.ord - y.ord);
  return {type:'abs', own, build, bygger:[], ord:a.ord};
};
})();
