// Sistema dei set.
//
// Un set è una collezione salvata di elementi. Memorizza sia gli elementi stessi
// (`items`) sia quali di essi sono nascosti (`data`), così attivare un set diverso
// non fa perdere gli elementi di quello precedente.
//
// I set salvati prima dell'introduzione di `items` contengono solo la mappa dei
// nascosti: continuano a funzionare, applicando i flag agli elementi correnti.

export const LS_SETS_KEY = 'lss_scenario_sets';

export const CATEGORIES = [
  'emotions',
  'decisions_cold',
  'decisions_hot',
  'emotion_narratives',
  'affectivity_sexuality',
];

export function getSavedSets() {
  try {
    const s = localStorage.getItem(LS_SETS_KEY);
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

export function saveScenarioSet(name, type, data, items) {
  const sets = getSavedSets();
  sets.push({
    id: Date.now().toString(),
    name,
    type,
    data,
    items: items || null,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem(LS_SETS_KEY, JSON.stringify(sets));
}

export function deleteScenarioSet(id) {
  const sets = getSavedSets().filter((s) => s.id !== id);
  localStorage.setItem(LS_SETS_KEY, JSON.stringify(sets));
}

/** Copia profonda degli elementi di una categoria (o di tutte, se type è "all"). */
export function captureScenarioItems(type, fullData) {
  if (type === 'all') {
    const out = {};
    for (const cat of CATEGORIES) {
      if (fullData[cat]) out[cat] = JSON.parse(JSON.stringify(fullData[cat]));
    }
    return out;
  }
  return fullData[type] ? JSON.parse(JSON.stringify(fullData[type])) : [];
}

/** Mappa { idElemento: true } dei soli elementi nascosti. */
export function captureScenarioSet(type, fullData) {
  if (type === 'all') {
    const data = {};
    for (const cat of CATEGORIES) {
      if (fullData[cat]) {
        data[cat] = {};
        fullData[cat].forEach((item) => {
          if (item.hidden) data[cat][item.id] = true;
        });
      }
    }
    return data;
  }
  const data = {};
  (fullData[type] || []).forEach((item) => {
    if (item.hidden) data[item.id] = true;
  });
  return data;
}

/**
 * Applica un set ai dati correnti.
 * Se il set porta con sé gli elementi, questi sostituiscono quelli attuali;
 * altrimenti (set in formato vecchio) si applicano solo i flag di visibilità.
 */
export function applyScenarioSet(setData, type, fullData, setItems) {
  if (setItems) {
    if (type === 'all') {
      const result = { ...fullData };
      for (const cat of CATEGORIES) {
        if (setItems[cat]) result[cat] = JSON.parse(JSON.stringify(setItems[cat]));
      }
      return result;
    }
    return { ...fullData, [type]: JSON.parse(JSON.stringify(setItems)) };
  }

  if (type === 'all') {
    const result = { ...fullData };
    for (const cat of CATEGORIES) {
      if (setData[cat] && result[cat]) {
        result[cat] = result[cat].map((item) => ({ ...item, hidden: setData[cat][item.id] === true }));
      }
    }
    return result;
  }

  const items = fullData[type];
  if (!items || !setData) return fullData;
  return { ...fullData, [type]: items.map((item) => ({ ...item, hidden: setData[item.id] === true })) };
}

// --- Set attivo ------------------------------------------------------------
// Il set attivo è la fonte da cui l'app estrae: le modifiche agli elementi
// vengono risincronizzate su di esso.

const LS_ACTIVE_SETS = 'lss_active_sets';

export function getActiveSetIds() {
  try {
    return JSON.parse(localStorage.getItem(LS_ACTIVE_SETS) || '{}');
  } catch {
    return {};
  }
}

export function saveActiveSetIds(ids) {
  localStorage.setItem(LS_ACTIVE_SETS, JSON.stringify(ids));
}
