import { useAuthStore } from '../../stores/authStore'
import Button from '../Button'
import { IconBell } from '../icons'
import { useDataStore } from '../../stores/dataStore'
import { useAccessControl } from '../../hooks/useAccessControl'
import { useConnectionStore } from '../../stores/connectionStore'

const CONNECTION_LABELS = {
  local: { text: 'Local storage only', className: 'bg-amber-100 text-amber-800' },
  firestore_connecting: { text: 'Connecting to Firestore…', className: 'bg-sky-100 text-sky-800' },
  firestore_synced: { text: 'Firestore synced', className: 'bg-emerald-100 text-emerald-800' },
  firestore_error: { text: 'Firestore error', className: 'bg-signal-red/10 text-signal-red' },
} as const

export default function TopBar() {
  const { user, logout } = useAuthStore()
  const alerts = useDataStore((s) => s.alerts)
  const { accessibleModules, canViewWidget } = useAccessControl()
  const { mode: connectionMode, error: connectionError } = useConnectionStore()
  const connection = CONNECTION_LABELS[connectionMode]
  const criticalCount = alerts.filter((a) => a.severity === 'critical').length
  const showAlerts = canViewWidget('alerts')

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-ink-200/80 bg-white/90 px-4 backdrop-blur-sm">
      <div>
        <h1 className="text-sm font-semibold text-ink-900">Operations</h1>
        <p className="text-[10px] text-ink-500">
          {accessibleModules.length} modules · <span className="capitalize">{user?.role?.replace(/_/g, ' ')}</span>
          {' · '}
          <span
            className={`rounded px-1 py-0.5 font-medium ${connection.className}`}
            title={connectionError ?? connection.text}
          >
            {connection.text}
          </span>
        </p>
      </div>

      <div className="flex items-center gap-4">
        {showAlerts && (
          <button
            type="button"
            className="relative rounded-lg p-2 text-ink-600 transition hover:bg-ink-50"
            aria-label={`${alerts.length} alerts, ${criticalCount} critical`}
          >
            <IconBell className="h-5 w-5" />
            {criticalCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-signal-red text-[10px] font-bold text-white">
                {criticalCount}
              </span>
            )}
          </button>
        )}

        <div className="hidden items-center gap-3 sm:flex">
          <div className="text-right">
            <p className="text-sm font-medium text-ink-900">{user?.name ?? 'User'}</p>
            <p className="text-xs capitalize text-ink-600">{user?.role?.replace('_', ' ')}</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-800 text-xs font-semibold text-white">
            {(user?.name ?? 'U').charAt(0).toUpperCase()}
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={logout}>
          Sign out
        </Button>
      </div>
    </header>
  )
}
