import { formatIDR } from './ui'

export default function WealthBar({ amount, max, label }) {
  if (!amount) return (
    <div className="text-xs text-text-secondary italic">Data LHKPN tidak tersedia</div>
  )
  const pct = Math.min((amount / (max || 1)) * 100, 100)

  return (
    <div>
      {label && <div className="text-xs text-text-secondary mb-1">{label}</div>}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-bg-elevated rounded-full h-2 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent-gold to-yellow-500 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs font-medium text-accent-gold whitespace-nowrap">{formatIDR(amount)}</span>
      </div>
    </div>
  )
}
