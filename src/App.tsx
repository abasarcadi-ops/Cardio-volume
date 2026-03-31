import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Log from './pages/Log'
import Progress from './pages/Progress'
import Plans from './pages/Plans'
import AIPlan from './pages/AIPlan'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/log" element={<Log />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/ai-plan" element={<AIPlan />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
