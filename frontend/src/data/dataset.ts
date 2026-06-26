import raw from '../../../data/dataset.json'
import type { HealthStatus, AlertSeverity, TaskStatus } from './mockDashboard'

export type Dataset = typeof raw

export const dataset = raw as Dataset

const HEALTH_MAP: Record<string, HealthStatus> = {
  healthy: 'healthy',
  moderate_risk: 'stressed',
  requires_inspection: 'stressed',
  diseased: 'at_risk',
  pest_affected: 'critical',
}

const TASK_MAP: Record<string, TaskStatus> = {
  open: 'pending',
  assigned: 'pending',
  in_progress: 'in_progress',
  completed: 'completed',
  verified: 'completed',
  rejected: 'pending',
  overdue: 'overdue',
}

const zoneNameById = Object.fromEntries(dataset.zones.map((z) => [z.id, z.name]))

export function mapTreeHealth(status: string, riskLevel?: string): HealthStatus {
  if (status === 'pest_affected' || riskLevel === 'critical') return 'critical'
  if (status === 'diseased' || riskLevel === 'high') return 'at_risk'
  return HEALTH_MAP[status] ?? 'stressed'
}

export function dashboardStatsFromDataset() {
  const trees = dataset.trees
  const healthy = trees.filter((t) => t.healthStatus === 'healthy').length
  const openAlerts = dataset.alerts.filter((a) => !a.acknowledged).length
  const tasksDue = dataset.maintenance_tasks.filter((t) =>
    ['assigned', 'in_progress', 'overdue'].includes(t.status),
  ).length
  const avgPh =
    dataset.soil_readings.reduce((sum, s) => sum + s.ph, 0) / dataset.soil_readings.length

  return {
    totalTrees: trees.length,
    healthyPct: Math.round((healthy / trees.length) * 100),
    alertsOpen: openAlerts,
    tasksDue,
    inspectionsThisWeek: dataset.maintenance_tasks.filter((t) => t.category === 'inspection').length,
    avgSoilPh: Math.round(avgPh * 10) / 10,
  }
}

export function recentTreesFromDataset() {
  return dataset.trees.map((t) => ({
    id: t.treeId,
    species: t.speciesName,
    dbh: t.trunkDiameter,
    health: mapTreeHealth(t.healthStatus, t.riskLevel),
    lat: t.location.lat,
    lng: t.location.lng,
    lastInspection: '—',
  }))
}

export function alertsFromDataset() {
  return dataset.alerts.map((a, i) => ({
    id: String(i + 1),
    title: a.title,
    message: a.message,
    severity: a.severity as AlertSeverity,
    module: a.type === 'pest' ? 'Vision AI' : a.type === 'soil' ? 'Soil' : 'Inventory',
    timestamp: 'recent',
  }))
}

export function maintenanceTasksFromDataset() {
  return dataset.maintenance_tasks.map((t, i) => ({
    id: `M-${100 + i}`,
    title: t.title,
    treeId: t.treeId,
    assignee: t.assignedTo.replace('seed-', '').replace('_', ' '),
    status: TASK_MAP[t.status] ?? 'pending',
    dueDate: new Date(t.dueDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }),
  }))
}

export function recommendationsFromDataset() {
  return dataset.recommendations.map((r, i) => ({
    id: `R-${i + 1}`,
    treeId: r.treeId,
    action: r.suggestedActions[0] ?? r.type,
    priority: r.priority === 'urgent' ? 'high' as const : r.priority as 'low' | 'medium' | 'high',
    rationale: r.rationale,
  }))
}

export function soilReadingsFromDataset() {
  const byZone = new Map<string, typeof dataset.soil_readings>()
  for (const s of dataset.soil_readings) {
    const list = byZone.get(s.zoneId) ?? []
    list.push(s)
    byZone.set(s.zoneId, list)
  }

  return [...byZone.entries()].map(([zoneId, readings]) => {
    const avg = (key: 'ph' | 'moisture' | 'nitrogen' | 'phosphorus' | 'potassium') =>
      readings.reduce((sum, r) => sum + r[key], 0) / readings.length
    const moisture = avg('moisture')
    const status: HealthStatus =
      moisture < 20 ? 'stressed' : moisture < 25 ? 'at_risk' : 'healthy'

    return {
      zone: zoneNameById[zoneId] ?? zoneId,
      ph: Math.round(avg('ph') * 10) / 10,
      moisture: Math.round(moisture),
      nitrogen: Math.round(avg('nitrogen')),
      phosphorus: Math.round(avg('phosphorus')),
      potassium: Math.round(avg('potassium')),
      status,
    }
  })
}

export function healthDistributionFromDataset() {
  const counts = { healthy: 0, stressed: 0, at_risk: 0, critical: 0 }
  for (const t of dataset.trees) {
    counts[mapTreeHealth(t.healthStatus, t.riskLevel)]++
  }
  const total = dataset.trees.length
  return [
    { label: 'Healthy', value: Math.round((counts.healthy / total) * 100), color: 'bg-cerulean-500' },
    { label: 'Stressed', value: Math.round((counts.stressed / total) * 100), color: 'bg-signal-amber' },
    { label: 'At risk', value: Math.round((counts.at_risk / total) * 100), color: 'bg-orange-500' },
    { label: 'Critical', value: Math.round((counts.critical / total) * 100), color: 'bg-signal-red' },
  ]
}
