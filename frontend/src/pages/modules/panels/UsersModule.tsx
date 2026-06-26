import { useDataStore } from '../../../stores/dataStore'
import { useCurrentUserId } from '../../../hooks/useCurrentUser'
import FeatureGate from '../../../components/modules/FeatureGate'
import Button from '../../../components/Button'
import Badge from '../../../components/Badge'
import type { UserRole } from '../../../types/firestore'

const ROLES: UserRole[] = ['admin', 'management', 'field_team']

export default function UsersModule() {
  const userId = useCurrentUserId()
  const { users, activity_logs, updateUserRole, toggleUserActive } = useDataStore()

  return (
    <div className="space-y-4">
      <FeatureGate permission="admin:users" title="User CRUD">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] uppercase text-ink-500">
              <th className="py-1 text-left">Name</th><th>Email</th><th>Status</th><th />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.uid} className="border-t border-ink-50">
                <td className="py-1.5">{u.displayName}</td>
                <td className="font-mono text-[10px]">{u.email}</td>
                <td><Badge variant={u.active ? 'healthy' : 'critical'} size="sm">{u.active ? 'active' : 'inactive'}</Badge></td>
                <td className="text-right">
                  <Button size="sm" variant="ghost" onClick={() => toggleUserActive(u.uid, userId)}>Toggle</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </FeatureGate>

      <FeatureGate permission="admin:users" title="Role assignment">
        <ul className="space-y-2">
          {users.map((u) => (
            <li key={u.uid} className="flex items-center gap-2 text-xs">
              <span className="w-32 truncate">{u.displayName}</span>
              <select
                className="rounded border px-1 py-0.5"
                value={u.role}
                onChange={(e) => updateUserRole(u.uid, e.target.value as UserRole, userId)}
              >
                {ROLES.map((r) => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
              </select>
            </li>
          ))}
        </ul>
      </FeatureGate>

      <FeatureGate permission="admin:users" title="Permission control">
        <div className="max-h-40 overflow-y-auto text-[10px] font-mono text-ink-600">
          {users.map((u) => (
            <p key={u.uid} className="mb-2"><strong>{u.displayName}:</strong> {u.permissions.join(', ')}</p>
          ))}
        </div>
      </FeatureGate>

      <FeatureGate permission="admin:users" title="Activity logs">
        <ul className="max-h-48 space-y-1 overflow-y-auto text-xs text-ink-600">
          {activity_logs.slice(0, 20).map((l) => (
            <li key={l.id}>{l.action} · {l.entityType} {l.entityId}</li>
          ))}
        </ul>
      </FeatureGate>
    </div>
  )
}
