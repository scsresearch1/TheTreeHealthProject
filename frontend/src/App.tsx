import { Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import CurationFooter from './components/layout/CurationFooter'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ModuleRoute from './pages/modules/ModuleRoute'
import { featureModules } from './config/featureModules'

const moduleRoutes = featureModules.filter((m) => m.id !== 'dashboard')

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex min-h-0 flex-1 flex-col">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            {moduleRoutes.map((m) => (
              <Route
                key={m.id}
                path={m.path}
                element={<ModuleRoute moduleId={m.id} />}
              />
            ))}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </div>
      <CurationFooter />
    </div>
  )
}
