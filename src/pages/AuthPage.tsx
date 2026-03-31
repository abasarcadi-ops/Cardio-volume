import { useState } from 'react'
import { Activity } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function AuthPage() {
  const { login, signup } = useAuth()
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      if (tab === 'login') {
        const { error } = await login(email, password)
        if (error) setError(error)
      } else {
        if (!name.trim()) { setError('Please enter your name.'); return }
        const { error } = await signup(email, password, name)
        if (error) {
          setError(error)
        } else {
          setMessage('Account created! You can now start logging workouts.')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-4">
            <Activity size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">CardioTrack</h1>
          <p className="text-slate-400 mt-1 text-sm">Track your cardio volume & progress</p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6">
          {/* Tabs */}
          <div className="flex bg-slate-700/50 rounded-xl p-1 mb-6">
            {(['login', 'signup'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); setMessage('') }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  tab === t
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'signup' && (
              <div>
                <label className="block text-sm text-slate-400 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-slate-400 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-slate-700 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
                minLength={6}
                className="w-full bg-slate-700 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 rounded-lg px-3 py-2">{error}</p>
            )}
            {message && (
              <p className="text-green-400 text-sm bg-green-400/10 rounded-lg px-3 py-2">{message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl py-3 transition-colors"
            >
              {loading ? '…' : tab === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
