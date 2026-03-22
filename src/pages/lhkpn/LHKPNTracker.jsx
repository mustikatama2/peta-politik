import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid, Legend,
  ScatterChart, Scatter, ZAxis,
} from 'recharts'
import { PERSONS } from '../../data/persons'
import { PARTY_MAP } from '../../data/parties'
import WealthBar from '../../components/WealthBar'
import { PageHeader, Card, KPICard, Select, formatIDR } from '../../components/ui'
import { exportToCSV } from '../../lib/exportUtils'

const SALARY_MAP = {
  nasional: { label: 'Pejabat Nasional', salary: 1_500_000_000 },
  provinsi:  { label: 'Gubernur/Anggota DPR', salary: 500_000_000 },
  kabupaten: { label: 'Bupati/Walikota', salary: 300_000_000 },
}

const personsWithLHKPN = PERSONS.filter(p => p.lhkpn_latest)
  .sort((a, b) => b.lhkpn_latest - a.lhkpn_latest)

const maxWealth = personsWithLHKPN[0]?.lhkpn_latest || 1
const avgWealth = personsWithLHKPN.length
  ? personsWithLHKPN.reduce((s, p) => s + p.lhkpn_latest, 0) / personsWithLHKPN.length
  : 0

const top10 = personsWithLHKPN.slice(0, 10).map(p => ({
  name: p.name.split(' ').slice(0, 2).join(' '),
  wealth: p.lhkpn_latest,
  fill: PARTY_MAP[p.party_id]?.color || '#6B7280',
}))

// Salary ratio spotlight
const SALARY_SPOTLIGHT = [
  { id: 'prabowo', salary_year: 1_500_000_000 },
  { id: 'gibran', salary_year: 900_000_000 },
  { id: 'airlangga', salary_year: 600_000_000 },
  { id: 'sri_mulyani', salary_year: 600_000_000 },
  { id: 'megawati', salary_year: 300_000_000 },
].map(s => {
  const p = PERSONS.find(x => x.id === s.id)
  if (!p?.lhkpn_latest) return null
  return {
    name: p.name,
    wealth: p.lhkpn_latest,
    salary_year: s.salary_year,
    years: Math.round(p.lhkpn_latest / s.salary_year),
    party_color: PARTY_MAP[p.party_id]?.color || '#6B7280',
  }
}).filter(Boolean)

const personsWithHistory = PERSONS.filter(p => p.lhkpn_history?.length > 0)

// ─── ANALYSIS DATA ──────────────────────────────────────────────────────────

// Wealth distribution brackets (M = miliar = 1e9 IDR)
const BRACKETS = [
  { label: '< 5M',     min: 0,     max: 5e9   },
  { label: '5–20M',    min: 5e9,   max: 20e9  },
  { label: '20–50M',   min: 20e9,  max: 50e9  },
  { label: '50–100M',  min: 50e9,  max: 100e9 },
  { label: '100M–1T',  min: 100e9, max: 1e12  },
  { label: '> 1T',     min: 1e12,  max: Infinity },
]

const bracketData = BRACKETS.map(b => ({
  label: b.label,
  count: personsWithLHKPN.filter(p => p.lhkpn_latest >= b.min && p.lhkpn_latest < b.max).length,
  fill: b.max > 1e12 ? '#f59e0b' : b.max > 100e9 ? '#ef4444' : b.max > 50e9 ? '#f97316' : b.max > 20e9 ? '#eab308' : b.max > 5e9 ? '#22c55e' : '#6B7280',
}))

// Top gainers: sorted by absolute gain (lhkpn_latest - lhkpn_history[0].amount)
const topGainers = personsWithHistory
  .filter(p => p.lhkpn_latest && p.lhkpn_history.length >= 2)
  .map(p => {
    const first = p.lhkpn_history[0].amount
    const last  = p.lhkpn_latest
    const gain  = last - first
    const pct   = ((gain / first) * 100)
    return { id: p.id, name: p.name, party_id: p.party_id, first, last, gain, pct }
  })
  .sort((a, b) => b.gain - a.gain)
  .slice(0, 15)

// Scatter: cabinet ministers — wealth vs months in office
function calcMonthsInOffice(p) {
  const now = new Date()
  const ministerPos = p.positions?.find(pos =>
    pos.is_current && pos.title?.toLowerCase().includes('menteri')
  )
  if (!ministerPos?.start) return null
  const startYear = parseInt(ministerPos.start)
  if (isNaN(startYear)) return null
  const start = new Date(startYear, 0, 1)
  return Math.round((now - start) / (1000 * 60 * 60 * 24 * 30.5))
}

const scatterData = PERSONS
  .filter(p => p.lhkpn_latest && p.positions?.some(pos =>
    pos.is_current && pos.title?.toLowerCase().includes('menteri')
  ))
  .map(p => {
    const months = calcMonthsInOffice(p)
    if (!months) return null
    return {
      x: months,
      y: p.lhkpn_latest,
      name: p.name.split(' ').slice(0, 2).join(' '),
      party_color: PARTY_MAP[p.party_id]?.color || '#6B7280',
    }
  })
  .filter(Boolean)

// Build multi-series LineChart data for up to 5 selected persons
function buildTrendData(personIds) {
  const years = [2019, 2020, 2021, 2022, 2023]
  return years.map(y => {
    const row = { year: y }
    for (const id of personIds) {
      const p = PERSONS.find(x => x.id === id)
      const entry = p?.lhkpn_history?.find(h => h.year === y)
      row[id] = entry?.amount ?? null
    }
    return row
  })
}

const TREND_COLORS = ['#f59e0b', '#ef4444', '#3b82f6', '#22c55e', '#8b5cf6']

// ─── SPARKLINE (CSS divs) ───────────────────────────────────────────────────
function Sparkline({ history }) {
  if (!history || history.length < 2) return null
  const vals = history.map(h => h.amount)
  const max  = Math.max(...vals)
  const min  = Math.min(...vals)
  const range = max - min || 1
  return (
    <div className="flex items-end gap-px h-5 mt-1">
      {vals.map((v, i) => {
        const height = Math.round(((v - min) / range) * 16) + 4
        return (
          <div
            key={i}
            style={{ height, width: 5, backgroundColor: '#f59e0b', borderRadius: 1, opacity: 0.6 + i * 0.08 }}
          />
        )
      })}
    </div>
  )
}

// YoY growth badge
function YoYBadge({ history }) {
  if (!history || history.length < 2) return null
  const last  = history[history.length - 1].amount
  const prev  = history[history.length - 2].amount
  const pct   = ((last - prev) / prev * 100).toFixed(1)
  const pos   = last >= prev
  return (
    <span className={`text-xs px-1 py-0.5 rounded font-mono ${pos ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
      {pos ? '+' : ''}{pct}%
    </span>
  )
}

const TABS = [
  { id: 'tracker',  label: '📋 Daftar LHKPN' },
  { id: 'analisis', label: '📊 Analisis Kekayaan' },
  { id: 'bandingkan', label: '⚖️ Bandingkan' },
]

export default function LHKPNTracker() {
  const [activeTab, setActiveTab]     = useState('tracker')
  const [sortBy, setSortBy]           = useState('wealth')
  const [filterTier, setFilterTier]   = useState('')
  const [filterParty, setFilterParty] = useState('')
  const [filterRisk, setFilterRisk]   = useState('')
  const [selectedPersonIds, setSelectedPersonIds] = useState(['prabowo', 'erick_thohir', 'surya_paloh'])

  // Bandingkan
  const [compareA, setCompareA] = useState('prabowo')
  const [compareB, setCompareB] = useState('erick_thohir')

  const partyOptions = [...new Set(personsWithLHKPN.map(p => p.party_id).filter(Boolean))]
    .map(id => ({ value: id, label: PARTY_MAP[id]?.abbr || id }))

  const sortOptions = [
    { value: 'wealth', label: 'Kekayaan Tertinggi' },
    { value: 'name',   label: 'Nama A-Z' },
    { value: 'year',   label: 'Tahun Laporan' },
  ]

  const filtered = useMemo(() => {
    let result = [...personsWithLHKPN]
    if (filterTier)  result = result.filter(p => p.tier === filterTier)
    if (filterParty) result = result.filter(p => p.party_id === filterParty)
    if (filterRisk)  result = result.filter(p => p.analysis?.corruption_risk === filterRisk)
    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'year') return (b.lhkpn_year || 0) - (a.lhkpn_year || 0)
      return b.lhkpn_latest - a.lhkpn_latest
    })
    return result
  }, [filterTier, filterParty, filterRisk, sortBy])

  // Compare persons
  const pA = PERSONS.find(x => x.id === compareA)
  const pB = PERSONS.find(x => x.id === compareB)
  const compareMax = Math.max(pA?.lhkpn_latest || 0, pB?.lhkpn_latest || 0) || 1
  const compareRatio = pA && pB && pB.lhkpn_latest && pA.lhkpn_latest
    ? (Math.max(pA.lhkpn_latest, pB.lhkpn_latest) / Math.min(pA.lhkpn_latest, pB.lhkpn_latest)).toFixed(1)
    : null

  const personSelectOptions = personsWithLHKPN.map(p => ({
    value: p.id,
    label: p.name.split(' ').slice(0, 3).join(' '),
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="💰 Pelacak LHKPN"
        subtitle="Data Kekayaan Penyelenggara Negara"
        actions={
          <button
            onClick={() => exportToCSV(
              filtered.map(p => {
                const currentPos = p.positions?.find(pos => pos.is_current)
                const party = p.party_id ? PARTY_MAP[p.party_id] : null
                return {
                  nama: p.name,
                  jabatan: currentPos?.title || '—',
                  partai: party?.abbr || '—',
                  kekayaan: p.lhkpn_latest,
                  tahun_lhkpn: p.lhkpn_year || '—',
                  risiko: p.analysis?.corruption_risk || '—',
                }
              }),
              'lhkpn-tracker'
            )}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-text-secondary text-xs hover:bg-bg-elevated transition-colors"
          >
            ⬇️ Export CSV
          </button>
        }
      />

      {/* Disclaimer */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
        <span className="text-amber-400 text-xl">⚠️</span>
        <p className="text-amber-400 text-sm">
          Data bersumber dari deklarasi mandiri di{' '}
          <a href="https://elhkpn.kpk.go.id" target="_blank" rel="noopener noreferrer" className="underline">
            elhkpn.kpk.go.id
          </a>
          . Verifikasi langsung untuk data terkini dan akurat.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Total Dilaporkan" value={personsWithLHKPN.length} sub="Dari database" icon="📄" />
        <KPICard label="Rata-rata" value={formatIDR(avgWealth)} sub="Semua tokoh" icon="📊" />
        <KPICard label="Tertinggi" value={formatIDR(maxWealth)} sub={personsWithLHKPN[0]?.name} icon="🏆" />
        <KPICard label="Tidak Dilaporkan" value={PERSONS.length - personsWithLHKPN.length} sub="Data tidak ada" icon="❌" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-bg-elevated rounded-xl border border-border">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 text-xs py-2 px-3 rounded-lg font-medium transition-all ${
              activeTab === t.id
                ? 'bg-accent-gold text-bg-card'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TAB 1: TRACKER (existing content enhanced)                         */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'tracker' && (
        <>
          {/* Top 10 Bar Chart */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-4">📊 10 Tokoh Terkaya (LHKPN)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={top10} layout="vertical" margin={{ top: 0, right: 80, left: 80, bottom: 0 }}>
                <XAxis
                  type="number"
                  tick={{ fill: '#9CA3AF', fontSize: 10 }}
                  tickFormatter={v => v >= 1e12 ? `${(v/1e12).toFixed(0)}T` : v >= 1e9 ? `${(v/1e9).toFixed(0)}M` : ''}
                />
                <YAxis type="category" dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 11 }} width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E2235', border: '1px solid #2D3748', borderRadius: 8 }}
                  formatter={v => [formatIDR(v), 'Kekayaan']}
                />
                <Bar dataKey="wealth" radius={[0, 4, 4, 0]}>
                  {top10.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Filters + Enhanced Table */}
          <Card className="p-5">
            <div className="flex flex-wrap gap-3 mb-4">
              <Select
                value={filterTier}
                onChange={setFilterTier}
                options={[
                  { value: 'nasional', label: 'Nasional' },
                  { value: 'provinsi', label: 'Provinsi' },
                  { value: 'kabupaten', label: 'Kabupaten' },
                ]}
                placeholder="Semua Tingkat"
                className="min-w-[130px]"
              />
              <Select
                value={filterParty}
                onChange={setFilterParty}
                options={partyOptions}
                placeholder="Semua Partai"
                className="min-w-[130px]"
              />
              <Select
                value={filterRisk}
                onChange={setFilterRisk}
                options={[
                  { value: 'rendah',    label: '🟢 Rendah' },
                  { value: 'sedang',    label: '🟡 Sedang' },
                  { value: 'tinggi',    label: '🔴 Tinggi' },
                  { value: 'tersangka', label: '⛔ Tersangka' },
                ]}
                placeholder="Semua Risiko"
                className="min-w-[130px]"
              />
              <Select
                value={sortBy}
                onChange={setSortBy}
                options={sortOptions}
                placeholder="Urutkan"
                className="min-w-[160px]"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-text-secondary uppercase">
                    <th className="pb-2 text-left w-8">#</th>
                    <th className="pb-2 text-left">Nama</th>
                    <th className="pb-2 text-left hidden md:table-cell">Jabatan</th>
                    <th className="pb-2 text-left hidden sm:table-cell">Partai</th>
                    <th className="pb-2 text-right">Kekayaan</th>
                    <th className="pb-2 text-center hidden lg:table-cell">Tren</th>
                    <th className="pb-2 text-center hidden lg:table-cell">YoY</th>
                    <th className="pb-2 text-center">Risiko</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((p, i) => {
                    const party      = p.party_id ? PARTY_MAP[p.party_id] : null
                    const currentPos = p.positions?.find(pos => pos.is_current)
                    return (
                      <tr key={p.id} className="hover:bg-bg-elevated/50">
                        <td className="py-2 text-text-secondary text-xs">{i + 1}</td>
                        <td className="py-2">
                          <div>
                            <p className="font-medium text-text-primary text-xs">{p.name}</p>
                            <div className="mt-1 hidden sm:block">
                              <WealthBar amount={p.lhkpn_latest} max={maxWealth} />
                            </div>
                          </div>
                        </td>
                        <td className="py-2 hidden md:table-cell">
                          <p className="text-xs text-text-secondary line-clamp-1">
                            {currentPos?.title || '—'}
                          </p>
                        </td>
                        <td className="py-2 hidden sm:table-cell">
                          {party && (
                            <span
                              className="text-xs px-1.5 py-0.5 rounded"
                              style={{ backgroundColor: party.color + '20', color: party.color }}
                            >
                              {party.abbr}
                            </span>
                          )}
                        </td>
                        <td className="py-2 text-right font-medium text-accent-gold text-xs whitespace-nowrap">
                          {formatIDR(p.lhkpn_latest)}
                        </td>
                        <td className="py-2 hidden lg:table-cell">
                          <div className="flex justify-center">
                            <Sparkline history={p.lhkpn_history} />
                          </div>
                        </td>
                        <td className="py-2 hidden lg:table-cell text-center">
                          <YoYBadge history={p.lhkpn_history} />
                        </td>
                        <td className="py-2 text-center">
                          <span className={`text-xs ${
                            ['tersangka','terpidana'].includes(p.analysis?.corruption_risk)
                              ? 'text-red-400' : p.analysis?.corruption_risk === 'tinggi'
                              ? 'text-orange-400' : p.analysis?.corruption_risk === 'sedang'
                              ? 'text-yellow-400' : 'text-green-400'
                          }`}>
                            {p.analysis?.corruption_risk || '—'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer citation */}
            <p className="text-xs text-text-secondary mt-4 pt-3 border-t border-border">
              Sumber: KPK LHKPN 2023 · Data diperbarui dari{' '}
              <a href="https://elhkpn.kpk.go.id" target="_blank" rel="noopener noreferrer" className="underline hover:text-text-primary">
                elhkpn.kpk.go.id
              </a>
              {' '}· Nilai dalam Rupiah
            </p>
          </Card>

          {/* Tren Kekayaan LineChart */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-1">📈 Tren Kekayaan (2019–2023)</h3>
            <p className="text-xs text-text-secondary mb-4">
              Pilih hingga 5 tokoh untuk melihat perubahan kekayaan dari laporan LHKPN
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {personsWithHistory.map(p => {
                const selected = selectedPersonIds.includes(p.id)
                const idx   = selectedPersonIds.indexOf(p.id)
                const color = selected ? TREND_COLORS[idx] : '#4B5563'
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      if (selected) {
                        setSelectedPersonIds(prev => prev.filter(id => id !== p.id))
                      } else if (selectedPersonIds.length < 5) {
                        setSelectedPersonIds(prev => [...prev, p.id])
                      }
                    }}
                    className="px-2 py-1 rounded text-xs border transition-all"
                    style={{
                      borderColor: color,
                      color: selected ? '#fff' : color,
                      backgroundColor: selected ? color + '33' : 'transparent',
                    }}
                  >
                    {p.name.split(' ').slice(0, 2).join(' ')}
                  </button>
                )
              })}
            </div>
            {selectedPersonIds.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={buildTrendData(selectedPersonIds)} margin={{ top: 4, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                  <XAxis dataKey="year" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                  <YAxis
                    tick={{ fill: '#9CA3AF', fontSize: 10 }}
                    tickFormatter={v => v >= 1e12 ? `${(v/1e12).toFixed(1)}T` : v >= 1e9 ? `${(v/1e9).toFixed(0)}M` : ''}
                    width={55}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1E2235', border: '1px solid #2D3748', borderRadius: 8 }}
                    formatter={(v, name) => {
                      const p = PERSONS.find(x => x.id === name)
                      return [formatIDR(v), p?.name || name]
                    }}
                  />
                  <Legend
                    formatter={name => {
                      const p = PERSONS.find(x => x.id === name)
                      return <span style={{ color: '#D1D5DB', fontSize: 11 }}>{p?.name?.split(' ').slice(0,2).join(' ') || name}</span>
                    }}
                  />
                  {selectedPersonIds.map((id, idx) => (
                    <Line
                      key={id}
                      type="monotone"
                      dataKey={id}
                      stroke={TREND_COLORS[idx]}
                      strokeWidth={2}
                      dot={{ r: 4, fill: TREND_COLORS[idx] }}
                      connectNulls
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-text-secondary text-center py-8">Pilih minimal 1 tokoh di atas</p>
            )}
          </Card>

          {/* Wealth vs Salary */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-4">💼 Kekayaan vs Gaji Resmi</h3>
            <p className="text-xs text-text-secondary mb-4">
              Perbandingan LHKPN dengan estimasi gaji resmi per tahun berdasarkan jabatan
            </p>
            <div className="space-y-4">
              {SALARY_SPOTLIGHT.map((s, i) => (
                <div key={i} className="p-3 bg-bg-elevated rounded-lg">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="text-sm font-medium text-text-primary">{s.name}</p>
                    <span className="text-xs text-text-secondary">
                      ~{s.years.toLocaleString('id-ID')} thn gaji
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs text-text-secondary">
                    <span>LHKPN: <span className="text-accent-gold font-medium">{formatIDR(s.wealth)}</span></span>
                    <span>Gaji/thn: <span className="text-text-primary">{formatIDR(s.salary_year)}</span></span>
                  </div>
                  <div className="mt-2 h-1.5 bg-bg-card rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-gold rounded-full"
                      style={{ width: `${Math.min((s.wealth / maxWealth) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TAB 2: ANALISIS KEKAYAAN                                           */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'analisis' && (
        <>
          {/* Wealth Distribution Histogram */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-1">📊 Distribusi Kekayaan</h3>
            <p className="text-xs text-text-secondary mb-4">
              Jumlah tokoh per kelompok kekayaan LHKPN (dalam miliar Rupiah)
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={bracketData} margin={{ top: 4, right: 20, left: 0, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E2235', border: '1px solid #2D3748', borderRadius: 8 }}
                  formatter={v => [`${v} tokoh`, 'Jumlah']}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {bracketData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-text-secondary mt-2 text-center">
              Mayoritas tokoh berada di kelompok 5–20 miliar Rupiah
            </p>
          </Card>

          {/* Kekayaan vs Masa Jabatan Scatter */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-1">⏱️ Kekayaan vs Masa Jabatan Menteri</h3>
            <p className="text-xs text-text-secondary mb-4">
              Apakah kekayaan cenderung lebih tinggi seiring lama menjabat sebagai menteri?
            </p>
            {scatterData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <ScatterChart margin={{ top: 4, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Bulan menjabat"
                    tick={{ fill: '#9CA3AF', fontSize: 10 }}
                    label={{ value: 'Bulan Menjabat', position: 'insideBottom', offset: -10, fill: '#6B7280', fontSize: 10 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Kekayaan"
                    tick={{ fill: '#9CA3AF', fontSize: 10 }}
                    tickFormatter={v => v >= 1e12 ? `${(v/1e12).toFixed(1)}T` : v >= 1e9 ? `${(v/1e9).toFixed(0)}M` : ''}
                    width={55}
                  />
                  <ZAxis range={[40, 40]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1E2235', border: '1px solid #2D3748', borderRadius: 8 }}
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      const d = payload[0].payload
                      return (
                        <div className="bg-bg-card border border-border rounded-lg p-3 text-xs">
                          <p className="font-semibold text-text-primary">{d.name}</p>
                          <p className="text-text-secondary mt-1">Menjabat: {d.x} bulan</p>
                          <p className="text-accent-gold">LHKPN: {formatIDR(d.y)}</p>
                        </div>
                      )
                    }}
                  />
                  <Scatter
                    data={scatterData}
                    fill="#f59e0b"
                    opacity={0.8}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-text-secondary text-center py-8">Data scatter tidak tersedia</p>
            )}
          </Card>

          {/* Top Gainers Table */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-1">🚀 Top Gainers 2019–2024</h3>
            <p className="text-xs text-text-secondary mb-4">
              Tokoh dengan kenaikan kekayaan LHKPN terbesar berdasarkan data historis
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-text-secondary uppercase">
                    <th className="pb-2 text-left w-8">#</th>
                    <th className="pb-2 text-left">Nama</th>
                    <th className="pb-2 text-right">2019</th>
                    <th className="pb-2 text-right">Terbaru</th>
                    <th className="pb-2 text-right">Kenaikan</th>
                    <th className="pb-2 text-right">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {topGainers.map((g, i) => {
                    const party = g.party_id ? PARTY_MAP[g.party_id] : null
                    return (
                      <tr key={g.id} className="hover:bg-bg-elevated/50">
                        <td className="py-2 text-text-secondary text-xs">{i + 1}</td>
                        <td className="py-2">
                          <p className="font-medium text-text-primary text-xs">{g.name}</p>
                          {party && (
                            <span
                              className="text-xs px-1 py-0.5 rounded"
                              style={{ backgroundColor: party.color + '20', color: party.color }}
                            >
                              {party.abbr}
                            </span>
                          )}
                        </td>
                        <td className="py-2 text-right text-xs text-text-secondary whitespace-nowrap">
                          {formatIDR(g.first)}
                        </td>
                        <td className="py-2 text-right text-xs text-accent-gold font-medium whitespace-nowrap">
                          {formatIDR(g.last)}
                        </td>
                        <td className="py-2 text-right text-xs text-green-400 font-medium whitespace-nowrap">
                          +{formatIDR(g.gain)}
                        </td>
                        <td className="py-2 text-right">
                          <span className="text-xs px-1.5 py-0.5 rounded bg-green-900/30 text-green-400 font-mono">
                            +{g.pct.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-text-secondary mt-3 pt-3 border-t border-border">
              Sumber: KPK LHKPN · Data historis 2019–2023 · Perhitungan dari laporan LHKPN tahunan
            </p>
          </Card>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TAB 3: BANDINGKAN KEKAYAAN                                         */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'bandingkan' && (
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-1">⚖️ Bandingkan Kekayaan</h3>
          <p className="text-xs text-text-secondary mb-5">
            Pilih dua tokoh untuk membandingkan kekayaan LHKPN mereka secara langsung
          </p>

          {/* Selectors */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-xs text-text-secondary mb-1">Tokoh A</p>
              <Select
                value={compareA}
                onChange={setCompareA}
                options={personSelectOptions}
                placeholder="Pilih tokoh..."
                className="w-full"
              />
            </div>
            <div>
              <p className="text-xs text-text-secondary mb-1">Tokoh B</p>
              <Select
                value={compareB}
                onChange={setCompareB}
                options={personSelectOptions}
                placeholder="Pilih tokoh..."
                className="w-full"
              />
            </div>
          </div>

          {/* Comparison display */}
          {pA && pB && (
            <div className="space-y-5">
              {/* Ratio badge */}
              {compareRatio && (
                <div className="text-center py-3 bg-bg-elevated rounded-xl">
                  <p className="text-2xl font-bold text-accent-gold">{compareRatio}×</p>
                  <p className="text-xs text-text-secondary mt-1">
                    {pA.lhkpn_latest > pB.lhkpn_latest ? pA.name : pB.name} lipat lebih kaya
                  </p>
                </div>
              )}

              {/* Side-by-side bars */}
              {[pA, pB].map((p, idx) => {
                const party = p.party_id ? PARTY_MAP[p.party_id] : null
                const barPct = Math.min((p.lhkpn_latest / compareMax) * 100, 100)
                const color  = idx === 0 ? '#f59e0b' : '#3b82f6'
                return (
                  <div key={p.id} className="p-4 bg-bg-elevated rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{p.name}</p>
                        {party && (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded mt-0.5 inline-block"
                            style={{ backgroundColor: party.color + '20', color: party.color }}
                          >
                            {party.abbr}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-base font-bold" style={{ color }}>
                          {formatIDR(p.lhkpn_latest)}
                        </p>
                        <p className="text-xs text-text-secondary">LHKPN {p.lhkpn_year}</p>
                      </div>
                    </div>
                    <div className="h-3 bg-bg-card rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${barPct}%`, backgroundColor: color }}
                      />
                    </div>
                    {/* Mini sparkline */}
                    {p.lhkpn_history?.length > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-text-secondary">Tren:</span>
                        <Sparkline history={p.lhkpn_history} />
                        <YoYBadge history={p.lhkpn_history} />
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Link to full compare */}
              <div className="text-center pt-2">
                <a
                  href={`/compare?a=${compareA}&b=${compareB}`}
                  className="text-xs text-accent-gold hover:underline"
                >
                  Lihat perbandingan lengkap →
                </a>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
