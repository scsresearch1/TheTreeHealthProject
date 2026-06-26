import { useState } from 'react'
import { useDataStore } from '../../../stores/dataStore'
import { useCurrentUserId } from '../../../hooks/useCurrentUser'
import FeatureGate from '../../../components/modules/FeatureGate'
import Button from '../../../components/Button'
import Input from '../../../components/Input'

export default function FieldModule() {
  const userId = useCurrentUserId()
  const { trees, logFieldInspection } = useDataStore()
  const [qrInput, setQrInput] = useState('')
  const [notes, setNotes] = useState('')
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null)
  const [scannedTree, setScannedTree] = useState<string | null>(null)

  const tree = trees.find((t) => t.treeId === (scannedTree ?? qrInput))

  return (
    <div className="space-y-4">
      <FeatureGate permission="trees:read" title="Responsive field UI">
        <p className="text-sm text-ink-600">Mobile-optimized quick actions for field crews.</p>
      </FeatureGate>

      <FeatureGate permission="trees:write" title="GPS capture">
        <Button onClick={() => {
          if (!navigator.geolocation) return
          navigator.geolocation.getCurrentPosition((pos) => {
            setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude })
          })
        }}>Capture GPS</Button>
        {gps && <p className="mt-2 font-mono text-xs">{gps.lat.toFixed(5)}, {gps.lng.toFixed(5)}</p>}
      </FeatureGate>

      <FeatureGate permission="trees:read" title="QR scan">
        <Input label="Scan or enter tree ID" value={qrInput} onChange={(e) => setQrInput(e.target.value)} placeholder="TH-4821" />
        <Button size="sm" className="mt-2" onClick={() => setScannedTree(qrInput)}>Lookup tree</Button>
        {tree && (
          <div className="mt-2 rounded-lg bg-cerulean-50 p-3 text-xs">
            <p className="font-medium">{tree.speciesName}</p>
            <p className="text-ink-600">{tree.healthStatus.replace(/_/g, ' ')} · {tree.zoneId}</p>
          </div>
        )}
      </FeatureGate>

      <FeatureGate permission="images:upload" title="Camera upload">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="text-sm"
          onChange={() => {
            const id = scannedTree ?? qrInput
            if (id) logFieldInspection(id, 'Photo captured in field', tree?.healthStatus ?? 'healthy', userId)
          }}
        />
      </FeatureGate>

      <FeatureGate permission="maintenance:complete" title="Quick inspection">
        <textarea className="w-full rounded-lg border border-parchment-300 p-2 text-sm" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Inspection notes..." />
        <Button className="mt-2" disabled={!scannedTree && !qrInput} onClick={() => {
          const id = scannedTree ?? qrInput
          logFieldInspection(id, notes || 'Quick inspection completed', 'requires_inspection', userId)
          setNotes('')
        }}>Submit inspection</Button>
      </FeatureGate>
    </div>
  )
}
