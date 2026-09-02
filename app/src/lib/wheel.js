// Ruota delle emozioni: preferenze salvate e geometria degli spicchi.

import { WHEEL_DATA_DEFAULT } from '../data/wheelData';

const LS_WHEEL_MODE = 'lss_wheel_mode';
const LS_WHEEL_PAL = 'lss_wheel_palette';
const LS_WHEEL_DATA = 'lss_wheel_data';
export const LS_WHEEL_ACTIVE_SET = 'lss_wheel_active_set';

/** "image" mostra il PNG originale, "svg" la ruota generata e interattiva. */
export function getWheelMode() {
  return localStorage.getItem(LS_WHEEL_MODE) || 'image';
}

export function setWheelMode(m) {
  localStorage.setItem(LS_WHEEL_MODE, m);
}

export function getWheelPalette() {
  return localStorage.getItem(LS_WHEEL_PAL) || 'insideout';
}

export function setWheelPalette(p) {
  localStorage.setItem(LS_WHEEL_PAL, p);
}

/** Ruota personalizzata dall'utente, oppure null se non ne esiste una valida. */
export function getWheelData() {
  try {
    const d = localStorage.getItem(LS_WHEEL_DATA);
    if (d) {
      const parsed = JSON.parse(d);
      if (Array.isArray(parsed) && parsed.length === 6) return parsed;
    }
  } catch {
    /* dati corrotti: si torna alla ruota di default */
  }
  return null;
}

export function setWheelData(d) {
  localStorage.setItem(LS_WHEEL_DATA, JSON.stringify(d));
}

// --- Geometria -------------------------------------------------------------
// Gli angoli sono in gradi e partono da mezzogiorno (da cui il -90).

/** Path SVG di uno spicchio ad anello, fra i raggi r1 e r2 e gli angoli a1 e a2. */
export function wheelArc(cx, cy, r1, r2, a1, a2) {
  const RAD = Math.PI / 180;
  const c1 = Math.cos((a1 - 90) * RAD);
  const s1 = Math.sin((a1 - 90) * RAD);
  const c2 = Math.cos((a2 - 90) * RAD);
  const s2 = Math.sin((a2 - 90) * RAD);
  const largeArc = a2 - a1 > 180 ? 1 : 0;

  return (
    `M${cx + r1 * c1},${cy + r1 * s1}` +
    `L${cx + r2 * c1},${cy + r2 * s1}` +
    `A${r2},${r2},0,${largeArc},1,${cx + r2 * c2},${cy + r2 * s2}` +
    `L${cx + r1 * c2},${cy + r1 * s2}` +
    `A${r1},${r1},0,${largeArc},0,${cx + r1 * c1},${cy + r1 * s1}Z`
  );
}

/** Rotazione del testo, ribaltata nella metà inferiore per non leggerlo capovolto. */
export function wheelTextRotation(a) {
  const r = (((a - 90) % 360) + 360) % 360;
  return r > 90 && r < 270 ? a - 90 + 180 : a - 90;
}

/** Coordinate cartesiane di un punto a distanza r e angolo a dal centro. */
export function wheelPos(cx, cy, r, a) {
  const RAD = ((a - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(RAD), cy + r * Math.sin(RAD)];
}

/**
 * Appiattisce la ruota in una lista di elementi estraibili.
 * Serve a usare le emozioni della ruota come sorgente per le narrazioni.
 */
export function flattenWheel(wheelData) {
  const items = [];
  let id = 1;

  (wheelData || []).forEach((sector) => {
    if (!sector || !sector.core) return;
    items.push({ id: id++, text: sector.core, tags: ['core'] });

    (sector.secondary || []).forEach((secondary) => {
      if (!secondary || !secondary.name) return;
      items.push({ id: id++, text: secondary.name, tags: ['secondary', sector.core] });

      (secondary.tertiary || []).forEach((tertiary) => {
        if (tertiary) items.push({ id: id++, text: tertiary, tags: ['tertiary', sector.core] });
      });
    });
  });

  return items;
}

/** Emozione primaria a cui appartiene un'etichetta, a qualunque anello si trovi. */
export function findWheelSector(data, label) {
  if (!label) return null;
  const needle = label.toLowerCase();

  for (const sector of data) {
    if (sector.core.toLowerCase() === needle) return sector.core;
    for (const secondary of sector.secondary) {
      if (secondary.name.toLowerCase() === needle) return sector.core;
      for (const tertiary of secondary.tertiary) {
        if (tertiary.toLowerCase() === needle) return sector.core;
      }
    }
  }
  return null;
}

export { WHEEL_DATA_DEFAULT };
