import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WorkoutSession } from '../types'
import { generateSeedData } from '../lib/seedData'

interface SessionsState {
  sessions: WorkoutSession[]
  addSession: (session: Omit<WorkoutSession, 'id'>) => void
  updateSession: (id: string, updates: Partial<WorkoutSession>) => void
  deleteSession: (id: string) => void
  hydrated: boolean
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export const useSessionsStore = create<SessionsState>()(
  persist(
    (set, get) => ({
      sessions: [],
      hydrated: false,
      addSession: (session) => {
        set(state => ({
          sessions: [...state.sessions, { ...session, id: generateId() }],
        }))
      },
      updateSession: (id, updates) => {
        set(state => ({
          sessions: state.sessions.map(s => s.id === id ? { ...s, ...updates } : s),
        }))
      },
      deleteSession: (id) => {
        set(state => ({ sessions: state.sessions.filter(s => s.id !== id) }))
      },
    }),
    {
      name: 'cardio-sessions',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hydrated = true
          // Seed data if empty
          if (state.sessions.length === 0) {
            state.sessions = generateSeedData()
          }
        }
      },
    }
  )
)
