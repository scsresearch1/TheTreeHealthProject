export type UserRole = 'admin' | 'management' | 'field_team'

export type Permission =
  | 'trees:read' | 'trees:write' | 'trees:delete'
  | 'soil:read' | 'soil:write'
  | 'images:upload' | 'images:annotate'
  | 'disease:tag' | 'disease:approve'
  | 'pest:tag' | 'pest:approve'
  | 'maintenance:create' | 'maintenance:assign' | 'maintenance:complete' | 'maintenance:approve'
  | 'reports:view' | 'reports:export'
  | 'admin:config' | 'admin:users'
  | 'alerts:manage'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  permissions: Permission[]
  organization?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export type HealthStatus = 'healthy' | 'moderate_risk' | 'diseased' | 'pest_affected' | 'requires_inspection'
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'
export type VerificationStatus = 'ai_detected' | 'field_verified' | 'supervisor_approved' | 'false_positive'
export type SoilClassification = 'good' | 'moderate' | 'poor' | 'critical'
export type TaskStatus = 'open' | 'assigned' | 'in_progress' | 'completed' | 'verified' | 'rejected'
export type AlertSeverity = 'info' | 'warning' | 'critical'
export type RecommendationPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface TreeRecord {
  id?: string
  treeId: string
  speciesId: string
  speciesName: string
  ageEstimate?: number
  height?: number
  trunkDiameter?: number
  canopySize?: number
  plantationDate?: string
  location: { lat: number; lng: number }
  zoneId: string
  healthStatus: HealthStatus
  riskLevel: RiskLevel
  qrCode?: string
  createdBy: string
  createdAt: unknown
  updatedAt: unknown
}

export interface SoilReading {
  id?: string
  treeId?: string
  zoneId: string
  samplingPoint: string
  moisture: number
  ph: number
  electricalConductivity: number
  nitrogen: number
  phosphorus: number
  potassium: number
  temperature?: number
  organicMatter?: number
  healthScore: number
  classification: SoilClassification
  source: 'manual' | 'csv' | 'iot'
  recordedAt: unknown
  recordedBy: string
}

export interface ImageRecord {
  id?: string
  treeId: string
  storageUrl: string
  storagePath: string
  imageType: string
  category: 'full_tree' | 'leaf' | 'stem_trunk' | 'pest_damage' | 'soil_root'
  capturedAt: unknown
  location?: { lat: number; lng: number }
  uploadedBy: string
  inspectionNotes?: string
  annotations?: unknown[]
}

export interface MaintenanceTask {
  id?: string
  treeId?: string
  zoneId?: string
  category: string
  title: string
  description?: string
  assignedTo?: string
  assignedBy?: string
  dueDate: unknown
  priority: RecommendationPriority
  status: TaskStatus
  proofImageUrls?: string[]
  approvedBy?: string
  completedAt?: unknown
}

export const COLLECTIONS = {
  users: 'users',
  trees: 'trees',
  zones: 'zones',
  soil_readings: 'soil_readings',
  images: 'images',
  disease_records: 'disease_records',
  pest_records: 'pest_records',
  growth_records: 'growth_records',
  recommendations: 'recommendations',
  maintenance_tasks: 'maintenance_tasks',
  alerts: 'alerts',
  notifications: 'notifications',
  activity_logs: 'activity_logs',
  audit_trail: 'audit_trail',
  reports: 'reports',
  config: 'config',
} as const
