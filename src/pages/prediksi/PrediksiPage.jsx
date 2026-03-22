import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line,
} from 'recharts'
import { KANDIDAT_2029, FAKTOR_GLOBAL, SKENARIO_PRESET } from '../../data/prediksi2029'
import { PARTY_MAP } from '../../data/parties'
import { Card } from '../../components/ui'

// ── Color map ─────────────────────────────────────────────────────────────────
const KANDIDAT_COLORS = {
  prabowo:      '#ef4444',
  anies:        '#3b82f6',
  ahy:          '#64748b',
  ganjar:       '#22c55e',
  ridwan_kamil: '#14b8a6',
  cakimin:      '#a855f7',
}

// ── Scoring algorithm ─────────────────────────────────────────────────────────
function calculateProbabilities(candidates, factors) {
  const adjusted = candidates.map(c => {
    let score = c.probabilitas_base

    if (c.id === 'prabowo') {
      score += (factors.ekonomi - 5) * 2
      score += (factors.infrastruktur - 5) * 1.5
      score -= (factors.polarisasi - 5) * 1.5
      score += (factors.media - 5) * 1
    }

    if (['anies', 'ganjar'].includes(c.id)) {
      score += (factors.polarisasi - 5) * 1
      score += (factors.pdip_kekuatan - 5) * (c.id === 'ganjar' ? 1.5 : 0.5)
    }

    if (['anies', 'cakimin'].includes(c.id)) {
      score += (factors.isu_agama - 5) * 1
    }

    return { ...c, adjusted: Math.max(2, score) }
  })

  const total = adjusted.reduce((s, c) => s + c.adjusted, 0)
  return adjusted.map(c => ({
    ...c,
    probability: Math.round((c.adjusted / total) * 100),
  }))
}

// ── Default factor values ─────────────────────────────────────────────────────
const DEFAULT_FACTORS = Object.fromEntries(
  FAKTOR_GLOBAL.map(f => [f.id, f.default])
)

// ── Narrative generator ───────────────────────────────────────────────────────
function generateNarrative(factors, results) {
  const winner = results[0]
  const runnerUp = results[1]

  const ekonomiLabel = factors.ekonomi >= 7 ? 'tinggi' : factors.ekonomi <= 3 ? 'rendah' : 'moderat'
  const polarisasiLabel = factors.polarisasi >= 7 ? 'tinggi' : factors.polarisasi <= 3 ? 'rendah' : 'sedang'
  const mediaLabel = factors.media >= 7 ? 'dominan' : factors.media <= 3 ? 'lemah' : 'terbatas'
  const agamaLabel = factors.isu_agama >= 7 ? 'tinggi' : factors.isu_agama <= 3 ? 'rendah' : 'moderat'

  let narrative = `📊 **Analisis Skenario Pilpres 2029**\n\n`

  // Ekonomi
  if (factors.ekonomi >= 7) {
    narrative += `Dengan pertumbuhan ekonomi ${ekonomiLabel} (${factors.ekonomi}/10), petahana Prabowo Subianto mendapat dorongan elektoral signifikan — pemilih cenderung mempertahankan pemerintahan yang berhasil menjaga kemakmuran. `
  } else if (factors.ekonomi <= 3) {
    narrative += `Pertumbuhan ekonomi yang ${ekonomiLabel} (${factors.ekonomi}/10) menjadi beban berat bagi petahana. Kekecewaan publik membuka peluang besar bagi kandidat oposisi. `
  } else {
    narrative += `Pertumbuhan ekonomi ${ekonomiLabel} (${factors.ekonomi}/10) tidak memberikan keuntungan jelas bagi satu pihak. `
  }

  // Polarisasi
  if (factors.polarisasi >= 7) {
    narrative += `Polarisasi politik yang ${polarisasiLabel} (${factors.polarisasi}/10) menguntungkan kandidat oposisi seperti Anies Baswedan dan Ganjar Pranowo yang bisa memanfaatkan sentimen anti-pemerintah. `
  } else if (factors.polarisasi <= 3) {
    narrative += `Dengan polarisasi ${polarisasiLabel} (${factors.polarisasi}/10), pemilih lebih menyukai stabilitas — menguntungkan petahana. `
  } else {
    narrative += `Tingkat polarisasi ${polarisasiLabel} (${factors.polarisasi}/10) tidak mengubah peta politik secara drastis. `
  }

  // Isu agama
  if (factors.isu_agama >= 7) {
    narrative += `Sentimen isu agama yang ${agamaLabel} (${factors.isu_agama}/10) menguntungkan kandidat berbasis Islam seperti Anies Baswedan dan Muhaimin Iskandar. `
  } else if (factors.isu_agama <= 3) {
    narrative += `Melemahnya isu identitas agama (${factors.isu_agama}/10) mereduksi basis suara kandidat berhaluan religius. `
  }

  // Media
  if (factors.media >= 7) {
    narrative += `Penguasaan media yang ${mediaLabel} (${factors.media}/10) memperkuat naratif pro-pemerintah di ruang publik. `
  } else if (factors.media <= 3) {
    narrative += `Lemahnya penguasaan media (${factors.media}/10) memberi ruang lebih bagi oposisi memengaruhi opini publik. `
  }

  // Kesimpulan
  narrative += `\n\n**Kesimpulan:** Dalam skenario ini, **${winner.nama}** memimpin dengan estimasi ${winner.probability}% peluang kemenangan, diikuti **${runnerUp.nama}** di posisi kedua (${runnerUp.probability}%). `

  if (winner.probability > 45) {
    narrative += `Selisih yang cukup besar menunjukkan dominasi yang kuat — kecuali ada kejutan besar di sisa perjalanan menuju 2029.`
  } else {
    narrative += `Selisih yang tipis mengindikasikan persaingan sangat ketat — satu perubahan faktor kunci bisa membalik situasi.`
  }

  return narrative
}

// ── Sparkline (mini trend chart) ──────────────────────────────────────────────
function Sparkline({ data, color }) {
  const chartData = data.map((v, i) => ({ i, v }))
  return (
    <ResponsiveContainer width="100%" height={36}>
      <LineChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

// ── Custom tooltip for bar chart ──────────────────────────────────────────────
function CustomBarTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-bg-card border border-border rounded-lg px-3 py-2 text-sm shadow-xl">
      <p className="font-semibold text-text-primary">{d.nama}</p>
      <p style={{ color: d.color }} className="font-bold">{d.probability}%</p>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function PrediksiPage() {
  const [factors, setFactors] = useState(DEFAULT_FACTORS)
  const [activeScenario, setActiveScenario] = useState('status_quo')
  const [tooltip, setTooltip] = useState(null)

  const results = useMemo(
    () => calculateProbabilities(KANDIDAT_2029, factors).sort((a, b) => b.probability - a.probability),
    [factors]
  )

  const barData = results.map(r => ({
    ...r,
    color: KANDIDAT_COLORS[r.id] || '#94a3b8',
  }))

  const narrative = useMemo(() => generateNarrative(factors, results), [factors, results])

  function applyScenario(scenario) {
    setFactors({ ...scenario.factors })
    setActiveScenario(scenario.id)
  }

  function resetFactors() {
    setFactors({ ...DEFAULT_FACTORS })
    setActiveScenario('status_quo')
  }

  function handleSlider(id, value) {
    setFactors(prev => ({ ...prev, [id]: Number(value) }))
    setActiveScenario(null)
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔮</span>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Prediksi Pilpres 2029</h1>
            <p className="text-text-secondary text-sm">
              Mesin prediksi interaktif — geser faktor untuk melihat peluang kemenangan tiap kandidat
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            ⚠️ Simulasi berbasis data historis — bukan prediksi resmi
          </span>
          <span className="text-xs text-text-muted">Data: Maret 2026</span>
        </div>
      </div>

      {/* ── Section 1: Probability Bar Chart ── */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-text-primary">📊 Peluang Kemenangan</h2>
            <p className="text-xs text-text-secondary">Dinormalisasi otomatis ke 100%</p>
          </div>
          <div className="flex gap-1.5 flex-wrap justify-end">
            {results.slice(0, 3).map((r, i) => (
              <div key={r.id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-bg-elevated border border-border text-xs">
                <span className="font-bold" style={{ color: KANDIDAT_COLORS[r.id] }}>#{i + 1}</span>
                <span className="text-text-secondary">{r.nama.split(' ')[0]}</span>
                <span className="font-bold text-text-primary">{r.probability}%</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={barData}
            layout="vertical"
            margin={{ top: 0, right: 40, bottom: 0, left: 120 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis
              type="number"
              domain={[0, 60]}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickFormatter={v => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="nama"
              tick={{ fontSize: 12, fill: '#e2e8f0' }}
              width={118}
              tickFormatter={name => name.length > 16 ? name.slice(0, 16) + '…' : name}
            />
            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Bar dataKey="probability" radius={[0, 6, 6, 0]} maxBarSize={28}>
              {barData.map(entry => (
                <Cell key={entry.id} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* ── Section 2: Factor Sliders ── */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-text-primary">⚙️ Faktor Penentu</h2>
            <p className="text-xs text-text-secondary">Geser slider untuk mengubah kondisi politik-ekonomi</p>
          </div>
          <button
            onClick={resetFactors}
            className="text-xs px-3 py-1.5 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-all"
          >
            ↺ Reset
          </button>
        </div>

        {/* Scenario presets */}
        <div className="mb-5">
          <p className="text-xs text-text-muted mb-2 font-medium uppercase tracking-wide">Preset Skenario</p>
          <div className="flex flex-wrap gap-2">
            {SKENARIO_PRESET.map(s => (
              <button
                key={s.id}
                onClick={() => applyScenario(s)}
                title={s.desc}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  activeScenario === s.id
                    ? 'bg-accent-red border-accent-red text-white'
                    : 'border-border text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          {activeScenario && (
            <p className="text-xs text-text-muted mt-2">
              {SKENARIO_PRESET.find(s => s.id === activeScenario)?.desc}
            </p>
          )}
        </div>

        {/* Sliders */}
        <div className="space-y-4">
          {FAKTOR_GLOBAL.map(f => (
            <div key={f.id} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-primary">{f.label}</span>
                  {/* Tooltip trigger */}
                  <button
                    className="w-4 h-4 rounded-full bg-bg-elevated text-text-muted text-[10px] flex items-center justify-center border border-border hover:border-accent-red hover:text-accent-red transition-colors"
                    onMouseEnter={() => setTooltip(f.id)}
                    onMouseLeave={() => setTooltip(null)}
                    aria-label={`Info: ${f.label}`}
                  >
                    ?
                  </button>
                  {tooltip === f.id && (
                    <div className="absolute z-50 mt-6 ml-4 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg shadow-xl border border-white/10 max-w-xs pointer-events-none">
                      {f.description}
                    </div>
                  )}
                </div>
                <span
                  className="text-sm font-bold tabular-nums w-8 text-right"
                  style={{ color: factors[f.id] >= 7 ? '#22c55e' : factors[f.id] <= 3 ? '#ef4444' : '#f59e0b' }}
                >
                  {factors[f.id]}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-muted w-4">1</span>
                <input
                  type="range"
                  min={f.min}
                  max={f.max}
                  step={1}
                  value={factors[f.id]}
                  onChange={e => handleSlider(f.id, e.target.value)}
                  className="flex-1 h-2 rounded-full appearance-none cursor-pointer accent-red-500"
                  aria-label={f.label}
                />
                <span className="text-xs text-text-muted w-4">10</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Section 3: Candidate Cards ── */}
      <div>
        <h2 className="text-base font-bold text-text-primary mb-3">🎯 Profil Kandidat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((kandidat, rank) => {
            const color = KANDIDAT_COLORS[kandidat.id] || '#94a3b8'
            const party = kandidat.partai ? PARTY_MAP[kandidat.partai] : null

            return (
              <Card key={kandidat.id} className="p-4 relative overflow-hidden" colorLeft={color}>
                {/* Rank badge */}
                <div
                  className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: color }}
                >
                  #{rank + 1}
                </div>

                {/* Avatar + name */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: color + '33', border: `2px solid ${color}` }}
                  >
                    {kandidat.nama.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-text-primary text-sm leading-tight truncate">{kandidat.nama}</p>
                    {party ? (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-0.5"
                        style={{ backgroundColor: party.color + '22', color: party.color, border: `1px solid ${party.color}44` }}
                      >
                        {party.logo_emoji} {party.abbr}
                      </span>
                    ) : (
                      <span className="text-xs text-text-muted mt-0.5 inline-block">Nonpartisan</span>
                    )}
                  </div>
                </div>

                {/* Probability */}
                <div className="flex items-end justify-between mb-2">
                  <div>
                    <p className="text-xs text-text-muted">Peluang Menang</p>
                    <p className="text-2xl font-black" style={{ color }}>{kandidat.probability}%</p>
                  </div>
                  <div className="w-28">
                    <p className="text-[10px] text-text-muted mb-1 text-right">Tren Elektabilitas</p>
                    <Sparkline data={kandidat.elektabilitas_trend} color={color} />
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-bg-elevated mb-3">
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, kandidat.probability * 2)}%`, backgroundColor: color }}
                  />
                </div>

                {/* Faktor positif */}
                {kandidat.faktor_positif.length > 0 && (
                  <div className="mb-2">
                    <p className="text-[10px] text-text-muted uppercase tracking-wide mb-1">✅ Positif</p>
                    <div className="flex flex-wrap gap-1">
                      {kandidat.faktor_positif.map(f => (
                        <span key={f} className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Faktor negatif */}
                {kandidat.faktor_negatif.length > 0 && (
                  <div className="mb-2">
                    <p className="text-[10px] text-text-muted uppercase tracking-wide mb-1">⚠️ Risiko</p>
                    <div className="flex flex-wrap gap-1">
                      {kandidat.faktor_negatif.map(f => (
                        <span key={f} className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Koalisi */}
                {kandidat.koalisi.length > 0 && (
                  <div>
                    <p className="text-[10px] text-text-muted uppercase tracking-wide mb-1">🤝 Koalisi</p>
                    <div className="flex flex-wrap gap-1">
                      {kandidat.koalisi.map(pid => {
                        const p = PARTY_MAP[pid]
                        if (!p) return null
                        return (
                          <span
                            key={pid}
                            className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                            style={{ backgroundColor: p.color + '22', color: p.color, border: `1px solid ${p.color}44` }}
                          >
                            {p.logo_emoji} {p.abbr}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>

      {/* ── Section 4: Analisis Naratif ── */}
      <Card className="p-5">
        <h2 className="text-base font-bold text-text-primary mb-3">📝 Analisis Naratif</h2>
        <div className="prose prose-sm max-w-none">
          {narrative.split('\n\n').map((para, i) => {
            if (para.startsWith('📊 **')) {
              return (
                <h3 key={i} className="text-text-primary font-bold text-base mb-3">
                  {para.replace(/\*\*/g, '')}
                </h3>
              )
            }
            // Replace **bold** with actual bold spans
            const parts = para.split(/(\*\*[^*]+\*\*)/)
            return (
              <p key={i} className="text-text-secondary text-sm leading-relaxed mb-2">
                {parts.map((part, j) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={j} className="text-text-primary font-semibold">{part.slice(2, -2)}</strong>
                  }
                  return part
                })}
              </p>
            )
          })}
        </div>

        {/* Factor summary chips */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-text-muted mb-2 font-medium uppercase tracking-wide">Kondisi Skenario Aktif</p>
          <div className="flex flex-wrap gap-2">
            {FAKTOR_GLOBAL.map(f => {
              const val = factors[f.id]
              const isHigh = val >= 7
              const isLow = val <= 3
              return (
                <div
                  key={f.id}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${
                    isHigh
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : isLow
                      ? 'bg-red-500/10 text-red-400 border-red-500/20'
                      : 'bg-bg-elevated text-text-secondary border-border'
                  }`}
                >
                  <span>{f.label}</span>
                  <span className="font-bold">{val}/10</span>
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      {/* Disclaimer */}
      <div className="text-center pb-4">
        <p className="text-xs text-text-muted max-w-lg mx-auto">
          ⚠️ Simulasi ini menggunakan model statistik sederhana berdasarkan data publik.
          Bukan prediksi resmi. Hasilnya dapat berubah sesuai dinamika politik 2026–2029.
        </p>
      </div>
    </div>
  )
}
