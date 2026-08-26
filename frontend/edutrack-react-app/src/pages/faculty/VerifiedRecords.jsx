import { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Table, { Tr, Td } from '../../components/ui/Table'
import { Input } from '../../components/ui/Input'
import EmptyState from '../../components/ui/EmptyState'
import Skeleton from '../../components/ui/Skeleton'
import Button from '../../components/ui/Button'
import ActivityDetailsModal from '../../components/ui/ActivityDetailsModal'
import CertificateViewerModal from '../../components/ui/CertificateViewerModal'
import { useAchievements } from '../../context/AchievementContext'
import { FileSearch, Search, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

function formatDate(date) {
  const parsed = new Date(date)
  if (isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function VerifiedRecords() {
  const { achievements, loading } = useAchievements()
  const { token } = useAuth()
  const { addToast } = useToast()
  const [search, setSearch] = useState('')
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerUrl, setViewerUrl] = useState('')
  const [viewerLoading, setViewerLoading] = useState(false)

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

  // Filter to only verified/rejected (reviewed) records
  const reviewed = achievements.filter(a => {
    if (a.status !== 'Verified' && a.status !== 'Rejected') return false
    if (search) {
      const q = search.toLowerCase()
      const title = (a.title || '').toLowerCase()
      const student = (a.studentName || a.studentEmail || '').toLowerCase()
      if (!title.includes(q) && !student.includes(q)) return false
    }
    return true
  })

  return (
    <DashboardLayout title="Verified Records" subtitle="All achievements reviewed by you">
   <Card className="p-0 overflow-hidden border-slate-200/60 shadow-sm">
  <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white ">Reviewed Student Activities</h3>
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 ">{reviewed.length} records</span>
      </div>
      <Input 
        placeholder="Search student or activity..." 
        value={search} 
        onChange={(e) => setSearch(e.target.value)} 
        className="w-full md:w-64 bg-white dark:bg-slate-900"
      />
    </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton variant="circular" className="w-8 h-8 shrink-0" />
                <Skeleton variant="text" className="w-1/4 h-4" />
                <Skeleton variant="text" className="w-1/4 h-4" />
                <Skeleton variant="rectangular" className="w-20 h-6 rounded-full" />
              </div>
            ))}
          </div>
        ) : reviewed.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={FileSearch} title="No reviewed records" message={search ? 'Try adjusting your search.' : "You haven't reviewed any student submissions yet."} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table columns={['Student', 'Activity', 'Category', 'Date', 'Status', 'Action']}>
              {reviewed.map((r) => (
    <Tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-900/50 ">
                <Td bold>
                  <div className="flex items-center gap-3">
     <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold text-xs shrink-0">
                      {(r.studentName || r.studentEmail || 'S').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
           <p className="font-bold text-slate-900 dark:text-white truncate">{r.studentName || 'Unknown'}</p>
                    </div>
                  </div>
                </Td>
                <Td>{r.title}</Td>
        <Td><span className="text-slate-500 dark:text-slate-400 font-medium">{r.category}</span></Td>
                <Td>{formatDate(r.date)}</Td>
                <Td><Badge status={r.status} /></Td>
                <Td>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedActivity(r)}
                    className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 py-1 px-3 h-auto"
                  >
                    Details <ArrowRight size={14} className="ml-1" />
                  </Button>
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
