import { AIPlanParams, TrainingPlan, PlannedSession, ActivityType, IntensityLevel, TrainingZone } from '../types'

function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

function getTrainingZone(activity: ActivityType, intensity: IntensityLevel, isLong: boolean): TrainingZone {
  if (isLong) return 'long_run'
  if (activity === 'hiit') return 'hiit'
  switch (intensity) {
    case 'easy':     return 'zone2'
    case 'moderate': return 'tempo'
    case 'hard':     return 'threshold'
    case 'race':     return 'vo2max'
  }
}

function buildMockPlan(params: AIPlanParams): TrainingPlan {
  const { goal, fitnessLevel, daysPerWeek, preferredActivities, durationWeeks } = params
  const activities = preferredActivities.length > 0 ? preferredActivities : ['running' as ActivityType]
  const sessions: PlannedSession[] = []

  // Distribute sessions across weekdays
  const activeDays = [1, 2, 3, 4, 5, 6, 0].slice(0, daysPerWeek) // Mon-Sun priority

  const intensityByWeek = (week: number): IntensityLevel => {
    if (fitnessLevel === 'beginner') return week <= 2 ? 'easy' : week <= 5 ? 'moderate' : 'hard'
    if (fitnessLevel === 'intermediate') return week <= 1 ? 'easy' : week <= 4 ? 'moderate' : week <= 6 ? 'hard' : 'race'
    return week <= 1 ? 'moderate' : week <= 3 ? 'hard' : 'race'
  }

  const baseDuration = fitnessLevel === 'beginner' ? 25 : fitnessLevel === 'intermediate' ? 40 : 55

  for (let w = 1; w <= durationWeeks; w++) {
    activeDays.forEach((day, idx) => {
      const activity = activities[idx % activities.length]
      const intensity = intensityByWeek(w)
      const progressionFactor = 1 + (w - 1) * 0.07
      const duration = Math.round(baseDuration * progressionFactor)
      const isLong = idx === activeDays.length - 1
      const sessionIntensity: IntensityLevel = isLong ? 'easy' : intensity
      const zone = getTrainingZone(activity, sessionIntensity, isLong)

      sessions.push({
        weekNumber: w,
        dayOfWeek: day,
        activity,
        targetDuration: isLong ? Math.round(duration * 1.4) : duration,
        intensity: sessionIntensity,
        description: buildSessionDescription(activity, sessionIntensity, isLong),
        trainingZone: zone,
      })
    })
  }

  const goalLabel = goal === 'weight_loss' ? 'Weight Loss' : goal === 'endurance' ? 'Endurance' : goal === 'performance' ? 'Performance' : 'General Fitness'

  return {
    id: generateId(),
    name: `AI ${goalLabel} Plan — ${durationWeeks} Weeks`,
    description: `A personalized ${durationWeeks}-week ${goalLabel.toLowerCase()} plan for ${fitnessLevel} athletes. ${daysPerWeek} sessions per week with progressive overload.`,
    durationWeeks,
    goal,
    sessions,
    isAIGenerated: true,
    createdAt: new Date().toISOString(),
    isActive: false,
  }
}

function buildSessionDescription(activity: ActivityType, intensity: IntensityLevel, isLong: boolean): string {
  const intensityDesc: Record<IntensityLevel, string> = {
    easy: 'conversational pace, stay in Zone 2',
    moderate: 'comfortably hard, Zone 3',
    hard: 'challenging effort, Zone 4',
    race: 'race pace, maximum sustainable effort',
  }
  const prefix = isLong ? 'Long session — ' : ''
  const actLabel = activity.charAt(0).toUpperCase() + activity.slice(1)
  return `${prefix}${actLabel} at ${intensityDesc[intensity]}`
}

export async function generateTrainingPlan(params: AIPlanParams): Promise<TrainingPlan> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

  if (!apiKey) {
    // Mock mode — simulate delay
    await new Promise(r => setTimeout(r, 2200))
    return buildMockPlan(params)
  }

  // Real Anthropic call
  try {
    const Anthropic = (await import('@anthropic-ai/sdk')).default
    const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

    const prompt = `You are a professional endurance coach. Generate a ${params.durationWeeks}-week cardio training plan.

User profile:
- Goal: ${params.goal}
- Fitness level: ${params.fitnessLevel}
- Days per week: ${params.daysPerWeek}
- Preferred activities: ${params.preferredActivities.join(', ')}
- Limitations: ${params.limitations || 'none'}

Training zone definitions (assign one to each session):
- "recovery"    — Very easy active recovery, Zone 1, <60% max HR
- "zone2"       — Aerobic base building, fat burning, Zone 2, conversational pace
- "tempo"       — Comfortably hard, lactate threshold, Zone 3, 20-40min efforts
- "threshold"   — Threshold intervals, Zone 4, sustained hard effort
- "vo2max"      — VO2 max intervals, Zone 5, short hard efforts with rest
- "hiit"        — High intensity intervals, anaerobic work
- "long_run"    — Long slow distance, easy pace for extended duration
- "compromised" — Compromised running / brick workouts (run immediately after bike)

Return ONLY valid JSON (no markdown, no explanation):
{
  "name": string,
  "description": string,
  "sessions": Array<{
    "weekNumber": number,
    "dayOfWeek": number (0=Sun),
    "activity": "running"|"cycling"|"rowing"|"swimming"|"elliptical"|"hiit"|"walking"|"custom",
    "targetDuration": number (minutes),
    "targetDistance": number (optional, km),
    "intensity": "easy"|"moderate"|"hard"|"race",
    "trainingZone": "recovery"|"zone2"|"tempo"|"threshold"|"vo2max"|"hiit"|"long_run"|"compromised",
    "description": string
  }>
}`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.content[0]
    if (content.type !== 'text') throw new Error('Unexpected response type')
    const parsed = JSON.parse(content.text)

    return {
      id: generateId(),
      name: parsed.name,
      description: parsed.description,
      durationWeeks: params.durationWeeks,
      goal: params.goal,
      sessions: parsed.sessions,
      isAIGenerated: true,
      createdAt: new Date().toISOString(),
      isActive: false,
    }
  } catch {
    // Fallback to mock on error
    return buildMockPlan(params)
  }
}
