import { useState } from 'react'
import { useDataStore } from '../../../stores/dataStore'
import { useCurrentUserId } from '../../../hooks/useCurrentUser'
import FeatureGate from '../../../components/modules/FeatureGate'
import Button from '../../../components/Button'
import GISTreeMap from '../../../components/GISTreeMap'

export default function DiseasePestModule() {
  const userId = useCurrentUserId()
  const { disease_records, pest_records, trees, addDiseaseRecord, addPestRecord, approveDisease, approvePest, runAiDetection } = useDataStore()
  const [treeId, setTreeId] = useState('TH-3102')

  return (
    <div className="space-y-4">
      <FeatureGate permission="disease:tag" title="Manual tagging">
        <div className="flex flex-wrap gap-2">
          <select className="rounded-lg border px-2 py-1 text-sm" value={treeId} onChange={(e) => setTreeId(e.target.value)}>
            {trees.map((t) => <option key={t.treeId} value={t.treeId}>{t.treeId}</option>)}
          </select>
          <Button size="sm" onClick={() => addDiseaseRecord({ treeId, diseaseCategoryId: 'defoliation', diseaseName: 'Manual tag', severity: 'medium', confidence: 1, notes: 'Field observation' }, userId)}>Tag disease</Button>
          <Button size="sm" variant="outline" onClick={() => addPestRecord({ treeId, pestCategoryId: 'aphid', pestName: 'Manual pest tag', severity: 'low', confidence: 1, notes: 'Field observation' }, userId)}>Tag pest</Button>
        </div>
      </FeatureGate>

      <FeatureGate permission="disease:tag" title="AI API">
        <div className="flex gap-2">
          <Button onClick={() => runAiDetection(treeId, 'disease', userId)}>Run disease AI</Button>
          <Button variant="outline" onClick={() => runAiDetection(treeId, 'pest', userId)}>Run pest AI</Button>
        </div>
      </FeatureGate>

      <FeatureGate permission="disease:tag" title="Confidence scores">
        <table className="w-full text-xs">
          <thead><tr className="text-[10px] uppercase text-ink-500"><th className="text-left">Type</th><th>Tree</th><th>Confidence</th><th>Status</th></tr></thead>
          <tbody>
            {disease_records.map((d) => (
              <tr key={d.id} className="border-t border-ink-50">
                <td className="py-1">Disease</td><td className="font-mono">{d.treeId}</td>
                <td>{(d.confidence * 100).toFixed(0)}%</td><td className="capitalize">{d.verificationStatus.replace(/_/g, ' ')}</td>
              </tr>
            ))}
            {pest_records.map((p) => (
              <tr key={p.id} className="border-t border-ink-50">
                <td className="py-1">Pest</td><td className="font-mono">{p.treeId}</td>
                <td>{(p.confidence * 100).toFixed(0)}%</td><td className="capitalize">{p.verificationStatus.replace(/_/g, ' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </FeatureGate>

      <FeatureGate permission="disease:approve" title="Verification workflow">
        <ul className="space-y-2 text-xs">
          {disease_records.filter((d) => d.verificationStatus !== 'supervisor_approved').map((d) => (
            <li key={d.id} className="flex items-center justify-between rounded bg-parchment-50 px-2 py-1.5">
              <span>{d.diseaseName} on {d.treeId}</span>
              <Button size="sm" onClick={() => approveDisease(d.id, userId)}>Approve</Button>
            </li>
          ))}
          {disease_records.filter((d) => d.verificationStatus !== 'supervisor_approved').length === 0 && (
            <li className="text-ink-500">All disease records verified</li>
          )}
        </ul>
      </FeatureGate>

      <FeatureGate permission="pest:approve" title="Approve pest records">
        <ul className="space-y-2 text-xs">
          {pest_records.filter((p) => p.verificationStatus !== 'supervisor_approved').map((p) => (
            <li key={p.id} className="flex items-center justify-between rounded bg-parchment-50 px-2 py-1.5">
              <span>{p.pestName} on {p.treeId}</span>
              <Button size="sm" onClick={() => approvePest(p.id, userId)}>Approve</Button>
            </li>
          ))}
        </ul>
      </FeatureGate>

      <FeatureGate permission="pest:tag" title="Spread maps">
        <GISTreeMap compact filterHealth={['diseased', 'pest_affected', 'moderate_risk']} />
        <p className="mt-1 text-[10px] text-ink-500">Trees with disease or pest flags highlighted</p>
      </FeatureGate>
    </div>
  )
}
