import { Navigate, useLocation } from 'react-router-dom'
import type { ReactElement } from 'react'
import { useAppStore } from '../../store/AppStore'

export function ProtectedRoute({ children }: { children: ReactElement }) {
  const { user, authLoading } = useAppStore()
  const location = useLocation()

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas text-sm text-muted">
        Checking session...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
