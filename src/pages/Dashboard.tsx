import { useState } from 'react'
import { Clock, Flame, TrendingUp, Zap } from 'lucide-react'
import StatCard from '../components/ui/StatCard'
import WeekCalendar from '../components/dashboard/WeekCalendar'
import PlanSessionModal from '../components/logging/PlanSessionModal'
import CompleteSessionModal from '../components/logging/CompleteSessionModal'
import LogSessionModal from '../components/logging/LogSessionModal'
import ActivityDonut from '../components/charts/ActivityDonut'
import { useSessionsStore } from '../store/sessionsStore'
import { useSettingsStore } from '../store/settingsStore'
import {
  getTodayVolume,
  getWeeklyVolume,
  getMonthlyVolume,
  getCurrentStreak,
  formatDuration,
} from '../lib/metrics'
import { WorkoutSession } from '../types'

export default function Dashboard() {
  const sessions = useSessionsStore(s => s.sessions)
  const settings = useSettingsStore(s => s.settings)

  // Only count completed sessions for stats
  const completed = sessions.filter(s => s.status === 'completed')

  const todayVol = getTodayVolume(completed)
  const weekVol = getWeeklyVolume(completed)
  const monthVol = getMonthlyVolume(completed)
  const streak = getCurrentStreak(completed)
  const weekPct = settings.weeklyVolumeGoal > 0
    ? Math.round((weekVol / settings.weeklyVolumeGoal) * 100)
    : 0

  const thisMonthStart = (() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
  })()
  const thisMonthCompleted = completed.filter(s => s.date >= thisMonthStart)

  // Modal state
  const [planDate, setPlanDate] = useState<string | null>(null)
  const [completeSession, setCompleteSession] = useState<WorkoutSession | null>(null)
  const [viewSession, setViewSession] = useState<WorkoutSession | null>(null)

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Today"
          value={todayVol > 0 ? formatDuration(todayVol) : '—'}
          subtext={todayVol > 0 ? 'active today' : 'Rest day'}
          icon={Clock}
          color="blue"
        />
        <StatCard
          label="This Week"
          value={formatDuration(weekVol)}
          subtext={`${weekPct}% of ${formatDuration(settings.weeklyVolumeGoal)} goal`}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          label="This Month"
          value={formatDuration(monthVol)}
          subtext={`${thisMonthCompleted.length} sessions`}
          icon={Flame}
          color="orange"
        />
        <StatCard
          label="Streak"
          value={streak > 0 ? `${streak} days` : '—'}
          subtext={streak > 0 ? 'Keep it up!' : 'Log a session'}
          icon={Zap}
          color="purple"
        />
      </div>

      {/* Weekly goal progress */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-300 text-sm font-medium">Weekly Goal</span>
          <span className="text-slate-400 text-sm">
            {formatDuration(weekVol)} / {formatDuration(settings.weeklyVolumeGoal)}
          </span>
        </div>
        <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, weekPct)}%`,
              background: weekPct >= 100 ? '#10b981' : 'linear-gradient(90deg, #3b82f6, #10b981)',
            }}
          />
        </div>
        {settings.raceDate && (
          <p className="text-xs text-slate-500 mt-2">
            {settings.raceType ? `🏁 ${settings.raceType}` : '🏁 Race'} —{' '}
            {new Date(settings.raceDate + 'T12:00:00').toLocaleDateString('en', {
              month: 'long', day: 'numeric', year: 'numeric',
            })}
          </p>
        )}
      </div>

      {/* Weekly calendar */}
      <WeekCalendar
        sessions={sessions}
        onPlanDay={date => setPlanDate(date)}
        onCompleteSession={s => setCompleteSession(s)}
        onViewSession={s => setViewSession(s)}
      />

      {/* Activity mix this month */}
      {thisMonthCompleted.length > 0 && (
        <ActivityDonut sessions={thisMonthCompleted} />
      )}

      {/* Modals */}
      {planDate && (
        <PlanSessionModal date={planDate} onClose={() => setPlanDate(null)} />
      )}
      {completeSession && (
        <CompleteSessionModal
          session={completeSession}
          onClose={() => setCompleteSession(null)}
        />
      )}
      {viewSession && (
        <LogSessionModal onClose={() => setViewSession(null)} />
      )}
    </div>
  )
}
