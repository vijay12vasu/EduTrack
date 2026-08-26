import { FolderOpen } from 'lucide-react'

export default function EmptyState({ 
  icon: Icon = FolderOpen, 
  title = 'No records found', 
  message = 'There is currently no data to display here.',
  action = null
}) {
  return (
 <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/80 border-dashed">
  <div className="w-16 h-16 mb-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-center text-slate-400">
        <Icon size={32} strokeWidth={1.5} />
      </div>
   <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
   <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">{message}</p>
      {action && <div>{action}</div>}
    </div>
  )
}
