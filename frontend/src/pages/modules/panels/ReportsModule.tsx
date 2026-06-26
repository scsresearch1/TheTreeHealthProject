import { useState } from 'react'
import { useDataStore } from '../../../stores/dataStore'
import { useCurrentUserId } from '../../../hooks/useCurrentUser'
import FeatureGate from '../../../components/modules/FeatureGate'
import Button from '../../../components/Button'
import { reportDownloadUrl } from '../../../lib/api/reports'

export default function ReportsModule() {
  const userId = useCurrentUserId()
  const { reports, generateReport, exportReportCsv } = useDataStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runGenerate = async (type: string) => {
    setLoading(true)
    setError(null)
    try {
      await generateReport(type, userId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report')
    } finally {
      setLoading(false)
    }
  }

  const downloadCsv = () => {
    const csv = exportReportCsv()
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tthp-report-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-lg border border-signal-red/30 bg-signal-red/5 px-3 py-2 text-xs text-signal-red">{error}</p>
      )}

      <FeatureGate permission="reports:view" title="Daily / weekly / monthly">
        <div className="flex flex-wrap gap-2">
          {['daily', 'weekly', 'monthly'].map((type) => (
            <Button key={type} size="sm" variant="outline" isLoading={loading} onClick={() => runGenerate(type)}>
              Generate {type} PDF
            </Button>
          ))}
        </div>
        <ul className="mt-3 space-y-2 text-xs">
          {reports.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded bg-parchment-50 px-2 py-1.5">
              <div>
                <p className="font-medium text-ink-900">{r.title}</p>
                <p className="text-ink-500">{new Date(r.createdAt).toLocaleString()} · {r.status}</p>
              </div>
              {r.downloadUrl && (
                <a
                  href={reportDownloadUrl(r.id)}
                  className="font-medium text-copper-600 hover:text-copper-500"
                  download
                >
                  Download PDF
                </a>
              )}
            </li>
          ))}
        </ul>
      </FeatureGate>

      <FeatureGate permission="reports:view" title="Zone reports">
        <p className="text-xs text-ink-600">PDFs include Reach 12 zone data from live inventory.</p>
        <Button size="sm" className="mt-2" isLoading={loading} onClick={() => runGenerate('zone')}>
          Generate zone PDF
        </Button>
      </FeatureGate>

      <FeatureGate permission="reports:export" title="Excel / CSV export">
        <Button size="sm" variant="outline" onClick={downloadCsv}>
          Download tree inventory CSV
        </Button>
      </FeatureGate>
    </div>
  )
}
