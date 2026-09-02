// Immagini del Termometro Emozioni.
//
// Le immagini sono data URL potenzialmente molto grandi: tenerle nel documento
// Firestore lo farebbe sforare il limite di 1 MB. Vengono quindi salvate in
// IndexedDB sul dispositivo, e su Firestore va solo la struttura senza immagini.

const DB_NAME = 'et_images';
const DB_VERSION = 1;
const STORE = 'images';

/** Chiave di una singola immagine: emozione + indice del livello. */
const keyFor = (emotionId, levelIndex) => `${emotionId}_${levelIndex}`;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function etSaveImages(emotions) {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);

    for (const emo of emotions) {
      for (let i = 0; i < emo.levels.length; i++) {
        const key = keyFor(emo.id, i);
        if (emo.levels[i].image) store.put(emo.levels[i].image, key);
        else store.delete(key);
      }
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    });
  } catch (e) {
    console.error('ET IDB save error', e);
  }
}

/** Reidrata le emozioni con le immagini salvate localmente. */
export async function etLoadImages(emotions) {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE, 'readonly');
    const store = tx.objectStore(STORE);

    const requests = [];
    for (const emo of emotions) {
      for (let i = 0; i < emo.levels.length; i++) {
        requests.push(
          new Promise((resolve) => {
            const r = store.get(keyFor(emo.id, i));
            r.onsuccess = () => resolve({ emoId: emo.id, idx: i, img: r.result || null });
            r.onerror = () => resolve({ emoId: emo.id, idx: i, img: null });
          }),
        );
      }
    }

    const images = await Promise.all(requests);
    db.close();

    return emotions.map((emo) => ({
      ...emo,
      levels: emo.levels.map((level, i) => {
        const found = images.find((x) => x.emoId === emo.id && x.idx === i);
        return { ...level, image: found && found.img ? found.img : level.image || null };
      }),
    }));
  } catch (e) {
    console.error('ET IDB load error', e);
    return emotions;
  }
}

/** Versione senza immagini, adatta a essere salvata su Firestore. */
export function etStripImages(emotions) {
  return emotions.map((emo) => ({
    ...emo,
    levels: emo.levels.map((level) => ({ ...level, image: null })),
  }));
}
