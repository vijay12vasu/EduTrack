import { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAchievements } from '../../context/AchievementContext'
import { useAuth } from '../../context/AuthContext'
import { Search, UserCheck, Download, Award, BrainCircuit, ShieldCheck, User } from 'lucide-react'

export default function VerifyStudent() {
  const { achievements, getCertificateUrl } = useAchievements()
  const { token } = useAuth()
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loadingScore, setLoadingScore] = useState(false)
  const [showFullProfile, setShowFullProfile] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)
    setShowFullProfile(false)

    if (!query.trim()) return

    // Search through verified achievements for the student
    const studentActs = achievements.filter(
      a => 
        (a.studentEmail && a.studentEmail.toLowerCase().includes(query.toLowerCase())) ||
        (a.studentName && a.studentName.toLowerCase().includes(query.toLowerCase())) ||
        (a.studentId && a.studentId.toLowerCase().includes(query.toLowerCase()))
    )

    if (studentActs.length === 0) {
      setError('No verified profile found for this student. They may not exist or have no approved records.')
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
      activitiesList: studentActs,
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
    <DashboardLayout title="Background Verification" subtitle="Verify trusted student achievement profiles directly from the institution">
      
   <Card className="p-0 mb-8 border-slate-200/60 shadow-sm overflow-hidden">
  <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Search size={20} strokeWidth={2.5} />
            </div>
            <div>
       <h3 className="text-lg font-bold text-slate-900 dark:text-white ">Student Lookup</h3>
       <p className="text-sm text-slate-500 dark:text-slate-400 ">Search by name, email, or institutional ID</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="flex-1 w-full">
              <Input
                placeholder="e.g. John Doe, CS2023001, john@student.edu"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full"
              />
              {error && <p className="text-rose-600 text-sm font-medium mt-2 flex items-center gap-1.5"><Search size={14}/>{error}</p>}
            </div>
            <Button type="submit" disabled={loadingScore} className="w-full sm:w-auto h-11 px-8 shadow-sm">
              {loadingScore ? 'Searching...' : 'Search Records'}
            </Button>
          </form>
        </div>
      </Card>

      {result && (
        <div className="grid lg:grid-cols-3 gap-8">
     <Card className="lg:col-span-2 p-0 overflow-hidden border-slate-200/60 shadow-sm">
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border-b border-teal-100 dark:border-teal-800/30 p-6 flex items-center gap-3">
              <ShieldCheck size={24} className="text-teal-600 dark:text-teal-400" />
              <h3 className="text-lg font-bold text-teal-900 dark:text-teal-400">Verified Institutional Profile</h3>
            </div>
            
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-6 mb-8">
    <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400 shrink-0">
                   <User size={32} />
                </div>
                <div className="space-y-1">
         <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white ">{result.name}</h2>
         <p className="text-slate-500 font-medium">ID: <span className="text-slate-700 dark:text-slate-300 ">{result.regNo}</span></p>
         <p className="text-slate-500 font-medium">Institution: <span className="text-slate-700 dark:text-slate-300 font-bold">{result.institution}</span></p>
                </div>
              </div>

       <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 ">
                <Button onClick={() => setShowFullProfile(!showFullProfile)} className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm">
                  <UserCheck size={18} className="mr-2" /> {showFullProfile ? 'Hide Profile' : 'View Full Profile'}
                </Button>
 <Button variant="secondary" onClick={handleDownload} className="shadow-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:text-white ">
                  <Download size={18} className="mr-2 text-slate-400" /> Download Latest Credential
                </Button>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
      <Card className="p-6 border-slate-200/60 dark:border-slate-800 shadow-sm relative overflow-hidden flex items-center gap-5">
              <div className="absolute -right-4 -bottom-4 text-emerald-50 dark:text-emerald-900/10 opacity-50"><Award size={100} /></div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 z-10">
                <Award size={28} />
              </div>
              <div className="z-10">
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Verified Activities</p>
        <p className="text-3xl font-extrabold text-slate-900 dark:text-white ">{result.verifiedActivities}</p>
              </div>
            </Card>

      <Card className="p-6 border-slate-200/60 dark:border-slate-800 shadow-sm relative overflow-hidden flex items-center gap-5">
              <div className="absolute -right-4 -bottom-4 text-blue-50 dark:text-blue-900/10 opacity-50"><BrainCircuit size={100} /></div>
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 z-10">
                <BrainCircuit size={28} />
              </div>
              <div className="z-10">
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">AI Growth Score</p>
        <p className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-baseline gap-1">
                  {result.aiScore} <span className="text-lg font-bold text-slate-400">/ 100</span>
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}

      {result && showFullProfile && (
        <Card className="mt-8 p-0 overflow-hidden border-slate-200/60 shadow-sm">
          <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Verified Activity Ledger</h3>
            <p className="text-sm text-slate-500">Institutionally verified records for {result.name}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/50 dark:bg-slate-900/20 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">Title</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {result.activitiesList.map(act => (
                  <tr key={act.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{act.title}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-500/20">
                        {act.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{new Date(act.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-500/20">
                        VERIFIED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </DashboardLayout>
  )
}
