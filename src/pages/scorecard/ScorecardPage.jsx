import { useMemo, useState } from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import {
  PROVINCE_SCORECARD,
  SCORECARD_WEIGHTS,
  DIMENSION_LABELS,
  REGIONS,
  calculateScores,
} from '../../data/scorecard'

// ── Helpers ────────────────────────────────────────────────────

function scoreBadge(score) {
  if (score >= 75) return 'bg-green-900/40 text-green-400 border border-green-700/30'
  if (score >= 50) return 'bg-yellow-900/40 text-yellow-400 border border-yellow-700/30'
  return 'bg-red-900/40 text-red-400 border border-red-700/30'
}

function scoreColor(score) {
  if (score >= 75) return '#22c55e'
  if (score >= 50) return '#eab308'
  return '#ef4444'
}

function formatApbd(val) {
  if (!val) return '—'
  const t = val / 1_000_000_000_000
  return `Rp ${t.toFixed(1)}T`
}

const PARTY_COLORS = {
  PDIP: '#dc2626',
  Golkar: '#f59e0b',
  Gerindra: '#1d4ed8',
  PKB: '#16a34a',
  Nasdem: '#0ea5e9',
  PKS: '#7c3aed',
  Demokrat: '#0891b2',
  PPP: '#65a30d',
  'Partai Aceh': '#78716c',
  Independen: '#6b7280',
}

function partyColor(party) {
  return PARTY_COLORS[party] || '#6b7280'
}

const MEDAL = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣']

// ── Sub-components ─────────────────────────────────────────────

function ScoreBadge({ score }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${scoreBadge(score)}`}>
      {score}
    </span>
  )
}

function PartyBadgeSmall({ party }) {
  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold text-white"
      style={{ backgroundColor: partyColor(party) + 'cc' }}
    >
      {party}
    </span>
  )
}

function ProvinceRadar({ province }) {
  const dimensions = Object.keys(SCORECARD_WEIGHTS)
  const data = dimensions.map(key => ({
    label: DIMENSION_LABELS[key] || key,
    value: province.scores[key] ?? 50,
    fullMark: 100,
  }))

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius={80}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis dataKey="label" tick={{ fill: '#9ca3af', fontSize: 11 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name={province.name}
            dataKey="value"
            stroke="#f87171"
            fill="#f87171"
            fillOpacity={0.25}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

function TopBottomPodium({ ranked }) {
  const top5 = ranked.slice(0, 5)
  const bottom5 = [...ranked].slice(-5).reverse()

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {/* Top 5 */}
      <div>
        <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          ✅ Terbaik — Top 5
        </h3>
        <div className="space-y-2">
          {top5.map((p, i) => (
            <div
              key={p.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-green-900/10 border border-green-700/20 hover:border-green-500/40 transition-colors"
            >
              <span className="text-xl w-7 flex-shrink-0 text-center">{MEDAL[i]}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-semibold text-sm truncate">{p.name}</span>
                  <PartyBadgeSmall party={p.party} />
                </div>
                <p className="text-xs text-text-muted truncate">{p.governor}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-2xl font-bold text-green-400">{p.total_score}</div>
                <div className="text-[10px] text-text-muted">/ 100</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom 5 */}
      <div>
        <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          ⚠️ Perlu Perhatian — Bottom 5
        </h3>
        <div className="space-y-2">
          {bottom5.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-red-900/10 border border-red-700/20 hover:border-red-500/40 transition-colors"
            >
              <span className="text-xl w-7 text-center flex-shrink-0 font-bold text-red-500">
                #{p.rank}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-semibold text-sm truncate">{p.name}</span>
                  <PartyBadgeSmall party={p.party} />
                </div>
                <p className="text-xs text-text-muted truncate">{p.governor}</p>
                {p.controversy && (
                  <p className="text-[10px] text-red-400 mt-0.5 truncate">⚠️ {p.controversy}</p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-2xl font-bold text-red-400">{p.total_score}</div>
                <div className="text-[10px] text-text-muted">/ 100</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const SORT_COLS = [
  { key: 'rank',             label: 'Rank' },
  { key: 'name',             label: 'Provinsi' },
  { key: 'total_score',      label: 'Skor' },
  { key: 'ipm',              label: 'IPM' },
  { key: 'corruption_risk',  label: 'Korupsi' },
  { key: 'transparency',     label: 'Transparansi' },
  { key: 'apbd_2024',        label: 'APBD' },
]

function FullTable({ ranked }) {
  const [sortKey, setSortKey] = useState('rank')
  const [sortAsc, setSortAsc] = useState(true)
  const [query, setQuery] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  function handleSort(key) {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(key === 'rank' || key === 'name') }
  }

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    const data = q
      ? ranked.filter(p => p.name.toLowerCase().includes(q) || p.party.toLowerCase().includes(q) || p.governor.toLowerCase().includes(q))
      : ranked

    return [...data].sort((a, b) => {
      let av, bv
      if (['ipm', 'corruption_risk', 'transparency'].includes(sortKey)) {
        av = a.scores[sortKey] ?? 0
        bv = b.scores[sortKey] ?? 0
      } else if (sortKey === 'name') {
        av = a.name; bv = b.name
        return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av)
      } else {
        av = a[sortKey] ?? 0
        bv = b[sortKey] ?? 0
      }
      return sortAsc ? av - bv : bv - av
    })
  }, [ranked, query, sortKey, sortAsc])

  function SortIcon({ col }) {
    if (sortKey !== col) return <span className="opacity-20 ml-1">↕</span>
    return <span className="ml-1">{sortAsc ? '↑' : '↓'}</span>
  }

  return (
    <div>
      {/* Search */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Cari provinsi, gubernur, atau partai..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-bg-elevated border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>
        {query && (
          <span className="text-xs text-text-muted">{filtered.length} hasil</span>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg-elevated border-b border-border">
              {SORT_COLS.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-3 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider cursor-pointer hover:text-text-primary select-none whitespace-nowrap"
                >
                  {col.label}<SortIcon col={col.key} />
                </th>
              ))}
              <th className="px-3 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider whitespace-nowrap">Gubernur</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider whitespace-nowrap">Partai</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map(p => (
              <>
                <tr
                  key={p.id}
                  onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                  className="hover:bg-bg-hover cursor-pointer transition-colors group"
                >
                  <td className="px-3 py-3 text-text-muted font-mono">#{p.rank}</td>
                  <td className="px-3 py-3 font-semibold text-text-primary whitespace-nowrap">
                    {p.name}
                    {p.notable && (
                      <p className="text-[10px] font-normal text-text-muted truncate max-w-[180px]">{p.notable}</p>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <ScoreBadge score={p.total_score} />
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-xs font-mono ${p.scores.ipm >= 75 ? 'text-green-400' : p.scores.ipm >= 65 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {p.scores.ipm.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <ScoreBadge score={p.scores.corruption_risk} />
                  </td>
                  <td className="px-3 py-3">
                    <ScoreBadge score={p.scores.transparency} />
                  </td>
                  <td className="px-3 py-3 text-xs text-text-muted whitespace-nowrap">{formatApbd(p.apbd_2024)}</td>
                  <td className="px-3 py-3 text-xs text-text-secondary whitespace-nowrap">{p.governor}</td>
                  <td className="px-3 py-3">
                    <PartyBadgeSmall party={p.party} />
                  </td>
                </tr>
                {expandedId === p.id && (
                  <tr key={`${p.id}-expand`} className="bg-bg-elevated/50">
                    <td colSpan={9} className="px-4 py-4">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Radar */}
                        <div>
                          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                            Profil 6 Dimensi — {p.name}
                          </h4>
                          <ProvinceRadar province={p} />
                        </div>
                        {/* Detail */}
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            {Object.keys(SCORECARD_WEIGHTS).map(k => (
                              <div key={k} className="flex items-center justify-between bg-bg-card rounded-lg px-3 py-2">
                                <span className="text-xs text-text-muted">{DIMENSION_LABELS[k]}</span>
                                <ScoreBadge score={p.scores[k] ?? 50} />
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-bg-card rounded-lg px-3 py-2">
                              <span className="text-text-muted block">APBD 2024</span>
                              <span className="font-semibold text-text-primary">{formatApbd(p.apbd_2024)}</span>
                            </div>
                            <div className="bg-bg-card rounded-lg px-3 py-2">
                              <span className="text-text-muted block">Rasio Utang</span>
                              <span className="font-semibold text-text-primary">{p.debt_ratio}%</span>
                            </div>
                            <div className="bg-bg-card rounded-lg px-3 py-2">
                              <span className="text-text-muted block">Wilayah</span>
                              <span className="font-semibold text-text-primary">{p.region}</span>
                            </div>
                            <div className="bg-bg-card rounded-lg px-3 py-2">
                              <span className="text-text-muted block">IPM BPS 2023</span>
                              <span className="font-semibold text-text-primary">{p.scores.ipm.toFixed(2)}</span>
                            </div>
                          </div>
                          {p.controversy && (
                            <div className="bg-red-900/20 border border-red-700/30 rounded-lg px-3 py-2">
                              <span className="text-xs font-semibold text-red-400">⚠️ Kontroversi: </span>
                              <span className="text-xs text-red-300">{p.controversy}</span>
                            </div>
                          )}
                          {p.notable && (
                            <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg px-3 py-2">
                              <span className="text-xs font-semibold text-blue-400">ℹ️ Catatan: </span>
                              <span className="text-xs text-blue-300">{p.notable}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-text-muted text-sm">
            Tidak ada hasil untuk "{query}"
          </div>
        )}
      </div>
    </div>
  )
}

function PartyPerformance({ ranked }) {
  const partyData = useMemo(() => {
    const map = {}
    ranked.forEach(p => {
      if (!map[p.party]) map[p.party] = { scores: [], count: 0 }
      map[p.party].scores.push(p.total_score)
      map[p.party].count++
    })
    return Object.entries(map)
      .map(([party, d]) => ({
        party,
        avg: Math.round(d.scores.reduce((a, b) => a + b, 0) / d.scores.length),
        count: d.count,
      }))
      .sort((a, b) => b.avg - a.avg)
  }, [ranked])

  const best = partyData[0]
  const worst = partyData[partyData.length - 1]

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return (
      <div className="bg-bg-card border border-border rounded-lg p-3 shadow-xl text-xs">
        <p className="font-semibold text-white mb-1">{d.party}</p>
        <p className="text-text-muted">Rata-rata skor: <span className="text-white font-bold">{d.avg}</span></p>
        <p className="text-text-muted">{d.count} provinsi</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-5">
        {best && (
          <div className="bg-green-900/20 border border-green-700/30 rounded-xl px-4 py-3 text-sm">
            <span className="text-text-muted">Partai terbaik: </span>
            <span className="font-bold text-green-400">{best.party}</span>
            <span className="text-text-muted"> — rata-rata skor </span>
            <span className="font-bold text-green-300">{best.avg}</span>
          </div>
        )}
        {worst && (
          <div className="bg-red-900/20 border border-red-700/30 rounded-xl px-4 py-3 text-sm">
            <span className="text-text-muted">Perlu dorong lebih: </span>
            <span className="font-bold text-red-400">{worst.party}</span>
            <span className="text-text-muted"> — rata-rata skor </span>
            <span className="font-bold text-red-300">{worst.avg}</span>
          </div>
        )}
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={partyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <XAxis
              dataKey="party"
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="avg" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {partyData.map((entry, i) => (
                <Cell key={i} fill={partyColor(entry.party)} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {partyData.map(d => (
          <div key={d.party} className="bg-bg-elevated rounded-lg px-3 py-2 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-text-primary">{d.party}</p>
              <p className="text-[10px] text-text-muted">{d.count} provinsi</p>
            </div>
            <span className={`text-lg font-bold ${d.avg >= 70 ? 'text-green-400' : d.avg >= 55 ? 'text-yellow-400' : 'text-red-400'}`}>
              {d.avg}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function RegionalComparison({ ranked }) {
  const regionData = useMemo(() => {
    const map = {}
    REGIONS.forEach(r => { map[r] = { scores: [], provinces: [] } })
    ranked.forEach(p => {
      if (map[p.region]) {
        map[p.region].scores.push(p.total_score)
        map[p.region].provinces.push(p)
      }
    })
    return REGIONS.map(region => ({
      region,
      avg: map[region].scores.length
        ? Math.round(map[region].scores.reduce((a, b) => a + b, 0) / map[region].scores.length)
        : 0,
      count: map[region].scores.length,
      best: map[region].provinces.sort((a, b) => b.total_score - a.total_score)[0],
    }))
  }, [ranked])

  const REGION_COLORS = {
    'Jawa-Bali': '#3b82f6',
    'Sumatera': '#22c55e',
    'Kalimantan': '#f59e0b',
    'Sulawesi': '#a855f7',
    'Maluku-Papua': '#ef4444',
  }

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return (
      <div className="bg-bg-card border border-border rounded-lg p-3 shadow-xl text-xs">
        <p className="font-semibold text-white mb-1">{d.region}</p>
        <p className="text-text-muted">Rata-rata skor: <span className="text-white font-bold">{d.avg}</span></p>
        <p className="text-text-muted">{d.count} provinsi</p>
        {d.best && <p className="text-text-muted">Terbaik: <span className="text-green-400">{d.best.name}</span></p>}
      </div>
    )
  }

  return (
    <div>
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={regionData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <XAxis dataKey="region" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="avg" radius={[6, 6, 0, 0]} maxBarSize={64}>
              {regionData.map((entry, i) => (
                <Cell key={i} fill={REGION_COLORS[entry.region] || '#6b7280'} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {regionData.map(d => (
          <div
            key={d.region}
            className="bg-bg-elevated rounded-xl p-4 border border-border"
            style={{ borderLeftColor: REGION_COLORS[d.region], borderLeftWidth: 3 }}
          >
            <p className="text-xs font-semibold text-text-secondary mb-1">{d.region}</p>
            <p className="text-3xl font-bold mb-1" style={{ color: REGION_COLORS[d.region] }}>{d.avg}</p>
            <p className="text-[10px] text-text-muted">{d.count} provinsi</p>
            {d.best && (
              <p className="text-[10px] text-text-muted mt-2">
                Terbaik: <span className="text-text-secondary">{d.best.name}</span>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────

export default function ScorecardPage() {
  const ranked = useMemo(() => calculateScores(PROVINCE_SCORECARD), [])

  const avgScore = Math.round(ranked.reduce((s, p) => s + p.total_score, 0) / ranked.length)
  const above70 = ranked.filter(p => p.total_score >= 70).length
  const below50 = ranked.filter(p => p.total_score < 50).length

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* ── Header ── */}
      <div className="bg-gradient-to-br from-bg-card to-bg-elevated rounded-2xl p-6 border border-border">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              🏆 Rapor Tata Kelola Provinsi 2024
            </h1>
            <p className="text-text-muted text-sm max-w-2xl">
              Penilaian tata kelola 38 provinsi Indonesia berdasarkan 6 dimensi: IPM (BPS 2023),
              risiko korupsi, realisasi PAD, infrastruktur, transparansi LPPD, dan inovasi layanan publik.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-3 py-1 rounded-full bg-blue-900/30 text-blue-300 text-xs border border-blue-700/30">
                📊 Sumber: BPS · DJPK Kemenkeu · KPK · Kemendagri
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-900/30 text-purple-300 text-xs border border-purple-700/30">
                📅 Data: 2023–2024
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 flex-shrink-0">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{ranked.length}</div>
              <div className="text-xs text-text-muted">Provinsi</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{avgScore}</div>
              <div className="text-xs text-text-muted">Rata-rata</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{above70}</div>
              <div className="text-xs text-text-muted">Skor ≥70</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">{below50}</div>
              <div className="text-xs text-text-muted">Skor &lt;50</div>
            </div>
          </div>
        </div>

        {/* Methodology pill */}
        <details className="mt-4 group">
          <summary className="text-xs text-text-muted cursor-pointer hover:text-text-secondary select-none">
            📐 Metodologi Penilaian ▾
          </summary>
          <div className="mt-2 bg-bg-app rounded-xl p-4 text-xs text-text-muted border border-border">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(SCORECARD_WEIGHTS).map(([k, w]) => (
                <div key={k} className="flex items-center justify-between bg-bg-elevated rounded-lg px-3 py-2">
                  <span>{DIMENSION_LABELS[k]}</span>
                  <span className="font-semibold text-text-primary">{(w * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-text-muted">
              Skor korupsi bersifat <strong className="text-text-secondary">inverse</strong> — semakin tinggi skor, semakin rendah risiko korupsi (seperti CPI).
              IPM diambil langsung dari skala 0–100 BPS. Semua dimensi dinormalisasi 0–100.
            </p>
          </div>
        </details>
      </div>

      {/* ── Section 1: Top 5 / Bottom 5 ── */}
      <section>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-red-500 rounded-full inline-block" />
          Podium Terbaik & Terburuk
        </h2>
        <TopBottomPodium ranked={ranked} />
      </section>

      {/* ── Section 2: Full Table ── */}
      <section>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-red-500 rounded-full inline-block" />
          Tabel Lengkap — 38 Provinsi
        </h2>
        <p className="text-xs text-text-muted mb-4">
          Klik baris untuk melihat profil radar 6 dimensi • Klik kolom untuk urut
        </p>
        <FullTable ranked={ranked} />
      </section>

      {/* ── Section 3: Party Performance ── */}
      <section>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-red-500 rounded-full inline-block" />
          Performa per Partai
        </h2>
        <div className="bg-bg-card rounded-2xl p-6 border border-border">
          <PartyPerformance ranked={ranked} />
        </div>
      </section>

      {/* ── Section 4: Regional ── */}
      <section>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-red-500 rounded-full inline-block" />
          Perbandingan Regional
        </h2>
        <div className="bg-bg-card rounded-2xl p-6 border border-border">
          <RegionalComparison ranked={ranked} />
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <div className="text-xs text-text-muted text-center pb-4">
        Data bersifat estimasi berdasarkan sumber publik. Skor korupsi bukan penilaian hukum — hanya indikasi risiko berbasis laporan audit, temuan BPK, dan indeks KPK.
      </div>

    </div>
  )
}
