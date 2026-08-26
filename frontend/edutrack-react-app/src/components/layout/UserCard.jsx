import { Settings } from 'lucide-react'

export default function UserCard({ user }) {
  if (!user) return null

  const getAvatarLetter = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U'
  }
  
  const displayName = user.fullName || user.email || 'User'
  const roleLabel = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Student'

  return (
    <div className="flex items-center gap-3 w-full bg-slate-50/50 hover:bg-white dark:bg-slate-800/50 dark:hover:bg-slate-800 p-3 rounded-2xl transition-all duration-300 cursor-pointer group border border-slate-200/60 hover:border-indigo-100 dark:border-slate-800 dark:hover:border-indigo-500/30 shadow-sm hover:shadow-md">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm border border-indigo-300/30">
        {getAvatarLetter(displayName)}
      </div>
      <div className="leading-tight min-w-0 flex-1">
        <p className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">{displayName}</p>
        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate mt-0.5">{roleLabel}</p>
      </div>
      <Settings size={16} className="text-slate-400 opacity-0 group-hover:opacity-100 group-hover:text-indigo-400 transition-all shrink-0 mr-1" />
    </div>
  )
}
