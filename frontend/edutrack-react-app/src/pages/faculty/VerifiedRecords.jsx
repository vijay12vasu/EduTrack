import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Table, { Tr, Td } from '../../components/ui/Table'
import { useAchievements } from '../../context/AchievementContext'

function formatDate(date) {
  const parsed = new Date(date)
  if (isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function VerifiedRecords() {
  const { achievements, loading } = useAchievements()

  // Filter to only verified/rejected (reviewed) records
  const reviewed = achievements.filter(a => a.status === 'Verified' || a.status === 'Rejected')

  return (
    <DashboardLayout title="Verified Records" subtitle="All achievements reviewed by you">
      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Reviewed Student Activities</h3>

        {loading ? (
          <div className="text-center py-10 text-slate-400">Loading records...</div>
        ) : (
          <Table columns={['Student', 'Activity', 'Category', 'Date', 'Status']}>
            {reviewed.map((r) => (
              <Tr key={r.id}>
                <Td bold>{r.studentName || r.studentEmail || '—'}</Td>
                <Td>{r.title}</Td>
                <Td>{r.category}</Td>
                <Td>{formatDate(r.date)}</Td>
                <Td><Badge status={r.status} /></Td>
              </Tr>
            ))}
            {reviewed.length === 0 && (
              <Tr>
                <Td colSpan={5} className="text-center py-10 text-slate-400">
                  No reviewed records yet.
                </Td>
              </Tr>
            )}
          </Table>
        )}
      </Card>
    </DashboardLayout>
  )
}
