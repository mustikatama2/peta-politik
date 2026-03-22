import { useState, useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer,
} from 'recharts'
import {
  APBN_2025,
  APBN_2026,
  DEPARTEMEN,
  DEPARTEMEN_2026,
  TREN_BULANAN,
  SUMBER_PENDAPATAN,
  UTANG_NEGARA,
  KONTEKS_POLITIK,
  PERBANDINGAN_TAHUNAN,
  PERUBAHAN_KUNCI_2026,
} from '../../data/apbn'
import PartyBadge from '../../components/PartyBadge'

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmt(val) {
  if (val === null || val === undefined) return '—'
  return `Rp ${val.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} T`
}

function pct(part, total) {
  if (part === null || total === null) return null
  return ((part / total) * 100).toFixed(1)
}

// ── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ icon, label, value, sub, badge, badgeColor = 'text-yellow-400' }) {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-secondary font-medium uppercase tracking-wide">{label}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-text-primary leading-tight">{value}</div>
      {sub && <div className="text-xs text-text-secondary">{sub}</div>}
      {badge && (
        <div className={`text-xs font-semibold ${badgeColor}`}>{badge}</div>
      )}
    </div>
  )
}

// ── Progress Bar ──────────────────────────────────────────────────────────────

function ProgressBar({ persen }) {
  const color =
    persen === null
      ? 'bg-gray-600'
      : persen < 15
      ? 'bg-red-500'
      : persen < 25
      ? 'bg-yellow-500'
      : 'bg-green-500'
  return (
    <div className="w-full bg-bg-elevated rounded-full h-2 overflow-hidden">
      <div
        className={`h-2 rounded-full transition-all ${color}`}
        style={{ width: `${persen !== null ? Math.min(persen, 100) : 0}%` }}
      />
    </div>
  )
}

// ── Absorption Badge ──────────────────────────────────────────────────────────

function AbsorptionBadge({ persen }) {
  if (persen === null)
    return (
      <span className="text-xs font-bold text-gray-400 bg-gray-800/50 border border-gray-700 rounded px-1.5 py-0.5">
        Proyeksi
      </span>
    )
  if (persen < 15)
    return (
      <span className="text-xs font-bold text-red-400 bg-red-900/30 border border-red-800 rounded px-1.5 py-0.5">
        {persen}% ⚠️
      </span>
    )
  if (persen < 25)
    return (
      <span className="text-xs font-bold text-yellow-400 bg-yellow-900/30 border border-yellow-800 rounded px-1.5 py-0.5">
        {persen}%
      </span>
    )
  return (
    <span className="text-xs font-bold text-green-400 bg-green-900/30 border border-green-800 rounded px-1.5 py-0.5">
      {persen}% ✓
    </span>
  )
}

// ── Custom Tooltip ────────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-bg-card border border-border rounded-lg p-3 text-xs shadow-lg">
      <p className="font-semibold text-text-primary mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: Rp {p.value?.toFixed(1)} T
        </p>
      ))}
    </div>
  )
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-bg-card border border-border rounded-lg p-3 text-xs shadow-lg">
      <p className="font-semibold text-text-primary">{d.name}</p>
      <p style={{ color: d.payload.warna }}>
        Rp {d.payload.nilai?.toFixed(1)} T ({d.payload.persen}%)
      </p>
    </div>
  )
}

function CompareTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-bg-card border border-border rounded-lg p-3 text-xs shadow-lg">
      <p className="font-semibold text-text-primary mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: Rp {p.value?.toFixed(1)} T
        </p>
      ))}
    </div>
  )
}

// ── Year Selector Tabs ────────────────────────────────────────────────────────

function YearTabs({ selected, onChange }) {
  const tabs = [
    { year: 2025, label: '2025 (Aktual)' },
    { year: 2026, label: '2026 (Proyeksi)' },
  ]
  return (
    <div className="flex gap-1 bg-bg-elevated border border-border rounded-lg p-1 w-fit">
      {tabs.map((t) => (
        <button
          key={t.year}
          onClick={() => onChange(t.year)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
            selected === t.year
              ? 'bg-bg-card text-text-primary shadow-sm border border-border'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function APBNPage() {
  const [selectedYear, setSelectedYear] = useState(2025)
  const [sortDir, setSortDir] = useState('asc')
  const [activeIndex, setActiveIndex] = useState(null)

  const apbn = selectedYear === 2026 ? APBN_2026 : APBN_2025
  const deptData = selectedYear === 2026 ? DEPARTEMEN_2026 : DEPARTEMEN
  const is2026 = selectedYear === 2026

  const sortedDept = useMemo(() => {
    return [...deptData].sort((a, b) => {
      const aVal = a.persen ?? (sortDir === 'asc' ? -1 : 101)
      const bVal = b.persen ?? (sortDir === 'asc' ? -1 : 101)
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal
    })
  }, [deptData, sortDir])

  const toggleSort = () => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))

  const pendapatanPct = pct(apbn.pendapatan_realisasi, apbn.pendapatan_target)
  const belanjaPct = pct(apbn.belanja_realisasi, apbn.belanja_target)

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">💰</span>
            <h1 className="text-2xl font-bold text-text-primary">APBN Tracker — Realisasi &amp; Proyeksi</h1>
          </div>
          <p className="text-text-secondary text-sm">
            Anggaran Pendapatan dan Belanja Negara · Multi-tahun 2023–2026 · {apbn.sumber_data}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-secondary bg-bg-card border border-border rounded-lg px-3 py-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          {is2026 ? 'Data proyeksi RAPBN 2026' : 'Data per Q1 2025 · Update berkala'}
        </div>
      </div>

      {/* ── Year Selector ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <YearTabs selected={selectedYear} onChange={setSelectedYear} />
        <span className="text-xs text-text-secondary">
          Pilih tahun untuk melihat data APBN yang berbeda
        </span>
      </div>

      {/* ── Proyeksi Banner ── */}
      {is2026 && (
        <div className="bg-amber-900/20 border border-amber-700/50 rounded-xl px-4 py-3 flex items-start gap-3">
          <span className="text-xl flex-shrink-0">⚠️</span>
          <div>
            <p className="text-amber-300 font-semibold text-sm">Data Proyeksi — RAPBN 2026 Belum Final</p>
            <p className="text-amber-200/70 text-xs mt-0.5">{apbn.catatan}</p>
          </div>
        </div>
      )}

      {/* ── Section 1: KPI Cards ── */}
      <section>
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
          📊 Ringkasan APBN {selectedYear}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            icon="📥"
            label="Total Pendapatan"
            value={is2026 ? fmt(apbn.pendapatan_target) : fmt(apbn.pendapatan_realisasi)}
            sub={is2026 ? `Target: ${fmt(apbn.pendapatan_target)}` : `Target: ${fmt(apbn.pendapatan_target)}`}
            badge={is2026 ? 'Belum tersedia (proyeksi)' : `${pendapatanPct}% terpenuhi (Q1)`}
            badgeColor={is2026 ? 'text-amber-400' : (parseFloat(pendapatanPct) < 20 ? 'text-yellow-400' : 'text-green-400')}
          />
          <KpiCard
            icon="📤"
            label="Total Belanja"
            value={is2026 ? fmt(apbn.belanja_target) : fmt(apbn.belanja_realisasi)}
            sub={`Pagu: ${fmt(apbn.belanja_target)}`}
            badge={is2026 ? 'Belum tersedia (proyeksi)' : `${belanjaPct}% terserap (Q1)`}
            badgeColor={is2026 ? 'text-amber-400' : (parseFloat(belanjaPct) < 20 ? 'text-yellow-400' : 'text-green-400')}
          />
          <KpiCard
            icon="📉"
            label="Defisit Anggaran"
            value={is2026
              ? fmt(Math.abs(apbn.defisit_target))
              : fmt(Math.abs(apbn.defisit_realisasi))
            }
            sub={`Target defisit: ${fmt(Math.abs(apbn.defisit_target))}`}
            badge={is2026
              ? 'Proyeksi — belum ada realisasi'
              : `Aktual Q1: ${pct(Math.abs(apbn.defisit_realisasi), Math.abs(apbn.defisit_target))}% dari target`
            }
            badgeColor={is2026 ? 'text-amber-400' : 'text-orange-400'}
          />
          <KpiCard
            icon="🏦"
            label="Rasio Utang/PDB"
            value={`${UTANG_NEGARA.rasio_pdb}%`}
            sub={`Total utang: ${fmt(UTANG_NEGARA.total)}`}
            badge="Batas aman UU: 60% PDB ✓"
            badgeColor="text-green-400"
          />
        </div>
      </section>

      {/* ── Section 2: Tren Bulanan (2025 only) ── */}
      {!is2026 && (
        <section>
          <div className="bg-bg-card border border-border rounded-xl p-5">
            <h2 className="text-base font-semibold text-text-primary mb-1">📈 Tren Realisasi Bulanan 2025</h2>
            <p className="text-xs text-text-secondary mb-4">
              Jan–Mar aktual · Apr–Des proyeksi · dalam Triliun Rp
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={TREN_BULANAN} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0d" />
                <XAxis dataKey="bulan" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} unit="T" />
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  formatter={(val) => (
                    <span style={{ color: '#94a3b8', fontSize: 12 }}>
                      {val === 'pendapatan' ? 'Pendapatan' : 'Belanja'}
                    </span>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="pendapatan"
                  name="pendapatan"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="belanja"
                  name="belanja"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-xs text-text-secondary mt-2 text-center">
              ⚠️ Garis Apr–Des adalah proyeksi, bukan data aktual
            </p>
          </div>
        </section>
      )}

      {/* ── Section 3: Departemen Table ── */}
      <section>
        <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-text-primary">
                🏛️ {is2026 ? 'Pagu Anggaran per Kementerian 2026' : 'Serapan Anggaran per Kementerian'}
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                {is2026 ? 'Proyeksi RAPBN 2026 · dalam Triliun Rp' : 'Q1 2025 · dalam Triliun Rp'}
              </p>
            </div>
            {!is2026 && (
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> &lt;15% kritis</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> 15–25% normal</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> &gt;25% baik</span>
              </div>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-elevated">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Kementerian</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Pagu (T)</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">
                    {is2026 ? 'Realisasi' : 'Realisasi (T)'}
                  </th>
                  <th
                    className="text-center px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide cursor-pointer hover:text-text-primary transition-colors select-none"
                    onClick={!is2026 ? toggleSort : undefined}
                  >
                    % Serapan {!is2026 && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide hidden md:table-cell">Progress</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide hidden lg:table-cell">Menteri</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide hidden lg:table-cell">Partai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedDept.map((dept) => (
                  <tr key={dept.id} className="hover:bg-bg-elevated transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-text-primary">{dept.nama}</div>
                      {dept.catatan && (
                        <div className="text-xs text-amber-400/80 mt-0.5">{dept.catatan}</div>
                      )}
                      {!is2026 && dept.prioritas && (
                        <div className="text-xs text-text-secondary mt-0.5 hidden sm:block">
                          {dept.prioritas.slice(0, 2).join(' · ')}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-text-primary">
                      {dept.pagu.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-text-secondary">
                      {dept.realisasi !== null ? dept.realisasi.toFixed(1) : '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <AbsorptionBadge persen={dept.persen} />
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell min-w-[120px]">
                      <ProgressBar persen={dept.persen} />
                    </td>
                    <td className="px-4 py-3 text-xs text-text-secondary hidden lg:table-cell">
                      {dept.menteri}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <PartyBadge partyId={dept.partai} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-bg-elevated text-xs text-text-secondary text-center border-t border-border">
            {is2026
              ? 'Data proyeksi — realisasi belum tersedia untuk APBN 2026'
              : 'Klik header "% Serapan" untuk mengubah urutan'
            }
          </div>
        </div>
      </section>

      {/* ── Section: Perbandingan Tahunan ── */}
      <section>
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
          📊 Perbandingan Tahunan 2023–2026
        </h2>

        {/* Grouped Bar Chart: Pendapatan vs Belanja */}
        <div className="bg-bg-card border border-border rounded-xl p-5 mb-4">
          <h3 className="text-base font-semibold text-text-primary mb-1">Pendapatan vs Belanja (Triliun Rp)</h3>
          <p className="text-xs text-text-secondary mb-4">
            2026 = proyeksi · Sumber: Kemenkeu RI
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={PERBANDINGAN_TAHUNAN}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0d" />
              <XAxis
                dataKey="tahun"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => {
                  const row = PERBANDINGAN_TAHUNAN.find(r => r.tahun === v)
                  return row?.proyeksi ? `${v}*` : `${v}`
                }}
              />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} unit="T" domain={[2500, 4000]} />
              <Tooltip content={<CompareTooltip />} />
              <Legend
                formatter={(val) => (
                  <span style={{ color: '#94a3b8', fontSize: 12 }}>
                    {val === 'pendapatan' ? 'Pendapatan' : 'Belanja'}
                  </span>
                )}
              />
              <Bar dataKey="pendapatan" name="pendapatan" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={32} />
              <Bar dataKey="belanja" name="belanja" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-text-secondary mt-1 text-center">* 2026 adalah proyeksi RAPBN</p>
        </div>

        {/* Defisit Trend Line Chart */}
        <div className="bg-bg-card border border-border rounded-xl p-5 mb-4">
          <h3 className="text-base font-semibold text-text-primary mb-1">📉 Tren Defisit Anggaran (Triliun Rp)</h3>
          <p className="text-xs text-text-secondary mb-4">Nilai defisit absolut per tahun</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={PERBANDINGAN_TAHUNAN.map(d => ({ ...d, defisit_abs: Math.abs(d.defisit) }))}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0d" />
              <XAxis dataKey="tahun" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} unit="T" />
              <Tooltip
                formatter={(val) => [`Rp ${val.toFixed(1)} T`, 'Defisit']}
                contentStyle={{ background: 'var(--bg-card,#1e293b)', border: '1px solid var(--border,#334155)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Line
                type="monotone"
                dataKey="defisit_abs"
                name="Defisit"
                stroke="#f97316"
                strokeWidth={2.5}
                dot={(props) => {
                  const row = PERBANDINGAN_TAHUNAN[props.index]
                  return (
                    <circle
                      key={props.index}
                      cx={props.cx}
                      cy={props.cy}
                      r={5}
                      fill={row?.proyeksi ? 'transparent' : '#f97316'}
                      stroke="#f97316"
                      strokeWidth={2}
                      strokeDasharray={row?.proyeksi ? '4 2' : '0'}
                    />
                  )
                }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Comparison Table */}
        <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-5 border-b border-border">
            <h3 className="text-base font-semibold text-text-primary">Tabel Perbandingan Lengkap</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-elevated">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Tahun</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Pendapatan (T)</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Belanja (T)</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Defisit (T)</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide hidden sm:table-cell">PDB Growth</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide hidden sm:table-cell">Inflasi</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {PERBANDINGAN_TAHUNAN.map((row) => (
                  <tr
                    key={row.tahun}
                    className={`hover:bg-bg-elevated transition-colors ${row.proyeksi ? 'border-l-2 border-amber-600/50' : ''}`}
                  >
                    <td className="px-4 py-3 font-semibold text-text-primary">
                      {row.tahun}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-green-400">
                      {row.pendapatan.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-red-400">
                      {row.belanja.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-orange-400">
                      {row.defisit.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-text-secondary hidden sm:table-cell">
                      {row.gdp_growth !== null ? `${row.gdp_growth}%` : '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-text-secondary hidden sm:table-cell">
                      {row.inflasi !== null ? `${row.inflasi}%` : '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {row.proyeksi ? (
                        <span className="text-xs font-bold text-amber-400 bg-amber-900/30 border border-amber-700/50 rounded px-1.5 py-0.5">
                          Proyeksi
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-green-400 bg-green-900/30 border border-green-800 rounded px-1.5 py-0.5">
                          Realisasi
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-bg-elevated text-xs text-text-secondary text-center border-t border-border">
            * Proyeksi berdasarkan RAPBN 2026 dan kebijakan fiskal 2025–2026
          </div>
        </div>
      </section>

      {/* ── Section: Perubahan Kunci 2025 → 2026 ── */}
      <section>
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
          🔄 Perubahan Kunci 2025 → 2026
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PERUBAHAN_KUNCI_2026.map((item) => {
            const colorMap = {
              red:    { bg: 'bg-red-900/20',    border: 'border-red-800/40',    tag: 'bg-red-900/40 text-red-300',    val: 'text-red-400'    },
              green:  { bg: 'bg-green-900/20',  border: 'border-green-800/40',  tag: 'bg-green-900/40 text-green-300',  val: 'text-green-400'  },
              blue:   { bg: 'bg-blue-900/20',   border: 'border-blue-800/40',   tag: 'bg-blue-900/40 text-blue-300',   val: 'text-blue-400'   },
              orange: { bg: 'bg-orange-900/20', border: 'border-orange-800/40', tag: 'bg-orange-900/40 text-orange-300', val: 'text-orange-400' },
            }
            const c = colorMap[item.warna] || colorMap.blue
            return (
              <div key={item.id} className={`rounded-xl p-4 border ${c.bg} ${c.border} flex flex-col gap-3`}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{item.ikon}</span>
                  <span className="text-sm font-semibold text-text-primary leading-tight">{item.program}</span>
                </div>
                <div>
                  {item.nilai_2025 !== null && item.nilai_2026 !== null ? (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-text-secondary">Rp {item.nilai_2025}T</span>
                      <span className="text-text-secondary">→</span>
                      <span className="font-bold text-text-primary">Rp {item.nilai_2026}T</span>
                    </div>
                  ) : null}
                  <div className={`text-lg font-bold mt-1 ${c.val}`}>{item.perubahan}</div>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{item.deskripsi}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Section 4 + 5: Sumber Pendapatan & Utang ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Section 4: Sumber Pendapatan ── */}
        <section>
          <div className="bg-bg-card border border-border rounded-xl p-5 h-full">
            <h2 className="text-base font-semibold text-text-primary mb-1">💵 Sumber Pendapatan Negara</h2>
            <p className="text-xs text-text-secondary mb-4">Target 2025 · Rp 2.996,9 T</p>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={SUMBER_PENDAPATAN}
                  dataKey="nilai"
                  nameKey="nama"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  onMouseEnter={(_, idx) => setActiveIndex(idx)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {SUMBER_PENDAPATAN.map((entry, idx) => (
                    <Cell
                      key={entry.nama}
                      fill={entry.warna}
                      opacity={activeIndex === null || activeIndex === idx ? 1 : 0.5}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {SUMBER_PENDAPATAN.map((s) => (
                <div key={s.nama} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: s.warna }}
                    />
                    <span className="text-text-secondary">{s.nama}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-text-primary font-mono">{s.nilai.toFixed(1)} T</span>
                    <span className="text-text-secondary w-10 text-right">{s.persen}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 5: Utang Negara ── */}
        <section>
          <div className="bg-bg-card border border-border rounded-xl p-5 h-full flex flex-col gap-4">
            <div>
              <h2 className="text-base font-semibold text-text-primary mb-1">🏦 Utang Negara</h2>
              <p className="text-xs text-text-secondary">Per 2025 · Triliun Rp</p>
            </div>

            {/* Debt KPIs */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-bg-elevated rounded-lg p-3 text-center">
                <div className="text-xs text-text-secondary mb-1">Total Utang</div>
                <div className="text-lg font-bold text-text-primary">Rp 8.961 T</div>
              </div>
              <div className="bg-bg-elevated rounded-lg p-3 text-center">
                <div className="text-xs text-text-secondary mb-1">Rasio PDB</div>
                <div className="text-lg font-bold text-green-400">{UTANG_NEGARA.rasio_pdb}%</div>
              </div>
              <div className="bg-bg-elevated rounded-lg p-3 text-center">
                <div className="text-xs text-text-secondary mb-1">Jatuh Tempo '25</div>
                <div className="text-lg font-bold text-orange-400">Rp 800 T</div>
              </div>
            </div>

            {/* Kreditor Bar Chart */}
            <div>
              <p className="text-xs text-text-secondary mb-2">Komposisi Kreditor</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart
                  data={UTANG_NEGARA.kreditor}
                  layout="vertical"
                  margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
                  barSize={14}
                >
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#ffffff0d" />
                  <XAxis
                    type="number"
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    unit="T"
                  />
                  <YAxis
                    type="category"
                    dataKey="nama"
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={120}
                  />
                  <Tooltip
                    formatter={(val) => [`Rp ${val.toLocaleString('id-ID')} T`, 'Nilai']}
                    contentStyle={{
                      background: 'var(--bg-card, #1e293b)',
                      border: '1px solid var(--border, #334155)',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Bar dataKey="nilai" radius={[0, 4, 4, 0]}>
                    {UTANG_NEGARA.kreditor.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={['#3b82f6', '#f97316', '#8b5cf6', '#64748b'][idx % 4]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-2">
                {UTANG_NEGARA.kreditor.map((k, idx) => (
                  <span key={k.nama} className="text-xs text-text-secondary">
                    <span
                      className="inline-block w-2 h-2 rounded-full mr-1"
                      style={{ backgroundColor: ['#3b82f6','#f97316','#8b5cf6','#64748b'][idx % 4] }}
                    />
                    {k.nama}: {k.persen}%
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── Section 6: Konteks Politik ── */}
      <section>
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
          🏛️ Konteks Politik &amp; Kebijakan
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {KONTEKS_POLITIK.map((item) => {
            const colorMap = {
              red:    { bg: 'bg-red-900/20',    border: 'border-red-800/40',    tag: 'bg-red-900/40 text-red-300',    val: 'text-red-400'    },
              green:  { bg: 'bg-green-900/20',  border: 'border-green-800/40',  tag: 'bg-green-900/40 text-green-300',  val: 'text-green-400'  },
              blue:   { bg: 'bg-blue-900/20',   border: 'border-blue-800/40',   tag: 'bg-blue-900/40 text-blue-300',   val: 'text-blue-400'   },
              orange: { bg: 'bg-orange-900/20', border: 'border-orange-800/40', tag: 'bg-orange-900/40 text-orange-300', val: 'text-orange-400' },
            }
            const c = colorMap[item.warna] || colorMap.blue
            return (
              <div key={item.id} className={`rounded-xl p-4 border ${c.bg} ${c.border} flex flex-col gap-3`}>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-2xl">{item.ikon}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.tag}`}>{item.tag}</span>
                </div>
                <div>
                  <div className="font-semibold text-text-primary text-sm leading-tight">{item.judul}</div>
                  <div className={`text-xl font-bold mt-1 ${c.val}`}>{item.nilai}</div>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{item.deskripsi}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Section: Sumber Data ── */}
      <section>
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <h2 className="text-base font-semibold text-text-primary mb-3">📎 Sumber Data</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
            {[
              { label: 'APBN 2025', source: 'Perpres 201/2024, kemenkeu.go.id' },
              { label: 'APBN 2026', source: 'RAPBN 2026, nota keuangan 2026 — kemenkeu.go.id' },
              { label: 'Realisasi Q1 2025', source: 'Laporan Keuangan Pemerintah Pusat (LKPP)' },
              { label: 'Perbandingan historis', source: 'APBN-P 2023, 2024 — kemenkeu.go.id/apbn' },
            ].map((s) => (
              <div key={s.label} className="flex items-start gap-2 text-xs">
                <span className="text-text-secondary flex-shrink-0">•</span>
                <span>
                  <span className="text-text-primary font-medium">{s.label}:</span>{' '}
                  <span className="text-text-secondary">{s.source}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer note ── */}
      <div className="text-center text-xs text-text-secondary pb-4 border-t border-border pt-4">
        Data APBN berdasarkan dokumen resmi Kemenkeu RI. Proyeksi 2026 belum final — mengacu pada KFIB dan nota keuangan 2026.
        Realisasi Q1 2025 merupakan estimasi. Sumber: Kemenkeu RI, Nota Keuangan RAPBN 2025–2026.
      </div>
    </div>
  )
}
