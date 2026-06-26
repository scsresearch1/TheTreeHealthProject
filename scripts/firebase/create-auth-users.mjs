/**
 * Create Firebase Auth users with fixed UIDs matching RTDB seed (seed-admin, etc.).
 * Run once: npm run create:auth-users
 * Requires Email/Password enabled in Firebase Console.
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import admin from 'firebase-admin'

const __dirname = dirname(fileURLToPath(import.meta.url))
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, 'service-account.json'), 'utf8'),
)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const DEMO_USERS = [
  { uid: 'seed-admin', email: 'admin@tthp.local', password: 'admin123', displayName: 'System Admin' },
  { uid: 'seed-management', email: 'manager@tthp.local', password: 'manager123', displayName: 'Ops Manager' },
  { uid: 'seed-field', email: 'field@tthp.local', password: 'field123', displayName: 'Field & Operations' },
]

async function upsertAuthUser(user) {
  try {
    await admin.auth().createUser({
      uid: user.uid,
      email: user.email,
      password: user.password,
      displayName: user.displayName,
      emailVerified: true,
    })
    console.log(`  created ${user.uid} (${user.email})`)
  } catch (err) {
    const code = err && typeof err === 'object' && 'code' in err ? String(err.code) : ''
    if (code === 'auth/uid-already-exists' || code === 'auth/email-already-exists') {
      await admin.auth().updateUser(user.uid, {
        email: user.email,
        password: user.password,
        displayName: user.displayName,
        emailVerified: true,
      })
      console.log(`  updated ${user.uid} (${user.email})`)
      return
    }
    throw err
  }
}

async function main() {
  console.log('Creating Firebase Auth users for project:', serviceAccount.project_id)
  for (const user of DEMO_USERS) {
    await upsertAuthUser(user)
  }
  console.log('✅ Auth users ready — UIDs match RTDB seed (seed-admin, seed-management, seed-field)')
}

main().catch((err) => {
  console.error('❌ Failed:', err.message ?? err)
  process.exit(1)
})
