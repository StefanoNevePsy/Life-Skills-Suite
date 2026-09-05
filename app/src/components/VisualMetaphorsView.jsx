import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ArrowLeft, Search, X, Plus, Trash2, Edit, Copy, Check, 
  ChevronLeft, ChevronRight, Maximize2, Users, Sparkles, 
  Filter, Grid, LayoutGrid, Download, RefreshCw, FileText,
  SlidersHorizontal, CheckCircle2
} from 'lucide-react';
import FullscreenButton from './FullscreenButton';
import { 
  ensureVisualMetaphorsState, 
  createNewSession, 
  getSessionStudentRoster, 
  formatSessionSummaryText 
} from '../data/visualMetaphorsData';

export default function VisualMetaphorsView({ data, onUpdateData, onBack }) {
  // Stato complessivo garantito
  const vmState = useMemo(() => ensureVisualMetaphorsState(data?.visual_metaphors), [data]);

  const activeSet = useMemo(() => {
    return vmState.sets.find(s => s.id === vmState.activeSetId) || vmState.sets[0];
  }, [vmState]);

  const activeSession = useMemo(() => {
    return vmState.sessions.find(s => s.id === vmState.activeSessionId) || vmState.sessions[0];
  }, [vmState]);

  // Stati UI locali
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'chosen' | 'unchosen'
  const [gridColumns, setGridColumns] = useState(5); // 3, 4, 5, 6
  const [lightboxImageId, setLightboxImageId] = useState(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [quickStudentInput, setQuickStudentInput] = useState('');

  // Input ref per focus automatico nel lightbox
  const lightboxInputRef = useRef(null);

  // Roster di tutti gli studenti in questa sessione
  const sessionRoster = useMemo(() => getSessionStudentRoster(activeSession), [activeSession]);

  // Aggiorna lo stato globale
  const updateVmState = (updater) => {
    const nextVm = typeof updater === 'function' ? updater(vmState) : updater;
    const updatedFullData = {
      ...(data || {}),
      visual_metaphors: nextVm
    };
    onUpdateData(updatedFullData);
  };

  // --- GESTIONE SESSIONI ---
  const handleCreateSession = (name) => {
    const newSess = createNewSession(name, vmState.sessions);
    updateVmState(prev => ({
      ...prev,
      sessions: [newSess, ...prev.sessions],
      activeSessionId: newSess.id
    }));
    setIsNewSessionModalOpen(false);
    setNewSessionName('');
  };

  const handleRenameSession = () => {
    if (!renameValue.trim() || !activeSession) return;
    updateVmState(prev => ({
      ...prev,
      sessions: prev.sessions.map(s => s.id === activeSession.id ? { ...s, name: renameValue.trim() } : s)
    }));
    setIsRenameModalOpen(false);
    setRenameValue('');
  };

  const handleDeleteSession = (sessionId) => {
    if (vmState.sessions.length <= 1) {
      alert("Non puoi eliminare l'unica sessione rimasta. Puoi invece azzerarne le scelte.");
      return;
    }
    if (!window.confirm(`Sei sicuro di voler eliminare la sessione "${activeSession.name}"? Le scelte registrate andranno perse.`)) {
      return;
    }
    updateVmState(prev => {
      const remaining = prev.sessions.filter(s => s.id !== sessionId);
      return {
        ...prev,
        sessions: remaining,
        activeSessionId: remaining[0].id
      };
    });
  };

  const handleResetCurrentSession = () => {
    if (!window.confirm(`Vuoi azzerare tutte le scelte degli studenti per la sessione "${activeSession.name}"?`)) {
      return;
    }
    updateVmState(prev => ({
      ...prev,
      sessions: prev.sessions.map(s => s.id === activeSession.id ? { ...s, assignments: {} } : s)
    }));
  };

  // --- ASSEGNAZIONI STUDENTI ---
  const handleAssignStudent = (imageId, studentName) => {
    const trimmed = studentName ? studentName.trim() : '';
    if (!trimmed || !activeSession) return;

    updateVmState(prev => {
      const currentList = activeSession.assignments[imageId] || [];
      // Evita duplicati dello stesso studente sulla stessa immagine
      if (currentList.some(n => n.toLowerCase() === trimmed.toLowerCase())) {
        return prev;
      }
      const updatedAssignments = {
        ...activeSession.assignments,
        [imageId]: [...currentList, trimmed]
      };
      return {
        ...prev,
        sessions: prev.sessions.map(s => s.id === activeSession.id ? { ...s, assignments: updatedAssignments } : s)
      };
    });
    setQuickStudentInput('');
  };

  const handleRemoveStudent = (imageId, studentName) => {
    if (!activeSession) return;
    updateVmState(prev => {
      const currentList = activeSession.assignments[imageId] || [];
      const filtered = currentList.filter(n => n !== studentName);
      const updatedAssignments = { ...activeSession.assignments };
      if (filtered.length > 0) {
        updatedAssignments[imageId] = filtered;
      } else {
        delete updatedAssignments[imageId];
      }
      return {
        ...prev,
        sessions: prev.sessions.map(s => s.id === activeSession.id ? { ...s, assignments: updatedAssignments } : s)
      };
    });
  };

  // Immagine attualmente aperta nel Lightbox
  const lightboxImage = useMemo(() => {
    if (!lightboxImageId || !activeSet) return null;
    return activeSet.images.find(img => img.id === lightboxImageId) || null;
  }, [lightboxImageId, activeSet]);

  const assignedToLightbox = useMemo(() => {
    if (!lightboxImageId || !activeSession?.assignments) return [];
    return activeSession.assignments[lightboxImageId] || [];
  }, [lightboxImageId, activeSession]);

  // Navigazione tastiera per Lightbox
  useEffect(() => {
    if (!lightboxImageId || !activeSet) return;
    const handleKeyDown = (e) => {
      // Se l'utente sta digitando nel campo di testo, non intercettare le frecce
      if (document.activeElement?.tagName === 'INPUT') {
        if (e.key === 'Escape') {
          lightboxInputRef.current?.blur();
        }
        return;
      }

      if (e.key === 'Escape') {
        setLightboxImageId(null);
      } else if (e.key === 'ArrowRight') {
        const nextId = lightboxImageId >= activeSet.images.length ? 1 : lightboxImageId + 1;
        setLightboxImageId(nextId);
      } else if (e.key === 'ArrowLeft') {
        const prevId = lightboxImageId <= 1 ? activeSet.images.length : lightboxImageId - 1;
        setLightboxImageId(prevId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImageId, activeSet]);

  // Immagini filtrate
  const filteredImages = useMemo(() => {
    if (!activeSet?.images) return [];
    const query = searchQuery.trim().toLowerCase();
    const assignments = activeSession?.assignments || {};

    return activeSet.images.filter(img => {
      const students = assignments[img.id] || [];
      const isChosen = students.length > 0;

      // Filtro stato
      if (filterMode === 'chosen' && !isChosen) return false;
      if (filterMode === 'unchosen' && isChosen) return false;

      // Ricerca testo (numero o nome studente)
      if (query) {
        const numMatch = `#${img.number}`.includes(query) || String(img.number) === query;
        const studentMatch = students.some(name => name.toLowerCase().includes(query));
        if (!numMatch && !studentMatch) return false;
      }

      return true;
    });
  }, [activeSet, activeSession, searchQuery, filterMode]);

  // Conteggi globali
  const chosenCount = useMemo(() => {
    const assignments = activeSession?.assignments || {};
    return Object.keys(assignments).filter(id => (assignments[id] || []).length > 0).length;
  }, [activeSession]);

  const totalStudentsAssigned = useMemo(() => {
    const assignments = activeSession?.assignments || {};
    return Object.values(assignments).reduce((acc, arr) => acc + (arr?.length || 0), 0);
  }, [activeSession]);

  // Copia riepilogo
  const handleCopySummary = () => {
    const text = formatSessionSummaryText(activeSession, activeSet);
    navigator.clipboard.writeText(text).then(() => {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    });
  };

  // Download TXT
  const handleDownloadTxt = () => {
    const text = formatSessionSummaryText(activeSession, activeSet);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const el = document.createElement('a');
    el.href = url;
    el.download = `fotolinguaggio_${activeSession.name.replace(/[^a-z0-9]/gi, '_')}.txt`;
    document.body.appendChild(el);
    el.click();
    el.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-3 sm:p-6 font-sans selection:bg-yellow-200 flex flex-col">
      
      {/* ========================================================================= */}
      {/* 1. BARRA SUPERIORE DI CONTROLLO & CATTEDRA */}
      {/* ========================================================================= */}
      <nav className="max-w-7xl mx-auto w-full mb-6 flex flex-wrap items-center justify-between gap-4">
        {/* Sinistra: Torna alla Dashboard */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 font-black text-sm text-black bg-white hover:bg-yellow-300 px-4 py-2.5 rounded-2xl border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <div className="flex items-center gap-2 bg-indigo-100 border-3 border-black px-4 py-2 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Sparkles size={18} className="text-indigo-700" />
            <span className="font-black text-xs uppercase tracking-wider text-indigo-950">Metafore Visive</span>
            <span className="bg-black text-yellow-400 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
              Fotolinguaggio
            </span>
          </div>
        </div>

        {/* Destra: Selettore Sessioni & Azioni */}
        <div className="flex items-center gap-2.5 flex-wrap">
          
          {/* Selettore Set di Immagini */}
          <div className="flex items-center gap-1.5 bg-white border-2 border-black rounded-xl px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-[11px] font-black uppercase text-gray-500">Set:</span>
            <select
              value={vmState.activeSetId}
              onChange={(e) => updateVmState(prev => ({ ...prev, activeSetId: e.target.value }))}
              className="bg-transparent font-black text-xs text-black outline-none cursor-pointer"
            >
              {vmState.sets.map(s => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.count} foto)
                </option>
              ))}
            </select>
          </div>

          {/* Selettore Sessione & Gestione */}
          <div className="flex items-center gap-1 bg-yellow-100 border-2 border-black rounded-xl p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-[11px] font-black uppercase text-yellow-950 px-2 flex items-center gap-1">
              <Users size={13} />
              <span className="hidden md:inline">Sessione:</span>
            </span>
            <select
              value={vmState.activeSessionId}
              onChange={(e) => updateVmState(prev => ({ ...prev, activeSessionId: e.target.value }))}
              className="bg-white border-2 border-black rounded-lg px-2.5 py-1 font-black text-xs text-black outline-none cursor-pointer"
            >
              {vmState.sessions.map(s => {
                const count = Object.keys(s.assignments || {}).length;
                return (
                  <option key={s.id} value={s.id}>
                    {s.name} ({count} scelte)
                  </option>
                );
              })}
            </select>

            {/* Azioni Sessione: Rinomina, Nuova, Reset */}
            <button
              onClick={() => {
                setRenameValue(activeSession.name);
                setIsRenameModalOpen(true);
              }}
              className="p-1.5 hover:bg-yellow-200 text-black rounded-lg transition-colors"
              title="Rinomina questa sessione"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={() => setIsNewSessionModalOpen(true)}
              className="p-1.5 hover:bg-yellow-200 text-black rounded-lg transition-colors font-black flex items-center gap-1 text-xs"
              title="Crea una nuova sessione (es. per un'altra classe)"
            >
              <Plus size={15} className="stroke-[3]" />
            </button>
            <button
              onClick={handleResetCurrentSession}
              className="p-1.5 hover:bg-rose-100 text-rose-700 rounded-lg transition-colors"
              title="Azzera le scelte di questa sessione"
            >
              <RefreshCw size={13} />
            </button>
          </div>

          {/* Tasto Riepilogo Scelte con Badge */}
          <button
            onClick={() => setIsSummaryOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-yellow-300 hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            title="Visualizza o esporta il riepilogo delle scelte degli studenti"
          >
            <FileText size={14} />
            <span>Riepilogo</span>
            <span className="bg-black text-white px-1.5 py-0.2 rounded-md font-mono text-[11px] ml-0.5">
              {chosenCount}
            </span>
          </button>

          {/* Schermo Intero */}
          <FullscreenButton className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-xl" />
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 2. HERO / BARRA FILTRI & CONTROLLI GRIGLIA */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto w-full mb-6 bg-white p-4 rounded-3xl border-3 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Barra di Ricerca Rapida */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca per numero (es. #14) o nome studente..."
              className="w-full pl-10 pr-9 py-2.5 bg-gray-50 border-2 border-black rounded-xl font-bold text-sm text-black outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-gray-400 placeholder:font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black p-1"
                title="Cancella ricerca"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Filtri Stato Immagini */}
          <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl border-2 border-black">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                filterMode === 'all'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              Tutte ({activeSet?.count || 0})
            </button>
            <button
              onClick={() => setFilterMode('chosen')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                filterMode === 'chosen'
                  ? 'bg-emerald-400 text-black shadow-xs'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              Scelte ({chosenCount})
            </button>
            <button
              onClick={() => setFilterMode('unchosen')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                filterMode === 'unchosen'
                  ? 'bg-amber-300 text-black shadow-xs'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              Non scelte ({(activeSet?.count || 0) - chosenCount})
            </button>
          </div>

          {/* Densità Griglia (3, 4, 5, 6 colonne) */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-black uppercase text-gray-400 mr-1 hidden sm:inline">Colonne:</span>
            {[3, 4, 5, 6].map(cols => (
              <button
                key={cols}
                onClick={() => setGridColumns(cols)}
                className={`w-8 h-8 rounded-lg border-2 border-black font-black text-xs flex items-center justify-center transition-all ${
                  gridColumns === cols
                    ? 'bg-yellow-300 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white hover:bg-gray-100 text-gray-600'
                }`}
                title={`Visualizza ${cols} colonne`}
              >
                {cols}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. GRIGLIA FOTOGRAFICA NEO-BRUTALISTA */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto w-full flex-1 pb-12">
        {filteredImages.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center max-w-lg mx-auto my-12">
            <Sparkles size={48} className="mx-auto text-yellow-400 mb-4" />
            <h3 className="text-xl font-black text-black uppercase mb-2">Nessuna immagine trovata</h3>
            <p className="text-sm font-bold text-gray-500 mb-6">
              Nessuna foto corrisponde ai criteri di ricerca o al filtro attivo.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setFilterMode('all'); }}
              className="px-5 py-2.5 bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
            >
              Mostra tutte le immagini
            </button>
          </div>
        ) : (
          <div className={`grid gap-4 sm:gap-6 ${
            gridColumns === 3 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' :
            gridColumns === 4 ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' :
            gridColumns === 5 ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' :
            'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
          }`}>
            {filteredImages.map(img => {
              const assignedStudents = activeSession?.assignments?.[img.id] || [];
              const isChosen = assignedStudents.length > 0;

              return (
                <div
                  key={img.id}
                  className={`bg-white rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden flex flex-col group relative ${
                    isChosen ? 'ring-3 ring-yellow-400 ring-offset-2' : ''
                  }`}
                >
                  {/* Badge Numero Immagine in alto a sinistra */}
                  <div className="absolute top-2.5 left-2.5 z-20">
                    <span className="bg-yellow-300 text-black border-2 border-black font-black text-xs sm:text-sm px-2.5 py-1 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-flex items-center gap-1">
                      #{img.number}
                    </span>
                  </div>

                  {/* Badge Studenti in alto a destra se scelta */}
                  {isChosen && (
                    <div className="absolute top-2.5 right-2.5 z-20">
                      <span className="bg-black text-white text-[11px] font-black px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                        <Users size={12} />
                        <span>{assignedStudents.length}</span>
                      </span>
                    </div>
                  )}

                  {/* Area Immagine Cliccabile (Apre Lightbox) */}
                  <div
                    onClick={() => setLightboxImageId(img.id)}
                    className="relative w-full aspect-[4/3] bg-gray-100 cursor-pointer overflow-hidden border-b-2 border-black"
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Overlay al passaggio del mouse con prompt per ingrandire */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white/95 text-black px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform scale-95 group-hover:scale-100 transition-transform">
                        <Maximize2 size={13} />
                        <span>Espandi</span>
                      </div>
                    </div>
                  </div>

                  {/* Barra Assegnazione Studenti in calce alla card */}
                  <div className="p-2.5 bg-[#FFFDF9] flex-1 flex flex-col justify-between gap-2">
                    {isChosen ? (
                      <div className="space-y-1">
                        <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto custom-scrollbar">
                          {assignedStudents.map((name, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 bg-yellow-200 text-black border border-black px-2 py-0.5 rounded-md font-black text-[11px] leading-tight"
                            >
                              <span>{name}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveStudent(img.id, name);
                                }}
                                className="hover:text-rose-700 p-0.5 rounded-xs"
                                title={`Rimuovi ${name}`}
                              >
                                <X size={10} className="stroke-[3]" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] font-bold text-gray-400 italic">
                        Nessuno studente assegnato
                      </p>
                    )}

                    {/* Bottone Rapido Assegna / Gestisci */}
                    <button
                      type="button"
                      onClick={() => setLightboxImageId(img.id)}
                      className="w-full py-1.5 px-2 rounded-xl text-[11px] font-black uppercase tracking-wider bg-white hover:bg-yellow-300 text-black border-2 border-black transition-colors flex items-center justify-center gap-1 shadow-xs"
                    >
                      <Plus size={13} className="stroke-[3]" />
                      <span>{isChosen ? 'Modifica Scelta' : 'Assegna Alunno'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 4. MODALE SCHERMO INTERO (LIGHTBOX) CON ASSEGNAZIONE DOCENTE */}
      {/* ========================================================================= */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-3 sm:p-6 animate-in fade-in select-none">
          
          {/* Barra Superiore Lightbox */}
          <div className="w-full max-w-6xl mx-auto flex items-center justify-between gap-4 mb-3 text-white">
            <div className="flex items-center gap-3">
              <span className="bg-yellow-300 text-black font-black text-sm md:text-base px-3 py-1.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                Immagine #{lightboxImage.number} di {activeSet.images.length}
              </span>

              {assignedToLightbox.length > 0 && (
                <span className="bg-emerald-400 text-black font-black text-xs px-3 py-1.5 rounded-xl border-2 border-black flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Users size={14} />
                  <span>Scelta da: {assignedToLightbox.join(', ')}</span>
                </span>
              )}
            </div>

            {/* Controlli di navigazione & Chiusura */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const prevId = lightboxImage.id <= 1 ? activeSet.images.length : lightboxImage.id - 1;
                  setLightboxImageId(prevId);
                }}
                className="p-2.5 bg-white text-black hover:bg-yellow-300 rounded-xl border-2 border-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                title="Immagine precedente (Freccia Sinistra)"
              >
                <ChevronLeft size={20} className="stroke-[3]" />
              </button>
              <button
                onClick={() => {
                  const nextId = lightboxImage.id >= activeSet.images.length ? 1 : lightboxImage.id + 1;
                  setLightboxImageId(nextId);
                }}
                className="p-2.5 bg-white text-black hover:bg-yellow-300 rounded-xl border-2 border-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                title="Immagine successiva (Freccia Destra)"
              >
                <ChevronRight size={20} className="stroke-[3]" />
              </button>
              <button
                onClick={() => setLightboxImageId(null)}
                className="p-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl border-2 border-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 ml-2"
                title="Chiudi visualizzazione (Esc)"
              >
                <X size={20} className="stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Area Immagine Centrale ad Alta Risoluzione */}
          <div className="flex-1 flex items-center justify-center min-h-0 relative py-2">
            <img
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              className="max-h-full max-w-full object-contain rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white"
            />
          </div>

          {/* Pannello Assegnazione Studenti in Calce */}
          <div className="w-full max-w-4xl mx-auto mt-3 bg-white p-4 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              
              {/* Sezione Alunni Assegnati a questa Foto */}
              <div className="flex-1 min-w-[280px]">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-black uppercase text-gray-700 tracking-wider flex items-center gap-1.5">
                    <Users size={14} className="text-black" />
                    <span>Studenti che hanno scelto l'immagine #{lightboxImage.number}:</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 min-h-[36px]">
                  {assignedToLightbox.length === 0 ? (
                    <span className="text-xs font-bold text-gray-400 italic">
                      Nessun alunno ha ancora scelto questa foto.
                    </span>
                  ) : (
                    assignedToLightbox.map((name, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 bg-yellow-300 text-black border-2 border-black px-2.5 py-1 rounded-xl font-black text-xs shadow-xs"
                      >
                        <span>{name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveStudent(lightboxImage.id, name)}
                          className="hover:bg-black hover:text-white rounded-full p-0.5 transition-colors"
                          title={`Rimuovi ${name}`}
                        >
                          <X size={12} className="stroke-[3]" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Form Rapido Aggiunta Studente */}
              <div className="flex items-center gap-2">
                <input
                  ref={lightboxInputRef}
                  type="text"
                  value={quickStudentInput}
                  onChange={(e) => setQuickStudentInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && quickStudentInput.trim()) {
                      e.preventDefault();
                      handleAssignStudent(lightboxImage.id, quickStudentInput);
                    }
                  }}
                  placeholder="Nome studente..."
                  className="px-3 py-2 bg-gray-50 border-2 border-black rounded-xl font-bold text-xs text-black outline-none focus:ring-2 focus:ring-yellow-400 w-48 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (quickStudentInput.trim()) {
                      handleAssignStudent(lightboxImage.id, quickStudentInput);
                    }
                  }}
                  disabled={!quickStudentInput.trim()}
                  className="px-4 py-2 bg-yellow-300 hover:bg-yellow-400 disabled:opacity-40 disabled:hover:bg-yellow-300 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1"
                >
                  <Plus size={14} className="stroke-[3]" />
                  <span>Aggiungi</span>
                </button>
              </div>
            </div>

            {/* Chip Suggerimenti Studenti già presenti nella Sessione */}
            {sessionRoster.length > 0 && (
              <div className="mt-3 pt-2.5 border-t border-gray-200 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-black uppercase text-gray-500 mr-1">
                  Aggiunta rapida da questa sessione:
                </span>
                {sessionRoster
                  .filter(name => !assignedToLightbox.includes(name))
                  .slice(0, 10)
                  .map(name => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => handleAssignStudent(lightboxImage.id, name)}
                      className="px-2 py-0.5 bg-gray-100 hover:bg-yellow-200 text-gray-800 border border-gray-400 rounded-md font-bold text-[11px] transition-colors"
                      title={`Assegna ${name} a questa immagine`}
                    >
                      + {name}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODALE RIEPILOGO SCELTE & ESPORTAZIONE */}
      {/* ========================================================================= */}
      {isSummaryOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 w-full max-w-2xl border-4 border-black max-h-[90vh] flex flex-col">
            
            <div className="flex justify-between items-center mb-5 border-b-2 border-black/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-300 border-2 border-black flex items-center justify-center shadow-xs">
                  <FileText size={20} className="text-black" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-black leading-tight">Riepilogo Scelte</h3>
                  <p className="text-xs font-bold text-gray-500">
                    Sessione: <strong className="text-black">{activeSession.name}</strong> • {chosenCount} immagini scelte • {totalStudentsAssigned} alunni
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsSummaryOpen(false)}
                className="p-2 bg-black text-white rounded-xl hover:bg-yellow-300 hover:text-black border-2 border-black transition-colors"
                title="Chiudi"
              >
                <X size={18} className="stroke-[3]" />
              </button>
            </div>

            {/* Contenuto Riepilogo Scrollabile */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
              {chosenCount === 0 ? (
                <div className="p-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                  <Users size={36} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm font-bold text-gray-500">
                    Nessuna immagine è stata ancora scelta in questa sessione.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Clicca su una foto nella griglia per assegnare gli alunni.
                  </p>
                </div>
              ) : (
                Object.keys(activeSession.assignments || {})
                  .filter(id => (activeSession.assignments[id] || []).length > 0)
                  .map(Number)
                  .sort((a, b) => a - b)
                  .map(id => {
                    const img = activeSet.images.find(im => im.id === id);
                    const students = activeSession.assignments[id] || [];

                    return (
                      <div
                        key={id}
                        className="flex items-center justify-between gap-4 p-3 bg-gray-50 rounded-xl border-2 border-black/15 hover:border-black transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {img && (
                            <img
                              src={img.src}
                              alt={img.alt}
                              className="w-14 h-10 object-cover rounded-lg border-2 border-black shadow-xs shrink-0 cursor-pointer"
                              onClick={() => {
                                setIsSummaryOpen(false);
                                setLightboxImageId(id);
                              }}
                            />
                          )}
                          <div>
                            <span className="font-black text-black text-sm block">
                              Immagine #{id}
                            </span>
                            <span className="text-xs font-bold text-gray-700">
                              {students.join(', ')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setIsSummaryOpen(false);
                              setLightboxImageId(id);
                            }}
                            className="px-2.5 py-1 text-xs font-black bg-white hover:bg-yellow-300 border-2 border-black rounded-lg transition-colors"
                            title="Visualizza immagine"
                          >
                            Mostra
                          </button>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>

            {/* Barra Azioni Riepilogo */}
            <div className="mt-6 pt-4 border-t-2 border-black/10 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold text-gray-500">
                {sessionRoster.length} studenti unici registrati
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadTxt}
                  disabled={chosenCount === 0}
                  className="px-4 py-2 bg-white hover:bg-gray-100 disabled:opacity-40 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
                >
                  <Download size={14} />
                  <span>Scarica TXT</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopySummary}
                  disabled={chosenCount === 0}
                  className="px-5 py-2 bg-yellow-300 hover:bg-yellow-400 disabled:opacity-40 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
                >
                  {copiedSummary ? <Check size={14} className="stroke-[3]" /> : <Copy size={14} />}
                  <span>{copiedSummary ? 'Copiato!' : 'Copia Riepilogo'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODALE CREA NUOVA SESSIONE */}
      {/* ========================================================================= */}
      {isNewSessionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 w-full max-w-md border-4 border-black">
            <h3 className="text-2xl font-black text-black mb-2">Nuova Sessione</h3>
            <p className="text-xs font-bold text-gray-500 mb-5">
              Crea una nuova sessione per salvare le scelte di una classe o di un gruppo specifico.
            </p>

            <div className="mb-5">
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
                Nome Sessione / Classe:
              </label>
              <input
                type="text"
                autoFocus
                value={newSessionName}
                onChange={(e) => setNewSessionName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newSessionName.trim()) {
                    handleCreateSession(newSessionName);
                  }
                }}
                placeholder="Es. Classe 3B, Gruppo A, 05/09..."
                className="w-full px-4 py-2.5 bg-white border-2 border-black rounded-xl font-bold text-sm text-black outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsNewSessionModalOpen(false)}
                className="px-4 py-2 rounded-xl font-black text-xs text-gray-700 hover:bg-gray-100 border-2 border-transparent hover:border-black transition-all"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={() => handleCreateSession(newSessionName)}
                disabled={!newSessionName.trim()}
                className="px-5 py-2 bg-yellow-300 hover:bg-yellow-400 disabled:opacity-40 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                Crea Sessione
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODALE RINOMINA SESSIONE */}
      {/* ========================================================================= */}
      {isRenameModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 w-full max-w-md border-4 border-black">
            <h3 className="text-2xl font-black text-black mb-2">Rinomina Sessione</h3>
            <p className="text-xs font-bold text-gray-500 mb-5">
              Modifica il nome assegnato a questa sessione.
            </p>

            <div className="mb-5">
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
                Nome Sessione:
              </label>
              <input
                type="text"
                autoFocus
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && renameValue.trim()) {
                    handleRenameSession();
                  }
                }}
                className="w-full px-4 py-2.5 bg-white border-2 border-black rounded-xl font-bold text-sm text-black outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  setIsRenameModalOpen(false);
                  handleDeleteSession(activeSession.id);
                }}
                className="text-xs font-black text-rose-600 hover:text-rose-800 flex items-center gap-1"
                title="Elimina definitivamente questa sessione"
              >
                <Trash2 size={13} />
                <span>Elimina sessione</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsRenameModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-black text-xs text-gray-700 hover:bg-gray-100 transition-all"
                >
                  Annulla
                </button>
                <button
                  type="button"
                  onClick={handleRenameSession}
                  disabled={!renameValue.trim()}
                  className="px-5 py-2 bg-yellow-300 hover:bg-yellow-400 disabled:opacity-40 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  Salva
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
