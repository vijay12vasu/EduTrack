import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import ProgressBar from '../../components/ui/ProgressBar'
import { STUDENT_STATS, PROGRESS_BY_CATEGORY, RECOMMENDATIONS } from '../../data/dummyData'

export default function AIScore() {
  return (
    <DashboardLayout title="AI Score & Recommendations" subtitle="Holistic analysis of verified achievements">
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="p-6 flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Overall Score</h3>
          <div className="flex-1 flex items-center justify-center py-4">
            <div className="w-44 h-44 rounded-full bg-blue-50 flex flex-col items-center justify-center">
              <span className="text-5xl font-extrabold text-blue-600">{STUDENT_STATS.aiScore}</span>
              <span className="text-sm text-slate-400">/100</span>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Category Analysis</h3>
          <div className="space-y-5">
            {PROGRESS_BY_CATEGORY.map((p) => (
              <ProgressBar key={p.label} {...p} />
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Recommendations for Improvement</h3>
        <ul className="space-y-3">
          {RECOMMENDATIONS.map((r) => (
            <li key={r} className="flex gap-2 text-sm text-slate-700">
              <span className="text-slate-400">–</span>
              {r}
            </li>
          ))}
        </ul>
      </Card>
    </DashboardLayout>
  )
}
