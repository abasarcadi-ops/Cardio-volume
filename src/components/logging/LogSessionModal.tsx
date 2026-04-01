import { useState } from 'react'
import Modal from '../ui/Modal'
import { useSessionsStore } from '../../store/sessionsStore'
import { ActivityType, ACTIVITY_COLORS, ACTIVITY_LABELS, EFFORT_LABELS } from '../../types'
import { getTodayStr } from '../../lib/metrics'
import ActivityIcon from '../ui/ActivityIcon'

const ACTIVITIES: ActivityType[] = ['running', 'cycling', 'rowing', 'swimming', 'elliptical', 'hiit', 'walking', 'custom']

interface Props {
  onClose: () => void
}

export default function LogSessionModal({ onClose }: Props) {
  const addSession = useSessionsStore(s => s.addSession)

  const [activity, setActivity] = useState<ActivityType>('running')
  const [date, setDate] = useState(getTodayStr())
  const [duration, setDuration] = useState(30)
  const [distance, setDistance] = useState('')
  const [calories, setCalories] = useState('')
  const [avgHR, setAvgHR] = useState('')
  const [effort, setEffort] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [notes, setNotes] = useState('')
  const [customName, setCustomName] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    addSession({
      date,
      activity,
      duration,
      distance: distance ? parseFloat(distance) : undefined,
      calories: calories ? parseInt(calories) : undefined,
      avgHeartRate: avgHR ? parseInt(avgHR) : undefined,
      perceivedEffort: effort,
      notes: notes || undefined,
      customName: customName || undefined,
      status: 'completed',
    })
    onClose()
  }

  return (
    <Modal title="Log Session" onClose={onClose} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Activity picker */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Activity</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ACTIVITIES.map(a => {
              const selected = activity === a
              const color = ACTIVITY_COLORS[a]
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => setActivity(a)}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all text-xs font-medium ${
                    selected
                      ? 'border-transparent'
                      : 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                  }`}
                  style={selected ? { borderColor: color, backgroundColor: `${color}15`, color } : {}}
                >
                  <ActivityIcon activity={a} size={20} />
                  {ACTIVITY_LABELS[a]}
                </button>
              )
            })}
          </div>
        </div>

        {activity === 'custom' && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Activity Name</label>
            <input
              type="text"
              value={customName}
              onChange={e => setCustomName(e.target.value)}
              placeholder="e.g. Jump rope"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Duration: <span className="text-blue-400">{duration} min</span>
            </label>
            <input
              type="range"
              min={5}
              max={180}
              step={5}
              value={duration}
              onChange={e => setDuration(parseInt(e.target.value))}
              className="w-full accent-blue-500 mt-2"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-0.5">
              <span>5m</span><span>3h</span>
            </div>
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

        {/* Perceived Effort */}
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
            placeholder="How did it feel? Any observations..."
            rows={2}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
          >
            Save Session
          </button>
        </div>
      </form>
    </Modal>
  )
}
