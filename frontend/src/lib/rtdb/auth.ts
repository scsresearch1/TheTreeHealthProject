import { signInAnonymously } from 'firebase/auth'
import { ref, set } from 'firebase/database'
import type { UserRole } from '../../types/firestore'
import { getRolePermissions } from '../accessControl'
import { getFirebaseAuth, getRealtimeDb } from '../firebase'

let authPromise: Promise<void> | null = null

function authHelpMessage(err: unknown): string {
  const code = typeof err === 'object' && err && 'code' in err ? String((err as { code: string }).code) : ''
  if (code === 'auth/operation-not-allowed' || code === 'auth/admin-restricted-operation') {
    return 'Enable Anonymous sign-in in Firebase Console → Authentication → Sign-in method'
  }
  if (code === 'auth/invalid-api-key') {
    return 'Invalid VITE_FIREBASE_API_KEY in frontend/.env'
  }
  return err instanceof Error ? err.message : 'Firebase anonymous sign-in failed'
}

export async function ensureFirebaseAuth(): Promise<void> {
  const auth = getFirebaseAuth()
  if (auth.currentUser) return
  if (!authPromise) {
    authPromise = signInAnonymously(auth)
      .then(() => undefined)
      .catch((err) => {
        authPromise = null
        throw new Error(authHelpMessage(err))
      })
  }
  await authPromise
}

/** Register demo role at users/{auth.uid} so RTDB security rules allow reads/writes. */
export async function registerRtdbUserProfile(
  uid: string,
  profile: { email: string; displayName: string; role: UserRole },
) {
  const now = new Date().toISOString()
  await set(ref(getRealtimeDb(), `users/${uid}`), {
    uid,
    email: profile.email,
    displayName: profile.displayName,
    role: profile.role,
    permissions: getRolePermissions(profile.role),
    active: true,
    createdAt: now,
    updatedAt: now,
  })
}
