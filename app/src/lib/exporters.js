import { clusterMarkers, photoReport, placeBadges } from './reportData';
// Esportazione dei risultati di una sessione.
// Supporta esportazione XLSX, SVG vettoriale e immagini per tutte le modalità.

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

function escapeXML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapText(text, maxChars = 38) {
  if (!text) return [];
  const words = String(text).split(/\s+/);
  const lines = [];
  let current = '';

  for (const w of words) {
    if ((current + ' ' + w).trim().length <= maxChars) {
      current = (current + ' ' + w).trim();
    } else {
      if (current) lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/**
 * Esporta i dati della sessione in formato Excel XLSX.
 */
export function exportSessionXLSX(session, sessionCode) {
  if (typeof XLSX === 'undefined') return alert('Libreria XLSX non caricata.');

  const wb = XLSX.utils.book_new();
  const visible = (session.responses || []).filter(isVisibleResponse);

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
 * Esporta la sessione Q&A (Domande & Risposte) come immagine vettoriale SVG di tutti i post-it.
 * I post-it sono organizzati in una griglia ordinata a 3 colonne, infinitamente zoomabile e pulita.
 */
export function exportQASVG(session, sessionCode, showNames = true) {
  const visible = (session.responses || []).filter(isVisibleResponse);
  if (visible.length === 0) {
    alert('Nessuna risposta visibile da esportare.');
    return;
  }

  const boardWidth = 1240;
  const margin = 32;
  const gap = 20;
  const cols = 3;
  const cardWidth = Math.floor((boardWidth - margin * 2 - gap * (cols - 1)) / cols); // ~378px

  const headerHeight = 90;
  const startY = margin + headerHeight + 24;
  const colY = [startY, startY, startY];

  let cardsSvg = '';

  // Ordine cronologico o inverso come a schermo
  visible.slice().reverse().forEach((res, idx) => {
    // Scegli la colonna più corta (layout masonry ordinato)
    let minCol = 0;
    for (let c = 1; c < cols; c++) {
      if (colY[c] < colY[minCol]) minCol = c;
    }

    const cardX = margin + minCol * (cardWidth + gap);
    const cardY = colY[minCol];

    const authorName = showNames && res.studentName && res.studentName.trim()
      ? res.studentName.trim()
      : (showNames ? 'Anonimo' : `Risposta #${visible.length - idx}`);

    let innerContentY = 44;
    let innerSvg = '';

    // Intestazione con icona e nome
    innerSvg += `
      <g transform="translate(18, 28)">
        <text font-size="12" font-weight="900" fill="#6b7280" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" letter-spacing="0.06em">👤 ${escapeXML(authorName.toUpperCase())}</text>
      </g>
      <line x1="18" y1="36" x2="${cardWidth - 18}" y2="36" stroke="#f3f4f6" stroke-width="1.5" />
    `;

    const items = Array.isArray(res.text) ? res.text : [res.text];
    items.forEach((qaItem, itemIdx) => {
      const nlPos = qaItem.indexOf('\n');
      const questionPart = nlPos >= 0 ? qaItem.substring(0, nlPos).replace(/:$/, '') : '';
      const answerPart = nlPos >= 0 ? qaItem.substring(nlPos + 1) : qaItem;

      if (itemIdx > 0) {
        innerSvg += `<line x1="18" y1="${innerContentY}" x2="${cardWidth - 18}" y2="${innerContentY}" stroke="#e5e7eb" stroke-width="1" stroke-dasharray="4,4" />`;
        innerContentY += 16;
      }

      // Testo risposta con a capo automatico
      const lines = wrapText(answerPart, 36);
      lines.forEach((line) => {
        innerContentY += 22;
        innerSvg += `<text x="18" y="${innerContentY}" font-size="16" font-weight="bold" fill="#1f2937" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${escapeXML(line)}</text>`;
      });

      // Domanda se presente
      if (questionPart) {
        innerContentY += 16;
        const qLines = wrapText('Domanda: ' + questionPart, 42);
        qLines.forEach((qLine) => {
          innerSvg += `<text x="18" y="${innerContentY}" font-size="12" font-style="italic" fill="#9ca3af" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">• ${escapeXML(qLine)}</text>`;
          innerContentY += 15;
        });
      }

      innerContentY += 10;
    });

    const cardHeight = Math.max(innerContentY + 14, 96);

    cardsSvg += `
      <g transform="translate(${cardX}, ${cardY})">
        <rect x="0" y="4" width="${cardWidth}" height="${cardHeight}" rx="16" fill="#000000" opacity="0.05" />
        <rect x="0" y="0" width="${cardWidth}" height="${cardHeight}" rx="16" fill="#ffffff" stroke="#e5e7eb" stroke-width="2" />
        ${innerSvg}
      </g>
    `;

    colY[minCol] += cardHeight + gap;
  });

  const boardHeight = Math.max(...colY) + margin;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${boardWidth}" height="${boardHeight}" viewBox="0 0 ${boardWidth} ${boardHeight}">
  <defs>
    <linearGradient id="qaHeaderGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#FEF08A"/>
      <stop offset="100%" stop-color="#FDE047"/>
    </linearGradient>
  </defs>

  <rect width="100%" height="100%" fill="#FEFCE8" rx="24"/>
  <rect width="100%" height="100%" fill="none" stroke="#FEF08A" stroke-width="8" rx="24"/>

  <g transform="translate(${margin}, ${margin})">
    <rect width="${boardWidth - margin * 2}" height="${headerHeight}" rx="16" fill="url(#qaHeaderGrad)" stroke="#EAB308" stroke-width="2"/>
    <text x="24" y="38" font-size="22" font-weight="900" fill="#713F12" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" letter-spacing="-0.02em">LIFE SKILLS SUITE • DOMANDE &amp; RISPOSTE</text>
    <text x="24" y="66" font-size="14" font-weight="bold" fill="#854D0E" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">Sessione: ${escapeXML(sessionCode)} • ${visible.length} risposte totali • ${escapeXML(new Date().toLocaleString('it-IT'))}</text>
  </g>

  ${cardsSvg}
</svg>`;

  downloadBlob(svg, `feedback_${sessionCode}_qa.svg`, 'image/svg+xml');
}

/**
 * Esporta il grafico del Sondaggio come immagine vettoriale SVG con barre proporzionali e percentuali.
 */
export function exportPollSVG(session, sessionCode) {
  const visible = (session.responses || []).filter(isVisibleResponse);
  const options = Array.isArray(session.options) ? session.options : [];
  const counts = {};
  options.forEach((op) => (counts[op] = 0));
  let totalVotes = 0;

  visible.forEach((r) => {
    (Array.isArray(r.text) ? r.text : [r.text]).forEach((t) => {
      if (counts[t] !== undefined) {
        counts[t]++;
        totalVotes++;
      }
    });
  });

  const width = 1040;
  const margin = 36;
  const itemHeight = 72;
  const startY = 160;
  const height = startY + options.length * itemHeight + margin + 30;

  let barsSvg = '';
  options.forEach((op, idx) => {
    const y = startY + idx * itemHeight;
    const voteCount = counts[op] || 0;
    const pct = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
    const trackWidth = width - margin * 2;
    const maxBarWidth = trackWidth;
    const barWidth = Math.max((pct / 100) * maxBarWidth, voteCount > 0 ? 12 : 0);

    barsSvg += `
      <g transform="translate(${margin}, ${y})">
        <text x="0" y="18" font-size="16" font-weight="bold" fill="#1f2937" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${escapeXML(op)}</text>
        <text x="${trackWidth}" y="18" text-anchor="end" font-size="15" font-weight="900" fill="#15803d" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${pct}% (${voteCount} ${voteCount === 1 ? 'voto' : 'voti'})</text>

        <!-- Track -->
        <rect x="0" y="28" width="${trackWidth}" height="22" rx="11" fill="#e5e7eb" />
        <!-- Progress Bar -->
        ${barWidth > 0 ? `<rect x="0" y="28" width="${barWidth}" height="22" rx="11" fill="#22c55e" />` : ''}
      </g>
    `;
  });

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#F0FDF4" rx="24"/>
  <rect width="100%" height="100%" fill="none" stroke="#86EFAC" stroke-width="6" rx="24"/>

  <g transform="translate(${margin}, 36)">
    <rect width="${width - margin * 2}" height="92" rx="16" fill="#DCFCE7" stroke="#4ADE80" stroke-width="2"/>
    <text x="24" y="38" font-size="20" font-weight="900" fill="#14532D" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">SONDAGGIO: ${escapeXML(session.question || 'Risultati')}</text>
    <text x="24" y="66" font-size="14" font-weight="bold" fill="#166534" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">Codice: ${escapeXML(sessionCode)} • Totale votanti: ${visible.length} • Totale voti espressi: ${totalVotes} • ${escapeXML(new Date().toLocaleString('it-IT'))}</text>
  </g>

  ${barsSvg}
</svg>`;

  downloadBlob(svg, `sondaggio_${sessionCode}.svg`, 'image/svg+xml');
}

/**
 * Ricostruisce la nuvola di parole come SVG leggendo le posizioni già
 * calcolate nel DOM, con banner della sessione.
 */
export function exportWordcloudSVG(sessionCode) {
  const container = document.querySelector('.min-h-\\[80vh\\]');
  if (!container) return alert('Nessuna nuvola di parole visibile.');

  const rect = container.getBoundingClientRect();
  const width = Math.max(Math.round(rect.width) || 900, 800);
  const height = Math.max(Math.round(rect.height) || 650, 600);

  let svg =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n` +
    `<rect width="100%" height="100%" fill="#EFF6FF" rx="24"/>\n` +
    `<rect width="100%" height="100%" fill="none" stroke="#BFDBFE" stroke-width="6" rx="24"/>\n` +
    `<text x="32" y="44" font-size="18" font-weight="900" fill="#1E40AF" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">BRAINSTORMING • NUVOLA DI PAROLE (Sessione: ${escapeXML(sessionCode)})</text>\n`;

  container.querySelectorAll("[style*='translate']").forEach((el) => {
    const { left, top, fontSize, color } = el.style;
    const text = escapeXML(el.textContent || '');
    const sizePx = parseFloat(fontSize || '1rem') * 16;
    svg +=
      `<text x="${parseFloat(left) || 0}" y="${parseFloat(top) || 0}" font-size="${sizePx}" ` +
      `fill="${color || '#1e3a8a'}" font-weight="900" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" ` +
      `text-anchor="middle" dominant-baseline="central">${text}</text>\n`;
  });
  svg += '</svg>';

  downloadBlob(svg, `wordcloud_${sessionCode}.svg`, 'image/svg+xml');
}

/**
 * Esportazione unificata come immagine SVG in base al tipo di sessione.
 */
export function exportSessionImage(session, sessionCode, showNames = true) {
  if (!session) return;
  if (session.type === 'qa') {
    exportQASVG(session, sessionCode, showNames);
  } else if (session.type === 'poll') {
    exportPollSVG(session, sessionCode);
  } else if (session.type === 'wordcloud') {
    exportWordcloudSVG(sessionCode);
  }
}

/**
 * Esporta le scelte del Fotolinguaggio (Metafore Visive) in formato Excel XLSX.
 */
export function exportMetaphorImagesXLSX(sessionData, sessionCode, showNames = true) {
  if (typeof XLSX === 'undefined') return alert('Libreria XLSX non disponibile.');
  const report = photoReport(sessionData, showNames);
  const wb = XLSX.utils.book_new();
  for (const [name, rows] of [['Scelte studenti', report.rows], ['Immagini e nomi', report.byImage]]) {
    const sheet = XLSX.utils.json_to_sheet(rows.length ? rows : [{ Note: 'Nessuna scelta registrata' }]);
    sheet['!cols'] = Object.keys(rows[0] || {}).map(key => ({ wch: key === 'Studenti' ? 80 : 28 }));
    if (sheet['!ref']) sheet['!autofilter'] = { ref: sheet['!ref'] };
    XLSX.utils.book_append_sheet(wb, sheet, name);
  }
  XLSX.writeFile(wb, `fotolinguaggio_${sessionCode}.xlsx`);
}

/**
 * Esporta le posizioni del Blob Tree in formato Excel XLSX.
 */
export function exportBlobTreeXLSX(sessionData, sessionCode, showNames = true) {
  if (typeof XLSX === 'undefined') {
    alert('Libreria XLSX non disponibile.');
    return;
  }

  const wb = XLSX.utils.book_new();
  const participants = Object.values(sessionData.participants || {});

  // Estrai tutti i segnaposti
  const allMarkers = [];
  participants.forEach((p, pIdx) => {
    const studentLabel = showNames && p.studentName && p.studentName.trim()
      ? p.studentName.trim()
      : (showNames ? 'Anonimo' : `Studente ${pIdx + 1}`);

    const markers = Array.isArray(p.markers) ? p.markers : [];
    markers.forEach((m) => {
      allMarkers.push({
        ...m,
        studentName: studentLabel,
        participantTimestamp: p.timestamp,
      });
    });
  });

  const rows = allMarkers.map((m, idx) => ({
    '#': idx + 1,
    'Studente': m.studentName || 'Anonimo',
    'Posizione X (%)': typeof m.x === 'number' ? m.x.toFixed(1) + '%' : m.x,
    'Posizione Y (%)': typeof m.y === 'number' ? m.y.toFixed(1) + '%' : m.y,
    'Colore': m.color || '#FACC15',
    'Nota / Commento': showNames ? m.note || '' : '',
    'Data e Ora': m.createdAt || m.participantTimestamp ? new Date(m.createdAt || m.participantTimestamp).toLocaleString('it-IT') : '',
  }));

  const ws = XLSX.utils.json_to_sheet(rows.length > 0 ? rows : [{ Note: 'Nessun segnaposto registrato.' }]);
  ws['!cols'] = [{ wch: 6 }, { wch: 28 }, { wch: 16 }, { wch: 16 }, { wch: 12 }, { wch: 35 }, { wch: 22 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Posizioni Blob Tree');

  // Info Sessione
  const infoRows = [
    { Voce: 'Tipo Attività', Valore: 'Blob Tree (Scenari Interattivi)' },
    { Voce: 'Codice Sessione', Valore: sessionCode },
    { Voce: 'Scenario Utilizzato', Valore: sessionData.setTitle || sessionData.setId || 'Classico' },
    { Voce: 'Posizioni Max per Studente', Valore: sessionData.maxSelections || 1 },
    { Voce: 'Totale Studenti', Valore: participants.length },
    { Voce: 'Totale Segnaposti Mappati', Valore: allMarkers.length },
    { Voce: 'Data Esportazione', Valore: new Date().toLocaleString('it-IT') },
  ];
  const wsInfo = XLSX.utils.json_to_sheet(infoRows);
  wsInfo['!cols'] = [{ wch: 30 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(wb, wsInfo, 'Info Sessione');

  XLSX.writeFile(wb, `blob_tree_${sessionCode}.xlsx`);
}

/**
 * Esporta il riepilogo in testo semplice (TXT) per Fotolinguaggio o Blob Tree.
 */
export function exportMetaphorSummaryTXT(text, filename = 'riepilogo.txt') {
  downloadBlob(text, filename, 'text/plain;charset=utf-8');
}

/**
 * Genera ed esporta un'immagine PNG ad alta risoluzione del Blob Tree
 * con tutti i segnaposti e i nomi dei ragazzi sovrimpressi tramite Canvas.
 */
export async function exportBlobTreeImageCanvas({ imageSrc, markers = [], sessionCode = 'BLOB', scenarioTitle = 'Blob Tree', showNames = true, clusterRadius = 38 }) {
  try {
    if (!imageSrc) throw new Error('Immagine di sfondo non disponibile.');
    const img = new Image(); img.crossOrigin = 'anonymous';
    await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = () => reject(new Error('Impossibile caricare lo sfondo.')); img.src = imageSrc; });
    const imageWidth = 1400;
    const imageHeight = Math.round(imageWidth * img.naturalHeight / img.naturalWidth);
    const groups = clusterMarkers(markers, imageWidth, imageHeight, clusterRadius);
    const margin = 48, header = 130, legendWidth = 620, gap = 48;
    const canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    ctx.font = '24px system-ui';
    const wrap = (value, maxWidth) => {
      const lines = []; let line = '';
      for (const char of String(value)) {
        if (char === '\n' || ctx.measureText(line + char).width > maxWidth) { lines.push(line); line = char === '\n' ? '' : char; }
        else line += char;
      }
      if (line) lines.push(line);
      return lines;
    };
    const entries = groups.map(g => ({ ...g, lines: g.members.flatMap(m => wrap(showNames ? (m.studentName || 'Senza nome') : `Partecipante ${m.participantNumber || m.sourceIndex+1}`, legendWidth - 90)) }));
    const legendHeight = entries.reduce((n,g) => n + Math.max(56, g.lines.length * 32 + 24), 60);
    canvas.width = margin * 2 + imageWidth + gap + legendWidth;
    canvas.height = header + Math.max(imageHeight, legendHeight) + margin;
    ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#111827'; ctx.font = 'bold 32px system-ui';
    ctx.fillText(`Blob Tree · ${scenarioTitle}`, margin, 48, canvas.width - margin*2);
    ctx.font = '22px system-ui';
    ctx.fillText(`Sessione ${sessionCode} · ${markers.length} posizioni · ${groups.length} gruppi · ${new Date().toLocaleDateString('it-IT')}`, margin, 88);
    ctx.drawImage(img, margin, header, imageWidth, imageHeight);
    for (const group of placeBadges(groups, imageWidth, imageHeight)) {
      const x = margin+group.x, y = header+group.y;
      // Small original dots remain as evidence of the grouping; numbered badges are clamped inside the image.
      ctx.fillStyle = '#111827';
      for (const member of group.members) { ctx.beginPath(); ctx.arc(margin+member.px,header+member.py,4,0,Math.PI*2); ctx.fill(); }
      const bx = Math.min(margin+imageWidth-24,Math.max(margin+24,x));
      const by = Math.min(header+imageHeight-24,Math.max(header+24,y));
      ctx.beginPath(); ctx.moveTo(margin+group.anchorX,header+group.anchorY);ctx.lineTo(bx,by);ctx.strokeStyle='#374151';ctx.lineWidth=2;ctx.stroke();
      ctx.beginPath(); ctx.arc(bx,by,23,0,Math.PI*2); ctx.fillStyle='#fde047';ctx.fill();ctx.strokeStyle='#111827';ctx.lineWidth=3;ctx.stroke();
      ctx.font='bold 23px system-ui';ctx.fillStyle='#111827';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(group.number),bx,by);
    }
    ctx.textAlign='left';ctx.textBaseline='alphabetic';
    const lx = margin+imageWidth+gap;
    ctx.font='bold 26px system-ui';ctx.fillStyle='#111827';ctx.fillText(showNames ? 'Gruppi e nomi' : 'Gruppi e partecipanti',lx,header+28);
    let y=header+68;
    for (const group of entries) {
      ctx.font='bold 25px system-ui';ctx.fillText(String(group.number)+'.',lx,y);
      ctx.font='24px system-ui';
      for (const line of group.lines) { ctx.fillText(line,lx+65,y); y+=32; }
      y+=24;
    }
    const blob = await new Promise(resolve => canvas.toBlob(resolve,'image/png'));
    if (!blob) throw new Error('Immagine troppo grande per questo dispositivo.');
    const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`blob_tree_${sessionCode}_gruppi.png`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  } catch (error) { alert('Esportazione non riuscita: '+error.message); }
}

/** Helper per disegnare rettangoli arrotondati su Canvas */
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
