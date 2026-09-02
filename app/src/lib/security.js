// Modulo di sicurezza: gestione del PIN Docente sincronizzato con Firebase
// L'impronta crittografica (SHA-256) viene salvata su Firebase (main_db.teacher_pin_hash),
// così ogni Chromebook/dispositivo studente sa che la Dashboard è protetta,
// mentre sul computer del docente viene memorizzato il token autorizzato.

const LS_PIN_HASH = 'lss_teacher_pin_hash';
const LS_SESSION_TOKEN = 'lss_teacher_session_token';
const SS_SESSION_KEY = 'lss_teacher_session';

/**
 * Calcola l'hash SHA-256 di una stringa tramite Web Crypto API.
 */
export async function hashString(str) {
  const enc = new TextEncoder();
  const data = enc.encode(str.trim());
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuf = await crypto.subtle.digest('SHA-256', data);
    const hashArr = Array.from(new Uint8Array(hashBuf));
    return hashArr.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback di emergenza
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'fb_' + Math.abs(hash).toString(16);
}

/**
 * Restituisce l'hash del PIN atteso (da Firebase o da localStorage).
 */
export function getExpectedPinHash(dbData) {
  if (dbData && typeof dbData.teacher_pin_hash === 'string' && dbData.teacher_pin_hash.trim().length > 0) {
    return dbData.teacher_pin_hash.trim();
  }
  try {
    return localStorage.getItem(LS_PIN_HASH) || '';
  } catch {
    return '';
  }
}

/**
 * Verifica se la protezione con PIN Docente è attiva globalmente (su Firebase o in locale).
 */
export function isPinProtectionEnabled(dbData) {
  const expected = getExpectedPinHash(dbData);
  return Boolean(expected && expected.length > 0);
}

/**
 * Imposta o aggiorna il PIN Docente sia su Firebase (se collegato) che in localStorage.
 */
export async function setTeacherPin(pin, onUpdateData, currentData) {
  if (!pin || !pin.trim()) {
    removeTeacherPin(onUpdateData, currentData);
    return;
  }
  const hash = await hashString(pin);
  try {
    localStorage.setItem(LS_PIN_HASH, hash);
    // Sul computer in cui viene impostato il PIN, autentica subito il docente
    loginTeacher(true);
  } catch (err) {
    console.error('Impossibile salvare il PIN in locale:', err);
  }

  // Sincronizzazione Cloud con Firebase
  if (onUpdateData && currentData) {
    const nextData = {
      ...currentData,
      teacher_pin_hash: hash,
    };
    onUpdateData(nextData);
  }
}

/**
 * Rimuove il PIN Docente sia da Firebase che da localStorage (torna ad accesso libero).
 */
export function removeTeacherPin(onUpdateData, currentData) {
  try {
    localStorage.removeItem(LS_PIN_HASH);
    localStorage.removeItem(LS_SESSION_TOKEN);
    sessionStorage.removeItem(SS_SESSION_KEY);
  } catch {}

  if (onUpdateData && currentData) {
    const nextData = { ...currentData };
    delete nextData.teacher_pin_hash;
    onUpdateData(nextData);
  }
}

/**
 * Verifica se il PIN inserito corrisponde all'hash memorizzato su Firebase (o in locale).
 */
export async function verifyTeacherPin(inputPin, dbData) {
  if (!isPinProtectionEnabled(dbData)) return true;
  if (!inputPin) return false;
  const expected = getExpectedPinHash(dbData);
  if (!expected) return true;
  const inputHash = await hashString(inputPin);
  return inputHash === expected;
}

/**
 * Verifica se questo dispositivo ha un token di sessione docente attivo.
 */
export function hasTeacherSession() {
  try {
    const persistentToken = localStorage.getItem(LS_SESSION_TOKEN);
    if (persistentToken) return true;

    const sessionToken = sessionStorage.getItem(SS_SESSION_KEY);
    if (sessionToken === 'active') return true;

    return false;
  } catch {
    return false;
  }
}

/**
 * Verifica se il dispositivo corrente ha una sessione docente autorizzata.
 */
export function isTeacherAuthenticated(dbData) {
  return hasTeacherSession();
}

/**
 * Autentica il docente creando i token di sessione.
 * @param {boolean} rememberDevice - Se true, memorizza l'accesso in modo permanente su questo computer.
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
