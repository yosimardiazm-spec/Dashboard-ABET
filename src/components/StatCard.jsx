export default function StatCard({ label, value, sub, color = 'default', icon }) {
  const colors = {
    default: 'text-sabana-900',
    green:   'text-green-600',
    red:     'text-red-600',
    yellow:  'text-yellow-600',
    blue:    'text-blue-600',
  }
  const bgColors = {
    default: 'bg-sabana-50',
    green:   'bg-green-50',
    red:     'bg-red-50',
    yellow:  'bg-yellow-50',
    blue:    'bg-blue-50',
  }

  return (
    <div className="card flex flex-col gap-2 min-w-0">
      <div className={`w-9 h-9 rounded-lg ${bgColors[color]} flex items-center justify-center`}>
        <span className={colors[color]}>{icon}</span>
      </div>
      <div>
        <p className={`text-2xl font-bold ${colors[color]}`}>{value}</p>
        <p className="text-sm font-medium text-gray-700 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
