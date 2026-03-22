import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader, Card, Badge } from '../components/ui'
import { MEDIA_COVERAGE, MEDIA_OWNERSHIP, NARRATIVE_FRAMES, INDEPENDENSI_SCORES } from '../data/media_monitor'
import { PERSONS } from '../data/persons'

// ── Helpers ───────────────────────────────────────────────────────────────────

const SLANT_META = {
  'pro-pemerintah': { label: 'Pro-Pemerintah', color: '#22c55e', bg: 'rgba(34,197,94,0.08)', dot: '🟢', border: 'rgba(34,197,94,0.25)' },
  'oposisi':        { label: 'Oposisi / Kritis', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', dot: '🔴', border: 'rgba(239,68,68,0.25)' },
  'netral':         { label: 'Netral', color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', dot: '⚪', border: 'rgba(148,163,184,0.2)' },
  'islamis':        { label: 'Islamis', color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', dot: '🟣', border: 'rgba(167,139,250,0.25)' },
}

const PARTAI_META = {
  nas:    { label: 'NasDem', color: '#f97316' },
  gol:    { label: 'Golkar', color: '#eab308' },
  hanura: { label: 'Hanura', color: '#3b82f6' },
}

function slantMeta(slant) {
  return SLANT_META[slant] || SLANT_META['netral']
}

function sentimentColor(val) {
  if (val <= -0.3) return '#ef4444'
  if (val <= 0.0)  return '#f97316'
  if (val <= 0.3)  return '#eab308'
  return '#22c55e'
}

function sentimentLabel(val) {
  if (val <= -0.4) return 'Sangat Negatif'
  if (val <= -0.1) return 'Negatif'
  if (val <=  0.1) return 'Netral'
  if (val <=  0.4) return 'Positif'
  return 'Sangat Positif'
}

// ── Section 1: Ownership Map ──────────────────────────────────────────────────
function OwnershipMap() {
  // How many outlets with political owner affiliation
  const withPoliticalOwner = MEDIA_OWNERSHIP.filter(m => m.partai !== null).length
  const totalOutlets = MEDIA_OWNERSHIP.length
  const pct = Math.round((withPoliticalOwner / totalOutlets) * 100)

  // Build a map: outlet → slant from MEDIA_COVERAGE
  const slantMap = {}
  MEDIA_COVERAGE.forEach(c => { slantMap[c.outlet] = c.slant })

  return (
    <Card className="p-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="flex-1">
          <h2 className="text-text-primary font-bold text-base">🏢 Peta Kepemilikan Media</h2>
          <p className="text-text-muted text-xs mt-0.5">Siapa yang mengontrol narasi Indonesia?</p>
        </div>
        {/* Concentration stat */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/25">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="text-orange-400 font-bold text-lg leading-none">{pct}%</p>
            <p className="text-text-muted text-[11px]">outlet punya pemilik berpartai</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 text-text-muted text-xs font-medium">Outlet</th>
              <th className="text-left py-2 px-3 text-text-muted text-xs font-medium">Pemilik</th>
              <th className="text-left py-2 px-3 text-text-muted text-xs font-medium hidden sm:table-cell">Partai</th>
              <th className="text-left py-2 px-3 text-text-muted text-xs font-medium hidden md:table-cell">Jaringan Media</th>
              <th className="text-left py-2 px-3 text-text-muted text-xs font-medium">Kecenderungan</th>
            </tr>
          </thead>
          <tbody>
            {MEDIA_OWNERSHIP.map(media => {
              const slant = slantMap[media.outlet] || 'netral'
              const meta = slantMeta(slant)
              const partai = media.partai ? PARTAI_META[media.partai] : null

              return (
                <tr
                  key={media.outlet}
                  className="border-b border-border/40 transition-colors hover:bg-bg-elevated"
                  style={{ borderLeft: `3px solid ${meta.color}` }}
                >
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-text-primary">{media.outlet}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    {media.person_id ? (
                      <Link
                        to={`/persons/${media.person_id}`}
                        className="text-accent-red hover:underline text-sm"
                      >
                        {media.pemilik}
                      </Link>
                    ) : (
                      <span className="text-text-secondary text-sm">{media.pemilik}</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 hidden sm:table-cell">
                    {partai ? (
                      <span
                        className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: `${partai.color}20`, color: partai.color, border: `1px solid ${partai.color}40` }}
                      >
                        {partai.label}
                      </span>
                    ) : (
                      <span className="text-text-muted text-xs">Independen</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {media.jaringan.map(j => (
                        <span key={j} className="text-[11px] px-1.5 py-0.5 rounded bg-bg-elevated text-text-muted border border-border">
                          {j}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                      style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}
                    >
                      {meta.dot} {meta.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-3">
        {Object.entries(SLANT_META).map(([key, meta]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs">
            <span>{meta.dot}</span>
            <span className="text-text-muted">{meta.label}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── Section 2: Coverage Comparison ────────────────────────────────────────────
function CoverageComparison() {
  // Build politician list from MEDIA_COVERAGE data
  const personIds = [...new Set(MEDIA_COVERAGE.flatMap(m => m.coverage.map(c => c.person_id)))]
  const [selectedId, setSelectedId] = useState(personIds[0] || 'prabowo')

  const coverageData = useMemo(() => {
    return MEDIA_COVERAGE
      .map(outlet => {
        const cov = outlet.coverage.find(c => c.person_id === selectedId)
        if (!cov) return null
        return {
          outlet: outlet.outlet,
          slant: outlet.slant,
          artikel: cov.artikel_per_bulan,
          sentiment: cov.sentiment_avg,
          tone: cov.tone,
        }
      })
      .filter(Boolean)
      .sort((a, b) => b.artikel - a.artikel)
  }, [selectedId])

  const maxArtikel = Math.max(...coverageData.map(d => d.artikel), 1)

  const personLabel = (id) => {
    const p = PERSONS.find(p => p.id === id)
    return p ? p.name : id.replace(/_/g, ' ')
  }

  return (
    <Card className="p-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="flex-1">
          <h2 className="text-text-primary font-bold text-base">📊 Perbandingan Liputan Media</h2>
          <p className="text-text-muted text-xs mt-0.5">Outlet mana yang paling banyak meliput seorang tokoh?</p>
        </div>
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          className="px-3 py-2 rounded-lg bg-bg-elevated border border-border text-text-primary text-sm focus:outline-none focus:border-accent-red"
        >
          {personIds.map(id => (
            <option key={id} value={id}>{personLabel(id)}</option>
          ))}
        </select>
      </div>

      {coverageData.length === 0 ? (
        <div className="text-center text-text-muted py-8">
          <p className="text-2xl mb-2">📭</p>
          <p className="text-sm">Tidak ada data liputan untuk tokoh ini.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {coverageData.map(item => {
            const barWidth = (item.artikel / maxArtikel) * 100
            const sColor = sentimentColor(item.sentiment)
            const meta = slantMeta(item.slant)

            return (
              <div key={item.outlet} className="group">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs font-semibold text-text-primary w-28 flex-shrink-0 truncate"
                    title={item.outlet}
                  >
                    {item.outlet}
                  </span>
                  <span
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}
                  >
                    {meta.dot}
                  </span>
                  <div className="flex-1 relative h-6 bg-bg-elevated rounded-lg overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 rounded-lg transition-all duration-500"
                      style={{
                        width: `${barWidth}%`,
                        background: `linear-gradient(90deg, ${sColor}80 0%, ${sColor} 100%)`,
                      }}
                    />
                    <div className="absolute inset-0 flex items-center px-2 gap-2">
                      <span className="text-xs font-bold text-white drop-shadow">
                        {item.artikel} artikel/bln
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0 w-24 hidden sm:flex">
                    <span className="text-[11px] font-medium capitalize text-text-secondary">{item.tone}</span>
                    <span className="text-[10px]" style={{ color: sColor }}>
                      {sentimentLabel(item.sentiment)} ({item.sentiment > 0 ? '+' : ''}{item.sentiment.toFixed(1)})
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Sentiment scale legend */}
      <div className="mt-5 pt-4 border-t border-border">
        <p className="text-xs text-text-muted mb-2">Skala Sentimen:</p>
        <div className="h-3 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500" />
        <div className="flex justify-between text-[10px] text-text-muted mt-1">
          <span>Sangat Negatif (-1.0)</span>
          <span>Netral (0.0)</span>
          <span>Sangat Positif (+1.0)</span>
        </div>
        <p className="text-[11px] text-text-muted mt-2">
          ⚡ Warna batang mencerminkan sentimen rata-rata liputan terhadap tokoh tersebut.
        </p>
      </div>
    </Card>
  )
}

// ── Section 3: Narrative Frames ────────────────────────────────────────────────
function NarrativeFrameCard({ frame }) {
  const intensityColor = frame.intensitas >= 8 ? '#ef4444' : frame.intensitas >= 6 ? '#f97316' : '#eab308'

  return (
    <Card className="p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
              ⚔️ PERANG NARASI
            </span>
          </div>
          <h3 className="text-text-primary font-bold text-base leading-snug">{frame.topik}</h3>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="text-lg font-bold" style={{ color: intensityColor }}>
            {frame.intensitas}/10
          </span>
          <span className="text-[10px] text-text-muted">intensitas</span>
        </div>
      </div>

      {/* Intensity bar */}
      <div>
        <div className="flex justify-between text-[10px] text-text-muted mb-1">
          <span>Intensitas Perang Narasi</span>
          <span style={{ color: intensityColor }}>{frame.intensitas}/10</span>
        </div>
        <div className="h-2 rounded-full bg-bg-elevated overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${frame.intensitas * 10}%`,
              background: `linear-gradient(90deg, #eab308, ${intensityColor})`,
            }}
          />
        </div>
      </div>

      {/* Two-side narrative */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Pro side */}
        <div className="rounded-xl p-4 border border-green-500/20 bg-green-900/10 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-green-400 uppercase tracking-wide">✅ Narasi Pro</span>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed italic">
            "{frame.narasi_pro}"
          </p>
          <div className="flex flex-wrap gap-1 mt-1">
            {frame.media_pro.map(m => (
              <span key={m} className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/25">
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Kritis side */}
        <div className="rounded-xl p-4 border border-red-500/20 bg-red-900/10 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wide">⚠️ Narasi Kritis</span>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed italic">
            "{frame.narasi_kritis}"
          </p>
          <div className="flex flex-wrap gap-1 mt-1">
            {frame.media_kritis.map(m => (
              <span key={m} className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/25">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

function NarrativeSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-text-primary font-bold text-base">⚔️ Perang Narasi Media</h2>
          <p className="text-text-muted text-xs mt-0.5">Isu-isu yang dibingkai berbeda secara tajam oleh media pro dan kritis</p>
        </div>
      </div>
      <div className="space-y-4">
        {NARRATIVE_FRAMES.map((frame, i) => (
          <NarrativeFrameCard key={i} frame={frame} />
        ))}
      </div>
    </div>
  )
}

// ── Section 4: Media Slant Index ──────────────────────────────────────────────
function SlantIndex() {
  // Merge MEDIA_COVERAGE slant data with ownership and independensi scores
  const slantMap = {}
  MEDIA_COVERAGE.forEach(c => { slantMap[c.outlet] = c.slant })

  // Build unified outlet list
  const outlets = [
    ...MEDIA_COVERAGE.map(c => c.outlet),
    ...MEDIA_OWNERSHIP.filter(m => !MEDIA_COVERAGE.find(c => c.outlet === m.outlet)).map(m => m.outlet),
  ]
  const uniqueOutlets = [...new Set(outlets)]

  // Sort by independensi score desc
  const sorted = uniqueOutlets
    .map(outlet => ({
      outlet,
      slant: slantMap[outlet] || 'netral',
      independensi: INDEPENDENSI_SCORES[outlet] ?? null,
    }))
    .sort((a, b) => (b.independensi ?? 0) - (a.independensi ?? 0))

  return (
    <Card className="p-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="flex-1">
          <h2 className="text-text-primary font-bold text-base">🎯 Media Slant Index</h2>
          <p className="text-text-muted text-xs mt-0.5">Kecenderungan editorial & skor independensi tiap outlet</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 text-text-muted text-xs font-medium">Outlet</th>
              <th className="text-left py-2 px-3 text-text-muted text-xs font-medium">Kecenderungan</th>
              <th className="text-left py-2 px-3 text-text-muted text-xs font-medium hidden sm:table-cell">Skor Independensi</th>
              <th className="text-left py-2 px-3 text-text-muted text-xs font-medium hidden md:table-cell">Visual</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(item => {
              const meta = slantMeta(item.slant)
              const score = item.independensi
              const scoreColor = score === null ? '#94a3b8' : score >= 7 ? '#22c55e' : score >= 5 ? '#eab308' : '#ef4444'

              return (
                <tr
                  key={item.outlet}
                  className="border-b border-border/40 hover:bg-bg-elevated transition-colors"
                >
                  <td className="py-3 px-3 font-semibold text-text-primary">{item.outlet}</td>
                  <td className="py-3 px-3">
                    <span
                      className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                      style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}
                    >
                      {meta.dot} {meta.label}
                    </span>
                  </td>
                  <td className="py-3 px-3 hidden sm:table-cell">
                    {score !== null ? (
                      <span className="font-bold text-base" style={{ color: scoreColor }}>{score}<span className="text-text-muted font-normal text-xs">/10</span></span>
                    ) : (
                      <span className="text-text-muted text-xs">N/A</span>
                    )}
                  </td>
                  <td className="py-3 px-3 hidden md:table-cell">
                    {score !== null && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-28 h-2 rounded-full bg-bg-elevated overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${score * 10}%`, backgroundColor: scoreColor }}
                          />
                        </div>
                        <span className="text-[10px] text-text-muted">{score >= 7 ? 'Independen' : score >= 5 ? 'Semi-independen' : 'Terafiliasi'}</span>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Methodology note */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-[11px] text-text-muted leading-relaxed">
          ⚠️ <strong className="text-text-secondary">Metodologi:</strong> Skor Independensi (0-10) mengukur kebebasan editorial dari intervensi pemilik dan afiliasi partai.
          Kecenderungan dievaluasi berdasarkan pola liputan historis, kepemilikan, dan tone editorial.
          Ini adalah analisis struktural — bukan penilaian kualitas jurnalisme.
        </p>
      </div>
    </Card>
  )
}

// ── Stats Banner ──────────────────────────────────────────────────────────────
function StatsBanner() {
  const totalOutlets = MEDIA_OWNERSHIP.length
  const politicallyOwned = MEDIA_OWNERSHIP.filter(m => m.partai !== null).length
  const totalNarratives = NARRATIVE_FRAMES.length
  const avgIntentas = (NARRATIVE_FRAMES.reduce((s, f) => s + f.intensitas, 0) / totalNarratives).toFixed(1)

  const stats = [
    { label: 'Outlet Dipantau', value: totalOutlets, icon: '📺', color: '#3b82f6' },
    { label: 'Dimiliki Politisi', value: politicallyOwned, icon: '🏛️', color: '#f97316' },
    { label: 'Isu Perang Narasi', value: totalNarratives, icon: '⚔️', color: '#ef4444' },
    { label: 'Rata-rata Intensitas', value: `${avgIntentas}/10`, icon: '🌡️', color: '#a78bfa' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(stat => (
        <Card key={stat.label} className="p-4 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">{stat.icon}</span>
            <span className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</span>
          </div>
          <p className="text-xs text-text-muted">{stat.label}</p>
        </Card>
      ))}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MediaMonitorPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="📺 Monitor Media"
        subtitle="Peta kepemilikan, liputan, dan perang narasi media Indonesia"
      />

      {/* Concept card */}
      <Card className="p-5 border border-purple-500/20 bg-gradient-to-r from-purple-900/10 to-blue-900/10">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">🧠</span>
          <div>
            <h2 className="text-text-primary font-bold text-base mb-1">Mengapa Media Monitoring Penting?</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              <strong className="text-text-primary">Kepemilikan media</strong> di Indonesia sangat terkonsentrasi — beberapa konglomerat
              dan politisi mengontrol jaringan TV, online, dan cetak yang dominan.
              Ini menciptakan risiko <em>agenda setting</em> dan <em>narrative capture</em> di mana liputan politik
              dipengaruhi oleh kepentingan pemilik.
              <br /><br />
              <span className="text-purple-300">PetaPolitik</span> memetakan siapa yang memiliki apa, bagaimana outlet meliput tokoh berbeda,
              dan di mana terjadi <strong className="text-text-primary">perang narasi</strong> paling intens.
            </p>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <StatsBanner />

      {/* Section 1: Ownership */}
      <OwnershipMap />

      {/* Section 2: Coverage Comparison */}
      <CoverageComparison />

      {/* Section 3: Narrative Frames */}
      <NarrativeSection />

      {/* Section 4: Slant Index */}
      <SlantIndex />
    </div>
  )
}
