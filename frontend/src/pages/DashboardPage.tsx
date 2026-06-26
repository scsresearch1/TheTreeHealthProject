import Panel from '../components/Panel'
import Badge from '../components/Badge'
import StatCard from '../components/StatCard'
import {
  type HealthStatus,
  type TaskStatus,
} from '../data/mockDashboard'
import { IconTree, IconBell, IconWrench, IconChart } from '../components/icons'
import { useAccessControl } from '../hooks/useAccessControl'
import { useLiveDashboard } from '../hooks/useLiveDashboard'
import RoleGuard from '../components/RoleGuard'
import GISTreeMap from '../components/GISTreeMap'

const healthBadge: Record<HealthStatus, 'healthy' | 'stressed' | 'at_risk' | 'critical'> = {
  healthy: 'healthy',
  stressed: 'stressed',
  at_risk: 'at_risk',
  critical: 'critical',
}

const taskBadge: Record<TaskStatus, 'warning' | 'info' | 'healthy' | 'critical'> = {
  pending: 'warning',
  in_progress: 'info',
  completed: 'healthy',
  overdue: 'critical',
}

const alertBorder = {
  critical: 'border-l-signal-red',
  warning: 'border-l-signal-amber',
  info: 'border-l-cerulean-500',
}

function DashboardContent() {
  const { canViewWidget, user } = useAccessControl()
  const {
    dashboardStats,
    recentTrees,
    alerts,
    maintenanceTasks,
    recommendations,
    soilReadings,
    healthDistribution,
  } = useLiveDashboard()
  const showKpis = canViewWidget('kpis')
  const showMap = canViewWidget('map')
  const showInventory = canViewWidget('inventory')
  const showAlerts = canViewWidget('alerts')
  const showSoil = canViewWidget('soil')
  const showVision = canViewWidget('vision')
  const showRecommendations = canViewWidget('recommendations')
  const showMaintenance = canViewWidget('maintenance')
  const showReporting = canViewWidget('reporting')

  const mainColSpan = showMap ? 'lg:col-span-8' : 'lg:col-span-12'
  const hasRightRail = showInventory || showAlerts

  return (
    <div className="space-y-4 p-4">
      {showKpis && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Inventory" value={dashboardStats.totalTrees.toLocaleString()} sub="8 reaches" trend={{ value: '+124', positive: true }} icon={<IconTree className="h-4 w-4" />} />
          <StatCard label="Healthy" value={`${dashboardStats.healthyPct}%`} sub="fleet avg" trend={{ value: '+2.1%', positive: true }} icon={<IconChart className="h-4 w-4" />} />
          {showAlerts && (
            <StatCard label="Alerts" value={dashboardStats.alertsOpen} sub={`${alerts.filter((a) => a.severity === 'critical').length} critical`} trend={{ value: '5 new', positive: false }} icon={<IconBell className="h-4 w-4" />} />
          )}
          {showMaintenance && (
            <StatCard label="Tasks" value={dashboardStats.tasksDue} sub="due soon" icon={<IconWrench className="h-4 w-4" />} />
          )}
        </div>
      )}

      {(showMap || hasRightRail) && (
        <div className="grid gap-4 lg:grid-cols-12">
          {showMap && (
            <Panel
              id="gis"
              className={mainColSpan}
              title="GIS Tree Map"
              subtitle="Reach 12 · live overlay"
              noPadding
              action={<Badge variant="healthy" dot>Live</Badge>}
            >
              <GISTreeMap />
            </Panel>
          )}

          {hasRightRail && (
            <div className={`flex flex-col gap-4 ${showMap ? 'lg:col-span-4' : 'lg:col-span-12 lg:grid lg:grid-cols-2'}`}>
              {showInventory && (
                <Panel id="inventory" title="Inventory" subtitle={`${dashboardStats.inspectionsThisWeek} inspections this week`}>
                  <div className="space-y-2">
                    {recentTrees.slice(0, 4).map((tree) => (
                      <div key={tree.id} className="flex items-center justify-between rounded-lg bg-parchment-50/80 px-2.5 py-2">
                        <div className="min-w-0">
                          <p className="truncate font-mono text-[10px] text-ink-600">{tree.id}</p>
                          <p className="truncate text-xs font-medium text-ink-900">{tree.species}</p>
                        </div>
                        <Badge variant={healthBadge[tree.health]} dot>{tree.health.replace('_', ' ')}</Badge>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <div className="flex h-1.5 overflow-hidden rounded-full">
                      {healthDistribution.map((h) => (
                        <div key={h.label} className={h.color} style={{ width: `${h.value}%` }} />
                      ))}
                    </div>
                  </div>
                </Panel>
              )}

              {showAlerts && (
                <Panel id="alerts" title="Alerts" subtitle="Real-time feed">
                  <div className="space-y-2">
                    {alerts.slice(0, 3).map((alert) => (
                      <div key={alert.id} className={`rounded-r-lg border-l-2 bg-parchment-50/50 px-2.5 py-2 ${alertBorder[alert.severity]}`}>
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-medium text-ink-900">{alert.title}</p>
                          <span className="shrink-0 text-[9px] text-ink-400">{alert.timestamp}</span>
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-[10px] text-ink-600">{alert.message}</p>
                      </div>
                    ))}
                  </div>
                </Panel>
              )}
            </div>
          )}
        </div>
      )}

      {(showSoil || showVision) && (
        <div className="grid gap-4 lg:grid-cols-2">
          {showSoil && (
            <Panel id="soil" title="Soil Analytics" subtitle={`Avg pH ${dashboardStats.avgSoilPh}`}>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-ink-100 text-[10px] uppercase tracking-wider text-ink-500">
                    <th className="pb-2 font-medium">Zone</th>
                    <th className="pb-2 font-medium">pH</th>
                    <th className="pb-2 font-medium">Moisture</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-50">
                  {soilReadings.map((s) => (
                    <tr key={s.zone}>
                      <td className="py-2 font-medium text-ink-900">{s.zone}</td>
                      <td className="py-2 font-mono">{s.ph}</td>
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <div className="h-1 w-12 overflow-hidden rounded-full bg-parchment-200">
                            <div className="h-full rounded-full bg-cerulean-500" style={{ width: `${s.moisture}%` }} />
                          </div>
                          <span className="font-mono text-[10px] text-ink-500">{s.moisture}%</span>
                        </div>
                      </td>
                      <td className="py-2"><Badge variant={healthBadge[s.status]} size="sm">{s.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          )}

          {showVision && (
            <Panel id="disease" title="Vision AI" subtitle="Disease & pest detection">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="overflow-hidden rounded-lg bg-ink-950 p-2">
                  <div className="relative aspect-video overflow-hidden rounded-md bg-ink-900">
                    <svg className="h-full w-full" viewBox="0 0 100 60">
                      <ellipse cx="50" cy="35" rx="28" ry="22" fill="rgb(58 133 168 / 0.35)" />
                      <rect x="30" y="28" width="18" height="14" fill="none" stroke="#c4922a" strokeWidth="0.8" strokeDasharray="2 1" rx="1" />
                    </svg>
                    <span className="absolute bottom-1.5 left-1.5 rounded bg-signal-red/90 px-1.5 py-0.5 text-[8px] font-medium text-white">EAB detected</span>
                  </div>
                  <p className="mt-1.5 font-mono text-[10px] text-ink-400">TH-3102 · 94.2%</p>
                </div>
                <div className="space-y-1.5">
                  {[
                    { tree: 'TH-7744', label: 'Leaf spot', conf: 87.1 },
                    { tree: 'TH-5510', label: 'Aphids', conf: 76.5 },
                  ].map((item) => (
                    <div key={item.tree} className="flex items-center justify-between rounded-lg bg-parchment-50 px-2.5 py-2">
                      <div>
                        <p className="font-mono text-[10px] text-ink-700">{item.tree}</p>
                        <p className="text-xs text-ink-900">{item.label}</p>
                      </div>
                      <span className="font-mono text-xs text-copper-600">{item.conf}%</span>
                    </div>
                  ))}
                  <button type="button" className="w-full rounded-lg border border-dashed border-ink-300 py-1.5 text-[10px] font-medium text-ink-600 hover:bg-parchment-50">
                    + Upload imagery
                  </button>
                </div>
              </div>
            </Panel>
          )}
        </div>
      )}

      {(showRecommendations || showMaintenance || showReporting) && (
        <div className="grid gap-4 lg:grid-cols-3">
          {showRecommendations && (
            <Panel id="recommendations" title="Recommendations" subtitle="Treatment logic">
              <div className="space-y-2">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="rounded-lg border border-ink-100 bg-parchment-50/50 p-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-medium text-ink-900">{rec.action}</p>
                      <Badge variant={rec.priority === 'high' ? 'critical' : 'warning'}>{rec.priority}</Badge>
                    </div>
                    <p className="mt-1 text-[10px] text-ink-500">{rec.rationale}</p>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {showMaintenance && (
            <Panel id="maintenance" title="Workflows" subtitle="Field crew queue">
              <div className="space-y-2">
                {maintenanceTasks.map((task) => (
                  <div key={task.id} className="flex items-start justify-between gap-2 rounded-lg bg-parchment-50/50 px-2.5 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs text-ink-900">{task.title}</p>
                      <p className="text-[10px] text-ink-500">{task.assignee} · {task.dueDate}</p>
                    </div>
                    <Badge variant={taskBadge[task.status]}>{task.status.replace('_', ' ')}</Badge>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {showReporting && (
            <Panel
              id="reporting"
              title="Reporting"
              subtitle="Q2 2026"
              action={
                <div className="flex gap-1.5">
                  <button type="button" className="rounded-md border border-ink-200 px-2 py-1 text-[10px] font-medium text-ink-700 hover:bg-parchment-50">PDF</button>
                  <button type="button" className="rounded-md border border-ink-200 px-2 py-1 text-[10px] font-medium text-ink-700 hover:bg-parchment-50">Excel</button>
                </div>
              }
            >
              <div className="grid grid-cols-2 gap-2">
                {[
                  { m: 'Compliance', v: '94%' },
                  { m: 'Coverage', v: '89%' },
                  { m: 'Response', v: '4.2h' },
                  { m: 'Budget', v: '67%' },
                ].map((item) => (
                  <div key={item.m} className="rounded-lg bg-gradient-to-br from-ink-50 to-parchment-50 p-2.5 ring-1 ring-ink-100">
                    <p className="text-[10px] text-ink-500">{item.m}</p>
                    <p className="font-mono text-lg font-medium text-ink-900">{item.v}</p>
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </div>
      )}

      {user && (
        <p className="text-center text-[10px] text-ink-400">
          Dashboard layout is dynamic for <span className="capitalize">{user.role.replace(/_/g, ' ')}</span>
        </p>
      )}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <RoleGuard moduleId="dashboard">
      <DashboardContent />
    </RoleGuard>
  )
}
