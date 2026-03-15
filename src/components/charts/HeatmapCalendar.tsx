import { WorkoutSession } from '../../types'
import { getHeatmapData } from '../../lib/metrics'

interface Props {
  sessions: WorkoutSession[]
}

function getIntensityColor(minutes: number): string {
  if (minutes === 0) return '#1e293b'
  if (minutes < 30) return '#1d4ed8'
  if (minutes < 60) return '#2563eb'
  if (minutes < 90) return '#3b82f6'
  return '#60a5fa'
}

export default function HeatmapCalendar({ sessions }: Props) {
  const heatmap = getHeatmapData(sessions)

  // Build 52 weeks of dates ending today
  const today = new Date()
  const weeks: string[][] = []
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - (52 * 7) + 1)
  // Align to Sunday
  startDate.setDate(startDate.getDate() - startDate.getDay())

  for (let w = 0; w < 53; w++) {
    const week: string[] = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + w * 7 + d)
      if (date <= today) {
        week.push(date.toISOString().split('T')[0])
      } else {
        week.push('')
      }
    }
    weeks.push(week)
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="mb-4">
        <h3 className="text-white font-semibold">Activity Heatmap</h3>
        <p className="text-slate-400 text-xs">Past year</p>
      </div>
      <div className="overflow-x-auto">
        <div className="inline-flex gap-0.5">
          {/* Day labels */}
          <div className="flex flex-col gap-0.5 mr-1 pt-5">
            {days.map((d, i) => (
              <div key={i} className="h-2.5 w-3 text-slate-600 text-[9px] flex items-center">{i % 2 === 1 ? d : ''}</div>
            ))}
          </div>
          {/* Weeks */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {/* Month label for first week of month */}
              <div className="h-4 text-[9px] text-slate-500 leading-4">
                {week[0] && new Date(week[0] + 'T12:00:00').getDate() <= 7
                  ? months[new Date(week[0] + 'T12:00:00').getMonth()]
                  : ''}
              </div>
              {week.map((date, di) => {
                const minutes = date ? (heatmap[date] || 0) : 0
                const color = date ? getIntensityColor(minutes) : 'transparent'
                return (
                  <div
                    key={di}
                    className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-sm transition-colors"
                    style={{ backgroundColor: color }}
                    title={date ? `${date}: ${minutes}m` : ''}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3">
        <span className="text-slate-500 text-xs">Less</span>
        {[0, 20, 45, 70, 100].map(m => (
          <div key={m} className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: getIntensityColor(m) }} />
        ))}
        <span className="text-slate-500 text-xs">More</span>
      </div>
    </div>
  )
}
