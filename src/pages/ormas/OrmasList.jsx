import { useState, useMemo } from 'react'
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
} from 'recharts'
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
  advokasi:      '⚖️ Advokasi/LSM',
  olahraga:      '🏅 Olahraga',
}

const TIPE_PENGARUH_CONFIG = {
  elektoral: { label: 'Elektoral',  color: '#3b82f6', emoji: '🗳️' },
  advokasi:  { label: 'Advokasi',   color: '#8b5cf6', emoji: '📣' },
  jalanan:   { label: 'Jalanan',    color: '#ef4444', emoji: '✊' },
  bisnis:    { label: 'Bisnis',     color: '#f59e0b', emoji: '💼' },
  spiritual: { label: 'Spiritual',  color: '#10b981', emoji: '🕌' },
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
    </svg>
  )
}

// ── Bubble Chart Tooltip ───────────────────────────────────────────────────────
function BubbleTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  const tipeCfg = TIPE_PENGARUH_CONFIG[d.tipe_pengaruh] || {}
  return (
    <div className="bg-bg-card border border-border rounded-lg shadow-lg p-3 text-xs max-w-[200px]">
      <p className="font-bold text-text-primary text-sm mb-1">{d.logo_emoji} {d.abbr || d.name}</p>
      <p className="text-text-secondary">{d.name}</p>
      <div className="mt-2 space-y-1">
        <p><span className="text-text-secondary">Anggota: </span><span className="text-text-primary font-medium">{d.members_est ? `~${formatMember(d.members_est)}` : 'N/A'}</span></p>
        <p><span className="text-text-secondary">Pengaruh: </span><span className="font-bold" style={{ color: tipeCfg.color }}>{d.pengaruh_score}/100</span></p>
        <p><span className="text-text-secondary">Tipe: </span><span className="text-text-primary">{tipeCfg.emoji} {tipeCfg.label}</span></p>
        <p><span className="text-text-secondary">Sikap: </span><span className="text-text-primary">{STANCE_CONFIG[d.current_stance]?.icon} {STANCE_CONFIG[d.current_stance]?.label}</span></p>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function OrmasList() {
  const [typeFilter, setTypeFilter] = useState('all')
  const [stanceFilter, setStanceFilter] = useState('all')
  const [partyFilter, setPartyFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [vocalFilter, setVocalFilter] = useState('semua')

  // ── Derived stats ──────────────────────────────────────────────────────────
  const totalMembers = ORMAS.reduce((s, o) => s + (o.members_est || 0), 0)

  const typeBreakdown = useMemo(() => {
    const counts = {}
    ORMAS.forEach(o => { counts[o.type] = (counts[o.type] || 0) + 1 })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [])

  const partyInfluence = useMemo(() => {
    const counts = {}
    const scores = {}
    ORMAS.forEach(o => {
      if (o.political_alignment) {
        counts[o.political_alignment] = (counts[o.political_alignment] || 0) + 1
        scores[o.political_alignment] = (scores[o.political_alignment] || 0) + (o.pengaruh_score || o.influence * 10 || 0)
      }
    })
    return Object.entries(counts)
      .map(([pid, cnt]) => ({ pid, cnt, totalScore: scores[pid] || 0 }))
      .sort((a, b) => b.totalScore - a.totalScore)
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

  const maxPartyScore = partyInfluence.length > 0 ? partyInfluence[0].totalScore : 1
  const maxTypeCount  = typeBreakdown.length > 0   ? typeBreakdown[0][1]  : 1

  // ── Bubble chart data ──────────────────────────────────────────────────────
  const bubbleData = useMemo(() => {
    return ORMAS
      .filter(o => o.pengaruh_score && o.members_est)
      .map(o => ({
        ...o,
        x: o.members_est / 1_000_000, // in millions
        y: o.pengaruh_score,
        z: o.political_alignment ? 40 : 20,
      }))
  }, [])

  const bubbleByTipe = useMemo(() => {
    const groups = {}
    bubbleData.forEach(o => {
      const t = o.tipe_pengaruh || 'advokasi'
      if (!groups[t]) groups[t] = []
      groups[t].push(o)
    })
    return groups
  }, [bubbleData])

  // ── Political alignment breakdown ─────────────────────────────────────────
  const alignmentGroups = useMemo(() => {
    const groups = { 'pro-pemerintah': [], netral: [], oposisi: [] }
    ORMAS.forEach(o => {
      if (groups[o.current_stance]) groups[o.current_stance].push(o)
    })
    return groups
  }, [])

  // ── Ormas Paling Vokal ────────────────────────────────────────────────────
  const vocalOrmas = useMemo(() => {
    const filtered = ORMAS.filter(o => o.controversy || o.current_stance === 'oposisi')
      .sort((a, b) => (b.pengaruh_score || 0) - (a.pengaruh_score || 0))
    if (vocalFilter === 'semua') return filtered
    if (vocalFilter === 'kritis') return filtered.filter(o => o.current_stance === 'oposisi')
    if (vocalFilter === 'pro') return ORMAS.filter(o => o.current_stance === 'pro-pemerintah')
      .sort((a, b) => (b.pengaruh_score || 0) - (a.pengaruh_score || 0))
    return filtered.filter(o => o.current_stance === 'netral')
  }, [vocalFilter])

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
        subtitle="Organisasi kemasyarakatan, keagamaan, profesi, advokasi, dan buruh yang berpengaruh dalam politik Indonesia"
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

        {/* Party Influence Map — now sorted by aggregate influence score */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">🗳️ Afiliasi Partai — Skor Pengaruh</h3>
          <div className="space-y-2">
            {partyInfluence.map(({ pid, cnt, totalScore }) => {
              const party = PARTY_MAP[pid]
              return (
                <div key={pid} className="flex items-center gap-2 text-xs">
                  <span className="w-24 text-right text-text-secondary truncate">
                    {party ? `${party.logo_emoji} ${party.abbr}` : pid.toUpperCase()}
                  </span>
                  <div className="flex-1 bg-bg-elevated rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(totalScore / maxPartyScore) * 100}%`, backgroundColor: party?.color || '#6b7280' }}
                    />
                  </div>
                  <span className="w-16 text-text-muted text-right">{cnt} org · {totalScore}</span>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-text-muted mt-2">* Skor = jumlah pengaruh_score per afiliasi</p>
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

      {/* ── Influence Bubble Chart ──────────────────────────────────────────── */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-1">🔵 Peta Pengaruh Ormas — Anggota vs Skor Pengaruh</h3>
        <p className="text-xs text-text-muted mb-4">X = jumlah anggota (juta) · Y = skor pengaruh politik (0–100) · Warna = tipe pengaruh</p>
        <ResponsiveContainer width="100%" height={320}>
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #374151)" opacity={0.4} />
            <XAxis
              type="number"
              dataKey="x"
              name="Anggota"
              unit=" jt"
              tick={{ fontSize: 11, fill: 'var(--color-text-secondary, #9ca3af)' }}
              label={{ value: 'Anggota (juta)', position: 'insideBottom', offset: -10, fontSize: 11, fill: 'var(--color-text-secondary, #9ca3af)' }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Pengaruh"
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: 'var(--color-text-secondary, #9ca3af)' }}
              label={{ value: 'Skor Pengaruh', angle: -90, position: 'insideLeft', offset: 10, fontSize: 11, fill: 'var(--color-text-secondary, #9ca3af)' }}
            />
            <ZAxis type="number" dataKey="z" range={[60, 200]} />
            <Tooltip content={<BubbleTooltip />} />
            <Legend
              verticalAlign="top"
              wrapperStyle={{ fontSize: 12, paddingBottom: 8 }}
              formatter={(value) => {
                const cfg = TIPE_PENGARUH_CONFIG[value] || { label: value }
                return cfg.emoji + ' ' + cfg.label
              }}
            />
            {Object.entries(bubbleByTipe).map(([tipe, data]) => {
              const cfg = TIPE_PENGARUH_CONFIG[tipe] || { color: '#6b7280', label: tipe, emoji: '•' }
              return (
                <Scatter key={tipe} name={tipe} data={data} fill={cfg.color}>
                  {data.map((entry) => (
                    <Cell key={entry.id} fill={cfg.color} fillOpacity={0.8} />
                  ))}
                </Scatter>
              )
            })}
          </ScatterChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3 mt-3 justify-center">
          {Object.entries(TIPE_PENGARUH_CONFIG).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1.5 text-xs">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: v.color }} />
              <span className="text-text-secondary">{v.emoji} {v.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Political Alignment Map ─────────────────────────────────────────── */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">🗺️ Peta Afiliasi Politik — Dukungan Masyarakat Sipil per Partai</h3>
        <div className="overflow-x-auto">
          <div className="flex flex-wrap gap-3 min-w-[500px]">
            {partyInfluence.map(({ pid, cnt, totalScore }) => {
              const party = PARTY_MAP[pid]
              const ormasInParty = ORMAS.filter(o => o.political_alignment === pid)
                .sort((a, b) => (b.pengaruh_score || 0) - (a.pengaruh_score || 0))
              return (
                <div
                  key={pid}
                  className="flex-1 min-w-[140px] rounded-xl p-3 border"
                  style={{
                    borderColor: (party?.color || '#6b7280') + '55',
                    backgroundColor: (party?.color || '#6b7280') + '0d',
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{party?.logo_emoji || '🏛️'}</span>
                    <div>
                      <p className="text-xs font-bold text-text-primary">{party?.abbr || pid.toUpperCase()}</p>
                      <p className="text-xs text-text-muted">Skor: {totalScore}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {ormasInParty.slice(0, 4).map(o => (
                      <div key={o.id} className="flex items-center justify-between text-xs">
                        <span className="text-text-secondary truncate mr-1">{o.logo_emoji} {o.abbr || o.name}</span>
                        <span className="font-semibold text-text-primary flex-shrink-0" style={{ color: party?.color || undefined }}>
                          {o.pengaruh_score}
                        </span>
                      </div>
                    ))}
                    {ormasInParty.length > 4 && (
                      <p className="text-xs text-text-muted">+{ormasInParty.length - 4} lainnya</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      {/* ── Ormas Paling Vokal ───────────────────────────────────────────────── */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">📢 Ormas Paling Vokal & Berpengaruh</h3>
            <p className="text-xs text-text-muted mt-0.5">Berdasarkan kontroversi dan pernyataan publik</p>
          </div>
          <div className="flex gap-2">
            {[
              { key: 'semua', label: 'Semua', color: '#6b7280' },
              { key: 'kritis', label: '🔴 Kritis', color: '#ef4444' },
              { key: 'pro', label: '🟢 Pro', color: '#22c55e' },
              { key: 'netral', label: '🟡 Netral', color: '#f59e0b' },
            ].map(btn => (
              <button
                key={btn.key}
                onClick={() => setVocalFilter(btn.key)}
                className="text-xs px-3 py-1.5 rounded-full border transition-all"
                style={{
                  borderColor: vocalFilter === btn.key ? btn.color : 'var(--color-border, #374151)',
                  backgroundColor: vocalFilter === btn.key ? btn.color + '22' : 'transparent',
                  color: vocalFilter === btn.key ? btn.color : 'var(--color-text-secondary, #9ca3af)',
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {vocalOrmas.slice(0, 10).map(o => {
            const stanceCfg = STANCE_CONFIG[o.current_stance] || STANCE_CONFIG.netral
            const tipeCfg = TIPE_PENGARUH_CONFIG[o.tipe_pengaruh] || {}
            return (
              <div
                key={o.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-border bg-bg-elevated"
              >
                <span className="text-2xl flex-shrink-0 mt-0.5">{o.logo_emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-sm text-text-primary">{o.abbr || o.name}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: stanceCfg.color + '22', color: stanceCfg.color }}
                    >
                      {stanceCfg.icon} {stanceCfg.label}
                    </span>
                    {tipeCfg.emoji && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: tipeCfg.color + '22', color: tipeCfg.color }}
                      >
                        {tipeCfg.emoji} {tipeCfg.label}
                      </span>
                    )}
                    <span className="ml-auto text-xs font-bold" style={{ color: tipeCfg.color || '#6b7280' }}>
                      ⚡ {o.pengaruh_score}
                    </span>
                  </div>
                  {o.controversy && (
                    <p className="text-xs text-red-400 dark:text-red-400 leading-relaxed">
                      ⚠️ {o.controversy}
                    </p>
                  )}
                  {!o.controversy && (
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">{o.description}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

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
          const tipeCfg = TIPE_PENGARUH_CONFIG[ormas.tipe_pengaruh] || null

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

              {/* Political alignment + influence score */}
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
                {tipeCfg && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                    style={{ backgroundColor: tipeCfg.color + '22', color: tipeCfg.color }}
                  >
                    {tipeCfg.emoji} {tipeCfg.label}
                  </span>
                )}
                {ormas.pengaruh_score && (
                  <span className="ml-auto text-xs font-bold" style={{ color: tipeCfg?.color || '#6b7280' }}>
                    ⚡ {ormas.pengaruh_score}/100
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
