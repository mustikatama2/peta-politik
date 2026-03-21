import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PARTY_MAP } from '../data/parties'
import { Avatar, formatIDR } from './ui'

const RISK_CONFIG = {
  rendah:    { label: '✓ Bersih',     cls: 'risk-rendah' },
  sedang:    { label: '⚠ Sedang',     cls: 'risk-sedang' },
  tinggi:    { label: '⚠ Tinggi',     cls: 'risk-tinggi' },
  tersangka: { label: '🔴 Tersangka', cls: 'risk-tersangka' },
  terpidana: { label: '⛔ Terpidana', cls: 'risk-terpidana' },
}

export default function PersonCard({ person, compact, bookmarked, onBookmark, hasLiveNews }) {
  const navigate = useNavigate()
  const party = person.party_id ? PARTY_MAP[person.party_id] : null
  const currentPos = person.positions?.find(p => p.is_current)
  const risk = RISK_CONFIG[person.analysis?.corruption_risk] || RISK_CONFIG.rendah

  // Compact mode: just avatar + name + party badge
  if (compact) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className="bg-bg-card rounded-xl border border-border overflow-hidden cursor-pointer group"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <div className="h-1" style={{ backgroundColor: party?.color || '#64748B' }} />
        <div className="p-3 flex flex-col items-center text-center gap-2">
          <Avatar
            name={person.name}
            photoUrl={person.photo_url}
            color={party?.color}
            size="md"
            className="ring-2 ring-bg-app"
          />
          <p className="text-xs font-semibold text-text-primary group-hover:text-accent-red transition-colors line-clamp-2 leading-snug">
            {person.name}
          </p>
          {party && (
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
              style={{ backgroundColor: party.color }}
            >
              {party.abbr}
            </span>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      onClick={() => navigate(`/persons/${person.id}`)}
      className="relative bg-bg-card rounded-xl border border-border overflow-hidden cursor-pointer group"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      {onBookmark && (
        <button
          onClick={e => { e.preventDefault(); e.stopPropagation(); onBookmark(person.id) }}
          className="absolute top-2 right-2 text-lg opacity-60 hover:opacity-100 z-10 transition-opacity"
          title={bookmarked ? 'Hapus dari pantauan' : 'Tambah ke pantauan'}
        >
          {bookmarked ? '⭐' : '☆'}
        </button>
      )}
      {hasLiveNews && (
        <span className="absolute top-2 left-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] font-bold text-green-400">LIVE</span>
        </span>
      )}
      {/* Party color top bar */}
      <div
        className="h-1.5 w-full"
        style={{ backgroundColor: party?.color || '#64748B' }}
      />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start gap-3">
          <Avatar
            name={person.name}
            photoUrl={person.photo_url}
            color={party?.color}
            size="lg"
            className="flex-shrink-0 ring-2 ring-bg-app"
          />
          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="font-semibold text-text-primary text-sm leading-snug group-hover:text-accent-red transition-colors line-clamp-1">
              {person.name}
            </h3>
            <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">
              {currentPos?.title || '—'}
            </p>
            <p className="text-xs text-text-muted line-clamp-1">
              {currentPos?.institution || person.tier}
            </p>
          </div>
        </div>

        {/* Badges row */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {party && (
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: party.color }}
            >
              {party.abbr}
            </span>
          )}
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${risk.cls}`}>
            {risk.label}
          </span>
          {person.region_id === 'jawa-timur' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-bg-elevated text-text-secondary border border-border">
              🗺️ Jatim
            </span>
          )}
        </div>

        {/* LHKPN footer */}
        {person.lhkpn_latest ? (
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-[11px] text-text-muted">LHKPN {person.lhkpn_year}</span>
            <span className="text-xs font-bold" style={{ color: 'var(--accent-gold)' }}>
              {formatIDR(person.lhkpn_latest)}
            </span>
          </div>
        ) : (
          <div className="mt-3 pt-3 border-t border-border">
            <span className="text-[11px] text-text-muted italic">LHKPN tidak tersedia</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
