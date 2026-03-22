import { useState, useMemo } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts'
import { PERSONS } from '../data/persons'
import { PARTY_MAP } from '../data/parties'
import { LHKPN_HISTORY, SUSPICIOUS_GROWTHS } from '../data/lhkpn_trend'
import { PageHeader, Card, KPICard, formatIDR } from '../components/ui'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatMiliar(v) {
  if (!v && v !== 0) return '—'
  if (v >= 1e12) return `Rp ${(v / 1e12).toFixed(2)}T`
  if (v >= 1e9)  return `Rp ${(v / 1e9).toFixed(0)}M`
  if (v >= 1e6)  return `Rp ${(v / 1e6).toFixed(0)} Jt`
  return `Rp ${v.toLocaleString('id-ID')}`
}

function formatYAxis(v) {
  if (v >= 1e12) return `${(v / 1e12).toFixed(0)}T`
  if (v >= 1e9)  return `${(v / 1e9).toFixed(0)}M`
  return `${v}`
}

function growthPct(first, last) {
  if (!first || !last) return 0
  return ((last - first) / first) * 100
}

function growthColor(pct) {
  if (pct > 200) return '#ef4444'
  if (pct > 100) return '#f59e0b'
  return '#22c55e'
}

// Per-person latest value from LHKPN_HISTORY
function latestValue(entry) {
  return entry.data[entry.data.length - 1]?.nilai ?? 0
}

// ─── Derived data ─────────────────────────────────────────────────────────────

const TOP5 = [...LHKPN_HISTORY]
  .sort((a, b) => latestValue(b) - latestValue(a))
  .slice(0, 5)

// Build LineChart data: rows keyed by year, cols keyed by person_id
function buildLineData(personIds) {
  const yearSet = new Set()
  LHKPN_HISTORY.filter(e => personIds.includes(e.person_id))
    .forEach(e => e.data.forEach(d => yearSet.add(d.tahun)))
  const years = [...yearSet].sort((a, b) => a - b)
  return years.map(tahun => {
    const row = { tahun }
    for (const id of personIds) {
      const entry = LHKPN_HISTORY.find(e => e.person_id === id)
      const point = entry?.data.find(d => d.tahun === tahun)
      row[id] = point?.nilai ?? null
    }
    return row
  })
}

// Growth data for bar chart
const GROWTH_DATA = LHKPN_HISTORY.map(entry => {
  const first = entry.data[0]
  const last  = entry.data[entry.data.length - 1]
  const pct   = growthPct(first.nilai, last.nilai)
  return {
    person_id: entry.person_id,
    nama: entry.nama.split(' ').slice(0, 2).join(' '),
    pct: Math.round(pct * 10) / 10,
    awal: first,
    akhir: last,
  }
}).sort((a, b) => b.pct - a.pct)

// Table data: growth per jabatan
const TABLE_DATA = LHKPN_HISTORY.map(entry => {
  const first   = entry.data[0]
  const last    = entry.data[entry.data.length - 1]
  const pct     = growthPct(first.nilai, last.nilai)
  const durasi  = last.tahun - first.tahun
  const person  = PERSONS.find(p => p.id === entry.person_id)
  const party   = person?.party_id ? PARTY_MAP[person.party_id] : null
  return {
    person_id: entry.person_id,
    nama:      entry.nama,
    jabatan:   entry.jabatan,
    awal:      first.nilai,
    awalTahun: first.tahun,
    akhir:     last.nilai,
    akhirTahun: last.tahun,
    pct,
    durasi,
    party,
  }
}).sort((a, b) => b.pct - a.pct)

const TREND_COLORS = ['#f59e0b', '#ef4444', '#3b82f6', '#22c55e', '#8b5cf6', '#ec4899', '#06b6d4', '#a3e635']
const ALL_IDS = LHKPN_HISTORY.map(e => e.person_id)

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function LineTip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-bg-card border border-border rounded-xl p-3 text-xs shadow-xl min-w-[180px]">
      <p className="text-text-secondary font-medium mb-2">Tahun {label}</p>
      {payload.map((item, i) => {
        const entry = LHKPN_HISTORY.find(e => e.person_id === item.dataKey)
        return item.value != null ? (
          <div key={i} className="flex items-center justify-between gap-3 mb-1">
            <span style={{ color: item.color }}>● {entry?.nama.split(' ').slice(0, 2).join(' ')}</span>
            <span className="text-accent-gold font-semibold">{formatMiliar(item.value)}</span>
          </div>
        ) : null
      })}
    </div>
  )
}

function BarTip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  const suspicious = SUSPICIOUS_GROWTHS.find(s => s.person_id === d.person_id)
  return (
    <div className="bg-bg-card border border-border rounded-xl p-3 text-xs shadow-xl min-w-[180px]">
      <p className="text-text-primary font-semibold mb-1">{d.nama}</p>
      <p className="text-text-secondary mb-1">
        Kenaikan {d.awal?.tahun}–{d.akhir?.tahun}
      </p>
      <p style={{ color: growthColor(d.pct) }} className="font-bold text-base">
        +{d.pct.toFixed(1)}%
      </p>
      {suspicious && suspicious.flag === 'tinggi' && (
        <p className="text-red-400 mt-1">⚠️ Pertumbuhan mencurigakan</p>
      )}
    </div>
  )
}

// ─── Party Badge ──────────────────────────────────────────────────────────────

function PartyBadge({ personId }) {
  const person = PERSONS.find(p => p.id === personId)
  const party  = person?.party_id ? PARTY_MAP[person.party_id] : null
  if (!party) return null
  return (
    <span
      className="text-[10px] px-1.5 py-0.5 rounded font-medium"
      style={{ backgroundColor: party.color + '22', color: party.color, border: `1px solid ${party.color}44` }}
    >
      {party.abbr}
    </span>
  )
}

// ─── Avatar (initials) ────────────────────────────────────────────────────────

function Avatar({ nama, personId }) {
  const person = PERSONS.find(p => p.id === personId)
  const party  = person?.party_id ? PARTY_MAP[person.party_id] : null
  const initials = nama.split(' ').slice(0, 2).map(w => w[0]).join('')
  return (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 border-2"
      style={{
        backgroundColor: (party?.color || '#6B7280') + '33',
        borderColor: party?.color || '#6B7280',
        color: party?.color || '#9CA3AF',
      }}
    >
      {initials}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LHKPNTrendPage() {
  const [selectedIds, setSelectedIds] = useState(['prabowo', 'jokowi', 'zulhas', 'airlangga'])

  function togglePerson(id) {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : prev.length < 8 ? [...prev, id] : prev
    )
  }

  const lineData = useMemo(() => buildLineData(selectedIds), [selectedIds])

  const totalSuspicious = SUSPICIOUS_GROWTHS.filter(s => s.flag === 'tinggi').length
  const maxWealth = Math.max(...LHKPN_HISTORY.map(e => latestValue(e)))

  return (
    <div className="space-y-6">
      <PageHeader
        title="📈 Tren LHKPN"
        subtitle="Pelacak Kenaikan Kekayaan Pejabat Negara"
      />

      {/* ── Disclaimer ── */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
        <span className="text-amber-400 text-xl flex-shrink-0">⚠️</span>
        <div className="text-amber-400 text-sm space-y-1">
          <p className="font-medium">
            Data LHKPN dari KPK adalah laporan mandiri pejabat — tidak selalu mencerminkan kekayaan sebenarnya
          </p>
          <p className="text-amber-400/70 text-xs">
            Verifikasi langsung di{' '}
            <a
              href="https://elhkpn.kpk.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-amber-300"
            >
              elhkpn.kpk.go.id
            </a>
            . Kekayaan aktual bisa berbeda signifikan dari laporan LHKPN.
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 1 — Top 5 Terkaya                                         */}
      {/* ══════════════════════════════════════════════════════════════════ */}

      <div>
        <h2 className="text-sm font-semibold text-text-primary mb-3">🏆 Top 5 Tokoh Terkaya (LHKPN Terbaru)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {TOP5.map((entry, rank) => {
            const latest   = latestValue(entry)
            const barWidth = Math.round((latest / maxWealth) * 100)
            return (
              <Card key={entry.person_id} className="p-4 relative overflow-hidden">
                {/* Rank badge */}
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-bg-elevated flex items-center justify-center text-[10px] font-bold text-text-secondary">
                  #{rank + 1}
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar nama={entry.nama} personId={entry.person_id} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-text-primary leading-tight truncate">
                      {entry.nama}
                    </p>
                    <div className="mt-1">
                      <PartyBadge personId={entry.person_id} />
                    </div>
                  </div>
                </div>
                <p className="text-sm font-bold text-accent-gold">{formatMiliar(latest)}</p>
                <p className="text-[10px] text-text-secondary mt-0.5">Tahun {entry.data[entry.data.length - 1].tahun}</p>
                {/* Wealth bar */}
                <div className="mt-2 h-1 bg-bg-elevated rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${barWidth}%`, backgroundColor: PARTY_MAP[PERSONS.find(p => p.id === entry.person_id)?.party_id]?.color || '#f59e0b' }}
                  />
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 2 — Multi-Person Trend Chart                              */}
      {/* ══════════════════════════════════════════════════════════════════ */}

      <Card className="p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-text-primary">📊 Tren Kekayaan Multi-Tokoh</h2>
          <p className="text-xs text-text-secondary mt-0.5">Pilih tokoh untuk ditampilkan di grafik (maks. 8)</p>
        </div>

        {/* Person selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          {ALL_IDS.map((id, idx) => {
            const entry    = LHKPN_HISTORY.find(e => e.person_id === id)
            const selected = selectedIds.includes(id)
            const colorIdx = selectedIds.indexOf(id)
            const color    = selected ? TREND_COLORS[colorIdx] : '#4B5563'
            return (
              <button
                key={id}
                onClick={() => togglePerson(id)}
                className="px-2.5 py-1 rounded-lg text-xs border transition-all"
                style={{
                  borderColor: color,
                  color: selected ? '#fff' : color,
                  backgroundColor: selected ? color + '33' : 'transparent',
                }}
              >
                {entry?.nama.split(' ').slice(0, 2).join(' ')}
              </button>
            )
          })}
        </div>

        {selectedIds.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData} margin={{ top: 4, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
              <XAxis dataKey="tahun" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <YAxis
                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                tickFormatter={formatYAxis}
                width={55}
                label={{ value: 'Rp Miliar', angle: -90, position: 'insideLeft', offset: 10, fill: '#6B7280', fontSize: 10 }}
              />
              <Tooltip content={<LineTip />} />
              <Legend
                formatter={name => {
                  const entry = LHKPN_HISTORY.find(e => e.person_id === name)
                  return (
                    <span style={{ color: '#D1D5DB', fontSize: 11 }}>
                      {entry?.nama.split(' ').slice(0, 2).join(' ') || name}
                    </span>
                  )
                }}
              />
              {selectedIds.map((id, idx) => (
                <Line
                  key={id}
                  type="monotone"
                  dataKey={id}
                  stroke={TREND_COLORS[idx]}
                  strokeWidth={2}
                  dot={{ r: 4, fill: TREND_COLORS[idx] }}
                  activeDot={{ r: 6 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-xs text-text-secondary text-center py-12">Pilih minimal 1 tokoh di atas</p>
        )}
      </Card>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 3 — Pertumbuhan Tertinggi                                 */}
      {/* ══════════════════════════════════════════════════════════════════ */}

      <Card className="p-5">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">🚀 Pertumbuhan Kekayaan Tertinggi</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Persentase kenaikan LHKPN dari laporan pertama ke terbaru
            </p>
          </div>
          {totalSuspicious > 0 && (
            <span className="flex-shrink-0 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-red-900/30 text-red-400 border border-red-700/30">
              ⚠️ {totalSuspicious} Mencurigakan
            </span>
          )}
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={GROWTH_DATA} margin={{ top: 16, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />
            <XAxis dataKey="nama" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
            <YAxis
              tick={{ fill: '#9CA3AF', fontSize: 10 }}
              tickFormatter={v => `${v}%`}
              width={45}
            />
            <Tooltip content={<BarTip />} />
            <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
              {GROWTH_DATA.map((entry, i) => (
                <Cell key={i} fill={growthColor(entry.pct)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-3 justify-center text-xs text-text-secondary">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-red-500 inline-block" />
            &gt; 200% — Sangat tinggi
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block" />
            100–200% — Perlu perhatian
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-green-500 inline-block" />
            &lt; 100% — Wajar
          </span>
        </div>

        {/* Suspicious flags */}
        {SUSPICIOUS_GROWTHS.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">⚠️ Pertumbuhan Mencurigakan</p>
            {SUSPICIOUS_GROWTHS.map(s => {
              const entry = LHKPN_HISTORY.find(e => e.person_id === s.person_id)
              const flagColor = s.flag === 'tinggi' ? 'text-red-400 bg-red-900/20 border-red-700/30'
                : s.flag === 'sedang' ? 'text-amber-400 bg-amber-900/20 border-amber-700/30'
                : 'text-yellow-400 bg-yellow-900/20 border-yellow-700/30'
              return (
                <div key={s.person_id} className={`flex items-center justify-between rounded-lg px-3 py-2 border text-xs ${flagColor}`}>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{entry?.nama}</span>
                    <span className="opacity-70">{s.tahun_dari}→{s.tahun_ke}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">+{s.growth_pct}%</span>
                    <span className="capitalize opacity-70">{s.flag.replace('_', ' ')}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 4 — Kenaikan per Jabatan Table                            */}
      {/* ══════════════════════════════════════════════════════════════════ */}

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-text-primary mb-1">📋 Kenaikan per Jabatan</h2>
        <p className="text-xs text-text-secondary mb-4">Diurutkan berdasarkan persentase kenaikan terbesar</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-[10px] text-text-secondary uppercase tracking-wider">
                <th className="pb-2 text-left w-6">#</th>
                <th className="pb-2 text-left">Tokoh</th>
                <th className="pb-2 text-left hidden md:table-cell">Jabatan</th>
                <th className="pb-2 text-right">LHKPN Awal</th>
                <th className="pb-2 text-right">LHKPN Akhir</th>
                <th className="pb-2 text-right">Kenaikan %</th>
                <th className="pb-2 text-center hidden sm:table-cell">Durasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {TABLE_DATA.map((row, i) => {
                const suspicious = SUSPICIOUS_GROWTHS.find(s => s.person_id === row.person_id)
                const pctColor   = row.pct > 200 ? 'text-red-400' : row.pct > 100 ? 'text-amber-400' : 'text-green-400'
                return (
                  <tr key={row.person_id} className="hover:bg-bg-elevated/40 transition-colors">
                    <td className="py-2.5 text-text-secondary text-xs">{i + 1}</td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-text-primary">{row.nama}</p>
                          <div className="mt-0.5">
                            {row.party && (
                              <span
                                className="text-[10px] px-1 py-0.5 rounded"
                                style={{ backgroundColor: row.party.color + '22', color: row.party.color }}
                              >
                                {row.party.abbr}
                              </span>
                            )}
                          </div>
                        </div>
                        {suspicious?.flag === 'tinggi' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-900/30 text-red-400 border border-red-700/30 whitespace-nowrap">
                            ⚠️ Mencurigakan
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 hidden md:table-cell">
                      <p className="text-xs text-text-secondary max-w-[200px] truncate" title={row.jabatan}>
                        {row.jabatan}
                      </p>
                    </td>
                    <td className="py-2.5 text-right">
                      <div>
                        <p className="text-xs text-text-secondary font-mono">{formatMiliar(row.awal)}</p>
                        <p className="text-[10px] text-text-muted">{row.awalTahun}</p>
                      </div>
                    </td>
                    <td className="py-2.5 text-right">
                      <div>
                        <p className="text-xs text-accent-gold font-semibold font-mono">{formatMiliar(row.akhir)}</p>
                        <p className="text-[10px] text-text-muted">{row.akhirTahun}</p>
                      </div>
                    </td>
                    <td className="py-2.5 text-right">
                      <span className={`text-xs font-bold font-mono ${pctColor}`}>
                        +{row.pct.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2.5 text-center hidden sm:table-cell">
                      <span className="text-xs text-text-secondary">{row.durasi} thn</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 5 — Disclaimer                                            */}
      {/* ══════════════════════════════════════════════════════════════════ */}

      <Card className="p-5 border-border/50">
        <h2 className="text-sm font-semibold text-text-primary mb-3">ℹ️ Tentang Data LHKPN</h2>
        <div className="space-y-3 text-xs text-text-secondary">
          <p>
            <strong className="text-text-primary">LHKPN (Laporan Harta Kekayaan Penyelenggara Negara)</strong> adalah
            kewajiban konstitusional pejabat negara untuk melaporkan seluruh harta kekayaan kepada KPK setiap tahun.
          </p>
          <p className="text-amber-400/90 bg-amber-500/10 rounded-lg px-3 py-2 border border-amber-500/20">
            ⚠️ <strong>Penting:</strong> Data LHKPN dari KPK adalah laporan mandiri pejabat — tidak selalu
            mencerminkan kekayaan sebenarnya. Aset yang tidak dilaporkan, aset atas nama keluarga, atau harta
            yang disembunyikan tidak tercatat dalam sistem ini.
          </p>
          <p>
            Pertumbuhan kekayaan yang tinggi tidak otomatis berarti korupsi — bisa saja dari bisnis,
            investasi, warisan, atau kenaikan nilai properti. Namun angka yang jauh melebihi gaji resmi
            patut mendapat perhatian publik dan investigasi independen.
          </p>
          <div className="pt-1">
            <p className="text-text-primary font-medium mb-1">Sumber & Verifikasi:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>
                Portal resmi KPK:{' '}
                <a
                  href="https://elhkpn.kpk.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-gold hover:underline"
                >
                  elhkpn.kpk.go.id
                </a>
              </li>
              <li>Data diperbarui berdasarkan laporan publik yang tersedia</li>
              <li>Beberapa angka menggunakan estimasi laporan akhir tahun fiskal</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
