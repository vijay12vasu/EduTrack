import { useState, useEffect } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import Table, { Tr, Td } from '../../components/ui/Table'
import { useAuth } from '../../context/AuthContext'
import { ChevronDown } from 'lucide-react'

import { useNavigate } from 'react-router-dom'

const ROLES = ['STUDENT', 'FACULTY', 'ADMIN', 'EMPLOYER']

export default function ManageStudents() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [menuOpen, setMenuOpen] = useState(false)
  const { token } = useAuth()
  
  // Registration form
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'STUDENT', registerNumber: '', department: '', year: '', mobile: '' })
  const [regError, setRegError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchUsers = () => {
    if (!token) return
    setLoading(true)
    let endpoint = '/api/users/admin/all'
    if (filter !== 'ALL') {
       endpoint = `/api/users/admin/${filter.toLowerCase()}s`
       if (filter === 'FACULTY') endpoint = '/api/users/admin/faculty'
    }

    fetch(endpoint, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch users. Ensure you have Admin privileges.')
        return res.json()
      })
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchUsers()
  }, [token, filter])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const addUser = async (e) => {
    e.preventDefault()
    setRegError('')
    setIsSubmitting(true)
    
    try {
      const endpoint = form.role === 'STUDENT' ? '/api/users/admin/students' : '/api/users/admin/create';
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Failed to create user')
      }

      setOpen(false)
      setForm({ fullName: '', email: '', password: '', role: 'STUDENT', registerNumber: '', department: '', year: '', mobile: '' })
      fetchUsers() // Refresh list
    } catch (err) {
      setRegError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout
      title="Manage Users"
      subtitle="Create and view platform users"
      action={
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Role: {filter}
              <ChevronDown size={16} className="text-slate-400" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg border border-slate-100 shadow-card overflow-hidden z-10">
                {['ALL', ...ROLES].map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setFilter(f)
                      setMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button onClick={() => setOpen(true)}>Add User</Button>
        </div>
      }
    >
      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">User List</h3>
        {loading ? (
          <div className="text-center py-10 text-slate-400">Loading users...</div>
        ) : (
          <Table columns={['Name', 'Email', 'Role', 'Action']}>
            {users.map((s, i) => (
              <Tr key={s.id} striped={i % 2 === 1}>
                <Td bold>{s.fullName}</Td>
                <Td>{s.email}</Td>
                <Td>
                  <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-semibold">
                    {s.role}
                  </span>
                </Td>
                <Td>
                  <button 
                    onClick={() => navigate(`/admin/users/${s.id}`)}
                    className="text-blue-600 hover:underline font-medium text-sm"
                  >
                    View
                  </button>
                </Td>
              </Tr>
            ))}
            {users.length === 0 && !error && (
              <Tr>
                <Td colSpan={4} className="text-center py-10 text-slate-400">No users found.</Td>
              </Tr>
            )}
          </Table>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)}>
        <h3 className="text-xl font-bold text-slate-900 mb-5">Add New User</h3>
        
        {regError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {regError}
          </div>
        )}
        
        <form onSubmit={addUser} className="space-y-4">
          <Input label="Full Name" value={form.fullName} onChange={set('fullName')} required />
          <Input label="Email" type="email" value={form.email} onChange={set('email')} required />
          <Input label="Password" type="password" value={form.password} onChange={set('password')} required minLength={8} />
          
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1.5">Role</label>
            <select
              value={form.role}
              onChange={set('role')}
              className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all border"
            >
              {ROLES.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {form.role === 'STUDENT' && (
            <>
              <Input label="Register Number" value={form.registerNumber} onChange={set('registerNumber')} required />
              <Input label="Department" value={form.department} onChange={set('department')} required />
              <Input label="Year" value={form.year} onChange={set('year')} required placeholder="e.g. 1st Year, 2nd Year" />
              <Input label="Mobile (Optional)" type="tel" value={form.mobile} onChange={set('mobile')} />
            </>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
