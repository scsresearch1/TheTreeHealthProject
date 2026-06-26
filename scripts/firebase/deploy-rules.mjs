/**
 * Deploy Realtime Database security rules.
 * Run: node firebase/deploy-rules.mjs
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { createSign } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const sa = JSON.parse(readFileSync(join(__dirname, 'service-account.json'), 'utf8'))
const rules = JSON.parse(readFileSync(join(__dirname, '../../firebase/database.rules.json'), 'utf8'))

const DATABASE_URL =
  process.env.FIREBASE_DATABASE_URL ??
  `https://${sa.project_id}-default-rtdb.asia-southeast1.firebasedatabase.app`

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000)
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
  const claim = Buffer.from(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/firebase.database https://www.googleapis.com/auth/userinfo.email',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })).toString('base64url')
  const sign = createSign('RSA-SHA256')
  sign.update(`${header}.${claim}`)
  const signature = sign.sign(sa.private_key, 'base64url')
  const jwt = `${header}.${claim}.${signature}`

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  })
  const data = await res.json()
  if (!data.access_token) throw new Error('Token failed: ' + JSON.stringify(data))
  return data.access_token
}

async function deployRules(token) {
  const url = `${DATABASE_URL}/.settings/rules.json?access_token=${token}`
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rules),
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`Deploy failed (${res.status}): ${text}`)
  return text
}

async function main() {
  console.log('Deploying Realtime Database rules to:', DATABASE_URL)
  const token = await getAccessToken()
  await deployRules(token)
  console.log('✅ Rules deployed successfully')
}

main().catch((err) => {
  console.error('Deploy failed:', err)
  process.exit(1)
})
