import { useState } from 'react'
import { useDataStore } from '../../../stores/dataStore'
import { useCurrentUserId } from '../../../hooks/useCurrentUser'
import FeatureGate from '../../../components/modules/FeatureGate'
import Button from '../../../components/Button'

export default function ImagesModule() {
  const userId = useCurrentUserId()
  const { images, trees, addImage, annotateImage } = useDataStore()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [category, setCategory] = useState('leaf')
  const [annotation, setAnnotation] = useState('')
  const [compare, setCompare] = useState(false)

  return (
    <div className="space-y-4">
      <FeatureGate permission="images:upload" title="Multi-category upload">
        <div className="flex flex-wrap gap-2">
          {['leaf', 'stem_trunk', 'full_tree', 'pest_damage'].map((c) => (
            <button key={c} type="button" onClick={() => setCategory(c)} className={`rounded px-2 py-1 text-xs capitalize ${category === c ? 'bg-copper-100' : 'bg-ink-50'}`}>{c.replace('_', ' ')}</button>
          ))}
        </div>
        <input
          type="file"
          accept="image/*"
          className="mt-2 text-sm"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            addImage({
              treeId: trees[0]?.treeId ?? 'TH-4821',
              imageType: category,
              category,
              capturedAt: new Date().toISOString(),
              uploadedBy: userId,
              annotations: [],
            }, file.name, userId)
          }}
        />
      </FeatureGate>

      <FeatureGate permission="images:upload" title="Before / after">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked)} />
          Show before/after pairs
        </label>
        {compare && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {images.slice(0, 2).map((img) => (
              <div key={img.id} className="rounded-lg bg-ink-900 p-2 text-center text-[10px] text-ink-300">
                {img.imageType}<br />{img.treeId}
              </div>
            ))}
          </div>
        )}
      </FeatureGate>

      <FeatureGate permission="images:upload" title="Timeline">
        <ul className="max-h-48 space-y-1 overflow-y-auto text-xs">
          {images.map((img) => (
            <li key={img.id} className="flex cursor-pointer justify-between rounded px-2 py-1 hover:bg-parchment-50" onClick={() => setSelectedId(img.id)}>
              <span>{img.treeId} · {img.category}</span>
              <span className="text-ink-400">{new Date(img.capturedAt as string).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </FeatureGate>

      <FeatureGate permission="images:annotate" title="Annotations">
        {selectedId && (
          <div className="space-y-2">
            <textarea className="w-full rounded-lg border border-parchment-300 p-2 text-sm" rows={2} value={annotation} onChange={(e) => setAnnotation(e.target.value)} placeholder="Add annotation..." />
            <Button size="sm" onClick={() => { annotateImage(selectedId, annotation, userId); setAnnotation('') }}>Save annotation</Button>
          </div>
        )}
        {!selectedId && <p className="text-xs text-ink-500">Select an image from the timeline</p>}
      </FeatureGate>

      <FeatureGate permission="images:upload" title="Object storage URLs">
        <ul className="space-y-1 font-mono text-[10px] text-ink-600">
          {images.slice(0, 5).map((img) => (
            <li key={img.id} className="truncate">{img.storageUrl}</li>
          ))}
        </ul>
      </FeatureGate>
    </div>
  )
}
