import { newSessionCode } from '../lib/sessionCode';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Check, X, LogOut, MapPin, ZoomIn, ZoomOut, AlertCircle, 
  Send, RefreshCw, CheckCircle2, ChevronRight, Sparkles, 
  Trees, Trash2, Edit3, Move, Info
} from 'lucide-react';
import { doc, collection, updateDoc } from '../lib/sessionStore';
import { resolveBlobImageSrc, ensureImageLoaded, getCachedImage } from '../lib/customImageStorage';

const MARKER_COLORS = [
  { id: 'yellow', hex: '#FACC15', label: 'Giallo' },
  { id: 'cyan', hex: '#22D3EE', label: 'Azzurro' },
  { id: 'emerald', hex: '#34D399', label: 'Verde' },
  { id: 'pink', hex: '#F472B6', label: 'Rosa' },
  { id: 'purple', hex: '#C084FC', label: 'Lilla' },
  { id: 'orange', hex: '#FB923C', label: 'Arancione' },
  { id: 'blue', hex: '#60A5FA', label: 'Blu' },
  { id: 'coral', hex: '#F87171', label: 'Corallo' },
];

export default function MetaphorBlobStudentView({
  sessionCode,
  sessionData,
  initialStudentName = '',
  onExit,
  db,
  user,
  appId
}) {
  const [studentName, setStudentName] = useState(() => (initialStudentName && initialStudentName.trim()) ? initialStudentName.trim() : '');
  const [nameInput, setNameInput] = useState('');
  const [markers, setMarkers] = useState([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [imageVersion, setForceUpdate] = useState(0);

  const containerRef = useRef(null);
  const imgRef = useRef(null);

  const maxSelections = Number(sessionData?.maxSelections) || 1;
  const isActive = Boolean(sessionData?.active);

  // Carica i marker già salvati per questo studente
  useEffect(() => {
    if (!studentName) return;
    const studentKey = user?.uid;
    const existing = sessionData?.participants?.[studentKey];
    if (existing && Array.isArray(existing.markers) && existing.markers.length > 0) {
      setMarkers(existing.markers);
      setSentSuccess(true);
    }
  }, [studentName, sessionData]);

  // Se l'immagine è personalizzata, caricala da Firestore se non presente in memoria
  useEffect(() => {
    if (!sessionData?.customImageId || !db || !appId) return;
    if (!getCachedImage(sessionData.customImageId)) {
      ensureImageLoaded(sessionData.customImageId, db, appId).then(res => {
        if (res) setForceUpdate(k => k + 1);
      });
    }
  }, [sessionData, db, appId]);

  const activeImageSrc = useMemo(() => {
    return resolveBlobImageSrc(sessionData) || './blobtrees/tree_classic.jpg';
  }, [sessionData, imageVersion]);

  // Click sull'immagine per posizionare il segnaposto
  const handleImageClick = (e) => {
    if (!isActive) return;
    if (!imgRef.current) return;

    const rect = imgRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (clickX < 0 || clickX > rect.width || clickY < 0 || clickY > rect.height) return;

    const xPercent = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    const yPercent = Math.max(0, Math.min(100, (clickY / rect.height) * 100));

    setErrorMessage('');

    if (markers.length >= maxSelections) {
      if (maxSelections === 1) {
        // Se maxSelections è 1, sposta direttamente il segnaposto
        const updated = markers.map(m => ({ ...m, x: xPercent, y: yPercent }));
        setMarkers(updated);
        setSelectedMarkerId(updated[0]?.id || null);
        setSentSuccess(false);
      } else {
        setErrorMessage(`Hai già inserito ${maxSelections} ${maxSelections === 1 ? 'posizione' : 'posizioni'}. Tocca un segnaposto per spostarlo o eliminarlo.`);
      }
      return;
    }

    // Aggiunge un nuovo segnaposto
    const newMarker = {
      id: `m_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      x: xPercent,
      y: yPercent,
      color: MARKER_COLORS[markers.length % MARKER_COLORS.length].hex,
      note: '',
      studentName: studentName.trim()
    };

    const nextMarkers = [...markers, newMarker];
    setMarkers(nextMarkers);
    setSelectedMarkerId(newMarker.id);
    setSentSuccess(false);
  };

  const handleUpdateMarker = (markerId, patch) => {
    setMarkers(prev => prev.map(m => m.id === markerId ? { ...m, ...patch } : m));
    setSentSuccess(false);
  };

  const handleDeleteMarker = (markerId) => {
    setMarkers(prev => prev.filter(m => m.id !== markerId));
    if (selectedMarkerId === markerId) setSelectedMarkerId(null);
    setSentSuccess(false);
  };

  const handleSubmit = async () => {
    if (!isActive) {
      alert("La sessione è stata chiusa dal docente.");
      return;
    }
    if (!studentName || studentName.trim().length < 2) {
      alert("Inserisci il tuo nome prima di inviare.");
      return;
    }
    if (markers.length === 0) {
      alert("Tocca l'albero per posizionare almeno un segnaposto prima di inviare.");
      return;
    }

    setSending(true);
    setErrorMessage('');

    try {
      const studentKey = user?.uid;
      const sessionRef = doc(collection(db, 'artifacts', appId, 'public', 'data', 'feedback_sessions'), sessionCode);

      await updateDoc(sessionRef, {
        [`participants.${studentKey}`]: {
          studentName: studentName.trim(),
          markers: markers.map(m => ({
            id: m.id,
            x: m.x,
            y: m.y,
            color: m.color || '#FACC15',
            note: m.note ? m.note.trim() : '',
            createdAt: new Date().toISOString()
          })),
          timestamp: new Date().toISOString()
        }
      });

      setSentSuccess(true);
    } catch (err) {
      console.error("Errore salvataggio posizione Blob Tree:", err);
      setErrorMessage("Errore durante l'invio. Riprova tra poco.");
    } finally {
      setSending(false);
    }
  };

  // --- SCHERMATA INSERIMENTO NOME ---
  if (!studentName || studentName.trim().length < 2) {
    return (
      <div className="min-h-screen bg-yellow-50 flex flex-col justify-center items-center p-4 selection:bg-yellow-200">
        <div className="max-w-md w-full bg-white rounded-3xl border-4 border-black p-6 sm:p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-yellow-300 border-3 border-black flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Trees size={32} className="text-black" />
          </div>

          <span className="inline-block bg-black text-yellow-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 font-mono">
            Stanza {sessionCode}
          </span>

          <h2 className="text-2xl font-black text-black mb-1">Blob Tree</h2>
          <p className="text-xs font-bold text-gray-600 mb-6">
            {sessionData?.setTitle || 'Scegli la tua posizione sull\'albero'}
          </p>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (!nameInput.trim() || nameInput.trim().length < 2) {
              setErrorMessage("Inserisci il tuo nome e cognome per proseguire.");
              return;
            }
            setStudentName(nameInput.trim());
          }}>
            <div className="text-left mb-4">
              <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1.5">
                Il tuo Nome e Cognome:
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => { setNameInput(e.target.value); setErrorMessage(''); }}
                placeholder="Es. Chiara Bianchi"
                className="w-full p-3.5 bg-gray-50 border-3 border-black rounded-2xl font-bold text-base focus:bg-yellow-50 outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                autoFocus
              />
              {errorMessage && (
                <p className="text-red-600 text-xs font-bold mt-1.5 flex items-center gap-1">
                  <AlertCircle size={14} /> {errorMessage}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-500 text-black border-3 border-black rounded-2xl font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Accedi all'Albero</span>
              <ChevronRight size={18} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  const selectedMarker = markers.find(m => m.id === selectedMarkerId) || markers[0];

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col font-sans selection:bg-yellow-200">
      
      {/* BARRA SUPERIORE */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b-4 border-black px-4 py-2.5 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <div className="bg-black text-yellow-300 px-3 py-1 rounded-xl font-mono font-black text-sm">
              {sessionCode}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-black uppercase text-black leading-tight">
                {sessionData?.setTitle || 'Blob Tree'}
              </span>
              <span className="text-[11px] font-bold text-gray-500">
                👤 {studentName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* CONTROLLI ZOOM */}
            <div className="flex items-center bg-gray-100 border-2 border-black rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => setZoomLevel(z => Math.max(0.7, Number((z - 0.2).toFixed(1))))}
                className="p-1 hover:bg-white rounded-lg text-black cursor-pointer"
                title="Rimpicciolisci"
              >
                <ZoomOut size={15} />
              </button>
              <span className="px-1.5 text-[11px] font-mono font-bold text-gray-700">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel(z => Math.min(2.5, Number((z + 0.2).toFixed(1))))}
                className="p-1 hover:bg-white rounded-lg text-black cursor-pointer"
                title="Ingrandisci"
              >
                <ZoomIn size={15} />
              </button>
            </div>

            {/* BADGE STATO */}
            <span className={`px-2.5 py-1 rounded-lg text-xs font-black border-2 ${
              isActive 
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                : 'bg-rose-100 text-rose-800 border-rose-300'
            }`}>
              {isActive ? 'APERTA' : 'CHIUSA'}
            </span>

            {/* PULSANTE ESCI */}
            <button
              type="button"
              onClick={onExit}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-black rounded-xl border-2 border-black font-black text-xs flex items-center gap-1 transition-all cursor-pointer"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Esci</span>
            </button>
          </div>

        </div>
      </header>

      {/* STRIP GUIDA RAPIDA & CONTEGGIO */}
      <div className="max-w-5xl mx-auto w-full px-4 pt-3 pb-1">
        
        {/* AVVISO SESSIONE CHIUSA */}
        {!isActive && (
          <div className="mb-2.5 bg-rose-100 border-3 border-black p-3 rounded-2xl flex items-center gap-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <AlertCircle size={20} className="text-rose-600 shrink-0" />
            <span className="text-xs font-bold text-rose-900">
              <strong className="uppercase">Sessione Chiusa:</strong> La raccolta delle posizioni è terminata.
            </span>
          </div>
        )}

        <div className="bg-white border-3 border-black p-3 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-yellow-500 shrink-0" />
            <p className="text-xs text-gray-700 font-bold">
              Tocca il personaggio dell'albero in cui ti riconosci. Max: <strong>{maxSelections} {maxSelections === 1 ? 'posizione' : 'posizioni'}</strong>.
            </p>
          </div>

          <span className={`px-2.5 py-1 rounded-lg border-2 border-black font-black text-xs uppercase tracking-wider ${
            markers.length >= maxSelections 
              ? 'bg-emerald-300 text-black' 
              : 'bg-yellow-100 text-yellow-900'
          }`}>
            Inserite: {markers.length} di {maxSelections}
          </span>
        </div>

        {errorMessage && (
          <div className="mt-2 bg-amber-100 border-2 border-amber-400 p-2 rounded-xl text-xs font-bold text-amber-900 flex items-center gap-2">
            <AlertCircle size={15} className="text-amber-700 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {sentSuccess && (
          <div className="mt-2 bg-emerald-100 border-2 border-emerald-400 p-2.5 rounded-xl text-xs font-black text-emerald-900 flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-700" />
              <span>Posizione salvata e visibile al docente!</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-800">
              Puoi toccare di nuovo l'albero per spostarla.
            </span>
          </div>
        )}

      </div>

      {/* AREA SCENARIO BLOB TREE (ZOOM & TOUCH INTERACTION) */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-2 flex flex-col items-center justify-center overflow-auto">
        <div 
          ref={containerRef}
          className="relative rounded-3xl border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden max-w-full flex items-center justify-center select-none"
          style={{
            maxHeight: 'calc(100vh - 280px)',
            minHeight: '320px',
            width: '100%'
          }}
        >
          <div 
            className="relative transition-transform duration-150 ease-out origin-center"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <img
              ref={imgRef}
              src={activeImageSrc}
              alt="Blob Tree"
              onClick={handleImageClick}
              className="max-h-[70vh] w-auto object-contain cursor-crosshair block"
              draggable={false}
            />

            {/* SEGNAPOSTI DELLO STUDENTE */}
            {markers.map((m, idx) => {
              const isSelected = m.id === selectedMarkerId;

              return (
                <div
                  key={m.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMarkerId(m.id);
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-transform ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                  style={{
                    left: `${m.x}%`,
                    top: `${m.y}%`,
                  }}
                >
                  {/* CORPO DEL PIN */}
                  <div 
                    className="w-9 h-9 rounded-full border-3 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-black text-xs text-black"
                    style={{ backgroundColor: m.color || '#FACC15' }}
                  >
                    {maxSelections > 1 ? `#${idx + 1}` : '★'}
                  </div>

                  {/* ETICHETTA NOME */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white border-2 border-black px-2 py-0.5 rounded-lg shadow-sm whitespace-nowrap text-[10px] font-black uppercase text-black">
                    {studentName}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* PANNELLO DI CONFIGURAZIONE SEGNAPOSTO SELEZIONATO & INVIO */}
      <footer className="sticky bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-4 border-black p-3.5 shadow-2xl">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* SE C'È UN SEGNAPOSTO: COLOR PICKER & NOTA */}
          {selectedMarker ? (
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-black uppercase text-gray-700">Colore:</span>
              <div className="flex items-center gap-1">
                {MARKER_COLORS.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleUpdateMarker(selectedMarker.id, { color: c.hex })}
                    className={`w-6 h-6 rounded-full border-2 border-black transition-transform cursor-pointer ${
                      selectedMarker.color === c.hex ? 'scale-125 ring-2 ring-black' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.label}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => handleDeleteMarker(selectedMarker.id)}
                className="ml-2 p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 border-2 border-rose-300 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                title="Elimina questo segnaposto"
              >
                <Trash2 size={13} />
                <span className="hidden sm:inline">Rimuovi</span>
              </button>
            </div>
          ) : (
            <div className="text-xs font-bold text-gray-500">
              Tocca un punto sull'albero per posizionare il tuo segnaposto.
            </div>
          )}

          {/* PULSANTE INVIA SCELTA */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isActive || markers.length === 0 || sending}
            className={`px-6 sm:px-8 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 transition-all cursor-pointer ${
              !isActive || markers.length === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-75 shadow-none'
                : 'bg-yellow-400 hover:bg-yellow-500 text-black active:translate-x-0.5 active:translate-y-0.5'
            }`}
          >
            {sending ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Invio in corso...</span>
              </>
            ) : sentSuccess ? (
              <>
                <Check size={18} className="stroke-[3]" />
                <span>Aggiorna Posizione</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Conferma Posizione</span>
              </>
            )}
          </button>

        </div>
      </footer>

    </div>
  );
}
