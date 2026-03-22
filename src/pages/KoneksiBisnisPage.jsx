import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend,
} from 'recharts'
import { PageHeader } from '../components/ui'
import {
  BUSINESS_EMPIRES,
  POLITICAL_COI_MAP,
  SECTOR_CONCENTRATION,
  COI_TIMELINE,
} from '../data/business'

// ─── Helpers & Configs ───────────────────────────────────────────────────────

const RISK_CONFIG = {
  tinggi: {
    label: 'Tinggi',
    badge: 'bg-red-900/40 text-red-400 border-red-700/40',
    dot: 'bg-red-500',
    icon: '🔴',
    glow: 'border-red-700/50 shadow-red-900/20',
  },
  sedang: {
    label: 'Sedang',
    badge: 'bg-yellow-900/40 text-yellow-400 border-yellow-700/40',
    dot: 'bg-yellow-500',
    icon: '🟡',
    glow: 'border-yellow-700/50 shadow-yellow-900/20',
  },
  rendah: {
    label: 'Rendah',
    badge: 'bg-green-900/40 text-green-400 border-green-700/40',
    dot: 'bg-green-500',
    icon: '🟢',
    glow: 'border-green-700/50',
  },
}

function RiskBadge({ risk, size = 'sm' }) {
  const cfg = RISK_CONFIG[risk] || RISK_CONFIG.sedang
  const sz = size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs'
  return (
    <span className={`inline-flex items-center gap-1.5 ${sz} rounded-md font-medium border ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      COI {cfg.label}
    </span>
  )
}

// ─── Section 1: KPI Bar ───────────────────────────────────────────────────────

function KPIBar() {
  const coiHighCount = POLITICAL_COI_MAP.filter(x => x.severity === 'tinggi').length
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {[
        { icon: '🏢', label: 'Konglomerat Terpetakan', value: BUSINESS_EMPIRES.length, sub: 'grup bisnis utama', color: 'text-blue-400' },
        { icon: '⚠️', label: 'COI Risiko Tinggi', value: coiHighCount, sub: 'kasus aktif disorot', color: 'text-red-400' },
        { icon: '📺', label: 'Sektor Terkonsentrasi', value: SECTOR_CONCENTRATION.length, sub: 'sektor termonitor', color: 'text-purple-400' },
        { icon: '📅', label: 'Kasus Timeline', value: COI_TIMELINE.length, sub: 'dugaan COI 2020–2025', color: 'text-amber-400' },
      ].map(k => (
        <div key={k.label} className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{k.icon}</span>
            <span className={`text-2xl font-bold ${k.color}`}>{k.value}</span>
          </div>
          <div className="text-sm font-medium text-foreground">{k.label}</div>
          <div className="text-xs text-muted-foreground">{k.sub}</div>
        </div>
      ))}
    </div>
  )
}

// ─── Section 1: Empire Cards ──────────────────────────────────────────────────

function EmpireCard({ empire, selected, onClick }) {
  const risk = RISK_CONFIG[empire.coi_risk] || RISK_CONFIG.sedang
  const isSelected = selected === empire.id
  return (
    <button
      onClick={() => onClick(isSelected ? null : empire.id)}
      className={`text-left w-full bg-card rounded-xl border p-5 transition-all duration-200 hover:shadow-lg ${
        isSelected
          ? `border-2 shadow-lg ${risk.glow}`
          : 'border-border hover:border-border/80'
      }`}
      style={isSelected ? { borderColor: empire.color + '80' } : {}}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <span
            className="text-3xl w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: empire.color + '20' }}
          >
            {empire.icon}
          </span>
          <div>
            <div className="font-bold text-foreground text-sm leading-tight">{empire.nama}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {empire.tokoh_nama.join(', ')}
            </div>
          </div>
        </div>
        <RiskBadge risk={empire.coi_risk} />
      </div>

      {/* Value */}
      <div
        className="text-lg font-bold mb-3 tabular-nums"
        style={{ color: empire.color }}
      >
        {empire.estimasi_nilai}
      </div>

      {/* Jabatan chips */}
      <div className="flex flex-wrap gap-1 mb-3">
        {empire.jabatan_politik.map(j => (
          <span key={j} className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
            {j}
          </span>
        ))}
      </div>

      {/* Sektor */}
      <div className="flex flex-wrap gap-1 mb-3">
        {empire.sektor.map(s => (
          <span
            key={s}
            className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
            style={{ background: empire.color + '20', color: empire.color }}
          >
            {s}
          </span>
        ))}
      </div>

      {/* Expanded: aset & catatan */}
      {isSelected && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Aset Utama
          </div>
          <ul className="space-y-1 mb-3">
            {empire.aset_utama.map(a => (
              <li key={a} className="text-xs text-foreground/80 flex gap-2">
                <span style={{ color: empire.color }}>▸</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
          {empire.catatan && (
            <div className="text-xs text-amber-300/80 bg-amber-900/20 border border-amber-700/30 rounded-lg p-3 italic">
              ⚠️ {empire.catatan}
            </div>
          )}
        </div>
      )}
    </button>
  )
}

function EmpireSection() {
  const [selected, setSelected] = useState(null)
  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">🏛️</span>
        <div>
          <h2 className="text-lg font-bold text-foreground">Imperium Bisnis Berpengaruh</h2>
          <p className="text-sm text-muted-foreground">
            Konglomerat dengan koneksi politik terkuat — klik kartu untuk detail aset
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {BUSINESS_EMPIRES.map(e => (
          <EmpireCard key={e.id} empire={e} selected={selected} onClick={setSelected} />
        ))}
      </div>
    </section>
  )
}

// ─── Section 2: COI Map Table ─────────────────────────────────────────────────

function COIMapSection() {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? POLITICAL_COI_MAP : POLITICAL_COI_MAP.filter(x => x.severity === filter)

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚖️</span>
          <div>
            <h2 className="text-lg font-bold text-foreground">Peta Konflik Kepentingan Politik–Bisnis</h2>
            <p className="text-sm text-muted-foreground">
              Jabatan publik vs kepentingan bisnis — potensi penyalahgunaan wewenang
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {['all', 'tinggi', 'sedang'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                filter === f
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:border-border/80'
              }`}
            >
              {f === 'all' ? 'Semua' : f === 'tinggi' ? '🔴 Tinggi' : '🟡 Sedang'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Tokoh
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Jabatan
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Bisnis / Kepentingan
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
                  Potensi COI
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Risiko
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => {
                const risk = RISK_CONFIG[row.severity] || RISK_CONFIG.sedang
                return (
                  <tr
                    key={row.id}
                    className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${
                      i % 2 === 0 ? '' : 'bg-muted/10'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{row.flag}</span>
                        <div>
                          <div className="font-medium text-foreground">{row.nama}</div>
                          <div className="text-xs text-muted-foreground">{row.partai}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-foreground/90">{row.jabatan}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-foreground/80">{row.bisnis}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-muted-foreground italic">{row.potensi_coi}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${risk.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${risk.dot}`} />
                        {risk.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-muted-foreground">{row.status}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

// ─── Section 3: Sector Concentration ─────────────────────────────────────────

const RADAR_DATA = [
  { subject: 'Media', dominasi: 85, pemain: 5 },
  { subject: 'Pertambangan', dominasi: 70, pemain: 4 },
  { subject: 'Properti', dominasi: 60, pemain: 4 },
  { subject: 'Perbankan', dominasi: 75, pemain: 4 },
  { subject: 'Agribisnis', dominasi: 65, pemain: 3 },
]

function CustomBarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-popover border border-border rounded-lg p-3 shadow-xl text-xs">
      <div className="font-semibold text-foreground mb-2">{label}</div>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="text-foreground font-medium">
            {p.value}{p.name === 'Konsentrasi (%)' ? '%' : ' pemain'}
          </span>
        </div>
      ))}
    </div>
  )
}

function SectorSection() {
  const [view, setView] = useState('bar')
  const barData = SECTOR_CONCENTRATION.map(s => ({
    name: s.sektor,
    'Konsentrasi (%)': s.dominasi_persen,
    'Jumlah Pemain': s.pemain.length,
    fill: s.warna,
  }))

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📊</span>
          <div>
            <h2 className="text-lg font-bold text-foreground">Konsentrasi Sektor Oligarki</h2>
            <p className="text-sm text-muted-foreground">
              Derajat dominasi politisi–pengusaha di tiap sektor strategis
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {['bar', 'radar'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                view === v
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:border-border/60'
              }`}
            >
              {v === 'bar' ? '📊 Bar' : '🕸️ Radar'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="h-64">
            {view === 'bar' ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 100]}
                    tickFormatter={v => `${v}%`}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="Konsentrasi (%)" radius={[4, 4, 0, 0]}>
                    {barData.map((entry, i) => (
                      <rect key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={RADAR_DATA}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }}
                  />
                  <Radar
                    name="Konsentrasi (%)"
                    dataKey="dominasi"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.25}
                  />
                  <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Sector breakdown cards */}
        <div className="space-y-3">
          {SECTOR_CONCENTRATION.map(s => (
            <div key={s.sektor} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: s.warna }}
                  />
                  <span className="font-semibold text-sm text-foreground">{s.sektor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{s.pemain.length} pemain dominan</span>
                  <RiskBadge risk={s.risiko} />
                </div>
              </div>
              {/* Concentration bar */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${s.dominasi_persen}%`, background: s.warna }}
                  />
                </div>
                <span className="text-xs font-bold" style={{ color: s.warna }}>
                  {s.dominasi_persen}%
                </span>
              </div>
              {/* Pemain chips */}
              <div className="flex flex-wrap gap-1">
                {s.pemain.map(p => (
                  <span
                    key={p.nama}
                    className="text-xs px-2 py-0.5 rounded border"
                    style={{
                      background: s.warna + '15',
                      borderColor: s.warna + '40',
                      color: s.warna,
                    }}
                  >
                    {p.nama.split(' (')[0]}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Section 4: COI Timeline ──────────────────────────────────────────────────

const SEVERITY_COLORS = {
  tinggi: { line: '#ef4444', bg: 'bg-red-900/30', border: 'border-red-700/40', text: 'text-red-400' },
  sedang: { line: '#f59e0b', bg: 'bg-yellow-900/30', border: 'border-yellow-700/40', text: 'text-yellow-400' },
}

function COITimeline() {
  const [expanded, setExpanded] = useState(null)

  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🕰️</span>
        <div>
          <h2 className="text-lg font-bold text-foreground">Kronologi Dugaan Konflik Kepentingan</h2>
          <p className="text-sm text-muted-foreground">
            2020–2025 — kasus-kasus yang mencuat ke permukaan
          </p>
        </div>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-4">
          {COI_TIMELINE.map((item, i) => {
            const cfg = SEVERITY_COLORS[item.severity] || SEVERITY_COLORS.sedang
            const isOpen = expanded === i

            return (
              <div key={i} className="relative pl-16">
                {/* Dot on timeline */}
                <div
                  className="absolute left-4 top-4 w-5 h-5 rounded-full border-2 border-background flex items-center justify-center text-xs z-10"
                  style={{ background: cfg.line }}
                >
                  <span className="text-white text-[9px] font-bold">{item.tahun % 100}</span>
                </div>

                <button
                  onClick={() => setExpanded(isOpen ? null : i)}
                  className={`w-full text-left bg-card rounded-xl border p-4 transition-all hover:shadow-md ${
                    isOpen ? `${cfg.border} ${cfg.bg}` : 'border-border hover:border-border/80'
                  }`}
                >
                  {/* Row header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded"
                            style={{ background: cfg.line + '20', color: cfg.line }}
                          >
                            {item.tahun} · {item.bulan}
                          </span>
                          <span className={`text-xs font-semibold ${cfg.text}`}>
                            {item.aktor}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            — {item.jabatan}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-foreground">{item.kasus}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <RiskBadge risk={item.severity} />
                      <span className="text-muted-foreground text-sm">{isOpen ? '▴' : '▾'}</span>
                    </div>
                  </div>

                  {/* Expanded */}
                  {isOpen && (
                    <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                      <p className="text-sm text-foreground/80 leading-relaxed">{item.deskripsi}</p>
                      <div className="flex flex-wrap gap-3 text-xs">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span className="font-medium">Status:</span> {item.status}
                        </span>
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                          <span className="font-medium">Sumber:</span> {item.sumber}
                        </span>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Disclaimer ───────────────────────────────────────────────────────────────

function Disclaimer() {
  return (
    <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl p-4 mb-8 flex gap-3">
      <span className="text-xl flex-shrink-0">⚠️</span>
      <div className="text-xs text-amber-300/80 leading-relaxed">
        <span className="font-semibold text-amber-300">Catatan Editorial:</span>{' '}
        Data dalam halaman ini diambil dari sumber-sumber publik (laporan NGO, investigasi media, dokumen LHKPN, dan
        pernyataan resmi). Dugaan konflik kepentingan bukan berarti terbukti bersalah secara hukum.
        PetaPolitik menyajikan konteks untuk mendorong transparansi dan akuntabilitas publik.
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function KoneksiBisnisPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <PageHeader
          title="💼 Koneksi Bisnis"
          subtitle="Peta kepemilikan bisnis politisi, konsentrasi oligarki, dan dugaan konflik kepentingan"
        />

        <Disclaimer />
        <KPIBar />
        <EmpireSection />
        <COIMapSection />
        <SectorSection />
        <COITimeline />
      </div>
    </div>
  )
}
