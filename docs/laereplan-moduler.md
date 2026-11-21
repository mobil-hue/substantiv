# Læreplanverket 1.–9. trinn: hvilke moduler kan lages, og hvor bra?

Utarbeidet 2026-11-21. Grunnlag: Utdanningsdirektoratets åpne læreplandata (Grep), **nyeste publiserte versjon per fag, gyldig fra 1. august 2026**. Alle 563 kompetansemål for 1.–10. trinn ligger i `docs/laereplan/lk20-grunnskole.json` (hentet med `tools/laereplan/fetch.py`), og kodene under (KM13245 osv.) kan slås opp der.

> **Viktig forbehold.** Vurderingene er mine, ikke en fagdidaktikers. Jeg kan bygge øvingsmoduler, forklaringsvideoer, arbeidsark og en regelforklaring som gangesystemet. Jeg kan ikke avgjøre om noe er pedagogisk riktig for et bestemt trinn, og en app «dekker» aldri et kompetansemål alene. Den kan **støtte og trene** det. Alt bør leses av lærere før bruk.

## 1. Det jeg fant

| Fag | Gjeldende plan | Mål per |
|---|---|---|
| Matematikk | `MAT01-06` (fastsatt 2026-06-08) | **hvert trinn** (1.–2. samlet, så 3., 4., … 10.) |
| Norsk | `NOR01-08` | etter 2., 4., 7. og 10. trinn |
| Engelsk | `ENG01-06` | etter 2., 4., 7. og 10. trinn |
| Naturfag | `NAT01-05` | etter 2., 4./5., 7. og 10. trinn |
| Samfunnsfag | `SAF01-05` | etter 2., 4., 7. og 10. trinn |
| KRLE | `RLE01-04` | etter 4., 7. og 10. trinn |
| Fremmedspråk | `FSP01-04` | nivå I fra 8. trinn |
| Programmering (valgfag), kunst og håndverk, musikk, mat og helse, kroppsøving, utdanningsvalg | `PRG01-02`, `KHV01-03`, `MUS01-03`, `MHE01-03`, `KRO01-06`, `UTV01-03` | varierer |

- **Matematikk er revidert** og er nå den eneste planen med egne mål for hvert trinn. De andre fagene har mål i trinnspenn. **«8.–9. trinn» finnes derfor ikke som egen enhet i norsk, engelsk, naturfag og samfunnsfag**, bare som en del av 10. trinn.
- **Digital bruk på 1.–4. trinn:** I matematikkplanens tekst står det: «For elever på 1.–4. trinn skal bruken av digitale enheter være særskilt varsom og ikke dominere undervisningen.» Setningen står likelydende i alle planene jeg sjekket (matematikk, norsk, engelsk, naturfag, samfunnsfag, KRLE, kunst og håndverk, musikk, mat og helse og kroppsøving). **Moduler for 1.–4. trinn bør derfor være papir først:** arbeidsark, korte økter, og skjerm som et lite supplement under lærerstyring.
- **Fra andre kilder (søk, ikke verifisert mot primærkilde):** Utdanningsdirektoratet lager veiledende **innholdslister**. Samfunnsfag og musikk skal være klare til skoleåret 2026/27, norsk og flere praktiske fag til 2027/28. Regjeringen har ifølge søket varslet «mindre KI, flere fysiske bøker». Et prosjekt som er «100 % laget med AI» kan derfor møte skepsis i skolen.
- Det jeg ikke har med: læreplanen for **voksenopplæring** (norsk og samfunnskunnskap for voksne innvandrere), som «Norsk for voksne» hører under. Den er en egen plan.

## 2. Skala

**Vurdering** (hvor bra jeg kan få modulen, sammenlignet med gangesystemet):
- **A** – like bra som gangesystemet: eksakte svar, tydelig regelverk, trinnvis forklaring, automatisk tilbakemelding.
- **B** – godt, men med tydelige begrensninger (for eksempel manglende praktisk arbeid, eller svakere automatisk vurdering).
- **C** – kan støtte målet (forklaring, quiz), men ikke trene eller vurdere det.
- **D** – lite egnet for en app. Bør gjøres av en lærer, eller ikke i det hele tatt.

**Størrelse:** **S** = en video og en øvingstype. **M** = som gangesystemet (video, regelhjelp, flere treningsmodus, arbeidsark, ti språk). **L** = krever nytt verktøy (grafer, kodeeditor, kart, regneark).

Alle moduler får samme språkstøtte (ti språk) og arbeidsark. Oversettelsene er laget med AI og må leses av morsmålsbrukere.

## 3. Det som allerede finnes, og hva det er forankret i

| Modul | Forankring i planen |
|---|---|
| Gangetabellen som system / Gange – lær og øv | Matematikk **3. trinn**: KM13245 (multiplikasjon ved telling og gruppering), KM13254 (dobling og halvering), KM13246, KM13247, KM13248 (kommutative, assosiative og distributive egenskaper) |
| Geometri | Matematikk **4. trinn**: KM13261 (to- og tredimensjonale figurer: vinkler, kanter, hjørner, flater). Modulen er laget etter en lærebok, så den bør sjekkes mot målet |
| Substantiv og adjektiv (inkl. grunnkurs) | Norsk **4. trinn**: KM14159 (fagspråk om bøying av verb, substantiv og adjektiv). Også 7. trinn KM14177 |
| Gangespill | KM13245 og KM13254, men som ren trening uten forklaring |

**Merk:** Planen sier ikke «lær gangetabellen utenat». Den vektlegger strategier, representasjoner og regneegenskaper. Gangesystemet passer fordi det bygger på nettopp strategier og egenskaper (KM13248, KM13254), men det er mer pugging enn planen legger vekt på. Vil du forankre det tydelig, bør forklaringene løfte frem «hvorfor» (egenskapene) like mye som «hvilket svar».

## 4. Matematikk (størst potensial)

Her kan jeg gjøre mest. Rundt tre av fire mål (grovt, mitt skjønn) lar seg trene med eksakte svar og trinnvis forklaring. De som ikke lar seg trene er de som handler om å utforske, argumentere og vurdere kritisk.

| Trinn | Modul | Forankring | Vurd. | Str. | Merknad |
|---|---|---|---|---|---|
| 1–2 | Tall og telling til 100, tallinjen, posisjonssystemet | KM13229, KM13241, KM13230, KM13232, KM13233 | A– | M | Visuelt og med tale. Konkreter og lek kan ikke erstattes |
| 1–2 | Partall og oddetall | KM13231 | A | S | |
| 1–2 | Addisjon og subtraksjon, strategier | KM13234, KM13235 (3. trinn: KM13243, KM13244) | A | M | Tiervenner, dobling, trinnvis forklaring |
| 1–2 | Likhetstegnet | KM13242 | B+ | S | Begrepet er viktigere enn regning. Vekt-modell hjelper |
| 1–2 | Mønster | KM13236 | B+ | S | |
| 1–2 | Klokka og kalender | KM13238 | A | S | Klokke du kan dra i |
| 1–2 | Geometriske figurer | KM13237 | B | S | Sortering går, men «nærmiljø» krever virkelige figurer |
| 1–2 | Måle lengde og masse | KM13240 | C+ | S | Hele poenget er å måle med hendene |
| 1–2 | Regler og trinnvise instruksjoner (uten skjerm) | KM13239 | B | S | Passer som arbeidsark |
| 3 | **Multiplikasjon** | KM13245, KM13247, KM13248, KM13254, KM13246 | **A** | ✔ | Finnes |
| 3 | Likevekt, likhets- og ulikhetstegn | KM13249, KM13250 | B+ | S | Interaktiv vekt |
| 3 | Koordinatsystemet | KM13251, KM13252 | A– | S | Plassere punkter, «senke skip» |
| 3 | Måle areal | KM13253 | B | S | |
| 4 | **Divisjon** | KM13255, KM13256, KM13257, KM13258 | **A** | M | Se egen vurdering: henger tett på gangetabellen |
| 4 | Regneuttrykk og tekstoppgaver | KM13260, KM13259 | B | M | Maler går bra, åpne resonnementer kan ikke vurderes |
| 4 | Figurer: vinkler, kanter, flater | KM13261 | A– | ✔ | Finnes, bør sjekkes mot målet |
| 4 | Mønster og algoritmer | KM13262, KM13263 | B | L | Krever kodeeditor med blokker |
| 4 | Måle volum | KM13264 | C+ | S | |
| 5 | **Brøk** | KM13265, KM13266, KM13267, KM13268, KM13269 | **A–** | M | Brøkstolper og tallinje, god visuell støtte |
| 5 | Ligninger | KM13274 | A– | M | Balansemodell |
| 5 | Sannsynlighet | KM13270 | B | M | Simuleringer |
| 5 | Regneark og personlig økonomi | KM13271 | B | L | Krever et lite regneark |
| 5 | Tid | KM13273 | A– | S | |
| 5 | Programmering | KM13272 | B | L | |
| 6 | **Desimaltall** | KM13275, KM13276, KM13277 | **A** | M | |
| 6 | Symmetri og kongruensavbildning | KM13283, KM13284 | B | M | Speiling og flytting på rutenett |
| 6 | Sirkelen (radius, diameter, omkrets, pi) | KM13279 | B+ | S | Måling i praksis kan ikke erstattes |
| 6 | Areal, omkrets og volum | KM13280, KM13281, KM13285 | A– | M | Rutenettmodellen finnes allerede |
| 6 | Figurenes egenskaper | KM13278 | B+ | S | |
| 7 | **Prosent** og brøk–desimal–prosent | KM13286, KM13288 | **A** | M | |
| 7 | Negative tall | KM13292 | A– | S | |
| 7 | Regnerekkefølge | KM13287 | A | S | Trinnvis motor finnes |
| 7 | Ligninger og ulikheter | KM13291, KM13294, KM13296 | A– | M | |
| 7 | Sentralmål, tabeller og diagram | KM13289, KM13290 | B+ | M | Lage diagram går. Å velge fremstilling og forklare valget er svakere |
| 7 | Økonomi: overslag | KM13295 | B | S | |
| 8 | **Potenser og kvadratrøtter** | KM13297 | **A** | S | |
| 8 | Faktorisering og primtall | KM13298 | A | S | |
| 8 | Mønstre og algebra | KM13299, KM13301 | B+ | M | |
| 8 | Ligninger og ulikheter | KM13304, KM13305 | A– | M | |
| 8 | **Funksjoner** | KM13302, KM13306 | **A–** | L | Krever graftegner |
| 8 | Regneegenskaper som strategi | KM13303 | B+ | S | |
| 9 | Sammensatte måleenheter | KM13316 | A– | S | |
| 9 | Formlikhet, kongruens, Pytagoras, trekanter | KM13308, KM13317, KM13307, KM13309 | B+ | L | Krever interaktiv geometri. Argumentasjon kan ikke vurderes |
| 9 | Overflateareal og volum | KM13310 | A– | S | |
| 9 | Statistikk og kritisk tolking | KM13312, KM13313, KM13314 | B | M | Utregning er A. Kritisk vurdering av media er C |
| 9 | Sannsynlighet og simulering | KM13315, KM13311 | B+ | M | |

### Divisjon (4. trinn)
Divisjon er gangetabellen sett fra den andre siden, og det er slik planen også stiller den opp (KM13255 «måling og deling», KM13256 representasjoner, KM13257 strategier, KM13258 sammenhengen mellom de fire regneartene). Det betyr at **systemet fra gangesystemet overføres**: faktafamilier (7 × 8 = 56, 56 ÷ 7 = 8), de samme 10 som må pugges, og triks som ÷ 10 = stryk nullen og ÷ 5 = doble og så ÷ 10. Tverrsum og delbarhetsregler gir en bonus. **Vurdering A, størrelse M.** Det må lages som en tydelig fortsettelse av gangesystemet.

## 5. Norsk

Her er potensialet mye mindre. Mest av planen handler om å lese, skrive, samtale og presentere, og det kan en app ikke vurdere. Grovt anslått kan **rundt en femtedel** av målene trenes direkte (mitt skjønn), nesten alt om språk som system.

| Trinn | Modul | Forankring | Vurd. | Str. | Merknad |
|---|---|---|---|---|---|
| 1–2 | Store og små bokstaver, punktum, spørsmåls- og utropstegn | KM14144 | A | S | |
| 1–2 | Bokstavlyder og å trekke sammen til ord | KM14145, KM14146 | B– | M | Talesyntese er svak på enkeltlyder. Trenger innspilte lyder |
| 1–2 | Ord og uttrykk: oppbygning og betydning | KM14148 | B | S | |
| 1–2 | Lese med forståelse | KM14140 | B | M | Kort tekst og spørsmål. Papir først (1.–4. trinn) |
| 3–4 | Komma og skilletegn | KM14157 | A– | S | |
| 3–4 | **Substantiv, verb og adjektiv** | KM14159 | **A** | ✔ / M | Substantiv og adjektiv finnes. **Verb mangler** |
| 3–4 | **Sammenligne ord i norsk og andre språk** | KM14168 | **A** | M | Passer særlig godt til flerspråklig støtte. Oversettelser må kontrolleres |
| 3–4 | Hovedmål og sidemål: innføring | KM14161 | B+ | M | |
| 5–7 | Ordklasser og setningsoppbygning | KM14177 | A | M | |
| 5–7 | Rettskriving, ordbøying og tegnsetting | KM14172 | A– | M | |
| 5–7 | Sidemål (nynorsk) | KM14175 | B+ | M | |
| 5–7 | Kilder og kildebruk | KM14173 | C+ | S | |
| 8–10 | **Rettskriving og ordbøying på hovedmål og sidemål** | KM14191 | **A** | M | Bokmål og nynorsk side om side. Trenger et ordregister, og her kan åpne data fra Nasjonalbiblioteket hjelpe |
| 8–10 | Grammatikk og tekststruktur | KM14194 | B+ | M | |
| 8–10 | Retoriske virkemidler | KM14192 | B | S | Kjenne igjen i eksempler |
| 8–10 | Språkhistorie og språklig mangfold | KM14195, KM14196 | C+ | S | |

**Lite egnet (D, eller C ved støtte):** å lese skjønnlitteratur, skrive tekster, muntlige presentasjoner og samtale (for eksempel KM14139, KM14143, KM14154, KM14181, KM14188). Her kan jeg bare lage sjekklister og arbeidsark, ikke trene eller vurdere.

## 6. Engelsk

Samme bilde som norsk: det som lar seg trene er ordforråd, uttale, ordklasser og regler. Stemmene i nettleseren er gode på engelsk, så lyd fungerer bedre enn på norsk. Grovt anslått en femtedel av målene.

| Trinn | Modul | Forankring | Vurd. | Str. |
|---|---|---|---|---|
| 1–2 | Alfabet, uttale og høyfrekvente ord | KM13331, KM13334 | A– | M |
| 1–2 | Spørsmål, instruksjoner og høflighetsuttrykk | KM13332, KM13333 | B+ | S |
| 3–4 | Ordklasser, rettskriving og setningsstruktur | KM13344, KM13345 | A– | M |
| 3–4 | **Ord som er felles med andre språk** | KM13346 | **A** | S |
| 5–7 | Bøying og setningsledd | KM13370, KM13360 | A– | M |
| 8–10 | Ordklasser, idiomatiske uttrykk og uttale | KM13389, KM13372, KM13388 | B+ | M |

Lite egnet: å snakke, skrive og lese litteratur (C–D).

## 7. Naturfag

Her kan jeg lage **forklaringsvideoer med tegninger, diagrammer og quiz**. Målene sier derimot ofte «utforske», «planlegge og gjennomføre undersøkelser» og «designe og lage», som kan en app bare støtte. Det fagfaglige må kontrolleres av noen som kan faget, siden feil i naturfag er lette å lage og vanskelige å oppdage.

| Trinn | Modul | Forankring | Vurd. | Str. |
|---|---|---|---|---|
| 4–5 | Vannets kretsløp | KM13828 | B+ | M |
| 4–5 | Muskler og skjelett | KM13831 | B+ | M |
| 4–5 | Energi og energikjeder | KM13824 | B | M |
| 4–5 | Stoffer som blandes | KM13822 | B | S |
| 7 | **Partikkelmodellen og faseoverganger** | KM13852, KM13841 | **B+** | M |
| 7 | Næringsnett | KM13845 | B+ | M |
| 7 | Døgn, månefaser og årstider | KM13846 | B+ | M |
| 7 | Organsystemer | KM13850 | B | M |
| 7 | Elektrisk og magnetisk | KM13842 | B | M |
| 7 | Faremerking | KM13836 | B+ | S |
| 8–10 | Periodesystemet og atommodeller | KM13862 | B | M |
| 8–10 | Drivhuseffekten | KM13863 | B | S |
| 8–10 | Fotosyntese og celleånding | KM13870 | B | M |
| 8–10 | Immunforsvar og vaksiner | KM13874 | B | M |
| 1–2 | Vær og årstider (observasjon) | KM13812 | C | – |

Grovt: en tredjedel av målene kan støttes med forklaring og quiz. De praktiske, utforskende målene (forsøk, feltarbeid) kan ikke erstattes.

## 8. Samfunnsfag, KRLE og de andre fagene

| Fag | Vurdering | Hvorfor |
|---|---|---|
| **Samfunnsfag** | B– til D | Kart og geografi (KM14688, KM14718) og personlig økonomi (KM14680, KM14691, KM14710) går som quiz og regneoppgaver (B). Demokrati, institusjoner og kulturminner (KM14677, KM14678, KM14669) er fakta med refleksjon (C). **Sensitive mål som kropp, grenser, vold, seksualitet, identitet og personvern (for eksempel KM14676, KM14675) bør ikke lages som AI-generert øving i det hele tatt (D).** Vent på innholdslistene for samfunnsfag (2026/27) |
| **KRLE** | C | Fagbegreper og høytider (KM14587, KM14596) kan lages som quiz, men faget krever nøytralitet og kunnskap om religionene. Bør kvalitetssikres av noen med faglig tyngde og helst av trossamfunnene selv |
| **Fremmedspråk nivå I (8.–10.)** | B+ | Ordforråd, fraser og uttale i for eksempel spansk, fransk og tysk (KM12609, KM12613, KM12614). Fungerer der nettleseren har stemmer. Hvert språk må leses av en morsmålsbruker |
| **Programmering** | B | Går på tvers av fag (matematikk KM13263, KM13272, KM13282, KM13300, KM13326/KM13327 Python, valgfaget KM3203–KM3208). Krever en kodeeditor (L). Verdi stor, jobben også |
| **Musikk** | C | Noter og rytme (KM13714, KM13717, KM13718) kan trenes, men faget er å spille, synge og skape |
| **Kunst og håndverk, mat og helse, kroppsøving** | D | Praktiske fag. Bare små quizer (kosthold, sikkerhet) er realistiske |

## 9. Tverrgående: faglige begreper på flere språk (A, M)

Dette er ikke et eget fag, men det jeg mener passer best til prosjektets styrke: **begrepskort for matematikk og norsk på ti språk**, med lyd. Elever som er nye i Norge trenger fagordene (brøk, faktor, substantiv, kvadrattall) på morsmålet og på norsk side om side. Dette er også der oversettelsesfeil gjør minst skade, siden hver term er kort og kan kontrolleres.

## 10. Anbefalt rekkefølge

1. **Divisjon (4. trinn)**: A, M. Henger direkte på det som finnes.
2. **Brøk (5. trinn)**, deretter **desimaltall (6.)** og **prosent (7.)**: A, M hver. Egen serie som bygger på hverandre.
3. **Verb og setninger (norsk 3.–7. trinn)**: A, M. Fullfører substantiv og adjektiv.
4. **Faglige begreper på ti språk (matematikk og norsk)**: A, M. Unikt for prosjektet.
5. **Tall, telling og regning 1.–3. trinn** med **klokka**: A, M. Lag den **papir først** (arbeidsark), med korte skjermøkter, på grunn av 1.–4.-regelen.
6. **Algebra 7.–8. trinn** (ligninger, potenser, faktorisering): A, M hver.
7. **Engelsk: ordforråd, uttale og felles ord** (1.–4. trinn): A, M.
8. **Bokmål og nynorsk side om side (8.–10. trinn)**: A, M. Krever et ordregister.
9. **Funksjoner (8. trinn)** og **geometri 9. trinn**: A–/B+, L. Krever nye verktøy (graftegner, interaktiv geometri).
10. **Naturfag-serien** (vann, kropp, partikler): B+, M hver. Må faglig kontrolleres.

**Ikke anbefalt:** samfunnsfag-målene om kropp, grenser og identitet; KRLE uten fagfolk; muntlig, skriving og lesing av litteratur; alle praktiske fag.

## 11. Praktiske forutsetninger og risiko

- **Kvalitet på norsk tale** er svakere enn på engelsk. Moduler for tidlig lesing (bokstavlyder) krever innspilte lyder eller bedre stemmer.
- **Oversettelsene er AI-laget** og må leses av morsmålsbrukere, spesielt somali, tagalog og thai. Ordforrådet i faget (brøk, faktor) bør kontrolleres sammen med lærere som kan språket.
- **Faglig kontroll** før publisering er viktigst i naturfag, samfunnsfag og KRLE.
- **Personvern:** fremgangen lagres bare i elevens egen nettleser (ingen konto, ingen server). Det er enkelt for skolen å godkjenne, men gir heller ingen lærer-oversikt. Å bygge det krever en server og personvurdering, og er en egen stor jobb.
- **Planene endres:** matematikk ble revidert i 2026, og innholdslister for flere fag kommer. Dataene kan hentes på nytt med `python3 tools/laereplan/fetch.py`.
- **Bruk av «forankret i læreplanen» utad** bør formuleres forsiktig, for eksempel «trener mål i læreplanen», ikke «dekker».
