import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { getSupabase } from '../lib/supabase'
import { useSessionsStore } from '../store/sessionsStore'
import { usePlansStore } from '../store/plansStore'
import { useSettingsStore } from '../store/settingsStore'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ error: string | null }>
  signup: (email: string, password: string, name: string) => Promise<{ error: string | null }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const loadSessions = useSessionsStore(s => s.loadFromDB)
  const loadPlans = usePlansStore(s => s.loadFromDB)
  const loadSettings = useSettingsStore(s => s.loadFromDB)
  const clearSessions = useSessionsStore(s => s.clearAll)
  const clearPlans = usePlansStore(s => s.clearAll)
  const clearSettings = useSettingsStore(s => s.clearAll)

  async function loadUserData(userId: string) {
    await Promise.all([
      loadSessions(userId),
      loadPlans(userId),
      loadSettings(userId),
    ])
  }

  useEffect(() => {
    const supabase = getSupabase()
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserData(session.user.id).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (event === 'SIGNED_OUT') {
        clearSessions()
        clearPlans()
        clearSettings()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function login(email: string, password: string) {
    const supabase = getSupabase()!
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    if (data.user) await loadUserData(data.user.id)
    return { error: null }
  }

  async function signup(email: string, password: string, name: string) {
    const supabase = getSupabase()!
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) return { error: error.message }
    // If email confirmation is disabled, user is immediately active
    if (data.user && data.session) await loadUserData(data.user.id)
    return { error: null }
  }

  async function logout() {
    const supabase = getSupabase()!
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
