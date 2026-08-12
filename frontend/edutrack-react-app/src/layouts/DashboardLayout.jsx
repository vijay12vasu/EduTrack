import { useState } from 'react'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'

export default function DashboardLayout({ title, subtitle, action, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-appbg">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 px-5 md:px-10 py-8">
        <Topbar
          title={title}
          subtitle={subtitle}
          action={action}
          onMenuClick={() => setSidebarOpen(true)}
        />
        {children}
      </div>
    </div>
  )
}
