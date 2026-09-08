> **Riconoscimento emozioni:** nuova vista caricata a richiesta `EmotionRecognitionView`, sezione materiali `emotion_recognition`, 61 disegni locali e importazione raster/tavole 3×2 nella libreria immagini docente esistente. Guida: `docs/EMOTION_RECOGNITION.md`. Attività guidata sul dispositivo/LIM, senza nuova stanza studenti; report temporanei senza nomi.

> **Aggiornamento Firebase v2:** la descrizione storica seguente documenta la versione precedente. Per struttura cloud, autorizzazioni, immagini, accessi e rilascio di questa branch fa fede `docs/FIREBASE_V2.md`. In particolare: account docente persistente con allowlist `teachers`, identità studente distinta, sessioni root `sessions`, risposte individuali private, copie immagini per sessione e materiali per sezione con transazioni. Il PIN non autorizza accessi cloud.

# Life Skills Suite — Contesto & Architettura dell'Applicazione

Questo documento fornisce una panoramica completa del progetto, delle sue funzionalità, della struttura del codice e dell'architettura tecnica. Serve come guida di riferimento immediata per sviluppatori e assistenti AI.

---

## 1. Cos'è Life Skills Suite

**Life Skills Suite** è una Single Page Application (SPA) web progettata per facilitare attività educative, socio-emotive e clinico-terapeutiche (sviluppata per TICE e contesti scolastici/formativi).
L'obiettivo è offrire strumenti visivi e interattivi per:
- **Alfabetizzazione emotiva e riconoscimento degli stati interni** (Ruota delle Emozioni, Termometro delle Emozioni).
- **Riflessione proiettiva e condivisione di vissuti** (Fotolinguaggio, Blob Tree).
- **Problem solving e decision making** (Scenari decisionali, narrazioni con IA).
- **Partecipazione attiva della classe in tempo reale** (Sessioni online da smartphone per feedback, votazioni, selezione immagini e posizionamento segnaposti su lavagna LIM).

L'applicazione supporta due modalità di interazione:
1. **Modalità Docente / LIM (Lavagna Interattiva Multimediale)**: schermo grande, proiettato in aula, con controlli avanzati, statistiche, filtri di privacy e opzioni di esportazione.
2. **Modalità Studente (Mobile First)**: gli alunni si collegano dal proprio smartphone o Chromebook inquadrando un QR Code o inserendo un codice stanza a 4 caratteri, senza necessità di registrazione o account.

---

## 2. Stack Tecnologico

- **Frontend**: React 18 (Hooks, componenti funzionali).
- **Build Tool**: Vite 5.
- **Styling**: Tailwind CSS con estetica **Neo-Brutalista** (bordi neri decisi `border-2/3/4 border-black`, ombre marcate con offset netto `shadow-[..._rgba(0,0,0,1)]`, palette pastello sature con accenti giallo, smeraldo, ciano).
- **Icone**: `lucide-react`.
- **Backend / Realtime Database**: Google Firebase Cloud Firestore (per sessioni online sincronizzate in tempo reale).
- **Intelligenza Artificiale**: Google Gemini API (tramite `@google/genai` o fetch REST per la generazione di scenari ed emozioni).
- **Librerie CDN / Globali**:
  - `xlsx` (SheetJS): esportazione fogli di calcolo Excel (`.xlsx`).
  - `jszip`: compressione ed esportazione backup completi (`.zip`).
  - `peerjs`: trasferimento P2P diretto tra dispositivi via WebRTC senza server.
  - `pako`: compressione dati per trasferimenti P2P e backup.
  - `qrcode-generator` & `html5-qrcode`: generazione e scansione QR Code.

---

## 3. Struttura del Repository e Flusso di Build

```
/ (root del repository)
├── app/                        # Sorgenti dell'applicazione
│   ├── index.html              # HTML di sviluppo Vite e caricamento script CDN
│   ├── package.json            # Dipendenze e script
│   ├── vite.config.js          # Configurazione Vite (root: 'app', outDir: '..')
│   └── src/
│       ├── main.jsx            # Entry point React
│       ├── LifeSkillsApp.jsx   # Router centrale, shell applicazione, dashboard, entry studenti
│       ├── index.css           # Direttive Tailwind e stili base
│       ├── components/         # Componenti React (viste docente e studente)
│       ├── lib/                # Logiche applicative, storage, esportatori, Firebase, P2P
│       └── data/               # Dati predefiniti (emozioni, scenari, blob trees)
├── assets/                     # OUTPUT DI BUILD VITE (CSS e bundle JS minificati)
├── index.html                  # OUTPUT DI BUILD VITE (pagina servita da GitHub Pages)
├── public/                     # Asset statici
├── APP_CONTEXT.md              # Questo file di contesto
└── README.md                   # Istruzioni rapide di esecuzione
```

> **Regola fondamentale di Build & Deploy**:
> I file sorgente si trovano **esclusivamente in `app/src/`**.
> Quando si compila con `npm run build` dalla cartella `app/` (o dal root), Vite genera `index.html` e la cartella `assets/` direttamente nella cartella superiore (la root del repository). La pubblicazione su GitHub Pages avviene servendo la root. **Non modificare mai a mano i file in `assets/` o `index.html` nella root.**

---

## 4. Architettura dei Dati e Persistenza

L'applicazione non richiede un server applicativo backend dedicato e adotta una strategia di persistenza a 3 livelli:

### A. LocalStorage (`lss_*`)
Memorizza configurazioni, stati attivi e testi leggeri:
- `lss_username`: namespace del docente / scuola.
- `lss_teacher_pin`: PIN di sicurezza per bloccare le impostazioni e la dashboard quando si proietta alla LIM.
- `lss_firebase_config`: parametri di connessione Firebase Firestore (facoltativi o configurabili).
- `lss_gemini_key` & `lss_gemini_model`: credenziali per la generazione IA.
- `lss_wheel_*`: modalità ruota (`svg`/`image`), palette e set attivo.
- `lss_scenario_sets` & `lss_active_sets`: elenchi di set personalizzati per scenari ed emozioni.
- `lss_visual_metaphors_state`: set, immagini e impostazioni del Fotolinguaggio e dei Blob Trees.

### B. IndexedDB
Utilizzato per superare i limiti di dimensione di LocalStorage e Firestore (che ha un limite di 1MB per documento):
- **Database `et_images`**: immagini caricate per il Termometro delle Emozioni.
- **Database `custom_images`** (`app/src/lib/customImageStorage.js`): immagini personalizzate ad alta risoluzione caricate per il Fotolinguaggio e gli scenari del Blob Tree. Include generazione automatica di miniature (thumbnail).

### C. Firebase Cloud Firestore (`feedback_sessions`)
Percorso raccolta: `artifacts/{appId}/public/data/feedback_sessions/{sessionCode}`
Gestisce le sessioni online in tempo reale. Il codice stanza è una stringa alfanumerica di 4 caratteri (es. `AB3X`).
Struttura del documento di sessione:
- `type`: tipo di attività (`feedback`, `metaphor_images`, `metaphor_blob`).
- `active`: booleano per abilitare o sospendere l'invio da parte degli studenti.
- `showNames`: booleano controllato dal docente per mostrare o mascherare i nomi degli alunni alla LIM.
- `maxSelections`: limite massimo di selezioni consentite a ciascuno studente.
- `participants`: mappa di oggetti indicizzata per chiave studente (`participants.${studentKey}`). Ogni record contiene `studentName`, `timestamp`, e i dati specifici dell'attività (`selectedImages` per fotolinguaggio, `markers` per blob tree, o risposte per Q&A). Questa struttura garantisce aggiornamenti atomici senza conflitti di concorrenza tra decine di alunni simultanei.

---

## 5. Moduli e Funzionalità Principali

### 1. Ruota delle Emozioni (Emotion Wheel)
- **Componenti**: `EmotionWheelSVG.jsx`, `EmotionWheelModal.jsx`, `lib/wheel.js`, `data/wheelData.js`.
- **Caratteristiche**:
  - 114 emozioni suddivise in famiglie primarie ed espansioni concentriche per intensità.
  - Doppia modalità: disegno vettoriale procedurale SVG (interattivo, selezionabile per quadrante) o immagine grafica ad alta risoluzione con lente di ingrandimento interattiva.
  - Palette cromatiche selezionabili (Plutchik classico, pastello, Ginevra).
  - Estrazione casuale di emozioni per stimolo alla scrittura/narrazione.

### 2. Scenari Decisionali & Narrazioni Emotive
- **Componenti**: `ScenarioManager.jsx`, `data/scenarios_data.js`, `lib/gemini.js`.
- **Caratteristiche**:
  - Dilemmi socio-affettivi e morali per stimolare il confronto in classe.
  - Gestione dei set di carte con possibilità di creare, clonare ed eliminare scenari.
  - Generatore basato su Google Gemini API per creare istantaneamente nuovi scenari calibrati per età o tematica (bullismo, amicizia, gestione della rabbia, inclusione).

### 3. Termometro delle Emozioni (Emotion Thermometer)
- **Componenti**: `EmotionThermometer.jsx`, `data/thermometerData.js`, `lib/thermometerStorage.js`.
- **Caratteristiche**:
  - Esercizio visivo di graduazione dell'intensità emotiva (da 1 a 5 per diverse emozioni di base).
  - Associazione di descrizioni, reazioni fisiche e strategie di regolazione emotiva.
  - Possibilità di associare immagini ed emoji memorizzate localmente in IndexedDB.

### 4. Metafore Visive: Fotolinguaggio (Photolanguage)
- **Componenti**:
  - Docente: `VisualMetaphorsView.jsx`, `VisualMetaphorsManager.jsx`.
  - Studente: `MetaphorImagesStudentView.jsx`.
  - Dati: `data/visualMetaphorsData.js`, `lib/customImageStorage.js`.
- **Caratteristiche**:
  - Set di immagini fotografiche ed evocative per facilitare l'espressione di concetti astratti.
  - Upload di immagini personalizzate (memorizzate in IndexedDB).
  - **Sessione Online**:
    - Il docente genera una stanza con QR Code e imposta quante foto ogni studente può scegliere al massimo (`maxSelections`: 1-5).
    - Gli studenti inseriscono il nome e scelgono le proprie immagini da smartphone con anteprima a schermo intero.
    - Il docente può attivare il **Toggle Nomi Visibili / Anonimi** per proteggere la privacy durante la proiezione alla LIM.
    - Esportazione in Excel (XLSX) con riepilogo per studente e frequenze assolute, e in TXT.

### 5. Metafore Visive: Blob Tree
- **Componenti**:
  - Docente: `BlobTreeView.jsx`.
  - Studente: `MetaphorBlobStudentView.jsx`.
  - Dati: `data/visualMetaphorsData.js`.
- **Caratteristiche**:
  - Illustrazioni ad albero con figure antropomorfe stilizzate ("Blob") che svolgono azioni ed esprimono posture emotive diverse.
  - Possibilità di usare scenari predefiniti o caricare illustrazioni personalizzate dal computer del docente.
  - **Sessione Locale**: inserimento manuale di segnaposti con nome alunno, colore e nota/ruolo.
  - **Sessione Online**:
    - Gli alunni aprono il Blob Tree da smartphone/computer, esplorano con pinch/zoom e toccano l'albero per posizionare il proprio segnaposto.
    - Possono selezionare il colore e digitare una breve nota sullo stato d'animo (con suggerimenti rapidi).
    - Rispetto del limite massimo di posizioni configurato dal docente (1-5).
    - Sulla lavagna del docente compaiono i segnaposti in tempo reale.
    - **Modalità Anonima LIM**: con un clic il docente nasconde nomi e note sostituendoli con numeri progressivi (`#1`, `#2`, ...).
    - **Esportazione Grafica (PNG)**: generata via Canvas HTML5 ad alta risoluzione con tutti i segnaposti e le etichette con i nomi sovrapposte, oltre a report tabellare Excel (XLSX).

### 6. Sessioni Q&A e Feedback Live
- **Componenti**: `LifeSkillsApp.jsx`, `FeedbackStudentView.jsx`, `lib/exporters.js`.
- **Caratteristiche**:
  - Invio di risposte aperte, votazioni Likert o parole chiave.
  - Visualizzazione risposte alla LIM con visualizzazione a schede o **Nuvola di Parole (Word Cloud)** procedurale in SVG.

### 7. Strumenti di Sistema e Sicurezza
- **`TeacherPinModal.jsx`**: PIN a 4 cifre per proteggere le aree riservate o di configurazione dell'insegnante durante la proiezione in classe.
- **`P2PModal.jsx` & `lib/p2p.js`**: trasferimento di set e dati da un browser all'altro tramite WebRTC senza account cloud.
- **`lib/backup.js`**: creazione e ripristino di archivi `.zip` completi di tutti i dati applicativi.
- **`lib/exporters.js`**: modulo centralizzato per la creazione di file XLSX, immagini PNG e riassunti di testo.

---

## 6. Design System & Convenzioni UI

L'interfaccia segue le regole del **Neo-Brutalismo**:
- **Bordi**: `border-2`, `border-3`, `border-4` con colore `border-black`.
- **Ombre**: ombre nette senza sfocatura:
  - Piccola: `shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`
  - Media: `shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`
  - Grande/Modali: `shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`
- **Feedback al tocco/click**: transizione con spostamento `active:translate-x-0.5 active:translate-y-0.5`.
- **Tipografia**: grassetti marcati (`font-black`, `font-bold`), lettere maiuscole con tracciatura allargata per intestazioni ed etichette (`uppercase tracking-wider`).
- **Colori caratteristici**:
  - Giallo evidenziatore (`bg-yellow-300`, `bg-yellow-400`): colore principale di accento e azione primaria.
  - Smeraldo (`bg-emerald-400`, `text-emerald-700`): stati positivi, successi, sessioni attive.
  - Corallo/Rosa (`bg-rose-400`, `text-rose-700`): cancellazioni, chiusura sessioni.
  - Ciano e Lilla: accenti per categorie ed etichette.

---

## 7. Linee Guida per Modifiche Future

1. **Lavorare sempre in `app/src/`**: non modificare mai direttamente la cartella `assets/` o i file nella root.
2. **Eseguire il build per testare**: verificare sempre le modifiche con `node ./node_modules/vite/bin/vite.js build` (o `npm run build`).
3. **Idempotenza e sicurezza nelle sessioni online**: salvare i dati degli studenti su Firestore sempre come campi indicizzati sotto `participants.${studentId}` (evitando array unici soggetti a sovrascritture concorrenti).
4. **Immagini grandi sempre su IndexedDB**: non salvare stringhe Base64 ad alta risoluzione direttamente su Firestore o LocalStorage; utilizzare le funzioni fornite da `lib/customImageStorage.js`.
5. **Consistenza dello stile**: mantenere sempre lo stile neo-brutalista su qualsiasi nuovo componente (bordi neri, ombre solide, font-black).
