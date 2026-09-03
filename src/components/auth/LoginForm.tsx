import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

export function LoginForm() {
  const { register, login } = useAuth()
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateEmail = (value: string) => /\S+@\S+\.\S+/.test(value)

  const clearForm = () => {
    setEmail('')
    setPassword('')
    setConfirm('')
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (!password) {
      setError('Please enter a password.')
      return
    }

    if (isRegister) {
      if (password.length < 6) {
        setError('Password must be at least 6 characters.')
        return
      }
      if (password !== confirm) {
        setError('Passwords do not match.')
        return
      }
    }

    setIsSubmitting(true)
    try {
      if (isRegister) {
        await register(email, password)
        clearForm()
      } else {
        await login(email, password)
        clearForm()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-form">
      <form onSubmit={handleSubmit}>
        <h3>{isRegister ? 'Create account' : 'Sign in'}</h3>

        <label>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </label>

        <label>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </label>

        {isRegister && (
          <label>
            <span>Confirm password</span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </label>
        )}

        {error && <div className="form-error">{error}</div>}

        <div className="form-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (isRegister ? 'Creating…' : 'Signing in…') : isRegister ? 'Create account' : 'Sign in'}
          </button>

          <button
            type="button"
            className="link-button"
            onClick={() => {
              setIsRegister((r) => !r)
              setError(null)
            }}
            disabled={isSubmitting}
          >
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
          </button>
        </div>
      </form>
    </div>
  )
}
