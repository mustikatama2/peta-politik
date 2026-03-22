import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  BILLS,
  LEGISLATION_CATEGORIES,
  PARTY_NAMES,
  getTopControversial,
  getPartyRejectionCount,
  getDemoTriggeredBills,
  getProlegnas2025Stats,
  getProlegnas2025Bills,
} from '../../data/legislation'
import { PageHeader } from '../../components/ui'

// ── Constants ─────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  ruu:        { label: 'RUU',             cls: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
  pembahasan: { label: 'Pembahasan',      cls: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' },
  disahkan:   { label: 'Disahkan',        cls: 'bg-green-500/20 text-green-400 border border-green-500/30' },
  ditolak:    { label: 'Ditolak',         cls: 'bg-red-500/20 text-red-400 border border-red-500/30' },
  ditunda:    { label: 'Ditunda',         cls: 'bg-orange-500/20 text-orange-400 border border-orange-500/30' },
  dicabut:    { label: 'Dicabut/Dibatalkan', cls: 'bg-gray-500/20 text-gray-400 border border-gray-500/30' },
}

const VOTE_CONFIG = {
  setuju:  { label: 'Setuju',  cls: 'bg-green-500/20 text-green-400',  dot: 'bg-green-500' },
  tolak:   { label: 'Tolak',   cls: 'bg-red-500/20 text-red-400',     dot: 'bg-red-500' },
  abstain: { label: 'Abstain', cls: 'bg-yellow-500/20 text-yellow-400', dot: 'bg-yellow-500' },
}

const KANBAN_COLUMNS = [
  { id: 'ruu',        label: 'RUU',         icon: '📋', color: 'border-blue-500/40' },
  { id: 'pembahasan', label: 'Pembahasan',  icon: '💬', color: 'border-yellow-500/40' },
  { id: 'disahkan',   label: 'Disahkan',    icon: '✅', color: 'border-green-500/40' },
  { id: 'ditolak,ditunda', label: 'Ditolak / Ditunda', icon: '⏸️', color: 'border-orange-500/40' },
  { id: 'dicabut',    label: 'Dicabut',     icon: '🚫', color: 'border-gray-500/40' },
]

// ── Helper: controversy color ─────────────────────────────────────────────────
function controversyColor(level) {
  if (level >= 9) return 'bg-red-500'
  if (level >= 7) return 'bg-orange-500'
  if (level >= 5) return 'bg-yellow-500'
  return 'bg-green-500'
}

function controversyTextColor(level) {
  if (level >= 9) return 'text-red-400'
  if (level >= 7) return 'text-orange-400'
  if (level >= 5) return 'text-yellow-400'
  return 'text-green-400'
}

// ── Category badge ────────────────────────────────────────────────────────────
function CategoryBadge({ catId }) {
  const cat = LEGISLATION_CATEGORIES.find(c => c.id === catId)
  if (!cat) return null
  return (
    <span
      className="text-[10px] px-2 py-0.5 rounded-full font-medium border"
      style={{ color: cat.color, borderColor: cat.color + '60', backgroundColor: cat.color + '15' }}
    >
      {cat.label}
    </span>
  )
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.ruu
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${cfg.cls}`}>
      {cfg.label}
    </span>
  )
}

// ── Controversy bar ───────────────────────────────────────────────────────────
function ControversyBar({ level, showLabel = true }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${controversyColor(level)}`}
          style={{ width: `${level * 10}%` }}
        />
      </div>
      {showLabel && (
        <span className={`text-xs font-bold w-4 text-right ${controversyTextColor(level)}`}>{level}</span>
      )}
    </div>
  )
}

// ── Stats strip ───────────────────────────────────────────────────────────────
function StatsStrip() {
  const total      = BILLS.length
  const disahkan   = BILLS.filter(b => b.status === 'disahkan').length
  const pending    = BILLS.filter(b => ['ruu','pembahasan'].includes(b.status)).length
  const kontro     = BILLS.filter(b => b.controversy_level >= 8).length
  const demos      = BILLS.filter(b => b.demo_triggered).length

  const stats = [
    { icon: '📜', label: 'Total Dipantau',    value: total,    cls: 'text-text-primary' },
    { icon: '✅', label: 'Disahkan',           value: disahkan, cls: 'text-green-400' },
    { icon: '💬', label: 'Masih Dibahas',      value: pending,  cls: 'text-yellow-400' },
    { icon: '🔥', label: 'Kontroversi Tinggi', value: kontro,   cls: 'text-red-400' },
    { icon: '✊', label: 'Picu Demo',           value: demos,    cls: 'text-orange-400' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {stats.map(s => (
        <div key={s.label} className="bg-bg-card border border-border rounded-xl p-4">
          <div className="text-xl mb-1">{s.icon}</div>
          <div className={`text-3xl font-bold ${s.cls}`}>{s.value}</div>
          <div className="text-xs text-text-secondary mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  )
}

// ── Prolegnas 2025 Banner ─────────────────────────────────────────────────────
function ProlegnasBanner() {
  const stats = getProlegnas2025Stats()
  const bills = getProlegnas2025Bills()

  return (
    <div className="bg-gradient-to-r from-blue-900/30 via-blue-800/20 to-indigo-900/30 border border-blue-500/30 rounded-2xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-blue-400 font-bold text-xs uppercase tracking-widest">📋 Prolegnas Prioritas 2025</span>
          </div>
          <h3 className="text-lg font-bold text-text-primary">
            {stats.total} RUU dalam daftar prioritas legislasi nasional 2025
          </h3>
          <p className="text-xs text-text-secondary mt-1">
            Ditetapkan oleh DPR RI dan pemerintah sebagai agenda legislasi prioritas tahun 2025
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <div className="text-center bg-green-500/15 border border-green-500/30 rounded-xl px-4 py-3 min-w-[80px]">
            <div className="text-2xl font-bold text-green-400">{stats.disahkan}</div>
            <div className="text-[11px] text-green-300 mt-0.5">Disahkan</div>
          </div>
          <div className="text-center bg-yellow-500/15 border border-yellow-500/30 rounded-xl px-4 py-3 min-w-[80px]">
            <div className="text-2xl font-bold text-yellow-400">{stats.dibahas}</div>
            <div className="text-[11px] text-yellow-300 mt-0.5">Dibahas</div>
          </div>
          <div className="text-center bg-orange-500/15 border border-orange-500/30 rounded-xl px-4 py-3 min-w-[80px]">
            <div className="text-2xl font-bold text-orange-400">{stats.mandek}</div>
            <div className="text-[11px] text-orange-300 mt-0.5">Mandek</div>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-blue-500/20">
        <div className="flex flex-wrap gap-2">
          {bills.map(b => (
            <span key={b.id} className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border"
              style={{
                backgroundColor: b.status === 'disahkan' ? 'rgba(34,197,94,0.1)' :
                                  b.status === 'ditunda' || b.status === 'ditolak' ? 'rgba(249,115,22,0.1)' :
                                  'rgba(234,179,8,0.1)',
                borderColor: b.status === 'disahkan' ? 'rgba(34,197,94,0.3)' :
                             b.status === 'ditunda' || b.status === 'ditolak' ? 'rgba(249,115,22,0.3)' :
                             'rgba(234,179,8,0.3)',
                color: b.status === 'disahkan' ? '#86efac' :
                       b.status === 'ditunda' || b.status === 'ditolak' ? '#fdba74' :
                       '#fde047',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{
                backgroundColor: b.status === 'disahkan' ? '#22c55e' :
                                 b.status === 'ditunda' || b.status === 'ditolak' ? '#f97316' :
                                 '#eab308'
              }} />
              {b.title}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Top 3 Kontroversial Highlight Cards ───────────────────────────────────────
function Top3KontroversialHighlight() {
  const top3 = getTopControversial(3)
  const colors = [
    { bg: 'from-red-900/40 to-red-800/20', border: 'border-red-500/40', badge: 'bg-red-500', text: 'text-red-300', label: '🔥 #1 Paling Kontroversial' },
    { bg: 'from-orange-900/40 to-orange-800/20', border: 'border-orange-500/40', badge: 'bg-orange-500', text: 'text-orange-300', label: '⚠️ #2 Kontroversial' },
    { bg: 'from-amber-900/40 to-amber-800/20', border: 'border-amber-500/40', badge: 'bg-amber-500', text: 'text-amber-300', label: '📢 #3 Kontroversial' },
  ]

  return (
    <div>
      <h2 className="text-lg font-bold text-text-primary mb-4">🔥 RUU/UU Paling Kontroversial</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {top3.map((bill, idx) => {
          const c = colors[idx]
          return (
            <div key={bill.id} className={`bg-gradient-to-br ${c.bg} border ${c.border} rounded-2xl p-5 relative overflow-hidden`}>
              <div className={`absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 ${c.badge}`} style={{ transform: 'translate(30%, -30%)' }} />
              <div className="relative">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${c.text} mb-2 block`}>{c.label}</span>
                <h3 className="text-base font-bold text-text-primary mb-2 leading-tight">{bill.title}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <StatusBadge status={bill.status} />
                  <CategoryBadge catId={bill.category} />
                </div>
                {/* Controversy bar */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-2 bg-black/30 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${c.badge}`} style={{ width: `${bill.controversy_level * 10}%` }} />
                  </div>
                  <span className={`text-sm font-bold ${c.text}`}>{bill.controversy_level}/10</span>
                </div>
                {/* Top criticism */}
                {bill.criticism?.slice(0, 2).map((crit, i) => (
                  <div key={i} className="flex items-start gap-1.5 mb-1.5">
                    <span className={`${c.text} flex-shrink-0 mt-0.5`}>▸</span>
                    <span className="text-xs text-text-secondary leading-relaxed">{crit}</span>
                  </div>
                ))}
                {bill.demo_triggered && (
                  <div className="mt-3 flex items-center gap-1.5 text-orange-400 text-xs font-medium">
                    <span>✊</span> Memicu demonstrasi
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Kanban bill card ──────────────────────────────────────────────────────────
function KanbanCard({ bill, onClick }) {
  return (
    <button
      onClick={() => onClick(bill.id)}
      className="w-full text-left bg-bg-elevated border border-border rounded-lg p-3 hover:border-accent-red/40 transition-all hover:bg-bg-hover"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-text-primary leading-tight line-clamp-2">{bill.title}</span>
        {bill.demo_triggered && <span title="Picu Demo" className="text-orange-400 flex-shrink-0">✊</span>}
      </div>
      <CategoryBadge catId={bill.category} />
      <div className="mt-2">
        <ControversyBar level={bill.controversy_level} />
      </div>
    </button>
  )
}

// ── Kanban pipeline ───────────────────────────────────────────────────────────
function KanbanPipeline({ onSelectBill }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-text-primary mb-4">📊 Status Pipeline Legislasi</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 overflow-x-auto">
        {KANBAN_COLUMNS.map(col => {
          const statuses = col.id.split(',')
          const colBills = BILLS.filter(b => statuses.includes(b.status))
          return (
            <div key={col.id} className={`bg-bg-card border ${col.color} rounded-xl flex flex-col min-h-40`}>
              <div className="px-3 pt-3 pb-2 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-text-primary">{col.icon} {col.label}</span>
                  <span className="text-xs text-text-muted bg-bg-elevated px-2 py-0.5 rounded-full">{colBills.length}</span>
                </div>
              </div>
              <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-80">
                {colBills.length === 0 ? (
                  <p className="text-xs text-text-muted text-center py-4">Kosong</p>
                ) : (
                  colBills.map(bill => (
                    <KanbanCard key={bill.id} bill={bill} onClick={onSelectBill} />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Party voting matrix ───────────────────────────────────────────────────────
function PartyVotingMatrix({ partyVotes }) {
  const entries = Object.entries(partyVotes)
  if (entries.length === 0) return <p className="text-xs text-text-muted italic">Data voting partai belum tersedia</p>

  return (
    <div className="flex flex-wrap gap-2">
      {entries.map(([party, vote]) => {
        const cfg = VOTE_CONFIG[vote] || VOTE_CONFIG.abstain
        return (
          <div key={party} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium ${cfg.cls}`}>
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
            <span>{PARTY_NAMES[party] || party}</span>
          </div>
        )
      })}
    </div>
  )
}

// ── Expanded bill detail ──────────────────────────────────────────────────────
function BillDetail({ bill }) {
  const total = bill.votes_for + bill.votes_against + bill.abstain
  const pctFor     = total ? (bill.votes_for / total * 100) : 0
  const pctAgainst = total ? (bill.votes_against / total * 100) : 0
  const pctAbstain = total ? (bill.abstain / total * 100) : 0

  return (
    <div className="bg-bg-elevated border border-border/60 rounded-xl p-5 mt-2 space-y-5">
      {/* Full title */}
      <div>
        <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Judul Lengkap</p>
        <p className="text-sm text-text-primary font-medium">{bill.full_title}</p>
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-xs text-text-muted mb-0.5">Komite</p>
          <p className="text-text-primary">{bill.committee || '—'}</p>
        </div>
        <div>
          <p className="text-xs text-text-muted mb-0.5">Sponsor</p>
          <p className="text-text-primary capitalize">{(bill.sponsor || []).join(', ') || '—'}</p>
        </div>
        <div>
          <p className="text-xs text-text-muted mb-0.5">Diajukan</p>
          <p className="text-text-primary">{bill.date_submitted || '—'}</p>
        </div>
        <div>
          <p className="text-xs text-text-muted mb-0.5">Disahkan</p>
          <p className="text-text-primary">{bill.date_passed || '—'}</p>
        </div>
      </div>

      {/* Voting bar */}
      {total > 0 && (
        <div>
          <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Hasil Voting DPR</p>
          <div className="flex gap-4 text-xs mb-1.5">
            <span className="text-green-400">✅ Setuju: {bill.votes_for} ({pctFor.toFixed(0)}%)</span>
            {bill.votes_against > 0 && <span className="text-red-400">❌ Menolak: {bill.votes_against} ({pctAgainst.toFixed(0)}%)</span>}
            {bill.abstain > 0 && <span className="text-yellow-400">🟡 Abstain: {bill.abstain} ({pctAbstain.toFixed(0)}%)</span>}
          </div>
          <div className="h-3 rounded-full overflow-hidden flex bg-bg-card">
            {pctFor > 0 && <div className="h-full bg-green-500" style={{ width: `${pctFor}%` }} />}
            {pctAgainst > 0 && <div className="h-full bg-red-500" style={{ width: `${pctAgainst}%` }} />}
            {pctAbstain > 0 && <div className="h-full bg-yellow-500" style={{ width: `${pctAbstain}%` }} />}
          </div>
        </div>
      )}

      {/* Party voting matrix */}
      <div>
        <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Posisi Partai</p>
        <PartyVotingMatrix partyVotes={bill.party_votes || {}} />
      </div>

      {/* Key provisions / criticism / support */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bill.key_provisions?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-blue-400 mb-2">📋 Ketentuan Utama</p>
            <ul className="space-y-1">
              {bill.key_provisions.map((p, i) => (
                <li key={i} className="text-xs text-text-secondary flex gap-2">
                  <span className="text-blue-400 flex-shrink-0 mt-0.5">•</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}
        {bill.criticism?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-red-400 mb-2">⚠️ Kritik</p>
            <ul className="space-y-1">
              {bill.criticism.map((c, i) => (
                <li key={i} className="text-xs text-text-secondary flex gap-2">
                  <span className="text-red-400 flex-shrink-0 mt-0.5">•</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}
        {bill.support?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-green-400 mb-2">✅ Dukungan</p>
            <ul className="space-y-1">
              {bill.support.map((s, i) => (
                <li key={i} className="text-xs text-text-secondary flex gap-2">
                  <span className="text-green-400 flex-shrink-0 mt-0.5">•</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Person chips */}
      {bill.person_ids?.length > 0 && (
        <div>
          <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Tokoh Terkait</p>
          <div className="flex flex-wrap gap-2">
            {bill.person_ids.map(pid => (
              <Link
                key={pid}
                to={`/persons/${pid}`}
                className="text-xs px-2.5 py-1 rounded-full bg-accent-red/10 text-accent-red border border-accent-red/30 hover:bg-accent-red/20 transition-colors"
              >
                👤 {pid}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Demo badge */}
      {bill.demo_triggered && (
        <div className="flex items-center gap-2 text-xs text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2">
          <span>✊</span>
          <span>UU ini memicu demonstrasi massa</span>
        </div>
      )}

      <div className="text-xs text-text-muted">Sumber: {bill.source}</div>
    </div>
  )
}

// ── Bills table ───────────────────────────────────────────────────────────────
function BillsTable({ expandedId, onToggle }) {
  const [search, setSearch]       = useState('')
  const [filterStatus, setStatus] = useState('all')
  const [filterCat, setCat]       = useState('all')
  const [sortBy, setSortBy]       = useState('controversy')

  const filtered = useMemo(() => {
    let list = [...BILLS]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.full_title.toLowerCase().includes(q) ||
        (b.committee || '').toLowerCase().includes(q)
      )
    }
    if (filterStatus !== 'all') list = list.filter(b => b.status === filterStatus)
    if (filterCat !== 'all') list = list.filter(b => b.category === filterCat)
    if (sortBy === 'controversy') list.sort((a, b) => b.controversy_level - a.controversy_level)
    else if (sortBy === 'date') list.sort((a, b) => (b.date_submitted || '').localeCompare(a.date_submitted || ''))
    else if (sortBy === 'title') list.sort((a, b) => a.title.localeCompare(b.title))
    return list
  }, [search, filterStatus, filterCat, sortBy])

  return (
    <div>
      <h2 className="text-lg font-bold text-text-primary mb-4">📋 Daftar UU / RUU</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="🔍 Cari UU, RUU, komisi..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 text-sm rounded-lg border border-border bg-bg-elevated text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-red"
        />
        <select
          value={filterStatus}
          onChange={e => setStatus(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border border-border bg-bg-elevated text-text-primary"
        >
          <option value="all">Semua Status</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <select
          value={filterCat}
          onChange={e => setCat(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border border-border bg-bg-elevated text-text-primary"
        >
          <option value="all">Semua Kategori</option>
          {LEGISLATION_CATEGORIES.map(c => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border border-border bg-bg-elevated text-text-primary"
        >
          <option value="controversy">↓ Kontroversi</option>
          <option value="date">↓ Terbaru</option>
          <option value="title">A–Z Judul</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        {/* Table header */}
        <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-3 border-b border-border bg-bg-elevated text-xs text-text-muted font-semibold uppercase tracking-wider">
          <div className="col-span-4">UU / RUU</div>
          <div className="col-span-2">Kategori</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2">Tanggal</div>
          <div className="col-span-2">Kontroversi</div>
          <div className="col-span-1 text-center">Voting</div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center text-text-muted text-sm">Tidak ada hasil ditemukan</div>
        ) : (
          filtered.map(bill => (
            <div key={bill.id}>
              <button
                onClick={() => onToggle(bill.id)}
                className={`w-full text-left transition-all ${expandedId === bill.id ? 'bg-bg-elevated' : 'hover:bg-bg-hover'}`}
              >
                {/* Mobile layout */}
                <div className="md:hidden px-4 py-3 border-b border-border/40">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-sm font-semibold text-text-primary">{bill.title}</span>
                    <StatusBadge status={bill.status} />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <CategoryBadge catId={bill.category} />
                    {bill.demo_triggered && <span className="text-orange-400 text-xs">✊ Demo</span>}
                  </div>
                  <ControversyBar level={bill.controversy_level} />
                </div>

                {/* Desktop layout */}
                <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-3 border-b border-border/40 items-center">
                  <div className="col-span-4">
                    <div className="flex items-center gap-2">
                      {bill.demo_triggered && <span className="text-orange-400 flex-shrink-0" title="Picu Demo">✊</span>}
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{bill.title}</p>
                        <p className="text-xs text-text-muted line-clamp-1 mt-0.5">{bill.committee || '—'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <CategoryBadge catId={bill.category} />
                  </div>
                  <div className="col-span-1">
                    <StatusBadge status={bill.status} />
                  </div>
                  <div className="col-span-2 text-xs text-text-secondary">
                    <div>{bill.date_submitted || '—'}</div>
                    {bill.date_passed && <div className="text-text-muted">→ {bill.date_passed}</div>}
                  </div>
                  <div className="col-span-2">
                    <ControversyBar level={bill.controversy_level} />
                  </div>
                  <div className="col-span-1 text-center">
                    {bill.votes_for > 0 ? (
                      <span className="text-xs text-green-400">{bill.votes_for}✅</span>
                    ) : (
                      <span className="text-xs text-text-muted">—</span>
                    )}
                  </div>
                </div>
              </button>

              {/* Expanded detail */}
              {expandedId === bill.id && (
                <div className="px-4 pb-4">
                  <BillDetail bill={bill} />
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <p className="text-xs text-text-muted mt-2">{filtered.length} dari {BILLS.length} UU/RUU ditampilkan</p>
    </div>
  )
}

// ── Controversy heatmap (ranked list) ────────────────────────────────────────
function ControversyRanking() {
  const top10 = getTopControversial(10)
  return (
    <div>
      <h2 className="text-lg font-bold text-text-primary mb-4">🔥 Top 10 UU Paling Kontroversial</h2>
      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        {top10.map((bill, idx) => (
          <div key={bill.id} className="flex items-center gap-4 px-4 py-3 border-b border-border/40 last:border-0">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              idx === 0 ? 'bg-red-500 text-white' :
              idx === 1 ? 'bg-orange-500 text-white' :
              idx === 2 ? 'bg-yellow-500 text-black' :
              'bg-bg-elevated text-text-muted'
            }`}>
              {idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-sm font-semibold text-text-primary">{bill.title}</span>
                <StatusBadge status={bill.status} />
                {bill.demo_triggered && <span className="text-orange-400 text-xs">✊</span>}
              </div>
              <div className="w-full h-2 bg-bg-elevated rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${controversyColor(bill.controversy_level)}`}
                  style={{ width: `${bill.controversy_level * 10}%` }}
                />
              </div>
            </div>
            <div className={`text-lg font-bold flex-shrink-0 ${controversyTextColor(bill.controversy_level)}`}>
              {bill.controversy_level}/10
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Analysis section ──────────────────────────────────────────────────────────
function AnalysisSection() {
  const top5        = getTopControversial(5)
  const partyReject = getPartyRejectionCount()
  const demoBills   = getDemoTriggeredBills()

  const maxReject = partyReject[0]?.count || 1

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Top 5 controversial */}
      <div className="bg-bg-card border border-border rounded-xl p-5">
        <h3 className="text-base font-bold text-text-primary mb-4">🔥 UU Paling Kontroversial</h3>
        <div className="space-y-3">
          {top5.map((bill, idx) => (
            <div key={bill.id} className="flex items-center gap-3">
              <span className={`text-xs font-bold w-5 flex-shrink-0 ${controversyTextColor(bill.controversy_level)}`}>
                #{idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-text-primary truncate">{bill.title}</p>
                <ControversyBar level={bill.controversy_level} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Partai paling sering menolak */}
      <div className="bg-bg-card border border-border rounded-xl p-5">
        <h3 className="text-base font-bold text-text-primary mb-4">❌ Partai Paling Sering Menolak</h3>
        {partyReject.length === 0 ? (
          <p className="text-xs text-text-muted italic">Belum ada data</p>
        ) : (
          <div className="space-y-3">
            {partyReject.map(({ party, name, count }) => (
              <div key={party} className="flex items-center gap-3">
                <span className="text-xs text-text-secondary w-16 flex-shrink-0">{name}</span>
                <div className="flex-1 h-5 bg-bg-elevated rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500/70 rounded-full flex items-center justify-end pr-1.5 transition-all"
                    style={{ width: `${(count / maxReject) * 100}%` }}
                  >
                    <span className="text-[10px] font-bold text-white">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Demo dipicu UU */}
      <div className="bg-bg-card border border-border rounded-xl p-5">
        <h3 className="text-base font-bold text-text-primary mb-4">✊ UU yang Memicu Demo</h3>
        <div className="space-y-2">
          {demoBills.map(bill => (
            <div key={bill.id} className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
              <span className="text-text-primary font-medium">{bill.title}</span>
              <StatusBadge status={bill.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function HukumPage() {
  const [expandedId, setExpandedId] = useState(null)

  function handleToggle(id) {
    setExpandedId(prev => prev === id ? null : id)
  }

  function handleSelectBill(id) {
    setExpandedId(id)
    // Scroll to table section
    setTimeout(() => {
      document.getElementById('bills-table-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <PageHeader
          title="⚖️ Tracker Legislasi DPR RI"
          subtitle="Pantau status, kontroversi, dan posisi partai pada setiap UU & RUU yang dibahas DPR"
        />
      </div>

      {/* Stats strip */}
      <StatsStrip />

      {/* Prolegnas 2025 Banner */}
      <ProlegnasBanner />

      {/* Section 1: Kanban pipeline */}
      <div className="bg-bg-card border border-border rounded-2xl p-5">
        <KanbanPipeline onSelectBill={handleSelectBill} />
      </div>

      {/* Section 2: Bills table */}
      <div id="bills-table-section" className="bg-bg-card border border-border rounded-2xl p-5">
        <BillsTable expandedId={expandedId} onToggle={handleToggle} />
      </div>

      {/* Section 2.5: Top 3 Kontroversial Highlight */}
      <div className="bg-bg-card border border-border rounded-2xl p-5">
        <Top3KontroversialHighlight />
      </div>

      {/* Section 3: Controversy ranking */}
      <div className="bg-bg-card border border-border rounded-2xl p-5">
        <ControversyRanking />
      </div>

      {/* Section 4: Analysis */}
      <div className="bg-bg-card border border-border rounded-2xl p-5">
        <h2 className="text-lg font-bold text-text-primary mb-4">📊 Analisis Legislasi</h2>
        <AnalysisSection />
      </div>

      {/* Footer note */}
      <div className="text-xs text-text-muted text-center pb-4">
        Data legislasi dikumpulkan dari sumber publik DPR RI, Sekretariat Negara, dan laporan media independen.
        Controversy level bersifat estimasi berdasarkan liputan media & respons publik.
      </div>
    </div>
  )
}
