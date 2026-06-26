/**
 * Seeds Firebase Realtime Database from dataset.mjs.
 * Usage: cd scripts && npm install --strict-ssl=false && npm run seed:firebase
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import admin from 'firebase-admin'
import { buildDataset } from './dataset.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, 'service-account.json'), 'utf8'),
)

const DATABASE_URL =
  process.env.FIREBASE_DATABASE_URL ??
  `https://${serviceAccount.project_id}-default-rtdb.asia-southeast1.firebasedatabase.app`

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: DATABASE_URL,
})

const db = admin.database()

const COLLECTION_META = {
  users: { description: 'User profiles with role & permissions', pk: 'uid' },
  trees: { description: 'Tree inventory', pk: 'treeId' },
  zones: { description: 'GIS zones/blocks', pk: 'id' },
  soil_readings: { description: 'Soil samples', pk: 'auto-id' },
  images: { description: 'Image metadata — URLs in object storage', pk: 'auto-id' },
  disease_records: { description: 'Disease detections', pk: 'auto-id' },
  pest_records: { description: 'Pest detections', pk: 'auto-id' },
  growth_records: { description: 'Growth measurements', pk: 'auto-id' },
  recommendations: { description: 'Remedial recommendations', pk: 'auto-id' },
  maintenance_tasks: { description: 'Maintenance workflow', pk: 'auto-id' },
  alerts: { description: 'Operational alerts', pk: 'auto-id' },
  notifications: { description: 'In-app notifications', pk: 'auto-id' },
  activity_logs: { description: 'Activity log', pk: 'auto-id' },
  audit_trail: { description: 'Audit trail', pk: 'auto-id' },
  reports: { description: 'Report metadata', pk: 'auto-id' },
  config: { description: 'Admin config docs', pk: 'doc-id' },
}

function toMap(items, keyField) {
  const map = {}
  for (const item of items) {
    const key = keyField && item[keyField] != null ? String(item[keyField]) : db.ref().push().key
    const { id: _id, ...data } = item
    map[key] = data
  }
  return map
}

async function seed() {
  console.log('Seeding Realtime Database for project:', serviceAccount.project_id)
  console.log('Database URL:', DATABASE_URL)

  const dataset = buildDataset()
  const now = new Date().toISOString()

  const payload = {
    _schema: {
      version: dataset._schema.version,
      updatedAt: now,
      projectId: dataset._schema.projectId,
      database: 'realtime',
      databaseURL: DATABASE_URL,
      collections: COLLECTION_META,
    },
    zones: toMap(dataset.zones, 'id'),
    users: toMap(dataset.users, 'uid'),
    trees: toMap(dataset.trees, 'treeId'),
    soil_readings: toMap(dataset.soil_readings),
    images: toMap(dataset.images),
    disease_records: toMap(dataset.disease_records),
    pest_records: toMap(dataset.pest_records),
    growth_records: toMap(dataset.growth_records),
    recommendations: toMap(dataset.recommendations),
    maintenance_tasks: toMap(dataset.maintenance_tasks),
    alerts: toMap(dataset.alerts),
    notifications: toMap(dataset.notifications),
    activity_logs: toMap(dataset.activity_logs),
    audit_trail: toMap(dataset.audit_trail),
    reports: toMap(dataset.reports),
    config: dataset.config,
  }

  await db.ref('/').set(payload)

  console.log('✓ _schema')
  console.log(`✓ zones (${dataset.zones.length})`)
  console.log(`✓ users (${dataset.users.length})`)
  console.log(`✓ trees (${dataset.trees.length})`)
  console.log(`✓ soil_readings (${dataset.soil_readings.length})`)
  console.log(`✓ images (${dataset.images.length})`)
  console.log(`✓ disease_records (${dataset.disease_records.length})`)
  console.log(`✓ pest_records (${dataset.pest_records.length})`)
  console.log(`✓ growth_records (${dataset.growth_records.length})`)
  console.log(`✓ recommendations (${dataset.recommendations.length})`)
  console.log(`✓ maintenance_tasks (${dataset.maintenance_tasks.length})`)
  console.log(`✓ alerts (${dataset.alerts.length})`)
  console.log(`✓ notifications (${dataset.notifications.length})`)
  console.log(`✓ activity_logs (${dataset.activity_logs.length})`)
  console.log(`✓ audit_trail (${dataset.audit_trail.length})`)
  console.log(`✓ reports (${dataset.reports.length})`)
  console.log(`✓ config (${Object.keys(dataset.config).length} docs)`)
  console.log('\n✅ Realtime Database seed complete!')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
