import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import Button from '../components/Button'
import Input from '../components/Input'
import GISMapMockup from '../components/GISMapMockup'
import DemoCredentialsPopover from '../components/DemoCredentialsPopover'
import { useAuthStore } from '../stores/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [showDemoLogins, setShowDemoLogins] = useState(false)

  const validate = () => {
    const errors: { email?: string; password?: string } = {}
    if (!email.trim()) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address'
    if (!password) errors.password = 'Password is required'
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    clearError()
    if (!validate()) return
    try {
      await login({ email, password })
      navigate('/dashboard')
    } catch {
      // handled in store
    }
  }

  return (
    <div className="grid min-h-0 flex-1 lg:grid-cols-2">
      {/* Visual panel */}
      <div className="relative hidden overflow-hidden bg-ink-950 lg:block">
        <div className="absolute inset-0 map-grid opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-ink-900/90 via-ink-950/80 to-ink-950" />
        <div className="relative z-10 flex h-full flex-col p-8">
          <Logo className="[&_span]:text-white [&_.text-copper-600]:text-copper-300" />
          <div className="my-auto max-w-md">
            <h2 className="font-serif text-3xl leading-tight text-white">
              Monitor canopy health at reach scale
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-300">
              GIS inventory, soil analytics, vision AI, and field operations — one platform.
            </p>
          </div>
          <div className="overflow-hidden rounded-xl border border-ink-700/40 shadow-2xl ring-1 ring-white/5">
            <GISMapMockup compact showLegend={false} />
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-parchment-50 px-5 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-6 lg:hidden"><Logo /></div>

          <div className="glass-card p-6 sm:p-8">
            <h1 className="text-xl font-semibold text-ink-950">Welcome back</h1>
            <p className="mt-1 text-sm text-ink-600">Sign in to your operations dashboard</p>

            {error && (
              <div className="mt-4 flex gap-2 rounded-lg border border-signal-red/25 bg-signal-red/5 px-3 py-2.5 text-sm text-signal-red" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@institute.org"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }))
                }}
                error={fieldErrors.email}
              />
              <div>
                <Input
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }))
                  }}
                  error={fieldErrors.password}
                />
                <div className="relative mt-1.5 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDemoLogins((v) => !v)}
                    className="text-xs font-medium text-copper-600 hover:text-copper-500"
                    aria-expanded={showDemoLogins}
                  >
                    Demo logins
                  </button>
                  <a
                    href="#"
                    className="text-xs font-medium text-copper-600 hover:text-copper-500"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowDemoLogins((v) => !v)
                    }}
                  >
                    Forgot password?
                  </a>
                  <DemoCredentialsPopover
                    open={showDemoLogins}
                    onClose={() => setShowDemoLogins(false)}
                    onSelect={(demoEmail, demoPassword) => {
                      setEmail(demoEmail)
                      setPassword(demoPassword)
                      setFieldErrors({})
                      clearError()
                    }}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                Sign in
              </Button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-ink-200" /></div>
              <p className="relative text-center text-[10px] uppercase tracking-wider text-ink-400"><span className="bg-white px-2">or</span></p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {['Google', 'GitHub'].map((provider) => (
                <button
                  key={provider}
                  type="button"
                  className="rounded-lg border border-ink-200 bg-white py-2 text-xs font-medium text-ink-700 transition hover:bg-parchment-50"
                >
                  {provider}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-ink-600">
            No account? <a href="#" className="font-medium text-copper-600">Request access</a>
          </p>
          <p className="mt-2 text-center">
            <Link to="/" className="text-xs text-ink-500 hover:text-ink-800">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
