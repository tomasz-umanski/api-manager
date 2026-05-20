import { Navigate, useLocation } from 'react-router-dom'
import type { ReactElement } from 'react'
import { useAppStore } from '../../store/AppStore'

export function ProtectedRoute({ children }: { children: ReactElement }) {
  const { user } = useAppStore()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
