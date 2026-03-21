import { useSearchParams } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  CartesianGrid
} from 'recharts'
import { PILPRES_HISTORY, PILEG_2024, PILKADA_JATIM_2024 } from '../../data/elections'
import * as ElectionsData from '../../data/elections'
import { PARTY_MAP } from '../../data/parties'
import { PageHeader, Tabs, Card, Badge } from '../../components/ui'

// Safe fallback for PILKADA_2024 (may not exist yet if data agent hasn't committed)
const PILKADA_2024 = ElectionsData.PILKADA_2024 || []

const PILPRES_TABS = [
  { id: 'pilpres',  label: '🗳️ Pilpres' },
  { id: 'pileg',   label: '🏛️ Pileg DPR' },
  { id: 'pilkada', label: '🗺️ Pilkada Jatim' },
  { id: 'pilkada2024', label: '🌏 Pilkada 2024' },
]

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

const pilpresBarData = PILPRES_HISTORY.map(p => ({
  year: p.year,
  winner_pct: p.pct,
  runnerup_pct: p.runnerup_pct,
  winner: p.winner,
  runnerup: p.runnerup,
}))

const JATIM_HISTORY = [
  { year: 2024, winner: 'Khofifah Indar Parawansa', party: 'PKB/Koalisi', pct: 59.8 },
  { year: 2019, winner: 'Khofifah Indar Parawansa', party: 'PKB', pct: 52.9 },
  { year: 2014, winner: 'Soekarwo', party: 'Demokrat', pct: 47.3 },
  { year: 2009, winner: 'Soekarwo', party: 'Demokrat', pct: 50.2 },
  { year: 2004, winner: 'Imam Utomo', party: 'Golkar', pct: 62.7 },
]

// Build party summary from PILKADA_2024 results
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

export default function Elections() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'pilpres'
  const setActiveTab = (tab) => setSearchParams({ tab }, { replace: true })

  const partySummary = buildPartySummary(PILKADA_2024)
  const totalPilkada = PILKADA_2024.length

  return (
    <div className="space-y-6">
      <PageHeader title="📊 Data Pemilihan" subtitle="Pilpres · Pileg DPR · Pilkada Jatim · Pilkada 2024" />

      <Tabs tabs={PILPRES_TABS} active={activeTab} onChange={setActiveTab} />

      {/* PILPRES */}
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

      {/* PILEG */}
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

      {/* PILKADA JATIM */}
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

      {/* PILKADA 2024 — Nasional */}
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
