import { useState, useEffect } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'

export default function StudentProfile() {
  const { user, token } = useAuth()
  const [form, setForm] = useState({ fullName: '', email: '', role: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) return
    fetch('/api/users/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setForm({ 
            fullName: data.fullName || '', 
            email: data.email || '', 
            role: data.role || '',
            department: data.department || '',
            year: data.year || '',
            mobile: data.mobile || '',
            registerNumber: data.registerNumber || ''
          })
        }
      })
      .finally(() => setLoading(false))
  }, [token])

  const handleSave = async () => {
    if (!form.fullName.trim()) return
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          fullName: form.fullName,
          department: form.department,
          year: form.year,
          mobile: form.mobile,
          registerNumber: form.registerNumber
        })
      })
      if (res.ok) setMessage('Profile updated successfully.')
      else setMessage('Failed to update profile.')
    } catch {
      setMessage('Network error.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout title="Student Profile">
      <Card className="p-6 md:p-8 max-w-3xl">
        {loading ? (
          <div className="text-center py-10 text-slate-400">Loading profile...</div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            <Input label="Full Name" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
            <Input label="Email" type="email" value={form.email} readOnly className="bg-slate-50" />
            <Input label="Role" value={form.role} readOnly className="bg-slate-50" />
            <Input label="Register Number" value={form.registerNumber || ''} onChange={e => setForm({...form, registerNumber: e.target.value})} />
            <Input label="Department" value={form.department || ''} onChange={e => setForm({...form, department: e.target.value})} />
            <Input label="Year" value={form.year || ''} onChange={e => setForm({...form, year: e.target.value})} />
            <Input label="Mobile" type="tel" value={form.mobile || ''} onChange={e => setForm({...form, mobile: e.target.value})} />

            <div className="sm:col-span-2 flex items-center gap-4 mt-4">
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
              {message && <span className="text-sm text-green-600 font-medium">{message}</span>}
            </div>
          </div>
        )}
      </Card>
    </DashboardLayout>
  )
}
