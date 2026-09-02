// Struttura della ruota delle emozioni: 6 emozioni primarie, ciascuna con
// emozioni secondarie e terziarie. In totale 114 emozioni.
// Modificabile dall'utente: la versione corrente vive in localStorage (lss_wheel_data).

export const WHEEL_DATA_DEFAULT = [
  {
    core: 'sorpresa',
    secondary: [
      {
        name: 'sbalordito',
        tertiary: [
          'scioccato',
          'sconvolto'
        ]
      },
      {
        name: 'energico',
        tertiary: [
          'scoraggiato',
          'desideroso'
        ]
      },
      {
        name: 'confuso',
        tertiary: [
          'perplesso',
          'disillusione'
        ]
      },
      {
        name: 'eccitato',
        tertiary: [
          'meravigliato',
          'stupito'
        ]
      },
      {
        name: 'stupefatto',
        tertiary: [
          'stupido',
          'isolato'
        ]
      },
      {
        name: 'meraviglia',
        tertiary: [
          'disonorevole',
          'pentito'
        ]
      }
    ]
  },
  {
    core: 'rabbia',
    secondary: [
      {
        name: 'aggressivo',
        tertiary: [
          'ostile',
          'provocatorio'
        ]
      },
      {
        name: 'critico',
        tertiary: [
          'sarcastico',
          'scettico'
        ]
      },
      {
        name: 'distaccato',
        tertiary: [
          'sospettoso',
          'asociale'
        ]
      },
      {
        name: 'frustrato',
        tertiary: [
          'infuriato',
          'irritato'
        ]
      },
      {
        name: 'detestabile',
        tertiary: [
          'rancoroso',
          'violato'
        ]
      },
      {
        name: 'ferito',
        tertiary: [
          'devastato',
          'imbarazzato'
        ]
      }
    ]
  },
  {
    core: 'disgusto',
    secondary: [
      {
        name: 'arrabbiato',
        tertiary: [
          'imbestialito',
          'furioso'
        ]
      },
      {
        name: 'minacciato',
        tertiary: [
          'insicuro',
          'geloso'
        ]
      },
      {
        name: 'sfuggevole',
        tertiary: [
          'avversione',
          'esitante'
        ]
      },
      {
        name: 'orrore',
        tertiary: [
          'detestabile',
          'repulsione'
        ]
      },
      {
        name: 'deluso',
        tertiary: [
          'ripugnante',
          'ribelle'
        ]
      },
      {
        name: 'disapprovazione',
        tertiary: [
          'giudicante',
          'disgustato'
        ]
      }
    ]
  },
  {
    core: 'paura',
    secondary: [
      {
        name: 'ansioso',
        tertiary: [
          'sopraffatto',
          'preoccupato'
        ]
      },
      {
        name: 'umiliato',
        tertiary: [
          'irrispettato',
          'ridicolizzato'
        ]
      },
      {
        name: 'respinto',
        tertiary: [
          'inadeguato',
          'inferiore'
        ]
      },
      {
        name: 'impaurito',
        tertiary: [
          'terrorizzato',
          'spaventato'
        ]
      },
      {
        name: 'sottomesso',
        tertiary: [
          'insignificante',
          'indegno'
        ]
      },
      {
        name: 'accettato',
        tertiary: [
          'rispettato',
          'soddisfatto'
        ]
      }
    ]
  },
  {
    core: 'felicita',
    secondary: [
      {
        name: 'interessato',
        tertiary: [
          'divertito',
          'curioso'
        ]
      },
      {
        name: 'intimo',
        tertiary: [
          'gioioso',
          'delicato'
        ]
      },
      {
        name: 'ottimista',
        tertiary: [
          'ispirato',
          'aperto'
        ]
      },
      {
        name: 'tranquillo',
        tertiary: [
          'liberato',
          'estatico'
        ]
      },
      {
        name: 'potente',
        tertiary: [
          'speranzoso',
          'amorevole'
        ]
      },
      {
        name: 'orgoglioso',
        tertiary: [
          'coraggioso',
          'fiducioso'
        ]
      }
    ]
  },
  {
    core: 'tristezza',
    secondary: [
      {
        name: 'importante',
        tertiary: [
          'provocatorio',
          'indispensabile'
        ]
      },
      {
        name: 'depresso',
        tertiary: [
          'vuoto',
          'indifferente'
        ]
      },
      {
        name: 'annoiato',
        tertiary: [
          'apatico',
          'vittimizzato'
        ]
      },
      {
        name: 'abbandonato',
        tertiary: [
          'ignorato',
          'trascurato'
        ]
      },
      {
        name: 'colpevole',
        tertiary: [
          'disperato',
          'impotente'
        ]
      },
      {
        name: 'solo',
        tertiary: [
          'inferiore',
          'vulnerabile'
        ]
      }
    ]
  }
];

// Tre colori per emozione primaria: [anello interno, mediano, esterno].
export const WHEEL_PALETTES = {
  insideout: {
    rabbia: [
      '#E53935',
      '#EF5350',
      '#EF9A9A'
    ],
    disgusto: [
      '#43A047',
      '#66BB6A',
      '#A5D6A7'
    ],
    paura: [
      '#7B1FA2',
      '#AB47BC',
      '#CE93D8'
    ],
    felicita: [
      '#FDD835',
      '#FFEE58',
      '#FFF9C4'
    ],
    tristezza: [
      '#1E88E5',
      '#42A5F5',
      '#90CAF9'
    ],
    sorpresa: [
      '#FB8C00',
      '#FFA726',
      '#FFCC80'
    ]
  },
  pastel: {
    rabbia: [
      '#F4978E',
      '#F8B4B0',
      '#FCDAD7'
    ],
    disgusto: [
      '#8AC926',
      '#ACD96A',
      '#CEE9AD'
    ],
    paura: [
      '#C77DFF',
      '#D9A6FF',
      '#EBCFFF'
    ],
    felicita: [
      '#FFCA3A',
      '#FFD96A',
      '#FFE89A'
    ],
    tristezza: [
      '#577590',
      '#7FA1B5',
      '#A7CDDA'
    ],
    sorpresa: [
      '#FF924C',
      '#FFB27E',
      '#FFD2B0'
    ]
  },
  vivid: {
    rabbia: [
      '#D50000',
      '#FF1744',
      '#FF5252'
    ],
    disgusto: [
      '#00C853',
      '#00E676',
      '#69F0AE'
    ],
    paura: [
      '#AA00FF',
      '#D500F9',
      '#E040FB'
    ],
    felicita: [
      '#FFD600',
      '#FFEA00',
      '#FFFF8D'
    ],
    tristezza: [
      '#2962FF',
      '#448AFF',
      '#82B1FF'
    ],
    sorpresa: [
      '#FF6D00',
      '#FF9100',
      '#FFAB40'
    ]
  }
};
