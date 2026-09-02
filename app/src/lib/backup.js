// Backup completo dei dati come archivio ZIP.
//
// Ogni categoria diventa un file JSON. Le immagini del termometro non stanno
// nel JSON ma in images/<emozione>_<livello>.b64, così l'archivio resta
// leggibile e le immagini non gonfiano i dati sincronizzati.
//
// JSZip arriva dallo script CDN in index.html.

import { etLoadImages, etSaveImages, etStripImages } from './thermometerStorage';

const IMAGE_DIR = 'images/';
const IMAGE_EXT = '.b64';

export async function exportBackupZip(fullData) {
  if (typeof JSZip === 'undefined') {
    alert('Libreria ZIP non disponibile.');
    return;
  }

  const zip = new JSZip();

  for (const cat of Object.keys(fullData)) {
    if (cat === 'emotion_thermometer' && Array.isArray(fullData[cat])) {
      // Le immagini vanno recuperate da IndexedDB e messe in file separati.
      const withImages = await etLoadImages(fullData[cat]);
      const cleaned = withImages.map((emo) => ({
        ...emo,
        levels: emo.levels.map(({ image, ...rest }) => rest),
      }));
      zip.file(cat + '.json', JSON.stringify(cleaned, null, 2));

      for (const emo of withImages) {
        emo.levels.forEach((level, li) => {
          if (level && level.image) zip.file(`${IMAGE_DIR}${emo.id}_${li}${IMAGE_EXT}`, level.image);
        });
      }
    } else {
      zip.file(cat + '.json', JSON.stringify(fullData[cat], null, 2));
    }
  }

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'life_skills_backup_' + new Date().toISOString().slice(0, 10) + '.zip';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/**
 * Legge un archivio ZIP e ricompone i dati, riagganciando le immagini del
 * termometro e salvandole in IndexedDB.
 * Restituisce la versione senza immagini, adatta alla sincronizzazione.
 */
export async function importBackupZip(file) {
  const zip = await JSZip.loadAsync(file);
  const result = {};
  const images = {};

  for (const [name, entry] of Object.entries(zip.files)) {
    if (entry.dir) continue;

    if (name.startsWith(IMAGE_DIR) && name.endsWith(IMAGE_EXT)) {
      images[name.replace(IMAGE_DIR, '').replace(IMAGE_EXT, '')] = await entry.async('string');
    } else if (name.endsWith('.json')) {
      result[name.replace('.json', '')] = JSON.parse(await entry.async('string'));
    }
  }

  if (result.emotion_thermometer && Object.keys(images).length > 0) {
    result.emotion_thermometer = result.emotion_thermometer.map((emo) => ({
      ...emo,
      levels: emo.levels.map((level, li) => {
        const key = `${emo.id}_${li}`;
        return images[key] ? { ...level, image: images[key] } : level;
      }),
    }));
  }

  if (result.emotion_thermometer) {
    await etSaveImages(result.emotion_thermometer);
    return { ...result, emotion_thermometer: etStripImages(result.emotion_thermometer) };
  }

  return result;
}
