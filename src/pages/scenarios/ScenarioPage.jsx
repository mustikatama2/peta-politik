import { useState, useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

// ─── DATA ─────────────────────────────────────────────────────────────────────

const BASE_SCENARIOS = [
  {
    id: 'prabowo_reelect',
    title: 'Skenario A: Prabowo Terpilih Kembali',
    baseProbability: 45,
    conditions: [
      'Ekonomi tumbuh >5%',
      'MBG berhasil',
      'Tidak ada krisis besar',
      'Koalisi KIM+ solid',
    ],
    candidates: [
      { name: 'Prabowo Subianto', role: 'Incumbent', support: 48, party: 'KIM+' },
      { name: 'Anies Baswedan', role: 'Oposisi', support: 28, party: 'PDIP+Perubahan' },
      { name: 'Kandidat Ketiga', role: 'Swing', support: 24, party: 'PKB/lain' },
    ],
    outcome: 'Kontinuitas kebijakan Kabinet Merah Putih. Prabowo pensiun 2034 usia 83.',
    risk: 'Suksesi tidak jelas — tidak ada heir apparent yang kuat',
    color: '#EF4444',
    colorClass: 'red',
  },
  {
    id: 'anies_comeback',
    title: 'Skenario B: Kebangkitan Oposisi',
    baseProbability: 25,
    conditions: [
      'Ekonomi melemah',
      'Efisiensi APBN dipersepsi merugikan rakyat',
      'PDIP solid mendukung Anies',
      'PKB bergabung oposisi',
    ],
    candidates: [
      { name: 'Anies Baswedan', role: 'Oposisi', support: 38, party: 'PDIP+PKB+PKS' },
      { name: 'Prabowo / Penggantinya', role: 'Incumbent', support: 35, party: 'KIM+' },
      { name: 'Kandidat Ketiga', role: 'Swing', support: 27, party: 'Nasdem/lain' },
    ],
    outcome: 'Perubahan rezim. Reformasi birokrasi lebih dalam. Hubungan sipil-militer berubah.',
    risk: 'Koalisi oposisi terpecah setelah menang',
    color: '#3B82F6',
    colorClass: 'blue',
  },
  {
    id: 'new_figure',
    title: 'Skenario C: Figur Baru Mendominasi',
    baseProbability: 20,
    conditions: [
      'Generasi muda frustrasi',
      'Kandidat fresh face muncul',
      'Medsos mendorong figur non-partai',
      'Prabowo tidak maju/mundur',
    ],
    candidates: [
      { name: 'Figur Baru (RK/AHY/Lainnya)', role: 'Dark Horse', support: 35, party: 'Koalisi baru' },
      { name: 'Anies Baswedan', role: 'Oposisi veteran', support: 30, party: 'PDIP' },
      { name: 'Kandidat KIM+', role: 'Incumbent surrogate', support: 35, party: 'KIM+' },
    ],
    outcome: 'Regenerasi kepemimpinan. Dinamika partai berubah total.',
    risk: 'Figur baru tanpa pengalaman pemerintahan',
    color: '#22C55E',
    colorClass: 'green',
  },
  {
    id: 'unstable',
    title: 'Skenario D: Instabilitas Politik',
    baseProbability: 10,
    conditions: [
      'Krisis ekonomi besar',
      'Korupsi skandal meledak',
      'Demo mahasiswa besar',
      'Koalisi KIM+ pecah',
    ],
    candidates: [
      { name: 'Tidak ada frontrunner jelas', role: '—', support: null, party: '—' },
    ],
    outcome: 'Pemilu terpecah, putaran kedua. Koalisi ad-hoc. Instabilitas kebijakan.',
    risk: 'Risiko tertinggi bagi demokrasi dan ekonomi',
    color: '#F59E0B',
    colorClass: 'yellow',
  },
]

// Factor: how each factor setting adjusts base probabilities [A, B, C, D]
const FACTOR_ADJUSTMENTS = {
  ekonomi: {
    baik:   [+6, -4, -2, -4],
    sedang: [0,   0,  0,  0],
    buruk:  [-6,  +6, +2, +8],
  },
  prabowo: {
    tinggi: [+6, -4, -2, 0],
    sedang: [0,   0,  0, 0],
    rendah: [-6,  +3, +5, +3],
  },
  kim_solidity: {
    solid: [+5, -3, -2, 0],
    retak: [-3,  +2, +3, +2],
    pecah: [-9,  +3, +3, +8],
  },
  oposisi: {
    bersatu:  [-4, +8, -3, 0],
    terpecah: [+4, -6, +3, 0],
  },
}

// Condition bonuses: how many active conditions shift probability
// Scenarios get +2 per active favorable condition
const CONDITION_BONUS = 2

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function computeProbabilities(factors, conditionToggles) {
  const raw = BASE_SCENARIOS.map((s, idx) => {
    let p = s.baseProbability

    // Factor adjustments
    Object.entries(factors).forEach(([key, val]) => {
      const adj = FACTOR_ADJUSTMENTS[key]?.[val]
      if (adj) p += adj[idx]
    })

    // Condition bonus: each active condition adds a small bump
    const toggles = conditionToggles[s.id] || s.conditions.map(() => false)
    const activeCount = toggles.filter(Boolean).length
    p += activeCount * CONDITION_BONUS

    return Math.max(1, p)
  })

  const total = raw.reduce((a, b) => a + b, 0)
  return raw.map(p => Math.round((p / total) * 100))
}

// Simple SVG donut
function DonutChart({ data }) {
  const size = 200
  const cx = size / 2
  const cy = size / 2
  const r = 72
  const innerR = 44

  const total = data.reduce((s, d) => s + d.value, 0)
  let cumAngle = -Math.PI / 2

  const slices = data.map(d => {
    const angle = (d.value / total) * 2 * Math.PI
    const x1 = cx + r * Math.cos(cumAngle)
    const y1 = cy + r * Math.sin(cumAngle)
    cumAngle += angle
    const x2 = cx + r * Math.cos(cumAngle)
    const y2 = cy + r * Math.sin(cumAngle)
    const ix1 = cx + innerR * Math.cos(cumAngle - angle)
    const iy1 = cy + innerR * Math.sin(cumAngle - angle)
    const ix2 = cx + innerR * Math.cos(cumAngle)
    const iy2 = cy + innerR * Math.sin(cumAngle)
    const large = angle > Math.PI ? 1 : 0
    return {
      path: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerR} ${innerR} 0 ${large} 0 ${ix1} ${iy1} Z`,
      color: d.color,
      label: d.label,
      value: d.value,
    }
  })

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {slices.map((s, i) => (
        <path key={i} d={s.path} fill={s.color} opacity={0.9}>
          <title>{s.label}: {s.value}%</title>
        </path>
      ))}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fill="var(--text-secondary)">Total</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="16" fontWeight="bold" fill="var(--text-primary)">100%</text>
    </svg>
  )
}

// Mini bar chart for candidate support
function CandidateBar({ candidates }) {
  const maxSupport = Math.max(...candidates.map(c => c.support || 0), 1)
  return (
    <div className="space-y-1.5">
      {candidates.map((c, i) => (
        <div key={i}>
          <div className="flex justify-between text-[10px] text-text-secondary mb-0.5">
            <span className="font-medium text-text-primary truncate max-w-[60%]">{c.name}</span>
            <span>{c.support != null ? `${c.support}%` : '—'}</span>
          </div>
          {c.support != null && (
            <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(c.support / maxSupport) * 100}%`,
                  backgroundColor: i === 0 ? '#EF4444' : i === 1 ? '#3B82F6' : '#22C55E',
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// Circular probability gauge
function ProbGauge({ probability, color }) {
  const r = 22
  const circ = 2 * Math.PI * r
  const dash = (probability / 100) * circ
  return (
    <div className="flex flex-col items-center">
      <svg width="60" height="60" viewBox="0 0 60 60">
        <circle cx="30" cy="30" r={r} fill="none" stroke="var(--border)" strokeWidth="5" />
        <circle
          cx="30" cy="30" r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 30 30)"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
        <text x="30" y="35" textAnchor="middle" fontSize="12" fontWeight="bold" fill={color}>
          {probability}%
        </text>
      </svg>
      <span className="text-[9px] text-text-secondary mt-0.5">Probabilitas</span>
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

const FACTOR_OPTIONS = {
  ekonomi: [
    { val: 'baik', label: 'Baik (>5%)' },
    { val: 'sedang', label: 'Sedang (3-5%)' },
    { val: 'buruk', label: 'Buruk (<3%)' },
  ],
  prabowo: [
    { val: 'tinggi', label: 'Tinggi' },
    { val: 'sedang', label: 'Sedang' },
    { val: 'rendah', label: 'Rendah' },
  ],
  kim_solidity: [
    { val: 'solid', label: 'Solid' },
    { val: 'retak', label: 'Retak' },
    { val: 'pecah', label: 'Pecah' },
  ],
  oposisi: [
    { val: 'bersatu', label: 'Bersatu' },
    { val: 'terpecah', label: 'Terpecah' },
  ],
}

const FACTOR_LABELS = {
  ekonomi: 'Pertumbuhan Ekonomi',
  prabowo: 'Popularitas Prabowo',
  kim_solidity: 'Koalisi KIM+',
  oposisi: 'Kekuatan Oposisi',
}

const COLOR_BORDER = {
  red: 'border-red-500/40',
  blue: 'border-blue-500/40',
  green: 'border-green-500/40',
  yellow: 'border-yellow-500/40',
}

const COLOR_LEFT = {
  red: 'border-red-500',
  blue: 'border-blue-500',
  green: 'border-green-500',
  yellow: 'border-yellow-500',
}

export default function ScenarioPage() {
  const [factors, setFactors] = useState({
    ekonomi: 'sedang',
    prabowo: 'sedang',
    kim_solidity: 'solid',
    oposisi: 'terpecah',
  })

  const [conditionToggles, setConditionToggles] = useState(() =>
    Object.fromEntries(BASE_SCENARIOS.map(s => [s.id, s.conditions.map(() => false)]))
  )

  const probabilities = useMemo(
    () => computeProbabilities(factors, conditionToggles),
    [factors, conditionToggles]
  )

  const toggleCondition = (scenarioId, idx) => {
    setConditionToggles(prev => ({
      ...prev,
      [scenarioId]: prev[scenarioId].map((v, i) => (i === idx ? !v : v)),
    }))
  }

  const donutData = BASE_SCENARIOS.map((s, i) => ({
    label: s.title.split(':')[0],
    value: probabilities[i],
    color: s.color,
  }))

  return (
    <div className="space-y-10 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">🔮 Skenario Politik 2029</h1>
        <p className="text-text-secondary text-sm mt-1">
          Analisis Skenario Pilpres &amp; Koalisi — Sesuaikan faktor untuk melihat perubahan probabilitas.
        </p>
      </div>

      {/* Section 1 — Scenario Cards */}
      <section>
        <h2 className="text-base font-semibold text-text-primary mb-4">📋 Skenario 2029</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {BASE_SCENARIOS.map((s, idx) => {
            const prob = probabilities[idx]
            const toggles = conditionToggles[s.id]
            return (
              <div
                key={s.id}
                className={`bg-bg-card border rounded-xl p-5 space-y-4 border-l-4 ${COLOR_BORDER[s.colorClass]} ${COLOR_LEFT[s.colorClass]}`}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-bold text-text-primary leading-tight">{s.title}</h3>
                  <ProbGauge probability={prob} color={s.color} />
                </div>

                {/* Conditions Checklist */}
                <div>
                  <p className="text-[10px] text-text-secondary uppercase tracking-wide font-semibold mb-1.5">
                    Kondisi Pendukung
                  </p>
                  <div className="space-y-1">
                    {s.conditions.map((cond, ci) => (
                      <label
                        key={ci}
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => toggleCondition(s.id, ci)}
                      >
                        <span
                          className={`w-4 h-4 rounded flex items-center justify-center text-[10px] border transition-all ${
                            toggles[ci]
                              ? 'border-transparent text-white'
                              : 'border-border text-transparent'
                          }`}
                          style={toggles[ci] ? { backgroundColor: s.color } : {}}
                        >
                          ✓
                        </span>
                        <span
                          className={`text-xs transition-colors ${
                            toggles[ci] ? 'text-text-primary font-medium' : 'text-text-secondary'
                          }`}
                        >
                          {cond}
                        </span>
                      </label>
                    ))}
                  </div>
                  {toggles.some(Boolean) && (
                    <p className="text-[10px] mt-1.5" style={{ color: s.color }}>
                      +{toggles.filter(Boolean).length * CONDITION_BONUS}% dari kondisi aktif
                    </p>
                  )}
                </div>

                {/* Candidate Bars */}
                {s.candidates[0].support != null && (
                  <div>
                    <p className="text-[10px] text-text-secondary uppercase tracking-wide font-semibold mb-1.5">
                      Estimasi Dukungan Kandidat
                    </p>
                    <CandidateBar candidates={s.candidates} />
                  </div>
                )}

                {/* Outcome & Risk */}
                <div className="border-t border-border pt-3 space-y-2">
                  <div>
                    <span className="text-[10px] text-text-secondary uppercase tracking-wide font-semibold">Hasil: </span>
                    <span className="text-xs text-text-primary">{s.outcome}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-[10px] text-text-secondary uppercase tracking-wide font-semibold shrink-0">⚠️ Risiko:</span>
                    <span className="text-xs text-orange-400">{s.risk}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Section 2 — Probability Distribution */}
      <section>
        <h2 className="text-base font-semibold text-text-primary mb-4">🎯 Distribusi Probabilitas</h2>
        <div className="bg-bg-card border border-border rounded-xl p-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <DonutChart data={donutData} />
            <div className="flex-1 space-y-3 w-full">
              {BASE_SCENARIOS.map((s, i) => (
                <div key={s.id} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-primary font-medium">{s.title.split(':')[0]}</span>
                      <span className="font-bold" style={{ color: s.color }}>{probabilities[i]}%</span>
                    </div>
                    <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${probabilities[i]}%`, backgroundColor: s.color }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <p className="text-[10px] text-text-secondary mt-2">
                Total: {probabilities.reduce((a, b) => a + b, 0)}% — disesuaikan otomatis dari faktor &amp; kondisi aktif.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — Faktor Penentu */}
      <section>
        <h2 className="text-base font-semibold text-text-primary mb-4">⚙️ Faktor Penentu</h2>
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <p className="text-xs text-text-secondary mb-5">
            Sesuaikan faktor di bawah untuk melihat bagaimana skenario berubah secara real-time.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {Object.entries(FACTOR_OPTIONS).map(([key, options]) => (
              <div key={key}>
                <p className="text-xs font-semibold text-text-primary mb-2">{FACTOR_LABELS[key]}</p>
                <div className="flex gap-2 flex-wrap">
                  {options.map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setFactors(prev => ({ ...prev, [key]: opt.val }))}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        factors[key] === opt.val
                          ? 'bg-accent-red text-white border-accent-red font-semibold'
                          : 'border-border text-text-secondary hover:border-accent-red/40 hover:text-text-primary'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Factor Impact Summary */}
          <div className="mt-5 pt-4 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-3">
            {BASE_SCENARIOS.map((s, i) => {
              const diff = probabilities[i] - s.baseProbability
              return (
                <div key={s.id} className="text-center">
                  <p className="text-[10px] text-text-secondary">{s.title.split(':')[0]}</p>
                  <p className="text-lg font-bold" style={{ color: s.color }}>{probabilities[i]}%</p>
                  <p className={`text-[10px] font-semibold ${diff > 0 ? 'text-green-400' : diff < 0 ? 'text-red-400' : 'text-text-secondary'}`}>
                    {diff > 0 ? `+${diff}` : diff === 0 ? '—' : diff}% dari baseline
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <div className="text-xs text-text-secondary bg-bg-elevated rounded-lg p-3 border border-border">
        ⚠️ Semua skenario bersifat spekulatif dan analitis. Bukan prediksi resmi. Aturan pilpres 2029 dapat
        berubah berdasarkan keputusan MK dan DPR. Probabilitas adalah estimasi berbasis faktor politik 2024–2025.
      </div>
    </div>
  )
}
