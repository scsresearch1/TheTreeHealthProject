import { useState } from 'react'
import { useDataStore } from '../../../stores/dataStore'
import { useCurrentUserId } from '../../../hooks/useCurrentUser'
import FeatureGate from '../../../components/modules/FeatureGate'
import Button from '../../../components/Button'
import Input from '../../../components/Input'
import Badge from '../../../components/Badge'

export default function MaintenanceModule() {
  const userId = useCurrentUserId()
  const { maintenance_tasks, trees, users, createMaintenanceTask, assignTask, updateTaskStatus, approveTask } = useDataStore()
  const [title, setTitle] = useState('')
  const [treeId, setTreeId] = useState('TH-3102')
  const fieldUsers = users.filter((u) => u.role === 'field_team')

  return (
    <div className="space-y-4">
      <FeatureGate permission="maintenance:create" title="Create tasks">
        <div className="flex flex-wrap gap-2">
          <Input label="Task title" value={title} onChange={(e) => setTitle(e.target.value)} className="flex-1 min-w-[200px]" />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-ink-800">Tree</label>
            <select className="rounded-lg border px-2 py-2 text-sm" value={treeId} onChange={(e) => setTreeId(e.target.value)}>
              {trees.map((t) => <option key={t.treeId} value={t.treeId}>{t.treeId}</option>)}
            </select>
          </div>
        </div>
        <Button className="mt-2" onClick={() => {
          if (!title) return
          const tree = trees.find((t) => t.treeId === treeId)
          createMaintenanceTask({
            treeId,
            zoneId: tree?.zoneId ?? 'zone-a1',
            category: 'inspection',
            title,
            assignedTo: fieldUsers[0]?.uid ?? 'seed-field',
            assignedBy: userId,
            dueDate: new Date(Date.now() + 3 * 86400000).toISOString(),
            priority: 'high',
          }, userId)
          setTitle('')
        }}>Create task</Button>
      </FeatureGate>

      <FeatureGate permission="maintenance:assign" title="Assign crews">
        <ul className="space-y-2 text-xs">
          {maintenance_tasks.map((t) => (
            <li key={t.id} className="flex flex-wrap items-center gap-2 rounded bg-parchment-50 px-2 py-1.5">
              <span className="flex-1">{t.title}</span>
              <select
                className="rounded border px-1 py-0.5 text-[10px]"
                value={t.assignedTo}
                onChange={(e) => assignTask(t.id, e.target.value, userId)}
              >
                {fieldUsers.map((u) => <option key={u.uid} value={u.uid}>{u.displayName}</option>)}
              </select>
            </li>
          ))}
        </ul>
      </FeatureGate>

      <FeatureGate permission="maintenance:complete" title="Status workflow">
        <ul className="space-y-2">
          {maintenance_tasks.map((t) => (
            <li key={t.id} className="flex items-center justify-between rounded border border-ink-100 px-3 py-2 text-xs">
              <span>{t.title}</span>
              <div className="flex gap-1">
                {(['assigned', 'in_progress', 'completed'] as const).map((s) => (
                  <button key={s} type="button" onClick={() => updateTaskStatus(t.id, s, userId)} className={`rounded px-2 py-0.5 capitalize ${t.status === s ? 'bg-copper-100' : 'bg-ink-50'}`}>{s.replace('_', ' ')}</button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </FeatureGate>

      <FeatureGate permission="maintenance:complete" title="Proof images">
        <Input label="Proof image URL" placeholder="https://..." onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const url = (e.target as HTMLInputElement).value
            const task = maintenance_tasks.find((t) => t.status === 'in_progress') ?? maintenance_tasks[0]
            if (task && url) updateTaskStatus(task.id, 'completed', userId, url)
          }
        }} hint="Press Enter to attach to in-progress task" />
      </FeatureGate>

      <FeatureGate permission="maintenance:approve" title="Overdue alerts">
        <ul className="text-xs text-signal-amber">
          {maintenance_tasks.filter((t) => t.status === 'overdue').map((t) => (
            <li key={t.id}>Overdue: {t.title} ({t.treeId})</li>
          ))}
          {maintenance_tasks.filter((t) => t.status === 'overdue').length === 0 && <li className="text-ink-500">No overdue tasks</li>}
        </ul>
      </FeatureGate>

      <FeatureGate permission="maintenance:approve" title="Approve completion">
        <ul className="space-y-2">
          {maintenance_tasks.filter((t) => t.status === 'completed').map((t) => (
            <li key={t.id} className="flex items-center justify-between text-xs">
              <span>{t.title} <Badge size="sm" variant="healthy">completed</Badge></span>
              <Button size="sm" onClick={() => approveTask(t.id, userId)}>Verify</Button>
            </li>
          ))}
        </ul>
      </FeatureGate>
    </div>
  )
}
