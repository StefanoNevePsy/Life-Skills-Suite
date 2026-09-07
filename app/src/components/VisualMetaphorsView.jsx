import { sessionLink } from '../lib/firebaseConfig';
import { newSessionCode } from '../lib/sessionCode';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ArrowLeft, ArrowRight, Search, X, Plus, Trash2, Edit, Copy, Check, 
  ChevronLeft, ChevronRight, Maximize2, Users, Sparkles, 
  Filter, Grid, LayoutGrid, Download, RefreshCw, FileText,
  SlidersHorizontal, CheckCircle2, Settings, Eye, EyeOff, Trees,
  Image as ImageIcon, Radio, QrCode, Share2, FileSpreadsheet, Globe,
  CheckCircle, Loader2
} from 'lucide-react';
import { doc, collection, setDoc, updateDoc, onSnapshot } from '../lib/sessionStore';
import FullscreenButton from './FullscreenButton';
import VisualMetaphorsManager from './VisualMetaphorsManager';
import BlobTreeView from './BlobTreeView';
import { 
  ensureVisualMetaphorsState, 
  createNewSession, 
  getSessionStudentRoster, 
  formatSessionSummaryText 
} from '../data/visualMetaphorsData';
import { 
  loadAllCustomImages, 
  hydrateVisualMetaphors, 
  getCachedImage, 
  fetchImageFromFirestore,
  ensureImageLoaded,
  resolveImageSrc,
  resolveBlobImageSrc
} from '../lib/customImageStorage';
import { getFBConfig, encodeFBConfig } from '../lib/firebaseConfig';
import { exportMetaphorImagesXLSX, exportMetaphorSummaryTXT } from '../lib/exporters';

export default function VisualMetaphorsView({ data, onUpdateData, onBack, db, user, appId }) {
  const [imageVersion, setForceUpdate] = useState(0);

  // Carica all'avvio tutte le immagini personalizzate salvate in IndexedDB
  useEffect(() => {
    let isMounted = true;
    loadAllCustomImages().then(() => {
      if (isMounted) setForceUpdate(k => k + 1);
    });
    return () => { isMounted = false; };
  }, []);

  // Stato complessivo garantito e idratato con i dati immagine ad alta risoluzione
  const vmState = useMemo(() => {
    const raw = ensureVisualMetaphorsState(data?.visual_metaphors);
    return hydrateVisualMetaphors(raw);
  }, [data, imageVersion]);

  // Assicura che le immagini custom siano caricate in memoria (IndexedDB prima, poi Cloud Firestore)
  useEffect(() => {
    if (!vmState?.sets) return;
    let cancelled = false;

    const loadMissingImages = async () => {
      let anyLoaded = false;

      // 1. Fotolinguaggio
      for (const s of vmState.sets) {
        for (const img of (s.images || [])) {
          if (img.customImageId && !getCachedImage(img.customImageId)) {
            const dataUrl = await ensureImageLoaded(img.customImageId, db, appId);
            if (dataUrl && !cancelled) {
              anyLoaded = true;
            }
          }
        }
      }

      // 2. Scenari Blob Tree
      for (const bs of (vmState.blobTree?.sets || [])) {
        if (bs.customImageId && !getCachedImage(bs.customImageId)) {
          const dataUrl = await ensureImageLoaded(bs.customImageId, db, appId);
          if (dataUrl && !cancelled) {
            anyLoaded = true;
          }
        }
      }

      if (anyLoaded && !cancelled) {
        setForceUpdate(k => k + 1);
      }
    };

    loadMissingImages();
    return () => { cancelled = true; };
  }, [db, appId, vmState]);

  const activeSet = useMemo(() => {
    return vmState.sets.find(s => s.id === vmState.activeSetId) || vmState.sets[0];
  }, [vmState]);

  const activeSession = useMemo(() => {
    return vmState.sessions.find(s => s.id === vmState.activeSessionId) || vmState.sessions[0];
  }, [vmState]);

  // Immagini visibili nel set (non nascoste)
  const visibleImages = useMemo(() => {
    return (activeSet?.images || []).filter(img => !img.hidden);
  }, [activeSet]);

  const hiddenCount = useMemo(() => {
    return (activeSet?.images || []).filter(img => img.hidden).length;
  }, [activeSet]);

  // Stati UI locali
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'chosen' | 'unchosen'
  const [gridColumns, setGridColumns] = useState(5); // 3, 4, 5, 6
  const [lightboxImageId, setLightboxImageId] = useState(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
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

  // Sezione attiva: null (Hub iniziale di selezione), 'photolanguage', 'blob_tree'
  const [selectedSection, setSelectedSection] = useState(null);

  // --- STATO SESSIONE ONLINE (FOTOLINGUAGGIO) ---
  const [onlineSessionCode, setOnlineSessionCode] = useState(null);
  const [onlineSessionData, setOnlineSessionData] = useState(null);
  const [isOnlineSetupOpen, setIsOnlineSetupOpen] = useState(false);
  const [isOnlineQrOpen, setIsOnlineQrOpen] = useState(false);
  const [onlineMaxSelections, setOnlineMaxSelections] = useState(1);
  const [onlineShowNames, setOnlineShowNames] = useState(true);
  const [onlineSetId, setOnlineSetId] = useState(vmState.activeSetId || 'etp');
  const [loadingOnline, setLoadingOnline] = useState(false);
  const [onlineQrDataUrl, setOnlineQrDataUrl] = useState('');

  // Sincronizzazione in tempo reale con Firestore per la sessione online attiva
  useEffect(() => {
    if (!db || !onlineSessionCode) return;
    const sessionRef = doc(collection(db, 'artifacts', appId, 'public', 'data', 'feedback_sessions'), onlineSessionCode);
    const unsubscribe = onSnapshot(sessionRef, (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setOnlineSessionData(d);
        if (typeof d.showNames === 'boolean') {
          setOnlineShowNames(d.showNames);
        }
      }
    });
    return () => unsubscribe();
  }, [db, onlineSessionCode, appId]);

  // Generazione URL e QR Code per gli studenti
  const cleanBaseUrl = window.location.origin + window.location.pathname;
  const fbEncoded = encodeFBConfig(getFBConfig());
  const onlineJoinUrl = onlineSessionCode ? sessionLink(onlineSessionCode) : '';

  useEffect(() => {
    if (onlineJoinUrl && typeof window.QRCode !== 'undefined') {
      window.QRCode.toDataURL(onlineJoinUrl, { width: 320, margin: 1 })
        .then(url => setOnlineQrDataUrl(url))
        .catch(() => {});
    }
  }, [onlineJoinUrl]);

  // Mappa delle scelte degli studenti nella sessione online
  const onlineParticipants = useMemo(() => {
    return Object.values(onlineSessionData?.participants || {});
  }, [onlineSessionData]);

  const onlineAssignments = useMemo(() => {
    if (!onlineSessionCode || !onlineSessionData?.participants) return {};
    const map = {};
    Object.values(onlineSessionData.participants).forEach(p => {
      const studentName = p.studentName && p.studentName.trim() ? p.studentName.trim() : 'Anonimo';
      (p.selectedImageIds || []).forEach(imgId => {
        if (!map[imgId]) map[imgId] = [];
        map[imgId].push(studentName);
      });
    });
    return map;
  }, [onlineSessionCode, onlineSessionData]);

  // Assegnazioni attive (usa quelle online se la sessione online è attiva, altrimenti la locale)
  const activeAssignments = useMemo(() => {
    return onlineSessionCode ? onlineAssignments : (activeSession?.assignments || {});
  }, [onlineSessionCode, onlineAssignments, activeSession]);

  // Avvio di una nuova sessione online
  const handleStartOnlineSession = async () => {
    if (!db) {
      alert("Configura prima Firebase nelle Impostazioni per avviare sessioni online.");
      return;
    }
    setLoadingOnline(true);
    try {
      const targetSet = vmState.sets.find(s => s.id === onlineSetId) || activeSet;
      const setImages = (targetSet?.images || []).filter(img => !img.hidden).map(img => ({
        id: img.id,
        number: img.number,
        title: img.title || `Immagine #${img.id}`,
        src: img.src,
        customImageId: img.customImageId || null
      }));

      const code = newSessionCode();
      const sessionRef = doc(collection(db, 'artifacts', appId, 'public', 'data', 'feedback_sessions'), code);

      await setDoc(sessionRef, {
        type: 'metaphor_images',
        active: true,
        createdAt: new Date().toISOString(),
        setId: targetSet.id,
        setTitle: targetSet.title,
        images: setImages,
        maxSelections: Number(onlineMaxSelections) || 1,
        showNames: onlineShowNames !== false,
        participants: {}
      });

      setOnlineSessionCode(code);
      setIsOnlineSetupOpen(false);
      setIsOnlineQrOpen(true);
    } catch (err) {
      console.error("Errore avvio sessione online fotolinguaggio:", err);
      alert("Errore durante l'avvio della sessione online.");
    } finally {
      setLoadingOnline(false);
    }
  };

  // Toggle stato aperta / chiusa
  const toggleOnlineStatus = async () => {
    if (!db || !onlineSessionCode || !onlineSessionData) return;
    try {
      const sessionRef = doc(collection(db, 'artifacts', appId, 'public', 'data', 'feedback_sessions'), onlineSessionCode);
      await updateDoc(sessionRef, { active: !onlineSessionData.active });
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle visibilità nomi in tempo reale
  const toggleOnlineShowNames = async () => {
    const nextVal = !onlineShowNames;
    setOnlineShowNames(nextVal);
    if (db && onlineSessionCode) {
      try {
        const sessionRef = doc(collection(db, 'artifacts', appId, 'public', 'data', 'feedback_sessions'), onlineSessionCode);
        await updateDoc(sessionRef, { showNames: nextVal });
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Termina sessione online
  const handleEndOnlineSession = () => {
    if (!onlineSessionCode) return;
    const count = onlineParticipants.length;
    if (count > 0) {
      const doImport = window.confirm(
        `La sessione online ha registrato le scelte di ${count} ${count === 1 ? 'studente' : 'studenti'}.\n\nVuoi importare queste scelte nella sessione locale "${activeSession?.name || 'Corrente'}" prima di chiudere?`
      );
      if (doImport && activeSession) {
        updateVmState(prev => {
          const current = { ...(activeSession.assignments || {}) };
          Object.entries(onlineAssignments).forEach(([imgId, names]) => {
            const existing = current[imgId] || [];
            const merged = Array.from(new Set([...existing, ...names]));
            current[imgId] = merged;
          });
          return {
            ...prev,
            sessions: prev.sessions.map(s => s.id === activeSession.id ? { ...s, assignments: current } : s)
          };
        });
      }
    }
    setOnlineSessionCode(null);
    setOnlineSessionData(null);
  };

  // Download TXT Sessione Online
  const handleDownloadOnlineTxt = () => {
    if (!onlineSessionData) return;
    let txt = `====================================================\n`;
    txt += `LIFESKILLS SUITE • METAFORE VISIVE (FOTOLINGUAGGIO)\n`;
    txt += `Sessione Online: ${onlineSessionCode}\n`;
    txt += `Set: ${onlineSessionData.setTitle || onlineSessionData.setId}\n`;
    txt += `Max scelte per studente: ${onlineSessionData.maxSelections || 1}\n`;
    txt += `Partecipanti: ${onlineParticipants.length}\n`;
    txt += `Data: ${new Date().toLocaleString('it-IT')}\n`;
    txt += `====================================================\n\n`;

    onlineParticipants.forEach((p, idx) => {
      const name = onlineShowNames ? p.studentName : `Studente ${idx + 1}`;
      const picks = (p.selectedImageIds || []).map(id => `#${id}`).join(', ');
      txt += `${idx + 1}. ${name} -> Immagini: ${picks || 'Nessuna'}\n`;
    });

    exportMetaphorSummaryTXT(txt, `fotolinguaggio_${onlineSessionCode}.txt`);
  };

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
    if (!lightboxImageId) return [];
    return activeAssignments[lightboxImageId] || [];
  }, [lightboxImageId, activeAssignments]);

  // Helper navigazione tra immagini visibili nel Lightbox
  const handlePrevLightboxImage = () => {
    const list = visibleImages.length > 0 ? visibleImages : (activeSet?.images || []);
    if (list.length === 0) return;
    const curIdx = list.findIndex(i => i.id === lightboxImageId);
    if (curIdx >= 0) {
      const prevIdx = curIdx <= 0 ? list.length - 1 : curIdx - 1;
      setLightboxImageId(list[prevIdx].id);
    }
  };

  const handleNextLightboxImage = () => {
    const list = visibleImages.length > 0 ? visibleImages : (activeSet?.images || []);
    if (list.length === 0) return;
    const curIdx = list.findIndex(i => i.id === lightboxImageId);
    if (curIdx >= 0) {
      const nextIdx = curIdx >= list.length - 1 ? 0 : curIdx + 1;
      setLightboxImageId(list[nextIdx].id);
    }
  };

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
        handleNextLightboxImage();
      } else if (e.key === 'ArrowLeft') {
        handlePrevLightboxImage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImageId, activeSet, visibleImages]);

  // Immagini filtrate per la classe (esclude automaticamente quelle nascoste)
  const filteredImages = useMemo(() => {
    if (!activeSet?.images) return [];
    const query = searchQuery.trim().toLowerCase();
    const assignments = activeAssignments;

    return activeSet.images.filter(img => {
      // Non mostrare le immagini nascoste dal docente
      if (img.hidden) return false;

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
  }, [activeSet, activeAssignments, searchQuery, filterMode]);

  // Conteggi globali
  const chosenCount = useMemo(() => {
    const assignments = activeAssignments;
    return Object.keys(assignments).filter(id => (assignments[id] || []).length > 0).length;
  }, [activeAssignments]);

  const totalStudentsAssigned = useMemo(() => {
    const assignments = activeAssignments;
    return Object.values(assignments).reduce((acc, arr) => acc + (arr?.length || 0), 0);
  }, [activeAssignments]);

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

  // -------------------------------------------------------------------------
  // 1. SCHERMATA HUB INIZIALE DI SELEZIONE: DIVISA TRA FOTOLINGUAGGIO E BLOB TREES
  // -------------------------------------------------------------------------
  if (!selectedSection) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] p-4 sm:p-8 md:p-12 font-sans selection:bg-yellow-200 flex flex-col">
        {/* Barra Superiore: Torna alla Dashboard */}
        <div className="max-w-5xl mx-auto w-full mb-8 flex items-center justify-between">
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 font-black text-sm text-black bg-white hover:bg-yellow-300 px-4 py-2.5 rounded-2xl border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <ArrowLeft size={18} />
            <span>Dashboard</span>
          </button>

          <div className="flex items-center gap-2 bg-indigo-100 border-3 border-black px-4 py-2 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Sparkles size={18} className="text-indigo-700" />
            <span className="font-black text-xs uppercase tracking-wider text-indigo-950">Metafore Visive</span>
          </div>
        </div>

        {/* Hero Hub Neo-Brutalista */}
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center text-center my-auto py-4">
          <div className="bg-indigo-300 p-5 rounded-3xl mb-4 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95">
            <Sparkles size={48} className="text-black stroke-[2.5]" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-black mb-3 text-black tracking-tight">
            Metafore Visive &amp; Proiezioni
          </h1>
          <p className="text-gray-700 font-bold mb-10 max-w-2xl text-sm sm:text-base leading-relaxed">
            Scegli lo strumento visivo per facilitare l'espressione, la consapevolezza emotiva e la narrazione di sé nel gruppo classe.
          </p>

          {/* Due Grandi Carte di Scelta Neo-Brutaliste */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full text-left">
            
            {/* CARTA 1: FOTOLINGUAGGIO */}
            <div 
              onClick={() => setSelectedSection('photolanguage')}
              className="bg-yellow-50 hover:bg-yellow-100/90 rounded-3xl border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-black text-yellow-300 flex items-center justify-center border-2 border-black shadow-xs group-hover:scale-105 transition-transform">
                    <ImageIcon size={30} className="stroke-[2.5]" />
                  </div>
                  <span className="bg-yellow-300 border-2 border-black font-black text-[11px] uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                    Set Multipli
                  </span>
                </div>

                <h3 className="text-2xl font-black text-black mb-2 group-hover:text-yellow-950 transition-colors">
                  Fotolinguaggio
                </h3>
                <p className="text-gray-700 font-bold text-xs sm:text-sm leading-relaxed mb-6">
                  Collezione di fotografie simboliche ed evocative. Ogni alunno sceglie le immagini che meglio esprimono le proprie emozioni o vissuti e ne condivide il significato.
                </p>

                <div className="space-y-2.5 mb-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                    <span className="text-base">📸</span>
                    <span>Set ETP d'autore + set personalizzati</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                    <span className="text-base">🏷️</span>
                    <span>Assegnazione studenti &amp; note per immagine</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                    <span className="text-base">📊</span>
                    <span>Riepilogo scelte ed esportazione classe</span>
                  </div>
                </div>
              </div>

              <div className="w-full py-3.5 bg-yellow-300 group-hover:bg-yellow-400 text-black border-2 border-black rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 transition-colors">
                <span>Entra in Fotolinguaggio</span>
                <ArrowRight size={16} className="stroke-[3]" />
              </div>
            </div>

            {/* CARTA 2: BLOB TREES */}
            <div 
              onClick={() => setSelectedSection('blob_tree')}
              className="bg-emerald-50 hover:bg-emerald-100/90 rounded-3xl border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-black text-emerald-300 flex items-center justify-center border-2 border-black shadow-xs group-hover:scale-105 transition-transform">
                    <Trees size={30} className="stroke-[2.5]" />
                  </div>
                  <span className="bg-emerald-300 border-2 border-black font-black text-[11px] uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                    Interattivo &amp; LIM
                  </span>
                </div>

                <h3 className="text-2xl font-black text-black mb-2 group-hover:text-emerald-950 transition-colors">
                  Blob Trees
                </h3>
                <p className="text-gray-700 font-bold text-xs sm:text-sm leading-relaxed mb-6">
                  Illustrazioni simboliche con omini (Blob Figures). Proietta l'albero a tutto schermo, clicca sui personaggi e posiziona i pin per mappare dove si identifica ciascun alunno.
                </p>

                <div className="space-y-2.5 mb-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                    <span className="text-base">🌳</span>
                    <span>Albero classico, percorsi in salita e scenari custom</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                    <span className="text-base">📍</span>
                    <span>Pin interattivi con drag &amp; drop e appunti</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                    <span className="text-base">🖥️</span>
                    <span>Tutto schermo LIM per landscape e illustrazioni verticali</span>
                  </div>
                </div>
              </div>

              <div className="w-full py-3.5 bg-emerald-300 group-hover:bg-emerald-400 text-black border-2 border-black rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 transition-colors">
                <span>Entra nei Blob Trees</span>
                <ArrowRight size={16} className="stroke-[3]" />
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // 2. BLOB TREES SUB-VIEW
  // -------------------------------------------------------------------------
  if (selectedSection === 'blob_tree') {
    return (
      <BlobTreeView
        vmState={vmState}
        onUpdateVmState={updateVmState}
        onBack={() => setSelectedSection(null)}
        onBackToDashboard={onBack}
        db={db}
        user={user}
        appId={appId}
      />
    );
  }

  // -------------------------------------------------------------------------
  // 3. FOTOLINGUAGGIO SUB-VIEW
  // -------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#FDFBF7] p-3 sm:p-6 font-sans selection:bg-yellow-200 flex flex-col">
      
      {/* ========================================================================= */}
      {/* 1. BARRA SUPERIORE DI CONTROLLO & CATTEDRA (FOTOLINGUAGGIO) */}
      {/* ========================================================================= */}
      <nav className="max-w-7xl mx-auto w-full mb-6 flex flex-wrap items-center justify-between gap-4">
        {/* Sinistra: Torna alle Metafore Visive o Dashboard */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button 
            onClick={() => setSelectedSection(null)} 
            className="flex items-center gap-2 font-black text-sm text-black bg-white hover:bg-yellow-300 px-4 py-2.5 rounded-2xl border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            title="Torna alla scelta delle attività di Metafore Visive"
          >
            <ArrowLeft size={18} />
            <span>Metafore Visive</span>
          </button>

          <button 
            onClick={onBack} 
            className="font-bold text-xs text-gray-600 hover:text-black hover:bg-gray-100 px-3 py-2 rounded-xl border-2 border-black/20 hover:border-black transition-all cursor-pointer hidden sm:inline-block"
            title="Torna alla Dashboard principale"
          >
            Dashboard
          </button>

          <div className="flex items-center gap-2 bg-yellow-100 border-3 border-black px-3.5 py-2 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <ImageIcon size={18} className="text-yellow-900" />
            <span className="font-black text-xs uppercase tracking-wider text-yellow-950">Fotolinguaggio</span>
          </div>

          <button
            type="button"
            onClick={() => setSelectedSection('blob_tree')}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-emerald-100 text-gray-700 hover:text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            title="Passa all'attività Blob Trees"
          >
            <Trees size={14} className="text-emerald-700" />
            <span className="hidden md:inline">Passa a</span>
            <span>Blob Trees →</span>
          </button>
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

          {/* Pulsante Gestisci Set */}
          <button
            type="button"
            onClick={() => setIsManagerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-yellow-300 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            title="Gestisci i set di immagini, carica nuove foto o nascondi immagini"
          >
            <Settings size={14} />
            <span className="hidden sm:inline">Gestisci Set</span>
          </button>

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

          {/* Pulsante Sessione Online Live */}
          <button
            type="button"
            onClick={() => {
              if (!db) {
                alert("Per creare sessioni online con gli studenti, connetti prima Firebase nelle Impostazioni (icona ingranaggio nella barra della Dashboard).");
                return;
              }
              if (onlineSessionCode) {
                setIsOnlineQrOpen(true);
              } else {
                setOnlineSetId(vmState.activeSetId || 'etp');
                setIsOnlineSetupOpen(true);
              }
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer ${
              onlineSessionCode
                ? 'bg-emerald-400 text-black animate-pulse'
                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
            }`}
            title="Avvia una sessione online per far scegliere le immagini agli studenti dal proprio smartphone"
          >
            <Radio size={14} className={onlineSessionCode ? 'text-black' : 'text-emerald-700'} />
            <span>{onlineSessionCode ? `Live: ${onlineSessionCode}` : 'Sessione Online'}</span>
          </button>

          {/* Schermo Intero */}
          <FullscreenButton className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-xl" />
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* BANNER SESSIONE ONLINE FOTOLINGUAGGIO ATTIVA */}
      {/* ========================================================================= */}
      {onlineSessionCode && (
        <section className="max-w-7xl mx-auto w-full mb-6 bg-white/95 backdrop-blur-sm p-4 rounded-3xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-top-3">
          <div className="flex flex-wrap items-center justify-between gap-3">

            {/* GRUPPO 1: CODICE STANZA & STATO */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div
                onClick={() => {
                  navigator.clipboard.writeText(onlineSessionCode);
                  alert(`Codice stanza ${onlineSessionCode} copiato negli appunti!`);
                }}
                className="bg-black text-yellow-300 px-3.5 py-1.5 rounded-xl font-mono font-black text-lg tracking-wider cursor-pointer hover:scale-105 transition-transform flex items-center gap-2 shadow-sm"
                title="Clicca per copiare il codice stanza"
              >
                <Radio size={16} className="text-yellow-400 animate-pulse" />
                <span>{onlineSessionCode}</span>
                <Copy size={13} className="opacity-60 hover:opacity-100" />
              </div>

              {/* STATO APERTA / CHIUSA */}
              <button
                type="button"
                onClick={toggleOnlineStatus}
                className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 border-2 transition-all cursor-pointer ${
                  onlineSessionData?.active
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                    : 'bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200'
                }`}
                title="Clicca per aprire o chiudere la ricezione delle scelte"
              >
                <span className={`w-2 h-2 rounded-full ${onlineSessionData?.active ? 'bg-emerald-600 animate-ping' : 'bg-rose-600'}`} />
                <span>{onlineSessionData?.active ? 'APERTA' : 'CHIUSA'}</span>
              </button>

              {/* CONTATORE PARTECIPANTI ONLINE */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 border-2 border-black rounded-xl font-black text-xs text-yellow-950">
                <Users size={14} className="text-yellow-800" />
                <span>{onlineParticipants.length} {onlineParticipants.length === 1 ? 'partecipante' : 'partecipanti'}</span>
              </div>

              <div className="text-[11px] font-bold text-gray-500 hidden md:inline">
                Max: {onlineSessionData?.maxSelections || 1} {Number(onlineSessionData?.maxSelections) === 1 ? 'foto' : 'foto'} a testa
              </div>
            </div>

            {/* GRUPPO 2: AZIONI (TOGGLE NOMI, QR LIM, ESPORTA, TERMINA) */}
            <div className="flex items-center gap-2 flex-wrap">

              {/* TOGGLE MOSTRA / NASCONDI NOMI */}
              <button
                type="button"
                onClick={toggleOnlineShowNames}
                className={`px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider border-2 border-black flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer ${
                  onlineShowNames
                    ? 'bg-white hover:bg-gray-100 text-black'
                    : 'bg-amber-300 text-black ring-2 ring-black'
                }`}
                title={onlineShowNames ? "Nascondi i nomi degli studenti alla lavagna per garantire l'anonimato" : "Mostra i nomi degli studenti alla lavagna"}
              >
                {onlineShowNames ? <Eye size={14} /> : <EyeOff size={14} />}
                <span>{onlineShowNames ? 'Nomi Visibili' : 'Nomi Anonimi'}</span>
              </button>

              {/* PULSANTE QR CODE LIM */}
              <button
                type="button"
                onClick={() => setIsOnlineQrOpen(true)}
                className="px-3 py-1.5 bg-yellow-300 hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Mostra QR Code a tutto schermo per gli studenti"
              >
                <QrCode size={14} />
                <span>QR Code LIM</span>
              </button>

              {/* ESPORTAZIONE XLSX */}
              <button
                type="button"
                onClick={() => exportMetaphorImagesXLSX(onlineSessionData || {}, onlineSessionCode, onlineShowNames)}
                className="px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-900 font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Esporta foglio Excel con l'elenco delle scelte e partecipanti"
              >
                <FileSpreadsheet size={14} className="text-emerald-700" />
                <span>Excel (XLSX)</span>
              </button>

              {/* ESPORTAZIONE TXT */}
              <button
                type="button"
                onClick={handleDownloadOnlineTxt}
                className="px-3 py-1.5 bg-white hover:bg-gray-100 text-black font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Scarica riepilogo in formato testo semplice"
              >
                <Download size={14} />
                <span>TXT</span>
              </button>

              {/* TERMINA SESSIONE ONLINE */}
              <button
                type="button"
                onClick={handleEndOnlineSession}
                className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-black text-xs uppercase tracking-wider rounded-xl border-2 border-rose-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1 cursor-pointer"
                title="Chiudi definitivamente questa sessione online"
              >
                <X size={14} />
                <span>Termina</span>
              </button>

            </div>

          </div>
        </section>
      )}
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
          <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl border-2 border-black flex-wrap">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                filterMode === 'all'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              Tutte ({visibleImages.length})
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
              Non scelte ({Math.max(0, visibleImages.length - chosenCount)})
            </button>

            {/* Badge Foto Nascoste se presenti nel set */}
            {hiddenCount > 0 && (
              <button
                type="button"
                onClick={() => setIsManagerOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-400 rounded-lg font-black text-xs shadow-xs active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                title="Alcune immagini sono nascoste alla classe. Clicca per gestirle nel pannello set."
              >
                <EyeOff size={13} className="text-amber-700" />
                <span>{hiddenCount} {hiddenCount === 1 ? 'nascosta' : 'nascoste'}</span>
              </button>
            )}
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
              const assignedStudents = activeAssignments[img.id] || [];
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
                      src={resolveImageSrc(img)}
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
                        {(!onlineSessionCode || onlineShowNames) ? (
                          <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto custom-scrollbar">
                            {assignedStudents.map((name, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 bg-yellow-200 text-black border border-black px-2 py-0.5 rounded-md font-black text-[11px] leading-tight"
                              >
                                <span>{name}</span>
                                {!onlineSessionCode && (
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
                                )}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-amber-100/70 border border-amber-300 rounded-lg p-1.5 text-center">
                            <span className="text-[11px] font-black text-amber-900 flex items-center justify-center gap-1">
                              <EyeOff size={12} />
                              <span>{assignedStudents.length} {assignedStudents.length === 1 ? 'scelta' : 'scelte'} (Anonimo)</span>
                            </span>
                          </div>
                        )}
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
                      className="w-full py-1.5 px-2 rounded-xl text-[11px] font-black uppercase tracking-wider bg-white hover:bg-yellow-300 text-black border-2 border-black transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Plus size={13} className="stroke-[3]" />
                      <span>{onlineSessionCode ? 'Dettaglio Scelte' : (isChosen ? 'Modifica Scelta' : 'Assegna Alunno')}</span>
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
                Immagine #{lightboxImage.number} {visibleImages.length > 0 ? `(${visibleImages.findIndex(i => i.id === lightboxImage.id) + 1} di ${visibleImages.length})` : ''}
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
                type="button"
                onClick={handlePrevLightboxImage}
                className="p-2.5 bg-white text-black hover:bg-yellow-300 rounded-xl border-2 border-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                title="Immagine precedente (Freccia Sinistra)"
              >
                <ChevronLeft size={20} className="stroke-[3]" />
              </button>
              <button
                type="button"
                onClick={handleNextLightboxImage}
                className="p-2.5 bg-white text-black hover:bg-yellow-300 rounded-xl border-2 border-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
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
              src={resolveImageSrc(lightboxImage)}
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
                  ) : onlineSessionCode && !onlineShowNames ? (
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-100 border-2 border-amber-300 text-amber-900 px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5">
                        <EyeOff size={14} />
                        <span>{assignedToLightbox.length} {assignedToLightbox.length === 1 ? 'studente' : 'studenti'} (Nomi anonimi)</span>
                      </span>
                      <button
                        type="button"
                        onClick={toggleOnlineShowNames}
                        className="text-xs font-black underline text-black hover:text-amber-800 cursor-pointer"
                      >
                        Svela Nomi
                      </button>
                    </div>
                  ) : (
                    assignedToLightbox.map((name, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 bg-yellow-300 text-black border-2 border-black px-2.5 py-1 rounded-xl font-black text-xs shadow-xs"
                      >
                        <span>{name}</span>
                        {!onlineSessionCode && (
                          <button
                            type="button"
                            onClick={() => handleRemoveStudent(lightboxImage.id, name)}
                            className="hover:bg-black hover:text-white rounded-full p-0.5 transition-colors cursor-pointer"
                            title={`Rimuovi ${name}`}
                          >
                            <X size={12} className="stroke-[3]" />
                          </button>
                        )}
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
                              src={resolveImageSrc(img)}
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

      {/* ========================================================================= */}
      {/* 8. MODALE GESTIONE SET & FOTOLINGUAGGIO */}
      {/* ========================================================================= */}
      {isManagerOpen && (
        <VisualMetaphorsManager
          vmState={vmState}
          onUpdateVmState={updateVmState}
          onClose={() => setIsManagerOpen(false)}
          db={db}
          user={user}
          appId={appId}
        />
      )}

      {/* ========================================================================= */}
      {/* 9. MODALE CONFIGURAZIONE AVVIO SESSIONE ONLINE FOTOLINGUAGGIO */}
      {/* ========================================================================= */}
      {isOnlineSetupOpen && (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
              <div className="flex items-center gap-2">
                <Radio size={22} className="text-emerald-600" />
                <h3 className="text-base font-black uppercase text-black">Avvia Sessione Online</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOnlineSetupOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg text-black cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs font-bold text-gray-600 mb-4">
              I ragazzi potranno collegarsi dal proprio smartphone per scegliere autonomamente la propria immagine.
            </p>

            {/* SCELTA SET */}
            <div className="mb-4">
              <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1.5">
                Set di Immagini da Utilizzare:
              </label>
              <select
                value={onlineSetId}
                onChange={(e) => setOnlineSetId(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border-2 border-black rounded-xl font-bold text-xs text-black outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer"
              >
                {vmState.sets.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.count} foto)
                  </option>
                ))}
              </select>
            </div>

            {/* SCELTA MASSIMA SELEZIONI PER STUDENTE */}
            <div className="mb-4">
              <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1.5">
                Quante immagini può scegliere al massimo ciascun ragazzo?
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setOnlineMaxSelections(n)}
                    className={`flex-1 py-2 rounded-xl border-2 border-black font-black text-xs transition-all cursor-pointer ${
                      onlineMaxSelections === n
                        ? 'bg-yellow-300 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] scale-105'
                        : 'bg-white hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <p className="text-[11px] font-bold text-gray-400 mt-1">
                {onlineMaxSelections === 1
                  ? 'Ogni studente sceglierà 1 sola immagine.'
                  : `Ogni studente potrà scegliere fino a ${onlineMaxSelections} immagini.`}
              </p>
            </div>

            {/* TOGGLE VISIBILITÀ NOMI */}
            <div className="mb-6 p-3.5 bg-yellow-50 border-2 border-black rounded-2xl flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-black uppercase text-black block">Mostra Nomi alla Lavagna</span>
                <span className="text-[11px] font-bold text-gray-600 block">
                  {onlineShowNames
                    ? 'I nomi degli alunni saranno visibili sulle immagini.'
                    : 'Le immagini mostreranno solo il conteggio anonimo.'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOnlineShowNames(!onlineShowNames)}
                className={`px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs uppercase tracking-wider cursor-pointer transition-all ${
                  onlineShowNames
                    ? 'bg-emerald-300 text-black'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {onlineShowNames ? 'Sì (Visibili)' : 'No (Anonimi)'}
              </button>
            </div>

            {/* AZIONI */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsOnlineSetupOpen(false)}
                className="flex-1 py-2.5 rounded-xl border-2 border-black font-black text-xs text-gray-700 hover:bg-gray-100 uppercase tracking-wider cursor-pointer"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={handleStartOnlineSession}
                disabled={loadingOnline}
                className="flex-2 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {loadingOnline ? <Loader2 size={16} className="animate-spin" /> : <Radio size={16} />}
                <span>Avvia Ora</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. MODALE QR CODE LIM & LINK DI CONDIVISIONE */}
      {/* ========================================================================= */}
      {isOnlineQrOpen && (
        <div className="fixed inset-0 z-[75] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 text-center">

            <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
              <div className="flex items-center gap-2">
                <QrCode size={22} className="text-black" />
                <h3 className="text-base font-black uppercase text-black">Connettiti al Fotolinguaggio</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOnlineQrOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg text-black cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* CODICE STANZA GIGANTE */}
            <div className="mb-4">
              <span className="text-xs font-black uppercase tracking-wider text-gray-500 block mb-1">
                Codice Stanza per gli Studenti:
              </span>
              <div
                onClick={() => {
                  navigator.clipboard.writeText(onlineSessionCode);
                  alert(`Codice stanza ${onlineSessionCode} copiato!`);
                }}
                className="inline-block bg-black text-yellow-300 font-mono font-black text-4xl sm:text-5xl px-8 py-3 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] tracking-widest cursor-pointer hover:scale-105 transition-transform"
                title="Clicca per copiare"
              >
                {onlineSessionCode}
              </div>
            </div>

            {/* IMMAGINE QR CODE */}
            <div className="bg-yellow-50 border-3 border-black rounded-2xl p-4 inline-block mx-auto mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              {onlineQrDataUrl ? (
                <img
                  src={onlineQrDataUrl}
                  alt={`QR Code stanza ${onlineSessionCode}`}
                  className="w-56 h-56 sm:w-64 sm:h-64 object-contain mx-auto rounded-lg"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center">
                  <Loader2 size={32} className="animate-spin text-yellow-600" />
                </div>
              )}
            </div>

            <p className="text-xs font-bold text-gray-600 mb-4">
              Inquadra con lo smartphone o inserisci il codice nella schermata iniziale.
            </p>

            {/* COPIA LINK DIRETTO */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(onlineJoinUrl);
                  alert("Link diretto copiato negli appunti!");
                }}
                className="flex-1 py-3 bg-white hover:bg-gray-100 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy size={14} />
                <span>Copia Link Diretto</span>
              </button>

              <button
                type="button"
                onClick={() => setIsOnlineQrOpen(false)}
                className="py-3 px-6 bg-yellow-400 hover:bg-yellow-500 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
              >
                Chiudi
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
