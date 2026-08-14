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

export default function ManageActivities() {
  const { achievements, loading } = useAchievements()

  return (
    <DashboardLayout title="Manage Activities" subtitle="All submitted student activity records">
      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">All Activity Records</h3>
        {loading ? (
          <div className="text-center py-10 text-slate-400">Loading activities...</div>
        ) : (
          <Table columns={['Activity', 'Student', 'Category', 'Date', 'Status']}>
            {achievements.map((a, i) => (
              <Tr key={a.id} striped={i % 2 === 1}>
                <Td bold>{a.title}</Td>
                <Td>{a.studentName || a.studentEmail || '—'}</Td>
                <Td>{a.category}</Td>
                <Td>{formatDate(a.date)}</Td>
                <Td><Badge status={a.status} /></Td>
              </Tr>
            ))}
            {achievements.length === 0 && (
              <Tr>
                <Td colSpan={5} className="text-center py-10 text-slate-400">No activities found.</Td>
              </Tr>
            )}
          </Table>
        )}
      </Card>
    </DashboardLayout>
  )
}
