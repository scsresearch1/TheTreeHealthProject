import {
  dashboardStatsFromDataset,
  recentTreesFromDataset,
  alertsFromDataset,
  maintenanceTasksFromDataset,
  recommendationsFromDataset,
  soilReadingsFromDataset,
  healthDistributionFromDataset,
} from './dataset'

export type HealthStatus = 'healthy' | 'stressed' | 'at_risk' | 'critical'
export type AlertSeverity = 'info' | 'warning' | 'critical'
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue'

export interface TreeRecord {
  id: string
  species: string
  dbh: number
  health: HealthStatus
  lat: number
  lng: number
  lastInspection: string
}

export interface Alert {
  id: string
  title: string
  message: string
  severity: AlertSeverity
  module: string
  timestamp: string
}

export interface MaintenanceTask {
  id: string
  title: string
  treeId: string
  assignee: string
  status: TaskStatus
  dueDate: string
}

export interface Recommendation {
  id: string
  treeId: string
  action: string
  priority: 'low' | 'medium' | 'high'
  rationale: string
}

export interface SoilReading {
  zone: string
  ph: number
  moisture: number
  nitrogen: number
  phosphorus: number
  potassium: number
  status: HealthStatus
}

export const dashboardStats = dashboardStatsFromDataset()
export const recentTrees = recentTreesFromDataset()
export const alerts = alertsFromDataset()
export const maintenanceTasks = maintenanceTasksFromDataset()
export const recommendations = recommendationsFromDataset()
export const soilReadings = soilReadingsFromDataset()
export const healthDistribution = healthDistributionFromDataset()
