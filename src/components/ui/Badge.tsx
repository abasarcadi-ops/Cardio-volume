import { ACTIVITY_COLORS, ACTIVITY_LABELS, ActivityType, EFFORT_COLORS, EFFORT_LABELS } from '../../types'

export function ActivityBadge({ activity }: { activity: ActivityType }) {
  const color = ACTIVITY_COLORS[activity]
  const label = ACTIVITY_LABELS[activity]
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${color}20`, color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}

export function EffortBadge({ effort }: { effort: number }) {
  const color = EFFORT_COLORS[effort]
  const label = EFFORT_LABELS[effort]
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {label}
    </span>
  )
}

export function IntensityBadge({ intensity }: { intensity: string }) {
  const colors: Record<string, string> = {
    easy: '#10b981',
    moderate: '#f59e0b',
    hard: '#f97316',
    race: '#ef4444',
  }
  const color = colors[intensity] || '#6b7280'
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {intensity}
    </span>
  )
}
