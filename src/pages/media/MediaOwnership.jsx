import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LabelList, ReferenceLine, ZAxis,
} from 'recharts'
import { PageHeader, Card, Badge, KPICard } from '../../components/ui'
import {
  MEDIA_OUTLETS,
  MEDIA_OWNERS,
  MEDIA_TYPE_CONFIG,
  MEDIA_OWNERSHIP_GROUPS,
  BIAS_CONFIG,
} from '../../data/media'

// ── Political Bias Spectrum ───────────────────────────────────────────────────
function BiasSpectrum({ outlets }) {
  const MIN = -5, MAX = 5, RANGE = MAX - MIN
  return (
    <Card className="p-5">
      <h2 className="text-text-primary font-semibold mb-4">🎯 Spektrum Keberpihakan Politik</h2>
      <div className="relative">
        {/* Track */}
        <div className="h-2 rounded-full bg-gradient-to-r from-blue-600 via-gray-600 to-red-600 mx-4 my-8" />
        {/* Labels */}
        <div className="flex justify-between text-xs text-text-secondary px-4 -mt-4">
          <span className="text-blue-400 font-medium">← Oposisi Kuat (-5)</span>
          <span className="text-gray-400">Independen (0)</span>
          <span className="text-red-400 font-medium">Pro-Pemerintah Kuat (+5) →</span>
        </div>
        {/* Dots */}
        <div className="relative h-12 mx-4 mt-2">
          {outlets.map(outlet => {
            const pct = ((outlet.alignment_score - MIN) / RANGE) * 100
            return (
              <div
                key={outlet.id}
                className="absolute flex flex-col items-center"
                style={{ left: `calc(${pct}% - 20px)`, top: 0 }}
                title={`${outlet.name}: ${outlet.alignment_score}`}
              >
                <div
                  className="w-3 h-3 rounded-full border-2 border-bg-card cursor-pointer hover:scale-150 transition-transform"
                  style={{ backgroundColor: outlet.color }}
                />
                <span className="text-[9px] text-text-secondary mt-1 whitespace-nowrap max-w-[70px] overflow-hidden text-ellipsis text-center leading-tight">
                  {outlet.name.split('/')[0].trim()}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

// ── Owner Card ────────────────────────────────────────────────────────────────
function OwnerCard({ owner }) {
  const ownedOutlets = MEDIA_OUTLETS.filter(m => owner.outlets.includes(m.id))
  const totalReach = ownedOutlets.reduce((s, m) => s + m.reach_millions, 0)
  const initials = owner.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <Card className="p-4 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ backgroundColor: owner.party_color || '#6b7280' }}
        >
          {initials}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            {owner.person_id ? (
              <Link to={`/persons/${owner.person_id}`} className="text-text-primary font-semibold text-sm hover:text-red-400 transition-colors">
                {owner.name}
              </Link>
            ) : (
              <span className="text-text-primary font-semibold text-sm">{owner.name}</span>
            )}
            <Badge color={owner.party_color}>{owner.party}</Badge>
          </div>
          <p className="text-text-secondary text-xs mt-0.5">{owner.group}</p>
        </div>
      </div>

      <div>
        <p className="text-text-secondary text-xs mb-1.5">Media yang dimiliki:</p>
        {ownedOutlets.length > 0 ? (
          <div className="space-y-1.5">
            {ownedOutlets.map(m => (
              <div key={m.id} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{MEDIA_TYPE_CONFIG[m.type]?.icon}</span>
                  <span className="text-text-primary text-xs">{m.name}</span>
                </div>
                <span className="text-text-secondary text-xs">{m.reach_millions}jt</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-text-secondary text-xs italic">Lihat data lengkap untuk outlet lainnya</p>
        )}
      </div>

      {totalReach > 0 && (
        <div className="pt-2 border-t border-border flex items-center justify-between">
          <span className="text-text-secondary text-xs">Total jangkauan (terdata)</span>
          <span className="text-text-primary font-bold text-sm">{totalReach}jt</span>
        </div>
      )}
    </Card>
  )
}

// ── Outlet Card ───────────────────────────────────────────────────────────────
function OutletCard({ outlet }) {
  const typeConf = MEDIA_TYPE_CONFIG[outlet.type] || { icon: '📡', label: outlet.type, color: '#6b7280' }
  const absScore = outlet.alignment_score
  const scoreColor = absScore > 2 ? '#ef4444' : absScore < -2 ? '#3b82f6' : absScore === 0 ? '#6b7280' : absScore > 0 ? '#f97316' : '#60a5fa'

  return (
    <Card className="p-4 flex flex-col gap-2 hover:border-border-strong transition-all" colorLeft={outlet.color}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{typeConf.icon}</span>
          <div>
            <h3 className="text-text-primary font-semibold text-sm">{outlet.name}</h3>
            <p className="text-text-secondary text-xs">{outlet.owner_group}</p>
          </div>
        </div>
        <Badge color={typeConf.color}>{typeConf.label}</Badge>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge
          color={scoreColor}
          className="font-mono"
        >
          {absScore > 0 ? '+' : ''}{absScore} {absScore > 0 ? '📺 Pro-Pemerintah' : absScore < 0 ? '📰 Kritis' : '⚖️ Netral'}
        </Badge>
        <span className="text-text-secondary text-xs">📡 {outlet.reach_millions}jt pembaca/pemirsa</span>
      </div>

      <p className="text-text-secondary text-xs leading-relaxed italic">{outlet.bias_note}</p>

      <p className="text-text-secondary text-xs">📅 Berdiri: {outlet.founded}</p>
    </Card>
  )
}

// ── Custom Scatter Tooltip ─────────────────────────────────────────────────────
function ScatterTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-bg-elevated border border-border rounded-lg p-3 text-xs shadow-xl">
      <p className="text-text-primary font-semibold">{d.name}</p>
      <p className="text-text-secondary">Jangkauan: {d.reach}jt</p>
      <p className="text-text-secondary">Keberpihakan: {d.score > 0 ? '+' : ''}{d.score}</p>
      <p className="text-text-secondary">{d.group}</p>
    </div>
  )
}

// ── A. Cross-Ownership Matrix ─────────────────────────────────────────────────
const MATRIX_COLS = ['TV', 'Cetak', 'Online', 'Radio']
const COL_ICON   = { TV: '📺', Cetak: '📰', Online: '💻', Radio: '📻' }

function CrossOwnershipMatrix() {
  return (
    <Card className="p-5 overflow-x-auto">
      <h2 className="text-text-primary font-semibold mb-1 text-lg">🗂️ Matriks Kepemilikan Lintas Media</h2>
      <p className="text-text-secondary text-xs mb-4">
        Satu konglomerat — berbagai platform. Sel menunjukkan outlet yang dimiliki per jenis media.
      </p>
      <table className="w-full text-xs min-w-[600px]">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 pr-4 text-text-secondary font-medium w-40">Grup Media</th>
            {MATRIX_COLS.map(col => (
              <th key={col} className="text-center py-2 px-3 text-text-secondary font-medium">
                {COL_ICON[col]} {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MEDIA_OWNERSHIP_GROUPS.map(grp => {
            const grpOutlets = MEDIA_OUTLETS.filter(o => grp.outlets.includes(o.id))
            return (
              <tr key={grp.id} className="border-b border-border/40 hover:bg-white/5 transition-colors">
                {/* Group column */}
                <td className="py-3 pr-4 align-top">
                  <div className="flex items-start gap-2">
                    <div
                      className="w-2 h-2 rounded-full mt-0.5 flex-shrink-0"
                      style={{ backgroundColor: grp.party_color }}
                    />
                    <div>
                      <p className="text-text-primary font-medium leading-tight">{grp.name}</p>
                      <p className="text-text-secondary text-[10px] mt-0.5 leading-tight">{grp.owner}</p>
                    </div>
                  </div>
                </td>
                {/* Category columns */}
                {MATRIX_COLS.map(col => {
                  const matches = grpOutlets.filter(o => o.category === col)
                  return (
                    <td key={col} className="py-3 px-3 align-top text-center">
                      {matches.length > 0 ? (
                        <div className="flex flex-col gap-1 items-center">
                          {matches.map(o => (
                            <span
                              key={o.id}
                              className="inline-block px-2 py-0.5 rounded text-[10px] font-medium text-white leading-tight"
                              style={{ backgroundColor: o.color + 'cc' }}
                            >
                              {o.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-border">—</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="text-text-secondary text-[10px] mt-3 italic">
        * MNC Group mendominasi TV (4 channel). CT Corp memimpin digital reach via Detik.com. Kompas Gramedia paling beragam secara platform.
      </p>
    </Card>
  )
}

// ── B. Political Bias Visualization ───────────────────────────────────────────
const BIAS_ORDER = ['oposisi', 'kritis', 'netral', 'pro-pemerintah']
const BIAS_LABELS = {
  'oposisi':        { label: 'Oposisi Kuat', color: '#3b82f6',  bg: '#1d4ed8' },
  'kritis':         { label: 'Kritis',       color: '#60a5fa',  bg: '#2563eb' },
  'netral':         { label: 'Netral',       color: '#9ca3af',  bg: '#4b5563' },
  'pro-pemerintah': { label: 'Pro-Pemerintah', color: '#ef4444', bg: '#b91c1c' },
}

function PoliticalBiasChart() {
  const [filter, setFilter] = useState('all')

  const displayed = filter === 'all'
    ? MEDIA_OUTLETS
    : MEDIA_OUTLETS.filter(o => o.bias_direction === filter)

  // sort by alignment_score ascending (most opposition first)
  const sorted = [...displayed].sort((a, b) => a.alignment_score - b.alignment_score)

  const MIN = -5, MAX = 5, RANGE = MAX - MIN

  return (
    <Card className="p-5">
      <h2 className="text-text-primary font-semibold mb-1 text-lg">📊 Peta Keberpihakan Media</h2>
      <p className="text-text-secondary text-xs mb-4">
        Setiap baris menunjukkan posisi keberpihakan satu outlet media. Garis tengah = netral.
      </p>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded text-xs font-medium border transition-all ${
            filter === 'all' ? 'bg-white/10 text-text-primary border-border-strong' : 'text-text-secondary border-border hover:border-border-strong'
          }`}
        >Semua</button>
        {BIAS_ORDER.map(b => (
          <button
            key={b}
            onClick={() => setFilter(b)}
            className={`px-3 py-1 rounded text-xs font-medium border transition-all ${
              filter === b ? 'text-white border-transparent' : 'text-text-secondary border-border hover:border-border-strong'
            }`}
            style={filter === b ? { backgroundColor: BIAS_LABELS[b].bg } : {}}
          >
            {BIAS_LABELS[b].label}
          </button>
        ))}
      </div>

      {/* Axis header */}
      <div className="flex items-center gap-2 mb-2 px-1">
        <div className="w-32 flex-shrink-0" />
        <div className="flex-1 flex justify-between text-[9px] text-text-secondary">
          <span className="text-blue-400">← Oposisi Kuat (-5)</span>
          <span className="text-gray-400">Netral (0)</span>
          <span className="text-red-400">Pro-Pemerintah Kuat (+5) →</span>
        </div>
      </div>

      {/* Center line reference */}
      <div className="relative">
        <div className="space-y-1.5">
          {sorted.map(outlet => {
            const pct = ((outlet.alignment_score - MIN) / RANGE) * 100
            const bConf = BIAS_LABELS[outlet.bias_direction] || BIAS_LABELS['netral']
            return (
              <div key={outlet.id} className="flex items-center gap-2">
                {/* Name */}
                <div className="w-32 flex-shrink-0 text-right">
                  <span className="text-text-secondary text-[10px] leading-tight">{outlet.name.split('/')[0].trim()}</span>
                </div>
                {/* Bar track */}
                <div className="flex-1 relative h-5 bg-white/5 rounded overflow-hidden">
                  {/* Center line */}
                  <div className="absolute inset-y-0 left-1/2 w-px bg-gray-600 z-10" />
                  {/* Score dot + bar */}
                  <div
                    className="absolute inset-y-0 flex items-center"
                    style={{
                      left: outlet.alignment_score < 0 ? `${pct}%` : '50%',
                      width: `${Math.abs(outlet.alignment_score) / RANGE * 100}%`,
                      backgroundColor: bConf.color + '55',
                    }}
                  />
                  {/* Dot */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full z-20"
                    style={{
                      left: `calc(${pct}% - 6px)`,
                      backgroundColor: bConf.color,
                    }}
                    title={`${outlet.name}: ${outlet.alignment_score > 0 ? '+' : ''}${outlet.alignment_score}`}
                  />
                </div>
                {/* Score */}
                <div className="w-8 flex-shrink-0">
                  <span
                    className="text-[10px] font-mono font-bold"
                    style={{ color: bConf.color }}
                  >
                    {outlet.alignment_score > 0 ? '+' : ''}{outlet.alignment_score}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-border">
        {BIAS_ORDER.map(b => (
          <div key={b} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: BIAS_LABELS[b].color }} />
            <span className="text-text-secondary text-[10px]">{BIAS_LABELS[b].label}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── C. Audience Bubble Chart (Reach × Bias × Revenue) ────────────────────────
function AudienceBubbleTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-bg-elevated border border-border rounded-lg p-3 text-xs shadow-xl max-w-[200px]">
      <p className="text-text-primary font-semibold mb-1">{d.name}</p>
      <p className="text-text-secondary">📡 Jangkauan: <span className="text-text-primary font-medium">{d.audience}jt</span></p>
      <p className="text-text-secondary">💰 Estimasi Revenue: <span className="text-text-primary font-medium">Rp {d.revenue}M</span></p>
      <p className="text-text-secondary">🏢 Grup: {d.group}</p>
      <p className="text-text-secondary">📊 Bias score: {d.biasScore > 0 ? '+' : ''}{d.biasScore}</p>
    </div>
  )
}

function AudienceBubbleChart() {
  // Convert alignment_score (-5..+5) → political_score (1..5)
  const bubbleData = MEDIA_OUTLETS.map(o => ({
    id: o.id,
    name: o.name.split('/')[0].trim(),
    group: o.owner_group,
    biasScore: o.alignment_score,
    // map -5..+5 to 1..5
    politicalScore: Math.round(((o.alignment_score + 5) / 10) * 4 + 1),
    audience: o.audience_millions,
    revenue: o.revenue_idr,
    // bubble Z = revenue scaled (min 200 max 4000 → r proportional)
    z: o.revenue_idr,
    color: o.color,
    bias: o.bias_direction,
  }))

  return (
    <Card className="p-5">
      <h2 className="text-text-primary font-semibold mb-1 text-lg">🫧 Jangkauan & Bobot Revenue Media</h2>
      <p className="text-text-secondary text-xs mb-1">
        X: Posisi politik (1=oposisi kuat → 5=pro-pemerintah kuat) · Y: Jangkauan (juta pembaca/pemirsa) · Ukuran: Estimasi revenue (Rp miliar)
      </p>
      <div className="grid grid-cols-2 gap-1 mb-3 text-[10px]">
        <div className="flex items-center gap-1 text-text-secondary">
          <div className="w-3 h-3 rounded-sm bg-blue-600/30 border border-blue-600/50" />
          <span>Kritis &amp; Besar → Kekuatan Oposisi</span>
        </div>
        <div className="flex items-center gap-1 text-text-secondary">
          <div className="w-3 h-3 rounded-sm bg-red-600/30 border border-red-600/50" />
          <span>Pro-Pemerintah &amp; Besar → Dominasi Narasi</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={380}>
        <ScatterChart margin={{ top: 30, right: 50, bottom: 30, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            type="number"
            dataKey="politicalScore"
            domain={[0.5, 5.5]}
            ticks={[1, 2, 3, 4, 5]}
            tickFormatter={(v) => ['', 'Oposisi', 'Kritis', 'Netral', 'Pro-P', 'Pro-P Kuat'][v] || v}
            stroke="#6b7280"
            tick={{ fontSize: 9, fill: '#9ca3af' }}
            label={{ value: 'Posisi Politik (1=oposisi → 5=pro-pemerintah)', position: 'insideBottom', offset: -15, fill: '#9ca3af', fontSize: 10 }}
          />
          <YAxis
            type="number"
            dataKey="audience"
            stroke="#6b7280"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            label={{ value: 'Jangkauan (juta)', angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 10 }}
          />
          <ZAxis type="number" dataKey="z" range={[100, 2500]} />
          {/* Quadrant lines */}
          <ReferenceLine x={3} stroke="#6b7280" strokeDasharray="4 4" />
          <ReferenceLine y={30} stroke="#6b7280" strokeDasharray="4 4" />
          <Tooltip content={<AudienceBubbleTooltip />} />
          <Scatter
            data={bubbleData}
            shape={(props) => {
              const { cx, cy, payload } = props
              const r = Math.sqrt(props.r || 20)
              return (
                <g>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={Math.sqrt(payload.z / 8)}
                    fill={payload.color}
                    fillOpacity={0.55}
                    stroke={payload.color}
                    strokeWidth={1.5}
                  />
                  <text
                    x={cx}
                    y={cy - Math.sqrt(payload.z / 8) - 4}
                    textAnchor="middle"
                    fill="#e5e7eb"
                    fontSize={8}
                    fontWeight="500"
                  >
                    {payload.name}
                  </text>
                </g>
              )
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>

      {/* Quadrant labels overlay */}
      <div className="grid grid-cols-2 gap-2 mt-2 text-[10px]">
        <div className="rounded p-2 bg-blue-600/10 border border-blue-600/20">
          <p className="text-blue-400 font-medium">↖ Kritis &amp; Besar</p>
          <p className="text-text-secondary">Audience besar + kritis → pengaruh oposisi tinggi</p>
        </div>
        <div className="rounded p-2 bg-red-600/10 border border-red-600/20">
          <p className="text-red-400 font-medium">↗ Pro-Pemerintah &amp; Besar</p>
          <p className="text-text-secondary">Audience besar + pro-pemerintah → dominasi narasi</p>
        </div>
        <div className="rounded p-2 bg-blue-600/5 border border-border/30">
          <p className="text-blue-300 font-medium">↙ Kritis &amp; Kecil</p>
          <p className="text-text-secondary">Niche kritis — penting tapi jangkauan terbatas</p>
        </div>
        <div className="rounded p-2 bg-red-600/5 border border-border/30">
          <p className="text-red-300 font-medium">↘ Pro-Pemerintah &amp; Kecil</p>
          <p className="text-text-secondary">Pro-pemerintah tapi pengaruh terbatas</p>
        </div>
      </div>
    </Card>
  )
}

// ── D. Owner Political Timeline ────────────────────────────────────────────────
function TimelineArrow() {
  return (
    <div className="flex items-center flex-shrink-0 mx-1">
      <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
        <path d="M0 6H16M16 6L10 1M16 6L10 11" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function OwnerTimeline() {
  const majorGroups = MEDIA_OWNERSHIP_GROUPS.filter(g => g.outlets.length > 0)

  return (
    <Card className="p-5">
      <h2 className="text-text-primary font-semibold mb-1 text-lg">🔗 Jaringan Pemilik → Politik → Media</h2>
      <p className="text-text-secondary text-xs mb-5">
        Alur: Pemilik / Konglomerat → Koneksi Partai/Kekuasaan → Peran Kabinet/Pemilu → Outlet Media yang Dikendalikan
      </p>

      <div className="space-y-4">
        {majorGroups.map(grp => {
          const grpOutlets = MEDIA_OUTLETS.filter(o => grp.outlets.includes(o.id))
          return (
            <div
              key={grp.id}
              className="rounded-lg border border-border/60 p-4 hover:border-border-strong transition-colors"
            >
              {/* Mobile: stacked, Desktop: horizontal flow */}
              <div className="flex flex-wrap items-start gap-2 md:items-center">

                {/* 1. Owner */}
                <div
                  className="flex-shrink-0 rounded-lg px-3 py-2 border text-xs min-w-[120px]"
                  style={{ borderColor: grp.party_color + '66', backgroundColor: grp.party_color + '15' }}
                >
                  <p className="text-[10px] text-text-secondary mb-0.5 uppercase tracking-wide">Pemilik</p>
                  <p className="text-text-primary font-semibold leading-tight">{grp.owner}</p>
                  <p className="text-text-secondary text-[10px] leading-tight mt-0.5">{grp.name}</p>
                </div>

                <TimelineArrow />

                {/* 2. Party */}
                <div
                  className="flex-shrink-0 rounded-lg px-3 py-2 border text-xs min-w-[100px]"
                  style={{ borderColor: grp.party_color + '88', backgroundColor: grp.party_color + '22' }}
                >
                  <p className="text-[10px] text-text-secondary mb-0.5 uppercase tracking-wide">Partai</p>
                  <p className="font-bold leading-tight" style={{ color: grp.party_color }}>{grp.party}</p>
                  <p className="text-text-secondary text-[9px] leading-tight mt-0.5">{grp.political_link_detail.split('.')[0]}</p>
                </div>

                <TimelineArrow />

                {/* 3. Cabinet/Election Role */}
                <div className="flex-shrink-0 rounded-lg px-3 py-2 border border-amber-600/40 bg-amber-600/10 text-xs min-w-[130px]">
                  <p className="text-[10px] text-amber-400 mb-0.5 uppercase tracking-wide">Peran Kekuasaan</p>
                  <p className="text-text-primary text-[10px] font-medium leading-tight">
                    {grp.cabinet_role || '—'}
                  </p>
                  <p className="text-amber-300/70 text-[9px] leading-tight mt-0.5">
                    Pilpres 2024: {grp.election_2024}
                  </p>
                </div>

                <TimelineArrow />

                {/* 4. Outlets */}
                <div className="flex-1 rounded-lg px-3 py-2 border border-border/40 bg-white/3 text-xs min-w-[160px]">
                  <p className="text-[10px] text-text-secondary mb-1.5 uppercase tracking-wide">
                    Outlet Media ({grpOutlets.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {grpOutlets.map(o => (
                      <span
                        key={o.id}
                        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] text-white font-medium"
                        style={{ backgroundColor: o.color + 'bb' }}
                      >
                        {MEDIA_TYPE_CONFIG[o.type]?.icon} {o.name.split('/')[0].trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-text-secondary text-[10px] mt-3 leading-relaxed border-t border-border/30 pt-2">
                {grp.description}
              </p>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MediaOwnership() {
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredOutlets = typeFilter === 'all'
    ? MEDIA_OUTLETS
    : MEDIA_OUTLETS.filter(m => m.type === typeFilter)

  const totalReach = MEDIA_OUTLETS.reduce((s, m) => s + m.reach_millions, 0)
  const proGovt = MEDIA_OUTLETS.filter(m => m.alignment_score > 0).length
  const oppositionMedia = MEDIA_OUTLETS.filter(m => m.alignment_score < 0).length
  const totalRevenue = MEDIA_OUTLETS.reduce((s, m) => s + (m.revenue_idr || 0), 0)

  const scatterData = MEDIA_OUTLETS.map(m => ({
    score: m.alignment_score,
    reach: m.reach_millions,
    name: m.name.split('/')[0].trim(),
    group: m.owner_group,
    color: m.color,
  }))

  const FILTER_BTN = 'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border'
  const activeFilter = 'bg-red-600 text-white border-red-600'
  const inactiveFilter = 'text-text-secondary border-border hover:border-border-strong hover:text-text-primary'

  return (
    <div className="space-y-6">
      <PageHeader
        title="🗞️ Peta Kepemilikan Media"
        subtitle="Siapa memiliki suara Indonesia? Pemetaan kepemilikan dan keberpihakan politik media nasional."
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Total Media Terdata" value={MEDIA_OUTLETS.length} icon="📡" sub="outlet nasional" />
        <KPICard label="Total Jangkauan" value={`${totalReach}jt`} icon="👥" color="#3b82f6" sub="pembaca/pemirsa" />
        <KPICard label="Media Pro-Pemerintah" value={proGovt} icon="📺" color="#ef4444" sub="alignment > 0" />
        <KPICard label="Media Kritis/Oposisi" value={oppositionMedia} icon="📰" color="#3b82f6" sub="alignment < 0" />
      </div>

      {/* Section 1: Bias Spectrum */}
      <BiasSpectrum outlets={MEDIA_OUTLETS} />

      {/* Section 2: Owner Cards */}
      <div>
        <h2 className="text-text-primary font-semibold mb-4 text-lg">👔 Pemilik Media Utama</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MEDIA_OWNERS.map(owner => <OwnerCard key={owner.id} owner={owner} />)}
        </div>
      </div>

      {/* Section 3: Outlet Grid */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-text-primary font-semibold text-lg">📋 Semua Outlet Media</h2>
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => setTypeFilter('all')}
              className={`${FILTER_BTN} ${typeFilter === 'all' ? activeFilter : inactiveFilter}`}
            >Semua</button>
            {Object.entries(MEDIA_TYPE_CONFIG).map(([k, v]) => (
              <button
                key={k}
                onClick={() => setTypeFilter(k)}
                className={`${FILTER_BTN} ${typeFilter === k ? activeFilter : inactiveFilter}`}
              >
                {v.icon} {v.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredOutlets.map(m => <OutletCard key={m.id} outlet={m} />)}
        </div>
      </div>

      {/* Section 4: Scatter Chart (original) */}
      <Card className="p-5">
        <h2 className="text-text-primary font-semibold mb-1">📊 Jangkauan vs Keberpihakan</h2>
        <p className="text-text-secondary text-xs mb-4">
          Sumbu X: Skor keberpihakan (−5 oposisi ↔ +5 pro-pemerintah) • Sumbu Y: Jangkauan (juta)
        </p>
        <ResponsiveContainer width="100%" height={320}>
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis
              type="number"
              dataKey="score"
              domain={[-5, 5]}
              ticks={[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]}
              stroke="#6b7280"
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              label={{ value: 'Keberpihakan Politik', position: 'insideBottom', offset: -10, fill: '#9ca3af', fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="reach"
              stroke="#6b7280"
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              label={{ value: 'Jangkauan (juta)', angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 11 }}
            />
            <ReferenceLine x={0} stroke="#6b7280" strokeDasharray="4 4" label={{ value: 'Netral', fill: '#9ca3af', fontSize: 10 }} />
            <Tooltip content={<ScatterTooltip />} />
            <Scatter
              data={scatterData}
              shape={(props) => {
                const { cx, cy, payload } = props
                return (
                  <g>
                    <circle cx={cx} cy={cy} r={Math.sqrt(payload.reach) * 1.2} fill={payload.color} fillOpacity={0.7} stroke={payload.color} strokeWidth={1.5} />
                    <text x={cx} y={cy - Math.sqrt(payload.reach) * 1.2 - 4} textAnchor="middle" fill="#e5e7eb" fontSize={9}>{payload.name}</text>
                  </g>
                )
              }}
            />
          </ScatterChart>
        </ResponsiveContainer>
        <p className="text-text-secondary text-xs mt-2 text-center italic">
          Ukuran lingkaran sebanding dengan jangkauan. Detik.com (120jt) dan Tribun (80jt) mendominasi — campuran netral dan pro-pemerintah.
        </p>
      </Card>

      {/* ── NEW SECTIONS ──────────────────────────────────────────────────────── */}

      {/* Section 5: Cross-Ownership Matrix */}
      <CrossOwnershipMatrix />

      {/* Section 6: Political Bias Chart */}
      <PoliticalBiasChart />

      {/* Section 7: Audience Bubble Chart */}
      <AudienceBubbleChart />

      {/* Section 8: Owner Political Timeline */}
      <OwnerTimeline />

      {/* Disclaimer */}
      <Card className="p-4 border-blue-500/30 bg-blue-500/5">
        <p className="text-blue-400 text-xs">
          ℹ️ <strong>Disclaimer:</strong> Data berdasarkan kepemilikan publik dan analisis editorial.
          Bukan pernyataan afiliasi resmi. Skor keberpihakan bersifat estimasi berdasarkan observasi
          pemberitaan, kepemilikan, dan pernyataan publik pemilik. Media dapat berubah arah setiap saat.
          Estimasi revenue dan jangkauan berdasarkan data publik dan laporan industri; bukan angka resmi audit.
        </p>
      </Card>
    </div>
  )
}
