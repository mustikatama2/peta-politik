import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid, Legend,
  PieChart, Pie,
} from 'recharts'
import { PageHeader, Card, Badge, KPICard, Btn, Avatar, formatIDR } from '../components/ui'
import { KPK_CASES, INSTITUTION_CONFIG, STATUS_CONFIG } from '../data/kpk_cases'
import { PERSONS, PERSONS_MAP } from '../data/persons'
import { PARTIES } from '../data/parties'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PARTY_MAP = Object.fromEntries(PARTIES.map(p => [p.id, p]))

function getYear(dateStr) {
  if (!dateStr) return null
  return parseInt(dateStr.slice(0, 4), 10)
}

// Normalize institution labels for grouping
function normalizeInstitution(inst) {
  if (!inst) return 'Lainnya'
  if (inst.toLowerCase().includes('kejaksaan')) return 'Kejaksaan Agung'
  if (inst.toLowerCase() === 'kpk') return 'KPK'
  if (inst.toLowerCase() === 'polri') return 'Polri'
  if (inst.toLowerCase() === 'mkmk') return 'MKMK'
  return inst
}

// ─── Derived Data ─────────────────────────────────────────────────────────────

function useKorupsiData() {
  return useMemo(() => {
    // ── KPI stats
    const totalCases   = KPK_CASES.length
    const terpidana    = KPK_CASES.filter(k => k.status === 'terpidana').length
    const aktif        = KPK_CASES.filter(k => k.status === 'tersangka' || k.status === 'terdakwa').length
    const tahun2425    = KPK_CASES.filter(k => {
      const y = getYear(k.date_start)
      return y === 2024 || y === 2025
    }).length
    const totalLosses  = KPK_CASES.reduce((s, k) => s + (k.losses_idr || 0), 0)

    // Institution counts
    const instCount = {}
    KPK_CASES.forEach(k => {
      const inst = normalizeInstitution(k.institution)
      instCount[inst] = (instCount[inst] || 0) + 1
    })
    const paling_aktif = Object.entries(instCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'KPK'

    // ── High-risk politicians: suspects cross-referenced with PERSONS
    const personCaseMap = {}
    KPK_CASES.forEach(kasus => {
      ;(kasus.suspects || []).forEach(sid => {
        if (!personCaseMap[sid]) personCaseMap[sid] = { cases: [], totalLosses: 0 }
        personCaseMap[sid].cases.push(kasus)
        personCaseMap[sid].totalLosses += kasus.losses_idr || 0
      })
    })

    const highRiskPoliticians = Object.entries(personCaseMap)
      .map(([sid, data]) => {
        const person = PERSONS_MAP[sid]
        return { sid, person, ...data }
      })
      .filter(x => x.person)
      .sort((a, b) => b.cases.length - a.cases.length || b.totalLosses - a.totalLosses)

    // ── Corruption by party (from person's party_id)
    const partyCount = {}
    const partyLosses = {}
    Object.entries(personCaseMap).forEach(([sid, data]) => {
      const person = PERSONS_MAP[sid]
      const pId = person?.party_id || 'independen'
      partyCount[pId] = (partyCount[pId] || 0) + data.cases.length
      partyLosses[pId] = (partyLosses[pId] || 0) + data.totalLosses
    })
    const partyData = Object.entries(partyCount)
      .map(([id, count]) => ({
        id,
        name: PARTY_MAP[id]?.abbr || id.toUpperCase(),
        color: PARTY_MAP[id]?.color || '#6b7280',
        count,
        losses: partyLosses[id] || 0,
      }))
      .sort((a, b) => b.count - a.count)

    // ── Timeline: cases by year
    const yearCount = {}
    KPK_CASES.forEach(k => {
      const y = getYear(k.date_start)
      if (y && y >= 2018 && y <= 2025) {
        yearCount[y] = (yearCount[y] || 0) + 1
      }
    })
    const timelineData = Array.from({ length: 8 }, (_, i) => 2018 + i).map(y => ({
      year: y,
      kasus: yearCount[y] || 0,
    }))

    // ── Lembaga comparison
    const lembagaData = Object.entries(instCount)
      .map(([name, value]) => ({ name, value, color: INSTITUTION_CONFIG[name]?.color || '#6b7280' }))
      .sort((a, b) => b.value - a.value)

    // ── Watchlist: tinggi risk but NO KPK case
    const suspectIds = new Set(KPK_CASES.flatMap(k => k.suspects || []))
    const watchlist = PERSONS.filter(p => {
      const risk = p.analysis?.corruption_risk
      return (risk === 'tinggi' || risk === 'sangat-tinggi' || risk === 'sangat_tinggi') && !suspectIds.has(p.id)
    })

    return {
      totalCases, terpidana, aktif, tahun2425, totalLosses, paling_aktif,
      highRiskPoliticians, partyData, timelineData, lembagaData, watchlist,
    }
  }, [])
}

// ─── Section: KPI Cards ───────────────────────────────────────────────────────
function SectionKPI({ data }) {
  const { totalCases, terpidana, aktif, tahun2425, totalLosses, paling_aktif } = data
  return (
    <section>
      <h2 className="text-lg font-semibold text-text-primary mb-3">📊 Statistik Ringkasan</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPICard label="Total Kasus" value={totalCases} icon="📁" color="#ef4444" />
        <KPICard label="Terpidana" value={terpidana} icon="⚖️" color="#dc2626" sub="sudah divonis" />
        <KPICard label="Aktif" value={aktif} icon="🔍" color="#f97316" sub="tersangka/terdakwa" />
        <KPICard label="2024–2025" value={tahun2425} icon="🆕" color="#eab308" sub="kasus baru" />
        <KPICard
          label="Total Kerugian"
          value={formatIDRShort(totalLosses)}
          icon="💸"
          color="#ef4444"
          sub="estimasi negara"
        />
        <KPICard label="Paling Aktif" value={paling_aktif} icon="🏛️" color="#8b5cf6" sub="lembaga penangani" />
      </div>
    </section>
  )
}

function formatIDRShort(val) {
  if (!val) return '—'
  const t = val / 1_000_000_000_000
  if (t >= 1) return `Rp ${t.toFixed(1)}T`
  const m = val / 1_000_000_000
  if (m >= 1) return `Rp ${m.toFixed(1)}M`
  return `Rp ${(val / 1_000_000).toFixed(0)}Jt`
}

// ─── Section: High Risk Politicians ──────────────────────────────────────────
const SORT_OPTIONS = [
  { key: 'kasus', label: 'Kasus Terbanyak' },
  { key: 'kerugian', label: 'Kerugian Terbesar' },
  { key: 'aktif', label: 'Status Aktif' },
]

function HighRiskCard({ entry }) {
  const { person, cases, totalLosses } = entry
  const party = PARTY_MAP[person.party_id]
  const latestStatus = cases[0]?.status || 'tersangka'
  const stat = STATUS_CONFIG[latestStatus] || STATUS_CONFIG.tersangka

  return (
    <Card className="p-4 hover:border-border-strong transition-all" colorLeft={stat.color}>
      <div className="flex items-start gap-3">
        <Avatar
          name={person.name}
          photoUrl={person.photo_url}
          size="lg"
          color={party?.color || '#374151'}
        />
        <div className="flex-1 min-w-0">
          <Link
            to={`/persons/${person.id}`}
            className="text-sm font-semibold text-text-primary hover:text-red-400 transition-colors line-clamp-1"
          >
            {person.name}
          </Link>
          <div className="flex flex-wrap gap-1 mt-1">
            {party && (
              <Badge color={party.color}>{party.abbr}</Badge>
            )}
            <Badge color={stat.color}>{stat.label}</Badge>
          </div>
          <div className="flex gap-4 mt-2">
            <div>
              <p className="text-[10px] text-text-secondary uppercase tracking-wide">Kasus</p>
              <p className="text-sm font-bold text-red-400">{cases.length}</p>
            </div>
            {totalLosses > 0 && (
              <div>
                <p className="text-[10px] text-text-secondary uppercase tracking-wide">Kerugian</p>
                <p className="text-sm font-bold text-orange-400">{formatIDRShort(totalLosses)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

function SectionHighRisk({ politicians }) {
  const [sort, setSort] = useState('kasus')

  const sorted = useMemo(() => {
    const list = [...politicians]
    if (sort === 'kasus') return list.sort((a, b) => b.cases.length - a.cases.length)
    if (sort === 'kerugian') return list.sort((a, b) => b.totalLosses - a.totalLosses)
    if (sort === 'aktif') {
      return list.sort((a, b) => {
        const aActive = a.cases.some(c => c.status === 'tersangka' || c.status === 'terdakwa') ? 1 : 0
        const bActive = b.cases.some(c => c.status === 'tersangka' || c.status === 'terdakwa') ? 1 : 0
        return bActive - aActive || b.cases.length - a.cases.length
      })
    }
    return list
  }, [politicians, sort])

  if (!sorted.length) {
    return (
      <section>
        <h2 className="text-lg font-semibold text-text-primary mb-3">🚨 Politisi Berisiko Tinggi</h2>
        <Card className="p-6 text-center text-text-secondary">Tidak ada data tersedia.</Card>
      </section>
    )
  }

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <h2 className="text-lg font-semibold text-text-primary">🚨 Politisi dalam Kasus Korupsi</h2>
        <div className="flex gap-2 flex-wrap">
          {SORT_OPTIONS.map(o => (
            <Btn
              key={o.key}
              variant={sort === o.key ? 'primary' : 'secondary'}
              onClick={() => setSort(o.key)}
            >
              {o.label}
            </Btn>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sorted.slice(0, 12).map(entry => (
          <HighRiskCard key={entry.sid} entry={entry} />
        ))}
      </div>
      {sorted.length > 12 && (
        <p className="text-text-secondary text-sm mt-3 text-center">… dan {sorted.length - 12} lainnya</p>
      )}
    </section>
  )
}

// ─── Section: Corruption by Party ────────────────────────────────────────────
function SectionPartyChart({ partyData }) {
  const top = partyData.slice(0, 10)
  return (
    <section>
      <h2 className="text-lg font-semibold text-text-primary mb-3">🏛️ Korupsi per Partai</h2>
      <Card className="p-4">
        {top.length === 0 ? (
          <p className="text-text-secondary text-sm">Data tidak tersedia.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={top} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8 }}
                labelStyle={{ color: '#f9fafb', fontWeight: 600 }}
                itemStyle={{ color: '#d1d5db' }}
                formatter={(v) => [`${v} kasus`, 'Jumlah Kasus']}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {top.map(entry => (
                  <Cell key={entry.id} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </section>
  )
}

// ─── Section: Timeline ────────────────────────────────────────────────────────
function SectionTimeline({ timelineData }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-text-primary mb-3">📅 Tren Kasus 2018–2025</h2>
      <Card className="p-4">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={timelineData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="year" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8 }}
              labelStyle={{ color: '#f9fafb', fontWeight: 600 }}
              itemStyle={{ color: '#d1d5db' }}
              formatter={(v) => [`${v} kasus`, 'Jumlah Kasus']}
            />
            <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="kasus"
              stroke="#ef4444"
              strokeWidth={2.5}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              name="Kasus KPK"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </section>
  )
}

// ─── Section: Lembaga Pie ─────────────────────────────────────────────────────
const INST_COLORS = {
  KPK: '#ef4444',
  'Kejaksaan Agung': '#f97316',
  Polri: '#3b82f6',
  MKMK: '#8b5cf6',
  Lainnya: '#6b7280',
}

function SectionLembaga({ lembagaData }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-text-primary mb-3">⚖️ Penanganan per Lembaga</h2>
      <Card className="p-4">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={lembagaData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {lembagaData.map(entry => (
                  <Cell key={entry.name} fill={INST_COLORS[entry.name] || entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8 }}
                formatter={(v, name) => [`${v} kasus`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 min-w-[160px]">
            {lembagaData.map(entry => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: INST_COLORS[entry.name] || entry.color }}
                />
                <span className="text-text-secondary text-sm">{entry.name}</span>
                <span className="ml-auto text-text-primary font-semibold text-sm">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </section>
  )
}

// ─── Section: Watchlist ───────────────────────────────────────────────────────
function WatchlistCard({ person }) {
  const party = PARTY_MAP[person.party_id]
  return (
    <Card className="p-4 border-l-4 border-l-amber-500 hover:border-border-strong transition-all">
      <div className="flex items-start gap-3">
        <Avatar
          name={person.name}
          photoUrl={person.photo_url}
          size="md"
          color={party?.color || '#92400e'}
        />
        <div className="flex-1 min-w-0">
          <Link
            to={`/persons/${person.id}`}
            className="text-sm font-semibold text-text-primary hover:text-amber-400 transition-colors line-clamp-1"
          >
            {person.name}
          </Link>
          <div className="flex flex-wrap gap-1 mt-1">
            {party && <Badge color={party.color}>{party.abbr}</Badge>}
            <Badge color="#f59e0b">⚠️ Risiko Tinggi</Badge>
          </div>
          <p className="text-[11px] text-amber-500 mt-2 font-medium">Belum Ada Kasus — Perlu Pantauan</p>
          {person.analysis?.notes && (
            <p className="text-[10px] text-text-secondary mt-1 line-clamp-2">{person.analysis.notes}</p>
          )}
        </div>
      </div>
    </Card>
  )
}

function SectionWatchlist({ watchlist }) {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? watchlist : watchlist.slice(0, 9)

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <h2 className="text-lg font-semibold text-text-primary">
          ⚠️ Watchlist — Risiko Tinggi, Belum Ada Kasus
        </h2>
        <span className="text-text-secondary text-sm">{watchlist.length} tokoh</span>
      </div>
      {watchlist.length === 0 ? (
        <Card className="p-6 text-center text-text-secondary">Tidak ada data watchlist tersedia.</Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {visible.map(p => <WatchlistCard key={p.id} person={p} />)}
          </div>
          {watchlist.length > 9 && (
            <div className="text-center mt-4">
              <Btn variant="secondary" onClick={() => setShowAll(v => !v)}>
                {showAll ? 'Sembunyikan' : `Tampilkan Semua (${watchlist.length})`}
              </Btn>
            </div>
          )}
        </>
      )}
    </section>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function KorupsiTrackerPage() {
  const data = useKorupsiData()

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
      <PageHeader
        title="🚨 Korupsi Tracker"
        subtitle="Pantau kasus korupsi aktif, politisi berisiko tinggi, dan tren penindakan oleh KPK, Kejaksaan, dan Polri"
      />

      <SectionKPI data={data} />
      <SectionHighRisk politicians={data.highRiskPoliticians} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionPartyChart partyData={data.partyData} />
        <SectionTimeline timelineData={data.timelineData} />
      </div>

      <SectionLembaga lembagaData={data.lembagaData} />
      <SectionWatchlist watchlist={data.watchlist} />
    </div>
  )
}
