/**
 * Firestore schema reference for The Tree Health Project.
 * Run: npm run seed:firebase (from /scripts)
 */

export const COLLECTIONS = {
  USERS: 'users',
  TREES: 'trees',
  ZONES: 'zones',
  SOIL_READINGS: 'soil_readings',
  IMAGES: 'images',
  DISEASE_RECORDS: 'disease_records',
  PEST_RECORDS: 'pest_records',
  GROWTH_RECORDS: 'growth_records',
  RECOMMENDATIONS: 'recommendations',
  MAINTENANCE_TASKS: 'maintenance_tasks',
  ALERTS: 'alerts',
  NOTIFICATIONS: 'notifications',
  ACTIVITY_LOGS: 'activity_logs',
  AUDIT_TRAIL: 'audit_trail',
  REPORTS: 'reports',
  CONFIG: 'config',
  SCHEMA: '_schema',
} as const

export const ROLES = ['admin', 'management', 'field_team'] as const

export const PERMISSIONS = [
  'trees:read', 'trees:write', 'trees:delete',
  'soil:read', 'soil:write',
  'images:upload', 'images:annotate',
  'disease:tag', 'disease:approve',
  'pest:tag', 'pest:approve',
  'maintenance:create', 'maintenance:assign', 'maintenance:complete', 'maintenance:approve',
  'reports:view', 'reports:export',
  'admin:config', 'admin:users',
  'alerts:manage',
] as const
