import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import ReactGA from 'react-ga4'
import { AnalyticsListener } from './components/AnalyticsListener'
import { AppShell } from './components/layout/AppShell'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { AuthPage } from './pages/AuthPage'
import { ContractDetailsPage } from './pages/ContractDetailsPage'
import { ContractsPage } from './pages/ContractsPage'
import { DashboardPage } from './pages/DashboardPage'
import { DiffViewerPage } from './pages/DiffViewerPage'
import { NewContractPage } from './pages/NewContractPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { SettingsPage } from './pages/SettingsPage'

export function App() {
  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID
    if (measurementId) {
      ReactGA.initialize(measurementId)
    }
  }, [])

  return (
    <>
      <AnalyticsListener />
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="/contracts" element={<ContractsPage />} />
          <Route path="/contracts/new" element={<NewContractPage />} />
          <Route path="/contracts/:contractId" element={<ContractDetailsPage />} />
          <Route path="/diff/:contractId/:runId" element={<DiffViewerPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}
