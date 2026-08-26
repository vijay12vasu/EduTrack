const VARIANTS = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-lg hover:-translate-y-0.5 shadow-[0_2px_10px_-3px_rgba(79,70,229,0.4)] border border-indigo-500/20 active:translate-y-0 active:shadow-sm',
  secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:border-slate-700 active:translate-y-0 active:shadow-sm',
  success: 'bg-teal-600 text-white hover:bg-teal-500 hover:shadow-lg hover:-translate-y-0.5 shadow-[0_2px_10px_-3px_rgba(13,148,136,0.4)] border border-teal-500/20 active:translate-y-0 active:shadow-sm',
  danger: 'bg-rose-600 text-white hover:bg-rose-500 hover:shadow-lg hover:-translate-y-0.5 shadow-[0_2px_10px_-3px_rgba(225,29,72,0.4)] border border-rose-500/20 active:translate-y-0 active:shadow-sm',
  ghost: 'bg-transparent text-slate-500 hover:bg-slate-100/80 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-200 active:bg-slate-200/50 dark:active:bg-slate-700/50',
  link: 'bg-transparent text-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-400 hover:underline p-0',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs font-semibold',
  md: 'px-5 py-2.5 text-sm font-semibold',
  lg: 'px-6 py-3.5 text-base font-semibold',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  as: Component = 'button',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none'
  return (
    <Component
      className={`${base} ${VARIANTS[variant]} ${variant !== 'link' ? SIZES[size] : ''} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}
