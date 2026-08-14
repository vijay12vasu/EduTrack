import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import Table, { Tr, Td } from '../../components/ui/Table'
import { useAchievements } from '../../context/AchievementContext'

export default function Verifications() {
  const { achievements, loading } = useAchievements()

  const pending = achievements.filter(a => a.status === 'Pending').length
  const verified = achievements.filter(a => a.status === 'Verified').length
  const rejected = achievements.filter(a => a.status === 'Rejected').length

  const auditRecords = achievements.filter(a => a.status !== 'Pending')

  return (
    <DashboardLayout title="Verifications Overview" subtitle="Institution-wide verification status">
      <div className="grid grid-cols-3 gap-4 mb-6 max-w-2xl">
        <StatCard label="Pending" value={pending} icon="P" color="amber" />
        <StatCard label="Approved" value={verified} icon="A" color="green" />
        <StatCard label="Rejected" value={rejected} icon="R" color="red" />
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Verification Audit</h3>
        {loading ? (
          <div className="text-center py-10 text-slate-400">Loading audit log...</div>
        ) : (
          <Table columns={['Activity', 'Student', 'Verified By', 'Status']}>
            {auditRecords.map((v) => (
              <Tr key={v.id}>
                <Td bold>{v.title}</Td>
                <Td>{v.studentName || v.studentEmail || '—'}</Td>
                <Td>{v.verifierName || '—'}</Td>
                <Td>
                  <span className={v.status === 'Verified' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                    {v.status}
                  </span>
                </Td>
              </Tr>
            ))}
            {auditRecords.length === 0 && (
              <Tr>
                <Td colSpan={4} className="text-center py-10 text-slate-400">No verification history found.</Td>
              </Tr>
            )}
          </Table>
        )}
      </Card>
    </DashboardLayout>
  )
}
