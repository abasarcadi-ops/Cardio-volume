import { HashRouter, Routes, Route } from 'react-router-dom'
import { isConfigured } from './lib/supabase'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import SetupPage from './pages/SetupPage'
import AuthPage from './pages/AuthPage'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Log from './pages/Log'
import Progress from './pages/Progress'
import Plans from './pages/Plans'
import AIPlan from './pages/AIPlan'
import { useState } from 'react'

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <AuthPage />

  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/log" element={<Log />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/ai-plan" element={<AIPlan />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default function App() {
  const [configured, setConfigured] = useState(isConfigured())

  if (!configured) {
    return <SetupPage onConfigured={() => setConfigured(true)} />
  }

  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
