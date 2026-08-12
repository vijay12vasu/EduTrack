import { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { USERS } from '../../data/dummyData'

export default function FacultyProfile() {
  const [form, setForm] = useState({
    name: USERS.faculty.name,
    department: USERS.faculty.department,
    facultyId: USERS.faculty.facultyId,
    email: USERS.faculty.email,
  })
  const [saved, setSaved] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <DashboardLayout title="Faculty Profile">
      <Card className="p-6 md:p-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5">
          <Input label="Name" value={form.name} onChange={set('name')} />
          <Input label="Department" value={form.department} onChange={set('department')} />
          <Input label="Faculty ID" value={form.facultyId} onChange={set('facultyId')} />
          <Input label="Email" type="email" value={form.email} onChange={set('email')} />

          <div className="sm:col-span-2">
            <Button type="submit">{saved ? 'Saved!' : 'Save Profile'}</Button>
          </div>
        </form>
      </Card>
    </DashboardLayout>
  )
}
