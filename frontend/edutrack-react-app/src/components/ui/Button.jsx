const VARIANTS = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
  secondary: 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50',
  success: 'bg-green-600 text-white hover:bg-green-700 shadow-sm',
  danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
  link: 'bg-transparent text-blue-600 hover:underline p-0',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
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
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  return (
    <Component
      className={`${base} ${VARIANTS[variant]} ${variant !== 'link' ? SIZES[size] : ''} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}
