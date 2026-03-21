import { useMemo } from 'react'
import { PageHeader, Card, KPICard } from '../../components/ui'
import { MOVEMENTS, MOVEMENTS_SORTED } from '../../data/student_movements'

// ── Helpers ───────────────────────────────────────────────────────────────────
function ImpactBar({ score, max = 10, color = '#ef4444' }) {
  const pct = (score / max) * 100
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-bg-elevated rounded-full h-2.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-bold w-6 text-text-primary">{score}</span>
    </div>
  )
}

function ImpactColor(score) {
  if (score >= 9) return '#ef4444'
  if (score >= 7) return '#f59e0b'
  if (score >= 5) return '#3b82f6'
  return '#6b7280'
}

function YearBadge({ year }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-bg-elevated text-text-primary border border-border">
      {year}
    </span>
  )
}

// ── Org frequency chart ───────────────────────────────────────────────────────
function OrgFreqChart({ movements }) {
  const counts = useMemo(() => {
    const c = {}
    movements.forEach(m => m.orgs.forEach(o => { c[o] = (c[o] || 0) + 1 }))
    return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 12)
  }, [movements])
  const max = counts.length > 0 ? counts[0][1] : 1
  return (
    <div className="space-y-2">
      {counts.map(([org, count]) => (
        <div key={org} className="flex items-center gap-2 text-xs">
          <span className="w-28 text-right text-text-secondary truncate">{org}</span>
          <div className="flex-1 bg-bg-elevated rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${(count / max) * 100}%`, backgroundColor: '#ef4444' }}
            />
          </div>
          <span className="w-5 text-text-primary font-medium">{count}</span>
        </div>
      ))}
    </div>
  )
}

// ── Podium ────────────────────────────────────────────────────────────────────
function Podium({ movements }) {
  const top3 = [...movements].sort((a, b) => b.impact - a.impact).slice(0, 3)
  const order = [top3[1], top3[0], top3[2]].filter(Boolean)
  const heights = ['h-20', 'h-28', 'h-16']
  const medals = ['🥈', '🥇', '🥉']
  const labels = ['2nd', '1st', '3rd']

  return (
    <div className="flex items-end justify-center gap-2 pt-4">
      {order.map((m, i) => (
        <div key={m.id} className="flex flex-col items-center gap-1 flex-1 max-w-[120px]">
          <span className="text-2xl">{medals[i]}</span>
          <p className="text-xs font-semibold text-text-primary text-center leading-tight">{m.name}</p>
          <p className="text-xs text-text-secondary">{m.year}</p>
          <div
            className={`w-full ${heights[i]} rounded-t-lg flex items-center justify-center`}
            style={{ backgroundColor: ImpactColor(m.impact) + '33', border: `2px solid ${ImpactColor(m.impact)}` }}
          >
            <span className="text-lg font-bold" style={{ color: ImpactColor(m.impact) }}>{m.impact}</span>
          </div>
          <p className="text-[10px] text-text-muted">{labels[i]}</p>
        </div>
      ))}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MahasiswaPage() {
  const totalOrgs = useMemo(() => {
    const orgs = new Set()
    MOVEMENTS.forEach(m => m.orgs.forEach(o => orgs.add(o)))
    return orgs.size
  }, [])

  const avgImpact = useMemo(() => {
    const sum = MOVEMENTS.reduce((s, m) => s + m.impact, 0)
    return (sum / MOVEMENTS.length).toFixed(1)
  }, [])

  const maxImpact = Math.max(...MOVEMENTS.map(m => m.impact))

  return (
    <div className="space-y-6">
      <PageHeader
        title="🎓 Gerakan Mahasiswa & Demo"
        subtitle="Linimasa aksi mahasiswa dan demonstrasi besar yang membentuk sejarah politik Indonesia"
      />

      {/* ── KPI Cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Total Gerakan" value={MOVEMENTS.length} sub="Dalam catatan" icon="✊" />
        <KPICard label="Org. Terlibat" value={`${totalOrgs}+`} sub="Unik" icon="🏫" />
        <KPICard label="Rata-rata Dampak" value={avgImpact} sub="Skala 1–10" icon="📊" />
        <KPICard label="Dampak Tertinggi" value={maxImpact} sub="Reformasi 1998" icon="⭐" color="#ef4444" />
      </div>

      {/* ── Aksi Terbesar Podium + Org Freq ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-1">🏆 Aksi Terbesar (Top 3 Dampak)</h3>
          <p className="text-xs text-text-muted mb-4">Diukur berdasarkan dampak terhadap kebijakan dan sejarah politik</p>
          <Podium movements={MOVEMENTS} />
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-3">📊 Organisasi Paling Aktif</h3>
          <p className="text-xs text-text-muted mb-3">Frekuensi keterlibatan dalam gerakan</p>
          <OrgFreqChart movements={MOVEMENTS} />
        </Card>
      </div>

      {/* ── Timeline ─────────────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-base font-bold text-text-primary mb-4">📅 Linimasa Gerakan (Terbaru ke Terlama)</h2>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

          <div className="space-y-4">
            {MOVEMENTS_SORTED.map((m, idx) => {
              const color = ImpactColor(m.impact)
              return (
                <div key={m.id} className="relative md:pl-16">
                  {/* Year dot on timeline */}
                  <div
                    className="hidden md:flex absolute left-3 top-5 w-6 h-6 rounded-full items-center justify-center border-2 border-bg-card z-10"
                    style={{ backgroundColor: color }}
                  >
                    <span className="text-white text-[8px] font-bold">{m.year % 100}</span>
                  </div>

                  <Card
                    className="p-4"
                    style={{ borderLeftColor: color, borderLeftWidth: 3 }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <YearBadge year={m.year} />
                        <h3 className="text-sm font-bold text-text-primary">{m.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-text-muted">Dampak:</span>
                        <div className="w-28">
                          <ImpactBar score={m.impact} color={color} />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-xs text-text-secondary font-medium mb-0.5">💡 Pemicu</p>
                        <p className="text-xs text-text-primary leading-relaxed">{m.trigger}</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-secondary font-medium mb-0.5">🎯 Hasil</p>
                        <p className="text-xs text-text-primary leading-relaxed">{m.outcome}</p>
                      </div>
                    </div>

                    {/* Orgs */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {m.orgs.map(org => (
                        <span
                          key={org}
                          className="text-xs px-2 py-0.5 rounded-full bg-bg-elevated text-text-secondary border border-border"
                        >
                          {org}
                        </span>
                      ))}
                    </div>

                    {/* Casualties & Location row */}
                    <div className="flex flex-wrap gap-4 text-xs text-text-muted">
                      {m.location && (
                        <span>📍 {m.location}</span>
                      )}
                      {m.casualties && (
                        <span className="text-red-500">⚠️ {m.casualties}</span>
                      )}
                    </div>

                    {/* Tags */}
                    {m.tags?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {m.tags.map(tag => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-bg-elevated text-text-muted rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Footer note ──────────────────────────────────────────────────────── */}
      <Card className="p-4 bg-bg-elevated">
        <p className="text-xs text-text-muted text-center">
          📝 Data berdasarkan catatan sejarah publik. Skor dampak bersifat estimasi editorial.
          Gerakan mahasiswa adalah pilar demokrasi Indonesia sejak 1966, 1974, 1998 hingga kini.
        </p>
      </Card>
    </div>
  )
}
