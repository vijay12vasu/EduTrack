import { useState, useEffect } from 'react'
import { Users, Activity, CheckCircle, Clock, Shield, BarChart3, Database, AlertTriangle, Filter } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function MetricBlock({ title, value, icon: Icon, bgClass, colorClass }) {
  return (
    <div className={`p-5 rounded-2xl border ${bgClass} flex flex-col justify-between h-full`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
      </div>
      <div>
    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
      {value === null ? <Skeleton variant="text" className="w-16 h-8 mt-1" /> : value}
    </p>
    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{title}</p>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { token } = useAuth()
  const navigate = useNavigate()
  
  const [stats, setStats] = useState({ total: 0, pending: 0, verified: 0, rejected: 0 })
  const [userCount, setUserCount] = useState(0)
  const [categoryData, setCategoryData] = useState([])
  const [bottlenecks, setBottlenecks] = useState({ oldestDays: 0, topCategory: 'None', topCategoryCount: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    
    Promise.all([
      fetch('/api/activities/admin/summary', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null),
      fetch('/api/users/admin/all', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null),
      fetch('/api/activities/admin', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : [])
    ])
    .then(([activitySummary, users, allActivities]) => {
      if (activitySummary) setStats(activitySummary)
      if (users && Array.isArray(users)) setUserCount(users.length)
      
      if (allActivities && Array.isArray(allActivities)) {
        const counts = {}
        const pendingCounts = {}
        let oldestPendingDate = null
        
        allActivities.forEach(a => {
          counts[a.category] = (counts[a.category] || 0) + 1
          if (a.status === 'PENDING' || a.status === 'Pending') {
            pendingCounts[a.category] = (pendingCounts[a.category] || 0) + 1
            if (!oldestPendingDate || new Date(a.createdAt) < oldestPendingDate) {
              oldestPendingDate = new Date(a.createdAt)
            }
          }
        })
        const data = Object.keys(counts).map(k => ({ category: k, count: counts[k] }))
        data.sort((a, b) => b.count - a.count)
        setCategoryData(data)
        
        // Calculate bottlenecks
        let topCat = 'None'
        let topCatCount = 0
        Object.keys(pendingCounts).forEach(k => {
          if (pendingCounts[k] > topCatCount) {
            topCatCount = pendingCounts[k]
            topCat = k
          }
        })
        
        const oldestDays = oldestPendingDate ? Math.floor((new Date() - oldestPendingDate) / (1000 * 60 * 60 * 24)) : 0
        setBottlenecks({ oldestDays, topCategory: topCat, topCategoryCount: topCatCount })
      }
    })
    .catch(err => setError(err.message))
    .finally(() => setLoading(false))
  }, [token])

  const calculateRates = () => {
    if (stats.total === 0) return { rejectionRate: 0, verificationRate: 0, backlog: 0 }
    const reviewed = stats.verified + stats.rejected
    const rejectionRate = reviewed > 0 ? Math.round((stats.rejected / reviewed) * 100) : 0
    const verificationRate = reviewed > 0 ? Math.round((stats.verified / reviewed) * 100) : 0
    const backlog = Math.round((stats.pending / stats.total) * 100)
    return { rejectionRate, verificationRate, backlog }
  }

  const rates = calculateRates()

  return (
    <DashboardLayout
      title="Command Center"
      subtitle="EduTrack Platform Operations"
    >
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-sm font-semibold text-rose-700 dark:text-rose-400 shadow-sm">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
        {/* LEVEL 1: PLATFORM OVERVIEW (Hero Area) */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-8 lg:p-10 shadow-lg border border-slate-200 dark:border-slate-800 flex flex-col justify-between min-h-[300px]">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100/50 dark:bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
          
          <div className="relative z-10 mb-8">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-4">
              <Shield size={20} />
              <span className="font-bold tracking-widest text-xs uppercase">System Health Active</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3">Platform Overview</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md text-sm lg:text-base leading-relaxed">
              Monitor institutional activity, manage user accounts, and oversee the verification workload across all faculties.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-4 mt-auto">
            <Button onClick={() => navigate('/admin/students')} className="bg-indigo-600 hover:bg-indigo-500 text-white border-transparent shadow-sm">
              Manage Users
            </Button>
            <Button variant="ghost" onClick={() => navigate('/admin/reports')} className="text-indigo-700 dark:text-white hover:bg-indigo-50 dark:hover:bg-white/10">
              Platform Reports →
            </Button>
          </div>
        </div>

        {/* LEVEL 2: KEY METRICS SIDEBAR */}
        <div className="space-y-4 flex flex-col">
          <MetricBlock
            title="Total Registered Users"
            value={loading ? null : userCount}
            icon={Users}
   bgClass="bg-white dark:bg-slate-900 border-slate-200/60 shadow-sm"
   colorClass="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 "
          />
          <MetricBlock
            title="Total Recorded Activities"
            value={loading ? null : stats.total}
            icon={Activity}
            bgClass="bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100/60 dark:border-indigo-800/30 shadow-sm"
            colorClass="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <MetricBlock 
          title="Oldest Pending Submission" 
          value={loading ? null : (bottlenecks.oldestDays > 0 ? `${bottlenecks.oldestDays} days` : '0 days')} 
          icon={AlertTriangle} 
          bgClass="bg-white dark:bg-slate-900 border-slate-200/60 shadow-sm" 
          colorClass="bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400" 
        />
        <MetricBlock 
          title="Highest Pending Category" 
          value={loading ? null : (bottlenecks.topCategoryCount > 0 ? bottlenecks.topCategory : 'None')} 
          icon={Filter} 
          bgClass="bg-white dark:bg-slate-900 border-slate-200/60 shadow-sm" 
          colorClass="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" 
        />
      </div>

      {/* LEVEL 3: OPERATIONAL INSIGHTS */}
   <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 mt-2">Operational Workload</h3>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 border-amber-200/60 dark:border-amber-800/30 bg-amber-50/30 dark:bg-amber-900/10 hover:border-amber-300/60 transition-colors cursor-pointer" onClick={() => navigate('/admin/verifications')}>
          <div className="flex items-center gap-3 mb-2 text-amber-600 dark:text-amber-400">
            <Clock size={18} strokeWidth={2.5} />
            <h4 className="font-bold text-sm uppercase tracking-wide">Pending Review</h4>
          </div>
     <p className="text-4xl font-black text-slate-900 dark:text-white mb-1">
       {loading ? <Skeleton variant="text" className="w-12 h-10 mt-1" /> : stats.pending}
     </p>
     <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 ">Awaiting faculty verification</p>
        </Card>

        <Card className="p-6 border-teal-200/60 dark:border-teal-800/30 bg-teal-50/30 dark:bg-teal-900/10 hover:border-teal-300/60 transition-colors cursor-pointer" onClick={() => navigate('/admin/verifications')}>
          <div className="flex items-center gap-3 mb-2 text-teal-600 dark:text-teal-400">
            <CheckCircle size={18} strokeWidth={2.5} />
            <h4 className="font-bold text-sm uppercase tracking-wide">Verified Records</h4>
          </div>
      <p className="text-4xl font-black text-slate-900 dark:text-white mb-1">
        {loading ? <Skeleton variant="text" className="w-12 h-10 mt-1" /> : stats.verified}
      </p>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Successfully processed</span>
        {!loading && stats.verified > 0 && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400">
            {rates.verificationRate}% of reviewed
          </span>
        )}
      </div>
        </Card>

        <Card className="p-6 border-rose-200/60 dark:border-rose-800/30 bg-rose-50/30 dark:bg-rose-900/10 hover:border-rose-300/60 transition-colors cursor-pointer" onClick={() => navigate('/admin/activities')}>
          <div className="flex items-center gap-3 mb-2 text-rose-600 dark:text-rose-400">
            <Activity size={18} strokeWidth={2.5} />
            <h4 className="font-bold text-sm uppercase tracking-wide">Rejected Records</h4>
          </div>
      <p className="text-4xl font-black text-slate-900 dark:text-white mb-1">
        {loading ? <Skeleton variant="text" className="w-12 h-10 mt-1" /> : stats.rejected}
      </p>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Returned to student</span>
        {!loading && stats.rejected > 0 && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400">
            {rates.rejectionRate}% rejection rate
          </span>
        )}
      </div>
        </Card>

    <Card className="p-6 border-slate-200/60 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer md:col-span-3" onClick={() => navigate('/admin/activities')}>
     <div className="flex items-center gap-3 mb-2 text-slate-600 dark:text-slate-400 ">
            <Database size={18} strokeWidth={2.5} />
            <h4 className="font-bold text-sm uppercase tracking-wide">Data Ledger</h4>
          </div>
     <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3 mt-4">Access raw activity ledger and view full institutional logs.</p>
          <span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:underline">View Activities →</span>
        </Card>
      </div>

      {/* LEVEL 4: CATEGORY DISTRIBUTION */}
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 mt-2">Category Distribution</h3>
      <Card className="p-6 border-slate-200/60 dark:border-slate-800 mb-8">
        {loading ? (
          <div className="space-y-4">
            <Skeleton variant="rectangular" className="w-full h-8" />
            <Skeleton variant="rectangular" className="w-full h-8" />
            <Skeleton variant="rectangular" className="w-full h-8" />
          </div>
        ) : categoryData.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">No activity data available to generate distribution.</p>
        ) : (
          <div className="space-y-4">
            {categoryData.map(item => {
              const percentage = Math.round((item.count / stats.total) * 100) || 0
              return (
                <div key={item.category}>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-700 dark:text-slate-300 uppercase tracking-wide">{item.category}</span>
                    <span className="text-slate-500 dark:text-slate-400">{item.count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-indigo-500 dark:bg-indigo-400 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

    </DashboardLayout>
  )
}