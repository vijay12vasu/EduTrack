import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import Button from '../../components/ui/Button'
import ProgressBar from '../../components/ui/ProgressBar'
import Table, { Tr, Td } from '../../components/ui/Table'
import { useAchievements } from '../../context/AchievementContext'
import { useAuth } from '../../context/AuthContext'

function formatDate(date) {
  const parsed = new Date(date)
  if (isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  })
}

export default function StudentDashboard() {
  const navigate = useNavigate()
  const { achievements, loading: achLoading, token } = useAchievements()
  const { user } = useAuth()
  // Calculate summary directly from the achievements array
  const summary = {
    total: achievements.length,
    pending: achievements.filter(a => a.status === 'Pending').length,
    verified: achievements.filter(a => a.status === 'Verified').length,
    rejected: achievements.filter(a => a.status === 'Rejected').length
  }
  const summaryLoading = achLoading

  const recent = [...achievements].slice(-4).reverse()

  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'Student'

  // Compute actual categories from real data
  const categoriesMap = {}
  achievements.forEach(a => {
    if (!categoriesMap[a.category]) categoriesMap[a.category] = 0
    categoriesMap[a.category] += 1
  })
  
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-amber-500', 'bg-pink-500']
  const total = achievements.length
  const DASHBOARD_PROGRESS_BY_CATEGORY = Object.keys(categoriesMap).map((cat, i) => {
     const count = categoriesMap[cat]
     const progress = Math.min(100, Math.round((count / Math.max(1, total)) * 100))
     return { label: cat, progress, color: colors[i % colors.length] }
  })

  return (
    <DashboardLayout
      title={`Welcome back, ${firstName}!`}
      subtitle="Here is your complete achievement overview"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Activities"
          value={summaryLoading ? '—' : summary.total}
          icon="T"
          color="blue"
        />

        <StatCard
          label="Verified"
          value={summaryLoading ? '—' : summary.verified}
          icon="V"
          color="green"
        />

        <StatCard
          label="Pending"
          value={summaryLoading ? '—' : summary.pending}
          icon="P"
          color="amber"
        />

        <StatCard
          label="Rejected"
          value={summaryLoading ? '—' : summary.rejected}
          icon="R"
          color="red"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Recent Activities
          </h3>

          {achLoading ? (
            <div className="text-center py-16 text-slate-400">Loading activities...</div>
          ) : recent.length === 0 ? (
            <div className="text-center py-16">
              <h4 className="text-lg font-semibold text-slate-700">
                No achievements uploaded yet
              </h4>

              <p className="text-slate-500 mt-2">
                Upload your first certificate to begin your achievement record.
              </p>

              <Button
                className="mt-6"
                onClick={() => navigate('/student/add-achievement')}
              >
                Upload First Achievement
              </Button>
            </div>
          ) : (
            <Table columns={['Activity', 'Category', 'Date', 'Status']}>
              {recent.map((a, i) => (
                <Tr key={a.id} striped={i % 2 === 1}>
                  <Td bold>{a.title}</Td>

                  <Td>{a.category}</Td>

                  <Td>{formatDate(a.date)}</Td>

                  <Td>
                    <span
                      className={
                        a.status === 'Verified'
                          ? 'text-green-600 font-semibold'
                          : a.status === 'Pending'
                          ? 'text-amber-500 font-semibold'
                          : 'text-red-600 font-semibold'
                      }
                    >
                      {a.status}
                    </span>
                  </Td>
                </Tr>
              ))}
            </Table>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-5">
            Progress by Category
          </h3>

          {DASHBOARD_PROGRESS_BY_CATEGORY.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-slate-500 text-center">
              Progress will appear after you upload and verify activities.
            </div>
          ) : (
            <div className="space-y-5">
              {DASHBOARD_PROGRESS_BY_CATEGORY.map((p) => (
                <ProgressBar key={p.label} {...p} />
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => navigate('/student/add-achievement')}>
          Add Achievement
        </Button>

        <Button
          variant="secondary"
          onClick={() => navigate('/student/my-activities')}
        >
          View My Activities
        </Button>
      </div>
    </DashboardLayout>
  )
}