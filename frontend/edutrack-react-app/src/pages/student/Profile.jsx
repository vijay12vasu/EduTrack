import { useState, useEffect } from 'react'
import { User, Mail, GraduationCap, Phone, Hash, Save, ShieldCheck } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'

export default function StudentProfile() {
  const { user, token } = useAuth()
  const [form, setForm] = useState({ fullName: '', email: '', role: '', department: '', year: '', mobile: '', registerNumber: '' })
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
      setTimeout(() => setMessage(''), 3000)
    }
  }

  return (
    <DashboardLayout 
      title="Student Profile" 
      subtitle="Manage your personal identity and academic information"
    >
      <div className="max-w-4xl grid md:grid-cols-3 gap-6">
        
        {/* Identity Card */}
        <div className="md:col-span-1 space-y-6">
          <Card className="p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 shadow-inner">
              <span className="text-3xl font-bold">{(form.fullName || 'S').charAt(0).toUpperCase()}</span>
            </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white ">{form.fullName || 'Student'}</h3>
            <span className="mt-1 px-3 py-1 bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 text-xs font-bold rounded-lg border border-teal-200 dark:border-teal-500/20 uppercase tracking-wide">
              {form.role || 'STUDENT'}
            </span>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">{form.email}</p>
          </Card>
          
   <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 ">
      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold mb-2">
              <ShieldCheck size={18} className="text-indigo-500" />
              Verified Identity
            </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your name and register number must match your official university ID. These details are visible to faculty when verifying your achievements.
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
                  <div className={`p-4 rounded-xl text-sm font-semibold shadow-sm ${message.includes('success') ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/20' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'}`}>
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
                    <div className="relative">
                      <Input 
                        label="Mobile Number" 
                        type="tel" 
                        value={form.mobile || ''} 
                        onChange={e => setForm({...form, mobile: e.target.value})} 
                        className="pl-10"
                      />
                      <Phone size={16} className="absolute bottom-3 left-4 text-slate-400" />
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
                        label="Register Number" 
                        value={form.registerNumber || ''} 
                        onChange={e => setForm({...form, registerNumber: e.target.value})} 
                        className="pl-10"
                      />
                      <Hash size={16} className="absolute bottom-3 left-4 text-slate-400" />
                    </div>
                    <Input 
                      label="Department" 
                      value={form.department || ''} 
                      onChange={e => setForm({...form, department: e.target.value})} 
                    />
                    <Input 
                      label="Year / Semester" 
                      value={form.year || ''} 
                      onChange={e => setForm({...form, year: e.target.value})} 
                      placeholder="e.g. 3rd Year"
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
