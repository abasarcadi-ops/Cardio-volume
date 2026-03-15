export type ActivityType =
  | 'running'
  | 'cycling'
  | 'rowing'
  | 'swimming'
  | 'elliptical'
  | 'hiit'
  | 'walking'
  | 'custom'

export type IntensityLevel = 'easy' | 'moderate' | 'hard' | 'race'
export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced'

export interface WorkoutSession {
  id: string
  date: string // ISO date string YYYY-MM-DD
  activity: ActivityType
  duration: number // minutes
  distance?: number // km
  calories?: number
  avgHeartRate?: number
  maxHeartRate?: number
  perceivedEffort: 1 | 2 | 3 | 4 | 5
  notes?: string
  customName?: string
}

export interface PlannedSession {
  weekNumber: number
  dayOfWeek: number // 0 = Sunday
  activity: ActivityType
  targetDuration: number // minutes
  targetDistance?: number
  intensity: IntensityLevel
  description: string
}

export interface TrainingPlan {
  id: string
  name: string
  description: string
  durationWeeks: number
  goal: string
  sessions: PlannedSession[]
  isAIGenerated: boolean
  createdAt: string
  isActive: boolean
  startDate?: string
}

export interface UserSettings {
  weeklyVolumeGoal: number // minutes
  preferredActivities: ActivityType[]
  fitnessLevel: FitnessLevel
  goal: string
  name: string
}

export interface AIPlanParams {
  goal: string
  fitnessLevel: FitnessLevel
  daysPerWeek: number
  preferredActivities: ActivityType[]
  durationWeeks: number
  limitations?: string
}

export const ACTIVITY_COLORS: Record<ActivityType, string> = {
  running: '#3b82f6',
  cycling: '#10b981',
  rowing: '#f59e0b',
  swimming: '#06b6d4',
  elliptical: '#8b5cf6',
  hiit: '#ef4444',
  walking: '#6b7280',
  custom: '#ec4899',
}

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  running: 'Running',
  cycling: 'Cycling',
  rowing: 'Rowing',
  swimming: 'Swimming',
  elliptical: 'Elliptical',
  hiit: 'HIIT',
  walking: 'Walking',
  custom: 'Custom',
}

export const EFFORT_LABELS: Record<number, string> = {
  1: 'Very Easy',
  2: 'Easy',
  3: 'Moderate',
  4: 'Hard',
  5: 'Max Effort',
}

export const EFFORT_COLORS: Record<number, string> = {
  1: '#10b981',
  2: '#84cc16',
  3: '#f59e0b',
  4: '#f97316',
  5: '#ef4444',
}
