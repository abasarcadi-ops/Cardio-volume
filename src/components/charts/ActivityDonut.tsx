import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { WorkoutSession, ACTIVITY_COLORS, ACTIVITY_LABELS } from '../../types'
import { getActivityDistribution } from '../../lib/metrics'

interface Props {
  sessions: WorkoutSession[]
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-2.5 shadow-xl text-xs">
      <p className="text-white font-medium">{ACTIVITY_LABELS[d.name as keyof typeof ACTIVITY_LABELS] || d.name}</p>
      <p className="text-slate-400">{d.value}m</p>
    </div>
  )
}

export default function ActivityDonut({ sessions }: Props) {
  const data = getActivityDistribution(sessions)
  const total = data.reduce((sum, d) => sum + d.value, 0)

  if (data.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-center h-48">
        <p className="text-slate-500 text-sm">No activity data</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="mb-4">
        <h3 className="text-white font-semibold">Activity Split</h3>
        <p className="text-slate-400 text-xs">This month</p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-36 h-36 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="activity"
              innerRadius={42}
              outerRadius={65}
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell key={entry.activity} fill={ACTIVITY_COLORS[entry.activity as keyof typeof ACTIVITY_COLORS] || '#6b7280'} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-1.5 w-full">
          {data.map(d => {
            const color = ACTIVITY_COLORS[d.activity as keyof typeof ACTIVITY_COLORS] || '#6b7280'
            const label = ACTIVITY_LABELS[d.activity as keyof typeof ACTIVITY_LABELS] || d.activity
            const pct = total > 0 ? Math.round((d.value / total) * 100) : 0
            return (
              <div key={d.activity} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="text-slate-300 text-xs flex-1">{label}</span>
                <span className="text-slate-400 text-xs">{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
