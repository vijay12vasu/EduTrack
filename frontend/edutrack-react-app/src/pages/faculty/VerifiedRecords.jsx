import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Table, { Tr, Td } from '../../components/ui/Table'
import { VERIFIED_RECORDS } from '../../data/dummyData'

export default function VerifiedRecords() {
  return (
    <DashboardLayout title="Verified Records" subtitle="All achievements verified by you">
      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Verified Student Activities</h3>
        <Table columns={['Student', 'Activity', 'Category', 'Date', 'Status']}>
          {VERIFIED_RECORDS.map((r) => (
            <Tr key={r.id}>
              <Td bold>{r.student}</Td>
              <Td>{r.activity}</Td>
              <Td>{r.category}</Td>
              <Td>{new Date(r.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</Td>
              <Td><Badge status={r.status} /></Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </DashboardLayout>
  )
}
