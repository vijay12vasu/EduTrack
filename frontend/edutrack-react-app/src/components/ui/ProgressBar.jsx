export default function ProgressBar({ label, value, color = 'bg-blue-600' }) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-32 shrink-0 text-sm font-semibold text-slate-900">{label}</span>
      <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="w-10 shrink-0 text-right text-sm font-medium text-slate-500">{value}%</span>
    </div>
  )
}
