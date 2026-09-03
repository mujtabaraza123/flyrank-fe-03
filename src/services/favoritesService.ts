import { firestore, isFirebaseConfigured } from './firebaseClient'
import { collection, doc, setDoc, deleteDoc, getDocs, serverTimestamp } from 'firebase/firestore'

// Favorites service: simple Firestore-backed per-user favorites
// Collection layout suggestion (not yet enforced):
// users/{uid}/favorites/{imdbID} -> { addedAt: Timestamp }

export async function addFavoriteForUser(uid: string, imdbID: string): Promise<void> {
  if (!isFirebaseConfigured || !firestore) throw new Error('Firebase is not configured')
  if (!uid) throw new Error('User id required')
  if (!imdbID) throw new Error('Movie id required')

  const favDoc = doc(firestore, 'users', uid, 'favorites', imdbID)
  await setDoc(favDoc, { addedAt: serverTimestamp() })
}

export async function removeFavoriteForUser(uid: string, imdbID: string): Promise<void> {
  if (!isFirebaseConfigured || !firestore) throw new Error('Firebase is not configured')
  if (!uid) throw new Error('User id required')
  if (!imdbID) throw new Error('Movie id required')

  const favDoc = doc(firestore, 'users', uid, 'favorites', imdbID)
  await deleteDoc(favDoc)
}

export async function listFavoriteIdsForUser(uid: string): Promise<string[]> {
  if (!isFirebaseConfigured || !firestore) return []
  if (!uid) return []
  const favCol = collection(firestore, 'users', uid, 'favorites')
  const snapshot = await getDocs(favCol)
  const ids: string[] = []
  snapshot.forEach((d) => ids.push(d.id))
  return ids
}

// Note: This file provides the Firestore-backed implementation surface.
// The app should call these from hooks that handle auth state (not implemented yet).
