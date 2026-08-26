import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trophy, BadgeCheck, Clock3, CircleX, Sparkles, Target, ArrowRight, BrainCircuit, Loader2, Info, Activity } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { useAchievements } from '../../context/AchievementContext'
import { useAuth } from '../../context/AuthContext'

function formatDate(date) {
  const parsed = new Date(date)
  if (isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function getGrowthLevel(score) {
  if (score <= 20) return 'Explorer'
  if (score <= 40) return 'Rising Star'
  if (score <= 60) return 'Achiever'
  if (score <= 80) return 'Excellence'
  return 'Elite'
}

export default function StudentDashboard() {
  const navigate = useNavigate()
  const { achievements, loading: achLoading, token } = useAchievements()
  const { user } = useAuth()
  
  const [aiData, setAiData] = useState(null)
  const [aiLoading, setAiLoading] = useState(true)
  const [aiError, setAiError] = useState('')

  useEffect(() => {
    if (token) {
      setAiLoading(true)
      fetch('/api/activities/ai/score', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load AI data')
        return res.json()
      })
      .then(data => {
         setAiData(data)
         setAiLoading(false)
      })
      .catch(e => {
         setAiError(e.message)
         setAiLoading(false)
      })
    }
  }, [token])

  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'Student'
  
  const summary = {
    total: achievements.length,
    pending: achievements.filter(a => a.status === 'Pending').length,
    verified: achievements.filter(a => a.status === 'Verified').length,
    rejected: achievements.filter(a => a.status === 'Rejected').length
  }
  const summaryLoading = achLoading
  const recent = [...achievements].slice(-5).reverse()

  const headerAction = (
    <Button onClick={() => navigate('/student/add-achievement')} className="shadow-sm">
      + Log New Activity
    </Button>
  )

  return (
    <DashboardLayout
      title={`Welcome back, ${firstName}`}
      subtitle={`Your intelligent growth overview for ${formatDate(new Date())}`}
      action={headerAction}
    >
      {/* LEVEL 1: SIGNATURE EXPERIENCE (HERO) */}
      <div className="relative w-full rounded-[2rem] overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-50 border border-indigo-100 shadow-sm mb-[clamp(2rem,5vh,3rem)] group">
        {/* Ambient background shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none transition-transform duration-1000 group-hover:scale-110"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-400/5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="relative z-10 p-[clamp(2rem,5vh,4rem)] flex flex-col md:flex-row items-center gap-[clamp(2rem,5vw,5rem)]">
          
          {/* Left: Score Visualization */}
          <div className="shrink-0 relative flex items-center justify-center">
            {/* Decorative structural rings */}
            <div className="absolute inset-0 border border-indigo-200/50 rounded-full scale-[1.12] transition-transform duration-700 group-hover:scale-[1.15]"></div>
            <div className="absolute inset-0 border border-indigo-100/50 rounded-full scale-[1.25] border-dashed"></div>
            
            <svg className="w-[clamp(12rem,22vw,16rem)] h-[clamp(12rem,22vw,16rem)] transform -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white drop-shadow-sm" />
              <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-200/50" />
              {!aiLoading && !aiError && aiData && (
                <circle 
                  cx="50" cy="50" r="42" stroke="url(#growthGradient)" strokeWidth="6" fill="transparent" 
                  strokeDasharray="263.89" 
                  strokeDashoffset={263.89 - (263.89 * aiData.overallScore) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-[1.5s] ease-out" 
                />
              )}
              <defs>
                <linearGradient id="growthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4f46e5" /> {/* indigo-600 */}
                  <stop offset="100%" stopColor="#7c3aed" /> {/* violet-600 */}
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {aiLoading ? (
                <Loader2 className="animate-spin text-indigo-400" size={36} />
              ) : aiError || !aiData ? (
                <span className="text-lg font-bold text-slate-300">N/A</span>
              ) : (
                <>
         <span className="text-[clamp(2.5rem,5vw,3.5rem)] font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-1">
                    {aiData.overallScore}
                  </span>
                  <span className="text-indigo-900/40 text-xs font-black tracking-[0.2em]">SCORE</span>
                </>
              )}
            </div>
          </div>
          
          {/* Right: Growth Context */}
          <div className="flex-1 text-center md:text-left">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest shadow-sm mb-5">
              <Sparkles size={14} className="text-indigo-500" />
              {aiLoading ? 'Analyzing Status...' : aiData ? `Status: ${getGrowthLevel(aiData.overallScore)}` : 'Analysis Pending'}
            </div>
      <h2 className="text-[clamp(2rem,4vw,2.75rem)] font-black mb-4 text-slate-900 dark:text-white tracking-tight leading-none">
              Your Growth Profile
            </h2>
      <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed font-medium max-w-2xl mb-8">
              {aiLoading ? (
                <span className="animate-pulse">Compiling your achievement evidence into a personalized growth profile...</span>
              ) : aiError ? (
                <span className="text-rose-600">Unable to generate analysis. Please try again later.</span>
              ) : aiData ? (
                "Your growth analysis is dynamically calculated based on your recorded and verified achievements."
              ) : (
                "Upload and verify your achievements to unlock your personalized growth score."
              )}
            </p>
            
            {aiData && !aiLoading && !aiError && (
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-teal-800 bg-teal-50/80 px-4 py-2 rounded-xl border border-teal-200/60 shadow-sm transition-transform hover:-translate-y-0.5">
                   <BadgeCheck size={18} className="text-teal-600"/> Verified Activity Focus
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-indigo-800 bg-indigo-50/80 px-4 py-2 rounded-xl border border-indigo-200/60 shadow-sm transition-transform hover:-translate-y-0.5">
                   <Activity size={18} className="text-indigo-600"/> Continuous Tracking
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LEVEL 2: AI GUIDANCE SYSTEM */}
      <div className="grid lg:grid-cols-12 gap-[clamp(1.5rem,4vh,2rem)] mb-[clamp(2rem,5vh,3rem)]">
        
        {/* Left: EduTrack Signals (Insights) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="flex items-center gap-2 mb-4 px-1">
            <BrainCircuit size={18} className="text-indigo-500" />
      <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">EduTrack Signals</h3>
          </div>
          
   <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200/60 rounded-[2rem] p-[clamp(1.5rem,4vh,2.5rem)] shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-teal-400 opacity-80"></div>
             
             {aiLoading ? (
                <div className="space-y-6">
         <div className="h-16 bg-slate-50 dark:bg-slate-900/50 rounded-xl animate-pulse"></div>
         <div className="h-16 bg-slate-50 dark:bg-slate-900/50 rounded-xl animate-pulse"></div>
                </div>
             ) : !aiData || (!aiData.strengths?.length && !aiData.diversityAnalysis) ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-10">
                  <BrainCircuit size={48} className="text-slate-200 mb-4" strokeWidth={1.5} />
         <p className="text-slate-500 dark:text-slate-400 font-medium">Add and verify more achievements to unlock deep growth signals.</p>
                </div>
             ) : (
               <div className="relative pl-[26px] border-l-2 border-indigo-50 space-y-8 mt-2">
                  {aiData.strengths?.[0] && (
                    <div className="relative">
           <div className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-[3px] border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.4)]"></div>
                      <h4 className="text-[11px] font-black text-indigo-500 uppercase tracking-widest mb-1.5">Demonstrated Strength</h4>
           <p className="text-base font-bold text-slate-800 dark:text-slate-200 leading-snug">{aiData.strengths[0]}</p>
                    </div>
                  )}
                  {aiData.diversityAnalysis && (
                    <div className="relative">
           <div className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-[3px] border-teal-500 shadow-[0_0_12px_rgba(20,184,166,0.4)]"></div>
                      <h4 className="text-[11px] font-black text-teal-500 uppercase tracking-widest mb-1.5">Profile Breadth</h4>
           <p className="text-base font-bold text-slate-800 dark:text-slate-200 leading-snug">{aiData.diversityAnalysis}</p>
                    </div>
                  )}
                  {aiData.weaknesses?.[0] && (
                    <div className="relative">
           <div className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-[3px] border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]"></div>
                      <h4 className="text-[11px] font-black text-amber-500 uppercase tracking-widest mb-1.5">Focus Area</h4>
           <p className="text-base font-bold text-slate-800 dark:text-slate-200 leading-snug">{aiData.weaknesses[0]}</p>
                    </div>
                  )}
               </div>
             )}
          </div>
        </div>

        {/* Right: Next Best Action */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4 px-1">
            <Target size={18} className="text-slate-400" />
      <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Recommended Action</h3>
          </div>
          
          <div className="flex-1 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] p-[clamp(1.75rem,4vh,2.5rem)] text-white shadow-md relative overflow-hidden flex flex-col justify-center group">
             <div className="absolute -right-12 -bottom-12 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                <ArrowRight size={220} />
             </div>
             <div className="relative z-10">
               <h4 className="text-2xl font-black mb-4 leading-tight text-white drop-shadow-sm">Next Best Step</h4>
               <p className="text-indigo-100 text-base font-medium leading-relaxed mb-8">
                 {aiLoading ? (
                   <span className="animate-pulse">Determining optimal action...</span>
                 ) : aiData?.recommendations?.[0] ? (
                   aiData.recommendations[0]
                 ) : (
                   "Continue logging verified activities to unlock personalized recommendations."
                 )}
               </p>
        <Button variant="secondary" onClick={() => navigate('/student/add-achievement')} className="bg-white dark:bg-slate-900 text-indigo-700 border-none hover:bg-indigo-50 shadow-lg w-full md:w-auto">
                  Take Action Now
               </Button>
             </div>
          </div>
        </div>
      </div>

      {/* LEVEL 3: ACHIEVEMENT SNAPSHOT (BENTO) */}
      <div className="mb-[clamp(2rem,5vh,3rem)]">
        <div className="flex items-center gap-2 mb-4 px-1">
          <Trophy size={18} className="text-slate-400" />
     <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Achievement Snapshot</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Featured Metric */}
          <div className="lg:col-span-1 bg-slate-800 text-white p-6 rounded-[1.5rem] flex flex-col justify-between shadow-sm relative overflow-hidden group">
             <div className="absolute -right-6 -top-6 text-white/5 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">
               <Trophy size={140} />
             </div>
             <div className="relative z-10">
               <p className="text-sm font-semibold text-slate-300 mb-1">Total Logged</p>
               <p className="text-[clamp(2.5rem,4vw,3rem)] font-black leading-none">{summaryLoading ? '—' : summary.total}</p>
             </div>
             <div className="relative z-10 mt-8 pt-4 border-t border-slate-700/50">
               <p className="text-xs font-medium text-slate-400">Lifetime recorded activities</p>
             </div>
          </div>
          
          {/* Supporting Metrics */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
             <div className="bg-teal-50/50 border border-teal-100/60 p-6 rounded-[1.5rem] flex flex-col justify-between hover:bg-teal-50 transition-colors">
               <div className="flex items-center gap-2 text-teal-700 mb-4">
                 <BadgeCheck size={18} /> <span className="text-sm font-bold uppercase tracking-wider">Verified</span>
               </div>
               <p className="text-4xl font-black text-teal-950">{summaryLoading ? '—' : summary.verified}</p>
             </div>
             <div className="bg-amber-50/50 border border-amber-100/60 p-6 rounded-[1.5rem] flex flex-col justify-between hover:bg-amber-50 transition-colors">
               <div className="flex items-center gap-2 text-amber-700 mb-4">
                 <Clock3 size={18} /> <span className="text-sm font-bold uppercase tracking-wider">Pending</span>
               </div>
               <p className="text-4xl font-black text-amber-950">{summaryLoading ? '—' : summary.pending}</p>
             </div>
             <div className="bg-rose-50/50 border border-rose-100/60 p-6 rounded-[1.5rem] flex flex-col justify-between hover:bg-rose-50 transition-colors">
               <div className="flex items-center gap-2 text-rose-700 mb-4">
                 <CircleX size={18} /> <span className="text-sm font-bold uppercase tracking-wider">Rejected</span>
               </div>
               <p className="text-4xl font-black text-rose-950">{summaryLoading ? '—' : summary.rejected}</p>
             </div>
          </div>
        </div>
      </div>

      {/* LEVEL 4: SUPPORTING ANALYTICS */}
      <div className="grid lg:grid-cols-2 gap-[clamp(1.5rem,4vh,2rem)]">
        
        {/* SKILLS */}
        <div>
          <div className="flex items-center gap-2 mb-4 px-1">
            <Target size={18} className="text-slate-400" />
      <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Skill Distribution</h3>
          </div>
   <div className="bg-white dark:bg-slate-900 border border-slate-200/60 rounded-[2rem] p-[clamp(1.5rem,4vh,2.5rem)] shadow-sm min-h-[300px]">
            {aiLoading ? (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm font-medium animate-pulse">Loading skill matrix...</div>
            ) : !aiData || !aiData.categoryScores || Object.keys(aiData.categoryScores).length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <Info size={40} className="text-slate-200 mb-4" strokeWidth={1.5} />
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Your skill matrix requires more verified data.</p>
              </div>
            ) : (
              <div className="space-y-6 pt-2">
                {Object.entries(aiData.categoryScores).map(([cat, score]) => (
                  <div key={cat} className="group">
                    <div className="flex justify-between items-end mb-2">
           <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">{cat}</span>
                      <span className="font-black text-indigo-600 text-sm">{score}%</span>
                    </div>
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 rounded-full relative transition-all duration-1000 ease-out"
                        style={{ width: `${score}%` }}
                      >
            <div className="absolute inset-0 bg-white/20"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* TIMELINE */}
        <div>
          <div className="flex items-center gap-2 mb-4 px-1">
            <Clock3 size={18} className="text-slate-400" />
      <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Activity Journey</h3>
          </div>
   <div className="bg-white dark:bg-slate-900 border border-slate-200/60 rounded-[2rem] p-[clamp(1.5rem,4vh,2.5rem)] shadow-sm min-h-[300px]">
            {achLoading ? (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm font-medium animate-pulse">Loading journey...</div>
            ) : recent.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-5">No activities logged yet.</p>
                <Button variant="secondary" onClick={() => navigate('/student/add-achievement')}>Start Your Journey</Button>
              </div>
            ) : (
       <div className="relative pl-[26px] border-l-2 border-slate-100 dark:border-slate-800 space-y-6 mt-2">
                {recent.map((a, i) => (
                  <div key={a.id} className="relative group">
                    {/* Spine Node */}
          <div className={`absolute -left-[35px] top-1.5 w-4 h-4 rounded-full border-[3px] bg-white dark:bg-slate-900 transition-colors duration-300 ${
                      a.status === 'Verified' ? 'border-teal-500' : 
                      a.status === 'Rejected' ? 'border-rose-500' : 'border-amber-500'
                    }`}></div>
                    
   <div className="flex items-start justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-transparent group-hover:border-slate-100 dark:border-slate-800 group-hover:shadow-sm transition-all group-hover:bg-slate-50/50 cursor-default">
                      <div>
                         <div className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">{formatDate(a.date)}</div>
             <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-0.5">{a.title}</h4>
                         <p className="text-xs font-semibold text-indigo-600/80">{a.category}</p>
                      </div>
                      <div className="shrink-0 pl-3">
                        <Badge status={a.status} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
