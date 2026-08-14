import { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import StatCard from '../../components/ui/StatCard'
import { useAchievements } from '../../context/AchievementContext'
import { useAuth } from '../../context/AuthContext'

export default function VerifyStudent() {
  const { achievements, getCertificateUrl } = useAchievements()
  const { token } = useAuth()
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loadingScore, setLoadingScore] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)

    if (!query.trim()) return

    // Search through verified achievements for the student
    const studentActs = achievements.filter(
      a => 
        (a.studentEmail && a.studentEmail.toLowerCase().includes(query.toLowerCase())) ||
        (a.studentName && a.studentName.toLowerCase().includes(query.toLowerCase())) ||
        (a.studentId && a.studentId.toLowerCase().includes(query.toLowerCase()))
    )

    if (studentActs.length === 0) {
      setError('No verified profile found for this student.')
      return
    }

    const first = studentActs[0]
    const studentId = first.studentId
    
    let aiScore = 0
    if (studentId) {
       setLoadingScore(true)
       try {
         const res = await fetch(`/api/activities/ai/score/${studentId}`, {
           headers: { Authorization: `Bearer ${token}` }
         })
         if (res.ok) {
            const data = await res.json()
            aiScore = data.overallScore || 0
         }
       } catch (err) {
         console.error(err)
       } finally {
         setLoadingScore(false)
       }
    }

    setResult({
      name: first.studentName || 'Unknown Name',
      regNo: first.studentId || first.studentEmail || 'Unknown ID',
      department: 'N/A', // Not stored in activity
      institution: 'EduTrack Institution',
      verifiedActivities: studentActs.length,
      aiScore: aiScore,
      latestCertificate: studentActs.find(a => a.certificate)?.certificate
    })
  }

  const handleDownload = async () => {
    if (!result?.latestCertificate || !token) {
       setError('No certificate available for download.')
       return
    }
    try {
      const res = await fetch(`/api/files/${result.latestCertificate}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to fetch certificate')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
    } catch {
      setError('Unable to load certificate. Ensure you have proper access.')
    }
  }

  return (
    <DashboardLayout title="Employer Verification" subtitle="Verify trusted student achievement profiles">
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Search Student</h3>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <Input
            className="flex-1"
            placeholder="Enter student email or name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit" disabled={loadingScore}>{loadingScore ? 'Searching...' : 'Search'}</Button>
        </form>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </Card>

      {result && (
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Verified Student Profile</h3>
            <div className="space-y-1 text-sm text-slate-600 mb-6">
              <p>Name: {result.name}</p>
              <p>Identifier: {result.regNo}</p>
              <p>Department: {result.department}</p>
              <p>Institution: {result.institution}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button>View Verified Profile</Button>
              <Button variant="secondary" onClick={handleDownload}>Download Latest Credential</Button>
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
