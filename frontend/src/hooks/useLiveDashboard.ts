import { useMemo } from 'react'
import { useDataStore } from '../stores/dataStore'
import { zoneName, type Tree } from '../stores/dataStore'
import type { HealthStatus, AlertSeverity, TaskStatus } from '../data/mockDashboard'
import { mapTreeHealth } from '../data/dataset'

const TASK_MAP: Record<string, TaskStatus> = {
  open: 'pending', assigned: 'pending', in_progress: 'in_progress',
  completed: 'completed', verified: 'completed', rejected: 'pending', overdue: 'overdue',
}

export function useLiveDashboard() {
  const trees = useDataStore((s) => s.trees)
  const alerts = useDataStore((s) => s.alerts)
  const maintenance_tasks = useDataStore((s) => s.maintenance_tasks)
  const recommendations = useDataStore((s) => s.recommendations)
  const soil_readings = useDataStore((s) => s.soil_readings)
  const zones = useDataStore((s) => s.zones)

  return useMemo(() => {
    const healthy = trees.filter((t) => t.healthStatus === 'healthy').length
    const openAlerts = alerts.filter((a) => !a.acknowledged).length
    const tasksDue = maintenance_tasks.filter((t) =>
      ['assigned', 'in_progress', 'overdue'].includes(t.status),
    ).length
    const avgPh = soil_readings.length
      ? soil_readings.reduce((s, r) => s + r.ph, 0) / soil_readings.length
      : 0

    const recentTrees = trees.map((t) => ({
      id: t.treeId,
      species: t.speciesName,
      dbh: t.trunkDiameter,
      health: mapTreeHealth(t.healthStatus, t.riskLevel) as HealthStatus,
      lat: t.location.lat,
      lng: t.location.lng,
      lastInspection: '—',
    }))

    const alertsList = alerts.map((a, i) => ({
      id: a.id ?? String(i),
      title: a.title,
      message: a.message,
      severity: a.severity as AlertSeverity,
      module: a.type === 'pest' ? 'Vision AI' : a.type === 'soil' ? 'Soil' : 'Inventory',
      timestamp: 'recent',
    }))

    const maintenanceTasks = maintenance_tasks.map((t, i) => ({
      id: t.id ?? `M-${100 + i}`,
      title: t.title,
      treeId: t.treeId,
      assignee: t.assignedTo.replace('seed-', '').replace('_', ' '),
      status: TASK_MAP[t.status] ?? 'pending',
      dueDate: new Date(t.dueDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }),
    }))

    const recommendationsList = recommendations.map((r, i) => ({
      id: r.id ?? `R-${i + 1}`,
      treeId: r.treeId,
      action: r.suggestedActions[0] ?? r.type,
      priority: (r.priority === 'urgent' ? 'high' : r.priority) as 'low' | 'medium' | 'high',
      rationale: r.rationale,
    }))

    const byZone = new Map<string, typeof soil_readings>()
    for (const s of soil_readings) {
      const list = byZone.get(s.zoneId) ?? []
      list.push(s)
      byZone.set(s.zoneId, list)
    }

    const soilReadings = [...byZone.entries()].map(([zoneId, readings]) => {
      const avg = (key: 'ph' | 'moisture' | 'nitrogen' | 'phosphorus' | 'potassium') =>
        readings.reduce((sum, r) => sum + r[key], 0) / readings.length
      const moisture = avg('moisture')
      const status: HealthStatus = moisture < 20 ? 'stressed' : moisture < 25 ? 'at_risk' : 'healthy'
      return {
        zone: zoneName(zoneId, zones),
        ph: Math.round(avg('ph') * 10) / 10,
        moisture: Math.round(moisture),
        nitrogen: Math.round(avg('nitrogen')),
        phosphorus: Math.round(avg('phosphorus')),
        potassium: Math.round(avg('potassium')),
        status,
      }
    })

    const counts = { healthy: 0, stressed: 0, at_risk: 0, critical: 0 }
    for (const t of trees) {
      counts[mapTreeHealth(t.healthStatus, t.riskLevel) as keyof typeof counts]++
    }
    const total = trees.length || 1
    const healthDistribution = [
      { label: 'Healthy', value: Math.round((counts.healthy / total) * 100), color: 'bg-cerulean-500' },
      { label: 'Stressed', value: Math.round((counts.stressed / total) * 100), color: 'bg-signal-amber' },
      { label: 'At risk', value: Math.round((counts.at_risk / total) * 100), color: 'bg-orange-500' },
      { label: 'Critical', value: Math.round((counts.critical / total) * 100), color: 'bg-signal-red' },
    ]

    return {
      dashboardStats: {
        totalTrees: trees.length,
        healthyPct: Math.round((healthy / total) * 100),
        alertsOpen: openAlerts,
        tasksDue,
        inspectionsThisWeek: maintenance_tasks.filter((t) => t.category === 'inspection').length,
        avgSoilPh: Math.round(avgPh * 10) / 10,
      },
      recentTrees,
      alerts: alertsList,
      maintenanceTasks,
      recommendations: recommendationsList,
      soilReadings,
      healthDistribution,
    }
  }, [trees, alerts, maintenance_tasks, recommendations, soil_readings, zones])
}

export function mapTreeHealthFromTree(t: Tree): HealthStatus {
  return mapTreeHealth(t.healthStatus, t.riskLevel) as HealthStatus
}
