import { Play, Pause, Trash2, Sparkles, Calendar } from 'lucide-react'
import { TrainingPlan, ACTIVITY_COLORS, ACTIVITY_LABELS, TRAINING_ZONE_COLORS, TRAINING_ZONE_SHORT } from '../../types'
import { usePlansStore } from '../../store/plansStore'
import ActivityIcon from '../ui/ActivityIcon'

interface Props {
  plan: TrainingPlan
}

export default function TrainingPlanCard({ plan }: Props) {
  const { activatePlan, deactivatePlan, deletePlan } = usePlansStore()
  const sessionsPerWeek = plan.sessions.filter(s => s.weekNumber === 1).length

  const goalColors: Record<string, string> = {
    weight_loss: '#ef4444',
    endurance: '#3b82f6',
    performance: '#f59e0b',
    general_fitness: '#10b981',
    general: '#10b981',
  }
  const goalColor = goalColors[plan.goal] || '#6b7280'

  return (
    <div className={`bg-slate-900 border rounded-xl p-5 transition-colors ${plan.isActive ? 'border-blue-500/50' : 'border-slate-800 hover:border-slate-700'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-white font-semibold truncate">{plan.name}</h3>
            {plan.isAIGenerated && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full text-xs font-medium">
                <Sparkles className="w-3 h-3" />
                AI
              </span>
            )}
            {plan.isActive && (
              <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium">Active</span>
            )}
          </div>
          <p className="text-slate-400 text-sm mt-1 line-clamp-2">{plan.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {plan.durationWeeks} weeks
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: goalColor }} />
          <span className="capitalize">{plan.goal.replace(/_/g, ' ')}</span>
        </div>
        <span>{sessionsPerWeek} sessions/wk</span>
        <span>{plan.sessions.length} total sessions</span>
      </div>

      {/* Week 1 preview */}
      {sessionsPerWeek > 0 && (
        <div className="mt-4 space-y-1">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1.5">Week 1</p>
          {plan.sessions.filter(s => s.weekNumber === 1).map((s, i) => {
            const color = ACTIVITY_COLORS[s.activity]
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            return (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="text-slate-600 w-7 shrink-0">{days[s.dayOfWeek]}</span>
                <span style={{ color }}><ActivityIcon activity={s.activity} size={12} /></span>
                <span className="text-slate-400 flex-1 truncate">{ACTIVITY_LABELS[s.activity]} · {s.targetDuration}m</span>
                {s.trainingZone && (
                  <span className="font-semibold shrink-0" style={{ color: TRAINING_ZONE_COLORS[s.trainingZone] }}>
                    {TRAINING_ZONE_SHORT[s.trainingZone]}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="flex items-center gap-2 mt-4">
        {plan.isActive ? (
          <button
            onClick={() => deactivatePlan(plan.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 text-xs font-medium hover:border-slate-600 transition-colors"
          >
            <Pause className="w-3.5 h-3.5" />
            Deactivate
          </button>
        ) : (
          <button
            onClick={() => activatePlan(plan.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-xs font-medium transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            Activate
          </button>
        )}
        <button
          onClick={() => deletePlan(plan.id)}
          className="ml-auto text-slate-600 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
