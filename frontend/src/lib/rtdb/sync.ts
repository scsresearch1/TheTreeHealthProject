import { COLLECTIONS } from '../../types/firestore'
import { useDataStore } from '../../stores/dataStore'
import type { Tree, Zone, SoilReading, Alert, MaintenanceTask, Report } from '../../stores/dataStore'
import { batchUpsert, fetchCollection, isFirebaseConfigured, upsertDocument, deleteDocument } from './repository'

const TREES_PATH = COLLECTIONS.trees

export async function hydrateFromRealtimeDb(): Promise<boolean> {
  if (!isFirebaseConfigured) return false

  try {
    const [trees, zones, soil, alerts, tasks, reports] = await Promise.all([
      fetchCollection<Tree>(TREES_PATH),
      fetchCollection<Zone>(COLLECTIONS.zones),
      fetchCollection<SoilReading>(COLLECTIONS.soil_readings),
      fetchCollection<Alert>(COLLECTIONS.alerts),
      fetchCollection<MaintenanceTask>(COLLECTIONS.maintenance_tasks),
      fetchCollection<Report>(COLLECTIONS.reports),
    ])

    if (trees.length === 0) {
      await pushLocalStateToRealtimeDb()
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
    console.warn('[RTDB] hydrate failed — using local data', err)
    return false
  }
}

export async function pushLocalStateToRealtimeDb() {
  if (!isFirebaseConfigured) return

  const s = useDataStore.getState()
  await Promise.all([
    batchUpsert(COLLECTIONS.zones, s.zones.map((z) => ({ id: z.id, data: z as unknown as Record<string, unknown> }))),
    batchUpsert(TREES_PATH, s.trees.map((t) => ({ id: t.treeId, data: t as unknown as Record<string, unknown> }))),
    batchUpsert(COLLECTIONS.soil_readings, s.soil_readings.map((r) => ({ id: r.id, data: r as unknown as Record<string, unknown> }))),
    batchUpsert(COLLECTIONS.alerts, s.alerts.map((a) => ({ id: a.id, data: a as unknown as Record<string, unknown> }))),
    batchUpsert(COLLECTIONS.maintenance_tasks, s.maintenance_tasks.map((t) => ({ id: t.id, data: t as unknown as Record<string, unknown> }))),
    batchUpsert(COLLECTIONS.reports, s.reports.map((r) => ({ id: r.id, data: r as unknown as Record<string, unknown> }))),
  ])
}

export function syncTree(tree: Tree) {
  if (!isFirebaseConfigured) return
  upsertDocument(TREES_PATH, tree.treeId, tree as unknown as Record<string, unknown>).catch(console.warn)
}

export function syncTreeDelete(treeId: string) {
  if (!isFirebaseConfigured) return
  deleteDocument(TREES_PATH, treeId).catch(console.warn)
}

export function syncSoilReading(reading: SoilReading) {
  if (!isFirebaseConfigured) return
  upsertDocument(COLLECTIONS.soil_readings, reading.id, reading as unknown as Record<string, unknown>).catch(console.warn)
}

export function syncAlert(alert: Alert) {
  if (!isFirebaseConfigured) return
  upsertDocument(COLLECTIONS.alerts, alert.id, alert as unknown as Record<string, unknown>).catch(console.warn)
}

export function syncMaintenanceTask(task: MaintenanceTask) {
  if (!isFirebaseConfigured) return
  upsertDocument(COLLECTIONS.maintenance_tasks, task.id, task as unknown as Record<string, unknown>).catch(console.warn)
}

export function syncReport(report: Report) {
  if (!isFirebaseConfigured) return
  upsertDocument(COLLECTIONS.reports, report.id, report as unknown as Record<string, unknown>).catch(console.warn)
}

/** @deprecated use hydrateFromRealtimeDb */
export const hydrateFromFirestore = hydrateFromRealtimeDb
