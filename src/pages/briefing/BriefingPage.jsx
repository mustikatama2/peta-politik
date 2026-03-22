import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { generateBriefing } from '../../lib/briefingEngine'
import { PARTY_MAP } from '../../data/parties'
import { PERSONS } from '../../data/persons'
import MetaTags from '../../components/MetaTags'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PERSON_MAP = Object.fromEntries(PERSONS.map(p => [p.id, p]))

function getParty(partyId) {
  return PARTY_MAP[partyId] || { abbr: '—', color: '#6b7280', logo_emoji: '' }
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

function StatusBadge({ status }) {
  const cfg = {
    janji:    { label: 'Janji',    bg: 'bg-blue-500/20',   text: 'text-blue-300',   border: 'border-blue-500/30' },
    proses:   { label: 'Proses',   bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/30' },
    selesai:  { label: 'Selesai',  bg: 'bg-green-500/20',  text: 'text-green-300',  border: 'border-green-500/30' },
    ingkar:   { label: 'Ingkar',   bg: 'bg-red-500/20',    text: 'text-red-400',    border: 'border-red-500/30' },
    batal:    { label: 'Batal',    bg: 'bg-gray-500/20',   text: 'text-gray-400',   border: 'border-gray-500/30' },
    tersangka:{ label: 'Tersangka',bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-500/30' },
    terdakwa: { label: 'Terdakwa', bg: 'bg-red-500/20',    text: 'text-red-300',    border: 'border-red-500/30' },
    terpidana:{ label: 'Terpidana',bg: 'bg-red-700/20',    text: 'text-red-400',    border: 'border-red-700/30' },
  }
  const c = cfg[status?.toLowerCase()] || { label: status || '—', bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' }
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${c.bg} ${c.text} ${c.border}`}>
      {c.label}
    </span>
  )
}

function Avatar({ person, size = 'sm' }) {
  const sz = size === 'md' ? 'w-10 h-10 text-sm' : 'w-8 h-8 text-xs'
  if (person?.photo_url) {
    return (
      <img
        src={person.photo_url}
        alt={person.name}
        className={`${sz} rounded-full object-cover object-top flex-shrink-0 border border-white/10`}
        onError={e => { e.currentTarget.style.display = 'none' }}
      />
    )
  }
  const initials = person?.photo_placeholder || person?.name?.slice(0, 2).toUpperCase() || '??'
  const party = getParty(person?.party_id)
  return (
    <div
      className={`${sz} rounded-full flex items-center justify-center font-bold flex-shrink-0 border border-white/10`}
      style={{ background: party.color || '#374151', color: '#fff' }}
    >
      <span>{initials}</span>
    </div>
  )
}

function SectionHeader({ icon, title, href }) {
  return (
    <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
      <h2 className="text-xs font-bold uppercase tracking-widest text-white/60 flex items-center gap-2">
        <span>{icon}</span>
        <span>{title}</span>
      </h2>
      {href && (
        <Link to={href} className="text-[10px] text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider font-bold">
          Lihat semua →
        </Link>
      )}
    </div>
  )
}

function Card({ children, className = '' }) {
  return (
    <div className={`bg-[#0d1117] border border-white/8 rounded-lg p-4 ${className}`}>
      {children}
    </div>
  )
}

// ─── Section A: Agenda Mendatang ──────────────────────────────────────────────

function AgendaSection({ agendas }) {
  return (
    <Card>
      <SectionHeader icon="📅" title="Agenda Mendatang" href="/agendas" />
      {agendas.length === 0 ? (
        <p className="text-white/40 text-xs text-center py-4">Tidak ada agenda aktif</p>
      ) : (
        <ul className="space-y-2">
          {agendas.map(a => {
            const person = a.subject_type === 'person' ? PERSON_MAP[a.subject_id] : null
            const party  = a.subject_type === 'person' ? getParty(person?.party_id) : getParty(a.subject_id)
            return (
              <li key={a.id} className="flex items-start gap-3 group">
                {/* Year badge */}
                <span
                  className="flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded border border-white/10 text-white/50 mt-0.5"
                >
                  {a.year}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-2 flex-wrap">
                    <span className="text-xs text-white/90 font-medium leading-snug">{a.title}</span>
                    <StatusBadge status={a.status} />
                  </div>
                  {/* Subject chip */}
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    {person ? (
                      <Link
                        to={`/persons/${person.id}`}
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] border border-white/10 hover:border-red-500/50 transition-colors"
                        style={{ background: (party.color || '#374151') + '22', color: party.color || '#9ca3af' }}
                      >
                        <span className="font-semibold">{person.name?.split(' ').slice(0, 1).join(' ')}</span>
                      </Link>
                    ) : (
                      <span className="text-[10px] text-white/30 italic">{a.subject_id}</span>
                    )}
                    {a.progress != null && (
                      <div className="flex items-center gap-1">
                        <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${a.progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-white/40">{a.progress}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}

// ─── Section B: Tokoh dalam Sorotan ───────────────────────────────────────────

function PersonsSection({ persons, rankings }) {
  const rankMap = useMemo(() =>
    Object.fromEntries(rankings.map((r, i) => [r.id, { rank: i + 1, total: r.total }])),
    [rankings]
  )
  return (
    <Card>
      <SectionHeader icon="👤" title="Tokoh dalam Sorotan" href="/persons" />
      {persons.length === 0 ? (
        <p className="text-white/40 text-xs text-center py-4">Tidak ada tokoh terkait</p>
      ) : (
        <ul className="space-y-2.5">
          {persons.map(p => {
            const party = getParty(p.party_id)
            const rank = rankMap[p.id]
            const currentPos = p.positions?.find(pos => pos.is_current)
            return (
              <li key={p.id}>
                <Link
                  to={`/persons/${p.id}`}
                  className="flex items-center gap-3 group hover:bg-white/5 rounded-lg px-2 py-1.5 -mx-2 transition-colors"
                >
                  <Avatar person={p} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-white/90 group-hover:text-white transition-colors">{p.name}</span>
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                        style={{ background: (party.color || '#374151') + '30', color: party.color || '#9ca3af' }}
                      >
                        {party.abbr}
                      </span>
                    </div>
                    <p className="text-[10px] text-white/40 mt-0.5 truncate">
                      {currentPos?.title || '—'}
                    </p>
                  </div>
                  {rank && (
                    <div className="flex-shrink-0 text-right">
                      <div className="text-sm font-bold text-red-400">{rank.total}</div>
                      <div className="text-[10px] text-white/30">poin</div>
                    </div>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}

// ─── Section C: Fakta Hari Ini ────────────────────────────────────────────────

function FactSection({ fact }) {
  if (!fact) return null
  const typeIcon = { trend: '📉', comparison: '⚖️', number: '🔢', quote: '💬' }[fact.visual_type] || '⚡'
  return (
    <Card className="border-yellow-500/20 bg-yellow-900/5">
      <SectionHeader icon="⚡" title="Fakta Hari Ini" href="/quick-facts" />
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <span className="text-xl flex-shrink-0 mt-0.5">{typeIcon}</span>
          <p className="text-sm text-white/85 leading-relaxed">{fact.fact}</p>
        </div>
        {fact.value != null && (
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-yellow-400">{fact.value}</span>
            {fact.unit && <span className="text-xs text-white/40">{fact.unit}</span>}
            {fact.prev_value != null && (
              <span className="text-xs text-white/30">
                (dari {fact.prev_value} sebelumnya)
              </span>
            )}
          </div>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          {fact.category && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40 border border-white/10 uppercase tracking-wider">
              {fact.category}
            </span>
          )}
          {fact.source && (
            <span className="text-[10px] text-white/30 italic">— {fact.source}</span>
          )}
        </div>
      </div>
    </Card>
  )
}

// ─── Section D: Power Ranking Snapshot ───────────────────────────────────────

function RankingSection({ rankings }) {
  return (
    <Card>
      <SectionHeader icon="🏆" title="Power Ranking Snapshot" href="/ranking" />
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/5 text-white/30 text-[10px] uppercase tracking-wider">
            <th className="pb-2 text-left w-6">#</th>
            <th className="pb-2 text-left">Nama</th>
            <th className="pb-2 text-right">Skor</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {rankings.map((r, i) => {
            const party = getParty(r.party_id)
            const person = PERSON_MAP[r.id]
            return (
              <tr key={r.id} className="group hover:bg-white/5 transition-colors">
                <td className="py-1.5 pr-2">
                  <span className={`text-[10px] font-black ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-orange-400' : 'text-white/30'}`}>
                    {i + 1}
                  </span>
                </td>
                <td className="py-1.5">
                  <Link
                    to={`/persons/${r.id}`}
                    className="flex items-center gap-2 group-hover:text-white transition-colors"
                  >
                    <Avatar person={person} size="sm" />
                    <div>
                      <div className="text-white/80 font-medium leading-tight group-hover:text-white">
                        {r.name?.split(' ').slice(0, 2).join(' ')}
                      </div>
                      <div
                        className="text-[9px] font-bold"
                        style={{ color: party.color || '#6b7280' }}
                      >
                        {party.abbr}
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="py-1.5 text-right">
                  <span className="text-red-400 font-bold">{r.total}</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Card>
  )
}

// ─── Section E: Kasus KPK Aktif ──────────────────────────────────────────────

function KPKSection({ cases }) {
  return (
    <Card>
      <SectionHeader icon="⚖️" title="Kasus KPK Aktif" href="/kpk" />
      {cases.length === 0 ? (
        <p className="text-white/40 text-xs text-center py-4">Tidak ada kasus aktif</p>
      ) : (
        <ul className="space-y-3">
          {cases.map(c => {
            const personId = c.suspects?.[0]
            const person = personId ? PERSON_MAP[personId] : null
            return (
              <li key={c.id} className="border-b border-white/5 last:border-0 pb-3 last:pb-0">
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap mb-1">
                      {person && (
                        <Link
                          to={`/persons/${person.id}`}
                          className="text-xs font-semibold text-white/90 hover:text-red-400 transition-colors"
                        >
                          {person.name?.split(' ').slice(0, 2).join(' ')}
                        </Link>
                      )}
                      {!person && personId && (
                        <span className="text-xs font-semibold text-white/70">{personId}</span>
                      )}
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="text-[11px] text-white/50 leading-snug line-clamp-2">{c.charges}</p>
                    {c.losses_idr && (
                      <p className="text-[10px] text-red-400/70 mt-0.5">
                        💸 Rp {(c.losses_idr / 1_000_000_000).toFixed(1)} M
                      </p>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}

// ─── Section F: Tegangan Koalisi ──────────────────────────────────────────────

function TensionSection({ tensions }) {
  return (
    <Card>
      <SectionHeader icon="⚡" title="Tegangan Koalisi" href="/network" />
      {tensions.length === 0 ? (
        <p className="text-white/40 text-xs text-center py-4">Tidak ada konflik terdeteksi</p>
      ) : (
        <ul className="space-y-3">
          {tensions.map((t, i) => {
            const personA = PERSON_MAP[t.from]
            const personB = PERSON_MAP[t.to]
            const strength = t.strength || 5
            return (
              <li key={i} className="border-b border-white/5 last:border-0 pb-3 last:pb-0">
                {/* Persons */}
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 flex-1">
                    <Avatar person={personA} size="sm" />
                    <span className="text-xs text-white/80 font-medium truncate">
                      {personA?.name?.split(' ').slice(0, 2).join(' ') || t.from}
                    </span>
                  </div>
                  <span className="text-white/30 text-xs font-bold flex-shrink-0">vs</span>
                  <div className="flex items-center gap-1.5 flex-1 justify-end">
                    <span className="text-xs text-white/80 font-medium truncate text-right">
                      {personB?.name?.split(' ').slice(0, 2).join(' ') || t.to}
                    </span>
                    <Avatar person={personB} size="sm" />
                  </div>
                </div>
                {/* Label */}
                <p className="text-[11px] text-white/45 mb-1.5 leading-snug">{t.label}</p>
                {/* Strength meter */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${Math.min(100, strength * 10)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-white/30 flex-shrink-0">{strength}/10</span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}

// ─── CTA Strip ────────────────────────────────────────────────────────────────

const CTA_LINKS = [
  { to: '/persons',     icon: '👥', label: 'Tokoh' },
  { to: '/network',     icon: '🕸️', label: 'Jaringan' },
  { to: '/investigasi', icon: '🔍', label: 'Investigasi' },
  { to: '/analitik',    icon: '📈', label: 'Analitik' },
  { to: '/quick-facts', icon: '⚡', label: 'Fakta Cepat' },
]

function CTAStrip() {
  return (
    <div className="bg-[#0d1117] border border-white/8 rounded-lg p-4">
      <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-3">
        Eksplorasi lebih lanjut
      </p>
      <div className="flex flex-wrap gap-2">
        {CTA_LINKS.map(l => (
          <Link
            key={l.to}
            to={l.to}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-red-500/50 hover:bg-red-900/10 text-xs text-white/60 hover:text-white transition-all"
          >
            <span>{l.icon}</span>
            <span>{l.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BriefingPage() {
  const today = useMemo(() => new Date(), [])
  const briefing = useMemo(() => generateBriefing(today), [today])

  return (
    <>
      <MetaTags
        title="Briefing Harian — PetaPolitik"
        description="Ringkasan intelijen politik harian: agenda, kasus KPK, power ranking, dan tegangan koalisi."
      />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {/* Terminal blink cursor */}
              <span className="inline-block w-2 h-4 bg-red-500 animate-pulse rounded-sm" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
                PetaPolitik Intelligence
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
              📋 Briefing Harian
            </h1>
            <p className="text-sm text-white/50 mt-0.5">
              {formatDate(briefing.date)}
            </p>
            <p className="text-[11px] text-white/25 mt-0.5 italic">
              Diperbarui otomatis setiap hari • Data: Maret 2026
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="no-print self-start flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-xs text-white/60 hover:text-white transition-all"
          >
            🖨️ <span>Cetak Briefing</span>
          </button>
        </div>

        {/* ── Divider line ── */}
        <div className="border-t border-dashed border-white/10 relative">
          <span className="absolute -top-2.5 left-0 text-[10px] text-white/20 tracking-widest uppercase bg-bg-app px-2">
            classified: daily digest
          </span>
        </div>

        {/* ── 2-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Column 1 — Main (2/3 width) */}
          <div className="lg:col-span-2 space-y-4">
            <AgendaSection agendas={briefing.upcomingAgendas} />
            <PersonsSection persons={briefing.personsInNews} rankings={briefing.rankings} />
            <FactSection fact={briefing.fact} />
          </div>

          {/* Column 2 — Sidebar (1/3 width) */}
          <div className="space-y-4">
            <RankingSection rankings={briefing.rankings} />
            <KPKSection cases={briefing.recentKPK} />
            <TensionSection tensions={briefing.coalitionTension} />
          </div>
        </div>

        {/* ── CTA Strip ── */}
        <CTAStrip />
      </div>
    </>
  )
}
