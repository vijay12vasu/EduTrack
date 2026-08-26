const STATUS_STYLES = {
  Verified: { bg: 'bg-teal-50 dark:bg-teal-500/10', text: 'text-teal-700 dark:text-teal-400', border: 'border-teal-200/60 dark:border-teal-500/20', dot: 'bg-teal-500 dark:bg-teal-400' },
  Approved: { bg: 'bg-teal-50 dark:bg-teal-500/10', text: 'text-teal-700 dark:text-teal-400', border: 'border-teal-200/60 dark:border-teal-500/20', dot: 'bg-teal-500 dark:bg-teal-400' },
  Active: { bg: 'bg-teal-50 dark:bg-teal-500/10', text: 'text-teal-700 dark:text-teal-400', border: 'border-teal-200/60 dark:border-teal-500/20', dot: 'bg-teal-500 dark:bg-teal-400' },
  Ready: { bg: 'bg-indigo-50 dark:bg-indigo-500/10', text: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-200/60 dark:border-indigo-500/20', dot: 'bg-indigo-500 dark:bg-indigo-400' },
  Pending: { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200/60 dark:border-amber-500/20', dot: 'bg-amber-500 dark:bg-amber-400' },
  Rejected: { bg: 'bg-rose-50 dark:bg-rose-500/10', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-200/60 dark:border-rose-500/20', dot: 'bg-rose-500 dark:bg-rose-400' },
}

export default function Badge({ status, children, className = '' }) {
 const style = STATUS_STYLES[status] ?? { bg: 'bg-slate-100 dark:bg-slate-800 ', text: 'text-slate-600 dark:text-slate-400 ', border: 'border-slate-200 dark:border-slate-800 ', dot: 'bg-slate-400' }
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${style.bg} ${style.text} ${style.border} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
      {children ?? status}
    </span>
  )
}
