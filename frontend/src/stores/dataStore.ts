import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { dataset as seedDataset } from '../data/dataset'
import type { Permission, UserRole } from '../types/firestore'
import { generateReportApi } from '../lib/api/reports'
import {
  syncTree, syncTreeDelete, syncSoilReading, syncAlert, syncMaintenanceTask, syncReport,
} from '../lib/firestore/sync'

export interface Tree {
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
  healthStatus: string
  riskLevel: string
  qrCode?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface SoilReading {
  id: string
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
  classification: string
  source: string
  recordedAt: string
  recordedBy: string
}

export interface ImageRecord {
  id: string
  treeId: string
  storageUrl: string
  storagePath: string
  imageType: string
  category: string
  capturedAt: string
  location?: { lat: number; lng: number }
  uploadedBy: string
  inspectionNotes?: string
  annotations: string[]
  createdAt: string
}

export interface DiseaseRecord {
  id: string
  treeId: string
  diseaseCategoryId: string
  diseaseName: string
  severity: string
  confidence: number
  verificationStatus: string
  detectedAt: string
  reviewedBy?: string
  notes?: string
  createdAt: string
}

export interface PestRecord {
  id: string
  treeId: string
  pestCategoryId: string
  pestName: string
  severity: string
  confidence: number
  verificationStatus: string
  detectedAt: string
  reviewedBy?: string
  notes?: string
  createdAt: string
}

export interface GrowthRecord {
  id: string
  treeId: string
  height: number
  canopySize: number
  trunkDiameter: number
  growthRate: number
  anomalyFlags: string[]
  recordedAt: string
  recordedBy: string
  createdAt: string
}

export interface Recommendation {
  id: string
  treeId: string
  zoneId: string
  type: string
  priority: string
  rationale: string
  suggestedActions: string[]
  basedOn: Record<string, unknown>
  status: string
  createdBy: string
  createdAt: string
}

export interface MaintenanceTask {
  id: string
  treeId: string
  zoneId: string
  category: string
  title: string
  assignedTo: string
  assignedBy: string
  dueDate: string
  priority: string
  status: string
  proofImageUrls: string[]
  completedAt?: string
  createdAt: string
  updatedAt: string
}

export interface Alert {
  id: string
  type: string
  severity: string
  title: string
  message: string
  treeId?: string
  zoneId?: string
  acknowledged: boolean
  createdAt: string
}

export interface AppUser {
  uid: string
  email: string
  displayName: string
  role: UserRole
  permissions: Permission[]
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface AuditEntry {
  id: string
  userId: string
  action: string
  entityType: string
  entityId: string
  field: string
  oldValue: string
  newValue: string
  timestamp: string
}

export interface ActivityEntry {
  id: string
  userId: string
  action: string
  entityType: string
  entityId: string
  timestamp: string
}

export interface Report {
  id: string
  type: string
  title: string
  filters: Record<string, string>
  format: string
  status: string
  generatedBy: string
  createdAt: string
  downloadUrl?: string
}

export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

export interface Zone {
  id: string
  name: string
  code: string
  block: string
  reach: string
  createdAt: string
  updatedAt: string
}

export type AppConfig = typeof seedDataset.config

let idCounter = 1000
const nextId = () => `id-${++idCounter}-${Date.now()}`
const now = () => new Date().toISOString()

const withIds = <T extends object>(items: T[]) =>
  items.map((item) => ({ ...item, id: nextId() }))

interface DataState {
  zones: Zone[]
  trees: Tree[]
  soil_readings: SoilReading[]
  images: ImageRecord[]
  disease_records: DiseaseRecord[]
  pest_records: PestRecord[]
  growth_records: GrowthRecord[]
  recommendations: Recommendation[]
  maintenance_tasks: MaintenanceTask[]
  alerts: Alert[]
  notifications: Notification[]
  users: AppUser[]
  audit_trail: AuditEntry[]
  activity_logs: ActivityEntry[]
  reports: Report[]
  config: AppConfig
  notificationSettings: { email: boolean; sms: boolean }

  addTree: (tree: Omit<Tree, 'treeId' | 'qrCode' | 'createdAt' | 'updatedAt' | 'createdBy'>, userId: string) => string
  updateTree: (treeId: string, patch: Partial<Tree>, userId: string) => void
  deleteTree: (treeId: string, userId: string) => void
  addSoilReading: (reading: Omit<SoilReading, 'id' | 'recordedAt' | 'recordedBy'>, userId: string) => void
  importSoilCsv: (rows: string[][], userId: string) => number
  addImage: (image: Omit<ImageRecord, 'id' | 'createdAt' | 'storageUrl' | 'storagePath'>, fileName: string, userId: string) => void
  annotateImage: (imageId: string, note: string, userId: string) => void
  addDiseaseRecord: (record: Omit<DiseaseRecord, 'id' | 'createdAt' | 'detectedAt' | 'verificationStatus'>, userId: string) => void
  approveDisease: (id: string, userId: string) => void
  addPestRecord: (record: Omit<PestRecord, 'id' | 'createdAt' | 'detectedAt' | 'verificationStatus'>, userId: string) => void
  approvePest: (id: string, userId: string) => void
  runAiDetection: (treeId: string, type: 'disease' | 'pest', userId: string) => void
  addGrowthRecord: (record: Omit<GrowthRecord, 'id' | 'createdAt' | 'recordedAt' | 'recordedBy'>, userId: string) => void
  addRecommendation: (rec: Omit<Recommendation, 'id' | 'createdAt' | 'status' | 'createdBy'>, userId: string) => void
  createMaintenanceTask: (task: Omit<MaintenanceTask, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'proofImageUrls'>, userId: string) => void
  assignTask: (taskId: string, assignee: string, userId: string) => void
  updateTaskStatus: (taskId: string, status: string, userId: string, proofUrl?: string) => void
  approveTask: (taskId: string, userId: string) => void
  acknowledgeAlert: (alertId: string, userId: string) => void
  createAlert: (alert: Omit<Alert, 'id' | 'createdAt' | 'acknowledged'>, userId: string) => void
  markNotificationRead: (notificationId: string) => void
  generateReport: (type: string, userId: string) => Promise<Report>
  exportReportCsv: () => string
  updateUserRole: (uid: string, role: UserRole, userId: string) => void
  toggleUserActive: (uid: string, userId: string) => void
  updateSoilThreshold: (key: string, value: number, userId: string) => void
  addSpecies: (name: string, commonName: string, userId: string) => void
  setNotificationSettings: (settings: Partial<DataState['notificationSettings']>) => void
  logFieldInspection: (treeId: string, notes: string, healthStatus: string, userId: string) => void
  resetData: () => void
}

function logAudit(
  set: (fn: (s: DataState) => Partial<DataState>) => void,
  userId: string,
  entityType: string,
  entityId: string,
  field: string,
  oldValue: string,
  newValue: string,
) {
  set((s) => ({
    audit_trail: [
      { id: nextId(), userId, action: 'update', entityType, entityId, field, oldValue, newValue, timestamp: now() },
      ...s.audit_trail,
    ],
  }))
}

function logActivity(
  set: (fn: (s: DataState) => Partial<DataState>) => void,
  userId: string,
  action: string,
  entityType: string,
  entityId: string,
) {
  set((s) => ({
    activity_logs: [
      { id: nextId(), userId, action, entityType, entityId, timestamp: now() },
      ...s.activity_logs,
    ],
  }))
}

const initialState = () => ({
  zones: [...seedDataset.zones] as Zone[],
  trees: [...seedDataset.trees] as Tree[],
  soil_readings: withIds(seedDataset.soil_readings) as SoilReading[],
  images: withIds(seedDataset.images) as ImageRecord[],
  disease_records: withIds(seedDataset.disease_records) as DiseaseRecord[],
  pest_records: withIds(seedDataset.pest_records) as PestRecord[],
  growth_records: withIds(seedDataset.growth_records) as GrowthRecord[],
  recommendations: withIds(seedDataset.recommendations) as Recommendation[],
  maintenance_tasks: withIds(seedDataset.maintenance_tasks) as MaintenanceTask[],
  alerts: withIds(seedDataset.alerts) as Alert[],
  notifications: withIds(seedDataset.notifications) as Notification[],
  users: [...seedDataset.users] as AppUser[],
  audit_trail: withIds(seedDataset.audit_trail) as AuditEntry[],
  activity_logs: withIds(seedDataset.activity_logs) as ActivityEntry[],
  reports: withIds(seedDataset.reports) as Report[],
  config: JSON.parse(JSON.stringify(seedDataset.config)) as AppConfig,
  notificationSettings: { email: true, sms: false },
})

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      ...initialState(),

      addTree: (tree, userId) => {
        const treeId = `TH-${Math.floor(1000 + Math.random() * 9000)}`
        const entry: Tree = { ...tree, treeId, qrCode: treeId, createdBy: userId, createdAt: now(), updatedAt: now() }
        set((s) => ({ trees: [...s.trees, entry] }))
        logActivity(set, userId, 'tree.create', 'tree', treeId)
        syncTree(entry)
        return treeId
      },

      updateTree: (treeId, patch, userId) => {
        set((s) => ({ trees: s.trees.map((t) => (t.treeId === treeId ? { ...t, ...patch, updatedAt: now() } : t)) }))
        logAudit(set, userId, 'tree', treeId, 'update', treeId, JSON.stringify(patch))
        const updated = get().trees.find((t) => t.treeId === treeId)
        if (updated) syncTree(updated)
      },

      deleteTree: (treeId, userId) => {
        set((s) => ({ trees: s.trees.filter((t) => t.treeId !== treeId) }))
        logActivity(set, userId, 'tree.delete', 'tree', treeId)
        syncTreeDelete(treeId)
      },

      addSoilReading: (reading, userId) => {
        const entry: SoilReading = { ...reading, id: nextId(), recordedAt: now(), recordedBy: userId }
        set((s) => ({ soil_readings: [entry, ...s.soil_readings] }))
        logActivity(set, userId, 'soil.create', 'soil_reading', entry.id)
        syncSoilReading(entry)
      },

      importSoilCsv: (rows, userId) => {
        let count = 0
        const header = rows[0]?.map((h) => h.toLowerCase()) ?? []
        const treeIdx = header.indexOf('treeid')
        const moistureIdx = header.indexOf('moisture')
        const phIdx = header.indexOf('ph')
        if (treeIdx < 0) return 0
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i]
          const treeId = row[treeIdx]
          const tree = get().trees.find((t) => t.treeId === treeId)
          if (!tree) continue
          get().addSoilReading({
            treeId, zoneId: tree.zoneId, samplingPoint: `SP-${treeId}`,
            moisture: Number(row[moistureIdx] ?? 30), ph: Number(row[phIdx] ?? 6.5),
            electricalConductivity: 1.2, nitrogen: 20, phosphorus: 15, potassium: 18,
            healthScore: 70, classification: 'moderate', source: 'csv',
          }, userId)
          count++
        }
        return count
      },

      addImage: (image, fileName, userId) => {
        const entry: ImageRecord = {
          ...image, id: nextId(), storagePath: `images/${fileName}`,
          storageUrl: `https://storage.example.com/tthp/${fileName}`, createdAt: now(),
        }
        set((s) => ({ images: [entry, ...s.images] }))
        logActivity(set, userId, 'image.upload', 'image', entry.id)
      },

      annotateImage: (imageId, note, userId) => {
        set((s) => ({
          images: s.images.map((img) =>
            img.id === imageId ? { ...img, inspectionNotes: note, annotations: [...img.annotations, note] } : img,
          ),
        }))
        logActivity(set, userId, 'image.annotate', 'image', imageId)
      },

      addDiseaseRecord: (record, userId) => {
        const entry: DiseaseRecord = { ...record, id: nextId(), verificationStatus: 'ai_detected', detectedAt: now(), createdAt: now() }
        set((s) => ({ disease_records: [entry, ...s.disease_records] }))
        logActivity(set, userId, 'disease.tag', 'disease', entry.id)
      },

      approveDisease: (id, userId) => {
        set((s) => ({
          disease_records: s.disease_records.map((d) =>
            d.id === id ? { ...d, verificationStatus: 'supervisor_approved', reviewedBy: userId } : d,
          ),
        }))
        logActivity(set, userId, 'disease.approve', 'disease', id)
      },

      addPestRecord: (record, userId) => {
        const entry: PestRecord = { ...record, id: nextId(), verificationStatus: 'field_verified', detectedAt: now(), createdAt: now() }
        set((s) => ({ pest_records: [entry, ...s.pest_records] }))
        logActivity(set, userId, 'pest.tag', 'pest', entry.id)
      },

      approvePest: (id, userId) => {
        set((s) => ({
          pest_records: s.pest_records.map((p) =>
            p.id === id ? { ...p, verificationStatus: 'supervisor_approved', reviewedBy: userId } : p,
          ),
        }))
        logActivity(set, userId, 'pest.approve', 'pest', id)
      },

      runAiDetection: (treeId, type, userId) => {
        const confidence = 0.75 + Math.random() * 0.2
        if (type === 'disease') {
          get().addDiseaseRecord({ treeId, diseaseCategoryId: 'leaf-spot', diseaseName: 'AI Detected Leaf Spot', severity: 'medium', confidence, notes: 'Auto-classified' }, userId)
        } else {
          get().addPestRecord({ treeId, pestCategoryId: 'aphid', pestName: 'AI Detected Aphids', severity: 'medium', confidence, notes: 'Auto-classified' }, userId)
        }
      },

      addGrowthRecord: (record, userId) => {
        const entry: GrowthRecord = { ...record, id: nextId(), recordedAt: now(), recordedBy: userId, createdAt: now() }
        set((s) => ({ growth_records: [entry, ...s.growth_records] }))
        logActivity(set, userId, 'growth.record', 'growth', entry.id)
      },

      addRecommendation: (rec, userId) => {
        const entry: Recommendation = { ...rec, id: nextId(), status: 'active', createdBy: userId, createdAt: now() }
        set((s) => ({ recommendations: [entry, ...s.recommendations] }))
        logActivity(set, userId, 'recommendation.create', 'recommendation', entry.id)
      },

      createMaintenanceTask: (task, userId) => {
        const entry: MaintenanceTask = { ...task, id: nextId(), status: 'assigned', proofImageUrls: [], createdAt: now(), updatedAt: now() }
        set((s) => ({ maintenance_tasks: [entry, ...s.maintenance_tasks] }))
        logActivity(set, userId, 'maintenance.create', 'maintenance', entry.id)
        syncMaintenanceTask(entry)
      },

      assignTask: (taskId, assignee, userId) => {
        set((s) => ({
          maintenance_tasks: s.maintenance_tasks.map((t) =>
            t.id === taskId ? { ...t, assignedTo: assignee, assignedBy: userId, updatedAt: now() } : t,
          ),
        }))
        logActivity(set, userId, 'maintenance.assign', 'maintenance', taskId)
      },

      updateTaskStatus: (taskId, status, userId, proofUrl) => {
        set((s) => ({
          maintenance_tasks: s.maintenance_tasks.map((t) => {
            if (t.id !== taskId) return t
            return {
              ...t, status,
              proofImageUrls: proofUrl ? [...t.proofImageUrls, proofUrl] : t.proofImageUrls,
              completedAt: status === 'completed' ? now() : t.completedAt,
              updatedAt: now(),
            }
          }),
        }))
        logActivity(set, userId, 'maintenance.status', 'maintenance', taskId)
        const task = get().maintenance_tasks.find((t) => t.id === taskId)
        if (task) syncMaintenanceTask(task)
      },

      approveTask: (taskId, userId) => {
        get().updateTaskStatus(taskId, 'verified', userId)
        logActivity(set, userId, 'maintenance.approve', 'maintenance', taskId)
      },

      acknowledgeAlert: (alertId, userId) => {
        set((s) => ({ alerts: s.alerts.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a)) }))
        logActivity(set, userId, 'alert.acknowledge', 'alert', alertId)
        const alert = get().alerts.find((a) => a.id === alertId)
        if (alert) syncAlert(alert)
      },

      createAlert: (alert, userId) => {
        const entry: Alert = { ...alert, id: nextId(), acknowledged: false, createdAt: now() }
        set((s) => ({ alerts: [entry, ...s.alerts] }))
        logActivity(set, userId, 'alert.create', 'alert', entry.id)
        syncAlert(entry)
      },

      markNotificationRead: (notificationId) => {
        set((s) => ({ notifications: s.notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n)) }))
      },

      generateReport: async (type, userId) => {
        const state = get()
        const { report } = await generateReportApi({
          type,
          filters: { zone: 'Reach 12' },
          generatedBy: userId,
          data: {
            trees: state.trees,
            alerts: state.alerts,
            soil_readings: state.soil_readings,
            zones: state.zones,
          },
        })
        set((s) => ({ reports: [report, ...s.reports] }))
        logActivity(set, userId, 'report.generate', 'report', report.id)
        syncReport(report)
        return report
      },

      exportReportCsv: () => {
        const trees = get().trees
        return 'treeId,species,healthStatus,riskLevel,zoneId\n' +
          trees.map((t) => `${t.treeId},${t.speciesName},${t.healthStatus},${t.riskLevel},${t.zoneId}`).join('\n')
      },

      updateUserRole: (uid, role, userId) => {
        const perms = seedDataset.config.roles.permissions[role] as Permission[]
        set((s) => ({
          users: s.users.map((u) => (u.uid === uid ? { ...u, role, permissions: perms, updatedAt: now() } : u)),
        }))
        logAudit(set, userId, 'user', uid, 'role', uid, role)
      },

      toggleUserActive: (uid, userId) => {
        set((s) => ({ users: s.users.map((u) => (u.uid === uid ? { ...u, active: !u.active, updatedAt: now() } : u)) }))
        logActivity(set, userId, 'user.toggle', 'user', uid)
      },

      updateSoilThreshold: (key, value, userId) => {
        set((s) => ({
          config: {
            ...s.config,
            soil_thresholds: { ...s.config.soil_thresholds, moisture: { ...s.config.soil_thresholds.moisture, [key]: value } },
          },
        }))
        logAudit(set, userId, 'config', 'soil_thresholds', key, String(value), String(value))
      },

      addSpecies: (name, commonName, userId) => {
        const id = name.toLowerCase().replace(/\s+/g, '-')
        set((s) => ({
          config: { ...s.config, species: { ...s.config.species, items: [...s.config.species.items, { id, name, commonName }] } },
        }))
        logActivity(set, userId, 'config.species.add', 'species', id)
      },

      setNotificationSettings: (settings) => set((s) => ({ notificationSettings: { ...s.notificationSettings, ...settings } })),

      logFieldInspection: (treeId, notes, healthStatus, userId) => {
        get().updateTree(treeId, { healthStatus }, userId)
        get().addImage(
          { treeId, imageType: 'inspection', category: 'full_tree', capturedAt: now(), uploadedBy: userId, inspectionNotes: notes, annotations: [] },
          `inspection-${treeId}-${Date.now()}.jpg`, userId,
        )
        logActivity(set, userId, 'field.inspect', 'tree', treeId)
      },

      resetData: () => set(initialState()),
    }),
    { name: 'tthp-data' },
  ),
)

export function zoneName(zoneId: string, zones: Zone[]) {
  return zones.find((z) => z.id === zoneId)?.name ?? zoneId
}
