import { COLLECTIONS } from '../../types/firestore'
import { useDataStore } from '../../stores/dataStore'
import type { Tree, Zone, SoilReading, Alert, MaintenanceTask, Report } from '../../stores/dataStore'
import { batchUpsert, fetchCollection, isFirestoreConfigured, upsertDocument, deleteDocument } from './repository'

const TREE_COLLECTION = COLLECTIONS.trees

function docId(item: { id?: string; treeId?: string; uid?: string }, fallback?: string) {
  return item.id ?? item.treeId ?? item.uid ?? fallback ?? ''
}

export async function hydrateFromFirestore(): Promise<boolean> {
  if (!isFirestoreConfigured) return false

  try {
    const [trees, zones, soil, alerts, tasks, reports] = await Promise.all([
      fetchCollection<Tree>(TREE_COLLECTION),
      fetchCollection<Zone>(COLLECTIONS.zones),
      fetchCollection<SoilReading>(COLLECTIONS.soil_readings),
      fetchCollection<Alert>(COLLECTIONS.alerts),
      fetchCollection<MaintenanceTask>(COLLECTIONS.maintenance_tasks),
      fetchCollection<Report>(COLLECTIONS.reports),
    ])

    if (trees.length === 0) {
      await pushLocalStateToFirestore()
      return true
    }

    const state = useDataStore.getState()
    useDataStore.setState({
      trees: trees.map((t) => ({ ...t, treeId: t.treeId ?? (t as Tree & { id: string }).id })),
      zones: zones.length ? zones : state.zones,
      soil_readings: soil.length ? soil : state.soil_readings,
      alerts: alerts.length ? alerts : state.alerts,
      maintenance_tasks: tasks.length ? tasks : state.maintenance_tasks,
      reports: reports.length ? reports : state.reports,
    })
    return true
  } catch (err) {
    console.warn('[Firestore] hydrate failed — using local data', err)
    return false
  }
}

export async function pushLocalStateToFirestore() {
  if (!isFirestoreConfigured) return

  const s = useDataStore.getState()
  await Promise.all([
    batchUpsert(COLLECTIONS.zones, s.zones.map((z) => ({ id: z.id, data: z as unknown as Record<string, unknown> }))),
    batchUpsert(TREE_COLLECTION, s.trees.map((t) => ({ id: t.treeId, data: t as unknown as Record<string, unknown> }))),
    batchUpsert(COLLECTIONS.soil_readings, s.soil_readings.map((r) => ({ id: r.id, data: r as unknown as Record<string, unknown> }))),
    batchUpsert(COLLECTIONS.alerts, s.alerts.map((a) => ({ id: a.id, data: a as unknown as Record<string, unknown> }))),
    batchUpsert(COLLECTIONS.maintenance_tasks, s.maintenance_tasks.map((t) => ({ id: t.id, data: t as unknown as Record<string, unknown> }))),
    batchUpsert(COLLECTIONS.reports, s.reports.map((r) => ({ id: r.id, data: r as unknown as Record<string, unknown> }))),
  ])
}

export function syncTree(tree: Tree) {
  if (!isFirestoreConfigured) return
  upsertDocument(TREE_COLLECTION, tree.treeId, tree as unknown as Record<string, unknown>).catch(console.warn)
}

export function syncTreeDelete(treeId: string) {
  if (!isFirestoreConfigured) return
  deleteDocument(TREE_COLLECTION, treeId).catch(console.warn)
}

export function syncSoilReading(reading: SoilReading) {
  if (!isFirestoreConfigured) return
  upsertDocument(COLLECTIONS.soil_readings, reading.id, reading as unknown as Record<string, unknown>).catch(console.warn)
}

export function syncAlert(alert: Alert) {
  if (!isFirestoreConfigured) return
  upsertDocument(COLLECTIONS.alerts, alert.id, alert as unknown as Record<string, unknown>).catch(console.warn)
}

export function syncMaintenanceTask(task: MaintenanceTask) {
  if (!isFirestoreConfigured) return
  upsertDocument(COLLECTIONS.maintenance_tasks, task.id, task as unknown as Record<string, unknown>).catch(console.warn)
}

export function syncReport(report: Report) {
  if (!isFirestoreConfigured) return
  upsertDocument(COLLECTIONS.reports, report.id, report as unknown as Record<string, unknown>).catch(console.warn)
}

export function syncGeneric(collection: string, item: { id?: string; treeId?: string }) {
  if (!isFirestoreConfigured) return
  const id = docId(item)
  if (!id) return
  upsertDocument(collection, id, item as unknown as Record<string, unknown>).catch(console.warn)
}
