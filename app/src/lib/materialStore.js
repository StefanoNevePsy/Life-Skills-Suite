import { collection, doc, getDoc, onSnapshot, runTransaction } from 'firebase/firestore';

const same = (a,b) => JSON.stringify(a) === JSON.stringify(b);
// Three-way merge: independent edits survive; conflicting edits never silently win.
export function mergeChanges(base, local, remote, path = '') {
  if (same(base, local)) return remote;
  if (same(base, remote) || same(local, remote)) return local;
  const keyed = v => Array.isArray(v) && v.every(x => x && typeof x === 'object' && x.id != null) && new Set(v.map(x => String(x.id))).size === v.length;
  if (keyed(base) && keyed(local) && keyed(remote)) {
    const map = items => Object.fromEntries(items.map(item => [String(item.id), item]));
    return Object.values(mergeChanges(map(base), map(local), map(remote), path));
  }
  if ([base, local, remote].every(v => v && typeof v === 'object' && !Array.isArray(v))) {
    const result = {};
    for (const key of new Set([...Object.keys(base), ...Object.keys(local), ...Object.keys(remote)])) {
      const value = mergeChanges(base[key], local[key], remote[key], `${path}/${key}`);
      if (value !== undefined) result[key] = value;
    }
    return result;
  }
  throw new Error(`Modifica contemporanea a ${path || 'materiale'}. Ricarica prima di riprovare; la copia locale è conservata.`);
}
const materials = (db, appId) => collection(db, 'workspaces', appId, 'materials');
export function watchMaterials(db, appId, defaults, next, error) {
  let stopped = false, generation = 0;
  const stop = onSnapshot(materials(db, appId), async snap => {
    const current = ++generation;
    if (!snap.empty) {
      next(Object.fromEntries(snap.docs.filter(d => !d.data().deleted).map(d => [d.id, d.data().value])));
      return;
    }
    // Compatibility read only: originals remain untouched. First edit writes v2.
    try {
      const old = await getDoc(doc(db, 'artifacts', appId, 'public', 'data', 'lifeskills', 'main_db'));
      if (!stopped && current === generation) next(old.exists() ? old.data() : defaults);
    } catch (err) { if (!stopped) error(err); }
  }, error);
  return () => { stopped = true; stop(); };
}
export async function saveMaterials(db, appId, local, base) {
  await runTransaction(db, async tx => {
    const keys = [...new Set([...Object.keys(local || {}), ...Object.keys(base || {})])];
    const refs = keys.map(key => doc(materials(db, appId), key));
    const snapshots = await Promise.all(refs.map(ref => tx.get(ref)));
    snapshots.forEach((snap, i) => {
      const key = keys[i];
      if (snap.exists() && same(local[key], base?.[key])) return;
      const remote = snap.exists() ? (snap.data().deleted ? undefined : snap.data().value) : base?.[key];
      const merged = mergeChanges(base?.[key], local[key], remote, key);
      tx.set(refs[i], merged === undefined ? { deleted: true } : { value: merged, deleted: false });
    });
  });
}
