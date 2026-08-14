import { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY_TOKEN = 'edutrack_token'
const STORAGE_KEY_USER = 'edutrack_user'

export function AuthProvider({ children }) {
  const [role, setRole] = useState(null)
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(STORAGE_KEY_TOKEN)
      const savedUser = localStorage.getItem(STORAGE_KEY_USER)
      if (savedToken && savedUser) {
        const parsed = JSON.parse(savedUser)
        setToken(savedToken)
        setUser(parsed)
        setRole(parsed.role?.toLowerCase() || null)
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY_TOKEN)
      localStorage.removeItem(STORAGE_KEY_USER)
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!res.ok) {
      const errorData = await res.json().catch(() => null)
      throw new Error(errorData?.message || `Login failed (${res.status})`)
    }
    const data = await res.json()
    const accessToken = data.accessToken
    const userData = {
      id: data.user.id,
      fullName: data.user.fullName,
      email: data.user.email,
      role: data.user.role
    }
    const r = userData.role.toLowerCase()

    setToken(accessToken)
    setUser(userData)
    setRole(r)
    localStorage.setItem(STORAGE_KEY_TOKEN, accessToken)
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData))
    return r
  }, [])

  const register = useCallback(async (fullName, email, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password })
    })
    if (!res.ok) {
      const errorData = await res.json().catch(() => null)
      throw new Error(errorData?.message || `Registration failed (${res.status})`)
    }
    const data = await res.json()
    const accessToken = data.accessToken
    const userData = {
      id: data.user.id,
      fullName: data.user.fullName,
      email: data.user.email,
      role: data.user.role
    }
    const r = userData.role.toLowerCase()

    setToken(accessToken)
    setUser(userData)
    setRole(r)
    localStorage.setItem(STORAGE_KEY_TOKEN, accessToken)
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData))
    return r
  }, [])

  const logout = useCallback(() => {
    setRole(null)
    setToken(null)
    setUser(null)
    localStorage.removeItem(STORAGE_KEY_TOKEN)
    localStorage.removeItem(STORAGE_KEY_USER)
  }, [])

  const value = useMemo(() => ({
    role,
    user,
    token,
    loading,
    login,
    register,
    logout
  }), [role, user, token, loading, login, register, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
