import { useState } from 'react'
import { Plus, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { usePlansStore } from '../store/plansStore'
import TrainingPlanCard from '../components/plans/TrainingPlanCard'
import Modal from '../components/ui/Modal'
import { ActivityType, IntensityLevel, TrainingPlan, PlannedSession } from '../types'
import { ACTIVITY_LABELS } from '../types'

function generateId() { return Math.random().toString(36).substr(2, 9) }

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const ACTIVITIES: ActivityType[] = ['running', 'cycling', 'rowing', 'swimming', 'elliptical', 'hiit', 'walking', 'custom']
const INTENSITIES: IntensityLevel[] = ['easy', 'moderate', 'hard', 'race']

function PlanBuilderModal({ onClose }: { onClose: () => void }) {
  const addPlan = usePlansStore(s => s.addPlan)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [weeks, setWeeks] = useState(8)
  const [goal, setGoal] = useState('general_fitness')
  const [sessions, setSessions] = useState<PlannedSession[]>([])

  function addSession() {
    setSessions(prev => [...prev, {
      weekNumber: 1,
      dayOfWeek: 1,
      activity: 'running',
      targetDuration: 30,
      intensity: 'easy',
      description: '',
    }])
  }

  function updateSession(idx: number, updates: Partial<PlannedSession>) {
    setSessions(prev => prev.map((s, i) => i === idx ? { ...s, ...updates } : s))
  }

  function removeSession(idx: number) {
    setSessions(prev => prev.filter((_, i) => i !== idx))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const plan: TrainingPlan = {
      id: generateId(),
      name,
      description,
      durationWeeks: weeks,
      goal,
      sessions,
      isAIGenerated: false,
      createdAt: new Date().toISOString(),
      isActive: false,
    }
    addPlan(plan)
    onClose()
  }

  return (
    <Modal title="Create Training Plan" onClose={onClose} size="xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-1">Plan Name</label>
            <input
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. 10K Training Plan"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Goal</label>
            <select
              value={goal}
              onChange={e => setGoal(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="general_fitness">General Fitness</option>
              <option value="weight_loss">Weight Loss</option>
              <option value="endurance">Endurance</option>
              <option value="performance">Performance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Duration (weeks)</label>
            <input
              type="number"
              min={1}
              max={52}
              value={weeks}
              onChange={e => setWeeks(parseInt(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the plan..."
              rows={2}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Sessions */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-300">Sessions</label>
            <button type="button" onClick={addSession} className="flex items-center gap-1 text-blue-400 text-xs hover:text-blue-300">
              <Plus className="w-3.5 h-3.5" /> Add Session
            </button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {sessions.map((s, i) => (
              <div key={i} className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-800 rounded-lg p-2.5 items-center">
                <select
                  value={s.weekNumber}
                  onChange={e => updateSession(i, { weekNumber: parseInt(e.target.value) })}
                  className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-xs"
                >
                  {Array.from({ length: weeks }, (_, k) => (
                    <option key={k + 1} value={k + 1}>Week {k + 1}</option>
                  ))}
                </select>
                <select
                  value={s.dayOfWeek}
                  onChange={e => updateSession(i, { dayOfWeek: parseInt(e.target.value) })}
                  className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-xs"
                >
                  {DAYS.map((d, di) => <option key={di} value={di}>{d}</option>)}
                </select>
                <select
                  value={s.activity}
                  onChange={e => updateSession(i, { activity: e.target.value as ActivityType })}
                  className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-xs"
                >
                  {ACTIVITIES.map(a => <option key={a} value={a}>{ACTIVITY_LABELS[a]}</option>)}
                </select>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={5}
                    max={240}
                    value={s.targetDuration}
                    onChange={e => updateSession(i, { targetDuration: parseInt(e.target.value) })}
                    className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-xs w-14"
                  />
                  <span className="text-slate-500 text-xs">m</span>
                </div>
                <div className="flex items-center gap-1">
                  <select
                    value={s.intensity}
                    onChange={e => updateSession(i, { intensity: e.target.value as IntensityLevel })}
                    className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-xs flex-1"
                  >
                    {INTENSITIES.map(int => <option key={int} value={int}>{int}</option>)}
                  </select>
                  <button type="button" onClick={() => removeSession(i)} className="text-slate-600 hover:text-red-400 text-xs ml-1">✕</button>
                </div>
              </div>
            ))}
            {sessions.length === 0 && (
              <p className="text-slate-600 text-xs text-center py-3">No sessions yet. Click "Add Session" above.</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 transition-colors">
            Cancel
          </button>
          <button type="submit" className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors">
            Create Plan
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default function Plans() {
  const plans = usePlansStore(s => s.plans)
  const [showBuilder, setShowBuilder] = useState(false)
  const activePlans = plans.filter(p => p.isActive)
  const inactivePlans = plans.filter(p => !p.isActive)

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowBuilder(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Plan
        </button>
        <Link
          to="/ai-plan"
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          AI Coach
        </Link>
      </div>

      {/* Active plans */}
      {activePlans.length > 0 && (
        <div>
          <h2 className="text-white font-semibold mb-3">Active</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activePlans.map(p => <TrainingPlanCard key={p.id} plan={p} />)}
          </div>
        </div>
      )}

      {/* All plans */}
      {inactivePlans.length > 0 && (
        <div>
          <h2 className="text-white font-semibold mb-3">{activePlans.length > 0 ? 'Other Plans' : 'Your Plans'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {inactivePlans.map(p => <TrainingPlanCard key={p.id} plan={p} />)}
          </div>
        </div>
      )}

      {plans.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-white font-semibold text-lg">No training plans yet</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-xs">Create a plan manually or let our AI Coach build a personalized plan for you</p>
          <Link
            to="/ai-plan"
            className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Try AI Coach
          </Link>
        </div>
      )}

      {showBuilder && <PlanBuilderModal onClose={() => setShowBuilder(false)} />}
    </div>
  )
}
