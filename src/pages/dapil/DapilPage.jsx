import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid
} from 'recharts'
import {
  DAPIL_LIST,
  DAPIL_BY_PROVINCE,
  PROVINCE_SUMMARY,
  NATIONAL_PARTY_SEATS,
  TOTAL_DAPIL,
  TOTAL_SEATS,
  TOTAL_PROVINCES,
} from '../../data/dapil'
import { PARTY_MAP, PARTIES } from '../../data/parties'
import { PageHeader, Card } from '../../components/ui'

// ── Party color map ─────────────────────────────────────────────────────────
const PARTY_COLOR = {
  ger:  '#DC2626',   // Gerindra — red
  pdip: '#991B1B',   // PDIP — crimson
  gol:  '#EAB308',   // Golkar — yellow
  nas:  '#F97316',   // NasDem — orange
  pkb:  '#0D9488',   // PKB — teal
  pks:  '#065F46',   // PKS — dark teal
  pan:  '#2563EB',   // PAN — blue
  dem:  '#0EA5E9',   // Demokrat — sky
  ppp:  '#16A34A',   // PPP — green
}

function partyColor(id) {
  return PARTY_COLOR[id] || PARTY_MAP[id]?.color || '#6B7280'
}

// ── Mini party bar (proportional segments) ──────────────────────────────────
function PartyBar({ parties, seats }) {
  if (!parties || parties.length === 0) return <div className="h-3 bg-bg-elevated rounded" />
  const withSeats = parties.filter(p => p.seats > 0)
  return (
    <div className="flex h-4 rounded overflow-hidden gap-px w-full min-w-[80px]">
      {withSeats.map((p, i) => (
        <div
          key={p.id || i}
          title={`${PARTY_MAP[p.id]?.abbr || p.id}: ${p.seats} kursi`}
          style={{
            width: `${(p.seats / seats) * 100}%`,
            backgroundColor: partyColor(p.id),
            minWidth: 2,
          }}
        />
      ))}
    </div>
  )
}

// ── Expanded dapil row detail ────────────────────────────────────────────────
function DapilDetail({ dapil }) {
  return (
    <div className="px-4 pb-4 pt-1 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Party breakdown */}
      <div>
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Perolehan Kursi Partai</p>
        <div className="space-y-1.5">
          {dapil.parties
            .filter(p => p.seats > 0)
            .sort((a, b) => b.seats - a.seats)
            .map((p, i) => {
              const party = PARTY_MAP[p.id] || {}
              return (
                <div key={p.id || i} className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: partyColor(p.id) }}
                  />
                  <span className="text-xs text-text-primary w-20 truncate">{party.abbr || p.id}</span>
                  <div className="flex-1 bg-bg-elevated rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(p.seats / dapil.seats) * 100}%`,
                        backgroundColor: partyColor(p.id),
                      }}
                    />
                  </div>
                  <span className="text-xs text-text-primary font-semibold w-6 text-right">{p.seats}</span>
                  <span className="text-xs text-text-secondary w-12 text-right">{p.vote_pct?.toFixed(1)}%</span>
                </div>
              )
            })}
        </div>
      </div>

      {/* Kabupaten list */}
      <div>
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
          Kabupaten/Kota ({dapil.kabupaten?.length || 0})
        </p>
        <div className="flex flex-wrap gap-1">
          {(dapil.kabupaten || []).map((k, i) => (
            <span
              key={i}
              className="text-xs bg-bg-elevated border border-border text-text-secondary px-2 py-0.5 rounded"
            >
              {k}
            </span>
          ))}
        </div>
        {dapil.total_voters && (
          <p className="text-xs text-text-secondary mt-2">
            DPT: {(dapil.total_voters / 1_000_000).toFixed(2)} juta pemilih
          </p>
        )}
      </div>
    </div>
  )
}

// ── Custom Recharts tooltip ──────────────────────────────────────────────────
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-bg-card border border-border rounded-lg px-3 py-2 text-sm shadow-lg">
      <p className="font-semibold text-text-primary">{d.name}</p>
      <p className="text-text-secondary">{d.value} kursi</p>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function DapilPage() {
  const [selectedProvince, setSelectedProvince] = useState('all')
  const [expandedId, setExpandedId] = useState(null)
  const [searchQ, setSearchQ] = useState('')

  // Build province options from PROVINCE_SUMMARY
  const provinceOptions = useMemo(() => {
    return [{ value: 'all', label: 'Semua Provinsi' }].concat(
      PROVINCE_SUMMARY.map(p => ({ value: p.province_id, label: p.name }))
    )
  }, [])

  // Filtered dapil list
  const filteredDapil = useMemo(() => {
    let list = DAPIL_LIST
    if (selectedProvince !== 'all') {
      list = list.filter(d => d.province === selectedProvince)
    }
    if (searchQ.trim()) {
      const q = searchQ.toLowerCase()
      list = list.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.province.toLowerCase().includes(q) ||
        (d.kabupaten || []).some(k => k.toLowerCase().includes(q))
      )
    }
    return list
  }, [selectedProvince, searchQ])

  // KPI stats (always use full list)
  const avgSeats = (TOTAL_SEATS / TOTAL_DAPIL).toFixed(1)

  // Party chart data (national totals from data)
  const partyChartData = useMemo(() => {
    return NATIONAL_PARTY_SEATS
      .map(({ id, seats }) => ({
        name: PARTY_MAP[id]?.abbr || id,
        seats,
        fill: partyColor(id),
        fullName: PARTY_MAP[id]?.name || id,
      }))
      .filter(d => d.seats > 0)
  }, [])

  function toggleExpand(id) {
    setExpandedId(prev => prev === id ? null : id)
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">🗳️ Peta Dapil DPR RI 2024</h1>
        <p className="text-text-secondary mt-1 text-sm">
          84 Daerah Pemilihan · 580 Kursi · 38 Provinsi
        </p>
      </div>

      {/* ── KPI Stats bar ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-text-primary">{TOTAL_DAPIL}</p>
          <p className="text-xs text-text-secondary mt-1">Total Dapil</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-accent-red">{TOTAL_SEATS}</p>
          <p className="text-xs text-text-secondary mt-1">Total Kursi</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-text-primary">{TOTAL_PROVINCES}</p>
          <p className="text-xs text-text-secondary mt-1">Provinsi</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-text-primary">{avgSeats}</p>
          <p className="text-xs text-text-secondary mt-1">Rata-rata Kursi/Dapil</p>
        </Card>
      </div>

      {/* ── Filter + Search row ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Province filter dropdown */}
        <select
          value={selectedProvince}
          onChange={e => { setSelectedProvince(e.target.value); setExpandedId(null) }}
          className="bg-bg-card border border-border text-text-primary text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-red/40"
        >
          {provinceOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Search */}
        <input
          type="text"
          placeholder="Cari dapil atau kabupaten..."
          value={searchQ}
          onChange={e => { setSearchQ(e.target.value); setExpandedId(null) }}
          className="bg-bg-card border border-border text-text-primary text-sm rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-accent-red/40 placeholder:text-text-secondary"
        />

        <span className="text-sm text-text-secondary self-center whitespace-nowrap">
          {filteredDapil.length} dapil
        </span>
      </div>

      {/* ── Province pills (when a province is selected, show dapil count) ── */}
      {selectedProvince !== 'all' && (
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedProvince('all')}
            className="text-xs text-accent-red hover:underline"
          >
            ← Semua Provinsi
          </button>
          {PROVINCE_SUMMARY.filter(p => p.province_id === selectedProvince).map(p => (
            <div key={p.province_id} className="flex items-center gap-2 text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">{p.name}</span>
              <span>·</span>
              <span>{p.dapil_count} dapil</span>
              <span>·</span>
              <span>{p.total_seats} kursi</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Dapil Table ── */}
      <Card className="overflow-hidden">
        {/* Table header */}
        <div className="hidden md:grid grid-cols-[2fr_1.5fr_60px_1fr_80px] gap-4 px-4 py-2.5 border-b border-border text-xs font-semibold text-text-secondary uppercase tracking-wide">
          <span>Dapil</span>
          <span>Provinsi</span>
          <span className="text-center">Kursi</span>
          <span>Komposisi Partai</span>
          <span className="text-right">Turnout</span>
        </div>

        {filteredDapil.length === 0 ? (
          <div className="p-8 text-center text-text-secondary text-sm">
            Tidak ada dapil yang cocok.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredDapil.map(dapil => {
              const isExpanded = expandedId === dapil.id
              const provinceName = PROVINCE_SUMMARY.find(p => p.province_id === dapil.province)?.name || dapil.province
              return (
                <div key={dapil.id}>
                  {/* Main row */}
                  <button
                    onClick={() => toggleExpand(dapil.id)}
                    className="w-full text-left hover:bg-bg-elevated transition-colors"
                  >
                    {/* Desktop grid */}
                    <div className="hidden md:grid grid-cols-[2fr_1.5fr_60px_1fr_80px] gap-4 px-4 py-3 items-center">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs transition-transform ${isExpanded ? 'rotate-90' : ''}`}>▶</span>
                        <div>
                          <p className="text-sm font-semibold text-text-primary">{dapil.name}</p>
                          <p className="text-xs text-text-secondary">{dapil.kabupaten?.length || 0} kab/kota</p>
                        </div>
                      </div>
                      <span className="text-sm text-text-secondary">{provinceName}</span>
                      <span className="text-sm font-bold text-text-primary text-center">{dapil.seats}</span>
                      <PartyBar parties={dapil.parties} seats={dapil.seats} />
                      <span className="text-sm text-text-secondary text-right">{dapil.turnout_pct}%</span>
                    </div>

                    {/* Mobile card */}
                    <div className="md:hidden px-4 py-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-semibold text-text-primary">{dapil.name}</p>
                          <p className="text-xs text-text-secondary">{provinceName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-text-primary">{dapil.seats} kursi</p>
                          <p className="text-xs text-text-secondary">{dapil.turnout_pct}% turnout</p>
                        </div>
                      </div>
                      <PartyBar parties={dapil.parties} seats={dapil.seats} />
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="bg-bg-elevated border-t border-border">
                      <DapilDetail dapil={dapil} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* ── Party Seat Summary (national) ── */}
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-3">
          🏛️ Total Kursi Partai — Nasional
        </h2>
        <Card className="p-4">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={partyChartData}
              margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: 'var(--color-text-secondary, #9CA3AF)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'var(--color-text-secondary, #9CA3AF)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="seats" radius={[4, 4, 0, 0]}>
                {partyChartData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ── Province Seat Summary table ── */}
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-3">
          📊 Ringkasan Per Provinsi
        </h2>
        <Card className="overflow-hidden">
          <div className="hidden md:grid grid-cols-[2fr_60px_60px_1fr_80px] gap-4 px-4 py-2.5 border-b border-border text-xs font-semibold text-text-secondary uppercase tracking-wide">
            <span>Provinsi</span>
            <span className="text-center">Dapil</span>
            <span className="text-center">Kursi</span>
            <span>Partai Dominan</span>
            <span className="text-right">Avg Turnout</span>
          </div>
          <div className="divide-y divide-border">
            {PROVINCE_SUMMARY.map(prov => {
              const domParty = PARTY_MAP[prov.dominant_party_id]
              return (
                <div
                  key={prov.province_id}
                  className="hidden md:grid grid-cols-[2fr_60px_60px_1fr_80px] gap-4 px-4 py-2.5 items-center hover:bg-bg-elevated transition-colors cursor-pointer"
                  onClick={() => setSelectedProvince(prov.province_id)}
                >
                  <div>
                    <p className="text-sm font-medium text-text-primary">{prov.name}</p>
                    <p className="text-xs text-text-secondary">{prov.region}</p>
                  </div>
                  <span className="text-sm text-text-secondary text-center">{prov.dapil_count}</span>
                  <span className="text-sm font-bold text-text-primary text-center">{prov.total_seats}</span>
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: partyColor(prov.dominant_party_id) }}
                    />
                    <span className="text-sm text-text-secondary">{domParty?.abbr || prov.dominant_party_id}</span>
                  </div>
                  <span className="text-sm text-text-secondary text-right">{prov.avg_turnout}%</span>
                </div>
              )
            })}
          </div>

          {/* Mobile version */}
          <div className="md:hidden divide-y divide-border">
            {PROVINCE_SUMMARY.map(prov => {
              const domParty = PARTY_MAP[prov.dominant_party_id]
              return (
                <div
                  key={prov.province_id}
                  className="px-4 py-3 hover:bg-bg-elevated transition-colors cursor-pointer"
                  onClick={() => { setSelectedProvince(prov.province_id); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{prov.name}</p>
                      <p className="text-xs text-text-secondary">{prov.dapil_count} dapil · {prov.total_seats} kursi</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <div
                        className="w-2 h-2 rounded-sm"
                        style={{ backgroundColor: partyColor(prov.dominant_party_id) }}
                      />
                      <span className="text-xs text-text-secondary">{domParty?.abbr || prov.dominant_party_id}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
