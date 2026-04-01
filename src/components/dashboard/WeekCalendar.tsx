import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Check } from 'lucide-react'
import { WorkoutSession, ACTIVITY_COLORS, ACTIVITY_LABELS } from '../../types'

const ACTIVITY_ICONS: Record<string, string> = {
  running: '🏃', cycling: '🚴', rowing: '🚣', swimming: '🏊',
  elliptical: '⚡', hiit: '🔥', walking: '🚶', custom: '⭐',
}
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getWeekDates(offset: number): string[] {
  const today = new Date()
  const dow = today.getDay() // 0=Sun
  const monday = new Date(today)
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1) + offset * 7)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d.toISOString().split('T')[0]
  })
}

function formatWeekLabel(dates: string[]): string {
  const start = new Date(dates[0] + 'T12:00:00')
  const end = new Date(dates[6] + 'T12:00:00')
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  if (start.getMonth() === end.getMonth()) {
    return `${start.toLocaleDateString('en', { month: 'short' })} ${start.getDate()}–${end.getDate()}`
  }
  return `${start.toLocaleDateString('en', opts)} – ${end.toLocaleDateString('en', opts)}`
}

interface Props {
  sessions: WorkoutSession[]
  onPlanDay: (date: string) => void
  onCompleteSession: (session: WorkoutSession) => void
  onViewSession: (session: WorkoutSession) => void
}

export default function WeekCalendar({ sessions, onPlanDay, onCompleteSession, onViewSession }: Props) {
  const [weekOffset, setWeekOffset] = useState(0)
  const today = new Date().toISOString().split('T')[0]
  const weekDates = getWeekDates(weekOffset)

  const sessionsByDate = weekDates.reduce<Record<string, WorkoutSession[]>>((acc, date) => {
    acc[date] = sessions.filter(s => s.date === date)
    return acc
  }, {})

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Week navigation header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <button
          onClick={() => setWeekOffset(o => o - 1)}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="text-center">
          <p className="text-white text-sm font-semibold">{formatWeekLabel(weekDates)}</p>
          {weekOffset === 0 && <p className="text-blue-400 text-xs">This week</p>}
          {weekOffset === -1 && <p className="text-slate-500 text-xs">Last week</p>}
          {weekOffset === 1 && <p className="text-slate-500 text-xs">Next week</p>}
          {Math.abs(weekOffset) > 1 && (
            <button onClick={() => setWeekOffset(0)} className="text-xs text-slate-500 hover:text-blue-400 underline">
              Back to today
            </button>
          )}
        </div>
        <button
          onClick={() => setWeekOffset(o => o + 1)}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* 7-day grid — horizontally scrollable on mobile */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 min-w-[560px]">
          {weekDates.map((date, idx) => {
            const daySessions = sessionsByDate[date] ?? []
            const isToday = date === today
            const isPast = date < today
            const isFuture = date > today
            const dayNum = parseInt(date.split('-')[2])

            return (
              <div
                key={date}
                className={`min-h-[140px] p-2 flex flex-col gap-1.5 border-r border-slate-800 last:border-r-0 ${
                  isToday ? 'bg-blue-950/30' : ''
                }`}
              >
                {/* Day header */}
                <div className="text-center pb-1 border-b border-slate-800/60">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">{DAY_NAMES[idx]}</p>
                  <p className={`text-sm font-bold mt-0.5 ${isToday ? 'text-blue-400' : 'text-slate-300'}`}>
                    {dayNum}
                  </p>
                  {isToday && (
                    <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">Today</span>
                  )}
                </div>

                {/* Sessions */}
                <div className="flex flex-col gap-1 flex-1">
                  {daySessions.map(session => {
                    const color = ACTIVITY_COLORS[session.activity]
                    const isPlanned = session.status === 'planned'
                    const canComplete = isPlanned && date <= today

                    return (
                      <button
                        key={session.id}
                        onClick={() => canComplete ? onCompleteSession(session) : onViewSession(session)}
                        className={`w-full text-left rounded-lg px-2 py-1.5 transition-all ${
                          isPlanned
                            ? 'border border-dashed bg-transparent hover:opacity-80'
                            : 'hover:opacity-80'
                        }`}
                        style={
                          isPlanned
                            ? { borderColor: `${color}60`, color }
                            : { backgroundColor: `${color}20`, color }
                        }
                        title={
                          canComplete
                            ? `Tap to log: ${ACTIVITY_LABELS[session.activity]}`
                            : ACTIVITY_LABELS[session.activity]
                        }
                      >
                        <div className="flex items-center gap-1">
                          <span className="text-xs">{ACTIVITY_ICONS[session.activity]}</span>
                          {session.status === 'completed' && (
                            <Check size={10} className="shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] font-medium leading-tight mt-0.5 truncate">
                          {session.duration}m
                        </p>
                        {isPlanned && (
                          <p className="text-[10px] opacity-70 leading-tight">planned</p>
                        )}
                      </button>
                    )
                  })}

                  {/* Add button for today and future */}
                  {(isToday || isFuture) && (
                    <button
                      onClick={() => onPlanDay(date)}
                      className="w-full flex items-center justify-center py-1.5 rounded-lg border border-dashed border-slate-700 text-slate-600 hover:border-slate-500 hover:text-slate-400 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  )}

                  {/* Past rest day indicator */}
                  {isPast && daySessions.length === 0 && (
                    <p className="text-[10px] text-center text-slate-700 mt-auto">rest</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
