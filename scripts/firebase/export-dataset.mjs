import { writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { buildDataset } from './dataset.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '../../data')
mkdirSync(outDir, { recursive: true })

const dataset = buildDataset()
const outPath = join(outDir, 'dataset.json')

writeFileSync(outPath, JSON.stringify(dataset, null, 2), 'utf8')

console.log(`✅ Dataset written to ${outPath}`)
console.log(`   Trees: ${dataset.trees.length}`)
console.log(`   Soil readings: ${dataset.soil_readings.length}`)
console.log(`   Maintenance tasks: ${dataset.maintenance_tasks.length}`)
console.log(`   Alerts: ${dataset.alerts.length}`)
console.log(`   Users: ${dataset.users.length}`)
