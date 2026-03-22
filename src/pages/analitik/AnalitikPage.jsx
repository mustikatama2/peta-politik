import { useMemo, useState } from 'react'
import {
  ComposedChart, ScatterChart, Scatter, XAxis, YAxis, ZAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell, ReferenceLine, Line, LineChart, Area, AreaChart,
} from 'recharts'
import { PERSONS } from '../../data/persons'
import { PARTIES, PARTY_MAP } from '../../data/parties'
import { CONNECTIONS } from '../../data/connections'
import { PROVINCES } from '../../data/regions'
import { GDP_PROVINCES } from '../../data/gdp'
import { BILLS } from '../../data/voting_records'
import { PILPRES_2029_POLLS } from '../../data/polls'
import { PROVINCE_SCORECARD, calculateScores } from '../../data/scorecard'
import {
  scoreAllPersons, scoreAllParties, scoreAllProvincesFromData,
  pearsonR, spearmanR, linearRegression, interpretR, descStats, KIM_PLUS,
  scoreIndividu, scoreOnePerson, CORRUPTION_PENALTIES,
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
  { id: 'individu',          label: 'Skor Individu',      icon: '👤' },
  { id: 'partai',            label: 'Skor Partai',        icon: '🎭' },
  { id: 'provinsi',          label: 'Skor Provinsi',      icon: '🗺️' },
  { id: 'lhkpn',            label: 'Ketimpangan LHKPN',  icon: '💰' },
  { id: 'gdp',               label: 'Korelasi GDP',       icon: '📈' },
  { id: 'metodologi',        label: 'Metodologi',         icon: '📖' },
  { id: 'afinitas',          label: 'Afinitas Partai',    icon: '🤝' },
  { id: 'tren_skor',         label: 'Tren Skor',          icon: '🎚️' },
  { id: 'prediksi_2029',     label: 'Prediksi 2029',      icon: '🔮' },
  { id: 'korelasi_stat',     label: 'Korelasi',           icon: '📐' },
  { id: 'perbandingan_cepat',label: 'Perbandingan Cepat', icon: '🏆' },
  { id: 'jaringan_pengaruh', label: 'Jaringan Pengaruh',  icon: '🕸️' },
  { id: 'risiko_2029',       label: 'Risiko 2029',        icon: '⚡' },
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
// TAB: KETIMPANGAN LHKPN
// ═══════════════════════════════════════════════════════════════════════════════

function giniCoefficient(values) {
  if (!values || values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const n = sorted.length
  const mean = sorted.reduce((a, b) => a + b, 0) / n
  if (mean === 0) return 0
  let numerator = 0
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      numerator += Math.abs(sorted[i] - sorted[j])
    }
  }
  return numerator / (2 * n * n * mean)
}

function lorenzCurve(values) {
  const sorted = [...values].sort((a, b) => a - b)
  const n = sorted.length
  const total = sorted.reduce((a, b) => a + b, 0)
  const points = [{ x: 0, actual: 0, equality: 0 }]
  let cumWealth = 0
  for (let i = 0; i < n; i++) {
    cumWealth += sorted[i]
    const x = ((i + 1) / n) * 100
    const y = (cumWealth / total) * 100
    points.push({ x: parseFloat(x.toFixed(1)), actual: parseFloat(y.toFixed(1)), equality: parseFloat(x.toFixed(1)) })
  }
  return points
}

const SALARY_DATA_LHKPN = [
  { id: 'prabowo',      salary_year: 1_500_000_000 },
  { id: 'gibran',       salary_year: 900_000_000 },
  { id: 'airlangga',    salary_year: 600_000_000 },
  { id: 'sri_mulyani',  salary_year: 600_000_000 },
  { id: 'megawati',     salary_year: 300_000_000 },
  { id: 'erick_thohir', salary_year: 600_000_000 },
  { id: 'bahlil',       salary_year: 600_000_000 },
  { id: 'ahy',          salary_year: 600_000_000 },
  { id: 'jokowi',       salary_year: 1_200_000_000 },
  { id: 'khofifah',     salary_year: 180_000_000 },
].map(s => {
  const p = PERSONS.find(x => x.id === s.id)
  if (!p?.lhkpn_latest) return null
  const shortName = p.name.split(' ').slice(0, 2).join(' ')
  return {
    name: shortName,
    fullName: p.name,
    wealth: p.lhkpn_latest,
    salary_year: s.salary_year,
    years: Math.round(p.lhkpn_latest / s.salary_year),
    party_id: p.party_id,
    party_color: PARTY_MAP[p.party_id]?.color || '#6B7280',
  }
}).filter(Boolean)

function fmtTrilion(v) {
  if (v >= 1_000_000_000_000) return `Rp ${(v / 1_000_000_000_000).toFixed(2)} T`
  if (v >= 1_000_000_000)     return `Rp ${(v / 1_000_000_000).toFixed(1)} M`
  if (v >= 1_000_000)         return `Rp ${(v / 1_000_000).toFixed(0)} jt`
  return `Rp ${v.toLocaleString('id-ID')}`
}

function fmtMiliar(v) {
  return (v / 1_000_000_000).toFixed(1)
}

function TabLHKPN() {
  const personsWithLHKPN = useMemo(() =>
    PERSONS.filter(p => p.lhkpn_latest && p.lhkpn_latest > 0), [])

  const lhkpnValues = useMemo(() =>
    personsWithLHKPN.map(p => p.lhkpn_latest), [personsWithLHKPN])

  const gini = useMemo(() => giniCoefficient(lhkpnValues), [lhkpnValues])

  // Lorenz curve data (sample every 5th point for performance)
  const lorenzData = useMemo(() => {
    const pts = lorenzCurve(lhkpnValues)
    const step = Math.max(1, Math.floor(pts.length / 30))
    return pts.filter((_, i) => i % step === 0 || i === pts.length - 1)
  }, [lhkpnValues])

  // Section B: by tier
  const tierData = useMemo(() => {
    const groups = {}
    personsWithLHKPN.forEach(p => {
      const tier = p.tier || 'nasional'
      if (!groups[tier]) groups[tier] = []
      groups[tier].push(p.lhkpn_latest)
    })
    return Object.entries(groups).map(([tier, vals]) => {
      const sorted = [...vals].sort((a, b) => a - b)
      const mid = Math.floor(sorted.length / 2)
      const median = sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length
      const tierLabel = tier === 'nasional' ? 'Nasional' : tier === 'regional' ? 'Provinsi' : 'Kabupaten/Kota'
      return {
        tier: tierLabel,
        median: parseFloat(fmtMiliar(median)),
        mean: parseFloat(fmtMiliar(mean)),
        max: parseFloat(fmtMiliar(Math.max(...vals))),
        count: vals.length,
      }
    }).sort((a, b) => b.median - a.median)
  }, [personsWithLHKPN])

  // Section D: Top 20
  const top20 = useMemo(() =>
    [...personsWithLHKPN]
      .sort((a, b) => b.lhkpn_latest - a.lhkpn_latest)
      .slice(0, 20)
      .map(p => ({
        name: p.name.split(' ').slice(0, 2).join(' '),
        fullName: p.name,
        wealth: parseFloat(fmtMiliar(p.lhkpn_latest)),
        wealthRaw: p.lhkpn_latest,
        party_id: p.party_id,
        position: p.positions?.[0]?.title || '-',
        color: PARTY_MAP[p.party_id]?.color || '#6B7280',
      })),
    [personsWithLHKPN])

  // Insights
  const avgWealth = lhkpnValues.reduce((a, b) => a + b, 0) / lhkpnValues.length
  const prabowo = PERSONS.find(p => p.id === 'prabowo')
  const prabMult = prabowo ? (prabowo.lhkpn_latest / avgWealth).toFixed(1) : '?'
  const nasional = personsWithLHKPN.filter(p => p.tier === 'nasional')
  const regional = personsWithLHKPN.filter(p => p.tier === 'regional')
  const avgNasional = nasional.length ? nasional.reduce((a, b) => a + b.lhkpn_latest, 0) / nasional.length : 0
  const avgRegional = regional.length ? regional.reduce((a, b) => a + b.lhkpn_latest, 0) / regional.length : 0
  const rich100 = personsWithLHKPN.filter(p => p.lhkpn_latest >= 100_000_000_000)
  const richBusiness = rich100.filter(p => (p.tags || []).includes('pengusaha'))

  const giniLabel = gini > 0.6 ? 'sangat tinggi' : gini > 0.4 ? 'tinggi' : gini > 0.3 ? 'sedang' : 'rendah'
  const giniPct = (gini * 100).toFixed(0)

  // Cumulative share for insight
  const sorted = [...lhkpnValues].sort((a, b) => b - a)
  const totalWealth = sorted.reduce((a, b) => a + b, 0)
  const top10Count = Math.ceil(sorted.length * 0.1)
  const top10Wealth = sorted.slice(0, top10Count).reduce((a, b) => a + b, 0)
  const top10Pct = ((top10Wealth / totalWealth) * 100).toFixed(0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-text-primary">💰 Ketimpangan Kekayaan Pejabat (LHKPN)</h2>
        <p className="text-sm text-text-muted mt-1">
          Analisis distribusi kekayaan berdasarkan data deklarasi LHKPN publik — {personsWithLHKPN.length} tokoh dengan data valid
        </p>
      </div>

      {/* ─── Section A: Gini Coefficient ─── */}
      <div className="bg-bg-card rounded-xl border border-border p-6">
        <h3 className="text-base font-semibold text-text-primary mb-4">A. Koefisien Gini Kekayaan Pejabat</h3>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Big Gini number */}
          <div className="text-center p-6 bg-bg-elevated rounded-xl border border-border min-w-[140px]">
            <p className="text-xs text-text-muted mb-1">Koefisien Gini</p>
            <p className="text-5xl font-black" style={{ color: gini > 0.5 ? '#ef4444' : gini > 0.35 ? '#f59e0b' : '#22c55e' }}>
              {gini.toFixed(2)}
            </p>
            <p className="text-xs text-text-muted mt-1 capitalize">{giniLabel}</p>
          </div>

          <div className="flex-1 space-y-4">
            {/* Interpretation */}
            <div className="text-sm text-text-muted space-y-1">
              <p>Skala: <span className="text-green-400">0</span> = sempurna merata · <span className="text-red-400">1</span> = maksimum timpang</p>
              <p className="text-text-primary font-medium">
                Ketimpangan kekayaan pejabat bersifat <span className="capitalize font-bold" style={{ color: gini > 0.5 ? '#ef4444' : '#f59e0b' }}>{giniLabel}</span>
              </p>
              <p>→ {top10Pct}% kekayaan yang dideklarasikan dimiliki oleh 10% pejabat terkaya</p>
            </div>

            {/* Comparison bars */}
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs text-text-muted mb-1">
                  <span>Pejabat RI (LHKPN)</span>
                  <span className="font-mono">{gini.toFixed(3)}</span>
                </div>
                <div className="w-full h-4 bg-bg-elevated rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(gini * 100).toFixed(1)}%`, backgroundColor: '#ef4444' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-text-muted mb-1">
                  <span>Populasi umum Indonesia (BPS 2023)</span>
                  <span className="font-mono">0.381</span>
                </div>
                <div className="w-full h-4 bg-bg-elevated rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: '38.1%', backgroundColor: '#f59e0b' }} />
                </div>
              </div>
            </div>
            <p className="text-xs text-text-muted">Referensi: Rasio Gini nasional Indonesia = 0.381 (BPS 2023)</p>
          </div>
        </div>
      </div>

      {/* ─── Section B: Wealth by Tier ─── */}
      <div className="bg-bg-card rounded-xl border border-border p-6">
        <h3 className="text-base font-semibold text-text-primary mb-4">B. Distribusi Kekayaan per Tingkat Jabatan</h3>
        <p className="text-xs text-text-muted mb-4">Median kekayaan LHKPN per jenjang jabatan (dalam miliar Rupiah)</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={tierData} margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="tier" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} unit=" M" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: 8 }}
              labelStyle={{ color: '#f9fafb', fontWeight: 600 }}
              formatter={(v, name) => {
                if (name === 'median') return [`Rp ${v} miliar`, 'Median']
                if (name === 'mean')   return [`Rp ${v} miliar`, 'Rata-rata']
                return [v, name]
              }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                const d = payload[0]?.payload
                return (
                  <div className="bg-bg-card border border-border rounded-lg p-3 text-xs space-y-1">
                    <p className="font-semibold text-text-primary">{label}</p>
                    <p className="text-text-muted">Median: <span className="text-text-primary">Rp {d?.median} M</span></p>
                    <p className="text-text-muted">Rata-rata: <span className="text-text-primary">Rp {d?.mean} M</span></p>
                    <p className="text-text-muted">Tertinggi: <span className="text-text-primary">Rp {d?.max} M</span></p>
                    <p className="text-text-muted">Jumlah: <span className="text-text-primary">{d?.count} tokoh</span></p>
                  </div>
                )
              }}
            />
            <Bar dataKey="median" fill="#3b82f6" radius={[4, 4, 0, 0]} name="median" />
            <Bar dataKey="mean" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="mean" />
            <Legend formatter={v => v === 'median' ? 'Median' : 'Rata-rata'} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ─── Section C: Wealth vs Salary ─── */}
      <div className="bg-bg-card rounded-xl border border-border p-6">
        <h3 className="text-base font-semibold text-text-primary mb-1">C. Rasio Kekayaan vs Gaji Jabatan</h3>
        <p className="text-xs text-text-muted mb-4">Berapa tahun gaji diperlukan untuk mencapai total kekayaan LHKPN — <span className="text-red-400">merah {'>'} 100 tahun</span>, <span className="text-amber-400">kuning 50–100 tahun</span>, <span className="text-green-400">hijau {'<'} 50 tahun</span></p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={SALARY_DATA_LHKPN} layout="vertical" margin={{ top: 0, right: 80, left: 90, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 11 }} unit=" th" />
            <YAxis dataKey="name" type="category" tick={{ fill: '#9ca3af', fontSize: 11 }} width={88} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: 8 }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const d = payload[0]?.payload
                return (
                  <div className="bg-bg-card border border-border rounded-lg p-3 text-xs space-y-1">
                    <p className="font-semibold text-text-primary">{d.fullName}</p>
                    <p className="text-text-muted">Kekayaan LHKPN: <span className="text-text-primary">{fmtTrilion(d.wealth)}</span></p>
                    <p className="text-text-muted">Estimasi gaji/tahun: <span className="text-text-primary">{fmtTrilion(d.salary_year)}</span></p>
                    <p className="text-amber-400 font-bold">{d.years} tahun gaji</p>
                  </div>
                )
              }}
            />
            <Bar dataKey="years" radius={[0, 4, 4, 0]}>
              {SALARY_DATA_LHKPN.map((d, i) => (
                <Cell
                  key={i}
                  fill={d.years > 100 ? '#ef4444' : d.years > 50 ? '#f59e0b' : '#22c55e'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ─── Section D: Top 20 Wealthiest ─── */}
      <div className="bg-bg-card rounded-xl border border-border p-6">
        <h3 className="text-base font-semibold text-text-primary mb-4">D. 20 Pejabat Terkaya (LHKPN)</h3>
        <ResponsiveContainer width="100%" height={480}>
          <BarChart data={top20} layout="vertical" margin={{ top: 0, right: 100, left: 100, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 10 }} unit=" M" />
            <YAxis dataKey="name" type="category" tick={{ fill: '#9ca3af', fontSize: 10 }} width={98} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const d = payload[0]?.payload
                return (
                  <div className="bg-bg-card border border-border rounded-lg p-3 text-xs space-y-1">
                    <p className="font-semibold text-text-primary">{d.fullName}</p>
                    <p className="text-text-muted">Jabatan: <span className="text-text-primary">{d.position}</span></p>
                    <p className="text-text-muted">Partai: <span className="text-text-primary">{PARTY_MAP[d.party_id]?.abbr || '-'}</span></p>
                    <p className="text-amber-400 font-bold">{fmtTrilion(d.wealthRaw)}</p>
                  </div>
                )
              }}
            />
            <Bar dataKey="wealth" radius={[0, 4, 4, 0]}>
              {top20.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ─── Section E: Lorenz Curve ─── */}
      <div className="bg-bg-card rounded-xl border border-border p-6">
        <h3 className="text-base font-semibold text-text-primary mb-1">E. Kurva Lorenz Kekayaan Pejabat</h3>
        <p className="text-xs text-text-muted mb-4">Semakin jauh kurva merah dari diagonal garis sempurna, semakin timpang distribusi kekayaan</p>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={lorenzData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis
              dataKey="x"
              type="number"
              domain={[0, 100]}
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              label={{ value: 'Kumulatif pejabat (%)', position: 'insideBottom', offset: -12, fill: '#9ca3af', fontSize: 11 }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              label={{ value: 'Kumulatif kekayaan (%)', angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: 8 }}
              formatter={(v, name) => [
                `${v.toFixed(1)}%`,
                name === 'equality' ? 'Sempurna Merata' : 'Aktual (LHKPN)'
              ]}
            />
            <Legend />
            <Line type="monotone" dataKey="equality" stroke="#22c55e" strokeDasharray="6 3" dot={false} strokeWidth={2} name="equality" />
            <Line type="monotone" dataKey="actual" stroke="#ef4444" dot={false} strokeWidth={2.5} name="actual" />
            <Area type="monotone" dataKey="actual" fill="#ef444420" stroke="none" />
          </ComposedChart>
        </ResponsiveContainer>
        <p className="text-xs text-text-muted mt-2 text-center">
          Area antara kurva merah dan garis hijau proporsional dengan Gini = <strong className="text-text-primary">{gini.toFixed(3)}</strong>
        </p>
      </div>

      {/* ─── Section F: Insights ─── */}
      <div className="bg-bg-card rounded-xl border border-border p-6">
        <h3 className="text-base font-semibold text-text-primary mb-4">F. Catatan Analis</h3>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">📊</span>
            <span className="text-text-muted">
              Koefisien Gini <strong className="text-text-primary">{gini.toFixed(3)}</strong> menunjukkan ketimpangan kekayaan
              bersifat <strong className="text-text-primary capitalize">{giniLabel}</strong> di antara pejabat RI yang melaporkan LHKPN —
              jauh lebih timpang dibanding Gini populasi umum Indonesia (0.381).
            </span>
          </li>
          {prabowo && (
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-0.5">💸</span>
              <span className="text-text-muted">
                Prabowo Subianto memiliki kekayaan <strong className="text-text-primary">{fmtTrilion(prabowo.lhkpn_latest)}</strong> —
                sekitar <strong className="text-text-primary">{prabMult}×</strong> rata-rata kekayaan pejabat yang melaporkan LHKPN (Rp {fmtMiliar(avgWealth)} miliar).
              </span>
            </li>
          )}
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">🏛️</span>
            <span className="text-text-muted">
              Pejabat tingkat nasional rata-rata memiliki kekayaan <strong className="text-text-primary">Rp {fmtMiliar(avgNasional)} miliar</strong> vs
              pejabat tingkat provinsi rata-rata <strong className="text-text-primary">Rp {fmtMiliar(avgRegional)} miliar</strong>.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-0.5">🏢</span>
            <span className="text-text-muted">
              <strong className="text-text-primary">{richBusiness.length}</strong> dari <strong className="text-text-primary">{rich100.length}</strong> pejabat
              dengan kekayaan {'>'} Rp 100 miliar berlatar belakang sebagai pengusaha, mencerminkan dominasi kalangan bisnis dalam politik nasional.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">📈</span>
            <span className="text-text-muted">
              10% pejabat terkaya menguasai <strong className="text-text-primary">{top10Pct}%</strong> dari total kekayaan yang dideklarasikan,
              menunjukkan konsentrasi aset yang ekstrem di kalangan elite politik RI.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400 mt-0.5">⚠️</span>
            <span className="text-text-muted">
              Data LHKPN adalah deklarasi mandiri — kekayaan riil bisa jauh lebih besar. Analisis ini hanya mencerminkan apa yang dilaporkan
              ke <em>elhkpn.kpk.go.id</em>, bukan total aset sebenarnya.
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 6: AFINITAS PARTAI (Party Affinity Heatmap)
// ═══════════════════════════════════════════════════════════════════════════════

// Historical coalitions 2004–2024
const HISTORICAL_COALITIONS = [
  { name: 'Koalisi SBY 2004–2009',     parties: ['dem', 'gol', 'pkb', 'ppp', 'pks', 'pan'] },
  { name: 'Koalisi SBY 2009–2014',     parties: ['dem', 'gol', 'pks', 'pan', 'ppp', 'pkb', 'nas'] },
  { name: 'Koalisi Jokowi 2014–2019',  parties: ['pdip', 'nas', 'pkb', 'ppp'] },
  { name: 'Oposisi 2014–2019',         parties: ['ger', 'gol', 'pan', 'pks', 'dem'] },
  { name: 'Koalisi Jokowi 2019–2024',  parties: ['pdip', 'ger', 'gol', 'nas', 'pkb', 'pan', 'ppp', 'dem'] },
  { name: 'KIM Plus 2024–sekarang',    parties: ['ger', 'gol', 'nas', 'pan', 'dem', 'pks', 'pkb'] },
]

const HEATMAP_PARTIES = ['pdip', 'ger', 'gol', 'nas', 'pks', 'pkb', 'pan', 'dem', 'ppp']

function computeAffinity(partyA, partyB) {
  if (partyA === partyB) return 100

  // Coalition overlap score (0–100)
  let togetherCount = 0
  let totalCoalitions = HISTORICAL_COALITIONS.length
  HISTORICAL_COALITIONS.forEach(c => {
    const hasA = c.parties.includes(partyA)
    const hasB = c.parties.includes(partyB)
    if (hasA && hasB) togetherCount++
  })
  const coalitionScore = (togetherCount / totalCoalitions) * 100

  // Voting alignment from BILLS
  let aligned = 0
  let compared = 0
  BILLS.forEach(bill => {
    const posA = bill.party_positions?.[partyA]
    const posB = bill.party_positions?.[partyB]
    if (posA && posB) {
      compared++
      if (posA === posB) aligned++
    }
  })
  const votingScore = compared > 0 ? (aligned / compared) * 100 : 50

  // Final affinity: 40% coalition + 60% voting
  return Math.round(coalitionScore * 0.4 + votingScore * 0.6)
}

function affinityColor(score) {
  if (score >= 75) return '#22c55e'
  if (score >= 55) return '#86efac'
  if (score >= 45) return '#fef08a'
  if (score >= 30) return '#fb923c'
  return '#ef4444'
}

function TabAfinitasPartai() {
  const [hoveredCell, setHoveredCell] = useState(null)

  const matrix = useMemo(() => {
    return HEATMAP_PARTIES.map(a =>
      HEATMAP_PARTIES.map(b => computeAffinity(a, b))
    )
  }, [])

  const partyMeta = HEATMAP_PARTIES.map(id => PARTY_MAP[id] || { abbr: id, color: '#6b7280', logo_emoji: '' })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text-primary">🤝 Afinitas Partai</h2>
        <p className="text-sm text-text-muted mt-1">
          Seberapa dekat setiap pasang partai berdasarkan riwayat koalisi pemerintahan (2004–2024) dan rekam jejak voting di DPR
        </p>
      </div>

      {/* Heatmap grid */}
      <div className="bg-bg-card rounded-xl border border-border p-4 overflow-x-auto">
        <table className="text-xs border-collapse w-full">
          <thead>
            <tr>
              <th className="p-2 text-text-muted font-normal w-16" />
              {partyMeta.map((p, i) => (
                <th key={i} className="p-1.5 text-center font-medium" style={{ color: p.color, minWidth: 60 }}>
                  <div>{p.logo_emoji}</div>
                  <div>{p.abbr}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HEATMAP_PARTIES.map((rowParty, ri) => (
              <tr key={rowParty}>
                <td className="p-1.5 font-medium text-right pr-3" style={{ color: partyMeta[ri].color }}>
                  {partyMeta[ri].logo_emoji} {partyMeta[ri].abbr}
                </td>
                {HEATMAP_PARTIES.map((colParty, ci) => {
                  const score = matrix[ri][ci]
                  const cellKey = `${ri}-${ci}`
                  const isHovered = hoveredCell === cellKey
                  return (
                    <td
                      key={ci}
                      className="p-1 text-center cursor-default transition-all relative"
                      onMouseEnter={() => setHoveredCell(cellKey)}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <div
                        className="w-12 h-10 mx-auto flex items-center justify-center rounded font-bold text-xs transition-transform"
                        style={{
                          backgroundColor: affinityColor(score) + (rowParty === colParty ? 'ff' : '99'),
                          color: score >= 45 ? '#1a1a1a' : '#fff',
                          transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                          border: isHovered ? '2px solid #fff4' : '2px solid transparent',
                        }}
                      >
                        {rowParty === colParty ? '—' : score}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Color legend */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
        <span className="font-medium text-text-primary">Skala Afinitas:</span>
        {[
          { label: '≥ 75 — Sangat Dekat',   color: '#22c55e' },
          { label: '55–74 — Dekat',          color: '#86efac' },
          { label: '45–54 — Netral',         color: '#fef08a' },
          { label: '30–44 — Renggang',       color: '#fb923c' },
          { label: '< 30 — Antagonis',       color: '#ef4444' },
        ].map(({ label, color }) => (
          <span key={label} className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: color }} />
            {label}
          </span>
        ))}
      </div>

      {/* Top affinity pairs */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Most aligned */}
        <div className="bg-bg-card rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">🟢 Pasangan Paling Afinitas</h3>
          <div className="space-y-2">
            {useMemo(() => {
              const pairs = []
              for (let i = 0; i < HEATMAP_PARTIES.length; i++) {
                for (let j = i + 1; j < HEATMAP_PARTIES.length; j++) {
                  pairs.push({ a: HEATMAP_PARTIES[i], b: HEATMAP_PARTIES[j], score: matrix[i][j] })
                }
              }
              return pairs.sort((x, y) => y.score - x.score).slice(0, 5)
            }, [matrix]).map(({ a, b, score }) => (
              <div key={`${a}-${b}`} className="flex items-center justify-between text-sm">
                <span>
                  <span style={{ color: PARTY_MAP[a]?.color }}>{PARTY_MAP[a]?.abbr || a}</span>
                  <span className="text-text-muted mx-1">–</span>
                  <span style={{ color: PARTY_MAP[b]?.color }}>{PARTY_MAP[b]?.abbr || b}</span>
                </span>
                <span className="font-bold text-green-400">{score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Most divergent */}
        <div className="bg-bg-card rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">🔴 Pasangan Paling Renggang</h3>
          <div className="space-y-2">
            {useMemo(() => {
              const pairs = []
              for (let i = 0; i < HEATMAP_PARTIES.length; i++) {
                for (let j = i + 1; j < HEATMAP_PARTIES.length; j++) {
                  pairs.push({ a: HEATMAP_PARTIES[i], b: HEATMAP_PARTIES[j], score: matrix[i][j] })
                }
              }
              return pairs.sort((x, y) => x.score - y.score).slice(0, 5)
            }, [matrix]).map(({ a, b, score }) => (
              <div key={`${a}-${b}`} className="flex items-center justify-between text-sm">
                <span>
                  <span style={{ color: PARTY_MAP[a]?.color }}>{PARTY_MAP[a]?.abbr || a}</span>
                  <span className="text-text-muted mx-1">–</span>
                  <span style={{ color: PARTY_MAP[b]?.color }}>{PARTY_MAP[b]?.abbr || b}</span>
                </span>
                <span className="font-bold text-red-400">{score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Methodology note */}
      <div className="bg-blue-500/10 rounded-xl border border-blue-500/30 p-4 text-sm text-text-muted">
        <h3 className="font-semibold text-blue-400 mb-2">ℹ️ Metodologi Afinitas</h3>
        <ul className="space-y-1">
          <li>• <strong className="text-text-primary">Koalisi Pemerintahan (40%)</strong> — Jumlah periode pemerintahan (2004–2024) di mana kedua partai berada dalam koalisi yang sama, dari total {HISTORICAL_COALITIONS.length} periode koalisi yang dianalisis.</li>
          <li>• <strong className="text-text-primary">Keselarasan Voting DPR (60%)</strong> — Proporsi RUU ({BILLS.length} undang-undang) di mana kedua partai memberikan suara yang sama (setuju/menolak).</li>
          <li>• Skor 100 = identik · Skor 0 = berlawanan total pada semua dimensi.</li>
          <li>• Data koalisi berdasarkan susunan kabinet resmi; data voting dari arsip DPR RI.</li>
        </ul>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 7: TREN SKOR (Score Scenario Simulator)
// ═══════════════════════════════════════════════════════════════════════════════

function computeScoresWithPenalty(penaltyMultiplier) {
  const customPenalties = {
    terpidana: Math.min(-100, CORRUPTION_PENALTIES.terpidana * penaltyMultiplier),
    tersangka:  Math.min(-100, CORRUPTION_PENALTIES.tersangka  * penaltyMultiplier),
    tinggi:    Math.min(-100, CORRUPTION_PENALTIES.tinggi    * penaltyMultiplier),
    sedang:    Math.min(-100, CORRUPTION_PENALTIES.sedang    * penaltyMultiplier),
    rendah:    0,
  }

  return PERSONS.map(person => {
    const base = scoreIndividu(person, CONNECTIONS)
    // Recompute total with modified penalty
    const risk = person.analysis?.corruption_risk || 'rendah'
    const origPenalty = CORRUPTION_PENALTIES[risk] || 0
    const newPenalty = customPenalties[risk] || 0
    const newTotal = Math.max(0, Math.min(100, base.total - origPenalty + newPenalty))
    return {
      id: base.id,
      name: base.name,
      position_title: base.position_title,
      party_id: base.party_id,
      corruption_risk: risk,
      baseTotal: base.total,
      newTotal: Math.round(newTotal * 10) / 10,
      delta: Math.round((newTotal - base.total) * 10) / 10,
    }
  }).sort((a, b) => b.baseTotal - a.baseTotal).slice(0, 15)
}

function TabTrenSkor() {
  const [penaltyMultiplier, setPenaltyMultiplier] = useState(1)

  const baseScores   = useMemo(() => scoreAllPersons().slice(0, 15), [])
  const scenarioData = useMemo(() => computeScoresWithPenalty(penaltyMultiplier), [penaltyMultiplier])

  // Merge for comparison chart
  const chartData = useMemo(() => {
    return scenarioData.map(s => ({
      name: s.name.split(' ').slice(0, 2).join(' '),
      fullName: s.name,
      base: s.baseTotal,
      skenario: s.newTotal,
      delta: s.delta,
      risk: s.corruption_risk,
      party_id: s.party_id,
      color: PARTY_MAP[s.party_id]?.color || '#6b7280',
    }))
  }, [scenarioData])

  const riskColor = risk => {
    if (risk === 'terpidana') return '#7f1d1d'
    if (risk === 'tersangka') return '#ef4444'
    if (risk === 'tinggi')    return '#f97316'
    if (risk === 'sedang')    return '#f59e0b'
    return '#22c55e'
  }

  const mostImpacted = [...chartData].sort((a, b) => a.delta - b.delta).slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text-primary">🎚️ Tren Skor — Simulasi Skenario</h2>
        <p className="text-sm text-text-muted mt-1">
          Bagaimana skor individu berubah jika bobot penalti korupsi dinaikkan? Geser slider untuk mengeksplorasi skenario.
        </p>
      </div>

      {/* Slider */}
      <div className="bg-bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-text-primary">⚖️ Skenario Korupsi — Bobot Penalti</h3>
          <span className="text-lg font-bold" style={{ color: penaltyMultiplier > 2 ? '#ef4444' : penaltyMultiplier > 1.5 ? '#f59e0b' : '#22c55e' }}>
            {penaltyMultiplier.toFixed(1)}×
          </span>
        </div>
        <input
          type="range"
          min={0.5}
          max={4}
          step={0.1}
          value={penaltyMultiplier}
          onChange={e => setPenaltyMultiplier(parseFloat(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: '#ef4444' }}
        />
        <div className="flex justify-between text-xs text-text-muted mt-1">
          <span>0.5× (Lunak)</span>
          <span>1.0× (Standar)</span>
          <span>2× (Ketat)</span>
          <span>4× (Sangat Ketat)</span>
        </div>
        <p className="text-xs text-text-muted mt-3">
          Penalti saat ini: Terpidana <span className="text-red-400 font-bold">{Math.round(CORRUPTION_PENALTIES.terpidana * penaltyMultiplier)}</span>
          {' · '} Tersangka <span className="text-orange-400 font-bold">{Math.round(CORRUPTION_PENALTIES.tersangka * penaltyMultiplier)}</span>
          {' · '} Risiko Tinggi <span className="text-yellow-400 font-bold">{Math.round(CORRUPTION_PENALTIES.tinggi * penaltyMultiplier)}</span>
          {' · '} Risiko Sedang <span className="text-amber-400 font-bold">{Math.round(CORRUPTION_PENALTIES.sedang * penaltyMultiplier)}</span>
        </p>
      </div>

      {/* Before vs After bar chart */}
      <div className="bg-bg-card rounded-xl border border-border p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-4">
          Perbandingan Skor Top 15 — Standar vs {penaltyMultiplier.toFixed(1)}× Penalti Korupsi
        </h3>
        <ResponsiveContainer width="100%" height={460}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 60, left: 110, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <YAxis
              dataKey="name"
              type="category"
              width={108}
              tick={{ fill: '#d1d5db', fontSize: 11 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const d = payload[0]?.payload
                return (
                  <div className="bg-bg-card border border-border rounded-lg p-3 text-xs space-y-1 shadow-xl">
                    <p className="font-bold text-text-primary">{d.fullName}</p>
                    <p className="text-text-muted">Skor Standar: <span className="text-blue-400 font-bold">{d.base}</span></p>
                    <p className="text-text-muted">Skor Skenario: <span className="text-red-400 font-bold">{d.skenario}</span></p>
                    <p className="text-text-muted">Perubahan: <span style={{ color: d.delta < 0 ? '#ef4444' : '#22c55e', fontWeight: 'bold' }}>{d.delta >= 0 ? '+' : ''}{d.delta}</span></p>
                    <p className="text-text-muted">Risiko: <span style={{ color: riskColor(d.risk) }}>{d.risk}</span></p>
                  </div>
                )
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11 }}
              formatter={v => v === 'base' ? 'Skor Standar (1×)' : `Skor Skenario (${penaltyMultiplier.toFixed(1)}×)`}
            />
            <Bar dataKey="base"     name="base"     fill="#3b82f6" opacity={0.7} radius={[0, 3, 3, 0]} label={false} />
            <Bar dataKey="skenario" name="skenario"  fill="#ef4444" opacity={0.9} radius={[0, 3, 3, 0]}
              label={{ position: 'right', fill: '#9ca3af', fontSize: 10, formatter: v => v }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Most impacted */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-bg-card rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">📉 Paling Terdampak (Skor Turun)</h3>
          <div className="space-y-3">
            {mostImpacted.map(d => (
              <div key={d.name} className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-text-primary font-medium">{d.fullName}</span>
                  <span className="font-bold text-red-400">{d.delta}</span>
                </div>
                <div className="flex gap-2 items-center">
                  <ProgressBar value={d.base}     max={100} color="#3b82f6" height={4} />
                  <span className="text-xs text-blue-400 w-8">{d.base}</span>
                </div>
                <div className="flex gap-2 items-center mt-0.5">
                  <ProgressBar value={d.skenario} max={100} color="#ef4444" height={4} />
                  <span className="text-xs text-red-400 w-8">{d.skenario}</span>
                </div>
                <span className="text-[10px] mt-1 inline-block" style={{ color: riskColor(d.risk) }}>
                  ▲ {d.risk}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-bg-card rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">📊 Insight Skenario</h3>
          <div className="space-y-3 text-sm text-text-muted">
            <div className="flex gap-2 items-start">
              <span className="text-blue-400 flex-shrink-0">📌</span>
              <span>
                Pada penalti <strong className="text-text-primary">{penaltyMultiplier.toFixed(1)}×</strong>,
                tokoh dengan risiko korupsi <em>tinggi/terpidana</em> kehilangan skor signifikan,
                sementara tokoh bersih tetap stabil.
              </span>
            </div>
            <div className="flex gap-2 items-start">
              <span className="text-amber-400 flex-shrink-0">⚠️</span>
              <span>
                Sistem standar (1×) menggunakan penalti: Terpidana −40, Tersangka −30, Risiko Tinggi −15, Risiko Sedang −5.
                Semakin tinggi multiplier, semakin besar gap antara tokoh bersih dan bermasalah.
              </span>
            </div>
            <div className="flex gap-2 items-start">
              <span className="text-green-400 flex-shrink-0">💡</span>
              <span>
                Coba multiplier <strong className="text-text-primary">2×–3×</strong> untuk melihat bagaimana ranking berubah
                jika KPK lebih agresif menegakkan hukum dan masyarakat memberi penalti sosial lebih besar.
              </span>
            </div>
            <div className="mt-3 p-3 bg-bg-elevated rounded-lg">
              <p className="text-xs text-text-muted">
                <strong className="text-text-primary">Jumlah tokoh terdampak (skor berubah):</strong>
                {' '}{chartData.filter(d => d.delta !== 0).length} dari 15 tokoh top.
                <br />
                <strong className="text-text-primary">Rata-rata perubahan skor:</strong>
                {' '}{(chartData.reduce((s, d) => s + d.delta, 0) / chartData.length).toFixed(1)} poin
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 9: PREDIKSI 2029
// ═══════════════════════════════════════════════════════════════════════════════
function TabPrediksi2029() {
  const pilpresScenarioData = [
    { short: 'Prabowo',     fullName: 'Prabowo Subianto', skenarioA: 45, skenarioB: 35, note: 'Incumbent premium; volatil terhadap ekonomi' },
    { short: 'Anies',       fullName: 'Anies Baswedan',   skenarioA: 25, skenarioB: 28, note: 'Basis oposisi konsisten; urban kuat' },
    { short: 'Ganjar/PDIP', fullName: 'Ganjar / Kandidat PDIP', skenarioA: 17, skenarioB: 20, note: 'Bergantung rekonsiliasi internal PDIP' },
    { short: 'RK',          fullName: 'Ridwan Kamil',     skenarioA: 12, skenarioB: 10, note: 'Emerging; hasil Pilkada jadi batu ujian' },
    { short: 'AHY',         fullName: 'AHY / Dark Horse', skenarioA: 10, skenarioB: 8,  note: 'Efek "Menteri" bisa naikkan popularitas' },
  ]

  const dprData = [
    { name: 'Gerindra', current: 86,  projected: 95, color: '#ef4444', reason: 'Incumbent premium' },
    { name: 'PDIP',     current: 110, projected: 85, color: '#dc2626', reason: 'Penalti oposisi' },
    { name: 'Golkar',   current: 102, projected: 95, color: '#f59e0b', reason: 'Stabil koalisi' },
    { name: 'PKB',      current: 68,  projected: 75, color: '#22c55e', reason: 'Basis NU tumbuh' },
    { name: 'NasDem',   current: 69,  projected: 55, color: '#3b82f6', reason: 'Sinyal Jakarta melemah' },
    { name: 'PKS',      current: 53,  projected: 65, color: '#8b5cf6', reason: 'Basis Islamis tumbuh' },
    { name: 'Demokrat', current: 44,  projected: 50, color: '#06b6d4', reason: 'Efek AHY Menteri' },
    { name: 'PAN',      current: 48,  projected: 45, color: '#f97316', reason: 'Stabil' },
  ]

  const totalProjected = dprData.reduce((s, d) => s + d.projected, 0)

  const trendData = useMemo(() =>
    PILPRES_2029_POLLS.map(p => ({ date: p.date, ...p.candidates })),
    []
  )

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-text-primary">🔮 Prediksi Lanskap Politik 2029</h2>
        <p className="text-sm text-text-muted mt-1">
          Proyeksi berbasis tren survei 2024–2025 · Bukan prediksi resmi
        </p>
      </div>

      {/* ── A: Pilpres 2029 Scenario Chart ── */}
      <div className="bg-bg-card rounded-xl border border-border p-5">
        <h3 className="text-base font-semibold text-text-primary mb-1">A. Proyeksi Pilpres 2029 — Putaran Pertama</h3>
        <p className="text-xs text-text-muted mb-4">
          Skenario A: Ekonomi Baik · Skenario B: Penurunan Ekonomi
          <br />
          Sumber: Proyeksi berdasarkan tren survei 2024–2025
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={pilpresScenarioData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="short" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} unit="%" domain={[0, 55]} />
            <Tooltip
              contentStyle={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }}
              formatter={(v, name) => [`${v}%`, name === 'skenarioA' ? '🟢 Skenario A (Ekonomi Baik)' : '🔴 Skenario B (Penurunan)']}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                const d = payload[0]?.payload
                return (
                  <div className="bg-bg-card border border-border rounded-lg p-3 text-xs shadow-xl">
                    <p className="font-bold text-text-primary mb-1">{d.fullName}</p>
                    <p className="text-green-400">🟢 Skenario A (Ekonomi Baik): {d.skenarioA}%</p>
                    <p className="text-red-400">🔴 Skenario B (Penurunan): {d.skenarioB}%</p>
                    <p className="text-text-muted mt-1 italic">{d.note}</p>
                  </div>
                )
              }}
            />
            <Legend formatter={v => v === 'skenarioA' ? '🟢 Skenario A (Ekonomi Baik)' : '🔴 Skenario B (Penurunan)'} />
            <Bar dataKey="skenarioA" name="skenarioA" fill="#22c55e" radius={[4, 4, 0, 0]}
              label={{ position: 'top', fill: '#9ca3af', fontSize: 10, formatter: v => `${v}%` }}
            />
            <Bar dataKey="skenarioB" name="skenarioB" fill="#ef4444" radius={[4, 4, 0, 0]}
              label={{ position: 'top', fill: '#9ca3af', fontSize: 10, formatter: v => `${v}%` }}
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Candidate notes */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {pilpresScenarioData.map(c => (
            <div key={c.short} className="bg-bg-elevated rounded-lg p-3 text-xs">
              <p className="font-semibold text-text-primary mb-1">{c.fullName}</p>
              <p className="text-amber-400 font-bold mb-1">{c.skenarioB}–{c.skenarioA}%</p>
              <p className="text-text-muted leading-relaxed">{c.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Survey Trend Chart ── */}
      <div className="bg-bg-card rounded-xl border border-border p-5">
        <h3 className="text-base font-semibold text-text-primary mb-1">Tren Elektabilitas 2029 (Data Survei)</h3>
        <p className="text-xs text-text-muted mb-4">
          Dari {PILPRES_2029_POLLS.length} survei (Sep 2024 – Des 2025, termasuk proyeksi) · Sumber: Saiful Mujani, Indikator, SMRC, Charta, Median
        </p>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={trendData} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 10 }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} unit="%" />
            <Tooltip contentStyle={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 11 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="prabowo"      name="Prabowo"      stroke="#ef4444" strokeWidth={2}   dot={{ r: 3 }} connectNulls />
            <Line type="monotone" dataKey="anies"        name="Anies"        stroke="#3b82f6" strokeWidth={2}   dot={{ r: 3 }} connectNulls />
            <Line type="monotone" dataKey="dedi_mulyadi" name="Dedi Mulyadi" stroke="#22c55e" strokeWidth={1.5} dot={{ r: 3 }} connectNulls />
            <Line type="monotone" dataKey="khofifah"     name="Khofifah"     stroke="#f59e0b" strokeWidth={1.5} dot={{ r: 3 }} connectNulls />
            <Line type="monotone" dataKey="ridwan_kamil" name="RK"           stroke="#8b5cf6" strokeWidth={1.5} dot={{ r: 3 }} connectNulls />
            <Line type="monotone" dataKey="ahy"          name="AHY"          stroke="#06b6d4" strokeWidth={1}   dot={{ r: 2 }} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── B: DPR 2029 Projection ── */}
      <div className="bg-bg-card rounded-xl border border-border p-5">
        <h3 className="text-base font-semibold text-text-primary mb-1">B. Proyeksi Kursi DPR 2029</h3>
        <p className="text-xs text-text-muted mb-4">
          Perbandingan kursi DPR 2024 vs proyeksi 2029 · Total proyeksi: <strong className="text-text-primary">{totalProjected} kursi</strong>
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dprData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} domain={[0, 130]} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const d = payload[0]?.payload
                const delta = d.projected - d.current
                return (
                  <div className="bg-bg-card border border-border rounded-lg p-3 text-xs">
                    <p className="font-bold" style={{ color: d.color }}>{d.name}</p>
                    <p className="text-text-muted">2024: <strong className="text-text-primary">{d.current}</strong></p>
                    <p className="text-text-muted">Proyeksi 2029: <strong className="text-text-primary">{d.projected}</strong></p>
                    <p style={{ color: delta > 0 ? '#22c55e' : delta < 0 ? '#ef4444' : '#9ca3af' }}>
                      Delta: {delta > 0 ? '+' : ''}{delta}
                    </p>
                    <p className="text-text-muted mt-1 italic">{d.reason}</p>
                  </div>
                )
              }}
            />
            <Legend formatter={v => v === 'current' ? '🏛️ Kursi DPR 2024' : '🔮 Proyeksi 2029'} />
            <Bar dataKey="current"   name="current"   radius={[4, 4, 0, 0]} label={{ position: 'top', fill: '#9ca3af', fontSize: 10 }}>
              {dprData.map(d => <Cell key={d.name} fill={d.color} opacity={0.45} />)}
            </Bar>
            <Bar dataKey="projected" name="projected" radius={[4, 4, 0, 0]} label={{ position: 'top', fill: '#9ca3af', fontSize: 10 }}>
              {dprData.map(d => <Cell key={d.name} fill={d.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Delta table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-text-muted">Partai</th>
                <th className="text-right py-2 px-3 text-text-muted">2024</th>
                <th className="text-right py-2 px-3 text-text-muted">Proyeksi 2029</th>
                <th className="text-right py-2 px-3 text-text-muted">Delta</th>
                <th className="text-left py-2 px-3 text-text-muted">Alasan Proyeksi</th>
              </tr>
            </thead>
            <tbody>
              {dprData.map(d => {
                const delta = d.projected - d.current
                return (
                  <tr key={d.name} className="border-b border-border/50 hover:bg-bg-elevated/50">
                    <td className="py-2 px-3 font-medium" style={{ color: d.color }}>{d.name}</td>
                    <td className="py-2 px-3 text-right text-text-muted">{d.current}</td>
                    <td className="py-2 px-3 text-right font-bold text-text-primary">{d.projected}</td>
                    <td className="py-2 px-3 text-right font-bold" style={{ color: delta > 0 ? '#22c55e' : delta < 0 ? '#ef4444' : '#9ca3af' }}>
                      {delta > 0 ? '+' : ''}{delta}
                    </td>
                    <td className="py-2 px-3 text-text-muted">{d.reason}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-text-muted mt-3 italic">
          * Proyeksi indikatif — bukan prediksi resmi. Berdasarkan tren historis 2019–2024, polling partai terkini, dan dinamika koalisi.
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 10: KORELASI STATISTIK
// ═══════════════════════════════════════════════════════════════════════════════
function TabKorelasiStat() {
  // ── Section A: LHKPN vs Controversy ──
  const lhkpnData = useMemo(() =>
    PERSONS
      .filter(p => p.lhkpn_latest && p.lhkpn_latest > 0 && p.analysis?.controversy_level != null)
      .map(p => ({
        id: p.id,
        name: p.name.split(' ').slice(0, 2).join(' '),
        fullName: p.name,
        x: p.lhkpn_latest / 1_000_000_000,
        y: p.analysis.controversy_level,
        tier: p.tier,
        party_id: p.party_id,
      })),
    []
  )

  const lhkpnXs = useMemo(() => lhkpnData.map(d => d.x), [lhkpnData])
  const lhkpnYs = useMemo(() => lhkpnData.map(d => d.y), [lhkpnData])
  const lhkpnR   = useMemo(() => pearsonR(lhkpnXs, lhkpnYs), [lhkpnXs, lhkpnYs])
  const lhkpnReg = useMemo(() => linearRegression(lhkpnXs, lhkpnYs), [lhkpnXs, lhkpnYs])
  const lhkpnRI  = useMemo(() => lhkpnR !== null ? interpretR(lhkpnR) : null, [lhkpnR])

  const lhkpnRegLine = useMemo(() => {
    if (lhkpnXs.length < 2) return []
    const minX = Math.min(...lhkpnXs), maxX = Math.max(...lhkpnXs)
    return [
      { x: minX, y: lhkpnReg.slope * minX + lhkpnReg.intercept },
      { x: maxX, y: lhkpnReg.slope * maxX + lhkpnReg.intercept },
    ]
  }, [lhkpnXs, lhkpnReg])

  const top5Outliers = useMemo(() =>
    [...lhkpnData].sort((a, b) => (b.x * b.y) - (a.x * a.y)).slice(0, 5),
    [lhkpnData]
  )

  // ── Section B: Network Size vs Influence ──
  const netInflData = useMemo(() =>
    PERSONS.map(p => {
      const connCount = CONNECTIONS.filter(c => c.from === p.id || c.to === p.id).length
      const s = scoreOnePerson(p, CONNECTIONS)
      return {
        id: p.id,
        name: p.name.split(' ').slice(0, 2).join(' '),
        fullName: p.name,
        x: connCount,
        y: s.total,
        tier: p.tier,
      }
    }).filter(d => d.x > 0),
    []
  )

  const netXs = useMemo(() => netInflData.map(d => d.x), [netInflData])
  const netYs = useMemo(() => netInflData.map(d => d.y), [netInflData])
  const netR   = useMemo(() => pearsonR(netXs, netYs), [netXs, netYs])
  const netReg = useMemo(() => linearRegression(netXs, netYs), [netXs, netYs])
  const netRI  = useMemo(() => netR !== null ? interpretR(netR) : null, [netR])

  const netRegLine = useMemo(() => {
    if (netXs.length < 2) return []
    const minX = Math.min(...netXs), maxX = Math.max(...netXs)
    return [
      { x: minX, y: netReg.slope * minX + netReg.intercept },
      { x: maxX, y: netReg.slope * maxX + netReg.intercept },
    ]
  }, [netXs, netReg])

  // ── Section C: Party vs Governance ──
  const partyGovData = useMemo(() => {
    const scored = calculateScores(PROVINCE_SCORECARD)
    const partyMap = {}
    scored.forEach(p => {
      const key = p.party || 'Lainnya'
      if (!partyMap[key]) partyMap[key] = []
      partyMap[key].push(p.total_score)
    })
    return Object.entries(partyMap)
      .map(([party, scores], i) => ({
        party,
        avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
        count: scores.length,
        colorIdx: i,
      }))
      .sort((a, b) => b.avg - a.avg)
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-text-primary">📐 Analisis Korelasi Statistik</h2>
        <p className="text-sm text-text-muted mt-1">
          Korelasi antar dimensi data: kekayaan vs kontroversi, jaringan vs pengaruh, partai vs tata kelola
        </p>
      </div>

      {/* ── A: LHKPN vs Controversy ── */}
      <div className="bg-bg-card rounded-xl border border-border p-5">
        <h3 className="text-base font-semibold text-text-primary mb-1">A. Kekayaan LHKPN vs Tingkat Kontroversi</h3>
        <p className="text-xs text-text-muted mb-4">
          N = {lhkpnData.length} tokoh · X = Kekayaan LHKPN (miliar Rp) · Y = Controversy Level (0–10)
        </p>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-bg-elevated rounded-lg p-3">
            <p className="text-xs text-text-muted">Pearson r</p>
            <p className="text-xl font-bold mt-1" style={{ color: lhkpnRI?.color }}>{lhkpnR?.toFixed(3) ?? 'N/A'}</p>
            {lhkpnRI && <p className="text-[10px] text-text-muted mt-0.5">{lhkpnRI.label}</p>}
          </div>
          <div className="bg-bg-elevated rounded-lg p-3">
            <p className="text-xs text-text-muted">R²</p>
            <p className="text-xl font-bold mt-1 text-text-primary">
              {lhkpnReg?.r2 != null ? (lhkpnReg.r2 * 100).toFixed(1) + '%' : '-'}
            </p>
            <p className="text-[10px] text-text-muted mt-0.5">Variansi dijelaskan</p>
          </div>
          <div className="bg-bg-elevated rounded-lg p-3">
            <p className="text-xs text-text-muted">Sampel</p>
            <p className="text-xl font-bold mt-1 text-text-primary">{lhkpnData.length}</p>
            <p className="text-[10px] text-text-muted mt-0.5">tokoh LHKPN valid</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0f" />
            <XAxis
              dataKey="x" type="number" domain={['auto', 'auto']}
              label={{ value: 'Kekayaan LHKPN (Miliar Rp)', position: 'insideBottom', offset: -15, fill: '#9ca3af', fontSize: 11 }}
              tick={{ fill: '#9ca3af', fontSize: 10 }}
            />
            <YAxis
              dataKey="y" type="number" domain={[0, 11]}
              label={{ value: 'Controversy Level', angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 11 }}
              tick={{ fill: '#9ca3af', fontSize: 10 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const d = payload[0]?.payload
                if (!d?.fullName) return null
                return (
                  <div className="bg-bg-card border border-border rounded-lg p-3 text-xs shadow-xl">
                    <p className="font-bold text-text-primary mb-1">{d.fullName}</p>
                    <p className="text-text-muted">LHKPN: <strong className="text-amber-400">Rp {d.x?.toFixed(1)} M</strong></p>
                    <p className="text-text-muted">Kontroversi: <strong className="text-red-400">{d.y}/10</strong></p>
                  </div>
                )
              }}
            />
            <Scatter name="Tokoh" data={lhkpnData} fill="#f59e0b" opacity={0.75} />
            <Line data={lhkpnRegLine} dataKey="y" type="linear" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Regresi" legendType="line" />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </ComposedChart>
        </ResponsiveContainer>
        {/* Top 5 outliers */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-text-primary mb-2">🎯 Top 5 Outlier (Kaya + Kontroversial)</h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {top5Outliers.map(d => (
              <div key={d.id} className="bg-bg-elevated rounded-lg p-3 text-[11px]">
                <p className="font-semibold text-text-primary truncate mb-1">{d.fullName}</p>
                <p className="text-amber-400">Rp {d.x.toFixed(1)} M</p>
                <p className="text-red-400">Kontroversi: {d.y}/10</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── B: Network vs Influence ── */}
      <div className="bg-bg-card rounded-xl border border-border p-5">
        <h3 className="text-base font-semibold text-text-primary mb-1">B. Ukuran Jaringan vs Skor Pengaruh</h3>
        <p className="text-xs text-text-muted mb-4">
          N = {netInflData.length} tokoh · X = Jumlah Koneksi · Y = Skor Total
        </p>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-bg-elevated rounded-lg p-3">
            <p className="text-xs text-text-muted">Pearson r</p>
            <p className="text-xl font-bold mt-1" style={{ color: netRI?.color }}>{netR?.toFixed(3) ?? 'N/A'}</p>
            {netRI && <p className="text-[10px] text-text-muted mt-0.5">{netRI.label}</p>}
          </div>
          <div className="bg-bg-elevated rounded-lg p-3">
            <p className="text-xs text-text-muted">R²</p>
            <p className="text-xl font-bold mt-1 text-text-primary">
              {netReg?.r2 != null ? (netReg.r2 * 100).toFixed(1) + '%' : '-'}
            </p>
            <p className="text-[10px] text-text-muted mt-0.5">Variansi dijelaskan</p>
          </div>
          <div className="bg-bg-elevated rounded-lg p-3">
            <p className="text-xs text-text-muted">Avg Koneksi</p>
            <p className="text-xl font-bold mt-1 text-text-primary">
              {netXs.length > 0 ? (netXs.reduce((a, b) => a + b, 0) / netXs.length).toFixed(1) : 0}
            </p>
            <p className="text-[10px] text-text-muted mt-0.5">per tokoh (dengan koneksi)</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0f" />
            <XAxis
              dataKey="x" type="number" domain={['auto', 'auto']}
              label={{ value: 'Jumlah Koneksi', position: 'insideBottom', offset: -15, fill: '#9ca3af', fontSize: 11 }}
              tick={{ fill: '#9ca3af', fontSize: 10 }}
            />
            <YAxis
              dataKey="y" type="number" domain={[0, 105]}
              label={{ value: 'Skor Total', angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 11 }}
              tick={{ fill: '#9ca3af', fontSize: 10 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const d = payload[0]?.payload
                if (!d?.fullName) return null
                const tc = d.tier === 'nasional' ? '#ef4444' : d.tier === 'regional' ? '#3b82f6' : '#9ca3af'
                return (
                  <div className="bg-bg-card border border-border rounded-lg p-3 text-xs shadow-xl">
                    <p className="font-bold text-text-primary mb-1">{d.fullName}</p>
                    <p className="text-text-muted">Koneksi: <strong className="text-blue-400">{d.x}</strong></p>
                    <p className="text-text-muted">Skor: <strong className="text-amber-400">{d.y?.toFixed(1)}</strong></p>
                    <p className="text-text-muted">Tier: <span style={{ color: tc }}>{d.tier}</span></p>
                  </div>
                )
              }}
            />
            <Scatter name="Nasional"   data={netInflData.filter(d => d.tier === 'nasional')}  fill="#ef4444" opacity={0.8} />
            <Scatter name="Provinsi"   data={netInflData.filter(d => d.tier === 'regional')}  fill="#3b82f6" opacity={0.75} />
            <Scatter name="Kab/Lainnya" data={netInflData.filter(d => d.tier !== 'nasional' && d.tier !== 'regional')} fill="#6b7280" opacity={0.6} />
            <Line data={netRegLine} dataKey="y" type="linear" stroke="#f59e0b" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Regresi" legendType="line" />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* ── C: Party vs Governance ── */}
      <div className="bg-bg-card rounded-xl border border-border p-5">
        <h3 className="text-base font-semibold text-text-primary mb-1">C. Partai Gubernur vs Rata-rata Skor Tata Kelola</h3>
        <p className="text-xs text-text-muted mb-4">
          Dari {PROVINCE_SCORECARD.length} provinsi · Skor dari calculateScores() — berbobot IPM, Anti-Korupsi, PAD, Infrastruktur, Transparansi, Inovasi
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={partyGovData} margin={{ top: 10, right: 20, left: 0, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="party" tick={{ fill: '#9ca3af', fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} domain={[0, 100]} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const d = payload[0]?.payload
                return (
                  <div className="bg-bg-card border border-border rounded-lg p-3 text-xs">
                    <p className="font-bold text-text-primary">{d.party}</p>
                    <p className="text-text-muted">Avg Score: <strong className="text-amber-400">{d.avg}</strong></p>
                    <p className="text-text-muted">Provinsi: {d.count}</p>
                  </div>
                )
              }}
            />
            <Bar dataKey="avg" name="Avg Governance Score" radius={[4, 4, 0, 0]}
              label={{ position: 'top', fill: '#9ca3af', fontSize: 9 }}
            >
              {partyGovData.map((d, i) => (
                <Cell key={i} fill={`hsl(${(i * 47 + 200) % 360}, 60%, 55%)`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 11: PERBANDINGAN CEPAT
// ═══════════════════════════════════════════════════════════════════════════════
function TabPerbandinganCepat() {
  const [personAId, setPersonAId] = useState('prabowo')
  const [personBId, setPersonBId] = useState('anies')

  const personA = useMemo(() => PERSONS.find(p => p.id === personAId), [personAId])
  const personB = useMemo(() => PERSONS.find(p => p.id === personBId), [personBId])
  const scoreA  = useMemo(() => personA ? scoreOnePerson(personA, CONNECTIONS) : null, [personA])
  const scoreB  = useMemo(() => personB ? scoreOnePerson(personB, CONNECTIONS) : null, [personB])

  const connA = useMemo(() => personA ? CONNECTIONS.filter(c => c.from === personA.id || c.to === personA.id).length : 0, [personA])
  const connB = useMemo(() => personB ? CONNECTIONS.filter(c => c.from === personB.id || c.to === personB.id).length : 0, [personB])

  const personOptions = useMemo(() =>
    [...PERSONS].sort((a, b) => {
      const tier = { nasional: 0, regional: 1, historis: 2, kabupaten: 3 }
      return (tier[a.tier] ?? 9) - (tier[b.tier] ?? 9) || a.name.localeCompare(b.name)
    }),
    []
  )

  const fmtLHKPN = v => {
    if (!v) return 'N/A'
    if (v >= 1_000_000_000_000) return `Rp ${(v / 1_000_000_000_000).toFixed(2)} T`
    if (v >= 1_000_000_000)     return `Rp ${(v / 1_000_000_000).toFixed(1)} M`
    return `Rp ${(v / 1_000_000).toFixed(0)} jt`
  }

  const kpkColor = v => ({ terpidana: '#7f1d1d', tersangka: '#ef4444', tinggi: '#f97316', sedang: '#f59e0b', rendah: '#22c55e' }[v] || '#9ca3af')

  const rows = useMemo(() => {
    if (!personA || !personB || !scoreA || !scoreB) return []
    return [
      { label: 'Skor Total',        vA: scoreA.total,                             vB: scoreB.total,                             fmt: v => typeof v === 'number' ? v.toFixed(1) : '-', higherWins: true },
      { label: 'Skor Posisi',       vA: scoreA.pos,                               vB: scoreB.pos,                               fmt: v => typeof v === 'number' ? v.toFixed(1) : '-', higherWins: true },
      { label: 'Skor Jaringan',     vA: scoreA.net,                               vB: scoreB.net,                               fmt: v => typeof v === 'number' ? v.toFixed(1) : '-', higherWins: true },
      { label: 'Partai',            vA: PARTY_MAP[personA.party_id]?.abbr || '-', vB: PARTY_MAP[personB.party_id]?.abbr || '-', fmt: v => v, higherWins: null },
      { label: 'LHKPN',            vA: personA.lhkpn_latest,                     vB: personB.lhkpn_latest,                     fmt: fmtLHKPN, higherWins: null },
      { label: 'Koneksi',           vA: connA,                                    vB: connB,                                    fmt: v => v, higherWins: true },
      { label: 'KPK Status',        vA: personA.analysis?.corruption_risk || 'rendah', vB: personB.analysis?.corruption_risk || 'rendah', fmt: v => v, higherWins: null, colorFn: kpkColor },
      { label: 'Ideology Score',    vA: personA.analysis?.ideology_score,         vB: personB.analysis?.ideology_score,         fmt: v => v ?? '-', higherWins: null },
      { label: 'Controversy Level', vA: personA.analysis?.controversy_level,      vB: personB.analysis?.controversy_level,      fmt: v => v != null ? `${v}/10` : '-', higherWins: false },
    ]
  }, [personA, personB, scoreA, scoreB, connA, connB])

  const getWinner = row => {
    if (row.higherWins === null || row.higherWins === undefined) return null
    const nA = parseFloat(row.vA), nB = parseFloat(row.vB)
    if (isNaN(nA) || isNaN(nB)) return null
    if (nA === nB) return 'tie'
    return row.higherWins ? (nA > nB ? 'A' : 'B') : (nA < nB ? 'A' : 'B')
  }

  const winsA = rows.filter(r => getWinner(r) === 'A').length
  const winsB = rows.filter(r => getWinner(r) === 'B').length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text-primary">🏆 Perbandingan Cepat</h2>
        <p className="text-sm text-text-muted mt-1">Bandingkan dua tokoh secara head-to-head berdasarkan semua dimensi data</p>
      </div>

      {/* Person Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: 'Tokoh A', value: personAId, onChange: setPersonAId, person: personA, score: scoreA, side: 'A' },
          { label: 'Tokoh B', value: personBId, onChange: setPersonBId, person: personB, score: scoreB, side: 'B' },
        ].map(({ label, value, onChange, person, score, side }) => (
          <div key={side} className="bg-bg-card rounded-xl border border-border p-4">
            <p className="text-xs text-text-muted mb-2 font-medium">{label}</p>
            <select
              value={value}
              onChange={e => onChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-bg-elevated text-text-primary text-sm focus:outline-none focus:border-accent-red mb-3"
            >
              {personOptions.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.tier})</option>
              ))}
            </select>
            {person && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-sm font-bold text-text-muted flex-shrink-0">
                  {person.photo_placeholder || person.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">{person.name}</p>
                  <p className="text-xs text-text-muted truncate">
                    {person.positions?.find(p => p.is_current)?.title || person.positions?.[0]?.title || '-'}
                  </p>
                  <PartyBadge partyId={person.party_id} />
                </div>
                {score && (
                  <div className="text-right flex-shrink-0">
                    <p className="text-[10px] text-text-muted">Skor</p>
                    <p className="text-2xl font-black text-amber-400">{score.total.toFixed(1)}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Win summary banner */}
      {personA && personB && rows.length > 0 && (
        <div className="flex items-center justify-center gap-6 py-3 bg-bg-elevated rounded-xl border border-border text-sm">
          <span className="font-bold text-green-400">{personA.name.split(' ')[0]}: {winsA} kategori menang</span>
          <span className="text-text-muted">vs</span>
          <span className="font-bold text-blue-400">{personB.name.split(' ')[0]}: {winsB} kategori menang</span>
        </div>
      )}

      {/* Comparison Table */}
      {personA && personB && rows.length > 0 && (
        <div className="bg-bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-elevated">
                  <th className="text-left px-4 py-3 text-text-muted font-medium w-44">Metrik</th>
                  <th className="text-center px-4 py-3 font-semibold text-green-400">
                    {personA.name.split(' ').slice(0, 2).join(' ')}
                  </th>
                  <th className="text-center px-4 py-3 text-text-muted font-medium w-20">🏆</th>
                  <th className="text-center px-4 py-3 font-semibold text-blue-400">
                    {personB.name.split(' ').slice(0, 2).join(' ')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => {
                  const winner = getWinner(row)
                  const cellA = winner === 'A' ? 'bg-green-500/10 border-l-2 border-green-500/50' : ''
                  const cellB = winner === 'B' ? 'bg-blue-500/10 border-r-2 border-blue-500/50' : ''
                  return (
                    <tr key={idx} className="border-b border-border/50 hover:bg-bg-elevated/50">
                      <td className="px-4 py-3 text-text-muted text-xs font-medium">{row.label}</td>
                      <td className={`px-4 py-3 text-center font-bold ${cellA}`}
                        style={{ color: row.colorFn ? row.colorFn(row.vA) : undefined }}>
                        {row.fmt(row.vA)}
                      </td>
                      <td className="px-4 py-3 text-center text-xs">
                        {winner === 'A' && <span className="text-green-400 font-bold">◀</span>}
                        {winner === 'B' && <span className="text-blue-400 font-bold">▶</span>}
                        {winner === 'tie' && <span className="text-text-muted">⚖️</span>}
                        {!winner && <span className="text-text-muted">—</span>}
                      </td>
                      <td className={`px-4 py-3 text-center font-bold ${cellB}`}
                        style={{ color: row.colorFn ? row.colorFn(row.vB) : undefined }}>
                        {row.fmt(row.vB)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Link to full comparison */}
      {personA && personB && (
        <div className="flex justify-center">
          <a
            href={`/compare/${personAId}/${personBId}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-red text-white rounded-xl font-semibold hover:opacity-90 transition-opacity text-sm"
          >
            Lihat Perbandingan Lengkap →
          </a>
        </div>
      )}

      {/* Notes */}
      <div className="bg-bg-elevated rounded-xl border border-border p-4 text-xs text-text-muted">
        <p>💡 <strong className="text-text-primary">Cara membaca:</strong> Skor Total, Posisi, Jaringan, dan Koneksi — menang = lebih tinggi.
          KPK Status — "rendah" dianggap lebih baik (penalti korupsi lebih kecil). Controversy Level — menang = lebih rendah.</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 12: JARINGAN PENGARUH
// ═══════════════════════════════════════════════════════════════════════════════
const KIM_PLUS_PARTIES  = ['ger', 'gol', 'nas', 'pan', 'dem', 'pks', 'pkb', 'pbb']
const OPOSISI_PARTIES   = ['pdip', 'psi']
const MILITER_TAGS      = ['eks-militer', 'tni', 'polri', 'keamanan', 'intelijen', 'pertahanan']
const BISNIS_TAGS       = ['pengusaha', 'bisnis', 'teknokrat']

function getCluster(person) {
  if (KIM_PLUS_PARTIES.includes(person.party_id)) return 'KIM Plus'
  if (OPOSISI_PARTIES.includes(person.party_id))  return 'Oposisi'
  const tags = person.tags || []
  if (MILITER_TAGS.some(t => tags.includes(t)))   return 'Militer/Keamanan'
  if (BISNIS_TAGS.some(t => tags.includes(t)))    return 'Bisnis'
  return 'Lainnya'
}

function TabJaringanPengaruh() {
  // ── A: Degree Distribution ──
  const connCountMap = useMemo(() => {
    const map = {}
    PERSONS.forEach(p => { map[p.id] = 0 })
    CONNECTIONS.forEach(c => {
      if (map[c.from] !== undefined) map[c.from]++
      if (map[c.to]   !== undefined) map[c.to]++
    })
    return map
  }, [])

  const degBuckets = useMemo(() => {
    const buckets = { '1': 0, '2–5': 0, '6–10': 0, '11–20': 0, '20+': 0, '0': 0 }
    Object.values(connCountMap).forEach(n => {
      if (n === 0)       buckets['0']++
      else if (n === 1)  buckets['1']++
      else if (n <= 5)   buckets['2–5']++
      else if (n <= 10)  buckets['6–10']++
      else if (n <= 20)  buckets['11–20']++
      else               buckets['20+']++
    })
    return [
      { label: '0', count: buckets['0'],   color: '#6b7280' },
      { label: '1', count: buckets['1'],   color: '#3b82f6' },
      { label: '2–5', count: buckets['2–5'],  color: '#8b5cf6' },
      { label: '6–10', count: buckets['6–10'], color: '#f59e0b' },
      { label: '11–20', count: buckets['11–20'], color: '#ef4444' },
      { label: '20+',  count: buckets['20+'],  color: '#e11d48' },
    ]
  }, [connCountMap])

  const top10 = useMemo(() =>
    Object.entries(connCountMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id, cnt]) => {
        const p = PERSONS.find(x => x.id === id)
        return { id, name: p?.name || id, party_id: p?.party_id, cnt }
      }),
    [connCountMap]
  )

  // ── B: Bridge Nodes ──
  const bridgeNodes = useMemo(() => {
    const clusterMap = {}
    PERSONS.forEach(p => { clusterMap[p.id] = getCluster(p) })

    // For each person, count how many distinct clusters their connections touch
    const bridgeScore = {}
    PERSONS.forEach(p => { bridgeScore[p.id] = new Set() })

    CONNECTIONS.forEach(c => {
      const clFrom = clusterMap[c.from]
      const clTo   = clusterMap[c.to]
      if (clFrom && clTo && clFrom !== clTo) {
        bridgeScore[c.from]?.add(clTo)
        bridgeScore[c.to]?.add(clFrom)
      }
    })

    return Object.entries(bridgeScore)
      .filter(([, s]) => s.size >= 2)
      .sort((a, b) => b[1].size - a[1].size)
      .slice(0, 8)
      .map(([id, clustersSet]) => {
        const p = PERSONS.find(x => x.id === id)
        const myCluster = clusterMap[id]
        const bridges = [...clustersSet].filter(c => c !== myCluster)
        return {
          id,
          name: p?.name || id,
          party_id: p?.party_id,
          myCluster,
          bridges,
          score: clustersSet.size,
          connCount: connCountMap[id] || 0,
        }
      })
  }, [connCountMap])

  // ── C: Cluster Summary ──
  const clusterStats = useMemo(() => {
    const clusterMap = {}
    PERSONS.forEach(p => { clusterMap[p.id] = getCluster(p) })

    const clusters = ['KIM Plus', 'Oposisi', 'Militer/Keamanan', 'Bisnis', 'Lainnya']
    const sizes = {}
    clusters.forEach(c => { sizes[c] = 0 })
    PERSONS.forEach(p => { sizes[getCluster(p)]++ })

    // Cross-cluster connection counts
    const crossMap = {}
    clusters.forEach(cA => {
      clusters.forEach(cB => {
        if (cA <= cB) crossMap[`${cA}|${cB}`] = 0
      })
    })
    CONNECTIONS.forEach(c => {
      const cA = clusterMap[c.from]
      const cB = clusterMap[c.to]
      if (!cA || !cB) return
      const key = cA <= cB ? `${cA}|${cB}` : `${cB}|${cA}`
      if (crossMap[key] !== undefined) crossMap[key]++
    })

    const crossLinks = Object.entries(crossMap)
      .filter(([k]) => !k.split('|').every((x, _, arr) => x === arr[0]))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([k, v]) => {
        const [a, b] = k.split('|')
        return { from: a, to: b, count: v }
      })

    const clusterColors = {
      'KIM Plus':        '#3b82f6',
      'Oposisi':         '#ef4444',
      'Militer/Keamanan':'#f59e0b',
      'Bisnis':          '#10b981',
      'Lainnya':         '#8b5cf6',
    }

    return { sizes, clusters, crossLinks, clusterColors }
  }, [])

  const maxDeg = Math.max(...degBuckets.map(b => b.count))

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-text-primary">🕸️ Analisis Jaringan Pengaruh</h2>
        <p className="text-sm text-text-muted mt-1">
          Distribusi derajat koneksi, bridge nodes, dan korelasi antar klaster politik
        </p>
      </div>

      {/* ── A: Degree Distribution ── */}
      <div className="bg-bg-card rounded-xl border border-border p-5">
        <h3 className="text-base font-semibold text-text-primary mb-1">A. Distribusi Derajat Koneksi</h3>
        <p className="text-xs text-text-muted mb-4">Berapa banyak tokoh yang memiliki jumlah koneksi tertentu?</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={degBuckets} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0f" />
            <XAxis dataKey="label" tick={{ fill: '#9ca3af', fontSize: 11 }} label={{ value: 'Jumlah Koneksi', position: 'insideBottom', offset: -3, fill: '#9ca3af', fontSize: 11 }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} label={{ value: 'Jumlah Tokoh', angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 11 }} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const d = payload[0]?.payload
                return (
                  <div className="bg-bg-card border border-border rounded-lg p-3 text-xs shadow-xl">
                    <p className="font-bold text-text-primary">{d.count} tokoh</p>
                    <p className="text-text-muted">dengan {d.label} koneksi</p>
                  </div>
                )
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {degBuckets.map((b, i) => <Cell key={i} fill={b.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-5">
          <h4 className="text-xs font-semibold text-text-primary mb-3">🔗 Top 10 Tokoh Paling Terkoneksi</h4>
          <div className="space-y-2">
            {top10.map((item, i) => (
              <div key={item.id} className="flex items-center gap-3">
                <span className="text-xs text-text-muted w-5 text-right">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-medium text-text-primary truncate mr-2">{item.name}</span>
                    <span className="text-xs font-bold text-accent-red shrink-0">{item.cnt}</span>
                  </div>
                  <ProgressBar value={item.cnt} max={top10[0]?.cnt || 1} color={PARTY_MAP[item.party_id]?.color || '#6366f1'} height={4} />
                </div>
                <PartyBadge partyId={item.party_id} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── B: Bridge Nodes ── */}
      <div className="bg-bg-card rounded-xl border border-border p-5">
        <h3 className="text-base font-semibold text-text-primary mb-1">B. Bridge Nodes — Penghubung Klaster</h3>
        <p className="text-xs text-text-muted mb-4">
          Tokoh yang menjembatani klaster politik berbeda — semakin banyak klaster yang dihubungkan, semakin strategis posisinya.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {bridgeNodes.map((node, i) => (
            <div key={node.id} className="bg-bg-elevated rounded-xl p-4 border border-border">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-text-primary">{node.name}</p>
                  <p className="text-[11px] text-text-muted">Klaster: {node.myCluster} · {node.connCount} koneksi</p>
                </div>
                <span className="text-lg font-black text-accent-red">#{i + 1}</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {node.bridges.map(cl => (
                  <span key={cl} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent-red/10 text-accent-red border border-accent-red/20">
                    {cl}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-text-muted">
                {node.name.split(' ')[0]} menghubungkan <strong className="text-text-primary">{node.score}</strong> klaster berbeda
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── C: Cluster Summary ── */}
      <div className="bg-bg-card rounded-xl border border-border p-5">
        <h3 className="text-base font-semibold text-text-primary mb-1">C. Ringkasan Klaster & Koneksi Lintas-Klaster</h3>
        <p className="text-xs text-text-muted mb-4">
          Distribusi tokoh per klaster dan jumlah koneksi yang menghubungkan klaster berbeda
        </p>

        {/* Cluster sizes */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {clusterStats.clusters.map(cl => (
            <div key={cl} className="bg-bg-elevated rounded-xl p-3 border border-border text-center">
              <div className="text-2xl font-black mb-1" style={{ color: clusterStats.clusterColors[cl] }}>
                {clusterStats.sizes[cl]}
              </div>
              <div className="text-[11px] text-text-muted leading-tight">{cl}</div>
            </div>
          ))}
        </div>

        {/* Cross-cluster connections */}
        <h4 className="text-xs font-semibold text-text-primary mb-3">🔀 Koneksi Lintas-Klaster Terkuat</h4>
        <div className="space-y-2">
          {clusterStats.crossLinks.map((link, i) => (
            <div key={i} className="flex items-center gap-3 bg-bg-elevated rounded-lg px-3 py-2">
              <span className="text-xs text-text-muted w-4">{i + 1}</span>
              <span className="text-xs font-medium" style={{ color: clusterStats.clusterColors[link.from] }}>{link.from}</span>
              <span className="text-text-muted text-xs">↔</span>
              <span className="text-xs font-medium" style={{ color: clusterStats.clusterColors[link.to] }}>{link.to}</span>
              <div className="flex-1">
                <ProgressBar value={link.count} max={clusterStats.crossLinks[0]?.count || 1} color="#6366f1" height={4} />
              </div>
              <span className="text-xs font-bold text-text-primary shrink-0">{link.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 13: RISIKO 2029
// ═══════════════════════════════════════════════════════════════════════════════
function TabRisiko2029() {
  // ── A: Succession Risk (Ticking Time Bombs) ──
  const ticking = useMemo(() => {
    return PERSONS
      .filter(p => p.tier === 'nasional' && p.analysis?.controversy_level != null && p.analysis?.influence != null)
      .map(p => {
        const s = scoreOnePerson(p, CONNECTIONS)
        const risk_score = (p.analysis.controversy_level / 10) * 0.5 + (p.analysis.influence / 100) * 0.5
        return {
          id: p.id,
          name: p.name,
          party_id: p.party_id,
          controversy: p.analysis.controversy_level,
          influence: p.analysis.influence,
          corruption_risk: p.analysis.corruption_risk,
          total: s.total,
          risk_score,
        }
      })
      .sort((a, b) => b.risk_score - a.risk_score)
      .slice(0, 8)
  }, [])

  // ── B: Coalition Stability ──
  const coalitionStability = useMemo(() => {
    const personCluster = {}
    PERSONS.forEach(p => { personCluster[p.id] = getCluster(p) })

    const coalitions = ['KIM Plus', 'Oposisi']
    return coalitions.map(coalition => {
      const members = PERSONS.filter(p => getCluster(p) === coalition).map(p => p.id)
      const memberSet = new Set(members)

      let internalConns = 0
      let totalConns    = 0

      CONNECTIONS.forEach(c => {
        const fromMember = memberSet.has(c.from)
        const toMember   = memberSet.has(c.to)
        if (fromMember || toMember) {
          totalConns++
          if (fromMember && toMember) internalConns++
        }
      })

      const cohesion = totalConns > 0 ? Math.round((internalConns / totalConns) * 100) : 0
      const risk = cohesion >= 70 ? 'rendah' : cohesion >= 50 ? 'sedang' : 'tinggi'
      const riskLabel = cohesion >= 70 ? '✅ Risiko perpecahan rendah' : cohesion >= 50 ? '⚠️ Risiko perpecahan sedang' : '🚨 Risiko perpecahan tinggi'
      const color = cohesion >= 70 ? '#22c55e' : cohesion >= 50 ? '#f59e0b' : '#ef4444'

      return {
        coalition,
        members: members.length,
        internalConns,
        totalConns,
        cohesion,
        risk,
        riskLabel,
        color,
      }
    })
  }, [])

  // ── C: Dark Horse Candidates ──
  const darkHorses = useMemo(() => {
    return PERSONS
      .filter(p =>
        p.tier === 'nasional' &&
        p.analysis?.influence != null &&
        p.analysis.influence > 60 &&
        (p.analysis.controversy_level == null || p.analysis.controversy_level < 3)
      )
      .map(p => {
        const s = scoreOnePerson(p, CONNECTIONS)
        const connCount = CONNECTIONS.filter(c => c.from === p.id || c.to === p.id).length
        return { ...p, total: s.total, connCount }
      })
      .sort((a, b) => b.analysis.influence - a.analysis.influence)
      .slice(0, 6)
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-text-primary">⚡ Dashboard Risiko 2029</h2>
        <p className="text-sm text-text-muted mt-1">
          Analisis risiko menuju Pemilu 2029 — suksesi, stabilitas koalisi, dan kandidat dark horse
        </p>
      </div>

      {/* ── A: Ticking Time Bombs ── */}
      <div className="bg-bg-card rounded-xl border border-border p-5">
        <h3 className="text-base font-semibold text-text-primary mb-1">A. 💣 Succession Risk — "Ticking Time Bombs"</h3>
        <p className="text-xs text-text-muted mb-4">
          Tokoh dengan influence tinggi DAN controversy level tinggi — berpotensi memicu krisis politik menjelang 2029
        </p>
        <div className="space-y-3">
          {ticking.map((p, i) => (
            <div key={p.id} className="bg-bg-elevated rounded-xl p-4 border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-accent-red">#{i + 1}</span>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{p.name}</p>
                    <p className="text-[11px] text-text-muted">{PARTY_MAP[p.party_id]?.abbr || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <RiskBadge risk={p.corruption_risk || 'rendah'} />
                  <span className="text-xs px-2 py-0.5 rounded font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                    Risk {(p.risk_score * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-text-muted mb-1">Controversy Level</p>
                  <ProgressBar value={p.controversy} max={10} color="#ef4444" />
                  <p className="text-[10px] text-text-muted mt-0.5">{p.controversy}/10</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted mb-1">Influence Score</p>
                  <ProgressBar value={p.influence} max={100} color="#f59e0b" />
                  <p className="text-[10px] text-text-muted mt-0.5">{p.influence}/100</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── B: Coalition Stability ── */}
      <div className="bg-bg-card rounded-xl border border-border p-5">
        <h3 className="text-base font-semibold text-text-primary mb-1">B. 🤝 Stabilitas Koalisi</h3>
        <p className="text-xs text-text-muted mb-4">
          Kohesi internal koalisi — rasio koneksi dalam koalisi vs total koneksi anggota
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {coalitionStability.map(cs => (
            <div key={cs.coalition} className="bg-bg-elevated rounded-xl p-5 border border-border">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-base font-bold text-text-primary">{cs.coalition}</p>
                  <p className="text-[11px] text-text-muted">{cs.members} anggota · {cs.totalConns} total koneksi</p>
                </div>
                <span className="text-3xl font-black" style={{ color: cs.color }}>{cs.cohesion}%</span>
              </div>
              <ProgressBar value={cs.cohesion} max={100} color={cs.color} height={10} />
              <p className="text-xs mt-2" style={{ color: cs.color }}>{cs.riskLabel}</p>
              <p className="text-[11px] text-text-muted mt-1">
                {cs.internalConns} koneksi internal dari {cs.totalConns} total
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── C: Dark Horse Candidates ── */}
      <div className="bg-bg-card rounded-xl border border-border p-5">
        <h3 className="text-base font-semibold text-text-primary mb-1">C. 🐴 Dark Horse Candidates 2029</h3>
        <p className="text-xs text-text-muted mb-4">
          Tokoh dengan influence &gt; 60, controversy &lt; 3, tier nasional — berpotensi muncul sebagai kandidat yang underrated menjelang 2029
        </p>
        {darkHorses.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-8">Tidak ada kandidat yang memenuhi kriteria dark horse saat ini.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {darkHorses.map((p, i) => (
              <div key={p.id} className="bg-bg-elevated rounded-xl p-4 border border-border hover:border-green-500/30 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-text-primary leading-tight">{p.name}</p>
                    <p className="text-[11px] text-text-muted">{p.positions?.[0]?.title || '—'}</p>
                  </div>
                  <PartyBadge partyId={p.party_id} />
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex-1">
                    <p className="text-[10px] text-text-muted mb-1">Influence</p>
                    <ProgressBar value={p.analysis.influence} max={100} color="#22c55e" />
                    <p className="text-[10px] text-green-400 mt-0.5 font-bold">{p.analysis.influence}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-text-muted mb-1">Kontroversi</p>
                    <ProgressBar value={p.analysis.controversy_level ?? 0} max={10} color="#10b981" />
                    <p className="text-[10px] text-green-400 mt-0.5 font-bold">{p.analysis.controversy_level ?? 0}/10</p>
                  </div>
                </div>
                <p className="text-[11px] text-text-muted mt-2">{p.connCount} koneksi · Skor total {p.total.toFixed(0)}</p>
              </div>
            ))}
          </div>
        )}
        {darkHorses.length === 0 && (
          <div className="mt-4 bg-bg-elevated rounded-lg p-4 border border-border">
            <p className="text-xs text-text-muted">
              💡 <strong className="text-text-primary">Catatan metodologi:</strong> Kriteria dark horse sangat ketat (influence &gt; 60 + kontroversi &lt; 3 + tier nasional).
              Pertimbangkan untuk mengendurkan threshold jika database berkembang.
            </p>
          </div>
        )}
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
        {activeTab === 'individu'           && <TabIndividu          personScores={personScores} />}
        {activeTab === 'partai'             && <TabPartai            partyScores={partyScores} provincesData={provincesData} />}
        {activeTab === 'provinsi'           && <TabProvinsi          provincesData={provincesData} />}
        {activeTab === 'lhkpn'             && <TabLHKPN />}
        {activeTab === 'gdp'               && <TabGDP               provincesData={provincesData} />}
        {activeTab === 'metodologi'        && <TabMetodologi />}
        {activeTab === 'afinitas'          && <TabAfinitasPartai />}
        {activeTab === 'tren_skor'         && <TabTrenSkor />}
        {activeTab === 'prediksi_2029'     && <TabPrediksi2029 />}
        {activeTab === 'korelasi_stat'     && <TabKorelasiStat />}
        {activeTab === 'perbandingan_cepat' && <TabPerbandinganCepat />}
        {activeTab === 'jaringan_pengaruh' && <TabJaringanPengaruh />}
        {activeTab === 'risiko_2029'       && <TabRisiko2029 />}
      </div>
    </div>
  )
}
