import { dataset } from '../data/dataset'
import type { Permission, User, UserRole } from '../types/firestore'

export interface AccessRule {
  permissionsAny?: Permission[]
  allowedRoles?: UserRole[]
}

export type ModuleAccessItem = AccessRule & { moduleId: string }
export type DashboardWidgetItem = AccessRule & { id: string }
export type ModuleFeatureItem = { label: string; permission: Permission }

const rolePermissions = dataset.config.roles.permissions as Record<UserRole, Permission[]>
const moduleAccess = dataset.config.module_access.items as ModuleAccessItem[]
const moduleFeatures = dataset.config.module_features.items as Record<string, ModuleFeatureItem[]>
const dashboardWidgets = dataset.config.dashboard_widgets.items as DashboardWidgetItem[]

export function getRolePermissions(role: UserRole): Permission[] {
  return rolePermissions[role] ?? []
}

function matchesRule(rule: AccessRule, user: Pick<User, 'role' | 'permissions'>): boolean {
  const roles = rule.allowedRoles ?? []
  const perms = rule.permissionsAny ?? []

  if (roles.length > 0 && !roles.includes(user.role)) return false
  if (perms.length > 0 && !perms.some((p) => user.permissions.includes(p))) return false
  return true
}

export function canAccessModule(user: Pick<User, 'role' | 'permissions'>, moduleId: string): boolean {
  const rule = moduleAccess.find((m) => m.moduleId === moduleId)
  if (!rule) return false
  return matchesRule(rule, user)
}

export function accessibleModules(user: Pick<User, 'role' | 'permissions'>): ModuleAccessItem[] {
  return moduleAccess.filter((m) => matchesRule(m, user))
}

export function featuresForModule(
  user: Pick<User, 'role' | 'permissions'>,
  moduleId: string,
): ModuleFeatureItem[] {
  const features = moduleFeatures[moduleId] ?? []
  return features.filter((f) => user.permissions.includes(f.permission))
}

export function accessibleDashboardWidgets(user: Pick<User, 'role' | 'permissions'>): DashboardWidgetItem[] {
  return dashboardWidgets.filter((w) => matchesRule(w, user))
}

export function hasWidgetAccess(
  user: Pick<User, 'role' | 'permissions'> | null | undefined,
  widgetId: string,
): boolean {
  if (!user) return false
  const widget = dashboardWidgets.find((w) => w.id === widgetId)
  return widget ? matchesRule(widget, user) : false
}

export { moduleAccess, moduleFeatures, dashboardWidgets, rolePermissions }
