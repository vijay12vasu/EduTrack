import Card from './Card'

const COLOR_MAP = {
  blue: 'text-blue-600 bg-blue-100',
  green: 'text-green-600 bg-green-100',
  amber: 'text-amber-500 bg-amber-100',
  red: 'text-red-600 bg-red-100',
}

const VALUE_COLOR = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  amber: 'text-amber-500',
  red: 'text-red-600',
}

export default function StatCard({ label, value, suffix, icon, color = 'blue' }) {
  return (
    <Card className="p-6 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${COLOR_MAP[color]}`}
        >
          {icon}
        </span>
      </div>
      <div className={`text-3xl font-bold ${VALUE_COLOR[color]}`}>
        {value}
        {suffix && <span className="text-base font-medium text-slate-400">{suffix}</span>}
      </div>
    </Card>
  )
}
