import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HISTORICAL_PERSONS, HISTORICAL_ERAS, KEY_EVENTS } from '../../data/historical'

// ── Helpers ──────────────────────────────────────────────────────────────────

function initials(name) {
  return name
    .split(' ')
    .filter(w => w.length > 2)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')
}

function formatWealth(usd) {
  if (!usd) return null
  if (usd >= 1_000_000_000) return `$${(usd / 1_000_000_000).toFixed(0)}B`
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(0)}M`
  return `$${usd.toLocaleString()}`
}

function eraColor(eraId) {
  const map = {
    kemerdekaan: { bg: 'bg-amber-800/40', text: 'text-amber-200', border: 'border-amber-700' },
    demokrasi_parlementer: { bg: 'bg-yellow-800/40', text: 'text-yellow-200', border: 'border-yellow-700' },
    demokrasi_terpimpin: { bg: 'bg-orange-800/40', text: 'text-orange-200', border: 'border-orange-700' },
    orde_baru: { bg: 'bg-red-900/40', text: 'text-red-200', border: 'border-red-800' },
    reformasi_awal: { bg: 'bg-green-800/40', text: 'text-green-200', border: 'border-green-700' },
    era_modern: { bg: 'bg-blue-800/40', text: 'text-blue-200', border: 'border-blue-700' },
  }
  return map[eraId] || { bg: 'bg-gray-800/40', text: 'text-yellow-200', border: 'border-gray-700' }
}

function eventTypeStyle(type) {
  const map = {
    founding: { dot: 'bg-amber-400', label: 'Fondasi', text: 'text-amber-300' },
    milestone: { dot: 'bg-green-400', label: 'Tonggak', text: 'text-green-300' },
    crisis: { dot: 'bg-red-400', label: 'Krisis', text: 'text-red-300' },
    election: { dot: 'bg-blue-400', label: 'Pemilu', text: 'text-blue-300' },
    battle: { dot: 'bg-orange-400', label: 'Pertempuran', text: 'text-orange-300' },
  }
  return map[type] || { dot: 'bg-gray-400', label: type, text: 'text-gray-300' }
}

// ── Era Card ─────────────────────────────────────────────────────────────────

function EraCard({ era, isActive, onClick }) {
  const colors = eraColor(era.id)
  return (
    <motion.button
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex-shrink-0 w-52 p-4 rounded-xl border text-left transition-all cursor-pointer ${
        isActive
          ? `${colors.bg} ${colors.border} border-2 shadow-lg`
          : 'bg-white/5 border-white/10 hover:bg-white/10'
      }`}
    >
      <div className={`text-xs font-bold mb-1 ${colors.text}`}>{era.years}</div>
      <div className="text-white font-semibold text-sm leading-tight mb-2">{era.label}</div>
      <div className="text-white/50 text-xs leading-snug">{era.key_event}</div>
      {isActive && (
        <div className={`mt-2 text-[10px] ${colors.text} font-medium`}>
          {era.figures.length} tokoh
        </div>
      )}
    </motion.button>
  )
}

// ── Person Card ───────────────────────────────────────────────────────────────

function PersonCard({ person, isExpanded, onToggle }) {
  const colors = eraColor(person.era_id)
  const wealth = formatWealth(person.wealth_estimate_usd)

  return (
    <motion.div
      layout
      className={`rounded-xl border overflow-hidden transition-all ${
        isExpanded
          ? `${colors.border} border-2 bg-gradient-to-br from-gray-900 to-gray-950`
          : 'border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20'
      }`}
    >
      {/* Card header — always visible */}
      <button
        onClick={onToggle}
        className="w-full p-4 text-left flex gap-3 items-start cursor-pointer"
      >
        {/* Avatar */}
        <div className="flex-shrink-0 relative">
          {person.photo_url ? (
            <img
              src={person.photo_url}
              alt={person.name}
              className="w-14 h-14 rounded-xl object-cover object-top border-2 border-white/10 sepia-[30%]"
              onError={e => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
          ) : null}
          <div
            className={`w-14 h-14 rounded-xl ${colors.bg} ${colors.text} font-bold text-lg items-center justify-center border border-white/10 ${
              person.photo_url ? 'hidden' : 'flex'
            }`}
          >
            {initials(person.name)}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-white font-semibold text-sm leading-tight truncate">{person.name}</h3>
              <p className="text-white/50 text-xs mt-0.5 leading-tight">{person.role}</p>
            </div>
            <span className="text-white/30 text-base flex-shrink-0 mt-0.5">{isExpanded ? '▲' : '▼'}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${colors.bg} ${colors.text}`}>
              {person.era}
            </span>
            {person.years_in_power && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                {person.years_in_power}
              </span>
            )}
            {wealth && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-900/50 text-yellow-300">
                💰 {wealth}
              </span>
            )}
          </div>
          {!isExpanded && (
            <p className="text-white/40 text-xs mt-2 line-clamp-2 leading-relaxed">
              {person.summary}
            </p>
          )}
        </div>
      </button>

      {/* Expanded dossier */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 space-y-4 border-t border-white/5 pt-3">

              {/* Bio */}
              <p className="text-white/70 text-sm leading-relaxed">{person.summary}</p>

              {/* Birth/Death + Party */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`rounded-lg p-3 ${colors.bg}`}>
                  <div className="text-[10px] text-white/40 uppercase tracking-wide mb-1">Lahir</div>
                  <div className="text-white/90 text-sm font-medium">{person.born}</div>
                  {person.birthplace && (
                    <div className="text-white/50 text-xs mt-0.5">{person.birthplace}</div>
                  )}
                </div>
                <div className="rounded-lg p-3 bg-white/5">
                  <div className="text-[10px] text-white/40 uppercase tracking-wide mb-1">Partai</div>
                  <div className="text-white/90 text-sm font-medium">{person.party || '—'}</div>
                  {person.died && (
                    <div className="text-white/50 text-xs mt-0.5">† {person.died}</div>
                  )}
                </div>
              </div>

              {/* Ideology */}
              {person.ideology && (
                <div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wide mb-1.5">Ideologi</div>
                  <div className="flex flex-wrap gap-1.5">
                    {person.ideology.split(', ').map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Legacy */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Positive */}
                {person.legacy_positive?.length > 0 && (
                  <div>
                    <div className="text-[10px] text-green-400 uppercase tracking-wide mb-1.5 font-semibold">
                      ✅ Warisan Positif
                    </div>
                    <ul className="space-y-1">
                      {person.legacy_positive.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-green-500 text-xs mt-0.5 flex-shrink-0">•</span>
                          <span className="text-white/65 text-xs leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Negative */}
                {person.legacy_negative?.length > 0 && (
                  <div>
                    <div className="text-[10px] text-red-400 uppercase tracking-wide mb-1.5 font-semibold">
                      ⚠️ Kontroversi &amp; Kritik
                    </div>
                    <ul className="space-y-1">
                      {person.legacy_negative.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-red-500 text-xs mt-0.5 flex-shrink-0">•</span>
                          <span className="text-white/65 text-xs leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Wealth */}
              {wealth && (
                <div className="rounded-lg p-3 bg-yellow-900/20 border border-yellow-800/40">
                  <div className="text-[10px] text-yellow-400 uppercase tracking-wide mb-1">
                    Estimasi Kekayaan (Transparency International)
                  </div>
                  <div className="text-yellow-200 text-xl font-bold">{wealth}</div>
                  <div className="text-yellow-400/60 text-xs mt-0.5">
                    USD · estimasi, tidak resmi
                  </div>
                </div>
              )}

              {/* Key connections */}
              {person.key_connections?.length > 0 && (
                <div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wide mb-1.5">
                    Koneksi Kunci
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {person.key_connections.map(id => {
                      const linked = HISTORICAL_PERSONS.find(p => p.id === id)
                      return (
                        <span
                          key={id}
                          className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/70 border border-white/10"
                        >
                          🔗 {linked?.name || id}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Cendana family */}
              {person.cendana_family?.length > 0 && (
                <div className="rounded-lg p-3 bg-red-900/20 border border-red-800/30">
                  <div className="text-[10px] text-red-400 uppercase tracking-wide mb-1.5">
                    Keluarga Cendana
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {person.cendana_family.map(m => (
                      <span key={m} className="text-xs px-2 py-0.5 rounded-full bg-red-900/40 text-red-200 border border-red-800/40">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Note if reference */}
              {person.note && (
                <div className="text-xs text-white/40 italic border border-white/5 rounded-lg p-2">
                  ℹ️ {person.note}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Timeline Event ────────────────────────────────────────────────────────────

function TimelineEvent({ event, index }) {
  const style = eventTypeStyle(event.type)
  const isLeft = index % 2 === 0

  return (
    <div className={`relative flex gap-4 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-start group`}>
      {/* Dot */}
      <div className="hidden md:flex flex-col items-center w-6 flex-shrink-0 mt-1">
        <div className={`w-4 h-4 rounded-full ${style.dot} ring-4 ring-gray-950 z-10 flex-shrink-0 group-hover:scale-125 transition-transform`} />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="flex-1 rounded-xl p-4 bg-white/5 border border-white/8 hover:bg-white/8 hover:border-white/15 transition-all max-w-lg"
      >
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`text-[10px] font-bold uppercase tracking-wide ${style.text}`}>
            {event.year} · {style.label}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mb-1">
          <span className={`w-2 h-2 rounded-full ${style.dot} flex-shrink-0 md:hidden`} />
          <h4 className="text-white font-semibold text-sm">{event.title}</h4>
        </div>
        <p className="text-white/55 text-xs leading-relaxed">{event.description}</p>
        {event.date !== String(event.year) && (
          <div className="text-white/30 text-[10px] mt-1.5">{event.date}</div>
        )}
      </motion.div>

      {/* Spacer for alternating layout */}
      <div className="hidden md:block flex-1 max-w-lg" />
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ArsipPage() {
  const [activeEra, setActiveEra] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPersons = useMemo(() => {
    let list = HISTORICAL_PERSONS
    if (activeEra) {
      list = list.filter(p => p.era_id === activeEra)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        p.era.toLowerCase().includes(q) ||
        p.party?.toLowerCase().includes(q)
      )
    }
    return list
  }, [activeEra, searchQuery])

  const activeEraData = HISTORICAL_ERAS.find(e => e.id === activeEra)

  const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id)
  const toggleEra = (id) => {
    setActiveEra(prev => prev === id ? null : id)
    setExpandedId(null)
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">

      {/* ── Header ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-950/60 via-gray-900 to-gray-950 border border-amber-800/30 p-6 md:p-8">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none select-none flex items-center justify-center text-[15rem] leading-none">
          📜
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 text-yellow-600/60 text-xs uppercase tracking-widest font-semibold mb-3">
            <span>PetaPolitik</span>
            <span>/</span>
            <span>Arsip Sejarah</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-yellow-200 mb-3">
            📜 Arsip Sejarah Politik Indonesia
          </h1>
          <p className="text-amber-100/60 text-base md:text-lg leading-relaxed max-w-2xl">
            Dossier tokoh-tokoh yang membentuk Indonesia — dari proklamator kemerdekaan, arsitek Orde Baru,
            hingga penggerak Reformasi. Sejarah adalah peta masa depan.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <div className="px-3 py-1.5 rounded-full bg-amber-900/50 border border-amber-700/50 text-amber-200 text-sm">
              🏛️ {HISTORICAL_PERSONS.length} Tokoh Bersejarah
            </div>
            <div className="px-3 py-1.5 rounded-full bg-amber-900/50 border border-amber-700/50 text-amber-200 text-sm">
              📅 {HISTORICAL_ERAS.length} Era Politik
            </div>
            <div className="px-3 py-1.5 rounded-full bg-amber-900/50 border border-amber-700/50 text-amber-200 text-sm">
              ⚡ {KEY_EVENTS.length} Momen Penentu
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 1: Era Timeline ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-yellow-200">🗓️ Linimasa Era Politik</h2>
            <p className="text-white/40 text-sm mt-0.5">Pilih era untuk menyaring tokoh di bawah</p>
          </div>
          {activeEra && (
            <button
              onClick={() => { setActiveEra(null); setExpandedId(null) }}
              className="text-xs text-white/40 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 transition-all"
            >
              Semua Era ×
            </button>
          )}
        </div>

        {/* Scrollable era cards */}
        <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-none">
          {HISTORICAL_ERAS.map(era => (
            <EraCard
              key={era.id}
              era={era}
              isActive={activeEra === era.id}
              onClick={() => toggleEra(era.id)}
            />
          ))}
        </div>

        {/* Active era description */}
        <AnimatePresence mode="wait">
          {activeEraData && (
            <motion.div
              key={activeEraData.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`mt-3 rounded-xl p-4 border ${eraColor(activeEraData.id).bg} ${eraColor(activeEraData.id).border}`}
            >
              <div className={`text-sm font-semibold ${eraColor(activeEraData.id).text} mb-1`}>
                {activeEraData.label} ({activeEraData.years})
              </div>
              <p className="text-white/60 text-sm">{activeEraData.description}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── Section 2: Historical Figures Grid ── */}
      <section>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-yellow-200">👤 Tokoh Bersejarah</h2>
            <p className="text-white/40 text-sm mt-0.5">
              {filteredPersons.length} tokoh ditampilkan
              {activeEra ? ` — era ${activeEraData?.label}` : ''}
            </p>
          </div>
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">🔍</span>
            <input
              type="text"
              placeholder="Cari tokoh, era, partai..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-yellow-600/50 w-52"
            />
          </div>
        </div>

        {filteredPersons.length === 0 ? (
          <div className="text-center py-12 text-white/30">
            <div className="text-4xl mb-3">🔍</div>
            <div>Tidak ada tokoh ditemukan untuk filter ini.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPersons.map(person => (
              <PersonCard
                key={person.id}
                person={person}
                isExpanded={expandedId === person.id}
                onToggle={() => toggleExpand(person.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Section 3: Key Events Timeline ── */}
      <section>
        <div className="mb-6">
          <h2 className="text-lg font-bold text-yellow-200">⚡ Momen Penentu Sejarah Politik</h2>
          <p className="text-white/40 text-sm mt-0.5">Peristiwa-peristiwa yang mengubah arah Indonesia</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6">
          {[
            { type: 'founding', label: 'Fondasi' },
            { type: 'milestone', label: 'Tonggak' },
            { type: 'crisis', label: 'Krisis' },
            { type: 'election', label: 'Pemilu' },
            { type: 'battle', label: 'Pertempuran' },
          ].map(({ type, label }) => {
            const s = eventTypeStyle(type)
            return (
              <div key={type} className="flex items-center gap-1.5 text-xs text-white/50">
                <div className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
                <span>{label}</span>
              </div>
            )
          })}
        </div>

        {/* Timeline — vertical with alternating sides on desktop */}
        <div className="relative space-y-4">
          {/* Vertical line on desktop */}
          <div className="hidden md:block absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-amber-700/50 via-white/10 to-transparent" />

          {KEY_EVENTS.map((event, i) => (
            <TimelineEvent key={`${event.year}-${i}`} event={event} index={i} />
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-8 rounded-xl p-4 bg-white/3 border border-white/5 text-white/30 text-xs text-center leading-relaxed">
          Data bersumber dari catatan sejarah Indonesia, literatur akademis, dan laporan internasional.
          Estimasi kekayaan berdasarkan laporan Transparency International. Ini adalah ringkasan edukatif, bukan dokumen hukum.
        </div>
      </section>
    </div>
  )
}
