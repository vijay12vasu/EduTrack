import { useState, useEffect } from 'react'
import { BrainCircuit, Sparkles, Target, Zap, LayoutDashboard, ChevronRight, Activity } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import { useAuth } from '../../context/AuthContext'

export default function AIScore() {
  const { token } = useAuth()
  const [aiData, setAiData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (token) {
      fetch('/api/activities/ai/score', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load AI data')
        return res.json()
      })
      .then(data => {
         setAiData(data)
         setLoading(false)
      })
      .catch(e => {
         setError(e.message)
         setLoading(false)
      })
    }
  }, [token])

  const getGrowthLevel = (score) => {
    if (score >= 90) return { title: 'Exceptional Profile', desc: 'Highly diversified and impactful achievements.', color: 'text-teal-400' }
    if (score >= 75) return { title: 'Advanced Growth', desc: 'Strong foundation with varied activities.', color: 'text-indigo-200' }
    if (score >= 50) return { title: 'Developing Profile', desc: 'On the right track, room to expand categories.', color: 'text-violet-200' }
    return { title: 'Emerging', desc: 'Starting your achievement journey.', color: 'text-slate-300' }
  }

  return (
    <DashboardLayout 
      title="Intelligent Growth Cockpit" 
      subtitle="EduTrack AI analysis of your verified achievement profile"
    >
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-start gap-3">
          <Activity className="shrink-0 text-rose-500 mt-0.5" size={18} />
          <p className="text-sm font-medium text-rose-700 dark:text-rose-400 leading-relaxed">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <BrainCircuit size={48} className="relative z-10 text-indigo-500 animate-pulse" />
          </div>
     <p className="mt-6 text-slate-500 dark:text-slate-400 font-semibold tracking-wide uppercase text-xs">Analyzing your profile...</p>
        </div>
      ) : aiData && (
        <div className="space-y-8">
          
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 border border-slate-800 shadow-2xl p-8 lg:p-12">
            {/* Ambient Background Depth */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              
              {/* Score Visualization */}
              <div className="shrink-0 relative group">
                <div className="w-48 h-48 rounded-full bg-slate-800 border-[8px] border-slate-700/50 flex flex-col items-center justify-center shadow-inner relative z-10 transition-transform duration-500 group-hover:scale-105">
                  <span className="text-6xl font-black text-white tracking-tighter drop-shadow-md">
                    {aiData.overallScore}
                  </span>
                  <span className="text-slate-400 font-semibold tracking-widest uppercase text-[10px] mt-1">out of 100</span>
                </div>
                {/* Decorative rings */}
                <div className="absolute inset-0 rounded-full border border-indigo-500/30 scale-110 opacity-50 group-hover:scale-[1.15] transition-transform duration-700 pointer-events-none"></div>
                <div className="absolute inset-0 rounded-full border border-teal-500/20 scale-125 opacity-30 group-hover:scale-[1.3] transition-transform duration-1000 pointer-events-none"></div>
              </div>

              {/* Interpretation */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
                  <Sparkles size={14} className="text-indigo-400" />
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">AI Assessment</span>
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-2 tracking-tight">
                  {getGrowthLevel(aiData.overallScore).title}
                </h2>
                <p className={`text-lg font-medium mb-6 ${getGrowthLevel(aiData.overallScore).color}`}>
                  {getGrowthLevel(aiData.overallScore).desc}
                </p>
                
                <p className="text-slate-300 leading-relaxed text-sm max-w-2xl bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                  {aiData.scoreExplanation}
                </p>
              </div>

            </div>
          </div>

          {/* Insights Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            
            {/* Strengths - Teal Accent */}
      <Card className="p-0 border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-teal-50/50 dark:bg-teal-900/10 border-b border-teal-100/50 dark:border-teal-800/30 p-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <Target size={20} />
                </div>
                <div>
         <h3 className="text-base font-bold text-slate-900 dark:text-white ">Recognized Strengths</h3>
         <p className="text-xs font-medium text-slate-500 dark:text-slate-400 ">Areas where your profile excels</p>
                </div>
              </div>
       <div className="p-6 flex-1 bg-white dark:bg-slate-900 ">
                <ul className="space-y-4">
                  {aiData.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                      <ChevronRight size={16} className="text-teal-400 mt-0.5 shrink-0 transition-transform group-hover:translate-x-1" />
           <span className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* Recommendations - Indigo Accent */}
      <Card className="p-0 border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-indigo-50/50 dark:bg-indigo-900/10 border-b border-indigo-100/50 dark:border-indigo-800/30 p-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Zap size={20} />
                </div>
                <div>
         <h3 className="text-base font-bold text-slate-900 dark:text-white ">Next Best Actions</h3>
         <p className="text-xs font-medium text-slate-500 dark:text-slate-400 ">AI-suggested growth opportunities</p>
                </div>
              </div>
       <div className="p-6 flex-1 bg-white dark:bg-slate-900 ">
                <ul className="space-y-4">
                  {aiData.recommendations.map((r, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                      <ChevronRight size={16} className="text-indigo-400 mt-0.5 shrink-0 transition-transform group-hover:translate-x-1" />
           <span className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
            
          </div>

          {/* Diversity Analysis - Violet Accent */}
     <Card className="p-0 border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="bg-violet-50/50 dark:bg-violet-900/10 border-b border-violet-100/50 dark:border-violet-800/30 p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <LayoutDashboard size={20} />
              </div>
              <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white ">Skill Distribution</h3>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 ">Analysis of your achievement categories</p>
              </div>
            </div>
      <div className="p-6 lg:p-8 bg-white dark:bg-slate-900 grid md:grid-cols-2 gap-8 items-center">
              <div>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  {aiData.diversityAnalysis}
                </p>
                {aiData.weaknesses && aiData.weaknesses.length > 0 && (
     <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800 ">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Focus Areas</h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 ">
                      {aiData.weaknesses.map((w, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {aiData.categoryScores && Object.keys(aiData.categoryScores).length > 0 && (
    <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 ">
         <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Category Metrics</h4>
                  {Object.entries(aiData.categoryScores).map(([cat, score]) => (
                    <div key={cat} className="group">
                      <div className="flex justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-700 dark:text-slate-300 group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors">{cat}</span>
            <span className="text-slate-500 dark:text-slate-400 ">{score}/100</span>
                      </div>
                      <div className="w-full bg-slate-200/60 dark:bg-slate-700/60 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-violet-500 h-full rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${score}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
          
        </div>
      )}
    </DashboardLayout>
  )
}
