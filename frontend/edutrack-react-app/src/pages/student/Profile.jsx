import { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { USERS } from '../../data/dummyData'

export default function StudentProfile() {
  const [form, setForm] = useState({
    fullName: USERS.student.name,
    department: USERS.student.department,
    regNo: USERS.student.regNo,
    year: USERS.student.year,
    email: USERS.student.email,
    mobile: USERS.student.mobile,
  })
  const [saved, setSaved] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <DashboardLayout title="Student Profile">
      <Card className="p-6 md:p-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5">
          <Input label="Full Name" value={form.fullName} onChange={set('fullName')} />
          <Input label="Department" value={form.department} onChange={set('department')} />
          <Input label="Register Number" value={form.regNo} onChange={set('regNo')} />
          <Input label="Year" value={form.year} onChange={set('year')} />
          <Input label="Email" type="email" value={form.email} onChange={set('email')} />
          <Input label="Mobile" value={form.mobile} onChange={set('mobile')} />

          <div className="sm:col-span-2">
            <Button type="submit">{saved ? 'Saved!' : 'Save Profile'}</Button>
          </div>
        </form>
      </Card>
    </DashboardLayout>
  )
}
