import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import { useRealtimeSync } from '../../hooks/useRealtimeSync'

export default function AppShell() {
  useRealtimeSync()

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden bg-parchment-100/50">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
