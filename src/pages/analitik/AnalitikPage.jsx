import { useMemo, useState } from 'react'
import {
  ComposedChart, ScatterChart, Scatter, XAxis, YAxis, ZAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell, ReferenceLine, Line,
} from 'recharts'
import { PERSONS } from '../../data/persons'
import { PARTIES, PARTY_MAP } from '../../data/parties'
import { CONNECTIONS } from '../../data/connections'
import { PROVINCES } from '../../data/regions'
import { GDP_PROVINCES } from '../../data/gdp'
import {
  scoreAllPersons, scoreAllParties, scoreAllProvincesFromData,
  pearsonR, spearmanR, linearRegression, interpretR, descStats, KIM_PLUS,
} from '../../lib/scoring'

// ─── ISLAND COLORS ────────────────────────────────────────────────────────────
const ISLAND_COLORS = {
  'Sumatera':     '#f59e0b',
  'Jawa':         '#3b82f6',
  'Bali-Nusra':   '#8b5cf6',
  'Kalimantan':   '#10b981',
  'Sulawesi':     '#ef4444',
  'Maluku':       '#06b6d4',
  'Papua':        '#6366f1',
}

const ISLANDS = Object.keys(ISLAND_COLORS)

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color = '#ef4444' }) {
  return (
    <div className="bg-bg-card rounded-xl border border-border p-4">
      <p className="text-xs text-text-muted mb-1">{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      {sub && <p className="text-xs text-text-muted mt-0.5">{sub}</p>}
    </div>
  )
}

function ScoreBadge({ score }) {
  const color = score >= 70 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold"
      style={{ backgroundColor: color + '22', color }}
    >
      {score.toFixed(1)}
    </span>
  )
}

function ProgressBar({ value, max = 100, color = '#ef4444', height = 6 }) {
  return (
    <div className="w-full rounded-full bg-bg-elevated overflow-hidden" style={{ height }}>
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${Math.max(0, Math.min(100, (value / max) * 100))}%`, backgroundColor: color }}
      />
    </div>
  )
}

function PartyBadge({ partyId }) {
  const party = PARTY_MAP[partyId]
  if (!party) return <span className="text-xs text-text-muted">-</span>
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
      style={{ backgroundColor: party.color + '22', color: party.color, border: `1px solid ${party.color}44` }}
    >
      {party.logo_emoji} {party.abbr}
    </span>
  )
}

function RiskBadge({ risk }) {
  const map = {
    rendah:    { label: 'Rendah',    color: '#22c55e' },
    sedang:    { label: 'Sedang',    color: '#f59e0b' },
    tinggi:    { label: 'Tinggi',    color: '#f97316' },
    tersangka: { label: 'Tersangka', color: '#ef4444' },
    terpidana: { label: 'Terpidana', color: '#7f1d1d' },
  }
  const { label, color } = map[risk] || map.rendah
  return (
    <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: color + '22', color }}>
      {label}
    </span>
  )
}

// ─── CUSTOM SCATTER TOOLTIP ───────────────────────────────────────────────────
function ScatterTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div className="bg-bg-card border border-border rounded-lg p-3 shadow-xl text-xs">
      <p className="font-bold text-text-primary mb-1">{d.name}</p>
      <p className="text-text-muted">Pulau: <span className="text-text-primary">{d.island}</span></p>
      <p className="text-text-muted">Gov Score: <span className="font-bold" style={{ color: '#3b82f6' }}>{d.x?.toFixed(1)}</span></p>
      <p className="text-text-muted">PDRB Growth: <span className="font-bold" style={{ color: '#10b981' }}>{d.y?.toFixed(2)}%</span></p>
      {d.sector && <p className="text-text-muted">Sektor: {d.sector}</p>}
    </div>
  )
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'individu',   label: 'Skor Individu',  icon: '👤' },
  { id: 'partai',     label: 'Skor Partai',    icon: '🎭' },
  { id: 'provinsi',   label: 'Skor Provinsi',  icon: '🗺️' },
  { id: 'gdp',        label: 'Korelasi GDP',   icon: '📈' },
  { id: 'metodologi', label: 'Metodologi',     icon: '📖' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 1: SKOR INDIVIDU
// ═══════════════════════════════════════════════════════════════════════════════
function TabIndividu({ personScores }) {
  const [filterTier, setFilterTier] = useState('all')
  const [filterParty, setFilterParty] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return personScores.filter(p => {
      if (filterTier !== 'all' && p.tier !== filterTier) return false
      if (filterParty !== 'all' && p.party_id !== filterParty) return false
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [personScores, filterTier, filterParty, search])

  const stats = useMemo(() => descStats(personScores.map(p => p.total)), [personScores])
  const partyIds = useMemo(() => [...new Set(personScores.map(p => p.party_id).filter(Boolean))], [personScores])

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Tokoh" value={stats.n} sub="dalam database" color="#3b82f6" />
        <StatCard label="Skor Tertinggi" value={stats.max} sub={personScores[0]?.name} color="#f59e0b" />
        <StatCard label="Rata-rata Skor" value={stats.mean} sub={`Std: ${stats.std}`} color="#8b5cf6" />
        <StatCard label="Median Skor" value={stats.median} sub="50th percentile" color="#10b981" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="🔍 Cari nama..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-bg-elevated text-text-primary text-sm focus:outline-none focus:border-accent-red w-48"
        />
        <select
          value={filterTier}
          onChange={e => setFilterTier(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-bg-elevated text-text-primary text-sm focus:outline-none"
        >
          <option value="all">Semua Tier</option>
          <option value="nasional">Nasional</option>
          <option value="regional">Regional</option>
        </select>
        <select
          value={filterParty}
          onChange={e => setFilterParty(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-bg-elevated text-text-primary text-sm focus:outline-none"
        >
          <option value="all">Semua Partai</option>
          {partyIds.map(id => (
            <option key={id} value={id}>{PARTY_MAP[id]?.abbr || id}</option>
          ))}
        </select>
        <span className="px-3 py-2 text-sm text-text-muted">
          Menampilkan {filtered.length} tokoh
        </span>
      </div>

      {/* Table */}
      <div className="bg-bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-elevated">
                <th className="text-left px-4 py-3 text-text-muted font-medium w-12">#</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium">Nama</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium hidden md:table-cell">Posisi</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium hidden sm:table-cell">Partai</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium hidden lg:table-cell">Risiko</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium w-40">Skor Total</th>
                <th className="text-right px-4 py-3 text-text-muted font-medium w-16">Nilai</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => {
                const globalRank = personScores.indexOf(p) + 1
                const rowBg = globalRank <= 10 ? 'bg-yellow-500/5' : globalRank <= 25 ? 'bg-gray-500/5' : ''
                const rankColor = globalRank <= 10 ? '#f59e0b' : globalRank <= 25 ? '#9ca3af' : '#6b7280'
                return (
                  <tr key={p.id} className={`border-b border-border/50 hover:bg-bg-elevated/50 transition-colors ${rowBg}`}>
                    <td className="px-4 py-3 font-bold text-sm" style={{ color: rankColor }}>
                      {globalRank <= 10 ? '🥇' : globalRank <= 25 ? '🥈' : ''} {globalRank}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-xs font-bold text-text-muted flex-shrink-0">
                          {p.photo_placeholder || p.name[0]}
                        </div>
                        <span className="font-medium text-text-primary">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-muted text-xs hidden md:table-cell max-w-xs truncate">
                      {p.position_title}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <PartyBadge partyId={p.party_id} />
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <RiskBadge risk={p.corruption_risk} />
                    </td>
                    <td className="px-4 py-3 w-40">
                      <div className="space-y-1">
                        <ProgressBar value={p.position_score} max={40} color="#3b82f6" height={3} />
                        <ProgressBar value={p.network_score} max={20} color="#10b981" height={3} />
                        <ProgressBar value={p.party_score} max={20} color="#8b5cf6" height={3} />
                        <ProgressBar value={p.lhkpn_score} max={10} color="#f59e0b" height={3} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ScoreBadge score={p.total} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-text-muted">
        <span className="flex items-center gap-1"><span className="w-3 h-1.5 rounded bg-blue-500 inline-block" /> Posisi (0–40)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-1.5 rounded bg-emerald-500 inline-block" /> Jaringan (0–20)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-1.5 rounded bg-violet-500 inline-block" /> Partai (0–20)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-1.5 rounded bg-amber-500 inline-block" /> LHKPN (0–10)</span>
        <span className="flex items-center gap-1 ml-4"><span className="text-yellow-500">🥇</span> Top 10 · <span className="text-gray-400">🥈</span> Top 25</span>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 2: SKOR PARTAI
// ═══════════════════════════════════════════════════════════════════════════════
function TabPartai({ partyScores, provincesData }) {
  const kimPlusCount = provincesData.filter(p => p.is_kim_plus).length
  const kimPctProv = Math.round((kimPlusCount / 38) * 100)

  const chartData = partyScores.filter(p => p.seats > 0 || p.total > 0)

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Partai di DPR" value={partyScores.filter(p => p.seats > 0).length} sub="lolos parliamentary threshold" color="#3b82f6" />
        <StatCard
          label="KIM Plus — Provinsi"
          value={`${kimPlusCount}/38`}
          sub={`${kimPctProv}% provinsi dikuasai koalisi`}
          color="#ef4444"
        />
        <StatCard label="Skor Tertinggi" value={partyScores[0]?.total} sub={partyScores[0]?.abbr} color="#f59e0b" />
        <StatCard label="Total Kursi DPR" value="580" sub="DPR 2024–2029" color="#8b5cf6" />
      </div>

      {/* Horizontal bar chart */}
      <div className="bg-bg-card rounded-xl border border-border p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Skor Total Partai</h3>
        <ResponsiveContainer width="100%" height={Math.max(300, chartData.length * 44)}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 60, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <YAxis
              dataKey="abbr"
              type="category"
              width={70}
              tick={{ fill: '#d1d5db', fontSize: 12, fontWeight: 500 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const d = payload[0]?.payload
                return (
                  <div className="bg-bg-card border border-border rounded-lg p-3 shadow-xl text-xs">
                    <p className="font-bold mb-1" style={{ color: d.color }}>{d.logo_emoji} {d.name}</p>
                    <p>Skor Total: <strong>{d.total}</strong></p>
                    <p>Kursi: {d.seats} | Provinsi: {d.provinces_held}</p>
                  </div>
                )
              }}
            />
            <Bar dataKey="total" radius={[0, 4, 4, 0]} label={{ position: 'right', fill: '#9ca3af', fontSize: 11, formatter: v => v.toFixed(1) }}>
              {chartData.map(entry => (
                <Cell key={entry.id} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stacked breakdown chart */}
      <div className="bg-bg-card rounded-xl border border-border p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Breakdown Komponen Skor (Partai Parlemen)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={chartData.filter(p => p.seats > 0)}
            margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="abbr" tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="seat_score"      name="Kursi"      stackId="a" fill="#3b82f6" />
            <Bar dataKey="executive_score" name="Eksekutif"  stackId="a" fill="#ef4444" />
            <Bar dataKey="governor_score"  name="Gubernur"   stackId="a" fill="#10b981" />
            <Bar dataKey="coalition_bonus" name="Koalisi"    stackId="a" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Breakdown table */}
      <div className="bg-bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-text-primary">Detail Komponen Skor</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-elevated">
                <th className="text-left px-4 py-2.5 text-text-muted font-medium">Partai</th>
                <th className="text-right px-3 py-2.5 text-text-muted font-medium text-xs">Kursi</th>
                <th className="text-right px-3 py-2.5 text-text-muted font-medium text-xs">Seat</th>
                <th className="text-right px-3 py-2.5 text-text-muted font-medium text-xs">Eksekutif</th>
                <th className="text-right px-3 py-2.5 text-text-muted font-medium text-xs">Gubernur</th>
                <th className="text-right px-3 py-2.5 text-text-muted font-medium text-xs">Koalisi</th>
                <th className="text-right px-3 py-2.5 text-text-muted font-medium text-xs">Korupsi</th>
                <th className="text-right px-4 py-2.5 text-text-muted font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {partyScores.map(p => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-bg-elevated/50">
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center gap-1.5 font-medium" style={{ color: p.color }}>
                      {p.logo_emoji} {p.abbr}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right text-text-muted text-xs">{p.seats}</td>
                  <td className="px-3 py-2.5 text-right text-text-primary">{p.seat_score}</td>
                  <td className="px-3 py-2.5 text-right text-text-primary">{p.executive_score}</td>
                  <td className="px-3 py-2.5 text-right text-text-primary">{p.governor_score}</td>
                  <td className="px-3 py-2.5 text-right text-text-primary">{p.coalition_bonus}</td>
                  <td className="px-3 py-2.5 text-right text-red-400">{p.corruption_load}</td>
                  <td className="px-4 py-2.5 text-right font-bold"><ScoreBadge score={p.total} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 3: SKOR PROVINSI
// ═══════════════════════════════════════════════════════════════════════════════
function TabProvinsi({ provincesData }) {
  const [filterIsland, setFilterIsland] = useState('all')

  const filtered = useMemo(() =>
    filterIsland === 'all'
      ? provincesData
      : provincesData.filter(p => p.island === filterIsland),
    [provincesData, filterIsland]
  )

  const stats = useMemo(() => descStats(provincesData.map(p => p.total)), [provincesData])
  const top5 = provincesData.slice(0, 5)
  const bottom5 = [...provincesData].sort((a, b) => a.total - b.total).slice(0, 5)

  const scoreColor = score => score >= 70 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'
  const islandColor = island => ISLAND_COLORS[island] || '#9ca3af'

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Rerata Skor Tata Kelola" value={stats.mean} sub={`Std: ${stats.std}`} color="#3b82f6" />
        <StatCard label="Skor Tertinggi" value={stats.max} sub={provincesData[0]?.name} color="#22c55e" />
        <StatCard label="Skor Terendah" value={stats.min} sub={[...provincesData].sort((a,b)=>a.total-b.total)[0]?.name} color="#ef4444" />
        <StatCard label="Provinsi Nilai Baik (≥70)" value={provincesData.filter(p=>p.total>=70).length} sub="dari 38 provinsi" color="#10b981" />
      </div>

      {/* Top/Bottom summary */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-bg-card rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">🏆 Top 5 Provinsi</h3>
          <div className="space-y-2">
            {top5.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 text-sm">
                <span className="text-text-muted w-4">{i+1}.</span>
                <span className="flex-1 text-text-primary">{p.name}</span>
                <ScoreBadge score={p.total} />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-bg-card rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">⚠️ Bottom 5 Provinsi</h3>
          <div className="space-y-2">
            {bottom5.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 text-sm">
                <span className="text-text-muted w-4">{i+1}.</span>
                <span className="flex-1 text-text-primary">{p.name}</span>
                <ScoreBadge score={p.total} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterIsland('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterIsland === 'all' ? 'bg-accent-red text-white' : 'bg-bg-elevated border border-border text-text-muted hover:text-text-primary'}`}
        >
          Semua Pulau
        </button>
        {ISLANDS.map(island => (
          <button
            key={island}
            onClick={() => setFilterIsland(island)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border"
            style={{
              backgroundColor: filterIsland === island ? ISLAND_COLORS[island] + '33' : 'transparent',
              borderColor: ISLAND_COLORS[island] + '66',
              color: filterIsland === island ? ISLAND_COLORS[island] : '#9ca3af',
            }}
          >
            {island}
          </button>
        ))}
      </div>

      {/* Province cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p, idx) => {
          const rank = provincesData.indexOf(p) + 1
          return (
            <div
              key={p.id}
              className="bg-bg-card rounded-xl border border-border p-4 hover:shadow-lg transition-all hover:-translate-y-0.5"
              style={{ borderLeftColor: scoreColor(p.total), borderLeftWidth: 3 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-text-muted">#{rank}</span>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: islandColor(p.island) + '22', color: islandColor(p.island) }}
                    >
                      {p.island}
                    </span>
                  </div>
                  <h4 className="font-semibold text-text-primary text-sm">{p.name}</h4>
                  <p className="text-xs text-text-muted truncate">{p.governor}</p>
                </div>
                <ScoreBadge score={p.total} />
              </div>

              {/* Score bar */}
              <div className="mb-3">
                <ProgressBar value={p.total} max={100} color={scoreColor(p.total)} height={6} />
              </div>

              {/* Party + GDP */}
              <div className="flex items-center justify-between">
                <PartyBadge partyId={p.party_id} />
                {p.gdp_growth !== null ? (
                  <span className="text-xs font-medium" style={{ color: p.gdp_growth >= 5 ? '#22c55e' : p.gdp_growth >= 4 ? '#f59e0b' : '#ef4444' }}>
                    📈 {p.gdp_growth.toFixed(2)}%
                  </span>
                ) : (
                  <span className="text-xs text-text-muted">GDP: N/A</span>
                )}
              </div>

              {/* Component mini bars */}
              <div className="mt-3 space-y-1 text-[10px] text-text-muted">
                <div className="flex items-center gap-2">
                  <span className="w-16">Integritas</span>
                  <ProgressBar value={p.integrity_score} max={40} color="#3b82f6" height={3} />
                  <span>{p.integrity_score}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-16">Stabilitas</span>
                  <ProgressBar value={p.stability_score} max={30} color="#10b981" height={3} />
                  <span>{p.stability_score}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 4: KORELASI GDP
// ═══════════════════════════════════════════════════════════════════════════════
function TabGDP({ provincesData }) {
  // Build pairs with GDP data
  const pairs = useMemo(() =>
    provincesData
      .map(p => ({
        ...p,
        x: p.total,
        y: GDP_PROVINCES[p.id]?.growth_2023 ?? null,
      }))
      .filter(p => p.y !== null && p.y !== undefined),
    [provincesData]
  )

  const xs = useMemo(() => pairs.map(p => p.x), [pairs])
  const ys = useMemo(() => pairs.map(p => p.y), [pairs])

  const r = useMemo(() => pearsonR(xs, ys), [xs, ys])
  const rho = useMemo(() => spearmanR(xs, ys), [xs, ys])
  const reg = useMemo(() => linearRegression(xs, ys), [xs, ys])
  const rInterp = useMemo(() => r !== null ? interpretR(r) : null, [r])

  // Regression line data: generate from min to max score
  const regLineData = useMemo(() => {
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    return [
      { x: minX, y: reg.slope * minX + reg.intercept },
      { x: maxX, y: reg.slope * maxX + reg.intercept },
    ]
  }, [xs, reg])

  // Subgroup analysis by island
  const islandCorrelations = useMemo(() => {
    return ISLANDS.map(island => {
      const subset = pairs.filter(p => p.island === island)
      if (subset.length < 3) return { island, r: null, n: subset.length }
      const islandXs = subset.map(p => p.x)
      const islandYs = subset.map(p => p.y)
      return { island, r: pearsonR(islandXs, islandYs), n: subset.length, meanGrowth: islandYs.reduce((a,b)=>a+b,0)/islandYs.length }
    }).filter(d => d.r !== null).sort((a, b) => Math.abs(b.r) - Math.abs(a.r))
  }, [pairs])

  // Party × GDP analysis
  const partyGDP = useMemo(() => {
    const partyMap = {}
    pairs.forEach(p => {
      if (!p.party_id) return
      if (!partyMap[p.party_id]) partyMap[p.party_id] = { growths: [], scores: [], name: p.party_id }
      partyMap[p.party_id].growths.push(p.y)
      partyMap[p.party_id].scores.push(p.x)
    })
    return Object.entries(partyMap).map(([id, d]) => ({
      id,
      abbr: PARTY_MAP[id]?.abbr || id,
      color: PARTY_MAP[id]?.color || '#9ca3af',
      logo_emoji: PARTY_MAP[id]?.logo_emoji || '',
      meanGrowth: d.growths.reduce((a,b)=>a+b,0) / d.growths.length,
      meanScore: d.scores.reduce((a,b)=>a+b,0) / d.scores.length,
      n: d.growths.length,
      is_kim: KIM_PLUS.includes(id),
    })).sort((a, b) => b.meanGrowth - a.meanGrowth)
  }, [pairs])

  // Quadrant analysis
  const medianScore = useMemo(() => {
    const sorted = [...xs].sort((a,b)=>a-b)
    return sorted[Math.floor(sorted.length/2)]
  }, [xs])
  const medianGrowth = useMemo(() => {
    const sorted = [...ys].sort((a,b)=>a-b)
    return sorted[Math.floor(sorted.length/2)]
  }, [ys])

  const quadrants = useMemo(() => {
    return pairs.map(p => ({
      ...p,
      quadrant: p.x >= medianScore && p.y >= medianGrowth ? 'best'
              : p.x < medianScore && p.y < medianGrowth ? 'poor'
              : p.x >= medianScore && p.y < medianGrowth ? 'over_governed'
              : 'commodity_driven',
    }))
  }, [pairs, medianScore, medianGrowth])

  const QUADRANT_META = {
    best:             { label: '🏆 Best Performers',                 color: '#22c55e', desc: 'Tata kelola baik & pertumbuhan tinggi' },
    commodity_driven: { label: '⛏️ Commodity-Driven',                color: '#f59e0b', desc: 'Pertumbuhan tinggi meski tata kelola lemah' },
    over_governed:    { label: '📋 Over-governed, Under-resourced',  color: '#3b82f6', desc: 'Tata kelola baik tapi pertumbuhan rendah' },
    poor:             { label: '⚠️ Double Trouble',                  color: '#ef4444', desc: 'Tata kelola lemah & pertumbuhan rendah' },
  }

  return (
    <div className="space-y-8">
      {/* ── Section A: Scatter Plot ── */}
      <div className="bg-bg-card rounded-xl border border-border p-4">
        <h3 className="text-base font-semibold text-text-primary mb-1">A. Scatter Plot: Tata Kelola vs Pertumbuhan PDRB</h3>
        <p className="text-xs text-text-muted mb-4">
          Setiap titik = 1 provinsi · N = {pairs.length} · X = Skor Tata Kelola (0–100) · Y = PDRB Growth 2023 (%)
        </p>
        <ResponsiveContainer width="100%" height={420}>
          <ComposedChart margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0f" />
            <XAxis
              dataKey="x"
              type="number"
              domain={['auto', 'auto']}
              label={{ value: 'Skor Tata Kelola', position: 'insideBottom', offset: -15, fill: '#9ca3af', fontSize: 12 }}
              tick={{ fill: '#9ca3af', fontSize: 11 }}
            />
            <YAxis
              dataKey="y"
              type="number"
              domain={['auto', 'auto']}
              label={{ value: 'PDRB Growth (%)', angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 12 }}
              tick={{ fill: '#9ca3af', fontSize: 11 }}
            />
            <Tooltip content={<ScatterTooltip />} />
            {/* Regression line */}
            <Line
              data={regLineData}
              dataKey="y"
              type="linear"
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={false}
              name="Regresi"
              legendType="line"
            />
            {/* Scatter per island group */}
            {ISLANDS.map(island => (
              <Scatter
                key={island}
                name={island}
                data={pairs.filter(p => p.island === island)}
                fill={ISLAND_COLORS[island]}
                opacity={0.85}
              />
            ))}
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* ── Section B: Correlation Stats ── */}
      <div>
        <h3 className="text-base font-semibold text-text-primary mb-3">B. Statistik Korelasi</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-bg-card rounded-xl border border-border p-4 col-span-2">
            <p className="text-xs text-text-muted mb-1">Pearson r</p>
            <p className="text-3xl font-bold" style={{ color: rInterp?.color }}>
              {r !== null ? r.toFixed(3) : 'N/A'}
            </p>
            {rInterp && (
              <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block" style={{ backgroundColor: rInterp.color + '22', color: rInterp.color }}>
                {rInterp.label}
              </span>
            )}
          </div>
          <div className="bg-bg-card rounded-xl border border-border p-4">
            <p className="text-xs text-text-muted mb-1">Spearman ρ</p>
            <p className="text-2xl font-bold text-text-primary">{rho.toFixed(3)}</p>
            <p className="text-xs text-text-muted mt-1">Rank-based</p>
          </div>
          <div className="bg-bg-card rounded-xl border border-border p-4">
            <p className="text-xs text-text-muted mb-1">R²</p>
            <p className="text-2xl font-bold text-text-primary">{(reg.r2 * 100).toFixed(1)}%</p>
            <p className="text-xs text-text-muted mt-1">Variansi dijelaskan</p>
          </div>
          <div className="bg-bg-card rounded-xl border border-border p-4 col-span-2">
            <p className="text-xs text-text-muted mb-1">Persamaan Regresi</p>
            <p className="text-sm font-mono font-bold text-text-primary">
              PDRB = {reg.slope.toFixed(3)} × Score {reg.intercept >= 0 ? '+' : ''}{reg.intercept.toFixed(2)}
            </p>
            <p className="text-xs text-text-muted mt-1">N = {pairs.length} observasi</p>
          </div>
        </div>
        <div className="mt-3 bg-bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-text-muted">
            <strong className="text-text-primary">Catatan:</strong> Korelasi {rInterp?.strength === 'kuat' ? 'kuat' : rInterp?.strength === 'sedang' ? 'sedang' : 'lemah'} —
            skor tata kelola menjelaskan {(reg.r2 * 100).toFixed(1)}% variasi pertumbuhan PDRB antar provinsi.
            Korelasi ini tidak berarti kausalitas; faktor sumber daya alam (nikel, migas, batubara) merupakan
            perancu signifikan, terutama di Maluku Utara dan Sulawesi Tengah.
          </p>
        </div>
      </div>

      {/* ── Section C: Subgroup by Island ── */}
      <div>
        <h3 className="text-base font-semibold text-text-primary mb-3">C. Korelasi per Pulau</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
          {islandCorrelations.map(d => (
            <div key={d.island} className="bg-bg-card rounded-xl border border-border p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ISLAND_COLORS[d.island] }} />
                <span className="text-xs font-medium text-text-primary">{d.island}</span>
                <span className="text-xs text-text-muted ml-auto">n={d.n}</span>
              </div>
              <p className="text-xl font-bold" style={{ color: interpretR(d.r).color }}>
                r = {d.r.toFixed(3)}
              </p>
              <p className="text-[10px] text-text-muted mt-1">{interpretR(d.r).label}</p>
              <p className="text-[10px] text-text-muted">Rata-rata growth: {d.meanGrowth?.toFixed(2)}%</p>
            </div>
          ))}
        </div>
        <div className="bg-bg-elevated rounded-xl border border-border p-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={islandCorrelations} margin={{ top: 0, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0f" />
              <XAxis dataKey="island" tick={{ fill: '#9ca3af', fontSize: 10 }} angle={-15} textAnchor="end" />
              <YAxis domain={[-1, 1]} tick={{ fill: '#9ca3af', fontSize: 10 }} />
              <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="4 2" />
              <Tooltip
                contentStyle={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 11 }}
                formatter={(v, n) => [v?.toFixed(3), 'Pearson r']}
              />
              <Bar dataKey="r" name="Pearson r" radius={[3, 3, 0, 0]}>
                {islandCorrelations.map(d => (
                  <Cell key={d.island} fill={ISLAND_COLORS[d.island]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Section D: Party × GDP ── */}
      <div>
        <h3 className="text-base font-semibold text-text-primary mb-1">D. Partai Penguasa vs Pertumbuhan PDRB</h3>
        <p className="text-xs text-text-muted mb-4">
          Apakah partai pemerintah (KIM Plus) mengelola provinsi dengan pertumbuhan lebih tinggi?
        </p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-bg-card rounded-xl border border-border p-4">
            <h4 className="text-sm font-medium text-text-primary mb-3">Rata-rata PDRB Growth per Partai Gubernur</h4>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={partyGDP} layout="vertical" margin={{ top: 0, right: 50, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0f" horizontal={false} />
                <XAxis type="number" domain={[0, 'auto']} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <YAxis dataKey="abbr" type="category" width={55} tick={{ fill: '#d1d5db', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 11 }}
                  formatter={v => [`${v.toFixed(2)}%`, 'Avg Growth']}
                />
                <Bar dataKey="meanGrowth" name="PDRB Growth" radius={[0, 4, 4, 0]}
                  label={{ position: 'right', fill: '#9ca3af', fontSize: 10, formatter: v => `${v.toFixed(1)}%` }}
                >
                  {partyGDP.map(d => (
                    <Cell key={d.id} fill={d.color} opacity={d.is_kim ? 1 : 0.5} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-bg-card rounded-xl border border-border p-4">
            <h4 className="text-sm font-medium text-text-primary mb-3">KIM Plus vs Oposisi/Non-Koalisi</h4>
            {(() => {
              const kim = partyGDP.filter(d => d.is_kim)
              const nonKim = partyGDP.filter(d => !d.is_kim)
              const kimAvg = kim.length > 0 ? kim.reduce((s,d)=>s+d.meanGrowth*d.n,0) / kim.reduce((s,d)=>s+d.n,0) : 0
              const nonKimAvg = nonKim.length > 0 ? nonKim.reduce((s,d)=>s+d.meanGrowth*d.n,0) / nonKim.reduce((s,d)=>s+d.n,0) : 0
              const kimN = kim.reduce((s,d)=>s+d.n,0)
              const nonKimN = nonKim.reduce((s,d)=>s+d.n,0)
              return (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      <p className="text-xs text-text-muted">KIM Plus (n={kimN} provinsi)</p>
                      <p className="text-2xl font-bold text-red-400">{kimAvg.toFixed(2)}%</p>
                      <p className="text-xs text-text-muted">rata-rata PDRB growth</p>
                    </div>
                    <div className="flex-1 bg-bg-elevated border border-border rounded-lg p-3">
                      <p className="text-xs text-text-muted">Non-KIM (n={nonKimN} provinsi)</p>
                      <p className="text-2xl font-bold text-text-primary">{nonKimAvg.toFixed(2)}%</p>
                      <p className="text-xs text-text-muted">rata-rata PDRB growth</p>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted">
                    Selisih: <strong className="text-text-primary">{Math.abs(kimAvg - nonKimAvg).toFixed(2)}%</strong> —
                    {kimAvg > nonKimAvg
                      ? ' Provinsi koalisi sedikit lebih tinggi, namun perbedaan tidak cukup signifikan secara statistik tanpa uji t.'
                      : ' Provinsi non-koalisi memiliki rata-rata lebih tinggi, kemungkinan dipengaruhi outlier nikel.'}
                  </p>
                </div>
              )
            })()}
          </div>
        </div>
      </div>

      {/* ── Section E: Quadrant ── */}
      <div>
        <h3 className="text-base font-semibold text-text-primary mb-3">E. Analisis Kuadran Outlier</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {Object.entries(QUADRANT_META).map(([key, meta]) => {
            const group = quadrants.filter(p => p.quadrant === key)
            return (
              <div key={key} className="bg-bg-card rounded-xl border border-border p-4" style={{ borderTopColor: meta.color, borderTopWidth: 2 }}>
                <h4 className="text-sm font-semibold mb-1" style={{ color: meta.color }}>{meta.label}</h4>
                <p className="text-xs text-text-muted mb-3">{meta.desc}</p>
                <div className="space-y-1">
                  {group.map(p => (
                    <div key={p.id} className="flex items-center justify-between text-xs">
                      <span className="text-text-primary">{p.name}</span>
                      <span className="text-text-muted">{p.x.toFixed(0)} / {p.y.toFixed(2)}%</span>
                    </div>
                  ))}
                  {group.length === 0 && <p className="text-xs text-text-muted">-</p>}
                </div>
              </div>
            )
          })}
        </div>
        {/* Quadrant scatter */}
        <div className="bg-bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-text-muted mb-3">
            Garis vertikal = median skor ({medianScore.toFixed(1)}) · Garis horizontal = median growth ({medianGrowth.toFixed(2)}%)
          </p>
          <ResponsiveContainer width="100%" height={380}>
            <ComposedChart margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0f" />
              <XAxis
                dataKey="x"
                type="number"
                domain={['auto', 'auto']}
                label={{ value: 'Skor Tata Kelola', position: 'insideBottom', offset: -15, fill: '#9ca3af', fontSize: 12 }}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
              />
              <YAxis
                dataKey="y"
                type="number"
                domain={['auto', 'auto']}
                label={{ value: 'PDRB Growth (%)', angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 12 }}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
              />
              <ReferenceLine x={medianScore} stroke="#6b7280" strokeDasharray="5 3" label={{ value: 'Median Score', fill: '#6b7280', fontSize: 9 }} />
              <ReferenceLine y={medianGrowth} stroke="#6b7280" strokeDasharray="5 3" label={{ value: 'Median Growth', fill: '#6b7280', fontSize: 9 }} />
              <Tooltip content={<ScatterTooltip />} />
              {Object.entries(QUADRANT_META).map(([key, meta]) => (
                <Scatter
                  key={key}
                  name={meta.label}
                  data={quadrants.filter(p => p.quadrant === key)}
                  fill={meta.color}
                  opacity={0.85}
                />
              ))}
              <Legend wrapperStyle={{ fontSize: 10, paddingTop: 12 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Section F: Key Insights ── */}
      <div className="bg-bg-card rounded-xl border border-border p-5">
        <h3 className="text-base font-semibold text-text-primary mb-4">F. 📊 Temuan Utama — Analyst Notes</h3>
        <div className="space-y-3 text-sm">
          {[
            {
              n: 1,
              text: `Korelasi keseluruhan: Pearson r = ${r?.toFixed(3)} — menunjukkan korelasi ${rInterp?.strength === 'kuat' ? 'kuat' : rInterp?.strength === 'sedang' ? 'sedang' : 'lemah'} antara tata kelola politik dan pertumbuhan ekonomi provinsi. R² = ${(reg.r2 * 100).toFixed(1)}%, artinya skor tata kelola hanya menjelaskan sebagian kecil variasi PDRB.`,
            },
            {
              n: 2,
              text: 'Outlier paling ekstrem: Sulawesi Tengah (+13.06%) dan Maluku Utara (+20.49%) — pertumbuhan PDRB didorong boom nikel untuk baterai EV, bukan kualitas tata kelola. Tanpa kedua outlier ini, korelasi cenderung lebih kuat.',
            },
            {
              n: 3,
              text: 'Kalimantan Timur: Pertumbuhan 6.22% (2023) dan estimasi 8.5% (2024) didorong konstruksi IKN Nusantara dan kebijakan pro-investasi. Skor tata kelola tinggi (Gerindra) berkorelasi dengan iklim investasi yang kondusif.',
            },
            {
              n: 4,
              text: 'Papua: Volatilitas ekstrem akibat ketergantungan Freeport — pertumbuhan 14.71% (2021) → -3.85% (2022) → +5.52% (2023). Governance score rendah, pertumbuhan tidak terprediksi oleh tata kelola.',
            },
            {
              n: 5,
              text: 'Korelasi lemah di Jawa: Ekonomi Jawa (DKI, Jabar, Jatim) lebih matang, diversified, dan structural. Satu gubernur tidak cukup mempengaruhi PDRB provinsi dengan ekonomi Rp 2.000+ triliun.',
            },
            {
              n: 6,
              text: 'Implikasi kebijakan: Tata kelola lebih deterministik di provinsi berkembang dengan resource-rich economies (Kalimantan, Sulawesi luar Jawa). Di provinsi maju, faktor struktural (demografi, infrastruktur, modal) lebih dominan.',
            },
          ].map(item => (
            <div key={item.n} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-red/20 text-accent-red flex items-center justify-center text-xs font-bold">{item.n}</span>
              <p className="text-text-secondary leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 5: METODOLOGI
// ═══════════════════════════════════════════════════════════════════════════════
function TabMetodologi() {
  const FORMULAS = [
    {
      title: '👤 Skor Individu (0–100)',
      items: [
        { label: 'Skor Posisi (0–40)',   formula: '(bobot_posisi / 100) × 40', note: 'Presiden=100, Wakil Presiden=90, Menko=75, Menteri=70, Gubernur=55, dst.' },
        { label: 'Skor Jaringan (0–20)', formula: '(jumlah_koneksi × 2) + (total_kekuatan / 10)', note: 'Diukur dari edge list CONNECTIONS, max 20' },
        { label: 'Skor Partai (0–20)',   formula: '(kursi_2024 / 580) × 20', note: 'Proporsi kursi DPR 2024 dari 580 kursi total' },
        { label: 'Skor LHKPN (0–10)',   formula: 'min(10, log₁₀(kekayaan / 1B) × 2.5)', note: 'Rp 1T ≈ skor 7.5; Rp 10T ≈ skor 10; logaritmik untuk mengurangi outlier' },
        { label: 'Penalti Korupsi',       formula: 'Terpidana: -40, Tersangka: -30, Tinggi: -15, Sedang: -5', note: 'Dari data analisis KPK, persidangan, media investigatif' },
      ]
    },
    {
      title: '🎭 Skor Partai (0–100)',
      items: [
        { label: 'Seat Score (0–40)',        formula: '(kursi_2024 / 580) × 40', note: 'Berdasarkan hasil Pileg 2024' },
        { label: 'Executive Score (0–30)',    formula: 'Presiden=+30, Wapres=+20, Menko=+4, Menteri/Kepala=+2', note: 'Akumulasi posisi eksekutif nasional, max 30' },
        { label: 'Governor Score (0–20)',     formula: '(provinsi_dikuasai / 38) × 20', note: 'Berdasarkan partai gubernur hasil Pilkada 2024' },
        { label: 'Coalition Bonus (0–10)',    formula: 'KIM Plus = +10, lainnya = 0', note: 'Koalisi Indonesia Maju Plus: Gerindra, Golkar, NasDem, PAN, Demokrat, PKS, PBB, PKB' },
        { label: 'Corruption Load (-20–0)',   formula: '-min(20, kasus_korupsi × 5)', note: 'Jumlah anggota tersangka/terpidana/risiko-tinggi per partai' },
      ]
    },
    {
      title: '🗺️ Skor Tata Kelola Provinsi (0–100)',
      items: [
        { label: 'Integrity Score (0–40)',   formula: 'Rendah=40, Sedang=25, Tinggi=10, Tersangka=0, Terpidana=0', note: 'Berdasarkan track record korupsi gubernur' },
        { label: 'Stability Score (0–30)',   formula: 'KIM Plus=30, Independen=15, PDIP=10', note: 'Alignment dengan koalisi pemerintah pusat' },
        { label: 'Density Score (0–10)',     formula: 'Placeholder = 5', note: 'Akan diisi dengan rasio kasus KPK per 100.000 penduduk jika data tersedia' },
      ]
    },
    {
      title: '📈 Analisis Korelasi',
      items: [
        { label: 'Pearson r',             formula: 'Σ((xi-x̄)(yi-ȳ)) / √(Σ(xi-x̄)² · Σ(yi-ȳ)²)', note: 'Korelasi linear; sensitif terhadap outlier' },
        { label: 'Spearman ρ',           formula: '1 - (6 × Σd²) / (n × (n²-1))', note: 'Korelasi rank; lebih robust untuk distribusi non-normal' },
        { label: 'Regresi Linear',        formula: 'y = b₀ + b₁x, dimana b₁ = Σ(xi-x̄)(yi-ȳ)/Σ(xi-x̄)²', note: 'Ordinary Least Squares (OLS)' },
        { label: 'Interpretasi r',        formula: '≥0.7 Kuat, 0.4–0.7 Sedang, 0.2–0.4 Lemah, <0.2 Tidak Signifikan', note: '' },
      ]
    }
  ]

  return (
    <div className="space-y-6">
      {/* Formula breakdown */}
      {FORMULAS.map(section => (
        <div key={section.title} className="bg-bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 bg-bg-elevated border-b border-border">
            <h3 className="text-sm font-semibold text-text-primary">{section.title}</h3>
          </div>
          <div className="divide-y divide-border/50">
            {section.items.map(item => (
              <div key={item.label} className="px-4 py-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                <span className="text-sm font-medium text-text-primary">{item.label}</span>
                <code className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-1 rounded md:col-span-1">{item.formula}</code>
                <span className="text-xs text-text-muted">{item.note}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Data sources */}
      <div className="bg-bg-card rounded-xl border border-border p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">📚 Sumber Data</h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          {[
            { source: 'BPS Indonesia',       desc: 'Data PDRB, pertumbuhan ekonomi, PDRB per kapita provinsi' },
            { source: 'KPU / KPU.go.id',    desc: 'Hasil Pileg & Pilpres 2024, perolehan kursi DPR' },
            { source: 'KPK (acch.kpk.go.id)',desc: 'LHKPN, status tersangka/terpidana pejabat' },
            { source: 'DPR RI',              desc: 'Data kursi fraksi, komposisi DPR 2024–2029' },
            { source: 'Pilkada 2024',        desc: 'Hasil pemilihan gubernur, afiliasi partai' },
            { source: 'Wikipedia / Media',   desc: 'Biodata tokoh, riwayat jabatan, koneksi politik' },
          ].map(d => (
            <div key={d.source} className="flex gap-2">
              <span className="text-accent-red">•</span>
              <div>
                <span className="font-medium text-text-primary">{d.source}</span>
                <span className="text-text-muted"> — {d.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Limitations */}
      <div className="bg-amber-500/10 rounded-xl border border-amber-500/30 p-4">
        <h3 className="text-sm font-semibold text-amber-400 mb-3">⚠️ Keterbatasan & Caveat</h3>
        <ul className="space-y-2 text-sm text-text-secondary">
          <li>• <strong>LHKPN self-reported:</strong> Data kekayaan berdasarkan laporan mandiri pejabat; underreporting adalah risiko nyata.</li>
          <li>• <strong>Risiko korupsi subjektif:</strong> Penilaian risiko menggunakan berita media dan data publik KPK; bias editorial dimungkinkan.</li>
          <li>• <strong>GDP data lag:</strong> Data PDRB 2023 baru final Q1 2024; estimasi 2024 bersifat proyeksi BPS.</li>
          <li>• <strong>Korelasi ≠ kausalitas:</strong> Skor tata kelola berkorelasi dengan GDP, tetapi tidak dapat disimpulkan bahwa governance menyebabkan pertumbuhan.</li>
          <li>• <strong>Confounding variables:</strong> SDA, infrastruktur, lokasi geografis, investasi FDI — semua mempengaruhi PDRB tanpa tercermin dalam skor governance.</li>
          <li>• <strong>Data provinsi baru terbatas:</strong> Papua Tengah, Papua Pegunungan, Papua Selatan, Papua Barat Daya — data PDRB 2021–2022 belum tersedia.</li>
        </ul>
      </div>

      {/* Version */}
      <div className="bg-bg-elevated rounded-xl border border-border p-4 text-xs text-text-muted">
        <strong className="text-text-primary">PetaPolitik Analytics Engine</strong>
        {' '}· Versi 1.0 · Diperbarui Maret 2026
        {' '}· Model scoring dikembangkan berdasarkan data publik Indonesia
        {' '}· Hanya untuk keperluan analisis akademik dan jurnalistik data
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function AnalitikPage() {
  const [activeTab, setActiveTab] = useState('individu')

  const personScores  = useMemo(() => scoreAllPersons(), [])
  const provincesData = useMemo(() => scoreAllProvincesFromData(PROVINCES, PERSONS, GDP_PROVINCES), [])
  const partyScores   = useMemo(() => scoreAllParties(PERSONS, PROVINCES), [])

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">📊 Analitik Politik</h1>
        <p className="text-text-muted text-sm mt-1">
          Sistem penilaian berbasis data publik — skor individu, partai, provinsi, dan korelasi GDP
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-bg-elevated p-1 rounded-xl border border-border overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-bg-card text-text-primary shadow-sm border border-border'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'individu'   && <TabIndividu  personScores={personScores} />}
        {activeTab === 'partai'     && <TabPartai    partyScores={partyScores} provincesData={provincesData} />}
        {activeTab === 'provinsi'   && <TabProvinsi  provincesData={provincesData} />}
        {activeTab === 'gdp'        && <TabGDP       provincesData={provincesData} />}
        {activeTab === 'metodologi' && <TabMetodologi />}
      </div>
    </div>
  )
}
