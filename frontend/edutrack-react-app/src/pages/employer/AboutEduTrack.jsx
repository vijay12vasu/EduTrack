import DashboardLayout from '../../layouts/DashboardLayout'
import Card from '../../components/ui/Card'
import { ShieldCheck, Target, Lock, BrainCircuit } from 'lucide-react'

const FEATURES = [
  {
    icon: Lock,
    title: 'Read-only Access',
    desc: 'Employers have view-only access to officially verified student records, ensuring data integrity.'
  },
  {
    icon: ShieldCheck,
    title: 'Verified Credentials',
    desc: 'All activities, certificates, and achievements are pre-verified by institutional academic faculty.'
  },
  {
    icon: BrainCircuit,
    title: 'AI Profile Score',
    desc: 'A machine-learning generated score that helps evaluate the diversity and strength of a student profile.'
  },
  {
    icon: Target,
    title: 'Streamlined Hiring',
    desc: 'Skip manual background checks by trusting the EduTrack record of verified achievements.'
  }
]

export default function AboutEduTrack() {
  return (
    <DashboardLayout title="About EduTrack" subtitle="Trusted verification platform for modern recruiting">
      <div className="grid lg:grid-cols-2 gap-8">
        
    <Card className="p-8 border-slate-200/60 dark:border-slate-800 shadow-sm relative overflow-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <h3 className="text-2xl font-extrabold mb-4 relative z-10">Trusted Student Achievement Verification</h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg mb-8 relative z-10">
            EduTrack provides a bridge between academic institutions and top employers by offering official, institution-verified achievement profiles. 
            Recruiters can view approved records, AI-driven approval scores, and directly download certificates. This drastically reduces the time spent on background verification and improves trust during placement and recruitment.
          </p>
          
     <div className="relative z-10 p-5 rounded-2xl bg-slate-50 dark:bg-white/10 border border-slate-200 dark:border-white/10 backdrop-blur-sm">
             <p className="text-sm text-indigo-700 dark:text-indigo-200 font-medium">
               "EduTrack ensures that the person you are hiring actually did what their resume claims."
             </p>
          </div>
        </Card>

        <div className="space-y-4">
     <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 px-1">Platform Features</h3>
          {FEATURES.map((f, idx) => (
      <Card key={idx} className="p-5 border-slate-200/60 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-colors flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <f.icon size={24} />
              </div>
              <div>
        <h4 className="font-bold text-slate-900 dark:text-white mb-1">{f.title}</h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </DashboardLayout>
  )
}
