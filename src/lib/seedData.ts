import { WorkoutSession, ActivityType } from '../types'

function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

const activities: ActivityType[] = ['running', 'cycling', 'rowing', 'swimming', 'hiit', 'walking']

export function generateSeedData(): WorkoutSession[] {
  const sessions: WorkoutSession[] = []

  // Generate ~90 days of realistic data
  for (let i = 89; i >= 0; i--) {
    // Skip ~30% of days (rest days)
    if (Math.random() < 0.3) continue

    const activity = activities[Math.floor(Math.random() * activities.length)]
    const effort = (Math.floor(Math.random() * 4) + 2) as 2 | 3 | 4 | 5

    let duration: number
    let distance: number | undefined
    let calories: number | undefined

    switch (activity) {
      case 'running':
        duration = 25 + Math.floor(Math.random() * 45)
        distance = parseFloat((duration * 0.13).toFixed(1))
        calories = Math.round(duration * 9)
        break
      case 'cycling':
        duration = 30 + Math.floor(Math.random() * 60)
        distance = parseFloat((duration * 0.4).toFixed(1))
        calories = Math.round(duration * 7)
        break
      case 'rowing':
        duration = 20 + Math.floor(Math.random() * 30)
        distance = parseFloat((duration * 0.22).toFixed(1))
        calories = Math.round(duration * 8)
        break
      case 'swimming':
        duration = 20 + Math.floor(Math.random() * 30)
        distance = parseFloat((duration * 0.06).toFixed(1))
        calories = Math.round(duration * 8)
        break
      case 'hiit':
        duration = 20 + Math.floor(Math.random() * 25)
        calories = Math.round(duration * 11)
        break
      default:
        duration = 30 + Math.floor(Math.random() * 30)
        distance = parseFloat((duration * 0.08).toFixed(1))
        calories = Math.round(duration * 5)
    }

    sessions.push({
      id: generateId(),
      date: daysAgo(i),
      activity,
      duration,
      distance,
      calories,
      avgHeartRate: 120 + Math.floor(Math.random() * 50),
      perceivedEffort: effort,
      notes: '',
      status: 'completed',
    })
  }

  return sessions
}
