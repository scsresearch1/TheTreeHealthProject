import { Link, useLocation } from 'react-router-dom'
import Logo from '../Logo'
import { useAccessControl } from '../../hooks/useAccessControl'

export default function Sidebar() {
  const location = useLocation()
  const { user, accessibleModules } = useAccessControl()

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-ink-200/80 bg-white">
      <div className="border-b border-ink-100 px-3 py-3">
        <Logo />
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-ink-500">
          Modules
        </p>
        <ul className="space-y-0.5">
          {accessibleModules.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition
                    ${isActive
                      ? 'bg-copper-100 text-ink-900 ring-1 ring-copper-200'
                      : 'text-ink-700 hover:bg-ink-50 hover:text-ink-900'}
                  `}
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-70" />
                  <span className="truncate">{item.shortTitle}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {user && (
        <div className="border-t border-ink-100 p-3">
          <div className="rounded-lg bg-cerulean-50 p-2.5 ring-1 ring-cerulean-100">
            <p className="text-[10px] font-medium uppercase tracking-wider text-ink-500">Role</p>
            <p className="text-xs font-medium capitalize text-ink-800">{user.role.replace(/_/g, ' ')}</p>
            <p className="mt-1 text-[10px] text-ink-500">
              {accessibleModules.length} modules · {user.permissions.length} permissions
            </p>
          </div>
        </div>
      )}
    </aside>
  )
}
