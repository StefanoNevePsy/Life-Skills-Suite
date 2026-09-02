// Esportazione dei risultati di una sessione.
// XLSX e la nuvola di parole in SVG arrivano dagli script CDN in index.html.

/** Una risposta è visibile se moderata come tale, o se non è mai stata moderata. */
export const isVisibleResponse = (r) =>
  r.status === 'visible' || r.visible === true || (r.visible !== false && !r.status);

/**
 * Nelle risposte multiple ogni voce è "Domanda:\nRisposta".
 * Queste due funzioni separano le parti.
 */
const answerOf = (t) => {
  const nl = t.indexOf('\n');
  return nl >= 0 ? t.substring(nl + 1) : t;
};

const questionOf = (t) => {
  const nl = t.indexOf('\n');
  return nl >= 0 ? t.substring(0, nl).replace(/:$/, '') : '';
};

export function exportSessionXLSX(session, sessionCode) {
  if (typeof XLSX === 'undefined') return alert('Libreria XLSX non caricata.');

  const wb = XLSX.utils.book_new();
  const visible = session.responses.filter(isVisibleResponse);

  if (session.type === 'qa') {
    const rows = visible.map((r, idx) => ({
      '#': idx + 1,
      Risposta: Array.isArray(r.text) ? r.text.map(answerOf).join(' | ') : r.text,
      Domanda: Array.isArray(r.text) ? r.text.map(questionOf).filter(Boolean).join(' | ') : '',
      Studente: r.studentName || 'Anonimo',
      Ora: new Date(r.timestamp).toLocaleString(),
      Stato: r.status || 'visible',
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = [{ wch: 5 }, { wch: 50 }, { wch: 40 }, { wch: 20 }, { wch: 20 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Risposte Q&A');
  } else if (session.type === 'poll') {
    const options = Array.isArray(session.options) ? session.options : [];
    const counts = {};
    options.forEach((op) => (counts[op] = 0));
    visible.forEach((r) => {
      (Array.isArray(r.text) ? r.text : [r.text]).forEach((t) => {
        if (counts[t] !== undefined) counts[t]++;
      });
    });

    const rows = options.map((op) => ({
      Opzione: op,
      Voti: counts[op],
      Percentuale: visible.length > 0 ? Math.round((counts[op] / visible.length) * 100) + '%' : '0%',
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = [{ wch: 30 }, { wch: 10 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Sondaggio');

    if (session.question) {
      const info = [
        { Domanda: session.question, 'Totale Voti': visible.length, Data: new Date().toLocaleString() },
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(info), 'Info');
    }
  } else if (session.type === 'wordcloud') {
    // Le parole si contano ignorando maiuscole, ma si mostra la prima grafia vista.
    const wordMap = {};
    visible.forEach((r) => {
      const raw = Array.isArray(r.text) ? r.text.join(' ') : r.text;
      const word = raw ? String(raw).trim() : '';
      if (!word) return;
      const key = word.toLowerCase();
      if (!wordMap[key]) wordMap[key] = { text: word, count: 0 };
      wordMap[key].count++;
    });

    const rows = Object.values(wordMap)
      .sort((a, b) => b.count - a.count)
      .map((w, i) => ({ '#': i + 1, Parola: w.text, Occorrenze: w.count }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = [{ wch: 5 }, { wch: 30 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Brainstorming');
  }

  XLSX.writeFile(wb, `sessione_${sessionCode}_${session.type}.xlsx`);
}

/**
 * Ricostruisce la nuvola di parole come SVG leggendo le posizioni già
 * calcolate nel DOM, così l'immagine esportata corrisponde a ciò che si vede.
 */
export function exportWordcloudSVG(sessionCode) {
  const container = document.querySelector('.min-h-\\[80vh\\]');
  if (!container) return alert('Nessuna nuvola di parole visibile.');

  const rect = container.getBoundingClientRect();
  const width = rect.width || 800;
  const height = rect.height || 600;

  let svg =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n` +
    `<rect width="100%" height="100%" fill="#FFFEF5" rx="12"/>\n`;

  container.querySelectorAll("[style*='translate']").forEach((el) => {
    const { left, top, fontSize, color } = el.style;
    const text = (el.textContent || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const sizePx = parseFloat(fontSize || '1rem') * 16;
    svg +=
      `<text x="${parseFloat(left) || 0}" y="${parseFloat(top) || 0}" font-size="${sizePx}" ` +
      `fill="${color || '#333'}" font-weight="900" font-family="system-ui,sans-serif" ` +
      `text-anchor="middle" dominant-baseline="central">${text}</text>\n`;
  });
  svg += '</svg>';

  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `wordcloud_${sessionCode}.svg`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
