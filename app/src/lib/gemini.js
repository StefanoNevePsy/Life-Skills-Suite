// Generazione di scenari tramite le API di Google Gemini.
//
// La chiave viene salvata in localStorage in chiaro: è leggibile da chiunque
// apra i DevTools sullo stesso browser. Su un computer condiviso conviene non
// salvarla.

const LS_AI_KEY = 'lss_gemini_key';
const LS_AI_MODEL = 'lss_gemini_model';
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

export function getAIKey() {
  try {
    return localStorage.getItem(LS_AI_KEY) || '';
  } catch {
    return '';
  }
}

export function setAIKey(k) {
  try {
    localStorage.setItem(LS_AI_KEY, k);
  } catch {
    /* storage non disponibile: la chiave resta valida solo per questa sessione */
  }
}

export const DEFAULT_AI_MODEL = 'gemini-3.5-flash-lite';

export function getAIModel() {
  try {
    return localStorage.getItem(LS_AI_MODEL) || DEFAULT_AI_MODEL;
  } catch {
    return DEFAULT_AI_MODEL;
  }
}

export function setAIModel(m) {
  try {
    localStorage.setItem(LS_AI_MODEL, m);
  } catch {
    /* vedi sopra */
  }
}

/**
 * Elenca i modelli che supportano generateContent.
 * Segue la paginazione e deduplica, così nuovi modelli compaiono da soli.
 */
export async function aiListModels(key) {
  const out = [];
  let token = '';

  for (let page = 0; page < 5; page++) {
    const url =
      `${API_BASE}?pageSize=200` +
      (token ? '&pageToken=' + encodeURIComponent(token) : '') +
      '&key=' +
      encodeURIComponent(key);
    const r = await fetch(url);
    if (!r.ok) {
      const t = await r.text();
      throw new Error('HTTP ' + r.status + ' – ' + t.slice(0, 220));
    }
    const j = await r.json();
    (j.models || []).forEach((m) => {
      if ((m.supportedGenerationMethods || []).indexOf('generateContent') >= 0) {
        out.push({ id: String(m.name || '').replace(/^models\//, ''), label: m.displayName || m.name });
      }
    });
    token = j.nextPageToken || '';
    if (!token) break;
  }

  const seen = {};
  return out
    .filter((m) => m.id && !seen[m.id] && (seen[m.id] = true))
    .sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * Una singola chiamata di generazione.
 * Chiede una risposta in JSON; se il modello non supporta responseMimeType
 * (HTTP 400) ritenta senza, e in quel caso ci pensa il parser a estrarre l'array.
 */
export async function aiGenerate(key, model, prompt) {
  const url = `${API_BASE}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;
  const request = (useJson) => ({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: useJson
        ? { temperature: 1, maxOutputTokens: 8192, responseMimeType: 'application/json' }
        : { temperature: 1, maxOutputTokens: 8192 },
    }),
  });

  let r = await fetch(url, request(true));
  if (r.status === 400) r = await fetch(url, request(false));
  if (!r.ok) {
    const t = await r.text();
    throw new Error('HTTP ' + r.status + ' – ' + t.slice(0, 300));
  }

  const j = await r.json();
  const candidate = j.candidates && j.candidates[0];
  if (!candidate && j.promptFeedback && j.promptFeedback.blockReason) {
    throw new Error('Richiesta bloccata: ' + j.promptFeedback.blockReason);
  }
  const parts = (candidate && candidate.content && candidate.content.parts) || [];
  return parts.map((part) => part.text || '').join('');
}

/** Contesto di partenza per il prompt, dedotto dalla modalità in cui ci si trova. */
export const AI_CONTEXT = {
  emotions:
    'scenari brevi di vita quotidiana adolescenziale che suscitano emozioni forti (scuola, famiglia, amicizia, relazioni, esclusione sociale)',
  decisions_cold:
    'dilemmi decisionali da affrontare a mente fredda, con tempo per ragionare (scelte scolastiche, progetti futuri, gestione di denaro e tempo)',
  decisions_hot:
    'situazioni che richiedono una decisione immediata sotto pressione emotiva (provocazioni, rischi, pressione del gruppo dei pari)',
  emotion_narratives: 'nomi di emozioni e loro sfumature (una o due parole ciascuna)',
  affectivity_sexuality:
    'scenari su affettività, relazioni sentimentali e sessualità adolescenziale, trattati con rispetto, senza contenuti espliciti',
  effective_communication:
    'scenari di dialogo e interazione sociale adolescenziale per riconoscere e analizzare la comunicazione passiva, aggressiva e assertiva (risposte a richieste, conflitti, critiche, confini personali)',
};

export function aiBuildPrompt(type, count, topics, existing) {
  const ctx = AI_CONTEXT[type] || 'scenari educativi per adolescenti';
  let prompt =
    'Sei un esperto di educazione socio-affettiva per adolescenti (11-19 anni). Genera esattamente ' +
    count +
    ' nuovi elementi del tipo: ' +
    ctx +
    '.\n\n';

  if (topics && topics.trim()) {
    prompt += 'Argomenti e vincoli richiesti dal docente: ' + topics.trim() + '\n\n';
  }
  if (existing && existing.length) {
    prompt +=
      'Evita di duplicare questi elementi già presenti:\n' +
      existing
        .slice(0, 60)
        .map((t) => '- ' + t)
        .join('\n') +
      '\n\n';
  }

  prompt +=
    'Regole:\n' +
    '- Scrivi in italiano.\n' +
    '- Ogni elemento deve essere autonomo e comprensibile da solo.\n' +
    '- Linguaggio concreto, realistico, adatto al contesto scolastico.\n' +
    '- Nessuna numerazione dentro il testo.\n' +
    '- Descrivi solo la situazione, senza consigli o soluzioni.\n\n' +
    'Rispondi SOLO con un array JSON nel formato: [{"text":"...","tags":["tag1","tag2"]}]';

  return prompt;
}

/**
 * Parser tollerante della risposta del modello: regge i blocchi ```json,
 * un array annidato nel testo, e array di stringhe semplici.
 * Restituisce [] se non trova nulla di valido.
 */
export function aiParseItems(raw) {
  let s = String(raw || '').trim();
  s = s
    .replace(/^```(?:json)?/i, '')
    .replace(/```\s*$/, '')
    .trim();

  let arr = null;
  try {
    arr = JSON.parse(s);
  } catch {
    const m = s.match(/\[[\s\S]*\]/);
    if (m) {
      try {
        arr = JSON.parse(m[0]);
      } catch {
        /* nessun array recuperabile */
      }
    }
  }
  if (!Array.isArray(arr)) return [];

  return arr
    .map((o) => {
      const text = typeof o === 'string' ? o : (o && (o.text || o.scenario || o.titolo || o.nome)) || '';
      const tags = o && Array.isArray(o.tags) ? o.tags.map((t) => String(t)) : ['ai'];
      return text && String(text).trim()
        ? { text: String(text).trim(), tags: tags.length ? tags : ['ai'] }
        : null;
    })
    .filter(Boolean);
}
