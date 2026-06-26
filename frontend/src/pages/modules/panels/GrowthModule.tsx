import { useDataStore } from '../../../stores/dataStore'
import { useCurrentUserId } from '../../../hooks/useCurrentUser'
import FeatureGate from '../../../components/modules/FeatureGate'
import Button from '../../../components/Button'

export default function GrowthModule() {
  const userId = useCurrentUserId()
  const { growth_records, trees, addGrowthRecord } = useDataStore()

  const speciesAvg = Object.entries(
    trees.reduce<Record<string, { h: number; n: number }>>((acc, t) => {
      const e = acc[t.speciesName] ?? { h: 0, n: 0 }
      e.h += t.height ?? 0
      e.n += 1
      acc[t.speciesName] = e
      return acc
    }, {}),
  ).map(([species, { h, n }]) => ({ species, avg: h / n }))

  return (
    <div className="space-y-4">
      <FeatureGate permission="trees:read" title="Growth timeline">
        <table className="w-full text-xs">
          <thead><tr className="text-[10px] uppercase text-ink-500"><th className="text-left">Tree</th><th>Height</th><th>Canopy</th><th>DBH</th><th>Rate</th></tr></thead>
          <tbody>
            {growth_records.map((g) => (
              <tr key={g.id} className="border-t border-ink-50">
                <td className="py-1 font-mono">{g.treeId}</td>
                <td>{g.height}m</td><td>{g.canopySize}m</td><td>{g.trunkDiameter}cm</td>
                <td>{g.growthRate}m/yr</td>
              </tr>
            ))}
          </tbody>
        </table>
      </FeatureGate>

      <FeatureGate permission="trees:read" title="Rate calculation">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {trees.slice(0, 4).map((t) => (
            <div key={t.treeId} className="rounded-lg bg-parchment-50 p-2 text-center">
              <p className="font-mono text-[10px]">{t.treeId}</p>
              <p className="text-lg font-medium">{((t.height ?? 0) / (t.ageEstimate || 1)).toFixed(2)}</p>
              <p className="text-[10px] text-ink-500">m / year est.</p>
            </div>
          ))}
        </div>
      </FeatureGate>

      <FeatureGate permission="trees:write" title="Anomaly detection">
        <ul className="space-y-1 text-xs">
          {growth_records.filter((g) => g.anomalyFlags?.length).map((g) => (
            <li key={g.id} className="text-signal-amber">{g.treeId}: {g.anomalyFlags.join(', ')}</li>
          ))}
          {growth_records.filter((g) => g.anomalyFlags?.length).length === 0 && <li className="text-ink-500">No anomalies flagged</li>}
        </ul>
        <Button size="sm" className="mt-2" onClick={() => {
          const t = trees[0]
          if (!t) return
          addGrowthRecord({ treeId: t.treeId, height: t.height ?? 10, canopySize: t.canopySize ?? 5, trunkDiameter: t.trunkDiameter ?? 40, growthRate: 0.05, anomalyFlags: ['slow_growth'] }, userId)
        }}>Record anomaly check</Button>
      </FeatureGate>

      <FeatureGate permission="reports:view" title="Species comparison">
        <div className="flex h-28 items-end gap-2">
          {speciesAvg.map((s) => (
            <div key={s.species} className="flex flex-1 flex-col items-center gap-1">
              <div className="w-full rounded-t bg-cerulean-500" style={{ height: `${s.avg * 6}px` }} />
              <span className="text-[9px] text-ink-500 truncate max-w-full">{s.species.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </FeatureGate>
    </div>
  )
}
