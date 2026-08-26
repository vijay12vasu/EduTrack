import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileSearch, Clock, ShieldCheck, Users, AlertTriangle, History } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Table, { Tr, Td } from '../../components/ui/Table'
import ProgressBar from '../../components/ui/ProgressBar'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import Skeleton from '../../components/ui/Skeleton'
import { useAchievements } from '../../context/AchievementContext'
import { useAuth } from '../../context/AuthContext'

function formatDate(date) {
  const parsed = new Date(date)
  if (isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function MetricBox({ title, value, icon: Icon, colorClass, bgClass }) {
  return (
    <div className={`p-5 rounded-2xl border ${bgClass} flex items-center justify-between`}>
      <div>
    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">{title}</p>
    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
        <Icon strokeWidth={2} />
      </div>
    </div>
  )
}

export default function FacultyDashboard() {
  const navigate = useNavigate()
  const { achievements } = useAchievements()
  const { token, user } = useAuth()
  
  const [students, setStudents] = useState([])
  const [loadingStudents, setLoadingStudents] = useState(true)

  useEffect(() => {
    if (!token) return
    fetch('/api/users/shared/students', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : [])
      .then(data => setStudents(data))
      .catch(err => console.error(err))
      .finally(() => setLoadingStudents(false))
  }, [token])

  const pending = achievements.filter((a) => a.status === 'Pending')
  const verified = achievements.filter((a) => a.status === 'Verified')
  const rejected = achievements.filter((a) => a.status === 'Rejected')
  const totalReviewed = verified.length + rejected.length

  const VERIFICATION_SUMMARY = [
    { label: 'Total Reviewed', value: totalReviewed > 0 ? 100 : 0, color: 'bg-indigo-500' },
    { label: 'Approved', value: totalReviewed > 0 ? Math.round((verified.length / totalReviewed) * 100) : 0, color: 'bg-teal-500' },
    { label: 'Rejected', value: totalReviewed > 0 ? Math.round((rejected.length / totalReviewed) * 100) : 0, color: 'bg-rose-500' },
  ]

  let oldestPendingDays = 0
  let resubmittedCount = 0
  if (pending.length > 0) {
    const oldest = pending.reduce((old, a) => new Date(old.createdAt) < new Date(a.createdAt) ? old : a)
    oldestPendingDays = Math.floor((new Date() - new Date(oldest.createdAt)) / (1000 * 60 * 60 * 24))
    
    resubmittedCount = pending.filter(a => a.history && a.history.some(h => h.action === 'RESUBMITTED')).length
  }

  return (
    <DashboardLayout
      title="Review Workspace"
      subtitle={`Welcome back, ${user?.fullName?.split(' ')[0] || 'Faculty'}. Here is your verification queue.`}
      action={
        <Button onClick={() => navigate('/faculty/pending-verification')}>
          Open Full Queue
        </Button>
      }
    >
      {/* Concise Workload Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricBox 
          title="Action Required" 
          value={pending.length} 
          icon={Clock} 
          bgClass="bg-amber-50/40 dark:bg-amber-500/10 border-amber-100/60 dark:border-amber-500/20" 
          colorClass="bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400" 
        />
        <MetricBox 
          title="Verified" 
          value={verified.length} 
          icon={ShieldCheck} 
          bgClass="bg-teal-50/40 dark:bg-teal-500/10 border-teal-100/60 dark:border-teal-500/20" 
          colorClass="bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400" 
        />
        <MetricBox 
          title="Total Reviewed" 
          value={totalReviewed} 
          icon={FileSearch} 
          bgClass="bg-indigo-50/40 dark:bg-indigo-500/10 border-indigo-100/60 dark:border-indigo-500/20" 
          colorClass="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400" 
        />
        <MetricBox 
          title="My Students" 
          value={loadingStudents ? '—' : students.length} 
          icon={Users} 
   bgClass="bg-white dark:bg-slate-900 border-slate-200/60 shadow-sm" 
   colorClass="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 " 
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <MetricBox 
          title="Oldest Pending" 
          value={oldestPendingDays > 0 ? `${oldestPendingDays} days` : '0 days'} 
          icon={AlertTriangle} 
          bgClass="bg-white dark:bg-slate-900 border-slate-200/60 shadow-sm" 
          colorClass="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400" 
        />
        <MetricBox 
          title="Resubmitted Pending Review" 
          value={resubmittedCount} 
          icon={History} 
          bgClass="bg-white dark:bg-slate-900 border-slate-200/60 shadow-sm" 
          colorClass="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400" 
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* PRIMARY FOCAL AREA: Verification Queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Priority Queue</h3>
            {pending.length > 0 && (
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold shadow-sm">
                {pending.length} pending
              </span>
            )}
          </div>
          
          <div className="bg-indigo-50/30 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100/60 dark:border-indigo-800/30 p-2 shadow-sm">
            {pending.length === 0 ? (
              <EmptyState 
                icon={ShieldCheck} 
                title="All caught up!" 
                message="There are no pending submissions requiring your verification."
              />
            ) : (
              <Table columns={['Student / Activity', 'Category', 'Date', 'Status', 'Action']}>
                {pending.slice(0, 5).map((achievement) => (
         <Tr key={achievement.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <Td>
           <div className="font-bold text-slate-900 dark:text-white mb-0.5">{achievement.activity || achievement.title}</div>
           <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{achievement.studentName || achievement.studentEmail || 'Unknown Student'}</div>
                    </Td>
          <Td><span className="text-slate-700 dark:text-slate-300 font-medium">{achievement.category}</span></Td>
          <Td><span className="text-slate-600 dark:text-slate-400 ">{formatDate(achievement.date)}</span></Td>
                    <Td><Badge status={achievement.status} /></Td>
                    <Td>
                      <Button variant="ghost" size="sm" onClick={() => navigate('/faculty/pending-verification')}>
                        Review →
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Table>
            )}
          </div>
          {pending.length > 5 && (
            <div className="text-center">
              <Button variant="link" onClick={() => navigate('/faculty/pending-verification')}>
                View all {pending.length} pending submissions
              </Button>
            </div>
          )}
        </div>

        {/* SUPPORTING AREAS */}
        <div className="space-y-8">
     <Card className="p-6 border-slate-200/60 shadow-sm">
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">Verification Insights</h3>
            {totalReviewed === 0 ? (
       <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm font-medium">
                No verification data yet.
              </div>
            ) : (
              <div className="space-y-6">
                {VERIFICATION_SUMMARY.map((p) => (
                  <ProgressBar key={p.label} {...p} />
                ))}
              </div>
            )}
          </Card>

     <Card className="p-6 border-slate-200/60 shadow-sm">
            <div className="flex items-center justify-between mb-5">
       <h3 className="text-base font-bold text-slate-900 dark:text-white ">Assigned Students</h3>
              <Button variant="link" size="sm" onClick={() => navigate('/faculty/students')}>View All</Button>
            </div>

            {loadingStudents ? (
              <div className="space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="flex items-center gap-3 p-3">
                    <Skeleton variant="circular" className="w-10 h-10 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton variant="text" className="w-3/4" />
                      <Skeleton variant="text" className="w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : students.length === 0 ? (
       <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm font-medium">No assigned students.</div>
            ) : (
              <div className="space-y-3">
                {students.slice(0, 4).map((student) => (
                  <div 
                    key={student.id} 
                    onClick={() => navigate(`/faculty/students/${student.id}`)}
   className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-900/50 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                      {student.fullName ? student.fullName.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <div className="min-w-0 flex-1">
           <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{student.fullName}</p>
           <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{student.email}</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500 dark:text-indigo-400 shrink-0">
                      →
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}