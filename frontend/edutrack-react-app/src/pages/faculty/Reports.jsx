import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import ProgressBar from '../../components/ui/ProgressBar'
import Table, { Tr, Td } from '../../components/ui/Table'
import { DEPARTMENT_VERIFICATION_SUMMARY, REPORT_HISTORY } from '../../data/dummyData'

export default function FacultyReports() {
  return (
    <DashboardLayout title="Faculty Reports" subtitle="Track your department's verification activity">
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-5">Department Verification Summary</h3>
          <div className="space-y-5">
            {DEPARTMENT_VERIFICATION_SUMMARY.map((p) => (
              <ProgressBar key={p.label} {...p} />
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Report History</h3>
          <Table columns={['Report', 'Date', 'Action']}>
            {REPORT_HISTORY.map((r) => (
              <Tr key={r.id}>
                <Td bold>{r.report}</Td>
                <Td>{r.date}</Td>
                <Td className="text-blue-600 font-semibold">{r.action}</Td>
              </Tr>
            ))}
          </Table>
        </Card>
      </div>

      <Button>Generate Faculty Report</Button>
    </DashboardLayout>
  )
}
