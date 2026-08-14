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

export default function SharedProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token, role: currentUserRole } = useAuth()
  
  const [userProfile, setUserProfile] = useState(null)
  const [activities, setActivities] = useState([])
  const [aiScore, setAiScore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token || !id) return
    
    setLoading(true)
    fetch(`/api/users/shared/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (!res.ok) throw new Error('User not found or access denied')
        return res.json()
      })
      .then(async (user) => {
        setUserProfile(user)
        
        if (user.role === 'STUDENT') {
          // Fetch student specifics
          try {
            const [resAct, resAi] = await Promise.all([
              fetch(`/api/activities/admin?studentId=${id}`, { headers: { Authorization: `Bearer ${token}` } }),
              fetch(`/api/activities/ai/score/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            ])
            
            if (resAct.ok) setActivities(await resAct.json())
            if (resAi.ok) setAiScore(await resAi.json())
          } catch (e) {
            console.error('Failed to fetch student details', e)
          }
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [token, id])

  if (loading) {
    return (
      <DashboardLayout title="User Profile">
        <div className="text-center py-16 text-slate-400">Loading user data...</div>
      </DashboardLayout>
    )
  }

  if (error || !userProfile) {
    return (
      <DashboardLayout title="User Profile">
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
          {error || 'Failed to load user'}
        </div>
      </DashboardLayout>
    )
  }

  const isStudent = userProfile.role === 'STUDENT'
  const verified = activities.filter(a => a.status === 'Verified')
  const pending = activities.filter(a => a.status === 'Pending')
  const rejected = activities.filter(a => a.status === 'Rejected')

  const goBack = () => {
    if (currentUserRole === 'admin') navigate('/admin/dashboard') // or /admin/students which is renamed to /admin/users visually
    else if (currentUserRole === 'faculty') navigate('/faculty/dashboard')
    else if (currentUserRole === 'employer') navigate('/employer/verified-profiles')
    else navigate(-1)
  }

  const backText = currentUserRole === 'admin' ? '← Back to Users' 
                 : currentUserRole === 'faculty' ? '← Back to Students'
                 : currentUserRole === 'employer' ? '← Back to Verified Profiles'
                 : '← Back'

  return (
    <DashboardLayout title={`${userProfile.fullName}'s Profile`} subtitle={`Detailed ${userProfile.role.toLowerCase()} information`}>
      <button 
        onClick={goBack}
        className="mb-4 text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
      >
        {backText}
      </button>

      <div className={`grid gap-6 mb-6 ${isStudent ? 'lg:grid-cols-3' : ''}`}>
        <Card className={`p-6 ${isStudent ? 'lg:col-span-2' : ''}`}>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Profile Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Name" value={userProfile.fullName} readOnly className="bg-slate-50" />
            <Input label="Email" value={userProfile.email} readOnly className="bg-slate-50" />
            <Input label="Role" value={userProfile.role} readOnly className="bg-slate-50" />
            
            {isStudent && (
              <>
                <Input label="Register Number" value={userProfile.registerNumber || '—'} readOnly className="bg-slate-50" />
                <Input label="Department" value={userProfile.department || '—'} readOnly className="bg-slate-50" />
                <Input label="Year" value={userProfile.year || '—'} readOnly className="bg-slate-50" />
              </>
            )}
            
            {!isStudent && userProfile.department && (
              <Input label="Department" value={userProfile.department} readOnly className="bg-slate-50" />
            )}
            {userProfile.company && (
              <Input label="Company" value={userProfile.company} readOnly className="bg-slate-50" />
            )}
            {userProfile.facultyId && (
              <Input label="Faculty ID" value={userProfile.facultyId} readOnly className="bg-slate-50" />
            )}
          </div>
        </Card>

        {isStudent && (
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">AI Score</h3>
            {aiScore ? (
              <div className="flex flex-col items-center justify-center py-4">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">{aiScore.score}</div>
                <div className="text-sm text-slate-500 font-medium">Out of 100</div>
                <p className="mt-4 text-sm text-slate-600 text-center leading-relaxed">
                  {aiScore.summary}
                </p>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400 text-sm">
                AI score not available or not yet generated for this student.
              </div>
            )}
          </Card>
        )}
      </div>

      {isStudent && (
        <>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500">Verified</span>
              <span className="text-2xl font-bold text-green-600">{verified.length}</span>
            </div>
            {currentUserRole !== 'employer' && (
              <>
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-500">Pending</span>
                  <span className="text-2xl font-bold text-amber-500">{pending.length}</span>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-500">Rejected</span>
                  <span className="text-2xl font-bold text-red-600">{rejected.length}</span>
                </div>
              </>
            )}
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Achievement History</h3>
            {activities.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                No activities available.
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
        </>
      )}
    </DashboardLayout>
  )
}
