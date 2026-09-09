# Configurazione e migrazione guidata su macOS

Apri **Configura-Firebase.command** dalla cartella completa del progetto. Installa prima [Node.js 22 LTS](https://nodejs.org). Il file installa le dipendenze con `npm ci` se Firebase Tools manca: non serve installarlo globalmente. La procedura usa la versione locale del lockfile, attualmente Firebase Tools 15.x, anche se esiste un'altra versione globale. Servono Internet e un account Google con autorizzazioni amministrative sui progetti scelti.

In alternativa, dalla cartella del progetto:

```bash
bash Configura-Firebase.command
```

Su Windows si può usare lo stesso assistente con Node: `npm ci`, poi `npm run firebase:setup`. Non eseguire con sudo. `node scripts/firebase-setup.mjs --help` mostra l'aiuto senza operazioni cloud, dopo l'installazione delle dipendenze.

## Prima scelta: conservare il progetto o crearne uno nuovo

Cambiare account Google o dominio non obbliga a spostare il database. Puoi aggiungere il nuovo account come proprietario in Impostazioni progetto → Utenti e autorizzazioni, verificarne l'accesso e usare quello nell'assistente. In questo caso restano dati, UID e configurazione Firebase: scegli il progetto esistente. Lo script non modifica i proprietari né rimuove account Google.

Per separare completamente il progetto, scegli invece un Project ID nuovo e la copia dall'origine. Il nuovo account deve poter creare progetti; gli ID sono globalmente univoci. La creazione supporta un progetto nuovo oppure un progetto già configurato in Firebase, non l'attivazione automatica di Firebase su un progetto Google Cloud preesistente.

## Menu 1 — Prepara progetto e migrazione

1. Seleziona l'account Google destinazione oppure accedi dal browser. L'account Google amministratore e l'email/password docente dell'app sono due accessi diversi.
2. Indica il Project ID, se crearlo, il namespace esatto, la regione del nuovo database, l'eventuale dominio e l'email docente. Il namespace si ricava dalle impostazioni dell'app o dal percorso `artifacts/NAMESPACE` nel vecchio Firestore. Non usare il valore predefinito senza verificarlo.
3. Per una copia tra progetti, seleziona anche account e Project ID di origine. Il namespace viene mantenuto identico. Per aggiornare il progetto attuale puoi rispondere no alla copia: viene comunque salvato un backup e convertito l'archivio precedente.
4. Sospendi le modifiche degli altri docenti e chiudi le attività. Esporta anche un backup completo dall'app, incluse le immagini locali. Il backup cloud non è una fotografia atomica e non contiene ciò che esiste soltanto nel browser.
5. Leggi il riepilogo e scrivi `PREPARA ID_PROGETTO`. Lo script abilita le API necessarie, crea il database se manca e registra l'app web; configura Email/Password, Anonymous e i domini autorizzati; confronta e copia i materiali; crea o abilita l'account docente; scrive `app/.env.local`.

La regione predefinita è Milano (`europe-west8`) e vale soltanto per un database nuovo. Quella esistente non cambia. Se Authentication non è inizializzato, l'assistente chiede di aprire la console, premere **Inizia**, poi digitare `RIPROVA`. Non viene attivata la fatturazione né richiesto il passaggio a Identity Platform a pagamento.

Una password nuova viene chiesta nel terminale senza mostrarla e non viene salvata nei file. Per un docente già presente la password non viene cambiata. Gli account disabilitati non vengono riabilitati implicitamente. Il ruolo docente è registrato in `teachers/UID`.

**Questa fase non pubblica sito o Security Rules.** Nel progetto esistente restano attive le regole già pubblicate: non considerare applicato l'isolamento degli studenti prima del rilascio. Nel progetto nuovo non distribuire ancora il link. La preparazione non cancella dati, ma può lasciare configurazione e copie parziali se un passaggio fallisce; è possibile ripeterla.

## Che cosa viene copiato

- Materiali e impostazioni dell'archivio selezionato, dal percorso v2 se presente; altrimenti conversione di `main_db` in documenti per sezione. Il vecchio PIN non viene trasferito.
- Tutte le immagini personalizzate già presenti nella libreria Firestore del namespace. I riferimenti a immagini personalizzate mancanti bloccano la copia: sincronizzale o recuperale nell'app originale prima di riprovare.
- Le immagini standard restano nei file del sito e vengono incluse nella build.

Le sessioni precedenti, comprese le risposte dei partecipanti, vengono incluse nel backup locale se appartengono al namespace, ma non riaperte o importate nella destinazione. Esporta i report prima del passaggio. Utenti Authentication, password e ruoli di altri docenti non vengono copiati; lo script configura il docente indicato. Non vengono migrati bucket Storage, altri database, altri namespace o servizi esterni. I riferimenti Firestore al progetto di origine vengono adattati; eventuali URL esterni rimangono invariati.

Prima della copia viene eseguito il confronto completo con la destinazione. Documenti identici sono saltati; documenti diversi bloccano la copia senza sovrascriverli. Le scritture impongono che il documento non esista e sono rilette per verifica. Un errore durante la copia può lasciare una parte già trasferita: ripetere la preparazione permette di riprendere. Nessuna cancellazione o fusione automatica in caso di conflitto.

## Menu 2 — Solo backup

Salva l'archivio cloud selezionato e le relative sessioni senza modificarli. I backup JSON, le impronte SHA-256, i confronti e lo stato della procedura sono nella cartella nascosta `.firebase-setup/`, esclusa da Git. La cartella non è cifrata: contiene anche dati degli studenti e, se il progetto è in Google Drive, può essere sincronizzata da Drive. Conservarla con accesso limitato. Il menu non è un ripristino generico dei backup: la migrazione legge il progetto di origine ancora accessibile.

## Menu 3 — Verifica e pubblica

Quando sei pronto, riapri il file e scegli 3. L'assistente controlla progetto, configurazione, docente e documenti preparati, esegue i test di migrazione/report e compila il sito. Se i dati sono cambiati, richiede di ripetere la preparazione. La verifica completa delle Security Rules con emulatore è eseguita separatamente in CI (`npm run test:rules`, richiede Java 21).

Solo dopo la build e il riepilogo, digitando `PUBBLICA ID_PROGETTO`, distribuisce **Security Rules e sito su Firebase Hosting**. Il deploy è coordinato ma non atomico: se fallisce controlla quale parte è stata pubblicata e ripeti il rilascio prima di riaprire alla classe. Le vecchie sessioni/frontend non sono compatibili con le nuove regole.

Il sito viene assemblato in una cartella dedicata: non vengono pubblicati backup, sorgenti, file `.env` o credenziali. La configurazione Firebase client è pubblica per progettazione; l'accesso ai dati dipende da Authentication e Security Rules.

Il menu non pubblica GitHub Pages né configura le variabili del repository GitHub. Per Pages segui la guida Firebase v2 e imposta le Repository Variables del nuovo progetto prima della build in GitHub Actions.

Se riutilizzi lo stesso indirizzo, la vecchia configurazione Firebase salvata nelle impostazioni del browser ha priorità su quella della build: aggiornala nelle impostazioni sui PC che l'avevano personalizzata. Non cancellare i dati del browser prima di aver esportato i materiali locali. Su un dominio nuovo non esiste questa configurazione precedente e i docenti dovranno effettuare il primo login; successivamente possono scegliere di restare autenticati.

Tra migrazione e rilascio sospendi le modifiche nella vecchia app: usa ancora il vecchio archivio e le nuove sezioni non ne recepiscono automaticamente gli aggiornamenti. Per le migrazioni che registrano l’impronta dell’archivio precedente, il deploy controlla anche che questo non sia cambiato.

Dopo il rilascio prova da un browser nuovo: accesso docente, materiali e immagini, nuova sessione, partecipazione studente e report. Conserva il progetto originale e i backup finché non hai verificato tutto.

## Menu 4 — Dominio

Richiede il collegamento del dominio a Firebase Hosting, mostra i record DNS richiesti e permette di ricontrollare lo stato. Devi acquistare/possedere il dominio e modificare i record presso il provider; i tempi di verifica e certificato HTTPS non sono eliminabili dallo script. Un dominio già collegato altrove può richiedere ulteriori verifiche dalla console. La voce 4 usa il dominio scelto nella preparazione; per cambiarlo ripeti la voce 1.

## Limiti e manutenzione

Nessun servizio a pagamento viene abilitato dallo script. Le letture e scritture di backup, confronto e copia consumano comunque le quote del progetto: su Spark possono esaurire la quota giornaliera; su un progetto già Blaze seguono il suo piano esistente. Il costo dell'eventuale dominio è separato.

L'assistente riusa il login OAuth di Firebase Tools: non richiede una chiave privata service account e non la inserisce nel frontend. L'adattatore di autenticazione usa API interne di Firebase Tools 15.x, quindi mantenere il lockfile e verificare lo script quando si aggiorna la CLI. Le conferme nel terminale proteggono da una selezione accidentale del progetto.

Verifiche disponibili: test automatici della conversione, dei conflitti, della ripresa e della configurazione; controllo sintattico dello script e compilazione dell'app. La configurazione di un vero account Google, la creazione di un vero progetto e il deploy richiedono una prova amministrativa su un progetto di test: non sono stati eseguiti sul cloud durante la preparazione dello script.

Riferimenti ufficiali: [ruoli del progetto](https://firebase.google.com/docs/projects/iam/roles-basic), [dominio personalizzato](https://firebase.google.com/docs/hosting/custom-domain), [limite di inizializzazione automatica di Identity Platform](https://docs.cloud.google.com/identity-platform/docs/reference/rest/v2/projects.identityPlatform/initializeAuth).

## Configurazione pubblica del sito di test

`app/.env.production` contiene esclusivamente i parametri pubblici del client Firebase per `life-skills-suite` e il namespace `lifeskills-default`. Non contiene password, token amministrativi o chiavi service account. Le Repository Variables valorizzate hanno priorità; il workflow ignora quelle vuote. Per cambiare progetto, aggiornare tutte le variabili Firebase e il namespace, oppure questa configurazione di fallback. La configurazione `app/.env.local` generata dall’assistente prevale durante un deploy locale. La sicurezza dei dati è applicata da Authentication e Security Rules.
