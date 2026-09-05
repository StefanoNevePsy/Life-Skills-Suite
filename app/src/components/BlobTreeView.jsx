import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, ArrowRight, Users, Plus, X, Edit2, Trash2, Copy, Check, 
  Download, RefreshCw, ZoomIn, ZoomOut, Maximize2, Minimize2, Move, 
  MapPin, Search, Settings, Sparkles, CheckCircle2, 
  SlidersHorizontal, ChevronDown, ChevronUp, Image as ImageIcon,
  Upload, Tag, MessageSquare, ArrowLeftRight, ArrowUpDown, LayoutGrid, Trees
} from 'lucide-react';
import FullscreenButton from './FullscreenButton';
import { 
  createNewBlobSession, 
  createBlobTreeSet, 
  duplicateBlobTreeSet, 
  renameBlobTreeSet, 
  deleteBlobTreeSet, 
  addBlobMarker, 
  updateBlobMarker, 
  removeBlobMarker, 
  resetBlobSessionMarkers, 
  getBlobSessionStudentRoster, 
  formatBlobSessionSummaryText 
} from '../data/visualMetaphorsData';
import { 
  saveCustomImage, 
  getCachedImage, 
  createThumbnail,
  resolveBlobImageSrc,
  syncImageToFirestore
} from '../lib/customImageStorage';

// Palette colori neo-brutalisti per i segnaposto
const MARKER_COLORS = [
  { id: 'yellow', hex: '#FACC15', label: 'Giallo', text: '#000000' },
  { id: 'cyan', hex: '#22D3EE', label: 'Azzurro', text: '#000000' },
  { id: 'emerald', hex: '#34D399', label: 'Verde', text: '#000000' },
  { id: 'pink', hex: '#F472B6', label: 'Rosa', text: '#000000' },
  { id: 'purple', hex: '#C084FC', label: 'Lilla', text: '#000000' },
  { id: 'orange', hex: '#FB923C', label: 'Arancione', text: '#000000' },
  { id: 'blue', hex: '#60A5FA', label: 'Blu', text: '#000000' },
  { id: 'coral', hex: '#F87171', label: 'Corallo', text: '#000000' },
];

export default function BlobTreeView({
  vmState,
  onUpdateVmState,
  onBack,
  onBackToDashboard,
  db,
  user,
  appId
}) {
  const blobData = vmState?.blobTree || {};
  const sets = blobData.sets || [];
  const sessions = blobData.sessions || [];

  // Set e sessione correnti
  const activeSet = useMemo(() => {
    return sets.find(s => s.id === blobData.activeSetId) || sets[0];
  }, [sets, blobData.activeSetId]);

  const activeSession = useMemo(() => {
    return sessions.find(s => s.id === blobData.activeSessionId) || sessions[0];
  }, [sessions, blobData.activeSessionId]);

  const markers = activeSession?.markers || [];
  const sessionRoster = useMemo(() => getBlobSessionStudentRoster(activeSession), [activeSession]);

  // Stati UI locali
  const [zoomLevel, setZoomLevel] = useState(1); // 0.5 a 3.0
  const [isCompactView, setIsCompactView] = useState(false);
  const [isPlacementMode, setIsPlacementMode] = useState(true);
  const [searchHighlight, setSearchHighlight] = useState('');
  const [hoveredMarkerId, setHoveredMarkerId] = useState(null);
  const [isRosterOpen, setIsRosterOpen] = useState(true);

  // Modalità di adattamento immagine:
  // 'contain': adatta tutta l'immagine allo schermo (visibile al 100% senza scroll)
  // 'width': adatta alla larghezza (ideale per alberi verticali alti con scroll verticale)
  // 'height': adatta all'altezza (ideale per scenari panoramici landscape con scroll orizzontale)
  const [fitMode, setFitMode] = useState('contain');

  // Metadati proporzioni immagine
  const [imageMeta, setImageMeta] = useState({ width: 0, height: 0, ratio: 1 });

  // Modalità Tutto Schermo / LIM dedicata
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);

  // Riferimento container scrollabile per pan
  const scrollViewportRef = useRef(null);

  // Pan con mouse in modalità esplora
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0, container: null });

  const handleImageLoad = (e) => {
    const img = e.target;
    const w = img.naturalWidth || 1;
    const h = img.naturalHeight || 1;
    setImageMeta({ width: w, height: h, ratio: w / h });
  };

  const toggleFullscreen = () => {
    if (!isFullscreenMode) {
      setIsFullscreenMode(true);
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      setIsFullscreenMode(false);
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      if (!document.fullscreenElement && isFullscreenMode) {
        setIsFullscreenMode(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreenMode) {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
        setIsFullscreenMode(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreenMode]);

  const aspectInfo = useMemo(() => {
    if (!imageMeta.width || !imageMeta.height) return null;
    if (imageMeta.ratio < 0.8) {
      return {
        type: 'vertical',
        label: 'Verticale',
        badge: '↕️ Immagine Verticale',
        hint: 'Illustrazione sviluppata in altezza. "Larghezza" permette di ingrandirla e scorrere in verticale, mentre "Intera" la mostra tutta.'
      };
    }
    if (imageMeta.ratio > 1.3) {
      return {
        type: 'landscape',
        label: 'Panoramica',
        badge: '↔️ Immagine Landscape',
        hint: 'Illustrazione sviluppata in larghezza. "Altezza" permette di ingrandire e scorrere orizzontalmente, mentre "Intera" la mostra tutta.'
      };
    }
    return {
      type: 'square',
      label: 'Standard',
      badge: '🔲 Proporzionata',
      hint: 'Formato classico.'
    };
  }, [imageMeta]);

  // Gestione Pan tramite mouse in modalità Esplora
  const handleContainerMouseDown = (e) => {
    if (isPlacementMode || draggingMarkerId) return;
    if (e.target.closest('.blob-marker') || e.target.closest('button') || e.target.closest('input')) return;
    const targetEl = e.currentTarget;
    setIsPanning(true);
    panStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      scrollLeft: targetEl.scrollLeft,
      scrollTop: targetEl.scrollTop,
      container: targetEl
    };
  };

  const handleContainerMouseMove = (e) => {
    if (isPanning && panStartRef.current.container) {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      panStartRef.current.container.scrollLeft = panStartRef.current.scrollLeft - dx;
      panStartRef.current.container.scrollTop = panStartRef.current.scrollTop - dy;
    }
  };

  const handleContainerMouseUp = () => {
    if (isPanning) setIsPanning(false);
  };

  // Modali
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isSetManagerOpen, setIsSetManagerOpen] = useState(false);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Stato inserimento nuovo pin (quando si clicca sull'immagine)
  const [pendingPlacement, setPendingPlacement] = useState(null); // { x, y }
  const [newStudentName, setNewStudentName] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newColor, setNewColor] = useState(MARKER_COLORS[0].hex);

  // Stato modifica marker esistente
  const [editingMarker, setEditingMarker] = useState(null); // marker object

  // Dragging marker
  const [draggingMarkerId, setDraggingMarkerId] = useState(null);
  const imageContainerRef = useRef(null);
  const imageRef = useRef(null);

  // Helper aggiornamento stato
  const updateState = (updater) => {
    onUpdateVmState(updater);
  };

  // Switch Set
  const handleSelectSet = (setId) => {
    updateState(prev => ({
      ...prev,
      blobTree: {
        ...prev.blobTree,
        activeSetId: setId
      }
    }));
  };

  // Switch Sessione
  const handleSelectSession = (sessId) => {
    updateState(prev => ({
      ...prev,
      blobTree: {
        ...prev.blobTree,
        activeSessionId: sessId
      }
    }));
  };

  // Creazione nuova sessione
  const handleCreateSession = () => {
    const trimmed = newSessionName.trim();
    const newSess = createNewBlobSession(trimmed, sessions);
    updateState(prev => ({
      ...prev,
      blobTree: {
        ...prev.blobTree,
        sessions: [newSess, ...prev.blobTree.sessions],
        activeSessionId: newSess.id
      }
    }));
    setIsNewSessionModalOpen(false);
    setNewSessionName('');
  };

  // Rinomina sessione
  const handleRenameSession = () => {
    const trimmed = renameValue.trim();
    if (!trimmed || !activeSession) return;
    updateState(prev => ({
      ...prev,
      blobTree: {
        ...prev.blobTree,
        sessions: prev.blobTree.sessions.map(s => s.id === activeSession.id ? { ...s, name: trimmed } : s)
      }
    }));
    setIsRenameModalOpen(false);
    setRenameValue('');
  };

  // Reset marker sessione
  const handleResetSession = () => {
    if (!activeSession) return;
    if (!window.confirm(`Vuoi azzerare tutte le posizioni degli alunni per la sessione "${activeSession.name}"?`)) {
      return;
    }
    updateState(prev => resetBlobSessionMarkers(prev, activeSession.id));
  };

  // Click sull'immagine per posizionare un marker
  const handleImageClick = (e) => {
    if (!isPlacementMode || draggingMarkerId) return;
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (clickX < 0 || clickX > rect.width || clickY < 0 || clickY > rect.height) return;

    const xPercent = (clickX / rect.width) * 100;
    const yPercent = (clickY / rect.height) * 100;

    // Suggerisci un colore a rotazione in base a quanti marker ci sono
    const nextColor = MARKER_COLORS[markers.length % MARKER_COLORS.length].hex;
    setNewColor(nextColor);
    setNewStudentName('');
    setNewNote('');
    setPendingPlacement({ x: xPercent, y: yPercent });
  };

  // Conferma nuovo marker
  const handleConfirmPlacement = () => {
    if (!pendingPlacement || !activeSession) return;
    const trimmedName = newStudentName.trim();
    if (!trimmedName) {
      alert("Inserisci il nome dell'alunno o un'identificazione.");
      return;
    }

    updateState(prev => addBlobMarker(prev, activeSession.id, {
      x: pendingPlacement.x,
      y: pendingPlacement.y,
      studentName: trimmedName,
      note: newNote,
      color: newColor
    }));

    setPendingPlacement(null);
    setNewStudentName('');
    setNewNote('');
  };

  // Salvataggio modifica marker
  const handleSaveMarkerEdit = () => {
    if (!editingMarker || !activeSession) return;
    const trimmed = editingMarker.studentName?.trim();
    if (!trimmed) return;

    updateState(prev => updateBlobMarker(prev, activeSession.id, editingMarker.id, {
      studentName: trimmed,
      note: editingMarker.note || '',
      color: editingMarker.color
    }));
    setEditingMarker(null);
  };

  // Eliminazione marker
  const handleDeleteMarker = (markerId) => {
    if (!activeSession) return;
    updateState(prev => removeBlobMarker(prev, activeSession.id, markerId));
    if (editingMarker?.id === markerId) {
      setEditingMarker(null);
    }
  };

  // Drag and drop del marker
  const handleMarkerDragStart = (e, markerId) => {
    e.stopPropagation();
    setDraggingMarkerId(markerId);
  };

  const handleMouseMove = useCallback((e) => {
    if (!draggingMarkerId || !imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const curX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const curY = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

    const xPercent = (curX / rect.width) * 100;
    const yPercent = (curY / rect.height) * 100;

    updateState(prev => updateBlobMarker(prev, activeSession.id, draggingMarkerId, {
      x: xPercent,
      y: yPercent
    }));
  }, [draggingMarkerId, activeSession]);

  const handleMouseUp = useCallback(() => {
    if (draggingMarkerId) {
      setDraggingMarkerId(null);
    }
  }, [draggingMarkerId]);

  useEffect(() => {
    if (draggingMarkerId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingMarkerId, handleMouseMove, handleMouseUp]);

  // Copia riepilogo negli appunti
  const handleCopySummary = () => {
    const text = formatBlobSessionSummaryText(activeSession, activeSet);
    navigator.clipboard.writeText(text).then(() => {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    });
  };

  // Download TXT
  const handleDownloadTxt = () => {
    const text = formatBlobSessionSummaryText(activeSession, activeSet);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `riepilogo_blob_tree_${(activeSession?.name || 'sessione').replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Risoluzione URL immagine corrente
  const imageSource = useMemo(() => {
    return resolveBlobImageSrc(activeSet);
  }, [activeSet]);

  // -------------------------------------------------------------------------
  // RENDER SEGNAPOSTO (MARKERS) SULL'IMMAGINE
  // -------------------------------------------------------------------------
  const renderMarkers = () => {
    return (
      <>
        {markers.map((m, idx) => {
          const isHovered = hoveredMarkerId === m.id;
          const isMatchingSearch = searchHighlight.trim() && m.studentName.toLowerCase().includes(searchHighlight.trim().toLowerCase());

          return (
            <div
              key={m.id}
              style={{
                left: `${m.x}%`,
                top: `${m.y}%`,
              }}
              onMouseDown={(e) => handleMarkerDragStart(e, m.id)}
              onClick={(e) => {
                e.stopPropagation();
                setEditingMarker(m);
              }}
              onMouseEnter={() => setHoveredMarkerId(m.id)}
              onMouseLeave={() => setHoveredMarkerId(null)}
              className={`blob-marker absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-20 group transition-transform ${
                isMatchingSearch ? 'animate-bounce scale-125 z-40' : ''
              } ${isHovered ? 'scale-110 z-30' : ''}`}
            >
              {/* Visualizzazione compatta o estesa */}
              {isCompactView ? (
                // SOLO BADGE CIRCOLARE
                <div 
                  style={{ backgroundColor: m.color || '#FACC15' }}
                  className="w-8 h-8 rounded-full border-2 border-black font-black text-xs text-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-110 transition-transform relative"
                  title={`${m.studentName}${m.note ? ` - "${m.note}"` : ''}`}
                >
                  <span>{idx + 1}</span>

                  {/* Tooltip Hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity bg-black text-white text-[11px] font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-lg z-50">
                    {m.studentName} {m.note && `• "${m.note}"`}
                  </div>
                </div>
              ) : (
                // BADGE ESTESO CON NOME
                <div 
                  style={{ backgroundColor: m.color || '#FACC15' }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border-2 border-black font-black text-xs text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transition-transform whitespace-nowrap"
                >
                  <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] font-mono flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="max-w-[120px] truncate">{m.studentName}</span>
                  {m.note && (
                    <span className="text-[10px] font-bold bg-white/70 px-1.5 py-0.5 rounded border border-black/30 max-w-[100px] truncate">
                      {m.note}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Indicatore visivo temporaneo del click per l'assegnazione */}
        {pendingPlacement && (
          <div
            style={{
              left: `${pendingPlacement.x}%`,
              top: `${pendingPlacement.y}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none"
          >
            <div className="w-6 h-6 rounded-full bg-yellow-400 border-2 border-black animate-ping opacity-75" />
            <div className="w-4 h-4 rounded-full bg-black border-2 border-white absolute top-1 left-1" />
          </div>
        )}
      </>
    );
  };

  // -------------------------------------------------------------------------
  // RENDER ROSTER ALUNNI (UTILIZZABILE SIA STANDARD CHE IN FULLSCREEN)
  // -------------------------------------------------------------------------
  const renderRosterContent = (isFloating = false) => {
    return (
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-3">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-black" />
            <h3 className="font-black text-sm uppercase tracking-wider text-black">Alunni Mappati</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-yellow-300 border border-black font-black text-xs px-2 py-0.5 rounded-lg shadow-xs">
              {markers.length}
            </span>
            {isFloating && (
              <button 
                onClick={() => setIsRosterOpen(false)}
                className="p-1 hover:bg-gray-200 rounded-lg text-black transition-colors"
                title="Chiudi elenco"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {markers.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-8 text-center px-3">
            <Sparkles size={36} className="text-yellow-400 mb-2" />
            <p className="font-black text-xs uppercase text-gray-800 mb-1">Nessun alunno assegnato</p>
            <p className="text-[11px] font-bold text-gray-400">
              Clicca su un qualsiasi omino dell'albero per segnare chi si identifica con quel personaggio.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {markers.map((m, idx) => {
              const isHovered = hoveredMarkerId === m.id;
              return (
                <div
                  key={m.id}
                  onMouseEnter={() => setHoveredMarkerId(m.id)}
                  onMouseLeave={() => setHoveredMarkerId(null)}
                  onClick={() => setEditingMarker(m)}
                  style={{ borderLeftColor: m.color || '#FACC15' }}
                  className={`p-2.5 rounded-xl border-2 border-black border-l-6 bg-white hover:bg-yellow-50/60 transition-all cursor-pointer flex items-center justify-between gap-2 shadow-xs ${
                    isHovered ? 'ring-2 ring-black bg-yellow-100/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span 
                      style={{ backgroundColor: m.color || '#FACC15' }}
                      className="w-6 h-6 rounded-full border border-black font-mono font-black text-[11px] flex items-center justify-center shrink-0"
                    >
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-xs text-black truncate">{m.studentName}</p>
                      {m.note ? (
                        <p className="text-[10px] font-bold text-gray-500 truncate italic">"{m.note}"</p>
                      ) : (
                        <p className="text-[9px] font-bold text-gray-400">Posizione: {Math.round(m.x)}%, {Math.round(m.y)}%</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingMarker(m);
                      }}
                      className="p-1 text-gray-400 hover:text-black rounded"
                      title="Modifica"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMarker(m.id);
                      }}
                      className="p-1 text-gray-300 hover:text-rose-600 rounded"
                      title="Elimina"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {markers.length > 0 && (
          <div className="pt-3 border-t-2 border-black mt-3">
            <button
              type="button"
              onClick={() => setIsSummaryOpen(true)}
              className="w-full py-2 bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
            >
              <Copy size={13} />
              <span>Copia Riepilogo Classe</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full">
      
      {/* ========================================================================= */}
      {/* 0. BARRA SUPERIORE DI NAVIGAZIONE (BLOB TREES) */}
      {/* ========================================================================= */}
      <nav className="max-w-7xl mx-auto w-full mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          {onBack && (
            <button 
              onClick={onBack} 
              className="flex items-center gap-2 font-black text-sm text-black bg-white hover:bg-yellow-300 px-4 py-2.5 rounded-2xl border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              title="Torna alla scelta delle attività di Metafore Visive"
            >
              <ArrowLeft size={18} />
              <span>Metafore Visive</span>
            </button>
          )}

          {onBackToDashboard && (
            <button 
              onClick={onBackToDashboard} 
              className="font-bold text-xs text-gray-600 hover:text-black hover:bg-gray-100 px-3 py-2 rounded-xl border-2 border-black/20 hover:border-black transition-all cursor-pointer hidden sm:inline-block"
              title="Torna alla Dashboard principale"
            >
              Dashboard
            </button>
          )}

          <div className="flex items-center gap-2 bg-emerald-100 border-3 border-black px-3.5 py-2 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Trees size={18} className="text-emerald-800" />
            <span className="font-black text-xs uppercase tracking-wider text-emerald-950">Blob Trees</span>
          </div>
        </div>

        {/* Pulsante Tutto Schermo LIM Rapido */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-yellow-400 text-yellow-300 hover:text-black border-2 border-black rounded-2xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            title="Espandi l'albero a tutto schermo per la classe / LIM"
          >
            <Maximize2 size={16} />
            <span>Tutto Schermo LIM</span>
          </button>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 1. BARRA SCENARIO & SESSIONI */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto w-full mb-4 bg-white p-3 sm:p-4 rounded-3xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Selettore Scenario / Set */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-yellow-50 border-2 border-black rounded-xl px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-[11px] font-black uppercase text-amber-950 flex items-center gap-1">
                <ImageIcon size={13} />
                <span>Scenario:</span>
              </span>
              <select
                value={blobData.activeSetId}
                onChange={(e) => handleSelectSet(e.target.value)}
                className="bg-transparent font-black text-xs text-black outline-none cursor-pointer"
              >
                {sets.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Pulsante Gestisci Set Blob */}
            <button
              type="button"
              onClick={() => setIsSetManagerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-yellow-300 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              title="Gestisci scenari o carica immagini personalizzate dei Blob Trees"
            >
              <Settings size={13} />
              <span className="hidden sm:inline">Scenari</span>
            </button>
          </div>

          {/* Selettore Sessione & Azioni */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-amber-100 border-2 border-black rounded-xl p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-[11px] font-black uppercase text-amber-950 px-2 flex items-center gap-1">
                <Users size={13} />
                <span className="hidden md:inline">Sessione:</span>
              </span>
              <select
                value={blobData.activeSessionId}
                onChange={(e) => handleSelectSession(e.target.value)}
                className="bg-white border-2 border-black rounded-lg px-2.5 py-1 font-black text-xs text-black outline-none cursor-pointer"
              >
                {sessions.map(s => {
                  const mCount = (s.markers || []).length;
                  return (
                    <option key={s.id} value={s.id}>
                      {s.name} ({mCount} {mCount === 1 ? 'alunno' : 'alunni'})
                    </option>
                  );
                })}
              </select>

              {/* Rinomina Sessione */}
              <button
                type="button"
                onClick={() => {
                  setRenameValue(activeSession?.name || '');
                  setIsRenameModalOpen(true);
                }}
                className="p-1.5 hover:bg-amber-200 text-black rounded-lg transition-colors"
                title="Rinomina questa sessione"
              >
                <Edit2 size={13} />
              </button>

              {/* Nuova Sessione */}
              <button
                type="button"
                onClick={() => setIsNewSessionModalOpen(true)}
                className="p-1.5 hover:bg-amber-200 text-black rounded-lg transition-colors font-black flex items-center gap-1 text-xs"
                title="Crea una nuova sessione (es. per un'altra classe)"
              >
                <Plus size={14} className="stroke-[3]" />
              </button>

              {/* Reset Sessione */}
              <button
                type="button"
                onClick={handleResetSession}
                className="p-1.5 hover:bg-rose-100 text-rose-700 rounded-lg transition-colors"
                title="Azzera i posizionamenti di questa sessione"
              >
                <RefreshCw size={13} />
              </button>
            </div>

            {/* Riepilogo */}
            <button
              type="button"
              onClick={() => setIsSummaryOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-300 hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              title="Visualizza o esporta il riepilogo delle identificazioni"
            >
              <Users size={13} />
              <span>Riepilogo</span>
              <span className="bg-black text-white px-1.5 py-0.2 rounded-md font-mono text-[11px] ml-0.5">
                {markers.length}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TOOLBAR CANVAS (ZOOM, ADATTAMENTO LANDSCAPE/VERTICALE, MODALITÀ) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto w-full mb-3 flex flex-wrap items-center justify-between gap-3 px-1">
        
        {/* Sinistra: Modalità click & visualizzazione */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsPlacementMode(!isPlacementMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 ${
              isPlacementMode 
                ? 'bg-emerald-400 text-black' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            title="Attiva/disattiva il click sull'immagine per inserire segnaposto"
          >
            <MapPin size={14} className={isPlacementMode ? 'animate-bounce' : ''} />
            <span>{isPlacementMode ? 'Modalità Assegna' : 'Modalità Esplora'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCompactView(!isCompactView)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 ${
              isCompactView 
                ? 'bg-amber-300 text-black' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            title="Alterna tra etichette estese con nome o solo badge con numeri/iniziali"
          >
            <Tag size={13} />
            <span>{isCompactView ? 'Compatta' : 'Nomi Estesi'}</span>
          </button>

          {/* Toggle Roster Laterale */}
          <button
            type="button"
            onClick={() => setIsRosterOpen(!isRosterOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-100 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <Users size={13} />
            <span>Elenco ({markers.length})</span>
            {isRosterOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Centro: Modalità di Adattamento Immagine (Intera, Larghezza, Altezza) */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center bg-white border-2 border-black rounded-xl p-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <button
              type="button"
              onClick={() => { setFitMode('contain'); setZoomLevel(1); }}
              className={`px-2.5 py-1 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                fitMode === 'contain' ? 'bg-yellow-300 text-black shadow-xs' : 'text-gray-600 hover:text-black hover:bg-gray-100'
              }`}
              title="Adatta l'intera illustrazione allo schermo per vederla completamente a colpo d'occhio senza scrollare"
            >
              <LayoutGrid size={13} />
              <span>Intera</span>
            </button>
            <button
              type="button"
              onClick={() => { setFitMode('width'); setZoomLevel(1); }}
              className={`px-2.5 py-1 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                fitMode === 'width' ? 'bg-cyan-300 text-black shadow-xs' : 'text-gray-600 hover:text-black hover:bg-gray-100'
              }`}
              title="Adatta alla larghezza: ottimale per illustrazioni verticali e alte (scroll dall'alto in basso con personaggi grandi)"
            >
              <ArrowLeftRight size={13} />
              <span>Larghezza</span>
            </button>
            <button
              type="button"
              onClick={() => { setFitMode('height'); setZoomLevel(1); }}
              className={`px-2.5 py-1 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                fitMode === 'height' ? 'bg-pink-300 text-black shadow-xs' : 'text-gray-600 hover:text-black hover:bg-gray-100'
              }`}
              title="Adatta all'altezza: ottimale per illustrazioni orizzontali e panoramiche (scroll laterale)"
            >
              <ArrowUpDown size={13} />
              <span>Altezza</span>
            </button>
          </div>

          {aspectInfo && (
            <span 
              className="text-[11px] font-bold bg-gray-100 border border-black/30 rounded-lg px-2 py-1 text-gray-700 hidden sm:inline-flex items-center gap-1"
              title={aspectInfo.hint}
            >
              {aspectInfo.badge}
            </span>
          )}
        </div>

        {/* Destra: Zoom & Evidenzia Alunno */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Cerca/Evidenzia Alunno */}
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchHighlight}
              onChange={(e) => setSearchHighlight(e.target.value)}
              placeholder="Evidenzia alunno..."
              className="pl-8 pr-7 py-1.5 bg-white border-2 border-black rounded-xl text-xs font-bold text-black outline-none focus:ring-2 focus:ring-yellow-400 w-32 sm:w-40 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            />
            {searchHighlight && (
              <button
                type="button"
                onClick={() => setSearchHighlight('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Controlli Zoom */}
          <div className="flex items-center bg-white border-2 border-black rounded-xl p-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <button
              type="button"
              onClick={() => setZoomLevel(z => Math.max(0.5, Math.round((z - 0.15) * 100) / 100))}
              disabled={zoomLevel <= 0.5}
              className="p-1.5 hover:bg-gray-100 text-black rounded-lg disabled:opacity-30 transition-colors"
              title="Riduci Zoom"
            >
              <ZoomOut size={14} />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(1)}
              className="px-2 py-1 font-mono font-black text-xs hover:bg-yellow-200 rounded-md transition-colors"
              title="Ripristina zoom al 100%"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(z => Math.min(3, Math.round((z + 0.15) * 100) / 100))}
              disabled={zoomLevel >= 3}
              className="p-1.5 hover:bg-gray-100 text-black rounded-lg disabled:opacity-30 transition-colors"
              title="Aumenta Zoom"
            >
              <ZoomIn size={14} />
            </button>
          </div>

          {/* Pulsante Espandi Schermo Intero */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            title="Espandi a tutto schermo"
          >
            <Maximize2 size={14} />
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. AREA CENTRALE: CANVAS IMMAGINE INTERATTIVO & CASSETTO ROSTER */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto w-full flex-1 flex flex-col lg:flex-row gap-4 min-h-0 pb-6 items-start">
        
        {/* Canvas Immagine */}
        <div 
          ref={imageContainerRef}
          className="flex-1 w-full bg-white rounded-3xl border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col relative"
        >
          {/* Header didascalia set */}
          <div className="bg-[#FFFDF9] border-b-2 border-black px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-black uppercase tracking-wider text-black">{activeSet?.title}</span>
              {activeSet?.subtitle && (
                <span className="text-gray-500 font-bold hidden sm:inline">• {activeSet.subtitle}</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-gray-500 font-bold">
              <span>{markers.length} {markers.length === 1 ? 'omino identificato' : 'omini identificati'}</span>
            </div>
          </div>

          {/* Area Immagine con Overflow, Pan e Zoom */}
          <div 
            ref={scrollViewportRef}
            onMouseDown={handleContainerMouseDown}
            onMouseMove={handleContainerMouseMove}
            onMouseUp={handleContainerMouseUp}
            className={`flex-1 w-full overflow-auto p-2 sm:p-5 flex items-center justify-center min-h-[500px] max-h-[calc(100vh-270px)] bg-[#FAF8F5] relative select-none custom-scrollbar ${
              !isPlacementMode && !draggingMarkerId ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : ''
            }`}
          >
            <div 
              className={`relative inline-block transition-transform duration-150 ease-out ${
                fitMode === 'width' ? 'w-full origin-top' : fitMode === 'height' ? 'h-full origin-left' : 'origin-center'
              }`}
              style={{ transform: zoomLevel !== 1 ? `scale(${zoomLevel})` : undefined }}
            >
              {/* Immagine Principale Blob Tree */}
              <img
                ref={imageRef}
                src={imageSource}
                alt={activeSet?.title || 'Blob Tree'}
                onLoad={handleImageLoad}
                onClick={handleImageClick}
                draggable={false}
                style={{
                  ...(fitMode === 'contain' ? { maxHeight: 'calc(100vh - 290px)', maxWidth: '100%', width: 'auto', height: 'auto' } : {}),
                  ...(fitMode === 'width' ? { width: '100%', height: 'auto', maxWidth: 'none', maxHeight: 'none' } : {}),
                  ...(fitMode === 'height' ? { height: 'calc(100vh - 290px)', width: 'auto', maxHeight: 'none', maxWidth: 'none' } : {})
                }}
                className={`object-contain rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white block ${
                  isPlacementMode ? 'cursor-crosshair' : 'cursor-default'
                }`}
              />

              {/* Rendering dei Segnaposto (Markers) */}
              {renderMarkers()}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. CASSETTO ROSTER / ELENCO ALUNNI ASSEGNATI (COLLAPSIBLE) */}
        {/* ========================================================================= */}
        {isRosterOpen && (
          <aside className="w-full lg:w-80 bg-white rounded-3xl border-3 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] p-4 flex flex-col shrink-0 max-h-[85vh] overflow-hidden">
            {renderRosterContent(false)}
          </aside>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 4. OVERLAY TUTTO SCHERMO / MODALITÀ LIM IMMERSIVA */}
      {/* ========================================================================= */}
      {isFullscreenMode && (
        <div className="fixed inset-0 z-50 bg-[#121216] flex flex-col p-2 sm:p-4 select-none animate-in fade-in">
          
          {/* Floating Topbar Schermo Intero */}
          <header className="w-full mb-2 bg-[#1C1C24] border-2 border-white/20 rounded-2xl p-2.5 flex flex-wrap items-center justify-between gap-3 shadow-2xl z-20">
            {/* Sinistra: Esci da Schermo Intero & Titolo Scenario */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={toggleFullscreen}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                title="Esci da Tutto Schermo (oppure premi ESC sulla tastiera)"
              >
                <Minimize2 size={15} />
                <span>Esci (Esc)</span>
              </button>

              <div className="flex items-center gap-2 bg-black/60 border border-white/20 px-3 py-1.5 rounded-xl text-white">
                <Trees size={15} className="text-emerald-400" />
                <span className="font-black text-xs">{activeSet?.title}</span>
                {aspectInfo && (
                  <span className="text-[10px] font-bold bg-white/10 px-1.5 py-0.2 rounded text-gray-300">
                    {aspectInfo.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Centro: Adattamento Immagine (Intera, Larghezza, Altezza) & Zoom */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center bg-black/60 border border-white/20 rounded-xl p-0.5">
                <button
                  type="button"
                  onClick={() => { setFitMode('contain'); setZoomLevel(1); }}
                  className={`px-2.5 py-1 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                    fitMode === 'contain' ? 'bg-yellow-400 text-black shadow-xs' : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                  title="Mostra l'intera illustrazione senza scroll"
                >
                  <LayoutGrid size={13} />
                  <span>Intera</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setFitMode('width'); setZoomLevel(1); }}
                  className={`px-2.5 py-1 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                    fitMode === 'width' ? 'bg-cyan-400 text-black shadow-xs' : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                  title="Espandi in larghezza (ideale per verticali lunghe)"
                >
                  <ArrowLeftRight size={13} />
                  <span>Larghezza</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setFitMode('height'); setZoomLevel(1); }}
                  className={`px-2.5 py-1 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                    fitMode === 'height' ? 'bg-pink-400 text-black shadow-xs' : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                  title="Espandi in altezza (ideale per landscape panoramiche)"
                >
                  <ArrowUpDown size={13} />
                  <span>Altezza</span>
                </button>
              </div>

              {/* Zoom */}
              <div className="flex items-center bg-black/60 border border-white/20 rounded-xl p-0.5 text-white">
                <button
                  type="button"
                  onClick={() => setZoomLevel(z => Math.max(0.5, Math.round((z - 0.15) * 100) / 100))}
                  disabled={zoomLevel <= 0.5}
                  className="p-1.5 hover:bg-white/10 rounded-lg disabled:opacity-30 transition-colors"
                >
                  <ZoomOut size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(1)}
                  className="px-2 py-0.5 font-mono font-black text-xs hover:bg-white/20 rounded transition-colors"
                >
                  {Math.round(zoomLevel * 100)}%
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(z => Math.min(3, Math.round((z + 0.15) * 100) / 100))}
                  disabled={zoomLevel >= 3}
                  className="p-1.5 hover:bg-white/10 rounded-lg disabled:opacity-30 transition-colors"
                >
                  <ZoomIn size={13} />
                </button>
              </div>
            </div>

            {/* Destra: Modalità Click & Roster Drawer */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsPlacementMode(!isPlacementMode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                  isPlacementMode ? 'bg-emerald-400 text-black' : 'bg-white text-gray-800'
                }`}
              >
                <MapPin size={13} />
                <span>{isPlacementMode ? 'Assegna Alunno' : 'Modalità Esplora'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCompactView(!isCompactView)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                  isCompactView ? 'bg-amber-300 text-black' : 'bg-white text-gray-800'
                }`}
              >
                <Tag size={13} />
                <span>{isCompactView ? 'Compatta' : 'Nomi Estesi'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsRosterOpen(!isRosterOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-300 hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <Users size={13} />
                <span>Roster ({markers.length})</span>
                {isRosterOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
            </div>
          </header>

          {/* Area Canvas a Schermo Intero */}
          <div className="flex-1 w-full overflow-hidden flex relative items-center justify-center rounded-2xl bg-[#0D0D11] border-2 border-white/10">
            <div 
              onMouseDown={handleContainerMouseDown}
              onMouseMove={handleContainerMouseMove}
              onMouseUp={handleContainerMouseUp}
              className={`w-full h-full overflow-auto p-2 sm:p-4 flex items-center justify-center custom-scrollbar ${
                !isPlacementMode && !draggingMarkerId ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : ''
              }`}
            >
              <div 
                className={`relative inline-block transition-transform duration-150 ease-out ${
                  fitMode === 'width' ? 'w-full origin-top' : fitMode === 'height' ? 'h-full origin-left' : 'origin-center'
                }`}
                style={{ transform: zoomLevel !== 1 ? `scale(${zoomLevel})` : undefined }}
              >
                <img
                  ref={imageRef}
                  src={imageSource}
                  alt={activeSet?.title || 'Blob Tree'}
                  onLoad={handleImageLoad}
                  onClick={handleImageClick}
                  draggable={false}
                  style={{
                    ...(fitMode === 'contain' ? { maxHeight: 'calc(100vh - 100px)', maxWidth: '100%', width: 'auto', height: 'auto' } : {}),
                    ...(fitMode === 'width' ? { width: '100%', height: 'auto', maxWidth: 'none', maxHeight: 'none' } : {}),
                    ...(fitMode === 'height' ? { height: 'calc(100vh - 100px)', width: 'auto', maxHeight: 'none', maxWidth: 'none' } : {})
                  }}
                  className={`object-contain rounded-xl border-3 border-black shadow-2xl bg-white block ${
                    isPlacementMode ? 'cursor-crosshair' : 'cursor-default'
                  }`}
                />

                {/* Rendering Segnaposto in Schermo Intero */}
                {renderMarkers()}
              </div>
            </div>

            {/* Roster Galleggiante in Schermo Intero */}
            {isRosterOpen && (
              <div className="absolute right-4 top-4 bottom-4 w-72 sm:w-80 bg-white/95 backdrop-blur-md rounded-2xl border-3 border-black shadow-2xl p-4 flex flex-col z-30 animate-in slide-in-from-right-10">
                {renderRosterContent(true)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODALE / POPOVER: ASSEGNAZIONE NUOVO ALUNNO SU CLICK */}
      {/* ========================================================================= */}
      {pendingPlacement && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
              <div className="flex items-center gap-2">
                <span 
                  style={{ backgroundColor: newColor }} 
                  className="w-7 h-7 rounded-xl border-2 border-black flex items-center justify-center font-black text-xs"
                >
                  #{markers.length + 1}
                </span>
                <h3 className="text-base font-black uppercase text-black">Assegna Personaggio</h3>
              </div>
              <button
                type="button"
                onClick={() => setPendingPlacement(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-black"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 mb-5">
              {/* Nome Alunno */}
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Nome Alunno / Partecipante
                </label>
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleConfirmPlacement()}
                  placeholder="Es: Marco, Giulia, Alunno #3..."
                  autoFocus
                  className="w-full p-2.5 rounded-xl border-2 border-black font-bold text-sm outline-none focus:ring-3 focus:ring-yellow-300"
                />

                {/* Chip di suggerimento rapido da studenti già presenti */}
                {sessionRoster.length > 0 && (
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Suggeriti:</span>
                    {sessionRoster.slice(0, 6).map(name => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setNewStudentName(name)}
                        className="px-2 py-0.5 bg-gray-100 hover:bg-yellow-200 border border-black/30 rounded-md text-[11px] font-bold text-black transition-colors"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Ruolo / Emozione / Nota opzionale */}
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1 flex items-center gap-1">
                  <MessageSquare size={12} />
                  <span>Ruolo o Stato d'Animo (Opzionale)</span>
                </label>
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleConfirmPlacement()}
                  placeholder="Es: Si sente in cima, Aiuta un compagno, Ha paura..."
                  className="w-full p-2.5 rounded-xl border-2 border-black font-bold text-sm outline-none focus:ring-3 focus:ring-yellow-300"
                />

                {/* Suggerimenti rapidi di stati d'animo */}
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {['In cima felice', 'Aiuta un amico', 'Vuole salire', 'Isolato / solo', 'Riposa sereno', 'Spettatore'].map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setNewNote(preset)}
                      className="px-1.5 py-0.5 bg-yellow-50 hover:bg-yellow-200 text-yellow-900 border border-yellow-300 rounded text-[10px] font-black transition-colors"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selettore Colore Segnaposto */}
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1.5">
                  Colore Segnaposto
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {MARKER_COLORS.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setNewColor(c.hex)}
                      style={{ backgroundColor: c.hex }}
                      className={`w-7 h-7 rounded-lg border-2 border-black transition-transform ${
                        newColor === c.hex ? 'scale-120 ring-2 ring-black shadow-xs' : 'hover:scale-105'
                      }`}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Pulsanti Azione */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPendingPlacement(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs border-2 border-black transition-colors"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={handleConfirmPlacement}
                disabled={!newStudentName.trim()}
                className="flex-1 py-2.5 bg-yellow-300 hover:bg-yellow-400 text-black font-black uppercase tracking-wider rounded-xl text-xs border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-40 transition-all"
              >
                Conferma Posizione
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODALE MODIFICA MARKER ESISTENTE */}
      {/* ========================================================================= */}
      {editingMarker && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
              <h3 className="text-base font-black uppercase text-black">Modifica Assegnazione</h3>
              <button
                type="button"
                onClick={() => setEditingMarker(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-black"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 mb-5">
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">Nome Alunno</label>
                <input
                  type="text"
                  value={editingMarker.studentName}
                  onChange={(e) => setEditingMarker({ ...editingMarker, studentName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border-2 border-black font-bold text-sm outline-none focus:ring-3 focus:ring-yellow-300"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">Ruolo / Vissuto / Nota</label>
                <input
                  type="text"
                  value={editingMarker.note || ''}
                  onChange={(e) => setEditingMarker({ ...editingMarker, note: e.target.value })}
                  placeholder="Aggiungi una nota o vissuto..."
                  className="w-full p-2.5 rounded-xl border-2 border-black font-bold text-sm outline-none focus:ring-3 focus:ring-yellow-300"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1.5">Colore</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {MARKER_COLORS.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setEditingMarker({ ...editingMarker, color: c.hex })}
                      style={{ backgroundColor: c.hex }}
                      className={`w-7 h-7 rounded-lg border-2 border-black transition-transform ${
                        editingMarker.color === c.hex ? 'scale-120 ring-2 ring-black' : 'hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleDeleteMarker(editingMarker.id)}
                className="py-2.5 px-4 bg-rose-100 hover:bg-rose-200 text-rose-800 font-black rounded-xl text-xs border-2 border-black flex items-center gap-1.5 transition-colors"
              >
                <Trash2 size={14} />
                <span>Rimuovi</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMarker(null)}
                  className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs border-2 border-black transition-colors"
                >
                  Annulla
                </button>
                <button
                  type="button"
                  onClick={handleSaveMarkerEdit}
                  className="py-2.5 px-5 bg-yellow-300 hover:bg-yellow-400 text-black font-black uppercase tracking-wider rounded-xl text-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  Salva
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODALE RIEPILOGO & EXPORT */}
      {/* ========================================================================= */}
      {isSummaryOpen && (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-yellow-500" />
                <h3 className="text-lg font-black uppercase text-black">Riepilogo Blob Tree</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSummaryOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-black"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-gray-50 border-2 border-black rounded-2xl p-4 flex-1 overflow-y-auto font-mono text-xs text-gray-800 mb-4 whitespace-pre-wrap select-all">
              {formatBlobSessionSummaryText(activeSession, activeSet)}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-xs font-bold text-gray-500">
                {markers.length} {markers.length === 1 ? 'alunno mappato' : 'alunni mappati'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadTxt}
                  className="px-4 py-2.5 bg-white hover:bg-gray-100 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <Download size={14} />
                  <span>Scarica TXT</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="px-5 py-2.5 bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                >
                  {copiedSummary ? <Check size={14} className="stroke-[3]" /> : <Copy size={14} />}
                  <span>{copiedSummary ? 'Copiato!' : 'Copia negli Appunti'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. MODALE GESTIONE SCENARI BLOB (UPLOAD, NUOVO SET, DUPLICA, ELIMINA) */}
      {/* ========================================================================= */}
      {isSetManagerOpen && (
        <BlobTreeSetManagerModal
          sets={sets}
          activeSetId={blobData.activeSetId}
          onSelectSet={(id) => {
            handleSelectSet(id);
            setIsSetManagerOpen(false);
          }}
          onUpdateState={updateState}
          onClose={() => setIsSetManagerOpen(false)}
          db={db}
          user={user}
          appId={appId}
        />
      )}

      {/* ========================================================================= */}
      {/* 9. MODALE NUOVA SESSIONE */}
      {/* ========================================================================= */}
      {isNewSessionModalOpen && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95">
            <h3 className="text-base font-black uppercase text-black mb-2">Nuova Sessione Blob Tree</h3>
            <p className="text-xs text-gray-500 font-bold mb-4">
              Crea una lavagna pulita per una nuova classe o un nuovo gruppo di lavoro.
            </p>
            <input
              type="text"
              value={newSessionName}
              onChange={(e) => setNewSessionName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateSession()}
              placeholder={`Es: Classe ${sessions.length + 1}B...`}
              autoFocus
              className="w-full p-2.5 rounded-xl border-2 border-black font-bold text-sm outline-none focus:ring-3 focus:ring-yellow-300 mb-4"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsNewSessionModalOpen(false)}
                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs border-2 border-black"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={handleCreateSession}
                className="flex-1 py-2 bg-yellow-300 hover:bg-yellow-400 text-black font-black uppercase tracking-wider rounded-xl text-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                Crea
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. MODALE RINOMINA SESSIONE */}
      {/* ========================================================================= */}
      {isRenameModalOpen && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95">
            <h3 className="text-base font-black uppercase text-black mb-2">Rinomina Sessione</h3>
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRenameSession()}
              autoFocus
              className="w-full p-2.5 rounded-xl border-2 border-black font-bold text-sm outline-none focus:ring-3 focus:ring-yellow-300 mb-4"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsRenameModalOpen(false)}
                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs border-2 border-black"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={handleRenameSession}
                disabled={!renameValue.trim()}
                className="flex-1 py-2 bg-yellow-300 hover:bg-yellow-400 text-black font-black uppercase tracking-wider rounded-xl text-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-40"
              >
                Salva
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// =================================================================================
// SUB-MODALE PER LA GESTIONE DEGLI SCENARI E UPLOAD IMMAGINI BLOB
// =================================================================================
function BlobTreeSetManagerModal({ sets, activeSetId, onSelectSet, onUpdateState, onClose, db, user, appId }) {
  const [isUploading, setIsUploading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [previewDataUrl, setPreviewDataUrl] = useState(null);
  const fileInputRef = useRef(null);

  // Gestione selezione file immagine dal computer
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Seleziona un file immagine valido (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewDataUrl(event.target.result);
      if (!newTitle.trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
        setNewTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    };
    reader.readAsDataURL(file);
  };

  // Creazione nuovo set con immagine caricata
  const handleCreateNewSet = async () => {
    if (!previewDataUrl) {
      alert("Carica prima un'immagine per questo scenario.");
      return;
    }
    const trimmedTitle = newTitle.trim() || 'Nuovo Scenario Blob';

    setIsUploading(true);
    try {
      const customId = `cimg_blob_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      await saveCustomImage(customId, previewDataUrl);

      if (db && user && appId) {
        syncImageToFirestore(db, user, appId, customId, previewDataUrl).catch((err) => {
          console.warn('Sync cloud immagine blob non riuscito:', err);
        });
      }

      onUpdateState(prev => createBlobTreeSet(prev, {
        title: trimmedTitle,
        subtitle: newSubtitle.trim(),
        description: 'Scenario personalizzato caricato dal docente.',
        imageSrc: previewDataUrl,
        customImageId: customId,
        thumbnailSrc: null
      }));

      onClose();
    } catch (err) {
      console.error('Errore salvataggio scenario personalizzato:', err);
      alert('Si è verificato un errore durante il salvataggio dell\'immagine.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDuplicate = (setId) => {
    onUpdateState(prev => duplicateBlobTreeSet(prev, setId));
  };

  const handleDelete = (setId) => {
    if (sets.length <= 1) {
      alert("Non puoi eliminare l'unico scenario rimasto.");
      return;
    }
    if (!window.confirm("Sei sicuro di voler eliminare questo scenario?")) return;
    onUpdateState(prev => deleteBlobTreeSet(prev, setId));
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-2xl w-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
          <div className="flex items-center gap-2">
            <ImageIcon size={20} className="text-black" />
            <h3 className="text-lg font-black uppercase text-black">Gestione Scenari Blob Tree</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-black">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-5 pr-1 custom-scrollbar">
          
          {/* Sezione Aggiungi Nuovo Scenario da File */}
          <div className="p-4 bg-yellow-50/70 rounded-2xl border-2 border-black space-y-3">
            <h4 className="font-black text-xs uppercase tracking-wider text-black flex items-center gap-1.5">
              <Upload size={14} />
              <span>Carica Nuovo Scenario / Albero Personale</span>
            </h4>
            <p className="text-xs text-gray-600 font-bold">
              Puoi caricare qualsiasi disegno o scheda dei Blob dal tuo computer (PNG, JPG, WebP).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Titolo Scenario</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Es: Il Ponte dei Blob..."
                  className="w-full p-2 bg-white border-2 border-black rounded-xl font-bold text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Sottotitolo / Focus</label>
                <input
                  type="text"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  placeholder="Es: Transizione e sfide..."
                  className="w-full p-2 bg-white border-2 border-black rounded-xl font-bold text-xs outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 bg-white hover:bg-yellow-200 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs"
              >
                <Upload size={13} />
                <span>{previewDataUrl ? 'Cambia Immagine' : 'Scegli File Immagine'}</span>
              </button>

              {previewDataUrl && (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 size={14} />
                  <span>Immagine pronta</span>
                </span>
              )}

              {previewDataUrl && (
                <button
                  type="button"
                  onClick={handleCreateNewSet}
                  disabled={isUploading}
                  className="ml-auto px-4 py-2 bg-black hover:bg-gray-800 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  {isUploading ? 'Salvataggio...' : 'Crea Scenario'}
                </button>
              )}
            </div>

            {/* Anteprima miniatura se selezionata */}
            {previewDataUrl && (
              <div className="w-28 h-20 rounded-xl border-2 border-black overflow-hidden bg-white mt-2">
                <img src={previewDataUrl} alt="Anteprima" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Elenco Scenari Esistenti */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-wider text-gray-500 mb-2">Scenari Disponibili</h4>
            <div className="space-y-2.5">
              {sets.map(s => {
                const isActive = s.id === activeSetId;
                const imgSrc = resolveBlobImageSrc(s);

                return (
                  <div
                    key={s.id}
                    className={`p-3 rounded-2xl border-2 border-black flex items-center justify-between gap-3 transition-all ${
                      isActive ? 'bg-yellow-100/70 shadow-xs' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-14 h-11 rounded-lg border-2 border-black overflow-hidden bg-gray-100 shrink-0">
                        <img src={imgSrc} alt={s.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-black text-xs text-black truncate">{s.title}</p>
                          {isActive && (
                            <span className="bg-black text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                              In Uso
                            </span>
                          )}
                        </div>
                        {s.subtitle && (
                          <p className="text-[11px] font-bold text-gray-500 truncate">{s.subtitle}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {!isActive && (
                        <button
                          type="button"
                          onClick={() => onSelectSet(s.id)}
                          className="px-3 py-1 bg-white hover:bg-yellow-300 text-black border border-black rounded-lg text-xs font-black"
                        >
                          Usa
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDuplicate(s.id)}
                        className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-black rounded-lg"
                        title="Duplica scenario"
                      >
                        <Copy size={13} />
                      </button>
                      {sets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDelete(s.id)}
                          className="p-1.5 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-lg"
                          title="Elimina scenario"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        <div className="pt-3 border-t-2 border-black mt-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-black hover:bg-gray-800 text-white font-black text-xs uppercase tracking-wider rounded-xl"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}
