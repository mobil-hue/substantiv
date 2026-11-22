# Skoleboken.com: slik publiseres den nye siden

Denne guiden er til den som skal legge siden ut på **skoleboken.com** (for eksempel Tut). Hele siden er statiske filer: HTML, CSS og JavaScript. Ingen server, database eller bygging trengs.

## 1. Hent filene
Kildekoden ligger i GitHub-repoet `mobil-hue/substantiv`, branchen `claude/noun-learning-program-bilingual-x6bxw6` (det som publiseres på GitHub Pages).

```bash
git clone --branch claude/noun-learning-program-bilingual-x6bxw6 https://github.com/mobil-hue/substantiv.git skoleboken
```

## 2. Hva som skal kopieres til skoleboken.com
Kopier dette til **roten** av nettstedet (samme mappestruktur):

| Hva | Hvorfor |
|---|---|
| `index.html`, `boker.html`, `om.html` | Ny forside (gratis moduler), Bøker og Om |
| `*.html` ellers (substantiv, adjektiv, gangesystem, matte, voksen, geometri, multiplikasjon, gange, ark og lærersider) | Selve modulene |
| `css/`, `js/` | Stil og kode (inkl. `js/i18n/`) |
| `docs/*.pdf` | Jukselapper og bøyingstabell som lenkes fra forsiden |

Ikke nødvendig på nettstedet: `tools/`, `docs/laereplan/`, `docs/*.md`, `docs/*.js`, `README.md`.

> Det som ligger på skoleboken.com i dag, flytter du til en mappe, for eksempel `/gammelt/`, **før** du kopierer inn de nye filene, slik at ingenting overskrives. Hvis noe av det gamle innholdet skal vises under «Bøker», se punkt 4.

## 3. Hvordan siden er bygd opp
- **Forside** (`index.html`): bare tre moduler er åpne for alle: **Gangesystemet** (`gangesystem.html`), **Adjektiv** (`adjektiv-grunnkurs.html` og `adjektiv.html`) og **Substantiv** (`substantiv-grunnkurs.html` og `substantiv.html`).
- **Bøker** (`boker.html`): kort beskrivelse og forside er åpne. Å åpne en bok krever passord.
- **Matematikk** (`matte.html`): hele oversikten over kompetansemål og moduler er synlig, men modulene (`#/m/...`) og arbeidsarkene (`matte-ark.html`) kan ikke åpnes uten passord.
- **Om** (`om.html`): hobbyprosjekt, KI-laget, ikke kvalitetskontrollert, personvern.
- Alle andre sider utenom de gratis modulene (voksen, geometri, multiplikasjon, gange og tilhørende ark) er sperret bak passord.

## 4. Legge til bøker (som er på skoleboken.com i dag)
Åpne `js/skole.js` og legg til en post i `BOOKS`:

```js
{id:'min-bok', href:'gammelt/min-bok/index.html', emoji:'📖', c1:'#0f766e', c2:'#14b8a6',
 title:'Tittel', sub:'Undertittel', desc:'Kort beskrivelse på én til to setninger.'}
```
Forsiden til boken tegnes automatisk med fargene `c1` og `c2` og emojien. Vil du bruke et eget bilde, legg det i `img/` og bytt ut forside-elementet i `boker.html`. Husk at bokens egne sider også bør sperres (se under).

## 5. Passord
Passordet ligger **ikke** i klartekst; bare en saltet SHA-256-hash i `js/gate-config.js`. Bytt passord slik:

```bash
node tools/set-passord.js "nytt passord"
```
Kopier deretter den nye `js/gate-config.js` til nettstedet. Alle som var låst opp, må taste inn det nye passordet.

For å sperre en ekstra side, legg dette i `<head>`:

```html
<script src="js/gate-config.js"></script>
<script src="js/gate.js" data-gate="page" data-back="boker.html"></script>
```

**Viktig om sikkerhetsnivået:** Dette er en «dørlås» i nettleseren, ikke ekte beskyttelse. Den holder nysgjerrige ute, men en som kan nettlesere og JavaScript kan omgå den, og filene kan hentes direkte hvis man kjenner adressen. Trenger dere ekte beskyttelse, bruk passordbeskyttelse hos webhotellet (for eksempel `.htpasswd`/Basic auth) eller en tjeneste foran siden (for eksempel Cloudflare Access) på de beskyttede mappene eller sidene.

## 6. Kontakt på Om-siden
Åpne `js/skole.js` og fyll inn `contact: ''` med e-postadresse eller lenke. Da vises den under «Er du fagperson?» på Om-siden.

## 7. Personvern og testing
- Ingen sporing, ingen analyseverktøy og ingen kall til eksterne tjenester. Fremgang lagres i nettleserens `localStorage` hos brukeren.
- Test etter publisering: forsiden viser tre kort; `boker.html` og `matte.html#/m/overslag` spør etter passord; `voksen.html` er sperret; `om.html` åpner uten passord.
- Hvis siden ligger i en undermappe, fungerer alt fordi alle lenker er relative.
