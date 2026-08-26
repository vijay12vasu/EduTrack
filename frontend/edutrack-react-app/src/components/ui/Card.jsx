export default function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
