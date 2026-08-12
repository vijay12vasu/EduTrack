export function Field({ label, children, className = '' }) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-semibold text-slate-900 mb-2">{label}</label>}
      {children}
    </div>
  )
}

export function Input({ label, className = '', ...props }) {
  const input = (
    <input
      className={`w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 ${className}`}
      {...props}
    />
  )
  if (!label) return input
  return <Field label={label}>{input}</Field>
}

export function Textarea({ label, className = '', rows = 4, ...props }) {
  const textarea = (
    <textarea
      rows={rows}
      className={`w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none ${className}`}
      {...props}
    />
  )
  if (!label) return textarea
  return <Field label={label}>{textarea}</Field>
}
