const STATUS_STYLES = {
  Verified: 'bg-green-50 text-green-600',
  Approved: 'bg-green-50 text-green-600',
  Active: 'bg-green-50 text-green-600',
  Ready: 'bg-green-50 text-green-600',
  Pending: 'bg-amber-50 text-amber-600',
  Rejected: 'bg-red-50 text-red-600',
}

export default function Badge({ status, children, className = '' }) {
  const styles = STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-600'
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${styles} ${className}`}
    >
      {children ?? status}
    </span>
  )
}
