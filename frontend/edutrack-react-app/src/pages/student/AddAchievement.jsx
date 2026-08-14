import { useState } from 'react'
import { UploadCloud } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import { Input, Textarea } from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAchievements } from '../../context/AchievementContext'

export default function AddAchievement() {
  const { addAchievement, uploadFile } = useAchievements()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [fileObj, setFileObj] = useState(null)
  const [fileName, setFileName] = useState(null)
  const [submitted, setSubmitted] = useState(false)
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

    if (!fileObj) {
      setError('Please upload a certificate before submitting.')
      return
    }

    setIsSubmitting(true)
    try {
      // Step 1: Upload file to GridFS
      const fileId = await uploadFile(fileObj)
      if (!fileId) {
        setError('Failed to upload certificate. Please try again.')
        setIsSubmitting(false)
        return
      }

      // Step 2: Create activity with real GridFS file ID
      await addAchievement({
        title,
        category,
        date,
        description,
        certificate: fileId,
      })

      resetForm()
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
      }, 3000)
    } catch (err) {
      setError(err.message || 'Failed to submit achievement. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout
      title="Add New Achievement"
      subtitle="Fill in the details and upload certificate proof"
    >
      <Card className="p-6 md:p-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <form
            className="lg:col-span-2 space-y-5"
            onSubmit={handleSubmit}
          >
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}

            {submitted && (
              <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
                Achievement submitted successfully! It will appear as Pending until faculty verification.
              </div>
            )}

            <Input
              label="Activity Title"
              placeholder="Enter activity title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <Input
              label="Category"
              placeholder="Workshop / Sports / Research / Certification"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />

            <Input
              label="Activity Date"
              type="date"
              max={new Date().toISOString().split('T')[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <Textarea
              label="Description"
              placeholder="Write short details about this achievement..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Upload Certificate / Proof
              </label>

              <label
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-blue-200 bg-blue-50 px-6 py-10 text-center cursor-pointer hover:bg-blue-100/60 transition-colors"
              >
                <UploadCloud className="text-blue-600" size={22} />

                <span className="text-sm font-semibold text-blue-600">
                  {fileName ?? 'Drag and drop PDF, JPG or PNG certificate here'}
                </span>
                <span className="text-xs text-slate-400">
                  Max 10MB • PDF, JPG, PNG only
                </span>

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
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Uploading & Submitting...' : submitted ? '✓ Submitted!' : 'Submit for Verification'}
            </Button>
          </form>

          <div className="bg-blue-50 rounded-2xl p-6 h-fit">
            <h4 className="font-bold text-slate-900 mb-3">
              Submission Tips
            </h4>

            <p className="text-sm text-slate-600 leading-relaxed">
              Upload clear proof documents. Faculty will check the certificate
              and approve only valid records. Verified achievements improve
              your profile score.
            </p>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  )
}