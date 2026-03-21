import { useState, useMemo } from 'react'
import { ORMAS } from '../../data/ormas'
import { PARTY_MAP } from '../../data/parties'
import { PageHeader, Card, Badge, KPICard } from '../../components/ui'

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatMember(n) {
  if (!n) return 'N/A'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)} juta`
  if (n >= 1000) return `${(n / 1000).toFixed(0)} ribu`
  return n.toString()
}

const STANCE_CONFIG = {
  'pro-pemerintah': { label: 'Pro Prabowo', icon: '🟢', color: '#22c55e', variant: 'status-selesai' },
  'netral':         { label: 'Netral',      icon: '🟡', color: '#f59e0b', variant: 'risk-sedang'  },
  'oposisi':        { label: 'Oposisi',     icon: '🔴', color: '#ef4444', variant: 'status-ingkar' },
}

const TYPE_LABELS = {
  keagamaan:     '🕌 Keagamaan',
  kepemudaan:    '🏃 Kepemudaan',
  kemahasiswaan: '🎓 Kemahasiswaan',
  buruh:         '⚒️ Buruh',
  profesi:       '💼 Profesi',
  nasionalis:    '🦅 Nasionalis',
}

// ── Mini Bar Chart (horizontal) ───────────────────────────────────────────────
function HBar({ label, count, max, color }) {
  const pct = max > 0 ? (count / max) * 100 : 0
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-24 text-right text-text-secondary truncate">{label}</span>
      <div className="flex-1 bg-bg-elevated rounded-full h-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color || '#ef4444' }}
        />
      </div>
      <span className="w-6 text-text-primary font-medium">{count}</span>
    </div>
  )
}

// ── Donut Chart (SVG) ─────────────────────────────────────────────────────────
function DonutChart({ segments }) {
  const total = segments.reduce((s, g) => s + g.value, 0)
  if (total === 0) return null
  const r = 40
  const circumference = 2 * Math.PI * r
  let offset = 0
  const cx = 60, cy = 60

  return (
    <svg viewBox="0 0 120 120" className="w-28 h-28 -rotate-90">
      {segments.map((seg, i) => {
        const frac = seg.value / total
        const dash = frac * circumference
        const el = (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="18"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
          />
        )
        offset += dash
        return el
      })}
      {/* Center hole already visible via fill=none and strokeWidth */}
    </svg>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function OrmasList() {
  const [typeFilter, setTypeFilter] = useState('all')
  const [stanceFilter, setStanceFilter] = useState('all')
  const [partyFilter, setPartyFilter] = useState('all')
  const [search, setSearch] = useState('')

  // ── Derived stats ──────────────────────────────────────────────────────────
  const totalMembers = ORMAS.reduce((s, o) => s + (o.members_est || 0), 0)

  const typeBreakdown = useMemo(() => {
    const counts = {}
    ORMAS.forEach(o => { counts[o.type] = (counts[o.type] || 0) + 1 })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [])

  const partyInfluence = useMemo(() => {
    const counts = {}
    ORMAS.forEach(o => {
      if (o.political_alignment) {
        counts[o.political_alignment] = (counts[o.political_alignment] || 0) + 1
      }
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
  }, [])

  const stanceCounts = useMemo(() => {
    const c = { 'pro-pemerintah': 0, netral: 0, oposisi: 0 }
    ORMAS.forEach(o => { if (c[o.current_stance] !== undefined) c[o.current_stance]++ })
    return c
  }, [])

  const donutSegments = [
    { label: 'Pro', color: '#22c55e', value: stanceCounts['pro-pemerintah'] },
    { label: 'Netral', color: '#f59e0b', value: stanceCounts.netral },
    { label: 'Oposisi', color: '#ef4444', value: stanceCounts.oposisi },
  ]

  const maxPartyCount = partyInfluence.length > 0 ? partyInfluence[0][1] : 1
  const maxTypeCount  = typeBreakdown.length > 0   ? typeBreakdown[0][1]  : 1

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return ORMAS.filter(o => {
      if (typeFilter !== 'all' && o.type !== typeFilter) return false
      if (stanceFilter !== 'all' && o.current_stance !== stanceFilter) return false
      if (partyFilter !== 'all' && o.political_alignment !== partyFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (!o.name.toLowerCase().includes(q) && !o.abbr?.toLowerCase().includes(q) && !o.description?.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [typeFilter, stanceFilter, partyFilter, search])

  const allTypes   = [...new Set(ORMAS.map(o => o.type))]
  const allParties = [...new Set(ORMAS.map(o => o.political_alignment).filter(Boolean))]

  return (
    <div className="space-y-6">
      <PageHeader
        title="🏛️ Ormas & Organisasi Masyarakat"
        subtitle="Organisasi kemasyarakatan, keagamaan, profesi, dan buruh yang berpengaruh dalam politik Indonesia"
      />

      {/* ── KPI Cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Total Ormas" value={ORMAS.length} sub="Dalam database" icon="🏛️" />
        <KPICard label="Est. Total Anggota" value={`~${formatMember(totalMembers)}`} sub="Gabungan semua ormas" icon="👥" />
        <KPICard label="Pro Prabowo" value={stanceCounts['pro-pemerintah']} sub="Ormas pendukung" icon="🟢" color="#22c55e" />
        <KPICard label="Oposisi / Kritis" value={stanceCounts.oposisi} sub="Ormas oposisi" icon="🔴" color="#ef4444" />
      </div>

      {/* ── Stats Section ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Breakdown by Type */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">📊 Sebaran Jenis Ormas</h3>
          <div className="space-y-2">
            {typeBreakdown.map(([type, count]) => (
              <HBar
                key={type}
                label={TYPE_LABELS[type] || type}
                count={count}
                max={maxTypeCount}
                color="#3b82f6"
              />
            ))}
          </div>
        </Card>

        {/* Party Influence Map */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">🗳️ Afiliasi Partai Terkuat</h3>
          <div className="space-y-2">
            {partyInfluence.map(([pid, count]) => {
              const party = PARTY_MAP[pid]
              return (
                <HBar
                  key={pid}
                  label={party ? `${party.logo_emoji} ${party.abbr}` : pid.toUpperCase()}
                  count={count}
                  max={maxPartyCount}
                  color={party?.color || '#6b7280'}
                />
              )
            })}
          </div>
        </Card>

        {/* Government Stance Donut */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">🎯 Sikap terhadap Pemerintah Prabowo</h3>
          <div className="flex items-center gap-4">
            <DonutChart segments={donutSegments} />
            <div className="space-y-2 flex-1">
              {donutSegments.map(s => (
                <div key={s.label} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-text-secondary">{s.label}</span>
                  </div>
                  <span className="font-semibold text-text-primary">{s.value}</span>
                </div>
              ))}
              <p className="text-xs text-text-muted mt-2">Total: {ORMAS.length} ormas</p>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Stance Breakdown ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['pro-pemerintah', 'netral', 'oposisi'].map(stance => {
          const cfg = STANCE_CONFIG[stance]
          const list = ORMAS.filter(o => o.current_stance === stance)
          return (
            <Card key={stance} className="p-4">
              <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-1.5">
                {cfg.icon} {cfg.label}
                <span className="ml-auto text-xs font-normal text-text-secondary">{list.length} ormas</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {list.map(o => (
                  <span
                    key={o.id}
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: cfg.color + '22', color: cfg.color, border: `1px solid ${cfg.color}44` }}
                  >
                    {o.abbr || o.name}
                  </span>
                ))}
              </div>
            </Card>
          )
        })}
      </div>

      {/* ── Filter Bar ──────────────────────────────────────────────────────── */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Search */}
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs text-text-secondary mb-1">🔍 Cari Ormas</label>
            <input
              type="text"
              placeholder="Nama, singkatan..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-3 py-1.5 text-sm rounded-lg border border-border bg-bg-elevated text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-red"
            />
          </div>
          {/* Type */}
          <div>
            <label className="block text-xs text-text-secondary mb-1">📂 Jenis</label>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 text-sm rounded-lg border border-border bg-bg-elevated text-text-primary focus:outline-none focus:border-accent-red"
            >
              <option value="all">Semua Jenis</option>
              {allTypes.map(t => <option key={t} value={t}>{TYPE_LABELS[t] || t}</option>)}
            </select>
          </div>
          {/* Stance */}
          <div>
            <label className="block text-xs text-text-secondary mb-1">🎯 Sikap</label>
            <select
              value={stanceFilter}
              onChange={e => setStanceFilter(e.target.value)}
              className="px-3 py-1.5 text-sm rounded-lg border border-border bg-bg-elevated text-text-primary focus:outline-none focus:border-accent-red"
            >
              <option value="all">Semua Sikap</option>
              <option value="pro-pemerintah">🟢 Pro Prabowo</option>
              <option value="netral">🟡 Netral</option>
              <option value="oposisi">🔴 Oposisi</option>
            </select>
          </div>
          {/* Party */}
          <div>
            <label className="block text-xs text-text-secondary mb-1">🎭 Afiliasi Partai</label>
            <select
              value={partyFilter}
              onChange={e => setPartyFilter(e.target.value)}
              className="px-3 py-1.5 text-sm rounded-lg border border-border bg-bg-elevated text-text-primary focus:outline-none focus:border-accent-red"
            >
              <option value="all">Semua Partai</option>
              {allParties.map(pid => {
                const party = PARTY_MAP[pid]
                return <option key={pid} value={pid}>{party ? `${party.logo_emoji} ${party.abbr}` : pid}</option>
              })}
            </select>
          </div>
          {/* Reset */}
          {(typeFilter !== 'all' || stanceFilter !== 'all' || partyFilter !== 'all' || search) && (
            <button
              onClick={() => { setTypeFilter('all'); setStanceFilter('all'); setPartyFilter('all'); setSearch('') }}
              className="px-3 py-1.5 text-sm rounded-lg border border-border bg-bg-elevated text-text-secondary hover:text-accent-red hover:border-accent-red transition-all"
            >
              ✕ Reset
            </button>
          )}
          <span className="text-xs text-text-muted self-end pb-1.5">{filtered.length} dari {ORMAS.length} ormas</span>
        </div>
      </Card>

      {/* ── Ormas Cards Grid ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map(ormas => {
          const stanceCfg = STANCE_CONFIG[ormas.current_stance] || STANCE_CONFIG.netral
          const party = ormas.political_alignment ? PARTY_MAP[ormas.political_alignment] : null

          return (
            <Card
              key={ormas.id}
              className="p-5"
              style={ormas.color ? { borderLeftColor: ormas.color, borderLeftWidth: 3 } : {}}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{ormas.logo_emoji}</span>
                  <div>
                    <h3 className="text-base font-bold text-text-primary">{ormas.name}</h3>
                    {ormas.abbr !== ormas.name && (
                      <p className="text-xs text-text-secondary">{ormas.abbr}</p>
                    )}
                  </div>
                </div>
                {/* Stance badge */}
                <span
                  className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                  style={{ backgroundColor: stanceCfg.color + '22', color: stanceCfg.color, border: `1px solid ${stanceCfg.color}44` }}
                >
                  {stanceCfg.icon} {stanceCfg.label}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-text-secondary leading-relaxed mb-3">{ormas.description}</p>

              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs mb-3">
                <div>
                  <span className="text-text-secondary">Ketua: </span>
                  <span className="text-text-primary">{ormas.leader_name || '—'}</span>
                </div>
                <div>
                  <span className="text-text-secondary">Berdiri: </span>
                  <span className="text-text-primary">{ormas.founded}</span>
                </div>
                <div>
                  <span className="text-text-secondary">Jenis: </span>
                  <span className="text-text-primary capitalize">{TYPE_LABELS[ormas.type] || ormas.type}</span>
                </div>
                <div>
                  <span className="text-text-secondary">Anggota: </span>
                  <span className="text-text-primary font-medium" style={{ color: ormas.color || undefined }}>
                    {ormas.members_est ? `~${formatMember(ormas.members_est)}` : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Key figures chips */}
              {ormas.key_figures?.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-text-secondary mb-1">Tokoh Kunci:</p>
                  <div className="flex flex-wrap gap-1">
                    {ormas.key_figures.map(f => (
                      <span key={f} className="text-xs px-2 py-0.5 bg-bg-elevated text-text-secondary rounded-full border border-border">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Political alignment badge */}
              <div className="flex flex-wrap items-center gap-2">
                {party && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"
                    style={{ backgroundColor: party.color + '22', color: party.color, border: `1px solid ${party.color}44` }}
                  >
                    {party.logo_emoji} {party.abbr}
                  </span>
                )}
                {ormas.related_party_ids?.filter(pid => pid !== ormas.political_alignment).map(pid => {
                  const p = PARTY_MAP[pid]
                  if (!p) return null
                  return (
                    <span
                      key={pid}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: p.color + '15', color: p.color }}
                    >
                      {p.logo_emoji} {p.abbr}
                    </span>
                  )
                })}
                {ormas.influence && (
                  <span className="ml-auto text-xs text-text-muted">
                    Pengaruh: {'⭐'.repeat(Math.min(ormas.influence, 5))}
                  </span>
                )}
              </div>

              {/* Controversy */}
              {ormas.controversy && (
                <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-xs text-red-700 dark:text-red-400">
                    ⚠️ {ormas.controversy}
                  </p>
                </div>
              )}

              {/* Regions */}
              {ormas.regions?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {ormas.regions.map(r => (
                    <span key={r} className="text-xs px-1.5 py-0.5 bg-bg-elevated text-text-secondary rounded">
                      {r}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-4xl mb-2">🔍</p>
          <p className="text-text-secondary">Tidak ada ormas yang cocok dengan filter.</p>
          <button
            onClick={() => { setTypeFilter('all'); setStanceFilter('all'); setPartyFilter('all'); setSearch('') }}
            className="mt-3 text-xs text-accent-red underline"
          >
            Reset filter
          </button>
        </Card>
      )}
    </div>
  )
}
