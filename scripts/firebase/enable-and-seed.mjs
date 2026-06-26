/**
 * Enable Firestore API then seed — run: node firebase/enable-and-seed.mjs
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { createSign } from 'crypto'
import admin from 'firebase-admin'

const __dirname = dirname(fileURLToPath(import.meta.url))
const sa = JSON.parse(readFileSync(join(__dirname, 'service-account.json'), 'utf8'))

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000)
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
  const claim = Buffer.from(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
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

async function enableFirestoreApi(token) {
  const url = `https://serviceusage.googleapis.com/v1/projects/${sa.project_id}/services/firestore.googleapis.com:enable`
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  })
  const text = await res.text()
  console.log('Enable API response:', res.status, text.slice(0, 200))
  return res.ok || res.status === 409
}

async function main() {
  console.log('Getting access token...')
  const token = await getAccessToken()
  console.log('Enabling Firestore API...')
  await enableFirestoreApi(token)
  console.log('Waiting 30s for API propagation...')
  await new Promise((r) => setTimeout(r, 30000))

  // Dynamic import seed
  console.log('Running seed...')
  await import('./seed-schema.mjs')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
