import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { canAccessModule } from '../lib/accessControl'

interface RoleGuardProps {
  moduleId: string
  children: React.ReactNode
}

export default function RoleGuard({ moduleId, children }: RoleGuardProps) {
  const user = useAuthStore((s) => s.user)
  if (!user || !canAccessModule(user, moduleId)) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}
