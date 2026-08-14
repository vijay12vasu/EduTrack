import { useState, useEffect } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const { token } = useAuth()
  const navigate = useNavigate()
  
  const [stats, setStats] = useState({ total: 0, pending: 0, verified: 0, rejected: 0 })
  const [userCount, setUserCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    
    Promise.all([
      fetch('/api/activities/admin/summary', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null),
      fetch('/api/users/admin/all', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null)
    ])
    .then(([activitySummary, users]) => {
      if (activitySummary) setStats(activitySummary)
      if (users && Array.isArray(users)) setUserCount(users.length)
    })
    .catch(err => setError(err.message))
    .finally(() => setLoading(false))
  }, [token])

  return (
    <DashboardLayout
      title="Admin Dashboard"
      subtitle="Manage users and monitor the EduTrack system"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Users"
          value={loading ? "..." : userCount}
          icon="Users"
          color="blue"
        />

        <StatCard
          label="Total Activities"
          value={loading ? "..." : stats.total}
          icon="Activity"
          color="blue"
        />

        <StatCard
          label="Verified Records"
          value={loading ? "..." : stats.verified}
          icon="CheckCircle"
          color="green"
        />

        <StatCard
          label="Pending Verification"
          value={loading ? "..." : stats.pending}
          icon="Clock"
          color="amber"
        />
      </div>

      <Card className="p-10 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-3">
          Welcome to EduTrack Administration
        </h2>

        <p className="text-slate-500 mb-8 max-w-xl mx-auto">
          From this dashboard, you can oversee all student activities, manage user accounts (Students, Faculty, Employers), and generate compliance reports.
        </p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate('/admin/students')}>
            Manage Users
          </Button>
          <Button variant="secondary" onClick={() => navigate('/admin/reports')}>
            Generate Reports
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  )
}