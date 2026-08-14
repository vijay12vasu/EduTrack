import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Table, { Tr, Td } from '../../components/ui/Table'
import { useAchievements } from '../../context/AchievementContext'

export default function VerifiedProfiles() {
  const { achievements } = useAchievements()

  // For employer, achievements are already filtered by VERIFIED if fetched through /api/activities/admin?status=VERIFIED
  // Group by student email/id
  const studentMap = {}
  achievements.forEach(a => {
    const student = a.studentEmail || a.studentName || a.studentId || 'Unknown Student'
    if (!studentMap[student]) studentMap[student] = 0
    studentMap[student] += 1
  })

  return (
    <DashboardLayout title="Verified Profiles" subtitle="Institution-verified student achievement profiles">
      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Accessible Verified Profiles</h3>
        <Table columns={['Student', 'Verified Activities', 'Action']}>
          {Object.keys(studentMap).map((student, i) => (
            <Tr key={student} striped={i % 2 === 1}>
              <Td bold>{student}</Td>
              <Td>{studentMap[student]}</Td>
              <Td className="text-blue-600 font-semibold">View</Td>
            </Tr>
          ))}
          {Object.keys(studentMap).length === 0 && (
             <Tr>
               <Td colSpan={3} className="text-center py-10 text-slate-400">No verified profiles found.</Td>
             </Tr>
          )}
        </Table>
      </Card>
    </DashboardLayout>
  )
}
