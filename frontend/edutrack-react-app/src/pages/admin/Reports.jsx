import { useState } from 'react'
import { FileText, Download, CheckCircle, PieChart } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuth } from '../../context/AuthContext'

const REPORT_TYPES = [
  { id: 'naac', name: 'Organization-Wide Activity', description: 'Institutional activity summary.', icon: PieChart },
  { id: 'nba', name: 'Verification Summary', description: 'Pending and verified metrics.', icon: CheckCircle },
  { id: 'custom', name: 'Custom Export', description: 'Export raw ledger data.', icon: FileText },
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
    <DashboardLayout title="Platform Reports" subtitle="Generate NAAC compliance and statistical reports">
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm font-semibold text-rose-700 shadow-sm">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {REPORT_TYPES.map((r) => {
          const isActive = selected === r.id
          const Icon = r.icon
          return (
            <Card
              key={r.id}
              className={`p-6 flex flex-col gap-4 cursor-pointer transition-all border-2 ${
                isActive ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10 shadow-md' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700'
              }`}
              onClick={() => setSelected(r.id)}
            >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${isActive ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 '}`}>
                <Icon size={24} />
              </div>
              <div>
        <h4 className="font-bold text-slate-900 dark:text-white mb-1">{r.name}</h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 ">{r.description}</p>
              </div>
              <div className="mt-auto pt-4 flex items-center text-sm font-bold">
                {isActive ? <span className="text-indigo-600">Selected</span> : <span className="text-slate-400">Click to select</span>}
              </div>
            </Card>
          )
        })}
      </div>

      <Card className="p-8 max-w-3xl">
    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Report Parameters</h3>
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
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
    <div className="flex gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
          <Button onClick={handleGenerate} disabled={loading} className="w-full sm:w-auto px-8">
            <Download size={18} />
            {loading ? 'Generating...' : 'Download Report'}
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  )
}
