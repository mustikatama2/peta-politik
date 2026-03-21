import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { PageHeader, Card, Badge, KPICard, Avatar } from '../../components/ui'
import { KABINET_MERAH_PUTIH, KABINET_CATEGORIES } from '../../data/cabinet'
import { PERSONS, PERSONS_MAP } from '../../data/persons'
import { PARTY_MAP } from '../../data/parties'

// ── Helpers ───────────────────────────────────────────────────────────────────
function getPartyColor(party_id) {
  if (!party_id) return '#6b7280'
  return PARTY_MAP[party_id]?.color || '#6b7280'
}

function getPartyLabel(party_id) {
  if (!party_id) return 'Profesional'
  return PARTY_MAP[party_id]?.abbr || party_id.toUpperCase()
}

function getInitials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
}

// ── Minister Card ─────────────────────────────────────────────────────────────
function MenteriCard({ menteri }) {
  const party    = menteri.party_id ? PARTY_MAP[menteri.party_id] : null
  const partyColor = getPartyColor(menteri.party_id)
  const partyLabel = getPartyLabel(menteri.party_id)
  const person   = PERSONS_MAP?.[menteri.id]
  const photoUrl = person?.photo_url || menteri.photo_url || null

  return (
    <Card
      className="p-4 flex flex-col gap-3 hover:border-border-strong transition-all group"
      colorLeft={partyColor}
    >
      {/* Avatar + name */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={menteri.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-border"
            />
          ) : (
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm border-2"
              style={{ backgroundColor: partyColor, borderColor: partyColor + '80' }}
            >
              {getInitials(menteri.name)}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-text-primary font-semibold text-sm leading-snug truncate">{menteri.name}</h3>
          <p className="text-text-secondary text-xs leading-snug mt-0.5 line-clamp-2">{menteri.position}</p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        <Badge color="#374151" className="text-[10px]">
          🏛️ {menteri.ministry}
        </Badge>
        <Badge color={partyColor} className="text-[10px]">
          {party ? `${party.logo_emoji || '🎭'} ${partyLabel}` : `⭕ ${partyLabel}`}
        </Badge>
        {menteri.since && (
          <Badge color="#1e40af" className="text-[10px]">
            📅 {menteri.since.slice(0, 7)}
          </Badge>
        )}
      </div>

      {/* Notable info */}
      {menteri.notable && (
        <p className="text-text-secondary text-[11px] leading-relaxed line-clamp-3 border-t border-border pt-2">
          {menteri.notable}
        </p>
      )}

      {/* Lihat Profil button */}
      {person && (
        <Link
          to={`/persons/${menteri.id}`}
          className="mt-auto text-xs text-red-400 hover:text-red-300 hover:underline transition-colors self-start"
        >
          Lihat Profil →
        </Link>
      )}
    </Card>
  )
}

// ── Party Composition Chart ───────────────────────────────────────────────────
const RADIAN = Math.PI / 180
function CustomPieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) {
  if (percent < 0.04) return null
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight="bold">
      {name}
    </text>
  )
}

function PartyCompositionChart({ data }) {
  return (
    <Card className="p-4">
      <h3 className="text-text-primary font-semibold text-sm mb-4">⚖️ Komposisi Partai di Kabinet</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Pie chart */}
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={110}
              dataKey="value"
              labelLine={false}
              label={CustomPieLabel}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(val, name) => [`${val} posisi`, name]}
              contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Legend
              formatter={(value) => <span style={{ fontSize: 11, color: '#9ca3af' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Bar chart */}
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#9ca3af' }} width={70} />
            <Tooltip
              formatter={(val) => [`${val} posisi`]}
              contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`bar-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function KabinetPage() {
  const [activeCategory, setActiveCategory] = useState('semua')

  // Exclude Presiden/Wapres from minister count for KPIs
  const ministers = KABINET_MERAH_PUTIH.filter(m => m.category !== 'kepresidenan')

  const totalMenteri     = ministers.length
  const dariParpol       = ministers.filter(m => m.party_id !== null).length
  const profesional      = ministers.filter(m => m.party_id === null).length
  const pctParpol        = Math.round((dariParpol / totalMenteri) * 100)
  const pctProfesional   = Math.round((profesional / totalMenteri) * 100)

  // Filtered list
  const filtered = useMemo(() => {
    if (activeCategory === 'semua') return KABINET_MERAH_PUTIH
    return KABINET_MERAH_PUTIH.filter(m => m.category === activeCategory)
  }, [activeCategory])

  // Party composition
  const partyData = useMemo(() => {
    const counts = {}
    ministers.forEach(m => {
      const key = m.party_id || '__profesional__'
      counts[key] = (counts[key] || 0) + 1
    })
    return Object.entries(counts)
      .map(([key, value]) => {
        if (key === '__profesional__') {
          return { name: 'Profesional', value, color: '#6b7280' }
        }
        const p = PARTY_MAP[key]
        return {
          name: p?.abbr || key.toUpperCase(),
          value,
          color: p?.color || '#6b7280',
        }
      })
      .sort((a, b) => b.value - a.value)
  }, [ministers])

  return (
    <div className="space-y-6">
      {/* ── Hero Header ───────────────────────────────────────────────────────── */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-red-900/80 via-bg-card to-bg-card border border-border p-6 md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(185,28,28,0.15)_0%,_transparent_60%)]" />
        <div className="relative">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                🏛️ Kabinet Merah Putih
              </h1>
              <p className="text-white/60 mt-1 text-sm md:text-base">
                Prabowo–Gibran • 20 Oktober 2024 – Sekarang
              </p>
              <p className="text-white/40 text-xs mt-2">
                Kabinet ke-8 Republik Indonesia · {KABINET_MERAH_PUTIH.length} posisi terdaftar
              </p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full bg-red-900/50 border border-red-700/50 text-red-300 text-xs font-medium">
                🦅 Gerindra
              </span>
              <span className="px-3 py-1 rounded-full bg-yellow-900/30 border border-yellow-700/50 text-yellow-300 text-xs font-medium">
                🌾 Golkar
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-900/30 border border-blue-700/50 text-blue-300 text-xs font-medium">
                🌙 PKB
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          label="Total Posisi"
          value={KABINET_MERAH_PUTIH.length}
          sub={`${ministers.length} menteri/setingkat`}
          icon="🏛️"
          color="red"
        />
        <KPICard
          label="Dari Partai Politik"
          value={dariParpol}
          sub={`${pctParpol}% dari total menteri`}
          icon="🎭"
          color="yellow"
        />
        <KPICard
          label="Profesional / Non-Parpol"
          value={profesional}
          sub={`${pctProfesional}% teknokrat`}
          icon="⭕"
          color="blue"
        />
        <KPICard
          label="Partai Koalisi"
          value={partyData.filter(p => p.name !== 'Profesional').length}
          sub="partai di kabinet"
          icon="🤝"
          color="green"
        />
      </div>

      {/* ── Category Tabs ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {KABINET_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
              activeCategory === cat.id
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-bg-elevated text-text-secondary border-border hover:text-white hover:border-border-strong'
            }`}
          >
            {cat.label}
            <span className="ml-1.5 text-xs opacity-60">
              {cat.id === 'semua'
                ? KABINET_MERAH_PUTIH.length
                : KABINET_MERAH_PUTIH.filter(m => m.category === cat.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* ── Minister Grid ─────────────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(menteri => (
            <MenteriCard key={menteri.id} menteri={menteri} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-text-secondary">
          <p className="text-4xl mb-2">🏛️</p>
          <p className="text-sm">Tidak ada data untuk kategori ini.</p>
        </div>
      )}

      {/* ── Party Composition Chart ───────────────────────────────────────────── */}
      <PartyCompositionChart data={partyData} />

      {/* ── Footer note ───────────────────────────────────────────────────────── */}
      <div className="text-center text-text-secondary text-xs pb-4">
        Data Kabinet Merah Putih per Maret 2026 · Sumber: Seskab RI, Setkab.go.id
      </div>
    </div>
  )
}
