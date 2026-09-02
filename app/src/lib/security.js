// Modulo di sicurezza: gestione del PIN Docente e delle sessioni autorizzate
// Consente di blindare l'app in aula affinché gli studenti non possano
// accedere alla Dashboard o modificare i dati.

const LS_PIN_HASH = 'lss_teacher_pin_hash';
const LS_SESSION_TOKEN = 'lss_teacher_session_token';
const SS_SESSION_KEY = 'lss_teacher_session';

/**
 * Calcola l'hash SHA-256 di una stringa tramite Web Crypto API.
 */
async function hashString(str) {
  const enc = new TextEncoder();
  const data = enc.encode(str.trim());
  if (crypto && crypto.subtle) {
    const hashBuf = await crypto.subtle.digest('SHA-256', data);
    const hashArr = Array.from(new Uint8Array(hashBuf));
    return hashArr.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback semplice nel caso estremo in cui crypto.subtle non sia disponibile
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'fb_' + Math.abs(hash).toString(16);
}

/**
 * Verifica se la protezione con PIN Docente è attiva.
 */
export function isPinProtectionEnabled() {
  try {
    const stored = localStorage.getItem(LS_PIN_HASH);
    return Boolean(stored && stored.trim().length > 0);
  } catch {
    return false;
  }
}

/**
 * Imposta o aggiorna il PIN Docente.
 */
export async function setTeacherPin(pin) {
  if (!pin || !pin.trim()) {
    removeTeacherPin();
    return;
  }
  const hash = await hashString(pin);
  try {
    localStorage.setItem(LS_PIN_HASH, hash);
    // Se impostiamo il PIN dal computer del docente, autentichiamo subito la sessione
    loginTeacher(true);
  } catch (err) {
    console.error('Impossibile salvare il PIN:', err);
  }
}

/**
 * Rimuove il PIN Docente (torna alla modalità aperta).
 */
export function removeTeacherPin() {
  try {
    localStorage.removeItem(LS_PIN_HASH);
    localStorage.removeItem(LS_SESSION_TOKEN);
    sessionStorage.removeItem(SS_SESSION_KEY);
  } catch {}
}

/**
 * Verifica se il PIN inserito corrisponde a quello memorizzato.
 */
export async function verifyTeacherPin(inputPin) {
  if (!isPinProtectionEnabled()) return true;
  if (!inputPin) return false;
  try {
    const storedHash = localStorage.getItem(LS_PIN_HASH);
    const inputHash = await hashString(inputPin);
    return storedHash === inputHash;
  } catch {
    return false;
  }
}

/**
 * Verifica se il dispositivo corrente ha una sessione docente valida.
 * Se la protezione con PIN è disattivata, restituisce sempre true.
 */
export function isTeacherAuthenticated() {
  if (!isPinProtectionEnabled()) return true;
  try {
    // 1. Verifica token permanente su questo dispositivo ("Resta autenticato")
    const persistentToken = localStorage.getItem(LS_SESSION_TOKEN);
    if (persistentToken) return true;

    // 2. Verifica sessione attiva nella scheda corrente
    const sessionToken = sessionStorage.getItem(SS_SESSION_KEY);
    if (sessionToken === 'active') return true;

    return false;
  } catch {
    return false;
  }
}

/**
 * Autentica il docente creando i token di sessione.
 * @param {boolean} rememberDevice - Se true, memorizza l'accesso su questo computer.
 */
export function loginTeacher(rememberDevice = true) {
  try {
    sessionStorage.setItem(SS_SESSION_KEY, 'active');
    if (rememberDevice) {
      const token = 'token_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem(LS_SESSION_TOKEN, token);
    }
  } catch (err) {
    console.error('Errore memorizzazione sessione docente:', err);
  }
}

/**
 * Blocca la sessione docente (disconnette questo dispositivo).
 */
export function logoutTeacher() {
  try {
    sessionStorage.removeItem(SS_SESSION_KEY);
    localStorage.removeItem(LS_SESSION_TOKEN);
  } catch {}
}
