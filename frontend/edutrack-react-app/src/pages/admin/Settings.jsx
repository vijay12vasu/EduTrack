import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Save, Shield, FileText, Database, UserCheck } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'

export default function Settings() {
  const { token } = useAuth()
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (token) {
      fetch('/api/users/admin/settings', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load settings')
        return res.json()
      })
      .then(data => {
        setSettings(data)
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
    }
  }, [token])

  const handleSave = async () => {
    if (!settings) return
    setSaving(true)
    setError('')
    setSuccessMsg('')
    try {
      const res = await fetch('/api/users/admin/settings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(settings)
      })
      if (!res.ok) throw new Error('Failed to save settings')
      setSuccessMsg('Settings saved successfully!')
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const toggle = (field) => {
    setSettings(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handleTextChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  return (
    <DashboardLayout title="System Configuration" subtitle="Manage institutional platform parameters">
      
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm font-semibold text-rose-700 shadow-sm">
          {error}
        </div>
      )}
      
      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-teal-50 border border-teal-200 text-sm font-semibold text-teal-700 shadow-sm">
          {successMsg}
        </div>
      )}

   <Card className="p-0 overflow-hidden max-w-3xl border-slate-200/60 shadow-sm">
    <div className="p-6 md:p-8 bg-white dark:bg-slate-900 ">
          <div className="flex items-center gap-3 mb-8">
   <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 ">
              <SettingsIcon size={20} />
            </div>
            <div>
       <h3 className="text-lg font-bold text-slate-900 dark:text-white ">Platform Settings</h3>
       <p className="text-sm text-slate-500 dark:text-slate-400 ">Configure global parameters and feature toggles.</p>
            </div>
          </div>
          
          {loading ? (
            <div className="text-slate-400 py-10 text-center font-medium">Loading configuration...</div>
          ) : settings ? (
            <div className="space-y-6">
              
              {/* Setting Row */}
       <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 dark:border-slate-800 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><Shield size={18} /></div>
                  <div>
          <span className="block font-bold text-slate-900 dark:text-white text-sm mb-0.5">JWT Authentication</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Enable token-based institutional auth.</span>
                  </div>
                </div>
                <button 
                  onClick={() => toggle('jwtAuthEnabled')}
   className={`px-4 py-2 rounded-lg text-sm font-bold tracking-wide transition-colors border ${settings.jwtAuthEnabled ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 '}`}
                >
                  {settings.jwtAuthEnabled ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>

              {/* Setting Row */}
       <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 dark:border-slate-800 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center"><FileText size={18} /></div>
                  <div>
          <span className="block font-bold text-slate-900 dark:text-white text-sm mb-0.5">Allowed Upload Types</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">File formats allowed for evidence uploads.</span>
                  </div>
                </div>
                <input 
                  value={settings.allowedUploadTypes || ''}
                  onChange={(e) => handleTextChange('allowedUploadTypes', e.target.value)}
   className="w-32 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-sm font-semibold text-slate-900 dark:text-white text-center focus:border-indigo-500 outline-none"
                />
              </div>

              {/* Setting Row */}
       <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 dark:border-slate-800 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Database size={18} /></div>
                  <div>
          <span className="block font-bold text-slate-900 dark:text-white text-sm mb-0.5">AI Service Engine</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Enable automated achievement processing.</span>
                  </div>
                </div>
                <button 
                  onClick={() => toggle('aiServiceActive')}
   className={`px-4 py-2 rounded-lg text-sm font-bold tracking-wide transition-colors border ${settings.aiServiceActive ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 '}`}
                >
                  {settings.aiServiceActive ? 'ACTIVE' : 'INACTIVE'}
                </button>
              </div>

              {/* Setting Row */}
       <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 dark:border-slate-800 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><FileText size={18} /></div>
                  <div>
          <span className="block font-bold text-slate-900 dark:text-white text-sm mb-0.5">PDF Report Export</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Allow generation of compliance PDFs.</span>
                  </div>
                </div>
                <button 
                  onClick={() => toggle('reportExportEnabled')}
   className={`px-4 py-2 rounded-lg text-sm font-bold tracking-wide transition-colors border ${settings.reportExportEnabled ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 '}`}
                >
                  {settings.reportExportEnabled ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
              
              {/* Setting Row */}
       <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 dark:border-slate-800 transition-colors">
                <div className="flex items-center gap-4">
     <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center"><UserCheck size={18} /></div>
                  <div>
          <span className="block font-bold text-slate-900 dark:text-white text-sm mb-0.5">Recruiter Verification</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Access control for employer accounts.</span>
                  </div>
                </div>
                <input 
                  value={settings.recruiterVerificationMode || ''}
                  onChange={(e) => handleTextChange('recruiterVerificationMode', e.target.value)}
   className="w-32 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-sm font-semibold text-slate-900 dark:text-white text-center focus:border-indigo-500 outline-none"
                />
              </div>

            </div>
          ) : null}
        </div>
        
  <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
          <Button onClick={handleSave} disabled={loading || saving} className="px-8">
            <Save size={18} />
            {saving ? 'Saving Config...' : 'Save Settings'}
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  )
}
