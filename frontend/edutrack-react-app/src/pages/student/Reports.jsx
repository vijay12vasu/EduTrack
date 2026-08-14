import { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Table, { Tr, Td } from '../../components/ui/Table'
import { useAchievements } from '../../context/AchievementContext'

function formatDate(date) {
  const parsed = new Date(date)
  if (isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

export default function StudentReports() {
  const { achievements } = useAchievements()
  
  const verified = achievements.filter(a => a.status === 'Verified')
  
  const categoriesMap = {}
  verified.forEach(a => {
    if (!categoriesMap[a.category]) categoriesMap[a.category] = 0
    categoriesMap[a.category] += 1
  })

  const [reportError, setReportError] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [reportType, setReportType] = useState('profile')

  const downloadReport = async () => {
    try {
      setDownloading(true)
      setReportError('')
      const token = localStorage.getItem('edutrack_token');
      const res = await fetch(`/api/activities/reports/student?type=${reportType}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to generate PDF');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `EduTrack_Report_${reportType}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setReportError(e.message);
    } finally {
      setDownloading(false)
    }
  }

  return (
    <DashboardLayout title="Achievement Report" subtitle="Your official verified activity record">
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6 bg-blue-50/50 border-blue-100">
          <h4 className="font-bold text-slate-700 mb-2">Total Verified</h4>
          <p className="text-4xl font-extrabold text-blue-600">{verified.length}</p>
        </Card>
        <Card className="p-6 bg-green-50/50 border-green-100">
          <h4 className="font-bold text-slate-700 mb-2">Unique Categories</h4>
          <p className="text-4xl font-extrabold text-green-600">{Object.keys(categoriesMap).length}</p>
        </Card>
        <Card className="p-6 bg-purple-50/50 border-purple-100">
          <h4 className="font-bold text-slate-700 mb-2">Completion Status</h4>
          <p className="text-4xl font-extrabold text-purple-600">
            {achievements.length > 0 ? Math.round((verified.length / achievements.length) * 100) : 0}%
          </p>
        </Card>
      </div>

      <Card className="p-6 mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Category Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {Object.keys(categoriesMap).length === 0 ? (
              <p className="text-sm text-slate-500 col-span-4">No verified activities to summarize.</p>
           ) : Object.keys(categoriesMap).map(cat => (
             <div key={cat} className="p-4 border border-slate-100 rounded-lg">
               <div className="text-sm text-slate-500">{cat}</div>
               <div className="text-xl font-bold text-slate-800">{categoriesMap[cat]} items</div>
             </div>
           ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900">Verified Activity Log</h3>
          <div className="flex items-center gap-3">
            {reportError && <span className="text-red-500 text-sm font-semibold">{reportError}</span>}
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="text-sm rounded border-slate-200 bg-slate-50 px-3 py-1.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="profile">Student Profile Report</option>
              <option value="naac">NAAC Report</option>
              <option value="nba">NBA Report</option>
            </select>
            <button 
              onClick={downloadReport}
              disabled={downloading}
              className="text-sm text-blue-600 font-semibold bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100 disabled:opacity-50"
            >
              {downloading ? 'Downloading...' : 'Download PDF Report'}
            </button>
          </div>
        </div>
        
        {verified.length === 0 ? (
          <div className="py-10 text-center text-slate-500">
            You don't have any verified achievements yet.
          </div>
        ) : (
          <Table columns={['Activity Name', 'Category', 'Date Verified']}>
            {verified.map((r, i) => (
              <Tr key={r.id} striped={i % 2 === 1}>
                <Td bold>{r.title || r.activity}</Td>
                <Td>{r.category}</Td>
                <Td>{formatDate(r.date)}</Td>
              </Tr>
            ))}
          </Table>
        )}
      </Card>
    </DashboardLayout>
  )
}
