import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { AuthPage } from './features/auth/AuthPage'
import { ContractDetailsPage } from './features/contracts/ContractDetailsPage'
import { ContractsPage } from './features/contracts/ContractsPage'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { DiffViewerPage } from './features/diff-viewer/DiffViewerPage'
import { NewContractPage } from './features/registration/NewContractPage'
import { SettingsPage } from './features/settings/SettingsPage'

export function App() {
  return (
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
