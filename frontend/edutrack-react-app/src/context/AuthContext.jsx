import { createContext, useContext, useMemo, useState } from 'react'
import { USERS } from '../data/dummyData'

const AuthContext = createContext(null)

// Demo-only fallback role detection
function detectRole(email = '') {
  const e = email.toLowerCase()
  if (e.includes('admin')) return 'admin'
  if (e.includes('faculty') || e.includes('staff')) return 'faculty'
  if (e.includes('employer') || e.includes('recruit') || e.includes('hr@')) return 'employer'
  return 'student'
}

export function AuthProvider({ children }) {
  const [role, setRole] = useState(null)
  const [token, setToken] = useState(null)

  const login = async (email, password = 'Test@123') => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (!res.ok) throw new Error('Login failed')
      const data = await res.json()
      setToken(data.accessToken)
      const r = data.user.role.toLowerCase()
      setRole(r)
      return r
    } catch (e) {
      console.error(e)
      const detected = detectRole(email)
      setRole(detected)
      return detected
    }
  }

  const logout = () => {
    setRole(null)
    setToken(null)
  }

  const user = role ? USERS[role] : null

  const value = useMemo(() => ({ role, user, token, login, logout }), [role, user, token])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
