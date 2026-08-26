import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Table, { Tr, Td } from '../../components/ui/Table'
import EmptyState from '../../components/ui/EmptyState'
import { useAchievements } from '../../context/AchievementContext'
import { Clock, CheckCircle, XCircle, FileSearch } from 'lucide-react'

function MetricBlock({ title, value, icon: Icon, bgClass, colorClass }) {
  return (
    <div className={`p-4 rounded-2xl border ${bgClass} flex items-center justify-between shadow-sm`}>
      <div>
    <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{value}</p>
    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mt-1">{title}</p>
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
        <Icon size={20} strokeWidth={2.5} />
      </div>
    </div>
  )
}

export default function Verifications() {
  const { achievements, loading } = useAchievements()

  const pending = achievements.filter(a => a.status === 'Pending').length
  const verified = achievements.filter(a => a.status === 'Verified').length
  const rejected = achievements.filter(a => a.status === 'Rejected').length

  const auditRecords = achievements.filter(a => a.status !== 'Pending')

  return (
    <DashboardLayout title="Verifications Overview" subtitle="Institution-wide verification status">
      <div className="grid grid-cols-3 gap-4 mb-8">
        <MetricBlock label="Pending" title="Pending" value={pending} icon={Clock} bgClass="bg-amber-50/40 border-amber-100" colorClass="bg-amber-100 text-amber-600" />
        <MetricBlock label="Approved" title="Approved" value={verified} icon={CheckCircle} bgClass="bg-teal-50/40 border-teal-100" colorClass="bg-teal-100 text-teal-600" />
        <MetricBlock label="Rejected" title="Rejected" value={rejected} icon={XCircle} bgClass="bg-rose-50/40 border-rose-100" colorClass="bg-rose-100 text-rose-600" />
      </div>

   <Card className="p-0 overflow-hidden border-slate-200/60 shadow-sm">
  <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
     <h3 className="text-lg font-bold text-slate-900 dark:text-white ">Verification Audit</h3>
     <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 ">{auditRecords.length} records</span>
        </div>
        
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading audit log...</div>
        ) : auditRecords.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={FileSearch} title="Audit is clean" message="No verified or rejected records to display." />
          </div>
        ) : (
          <Table columns={['Activity', 'Student', 'Verified By', 'Status']}>
            {auditRecords.map((v, i) => (
    <Tr key={v.id} striped={i % 2 === 1} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-900/50 ">
                <Td bold>{v.title}</Td>
                <Td>
                  <div className="flex items-center gap-2">
     <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {(v.studentName || v.studentEmail || 'S').charAt(0).toUpperCase()}
                    </div>
          <span className="text-sm text-slate-700 dark:text-slate-300 ">{v.studentName || v.studentEmail || '—'}</span>
                  </div>
                </Td>
        <Td><span className="text-slate-500 dark:text-slate-400 font-medium">{v.verifierName || '—'}</span></Td>
                <Td>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide ${v.status === 'Verified' ? 'bg-teal-50 text-teal-700 border border-teal-200/60' : 'bg-rose-50 text-rose-700 border border-rose-200/60'}`}>
                    {v.status}
                  </span>
                </Td>
              </Tr>
            ))}
          </Table>
        )}
      </Card>
    </DashboardLayout>
  )
}
