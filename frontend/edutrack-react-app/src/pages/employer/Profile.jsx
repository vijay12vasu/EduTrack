import { useState, useEffect } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'

export default function EmployerProfile() {
  const { user, token } = useAuth()
  const [form, setForm] = useState({ companyName: 'EduTrack Partner', email: '', recruiterName: '', accessLevel: 'Read Only (Verified)' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) return
    fetch('/api/users/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setForm(f => ({ ...f, recruiterName: data.fullName || '', email: data.email || '', companyName: data.company || 'EduTrack Partner' }))
        }
      })
      .finally(() => setLoading(false))
  }, [token])

  const handleSave = async () => {
    if (!form.recruiterName.trim()) return
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          fullName: form.recruiterName,
          company: form.companyName
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
    <DashboardLayout title="Recruiter Profile">
      <Card className="p-6 md:p-8 max-w-3xl">
        {loading ? (
          <div className="text-center py-10 text-slate-400">Loading profile...</div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            <Input label="Company Name" value={form.companyName} onChange={e => setForm({...form, companyName: e.target.value})} />
            <Input label="Email" type="email" value={form.email} readOnly className="bg-slate-50" />
            <Input label="Recruiter Name" value={form.recruiterName} onChange={e => setForm({...form, recruiterName: e.target.value})} />
            <Input label="Access Level" value={form.accessLevel} readOnly className="bg-slate-50" />

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
