import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Table, { Tr, Td } from '../../components/ui/Table'
import { REPORT_TYPES, DOWNLOADED_REPORTS } from '../../data/dummyData'

export default function StudentReports() {
  return (
    <DashboardLayout title="Student Reports" subtitle="Download profile and verified achievement reports">
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {REPORT_TYPES.map((r) => (
          <Card key={r.id} className="p-6 flex flex-col gap-4">
            <div>
              <h4 className="font-bold text-slate-900 mb-1">{r.name}</h4>
              <p className="text-sm text-slate-500">{r.description}</p>
            </div>
            <Button variant="secondary" className="mt-auto">
              Select {r.name.replace(' Report', '')} Report
            </Button>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Downloaded Reports</h3>
        <Table columns={['Report', 'Date', 'Status', 'Action']}>
          {DOWNLOADED_REPORTS.map((r) => (
            <Tr key={r.id}>
              <Td bold>{r.report}</Td>
              <Td>{r.date}</Td>
              <Td>
                <span className="text-green-600 font-semibold">{r.status}</span>
              </Td>
              <Td className="text-blue-600 font-semibold">{r.action}</Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </DashboardLayout>
  )
}
