import React, { useRef } from 'react';
import { X } from 'lucide-react';
import {
  getUsername,
  saveUsername,
  getFBConfig,
  saveFBConfig,
  encodeFBConfig,
  decodeFBConfig,
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

const PALETTE_LABELS = { insideout: 'Inside Out', pastel: 'Pastello', vivid: 'Vivido' };

/**
 * Impostazioni globali: namespace utente, modalità della ruota e
 * configurazione Firebase condivisibile fra colleghi.
 *
 * Namespace e configurazione Firebase decidono a quale database ci si collega,
 * perciò salvarli comporta un ricaricamento della pagina.
 */
export default function SettingsModal({ isOpen, onClose, appId }) {
  const usernameRef = useRef(null);
  const configRef = useRef(null);

  if (!isOpen) return null;

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
    if (!confirm('Ripristinare la configurazione predefinita?')) return;
    localStorage.removeItem('lss_firebase_config');
    alert("Ripristinata! L'app si ricaricherà.");
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
        // Si accetta solo una ruota vera: array di settori con core e secondarie.
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

  const inlineSaveButton =
    'absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white px-3 py-1 rounded-lg text-xs font-bold';
  const labelClass = 'block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide';

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg border-4 border-black animate-in zoom-in max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black">Impostazioni</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className={labelClass}>Nome utente (namespace)</label>
            <div className="relative">
              <input
                ref={usernameRef}
                defaultValue={getUsername()}
                placeholder="Es. rossi_mario"
                className="w-full p-3 bg-gray-50 rounded-xl border-2 border-gray-200 text-sm font-bold outline-none focus:border-black pr-24"
              />
              <button onClick={saveUser} className={inlineSaveButton}>
                SALVA
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Namespace attuale: <strong>{appId}</strong>. Ogni nome utente crea un database separato. Lascia
              vuoto per il database condiviso predefinito.
            </p>
          </div>

          <hr className="border-gray-200" />

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
                  className={`flex-1 py-2 rounded-xl font-bold text-sm border-2 ${
                    getWheelMode() === mode
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {getWheelMode() === 'svg' && (
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Palette colori</label>
                <div className="flex gap-2 mb-2">
                  {Object.keys(PALETTE_LABELS).map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setWheelPalette(p);
                        window.location.reload();
                      }}
                      className={`flex-1 py-2 rounded-xl text-xs font-black border-2 ${
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

            <p className="text-xs text-gray-400 mt-1">
              Modalità SVG: ruota vettoriale con evidenziazione automatica. Clicca su un’emozione per
              modificarla.
            </p>
          </div>

          <hr className="border-gray-200" />

          <div>
            <label className={labelClass}>Il tuo codice di configurazione</label>
            <div className="relative">
              <input
                readOnly
                value={encodeFBConfig(getFBConfig())}
                className="w-full p-3 bg-gray-50 rounded-xl border-2 border-gray-200 text-xs font-mono pr-20"
                onClick={(e) => e.target.select()}
              />
              <button
                onClick={() =>
                  navigator.clipboard
                    .writeText(encodeFBConfig(getFBConfig()))
                    .then(() => alert('Copiato negli appunti!'))
                }
                className={inlineSaveButton}
              >
                COPIA
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Condividi questo codice con i colleghi per usare lo stesso database.
            </p>
          </div>

          <div>
            <label className={labelClass}>Incolla codice di un collega</label>
            <textarea
              ref={configRef}
              placeholder="Incolla qui il codice ricevuto dal collega..."
              className="w-full p-3 rounded-xl border-2 border-gray-200 font-mono text-xs h-20 outline-none focus:border-black"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={applyConfig}
                className="flex-1 bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800"
              >
                APPLICA
              </button>
              <button
                onClick={resetConfig}
                className="bg-red-100 text-red-600 px-4 py-3 rounded-xl font-bold hover:bg-red-200"
              >
                RESET
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
