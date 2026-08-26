export default function Table({ columns, children }) {
  return (
    <div className="overflow-x-auto w-full rounded-2xl border border-slate-200 bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-200 dark:bg-slate-900/50 dark:border-slate-800">
            {columns.map((col) => (
              <th
                key={col}
                className="text-left font-semibold text-slate-500 px-6 py-4 whitespace-nowrap tracking-wide dark:text-slate-400"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 dark:divide-slate-800/80">{children}</tbody>
      </table>
    </div>
  )
}

export function Tr({ children, striped = false, className = '', onClick }) {
 const hoverClass = onClick ? 'hover:bg-indigo-50/50 hover:shadow-[inset_4px_0_0_0_#6366f1] cursor-pointer dark:hover:bg-indigo-900/20' : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/60'
  const base = `transition-all duration-200 ${striped ? 'bg-slate-50/30 dark:bg-slate-800/30' : 'bg-white dark:bg-slate-900'} ${hoverClass} ${className}`
  return (
    <tr className={base} onClick={onClick}>
      {children}
    </tr>
  )
}

export function Td({ children, bold = false, className = '', colSpan }) {
  return (
    <td colSpan={colSpan} className={`px-6 py-4.5 ${bold ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'} ${className}`}>
      {children}
    </td>
  )
}
