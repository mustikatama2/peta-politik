import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { PageHeader, Card, Badge, KPICard, Avatar } from '../../components/ui'
import MetaTags from '../../components/MetaTags'
import { KABINET_MERAH_PUTIH, KABINET_CATEGORIES, KABINET_STATS, BACKGROUND_LABELS } from '../../data/cabinet'
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

function getBgColor(background) {
  if (!background) return '#6b7280'
  // Check for politisi (any variant)
  if (background.includes('politisi')) return '#ef4444'
  if (background.includes('teknokrat')) return '#3b82f6'
  if (background.includes('pengusaha')) return '#f59e0b'
  if (background.includes('akademisi')) return '#06b6d4'
  if (background.includes('TNI') || background.includes('militer') || background.includes('ajudan')) return '#64748b'
  if (background.includes('Polri')) return '#7c3aed'
  if (background.includes('birokrat')) return '#10b981'
  if (background.includes('ulama')) return '#84cc16'
  if (background.includes('relawan')) return '#d97706'
  return '#6b7280'
}

// ── Minister Card ─────────────────────────────────────────────────────────────
function MenteriCard({ menteri }) {
  const party      = menteri.party_id ? PARTY_MAP[menteri.party_id] : null
  const partyColor = getPartyColor(menteri.party_id)
  const partyLabel = getPartyLabel(menteri.party_id)
  const bgColor    = getBgColor(menteri.background)
  const person     = PERSONS_MAP?.[menteri.id]
  const photoUrl   = person?.photo_url || menteri.photo_url || null

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
          <h3 className="text-text-primary font-semibold text-sm leading-snug">{menteri.name}</h3>
          <p className="text-text-secondary text-xs leading-snug mt-0.5 line-clamp-2">{menteri.position}</p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        <Badge color={partyColor} className="text-[10px]">
          {party ? `${party.logo_emoji || '🎭'} ${partyLabel}` : `⭕ ${partyLabel}`}
        </Badge>
        {menteri.background && (
          <Badge color={bgColor} className="text-[10px]">
            {menteri.background}
          </Badge>
        )}
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

// ── Minister Table Row ────────────────────────────────────────────────────────
function MenteriTableRow({ menteri, index }) {
  const party      = menteri.party_id ? PARTY_MAP[menteri.party_id] : null
  const partyColor = getPartyColor(menteri.party_id)
  const partyLabel = getPartyLabel(menteri.party_id)
  const bgColor    = getBgColor(menteri.background)
  const person     = PERSONS_MAP?.[menteri.id]

  return (
    <tr className="border-b border-border hover:bg-bg-elevated/50 transition-colors">
      <td className="py-2 px-3 text-text-secondary text-xs">{index + 1}</td>
      <td className="py-2 px-3">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0"
            style={{ backgroundColor: partyColor }}
          >
            {getInitials(menteri.name)}
          </div>
          <div>
            {person ? (
              <Link to={`/persons/${menteri.id}`} className="text-sm font-medium text-red-400 hover:text-red-300 hover:underline">
                {menteri.name}
              </Link>
            ) : (
              <span className="text-sm font-medium text-text-primary">{menteri.name}</span>
            )}
          </div>
        </div>
      </td>
      <td className="py-2 px-3 text-text-secondary text-xs max-w-[200px]">
        <span className="line-clamp-2">{menteri.position}</span>
      </td>
      <td className="py-2 px-3">
        <span
          className="px-2 py-0.5 rounded-full text-white text-[10px] font-medium whitespace-nowrap"
          style={{ backgroundColor: partyColor + 'cc' }}
        >
          {party ? `${party.abbr}` : 'Non-Parpol'}
        </span>
      </td>
      <td className="py-2 px-3">
        {menteri.background && (
          <span
            className="px-2 py-0.5 rounded-full text-white text-[10px] font-medium"
            style={{ backgroundColor: bgColor + 'cc' }}
          >
            {menteri.background}
          </span>
        )}
      </td>
      <td className="py-2 px-3 text-text-secondary text-[11px] max-w-[240px]">
        <span className="line-clamp-2">{menteri.notable}</span>
      </td>
    </tr>
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
      <h3 className="text-text-primary font-semibold text-sm mb-1">⚖️ Komposisi Partai di Kabinet</h3>
      <p className="text-text-secondary text-xs mb-4">Distribusi kursi kabinet berdasarkan afiliasi partai. Gerindra mendominasi dengan 15 posisi.</p>
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

// ── Background Analysis Chart ────────────────────────────────────────────────
function BackgroundAnalysisChart({ ministers }) {
  const bgData = useMemo(() => {
    const BG_GROUPS = [
      { key: 'politisi',  label: 'Politisi',        color: '#ef4444', test: bg => bg && bg.includes('politisi') },
      { key: 'pengusaha', label: 'Pengusaha',        color: '#f59e0b', test: bg => bg && bg.includes('pengusaha') && !bg.includes('politisi') },
      { key: 'teknokrat', label: 'Teknokrat',        color: '#3b82f6', test: bg => bg && bg.includes('teknokrat') },
      { key: 'akademisi', label: 'Akademisi',        color: '#06b6d4', test: bg => bg && bg.includes('akademisi') && !bg.includes('politisi') },
      { key: 'militer',   label: 'Militer / TNI',    color: '#64748b', test: bg => bg && (bg.includes('TNI') || bg.includes('militer') || bg.includes('ajudan')) && !bg.includes('politisi') && !bg.includes('pengusaha') },
      { key: 'polri',     label: 'Polri',             color: '#7c3aed', test: bg => bg && bg.includes('Polri') },
      { key: 'birokrat',  label: 'Birokrat',          color: '#10b981', test: bg => bg && bg.includes('birokrat') },
      { key: 'ulama',     label: 'Ulama',             color: '#84cc16', test: bg => bg && bg.includes('ulama') },
      { key: 'relawan',   label: 'Relawan',           color: '#d97706', test: bg => bg && bg.includes('relawan') && !bg.includes('politisi') },
    ]

    const nonKepres = ministers.filter(m => m.category !== 'kepresidenan')
    return BG_GROUPS.map(grp => ({
      name: grp.label,
      value: nonKepres.filter(m => grp.test(m.background)).length,
      color: grp.color,
    })).filter(d => d.value > 0).sort((a, b) => b.value - a.value)
  }, [ministers])

  return (
    <Card className="p-4">
      <h3 className="text-text-primary font-semibold text-sm mb-1">🧬 Analisis Latar Belakang Menteri</h3>
      <p className="text-text-secondary text-xs mb-4">Kategorisasi berdasarkan latar belakang karier. Politisi mendominasi, teknokrat & pengusaha signifikan.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Bar chart (main) */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={bgData} layout="vertical" margin={{ left: 10, right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#9ca3af' }} width={90} />
            <Tooltip
              formatter={(val) => [`${val} orang`]}
              contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} label={{ position: 'right', fontSize: 11, fill: '#9ca3af' }}>
              {bgData.map((entry, index) => (
                <Cell key={`bg-bar-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Summary grid */}
        <div className="grid grid-cols-2 gap-2">
          {bgData.map(item => (
            <div
              key={item.name}
              className="flex items-center gap-2 p-2 rounded-lg border border-border"
              style={{ borderLeftColor: item.color, borderLeftWidth: 3 }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-text-primary text-xs font-medium truncate">{item.name}</p>
                <p className="text-text-secondary text-[10px]">{item.value} orang</p>
              </div>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ backgroundColor: item.color }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function KabinetPage() {
  const [activeCategory, setActiveCategory] = useState('semua')
  const [viewMode, setViewMode]             = useState('grid') // 'grid' | 'table'
  const [sortBy, setSortBy]                 = useState('category') // 'name' | 'party' | 'background' | 'category'

  // Exclude Presiden/Wapres from minister count for KPIs
  const ministers = KABINET_MERAH_PUTIH.filter(m => m.category !== 'kepresidenan')

  const totalMenteri   = ministers.length
  const dariParpol     = ministers.filter(m => m.party_id !== null).length
  const profesional    = ministers.filter(m => m.party_id === null).length
  const pctParpol      = Math.round((dariParpol / totalMenteri) * 100)
  const pctProfesional = Math.round((profesional / totalMenteri) * 100)

  // Filtered + sorted list
  const filtered = useMemo(() => {
    let list = activeCategory === 'semua'
      ? KABINET_MERAH_PUTIH
      : KABINET_MERAH_PUTIH.filter(m => m.category === activeCategory)

    if (sortBy === 'name')       list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'party')      list = [...list].sort((a, b) => (a.party_id || 'zzz').localeCompare(b.party_id || 'zzz'))
    if (sortBy === 'background') list = [...list].sort((a, b) => (a.background || '').localeCompare(b.background || ''))

    return list
  }, [activeCategory, sortBy])

  // Party composition data
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
      <MetaTags
        title="Kabinet Merah Putih"
        description="Kabinet Prabowo–Gibran: daftar lengkap 48 menteri, komposisi partai, latar belakang, dan profil anggota kabinet Indonesia 2024–2029"
      />

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
                Prabowo–Gibran · 20 Oktober 2024 – Sekarang
              </p>
              <p className="text-white/40 text-xs mt-2">
                Kabinet ke-8 Republik Indonesia · {KABINET_MERAH_PUTIH.length} posisi terdaftar · {KABINET_STATS.total} menteri/setingkat
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-red-900/50 border border-red-700/50 text-red-300 text-xs font-medium">
                🦅 Gerindra {KABINET_STATS.partai_breakdown.find(p => p.partai === 'ger')?.jumlah} kursi
              </span>
              <span className="px-3 py-1 rounded-full bg-yellow-900/30 border border-yellow-700/50 text-yellow-300 text-xs font-medium">
                🌾 Golkar {KABINET_STATS.partai_breakdown.find(p => p.partai === 'gol')?.jumlah} kursi
              </span>
              <span className="px-3 py-1 rounded-full bg-green-900/30 border border-green-700/50 text-green-300 text-xs font-medium">
                🌙 PKB {KABINET_STATS.partai_breakdown.find(p => p.partai === 'pkb')?.jumlah} kursi
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
          sub={`${pctProfesional}% teknokrat/non-partisan`}
          icon="⭕"
          color="blue"
        />
        <KPICard
          label="Partai Koalisi"
          value={partyData.filter(p => p.name !== 'Profesional').length}
          sub={`${KABINET_STATS.perempuan} perempuan di kabinet`}
          icon="🤝"
          color="green"
        />
      </div>

      {/* ── Category Tabs + View Toggle ───────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
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

        {/* View mode + sort controls */}
        <div className="flex items-center gap-2">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="text-xs bg-bg-elevated border border-border rounded-lg px-2 py-1.5 text-text-secondary"
          >
            <option value="category">Urut: Kategori</option>
            <option value="name">Urut: Nama</option>
            <option value="party">Urut: Partai</option>
            <option value="background">Urut: Latar</option>
          </select>

          {/* Grid / Table toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-bg-elevated text-text-secondary hover:text-white'
              }`}
            >
              ⊞ Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors border-l border-border ${
                viewMode === 'table' ? 'bg-red-600 text-white' : 'bg-bg-elevated text-text-secondary hover:text-white'
              }`}
            >
              ☰ Tabel
            </button>
          </div>
        </div>
      </div>

      {/* ── Minister Grid ─────────────────────────────────────────────────────── */}
      {viewMode === 'grid' && (
        filtered.length > 0 ? (
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
        )
      )}

      {/* ── Minister Table ─────────────────────────────────────────────────────── */}
      {viewMode === 'table' && (
        <Card className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 px-3 text-text-secondary text-xs font-medium">#</th>
                <th className="py-2 px-3 text-text-secondary text-xs font-medium">
                  <button onClick={() => setSortBy('name')} className="hover:text-white transition-colors flex items-center gap-1">
                    Nama {sortBy === 'name' && '↑'}
                  </button>
                </th>
                <th className="py-2 px-3 text-text-secondary text-xs font-medium">Jabatan</th>
                <th className="py-2 px-3 text-text-secondary text-xs font-medium">
                  <button onClick={() => setSortBy('party')} className="hover:text-white transition-colors flex items-center gap-1">
                    Partai {sortBy === 'party' && '↑'}
                  </button>
                </th>
                <th className="py-2 px-3 text-text-secondary text-xs font-medium">
                  <button onClick={() => setSortBy('background')} className="hover:text-white transition-colors flex items-center gap-1">
                    Latar Belakang {sortBy === 'background' && '↑'}
                  </button>
                </th>
                <th className="py-2 px-3 text-text-secondary text-xs font-medium">Catatan</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((menteri, i) => (
                <MenteriTableRow key={menteri.id} menteri={menteri} index={i} />
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* ── Party Composition Chart ───────────────────────────────────────────── */}
      <PartyCompositionChart data={partyData} />

      {/* ── Background Analysis Chart ────────────────────────────────────────── */}
      <BackgroundAnalysisChart ministers={ministers} />

      {/* ── Party Breakdown Detail ───────────────────────────────────────────── */}
      <Card className="p-4">
        <h3 className="text-text-primary font-semibold text-sm mb-3">📊 Detail Partai Koalisi</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {KABINET_STATS.partai_breakdown.map(item => {
            const party = PARTY_MAP[item.partai]
            const color = party?.color || '#6b7280'
            return (
              <div
                key={item.partai}
                className="p-3 rounded-lg border border-border flex items-center gap-3"
                style={{ borderLeftColor: color, borderLeftWidth: 3 }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary font-semibold text-sm">{party?.abbr || item.partai.toUpperCase()}</p>
                  <p className="text-text-secondary text-xs">{item.jumlah} posisi</p>
                </div>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: color }}
                >
                  {item.jumlah}
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-text-secondary text-xs mt-3">
          * Gerindra mendominasi dengan 15 posisi ({Math.round(15/KABINET_STATS.total*100)}% kabinet) — mencerminkan kemenangan Prabowo sebagai presiden dari partainya sendiri.
        </p>
      </Card>

      {/* ── Footer note ───────────────────────────────────────────────────────── */}
      <div className="text-center text-text-secondary text-xs pb-4">
        Data Kabinet Merah Putih per Maret 2026 · Sumber: Seskab RI, Setkab.go.id
        <br />
        {KABINET_MERAH_PUTIH.length} posisi terdaftar · {KABINET_STATS.total} menteri/setingkat menteri resmi
      </div>
    </div>
  )
}
