import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { KEY_BUMN, DANANTARA_INFO, SECTOR_CONCENTRATION } from '../../data/bumn'
import { POLITICAL_BUSINESS_TIES, COMPANIES } from '../../data/business'
import { PERSONS } from '../../data/persons'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n) => {
  if (!n && n !== 0) return '—'
  if (n >= 1_000_000_000_000_000) return `Rp ${(n / 1_000_000_000_000_000).toFixed(2)}T (kuadriliun)`
  if (n >= 1_000_000_000_000) return `Rp ${(n / 1_000_000_000_000).toFixed(0)}T`
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(0)}M`
  return `Rp ${n.toLocaleString('id-ID')}`
}

const fmtShort = (n) => {
  if (!n && n !== 0) return '—'
  if (n >= 1_000_000_000_000_000) return `${(n / 1_000_000_000_000_000).toFixed(1)} Kuadriliun`
  if (n >= 1_000_000_000_000) return `${(n / 1_000_000_000_000).toFixed(0)}T`
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(0)}M`
  return n.toLocaleString('id-ID')
}

const RISK_CONFIG = {
  tinggi: { label: 'Tinggi', color: 'text-red-400', bg: 'bg-red-900/30 border-red-700/40', dot: '🔴' },
  high:   { label: 'Tinggi', color: 'text-red-400', bg: 'bg-red-900/30 border-red-700/40', dot: '🔴' },
  sedang: { label: 'Sedang', color: 'text-yellow-400', bg: 'bg-yellow-900/30 border-yellow-700/40', dot: '🟡' },
  medium: { label: 'Sedang', color: 'text-yellow-400', bg: 'bg-yellow-900/30 border-yellow-700/40', dot: '🟡' },
  rendah: { label: 'Rendah', color: 'text-green-400', bg: 'bg-green-900/30 border-green-700/40', dot: '🟢' },
  low:    { label: 'Rendah', color: 'text-green-400', bg: 'bg-green-900/30 border-green-700/40', dot: '🟢' },
}

const CONTROVERSY_CONFIG = {
  high:   { label: 'Kontroversi Tinggi', color: 'text-red-400',    bg: 'bg-red-900/20 border-red-800/30' },
  medium: { label: 'Kontroversi Sedang', color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-800/30' },
  low:    { label: 'Bersih',             color: 'text-green-400',   bg: 'bg-green-900/20 border-green-800/30' },
}

const PERSON_MAP = Object.fromEntries(PERSONS.map(p => [p.id, p]))

// ─── Section 0 — KPI Banner ───────────────────────────────────────────────────

function KPIBanner() {
  const totalAssets = KEY_BUMN.reduce((s, b) => s + (b.assets_2023 || 0), 0)
  const totalRevenue = KEY_BUMN.reduce((s, b) => s + (b.revenue_2023 || 0), 0)
  const totalProfit = KEY_BUMN.reduce((s, b) => s + (b.profit_2023 || 0), 0)
  const danantaraTransferCount = KEY_BUMN.filter(b => b.danantara_transfer).length

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {[
        { label: 'Aset Danantara (Klaim)', value: fmt(DANANTARA_INFO.claimed_assets), icon: '🏛️', color: 'text-red-400', bg: 'bg-red-900/20' },
        { label: 'Total Revenue 10 BUMN', value: fmt(totalRevenue), icon: '💰', color: 'text-yellow-400', bg: 'bg-yellow-900/20' },
        { label: 'Total Profit 10 BUMN', value: fmt(totalProfit), icon: '📈', color: 'text-green-400', bg: 'bg-green-900/20' },
        { label: 'BUMN ke Danantara', value: `${danantaraTransferCount} dari 10`, icon: '🔄', color: 'text-blue-400', bg: 'bg-blue-900/20' },
      ].map(({ label, value, icon, color, bg }) => (
        <div key={label} className={`rounded-xl border border-white/10 p-4 ${bg}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{icon}</span>
            <span className="text-xs text-white/50">{label}</span>
          </div>
          <div className={`text-lg font-bold ${color} leading-tight`}>{value}</div>
        </div>
      ))}
    </div>
  )
}

// ─── Section 1 — Danantara Spotlight ──────────────────────────────────────────

function DanantaraSpotlight() {
  const [showTimeline, setShowTimeline] = useState(false)
  const [showComparison, setShowComparison] = useState(false)

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">🏛️</span>
        Danantara — Sovereign Wealth Fund Kontroversial
      </h2>

      <div className="rounded-2xl border border-red-800/40 bg-gradient-to-br from-red-950/60 via-bg-card to-bg-card overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-red-800/30">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-white">{DANANTARA_INFO.name}</h3>
              <p className="text-sm text-white/50 mt-1">
                Didirikan: {DANANTARA_INFO.established} · {DANANTARA_INFO.legal_basis}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 rounded-full bg-red-900/40 border border-red-700/40 text-red-300 text-xs font-medium">
                  ⚠️ Kontroversial
                </span>
                <span className="px-3 py-1 rounded-full bg-yellow-900/40 border border-yellow-700/40 text-yellow-300 text-xs font-medium">
                  🏛️ Presiden = Ketua Pengawas
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-900/40 border border-blue-700/40 text-blue-300 text-xs font-medium">
                  📋 {DANANTARA_INFO.bumn_transferred.length} BUMN Dialihkan
                </span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-3xl font-black text-red-400">
                {fmtShort(DANANTARA_INFO.claimed_assets)}
              </div>
              <div className="text-xs text-white/40">aset diklaim (Rp)</div>
              <div className="text-sm text-white/60 mt-2">CEO: <span className="text-white font-medium">{DANANTARA_INFO.ceo}</span></div>
              <div className="text-sm text-white/60">Ketua: <span className="text-white font-medium">{DANANTARA_INFO.head}</span></div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 grid md:grid-cols-2 gap-6">
          {/* Controversies */}
          <div>
            <h4 className="text-sm font-bold text-red-400 mb-3 uppercase tracking-wide">⚠️ Kontroversi Utama</h4>
            <ul className="space-y-2">
              {DANANTARA_INFO.controversy.map((c, i) => (
                <li key={i} className="flex gap-2 text-sm text-white/80">
                  <span className="text-red-500 flex-shrink-0 mt-0.5">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 p-3 rounded-lg bg-green-900/20 border border-green-800/30">
              <p className="text-xs text-green-300"><span className="font-bold">Posisi Pemerintah:</span> {DANANTARA_INFO.defense}</p>
            </div>
          </div>

          {/* BUMN Transferred */}
          <div>
            <h4 className="text-sm font-bold text-blue-400 mb-3 uppercase tracking-wide">🔄 BUMN yang Dialihkan</h4>
            <div className="flex flex-wrap gap-2">
              {DANANTARA_INFO.bumn_transferred.map(b => (
                <span key={b} className="px-2.5 py-1 rounded-lg bg-blue-900/30 border border-blue-800/40 text-blue-200 text-xs font-medium">
                  {b}
                </span>
              ))}
            </div>

            {/* CEO Background */}
            <div className="mt-4 p-3 rounded-lg bg-yellow-900/20 border border-yellow-800/30">
              <p className="text-xs text-yellow-300 font-bold mb-1">Latar Belakang CEO</p>
              <p className="text-xs text-white/70">{DANANTARA_INFO.ceo_background}</p>
            </div>
          </div>
        </div>

        {/* Timeline toggle */}
        <div className="px-6 pb-6">
          <button
            onClick={() => setShowTimeline(!showTimeline)}
            className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
          >
            {showTimeline ? '▲' : '▼'} {showTimeline ? 'Sembunyikan' : 'Tampilkan'} Kronologi Pembentukan
          </button>

          {showTimeline && (
            <div className="mt-4 space-y-3">
              {DANANTARA_INFO.timeline.map((t, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-24 text-xs text-white/40 pt-0.5">{t.date}</div>
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-400 mt-1.5" />
                  <div className="text-sm text-white/80">{t.event}</div>
                </div>
              ))}
            </div>
          )}

          {/* Comparison toggle */}
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="mt-3 text-sm text-yellow-400 hover:text-yellow-300 font-medium flex items-center gap-1 transition-colors"
          >
            {showComparison ? '▲' : '▼'} {showComparison ? 'Sembunyikan' : 'Bandingkan'} dengan Temasek & Khazanah
          </button>

          {showComparison && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-white/40 border-b border-white/10">
                    <th className="pb-2 pr-4">Lembaga</th>
                    <th className="pb-2 pr-4">Aset (USD)</th>
                    <th className="pb-2">Independensi</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(DANANTARA_INFO.comparison).map((c, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-2 pr-4 text-white font-medium">{c.name}</td>
                      <td className="py-2 pr-4 text-blue-300">
                        ${(c.assets_usd / 1_000_000_000).toFixed(0)}B
                      </td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          c.independence === 'tinggi'
                            ? 'bg-green-900/40 text-green-300'
                            : c.independence === 'sedang'
                            ? 'bg-yellow-900/40 text-yellow-300'
                            : 'bg-red-900/40 text-red-300'
                        }`}>
                          {c.independence}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── Section 2 — Key BUMN Cards ───────────────────────────────────────────────

function BUMNCard({ bumn }) {
  const controversy = CONTROVERSY_CONFIG[bumn.controversy_level] || CONTROVERSY_CONFIG.low

  return (
    <div className="rounded-xl border border-white/10 bg-bg-card hover:border-white/20 transition-all hover:shadow-lg overflow-hidden flex flex-col">
      {/* Card header */}
      <div className="px-4 pt-4 pb-3 border-b border-white/5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl flex-shrink-0">{bumn.sector_icon}</span>
          <div className="min-w-0">
            <h3 className="font-bold text-white text-sm leading-tight truncate" title={bumn.name}>
              {bumn.name}
            </h3>
            <p className="text-xs text-white/40 mt-0.5">{bumn.sector}</p>
          </div>
        </div>
        {bumn.danantara_transfer && (
          <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-red-900/30 border border-red-800/30 text-red-300 text-[10px] font-medium whitespace-nowrap">
            Danantara
          </span>
        )}
      </div>

      {/* Financial data */}
      <div className="px-4 py-3 grid grid-cols-2 gap-3 border-b border-white/5">
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-wide">Revenue 2023</p>
          <p className="text-sm font-bold text-blue-300">{fmtShort(bumn.revenue_2023)}</p>
        </div>
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-wide">Profit 2023</p>
          <p className="text-sm font-bold text-green-300">{fmtShort(bumn.profit_2023)}</p>
        </div>
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-wide">Total Aset</p>
          <p className="text-sm font-bold text-purple-300">{fmtShort(bumn.assets_2023)}</p>
        </div>
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-wide">Karyawan</p>
          <p className="text-sm font-bold text-white/80">{bumn.employees?.toLocaleString('id-ID') || '—'}</p>
        </div>
      </div>

      {/* CEO & oversight */}
      <div className="px-4 py-3 border-b border-white/5">
        <p className="text-[10px] text-white/40 uppercase tracking-wide mb-1">CEO / Direktur Utama</p>
        <p className="text-sm text-white font-medium">{bumn.ceo}</p>
        <p className="text-xs text-white/40 mt-1 leading-snug">{bumn.political_oversight}</p>
      </div>

      {/* Controversy */}
      <div className={`px-4 py-3 flex-1 ${controversy.bg} border-t-0`}>
        <div className="flex items-center gap-1.5 mb-1">
          <span className={`text-[10px] font-bold uppercase tracking-wide ${controversy.color}`}>
            {controversy.label}
          </span>
        </div>
        <p className="text-xs text-white/60 leading-relaxed line-clamp-3">{bumn.controversy}</p>
      </div>

      {/* Key projects (collapsed) */}
      <div className="px-4 py-3 bg-bg-elevated/30">
        <p className="text-[10px] text-white/30 uppercase tracking-wide mb-1.5">Proyek Kunci</p>
        <ul className="space-y-0.5">
          {bumn.key_projects.slice(0, 2).map((p, i) => (
            <li key={i} className="text-xs text-white/50 flex gap-1.5">
              <span className="text-white/20">→</span>{p}
            </li>
          ))}
          {bumn.key_projects.length > 2 && (
            <li className="text-xs text-white/30">+{bumn.key_projects.length - 2} lainnya</li>
          )}
        </ul>
      </div>
    </div>
  )
}

function BUMNGrid() {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">🏢</span>
          10 BUMN Strategis Utama
        </h2>
        <span className="text-xs text-white/40 bg-bg-elevated px-3 py-1.5 rounded-full border border-white/10">
          Data 2023
        </span>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {KEY_BUMN.map(b => <BUMNCard key={b.id} bumn={b} />)}
      </div>
    </section>
  )
}

// ─── Section 3 — Political Business Network ───────────────────────────────────

const RISK_ORDER = { tinggi: 0, high: 0, sedang: 1, medium: 1, rendah: 2, low: 2 }
const COMPANY_MAP = Object.fromEntries(COMPANIES.map(c => [c.id, c]))

function PoliticalNetworkTable() {
  const [sortBy, setSortBy] = useState('risk')
  const [filterRisk, setFilterRisk] = useState('all')
  const [search, setSearch] = useState('')

  const ties = useMemo(() => {
    let data = [...POLITICAL_BUSINESS_TIES]

    if (filterRisk !== 'all') {
      data = data.filter(t =>
        (t.risk === filterRisk) ||
        (filterRisk === 'tinggi' && t.risk === 'high') ||
        (filterRisk === 'sedang' && t.risk === 'medium') ||
        (filterRisk === 'rendah' && t.risk === 'low')
      )
    }

    if (search) {
      const q = search.toLowerCase()
      data = data.filter(t =>
        (t.person_name || '').toLowerCase().includes(q) ||
        (t.company_id || '').toLowerCase().includes(q) ||
        (COMPANY_MAP[t.company_id]?.name || '').toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q)
      )
    }

    if (sortBy === 'risk') {
      data.sort((a, b) => (RISK_ORDER[a.risk] ?? 9) - (RISK_ORDER[b.risk] ?? 9))
    } else if (sortBy === 'type') {
      data.sort((a, b) => (a.tie_type || '').localeCompare(b.tie_type || ''))
    } else if (sortBy === 'person') {
      data.sort((a, b) => {
        const pA = a.person_id ? (PERSON_MAP[a.person_id]?.name || a.person_name || '') : (a.person_name || '')
        const pB = b.person_id ? (PERSON_MAP[b.person_id]?.name || b.person_name || '') : (b.person_name || '')
        return pA.localeCompare(pB)
      })
    }

    return data
  }, [sortBy, filterRisk, search])

  const riskCounts = useMemo(() => {
    const counts = { tinggi: 0, sedang: 0, rendah: 0 }
    POLITICAL_BUSINESS_TIES.forEach(t => {
      const r = t.risk === 'high' ? 'tinggi' : t.risk === 'medium' ? 'sedang' : t.risk === 'low' ? 'rendah' : t.risk
      counts[r] = (counts[r] || 0) + 1
    })
    return counts
  }, [])

  const tieTypeLabel = (t) => ({
    kepemilikan: '🏷️ Kepemilikan',
    hubungan_keluarga: '👨‍👩‍👧 Keluarga',
    kontrak_pemerintah: '📋 Kontrak',
    konflik_jabatan: '⚔️ Konflik Jabatan',
    pengaruh_kebijakan: '📜 Kebijakan',
    konsesi: '🌲 Konsesi',
    jabatan_ex_officio: '🏛️ Ex Officio',
    pengawasan_kementerian: '🔍 Pengawasan',
    kebijakan_impor: '📦 Kebijakan Impor',
    proyek_warisan: '🏗️ Proyek Warisan',
    inisiator_proyek: '💡 Inisiator',
    kebijakan_hilirisasi: '⛏️ Hilirisasi',
  })[t] || t

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">🕸️</span>
        Jaringan Bisnis Politik
        <span className="text-sm font-normal text-white/40">({POLITICAL_BUSINESS_TIES.length} hubungan)</span>
      </h2>

      {/* Risk summary */}
      <div className="flex gap-3 mb-4">
        {[
          { key: 'tinggi', label: 'Risiko Tinggi', dot: '🔴', color: 'text-red-400', bg: 'bg-red-900/20 border-red-800/30' },
          { key: 'sedang', label: 'Risiko Sedang', dot: '🟡', color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-800/30' },
          { key: 'rendah', label: 'Risiko Rendah', dot: '🟢', color: 'text-green-400', bg: 'bg-green-900/20 border-green-800/30' },
        ].map(({ key, label, dot, color, bg }) => (
          <div key={key} className={`px-3 py-2 rounded-lg border ${bg} text-center min-w-[80px]`}>
            <div className="text-xl">{dot}</div>
            <div className={`text-lg font-bold ${color}`}>{riskCounts[key] || 0}</div>
            <div className="text-[10px] text-white/40">{label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <input
          type="text"
          placeholder="Cari politisi atau perusahaan…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] max-w-xs px-3 py-2 rounded-lg bg-bg-elevated border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30"
        />
        <div className="flex gap-2">
          <span className="text-xs text-white/40 self-center">Urutkan:</span>
          {['risk', 'person', 'type'].map(s => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sortBy === s
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'text-white/40 hover:text-white bg-bg-elevated border border-white/5 hover:border-white/15'
              }`}
            >
              {{ risk: 'Risiko', person: 'Politisi', type: 'Jenis' }[s]}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <span className="text-xs text-white/40 self-center">Filter:</span>
          {['all', 'tinggi', 'sedang', 'rendah'].map(f => (
            <button
              key={f}
              onClick={() => setFilterRisk(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterRisk === f
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'text-white/40 hover:text-white bg-bg-elevated border border-white/5 hover:border-white/15'
              }`}
            >
              {{ all: 'Semua', tinggi: '🔴 Tinggi', sedang: '🟡 Sedang', rendah: '🟢 Rendah' }[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-white/40 bg-bg-elevated border-b border-white/10">
                <th className="px-4 py-3 font-medium">Politisi / Pejabat</th>
                <th className="px-4 py-3 font-medium">Perusahaan</th>
                <th className="px-4 py-3 font-medium">Jenis Hubungan</th>
                <th className="px-4 py-3 font-medium">Deskripsi</th>
                <th className="px-4 py-3 font-medium text-center">Risiko</th>
              </tr>
            </thead>
            <tbody>
              {ties.map((tie, i) => {
                const person = tie.person_id ? PERSON_MAP[tie.person_id] : null
                const personName = person?.name || tie.person_name || '—'
                const company = COMPANY_MAP[tie.company_id]
                const companyName = company?.name || tie.company_id
                const riskCfg = RISK_CONFIG[tie.risk] || RISK_CONFIG.rendah

                return (
                  <tr
                    key={i}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors"
                  >
                    <td className="px-4 py-3">
                      {person ? (
                        <Link
                          to={`/persons/${person.id}`}
                          className="text-blue-400 hover:text-blue-300 font-medium hover:underline"
                        >
                          {personName}
                        </Link>
                      ) : (
                        <span className="text-white/80 font-medium">{personName}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white/70 text-xs leading-snug">{companyName}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] text-white/50 whitespace-nowrap">
                        {tieTypeLabel(tie.tie_type)}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-xs text-white/50 leading-relaxed line-clamp-2">{tie.description}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${riskCfg.bg}`}>
                        <span>{riskCfg.dot}</span>
                        <span className={riskCfg.color}>{riskCfg.label}</span>
                      </span>
                    </td>
                  </tr>
                )
              })}
              {ties.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-white/30 text-sm">
                    Tidak ada hubungan yang cocok dengan filter ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

// ─── Section 4 — Sector Concentration Bar Chart ───────────────────────────────

function SectorConcentrationChart() {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <span className="text-2xl">📊</span>
        Konsentrasi Kepentingan Politik per Sektor
      </h2>
      <p className="text-sm text-white/40 mb-5">
        Indeks koneksi politik (0–100) berdasarkan kepemilikan, pengawasan pemerintah, dan kontrak strategis.
      </p>

      <div className="space-y-4">
        {SECTOR_CONCENTRATION.sort((a, b) => b.political_index - a.political_index).map((s) => {
          const pct = s.political_index
          const barColor =
            pct >= 85 ? 'bg-red-500'
            : pct >= 70 ? 'bg-orange-500'
            : 'bg-yellow-500'

          return (
            <div key={s.sector} className="rounded-xl border border-white/10 bg-bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-bold text-white text-sm">{s.sector}</span>
                  <span className="ml-2 text-xs text-white/40">
                    {s.bumn_count} BUMN · {s.swasta_with_ties} swasta terhubung
                  </span>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-black ${
                    pct >= 85 ? 'text-red-400' : pct >= 70 ? 'text-orange-400' : 'text-yellow-400'
                  }`}>
                    {pct}
                  </span>
                  <span className="text-xs text-white/30">/100</span>
                </div>
              </div>

              {/* Bar */}
              <div className="h-3 rounded-full bg-bg-elevated overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all ${barColor}`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/40">
                <span>Dominan: <span className="text-white/60">{s.dominant_party}</span></span>
                <span>Entitas kunci: <span className="text-white/60">{s.key_entities.join(', ')}</span></span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ─── Page Root ────────────────────────────────────────────────────────────────

export default function BUMNPage() {
  const totalAssets = KEY_BUMN.reduce((s, b) => s + (b.assets_2023 || 0), 0)

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-1">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              🏢 BUMN &amp; Korporasi Politik
            </h1>
            <p className="text-white/50 mt-1 text-sm max-w-2xl">
              Peta kekuatan BUMN Indonesia — kepemilikan negara, koneksi politik, Danantara sovereign wealth fund, dan jaringan bisnis-kekuasaan.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="px-4 py-2 rounded-xl bg-blue-900/30 border border-blue-800/40 text-blue-300 text-sm font-bold">
              Total Aset 10 BUMN: {fmtShort(totalAssets)}
            </span>
          </div>
        </div>

        {/* Warning banner */}
        <div className="mt-4 p-3 rounded-lg bg-orange-900/20 border border-orange-800/30 flex gap-2 items-start">
          <span className="text-lg flex-shrink-0">⚠️</span>
          <p className="text-xs text-orange-300 leading-relaxed">
            <span className="font-bold">Peringatan Tata Kelola:</span> Dengan pembentukan Danantara (2025), Rp 900T+ aset BUMN kini berada di bawah pengawasan yang lebih terpusat. Lembaga pemeringkat internasional mempertanyakan independensi dan transparansi pengelolaan.
          </p>
        </div>
      </div>

      <KPIBanner />
      <DanantaraSpotlight />
      <BUMNGrid />
      <PoliticalNetworkTable />
      <SectorConcentrationChart />

      {/* Footer note */}
      <div className="mt-6 p-4 rounded-xl bg-bg-elevated/50 border border-white/5">
        <p className="text-xs text-white/30 text-center">
          Data berdasarkan laporan keuangan BUMN 2023, publikasi Kementerian BUMN, BPK, media investigasi. Angka revenue/aset adalah estimasi atau laporan yang dipublikasikan. Indeks koneksi politik adalah analisis editorial berdasarkan hubungan publik yang terverifikasi.
        </p>
      </div>
    </div>
  )
}
