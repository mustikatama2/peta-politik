import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { PageHeader, Card, Badge, KPICard, Btn, formatIDR } from '../../components/ui'
import { KPK_CASES, INSTITUTION_CONFIG, STATUS_CONFIG, STAGE_STEPS, ARREST_TYPE_CONFIG } from '../../data/kpk_cases'
import { PERSONS_MAP } from '../../data/persons'
import { exportToCSV } from '../../lib/exportUtils'

// ── Stage Progress Bar ────────────────────────────────────────────────────────
function StageBar({ stage }) {
  const currentIdx = STAGE_STEPS.indexOf(stage)
  return (
    <div className="flex gap-1 items-center mt-2">
      {STAGE_STEPS.map((s, i) => (
        <div key={s} className="flex-1 flex flex-col items-center gap-1">
          <div
            className={`h-1.5 w-full rounded-full transition-all ${
              i <= currentIdx ? 'bg-red-500' : 'bg-bg-elevated'
            }`}
          />
          <span className={`text-[9px] leading-tight text-center ${
            i === currentIdx ? 'text-red-400 font-semibold' : 'text-text-secondary'
          }`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Case Card ─────────────────────────────────────────────────────────────────
function CaseCard({ kasus }) {
  const inst = INSTITUTION_CONFIG[kasus.institution] || { color: '#6b7280', icon: '⚪', label: kasus.institution }
  const stat = STATUS_CONFIG[kasus.status] || STATUS_CONFIG.tersangka
  const arrest = ARREST_TYPE_CONFIG[kasus.arrest_type]

  return (
    <Card className="p-4 flex flex-col gap-3 hover:border-border-strong transition-all" colorLeft={inst.color}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Badge color={inst.color}>{inst.icon} {inst.label}</Badge>
            <Badge color={stat.color}>{stat.label}</Badge>
            {arrest?.prominent && (
              <Badge color="#ef4444" className="animate-pulse">⚡ OTT</Badge>
            )}
            {kasus.arrest_type && !arrest?.prominent && (
              <Badge color={arrest?.color || '#6b7280'}>{arrest?.label || kasus.arrest_type}</Badge>
            )}
          </div>
          <h3 className="text-text-primary font-semibold text-sm leading-snug">{kasus.title}</h3>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-[10px] text-text-secondary">{kasus.date_start}</p>
          {kasus.date_vonis && <p className="text-[10px] text-green-400">Vonis: {kasus.date_vonis}</p>}
        </div>
      </div>

      {/* Stage progress */}
      <StageBar stage={kasus.stage} />

      {/* Charges */}
      <p className="text-text-secondary text-xs leading-relaxed">{kasus.charges}</p>

      {/* Suspects */}
      {kasus.suspects && kasus.suspects.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <span className="text-text-secondary text-xs mr-1">Tersangka:</span>
          {kasus.suspects.map(sid => {
            const person = PERSONS_MAP[sid]
            return person ? (
              <Link
                key={sid}
                to={`/persons/${sid}`}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-bg-elevated border border-border text-text-primary text-xs hover:text-red-400 hover:border-red-500 transition-colors"
              >
                👤 {person.name}
              </Link>
            ) : (
              <span key={sid} className="text-text-secondary text-xs italic">{sid}</span>
            )
          })}
        </div>
      )}

      {/* Losses + Vonis */}
      <div className="flex flex-wrap gap-3">
        {kasus.losses_idr && (
          <div className="flex items-center gap-1.5">
            <span className="text-text-secondary text-xs">💸 Kerugian:</span>
            <span className="text-red-400 font-semibold text-xs">{formatIDR(kasus.losses_idr)}</span>
          </div>
        )}
        {kasus.vonis_years && (
          <div className="flex items-center gap-1.5">
            <span className="text-text-secondary text-xs">⚖️ Vonis:</span>
            <span className="text-orange-400 font-semibold text-xs">{kasus.vonis_years} tahun</span>
          </div>
        )}
      </div>

      {/* Notes */}
      {kasus.notes && (
        <p className="text-text-secondary text-xs italic border-l-2 border-border pl-2">
          {kasus.notes}
        </p>
      )}

      {/* Source */}
      <p className="text-text-secondary text-[10px]">📌 {kasus.source}</p>
    </Card>
  )
}

// ── Timeline Item ─────────────────────────────────────────────────────────────
function TimelineItem({ kasus, isLast }) {
  const inst = INSTITUTION_CONFIG[kasus.institution] || { color: '#6b7280', icon: '⚪', label: kasus.institution }
  const stat = STATUS_CONFIG[kasus.status] || STATUS_CONFIG.tersangka
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm flex-shrink-0"
          style={{ borderColor: inst.color, backgroundColor: inst.color + '22' }}>
          {inst.icon}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-border mt-2" />}
      </div>
      <div className="flex-1 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-text-secondary text-xs">{kasus.date_start}</span>
          <Badge color={stat.color}>{stat.label}</Badge>
        </div>
        <h3 className="text-text-primary font-medium text-sm">{kasus.title}</h3>
        {kasus.losses_idr && (
          <p className="text-red-400 text-xs mt-1">💸 {formatIDR(kasus.losses_idr)}</p>
        )}
        <p className="text-text-secondary text-xs mt-1">{kasus.source}</p>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function KPKCases() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [instFilter, setInstFilter] = useState('all')
  const [regionFilter, setRegionFilter] = useState('all')
  const [viewMode, setViewMode] = useState('grid') // grid | timeline

  const allRegions = useMemo(() => ['all', ...new Set(KPK_CASES.map(k => k.region))], [])
  const allInstitutions = useMemo(() => ['all', ...Object.keys(INSTITUTION_CONFIG)], [])

  const filtered = useMemo(() => {
    return KPK_CASES.filter(k => {
      if (statusFilter !== 'all' && k.status !== statusFilter) return false
      if (instFilter !== 'all' && k.institution !== instFilter) return false
      if (regionFilter !== 'all' && k.region !== regionFilter) return false
      return true
    }).sort((a, b) => (b.date_start || '').localeCompare(a.date_start || ''))
  }, [statusFilter, instFilter, regionFilter])

  // KPI metrics
  const totalKerugian = KPK_CASES.reduce((s, k) => s + (k.losses_idr || 0), 0)
  const tersangkaCount = KPK_CASES.filter(k => k.status === 'tersangka').length
  const terpidanaCount = KPK_CASES.filter(k => k.status === 'terpidana').length
  const ottCount = KPK_CASES.filter(k => k.arrest_type === 'OTT').length

  const vonisKasus = KPK_CASES.filter(k => k.vonis_years)
  const avgVonis = vonisKasus.length
    ? (vonisKasus.reduce((s, k) => s + k.vonis_years, 0) / vonisKasus.length).toFixed(1)
    : 0

  // Pie chart data
  const instBreakdown = useMemo(() => {
    const counts = {}
    KPK_CASES.forEach(k => {
      counts[k.institution] = (counts[k.institution] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({
      name: INSTITUTION_CONFIG[name]?.label || name,
      value,
      color: INSTITUTION_CONFIG[name]?.color || '#6b7280',
    }))
  }, [])

  const FILTER_BTN = 'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border'
  const activeFilter = 'bg-red-600 text-white border-red-600'
  const inactiveFilter = 'text-text-secondary border-border hover:border-border-strong hover:text-text-primary'

  return (
    <div className="space-y-6">
      <PageHeader
        title="⚖️ KPK Cases Tracker"
        subtitle="Pantau kasus korupsi pejabat publik Indonesia — KPK, Kejaksaan Agung, dan MKMK"
        actions={
          <div className="flex gap-2 flex-wrap">
            <Btn
              variant="secondary"
              onClick={() => exportToCSV(
                filtered.map(c => ({
                  nama: c.title,
                  jabatan: c.institution,
                  kasus: c.charges,
                  status: c.status,
                  tahun: c.date_start,
                  nilai: c.losses_idr || 0,
                })),
                'kpk-cases'
              )}
            >⬇️ Export CSV</Btn>
            <Btn
              variant={viewMode === 'grid' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('grid')}
            >⊞ Grid</Btn>
            <Btn
              variant={viewMode === 'timeline' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('timeline')}
            >📅 Timeline</Btn>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Total Kasus" value={KPK_CASES.length} icon="📁" sub="dalam database" />
        <KPICard
          label="Total Kerugian Negara"
          value={formatIDR(totalKerugian)}
          icon="💸"
          color="#ef4444"
          sub="kerugian terdokumentasi"
        />
        <KPICard label="Tersangka Aktif" value={tersangkaCount} icon="⚠️" color="#f97316" sub="proses hukum berjalan" />
        <KPICard label="Terpidana" value={terpidanaCount} icon="🔒" color="#ef4444" sub="sudah divonis" />
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          {/* Status filter */}
          <div>
            <p className="text-text-secondary text-xs mb-2 font-medium">Status</p>
            <div className="flex gap-1.5 flex-wrap">
              {['all', 'tersangka', 'terpidana', 'bebas', 'sp3'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`${FILTER_BTN} ${statusFilter === s ? activeFilter : inactiveFilter}`}
                >
                  {s === 'all' ? 'Semua' : STATUS_CONFIG[s]?.label || s}
                </button>
              ))}
            </div>
          </div>
          {/* Institution filter */}
          <div>
            <p className="text-text-secondary text-xs mb-2 font-medium">Lembaga</p>
            <div className="flex gap-1.5 flex-wrap">
              {allInstitutions.map(inst => (
                <button
                  key={inst}
                  onClick={() => setInstFilter(inst)}
                  className={`${FILTER_BTN} ${instFilter === inst ? activeFilter : inactiveFilter}`}
                >
                  {inst === 'all' ? 'Semua' : INSTITUTION_CONFIG[inst]?.label || inst}
                </button>
              ))}
            </div>
          </div>
          {/* Region filter */}
          <div>
            <p className="text-text-secondary text-xs mb-2 font-medium">Wilayah</p>
            <div className="flex gap-1.5 flex-wrap">
              {allRegions.map(r => (
                <button
                  key={r}
                  onClick={() => setRegionFilter(r)}
                  className={`${FILTER_BTN} ${regionFilter === r ? activeFilter : inactiveFilter}`}
                >
                  {r === 'all' ? 'Semua' : r}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="text-text-secondary text-xs mt-3">
          Menampilkan <span className="text-text-primary font-medium">{filtered.length}</span> dari {KPK_CASES.length} kasus
        </p>
      </Card>

      {/* Cases — Grid or Timeline */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(k => <CaseCard key={k.id} kasus={k} />)}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-16 text-text-secondary">
              🔍 Tidak ada kasus yang cocok dengan filter
            </div>
          )}
        </div>
      ) : (
        <Card className="p-6">
          <h2 className="text-text-primary font-semibold mb-6">📅 Timeline Kronologi</h2>
          {filtered.map((k, i) => (
            <TimelineItem key={k.id} kasus={k} isLast={i === filtered.length - 1} />
          ))}
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stats summary */}
        <Card className="p-4 col-span-1 md:col-span-2">
          <h2 className="text-text-primary font-semibold mb-4">📊 Ringkasan Statistik</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-bg-elevated">
              <p className="text-2xl font-bold text-orange-400">{avgVonis}</p>
              <p className="text-text-secondary text-xs mt-1">Rata-rata vonis (tahun)</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-bg-elevated">
              <p className="text-2xl font-bold text-red-400">{formatIDR(totalKerugian)}</p>
              <p className="text-text-secondary text-xs mt-1">Total kerugian negara</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-bg-elevated">
              <p className="text-2xl font-bold text-yellow-400">{ottCount}</p>
              <p className="text-text-secondary text-xs mt-1">OTT dari {KPK_CASES.length} kasus</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-bg-elevated">
              <p className="text-2xl font-bold text-blue-400">{vonisKasus.length}</p>
              <p className="text-text-secondary text-xs mt-1">Kasus sudah vonis</p>
            </div>
          </div>
        </Card>

        {/* Institution pie */}
        <Card className="p-4">
          <h2 className="text-text-primary font-semibold mb-2 text-sm">Kasus per Lembaga</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={instBreakdown}
                cx="50%"
                cy="50%"
                outerRadius={60}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {instBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [v + ' kasus', n]} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Disclaimer */}
      <Card className="p-4 border-yellow-500/30 bg-yellow-500/5">
        <p className="text-yellow-400 text-xs">
          ⚠️ <strong>Disclaimer:</strong> Data bersumber dari laporan publik KPK RI, Kejaksaan Agung, dan media terpercaya.
          Status tersangka belum tentu bersalah — asas praduga tak bersalah berlaku. Kasus dapat berubah sesuai
          perkembangan hukum. Untuk kepentingan edukasi dan transparansi publik.
        </p>
      </Card>
    </div>
  )
}
