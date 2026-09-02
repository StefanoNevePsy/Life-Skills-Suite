// Configurazione Firebase, salvata nello storage permanente (localStorage).
// Le credenziali NON sono hardcoded nel repository pubblico: vengono configurate
// nelle impostazioni o ereditate tramite link di sessione / variabili d'ambiente.

const LS_FB_KEY = 'lss_firebase_config';

// Schema vuoto predefinito (nessuna credenziale esposta su GitHub)
const EMPTY_FB = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

export function getFBConfig() {
  // 1. Priorità: Configurazione salvata in localStorage
  try {
    const s = localStorage.getItem(LS_FB_KEY);
    if (s) {
      const c = JSON.parse(s);
      if (c && c.apiKey && c.apiKey.trim()) return c;
    }
  } catch {
    /* localStorage non disponibile o JSON corrotto */
  }

  // 2. Priorità: Variabili d'ambiente Vite (.env.local o hosting server)
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_FIREBASE_API_KEY) {
      return {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
        appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
      };
    }
  } catch {}

  // 3. Fallback: non configurato
  return EMPTY_FB;
}

export function isFirebaseConfigured() {
  const cfg = getFBConfig();
  return Boolean(cfg && cfg.apiKey && cfg.apiKey.trim() && cfg.projectId);
}

export function saveFBConfig(c) {
  try {
    localStorage.setItem(LS_FB_KEY, JSON.stringify(c));
  } catch (err) {
    console.error('Errore nel salvataggio della configurazione Firebase:', err);
  }
}

export function resetFBConfig() {
  try {
    localStorage.removeItem(LS_FB_KEY);
  } catch {}
}

/** Serializza la configurazione in base64, per condividerla come singola stringa o parametro URL. */
export function encodeFBConfig(c) {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(c))));
  } catch {
    return '';
  }
}

/** Accetta sia la forma base64 sia il JSON grezzo. Restituisce null se non valida. */
export function decodeFBConfig(s) {
  if (!s || typeof s !== 'string') return null;
  try {
    const j = JSON.parse(decodeURIComponent(escape(atob(s.trim()))));
    return j && j.apiKey ? j : null;
  } catch {
    try {
      const j = JSON.parse(s.trim());
      return j && j.apiKey ? j : null;
    } catch {
      return null;
    }
  }
}

// --- Nome utente -----------------------------------------------------------
// Serve a separare i database di docenti diversi che usano lo stesso progetto
// Firebase: il nome viene normalizzato e usato come prefisso delle collection.

const LS_USER_KEY = 'lss_username';

export function getUsername() {
  try {
    const s = localStorage.getItem(LS_USER_KEY);
    return s ? s.trim() : '';
  } catch {
    return '';
  }
}

export function saveUsername(u) {
  try {
    localStorage.setItem(LS_USER_KEY, u ? u.trim() : '');
  } catch {}
}

/** Namespace delle collection Firestore, derivato dal nome utente. */
export function getAppId() {
  const uname = getUsername();
  return uname ? 'lifeskills-' + uname.toLowerCase().replace(/[^a-z0-9_-]/g, '_') : 'lifeskills-default';
}

export { EMPTY_FB as DEFAULT_FB };
