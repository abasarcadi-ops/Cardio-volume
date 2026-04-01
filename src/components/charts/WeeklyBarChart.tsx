import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { WorkoutSession, ACTIVITY_COLORS, ActivityType } from '../../types'
import { getWeeklyVolumeData } from '../../lib/metrics'
import { useSettingsStore } from '../../store/settingsStore'

const ACTIVITIES: ActivityType[] = ['running', 'cycling', 'rowing', 'swimming', 'elliptical', 'hiit', 'walking', 'custom']

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const total = payload.reduce((sum: number, p: any) => sum + (p.value || 0), 0)
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl text-xs">
      <p className="text-slate-300 font-medium mb-2">{label} · {total}m total</p>
      {payload.map((p: any) => p.value > 0 && (
        <div key={p.dataKey} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.fill }} />
          <span className="text-slate-400 capitalize">{p.dataKey}:</span>
          <span className="text-white font-medium">{p.value}m</span>
        </div>
      ))}
    </div>
  )
}

interface Props {
  sessions: WorkoutSession[]
  weeks?: number
}

export default function WeeklyBarChart({ sessions, weeks = 12 }: Props) {
  const goal = useSettingsStore(s => s.settings.weeklyVolumeGoal)
  const data = getWeeklyVolumeData(sessions, weeks)
  const activeActivities = ACTIVITIES.filter(a => data.some(d => (d as any)[a] > 0))

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="mb-5">
        <h3 className="text-white font-semibold">Weekly Volume</h3>
        <p className="text-slate-400 text-xs">Last {weeks} weeks by activity</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }} barSize={14}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} unit="m" width={35} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff08' }} />
          {goal > 0 && (
            <ReferenceLine y={goal} stroke="#3b82f6" strokeDasharray="4 4" strokeWidth={1.5} />
          )}
          {activeActivities.map(a => (
            <Bar key={a} dataKey={a} stackId="week" fill={ACTIVITY_COLORS[a]} radius={a === activeActivities[activeActivities.length - 1] ? [3, 3, 0, 0] : [0, 0, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
