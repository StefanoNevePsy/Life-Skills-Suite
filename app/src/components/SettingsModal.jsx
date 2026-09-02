import React, { useState, useRef } from 'react';
import { 
  X, Eye, EyeOff, Bot, Laptop, Check, RefreshCw, ExternalLink, Copy, Sparkles,
  Lock, Unlock, Shield, ShieldCheck, ShieldAlert
} from 'lucide-react';
import {
  getUsername,
  saveUsername,
  getFBConfig,
  saveFBConfig,
  encodeFBConfig,
  decodeFBConfig,
  isFirebaseConfigured,
  resetFBConfig,
} from '../lib/firebaseConfig';
import {
  getWheelMode,
  setWheelMode,
  getWheelPalette,
  setWheelPalette,
  getWheelData,
  setWheelData,
  WHEEL_DATA_DEFAULT,
} from '../lib/wheel';
import {
  getAIKey,
  setAIKey,
  getAIModel,
  setAIModel,
  DEFAULT_AI_MODEL,
  aiListModels,
} from '../lib/gemini';
import {
  getCustomShortUrl,
  setCustomShortUrl,
} from '../lib/shortUrl';
import {
  isPinProtectionEnabled,
  setTeacherPin,
  removeTeacherPin,
  logoutTeacher,
} from '../lib/security';

const PALETTE_LABELS = { insideout: 'Inside Out', pastel: 'Pastello', vivid: 'Vivido' };

const PRESET_MODELS = [
  { id: 'gemini-3.5-flash-lite', label: 'gemini-3.5-flash-lite (Predefinito & Consigliato)' },
  { id: 'gemini-2.5-flash', label: 'gemini-2.5-flash (Veloce & Intelligente)' },
  { id: 'gemini-2.5-pro', label: 'gemini-2.5-pro (Massima Precisione)' },
  { id: 'gemini-1.5-flash', label: 'gemini-1.5-flash (Standard)' },
];

export default function SettingsModal({ isOpen, onClose, appId }) {
  const usernameRef = useRef(null);
  const configRef = useRef(null);

  // Stato Sicurezza PIN Docente
  const [pinEnabled, setPinEnabled] = useState(isPinProtectionEnabled());
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showNewPin, setShowNewPin] = useState(false);
  const [pinStatus, setPinStatus] = useState(null);
  const [showChangePinForm, setShowChangePinForm] = useState(false);

  // Stato IA (Google Gemini)
  const [aiKey, setAiKeyState] = useState(getAIKey());
  const [aiModel, setAiModelState] = useState(getAIModel() || DEFAULT_AI_MODEL);
  const [showKey, setShowKey] = useState(false);
  const [aiModelsList, setAiModelsList] = useState([]);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiStatus, setAiStatus] = useState(null);

  // Stato Link Studenti Chromebook
  const [customShortUrl, setCustomShortUrlState] = useState(getCustomShortUrl());
  const [shortUrlStatus, setShortUrlStatus] = useState(null);

  if (!isOpen) return null;

  const handleSavePin = async () => {
    if (!newPin.trim()) {
      setPinStatus({ type: 'error', text: 'Inserisci un PIN.' });
      return;
    }
    if (newPin.trim().length < 3) {
      setPinStatus({ type: 'error', text: 'Il PIN deve contenere almeno 3 caratteri o numeri.' });
      return;
    }
    if (newPin !== confirmPin) {
      setPinStatus({ type: 'error', text: 'I due PIN non coincidono.' });
      return;
    }
    await setTeacherPin(newPin.trim());
    setPinEnabled(true);
    setNewPin('');
    setConfirmPin('');
    setShowChangePinForm(false);
    setPinStatus({ type: 'success', text: 'PIN Docente salvato! Questo computer è ora memorizzato come autorizzato.' });
    setTimeout(() => setPinStatus(null), 4000);
  };

  const handleRemovePin = () => {
    if (!confirm('Sei sicuro di voler rimuovere il PIN Docente? Chiunque potrà accedere liberamente alla Dashboard.')) return;
    removeTeacherPin();
    setPinEnabled(false);
    setNewPin('');
    setConfirmPin('');
    setShowChangePinForm(false);
    setPinStatus({ type: 'success', text: 'Protezione PIN rimossa. Accesso libero ripristinato.' });
    setTimeout(() => setPinStatus(null), 4000);
  };

  const handleLockNow = () => {
    logoutTeacher();
    alert('Sessione docente terminata! La Dashboard è stata bloccata.');
    window.location.reload();
  };

  const saveUser = () => {
    const value = usernameRef.current.value.trim();
    saveUsername(value);
    alert('Nome utente salvato: ' + (value || '(predefinito)') + "\nL'app si ricaricherà.");
    window.location.reload();
  };

  const applyConfig = () => {
    const raw = configRef.current.value;
    if (!raw.trim()) {
      alert('Incolla un codice.');
      return;
    }
    const parsed = decodeFBConfig(raw);
    if (!parsed) {
      alert('Codice non valido. Verifica di averlo copiato correttamente.');
      return;
    }
    saveFBConfig(parsed);
    alert("Configurazione salvata! L'app si ricaricherà.");
    window.location.reload();
  };

  const resetConfig = () => {
    if (!confirm('Rimuovere la configurazione Firebase salvata in questo browser?')) return;
    resetFBConfig();
    alert("Configurazione rimossa! L'app funzionerà in modalità locale.");
    window.location.reload();
  };

  const switchWheelMode = (mode) => {
    setWheelMode(mode);
    window.location.reload();
  };

  const exportWheelData = () => {
    const data = getWheelData() || WHEEL_DATA_DEFAULT;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ruota_emozioni.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importWheelData = (ev) => {
    const file = ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].core && parsed[0].secondary) {
          setWheelData(parsed);
          alert('Dati ruota importati!');
          window.location.reload();
        } else {
          alert('Formato non valido.');
        }
      } catch (err) {
        alert('Errore: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleSaveAI = () => {
    setAIKey(aiKey.trim());
    setAIModel(aiModel);
    setAiStatus({ type: 'success', text: 'Impostazioni IA salvate con successo!' });
    setTimeout(() => setAiStatus(null), 3000);
  };

  const handleFetchAiModels = async () => {
    const key = aiKey.trim();
    if (!key) {
      setAiStatus({ type: 'error', text: 'Inserisci prima la tua API Key' });
      return;
    }
    setAiBusy(true);
    setAiStatus(null);
    try {
      const models = await aiListModels(key);
      setAiModelsList(models);
      setAiStatus({ type: 'success', text: `${models.length} modelli disponibili recuperati!` });
      setTimeout(() => setAiStatus(null), 3000);
    } catch (err) {
      setAiStatus({ type: 'error', text: 'Errore: ' + (err.message || String(err)) });
    } finally {
      setAiBusy(false);
    }
  };

  const handleSaveShortUrl = () => {
    setCustomShortUrl(customShortUrl);
    setShortUrlStatus('Link salvato per le sessioni!');
    setTimeout(() => setShortUrlStatus(null), 3000);
  };

  const studentDirectUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}?student=1` 
    : '';

  const inlineSaveButton =
    'absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors';
  const labelClass = 'block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide';

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-xl border-4 border-black animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 border-b-2 border-gray-100 pb-4">
          <h2 className="text-2xl font-black flex items-center gap-2">
            Impostazioni Generali
          </h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">

          {/* SEZIONE 0: SICUREZZA & PROTEZIONE AULA (PIN DOCENTE) */}
          <div className="bg-gradient-to-br from-slate-50 to-amber-50/50 p-5 rounded-2xl border-2 border-slate-300 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-black text-gray-900 uppercase tracking-wide flex items-center gap-2">
                {pinEnabled ? (
                  <ShieldCheck size={20} className="text-green-600" />
                ) : (
                  <ShieldAlert size={20} className="text-amber-600" />
                )}
                Sicurezza & Protezione Aula (PIN Docente)
              </label>
              <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                pinEnabled ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {pinEnabled ? 'Protetto da PIN' : 'Accesso Libero'}
              </span>
            </div>

            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Impedisce agli studenti sui Chromebook di aprire la Dashboard, modificare i set o vedere le impostazioni. Sul tuo computer resti sempre autenticato.
            </p>

            {pinStatus && (
              <div className={`p-2.5 rounded-xl text-xs font-bold mb-3 ${
                pinStatus.type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'
              }`}>
                {pinStatus.text}
              </div>
            )}

            {pinEnabled && !showChangePinForm ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setShowChangePinForm(true)}
                    className="px-3 py-2 bg-white hover:bg-gray-100 border-2 border-gray-300 text-gray-800 font-bold text-xs rounded-xl shadow-sm transition-all"
                  >
                    Modifica PIN Docente
                  </button>
                  <button
                    type="button"
                    onClick={handleRemovePin}
                    className="px-3 py-2 bg-red-50 hover:bg-red-100 border-2 border-red-200 text-red-700 font-bold text-xs rounded-xl transition-all"
                  >
                    Rimuovi Protezione PIN
                  </button>
                  <button
                    type="button"
                    onClick={handleLockNow}
                    className="ml-auto px-3 py-2 bg-black hover:bg-gray-800 text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                    title="Disconnette questo dispositivo per testare il blocco o allontanarsi dalla cattedra"
                  >
                    <Lock size={14} /> Blocca Schermo Ora
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 bg-white p-4 rounded-xl border border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      {pinEnabled ? 'Nuovo PIN:' : 'Crea PIN Docente:'}
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPin ? 'text' : 'password'}
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        placeholder="Es. 1234 o parola chiave"
                        className="w-full p-2.5 pr-8 bg-gray-50 rounded-xl border-2 border-gray-200 text-sm font-mono font-bold outline-none focus:border-black"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPin(!showNewPin)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                      >
                        {showNewPin ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Conferma PIN:</label>
                    <input
                      type={showNewPin ? 'text' : 'password'}
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      placeholder="Ripeti il PIN..."
                      className="w-full p-2.5 bg-gray-50 rounded-xl border-2 border-gray-200 text-sm font-mono font-bold outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleSavePin}
                    className="flex-1 py-2.5 bg-black hover:bg-gray-800 text-white font-black text-xs rounded-xl shadow-sm transition-all"
                  >
                    {pinEnabled ? 'AGGIORNA PIN' : 'ATTIVA PROTEZIONE PIN'}
                  </button>
                  {showChangePinForm && (
                    <button
                      type="button"
                      onClick={() => setShowChangePinForm(false)}
                      className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl"
                    >
                      Annulla
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SEZIONE 1: INTELLIGENZA ARTIFICIALE (GEMINI) */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50/50 p-5 rounded-2xl border-2 border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-black text-purple-900 uppercase tracking-wide flex items-center gap-2">
                <Bot size={18} className="text-purple-600" />
                Intelligenza Artificiale (Google Gemini)
              </label>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs font-bold text-purple-700 hover:text-purple-900 underline flex items-center gap-1"
              >
                Ottieni chiave gratuita <ExternalLink size={12} />
              </a>
            </div>

            <p className="text-xs text-purple-800/80 mb-3">
              Utilizzata per generare automaticamente nuovi scenari didattici all'interno delle attività. Salvata in modo permanente solo nel browser del docente.
            </p>

            {/* API KEY */}
            <div className="mb-3">
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">API Key Google AI</label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={aiKey}
                  onChange={(e) => setAiKeyState(e.target.value)}
                  placeholder="Incolla qui la tua API Key (es. AIzaSy...)"
                  className="w-full p-2.5 pr-10 bg-white rounded-xl border-2 border-purple-200 text-sm font-mono font-medium outline-none focus:border-purple-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  title={showKey ? 'Nascondi' : 'Mostra'}
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* SCELTA MODELLO */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-600 uppercase">Modello Gemini</label>
                <button
                  type="button"
                  onClick={handleFetchAiModels}
                  disabled={aiBusy}
                  className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 disabled:opacity-50"
                  title="Verifica la chiave e scarica la lista aggiornata dei modelli supportati"
                >
                  <RefreshCw size={11} className={aiBusy ? 'animate-spin' : ''} />
                  {aiBusy ? 'Recupero...' : 'Aggiorna elenco modelli'}
                </button>
              </div>
              
              <select
                value={aiModel}
                onChange={(e) => setAiModelState(e.target.value)}
                className="w-full p-2.5 bg-white rounded-xl border-2 border-purple-200 text-sm font-bold text-gray-800 outline-none focus:border-purple-600"
              >
                {aiModelsList.length > 0 ? (
                  aiModelsList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.id} {m.id === DEFAULT_AI_MODEL ? '⭐ (Predefinito)' : ''}
                    </option>
                  ))
                ) : (
                  PRESET_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))
                )}
              </select>
              <p className="text-[11px] text-gray-500 mt-1">
                Modello predefinito: <strong>{DEFAULT_AI_MODEL}</strong>.
              </p>
            </div>

            {/* FEEDBACK & SALVATAGGIO */}
            {aiStatus && (
              <div className={`p-2.5 rounded-xl text-xs font-bold mb-3 ${
                aiStatus.type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'
              }`}>
                {aiStatus.text}
              </div>
            )}

            <button
              onClick={handleSaveAI}
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-black py-2.5 px-4 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Check size={16} /> SALVA IMPOSTAZIONI AI
            </button>
          </div>

          {/* SEZIONE 2: ACCESSO RAPIDO CHROMEBOOK / COLLEGAMENTO STUDENTI */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-5 rounded-2xl border-2 border-amber-200">
            <label className="text-sm font-black text-amber-900 uppercase tracking-wide flex items-center gap-2 mb-2">
              <Laptop size={18} className="text-amber-700" />
              Accesso Rapido per Studenti su Chromebook / PC
            </label>
            <p className="text-xs text-amber-900/80 mb-3">
              Gli studenti su Chromebook possono collegarsi aprendo il link della scuola e inserendo il <strong>codice PIN a 4 lettere</strong> della sessione.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  Link Diretto Consigliato per i Preferiti dei Chromebook:
                </label>
                <div className="relative">
                  <input
                    readOnly
                    value={studentDirectUrl}
                    className="w-full p-2.5 pr-20 bg-white rounded-xl border border-amber-300 text-xs font-mono select-all text-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(studentDirectUrl);
                      alert('Link copiato! Salvalo nei preferiti dei Chromebook.');
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-amber-600 hover:bg-amber-700 text-white px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <Copy size={12} /> Copia
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  Link Breve Personalizzato (opzionale):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customShortUrl}
                    onChange={(e) => setCustomShortUrlState(e.target.value)}
                    placeholder="Es. bit.ly/skills-scuola o tinyurl.com/aula"
                    className="flex-1 p-2.5 bg-white rounded-xl border border-amber-300 text-xs font-mono outline-none focus:border-amber-600"
                  />
                  <button
                    type="button"
                    onClick={handleSaveShortUrl}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-black shadow-sm transition-all"
                  >
                    Salva
                  </button>
                </div>
              </div>

              {shortUrlStatus && (
                <p className="text-xs font-bold text-green-700 animate-in fade-in">{shortUrlStatus}</p>
              )}
            </div>
          </div>

          {/* SEZIONE 3: NOME UTENTE E NAMESPACE */}
          <div>
            <label className={labelClass}>Nome utente docente</label>
            <div className="relative">
              <input
                ref={usernameRef}
                defaultValue={getUsername()}
                placeholder="es: maria, classe_2a..."
                className="w-full p-3 rounded-xl border-2 border-gray-200 outline-none focus:border-black font-bold text-sm"
              />
              <button onClick={saveUser} className={inlineSaveButton}>
                SALVA
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Namespace attuale database: <span className="font-mono text-black font-bold">{appId}</span>
            </p>
          </div>

          <hr className="border-gray-200" />

          {/* SEZIONE 4: RUOTA DELLE EMOZIONI */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
              Ruota delle Emozioni
            </label>
            <div className="flex gap-2 mb-2">
              {[
                ['image', 'Immagine'],
                ['svg', 'SVG Interattiva'],
              ].map(([mode, label]) => (
                <button
                  key={mode}
                  onClick={() => switchWheelMode(mode)}
                  className={`flex-1 py-2 rounded-xl font-bold text-sm border-2 transition-all ${
                    getWheelMode() === mode
                      ? 'bg-black text-white border-black shadow-md'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {getWheelMode() === 'svg' && (
              <div className="mt-3">
                <label className="block text-xs font-bold text-gray-400 mb-1">Palette colori</label>
                <div className="flex gap-2 mb-2">
                  {Object.keys(PALETTE_LABELS).map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setWheelPalette(p);
                        window.location.reload();
                      }}
                      className={`flex-1 py-2 rounded-xl text-xs font-black border-2 transition-all ${
                        getWheelPalette() === p
                          ? 'bg-black text-white border-black'
                          : 'bg-gray-100 border-gray-300 hover:border-black'
                      }`}
                    >
                      {PALETTE_LABELS[p]}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={exportWheelData}
                    className="flex-1 py-1.5 rounded-lg font-bold text-xs bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                  >
                    Esporta dati ruota
                  </button>
                  <label className="flex-1 py-1.5 rounded-lg font-bold text-xs bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 text-center cursor-pointer">
                    Importa dati ruota
                    <input type="file" accept=".json" className="hidden" onChange={importWheelData} />
                  </label>
                </div>
              </div>
            )}
          </div>

          <hr className="border-gray-200" />

          {/* SEZIONE 5: CONFIGURAZIONE CLOUD FIREBASE (NON HARDCODED) */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black uppercase text-gray-700 tracking-wide">
                Progetto Cloud Firebase
              </label>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                isFirebaseConfigured() ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
              }`}>
                {isFirebaseConfigured() ? 'Connesso' : 'Modalità Locale'}
              </span>
            </div>

            <p className="text-xs text-gray-500 mb-3">
              Le credenziali Firebase sono salvate nello storage di questo browser. Non sono visibili su GitHub.
            </p>

            {isFirebaseConfigured() && (
              <div className="mb-3">
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Codice di sincronizzazione aula (base64):</label>
                <div className="relative">
                  <input
                    readOnly
                    value={encodeFBConfig(getFBConfig())}
                    className="w-full p-2.5 bg-white rounded-xl border border-gray-200 text-xs font-mono pr-16 select-all text-gray-600"
                  />
                  <button
                    onClick={() =>
                      navigator.clipboard
                        .writeText(encodeFBConfig(getFBConfig()))
                        .then(() => alert('Codice di configurazione copiato!'))
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white px-2.5 py-1 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors"
                  >
                    COPIA
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">
                {isFirebaseConfigured() ? 'Sostituisci o aggiorna configurazione:' : 'Incolla codice configurazione Firebase:'}
              </label>
              <textarea
                ref={configRef}
                placeholder="Incolla qui il codice o il JSON del progetto Firebase..."
                className="w-full p-2.5 rounded-xl border border-gray-300 font-mono text-xs h-16 outline-none focus:border-black bg-white"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={applyConfig}
                  className="flex-1 bg-black text-white py-2.5 rounded-xl font-bold text-xs hover:bg-gray-800 transition-colors"
                >
                  APPLICA CONFIGURAZIONE
                </button>
                {isFirebaseConfigured() && (
                  <button
                    onClick={resetConfig}
                    className="bg-red-100 text-red-700 px-3 py-2.5 rounded-xl font-bold text-xs hover:bg-red-200 transition-colors"
                    title="Rimuovi le credenziali e usa solo il database locale"
                  >
                    DISCONNETTI
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
