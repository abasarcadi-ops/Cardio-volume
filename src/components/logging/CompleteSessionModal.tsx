import { useState } from 'react'
import Modal from '../ui/Modal'
import { useSessionsStore } from '../../store/sessionsStore'
import { WorkoutSession, ACTIVITY_LABELS, EFFORT_LABELS } from '../../types'

interface Props {
  session: WorkoutSession
  onClose: () => void
}

export default function CompleteSessionModal({ session, onClose }: Props) {
  const updateSession = useSessionsStore(s => s.updateSession)
  const deleteSession = useSessionsStore(s => s.deleteSession)

  const [duration, setDuration] = useState(session.duration)
  const [distance, setDistance] = useState(session.distance?.toString() ?? '')
  const [calories, setCalories] = useState(session.calories?.toString() ?? '')
  const [avgHR, setAvgHR] = useState(session.avgHeartRate?.toString() ?? '')
  const [effort, setEffort] = useState<1 | 2 | 3 | 4 | 5>(session.perceivedEffort ?? 3)
  const [notes, setNotes] = useState(session.notes ?? '')

  const displayDate = new Date(session.date + 'T12:00:00').toLocaleDateString('en', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  function handleComplete(e: React.FormEvent) {
    e.preventDefault()
    updateSession(session.id, {
      status: 'completed',
      duration,
      distance: distance ? parseFloat(distance) : undefined,
      calories: calories ? parseInt(calories) : undefined,
      avgHeartRate: avgHR ? parseInt(avgHR) : undefined,
      perceivedEffort: effort,
      notes: notes || undefined,
    })
    onClose()
  }

  function handleDelete() {
    deleteSession(session.id)
    onClose()
  }

  return (
    <Modal title="Log Completed Session" onClose={onClose} size="lg">
      <div className="mb-4 px-3 py-2.5 bg-slate-800 rounded-lg flex items-center gap-2">
        <span className="text-xs text-slate-400">Planned:</span>
        <span className="text-sm text-white font-medium">
          {ACTIVITY_LABELS[session.activity]} · {session.duration}m
          {session.distance ? ` · ${session.distance}km` : ''}
        </span>
        <span className="text-xs text-slate-500 ml-auto">{displayDate}</span>
      </div>

      <form onSubmit={handleComplete} className="space-y-5">
        {/* Actual duration */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Actual duration: <span className="text-blue-400">{duration} min</span>
          </label>
          <input
            type="range"
            min={5}
            max={300}
            step={5}
            value={duration}
            onChange={e => setDuration(parseInt(e.target.value))}
            className="w-full accent-blue-500 mt-1"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-0.5">
            <span>5m</span><span>5h</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Distance (km)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={distance}
              onChange={e => setDistance(e.target.value)}
              placeholder="—"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Calories</label>
            <input
              type="number"
              min="0"
              value={calories}
              onChange={e => setCalories(e.target.value)}
              placeholder="—"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Avg HR (bpm)</label>
            <input
              type="number"
              min="0"
              max="250"
              value={avgHR}
              onChange={e => setAvgHR(e.target.value)}
              placeholder="—"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Effort */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Perceived Effort — <span className="text-blue-400">{EFFORT_LABELS[effort]}</span>
          </label>
          <div className="flex gap-2">
            {([1, 2, 3, 4, 5] as const).map(n => {
              const colors = ['#10b981', '#84cc16', '#f59e0b', '#f97316', '#ef4444']
              const c = colors[n - 1]
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setEffort(n)}
                  className="flex-1 py-2 rounded-lg text-sm font-bold transition-all border"
                  style={
                    effort === n
                      ? { backgroundColor: `${c}25`, borderColor: c, color: c }
                      : { borderColor: '#334155', color: '#64748b' }
                  }
                >
                  {n}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="How did it go?"
            rows={2}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2.5 rounded-lg border border-red-900 text-red-400 text-sm font-medium hover:bg-red-950 transition-colors"
          >
            Remove
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-semibold transition-colors"
          >
            Mark Done
          </button>
        </div>
      </form>
    </Modal>
  )
}
