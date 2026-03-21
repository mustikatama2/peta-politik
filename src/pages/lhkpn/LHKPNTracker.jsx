import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid, Legend
} from 'recharts'
import { PERSONS } from '../../data/persons'
import { PARTY_MAP } from '../../data/parties'
import WealthBar from '../../components/WealthBar'
import { PageHeader, Card, KPICard, Select, formatIDR } from '../../components/ui'

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

export default function LHKPNTracker() {
  const [sortBy, setSortBy] = useState('wealth')
  const [filterTier, setFilterTier] = useState('')
  const [filterParty, setFilterParty] = useState('')
  const [filterRisk, setFilterRisk] = useState('')
  const [selectedPersonIds, setSelectedPersonIds] = useState(['prabowo', 'erick_thohir', 'surya_paloh'])

  const partyOptions = [...new Set(personsWithLHKPN.map(p => p.party_id).filter(Boolean))]
    .map(id => ({ value: id, label: PARTY_MAP[id]?.abbr || id }))

  const sortOptions = [
    { value: 'wealth', label: 'Kekayaan Tertinggi' },
    { value: 'name', label: 'Nama A-Z' },
    { value: 'year', label: 'Tahun Laporan' },
  ]

  const filtered = useMemo(() => {
    let result = [...personsWithLHKPN]
    if (filterTier) result = result.filter(p => p.tier === filterTier)
    if (filterParty) result = result.filter(p => p.party_id === filterParty)
    if (filterRisk) result = result.filter(p => p.analysis?.corruption_risk === filterRisk)
    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'year') return (b.lhkpn_year || 0) - (a.lhkpn_year || 0)
      return b.lhkpn_latest - a.lhkpn_latest
    })
    return result
  }, [filterTier, filterParty, filterRisk, sortBy])

  return (
    <div className="space-y-6">
      <PageHeader
        title="💰 Pelacak LHKPN"
        subtitle="Data Kekayaan Penyelenggara Negara"
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

      {/* Filters + Table */}
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
              { value: 'rendah', label: '🟢 Rendah' },
              { value: 'sedang', label: '🟡 Sedang' },
              { value: 'tinggi', label: '🔴 Tinggi' },
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
                <th className="pb-2 text-center hidden lg:table-cell">Tahun</th>
                <th className="pb-2 text-center">Risiko</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p, i) => {
                const party = p.party_id ? PARTY_MAP[p.party_id] : null
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
                    <td className="py-2 text-center hidden lg:table-cell text-xs text-text-secondary">
                      {p.lhkpn_year}
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
      </Card>

      {/* Tren Kekayaan LineChart */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-1">📈 Tren Kekayaan (2019–2023)</h3>
        <p className="text-xs text-text-secondary mb-4">
          Pilih hingga 5 tokoh untuk melihat perubahan kekayaan dari laporan LHKPN
        </p>
        {/* Person picker */}
        <div className="flex flex-wrap gap-2 mb-4">
          {personsWithHistory.map(p => {
            const selected = selectedPersonIds.includes(p.id)
            const idx = selectedPersonIds.indexOf(p.id)
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
    </div>
  )
}
