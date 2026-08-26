import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CircleX, GraduationCap, ShieldCheck, Trophy, BrainCircuit } from 'lucide-react'
import { Input } from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { ROLE_DASHBOARD_PATH } from '../../utils/nav'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.')
      return
    }

    setIsLoading(true)
    try {
      const role = await login(email, password)
      navigate(ROLE_DASHBOARD_PATH[role] || '/login')
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
  <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Left Panel - Abstract Visual Identity */}
  <div className="hidden lg:flex flex-col justify-between flex-1 bg-slate-50 dark:bg-slate-900/50 border-r border-slate-200/60 p-[clamp(1.5rem,5vh,4rem)] relative overflow-hidden min-h-screen lg:min-h-0">
        
        {/* Soft decorative background accents */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[500px] h-[500px] bg-indigo-50/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[400px] h-[400px] bg-teal-50/40 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top: Logo */}
        <div className="relative z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
              <GraduationCap className="text-white" size={22} strokeWidth={2.5} />
            </div>
      <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">EduTrack</span>
  <div className="ml-3 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-white/60 text-[10px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 ">
              Platform
            </div>
          </div>
        </div>

        {/* Middle: Content */}
        <div className="relative z-10 flex flex-col justify-center flex-1 py-[clamp(1rem,3vh,2rem)]">
          <div className="max-w-md">
      <h1 className="text-[clamp(2rem,3.5vw,3rem)] font-extrabold text-slate-900 dark:text-white leading-[1.15] mb-[clamp(0.5rem,2vh,1.25rem)] tracking-tight">
              Track your journey.<br />
              Understand your growth.
            </h1>
      <p className="text-[clamp(0.9375rem,1.2vw,1.125rem)] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              A secure, verified platform connecting students, faculty, institutions, and employers.
            </p>
          </div>

          {/* Elegant Abstract Visual Composition - Natural size, fluid outer margins */}
          <div className="mt-[clamp(1.5rem,5vh,3rem)] max-w-sm relative shrink-0">
            
            {/* Node 1: Achievement */}
   <div className="relative z-10 w-[220px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-[clamp(1rem,2vh,1.25rem)] shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-[clamp(1rem,2.5vh,1.5rem)] transform transition-transform hover:-translate-y-1 duration-500">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-3">
                <Trophy className="text-indigo-600" size={18} strokeWidth={2.5} />
              </div>
              <div className="space-y-2">
                <div className="h-1.5 w-3/4 bg-slate-200/80 rounded-full" />
        <div className="h-1.5 w-1/2 bg-slate-100 dark:bg-slate-800 rounded-full" />
              </div>
            </div>

            {/* Connecting structure 1 */}
            <div className="absolute top-[40px] left-[32px] w-[140px] h-[clamp(50px,8vh,70px)] border-l-2 border-b-2 border-dashed border-indigo-200/60 rounded-bl-[24px] -z-10" />

            {/* Node 2: Evidence */}
   <div className="relative z-20 w-[220px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-[clamp(1rem,2vh,1.25rem)] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ml-auto transform transition-transform hover:-translate-y-1 duration-500">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center mb-3">
                <ShieldCheck className="text-teal-600" size={18} strokeWidth={2.5} />
              </div>
              <div className="space-y-2">
                <div className="h-1.5 w-2/3 bg-slate-200/80 rounded-full" />
        <div className="h-1.5 w-1/3 bg-slate-100 dark:bg-slate-800 rounded-full" />
              </div>
            </div>

            {/* Connecting structure 2 */}
            <div className="absolute top-[clamp(100px,16vh,130px)] left-[170px] w-[50px] h-[clamp(40px,6vh,50px)] border-t-2 border-r-2 border-dashed border-teal-200/60 rounded-tr-[24px] -z-10" />

            {/* Node 3: Growth Insight */}
   <div className="relative z-10 w-[220px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-[clamp(1rem,2vh,1.25rem)] shadow-[0_8px_30px_rgb(0,0,0,0.04)] mt-[clamp(1rem,2.5vh,1.5rem)] transform transition-transform hover:-translate-y-1 duration-500">
              <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center mb-3">
                <BrainCircuit className="text-violet-600" size={18} strokeWidth={2.5} />
              </div>
              <div className="space-y-2">
                <div className="h-1.5 w-full bg-slate-200/80 rounded-full" />
        <div className="h-1.5 w-4/5 bg-slate-100 dark:bg-slate-800 rounded-full" />
              </div>
            </div>

          </div>
        </div>

        {/* Bottom: Footer */}
        <div className="relative z-10 shrink-0">
          <p className="text-[clamp(0.75rem,1vh,0.875rem)] font-semibold text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} EduTrack Platform. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Area */}
   <div className="flex-1 flex flex-col items-center justify-center p-[clamp(1.5rem,5vh,4rem)] relative bg-white dark:bg-slate-900 min-h-screen lg:min-h-0">
        
        <div className="w-full max-w-[380px]">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-[clamp(1.5rem,4vh,2.5rem)]">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
              <GraduationCap className="text-white" size={20} strokeWidth={2.5} />
            </div>
      <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">EduTrack</span>
          </div>

          <div className="mb-[clamp(1.5rem,4vh,2.5rem)]">
      <h2 className="text-[clamp(1.5rem,2.5vw,1.75rem)] font-extrabold text-slate-900 dark:text-white mb-[clamp(0.25rem,1vh,0.625rem)] tracking-tight">Welcome back</h2>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 ">
              Sign in to continue your growth journey.
            </p>
          </div>

          {error && (
            <div className="mb-[clamp(1rem,2vh,1.5rem)] p-3 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
              <CircleX className="shrink-0 text-red-500 mt-0.5" size={18} />
              <p className="text-sm font-medium text-red-700 leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-[clamp(1rem,2.5vh,1.25rem)]">
            <Input
              label="Email address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
    className="bg-white dark:bg-slate-900 hover:bg-slate-50/50"
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
    className="bg-white dark:bg-slate-900 hover:bg-slate-50/50"
            />

            <div className="flex items-center justify-between pt-1 pb-[clamp(0.25rem,1vh,0.75rem)]">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20 shadow-sm transition-colors cursor-pointer" 
                />
        <span className="text-sm text-slate-600 font-medium group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-white transition-colors">
                  Remember me
                </span>
              </label>
              <Link to="/reset-password" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full h-[clamp(2.75rem,6vh,3rem)] text-[15px] shadow-sm tracking-wide" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

        </div>
      </div>

    </div>
  )
}
