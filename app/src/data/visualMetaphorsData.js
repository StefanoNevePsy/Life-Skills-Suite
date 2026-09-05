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
    description: 'Set di fotografie d\'autore ad alto potere evocativo per stimolare l\'introspezione e la narrazione condivisa.',
    count: 60,
    images: ETP_IMAGES
  }
];

/**
 * Set predefiniti per i Blob Trees (illustrazioni / scenari interattivi ad alta risoluzione).
 */
export const DEFAULT_BLOB_TREE_SETS = [
  {
    id: 'blob_tree_classic',
    title: 'Blob Tree Classico (Albero)',
    subtitle: 'Ruoli, emozioni e relazioni',
    description: 'La celebre metafora dell\'albero con omini in diverse posizioni emotive, sfide e dinamiche di gruppo.',
    imageSrc: './blobtrees/tree_classic.jpg',
    customImageId: null,
    thumbnailSrc: null
  },
  {
    id: 'blob_mountain_path',
    title: 'Blob Mountain (La Scalata)',
    subtitle: 'Obiettivi, cooperazione e ostacoli',
    description: 'La metafora della salita in montagna: chi guida, chi fatica, chi aiuta e chi ha raggiunto la vetta.',
    imageSrc: './blobtrees/mountain_path.jpg',
    customImageId: null,
    thumbnailSrc: null
  }
];

/**
 * Crea una nuova sessione per il Fotolinguaggio con impostazioni iniziali.
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
 * Crea una nuova sessione per i Blob Trees.
 */
export const createNewBlobSession = (name, existingSessions = []) => {
  const sessionNum = (existingSessions?.length || 0) + 1;
  const safeName = name && name.trim().length > 0 ? name.trim() : `Sessione ${sessionNum}`;
  const id = `blob_session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  return {
    id,
    name: safeName,
    createdAt: new Date().toISOString(),
    setId: 'blob_tree_classic',
    markers: [], // Array di { id, x, y, studentName, note, color, createdAt }
    notes: ''
  };
};

/**
 * Stato iniziale di default per visual_metaphors nel database.
 */
export const DEFAULT_VISUAL_METAPHORS_STATE = {
  activeTab: 'photolanguage', // 'photolanguage' | 'blob_tree'
  // Dati Fotolinguaggio:
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
  ],
  // Dati Blob Trees:
  blobTree: {
    activeSetId: 'blob_tree_classic',
    sets: DEFAULT_BLOB_TREE_SETS,
    activeSessionId: 'blob_session_default',
    sessions: [
      {
        id: 'blob_session_default',
        name: 'Sessione 1',
        createdAt: new Date().toISOString(),
        setId: 'blob_tree_classic',
        markers: [],
        notes: ''
      }
    ]
  }
};

/**
 * Assicura che lo stato contenga sempre una struttura valida con almeno una sessione e un set
 * sia per il Fotolinguaggio sia per i Blob Trees.
 */
export const ensureVisualMetaphorsState = (state) => {
  if (!state || typeof state !== 'object') {
    return DEFAULT_VISUAL_METAPHORS_STATE;
  }

  const activeTab = state.activeTab === 'blob_tree' ? 'blob_tree' : 'photolanguage';

  // --- 1. NORMALIZZAZIONE FOTOLINGUAGGIO ---
  let sets = Array.isArray(state.sets) && state.sets.length > 0 ? [...state.sets] : DEFAULT_IMAGE_SETS;
  
  sets = sets.map((s, sIdx) => {
    const images = Array.isArray(s.images) ? s.images.map((img, imgIdx) => ({
      id: img.id !== undefined ? img.id : (imgIdx + 1),
      number: img.number !== undefined ? img.number : (imgIdx + 1),
      src: img.src || '',
      title: img.title || `Immagine #${img.number || imgIdx + 1}`,
      alt: img.alt || `Immagine #${img.number || imgIdx + 1}`,
      hidden: Boolean(img.hidden),
      customImageId: img.customImageId || null,
      thumbnailSrc: img.thumbnailSrc || null
    })) : [];
    return {
      id: s.id || `set_${sIdx}`,
      title: s.title || `Set ${sIdx + 1}`,
      subtitle: s.subtitle || '',
      description: (s.description || '').replace(/Set di \d+ immagini fotografiche/gi, 'Set di fotografie').replace(/Set di \d+ immagini/gi, 'Set di immagini'),
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

  // --- 2. NORMALIZZAZIONE BLOB TREES ---
  const rawBlob = state.blobTree && typeof state.blobTree === 'object' ? state.blobTree : {};
  let blobSets = Array.isArray(rawBlob.sets) && rawBlob.sets.length > 0 ? [...rawBlob.sets] : DEFAULT_BLOB_TREE_SETS;

  blobSets = blobSets.map((bs, bIdx) => ({
    id: bs.id || `blob_set_${bIdx}`,
    title: bs.title || `Scenario ${bIdx + 1}`,
    subtitle: bs.subtitle || '',
    description: bs.description || '',
    imageSrc: bs.imageSrc || './blobtrees/tree_classic.jpg',
    customImageId: bs.customImageId || null,
    thumbnailSrc: bs.thumbnailSrc || null
  }));

  const activeBlobSetId = blobSets.some(s => s.id === rawBlob.activeSetId)
    ? rawBlob.activeSetId
    : blobSets[0].id;

  let blobSessions = Array.isArray(rawBlob.sessions) && rawBlob.sessions.length > 0 ? [...rawBlob.sessions] : [];
  if (blobSessions.length === 0) {
    blobSessions = [
      {
        id: 'blob_session_default',
        name: 'Sessione 1',
        createdAt: new Date().toISOString(),
        setId: activeBlobSetId,
        markers: [],
        notes: ''
      }
    ];
  }

  blobSessions = blobSessions.map(bs => ({
    ...bs,
    setId: bs.setId || activeBlobSetId,
    markers: Array.isArray(bs.markers) ? bs.markers.map(m => ({
      id: m.id || `m_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      x: typeof m.x === 'number' ? m.x : 50,
      y: typeof m.y === 'number' ? m.y : 50,
      studentName: m.studentName || 'Anonimo',
      note: m.note || '',
      color: m.color || '#FACC15',
      createdAt: m.createdAt || new Date().toISOString()
    })) : [],
    notes: bs.notes || ''
  }));

  const activeBlobSessionId = blobSessions.some(s => s.id === rawBlob.activeSessionId)
    ? rawBlob.activeSessionId
    : blobSessions[0].id;

  return {
    ...state,
    activeTab,
    sets,
    activeSetId,
    sessions,
    activeSessionId,
    blobTree: {
      activeSetId: activeBlobSetId,
      sets: blobSets,
      activeSessionId: activeBlobSessionId,
      sessions: blobSessions
    }
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
      const nextNum = (s.images || []).reduce((max, img) => Math.max(max, img.number || 0), 0) + 1;
      const nextId = (s.images || []).reduce((max, img) => Math.max(max, typeof img.id === 'number' ? img.id : 0), 0) + 1;
      const imageToAdd = {
        id: nextId,
        number: nextNum,
        src: newImage.src || '',
        title: newImage.title || `Immagine #${nextNum}`,
        alt: newImage.alt || `Immagine #${nextNum}`,
        hidden: Boolean(newImage.hidden),
        customImageId: newImage.customImageId || null,
        thumbnailSrc: null
      };
      const newImages = [...(s.images || []), imageToAdd];
      return {
        ...s,
        count: newImages.length,
        images: newImages
      };
    })
  };
};

/**
 * Aggiunge un elenco di più immagini a un set in un'unica operazione atomica
 * preservando indici progressivi e id univoci senza race condition.
 */
export const addMultipleImagesToSet = (state, setId, newImagesList) => {
  if (!state || !Array.isArray(state.sets)) return state;
  if (!Array.isArray(newImagesList) || newImagesList.length === 0) return state;

  return {
    ...state,
    sets: state.sets.map(s => {
      if (s.id !== setId) return s;
      let curNum = (s.images || []).reduce((max, img) => Math.max(max, img.number || 0), 0);
      let curId = (s.images || []).reduce((max, img) => Math.max(max, typeof img.id === 'number' ? img.id : 0), 0);

      const itemsToAdd = newImagesList.map(item => {
        curNum += 1;
        curId += 1;
        return {
          id: curId,
          number: curNum,
          src: item.src || '',
          title: item.title || `Immagine #${curNum}`,
          alt: item.alt || `Immagine #${curNum}`,
          hidden: Boolean(item.hidden),
          customImageId: item.customImageId || null,
          thumbnailSrc: null
        };
      });

      const updatedImages = [...(s.images || []), ...itemsToAdd];
      return {
        ...s,
        count: updatedImages.length,
        images: updatedImages
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

// =================================================================================
// OPERAZIONI SPECIFICHE BLOB TREES
// =================================================================================

/**
 * Crea un nuovo set per i Blob Trees (con immagine personalizzata o default).
 */
export const createBlobTreeSet = (state, { title, subtitle, description, imageSrc, customImageId, thumbnailSrc }) => {
  const safeTitle = title && title.trim().length > 0 ? title.trim() : 'Nuovo Scenario Blob';
  const newSetId = `blob_set_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  
  const newSet = {
    id: newSetId,
    title: safeTitle,
    subtitle: subtitle || '',
    description: description || '',
    imageSrc: imageSrc || './blobtrees/tree_classic.jpg',
    customImageId: customImageId || null,
    thumbnailSrc: thumbnailSrc || null
  };

  const currentBlob = state.blobTree || {};
  const currentSets = Array.isArray(currentBlob.sets) ? currentBlob.sets : DEFAULT_BLOB_TREE_SETS;

  return {
    ...state,
    blobTree: {
      ...currentBlob,
      sets: [...currentSets, newSet],
      activeSetId: newSetId
    }
  };
};

/**
 * Duplica un set Blob Tree esistente.
 */
export const duplicateBlobTreeSet = (state, setId) => {
  const currentBlob = state.blobTree || {};
  const currentSets = Array.isArray(currentBlob.sets) ? currentBlob.sets : DEFAULT_BLOB_TREE_SETS;
  const source = currentSets.find(s => s.id === setId);
  if (!source) return state;

  const newSetId = `blob_set_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const cloned = {
    ...source,
    id: newSetId,
    title: `${source.title} (Copia)`
  };

  return {
    ...state,
    blobTree: {
      ...currentBlob,
      sets: [...currentSets, cloned],
      activeSetId: newSetId
    }
  };
};

/**
 * Rinomina un set Blob Tree.
 */
export const renameBlobTreeSet = (state, setId, newTitle, newDescription) => {
  const currentBlob = state.blobTree || {};
  const currentSets = Array.isArray(currentBlob.sets) ? currentBlob.sets : DEFAULT_BLOB_TREE_SETS;

  return {
    ...state,
    blobTree: {
      ...currentBlob,
      sets: currentSets.map(s => {
        if (s.id !== setId) return s;
        return {
          ...s,
          title: newTitle && newTitle.trim().length > 0 ? newTitle.trim() : s.title,
          description: newDescription !== undefined ? newDescription : s.description
        };
      })
    }
  };
};

/**
 * Elimina un set Blob Tree (se ce n'è più di uno).
 */
export const deleteBlobTreeSet = (state, setId) => {
  const currentBlob = state.blobTree || {};
  const currentSets = Array.isArray(currentBlob.sets) ? currentBlob.sets : DEFAULT_BLOB_TREE_SETS;
  if (currentSets.length <= 1) return state;

  const remaining = currentSets.filter(s => s.id !== setId);
  const nextActiveId = currentBlob.activeSetId === setId ? remaining[0].id : currentBlob.activeSetId;

  return {
    ...state,
    blobTree: {
      ...currentBlob,
      sets: remaining,
      activeSetId: nextActiveId
    }
  };
};

/**
 * Aggiunge un segnaposto a una sessione Blob Tree.
 */
export const addBlobMarker = (state, sessionId, { x, y, studentName, note, color }) => {
  const currentBlob = state.blobTree || {};
  const currentSessions = Array.isArray(currentBlob.sessions) ? currentBlob.sessions : [];

  const markerId = `m_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newMarker = {
    id: markerId,
    x: Math.max(0, Math.min(100, Number(x) || 0)),
    y: Math.max(0, Math.min(100, Number(y) || 0)),
    studentName: studentName && studentName.trim().length > 0 ? studentName.trim() : 'Anonimo',
    note: note ? note.trim() : '',
    color: color || '#FACC15',
    createdAt: new Date().toISOString()
  };

  return {
    ...state,
    blobTree: {
      ...currentBlob,
      sessions: currentSessions.map(s => {
        if (s.id !== sessionId) return s;
        return {
          ...s,
          markers: [...(s.markers || []), newMarker]
        };
      })
    }
  };
};

/**
 * Aggiorna un segnaposto esistente (es. coordinate dopo drag, o modifica nome/nota).
 */
export const updateBlobMarker = (state, sessionId, markerId, patch) => {
  const currentBlob = state.blobTree || {};
  const currentSessions = Array.isArray(currentBlob.sessions) ? currentBlob.sessions : [];

  return {
    ...state,
    blobTree: {
      ...currentBlob,
      sessions: currentSessions.map(s => {
        if (s.id !== sessionId) return s;
        return {
          ...s,
          markers: (s.markers || []).map(m => {
            if (m.id !== markerId) return m;
            return {
              ...m,
              ...patch,
              x: patch.x !== undefined ? Math.max(0, Math.min(100, Number(patch.x))) : m.x,
              y: patch.y !== undefined ? Math.max(0, Math.min(100, Number(patch.y))) : m.y,
              studentName: patch.studentName !== undefined ? patch.studentName.trim() : m.studentName,
              note: patch.note !== undefined ? patch.note.trim() : m.note
            };
          })
        };
      })
    }
  };
};

/**
 * Rimuove un segnaposto da una sessione Blob Tree.
 */
export const removeBlobMarker = (state, sessionId, markerId) => {
  const currentBlob = state.blobTree || {};
  const currentSessions = Array.isArray(currentBlob.sessions) ? currentBlob.sessions : [];

  return {
    ...state,
    blobTree: {
      ...currentBlob,
      sessions: currentSessions.map(s => {
        if (s.id !== sessionId) return s;
        return {
          ...s,
          markers: (s.markers || []).filter(m => m.id !== markerId)
        };
      })
    }
  };
};

/**
 * Azzera tutti i marker di una sessione Blob Tree.
 */
export const resetBlobSessionMarkers = (state, sessionId) => {
  const currentBlob = state.blobTree || {};
  const currentSessions = Array.isArray(currentBlob.sessions) ? currentBlob.sessions : [];

  return {
    ...state,
    blobTree: {
      ...currentBlob,
      sessions: currentSessions.map(s => {
        if (s.id !== sessionId) return s;
        return { ...s, markers: [] };
      })
    }
  };
};

/**
 * Restituisce tutti i nomi unici degli studenti presenti nei marker di una sessione Blob Tree.
 */
export const getBlobSessionStudentRoster = (session) => {
  if (!session || !Array.isArray(session.markers)) return [];
  const students = new Set();
  session.markers.forEach(m => {
    if (m.studentName && typeof m.studentName === 'string' && m.studentName.trim().length > 0) {
      students.add(m.studentName.trim());
    }
  });
  return Array.from(students).sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' }));
};

/**
 * Formatta il riepilogo testuale per una sessione di Blob Trees.
 */
export const formatBlobSessionSummaryText = (session, activeSet) => {
  if (!session) return 'Nessuna sessione selezionata.';
  const setName = activeSet?.title || 'Blob Tree';
  const dateStr = session.createdAt ? new Date(session.createdAt).toLocaleDateString('it-IT') : '';
  const markers = Array.isArray(session.markers) ? session.markers : [];

  let text = `🌳 RIEPILOGO BLOB TREE\n`;
  text += `Sessione: ${session.name} ${dateStr ? `(${dateStr})` : ''}\n`;
  text += `Scenario / Set: ${setName}\n`;
  text += `Personaggi identificati: ${markers.length}\n`;

  const roster = getBlobSessionStudentRoster(session);
  text += `Alunni partecipanti: ${roster.length} (${roster.join(', ') || 'Nessuno'})\n`;
  text += `--------------------------------------------------\n\n`;

  if (markers.length === 0) {
    text += `Nessun alunno ha ancora selezionato un personaggio in questa sessione.\n`;
    return text;
  }

  text += `SCELTE DEGLI ALUNNI:\n`;
  markers.forEach((m, idx) => {
    text += `${idx + 1}. ${m.studentName}`;
    if (m.note) {
      text += ` — "${m.note}"`;
    }
    text += ` [Posizione: X ${Math.round(m.x)}%, Y ${Math.round(m.y)}%]\n`;
  });

  return text;
};

