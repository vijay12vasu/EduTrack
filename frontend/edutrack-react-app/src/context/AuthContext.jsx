import { createContext, useContext, useMemo, useState } from 'react'
import { USERS } from '../data/dummyData'

const AuthContext = createContext(null)

// Demo-only role detection: since there is no backend, we infer which
// dashboard to show from the email the person types in. Any email
// containing "admin", "faculty" / "staff", or "employer" / "recruiter"
// logs into that role's dashboard; everything else logs in as a student.
function detectRole(email = '') {
  const e = email.toLowerCase()
  if (e.includes('admin')) return 'admin'
  if (e.includes('faculty') || e.includes('staff')) return 'faculty'
  if (e.includes('employer') || e.includes('recruit') || e.includes('hr@')) return 'employer'
  return 'student'
}

export function AuthProvider({ children }) {
  const [role, setRole] = useState(null)

  const login = (email) => {
    const detected = detectRole(email)
    setRole(detected)
    return detected
  }

  const logout = () => setRole(null)

  const user = role ? USERS[role] : null

  const value = useMemo(() => ({ role, user, login, logout }), [role, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
