import { useState } from 'react'
import { useDataStore } from '../../../stores/dataStore'
import FeatureGate from '../../../components/modules/FeatureGate'

export default function AuditModule() {
  const { audit_trail } = useDataStore()
  const [filter, setFilter] = useState('')

  const entries = audit_trail.filter(
    (e) =>
      !filter ||
      e.entityType.includes(filter) ||
      e.entityId.includes(filter) ||
      e.userId.includes(filter),
  )

  return (
    <div className="space-y-4">
      <FeatureGate permission="reports:view" title="Who did what">
        <input
          className="mb-2 w-full rounded-lg border border-parchment-300 px-3 py-1.5 text-sm"
          placeholder="Filter by entity or user..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] uppercase text-ink-500">
              <th className="py-1 text-left">User</th><th>Action</th><th>Entity</th><th>Field</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id} className="border-t border-ink-50">
                <td className="py-1">{e.userId}</td>
                <td>{e.action}</td>
                <td className="font-mono">{e.entityId}</td>
                <td>{e.field}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </FeatureGate>

      <FeatureGate permission="reports:view" title="Timestamps">
        <ul className="space-y-1 text-xs text-ink-600">
          {entries.slice(0, 10).map((e) => (
            <li key={e.id}>{new Date(e.timestamp as string).toLocaleString()} — {e.entityType}/{e.entityId}</li>
          ))}
        </ul>
      </FeatureGate>

      <FeatureGate permission="admin:config" title="Old / new values">
        <ul className="space-y-2 text-xs">
          {entries.filter((e) => e.oldValue && e.newValue).map((e) => (
            <li key={e.id} className="rounded bg-parchment-50 p-2">
              <span className="font-mono">{e.entityId}</span>.{e.field}: <del className="text-signal-red">{e.oldValue}</del> → <span className="text-cerulean-700">{e.newValue}</span>
            </li>
          ))}
        </ul>
      </FeatureGate>

      <FeatureGate permission="admin:config" title="Critical edit tracking">
        <p className="text-xs text-ink-600">{entries.length} audit entries on record</p>
      </FeatureGate>
    </div>
  )
}
