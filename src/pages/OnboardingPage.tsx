import { useState } from 'react'
import { ChevronRight, ChevronLeft, Activity, Check } from 'lucide-react'
import { useSettingsStore } from '../store/settingsStore'
import { ActivityType, FitnessLevel, ACTIVITY_LABELS } from '../types'

const ACTIVITIES: ActivityType[] = ['running', 'cycling', 'rowing', 'swimming', 'elliptical', 'hiit', 'walking', 'custom']
const ACTIVITY_ICONS: Record<ActivityType, string> = {
  running: '🏃', cycling: '🚴', rowing: '🚣', swimming: '🏊',
  elliptical: '⚡', hiit: '🔥', walking: '🚶', custom: '⭐',
}
const RACE_TYPES = ['5K', '10K', 'Half Marathon', 'Marathon', 'Triathlon', 'Duathlon', 'Other']
const GOALS = [
  { value: 'general_fitness', label: 'General Fitness', description: 'Stay active and healthy' },
  { value: 'weight_loss', label: 'Weight Loss', description: 'Burn calories and slim down' },
  { value: 'endurance', label: 'Build Endurance', description: 'Go longer, stronger' },
  { value: 'race', label: 'Race / Event', description: 'Train for a specific event' },
]

export default function OnboardingPage() {
  const updateSettings = useSettingsStore(s => s.updateSettings)
  const existingSettings = useSettingsStore(s => s.settings)

  const [step, setStep] = useState(1)
  const TOTAL_STEPS = 5

  // Step 1: Name + Age
  const [name, setName] = useState(existingSettings.name !== 'Athlete' ? existingSettings.name : '')
  const [age, setAge] = useState(existingSettings.age?.toString() ?? '')

  // Step 2: Body stats
  const [weightKg, setWeightKg] = useState(existingSettings.weightKg?.toString() ?? '')
  const [heightCm, setHeightCm] = useState(existingSettings.heightCm?.toString() ?? '')

  // Step 3: Fitness + activities
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>(existingSettings.fitnessLevel)
  const [activities, setActivities] = useState<ActivityType[]>(existingSettings.preferredActivities)

  // Step 4: Goal + race
  const [goal, setGoal] = useState(existingSettings.goal === 'General fitness and endurance' ? 'general_fitness' : existingSettings.goal)
  const [raceType, setRaceType] = useState(existingSettings.raceType ?? '')
  const [raceDate, setRaceDate] = useState(existingSettings.raceDate ?? '')

  // Step 5: Injuries + weekly goal
  const [injuries, setInjuries] = useState(existingSettings.injuries ?? '')
  const [weeklyGoal, setWeeklyGoal] = useState(existingSettings.weeklyVolumeGoal)

  function toggleActivity(a: ActivityType) {
    setActivities(prev =>
      prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
    )
  }

  async function handleFinish() {
    const goalLabel = GOALS.find(g => g.value === goal)?.label ?? goal
    await updateSettings({
      name: name.trim() || 'Athlete',
      age: age ? parseInt(age) : undefined,
      weightKg: weightKg ? parseFloat(weightKg) : undefined,
      heightCm: heightCm ? parseFloat(heightCm) : undefined,
      fitnessLevel,
      preferredActivities: activities.length > 0 ? activities : ['running'],
      goal: goal === 'race' ? `Race: ${raceType || 'Event'}` : goalLabel,
      raceType: goal === 'race' ? (raceType || undefined) : undefined,
      raceDate: goal === 'race' ? (raceDate || undefined) : undefined,
      injuries: injuries.trim() || undefined,
      weeklyVolumeGoal: weeklyGoal,
      onboardingComplete: true,
    })
  }

  const canNext = () => {
    if (step === 1) return name.trim().length > 0
    if (step === 3) return activities.length > 0
    if (step === 4 && goal === 'race') return raceType.length > 0
    return true
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 mb-3">
            <Activity size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Set Up Your Profile</h1>
          <p className="text-slate-400 text-sm mt-1">Step {step} of {TOTAL_STEPS}</p>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-slate-800 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>

        <div className="bg-slate-800 rounded-2xl p-6">

          {/* Step 1: Name + Age */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white">Welcome! What should we call you?</h2>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Your name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Alex"
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  placeholder="e.g. 28"
                  min={10}
                  max={100}
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500"
                />
                <p className="text-slate-500 text-xs mt-1">Used for heart rate zone calculations</p>
              </div>
            </div>
          )}

          {/* Step 2: Body stats */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white">Body Stats</h2>
              <p className="text-slate-400 text-sm -mt-2">Used for calorie estimates. Both optional.</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={e => setWeightKg(e.target.value)}
                    placeholder="e.g. 70"
                    min={30}
                    max={300}
                    className="w-full bg-slate-700 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={e => setHeightCm(e.target.value)}
                    placeholder="e.g. 175"
                    min={100}
                    max={250}
                    className="w-full bg-slate-700 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Fitness level + activities */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white">Your Fitness Background</h2>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Current fitness level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['beginner', 'intermediate', 'advanced'] as FitnessLevel[]).map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFitnessLevel(level)}
                      className={`py-2.5 rounded-xl text-sm font-medium capitalize transition-colors ${
                        fitnessLevel === level
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Preferred activities <span className="text-slate-500">(select all that apply)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ACTIVITIES.map(a => {
                    const selected = activities.includes(a)
                    return (
                      <button
                        key={a}
                        type="button"
                        onClick={() => toggleActivity(a)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                          selected
                            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/50'
                            : 'bg-slate-700 text-slate-400 hover:text-white border border-transparent'
                        }`}
                      >
                        <span>{ACTIVITY_ICONS[a]}</span>
                        {ACTIVITY_LABELS[a]}
                        {selected && <Check size={14} className="ml-auto" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Goal */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white">What's your primary goal?</h2>
              <div className="space-y-2">
                {GOALS.map(g => (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => setGoal(g.value)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                      goal === g.value
                        ? 'bg-blue-600/20 border border-blue-500/50'
                        : 'bg-slate-700 border border-transparent hover:border-slate-600'
                    }`}
                  >
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${goal === g.value ? 'text-blue-400' : 'text-white'}`}>
                        {g.label}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{g.description}</p>
                    </div>
                    {goal === g.value && <Check size={16} className="text-blue-400 shrink-0" />}
                  </button>
                ))}
              </div>
              {goal === 'race' && (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Race type *</label>
                    <div className="flex flex-wrap gap-2">
                      {RACE_TYPES.map(r => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRaceType(r)}
                          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                            raceType === r
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-700 text-slate-400 hover:text-white'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Target race date</label>
                    <input
                      type="date"
                      value={raceDate}
                      onChange={e => setRaceDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-slate-700 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Injuries + weekly goal */}
          {step === 5 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white">Almost there!</h2>
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Any injuries or limitations?
                  <span className="text-slate-500 ml-1">(optional)</span>
                </label>
                <textarea
                  value={injuries}
                  onChange={e => setInjuries(e.target.value)}
                  placeholder="e.g. Bad left knee — avoid high-impact running. Lower back issues."
                  rows={3}
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Weekly training goal —{' '}
                  <span className="text-blue-400 font-medium">
                    {weeklyGoal < 60 ? `${weeklyGoal}m` : `${Math.floor(weeklyGoal / 60)}h${weeklyGoal % 60 > 0 ? ` ${weeklyGoal % 60}m` : ''}`}
                  </span>
                </label>
                <input
                  type="range"
                  min={30}
                  max={600}
                  step={15}
                  value={weeklyGoal}
                  onChange={e => setWeeklyGoal(parseInt(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>30m</span><span>10h</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-slate-600 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                <ChevronLeft size={16} /> Back
              </button>
            )}
            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext()}
                className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
              >
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm font-semibold transition-colors"
              >
                Let's go!
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
