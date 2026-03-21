import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader, Card, Badge, KPICard } from '../../components/ui'
import {
  COMPANIES,
  OLIGARCH_SECTORS,
  POLITICAL_BUSINESS_TIES,
} from '../../data/business'
import { PERSONS } from '../../data/persons'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SECTOR_CONFIG = {
  pertambangan:   { label: 'Pertambangan',    color: 'bg-yellow-800/40 text-yellow-300 border-yellow-700/40',   dot: 'bg-yellow-400' },
  media:          { label: 'Media',            color: 'bg-blue-900/40 text-blue-300 border-blue-700/40',         dot: 'bg-blue-400'   },
  properti:       { label: 'Properti',         color: 'bg-purple-900/40 text-purple-300 border-purple-700/40',   dot: 'bg-purple-400' },
  energi:         { label: 'Energi',           color: 'bg-orange-900/40 text-orange-300 border-orange-700/40',   dot: 'bg-orange-400' },
  keuangan:       { label: 'Keuangan',         color: 'bg-green-900/40 text-green-300 border-green-700/40',      dot: 'bg-green-400'  },
  agribisnis:     { label: 'Agribisnis',       color: 'bg-lime-900/40 text-lime-300 border-lime-700/40',         dot: 'bg-lime-400'   },
  infrastruktur:  { label: 'Infrastruktur',    color: 'bg-sky-900/40 text-sky-300 border-sky-700/40',            dot: 'bg-sky-400'    },
}

const RISK_CONFIG = {
  tinggi: { label: 'Risiko Tinggi', color: 'bg-red-900/40 text-red-400 border-red-700/40' },
  sedang: { label: 'Risiko Sedang', color: 'bg-yellow-900/40 text-yellow-400 border-yellow-700/40' },
  rendah: { label: 'Risiko Rendah', color: 'bg-green-900/40 text-green-400 border-green-700/40' },
}

const PERSON_MAP = Object.fromEntries(PERSONS.map(p => [p.id, p]))

function SectorBadge({ sector }) {
  const cfg = SECTOR_CONFIG[sector] || {}
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${cfg.color}`}>
      {cfg.dot && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
      {cfg.label || sector}
    </span>
  )
}

function RiskBadge({ risk }) {
  const cfg = RISK_CONFIG[risk] || {}
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${cfg.color}`}>
      {risk === 'tinggi' ? '🔴' : risk === 'sedang' ? '🟡' : '🟢'} {cfg.label || risk}
    </span>
  )
}

// ─── Section 1 — KPI Bar ─────────────────────────────────────────────────────

function KPIBar({ companies }) {
  const uniqueOwnerIds = new Set()
  companies.forEach(c => {
    c.owner_ids?.forEach(id => uniqueOwnerIds.add(id))
    if (c.owner_names) {
      Object.keys(c.owner_names).forEach(k => uniqueOwnerIds.add(k))
    }
  })

  const kpis = [
    {
      label: 'Perusahaan Terpetakan',
      value: companies.length,
      icon: '🏢',
      sub: 'entitas bisnis',
      color: 'blue',
    },
    {
      label: 'Sektor Termonitor',
      value: OLIGARCH_SECTORS.length,
      icon: '🏭',
      sub: 'sektor industri',
      color: 'purple',
    },
    {
      label: 'Estimasi Total Aset',
      value: 'Rp 500T+',
      icon: '💰',
      sub: 'gabungan konglomerat',
      color: 'green',
    },
    {
      label: 'Tokoh Terafiliasi',
      value: uniqueOwnerIds.size,
      icon: '👤',
      sub: 'pemilik & pengendali',
      color: 'red',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {kpis.map(k => (
        <KPICard key={k.label} label={k.label} value={k.value} sub={k.sub} icon={k.icon} color={k.color} />
      ))}
    </div>
  )
}

// ─── Section 2 — Sector Filters ───────────────────────────────────────────────

function SectorFilters({ active, onChange }) {
  const tabs = [
    { id: 'semua', label: 'Semua' },
    ...OLIGARCH_SECTORS.map(s => ({ id: s, label: SECTOR_CONFIG[s]?.label || s })),
  ]
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
            active === t.id
              ? 'bg-red-600 text-white border-red-600 shadow-sm'
              : 'bg-bg-elevated text-text-secondary border-border hover:text-text-primary hover:border-red-500/40'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

// ─── Section 3 — Company Card ─────────────────────────────────────────────────

function CompanyCard({ company }) {
  const [expanded, setExpanded] = useState(false)
  const ownerIds = company.owner_ids || []
  const ownerNames = company.owner_names || {}

  // Collect all owner display info
  const owners = []
  const allOwnerKeys = new Set([...ownerIds, ...Object.keys(ownerNames)])
  allOwnerKeys.forEach(key => {
    const person = PERSON_MAP[key]
    owners.push({
      id: key,
      name: ownerNames[key] || person?.name || key,
      inPersons: !!person,
    })
  })

  const tiesForCompany = POLITICAL_BUSINESS_TIES.filter(t => t.company_id === company.id)

  return (
    <Card className="p-5 flex flex-col gap-3 hover:border-red-500/30 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-text-primary font-semibold text-base leading-tight mb-1.5">{company.name}</h3>
          <div className="flex flex-wrap items-center gap-2">
            <SectorBadge sector={company.sector} />
            <RiskBadge risk={company.coi_risk} />
            {company.founded && (
              <span className="text-xs text-text-muted">Est. {company.founded}</span>
            )}
          </div>
        </div>
        {company.controversies?.length > 0 && (
          <div className="flex-shrink-0 flex items-center gap-1 px-2 py-1 bg-red-900/20 border border-red-700/30 rounded-lg text-xs text-red-400">
            ⚠️ {company.controversies.length} kontroversi
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-text-secondary leading-relaxed">{company.description}</p>

      {/* Owners */}
      <div>
        <p className="text-xs text-text-muted uppercase tracking-wider mb-1.5">Pemilik / Pengendali</p>
        <div className="flex flex-wrap gap-2">
          {owners.map(o => (
            o.inPersons ? (
              <Link
                key={o.id}
                to={`/persons/${o.id}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-bg-elevated border border-border rounded-lg text-xs text-blue-400 hover:text-blue-300 hover:border-blue-500/40 transition-colors"
              >
                👤 {o.name} ↗
              </Link>
            ) : (
              <span
                key={o.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-bg-elevated border border-border rounded-lg text-xs text-text-secondary"
              >
                👤 {o.name}
              </span>
            )
          ))}
        </div>
      </div>

      {/* Key Assets */}
      <div>
        <p className="text-xs text-text-muted uppercase tracking-wider mb-1.5">Aset Utama</p>
        <ul className="space-y-0.5">
          {company.key_assets?.slice(0, expanded ? undefined : 3).map((asset, i) => (
            <li key={i} className="text-xs text-text-secondary flex items-start gap-1.5">
              <span className="text-text-muted mt-0.5 flex-shrink-0">▸</span>
              {asset}
            </li>
          ))}
          {!expanded && company.key_assets?.length > 3 && (
            <li className="text-xs text-text-muted">
              +{company.key_assets.length - 3} lainnya
            </li>
          )}
        </ul>
      </div>

      {/* Revenue & Employees */}
      {(company.revenue_estimate || company.employees) && (
        <div className="flex gap-4 text-xs">
          {company.revenue_estimate && (
            <div>
              <span className="text-text-muted">Estimasi Revenue</span>
              <p className="text-text-primary font-semibold">{company.revenue_estimate}</p>
            </div>
          )}
          {company.employees && (
            <div>
              <span className="text-text-muted">Karyawan</span>
              <p className="text-text-primary font-semibold">{company.employees.toLocaleString('id-ID')}</p>
            </div>
          )}
        </div>
      )}

      {/* Political Link */}
      <div className="p-3 bg-red-900/10 border border-red-700/20 rounded-lg">
        <p className="text-xs text-text-muted uppercase tracking-wider mb-1">🔗 Kaitan Politik</p>
        <p className="text-xs text-text-secondary leading-relaxed">{company.political_link}</p>
      </div>

      {/* Controversies (expandable) */}
      {company.controversies?.length > 0 && expanded && (
        <div className="p-3 bg-yellow-900/10 border border-yellow-700/20 rounded-lg">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-1">⚠️ Kontroversi</p>
          <ul className="space-y-0.5">
            {company.controversies.map((c, i) => (
              <li key={i} className="text-xs text-text-secondary flex items-start gap-1.5">
                <span className="text-yellow-600 flex-shrink-0">•</span>{c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-text-muted hover:text-text-secondary transition-colors text-left"
      >
        {expanded ? '▲ Sembunyikan detail' : '▼ Tampilkan detail'}
      </button>
    </Card>
  )
}

// ─── Section 4 — Political Business Ties Table ────────────────────────────────

function TiesTable({ ties }) {
  const companyMap = Object.fromEntries(COMPANIES.map(c => [c.id, c]))

  const TIE_TYPE_LABELS = {
    kepemilikan: '🏢 Kepemilikan',
    hubungan_keluarga: '👨‍👩‍👧 Keluarga',
    konflik_jabatan: '⚖️ Konflik Jabatan',
    kontrak_pemerintah: '📋 Kontrak Pemerintah',
    konsesi: '📜 Konsesi',
    pengaruh_kebijakan: '📡 Pengaruh Kebijakan',
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-bg-elevated">
            <th className="text-left px-4 py-3 text-text-muted font-medium text-xs uppercase tracking-wider">Tokoh</th>
            <th className="text-left px-4 py-3 text-text-muted font-medium text-xs uppercase tracking-wider">Perusahaan</th>
            <th className="text-left px-4 py-3 text-text-muted font-medium text-xs uppercase tracking-wider hidden md:table-cell">Jenis</th>
            <th className="text-left px-4 py-3 text-text-muted font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Deskripsi Risiko</th>
            <th className="text-left px-4 py-3 text-text-muted font-medium text-xs uppercase tracking-wider">Level</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {ties.map((tie, i) => {
            const person = tie.person_id ? PERSON_MAP[tie.person_id] : null
            const company = companyMap[tie.company_id]
            const personName = person?.name || tie.person_name || tie.person_id || '—'
            return (
              <tr key={i} className="hover:bg-bg-elevated transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  {person ? (
                    <Link
                      to={`/persons/${tie.person_id}`}
                      className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                      {personName} ↗
                    </Link>
                  ) : (
                    <span className="text-text-primary font-medium">{personName}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-text-primary font-medium">{company?.name || tie.company_id}</p>
                    {company && (
                      <SectorBadge sector={company.sector} />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-xs text-text-secondary">
                    {TIE_TYPE_LABELS[tie.tie_type] || tie.tie_type}
                  </span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell max-w-xs">
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">{tie.description}</p>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <RiskBadge risk={tie.risk} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BusinessPage() {
  const [activeSector, setActiveSector] = useState('semua')

  const filteredCompanies = useMemo(() => {
    if (activeSector === 'semua') return COMPANIES
    return COMPANIES.filter(c => c.sector === activeSector)
  }, [activeSector])

  const highRiskTies = POLITICAL_BUSINESS_TIES.filter(t => t.risk === 'tinggi').length

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="🏢 Kepemilikan Bisnis & Oligarki"
        subtitle={`Peta kepemilikan korporasi tokoh-tokoh berpengaruh Indonesia — ${COMPANIES.length} entitas, ${OLIGARCH_SECTORS.length} sektor, ${highRiskTies} ikatan risiko tinggi teridentifikasi`}
      />

      {/* Warning Banner */}
      <div className="flex items-start gap-3 p-4 bg-yellow-900/10 border border-yellow-700/30 rounded-xl">
        <span className="text-xl flex-shrink-0">⚠️</span>
        <div>
          <p className="text-sm text-yellow-300 font-medium">Data Berdasarkan Informasi Publik</p>
          <p className="text-xs text-yellow-400/70 mt-0.5 leading-relaxed">
            Data perusahaan dan estimasi pendapatan bersumber dari laporan publik, media, dan dokumen keterbukaan. Kepemilikan aktual bisa berbeda dari struktur hukum yang tercatat. Digunakan untuk keperluan riset dan transparansi publik.
          </p>
        </div>
      </div>

      {/* KPI Bar */}
      <KPIBar companies={COMPANIES} />

      {/* Sector Filters */}
      <div>
        <h2 className="text-text-primary font-semibold text-lg mb-4">🔍 Filter Sektor</h2>
        <SectorFilters active={activeSector} onChange={setActiveSector} />
      </div>

      {/* Company Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-text-primary font-semibold text-lg">
            🏭 Entitas Bisnis
            <span className="ml-2 text-sm font-normal text-text-muted">
              ({filteredCompanies.length} dari {COMPANIES.length})
            </span>
          </h2>
        </div>
        {filteredCompanies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-text-muted">
            <span className="text-4xl mb-3">🔍</span>
            <p className="text-lg font-medium">Tidak ada perusahaan</p>
            <p className="text-sm mt-1">Coba sektor lain</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCompanies.map(company => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </div>

      {/* Political Business Ties */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-text-primary font-semibold text-lg">⚖️ Ikatan Politik–Bisnis</h2>
            <p className="text-sm text-text-muted mt-0.5">
              {POLITICAL_BUSINESS_TIES.length} ikatan teridentifikasi ·{' '}
              <span className="text-red-400">{highRiskTies} risiko tinggi</span>
            </p>
          </div>
        </div>
        <TiesTable ties={POLITICAL_BUSINESS_TIES} />
      </div>

      {/* Sector Distribution */}
      <div>
        <h2 className="text-text-primary font-semibold text-lg mb-4">📊 Distribusi Sektor</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {OLIGARCH_SECTORS.map(sector => {
            const count = COMPANIES.filter(c => c.sector === sector).length
            const cfg = SECTOR_CONFIG[sector] || {}
            const highRisk = COMPANIES.filter(c => c.sector === sector && c.coi_risk === 'tinggi').length
            return (
              <button
                key={sector}
                onClick={() => setActiveSector(sector === activeSector ? 'semua' : sector)}
                className={`p-3 rounded-xl border text-center transition-all hover:scale-105 ${cfg.color} ${
                  activeSector === sector ? 'ring-2 ring-white/20 scale-105' : ''
                }`}
              >
                <p className="text-lg mb-1">{count}</p>
                <p className="text-xs font-medium leading-tight">{cfg.label || sector}</p>
                {highRisk > 0 && (
                  <p className="text-xs mt-1 text-red-400">{highRisk} 🔴</p>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
