import { create } from 'zustand'
import { WorkoutSession } from '../types'
import { getSupabase } from '../lib/supabase'
import { fetchSessions, insertSession, updateSessionDB, deleteSessionDB } from '../lib/db'

interface SessionsState {
  sessions: WorkoutSession[]
  loading: boolean
  loadFromDB: (userId: string) => Promise<void>
  clearAll: () => void
  addSession: (session: Omit<WorkoutSession, 'id'>) => Promise<void>
  updateSession: (id: string, updates: Partial<WorkoutSession>) => Promise<void>
  deleteSession: (id: string) => Promise<void>
}

export const useSessionsStore = create<SessionsState>()((set) => ({
  sessions: [],
  loading: false,

  loadFromDB: async (userId) => {
    set({ loading: true })
    try {
      const sb = getSupabase()!
      const sessions = await fetchSessions(sb, userId)
      set({ sessions })
    } finally {
      set({ loading: false })
    }
  },

  clearAll: () => set({ sessions: [], loading: false }),

  addSession: async (sessionData) => {
    const sb = getSupabase()!
    const { data: { user } } = await sb.auth.getUser()
    const id = await insertSession(sb, sessionData, user!.id)
    set(state => ({ sessions: [{ ...sessionData, id }, ...state.sessions] }))
  },

  updateSession: async (id, updates) => {
    set(state => ({
      sessions: state.sessions.map(s => s.id === id ? { ...s, ...updates } : s),
    }))
    const sb = getSupabase()!
    await updateSessionDB(sb, id, updates)
  },

  deleteSession: async (id) => {
    set(state => ({ sessions: state.sessions.filter(s => s.id !== id) }))
    const sb = getSupabase()!
    await deleteSessionDB(sb, id)
  },
}))
