// Gestione persistente ad alta capacità per immagini personalizzate (IndexedDB + Firestore)
// Evita il superamento del limite di 1MB per singolo documento in Firestore 'main_db'
// e garantisce che le immagini caricate non vadano mai perse né resettate da onSnapshot.

import { doc, collection, setDoc, getDoc } from 'firebase/firestore';

const DB_NAME = 'LifeSkills_ImagesDB';
const DB_VERSION = 1;
const STORE_NAME = 'custom_images';

// Cache in memoria per accesso sincrono immediato nei render React
const memoryCache = new Map();

/**
 * Apre o crea il database IndexedDB
 */
function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB non supportato in questo ambiente'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Salva un'immagine personalizzata in IndexedDB e nella memoria locale
 */
export async function saveCustomImage(id, dataUrl) {
  if (!id || !dataUrl) return;
  memoryCache.set(id, dataUrl);

  // Prova a salvare anche in localStorage una copia di backup per set se piccola
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({ id, dataUrl, updatedAt: Date.now() });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Impossibile salvare immagine in IndexedDB, mantenuta in memory cache:', err);
  }
}

/**
 * Recupera un'immagine personalizzata per ID (prima memoria, poi IndexedDB)
 */
export async function getCustomImage(id) {
  if (!id) return null;
  if (memoryCache.has(id)) {
    return memoryCache.get(id);
  }

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => {
        if (req.result && req.result.dataUrl) {
          memoryCache.set(id, req.result.dataUrl);
          resolve(req.result.dataUrl);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Carica tutte le immagini personalizzate salvate in IndexedDB nella memory cache
 */
export async function loadAllCustomImages() {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const items = req.result || [];
        items.forEach((item) => {
          if (item.id && item.dataUrl) {
            memoryCache.set(item.id, item.dataUrl);
          }
        });
        resolve(memoryCache);
      };
      req.onerror = () => resolve(memoryCache);
    });
  } catch {
    return memoryCache;
  }
}

/**
 * Cancella un'immagine personalizzata da IndexedDB
 */
export async function deleteCustomImage(id) {
  if (!id) return;
  memoryCache.delete(id);
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {}
}

/**
 * Accesso sincrono alla cache in memoria
 */
export function getCachedImage(id) {
  return memoryCache.get(id) || null;
}

/**
 * Ripristina ('idrata') le immagini complete in uno stato visual_metaphors
 * sostituendo i placeholder o thumbnail con i dati completi da IndexedDB.
 */
export function hydrateVisualMetaphors(vmState) {
  if (!vmState) return vmState;

  let hasChanged = false;
  let updatedSets = vmState.sets;

  if (Array.isArray(vmState.sets)) {
    updatedSets = vmState.sets.map((s) => {
      if (!Array.isArray(s.images)) return s;

      let setChanged = false;
      const updatedImages = s.images.map((img) => {
        if (img.customImageId) {
          const cached = memoryCache.get(img.customImageId);
          if (cached && (!img.src || img.src.startsWith('custom:') || img.src === img.thumbnailSrc)) {
            setChanged = true;
            return { ...img, src: cached };
          }
        }
        return img;
      });

      if (setChanged) {
        hasChanged = true;
        return { ...s, images: updatedImages };
      }
      return s;
    });
  }

  // Idratazione set Blob Trees
  let updatedBlobTree = vmState.blobTree;
  if (vmState.blobTree && Array.isArray(vmState.blobTree.sets)) {
    let blobChanged = false;
    const hydratedBlobSets = vmState.blobTree.sets.map((bs) => {
      if (bs.customImageId) {
        const cached = memoryCache.get(bs.customImageId);
        if (cached && (!bs.imageSrc || bs.imageSrc.startsWith('custom:') || bs.imageSrc === bs.thumbnailSrc)) {
          blobChanged = true;
          return { ...bs, imageSrc: cached };
        }
      }
      return bs;
    });
    if (blobChanged) {
      hasChanged = true;
      updatedBlobTree = { ...vmState.blobTree, sets: hydratedBlobSets };
    }
  }

  if (!hasChanged) return vmState;
  return { ...vmState, sets: updatedSets, ...(updatedBlobTree ? { blobTree: updatedBlobTree } : {}) };
}

/**
 * Sanitizza l'intero payload 'data' prima di salvarlo nel documento 'main_db' di Firestore.
 * Sostituisce le enormi stringhe base64 delle immagini caricate con piccoli thumbnail (~3-5KB)
 * o identificatori leggeri 'custom:{id}', evitando il superamento del limite di 1MB di Firestore.
 */
export function sanitizeDataForFirestore(data) {
  if (!data || typeof data !== 'object') return data;
  if (!data.visual_metaphors) return data;

  const vm = data.visual_metaphors;
  let sanitizedSets = vm.sets;

  if (Array.isArray(vm.sets)) {
    sanitizedSets = vm.sets.map((s) => {
      if (!Array.isArray(s.images)) return s;

      const sanitizedImages = s.images.map((img) => {
        // Se l'immagine è personalizzata (ha customImageId o è un dataUrl)
        if (img.customImageId || (img.src && img.src.startsWith('data:image/'))) {
          const customId = img.customImageId || `cimg_${img.id || Date.now()}`;
          
          // Mantieni sempre in memory cache l'immagine ad alta risoluzione
          if (img.src && img.src.startsWith('data:image/')) {
            memoryCache.set(customId, img.src);
            // Salva in background su IndexedDB
            saveCustomImage(customId, img.src).catch(() => {});
          }

          return {
            ...img,
            customImageId: customId,
            // Nel documento Firestore principale salviamo il micro-thumbnail o il riferimento per restare sotto 1MB
            src: img.thumbnailSrc || `custom:${customId}`
          };
        }
        return img;
      });

      return { ...s, images: sanitizedImages };
    });
  }

  let sanitizedBlobTree = vm.blobTree;
  if (vm.blobTree && Array.isArray(vm.blobTree.sets)) {
    const sanitizedBlobSets = vm.blobTree.sets.map((bs) => {
      if (bs.customImageId || (bs.imageSrc && bs.imageSrc.startsWith('data:image/'))) {
        const customId = bs.customImageId || `cimg_blob_${bs.id || Date.now()}`;

        if (bs.imageSrc && bs.imageSrc.startsWith('data:image/')) {
          memoryCache.set(customId, bs.imageSrc);
          saveCustomImage(customId, bs.imageSrc).catch(() => {});
        }

        return {
          ...bs,
          customImageId: customId,
          imageSrc: bs.thumbnailSrc || `custom:${customId}`
        };
      }
      return bs;
    });

    sanitizedBlobTree = {
      ...vm.blobTree,
      sets: sanitizedBlobSets
    };
  }

  return {
    ...data,
    visual_metaphors: {
      ...vm,
      sets: sanitizedSets,
      ...(sanitizedBlobTree ? { blobTree: sanitizedBlobTree } : {})
    }
  };
}

/**
 * Sincronizza una singola immagine personalizzata in una subcollection dedicata di Firestore
 * (un documento per immagine, ~60-120KB ciascuno, ben al di sotto del limite di 1MB).
 */
export async function syncImageToFirestore(db, user, appId, customId, dataUrl) {
  if (!db || !user || !appId || !customId || !dataUrl) return;
  try {
    const docRef = doc(collection(db, 'artifacts', appId, 'public', 'data', 'custom_metaphor_images'), customId);
    await setDoc(docRef, { id: customId, dataUrl, updatedAt: Date.now() });
  } catch (err) {
    console.warn('Sync cloud immagine non riuscito (mantenuta in IndexedDB):', err);
  }
}

/**
 * Tenta di recuperare un'immagine dal cloud se assente in IndexedDB locale
 */
export async function fetchImageFromFirestore(db, appId, customId) {
  if (!db || !appId || !customId) return null;
  try {
    const docRef = doc(collection(db, 'artifacts', appId, 'public', 'data', 'custom_metaphor_images'), customId);
    const snap = await getDoc(docRef);
    if (snap.exists() && snap.data()?.dataUrl) {
      const dataUrl = snap.data().dataUrl;
      memoryCache.set(customId, dataUrl);
      saveCustomImage(customId, dataUrl).catch(() => {});
      return dataUrl;
    }
  } catch (err) {
    console.warn('Recupero cloud immagine non riuscito:', err);
  }
  return null;
}

