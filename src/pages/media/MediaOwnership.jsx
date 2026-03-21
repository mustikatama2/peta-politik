import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LabelList, ReferenceLine,
} from 'recharts'
import { PageHeader, Card, Badge, KPICard } from '../../components/ui'
import { MEDIA_OUTLETS, MEDIA_OWNERS, MEDIA_TYPE_CONFIG } from '../../data/media'

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

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MediaOwnership() {
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredOutlets = typeFilter === 'all'
    ? MEDIA_OUTLETS
    : MEDIA_OUTLETS.filter(m => m.type === typeFilter)

  const totalReach = MEDIA_OUTLETS.reduce((s, m) => s + m.reach_millions, 0)
  const proGovt = MEDIA_OUTLETS.filter(m => m.alignment_score > 0).length
  const oppositionMedia = MEDIA_OUTLETS.filter(m => m.alignment_score < 0).length

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

      {/* Section 4: Scatter Chart */}
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
          Ukuran lingkaran sebanding dengan jangkauan. Detik.com (120jt) dan MNC/RCTI (75jt) mendominasi — keduanya pro-pemerintah.
        </p>
      </Card>

      {/* Disclaimer */}
      <Card className="p-4 border-blue-500/30 bg-blue-500/5">
        <p className="text-blue-400 text-xs">
          ℹ️ <strong>Disclaimer:</strong> Data berdasarkan kepemilikan publik dan analisis editorial.
          Bukan pernyataan afiliasi resmi. Skor keberpihakan bersifat estimasi berdasarkan observasi
          pemberitaan, kepemilikan, dan pernyataan publik pemilik. Media dapat berubah arah setiap saat.
        </p>
      </Card>
    </div>
  )
}
