import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin, Check, Download, Upload, Eye, EyeOff, Trash2, History } from 'lucide-react';
import {
  getSavedSets,
  saveScenarioSet,
  deleteScenarioSet,
  captureScenarioSet,
  captureScenarioItems,
  applyScenarioSet,
  getActiveSetIds,
  saveActiveSetIds,
  LS_SETS_KEY,
} from '../lib/sets';
import {
  getAIKey,
  setAIKey,
  getAIModel,
  setAIModel,
  aiListModels,
  aiGenerate,
  aiBuildPrompt,
  aiParseItems,
  AI_CONTEXT,
} from '../lib/gemini';
import { getWheelData, flattenWheel, WHEEL_DATA_DEFAULT } from '../lib/wheel';
import { exportBackupZip, importBackupZip } from '../lib/backup';

/**
 * Schermata "Gestione Dati": elenco degli elementi di una categoria, con
 * creazione, import, set salvati e generazione tramite IA.
 */
export default function ScenarioManager({
  scenarios,
  onUpdate,
  onClose,
  type,
  fullData,
  onFullUpdate,
  mappingMode,
  setMappingMode,
}) {
  const [localScenarios, setLocalScenarios] = useState(scenarios || []);
  const [newText, setNewText] = useState('');
  const [importText, setImportText] = useState('');
  const [mode, setMode] = useState('create');
  const [feedback, setFeedback] = useState(null);
  const fileInputRef = useRef(null);

  const [setsOpen, setSetsOpen] = useState(false);
  const [setName, setSetName] = useState('');
  const [savedSets, setSavedSets] = useState(() => getSavedSets());
  const [activeSetIds, setActiveSetIds] = useState(() => getActiveSetIds());
  const [setScope, setSetScope] = useState('category');

  const [aiOpen, setAiOpen] = useState(false);
  const [aiKey, setAiKeyState] = useState(() => getAIKey());
  const [aiModels, setAiModels] = useState([]);
  const [aiModel, setAiModelState] = useState(() => getAIModel());
  const [aiCount, setAiCount] = useState(10);
  const [aiTopics, setAiTopics] = useState('');
  const [aiBusy, setAiBusy] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [aiAsSet, setAiAsSet] = useState(false);
  const [aiSetName, setAiSetName] = useState('');

  const flash = (msg, ms = 2000) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), ms);
  };

  useEffect(() => {
    setLocalScenarios(scenarios || []);
  }, [scenarios]);

  // Il set attivo è la fonte da cui si estrae: ogni modifica ai dati vi viene
  // risincronizzata, elementi e stato nascosto compresi.
  useEffect(() => {
    const entries = Object.entries(activeSetIds);
    if (!entries.length) return;

    const sets = getSavedSets();
    let changed = false;
    for (const [ty, id] of entries) {
      const idx = sets.findIndex((s) => s.id === id);
      if (idx < 0) continue;
      // Un set di tipo diverso (per esempio una ruota) non va sovrascritto
      // con la forma piatta degli scenari.
      if (sets[idx].type !== ty) continue;
      sets[idx].items = captureScenarioItems(ty, fullData);
      sets[idx].data = captureScenarioSet(ty, fullData);
      changed = true;
    }
    if (changed) {
      localStorage.setItem(LS_SETS_KEY, JSON.stringify(sets));
      setSavedSets(sets);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullData]);

  const persistActive = (ty, id) => {
    const next = { ...activeSetIds };
    if (id) next[ty] = id;
    else delete next[ty];
    setActiveSetIds(next);
    saveActiveSetIds(next);
  };

  const replaceItems = (items) => onFullUpdate({ ...fullData, [type]: items });

  const handleDelete = (id) => {
    if (!window.confirm('Eliminare elemento?')) return;
    replaceItems(localScenarios.filter((s) => s.id !== id));
  };

  const handleToggleHidden = (id) => {
    const updated = localScenarios.map((s) => (s.id === id ? { ...s, hidden: !s.hidden } : s));
    setLocalScenarios(updated);
    replaceItems(updated);
  };

  const handleAdd = () => {
    if (!newText.trim()) return;
    replaceItems([{ id: Date.now(), text: newText, tags: ['custom'] }, ...localScenarios]);
    setNewText('');
    flash('Aggiunto!');
  };

  const handleImportText = () => {
    if (!importText.trim()) return;
    let newItems = [];
    try {
      const parsed = JSON.parse(importText);
      if (Array.isArray(parsed)) {
        newItems = parsed.map((item) => ({
          id: Date.now() + Math.random(),
          text: item.text || item,
          tags: item.tags || ['importato'],
        }));
      }
    } catch {
      // Non è JSON: si tratta come elenco, una riga per elemento.
      newItems = importText
        .split('\n')
        .filter((l) => l.trim().length > 0)
        .map((l) => ({ id: Date.now() + Math.random(), text: l.trim(), tags: ['importato'] }));
    }
    if (newItems.length > 0) {
      replaceItems([...newItems, ...localScenarios]);
      setImportText('');
      flash(`Importati ${newItems.length}!`);
    }
  };

  const handleExportDB = async () => {
    try {
      await exportBackupZip(fullData);
    } catch (err) {
      console.error('Export error', err);
      alert("Errore durante l'esportazione: " + err.message);
    }
  };

  const handleImportDB = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      if (file.name.endsWith('.zip') && typeof JSZip !== 'undefined') {
        onFullUpdate(await importBackupZip(file));
        alert('Backup ZIP importato con successo!');
        onClose();
      } else {
        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            const parsed = JSON.parse(evt.target.result);
            if (parsed && typeof parsed === 'object') {
              onFullUpdate(parsed);
              alert('Database importato con successo!');
              onClose();
            }
          } catch {
            alert('Errore nel file JSON.');
          }
        };
        reader.readAsText(file);
      }
    } catch (err) {
      console.error('Import error', err);
      alert("Errore durante l'importazione: " + err.message);
    }
  };

  const loadAiModels = async () => {
    const key = (aiKey || '').trim();
    if (!key) {
      setAiError('Inserisci prima la API key di Google AI');
      return;
    }
    setAiBusy(true);
    setAiError(null);
    try {
      const models = await aiListModels(key);
      setAiModels(models);
      setAIKey(key);
      if (models.length && !models.find((m) => m.id === aiModel)) {
        // Si preferisce un flash-lite: è il più rapido per generare molti elementi.
        const preferred =
          models.find((m) => /flash-lite/i.test(m.id)) || models.find((m) => /flash/i.test(m.id)) || models[0];
        setAiModelState(preferred.id);
        setAIModel(preferred.id);
      }
      flash('Modelli disponibili: ' + models.length, 2500);
    } catch (e) {
      setAiError(String((e && e.message) || e));
    } finally {
      setAiBusy(false);
    }
  };

  // Al primo apri del pannello, se la chiave c'è già i modelli si caricano da soli.
  useEffect(() => {
    if (aiOpen && aiKey && aiModels.length === 0 && !aiBusy) loadAiModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiOpen]);

  const runAi = async () => {
    const key = (aiKey || '').trim();
    if (!key) {
      setAiError('Inserisci prima la API key di Google AI');
      return;
    }
    if (!aiModel) {
      setAiError('Carica e scegli un modello');
      return;
    }

    const count = Math.max(1, Math.min(100, parseInt(aiCount, 10) || 10));
    setAiBusy(true);
    setAiError(null);
    try {
      const prompt = aiBuildPrompt(type, count, aiTopics, localScenarios.map((s) => s.text));
      const parsed = aiParseItems(await aiGenerate(key, aiModel, prompt));
      if (!parsed.length) {
        setAiError('Nessun elemento valido nella risposta del modello');
        return;
      }

      const base = Date.now();
      const generated = parsed.map((o, i) => ({ id: base + i, text: o.text, tags: o.tags }));

      if (aiAsSet) {
        const name = aiSetName.trim() || `AI ${type.replace(/_/g, ' ')} (${generated.length})`;
        saveScenarioSet(name, type, {}, generated);
        setSavedSets(getSavedSets());
        setAiSetName('');
        setSetsOpen(true);
        flash('Set AI creato: ' + generated.length + ' elementi', 3000);
      } else {
        replaceItems([...generated, ...localScenarios]);
        flash('Generati ' + generated.length + ' elementi!', 3000);
      }
    } catch (e) {
      setAiError(String((e && e.message) || e));
    } finally {
      setAiBusy(false);
    }
  };

  // Per le narrazioni emotive si mostrano anche i set della ruota: applicandoli
  // l'estrazione pesca solo fra emozioni realmente presenti sulla ruota.
  const visibleSets = savedSets.filter(
    (s) => s.type === type || s.type === 'all' || (type === 'emotion_narratives' && s.type === 'wheel'),
  );
  const activeSetName = (savedSets.find((s) => s.id === (activeSetIds[type] || activeSetIds.all)) || {}).name || '';

  return (
    <div className="fixed inset-0 bg-white z-40 overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
      <div className="p-6 border-b-4 border-black flex justify-between items-center bg-yellow-50">
        <div>
          <h2 className="text-3xl font-black uppercase">Gestione Dati</h2>
          <p className="uppercase text-sm font-bold text-gray-500">{type.replace('_', ' ')}</p>
        </div>
        <button onClick={onClose} className="p-3 bg-black text-white rounded-full">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row max-w-7xl mx-auto w-full">
        <div className="w-full md:w-1/3 p-6 border-b-4 md:border-r-4 border-gray-100 bg-white flex flex-col overflow-y-auto">
          {type === 'emotion_narratives' && (
            <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-2xl mb-6 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-blue-900 flex items-center gap-2">
                  <MapPin size={18} /> Mappatura Ruota
                </h4>
                <p className="text-xs text-blue-600">Salva posizione sulla ruota.</p>
              </div>
              <button
                onClick={() => setMappingMode(!mappingMode)}
                className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ml-4 ${
                  mappingMode ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                    mappingMode ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          )}

          <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setMode('create')}
              className={`flex-1 py-2 font-bold rounded-lg text-sm transition-all ${
                mode === 'create' ? 'bg-white shadow text-black' : 'text-gray-500'
              }`}
            >
              Nuovo
            </button>
            <button
              onClick={() => setMode('import')}
              className={`flex-1 py-2 font-bold rounded-lg text-sm transition-all ${
                mode === 'import' ? 'bg-white shadow text-black' : 'text-gray-500'
              }`}
            >
              Testo
            </button>
          </div>

          <div
            className={`flex flex-col p-6 rounded-3xl border-4 transition-colors mb-8 ${
              mode === 'create' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'
            }`}
          >
            {mode === 'create' ? (
              <>
                <textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Aggiungi nuovo elemento..."
                  className="w-full flex-1 min-h-[120px] p-4 rounded-xl border-2 border-blue-200 outline-none resize-none mb-4 bg-white"
                />
                <button
                  onClick={handleAdd}
                  disabled={!newText.trim()}
                  className="w-full bg-blue-500 text-white py-3 rounded-xl font-black uppercase border-b-4 border-blue-700 active:border-b-0 active:translate-y-1"
                >
                  Aggiungi
                </button>
              </>
            ) : (
              <>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Incolla elenco..."
                  className="w-full flex-1 min-h-[120px] p-4 rounded-xl border-2 border-green-200 outline-none resize-none mb-4 bg-white font-mono text-xs"
                />
                <button
                  onClick={handleImportText}
                  disabled={!importText.trim()}
                  className="w-full bg-green-500 text-white py-3 rounded-xl font-black uppercase border-b-4 border-green-700 active:border-b-0 active:translate-y-1"
                >
                  Importa
                </button>
              </>
            )}
            {feedback && (
              <div className="mt-4 p-3 bg-white rounded-xl shadow-sm border border-green-200 text-green-700 font-bold flex items-center gap-2">
                <Check size={16} /> {feedback}
              </div>
            )}
          </div>

          {/* --- Set --- */}
          <div className="pt-4 border-t-2 border-gray-100">
            <button
              onClick={() => setSetsOpen(!setsOpen)}
              className="w-full flex items-center justify-between text-xs font-black text-gray-400 uppercase tracking-widest mb-2"
            >
              <span className="flex items-center gap-1">
                <History size={14} /> Set di Scenari
              </span>
            </button>

            {setsOpen && (
              <div className="space-y-3 animate-in slide-in-from-top-2">
                <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                  <button
                    onClick={() => setSetScope('category')}
                    className={`flex-1 py-1 text-[10px] font-bold rounded ${
                      setScope === 'category' ? 'bg-white shadow text-black' : 'text-gray-500'
                    }`}
                  >
                    {type.replace('_', ' ')}
                  </button>
                  <button
                    onClick={() => setSetScope('all')}
                    className={`flex-1 py-1 text-[10px] font-bold rounded ${
                      setScope === 'all' ? 'bg-white shadow text-black' : 'text-gray-500'
                    }`}
                  >
                    Tutte le categorie
                  </button>
                </div>

                {(activeSetIds[type] || activeSetIds.all) && (
                  <div className="flex items-center gap-2 text-[10px] bg-green-50 border-2 border-green-600 rounded-lg px-2 py-1.5">
                    <span className="text-green-700 font-black">● SET ATTIVO</span>
                    <span className="flex-1 truncate text-green-800 font-bold">{activeSetName}</span>
                    <button
                      onClick={() => persistActive(activeSetIds[type] ? type : 'all', null)}
                      className="text-gray-600 hover:text-red-600 font-bold"
                    >
                      Disattiva
                    </button>
                  </div>
                )}

                {type === 'emotion_narratives' && (
                  <button
                    onClick={() => {
                      const flat = flattenWheel(getWheelData() || WHEEL_DATA_DEFAULT);
                      onFullUpdate({ ...fullData, emotion_narratives: flat });
                      persistActive('emotion_narratives', null);
                      flash('Ruota corrente importata!');
                    }}
                    className="w-full py-2 rounded-lg text-[11px] font-black border-2 border-purple-500 bg-purple-50 text-purple-700 hover:bg-purple-100"
                  >
                    🎯 Importa dalla Ruota Corrente
                  </button>
                )}

                <div className="flex gap-2">
                  <input
                    value={setName}
                    onChange={(e) => setSetName(e.target.value)}
                    placeholder="Nome set..."
                    className="flex-1 p-2 rounded-lg border-2 border-gray-200 text-xs outline-none focus:border-black"
                  />
                  <button
                    onClick={() => {
                      if (!setName.trim()) return;
                      const scope = setScope === 'all' ? 'all' : type;
                      saveScenarioSet(
                        setName.trim(),
                        scope,
                        captureScenarioSet(scope, fullData),
                        captureScenarioItems(scope, fullData),
                      );
                      setSavedSets(getSavedSets());
                      setSetName('');
                      flash('Set salvato!');
                    }}
                    disabled={!setName.trim()}
                    className="bg-black text-white px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-30"
                  >
                    SALVA
                  </button>
                </div>

                {visibleSets.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {visibleSets.map((set) => (
                      <div
                        key={set.id}
                        className={`flex items-center gap-2 p-2 rounded-lg border ${
                          set.type === 'wheel' ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate">
                            {set.type === 'wheel' && '🎯 '}
                            {set.name}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {set.type === 'all'
                              ? 'Tutte'
                              : set.type === 'wheel'
                                ? 'ruota → flat'
                                : set.type.replace('_', ' ')}
                          </p>
                        </div>

                        {set.type === 'wheel' ? (
                          <button
                            onClick={() => {
                              onFullUpdate({ ...fullData, emotion_narratives: flattenWheel(set.data) });
                              persistActive('emotion_narratives', set.id);
                              flash('Ruota applicata!');
                            }}
                            className={`${
                              activeSetIds.emotion_narratives === set.id ? 'bg-green-600' : 'bg-purple-500'
                            } text-white px-2 py-1 rounded text-[10px] font-bold`}
                          >
                            {activeSetIds.emotion_narratives === set.id ? '● ATTIVO' : 'APPLICA'}
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              onFullUpdate(applyScenarioSet(set.data, set.type, fullData, set.items));
                              persistActive(set.type, set.id);
                              flash('Set attivato!');
                            }}
                            className={`${
                              activeSetIds[set.type] === set.id ? 'bg-green-600' : 'bg-blue-500'
                            } text-white px-2 py-1 rounded text-[10px] font-bold`}
                          >
                            {activeSetIds[set.type] === set.id ? '● ATTIVO' : 'ATTIVA'}
                          </button>
                        )}

                        <button
                          onClick={() => {
                            saveScenarioSet(
                              set.name + ' (copia)',
                              set.type,
                              JSON.parse(JSON.stringify(set.data || {})),
                              set.items ? JSON.parse(JSON.stringify(set.items)) : null,
                            );
                            setSavedSets(getSavedSets());
                          }}
                          title="Duplica"
                          className="bg-indigo-500 text-white px-2 py-1 rounded text-[10px] font-bold"
                        >
                          DUP
                        </button>
                        <button
                          onClick={() => {
                            if (activeSetIds[set.type] === set.id) persistActive(set.type, null);
                            deleteScenarioSet(set.id);
                            setSavedSets(getSavedSets());
                          }}
                          className="text-red-400 hover:text-red-600 p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 text-center py-2">Nessun set salvato</p>
                )}
              </div>
            )}
          </div>

          {/* --- Generazione con IA --- */}
          <div className="pt-4 border-t-2 border-gray-100">
            <button
              onClick={() => setAiOpen(!aiOpen)}
              className="w-full flex items-center justify-between text-xs font-black text-gray-400 uppercase tracking-widest mb-2"
            >
              <span className="flex items-center gap-1">
                ✨ Genera con IA
                <span className="text-[9px] text-purple-400 normal-case tracking-normal">(Google Gemini)</span>
              </span>
            </button>

            {aiOpen && (
              <div className="space-y-2 animate-in slide-in-from-top-2">
                <div className="flex gap-1">
                  <input
                    type="password"
                    value={aiKey}
                    onChange={(e) => setAiKeyState(e.target.value)}
                    placeholder="Google AI API key..."
                    className="flex-1 min-w-0 p-2 rounded-lg border-2 border-gray-200 text-xs outline-none focus:border-black"
                  />
                  <button
                    onClick={loadAiModels}
                    disabled={aiBusy}
                    className="bg-black text-white px-2 rounded-lg text-[10px] font-bold disabled:opacity-30 whitespace-nowrap"
                  >
                    {aiBusy ? '…' : 'MODELLI'}
                  </button>
                </div>

                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="block text-[10px] text-blue-500 underline"
                >
                  Ottieni una API key gratuita su Google AI Studio ↗
                </a>

                {aiModels.length > 0 && (
                  <select
                    value={aiModel}
                    onChange={(e) => {
                      setAiModelState(e.target.value);
                      setAIModel(e.target.value);
                    }}
                    className="w-full p-2 rounded-lg border-2 border-gray-200 text-xs outline-none focus:border-black bg-white"
                  >
                    <option value="">— scegli un modello —</option>
                    {aiModels.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.id}
                      </option>
                    ))}
                  </select>
                )}

                <div className="flex gap-2 items-center">
                  <span className="text-[10px] font-bold text-gray-500 whitespace-nowrap">Quanti:</span>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={aiCount}
                    onChange={(e) => setAiCount(e.target.value)}
                    className="w-16 p-2 rounded-lg border-2 border-gray-200 text-xs outline-none focus:border-black"
                  />
                  <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 ml-auto cursor-pointer">
                    <input type="checkbox" checked={aiAsSet} onChange={(e) => setAiAsSet(e.target.checked)} />
                    crea come set
                  </label>
                </div>

                {aiAsSet && (
                  <input
                    value={aiSetName}
                    onChange={(e) => setAiSetName(e.target.value)}
                    placeholder="Nome del nuovo set…"
                    className="w-full p-2 rounded-lg border-2 border-gray-200 text-xs outline-none focus:border-black"
                  />
                )}

                <textarea
                  value={aiTopics}
                  onChange={(e) => setAiTopics(e.target.value)}
                  placeholder="Argomenti o vincoli (es: bullismo, social media, biennio superiori, tono leggero)…"
                  rows={3}
                  className="w-full p-2 rounded-lg border-2 border-gray-200 text-xs outline-none focus:border-black resize-none"
                />

                <p className="text-[10px] text-gray-400 leading-snug">
                  Contesto automatico dalla modalità:{' '}
                  <span className="italic">{AI_CONTEXT[type] || 'scenari educativi per adolescenti'}</span>
                </p>

                {aiError && (
                  <p className="text-[10px] text-red-600 font-bold bg-red-50 border border-red-200 rounded p-2 break-words">
                    {aiError}
                  </p>
                )}

                <button
                  onClick={runAi}
                  disabled={aiBusy || !aiModel}
                  className="w-full py-2 rounded-lg text-xs font-black text-white bg-gradient-to-r from-purple-600 to-blue-600 disabled:opacity-30"
                >
                  {aiBusy ? 'Generazione in corso…' : `✨ GENERA ${parseInt(aiCount, 10) || 10} ELEMENTI`}
                </button>
              </div>
            )}
          </div>

          <div className="mt-auto border-t-2 border-gray-100 pt-6">
            <h4 className="font-black text-gray-400 uppercase tracking-widest text-xs mb-3">
              Area Docente / Backup
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExportDB}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-400 transition-all text-xs font-bold text-gray-600"
              >
                <Download size={20} className="mb-1 text-gray-400" /> Esporta ZIP
              </button>
              <label className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-400 transition-all text-xs font-bold text-gray-600 cursor-pointer">
                <Upload size={20} className="mb-1 text-gray-400" /> Importa ZIP/JSON
                <input
                  type="file"
                  accept=".zip,.json"
                  onChange={handleImportDB}
                  className="hidden"
                  ref={fileInputRef}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <div className="space-y-4">
            {localScenarios.map((s, i) => (
              <div
                key={s.id}
                className={`group flex gap-4 p-5 bg-white border-2 ${
                  s.hidden ? 'border-gray-100 bg-gray-50 opacity-60' : 'border-gray-200 hover:border-black'
                } rounded-2xl shadow-sm items-center transition-all`}
              >
                <span className="font-black text-gray-300">#{i + 1}</span>
                <div className="flex-1">
                  <p className={`font-medium text-lg ${s.hidden ? 'line-through text-gray-400' : ''}`}>{s.text}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {s.tags?.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] bg-gray-100 px-2 py-1 rounded uppercase font-bold text-gray-400"
                      >
                        {t}
                      </span>
                    ))}
                    {s.coordinates && (
                      <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded font-bold flex items-center gap-1">
                        <MapPin size={10} /> Mappato
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleToggleHidden(s.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    s.hidden ? 'text-gray-400 hover:text-gray-600' : 'text-blue-300 hover:text-blue-500'
                  }`}
                  title={s.hidden ? 'Riattiva' : 'Nascondi'}
                >
                  {s.hidden ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
