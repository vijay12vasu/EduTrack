import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut, X } from 'lucide-react'
import Logo from './Logo'
import UserCard from './UserCard'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { NAV_BY_ROLE } from '../../utils/nav'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'

export default function Sidebar({ open, onClose }) {
  const { role, user, logout } = useAuth()
  const navigate = useNavigate()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const items = NAV_BY_ROLE[role] ?? []

  const handleLogout = () => {
    setConfirmOpen(false)
    logout()
    navigate('/login')
  }

  // Visual grouping function based on labels
  const getNavGroup = (label) => {
    const workspaceLabels = ['Dashboard', 'Add Achievement', 'My Activities', 'Pending Verification', 'Verified Records', 'Users', 'Activities', 'Verifications', 'Verify Student', 'Verified Profiles']
    const insightLabels = ['AI Score', 'Reports', 'About EduTrack']
    const settingsLabels = ['Profile', 'Settings']
    
    if (workspaceLabels.includes(label)) return 'Workspace'
    if (insightLabels.includes(label)) return 'Insights'
    if (settingsLabels.includes(label)) return 'Settings'
    return 'Other'
  }

  const groupedItems = items.reduce((acc, item) => {
    const group = getNavGroup(item.label)
    if (!acc[group]) acc[group] = []
    acc[group].push(item)
    return acc
  }, {})

  // Order of groups
  const groupOrder = ['Workspace', 'Insights', 'Settings', 'Other']

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[280px] bg-gradient-to-b from-white via-slate-50 to-indigo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20 border-r border-slate-200/70 dark:border-slate-800 flex flex-col shrink-0 transform transition-transform duration-300 lg:translate-x-0 shadow-2xl lg:shadow-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between lg:block">
          <Logo />
     <button className="lg:hidden mr-4 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300 transition-colors" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-6 pb-6">
          {groupOrder.map(group => {
            if (!groupedItems[group]) return null
            return (
              <div key={group} className="space-y-1">
                {group !== 'Other' && (
                  <h4 className="px-4 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                    {group}
                  </h4>
                )}
                {groupedItems[group].map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 px-4 py-3 mx-2 mb-1.5 rounded-xl text-sm font-semibold transition-all duration-300 border-l-[3px] ${
                        isActive
                          ? 'border-indigo-500 bg-gradient-to-r from-indigo-50/80 via-indigo-50/50 to-violet-50/50 dark:from-indigo-500/20 dark:via-indigo-500/10 dark:to-violet-500/10 text-indigo-700 dark:text-indigo-300 shadow-sm'
    : 'border-transparent text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon size={18} className={`shrink-0 transition-colors duration-300 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                        {label}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            )
          })}
        </nav>

        {/* Decorative Growth Accent */}
        <div className="px-6 py-2 mt-auto">
          <div className="w-full h-10 relative flex items-center justify-center opacity-70">
            {/* Abstract connected nodes representing growth */}
            <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-200 dark:via-indigo-500/30 to-transparent"></div>
            <div className="flex justify-between w-3/4 relative z-10">
               <div className="w-2 h-2 rounded-full bg-indigo-200 dark:bg-indigo-400 ring-4 ring-slate-50 dark:ring-slate-900"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-violet-300 dark:bg-violet-400 ring-4 ring-slate-50 dark:ring-slate-900 -translate-y-1"></div>
               <div className="w-3 h-3 rounded-full bg-teal-400 ring-4 ring-slate-50 dark:ring-slate-900 -translate-y-2 shadow-[0_0_8px_rgba(45,212,191,0.5)]"></div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200/70 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <UserCard user={user} />
      <button
            onClick={() => setConfirmOpen(true)}
      className="group w-full flex items-center justify-center gap-2 px-4 py-2.5 mt-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-all duration-300 border border-transparent hover:border-rose-100 dark:hover:border-rose-500/20"
          >
            <LogOut size={14} className="shrink-0 group-hover:text-rose-500 transition-colors" />
            Sign Out
          </button>
        </div>
      </aside>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Confirm Logout</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Are you sure you want to logout from EduTrack?
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" className="flex-1" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Modal>
    </>
  )
}
