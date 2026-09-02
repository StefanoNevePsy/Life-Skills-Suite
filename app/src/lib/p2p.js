// Trasferimento dati fra due dispositivi via WebRTC (PeerJS), senza passare
// da Firebase. Utile per spostare scenari e set da un computer all'altro,
// anche quando la rete della scuola blocca il traffico verso l'esterno.
//
// pako, Peer, QRCode e Html5Qrcode arrivano dagli script CDN in index.html.

export const P2P_CATEGORIES = [
  'emotions',
  'decisions_cold',
  'decisions_hot',
  'emotion_narratives',
  'affectivity_sexuality',
  'feedback_sets',
  'poll_sets',
  'emotion_thermometer',
];

export const P2P_CATEGORY_LABELS = {
  emotions: 'Emozioni',
  decisions_cold: 'Decisioni Freddo',
  decisions_hot: 'Decisioni Caldo',
  emotion_narratives: 'Narrazione Emotiva',
  affectivity_sexuality: 'Affettività',
  feedback_sets: 'Set Feedback',
  poll_sets: 'Set Sondaggi',
  emotion_thermometer: 'Termometro Emozioni',
};

/** Comprime con deflate e codifica in base64, per stare nei messaggi PeerJS. */
export function p2pCompress(data) {
  const json = JSON.stringify(data);
  const compressed = pako.deflate(json);
  return btoa(String.fromCharCode.apply(null, compressed));
}

export function p2pDecompress(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return JSON.parse(pako.inflate(bytes, { to: 'string' }));
}

/**
 * Unisce i dati ricevuti a quelli locali senza sovrascrivere nulla:
 * aggiunge solo gli elementi che non ci sono già.
 * Il confronto usa l'id quando c'è, altrimenti il testo.
 */
export function p2pMergeData(local, received) {
  const result = { ...local };

  for (const cat of P2P_CATEGORIES) {
    if (!received[cat]) continue;
    if (!result[cat]) {
      result[cat] = received[cat];
      continue;
    }

    const localKeys = new Set(result[cat].map((x) => (x.id != null ? String(x.id) : x.text)));
    const newItems = received[cat].filter((x) => !localKeys.has(x.id != null ? String(x.id) : x.text));
    if (newItems.length > 0) result[cat] = [...result[cat], ...newItems];
  }

  return result;
}
