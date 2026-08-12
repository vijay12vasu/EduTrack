import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Table, { Tr, Td } from '../../components/ui/Table'
import { ALL_ACTIVITY_RECORDS } from '../../data/dummyData'

export default function ManageActivities() {
  return (
    <DashboardLayout title="Manage Activities" subtitle="All submitted student activity records">
      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">All Activity Records</h3>
        <Table columns={['Activity', 'Student', 'Category', 'Status', 'Verify']}>
          {ALL_ACTIVITY_RECORDS.map((a, i) => (
            <Tr key={a.id} striped={i % 2 === 1}>
              <Td bold>{a.activity}</Td>
              <Td>{a.student}</Td>
              <Td>{a.category}</Td>
              <Td><Badge status={a.status} /></Td>
              <Td>{a.verify}</Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </DashboardLayout>
  )
}
