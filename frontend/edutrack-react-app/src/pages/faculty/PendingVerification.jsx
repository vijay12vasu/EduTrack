import { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Table, { Tr, Td } from '../../components/ui/Table'
import { useAchievements } from '../../context/AchievementContext'

function formatDate(date) {
  const parsed = new Date(date)
  if (isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function FacultyVerification() {
  const { achievements, updateAchievementStatus, loading, token } = useAchievements()
  const [actionError, setActionError] = useState('')
  const [actionLoading, setActionLoading] = useState(null) // track which id is loading

  const handleViewCertificate = async (fileId) => {
    if (!fileId || !token) return
    try {
      const res = await fetch(`/api/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to fetch certificate')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
    } catch {
      setActionError('Unable to load certificate.')
    }
  }

  const handleAction = async (id, status) => {
    setActionError('')
    setActionLoading(id)
    try {
      await updateAchievementStatus(id, status)
    } catch (err) {
      setActionError(err.message || `Failed to ${status.toLowerCase()} activity`)
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <DashboardLayout
      title="Faculty Verification"
      subtitle="Review and verify student achievements"
    >
      {actionError && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {actionError}
        </div>
      )}

      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Achievement Records</h3>

        {loading ? (
          <div className="text-center py-10 text-slate-400">Loading submissions...</div>
        ) : (
          <Table columns={['Student', 'Activity', 'Category', 'Date', 'Status', 'Action']}>
            {achievements.map((a) => (
              <Tr key={a.id}>
                <Td>{a.studentName || a.studentEmail || '—'}</Td>
                <Td bold>{a.title}</Td>
                <Td>{a.category}</Td>
                <Td>{formatDate(a.date)}</Td>
                <Td>
                  <Badge status={a.status} />
                </Td>
                <Td>
                  {a.status === 'Pending' ? (
                    <div className="flex gap-2 flex-wrap">
                      {a.certificate && (
                        <button
                          onClick={() => handleViewCertificate(a.certificate)}
                          className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 border border-blue-200"
                          title="View Certificate"
                        >
                          View Cert
                        </button>
                      )}
                      <Button
                        variant="success"
                        size="sm"
                        disabled={actionLoading === a.id}
                        onClick={() => handleAction(a.id, 'Verified')}
                      >
                        {actionLoading === a.id ? '...' : 'Approve'}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={actionLoading === a.id}
                        onClick={() => handleAction(a.id, 'Rejected')}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-slate-400">
                      {a.status === 'Verified' ? '✓ Approved' : a.status === 'Rejected' ? '✗ Rejected' : '—'}
                    </span>
                  )}
                </Td>
              </Tr>
            ))}
            {achievements.length === 0 && (
              <Tr>
                <Td colSpan={6} className="text-center py-10 text-slate-400">
                  No achievement records to review.
                </Td>
              </Tr>
            )}
          </Table>
        )}
      </Card>
    </DashboardLayout>
  )
}