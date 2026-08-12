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

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 flex flex-col shrink-0 transform transition-transform duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between lg:block">
          <Logo />
          <button className="lg:hidden mr-4 text-slate-400" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-1">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-50'
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              {label}
            </NavLink>
          ))}

          <button
            onClick={() => setConfirmOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <LogOut size={18} className="shrink-0" />
            Logout
          </button>
        </nav>

        <UserCard user={user} />
      </aside>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Confirm Logout</h3>
        <p className="text-sm text-slate-500 mb-6">
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
