import { useState, useEffect } from 'react'
import { Users, UserPlus } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { Input, Select } from '../../components/ui/Input'
import Table, { Tr, Td } from '../../components/ui/Table'
import EmptyState from '../../components/ui/EmptyState'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useNavigate } from 'react-router-dom'

const ROLES = ['STUDENT', 'FACULTY', 'ADMIN', 'EMPLOYER']

export default function ManageStudents() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const { token } = useAuth()
  const { addToast } = useToast()
  
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
      addToast('User provisioned successfully', 'success')
      fetchUsers()
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredUsers = users.filter(u => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (u.fullName?.toLowerCase() || '').includes(q) || (u.email?.toLowerCase() || '').includes(q)
  })

  return (
    <DashboardLayout
      title="User Management"
      subtitle="View, manage, and provision accounts across the EduTrack system."
      action={
        <div className="flex items-center gap-4">
          <Input 
            placeholder="Search users..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 lg:w-64 bg-white dark:bg-slate-900"
          />
          <Select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
   className="w-32 lg:w-40 py-2.5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 "
          >
            <option value="ALL">All Roles</option>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </Select>
          <Button onClick={() => setOpen(true)}>
            <UserPlus size={18} />
            Add User
          </Button>
        </div>
      }
    >
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm font-semibold text-rose-700 shadow-sm">
          {error}
        </div>
      )}

   <Card className="p-0 overflow-hidden border-slate-200/60 shadow-sm">
  <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
     <h3 className="text-lg font-bold text-slate-900 dark:text-white ">Registered Users</h3>
     <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 ">{users.length} total</span>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton variant="circular" className="w-9 h-9 shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" className="w-1/4 h-3" />
                  <Skeleton variant="text" className="w-1/3 h-3" />
                </div>
                <Skeleton variant="rectangular" className="w-20 h-6" />
              </div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={Users} title="No users found" message={searchQuery ? `No users matching "${searchQuery}"` : `There are no users matching the ${filter} role filter.`} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table columns={['User', 'Role', 'System Status', 'Action']}>
              {filteredUsers.map((s, i) => (
      <Tr key={s.id} striped={i % 2 === 1} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-900/50 transition-colors">
                  <Td bold>
                    <div className="flex items-center gap-3">
       <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold text-sm shrink-0">
                        {(s.fullName || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
             <p className="font-bold text-slate-900 dark:text-white truncate">{s.fullName}</p>
             <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">{s.email}</p>
                      </div>
                    </div>
                  </Td>
                  <Td>
       <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-bold tracking-wide">
                      {s.role}
                    </span>
                  </Td>
                  <Td>
                    <Badge status="Active" />
                  </Td>
                  <Td>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/admin/users/${s.id}`)}
                      className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                    >
                      Manage Profile
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Table>
          </div>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="mb-6">
     <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Provision User</h3>
     <p className="text-sm text-slate-500 dark:text-slate-400 ">Create a new institutional account.</p>
        </div>
        
        {/* removed inline regError since we use toast */}
        
        <form onSubmit={addUser} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Full Name" value={form.fullName} onChange={set('fullName')} required />
            <Select label="System Role" value={form.role} onChange={set('role')}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </Select>
          </div>
          
          <Input label="Email Address" type="email" value={form.email} onChange={set('email')} required />
          <Input label="Temporary Password" type="password" value={form.password} onChange={set('password')} required minLength={8} />

          {form.role === 'STUDENT' && (
   <div className="p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 space-y-4 mt-2">
       <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 ">Student Details</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Register Number" value={form.registerNumber} onChange={set('registerNumber')} required />
                <Input label="Department" value={form.department} onChange={set('department')} required />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Year" value={form.year} onChange={set('year')} required placeholder="e.g. 1st Year" />
                <Input label="Mobile (Optional)" type="tel" value={form.mobile} onChange={set('mobile')} />
              </div>
            </div>
          )}

     <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Provisioning...' : 'Create Account'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
