import type { Permission } from '../../types/firestore'
import { useAccessControl } from '../../hooks/useAccessControl'
import Panel from '../Panel'

interface FeatureGateProps {
  permission: Permission
  title: string
  children: React.ReactNode
  className?: string
}

export default function FeatureGate({ permission, title, children, className = '' }: FeatureGateProps) {
  const { hasPermission } = useAccessControl()
  if (!hasPermission(permission)) return null
  return (
    <Panel title={title} className={className}>
      {children}
    </Panel>
  )
}
