import { create } from 'zustand'
import { TrainingPlan } from '../types'
import { getSupabase } from '../lib/supabase'
import { fetchPlans, insertPlan, updatePlanDB, deletePlanDB } from '../lib/db'

interface PlansState {
  plans: TrainingPlan[]
  loading: boolean
  loadFromDB: (userId: string) => Promise<void>
  clearAll: () => void
  addPlan: (plan: TrainingPlan) => Promise<void>
  updatePlan: (id: string, updates: Partial<TrainingPlan>) => Promise<void>
  deletePlan: (id: string) => Promise<void>
  activatePlan: (id: string) => Promise<void>
  deactivatePlan: (id: string) => Promise<void>
}

export const usePlansStore = create<PlansState>()((set) => ({
  plans: [],
  loading: false,

  loadFromDB: async (userId) => {
    set({ loading: true })
    try {
      const sb = getSupabase()!
      const plans = await fetchPlans(sb, userId)
      set({ plans })
    } finally {
      set({ loading: false })
    }
  },

  clearAll: () => set({ plans: [], loading: false }),

  addPlan: async (plan) => {
    const sb = getSupabase()!
    const { data: { user } } = await sb.auth.getUser()
    await insertPlan(sb, plan, user!.id)
    set(state => ({ plans: [plan, ...state.plans] }))
  },

  updatePlan: async (id, updates) => {
    set(state => ({ plans: state.plans.map(p => p.id === id ? { ...p, ...updates } : p) }))
    const sb = getSupabase()!
    await updatePlanDB(sb, id, updates)
  },

  deletePlan: async (id) => {
    set(state => ({ plans: state.plans.filter(p => p.id !== id) }))
    const sb = getSupabase()!
    await deletePlanDB(sb, id)
  },

  activatePlan: async (id) => {
    set(state => ({ plans: state.plans.map(p => ({ ...p, isActive: p.id === id })) }))
    const sb = getSupabase()!
    const { data: { user } } = await sb.auth.getUser()
    await sb.from('training_plans').update({ is_active: false }).eq('user_id', user!.id)
    await updatePlanDB(sb, id, { isActive: true })
  },

  deactivatePlan: async (id) => {
    set(state => ({ plans: state.plans.map(p => p.id === id ? { ...p, isActive: false } : p) }))
    const sb = getSupabase()!
    await updatePlanDB(sb, id, { isActive: false })
  },
}))
