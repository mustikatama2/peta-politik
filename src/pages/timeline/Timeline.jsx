import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader, Card, Badge, Btn } from '../../components/ui'
import { TIMELINE_EVENTS, ERAS, CATEGORY_CONFIG } from '../../data/timeline_events'
import { PERSONS } from '../../data/persons'

// Build a lookup map for persons
const PERSON_MAP = Object.fromEntries(PERSONS.map(p => [p.id, p]))

// Month names in Indonesian
const MONTHS = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']

// Compute which era a year belongs to
function getEraForYear(year) {
  return ERAS.find(e => year >= e.years[0] && year < e.years[1]) || ERAS[ERAS.length - 1]
}

// Significance dots renderer
function SignificanceDots({ value }) {
  return (
    <div className="flex gap-0.5 items-center">
      {Array.from({ length: 10 }).map((_, i) => (
        <span
          key={i}
          className={`inline-block w-2 h-2 rounded-full ${i < value ? 'bg-accent-red' : 'bg-bg-elevated border border-border'}`}
        />
      ))}
    </div>
  )
}

// Stats bar
function StatsBar({ events }) {
  const yearCounts = {}
  events.forEach(e => { yearCounts[e.year] = (yearCounts[e.year] || 0) + 1 })
  const mostEventful = Object.entries(yearCounts).sort((a, b) => b[1] - a[1])[0]

  const highSig = [...events].filter(e => e.significance === 10).map(e => e.title.split('—')[0].trim()).slice(0, 3)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
      <div className="bg-bg-card border border-border rounded-xl p-4">
        <div className="text-2xl font-bold text-accent-red">{TIMELINE_EVENTS.length}</div>
        <div className="text-xs text-text-secondary mt-0.5">Total Peristiwa</div>
      </div>
      <div className="bg-bg-card border border-border rounded-xl p-4">
        <div className="text-2xl font-bold text-f59e0b" style={{ color: '#f59e0b' }}>
          {mostEventful ? mostEventful[0] : '—'}
        </div>
        <div className="text-xs text-text-secondary mt-0.5">
          Tahun tersibuk ({mostEventful ? mostEventful[1] : 0} peristiwa)
        </div>
      </div>
      <div className="bg-bg-card border border-border rounded-xl p-4 col-span-2 sm:col-span-1">
        <div className="text-sm font-semibold text-text-primary">🔴 Signifikansi 10/10</div>
        <div className="text-xs text-text-secondary mt-1 space-y-0.5">
          {highSig.map((t, i) => <div key={i} className="truncate">• {t}</div>)}
        </div>
      </div>
    </div>
  )
}

// Single event card
function EventCard({ event, persons }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = CATEGORY_CONFIG[event.category] || { color: '#6b7280', label: event.category, emoji: '📌' }
  const isHighlight = event.significance >= 9

  const linkedPersons = (event.person_ids || [])
    .map(id => PERSON_MAP[id])
    .filter(Boolean)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`
          bg-bg-card border rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md
          ${isHighlight
            ? 'border-l-4 border-border shadow-sm'
            : 'border-border'
          }
        `}
        style={isHighlight ? { borderLeftColor: cfg.color } : {}}
        onClick={() => setExpanded(v => !v)}
      >
        <div className="p-4">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge color={cfg.color}>{cfg.emoji} {cfg.label}</Badge>
              <span className="text-xs text-text-secondary">
                {MONTHS[(event.month || 1) - 1]} {event.year}
                {event.day ? ` · ${event.day}` : ''}
              </span>
            </div>
            <span className="text-text-muted text-xs flex-shrink-0">{expanded ? '▲' : '▼'}</span>
          </div>

          {/* Title */}
          <h3 className={`font-bold text-text-primary mb-1.5 leading-snug ${isHighlight ? 'text-base' : 'text-sm'}`}>
            {event.title}
          </h3>

          {/* Description */}
          <p className={`text-text-secondary text-xs leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
            {event.description}
          </p>

          {/* Expanded extra */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-3 pt-3 border-t border-border space-y-2">
                  {/* Source */}
                  <div className="text-xs text-text-secondary">
                    <span className="font-medium text-text-primary">Sumber:</span> {event.source}
                  </div>

                  {/* Person links */}
                  {linkedPersons.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-xs text-text-secondary">Tokoh:</span>
                      {linkedPersons.map(p => (
                        <Link
                          key={p.id}
                          to={`/persons/${p.id}`}
                          onClick={e => e.stopPropagation()}
                          className="text-xs px-2 py-0.5 rounded-full bg-bg-elevated border border-border text-text-primary hover:text-accent-red hover:border-accent-red transition-colors"
                        >
                          {p.name}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  {event.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {event.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-bg-elevated text-text-secondary border border-border"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
            <SignificanceDots value={event.significance} />
            <span className="text-[10px] text-text-muted">Signifikansi {event.significance}/10</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Timeline() {
  const [selectedEra, setSelectedEra] = useState(null)  // null = all
  const [selectedCategory, setSelectedCategory] = useState('semua')

  // Combined era group: SBY = sby1+sby2, Jokowi = jokowi1+jokowi2
  const ERA_TABS = [
    { id: null,          label: 'Semua',    color: '#6b7280' },
    { id: 'reformasi',   label: 'Reformasi', color: '#ef4444' },
    { id: 'sby',         label: 'SBY',       color: '#3b82f6' },
    { id: 'jokowi',      label: 'Jokowi',    color: '#f59e0b' },
    { id: 'prabowo',     label: 'Prabowo',   color: '#8B0000' },
  ]

  const CATEGORY_TABS = [
    { id: 'semua', label: 'Semua' },
    ...Object.entries(CATEGORY_CONFIG).map(([id, cfg]) => ({ id, label: cfg.label }))
  ]

  // Filter events
  const filtered = useMemo(() => {
    let evts = [...TIMELINE_EVENTS].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year
      if (a.month !== b.month) return a.month - b.month
      return (a.day || 1) - (b.day || 1)
    })

    if (selectedEra) {
      evts = evts.filter(e => {
        if (selectedEra === 'sby') return e.year >= 2004 && e.year < 2014
        if (selectedEra === 'jokowi') return e.year >= 2014 && e.year < 2024
        const era = ERAS.find(r => r.id === selectedEra)
        return era && e.year >= era.years[0] && e.year < era.years[1]
      })
    }

    if (selectedCategory !== 'semua') {
      evts = evts.filter(e => e.category === selectedCategory)
    }

    return evts
  }, [selectedEra, selectedCategory])

  // Group by year
  const byYear = useMemo(() => {
    const map = {}
    filtered.forEach(e => {
      if (!map[e.year]) map[e.year] = []
      map[e.year].push(e)
    })
    return Object.entries(map).sort((a, b) => Number(a[0]) - Number(b[0]))
  }, [filtered])

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="📅 Linimasa Politik Indonesia"
        subtitle="Perjalanan demokrasi 1998–2025 — memori kolektif bangsa"
      />

      {/* Stats bar */}
      <StatsBar events={filtered} />

      {/* Era tabs */}
      <div className="flex gap-2 flex-wrap mb-4">
        {ERA_TABS.map(era => (
          <button
            key={String(era.id)}
            onClick={() => setSelectedEra(era.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              selectedEra === era.id
                ? 'text-white border-transparent'
                : 'text-text-secondary border-border bg-bg-card hover:text-text-primary hover:border-text-secondary'
            }`}
            style={selectedEra === era.id ? { backgroundColor: era.color, borderColor: era.color } : {}}
          >
            {era.label}
          </button>
        ))}
      </div>

      {/* Category pills */}
      <div className="flex gap-1.5 flex-wrap mb-6">
        {CATEGORY_TABS.map(cat => {
          const cfg = CATEGORY_CONFIG[cat.id]
          const isActive = selectedCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                isActive
                  ? 'text-white border-transparent'
                  : 'text-text-secondary border-border bg-bg-card hover:text-text-primary'
              }`}
              style={isActive && cfg ? { backgroundColor: cfg.color, borderColor: cfg.color } : {}}
            >
              {cfg?.emoji ? `${cfg.emoji} ` : ''}{cat.label}
            </button>
          )
        })}
      </div>

      {/* Count */}
      <div className="text-xs text-text-secondary mb-5">
        Menampilkan <span className="font-semibold text-text-primary">{filtered.length}</span> dari {TIMELINE_EVENTS.length} peristiwa
      </div>

      {/* Vertical timeline */}
      <div className="relative">
        {/* Central line */}
        <div className="absolute left-[72px] top-0 bottom-0 w-px bg-border hidden sm:block" />

        <AnimatePresence mode="popLayout">
          {byYear.map(([year, events]) => {
            const era = getEraForYear(Number(year))
            return (
              <motion.div
                key={year}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-8"
              >
                {/* Year header */}
                <div className="flex items-center gap-4 mb-4">
                  {/* Year marker */}
                  <div
                    className="flex-shrink-0 w-16 text-right hidden sm:block"
                  >
                    <span
                      className="inline-block px-2 py-1 rounded-lg text-sm font-bold text-white"
                      style={{ backgroundColor: era.color }}
                    >
                      {year}
                    </span>
                  </div>

                  {/* Era label on desktop */}
                  <div className="hidden sm:flex items-center gap-2 pl-4">
                    <div
                      className="w-3 h-3 rounded-full ring-2 ring-bg-base"
                      style={{ backgroundColor: era.color }}
                    />
                    <span className="text-xs font-medium" style={{ color: era.color }}>
                      {era.label}
                    </span>
                  </div>

                  {/* Mobile year */}
                  <div className="sm:hidden flex items-center gap-2">
                    <span
                      className="inline-block px-2.5 py-1 rounded-lg text-sm font-bold text-white"
                      style={{ backgroundColor: era.color }}
                    >
                      {year}
                    </span>
                    <span className="text-xs" style={{ color: era.color }}>{era.label}</span>
                  </div>
                </div>

                {/* Events */}
                <div className="sm:pl-24 space-y-3">
                  {events.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {byYear.length === 0 && (
          <div className="text-center py-16 text-text-secondary">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm">Tidak ada peristiwa yang cocok dengan filter ini.</p>
            <button
              className="mt-3 text-xs text-accent-red underline"
              onClick={() => { setSelectedEra(null); setSelectedCategory('semua') }}
            >
              Reset filter
            </button>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-10 p-4 bg-bg-card border border-border rounded-xl">
        <h3 className="text-xs font-semibold text-text-secondary mb-3 uppercase tracking-wider">Legenda Kategori</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.entries(CATEGORY_CONFIG).map(([id, cfg]) => (
            <div key={id} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.color }} />
              <span className="text-xs text-text-secondary">{cfg.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
