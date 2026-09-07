import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, doc, getDoc } from 'firebase/firestore';
import { getAuth, connectAuthEmulator, setPersistence, browserLocalPersistence, browserSessionPersistence, signInWithEmailAndPassword, signInAnonymously, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFBConfig } from './firebaseConfig';

let teacher, student, active, authorized = false;
const subscribers = new Set();
const emit = () => subscribers.forEach(fn => fn(active?.auth.currentUser || null));
function backend(name, config) {
  const app = getApps().find(a => a.name === name) || initializeApp(config, name);
  const result = { auth: getAuth(app), db: getFirestore(app) };
  if (import.meta.env.VITE_USE_EMULATORS === 'true' && config.projectId.startsWith('demo-')) {
    connectAuthEmulator(result.auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(result.db, '127.0.0.1', 8080);
  }
  return result;
}
export function initIdentity() {
  if (teacher) return teacher;
  const config = getFBConfig();
  if (!config.apiKey) return null;
  teacher = backend('lss-teacher', config);
  student = backend('lss-student', config);
  active = new URLSearchParams(location.search).has('session') && !new URLSearchParams(location.search).has('mode') ? student : teacher;
  onAuthStateChanged(teacher.auth, async user => {
    authorized = false;
    if (user && !user.isAnonymous) {
      try { authorized = (await getDoc(doc(teacher.db, 'teachers', user.uid))).data()?.enabled === true; } catch {}
    }
    emit();
  });
  return teacher;
}
export const isCloudTeacher = () => active === teacher && authorized;
export const cloudConfigured = () => Boolean(teacher);
export const activeDatabase = () => active?.db;
export const activeUser = () => active?.auth.currentUser;
export const studentMode = () => active === student;
export function watchIdentity(fn) { subscribers.add(fn); fn(activeUser()); return () => subscribers.delete(fn); }
export async function enterStudent(fresh = false) {
  if (!student) return null;
  active = student;
  await setPersistence(student.auth, browserSessionPersistence);
  await student.auth.authStateReady();
  if (fresh && student.auth.currentUser) await signOut(student.auth);
  if (!student.auth.currentUser) await signInAnonymously(student.auth);
  emit();
  return student.auth.currentUser;
}
export async function teacherLogin(email, password, remember) {
  if (!teacher) throw new Error('Configura Firebase prima di accedere.');
  await setPersistence(teacher.auth, remember ? browserLocalPersistence : browserSessionPersistence);
  const result = await signInWithEmailAndPassword(teacher.auth, email.trim(), password);
  const permission = await getDoc(doc(teacher.db, 'teachers', result.user.uid));
  if (permission.data()?.enabled !== true) {
    await signOut(teacher.auth);
    throw new Error('Account non abilitato. Chiedi al responsabile di attivarlo.');
  }
  active = teacher;
  authorized = true;
  emit();
}
export async function cloudLogout() {
  authorized = false;
  localStorage.removeItem('lss_main_db_backup');
  if (teacher) await signOut(teacher.auth);
  if (student) await signOut(student.auth);
  active = student || teacher;
  emit();
}
