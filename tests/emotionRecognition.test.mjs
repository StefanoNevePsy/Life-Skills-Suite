import test from "node:test";
import assert from "node:assert/strict";
import {
  EMOTIONS,
  filterImages,
  makeRound,
  summarizeAttempts,
  reportCSV,
} from "../app/src/lib/emotionRecognition.js";

const images = [
  { id: "g1", kind: "photo", emotion: "gioia", title: "Giorno" },
  { id: "t1", kind: "drawing", emotion: "tristezza", title: "Mare" },
  { id: "r1", kind: "photo", emotion: "rabbia", title: "Rabbia" },
  { id: "p1", kind: "photo", emotion: "paura", title: "Paura" },
];

test("catalogue and image filters are bounded", () => {
  assert.deepEqual(
    EMOTIONS.map((e) => e.id),
    ["gioia", "tristezza", "rabbia", "paura", "sorpresa", "disgusto"],
  );
  assert.deepEqual(
    filterImages(images, { kind: "photo" }).map((i) => i.id),
    ["g1", "r1", "p1"],
  );
  assert.deepEqual(
    filterImages(images, { emotions: ["tristezza"] }).map((i) => i.id),
    ["t1"],
  );
});

test("rounds have no repeated images, balanced emotions, and valid choices", () => {
  const rounds = makeRound(
    [
      ...images,
      { id: "g2", kind: "photo", emotion: "gioia" },
      { ...images[0], title: "Duplicato" },
    ],
    { count: 4, choiceCount: 3 },
    () => 0.2,
  );
  assert.equal(rounds.length, 4);
  assert.equal(new Set(rounds.map((r) => r.image.id)).size, 4);
  assert.deepEqual(rounds.map((r) => r.image.emotion).sort(), [
    "gioia",
    "paura",
    "rabbia",
    "tristezza",
  ]);
  for (const round of rounds) {
    assert.equal(round.options.length, 3);
    assert.ok(round.options.includes(round.image.emotion));
  }
  assert.ok(
    rounds.every((round) =>
      round.options.every((id) =>
        rounds.some((other) => other.image.emotion === id),
      ),
    ),
  );
  assert.match(
    EMOTIONS.find((e) => e.id === "gioia").hint,
    /bocca|occhi|guance/i,
  );
});

test("single-emotion rounds retain enough choices from the full catalogue", () => {
  const rounds = makeRound(
    [{ id: "x", emotion: "gioia" }],
    { count: 1, choiceCount: 4 },
    () => 0.4,
  );
  assert.equal(rounds[0].options.length, 4);
  assert.ok(rounds[0].options.includes("gioia"));
});

test("attempt summary and CSV report score consistently and escape formulas", () => {
  const attempts = [
    {
      emotion: "gioia",
      answer: "gioia",
      helped: false,
      skipped: false,
      imageTitle: "=danger",
    },
    {
      emotion: "paura",
      answer: "rabbia",
      helped: true,
      skipped: false,
      imageTitle: 'A, "B"',
    },
    { emotion: "rabbia", skipped: true, helped: true },
  ];
  assert.deepEqual(summarizeAttempts(attempts), {
    total: 3,
    answered: 2,
    correct: 1,
    helped: 2,
    skipped: 1,
    byEmotion: [
      { emotion: "gioia", total: 1, correct: 1 },
      { emotion: "tristezza", total: 0, correct: 0 },
      { emotion: "rabbia", total: 1, correct: 0 },
      { emotion: "paura", total: 1, correct: 0 },
      { emotion: "sorpresa", total: 0, correct: 0 },
      { emotion: "disgusto", total: 0, correct: 0 },
    ],
  });
  const csv = reportCSV(attempts);
  assert.ok(csv.startsWith("\ufeff"));
  assert.match(csv, /"'=danger"/);
  assert.match(csv, /"A, ""B"""/);
  assert.match(csv, /Gioia/);
  assert.match(csv, /Titolo immagine/);
  for (const value of [" =formula", "\t+formula", "\n@formula"])
    assert.ok(reportCSV([{ imageTitle: value }]).includes(`"'${value}`));
});

test("bundled catalog has complete portraits and existing local assets", async () => {
  const { RECOGNITION_IMAGES } =
    await import("../app/src/data/emotionRecognitionImages.js");
  const { access } = await import("node:fs/promises");
  assert.equal(RECOGNITION_IMAGES.length, 61);
  assert.equal(new Set(RECOGNITION_IMAGES.map((i) => i.id)).size, 61);
  for (let n = 1; n <= 8; n++) {
    assert.equal(
      RECOGNITION_IMAGES.filter((i) => i.id.startsWith(`portrait-${n}-`))
        .length,
      6,
    );
  }
  for (const image of RECOGNITION_IMAGES) {
    assert.ok(EMOTIONS.some((e) => e.id === image.emotion));
    assert.ok(image.credit);
    await access(new URL("../public/" + image.src, import.meta.url));
  }
});
