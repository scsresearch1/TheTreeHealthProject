import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import Button from '../components/Button'
import GISMapMockup from '../components/GISMapMockup'
import { platformModules } from '../data/platformModules'
import { moduleIcons } from '../components/icons'

export default function LandingPage() {
  return (
    <div className="min-h-0 flex-1 overflow-x-hidden bg-parchment-50">
      {/* Nav */}
      <header className="glass-nav fixed inset-x-0 top-0 z-50">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 lg:px-8">
          <Logo />
          <Link to="/login"><Button size="sm">Get started</Button></Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="hero-glow relative pt-14">
        <div className="pointer-events-none absolute inset-0 grid-scientific opacity-40" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-6 px-5 pb-10 pt-5 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:pb-14 lg:pt-6">
          <div>
            <p className="fade-in inline-flex items-center gap-2 rounded-full border border-ink-200/60 bg-white/70 px-3 py-1 text-xs font-medium text-ink-600">
              <span className="h-1.5 w-1.5 rounded-full bg-cerulean-500" />
              GIS Tree-Health Platform
            </p>
            <h1 className="fade-in fade-in-delay-1 mt-3 font-serif text-4xl leading-[1.08] tracking-tight text-ink-950 sm:text-5xl lg:text-[3.25rem] text-balance">
              Science for every{' '}
              <span className="text-copper-600">canopy</span>
            </h1>
            <p className="fade-in fade-in-delay-2 mt-4 max-w-md text-base leading-relaxed text-ink-600">
              Inventory, diagnose, and protect trees — geospatial mapping, soil labs, vision AI, and field workflows in one place.
            </p>
            <div className="fade-in fade-in-delay-3 mt-6 flex flex-wrap gap-3">
              <Link to="/login"><Button size="lg">Launch platform</Button></Link>
              <a href="#platform"><Button variant="outline" size="lg">See dashboard</Button></a>
            </div>
            <div className="fade-in fade-in-delay-4 mt-6 flex gap-6 border-t border-ink-200/60 pt-5">
              {[
                { v: '12k+', l: 'Trees mapped' },
                { v: '8', l: 'Modules' },
                { v: '98%', l: 'AI accuracy' },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-mono text-xl font-medium text-ink-900">{s.v}</p>
                  <p className="text-xs text-ink-500">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="fade-in fade-in-delay-2 relative">
            <div className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-cerulean-300/25 via-transparent to-copper-300/20 blur-xl" />
            <div className="glass-card relative overflow-hidden p-1.5">
              <GISMapMockup />
            </div>
            <div className="absolute -bottom-3 -left-3 rounded-xl border border-ink-100 bg-white px-3 py-2 shadow-lg">
              <p className="text-[10px] font-medium text-cerulean-600">72% healthy</p>
            </div>
            <div className="absolute -right-2 top-6 rounded-xl border border-signal-red/20 bg-white px-3 py-2 shadow-lg">
              <p className="text-[10px] font-medium text-signal-red">Pest alert</p>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities — dense bento, all 8 modules */}
      <section id="capabilities" className="border-t border-ink-200/50 bg-white py-10 lg:py-12">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-serif text-3xl text-ink-950 lg:text-4xl">Eight modules, one workspace</h2>
              <p className="mt-1 text-sm text-ink-600">From GIS inventory to management reports.</p>
            </div>
            <Link to="/login" className="mt-3 text-sm font-medium text-copper-600 hover:text-copper-500 sm:mt-0">
              Explore dashboard →
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {platformModules.map((mod) => {
              const Icon = moduleIcons[mod.id]
              return (
                <article
                  key={mod.id}
                  className="group relative overflow-hidden rounded-xl border border-ink-200/60 bg-gradient-to-br from-white to-parchment-50/80 p-4 shadow-sm transition hover:border-copper-300/50 hover:shadow-md"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-900 text-copper-300 transition group-hover:bg-copper-500 group-hover:text-white">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-ink-900">{mod.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-600">{mod.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Platform — merged preview + CTA, tight 2-col */}
      <section id="platform" className="relative overflow-hidden py-10 lg:py-12">
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-900 to-ink-950" />
        <div className="absolute inset-0 map-grid opacity-10" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-5 lg:grid-cols-2 lg:gap-10 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-copper-400">Operations Dashboard</p>
            <h2 className="mt-2 font-serif text-3xl text-white lg:text-4xl text-balance">
              Your field command center
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-300">
              Maps, inventory, soil readings, ML vision, recommendations, workflows, alerts, and reports — unified.
            </p>
            <ul className="mt-5 space-y-2">
              {['Live GIS with health-coded markers', 'Real-time alert feed', 'PDF & Excel exports'].map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm text-ink-200">
                  <span className="h-1 w-1 rounded-full bg-copper-400" />
                  {t}
                </li>
              ))}
            </ul>
            <Link to="/login" className="mt-6 inline-block">
              <Button size="lg" className="bg-copper-500 text-white hover:bg-copper-400 ring-0 shadow-lg shadow-copper-900/30">
                Open dashboard
              </Button>
            </Link>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-xl border border-ink-700/50 shadow-2xl ring-1 ring-white/10">
              <div className="flex items-center gap-2 border-b border-ink-800 bg-ink-950 px-4 py-2">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-signal-red/80" />
                  <span className="h-2 w-2 rounded-full bg-signal-amber/80" />
                  <span className="h-2 w-2 rounded-full bg-cerulean-500/80" />
                </div>
                <span className="font-mono text-[10px] text-ink-500">dashboard</span>
              </div>
              <GISMapMockup compact />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-200/60 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 sm:flex-row lg:px-8">
          <Logo />
          <p className="text-xs text-ink-500">&copy; {new Date().getFullYear()} The Tree Health Project</p>
          <div className="flex gap-6 text-xs text-ink-600">
            <a href="#" className="hover:text-ink-900">Privacy</a>
            <a href="#" className="hover:text-ink-900">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
