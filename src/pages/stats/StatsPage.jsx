import { Link } from 'react-router-dom'
import { PERSONS } from '../../data/persons'
import { PARTIES, PARTY_MAP } from '../../data/parties'
import { CONNECTIONS } from '../../data/connections'
import { KPK_CASES } from '../../data/kpk_cases'
import { AGENDAS } from '../../data/agendas'
import { TIMELINE_EVENTS } from '../../data/timeline_events'
import { Card } from '../../components/ui'
import MetaTags from '../../components/MetaTags'

// ── Precompute all stats ──────────────────────────────────────────────────

const total = PERSONS.length

// Coverage
const nasionalPersons  = PERSONS.filter(p => !p.region_id || p.region_id === 'nasional' || p.tier === 1 || p.tier === 2).length
const regionalPersons  = PERSONS.filter(p => p.region_id && p.region_id !== 'nasional' && !['soekarno','soeharto','habibie','wahid','megawati','sby'].includes(p.id)).length
const historisPersons  = PERSONS.filter(p => ['soekarno','soeharto','habibie','wahid','megawati','sby','sumitro','ali_moertopo'].includes(p.id)).length

// Strongest connection (highest strength)
const strongestConn    = [...CONNECTIONS].sort((a, b) => (b.strength || 0) - (a.strength || 0))[0]
const strongestLabel   = strongestConn
  ? `${PERSONS.find(p => p.id === strongestConn.from)?.name?.split(' ')[0] || strongestConn.from} ↔ ${PERSONS.find(p => p.id === strongestConn.to)?.name?.split(' ')[0] || strongestConn.to}`
  : '-'

const partiesWithSeats = PARTIES.filter(p => p.seats_2024 > 0).length
const totalKursi       = PARTIES.reduce((sum, p) => sum + (p.seats_2024 || 0), 0)

// KPK losses
const totalLossesIdr   = KPK_CASES.reduce((sum, c) => sum + (c.losses_idr || 0), 0)
const totalLossesT     = (totalLossesIdr / 1_000_000_000_000).toFixed(2)

// Data quality
const withPhoto        = PERSONS.filter(p => p.photo_url).length
const withAnalysis     = PERSONS.filter(p => p.analysis).length
const withLhkpn        = PERSONS.filter(p => p.lhkpn_latest).length
// Connections have no year field, so 0
const connWithYear     = 0

const pct = (n, d) => d ? Math.round((n / d) * 100) : 0

// Top 5 most connected persons
function buildConnectionCounts() {
  const counts = {}
  CONNECTIONS.forEach(c => {
    if (c.from) counts[c.from] = (counts[c.from] || 0) + 1
    if (c.to)   counts[c.to]   = (counts[c.to]   || 0) + 1
  })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => ({ person: PERSONS.find(p => p.id === id), id, count }))
    .filter(x => x.person)
}

const top5Connected = buildConnectionCounts()

// Top 5 parties by connections (count connections where from/to person belongs to party)
function buildPartyConnectionCounts() {
  const counts = {}
  CONNECTIONS.forEach(c => {
    const pFrom = PERSONS.find(p => p.id === c.from)
    const pTo   = PERSONS.find(p => p.id === c.to)
    if (pFrom?.party_id) counts[pFrom.party_id] = (counts[pFrom.party_id] || 0) + 1
    if (pTo?.party_id)   counts[pTo.party_id]   = (counts[pTo.party_id]   || 0) + 1
  })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([pid, count]) => ({ party: PARTY_MAP[pid], pid, count }))
    .filter(x => x.party)
}

const top5Parties = buildPartyConnectionCounts()

// Most "controversial" persons: corruption_risk = tersangka | terpidana | tinggi
const controversial = PERSONS
  .filter(p => ['tersangka', 'terpidana', 'tinggi'].includes(p.analysis?.corruption_risk))
  .slice(0, 5)

// ── Components ──────────────────────────────────────────────────────────────

function StatCard({ value, label, sub, color = '#3B82F6', to }) {
  const content = (
    <div className="bg-bg-card border border-border rounded-xl p-4 hover:border-border/80 transition-colors">
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      <p className="text-xs font-medium text-text-primary mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-text-muted mt-0.5">{sub}</p>}
    </div>
  )
  return to ? <Link to={to}>{content}</Link> : content
}

function ProgressBar({ value, total: tot, label, color = '#3B82F6' }) {
  const n = PERSONS.filter(value).length
  const p = pct(n, tot || PERSONS.length)
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-text-primary">{label}</span>
        <span className="text-sm font-bold text-text-primary">{n}<span className="text-text-muted font-normal"> / {tot || PERSONS.length}</span> <span className="text-xs text-text-secondary">({p}%)</span></span>
      </div>
      <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${p}%`, background: color }}
        />
      </div>
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function StatsPage() {
  return (
    <div className="space-y-8 pb-8">
      <MetaTags title="Statistik Database" description="Statistik lengkap database politik Indonesia — cakupan data, kualitas, dan analitik mendalam." />

      {/* Header */}
      <div className="bg-gradient-to-r from-bg-card to-bg-elevated border border-border rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
              📈 Statistik Database
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              Cakupan, kualitas, dan analitik data politik Indonesia
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-text-muted">
            <span>📅 Diperbarui: Maret 2025</span>
            <Link to="/tentang" className="text-accent-blue hover:underline">Metodologi →</Link>
          </div>
        </div>
      </div>

      {/* ── Section 1: Coverage Stats ──────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-bold text-text-primary mb-4 flex items-center gap-2">
          🗂️ Cakupan Data
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <StatCard value={total} label="Total Tokoh" sub="Dipetakan" color="#3B82F6" to="/persons" />
          <StatCard value={nasionalPersons} label="Tokoh Nasional" sub="Level pusat" color="#6366F1" to="/persons" />
          <StatCard value={regionalPersons} label="Tokoh Regional" sub="Gubernur, Bupati, dll" color="#8B5CF6" to="/persons" />
          <StatCard value={historisPersons} label="Tokoh Historis" sub="Era Soekarno–SBY" color="#A78BFA" to="/persons" />

          <StatCard value={CONNECTIONS.length} label="Total Koneksi" sub={`Terkuat: ${strongestLabel}`} color="#10B981" to="/network" />
          <StatCard value={PARTIES.length} label="Total Partai" sub="Peserta Pemilu 2024" color="#F59E0B" to="/parties" />
          <StatCard value={partiesWithSeats} label="Partai di DPR" sub="Lolos ambang batas 4%" color="#FBBF24" to="/parties" />
          <StatCard value={`${totalKursi}`} label="Total Kursi DPR" sub="DPR RI 2024–2029" color="#EAB308" to="/elections" />

          <StatCard value={KPK_CASES.length} label="Kasus KPK" sub="Tersangka & Terpidana" color="#EF4444" to="/kpk" />
          <StatCard value={`Rp ${totalLossesT}T`} label="Kerugian Negara" sub="Dari kasus KPK" color="#DC2626" to="/kpk" />
          <StatCard value={AGENDAS.length} label="Agenda Tracked" sub="Janji & Program" color="#F97316" to="/agendas" />
          <StatCard value={TIMELINE_EVENTS.length} label="Peristiwa Timeline" sub="Sejak 1998" color="#14B8A6" to="/timeline" />
        </div>
      </section>

      {/* ── Section 2: Data Quality ────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-bold text-text-primary mb-4 flex items-center gap-2">
          🔬 Kualitas Data
        </h2>
        <Card className="p-5">
          <div className="space-y-4">
            <ProgressBar
              label="Tokoh dengan foto profil"
              value={p => p.photo_url}
              color="#3B82F6"
            />
            <ProgressBar
              label="Tokoh dengan analisis lengkap"
              value={p => p.analysis}
              color="#10B981"
            />
            <ProgressBar
              label="Tokoh dengan data LHKPN"
              value={p => p.lhkpn_latest}
              color="#F59E0B"
            />
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-text-primary">Koneksi dengan data tahun</span>
                <span className="text-sm font-bold text-text-primary">
                  {connWithYear}
                  <span className="text-text-muted font-normal"> / {CONNECTIONS.length}</span>
                  <span className="text-xs text-text-secondary"> (0%)</span>
                </span>
              </div>
              <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: '0%', background: '#6B7280' }} />
              </div>
              <p className="text-[10px] text-text-muted mt-1">Data tahun koneksi belum tersedia — akan ditambahkan pada iterasi data berikutnya</p>
            </div>
          </div>

          {/* Summary chips */}
          <div className="mt-5 pt-4 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Kelengkapan foto',    value: `${pct(withPhoto, total)}%`,    color: '#3B82F6' },
              { label: 'Kelengkapan analisis',value: `${pct(withAnalysis, total)}%`, color: '#10B981' },
              { label: 'Kelengkapan LHKPN',  value: `${pct(withLhkpn, total)}%`,   color: '#F59E0B' },
              { label: 'Skor kualitas rata2', value: `${Math.round((pct(withPhoto, total) + pct(withAnalysis, total) + pct(withLhkpn, total)) / 3)}%`, color: '#8B5CF6' },
            ].map(s => (
              <div key={s.label} className="text-center p-3 bg-bg-elevated rounded-xl border border-border">
                <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[10px] text-text-muted mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* ── Section 3: Top Lists ───────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-bold text-text-primary mb-4 flex items-center gap-2">
          🏆 Daftar Teratas
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Top 5 most connected */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-3">🕸️ Paling Terhubung</h3>
            <div className="space-y-2">
              {top5Connected.map(({ person, id, count }, i) => {
                const party = PARTY_MAP[person.party_id]
                return (
                  <Link
                    key={id}
                    to={`/persons/${id}`}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-bg-elevated transition-colors group"
                  >
                    <span className="w-5 text-center text-xs font-bold text-text-muted">#{i+1}</span>
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: party?.color || '#374151' }}
                    >
                      {person.photo_placeholder || person.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-text-primary group-hover:text-accent-red truncate">{person.name}</p>
                    </div>
                    <span className="text-xs font-bold text-accent-blue flex-shrink-0">{count} koneksi</span>
                  </Link>
                )
              })}
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <Link to="/network" className="text-xs text-accent-blue hover:underline">Lihat jaringan lengkap →</Link>
            </div>
          </Card>

          {/* Top 5 parties by connections */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-3">🎭 Partai Paling Aktif</h3>
            <div className="space-y-2">
              {top5Parties.map(({ party, pid, count }, i) => (
                <Link
                  key={pid}
                  to={`/parties/${pid}`}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-bg-elevated transition-colors group"
                >
                  <span className="w-5 text-center text-xs font-bold text-text-muted">#{i+1}</span>
                  <span className="text-lg">{party.logo_emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium group-hover:text-accent-red" style={{ color: party.color }}>{party.abbr}</p>
                    <p className="text-[10px] text-text-muted truncate">{party.name}</p>
                  </div>
                  <span className="text-xs font-bold text-text-secondary flex-shrink-0">{count}</span>
                </Link>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <Link to="/parties" className="text-xs text-accent-blue hover:underline">Lihat semua partai →</Link>
            </div>
          </Card>

          {/* Most controversial */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-3">⚠️ Berisiko Tinggi</h3>
            <div className="space-y-2">
              {controversial.map((person, i) => {
                const party = PARTY_MAP[person.party_id]
                const risk  = person.analysis?.corruption_risk
                const riskColor = risk === 'terpidana' ? '#DC2626' : risk === 'tersangka' ? '#F59E0B' : '#EF4444'
                return (
                  <Link
                    key={person.id}
                    to={`/persons/${person.id}`}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-bg-elevated transition-colors group"
                  >
                    <span className="w-5 text-center text-xs font-bold text-text-muted">#{i+1}</span>
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: party?.color || '#374151' }}
                    >
                      {person.photo_placeholder || person.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-text-primary group-hover:text-accent-red truncate">{person.name}</p>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 capitalize"
                      style={{ background: riskColor + '20', color: riskColor }}>
                      {risk}
                    </span>
                  </Link>
                )
              })}
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <Link to="/kpk" className="text-xs text-accent-blue hover:underline">Lihat kasus KPK →</Link>
            </div>
          </Card>
        </div>
      </section>

      {/* ── Section 4: Data Sources ────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-bold text-text-primary mb-4 flex items-center gap-2">
          📚 Sumber Data
        </h2>
        <Card className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-3">Sumber Utama</h3>
              <ul className="space-y-2">
                {[
                  { name: 'KPK.go.id',          desc: 'Data kasus korupsi, OTT, LHKPN' },
                  { name: 'LHKPN KPK',           desc: 'Laporan Harta Kekayaan Pejabat Negara' },
                  { name: 'BPS (bps.go.id)',      desc: 'Data statistik, sensus, PDB daerah' },
                  { name: 'DPR RI (dpr.go.id)',   desc: 'Komposisi kursi, rekam jejak voting' },
                  { name: 'KPU RI (kpu.go.id)',   desc: 'Hasil Pemilu 2024, Pilpres, Pileg, Pilkada' },
                  { name: 'Kemendagri',           desc: 'Data kepala daerah dan pilkada' },
                ].map(s => (
                  <li key={s.name} className="flex items-start gap-2 text-sm">
                    <span className="text-accent-blue mt-0.5 flex-shrink-0">•</span>
                    <div>
                      <span className="font-medium text-text-primary">{s.name}</span>
                      <span className="text-text-muted text-xs"> — {s.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-3">Sumber Tambahan</h3>
              <ul className="space-y-2">
                {[
                  { name: 'Transparency International', desc: 'Indeks Persepsi Korupsi (CPI)' },
                  { name: 'Media nasional',              desc: 'Kompas, Tempo, Detik, CNBC Indonesia' },
                  { name: 'Wikipedia ID',                desc: 'Biografi tokoh dan sejarah partai' },
                  { name: 'PPATK',                       desc: 'Laporan transaksi keuangan mencurigakan' },
                  { name: 'Mahkamah Agung RI',           desc: 'Putusan pengadilan Tipikor' },
                  { name: 'ICW (Indonesia Corruption Watch)', desc: 'Pemantauan kasus korupsi independen' },
                ].map(s => (
                  <li key={s.name} className="flex items-start gap-2 text-sm">
                    <span className="text-accent-blue mt-0.5 flex-shrink-0">•</span>
                    <div>
                      <span className="font-medium text-text-primary">{s.name}</span>
                      <span className="text-text-muted text-xs"> — {s.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-sm text-text-secondary">
              <span>📅 Terakhir diperbarui: <strong className="text-text-primary">Maret 2025</strong></span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Data bersifat publik dan bukan data real-time</span>
            </div>
            <Link to="/tentang" className="text-sm text-accent-blue hover:underline">
              Baca metodologi lengkap →
            </Link>
          </div>
        </Card>
      </section>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Profil Tokoh',    icon: '👥', to: '/persons' },
          { label: 'Kasus KPK',       icon: '⚖️', to: '/kpk' },
          { label: 'Jaringan',        icon: '🕸️', to: '/network' },
          { label: 'Power Rankings',  icon: '🏆', to: '/ranking' },
        ].map(a => (
          <Link
            key={a.to}
            to={a.to}
            className="flex items-center gap-3 p-4 rounded-xl border border-border bg-bg-card hover:border-accent-red/50 transition-colors group"
          >
            <span className="text-2xl">{a.icon}</span>
            <span className="text-sm font-medium text-text-primary group-hover:text-accent-red">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
