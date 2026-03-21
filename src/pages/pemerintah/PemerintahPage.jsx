import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { CABINET_STRUCTURE, MINISTRY_PROGRAMS, getPersonPrograms } from '../../data/government'
import { PERSONS_MAP } from '../../data/persons'
import { PARTY_MAP } from '../../data/parties'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getPartyColor(party_id) {
  if (!party_id) return '#6b7280'
  return PARTY_MAP[party_id]?.color || '#6b7280'
}

function getPartyLabel(party_id) {
  if (!party_id) return 'Profesional'
  return PARTY_MAP[party_id]?.abbr || party_id.toUpperCase()
}

function getPartyEmoji(party_id) {
  if (!party_id) return '⭕'
  return PARTY_MAP[party_id]?.logo_emoji || '🎭'
}

function getInitials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

function getPhotoUrl(person_id, fallback = null) {
  if (person_id && PERSONS_MAP?.[person_id]?.photo_url) {
    return PERSONS_MAP[person_id].photo_url
  }
  return fallback
}

function daysSince(dateStr) {
  const start = new Date(dateStr)
  const now = new Date()
  return Math.floor((now - start) / (1000 * 60 * 60 * 24))
}

function fmtDuration(days) {
  const years = Math.floor(days / 365)
  const months = Math.floor((days % 365) / 30)
  const rem = days % 30
  if (years > 0) return `${years} thn ${months} bln`
  if (months > 0) return `${months} bln ${rem} hr`
  return `${days} hari`
}

function fmtRupiah(val) {
  if (!val) return '—'
  const t = val / 1_000_000_000_000
  if (t >= 1) return `Rp ${t.toFixed(1).replace('.', ',')} T`
  const b = val / 1_000_000_000
  if (b >= 1) return `Rp ${b.toFixed(0)} M`
  return `Rp ${(val / 1_000_000).toFixed(0)} jt`
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function PartyBadge({ party_id }) {
  const color = getPartyColor(party_id)
  const label = getPartyLabel(party_id)
  const emoji = getPartyEmoji(party_id)
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ backgroundColor: color + '22', color, border: `1px solid ${color}44` }}
    >
      {emoji} {label}
    </span>
  )
}

function StatusBadge({ status }) {
  const map = {
    ongoing: { label: 'Berjalan', cls: 'bg-blue-900/40 text-blue-300 border border-blue-700' },
    done:    { label: 'Selesai',  cls: 'bg-green-900/40 text-green-300 border border-green-700' },
    delayed: { label: 'Tertunda', cls: 'bg-amber-900/40 text-amber-300 border border-amber-700' },
  }
  const { label, cls } = map[status] || map.ongoing
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${cls}`}>
      {label}
    </span>
  )
}

function Avatar({ person_id, name, photoUrl: directUrl, size = 'md', partyColor }) {
  const url = getPhotoUrl(person_id) || directUrl || null
  const sizeClass = size === 'lg' ? 'w-20 h-20 text-lg' : size === 'sm' ? 'w-9 h-9 text-xs' : 'w-12 h-12 text-sm'
  const bg = partyColor || getPartyColor(null)

  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className={`${sizeClass} rounded-full object-cover border-2 border-border flex-shrink-0`}
        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling?.style?.removeProperty?.('display') }}
      />
    )
  }
  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 border-2`}
      style={{ backgroundColor: bg, borderColor: bg + '80' }}
    >
      {getInitials(name)}
    </div>
  )
}

// ─── Header: Progress Bar + Stats ────────────────────────────────────────────

function HeaderSection() {
  const INAUGURATION = '2024-10-20'
  const TERM_DAYS = 365 * 5
  const elapsed = daysSince(INAUGURATION)
  const pct = Math.min(100, (elapsed / TERM_DAYS) * 100)
  const latestRating = CABINET_STRUCTURE.approval_ratings.at(-1)

  return (
    <div className="bg-bg-card border border-border rounded-2xl p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        {/* Left: Title */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-text-primary mb-1">
            🏛️ Kabinet Merah Putih
          </h1>
          <p className="text-text-secondary text-sm mb-4">
            Pemerintahan Prabowo-Gibran · Dilantik 20 Oktober 2024 · Periode 2024–2029
          </p>

          {/* Progress bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-text-muted mb-1.5">
              <span>🗓️ Masa Jabatan</span>
              <span>{elapsed} hari / {TERM_DAYS} hari ({pct.toFixed(1)}%)</span>
            </div>
            <div className="h-2.5 bg-bg-elevated rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: 'linear-gradient(90deg, #dc2626, #f97316)',
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-text-muted mt-1">
              <span>Okt 2024</span>
              <span>Okt 2029</span>
            </div>
          </div>
        </div>

        {/* Right: Quick stats */}
        <div className="flex flex-wrap gap-3 md:flex-col md:items-end">
          <div className="text-center bg-bg-elevated rounded-xl px-4 py-3 min-w-[90px]">
            <p className="text-2xl font-bold text-text-primary">{elapsed}</p>
            <p className="text-[10px] text-text-muted">Hari Memerintah</p>
          </div>
          <div className="text-center bg-bg-elevated rounded-xl px-4 py-3 min-w-[90px]">
            <p className="text-2xl font-bold" style={{ color: latestRating.score >= 75 ? '#22c55e' : latestRating.score >= 60 ? '#f59e0b' : '#ef4444' }}>
              {latestRating.score}%
            </p>
            <p className="text-[10px] text-text-muted">Approval ({latestRating.label})</p>
          </div>
          <div className="text-center bg-bg-elevated rounded-xl px-4 py-3 min-w-[90px]">
            <p className="text-2xl font-bold text-text-primary">
              {CABINET_STRUCTURE.ministers.length + CABINET_STRUCTURE.coordinating_ministers.length + 2}
            </p>
            <p className="text-[10px] text-text-muted">Total Menteri</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Section 1: Presiden & Wapres ─────────────────────────────────────────────

function LeaderCard({ data, type }) {
  const days = daysSince(data.since)
  const { total: progTotal, controversies: progControversy } = getPersonPrograms(data.person_id)
  const partyColor = getPartyColor(data.party)

  return (
    <div
      className="bg-bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 hover:border-border-strong transition-all"
      style={{ borderTopColor: partyColor, borderTopWidth: 3 }}
    >
      {/* Avatar + name */}
      <div className="flex items-center gap-4">
        <Avatar
          person_id={data.person_id}
          name={data.name}
          photoUrl={data.photo_url}
          size="lg"
          partyColor={partyColor}
        />
        <div>
          <div className="flex items-center gap-2 mb-1">
            {type === 'president' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-900/40 text-amber-300 border border-amber-700 font-semibold">
                👑 Presiden
              </span>
            )}
            {type === 'vp' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/40 text-blue-300 border border-blue-700 font-semibold">
                🤝 Wakil Presiden
              </span>
            )}
          </div>
          <h2 className="text-lg font-bold text-text-primary leading-tight">{data.name}</h2>
          <p className="text-text-secondary text-xs mt-0.5">{data.short_title}</p>
        </div>
      </div>

      {/* Party + duration */}
      <div className="flex flex-wrap items-center gap-2">
        <PartyBadge party_id={data.party} />
        <span className="text-xs text-text-muted">📅 Sejak {data.since}</span>
        <span className="text-xs text-text-muted">⏱ {fmtDuration(days)}</span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-bg-elevated rounded-lg p-3 text-center">
          <p className="text-lg font-bold text-text-primary">{progTotal || '—'}</p>
          <p className="text-[10px] text-text-muted">Program</p>
        </div>
        <div className="bg-bg-elevated rounded-lg p-3 text-center">
          <p className={`text-lg font-bold ${progControversy > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {progControversy || '0'}
          </p>
          <p className="text-[10px] text-text-muted">Kontroversi</p>
        </div>
        <div className="bg-bg-elevated rounded-lg p-3 text-center">
          <p className="text-sm font-bold text-text-primary">{fmtRupiah(data.lhkpn_total)}</p>
          <p className="text-[10px] text-text-muted">LHKPN</p>
        </div>
      </div>

      {/* Approval rating mini gauge */}
      {type === 'president' && (
        <div>
          <div className="flex justify-between text-xs text-text-muted mb-1">
            <span>📊 Approval Rating</span>
            <span className="font-semibold text-green-400">
              {CABINET_STRUCTURE.approval_ratings.at(-1).score}%
            </span>
          </div>
          <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${CABINET_STRUCTURE.approval_ratings.at(-1).score}%`,
                background: 'linear-gradient(90deg, #22c55e, #86efac)',
              }}
            />
          </div>
        </div>
      )}

      {/* Link to profile */}
      {data.person_id && (
        <Link
          to={`/persons/${data.person_id}`}
          className="text-xs text-red-400 hover:text-red-300 hover:underline transition-colors self-start"
        >
          Lihat Profil →
        </Link>
      )}
    </div>
  )
}

function PresidencySection() {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-text-primary mb-4">👑 Kepala Negara & Kepala Pemerintahan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LeaderCard data={CABINET_STRUCTURE.president} type="president" />
        <LeaderCard data={CABINET_STRUCTURE.vice_president} type="vp" />
      </div>
    </section>
  )
}

// ─── Section 2: Menko Grid ────────────────────────────────────────────────────

function MenkoCard({ menko }) {
  const partyColor = getPartyColor(menko.party)
  const { total: progTotal, controversies } = getPersonPrograms(menko.person_id)
  const hasControversy = controversies > 0

  return (
    <div
      className="bg-bg-card border border-border rounded-xl p-4 flex flex-col gap-3 hover:border-border-strong transition-all group relative"
      style={{ borderLeftColor: partyColor, borderLeftWidth: 3 }}
    >
      {hasControversy && (
        <div className="absolute top-3 right-3">
          <span className="text-sm" title="Ada program kontroversial">🔴</span>
        </div>
      )}

      <div className="flex items-start gap-3">
        <Avatar
          person_id={menko.person_id}
          name={menko.name}
          size="md"
          partyColor={partyColor}
        />
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="text-text-primary font-semibold text-sm leading-snug">{menko.name}</h3>
          <p className="text-text-secondary text-[11px] leading-snug mt-0.5 line-clamp-2">{menko.title}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 items-center">
        <PartyBadge party_id={menko.party} />
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium"
          style={{ backgroundColor: '#1e293b', color: '#94a3b8', border: '1px solid #334155' }}
        >
          🏛️ {menko.ministry}
        </span>
      </div>

      {progTotal > 0 && (
        <div className="flex items-center gap-2 text-xs text-text-muted border-t border-border pt-2">
          <span>📋 {progTotal} program</span>
          {hasControversy && (
            <span className="text-red-400">· {controversies} kontroversi</span>
          )}
        </div>
      )}

      {menko.person_id && (
        <Link
          to={`/persons/${menko.person_id}`}
          className="text-xs text-red-400 hover:text-red-300 hover:underline transition-colors self-start"
        >
          Profil →
        </Link>
      )}
    </div>
  )
}

function MenkoSection() {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-text-primary mb-4">🤝 Menteri Koordinator</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {CABINET_STRUCTURE.coordinating_ministers.map((m) => (
          <MenkoCard key={m.person_id || m.name} menko={m} />
        ))}
      </div>
    </section>
  )
}

// ─── Section 3: Cabinet Table ─────────────────────────────────────────────────

function CabinetTable() {
  const [search, setSearch] = useState('')
  const [partyFilter, setPartyFilter] = useState('all')

  const allMinisters = CABINET_STRUCTURE.ministers

  const filtered = useMemo(() => {
    return allMinisters.filter(m => {
      const matchSearch = search.trim() === '' ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.ministry.toLowerCase().includes(search.toLowerCase()) ||
        m.title.toLowerCase().includes(search.toLowerCase())
      const matchParty = partyFilter === 'all' ||
        (partyFilter === 'independent' ? !m.party : m.party === partyFilter)
      return matchSearch && matchParty
    })
  }, [allMinisters, search, partyFilter])

  // Unique parties for filter
  const parties = useMemo(() => {
    const seen = new Set()
    allMinisters.forEach(m => seen.add(m.party || 'independent'))
    return Array.from(seen).sort()
  }, [allMinisters])

  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-text-primary mb-4">📋 Daftar Menteri Kabinet</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama, kementerian..."
            className="w-full bg-bg-elevated border border-border rounded-lg pl-9 pr-4 py-2 text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>
        <select
          value={partyFilter}
          onChange={e => setPartyFilter(e.target.value)}
          className="bg-bg-elevated border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-red-500 transition-colors"
        >
          <option value="all">Semua Partai</option>
          {parties.map(p => (
            <option key={p} value={p}>
              {p === 'independent' ? 'Profesional' : getPartyLabel(p)}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-elevated">
                <th className="text-left px-4 py-3 text-text-muted font-medium text-xs uppercase tracking-wider">Menteri</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Kementerian</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium text-xs uppercase tracking-wider hidden md:table-cell">Partai</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Sejak</th>
                <th className="text-center px-4 py-3 text-text-muted font-medium text-xs uppercase tracking-wider">Program</th>
                <th className="text-center px-4 py-3 text-text-muted font-medium text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((m) => {
                const { total: progTotal, controversies } = getPersonPrograms(m.person_id)
                const hasControversy = controversies > 0
                const partyColor = getPartyColor(m.party)
                const row = (
                  <tr
                    key={m.person_id || m.name}
                    className="hover:bg-bg-elevated/50 transition-colors group"
                  >
                    {/* Foto + Nama */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar person_id={m.person_id} name={m.name} size="sm" partyColor={partyColor} />
                        <div>
                          <p className="text-text-primary font-medium text-sm leading-snug">{m.name}</p>
                          <p className="text-text-muted text-[11px] line-clamp-1 sm:hidden">{m.ministry}</p>
                        </div>
                      </div>
                    </td>
                    {/* Kementerian */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="text-text-secondary text-xs">{m.title}</p>
                      <p className="text-text-muted text-[10px] mt-0.5">🏛️ {m.ministry}</p>
                    </td>
                    {/* Partai */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <PartyBadge party_id={m.party} />
                    </td>
                    {/* Sejak */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <p className="text-text-secondary text-xs">{m.since}</p>
                    </td>
                    {/* Program count */}
                    <td className="px-4 py-3 text-center">
                      {progTotal > 0 ? (
                        <span className="text-sm font-semibold text-text-primary">{progTotal}</span>
                      ) : (
                        <span className="text-text-muted text-xs">—</span>
                      )}
                      {hasControversy && <span className="ml-1 text-xs" title="Ada kontroversi">🔴</span>}
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3 text-center">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-900/40 text-blue-300 border border-blue-700"
                      >
                        Aktif
                      </span>
                    </td>
                  </tr>
                )

                return m.person_id ? (
                  <tr
                    key={m.person_id || m.name}
                    className="hover:bg-bg-elevated/50 transition-colors cursor-pointer group"
                    onClick={() => window.location.href = `/persons/${m.person_id}`}
                  >
                    {/* Foto + Nama */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar person_id={m.person_id} name={m.name} size="sm" partyColor={partyColor} />
                        <div>
                          <p className="text-text-primary font-medium text-sm leading-snug group-hover:text-red-400 transition-colors">
                            {m.name}
                          </p>
                          <p className="text-text-muted text-[11px] line-clamp-1 sm:hidden">{m.ministry}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="text-text-secondary text-xs">{m.title}</p>
                      <p className="text-text-muted text-[10px] mt-0.5">🏛️ {m.ministry}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <PartyBadge party_id={m.party} />
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <p className="text-text-secondary text-xs">{m.since}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {progTotal > 0 ? (
                        <span className="text-sm font-semibold text-text-primary">{progTotal}</span>
                      ) : (
                        <span className="text-text-muted text-xs">—</span>
                      )}
                      {hasControversy && <span className="ml-1 text-xs" title="Ada kontroversi">🔴</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-900/40 text-blue-300 border border-blue-700">
                        Aktif
                      </span>
                    </td>
                  </tr>
                ) : row
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-text-muted text-sm">
                    Tidak ada hasil untuk filter ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 border-t border-border bg-bg-elevated">
          <p className="text-xs text-text-muted">Menampilkan {filtered.length} dari {allMinisters.length} menteri</p>
        </div>
      </div>
    </section>
  )
}

// ─── Section 4: Approval Trend Chart ─────────────────────────────────────────

const CustomTooltipApproval = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-bg-card border border-border rounded-lg p-3 text-sm shadow-xl">
      <p className="font-semibold text-text-primary">{d.payload.label}</p>
      <p style={{ color: d.color }}>Approval: {d.value}%</p>
    </div>
  )
}

function ApprovalChart() {
  const data = CABINET_STRUCTURE.approval_ratings
  const first = data[0].score
  const last = data.at(-1).score
  const trend = last - first

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-text-primary">📊 Tren Approval Rating Pemerintah</h2>
        <span className={`text-sm font-semibold px-2 py-1 rounded-lg ${trend >= 0 ? 'text-green-400 bg-green-900/30' : 'text-red-400 bg-red-900/30'}`}>
          {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}% sejak Nov 2024
        </span>
      </div>
      <div className="bg-bg-card border border-border rounded-xl p-5">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="approvalGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={{ stroke: '#1e293b' }}
              tickLine={false}
            />
            <YAxis
              domain={[60, 90]}
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `${v}%`}
            />
            <Tooltip content={<CustomTooltipApproval />} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="url(#approvalGrad)"
              strokeWidth={2.5}
              dot={{ r: 5, fill: '#22c55e', stroke: '#15803d', strokeWidth: 2 }}
              activeDot={{ r: 7, fill: '#22c55e' }}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-text-muted mt-2 text-center">
          Sumber: Data simulasi berdasarkan rata-rata berbagai lembaga survei (Indikator, LSI, Populi Center)
        </p>
      </div>
    </section>
  )
}

// ─── Section 5: Programs Tracker ─────────────────────────────────────────────

function ProgramAccordion({ item }) {
  const [open, setOpen] = useState(false)
  const hasControversy = item.programs.some(p => p.controversy)

  return (
    <div className="border border-border rounded-xl overflow-hidden mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-bg-card hover:bg-bg-elevated transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          {item.person_id ? (
            <Avatar person_id={item.person_id} name={item.name} size="sm" partyColor="#6b7280" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-bg-elevated flex items-center justify-center text-text-muted text-xs border border-border flex-shrink-0">
              {getInitials(item.name)}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-text-primary font-semibold text-sm">{item.name}</span>
              {hasControversy && <span className="text-xs">🔴</span>}
            </div>
            <span className="text-text-muted text-[11px]">🏛️ {item.ministry} · {item.programs.length} program</span>
          </div>
        </div>
        <span className={`text-text-muted text-lg transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {open && (
        <div className="border-t border-border bg-bg-elevated divide-y divide-border">
          {item.programs.map((prog, idx) => (
            <div key={idx} className="px-5 py-4 flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-text-primary text-sm font-medium">{prog.name}</span>
                  {prog.controversy && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-900/40 text-red-300 border border-red-700">
                      🔴 Kontroversial
                    </span>
                  )}
                </div>
                {prog.desc && (
                  <p className="text-text-muted text-xs leading-relaxed">{prog.desc}</p>
                )}
              </div>
              <div className="flex-shrink-0">
                <StatusBadge status={prog.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ProgramsTracker() {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-text-primary mb-4">⚡ Tracker Program Prioritas Kementerian</h2>
      <div>
        {MINISTRY_PROGRAMS.map((item) => (
          <ProgramAccordion key={item.ministry} item={item} />
        ))}
      </div>
    </section>
  )
}

// ─── Page Root ────────────────────────────────────────────────────────────────

export default function PemerintahPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <HeaderSection />
      <PresidencySection />
      <MenkoSection />
      <CabinetTable />
      <ApprovalChart />
      <ProgramsTracker />

      {/* Footer note */}
      <div className="text-center py-6 text-xs text-text-muted border-t border-border mt-4">
        <p>Data Kabinet Merah Putih per Maret 2026. Susunan berdasarkan Perpres No. 139/2024.</p>
        <p className="mt-1">
          Lihat juga:{' '}
          <Link to="/kabinet" className="text-red-400 hover:underline">Kabinet Grid →</Link>
          {' · '}
          <Link to="/lhkpn" className="text-red-400 hover:underline">LHKPN →</Link>
          {' · '}
          <Link to="/anggaran" className="text-red-400 hover:underline">Efisiensi APBN →</Link>
        </p>
      </div>
    </div>
  )
}
