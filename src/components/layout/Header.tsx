import { Plus } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
  onLogSession: () => void
}

export default function Header({ title, subtitle, onLogSession }: HeaderProps) {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0">
      <div>
        <h1 className="text-white font-semibold text-lg leading-tight">{title}</h1>
        {subtitle && <p className="text-slate-400 text-xs">{subtitle}</p>}
      </div>
      <button
        onClick={onLogSession}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        Log Session
      </button>
    </header>
  )
}
