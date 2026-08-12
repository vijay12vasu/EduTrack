export default function Logo() {
  return (
    <div className="flex items-center gap-3 px-6 py-6">
      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
        E
      </div>
      <div className="leading-tight">
        <p className="font-extrabold text-lg text-blue-600 tracking-tight">EduTrack</p>
        <p className="text-xs text-slate-400 -mt-0.5">Achievement Platform</p>
      </div>
    </div>
  )
}
