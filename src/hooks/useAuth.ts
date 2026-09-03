import { useCallback, useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import {
  subscribeToAuthChanges,
  registerWithEmail,
  loginWithEmail,
  logout as authLogout,
} from '../services/firebaseAuthService'

type UseAuthResult = {
  currentUser: User | null
  loading: boolean
  register: (email: string, password: string) => Promise<User>
  login: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>
}

export function useAuth(): UseAuthResult {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const register = useCallback(async (email: string, password: string) => {
    try {
      const user = await registerWithEmail(email, password)
      setCurrentUser(user)
      return user
    } catch (err) {
      // Convert firebase errors to friendlier messages where possible
      const message = err instanceof Error ? err.message : 'Registration failed'
      throw new Error(message)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const user = await loginWithEmail(email, password)
      setCurrentUser(user)
      return user
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      throw new Error(message)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authLogout()
      setCurrentUser(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed'
      throw new Error(message)
    }
  }, [])

  return {
    currentUser,
    loading,
    register,
    login,
    logout,
  }
}
