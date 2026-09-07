// Compatibility boundary: existing views keep their UI model; Firestore stores
// session configuration and private individual answers in separate documents.
import * as fs from 'firebase/firestore';
import { activeDatabase, activeUser, studentMode } from './cloudIdentity';
import { ensureImageLoaded, syncImageToFirestore, optimizeCloudImage } from './customImageStorage';
export { doc, collection, getFirestore } from 'firebase/firestore';
export const arrayUnion = (...values) => ({ __appendResponses: values });
const isSession = ref => ref.path.includes('/feedback_sessions/');
const target = ref => fs.doc(activeDatabase() || ref.firestore, 'sessions', ref.id);
const replyCollection = ref => fs.collection(target(ref), 'answers');
const snapshots = new Map();
const clean = value => JSON.parse(JSON.stringify(value));
export async function setDoc(ref, data, options) {
  if (!isSession(ref)) return fs.setDoc(ref, data, options);
  const session = clean(data);
  delete session.participants; delete session.responses;
  session.schemaVersion = 2;
  session.appId = ref.path.split('/')[1];
  session.ownerUid = activeUser().uid;
  session.expiresAt = fs.Timestamp.fromMillis(Date.now() + 24 * 60 * 60 * 1000);
  session.imageIds = [];
  if (session.images) session.allowedImageIds = session.images.map(image => image.id);
  const images = session.images || (session.customImageId ? [session] : []);
  const copies = [];
  for (const item of images) {
    if (!item.customImageId) continue;
    const bytes = await ensureImageLoaded(item.customImageId, ref.firestore, session.appId);
    if (!bytes) throw new Error('Immagine non disponibile: ricaricala prima di avviare la sessione.');
    await syncImageToFirestore(ref.firestore, activeUser(), session.appId, item.customImageId, bytes);
    session.imageIds.push(item.customImageId);
    copies.push([item.customImageId, await optimizeCloudImage(bytes)]);
    if (item.src) item.src = `custom:${item.customImageId}`;
    if (item.imageSrc) item.imageSrc = `custom:${item.customImageId}`;
  }
  await fs.runTransaction(target(ref).firestore, async tx => {
    const existing = await tx.get(target(ref));
    if (existing.exists()) throw new Error('Codice già utilizzato. Riprova ad avviare la sessione.');
    tx.set(target(ref), { ...session, active: false });
  });
  for (const [id, dataUrl] of copies) await fs.setDoc(fs.doc(target(ref), 'images', id), { dataUrl });
  await fs.updateDoc(target(ref), { active: session.active });
}
function answerData(snapshot) {
  return { ...snapshot.data(), _answerId: snapshot.id };
}
function combined(meta, answers) {
  return { ...meta, active: meta.active && meta.expiresAt.toMillis() > Date.now(), participants: Object.fromEntries(answers.filter(a => a.kind === 'participant').map(a => [a.uid, a])), responses: answers.filter(a => a.kind === 'response').sort((a,b) => String(a.timestamp).localeCompare(String(b.timestamp))) };
}
function answerQuery(ref) {
  return studentMode() ? fs.query(replyCollection(ref), fs.where('uid', '==', activeUser().uid)) : replyCollection(ref);
}
export function onSnapshot(ref, next, error = err => { console.error(err); window.dispatchEvent(new CustomEvent('lss-cloud-error', { detail: 'Accesso o sincronizzazione non riusciti. Verifica connessione e autorizzazioni.' })); }) {
  if (!isSession(ref)) return fs.onSnapshot(ref, next, error);
  let meta, answers = [], stopped = false, expiryTimer;
  const publish = () => {
    if (!meta || stopped) return;
    const value = combined(meta, answers);
    snapshots.set(ref.id, value);
    next({ exists: () => true, data: () => value });
  };
  const stopMeta = fs.onSnapshot(target(ref), snap => {
    if (!snap.exists()) { next({ exists: () => false }); return; }
    meta = snap.data();
    clearTimeout(expiryTimer);
    const remaining = meta.expiresAt.toMillis() - Date.now();
    if (remaining > 0) expiryTimer = setTimeout(publish, Math.min(remaining + 50, 2147483647));
    publish();
  }, error);
  const stopAnswers = fs.onSnapshot(answerQuery(ref), snap => { answers = snap.docs.map(answerData); publish(); }, error);
  return () => { stopped = true; clearTimeout(expiryTimer); stopMeta(); stopAnswers(); snapshots.delete(ref.id); };
}
export async function getDoc(ref) {
  if (!isSession(ref)) return fs.getDoc(ref);
  const meta = await fs.getDoc(target(ref));
  if (!meta.exists()) return meta;
  const answers = await fs.getDocs(answerQuery(ref));
  const data = combined(meta.data(), answers.docs.map(answerData));
  snapshots.set(ref.id, data);
  return { exists: () => true, data: () => data };
}
export async function updateDoc(ref, update) {
  if (!isSession(ref)) return fs.updateDoc(ref, update);
  const uid = activeUser().uid;
  const participant = Object.entries(update).find(([key]) => key.startsWith('participants.'));
  if (participant) {
    return fs.setDoc(fs.doc(replyCollection(ref), uid), { ...clean(participant[1]), uid, kind: 'participant', savedAt: fs.serverTimestamp() });
  }
  if (update.responses?.__appendResponses) {
    const meta = (await fs.getDoc(target(ref))).data();
    for (const response of update.responses.__appendResponses) {
      const id = studentMode() && !meta.allowMultipleResponses ? uid : crypto.randomUUID();
      const status = studentMode() ? (meta.moderationEnabled ? 'pending' : 'visible') : response.status || 'visible';
      await fs.setDoc(fs.doc(replyCollection(ref), id), { ...clean(response), status, visible: status === 'visible', uid, kind: 'response', savedAt: fs.serverTimestamp() });
    }
    return;
  }
  if (Array.isArray(update.responses)) throw new Error('Le risposte devono essere modificate singolarmente.');
  return fs.updateDoc(target(ref), update);
}

export async function updateAnswer(ref, id, changes) {
  if (!id) throw new Error('Risposta non disponibile. Ricarica la sessione.');
  return fs.updateDoc(fs.doc(replyCollection(ref), id), changes);
}
export async function deleteAnswer(ref, id) {
  if (!id) throw new Error('Risposta non disponibile. Ricarica la sessione.');
  return fs.deleteDoc(fs.doc(replyCollection(ref), id));
}
