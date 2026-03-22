import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import MetaTags from '../../components/MetaTags'
import { CEK_FAKTA, VERDICT_META } from '../../data/cek_fakta'

// ─── Helpers ──────────────────────────────────────────────────────────────

function getInitials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Build avatar bg colour from name string
function avatarColor(name) {
  const palette = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
  ]
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff
  return palette[h % palette.length]
}

// ─── Stats Strip ──────────────────────────────────────────────────────────

function StatsStrip() {
  const total = CEK_FAKTA.length
  const counts = {}
  CEK_FAKTA.forEach(c => { counts[c.verdict] = (counts[c.verdict] || 0) + 1 })

  const chips = [
    { key: 'SALAH', emoji: '✗', label: 'Salah' },
    { key: 'BENAR', emoji: '✓', label: 'Benar' },
    { key: 'MENYESATKAN', emoji: '⚠', label: 'Menyesatkan' },
    { key: 'SEBAGIAN_BENAR', emoji: '◑', label: 'Sebagian Benar' },
    { key: 'TIDAK_TERBUKTI', emoji: '?', label: 'Tidak Terbukti' },
  ]

  return (
    <div className="bg-gradient-to-r from-bg-card to-bg-elevated border border-border rounded-xl p-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            🔎 Cek Fakta Politik Indonesia
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Klaim-klaim politisi diverifikasi berdasarkan data publik dan audit independen.
          </p>
        </div>

        {/* Stat pills */}
        <div className="flex flex-wrap gap-2 md:justify-end">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-elevated border border-border text-sm font-semibold text-text-primary">
            📋 {total} klaim
          </div>
          {chips.map(({ key, emoji, label }) => {
            const meta = VERDICT_META[key]
            const n = counts[key] || 0
            if (!n) return null
            return (
              <div
                key={key}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-semibold"
                style={{
                  color: meta.color,
                  borderColor: meta.color + '50',
                  background: meta.color + '15',
                }}
              >
                {emoji} {label}: {n}
              </div>
            )
          })}
        </div>
      </div>

      {/* Progress bar breakdown */}
      <div className="mt-4">
        <div className="flex h-2.5 rounded-full overflow-hidden gap-px">
          {chips.map(({ key }) => {
            const n = counts[key] || 0
            const pct = (n / total) * 100
            if (!pct) return null
            return (
              <div
                key={key}
                style={{ width: `${pct}%`, background: VERDICT_META[key].color }}
                title={`${VERDICT_META[key].label}: ${n}`}
              />
            )
          })}
        </div>
        <div className="flex flex-wrap gap-3 mt-2">
          {chips.map(({ key, label }) => {
            const n = counts[key] || 0
            if (!n) return null
            return (
              <span key={key} className="flex items-center gap-1 text-[11px] text-text-muted">
                <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: VERDICT_META[key].color }} />
                {label} ({Math.round((n / total) * 100)}%)
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Verdict Badge ────────────────────────────────────────────────────────

function VerdictBadge({ verdict, size = 'md' }) {
  const meta = VERDICT_META[verdict] || VERDICT_META.TIDAK_TERBUKTI
  const cls = size === 'lg'
    ? 'px-4 py-1.5 text-sm font-bold'
    : 'px-2.5 py-0.5 text-xs font-bold'
  return (
    <span
      className={`inline-flex items-center rounded-full border ${cls}`}
      style={{ color: meta.color, borderColor: meta.color + '60', background: meta.color + '18' }}
    >
      {meta.label}
    </span>
  )
}

// ─── Dampak Badge ─────────────────────────────────────────────────────────

const DAMPAK_META = {
  tinggi: { color: '#EF4444', label: '🔴 Dampak Tinggi' },
  sedang: { color: '#F59E0B', label: '🟡 Dampak Sedang' },
  rendah: { color: '#6B7280', label: '⚪ Dampak Rendah' },
}

function DampakBadge({ dampak }) {
  const meta = DAMPAK_META[dampak] || DAMPAK_META.rendah
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border"
      style={{ color: meta.color, borderColor: meta.color + '50', background: meta.color + '15' }}
    >
      {meta.label}
    </span>
  )
}

// ─── Fact Card ────────────────────────────────────────────────────────────

function FactCard({ item }) {
  const [expanded, setExpanded] = useState(false)
  const meta = VERDICT_META[item.verdict] || VERDICT_META.TIDAK_TERBUKTI
  const initials = getInitials(item.pembuat)
  const bgColor = avatarColor(item.pembuat)

  return (
    <article
      className="bg-bg-card border border-border rounded-xl overflow-hidden transition-all hover:shadow-lg hover:border-opacity-70 group"
      style={{ borderLeftWidth: 4, borderLeftColor: meta.color }}
    >
      {/* Card header: verdict + dampak */}
      <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-2">
        <VerdictBadge verdict={item.verdict} size="lg" />
        <DampakBadge dampak={item.dampak} />
      </div>

      {/* Quote */}
      <div className="px-4 pb-3">
        <blockquote className="text-text-primary text-base italic leading-relaxed border-l-2 pl-3 my-2"
          style={{ borderColor: meta.color + '60' }}>
          "{item.pernyataan}"
        </blockquote>
      </div>

      {/* Pembuat row */}
      <div className="px-4 pb-3 flex items-center gap-3">
        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow"
          style={{ background: bgColor }}
        >
          {initials}
        </div>
        <div className="min-w-0">
          {item.person_id ? (
            <Link
              to={`/persons/${item.person_id}`}
              className="font-semibold text-sm text-text-primary hover:text-accent-red transition-colors"
            >
              {item.pembuat}
            </Link>
          ) : (
            <span className="font-semibold text-sm text-text-primary">{item.pembuat}</span>
          )}
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-text-muted">📅 {formatDate(item.tanggal)}</span>
          </div>
        </div>
      </div>

      {/* Konteks */}
      <div className="px-4 pb-2">
        <p className="text-xs text-text-muted italic">
          🗣 {item.konteks}
        </p>
      </div>

      {/* Penjelasan */}
      <div className="px-4 pb-3">
        <div
          className={`text-sm text-text-secondary leading-relaxed rounded-lg p-3 border ${meta.bg} transition-all`}
        >
          <p className="font-semibold text-text-primary text-xs mb-1 uppercase tracking-wide">
            📌 Faktanya:
          </p>
          <p className={expanded ? '' : 'line-clamp-3'}>
            {item.penjelasan}
          </p>
          {item.penjelasan.length > 160 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-1 text-xs font-semibold hover:underline"
              style={{ color: meta.color }}
            >
              {expanded ? '↑ Tutup' : '↓ Baca selengkapnya'}
            </button>
          )}
        </div>
      </div>

      {/* Sources */}
      <div className="px-4 pb-4">
        <p className="text-xs text-text-muted mb-1.5 font-medium">🔗 Sumber:</p>
        <div className="flex flex-wrap gap-1.5">
          {item.sumber.map((src, i) => (
            <a
              key={i}
              href={`https://${src}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-bg-elevated border border-border text-xs text-text-secondary hover:text-text-primary hover:border-border-hover transition-all"
            >
              🌐 {src}
            </a>
          ))}
        </div>
      </div>
    </article>
  )
}

// ─── Filter Bar ───────────────────────────────────────────────────────────

const VERDICT_OPTIONS = ['Semua', 'SALAH', 'MENYESATKAN', 'SEBAGIAN_BENAR', 'BENAR', 'TIDAK_TERBUKTI']
const DAMPAK_OPTIONS = ['semua', 'tinggi', 'sedang', 'rendah']

function FilterBar({ verdictFilter, setVerdictFilter, personFilter, setPersonFilter, dampakFilter, setDampakFilter, search, setSearch }) {
  // Unique persons with at least one claim
  const persons = useMemo(() => {
    const seen = new Set()
    const list = []
    CEK_FAKTA.forEach(c => {
      if (c.person_id && !seen.has(c.person_id)) {
        seen.add(c.person_id)
        list.push({ id: c.person_id, name: c.pembuat })
      }
    })
    return list
  }, [])

  return (
    <div className="bg-bg-card border border-border rounded-xl p-4 space-y-3">
      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari klaim, nama, penjelasan..."
          className="w-full pl-9 pr-4 py-2 bg-bg-elevated border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-red transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary text-sm"
          >✕</button>
        )}
      </div>

      <div className="flex flex-wrap gap-3 items-end">
        {/* Verdict filter */}
        <div className="flex-1 min-w-[160px]">
          <label className="text-xs text-text-muted font-medium block mb-1">Verdict</label>
          <div className="flex flex-wrap gap-1">
            {VERDICT_OPTIONS.map(v => {
              const meta = v !== 'Semua' ? VERDICT_META[v] : null
              const isActive = verdictFilter === v
              return (
                <button
                  key={v}
                  onClick={() => setVerdictFilter(v)}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold border transition-all"
                  style={
                    isActive
                      ? { background: meta?.color || '#374151', color: '#fff', borderColor: meta?.color || '#374151' }
                      : { background: 'transparent', color: meta?.color || '#9CA3AF', borderColor: (meta?.color || '#6B7280') + '50' }
                  }
                >
                  {v === 'Semua' ? 'Semua' : VERDICT_META[v].label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Person filter */}
        <div className="min-w-[180px]">
          <label className="text-xs text-text-muted font-medium block mb-1">Pembuat</label>
          <select
            value={personFilter}
            onChange={e => setPersonFilter(e.target.value)}
            className="w-full px-3 py-1.5 bg-bg-elevated border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-red transition-colors"
          >
            <option value="">Semua pembuat</option>
            {persons.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Dampak filter */}
        <div className="min-w-[160px]">
          <label className="text-xs text-text-muted font-medium block mb-1">Dampak</label>
          <div className="flex gap-1">
            {DAMPAK_OPTIONS.map(d => {
              const meta = d !== 'semua' ? DAMPAK_META[d] : null
              const isActive = dampakFilter === d
              return (
                <button
                  key={d}
                  onClick={() => setDampakFilter(d)}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold border transition-all capitalize"
                  style={
                    isActive
                      ? { background: meta?.color || '#374151', color: '#fff', borderColor: meta?.color || '#374151' }
                      : { background: 'transparent', color: meta?.color || '#9CA3AF', borderColor: (meta?.color || '#6B7280') + '50' }
                  }
                >
                  {d === 'semua' ? 'Semua' : d}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Pembuat Chart ────────────────────────────────────────────────────────

function PembuatChart() {
  // Aggregate by person
  const data = useMemo(() => {
    const map = {}
    CEK_FAKTA.forEach(c => {
      const key = c.pembuat
      if (!map[key]) map[key] = { name: key, person_id: c.person_id, total: 0, by_verdict: {} }
      map[key].total++
      map[key].by_verdict[c.verdict] = (map[key].by_verdict[c.verdict] || 0) + 1
    })
    return Object.values(map).sort((a, b) => b.total - a.total).slice(0, 8)
  }, [])

  const maxTotal = data[0]?.total || 1
  const verdictOrder = ['SALAH', 'MENYESATKAN', 'SEBAGIAN_BENAR', 'TIDAK_TERBUKTI', 'BENAR']

  return (
    <div className="bg-bg-card border border-border rounded-xl p-5">
      <h2 className="text-base font-bold text-text-primary mb-4 flex items-center gap-2">
        👤 Pembuat Klaim Terbanyak
      </h2>
      <div className="space-y-3">
        {data.map(person => (
          <div key={person.name} className="group">
            <div className="flex items-center justify-between gap-3 mb-1">
              <div className="flex items-center gap-2 min-w-0">
                {/* Mini avatar */}
                <div
                  className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ background: avatarColor(person.name) }}
                >
                  {getInitials(person.name)}
                </div>
                {person.person_id ? (
                  <Link
                    to={`/persons/${person.person_id}`}
                    className="text-sm font-medium text-text-primary hover:text-accent-red truncate transition-colors"
                  >
                    {person.name}
                  </Link>
                ) : (
                  <span className="text-sm font-medium text-text-primary truncate">{person.name}</span>
                )}
              </div>
              <span className="text-xs font-bold text-text-muted flex-shrink-0">
                {person.total} klaim
              </span>
            </div>

            {/* Stacked bar */}
            <div className="h-3 rounded-full overflow-hidden bg-bg-elevated flex gap-px">
              {verdictOrder.map(v => {
                const n = person.by_verdict[v] || 0
                if (!n) return null
                const pct = (n / maxTotal) * 100
                return (
                  <div
                    key={v}
                    style={{ width: `${pct}%`, background: VERDICT_META[v].color }}
                    title={`${VERDICT_META[v].label}: ${n}`}
                    className="transition-all"
                  />
                )
              })}
            </div>

            {/* Mini legend for this bar */}
            <div className="flex flex-wrap gap-2 mt-1">
              {verdictOrder.map(v => {
                const n = person.by_verdict[v] || 0
                if (!n) return null
                return (
                  <span key={v} className="flex items-center gap-1 text-[10px] text-text-muted">
                    <span className="inline-block w-2 h-2 rounded-sm" style={{ background: VERDICT_META[v].color }} />
                    {VERDICT_META[v].label.replace(/^[^ ]+ /, '')}: {n}
                  </span>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Global legend */}
      <div className="mt-4 pt-3 border-t border-border flex flex-wrap gap-3">
        {verdictOrder.map(v => (
          <span key={v} className="flex items-center gap-1.5 text-xs text-text-muted">
            <span className="inline-block w-3 h-3 rounded-sm" style={{ background: VERDICT_META[v].color }} />
            {VERDICT_META[v].label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────

export default function CekFaktaPage() {
  const [verdictFilter, setVerdictFilter] = useState('Semua')
  const [personFilter, setPersonFilter] = useState('')
  const [dampakFilter, setDampakFilter] = useState('semua')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return CEK_FAKTA.filter(c => {
      if (verdictFilter !== 'Semua' && c.verdict !== verdictFilter) return false
      if (personFilter && c.person_id !== personFilter) return false
      if (dampakFilter !== 'semua' && c.dampak !== dampakFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (
          !c.pernyataan.toLowerCase().includes(q) &&
          !c.pembuat.toLowerCase().includes(q) &&
          !c.penjelasan.toLowerCase().includes(q) &&
          !c.konteks.toLowerCase().includes(q)
        ) return false
      }
      return true
    })
  }, [verdictFilter, personFilter, dampakFilter, search])

  const hasFilters = verdictFilter !== 'Semua' || personFilter || dampakFilter !== 'semua' || search

  return (
    <div className="space-y-6">
      <MetaTags
        title="Cek Fakta"
        description="Klaim-klaim politisi Indonesia yang diverifikasi — fakta vs fiksi dari para pemangku kekuasaan."
      />

      {/* Section 1: Stats */}
      <StatsStrip />

      {/* Section 2: Filters */}
      <FilterBar
        verdictFilter={verdictFilter}
        setVerdictFilter={setVerdictFilter}
        personFilter={personFilter}
        setPersonFilter={setPersonFilter}
        dampakFilter={dampakFilter}
        setDampakFilter={setDampakFilter}
        search={search}
        setSearch={setSearch}
      />

      {/* Active filter summary */}
      {hasFilters && (
        <div className="flex items-center gap-3 text-sm text-text-muted">
          <span>
            Menampilkan <strong className="text-text-primary">{filtered.length}</strong> dari{' '}
            <strong className="text-text-primary">{CEK_FAKTA.length}</strong> klaim
          </span>
          <button
            onClick={() => { setVerdictFilter('Semua'); setPersonFilter(''); setDampakFilter('semua'); setSearch('') }}
            className="text-xs text-accent-red hover:underline"
          >
            Reset filter
          </button>
        </div>
      )}

      {/* Section 3: Fact cards grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
          {filtered.map(item => (
            <FactCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-text-secondary">
          <div className="text-5xl mb-3">🔎</div>
          <p className="font-semibold text-text-primary">Tidak ada klaim yang cocok</p>
          <p className="text-sm mt-1">Coba ubah filter atau kata kunci pencarian.</p>
          <button
            onClick={() => { setVerdictFilter('Semua'); setPersonFilter(''); setDampakFilter('semua'); setSearch('') }}
            className="mt-4 px-4 py-2 bg-accent-red text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Reset semua filter
          </button>
        </div>
      )}

      {/* Section 4: Pembuat chart */}
      <PembuatChart />

      {/* Footer note */}
      <div className="border border-border rounded-xl p-4 bg-bg-elevated text-center">
        <p className="text-xs text-text-muted">
          Semua klaim diverifikasi berdasarkan data publik, laporan resmi, dan audit independen.
          Sumber tercantum di setiap kartu.{' '}
          <Link to="/investigasi" className="text-accent-red hover:underline">Lihat Investigasi →</Link>
          {' · '}
          <Link to="/kpk" className="text-accent-red hover:underline">KPK Cases →</Link>
        </p>
      </div>
    </div>
  )
}
