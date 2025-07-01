import { useState } from 'react'

const apiUrl = import.meta.env.VITE_API_URL

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (isCreating) {
      // Register
      const res = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      if (res.ok) {
        alert('Account created! Please log in.')
        setIsCreating(false)
      } else {
        const data = await res.json()
        setError(data.error || 'Registration failed')
      }
    } else {
      // Login
      const res = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      if (res.ok) {
        const data = await res.json()
        onLogin(data.firstName)
      } else {
        const data = await res.json()
        setError(data.error || 'Login failed')
      }
    }
  }

  return (
    <div>
      <h1>{isCreating ? 'Create Account' : 'Login'}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">{isCreating ? 'Create Account' : 'Login'}</button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      <div style={{ marginTop: 10 }}>
        {isCreating ? (
          <span>
            Already have an account?{' '}
            <button type="button" onClick={() => setIsCreating(false)}>Login</button>
          </span>
        ) : (
          <span>
            No account?{' '}
            <button type="button" onClick={() => setIsCreating(true)}>Create Account</button>
          </span>
        )}
      </div>
    </div>
  )
}