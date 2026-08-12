import { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import StatCard from '../../components/ui/StatCard'
import { EMPLOYER_SEARCH_RESULT } from '../../data/dummyData'

export default function VerifyStudent() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)

  const handleSearch = (e) => {
    e.preventDefault()
    // Demo data: any non-empty query returns the sample verified profile.
    setResult(query.trim() ? EMPLOYER_SEARCH_RESULT : null)
  }

  return (
    <DashboardLayout title="Employer Verification" subtitle="Verify trusted student achievement profiles">
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Search Student</h3>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <Input
            className="flex-1"
            placeholder="Enter register number / verification ID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit">Search</Button>
        </form>
      </Card>

      {result && (
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Verified Student Profile</h3>
            <div className="space-y-1 text-sm text-slate-600 mb-6">
              <p>Name: {result.name}</p>
              <p>Reg No: {result.regNo}</p>
              <p>Department: {result.department}</p>
              <p>Institution: {result.institution}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button>View Verified Profile</Button>
              <Button variant="secondary">Download Credential</Button>
            </div>
          </Card>

          <div className="space-y-4">
            <StatCard label="Verified Activities" value={result.verifiedActivities} icon="V" color="green" />
            <StatCard label="AI Score" value={result.aiScore} suffix="/100" icon="A" color="blue" />
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
