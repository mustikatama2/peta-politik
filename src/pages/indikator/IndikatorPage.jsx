import { useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ComposedChart,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts'
import {
  MACRO_INDICATORS,
  POLITICAL_INDICATORS,
  POLITICAL_RISK,
  ASEAN_BENCHMARK,
} from '../../data/indicators'

// ─── Colour palette ───────────────────────────────────────────────────────────
const C = {
  green: '#22c55e',
  red: '#ef4444',
  yellow: '#eab308',
  blue: '#3b82f6',
  purple: '#a855f7',
  cyan: '#06b6d4',
  orange: '#f97316',
  muted: '#6b7280',
  grid: '#1f2937',
  bg: '#111827',
  card: '#1f2937',
  border: '#374151',
  text: '#f9fafb',
  textMuted: '#9ca3af',
}

// ─── Small helpers ────────────────────────────────────────────────────────────
function delta(current, prev) {
  if (prev === 0 || prev == null) return null
  return ((current - prev) / Math.abs(prev)) * 100
}

function Arrow({ value, inverted = false }) {
  // inverted: for indicators where lower is better (unemployment, poverty, etc.)
  const positive = inverted ? value < 0 : value > 0
  const color = value === 0 ? C.muted : positive ? C.green : C.red
  const arrow = value > 0 ? '▲' : value < 0 ? '▼' : '─'
  return (
    <span style={{ color, fontSize: '0.7em' }}>
      {arrow} {Math.abs(value).toFixed(2)}%
    </span>
  )
}

function RiskBadge({ level }) {
  const map = {
    low:    { label: 'RISIKO RENDAH',    bg: '#14532d', text: C.green, border: '#15803d' },
    medium: { label: 'RISIKO SEDANG',    bg: '#713f12', text: C.yellow, border: '#a16207' },
    high:   { label: 'RISIKO TINGGI',    bg: '#7f1d1d', text: C.red, border: '#991b1b' },
  }
  const s = map[level] || map.medium
  return (
    <span
      style={{
        background: s.bg,
        color: s.text,
        border: `1px solid ${s.border}`,
        borderRadius: 6,
        padding: '3px 10px',
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.05em',
      }}
    >
      {s.label}
    </span>
  )
}

function StatusDot({ score, max = 100 }) {
  const pct = (score / max) * 100
  const color = pct >= 60 ? C.green : pct >= 40 ? C.yellow : C.red
  return (
    <span
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 6px ${color}`,
        marginRight: 6,
      }}
    />
  )
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        background: '#0f172a',
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: '8px 14px',
        fontSize: 12,
        color: C.text,
      }}
    >
      <p style={{ color: C.textMuted, marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || C.text }}>
          {p.name}: <strong>{p.value !== null ? p.value : '—'}</strong>
          {p.unit ? ` ${p.unit}` : ''}
        </p>
      ))}
    </div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, subtitle, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ color: C.text, fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>{title}</h2>
        {subtitle && (
          <p style={{ color: C.textMuted, fontSize: '0.8rem', margin: '4px 0 0' }}>{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: 20,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ─── KPI Ticker strip ─────────────────────────────────────────────────────────
function KpiTicker() {
  const items = [
    {
      label: 'GDP Growth',
      value: `${MACRO_INDICATORS.gdp_growth.current}%`,
      change: MACRO_INDICATORS.gdp_growth.current - MACRO_INDICATORS.gdp_growth.prev_year,
      inverted: false,
      unit: '%',
    },
    {
      label: 'Inflasi',
      value: `${MACRO_INDICATORS.inflation.current}%`,
      change: MACRO_INDICATORS.inflation.current - MACRO_INDICATORS.inflation.prev_year,
      inverted: true,
      unit: '%',
    },
    {
      label: 'Pengangguran',
      value: `${MACRO_INDICATORS.unemployment.current}%`,
      change: MACRO_INDICATORS.unemployment.current - MACRO_INDICATORS.unemployment.prev_year,
      inverted: true,
      unit: '%',
    },
    {
      label: 'Kemiskinan',
      value: `${MACRO_INDICATORS.poverty_rate.current}%`,
      change: MACRO_INDICATORS.poverty_rate.current - MACRO_INDICATORS.poverty_rate.prev_year,
      inverted: true,
      unit: '%',
    },
    {
      label: 'CPI Score',
      value: `${POLITICAL_INDICATORS.corruption_index.current}/100`,
      change: POLITICAL_INDICATORS.corruption_index.current - POLITICAL_INDICATORS.corruption_index.history[4].score,
      inverted: false,
      unit: '',
    },
    {
      label: 'Democracy Index',
      value: `${POLITICAL_INDICATORS.democracy_index.current}/10`,
      change: POLITICAL_INDICATORS.democracy_index.current - POLITICAL_INDICATORS.democracy_index.history[8].score,
      inverted: false,
      unit: '',
    },
    {
      label: 'Cadangan Devisa',
      value: `$${MACRO_INDICATORS.forex_reserves.current}B`,
      change: MACRO_INDICATORS.forex_reserves.current - MACRO_INDICATORS.forex_reserves.prev_year,
      inverted: false,
      unit: 'B',
    },
    {
      label: 'FDI',
      value: `$${MACRO_INDICATORS.fdi.current}B`,
      change: MACRO_INDICATORS.fdi.current - MACRO_INDICATORS.fdi.prev_year,
      inverted: false,
      unit: 'B',
    },
  ]

  return (
    <div
      style={{
        overflowX: 'auto',
        display: 'flex',
        gap: 10,
        paddingBottom: 8,
        marginBottom: 24,
        scrollbarWidth: 'none',
      }}
    >
      {items.map((item, i) => {
        const positive = item.inverted ? item.change < 0 : item.change > 0
        const changeColor = item.change === 0 ? C.muted : positive ? C.green : C.red
        const arrow = item.change > 0 ? '▲' : item.change < 0 ? '▼' : '─'
        return (
          <div
            key={i}
            style={{
              flex: '0 0 auto',
              minWidth: 130,
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: '10px 14px',
              borderTop: `3px solid ${changeColor}`,
            }}
          >
            <p style={{ color: C.textMuted, fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 4px' }}>
              {item.label}
            </p>
            <p style={{ color: C.text, fontWeight: 700, fontSize: '1.1rem', margin: '0 0 2px', fontFamily: 'monospace' }}>
              {item.value}
            </p>
            <p style={{ color: changeColor, fontSize: '0.7rem', margin: 0 }}>
              {arrow} {Math.abs(item.change).toFixed(2)} YoY
            </p>
          </div>
        )
      })}
    </div>
  )
}

// ─── GDP Chart (stacked bar + annual line) ────────────────────────────────────
function GdpChart() {
  const data = MACRO_INDICATORS.gdp_growth.history.map(d => ({
    year: d.year.toString(),
    Q1: d.q1,
    Q2: d.q2,
    Q3: d.q3,
    Q4: d.q4,
    Tahunan: d.annual,
  }))

  return (
    <Card>
      <h3 style={{ color: C.text, fontSize: '0.9rem', fontWeight: 600, marginBottom: 8 }}>
        Pertumbuhan GDP — Kuartalan & Tahunan (% YoY)
      </h3>
      <p style={{ color: C.textMuted, fontSize: '0.72rem', marginBottom: 14 }}>
        Sumber: BPS · ⚠️ 2020 Q2 = puncak kontraksi COVID (-5.32%) · 🔺 2022 Q3 = puncak pemulihan (5.72%)
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} strokeDasharray="3 3" />
          <XAxis dataKey="year" tick={{ fill: C.textMuted, fontSize: 11 }} />
          <YAxis tick={{ fill: C.textMuted, fontSize: 11 }} unit="%" domain={[-6, 8]} />
          <Tooltip content={<DarkTooltip />} />
          <Legend
            wrapperStyle={{ color: C.textMuted, fontSize: 11 }}
          />
          <ReferenceLine y={0} stroke={C.muted} strokeDasharray="4 4" />
          <Bar dataKey="Q1" stackId="a" fill="#1d4ed8" radius={[0, 0, 0, 0]} name="Q1" />
          <Bar dataKey="Q2" stackId="a" fill="#2563eb" name="Q2" />
          <Bar dataKey="Q3" stackId="a" fill="#3b82f6" name="Q3" />
          <Bar dataKey="Q4" stackId="a" fill="#60a5fa" radius={[3, 3, 0, 0]} name="Q4" />
          <Line
            type="monotone"
            dataKey="Tahunan"
            stroke={C.yellow}
            strokeWidth={2.5}
            dot={{ r: 4, fill: C.yellow, strokeWidth: 0 }}
            name="Tahunan"
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
        <span style={{ color: C.red, fontSize: '0.72rem' }}>⚠️ COVID crash: 2020 Q2 (-5.32%)</span>
        <span style={{ color: C.green, fontSize: '0.72rem' }}>🔺 Recovery peak: 2022 Q3 (5.72%)</span>
      </div>
    </Card>
  )
}

// ─── Inflation Chart ──────────────────────────────────────────────────────────
function InflationChart() {
  const data = MACRO_INDICATORS.inflation.history.map(d => ({
    year: d.year.toString(),
    Inflasi: d.annual,
  }))
  return (
    <Card>
      <h3 style={{ color: C.text, fontSize: '0.9rem', fontWeight: 600, marginBottom: 8 }}>
        Inflasi Tahunan (%)
      </h3>
      <p style={{ color: C.textMuted, fontSize: '0.72rem', marginBottom: 14 }}>Sumber: BPS · Inflasi mencapai puncak 5.51% di 2022 akibat krisis energi global</p>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} strokeDasharray="3 3" />
          <XAxis dataKey="year" tick={{ fill: C.textMuted, fontSize: 11 }} />
          <YAxis tick={{ fill: C.textMuted, fontSize: 11 }} unit="%" />
          <Tooltip content={<DarkTooltip />} />
          <ReferenceLine y={3} stroke={C.yellow} strokeDasharray="4 4" label={{ value: 'Target BI 3%', fill: C.yellow, fontSize: 10 }} />
          <Line type="monotone" dataKey="Inflasi" stroke={C.orange} strokeWidth={2.5} dot={{ r: 4, fill: C.orange, strokeWidth: 0 }} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}

// ─── Trade & FDI Charts ───────────────────────────────────────────────────────
function TradeChart() {
  const data = MACRO_INDICATORS.exports.history.map((d, i) => ({
    year: d.year.toString(),
    Ekspor: d.annual,
    'FDI': MACRO_INDICATORS.fdi.history[i]?.annual ?? 0,
    'Cadangan Devisa': MACRO_INDICATORS.forex_reserves.history[i]?.annual ?? 0,
  }))
  return (
    <Card>
      <h3 style={{ color: C.text, fontSize: '0.9rem', fontWeight: 600, marginBottom: 8 }}>
        Perdagangan & FDI (USD Miliar)
      </h3>
      <p style={{ color: C.textMuted, fontSize: '0.72rem', marginBottom: 14 }}>Sumber: BPS, Bank Indonesia, BKPM</p>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} strokeDasharray="3 3" />
          <XAxis dataKey="year" tick={{ fill: C.textMuted, fontSize: 11 }} />
          <YAxis tick={{ fill: C.textMuted, fontSize: 11 }} />
          <Tooltip content={<DarkTooltip />} />
          <Legend wrapperStyle={{ color: C.textMuted, fontSize: 11 }} />
          <Line type="monotone" dataKey="Ekspor" stroke={C.cyan} strokeWidth={2} dot={{ r: 3, fill: C.cyan, strokeWidth: 0 }} />
          <Line type="monotone" dataKey="FDI" stroke={C.purple} strokeWidth={2} dot={{ r: 3, fill: C.purple, strokeWidth: 0 }} />
          <Line type="monotone" dataKey="Cadangan Devisa" stroke={C.green} strokeWidth={2} dot={{ r: 3, fill: C.green, strokeWidth: 0 }} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}

function FdiChart() {
  const data = MACRO_INDICATORS.fdi.history.map(d => ({
    year: d.year.toString(),
    FDI: d.annual,
  }))
  return (
    <Card>
      <h3 style={{ color: C.text, fontSize: '0.9rem', fontWeight: 600, marginBottom: 8 }}>
        Investasi Langsung Asing / FDI (USD Miliar)
      </h3>
      <p style={{ color: C.textMuted, fontSize: '0.72rem', marginBottom: 14 }}>Sumber: BKPM / Kemenves</p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} strokeDasharray="3 3" />
          <XAxis dataKey="year" tick={{ fill: C.textMuted, fontSize: 11 }} />
          <YAxis tick={{ fill: C.textMuted, fontSize: 11 }} />
          <Tooltip content={<DarkTooltip />} />
          <Bar dataKey="FDI" name="FDI" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.year === '2020' ? C.red : C.purple} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

// ─── Political Indicator Card ─────────────────────────────────────────────────
function PolIndicatorCard({ indicator, dataKey }) {
  const ind = POLITICAL_INDICATORS[dataKey]
  const hist = ind.history.slice(-5)
  const scoreKey = hist[0]?.score !== undefined ? 'score' : 'rank'
  const sparkData = hist.map(h => ({ year: h.year, val: h[scoreKey] }))
  const latestScore = ind.current ?? ind.rank
  const max = ind.max || 100
  const pct = ind.higher_is_better !== false
    ? Math.min((latestScore / max) * 100, 100)
    : Math.max(100 - ((latestScore / 200) * 100), 10)
  const statusColor = pct >= 60 ? C.green : pct >= 40 ? C.yellow : C.red

  return (
    <Card style={{ flex: '1 1 200px', minWidth: 200 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
        <p style={{ color: C.textMuted, fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
          {ind.label}
        </p>
        <StatusDot score={pct} max={100} />
      </div>

      <div style={{ marginBottom: 8 }}>
        <span style={{ color: statusColor, fontSize: '1.6rem', fontWeight: 800, fontFamily: 'monospace' }}>
          {latestScore}
        </span>
        {ind.rank && ind.rank !== ind.current && (
          <span style={{ color: C.textMuted, fontSize: '0.75rem', marginLeft: 6 }}>
            Rank #{ind.rank}
          </span>
        )}
        {ind.category && (
          <p style={{ color: C.yellow, fontSize: '0.68rem', margin: '2px 0 0' }}>{ind.category}</p>
        )}
      </div>

      {/* Mini sparkline */}
      <ResponsiveContainer width="100%" height={50}>
        <LineChart data={sparkData} margin={{ top: 2, right: 4, left: -30, bottom: 0 }}>
          <Line
            type="monotone"
            dataKey="val"
            stroke={statusColor}
            strokeWidth={2}
            dot={false}
          />
          <YAxis domain={['auto', 'auto']} hide />
          <XAxis dataKey="year" hide />
        </LineChart>
      </ResponsiveContainer>
      <p style={{ color: C.textMuted, fontSize: '0.65rem', marginTop: 4 }}>5-tahun terakhir · {ind.source}</p>
    </Card>
  )
}

// ─── ASEAN Comparison Bar Chart ───────────────────────────────────────────────
function AseanCpiChart() {
  const data = [...ASEAN_BENCHMARK.cpi].sort((a, b) => b.score - a.score)
  return (
    <Card>
      <h3 style={{ color: C.text, fontSize: '0.9rem', fontWeight: 600, marginBottom: 4 }}>
        Perbandingan CPI ASEAN (Transparency International 2024)
      </h3>
      <p style={{ color: C.textMuted, fontSize: '0.72rem', marginBottom: 14 }}>Skor lebih tinggi = korupsi lebih rendah (skala 0–100)</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 20, left: 60, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={{ fill: C.textMuted, fontSize: 11 }} />
          <YAxis
            dataKey="country"
            type="category"
            tick={({ x, y, payload }) => {
              const item = data.find(d => d.country === payload.value)
              return (
                <text x={x - 4} y={y + 4} textAnchor="end" fill={item?.highlight ? C.yellow : C.textMuted} fontSize={11} fontWeight={item?.highlight ? 700 : 400}>
                  {item?.flag} {payload.value}
                </text>
              )
            }}
          />
          <Tooltip content={<DarkTooltip />} />
          <ReferenceLine x={50} stroke={C.muted} strokeDasharray="4 4" label={{ value: '50', fill: C.muted, fontSize: 10 }} />
          <Bar dataKey="score" name="CPI Score" radius={[0, 4, 4, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.highlight ? C.yellow : entry.score >= 50 ? C.green : C.red} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

function AseanDemocracyChart() {
  const data = [...ASEAN_BENCHMARK.democracy].sort((a, b) => b.score - a.score)
  return (
    <Card>
      <h3 style={{ color: C.text, fontSize: '0.9rem', fontWeight: 600, marginBottom: 4 }}>
        Perbandingan Indeks Demokrasi ASEAN (EIU 2024)
      </h3>
      <p style={{ color: C.textMuted, fontSize: '0.72rem', marginBottom: 14 }}>Skor 0–10 · &gt;8 = Full Democracy · 6–8 = Flawed · 4–6 = Hybrid</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 20, left: 60, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 10]} tick={{ fill: C.textMuted, fontSize: 11 }} />
          <YAxis
            dataKey="country"
            type="category"
            tick={({ x, y, payload }) => {
              const item = data.find(d => d.country === payload.value)
              return (
                <text x={x - 4} y={y + 4} textAnchor="end" fill={item?.highlight ? C.yellow : C.textMuted} fontSize={11} fontWeight={item?.highlight ? 700 : 400}>
                  {item?.flag} {payload.value}
                </text>
              )
            }}
          />
          <Tooltip content={<DarkTooltip />} />
          <ReferenceLine x={6} stroke={C.muted} strokeDasharray="4 4" />
          <Bar dataKey="score" name="Democracy Score" radius={[0, 4, 4, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.highlight ? C.yellow : entry.score >= 7 ? C.green : entry.score >= 5 ? C.blue : C.red} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

// ─── Risk Radar Chart ─────────────────────────────────────────────────────────
function RiskRadarChart() {
  const data = POLITICAL_RISK.factors.map(f => ({
    subject: f.factor,
    score: f.score,
    fullMark: 100,
  }))

  const trendIcon = t => (t === 'improving' ? '↑' : t === 'declining' ? '↓' : '→')
  const trendColor = t =>
    t === 'improving' ? C.green : t === 'declining' ? C.red : C.yellow

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <h3 style={{ color: C.text, fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>
          Faktor Risiko Politik — Radar 5 Dimensi
        </h3>
        <RiskBadge level={POLITICAL_RISK.overall_risk} />
      </div>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <ResponsiveContainer width={300} height={260} style={{ flex: '0 0 300px' }}>
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke={C.border} />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: C.textMuted, fontSize: 10 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: C.textMuted, fontSize: 9 }}
            />
            <Radar
              name="Skor"
              dataKey="score"
              stroke={C.yellow}
              fill={C.yellow}
              fillOpacity={0.2}
              strokeWidth={2}
              dot={{ r: 4, fill: C.yellow, strokeWidth: 0 }}
            />
          </RadarChart>
        </ResponsiveContainer>

        <div style={{ flex: 1, minWidth: 200 }}>
          {POLITICAL_RISK.factors.map((f, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: C.text, fontSize: '0.8rem', fontWeight: 600 }}>{f.factor}</span>
                <span style={{ color: trendColor(f.trend), fontSize: '0.75rem', fontWeight: 700 }}>
                  {f.score} {trendIcon(f.trend)}
                </span>
              </div>
              <div style={{ height: 4, background: C.grid, borderRadius: 2, overflow: 'hidden', marginBottom: 4 }}>
                <div
                  style={{
                    height: '100%',
                    width: `${f.score}%`,
                    background: f.score >= 60 ? C.green : f.score >= 40 ? C.yellow : C.red,
                    borderRadius: 2,
                    transition: 'width 0.6s ease',
                  }}
                />
              </div>
              <p style={{ color: C.textMuted, fontSize: '0.68rem', margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

// ─── Analysis Summary ─────────────────────────────────────────────────────────
function AnalysisSummary() {
  const points = [
    {
      icon: '📈',
      title: 'Pertumbuhan Ekonomi Stabil Namun Rentan',
      text: 'Pertumbuhan GDP Indonesia konsisten di kisaran 5% pasca-pandemi (5.03% di 2024), menunjukkan ketahanan ekonomi domestik. Namun, ketergantungan pada komoditas dan konsumsi rumah tangga membuat pertumbuhan rentan terhadap gejolak harga global.',
    },
    {
      icon: '⚠️',
      title: 'Korupsi: Regres Nyata Sejak 2019',
      text: 'Skor CPI merosot dari 40 (2019) ke 34 (2024), mendorong Indonesia turun dari peringkat 85 ke 115 dunia. Pelemahan KPK pasca-revisi UU 2019 disebut sebagai faktor utama. Indonesia kini setara dengan Filipina, jauh di bawah Malaysia (50) dan Vietnam (40).',
    },
    {
      icon: '📉',
      title: 'Demokrasi di Persimpangan',
      text: 'Setelah sempat mencapai 7.03 di 2015, Indeks Demokrasi EIU turun ke 6.53 (2024). Kategori "Flawed Democracy" mencerminkan tekanan terhadap kebebasan sipil, penggunaan UU ITE, dan melemahnya oposisi pasca-koalisi gemuk pemerintah.',
    },
    {
      icon: '💼',
      title: 'Investasi Melonjak, Distribusi Masih Timpang',
      text: 'FDI tumbuh dari $28B (2019) ke $47B (2024), didorong hilirisasi nikel dan digitalisasi. Namun Koefisien Gini masih 0.38, dan tingkat kemiskinan 8.57% menunjukkan pertumbuhan belum merata ke seluruh lapisan masyarakat.',
    },
    {
      icon: '🔮',
      title: 'Risiko Jangka Menengah',
      text: 'Koalisi gemuk Kabinet Merah Putih mengurangi check and balance. Penyempitan ruang sipil, tekanan pada jurnalis, dan reorientasi kebijakan fiskal (efisiensi APBN 2025 senilai Rp306T) berpotensi menghambat pertumbuhan inklusif dan kepercayaan investor jangka panjang.',
    },
  ]

  return (
    <Card>
      <h3 style={{ color: C.text, fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>
        🔍 Ringkasan Analisis
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {points.map((p, i) => (
          <div
            key={i}
            style={{
              borderLeft: `3px solid ${C.yellow}`,
              paddingLeft: 14,
            }}
          >
            <p style={{ color: C.text, fontWeight: 600, fontSize: '0.85rem', margin: '0 0 4px' }}>
              {p.icon} {p.title}
            </p>
            <p style={{ color: C.textMuted, fontSize: '0.8rem', lineHeight: 1.6, margin: 0 }}>{p.text}</p>
          </div>
        ))}
      </div>
      <p style={{ color: C.textMuted, fontSize: '0.65rem', marginTop: 20, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
        Analisis disusun berdasarkan data publik: BPS, Bank Indonesia, Transparency International (TI), EIU Democracy Index, RSF Press Freedom Index, UNDP HDR. Diperbarui: Maret 2026.
      </p>
    </Card>
  )
}

// ─── Ekonomi Tab ──────────────────────────────────────────────────────────────
const EKONOMI_TABS = [
  { key: 'gdp', label: 'Pertumbuhan GDP' },
  { key: 'inflasi', label: 'Inflasi' },
  { key: 'perdagangan', label: 'Perdagangan & Devisa' },
  { key: 'fdi', label: 'FDI' },
]

function EkonomiSection() {
  const [tab, setTab] = useState('gdp')

  return (
    <Section title="📈 Sektor Ekonomi" subtitle="Data kuartalan & tahunan 2019–2024">
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {EKONOMI_TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: `1px solid ${tab === t.key ? C.blue : C.border}`,
              background: tab === t.key ? '#1e3a5f' : C.card,
              color: tab === t.key ? C.text : C.textMuted,
              fontSize: '0.78rem',
              fontWeight: tab === t.key ? 700 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'gdp' && <GdpChart />}
      {tab === 'inflasi' && <InflationChart />}
      {tab === 'perdagangan' && <TradeChart />}
      {tab === 'fdi' && <FdiChart />}
    </Section>
  )
}

// ─── Politik Tab ──────────────────────────────────────────────────────────────
const POLITIK_TABS = [
  { key: 'cards', label: 'Kartu Indikator' },
  { key: 'asean_cpi', label: 'ASEAN — CPI' },
  { key: 'asean_dem', label: 'ASEAN — Demokrasi' },
]

function PolitikSection() {
  const [tab, setTab] = useState('cards')

  return (
    <Section title="🏛️ Politik & Tata Kelola" subtitle="Indeks internasional · EIU, TI, RSF, UNDP">
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {POLITIK_TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: `1px solid ${tab === t.key ? C.purple : C.border}`,
              background: tab === t.key ? '#2e1065' : C.card,
              color: tab === t.key ? C.text : C.textMuted,
              fontSize: '0.78rem',
              fontWeight: tab === t.key ? 700 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'cards' && (
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {Object.keys(POLITICAL_INDICATORS).map(k => (
            <PolIndicatorCard key={k} dataKey={k} />
          ))}
        </div>
      )}
      {tab === 'asean_cpi' && <AseanCpiChart />}
      {tab === 'asean_dem' && <AseanDemocracyChart />}
    </Section>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function IndikatorPage() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      {/* ── Header ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: '20px 24px',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ color: C.text, fontWeight: 800, fontSize: '1.4rem', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
              📊 Indikator Makro &amp; Politik Indonesia
            </h1>
            <p style={{ color: C.textMuted, fontSize: '0.78rem', margin: 0 }}>
              Dashboard intelijen ekonomi-politik · Diperbarui Maret 2026
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              { label: 'BPS', url: 'https://bps.go.id' },
              { label: 'Bank Indonesia', url: 'https://bi.go.id' },
              { label: 'TI CPI', url: 'https://transparency.org' },
              { label: 'EIU', url: 'https://eiu.com' },
              { label: 'UNDP HDR', url: 'https://hdr.undp.org' },
            ].map(s => (
              <span
                key={s.label}
                style={{
                  background: '#1e293b',
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  padding: '3px 8px',
                  fontSize: '0.65rem',
                  color: C.textMuted,
                }}
              >
                {s.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── KPI Ticker ── */}
      <KpiTicker />

      {/* ── Ekonomi Section ── */}
      <EkonomiSection />

      {/* ── Politik Section ── */}
      <PolitikSection />

      {/* ── Risk Radar ── */}
      <Section
        title="🚨 Faktor Risiko Politik"
        subtitle="Penilaian multidimensi berdasarkan indeks internasional & analisis kontekstual"
      >
        <RiskRadarChart />
      </Section>

      {/* ── Analysis Summary ── */}
      <Section title="📝 Ringkasan Analisis">
        <AnalysisSummary />
      </Section>

      {/* ── Footer note ── */}
      <p style={{ color: C.textMuted, fontSize: '0.68rem', textAlign: 'center', marginTop: 8, marginBottom: 24 }}>
        PetaPolitik · Data bersumber dari lembaga independen internasional dan nasional. Tidak merepresentasikan pandangan resmi pemerintah.
      </p>
    </div>
  )
}
