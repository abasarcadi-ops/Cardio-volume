import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import BottomNav from './BottomNav'
import LogSessionModal from '../logging/LogSessionModal'

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Your cardio overview' },
  '/log': { title: 'Sessions', subtitle: 'Your workout history' },
  '/progress': { title: 'Progress', subtitle: 'Track your improvements' },
  '/plans': { title: 'Training Plans', subtitle: 'Manage your training' },
  '/ai-plan': { title: 'AI Coach', subtitle: 'Build your perfect plan' },
}

export default function Layout() {
  const [showLog, setShowLog] = useState(false)
  const location = useLocation()
  const page = PAGE_TITLES[location.pathname] ?? { title: 'CardioTrack', subtitle: '' }

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      <div className="hidden md:flex shrink-0">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header title={page.title} subtitle={page.subtitle} onLogSession={() => setShowLog(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
          <Outlet />
        </main>
      </div>
      <BottomNav />
      {showLog && <LogSessionModal onClose={() => setShowLog(false)} />}
    </div>
  )
}
