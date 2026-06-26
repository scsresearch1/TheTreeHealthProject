import { useMemo } from 'react'
import { useAuthStore } from '../stores/authStore'
import {
  accessibleDashboardWidgets,
  accessibleModules,
  canAccessModule,
  featuresForModule,
  hasWidgetAccess,
} from '../lib/accessControl'
import { featureModules } from '../config/featureModules'
import type { FeatureModule } from '../config/featureModules'

export function useAccessControl() {
  const user = useAuthStore((s) => s.user)
  const hasPermission = useAuthStore((s) => s.hasPermission)

  const accessibleModuleList = useMemo((): FeatureModule[] => {
    if (!user) return []
    const allowedIds = new Set(accessibleModules(user).map((m) => m.moduleId))
    return featureModules.filter((m) => allowedIds.has(m.id))
  }, [user])

  const getFeatures = (moduleId: string) => {
    if (!user) return []
    return featuresForModule(user, moduleId)
  }

  const canAccess = (moduleId: string) => {
    if (!user) return false
    return canAccessModule(user, moduleId)
  }

  const canViewWidget = (widgetId: string) => hasWidgetAccess(user, widgetId)

  const widgets = useMemo(() => {
    if (!user) return []
    return accessibleDashboardWidgets(user)
  }, [user])

  return {
    user,
    hasPermission,
    accessibleModules: accessibleModuleList,
    getFeatures,
    canAccess,
    canViewWidget,
    widgets,
  }
}
