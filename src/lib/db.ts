import { SupabaseClient } from '@supabase/supabase-js'
import { WorkoutSession, TrainingPlan, UserSettings } from '../types'

// ── Sessions ──────────────────────────────────────────────────────────────────

function rowToSession(row: Record<string, unknown>): WorkoutSession {
  return {
    id: row.id as string,
    date: row.date as string,
    activity: row.activity as WorkoutSession['activity'],
    duration: row.duration as number,
    distance: row.distance as number | undefined,
    calories: row.calories as number | undefined,
    avgHeartRate: row.avg_heart_rate as number | undefined,
    maxHeartRate: row.max_heart_rate as number | undefined,
    perceivedEffort: row.perceived_effort as WorkoutSession['perceivedEffort'],
    notes: row.notes as string | undefined,
    customName: row.custom_name as string | undefined,
    status: (row.status as 'planned' | 'completed') ?? 'completed',
  }
}

export async function fetchSessions(sb: SupabaseClient, userId: string): Promise<WorkoutSession[]> {
  const { data, error } = await sb
    .from('workout_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
  if (error) throw error
  return (data ?? []).map(rowToSession)
}

export async function insertSession(
  sb: SupabaseClient,
  session: Omit<WorkoutSession, 'id'>,
  userId: string,
): Promise<string> {
  const id = crypto.randomUUID()
  const { error } = await sb.from('workout_sessions').insert({
    id,
    user_id: userId,
    date: session.date,
    activity: session.activity,
    duration: session.duration,
    distance: session.distance ?? null,
    calories: session.calories ?? null,
    avg_heart_rate: session.avgHeartRate ?? null,
    max_heart_rate: session.maxHeartRate ?? null,
    perceived_effort: session.perceivedEffort,
    notes: session.notes ?? null,
    custom_name: session.customName ?? null,
    status: session.status,
  })
  if (error) throw error
  return id
}

export async function updateSessionDB(
  sb: SupabaseClient,
  id: string,
  updates: Partial<WorkoutSession>,
): Promise<void> {
  const row: Record<string, unknown> = {}
  if (updates.date !== undefined) row.date = updates.date
  if (updates.activity !== undefined) row.activity = updates.activity
  if (updates.duration !== undefined) row.duration = updates.duration
  if (updates.distance !== undefined) row.distance = updates.distance
  if (updates.calories !== undefined) row.calories = updates.calories
  if (updates.avgHeartRate !== undefined) row.avg_heart_rate = updates.avgHeartRate
  if (updates.maxHeartRate !== undefined) row.max_heart_rate = updates.maxHeartRate
  if (updates.perceivedEffort !== undefined) row.perceived_effort = updates.perceivedEffort
  if (updates.notes !== undefined) row.notes = updates.notes
  if (updates.customName !== undefined) row.custom_name = updates.customName
  if (updates.status !== undefined) row.status = updates.status
  const { error } = await sb.from('workout_sessions').update(row).eq('id', id)
  if (error) throw error
}

export async function deleteSessionDB(sb: SupabaseClient, id: string): Promise<void> {
  const { error } = await sb.from('workout_sessions').delete().eq('id', id)
  if (error) throw error
}

// ── Plans ─────────────────────────────────────────────────────────────────────

function rowToPlan(row: Record<string, unknown>): TrainingPlan {
  return {
    id: row.id as string,
    name: row.name as string,
    description: row.description as string,
    durationWeeks: row.duration_weeks as number,
    goal: row.goal as string,
    sessions: row.sessions as TrainingPlan['sessions'],
    isAIGenerated: row.is_ai_generated as boolean,
    createdAt: row.created_at as string,
    isActive: row.is_active as boolean,
    startDate: row.start_date as string | undefined,
  }
}

export async function fetchPlans(sb: SupabaseClient, userId: string): Promise<TrainingPlan[]> {
  const { data, error } = await sb
    .from('training_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(rowToPlan)
}

export async function insertPlan(
  sb: SupabaseClient,
  plan: TrainingPlan,
  userId: string,
): Promise<void> {
  const { error } = await sb.from('training_plans').insert({
    id: plan.id,
    user_id: userId,
    name: plan.name,
    description: plan.description,
    duration_weeks: plan.durationWeeks,
    goal: plan.goal,
    sessions: plan.sessions,
    is_ai_generated: plan.isAIGenerated,
    is_active: plan.isActive,
    start_date: plan.startDate ?? null,
  })
  if (error) throw error
}

export async function updatePlanDB(
  sb: SupabaseClient,
  id: string,
  updates: Partial<TrainingPlan>,
): Promise<void> {
  const row: Record<string, unknown> = {}
  if (updates.name !== undefined) row.name = updates.name
  if (updates.description !== undefined) row.description = updates.description
  if (updates.durationWeeks !== undefined) row.duration_weeks = updates.durationWeeks
  if (updates.goal !== undefined) row.goal = updates.goal
  if (updates.sessions !== undefined) row.sessions = updates.sessions
  if (updates.isAIGenerated !== undefined) row.is_ai_generated = updates.isAIGenerated
  if (updates.isActive !== undefined) row.is_active = updates.isActive
  if (updates.startDate !== undefined) row.start_date = updates.startDate
  const { error } = await sb.from('training_plans').update(row).eq('id', id)
  if (error) throw error
}

export async function deletePlanDB(sb: SupabaseClient, id: string): Promise<void> {
  const { error } = await sb.from('training_plans').delete().eq('id', id)
  if (error) throw error
}

// ── Settings ──────────────────────────────────────────────────────────────────

export async function fetchSettings(
  sb: SupabaseClient,
  userId: string,
): Promise<UserSettings | null> {
  const { data, error } = await sb
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows found
  if (!data) return null
  return {
    name: data.name,
    weeklyVolumeGoal: data.weekly_volume_goal,
    preferredActivities: data.preferred_activities,
    fitnessLevel: data.fitness_level,
    goal: data.goal,
    age: data.age ?? undefined,
    weightKg: data.weight_kg ?? undefined,
    heightCm: data.height_cm ?? undefined,
    raceType: data.race_type ?? undefined,
    raceDate: data.race_date ?? undefined,
    injuries: data.injuries ?? undefined,
    onboardingComplete: data.onboarding_complete ?? false,
  }
}

export async function upsertSettings(
  sb: SupabaseClient,
  settings: UserSettings,
  userId: string,
): Promise<void> {
  const { error } = await sb.from('user_settings').upsert({
    user_id: userId,
    name: settings.name,
    weekly_volume_goal: settings.weeklyVolumeGoal,
    preferred_activities: settings.preferredActivities,
    fitness_level: settings.fitnessLevel,
    goal: settings.goal,
    age: settings.age ?? null,
    weight_kg: settings.weightKg ?? null,
    height_cm: settings.heightCm ?? null,
    race_type: settings.raceType ?? null,
    race_date: settings.raceDate ?? null,
    injuries: settings.injuries ?? null,
    onboarding_complete: settings.onboardingComplete,
    updated_at: new Date().toISOString(),
  })
  if (error) throw error
}
