import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string
  subtext?: string
  icon: LucideIcon
  color?: 'blue' | 'green' | 'orange' | 'purple'
  trend?: number // % change
}

const colorMap = {
  blue: 'text-blue-400 bg-blue-500/10',
  green: 'text-emerald-400 bg-emerald-500/10',
  orange: 'text-orange-400 bg-orange-500/10',
  purple: 'text-purple-400 bg-purple-500/10',
}

export default function StatCard({ label, value, subtext, icon: Icon, color = 'blue', trend }: StatCardProps) {
  const colorClass = colorMap[color]
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-start gap-4">
      <div className={`rounded-lg p-2.5 ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
        {subtext && <p className="text-slate-500 text-xs mt-0.5">{subtext}</p>}
      </div>
      {trend !== undefined && (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trend >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          {trend >= 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
  )
}
