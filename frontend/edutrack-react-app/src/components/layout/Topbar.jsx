import { Menu } from 'lucide-react'
import WorkspacePreferences from './WorkspacePreferences'
import ActivityCenter from './ActivityCenter'

export default function Topbar({ title, subtitle, onMenuClick, action }) {
  return (
    <header className="flex items-start justify-between gap-4 mb-[clamp(1.5rem,4vh,3rem)]">
      <div className="flex items-start gap-3 min-w-0">
        <button
          onClick={onMenuClick}
     className="lg:hidden mt-1 text-slate-500 dark:text-slate-400 shrink-0"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-black text-content-dark tracking-tight truncate dark:text-white">{title}</h1>
          {subtitle && <p className="text-sm font-medium text-content-muted mt-1 dark:text-slate-400">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {action}
        <ActivityCenter />
        <WorkspacePreferences />
      </div>
    </header>
  )
}
