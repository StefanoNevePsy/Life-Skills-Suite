// Configurazione Firebase, con possibilità di sovrascriverla dalle impostazioni.
// La configurazione personalizzata viene salvata in localStorage, così ogni
// installazione può puntare al proprio progetto Firebase senza ricompilare.

const LS_FB_KEY = 'lss_firebase_config';

const DEFAULT_FB = {
  apiKey: 'AIzaSyC16Iwrjd9ZhVa979MHGh-P4cQMCBUfePE',
  authDomain: 'life-skills-suite.firebaseapp.com',
  projectId: 'life-skills-suite',
  storageBucket: 'life-skills-suite.firebasestorage.app',
  messagingSenderId: '674230711374',
  appId: '1:674230711374:web:e92f3a210d7d3c6367bf1f',
};

export function getFBConfig() {
  try {
    const s = localStorage.getItem(LS_FB_KEY);
    if (s) {
      const c = JSON.parse(s);
      if (c && c.apiKey) return c;
    }
  } catch {
    /* configurazione illeggibile: si usa quella di default */
  }
  return DEFAULT_FB;
}

export function saveFBConfig(c) {
  localStorage.setItem(LS_FB_KEY, JSON.stringify(c));
}

/** Serializza la configurazione in base64, per condividerla come singola stringa. */
export function encodeFBConfig(c) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(c))));
}

/** Accetta sia la forma base64 sia il JSON grezzo. Restituisce null se non valida. */
export function decodeFBConfig(s) {
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
  localStorage.setItem(LS_USER_KEY, u ? u.trim() : '');
}

/** Namespace delle collection Firestore, derivato dal nome utente. */
export function getAppId() {
  const uname = getUsername();
  return uname ? 'lifeskills-' + uname.toLowerCase().replace(/[^a-z0-9_-]/g, '_') : 'lifeskills-default';
}

export { DEFAULT_FB };
