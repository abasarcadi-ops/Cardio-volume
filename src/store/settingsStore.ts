import { create } from 'zustand'
import { UserSettings } from '../types'
import { getSupabase } from '../lib/supabase'
import { fetchSettings, upsertSettings } from '../lib/db'

interface SettingsState {
  settings: UserSettings
  loading: boolean
  loadFromDB: (userId: string) => Promise<void>
  clearAll: () => void
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>
}

const DEFAULT_SETTINGS: UserSettings = {
  name: 'Athlete',
  weeklyVolumeGoal: 300,
  preferredActivities: ['running', 'cycling'],
  fitnessLevel: 'intermediate',
  goal: 'General fitness and endurance',
  onboardingComplete: false,
}

export const useSettingsStore = create<SettingsState>()((set, get) => ({
  settings: DEFAULT_SETTINGS,
  loading: false,

  loadFromDB: async (userId) => {
    set({ loading: true })
    try {
      const sb = getSupabase()!
      const settings = await fetchSettings(sb, userId)
      if (settings) set({ settings })
      // If no settings row yet, defaults stay in place (upserted on first update)
    } finally {
      set({ loading: false })
    }
  },

  clearAll: () => set({ settings: DEFAULT_SETTINGS, loading: false }),

  updateSettings: async (updates) => {
    const next = { ...get().settings, ...updates }
    set({ settings: next })
    const sb = getSupabase()!
    const { data: { user } } = await sb.auth.getUser()
    await upsertSettings(sb, next, user!.id)
  },
}))
