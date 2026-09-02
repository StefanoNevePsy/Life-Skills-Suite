import React, { useState, useEffect, useRef } from 'react';
import { Heart, X, Check, Eye, EyeOff, RefreshCw, ChevronDown, Settings, ZoomIn, ZoomOut } from 'lucide-react';
import EmotionWheelSVG from './EmotionWheelSVG';
import { WHEEL_DATA_DEFAULT } from '../data/wheelData';
import {
  getWheelMode,
  getWheelData,
  setWheelData,
  getWheelPalette,
  setWheelPalette,
  LS_WHEEL_ACTIVE_SET,
} from '../lib/wheel';
import { getSavedSets, saveScenarioSet, deleteScenarioSet, LS_SETS_KEY } from '../lib/sets';

const LENS_SIZE = 330;
const PALETTE_LABELS = { insideout: 'Inside Out', pastel: 'Pastello', vivid: 'Vivido' };

/**
 * Ruota delle emozioni a schermo intero.
 *
 * Due modalità: l'immagine originale (con mappatura a coordinate) oppure la
 * ruota SVG generata e cliccabile. In entrambe una lente segue il puntatore
 * per leggere le etichette più piccole.
 */
export default function EmotionWheelModal({
  isOpen,
  onClose,
  targetEmotion,
  targetCoordinates,
  isMappingMode,
  onMapCoordinate,
  onNextEmotion,
  allScenarios,
  onSelectEmotion,
}) {
  const [lens, setLens] = useState({ show: false, x: 0, y: 0, width: 0, height: 0 });
  const [imgSrc, setImgSrc] = useState('ruota_.png');
  const [zoom, setZoom] = useState(1.5);
  const [showMapped, setShowMapped] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [wheelData, setWheelDataState] = useState(() => getWheelData() || WHEEL_DATA_DEFAULT);
  const [menuOpen, setMenuOpen] = useState(false);
  const [palette, setPalette] = useState(() => getWheelPalette());
  const [wheelSets, setWheelSets] = useState(() => getSavedSets().filter((s) => s.type === 'wheel'));
  const [setName, setSetName] = useState('');
  const [activeSetId, setActiveSetId] = useState(() => localStorage.getItem(LS_WHEEL_ACTIVE_SET) || null);

  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setLens((prev) => ({ ...prev, show: false }));
      setShowMapped(false);
      setJustSaved(false);
    }
  }, [isOpen]);

  // Con un set attivo, ogni modifica alla ruota vi viene risincronizzata:
  // il set è la fonte da cui si estrae, non una copia scollegata.
  useEffect(() => {
    if (!activeSetId) return;
    const all = getSavedSets();
    const idx = all.findIndex((s) => s.id === activeSetId);
    if (idx < 0) return;
    all[idx].data = JSON.parse(JSON.stringify(wheelData));
    localStorage.setItem(LS_SETS_KEY, JSON.stringify(all));
    setWheelSets(all.filter((s) => s.type === 'wheel'));
  }, [wheelData, activeSetId]);

  const confirmSave = (payload) => {
    onMapCoordinate(payload);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1500);
  };

  const handleEditLabel = (label, ring, ...idx) => {
    const next = prompt('Modifica emozione:', label);
    if (next === null || !next.trim() || next.trim() === label) return;

    const data = JSON.parse(JSON.stringify(wheelData));
    if (ring === 'core') data[idx[0]].core = next.trim();
    else if (ring === 'secondary') data[idx[0]].secondary[idx[1]].name = next.trim();
    else if (ring === 'tertiary') data[idx[0]].secondary[idx[1]].tertiary[idx[2]] = next.trim();

    setWheelDataState(data);
    setWheelData(data);
  };

  if (!isOpen) return null;

  const moveLens = (clientX, clientY) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    // Un margine di tolleranza evita che la lente sfarfalli sui bordi.
    if (x < -20 || y < -20 || x > width + 20 || y > height + 20) {
      setLens((prev) => ({ ...prev, show: false }));
      return;
    }
    setLens({ show: true, x, y, width, height });
  };

  const handleMouseMove = (e) => !isMappingMode && moveLens(e.clientX, e.clientY);
  const handleTouchMove = (e) => {
    if (isMappingMode) return;
    const touch = e.touches[0];
    moveLens(touch.clientX, touch.clientY);
  };

  const handleImageClick = (e) => {
    if (!isMappingMode || !onMapCoordinate) return;
    const rect = containerRef.current.getBoundingClientRect();
    confirmSave({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const zoomIn = (e) => {
    e.stopPropagation();
    setZoom((z) => Math.min(z + 0.5, 5));
  };
  const zoomOut = (e) => {
    e.stopPropagation();
    setZoom((z) => Math.max(z - 0.5, 1.5));
  };

  /** Inclinazione del marcatore, così segue l'orientamento radiale della ruota. */
  const markerAngle = (coord) => {
    if (!coord) return 0;
    return Math.atan2(coord.y - 50, coord.x - 50) * (180 / Math.PI);
  };

  const hoverHandlers = {
    onMouseEnter: () => !isMappingMode && setLens((prev) => ({ ...prev, show: true })),
    onMouseLeave: () => setLens((prev) => ({ ...prev, show: false })),
    onMouseMove: handleMouseMove,
    onTouchStart: () => !isMappingMode && setLens((prev) => ({ ...prev, show: true })),
    onTouchMove: handleTouchMove,
    onTouchEnd: () => setLens((prev) => ({ ...prev, show: false })),
  };

  const markerBox = { width: '18%', height: '6%', borderRadius: '50%' };
  const isSvgMode = getWheelMode() === 'svg';

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-3xl p-4 max-w-3xl w-full max-h-[95vh] flex flex-col border-4 ${
          isMappingMode ? 'border-blue-500' : 'border-black'
        } shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="flex flex-col items-start gap-1 w-full mr-4">
            <h3 className="text-2xl font-black uppercase text-pink-500 flex items-center gap-2">
              <Heart className="fill-pink-500" /> Ruota delle Emozioni
            </h3>

            {targetEmotion && (
              <div className="flex flex-wrap items-center gap-2 mt-1 w-full">
                <span className="text-sm font-bold text-gray-600">Target:</span>

                {isMappingMode ? (
                  <div className="relative">
                    <select
                      className="appearance-none bg-red-50 text-red-600 font-black border border-red-200 rounded-lg px-3 py-1 pr-8 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={targetEmotion}
                      onChange={(e) => onSelectEmotion(e.target.value)}
                    >
                      {allScenarios &&
                        allScenarios.map((s) => (
                          <option key={s.id} value={s.text}>
                            {s.text}
                          </option>
                        ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-400 pointer-events-none"
                    />
                  </div>
                ) : (
                  <span className="text-red-500 bg-red-50 px-3 py-1 rounded-lg border border-red-200 font-black shadow-sm text-sm">
                    {targetEmotion}
                  </span>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  {isMappingMode && (
                    <>
                      {justSaved && (
                        <span className="text-green-600 font-bold text-xs animate-pulse flex items-center gap-1">
                          <Check size={14} /> Salvato!
                        </span>
                      )}
                      <button
                        onClick={() => setShowMapped(!showMapped)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all border ${
                          showMapped
                            ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}
                        title="Mostra/Nascondi tutti i mappati"
                      >
                        {showMapped ? <Eye size={14} /> : <EyeOff size={14} />}{' '}
                        <span className="hidden sm:inline">Mappati</span>
                      </button>
                    </>
                  )}
                  {onNextEmotion && (
                    <button
                      onClick={onNextEmotion}
                      className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-200 border border-blue-300 transition-all shadow-sm"
                      title="Estrai prossima emozione"
                    >
                      <RefreshCw size={14} /> Prossima
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full border-2 border-transparent hover:border-black transition-all self-start mt-1"
          >
            <X size={24} />
          </button>

          {isSvgMode && (
            <div className="relative self-start mt-1">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`p-2 rounded-full border-2 transition-all ${
                  menuOpen
                    ? 'bg-gray-900 border-black text-white'
                    : 'hover:bg-gray-100 border-transparent hover:border-black'
                }`}
                title="Impostazioni ruota"
              >
                <Settings size={20} />
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 top-12 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 z-[100] w-56"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h4 className="font-black text-xs uppercase tracking-widest text-gray-500 mb-3">Palette</h4>
                  <div className="flex gap-2 mb-4">
                    {Object.keys(PALETTE_LABELS).map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          setPalette(p);
                          setWheelPalette(p);
                        }}
                        className={`flex-1 py-2 rounded-xl text-xs font-black border-2 transition-all ${
                          palette === p
                            ? 'bg-black text-white border-black'
                            : 'bg-gray-100 border-gray-300 hover:border-black'
                        }`}
                      >
                        {PALETTE_LABELS[p]}
                      </button>
                    ))}
                  </div>

                  <hr className="border-gray-200 mb-3" />
                  <button
                    onClick={() => {
                      setEditMode(!editMode);
                      setMenuOpen(false);
                    }}
                    className={`w-full py-2 rounded-xl text-sm font-black border-2 transition-all mb-2 ${
                      editMode
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-gray-100 border-gray-300 hover:border-black'
                    }`}
                  >
                    {editMode ? 'Chiudi Editor' : 'Modifica Etichette'}
                  </button>

                  <hr className="border-gray-200 my-3" />
                  <h4 className="font-black text-xs uppercase tracking-widest text-gray-500 mb-2">Set Ruota</h4>

                  <div className="flex gap-1 mb-2">
                    <input
                      type="text"
                      value={setName}
                      onChange={(e) => setSetName(e.target.value)}
                      placeholder="Nome set..."
                      className="flex-1 min-w-0 px-2 py-1.5 text-xs rounded-lg border-2 border-gray-300 focus:border-black outline-none"
                    />
                    <button
                      onClick={() => {
                        const name = setName.trim();
                        if (!name) return;
                        saveScenarioSet(name, 'wheel', JSON.parse(JSON.stringify(wheelData)));
                        setWheelSets(getSavedSets().filter((s) => s.type === 'wheel'));
                        setSetName('');
                      }}
                      disabled={!setName.trim()}
                      className="px-2 py-1.5 text-xs font-black rounded-lg border-2 border-black bg-black text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800"
                    >
                      Salva
                    </button>
                  </div>

                  {activeSetId && (
                    <div className="flex items-center gap-1 text-[10px] font-black mb-2 bg-green-50 border-2 border-green-600 rounded-lg px-2 py-1">
                      <span className="text-green-700">● ATTIVO</span>
                      <button
                        onClick={() => {
                          setActiveSetId(null);
                          localStorage.removeItem(LS_WHEEL_ACTIVE_SET);
                        }}
                        className="ml-auto text-gray-500 hover:text-red-600"
                      >
                        Disattiva
                      </button>
                    </div>
                  )}

                  {wheelSets.length > 0 && (
                    <div className="max-h-40 overflow-y-auto mb-2 space-y-1">
                      {wheelSets.map((set) => (
                        <div
                          key={set.id}
                          className={`flex items-center gap-1 text-xs border rounded-lg p-1 ${
                            set.id === activeSetId ? 'bg-green-50 border-green-600' : 'bg-gray-50 border-gray-300'
                          }`}
                        >
                          {set.id === activeSetId && <span className="text-green-600 font-black">●</span>}
                          <span className="flex-1 truncate font-bold" title={set.name}>
                            {set.name}
                          </span>
                          <button
                            onClick={() => {
                              setWheelDataState(set.data);
                              setWheelData(set.data);
                              setActiveSetId(set.id);
                              localStorage.setItem(LS_WHEEL_ACTIVE_SET, set.id);
                              setMenuOpen(false);
                            }}
                            title="Carica e attiva"
                            className="px-1.5 py-0.5 rounded bg-green-100 border border-green-600 text-green-700 hover:bg-green-200 font-black"
                          >
                            ▶
                          </button>
                          <button
                            onClick={() => {
                              saveScenarioSet(set.name + ' (copia)', 'wheel', JSON.parse(JSON.stringify(set.data)));
                              setWheelSets(getSavedSets().filter((s) => s.type === 'wheel'));
                            }}
                            title="Duplica"
                            className="px-1.5 py-0.5 rounded bg-blue-100 border border-blue-600 text-blue-700 hover:bg-blue-200 font-black"
                          >
                            ⧉
                          </button>
                          <button
                            onClick={() => {
                              if (!window.confirm("Eliminare '" + set.name + "'?")) return;
                              deleteScenarioSet(set.id);
                              if (set.id === activeSetId) {
                                setActiveSetId(null);
                                localStorage.removeItem(LS_WHEEL_ACTIVE_SET);
                              }
                              setWheelSets(getSavedSets().filter((s) => s.type === 'wheel'));
                            }}
                            title="Elimina"
                            className="px-1.5 py-0.5 rounded bg-red-100 border border-red-600 text-red-700 hover:bg-red-200 font-black"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <hr className="border-gray-200 mb-3" />
                  <button
                    onClick={() => {
                      if (!window.confirm('Ripristinare la ruota originale?')) return;
                      setWheelDataState(WHEEL_DATA_DEFAULT);
                      localStorage.removeItem('lss_wheel_data');
                      setMenuOpen(false);
                    }}
                    className="w-full py-2 rounded-xl text-sm font-black border-2 border-gray-300 bg-gray-100 hover:border-red-500 hover:text-red-600 transition-all"
                  >
                    Ripristina Originale
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 bg-gray-50 rounded-xl p-4 flex items-center justify-center border-4 border-black min-h-[300px] relative z-10">
          {isSvgMode ? (
            <div
              className="relative w-full h-full flex items-center justify-center cursor-zoom-in"
              ref={containerRef}
              {...hoverHandlers}
            >
              <EmotionWheelSVG
                wheelData={wheelData}
                palette={palette}
                highlightEmotion={targetEmotion || null}
                onEmotionClick={(label, ring, core) => {
                  if (isMappingMode && onMapCoordinate) {
                    confirmSave({ emotion: label, ring, core });
                  }
                }}
                editMode={editMode}
                onEditLabel={handleEditLabel}
              />

              {/* La lente ridisegna la ruota ingrandita e la trasla per centrarla sul cursore. */}
              {lens.show && !isMappingMode && (
                <div
                  style={{
                    position: 'absolute',
                    left: lens.x - LENS_SIZE / 2,
                    top: lens.y - LENS_SIZE / 2,
                    width: LENS_SIZE,
                    height: LENS_SIZE,
                    borderRadius: '50%',
                    border: '6px solid #000',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.6), 0 0 0 3px rgba(255,255,255,0.8)',
                    overflow: 'hidden',
                    pointerEvents: 'none',
                    zIndex: 50,
                    backgroundColor: '#f9fafb',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      width: lens.width,
                      height: lens.height,
                      left: -(lens.x * zoom - LENS_SIZE / 2),
                      top: -(lens.y * zoom - LENS_SIZE / 2),
                      transform: `scale(${zoom})`,
                      transformOrigin: '0 0',
                    }}
                  >
                    <EmotionWheelSVG
                      wheelData={wheelData}
                      palette={palette}
                      highlightEmotion={targetEmotion || null}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              className={`relative inline-block ${isMappingMode ? 'cursor-crosshair' : 'cursor-zoom-in'}`}
              {...hoverHandlers}
              onClick={handleImageClick}
            >
              <img
                ref={containerRef}
                src={imgSrc}
                alt="Ruota delle Emozioni"
                className="max-w-full max-h-[60vh] object-contain shadow-lg rounded-full animate-in zoom-in duration-300 touch-none select-none"
                onError={() => setImgSrc('https://placehold.co/600x600/FF69B4/FFFFFF?text=Inserisci+ruota_.png')}
              />

              {isMappingMode &&
                showMapped &&
                allScenarios &&
                allScenarios.map((s) =>
                  s.coordinates && s.text !== targetEmotion ? (
                    <div
                      key={s.id}
                      className="absolute border-2 border-indigo-600 bg-indigo-500/20 pointer-events-none"
                      style={{
                        left: `${s.coordinates.x}%`,
                        top: `${s.coordinates.y}%`,
                        ...markerBox,
                        transform: `translate(-50%, -50%) rotate(${markerAngle(s.coordinates)}deg)`,
                      }}
                      title={s.text}
                    />
                  ) : null,
                )}

              {targetCoordinates && (
                <div
                  className="absolute border-4 border-red-500 shadow-[0_0_15px_rgba(255,0,0,0.6)] pointer-events-none"
                  style={{
                    left: `${targetCoordinates.x}%`,
                    top: `${targetCoordinates.y}%`,
                    ...markerBox,
                    transform: `translate(-50%, -50%) rotate(${markerAngle(targetCoordinates)}deg)`,
                  }}
                />
              )}

              {lens.show && !isMappingMode && (
                <div
                  style={{
                    position: 'absolute',
                    left: lens.x - LENS_SIZE / 2,
                    top: lens.y - LENS_SIZE / 2,
                    width: LENS_SIZE,
                    height: LENS_SIZE,
                    borderRadius: '50%',
                    border: '6px solid white',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                    backgroundImage: `url(${imgSrc})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: 'white',
                    backgroundSize: `${lens.width * zoom}px ${lens.height * zoom}px`,
                    backgroundPositionX: -(lens.x * zoom - LENS_SIZE / 2),
                    backgroundPositionY: -(lens.y * zoom - LENS_SIZE / 2),
                    pointerEvents: 'none',
                    zIndex: 50,
                    overflow: 'hidden',
                  }}
                >
                  {targetCoordinates && (
                    <div
                      style={{
                        position: 'absolute',
                        left: `${(targetCoordinates.x / 100) * lens.width * zoom - lens.x * zoom + LENS_SIZE / 2}px`,
                        top: `${(targetCoordinates.y / 100) * lens.height * zoom - lens.y * zoom + LENS_SIZE / 2}px`,
                        width: `${(18 / 100) * lens.width * zoom}px`,
                        height: `${(6 / 100) * lens.height * zoom}px`,
                        borderRadius: '50%',
                        border: '4px solid red',
                        transform: `translate(-50%, -50%) rotate(${markerAngle(targetCoordinates)}deg)`,
                      }}
                    />
                  )}

                  {showMapped &&
                    allScenarios &&
                    allScenarios.map((s) =>
                      s.coordinates && s.text !== targetEmotion ? (
                        <div
                          key={`lens-${s.id}`}
                          style={{
                            position: 'absolute',
                            left: `${(s.coordinates.x / 100) * lens.width * zoom - lens.x * zoom + LENS_SIZE / 2}px`,
                            top: `${(s.coordinates.y / 100) * lens.height * zoom - lens.y * zoom + LENS_SIZE / 2}px`,
                            width: `${(18 / 100) * lens.width * zoom}px`,
                            height: `${(6 / 100) * lens.height * zoom}px`,
                            borderRadius: '50%',
                            border: '2px solid indigo',
                            backgroundColor: 'rgba(75, 0, 130, 0.2)',
                            transform: `translate(-50%, -50%) rotate(${markerAngle(s.coordinates)}deg)`,
                          }}
                        />
                      ) : null,
                    )}
                </div>
              )}
            </div>
          )}

          {!isMappingMode && (
            <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-[60] bg-white/90 p-2 rounded-2xl border-2 border-gray-200 shadow-xl backdrop-blur-sm">
              <button
                onClick={zoomIn}
                className="p-2 rounded-xl hover:bg-pink-50 text-pink-600 transition-colors"
                title="Zoom In"
              >
                <ZoomIn size={24} />
              </button>
              <div className="text-xs font-black text-center text-gray-500 py-1 border-t border-b border-gray-100">
                {zoom}x
              </div>
              <button
                onClick={zoomOut}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut size={24} />
              </button>
            </div>
          )}
        </div>

        <p className="text-center mt-2 text-gray-400 font-medium text-xs">
          {isSvgMode ? (
            <span className="text-purple-600 font-bold">
              {isMappingMode
                ? "🎯 Clicca su un'emozione per mappare."
                : '🔍 Passa il cursore per ingrandire. ⚙️ per palette e modifica.'}
            </span>
          ) : isMappingMode ? (
            <span className="text-blue-600 font-bold">
              🎯 Clicca sulla ruota per mappare. Salvataggio Cloud (se attivo).
            </span>
          ) : (
            <span>🔍 Passa il cursore o tocca per ingrandire.</span>
          )}
        </p>
      </div>
    </div>
  );
}
