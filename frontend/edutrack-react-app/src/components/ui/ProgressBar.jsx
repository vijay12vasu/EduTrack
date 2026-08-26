export default function ProgressBar({ label, value, color = 'bg-indigo-500' }) {
  return (
    <div className="flex items-center gap-4">
   <span className="w-32 shrink-0 text-sm font-semibold text-slate-700 dark:text-slate-300 truncate" title={label}>{label}</span>
      <div className="flex-1 h-3 rounded-full bg-slate-200 dark:bg-slate-800/80 overflow-hidden shadow-inner border border-slate-300/30 dark:border-slate-700/50">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700 relative`}
          style={{ width: `${value}%` }}
        >
          {/* Subtle light accent overlay on the bar */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
        </div>
      </div>
   <span className="w-10 shrink-0 text-right text-sm font-bold text-slate-600 dark:text-slate-400 ">{value}%</span>
    </div>
  )
}

