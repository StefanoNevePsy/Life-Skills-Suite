// Complete-link clustering avoids merging a long chain of distant positions.
// Distance is measured in image pixels, preserving the original aspect ratio.
export function clusterMarkers(markers, width, height, radius = 38) {
  const points = markers.map((m, index) => ({ ...m, sourceIndex: index, px: Number(m.x) * width / 100, py: Number(m.y) * height / 100 }))
    .filter(m => Number.isFinite(m.px) && Number.isFinite(m.py) && m.px >= 0 && m.px <= width && m.py >= 0 && m.py <= height)
    .sort((a,b) => a.py - b.py || a.px - b.px || a.sourceIndex - b.sourceIndex);
  const groups = [];
  for (const point of points) {
    const group = groups.find(g => g.every(p => Math.hypot(p.px - point.px, p.py - point.py) <= radius));
    if (group) group.push(point); else groups.push([point]);
  }
  return groups.map((members, i) => ({ number: i + 1, members, x: members.reduce((n,m) => n+m.px, 0)/members.length, y: members.reduce((n,m) => n+m.py, 0)/members.length }));
}
export function photoReport(session, showNames = true) {
  const participants = Object.entries(session.participants || {}).sort(([a],[b]) => a.localeCompare(b));
  const images = new Map((session.images || []).map(img => [String(img.id), img]));
  const rows = [];
  participants.forEach(([id,p], i) => {
    for (const imageId of new Set(p.selectedImageIds || [])) {
      const image = images.get(String(imageId));
      rows.push({ Partecipante: i+1, Studente: showNames ? p.studentName || 'Senza nome' : `Studente ${i+1}`, 'Numero immagine': image?.number ?? imageId, 'Titolo immagine': image?.title || '', 'ID immagine': imageId, 'Data e ora': p.timestamp || '' });
    }
  });
  const byImage = [];
  for (const id of new Set(rows.map(row => String(row['ID immagine'])))) {
    const picks = rows.filter(row => String(row['ID immagine']) === id);
    byImage.push({ 'Numero immagine': picks[0]['Numero immagine'], 'Titolo immagine': picks[0]['Titolo immagine'], 'Numero scelte': picks.length, Studenti: picks.map(row => `${row.Studente} (#${row.Partecipante})`).join(', ') });
  }
  return { rows, byImage: byImage.sort((a,b) => b['Numero scelte'] - a['Numero scelte']) };
}

export function placeBadges(groups, width, height, radius = 23) {
  const placed = [];
  const clamp = (v, max) => Math.max(radius, Math.min(max-radius,v));
  for (const group of groups) {
    let best = { x: clamp(group.x,width), y: clamp(group.y,height) };
    search: for (let distance = 0; distance <= Math.max(width,height); distance += 12) {
      for (let angle = 0; angle < Math.PI*2; angle += Math.PI/12) {
        const point = { x:clamp(group.x+Math.cos(angle)*distance,width), y:clamp(group.y+Math.sin(angle)*distance,height) };
        if (placed.every(p=>Math.hypot(p.x-point.x,p.y-point.y)>=radius*2+5)) { best=point; break search; }
      }
    }
    placed.push({...group,...best,anchorX:group.x,anchorY:group.y});
  }
  return placed;
}
