import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from 'recharts'
import { PARTY_FINANCE, PILPRES_FINANCE, TOP_DONORS } from '../../data/campaign_finance.js'

// ── Formatters ──────────────────────────────────────────────────────────────

function fmtRp(val) {
  if (!val) return 'Rp 0'
  const t = val / 1_000_000_000_000
  if (t >= 1) return `Rp ${t.toFixed(2).replace('.', ',')} T`
  const m = val / 1_000_000_000
  if (m >= 1) return `Rp ${m.toFixed(0)} M`
  const jt = val / 1_000_000
  return `Rp ${jt.toFixed(0)} jt`
}

function fmtRpShort(val) {
  if (!val) return '0'
  const t = val / 1_000_000_000_000
  if (t >= 1) return `${t.toFixed(1)}T`
  const m = val / 1_000_000_000
  if (m >= 10) return `${m.toFixed(0)}M`
  return `${m.toFixed(1)}M`
}

// ── Colour palette ──────────────────────────────────────────────────────────

const PIE_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899']

const PARTY_COLORS = {
  ger: '#8B0000', gol: '#FFD700', pdip: '#C8102E', pkb: '#00A550',
  nas: '#27AAE1', pks: '#1B5E20', dem: '#2196F3', pan: '#FF6B35',
  ppp: '#4CAF50', han: '#FF5722', psi: '#E91E63', per: '#00BCD4',
  gel: '#FF9800', bur: '#F44336', pbb: '#009688', gar: '#9C27B0',
  umm: '#8BC34A', pkn: '#607D8B',
}

// ── MAX for bar scaling ─────────────────────────────────────────────────────

const MAX_DANA = Math.max(...PARTY_FINANCE.map(p => p.dana_kampanye))

// ── Custom tooltip ──────────────────────────────────────────────────────────

function CustomPieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-text-primary font-semibold">{d.name}</p>
      <p className="text-accent-red">{fmtRp(d.value)}</p>
      {d.payload.pct && <p className="text-text-muted">{d.payload.pct}%</p>}
    </div>
  )
}

function CustomBarTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-text-primary font-semibold">{d.category}</p>
      <p className="text-accent-red">{fmtRp(d.amount)}</p>
    </div>
  )
}

// ── Section: Pilpres Cards ──────────────────────────────────────────────────

const PASLON_EMOJI = { 'Prabowo-Gibran': '🦅', 'Anies-Cak Imin': '🕊️', 'Ganjar-Mahfud': '🌾' }

function PilpresCard({ data }) {
  const maxDana = Math.max(...PILPRES_FINANCE.map(p => p.dana_kampanye))
  const barPct = (data.dana_kampanye / maxDana) * 100
  const winner = data.result_pct > 50

  return (
    <div className={`rounded-xl border p-5 flex flex-col gap-4 ${winner ? 'bg-red-900/10 border-red-700/30' : 'bg-bg-card border-border'}`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{PASLON_EMOJI[data.paslon] || '🗳️'}</span>
            <h3 className="text-base font-bold text-text-primary">{data.paslon}</h3>
          </div>
          {winner && (
            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-900/30 text-green-400 border border-green-700/40">
              ✅ Pemenang — {data.result_pct}%
            </span>
          )}
          {!winner && (
            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs text-text-muted border border-border">
              🗳️ {data.result_pct}% suara
            </span>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs text-text-muted">Total Dana</p>
          <p className="text-xl font-bold text-accent-red">{fmtRp(data.dana_kampanye)}</p>
        </div>
      </div>

      {/* Dana bar */}
      <div>
        <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-700 to-red-400 transition-all"
            style={{ width: `${barPct}%` }}
          />
        </div>
      </div>

      {/* Donut chart — sumber dana */}
      <div className="flex items-center justify-center">
        <PieChart width={180} height={140}>
          <Pie
            data={data.sumber}
            cx={88}
            cy={65}
            innerRadius={42}
            outerRadius={62}
            dataKey="amount"
            nameKey="type"
          >
            {data.sumber.map((s, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
          <ReTooltip content={<CustomPieTooltip />} />
          <Legend
            iconSize={8}
            iconType="circle"
            wrapperStyle={{ fontSize: '10px', color: 'var(--color-text-muted)' }}
          />
        </PieChart>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-bg-elevated rounded-lg p-2.5">
          <p className="text-text-muted">Biaya/Suara</p>
          <p className="font-bold text-text-primary text-sm">Rp {data.cost_per_vote?.toLocaleString('id')}</p>
        </div>
        <div className="bg-bg-elevated rounded-lg p-2.5">
          <p className="text-text-muted">Perolehan Suara</p>
          <p className="font-bold text-text-primary text-sm">{data.result_pct}%</p>
        </div>
      </div>

      {/* Controversy */}
      {data.controversy && (
        <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-yellow-900/20 border border-yellow-700/30">
          <span className="text-yellow-400 text-sm flex-shrink-0">⚠️</span>
          <p className="text-xs text-yellow-300 leading-snug">{data.controversy}</p>
        </div>
      )}
    </div>
  )
}

// ── Section: Party Table ────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { key: 'dana_kampanye', label: 'Total Dana ↓' },
  { key: 'cost_per_seat', label: 'Dana/Kursi ↓' },
  { key: 'pengeluaran_iklan', label: 'Iklan ↓' },
  { key: 'seats_2024', label: 'Kursi ↓' },
]

function PartyRow({ party, expanded, onToggle }) {
  const color = PARTY_COLORS[party.id] || '#888'
  const barWidth = Math.round((party.dana_kampanye / MAX_DANA) * 100)
  const iklan = party.pengeluaran.find(p => p.category === 'Periklanan')?.amount || 0

  return (
    <>
      <tr
        className="border-b border-border cursor-pointer hover:bg-bg-elevated transition-colors"
        onClick={onToggle}
      >
        {/* Partai */}
        <td className="py-3 px-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">{expanded ? '▾' : '▸'}</span>
            <span
              className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: color }}
            />
            <span className="text-sm font-medium text-text-primary">{party.abbr}</span>
          </div>
        </td>

        {/* Total Dana — bar cell */}
        <td className="py-3 px-3">
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-bg-elevated rounded-full overflow-hidden flex-shrink-0">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${barWidth}%`, background: color }}
              />
            </div>
            <span className="text-xs text-text-primary whitespace-nowrap">
              {fmtRpShort(party.dana_kampanye)}
            </span>
          </div>
        </td>

        {/* Dana/Kursi */}
        <td className="py-3 px-3 text-xs text-text-secondary">
          {party.seats_2024 > 0 ? fmtRpShort(party.cost_per_seat) : <span className="text-text-muted">—</span>}
        </td>

        {/* Kursi */}
        <td className="py-3 px-3 text-xs text-text-secondary">
          {party.seats_2024 > 0
            ? <span className="font-semibold text-green-400">{party.seats_2024}</span>
            : <span className="text-red-500">0</span>}
        </td>

        {/* Iklan */}
        <td className="py-3 px-3 text-xs text-text-secondary">{fmtRpShort(iklan)}</td>

        {/* Controversy */}
        <td className="py-3 px-3">
          {party.controversy
            ? <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs bg-yellow-900/30 text-yellow-400 border border-yellow-700/30">⚠️</span>
            : <span className="text-text-muted text-xs">—</span>
          }
        </td>
      </tr>

      {/* Expanded breakdown */}
      {expanded && (
        <tr className="bg-bg-elevated/50 border-b border-border">
          <td colSpan={6} className="px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sumber donut */}
              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                  Sumber Dana
                </p>
                <PieChart width={260} height={160}>
                  <Pie
                    data={party.sumber}
                    cx={128}
                    cy={72}
                    innerRadius={45}
                    outerRadius={65}
                    dataKey="amount"
                    nameKey="type"
                  >
                    {party.sumber.map((s, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <ReTooltip content={<CustomPieTooltip />} />
                  <Legend
                    iconSize={8}
                    iconType="circle"
                    wrapperStyle={{ fontSize: '10px', color: 'var(--color-text-muted)' }}
                  />
                </PieChart>
              </div>

              {/* Pengeluaran bar */}
              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                  Pengeluaran
                </p>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart
                    data={party.pengeluaran}
                    layout="vertical"
                    margin={{ left: 8, right: 16, top: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                    <XAxis
                      type="number"
                      tickFormatter={v => fmtRpShort(v)}
                      tick={{ fontSize: 9, fill: 'var(--color-text-muted)' }}
                    />
                    <YAxis
                      dataKey="category"
                      type="category"
                      width={72}
                      tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
                    />
                    <ReTooltip content={<CustomBarTooltip />} />
                    <Bar dataKey="amount" fill={color} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Controversy detail */}
            {party.controversy && (
              <div className="mt-3 flex items-start gap-2 px-3 py-2 rounded-lg bg-yellow-900/20 border border-yellow-700/30">
                <span className="text-yellow-400 text-sm">⚠️</span>
                <p className="text-xs text-yellow-300">{party.controversy}</p>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  )
}

// ── Section: Top Donors ─────────────────────────────────────────────────────

function DonorCard({ donor, rank }) {
  const partyInfo = PARTY_FINANCE.find(p => p.id === donor.party_beneficiary)
  const color = PARTY_COLORS[donor.party_beneficiary] || '#888'

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-bg-card border border-border hover:border-accent-red/30 transition-all">
      {/* Rank */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center text-xs font-bold text-text-muted">
        {rank}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            {donor.person_id ? (
              <Link
                to={`/persons/${donor.person_id}`}
                className="text-sm font-semibold text-text-primary hover:text-accent-red transition-colors"
              >
                {donor.name}
              </Link>
            ) : (
              <span className="text-sm font-semibold text-text-primary">{donor.name}</span>
            )}
            <p className="text-xs text-text-muted mt-0.5">{donor.role}</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-base font-bold text-accent-red">{fmtRp(donor.amount)}</p>
          </div>
        </div>

        {/* Party + controversy */}
        <div className="flex items-center gap-2 mt-2">
          <span
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border"
            style={{ borderColor: color + '60', color, background: color + '15' }}
          >
            {partyInfo?.abbr || donor.party_beneficiary.toUpperCase()}
          </span>
          {donor.controversy && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-yellow-900/30 text-yellow-400 border border-yellow-700/30">
              ⚠️ Kontroversi
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Analysis insights ───────────────────────────────────────────────────────

const INSIGHTS = [
  {
    icon: '💸',
    title: 'Ketimpangan Dana Sangat Besar',
    body: 'Prabowo-Gibran menghabiskan Rp 1,9 T — 4,5× lebih besar dari Anies-Cak Imin (Rp 420 M). Kesenjangan ini mencerminkan akses kandidat terhadap sumber daya korporasi dan BUMN.',
  },
  {
    icon: '📺',
    title: 'Dominasi Belanja Iklan',
    body: 'Rata-rata 40–42% dana kampanye partai dialokasikan ke iklan dan media. Ini menguntungkan parpol yang memiliki afiliasi media (NasDem, Perindo) karena mendapat harga "diskon" internal.',
  },
  {
    icon: '🏛️',
    title: 'Bansos & Fasilitas Negara',
    body: 'Kontroversi utama Pilpres 2024: percepatan penyaluran bansos bertepatan dengan masa kampanye Prabowo-Gibran. KPU dan Bawaslu mencatat 28 laporan dugaan penyalahgunaan fasilitas negara.',
  },
  {
    icon: '🌊',
    title: 'Efisiensi vs Jumlah Dana',
    body: 'Korelasi antara dana kampanye dan perolehan kursi tidak linear. PKS dengan Rp 316 M meraih 53 kursi (Rp 5,96 M/kursi), lebih efisien dibanding Gerindra (Rp 10,5 M/kursi).',
  },
  {
    icon: '⚖️',
    title: 'Batas Sumbangan Perseorangan Sering Dilanggar',
    body: 'UU Pemilu membatasi sumbangan perseorangan Rp 2,5 M/orang untuk partai dan Rp 25 M untuk paslon. Namun praktik "titipan" via badan hukum dan partai induk masih marak dilaporkan.',
  },
]

// ── Main Page ───────────────────────────────────────────────────────────────

export default function DanaKampanyePage() {
  const [sortKey, setSortKey] = useState('dana_kampanye')
  const [expandedId, setExpandedId] = useState(null)

  // Compute sorted list
  const sorted = useMemo(() => {
    return [...PARTY_FINANCE].sort((a, b) => {
      if (sortKey === 'pengeluaran_iklan') {
        const iklanA = a.pengeluaran.find(p => p.category === 'Periklanan')?.amount || 0
        const iklanB = b.pengeluaran.find(p => p.category === 'Periklanan')?.amount || 0
        return iklanB - iklanA
      }
      return (b[sortKey] || 0) - (a[sortKey] || 0)
    })
  }, [sortKey])

  // KPI: total combined dana
  const totalDana = PARTY_FINANCE.reduce((s, p) => s + p.dana_kampanye, 0)
  const totalDanaPilpres = PILPRES_FINANCE.reduce((s, p) => s + p.dana_kampanye, 0)
  const partiesWithSeats = PARTY_FINANCE.filter(p => p.seats_2024 > 0).length
  const avgCostPerSeat = PARTY_FINANCE
    .filter(p => p.seats_2024 > 0)
    .reduce((s, p) => s + p.cost_per_seat, 0) / partiesWithSeats

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            💰 Transparansi Dana Kampanye 2024
          </h1>
          <p className="text-sm text-text-muted mt-1 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-900/30 text-blue-300 border border-blue-700/30 text-xs">
              📋 Sumber: Laporan LPPDK KPU RI
            </span>
            <span className="text-text-muted">Pemilu 2024</span>
          </p>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl bg-bg-card border border-border p-4">
          <p className="text-xs text-text-muted">Total Dana Partai</p>
          <p className="text-xl font-bold text-text-primary mt-1">{fmtRp(totalDana)}</p>
          <p className="text-xs text-text-muted mt-1">18 Partai Peserta</p>
        </div>
        <div className="rounded-xl bg-red-900/10 border border-red-700/30 p-4">
          <p className="text-xs text-text-muted">Dana Pilpres</p>
          <p className="text-xl font-bold text-accent-red mt-1">{fmtRp(totalDanaPilpres)}</p>
          <p className="text-xs text-text-muted mt-1">3 Paslon Gabungan</p>
        </div>
        <div className="rounded-xl bg-bg-card border border-border p-4">
          <p className="text-xs text-text-muted">Partai Lolos DPR</p>
          <p className="text-xl font-bold text-green-400 mt-1">{partiesWithSeats}</p>
          <p className="text-xs text-text-muted mt-1">dari 18 peserta</p>
        </div>
        <div className="rounded-xl bg-bg-card border border-border p-4">
          <p className="text-xs text-text-muted">Rata-rata Dana/Kursi</p>
          <p className="text-xl font-bold text-text-primary mt-1">{fmtRp(avgCostPerSeat)}</p>
          <p className="text-xs text-text-muted mt-1">Partai berseat</p>
        </div>
      </div>

      {/* ── Section 1: Pilpres ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-bold text-text-primary">🗳️ Dana Kampanye Pilpres 2024</h2>
          <span className="text-xs text-text-muted px-2 py-0.5 bg-bg-elevated rounded-full">3 Paslon</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PILPRES_FINANCE.map(p => (
            <PilpresCard key={p.paslon} data={p} />
          ))}
        </div>
      </section>

      {/* ── Section 2: Party Table ── */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-text-primary">🎭 Dana Kampanye Partai</h2>
            <span className="text-xs text-text-muted px-2 py-0.5 bg-bg-elevated rounded-full">18 Partai</span>
          </div>
          {/* Sort controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-text-muted">Urutkan:</span>
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.key}
                onClick={() => setSortKey(opt.key)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                  sortKey === opt.key
                    ? 'bg-accent-red text-white border-red-700'
                    : 'bg-bg-elevated text-text-muted border-border hover:border-accent-red hover:text-text-primary'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-elevated">
                  <th className="text-left py-3 px-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Partai</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Total Dana</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Dana/Kursi</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Kursi</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Iklan</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Kontr.</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(party => (
                  <PartyRow
                    key={party.id}
                    party={party}
                    expanded={expandedId === party.id}
                    onToggle={() => setExpandedId(expandedId === party.id ? null : party.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-text-muted mt-2">
          💡 Klik baris untuk melihat rincian sumber dana dan pengeluaran per partai.
        </p>
      </section>

      {/* ── Section 3: Top Donors ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-bold text-text-primary">🏦 Donatur Terbesar</h2>
          <span className="text-xs text-text-muted px-2 py-0.5 bg-bg-elevated rounded-full">Berdasarkan LPPDK KPU</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TOP_DONORS.map((donor, i) => (
            <DonorCard key={donor.name} donor={donor} rank={i + 1} />
          ))}
        </div>
      </section>

      {/* ── Section 4: Analysis ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-bold text-text-primary">🔎 Analisis: Politik Uang di Indonesia</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {INSIGHTS.map((ins, i) => (
            <div
              key={i}
              className="rounded-xl bg-bg-card border border-border p-5 hover:border-accent-red/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{ins.icon}</span>
                <h3 className="text-sm font-bold text-text-primary leading-snug">{ins.title}</h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{ins.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer disclaimer ── */}
      <div className="px-4 py-3 rounded-xl bg-bg-elevated border border-border text-xs text-text-muted leading-relaxed">
        <strong className="text-text-secondary">📋 Disclaimer:</strong>{' '}
        Data bersumber dari Laporan Penerimaan dan Pengeluaran Dana Kampanye (LPPDK) yang
        dipublikasikan oleh KPU RI. Sebagian angka merupakan estimasi berdasarkan dokumen
        publik yang tersedia. Untuk data resmi, kunjungi{' '}
        <a
          href="https://pemilu2024.kpu.go.id"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-red hover:underline"
        >
          pemilu2024.kpu.go.id
        </a>.
      </div>
    </div>
  )
}
