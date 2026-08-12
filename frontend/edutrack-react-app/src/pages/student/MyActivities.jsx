import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Table, { Tr, Td } from '../../components/ui/Table'
import { useAchievements } from '../../context/AchievementContext'

const STATUS_ACTIONS = { Verified: 'View', Pending: 'Edit', Rejected: 'Remarks' }
const FILTERS = ['All Status', 'Verified', 'Pending', 'Rejected']

function formatDate(date) {
  const parsed = new Date(date)
  if (isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function MyActivities() {
  const { achievements } = useAchievements()
  const [filter, setFilter] = useState('All Status')
  const [menuOpen, setMenuOpen] = useState(false)

  const rows = achievements.filter((a) => filter === 'All Status' || a.status === filter)

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
      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Achievement Records</h3>
        <Table columns={['Activity', 'Category', 'Date', 'Status', 'Action']}>
          {rows.map((a) => (
            <Tr key={a.id}>
              <Td bold>{a.activity || a.title}</Td>
              <Td>{a.category}</Td>
              <Td>{formatDate(a.date)}</Td>
              <Td>
                <Badge status={a.status} />
              </Td>
              <Td className="text-blue-600 font-semibold">{STATUS_ACTIONS[a.status]}</Td>
            </Tr>
          ))}
          {rows.length === 0 && (
            <Tr>
              <Td colSpan={5} className="text-center py-10 text-slate-400">
                No records match this filter.
              </Td>
            </Tr>
          )}
        </Table>
      </Card>
    </DashboardLayout>
  )
}