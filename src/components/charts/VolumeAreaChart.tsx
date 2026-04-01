import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { WorkoutSession, ACTIVITY_COLORS, ActivityType } from '../../types'
import { getDailyVolumeData } from '../../lib/metrics'

const ACTIVITIES: ActivityType[] = ['running', 'cycling', 'rowing', 'swimming', 'elliptical', 'hiit', 'walking', 'custom']

interface Props {
  sessions: WorkoutSession[]
  days?: number
}

function formatXAxis(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const total = payload.reduce((sum: number, p: any) => sum + (p.value || 0), 0)
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl text-xs">
      <p className="text-slate-300 font-medium mb-2">{formatXAxis(label)} · {total}m total</p>
      {payload.map((p: any) => p.value > 0 && (
        <div key={p.dataKey} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-slate-400 capitalize">{p.dataKey}:</span>
          <span className="text-white font-medium">{p.value}m</span>
        </div>
      ))}
    </div>
  )
}

export default function VolumeAreaChart({ sessions, days = 30 }: Props) {
  const data = getDailyVolumeData(sessions, days)
  const activeActivities = ACTIVITIES.filter(a => data.some(d => (d as any)[a] > 0))

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-white font-semibold">Daily Volume</h3>
          <p className="text-slate-400 text-xs">Last {days} days</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
          <defs>
            {activeActivities.map(a => (
              <linearGradient key={a} id={`grad-${a}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={ACTIVITY_COLORS[a]} stopOpacity={0.4} />
                <stop offset="95%" stopColor={ACTIVITY_COLORS[a]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval={Math.floor(days / 6)}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            unit="m"
            width={35}
          />
          <Tooltip content={<CustomTooltip />} />
          {activeActivities.map(a => (
            <Area
              key={a}
              type="monotone"
              dataKey={a}
              stackId="1"
              stroke={ACTIVITY_COLORS[a]}
              fill={`url(#grad-${a})`}
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
