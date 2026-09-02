# Life Skills Suite

App web per attività di educazione socio-affettiva: ruota delle emozioni,
scenari decisionali, termometro delle emozioni, sessioni Q&A e sondaggi in
tempo reale.

## Come si lavora

```bash
npm install
npm run dev     # sviluppo con ricarica automatica
npm run build   # compila verso la root, pronto per la pubblicazione
```

Il sorgente sta in `app/`. Il build scrive `index.html` e `assets/` nella root
del repository, cioè dove GitHub Pages già serve il sito: pubblicare significa
eseguire `npm run build` e fare commit del risultato.

`npm run build` cancella `assets/` prima di ricompilare. I nomi dei file
contengono l'hash del contenuto, quindi la cache dei browser si invalida da
sola e non si accumulano bundle vecchi.

## Struttura

```
app/
  index.html                 pagina di ingresso (carica le librerie CDN)
  src/
    main.jsx                 punto di avvio React
    LifeSkillsApp.jsx        applicazione: dashboard, attività, sessioni Q&A
    index.css                direttive Tailwind
    components/
      EmotionWheelSVG.jsx    ruota disegnata proceduralmente
      EmotionWheelModal.jsx  ruota a schermo intero, lente, set
      EmotionThermometer.jsx esercizio di ordinamento per intensità
      ScenarioManager.jsx    gestione dati: elementi, set, generazione IA
      P2PModal.jsx           trasferimento fra dispositivi
      SettingsModal.jsx      namespace, ruota, configurazione Firebase
      FullscreenButton.jsx
    lib/
      firebaseConfig.js      configurazione sovrascrivibile + namespace
      sets.js                set: elementi, visibilità, set attivo
      gemini.js              generazione scenari con Google Gemini
      wheel.js               geometria e preferenze della ruota
      p2p.js                 compressione e unione dei dati trasferiti
      thermometerStorage.js  immagini del termometro in IndexedDB
      backup.js              export/import ZIP
      exporters.js           export XLSX e nuvola di parole in SVG
    data/
      scenarios_data.js      scenari iniziali
      wheelData.js           114 emozioni + 3 palette
      thermometerData.js     6 emozioni x 5 livelli
public/                      immagini statiche (copiate nella root dal build)
index.html, assets/          OUTPUT DEL BUILD — non modificare a mano
reference/                   materiale di documentazione
```

## Dipendenze esterne

`app/index.html` carica da CDN: Tailwind, PeerJS (P2P), pako (compressione),
qrcode-generator e html5-qrcode (QR), SheetJS (XLSX), JSZip (backup).
Sono globali a runtime, non pacchetti npm: senza rete quelle funzioni non
sono disponibili, ma il resto dell'app continua a funzionare.

## Dati salvati nel browser (localStorage)

| Chiave | Contenuto |
|---|---|
| `lss_wheel_mode` | modalità ruota: `svg` o `image` |
| `lss_wheel_palette` | palette colori |
| `lss_wheel_data` | struttura della ruota in uso |
| `lss_wheel_active_set` | id del set ruota attivo |
| `lss_scenario_sets` | tutti i set salvati (scenari e ruota) |
| `lss_active_sets` | id del set attivo per ciascuna categoria |
| `lss_firebase_config` | configurazione Firebase personalizzata |
| `lss_username` | nome utente, usato come namespace del database |
| `lss_gemini_key` | API key Google AI (in chiaro) |
| `lss_gemini_model` | ultimo modello Gemini selezionato |

> La API key Gemini è salvata in chiaro ed è leggibile da chiunque apra i
> DevTools su quel browser. Su un computer condiviso conviene non salvarla.

Le immagini del termometro stanno in IndexedDB (`et_images`), non su Firestore:
sono troppo grandi per il limite di 1 MB per documento.

## Set

Un set è una collezione salvata di elementi. Memorizza sia gli elementi sia
quali sono nascosti, così attivare un set diverso non fa perdere quelli del
precedente. Il set attivo è la fonte da cui l'app estrae: le modifiche vi
vengono risincronizzate automaticamente.

Per le narrazioni emotive si possono usare come sorgente i set della ruota:
vengono appiattiti in elenco, così l'estrazione pesca solo fra emozioni
realmente presenti sulla ruota.

## Note sulla ricostruzione del sorgente

Per un periodo l'app è stata modificata direttamente dentro il bundle
compilato, perché il sorgente non era reperibile. Questo repository contiene
ora il progetto Vite ricostruito e allineato a quella versione: il sorgente
recuperato riproduceva byte per byte il primo bundle pubblicato, e le
funzionalità aggiunte a mano dopo di esso sono state riportate nel sorgente e
verificate per parità (parser, geometria della ruota e testo dell'interfaccia).

Da qui in avanti le modifiche vanno fatte in `app/src/` e pubblicate con
`npm run build`. Modificare i file in `assets/` significa perdere il lavoro al
build successivo.
