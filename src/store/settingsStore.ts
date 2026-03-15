import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserSettings } from '../types'

interface SettingsState {
  settings: UserSettings
  updateSettings: (updates: Partial<UserSettings>) => void
}

const DEFAULT_SETTINGS: UserSettings = {
  weeklyVolumeGoal: 300, // 5 hours
  preferredActivities: ['running', 'cycling'],
  fitnessLevel: 'intermediate',
  goal: 'General fitness and endurance',
  name: 'Athlete',
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      updateSettings: (updates) =>
        set(state => ({ settings: { ...state.settings, ...updates } })),
    }),
    { name: 'cardio-settings' }
  )
)
