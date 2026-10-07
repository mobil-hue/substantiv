# Substantiv 名词 – lær norsk substantiv (norsk + 中文)

Pedagogisk nettside for en 9 år gammel elev som er svak i norsk og snakker kinesisk.
Åpne `index.html` i en nettleser (Chrome/Edge/Safari). Ingen installasjon.

## Innhold
- **7 moduler** (0–6): hvorfor lære substantiv → hva er et substantiv (inkl. egennavn og stor/liten bokstav) → en/ei/et → entall/flertall → ubestemt/bestemt → de fire formene → finn substantivene.
- **7 animerte lærevideoer** (norsk og kinesisk tekst og tale).
- **Oppgaver underveis i hver modul**: begreper (kort), små oppgaver, omfattende oppgaver og «øv til du er trygg»-løkker.
- **Øvingsrom** med fritt valg av tema, nivå og antall riktige på rad.
- **Begreper**: kort der blant annet *substantiv* og navnene på de fire formene terpes.
- **Gange** (`gange.html`): gangetabellen 2–10 med flervalg/skjermtastatur, poeng, statistikk over svake ganger, stolper med baller som hjelp og tale (norsk + kinesisk).
- **Lærerside** (`teacher.html`): oversikt over alle oppgaver, ordliste og fasit.
- **Skriveark** (`ark.html`): utskriftsklare ark for bøying og kjønn (en/ei/et) med fasit. Nye ord hver gang.
- **Bøyingstabell (PDF)**: `docs/substantiv-boyingstabell.pdf` – 74 vanlige substantiv i alle fire former, gruppert etter en/ei/et (kilde: `docs/jukselapp-boying.html`).
- **Jukselapp (PDF)**: `docs/substantiv-jukselapp.pdf` – alt på én side (bygges med `node docs/build-oversikt.js`).

## Oppgavemengde
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
js/app.js         visninger, øktkjører, fremgang
```
