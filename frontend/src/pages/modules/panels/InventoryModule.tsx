import { useState } from 'react'
import { useDataStore, zoneName } from '../../../stores/dataStore'
import { useCurrentUserId } from '../../../hooks/useCurrentUser'
import FeatureGate from '../../../components/modules/FeatureGate'
import Button from '../../../components/Button'
import Input from '../../../components/Input'
import Badge from '../../../components/Badge'

export default function InventoryModule() {
  const userId = useCurrentUserId()
  const { trees, zones, audit_trail, addTree, updateTree, deleteTree } = useDataStore()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [form, setForm] = useState({ speciesName: '', zoneId: 'zone-a1', healthStatus: 'healthy' as const })

  const filtered = trees.filter(
    (t) =>
      t.treeId.toLowerCase().includes(search.toLowerCase()) ||
      t.speciesName.toLowerCase().includes(search.toLowerCase()),
  )
  const selectedTree = trees.find((t) => t.treeId === selected)
  const history = audit_trail.filter((a) => a.entityId === selected)

  return (
    <div className="space-y-4">
      <FeatureGate permission="trees:read" title="Search & filter">
        <Input label="Search trees" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tree ID or species..." />
        <div className="mt-3 max-h-64 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-ink-100 text-[10px] uppercase text-ink-500">
                <th className="py-2">ID</th><th className="py-2">Species</th><th className="py-2">Zone</th><th className="py-2">Health</th><th className="py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {filtered.map((t) => (
                <tr key={t.treeId} className="cursor-pointer hover:bg-parchment-50" onClick={() => setSelected(t.treeId)}>
                  <td className="py-2 font-mono">{t.treeId}</td>
                  <td className="py-2">{t.speciesName}</td>
                  <td className="py-2">{zoneName(t.zoneId, zones)}</td>
                  <td className="py-2"><Badge variant="info" size="sm">{t.healthStatus.replace(/_/g, ' ')}</Badge></td>
                  <td className="py-2 text-right">
                    <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setSelected(t.treeId) }}>View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FeatureGate>

      <FeatureGate permission="trees:write" title="Add / edit trees">
        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Species" value={form.speciesName} onChange={(e) => setForm({ ...form, speciesName: e.target.value })} />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-ink-800">Zone</label>
            <select className="w-full rounded-lg border border-parchment-300 px-3 py-2 text-sm" value={form.zoneId} onChange={(e) => setForm({ ...form, zoneId: e.target.value })}>
              {zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <Button onClick={() => {
            if (!form.speciesName) return
            const id =             addTree({
              speciesId: form.speciesName.toLowerCase().replace(/\s/g, '-'),
              speciesName: form.speciesName,
              location: { lat: 51.42 + Math.random() * 0.01, lng: -0.38 + Math.random() * 0.01 },
              zoneId: form.zoneId,
              healthStatus: form.healthStatus,
              riskLevel: 'low',
              ageEstimate: 10,
              height: 8,
              trunkDiameter: 30,
              canopySize: 5,
              plantationDate: new Date().toISOString().slice(0, 10),
            }, userId)
            setSelected(id)
            setForm({ speciesName: '', zoneId: 'zone-a1', healthStatus: 'healthy' })
          }}>Add tree (auto ID)</Button>
          {selectedTree && (
            <Button variant="outline" onClick={() => updateTree(selectedTree.treeId, { healthStatus: 'requires_inspection' }, userId)}>
              Mark for inspection
            </Button>
          )}
        </div>
      </FeatureGate>

      {selectedTree && (
        <>
          <FeatureGate permission="trees:read" title="QR code">
            <div className="flex items-center gap-4 rounded-lg bg-parchment-50 p-4">
              <div className="flex h-20 w-20 items-center justify-center rounded border-2 border-ink-300 bg-white font-mono text-[10px] text-ink-700">
                {selectedTree.qrCode}
              </div>
              <div>
                <p className="font-mono text-sm font-medium">{selectedTree.qrCode}</p>
                <p className="text-xs text-ink-500">Scan to open tree record in field app</p>
              </div>
            </div>
          </FeatureGate>

          <FeatureGate permission="trees:read" title="Tree history">
            <ul className="space-y-1 text-xs text-ink-600">
              {history.length === 0 ? <li>No audit entries yet</li> : history.map((h) => (
                <li key={h.id}>{h.field} changed · {new Date(h.timestamp as string).toLocaleString()}</li>
              ))}
            </ul>
          </FeatureGate>

          <FeatureGate permission="trees:delete" title="Delete records">
            <Button variant="outline" onClick={() => { deleteTree(selectedTree.treeId, userId); setSelected(null) }}>
              Delete {selectedTree.treeId}
            </Button>
          </FeatureGate>
        </>
      )}
    </div>
  )
}
