import { useEffect, useRef } from 'react'
import { DEMO_CREDENTIALS } from '../config/demoCredentials'

interface DemoCredentialsPopoverProps {
  open: boolean
  onClose: () => void
  onSelect: (email: string, password: string) => void
}

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  management: 'Management',
  field_team: 'Field & operations',
}

export default function DemoCredentialsPopover({ open, onClose, onSelect }: DemoCredentialsPopoverProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Demo login credentials"
      className="absolute right-0 top-full z-20 mt-2 w-72 rounded-lg border border-ink-200 bg-white p-3 shadow-lg ring-1 ring-ink-100/80"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-ink-900">Demo accounts</p>
          <p className="text-[10px] text-ink-500">Default usernames and passwords</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-0.5 text-ink-400 hover:bg-parchment-50 hover:text-ink-700"
          aria-label="Close"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      </div>

      <ul className="space-y-2">
        {DEMO_CREDENTIALS.map((cred) => (
          <li
            key={cred.email}
            className="rounded-md border border-ink-100 bg-parchment-50/60 px-2.5 py-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-ink-800">{cred.label}</p>
                <p className="mt-0.5 truncate font-mono text-[10px] text-ink-600">{cred.email}</p>
                <p className="font-mono text-[10px] text-copper-700">
                  <span className="text-ink-400">pw </span>
                  {cred.password}
                </p>
              </div>
              <span className="shrink-0 rounded bg-ink-100 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-ink-600">
                {ROLE_LABELS[cred.role]}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                onSelect(cred.email, cred.password)
                onClose()
              }}
              className="mt-1.5 text-[10px] font-medium text-copper-600 hover:text-copper-500"
            >
              Use this account →
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
