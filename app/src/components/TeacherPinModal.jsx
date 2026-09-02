import React, { useState } from 'react';
import { Lock, Unlock, Eye, EyeOff, X, ArrowLeft, ShieldCheck } from 'lucide-react';
import { verifyTeacherPin, loginTeacher } from '../lib/security';

export default function TeacherPinModal({ isOpen, onClose, onSuccess, dbData }) {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!pin.trim()) {
      setError('Inserisci il PIN Docente');
      return;
    }

    setBusy(true);
    setError('');

    try {
      const isValid = await verifyTeacherPin(pin, dbData);
      if (isValid) {
        loginTeacher(remember);
        setPin('');
        setError('');
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      } else {
        setError('PIN Docente non corretto. Riprova.');
      }
    } catch (err) {
      setError('Errore di verifica: ' + err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-black max-w-md w-full p-6 sm:p-8 relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header con lucchetto */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Area Docente Protetta</h2>
          <p className="text-xs text-gray-500 font-bold mt-1">
            Inserisci il PIN Docente per accedere alla Dashboard e alle impostazioni.
          </p>
        </div>

        {/* Form di inserimento */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase text-gray-600 mb-1.5 tracking-wider">
              PIN Docente:
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                autoFocus
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                placeholder="Inserisci il PIN..."
                className="w-full text-center text-2xl font-mono font-black tracking-widest p-3.5 rounded-2xl border-2 border-gray-300 focus:border-black outline-none bg-gray-50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1"
                title={showPin ? 'Nascondi PIN' : 'Mostra PIN'}
              >
                {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl text-center animate-in shake">
              ⚠️ {error}
            </div>
          )}

          <label className="flex items-center gap-2.5 text-xs font-bold text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-200 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded text-black accent-black cursor-pointer"
            />
            <span>Resta autenticato su questo computer (consigliato)</span>
          </label>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={busy || !pin.trim()}
              className="w-full py-3.5 rounded-2xl font-black text-sm text-white bg-black hover:bg-gray-800 disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Unlock size={18} />
              {busy ? 'Verifica in corso...' : 'SBLOCCA AREA DOCENTE'}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl font-bold text-xs text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all flex items-center justify-center gap-1.5"
            >
              <ArrowLeft size={14} /> Annulla e torna alla schermata Studente
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
