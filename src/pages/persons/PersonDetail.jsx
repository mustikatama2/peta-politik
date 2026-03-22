import { useState, useEffect, useRef, Component, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTip, LineChart, Line,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Legend,
} from 'recharts'
import { PERSONS } from '../../data/persons'
import { PARTY_MAP } from '../../data/parties'
import { CONNECTIONS } from '../../data/connections'
import { NEWS } from '../../data/news'
import { AGENDAS } from '../../data/agendas'
import { BILLS } from '../../data/voting_records'
import { COMPANIES, POLITICAL_BUSINESS_TIES } from '../../data/business'
import { TIMELINE_EVENTS } from '../../data/timeline_events'
import NetworkGraph from '../../components/NetworkGraph'
import CharacterRadar from '../../components/CharacterRadar'
import WealthBar from '../../components/WealthBar'
import ConnectionBadge from '../../components/ConnectionBadge'
import NewsCard from '../../components/NewsCard'
import PersonCard from '../../components/PersonCard'
import CareerTimeline from '../../components/CareerTimeline'
import { Avatar, Badge, Tabs, Card, formatIDR, Tag, RiskDot, Btn, Breadcrumb } from '../../components/ui'
import { printElement, exportToJSON } from '../../lib/exportUtils'
import ShareButton from '../../components/ShareButton'
import MetaTags from '../../components/MetaTags'
import { scoreOnePerson, scoreAllPersons } from '../../lib/scoring'

function getRelatedPersons(person, allPersons, connections) {
  const scores = {}
  connections
    .filter(c => c.from === person.id || c.to === person.id)
    .forEach(c => {
      const otherId = c.from === person.id ? c.to : c.from
      scores[otherId] = (scores[otherId] || 0) + 3 * ((c.strength || 5) / 10)
    })
  allPersons
    .filter(p => p.id !== person.id && p.party_id === person.party_id && p.party_id)
    .forEach(p => { scores[p.id] = (scores[p.id] || 0) + 2 })
  allPersons
    .filter(p => p.id !== person.id && p.region_id === person.region_id && p.region_id)
    .forEach(p => { scores[p.id] = (scores[p.id] || 0) + 1 })
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([id]) => allPersons.find(p => p.id === id))
    .filter(Boolean)
}

const MAX_WEALTH = Math.max(...PERSONS.filter(p => p.lhkpn_latest).map(p => p.lhkpn_latest))

// Pre-compute all scores once at module load
const ALL_SCORES = scoreAllPersons()
const AVG_SCORES = (() => {
  const n = ALL_SCORES.length
  if (n === 0) return null
  return {
    pos:    ALL_SCORES.reduce((s, x) => s + x.position_score, 0) / n,
    net:    ALL_SCORES.reduce((s, x) => s + x.network_score,  0) / n,
    party:  ALL_SCORES.reduce((s, x) => s + x.party_score,    0) / n,
    wealth: ALL_SCORES.reduce((s, x) => s + x.lhkpn_score,    0) / n,
    total:  ALL_SCORES.reduce((s, x) => s + x.total,          0) / n,
  }
})()

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false } }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full text-text-secondary text-sm">
          Koneksi graph tidak tersedia
        </div>
      )
    }
    return this.props.children
  }
}

const TABS = [
  { id: 'profil',    label: '📋 Profil' },
  { id: 'karir',     label: '🏛️ Karier' },
  { id: 'koneksi',   label: '🕸️ Koneksi' },
  { id: 'statistik', label: '📊 Statistik' },
  { id: 'lhkpn',    label: '💰 LHKPN' },
  { id: 'berita',    label: '📰 Berita' },
  { id: 'agenda',    label: '📋 Agenda' },
  { id: 'voting',    label: '🗳️ Voting' },
  { id: 'analisis',  label: '🔬 Analisis' },
]

const STATUS_VARIANTS = {
  janji: 'status-janji',
  proses: 'status-proses',
  selesai: 'status-selesai',
  ingkar: 'status-ingkar',
  batal: 'status-batal',
}

const CONN_TYPE_COLORS = {
  koalisi:        '#22C55E',
  keluarga:       '#F59E0B',
  rekan:          '#3B82F6',
  konflik:        '#EF4444',
  bisnis:         '#8B5CF6',
  'mentor-murid': '#06B6D4',
  'mantan-koalisi': '#6B7280',
}

// ─── STATISTIK TAB ───────────────────────────────────────────────────────────
function StatistikTab({ person, personConnections }) {
  const score = useMemo(() => scoreOnePerson(person, CONNECTIONS), [person])

  // Stacked bar data for influence breakdown
  const breakdownData = [
    {
      name: 'Skor Pengaruh',
      Posisi:  Math.max(0, score.pos),
      Jaringan: Math.max(0, score.net),
      Partai:  Math.max(0, score.party),
      Kekayaan: Math.max(0, score.wealth),
      Korupsi: Math.abs(Math.min(0, score.corruption)),
    },
  ]

  // LHKPN history chart
  const lhkpnHistory = person.lhkpn_history || null

  // Connection type breakdown
  const connTypeCounts = personConnections.reduce((acc, c) => {
    acc[c.type] = (acc[c.type] || 0) + 1
    return acc
  }, {})
  const connTypeData = Object.entries(connTypeCounts).map(([type, value]) => ({
    name: type, value,
  }))

  // Radar comparison vs avg
  const radarData = AVG_SCORES ? [
    { subject: 'Posisi',   person: score.pos,    avg: AVG_SCORES.pos,    fullMark: 40 },
    { subject: 'Jaringan', person: score.net,    avg: AVG_SCORES.net,    fullMark: 20 },
    { subject: 'Partai',   person: score.party,  avg: AVG_SCORES.party,  fullMark: 20 },
    { subject: 'Kekayaan', person: score.wealth, avg: AVG_SCORES.wealth, fullMark: 10 },
    { subject: 'Total',    person: score.total,  avg: AVG_SCORES.total,  fullMark: 100 },
  ] : []

  const SCORE_COLORS = {
    Posisi:   '#F59E0B',
    Jaringan: '#3B82F6',
    Partai:   '#22C55E',
    Kekayaan: '#8B5CF6',
    Korupsi:  '#EF4444',
  }

  return (
    <div className="space-y-5">
      {/* Total score badge */}
      <Card className="p-5">
        <div className="flex items-center gap-4">
          <div
            className="text-5xl font-black tabular-nums"
            style={{ color: score.total >= 60 ? '#EF4444' : score.total >= 40 ? '#F59E0B' : '#22C55E' }}
          >
            {score.total.toFixed(1)}
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">Skor Pengaruh</p>
            <p className="text-xs text-text-secondary">dari maksimal 100 poin</p>
            {AVG_SCORES && (
              <p className="text-xs mt-1" style={{ color: score.total >= AVG_SCORES.total ? '#22C55E' : '#F59E0B' }}>
                {score.total >= AVG_SCORES.total
                  ? `▲ ${(score.total - AVG_SCORES.total).toFixed(1)} di atas rata-rata`
                  : `▼ ${(AVG_SCORES.total - score.total).toFixed(1)} di bawah rata-rata`}
              </p>
            )}
          </div>
        </div>

        {/* Score component bars */}
        <div className="mt-4 space-y-2">
          {[
            { label: 'Posisi', value: score.pos, max: 40, color: '#F59E0B' },
            { label: 'Jaringan', value: score.net, max: 20, color: '#3B82F6' },
            { label: 'Partai', value: score.party, max: 20, color: '#22C55E' },
            { label: 'Kekayaan', value: score.wealth, max: 10, color: '#8B5CF6' },
            { label: 'Korupsi', value: score.corruption, max: 0, color: '#EF4444', isNeg: true },
          ].map(({ label, value, max, color, isNeg }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-20 text-xs text-text-secondary text-right">{label}</div>
              <div className="flex-1 h-4 rounded-full overflow-hidden bg-bg-elevated">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: isNeg
                      ? `${Math.abs(value) / 40 * 100}%`
                      : `${(value / (max || 1)) * 100}%`,
                    backgroundColor: color,
                    opacity: isNeg ? 0.7 : 1,
                  }}
                />
              </div>
              <div className="w-12 text-xs font-mono text-text-primary text-right">
                {isNeg ? value.toFixed(0) : value.toFixed(1)}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* LHKPN Wealth Trend */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-3">📈 Tren Kekayaan LHKPN</h3>
        {lhkpnHistory && lhkpnHistory.length > 1 ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lhkpnHistory} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <XAxis dataKey="year" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <YAxis
                tickFormatter={v => `${(v / 1_000_000_000).toFixed(0)}M`}
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                width={50}
              />
              <RechartsTip
                formatter={v => [formatIDR(v), 'Kekayaan']}
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 8 }}
                labelStyle={{ color: '#F9FAFB' }}
                itemStyle={{ color: '#F59E0B' }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ fill: '#F59E0B', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="py-6 text-center text-text-secondary text-sm">
            {person.lhkpn_latest
              ? `Data terkini: ${formatIDR(person.lhkpn_latest)} (${person.lhkpn_year}). Riwayat multi-tahun belum tersedia.`
              : 'Data LHKPN tidak tersedia untuk tokoh ini.'}
          </div>
        )}
      </Card>

      {/* Connection type breakdown */}
      {connTypeData.length > 0 && (
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-3">🔗 Distribusi Jenis Koneksi</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie
                  data={connTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  paddingAngle={2}
                >
                  {connTypeData.map((entry, idx) => (
                    <Cell key={idx} fill={CONN_TYPE_COLORS[entry.name] || '#6B7280'} />
                  ))}
                </Pie>
                <RechartsTip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 8 }}
                  itemStyle={{ color: '#F9FAFB' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5">
              {connTypeData.map(({ name, value }) => (
                <div key={name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: CONN_TYPE_COLORS[name] || '#6B7280' }}
                  />
                  <span className="text-xs text-text-secondary capitalize flex-1">{name}</span>
                  <span className="text-xs font-semibold text-text-primary">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Radar: Person vs National Average */}
      {radarData.length > 0 && (
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-1">🎯 Perbandingan vs Rata-rata Nasional</h3>
          <p className="text-xs text-text-secondary mb-3">Dibandingkan dengan {ALL_SCORES.length} tokoh terdaftar</p>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <Radar
                name={person.name.split(' ')[0]}
                dataKey="person"
                stroke="#F59E0B"
                fill="#F59E0B"
                fillOpacity={0.25}
              />
              <Radar
                name="Rata-rata"
                dataKey="avg"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.15}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, color: '#9CA3AF' }}
              />
              <RechartsTip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 8 }}
                itemStyle={{ color: '#F9FAFB' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  )
}

// ─── VOTING TAB ───────────────────────────────────────────────────────────────
function VotingTab({ person }) {
  const partyId = person.party_id
  if (!partyId) return (
    <div className="py-8 text-center text-text-secondary">
      <p className="text-3xl mb-2">📋</p>
      <p>Tokoh independen/profesional — tidak ada data voting partai</p>
    </div>
  )

  const billsWithVote = BILLS.map(bill => ({
    ...bill,
    vote: bill.party_positions?.[partyId] || null,
  }))

  const kimParties = ['ger', 'gol', 'nas', 'pan', 'dem', 'pks', 'pbb', 'pkb']
  const isKIM = kimParties.includes(partyId)

  const withVote = billsWithVote.filter(b => b.vote)
  const consistent = withVote.filter(b => {
    const govVote = isKIM ? 'setuju' : 'menolak'
    return b.vote === govVote
  }).length
  const consistency = withVote.length ? Math.round(consistent / withVote.length * 100) : null

  const voteConfig = {
    setuju:  { icon: '✅', label: 'Setuju',  cls: 'text-green-400 bg-green-400/10 border-green-400/30' },
    menolak: { icon: '❌', label: 'Menolak', cls: 'text-red-400 bg-red-400/10 border-red-400/30' },
    abstain: { icon: '🟡', label: 'Abstain', cls: 'text-amber-400 bg-amber-400/10 border-amber-400/30' },
  }
  const resultCfg = {
    disahkan: 'bg-red-500/10 text-red-400',
    ditarik: 'bg-amber-500/10 text-amber-400',
    dibatalkan_mk: 'bg-green-500/10 text-green-400',
    disetujui: 'bg-red-500/10 text-red-400',
  }

  return (
    <div className="space-y-4">
      {consistency !== null && (
        <div className="p-4 rounded-xl border border-border bg-bg-elevated flex items-center gap-4">
          <div
            className="text-3xl font-bold"
            style={{ color: consistency > 70 ? '#22C55E' : consistency > 40 ? '#F59E0B' : '#EF4444' }}
          >
            {consistency}%
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">Konsistensi Voting</p>
            <p className="text-xs text-text-secondary">
              {isKIM
                ? 'Tingkat dukungan terhadap agenda koalisi pemerintah'
                : 'Tingkat konsistensi oposisi terhadap agenda pemerintah'}
            </p>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {billsWithVote.map(bill => {
          const cfg = voteConfig[bill.vote] || { icon: '➖', label: 'Tidak Hadir/Data N/A', cls: 'text-gray-500 bg-gray-500/10 border-gray-500/30' }
          return (
            <div key={bill.id} className="p-4 rounded-xl border border-border bg-bg-card flex items-center gap-4">
              <div className={`flex-shrink-0 px-3 py-2 rounded-lg border text-center min-w-[80px] ${cfg.cls}`}>
                <div className="text-xl">{cfg.icon}</div>
                <div className="text-xs font-bold">{cfg.label}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-sm font-semibold text-text-primary">{bill.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${resultCfg[bill.result] || 'bg-gray-500/10 text-gray-400'}`}>
                    {bill.result}
                  </span>
                </div>
                <p className="text-xs text-text-secondary line-clamp-2">{bill.description}</p>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {(bill.controversies || []).slice(0, 2).map(c => (
                    <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-bg-elevated border border-border text-text-secondary">{c}</span>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-xs text-text-secondary">{bill.date?.slice(0, 7)}</p>
                <p className="text-xs font-medium" style={{ color: bill.votes_against > 0 ? '#F59E0B' : '#6B7280' }}>
                  {bill.votes_for > 0 ? `${bill.votes_for}:${bill.votes_against}` : 'N/A'}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── RINGKASAN AWAM ───────────────────────────────────────────────────────────
function RingkasanAwam({ person, party }) {
  const firstYear = (person.positions || []).reduce((min, p) => {
    const y = parseInt(p.year_start || p.start || '9999', 10)
    return y < min ? y : min
  }, 9999)

  const jabatan = (person.positions?.find(p => p.is_current)?.title)
    || (person.positions?.[0]?.title)
    || person.party_role
    || 'politisi'

  const partaiLabel = party?.name || 'jalur independen'

  const lhkpn = person.lhkpn_latest
    ? `Rp${(person.lhkpn_latest / 1_000_000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} juta`
    : null

  const sejak = firstYear < 9999 ? firstYear : null
  const kontroversi = person.controversies?.[0]

  let summary = `${person.name} adalah ${jabatan}`
  if (party) {
    summary += ` dari partai ${partaiLabel}.`
  } else {
    summary += `, tokoh ${partaiLabel}.`
  }
  if (lhkpn) {
    summary += ` Ia memiliki kekayaan ${lhkpn}`
    if (sejak) {
      summary += ` dan telah berkarier sejak tahun ${sejak}.`
    } else {
      summary += `.`
    }
  } else if (sejak) {
    summary += ` Ia telah berkarier sejak tahun ${sejak}.`
  }
  if (kontroversi) {
    const judulKontroversi = typeof kontroversi === 'string' ? kontroversi : (kontroversi.title || '')
    if (judulKontroversi) {
      summary += ` Pernah terlibat dalam: ${judulKontroversi}.`
    }
  }

  return (
    <div
      className="rounded-xl p-4 border"
      style={{ backgroundColor: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.30)' }}
    >
      <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#D97706' }}>
        ℹ️ Ringkasan Sederhana
      </p>
      <p className="text-sm text-text-primary leading-relaxed">{summary}</p>
      <p className="text-[11px] text-text-secondary mt-2 italic">
        Ringkasan singkat untuk pembaca umum. Informasi lengkap ada di tab Profil &amp; Analisis.
      </p>
    </div>
  )
}

// ─── BERITA TERKAIT ──────────────────────────────────────────────────────────
function BeritaTerkait({ person }) {
  const firstName = person.name.split(' ')[0].toLowerCase()
  const matchedNews = NEWS.filter(n => {
    if (n.person_ids?.includes(person.id)) return true
    const headline = (n.headline || '').toLowerCase()
    return headline.includes(firstName) && firstName.length > 3
  }).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)

  return (
    <div className="mt-6 pt-6 border-t border-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-text-primary">📰 Berita Terkait</h3>
        <Link
          to={`/news?person=${person.id}`}
          className="text-xs text-accent-blue hover:underline"
        >
          Semua berita →
        </Link>
      </div>
      {matchedNews.length === 0 ? (
        <div className="rounded-xl border border-border bg-bg-card p-5 text-center">
          <p className="text-text-secondary text-sm mb-2">Tidak ada berita statis cocok untuk tokoh ini.</p>
          <Link
            to={`/news?person=${person.id}`}
            className="inline-flex items-center gap-1.5 text-xs text-accent-blue hover:underline"
          >
            🔍 Cari berita terbaru di tab Berita →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {matchedNews.map(n => (
            <a
              key={n.id}
              href={n.url || '#'}
              target={n.url && n.url !== '#' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex gap-3 p-3 rounded-xl border border-border bg-bg-card hover:border-accent-blue/40 hover:bg-bg-elevated transition-all group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary group-hover:text-accent-blue transition-colors line-clamp-2 leading-snug">
                  {n.headline}
                </p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-xs font-medium text-accent-blue">{n.source}</span>
                  <span className="text-xs text-text-secondary">{n.date}</span>
                  {n.sentiment && (
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                      n.sentiment === 'positif' ? 'text-green-400 bg-green-400/10' :
                      n.sentiment === 'negatif' ? 'text-red-400 bg-red-400/10' :
                      'text-gray-400 bg-gray-400/10'
                    }`}>
                      {n.sentiment === 'positif' ? '▲' : n.sentiment === 'negatif' ? '▼' : '●'} {n.sentiment}
                    </span>
                  )}
                </div>
              </div>
            </a>
          ))}
          <div className="pt-1 text-center">
            <Link
              to={`/news?person=${person.id}`}
              className="text-xs text-text-secondary hover:text-accent-blue transition-colors"
            >
              Cari berita terbaru di tab Berita →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── RINGKASAN SIDEBAR ────────────────────────────────────────────────────────
function RingkasanSidebar({ person, party, personConnections, navigate }) {
  const [inWatchlist, setInWatchlist] = useState(() => {
    try {
      const list = JSON.parse(localStorage.getItem('watchlist') || '[]')
      return list.includes(person.id)
    } catch { return false }
  })

  const score = useMemo(() => scoreOnePerson(person, CONNECTIONS), [person])

  const riskKey = person.analysis?.corruption_risk || 'rendah'
  const RISK_CONFIG = {
    rendah:    { label: '✓ Bersih',     color: '#22C55E' },
    sedang:    { label: '⚠ Sedang',     color: '#F59E0B' },
    tinggi:    { label: '⚠ Tinggi',     color: '#F97316' },
    tersangka: { label: '🔴 Tersangka', color: '#EF4444' },
    terpidana: { label: '⛔ Terpidana', color: '#DC2626' },
  }

  const toggleWatchlist = () => {
    try {
      const list = JSON.parse(localStorage.getItem('watchlist') || '[]')
      const updated = inWatchlist ? list.filter(id => id !== person.id) : [...list, person.id]
      localStorage.setItem('watchlist', JSON.stringify(updated))
      setInWatchlist(!inWatchlist)
    } catch { /* ignore */ }
  }

  const handleCompare = () => {
    try { localStorage.setItem('compare_p1', person.id) } catch { /* ignore */ }
    navigate(`/compare/${person.id}`)
  }

  // Top 5 most-connected persons (by strength, then count)
  const top5 = useMemo(() => {
    const scoreMap = {}
    personConnections.forEach(c => {
      const pid = c.from === person.id ? c.to : c.from
      if (!scoreMap[pid]) scoreMap[pid] = { pid, strength: 0, conn: c }
      scoreMap[pid].strength += (c.strength || 5)
    })
    return Object.values(scoreMap)
      .sort((a, b) => b.strength - a.strength)
      .slice(0, 5)
      .map(({ pid, conn }) => {
        const p = PERSONS.find(x => x.id === pid)
        return p ? { person: p, conn } : null
      })
      .filter(Boolean)
  }, [person, personConnections])

  return (
    <div className="space-y-4">
      {/* Quick stats card */}
      <div
        className="rounded-2xl border border-border p-4 space-y-3"
        style={{ backgroundColor: 'var(--bg-card)' }}
      >
        <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">📋 Ringkasan</p>

        <div className="space-y-2">
          {[
            {
              label: 'Skor Pengaruh',
              value: score.total.toFixed(1),
              valueColor: score.total >= 60 ? '#EF4444' : score.total >= 40 ? '#F59E0B' : '#9CA3AF',
            },
            { label: 'Tier', value: person.tier || '—' },
            { label: 'Partai', value: party?.abbr || 'Independen' },
            {
              label: 'LHKPN',
              value: person.lhkpn_latest ? formatIDR(person.lhkpn_latest) : 'N/A',
              valueColor: 'var(--accent-gold)',
            },
            { label: 'Koneksi', value: `${personConnections.length} relasi` },
            {
              label: 'Status KPK',
              value: RISK_CONFIG[riskKey]?.label || '—',
              valueColor: RISK_CONFIG[riskKey]?.color,
            },
          ].map(({ label, value, valueColor }) => (
            <div key={label} className="flex justify-between items-center gap-2">
              <span className="text-xs text-text-secondary">{label}</span>
              <span
                className="text-xs font-semibold text-right"
                style={{ color: valueColor || 'var(--text-primary)' }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-2">
        <button
          onClick={toggleWatchlist}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all"
          style={{
            backgroundColor: inWatchlist ? 'rgba(239,68,68,0.1)' : 'var(--bg-elevated)',
            borderColor: inWatchlist ? 'rgba(239,68,68,0.4)' : 'var(--border)',
            color: inWatchlist ? '#EF4444' : 'var(--text-secondary)',
          }}
        >
          {inWatchlist ? '🔕 Hapus Pantauan' : '👁 Tambah ke Pantauan'}
        </button>
        <button
          onClick={handleCompare}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-border text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-all"
        >
          ⚖️ Bandingkan
        </button>
        <div className="flex justify-center">
          <ShareButton title={person.name} />
        </div>
      </div>

      {/* Tokoh Terkait */}
      {top3.length > 0 && (
        <div
          className="rounded-2xl border border-border p-4"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">👥 Tokoh Terkait</p>
          <div className="space-y-3">
            {top3.map(p => {
              const pp = p.party_id ? PARTY_MAP[p.party_id] : null
              const initials = p.name.split(' ').slice(0, 2).map(w => w[0]).join('')
              return (
                <Link
                  key={p.id}
                  to={`/persons/${p.id}`}
                  className="flex items-center gap-2 group"
                >
                  {p.photo_url ? (
                    <img
                      src={p.photo_url}
                      alt={p.name}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-border"
                      onError={e => { e.target.style.display = 'none' }}
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: pp?.color || '#374151' }}
                    >
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-text-primary group-hover:text-accent-blue transition-colors line-clamp-1">
                      {p.name}
                    </p>
                    <p className="text-[10px] text-text-secondary">{pp?.abbr || 'Independen'}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function PersonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profil')
  const [showExport, setShowExport] = useState(false)
  const [personNews, setPersonNews] = useState([])
  const [newsLoading, setNewsLoading] = useState(false)

  const person = PERSONS.find(p => p.id === id)
  const relatedPersons = useMemo(() => {
    if (!person) return []
    return getRelatedPersons(person, PERSONS, CONNECTIONS)
  }, [person])

  useEffect(() => {
    if (activeTab !== 'berita' || !person) return
    setNewsLoading(true)
    fetch(`/api/news?person_id=${person.id}&limit=20`)
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (data?.articles?.length > 0) {
          setPersonNews(data.articles)
        } else {
          setPersonNews(
            NEWS
              .filter(n => n.person_ids?.includes(person.id))
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map(n => ({ ...n, title: n.headline || n.title || '', excerpt: n.excerpt || n.summary || '', url: n.url || '#', source_id: 'static' }))
          )
        }
      })
      .catch(() => {
        setPersonNews(
          NEWS
            .filter(n => n.person_ids?.includes(person.id))
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(n => ({ ...n, title: n.headline || n.title || '', excerpt: n.excerpt || n.summary || '', url: n.url || '#', source_id: 'static' }))
        )
      })
      .finally(() => setNewsLoading(false))
  }, [activeTab, person])

  useEffect(() => {
    if (person) document.title = `${person.name} — PetaPolitik`
    return () => { document.title = 'PetaPolitik Indonesia' }
  }, [person])

  if (!person) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="text-6xl">🔍</div>
        <h2 className="text-xl font-semibold text-text-primary">Tokoh tidak ditemukan</h2>
        <p className="text-text-secondary">ID: {id}</p>
        <Btn onClick={() => navigate('/persons')}>← Kembali ke Daftar</Btn>
      </div>
    )
  }

  const party = person.party_id ? PARTY_MAP[person.party_id] : null
  const currentPos = person.positions?.find(p => p.is_current)
  const sortedPositions = [...(person.positions || [])].sort((a, b) => (b.start || 0) - (a.start || 0))

  const personConnections = CONNECTIONS.filter(c => c.from === person.id || c.to === person.id)
  const connectedPersonIds = new Set(personConnections.map(c => c.from === person.id ? c.to : c.from))
  const connectedPersons = PERSONS.filter(p => connectedPersonIds.has(p.id))
  const networkNodes = [person, ...connectedPersons]
  const networkEdges = personConnections.filter(c =>
    connectedPersonIds.has(c.from) || connectedPersonIds.has(c.to) ||
    c.from === person.id || c.to === person.id
  )
  const safeNodeIds = new Set(networkNodes.map(n => n.id))
  const safeEdges = networkEdges.filter(e => safeNodeIds.has(e.from) && safeNodeIds.has(e.to))

  const personAgendas = AGENDAS.filter(a => a.subject_id === person.id)

  const RISK_CONFIG = {
    rendah:    { label: '✓ Bersih',     cls: 'risk-rendah' },
    sedang:    { label: '⚠ Sedang',     cls: 'risk-sedang' },
    tinggi:    { label: '⚠ Tinggi',     cls: 'risk-tinggi' },
    tersangka: { label: '🔴 Tersangka', cls: 'risk-tersangka' },
    terpidana: { label: '⛔ Terpidana', cls: 'risk-terpidana' },
  }
  const riskKey = person.analysis?.corruption_risk || 'rendah'

  const handlePrint = () => {
    printElement('profile-print-area', person.name + ' — PetaPolitik')
    setShowExport(false)
  }

  const handleExportJSON = () => {
    const data = {
      person,
      connections: personConnections,
      news: personNews.slice(0, 10),
      agendas: personAgendas,
      exportedAt: new Date().toISOString(),
      source: 'PetaPolitik v1.0',
    }
    exportToJSON(data, `${person.id}-petapolitik`)
    setShowExport(false)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setShowExport(false)
    alert('Link berhasil disalin!')
  }

  // Career highlights helper data
  const allPositions = person.positions || []
  const normalizedPos = allPositions.map(pos => ({
    ...pos,
    _yearStart: parseInt(pos.year_start || pos.start || '0', 10) || null,
    _yearEnd:   parseInt(pos.year_end   || pos.end   || '0', 10) || null,
    _org:       pos.org || pos.institution || null,
    _title:     pos.title || pos.role || '—',
  }))

  const firstYear = normalizedPos.reduce((min, p) => p._yearStart && p._yearStart < min ? p._yearStart : min, 9999)
  const lastYear  = normalizedPos.reduce((max, p) => {
    if (p.is_current) return new Date().getFullYear()
    return p._yearEnd && p._yearEnd > max ? p._yearEnd : max
  }, 0)
  const careerYears = (firstYear < 9999 && lastYear > 0) ? lastYear - firstYear : null

  const topPosition = currentPos || (normalizedPos.length > 0 ? normalizedPos[0] : null)
  const partyHistory = person.party_history || (party ? [party.abbr] : [])

  return (
    <div className="space-y-5">
      <MetaTags title={person.name} description={person.bio} />
      <Breadcrumb items={[
        { label: 'Beranda', to: '/' },
        { label: 'Tokoh', to: '/persons' },
        { label: person.name },
      ]} />

      <div id="profile-print-area">

      {/* Hero section */}
      <div
        className="relative rounded-2xl overflow-hidden p-6 md:p-8"
        style={{
          background: party
            ? `linear-gradient(135deg, ${party.color}22 0%, ${party.color}08 100%)`
            : 'var(--bg-elevated)',
          border: `1px solid ${party ? party.color + '33' : 'var(--border)'}`,
          borderLeft: party ? `4px solid ${party.color}` : undefined,
        }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar
            name={person.name}
            photoUrl={person.photo_url}
            color={party?.color}
            size="xl"
            className="ring-4 ring-bg-card flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary">{person.name}</h1>
            {currentPos && (
              <p className="text-text-secondary mt-1">{currentPos.title} · {currentPos.institution}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              {party && <Badge color={party.color}>{party.logo_emoji} {party.abbr}</Badge>}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${RISK_CONFIG[riskKey]?.cls}`}>
                {RISK_CONFIG[riskKey]?.label}
              </span>
              <Badge variant="role">{person.tier}</Badge>
              {person.tags?.map(t => <Tag key={t}>#{t}</Tag>)}
            </div>
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <Btn onClick={() => navigate(`/compare/${person.id}`)} variant="secondary" size="sm">
                ⚖️ Bandingkan
              </Btn>
              <ShareButton title={person.name} />
              <div className="relative">
                <Btn onClick={() => setShowExport(!showExport)} variant="secondary" size="sm">
                  📤 Export ▾
                </Btn>
                {showExport && (
                  <div className="absolute left-0 top-full mt-1 bg-bg-card border border-border rounded-lg shadow-xl z-10 min-w-36">
                    <button onClick={handlePrint} className="w-full text-left px-4 py-2.5 text-sm text-text-primary hover:bg-bg-elevated rounded-t-lg">🖨️ Print / PDF</button>
                    <button onClick={handleExportJSON} className="w-full text-left px-4 py-2.5 text-sm text-text-primary hover:bg-bg-elevated">📊 Export JSON</button>
                    <button onClick={handleCopyLink} className="w-full text-left px-4 py-2.5 text-sm text-text-primary hover:bg-bg-elevated rounded-b-lg">🔗 Copy Link</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {person.lhkpn_latest && (
            <div className="text-center flex-shrink-0 self-stretch flex flex-col justify-center bg-bg-card rounded-xl px-5 py-4 border border-border" style={{ boxShadow: 'var(--shadow-card)' }}>
              <p className="text-xs text-text-secondary uppercase tracking-wider">LHKPN {person.lhkpn_year}</p>
              <p className="text-2xl font-bold mt-1" style={{ color: 'var(--accent-gold)' }}>
                {formatIDR(person.lhkpn_latest)}
              </p>
            </div>
          )}
        </div>

        {person.controversies?.length > 0 && (
          <div className="mt-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-3">
            <span className="text-red-500 flex-shrink-0 mt-0.5">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-red-800">Catatan Penting</p>
              <p className="text-xs text-red-700 mt-0.5">
                {person.controversies.length} kontroversi tercatat. Lihat tab Analisis untuk detail lengkap.
              </p>
            </div>
          </div>
        )}

        {sortedPositions.length > 0 && (
          <div className="mt-4">
            <p className="text-[11px] text-text-secondary uppercase tracking-wider mb-2 font-semibold">Rekam Jejak Singkat</p>
            <div className="flex flex-wrap items-center gap-1.5">
              {sortedPositions.slice(0, 3).map((pos, i) => {
                const yearStart = pos.year_start || pos.start || null
                const yearEnd   = pos.year_end   || pos.end   || null
                const org       = pos.org         || pos.institution || null
                const label     = `${yearStart || '?'} – ${pos.is_current ? 'Sekarang' : (yearEnd || '?')}: ${pos.title}${org ? ` · ${org}` : ''}`
                return (
                  <span
                    key={i}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border"
                    style={{
                      backgroundColor: pos.is_current ? 'rgba(245,158,11,0.12)' : 'var(--bg-elevated)',
                      borderColor:     pos.is_current ? 'rgba(245,158,11,0.4)' : 'var(--border)',
                      color:           pos.is_current ? 'var(--accent-gold, #F59E0B)' : 'var(--text-secondary)',
                    }}
                  >
                    {label}
                  </span>
                )
              })}
              {sortedPositions.length > 3 && (
                <button
                  onClick={() => setActiveTab('karir')}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full border border-border text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
                >
                  +{sortedPositions.length - 3} lainnya →
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {/* Main area: tab content + sidebar */}
      <div className="mt-2 flex gap-5 items-start">

        {/* Tab content (flex-1) */}
        <div className="flex-1 min-w-0">

          {/* PROFIL */}
          {activeTab === 'profil' && (
            <div className="space-y-5">
              {/* Ringkasan Awam — plain language card for general audience */}
              <RingkasanAwam person={person} party={party} />

              <Card className="p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-2">Bio</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{person.bio}</p>
              </Card>
              <Card className="p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Info</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {person.born && (
                    <div>
                      <p className="text-xs text-text-secondary mb-0.5">Lahir</p>
                      <p className="text-sm text-text-primary">{person.born}</p>
                      {person.born_place && <p className="text-xs text-text-secondary">{person.born_place}</p>}
                    </div>
                  )}
                  {person.religion && (
                    <div>
                      <p className="text-xs text-text-secondary mb-0.5">Agama</p>
                      <p className="text-sm text-text-primary">{person.religion}</p>
                    </div>
                  )}
                  {person.education && (
                    <div>
                      <p className="text-xs text-text-secondary mb-0.5">Pendidikan</p>
                      <p className="text-sm text-text-primary">{person.education}</p>
                    </div>
                  )}
                  {person.twitter && (
                    <div>
                      <p className="text-xs text-text-secondary mb-0.5">Twitter/X</p>
                      <p className="text-sm text-accent-blue">{person.twitter}</p>
                    </div>
                  )}
                </div>
              </Card>
              <Card className="p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-4">Riwayat Karier</h3>
                <div className="relative pl-5 space-y-4">
                  <div className="absolute left-1.5 top-0 bottom-0 w-0.5 bg-border" />
                  {sortedPositions.map((pos, i) => (
                    <div key={i} className="relative">
                      <div
                        className="absolute -left-4 top-1 w-3 h-3 rounded-full border-2 border-bg-card"
                        style={{ backgroundColor: pos.is_current ? (party?.color || '#EF4444') : '#374151' }}
                      />
                      <div>
                        <p className="text-sm font-medium text-text-primary">{pos.title}</p>
                        <p className="text-xs text-text-secondary">{pos.institution}</p>
                        <p className="text-xs text-text-secondary mt-0.5">
                          {pos.start}{pos.end ? ` – ${pos.end}` : ' – Sekarang'}
                          {pos.is_current && <span className="ml-2 text-accent-green">● Aktif</span>}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              {person.controversies?.length > 0 && (
                <Card className="p-5 border-l-4 border-l-red-500">
                  <h3 className="text-sm font-semibold text-red-400 mb-3">⚠️ Kontroversi</h3>
                  <div className="space-y-3">
                    {person.controversies.map((c, i) => (
                      <div key={i} className="border border-red-500/20 rounded-lg p-3">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-medium text-text-primary">{c.title}</p>
                          {c.severity && (
                            <Badge variant={c.severity === 'berat' ? 'risk-tersangka' : 'risk-sedang'}>
                              {c.severity}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-text-secondary">{c.description}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
              {(() => {
                const personCompanies = COMPANIES.filter(c => c.owner_ids?.includes(person.id))
                const personTies = POLITICAL_BUSINESS_TIES.filter(t => t.person_id === person.id)
                if (personCompanies.length === 0 && personTies.length === 0) return null
                return (
                  <Card className="p-5">
                    <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                      🏢 Kepentingan Bisnis
                      {personTies.some(t => t.risk === 'tinggi') && (
                        <span className="text-xs px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-400">⚠️ COI Risk</span>
                      )}
                    </h3>
                    <div className="space-y-2">
                      {personCompanies.map(c => (
                        <div key={c.id} className="p-3 rounded-lg border border-border bg-bg-elevated">
                          <div className="flex justify-between items-start gap-3">
                            <div>
                              <p className="text-sm font-semibold text-text-primary">{c.name}</p>
                              <p className="text-xs text-text-secondary">{c.sector} · {c.revenue_estimate}</p>
                              <p className="text-xs text-text-secondary mt-1">{c.political_link}</p>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded border flex-shrink-0 ${c.coi_risk === 'tinggi' ? 'border-red-500/40 text-red-400' : 'border-amber-500/40 text-amber-400'}`}>
                              {c.coi_risk} risk
                            </span>
                          </div>
                        </div>
                      ))}
                      {personTies.filter(t => !personCompanies.find(c => c.id === t.company_id)).map(t => (
                        <div key={t.company_id} className="p-3 rounded-lg border border-border bg-bg-elevated">
                          <div className="flex justify-between items-start gap-3">
                            <div>
                              <p className="text-sm font-semibold text-text-primary">{t.company_id}</p>
                              <p className="text-xs text-text-secondary">{t.description}</p>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded border flex-shrink-0 ${t.risk === 'tinggi' ? 'border-red-500/40 text-red-400' : 'border-amber-500/40 text-amber-400'}`}>
                              {t.risk} risk
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )
              })()}
              {(() => {
                const personTimeline = TIMELINE_EVENTS.filter(e =>
                  e.person_ids?.includes(person.id) ||
                  e.description?.toLowerCase().includes(person.name.split(' ')[0].toLowerCase())
                ).sort((a, b) => b.year - a.year).slice(0, 5)
                if (personTimeline.length === 0) return null
                return (
                  <Card className="p-5">
                    <h3 className="text-sm font-bold text-text-primary mb-3">📅 Momen Bersejarah</h3>
                    <div className="space-y-2">
                      {personTimeline.map(e => (
                        <div key={e.id} className="flex gap-3 p-3 rounded-lg border border-border bg-bg-elevated">
                          <span className="text-xs font-bold text-accent-red flex-shrink-0 w-10">{e.year}</span>
                          <div>
                            <p className="text-sm text-text-primary">{e.title}</p>
                            <p className="text-xs text-text-secondary line-clamp-1">{e.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )
              })()}
            </div>
          )}

          {/* KARIER — enhanced */}
          {activeTab === 'karir' && (
            <div className="space-y-4">

              {/* Sorotan Karier */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Jabatan tertinggi */}
                <div className="p-4 rounded-xl border border-border bg-bg-card">
                  <p className="text-xs text-text-secondary mb-1">🏆 Jabatan Tertinggi</p>
                  <p className="text-sm font-semibold text-text-primary leading-snug">
                    {topPosition?._title || topPosition?.title || '—'}
                  </p>
                  {(topPosition?._org || topPosition?.institution) && (
                    <p className="text-xs text-text-secondary mt-0.5">
                      {topPosition._org || topPosition.institution}
                    </p>
                  )}
                </div>

                {/* Lama berkarier */}
                <div className="p-4 rounded-xl border border-border bg-bg-card">
                  <p className="text-xs text-text-secondary mb-1">📅 Lama Berkarier</p>
                  <p className="text-2xl font-black text-text-primary">
                    {careerYears !== null ? `${careerYears}` : '—'}
                  </p>
                  {careerYears !== null && (
                    <p className="text-xs text-text-secondary">
                      tahun ({firstYear} – {lastYear === new Date().getFullYear() ? 'Sekarang' : lastYear})
                    </p>
                  )}
                </div>

                {/* Perjalanan partai */}
                <div className="p-4 rounded-xl border border-border bg-bg-card">
                  <p className="text-xs text-text-secondary mb-1">🏛️ Perjalanan Partai</p>
                  {partyHistory.length > 0 ? (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {partyHistory.map((p, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded-full border border-border bg-bg-elevated text-text-primary"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-text-secondary">
                      {party?.abbr || 'Independen'}
                    </p>
                  )}
                </div>
              </div>

              {/* Track record callout */}
              {person.analysis?.track_record && (
                <div
                  className="flex gap-3 p-4 rounded-xl border"
                  style={{
                    backgroundColor: 'rgba(59,130,246,0.08)',
                    borderColor: 'rgba(59,130,246,0.25)',
                  }}
                >
                  <span className="text-xl flex-shrink-0">📌</span>
                  <div>
                    <p className="text-xs font-bold text-blue-400 mb-1 uppercase tracking-wider">Track Record</p>
                    <p className="text-sm text-text-secondary leading-relaxed">{person.analysis.track_record}</p>
                  </div>
                </div>
              )}

              {/* Career timeline */}
              <Card className="p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-4">Rekam Jabatan</h3>
                <CareerTimeline person={person} />
              </Card>

              {/* Timeline events */}
              {(() => {
                const personTimeline = TIMELINE_EVENTS.filter(e =>
                  e.person_ids?.includes(person.id) ||
                  e.description?.toLowerCase().includes(person.name.split(' ')[0].toLowerCase())
                ).sort((a, b) => b.year - a.year)
                if (personTimeline.length === 0) return null
                return (
                  <Card className="p-5">
                    <h3 className="text-sm font-bold text-text-primary mb-3">📅 Momen Bersejarah</h3>
                    <div className="space-y-2">
                      {personTimeline.map(e => (
                        <div key={e.id} className="flex gap-3 p-3 rounded-lg border border-border bg-bg-elevated">
                          <span className="text-xs font-bold text-accent-red flex-shrink-0 w-10">{e.year}</span>
                          <div>
                            <p className="text-sm text-text-primary">{e.title}</p>
                            <p className="text-xs text-text-secondary line-clamp-2">{e.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )
              })()}
            </div>
          )}

          {/* KONEKSI — enhanced cards, skip D3 for build safety */}
          {activeTab === 'koneksi' && (
            <div className="space-y-5">
              <Card className="p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-3">
                  Graf Koneksi — {personConnections.length} relasi terpetakan
                </h3>
                <div style={{ height: 400 }}>
                  <ErrorBoundary>
                    <NetworkGraph
                      nodes={networkNodes}
                      edges={safeEdges}
                      centerNodeId={person.id}
                    />
                  </ErrorBoundary>
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-3">
                  Daftar Koneksi
                  <span className="ml-2 text-xs text-text-secondary font-normal">
                    ({personConnections.length} relasi)
                  </span>
                </h3>
                {personConnections.length === 0 ? (
                  <p className="text-text-secondary text-sm">Belum ada koneksi terpetakan.</p>
                ) : (() => {
                  // Group connections by type
                  const grouped = personConnections.reduce((acc, c) => {
                    const t = c.type || 'rekan'
                    if (!acc[t]) acc[t] = []
                    acc[t].push(c)
                    return acc
                  }, {})
                  const TYPE_ORDER = ['keluarga','koalisi','bisnis','mentor-murid','rekan','mantan-koalisi','konflik','atasan-bawahan']
                  const sortedTypes = Object.keys(grouped).sort((a, b) => {
                    const ai = TYPE_ORDER.indexOf(a); const bi = TYPE_ORDER.indexOf(b)
                    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
                  })
                  return (
                    <div className="space-y-5">
                      {sortedTypes.map(type => {
                        const typeColor = CONN_TYPE_COLORS[type] || '#6B7280'
                        return (
                          <div key={type}>
                            {/* Group header */}
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: typeColor }} />
                              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: typeColor }}>
                                {type}
                              </span>
                              <span className="text-xs text-text-secondary">({grouped[type].length})</span>
                            </div>
                            <div className="space-y-2 pl-4 border-l-2" style={{ borderColor: typeColor + '40' }}>
                              {grouped[type].map((c, i) => {
                                const partnerId = c.from === person.id ? c.to : c.from
                                const partner = PERSONS.find(p => p.id === partnerId)
                                const partnerParty = partner?.party_id ? PARTY_MAP[partner.party_id] : null
                                const initials = partner ? partner.name.split(' ').slice(0, 2).map(w => w[0]).join('') : '?'
                                const strength = c.strength || 5
                                const sinceMatch = (c.label || '').match(/\b(19|20)\d{2}\b/)
                                const sinceYear = sinceMatch ? sinceMatch[0] : null
                                return (
                                  <div
                                    key={i}
                                    className="flex items-center gap-3 p-3 rounded-xl border border-border bg-bg-elevated hover:bg-bg-card transition-colors"
                                  >
                                    {/* Avatar */}
                                    {partner?.photo_url ? (
                                      <img
                                        src={partner.photo_url}
                                        alt={partner.name}
                                        className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-border"
                                        onError={e => { e.target.style.display = 'none' }}
                                      />
                                    ) : (
                                      <div
                                        className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                                        style={{ backgroundColor: partnerParty?.color || '#374151' }}
                                      >
                                        {initials}
                                      </div>
                                    )}
                                    {/* Connection info */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        {partner ? (
                                          <Link
                                            to={`/persons/${partner.id}`}
                                            className="text-sm font-semibold text-text-primary hover:text-accent-blue transition-colors"
                                          >
                                            {partner.name}
                                          </Link>
                                        ) : (
                                          <span className="text-sm text-text-secondary">{partnerId}</span>
                                        )}
                                        {sinceYear && (
                                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-card border border-border text-text-secondary">
                                            sejak {sinceYear}
                                          </span>
                                        )}
                                        {partnerParty && (
                                          <span className="text-[10px] font-medium" style={{ color: partnerParty.color }}>
                                            {partnerParty.abbr}
                                          </span>
                                        )}
                                      </div>
                                      {c.label && (
                                        <p className="text-xs text-text-secondary line-clamp-1 mt-0.5">{c.label}</p>
                                      )}
                                      {/* Strength meter */}
                                      <div className="flex items-center gap-1.5 mt-1.5">
                                        <div className="flex gap-0.5">
                                          {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                            <div
                                              key={n}
                                              className="w-1.5 h-2 rounded-sm"
                                              style={{
                                                backgroundColor: n <= strength ? typeColor : 'var(--border)',
                                                opacity: n <= strength ? 1 : 0.4,
                                              }}
                                            />
                                          ))}
                                        </div>
                                        <span className="text-[10px] text-text-secondary">{strength}/10</span>
                                      </div>
                                    </div>
                                    {/* Type badge */}
                                    <span
                                      className="flex-shrink-0 text-[10px] font-bold uppercase px-2 py-1 rounded-full"
                                      style={{
                                        backgroundColor: typeColor + '20',
                                        color: typeColor,
                                        border: `1px solid ${typeColor}40`,
                                      }}
                                    >
                                      {type}
                                    </span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })()}
              </Card>
            </div>
          )}

          {/* STATISTIK */}
          {activeTab === 'statistik' && (
            <StatistikTab person={person} personConnections={personConnections} />
          )}

          {/* LHKPN */}
          {activeTab === 'lhkpn' && (
            <Card className="p-5 space-y-5">
              <h3 className="text-sm font-semibold text-text-primary">Laporan Harta Kekayaan</h3>
              {person.lhkpn_latest ? (
                <>
                  <div>
                    <p className="text-text-secondary text-xs mb-1">Total Kekayaan</p>
                    <p className="text-3xl font-bold text-accent-gold">{formatIDR(person.lhkpn_latest)}</p>
                    <p className="text-text-secondary text-xs mt-1">Tahun laporan: {person.lhkpn_year}</p>
                  </div>
                  <WealthBar amount={person.lhkpn_latest} max={MAX_WEALTH} label="Perbandingan dengan Tokoh Terkaya" />
                  <a href="https://elhkpn.kpk.go.id" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-accent-blue text-sm hover:underline">
                    Lihat di KPK → elhkpn.kpk.go.id
                  </a>
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-400">
                    ℹ️ Data LHKPN adalah deklarasi mandiri. Pastikan cek langsung di situs KPK untuk data terkini dan terverifikasi.
                  </div>
                </>
              ) : (
                <div className="text-center py-10 text-text-secondary">
                  <div className="text-4xl mb-3">📄</div>
                  <p>Data LHKPN tidak tersedia untuk tokoh ini</p>
                </div>
              )}
            </Card>
          )}

          {/* BERITA */}
          {activeTab === 'berita' && (
            <div className="space-y-4">
              {personNews.some(a => a.source_id !== 'static') && (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/30">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs font-bold text-green-400">LIVE</span>
                  </span>
                  <span className="text-xs text-text-secondary">{personNews.length} artikel ditemukan</span>
                </div>
              )}
              {newsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-24 rounded-xl bg-bg-elevated border border-border animate-pulse" />
                  ))}
                </div>
              ) : personNews.length === 0 ? (
                <div className="text-center py-16 text-text-secondary">
                  <div className="text-5xl mb-4">📰</div>
                  <p className="font-medium">Belum ada berita untuk tokoh ini</p>
                </div>
              ) : (
                personNews.map(article => {
                  const isLiveArticle = article.source_id !== 'static'
                  const title = article.title || article.headline || ''
                  const excerpt = article.excerpt || article.summary || ''
                  return (
                    <a
                      key={article.id}
                      href={article.url || '#'}
                      target={article.url && article.url !== '#' ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="block p-4 rounded-xl border border-border bg-bg-card hover:border-accent-red/50 hover:bg-bg-elevated transition-all group"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent-red line-clamp-2 transition-colors leading-snug">{title}</h3>
                        {article.sentiment && (
                          <span className={`text-xs px-2 py-0.5 rounded font-medium flex-shrink-0 ${
                            article.sentiment === 'positif' ? 'text-green-400 bg-green-400/10' :
                            article.sentiment === 'negatif' ? 'text-red-400 bg-red-400/10' :
                            'text-gray-400 bg-gray-400/10'
                          }`}>
                            {article.sentiment === 'positif' ? '▲ Positif' : article.sentiment === 'negatif' ? '▼ Negatif' : '● Netral'}
                          </span>
                        )}
                      </div>
                      {excerpt && <p className="text-xs text-text-secondary line-clamp-2 mb-3">{excerpt}</p>}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-accent-blue">{article.source}</span>
                        <span className="text-xs text-text-secondary">{article.date}</span>
                        {isLiveArticle && <span className="text-xs font-medium text-green-400">● LIVE</span>}
                      </div>
                    </a>
                  )
                })
              )}
            </div>
          )}

          {/* AGENDA */}
          {activeTab === 'agenda' && (
            <div className="space-y-4">
              {personAgendas.length === 0 ? (
                <div className="text-center py-16 text-text-secondary">
                  <div className="text-5xl mb-4">📋</div>
                  <p className="font-medium">Belum ada agenda terpantau</p>
                </div>
              ) : (
                personAgendas.map(a => (
                  <Card key={a.id} className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="text-sm font-semibold text-text-primary">{a.title}</h4>
                      <Badge variant={STATUS_VARIANTS[a.status] || 'default'}>{a.status}</Badge>
                    </div>
                    <p className="text-xs text-text-secondary mb-2">{a.description}</p>
                    {a.budget_idr && <p className="text-xs text-accent-gold">💰 Anggaran: {formatIDR(a.budget_idr)}</p>}
                    {a.source && <p className="text-xs text-text-secondary mt-1">Sumber: {a.source}</p>}
                  </Card>
                ))
              )}
            </div>
          )}

          {/* VOTING */}
          {activeTab === 'voting' && <VotingTab person={person} />}

          {/* ANALISIS */}
          {activeTab === 'analisis' && (
            <div className="space-y-5">
              <Card className="p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Profil Karakter</h3>
                <CharacterRadar analysis={person.analysis} personName={person.name} />
              </Card>
              <Card className="p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Spektrum Ideologi</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-text-secondary mb-1">
                    <span>← Kiri</span>
                    <span>Tengah</span>
                    <span>Kanan →</span>
                  </div>
                  <div className="relative h-4 bg-gradient-to-r from-red-900 via-bg-elevated to-blue-900 rounded-full">
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-accent-red shadow-lg"
                      style={{ left: `calc(${((person.analysis?.ideology_score || 0) + 10) / 20 * 100}% - 8px)` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-text-secondary">
                    <span>-10</span>
                    <span className="font-medium text-text-primary">Skor: {person.analysis?.ideology_score ?? 'N/A'}</span>
                    <span>+10</span>
                  </div>
                </div>
              </Card>
              {person.analysis?.policy_direction && (
                <Card className="p-5">
                  <h3 className="text-sm font-semibold text-text-primary mb-2">Arah Kebijakan</h3>
                  <p className="text-text-secondary text-sm">{person.analysis.policy_direction}</p>
                </Card>
              )}
              {person.analysis?.track_record && (
                <Card className="p-5">
                  <h3 className="text-sm font-semibold text-text-primary mb-2">Track Record</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{person.analysis.track_record}</p>
                </Card>
              )}
              <div className="bg-bg-elevated border border-border rounded-lg p-3 text-xs text-text-secondary">
                📊 Analisis berdasarkan rekam jejak publik dan data pemilihan. Diperbarui secara berkala oleh tim analis PetaPolitik.
              </div>
            </div>
          )}

        </div>{/* end tab content */}

        {/* Sticky sidebar — hidden on mobile, shown on lg+ */}
        <div className="hidden lg:block w-64 flex-shrink-0 sticky top-4">
          <RingkasanSidebar
            person={person}
            party={party}
            personConnections={personConnections}
            navigate={navigate}
          />
        </div>

      </div>{/* end main area */}

      </div>{/* end profile-print-area */}

      {/* Tokoh Terkait */}
      {relatedPersons.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="text-sm font-semibold text-text-primary mb-3">👥 Tokoh Terkait</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {relatedPersons.map(p => (
              <Link key={p.id} to={`/persons/${p.id}`} className="flex-shrink-0 w-40">
                <PersonCard person={p} compact />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Berita Terkait */}
      <BeritaTerkait person={person} />
    </div>
  )
}
