import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (type) => {
    setLoading(true)
    setError('')

    let result

    if (type === 'LOGIN') {
      result = await supabase.auth.signInWithPassword({
        email,
        password,
      })
    } else {
      result = await supabase.auth.signUp({
        email,
        password,
      })
    }

    const { error } = result
    if (error) setError(error.message)

    setLoading(false)
  }

  return (
    <div className="p-4 max-w-sm mx-auto mt-10 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-bold text-center">Login / Sign Up</h2>
      <input
        className="w-full border p-2 rounded"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full border p-2 rounded"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-red-600">{error}</p>}
      <button
        className="w-full bg-blue-600 text-white p-2 rounded"
        onClick={() => handleLogin('LOGIN')}
        disabled={loading}
      >
        {loading ? 'Logging in…' : 'Login'}
      </button>
      <button
        className="w-full border text-blue-600 p-2 rounded"
        onClick={() => handleLogin('SIGNUP')}
        disabled={loading}
      >
        {loading ? 'Signing up…' : 'Sign Up'}
      </button>
    </div>
  )
}
