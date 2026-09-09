# Riconosci le Emozioni

Attività guidata docente/bambino o LIM accessibile dalla dashboard. Non crea una stanza online autonoma per i Chromebook: questa modalità si svolge sul dispositivo del docente. Le sessioni interattive già esistenti restano disponibili nelle altre attività.

## Libreria e allenamento

La libreria iniziale contiene **61 disegni locali**: 48 ritratti vettoriali originali (otto personaggi, ciascuno con sei espressioni) e 13 simboli OpenMoji. Le emozioni sono gioia, tristezza, rabbia, paura, sorpresa e disgusto. Le illustrazioni sono esempi stilizzati per discutere gli indizi, non stimoli scientificamente validati. Il medesimo personaggio compare in tutte le emozioni, evitando che carnagione o capelli suggeriscano l'etichetta.

Filtri indipendenti: disegni, fotografie di persone reali, fotorealistiche IA o miste; volti/simboli; emozioni scelte. Le immagini possono essere escluse e reincluse senza cancellarle. Fotografie reali e fotorealistiche IA non sono incluse nella distribuzione iniziale: il filtro vuoto è esplicito e impedisce l'avvio.

- **Scegli l'emozione**: 2/3/4/6 alternative (limitate alle emozioni selezionate), giri da 6 a 60 immagini, distribuzione bilanciata delle emozioni disponibili e nessuna ripetizione nello stesso giro.
- **Osserva e racconta**: discussione prima di scoprire l'etichetta proposta; nessun punteggio.
- Aiuti su occhi/bocca/sopracciglia, lettura vocale tramite browser, possibilità di saltare, nessun timer, schermo intero.
- Riepilogo per emozione, aiuti e salti; ripasso dei tentativi con errori/aiuti; CSV con protezione dalle formule nei titoli. Il riepilogo è temporaneo, privo di nomi e non viene scritto nel cloud: esportarlo prima di uscire o avviare un altro giro.

Le alternative e il testo accessibile dell'immagine non rivelano anticipatamente la risposta. Le etichette descrivono l'intenzione didattica dello stimolo, non lo stato interno certo di una persona.

## Aggiungere immagini

Importazione multipla di PNG/JPEG/WebP (12 file per volta, 12 MB ciascuno, massimo 24 megapixel). Le tavole 3 × 2 vengono ritagliate in sei immagini; ogni etichetta è correggibile e i ritagli possono essere scartati prima di salvare. Fino a 300 immagini personali. Il caricamento converte ogni ritaglio in WebP (qualità iniziale 82%, ridotta se necessario per restare sotto 650 KB di Base64) e ridimensiona a massimo 1000 pixel sul lato maggiore; non accetta SVG attivi o URL remoti.

Il docente indica provenienza/licenza e conferma di poter condividere le immagini. Non usare archivi di ricerca in un sito pubblico senza la relativa autorizzazione. Le immagini generate vanno classificate come tali, non come fotografie reali.

Vedi il [prompt per creare le tavole in ChatGPT](PROMPT_IMMAGINI_EMOZIONI.md): otto tavole producono 48 immagini fotorealistiche, poi importabili insieme. Non ci sono chiamate a modelli, token API o generazione automatica nell'app.

## Persistenza, sicurezza, costi

Metadati e immagini escluse sono in `emotion_recognition`, una sezione del consueto archivio materiali. I byte importati passano attraverso IndexedDB e la libreria cloud esistente `custom_metaphor_images`. La migrazione Firebase riconosce già questi `customImageId`: nessuna nuova regola permissiva o servizio richiesto. Solo docenti abilitati leggono l'archivio completo. Le immagini di questa attività non vengono esposte tramite una nuova sessione studente.

La libreria standard è servita come file statici, con caricamento della vista a richiesta. Le miniature della galleria vengono mostrate 24 per volta. Nessuna lettura Firestore per le immagini standard. Gli originali caricati vanno conservati: in modalità locale, il backup JSON generale dell'app contiene i riferimenti e non incorpora le immagini di questa nuova attività. Le copie cloud sono ottimizzate, non un archivio di originali senza perdita. Errori cloud restano visibili; controllare lo stato di sincronizzazione dopo il salvataggio.

## Fonti e licenze

- Ritratti vettoriali originali: CC0 1.0, attribuzione in `public/emotion-recognition/CREDITS.txt`.
- [OpenMoji](https://github.com/hfg-gmuend/openmoji/tree/15.1.0): 13 SVG non modificati dalla versione 15.1.0, [CC BY-SA 4.0](https://github.com/hfg-gmuend/openmoji/blob/15.1.0/LICENSE.txt), attribuzione visibile nella libreria e licenza inclusa. Le etichette didattiche sono nostre interpretazioni.
- [RaFD](https://rafd.nl/): uso gratuito descritto per ricerca scientifica non commerciale da ricercatori di università accreditate, accesso su richiesta. Non è stato importato né considerato liberamente redistribuibile in questa app.

## Verifica

`npm test` include selezione bilanciata, filtri, alternative, conteggi e CSV. Controllare anche nel browser: importazione dei sei ritagli, persistenza dopo ricarica, filtri vuoti, aiuti/salti, report e layout Chromebook/mobile. Per le regole generali rimane `npm run test:rules`. Il deploy guidato include i test della nuova attività e i file statici della libreria.

Il pulsante Salva richiede provenienza compilata e conferma di poter condividere le immagini: i requisiti mancanti sono mostrati accanto al pulsante. La conversione WebP riguarda le nuove importazioni; le immagini già salvate non vengono modificate.
