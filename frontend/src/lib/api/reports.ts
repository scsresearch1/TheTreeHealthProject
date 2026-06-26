import type { Alert, SoilReading, Tree, Zone, Report } from '../../stores/dataStore'
import { apiUrl } from './config'

export interface ReportPayload {
  type: string
  filters?: Record<string, string>
  generatedBy: string
  data: {
    trees: Tree[]
    alerts: Alert[]
    soil_readings: SoilReading[]
    zones: Zone[]
  }
}

export interface GenerateReportResponse {
  report: Report & { downloadUrl: string }
}

export async function generateReportApi(payload: ReportPayload): Promise<GenerateReportResponse> {
  const res = await fetch(apiUrl('/api/reports/generate'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Report generation failed (${res.status})`)
  }
  return res.json()
}

export function reportDownloadUrl(reportId: string) {
  return apiUrl(`/api/reports/${reportId}/download`)
}
