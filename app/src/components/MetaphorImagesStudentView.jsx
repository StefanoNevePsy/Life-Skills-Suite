import { newSessionCode } from '../lib/sessionCode';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Check, X, LogOut, ZoomIn, Eye, Sparkles, AlertCircle, 
  Send, RefreshCw, CheckCircle2, ChevronRight, User, Image as ImageIcon
} from 'lucide-react';
import { doc, collection, updateDoc } from '../lib/sessionStore';
import { resolveImageSrc, ensureImageLoaded, getCachedImage } from '../lib/customImageStorage';

export default function MetaphorImagesStudentView({
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
  const [selectedIds, setSelectedIds] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [, setForceUpdate] = useState(0);

  const maxSelections = Number(sessionData?.maxSelections) || 1;
  const isActive = Boolean(sessionData?.active);
  const images = Array.isArray(sessionData?.images) ? sessionData.images : [];

  // Ripristina l'eventuale selezione già inviata da questo dispositivo
  useEffect(() => {
    if (!studentName) return;
    const studentKey = user?.uid;
    const existing = sessionData?.participants?.[studentKey];
    if (existing && Array.isArray(existing.selectedImageIds)) {
      setSelectedIds(existing.selectedImageIds);
      setSentSuccess(true);
    }
  }, [studentName, sessionData]);

  // Assicura il caricamento delle immagini custom da Firestore se presenti
  useEffect(() => {
    if (!images || !db || !appId) return;
    images.forEach(img => {
      if (img.customImageId && !getCachedImage(img.customImageId)) {
        ensureImageLoaded(img.customImageId, db, appId).then(res => {
          if (res) setForceUpdate(k => k + 1);
        });
      }
    });
  }, [images, db, appId]);

  const toggleSelectImage = (imgId) => {
    if (!isActive) return;
    setErrorMessage('');

    if (selectedIds.includes(imgId)) {
      setSelectedIds(selectedIds.filter(id => id !== imgId));
    } else {
      if (selectedIds.length >= maxSelections) {
        if (maxSelections === 1) {
          // Se il limite è 1, sostituisce direttamente la scelta
          setSelectedIds([imgId]);
        } else {
          setErrorMessage(`Hai già scelto ${maxSelections} ${maxSelections === 1 ? 'immagine' : 'immagini'}. Deseleziona una carta prima di sceglierne un'altra.`);
        }
      } else {
        setSelectedIds([...selectedIds, imgId]);
      }
    }
  };

  const handleSubmit = async () => {
    if (!isActive) {
      alert("La sessione è stata chiusa dal docente.");
      return;
    }
    if (!studentName || studentName.trim().length < 2) {
      alert("Inserisci prima il tuo nome e cognome.");
      return;
    }
    if (selectedIds.length === 0) {
      alert("Seleziona almeno un'immagine prima di inviare.");
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
          selectedImageIds: selectedIds,
          timestamp: new Date().toISOString()
        }
      });

      setSentSuccess(true);
    } catch (err) {
      console.error("Errore salvataggio scelta fotolinguaggio:", err);
      setErrorMessage("Errore di connessione. Riprova tra poco.");
    } finally {
      setSending(false);
    }
  };

  // --- SCHERMATA INSERIMENTO NOME (se non ancora impostato) ---
  if (!studentName || studentName.trim().length < 2) {
    return (
      <div className="min-h-screen bg-yellow-50 flex flex-col justify-center items-center p-4 selection:bg-yellow-200">
        <div className="max-w-md w-full bg-white rounded-3xl border-4 border-black p-6 sm:p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-yellow-300 border-3 border-black flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <ImageIcon size={32} className="text-black" />
          </div>

          <span className="inline-block bg-black text-yellow-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 font-mono">
            Stanza {sessionCode}
          </span>

          <h2 className="text-2xl font-black text-black mb-1">Fotolinguaggio</h2>
          <p className="text-xs font-bold text-gray-600 mb-6">
            {sessionData?.setTitle || 'Metafore Visive'}
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
                placeholder="Es. Marco Rossi"
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
              <span>Accedi all'Attività</span>
              <ChevronRight size={18} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- VISTA PRINCIPALE GALLERIA STUDENTE ---
  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col font-sans selection:bg-yellow-200 pb-28">
      
      {/* BARRA SUPERIORE */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b-4 border-black px-4 py-3 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <div className="bg-black text-yellow-300 px-3 py-1 rounded-xl font-mono font-black text-sm">
              {sessionCode}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-black uppercase text-black leading-tight">
                {sessionData?.setTitle || 'Fotolinguaggio'}
              </span>
              <span className="text-[11px] font-bold text-gray-500">
                👤 {studentName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* BADGE STATO SESSIONE */}
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
              title="Esci dalla sessione"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Esci</span>
            </button>
          </div>

        </div>
      </header>

      {/* ISTRUZIONI & CONTATORE SCELTE */}
      <div className="max-w-5xl mx-auto w-full px-4 pt-4">
        
        {/* AVVISO SESSIONE CHIUSA */}
        {!isActive && (
          <div className="mb-4 bg-rose-100 border-3 border-black p-3.5 rounded-2xl flex items-center gap-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <AlertCircle size={22} className="text-rose-600 shrink-0" />
            <div className="text-xs font-bold text-rose-900">
              <span className="font-black uppercase">Sessione Chiusa:</span> Il docente ha terminato la raccolta delle scelte. Puoi comunque visualizzare le carte.
            </div>
          </div>
        )}

        {/* GUIDA RAPIDA */}
        <div className="bg-white border-3 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-300 border-2 border-black flex items-center justify-center shrink-0">
              <Sparkles size={20} className="text-black" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black uppercase text-black leading-snug">
                Scegli la tua Metafora Visiva
              </h1>
              <p className="text-xs text-gray-600 font-bold">
                Tocca un'immagine per selezionarla. Puoi scegliere fino a <strong>{maxSelections} {maxSelections === 1 ? 'immagine' : 'immagini'}</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs uppercase tracking-wider ${
              selectedIds.length === maxSelections 
                ? 'bg-emerald-300 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                : 'bg-yellow-100 text-yellow-900'
            }`}>
              Selezionate: {selectedIds.length} di {maxSelections}
            </span>
          </div>
        </div>

        {/* FEEDBACK ERRORI */}
        {errorMessage && (
          <div className="mb-4 bg-amber-100 border-2 border-amber-400 p-3 rounded-xl text-xs font-bold text-amber-900 flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-700 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* FEEDBACK INVIO AVVENUTO */}
        {sentSuccess && (
          <div className="mb-4 bg-emerald-100 border-3 border-black p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={20} className="text-emerald-700" />
              <span className="text-xs font-black text-emerald-900 uppercase">
                Scelta inviata con successo al docente!
              </span>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 hidden sm:inline">
              Puoi modificarla finché la sessione rimane aperta.
            </span>
          </div>
        )}

      </div>

      {/* GRIGLIA DELLE IMMAGINI */}
      <main className="max-w-5xl mx-auto w-full px-4 flex-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {images.map((img) => {
            const isSelected = selectedIds.includes(img.id);
            const imgSrc = resolveImageSrc(img);

            return (
              <div
                key={img.id}
                onClick={() => toggleSelectImage(img.id)}
                className={`group relative rounded-2xl overflow-hidden border-3 transition-all cursor-pointer select-none aspect-3/4 flex flex-col ${
                  isSelected
                    ? 'border-emerald-600 ring-4 ring-emerald-400/50 shadow-[4px_4px_0px_0px_rgba(5,150,105,1)] scale-[1.02]'
                    : 'border-black hover:border-yellow-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1'
                }`}
              >
                {/* IMMAGINE */}
                <div className="relative w-full h-full bg-gray-100">
                  <img
                    src={imgSrc}
                    alt={img.title || `Immagine #${img.id}`}
                    loading="lazy"
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                      isSelected ? 'brightness-105' : 'group-hover:scale-105'
                    }`}
                  />

                  {/* OVERLAY SCELTA */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-emerald-600/20 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-500 text-white border-3 border-black flex items-center justify-center shadow-lg animate-in zoom-in">
                        <Check size={28} className="stroke-[3]" />
                      </div>
                    </div>
                  )}

                  {/* BADGE NUMERO IMMAGINE */}
                  <div className="absolute top-2 left-2 bg-black/80 text-white font-mono font-black text-[11px] px-2 py-0.5 rounded-lg backdrop-blur-xs">
                    #{img.number || img.id}
                  </div>

                  {/* TASTO ZOOM PREVIEW */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewImage(img);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white text-black rounded-lg border border-black shadow-xs hover:scale-110 transition-transform"
                    title="Ingrandisci"
                  >
                    <ZoomIn size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* BARRA FLUTTUANTE IN BASSO PER CONFERMARE L'INVIO */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-4 border-black p-3.5 shadow-2xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          
          <div className="flex flex-col">
            <span className="text-xs font-black text-black">
              {selectedIds.length === 0 ? 'Nessuna carta scelta' : `${selectedIds.length} ${selectedIds.length === 1 ? 'carta selezionata' : 'carte selezionate'}`}
            </span>
            <span className="text-[11px] font-bold text-gray-500">
              {isActive ? 'Premi il pulsante per confermare la tua scelta' : 'Sessione chiusa'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isActive || selectedIds.length === 0 || sending}
            className={`px-5 sm:px-8 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 transition-all cursor-pointer ${
              !isActive || selectedIds.length === 0
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
                <span>Aggiorna Scelta</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Conferma e Invia ({selectedIds.length})</span>
              </>
            )}
          </button>

        </div>
      </footer>

      {/* MODALE DI PREVIEW / LIGHTBOX DELL'IMMAGINE */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="relative bg-white rounded-3xl border-4 border-black p-4 max-w-lg w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-black">
              <span className="font-mono font-black text-sm uppercase text-black">
                Immagine #{previewImage.number || previewImage.id}
              </span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-1 hover:bg-gray-100 rounded-lg text-black border border-black cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-hidden rounded-xl border-2 border-black bg-gray-100 mb-3 flex items-center justify-center">
              <img
                src={resolveImageSrc(previewImage)}
                alt={previewImage.title || `Immagine #${previewImage.id}`}
                className="max-h-[65vh] w-auto object-contain"
              />
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="text-xs font-bold text-gray-600">
                {selectedIds.includes(previewImage.id) ? '✓ Attualmente selezionata' : 'Non selezionata'}
              </span>

              <button
                type="button"
                onClick={() => {
                  toggleSelectImage(previewImage.id);
                  setPreviewImage(null);
                }}
                className={`px-4 py-2 rounded-xl border-2 border-black font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer ${
                  selectedIds.includes(previewImage.id)
                    ? 'bg-rose-200 text-rose-900 hover:bg-rose-300'
                    : 'bg-yellow-300 text-black hover:bg-yellow-400'
                }`}
              >
                {selectedIds.includes(previewImage.id) ? 'Deseleziona' : 'Scegli Questa Carta'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
