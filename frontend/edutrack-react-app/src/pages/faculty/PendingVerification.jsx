import { useState } from 'react'
import { CheckCircle, XCircle, FileText, FileSearch, Eye } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import Skeleton from '../../components/ui/Skeleton'
import { Input } from '../../components/ui/Input'
import { useAchievements } from '../../context/AchievementContext'
import { useToast } from '../../context/ToastContext'
import Modal from '../../components/ui/Modal'
import ActivityDetailsModal from '../../components/ui/ActivityDetailsModal'
import CertificateViewerModal from '../../components/ui/CertificateViewerModal'

function formatDate(date) {
  const parsed = new Date(date)
  if (isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function FacultyVerification() {
  const { achievements, updateAchievementStatus, loading, token } = useAchievements()
  const { addToast } = useToast()
  const [actionError, setActionError] = useState('')
  const [actionLoading, setActionLoading] = useState(null) 
  const [search, setSearch] = useState('')
  
  // Rejection modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectingId, setRejectingId] = useState(null)
  const [remarks, setRemarks] = useState('')
  const [detailsModalOpen, setDetailsModalOpen] = useState(null)

  // Certificate Viewer Modal
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
      addToast('Unable to load certificate.', 'error')
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

  const handleAction = async (id, status, remarksText = '') => {
    setActionError('')
    setActionLoading(id)
    try {
      await updateAchievementStatus(id, status, remarksText)
      addToast(`Activity successfully ${status.toLowerCase()}`, 'success')
      setRejectModalOpen(false)
      setRemarks('')
    } catch (err) {
      addToast(err.message || `Failed to ${status.toLowerCase()} activity`, 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const openRejectModal = (id) => {
    setRejectingId(id)
    setRemarks('')
    setRejectModalOpen(true)
  }

  const confirmReject = () => {
    if (rejectingId) handleAction(rejectingId, 'Rejected', remarks)
  }

  const pending = achievements.filter((a) => {
    if (a.status !== 'Pending') return false
    if (search) {
      const q = search.toLowerCase()
      const title = (a.title || a.activity || '').toLowerCase()
      const studentName = (a.studentName || '').toLowerCase()
      if (!title.includes(q) && !studentName.includes(q)) return false
    }
    return true
  })

  return (
    <DashboardLayout
      title="Pending Verification"
      subtitle="Review submitted evidence and approve or reject student records."
    >
      {actionError && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm font-semibold text-rose-700 shadow-sm flex items-center gap-3">
          <XCircle size={18} />
          {actionError}
        </div>
      )}

      <div className="mb-6 flex items-center gap-4">
        <Input
          placeholder="Search by student or activity..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 bg-white dark:bg-slate-900"
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 lg:p-6 shadow-sm flex flex-col lg:flex-row gap-6">
              <div className="flex-1 grid md:grid-cols-2 gap-6">
                <div>
                  <Skeleton variant="text" className="w-16 h-3 mb-2" />
                  <div className="flex items-center gap-3">
                    <Skeleton variant="circular" className="w-10 h-10 shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton variant="text" className="w-3/4" />
                      <Skeleton variant="text" className="w-1/2" />
                    </div>
                  </div>
                </div>
                <div>
                  <Skeleton variant="text" className="w-24 h-3 mb-2" />
                  <Skeleton variant="text" className="w-full h-5 mb-2" />
                  <div className="flex gap-2">
                    <Skeleton variant="rectangular" className="w-20 h-5 rounded-full" />
                    <Skeleton variant="rectangular" className="w-24 h-5 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : pending.length === 0 ? (
        <EmptyState 
          icon={FileSearch}
          title={search ? 'No matches found' : 'Queue is empty'}
          message={search ? 'No pending activities match your search.' : 'All student submissions have been reviewed. Great job!'}
        />
      ) : (
        <div className="space-y-4">
          {pending.map((a) => (
            <div 
              key={a.id} 
    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 lg:p-6 shadow-sm hover:border-indigo-300 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Student & Activity Info */}
              <div className="flex-1 grid md:grid-cols-2 gap-6">
                <div>
         <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Student</h4>
                  <div className="flex items-center gap-3">
     <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold text-sm shrink-0">
                      {(a.studentName || a.studentEmail || 'S').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
           <p className="font-bold text-slate-900 dark:text-white truncate">{a.studentName || 'Unknown'}</p>
           <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">{a.studentEmail || 'No email'}</p>
                    </div>
                  </div>
                </div>

                <div>
         <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Achievement</h4>
         <p className="font-bold text-slate-900 dark:text-white leading-tight mb-1">{a.title || a.activity}</p>
                  <div className="flex flex-wrap items-center gap-2">
     <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{a.category}</span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 ">{formatDate(a.date)}</span>
                  </div>
                </div>
              </div>

              {/* Actions Separator */}
       <div className="hidden lg:block w-px h-16 bg-slate-100 dark:bg-slate-800 "></div>

              {/* Evidence & Verification Actions */}
              <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 shrink-0">
                {a.certificate ? (
                  <Button 
                    variant="secondary" 
                    onClick={() => handleViewCertificate(a.certificate)}
                    className="flex-1 lg:flex-none text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/30 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                  >
                    <Eye size={16} />
                    View Proof
                  </Button>
                ) : (
     <div className="flex-1 lg:flex-none px-4 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-400 text-sm font-medium flex items-center justify-center gap-2">
                    <FileText size={16} />
                    No File
                  </div>
                )}
                
                <div className="flex gap-2 w-full lg:w-auto mt-3 lg:mt-0 items-center">
                  <Button
                    variant="ghost"
                    onClick={() => setDetailsModalOpen(a)}
                    className="flex-1 lg:flex-none text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/30 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                  >
                    Details
                  </Button>
                  
                  <Button
                    variant="danger"
                    disabled={actionLoading === a.id}
                    onClick={() => openRejectModal(a.id)}
                    className="px-4 flex-1 lg:flex-none justify-center bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 dark:border-rose-500/30"
                    title="Reject"
                  >
                    <XCircle size={18} />
                    <span className="lg:hidden ml-2">Reject</span>
                  </Button>
                  
                  <Button
                    variant="success"
                    disabled={actionLoading === a.id}
                    onClick={() => handleAction(a.id, 'Verified')}
                    className="px-6 flex-1 lg:flex-none justify-center shadow-sm"
                  >
                    <CheckCircle size={18} />
                    Approve
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <Modal isOpen={rejectModalOpen} onClose={() => setRejectModalOpen(false)} title="Reject Verification">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Please provide a reason for rejecting this achievement. This helps the student understand what needs to be fixed.
        </p>
        <textarea
          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 mb-4 h-32 resize-none"
          placeholder="e.g. The uploaded certificate is illegible. Please provide a clear scan."
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setRejectModalOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmReject} disabled={actionLoading === rejectingId}>
            {actionLoading === rejectingId ? 'Processing...' : 'Confirm Rejection'}
          </Button>
        </div>
      </Modal>

      <CertificateViewerModal 
        open={viewerOpen} 
        onClose={closeViewer} 
        url={viewerUrl} 
        loading={viewerLoading} 
      />

      <ActivityDetailsModal 
        open={!!detailsModalOpen} 
        onClose={() => setDetailsModalOpen(null)} 
        activity={detailsModalOpen}
        onViewCertificate={handleViewCertificate}
      />
    </DashboardLayout>
  )
}