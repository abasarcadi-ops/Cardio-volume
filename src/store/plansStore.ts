import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TrainingPlan } from '../types'

interface PlansState {
  plans: TrainingPlan[]
  addPlan: (plan: TrainingPlan) => void
  updatePlan: (id: string, updates: Partial<TrainingPlan>) => void
  deletePlan: (id: string) => void
  activatePlan: (id: string) => void
  deactivatePlan: (id: string) => void
}

export const usePlansStore = create<PlansState>()(
  persist(
    (set) => ({
      plans: [],
      addPlan: (plan) => set(state => ({ plans: [...state.plans, plan] })),
      updatePlan: (id, updates) =>
        set(state => ({ plans: state.plans.map(p => p.id === id ? { ...p, ...updates } : p) })),
      deletePlan: (id) => set(state => ({ plans: state.plans.filter(p => p.id !== id) })),
      activatePlan: (id) =>
        set(state => ({
          plans: state.plans.map(p => ({ ...p, isActive: p.id === id })),
        })),
      deactivatePlan: (id) =>
        set(state => ({
          plans: state.plans.map(p => p.id === id ? { ...p, isActive: false } : p),
        })),
    }),
    { name: 'cardio-plans' }
  )
)
