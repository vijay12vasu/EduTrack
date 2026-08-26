import { useState } from 'react'
import { Eye, EyeOff, ChevronDown } from 'lucide-react'

export function Field({ label, children, className = '' }) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-1.5">{label}</label>}
      {children}
    </div>
  )
}

const inputBaseClass = "w-full rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-900/50 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-900/80 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300"

export function Input({ label, className = '', type = 'text', ...props }) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  const input = (
    <div className="relative">
      <input
        type={inputType}
        className={`${inputBaseClass} ${isPassword ? 'pr-11' : ''} ${className}`}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
     className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none transition-colors p-1"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  )
  
  if (!label) return input
  return <Field label={label}>{input}</Field>
}

export function Select({ label, className = '', children, ...props }) {
  const select = (
    <div className="relative">
      <select
        className={`${inputBaseClass} appearance-none pr-10 ${className}`}
        {...props}
      >
        {children}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
        <ChevronDown size={18} />
      </div>
    </div>
  )
  
  if (!label) return select
  return <Field label={label}>{select}</Field>
}

export function Textarea({ label, className = '', rows = 4, ...props }) {
  const textarea = (
    <textarea
      rows={rows}
      className={`${inputBaseClass} resize-none ${className}`}
      {...props}
    />
  )
  if (!label) return textarea
  return <Field label={label}>{textarea}</Field>
}
