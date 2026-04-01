import { Trash2, Clock, Ruler, Flame, Heart } from 'lucide-react'
import { WorkoutSession, ACTIVITY_COLORS } from '../../types'
import { ActivityBadge, EffortBadge } from '../ui/Badge'
import { formatDuration } from '../../lib/metrics'
import { useSessionsStore } from '../../store/sessionsStore'
import ActivityIcon from '../ui/ActivityIcon'

interface Props {
  session: WorkoutSession
}

export default function SessionCard({ session }: Props) {
  const deleteSession = useSessionsStore(s => s.deleteSession)

  const dateLabel = new Date(session.date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4 hover:border-slate-700 transition-colors group">
      <div className="w-10 flex items-center justify-center shrink-0" style={{ color: ACTIVITY_COLORS[session.activity] }}>
        <ActivityIcon activity={session.activity} size={24} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <ActivityBadge activity={session.activity} />
          <EffortBadge effort={session.perceivedEffort} />
          <span className="text-slate-500 text-xs">{dateLabel}</span>
        </div>
        {session.notes && (
          <p className="text-slate-400 text-xs mt-1 truncate">{session.notes}</p>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm shrink-0">
        <div className="flex items-center gap-1 text-slate-300">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          {formatDuration(session.duration)}
        </div>
        {session.distance && (
          <div className="flex items-center gap-1 text-slate-300">
            <Ruler className="w-3.5 h-3.5 text-slate-500" />
            {session.distance.toFixed(1)} km
          </div>
        )}
        {session.calories && (
          <div className="flex items-center gap-1 text-slate-300">
            <Flame className="w-3.5 h-3.5 text-slate-500" />
            {session.calories}
          </div>
        )}
        {session.avgHeartRate && (
          <div className="flex items-center gap-1 text-slate-300">
            <Heart className="w-3.5 h-3.5 text-red-400" />
            {session.avgHeartRate}
          </div>
        )}
      </div>

      <button
        onClick={() => deleteSession(session.id)}
        className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
