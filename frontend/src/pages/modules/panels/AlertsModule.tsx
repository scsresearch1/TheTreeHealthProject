import { useDataStore } from '../../../stores/dataStore'
import { useCurrentUserId } from '../../../hooks/useCurrentUser'
import FeatureGate from '../../../components/modules/FeatureGate'
import Button from '../../../components/Button'
import Badge from '../../../components/Badge'

export default function AlertsModule() {
  const userId = useCurrentUserId()
  const { alerts, notifications, acknowledgeAlert, createAlert, markNotificationRead, notificationSettings, setNotificationSettings } = useDataStore()

  return (
    <div className="space-y-4">
      <FeatureGate permission="trees:read" title="In-app alerts">
        <ul className="space-y-2">
          {alerts.map((a) => (
            <li key={a.id} className={`rounded-r-lg border-l-2 px-3 py-2 text-xs ${a.severity === 'critical' ? 'border-signal-red bg-signal-red/5' : 'border-signal-amber bg-parchment-50'}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{a.title}</p>
                  <p className="text-ink-600">{a.message}</p>
                </div>
                {!a.acknowledged && (
                  <Button size="sm" variant="ghost" onClick={() => acknowledgeAlert(a.id, userId)}>Ack</Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </FeatureGate>

      <FeatureGate permission="alerts:manage" title="Severity levels">
        <div className="flex gap-2">
          {(['info', 'warning', 'critical'] as const).map((s) => (
            <Badge key={s} variant={s === 'critical' ? 'critical' : s === 'warning' ? 'warning' : 'info'}>{s}</Badge>
          ))}
        </div>
        <Button size="sm" className="mt-2" onClick={() => createAlert({ type: 'inspection', severity: 'warning', title: 'Test alert', message: 'Created from alerts module', treeId: 'TH-4821' }, userId)}>
          Create test alert
        </Button>
      </FeatureGate>

      <FeatureGate permission="alerts:manage" title="Email / SMS hooks">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={notificationSettings.email} onChange={(e) => setNotificationSettings({ email: e.target.checked })} />
          Email notifications
        </label>
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={notificationSettings.sms} onChange={(e) => setNotificationSettings({ sms: e.target.checked })} />
          SMS notifications
        </label>
      </FeatureGate>

      <FeatureGate permission="alerts:manage" title="Notification center">
        <ul className="space-y-1 text-xs">
          {notifications.map((n) => (
            <li key={n.id} className={`flex justify-between rounded px-2 py-1.5 ${n.read ? 'opacity-50' : 'bg-cerulean-50'}`}>
              <span>{n.title}: {n.message}</span>
              {!n.read && <button type="button" className="text-copper-600" onClick={() => markNotificationRead(n.id)}>Mark read</button>}
            </li>
          ))}
        </ul>
      </FeatureGate>
    </div>
  )
}
