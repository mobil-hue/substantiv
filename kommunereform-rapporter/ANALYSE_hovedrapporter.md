# Analyse av hovedrapportene før beslutningen (2013–2017)

Gjennomført 2026-11-28 på de nedlastede dokumentene. Mekanisk tekstanalyse, deretter manuell lesing av treffene.

## Omfang og begrensninger

- **46 hovedrapporter** analysert (utredninger, delrapporter, sluttrapporter og 0-alternativnotater, minst 3 000 ord). Utelatt: intensjonsavtaler, saksframlegg (analysert separat), fylkesmannens tilrådinger, KS-materiale og rapporter fra etter vedtaket.
- **Utvalget er skjevt.** 41 av 46 er fra Telemarksforsking (TF), 5 fra PwC. De fleste intensjonsavtaler, innbyggerundersøkelser og andre utredere (NIVI, Agenda Kaupang m.fl.) lå på Distriktssenterets arkiv, som nå gir 410 Gone. Funnene gjelder derfor først og fremst TFs produksjon, ikke «alle rapporter».
- **Ikke analysert:** én skannet PDF uten tekstlag (Asker, intensjonsavtale), og ingenting er sjekket mot kildedata (KOSTRA/SSB). «Feil» betyr her avvik innad i og mellom dokumentene, ikke at tallene er kontrollert mot virkeligheten.
- Tekstgjenbruk er **ikke** det samme som plagiat. At én utreder gjenbruker egen metodikk og bakgrunnstekst er vanlig. Det som er interessant er hva som gjenbrukes, og hvilke spor kopieringen etterlater.

## 1. Tekstgjenbruk på tvers

Metode: andel 12-ords-sekvenser i et dokument som står ordrett i minst ett annet.

- **Median 43 %** av teksten finnes i et annet dokument. **21 av 46** dokumenter har ≥ 50 %.
- Høyest: Selje- og Eid-notatene (78 % og 74 %), Ålesund delrapport 4 lokaldemokrati (70 %), Heim delrapport 2 økonomi (68 %), delrapportene for Sunnmøre og Snillfjord–Hitra–Frøya (47–70 %), 0-alternativnotatene for Halsa, Hitra, Fræna, Nesset, Meldal, Agdenes, Ballangen og Tysfjord (53–58 %).
- Størst parvis overlapp: Sogn regionråd mot Voss–Vik–Aurland (60 %). Delrapport 4 lokaldemokrati for Molde-regionen mot Ålesund (66 %) og Heim (55 %). Delrapport 2 økonomi Heim mot Ålesund (65 %).
- **PwC (annen utreder) har lavt overlapp**: 4–14 %, i hovedsak sitater av statlige tekster (reformstøtte, ekspertutvalgets kriterier). Overlappet mot TF-rapportene er ikke undersøkt i detalj.
- **Hva som gjenbrukes:** reformbakgrunn og sitater fra ekspertutvalget, metodebeskrivelser, definisjoner av nøkkeltall og vurderingssetninger der bare navn og tall byttes. Eksempel: «Innsparingspotensialet i forhold til hva *X og Y* bruker på administrasjon er på mellom A og B mill. kr». Samme setning, med ulike sammenligningskommuner, står i alle de økonomiske analysene. Sammenligningskommunene velges etter størrelse, ikke region (Sogn mot Kristiansund/Ålesund, Voss mot Stord/Os). Det er ikke i seg selv en feil.
- Sogn–Voss: overlappet er forklart av felles geografi (Vik og Aurland ligger i Sogn og Fjordane) og samme team og mal. Ingen fremmed tekst funnet.

## 2. Spor etter kopiering (konkrete feil)

1. **Kopiert skrivefeil i fire rapporter.** Setningen «Vi har *tar* utgangspunkt i at det ikke er aktuelt for *N* å vurdere å flytte kommunesenteret som en del av kommunereformen» står identisk (kun kommunenavnet byttet) i notatene for Halsa (Heim), Hitra, Fræna (Hustadvika) og Nesset (Molde). Typisk spor av «kopier og erstatt».
2. **Feil region i diagramtittel.** Presentasjonene for Vågsøy, Eid og Selje (Kinn og Stad, alle 2015) har samme diagramtittel: «Arbeidsplassvekst i privat sektor i kommunene i **Telemark** fra 2008 til 2014». Diagrammet viser kommuner i Sogn og Fjordane (Hornindal, Stryn, Selje, Gloppen, Vågsøy, Eid, Bremanger). Tittelen er sannsynligvis en rest fra en annen mal og er ikke rettet i noen av de tre.
3. **Tekst og tall stemmer ikke (Meldal).** Samlet vurdering for Meldal: samfunnsutvikling 55, økonomi 90, tjenester 55, lokaldemokrati 55 (255/400, 64 %). Teksten ved siden av sier at «lokaldemokrati får også en score noe over middels» og at «samfunnsutvikling og tjenester får lavest score». Tre av fire delområder har altså samme poengsum.
4. **Samme poengsum beskrives ulikt.** Lokaldemokrati 55/100 er «middels» (Stordal), «litt lavere enn middels» (Fræna) og «noe over middels» (Meldal). I Meldal-notatet er terskelen 34–66 poeng = gul smiley, så 55 ligger i gul sone i alle tre. Terskelen er ikke kontrollert i de andre notatene.
5. **Motstridende score for Meldal.** Agdenes-notatet (TF-notat 103) oppgir Meldal til 245/400 (61 %). Meldal-notatet (TF-notat 102) har 255/400 (64 %). Den samme 245/400 (61 %) står i Ballangen- og Tysfjord-notatene (2016) som **Målselv**, og Målselv står der to ganger i samme sammenligningsliste med identiske tall. Jeg kan ikke avgjøre hvilket tall som er riktig uten kildedata. Tallene er flyttet mellom kommuner, eller en liste er kopiert.
6. **Skala uten felles nevner.** Notatene for Møre og Romsdal bruker /380, mens Trøndelag og Nordland bruker /400. Notatene sier selv at summene ikke er direkte sammenlignbare, men stiller dem likevel opp ved siden av hverandre (Stordal og Fræna lister Nesset 130/380, Rauma 230/380 osv.).

**Ikke funnet:** regnefeil i score­tabellene (alle sju parsede tabeller summerer riktig og prosentene stemmer), kopiert tekst med feil kommunenavn (alle treff var bakgrunnsavsnitt med legitime navn), regnefeil i svarprosenter (regex ga ingen treff).

## 3. Standardformuleringer i svar

- **Konklusjoner:** «Sammenslåing vil i liten grad føre til at den nye kommunen har potensial for å ta på seg nye oppgaver» (4 rapporter, Heim/Molde/Ålesund). «Kommunen har i liten grad valgfrihet for innbyggerne, for eksempel har man bare en skole, en barnehage og så videre» (Hitra, Narvik, Orkland). Faste vendinger i hver samlet vurdering: «Samlet sett får «N som egen kommune» en score på # av # mulige», «Vurderingene er best knyttet til økonomi, …». Disse er knyttet til poengsystemet og gir dermed samme språk for ulike kommuner. Forskjellene mellom kommuner ligger i tall og i noen få ord (se punkt 3 og 4 ovenfor), ikke i formuleringen.
- **Respondentenes åpne svar** (ca. 1 500 linjer i 16 dokumenter) er ikke gjenbrukt på tvers: ingen identiske svarformuleringer i ≥ 3 dokumenter som ikke var rapporttekst. Svarene er altså lokale.
- **Kommunenes egne saksframlegg og vedtak** (11 dokumenter) henter lite fra konsulentrapportene: 0–5,5 % delt. Det som deles er sitater av reformens fire hovedmål. Unntaket er Eide og Fræna (41 %), som hadde en felles prosess.

## 4. Sammenligning med Aftenposten-saken (KS Konsulent, skolestruktur)

Aftenposten viser at KS Konsulent gjenbrukte det intervjuede elever og foresatte sa («funn») i skolestrukturrapporter for ulike kommuner, mens intervjuspørsmålene var like. Jeg fikk bare lest den åpne delen av artikkelen (innledning og en side-ved-side-tabell for Orkland 2023 og Halden 2024). Resten ligger bak betalingsmur.

Det jeg har kontrollert selv, mot originalfilene:
- **Halden 2024** (KSK-rapport 3/2024): 9 av 11 punkter som artikkelen viser for Orkland 2023 står ordrett i Halden-rapporten, blant annet «Elever vektlegger muligheter for å få venner, og lærere som er relasjonelt gode» og «Elevene ønsket en kombinasjon av digitale verktøy og bøker». To punkter er omskrevet eller falt bort (uteområder, møteplasser/skyss). Halden har lagt til noen egne («men mange uttalte frustrasjon over manglende vedlikehold…», «oppdaterte lærebøker»).
- **Åfjord 2022, Frogn 2022 og Ørland 2025** (alle KS Konsulent): 0 av 11 punkter ordrett. Åfjord beskriver elevenes synspunkter med egne, kortere formuleringer om omtrent de samme temaene (venner, godt læringsmiljø, gode lærere, utstyr).
- Tekstoverlapp mellom de fire KS Konsulent-rapportene jeg har: 6–10 %, i hovedsak forskningsoppsummeringer om skolestørrelse, nasjonale reformer og metode. Intervjuspørsmålene er identiske i Halden og Frogn («Hva er ditt inntrykk av kvaliteten på skolen der du er forelder?…»), altså standard, slik artikkelen også skiller.
- **Ikke verifisert:** selve Orkland-rapporten (lenken er død, 404). Påstanden om at Halden-teksten er hentet derfra bygger på utdraget i artikkelen.

Sammenligning med reformrapportene: TF-materialet har mye mer gjenbruk totalt (median 43 %), men formuleringene for **svarene** er lokale, mens malen og metoden gjenbrukes. De avvikene jeg fant (punkt 2 ovenfor) er av en annen type: kopiering som har etterlatt feil (skrivefeil, feil regionnavn i figurtekst, setning og tall som ikke er oppdatert), ikke kopierte funn fra intervjuer.

## 5. Kontroll av tall mot SSB (2026-11-28)

Metode: tall som rapportene oppgir med eksplisitt dato er sammenlignet med SSBs åpne API (tabell 06913 og 01222 for folketall, tabell 04949 for KOSTRA-konsern, driftsresultat i prosent av driftsinntekter).

| Kontroll | Antall | Resultat |
|---|---|---|
| Folketall, ulike datoer (1.1.2014–1.1.2016, 31. mars og 2. kvartal 2015) for 17 kommuner (Tingvoll, Eide, Hemne, Hitra, Frøya, Nesset, Aukra, Fræna, Molde, Rauma, Vestnes, Sunndal, Gjemnes, Voss, Vik, Aurland, Sogndal, Meldal, Agdenes, Ballangen, Tysfjord) | 23 | **23 av 23 stemmer eksakt** |
| KOSTRA brutto og netto driftsresultat 2012–2014 (Ballangen, Tysfjord) | 12 | **12 av 12 stemmer** (±0,1 prosentpoeng) |

Merknader:
- To tilsynelatende avvik viste seg å være min egen feil: Sunndal (jeg brukte feil kommunenummer) og Ballangen/Tysfjord (rapportene bruker 1.1.2016, ikke 2015).
- Notatene for Halsa, Hitra, Meldal, Agdenes, Fræna, Nesset og Stordal har KOSTRA-tabeller som ikke lot seg lese ut av tekstlaget, så de er ikke kontrollert på driftsresultat.
- **Ikke kontrollert:** befolkningsframskrivinger mot 2040, valgdeltakelse, sysselsetting/pendling, tjenesteindikatorer, beregnet innsparingspotensial (utledet fra egne antakelser), og alle spørreundersøkelser (ingen rådata).
- Det som er kontrollert er grunnfakta som er lette å sjekke. Konklusjoner og poengsetting er ikke testet, og en korrekt datagrunnlag sier ingenting om at vurderingene er riktige.

## 6. Innsparingspotensial på administrasjon: regnet på nytt fra SSB

TF beregner potensialet slik (gjentatt i alle økonomi-delrapporter): netto driftsutgifter (KOSTRA, konsern) på funksjon 100, 110, 120, 121 og 130; gevinst = summen for dagens kommuner minus folketallet × et benchmark per innbygger (billigste kommune i alternativet, landsgjennomsnittet, eller «sammenlignbare» kommuner). Skript for gjenskaping: `kontroll_innsparing_ssb.py` (SSB-tabell 05065 og 06913).

| Kontroll | Resultat |
|---|---|
| Inngangstall: netto adm.-utgifter 2014 for Snillfjord, Hitra, Frøya, Fræna, Orkdal, Voss, Vik, Aurland, Stord og Os | **Alle stemmer** med SSB (avvik ≤ 2 tusen kr, avrunding) |
| Regnestykket (gevinst «ved nivå tilsvarende» Hitra, landsgjennomsnittet, Fræna og Orkdal i Heim; Voss, landsgjennomsnittet, Stord og Os i Voss) | **Alle åtte stemmer** (f.eks. Heim 47 965 mot 47 964; Voss 40 435 mot 40 433 tusen kr) |
| Benchmark «landsgjennomsnittet 3 885 kr per innbygger» | Er **2013-verdien** (jeg får 3 882 for 2013 fra SSB). For regnskapsåret 2014 blir tallet 4 003. |

**Funn: gammelt benchmark i rapporter som bruker 2014-tall.** Rapportene som sammenligner kommunenes 2013-utgifter bruker 3 885 riktig (Molde-regionen, Landkommune Sunnmøre, Midt-Troms, Sunnfjord). Delrapportene der kommunenes tall er fra 2014 (Heim/Snillfjord–Hitra–Frøya, Bjørnafjorden, Sogn og Voss–Vik–Aurland) bruker fortsatt 3 885. Tabelloverskriften sier «administrasjonsutgifter 2014», men benchmarken er fra året før. Virkning på overskriften «gevinst mot landsgjennomsnittet»:
- Heim: 47,96 mill. kr (rapporten) mot 46,76 mill. med riktig benchmark, altså **2,5 % for høyt**.
- Voss–Vik–Aurland: 40,4 mill. mot 38,2 mill., **5,5 % for høyt**.
- Retningen er alltid at gevinsten blir overvurdert. Størrelsen er liten og står sammen med de andre sporene etter gjenbruk (del 2): benchmarken ble sannsynligvis tatt med fra forrige utredning uten å oppdateres. Jeg har ingenting som tyder på at det var bevisst, og det endrer ikke konklusjonene i rapportene. Narvik/Ofoten (3 792) og Kinn (4 129) bruker andre tall, og er ikke undersøkt.

**Metodevalg som påvirker størrelsen (ikke feil):**
- Landsgjennomsnittet inkluderer store kommuner med stordriftsfordeler, så mange små kommuner får et stort «potensial» nesten uansett.
- Beregningene er «illustrasjonsberegninger» (rapportenes egen formulering) uten vurdering av om kostnaden faktisk kan tas ut.

**Ikke kontrollert:** befolkningsframskrivingene mot 2040. SSBs åpne API har bare framskrivinger fra 2018, ikke 2014-versjonen rapportene bruker.

## Anbefalt videre arbeid

- Sjekke de tre Sogn og Fjordane-presentasjonene og Meldal/Agdenes/Målselv-listene mot TFs egne originalfiler eller en senere versjon, hvis den finnes.
- Kontrollere befolkningsframskrivingene (krever SSBs 2014-versjon fra arkiv), utgiftsbehov og tjenesteindikatorer mot SSB. Folketall, driftsresultat og administrasjonsutgifter er gjort (del 5 og 6).
- Sjekke benchmarken i de øvrige TF-rapportene (Narvik/Ofoten, Kinn, Øygarden) og regne ut samlet effekt per rapport.
- Skaffe Orkland-rapporten (KS Konsulent 2023) fra kommunens arkiv og sammenligne den direkte med Halden 2024.
- Analysere NIVI, Agenda Kaupang og andre utredere når filene kan hentes, for å se om gjenbruksmønsteret gjelder TF spesielt eller bransjen.
