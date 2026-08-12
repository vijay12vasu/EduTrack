import { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import Table, { Tr, Td } from '../../components/ui/Table'
import { STUDENT_LIST } from '../../data/dummyData'

export default function ManageStudents() {
  const [students, setStudents] = useState(STUDENT_LIST)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', regNo: '', department: '', year: '' })

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const addStudent = (e) => {
    e.preventDefault()
    if (!form.name || !form.regNo) return
    setStudents((s) => [...s, { id: `st-${Date.now()}`, status: 'Active', ...form }])
    setForm({ name: '', regNo: '', department: '', year: '' })
    setOpen(false)
  }

  return (
    <DashboardLayout
      title="Manage Students"
      action={<Button onClick={() => setOpen(true)}>Add Student</Button>}
    >
      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Student List</h3>
        <Table columns={['Name', 'Reg No', 'Department', 'Year', 'Status']}>
          {students.map((s, i) => (
            <Tr key={s.id} striped={i % 2 === 1}>
              <Td bold>{s.name}</Td>
              <Td>{s.regNo}</Td>
              <Td>{s.department}</Td>
              <Td>{s.year}</Td>
              <Td><span className="text-green-600 font-semibold">{s.status}</span></Td>
            </Tr>
          ))}
        </Table>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)}>
        <h3 className="text-xl font-bold text-slate-900 mb-5">Add Student</h3>
        <form onSubmit={addStudent} className="space-y-4">
          <Input label="Name" value={form.name} onChange={set('name')} required />
          <Input label="Register Number" value={form.regNo} onChange={set('regNo')} required />
          <Input label="Department" value={form.department} onChange={set('department')} />
          <Input label="Year" value={form.year} onChange={set('year')} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">Add Student</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
