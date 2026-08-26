import { useState, useRef, useEffect, useMemo } from 'react'
import { Bell, CheckCircle2, Clock, XCircle, ArrowRight, Activity as ActivityIcon } from 'lucide-react'
import { useAchievements } from '../../context/AchievementContext'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import EmptyState from '../ui/EmptyState'

export default function ActivityCenter() {
  const { achievements } = useAchievements()
  const { role } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const { items, unreadCount, viewAllRoute } = useMemo(() => {
    let activityItems = []
    let count = 0
    let route = '/'

    if (!achievements || achievements.length === 0) {
      return { items: [], unreadCount: 0, viewAllRoute: route }
    }

    if (role === 'student') {
      route = '/student/my-activities'
      // Sort by latest first
      const sorted = [...achievements].sort((a, b) => new Date(b.date || b.updatedAt) - new Date(a.date || a.updatedAt))
      activityItems = sorted.slice(0, 5).map(act => {
        let icon = Clock
        let iconColor = 'text-amber-500 dark:text-amber-400'
        let bgColor = 'bg-amber-50 dark:bg-amber-500/10'
        let title = 'Pending Verification'
        let desc = 'Awaiting faculty review'
        
        if (act.status === 'Verified') {
          icon = CheckCircle2
          iconColor = 'text-teal-500 dark:text-teal-400'
          bgColor = 'bg-teal-50 dark:bg-teal-500/10'
          title = 'Achievement Verified'
          desc = 'Status officially updated'
        } else if (act.status === 'Rejected') {
          icon = XCircle
          iconColor = 'text-rose-500 dark:text-rose-400'
          bgColor = 'bg-rose-50 dark:bg-rose-500/10'
          title = 'Verification Rejected'
          desc = act.remarks || 'Faculty feedback available'
          count++ // Count rejected as requiring attention
        }

        return {
          id: act.id,
          title: act.title,
          statusTitle: title,
          desc,
          icon,
          iconColor,
          bgColor,
          action: () => {
            setIsOpen(false)
            navigate(route)
          }
        }
      })
    } else if (role === 'faculty') {
      route = '/faculty/pending-verification'
      const pending = achievements.filter(a => a.status === 'Pending')
      count = pending.length
      
      if (count > 0) {
        activityItems.push({
          id: 'pending-summary',
          title: `${count} pending verifications`,
          statusTitle: 'Action Required',
          desc: 'Records awaiting your review',
          icon: Clock,
          iconColor: 'text-amber-500 dark:text-amber-400',
          bgColor: 'bg-amber-50 dark:bg-amber-500/10',
          action: () => {
            setIsOpen(false)
            navigate(route)
          }
        })
      }
      
      const verified = achievements.filter(a => a.status === 'Verified').slice(0, 3)
      verified.forEach(act => {
        activityItems.push({
          id: act.id,
          title: act.title,
          statusTitle: 'Recently Verified',
          desc: `Student: ${act.studentName}`,
          icon: CheckCircle2,
          iconColor: 'text-teal-500 dark:text-teal-400',
          bgColor: 'bg-teal-50 dark:bg-teal-500/10',
          action: () => {
            setIsOpen(false)
            navigate('/faculty/verified-records')
          }
        })
      })
    } else if (role === 'admin') {
      route = '/admin/verifications'
      const pending = achievements.filter(a => a.status === 'Pending')
      count = pending.length
      
      if (count > 0) {
        activityItems.push({
          id: 'pending-summary-admin',
          title: `${count} platform verifications pending`,
          statusTitle: 'Operational Alert',
          desc: 'Faculty reviews outstanding',
          icon: Clock,
          iconColor: 'text-amber-500 dark:text-amber-400',
          bgColor: 'bg-amber-50 dark:bg-amber-500/10',
          action: () => {
            setIsOpen(false)
            navigate(route)
          }
        })
      }
    }

    return { items: activityItems, unreadCount: count, viewAllRoute: route }
  }, [achievements, role, navigate])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 shadow-sm transition-colors dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-slate-800"
        aria-label="Activity Center"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-white dark:border-slate-900"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[90vw] bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden transition-all duration-200 transform origin-top-right dark:bg-slate-900 dark:border-slate-800">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between dark:bg-slate-900 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-content-dark dark:text-white flex items-center gap-2">
                <ActivityIcon size={16} className="text-indigo-500" /> Activity Center
              </h3>
              <p className="text-xs text-content-muted mt-0.5 dark:text-slate-400">Recent updates in your workspace</p>
            </div>
            <button 
              onClick={() => { setIsOpen(false); navigate(viewAllRoute); }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              View all
            </button>
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-8">
                <EmptyState 
                  icon={Bell} 
                  title="No recent activity" 
                  message="Your workspace is fully up to date."
                />
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={item.action}
          className="w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-start gap-3 dark:hover:bg-slate-800/50"
                  >
                    <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.bgColor} ${item.iconColor}`}>
                      <item.icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">
                          {item.statusTitle}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 truncate dark:text-white">{item.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                    <ArrowRight size={14} className="text-slate-300 mt-2 shrink-0 dark:text-slate-600" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
