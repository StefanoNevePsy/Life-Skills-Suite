import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Eye,
  Download,
  Upload,
  Volume2,
  Play,
  RotateCcw,
} from "lucide-react";
import FullscreenButton from "./FullscreenButton";
import { RECOGNITION_IMAGES } from "../data/emotionRecognitionImages";
import {
  EMOTIONS,
  filterImages,
  makeRound,
  summarizeAttempts,
  reportCSV,
} from "../lib/emotionRecognition";
import {
  ensureImageLoaded,
  saveCustomImage,
  syncImageToFirestore,
} from "../lib/customImageStorage";
import {
  downloadRecognitionFile,
  readRecognitionFile,
} from "../lib/recognitionImageImport";

const kinds = {
  all: "Miste",
  drawing: "Disegni",
  photo: "Foto reali",
  generated: "Fotorealistiche IA",
};
const label = (id) => EMOTIONS.find((e) => e.id === id)?.label || id;
const button =
  "inline-flex items-center justify-center gap-2 rounded-xl border-2 border-black px-4 py-3 font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-95";
const panel =
  "rounded-2xl border-2 border-black bg-white p-5 shadow-[4px_4px_0_0_#111827]";
const select =
  "w-full rounded-lg border-2 border-gray-300 bg-white p-2 text-gray-900";

function Stimulus({
  image,
  db,
  appId,
  onReady,
  reveal = false,
  className = "",
}) {
  const [source, setSource] = useState("");
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let live = true;
    setSource("");
    setFailed(false);
    onReady?.(false);
    if (image.customImageId) {
      ensureImageLoaded(image.customImageId, db, appId)
        .then((src) => {
          if (live) {
            setSource(src || "");
            setFailed(!src);
          }
        })
        .catch(() => {
          if (live) setFailed(true);
        });
    } else setSource(image.src);
    return () => {
      live = false;
    };
  }, [image.id, image.customImageId, image.src, db, appId]);
  if (failed)
    return (
      <div role="alert" className="p-6 text-center">
        Immagine non disponibile. Controlla la connessione o ricaricala dalla
        libreria.
      </div>
    );
  if (!source)
    return (
      <p role="status" className="p-6 text-center">
        Caricamento immagine…
      </p>
    );
  return (
    <img
      src={source}
      alt={reveal ? image.title : "Osserva l’espressione del volto"}
      onLoad={() => onReady?.(true)}
      onError={() => {
        setFailed(true);
        onReady?.(false);
      }}
      className={`object-contain ${className}`}
    />
  );
}

export default function EmotionRecognitionView({
  value,
  onUpdate,
  onBack,
  db,
  user,
  appId,
  cloudStatus,
}) {
  const library = value?.images || [];
  const hidden = value?.hidden || [];
  const [tab, setTab] = useState("setup");
  const [kind, setKind] = useState("all");
  const [style, setStyle] = useState("all");
  const [emotions, setEmotions] = useState(EMOTIONS.map((e) => e.id));
  const [count, setCount] = useState(12);
  const [choiceCount, setChoiceCount] = useState(3);
  const [mode, setMode] = useState("quiz");
  const [round, setRound] = useState([]);
  const [index, setIndex] = useState(0);
  const [attempts, setAttempts] = useState([]);
  const [helped, setHelped] = useState(false);
  const [response, setResponse] = useState(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [drafts, setDrafts] = useState([]);
  const [importKind, setImportKind] = useState("photo");
  const [importEmotion, setImportEmotion] = useState("gioia");
  const [sheet, setSheet] = useState(false);
  const [credit, setCredit] = useState("");
  const [rights, setRights] = useState(false);
  const [visibleCount, setVisibleCount] = useState(24);
  const recording = useRef(false);
  const heading = useRef(null);
  const all = useMemo(() => [...RECOGNITION_IMAGES, ...library], [library]);
  const filtered = useMemo(
    () =>
      emotions.length
        ? filterImages(all, { kind, emotions }).filter(
            (i) =>
              style === "all" ||
              (style === "portrait"
                ? i.style !== "symbol"
                : i.style === "symbol"),
          )
        : [],
    [all, kind, emotions, style],
  );
  const available = filtered.filter((i) => !hidden.includes(i.id));
  const summary = summarizeAttempts(attempts);
  const current = round[index];
  useEffect(() => {
    setVisibleCount(24);
  }, [kind, emotions, style]);
  useEffect(() => {
    if (tab === "play" || tab === "result") heading.current?.focus();
  }, [tab, index]);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  function start(images = available) {
    const items = makeRound(images, { count, choiceCount, emotions });
    if (!items.length) return;
    window.speechSynthesis?.cancel();
    setRound(items);
    setIndex(0);
    setAttempts([]);
    setHelped(false);
    setResponse(null);
    setReady(false);
    recording.current = false;
    setTab("play");
  }
  function answer(id, skipped = false) {
    if (recording.current || (!ready && !skipped)) return;
    recording.current = true;
    setAttempts((prev) => [
      ...prev,
      {
        imageId: current.image.id,
        imageTitle: current.image.title,
        emotion: current.image.emotion,
        answer: id,
        helped,
        skipped,
      },
    ]);
    setResponse({ answer: id, skipped });
  }
  function next() {
    window.speechSynthesis?.cancel();
    if (index + 1 === round.length) {
      setTab("result");
      return;
    }
    setIndex((i) => i + 1);
    setHelped(false);
    setResponse(null);
    setReady(false);
    recording.current = false;
  }
  function speak() {
    if (!window.speechSynthesis) {
      setMessage("Lettura vocale non disponibile in questo browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const text = response
      ? `L'emozione proposta è ${label(current.image.emotion)}.`
      : `Quale emozione potrebbe esprimere questo volto? ${current.options.map(label).join(". ")}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "it-IT";
    window.speechSynthesis.speak(utterance);
  }
  async function previewFiles(files) {
    setMessage("");
    setBusy(true);
    setDrafts([]);
    try {
      if (!files.length || files.length > 12)
        throw new Error("Seleziona da 1 a 12 file alla volta.");
      const list = [];
      for (const file of files) {
        const bytes = await readRecognitionFile(file, { sheet });
        bytes.forEach((src, i) =>
          list.push({
            id: crypto.randomUUID(),
            src,
            kind: importKind,
            emotion: sheet ? EMOTIONS[i].id : importEmotion,
            title:
              file.name.replace(/\.[^.]+$/, "").slice(0, 90) +
              (sheet ? ` · ${i + 1}` : ""),
          }),
        );
      }
      setDrafts(list);
      setMessage(
        "Controlla ogni ritaglio e correggi le emozioni prima di salvare.",
      );
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  }
  async function saveDrafts() {
    if (!rights || !credit.trim() || !drafts.length) return;
    setBusy(true);
    setMessage("Salvataggio delle immagini…");
    try {
      if (library.length + drafts.length > 300)
        throw new Error("La libreria supporta fino a 300 immagini personali.");
      const added = [];
      for (const draft of drafts) {
        const id = "recognition-" + draft.id;
        await saveCustomImage(id, draft.src, { requirePersistent: true });
        if (db) {
          if (!user)
            throw new Error("Accedi come docente per condividere le immagini.");
          await syncImageToFirestore(db, user, appId, id, draft.src);
        }
        added.push({
          id,
          customImageId: id,
          kind: draft.kind,
          emotion: draft.emotion,
          title: draft.title || label(draft.emotion),
          credit: credit.trim().slice(0, 300),
          style: "portrait",
        });
      }
      await onUpdate({ ...value, images: [...library, ...added], hidden });
      setDrafts([]);
      setMessage(
        db
          ? "Immagini caricate nel cloud. Controlla qui sotto lo stato di salvataggio dell’archivio."
          : "Immagini salvate su questo dispositivo. Conserva anche i file originali; il backup JSON generale contiene solo i riferimenti.",
      );
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  }
  async function toggleImage(id) {
    setBusy(true);
    try {
      await onUpdate({
        ...value,
        images: library,
        hidden: hidden.includes(id)
          ? hidden.filter((x) => x !== id)
          : [...hidden, id],
      });
    } finally {
      setBusy(false);
    }
  }
  const filters = (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="font-bold">
        Tipo di immagini
        <select
          className={select}
          value={kind}
          onChange={(e) => setKind(e.target.value)}
        >
          {Object.entries(kinds).map(([id, name]) => (
            <option key={id} value={id}>
              {name} (
              {id === "all"
                ? all.length
                : all.filter((i) => i.kind === id).length}
              )
            </option>
          ))}
        </select>
      </label>
      <label className="font-bold">
        Stile
        <select
          className={select}
          value={style}
          onChange={(e) => setStyle(e.target.value)}
        >
          <option value="all">Volti e simboli</option>
          <option value="portrait">Solo volti</option>
          <option value="symbol">Solo simboli OpenMoji</option>
        </select>
      </label>
      <fieldset className="sm:col-span-2">
        <legend className="font-bold mb-2">Emozioni da allenare</legend>
        <div className="flex flex-wrap gap-2">
          {EMOTIONS.map((e) => (
            <label
              key={e.id}
              className="flex gap-2 items-center rounded-lg bg-stone-100 p-3"
            >
              <input
                type="checkbox"
                checked={emotions.includes(e.id)}
                onChange={() =>
                  setEmotions((old) =>
                    old.includes(e.id)
                      ? old.filter((x) => x !== e.id)
                      : [...old, e.id],
                  )
                }
              />
              {e.label}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );

  return (
    <main className="min-h-screen bg-teal-50 text-gray-900 p-4 sm:p-7">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap justify-between items-center gap-3">
          <button
            className={button + " bg-white"}
            disabled={busy}
            onClick={() => {
              if (
                tab !== "play" ||
                window.confirm(
                  "Uscire dall’attività? Il riepilogo non esportato andrà perso.",
                )
              )
                onBack();
            }}
          >
            <ArrowLeft size={18} />
            Dashboard
          </button>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-teal-800">
              Osserva · esplora · confronta
            </p>
            <h1
              ref={heading}
              tabIndex={-1}
              className="text-2xl sm:text-3xl font-black outline-none"
            >
              Riconosci le emozioni
            </h1>
          </div>
          <FullscreenButton />
        </header>
        {(tab === "setup" || tab === "library") && (
          <>
            <p className="max-w-3xl">
              Un allenamento da fare insieme, alla LIM o sullo stesso
              dispositivo. Un volto offre indizi: contesto e parole della
              persona aiutano a comprenderla.
            </p>
            <nav className="flex gap-3" aria-label="Attività">
              <button
                className={
                  button + (tab === "setup" ? " bg-teal-200" : " bg-white")
                }
                disabled={busy}
                onClick={() => setTab("setup")}
              >
                Allenamento
              </button>
              <button
                className={
                  button + (tab === "library" ? " bg-teal-200" : " bg-white")
                }
                disabled={busy}
                onClick={() => setTab("library")}
              >
                Libreria · {all.length}
              </button>
            </nav>
            <section className={panel}>
              {filters}
              <p className="mt-4 font-bold">
                {available.length} immagini utilizzabili con questi filtri
              </p>
              {!available.length && (
                <p className="mt-2" role="status">
                  Nessuna immagine disponibile. Cambia i filtri o importa
                  immagini dalla libreria. Le foto reali e le immagini
                  fotorealistiche IA vanno aggiunte.
                </p>
              )}
            </section>
          </>
        )}
        {message && tab !== "library" && (
          <p
            role="status"
            className="rounded-xl border-2 border-teal-700 bg-white p-4"
          >
            {message}
          </p>
        )}
        {tab === "setup" && (
          <section className={panel + " space-y-5"}>
            <div className="grid sm:grid-cols-3 gap-4">
              <label className="font-bold">
                Come lavorare
                <select
                  className={select}
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                >
                  <option value="quiz">Scegli l’emozione</option>
                  <option value="explore">Osserva e racconta</option>
                </select>
              </label>
              <label className="font-bold">
                Immagini per giro
                <select
                  className={select}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                >
                  {[6, 12, 18, 24, 36, 60].map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </label>
              <label className="font-bold">
                Alternative di risposta
                <select
                  className={select}
                  disabled={mode === "explore"}
                  value={choiceCount}
                  onChange={(e) => setChoiceCount(Number(e.target.value))}
                >
                  {[2, 3, 4, 6].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <p>
              {mode === "quiz"
                ? "Nessun conto alla rovescia. Puoi chiedere un indizio o saltare. Il riepilogo distingue gli aiuti e le immagini saltate."
                : "Osserva il volto, descrivi gli indizi e immagina una situazione. Scopri poi l’emozione proposta, senza punteggio."}
            </p>
            {emotions.length < 2 && mode === "quiz" && (
              <p role="status">
                Seleziona almeno due emozioni per il gioco a scelta.
              </p>
            )}
            <button
              className={button + " bg-teal-200"}
              disabled={
                !available.length || (mode === "quiz" && emotions.length < 2)
              }
              onClick={() => start()}
            >
              <Play size={20} />
              Inizia · {Math.min(count, available.length)} immagini
            </button>
            <p className="text-sm text-gray-600">
              Gli esempi sono materiale educativo, non un test diagnostico. I
              risultati rimangono in questa attività finché non li esporti.
            </p>
          </section>
        )}
        {tab === "library" && (
          <>
            <details className={panel}>
              <summary className="font-bold cursor-pointer">
                Importa immagini o tavole da ChatGPT
              </summary>
              <div className="space-y-4 mt-4">
                <p>
                  Puoi aggiungere foto autorizzate, disegni o immagini
                  fotorealistiche generate. Per una tavola 3 × 2, l’ordine è:
                  gioia, tristezza, rabbia; paura, sorpresa, disgusto. Il
                  ritaglio è automatico; controlla le etichette nell’anteprima.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <label>
                    Tipo da importare
                    <select
                      className={select}
                      disabled={busy}
                      value={importKind}
                      onChange={(e) => setImportKind(e.target.value)}
                    >
                      {Object.entries(kinds)
                        .filter(([k]) => k !== "all")
                        .map(([k, v]) => (
                          <option key={k} value={k}>
                            {v}
                          </option>
                        ))}
                    </select>
                  </label>
                  <label>
                    Emozione dei file singoli
                    <select
                      className={select}
                      disabled={sheet || busy}
                      value={importEmotion}
                      onChange={(e) => setImportEmotion(e.target.value)}
                    >
                      {EMOTIONS.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="flex gap-2">
                  <input
                    type="checkbox"
                    disabled={busy}
                    checked={sheet}
                    onChange={(e) => setSheet(e.target.checked)}
                  />
                  Ogni file è una tavola con sei volti (3 colonne × 2 righe)
                </label>
                <label className="block">
                  Autore, provenienza e autorizzazione/licenza
                  <input
                    className={select}
                    maxLength={300}
                    value={credit}
                    disabled={busy}
                    onChange={(e) => setCredit(e.target.value)}
                    placeholder="Es. Generata con ChatGPT · personaggio immaginario"
                  />
                </label>
                <label className="flex gap-2">
                  <input
                    type="checkbox"
                    checked={rights}
                    disabled={busy}
                    onChange={(e) => setRights(e.target.checked)}
                  />
                  Posso usare e condividere queste immagini in questa app.
                </label>
                <label className={button + " bg-white"}>
                  <Upload size={18} />
                  Scegli file
                  <input
                    aria-label="File immagini"
                    className="sr-only"
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/webp"
                    disabled={busy}
                    onChange={(e) => {
                      previewFiles([...e.target.files]);
                      e.target.value = "";
                    }}
                  />
                </label>
                <p className="text-sm">
                  Fino a 12 file per volta, PNG/JPEG/WebP, massimo 12 MB
                  ciascuno. Conversione automatica in WebP, fino a 1000 pixel
                  per ritaglio. I cambiamenti di tipo si applicano ai file
                  scelti dopo la modifica.
                </p>
                {!!drafts.length && (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {drafts.map((d, i) => (
                        <div className="p-2 border rounded-xl" key={d.id}>
                          <img
                            src={d.src}
                            alt={`Anteprima ritaglio ${i + 1}`}
                            className="w-full h-40 object-contain"
                          />
                          <label className="text-sm">
                            Titolo
                            <input
                              className={select}
                              maxLength={100}
                              value={d.title}
                              disabled={busy}
                              onChange={(e) =>
                                setDrafts((old) =>
                                  old.map((x) =>
                                    x.id === d.id
                                      ? { ...x, title: e.target.value }
                                      : x,
                                  ),
                                )
                              }
                            />
                          </label>
                          <label className="text-sm">
                            Emozione
                            <select
                              className={select}
                              value={d.emotion}
                              disabled={busy}
                              onChange={(e) =>
                                setDrafts((old) =>
                                  old.map((x) =>
                                    x.id === d.id
                                      ? { ...x, emotion: e.target.value }
                                      : x,
                                  ),
                                )
                              }
                            >
                              {EMOTIONS.map((em) => (
                                <option key={em.id} value={em.id}>
                                  {em.label}
                                </option>
                              ))}
                            </select>
                          </label>
                          <button
                            className="underline p-2"
                            disabled={busy}
                            onClick={() =>
                              setDrafts((old) =>
                                old.filter((x) => x.id !== d.id),
                              )
                            }
                          >
                            Scarta ritaglio {i + 1}
                          </button>
                        </div>
                      ))}
                    </div>
                    {(!credit.trim() || !rights) && (
                      <div
                        id="recognition-save-requirements"
                        role="status"
                        className="rounded-xl border-2 border-amber-400 bg-amber-50 p-3 text-sm"
                      >
                        <p className="font-bold">
                          Per abilitare il salvataggio:
                        </p>
                        {!credit.trim() && (
                          <p>
                            • Compila il campo “Autore, provenienza e
                            autorizzazione/licenza” sopra le anteprime (es.
                            “Generata con ChatGPT · personaggio immaginario”).
                          </p>
                        )}
                        {!rights && (
                          <p>
                            • Seleziona “Posso usare e condividere queste
                            immagini in questa app” sopra le anteprime.
                          </p>
                        )}
                      </div>
                    )}
                    <button
                      className={button + " bg-teal-200"}
                      aria-describedby={
                        !credit.trim() || !rights
                          ? "recognition-save-requirements"
                          : undefined
                      }
                      disabled={busy || !rights || !credit.trim()}
                      onClick={saveDrafts}
                    >
                      {busy
                        ? "Salvataggio…"
                        : `Salva ${drafts.length} immagini`}
                    </button>
                    <button
                      className={button + " bg-white ml-2"}
                      disabled={busy}
                      onClick={() => setDrafts([])}
                    >
                      Annulla importazione
                    </button>
                  </>
                )}
                {message && (
                  <p role="status" className="rounded-xl bg-teal-50 p-3">
                    {message}
                  </p>
                )}
                <p role="status" className="text-sm">
                  {db
                    ? `Archivio condiviso docenti · ${cloudStatus || ""}`
                    : "Modalità locale: conserva i file originali per trasferirli su altri dispositivi."}
                </p>
              </div>
            </details>
            <section
              aria-label="Immagini della libreria"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {filtered.slice(0, visibleCount).map((image) => (
                <article
                  key={image.id}
                  className={
                    panel + (hidden.includes(image.id) ? " opacity-60" : "")
                  }
                >
                  <Stimulus
                    image={image}
                    db={db}
                    appId={appId}
                    reveal
                    className="w-full h-40"
                  />
                  <h2 className="font-bold mt-2">{label(image.emotion)}</h2>
                  <p className="text-xs break-words">{image.title}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {kinds[image.kind]} · {image.credit}
                  </p>
                  <button
                    className="mt-3 underline text-sm p-2"
                    disabled={busy}
                    onClick={() => toggleImage(image.id)}
                  >
                    {hidden.includes(image.id)
                      ? "Includi nell’allenamento"
                      : "Escludi dall’allenamento"}
                  </button>
                </article>
              ))}
            </section>
            {filtered.length > visibleCount && (
              <button
                className={button + " bg-white"}
                onClick={() => setVisibleCount((n) => n + 24)}
              >
                Mostra altre immagini
              </button>
            )}
            <p className="text-sm">
              48 volti illustrati originali e 13 simboli{" "}
              <a
                className="underline"
                href="https://openmoji.org/"
                target="_blank"
                rel="noreferrer"
              >
                OpenMoji
              </a>
              ,{" "}
              <a
                className="underline"
                href="https://creativecommons.org/licenses/by-sa/4.0/"
                target="_blank"
                rel="noreferrer"
              >
                CC BY-SA 4.0
              </a>
              , non modificati. I volti originali sono CC0.{" "}
              <a
                className="underline"
                href="emotion-recognition/CREDITS.txt"
                target="_blank"
                rel="noreferrer"
              >
                Crediti completi
              </a>
              .
            </p>
          </>
        )}
        {tab === "play" && current && (
          <>
            <div className="flex justify-between items-center gap-3">
              <p className="font-bold">
                Immagine {index + 1} di {round.length} ·{" "}
                {kinds[current.image.kind]}
              </p>
              <button className={button + " bg-white"} onClick={speak}>
                <Volume2 size={18} />
                Leggi
              </button>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <section
                className={panel + " flex items-center justify-center min-h-72"}
              >
                <Stimulus
                  image={current.image}
                  db={db}
                  appId={appId}
                  onReady={setReady}
                  className="w-full max-h-[55vh]"
                />
              </section>
              <section className={panel + " flex flex-col gap-4"}>
                <h2 className="text-2xl font-black">
                  {mode === "quiz"
                    ? "Quale emozione potrebbe esprimere?"
                    : "Che cosa noti in questo volto?"}
                </h2>
                {mode === "explore" && (
                  <p>
                    Osserva bocca, occhi e sopracciglia. Che cosa potrebbe
                    essere successo? Quali altre interpretazioni sono possibili?
                  </p>
                )}
                {!response && mode === "quiz" && (
                  <div className="grid grid-cols-2 gap-3">
                    {current.options.map((id) => (
                      <button
                        key={id}
                        className={button + " bg-teal-100 min-h-16"}
                        disabled={!ready}
                        onClick={() => answer(id)}
                      >
                        {label(id)}
                      </button>
                    ))}
                  </div>
                )}
                {!response && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      className={button + " bg-amber-100"}
                      disabled={!ready}
                      onClick={() => setHelped(true)}
                    >
                      <Eye size={18} />
                      Un indizio
                    </button>
                    {mode === "explore" && (
                      <button
                        className={button + " bg-teal-100"}
                        disabled={!ready}
                        onClick={() => answer(null)}
                      >
                        Scopri la proposta
                      </button>
                    )}
                    <button
                      className={button + " bg-white"}
                      onClick={() => answer(null, true)}
                    >
                      Salta immagine
                    </button>
                  </div>
                )}
                {helped && !response && (
                  <p role="status" className="rounded-xl bg-amber-50 p-4">
                    {EMOTIONS.find((e) => e.id === current.image.emotion)?.hint}
                  </p>
                )}
                {response && (
                  <div
                    role="status"
                    className="space-y-3 rounded-xl bg-teal-50 p-4"
                  >
                    <p className="text-xl font-bold">
                      {mode === "explore" || response.skipped
                        ? "L’emozione proposta"
                        : response.answer === current.image.emotion
                          ? "Hai riconosciuto l’espressione proposta"
                          : "Confrontiamo gli indizi"}
                      : {label(current.image.emotion)}
                    </p>
                    <p>
                      {
                        EMOTIONS.find((e) => e.id === current.image.emotion)
                          ?.hint
                      }
                    </p>
                    <p>
                      Un’espressione può avere più significati. Che cosa
                      chiederesti alla persona per capire come si sente?
                    </p>
                    <button
                      autoFocus
                      className={button + " bg-teal-200"}
                      onClick={next}
                    >
                      {index + 1 === round.length
                        ? "Vedi riepilogo"
                        : "Prossima immagine"}
                    </button>
                  </div>
                )}
              </section>
            </div>
            <button
              className="underline p-3"
              onClick={() => {
                window.speechSynthesis?.cancel();
                setTab("result");
              }}
            >
              Termina e mostra il riepilogo
            </button>
          </>
        )}
        {tab === "result" && (
          <section className={panel + " space-y-5"}>
            <h2 className="text-2xl font-black">
              {mode === "quiz" ? "Il tuo allenamento" : "Le immagini esplorate"}
            </h2>
            <p>
              {summary.total} immagini affrontate su {round.length} ·{" "}
              {summary.helped} con indizio · {summary.skipped} saltate
            </p>
            {mode === "quiz" && (
              <>
                <p className="text-xl font-bold">
                  {summary.correct} risposte corrispondenti alla proposta su{" "}
                  {summary.answered} risposte date
                </p>
                <table className="w-full text-left">
                  <caption className="text-left mb-3">
                    Riepilogo per emozione, inclusi i tentativi con aiuto
                  </caption>
                  <thead>
                    <tr>
                      <th className="p-2">Emozione</th>
                      <th className="p-2">Corrispondenze / immagini</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.byEmotion
                      .filter((r) => r.total)
                      .map((r) => (
                        <tr key={r.emotion} className="border-t">
                          <td className="p-2">{label(r.emotion)}</td>
                          <td className="p-2">
                            {r.correct} / {r.total}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </>
            )}
            <div className="flex flex-wrap gap-3">
              <button
                className={button + " bg-white"}
                disabled={!attempts.length}
                onClick={() =>
                  downloadRecognitionFile(
                    "riconoscimento-emozioni.csv",
                    reportCSV(attempts),
                    "text/csv;charset=utf-8",
                  )
                }
              >
                <Download size={18} />
                Esporta CSV
              </button>
              {mode === "quiz" && (
                <button
                  className={button + " bg-amber-100"}
                  disabled={
                    !attempts.some(
                      (a) => a.skipped || a.answer !== a.emotion || a.helped,
                    )
                  }
                  onClick={() =>
                    start(
                      round
                        .filter((r) =>
                          attempts.some(
                            (a) =>
                              a.imageId === r.image.id &&
                              (a.skipped || a.answer !== a.emotion || a.helped),
                          ),
                        )
                        .map((r) => r.image),
                    )
                  }
                >
                  <RotateCcw size={18} />
                  Ripassa errori e aiuti
                </button>
              )}
              <button
                className={button + " bg-teal-200"}
                onClick={() => setTab("setup")}
              >
                Prepara un nuovo giro
              </button>
            </div>
            <p className="text-sm">
              Il riepilogo non viene salvato nel cloud e non contiene nomi.
              Esportalo prima di iniziare un altro giro o uscire.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
