import type { ReactNode } from 'react'

interface PanelProps {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  id?: string
  noPadding?: boolean
}

export default function Panel({
  title,
  subtitle,
  action,
  children,
  className = '',
  id,
  noPadding = false,
}: PanelProps) {
  return (
    <section
      id={id}
      className={`overflow-hidden rounded-xl border border-ink-200/80 bg-white shadow-sm ring-1 ring-ink-100/50 ${className}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-ink-100/80 bg-gradient-to-r from-parchment-50/80 to-white px-4 py-2.5">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-ink-900">{title}</h2>
          {subtitle && <p className="truncate text-[11px] text-ink-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className={noPadding ? '' : 'p-3'}>{children}</div>
    </section>
  )
}
