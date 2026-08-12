import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'

const TAGS = ['Read-only access', 'Verified credentials', 'AI profile score']

export default function AboutEduTrack() {
  return (
    <DashboardLayout title="About EduTrack">
      <Card className="p-6 md:p-8 max-w-2xl">
        <h3 className="text-lg font-bold text-slate-900 mb-3">Trusted Student Achievement Verification</h3>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          EduTrack provides institution-verified achievement profiles. Recruiters can view
          only approved records, approval score, and downloadable credentials. This improves
          trust during placement and recruitment.
        </p>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((t) => (
            <span
              key={t}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600"
            >
              {t}
            </span>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  )
}
