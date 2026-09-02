import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  MapPin,
  Check,
  Download,
  Upload,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Copy,
  Edit2,
  Layers,
  Star,
  FolderPlus,
  Sparkles,
} from 'lucide-react';
import {
  ensureCategorySets,
  getAllItemsForCategory,
  getActiveItemsForCategory,
  createCategorySet,
  duplicateCategorySet,
  renameCategorySet,
  deleteCategorySet,
  setActiveCategorySet,
  updateCategorySetItems,
  CATEGORY_LABELS,
} from '../lib/sets';
import {
  getAIKey,
  getAIModel,
  DEFAULT_AI_MODEL,
  aiGenerate,
  aiBuildPrompt,
  aiParseItems,
  AI_CONTEXT,
} from '../lib/gemini';
import { getWheelData, flattenWheel, WHEEL_DATA_DEFAULT } from '../lib/wheel';
import { exportBackupZip, importBackupZip } from '../lib/backup';

/**
 * Schermata "Gestione Dati": gestione dei Set separati e degli stimoli di ciascuna modalità.
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
  const catData = ensureCategorySets(type, fullData);
  const activeSetId = catData.activeSetId || 'default';
  const [selectedSetId, setSelectedSetId] = useState(activeSetId);

  // In caso il set selezionato non esista più nei set
  useEffect(() => {
    if (selectedSetId !== 'all' && !catData.sets.some((s) => s.id === selectedSetId)) {
      setSelectedSetId(catData.activeSetId || 'all');
    }
  }, [catData, selectedSetId]);

  // Stimoli del set correntemente visualizzato
  const isAllSelected = selectedSetId === 'all';
  const currentSet = isAllSelected ? null : catData.sets.find((s) => s.id === selectedSetId) || catData.sets[0];
  const localScenarios = isAllSelected
    ? getAllItemsForCategory(catData.sets)
    : (currentSet ? currentSet.items : []);

  const [newText, setNewText] = useState('');
  const [importText, setImportText] = useState('');
  const [mode, setMode] = useState('create');
  const [feedback, setFeedback] = useState(null);
  const fileInputRef = useRef(null);

  // Modale per la creazione di un nuovo set
  const [isNewSetModalOpen, setIsNewSetModalOpen] = useState(false);
  const [newSetName, setNewSetName] = useState('');
  const [newSetMode, setNewSetMode] = useState('empty'); // 'empty' | 'duplicate'
  const [newSetSourceId, setNewSetSourceId] = useState('all');

  // Modale/Dialog per rinominare set
  const [renamingSetId, setRenamingSetId] = useState(null);
  const [renamingSetName, setRenamingSetName] = useState('');

  // Generazione con IA
  const [aiOpen, setAiOpen] = useState(false);
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

  const handleCreateNewSet = () => {
    const name = newSetName.trim();
    if (!name) return alert('Inserisci un nome per il nuovo set.');

    const updatedFullData = createCategorySet(type, fullData, {
      name,
      sourceMode: newSetMode,
      sourceSetId: newSetSourceId,
    });

    onFullUpdate(updatedFullData);
    const updatedCat = ensureCategorySets(type, updatedFullData);
    setSelectedSetId(updatedCat.activeSetId);
    setIsNewSetModalOpen(false);
    setNewSetName('');
    setNewSetMode('empty');
    flash(`Set "${name}" creato con successo!`);
  };

  const handleDuplicateSet = (setId) => {
    const updatedFullData = duplicateCategorySet(type, fullData, setId);
    onFullUpdate(updatedFullData);
    const updatedCat = ensureCategorySets(type, updatedFullData);
    setSelectedSetId(updatedCat.activeSetId);
    flash('Set duplicato!');
  };

  const handleStartRename = (set) => {
    setRenamingSetId(set.id);
    setRenamingSetName(set.name);
  };

  const handleSaveRename = () => {
    if (!renamingSetName.trim() || !renamingSetId) return;
    const updatedFullData = renameCategorySet(type, fullData, renamingSetId, renamingSetName);
    onFullUpdate(updatedFullData);
    setRenamingSetId(null);
    flash('Nome set aggiornato!');
  };

  const handleDeleteSet = (setId) => {
    const target = catData.sets.find((s) => s.id === setId);
    if (!target) return;
    if (!window.confirm(`Sei sicuro di voler eliminare il set "${target.name}"?`)) return;

    const updatedFullData = deleteCategorySet(type, fullData, setId);
    onFullUpdate(updatedFullData);
    const updatedCat = ensureCategorySets(type, updatedFullData);
    setSelectedSetId(updatedCat.activeSetId);
    flash('Set eliminato.');
  };

  const handleActivateSet = (setId) => {
    const updatedFullData = setActiveCategorySet(type, fullData, setId);
    onFullUpdate(updatedFullData);
    setSelectedSetId(setId);
    flash('Set attivato per l\'estrazione!');
  };

  // Modifica stimoli del set corrente
  const updateItemsInCurrentSet = (newItems) => {
    const targetSetId = isAllSelected ? (catData.sets[0]?.id || 'default') : selectedSetId;
    const updatedFullData = updateCategorySetItems(type, fullData, selectedSetId, newItems);
    onFullUpdate(updatedFullData);
  };

  const handleDeleteItem = (id) => {
    if (!window.confirm('Eliminare elemento?')) return;
    const next = localScenarios.filter((s) => s.id !== id);
    updateItemsInCurrentSet(next);
  };

  const handleToggleHidden = (id) => {
    const next = localScenarios.map((s) => (s.id === id ? { ...s, hidden: !s.hidden } : s));
    updateItemsInCurrentSet(next);
  };

  const handleAdd = () => {
    if (!newText.trim()) return;
    const newItem = { id: Date.now(), text: newText.trim(), tags: ['custom'] };
    const next = [newItem, ...localScenarios];
    updateItemsInCurrentSet(next);
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
      newItems = importText
        .split('\n')
        .filter((l) => l.trim().length > 0)
        .map((l) => ({ id: Date.now() + Math.random(), text: l.trim(), tags: ['importato'] }));
    }
    if (newItems.length > 0) {
      updateItemsInCurrentSet([...newItems, ...localScenarios]);
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

  const runAi = async () => {
    const key = (getAIKey() || '').trim();
    if (!key) {
      setAiError('Configura prima la tua API Key di Google Gemini nelle Impostazioni generali.');
      return;
    }
    const model = (getAIModel() || DEFAULT_AI_MODEL).trim();

    const count = Math.max(1, Math.min(100, parseInt(aiCount, 10) || 10));
    setAiBusy(true);
    setAiError(null);
    try {
      const prompt = aiBuildPrompt(type, count, aiTopics, localScenarios.map((s) => s.text));
      const parsed = aiParseItems(await aiGenerate(key, model, prompt));
      if (!parsed.length) {
        setAiError('Nessun elemento valido nella risposta del modello');
        return;
      }

      const base = Date.now();
      const generated = parsed.map((o, i) => ({ id: base + i, text: o.text, tags: o.tags }));

      if (aiAsSet) {
        const name = aiSetName.trim() || `AI ${type.replace(/_/g, ' ')} (${generated.length})`;
        const updated = createCategorySet(type, fullData, {
          name,
          sourceMode: 'empty',
        });
        const targetId = updated.scenario_sets[type].activeSetId;
        const withItems = updateCategorySetItems(type, updated, targetId, generated);
        onFullUpdate(withItems);
        setSelectedSetId(targetId);
        setAiSetName('');
        flash('Nuovo set AI creato: ' + generated.length + ' elementi!', 3000);
      } else {
        updateItemsInCurrentSet([...generated, ...localScenarios]);
        flash('Generati ' + generated.length + ' elementi!', 3000);
      }
    } catch (e) {
      setAiError(String((e && e.message) || e));
    } finally {
      setAiBusy(false);
    }
  };

  const totalAllItems = getAllItemsForCategory(catData.sets);
  const activeSetName =
    catData.activeSetId === 'all'
      ? 'Tutti gli stimoli'
      : (catData.sets.find((s) => s.id === catData.activeSetId)?.name || 'Predefinito');

  return (
    <div className="fixed inset-0 bg-white z-40 overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
      {/* Top Header */}
      <div className="p-6 border-b-4 border-black flex justify-between items-center bg-yellow-50">
        <div>
          <h2 className="text-3xl font-black uppercase">Gestione Dati</h2>
          <p className="uppercase text-sm font-bold text-gray-500">
            {CATEGORY_LABELS[type] || type.replace('_', ' ')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border-2 border-black/20 text-xs font-bold shadow-sm">
            <span className="text-gray-400 uppercase">Set attivo:</span>
            <span className="text-green-700 font-black">● {activeSetName}</span>
          </div>
          <button onClick={onClose} className="p-3 bg-black text-white rounded-full hover:scale-105 transition-transform" title="Chiudi">
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row max-w-7xl mx-auto w-full">
        {/* Left column: Sets Management & Creation */}
        <div className="w-full md:w-5/12 lg:w-4/12 p-6 border-b-4 md:border-r-4 border-gray-100 bg-white flex flex-col overflow-y-auto">
          
          {/* SEZIONE SET */}
          <div className="mb-6 p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-black text-xs uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Layers size={16} /> Set di Stimoli
              </h3>
              <button
                onClick={() => {
                  setNewSetName('');
                  setNewSetMode('empty');
                  setNewSetSourceId('all');
                  setIsNewSetModalOpen(true);
                }}
                className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1 rounded-lg text-xs font-black shadow-sm transition-all"
                title="Crea nuovo set di stimoli"
              >
                <Plus size={14} /> Nuovo Set
              </button>
            </div>

            <div className="space-y-1.5">
              {/* SET PERMANENTE: TUTTI GLI STIMOLI */}
              <div
                onClick={() => setSelectedSetId('all')}
                className={`p-2.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  selectedSetId === 'all'
                    ? 'bg-amber-200 border-amber-500 shadow-sm'
                    : 'bg-white border-amber-200 hover:border-amber-400'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <Star size={16} className="text-amber-600 fill-amber-500 flex-shrink-0" />
                  <div className="truncate">
                    <p className="font-black text-xs text-gray-900 truncate">⭐ Tutti gli stimoli</p>
                    <p className="text-[10px] font-bold text-gray-500">{totalAllItems.length} stimoli totali</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {catData.activeSetId === 'all' ? (
                    <span className="bg-green-600 text-white px-2 py-0.5 rounded text-[10px] font-black">
                      ATTIVO
                    </span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActivateSet('all');
                      }}
                      className="bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-800 border border-gray-300 px-2 py-0.5 rounded text-[10px] font-bold"
                    >
                      Attiva
                    </button>
                  )}
                </div>
              </div>

              {/* LISTA DEI SINGOLI SET */}
              {catData.sets.map((s) => {
                const isSelected = selectedSetId === s.id;
                const isActive = catData.activeSetId === s.id;
                const isRenaming = renamingSetId === s.id;

                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSetId(s.id)}
                    className={`p-2.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-white border-black shadow-md'
                        : 'bg-white border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      {isRenaming ? (
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={renamingSetName}
                            onChange={(e) => setRenamingSetName(e.target.value)}
                            className="p-1 text-xs border rounded w-full font-bold outline-none"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveRename()}
                          />
                          <button
                            onClick={handleSaveRename}
                            className="bg-black text-white px-2 py-1 rounded text-[10px] font-bold"
                          >
                            OK
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="font-bold text-xs text-gray-900 truncate">{s.name}</p>
                          <p className="text-[10px] font-bold text-gray-400">
                            {s.items?.length || 0} stimoli
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      {isActive ? (
                        <span className="bg-green-600 text-white px-2 py-0.5 rounded text-[10px] font-black">
                          ATTIVO
                        </span>
                      ) : (
                        <button
                          onClick={() => handleActivateSet(s.id)}
                          className="bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-800 border border-gray-300 px-2 py-0.5 rounded text-[10px] font-bold"
                          title="Rendi attivo per l'estrazione"
                        >
                          Attiva
                        </button>
                      )}

                      <button
                        onClick={() => handleDuplicateSet(s.id)}
                        className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-black"
                        title="Duplica set"
                      >
                        <Copy size={13} />
                      </button>

                      <button
                        onClick={() => handleStartRename(s)}
                        className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-black"
                        title="Rinomina set"
                      >
                        <Edit2 size={13} />
                      </button>

                      {catData.sets.length > 1 && (
                        <button
                          onClick={() => handleDeleteSet(s.id)}
                          className="p-1 hover:bg-red-50 rounded text-red-400 hover:text-red-600"
                          title="Elimina set"
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

          {/* Mappatura ruota per narrazioni emotive */}
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

          {/* Tab Nuovo / Importa Testo */}
          <div className="flex gap-2 mb-4 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setMode('create')}
              className={`flex-1 py-2 font-bold rounded-lg text-xs transition-all ${
                mode === 'create' ? 'bg-white shadow text-black' : 'text-gray-500'
              }`}
            >
              Nuovo Elemento
            </button>
            <button
              onClick={() => setMode('import')}
              className={`flex-1 py-2 font-bold rounded-lg text-xs transition-all ${
                mode === 'import' ? 'bg-white shadow text-black' : 'text-gray-500'
              }`}
            >
              Importa Testo
            </button>
          </div>

          {/* Box Inserimento */}
          <div
            className={`flex flex-col p-4 rounded-2xl border-2 transition-colors mb-6 ${
              mode === 'create' ? 'bg-blue-50/50 border-blue-200' : 'bg-green-50/50 border-green-200'
            }`}
          >
            <p className="text-[11px] font-bold text-gray-500 mb-2">
              Aggiungi a: <span className="text-black font-black">{isAllSelected ? (catData.sets[0]?.name || 'Set Predefinito') : (currentSet?.name || 'Set Corrente')}</span>
            </p>
            {mode === 'create' ? (
              <>
                <textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Scrivi qui il nuovo stimolo..."
                  className="w-full min-h-[90px] p-3 rounded-xl border-2 border-blue-200 outline-none resize-none mb-3 bg-white text-sm"
                />
                <button
                  onClick={handleAdd}
                  disabled={!newText.trim()}
                  className="w-full bg-blue-500 text-white py-2.5 rounded-xl font-black uppercase text-xs border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 disabled:opacity-40"
                >
                  Aggiungi Stimolo
                </button>
              </>
            ) : (
              <>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Incolla elenco (una riga per stimolo o array JSON)..."
                  className="w-full min-h-[90px] p-3 rounded-xl border-2 border-green-200 outline-none resize-none mb-3 bg-white font-mono text-xs"
                />
                <button
                  onClick={handleImportText}
                  disabled={!importText.trim()}
                  className="w-full bg-green-500 text-white py-2.5 rounded-xl font-black uppercase text-xs border-b-4 border-green-700 active:border-b-0 active:translate-y-1 disabled:opacity-40"
                >
                  Importa Elenco
                </button>
              </>
            )}
            {feedback && (
              <div className="mt-3 p-2 bg-white rounded-lg shadow-sm border border-green-200 text-green-700 font-bold text-xs flex items-center gap-1.5 animate-in fade-in">
                <Check size={14} /> {feedback}
              </div>
            )}
          </div>

          {/* Generazione IA */}
          <div className="pt-4 border-t-2 border-gray-100">
            <button
              onClick={() => setAiOpen(!aiOpen)}
              className="w-full flex items-center justify-between text-xs font-black text-gray-500 uppercase tracking-wider mb-2"
            >
              <span className="flex items-center gap-1">
                ✨ Genera con IA
                <span className="text-[10px] text-purple-600 normal-case tracking-normal">(Gemini)</span>
              </span>
              <span>{aiOpen ? '▲' : '▼'}</span>
            </button>

            {aiOpen && (
              <div className="space-y-3 animate-in slide-in-from-top-2 p-3 bg-purple-50/70 rounded-xl border border-purple-200">
                {!getAIKey() ? (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
                    <p className="font-bold mb-1">⚠️ API Key non configurata</p>
                    <p className="text-[11px] text-amber-800 leading-snug">
                      Per usare l'IA, apri le <strong>Impostazioni Generali</strong> (in alto a destra sulla Dashboard) e salva la tua chiave gratuita di Google Gemini.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-[11px] bg-white p-2 rounded-lg border border-purple-100 font-bold text-purple-900">
                      <span>Modello: <strong>{getAIModel()}</strong></span>
                      <span className="text-[10px] text-gray-400 font-normal">Nelle Impostazioni</span>
                    </div>

                    <div className="flex gap-2 items-center">
                      <span className="text-[10px] font-bold text-gray-600">Quanti:</span>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={aiCount}
                        onChange={(e) => setAiCount(e.target.value)}
                        className="w-14 p-1.5 rounded-lg border border-gray-300 text-xs text-center font-bold bg-white"
                      />
                      <label className="flex items-center gap-1 text-[10px] font-bold text-gray-600 ml-auto cursor-pointer">
                        <input type="checkbox" checked={aiAsSet} onChange={(e) => setAiAsSet(e.target.checked)} />
                        crea come nuovo set
                      </label>
                    </div>

                    {aiAsSet && (
                      <input
                        value={aiSetName}
                        onChange={(e) => setAiSetName(e.target.value)}
                        placeholder="Nome del nuovo set…"
                        className="w-full p-2 rounded-lg border border-gray-300 text-xs outline-none bg-white font-bold"
                      />
                    )}

                    <textarea
                      value={aiTopics}
                      onChange={(e) => setAiTopics(e.target.value)}
                      placeholder="Argomenti (es: conflitti tra pari, scuola, confini)…"
                      rows={2}
                      className="w-full p-2 rounded-lg border border-gray-300 text-xs outline-none bg-white resize-none"
                    />

                    {aiError && (
                      <p className="text-[10px] text-red-600 font-bold bg-red-50 border border-red-200 rounded p-2">
                        {aiError}
                      </p>
                    )}

                    <button
                      onClick={runAi}
                      disabled={aiBusy}
                      className="w-full py-2.5 rounded-lg text-xs font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-sm disabled:opacity-40 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Sparkles size={14} />
                      {aiBusy ? 'Generazione in corso...' : `GENERA CON GEMINI (${aiCount})`}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Backup area */}
          <div className="mt-auto border-t-2 border-gray-100 pt-6">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExportDB}
                className="flex items-center justify-center gap-1 p-2 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 text-xs font-bold text-gray-600"
              >
                <Download size={14} /> Esporta ZIP
              </button>
              <label className="flex items-center justify-center gap-1 p-2 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 text-xs font-bold text-gray-600 cursor-pointer">
                <Upload size={14} /> Importa ZIP
                <input type="file" accept=".zip,.json" onChange={handleImportDB} className="hidden" ref={fileInputRef} />
              </label>
            </div>
          </div>
        </div>

        {/* Right column: Items list in the selected set */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
            <div>
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                {isAllSelected ? '⭐ Tutti gli stimoli' : currentSet?.name || 'Set selezionato'}
                <span className="text-xs font-bold bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                  {localScenarios.length} elementi
                </span>
              </h3>
              {isAllSelected && (
                <p className="text-xs text-gray-500 mt-0.5">
                  Questo set racchiude tutti gli stimoli di tutti i set di questa modalità.
                </p>
              )}
            </div>

            {selectedSetId !== catData.activeSetId && (
              <button
                onClick={() => handleActivateSet(selectedSetId)}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-xl font-black text-xs shadow-sm transition-all"
              >
                Rendi Attivo per l'Attività
              </button>
            )}
          </div>

          {localScenarios.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 mb-4">
                <Layers size={32} />
              </div>
              <h4 className="text-lg font-black text-gray-700 mb-1">Questo set è vuoto</h4>
              <p className="text-sm text-gray-500 max-w-sm">
                Aggiungi il tuo primo stimolo usando il pannello a sinistra, importa da un testo o genera con l'IA.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {localScenarios.map((s, i) => (
                <div
                  key={s.id || i}
                  className={`group flex gap-4 p-4 bg-white border-2 ${
                    s.hidden ? 'border-gray-100 bg-gray-50/60 opacity-60' : 'border-gray-200 hover:border-black'
                  } rounded-2xl shadow-sm items-center transition-all`}
                >
                  <span className="font-black text-gray-300 text-sm">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-base text-gray-800 ${s.hidden ? 'line-through text-gray-400' : ''}`}>
                      {s.text}
                    </p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {s.tags?.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] bg-gray-100 px-2 py-0.5 rounded uppercase font-bold text-gray-400"
                        >
                          {t}
                        </span>
                      ))}
                      {s.coordinates && (
                        <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                          <MapPin size={10} /> Mappato
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleToggleHidden(s.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        s.hidden ? 'text-gray-400 hover:text-gray-600' : 'text-blue-400 hover:text-blue-600'
                      }`}
                      title={s.hidden ? 'Riattiva' : 'Nascondi'}
                    >
                      {s.hidden ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button
                      onClick={() => handleDeleteItem(s.id)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                      title="Elimina stimolo"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODALE: CREA NUOVO SET */}
      {isNewSetModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border-4 border-black shadow-2xl animate-in zoom-in-95">
            <h3 className="text-2xl font-black mb-1 text-gray-900 flex items-center gap-2">
              <FolderPlus /> Nuovo Set di Stimoli
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Crea una collezione separata di stimoli per questa modalità.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Nome del Set
                </label>
                <input
                  type="text"
                  value={newSetName}
                  onChange={(e) => setNewSetName(e.target.value)}
                  placeholder="Es: Classe 2A, Laboratorio Emozioni..."
                  className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold outline-none focus:border-black text-sm"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                  Come vuoi iniziare?
                </label>
                <div className="space-y-2">
                  <label
                    onClick={() => setNewSetMode('empty')}
                    className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      newSetMode === 'empty' ? 'bg-amber-50 border-amber-500' : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="setMode"
                      checked={newSetMode === 'empty'}
                      onChange={() => setNewSetMode('empty')}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-bold text-xs text-gray-900">Set Vuoto</p>
                      <p className="text-[11px] text-gray-500">
                        Inizia da 0 stimoli e inseriscili manualmente o tramite IA.
                      </p>
                    </div>
                  </label>

                  <label
                    onClick={() => setNewSetMode('duplicate')}
                    className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      newSetMode === 'duplicate' ? 'bg-amber-50 border-amber-500' : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="setMode"
                      checked={newSetMode === 'duplicate'}
                      onChange={() => setNewSetMode('duplicate')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-xs text-gray-900">Duplica da un set esistente</p>
                      <p className="text-[11px] text-gray-500 mb-2">
                        Clona gli stimoli di un set per modificarli liberamente.
                      </p>

                      {newSetMode === 'duplicate' && (
                        <select
                          value={newSetSourceId}
                          onChange={(e) => setNewSetSourceId(e.target.value)}
                          className="w-full p-2 rounded-lg border border-gray-300 text-xs font-bold bg-white"
                        >
                          <option value="all">⭐ Tutti gli stimoli ({totalAllItems.length} stimoli)</option>
                          {catData.sets.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name} ({s.items?.length || 0} stimoli)
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsNewSetModalOpen(false)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm"
              >
                Annulla
              </button>
              <button
                onClick={handleCreateNewSet}
                disabled={!newSetName.trim()}
                className="flex-1 py-3 bg-black hover:bg-gray-800 text-white font-black rounded-xl text-sm disabled:opacity-40"
              >
                Crea Set
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
