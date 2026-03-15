import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ClipboardList,
  TrendingUp,
  Calendar,
  Sparkles,
  Zap,
} from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/log', icon: ClipboardList, label: 'Sessions' },
  { to: '/progress', icon: TrendingUp, label: 'Progress' },
  { to: '/plans', icon: Calendar, label: 'Plans' },
  { to: '/ai-plan', icon: Sparkles, label: 'AI Coach' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-white text-lg tracking-tight">CardioTrack</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom hint */}
      <div className="p-4 mx-3 mb-4 rounded-lg bg-slate-800 border border-slate-700">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold text-blue-400">AI Coach</span>
        </div>
        <p className="text-xs text-slate-400">Get a personalized training plan built by AI</p>
      </div>
    </aside>
  )
}
