import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Table, { Tr, Td } from '../../components/ui/Table'
import { useAchievements } from '../../context/AchievementContext'
import { useAuth } from '../../context/AuthContext'

const STATUS_ACTIONS = { Verified: 'View', Pending: 'Edit', Rejected: 'Remarks' }
const FILTERS = ['All Status', 'Verified', 'Pending', 'Rejected']

function formatDate(date) {
  const parsed = new Date(date)
  if (isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function MyActivities() {
  const { achievements, loading, deleteAchievement, token } = useAchievements()
  const [filter, setFilter] = useState('All Status')
  const [menuOpen, setMenuOpen] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const rows = achievements.filter((a) => filter === 'All Status' || a.status === filter)

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to withdraw this activity?')) return
    setDeleteError('')
    try {
      await deleteAchievement(id)
    } catch (err) {
      setDeleteError(err.message)
    }
  }

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
      setDeleteError('Unable to load certificate. Ensure you have proper access.')
    }
  }

  return (
    <DashboardLayout
      title="My Achievements"
      subtitle="Track all submitted and verified activities"
      action={
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Filter: {filter}
            <ChevronDown size={16} className="text-slate-400" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg border border-slate-100 shadow-card overflow-hidden z-10">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setFilter(f)
                    setMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>
      }
    >
      {deleteError && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {deleteError}
        </div>
      )}

      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Achievement Records</h3>

        {loading ? (
          <div className="text-center py-10 text-slate-400">Loading activities...</div>
        ) : (
          <Table columns={['Activity', 'Category', 'Date', 'Status', 'Certificate', 'Action']}>
            {rows.map((a) => (
              <Tr key={a.id}>
                <Td bold>{a.title}</Td>
                <Td>{a.category}</Td>
                <Td>{formatDate(a.date)}</Td>
                <Td>
                  <Badge status={a.status} />
                </Td>
                <Td>
                  {a.certificate ? (
                    <button
                      onClick={() => handleViewCertificate(a.certificate)}
                      className="text-blue-600 font-semibold text-xs hover:underline"
                    >
                      View
                    </button>
                  ) : (
                    <span className="text-slate-400 text-xs">—</span>
                  )}
                </Td>
                <Td>
                  {a.status === 'Pending' ? (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(a.id)}
                    >
                      Withdraw
                    </Button>
                  ) : a.status === 'Rejected' && a.remarks ? (
                    <span className="text-xs text-red-600" title={a.remarks}>
                      {a.remarks.length > 30 ? a.remarks.substring(0, 30) + '...' : a.remarks}
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </Td>
              </Tr>
            ))}
            {rows.length === 0 && (
              <Tr>
                <Td colSpan={6} className="text-center py-10 text-slate-400">
                  No records match this filter.
                </Td>
              </Tr>
            )}
          </Table>
        )}
      </Card>
    </DashboardLayout>
  )
}