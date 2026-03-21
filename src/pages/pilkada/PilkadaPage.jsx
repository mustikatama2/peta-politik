import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  CartesianGrid,
} from 'recharts'
import {
  PILKADA_GUBERNUR_2024,
  PILKADA_STATS_2024,
  getPilkadaCoalitionSummary,
  NOTABLE_RACES,
} from '../../data/pilkada2024'
import { PARTY_MAP } from '../../data/parties'
import { PageHeader, Card, Badge, KPICard } from '../../components/ui'

// ── Party pill cluster ────────────────────────────────────────────────────────
function PartyPills({ coalition = [], max = 4 }) {
  const visible = coalition.slice(0, max)
  const rest = coalition.length - max
  return (
    <div className="flex flex-wrap gap-1">
      {visible.map(pid => {
        const p = PARTY_MAP[pid]
        if (!p) return null
        return (
          <span
            key={pid}
            className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
            style={{ backgroundColor: p.color + '25', color: p.color, border: `1px solid ${p.color}44` }}
          >
            {p.abbr}
          </span>
        )
      })}
      {rest > 0 && (
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-elevated text-text-secondary">
          +{rest}
        </span>
      )}
    </div>
  )
}

// ── Vote bar ─────────────────────────────────────────────────────────────────
function VoteBar({ pct, color }) {
  return (
    <div className="h-1.5 w-full bg-bg-elevated rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  )
}

// ── Province Card ─────────────────────────────────────────────────────────────
function ProvinceCard({ race, expanded, onToggle }) {
  if (!race) return null
  const isKIM = race.coalition_type === 'kim'
  const isPDIP = race.coalition_type === 'pdip'
  const isSpecial = race.no_election

  const borderColor = isKIM ? '#8B0000' : isPDIP ? '#C8102E' : isSpecial ? '#6B7280' : '#6B7280'
  const bgTint = isKIM ? 'rgba(139,0,0,0.06)' : isPDIP ? 'rgba(200,16,46,0.06)' : 'transparent'

  const margin = race.winner.vote_pct && race.runner_up?.vote_pct
    ? (race.winner.vote_pct - race.runner_up.vote_pct).toFixed(1)
    : null

  return (
    <div
      className="bg-bg-card rounded-xl border border-border overflow-hidden cursor-pointer hover:border-white/20 transition-all"
      style={{ borderLeftColor: borderColor, borderLeftWidth: 3, backgroundColor: bgTint || undefined }}
      onClick={onToggle}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">{race.region}</p>
            {race.controversy && (
              <span className="inline-flex items-center gap-1 text-[10px] bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 rounded px-1.5 py-0.5 mt-1">
                ⚡ Kejutan
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {isKIM && <Badge color="#8B0000">KIM+</Badge>}
            {isPDIP && <Badge color="#C8102E">PDIP</Badge>}
            {isSpecial && <Badge color="#6B7280">Istimewa</Badge>}
            <span className="text-text-secondary text-xs">{expanded ? '▲' : '▼'}</span>
          </div>
        </div>

        {/* Special — no election */}
        {isSpecial ? (
          <p className="text-xs text-text-secondary">{race.result}</p>
        ) : (
          <>
            {/* Winner */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-text-secondary">🏆 Pemenang</p>
                {race.winner.vote_pct && (
                  <span className="text-xs font-bold text-green-400">{race.winner.vote_pct}%</span>
                )}
              </div>
              <p className="text-sm font-medium text-text-primary leading-tight">{race.winner.name}</p>
              <div className="mt-1">
                <PartyPills coalition={race.winner.party_coalition} />
              </div>
              {race.winner.vote_pct && (
                <VoteBar pct={race.winner.vote_pct} color={isKIM ? '#8B0000' : '#C8102E'} />
              )}
            </div>

            {/* Runner-up */}
            {race.runner_up && (
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-text-secondary">Runner-up</p>
                  {race.runner_up.vote_pct && (
                    <span className="text-xs text-text-secondary">{race.runner_up.vote_pct}%</span>
                  )}
                </div>
                <p className="text-xs text-text-secondary leading-tight">{race.runner_up.name}</p>
                <div className="mt-1">
                  <PartyPills coalition={race.runner_up.party_coalition} />
                </div>
              </div>
            )}

            {/* Stats row */}
            <div className="flex items-center gap-3 pt-2 border-t border-border/50 text-xs text-text-secondary">
              {margin && (
                <span>Selisih <span className="text-text-primary font-medium">{margin}%</span></span>
              )}
              {race.turnout_pct && (
                <span>Turnout <span className="text-text-primary font-medium">{race.turnout_pct}%</span></span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-border/50 p-4 bg-bg-elevated/50 space-y-2">
          <p className="text-xs font-semibold text-text-primary">{race.result}</p>
          {race.controversy && (
            <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs text-yellow-300">
              ⚡ {race.controversy}
            </div>
          )}
          {race.total_voters && (
            <p className="text-xs text-text-secondary">
              DPT: <span className="text-text-primary">{(race.total_voters / 1_000_000).toFixed(1)} juta pemilih</span>
            </p>
          )}
          {race.third && (
            <p className="text-xs text-text-secondary">
              Calon ke-3: {race.third.name} — {race.third.vote_pct}%
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ── Coalition Bar Chart ───────────────────────────────────────────────────────
function CoalitionChart({ summary, total }) {
  const data = [
    { name: 'KIM Plus', count: summary.kim, color: '#8B0000' },
    { name: 'PDIP', count: summary.pdip, color: '#C8102E' },
    { name: 'Lainnya', count: summary.other, color: '#6B7280' },
  ]

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid stroke="#1F2937" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
        <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} domain={[0, 37]} />
        <Tooltip
          contentStyle={{ backgroundColor: '#1E2235', border: '1px solid #2D3748', borderRadius: 8 }}
          formatter={(v) => [`${v} provinsi`, 'Menang']}
        />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// ── Notable Race Expand ───────────────────────────────────────────────────────
function NotableRaceDetail({ race }) {
  const [open, setOpen] = useState(false)
  if (!race) return null
  const margin = race.winner.vote_pct && race.runner_up?.vote_pct
    ? (race.winner.vote_pct - race.runner_up.vote_pct).toFixed(1)
    : null

  return (
    <Card className="overflow-hidden">
      <button
        className="w-full p-5 text-left hover:bg-bg-elevated/30 transition-colors"
        onClick={() => setOpen(v => !v)}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base font-bold text-text-primary">{race.region}</span>
              {race.controversy && (
                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">⚡ Kejutan</span>
              )}
            </div>
            <p className="text-sm text-text-secondary">{race.result}</p>
          </div>
          <span className="text-text-secondary mt-1">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-border">
          {/* Vote breakdown */}
          <div className="mt-4 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div>
                  <p className="text-sm font-semibold text-text-primary">{race.winner.name}</p>
                  <PartyPills coalition={race.winner.party_coalition} max={8} />
                </div>
                <span className="text-xl font-bold text-green-400">{race.winner.vote_pct}%</span>
              </div>
              <div className="h-3 bg-bg-elevated rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-green-500"
                  style={{ width: `${race.winner.vote_pct}%` }}
                />
              </div>
            </div>

            {race.runner_up && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="text-sm text-text-secondary">{race.runner_up.name}</p>
                    <PartyPills coalition={race.runner_up.party_coalition} max={8} />
                  </div>
                  <span className="text-lg font-bold text-text-secondary">{race.runner_up.vote_pct}%</span>
                </div>
                <div className="h-3 bg-bg-elevated rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-red-700"
                    style={{ width: `${race.runner_up.vote_pct}%` }}
                  />
                </div>
              </div>
            )}

            {race.third && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-text-secondary">{race.third.name}</p>
                  <span className="text-sm text-text-secondary">{race.third.vote_pct}%</span>
                </div>
                <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gray-500"
                    style={{ width: `${race.third.vote_pct}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {margin && (
              <div className="p-3 bg-bg-elevated rounded-lg text-center">
                <p className="text-xs text-text-secondary mb-1">Selisih</p>
                <p className="text-lg font-bold text-text-primary">{margin}%</p>
              </div>
            )}
            {race.turnout_pct && (
              <div className="p-3 bg-bg-elevated rounded-lg text-center">
                <p className="text-xs text-text-secondary mb-1">Turnout</p>
                <p className="text-lg font-bold text-text-primary">{race.turnout_pct}%</p>
              </div>
            )}
            {race.total_voters && (
              <div className="p-3 bg-bg-elevated rounded-lg text-center">
                <p className="text-xs text-text-secondary mb-1">DPT</p>
                <p className="text-lg font-bold text-text-primary">{(race.total_voters / 1_000_000).toFixed(1)}M</p>
              </div>
            )}
          </div>

          {race.controversy && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-300">
              ⚡ {race.controversy}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PilkadaPage() {
  const [expandedCard, setExpandedCard] = useState(null)
  const [filter, setFilter] = useState('all') // all | kim | pdip | controversy

  const summary = getPilkadaCoalitionSummary()
  const totalElections = PILKADA_GUBERNUR_2024.filter(r => !r.no_election).length

  const filtered = PILKADA_GUBERNUR_2024.filter(r => {
    if (filter === 'kim') return r.coalition_type === 'kim'
    if (filter === 'pdip') return r.coalition_type === 'pdip'
    if (filter === 'controversy') return !!r.controversy
    return true
  })

  // Jakarta, Jatim, Jateng as notable
  const notableIds = ['jakarta_2024', 'jatim_2024', 'jateng_2024']
  const notableRaces = notableIds.map(id => PILKADA_GUBERNUR_2024.find(r => r.id === id))

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <PageHeader
        title="🗳️ Pilkada Serentak 2024"
        subtitle="27 November 2024 · 545 daerah · 37 Provinsi + 508 Kabupaten/Kota"
      />

      {/* ── KPI Bar ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <KPICard
          label="Total Daerah"
          value={PILKADA_STATS_2024.total_regions.toLocaleString()}
          sub="provinsi + kab/kota"
          icon="🗺️"
        />
        <KPICard
          label="Gubernur"
          value={PILKADA_STATS_2024.gubernur}
          sub="dari 38 provinsi"
          icon="🏛️"
          color="#8B5CF6"
        />
        <KPICard
          label="Bupati/Walikota"
          value={PILKADA_STATS_2024.bupati_walikota.toLocaleString()}
          sub="kabupaten & kota"
          icon="🏙️"
        />
        <KPICard
          label="Rata-rata Turnout"
          value={`${PILKADA_STATS_2024.turnout_avg}%`}
          sub="partisipasi pemilih"
          icon="📊"
          color="#10B981"
        />
        <KPICard
          label="Kotak Kosong Menang"
          value={PILKADA_STATS_2024.uncontested}
          sub="daerah tak ada lawan"
          icon="⬜"
          color="#F59E0B"
        />
      </div>

      {/* ── Coalition Performance ── */}
      <Card className="p-5">
        <h2 className="text-base font-bold text-text-primary mb-1">📊 Performa Koalisi — Gubernur 2024</h2>
        <p className="text-sm text-text-secondary mb-5">
          KIM Plus menang di <span className="text-red-400 font-semibold">{summary.kim}</span> dari {totalElections} provinsi yang menggelar pilkada.
          PDIP mempertahankan <span className="text-red-600 font-semibold">{summary.pdip}</span> provinsi,
          termasuk kejutan besar di Jakarta.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <CoalitionChart summary={summary} total={totalElections} />

          <div className="space-y-3">
            {[
              { label: 'KIM Plus', count: summary.kim, total: totalElections, color: '#8B0000', desc: 'Koalisi Prabowo' },
              { label: 'PDIP', count: summary.pdip, total: totalElections, color: '#C8102E', desc: 'PDI Perjuangan' },
              { label: 'Koalisi Lain', count: summary.other, total: totalElections, color: '#6B7280', desc: 'Partai Aceh, dll.' },
              { label: 'Tanpa Pilkada', count: summary.special, total: 38, color: '#4B5563', desc: 'DIY Yogyakarta (keistimewaan)' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="text-sm font-medium text-text-primary">{item.label}</span>
                    <span className="text-xs text-text-secondary ml-2">{item.desc}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: item.color }}>
                    {item.count} provinsi
                  </span>
                </div>
                <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(item.count / 38) * 100}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Highlight boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-border">
          <div className="p-3 bg-red-900/10 border border-red-900/20 rounded-lg">
            <p className="text-xs text-text-secondary mb-1">Kejutan Terbesar</p>
            <p className="text-sm font-semibold text-red-400">Jakarta — PDIP Menang</p>
            <p className="text-xs text-text-secondary mt-1">
              Pramono Anung kalahkan Ridwan Kamil yang didukung hampir semua partai KIM Plus
            </p>
          </div>
          <div className="p-3 bg-red-950/20 border border-red-950/30 rounded-lg">
            <p className="text-xs text-text-secondary mb-1">Kandang Banteng Jatuh</p>
            <p className="text-sm font-semibold text-orange-400">Jawa Tengah — KIM Menang</p>
            <p className="text-xs text-text-secondary mt-1">
              Ahmad Luthfi runtuhkan basis terkuat PDIP di Jawa Tengah sejak Reformasi
            </p>
          </div>
          <div className="p-3 bg-purple-900/10 border border-purple-900/20 rounded-lg">
            <p className="text-xs text-text-secondary mb-1">Dinasti Jokowi Meluas</p>
            <p className="text-sm font-semibold text-purple-400">Sumut — Bobby Nasution</p>
            <p className="text-xs text-text-secondary mt-1">
              Menantu Jokowi menang besar 68.5% di Sumatera Utara — memperluas pengaruh keluarga
            </p>
          </div>
        </div>
      </Card>

      {/* ── Notable Races ── */}
      <div>
        <h2 className="text-base font-bold text-text-primary mb-1">⭐ Ras Pilkada Terpenting</h2>
        <p className="text-sm text-text-secondary mb-4">
          Klik untuk melihat breakdown lengkap hasil dan analisis
        </p>
        <div className="space-y-3">
          {notableRaces.map(race => race && (
            <NotableRaceDetail key={race.id} race={race} />
          ))}
        </div>
      </div>

      {/* ── Province Grid ── */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div>
            <h2 className="text-base font-bold text-text-primary">🗺️ Hasil Gubernur per Provinsi</h2>
            <p className="text-sm text-text-secondary">37 provinsi · klik kartu untuk detail</p>
          </div>
          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'kim', label: '🔴 KIM Plus' },
              { id: 'pdip', label: '🐂 PDIP' },
              { id: 'controversy', label: '⚡ Kontroversi' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === f.id
                    ? 'bg-accent-red text-white'
                    : 'bg-bg-elevated text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map(race => (
            <ProvinceCard
              key={race.id}
              race={race}
              expanded={expandedCard === race.id}
              onToggle={() => setExpandedCard(expandedCard === race.id ? null : race.id)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <Card className="p-10 text-center">
            <p className="text-text-secondary">Tidak ada hasil untuk filter ini.</p>
          </Card>
        )}
      </div>

      {/* ── Implications / Analysis ── */}
      <Card className="p-6">
        <h2 className="text-base font-bold text-text-primary mb-4">
          🔮 Implikasi Pilkada 2024 untuk Pilpres 2029
        </h2>

        <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
          <div className="p-4 bg-red-900/10 border-l-2 border-red-700 rounded-r-lg">
            <p className="font-semibold text-text-primary mb-1">🔴 KIM Plus Mendominasi, Tapi Tidak Sempurna</p>
            <p>
              Koalisi KIM Plus menang di {summary.kim} dari {totalElections} provinsi yang menggelar pilkada,
              menunjukkan dominasi koalisi pendukung Prabowo-Gibran di tingkat daerah.
              Namun kekalahan telak di DKI Jakarta — pusat kekuasaan dan media nasional — membuktikan
              bahwa koalisi besar tidak selalu menjamin kemenangan.
            </p>
          </div>

          <div className="p-4 bg-red-950/15 border-l-2 border-red-600 rounded-r-lg">
            <p className="font-semibold text-text-primary mb-1">🐂 PDIP: Kalah Tapi Tidak Habis</p>
            <p>
              PDIP kehilangan Jawa Tengah — kantong suara terpenting yang selama ini menjadi
              basis elektoral partai sejak era Reformasi. Namun PDIP berhasil mempertahankan
              DKI Jakarta, Bali, Papua, dan beberapa provinsi lain.
              Kemenangan di Jakarta membuktikan PDIP masih relevan dan mampu melawan arus.
            </p>
          </div>

          <div className="p-4 bg-blue-900/10 border-l-2 border-blue-700 rounded-r-lg">
            <p className="font-semibold text-text-primary mb-1">🏛️ Gubernur sebagai Modal 2029</p>
            <p>
              Para gubernur yang terpilih hari ini — Bobby Nasution (Sumut), Rudy Mas&apos;ud (Kaltim),
              Ahmad Luthfi (Jateng), Dedi Mulyadi (Jabar) — berpotensi menjadi aktor kunci
              dalam Pilpres 2029. Gubernur dengan basis massa besar di provinsi strategis
              adalah sumber daya politik yang tidak ternilai bagi koalisi mana pun.
            </p>
          </div>

          <div className="p-4 bg-yellow-900/10 border-l-2 border-yellow-600 rounded-r-lg">
            <p className="font-semibold text-text-primary mb-1">⚡ Kotak Kosong: Sinyal Peringatan Demokrasi</p>
            <p>
              Sebanyak {PILKADA_STATS_2024.uncontested} daerah menghadapi situasi kotak kosong —
              hanya ada satu pasang calon — yang beberapa di antaranya kalah dari kolom kosong.
              Ini sinyal bahwa konsolidasi elite politik melalui threshold pencalonan tinggi
              mulai mengikis pilihan riil bagi pemilih.
            </p>
          </div>

          <div className="p-4 bg-purple-900/10 border-l-2 border-purple-600 rounded-r-lg">
            <p className="font-semibold text-text-primary mb-1">👨‍👩‍👧 Dinasti Politik Menguat</p>
            <p>
              Pilkada 2024 memperkuat pola dinasti politik Indonesia. Bobby Nasution (menantu Jokowi)
              menang di Sumut, melanjutkan tren konsolidasi keluarga-keluarga elite di jabatan
              gubernur. Fenomena ini kemungkinan akan menjadi isu sentral dalam perdebatan
              demokrasi Indonesia menjelang 2029.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
