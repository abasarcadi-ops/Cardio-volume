import { WorkoutSession, ActivityType } from '../types'

export function getTodayStr(): string {
  return new Date().toISOString().split('T')[0]
}

export function getDateRange(days: number): string[] {
  const dates: string[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
}

export function getWeekStart(date: Date): string {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - day)
  return d.toISOString().split('T')[0]
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

export function formatDistance(km: number): string {
  return `${km.toFixed(1)} km`
}

export function getTodayVolume(sessions: WorkoutSession[]): number {
  const today = getTodayStr()
  return sessions
    .filter(s => s.date === today)
    .reduce((sum, s) => sum + s.duration, 0)
}

export function getWeeklyVolume(sessions: WorkoutSession[]): number {
  const now = new Date()
  const weekStart = getWeekStart(now)
  return sessions
    .filter(s => s.date >= weekStart)
    .reduce((sum, s) => sum + s.duration, 0)
}

export function getMonthlyVolume(sessions: WorkoutSession[]): number {
  const now = new Date()
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
  return sessions
    .filter(s => s.date >= monthStart)
    .reduce((sum, s) => sum + s.duration, 0)
}

export function getCurrentStreak(sessions: WorkoutSession[]): number {
  if (sessions.length === 0) return 0
  const activeDates = new Set(sessions.map(s => s.date))
  let streak = 0
  const today = new Date()
  // Check from today backwards
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const ds = d.toISOString().split('T')[0]
    if (activeDates.has(ds)) {
      streak++
    } else if (i > 0) {
      break
    }
  }
  return streak
}

export function getDailyVolumeData(sessions: WorkoutSession[], days: number) {
  const dates = getDateRange(days)
  return dates.map(date => {
    const daySessions = sessions.filter(s => s.date === date)
    const byActivity: Record<string, number> = {}
    daySessions.forEach(s => {
      byActivity[s.activity] = (byActivity[s.activity] || 0) + s.duration
    })
    return { date, total: daySessions.reduce((sum, s) => sum + s.duration, 0), ...byActivity }
  })
}

export function getWeeklyVolumeData(sessions: WorkoutSession[], weeks: number) {
  const result = []
  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() - i * 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)
    const ws = weekStart.toISOString().split('T')[0]
    const we = weekEnd.toISOString().split('T')[0]
    const weekSessions = sessions.filter(s => s.date >= ws && s.date <= we)
    const byActivity: Record<string, number> = {}
    weekSessions.forEach(s => {
      byActivity[s.activity] = (byActivity[s.activity] || 0) + s.duration
    })
    const label = `W${weekStart.getMonth() + 1}/${weekStart.getDate()}`
    result.push({ week: label, total: weekSessions.reduce((sum, s) => sum + s.duration, 0), ...byActivity })
  }
  return result
}

export function getActivityDistribution(sessions: WorkoutSession[]) {
  const counts: Record<ActivityType, number> = {} as Record<ActivityType, number>
  sessions.forEach(s => {
    counts[s.activity] = (counts[s.activity] || 0) + s.duration
  })
  return Object.entries(counts).map(([activity, value]) => ({ activity, value }))
}

export function getHeatmapData(sessions: WorkoutSession[]) {
  const map: Record<string, number> = {}
  sessions.forEach(s => {
    map[s.date] = (map[s.date] || 0) + s.duration
  })
  return map
}

export function getPersonalRecords(sessions: WorkoutSession[]) {
  if (sessions.length === 0) return null
  const longestSession = sessions.reduce((a, b) => a.duration > b.duration ? a : b)
  const mostCalories = sessions.filter(s => s.calories).reduce((a, b) => (a.calories || 0) > (b.calories || 0) ? a : b, sessions[0])
  const longestDistance = sessions.filter(s => s.distance).reduce((a, b) => (a.distance || 0) > (b.distance || 0) ? a : b, sessions[0])
  return { longestSession, mostCalories, longestDistance }
}

export function getMonthlyComparison(sessions: WorkoutSession[]) {
  const result = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const monthStart = `${year}-${String(month).padStart(2, '0')}-01`
    const nextMonth = new Date(year, month, 1)
    const monthEnd = nextMonth.toISOString().split('T')[0]
    const monthSessions = sessions.filter(s => s.date >= monthStart && s.date < monthEnd)
    const total = monthSessions.reduce((sum, s) => sum + s.duration, 0)
    result.push({
      month: d.toLocaleString('default', { month: 'short' }),
      volume: total,
      sessions: monthSessions.length,
    })
  }
  return result
}

export function getWeeklyConsistency(sessions: WorkoutSession[], goalMinutes: number, weeks: number) {
  const result = []
  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() - i * 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)
    const ws = weekStart.toISOString().split('T')[0]
    const we = weekEnd.toISOString().split('T')[0]
    const total = sessions.filter(s => s.date >= ws && s.date <= we).reduce((sum, s) => sum + s.duration, 0)
    const pct = goalMinutes > 0 ? Math.min(100, Math.round((total / goalMinutes) * 100)) : 0
    result.push({ week: `W${weekStart.getMonth() + 1}/${weekStart.getDate()}`, percentage: pct, volume: total })
  }
  return result
}
