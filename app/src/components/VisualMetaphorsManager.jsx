import React, { useState, useRef, useMemo } from 'react';
import { 
  X, Plus, Eye, EyeOff, Trash2, Edit2, Copy, Star, 
  Layers, Upload, Check, AlertTriangle, Image as ImageIcon,
  Sparkles, CheckCircle2, SlidersHorizontal, ArrowLeft
} from 'lucide-react';
import { 
  createImageSet, 
  duplicateImageSet, 
  renameImageSet, 
  deleteImageSet, 
  toggleImageVisibility, 
  setAllImagesVisibility, 
  addImageToSet, 
  removeImageFromSet 
} from '../data/visualMetaphorsData';

export default function VisualMetaphorsManager({ 
  vmState, 
  onUpdateVmState, 
  onClose 
}) {
  const [selectedSetId, setSelectedSetId] = useState(vmState.activeSetId || vmState.sets[0]?.id);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'visible' | 'hidden'
  const [feedback, setFeedback] = useState(null);

  // Modali Set
  const [isNewSetModalOpen, setIsNewSetModalOpen] = useState(false);
  const [newSetName, setNewSetName] = useState('');
  const [newSetMode, setNewSetMode] = useState('duplicate'); // 'empty' | 'duplicate'
  const [newSetSourceId, setNewSetSourceId] = useState(selectedSetId);

  const [renamingSetId, setRenamingSetId] = useState(null);
  const [renamingSetName, setRenamingSetName] = useState('');

  // Upload file ref
  const fileInputRef = useRef(null);

  const flash = (msg, ms = 2200) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), ms);
  };

  // Set correntemente selezionato nell'editor
  const currentSet = useMemo(() => {
    return vmState.sets.find(s => s.id === selectedSetId) || vmState.sets[0];
  }, [vmState, selectedSetId]);

  // Statistiche del set
  const stats = useMemo(() => {
    if (!currentSet || !Array.isArray(currentSet.images)) {
      return { total: 0, visible: 0, hidden: 0 };
    }
    const total = currentSet.images.length;
    const hidden = currentSet.images.filter(img => img.hidden).length;
    const visible = total - hidden;
    return { total, visible, hidden };
  }, [currentSet]);

  // Immagini filtrate nell'editor
  const displayedImages = useMemo(() => {
    if (!currentSet?.images) return [];
    return currentSet.images.filter(img => {
      if (filterMode === 'visible') return !img.hidden;
      if (filterMode === 'hidden') return img.hidden;
      return true;
    });
  }, [currentSet, filterMode]);

  // --- AZIONI SUI SET ---
  const handleCreateSet = () => {
    const trimmed = newSetName.trim();
    if (!trimmed) return alert('Inserisci un nome per il nuovo set.');

    const nextState = createImageSet(vmState, {
      title: trimmed,
      sourceMode: newSetMode,
      sourceSetId: newSetSourceId
    });

    onUpdateVmState(nextState);
    setSelectedSetId(nextState.activeSetId);
    setIsNewSetModalOpen(false);
    setNewSetName('');
    flash(`Set "${trimmed}" creato con successo!`);
  };

  const handleDuplicateSet = (setId) => {
    const nextState = duplicateImageSet(vmState, setId);
    onUpdateVmState(nextState);
    setSelectedSetId(nextState.activeSetId);
    flash('Set duplicato con successo!');
  };

  const handleSaveRename = () => {
    if (!renamingSetName.trim() || !renamingSetId) return;
    const nextState = renameImageSet(vmState, renamingSetId, renamingSetName);
    onUpdateVmState(nextState);
    setRenamingSetId(null);
    flash('Nome set aggiornato!');
  };

  const handleDeleteSet = (setId) => {
    if (vmState.sets.length <= 1) {
      alert("Non puoi eliminare l'unico set disponibile.");
      return;
    }
    const target = vmState.sets.find(s => s.id === setId);
    if (!window.confirm(`Sei sicuro di voler eliminare definitivamente il set "${target?.title}"?`)) {
      return;
    }
    const nextState = deleteImageSet(vmState, setId);
    onUpdateVmState(nextState);
    setSelectedSetId(nextState.activeSetId);
    flash(`Set eliminato.`);
  };

  const handleSetActiveSet = (setId) => {
    onUpdateVmState({
      ...vmState,
      activeSetId: setId
    });
    flash('Set impostato come attivo per la classe!');
  };

  // --- AZIONI SULLE IMMAGINI ---
  const handleToggleVisibility = (imageId) => {
    const nextState = toggleImageVisibility(vmState, currentSet.id, imageId);
    onUpdateVmState(nextState);
  };

  const handleSetAllVisibility = (hideAll) => {
    const nextState = setAllImagesVisibility(vmState, currentSet.id, hideAll);
    onUpdateVmState(nextState);
    flash(hideAll ? 'Tutte le immagini nascoste alla classe' : 'Tutte le immagini visibili alla classe');
  };

  const handleRemoveImage = (imageId) => {
    if (!window.confirm(`Rimuovere questa immagine dal set?`)) return;
    const nextState = removeImageFromSet(vmState, currentSet.id, imageId);
    onUpdateVmState(nextState);
    flash('Immagine rimossa dal set.');
  };

  // Upload Immagini locali (ridimensionamento leggero)
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    let processedCount = 0;
    let tempState = vmState;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Ridimensiona se troppo grande per preservare memoria e Firestore
          const canvas = document.createElement('canvas');
          const maxDim = 1280;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          const compressedDataUrl = canvas.toDataURL('image/webp', 0.82);

          tempState = addImageToSet(tempState, currentSet.id, {
            src: compressedDataUrl,
            title: file.name.replace(/\.[^/.]+$/, ''),
            alt: file.name
          });

          processedCount++;
          if (processedCount === files.length) {
            onUpdateVmState(tempState);
            flash(`Aggiunte ${files.length} nuove immagini al set!`);
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in select-none">
      <div className="bg-[#FFFDF9] border-4 border-black rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        
        {/* ========================================================================= */}
        {/* HEADER MODALE */}
        {/* ========================================================================= */}
        <div className="bg-white p-4 sm:p-5 border-b-4 border-black flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-300 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
              <Layers size={24} className="text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                  Gestione Set &amp; Immagini
                </h2>
                <span className="bg-yellow-300 text-black border border-black px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider">
                  Fotolinguaggio
                </span>
              </div>
              <p className="text-xs font-bold text-gray-500">
                Personalizza i set, aggiungi nuove foto e scegli quali mostrare o nascondere alla classe.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {feedback && (
              <span className="bg-emerald-300 text-black border-2 border-black px-3 py-1 rounded-xl text-xs font-black animate-in fade-in shadow-xs hidden sm:inline-block">
                ✓ {feedback}
              </span>
            )}
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-black text-white hover:bg-yellow-300 hover:text-black border-2 border-black transition-colors"
              title="Chiudi (Esc)"
            >
              <X size={20} className="stroke-[3]" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CORPO MODALE: LAYOUT A 2 COLONNE (SIDEBAR SET + GRIGLIA FOTO) */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row min-h-0">
          
          {/* 1. SIDEBAR DEI SET (SINISTRA) */}
          <div className="w-full md:w-80 bg-white border-b-4 md:border-b-0 md:border-r-4 border-black p-4 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Layers size={14} />
                <span>I Tuoi Set ({vmState.sets.length})</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setNewSetName('');
                  setNewSetMode('duplicate');
                  setNewSetSourceId(selectedSetId);
                  setIsNewSetModalOpen(true);
                }}
                className="flex items-center gap-1 text-xs font-black px-2.5 py-1.5 bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                title="Crea un nuovo set"
              >
                <Plus size={14} className="stroke-[3]" />
                <span>Nuovo Set</span>
              </button>
            </div>

            {/* Lista Card dei Set */}
            <div className="space-y-2.5 flex-1">
              {vmState.sets.map(s => {
                const isActiveForClass = vmState.activeSetId === s.id;
                const isSelectedInEditor = selectedSetId === s.id;
                const totalImg = s.images?.length || 0;
                const hiddenImg = s.images?.filter(i => i.hidden)?.length || 0;

                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSetId(s.id)}
                    className={`p-3 rounded-2xl border-3 transition-all cursor-pointer ${
                      isSelectedInEditor
                        ? 'bg-yellow-50 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ring-2 ring-yellow-400'
                        : 'bg-gray-50 hover:bg-gray-100 border-black/20 hover:border-black'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="min-w-0">
                        <h4 className="font-black text-sm text-black truncate leading-snug">
                          {s.title}
                        </h4>
                        <span className="text-[11px] font-bold text-gray-500">
                          {totalImg} immagini {hiddenImg > 0 ? `(${hiddenImg} nascoste)` : ''}
                        </span>
                      </div>

                      {isActiveForClass && (
                        <span className="bg-black text-yellow-400 border border-black text-[9px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-0.5 shrink-0">
                          <Star size={10} className="fill-yellow-400" />
                          <span>Attivo</span>
                        </span>
                      )}
                    </div>

                    {/* Azioni rapide sul set */}
                    <div className="flex items-center justify-between pt-2 border-t border-black/10 mt-2">
                      {!isActiveForClass ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetActiveSet(s.id);
                          }}
                          className="text-[10px] font-black uppercase text-indigo-700 hover:text-black flex items-center gap-1"
                          title="Usa questo set per l'attività in classe"
                        >
                          <Star size={11} />
                          <span>Attiva in classe</span>
                        </button>
                      ) : (
                        <span className="text-[10px] font-black uppercase text-emerald-700 flex items-center gap-1">
                          <Check size={11} className="stroke-[3]" />
                          <span>In uso</span>
                        </span>
                      )}

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRenamingSetId(s.id);
                            setRenamingSetName(s.title);
                          }}
                          className="p-1 hover:bg-yellow-200 text-gray-700 rounded-md transition-colors"
                          title="Rinomina set"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateSet(s.id);
                          }}
                          className="p-1 hover:bg-yellow-200 text-gray-700 rounded-md transition-colors"
                          title="Duplica set"
                        >
                          <Copy size={13} />
                        </button>
                        {vmState.sets.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSet(s.id);
                            }}
                            className="p-1 hover:bg-rose-100 text-rose-700 rounded-md transition-colors"
                            title="Elimina set"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. CONTENUTO DEL SET SELEZIONATO: GESTIONE IMMAGINI & VISIBILITÀ (DESTRA) */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#FDFBF7] p-4 sm:p-6 overflow-y-auto custom-scrollbar">
            
            {/* Header del set selezionato */}
            <div className="bg-white p-4 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-black">
                      {currentSet.title}
                    </h3>
                    {vmState.activeSetId === currentSet.id ? (
                      <span className="bg-emerald-300 text-black border border-black text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                        ⭐ Set Attivo per la Classe
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetActiveSet(currentSet.id)}
                        className="bg-yellow-300 hover:bg-yellow-400 text-black border border-black text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs transition-colors"
                      >
                        Imposta come attivo per la classe
                      </button>
                    )}
                  </div>
                  {currentSet.description && (
                    <p className="text-xs font-bold text-gray-500 mt-0.5">
                      {currentSet.description}
                    </p>
                  )}
                </div>

                {/* Statistiche visibilità */}
                <div className="flex items-center gap-2">
                  <span className="bg-gray-100 border border-gray-300 px-3 py-1 rounded-xl text-xs font-bold text-gray-700">
                    <strong>{stats.total}</strong> foto • <strong className="text-emerald-700">{stats.visible}</strong> visibili • <strong className="text-rose-600">{stats.hidden}</strong> nascoste
                  </span>
                </div>
              </div>

              {/* Barra Strumenti Set: Azioni di massa & Aggiunta foto */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-black/10">
                {/* Filtro Visibilità */}
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border-2 border-black">
                  <button
                    type="button"
                    onClick={() => setFilterMode('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                      filterMode === 'all' ? 'bg-black text-white' : 'text-gray-700 hover:text-black'
                    }`}
                  >
                    Tutte ({stats.total})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterMode('visible')}
                    className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                      filterMode === 'visible' ? 'bg-emerald-400 text-black' : 'text-gray-700 hover:text-black'
                    }`}
                  >
                    Visibili ({stats.visible})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterMode('hidden')}
                    className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                      filterMode === 'hidden' ? 'bg-rose-300 text-black' : 'text-gray-700 hover:text-black'
                    }`}
                  >
                    Nascoste ({stats.hidden})
                  </button>
                </div>

                {/* Pulsanti Azioni Rapide */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Mostra / Nascondi tutte */}
                  <button
                    type="button"
                    onClick={() => handleSetAllVisibility(false)}
                    className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 border-2 border-black rounded-xl text-xs font-black flex items-center gap-1 transition-colors shadow-xs"
                    title="Rendi tutte le immagini visibili agli studenti"
                  >
                    <Eye size={14} />
                    <span>Mostra Tutte</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetAllVisibility(true)}
                    className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-800 border-2 border-black rounded-xl text-xs font-black flex items-center gap-1 transition-colors shadow-xs"
                    title="Nascondi tutte le immagini agli studenti"
                  >
                    <EyeOff size={14} />
                    <span>Nascondi Tutte</span>
                  </button>

                  {/* Aggiungi Foto da file */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-1.5 bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black rounded-xl text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                    title="Carica nuove foto da file dal tuo computer"
                  >
                    <Upload size={14} />
                    <span>+ Carica Foto</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Griglia Immagini del Set */}
            {displayedImages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white rounded-3xl border-3 border-dashed border-gray-300 text-center">
                <ImageIcon size={48} className="text-gray-400 mb-3" />
                <h4 className="font-black text-base text-gray-800 uppercase mb-1">
                  Nessuna immagine trovata con questo filtro
                </h4>
                <p className="text-xs font-bold text-gray-500 mb-4">
                  {filterMode === 'hidden'
                    ? 'Tutte le immagini di questo set sono visibili alla classe.'
                    : 'Non ci sono foto in questo set. Clicca su "+ Carica Foto" per aggiungerne.'}
                </p>
                {filterMode !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setFilterMode('all')}
                    className="px-4 py-2 bg-yellow-300 text-black border-2 border-black rounded-xl font-black text-xs uppercase shadow-xs"
                  >
                    Mostra tutte le foto
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 pb-6">
                {displayedImages.map(img => {
                  const isHidden = Boolean(img.hidden);

                  return (
                    <div
                      key={img.id}
                      className={`bg-white rounded-2xl border-3 border-black transition-all flex flex-col overflow-hidden relative ${
                        isHidden
                          ? 'opacity-65 bg-gray-100 shadow-xs'
                          : 'shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                      }`}
                    >
                      {/* Badge Numero */}
                      <div className="absolute top-2 left-2 z-10">
                        <span className="bg-yellow-300 text-black border-2 border-black font-black text-xs px-2 py-0.5 rounded-lg shadow-xs">
                          #{img.number}
                        </span>
                      </div>

                      {/* Badge Stato Nascosto se applicabile */}
                      {isHidden && (
                        <div className="absolute top-2 right-2 z-10">
                          <span className="bg-rose-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                            <EyeOff size={11} />
                            <span>Nascosta</span>
                          </span>
                        </div>
                      )}

                      {/* Immagine */}
                      <div className="relative aspect-[4/3] bg-gray-200 border-b-2 border-black overflow-hidden">
                        <img
                          src={img.src}
                          alt={img.alt}
                          loading="lazy"
                          className={`w-full h-full object-cover ${isHidden ? 'grayscale-40' : ''}`}
                        />
                      </div>

                      {/* Barra Controlli Singola Foto: Visibilità e Rimozione */}
                      <div className="p-2 bg-white flex items-center justify-between gap-1">
                        {/* Toggle Occhio Visibilità */}
                        <button
                          type="button"
                          onClick={() => handleToggleVisibility(img.id)}
                          className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-black uppercase tracking-wider border-2 border-black flex items-center justify-center gap-1.5 transition-colors ${
                            isHidden
                              ? 'bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-900'
                              : 'bg-emerald-200 hover:bg-rose-100 text-emerald-950 hover:text-rose-900'
                          }`}
                          title={isHidden ? "Clicca per mostrare alla classe" : "Clicca per nascondere alla classe"}
                        >
                          {isHidden ? (
                            <>
                              <EyeOff size={13} className="text-rose-600" />
                              <span>Mostra</span>
                            </>
                          ) : (
                            <>
                              <Eye size={13} className="text-emerald-800" />
                              <span>Visibile</span>
                            </>
                          )}
                        </button>

                        {/* Rimuovi Foto */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.id)}
                          className="p-1.5 hover:bg-rose-100 text-rose-700 rounded-xl border-2 border-transparent hover:border-black transition-colors"
                          title="Rimuovi questa foto dal set"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FOOTER MODALE */}
        {/* ========================================================================= */}
        <div className="bg-white p-3.5 sm:p-4 border-t-2 border-black/15 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs font-bold text-gray-600 flex items-center gap-2">
            <span>💡 <strong>Suggerimento</strong>: Le immagini contrassegnate come <em>Nascoste</em> non verranno mostrate alla classe durante la scelta sul proiettore o LIM.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-black text-white hover:bg-gray-800 rounded-xl font-black text-xs uppercase tracking-wider shadow-md ml-auto"
          >
            Fatto, Salva &amp; Chiudi
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODALE DIALOG: NUOVO SET */}
      {/* ========================================================================= */}
      {isNewSetModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 w-full max-w-md border-4 border-black">
            <h3 className="text-2xl font-black text-black mb-1.5">Nuovo Set Fotografico</h3>
            <p className="text-xs font-bold text-gray-500 mb-5">
              Crea una nuova raccolta tematica di immagini per il fotolinguaggio.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
                  Titolo del Set:
                </label>
                <input
                  type="text"
                  autoFocus
                  value={newSetName}
                  onChange={(e) => setNewSetName(e.target.value)}
                  placeholder="Es. Selezione Emozioni Primarie, Natura..."
                  className="w-full px-4 py-2.5 bg-gray-50 border-2 border-black rounded-xl font-bold text-sm text-black outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
                  Contenuto Iniziale:
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 p-3 rounded-xl border-2 border-black cursor-pointer bg-white hover:bg-yellow-50">
                    <input
                      type="radio"
                      name="newSetMode"
                      value="duplicate"
                      checked={newSetMode === 'duplicate'}
                      onChange={() => setNewSetMode('duplicate')}
                      className="accent-black w-4 h-4"
                    />
                    <div>
                      <span className="font-black text-xs block text-black">Duplica da un set esistente</span>
                      <span className="text-[11px] font-bold text-gray-500">
                        Copia tutte le immagini per fare poi una selezione
                      </span>
                    </div>
                  </label>

                  {newSetMode === 'duplicate' && (
                    <select
                      value={newSetSourceId}
                      onChange={(e) => setNewSetSourceId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 border-black rounded-xl font-bold text-xs text-black outline-none"
                    >
                      {vmState.sets.map(s => (
                        <option key={s.id} value={s.id}>
                          Sorgente: {s.title} ({s.images?.length || 0} foto)
                        </option>
                      ))}
                    </select>
                  )}

                  <label className="flex items-center gap-2.5 p-3 rounded-xl border-2 border-black cursor-pointer bg-white hover:bg-yellow-50">
                    <input
                      type="radio"
                      name="newSetMode"
                      value="empty"
                      checked={newSetMode === 'empty'}
                      onChange={() => setNewSetMode('empty')}
                      className="accent-black w-4 h-4"
                    />
                    <div>
                      <span className="font-black text-xs block text-black">Set vuoto da zero</span>
                      <span className="text-[11px] font-bold text-gray-500">
                        Aggiungerai tu le immagini caricandole da file
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsNewSetModalOpen(false)}
                className="px-4 py-2 rounded-xl font-black text-xs text-gray-700 hover:bg-gray-100 transition-all"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={handleCreateSet}
                disabled={!newSetName.trim()}
                className="px-5 py-2 bg-yellow-300 hover:bg-yellow-400 disabled:opacity-40 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                Crea Set
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALE DIALOG: RINOMINA SET */}
      {/* ========================================================================= */}
      {renamingSetId && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 w-full max-w-md border-4 border-black">
            <h3 className="text-2xl font-black text-black mb-1.5">Rinomina Set</h3>
            <p className="text-xs font-bold text-gray-500 mb-5">
              Modifica il titolo del set fotografico.
            </p>

            <div className="mb-5">
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
                Nome Set:
              </label>
              <input
                type="text"
                autoFocus
                value={renamingSetName}
                onChange={(e) => setRenamingSetName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && renamingSetName.trim()) {
                    handleSaveRename();
                  }
                }}
                className="w-full px-4 py-2.5 bg-gray-50 border-2 border-black rounded-xl font-bold text-sm text-black outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setRenamingSetId(null)}
                className="px-4 py-2 rounded-xl font-black text-xs text-gray-700 hover:bg-gray-100 transition-all"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={handleSaveRename}
                disabled={!renamingSetName.trim()}
                className="px-5 py-2 bg-yellow-300 hover:bg-yellow-400 disabled:opacity-40 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all"
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
