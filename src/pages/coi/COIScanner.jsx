import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader, Card, Badge, KPICard } from '../../components/ui'
import { COI_FLAGS } from '../../data/coi'
import { PERSONS_MAP } from '../../data/persons'
import { detectCOI } from '../../lib/coiDetector'

// ── Risk config ───────────────────────────────────────────────────────────────
const RISK_CONFIG = {
  tinggi: { label: 'Tinggi', color: '#ef4444', bg: '#fef2f2', border: '#fecaca', icon: '🔴', order: 0 },
  sedang: { label: 'Sedang', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', icon: '🟡', order: 1 },
  rendah: { label: 'Rendah', color: '#10b981', bg: '#f0fdf4', border: '#bbf7d0', icon: '🟢', order: 2 },
}

// ── Person Avatar ─────────────────────────────────────────────────────────────
function PersonAvatar({ person, size = 'md' }) {
  const sz = size === 'lg' ? 'w-14 h-14 text-lg' : 'w-10 h-10 text-sm'
  if (person?.photo_url) {
    return (
      <img
        src={person.photo_url}
        alt={person.name}
        className={`${sz} rounded-full object-cover flex-shrink-0 border-2 border-border`}
        onError={e => { e.currentTarget.style.display = 'none' }}
      />
    )
  }
  const initials = person?.photo_placeholder || (person?.name?.split(' ').map(w => w[0]).slice(0, 2).join('') || '?')
  return (
    <div className={`${sz} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 border-2 border-border`}
         style={{ background: 'linear-gradient(135deg, #dc2626, #7c3aed)' }}>
      {initials}
    </div>
  )
}

// ── Auto-detected Alert Card ──────────────────────────────────────────────────
const AUTO_SEVERITY_CONFIG = {
  high:   { label: 'Tinggi',  color: '#ef4444', icon: '🔴', bg: '#fef2f2' },
  medium: { label: 'Sedang',  color: '#f59e0b', icon: '🟡', bg: '#fffbeb' },
  low:    { label: 'Rendah',  color: '#10b981', icon: '🟢', bg: '#f0fdf4' },
}

const AUTO_TYPE_LABELS = {
  business_conflict: '💼 Konflik Bisnis',
  family_tie:        '👨‍👩‍👦 Hubungan Keluarga',
  kpk_history:       '⚖️ Riwayat KPK',
  party_business:    '🎭 Bisnis Separtai',
  revolving_door:    '🔄 Revolving Door',
}

function AutoDetectedAlertCard({ alert }) {
  const person = PERSONS_MAP[alert.person_id]
  const sev = AUTO_SEVERITY_CONFIG[alert.severity] || AUTO_SEVERITY_CONFIG.medium
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="p-4 rounded-xl border bg-bg-card flex flex-col gap-2"
      style={{ borderLeftWidth: 4, borderLeftColor: sev.color }}
    >
      <div className="flex items-start gap-3">
        {person?.photo_url ? (
          <img
            src={person.photo_url}
            alt={person.name}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-border"
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
               style={{ background: `linear-gradient(135deg, ${sev.color}, #7c3aed)` }}>
            {person?.photo_placeholder || person?.name?.[0] || '?'}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            {person ? (
              <Link
                to={`/persons/${alert.person_id}`}
                className="text-sm font-semibold text-text-primary hover:text-accent-red transition-colors"
              >
                {alert.person_name}
              </Link>
            ) : (
              <span className="text-sm font-semibold text-text-primary">{alert.person_name}</span>
            )}
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{ backgroundColor: sev.color + '22', color: sev.color, border: `1px solid ${sev.color}44` }}
            >
              {sev.icon} {sev.label}
            </span>
            <span className="text-[10px] text-text-secondary">{AUTO_TYPE_LABELS[alert.type] || alert.type}</span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">{alert.description}</p>
        </div>
      </div>

      {alert.evidence?.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(e => !e)}
            className="text-[11px] text-text-secondary hover:text-text-primary self-start underline"
          >
            {expanded ? '▲ Sembunyikan bukti' : `▼ Lihat ${alert.evidence.length} bukti`}
          </button>
          {expanded && (
            <ul className="space-y-1 pl-2 border-l-2 border-border">
              {alert.evidence.map((e, i) => (
                <li key={i} className="text-xs text-text-secondary leading-relaxed">• {e}</li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

// ── Auto Detected Section ─────────────────────────────────────────────────────
function AutoDetectedSection() {
  const autoAlerts = useMemo(() => {
    try { return detectCOI() } catch { return [] }
  }, [])

  const [autoFilter, setAutoFilter] = useState('all')

  const filtered = useMemo(() => {
    if (autoFilter === 'all') return autoAlerts
    return autoAlerts.filter(a => a.severity === autoFilter)
  }, [autoAlerts, autoFilter])

  if (autoAlerts.length === 0) return null

  const highCount = autoAlerts.filter(a => a.severity === 'high').length
  const mediumCount = autoAlerts.filter(a => a.severity === 'medium').length

  return (
    <Card className="p-5">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚠️</span>
          <h3 className="text-sm font-bold text-text-primary">Terdeteksi Otomatis</h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
            {autoAlerts.length} temuan
          </span>
        </div>
        <p className="text-xs text-text-secondary">
          Hasil pemindaian otomatis — belum diverifikasi manual
        </p>
      </div>

      {/* Summary badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { key: 'all',    label: `Semua (${autoAlerts.length})`,  color: null },
          { key: 'high',   label: `🔴 Tinggi (${highCount})`,      color: '#ef4444' },
          { key: 'medium', label: `🟡 Sedang (${mediumCount})`,     color: '#f59e0b' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setAutoFilter(tab.key)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              autoFilter === tab.key
                ? 'bg-accent-red text-white'
                : 'bg-bg-elevated border border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alert cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map(alert => (
          <AutoDetectedAlertCard key={alert.id} alert={alert} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-text-secondary text-sm py-4">
          Tidak ada temuan untuk filter ini.
        </p>
      )}
    </Card>
  )
}

// ── Sector Heatmap ────────────────────────────────────────────────────────────
function SectorHeatmap({ flags }) {
  const sectorCounts = useMemo(() => {
    const counts = {}
    flags.forEach(flag => {
      const sectors = flag.sector_overlap.split(',').map(s => s.trim())
      sectors.forEach(sector => {
        counts[sector] = (counts[sector] || 0) + 1
      })
    })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [flags])

  const maxCount = sectorCounts[0]?.[1] || 1

  return (
    <Card className="p-5">
      <h3 className="text-text-primary font-semibold mb-4 flex items-center gap-2">
        <span>🌡️</span> Peta Risiko Sektoral
      </h3>
      <p className="text-xs text-text-secondary mb-4">Sektor dengan jumlah konflik kepentingan terbanyak</p>
      <div className="space-y-2">
        {sectorCounts.map(([sector, count]) => (
          <div key={sector} className="flex items-center gap-3">
            <span className="text-xs text-text-secondary w-40 flex-shrink-0 truncate" title={sector}>
              {sector}
            </span>
            <div className="flex-1 bg-bg-elevated rounded-full h-5 overflow-hidden">
              <div
                className="h-full rounded-full flex items-center pl-2 transition-all duration-500"
                style={{
                  width: `${(count / maxCount) * 100}%`,
                  background: count >= 3 ? '#ef4444' : count === 2 ? '#f59e0b' : '#10b981',
                  minWidth: 40,
                }}
              >
                <span className="text-[10px] text-white font-bold">{count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── COI Card ──────────────────────────────────────────────────────────────────
function COICard({ flag }) {
  const person = PERSONS_MAP[flag.person_id]
  const risk = RISK_CONFIG[flag.risk_level] || RISK_CONFIG.rendah
  const sectors = flag.sector_overlap.split(',').map(s => s.trim())

  return (
    <Card
      className="p-4 flex flex-col gap-3 hover:border-border-strong transition-all"
      colorLeft={risk.color}
    >
      {/* Header: person + risk badge */}
      <div className="flex items-start gap-3">
        <PersonAvatar person={person} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-1">
            {person ? (
              <Link
                to={`/persons/${flag.person_id}`}
                className="text-sm font-semibold text-text-primary hover:text-accent-red transition-colors leading-snug"
              >
                {person.name}
              </Link>
            ) : (
              <span className="text-sm font-semibold text-text-primary">{flag.person_id}</span>
            )}
            <Badge color={risk.color}>{risk.icon} {risk.label}</Badge>
          </div>
          <p className="text-xs text-text-secondary truncate">{flag.position}</p>
        </div>
      </div>

      {/* Business interest */}
      <div className="bg-bg-elevated rounded-lg p-3">
        <p className="text-[10px] uppercase tracking-wider text-text-secondary mb-1 font-semibold">💼 Kepentingan Bisnis</p>
        <p className="text-xs text-text-primary leading-relaxed">{flag.business}</p>
      </div>

      {/* Sector overlap chips */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-text-secondary mb-1.5 font-semibold">⚠️ Tumpang Tindih Sektor</p>
        <div className="flex flex-wrap gap-1.5">
          {sectors.map(s => (
            <span
              key={s}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium"
              style={{ backgroundColor: risk.color + '22', color: risk.color, border: `1px solid ${risk.color}44` }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Notes */}
      <p className="text-xs text-text-secondary leading-relaxed border-l-2 border-border pl-3 italic">
        {flag.notes}
      </p>

      {/* Source */}
      <p className="text-[10px] text-text-muted italic">
        📎 Sumber: {flag.source}
      </p>
    </Card>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function COIScanner() {
  const [filter, setFilter] = useState('semua')

  const counts = useMemo(() => ({
    total: COI_FLAGS.length,
    tinggi: COI_FLAGS.filter(f => f.risk_level === 'tinggi').length,
    sedang: COI_FLAGS.filter(f => f.risk_level === 'sedang').length,
    rendah: COI_FLAGS.filter(f => f.risk_level === 'rendah').length,
  }), [])

  // Top sector
  const topSector = useMemo(() => {
    const counts = {}
    COI_FLAGS.forEach(flag => {
      flag.sector_overlap.split(',').map(s => s.trim()).forEach(s => {
        counts[s] = (counts[s] || 0) + 1
      })
    })
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
    return top ? `${top[0]} (${top[1]} flags)` : '-'
  }, [])

  const filtered = useMemo(() => {
    const sorted = [...COI_FLAGS].sort((a, b) =>
      (RISK_CONFIG[a.risk_level]?.order ?? 9) - (RISK_CONFIG[b.risk_level]?.order ?? 9)
    )
    if (filter === 'semua') return sorted
    return sorted.filter(f => f.risk_level === filter)
  }, [filter])

  const FILTER_TABS = [
    { key: 'semua', label: 'Semua', count: counts.total },
    { key: 'tinggi', label: '🔴 Tinggi', count: counts.tinggi },
    { key: 'sedang', label: '🟡 Sedang', count: counts.sedang },
    { key: 'rendah', label: '🟢 Rendah', count: counts.rendah },
  ]

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="🔍 Pemindai Konflik Kepentingan"
        subtitle="Pemetaan tumpang tindih kepentingan bisnis dan jabatan publik"
      />

      {/* ── Disclaimer Banner ── */}
      <div className="rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700 p-4">
        <div className="flex gap-3">
          <span className="text-xl flex-shrink-0">⚠️</span>
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">Catatan Penting</p>
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              Data berdasarkan laporan publik dan investigasi media. <strong>Bukan vonis hukum.</strong>{' '}
              Konflik kepentingan tidak selalu berarti korupsi — tapi wajib diungkap untuk
              memastikan akuntabilitas pejabat publik dan transparansi demokrasi.
            </p>
          </div>
        </div>
      </div>

      {/* ── Auto-detected section ── */}
      <AutoDetectedSection />

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KPICard
          label="Total Flags"
          value={counts.total}
          icon="🚩"
          sub="Teridentifikasi"
        />
        <KPICard
          label="Risiko Tinggi"
          value={counts.tinggi}
          icon="🔴"
          color="#ef4444"
          sub="Signifikan"
        />
        <KPICard
          label="Risiko Sedang"
          value={counts.sedang}
          icon="🟡"
          color="#f59e0b"
          sub="Perlu perhatian"
        />
        <KPICard
          label="Sektor Rentan"
          value={topSector.split('(')[0].trim()}
          icon="⚡"
          color="#8b5cf6"
          sub={`${topSector.match(/\((\d+)/)?.[1] || ''} konflik`}
        />
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === tab.key
                ? 'bg-accent-red text-white shadow-sm'
                : 'bg-bg-card border border-border text-text-secondary hover:text-text-primary hover:bg-bg-hover'
            }`}
          >
            {tab.label}
            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
              filter === tab.key ? 'bg-white/20' : 'bg-bg-elevated'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── COI Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((flag, idx) => (
          <COICard key={`${flag.person_id}-${idx}`} flag={flag} />
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-text-secondary">Tidak ada data untuk filter ini.</p>
        </Card>
      )}

      {/* ── Sector Heatmap ── */}
      <SectorHeatmap flags={COI_FLAGS} />

      {/* ── Footer note ── */}
      <div className="text-xs text-text-muted text-center pb-4">
        Data dikompilasi dari laporan publik, investigasi media, LHKPN, dan riset LSM.
        Untuk penggunaan edukasi dan jurnalisme publik.
      </div>
    </div>
  )
}
