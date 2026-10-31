import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectAuthStatus, selectIsAuthenticated } from '../redux/slices/authSlice'

export default function ProtectedRoute({ children }) {
  const location = useLocation()
  const status = useSelector(selectAuthStatus)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  if (status === 'restoring') {
    return <div className="min-h-dvh bg-app p-5 text-sm text-slate-400">Checking your session...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
