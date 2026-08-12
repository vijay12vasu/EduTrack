import { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const SETTINGS = [
  { label: 'JWT Authentication', value: 'Enabled' },
  { label: 'Certificate Upload Types', value: 'PDF, JPG, PNG' },
  { label: 'AI Service Status', value: 'Active' },
  { label: 'Report Export', value: 'PDF Enabled' },
  { label: 'Recruiter Verification', value: 'Read Only' },
]

export default function Settings() {
  const [saved, setSaved] = useState(false)

  return (
    <DashboardLayout title="System Settings" subtitle="Institution-wide platform configuration">
      <Card className="p-6 md:p-8 max-w-2xl">
        <h3 className="text-lg font-bold text-slate-900 mb-5">Role &amp; Security Configuration</h3>
        <ul className="space-y-3 mb-6">
          {SETTINGS.map((s) => (
            <li key={s.label} className="flex items-center justify-between text-sm border-b border-slate-100 pb-3 last:border-0">
              <span className="text-slate-500">{s.label}</span>
              <span className="font-semibold text-slate-900">{s.value}</span>
            </li>
          ))}
        </ul>
        <Button onClick={() => setSaved(true)}>{saved ? 'Settings Saved!' : 'Save Settings'}</Button>
      </Card>
    </DashboardLayout>
  )
}
