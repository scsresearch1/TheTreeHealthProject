/**
 * Seeds Cloud Firestore from dataset.mjs using the admin service account.
 * Usage: cd scripts && npm install --strict-ssl=false && npm run seed:firestore
 */
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import admin from 'firebase-admin'
import { buildDataset } from './dataset.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, 'service-account.json'), 'utf8'),
)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const firestore = admin.firestore()
const BATCH_SIZE = 400

const COLLECTION_KEYS = {
  users: 'uid',
  trees: 'treeId',
  zones: 'id',
  soil_readings: 'id',
  images: 'id',
  disease_records: 'id',
  pest_records: 'id',
  growth_records: 'id',
  recommendations: 'id',
  maintenance_tasks: 'id',
  alerts: 'id',
  notifications: 'id',
  activity_logs: 'id',
  audit_trail: 'id',
  reports: 'id',
}

async function writeBatch(collectionName, items, idField) {
  if (!items?.length) return 0

  let written = 0
  let batch = firestore.batch()
  let ops = 0

  for (const item of items) {
    const docId = idField && item[idField] != null
      ? String(item[idField])
      : item.id != null
        ? String(item.id)
        : firestore.collection(collectionName).doc().id

    const { id: _id, ...data } = item
    batch.set(firestore.collection(collectionName).doc(docId), data, { merge: true })
    ops++
    written++

    if (ops >= BATCH_SIZE) {
      await batch.commit()
      batch = firestore.batch()
      ops = 0
    }
  }

  if (ops > 0) await batch.commit()
  return written
}

async function seed() {
  console.log('Seeding Firestore for project:', serviceAccount.project_id)

  const dataset = buildDataset()

  for (const [collection, idField] of Object.entries(COLLECTION_KEYS)) {
    const items = dataset[collection]
    if (!items) continue
    const count = await writeBatch(collection, items, idField)
    console.log(`  ${collection}: ${count} documents`)
  }

  if (dataset.config) {
    for (const [docId, docData] of Object.entries(dataset.config)) {
      await firestore.collection('config').doc(docId).set(docData, { merge: true })
    }
    console.log(`  config: ${Object.keys(dataset.config).length} documents`)
  }

  await firestore.collection('_schema').doc('metadata').set(dataset._schema, { merge: true })
  console.log('✅ Firestore seed complete')
}

seed().catch((err) => {
  console.error('❌ Firestore seed failed:', err.message ?? err)
  process.exit(1)
})
