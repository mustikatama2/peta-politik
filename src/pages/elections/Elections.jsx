import { useSearchParams } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  CartesianGrid, LineChart, Line, Legend, ReferenceLine,
} from 'recharts'
import { PILPRES_HISTORY, PILEG_HISTORY, PILEG_2024, PILKADA_JATIM_2024 } from '../../data/elections'
import * as ElectionsData from '../../data/elections'
import { PARTY_MAP } from '../../data/parties'
import { PageHeader, Tabs, Card, Badge } from '../../components/ui'

// Safe fallback for PILKADA_2024 (may not exist yet if data agent hasn't committed)
const PILKADA_2024 = ElectionsData.PILKADA_2024 || []

const ALL_TABS = [
  { id: 'pilpres',    label: '🗳️ Pilpres' },
  { id: 'sejarah',   label: '📜 Sejarah Pilpres' },
  { id: 'pileg',     label: '🏛️ Pileg DPR' },
  { id: 'trenpileg', label: '📊 Tren Pileg' },
  { id: 'statistik', label: '🔢 Statistik' },
  { id: 'pilkada',   label: '🗺️ Pilkada Jatim' },
  { id: 'pilkada2024', label: '🌏 Pilkada 2024' },
]

// ── Pilpres bar chart data ────────────────────────────────────────────────
const pilpresBarData = [...PILPRES_HISTORY]
  .sort((a, b) => a.year - b.year)
  .map(p => ({
    year: p.year,
    winner_pct: p.pct,
    runnerup_pct: p.runnerup_pct,
    winner: p.winner,
    runnerup: p.runnerup,
  }))

// ── "Evolusi Suara" — candidate vote % across years ───────────────────────
const evolusiData = [
  { year: 2004, SBY: 60.62, Megawati: 39.38 },
  { year: 2009, SBY: 60.80, Megawati: 26.79, JK: 12.41 },
  { year: 2014, Jokowi: 53.15, Prabowo: 46.85 },
  { year: 2019, Jokowi: 55.50, Prabowo: 44.50 },
  { year: 2024, Prabowo: 58.59, Anies: 24.95, Ganjar: 16.47 },
]

const CANDIDATE_COLORS = {
  SBY:      '#3B82F6',
  Megawati: '#EF4444',
  JK:       '#F59E0B',
  Jokowi:   '#10B981',
  Prabowo:  '#8B0000',
  Anies:    '#27AAE1',
  Ganjar:   '#7C3AED',
}

// ── Pileg 2024 bar chart ──────────────────────────────────────────────────
const pillegBarData = [...PILEG_2024]
  .filter(d => d.seats > 0)
  .sort((a, b) => b.seats - a.seats)
  .map(d => ({
    name: PARTY_MAP[d.party_id]?.abbr || d.party_id,
    seats: d.seats,
    votes: d.votes_pct,
    fill: PARTY_MAP[d.party_id]?.color || '#6B7280',
  }))

const SEATS_2019 = {
  pdip: 128, gol: 85, ger: 78, pkb: 58, nas: 59, pks: 50, dem: 54, pan: 44
}

// ── Tren Pileg — grouped bar chart data ───────────────────────────────────
const TOP_PARTIES = ['PDIP', 'Golkar', 'Gerindra', 'PKB', 'NasDem', 'PKS', 'Demokrat', 'PAN']
const PARTY_COLORS_TREND = {
  PDIP:      '#C8102E',
  Golkar:    '#F5C518',
  Gerindra:  '#8B0000',
  PKB:       '#00A651',
  NasDem:    '#27AAE1',
  PKS:       '#F97316',
  Demokrat:  '#3B82F6',
  PAN:       '#F59E0B',
}

// Transform PILEG_HISTORY → { party, y2009, y2014, y2019, y2024 }
const pilegTrendData = TOP_PARTIES.map(partyName => {
  const row = { party: partyName }
  for (const yearData of PILEG_HISTORY) {
    const found = yearData.results.find(r => r.party === partyName)
    row[`y${yearData.year}`] = found?.seats || 0
  }
  return row
})

// Peta Perubahan 2019→2024
const perubahanData = TOP_PARTIES.map(partyName => {
  const r2024 = PILEG_HISTORY.find(h => h.year === 2024)?.results.find(r => r.party === partyName)?.seats || 0
  const r2019 = PILEG_HISTORY.find(h => h.year === 2019)?.results.find(r => r.party === partyName)?.seats || 0
  return { party: partyName, change: r2024 - r2019, y2024: r2024, y2019: r2019 }
}).sort((a, b) => b.change - a.change)

// ── Statistik Pemilu ──────────────────────────────────────────────────────
const turnoutData = [
  { year: 2004, turnout: 76.6 },
  { year: 2009, turnout: 70.9 },
  { year: 2014, turnout: 75.1 },
  { year: 2019, turnout: 81.9 },
  { year: 2024, turnout: 81.8 },
]

const STATS_CARDS = [
  { label: 'Pilpres Langsung Pertama', value: '2004', note: 'Sebelumnya dipilih MPR', icon: '🏛️' },
  { label: 'Paling Kompetitif', value: '2014', note: 'Margin hanya 6.3% (Jokowi vs Prabowo)', icon: '⚔️' },
  { label: 'Landslide Terbesar', value: '2009', note: 'SBY unggul 34.01% atas runner-up', icon: '🌊' },
  { label: 'Turnout Tertinggi', value: '81.9%', note: 'Pilpres 2019 — antusiasme tinggi', icon: '📈' },
  { label: 'Turnout Terendah', value: '70.9%', note: 'Pilpres 2009 — apatisme pemilih', icon: '📉' },
  { label: 'Kemenangan Prabowo 2024', value: '+33.6%', note: 'Margin atas Anies (58.59% vs 24.95%)', icon: '🏆' },
]

// ── Jatim history ─────────────────────────────────────────────────────────
const JATIM_HISTORY = [
  { year: 2024, winner: 'Khofifah Indar Parawansa', party: 'PKB/Koalisi', pct: 59.8 },
  { year: 2019, winner: 'Khofifah Indar Parawansa', party: 'PKB', pct: 52.9 },
  { year: 2014, winner: 'Soekarwo', party: 'Demokrat', pct: 47.3 },
  { year: 2009, winner: 'Soekarwo', party: 'Demokrat', pct: 50.2 },
  { year: 2004, winner: 'Imam Utomo', party: 'Golkar', pct: 62.7 },
]

// ── Pilkada party summary ─────────────────────────────────────────────────
function buildPartySummary(data) {
  const counts = {}
  data.forEach(prov => {
    const pid = prov.winner_party_id
    if (pid) counts[pid] = (counts[pid] || 0) + 1
  })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([pid, count]) => ({ pid, count, party: PARTY_MAP[pid] }))
}

// ── Initials helper ───────────────────────────────────────────────────────
function initials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('')
}

export default function Elections() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'pilpres'
  const setActiveTab = (tab) => setSearchParams({ tab }, { replace: true })

  const partySummary = buildPartySummary(PILKADA_2024)
  const totalPilkada = PILKADA_2024.length

  return (
    <div className="space-y-6">
      <PageHeader title="📊 Data Pemilihan" subtitle="Pilpres · Pileg DPR · Sejarah · Statistik · Pilkada" />

      <Tabs tabs={ALL_TABS} active={activeTab} onChange={setActiveTab} />

      {/* ═══════════════════════════════════════════════════════════════════
          TAB: PILPRES 2024
      ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'pilpres' && (
        <div className="space-y-5">
          <Card className="p-5 border-l-4" style={{ borderLeftColor: '#8B0000' }}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-text-primary">🏆 Pilpres 2024</h2>
                <p className="text-text-secondary text-sm mt-1">
                  Prabowo Subianto menang putaran pertama dengan 58.59% suara — kemenangan telak pertama sejak era Reformasi
                </p>
              </div>
              <Badge variant="status-selesai" className="text-sm px-3 py-1">Selesai</Badge>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { name: 'Prabowo-Gibran', pct: 58.59, color: '#8B0000' },
                { name: 'Anies-Muhaimin', pct: 24.95, color: '#27AAE1' },
                { name: 'Ganjar-Mahfud',  pct: 16.47, color: '#C8102E' },
              ].map(p => (
                <div key={p.name} className="text-center">
                  <p className="text-2xl font-bold" style={{ color: p.color }}>{p.pct}%</p>
                  <p className="text-xs text-text-secondary mt-1">{p.name}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-4">📈 Tren Pilpres 2004–2024</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={pilpresBarData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid stroke="#1F2937" vertical={false} />
                <XAxis dataKey="year" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#9CA3AF', fontSize: 11 }} tickFormatter={v => `${v}%`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E2235', border: '1px solid #2D3748', borderRadius: 8 }}
                  formatter={(v, name) => [`${v}%`, name === 'winner_pct' ? 'Pemenang' : 'Runner-up']}
                />
                <Bar dataKey="winner_pct" name="Pemenang" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="runnerup_pct" name="Runner-up" fill="#6B7280" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="space-y-3">
            {PILPRES_HISTORY.map(p => (
              <Card key={p.year} className={`p-4 ${p.year === 2024 ? 'border-yellow-500/40' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-text-secondary bg-bg-elevated px-2 py-0.5 rounded">{p.year}</span>
                      {p.year === 2024 && <Badge variant="status-selesai">Terkini</Badge>}
                    </div>
                    <p className="text-sm font-semibold text-text-primary">🏆 {p.winner}</p>
                    <p className="text-xs text-text-secondary">vs {p.runnerup}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-400">{p.pct}%</p>
                    <p className="text-xs text-text-secondary">{p.runnerup_pct}%</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB: SEJARAH PILPRES 2004-2024
      ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'sejarah' && (
        <div className="space-y-6">
          {/* Timeline Cards */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">🗓️ Timeline Pilpres 2004–2024</h3>
            <div className="space-y-3">
              {[...PILPRES_HISTORY].sort((a, b) => a.year - b.year).map((p, idx) => {
                const margin = (p.pct - p.runnerup_pct).toFixed(2)
                return (
                  <div key={p.year} className="relative">
                    {/* Connector line */}
                    {idx < PILPRES_HISTORY.length - 1 && (
                      <div className="absolute left-5 top-full w-px h-3 bg-border z-10" />
                    )}
                    <Card className="p-4 border-l-4" style={{ borderLeftColor: PARTY_COLORS_TREND.Golkar }}>
                      <div className="flex items-start gap-4">
                        {/* Year badge */}
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center border border-border">
                          <span className="text-xs font-bold text-text-primary">{String(p.year).slice(2)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-text-primary">{p.year}</span>
                            {p.round === 2 && <Badge variant="status-selesai">Putaran 2</Badge>}
                            {p.turnout_pct && (
                              <span className="text-xs text-text-secondary">Partisipasi: {p.turnout_pct}%</span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-4 mb-2">
                            {/* Winner */}
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-xs font-bold text-green-400">
                                {initials(p.winner)}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-green-400">{p.winner}</p>
                                <p className="text-lg font-bold text-green-400">{p.pct}%</p>
                              </div>
                            </div>
                            {/* vs */}
                            <div className="flex items-center text-text-secondary text-xs font-medium self-center">vs</div>
                            {/* Runner-up */}
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-xs font-bold text-red-400">
                                {initials(p.runnerup)}
                              </div>
                              <div>
                                <p className="text-sm text-text-secondary">{p.runnerup}</p>
                                <p className="text-base font-semibold text-red-400">{p.runnerup_pct}%</p>
                              </div>
                            </div>
                            {/* Third if exists */}
                            {p.third && (
                              <>
                                <div className="flex items-center text-text-secondary text-xs self-center">·</div>
                                <div>
                                  <p className="text-xs text-text-secondary">{p.third}</p>
                                  <p className="text-sm text-text-secondary">{p.third_pct}%</p>
                                </div>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs px-2 py-0.5 bg-yellow-500/10 text-yellow-400 rounded border border-yellow-500/20">
                              Margin: +{margin}%
                            </span>
                            {p.significance && (
                              <p className="text-xs text-text-secondary italic">{p.significance}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Evolusi Suara Line Chart */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-1">📈 Evolusi Suara per Kandidat 2004–2024</h3>
            <p className="text-xs text-text-secondary mb-4">
              Perjalanan Prabowo: <span className="text-red-400 font-semibold">46.85%</span> (2014) →{' '}
              <span className="text-red-400 font-semibold">44.50%</span> (2019) →{' '}
              <span className="text-green-400 font-bold">58.59%</span> (2024) 🏆
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={evolusiData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid stroke="#1F2937" strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <YAxis domain={[0, 75]} tick={{ fill: '#9CA3AF', fontSize: 11 }} tickFormatter={v => `${v}%`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E2235', border: '1px solid #2D3748', borderRadius: 8 }}
                  formatter={(v) => v ? [`${v}%`] : [null]}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: '#9CA3AF' }} />
                {Object.entries(CANDIDATE_COLORS).map(([name, color]) => (
                  <Line
                    key={name}
                    type="monotone"
                    dataKey={name}
                    stroke={color}
                    strokeWidth={name === 'Prabowo' ? 3 : 1.5}
                    dot={{ r: 4, fill: color }}
                    connectNulls={false}
                    name={name}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB: PILEG 2024
      ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'pileg' && (
        <div className="space-y-5">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-4">🏛️ Kursi DPR Pemilu 2024</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={pillegBarData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid stroke="#1F2937" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E2235', border: '1px solid #2D3748', borderRadius: 8 }}
                  formatter={(v) => [v, 'Kursi']}
                />
                <Bar dataKey="seats" name="Kursi" radius={[4, 4, 0, 0]}>
                  {pillegBarData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Tabel Hasil Pileg 2024</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-text-secondary uppercase">
                    <th className="pb-2 text-left">Partai</th>
                    <th className="pb-2 text-right">Suara %</th>
                    <th className="pb-2 text-right">Kursi 2024</th>
                    <th className="pb-2 text-right">Kursi 2019</th>
                    <th className="pb-2 text-right">Perubahan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[...PILEG_2024].sort((a, b) => b.votes_pct - a.votes_pct).map(d => {
                    const party = PARTY_MAP[d.party_id]
                    const prev = SEATS_2019[d.party_id] || 0
                    const change = d.seats - prev
                    return (
                      <tr key={d.party_id} className="hover:bg-bg-elevated/50">
                        <td className="py-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: party?.color }} />
                            <span>{party?.abbr || d.party_id}</span>
                          </div>
                        </td>
                        <td className="py-2 text-right text-text-secondary">{d.votes_pct}%</td>
                        <td className="py-2 text-right font-medium">{d.seats || '—'}</td>
                        <td className="py-2 text-right text-text-secondary">{prev || '—'}</td>
                        <td className="py-2 text-right">
                          {d.seats > 0 && prev > 0 ? (
                            <span className={change > 0 ? 'text-green-400' : change < 0 ? 'text-red-400' : 'text-text-secondary'}>
                              {change > 0 ? '+' : ''}{change}
                            </span>
                          ) : <span className="text-text-secondary">—</span>}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-400">
              ⚠️ PPP: Pertama kali tidak lolos ambang batas 4% sejak 1973. PSI, Hanura, Perindo juga tidak mendapat kursi.
            </div>
          </Card>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB: TREN PILEG 2009-2024
      ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'trenpileg' && (
        <div className="space-y-6">
          {/* Grouped Bar Chart */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-1">📊 Perolehan Kursi DPR 2009–2024</h3>
            <p className="text-xs text-text-secondary mb-4">
              Demokrat: <span className="text-blue-400 font-semibold">150 → 61 → 54 → 44</span> (kolaps) ·
              PDIP: <span className="text-red-400 font-semibold">95 → 109 → 128 → 94</span> (naik-turun) ·
              Golkar: <span className="text-yellow-400 font-semibold">107 → 91 → 85 → 102</span> (rebound)
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pilegTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid stroke="#1F2937" vertical={false} />
                <XAxis dataKey="party" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} label={{ value: 'Kursi', angle: -90, position: 'insideLeft', fill: '#6B7280', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E2235', border: '1px solid #2D3748', borderRadius: 8 }}
                  formatter={(v, name) => [v + ' kursi', name]}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: '#9CA3AF' }} />
                <Bar dataKey="y2009" name="2009" fill="#6B7280" radius={[2, 2, 0, 0]} />
                <Bar dataKey="y2014" name="2014" fill="#60A5FA" radius={[2, 2, 0, 0]} />
                <Bar dataKey="y2019" name="2019" fill="#34D399" radius={[2, 2, 0, 0]} />
                <Bar dataKey="y2024" name="2024" fill="#F59E0B" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Peta Perubahan 2019→2024 */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-1">🔀 Peta Perubahan Kursi 2019 → 2024</h3>
            <p className="text-xs text-text-secondary mb-4">Siapa yang menang dan kalah kursi dalam satu siklus pemilu?</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={perubahanData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid stroke="#1F2937" vertical={false} />
                <XAxis dataKey="party" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} tickFormatter={v => (v > 0 ? `+${v}` : `${v}`)} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E2235', border: '1px solid #2D3748', borderRadius: 8 }}
                  formatter={(v) => [`${v > 0 ? '+' : ''}${v} kursi`, 'Perubahan']}
                />
                <ReferenceLine y={0} stroke="#4B5563" />
                <Bar dataKey="change" name="Perubahan" radius={[4, 4, 0, 0]}>
                  {perubahanData.map((entry, i) => (
                    <Cell key={i} fill={entry.change >= 0 ? '#10B981' : '#EF4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Change list */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {perubahanData.map(d => (
                <div key={d.party} className="p-2 bg-bg-elevated rounded-lg text-center">
                  <p className="text-xs text-text-secondary">{d.party}</p>
                  <p className={`text-base font-bold ${d.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {d.change > 0 ? '+' : ''}{d.change}
                  </p>
                  <p className="text-xs text-text-secondary">{d.y2019} → {d.y2024}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* 2009 Anno note */}
          <Card className="p-4 bg-blue-500/5 border border-blue-500/20">
            <p className="text-xs text-blue-300">
              💡 <strong>2009:</strong> Demokrat meledak ke 150 kursi (20.85% suara) — efek kharisma SBY.
              Lima belas tahun kemudian di 2024, tersisa 44 kursi. Pelajaran: dominasi satu tokoh tidak langgeng.
            </p>
          </Card>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB: STATISTIK PEMILU
      ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'statistik' && (
        <div className="space-y-6">
          {/* Turnout chart */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-4">📊 Tren Partisipasi Pemilih (Turnout) 2004–2024</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={turnoutData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid stroke="#1F2937" vertical={false} />
                <XAxis dataKey="year" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <YAxis domain={[60, 90]} tick={{ fill: '#9CA3AF', fontSize: 11 }} tickFormatter={v => `${v}%`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E2235', border: '1px solid #2D3748', borderRadius: 8 }}
                  formatter={(v) => [`${v}%`, 'Turnout']}
                />
                <Bar dataKey="turnout" name="Turnout" radius={[4, 4, 0, 0]}>
                  {turnoutData.map((entry, i) => (
                    <Cell key={i} fill={entry.turnout >= 80 ? '#10B981' : entry.turnout < 72 ? '#EF4444' : '#60A5FA'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-text-secondary mt-2 text-center">
              Hijau ≥ 80% · Biru 72-80% · Merah &lt; 72%
            </p>
          </Card>

          {/* Stats cards grid */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">🔢 Fakta & Rekor Pemilu</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {STATS_CARDS.map((s, i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{s.icon}</span>
                    <div>
                      <p className="text-xs text-text-secondary mb-0.5">{s.label}</p>
                      <p className="text-xl font-bold text-text-primary">{s.value}</p>
                      <p className="text-xs text-text-secondary mt-1">{s.note}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Margin table */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-3">📐 Margin Kemenangan per Pilpres</h3>
            <div className="space-y-2">
              {[...PILPRES_HISTORY].sort((a, b) => a.year - b.year).map(p => {
                const margin = p.pct - p.runnerup_pct
                const maxMargin = 35
                return (
                  <div key={p.year} className="flex items-center gap-3">
                    <span className="text-xs text-text-secondary w-10 flex-shrink-0">{p.year}</span>
                    <div className="flex-1 h-5 bg-bg-elevated rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full flex items-center justify-end pr-2"
                        style={{
                          width: `${Math.min((margin / maxMargin) * 100, 100)}%`,
                          backgroundColor: margin < 10 ? '#EF4444' : margin < 20 ? '#F59E0B' : '#10B981',
                        }}
                      >
                        <span className="text-xs font-bold text-white">{margin.toFixed(1)}%</span>
                      </div>
                    </div>
                    <span className="text-xs text-text-secondary w-24 flex-shrink-0 truncate">{p.winner.split(' ').slice(-1)[0]}</span>
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-text-secondary mt-3">
              Merah = &lt;10% margin · Kuning = 10-20% · Hijau = &gt;20%
            </p>
          </Card>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB: PILKADA JATIM
      ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'pilkada' && (
        <div className="space-y-5">
          <Card className="p-5 border-l-4 border-l-green-500">
            <h2 className="text-sm font-semibold text-green-400 mb-3">🏆 Pilkada Jatim 2024</h2>
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-xl font-bold text-text-primary">Khofifah-Emil Dardak</p>
                <p className="text-3xl font-bold text-green-400 mt-1">{PILKADA_JATIM_2024.pct_winner}%</p>
                <p className="text-xs text-text-secondary mt-1">Pemenang · {PILKADA_JATIM_2024.date}</p>
              </div>
              <div className="text-text-secondary">
                <p className="text-sm">vs {PILKADA_JATIM_2024.runnerup}</p>
                <p className="text-xl font-bold">{PILKADA_JATIM_2024.pct_runnerup}%</p>
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-3">
              DPT: ~{(PILKADA_JATIM_2024.voters / 1_000_000).toFixed(1)} juta pemilih
            </p>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-4">📜 Riwayat Gubernur Jatim</h3>
            <div className="space-y-3">
              {JATIM_HISTORY.map(h => (
                <div key={h.year} className="flex items-center justify-between p-3 bg-bg-elevated rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-secondary bg-bg-card px-2 py-0.5 rounded">{h.year}</span>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{h.winner}</p>
                      <p className="text-xs text-text-secondary">{h.party}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-text-primary">{h.pct}%</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8 text-center">
            <div className="text-5xl mb-3">🗺️</div>
            <p className="text-text-secondary text-sm">
              Peta interaktif Jawa Timur tersedia di halaman{' '}
              <a href="/regions" className="text-accent-blue hover:underline">Peta Wilayah</a>
            </p>
          </Card>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB: PILKADA 2024 NASIONAL
      ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'pilkada2024' && (
        <div className="space-y-5">
          {/* Banner */}
          <Card className="p-5 border-l-4" style={{ borderLeftColor: '#8B5CF6' }}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-text-primary">🌏 Pilkada Serentak 2024</h2>
                <p className="text-text-secondary text-sm mt-1">
                  27 November 2024 — 37 provinsi + 508 kabupaten/kota
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  Pilkada terbesar dalam sejarah Indonesia — gubernur, bupati, dan walikota dipilih serentak.
                </p>
              </div>
              <Badge variant="status-selesai" className="text-sm px-3 py-1">Selesai</Badge>
            </div>
          </Card>

          {/* Party Summary Bar */}
          {partySummary.length > 0 ? (
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-3">📊 Perolehan Partai — Gubernur Terpilih</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {partySummary.map(({ pid, count, party }) => (
                  <div
                    key={pid}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border"
                    style={{
                      borderColor: (party?.color || '#6B7280') + '60',
                      backgroundColor: (party?.color || '#6B7280') + '15',
                      color: party?.color || '#9CA3AF'
                    }}
                  >
                    <span>{party?.logo_emoji || '🏛️'}</span>
                    <span>{party?.abbr || pid}</span>
                    <span className="font-bold">{count} provinsi</span>
                  </div>
                ))}
              </div>

              {/* Koalisi count */}
              {(() => {
                const KIM_IDS = ['ger','gol','dem','pan','pkb','nas','per','han','psi','pbb','pkn','bur','gel','gar','umm']
                const kimCount = partySummary.filter(s => KIM_IDS.includes(s.pid)).reduce((sum, s) => sum + s.count, 0)
                const pdipCount = partySummary.find(s => s.pid === 'pdip')?.count || 0
                return (
                  <div className="p-3 bg-bg-elevated rounded-lg text-sm">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-text-secondary text-xs">Koalisi Prabowo (KIM Plus)</p>
                        <p className="text-lg font-bold text-blue-400">{kimCount} dari {totalPilkada} provinsi</p>
                      </div>
                      <div className="flex-1 h-3 bg-bg-card rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(kimCount / Math.max(totalPilkada, 1)) * 100}%` }} />
                      </div>
                      <div className="text-right">
                        <p className="text-text-secondary text-xs">PDI-P</p>
                        <p className="text-lg font-bold text-red-400">{pdipCount} provinsi</p>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </Card>
          ) : (
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-2">📊 Perolehan Partai</h3>
              <p className="text-sm text-text-secondary">Data hasil partai belum tersedia — data agent sedang menyiapkan.</p>
            </Card>
          )}

          {/* Province Results Grid */}
          {PILKADA_2024.length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-3">Hasil per Provinsi</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {PILKADA_2024.map((prov, i) => {
                  const winnerParty = PARTY_MAP[prov.winner_party_id]
                  const marginPct = prov.winner_pct && prov.runnerup_pct
                    ? (prov.winner_pct - prov.runnerup_pct).toFixed(1)
                    : null

                  return (
                    <div
                      key={prov.province_id || i}
                      className="bg-bg-card border border-border rounded-xl p-4"
                      style={winnerParty ? { borderLeftColor: winnerParty.color, borderLeftWidth: 3 } : {}}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm font-semibold text-text-primary">{prov.province_name || prov.name}</p>
                        {winnerParty && (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0"
                            style={{ backgroundColor: winnerParty.color + '20', color: winnerParty.color }}
                          >
                            {winnerParty.abbr}
                          </span>
                        )}
                      </div>

                      {/* Winner */}
                      <div className="mb-2">
                        <p className="text-xs text-text-secondary">🏆 Pemenang</p>
                        <p className="text-sm font-medium text-text-primary">{prov.winner_name}</p>
                        {prov.winner_pct && (
                          <p className="text-xs font-bold" style={{ color: winnerParty?.color || '#10B981' }}>
                            {prov.winner_pct}%
                          </p>
                        )}
                      </div>

                      {/* Runner-up */}
                      {prov.runnerup_name && (
                        <div className="mb-2">
                          <p className="text-xs text-text-secondary">Runner-up: {prov.runnerup_name}</p>
                          {prov.runnerup_pct && <p className="text-xs text-text-secondary">{prov.runnerup_pct}%</p>}
                        </div>
                      )}

                      {/* Margin */}
                      {marginPct && (
                        <div className="pt-2 border-t border-border/50">
                          <p className="text-xs text-text-secondary">
                            Selisih: <span className="text-green-400 font-medium">{marginPct}%</span>
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <Card className="p-10 text-center">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-base font-semibold text-text-primary mb-2">Data Segera Hadir</h3>
              <p className="text-sm text-text-secondary">
                Hasil Pilkada 2024 per provinsi sedang disiapkan oleh data agent.
              </p>
              <p className="text-xs text-text-secondary mt-2">
                Pilkada Serentak 27 November 2024 · 37 provinsi · 508 kab/kota
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
