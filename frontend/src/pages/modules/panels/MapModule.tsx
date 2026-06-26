import { useState } from 'react'
import { useDataStore } from '../../../stores/dataStore'
import { useCurrentUserId } from '../../../hooks/useCurrentUser'
import FeatureGate from '../../../components/modules/FeatureGate'
import GISTreeMap from '../../../components/GISTreeMap'
import Button from '../../../components/Button'
import Input from '../../../components/Input'

const HEALTH_OPTIONS = ['healthy', 'moderate_risk', 'diseased', 'pest_affected', 'requires_inspection']

export default function MapModule() {
  const userId = useCurrentUserId()
  const addTree = useDataStore((s) => s.addTree)
  const zones = useDataStore((s) => s.zones)
  const [filters, setFilters] = useState<string[]>([])
  const [clickCoords, setClickCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [newSpecies, setNewSpecies] = useState('')

  const toggleFilter = (h: string) => {
    setFilters((f) => f.includes(h) ? f.filter((x) => x !== h) : [...f, h])
  }

  return (
    <div className="space-y-4">
      <FeatureGate permission="trees:read" title="Tree markers & health colors">
        <GISTreeMap filterHealth={filters.length ? filters : undefined} onMapClick={undefined} />
      </FeatureGate>

      <FeatureGate permission="trees:read" title="Layer filters">
        <div className="flex flex-wrap gap-2">
          {HEALTH_OPTIONS.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => toggleFilter(h)}
              className={`rounded-full px-3 py-1 text-xs capitalize ${filters.includes(h) ? 'bg-copper-100 text-ink-900 ring-1 ring-copper-300' : 'bg-ink-50 text-ink-600'}`}
            >
              {h.replace(/_/g, ' ')}
            </button>
          ))}
          {filters.length > 0 && (
            <button type="button" onClick={() => setFilters([])} className="text-xs text-copper-600">Clear</button>
          )}
        </div>
      </FeatureGate>

      <FeatureGate permission="trees:read" title="GPS coordinates">
        <p className="font-mono text-sm text-ink-700">
          {clickCoords
            ? `${clickCoords.lat.toFixed(5)}°N, ${Math.abs(clickCoords.lng).toFixed(5)}°W`
            : 'Click the map below to capture coordinates'}
        </p>
      </FeatureGate>

      <FeatureGate permission="trees:write" title="Add tree by map click">
        <GISTreeMap
          compact
          showLegend={false}
          onMapClick={(lat, lng) => setClickCoords({ lat, lng })}
        />
        {clickCoords && (
          <div className="mt-3 flex flex-wrap items-end gap-2">
            <Input label="Species name" value={newSpecies} onChange={(e) => setNewSpecies(e.target.value)} className="max-w-xs" />
            <Button onClick={() => {
              if (!newSpecies) return
              addTree({
                speciesId: newSpecies.toLowerCase().replace(/\s/g, '-'),
                speciesName: newSpecies,
                location: clickCoords,
                zoneId: zones[0]?.id ?? 'zone-a1',
                healthStatus: 'healthy',
                riskLevel: 'low',
                ageEstimate: 5,
                height: 6,
                trunkDiameter: 20,
                canopySize: 4,
                plantationDate: new Date().toISOString().slice(0, 10),
              }, userId)
              setNewSpecies('')
              setClickCoords(null)
            }}>Place tree here</Button>
          </div>
        )}
      </FeatureGate>
    </div>
  )
}
