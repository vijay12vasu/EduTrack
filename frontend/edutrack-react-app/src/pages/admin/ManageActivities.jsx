import { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Table, { Tr, Td } from '../../components/ui/Table'
import { Input, Select } from '../../components/ui/Input'
import EmptyState from '../../components/ui/EmptyState'
import Skeleton from '../../components/ui/Skeleton'
import { useAchievements } from '../../context/AchievementContext'
import { Database } from 'lucide-react'

function formatDate(date) {
  const parsed = new Date(date)
  if (isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatTime(dateStr) {
  if (!dateStr) return '—'
  const parsed = new Date(dateStr)
  if (isNaN(parsed.getTime())) return '—'
  return parsed.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function ManageActivities() {
  const { achievements, loading } = useAchievements()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const filtered = achievements.filter(a => {
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      const title = (a.title || '').toLowerCase()
      const student = (a.studentName || a.studentEmail || '').toLowerCase()
      const category = (a.category || '').toLowerCase()
      if (!title.includes(q) && !student.includes(q) && !category.includes(q)) return false
    }
    return true
  })

  return (
    <DashboardLayout title="Data Ledger" subtitle="Access raw activity ledger and institutional logs.">
   <Card className="p-0 overflow-hidden border-slate-200/60 shadow-sm">
  <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white ">Institutional Audit Trail</h3>
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 ">{filtered.length} records</span>
      </div>
      <div className="flex items-center gap-3">
        <Input 
          placeholder="Search activities..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="w-full md:w-64 bg-white dark:bg-slate-900"
        />
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-32 bg-white dark:bg-slate-900">
          <option value="ALL">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Verified">Verified</option>
          <option value="Rejected">Rejected</option>
        </Select>
      </div>
    </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton variant="text" className="w-1/4 h-4" />
                <Skeleton variant="text" className="w-1/4 h-4" />
                <Skeleton variant="text" className="w-1/6 h-4" />
                <Skeleton variant="rectangular" className="w-20 h-6 rounded-full" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={Database} title="No records found" message={search ? 'Try adjusting your search or filters.' : 'No activity records exist in the system yet.'} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table columns={['Activity', 'Student', 'Category', 'Last Modified', 'Status', 'Audit']}>
              {filtered.map((a, i) => (
    <Tr key={a.id} striped={i % 2 === 1} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-900/50 ">
                <Td bold>
                  <div className="flex flex-col">
                    <span>{a.title}</span>
                    <span className="text-xs text-slate-500 font-normal">Created: {formatDate(a.createdAt || a.date)}</span>
                  </div>
                </Td>
                <Td>
                  <div className="flex items-center gap-2">
     <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {(a.studentName || a.studentEmail || 'S').charAt(0).toUpperCase()}
                    </div>
          <span className="text-sm text-slate-700 dark:text-slate-300 ">{a.studentName || a.studentEmail || 'Unknown'}</span>
                  </div>
                </Td>
        <Td><span className="text-slate-500 dark:text-slate-400 font-medium">{a.category}</span></Td>
                <Td>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{formatTime(a.updatedAt || a.createdAt)}</span>
                </Td>
                <Td><Badge status={a.status} /></Td>
                <Td>
                  {a.verifierName ? (
                    <div className="text-xs text-slate-500">
                      Reviewed by: <strong className="text-slate-700 dark:text-slate-300">{a.verifierName}</strong>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </Td>
              </Tr>
            ))}
          </Table>
          </div>
        )}
      </Card>
    </DashboardLayout>
  )
}
