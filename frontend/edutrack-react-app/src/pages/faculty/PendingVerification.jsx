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
  const { achievements, updateAchievementStatus } = useAchievements()

  return (
    <DashboardLayout
      title="Faculty Verification"
      subtitle="Review and verify student achievements"
    >
      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Achievement Records</h3>
        <Table columns={['Activity', 'Category', 'Date', 'Status', 'Action']}>
          {achievements.map((a) => (
            <Tr key={a.id}>
              <Td bold>{a.activity || a.title}</Td>
              <Td>{a.category}</Td>
              <Td>{formatDate(a.date)}</Td>
              <Td>
                <Badge status={a.status} />
              </Td>
              <Td>
                {a.status === 'Pending' ? (
                  <div className="flex gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => updateAchievementStatus(a.id, 'Verified')}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => updateAchievementStatus(a.id, 'Rejected')}
                    >
                      Reject
                    </Button>
                  </div>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </Td>
            </Tr>
          ))}
          {achievements.length === 0 && (
            <Tr>
              <Td colSpan={5} className="text-center py-10 text-slate-400">
                No achievement records to review.
              </Td>
            </Tr>
          )}
        </Table>
      </Card>
    </DashboardLayout>
  )
}