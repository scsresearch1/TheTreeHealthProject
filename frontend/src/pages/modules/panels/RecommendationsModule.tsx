import { useState } from 'react'
import { useDataStore } from '../../../stores/dataStore'
import { useCurrentUserId } from '../../../hooks/useCurrentUser'
import FeatureGate from '../../../components/modules/FeatureGate'
import Button from '../../../components/Button'
import Badge from '../../../components/Badge'

export default function RecommendationsModule() {
  const userId = useCurrentUserId()
  const { recommendations, trees, config, addRecommendation } = useDataStore()
  const [treeId, setTreeId] = useState('TH-3102')

  return (
    <div className="space-y-4">
      <FeatureGate permission="maintenance:create" title="Rule engine">
        <p className="text-xs text-ink-600 mb-2">Active rules from config:</p>
        <ul className="space-y-1 text-xs">
          {config.recommendation_rules.rules.map((r) => (
            <li key={r.id} className="rounded bg-parchment-50 px-2 py-1">{r.condition} → {r.action}</li>
          ))}
        </ul>
        <Button size="sm" className="mt-2" onClick={() => {
          const tree = trees.find((t) => t.treeId === treeId)
          addRecommendation({
            treeId,
            zoneId: tree?.zoneId ?? 'zone-a1',
            type: 'irrigation',
            priority: 'high',
            rationale: 'Triggered by rule engine',
            suggestedActions: ['Review soil moisture', 'Schedule irrigation'],
            basedOn: { moisture: 18 },
          }, userId)
        }}>Run rules for selected tree</Button>
      </FeatureGate>

      <FeatureGate permission="maintenance:create" title="Priority levels">
        <select className="rounded-lg border px-2 py-1 text-sm mb-2" value={treeId} onChange={(e) => setTreeId(e.target.value)}>
          {trees.map((t) => <option key={t.treeId} value={t.treeId}>{t.treeId}</option>)}
        </select>
        <div className="space-y-2">
          {recommendations.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded border border-ink-100 px-3 py-2 text-xs">
              <span>{r.treeId}: {r.suggestedActions[0]}</span>
              <Badge variant={r.priority === 'urgent' ? 'critical' : 'warning'}>{r.priority}</Badge>
            </div>
          ))}
        </div>
      </FeatureGate>

      <FeatureGate permission="reports:view" title="Explanations">
        <ul className="space-y-2 text-xs text-ink-700">
          {recommendations.map((r) => (
            <li key={r.id} className="rounded-lg bg-parchment-50 p-2">
              <p className="font-medium">{r.treeId}</p>
              <p className="text-ink-500">{r.rationale}</p>
            </li>
          ))}
        </ul>
      </FeatureGate>

      <FeatureGate permission="maintenance:create" title="Suggested actions">
        <ul className="space-y-1 text-xs">
          {recommendations.flatMap((r) => r.suggestedActions.map((a, i) => (
            <li key={`${r.id}-${i}`} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-copper-400" />
              {r.treeId}: {a}
            </li>
          )))}
        </ul>
      </FeatureGate>
    </div>
  )
}
