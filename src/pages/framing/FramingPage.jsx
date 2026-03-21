import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader, Card, Badge } from '../../components/ui'
import {
  FRAMING_CASES,
  OUTLET_PROFILES,
  FRAMING_CATEGORIES,
  BIAS_META,
} from '../../data/framing'

// ── Sentiment Bar ─────────────────────────────────────────────────────────────
function SentimentBar({ value }) {
  // value: -1.0 to +1.0
  const pct = ((value + 1) / 2) * 100
  const color =
    value < -0.4 ? '#ef4444' :
    value < 0.1  ? '#eab308' :
                   '#22c55e'
  const label =
    value < -0.4 ? 'Negatif' :
    value < 0.1  ? 'Netral' :
                   'Positif'

  return (
    <div className="mt-2">
      <div className="flex justify-between text-[10px] text-text-muted mb-1">
        <span>Sentimen</span>
        <span style={{ color }}>{label} ({value > 0 ? '+' : ''}{value.toFixed(1)})</span>
      </div>
      <div className="h-1.5 rounded-full bg-bg-elevated overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, #ef4444 0%, #eab308 50%, #22c55e 100%)`, clipPath: 'none' }}
        />
        {/* Indicator dot */}
      </div>
      <div className="relative h-2 -mt-0.5">
        <div
          className="absolute w-2 h-2 rounded-full border-2 border-bg-card -translate-x-1/2"
          style={{ left: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

// ── Controversy Meter ─────────────────────────────────────────────────────────
function ControversyMeter({ level }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-text-muted">Kontroversi</span>
      <div className="flex gap-0.5">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-3 rounded-sm transition-all"
            style={{
              backgroundColor: i < level
                ? i < 4 ? '#22c55e' : i < 7 ? '#eab308' : '#ef4444'
                : 'rgba(255,255,255,0.08)'
            }}
          />
        ))}
      </div>
      <span className="text-xs font-bold" style={{ color: level >= 8 ? '#ef4444' : level >= 5 ? '#eab308' : '#22c55e' }}>
        {level}/10
      </span>
    </div>
  )
}

// ── Outlet Frame Card ─────────────────────────────────────────────────────────
function OutletFrameCard({ frame }) {
  const meta = BIAS_META[frame.bias] || BIAS_META['netral']
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-2 border"
      style={{
        background: meta.bg,
        borderColor: `${meta.color}30`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-text-primary text-sm">{frame.outlet}</span>
        <span
          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
          style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}50` }}
        >
          {meta.dot} {meta.label}
        </span>
      </div>
      {/* Headline */}
      <p className="italic text-text-secondary text-xs leading-relaxed">
        "{frame.headline}"
      </p>
      {/* Angle */}
      <div className="flex items-start gap-1.5">
        <span className="text-text-muted text-[10px] mt-0.5">↪</span>
        <p className="text-text-muted text-[11px] leading-tight">{frame.angle}</p>
      </div>
      {/* Sentiment */}
      <SentimentBar value={frame.sentiment} />
    </div>
  )
}

// ── Case Card ─────────────────────────────────────────────────────────────────
function CaseCard({ case_ }) {
  const [expanded, setExpanded] = useState(true)
  const avgSentiment = case_.frames.reduce((s, f) => s + f.sentiment, 0) / case_.frames.length
  const spread = Math.max(...case_.frames.map(f => f.sentiment)) - Math.min(...case_.frames.map(f => f.sentiment))

  return (
    <Card className="p-5 flex flex-col gap-4">
      {/* Top row */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <Badge variant="danger" className="text-[10px]">{case_.category}</Badge>
            <span className="text-xs text-text-muted">{case_.date}</span>
          </div>
          <h3 className="text-text-primary font-bold text-base leading-snug">{case_.topic}</h3>
          {/* Person chips */}
          {case_.person_ids?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {case_.person_ids.map(pid => (
                <Link
                  key={pid}
                  to={`/persons/${pid}`}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-accent-red/10 text-accent-red border border-accent-red/20 hover:bg-accent-red/20 transition-colors"
                >
                  👤 {pid.replace(/_/g, ' ')}
                </Link>
              ))}
            </div>
          )}
        </div>
        {/* Right side metrics */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <ControversyMeter level={case_.controversy_level} />
          <div className="flex gap-3 text-xs text-text-muted">
            <span>Spread: <strong style={{ color: spread > 1 ? '#ef4444' : '#eab308' }}>{spread.toFixed(1)}</strong></span>
            <span>Avg: <strong style={{ color: avgSentiment < 0 ? '#ef4444' : '#22c55e' }}>{avgSentiment > 0 ? '+' : ''}{avgSentiment.toFixed(2)}</strong></span>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            {expanded ? '▲ Lipat' : '▼ Buka'}
          </button>
        </div>
      </div>

      {expanded && (
        <>
          {/* Framing spread visual */}
          <div className="h-1 rounded-full bg-bg-elevated overflow-hidden relative">
            {case_.frames.map((f, i) => {
              const pct = ((f.sentiment + 1) / 2) * 100
              const meta = BIAS_META[f.bias] || BIAS_META['netral']
              return (
                <div
                  key={i}
                  className="absolute top-0 w-1 h-full rounded-sm"
                  style={{ left: `${pct}%`, backgroundColor: meta.color }}
                  title={`${f.outlet}: ${f.sentiment}`}
                />
              )
            })}
          </div>

          {/* Outlet cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {case_.frames.map((frame, i) => (
              <OutletFrameCard key={i} frame={frame} />
            ))}
          </div>

          {/* Summary insight */}
          <div className="rounded-xl p-4 bg-bg-elevated border border-border">
            <div className="flex items-start gap-2">
              <span className="text-lg flex-shrink-0">💡</span>
              <div>
                <p className="text-xs font-semibold text-text-primary mb-1">Insight Framing</p>
                <p className="text-sm text-text-secondary leading-relaxed">{case_.summary}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  )
}

// ── Outlet Profiles Table ─────────────────────────────────────────────────────
function OutletProfilesTable() {
  return (
    <Card className="p-5">
      <h2 className="text-text-primary font-bold text-base mb-4">📋 Profil Outlet & Kepemilikan</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 text-text-muted text-xs font-medium">Outlet</th>
              <th className="text-left py-2 px-3 text-text-muted text-xs font-medium">Bias</th>
              <th className="text-left py-2 px-3 text-text-muted text-xs font-medium hidden sm:table-cell">Pemilik</th>
              <th className="text-left py-2 px-3 text-text-muted text-xs font-medium hidden md:table-cell">Afiliasi Politik</th>
              <th className="text-right py-2 px-3 text-text-muted text-xs font-medium">Kredibilitas</th>
            </tr>
          </thead>
          <tbody>
            {OUTLET_PROFILES.map(outlet => {
              const meta = BIAS_META[outlet.bias] || BIAS_META['netral']
              return (
                <tr key={outlet.id} className="border-b border-border/50 hover:bg-bg-elevated transition-colors">
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-text-primary">{outlet.name}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                      style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}40` }}
                    >
                      {meta.dot} {meta.label}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-text-secondary text-xs hidden sm:table-cell">{outlet.owner}</td>
                  <td className="py-2.5 px-3 text-text-muted text-xs hidden md:table-cell capitalize">{outlet.political}</td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-0.5">
                      {[...Array(10)].map((_, i) => (
                        <span key={i} className="text-[10px]" style={{ color: i < outlet.credibility ? '#f59e0b' : 'rgba(255,255,255,0.1)' }}>★</span>
                      ))}
                      <span className="text-xs text-text-muted ml-1">({outlet.credibility}/10)</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// ── Bias Spectrum Visual ──────────────────────────────────────────────────────
function BiasSpectrumBar() {
  // Assign position to each outlet on the spectrum
  const positions = {
    'rmol':      -0.85,
    'tempo':     -0.55,
    'metro_tv':  -0.15,
    'detik':      0.05,
    'antara':     0.15,
    'kompas':     0.20,
    'republika':  0.60,
  }
  return (
    <Card className="p-5">
      <h2 className="text-text-primary font-bold text-base mb-4">🎯 Spektrum Bias Media Indonesia</h2>
      <div className="relative">
        {/* Track */}
        <div className="h-3 rounded-full bg-gradient-to-r from-red-600 via-yellow-500 to-green-500 mx-6 my-10" />
        {/* Labels */}
        <div className="flex justify-between text-[11px] text-text-muted px-6 -mt-7 mb-6">
          <span className="text-red-400">← Kritis / Oposisi</span>
          <span className="text-yellow-400">Netral</span>
          <span className="text-green-400">Pro-Pemerintah →</span>
        </div>
        {/* Outlet dots */}
        <div className="relative h-16 mx-6 mt-2">
          {OUTLET_PROFILES.map(outlet => {
            const pos = positions[outlet.id] ?? 0
            const pct = ((pos + 1) / 2) * 100
            const meta = BIAS_META[outlet.bias] || BIAS_META['netral']
            return (
              <div
                key={outlet.id}
                className="absolute flex flex-col items-center"
                style={{ left: `calc(${pct}% - 24px)` }}
              >
                <div
                  className="w-4 h-4 rounded-full border-2 border-bg-card shadow-lg cursor-pointer hover:scale-150 transition-transform"
                  style={{ backgroundColor: meta.color }}
                  title={outlet.name}
                />
                <span className="text-[10px] text-text-secondary mt-1 whitespace-nowrap text-center">
                  {outlet.name}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

// ── Framing Divergence Summary ────────────────────────────────────────────────
function FramingStats() {
  const totalCases = FRAMING_CASES.length
  const totalFrames = FRAMING_CASES.reduce((s, c) => s + c.frames.length, 0)
  const avgControversy = (FRAMING_CASES.reduce((s, c) => s + c.controversy_level, 0) / totalCases).toFixed(1)
  const maxSpread = Math.max(...FRAMING_CASES.map(c => {
    const sentiments = c.frames.map(f => f.sentiment)
    return Math.max(...sentiments) - Math.min(...sentiments)
  })).toFixed(1)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { label: 'Kasus Framing', value: totalCases, icon: '📰', color: '#3b82f6' },
        { label: 'Total Liputan', value: totalFrames, icon: '🗞️', color: '#8b5cf6' },
        { label: 'Rata-rata Kontroversi', value: `${avgControversy}/10`, icon: '🌡️', color: '#ef4444' },
        { label: 'Max Spread Sentimen', value: maxSpread, icon: '↔️', color: '#f97316' },
      ].map(stat => (
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
export default function FramingPage() {
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterOutlet, setFilterOutlet] = useState('all')
  const [filterSentiment, setFilterSentiment] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCases = useMemo(() => {
    return FRAMING_CASES.filter(c => {
      // Category filter
      if (filterCategory !== 'all' && c.category !== filterCategory) return false
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matched = c.topic.toLowerCase().includes(q) ||
          c.frames.some(f => f.headline.toLowerCase().includes(q) || f.outlet.toLowerCase().includes(q))
        if (!matched) return false
      }
      // Outlet filter
      if (filterOutlet !== 'all') {
        if (!c.frames.some(f => f.outlet.toLowerCase().replace(/\s+/g, '_') === filterOutlet)) return false
      }
      // Sentiment filter
      if (filterSentiment !== 'all') {
        const avg = c.frames.reduce((s, f) => s + f.sentiment, 0) / c.frames.length
        if (filterSentiment === 'negatif' && avg >= -0.1) return false
        if (filterSentiment === 'netral' && (avg < -0.1 || avg > 0.2)) return false
        if (filterSentiment === 'positif' && avg <= 0.2) return false
      }
      return true
    })
  }, [filterCategory, filterOutlet, filterSentiment, searchQuery])

  const allOutlets = [...new Set(FRAMING_CASES.flatMap(c => c.frames.map(f => f.outlet)))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="🗞️ Framing Media"
        subtitle="Satu Fakta, Banyak Narasi"
      />

      {/* Concept explanation */}
      <Card className="p-5 border border-blue-500/20 bg-gradient-to-r from-blue-900/10 to-purple-900/10">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">🧠</span>
          <div>
            <h2 className="text-text-primary font-bold text-base mb-1">Apa itu Media Framing?</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              <strong className="text-text-primary">Framing</strong> adalah cara media membingkai fakta yang sama dengan sudut pandang berbeda.
              Dua outlet bisa meliput kejadian yang persis sama, namun dengan pilihan kata, konteks, dan penekanan yang sangat berbeda —
              membentuk persepsi yang berbeda pula di benak pembaca.
              <br /><br />
              <span className="text-blue-300">PetaPolitik</span> memetakan bagaimana outlet berbeda meliput isu politik yang sama,
              mengukur <em>sentiment spread</em> dan mendeteksi narasi yang dominan vs. terpinggirkan.
            </p>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <FramingStats />

      {/* Bias Spectrum */}
      <BiasSpectrumBar />

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <input
            type="text"
            placeholder="🔍 Cari isu, outlet, atau headline..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-bg-elevated border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-red transition-colors"
          />
          {/* Category filter */}
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-lg bg-bg-elevated border border-border text-text-primary text-sm focus:outline-none focus:border-accent-red"
          >
            {FRAMING_CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
          {/* Outlet filter */}
          <select
            value={filterOutlet}
            onChange={e => setFilterOutlet(e.target.value)}
            className="px-3 py-2 rounded-lg bg-bg-elevated border border-border text-text-primary text-sm focus:outline-none focus:border-accent-red"
          >
            <option value="all">Semua Outlet</option>
            {allOutlets.map(o => (
              <option key={o} value={o.toLowerCase().replace(/\s+/g, '_')}>{o}</option>
            ))}
          </select>
          {/* Sentiment filter */}
          <select
            value={filterSentiment}
            onChange={e => setFilterSentiment(e.target.value)}
            className="px-3 py-2 rounded-lg bg-bg-elevated border border-border text-text-primary text-sm focus:outline-none focus:border-accent-red"
          >
            <option value="all">Semua Sentimen</option>
            <option value="negatif">🔴 Cenderung Negatif</option>
            <option value="netral">🟡 Cenderung Netral</option>
            <option value="positif">🟢 Cenderung Positif</option>
          </select>
        </div>
        {/* Active filter badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs text-text-muted">
            Menampilkan {filteredCases.length} dari {FRAMING_CASES.length} kasus
          </span>
          {filterCategory !== 'all' && (
            <button onClick={() => setFilterCategory('all')} className="text-xs px-2 py-0.5 rounded-full bg-accent-red/20 text-accent-red hover:bg-accent-red/30">
              Kategori: {filterCategory} ×
            </button>
          )}
          {filterOutlet !== 'all' && (
            <button onClick={() => setFilterOutlet('all')} className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
              Outlet: {filterOutlet} ×
            </button>
          )}
          {filterSentiment !== 'all' && (
            <button onClick={() => setFilterSentiment('all')} className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">
              Sentimen: {filterSentiment} ×
            </button>
          )}
        </div>
      </Card>

      {/* Case Cards */}
      <div className="space-y-5">
        {filteredCases.length === 0 ? (
          <Card className="p-10 text-center text-text-muted">
            <p className="text-3xl mb-2">🗞️</p>
            <p>Tidak ada kasus yang sesuai filter. Coba ubah filter Anda.</p>
          </Card>
        ) : (
          filteredCases.map(c => <CaseCard key={c.id} case_={c} />)
        )}
      </div>

      {/* Outlet Profiles Table */}
      <OutletProfilesTable />

      {/* Legend */}
      <Card className="p-4">
        <h3 className="text-text-primary font-semibold text-sm mb-3">📚 Legenda Bias Media</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {Object.entries(BIAS_META).map(([key, meta]) => (
            <div key={key} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: meta.bg }}>
              <span className="text-sm">{meta.dot}</span>
              <div>
                <p className="text-xs font-medium" style={{ color: meta.color }}>{meta.label}</p>
                <p className="text-[10px] text-text-muted">
                  {key === 'kritis' && 'Investigatif & kritis'}
                  {key === 'netral' && 'Berimbang / faktual'}
                  {key === 'pro-pemerintah' && 'Mendukung kebijakan'}
                  {key === 'pro-nasdem' && 'Afiliasi Partai NasDem'}
                  {key === 'oposisi' && 'Anti-pemerintah'}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-[11px] text-text-muted leading-relaxed">
            ⚠️ <strong className="text-text-secondary">Catatan metodologi:</strong> Klasifikasi bias didasarkan pada analisis editorial, kepemilikan, dan pola liputan historis.
            Sentimen dihitung secara kualitatif berdasarkan tone dan framing berita. Ini adalah alat analisis kritis, bukan penilaian akurasi faktual.
          </p>
        </div>
      </Card>
    </div>
  )
}
