import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { getFirebaseAuth } from '../firebase'

function authHelpMessage(err: unknown): string {
  const code = typeof err === 'object' && err && 'code' in err ? String((err as { code: string }).code) : ''
  if (code === 'auth/operation-not-allowed') {
    return 'Enable Email/Password sign-in in Firebase Console → Authentication → Sign-in method'
  }
  if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
    return 'Firebase Auth user missing. Run: npm run create:auth-users'
  }
  if (code === 'auth/invalid-api-key') {
    return 'Invalid VITE_FIREBASE_API_KEY in frontend/.env'
  }
  return err instanceof Error ? err.message : 'Firebase sign-in failed'
}

/** Sign in with demo email/password — Firebase uid matches RTDB seed users (seed-admin, etc.). */
export async function signInFirebaseDemoUser(email: string, password: string): Promise<string> {
  const auth = getFirebaseAuth()
  const cred = await signInWithEmailAndPassword(auth, email.trim(), password).catch((err) => {
    throw new Error(authHelpMessage(err))
  })
  return cred.user.uid
}

export async function signOutFirebase() {
  await signOut(getFirebaseAuth())
}
