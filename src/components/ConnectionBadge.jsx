import { CONNECTION_TYPES } from '../data/connections'

export default function ConnectionBadge({ type, className = '' }) {
  const cfg = CONNECTION_TYPES[type] || { color: '#6B7280', label: type }
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${className}`}
      style={{ backgroundColor: cfg.color + '22', color: cfg.color, border: `1px solid ${cfg.color}44` }}
    >
      {cfg.label}
    </span>
  )
}
