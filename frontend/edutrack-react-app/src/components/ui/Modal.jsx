import { X } from 'lucide-react'

export default function Modal({ open, onClose, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-800 w-full max-w-lg p-6 sm:p-8 transition-all duration-200 transform">
        <button
          onClick={onClose}
   className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  )
}
