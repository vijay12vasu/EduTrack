import { useState } from 'react'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'

export default function DashboardLayout({ title, subtitle, action, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 min-w-0 h-screen overflow-y-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(1.5rem,4vh,3rem)] relative z-0">
        {/* Ambient Page Background Glows */}
        <div className="fixed top-[-20%] left-[10%] w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] bg-indigo-100/30 dark:bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-violet-100/20 dark:bg-violet-900/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
        
        <div className="max-w-7xl mx-auto w-full pb-[clamp(1.5rem,4vh,3rem)] relative z-10">
          <Topbar
            title={title}
            subtitle={subtitle}
            action={action}
            onMenuClick={() => setSidebarOpen(true)}
          />
          {children}
        </div>
      </main>
    </div>
  )
}
