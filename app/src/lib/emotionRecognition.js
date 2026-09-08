// Pure data and round-building helpers for the emotion recognition activity.

export const EMOTIONS = [
  {
    id: "gioia",
    label: "Gioia",
    hint: "Guance sollevate, occhi luminosi e bocca aperta in un sorriso.",
  },
  {
    id: "tristezza",
    label: "Tristezza",
    hint: "Sopracciglia leggermente inclinate verso il centro e angoli della bocca in giù.",
  },
  {
    id: "rabbia",
    label: "Rabbia",
    hint: "Sopracciglia ravvicinate, sguardo intenso e mascella o bocca tese.",
  },
  {
    id: "paura",
    label: "Paura",
    hint: "Occhi spalancati, sopracciglia sollevate e bocca spesso socchiusa.",
  },
  {
    id: "sorpresa",
    label: "Sorpresa",
    hint: "Sopracciglia molto sollevate, occhi aperti e bocca a forma di “o”.",
  },
  {
    id: "disgusto",
    label: "Disgusto",
    hint: "Naso arricciato, labbro superiore sollevato e bocca contratta.",
  },
];

const IDS = new Set(EMOTIONS.map((e) => e.id));
const idOf = (image) =>
  image?.emotion || image?.emotionId || image?.correctEmotion;

export function filterImages(images, { kind = "all", emotions = [] } = {}) {
  const wanted = new Set(
    (Array.isArray(emotions) ? emotions : [emotions]).filter((id) =>
      IDS.has(id),
    ),
  );
  return (Array.isArray(images) ? images : []).filter((image) => {
    const imageKind = image?.kind || image?.type || "photo";
    if (kind !== "all" && imageKind !== kind) return false;
    if (!wanted.size) return true;
    const imageEmotions = Array.isArray(image?.emotions)
      ? image.emotions
      : [idOf(image)];
    return imageEmotions.some((id) => wanted.has(id));
  });
}

const shuffle = (items, rng) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const n = Math.max(0, Math.min(0.999999999, Number(rng()) || 0));
    const j = Math.floor(n * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export function makeRound(
  images,
  { count = 1, choiceCount = 3, emotions = [] } = {},
  rng = Math.random,
) {
  const pool = filterImages(images, { emotions });
  const buckets = new Map();
  const seenIds = new Set();
  for (const image of shuffle(pool, rng)) {
    if (image?.id != null && seenIds.has(image.id)) continue;
    if (image?.id != null) seenIds.add(image.id);
    const emotion = idOf(image);
    if (IDS.has(emotion))
      (buckets.get(emotion) || buckets.set(emotion, []).get(emotion)).push(
        image,
      );
  }
  const active = [...buckets.keys()];
  const selected = [];
  // Round-robin gives each available emotion a turn before any is repeated.
  while (
    selected.length < Math.max(0, Math.min(Number(count) || 0, pool.length)) &&
    active.length
  ) {
    for (let i = active.length - 1; i >= 0 && selected.length < count; i -= 1) {
      const image = buckets.get(active[i]).shift();
      if (image) selected.push(image);
      if (!buckets.get(active[i]).length) active.splice(i, 1);
    }
  }
  const selectedRounds = shuffle(selected, rng);
  const selectedEmotionIds = [
    ...new Set(selectedRounds.map(idOf).filter((id) => IDS.has(id))),
  ];
  return selectedRounds.map((image) => {
    const correct = idOf(image);
    const optionPool = (
      selectedEmotionIds.length >= 2
        ? selectedEmotionIds
        : EMOTIONS.map((e) => e.id)
    ).filter((id) => id !== correct);
    const distractors = shuffle(optionPool, rng).slice(
      0,
      Math.max(0, (Number(choiceCount) || 0) - 1),
    );
    return { image, options: shuffle([correct, ...distractors], rng) };
  });
}

export function summarizeAttempts(attempts = []) {
  const rows = Array.isArray(attempts) ? attempts : [];
  return {
    total: rows.length,
    answered: rows.filter(
      (a) => !a?.skipped && a?.answer != null && a.answer !== "",
    ).length,
    correct: rows.filter((a) => !a?.skipped && a?.answer === a?.emotion).length,
    helped: rows.filter((a) => a?.helped).length,
    skipped: rows.filter((a) => a?.skipped).length,
    byEmotion: EMOTIONS.map(({ id }) => ({
      emotion: id,
      total: rows.filter((a) => a?.emotion === id).length,
      correct: rows.filter(
        (a) => a?.emotion === id && !a?.skipped && a?.answer === id,
      ).length,
    })),
  };
}

const csvCell = (value) => {
  let text = value == null ? "" : String(value);
  if (/^[\s\t\r\n]*[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
};

export function reportCSV(attempts = []) {
  const header = [
    "Titolo immagine",
    "Emozione",
    "Risposta",
    "Etichetta corretta",
    "Aiutato",
    "Saltato",
  ];
  const rows = (Array.isArray(attempts) ? attempts : []).map((a) => [
    a?.imageTitle,
    a?.emotion,
    a?.answer,
    EMOTIONS.find((e) => e.id === a?.emotion)?.label || "",
    Boolean(a?.helped),
    Boolean(a?.skipped),
  ]);
  return (
    "\ufeff" +
    [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n") +
    "\r\n"
  );
}
