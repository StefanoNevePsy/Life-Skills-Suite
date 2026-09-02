import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Settings, FileJson, Upload, Eye, Check, Trash2, Plus } from 'lucide-react';
import { etLoadImages, etSaveImages, etStripImages } from '../lib/thermometerStorage';
import FullscreenButton from './FullscreenButton';

// Tinta di base per ogni emozione: al crescere dell'intensità il colore si
// scurisce e si satura, così la scala si legge a colpo d'occhio.
const ET_HUES = { rabbia: 0, felicita: 35, tristezza: 200, paura: 260, disgusto: 145, sorpresa: 55 };

function etColor(id, intensity, max) {
  const hue = ET_HUES[id] !== undefined ? ET_HUES[id] : 0;
  const lightness = 95 - intensity * (45 / (max || 1));
  const saturation = 60 + intensity * (40 / (max || 1));
  return `hsl(${hue},${saturation}%,${lightness}%)`;
}

const SCALE_NUMBERS = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

/**
 * Termometro delle emozioni.
 *
 * Tre viste: il menu con le emozioni disponibili, l'esercizio in cui si
 * ordinano le carte per intensità crescente, e l'editor per personalizzare
 * etichette e immagini di ogni livello.
 */
export default function EmotionThermometer({ data, onUpdate, onClose }) {
  const [emotions, setEmotions] = useState(data || []);
  const [view, setView] = useState('menu');
  const [activeId, setActiveId] = useState(null);
  const [pool, setPool] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const fileRef = useRef(null);

  // Le immagini vivono in IndexedDB, non nei dati sincronizzati: al montaggio
  // vanno riagganciate alla struttura.
  useEffect(() => {
    etLoadImages(emotions).then((merged) => {
      const changed = merged.some((emo, ei) =>
        emo.levels.some(
          (lv, li) =>
            lv.image !== (emotions[ei] && emotions[ei].levels[li] ? emotions[ei].levels[li].image : null),
        ),
      );
      if (changed) setEmotions(merged);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Salva le immagini in locale e propaga verso l'alto la versione alleggerita. */
  const doUpdate = (next) => {
    setEmotions(next);
    etSaveImages(next);
    onUpdate(etStripImages(next));
  };

  const activeEmotion = emotions.find((e) => e.id === activeId);

  const startExercise = (id) => {
    setActiveId(id);
    const emotion = emotions.find((e) => e.id === id);
    const shuffled = [...emotion.levels].sort(() => Math.random() - 0.5);
    setPool(shuffled);
    setSlots(new Array(shuffled.length).fill(null));
    setFeedback(null);
    setSelected(null);
    setView('exercise');
  };

  const showSolution = () => {
    if (!activeEmotion) return;
    setSlots([...activeEmotion.levels].sort((a, b) => a.intensity - b.intensity));
    setPool([]);
    setFeedback('correct');
    setSelected(null);
  };

  const handlePoolClick = (item) => {
    if (feedback === 'correct') return;
    setSelected(selected && selected.intensity === item.intensity ? null : item);
  };

  const handleSlotClick = (idx) => {
    if (feedback === 'correct') return;

    if (selected && slots[idx] === null) {
      const next = [...slots];
      next[idx] = selected;
      setSlots(next);
      setPool((prev) => prev.filter((i) => i.intensity !== selected.intensity));
      setSelected(null);
      setFeedback(null);
    } else if (slots[idx] !== null) {
      // Cliccare una casella piena rimette la carta nel mazzo.
      const item = slots[idx];
      const next = [...slots];
      next[idx] = null;
      setSlots(next);
      setPool((prev) => [...prev, item]);
      setFeedback(null);
    }
  };

  const checkSolution = () => {
    if (slots.some((s) => s === null)) return;
    setFeedback(slots.every((s, i) => s.intensity === i + 1) ? 'correct' : 'incorrect');
  };

  // Scorciatoia: con una carta selezionata, i tasti 1-9 la piazzano.
  useEffect(() => {
    const handler = (e) => {
      if (view !== 'exercise' || feedback === 'correct' || !selected) return;
      if (e.key < '1' || e.key > '9') return;

      const idx = parseInt(e.key, 10) - 1;
      if (idx < 0 || idx >= slots.length) return;

      const existing = slots[idx];
      const next = [...slots];
      next[idx] = selected;
      setSlots(next);
      setPool((prev) => {
        const rest = prev.filter((i) => i.intensity !== selected.intensity);
        if (existing) rest.push(existing);
        return rest;
      });
      setSelected(null);
      setFeedback(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [view, feedback, selected, slots]);

  const mapActiveLevels = (fn) =>
    doUpdate(emotions.map((e) => (e.id === activeId ? { ...e, levels: e.levels.map(fn) } : e)));

  const handleLabelChange = (text, levelIdx) =>
    mapActiveLevels((l, i) => (i === levelIdx ? { ...l, label: text } : l));

  const removeImage = (levelIdx) => mapActiveLevels((l, i) => (i === levelIdx ? { ...l, image: null } : l));

  const handleImageUpload = (file, levelIdx) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => mapActiveLevels((l, i) => (i === levelIdx ? { ...l, image: reader.result } : l));
    reader.readAsDataURL(file);
  };

  const addLevel = () =>
    doUpdate(
      emotions.map((e) =>
        e.id !== activeId
          ? e
          : {
              ...e,
              levels: [...e.levels, { intensity: e.levels.length + 1, label: 'Nuovo', emoji: '😐', image: null }],
            },
      ),
    );

  const removeLevel = (idx) =>
    doUpdate(
      emotions.map((e) => {
        if (e.id !== activeId) return e;
        const filtered = e.levels.filter((_, i) => i !== idx);
        // Le intensità si rinumerano per restare consecutive.
        return { ...e, levels: filtered.map((l, i) => ({ ...l, intensity: i + 1 })) };
      }),
    );

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(emotions, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `termometro_emozioni_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const importJson = (evt) => {
    const file = evt.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!Array.isArray(parsed) || !parsed[0] || !parsed[0].id || !parsed[0].levels) {
          alert('File non valido.');
          return;
        }
        doUpdate(parsed);
        alert('Importazione completata!');
      } catch {
        alert("Errore durante l'importazione.");
      }
    };
    reader.readAsText(file);
    evt.target.value = '';
  };

  const neoButton =
    'border-4 border-black rounded-xl font-bold px-4 py-2 flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none';

  return (
    <div className="min-h-screen bg-[#FFFBEB] p-4 md:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto mb-6 flex justify-between items-center">
        <button
          onClick={view === 'menu' ? onClose : () => setView('menu')}
          className="flex items-center gap-2 font-bold text-gray-700 bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md border border-transparent hover:border-black"
        >
          <ArrowLeft size={18} /> {view === 'menu' ? 'Dashboard' : 'Menu'}
        </button>
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-center">
          Emo <span className="text-[#FFA500]">Thermo</span>
        </h1>
        <div className="flex items-center gap-2">
          <input type="file" accept=".json" ref={fileRef} className="hidden" onChange={importJson} />
          <button
            onClick={exportJson}
            title="Esporta JSON"
            className="p-2 rounded-lg hover:bg-gray-100 border border-gray-200"
          >
            <FileJson size={18} />
          </button>
          <button
            onClick={() => fileRef.current && fileRef.current.click()}
            title="Importa JSON"
            className="p-2 rounded-lg hover:bg-gray-100 border border-gray-200"
          >
            <Upload size={18} />
          </button>
          <FullscreenButton className="" />
        </div>
      </div>

      {view === 'menu' && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {emotions.map((em) => (
            <div key={em.id} className="relative group">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveId(em.id);
                  setView('editor');
                }}
                className="absolute top-4 right-4 z-10 p-2 bg-white border-2 border-black rounded-lg hover:bg-gray-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
                title="Modifica set"
              >
                <Settings size={20} />
              </button>
              <div
                onClick={() => startExercise(em.id)}
                className="h-64 flex flex-col items-center justify-center relative overflow-hidden border-4 border-black rounded-2xl bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 cursor-pointer"
                style={{ backgroundColor: em.colorHex }}
              >
                <div className="text-7xl mb-4 filter drop-shadow-lg">{em.baseEmoji}</div>
                <h2 className="text-2xl font-black uppercase tracking-wider bg-black text-white px-4 py-1 rounded-full transform -rotate-2">
                  {em.label}
                </h2>
                <div className="absolute bottom-4 text-xs font-bold opacity-50 uppercase tracking-widest">
                  {em.levels.length} Livelli
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'exercise' && activeEmotion && (
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
          <div className="w-full md:w-5/12 lg:w-4/12 flex flex-col gap-4">
            <div
              className="bg-white border-4 border-black rounded-3xl p-4 md:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative flex gap-4"
              style={{ minHeight: '650px' }}
            >
              <div className="w-12 md:w-16 flex flex-col justify-between items-center py-2 border-r-4 border-slate-200 border-dashed shrink-0 gap-2">
                {SCALE_NUMBERS.map((num) => (
                  <div key={num} className="relative w-full text-center flex items-center justify-center">
                    <span className="font-black text-gray-300 text-lg md:text-xl">{num}</span>
                  </div>
                ))}
              </div>

              <div className="flex-1 flex flex-col relative h-full">
                <div className="text-center mb-4 border-b-4 border-black pb-2 shrink-0">
                  <h3 className="text-xl font-black uppercase tracking-wide">{activeEmotion.label}</h3>
                </div>

                {/* colonna rovesciata: l'intensità 1 sta in basso */}
                <div className="flex-1 flex flex-col-reverse justify-between gap-2 py-2">
                  {slots.map((slot, idx) => {
                    const intensity = idx + 1;
                    const maxIntensity = activeEmotion.levels.length;
                    const solved = feedback === 'correct';
                    const wrong = feedback === 'incorrect' && slot && slot.intensity !== intensity;

                    return (
                      <div key={idx} className="flex items-center gap-3 w-full shrink-0">
                        <span className="font-black font-mono text-lg w-6 text-center text-gray-400">
                          #{intensity}
                        </span>
                        <div
                          onClick={() => handleSlotClick(idx)}
                          style={solved ? { backgroundColor: etColor(activeEmotion.id, intensity, maxIntensity) } : {}}
                          className={`flex-1 h-20 md:h-24 border-4 border-black rounded-xl flex items-center justify-between p-2 cursor-pointer transition-all duration-300 ${
                            !slot && selected ? 'bg-[#FFFBEB] ring-4 ring-yellow-400 ring-opacity-50' : 'bg-white'
                          } ${wrong ? 'bg-red-200 animate-pulse border-red-500' : ''}`}
                        >
                          {slot ? (
                            <>
                              <div className="w-16 h-16 border-2 border-black rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 shrink-0 shadow-sm p-1">
                                {slot.image ? (
                                  <img src={slot.image} alt={slot.label} className="w-full h-full object-contain" />
                                ) : (
                                  <span className="text-3xl">{slot.emoji}</span>
                                )}
                              </div>
                              <span
                                className={`font-black text-sm md:text-base uppercase text-right flex-1 break-words ml-2 leading-tight ${
                                  solved && intensity > Math.ceil(maxIntensity / 2)
                                    ? 'text-white drop-shadow-md'
                                    : 'text-black'
                                }`}
                              >
                                {slot.label}
                              </span>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center opacity-20">
                              <div className="w-3 h-3 bg-black rounded-full mx-1" />
                              <div className="w-3 h-3 bg-black rounded-full mx-1" />
                              <div className="w-3 h-3 bg-black rounded-full mx-1" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => startExercise(activeEmotion.id)} className={`flex-1 ${neoButton} bg-white hover:bg-gray-50`}>
                ↺ Reset
              </button>
              <button
                onClick={showSolution}
                disabled={feedback === 'correct'}
                className={`flex-1 ${neoButton} bg-blue-100 hover:bg-blue-200`}
              >
                <Eye size={18} /> Soluzione
              </button>
              <button
                onClick={checkSolution}
                disabled={feedback === 'correct'}
                className={`flex-1 ${neoButton} ${
                  feedback === 'correct' ? 'bg-[#B5EAD7] opacity-80' : 'bg-[#FFD8B3] hover:bg-[#ffcc99]'
                }`}
              >
                <Check size={18} /> {feedback === 'correct' ? 'Bravo!' : 'Verifica'}
              </button>
            </div>
          </div>

          <div
            className="flex-1 w-full bg-white border-4 border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            style={{ minHeight: '650px' }}
          >
            <h3 className="text-xl font-black uppercase mb-6 border-b-4 border-black inline-block px-2">
              Carte da ordinare
            </h3>

            {feedback === 'correct' ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <span className="text-8xl mb-6">🎉</span>
                <h2 className="text-4xl font-black mb-2">OTTIMO!</h2>
                <p>
                  Hai completato la scala. Nota come l'emozione diventa più{' '}
                  <span className="text-[#FFA500]">intensa</span> salendo!
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                  {pool.length > 0 ? (
                    pool.map((item) => (
                      <div
                        key={item.intensity}
                        onClick={() => handlePoolClick(item)}
                        className={`cursor-pointer border-4 border-black rounded-xl p-4 flex flex-col items-center gap-3 transition-all duration-200 ${
                          selected && selected.intensity === item.intensity
                            ? 'bg-[#FFF59D] translate-x-1 translate-y-1 shadow-none ring-2 ring-black'
                            : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
                        }`}
                      >
                        <div className="w-full aspect-square border-2 border-black rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 p-1">
                          {item.image ? (
                            <img src={item.image} alt={item.label} className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-5xl">{item.emoji}</span>
                          )}
                        </div>
                        <span className="font-black text-sm md:text-base uppercase text-center leading-tight">
                          {item.label}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-20 text-gray-400 font-bold border-4 border-dashed border-gray-200 rounded-xl">
                      Tutte le carte sono state posizionate. Clicca su "Verifica" a sinistra!
                    </div>
                  )}
                </div>
                {pool.length > 0 && (
                  <p className="text-xs text-gray-400 mt-6 text-center hidden md:block uppercase font-bold tracking-widest opacity-60">
                    (Suggerimento: Puoi anche premere 1-{slots.length} sulla tastiera)
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {view === 'editor' && activeEmotion && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border-4 border-black rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8 border-b-4 border-black pb-6">
              <div
                className="w-20 h-20 rounded-full border-4 border-black flex items-center justify-center text-4xl shadow-md"
                style={{ backgroundColor: activeEmotion.colorHex }}
              >
                {activeEmotion.baseEmoji}
              </div>
              <div>
                <h2 className="text-3xl font-black uppercase">Modifica: {activeEmotion.label}</h2>
                <p className="text-gray-500 font-bold">Personalizza parole e immagini.</p>
              </div>
            </div>

            <div className="space-y-4">
              {activeEmotion.levels.map((level, idx) => (
                <div
                  key={idx}
                  className="flex flex-col md:flex-row gap-4 items-center bg-gray-50 p-4 border-2 border-black rounded-xl hover:bg-white transition-colors relative group"
                >
                  <div className="font-black font-mono text-xl text-gray-400 w-8 text-center">
                    #{level.intensity}
                  </div>

                  <div className="relative w-24 h-24 shrink-0 border-2 border-black rounded-lg overflow-hidden bg-white flex items-center justify-center group shadow-sm p-1">
                    {level.image ? (
                      <img src={level.image} alt="preview" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-4xl">{level.emoji}</span>
                    )}
                    {level.image && (
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200"
                      >
                        <Trash2 size={24} />
                      </button>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-3">
                    <div>
                      <label className="text-xs font-black uppercase mb-1 block text-gray-500">Etichetta</label>
                      <input
                        type="text"
                        value={level.label}
                        onChange={(e) => handleLabelChange(e.target.value, idx)}
                        className="w-full border-2 border-black rounded-lg px-3 py-2 font-bold focus:outline-none focus:ring-4 focus:ring-yellow-200 text-lg"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="cursor-pointer inline-flex items-center gap-2 bg-white border-2 border-black px-4 py-2 rounded-lg font-bold hover:bg-gray-100 text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none transition-all">
                        <Upload size={16} /> Carica Immagine
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e.target.files[0], idx)}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="ml-2">
                    <button
                      onClick={() => removeLevel(idx)}
                      className="border-4 border-black rounded-xl font-bold p-2 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-red-50 text-red-500 active:translate-y-1 active:shadow-none"
                      title="Elimina questo livello"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={addLevel}
                className="w-full border-4 border-dashed border-gray-300 rounded-xl py-4 flex items-center justify-center gap-2 text-gray-500 hover:border-black hover:text-black hover:bg-gray-50 transition-all font-bold text-lg"
              >
                <Plus size={24} /> Aggiungi Livello
              </button>
            </div>

            <div className="mt-8 flex justify-end pt-6 border-t-4 border-black">
              <button
                onClick={() => setView('menu')}
                className={`${neoButton} px-8 py-3 bg-[#FFD8B3] text-black hover:bg-[#ffcc99] text-lg`}
              >
                <Check size={24} /> Fatto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
