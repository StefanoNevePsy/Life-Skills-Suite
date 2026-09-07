# Firebase v2: accessi, immagini e rilascio

Questa branch modifica il frontend e prepara le regole. Il push della branch `feat/secure-classroom-sync-reports` non pubblica GitHub Pages e non distribuisce regole Firebase.

## Modello scelto

Tutti i docenti abilitati condividono l'archivio e le sessioni del progetto Firebase. È possibile usare lo stesso account email/password su più PC. Non viene introdotto isolamento fra scuole: per dati da tenere separati occorrono progetti distinti o una futura gestione delle appartenenze.

- `teachers/{uid}`: `{ enabled: true }`, modificabile soltanto da un amministratore tramite console/strumenti amministrativi. Creare un utente Authentication non basta per diventare docente.
- `workspaces/{workspace}/materials/{section}`: una sezione per documento. Le modifiche sono unite tramite transazioni e confronto fra versione iniziale, locale e remota, anche per elementi di set identificati da ID. Modifiche incompatibili vengono segnalate.
- `artifacts/{workspace}/public/data/lifeskills/main_db`: archivio precedente, leggibile solo dai docenti e non più modificato.
- `artifacts/{workspace}/public/data/custom_metaphor_images/{image}`: libreria immagini permanente, accessibile ai docenti.
- `sessions/{code}`: configurazione minima dell'attività, priva di risposte e nomi dei partecipanti; codice crittografico di sei caratteri, prenotazione atomica e nessuna sovrascrittura in caso di collisione. In caso di collisione l'interfaccia invita a riprovare.
- `sessions/{code}/answers/{answer}`: partecipazioni individuali. Studenti autenticati anonimamente leggono solo le proprie, docenti abilitati leggono tutte. Le risposte singole non sono riscrivibili; i marker e le selezioni possono essere aggiornati dal proprio autore a sessione aperta.
- `sessions/{code}/images/{image}`: copie ottimizzate delle sole immagini necessarie all'attività. Gli studenti non hanno accesso alla libreria docente.

Il prefisso storico `public/data` non concede più accesso pubblico: fanno fede le Security Rules.

## Accesso docenti e studenti

Il login docente usa Firebase Auth email/password. “Resta autenticato” usa persistenza locale, altrimenti persistenza della sessione browser. La password non è salvata manualmente dall'app. La permanenza dipende anche dalle impostazioni del browser e da eventuali revoche amministrative. “Esci” termina l'accesso docente su quel browser e rimuove il backup testuale locale dell'archivio.

Gli studenti usano un'istanza Firebase Auth distinta e identità anonime nella sessione del browser. Aprire un link studente sul PC docente non trasforma l'account docente in uno studente. “Esci” dalla partecipazione crea una nuova identità studente e svuota il nome. Su dispositivi condivisi usare questa azione prima del cambio persona. Il nome non è una chiave: gli omonimi sono distinti.

Un account docente condiviso non permette di attribuire modifiche ai singoli colleghi né di revocare l'accesso di uno solo. Gli account individuali rimangono supportati, abilitandone gli UID nello stesso modo.

## Disponibilità delle immagini

Le immagini personalizzate sono caricate nella libreria cloud prima che il materiale venga dichiarato condiviso. Una sessione diventa attiva soltanto dopo la preparazione delle sue copie immagini. Queste copie evitano che uno studente debba usare il dispositivo su cui è stata caricata la foto e proteggono la sessione da successive modifiche della libreria.

La copia cloud viene ottimizzata sotto 650 KB di Base64; gli originali locali restano in IndexedDB e nei backup. I documenti contengono soltanto riferimenti, non immagini, nell'archivio principale e nella configurazione della sessione. La compressione può ridurre la risoluzione dell'originale: non è uno storage di originali senza limiti. Le copie di sessione consumano spazio e vanno considerate nella manutenzione periodica.

Le immagini standard distribuite con il sito restano asset statici. La disponibilità online richiede rete, hosting e quota Firebase disponibile. Non vengono attivati Cloud Storage, Blaze, funzioni a pagamento o cancellazioni automatiche.

## Preparazione amministrativa prima del rilascio

1. Esportare un backup completo dall'app precedente, inclusi file e immagini; conservarlo fuori dal browser. Annotare il namespace/utente usato dall'archivio corrente.
2. In Firebase Authentication abilitare Email/Password e Anonymous. Creare l'account docente (oppure gli account individuali) e annotarne l'UID. Non distribuire credenziali amministrative ai browser.
3. In Firestore creare `teachers/UID_ESATTO` con il campo booleano `enabled: true`.
4. Configurare le variabili pubbliche del frontend. In sviluppo Vite le legge da `app/.env.local`, partendo da `app/.env.example`. In GitHub Actions usare le Repository Variables omonime. `VITE_WORKSPACE_ID` deve coincidere con il namespace dell'archivio precedente, per esempio `lifeskills-nome`, e rimanere uguale per tutti i docenti. Non inserire password, service account o chiavi private nelle variabili Vite.
5. Aggiungere il dominio effettivamente usato ai domini autorizzati di Authentication. Scegliere un solo indirizzo abituale per mantenere l'accesso e distribuire il preferito “Life Skills – Partecipa”.
6. Provare questa branch con un progetto di test e le nuove regole, prima del progetto reale.
7. Programmare il passaggio fuori da sessioni in corso: distribuire le nuove regole e la nuova build come intervento coordinato. Le nuove regole impediscono le scritture del frontend precedente. Le vecchie schede devono ricaricare.
8. Verificare login docente, archivio, un'immagine da un browser vuoto, invio studente e report.

Comando amministrativo per le regole, da eseguire solo quando pronti sul progetto esplicitamente scelto:

    firebase deploy --only firestore:rules --project ID_PROGETTO

Non esiste un bypass automatico delle regole in caso di errore. Non applicare regole permissive per far funzionare vecchie schede.

## Compatibilità e trasferimento dati

Se la nuova raccolta dei materiali è vuota, il docente legge `main_db` senza modificarlo. Il primo salvataggio trasferisce le sezioni al nuovo percorso in una transazione, lasciando intatto l'originale. I salvataggi successivi sono idempotenti rispetto ai dati. Non vengono migrate automaticamente le sessioni storiche: esportarle dal frontend precedente prima del passaggio. I vecchi codici a quattro caratteri non sono sessioni v2.

Il backup originale e il vecchio `main_db` restano disponibili per recupero. Un rollback al vecchio frontend richiede anche una valutazione delle vecchie regole e non incorpora automaticamente le modifiche v2: non farlo mentre i docenti lavorano. Eventuali modifiche locali non sincronizzate sono conservate nel backup browser e segnalate; non cancellare i dati del browser prima di esportarle.

Le sessioni scadono dopo 24 ore; la chiusura anticipata blocca gli invii. La scadenza nega ulteriori letture studente, ma non cancella i dati. I docenti conservano i dati nel cloud; la UI attuale continua a lavorare sulla sessione aperta e non aggiunge un archivio storico navigabile. Esportare il report prima di lasciare la sessione. La cancellazione e i tempi di conservazione restano una decisione amministrativa.

## Report

- Fotolinguaggio: fogli “Scelte studenti” e “Immagini e nomi”, con numero e titolo effettivi dell'immagine e numero partecipante per distinguere gli omonimi.
- Blob Tree PNG: proporzioni originali, gruppi di punti vicini numerati, legenda laterale con nomi su più righe; posizioni originali conservate come puntini e collegamenti alle etichette spostate per evitare sovrapposizioni. Raggruppamento a diametro limitato di 38 pixel su immagine normalizzata a larghezza 1400; non modifica le risposte salvate.
- Se i nomi sono nascosti, il report usa identificativi anonimi e il foglio Blob Tree non esporta le note. Il docente può rendere i nomi visibili prima di esportare il report nominativo.

## Verifica locale

Richiede Node e Java 21 per l'emulatore Firestore:

    npm ci
    npm test
    npm run test:rules
    npm run build

I test usano esclusivamente `demo-life-skills`. La modalità frontend di emulazione si attiva soltanto con `VITE_USE_EMULATORS=true` e un project ID che inizia con `demo-`.

Il piano Spark impone quote: i codici brevi e il divieto di elencarli non costituiscono rate limiting. Il PIN locale rimane una funzione offline, non un'autorizzazione cloud. Non è implementato un editor collaborativo carattere per carattere né una risoluzione automatica di conflitti incompatibili.

### Dipendenze

Il lockfile aggiorna le dipendenze compatibili. L’audit delle dipendenze di produzione non segnala vulnerabilità alla verifica della branch. Restano segnalazioni negli strumenti di sviluppo (Vite 5 e dipendenze della CLI Firebase); non sono inclusi nel sito statico. Il server di sviluppo va usato su localhost. Un aggiornamento di versione principale del tooling richiede una verifica separata.

### Verifiche effettuate sulla branch

- Installazione pulita dal package-lock e build di produzione riuscite.
- 16 test automatici superati, inclusi Security Rules su Firestore Emulator, cinque marker, risposte Q&A multiple e transazioni concorrenti sui materiali.
- Prova browser su istanze distinte docente/studenti: login persistente dopo reload, ingresso per codice, immagine cloud su browser vuoto, omonimi distinti, reset del partecipante all'uscita, moderazione che conserva risposte appena arrivate.
- Download del PNG riuscito e layout immagine/legenda verificato visivamente.
- Nessuna regola, account o dato del progetto Firebase reale modificato.
