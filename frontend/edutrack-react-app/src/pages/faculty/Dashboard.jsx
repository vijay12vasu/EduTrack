import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
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

export default function FacultyDashboard() {
  const { achievements } = useAchievements()

  const pending = achievements.filter(
    (a) => a.status === 'Pending'
  )

  const verified = achievements.filter(
    (a) => a.status === 'Verified'
  )

  const rejected = achievements.filter(
    (a) => a.status === 'Rejected'
  )

  const totalReviewed = verified.length + rejected.length

  return (
    <DashboardLayout
      title="Faculty Dashboard"
      subtitle="Review and manage student achievement submissions"
    >
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <StatCard
          label="Pending Verification"
          value={pending.length}
          icon="P"
          color="amber"
        />

        <StatCard
          label="Verified"
          value={verified.length}
          icon="V"
          color="green"
        />

        <StatCard
          label="Total Reviewed"
          value={totalReviewed}
          icon="T"
          color="blue"
        />
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">
            Pending Submissions
          </h3>

          <span className="text-sm font-semibold text-amber-500">
            {pending.length} pending
          </span>
        </div>

        {pending.length === 0 ? (
          <div className="text-center py-16">
            <h4 className="text-lg font-semibold text-slate-700">
              No pending submissions
            </h4>

            <p className="text-slate-500 mt-2">
              Student achievement requests will appear here for verification.
            </p>

            <Button className="mt-6" disabled>
              Nothing to Review
            </Button>
          </div>
        ) : (
          <Table columns={['Activity', 'Category', 'Date', 'Status']}>
            {pending.map((achievement, index) => (
              <Tr
                key={achievement.id}
                striped={index % 2 === 1}
              >
                <Td bold>
                  {achievement.activity || achievement.title}
                </Td>

                <Td>{achievement.category}</Td>

                <Td>{formatDate(achievement.date)}</Td>

                <Td>
                  <span className="text-amber-500 font-semibold">
                    {achievement.status}
                  </span>
                </Td>
              </Tr>
            ))}
          </Table>
        )}
      </Card>
    </DashboardLayout>
  )
}