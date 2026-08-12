import { AVATAR_LETTER } from '../../data/dummyData'

export default function UserCard({ user }) {
  if (!user) return null
  return (
    <div className="mx-4 mb-4 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
        {AVATAR_LETTER(user.name)}
      </div>
      <div className="leading-tight min-w-0">
        <p className="font-semibold text-sm text-slate-900 truncate">{user.name}</p>
        <p className="text-xs text-slate-400 truncate">{user.roleLabel}</p>
      </div>
    </div>
  )
}
