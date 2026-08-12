import { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { USERS } from '../../data/dummyData'

export default function RecruiterProfile() {
  const [form, setForm] = useState({
    companyName: USERS.employer.companyName,
    email: USERS.employer.email,
    recruiterName: USERS.employer.name,
    accessLevel: USERS.employer.accessLevel,
  })
  const [saved, setSaved] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <DashboardLayout title="Recruiter Profile">
      <Card className="p-6 md:p-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5">
          <Input label="Company Name" value={form.companyName} onChange={set('companyName')} />
          <Input label="Email" type="email" value={form.email} onChange={set('email')} />
          <Input label="Recruiter Name" value={form.recruiterName} onChange={set('recruiterName')} />
          <Input label="Access Level" value={form.accessLevel} onChange={set('accessLevel')} readOnly />

          <div className="sm:col-span-2">
            <Button type="submit">{saved ? 'Saved!' : 'Save Profile'}</Button>
          </div>
        </form>
      </Card>
    </DashboardLayout>
  )
}
