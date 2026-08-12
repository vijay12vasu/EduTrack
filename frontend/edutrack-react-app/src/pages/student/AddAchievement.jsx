import { useState } from 'react'
import { UploadCloud } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import { Input, Textarea } from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAchievements } from '../../context/AchievementContext'

export default function AddAchievement() {
  const { addAchievement } = useAchievements()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [fileName, setFileName] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) setFileName(file.name)
  }

  const resetForm = () => {
    setTitle('')
    setCategory('')
    setDate('')
    setDescription('')
    setFileName(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!fileName) {
      alert('Please upload a certificate before submitting.')
      return
    }

    addAchievement({
      title,
      category,
      date,
      description,
      certificate: fileName,
    })

    resetForm()
    setSubmitted(true)

    setTimeout(() => {
      setSubmitted(false)
    }, 2500)
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
              placeholder="DD-MM-YYYY"
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

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) =>
                    setFileName(e.target.files?.[0]?.name ?? null)
                  }
                />
              </label>
            </div>

            <Button type="submit">
              {submitted ? 'Submitted!' : 'Submit for Verification'}
            </Button>
          </form>

          <div className="bg-blue-50 rounded-2xl p-6 h-fit">
            <h4 className="font-bold text-slate-900 mb-3">
              Submission Tips
            </h4>

            <p className="text-sm text-slate-600 leading-relaxed">
              Upload clear proof documents. Faculty will check the certificate
              and approve only valid records. Verified achievements improve
              your AI score.
            </p>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  )
}