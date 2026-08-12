import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Table, { Tr, Td } from '../../components/ui/Table'
import { VERIFIED_PROFILES } from '../../data/dummyData'

export default function VerifiedProfiles() {
  return (
    <DashboardLayout title="Verified Profiles" subtitle="Institution-verified student achievement profiles">
      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Accessible Verified Profiles</h3>
        <Table columns={['Student', 'Department', 'Verified Activities', 'AI Score', 'Action']}>
          {VERIFIED_PROFILES.map((p, i) => (
            <Tr key={p.id} striped={i % 2 === 1}>
              <Td bold>{p.student}</Td>
              <Td>{p.department}</Td>
              <Td>{p.verifiedActivities}</Td>
              <Td>{p.aiScore}/100</Td>
              <Td className="text-blue-600 font-semibold">View</Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </DashboardLayout>
  )
}
