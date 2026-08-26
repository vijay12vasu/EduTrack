import { useState } from 'react'
import { FileText, Download, CheckCircle, PieChart, Activity, Target, Layers } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Select } from '../../components/ui/Input'
import Table, { Tr, Td } from '../../components/ui/Table'
import EmptyState from '../../components/ui/EmptyState'
import { useAchievements } from '../../context/AchievementContext'

function formatDate(date) {
  const parsed = new Date(date)
  if (isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
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

  const approvalRate = achievements.length > 0 ? Math.round((verified.length / achievements.length) * 100) : 0

  return (
    <DashboardLayout 
      title="Academic Reports" 
      subtitle="Analyze your verified performance and generate compliance documents"
    >
      
      {/* Metric Blocks */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        
        <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none"><CheckCircle size={100} className="text-slate-900 dark:text-white" /></div>
          
          <div className="relative z-10 flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 flex items-center justify-center border border-indigo-100 dark:border-indigo-500/30">
               <Activity size={20} />
            </div>
            <h4 className="font-bold text-slate-500 dark:text-slate-300 uppercase tracking-widest text-xs">Total Verified</h4>
          </div>
          
          <div className="relative z-10">
            <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{verified.length}</p>
            <p className="text-sm font-medium text-slate-500 dark:text-indigo-200 mt-2">Institutionally approved records</p>
          </div>
        </Card>
        
        <Card className="p-6 bg-teal-50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-800/30 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none"><Layers size={100} className="text-teal-900 dark:text-teal-400" /></div>
          
          <div className="relative z-10 flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
               <PieChart size={20} />
            </div>
            <h4 className="font-bold text-teal-800 dark:text-teal-400 uppercase tracking-widest text-xs">Categories Covered</h4>
          </div>
          
          <div className="relative z-10">
            <p className="text-5xl font-black text-teal-900 tracking-tighter">{Object.keys(categoriesMap).length}</p>
            <p className="text-sm font-bold text-teal-600/70 mt-2">Unique skill domains demonstrated</p>
          </div>
        </Card>
        
        <Card className="p-6 bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800/30 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none"><Target size={100} className="text-violet-900 dark:text-violet-400" /></div>
          
          <div className="relative z-10 flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center">
               <Target size={20} />
            </div>
            <h4 className="font-bold text-violet-800 dark:text-violet-400 uppercase tracking-widest text-xs">Approval Rate</h4>
          </div>
          
          <div className="relative z-10 flex items-baseline gap-2">
            <p className="text-5xl font-black text-violet-900 tracking-tighter">{approvalRate}</p>
            <span className="text-2xl font-bold text-violet-400">%</span>
          </div>
          <p className="text-sm font-bold text-violet-600/70 mt-2 relative z-10">Of all submitted activities</p>
        </Card>
        
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Log */}
        <div className="lg:col-span-2 space-y-8">
     <Card className="p-0 overflow-hidden border-slate-200/60 shadow-sm flex flex-col h-full">
   <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center">
              <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
         <h3 className="text-lg font-bold text-slate-900 dark:text-white ">Verified Activity Ledger</h3>
         <p className="text-xs font-medium text-slate-500 dark:text-slate-400 ">Only verified records are included in reports</p>
                </div>
              </div>
            </div>
            
      <div className="flex-1 bg-white dark:bg-slate-900 ">
              {verified.length === 0 ? (
                <div className="p-10 h-full flex flex-col justify-center">
                  <EmptyState 
                    icon={CheckCircle} 
                    title="No verified activities yet" 
                    message="Activities must be approved by faculty before they appear in your official compliance reports."
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table columns={['Activity Name', 'Category', 'Date Verified']}>
                    {verified.map((r, i) => (
      <Tr key={r.id} striped={i % 2 === 1} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-900/50 transition-colors">
                        <Td bold>
             <p className="truncate max-w-[200px] sm:max-w-xs text-slate-900 dark:text-white ">{r.title || r.activity}</p>
                        </Td>
                        <Td>
    <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-[11px] font-bold tracking-wider uppercase">
                            {r.category}
                          </span>
                        </Td>
            <Td><span className="text-slate-500 dark:text-slate-400 font-medium">{formatDate(r.date)}</span></Td>
                      </Tr>
                    ))}
                  </Table>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar Actions & Stats */}
        <div className="space-y-6">
          
     <Card className="p-0 border-slate-200/60 shadow-sm overflow-hidden">
             <div className="bg-indigo-50 dark:bg-indigo-900/10 border-b border-indigo-100 dark:border-indigo-800/30 p-5 flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                 <Download size={20} />
               </div>
               <div>
         <h3 className="text-base font-bold text-slate-900 dark:text-white ">Document Export</h3>
         <p className="text-xs font-medium text-slate-500 dark:text-slate-400 ">Generate compliance PDFs</p>
               </div>
             </div>
             
       <div className="p-6 bg-white dark:bg-slate-900 space-y-5">
               {reportError && (
                 <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 text-sm font-semibold border border-rose-200 dark:border-rose-500/20">
                   {reportError}
                 </div>
               )}

               <Select
                 label="Report Template"
                 value={reportType}
                 onChange={(e) => setReportType(e.target.value)}
         className="w-full bg-slate-50 dark:bg-slate-900/50 "
               >
                 <option value="profile">Student Profile Overview</option>
                 <option value="naac">NAAC Compliance Format</option>
                 <option value="nba">NBA Compliance Format</option>
               </Select>

               <Button 
                 onClick={downloadReport}
                 disabled={downloading}
                 className="w-full py-3 h-auto text-sm font-bold shadow-sm bg-slate-900 hover:bg-slate-800 text-white transition-all"
               >
                 {downloading ? 'Generating PDF...' : 'Download Official Report'}
               </Button>
               
  <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 ">
         <strong className="text-slate-700 dark:text-slate-300 block mb-1">Authenticity Note:</strong>
                 Reports generated through EduTrack contain only activities that have been officially verified by faculty.
               </div>
             </div>
          </Card>

     <Card className="p-0 border-slate-200/60 shadow-sm overflow-hidden">
   <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 p-5">
       <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Distribution Overview</h3>
            </div>
      <div className="p-6 bg-white dark:bg-slate-900 ">
               {Object.keys(categoriesMap).length === 0 ? (
         <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No verified data to distribute.</p>
               ) : (
                 <div className="space-y-4">
                   {Object.entries(categoriesMap)
                     .sort((a, b) => b[1] - a[1])
                     .map(([cat, count]) => {
                       const percentage = Math.round((count / verified.length) * 100)
                       return (
                         <div key={cat} className="group">
                           <div className="flex items-center justify-between text-xs font-bold mb-1.5">
               <span className="text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate pr-2">{cat}</span>
               <span className="text-slate-500 dark:text-slate-400 shrink-0">{count} ({percentage}%)</span>
                           </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                             <div 
                               className="bg-indigo-500 h-full rounded-full transition-all duration-1000 ease-out" 
                               style={{ width: `${percentage}%` }} 
                             />
                           </div>
                         </div>
                       )
                   })}
                 </div>
               )}
            </div>
          </Card>

        </div>
      </div>
    </DashboardLayout>
  )
}
