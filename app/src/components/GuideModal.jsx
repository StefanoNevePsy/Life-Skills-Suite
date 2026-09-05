import React, { useState, useEffect } from 'react';
import { 
  X, BookOpen, Search, Smartphone, QrCode, Lock, Shield, 
  Sparkles, Layers, Download, Upload, CheckCircle2, MessageSquare, 
  Thermometer, HelpCircle, Eye, EyeOff, Laptop, BarChart2, Cloud, ArrowRight
} from 'lucide-react';

export default function GuideModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('quickstart');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const TABS = [
    { id: 'quickstart', label: '🚀 Avvio Rapido & Aula', icon: Laptop },
    { id: 'feedback', label: '💬 Feedback & Sondaggi', icon: MessageSquare },
    { id: 'scenarios', label: '🎭 Scenari & Creazione Set', icon: Layers },
    { id: 'fotolinguaggio', label: '📷 Metafore & Fotolinguaggio', icon: Sparkles },
    { id: 'emotions', label: '🌡️ Termometro & Ruota', icon: Thermometer },
    { id: 'security', label: '🔒 PIN & Sicurezza Cattedra', icon: Shield },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-yellow-50/95 border-4 border-black rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Guida e istruzioni per il docente"
      >
        {/* HEADER MODALE */}
        <div className="bg-white p-5 border-b-4 border-black flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-amber-300 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
              <BookOpen size={24} className="text-black" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight truncate">
                Guida per il Docente
              </h2>
              <p className="text-xs font-bold text-gray-500">
                Istruzioni pratiche per tutte le funzioni della suite
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-white hover:bg-rose-50 text-black hover:text-rose-800 border-2 border-black transition-all hover:scale-105 active:scale-95 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0"
            aria-label="Chiudi guida"
            title="Chiudi (Esc)"
          >
            <X size={20} />
          </button>
        </div>

        {/* BARRA DELLE SCHEDE */}
        <div className="bg-white px-4 py-2.5 border-b-2 border-black/15 flex gap-2 overflow-x-auto custom-scrollbar shrink-0">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap border-2 ${
                  isActive
                    ? 'bg-amber-300 text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-gray-700 hover:text-black border-gray-200 hover:border-gray-400'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* CONTENUTO SCHEDA ATTIVA */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 custom-scrollbar text-gray-800">
          
          {/* TAB 1: AVVIO RAPIDO & AULA */}
          {activeTab === 'quickstart' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-lg font-black text-gray-900 mb-2 flex items-center gap-2">
                  <Laptop className="text-blue-600" size={20}/> 1. Come collegare gli studenti in classe
                </h3>
                <p className="text-sm leading-relaxed text-gray-700 mb-4 font-medium">
                  Gli studenti non vedono mai la dashboard di gestione del docente. Atterrano direttamente sulla schermata di partecipazione. Hai due modalità per farli entrare:
                </p>

                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div className="bg-amber-50 p-4 rounded-xl border-2 border-amber-200">
                    <span className="bg-amber-200 text-amber-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">Modalità A: Chromebook / PC</span>
                    <h4 className="font-black text-sm text-gray-900 mt-2 mb-1">Indirizzo Pulito + Codice</h4>
                    <ol className="text-xs space-y-1.5 text-gray-700 list-decimal list-inside font-bold">
                      <li>Scrivi sulla lavagna o detta l'indirizzo del sito.</li>
                      <li>Gli studenti aprono il sito: vedono subito la schermata di ingresso.</li>
                      <li>Inseriscono il <strong>Codice Stanza a 4 lettere</strong> (es. <code className="bg-white px-1.5 py-0.5 rounded border font-mono">ABCD</code>) e il loro <strong>Nome e Cognome</strong>.</li>
                    </ol>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                    <span className="bg-blue-200 text-blue-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">Modalità B: Google Classroom / Smartphone</span>
                    <h4 className="font-black text-sm text-gray-900 mt-2 mb-1">Link Diretto con 1 Clic o QR</h4>
                    <p className="text-xs text-gray-700 font-bold mb-2">
                      Clicca sul pulsante <span className="bg-white border px-1.5 py-0.5 rounded text-[11px]">🔗 Copia link diretto</span> e incollalo su Classroom, oppure fai inquadrare il grande <strong>QR Code</strong> proiettato sulla LIM.
                    </p>
                    <p className="text-[11px] text-blue-800 font-semibold">
                      ✨ Lo studente entra all'istante senza dover digitare il codice stanza!
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-lg font-black text-gray-900 mb-2 flex items-center gap-2">
                  👤 2. Perché viene chiesto Nome e Cognome ad ogni sessione?
                </h3>
                <p className="text-sm leading-relaxed text-gray-700 font-medium">
                  Nelle scuole, i <strong>Chromebook e i computer del laboratorio sono condivisi</strong> tra studenti di classi e ore differenti. Per evitare che uno studente erediti accidentalmente il nome del compagno dell'ora precedente, il sistema:
                </p>
                <ul className="mt-3 space-y-2 text-xs font-bold text-gray-700 list-disc list-inside">
                  <li>Lascia sempre il campo nome vuoto all'accesso per ogni nuova attività.</li>
                  <li>Non consente a nessuno studente di inviare risposte anonime senza aver indicato chi è.</li>
                  <li><strong>Sei sempre tu, come docente</strong>, a decidere sulla cattedra se rendere l'attività anonima sulla LIM oppure mostrare i nomi!</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: FEEDBACK, SONDAGGI & BRAINSTORMING */}
          {activeTab === 'feedback' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
                  <BarChart2 className="text-emerald-600" size={20}/> Le 3 Tipologie di Attività Interattive
                </h3>
                
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-yellow-50 border border-yellow-200">
                    <h4 className="font-black text-sm text-yellow-950 mb-1">📝 Domande & Risposte</h4>
                    <p className="text-xs text-gray-600 font-medium">
                      Bacheca stile "post-it" dinamici. Ideale per domande aperte, riflessioni personali e condivisione di pareri.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                    <h4 className="font-black text-sm text-blue-950 mb-1">☁️ Brainstorming</h4>
                    <p className="text-xs text-gray-600 font-medium">
                      Word Cloud (nuvola di parole) in tempo reale. Le parole più frequenti diventano più grandi al centro della lavagna.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                    <h4 className="font-black text-sm text-emerald-950 mb-1">📊 Sondaggio</h4>
                    <p className="text-xs text-gray-600 font-medium">
                      Scelta multipla con votazione immediata e grafici a barre animati con percentuali e conteggio voti.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-lg font-black text-gray-900 mb-2 flex items-center gap-2">
                  <Eye className="text-purple-600" size={20}/> Il Tasto "Aula Anonima" vs "Nomi Visibili"
                </h3>
                <p className="text-sm leading-relaxed text-gray-700 font-medium mb-3">
                  Sulla barra in alto della schermata proiettata trovi il pulsante didattico più importante:
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 bg-slate-100 p-3.5 rounded-xl border border-slate-300">
                    <span className="font-black text-xs text-slate-800 flex items-center gap-1.5 mb-1">
                      <EyeOff size={15}/> 🙈 Aula Anonima (Consigliato per rompere il ghiaccio)
                    </span>
                    <p className="text-xs text-gray-600">
                      Sulla LIM i nomi vengono nascosti (mostra solo "Risposta #1", "Risposta #2"). Gli studenti partecipano senza timore del giudizio dei compagni.
                    </p>
                  </div>

                  <div className="flex-1 bg-purple-50 p-3.5 rounded-xl border border-purple-300">
                    <span className="font-black text-xs text-purple-900 flex items-center gap-1.5 mb-1">
                      <Eye size={15}/> 👁️ Nomi Visibili (Per discussioni nominali)
                    </span>
                    <p className="text-xs text-gray-600">
                      I nomi reali compaiono sopra ciascun post-it per attribuire i meriti o discutere gli interventi specifici.
                    </p>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-600"/>
                  <span><strong>Nota Docente:</strong> Anche se attivi "Aula Anonima" sulla LIM, nel file Excel che scarichi con il tasto <strong>XLS</strong> trovi SEMPRE i nomi reali di tutti per la tua valutazione!</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-lg font-black text-gray-900 mb-2 flex items-center gap-2">
                  <Smartphone className="text-gray-800" size={20}/> Telecomando Moderatore (dal tuo smartphone)
                </h3>
                <p className="text-sm leading-relaxed text-gray-700 font-medium">
                  Cliccando sull'icona <strong>Smartphone</strong> nella barra in alto, puoi inquadrare il QR dedicato con il tuo cellulare: si aprirà una schermata mobile privata che ti permette di <strong>approvare o scartare le risposte camminando liberamente tra i banchi</strong>, prima che appaiano sulla lavagna!
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: SCENARI & GESTIONE SET */}
          {activeTab === 'scenarios' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-lg font-black text-gray-900 mb-2 flex items-center gap-2">
                  <Layers className="text-amber-600" size={20}/> Come funzionano gli Scenari Didattici
                </h3>
                <p className="text-sm leading-relaxed text-gray-700 font-medium mb-3">
                  Dalla dashboard principale puoi accedere a 5 categorie tematiche:
                </p>
                <div className="grid sm:grid-cols-2 gap-2.5 text-xs font-bold text-gray-800">
                  <div className="bg-gray-50 p-2.5 rounded-lg border">💬 <strong>Comunicazione Efficace:</strong> stili assertivo, passivo, aggressivo.</div>
                  <div className="bg-gray-50 p-2.5 rounded-lg border">❤️ <strong>Emozioni:</strong> riconoscimento e localizzazione corporea.</div>
                  <div className="bg-gray-50 p-2.5 rounded-lg border">📖 <strong>Narrazioni Emotive:</strong> storie e contesti reali per stimolare il racconto.</div>
                  <div className="bg-gray-50 p-2.5 rounded-lg border">🧊 <strong>Decisioni a Freddo:</strong> dilemmi etici e pianificazione razionale.</div>
                  <div className="bg-gray-50 p-2.5 rounded-lg border sm:col-span-2">🔥 <strong>Decisioni a Caldo:</strong> situazioni ad alta pressione o impulsività.</div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-lg font-black text-gray-900 mb-2 flex items-center gap-2">
                  <Sparkles className="text-amber-600" size={20}/> Scenario Manager & Generazione con IA (Gemini)
                </h3>
                <p className="text-sm leading-relaxed text-gray-700 font-medium mb-3">
                  In alto a sinistra di qualsiasi categoria trovi il pulsante <strong>"Gestisci Scenari"</strong>. Da lì puoi:
                </p>
                <ol className="text-xs font-bold text-gray-700 space-y-2 list-decimal list-inside">
                  <li><strong>Creare nuovi Set tematici</strong> (es. <em>"Cyberbullismo 2ª Media"</em>, <em>"Gestione della Rabbia"</em>).</li>
                  <li><strong>Aggiungere stimoli a mano o incollare elenchi</strong> con il tasto <em>"Importa Elenco"</em>.</li>
                  <li><strong>Generare stimoli con l'Intelligenza Artificiale (Gemini)</strong>: inserisci un argomento o fascia d'età e premi <em>"GENERA CON GEMINI"</em> per creare automaticamente 3, 5 o 10 stimoli su misura!</li>
                  <li><strong>Attivare un set specifico</strong> con il tasto verde <em>"Attiva"</em>, oppure selezionare <em>"TUTTI I SET (MISTO)"</em> per estrarre a sorpresa da tutto l'archivio.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 4: TERMOMETRO & RUOTA */}
          {activeTab === 'emotions' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-lg font-black text-gray-900 mb-2 flex items-center gap-2">
                  <Thermometer className="text-rose-600" size={20}/> Il Termometro delle Emozioni (Scala 1-10)
                </h3>
                <p className="text-sm leading-relaxed text-gray-700 font-medium mb-3">
                  Uno strumento visivo potente per l'autoregolazione emotiva. Proiettalo sulla LIM per lavorare con i ragazzi:
                </p>
                <ul className="text-xs font-bold text-gray-700 space-y-2 list-disc list-inside">
                  <li><strong>Cursore interattivo</strong>: trascina il livello da 1 (calma piatta) a 10 (esplosione emotiva).</li>
                  <li><strong>Colori intuitivi</strong>: dal verde rilassante al rosso allerta.</li>
                  <li><strong>Strategie pratiche abbinate</strong>: a ogni livello corrispondono strategie cognitive e comportamentali personalizzabili (respirazione diaframmatica, time-out, chiedere aiuto a un adulto).</li>
                  <li><strong>Note di classe</strong>: puoi annotare sulla destra della schermata gli esempi condivisi dagli studenti durante la discussione.</li>
                </ul>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-lg font-black text-gray-900 mb-2 flex items-center gap-2">
                  🎨 La Ruota Emozionale di Plutchik
                </h3>
                <p className="text-sm leading-relaxed text-gray-700 font-medium">
                  Accessibile con il tasto <strong>"Ruota Emozionale"</strong>. Mostra la mappa cromatica delle emozioni primarie e delle loro combinazioni complesse (es. Gioia + Fiducia = Amore; Rabbia + Disgusto = Disprezzo), utilissima per arricchire il vocabolario emotivo degli studenti.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: METAFORE VISIVE & FOTOLINGUAGGIO */}
          {activeTab === 'fotolinguaggio' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-lg font-black text-gray-900 mb-2 flex items-center gap-2">
                  <Sparkles className="text-indigo-600" size={20}/> Che cos'è il Fotolinguaggio?
                </h3>
                <p className="text-sm leading-relaxed text-gray-700 font-medium mb-3">
                  Il <strong>Fotolinguaggio</strong> è una metodologia didattica ed espressiva ideata per facilitare la comunicazione, la consapevolezza emotiva e la relazione nei gruppi. Le fotografie agiscono come <em>mediatori simbolici</em>: aiutano studenti e partecipanti a verbalizzare vissuti interiori, pensieri ed emozioni che altrimenti risulterebbero difficili da esprimere a parole.
                </p>
                <div className="grid sm:grid-cols-2 gap-3 mt-4">
                  <div className="bg-indigo-50 p-4 rounded-xl border-2 border-indigo-200">
                    <h4 className="font-black text-xs uppercase tracking-wider text-indigo-950 mb-1">Set ETP (60 immagini)</h4>
                    <p className="text-xs text-indigo-900 font-medium leading-relaxed">
                      Immagini fotografiche d'autore ad alta qualità e forte impatto simbolico, incentrate su relazioni, solitudine, sfide, natura e vita sociale.
                    </p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-xl border-2 border-amber-200">
                    <h4 className="font-black text-xs uppercase tracking-wider text-amber-950 mb-1">Numerazione (#1 - #60)</h4>
                    <p className="text-xs text-amber-900 font-medium leading-relaxed">
                      Ogni foto presenta un numero ben visibile: gli studenti possono guardare la griglia proiettata alla LIM e scegliere con calma il loro numero.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-lg font-black text-gray-900 mb-2 flex items-center gap-2">
                  🎯 Come condurre un'attività passo per passo
                </h3>
                <ol className="text-xs font-bold text-gray-700 space-y-2.5 list-decimal list-inside">
                  <li>
                    <strong>Lancia la domanda stimolo</strong>: ad es. <em>"Scegli una foto che descrive come ti senti oggi"</em>, <em>"Quale foto rappresenta una sfida che stai affrontando?"</em> o <em>"Cosa significa per te fidarti di qualcuno?"</em>.
                  </li>
                  <li>
                    <strong>Fase di scelta individuale e silenziosa</strong>: proietta la griglia sulla LIM. Lascia 2-3 minuti agli alunni per osservare tutte le immagini e appuntarsi il numero scelto.
                  </li>
                  <li>
                    <strong>Assegnazione dei nomi</strong>: clicca sulla foto scelta e inserisci il nome dello studente (più studenti possono scegliere la stessa immagine!).
                  </li>
                  <li>
                    <strong>Proiezione a Schermo Intero & Narrazione</strong>: apri le foto scelte a schermo intero e invita lo studente a condividere: <em>Cosa hai visto in questa foto? Perché ti ha colpito? In che modo ti rispecchia?</em>
                  </li>
                  <li>
                    <strong>Riepilogo & Esportazione</strong>: clicca su <em>"Riepilogo"</em> in alto per consultare l'elenco completo di chi ha scelto cosa e copiarlo o scaricarlo.
                  </li>
                </ol>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-lg font-black text-gray-900 mb-2 flex items-center gap-2">
                  👥 Gestione di Classi e Sessioni Multiple
                </h3>
                <p className="text-sm leading-relaxed text-gray-700 font-medium">
                  Puoi creare una sessione distinta per ogni classe o gruppo (es. <em>"Classe 3A"</em>, <em>"Gruppo Pomeriggio"</em>). Le scelte di ciascuna classe rimangono salvate e possono essere riaperte in qualsiasi momento per riprendere la discussione negli incontri successivi.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: PIN & SICUREZZA CATTEDRA */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-lg font-black text-gray-900 mb-2 flex items-center gap-2">
                  <Shield className="text-amber-600" size={20}/> Come funziona la Protezione della Dashboard
                </h3>
                <p className="text-sm leading-relaxed text-gray-700 font-medium mb-3">
                  L'applicazione è progettata per impedire agli studenti di accedere ai comandi, alle impostazioni o ai set didattici:
                </p>
                <ul className="text-xs font-bold text-gray-700 space-y-2 list-disc list-inside">
                  <li><strong>Landing Studente Automatica</strong>: qualsiasi computer o Chromebook che apre il sito atterra automaticamente sulla schermata di inserimento del codice stanza.</li>
                  <li><strong>PIN Docente</strong>: cliccando sul pulsante <em>"Impostazioni"</em> in alto a destra, puoi impostare un PIN segreto per la cattedra.</li>
                  <li><strong>Tasto "Blocca"</strong>: quando ti allontani dalla cattedra, clicca sul lucchetto <em>"Blocca"</em> in alto a destra. Per rientrare nella dashboard sarà necessario digitare il PIN.</li>
                </ul>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-lg font-black text-gray-900 mb-2 flex items-center gap-2">
                  ❓ Cosa fare se dimentichi il PIN?
                </h3>
                <p className="text-sm leading-relaxed text-gray-700 font-medium mb-2">
                  Il PIN è salvato nel tuo database cloud Firebase. Se tu o un collega doveste dimenticarlo:
                </p>
                <ol className="text-xs font-bold text-gray-700 space-y-1.5 list-decimal list-inside">
                  <li>Apri la console Firebase (<a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-blue-600 underline">console.firebase.google.com</a>).</li>
                  <li>Entra nel tuo progetto e vai su <strong>Firestore Database</strong>.</li>
                  <li>Apri la cartella <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">artifacts &gt; main_app &gt; public &gt; data &gt; lifeskills &gt; main_db</code>.</li>
                  <li>Trova il campo <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">teacher_pin_hash</code> ed eliminalo con il cestino: il PIN verrà azzerato all'istante senza perdere alcun dato!</li>
                </ol>
              </div>
            </div>
          )}

        </div>

        {/* FOOTER MODALE */}
        <div className="bg-white p-4 border-t-2 border-black/15 flex items-center justify-between shrink-0">
          <div className="text-xs font-bold text-gray-500 hidden sm:block">
            Life Skills Suite • Strumenti per la Didattica Attiva
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-black text-white font-black text-xs uppercase tracking-wider hover:bg-gray-800 transition-all shadow-md ml-auto"
          >
            Ho Capito, Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}
