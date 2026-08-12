import { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { REPORT_TYPES } from '../../data/dummyData'

export default function AdminReports() {
  const [selected, setSelected] = useState(REPORT_TYPES[0].id)
  const [range, setRange] = useState({ from: '', to: '' })
  const [generated, setGenerated] = useState(false)

  return (
    <DashboardLayout title="Generate Reports" subtitle="Create NAAC/NBA and student profile reports">
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
            placeholder="DD-MM-YYYY"
            value={range.from}
            onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))}
          />
          <Input
            label="To Date"
            placeholder="DD-MM-YYYY"
            value={range.to}
            onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setGenerated(true)}>{generated ? 'Report Generated!' : 'Generate Report'}</Button>
          <Button variant="secondary" disabled={!generated}>Download PDF</Button>
        </div>
      </Card>
    </DashboardLayout>
  )
}
