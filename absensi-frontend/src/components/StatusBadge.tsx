const colors: Record<string, string> = {
  ADMIN_HRD: 'bg-purple-100 text-purple-600',
  EMPLOYEE: 'bg-blue-100 text-blue-600',
  CHECKIN: 'bg-green-100 text-green-600',
  CHECKOUT: 'bg-red-100 text-red-600',
  Late: 'bg-yellow-100 text-yellow-600',
  Overtime: 'bg-purple-100 text-purple-600',
  'Did not check out': 'bg-red-100 text-red-600',
}

function StatusBadge({ label }: { label: string }) {
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors[label] ?? 'bg-gray-100 text-gray-600'}`}>
      {label}
    </span>
  )
}
export default StatusBadge