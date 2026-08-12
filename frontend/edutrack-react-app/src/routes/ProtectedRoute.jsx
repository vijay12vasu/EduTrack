import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ allow, children }) {
  const { role } = useAuth()

  if (!role) return <Navigate to="/login" replace />
  if (allow && !allow.includes(role)) return <Navigate to="/login" replace />

  return children
}
