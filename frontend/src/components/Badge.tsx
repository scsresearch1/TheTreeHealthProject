import type { ReactNode } from 'react'

type BadgeVariant = 'healthy' | 'stressed' | 'at_risk' | 'critical' | 'info' | 'warning' | 'neutral'
type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  children: ReactNode
  dot?: boolean
}

const variantStyles: Record<BadgeVariant, string> = {
  healthy: 'bg-cerulean-100 text-cerulean-600 ring-cerulean-200',
  stressed: 'bg-amber-100 text-amber-900 ring-amber-200',
  at_risk: 'bg-orange-100 text-orange-900 ring-orange-200',
  critical: 'bg-red-100 text-red-800 ring-red-200',
  info: 'bg-ink-100 text-ink-700 ring-ink-200',
  warning: 'bg-copper-100 text-copper-600 ring-copper-200',
  neutral: 'bg-parchment-100 text-parchment-800 ring-parchment-200',
}

const dotColors: Record<BadgeVariant, string> = {
  healthy: 'bg-cerulean-500',
  stressed: 'bg-signal-amber',
  at_risk: 'bg-orange-500',
  critical: 'bg-signal-red',
  info: 'bg-ink-500',
  warning: 'bg-signal-amber',
  neutral: 'bg-parchment-500',
}

export default function Badge({
  variant = 'neutral',
  size = 'sm',
  children,
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset
        ${variantStyles[variant]}
        ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'}
      `}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  )
}
