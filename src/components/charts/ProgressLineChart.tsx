import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { WorkoutSession } from '../../types'
import { getDailyVolumeData } from '../../lib/metrics'
import { useSettingsStore } from '../../store/settingsStore'

const RANGES = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
  { label: '1Y', days: 365 },
]

interface Props {
  sessions: WorkoutSession[]
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-2.5 shadow-xl text-xs">
      <p className="text-slate-300">{new Date(label + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
      <p className="text-blue-400 font-semibold">{payload[0].value}m</p>
    </div>
  )
}

export default function ProgressLineChart({ sessions }: Props) {
  const [range, setRange] = useState(30)
  const goal = useSettingsStore(s => s.settings.weeklyVolumeGoal)
  const data = getDailyVolumeData(sessions, range)
  const dailyGoal = Math.round(goal / 7)

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-white font-semibold">Volume Trend</h3>
          <p className="text-slate-400 text-xs">Daily minutes over time</p>
        </div>
        <div className="flex gap-1">
          {RANGES.map(r => (
            <button
              key={r.days}
              onClick={() => setRange(r.days)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                range === r.days ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={d => new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval={Math.floor(range / 6)}
          />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} unit="m" width={35} />
          <Tooltip content={<CustomTooltip />} />
          {dailyGoal > 0 && (
            <ReferenceLine y={dailyGoal} stroke="#3b82f6" strokeDasharray="4 4" strokeWidth={1} />
          )}
          <Line
            type="monotone"
            dataKey="total"
            stroke="url(#lineGrad)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, fill: '#3b82f6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
