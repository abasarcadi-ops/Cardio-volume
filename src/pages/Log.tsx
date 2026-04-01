import { useState, useMemo } from 'react'
import { Search, Filter } from 'lucide-react'
import { useSessionsStore } from '../store/sessionsStore'
import SessionCard from '../components/logging/SessionCard'
import { ActivityType, ACTIVITY_LABELS } from '../types'

const ALL = 'all'

export default function Log() {
  const sessions = useSessionsStore(s => s.sessions)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<ActivityType | 'all'>(ALL)

  const sorted = useMemo(() =>
    [...sessions].sort((a, b) => b.date.localeCompare(a.date)),
    [sessions]
  )

  const filtered = useMemo(() =>
    sorted.filter(s => {
      const matchActivity = filter === ALL || s.activity === filter
      const matchSearch = !search || s.activity.includes(search.toLowerCase()) || (s.notes || '').toLowerCase().includes(search.toLowerCase())
      return matchActivity && matchSearch
    }),
    [sorted, filter, search]
  )

  const activities: (ActivityType | 'all')[] = [ALL, 'running', 'cycling', 'rowing', 'swimming', 'elliptical', 'hiit', 'walking', 'custom']

  // Group by date
  const grouped = useMemo(() => {
    const map: Record<string, typeof filtered> = {}
    filtered.forEach(s => {
      if (!map[s.date]) map[s.date] = []
      map[s.date].push(s)
    })
    return map
  }, [filtered])

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search sessions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-slate-500" />
          {activities.map(a => (
            <button
              key={a}
              onClick={() => setFilter(a)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                filter === a ? 'bg-blue-600 text-white' : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {a === ALL ? 'All' : ACTIVITY_LABELS[a]}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="text-slate-400 text-sm">
        {filtered.length} session{filtered.length !== 1 ? 's' : ''}
        {filter !== ALL && ` · ${ACTIVITY_LABELS[filter as ActivityType]}`}
      </div>

      {/* Sessions grouped by date */}
      {sortedDates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-slate-400 text-lg font-medium">No sessions found</p>
          <p className="text-slate-600 text-sm mt-1">Log a session with the button above</p>
        </div>
      ) : (
        sortedDates.map(date => {
          const d = new Date(date + 'T12:00:00')
          const label = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
          const dayTotal = grouped[date].reduce((sum, s) => sum + s.duration, 0)
          return (
            <div key={date}>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-slate-300 text-sm font-medium">{label}</h3>
                <span className="text-slate-600 text-xs">{dayTotal}m total</span>
                <div className="flex-1 h-px bg-slate-800" />
              </div>
              <div className="space-y-2">
                {grouped[date].map(session => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
