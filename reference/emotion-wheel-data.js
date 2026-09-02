// =============================================================================
// RUOTA DELLE EMOZIONI - Complete Italian Emotion Wheel Data
// =============================================================================
// Source: Traced from ruota_.png (Plutchik-style Italian emotion wheel)
//
// Structure:
//   Center ring  -> 6 core emotions
//   Middle ring  -> 6 secondary emotions per core  (36 total)
//   Outer ring   -> 2 tertiary emotions per secondary (72 total)
//
// Sectors are listed clockwise starting from roughly 12 o'clock (RABBIA).
// The wheel reads: RABBIA (top-right), DISGUSTO (right), PAURA (bottom-right),
//                  FELICITA (bottom-left), TRISTEZZA (left), SORPRESA (top-left).
// =============================================================================

const WHEEL_DATA = [

  // -------------------------------------------------------------------------
  // SORPRESA  (top-left of wheel, yellow sector, ~10 o'clock to 12 o'clock)
  // -------------------------------------------------------------------------
  {
    core: "sorpresa",
    color: "#FB8C00",
    secondary: [
      { name: "sbalordito",   tertiary: ["scioccato",    "sconvolto"]    },
      { name: "energico",     tertiary: ["desideroso",   "perplesso"]    },
      { name: "confuso",      tertiary: ["disillusione", "meraviglia"]   },
      { name: "eccitato",     tertiary: ["stupito",      "isolato"]      },
      { name: "stupefatto",   tertiary: ["abbandonato",  "pentito"]      },
      { name: "meravigliato", tertiary: ["disonorevole", "vulnerabile"]  }
    ]
  },

  // -------------------------------------------------------------------------
  // RABBIA  (top-right of wheel, blue sector in image, ~12 o'clock to 2 o'clock)
  // Inside Out canonical color: red
  // -------------------------------------------------------------------------
  {
    core: "rabbia",
    color: "#E53935",
    secondary: [
      { name: "aggressivo",  tertiary: ["ostile",       "provocatorio"] },
      { name: "critico",     tertiary: ["sarcastico",   "scettico"]     },
      { name: "distaccato",  tertiary: ["asociale",     "infuriato"]    },
      { name: "frustrato",   tertiary: ["irritato",     "rancoroso"]    },
      { name: "detestabile", tertiary: ["violato",      "devastato"]    },
      { name: "ferito",      tertiary: ["imbarazzato",  "imbestialito"] }
    ]
  },

  // -------------------------------------------------------------------------
  // DISGUSTO  (right side, orange/salmon sector in image, ~2 o'clock to 4 o'clock)
  // Inside Out canonical color: green
  // -------------------------------------------------------------------------
  {
    core: "disgusto",
    color: "#43A047",
    secondary: [
      { name: "arrabbiato",      tertiary: ["furioso",    "insicuro"]     },
      { name: "minacciato",      tertiary: ["geloso",     "avversione"]   },
      { name: "sfuggevole",      tertiary: ["esitante",   "detestabile"]  },
      { name: "orrore",          tertiary: ["repulsione", "ripugnante"]   },
      { name: "deluso",          tertiary: ["ribelle",    "giudicante"]   },
      { name: "disapprovazione", tertiary: ["disgustato", "sopraffatto"]  }
    ]
  },

  // -------------------------------------------------------------------------
  // PAURA  (bottom-right, green sector in image, ~4 o'clock to 6 o'clock)
  // Inside Out canonical color: purple
  // -------------------------------------------------------------------------
  {
    core: "paura",
    color: "#7B1FA2",
    secondary: [
      { name: "ansioso",    tertiary: ["preoccupato",    "sopraffatto"]    },
      { name: "umiliato",   tertiary: ["ridicolizzato",  "inadeguato"]     },
      { name: "respinto",   tertiary: ["inferiore",      "inadeguato"]     },
      { name: "impaurito",  tertiary: ["terrorizzato",   "spaventato"]     },
      { name: "sottomesso", tertiary: ["insignificante", "indegno"]        },
      { name: "accettato",  tertiary: ["soddisfatto",    "rispettato"]     }
    ]
  },

  // -------------------------------------------------------------------------
  // FELICITA  (bottom-left, teal/green sector in image, ~6 o'clock to 8 o'clock)
  // Inside Out canonical color: yellow
  // -------------------------------------------------------------------------
  {
    core: "felicita",
    color: "#FDD835",
    secondary: [
      { name: "interessato", tertiary: ["divertito",  "curioso"]      },
      { name: "intimo",      tertiary: ["gioioso",    "delicato"]     },
      { name: "ottimista",   tertiary: ["ispirato",   "aperto"]       },
      { name: "tranquillo",  tertiary: ["liberato",   "estatico"]     },
      { name: "potente",     tertiary: ["speranzoso", "amorevole"]    },
      { name: "orgoglioso",  tertiary: ["coraggioso", "provocatorio"] }
    ]
  },

  // -------------------------------------------------------------------------
  // TRISTEZZA  (left side, purple/violet sector, ~8 o'clock to 10 o'clock)
  // Inside Out canonical color: blue
  // -------------------------------------------------------------------------
  {
    core: "tristezza",
    color: "#1E88E5",
    secondary: [
      { name: "importante",  tertiary: ["fiducioso",  "provocatorio"] },
      { name: "depresso",    tertiary: ["vuoto",      "indifferente"] },
      { name: "annoiato",    tertiary: ["apatico",    "vittimizzato"] },
      { name: "abbandonato", tertiary: ["ignorato",   "solo"]         },
      { name: "colpevole",   tertiary: ["disperato",  "impotente"]    },
      { name: "solo",        tertiary: ["inferiore",  "vulnerabile"]  }
    ]
  }

];


// =============================================================================
// COLOR PALETTES
// =============================================================================
// Three palettes for rendering the wheel. Each maps core emotion -> color.
//   base  = center ring (core emotion)
//   mid   = middle ring (secondary emotions)
//   outer = outer ring  (tertiary emotions)
// =============================================================================

const COLOR_PALETTES = {

  // ---------------------------------------------------------------------------
  // 1. INSIDE OUT  -  Based on Pixar's Inside Out character colors
  // ---------------------------------------------------------------------------
  insideout: {
    rabbia:    { base: "#E53935", mid: "#EF5350", outer: "#EF9A9A" },
    disgusto:  { base: "#43A047", mid: "#66BB6A", outer: "#A5D6A7" },
    paura:     { base: "#7B1FA2", mid: "#AB47BC", outer: "#CE93D8" },
    felicita:  { base: "#FDD835", mid: "#FFEE58", outer: "#FFF9C4" },
    tristezza: { base: "#1E88E5", mid: "#42A5F5", outer: "#90CAF9" },
    sorpresa:  { base: "#FB8C00", mid: "#FFA726", outer: "#FFCC80" }
  },

  // ---------------------------------------------------------------------------
  // 2. PASTEL  -  Soft pastel tones (close to the original ruota_.png image)
  // ---------------------------------------------------------------------------
  pastel: {
    rabbia:    { base: "#7EA6D8", mid: "#A3BFE3", outer: "#C8D8EE" },
    disgusto:  { base: "#F4A97E", mid: "#F7C4A5", outer: "#FADECB" },
    paura:     { base: "#7CC88A", mid: "#A3D9AD", outer: "#C9EAD0" },
    felicita:  { base: "#7BC8A4", mid: "#A1D9BF", outer: "#C7EAD9" },
    tristezza: { base: "#C5A0D8", mid: "#D6BBE4", outer: "#E7D6F0" },
    sorpresa:  { base: "#F5D576", mid: "#F8E1A0", outer: "#FBEDC9" }
  },

  // ---------------------------------------------------------------------------
  // 3. VIVID  -  High-saturation bold colors
  // ---------------------------------------------------------------------------
  vivid: {
    rabbia:    { base: "#D50000", mid: "#FF1744", outer: "#FF5252" },
    disgusto:  { base: "#00C853", mid: "#00E676", outer: "#69F0AE" },
    paura:     { base: "#AA00FF", mid: "#D500F9", outer: "#E040FB" },
    felicita:  { base: "#FFD600", mid: "#FFEA00", outer: "#FFFF00" },
    tristezza: { base: "#2962FF", mid: "#448AFF", outer: "#82B1FF" },
    sorpresa:  { base: "#FF6D00", mid: "#FF9100", outer: "#FFAB40" }
  }

};


// =============================================================================
// FLAT LIST HELPER
// =============================================================================
// Returns every emotion as a flat array of objects:
//   { label, ring, core, secondary }
// Useful for search / autocomplete.
// =============================================================================

function flattenWheelData(data) {
  const list = [];
  for (const sector of data) {
    list.push({ label: sector.core, ring: "core", core: sector.core, secondary: null });
    for (const sec of sector.secondary) {
      list.push({ label: sec.name, ring: "secondary", core: sector.core, secondary: sec.name });
      for (const t of sec.tertiary) {
        list.push({ label: t, ring: "tertiary", core: sector.core, secondary: sec.name });
      }
    }
  }
  return list;
}

const FLAT_EMOTIONS = flattenWheelData(WHEEL_DATA);


// =============================================================================
// STATISTICS (for verification)
// =============================================================================
// Core emotions:      6
// Secondary emotions: 36  (6 per core)
// Tertiary emotions:  72  (2 per secondary, 12 per core)
// Total labels:       6 + 36 + 72 = 114
//
// NOTE: A few emotion words appear in more than one sector of the original
// wheel. This is intentional and mirrors the source image where certain
// feelings bridge adjacent core emotions:
//   - "provocatorio"  appears in RABBIA, FELICITA, and TRISTEZZA
//   - "sopraffatto"   appears in DISGUSTO and PAURA
//   - "inadeguato"    appears twice in PAURA (under umiliato and respinto)
//   - "inferiore"     appears in PAURA and TRISTEZZA
//   - "vulnerabile"   appears in SORPRESA and TRISTEZZA
//   - "detestabile"   appears in RABBIA (secondary) and DISGUSTO (tertiary)
// =============================================================================


// =============================================================================
// COMPLETE SECTOR MAP (quick reference - matches ruota_.png)
// =============================================================================
//
// SORPRESA (yellow, top-left, ~10-12 o'clock)
//   sbalordito ......... scioccato, sconvolto
//   energico ........... desideroso, perplesso
//   confuso ............ disillusione, meraviglia
//   eccitato ........... stupito, isolato
//   stupefatto ......... abbandonato, pentito
//   meravigliato ....... disonorevole, vulnerabile
//
// RABBIA (blue in image, top-right, ~12-2 o'clock)
//   aggressivo ......... ostile, provocatorio
//   critico ............ sarcastico, scettico
//   distaccato ......... asociale, infuriato
//   frustrato .......... irritato, rancoroso
//   detestabile ........ violato, devastato
//   ferito ............. imbarazzato, imbestialito
//
// DISGUSTO (orange/salmon in image, right, ~2-4 o'clock)
//   arrabbiato ......... furioso, insicuro
//   minacciato ......... geloso, avversione
//   sfuggevole ......... esitante, detestabile
//   orrore ............. repulsione, ripugnante
//   deluso ............. ribelle, giudicante
//   disapprovazione .... disgustato, sopraffatto
//
// PAURA (green in image, bottom-right, ~4-6 o'clock)
//   ansioso ............ preoccupato, sopraffatto
//   umiliato ........... ridicolizzato, inadeguato
//   respinto ........... inferiore, inadeguato
//   impaurito .......... terrorizzato, spaventato
//   sottomesso ......... insignificante, indegno
//   accettato .......... soddisfatto, rispettato
//
// FELICITA (teal/green in image, bottom-left, ~6-8 o'clock)
//   interessato ........ divertito, curioso
//   intimo ............. gioioso, delicato
//   ottimista .......... ispirato, aperto
//   tranquillo ......... liberato, estatico
//   potente ............ speranzoso, amorevole
//   orgoglioso ......... coraggioso, provocatorio
//
// TRISTEZZA (purple in image, left, ~8-10 o'clock)
//   importante ......... fiducioso, provocatorio
//   depresso ........... vuoto, indifferente
//   annoiato ........... apatico, vittimizzato
//   abbandonato ........ ignorato, solo
//   colpevole .......... disperato, impotente
//   solo ............... inferiore, vulnerabile
//
// =============================================================================
