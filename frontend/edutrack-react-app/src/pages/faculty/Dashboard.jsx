import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import Button from '../../components/ui/Button'
import Table, { Tr, Td } from '../../components/ui/Table'
import ProgressBar from '../../components/ui/ProgressBar'
import { useAchievements } from '../../context/AchievementContext'
import { useAuth } from '../../context/AuthContext'

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
  const navigate = useNavigate()
  const { achievements } = useAchievements()
  const { token } = useAuth()
  
  const [students, setStudents] = useState([])
  const [loadingStudents, setLoadingStudents] = useState(true)

  useEffect(() => {
    if (!token) return
    fetch('/api/users/shared/students', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : [])
      .then(data => setStudents(data))
      .catch(err => console.error(err))
      .finally(() => setLoadingStudents(false))
  }, [token])

  const pending = achievements.filter((a) => a.status === 'Pending')
  const verified = achievements.filter((a) => a.status === 'Verified')
  const rejected = achievements.filter((a) => a.status === 'Rejected')

  const totalReviewed = verified.length + rejected.length

  const VERIFICATION_SUMMARY = [
    { label: 'Total Reviewed', value: totalReviewed > 0 ? 100 : 0, color: 'bg-blue-500' },
    { label: 'Approved', value: totalReviewed > 0 ? Math.round((verified.length / totalReviewed) * 100) : 0, color: 'bg-green-500' },
    { label: 'Rejected', value: totalReviewed > 0 ? Math.round((rejected.length / totalReviewed) * 100) : 0, color: 'bg-red-500' },
  ]

  return (
    <DashboardLayout
      title="Faculty Dashboard"
      subtitle="Review and manage student achievement submissions"
    >
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <StatCard
          label="Total Students"
          value={loadingStudents ? '—' : students.length}
          icon="S"
          color="indigo"
        />
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

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Students / Users
          </h3>

          {loadingStudents ? (
            <div className="text-center py-16 text-slate-400">Loading students...</div>
          ) : students.length === 0 ? (
            <div className="text-center py-16">
              <h4 className="text-lg font-semibold text-slate-700">No students found</h4>
              <p className="text-slate-500 mt-2">No students are currently registered in the system.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-500 border-y border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Student Name</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((student) => (
                    <tr 
                      key={student.id} 
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/faculty/students/${student.id}`)}
                    >
                      <td className="px-4 py-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                            {student.fullName ? student.fullName.charAt(0).toUpperCase() : 'S'}
                          </div>
                          {student.fullName}
                        </div>
                      </td>
                      <td className="px-4 py-4">{student.email}</td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-blue-600 font-medium hover:underline">View Profile →</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-5">
            Verification Summary
          </h3>

          {totalReviewed === 0 ? (
            <div className="flex items-center justify-center h-48 text-slate-500 text-center text-sm">
              No verification data yet
            </div>
          ) : (
            <div className="space-y-5">
              {VERIFICATION_SUMMARY.map((p) => (
                <ProgressBar key={p.label} {...p} />
              ))}
            </div>
          )}
        </Card>
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
              No pending verifications
            </h4>
            <p className="text-slate-500 mt-2">
              Student achievement requests will appear here for verification.
            </p>
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