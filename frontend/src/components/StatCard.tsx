interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  trend?: { value: string; positive: boolean }
  icon?: React.ReactNode
}

export default function StatCard({ label, value, sub, trend, icon }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-ink-200/70 bg-white p-3.5 shadow-sm ring-1 ring-ink-100/40">
      <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-copper-100/40 blur-2xl" />
      <div className="relative flex items-start justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">{label}</p>
        {icon && (
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink-900 text-copper-300">
            {icon}
          </div>
        )}
      </div>
      <p className="relative mt-1.5 font-mono text-xl font-medium text-ink-900">{value}</p>
      <div className="relative mt-0.5 flex items-center gap-2">
        {sub && <p className="text-[10px] text-ink-500">{sub}</p>}
        {trend && (
          <span className={`text-[10px] font-medium ${trend.positive ? 'text-cerulean-600' : 'text-signal-red'}`}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
    </div>
  )
}
