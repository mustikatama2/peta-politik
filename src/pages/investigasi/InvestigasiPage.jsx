import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { INVESTIGATIONS, INVESTIGATION_CATEGORIES } from '../../data/investigations'
import { PERSONS_MAP } from '../../data/persons'

// ── Severity config ──────────────────────────────────────────────────────────
const SEVERITY_CONFIG = {
  high:   { label: 'TINGGI',  emoji: '🔴', color: 'text-red-400',    bg: 'bg-red-900/30 border-red-700/50',   dot: 'bg-red-500' },
  medium: { label: 'SEDANG',  emoji: '🟡', color: 'text-yellow-400', bg: 'bg-yellow-900/30 border-yellow-700/50', dot: 'bg-yellow-500' },
  low:    { label: 'RENDAH',  emoji: '🟢', color: 'text-green-400',  bg: 'bg-green-900/30 border-green-700/50',  dot: 'bg-green-500' },
}

// ── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  ongoing:   { label: 'BERLANGSUNG', color: 'text-orange-400', bg: 'bg-orange-900/30 border-orange-700/50', pulse: true },
  closed:    { label: 'SELESAI',     color: 'text-slate-400',  bg: 'bg-slate-800/60 border-slate-700/50',   pulse: false },
  verdict:   { label: 'VONIS',       color: 'text-blue-400',   bg: 'bg-blue-900/30 border-blue-700/50',     pulse: false },
  terpidana: { label: 'TERPIDANA',   color: 'text-purple-400', bg: 'bg-purple-900/30 border-purple-700/50', pulse: false },
  tersangka: { label: 'TERSANGKA',   color: 'text-yellow-400', bg: 'bg-yellow-900/30 border-yellow-700/50', pulse: true },
  aktif:     { label: 'AKTIF',       color: 'text-orange-400', bg: 'bg-orange-900/30 border-orange-700/50', pulse: true },
  banding:   { label: 'BANDING',     color: 'text-cyan-400',   bg: 'bg-cyan-900/30 border-cyan-700/50',     pulse: false },
}

// ── PersonChip ───────────────────────────────────────────────────────────────
function PersonChip({ personId }) {
  const person = PERSONS_MAP[personId]
  if (!person) return null
  const initials = person.photo_placeholder || person.name.split(' ').map(w => w[0]).join('').slice(0, 2)
  return (
    <Link
      to={`/persons/${person.id}`}
      title={person.name}
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-xs text-white/70 hover:text-white flex-shrink-0"
      onClick={e => e.stopPropagation()}
    >
      <span className="w-4 h-4 rounded-full bg-red-700 flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0 overflow-hidden">
        {person.photo_url
          ? <img src={person.photo_url} alt={initials} className="w-full h-full object-cover rounded-full" />
          : initials}
      </span>
      <span className="truncate max-w-[80px]">{person.name.split(' ')[0]}</span>
    </Link>
  )
}

// ── TimelineItem ─────────────────────────────────────────────────────────────
function TimelineItem({ item, isLast }) {
  return (
    <div className="flex gap-3 text-xs">
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0" />
        {!isLast && <div className="w-px flex-1 bg-white/10 mt-1" />}
      </div>
      <div className="pb-3">
        <span className="text-text-muted font-mono">{item.date}</span>
        <p className="text-white/70 mt-0.5 leading-snug">{item.event}</p>
      </div>
    </div>
  )
}

// ── InvestigasiCard ───────────────────────────────────────────────────────────
function InvestigasiCard({ inv, isExpanded, onToggle }) {
  const sev = SEVERITY_CONFIG[inv.severity] || SEVERITY_CONFIG.medium
  const sta = STATUS_CONFIG[inv.status] || STATUS_CONFIG.ongoing
  const timelinePreview = inv.timeline.slice(-2)

  return (
    <div
      className={`rounded-xl border bg-bg-card transition-all duration-200 overflow-hidden ${
        isExpanded ? 'border-red-500/50 shadow-lg shadow-red-900/20' : 'border-border hover:border-border-strong'
      }`}
    >
      {/* Left severity bar */}
      <div className="flex">
        <div className={`w-1 flex-shrink-0 rounded-l-xl ${sev.dot}`} />
        <div className="flex-1 p-4">

          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {/* Severity */}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border tracking-wider ${sev.bg} ${sev.color}`}>
              {sev.emoji} {sev.label}
            </span>
            {/* Status */}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border tracking-wider ${sta.bg} ${sta.color}`}>
              {sta.pulse && (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-400" />
                </span>
              )}
              {sta.label}
            </span>
            {/* Category */}
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 text-white/50 tracking-wide">
              {inv.category}
            </span>
            {/* Lembaga */}
            {inv.lembaga && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-blue-900/20 border border-blue-700/30 text-blue-300/70 tracking-wide">
                ⚖️ {inv.lembaga}
              </span>
            )}
            {/* Nilai Kerugian */}
            {inv.nilai_kerugian && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-red-900/20 border border-red-700/30 text-red-300/80 font-mono tracking-wide">
                💰 {inv.nilai_kerugian}
              </span>
            )}
          </div>

          {/* Title */}
          <button
            onClick={onToggle}
            className="text-left w-full group"
          >
            <h3 className={`font-bold text-sm leading-snug transition-colors ${
              isExpanded ? 'text-red-300' : 'text-text-primary group-hover:text-red-300'
            }`}>
              {inv.title}
            </h3>
          </button>

          {/* Summary — truncated or full */}
          <div className="mt-2">
            <p className={`text-text-secondary text-xs leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
              {inv.summary}
            </p>
          </div>

          {/* Persons involved */}
          {inv.persons_involved?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {inv.persons_involved.map(pid => (
                <PersonChip key={pid} personId={pid} />
              ))}
            </div>
          )}

          {/* Timeline preview (last 2) */}
          {!isExpanded && inv.timeline?.length > 0 && (
            <div className="mt-3 space-y-0">
              {timelinePreview.map((item, i) => (
                <TimelineItem key={i} item={item} isLast={i === timelinePreview.length - 1} />
              ))}
              {inv.timeline.length > 2 && (
                <button
                  onClick={onToggle}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors mt-1 ml-4"
                >
                  + {inv.timeline.length - 2} event lainnya →
                </button>
              )}
            </div>
          )}

          {/* ── Expanded view ── */}
          {isExpanded && (
            <div className="mt-4 space-y-4 border-t border-white/5 pt-4">

              {/* Tersangka */}
              {inv.tersangka?.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">🎯 Tersangka / Terpidana</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {inv.tersangka.map((name, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-red-900/30 border border-red-700/30 text-red-300/80">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Full timeline */}
              {(inv.timeline || inv.kronologi)?.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">📅 Linimasa</h4>
                  <div className="space-y-0">
                    {(inv.timeline || []).map((item, i) => (
                      <TimelineItem key={i} item={item} isLast={i === (inv.timeline || []).length - 1} />
                    ))}
                  </div>
                </div>
              )}

              {/* Evidence */}
              {inv.evidence?.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">🔎 Bukti & Temuan</h4>
                  <ol className="space-y-1">
                    {inv.evidence.map((e, i) => (
                      <li key={i} className="flex gap-2 text-xs text-white/70">
                        <span className="text-red-400 font-bold flex-shrink-0 w-4">{i + 1}.</span>
                        <span>{e}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Dampak Politik */}
              {(inv.dampak_politik || inv.impact) && (
                <div>
                  <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">🗳️ Dampak Politik</h4>
                  <p className="text-xs text-amber-300/80 leading-relaxed bg-amber-900/20 border border-amber-700/30 rounded-lg p-2.5">
                    {inv.dampak_politik || inv.impact}
                  </p>
                </div>
              )}

              {/* Source links */}
              {inv.source_links?.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">🔗 Sumber</h4>
                  <div className="flex flex-wrap gap-2">
                    {inv.source_links.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="text-xs px-2.5 py-1 rounded-full bg-blue-900/30 border border-blue-700/30 text-blue-400 hover:bg-blue-900/50 hover:text-blue-300 transition-all"
                      >
                        ↗ {new URL(url).hostname.replace('www.', '')}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Collapse */}
              <button
                onClick={onToggle}
                className="text-xs text-white/30 hover:text-white/60 transition-colors mt-1"
              >
                ▲ Tutup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function InvestigasiSidebar({ investigations }) {
  // Top 5 persons by involvement count
  const personCounts = useMemo(() => {
    const counts = {}
    investigations.forEach(inv => {
      (inv.persons_involved || []).forEach(pid => {
        counts[pid] = (counts[pid] || 0) + 1
      })
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([pid, count]) => ({ pid, count, person: PERSONS_MAP[pid] }))
      .filter(x => x.person)
  }, [investigations])

  // Last 3 investigations by latest timeline date
  const recentCases = useMemo(() => {
    return [...investigations]
      .map(inv => ({
        ...inv,
        latestDate: inv.timeline?.length
          ? inv.timeline[inv.timeline.length - 1].date
          : '0000-00-00',
      }))
      .sort((a, b) => b.latestDate.localeCompare(a.latestDate))
      .slice(0, 3)
  }, [investigations])

  return (
    <aside className="hidden lg:flex flex-col gap-4 w-64 flex-shrink-0">
      {/* Top tokoh terlibat */}
      <div className="rounded-xl border border-border bg-bg-card p-4">
        <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">
          👤 Tokoh Paling Terlibat
        </h3>
        <div className="space-y-2">
          {personCounts.map(({ pid, count, person }, i) => (
            <Link
              key={pid}
              to={`/persons/${pid}`}
              className="flex items-center gap-2.5 group hover:bg-white/5 rounded-lg px-2 py-1.5 -mx-2 transition-all"
            >
              <span className="text-xs font-bold text-white/20 w-4 text-center flex-shrink-0">
                {i + 1}
              </span>
              <div className="w-7 h-7 rounded-full bg-red-900 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 overflow-hidden">
                {person.photo_url
                  ? <img src={person.photo_url} alt={person.photo_placeholder} className="w-full h-full object-cover" />
                  : person.photo_placeholder}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/80 group-hover:text-white truncate transition-colors leading-tight">
                  {person.name.split(' ').slice(0, 2).join(' ')}
                </p>
                <p className="text-[10px] text-white/30">{person.party_id?.toUpperCase()}</p>
              </div>
              <span className="text-[10px] font-bold text-red-400 bg-red-900/30 px-1.5 py-0.5 rounded flex-shrink-0">
                {count}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Kasus terbaru */}
      <div className="rounded-xl border border-border bg-bg-card p-4">
        <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">
          🕐 Kasus Terbaru
        </h3>
        <div className="space-y-3">
          {recentCases.map(inv => {
            const sev = SEVERITY_CONFIG[inv.severity] || SEVERITY_CONFIG.medium
            return (
              <div key={inv.id} className="space-y-1">
                <div className="flex items-start gap-2">
                  <span className="text-sm flex-shrink-0 mt-0.5">{sev.emoji}</span>
                  <p className="text-xs text-white/70 leading-snug line-clamp-2">{inv.title}</p>
                </div>
                <p className="text-[10px] text-white/30 pl-6">{inv.latestDate}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="rounded-xl border border-border bg-bg-card p-4">
        <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">
          📊 Statistik
        </h3>
        <div className="space-y-2">
          {Object.entries(STATUS_CONFIG).map(([key, conf]) => {
            const count = investigations.filter(i => i.status === key).length
            return (
              <div key={key} className="flex justify-between items-center">
                <span className={`text-xs ${conf.color}`}>{conf.label}</span>
                <span className="text-xs font-bold text-white/70">{count}</span>
              </div>
            )
          })}
          <div className="border-t border-white/5 pt-2 mt-2">
            {Object.entries(SEVERITY_CONFIG).map(([key, conf]) => {
              const count = investigations.filter(i => i.severity === key).length
              return (
                <div key={key} className="flex justify-between items-center mt-1">
                  <span className={`text-xs ${conf.color}`}>{conf.emoji} {conf.label}</span>
                  <span className="text-xs font-bold text-white/70">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </aside>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function InvestigasiPage() {
  const [expandedId, setExpandedId] = useState(null)
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [activeSeverity, setActiveSeverity] = useState('Semua')
  const [activeStatus, setActiveStatus] = useState('Semua')
  const [search, setSearch] = useState('')

  const updatedDate = useMemo(() => {
    const latest = INVESTIGATIONS.flatMap(inv => inv.timeline || [])
      .map(t => t.date)
      .sort()
      .pop() || '2026-03-01'
    return latest
  }, [])

  const filtered = useMemo(() => {
    return INVESTIGATIONS.filter(inv => {
      if (activeCategory !== 'Semua' && inv.category !== activeCategory) return false
      if (activeSeverity !== 'Semua') {
        const map = { Tinggi: 'high', Sedang: 'medium', Rendah: 'low' }
        if (inv.severity !== map[activeSeverity]) return false
      }
      if (activeStatus !== 'Semua') {
        const map = { Berlangsung: 'ongoing', Selesai: 'closed', Vonis: 'verdict' }
        const targetStatus = map[activeStatus]
        // Match both old and new status values: "Berlangsung" matches ongoing/aktif/tersangka
        if (activeStatus === 'Berlangsung') {
          if (!['ongoing', 'aktif', 'tersangka'].includes(inv.status)) return false
        } else if (activeStatus === 'Vonis') {
          if (!['verdict', 'terpidana', 'banding'].includes(inv.status)) return false
        } else if (targetStatus && inv.status !== targetStatus) {
          return false
        }
      }
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          inv.title.toLowerCase().includes(q) ||
          inv.summary.toLowerCase().includes(q) ||
          inv.category.toLowerCase().includes(q) ||
          (inv.persons_involved || []).some(pid => {
            const p = PERSONS_MAP[pid]
            return p && p.name.toLowerCase().includes(q)
          })
        )
      }
      return true
    })
  }, [activeCategory, activeSeverity, activeStatus, search])

  const handleToggle = (id) => {
    setExpandedId(prev => (prev === id ? null : id))
  }

  const FilterPill = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border whitespace-nowrap ${
        active
          ? 'bg-red-600 text-white border-red-500'
          : 'text-white/50 border-white/10 hover:text-white hover:border-white/30 bg-white/5'
      }`}
    >
      {children}
    </button>
  )

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-text-primary">🔍 Dossier Investigasi</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-red-900/50 border border-red-700/50 text-red-300 text-xs font-bold">
              {INVESTIGATIONS.length} KASUS
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-900/30 border border-orange-700/30 text-orange-400 text-xs font-semibold animate-pulse">
              ● LIVE
            </span>
          </div>
          <p className="text-text-muted text-sm mt-1">
            Investigasi dan kontroversi politik Indonesia yang terdokumentasi.{' '}
            <span className="text-white/30 text-xs font-mono">Diperbarui: {updatedDate}</span>
          </p>
        </div>
        {/* Filtered count */}
        {filtered.length !== INVESTIGATIONS.length && (
          <div className="flex-shrink-0 text-sm text-white/40">
            {filtered.length} / {INVESTIGATIONS.length}
          </div>
        )}
      </div>

      {/* ── Filter bar ── */}
      <div className="rounded-xl border border-border bg-bg-card p-3 space-y-3">
        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Cari kasus, tokoh, kategori..."
          className="w-full px-3 py-2 rounded-lg bg-bg-elevated border border-border text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-red-500/50 transition-colors"
        />

        {/* Categories */}
        <div className="flex flex-wrap gap-1.5">
          {['Semua', ...INVESTIGATION_CATEGORIES].map(cat => (
            <FilterPill
              key={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </FilterPill>
          ))}
        </div>

        {/* Severity + Status */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-white/30 uppercase tracking-widest">Tingkat</span>
            {['Semua', 'Tinggi', 'Sedang', 'Rendah'].map(s => (
              <FilterPill
                key={s}
                active={activeSeverity === s}
                onClick={() => setActiveSeverity(s)}
              >
                {s === 'Tinggi' ? '🔴 ' : s === 'Sedang' ? '🟡 ' : s === 'Rendah' ? '🟢 ' : ''}{s}
              </FilterPill>
            ))}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-white/30 uppercase tracking-widest">Status</span>
            {['Semua', 'Berlangsung', 'Selesai', 'Vonis'].map(s => (
              <FilterPill
                key={s}
                active={activeStatus === s}
                onClick={() => setActiveStatus(s)}
              >
                {s}
              </FilterPill>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content: grid + sidebar ── */}
      <div className="flex gap-5 items-start">
        {/* Left: card grid */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-white/30">
              <div className="text-4xl mb-3">🔎</div>
              <p className="font-semibold">Tidak ada kasus ditemukan</p>
              <p className="text-sm mt-1">Coba ubah filter atau kata kunci pencarian</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {filtered.map(inv => (
                <InvestigasiCard
                  key={inv.id}
                  inv={inv}
                  isExpanded={expandedId === inv.id}
                  onToggle={() => handleToggle(inv.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <InvestigasiSidebar investigations={INVESTIGATIONS} />
      </div>

      {/* Footer note */}
      <div className="text-center py-4 text-xs text-white/20 border-t border-white/5">
        Data investigasi dikompilasi dari laporan media, putusan pengadilan, dan dokumen publik.
        Untuk rujukan akademis, verifikasi ke sumber primer yang tercantum.
      </div>
    </div>
  )
}
