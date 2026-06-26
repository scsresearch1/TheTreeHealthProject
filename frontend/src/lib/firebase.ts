import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getDatabase, type Database } from 'firebase/database'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

function envString(key: string): string | undefined {
  const value = import.meta.env[key]
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

export const isFirebaseConfigured = Boolean(envString('VITE_FIREBASE_API_KEY'))

/** @deprecated use isFirebaseConfigured */
export const isFirestoreConfigured = isFirebaseConfigured

let firebaseApp: FirebaseApp | null = null
let auth: Auth | null = null
let rtdb: Database | null = null
let storage: FirebaseStorage | null = null

function firebaseConfig() {
  const apiKey = envString('VITE_FIREBASE_API_KEY')
  if (!apiKey) return null
  return {
    apiKey,
    authDomain: envString('VITE_FIREBASE_AUTH_DOMAIN') ?? 'tthp-ec0a9.firebaseapp.com',
    databaseURL:
      envString('VITE_FIREBASE_DATABASE_URL')
      ?? 'https://tthp-ec0a9-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: envString('VITE_FIREBASE_PROJECT_ID') ?? 'tthp-ec0a9',
    storageBucket: envString('VITE_FIREBASE_STORAGE_BUCKET') ?? 'tthp-ec0a9.firebasestorage.app',
    messagingSenderId: envString('VITE_FIREBASE_MESSAGING_SENDER_ID') ?? '',
    appId: envString('VITE_FIREBASE_APP_ID') ?? '',
  }
}

export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Add VITE_FIREBASE_* vars to frontend/.env')
  }
  if (!firebaseApp) {
    firebaseApp = initializeApp(firebaseConfig()!)
  }
  return firebaseApp
}

export function getFirebaseAuth(): Auth {
  if (!auth) auth = getAuth(getFirebaseApp())
  return auth
}

export function getRealtimeDb(): Database {
  if (!rtdb) rtdb = getDatabase(getFirebaseApp())
  return rtdb
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!storage) storage = getStorage(getFirebaseApp())
  return storage
}
