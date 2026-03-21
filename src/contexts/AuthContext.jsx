import { createContext, useContext, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const DEMO_PASSWORD = 'peta2025'
const STORAGE_KEY = 'pp_auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === '1'
  })

  const login = useCallback((password) => {
    if (password === DEMO_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, '1')
      setIsLoggedIn(true)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setIsLoggedIn(false)
  }, [])

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  if (!isLoggedIn) {
    // Redirect to login
    window.location.replace('/login')
    return null
  }
  return children
}
