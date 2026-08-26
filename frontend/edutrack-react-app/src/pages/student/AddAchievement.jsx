import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { UploadCloud, CheckCircle, Info, FileText, Activity } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import { Input, Textarea, Select } from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAchievements } from '../../context/AchievementContext'
import { useToast } from '../../context/ToastContext'

const CATEGORIES = [
  'Sports', 'Workshop', 'Certification', 'Research', 
  'Competition', 'Community Service', 'Cultural', 
  'Technical', 'Leadership', 'Other'
]

export default function AddAchievement() {
  const { addAchievement, updateAchievement, uploadFile } = useAchievements()
  const { addToast } = useToast()
  const location = useLocation()
  const navigate = useNavigate()
  
  const editActivity = location.state?.editActivity

  const [title, setTitle] = useState(editActivity?.title || '')
  const [category, setCategory] = useState(editActivity?.category || '')
  const [date, setDate] = useState(editActivity?.date || '')
  const [description, setDescription] = useState(editActivity?.description || '')
  const [fileObj, setFileObj] = useState(null)
  const [fileName, setFileName] = useState(editActivity?.certificate ? '(Existing Document)' : null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) {
       setFileObj(file)
       setFileName(file.name)
       setError('')
    }
  }

  const resetForm = () => {
    setTitle('')
    setCategory('')
    setDate('')
    setDescription('')
    setFileObj(null)
    setFileName(null)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!fileObj && !editActivity?.certificate) {
      setError('A valid certificate or proof document is required for verification.')
      return
    }

    setIsSubmitting(true)
    try {
      let fileId = editActivity?.certificate
      if (fileObj) {
        fileId = await uploadFile(fileObj)
        if (!fileId) {
          setError('Document upload failed. Please verify your connection and try again.')
          setIsSubmitting(false)
          return
        }
      }

      const payload = { title, category, date, description, certificate: fileId }

      if (editActivity) {
        await updateAchievement(editActivity.id, payload)
        addToast('Achievement successfully updated and resubmitted for verification.', 'success', 5000)
        navigate('/student/activities')
      } else {
        await addAchievement(payload)
        resetForm()
        addToast('Achievement submitted successfully. It is now pending faculty review.', 'success', 5000)
      }
    } catch (err) {
      setError(err.message || 'Submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout
      title={editActivity ? "Edit Achievement" : "Record Achievement"}
      subtitle={editActivity ? "Update your submission details and resubmit for verification." : "Submit a new activity to your growth profile for faculty verification."}
    >
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-sm font-semibold text-rose-700 dark:text-rose-400 shadow-sm">
              {error}
            </div>
          )}

          {/* Section 1: Core Details */}
          <Card className="p-6 md:p-8 overflow-hidden">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Activity size={20} strokeWidth={2.5} />
              </div>
              <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white ">Activity Information</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 ">Core details of your achievement.</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Activity Title"
                  placeholder="e.g. 1st Place - National Hackathon 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <Select
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="" disabled hidden>Select the best matching category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>

              <Input
                label="Date of Completion"
                type="date"
                max={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />

              <div className="md:col-span-2">
                <Textarea
                  label="Description (Optional but recommended)"
                  placeholder="Briefly describe your role, what you accomplished, and any key takeaways..."
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Section 2: Evidence Upload */}
          <Card className="p-6 md:p-8 overflow-hidden">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <FileText size={20} strokeWidth={2.5} />
              </div>
              <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white ">Proof of Achievement</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 ">Securely upload your certificate or evidence.</p>
              </div>
            </div>

            <label
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
    className="group relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 hover:border-indigo-300 dark:hover:border-indigo-500/50 p-10 text-center cursor-pointer transition-all"
            >
    <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center text-indigo-500 group-hover:scale-110 group-hover:text-indigo-600 transition-transform">
                <UploadCloud size={28} strokeWidth={2} />
              </div>

              {fileName ? (
                <div className="mt-2">
                  <span className="block text-base font-bold text-indigo-700">{fileName}</span>
                  <span className="block text-xs font-semibold text-indigo-400 mt-1">Click or drag to replace file</span>
                </div>
              ) : (
                <div className="mt-2">
         <span className="block text-sm font-bold text-slate-700 dark:text-slate-300 ">Click to upload or drag & drop</span>
                  <span className="block text-xs font-medium text-slate-400 mt-1">PDF, JPG, or PNG (Max 10MB)</span>
                </div>
              )}

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setFileObj(file)
                    setFileName(file.name)
                    setError('')
                  }
                }}
              />
            </label>
          </Card>

          {/* Section 3: Final Submission */}
   <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-lg border border-slate-200/60 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            
            <div className="flex gap-4 items-start relative z-10 max-w-lg">
              <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-500 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Info size={20} />
              </div>
              <div>
        <h4 className="font-bold text-slate-900 dark:text-white text-sm">Review before submitting</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Submitted records are routed directly to your academic faculty for review. Ensure your uploaded evidence clearly matches the stated achievement.
                </p>
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="shrink-0 px-8 py-3.5 text-base shadow-md">
              {isSubmitting ? 'Processing Upload...' : (editActivity ? 'Update & Resubmit' : 'Submit for Verification')}
            </Button>
          </div>

        </form>
      </div>
    </DashboardLayout>
  )
}