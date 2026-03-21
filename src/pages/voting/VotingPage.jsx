import { useState, useMemo } from 'react'
import { BILLS, PARTY_VOTING_SUMMARY, PARTY_NAMES, CATEGORIES } from '../../data/voting_records'
import { PageHeader } from '../../components/ui'

// ── Helper: result config ───────────────────────────────────────────────────
const RESULT_CONFIG = {
  disahkan:     { label: 'Disahkan',      cls: 'bg-red-500/20 text-red-400 border border-red-500/30' },
  ditarik:      { label: 'Ditarik',       cls: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
  dibatalkan_mk:{ label: 'Dibatalkan MK', cls: 'bg-green-500/20 text-green-400 border border-green-500/30' },
  disetujui:    { label: 'Disetujui',     cls: 'bg-red-500/20 text-red-400 border border-red-500/30' },
}

// ── Helper: party position display ──────────────────────────────────────────
const POS_CONFIG = {
  setuju:  { emoji: '✅', cls: 'bg-green-500/20 text-green-400 border border-green-500/30' },
  menolak: { emoji: '❌', cls: 'bg-red-500/20 text-red-400 border border-red-500/30' },
  abstain: { emoji: '🟡', cls: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' },
}

// ── Header Stats ─────────────────────────────────────────────────────────────
function StatsBar() {
  const total = BILLS.length
  const disahkan = BILLS.filter(b => b.result === 'disahkan' || b.result === 'disetujui').length
  const ditolak  = BILLS.filter(b => b.result === 'ditarik' || b.result === 'dibatalkan_mk').length
  const withDemo = BILLS.filter(b =>
    b.controversies.some(c =>
      c.toLowerCase().includes('demo') ||
      c.toLowerCase().includes('gelap') ||
      c.toLowerCase().includes('darurat') ||
      c.toLowerCase().includes('mahasiswa')
    )
  ).length

  const stats = [
    { icon: '🗳️', label: 'Total RUU Dipantau', value: total, cls: 'text-text-primary' },
    { icon: '⚠️', label: 'Disahkan / Disetujui', value: disahkan, cls: 'text-red-400' },
    { icon: '🛡️', label: 'Ditarik / Dibatalkan MK', value: ditolak, cls: 'text-green-400' },
    { icon: '🔥', label: 'Memicu Demo Besar', value: withDemo, cls: 'text-orange-400' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map(s => (
        <div key={s.label} className="bg-bg-card border border-border rounded-xl p-4">
          <div className="text-2xl mb-1">{s.icon}</div>
          <div className={`text-3xl font-bold ${s.cls}`}>{s.value}</div>
          <div className="text-xs text-text-secondary mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  )
}

// ── Vote Bar ─────────────────────────────────────────────────────────────────
function VoteBar({ bill }) {
  const total = bill.votes_for + bill.votes_against + bill.votes_abstain
  if (total === 0) return (
    <div className="text-xs text-text-muted italic mt-2">Data suara tidak tersedia (ditarik sebelum voting)</div>
  )
  const pctFor     = (bill.votes_for / total * 100).toFixed(0)
  const pctAgainst = (bill.votes_against / total * 100).toFixed(0)
  const pctAbstain = (bill.votes_abstain / total * 100).toFixed(0)

  return (
    <div className="mt-3">
      <div className="flex text-[11px] text-text-muted justify-between mb-1">
        <span className="text-green-400">✅ Setuju: {bill.votes_for}</span>
        {bill.votes_against > 0 && <span className="text-red-400">❌ Menolak: {bill.votes_against}</span>}
        {bill.votes_abstain > 0 && <span className="text-yellow-400">🟡 Abstain: {bill.votes_abstain}</span>}
      </div>
      <div className="h-2 rounded-full overflow-hidden flex bg-bg-elevated">
        {bill.votes_for > 0 && (
          <div className="h-full bg-green-500 transition-all" style={{ width: `${pctFor}%` }} />
        )}
        {bill.votes_against > 0 && (
          <div className="h-full bg-red-500 transition-all" style={{ width: `${pctAgainst}%` }} />
        )}
        {bill.votes_abstain > 0 && (
          <div className="h-full bg-yellow-500 transition-all" style={{ width: `${pctAbstain}%` }} />
        )}
      </div>
    </div>
  )
}

// ── Bill Card ─────────────────────────────────────────────────────────────────
function BillCard({ bill }) {
  const result = RESULT_CONFIG[bill.result] || RESULT_CONFIG.disahkan

  return (
    <div className="bg-bg-card border border-border rounded-xl p-5 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-text-primary font-semibold text-sm leading-snug">{bill.title}</h3>
          <p className="text-text-muted text-xs mt-0.5">{new Date(bill.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${result.cls}`}>
          {result.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-text-secondary text-xs leading-relaxed">{bill.description}</p>

      {/* Vote bar */}
      <VoteBar bill={bill} />

      {/* Party positions */}
      <div>
        <p className="text-[11px] text-text-muted mb-1.5 font-medium uppercase tracking-wide">Posisi Fraksi</p>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(bill.party_positions).map(([party, pos]) => {
            const pc = POS_CONFIG[pos]
            return (
              <span key={party} className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${pc.cls}`}>
                {pc.emoji} {PARTY_NAMES[party] || party.toUpperCase()}
              </span>
            )
          })}
        </div>
      </div>

      {/* Controversies */}
      {bill.controversies.length > 0 && (
        <div>
          <p className="text-[11px] text-text-muted mb-1.5 font-medium uppercase tracking-wide">Kontroversi</p>
          <div className="flex flex-wrap gap-1.5">
            {bill.controversies.map(c => (
              <span key={c} className="px-2 py-0.5 rounded-full text-[11px] bg-orange-500/10 text-orange-400 border border-orange-500/20">
                ⚠ {c}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Party Voting Matrix ───────────────────────────────────────────────────────
function PartyMatrix() {
  const parties = Object.keys(PARTY_NAMES)

  return (
    <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="text-text-primary font-bold text-base">📊 Matriks Voting Partai</h2>
        <p className="text-text-secondary text-xs mt-1">Rekam jejak posisi setiap fraksi pada seluruh legislasi yang dipantau</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-text-secondary font-semibold min-w-[100px]">Partai</th>
              {BILLS.map(b => (
                <th key={b.id} className="px-2 py-3 text-center text-text-muted font-medium whitespace-nowrap max-w-[70px]">
                  <div className="truncate" title={b.title}>{b.short}</div>
                  <div className="text-[10px] text-text-muted/60">{b.date.slice(0, 4)}</div>
                </th>
              ))}
              <th className="px-4 py-3 text-center text-text-secondary font-semibold">Skor</th>
            </tr>
          </thead>
          <tbody>
            {parties.map((party, idx) => {
              const summary = PARTY_VOTING_SUMMARY[party] || { setuju: 0, menolak: 0, abstain: 0, total: 0 }
              return (
                <tr key={party} className={`border-b border-border/50 ${idx % 2 === 0 ? 'bg-bg-elevated/30' : ''}`}>
                  <td className="px-4 py-2.5 font-semibold text-text-primary">
                    <div>{PARTY_NAMES[party]}</div>
                    <div className="text-[10px] text-text-muted font-normal">
                      ✅{summary.setuju} ❌{summary.menolak} 🟡{summary.abstain}
                    </div>
                  </td>
                  {BILLS.map(b => {
                    const pos = b.party_positions[party]
                    if (!pos) return <td key={b.id} className="px-2 py-2.5 text-center text-text-muted">➖</td>
                    const pc = POS_CONFIG[pos]
                    return (
                      <td key={b.id} className="px-2 py-2.5 text-center" title={`${PARTY_NAMES[party]}: ${pos}`}>
                        <span title={pos}>{pc.emoji}</span>
                      </td>
                    )
                  })}
                  <td className="px-4 py-2.5 text-center">
                    {summary.total > 0 ? (
                      <div className="text-text-primary font-bold">
                        {Math.round(summary.setuju / summary.total * 100)}%
                        <div className="text-[10px] text-text-muted font-normal">setuju</div>
                      </div>
                    ) : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-border flex flex-wrap gap-4 text-xs text-text-secondary">
        <span>✅ Setuju / mendukung</span>
        <span>❌ Menolak / oposisi</span>
        <span>🟡 Abstain</span>
        <span>➖ Tidak tercatat / tidak hadir</span>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function VotingPage() {
  const [activeCategory, setActiveCategory] = useState('semua')

  const filteredBills = useMemo(() => {
    if (activeCategory === 'semua') return BILLS
    return BILLS.filter(b => b.category === activeCategory)
  }, [activeCategory])

  return (
    <div className="space-y-6">
      <PageHeader
        title="🗳️ Rekam Jejak Voting DPR"
        subtitle={`${BILLS.length} legislasi kontroversial dipantau · Siapa yang membela kepentingan rakyat?`}
      />

      {/* Section 1: Stats */}
      <StatsBar />

      {/* Section 2: Bills */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-text-primary font-bold text-base">📋 Daftar Legislasi</h2>
          <span className="text-text-secondary text-xs">{filteredBills.length} RUU ditampilkan</span>
        </div>

        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat.value
                  ? 'bg-red-500 text-white'
                  : 'bg-bg-card border border-border text-text-secondary hover:text-text-primary hover:border-border'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Bill cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredBills.map(bill => (
            <BillCard key={bill.id} bill={bill} />
          ))}
        </div>

        {filteredBills.length === 0 && (
          <div className="text-center py-16 text-text-secondary">
            <div className="text-5xl mb-4">🗳️</div>
            <p>Tidak ada legislasi dalam kategori ini</p>
          </div>
        )}
      </div>

      {/* Section 3: Party Matrix */}
      <PartyMatrix />
    </div>
  )
}
