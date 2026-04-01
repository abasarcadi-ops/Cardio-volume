import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, TrendingUp, Calendar, Sparkles } from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/log', icon: ClipboardList, label: 'Sessions' },
  { to: '/progress', icon: TrendingUp, label: 'Progress' },
  { to: '/plans', icon: Calendar, label: 'Plans' },
  { to: '/ai-plan', icon: Sparkles, label: 'AI Coach' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-slate-900 border-t border-slate-800 flex md:hidden z-40 safe-area-bottom">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium transition-colors ${
              isActive ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
            }`
          }
        >
          <Icon className="w-5 h-5" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
