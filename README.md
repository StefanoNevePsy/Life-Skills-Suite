# Life Skills Suite

App web per attività di educazione socio-affettiva: ruota delle emozioni, scenari
decisionali, sessioni Q&A e sondaggi in tempo reale.

Sito statico: si apre `index.html`, nessun passaggio di build necessario.

## Struttura della repo

```
index.html                       pagina di ingresso, carica CDN + app
assets/app.js                    bundle applicativo (~800 KB, minificato)
assets/app.css                   stili compilati
reference/emotion-wheel-data.js  dati della ruota in forma leggibile (documentazione)
life_skills.png                  icona/favicon
ruota_.png                       immagine della ruota (modalità "image")
```

## Come sono nominati i file

`assets/app.js` e `assets/app.css` hanno un nome **stabile**. In precedenza erano
file con hash di build (`index-D2E2Mo9f.js`, …) e ogni pubblicazione ne aggiungeva
uno nuovo senza togliere i vecchi: si erano accumulati 30 file morti per 12,3 MB.
Ora esiste un solo file per tipo.

Poiché il nome non cambia più, la cache dei browser viene invalidata dal parametro
di versione in `index.html`:

```html
<script type="module" crossorigin src="./assets/app.js?v=2026-09-02"></script>
<link rel="stylesheet" crossorigin href="./assets/app.css?v=2026-09-02">
```

**Dopo ogni modifica ad `app.js` o `app.css`, aggiornare la data in `?v=`**,
altrimenti chi ha già visitato il sito continuerà a vedere la versione vecchia.

## Dov'è cosa dentro `app.js`

Il file è l'output minificato di Vite: **un unico scope**, senza `import`/`export`
e con nomi accorciati (`p` = factory JSX, `z` = React). L'81% iniziale è codice di
libreria; il codice dell'applicazione sta tutto **dalla riga 3399 in poi**
(~136 KB su 800).

| Sezione | Riga |
|---|---|
| React / ReactDOM | 3 |
| Icone (lucide) | 41 |
| Firebase (app, auth, firestore) | 484 |
| **— inizio codice applicativo —** | **3399** |
| Configurazione Firebase (`_getFBConfig`) | 3399 |
| Set: storage e helper (`_LS_SETS_KEY`) | 3399 |
| Integrazione IA / Gemini (`_LS_AI_KEY`) | 3399 |
| Scenari di default (`const _l=`) | 3399 |
| Ruota: dati e palette (`_WHEEL_DATA_DEFAULT`) | 3408 |
| Ruota: componente SVG (`EmotionWheelSVG`) | 3408 |
| Modal "Gestione Dati" (`t_`) | 3409 |

Le righe sono lunghissime: per orientarsi conviene cercare l'identificatore fra
parentesi invece di scorrere il file. Dopo ogni modifica verificare con
`node --check assets/app.js`.

Convenzione: tutto ciò che è stato aggiunto a mano usa il prefisso `_`
(`_wArc`, `_flattenWheel`, `_aiGenerate`, …), così resta distinguibile dal codice
generato dal minificatore.

## Dati salvati nel browser (localStorage)

| Chiave | Contenuto |
|---|---|
| `lss_wheel_mode` | modalità ruota: `svg` o `image` |
| `lss_wheel_palette` | palette colori: `insideout`, `pastel`, `vivid` |
| `lss_wheel_data` | struttura della ruota attualmente in uso |
| `lss_wheel_active_set` | id del set ruota attivo |
| `lss_scenario_sets` | tutti i set salvati (scenari e ruota) |
| `lss_active_sets` | id del set attivo per ciascuna categoria |
| `lss_gemini_key` | API key Google AI (in chiaro) |
| `lss_gemini_model` | ultimo modello Gemini selezionato |

> La API key è salvata in chiaro ed è leggibile da chiunque apra i DevTools su
> quel browser. Su un computer condiviso conviene non salvarla.

## Categorie di contenuti

`emotions`, `decisions_cold`, `decisions_hot`, `emotion_narratives`,
`affectivity_sexuality`. Ogni categoria ha una lista di elementi; i set ne
memorizzano sia gli elementi sia lo stato nascosto/visibile.

## Nota sulla manutenibilità

`app.js` è **output di build, non codice sorgente**: il sorgente originale non è
mai stato presente in questa repo. Non è quindi possibile suddividerlo in moduli
per sezione — dopo la minificazione i confini fra moduli non esistono più e tutto
condivide un unico scope.

Per arrivare a un progetto davvero modulare servirebbe ricostruire un sorgente
Vite (`src/` con i componenti separati, `package.json`, build) partendo dal
comportamento attuale. È un lavoro consistente e va deciso a parte: finché non si
fa, le modifiche continuano ad avvenire direttamente sul bundle, aiutandosi con la
mappa qui sopra.
