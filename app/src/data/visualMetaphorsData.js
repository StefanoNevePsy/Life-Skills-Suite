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
    alt: `Fotolinguaggio ETP #${num}`
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
 * Assicura che lo stato contenga sempre una struttura valida con almeno una sessione.
 */
export const ensureVisualMetaphorsState = (state) => {
  if (!state || typeof state !== 'object') {
    return DEFAULT_VISUAL_METAPHORS_STATE;
  }

  const sets = Array.isArray(state.sets) && state.sets.length > 0 ? state.sets : DEFAULT_IMAGE_SETS;
  const activeSetId = state.activeSetId || 'etp';
  
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

  // Garantisce che ogni sessione abbia assignments valido
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
