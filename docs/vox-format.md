# Dataformat for Norsk Voksenopplæring

Ord og fraser ligger i `js/vox-*.js`. Hver fil legger tekstblokker i `VOXRAW`; appen (`js/vox-core.js`) leser dem.
Valider alltid med `node docs/vox-validate.js js/vox-xxx.js` (avslutter med kode 1 ved feil).

## Filen

```js
/* Norsk Voksenopplæring: kort beskrivelse */
(window.VOXRAW = window.VOXRAW || []).push(`
@deck dyr | 🐕 | Dyr | Animals | 动物 | words
hund | n | en | hunden, hunder, hundene | dog | 狗 | Hunden min er snill. | My dog is friendly. | 我的狗很乖。 | Dogs must be on a lead in the forest in spring. // 春天在森林里狗必须拴绳。
`);
```

* Ingen backtick (`) eller `${` inni teksten. Ingen tegnet `|` inni feltene (det er skilletegnet). Linjer som begynner med `#` er kommentarer.
* Én oppføring per linje. Tomme felt skrives som tomt mellom to `|`.
* `@deck`-linjen har 6 felt: `id | emoji | norsk tittel | engelsk tittel | kinesisk tittel | type`. Type er `rank` (rangert frekvensliste), `words` (temaliste med ord) eller `phrases` (setninger). Flere filer kan fortsette samme deck med samme id.

## Ord (type `rank` og `words`) – 10 felt

```
nb | pos | kjønn | former | en | zh | eksempel | eksempel-en | eksempel-zh | merknad
```

| # | felt | regler |
|---|---|---|
| 1 | `nb` | oppslagsordet i bokmål, **liten forbokstav** (unntatt egennavn), **uten** artikkel og uten «å». Verb i infinitiv (`spise`), adjektiv i grunnform (`stor`), substantiv i ubestemt entall (`hund`). Faste uttrykk kan ha mellomrom (`ved siden av`, `i dag`). |
| 2 | `pos` | `n` substantiv, `v` verb, `adj` adjektiv, `adv` adverb, `prep` preposisjon, `conj` konjunksjon/subjunksjon, `pron` pronomen, `det` determinativ, `num` tallord, `intj` interjeksjon/hilsen, `part` partikkel (f.eks. `å`, `ikke`), `art` artikkel. |
| 3 | `kjønn` | `en`, `ei` eller `et` for substantiv. Tomt for alle andre. Bruk `ei` bare for ord som vanlig norsk undervisning og Bokmålsordboka regner som hunkjønn (ei bok, ei jente, ei dør, ei uke …); ellers `en`. |
| 4 | `former` | kommaseparert, se under. |
| 5 | `en` | kort engelsk betydning. Verb med «to » (`to eat`). Flere betydninger skilles med `; `. Små bokstaver. |
| 6 | `zh` | kort kinesisk betydning i forenklede tegn (ingen pinyin). Flere betydninger skilles med `；`. |
| 7 | `eksempel` | naturlig bokmål, nivå A1–A2, 3–10 ord, slutter med . ! eller ?. **Må inneholde ordet eller en av formene i felt 4 (bokstavelig).** |
| 8 | `eksempel-en` | engelsk oversettelse. |
| 9 | `eksempel-zh` | kinesisk oversettelse, naturlig kinesisk (ikke ord for ord). |
| 10 | `merknad` | valgfri, ellers tom. Engelsk først, så ` // `, så kinesisk (begge språk hvis merknaden er med). 1–2 korte setninger: bruk, vanlige feil, forskjell mellom lignende ord, uttalefelle, kontekst/stil. |

### Former (felt 4)

* **Substantiv (`n`)** – tre former, nøyaktig i denne rekkefølgen: `bestemt entall, ubestemt flertall, bestemt flertall`. Eksempler: `hunden, hunder, hundene` · `huset, hus, husene` · `boka, bøker, bøkene` · `barnet, barn, barna` · `maten, -, -` (bruk `-` når formen ikke finnes). Ei-ord: bestemt entall på `-a` (`boka`).
* **Verb (`v`)** – fire former: `presens, preteritum, perfektum partisipp, imperativ`. Eksempler: `spiser, spiste, spist, spis` · `går, gikk, gått, gå` · `kan, kunne, kunnet, -` (bruk `-` når formen ikke brukes).
* **Adjektiv (`adj`)** – fire former: `intetkjønn (-t), flertall/bestemt (-e), komparativ, superlativ`. Eksempler: `stort, store, større, størst` · `fint, fine, finere, finest` · `bra, bra, bedre, best`. Bruk `-` for trinn som ikke finnes (`gratis, gratis, -, -`).
* **Andre ordklasser** – tomt, eller en kort kommaseparert liste over beslektede former som er nyttige å kunne (`jeg`: `meg, min/mitt/mine`; `liten`: se adjektiv). Aldri forklaringer her.

## Fraser (type `phrases`) – 5 felt

```
norsk | engelsk | kinesisk | type | merknad
```

* `type`: `s` = du sier dette selv, `h` = du hører dette (av legen, ekspeditøren …), `b` = begge deler/generelt.
* Hele setninger slik de faktisk brukes i Norge: naturlig, høflig og hverdagslig. Bokmål.
* Merknad er valgfri (ellers tom), samme format som for ord (` // ` mellom engelsk og kinesisk).
* Eksempel: `Hvor mye koster den? | How much is it? | 这个多少钱？ | s | «Den» for en-/ei-ord, «det» for et-ord. // 阴阳性名词用 den，中性名词用 det。`

## Kvalitet

* **Språklig riktighet kommer først.** Bruk bare det du er sikker på. Alle former skal være riktige moderne bokmål (ikke nynorsk, ikke dialekt, ikke dansk).
* Kinesisk: vanlig, naturlig fastlandskinesisk (forenklede tegn). Engelsk: kort og naturlig.
* Eksempelsetninger skal være hverdagslige og ulike fra hverandre (ikke «Jeg har en …» hele tiden). Bruk gjerne hverdagssituasjoner i Norge.
* Merknader skal hjelpe en kinesisktalende nybegynner: kjønn og bøying, forskjell mellom lignende ord (da/når, hvis/om …), setningsstruktur, høflighetsnivå, vanlige feil, uttalefeller (bare når du er sikker, f.eks. «hv- uttales v: hva = [va]»).
* Medisinske og kroppslige ord skal være nøkterne, korrekte og brukbare hos legen (voksne elever). Ingen vulgære ord, ingen slang som kan misforstås.
* Ikke bruk merkenavn unntatt etablerte norske institusjoner (NAV, Vipps, Ruter …).
