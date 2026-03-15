import { Clock, Flame, TrendingUp, Zap } from 'lucide-react'
import StatCard from '../components/ui/StatCard'
import VolumeAreaChart from '../components/charts/VolumeAreaChart'
import WeeklyBarChart from '../components/charts/WeeklyBarChart'
import ActivityDonut from '../components/charts/ActivityDonut'
import HeatmapCalendar from '../components/charts/HeatmapCalendar'
import { useSessionsStore } from '../store/sessionsStore'
import { useSettingsStore } from '../store/settingsStore'
import { usePlansStore } from '../store/plansStore'
import {
  getTodayVolume,
  getWeeklyVolume,
  getMonthlyVolume,
  getCurrentStreak,
  formatDuration,
} from '../lib/metrics'
import { ACTIVITY_LABELS } from '../types'

export default function Dashboard() {
  const sessions = useSessionsStore(s => s.sessions)
  const settings = useSettingsStore(s => s.settings)
  const activePlan = usePlansStore(s => s.plans.find(p => p.isActive))

  const todayVol = getTodayVolume(sessions)
  const weekVol = getWeeklyVolume(sessions)
  const monthVol = getMonthlyVolume(sessions)
  const streak = getCurrentStreak(sessions)
  const weekPct = settings.weeklyVolumeGoal > 0 ? Math.round((weekVol / settings.weeklyVolumeGoal) * 100) : 0

  // Month-over-month trend
  const lastMonthStart = (() => {
    const d = new Date(); d.setMonth(d.getMonth() - 1)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
  })()
  const thisMonthStart = (() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
  })()
  const lastMonthVol = sessions
    .filter(s => s.date >= lastMonthStart && s.date < thisMonthStart)
    .reduce((sum, s) => sum + s.duration, 0)
  const trend = lastMonthVol > 0 ? Math.round(((monthVol - lastMonthVol) / lastMonthVol) * 100) : 0

  // This month sessions
  const thisMonthSessions = sessions.filter(s => s.date >= thisMonthStart)

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
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
          subtext={`${thisMonthSessions.length} sessions`}
          icon={Flame}
          color="orange"
          trend={trend}
        />
        <StatCard
          label="Streak"
          value={streak > 0 ? `${streak} days` : '—'}
          subtext={streak > 0 ? 'Keep it up!' : 'Log a session'}
          icon={Zap}
          color="purple"
        />
      </div>

      {/* Weekly goal progress bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-300 text-sm font-medium">Weekly Goal Progress</span>
          <span className="text-slate-400 text-sm">{formatDuration(weekVol)} / {formatDuration(settings.weeklyVolumeGoal)}</span>
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
      </div>

      {/* Main area chart */}
      <VolumeAreaChart sessions={sessions} days={30} />

      {/* Row 2: Weekly bar + Donut */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <WeeklyBarChart sessions={sessions} weeks={12} />
        </div>
        <ActivityDonut sessions={thisMonthSessions} />
      </div>

      {/* Row 3: Heatmap + Active plan */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <HeatmapCalendar sessions={sessions} />
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-1">Active Plan</h3>
          {activePlan ? (
            <div>
              <p className="text-blue-400 font-medium text-sm">{activePlan.name}</p>
              <p className="text-slate-400 text-xs mt-1">{activePlan.description}</p>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Duration</span>
                  <span className="text-slate-300">{activePlan.durationWeeks} weeks</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Sessions/week</span>
                  <span className="text-slate-300">
                    {Math.round(activePlan.sessions.filter(s => s.weekNumber === 1).length)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Goal</span>
                  <span className="text-slate-300 capitalize">{activePlan.goal.replace('_', ' ')}</span>
                </div>
              </div>
              {activePlan.sessions.length > 0 && (
                <div className="mt-3">
                  <p className="text-slate-500 text-xs mb-2">Week 1 Preview</p>
                  <div className="space-y-1">
                    {activePlan.sessions.filter(s => s.weekNumber === 1).slice(0, 3).map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        <span className="text-slate-300 capitalize">{ACTIVITY_LABELS[s.activity]}</span>
                        <span className="text-slate-500">{s.targetDuration}m</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <p className="text-slate-500 text-sm">No active plan</p>
              <p className="text-slate-600 text-xs mt-1">Create or activate a plan in Plans</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
