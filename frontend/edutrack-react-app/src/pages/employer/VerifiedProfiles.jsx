import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Table, { Tr, Td } from '../../components/ui/Table'
import { useAchievements } from '../../context/AchievementContext'
import { useNavigate } from 'react-router-dom'

export default function VerifiedProfiles() {
  const { achievements } = useAchievements()
  const navigate = useNavigate()

  // For employer, achievements are already filtered by VERIFIED if fetched through /api/activities/admin?status=VERIFIED
  // Group by student email/id
  const studentMap = {}
  achievements.forEach(a => {
    const key = a.studentId || a.studentEmail || 'unknown'
    if (!studentMap[key]) {
      studentMap[key] = { 
        count: 0, 
        id: a.studentId, 
        name: a.studentName || a.studentEmail || 'Unknown Student' 
      }
    }
    studentMap[key].count += 1
  })

  return (
    <DashboardLayout title="Verified Profiles" subtitle="Institution-verified student achievement profiles">
      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Accessible Verified Profiles</h3>
        <Table columns={['Student', 'Verified Activities', 'Action']}>
          {Object.values(studentMap).map((student, i) => (
            <Tr key={student.id || i} striped={i % 2 === 1}>
              <Td bold>{student.name}</Td>
              <Td>{student.count}</Td>
              <Td>
                <button
                  onClick={() => {
                    if (student.id) navigate(`/employer/students/${student.id}`)
                  }}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  View
                </button>
              </Td>
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
