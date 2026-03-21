import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'
import { APBN_2025, MINISTRY_BUDGETS, PRIORITY_PROGRAMS } from '../../data/budget'
import { PERSONS } from '../../data/persons'

// ── Formatters ──────────────────────────────────────────────────────────────

function fmtT(val) {
  // Format as "Rp X,X T" (triliun)
  const t = val / 1_000_000_000_000
  if (t >= 1) return `Rp ${t.toFixed(1).replace('.', ',')} T`
  const b = val / 1_000_000_000
  return `Rp ${b.toFixed(0)} M`
}

function fmtTShort(val) {
  const t = val / 1_000_000_000_000
  return t >= 0.1 ? `${t.toFixed(1)}T` : `${(val / 1_000_000_000).toFixed(0)}M`
}

// ── Cut severity badge ───────────────────────────────────────────────────────

function CutBadge({ pct }) {
  let cls, label
  if (pct >= 30) {
    cls = 'bg-red-900/40 text-red-300 border border-red-700'
    label = `🔴 ${pct}%`
  } else if (pct >= 15) {
    cls = 'bg-red-700/30 text-red-400 border border-red-600'
    label = `🟠 ${pct}%`
  } else if (pct >= 5) {
    cls = 'bg-amber-700/30 text-amber-400 border border-amber-600'
    label = `🟡 ${pct}%`
  } else {
    cls = 'bg-green-700/30 text-green-400 border border-green-600'
    label = `🟢 ${pct}%`
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {label}
    </span>
  )
}

// ── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ icon, label, value, sub, highlight }) {
  return (
    <div className={`rounded-xl p-4 border ${highlight ? 'bg-red-900/20 border-red-700/40' : 'bg-bg-card border-border'}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-text-muted mb-1">{label}</p>
          <p className={`text-2xl font-bold ${highlight ? 'text-red-400' : 'text-text-primary'}`}>{value}</p>
          {sub && <p className="text-xs text-text-muted mt-1">{sub}</p>}
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  )
}

// ── Custom bar tooltip ────────────────────────────────────────────────────────

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-bg-card border border-border rounded-lg p-3 text-sm shadow-xl max-w-xs">
      <p className="font-semibold text-text-primary mb-1">{d.name}</p>
      <p className="text-red-400">Dipotong: {fmtT(d.cut_amount)}</p>
      <p className="text-text-muted">Asli: {fmtT(d.budget_original)}</p>
      <p className="text-orange-400">Persentase: {d.cut_pct}%</p>
    </div>
  )
}

// ── Ministry Card ─────────────────────────────────────────────────────────────

function MinistryCard({ ministry }) {
  const minister = ministry.minister_id
    ? PERSONS.find(p => p.id === ministry.minister_id)
    : null
  const remainPct = ((ministry.budget_after_cut / ministry.budget_original) * 100).toFixed(0)
  const cutPct = ministry.cut_pct

  return (
    <div className="bg-bg-card border border-border rounded-xl p-4 hover:border-red-700/50 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary text-sm leading-tight">{ministry.name}</h3>
          {minister ? (
            <Link
              to={`/persons/${minister.id}`}
              className="text-xs text-red-400 hover:underline mt-0.5 block"
            >
              👤 {minister.name} →
            </Link>
          ) : (
            <p className="text-xs text-text-muted mt-0.5">—</p>
          )}
        </div>
        <CutBadge pct={cutPct} />
      </div>

      {/* Budget flow */}
      <div className="flex items-center gap-2 mb-3 text-sm">
        <span className="text-text-muted text-xs">{fmtT(ministry.budget_original)}</span>
        <span className="text-red-500 font-bold">↓</span>
        <span className="text-text-primary text-xs font-semibold">{fmtT(ministry.budget_after_cut)}</span>
        <span className="text-red-400 text-xs">(-{fmtT(ministry.cut_amount)})</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-red-900/40 rounded-full h-2 mb-3 overflow-hidden">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all"
          style={{ width: `${remainPct}%` }}
        />
      </div>
      <p className="text-[10px] text-text-muted mb-2">{remainPct}% tersisa setelah pemotongan</p>

      {/* Impact note */}
      <p className="text-xs text-text-secondary italic leading-relaxed border-t border-border pt-2">
        {ministry.impact_note}
      </p>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function BudgetPage() {
  const [sortBy, setSortBy] = useState('nominal') // 'nominal' | 'pct'

  // Sort for chart/table
  const sorted = useMemo(() => {
    return [...MINISTRY_BUDGETS].sort((a, b) =>
      sortBy === 'nominal'
        ? b.cut_amount - a.cut_amount
        : b.cut_pct - a.cut_pct
    )
  }, [sortBy])

  // Chart data — top 12 by cut amount
  const chartData = useMemo(() =>
    [...MINISTRY_BUDGETS]
      .sort((a, b) => b.cut_amount - a.cut_amount)
      .slice(0, 12)
      .map(m => ({
        ...m,
        nameShort: m.name.replace('Kementerian ', 'Kem. ').replace('Tentara Nasional Indonesia', 'TNI').replace('Kepolisian RI (Polri)', 'Polri').replace('Badan Intelijen Negara', 'BIN').replace('Mahkamah Agung', 'MA'),
        cutT: parseFloat((m.cut_amount / 1e12).toFixed(1)),
      }))
  , [])

  // Color by severity
  function barColor(cutPct) {
    if (cutPct >= 50) return '#7f1d1d'
    if (cutPct >= 30) return '#b91c1c'
    if (cutPct >= 15) return '#ef4444'
    if (cutPct >= 5)  return '#f97316'
    return '#fbbf24'
  }

  return (
    <div className="space-y-8">

      {/* ── Section 1: Hero ─────────────────────────────────────────────── */}
      <div>
        <div className="flex items-start gap-4 mb-6">
          <span className="text-4xl">💰</span>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Efisiensi APBN 2025</h1>
            <p className="text-text-muted text-sm mt-1">
              Instruksi Presiden No. 1/2025 · Ditandatangani 22 Januari 2025
            </p>
            <p className="text-text-secondary text-sm mt-2 max-w-2xl leading-relaxed">
              {APBN_2025.context}
            </p>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard
            icon="🏦"
            label="Total APBN 2025"
            value="Rp 3.613T"
            sub="Anggaran awal"
          />
          <KpiCard
            icon="✂️"
            label="Total Dipotong"
            value="Rp 306T"
            sub="Efisiensi Inpres 1/2025"
            highlight
          />
          <KpiCard
            icon="📉"
            label="Persentase Dipotong"
            value="8,47%"
            sub="Dari total APBN"
            highlight
          />
          <KpiCard
            icon="🏛️"
            label="K/L Terdampak"
            value={MINISTRY_BUDGETS.length.toString()}
            sub="Kementerian & lembaga"
          />
        </div>
      </div>

      {/* ── Section 2: Chart + Table ─────────────────────────────────────── */}
      <div className="bg-bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <h2 className="text-lg font-bold text-text-primary">📊 Pemotongan Terbesar</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('nominal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sortBy === 'nominal'
                  ? 'bg-red-600 text-white'
                  : 'bg-bg-elevated text-text-muted hover:text-text-primary'
              }`}
            >
              Terbesar Nominal
            </button>
            <button
              onClick={() => setSortBy('pct')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sortBy === 'pct'
                  ? 'bg-red-600 text-white'
                  : 'bg-bg-elevated text-text-muted hover:text-text-primary'
              }`}
            >
              Terbesar %
            </button>
          </div>
        </div>

        {/* Horizontal Bar Chart */}
        <div className="w-full overflow-x-auto">
          <ResponsiveContainer width="100%" height={420}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 60, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ffffff10" />
              <XAxis
                type="number"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={v => `${v}T`}
                domain={[0, 'dataMax + 5']}
              />
              <YAxis
                type="category"
                dataKey="nameShort"
                width={110}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="cutT" radius={[0, 4, 4, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.id} fill={barColor(entry.cut_pct)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sortable Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-text-muted text-xs">
                <th className="text-left py-2 pr-3 font-medium">Kementerian / Lembaga</th>
                <th className="text-right py-2 pr-3 font-medium">Anggaran Awal</th>
                <th className="text-right py-2 pr-3 font-medium text-red-400">Dipotong</th>
                <th className="text-right py-2 pr-3 font-medium">% Potong</th>
                <th className="text-left py-2 pr-3 font-medium">Pimpinan</th>
                <th className="text-left py-2 font-medium">Dampak</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((m, i) => {
                const minister = m.minister_id ? PERSONS.find(p => p.id === m.minister_id) : null
                return (
                  <tr
                    key={m.id}
                    className={`border-b border-border/50 transition-colors hover:bg-bg-elevated ${i % 2 === 0 ? '' : 'bg-bg-elevated/30'}`}
                  >
                    <td className="py-2.5 pr-3 font-medium text-text-primary">{m.name}</td>
                    <td className="py-2.5 pr-3 text-right text-text-muted text-xs">{fmtT(m.budget_original)}</td>
                    <td className="py-2.5 pr-3 text-right font-semibold text-red-400">{fmtT(m.cut_amount)}</td>
                    <td className="py-2.5 pr-3 text-right">
                      <CutBadge pct={m.cut_pct} />
                    </td>
                    <td className="py-2.5 pr-3">
                      {minister ? (
                        <Link to={`/persons/${minister.id}`} className="text-red-400 hover:underline text-xs">
                          {minister.name}
                        </Link>
                      ) : (
                        <span className="text-text-muted text-xs">—</span>
                      )}
                    </td>
                    <td className="py-2.5 text-xs text-text-secondary max-w-xs">{m.impact_note}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 3: Ministry Cards ────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-4">🏛️ Detail Per Kementerian</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sorted.map(m => (
            <MinistryCard key={m.id} ministry={m} />
          ))}
        </div>
      </div>

      {/* ── Section 4: Priority Programs ─────────────────────────────────── */}
      <div className="bg-bg-card border border-border rounded-2xl p-5">
        <h2 className="text-lg font-bold text-text-primary mb-1">🎯 Digunakan Untuk</h2>
        <p className="text-text-muted text-sm mb-5">Program prioritas yang didanai dari hasil efisiensi</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRIORITY_PROGRAMS.map(prog => (
            <div
              key={prog.name}
              className="bg-bg-elevated border border-border rounded-xl p-4 hover:border-green-700/50 transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                <span className="text-xs font-semibold text-green-400 uppercase tracking-wide">{prog.status}</span>
              </div>
              <h3 className="font-semibold text-text-primary text-sm mb-1">{prog.name}</h3>
              <p className="text-lg font-bold text-green-400 mb-1">
                {prog.budget > 0 ? fmtT(prog.budget) : 'Non-APBN'}
              </p>
              <p className="text-xs text-text-muted">👥 {prog.beneficiaries}</p>
              {prog.note && <p className="text-xs text-text-muted mt-1 italic">{prog.note}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 5: Controversy ───────────────────────────────────────── */}
      <div className="bg-amber-900/20 border border-amber-700/40 rounded-2xl p-5">
        <h2 className="text-lg font-bold text-amber-400 mb-4">⚠️ Kontroversi &amp; Sorotan</h2>
        <div className="space-y-3">
          {[
            {
              icon: '⚖️',
              title: 'KPK dipotong 40%',
              desc: 'Kapasitas investigasi turun drastis — budget dari Rp 1,6T menjadi Rp 950M. Penyidik aktif berkurang.',
              severity: 'high',
            },
            {
              icon: '🔬',
              title: 'BRIN hampir tutup',
              desc: '60% laboratorium nasional terdampak. Penelitian dasar dan terapan terhenti sebagian besar.',
              severity: 'high',
            },
            {
              icon: '🚓',
              title: 'Polri dipotong Rp 63T',
              desc: 'Rekrutmen Polri dihentikan sementara. Operasional lapangan dikurangi signifikan.',
              severity: 'medium',
            },
            {
              icon: '🏗️',
              title: 'PUPR dipotong Rp 81T (55%)',
              desc: 'Proyek infrastruktur strategis ditunda. Ribuan kontraktor terpengaruh.',
              severity: 'high',
            },
            {
              icon: '🏛️',
              title: 'DPR: Perjalanan dinas dipangkas',
              desc: 'Perjalanan dinas anggota DPR dipotong dari total budget Rp 6,1T — namun sisa Rp 4,9T masih menjadi sorotan publik.',
              severity: 'low',
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`flex gap-3 p-3 rounded-xl border ${
                item.severity === 'high'
                  ? 'bg-red-900/20 border-red-700/30'
                  : item.severity === 'medium'
                  ? 'bg-orange-900/20 border-orange-700/30'
                  : 'bg-amber-900/20 border-amber-700/30'
              }`}
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="font-semibold text-text-primary text-sm">{item.title}</p>
                <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Source note */}
        <p className="text-xs text-text-muted mt-4 border-t border-amber-700/20 pt-3">
          📄 Sumber: Inpres No. 1/2025 · Kemenkeu · APBN 2025 · Media coverage Jan–Feb 2025
        </p>
      </div>

    </div>
  )
}
