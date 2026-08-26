import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Award, FileText, Download, Target, CheckCircle2, Clock, XCircle, LayoutList } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Table, { Tr, Td } from '../../components/ui/Table'
import EmptyState from '../../components/ui/EmptyState'
import { Input } from '../../components/ui/Input'
import Skeleton from '../../components/ui/Skeleton'
import ActivityDetailsModal from '../../components/ui/ActivityDetailsModal'
import CertificateViewerModal from '../../components/ui/CertificateViewerModal'
import { useAchievements } from '../../context/AchievementContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

const FILTERS = [
  { label: 'All Records', value: 'All Status' },
  { label: 'Verified', value: 'Verified' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Rejected', value: 'Rejected' }
]

function formatDate(date) {
  const parsed = new Date(date)
  if (isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function MyActivities() {
  const navigate = useNavigate()
  const { achievements, loading, deleteAchievement, token } = useAchievements()
  const { addToast } = useToast()
  const [filter, setFilter] = useState('All Status')
  const [search, setSearch] = useState('')
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerUrl, setViewerUrl] = useState('')
  const [viewerLoading, setViewerLoading] = useState(false)

  const rows = achievements.filter((a) => {
    if (filter !== 'All Status' && a.status !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      const title = (a.title || '').toLowerCase()
      const category = (a.category || '').toLowerCase()
      if (!title.includes(q) && !category.includes(q)) return false
    }
    return true
  })
  
  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: achievements.length,
      verified: achievements.filter(a => a.status === 'Verified').length,
      pending: achievements.filter(a => a.status === 'Pending').length,
      rejected: achievements.filter(a => a.status === 'Rejected').length,
    }
  }, [achievements])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to withdraw this activity?')) return
    try {
      await deleteAchievement(id)
      addToast('Activity successfully withdrawn', 'success')
    } catch (err) {
      addToast(err.message, 'error')
    }
  }

  const handleViewCertificate = async (fileId) => {
    if (!fileId || !token) return
    setViewerLoading(true)
    setViewerOpen(true)
    try {
      const res = await fetch(`/api/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to fetch certificate')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      setViewerUrl(url)
    } catch {
      addToast('Unable to load certificate. Ensure you have proper access.', 'error')
      setViewerOpen(false)
    } finally {
      setViewerLoading(false)
    }
  }

  const closeViewer = () => {
    setViewerOpen(false)
    if (viewerUrl) {
      URL.revokeObjectURL(viewerUrl)
      setViewerUrl('')
    }
  }

  return (
    <DashboardLayout
      title="Achievement Ledger"
      subtitle="Track and manage the verification status of your submitted activities."
    >
      {/* removed inline error */}

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
     <Card className="p-4 border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center gap-4">
   <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
              <LayoutList size={20} />
            </div>
            <div>
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total</p>
        <p className="text-2xl font-black text-slate-900 dark:text-white ">{stats.total}</p>
            </div>
         </Card>
         <Card className="p-4 border-teal-200/60 dark:border-teal-500/20 shadow-sm flex items-center gap-4 bg-teal-50/10 dark:bg-teal-500/5">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
               <p className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">Verified</p>
               <p className="text-2xl font-black text-teal-900 dark:text-teal-300">{stats.verified}</p>
            </div>
         </Card>
         <Card className="p-4 border-amber-200/60 dark:border-amber-500/20 shadow-sm flex items-center gap-4 bg-amber-50/10 dark:bg-amber-500/5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Clock size={20} />
            </div>
            <div>
               <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Pending</p>
               <p className="text-2xl font-black text-amber-900 dark:text-amber-300">{stats.pending}</p>
            </div>
         </Card>
         <Card className="p-4 border-rose-200/60 dark:border-rose-500/20 shadow-sm flex items-center gap-4 bg-rose-50/10 dark:bg-rose-500/5">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <XCircle size={20} />
            </div>
            <div>
               <p className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">Rejected</p>
               <p className="text-2xl font-black text-rose-900 dark:text-rose-300">{stats.rejected}</p>
            </div>
         </Card>
      </div>

   <Card className="p-0 overflow-hidden border-slate-200/60 dark:border-slate-800 shadow-sm">
        
        {/* Header & Filters */}
  <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Target size={20} strokeWidth={2.5} />
            </div>
            <div>
       <h3 className="text-lg font-bold text-slate-900 dark:text-white ">Activity History</h3>
       <p className="text-sm text-slate-500 dark:text-slate-400 ">Your documented educational journey.</p>
            </div>
          </div>
          
     <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-auto overflow-x-auto hide-scrollbar">
            {FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                  filter === f.value 
          ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' 
          : 'text-slate-500 hover:text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <Input
            placeholder="Search by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 bg-white dark:bg-slate-900"
          />
        </div>

        {/* Data State */}
        {loading ? (
          <div className="p-6 space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton variant="text" className="w-1/4 h-4" />
                <Skeleton variant="text" className="w-1/6 h-4" />
                <Skeleton variant="text" className="w-1/6 h-4" />
                <Skeleton variant="rectangular" className="w-20 h-6 rounded-full" />
              </div>
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="p-10">
            <EmptyState 
              icon={FileText} 
              title={search ? 'No matches found' : (filter === 'All Status' ? 'No activities documented' : `No ${filter.toLowerCase()} records`)} 
              message={search ? `No activities match "${search}"` : (filter === 'All Status' ? "You haven't submitted any activities for verification yet." : `You don't have any activities currently marked as ${filter}.`)}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table columns={['Activity Details', 'Category', 'Date', 'Status', 'Evidence', 'Action']}>
              {rows.map((a, i) => (
    <Tr key={a.id} striped={i % 2 === 1} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-900/50 transition-colors">
                  <Td bold>
          <p className="font-bold text-slate-900 dark:text-white truncate max-w-[200px] lg:max-w-xs" title={a.title}>{a.title}</p>
                  </Td>
                  <Td>
   <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-[11px] font-bold tracking-wider uppercase">
                      {a.category}
                    </span>
                  </Td>
         <Td><span className="text-slate-500 dark:text-slate-400 font-medium">{formatDate(a.date)}</span></Td>
                  <Td>
                    <Badge status={a.status} />
                  </Td>
                  <Td>
                    {a.certificate ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewCertificate(a.certificate)}
                        className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 py-1 px-3 h-auto"
                      >
                        <Download size={14} className="mr-1.5" />
                        View
                      </Button>
                    ) : (
      <span className="text-slate-400 text-xs font-semibold px-3 py-1 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">No File</span>
                    )}
                  </Td>
                  <Td>
                    {a.status === 'Pending' ? (
                      <div className="flex gap-2 items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate('/student/add', { state: { editActivity: a } })}
                          className="py-1 px-3 h-auto text-indigo-600 dark:text-indigo-400"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(a.id)}
                          className="py-1 px-3 h-auto"
                        >
                          Withdraw
                        </Button>
                      </div>
                    ) : a.status === 'Rejected' && a.remarks ? (
                      <div className="flex gap-2 items-center">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate('/student/add', { state: { editActivity: a } })}
                          className="py-1 px-3 h-auto bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          Resubmit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedActivity(a)}
                          className="py-1 px-3 h-auto text-indigo-600 dark:text-indigo-400"
                        >
                          Details
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedActivity(a)}
                        className="py-1 px-3 h-auto text-indigo-600 dark:text-indigo-400"
                      >
                        Details
                      </Button>
                    )}
                  </Td>
                </Tr>
              ))}
            </Table>
          </div>
        )}
      </Card>

      <ActivityDetailsModal 
        open={!!selectedActivity} 
        onClose={() => setSelectedActivity(null)} 
        activity={selectedActivity}
        onViewCertificate={handleViewCertificate}
      />

      <CertificateViewerModal 
        open={viewerOpen} 
        onClose={closeViewer} 
        url={viewerUrl} 
        loading={viewerLoading} 
      />
    </DashboardLayout>
  )
}