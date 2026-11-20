# Introduksjonsvideo (norsk + engelsk): status

Sist oppdatert 2026-11-20. Alt som er skrevet så langt ligger i git. Dette er en huskeliste for å fortsette.

## Ferdig
- Engelske tekster til alle 8 gangesystem-videoene (63 scener + 50 tavle-tekster): `js/gs-en.js`.
- Eksport til mp4 (1280 × 720), tavle med kritt og lærerinne, avslutning om at det er gratis, `.srt`-undertekster, kapitler og YouTube-beskrivelse: `build.js` + `export.html` (se README, avsnittet «Introduksjonsvideo til YouTube»).
- Stum prøveversjon er testet og ser riktig ut. Full kjøring med tale er **ikke** gjort ennå.
- Arbeidsark for gangesystemet (`gs-ark.html`) er laget.

## Mangler før videoen kan lages ferdig
1. **Taleløsning** (velg én):
   - **Piper** (gratis, uten konto): `build.js` snakker ennå bare med Azure, så Piper må kobles på (liten jobb: bytt `speak()` til å kalle Piper, og lag mp3).
   - **Azure Speech**: krever abonnement. Kontoen har foreløpig ingen (listen «Subscription» var tom). Sjekk *Directories + subscriptions* i portalen, eller lag en gratiskonto (F0, 500 000 tegn/mnd). Nøkkel og region legges inn via skjema, aldri i chatten.
2. **Domenenavn** til avslutningen (`SITE=…`) og hvordan det skal uttales.
3. **Valg av stemmer** etter lytting på prøvene (norsk og engelsk).

## Piper: det vi fant
- Stemmekatalog: 183 stemmer på 58 språk (`voices.json` i `rhasspy/piper-voices` på Hugging Face).
- Norsk: `no_NO-talesyntese-medium` og `no_NO-nvcc-medium` (10 talere: KNN KSV KON KMN KNV MNN MSV MON MNV … – K er trolig kvinne, M mann, ikke bekreftet).
- Engelsk (britisk), kvinnestemmer: `en_GB-cori-high`, `en_GB-jenny_dioco-medium`, `en_GB-alba-medium`.
- Finnes: bl.a. thai (1 stemme), arabisk, persisk, urdu, ukrainsk, polsk, spansk, tyrkisk, vietnamesisk, swahili. Finnes **ikke**: tagalog og somali.
- Nedlasting krever at miljøet får nå `huggingface.co`, `cdn-lfs.huggingface.co`, `cdn-lfs-us-1.hf.co`, `cas-bridge.xethub.hf.co` og `us.aws.cdn.hf.co`. Disse er lagt til i miljøet «substantiv».
- Installasjon: `python3 -m venv pv && pv/bin/pip install piper-tts`. Kjør: `pv/bin/python -m piper -m <modell>.onnx -f ut.wav -s <taler-nr> -- "tekst"`.
- **Lisens på stemmene er ikke sjekket.** Se kortene på Hugging Face før videoen legges ut offentlig. Lydprøvene er derfor ikke lagt i git.

## Andre ting som er avklart eller åpne
- Videoene skal være på norsk og engelsk. Samme bilder, ulik lyd. Undertekster på begge språk.
- Oversettelse til flere språk (thai, tagalog, somali + 10–12 til) er en egen, stor jobb: språksystemet må bygges om først (nå står norsk + kinesisk rett i koden). Anbefalt rekkefølge: språksystem → gangesystemet først → resten.
- Det som ligger på grenen `claude/zen-franklin-phqsq6` (arbeidsark og videoverktøy) er **ikke** slått sammen med live-grenen `claude/noun-learning-program-bilingual-x6bxw6` ennå.
- Egne domener: GitHub Pages støtter det med en `CNAME`-fil og DNS-innstilling. Ikke gjort ennå.
- Lisens å huske: ordlistene bygger på OpenSubtitles-data (CC BY-SA 4.0), og må krediteres hvis siden legges ut offentlig.
