import { useMemo, useState } from 'react'
import { useDataStore } from '../stores/dataStore'
import type { HealthStatus } from '../data/mockDashboard'

const healthColors: Record<string, string> = {
  healthy: '#3a85a8',
  moderate_risk: '#c4922a',
  requires_inspection: '#c4922a',
  diseased: '#d4622a',
  pest_affected: '#b84a3a',
  stressed: '#c4922a',
  at_risk: '#d4622a',
  critical: '#b84a3a',
}

interface GISTreeMapProps {
  compact?: boolean
  showLegend?: boolean
  onMapClick?: (lat: number, lng: number) => void
  filterHealth?: string[]
  selectedTreeId?: string
}

function latLngToXY(lat: number, lng: number) {
  const x = ((lng + 0.392) / 0.022) * 84 + 8
  const y = ((51.427 - lat) / 0.012) * 84 + 8
  return { x: Math.min(92, Math.max(8, x)), y: Math.min(92, Math.max(8, y)) }
}

export default function GISTreeMap({
  compact = false,
  showLegend = true,
  onMapClick,
  filterHealth,
  selectedTreeId,
}: GISTreeMapProps) {
  const trees = useDataStore((s) => s.trees)
  const [layers, setLayers] = useState({ canopy: true, soil: true, inventory: true })

  const markers = useMemo(() => {
    return trees
      .filter((t) => !filterHealth?.length || filterHealth.includes(t.healthStatus))
      .map((t) => ({
        ...t,
        ...latLngToXY(t.location.lat, t.location.lng),
        color: healthColors[t.healthStatus] ?? '#3a85a8',
      }))
  }, [trees, filterHealth])

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onMapClick) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    const lat = 51.427 - ((y - 8) / 84) * 0.012
    const lng = -0.392 + ((x - 8) / 84) * 0.022
    onMapClick(lat, lng)
  }

  return (
    <div className={`relative overflow-hidden rounded-xl border border-ink-200 bg-ink-950 ${compact ? 'h-64' : 'h-full min-h-[320px]'}`}>
      <div className="absolute inset-0 map-grid opacity-40" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M8,20 L35,8 L72,15 L92,35 L88,75 L55,92 L18,85 L5,50 Z" fill="rgb(58 133 168 / 0.1)" stroke="rgb(91 163 196 / 0.45)" strokeWidth="0.5" strokeDasharray="2 1" />
      </svg>
      <svg
        className={`absolute inset-0 h-full w-full ${onMapClick ? 'cursor-crosshair' : ''}`}
        viewBox="0 0 100 100"
        onClick={handleClick}
      >
        {layers.inventory && markers.map((m) => (
          <g key={m.treeId}>
            <circle cx={m.x} cy={m.y} r={selectedTreeId === m.treeId ? 4 : 3} fill={m.color} opacity="0.35" />
            <circle cx={m.x} cy={m.y} r={selectedTreeId === m.treeId ? 2.5 : 1.5} fill={m.color} stroke={selectedTreeId === m.treeId ? '#fff' : 'none'} strokeWidth="0.5" />
            {!compact && (
              <text x={m.x} y={m.y - 3} textAnchor="middle" fill="rgb(197 226 239)" fontSize="2.5" fontFamily="monospace">
                {m.treeId.split('-')[1]}
              </text>
            )}
          </g>
        ))}
      </svg>
      <div className="absolute right-3 top-3 rounded-lg bg-ink-900/90 px-2.5 py-1.5 ring-1 ring-ink-700">
        <p className="text-[10px] font-medium text-ink-300">Layers</p>
        <div className="mt-1 space-y-0.5">
          {(['canopy', 'soil', 'inventory'] as const).map((layer) => (
            <label key={layer} className="flex cursor-pointer items-center gap-1.5 text-[9px] text-ink-400">
              <input
                type="checkbox"
                checked={layers[layer]}
                onChange={() => setLayers((l) => ({ ...l, [layer]: !l[layer] }))}
                className="h-2 w-2 rounded"
              />
              {layer === 'canopy' ? 'Canopy' : layer === 'soil' ? 'Soil zones' : 'Inventory'}
            </label>
          ))}
        </div>
      </div>
      <div className="absolute bottom-3 left-3 rounded bg-ink-900/90 px-2 py-1 font-mono text-[9px] text-ink-400 ring-1 ring-ink-700">
        {markers.length} trees · Zoom 14
      </div>
      {showLegend && (
        <div className="absolute bottom-3 right-3 flex flex-wrap gap-2 rounded-lg bg-ink-900/90 px-2.5 py-1.5 ring-1 ring-ink-700 max-w-[200px]">
          {Object.entries(healthColors).slice(0, 4).map(([h, c]) => (
            <div key={h} className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c }} />
              <span className="text-[9px] capitalize text-ink-400">{h.replace(/_/g, ' ')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function mapHealthToDisplay(status: string): HealthStatus {
  if (status === 'healthy') return 'healthy'
  if (status === 'pest_affected') return 'critical'
  if (status === 'diseased') return 'at_risk'
  if (status === 'moderate_risk' || status === 'requires_inspection') return 'stressed'
  return 'healthy'
}
