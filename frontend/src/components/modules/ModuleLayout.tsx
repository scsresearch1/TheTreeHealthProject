import type { FeatureModule } from '../../config/featureModules'
import { useAccessControl } from '../../hooks/useAccessControl'

interface ModuleLayoutProps {
  module: FeatureModule
  children?: React.ReactNode
}

export default function ModuleLayout({ module, children }: ModuleLayoutProps) {
  const Icon = module.icon
  const { getFeatures, user } = useAccessControl()
  const features = getFeatures(module.id)

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-900 text-copper-300">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-ink-950">{module.title}</h1>
          <p className="mt-0.5 text-sm text-ink-600">{module.description}</p>
          {user && (
            <p className="mt-1 text-[10px] text-ink-500">
              {features.length} active options for {user.role.replace(/_/g, ' ')}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}
