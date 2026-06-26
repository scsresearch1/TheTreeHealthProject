/**
 * Create the default Firestore (Native) database if missing, then seed.
 * Run: node firebase/create-database.mjs
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { createSign } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const sa = JSON.parse(readFileSync(join(__dirname, 'service-account.json'), 'utf8'))
const PROJECT = sa.project_id

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

async function listDatabases(token) {
  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases`,
    { headers: { Authorization: `Bearer ${token}` } },
  )
  const data = await res.json()
  return { ok: res.ok, status: res.status, data }
}

async function createDatabase(token, locationId = 'nam5') {
  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases?databaseId=(default)`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locationId,
        type: 'FIRESTORE_NATIVE',
      }),
    },
  )
  const data = await res.json()
  return { ok: res.ok, status: res.status, data }
}

async function waitForOperation(token, name, maxWaitMs = 120000) {
  const start = Date.now()
  while (Date.now() - start < maxWaitMs) {
    const res = await fetch(`https://firestore.googleapis.com/v1/${name}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const op = await res.json()
    if (op.done) return op
    console.log('  … still creating database')
    await new Promise((r) => setTimeout(r, 5000))
  }
  throw new Error('Timed out waiting for database creation')
}

async function main() {
  console.log('Project:', PROJECT)
  const token = await getAccessToken()

  const existing = await listDatabases(token)
  if (existing.ok && existing.data.databases?.length) {
    console.log('✓ Firestore database already exists:', existing.data.databases.map((d) => d.name).join(', '))
  } else {
    console.log('No Firestore database found. Creating (default) in nam5 …')
    const created = await createDatabase(token)
    if (!created.ok && created.status !== 409) {
      console.error('Create failed:', created.status, JSON.stringify(created.data, null, 2))
      process.exit(1)
    }
    if (created.data.name) {
      console.log('Waiting for operation:', created.data.name)
      await waitForOperation(token, created.data.name)
    }
    console.log('✓ Firestore database created')
  }

  console.log('\nRunning seed …\n')
  await import('./seed-schema.mjs')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
