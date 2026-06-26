import { useState } from 'react'
import { useDataStore } from '../../../stores/dataStore'
import { useCurrentUserId } from '../../../hooks/useCurrentUser'
import FeatureGate from '../../../components/modules/FeatureGate'
import Button from '../../../components/Button'
import Input from '../../../components/Input'

export default function AdminModule() {
  const userId = useCurrentUserId()
  const { config, zones, updateSoilThreshold, addSpecies } = useDataStore()
  const [species, setSpecies] = useState({ name: '', common: '' })
  const [moistureMin, setMoistureMin] = useState(String(config.soil_thresholds.moisture.min))

  return (
    <div className="space-y-4">
      <FeatureGate permission="admin:config" title="Species">
        <ul className="mb-2 space-y-1 text-xs">
          {config.species.items.map((s) => (
            <li key={s.id}>{s.name} ({s.commonName})</li>
          ))}
        </ul>
        <div className="flex gap-2">
          <Input label="Latin name" value={species.name} onChange={(e) => setSpecies({ ...species, name: e.target.value })} className="flex-1" />
          <Input label="Common name" value={species.common} onChange={(e) => setSpecies({ ...species, common: e.target.value })} className="flex-1" />
        </div>
        <Button size="sm" className="mt-2" onClick={() => { if (species.name) { addSpecies(species.name, species.common, userId); setSpecies({ name: '', common: '' }) } }}>Add species</Button>
      </FeatureGate>

      <FeatureGate permission="admin:config" title="Zones">
        <ul className="space-y-1 text-xs">
          {zones.map((z) => (
            <li key={z.id} className="rounded bg-parchment-50 px-2 py-1">{z.name} · {z.block} · {z.reach}</li>
          ))}
        </ul>
      </FeatureGate>

      <FeatureGate permission="admin:config" title="Disease / pest categories">
        <div className="grid gap-2 sm:grid-cols-2 text-xs">
          <ul>{config.disease_categories.items.map((d) => <li key={d.id}>{d.name}</li>)}</ul>
          <ul>{config.pest_categories.items.map((p) => <li key={p.id}>{p.name}</li>)}</ul>
        </div>
      </FeatureGate>

      <FeatureGate permission="admin:config" title="Soil thresholds">
        <Input label="Minimum moisture %" type="number" value={moistureMin} onChange={(e) => setMoistureMin(e.target.value)} />
        <Button size="sm" className="mt-2" onClick={() => updateSoilThreshold('min', Number(moistureMin), userId)}>Save threshold</Button>
        <p className="mt-1 text-[10px] text-ink-500">Ideal: {config.soil_thresholds.moisture.ideal}% · Critical: {config.soil_thresholds.moisture.critical}%</p>
      </FeatureGate>

      <FeatureGate permission="admin:config" title="Recommendation rules">
        <ul className="space-y-1 text-xs">
          {config.recommendation_rules.rules.map((r) => (
            <li key={r.id} className="rounded bg-parchment-50 px-2 py-1">{r.condition} → {r.action} ({r.priority})</li>
          ))}
        </ul>
      </FeatureGate>
    </div>
  )
}
