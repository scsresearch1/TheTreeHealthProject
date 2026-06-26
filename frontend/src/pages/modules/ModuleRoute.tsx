import { Navigate } from 'react-router-dom'
import { featureModules } from '../../config/featureModules'
import ModuleLayout from '../../components/modules/ModuleLayout'
import RoleGuard from '../../components/RoleGuard'
import { getModulePanel } from './panels'

interface ModuleRouteProps {
  moduleId: string
}

export default function ModuleRoute({ moduleId }: ModuleRouteProps) {
  const mod = featureModules.find((m) => m.id === moduleId)
  if (!mod) return <Navigate to="/dashboard" replace />

  const Panel = getModulePanel(moduleId)

  return (
    <RoleGuard moduleId={moduleId}>
      <ModuleLayout module={mod}>
        {Panel ? <Panel /> : null}
      </ModuleLayout>
    </RoleGuard>
  )
}
