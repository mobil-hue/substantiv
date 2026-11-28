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

## Anbefalt videre arbeid

- Sjekke de tre Sogn og Fjordane-presentasjonene og Meldal/Agdenes/Målselv-listene mot TFs egne originalfiler eller en senere versjon, hvis den finnes.
- Kontrollere folketall og innsparingsberegninger mot KOSTRA/SSB (ikke gjort her).
- Skaffe Orkland-rapporten (KS Konsulent 2023) fra kommunens arkiv og sammenligne den direkte med Halden 2024.
- Analysere NIVI, Agenda Kaupang og andre utredere når filene kan hentes, for å se om gjenbruksmønsteret gjelder TF spesielt eller bransjen.
