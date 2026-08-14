import { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuth } from '../../context/AuthContext'

const REPORT_TYPES = [
  { id: 'naac', name: 'Organization-Wide Activity Report', description: 'Generates activity summary for the institution.' },
  { id: 'nba', name: 'Verification Summary', description: 'Generates summary of pending and verified activities.' },
  { id: 'custom', name: 'Custom Activity Export', description: 'Export raw activity data.' },
]

export default function AdminReports() {
  const { token } = useAuth()
  const [selected, setSelected] = useState(REPORT_TYPES[0].id)
  const [range, setRange] = useState({ from: '', to: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/activities/reports/admin', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to fetch admin report')
      
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
    <DashboardLayout title="Generate Reports" subtitle="Create NAAC/NBA and student profile reports">
      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {REPORT_TYPES.map((r) => (
          <Card
            key={r.id}
            className={`p-6 flex flex-col gap-4 cursor-pointer transition-shadow ${
              selected === r.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelected(r.id)}
          >
            <div>
              <h4 className="font-bold text-slate-900 mb-1">{r.name}</h4>
              <p className="text-sm text-slate-500">{r.description}</p>
            </div>
            <Button variant={selected === r.id ? 'primary' : 'secondary'} className="mt-auto">
              Select
            </Button>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="grid sm:grid-cols-2 gap-5 mb-6 max-w-xl">
          <Input
            label="From Date"
            type="date"
            value={range.from}
            onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))}
          />
          <Input
            label="To Date"
            type="date"
            value={range.to}
            onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleGenerate} disabled={loading}>{loading ? 'Generating...' : 'Generate Report'}</Button>
        </div>
      </Card>
    </DashboardLayout>
  )
}
