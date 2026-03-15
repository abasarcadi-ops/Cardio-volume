import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'
import { WorkoutSession } from '../../types'
import { getWeeklyConsistency } from '../../lib/metrics'
import { useSettingsStore } from '../../store/settingsStore'

interface Props {
  sessions: WorkoutSession[]
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-2.5 shadow-xl text-xs">
      <p className="text-slate-300 font-medium">{label}</p>
      <p style={{ color: payload[0].value >= 100 ? '#10b981' : payload[0].value >= 70 ? '#f59e0b' : '#ef4444' }}>
        {payload[0].value}% of goal
      </p>
      <p className="text-slate-400">{payload[0].payload.volume}m</p>
    </div>
  )
}

export default function ConsistencyChart({ sessions }: Props) {
  const goal = useSettingsStore(s => s.settings.weeklyVolumeGoal)
  const data = getWeeklyConsistency(sessions, goal, 12)

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="mb-5">
        <h3 className="text-white font-semibold">Weekly Consistency</h3>
        <p className="text-slate-400 text-xs">% of weekly goal achieved</p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" width={35} domain={[0, 120]} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff06' }} />
          <ReferenceLine y={100} stroke="#10b981" strokeDasharray="4 4" strokeWidth={1.5} />
          <Bar dataKey="percentage" radius={[3, 3, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.percentage >= 100 ? '#10b981' : entry.percentage >= 70 ? '#f59e0b' : '#ef4444'}
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
