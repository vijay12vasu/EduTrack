import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import Table, { Tr, Td } from '../../components/ui/Table'
import { VERIFICATIONS_OVERVIEW_STATS, VERIFICATION_AUDIT } from '../../data/dummyData'

export default function Verifications() {
  return (
    <DashboardLayout title="Verifications Overview" subtitle="Institution-wide verification status">
      <div className="grid grid-cols-3 gap-4 mb-6 max-w-2xl">
        <StatCard label="Pending" value={VERIFICATIONS_OVERVIEW_STATS.pending} icon="P" color="amber" />
        <StatCard label="Approved" value={VERIFICATIONS_OVERVIEW_STATS.approved} icon="A" color="green" />
        <StatCard label="Rejected" value={VERIFICATIONS_OVERVIEW_STATS.rejected} icon="R" color="red" />
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Verification Audit</h3>
        <Table columns={['Record', 'Student', 'Faculty', 'Status']}>
          {VERIFICATION_AUDIT.map((v) => (
            <Tr key={v.id}>
              <Td bold>{v.record}</Td>
              <Td>{v.student}</Td>
              <Td>{v.faculty}</Td>
              <Td>
                <span className={v.status === 'Verified' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                  {v.status}
                </span>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </DashboardLayout>
  )
}
