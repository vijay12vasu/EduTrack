export default function Logo() {
  return (
    <div className="flex items-center gap-3.5 px-6 py-8 relative">
      {/* Subtle ambient glow behind logo */}
      <div className="absolute left-6 top-8 w-12 h-12 bg-indigo-400/20 rounded-full blur-xl pointer-events-none"></div>
      
      <div className="relative w-11 h-11 rounded-[14px] bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 text-white flex items-center justify-center font-black text-2xl shrink-0 shadow-[0_4px_12px_rgba(79,70,229,0.25)] border border-indigo-400/30">
        E
      </div>
      <div className="leading-none relative z-10">
    <p className="font-extrabold text-[22px] text-slate-800 dark:text-slate-200 tracking-tight">EduTrack</p>
        <p className="text-[10px] text-indigo-500 font-bold tracking-[0.15em] uppercase mt-1">Growth Platform</p>
      </div>
    </div>
  )
}
