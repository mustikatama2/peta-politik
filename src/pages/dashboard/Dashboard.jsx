import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import { PERSONS } from '../../data/persons'
import { PARTIES, PARTY_MAP, KIM_PARTIES } from '../../data/parties'
import { CONNECTIONS } from '../../data/connections'
import { PILEG_2024, PILPRES_2024 } from '../../data/elections'
import * as RegionsData from '../../data/regions'
import { NEWS } from '../../data/news'
import { AGENDAS } from '../../data/agendas'
import { KPK_CASES } from '../../data/kpk_cases'
import { TIMELINE_EVENTS } from '../../data/timeline_events'
import { QUICK_FACTS, CATEGORY_META } from '../../data/quick_facts'
import PersonCard from '../../components/PersonCard'
import NewsCard from '../../components/NewsCard'
import { KPICard, Card } from '../../components/ui'
import WatchlistAlerts from '../../components/WatchlistAlerts'
import QuickSearch from '../../components/QuickSearch'
import MetaTags from '../../components/MetaTags'
import { scoreAllPersons } from '../../lib/scoring'

// Safe fallback for PROVINCES (data agent may not have committed yet)
const PROVINCES = RegionsData.PROVINCES || []

const pillegData = [...PILEG_2024]
  .filter(d => d.seats > 0)
  .sort((a, b) => b.seats - a.seats)
  .map(d => ({
    name: PARTY_MAP[d.party_id]?.abbr || d.party_id,
    seats: d.seats,
    fill: PARTY_MAP[d.party_id]?.color || '#6B7280',
  }))

const pilpresData = PILPRES_2024.map(p => ({
  name: p.paslon,
  value: p.votes_pct,
}))
const PILPRES_COLORS = ['#8B0000', '#27AAE1', '#C8102E']

const atRiskPersons = PERSONS.filter(p =>
  ['tersangka', 'terpidana'].includes(p.analysis?.corruption_risk)
)

const KPK_CASES_COUNT = KPK_CASES.filter(c =>
  ['tersangka', 'terpidana'].includes(c.status)
).length

const recentTimelineEvents = [...TIMELINE_EVENTS]
  .sort((a, b) => new Date(`${b.year}-${b.month || 1}-${b.day || 1}`) - new Date(`${a.year}-${a.month || 1}-${a.day || 1}`))
  .slice(0, 5)

const staticRecentNews = [...NEWS]
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 6)

const kimSeats = KIM_PARTIES.reduce((sum, id) => {
  const p = PARTY_MAP[id]
  return sum + (p?.seats_2024 || 0)
}, 0)
const pdipSeats = PARTY_MAP['pdip']?.seats_2024 || 0

// Build Peta Kekuatan from PROVINCES data
function buildPetaKekuatan() {
  if (PROVINCES.length === 0) return null

  const partyCounts = {}
  PROVINCES.forEach(prov => {
    const pid = prov.governor_party_id
    if (pid) partyCounts[pid] = (partyCounts[pid] || 0) + 1
  })

  return Object.entries(partyCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([pid, count]) => ({
      pid,
      count,
      party: PARTY_MAP[pid],
      name: PARTY_MAP[pid]?.abbr || pid,
      fill: PARTY_MAP[pid]?.color || '#6B7280',
    }))
}

// ── Precomputed module-level data ──────────────────────────────────────────
const kpk2025Cases = KPK_CASES.filter(c => c.date_start?.startsWith('2025'))
const top5Persons  = scoreAllPersons().slice(0, 5)

// ── Bloomberg-style Live News Ticker ──────────────────────────────────────
function NewsTicker() {
  const [headlines, setHeadlines] = useState([])

  useEffect(() => {
    fetch('/api/news?limit=20')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.articles?.length) setHeadlines(data.articles)
      })
      .catch(() => {})
  }, [])

  if (!headlines.length) return null

  const text = headlines.map(a => `${a.source.toUpperCase()} · ${a.title}`).join('    ◆    ')

  return (
    <div className="bg-bg-elevated border-b border-border overflow-hidden py-2 mb-4">
      <div className="flex items-center gap-3">
        <span className="flex-shrink-0 px-3 text-xs font-bold text-accent-red border-r border-border flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-red animate-pulse" />LIVE
        </span>
        <div className="overflow-hidden flex-1">
          <div
            className="whitespace-nowrap text-xs text-text-secondary"
            style={{ animation: 'ticker 60s linear infinite' }}
          >
            {text}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Bloomberg Live Stats Bar ───────────────────────────────────────────────
function LiveStatsBar() {
  const kimPct = (kimSeats / 580 * 100).toFixed(1)

  const stats = [
    { label: '🇮🇩 CPI', value: '34/100', sub: 'Korupsi' },
    { label: 'DPR KIM+', value: `${kimPct}%`, sub: 'kursi' },
    { label: 'KPK Aktif', value: `${KPK_CASES_COUNT}`, sub: 'kasus' },
    { label: 'Tokoh Tersangka', value: `${atRiskPersons.length}`, sub: 'orang' },
    { label: 'Tokoh Dipetakan', value: `${PERSONS.length}`, sub: 'tokoh' },
    { label: 'Provinsi', value: `${PROVINCES.length || 38}`, sub: 'wilayah' },
  ]

  return (
    <div className="overflow-x-auto mb-6">
      <div className="flex items-center gap-0 rounded-xl border border-border bg-bg-card overflow-hidden min-w-[560px]">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`flex flex-col px-4 py-2.5 flex-1 min-w-[110px] ${i < stats.length - 1 ? 'border-r border-border' : ''}`}
          >
            <span className="text-[10px] text-text-secondary uppercase tracking-wider">{s.label}</span>
            <span className="text-base font-bold text-text-primary leading-tight">{s.value}</span>
            <span className="text-[10px] text-text-muted">{s.sub}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Trending Politicians ───────────────────────────────────────────────────
function TrendingPoliticians() {
  const [trending, setTrending] = useState([])

  useEffect(() => {
    fetch('/api/news?limit=100')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data?.articles) return
        const counts = {}
        data.articles.forEach(a => {
          ;(a.person_ids || []).forEach(id => {
            counts[id] = (counts[id] || 0) + 1
          })
        })
        const top = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([id, count]) => ({ person: PERSONS.find(p => p.id === id), count, id }))
          .filter(x => x.person)
        setTrending(top)
      })
      .catch(() => {})
  }, [])

  if (!trending.length) return null

  return (
    <div className="mb-6">
      <h2 className="text-base font-bold text-text-primary mb-3 flex items-center gap-2">
        🔥 Trending Hari Ini
        <span className="text-xs font-normal text-text-secondary">berdasarkan sebutan di media</span>
      </h2>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {trending.map(({ person, count, id }) => {
          const party = PARTY_MAP[person.party_id]
          return (
            <Link
              key={id}
              to={`/persons/${id}`}
              className="flex flex-col items-center gap-1 p-2 rounded-lg border border-border hover:border-accent-red/50 bg-bg-card transition-all group text-center"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white overflow-hidden"
                style={{ background: party?.color || '#374151' }}
              >
                {person.photo_url
                  ? <img src={person.photo_url} alt={person.name} className="w-10 h-10 rounded-full object-cover" onError={e => { e.target.style.display = 'none' }} />
                  : person.photo_placeholder
                }
              </div>
              <span className="text-xs text-text-primary group-hover:text-accent-red line-clamp-1">{person.name.split(' ')[0]}</span>
              <span className="text-xs font-bold text-accent-red">{count}×</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

// ── Coalition Power Meter ─────────────────────────────────────────────────
function CoalitionMeter() {
  const KIM_IDS = ['ger', 'gol', 'nas', 'pan', 'dem', 'pks', 'pbb', 'pkb']
  const cKimSeats = KIM_IDS.reduce((s, id) => s + (PARTY_MAP[id]?.seats_2024 || 0), 0)
  const cPdipSeats = PARTY_MAP['pdip']?.seats_2024 || 0
  const total = 580
  const kimPct = (cKimSeats / total * 100).toFixed(1)
  const pdipPct = (cPdipSeats / total * 100).toFixed(1)

  return (
    <div className="p-4 rounded-xl border border-border bg-bg-card mb-6">
      <h3 className="text-sm font-bold text-text-primary mb-3">⚖️ Peta Kekuatan DPR</h3>
      <div className="flex rounded-full overflow-hidden h-6 mb-2">
        <div
          className="bg-red-600 flex items-center justify-center text-xs font-bold text-white transition-all"
          style={{ width: `${kimPct}%` }}
        >
          KIM+ {kimPct}%
        </div>
        <div
          className="bg-red-900 flex items-center justify-center text-xs font-bold text-white transition-all"
          style={{ width: `${pdipPct}%` }}
        >
          PDIP {pdipPct}%
        </div>
        <div className="bg-bg-elevated flex-1 flex items-center justify-center text-xs text-text-secondary">
          Lainnya
        </div>
      </div>
      <div className="flex justify-between text-xs text-text-secondary">
        <span>KIM Plus: {cKimSeats} kursi</span>
        <span>Total DPR: {total} kursi</span>
        <span>PDIP: {cPdipSeats} kursi</span>
      </div>
    </div>
  )
}

// ── Live Recent News ──────────────────────────────────────────────────────
function LiveRecentNews() {
  const [articles, setArticles] = useState(staticRecentNews)
  const [live, setLive] = useState(false)

  useEffect(() => {
    fetch('/api/news?limit=6')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.articles?.length) {
          setArticles(data.articles)
          setLive(true)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <Card className="p-5">
      <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
        📰 Berita Terkini
        {live && (
          <span className="flex items-center gap-1 text-[10px] font-medium text-accent-red">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-red animate-pulse" />
            LIVE
          </span>
        )}
      </h2>
      <div className="space-y-3">
        {articles.map((article, i) => (
          <NewsCard key={article.id || i} article={article} />
        ))}
      </div>
    </Card>
  )
}

// ── Fakta Hari Ini ────────────────────────────────────────────────────────
function FaktaHariIni() {
  // Seed by date string → deterministic daily rotation
  const dateStr = new Date().toDateString()
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0
  }
  const highImportance = QUICK_FACTS.filter(f => f.importance === 'high')
  const fact = highImportance[hash % highImportance.length] || QUICK_FACTS[0]
  const meta = CATEGORY_META[fact.category] || { color: '#6B7280', bg: '#F3F4F6', icon: '📌' }

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          ⚡ Fakta Hari Ini
        </h2>
        <Link to="/quick-facts" className="text-xs text-accent-blue hover:underline whitespace-nowrap">
          Lihat semua fakta →
        </Link>
      </div>
      <div className="p-4 rounded-xl border border-border bg-bg-elevated">
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold mb-2"
          style={{ background: meta.bg, color: meta.color }}
        >
          {meta.icon} {fact.category}
        </span>
        <p className="text-sm text-text-primary leading-relaxed">{fact.fact}</p>
        <p className="text-[11px] text-text-muted mt-2">📌 {fact.source}</p>
      </div>
    </Card>
  )
}

// ── Tokoh Terpanas Minggu Ini ─────────────────────────────────────────────
const hotPersonsData = (() => {
  const scored = scoreAllPersons()
  const agendaCounts = {}
  AGENDAS.forEach(a => {
    if (a.subject_type === 'person' && a.subject_id) {
      agendaCounts[a.subject_id] = (agendaCounts[a.subject_id] || 0) + 1
    }
  })
  // Combined heat score: power score + 2× agenda count
  return scored
    .map(p => ({
      ...p,
      agendas: agendaCounts[p.id] || 0,
      heat: p.total + (agendaCounts[p.id] || 0) * 2,
    }))
    .sort((a, b) => b.heat - a.heat)
    .slice(0, 3)
    .map(p => ({ ...p, person: PERSONS.find(x => x.id === p.id) }))
    .filter(x => x.person)
})()

function flameBar(score, max) {
  const pct = Math.min(score / max, 1)
  if (pct > 0.8) return '🔥🔥🔥'
  if (pct > 0.5) return '🔥🔥'
  return '🔥'
}

function TokohTerpanas() {
  const maxHeat = hotPersonsData[0]?.heat || 1

  if (!hotPersonsData.length) return null

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          🔥 Tokoh Terpanas Minggu Ini
          <span className="text-xs font-normal text-text-secondary">skor kekuasaan + agenda aktif</span>
        </h2>
        <Link to="/ranking" className="text-xs text-accent-blue hover:underline">Ranking lengkap →</Link>
      </div>
      <div className="space-y-3">
        {hotPersonsData.map(({ person, heat, agendas, total }, rank) => {
          const party = PARTY_MAP[person.party_id]
          const flames = flameBar(heat, maxHeat)
          return (
            <Link
              key={person.id}
              to={`/persons/${person.id}`}
              className="flex items-center gap-3 p-3 rounded-xl border border-border bg-bg-elevated hover:border-accent-red/50 transition-all group"
            >
              {/* Rank medal */}
              <span className="w-6 text-center text-base flex-shrink-0">
                {rank === 0 ? '🥇' : rank === 1 ? '🥈' : '🥉'}
              </span>
              {/* Avatar */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 overflow-hidden"
                style={{ background: party?.color || '#374151' }}
              >
                {person.photo_url ? (
                  <img
                    src={person.photo_url}
                    alt={person.name}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={e => { e.target.style.display = 'none' }}
                  />
                ) : (
                  person.photo_placeholder || person.name[0]
                )}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary group-hover:text-accent-red truncate">
                  {person.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  {party && (
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: (party.color || '#374151') + '20', color: party.color || '#9CA3AF' }}
                    >
                      {party.abbr}
                    </span>
                  )}
                  <span className="text-[10px] text-text-muted">{agendas} agenda aktif</span>
                </div>
              </div>
              {/* Heat score + flames */}
              <div className="text-right flex-shrink-0">
                <span className="text-sm">{flames}</span>
                <p className="text-xs font-bold text-accent-red">{heat}</p>
                <p className="text-[10px] text-text-muted">heat score</p>
              </div>
            </Link>
          )
        })}
      </div>
    </Card>
  )
}

// ── Koneksi Terbaru ───────────────────────────────────────────────────────
const recentConnections = [...CONNECTIONS].slice(-10).reverse()

function KoneksiTerbaru() {
  const typeColors = {
    koalisi:        '#3B82F6',
    keluarga:       '#F59E0B',
    konflik:        '#DC2626',
    bisnis:         '#10B981',
    rival:          '#EF4444',
    kolega:         '#64748B',
    rekan:          '#6B7280',
    'mentor-murid': '#8B5CF6',
    'mantan-koalisi':'#D97706',
    'atasan-bawahan':'#0EA5E9',
    ideologi:       '#7C3AED',
    oposisi:        '#B91C1C',
  }

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          🕸️ Koneksi Terbaru
          <span className="text-xs font-normal text-text-secondary">10 koneksi terbaru</span>
        </h2>
        <Link to="/network" className="text-xs text-accent-blue hover:underline">Lihat jaringan →</Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {recentConnections.map((conn, i) => {
          const fromPerson = PERSONS.find(p => p.id === conn.from)
          const toPerson   = PERSONS.find(p => p.id === conn.to)
          const color      = typeColors[conn.type] || '#6B7280'
          const fromName   = fromPerson ? fromPerson.name.split(' ')[0] : conn.from
          const toName     = toPerson   ? toPerson.name.split(' ')[0]   : conn.to
          return (
            <Link
              key={i}
              to="/network"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border text-xs font-medium hover:opacity-80 transition-opacity"
              style={{ borderColor: color + '60', backgroundColor: color + '15', color }}
              title={conn.label}
            >
              <span className="font-semibold">{fromName}</span>
              <span className="opacity-60">→</span>
              <span className="font-semibold">{toName}</span>
            </Link>
          )
        })}
      </div>
    </Card>
  )
}

// ── Angka Kunci Strip ─────────────────────────────────────────────────────
function AngkaKunci() {
  const stats = [
    { label: 'Total Tokoh',        value: PERSONS.length,    icon: '👥', color: '#3B82F6' },
    { label: 'Total Koneksi',      value: CONNECTIONS.length, icon: '🕸️', color: '#10B981' },
    { label: 'Kasus KPK',          value: KPK_CASES_COUNT,   icon: '⚖️', color: '#EF4444' },
    { label: 'Anggaran Dipotong',  value: 'Rp 306T',         icon: '✂️', color: '#F59E0B' },
    { label: 'Pilkada Daerah',     value: '545',             icon: '🗳️', color: '#8B5CF6' },
    { label: 'Partai DPR',         value: '8',               icon: '🏛️', color: '#EC4899' },
  ]

  return (
    <div className="overflow-x-auto mb-2">
      <div className="flex gap-3 pb-1 min-w-max">
        {stats.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-bg-card whitespace-nowrap"
          >
            <span className="text-lg">{s.icon}</span>
            <div>
              <p className="text-base font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] text-text-muted">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── E. Alert Banner ───────────────────────────────────────────────────────
function AlertBanner() {
  const berlangsung = AGENDAS.filter(a => a.status === 'berlangsung')
  if (!berlangsung.length && !kpk2025Cases.length) return null

  return (
    <div className="space-y-2">
      {berlangsung.map(a => (
        <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/40 text-sm">
          <span className="flex items-center gap-1.5 text-red-400 font-bold text-xs flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            BERLANGSUNG
          </span>
          <span className="text-text-primary truncate">{a.title}</span>
          <Link to="/agendas" className="ml-auto text-xs text-red-400 hover:underline whitespace-nowrap flex-shrink-0">Detail →</Link>
        </div>
      ))}
      {kpk2025Cases.length > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/40 text-sm">
          <span className="text-amber-400 font-bold text-xs flex-shrink-0">
            ⚠️ {kpk2025Cases.length} kasus KPK baru di 2025
          </span>
          <span className="text-text-secondary text-xs hidden sm:block">Termasuk Tom Lembong, Hasto Kristiyanto, dan lainnya</span>
          <Link to="/kpk" className="ml-auto text-xs text-amber-400 hover:underline whitespace-nowrap flex-shrink-0">Lihat →</Link>
        </div>
      )}
    </div>
  )
}

// ── A. Agenda Mendatang ────────────────────────────────────────────────────
function HariIniDiPolitik() {
  const agendas = [
    ...AGENDAS.filter(a => a.status === 'berlangsung'),
    ...AGENDAS.filter(a => a.status === 'mendatang').sort((a, b) => (a.year || 0) - (b.year || 0)),
    ...AGENDAS.filter(a => a.status === 'proses' && a.year >= 2025).sort((a, b) => (b.year || 0) - (a.year || 0)),
  ].slice(0, 5)

  const statusCfg = {
    berlangsung: { color: '#EF4444', label: '🔴 Live',      bg: '#EF444420' },
    mendatang:   { color: '#8B5CF6', label: '🟣 Mendatang', bg: '#8B5CF620' },
    proses:      { color: '#F59E0B', label: '🟡 Proses',    bg: '#F59E0B20' },
  }

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          📅 Agenda Mendatang
        </h2>
        <Link to="/agendas" className="text-xs text-accent-blue hover:underline">Semua agenda →</Link>
      </div>
      {agendas.length === 0 ? (
        <p className="text-text-secondary text-sm py-2 text-center">Tidak ada agenda terjadwal</p>
      ) : (
        <div className="space-y-2">
          {agendas.map(a => {
            const person = a.subject_type === 'person' ? PERSONS.find(p => p.id === a.subject_id) : null
            const cfg = statusCfg[a.status] || { color: '#6B7280', label: a.status, bg: '#6B728020' }
            return (
              <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl border border-border bg-bg-elevated hover:border-accent-blue/40 transition-colors">
                <div className="flex-shrink-0 text-center min-w-[42px]">
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded font-bold block"
                    style={{ background: cfg.bg, color: cfg.color }}
                  >
                    {a.year}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text-primary leading-snug">{a.title}</p>
                  {person && (
                    <Link to={`/persons/${person.id}`} className="text-[10px] text-accent-blue hover:underline mt-0.5 block">
                      👤 {person.name}
                    </Link>
                  )}
                </div>
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 whitespace-nowrap"
                  style={{ background: cfg.bg, color: cfg.color }}
                >
                  {cfg.label}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}

// ── B. DB Stats Strip (clickable) ─────────────────────────────────────────
function DBStatsStrip() {
  const stats = [
    { label: 'Tokoh',     value: PERSONS.length,         icon: '👥', to: '/persons' },
    { label: 'Koneksi',   value: CONNECTIONS.length,     icon: '🕸️', to: '/network' },
    { label: 'Partai',    value: PARTIES.length,         icon: '🎭', to: '/parties' },
    { label: 'Kasus KPK', value: KPK_CASES.length,       icon: '⚖️', to: '/kpk' },
    { label: 'Agenda',    value: AGENDAS.length,         icon: '📋', to: '/agendas' },
    { label: 'Peristiwa', value: TIMELINE_EVENTS.length, icon: '📅', to: '/timeline' },
  ]

  return (
    <div className="overflow-x-auto">
      <div className="flex rounded-xl border border-border bg-bg-card overflow-hidden min-w-[480px]">
        {stats.map((s, i) => (
          <Link
            key={s.to}
            to={s.to}
            className={`flex flex-col items-center px-3 py-3 flex-1 min-w-[80px] hover:bg-bg-elevated transition-colors ${i < stats.length - 1 ? 'border-r border-border' : ''}`}
          >
            <span className="text-xl mb-1">{s.icon}</span>
            <span className="text-xl font-bold text-text-primary">{s.value}</span>
            <span className="text-[10px] text-text-muted mt-0.5 text-center">{s.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

// ── C. Berita Paling Relevan ──────────────────────────────────────────────
function BeritaPalingRelevan() {
  const topNews = [...NEWS].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3)

  const sentimentCfg = {
    positif: { color: '#10B981', label: 'Positif' },
    negatif: { color: '#EF4444', label: 'Negatif' },
    netral:  { color: '#6B7280', label: 'Netral'  },
  }

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-text-primary">📰 Berita Paling Relevan</h2>
        <Link to="/news" className="text-xs text-accent-blue hover:underline">Lihat semua →</Link>
      </div>
      <div className="space-y-3">
        {topNews.map((article, i) => {
          const cfg = sentimentCfg[article.sentiment] || sentimentCfg.netral
          const headline = article.headline.length > 80
            ? article.headline.slice(0, 80) + '…'
            : article.headline
          return (
            <div key={article.id || i} className="p-3 rounded-xl border border-border bg-bg-elevated">
              <p className="text-sm font-medium text-text-primary leading-snug">{headline}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded border border-border text-text-muted bg-bg-card">
                  {article.source}
                </span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded font-medium"
                  style={{ background: cfg.color + '20', color: cfg.color }}
                >
                  {cfg.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

// ── D. Power Rankings Preview ─────────────────────────────────────────────
function PowerRankingsPreview() {
  const maxScore = top5Persons[0]?.total || 100

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-text-primary">🏆 Power Rankings</h2>
        <Link to="/ranking" className="text-xs text-accent-blue hover:underline">Lihat ranking lengkap →</Link>
      </div>
      <div className="space-y-1">
        {top5Persons.map((p, i) => {
          const party = PARTY_MAP[p.party_id]
          const pctWidth = `${(p.total / maxScore) * 100}%`
          return (
            <Link
              key={p.id}
              to={`/persons/${p.id}`}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-bg-elevated transition-colors group"
            >
              <span className="w-6 text-center text-sm font-bold text-text-muted flex-shrink-0">#{i + 1}</span>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: party?.color || '#374151' }}
              >
                {p.photo_placeholder || p.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-text-primary group-hover:text-accent-red truncate">{p.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex-1 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: pctWidth, background: party?.color || '#3B82F6' }}
                    />
                  </div>
                  <span className="text-[10px] text-text-muted flex-shrink-0 w-6 text-right">{p.total}</span>
                </div>
              </div>
              {party && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{ background: (party.color || '#374151') + '20', color: party.color || '#9CA3AF' }}
                >
                  {party.abbr}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </Card>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  const jatimPersons = PERSONS.filter(p => p.region_id === 'jawa-timur')
  const petaKekuatan = buildPetaKekuatan()

  // Koalisi KIM Plus province count
  const KIM_PROVINCE_COUNT = petaKekuatan
    ? petaKekuatan.filter(p => KIM_PARTIES.includes(p.pid)).reduce((sum, p) => sum + p.count, 0)
    : null

  return (
    <div className="space-y-6">
      <MetaTags title="Dashboard" description="Ringkasan intelijen politik Indonesia — tokoh, partai, koalisi, dan berita terkini" />

      {/* ── E. Alert Banner (conditional) ── */}
      <AlertBanner />

      {/* ── Live News Ticker ── */}
      <NewsTicker />

      {/* ── Bloomberg Stats Bar ── */}
      <LiveStatsBar />

      {/* ── Watchlist Alerts ── */}
      <WatchlistAlerts />

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-bg-card to-bg-elevated border border-border rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-text-primary">
              Selamat datang, {user?.name || 'Analis'} 👋
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              Platform pemantauan transparansi &amp; akuntabilitas politik Indonesia
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <QuickSearch />
            <span className="text-text-secondary text-sm whitespace-nowrap">{today}</span>
          </div>
        </div>
      </div>

      {/* CPI Transparency Banner */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm">
        <span className="text-amber-600 text-lg flex-shrink-0">📊</span>
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-amber-800">Indeks Persepsi Korupsi Indonesia 2023: </span>
          <span className="text-amber-700">34/100 (Peringkat 115 dari 180 negara) — </span>
          <span className="text-amber-600">Menurun dari skor 40 pada 2019</span>
        </div>
        <span className="ml-auto text-xs text-amber-500 flex-shrink-0 hidden sm:block">Transparency International</span>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-bg-card rounded-xl border border-border p-3 text-center">
          <p className="text-2xl font-bold text-text-primary">{PERSONS.length}</p>
          <p className="text-xs text-text-secondary">Tokoh Terpetakan</p>
        </div>
        <div className="bg-bg-card rounded-xl border border-border p-3 text-center">
          <p className="text-2xl font-bold text-text-primary">{CONNECTIONS.length}</p>
          <p className="text-xs text-text-secondary">Koneksi</p>
        </div>
        <div className="bg-bg-card rounded-xl border border-border p-3 text-center">
          <p className="text-2xl font-bold text-text-primary">{PROVINCES.length}</p>
          <p className="text-xs text-text-secondary">Provinsi</p>
        </div>
        <div className="bg-bg-card rounded-xl border border-border p-3 text-center">
          <p className="text-2xl font-bold text-text-primary">{KPK_CASES_COUNT}</p>
          <p className="text-xs text-text-secondary">Kasus KPK Aktif</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-bg-card rounded-xl border border-border border-t-4 p-5" style={{ borderTopColor: '#3B82F6' }}>
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">Total Tokoh</p>
          <p className="text-3xl font-bold text-blue-400">{PERSONS.length}</p>
          <p className="text-xs text-text-secondary mt-1">Dipantau</p>
        </div>
        <div className="bg-bg-card rounded-xl border border-border border-t-4 p-5" style={{ borderTopColor: '#FFD700' }}>
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">Total Partai</p>
          <p className="text-3xl font-bold text-yellow-400">18</p>
          <p className="text-xs text-text-secondary mt-1">Pemilu 2024</p>
        </div>
        <div className="bg-bg-card rounded-xl border border-border border-t-4 p-5" style={{ borderTopColor: '#10B981' }}>
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">Total Koneksi</p>
          <p className="text-3xl font-bold text-green-400">{CONNECTIONS.length}</p>
          <p className="text-xs text-text-secondary mt-1">Relasi terpetakan</p>
        </div>
        <div className="bg-bg-card rounded-xl border border-border border-t-4 p-5" style={{ borderTopColor: '#EF4444' }}>
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">Perlu Perhatian</p>
          <p className="text-3xl font-bold text-red-400 flex items-center gap-2">
            {atRiskPersons.length}
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
          </p>
          <p className="text-xs text-text-secondary mt-1">Tersangka/Terpidana</p>
        </div>
      </div>

      {/* ── Angka Kunci Strip ── */}
      <AngkaKunci />

      {/* ── B. DB Stats Strip (clickable → relevant pages) ── */}
      <DBStatsStrip />

      {/* ── Fakta Hari Ini + Tokoh Terpanas ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FaktaHariIni />
        <TokohTerpanas />
      </div>

      {/* ── A/C/D. Agenda + Berita + Rankings ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <HariIniDiPolitik />
        <BeritaPalingRelevan />
        <PowerRankingsPreview />
      </div>

      {/* ── Koneksi Terbaru ── */}
      <KoneksiTerbaru />

      {/* ── Trending Politicians ── */}
      <TrendingPoliticians />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-4">📊 Pileg DPR 2024 — Kursi Partai</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={pillegData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E2235', border: '1px solid #2D3748', borderRadius: 8 }}
                labelStyle={{ color: '#E5E7EB' }}
                itemStyle={{ color: '#9CA3AF' }}
              />
              <Bar dataKey="seats" name="Kursi" radius={[4, 4, 0, 0]}>
                {pillegData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-4">🗳️ Pilpres 2024</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={pilpresData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
                label={({ value }) => `${value}%`}
                labelLine={false}
              >
                {pilpresData.map((_, i) => (
                  <Cell key={i} fill={PILPRES_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1E2235', border: '1px solid #2D3748', borderRadius: 8 }}
                formatter={(v) => `${v}%`}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">
            {pilpresData.map((p, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: PILPRES_COLORS[i] }} />
                <span className="text-text-secondary truncate">{p.name}</span>
                <span className="ml-auto font-medium text-text-primary">{p.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Peta Kekuatan ────────────────────────────────────────────────────── */}
      {petaKekuatan && petaKekuatan.length > 0 ? (
        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h2 className="text-sm font-semibold text-text-primary">🗺️ Peta Kekuatan — Gubernur per Partai (38 Provinsi)</h2>
            <Link to="/regions" className="text-xs text-accent-blue hover:underline">Lihat detail →</Link>
          </div>

          {/* Koalisi headline */}
          {KIM_PROVINCE_COUNT !== null && (
            <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-xs text-text-secondary">Koalisi Prabowo (KIM Plus)</p>
                  <p className="text-xl font-bold text-blue-400">{KIM_PROVINCE_COUNT} dari 38 provinsi</p>
                </div>
                <div className="flex-1 h-3 bg-bg-elevated rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(KIM_PROVINCE_COUNT / 38) * 100}%`, backgroundColor: '#3B82F6' }}
                  />
                </div>
                <div className="text-right">
                  <p className="text-xs text-text-secondary">PDI-P</p>
                  <p className="text-xl font-bold text-red-400">
                    {petaKekuatan.find(p => p.pid === 'pdip')?.count || 0} provinsi
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bar chart of party province counts */}
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={petaKekuatan}
              margin={{ top: 0, right: 10, left: -20, bottom: 0 }}
              layout="vertical"
            >
              <XAxis type="number" tick={{ fill: '#9CA3AF', fontSize: 10 }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 10 }} width={60} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E2235', border: '1px solid #2D3748', borderRadius: 8 }}
                formatter={(v) => [v, 'Provinsi']}
              />
              <Bar dataKey="count" name="Provinsi" radius={[0, 4, 4, 0]}>
                {petaKekuatan.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Legend chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            {petaKekuatan.map(({ pid, count, party }) => (
              <div
                key={pid}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border"
                style={{
                  borderColor: (party?.color || '#6B7280') + '50',
                  backgroundColor: (party?.color || '#6B7280') + '12',
                  color: party?.color || '#9CA3AF'
                }}
              >
                <span>{party?.logo_emoji || '🏛️'}</span>
                <span>{party?.abbr || pid}</span>
                <span className="font-bold">{count}×</span>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        /* Placeholder when PROVINCES data not yet available */
        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h2 className="text-sm font-semibold text-text-primary">🗺️ Peta Kekuatan — 38 Provinsi</h2>
            <Link to="/regions" className="text-xs text-accent-blue hover:underline">Lihat detail →</Link>
          </div>
          <div className="p-6 text-center border border-dashed border-border rounded-lg">
            <div className="text-3xl mb-2">🏗️</div>
            <p className="text-sm text-text-secondary">Data kekuatan provinsi sedang disiapkan.</p>
            <p className="text-xs text-text-muted mt-1">Akan menampilkan distribusi gubernur per partai di 38 provinsi.</p>
          </div>
        </Card>
      )}

      {/* ── Coalition Power Meter (Bloomberg style) ── */}
      <CoalitionMeter />

      {/* At-Risk + Live Recent News */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-4">⚠️ Perlu Perhatian</h2>
          {atRiskPersons.length === 0 ? (
            <p className="text-text-secondary text-sm">Tidak ada tokoh berisiko tinggi.</p>
          ) : (
            <div className="space-y-3">
              {atRiskPersons.map(p => (
                <div key={p.id} className="border-l-2 border-red-500 pl-3">
                  <PersonCard person={p} />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* ── Live Recent News ── */}
        <LiveRecentNews />
      </div>

      {/* Legacy Koalisi Bar (kept for detail) — hidden on mobile */}
      <Card className="p-5 hidden md:block">
        <h2 className="text-sm font-semibold text-text-primary mb-4">🏛️ Koalisi Indonesia Maju Plus</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {KIM_PARTIES.map(pid => {
            const p = PARTY_MAP[pid]
            if (!p) return null
            return (
              <div
                key={pid}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border"
                style={{ borderColor: p.color + '60', backgroundColor: p.color + '15', color: p.color }}
              >
                <span>{p.logo_emoji}</span>
                <span>{p.abbr}</span>
                {p.seats_2024 > 0 && <span className="opacity-70">({p.seats_2024})</span>}
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-4">
          <div>
            <p className="text-text-secondary text-xs mb-1">KIM Plus (DPR)</p>
            <p className="text-xl font-bold text-blue-400">{kimSeats} kursi</p>
          </div>
          <div className="flex-1 h-4 bg-bg-elevated rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${(kimSeats / 580) * 100}%` }}
            />
          </div>
          <div className="text-right">
            <p className="text-text-secondary text-xs mb-1">PDIP (Oposisi)</p>
            <p className="text-xl font-bold text-red-400">{pdipSeats} kursi</p>
          </div>
        </div>
        <p className="text-xs text-text-secondary mt-2">Total 580 kursi DPR RI</p>
      </Card>

      {/* Jatim / National Spotlight */}
      <Card className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-text-primary mb-1">🗺️ Peta Wilayah Indonesia</h2>
            <div className="flex flex-wrap gap-4 text-sm mt-2">
              <span className="text-text-secondary">
                <span className="text-text-primary font-semibold">38</span> provinsi terpetakan
              </span>
              <span className="text-text-secondary">
                <span className="text-text-primary font-semibold">{jatimPersons.length}</span> tokoh Jatim
              </span>
              <span className="text-text-secondary">
                <span className="text-text-primary font-semibold">38</span> kab/kota Jatim
              </span>
            </div>
          </div>
          <Link
            to="/regions"
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent-red hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Lihat Peta Wilayah →
          </Link>
        </div>
      </Card>

      {/* Recent Updates Feed */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-text-primary">📅 Peristiwa Terkini</h2>
          <Link to="/timeline" className="text-xs text-accent-blue hover:underline">Semua →</Link>
        </div>
        <div className="space-y-3">
          {recentTimelineEvents.map(evt => (
            <div key={evt.id} className="flex gap-3 items-start">
              <div className="flex-shrink-0 text-xs text-text-secondary bg-bg-elevated px-2 py-1 rounded font-mono min-w-[52px] text-center">
                {evt.year}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary leading-snug">{evt.title}</p>
                <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">{evt.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Aksi Cepat */}
        <div className="mt-5 pt-4 border-t border-border">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">⚡ Aksi Cepat</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Cari Tokoh',      icon: '👤', path: '/persons' },
              { label: 'Lihat Jaringan',  icon: '🕸️', path: '/network' },
              { label: 'Bandingkan',      icon: '⚖️', path: '/compare' },
              { label: 'Analitik',        icon: '📈', path: '/analitik' },
              { label: 'KPK Cases',       icon: '🔍', path: '/kpk' },
              { label: 'Linimasa',        icon: '📅', path: '/timeline' },
              { label: 'Skenario 2029',   icon: '🔮', path: '/scenarios' },
              { label: 'Risiko Provinsi', icon: '🚨', path: '/regions' },
            ].map(a => (
              <Link
                key={a.path}
                to={a.path}
                className="bg-bg-elevated border border-border rounded-xl p-3 text-center hover:border-accent-red transition-colors"
              >
                <div className="text-2xl mb-1">{a.icon}</div>
                <p className="text-xs text-text-secondary">{a.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
