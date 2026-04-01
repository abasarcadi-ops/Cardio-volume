import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { WorkoutSession } from '../../types'
import { getMonthlyComparison } from '../../lib/metrics'

interface Props {
  sessions: WorkoutSession[]
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-2.5 shadow-xl text-xs">
      <p className="text-slate-300 font-medium">{label}</p>
      <p className="text-blue-400">{payload[0].value}m volume</p>
      {payload[1] && <p className="text-emerald-400">{payload[1].value} sessions</p>}
    </div>
  )
}

export default function MonthlyComparisonChart({ sessions }: Props) {
  const data = getMonthlyComparison(sessions)

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="mb-5">
        <h3 className="text-white font-semibold">Monthly Comparison</h3>
        <p className="text-slate-400 text-xs">Volume over last 6 months</p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} unit="m" width={35} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff06' }} />
          <Bar dataKey="volume" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
