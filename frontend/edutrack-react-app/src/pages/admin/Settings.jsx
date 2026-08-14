import { useState, useEffect } from 'react'
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
    <DashboardLayout title="System Settings" subtitle="Institution-wide platform configuration">
      <Card className="p-6 md:p-8 max-w-2xl">
        <h3 className="text-lg font-bold text-slate-900 mb-5">Current Configuration</h3>
        
        {loading ? (
          <div className="text-slate-500 py-10 text-center">Loading settings...</div>
        ) : settings ? (
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-slate-600 font-medium">JWT Authentication</span>
              <button 
                onClick={() => toggle('jwtAuthEnabled')}
                className={`px-3 py-1 rounded text-sm font-semibold ${settings.jwtAuthEnabled ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}
              >
                {settings.jwtAuthEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-slate-600 font-medium">Allowed Upload Types</span>
              <input 
                value={settings.allowedUploadTypes || ''}
                onChange={(e) => handleTextChange('allowedUploadTypes', e.target.value)}
                className="text-right border-none focus:ring-0 bg-transparent text-slate-900 font-semibold"
              />
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-slate-600 font-medium">AI Service Engine</span>
              <button 
                onClick={() => toggle('aiServiceActive')}
                className={`px-3 py-1 rounded text-sm font-semibold ${settings.aiServiceActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}
              >
                {settings.aiServiceActive ? 'Active' : 'Inactive'}
              </button>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-slate-600 font-medium">PDF Report Export</span>
              <button 
                onClick={() => toggle('reportExportEnabled')}
                className={`px-3 py-1 rounded text-sm font-semibold ${settings.reportExportEnabled ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}
              >
                {settings.reportExportEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-slate-600 font-medium">Recruiter Verification</span>
              <input 
                value={settings.recruiterVerificationMode || ''}
                onChange={(e) => handleTextChange('recruiterVerificationMode', e.target.value)}
                className="text-right border-none focus:ring-0 bg-transparent text-slate-900 font-semibold"
              />
            </div>
          </div>
        ) : null}
        
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}
        
        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
            {successMsg}
          </div>
        )}

        <Button onClick={handleSave} disabled={loading || saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </Card>
    </DashboardLayout>
  )
}
