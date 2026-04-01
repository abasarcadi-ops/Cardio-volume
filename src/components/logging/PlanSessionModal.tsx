import { useState } from 'react'
import Modal from '../ui/Modal'
import { useSessionsStore } from '../../store/sessionsStore'
import { ActivityType, ACTIVITY_COLORS, ACTIVITY_LABELS, TrainingZone, TRAINING_ZONE_LABELS, TRAINING_ZONE_COLORS } from '../../types'
import ActivityIcon from '../ui/ActivityIcon'

const ACTIVITIES: ActivityType[] = ['running', 'cycling', 'rowing', 'swimming', 'elliptical', 'hiit', 'walking', 'custom']
const ZONES: TrainingZone[] = ['recovery', 'zone2', 'tempo', 'threshold', 'vo2max', 'hiit', 'long_run', 'compromised']

interface Props {
  date: string
  onClose: () => void
}

export default function PlanSessionModal({ date, onClose }: Props) {
  const addSession = useSessionsStore(s => s.addSession)

  const [activity, setActivity] = useState<ActivityType>('running')
  const [duration, setDuration] = useState(45)
  const [distance, setDistance] = useState('')
  const [notes, setNotes] = useState('')
  const [zone, setZone] = useState<TrainingZone | undefined>()

  const displayDate = new Date(date + 'T12:00:00').toLocaleDateString('en', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    addSession({
      date,
      activity,
      duration,
      distance: distance ? parseFloat(distance) : undefined,
      perceivedEffort: 3,
      notes: notes || undefined,
      status: 'planned',
      trainingZone: zone,
    })
    onClose()
  }

  return (
    <Modal title={`Plan Session — ${displayDate}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Activity */}
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

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Target duration: <span className="text-blue-400">{duration} min</span>
          </label>
          <input
            type="range"
            min={5}
            max={240}
            step={5}
            value={duration}
            onChange={e => setDuration(parseInt(e.target.value))}
            className="w-full accent-blue-500 mt-1"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-0.5">
            <span>5m</span><span>4h</span>
          </div>
        </div>

        {/* Training Zone */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Training Zone — optional</label>
          <div className="flex flex-wrap gap-2">
            {ZONES.map(z => {
              const color = TRAINING_ZONE_COLORS[z]
              const selected = zone === z
              return (
                <button
                  key={z}
                  type="button"
                  onClick={() => setZone(selected ? undefined : z)}
                  className="px-2.5 py-1 rounded-full text-xs font-medium border transition-all"
                  style={selected
                    ? { backgroundColor: `${color}25`, borderColor: color, color }
                    : { borderColor: '#334155', color: '#64748b' }}
                >
                  {TRAINING_ZONE_LABELS[z]}
                </button>
              )
            })}
          </div>
        </div>

        {/* Distance */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Target distance (km) — optional</label>
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

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Notes — optional</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="e.g. Easy pace, zone 2"
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
            Add to Schedule
          </button>
        </div>
      </form>
    </Modal>
  )
}
