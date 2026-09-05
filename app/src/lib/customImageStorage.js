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
 * Cancella un'immagine personalizzata da IndexedDB e memoria
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
 * Assicura che un'immagine custom sia caricata in memoryCache,
 * cercando in ordine: 1) memoryCache, 2) IndexedDB, 3) Firestore subcollection
 */
export async function ensureImageLoaded(customId, db, appId) {
  if (!customId) return null;
  if (memoryCache.has(customId)) {
    return memoryCache.get(customId);
  }

  // 1. Prova IndexedDB locale
  const localData = await getCustomImage(customId);
  if (localData) {
    memoryCache.set(customId, localData);
    return localData;
  }

  // 2. Se non presente in locale e Firebase è connesso, scarica dal Cloud
  if (db && appId) {
    const cloudData = await fetchImageFromFirestore(db, appId, customId);
    if (cloudData) {
      memoryCache.set(customId, cloudData);
      saveCustomImage(customId, cloudData).catch(() => {});
      return cloudData;
    }
  }

  return null;
}

/**
 * Risolve la sorgente visiva ottimale per un'immagine (Fotolinguaggio).
 * Garantisce che un riferimento 'custom:...' non venga MAI passato grezzo a <img src>,
 * restituendo il dataUrl reale dalla cache o il percorso statico valido.
 */
export function resolveImageSrc(img) {
  if (!img) return '';

  // 1. Se ha customImageId ed è presente in memoryCache
  if (img.customImageId) {
    const cached = memoryCache.get(img.customImageId);
    if (cached) return cached;
  }

  // 2. Se src è una stringa valida (data:, http:, https:, percorsi relativi o blob:)
  if (typeof img.src === 'string' && img.src && !img.src.startsWith('custom:')) {
    return img.src;
  }

  // 3. Fallback a thumbnailSrc se valido e non 'custom:'
  if (typeof img.thumbnailSrc === 'string' && img.thumbnailSrc && !img.thumbnailSrc.startsWith('custom:')) {
    return img.thumbnailSrc;
  }

  return '';
}

/**
 * Risolve la sorgente visiva ottimale per uno scenario Blob Tree.
 */
export function resolveBlobImageSrc(scenario) {
  if (!scenario) return '';

  if (scenario.customImageId) {
    const cached = memoryCache.get(scenario.customImageId);
    if (cached) return cached;
  }

  if (typeof scenario.imageSrc === 'string' && scenario.imageSrc && !scenario.imageSrc.startsWith('custom:')) {
    return scenario.imageSrc;
  }

  if (typeof scenario.thumbnailSrc === 'string' && scenario.thumbnailSrc && !scenario.thumbnailSrc.startsWith('custom:')) {
    return scenario.thumbnailSrc;
  }

  return '';
}

/**
 * Ripristina ('idrata') le immagini complete in uno stato visual_metaphors
 * sostituendo i riferimenti 'custom:{id}' con le immagini complete in memoria.
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
          if (cached && (!img.src || img.src.startsWith('custom:') || img.src !== cached)) {
            setChanged = true;
            return { ...img, src: cached, thumbnailSrc: cached };
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
        if (cached && (!bs.imageSrc || bs.imageSrc.startsWith('custom:') || bs.imageSrc !== cached)) {
          blobChanged = true;
          return { ...bs, imageSrc: cached, thumbnailSrc: cached };
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
 * Sostituisce TOTALMENTE le stringhe base64 delle immagini caricate con identificatori leggeri 'custom:{id}',
 * evitando al 100% il superamento del limite di 1MB di Firestore (payload di soli pochi KB).
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
        // Se l'immagine è personalizzata (ha customImageId o è un dataUrl base64)
        if (img.customImageId || (typeof img.src === 'string' && img.src.startsWith('data:image/'))) {
          const customId = img.customImageId || `cimg_${img.id || Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
          
          // Mantieni sempre in memory cache l'immagine ad alta risoluzione
          if (typeof img.src === 'string' && img.src.startsWith('data:image/')) {
            memoryCache.set(customId, img.src);
            saveCustomImage(customId, img.src).catch(() => {});
          }

          return {
            id: img.id,
            number: img.number,
            title: img.title || `Immagine #${img.number || img.id || 1}`,
            alt: img.alt || `Immagine #${img.number || img.id || 1}`,
            hidden: Boolean(img.hidden),
            customImageId: customId,
            src: `custom:${customId}`,
            thumbnailSrc: null
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
      if (bs.customImageId || (typeof bs.imageSrc === 'string' && bs.imageSrc.startsWith('data:image/'))) {
        const customId = bs.customImageId || `cimg_blob_${bs.id || Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

        if (typeof bs.imageSrc === 'string' && bs.imageSrc.startsWith('data:image/')) {
          memoryCache.set(customId, bs.imageSrc);
          saveCustomImage(customId, bs.imageSrc).catch(() => {});
        }

        return {
          id: bs.id,
          title: bs.title || '',
          subtitle: bs.subtitle || '',
          description: bs.description || '',
          customImageId: customId,
          imageSrc: `custom:${customId}`,
          thumbnailSrc: null
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

/**
 * Crea un micro-thumbnail leggero (~3-5KB) da un dataUrl in base64
 */
export function createThumbnail(dataUrl, maxDim = 180) {
  return new Promise((resolve) => {
    if (!dataUrl) return resolve(null);
    if (typeof window === 'undefined' || typeof document === 'undefined') return resolve(dataUrl);

    const img = new Image();
    img.onload = () => {
      let tw = img.width;
      let th = img.height;
      if (tw > maxDim || th > maxDim) {
        if (tw > th) {
          th = Math.round((th * maxDim) / tw);
          tw = maxDim;
        } else {
          tw = Math.round((tw * maxDim) / th);
          th = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = tw;
      canvas.height = th;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, tw, th);
      try {
        resolve(canvas.toDataURL('image/webp', 0.5));
      } catch {
        try {
          resolve(canvas.toDataURL('image/jpeg', 0.5));
        } catch {
          resolve(dataUrl);
        }
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
