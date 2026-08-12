export default function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 shadow-card ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
