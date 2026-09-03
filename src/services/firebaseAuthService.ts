import { firebaseAuth, isFirebaseConfigured } from './firebaseClient'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'

export function subscribeToAuthChanges(callback: (user: User | null) => void) {
  if (!isFirebaseConfigured || !firebaseAuth) {
    // If Firebase is not configured, call the callback with null asynchronously and return a noop unsubscribe
    setTimeout(() => callback(null), 0)
    return () => {
      /* noop */
    }
  }

  return onAuthStateChanged(firebaseAuth, callback)
}

export async function registerWithEmail(email: string, password: string) {
  if (!isFirebaseConfigured || !firebaseAuth) throw new Error('Firebase is not configured')
  if (!email || !password) throw new Error('Email and password are required')
  const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password)
  return cred.user
}

export async function loginWithEmail(email: string, password: string) {
  if (!isFirebaseConfigured || !firebaseAuth) throw new Error('Firebase is not configured')
  if (!email || !password) throw new Error('Email and password are required')
  const cred = await signInWithEmailAndPassword(firebaseAuth, email, password)
  return cred.user
}

export async function logout() {
  if (!isFirebaseConfigured || !firebaseAuth) throw new Error('Firebase is not configured')
  await signOut(firebaseAuth)
}
