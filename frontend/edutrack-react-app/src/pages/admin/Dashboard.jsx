import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import Button from '../../components/ui/Button'
import {
  ADMIN_STATS,
  DEPARTMENT_PARTICIPATION,
  ACTIVITY_BY_CATEGORY_ADMIN,
  MONTHLY_ACTIVITY_TREND,
} from '../../data/dummyData'

export default function AdminDashboard() {
  return (
    <DashboardLayout
      title="Admin Dashboard"
      subtitle="Manage users and monitor the EduTrack system"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Students"
          value={ADMIN_STATS.totalStudents}
          icon="T"
          color="blue"
        />

        <StatCard
          label="Total Activities"
          value={ADMIN_STATS.totalActivities}
          icon="A"
          color="blue"
        />

        <StatCard
          label="Verified Records"
          value={ADMIN_STATS.verifiedRecords}
          icon="V"
          color="green"
        />

        <StatCard
          label="Pending Verification"
          value={ADMIN_STATS.pendingVerification}
          icon="P"
          color="amber"
        />
      </div>

      <Card className="p-10 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-3">
          Welcome to EduTrack Administration
        </h2>

        <p className="text-slate-500 mb-8">
          The system is currently empty. Once users are created and students
          begin uploading achievements, analytics and reports will appear here.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="border rounded-xl p-5">
            <h3 className="font-semibold text-slate-800">
              Student Management
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              No students available.
            </p>
          </div>

          <div className="border rounded-xl p-5">
            <h3 className="font-semibold text-slate-800">
              Faculty Management
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              No faculty members available.
            </p>
          </div>

          <div className="border rounded-xl p-5">
            <h3 className="font-semibold text-slate-800">
              Employer Management
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              No employers registered.
            </p>
          </div>
        </div>

        <Button disabled>
          User Management Coming Soon
        </Button>
      </Card>
    </DashboardLayout>
  )
}