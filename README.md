# Lær norsk fagstoff med kinesisk støtte (norsk + 中文)

To læreopplegg i samme system: **Substantiv** (`index.html`) og **Geometri** (`geometri.html`, Matematikk 4 kap. 4).
Norsk er hovedspråket. Kinesisk er støtte, både som tekst og som opplesing.

## Språk og opplesing
- **Vis tekst på:** norsk + 中文 (standard), bare norsk eller bare 中文.
- **Opplesing på:** norsk, 中文 eller begge (knappen 🔊 øverst til høyre, eller *Innstillinger*). Gjelder både forklaringene (videoene) og oppgavene. Norske fagord leses alltid på norsk.
- Pinyin er skrudd av som standard (kan slås på under *Innstillinger*).

## Substantiv 名词

Pedagogisk nettside for en 9 år gammel elev som er svak i norsk og snakker kinesisk.
Åpne `index.html` i en nettleser (Chrome/Edge/Safari). Ingen installasjon.

## Innhold
- **7 moduler** (0–6): hvorfor lære substantiv → hva er et substantiv (inkl. egennavn og stor/liten bokstav) → en/ei/et → entall/flertall → ubestemt/bestemt → de fire formene → finn substantivene.
- **7 animerte lærevideoer** (norsk og kinesisk tekst og tale).
- **Oppgaver underveis i hver modul**: begreper (kort), små oppgaver, omfattende oppgaver og «øv til du er trygg»-løkker.
- **Øvingsrom** med fritt valg av tema, nivå og antall riktige på rad.
- **Begreper**: kort der blant annet *substantiv* og navnene på de fire formene terpes.
- **Lærerside** (`teacher.html`): oversikt over alle oppgaver, ordliste og fasit.
- **Skriveark** (`ark.html`): utskriftsklare ark for bøying og kjønn (en/ei/et) med fasit. Nye ord hver gang.
- **Bøyingstabell (PDF)**: `docs/substantiv-boyingstabell.pdf` – 74 vanlige substantiv i alle fire former, gruppert etter en/ei/et (kilde: `docs/jukselapp-boying.html`).
- **Jukselapp (PDF)**: `docs/substantiv-jukselapp.pdf` – alt på én side (bygges med `node docs/build-oversikt.js`).

## Geometri 几何
- **6 moduler, 58 steg**: figurer rundt oss, todimensjonale figurer (kanter, hjørner, kvadrat og rektangel), tredimensjonale figurer, nett og klosser, vinkler, «Finn ut» (gåter og utfordringer).
- **7 animerte videoer**, begrepskort, **506 små og 78 omfattende oppgaver**, øvingsrom og «øv til du er trygg»-løkker.
- Nye oppgavetyper: tegning på prikkpapir (sjekkes automatisk), trykk på vinkler, tau-oppgaven.
- **Skriveark** (`geo-ark.html`): 5 ark med fasit, nye oppgaver hver gang.
- **Jukselapp (PDF)**: `docs/geometri-jukselapp.pdf` (kilde: `docs/geometri-jukselapp.html`).
- **Lærerside**: `geometri-laerer.html`.

## Oppgavemengde (substantiv)
- Små oppgaver (unike spørsmål): se `teacher.html` (over 1800)
- Omfattende oppgaver: se `teacher.html` (over 150)

Oppgavene trekkes tilfeldig hver gang, svaralternativene stokkes, og oppgaver eleven bommer på kommer oftere.

## Opplesing
Bruker nettleserens talesyntese (Web Speech API): norsk (`nb-NO`) og kinesisk (`zh-CN`). Under *Innstillinger* ser du om stemmene finnes på enheten.

## Filer
```
index.html, teacher.html
css/style.css
js/util.js        hjelpefunksjoner, innstillinger, tale
js/data.js        ordliste, begreper, tekster, setninger, egennavn
js/graphics.js    grafikk for de fire formene
js/videos.js      lærevideoene og avspilleren
js/exercises.js   alle oppgavebanker og oppgavetyper
js/lessons.js     moduler og steg
js/app.js         visninger, øktkjører, fremgang (begge fag)
js/geo-*.js       geometri: tegninger, data, oppgaver, videoer, moduler, skriveark
```
