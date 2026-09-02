// Sistema dei set di scenari/stimoli per Life Skills Suite.
//
// Ogni categoria (emotions, decisions_cold, decisions_hot, emotion_narratives, affectivity_sexuality)
// possiede una collezione di Set separati e indipendenti, memorizzati in fullData.scenario_sets[categoria].
// È sempre presente un set speciale permanente "all" ("Tutti gli stimoli") che aggrega l'unione
// di tutti gli stimoli presenti in tutti i set di quella modalità.

export const LS_SETS_KEY = 'lss_scenario_sets';

export const CATEGORIES = [
  'emotions',
  'decisions_cold',
  'decisions_hot',
  'emotion_narratives',
  'affectivity_sexuality',
  'effective_communication',
];

export const CATEGORY_LABELS = {
  emotions: 'Gestione Emozioni',
  decisions_cold: 'Decisioni a Freddo',
  decisions_hot: 'Decisioni a Caldo',
  emotion_narratives: 'Narrazione Emotiva',
  affectivity_sexuality: 'Affettività e Sessualità',
  effective_communication: 'Comunicazione Efficace',
};

/**
 * Assicura che fullData.scenario_sets[category] sia inizializzato e valido.
 * Se mancano i set, migra automaticamente dai dati esistenti fullData[category]
 * o dai vecchi set salvati in localStorage.
 */
export function ensureCategorySets(category, fullData) {
  if (!fullData) return { activeSetId: 'default', sets: [] };

  if (!fullData.scenario_sets) {
    fullData.scenario_sets = {};
  }
  let catData = fullData.scenario_sets[category];

  if (!catData || !Array.isArray(catData.sets) || catData.sets.length === 0) {
    // Migrazione/Inizializzazione
    const initialItems = Array.isArray(fullData[category]) && fullData[category].length > 0
      ? JSON.parse(JSON.stringify(fullData[category]))
      : [];

    const defaultSet = {
      id: 'default',
      name: 'Set Predefinito',
      items: initialItems,
      createdAt: new Date().toISOString(),
    };

    // Verifica se ci sono vecchi set in localStorage per questa categoria da migrare
    const oldSavedSets = getSavedSets().filter((s) => s.type === category && s.items && Array.isArray(s.items));
    const migratedSets = [defaultSet];

    for (const oldSet of oldSavedSets) {
      if (!migratedSets.some((s) => s.name === oldSet.name)) {
        migratedSets.push({
          id: 'set_' + oldSet.id,
          name: oldSet.name,
          items: JSON.parse(JSON.stringify(oldSet.items)),
          createdAt: oldSet.timestamp || new Date().toISOString(),
        });
      }
    }

    catData = {
      activeSetId: 'default',
      sets: migratedSets,
    };
  }

  // Verifica che activeSetId esista, altrimenti ripiega su 'all' o sul primo set
  if (catData.activeSetId !== 'all' && !catData.sets.some((s) => s.id === catData.activeSetId)) {
    catData.activeSetId = catData.sets.length > 0 ? catData.sets[0].id : 'all';
  }

  fullData.scenario_sets[category] = catData;
  return catData;
}

/**
 * Calcola l'unione di tutti gli stimoli di tutti i set di una categoria,
 * deduplicando per ID e per testo.
 */
export function getAllItemsForCategory(sets) {
  const seenIds = new Set();
  const seenTexts = new Set();
  const allItems = [];

  for (const s of (sets || [])) {
    for (const item of (s.items || [])) {
      const normalizedText = item.text ? item.text.trim().toLowerCase() : '';
      if (item.id && seenIds.has(item.id)) continue;
      if (normalizedText && seenTexts.has(normalizedText)) continue;

      if (item.id) seenIds.add(item.id);
      if (normalizedText) seenTexts.add(normalizedText);
      allItems.push({ ...item });
    }
  }

  return allItems;
}

/**
 * Restituisce la lista degli elementi del set attivo per una categoria.
 * Se activeSetId è 'all', restituisce l'unione di tutti gli elementi.
 */
export function getActiveItemsForCategory(category, fullData) {
  const catData = ensureCategorySets(category, fullData);
  if (catData.activeSetId === 'all') {
    return getAllItemsForCategory(catData.sets);
  }
  const currentSet = catData.sets.find((s) => s.id === catData.activeSetId);
  return currentSet ? currentSet.items : (catData.sets[0]?.items || []);
}

/**
 * Crea un nuovo set per una categoria:
 * - Se sourceMode === 'empty', parte da 0 stimoli.
 * - Se sourceMode === 'duplicate', clona gli elementi del set sorgente (o di 'all').
 */
export function createCategorySet(category, fullData, { name, sourceMode = 'empty', sourceSetId = null }) {
  const nextFullData = JSON.parse(JSON.stringify(fullData || {}));
  const catData = ensureCategorySets(category, nextFullData);

  let newItems = [];
  if (sourceMode === 'duplicate') {
    if (sourceSetId === 'all') {
      newItems = JSON.parse(JSON.stringify(getAllItemsForCategory(catData.sets)));
    } else {
      const src = catData.sets.find((s) => s.id === sourceSetId);
      if (src && Array.isArray(src.items)) {
        newItems = JSON.parse(JSON.stringify(src.items));
      }
    }
  }

  const newSetId = 'set_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
  const newSet = {
    id: newSetId,
    name: name.trim() || `Nuovo Set (${catData.sets.length + 1})`,
    items: newItems,
    createdAt: new Date().toISOString(),
  };

  const nextSets = [...catData.sets, newSet];
  const nextCatData = {
    activeSetId: newSetId,
    sets: nextSets,
  };

  if (!nextFullData.scenario_sets) nextFullData.scenario_sets = {};
  nextFullData.scenario_sets[category] = nextCatData;
  nextFullData[category] = newItems;

  return nextFullData;
}

/**
 * Duplica rapidamente un set esistente.
 */
export function duplicateCategorySet(category, fullData, setId) {
  const catData = ensureCategorySets(category, fullData);
  const sourceSet = catData.sets.find((s) => s.id === setId);
  if (!sourceSet) return fullData;

  return createCategorySet(category, fullData, {
    name: `${sourceSet.name} (copia)`,
    sourceMode: 'duplicate',
    sourceSetId: setId,
  });
}

/**
 * Rinomina un set esistente.
 */
export function renameCategorySet(category, fullData, setId, newName) {
  if (setId === 'all' || !newName.trim()) return fullData;
  const nextFullData = JSON.parse(JSON.stringify(fullData || {}));
  if (!nextFullData.scenario_sets) nextFullData.scenario_sets = {};
  const catData = ensureCategorySets(category, nextFullData);

  const nextSets = catData.sets.map((s) => (s.id === setId ? { ...s, name: newName.trim() } : s));
  nextFullData.scenario_sets[category] = {
    ...catData,
    sets: nextSets,
  };

  return nextFullData;
}

/**
 * Elimina un set esistente (impossibile eliminare 'all' o l'ultimo set rimanente).
 */
export function deleteCategorySet(category, fullData, setId) {
  if (setId === 'all') return fullData;
  const nextFullData = JSON.parse(JSON.stringify(fullData || {}));
  if (!nextFullData.scenario_sets) nextFullData.scenario_sets = {};
  const catData = ensureCategorySets(category, nextFullData);

  if (catData.sets.length <= 1) {
    alert('Impossibile eliminare l\'unico set presente. Puoi svuotarlo o crearne un altro.');
    return fullData;
  }

  const nextSets = catData.sets.filter((s) => s.id !== setId);
  let nextActiveId = catData.activeSetId;
  if (nextActiveId === setId) {
    nextActiveId = nextSets[0]?.id || 'all';
  }

  const nextCatData = {
    activeSetId: nextActiveId,
    sets: nextSets,
  };

  nextFullData.scenario_sets[category] = nextCatData;
  nextFullData[category] = getActiveItemsForCategory(category, nextFullData);

  return nextFullData;
}

/**
 * Imposta il set attivo per una categoria e sincronizza fullData[category].
 */
export function setActiveCategorySet(category, fullData, setId) {
  const nextFullData = JSON.parse(JSON.stringify(fullData || {}));
  if (!nextFullData.scenario_sets) nextFullData.scenario_sets = {};
  const catData = ensureCategorySets(category, nextFullData);

  nextFullData.scenario_sets[category] = {
    ...catData,
    activeSetId: setId,
  };
  nextFullData[category] = getActiveItemsForCategory(category, nextFullData);

  return nextFullData;
}

/**
 * Aggiorna gli elementi del set specificato (o del set attivo) per una categoria.
 */
export function updateCategorySetItems(category, fullData, setId, newItems) {
  const nextFullData = JSON.parse(JSON.stringify(fullData || {}));
  if (!nextFullData.scenario_sets) nextFullData.scenario_sets = {};
  const catData = ensureCategorySets(category, nextFullData);

  if (setId === 'all') {
    // Se eravamo in visualizzazione 'all', aggiorniamo fullData[category]
    // e per ogni set esistente aggiorniamo gli stati degli stimoli corrispondenti
    const itemMap = new Map();
    for (const item of newItems) {
      itemMap.set(item.id, item);
    }

    const nextSets = catData.sets.map((s) => ({
      ...s,
      items: s.items
        .map((it) => (itemMap.has(it.id) ? { ...itemMap.get(it.id) } : it))
        .filter((it) => itemMap.has(it.id)),
    }));

    nextFullData.scenario_sets[category] = {
      ...catData,
      sets: nextSets,
    };
    nextFullData[category] = newItems;
    return nextFullData;
  }

  const nextSets = catData.sets.map((s) => (s.id === setId ? { ...s, items: newItems } : s));

  nextFullData.scenario_sets[category] = {
    ...catData,
    sets: nextSets,
  };

  if (catData.activeSetId === setId || catData.activeSetId === 'all') {
    nextFullData[category] = getActiveItemsForCategory(category, nextFullData);
  }

  return nextFullData;
}

// ---------------------------------------------------------------------------
// FUNZIONI DI SUPPORTO LEGACY (per retrocompatibilità con vecchie chiamate)
// ---------------------------------------------------------------------------

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
