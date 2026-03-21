import { ORMAS } from '../../data/ormas'
import { PARTY_MAP } from '../../data/parties'
import { PageHeader, Card, Badge, KPICard } from '../../components/ui'

const ALIGNMENT_CONFIG = {
  'pro-prabowo':         { label: 'Pro-Prabowo',   variant: 'risk-sedang', color: '#F59E0B' },
  'netral-pemerintah':   { label: 'Netral',         variant: 'default',     color: '#6B7280' },
  'kritis-independen':   { label: 'Independen',     variant: 'role',        color: '#3B82F6' },
  'oposisi':             { label: 'Oposisi',         variant: 'status-ingkar', color: '#EF4444' },
  'berpengaruh':         { label: 'Berpengaruh',    variant: 'status-proses', color: '#F59E0B' },
  'pro-oposisi':         { label: 'Pro-Oposisi',    variant: 'status-ingkar', color: '#EF4444' },
}

function formatMember(n) {
  if (!n) return 'N/A'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)} juta`
  if (n >= 1000) return `${(n / 1000).toFixed(0)} ribu`
  return n.toString()
}

const totalMemberEstimate = ORMAS.reduce((sum, o) => sum + (o.members_est || 0), 0)

export default function OrmasList() {
  const nu = ORMAS.find(o => o.id === 'pbnu')
  const muhammadiyah = ORMAS.find(o => o.id === 'muhammadiyah')

  return (
    <div className="space-y-6">
      <PageHeader
        title="🏛️ Ormas & Organisasi Keagamaan"
        subtitle="Organisasi kemasyarakatan dan keagamaan yang berpengaruh"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          label="Total Ormas"
          value={ORMAS.length}
          sub="Dalam database"
          icon="🏛️"
        />
        <KPICard
          label="Anggota NU"
          value={nu ? formatMember(nu.members_est) : 'N/A'}
          sub="Terbesar Indonesia"
          icon="🌙"
        />
        <KPICard
          label="Anggota Muhammadiyah"
          value={muhammadiyah ? formatMember(muhammadiyah.members_est) : 'N/A'}
          sub="Terbesar ke-2"
          icon="☀️"
        />
        <KPICard
          label="Total Pengaruh"
          value={`~${formatMember(totalMemberEstimate)}`}
          sub="Estimasi gabungan"
          icon="📊"
        />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ORMAS.map(ormas => {
          const alignmentCfg = ALIGNMENT_CONFIG[ormas.alignment] || { label: ormas.alignment, variant: 'default' }
          return (
            <Card
              key={ormas.id}
              className="p-5"
              style={ormas.color ? { borderLeftColor: ormas.color, borderLeftWidth: 3 } : {}}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{ormas.logo_emoji}</span>
                  <div>
                    <h3 className="text-base font-bold text-text-primary">{ormas.name}</h3>
                    {ormas.abbr !== ormas.name && (
                      <p className="text-xs text-text-secondary">{ormas.abbr}</p>
                    )}
                  </div>
                </div>
                <Badge variant={alignmentCfg.variant}>{alignmentCfg.label}</Badge>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed mb-3">{ormas.description}</p>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs mb-3">
                <div>
                  <span className="text-text-secondary">Ketua: </span>
                  <span className="text-text-primary">{ormas.leader_name || '—'}</span>
                </div>
                <div>
                  <span className="text-text-secondary">Berdiri: </span>
                  <span className="text-text-primary">{ormas.founded}</span>
                </div>
                <div>
                  <span className="text-text-secondary">Tipe: </span>
                  <span className="text-text-primary capitalize">{ormas.type}</span>
                </div>
                <div>
                  <span className="text-text-secondary">Anggota: </span>
                  <span className="text-text-primary">
                    {ormas.members_est ? `~${formatMember(ormas.members_est)}` : 'N/A'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-text-secondary italic leading-relaxed mb-3">
                "{ormas.political_stance}"
              </p>

              {ormas.related_party_ids?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {ormas.related_party_ids.map(pid => {
                    const party = PARTY_MAP[pid]
                    if (!party) return null
                    return (
                      <span
                        key={pid}
                        className="text-xs px-2 py-0.5 rounded font-medium"
                        style={{ backgroundColor: party.color + '20', color: party.color }}
                      >
                        {party.logo_emoji} {party.abbr}
                      </span>
                    )
                  })}
                </div>
              )}

              {ormas.regions?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {ormas.regions.map(r => (
                    <span key={r} className="text-xs px-1.5 py-0.5 bg-bg-elevated text-text-secondary rounded">
                      {r}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
