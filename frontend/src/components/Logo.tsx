import { Link } from 'react-router-dom'

interface LogoProps {
  className?: string
  showText?: boolean
}

export default function Logo({ className = '', showText = true }: LogoProps) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 group ${className}`}>
      <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-ink-800 shadow-sm ring-1 ring-copper-500/30 transition group-hover:bg-ink-700">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5 text-copper-300"
          aria-hidden="true"
        >
          <path
            d="M12 2C8 6 4 8 4 12c0 4 3.5 7 8 10 4.5-3 8-6 8-10 0-4-4-6-8-10z"
            fill="currentColor"
            opacity="0.25"
          />
          <path
            d="M12 22V10M12 10C9 8 6 9 5 12M12 10c3-2 6-1 7 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="12" cy="7" r="2" fill="currentColor" />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-sm font-semibold tracking-tight text-ink-900">
            Tree Health
          </span>
          <span className="text-[10px] font-medium uppercase tracking-widest text-copper-600">
            Project
          </span>
        </div>
      )}
    </Link>
  )
}
