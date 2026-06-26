import type { ComponentType } from 'react'
import InventoryModule from './InventoryModule'
import MapModule from './MapModule'
import SoilModule from './SoilModule'
import ImagesModule from './ImagesModule'
import DiseasePestModule from './DiseasePestModule'
import GrowthModule from './GrowthModule'
import RecommendationsModule from './RecommendationsModule'
import MaintenanceModule from './MaintenanceModule'
import AlertsModule from './AlertsModule'
import ReportsModule from './ReportsModule'
import AdminModule from './AdminModule'
import UsersModule from './UsersModule'
import AuditModule from './AuditModule'
import FieldModule from './FieldModule'

const MODULE_PANELS: Record<string, ComponentType> = {
  inventory: InventoryModule,
  map: MapModule,
  soil: SoilModule,
  images: ImagesModule,
  'disease-pest': DiseasePestModule,
  growth: GrowthModule,
  recommendations: RecommendationsModule,
  maintenance: MaintenanceModule,
  alerts: AlertsModule,
  reports: ReportsModule,
  admin: AdminModule,
  users: UsersModule,
  audit: AuditModule,
  field: FieldModule,
}

export function getModulePanel(moduleId: string): ComponentType | null {
  return MODULE_PANELS[moduleId] ?? null
}
