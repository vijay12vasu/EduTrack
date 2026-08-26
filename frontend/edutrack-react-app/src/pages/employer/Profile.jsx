import { useState, useEffect } from 'react'
import { Building2, Mail, User, ShieldCheck, Save } from 'lucide-react'
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
      setTimeout(() => setMessage(''), 3000)
    }
  }

  return (
    <DashboardLayout 
      title="Recruiter Profile" 
      subtitle="Manage your company details and access level"
    >
      <div className="max-w-4xl grid md:grid-cols-3 gap-6">
        
        {/* Identity Card */}
        <div className="md:col-span-1 space-y-6">
          <Card className="p-6 flex flex-col items-center text-center">
   <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center mb-4 shadow-inner">
              <span className="text-3xl font-bold">{(form.companyName || 'C').charAt(0).toUpperCase()}</span>
            </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white ">{form.companyName}</h3>
  <span className="mt-1 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 uppercase tracking-wide">
              EMPLOYER
            </span>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">{form.email}</p>
          </Card>
          
   <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 ">
      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold mb-2">
              <ShieldCheck size={18} className="text-emerald-500" />
              Verified Access
            </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              You have authorized read-only access to institutionally verified student records and AI growth scores.
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

                {/* Details Section */}
                <section>
         <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Building2 size={16} className="text-slate-400" /> Company Information
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input 
                      label="Company Name" 
                      value={form.companyName} 
                      onChange={e => setForm({...form, companyName: e.target.value})} 
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

                <section>
         <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <User size={16} className="text-slate-400" /> Representative Details
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input 
                      label="Recruiter Name" 
                      value={form.recruiterName} 
                      onChange={e => setForm({...form, recruiterName: e.target.value})} 
                    />
                    <div className="relative">
                      <Input 
                        label="Access Level" 
                        value={form.accessLevel} 
                        readOnly 
      className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 cursor-not-allowed pl-10" 
                      />
                      <ShieldCheck size={16} className="absolute bottom-3 left-4 text-slate-400" />
                    </div>
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
