// Termometro delle emozioni: per ogni emozione, 5 livelli di intensità
// crescente. Il campo image può contenere un'immagine caricata dall'utente
// (salvata in IndexedDB, non in Firestore, perché troppo grande).

export const EMOTION_THERMOMETER_DEFAULT = [
  {
    id: 'rabbia',
    label: 'Rabbia',
    colorHex: '#FF9AA2',
    baseEmoji: '😠',
    levels: [
      {
        intensity: 1,
        label: 'Contrariato',
        emoji: '😒',
        image: null
      },
      {
        intensity: 2,
        label: 'Irritato',
        emoji: '😠',
        image: null
      },
      {
        intensity: 3,
        label: 'Frustrato',
        emoji: '😤',
        image: null
      },
      {
        intensity: 4,
        label: 'Arrabbiato',
        emoji: '😡',
        image: null
      },
      {
        intensity: 5,
        label: 'Furioso',
        emoji: '🤬',
        image: null
      }
    ]
  },
  {
    id: 'felicita',
    label: 'Felicità',
    colorHex: '#FFDAC1',
    baseEmoji: '🙂',
    levels: [
      {
        intensity: 1,
        label: 'Sereno',
        emoji: '😌',
        image: null
      },
      {
        intensity: 2,
        label: 'Contento',
        emoji: '🙂',
        image: null
      },
      {
        intensity: 3,
        label: 'Allegro',
        emoji: '😊',
        image: null
      },
      {
        intensity: 4,
        label: 'Felice',
        emoji: '😄',
        image: null
      },
      {
        intensity: 5,
        label: 'Euforico',
        emoji: '🤩',
        image: null
      }
    ]
  },
  {
    id: 'tristezza',
    label: 'Tristezza',
    colorHex: '#A2E1DB',
    baseEmoji: '😢',
    levels: [
      {
        intensity: 1,
        label: 'Dispiaciuto',
        emoji: '😟',
        image: null
      },
      {
        intensity: 2,
        label: 'Malinconico',
        emoji: '😔',
        image: null
      },
      {
        intensity: 3,
        label: 'Triste',
        emoji: '😢',
        image: null
      },
      {
        intensity: 4,
        label: 'Addolorato',
        emoji: '😭',
        image: null
      },
      {
        intensity: 5,
        label: 'Disperato',
        emoji: '😩',
        image: null
      }
    ]
  },
  {
    id: 'paura',
    label: 'Paura',
    colorHex: '#C7CEEA',
    baseEmoji: '😨',
    levels: [
      {
        intensity: 1,
        label: 'Preoccupato',
        emoji: '😟',
        image: null
      },
      {
        intensity: 2,
        label: 'Inquieto',
        emoji: '😬',
        image: null
      },
      {
        intensity: 3,
        label: 'Impaurito',
        emoji: '😨',
        image: null
      },
      {
        intensity: 4,
        label: 'Spaventato',
        emoji: '😱',
        image: null
      },
      {
        intensity: 5,
        label: 'Terrorizzato',
        emoji: '💀',
        image: null
      }
    ]
  },
  {
    id: 'disgusto',
    label: 'Disgusto',
    colorHex: '#B5EAD7',
    baseEmoji: '🤢',
    levels: [
      {
        intensity: 1,
        label: 'Riluttante',
        emoji: '😒',
        image: null
      },
      {
        intensity: 2,
        label: 'Infastidito',
        emoji: '😖',
        image: null
      },
      {
        intensity: 3,
        label: 'Disgustato',
        emoji: '🤢',
        image: null
      },
      {
        intensity: 4,
        label: 'Nauseato',
        emoji: '🤮',
        image: null
      },
      {
        intensity: 5,
        label: 'Ripugnato',
        emoji: '😵',
        image: null
      }
    ]
  },
  {
    id: 'sorpresa',
    label: 'Sorpresa',
    colorHex: '#FFFFD1',
    baseEmoji: '😲',
    levels: [
      {
        intensity: 1,
        label: 'Incuriosito',
        emoji: '🤔',
        image: null
      },
      {
        intensity: 2,
        label: 'Sorpreso',
        emoji: '😮',
        image: null
      },
      {
        intensity: 3,
        label: 'Stupito',
        emoji: '😯',
        image: null
      },
      {
        intensity: 4,
        label: 'Sbalordito',
        emoji: '😲',
        image: null
      },
      {
        intensity: 5,
        label: 'Scioccato',
        emoji: '🤯',
        image: null
      }
    ]
  }
];
