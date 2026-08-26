import { useState, useEffect } from 'react'
import { User, Mail, GraduationCap, Save, ShieldCheck, Hash } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'

export default function FacultyProfile() {
  const { user, token } = useAuth()
  const [form, setForm] = useState({ fullName: '', email: '', role: '', department: '', facultyId: '' })
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
            facultyId: data.facultyId || ''
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
          facultyId: form.facultyId
        })
      })
      if (res.ok) setMessage('Profile updated successfully.')
      else setMessage('Failed to update profile.')
    } catch {
      setMessage('Network error.')
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  return (
    <DashboardLayout 
      title="Faculty Profile" 
      subtitle="Manage your academic identity and department details"
    >
      <div className="max-w-4xl grid md:grid-cols-3 gap-6">
        
        {/* Identity Card */}
        <div className="md:col-span-1 space-y-6">
          <Card className="p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4 shadow-inner">
              <span className="text-3xl font-bold">{(form.fullName || 'F').charAt(0).toUpperCase()}</span>
            </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white ">{form.fullName || 'Faculty Member'}</h3>
            <span className="mt-1 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg border border-amber-200 uppercase tracking-wide">
              {form.role || 'FACULTY'}
            </span>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">{form.email}</p>
          </Card>
          
   <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 ">
      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold mb-2">
              <ShieldCheck size={18} className="text-blue-500" />
              Verified Reviewer
            </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your account has authorization to verify student achievements. Your name and department are visible on verified records.
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <Card className="md:col-span-2 p-0 overflow-hidden">
     <div className="p-6 md:p-8 bg-white dark:bg-slate-900 ">
            {loading ? (
              <div className="text-center py-10 text-slate-400 font-medium">Loading profile...</div>
            ) : (
              <div className="space-y-8">
                
                {message && (
                  <div className={`p-4 rounded-xl text-sm font-semibold shadow-sm ${message.includes('success') ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                    {message}
                  </div>
                )}

                {/* Personal Section */}
                <section>
         <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <User size={16} className="text-slate-400" /> Personal Details
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input 
                      label="Full Name" 
                      value={form.fullName} 
                      onChange={e => setForm({...form, fullName: e.target.value})} 
                    />
                    <div className="relative">
                      <Input 
                        label="Email Address" 
                        type="email" 
                        value={form.email} 
                        readOnly 
      className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 cursor-not-allowed pl-10" 
                      />
                      <Mail size={16} className="absolute bottom-3 left-4 text-slate-400" />
                    </div>
                  </div>
                </section>

        <hr className="border-slate-100 dark:border-slate-800 " />

                {/* Academic Section */}
                <section>
         <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <GraduationCap size={16} className="text-slate-400" /> Academic Information
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="relative">
                      <Input 
                        label="Faculty ID" 
                        value={form.facultyId || ''} 
                        onChange={e => setForm({...form, facultyId: e.target.value})} 
                        className="pl-10"
                      />
                      <Hash size={16} className="absolute bottom-3 left-4 text-slate-400" />
                    </div>
                    <Input 
                      label="Department" 
                      value={form.department || ''} 
                      onChange={e => setForm({...form, department: e.target.value})} 
                    />
                  </div>
                </section>

              </div>
            )}
          </div>
          
   <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
            <Button onClick={handleSave} disabled={saving} className="px-8 shadow-sm">
              <Save size={18} />
              {saving ? 'Saving Profile...' : 'Save Changes'}
            </Button>
          </div>
        </Card>

      </div>
    </DashboardLayout>
  )
}
