export default function Skeleton({ className = '', variant = 'rectangular' }) {
  const baseClass = "animate-pulse bg-slate-200 dark:bg-slate-800"
  
  const variantClass = {
    rectangular: 'rounded-xl',
    circular: 'rounded-full',
    text: 'rounded-md h-4'
  }[variant]

  return (
    <div className={`${baseClass} ${variantClass} ${className}`} />
  )
}
