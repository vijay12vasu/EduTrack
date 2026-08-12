import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, Diamond, Star } from 'lucide-react'
import { Input } from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { ROLE_DASHBOARD_PATH } from '../../utils/nav'

const FEATURES = [
  { icon: Check, label: 'Certified Records' },
  { icon: Diamond, label: 'Verified & Trusted' },
  { icon: Star, label: 'AI Powered Insights' },
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const role = await login(email || 'student@example.com', password)
    navigate(ROLE_DASHBOARD_PATH[role])
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-blue-50 items-center">
        <div className="absolute -top-16 left-1/3 w-56 h-56 rounded-full bg-blue-100" />
        <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-blue-100" />
        <div className="relative z-10 max-w-md mx-auto px-12">
          <h1 className="text-4xl font-extrabold text-blue-600 mb-4">EduTrack</h1>
          <h2 className="text-3xl font-extrabold text-slate-900 leading-snug mb-4">
            Student Achievement Management Platform
          </h2>
          <p className="text-slate-500 mb-8">
            A unified platform to record, verify and showcase student achievements for
            higher education institutions.
          </p>
          <div className="space-y-3">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm"
              >
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Icon size={16} fill="currentColor" />
                </span>
                <span className="font-semibold text-slate-900 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-card p-8 lg:p-10">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Welcome Back!</h2>
          <p className="text-sm text-slate-500 mb-6">Login to your EduTrack account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" className="w-full" size="lg">
              Login
            </Button>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex-1 h-px bg-slate-200" />
              or
              <span className="flex-1 h-px bg-slate-200" />
            </div>

            <Button type="button" variant="secondary" className="w-full" size="lg">
              <span className="font-bold text-blue-600">G</span>
              Continue with Google
            </Button>

            <div className="text-center">
              <Link to="/reset-password" className="text-sm font-medium text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Demo build — email containing "admin", "faculty" or "employer" signs you into
            that role's dashboard; any other email signs you in as a student.
          </p>
        </div>
      </div>
    </div>
  )
}
