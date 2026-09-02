// Helper per gestione link brevi e accesso studenti da Chromebook/PC

const LS_SHORT_URL = 'lss_custom_short_url';

export function getCustomShortUrl() {
  try {
    return localStorage.getItem(LS_SHORT_URL) || '';
  } catch {
    return '';
  }
}

export function setCustomShortUrl(url) {
  try {
    localStorage.setItem(LS_SHORT_URL, (url || '').trim());
  } catch {}
}

/**
 * Genera al volo un link breve TinyURL per l'URL dato (gratuito e senza API key).
 */
export async function generateTinyUrl(longUrl) {
  try {
    const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
    if (res.ok) {
      const short = await res.text();
      if (short && short.startsWith('http')) {
        return short.trim();
      }
    }
  } catch (e) {
    console.warn('TinyURL generation failed:', e);
  }
  return null;
}

/**
 * Restituisce l'URL pulito per la pagina studente (da proiettare sulla LIM / Chromebook).
 */
export function getStudentBaseUrl() {
  const custom = getCustomShortUrl();
  if (custom) return custom;
  try {
    const loc = window.location;
    // URL base senza query string
    return `${loc.origin}${loc.pathname}`;
  } catch {
    return '';
  }
}
