import { useRef, useState } from 'react'
import { useDataStore } from '../../../stores/dataStore'
import { useCurrentUserId } from '../../../hooks/useCurrentUser'
import FeatureGate from '../../../components/modules/FeatureGate'
import Button from '../../../components/Button'
import Input from '../../../components/Input'

export default function SoilModule() {
  const userId = useCurrentUserId()
  const { soil_readings, trees, zones, addSoilReading, importSoilCsv } = useDataStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({ treeId: 'TH-4821', moisture: '35', ph: '6.5' })
  const [importMsg, setImportMsg] = useState('')

  const zoneMoisture = zones.map((z) => {
    const readings = soil_readings.filter((r) => r.zoneId === z.id)
    const avg = readings.reduce((s, r) => s + r.moisture, 0) / (readings.length || 1)
    return { zone: z.name, moisture: avg }
  })

  return (
    <div className="space-y-4">
      <FeatureGate permission="soil:write" title="Manual entry">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-ink-800">Tree</label>
            <select className="w-full rounded-lg border border-parchment-300 px-3 py-2 text-sm" value={form.treeId} onChange={(e) => setForm({ ...form, treeId: e.target.value })}>
              {trees.map((t) => <option key={t.treeId} value={t.treeId}>{t.treeId}</option>)}
            </select>
          </div>
          <Input label="Moisture %" type="number" value={form.moisture} onChange={(e) => setForm({ ...form, moisture: e.target.value })} />
          <Input label="pH" type="number" step="0.1" value={form.ph} onChange={(e) => setForm({ ...form, ph: e.target.value })} />
        </div>
        <Button className="mt-3" onClick={() => {
          const tree = trees.find((t) => t.treeId === form.treeId)
          if (!tree) return
          const moisture = Number(form.moisture)
          addSoilReading({
            treeId: form.treeId,
            zoneId: tree.zoneId,
            samplingPoint: `SP-${form.treeId}`,
            moisture,
            ph: Number(form.ph),
            electricalConductivity: 1.2,
            nitrogen: 20,
            phosphorus: 15,
            potassium: 18,
            healthScore: moisture > 30 ? 80 : 50,
            classification: moisture > 30 ? 'good' : moisture > 20 ? 'moderate' : 'poor',
            source: 'manual',
          }, userId)
        }}>Save reading</Button>
      </FeatureGate>

      <FeatureGate permission="soil:write" title="CSV / Excel upload">
        <input ref={fileRef} type="file" accept=".csv,.txt" className="text-sm" onChange={async (e) => {
          const file = e.target.files?.[0]
          if (!file) return
          const text = await file.text()
          const rows = text.trim().split('\n').map((l) => l.split(','))
          const count = importSoilCsv(rows, userId)
          setImportMsg(`Imported ${count} readings from ${file.name}`)
        }} />
        {importMsg && <p className="mt-2 text-xs text-cerulean-700">{importMsg}</p>}
        <p className="mt-1 text-[10px] text-ink-500">CSV columns: treeId, moisture, ph</p>
      </FeatureGate>

      <FeatureGate permission="soil:read" title="Health score">
        <table className="w-full text-xs">
          <thead><tr className="text-[10px] uppercase text-ink-500"><th className="py-1 text-left">Tree</th><th>Score</th><th>Class</th></tr></thead>
          <tbody>
            {soil_readings.slice(0, 8).map((r) => (
              <tr key={r.id} className="border-t border-ink-50">
                <td className="py-1.5 font-mono">{r.treeId}</td>
                <td className="text-center">{r.healthScore}</td>
                <td className="text-center capitalize">{r.classification}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </FeatureGate>

      <FeatureGate permission="soil:read" title="Trends">
        <div className="flex h-24 items-end gap-1">
          {soil_readings.slice(0, 12).map((r) => (
            <div key={r.id} className="flex-1 rounded-t bg-cerulean-500/80" style={{ height: `${r.moisture}%` }} title={`${r.treeId}: ${r.moisture}%`} />
          ))}
        </div>
        <p className="mt-1 text-[10px] text-ink-500">Moisture % by latest readings</p>
      </FeatureGate>

      <FeatureGate permission="soil:read" title="GIS heatmap">
        <div className="grid grid-cols-3 gap-2">
          {zoneMoisture.map((z) => (
            <div
              key={z.zone}
              className="rounded-lg p-3 text-center text-xs text-white"
              style={{ backgroundColor: z.moisture < 20 ? '#b84a3a' : z.moisture < 30 ? '#c4922a' : '#3a85a8' }}
            >
              <p className="font-medium">{z.zone}</p>
              <p className="font-mono">{Math.round(z.moisture)}%</p>
            </div>
          ))}
        </div>
      </FeatureGate>
    </div>
  )
}
