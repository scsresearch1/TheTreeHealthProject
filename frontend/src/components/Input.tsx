import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export default function Input({
  label,
  error,
  hint,
  id,
  className = '',
  ...props
}: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-ink-800"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`
          block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink-900
          placeholder:text-parchment-500 shadow-sm transition-colors
          focus:outline-none focus:ring-2 focus:ring-copper-400/30 focus:border-copper-500
          disabled:cursor-not-allowed disabled:bg-parchment-100 disabled:opacity-60
          ${error ? 'border-signal-red' : 'border-parchment-300'}
          ${className}
        `}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-parchment-600">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-signal-red" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
