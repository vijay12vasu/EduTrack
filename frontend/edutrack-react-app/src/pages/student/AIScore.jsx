import { useState, useEffect } from 'react'
import { Sparkles, TrendingUp, Target, Award, BrainCircuit, Activity, BarChart2 } from 'lucide-react'
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

  return (
    <DashboardLayout title="AI Profile Analysis" subtitle="Automated insights based on your verified achievements">
      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-slate-500 font-semibold text-lg flex flex-col items-center justify-center">
          <BrainCircuit size={48} className="animate-pulse text-blue-500 mb-4" />
          Analyzing your verified activities...
        </div>
      ) : aiData && (
        <>
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-1 p-8 flex flex-col items-center justify-center text-center bg-gradient-to-br from-blue-600 to-indigo-700 border-none shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              
              <div className="relative z-10 w-48 h-48 rounded-full border-[6px] border-white/20 flex flex-col items-center justify-center mb-6 shadow-2xl backdrop-blur-sm transition-transform duration-500 group-hover:scale-105 group-hover:border-white/40">
                <span className="text-6xl font-black text-white tracking-tighter drop-shadow-md">
                  {aiData.overallScore}
                </span>
                <span className="text-blue-100 font-semibold tracking-wide uppercase text-sm mt-1">/ 100</span>
              </div>

              <h3 className="text-2xl font-bold text-white relative z-10 drop-shadow-sm flex items-center gap-2">
                <BrainCircuit size={24} className="text-blue-200" />
                EduTrack AI Score
              </h3>
              <p className="text-blue-100/90 mt-3 relative z-10 font-medium leading-relaxed px-4 text-sm">
                {aiData.scoreExplanation}
              </p>
            </Card>

            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
              <Card className="p-6 border border-emerald-100 bg-gradient-to-b from-white to-emerald-50/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
                    <Target size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Key Strengths</h3>
                </div>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 font-medium text-sm">
                  {aiData.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </Card>

              <Card className="p-6 border border-amber-100 bg-gradient-to-b from-white to-amber-50/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-sm">
                    <TrendingUp size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">AI Recommendations</h3>
                </div>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 font-medium text-sm">
                  {aiData.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </Card>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6 border border-rose-100 bg-gradient-to-b from-white to-rose-50/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-sm">
                  <Activity size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Identified Weaknesses</h3>
              </div>
              <ul className="list-disc pl-5 space-y-2 text-slate-600 font-medium text-sm">
                {aiData.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </Card>

            <Card className="p-6 border border-purple-100 bg-gradient-to-b from-white to-purple-50/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-sm">
                  <BarChart2 size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Diversity Analysis</h3>
              </div>
              <p className="text-slate-600 font-medium text-sm leading-relaxed mb-4">
                {aiData.diversityAnalysis}
              </p>
              {aiData.categoryScores && Object.keys(aiData.categoryScores).length > 0 && (
                <div className="mt-4 pt-4 border-t border-purple-100/50">
                  <h4 className="text-xs uppercase font-bold text-slate-400 mb-3 tracking-wider">Category Scores</h4>
                  <div className="space-y-3">
                    {Object.entries(aiData.categoryScores).map(([cat, score]) => (
                      <div key={cat}>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-700">{cat}</span>
                          <span className="text-slate-500">{score}/100</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${score}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
