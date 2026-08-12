export default function Table({ columns, children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-indigo-50/60">
            {columns.map((col) => (
              <th
                key={col}
                className="text-left font-semibold text-slate-500 px-6 py-3 first:rounded-l-lg last:rounded-r-lg whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function Tr({ children, striped = false }) {
  return (
    <tr className={`border-b border-slate-100 last:border-0 ${striped ? 'bg-slate-50/60' : ''}`}>
      {children}
    </tr>
  )
}

export function Td({ children, bold = false, className = '' }) {
  return (
    <td className={`px-6 py-4 whitespace-nowrap ${bold ? 'font-semibold text-slate-900' : 'text-slate-600'} ${className}`}>
      {children}
    </td>
  )
}
