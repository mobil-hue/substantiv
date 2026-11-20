# Introduksjonsvideo (norsk + engelsk): status

Sist oppdatert 2026-11-20. Alt som er skrevet så langt ligger i git. Dette er en huskeliste for å fortsette.

## Ferdig
- Verktøy som lager videoen: `build.js` + `export.html` (se README, «Introduksjonsvideo til YouTube»). Hele gangevideoen (8 deler, 63 scener) med tavle, kritt-skrift og lærerinne, og en ny avslutning: «Tren, øv og lær helt gratis» med `www.skoleboken.com`, liste over språkene, skjermbilder (tas automatisk av appen), arbeidsark med fasit, og sluttkort: «Dette er et hobbyprosjekt 100% laget med AI. Det har vært fokus på innhold og funksjonalitet.»
- Norsk og engelsk (samme bilder, ulik tale). Undertekster (`.srt`), kapitler og ferdig YouTube-beskrivelse på begge språk.
- Tale: **Piper** er koblet på (gratis, lokalt). **Azure Speech** er også støttet, men krever abonnement (kontoen hadde ingen).
- Gangesystemet er flerspråklig (9 støttespråk, se README), og engelsk ligger i `js/i18n/en.js`.
- Arbeidsark for gangesystemet (`gs-ark.html`).

## Utkastet er laget med disse stemmene (ikke valgt av deg ennå)
- Norsk: `no_NO-nvcc-medium`, taler 0 (KNN – trolig kvinne, ikke bekreftet).
- Engelsk: `en_GB-cori-high`.
- Bytt med `PIPER_NO_MODEL`, `PIPER_NO_SPEAKER`, `PIPER_EN_MODEL`, `PIPER_EN_SPEAKER`, `PIPER_SPEED` (se README) og kjør på nytt. Lydfiler mellomlagres per stemme.

## Det som gjenstår
1. **Lytt til utkastet** og velg stemmer (eller bruk Azure når abonnement finnes).
2. **Sjekk lisensen på Piper-stemmene** (se kortene på Hugging Face) før videoen legges ut offentlig.
3. **Domene:** GitHub Pages støtter eget domene med en `CNAME`-fil og DNS-innstilling hos domeneleverandøren. Ikke gjort. Ikke legg inn `CNAME` før DNS er på plass, for da blir siden utilgjengelig.
4. Oversettelsene er laget med AI og bør leses av morsmålsbrukere (særlig somali, tagalog, thai).
5. Arbeidsarkene (`gs-ark.html`) har bare norsk + kinesisk.
6. De andre fagene (substantiv, adjektiv, gange, geometri, voksenopplæring) er ikke gjort flerspråklige. Systemet er laget slik at det kan gjøres side for side (`window.SUPPORT_LANGS = true` + ordbok).

## Piper (teknisk)
- Stemmekatalog: 183 stemmer på 58 språk (`voices.json` i `rhasspy/piper-voices` på Hugging Face). Finnes bl.a. thai (1), arabisk, persisk, urdu, ukrainsk, polsk, spansk, tyrkisk, vietnamesisk, swahili. Finnes **ikke**: tagalog og somali.
- Norsk: `no_NO-talesyntese-medium` og `no_NO-nvcc-medium` (10 talere: KNN KSV KON KMN KNV MNN MSV MON MNV KNV…).
- Nedlasting krever at miljøet får nå `huggingface.co`, `cdn-lfs.huggingface.co`, `cdn-lfs-us-1.hf.co`, `cas-bridge.xethub.hf.co` og `us.aws.cdn.hf.co` (lagt til i miljøet «substantiv»).
- Installasjon: `python3 -m venv pv && pv/bin/pip install piper-tts`. Modeller: `.onnx` + `.onnx.json` fra `https://huggingface.co/rhasspy/piper-voices/resolve/main/<språk>/<land>/<stemme>/<kvalitet>/<navn>.onnx`.
