import { signInAnonymously } from 'firebase/auth'
import { getFirebaseAuth } from '../firebase'

let authPromise: Promise<void> | null = null

export async function ensureFirebaseAuth() {
  const auth = getFirebaseAuth()
  if (auth.currentUser) return
  if (!authPromise) {
    authPromise = signInAnonymously(auth).then(() => undefined).catch((err) => {
      authPromise = null
      throw err
    })
  }
  await authPromise
}
