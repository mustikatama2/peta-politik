import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MAX_VISIBLE = 10

function calcDuration(yearStart, yearEnd) {
  if (!yearStart) return null
  const start = parseInt(yearStart, 10)
  const end = yearEnd ? parseInt(yearEnd, 10) : new Date().getFullYear()
  if (isNaN(start) || isNaN(end)) return null
  const diff = end - start
  if (diff <= 0) return null
  return diff === 1 ? '1 tahun' : `${diff} tahun`
}

function DotColor({ pos }) {
  // controversy/corruption = red, current = gold, past = gray
  if (pos.controversy || pos.is_corruption) {
    return '#EF4444'
  }
  if (pos.is_current) {
    return 'var(--accent-gold, #F59E0B)'
  }
  return '#374151'
}

export default function CareerTimeline({ person }) {
  const [expanded, setExpanded] = useState(false)

  // Normalize positions — support both {year_start, year_end, org} and {start, end, institution}
  const rawPositions = person?.positions || []

  if (rawPositions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3 text-text-secondary">
        <span className="text-4xl">📋</span>
        <p className="text-sm">Rekam jabatan belum tersedia</p>
      </div>
    )
  }

  // Normalize and sort descending (most recent first)
  const normalized = rawPositions.map(pos => ({
    ...pos,
    _yearStart: pos.year_start || pos.start || null,
    _yearEnd:   pos.year_end   || pos.end   || null,
    _org:       pos.org        || pos.institution || null,
    _title:     pos.title      || pos.role  || '—',
  }))

  const sorted = [...normalized].sort((a, b) => {
    const ay = parseInt(a._yearStart, 10) || 0
    const by_ = parseInt(b._yearStart, 10) || 0
    return by_ - ay
  })

  const visible = expanded ? sorted : sorted.slice(0, MAX_VISIBLE)
  const hasMore = sorted.length > MAX_VISIBLE

  return (
    <div className="space-y-2">
      {/* Timeline container */}
      <div className="relative pl-6">
        {/* Vertical connecting line */}
        <div
          className="absolute left-2 top-3 bottom-3 w-0.5"
          style={{ backgroundColor: 'var(--border, #1F2937)' }}
        />

        <AnimatePresence initial={false}>
          {visible.map((pos, i) => {
            const dotColor = DotColor({ pos })
            const yearLabel = pos._yearStart
              ? `${pos._yearStart} – ${pos.is_current ? 'Sekarang' : (pos._yearEnd || '?')}`
              : pos.is_current ? 'Sekarang' : '—'
            const duration = calcDuration(pos._yearStart, pos.is_current ? null : pos._yearEnd)

            return (
              <motion.div
                key={`${pos._title}-${pos._yearStart}-${i}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                className="relative mb-5 last:mb-0"
              >
                {/* Timeline dot */}
                <div
                  className="absolute -left-4 top-1.5 w-3 h-3 rounded-full border-2 flex-shrink-0"
                  style={{
                    backgroundColor: dotColor,
                    borderColor: 'var(--bg-card, #111827)',
                    zIndex: 1,
                  }}
                />

                {/* Card */}
                <div
                  className="ml-2 rounded-xl border p-3 transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-elevated, #1F2937)',
                    borderColor: pos.is_current
                      ? 'rgba(245,158,11,0.35)'
                      : pos.controversy || pos.is_corruption
                      ? 'rgba(239,68,68,0.30)'
                      : 'var(--border, #374151)',
                  }}
                >
                  {/* Year badge + title row */}
                  <div className="flex items-start gap-2 flex-wrap">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold flex-shrink-0"
                      style={{
                        backgroundColor: pos.is_current ? 'rgba(245,158,11,0.15)' : 'rgba(100,116,139,0.15)',
                        color: pos.is_current ? 'var(--accent-gold, #F59E0B)' : 'var(--text-secondary, #9CA3AF)',
                      }}
                    >
                      {yearLabel}
                    </span>
                    {pos.is_current && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        Aktif
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <p className="mt-1.5 text-sm font-semibold text-text-primary leading-snug">
                    {pos._title}
                  </p>

                  {/* Org + duration */}
                  <div className="flex items-center gap-2 flex-wrap mt-0.5">
                    {pos._org && (
                      <p className="text-xs text-text-secondary">{pos._org}</p>
                    )}
                    {pos._org && duration && (
                      <span className="text-text-secondary text-xs">·</span>
                    )}
                    {duration && (
                      <p className="text-xs" style={{ color: 'var(--text-muted, #6B7280)' }}>
                        {duration}
                      </p>
                    )}
                  </div>

                  {/* Optional description */}
                  {pos.description && (
                    <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">{pos.description}</p>
                  )}

                  {/* Controversy flag */}
                  {(pos.controversy || pos.is_corruption) && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
                      <span>⚠️</span>
                      <span>{pos.controversy || 'Terdapat catatan kontroversi'}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Expand/collapse button */}
      {hasMore && (
        <div className="pt-1 pl-6">
          <button
            onClick={() => setExpanded(prev => !prev)}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
          >
            {expanded
              ? '▲ Sembunyikan'
              : `▼ Lihat semua ${sorted.length} jabatan`}
          </button>
        </div>
      )}
    </div>
  )
}
