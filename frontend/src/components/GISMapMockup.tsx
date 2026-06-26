import type { HealthStatus } from '../data/mockDashboard'

interface GISMapMockupProps {
  compact?: boolean
  showLegend?: boolean
}

const markers: { x: number; y: number; health: HealthStatus; id: string }[] = [
  { x: 22, y: 35, health: 'healthy', id: 'TH-4821' },
  { x: 45, y: 28, health: 'at_risk', id: 'TH-3102' },
  { x: 68, y: 42, health: 'stressed', id: 'TH-7744' },
  { x: 35, y: 58, health: 'healthy', id: 'TH-1190' },
  { x: 78, y: 65, health: 'critical', id: 'TH-9033' },
  { x: 55, y: 72, health: 'healthy', id: 'TH-2201' },
  { x: 15, y: 68, health: 'stressed', id: 'TH-5510' },
  { x: 88, y: 30, health: 'healthy', id: 'TH-6612' },
]

const healthColors: Record<HealthStatus, string> = {
  healthy: '#3a85a8',
  stressed: '#c4922a',
  at_risk: '#d4622a',
  critical: '#b84a3a',
}

export default function GISMapMockup({ compact = false, showLegend = true }: GISMapMockupProps) {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-ink-200 bg-ink-950 ${compact ? 'h-64' : 'h-full min-h-[320px]'}`}>
      <div className="absolute inset-0 map-grid opacity-40" />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d="M8,20 L35,8 L72,15 L92,35 L88,75 L55,92 L18,85 L5,50 Z"
          fill="rgb(58 133 168 / 0.1)"
          stroke="rgb(91 163 196 / 0.45)"
          strokeWidth="0.5"
          strokeDasharray="2 1"
        />
        <line x1="50" y1="8" x2="50" y2="92" stroke="rgb(91 163 196 / 0.15)" strokeWidth="0.3" />
        <line x1="8" y1="50" x2="92" y2="50" stroke="rgb(91 163 196 / 0.15)" strokeWidth="0.3" />
      </svg>

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
        {markers.map((m) => (
          <g key={m.id}>
            <circle cx={m.x} cy={m.y} r="3" fill={healthColors[m.health]} opacity="0.3" />
            <circle cx={m.x} cy={m.y} r="1.5" fill={healthColors[m.health]} />
            {!compact && (
              <text x={m.x} y={m.y - 3} textAnchor="middle" fill="rgb(197 226 239)" fontSize="2.5" fontFamily="monospace">
                {m.id.split('-')[1]}
              </text>
            )}
          </g>
        ))}
      </svg>

      <div className="absolute left-3 top-3 flex flex-col gap-1">
        <button type="button" className="flex h-7 w-7 items-center justify-center rounded bg-ink-900/90 text-ink-300 text-sm ring-1 ring-ink-700">+</button>
        <button type="button" className="flex h-7 w-7 items-center justify-center rounded bg-ink-900/90 text-ink-300 text-sm ring-1 ring-ink-700">−</button>
      </div>

      <div className="absolute right-3 top-3 rounded-lg bg-ink-900/90 px-2.5 py-1.5 ring-1 ring-ink-700">
        <p className="text-[10px] font-medium text-ink-300">Layers</p>
        <div className="mt-1 space-y-0.5">
          {['Canopy', 'Soil zones', 'Inventory'].map((layer) => (
            <label key={layer} className="flex items-center gap-1.5 text-[9px] text-ink-400">
              <span className="h-2 w-2 rounded-sm bg-cerulean-500/60" />
              {layer}
            </label>
          ))}
        </div>
      </div>

      <div className="absolute bottom-3 left-3 rounded bg-ink-900/90 px-2 py-1 font-mono text-[9px] text-ink-400 ring-1 ring-ink-700">
        51.423°N, 0.381°W · Zoom 14
      </div>

      {showLegend && (
        <div className="absolute bottom-3 right-3 flex gap-2 rounded-lg bg-ink-900/90 px-2.5 py-1.5 ring-1 ring-ink-700">
          {(['healthy', 'stressed', 'at_risk', 'critical'] as HealthStatus[]).map((h) => (
            <div key={h} className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: healthColors[h] }} />
              <span className="text-[9px] capitalize text-ink-400">{h.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
