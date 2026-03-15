import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, ChevronRight, ChevronLeft, Check, Loader2, Bot } from 'lucide-react'
import { generateTrainingPlan } from '../lib/ai'
import { usePlansStore } from '../store/plansStore'
import { AIPlanParams, ActivityType, FitnessLevel, TrainingPlan, ACTIVITY_LABELS, ACTIVITY_COLORS } from '../types'
import { IntensityBadge } from '../components/ui/Badge'

const GOALS = [
  { id: 'general_fitness', label: 'General Fitness', desc: 'Stay active, build healthy habits', emoji: '🌟' },
  { id: 'weight_loss', label: 'Weight Loss', desc: 'Burn calories, improve body composition', emoji: '🔥' },
  { id: 'endurance', label: 'Endurance', desc: 'Build aerobic base for long events', emoji: '🏃' },
  { id: 'performance', label: 'Performance', desc: 'Peak for a race or event', emoji: '🏆' },
]

const FITNESS_LEVELS: { id: FitnessLevel; label: string; desc: string }[] = [
  { id: 'beginner', label: 'Beginner', desc: 'New to regular cardio' },
  { id: 'intermediate', label: 'Intermediate', desc: '3-5 workouts/week consistently' },
  { id: 'advanced', label: 'Advanced', desc: 'Competitive or high-volume athlete' },
]

const ACTIVITIES: ActivityType[] = ['running', 'cycling', 'rowing', 'swimming', 'elliptical', 'hiit', 'walking']

const ACTIVITY_ICONS: Record<ActivityType, string> = {
  running: '🏃', cycling: '🚴', rowing: '🚣', swimming: '🏊',
  elliptical: '⚡', hiit: '🔥', walking: '🚶', custom: '⭐',
}

function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={`h-1.5 rounded-full transition-all ${i === current ? 'w-6 bg-blue-500' : i < current ? 'w-4 bg-blue-500/40' : 'w-4 bg-slate-700'}`} />
      ))}
    </div>
  )
}

export default function AIPlan() {
  const navigate = useNavigate()
  const addPlan = usePlansStore(s => s.addPlan)

  const [step, setStep] = useState(0)
  const [params, setParams] = useState<AIPlanParams>({
    goal: 'general_fitness',
    fitnessLevel: 'intermediate',
    daysPerWeek: 4,
    preferredActivities: ['running'],
    durationWeeks: 8,
    limitations: '',
  })
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState<TrainingPlan | null>(null)
  const [loadingMsg, setLoadingMsg] = useState(0)

  const loadingMessages = [
    'Analyzing your fitness profile...',
    'Designing progressive overload structure...',
    'Balancing intensity and recovery...',
    'Personalizing session descriptions...',
    'Finalizing your training plan...',
  ]

  async function handleGenerate() {
    setStep(4)
    setLoading(true)
    let msgIdx = 0
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % loadingMessages.length
      setLoadingMsg(msgIdx)
    }, 600)
    try {
      const plan = await generateTrainingPlan(params)
      setGenerated(plan)
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }

  function handleSave() {
    if (generated) {
      addPlan(generated)
      navigate('/plans')
    }
  }

  function toggleActivity(a: ActivityType) {
    setParams(prev => ({
      ...prev,
      preferredActivities: prev.preferredActivities.includes(a)
        ? prev.preferredActivities.filter(x => x !== a)
        : [...prev.preferredActivities, a],
    }))
  }

  // Loading screen
  if (step === 4) {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-20 h-20 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
            <Bot className="w-10 h-10 text-purple-400 animate-pulse-slow" />
          </div>
          <h2 className="text-white font-bold text-2xl mb-2">Building Your Plan</h2>
          <p className="text-slate-400 text-sm mb-8">{loadingMessages[loadingMsg]}</p>
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      )
    }

    // Plan result
    if (generated) {
      const week1 = generated.sessions.filter(s => s.weekNumber === 1)
      return (
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">{generated.name}</h2>
              <p className="text-slate-400 text-sm">{generated.durationWeeks} weeks · {week1.length} sessions/week</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-slate-300 text-sm">{generated.description}</p>
          </div>

          {/* Week 1 preview */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-3">Week 1 Preview</h3>
            <div className="space-y-2">
              {week1.map((s, i) => {
                const color = ACTIVITY_COLORS[s.activity]
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                return (
                  <div key={i} className="flex items-center gap-3 bg-slate-800 rounded-lg p-3">
                    <span className="text-xs font-medium text-slate-500 w-8">{days[s.dayOfWeek]}</span>
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-slate-200 text-sm flex-1 capitalize">{ACTIVITY_LABELS[s.activity]}</span>
                    <span className="text-slate-400 text-xs">{s.targetDuration}m</span>
                    <IntensityBadge intensity={s.intensity} />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Full plan summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-3">Training Overview</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total Weeks', value: generated.durationWeeks.toString() },
                { label: 'Sessions/Week', value: week1.length.toString() },
                { label: 'Total Sessions', value: generated.sessions.length.toString() },
              ].map(stat => (
                <div key={stat.label} className="bg-slate-800 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => { setStep(0); setGenerated(null) }}
              className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition-colors"
            >
              Regenerate
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Save Plan
            </button>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <StepDots total={4} current={step} />

      {/* Step 0: Goal */}
      {step === 0 && (
        <div>
          <h2 className="text-white font-bold text-2xl mb-1">What's your goal?</h2>
          <p className="text-slate-400 text-sm mb-6">Your AI coach will tailor the plan to your objectives</p>
          <div className="grid grid-cols-2 gap-3">
            {GOALS.map(g => (
              <button
                key={g.id}
                onClick={() => setParams(prev => ({ ...prev, goal: g.id }))}
                className={`p-4 rounded-xl border text-left transition-all ${params.goal === g.id ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-900 hover:border-slate-600'}`}
              >
                <span className="text-3xl block mb-2">{g.emoji}</span>
                <p className="text-white font-semibold text-sm">{g.label}</p>
                <p className="text-slate-400 text-xs mt-0.5">{g.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Fitness level + days */}
      {step === 1 && (
        <div>
          <h2 className="text-white font-bold text-2xl mb-1">Your fitness level</h2>
          <p className="text-slate-400 text-sm mb-6">This helps calibrate intensity and volume</p>
          <div className="space-y-2 mb-6">
            {FITNESS_LEVELS.map(fl => (
              <button
                key={fl.id}
                onClick={() => setParams(prev => ({ ...prev, fitnessLevel: fl.id }))}
                className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${params.fitnessLevel === fl.id ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-900 hover:border-slate-600'}`}
              >
                <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${params.fitnessLevel === fl.id ? 'border-blue-500 bg-blue-500' : 'border-slate-600'}`} />
                <div>
                  <p className="text-white font-medium text-sm">{fl.label}</p>
                  <p className="text-slate-400 text-xs">{fl.desc}</p>
                </div>
              </button>
            ))}
          </div>
          <div>
            <label className="block text-white font-medium mb-2">Days per week: <span className="text-blue-400">{params.daysPerWeek}</span></label>
            <input type="range" min={2} max={7} value={params.daysPerWeek} onChange={e => setParams(prev => ({ ...prev, daysPerWeek: parseInt(e.target.value) }))} className="w-full accent-blue-500" />
            <div className="flex justify-between text-xs text-slate-500 mt-1"><span>2 days</span><span>7 days</span></div>
          </div>
        </div>
      )}

      {/* Step 2: Activities + duration */}
      {step === 2 && (
        <div>
          <h2 className="text-white font-bold text-2xl mb-1">Preferred activities</h2>
          <p className="text-slate-400 text-sm mb-6">Select one or more activities to include in your plan</p>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {ACTIVITIES.map(a => {
              const selected = params.preferredActivities.includes(a)
              const color = ACTIVITY_COLORS[a]
              return (
                <button
                  key={a}
                  onClick={() => toggleActivity(a)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-xs font-medium transition-all ${selected ? '' : 'border-slate-700 text-slate-400 hover:border-slate-600'}`}
                  style={selected ? { borderColor: color, backgroundColor: `${color}15`, color } : {}}
                >
                  <span className="text-2xl">{ACTIVITY_ICONS[a]}</span>
                  {ACTIVITY_LABELS[a]}
                </button>
              )
            })}
          </div>
          <div>
            <label className="block text-white font-medium mb-2">Plan duration: <span className="text-blue-400">{params.durationWeeks} weeks</span></label>
            <input type="range" min={4} max={24} step={2} value={params.durationWeeks} onChange={e => setParams(prev => ({ ...prev, durationWeeks: parseInt(e.target.value) }))} className="w-full accent-blue-500" />
            <div className="flex justify-between text-xs text-slate-500 mt-1"><span>4 weeks</span><span>24 weeks</span></div>
          </div>
        </div>
      )}

      {/* Step 3: Limitations + confirm */}
      {step === 3 && (
        <div>
          <h2 className="text-white font-bold text-2xl mb-1">Any limitations?</h2>
          <p className="text-slate-400 text-sm mb-6">Injuries, equipment, or other constraints (optional)</p>
          <textarea
            value={params.limitations}
            onChange={e => setParams(prev => ({ ...prev, limitations: e.target.value }))}
            placeholder="e.g. knee injury, no gym access, prefer mornings..."
            rows={3}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 resize-none mb-6"
          />
          {/* Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 mb-6">
            <h3 className="text-white font-semibold text-sm mb-3">Your Plan Summary</h3>
            {[
              { label: 'Goal', value: GOALS.find(g => g.id === params.goal)?.label || params.goal },
              { label: 'Level', value: params.fitnessLevel },
              { label: 'Days/week', value: params.daysPerWeek.toString() },
              { label: 'Duration', value: `${params.durationWeeks} weeks` },
              { label: 'Activities', value: params.preferredActivities.map(a => ACTIVITY_LABELS[a]).join(', ') },
            ].map(item => (
              <div key={item.label} className="flex justify-between text-xs">
                <span className="text-slate-400">{item.label}</span>
                <span className="text-slate-200 capitalize">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      {step < 4 && (
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={step === 2 && params.preferredActivities.length === 0}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold transition-colors"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Generate My Plan
            </button>
          )}
        </div>
      )}
    </div>
  )
}
