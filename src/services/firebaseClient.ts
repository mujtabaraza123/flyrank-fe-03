import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase configuration is read from Vite env variables.
// Required env vars (example names):
// VITE_FIREBASE_API_KEY
// VITE_FIREBASE_AUTH_DOMAIN
// VITE_FIREBASE_PROJECT_ID
// VITE_FIREBASE_STORAGE_BUCKET
// VITE_FIREBASE_MESSAGING_SENDER_ID
// VITE_FIREBASE_APP_ID
// (optional) VITE_FIREBASE_MEASUREMENT_ID

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Detect minimal required config
const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.appId && firebaseConfig.projectId)

// Initialize Firebase app only once when configuration appears valid
if (isFirebaseConfigured) {
  try {
    if (!getApps().length) {
      initializeApp(firebaseConfig)
    }
  } catch (err) {
    // Do not throw during module evaluation — log and fall back to disabled mode
    // eslint-disable-next-line no-console
    console.error('Failed to initialize Firebase:', err)
  }
}

// Export auth and firestore instances for the rest of the app to use when configured
let firebaseAuth: ReturnType<typeof getAuth> | null = null
let firestore: ReturnType<typeof getFirestore> | null = null

if (isFirebaseConfigured) {
  try {
    firebaseAuth = getAuth()
    firestore = getFirestore()
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize Firebase services:', err)
    firebaseAuth = null
    firestore = null
  }
}

export { isFirebaseConfigured }
export { firebaseAuth, firestore }
