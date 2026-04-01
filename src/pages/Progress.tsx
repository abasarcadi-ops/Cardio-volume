import { Trophy, Clock, Ruler, Flame } from 'lucide-react'
import { useSessionsStore } from '../store/sessionsStore'
import ProgressLineChart from '../components/charts/ProgressLineChart'
import MonthlyComparisonChart from '../components/charts/MonthlyComparisonChart'
import ConsistencyChart from '../components/charts/ConsistencyChart'
import { getPersonalRecords, formatDuration } from '../lib/metrics'
import { ACTIVITY_LABELS } from '../types'

export default function Progress() {
  const sessions = useSessionsStore(s => s.sessions)
  const prs = getPersonalRecords(sessions)

  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0)
  const totalDistance = sessions.reduce((sum, s) => sum + (s.distance || 0), 0)
  const totalCalories = sessions.reduce((sum, s) => sum + (s.calories || 0), 0)
  const totalSessions = sessions.length

  return (
    <div className="space-y-6">
      {/* Lifetime stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Sessions', value: totalSessions.toString(), icon: Trophy, color: 'purple' as const },
          { label: 'Total Volume', value: formatDuration(totalMinutes), icon: Clock, color: 'blue' as const },
          { label: 'Total Distance', value: `${totalDistance.toFixed(0)} km`, icon: Ruler, color: 'green' as const },
          { label: 'Total Calories', value: totalCalories.toLocaleString(), icon: Flame, color: 'orange' as const },
        ].map(stat => (
          <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-start gap-4">
            <div className={`rounded-lg p-2.5 ${
              stat.color === 'purple' ? 'bg-purple-500/10 text-purple-400' :
              stat.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
              stat.color === 'green' ? 'bg-emerald-500/10 text-emerald-400' :
              'bg-orange-500/10 text-orange-400'
            }`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">{stat.label}</p>
              <p className="text-2xl font-bold text-white mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Volume trend */}
      <ProgressLineChart sessions={sessions} />

      {/* Monthly comparison + consistency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MonthlyComparisonChart sessions={sessions} />
        <ConsistencyChart sessions={sessions} />
      </div>

      {/* Personal Records */}
      {prs && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h3 className="text-white font-semibold">Personal Records</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-slate-400 text-xs mb-1">Longest Session</p>
              <p className="text-white font-bold text-xl">{formatDuration(prs.longestSession.duration)}</p>
              <p className="text-slate-400 text-xs mt-1">
                {ACTIVITY_LABELS[prs.longestSession.activity]} · {new Date(prs.longestSession.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            {prs.mostCalories?.calories && (
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-slate-400 text-xs mb-1">Most Calories</p>
                <p className="text-white font-bold text-xl">{prs.mostCalories.calories} kcal</p>
                <p className="text-slate-400 text-xs mt-1">
                  {ACTIVITY_LABELS[prs.mostCalories.activity]} · {new Date(prs.mostCalories.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            )}
            {prs.longestDistance?.distance && (
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-slate-400 text-xs mb-1">Longest Distance</p>
                <p className="text-white font-bold text-xl">{prs.longestDistance.distance?.toFixed(1)} km</p>
                <p className="text-slate-400 text-xs mt-1">
                  {ACTIVITY_LABELS[prs.longestDistance.activity]} · {new Date(prs.longestDistance.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
