import { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Table, { Tr, Td } from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import { useAchievements } from '../../context/AchievementContext'
import { useNavigate } from 'react-router-dom'
import { Users, UserCheck, ArrowRight, Search } from 'lucide-react'
import { Input } from '../../components/ui/Input'

export default function VerifiedProfiles() {
  const { achievements } = useAchievements()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  // For employer, achievements are already filtered by VERIFIED if fetched through /api/activities/admin?status=VERIFIED
  // Group by student email/id
  const studentMap = {}
  achievements.forEach(a => {
    const key = a.studentId || a.studentEmail || 'unknown'
    if (!studentMap[key]) {
      studentMap[key] = { 
        count: 0, 
        id: a.studentId, 
        name: a.studentName || a.studentEmail || 'Unknown Student' 
      }
    }
    studentMap[key].count += 1
  })

  const rows = Object.values(studentMap).filter(r => {
    if (!searchQuery) return true
    return r.name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <DashboardLayout title="Verified Profiles" subtitle="Institution-verified student achievement profiles">
   <Card className="p-0 overflow-hidden border-slate-200/60 shadow-sm">
  <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Users size={20} strokeWidth={2.5} />
            </div>
            <div>
       <h3 className="text-lg font-bold text-slate-900 dark:text-white ">Accessible Profiles</h3>
       <p className="text-sm text-slate-500 dark:text-slate-400 ">Students with verified institutional records.</p>
            </div>
          </div>
      <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 ">{rows.length} records</span>
        </div>

        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <Input
            placeholder="Search by student name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 bg-white dark:bg-slate-900"
          />
        </div>

        {rows.length === 0 ? (
          <div className="p-10">
            <EmptyState 
              icon={UserCheck} 
              title={searchQuery ? 'No profiles found' : 'No verified profiles found'} 
              message={searchQuery ? `No verified profiles matching "${searchQuery}"` : "There are currently no students with fully verified institutional records available for viewing."}
            />
          </div>
        ) : (
          <Table columns={['Student Profile', 'Verified Activities', 'Action']}>
            {rows.map((student, i) => (
    <Tr key={student.id || i} striped={i % 2 === 1} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-900/50 transition-colors">
                <Td bold>
         <p className="font-bold text-slate-900 dark:text-white truncate max-w-[200px] lg:max-w-xs">{student.name}</p>
                </Td>
                <Td>
     <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-bold tracking-wide">
                    {student.count} {student.count === 1 ? 'Record' : 'Records'}
                  </span>
                </Td>
                <Td>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (student.id) navigate(`/employer/students/${student.id}`)
                    }}
                    className="text-teal-600 hover:bg-teal-50 py-1 px-3 h-auto"
                  >
                    View Details
                    <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                </Td>
              </Tr>
            ))}
          </Table>
        )}
      </Card>
    </DashboardLayout>
  )
}
