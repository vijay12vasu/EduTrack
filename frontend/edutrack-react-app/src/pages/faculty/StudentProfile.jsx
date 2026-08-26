import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import Table, { Tr, Td } from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
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

export default function FacultyStudentProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  
  const [student, setStudent] = useState(null)
  const [activities, setActivities] = useState([])
  const [aiScore, setAiScore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token || !id) return
    
    setLoading(true)
    Promise.all([
      fetch(`/api/users/shared/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`/api/activities/admin?studentId=${id}`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`/api/activities/ai/score/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    ])
    .then(async ([resUser, resAct, resAi]) => {
      if (!resUser.ok) throw new Error('Student not found')
      const user = await resUser.json()
      
      let acts = []
      if (resAct.ok) acts = await resAct.json()
      
      let ai = null
      if (resAi.ok) ai = await resAi.json()

      setStudent(user)
      setActivities(acts)
      setAiScore(ai)
    })
    .catch(err => {
      setError(err.message)
    })
    .finally(() => setLoading(false))
  }, [token, id])

  if (loading) {
    return (
      <DashboardLayout title="Student Profile">
        <div className="text-center py-16 text-slate-400">Loading student data...</div>
      </DashboardLayout>
    )
  }

  if (error || !student) {
    return (
      <DashboardLayout title="Student Profile">
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
          {error || 'Failed to load student'}
        </div>
      </DashboardLayout>
    )
  }

  const verified = activities.filter(a => a.status === 'Verified')
  const pending = activities.filter(a => a.status === 'Pending')
  const rejected = activities.filter(a => a.status === 'Rejected')

  return (
    <DashboardLayout title={`${student.fullName}'s Profile`} subtitle="Detailed student information and activity history">
      <button 
        onClick={() => navigate('/faculty/dashboard')}
        className="mb-4 text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
      >
        ← Back to Dashboard
      </button>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="p-6 lg:col-span-2">
     <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Profile Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
      <Input label="Name" value={student.fullName} readOnly className="bg-slate-50 dark:bg-slate-900/50 " />
      <Input label="Email" value={student.email} readOnly className="bg-slate-50 dark:bg-slate-900/50 " />
      <Input label="Role" value={student.role} readOnly className="bg-slate-50 dark:bg-slate-900/50 " />
      <Input label="Register Number" value={student.registerNumber || '—'} readOnly className="bg-slate-50 dark:bg-slate-900/50 " />
      <Input label="Department" value={student.department || '—'} readOnly className="bg-slate-50 dark:bg-slate-900/50 " />
      <Input label="Year" value={student.year || '—'} readOnly className="bg-slate-50 dark:bg-slate-900/50 " />
          </div>
        </Card>

        <Card className="p-6">
     <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">AI Score</h3>
          {aiScore ? (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="text-5xl font-extrabold text-blue-600 mb-2">{aiScore.score}</div>
       <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">Out of 100</div>
       <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 text-center leading-relaxed">
                {aiScore.summary}
              </p>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 text-sm">
              AI score not available or not yet generated for this student.
            </div>
          )}
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex items-center justify-between">
     <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 ">Verified</span>
          <span className="text-2xl font-bold text-green-600">{verified.length}</span>
        </div>
  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex items-center justify-between">
     <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 ">Pending</span>
          <span className="text-2xl font-bold text-amber-500">{pending.length}</span>
        </div>
  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex items-center justify-between">
     <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 ">Rejected</span>
          <span className="text-2xl font-bold text-red-600">{rejected.length}</span>
        </div>
      </div>

      <Card className="p-6">
    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Achievement History</h3>
        {activities.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            No activities submitted by this student.
          </div>
        ) : (
          <Table columns={['Activity', 'Category', 'Date', 'Status']}>
            {activities.map((a, i) => (
              <Tr key={a.id} striped={i % 2 === 1}>
                <Td bold>{a.title || a.activity}</Td>
                <Td>{a.category}</Td>
                <Td>{formatDate(a.date)}</Td>
                <Td><Badge status={a.status} /></Td>
              </Tr>
            ))}
          </Table>
        )}
      </Card>
    </DashboardLayout>
  )
}
