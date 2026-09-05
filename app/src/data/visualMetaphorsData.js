// =================================================================================
// METAFORE VISIVE & FOTOLINGUAGGIO - DATA & HELPERS
// =================================================================================

/**
 * Genera l'elenco delle 60 immagini estratte dal set ETP.
 */
export const ETP_IMAGES = Array.from({ length: 60 }, (_, index) => {
  const num = index + 1;
  return {
    id: num,
    number: num,
    src: `./fotolinguaggio/etp/${num}.webp`,
    title: `Immagine #${num}`,
    alt: `Fotolinguaggio ETP #${num}`,
    hidden: false
  };
});

/**
 * Set predefiniti di immagini disponibili per le Metafore Visive.
 */
export const DEFAULT_IMAGE_SETS = [
  {
    id: 'etp',
    title: 'Fotolinguaggio ETP (Vie Sociale)',
    subtitle: 'Relazioni, vissuti e identità',
    description: 'Set di 60 immagini fotografiche d\'autore ad alto potere evocativo per stimolare l\'introspezione e la narrazione condivisa.',
    count: 60,
    images: ETP_IMAGES
  }
];

/**
 * Crea una nuova sessione con impostazioni iniziali.
 */
export const createNewSession = (name, existingSessions = []) => {
  const sessionNum = (existingSessions?.length || 0) + 1;
  const safeName = name && name.trim().length > 0 ? name.trim() : `Sessione ${sessionNum}`;
  const id = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  return {
    id,
    name: safeName,
    createdAt: new Date().toISOString(),
    setId: 'etp',
    assignments: {}, // { [imageId]: string[] (nomi studenti) }
    notes: ''
  };
};

/**
 * Stato iniziale di default per visual_metaphors nel database.
 */
export const DEFAULT_VISUAL_METAPHORS_STATE = {
  activeSetId: 'etp',
  sets: DEFAULT_IMAGE_SETS,
  activeSessionId: 'session_default',
  sessions: [
    {
      id: 'session_default',
      name: 'Sessione 1',
      createdAt: new Date().toISOString(),
      setId: 'etp',
      assignments: {},
      notes: ''
    }
  ]
};

/**
 * Assicura che lo stato contenga sempre una struttura valida con almeno una sessione e un set.
 */
export const ensureVisualMetaphorsState = (state) => {
  if (!state || typeof state !== 'object') {
    return DEFAULT_VISUAL_METAPHORS_STATE;
  }

  let sets = Array.isArray(state.sets) && state.sets.length > 0 ? [...state.sets] : DEFAULT_IMAGE_SETS;
  
  // Garantisce che ogni set abbia id, title, images e count validi
  sets = sets.map((s, sIdx) => {
    const images = Array.isArray(s.images) ? s.images.map((img, imgIdx) => ({
      id: img.id !== undefined ? img.id : (imgIdx + 1),
      number: img.number !== undefined ? img.number : (imgIdx + 1),
      src: img.src || '',
      title: img.title || `Immagine #${img.number || imgIdx + 1}`,
      alt: img.alt || `Immagine #${img.number || imgIdx + 1}`,
      hidden: Boolean(img.hidden)
    })) : [];
    return {
      id: s.id || `set_${sIdx}`,
      title: s.title || `Set ${sIdx + 1}`,
      subtitle: s.subtitle || '',
      description: s.description || '',
      count: images.length,
      images
    };
  });

  const activeSetId = sets.some(s => s.id === state.activeSetId) 
    ? state.activeSetId 
    : sets[0].id;
  
  let sessions = Array.isArray(state.sessions) ? [...state.sessions] : [];
  if (sessions.length === 0) {
    sessions = [
      {
        id: 'session_default',
        name: 'Sessione 1',
        createdAt: new Date().toISOString(),
        setId: activeSetId,
        assignments: {},
        notes: ''
      }
    ];
  }

  sessions = sessions.map(s => ({
    ...s,
    assignments: s.assignments && typeof s.assignments === 'object' ? s.assignments : {},
    setId: s.setId || activeSetId
  }));

  const activeSessionId = sessions.some(s => s.id === state.activeSessionId) 
    ? state.activeSessionId 
    : sessions[0].id;

  return {
    ...state,
    sets,
    activeSetId,
    sessions,
    activeSessionId
  };
};

/**
 * Operazioni di Gestione Set di Immagini
 */

export const createImageSet = (state, { title, description, sourceMode = 'empty', sourceSetId = 'etp' }) => {
  const safeTitle = title && title.trim().length > 0 ? title.trim() : 'Nuovo Set Fotografico';
  const newSetId = `set_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  
  let initialImages = [];
  if (sourceMode === 'duplicate') {
    const sourceSet = state.sets.find(s => s.id === sourceSetId);
    if (sourceSet && Array.isArray(sourceSet.images)) {
      initialImages = sourceSet.images.map(img => ({ ...img }));
    }
  }

  const newSet = {
    id: newSetId,
    title: safeTitle,
    subtitle: '',
    description: description || '',
    count: initialImages.length,
    images: initialImages
  };

  return {
    ...state,
    sets: [...state.sets, newSet],
    activeSetId: newSetId
  };
};

export const duplicateImageSet = (state, setId) => {
  const source = state.sets.find(s => s.id === setId);
  if (!source) return state;

  const newSetId = `set_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const cloned = {
    ...source,
    id: newSetId,
    title: `${source.title} (Copia)`,
    images: source.images.map(img => ({ ...img }))
  };

  return {
    ...state,
    sets: [...state.sets, cloned],
    activeSetId: newSetId
  };
};

export const renameImageSet = (state, setId, newTitle, newDescription) => {
  return {
    ...state,
    sets: state.sets.map(s => {
      if (s.id !== setId) return s;
      return {
        ...s,
        title: newTitle && newTitle.trim().length > 0 ? newTitle.trim() : s.title,
        description: newDescription !== undefined ? newDescription : s.description
      };
    })
  };
};

export const deleteImageSet = (state, setId) => {
  if (state.sets.length <= 1) {
    return state;
  }
  const remaining = state.sets.filter(s => s.id !== setId);
  const nextActiveId = state.activeSetId === setId ? remaining[0].id : state.activeSetId;
  return {
    ...state,
    sets: remaining,
    activeSetId: nextActiveId
  };
};

/**
 * Toggle visibilità singola immagine in un set
 */
export const toggleImageVisibility = (state, setId, imageId) => {
  return {
    ...state,
    sets: state.sets.map(s => {
      if (s.id !== setId) return s;
      const updatedImages = s.images.map(img => {
        if (img.id !== imageId) return img;
        return { ...img, hidden: !img.hidden };
      });
      return { ...s, images: updatedImages };
    })
  };
};

/**
 * Mostra o nasconde tutte le immagini di un set
 */
export const setAllImagesVisibility = (state, setId, hideAll = false) => {
  return {
    ...state,
    sets: state.sets.map(s => {
      if (s.id !== setId) return s;
      const updatedImages = s.images.map(img => ({ ...img, hidden: hideAll }));
      return { ...s, images: updatedImages };
    })
  };
};

/**
 * Aggiunge un'immagine a un set (es. caricata da file o URL)
 */
export const addImageToSet = (state, setId, newImage) => {
  return {
    ...state,
    sets: state.sets.map(s => {
      if (s.id !== setId) return s;
      const nextNum = s.images.reduce((max, img) => Math.max(max, img.number || 0), 0) + 1;
      const nextId = s.images.reduce((max, img) => Math.max(max, typeof img.id === 'number' ? img.id : 0), 0) + 1;
      const imageToAdd = {
        id: nextId,
        number: nextNum,
        src: newImage.src,
        title: newImage.title || `Immagine #${nextNum}`,
        alt: newImage.alt || `Immagine #${nextNum}`,
        hidden: false
      };
      const newImages = [...s.images, imageToAdd];
      return {
        ...s,
        count: newImages.length,
        images: newImages
      };
    })
  };
};

/**
 * Rimuove un'immagine da un set
 */
export const removeImageFromSet = (state, setId, imageId) => {
  return {
    ...state,
    sets: state.sets.map(s => {
      if (s.id !== setId) return s;
      const filtered = s.images.filter(img => img.id !== imageId);
      // Rinumera per mantenere consecutività
      const renumbered = filtered.map((img, idx) => ({ ...img, number: idx + 1 }));
      return {
        ...s,
        count: renumbered.length,
        images: renumbered
      };
    })
  };
};

/**
 * Restituisce l'insieme di tutti i nomi unici di studenti presenti in una sessione.
 */
export const getSessionStudentRoster = (session) => {
  if (!session || !session.assignments) return [];
  const students = new Set();
  Object.values(session.assignments).forEach(list => {
    if (Array.isArray(list)) {
      list.forEach(name => {
        if (name && typeof name === 'string' && name.trim().length > 0) {
          students.add(name.trim());
        }
      });
    }
  });
  return Array.from(students).sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' }));
};

/**
 * Formatta un testo di riepilogo da copiare negli appunti.
 */
export const formatSessionSummaryText = (session, imageSet) => {
  if (!session) return 'Nessuna sessione selezionata.';
  const setName = imageSet?.title || 'Fotolinguaggio';
  const dateStr = session.createdAt ? new Date(session.createdAt).toLocaleDateString('it-IT') : '';
  
  const assignments = session.assignments || {};
  const assignedImageIds = Object.keys(assignments)
    .filter(id => Array.isArray(assignments[id]) && assignments[id].length > 0)
    .map(Number)
    .sort((a, b) => a - b);

  let text = `📷 RIEPILOGO FOTOLINGUAGGIO\n`;
  text += `Sessione: ${session.name} ${dateStr ? `(${dateStr})` : ''}\n`;
  text += `Set Immagini: ${setName}\n`;
  text += `Immagini scelte: ${assignedImageIds.length}\n`;
  
  const allStudents = getSessionStudentRoster(session);
  text += `Alunni partecipanti: ${allStudents.length} (${allStudents.join(', ') || 'Nessuno'})\n`;
  text += `--------------------------------------------------\n\n`;

  if (assignedImageIds.length === 0) {
    text += `Nessuna immagine è stata ancora assegnata in questa sessione.\n`;
    return text;
  }

  text += `SCELTE PER IMMAGINE:\n`;
  assignedImageIds.forEach(id => {
    const students = assignments[id] || [];
    text += `• Immagine #${id}: ${students.join(', ')}\n`;
  });

  return text;
};
