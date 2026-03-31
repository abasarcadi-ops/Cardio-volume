import { useState } from 'react'
import { Database } from 'lucide-react'
import { initSupabase } from '../lib/supabase'

interface Props {
  onConfigured: () => void
}

export default function SetupPage({ onConfigured }: Props) {
  const [url, setUrl] = useState('')
  const [key, setKey] = useState('')
  const [testing, setTesting] = useState(false)
  const [error, setError] = useState('')

  async function handleConnect() {
    setError('')
    if (!url.trim() || !key.trim()) {
      setError('Both fields are required.')
      return
    }
    if (!url.startsWith('https://')) {
      setError('Project URL must start with https://')
      return
    }
    setTesting(true)
    try {
      const sb = initSupabase(url.trim(), key.trim())
      // Test the connection by checking auth status
      const { error: authError } = await sb.auth.getSession()
      if (authError) throw authError
      onConfigured()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Connection failed'
      setError(`Could not connect: ${msg}`)
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-4">
            <Database size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Connect Your Database</h1>
          <p className="text-slate-400 mt-2 text-sm leading-relaxed">
            CardioTrack uses your own free Supabase project to store data.
            This takes about 2 minutes to set up.
          </p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 space-y-4">
          <div className="bg-slate-700/50 rounded-xl p-4 text-sm text-slate-300 space-y-1">
            <p className="font-medium text-white">Quick setup steps:</p>
            <p>1. Go to <span className="text-blue-400">supabase.com</span> → New project</p>
            <p>2. Copy <span className="text-blue-400">Project URL</span> from Settings → API</p>
            <p>3. Copy <span className="text-blue-400">anon / public key</span> from the same page</p>
            <p>4. In Auth → Settings, <span className="text-blue-400">disable "Confirm email"</span></p>
            <p>5. Run the SQL from the repo's <span className="text-blue-400">supabase/schema.sql</span> in the SQL editor</p>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Project URL</label>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://xxxxxxxxxxxx.supabase.co"
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Anon / Public Key</label>
            <input
              type="password"
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            onClick={handleConnect}
            disabled={testing}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl py-3 transition-colors"
          >
            {testing ? 'Connecting…' : 'Connect'}
          </button>
        </div>
      </div>
    </div>
  )
}
