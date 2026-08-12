import { Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ROLE_DASHBOARD_PATH } from '../../utils/nav'

export default function Topbar({ title, subtitle, onMenuClick, action }) {
  const { user, role } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="flex items-start justify-between gap-4 mb-8">
      <div className="flex items-start gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden mt-1 text-slate-500 shrink-0"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 truncate">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {action}
        <button
          onClick={() => navigate(ROLE_DASHBOARD_PATH[role] ?? '/login')}
          className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-900 hover:bg-slate-50 whitespace-nowrap"
        >
          {user?.name}
        </button>
      </div>
    </header>
  )
}
