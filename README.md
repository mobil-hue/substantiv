# Lær norsk og matte med kinesisk støtte (norsk + 中文)

Læreopplegg i samme system, samlet i en **rotmeny** (`index.html`) med fagene **Norsk**, **Matematikk** og **Norsk Voksenopplæring**. Flere fag kan legges til i `js/hub.js`.

| Fag | Opplegg | Side |
|---|---|---|
| Norsk | **Substantiv 名词** | `substantiv.html` |
| Matematikk | **Gange – lær og øv 乘法** (nytt) | `multiplikasjon.html` |
| Matematikk | **Geometri 几何** (Matematikk 4 kap. 4) | `geometri.html` |
| Matematikk | **Gangespill** (rask trening av gangetabellen) | `gange.html` |
| Norsk Voksenopplæring | **Norsk for voksne** – norsk · English · 中文 | `voksen.html` |

Norsk er hovedspråket. Kinesisk er støtte, både som tekst og som opplesing.

## Språk og opplesing
- **Vis tekst på:** norsk + 中文 (standard), bare norsk eller bare 中文.
- **Opplesing på:** norsk, 中文, begge eller av. Velges i knappen 🔊 øverst til høyre, i *Innstillinger*, på rotmenyen og **direkte i alle videoene** (på startkortet og under videoen; endrer du underveis starter scenen på nytt med ny stemme). Gjelder både forklaringene og oppgavene. Norske fagord leses alltid på norsk.
- Pinyin er skrudd av som standard (kan slås på under *Innstillinger*).
- I gange leses tall og regnestykker som ord («tre ganger fire er tolv» / 三乘以四等于十二).

## Svarmåte (matematikk-fagene)
Knappen øverst (✅ Flervalg · ⌨️ Skriv inn · 🎲 Tilfeldig) og *Innstillinger* styrer hvordan oppgaver med tall som svar vises: som flervalg, som innskriving med tallknapper, eller tilfeldig. Geometri starter med **flervalg**: navn på figurer skrives aldri, de velges (også gåtene og tau-oppgaven). Fri skriving av ord/tekst finnes bare når «Skriv inn» er valgt.

## Norsk Voksenopplæring 成人挪威语
Norsk for **kinesisktalende voksne**. Alle ord og setninger står på norsk, engelsk og kinesisk, og leses opp på norsk med nettleserens maskinstemme (stemmen kan velges).

- **De 100 og 500 vanligste ordene**: {{TOP}} ord, rangert etter hvor ofte de brukes i norsk talespråk. Grunnlaget er frekvensdata fra norske filmundertekster (OpenSubtitles 2018 via [hermitdave/FrequencyWords](https://github.com/hermitdave/FrequencyWords), CC BY-SA 4.0), slått sammen til oppslagsord og redigert for læring (egennavn, banning og voldsord er tatt ut). Pakker på 50 ord.
- **Hverdagsord**: {{THEME}} ord i {{NTHEME}} temaer (dyr, fisk og sjømat, frukt og grønt, mat og drikke, klær, skog og natur, vær, kroppen, helse, rom og møbler, utstyr i hus og hage, familie, by og transport, butikk og penger, samfunn og offentlige tjenester, jobb og skole, tid, tall og farger, følelser og egenskaper, hverdagsverb).
- **Hverdagssetninger**: {{PHRASE}} setninger i {{NPHRASE}} situasjoner (hilsener, i butikken, kafé, buss og tog, hos legen – også kvinnehelse og urinveier, apotek, nød, bolig, jobb og NAV, barnehage og skole, telefon/post/bank, vær).
- **Utvidet forklaring på alle ord**: ordklasse, en/ei/et, bøyning (substantiv, verb og adjektiv), eksempelsetning med oversettelse og en merknad om bruk og vanlige feil. Åpnes i lister, på kort, ved læring og etter hvert svar.
- **Lær nye ord**: forklaringskort (5 om gangen) og oppgaver på dem. **Dagens økt**: først repetisjon av det som er forfalt, så nye ord.
- **Quiz med valg av oppgavetyper** (alle kan slås av og på hver for seg, og svarmåten kan være flervalg, skriving eller blandet):
  - ord: kort (snu og vurder) · norsk → betydning · betydning → norsk · hør → betydning · hør → skriv (diktat) · fyll inn i setning · kjønn (en/ei/et) · bøyning · parspill;
  - setninger: hør og forstå · hva sier du? · bygg setningen · fyll inn · skriv setningen · diktat;
  - 🐢 sakte avspilling, hint, æ/ø/å-knapper (ae/oe/aa godtas), toleranse for småfeil, ⚡ fartsrunde (60 s).
- **Smart repetisjon**: hvert ord har en boks (ny → lærer → kjent → sikker) og kommer tilbake etter 10 minutter, 1, 3, 7, 16 og 35 dager. Feil kommer raskere tilbake (også senere i samme økt). «Auto-nivå» gir enkle oppgaver til nye ord og vanskeligere til kjente. Kjønn og bøyning øves som egne ferdigheter.
- **Ordliste/søk** på norsk, engelsk og kinesisk, **statistikk** (fremgang per liste, 14 dager, vanskelige ord), **uttale og alfabet** (æ, ø, å, kj-, sj-lyder … med lydeksempler og tips for kinesisktalende), og **innstillinger** (språk for betydning: English + 中文 / English / 中文; stemme, tempo, sakte tempo, artikkel ved skriving).
- Fremgangen lagres lokalt i nettleseren (`sub_vox_*`).

Data (ord, former, oversettelser, eksempler og merknader) ligger i `js/vox-*.js` i et enkelt tekstformat, beskrevet i `docs/vox-format.md`. Sjekk filer med `node docs/vox-validate.js js/vox-xxx.js`.

## Substantiv 名词
- **7 moduler** (0–6), **7 animerte lærevideoer**, begrepskort med tegninger, små og omfattende oppgaver, øvingsrom og «øv til du er trygg»-løkker.
- **Skriveark** (`ark.html`), **Lærerside** (`teacher.html`), **Jukselapp** (`docs/substantiv-jukselapp.pdf`), **Bøyingstabell** (`docs/substantiv-boyingstabell.pdf`).

## Gange – lær og øv 乘法
- **8 moduler:** hva er gange · gangetabellen og knepene · gange med 10/100/1 000 · del opp tallet (utvidet form og rutenett) · runde av og rette opp (276 × 3 = 300 × 3 − 24 × 3), dobbelt og halvparten · gamlemåten (oppstilling med mente) · tekstoppgaver · utfordringer og mesterprøve.
- **7 animerte videoer**, **16 begrepskort med tegninger**, over 700 små og 480 omfattende oppgaver.
- **Trinn for trinn:** regneoppgaver kan løses steg for steg med rutenett, oppstilling og mente som fylles ut underveis. Eleven slår trinn for trinn av og på på hver oppgave (👣) og i innstillingene.
- **Mengdetrening** (`multiplikasjon.html#/drill`): uendelig øving der eleven velger
  - oppgavetyper hver for seg (gangetabellen, hva mangler, × 10/100/1 000, tiere og hundrer, tosifret og tresifret × ensifret, tekstoppgaver) og hvilke tabeller (eller «bare de jeg sliter med»),
  - hvordan oppgaven vises (hver for seg eller flere): 🔢 tall (3 × 4) · 🔤 tekst (tre ganger fire) · 🔢🔤 tall og tekst · 🔊 **bare tale** på norsk (oppgaven vises ikke og kan høres igjen så mange ganger eleven vil),
  - svarmåte: flervalg, skriv inn eller tilfeldig.
  Poeng, hjelp med baller etter feil, og statistikk med fargekart over hele gangetabellen.
- **Skriveark** (`mult-ark.html`): 6 ark med fasit (gangetabellen, × 10/100/1 000, rutenett, runde av og dobbelt, oppstilling med ferdige ruter for mente, tekstoppgaver). Eksempel: `docs/eksempel-gange-skriveark.pdf` og `docs/eksempel-gange-fasit.pdf`.
- **Lærerside** (`multiplikasjon-laerer.html`) med fasit og utregnede eksempler, **Jukselapp** (`docs/gange-jukselapp.pdf`, bygges med `node docs/build-gange.js`).

## Geometri 几何
- **6 moduler, 58 steg**: figurer rundt oss, todimensjonale figurer, tredimensjonale figurer, nett og klosser, vinkler, «Finn ut».
- **7 animerte videoer**, begrepskort med tegninger, små og omfattende oppgaver, tegning på prikkpapir, øvingsrom og løkker.
- **Skriveark** (`geo-ark.html`), **Jukselapp** (`docs/geometri-jukselapp.pdf`), **Lærerside** (`geometri-laerer.html`).

## Opplesing (teknisk)
Bruker nettleserens talesyntese (Web Speech API): norsk (`nb-NO`) og kinesisk (`zh-CN`). Under *Innstillinger* og i videoene ser du om stemmene finnes på enheten.

## Filer
```
index.html                 rotmeny (js/hub.js: programmer og fag)
substantiv.html, geometri.html, multiplikasjon.html, gange.html
teacher.html, geometri-laerer.html, multiplikasjon-laerer.html
ark.html, geo-ark.html, mult-ark.html     skriveark
css/style.css, css/gange.css
js/util.js                 innstillinger, tale, hjelpefunksjoner
js/exercises.js            oppgavemotor (flervalg, skriv, tabell, sortering ...)
js/ex-num.js               tallsvar (flervalg/skriv), trinn-for-trinn-oppgaver
js/app.js                  visninger, øktkjører, fremgang (alle fag)
js/data.js, graphics.js, videos.js, lessons.js          substantiv
js/geo-*.js                geometri
js/mult-data.js            tallord (norsk/kinesisk), tale av regnestykker
js/mult-graphics.js        grupper, prikker, rutenett, oppstilling, tabell
js/mult-calc.js            regneoppgaver og trinn for trinn
js/mult-exercises.js, mult-lessons.js, mult-videos.js, mult-drill.js, mult-worksheets.js
js/hub.js                  rotmenyen
voksen.html                Norsk Voksenopplæring (css/vox.css)
js/vox-core.js             data, repetisjon (SRS), tekst- og taleverktøy
js/vox-build.js            oppgavetyper og detaljvisning
js/vox-quiz.js             øktkjører (spørsmål, svar, tilbakemelding)
js/vox-ui.js               visninger: oversikt, lister, quiz-oppsett, statistikk, uttale, innstillinger
js/vox-top1..3.js          de 500 vanligste ordene
js/vox-w1..w7.js           hverdagsord (temaer)
js/vox-p1..p2.js           hverdagssetninger
docs/vox-format.md         dataformat for ord og setninger
docs/vox-validate.js       validator for datafilene
docs/                      jukselapper og eksempler (PDF)
```
