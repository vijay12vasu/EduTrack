import Card from './Card'

const COLOR_MAP = {
 blue: { card: 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-700/50', icon: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20' },
  indigo: { card: 'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100/60 dark:border-indigo-800/50', icon: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20' },
  green: { card: 'bg-teal-50/30 dark:bg-teal-900/10 border-teal-100/50 dark:border-teal-800/50', icon: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 border-teal-100 dark:border-teal-500/20' },
  amber: { card: 'bg-amber-50/30 dark:bg-amber-900/10 border-amber-100/50 dark:border-amber-800/50', icon: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20' },
  red: { card: 'bg-rose-50/30 dark:bg-rose-900/10 border-rose-100/50 dark:border-rose-800/50', icon: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20' },
}

const VALUE_COLOR = {
 blue: 'text-slate-800 dark:text-slate-200',
  indigo: 'text-indigo-900 dark:text-indigo-100',
  green: 'text-teal-900 dark:text-teal-100',
  amber: 'text-amber-900 dark:text-amber-100',
  red: 'text-rose-900 dark:text-rose-100',
}

export default function StatCard({ label, value, suffix, icon, color = 'blue' }) {
  return (
    <Card className={`p-[clamp(1.25rem,3vh,1.5rem)] flex flex-col gap-[clamp(0.75rem,2vh,1rem)] shadow-sm ${COLOR_MAP[color].card}`}>
      <div className="flex items-center justify-between">
    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 ">{label}</span>
        <span
          className={`w-10 h-10 rounded-lg flex items-center justify-center border shadow-sm ${COLOR_MAP[color].icon}`}
        >
          {icon}
        </span>
      </div>
      <div className={`text-3xl font-bold tracking-tight ${VALUE_COLOR[color]}`}>
        {value}
        {suffix && <span className="text-base font-semibold text-slate-400 ml-1.5">{suffix}</span>}
      </div>
    </Card>
  )
}
