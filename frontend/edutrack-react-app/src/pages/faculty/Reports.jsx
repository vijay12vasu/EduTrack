import { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import ProgressBar from '../../components/ui/ProgressBar'
import { useAchievements } from '../../context/AchievementContext'
import { useAuth } from '../../context/AuthContext'

export default function FacultyReports() {
  const { achievements } = useAchievements()
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Filter to only verified/rejected by this faculty
  const reviewed = achievements.filter(a => a.status === 'Verified' || a.status === 'Rejected')
  const verified = reviewed.filter(a => a.status === 'Verified')
  const rejected = reviewed.filter(a => a.status === 'Rejected')
  
  const total = reviewed.length

  const DEPARTMENT_VERIFICATION_SUMMARY = [
    { label: 'Total Reviewed', value: total > 0 ? 100 : 0, color: 'bg-blue-500' },
    { label: 'Approved', value: total > 0 ? Math.round((verified.length / total) * 100) : 0, color: 'bg-green-500' },
    { label: 'Rejected', value: total > 0 ? Math.round((rejected.length / total) * 100) : 0, color: 'bg-red-500' },
  ]

  const handleGenerate = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/activities/reports/faculty', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to fetch faculty report')
      
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
    } catch (e) {
      setError('Unable to generate report. Make sure you have proper access.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout title="Faculty Reports" subtitle="Track your verification activity">
      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-5">Verification Summary</h3>
          <div className="space-y-5">
            {DEPARTMENT_VERIFICATION_SUMMARY.map((p) => (
              <ProgressBar key={p.label} {...p} />
            ))}
          </div>
        </Card>

        <Card className="p-6 flex flex-col justify-center items-center gap-4">
          <h3 className="text-lg font-bold text-slate-900 w-full text-left">Generate Report</h3>
          <p className="text-sm text-slate-500 text-left w-full">
            Download a PDF report of all your verified student activities.
          </p>
          <Button onClick={handleGenerate} disabled={loading} className="w-full">
            {loading ? 'Generating...' : 'Download Verification Report PDF'}
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  )
}
