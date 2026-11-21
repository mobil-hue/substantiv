# Lær norsk og matte med kinesisk støtte (norsk + 中文)

Læreopplegg i samme system, samlet i en **rotmeny** (`index.html`) med fagene **Norsk**, **Matematikk** og **Norsk Voksenopplæring**. Flere fag kan legges til i `js/hub.js`.

| Fag | Opplegg | Side |
|---|---|---|
| Norsk | **Substantiv – grunnkurs 名词基础课** (nytt, enklere start) | `substantiv-grunnkurs.html` |
| Norsk | **Substantiv 名词** (fullstendig kurs) | `substantiv.html` |
| Norsk | **Adjektiv – grunnkurs 形容词基础课** (nytt, enklere start) | `adjektiv-grunnkurs.html` |
| Norsk | **Adjektiv 形容词** (fullstendig kurs) | `adjektiv.html` |
| Matematikk | **Matematikk etter kompetansemål** (nytt: 1.–2. trinn, 27 moduler) | `matte.html` |
| Matematikk | **Gangetabellen som system 乘法系统** | `gangesystem.html` |
| Matematikk | **Gange – lær og øv 乘法** | `multiplikasjon.html` |
| Matematikk | **Geometri 几何** (Matematikk 4 kap. 4) | `geometri.html` |
| Matematikk | **Gangespill** (rask trening av gangetabellen) | `gange.html` |
| Norsk Voksenopplæring | **Norsk for voksne** – norsk · English · 中文 | `voksen.html` |

Norsk er hovedspråket. Kinesisk er støtte, både som tekst og som opplesing.

## Matematikk etter kompetansemål (`matte.html`)
Egen meny for matematikk, ordnet etter **trinn og kompetansemål** i LK20 (gyldig fra 1.8.2026; alle 101 mål ligger i `js/mt-maal.js`, generert fra `docs/laereplan/lk20-grunnskole.json`). Fra rotmenyen er matematikk nå ett kort. Gange, gangesystemet og geometri ligger fortsatt i egne sider og lenkes fra matematikkmenyen.

**Modell** (annen metode enn gangesystemet): først *forståelse* (grundig video: konkret → bilde → symbol), så *trening på flere nivåer*. Hver modul har:
- en video på tavle med lærerinne (5–9 scener, norsk tale og tekst),
- et **forstå-sjekk-nivå** (begrepsspørsmål med forklaring) og 3–5 treningsnivåer (bestått ved 80 %),
- en skriftlig forklaring (mål, steg, eksempler, ord, vanlige feil, til voksne) og en refleksjonsoppgave,
- **arbeidsark** (`matte-ark.html`): forklaringsark + tre differensierte ark (Nivå 1 start, Nivå 2 videre, Nivå 3 utfordring) + fasit, med seedede oppgaver og tilpasning til A4,
- `bygger` (forkunnskaper) som vises som «Bygger på» / «Åpner for» på modulsiden og i «Anbefalt rekkefølge».

Moduler laget så langt (68 stk, 368 nivåer; dekker alle kompetansemål i 1.–4. trinn: 1.–2. trinn KM13228–KM13242, 3. trinn KM13243–KM13254 og 4. trinn KM13255–KM13264):
- **Tall og mengder:** tall 0–10 · tall 11–20 · tiere og enere · tall til 100 · hundrere (til 999) · telle framover/bakover · hopptelling · partall og oddetall · tallinjen · gruppere etter egenskaper · tall i hverdagen.
- **Addisjon og subtraksjon (1.–2. trinn):** legge sammen · addisjon til 10 · trekke fra · regnefortellinger · addisjon over 10 · subtraksjon til 20 · tosifrede tall i hodet (pluss og minus) · oppstilling (pluss og minus) · veksling i addisjon (mente) · veksling i subtraksjon · tallinjen i regning.
- **Regneegenskaper og likhetstegn:** bytte rekkefølge · legge sammen tre tall · likhetstegnet.
- **Mønster, figurer, måling, tid og regler:** mønster (repeterende enheter) · figurer rundt oss (2D) · romfigurer · måle lengde · måle masse · klokka (hele og halve timer) · klokka (kvarter og minutter) · kalender · regler og trinnvise instruksjoner.
- **3. trinn:** strategier for pluss · strategier for minus · pluss og minus hører sammen · gange: like store grupper · gange og hopptelling (2-, 5-, 10-gangen) · dobling og halvering · dele likt (divisjon) · gange og deling i fortellinger.
- **3. trinn (forts.):** gange på mange måter (representasjoner) · gange: bytte rekkefølge og velge lette par · gange: dele opp (distributiv) · større enn, mindre enn og lik · likevekt (tall som mangler på vekta) · måle areal · koordinatsystem · regler og instruksjoner i koordinatsystemet.
- **4. trinn – divisjon:** delingsdivisjon og målingsdivisjon · divisjon på mange måter (tegning, tallinje, stang, tabell) · divisjonsstrategier (tenk gange, halver, del opp).
- **4. trinn – sammenhenger, overslag og uttrykk:** de fire regneartene hører sammen (regnefamilier, gjentatt addisjon/subtraksjon) · sjekk svaret med motsatt regneart (også divisjon med rest) · overslag · er løsningen rimelig? (tenkemåter, modeller, moteksempel) · fra fortelling til regneuttrykk · fra regneuttrykk til fortelling.
- **4. trinn – figurer, måling, mønster og algoritmer:** kanter, hjørner og flater · vinkler (rett, spiss, stump) · måle volum (klosser, liter og desiliter) · mønstre som vokser · mønstre i spill (terninger, Nim) · algoritmer og løkker · variabler og vilkår.

**To typer kompetansemål:** menyen skiller mellom 🎯 *konkrete mål* (ett–to moduler er laget direkte for målet) og 🧩 *overordnede (abstrakte) mål* som bare kan nås gjennom mange moduler, også fra tidligere temaer (nå KM13241, KM13232, KM13234, KM13258, KM13259, KM13260). Overordnede mål er oppført i `js/mt-maaltype.js` (`MT.ABS`) med `egen` (moduler laget særskilt for målet), `bygg` (ekstra byggesteiner som ikke har målet i `maal`) og en forklaring. Alle moduler som har målet i `maal` regnes som byggesteiner hvis målet er overordnet, ellers som egne moduler. Konkrete mål viser «Bygger på» (forkunnskaper) fra modulene. Valideringen (`tools/mt-validate.js`) sjekker at overordnede mål har egne moduler og byggesteiner, og at mål med mange moduler er merket.

**Mengdetrening:** moduler med rene regneoppgaver (nå 32 av 68) har i tillegg *mengdetrening*: mange oppgaver på rad, både **på skjermen** (`#/m/<id>/drill`, med tid og tall på riktige) og som **eget ark** (del «Mengdetrening» i `matte-ark.html`: ark A = vanlig, ark B = utfordring, med fasit). Tidlige moduler viser mengdebilder (tierrammer, grupper) ved siden av regnestykkene; senere moduler har rene regnestykker eller oppstilling i rutenett. Registreres med `drill:{tittel, layout:'row'|'pic'|'col', cols, n:[ark, skjerm], make:(r, i, hard) => ({t:'7 + 5 =', ans:12, pic?, col?})}` i `js/mt-drill.js` (eldre moduler) eller direkte i modulen. `☐` i teksten er et tomt felt midt i regnestykket.

**Støttespråk i matematikk (10 språk):** matematikkdelen er flerspråklig på flere måter, alle KI-oversatt og ikke lest av morsmålsbrukere.
1. **Faste tekster** er oversatt som hele setninger: meny, knapper, overskrifter, de 68 modultitlene og titlene og beskrivelsene av alle nivåene (847 tekster). De ligger i `tools/i18n/mt/chrome.tsv` (norsk nøkkel med tall som `#`, tall som `{1}` i oversettelsene).
2. **Fortellertekst og skriftlige forklaringer:** fortellerteksten i videoene (513 scener, `tools/i18n/mt/narration.tsv`) og de skriftlige forklaringene (mål, trinn, eksempler, ordforklaringer, vanlige feil og refleksjon, 985 tekster, `tools/i18n/mt/tekst.tsv`) er oversatt. Oversettelsen vises som en egen linje under norsk tekst når et støttespråk er valgt (`TX()` i `js/mt-core.js`). Noen få kodeblokker og fargeruter med tall bare i HTML er ikke oversatt.
3. **Ordhjelp:** i oppgaver, forklaringer, hjelpetekster, skriftlige forklaringer og fortellerteksten i videoene kan eleven trykke på et ord med prikkete strek og se hva det betyr på støttespråket (`js/mt-gloss.js`). Ordlisten ligger i `tools/i18n/mt/words.tsv` (nå 1185 ord, ca. 96 % av ordene i oppgave-, forklarings- og videotekstene).
Ikke oversatt som setninger: de ca. 18 000 oppgave- og forklaringsmalene (dekket av ordhjelpen) og kompetansemålene (de beholdes på norsk med vilje). Automatisk maskinoversettelse ble prøvd og forkastet (den bytter ut og dropper ord og gir misvisende matematikk). Etter endring i `words.tsv`, `chrome.tsv`, `narration.tsv` eller `tekst.tsv`: `node tools/i18n/build-mt.js` (lager `js/i18n/mtw-*.js`, `mt-*.js` og `mt-keys.js`). Kolonner: no, en, sv, zh, ar, es, pl, uk, th, tl, so.

**Oversikt:** `docs/matte-oversikt.md` (moduler, mål, forkunnskaper, nivåer; generert med `tools/mt-oversikt.js`).

**Filer:** `js/mt-core.js` (register, oppgavebyggere, fremgang, meny, øvingsløper), `js/mt-maaltype.js` (konkrete og overordnede mål), `js/mt-gfx.js`–`mt-gfx4.js` (tierramme, klosser, tallinje, oppstilling, balansevekt, tabell, koordinatsystem, vinkler, blokker, målebeger, programkode …), `js/mt-m-*.js` (modulene), `js/mt-ark.js` + `matte-ark.html` (arbeidsark), `css/mt.css`.

**Legge til en modul:** `MT.module({id, rek, trinn, maal:['KM…'], tittel, ikon, bygger:[...], video:[{html, no}], tekst, refleksjon, nivaaer:[{t, d, kind:'forstaa'|'tren', n, make:(r, i) => Q.num(...)|Q.choice(...)|Q.yn(...)}]})`. `{?}` i stemmen er svarplassen. `calc` (uttrykk som skal være lik svaret) eller `chk` (uttrykk med `_` for svaret) lar valideringen regne etter.

**Kontroll (krever `python3 -m http.server 8765` og Playwright):**
```
NODE_PATH=$(npm root -g) node tools/mt-validate.js 60     # alle generatorer: svar, alternativer, calc/chk, video og tekst
NODE_PATH=$(npm root -g) node tools/mt-ark-check.js        # alle arbeidsark får plass på A4 (PDF-sidetall)
```
**Språk:** Matematikken er på norsk, med KI-oversatt støtte på 10 språk (se «Støttespråk i matematikk» over). Innholdet er laget med KI og bør gjennomleses av en lærer og morsmålsbrukere.

## Språk og opplesing
- **Vis tekst på:** norsk + 中文 (standard), bare norsk eller bare 中文.
- **Opplesing på:** norsk, 中文, begge eller av. Velges i knappen 🔊 øverst til høyre, i *Innstillinger*, på rotmenyen og **direkte i alle videoene** (på startkortet og under videoen; endrer du underveis starter scenen på nytt med ny stemme). Gjelder både forklaringene og oppgavene. Norske fagord leses alltid på norsk.
- Pinyin er skrudd av som standard (kan slås på under *Innstillinger*).
- I gange leses tall og regnestykker som ord («tre ganger fire er tolv» / 三乘以四等于十二).

## Svarmåte (matematikk-fagene)
Knappen øverst (✅ Flervalg · ⌨️ Skriv inn · 🎲 Tilfeldig) og *Innstillinger* styrer hvordan oppgaver med tall som svar vises: som flervalg, som innskriving med tallknapper, eller tilfeldig. Geometri starter med **flervalg**: navn på figurer skrives aldri, de velges (også gåtene og tau-oppgaven). Fri skriving av ord/tekst finnes bare når «Skriv inn» er valgt.

## Norsk Voksenopplæring 成人挪威语
Norsk for **kinesisktalende voksne**. Alle ord og setninger står på norsk, engelsk og kinesisk, og leses opp på norsk med nettleserens maskinstemme (stemmen kan velges).

- **De 100 og 500 vanligste ordene**: 500 ord, rangert etter hvor ofte de brukes i norsk talespråk. Grunnlaget er frekvensdata fra norske filmundertekster (OpenSubtitles 2018 via [hermitdave/FrequencyWords](https://github.com/hermitdave/FrequencyWords), CC BY-SA 4.0), slått sammen til oppslagsord og redigert for læring (egennavn, banning og voldsord er tatt ut). Pakker på 50 ord.
- **Hverdagsord**: 1 382 ord i 20 temaer (dyr, fisk og sjømat, frukt og grønt, mat og drikke, klær, skog og natur, vær, kroppen, helse, rom og møbler, utstyr i hus og hage, familie, by og transport, butikk og penger, samfunn og offentlige tjenester, jobb og skole, tid, tall og farger, følelser og egenskaper, hverdagsverb).
- **Hverdagssetninger**: 526 setninger i 14 situasjoner (hilsener, i butikken, kafé, buss og tog, hos legen – også kvinnehelse og urinveier, apotek, nød, bolig, jobb og NAV, barnehage og skole, telefon/post/bank, vær).
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

## Grunnkurs (substantiv og adjektiv)
For elever som sliter med å få hele sammenhengen. Samme motor og samme oppgaver som det fullstendige kurset, men:
- **5 små moduler** med 3–5 steg hver, og kun de aller enkleste ordene (nivå 1: regelmessige ord, og bare adjektiv som får vanlig +t og +e).
- **Korte videoer** (4–5 scener, ett poeng om gangen) og **kun flervalg**, ingen skriving.
- Substantiv: hva er et substantiv · en/ei/et · én eller flere · bilen/hunden · alt sammen. Adjektiv: hva er et adjektiv · motsetninger · en stor hund/et stort hus · store hunder · alt sammen.
- Egen fremgang (lagres adskilt fra det fullstendige kurset). Fra grunnkurset er det en knapp til **Fullstendig kurs**, og omvendt.
- Moduler og steg ligger i `js/basic-lessons.js`, videoene i `js/basic-videos.js`. Siden velges med `window.COURSE = 'basic'`.

## Substantiv 名词
- **7 moduler** (0–6), **7 animerte lærevideoer**, begrepskort med tegninger, små og omfattende oppgaver, øvingsrom og «øv til du er trygg»-løkker.
- **Skriveark** (`ark.html`), **Lærerside** (`teacher.html`), **Jukselapp** (`docs/substantiv-jukselapp.pdf`), **Bøyingstabell** (`docs/substantiv-boyingstabell.pdf`).

## Adjektiv 形容词
Bygger på samme system som substantiv (samme motor, svarmåte flervalg / skriv inn / tilfeldig, tospråklig tekst og opplesing).
- **8 moduler** (0–7): hvorfor adjektiv · hva er et adjektiv (farge, størrelse, følelse, egenskap) · motsetninger · adjektiv med en/ei/et (+t, +tt, ingen endring) · flertall og bestemt form (store hunder, den store hunden, den/det/de) · spesielle adjektiv (liten – lita – lite – små, blå/grå, gammel → gamle, tom → tomme) · sammenligning (stor – større – størst, enn, like … som, mer/mest) · adjektiv i setninger (etter «er», to adjektiv, mesterprøve).
- **8 animerte lærevideoer**, 16 begrepskort, 48 adjektiv med eksempler på en-, ei- og et-ord, over 1 900 små og over 130 omfattende oppgaver (flervalg, innskriving, sortering, tabeller, diktat, finn adjektivene, bygg setningen).
- **Skriveark** (`adjektiv-ark.html`, 6 ark med fasit), **Lærerside** (`adjektiv-laerer.html`), **Jukselapp** (`docs/adjektiv-jukselapp.pdf`, bygges med `node docs/build-adjektiv.js`).
- Data (adjektiv, former, motsetninger, gradbøying, begreper, tekster) ligger i `js/adj-data.js`.

## Gangetabellen som system 乘法系统
Bygger på «Den lille gangetabellen – hva må egentlig pugges?»: tabellen behandles som et system som krymper fra **100 ruter til 10 regnestykker**. Rekkefølgen er fast, og den samme rekkefølgen brukes til å finne regelen for et regnestykke:
1. speilvendte ut (5 × 6 = 6 × 5) → 55 · 2. **1-, 2- og 10-gangen** ut → 28 · 3. **5-gangen** (halvparten av 10-gangen) ut → 21 · 4. **like × like** (6 kvadrattall) ut → 15 · 5. **9-regelen** y × 9 = (y × 10) − y ut → 10 · 6. **de 10 som må pugges** (3×4, 3×6, 3×7, 3×8, 4×6, 4×7, 4×8, 6×7, 6×8, 7×8), med triks (4-gangen = doble to ganger, 8-gangen = doble tre ganger, rekka 5-6-7-8 → 56 = 7 × 8).
- **8 videoer** på en **grønn tavle med kritt-skrift** (norsk i hvitt, kinesisk i gult, teksten «skrives opp» fra venstre) og en **blid lærerinne i en «snakkefirkant»** nede i hjørnet; munnen beveger seg mens det leses opp. Kan slås av og på med knappen «Tavle og lærerinne» i spilleren (valget huskes). Gjelder videoer med `board: true` (`css/board.css`, `js/board.js`); samme avspiller og tospråklig opplesing som resten: systemet · speilvendte · 1-2-10 · 5-gangen · y × y · 9-gangen · de 10 · hvilken regel gjelder?
- **Læringsløype** på forsiden (video + øving per steg, med hake når steget er gjort) og en **interaktiv tabell**: trinn 1–7 (kan spilles av), alle regler i farger, og trykk på en rute for å få vite hvilken regel som gjelder og hvordan du regner.
- **Treningsmodus** (`#/train/all`, `#/train/easy|five|sq|nine|learn`, `#/spot`, `#/cards/learn`, `#/speed`, `#/mirror`, `#/stats`): hele tabellen blandet · én gruppe om gangen · **regelspotter** (velg hvilken regel som gjelder) · pugge-kort · fartsrunde 60 s · speilvendte. I øving kan regelhjelp velges: vis regelen først, ❓-knapp, eller bare etter feil; svar som flervalg, skriving eller tilfeldig; «forklar etter hvert svar». Feil kommer raskere tilbake.
- **Arbeidsark** (`gs-ark.html`): 8 ark med fasit, ett per steg: systemet (fargelegg tabellen) · speilvendte og 1-2-10 · 5-gangen · like × like · 9-gangen · de 10 som pugges · hvilken regel gjelder? · mesterprøve (hele tabellen). «Nye ark» gir nye oppgaver, og samme lenke gir samme ark så fasiten stemmer. Bygger på `js/gs-worksheets.js`.
- **Fremgang** per regnestykke (ny → lærer → sikker) som fargekart over tabellen og per gruppe.
- Filer: `gangesystem.html`, `css/gs.css`, `js/gs-core.js` (grupper, regelklassifisering, forklaringer, fremgang, tabelltegning), `js/gs-videos.js`, `js/gs-app.js`. Bruker `A.Video`, tale og tallord fra resten av systemet.

### Introduksjonsvideo til YouTube (norsk og engelsk)
`tools/video/build.js` setter sammen de 8 gangesystem-videoene til én mp4 (1280 × 720, tavle med kritt-skrift og lærerinne i hjørnet), med avslutning om at det er gratis, og lager `.srt`-undertekster, kapitler og ferdig YouTube-beskrivelse for hvert språk. Engelsk tekst hentes fra ordboka `js/i18n/en.js`. Videoen får en ny avslutning (gratis på adressen i `SITE`, liste over språkene, skjermbilder tatt automatisk av appen, arbeidsark med fasit og et sluttkort om at det er et hobbyprosjekt 100 % laget med AI). Talen lages med Piper (gratis, lokalt) eller Azure Speech:

```
TTS=piper PIPER_PY=<python med piper-tts> PIPER_DIR=<mappe med .onnx-modeller> node tools/video/build.js
AZURE_SPEECH_KEY=… AZURE_SPEECH_REGION=westeurope node tools/video/build.js
```
Standard adresse er `www.skoleboken.com` (`SITE=…` for å bytte). Piper-stemmer: `PIPER_NO_MODEL` (standard `no_NO-talesyntese-medium`, valgt etter lytting) og `PIPER_EN_MODEL` (standard `en_GB-cori-high`); `PIPER_NO_SPEAKER`/`PIPER_EN_SPEAKER` for modeller med flere talere, `PIPER_SPEED` og `PIPER_SILENCE` for tempo og pauser (standard: Pipers egne). Uten tale lages en stum prøveversjon. Valg: `--lang no,en`, `--only gs_system,outro`, `--preview`. Resultatet havner i `tools/video/out/` (ikke i git). Krever node, playwright, ffmpeg og curl. Fonten Patrick Hand (OFL) ligger i `css/fonts/`.

## Språk (støttespråk) i gangesystemet
Norsk er hovedspråket. Eleven velger **støttespråk** med 🌍-knappen øverst: **English, Svenska, 中文, العربية, Español, Polski, Українська, ไทย, Tagalog og Soomaali**. Valget gjelder tekst, regelforklaringer, videoer (tekst og opplesing) og oppgaver, og lagres i nettleseren. Første gang velges språk ut fra nettleseren (ellers engelsk). Arabisk vises fra høyre mot venstre, og regnestykker snus ikke.
- **Opplesing** bruker stemmene som finnes i nettleseren/på enheten. Tagalog og somali har ofte ingen stemme, og da vises bare tekst (språkvelgeren viser 🔊 eller 🔇 per språk).
- **Slik fungerer det:** alle tekster står som `A.bi(norsk, kinesisk)`. For andre språk slås den norske teksten opp i en ordbok (`js/i18n/<språk>.js`, nøkkel = id fra `js/i18n/keys.js`; tall settes inn som `{1}`, `{2}` …). Mangler en oversettelse brukes engelsk, og til sist vises bare norsk. Slås på per side med `window.SUPPORT_LANGS = true` (nå `gangesystem.html`); de andre fagene er uendret.
- **Oversettelsene er laget med AI** og bør leses av morsmålsbrukere, særlig somali, tagalog og thai. Rettelser gjøres direkte i språkfilen.
- **Verktøy** (`tools/i18n/`): `node tools/i18n/collect.js` går gjennom appen og samler alle tekster (`master.json`, id-ene er stabile); `node tools/i18n/collect.js --check th` tester dekning i nettleseren; `node tools/i18n/validate.js` sjekker alle språkfilene (manglende id-er og tall). **Nytt språk:** legg til i `A.LANGS` i `js/util.js`, lag `js/i18n/<kode>.js` ut fra `master.json`, og kjør validate.
- Arbeidsarkene (`gs-ark.html`) har foreløpig bare norsk + kinesisk.

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
substantiv.html, substantiv-grunnkurs.html, adjektiv.html, adjektiv-grunnkurs.html, geometri.html, multiplikasjon.html, gange.html
teacher.html, adjektiv-laerer.html, geometri-laerer.html, multiplikasjon-laerer.html
ark.html, adjektiv-ark.html, geo-ark.html, mult-ark.html     skriveark
css/style.css, css/gange.css
js/util.js                 innstillinger, tale, hjelpefunksjoner
js/exercises.js            oppgavemotor (flervalg, skriv, tabell, sortering ...)
js/ex-num.js               tallsvar (flervalg/skriv), trinn-for-trinn-oppgaver
js/app.js                  visninger, øktkjører, fremgang (alle fag)
js/data.js, graphics.js, videos.js, lessons.js          substantiv
js/geo-*.js                geometri
js/basic-lessons.js, basic-videos.js   grunnkurs (substantiv og adjektiv)
js/adj-data.js             adjektiv, former, motsetninger, begreper, tekster
js/adj-exercises.js, adj-lessons.js, adj-videos.js, adj-worksheets.js   adjektiv
js/mult-data.js            tallord (norsk/kinesisk), tale av regnestykker
js/mult-graphics.js        grupper, prikker, rutenett, oppstilling, tabell
js/mult-calc.js            regneoppgaver og trinn for trinn
js/mult-exercises.js, mult-lessons.js, mult-videos.js, mult-drill.js, mult-worksheets.js
gangesystem.html, css/gs.css, js/gs-core.js, gs-videos.js, gs-app.js   gangetabellen som system
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
docs/laereplan-moduler.md   hvilke moduler som kan lages til hvilke trinn (LK20, gyldig fra 2026-08-01), med vurdering
docs/laereplan-matematikk-per-maal.md   alle 101 matematikkmål ett for ett: nivåtrapp, begrensninger og vurdering
docs/laereplan/            kompetansemål 1.–10. trinn (JSON, hentet fra Udir); tools/laereplan/fetch.py henter på nytt
```
