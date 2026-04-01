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

export type TrainingZone =
  | 'recovery'
  | 'zone2'
  | 'tempo'
  | 'threshold'
  | 'vo2max'
  | 'hiit'
  | 'long_run'
  | 'compromised'

export const TRAINING_ZONE_LABELS: Record<TrainingZone, string> = {
  recovery:    'Recovery',
  zone2:       'Zone 2',
  tempo:       'Tempo',
  threshold:   'Threshold',
  vo2max:      'VO2 Max',
  hiit:        'HIIT',
  long_run:    'Long Run',
  compromised: 'Compromised',
}

export const TRAINING_ZONE_SHORT: Record<TrainingZone, string> = {
  recovery:    'Rec',
  zone2:       'Z2',
  tempo:       'Tempo',
  threshold:   'Thr',
  vo2max:      'VO2',
  hiit:        'HIIT',
  long_run:    'LR',
  compromised: 'Comp',
}

export const TRAINING_ZONE_COLORS: Record<TrainingZone, string> = {
  recovery:    '#6b7280',  // gray     — very easy / active recovery
  zone2:       '#10b981',  // emerald  — aerobic base, fat burning
  tempo:       '#f59e0b',  // amber    — comfortably hard / lactate threshold
  threshold:   '#f97316',  // orange   — threshold work
  vo2max:      '#ef4444',  // red      — VO2 max intervals
  hiit:        '#dc2626',  // deep red — high intensity intervals
  long_run:    '#3b82f6',  // blue     — long slow distance
  compromised: '#8b5cf6',  // purple   — brick / compromised running
}

export interface WorkoutSession {
  id: string
  date: string // ISO date string YYYY-MM-DD
  activity: ActivityType
  duration: number // minutes (target if planned, actual if completed)
  distance?: number // km
  calories?: number
  avgHeartRate?: number
  maxHeartRate?: number
  perceivedEffort: 1 | 2 | 3 | 4 | 5
  notes?: string
  customName?: string
  status: 'planned' | 'completed'
  trainingZone?: TrainingZone
}

export interface PlannedSession {
  weekNumber: number
  dayOfWeek: number // 0 = Sunday
  activity: ActivityType
  targetDuration: number // minutes
  targetDistance?: number
  intensity: IntensityLevel
  description: string
  trainingZone?: TrainingZone
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
  name: string
  weeklyVolumeGoal: number // minutes
  preferredActivities: ActivityType[]
  fitnessLevel: FitnessLevel
  goal: string
  // Onboarding fields
  age?: number
  weightKg?: number
  heightCm?: number
  raceType?: string   // e.g. '5K', '10K', 'half-marathon', 'marathon', 'triathlon'
  raceDate?: string   // ISO date YYYY-MM-DD
  injuries?: string
  onboardingComplete: boolean
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
