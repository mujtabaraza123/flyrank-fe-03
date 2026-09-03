import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import { LoginForm } from './LoginForm'

export function AuthPanel() {
  const { currentUser, loading, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      // For now, just console.error — UI could show this if needed
      console.error('Logout failed', err)
    }
  }

  return (
    <div className="auth-panel">
      {loading ? (
        <div className="auth-loading">Loading…</div>
      ) : currentUser ? (
        <div className="auth-info">
          <div className="auth-user">Signed in as {currentUser.email}</div>
          <button onClick={handleLogout}>Sign out</button>
        </div>
      ) : (
        <LoginForm />
      )}
    </div>
  )
}
