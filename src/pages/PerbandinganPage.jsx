/**
 * /perbandingan-tokoh — Advanced 3-way politician comparison
 * Panels: Radar Chart · LHKPN Bars · Network Overlap · Kontroversi · Career Timeline · Summary
 */
import { useState, useMemo, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, Cell,
} from 'recharts'
import { PERSONS } from '../data/persons'
import { PARTY_MAP } from '../data/parties'
import { CONNECTIONS } from '../data/connections'
import { KPK_CASES } from '../data/kpk_cases'
import { PILPRES_2024_POLLS, PILPRES_2029_POLLS, APPROVAL_POLLS } from '../data/polls'
import { scoreIndividu } from '../lib/scoring'
import { Avatar, Badge, Card, Btn, formatIDR, PageHeader } from '../components/ui'

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const PERSON_COLORS = ['#EF4444', '#3B82F6', '#22C55E']
const PERSON_LABELS = ['Tokoh A', 'Tokoh B', 'Tokoh C']

const RISK_CONFIG = {
  rendah:    { label: '✓ Bersih',     bg: '#16A34A22', text: '#22C55E' },
  sedang:    { label: '⚠ Sedang',     bg: '#CA8A0422', text: '#F59E0B' },
  tinggi:    { label: '⚠ Tinggi',     bg: '#DC262622', text: '#EF4444' },
  tersangka: { label: '🔴 Tersangka', bg: '#DC262622', text: '#EF4444' },
  terpidana: { label: '⛔ Terpidana', bg: '#DC262622', text: '#EF4444' },
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

/** Get connections for a person: returns Set of connected IDs */
function getConnSet(personId) {
  return new Set(
    CONNECTIONS
      .filter(c => c.from === personId || c.to === personId)
      .map(c => (c.from === personId ? c.to : c.from))
  )
}

/** Compute survey-based popularity score (0–100) for a person */
function getSurveyScore(personId) {
  // Check APPROVAL_POLLS first
  const approvals = APPROVAL_POLLS.filter(p => p.person_id === personId)
  if (approvals.length > 0) {
    const latest = approvals[approvals.length - 1]
    return Math.round((latest.approval / 100) * 100)
  }
  // Try PILPRES_2029_POLLS (latest entry)
  const poll2029 = [...PILPRES_2029_POLLS].reverse().find(p => p.candidates[personId] != null)
  if (poll2029) return Math.min(100, Math.round(poll2029.candidates[personId] * 2.5))
  // Try PILPRES_2024_POLLS
  const poll2024 = [...PILPRES_2024_POLLS].reverse().find(p => p.candidates[personId] != null)
  if (poll2024) return Math.min(100, Math.round(poll2024.candidates[personId] * 1.7))
  return 20 // default low visibility
}

/** Compute 6-dimension radar data for a person (0–100 each) */
function computeRadarDims(person, connCount, totalScore) {
  const risk = person.analysis?.corruption_risk || 'rendah'
  const risikoScore = { rendah: 90, sedang: 55, tinggi: 25, tersangka: 15, terpidana: 5 }[risk] ?? 50

  const positionScore = Math.min(100, (totalScore.position_score / 40) * 100)
  const networkNorm   = Math.min(100, (connCount / 15) * 100)
  const lhkpnRaw      = person.lhkpn_latest || 0
  const lhkpnScore    = lhkpnRaw > 0 ? Math.min(100, Math.log10(lhkpnRaw / 1_000_000_000) * 22) : 0
  const surveyScore   = getSurveyScore(person.id)
  const influenceScore = Math.min(100, totalScore.total)

  return {
    pengaruh:     Math.round(influenceScore),
    lhkpn:        Math.round(Math.max(0, lhkpnScore)),
    jaringan:     Math.round(networkNorm),
    risiko:       Math.round(risikoScore),   // high = lower risk (cleaner)
    popularitas:  Math.round(surveyScore),
    pengalaman:   Math.round(positionScore),
  }
}

/** Format currency: Rp X Miliar / Triliun */
function formatRupiah(amount) {
  if (!amount || amount === 0) return '—'
  if (amount >= 1_000_000_000_000) return `Rp ${(amount / 1_000_000_000_000).toFixed(2)} Triliun`
  if (amount >= 1_000_000_000) return `Rp ${(amount / 1_000_000_000).toFixed(1)} Miliar`
  if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(0)} Juta`
  return `Rp ${amount.toLocaleString('id-ID')}`
}

/** Build short note list from person analysis + bio */
function getKontroversiList(person) {
  const notes = []
  const track = person.analysis?.track_record || person.analysis?.notes || ''
  if (track) {
    // Split by period or semicolon to get separate items
    const items = track.split(/[.;]/).map(s => s.trim()).filter(s => s.length > 15)
    notes.push(...items.slice(0, 4))
  }
  if (notes.length === 0 && person.bio) {
    notes.push(person.bio.slice(0, 120) + '…')
  }
  return notes
}

/** Get KPK cases for a person */
function getKPKCases(personId) {
  return KPK_CASES.filter(c => c.suspects?.includes(personId))
}

// ─── PERSON SELECTOR ─────────────────────────────────────────────────────────

function PersonSelector({ label, value, onChange, excludeIds = [], optional = false }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return PERSONS
      .filter(p => !excludeIds.includes(p.id))
      .filter(p => !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q))
      .slice(0, 15)
  }, [query, excludeIds])

  const selected = value ? PERSONS.find(p => p.id === value) : null
  const party = selected ? PARTY_MAP[selected.party_id] : null
  const currentPos = selected?.positions?.find(p => p.is_current)

  const clear = useCallback(() => { onChange(null); setQuery('') }, [onChange])

  return (
    <div className="relative flex-1 min-w-0">
      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
        {label}{optional && <span className="ml-1 text-text-muted normal-case">(opsional)</span>}
      </p>
      {selected ? (
        <div
          className="flex items-center gap-3 p-3 bg-bg-card border border-border rounded-xl cursor-pointer hover:border-gray-500 transition-colors"
          onClick={clear}
          title="Klik untuk ganti"
        >
          <Avatar name={selected.name} photoUrl={selected.photo_url} color={party?.color} size="md" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">{selected.name}</p>
            {currentPos && <p className="text-xs text-text-secondary truncate">{currentPos.title}</p>}
            {party && (
              <span className="text-xs px-1.5 py-0.5 rounded font-medium mt-0.5 inline-block"
                style={{ backgroundColor: party.color + '22', color: party.color }}>
                {party.abbr}
              </span>
            )}
          </div>
          <span className="text-text-muted text-xs flex-shrink-0">✕</span>
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
            placeholder={optional ? 'Cari tokoh (opsional)…' : 'Cari nama tokoh…'}
            className="w-full px-4 py-3 bg-bg-card border border-border rounded-xl text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-red transition-colors"
          />
          {open && filtered.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-bg-card border border-border rounded-xl shadow-xl z-20 max-h-64 overflow-y-auto">
              {filtered.map(p => {
                const pt = PARTY_MAP[p.party_id]
                const pos = p.positions?.find(x => x.is_current)
                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-bg-elevated cursor-pointer transition-colors"
                    onMouseDown={() => { onChange(p.id); setQuery(''); setOpen(false) }}
                  >
                    <Avatar name={p.name} photoUrl={p.photo_url} color={pt?.color} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{p.name}</p>
                      {pos && <p className="text-xs text-text-secondary truncate">{pos.title}</p>}
                    </div>
                    {pt && (
                      <span className="text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0"
                        style={{ backgroundColor: pt.color + '22', color: pt.color }}>
                        {pt.abbr}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
          {optional && (
            <p className="text-xs text-text-muted mt-1">Perbandingan 2 orang pun sudah dapat dilakukan</p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── PANEL HEADER ─────────────────────────────────────────────────────────────

function PanelHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
      <span className="text-xl">{icon}</span>
      <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">{title}</h3>
    </div>
  )
}

// ─── PANEL 1: RADAR CHART ────────────────────────────────────────────────────

function RadarPanel({ persons, scores, connCounts }) {
  const radarData = useMemo(() => {
    const dims = [
      { key: 'pengaruh',    label: 'Pengaruh' },
      { key: 'lhkpn',      label: 'LHKPN' },
      { key: 'jaringan',   label: 'Jaringan' },
      { key: 'risiko',     label: 'Anti-Korupsi' },
      { key: 'popularitas',label: 'Popularitas' },
      { key: 'pengalaman', label: 'Pengalaman' },
    ]
    const dimData = persons.map((p, i) =>
      computeRadarDims(p, connCounts[i], scores[i])
    )
    return dims.map(({ key, label }) => {
      const entry = { subject: label, fullMark: 100 }
      persons.forEach((p, i) => { entry[p.name] = dimData[i][key] })
      return entry
    })
  }, [persons, scores, connCounts])

  return (
    <Card className="p-5">
      <PanelHeader icon="🕸️" title="Skor Multidimensi" />
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
          <PolarGrid stroke="#1F2937" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#6B7280', fontSize: 8 }} tickCount={5} />
          {persons.map((p, i) => (
            <Radar
              key={p.id}
              name={p.name.split(' ')[0]}
              dataKey={p.name}
              stroke={PERSON_COLORS[i]}
              fill={PERSON_COLORS[i]}
              fillOpacity={0.15}
              strokeWidth={2}
            />
          ))}
          <Legend wrapperStyle={{ fontSize: 12, color: '#9CA3AF' }} />
          <Tooltip
            contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: '#F9FAFB', fontWeight: 600 }}
            formatter={(v, name) => [`${v}/100`, name]}
          />
        </RadarChart>
      </ResponsiveContainer>
      {/* Score breakdown table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-xs text-center">
          <thead>
            <tr className="text-text-muted border-b border-border">
              <th className="pb-2 text-left">Dimensi</th>
              {persons.map((p, i) => (
                <th key={p.id} className="pb-2 font-semibold" style={{ color: PERSON_COLORS[i] }}>
                  {p.name.split(' ')[0]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {radarData.map(row => (
              <tr key={row.subject} className="border-b border-border/50">
                <td className="py-1.5 text-left text-text-secondary">{row.subject}</td>
                {persons.map((p, i) => (
                  <td key={p.id} className="py-1.5 font-semibold" style={{ color: PERSON_COLORS[i] }}>
                    {row[p.name]}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="font-bold">
              <td className="py-2 text-left text-text-primary">Total Skor</td>
              {persons.map((p, i) => (
                <td key={p.id} className="py-2 text-base" style={{ color: PERSON_COLORS[i] }}>
                  {Math.round(scores[i].total)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// ─── PANEL 2: LHKPN BARS ────────────────────────────────────────────────────

function LHKPNPanel({ persons }) {
  const data = useMemo(() => {
    const amounts = persons.map(p => p.lhkpn_latest || 0)
    const max = Math.max(...amounts, 1)
    return persons.map((p, i) => ({
      name: p.name.split(' ')[0],
      amount: p.lhkpn_latest || 0,
      label: formatRupiah(p.lhkpn_latest),
      year: p.lhkpn_year,
      pct: (p.lhkpn_latest || 0) / max,
      color: PERSON_COLORS[i],
    }))
  }, [persons])

  // Color relative to peers
  function barColor(pct) {
    if (pct >= 0.7) return '#EF4444'
    if (pct >= 0.35) return '#F59E0B'
    return '#22C55E'
  }

  return (
    <Card className="p-5">
      <PanelHeader icon="💰" title="Kekayaan LHKPN" />
      <div className="space-y-4">
        {data.map((d, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-semibold text-text-primary">{d.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold" style={{ color: barColor(d.pct) }}>{d.label}</span>
                {d.year && <span className="text-xs text-text-muted">({d.year})</span>}
                {!d.amount && <span className="text-xs text-text-muted italic">Data tidak tersedia</span>}
              </div>
            </div>
            <div className="w-full bg-bg-elevated rounded-full h-4 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: d.amount ? `${Math.max(d.pct * 100, 2)}%` : '2%',
                  backgroundColor: barColor(d.pct),
                  opacity: d.amount ? 1 : 0.3,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      {/* Mini bar chart */}
      <div className="mt-5">
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 40 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" tick={{ fill: '#9CA3AF', fontSize: 12 }} width={60} />
            <Tooltip
              contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
              formatter={(v) => [formatRupiah(v), 'LHKPN']}
            />
            <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
              {data.map((d, i) => <Cell key={i} fill={PERSON_COLORS[i]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-text-muted mt-2 text-center">Warna: 🟢 rendah &nbsp; 🟡 sedang &nbsp; 🔴 tertinggi (relatif antar tokoh)</p>
    </Card>
  )
}

// ─── PANEL 3: NETWORK OVERLAP (CSS VENN) ─────────────────────────────────────

function NetworkPanel({ persons, connSets, connCounts }) {
  // Only A + B for venn (2-circle). C shown as separate count.
  const [pA, pB, pC] = persons
  const [setA, setB] = connSets

  const shared = useMemo(() => {
    if (!setA || !setB) return []
    return [...setA].filter(id => setB.has(id) && id !== pA?.id && id !== pB?.id)
  }, [setA, setB, pA, pB])

  const sharedPersons = useMemo(() =>
    shared.map(id => PERSONS.find(p => p.id === id)).filter(Boolean).slice(0, 6),
    [shared]
  )

  const onlyA = useMemo(() => {
    if (!setA || !setB) return 0
    return [...setA].filter(id => !setB.has(id)).length
  }, [setA, setB])

  const onlyB = useMemo(() => {
    if (!setA || !setB) return 0
    return [...setB].filter(id => !setA.has(id)).length
  }, [setA, setB])

  if (!pA || !pB) return null

  return (
    <Card className="p-5">
      <PanelHeader icon="🕸️" title="Tumpang-Tindih Jaringan" />

      {/* CSS Venn diagram */}
      <div className="relative flex items-center justify-center h-48 mb-4 select-none">
        {/* Circle A */}
        <div
          className="absolute rounded-full border-2 flex items-center justify-start pl-5 text-xs font-bold"
          style={{
            width: 160, height: 160,
            left: '50%',
            transform: 'translateX(-62%)',
            borderColor: PERSON_COLORS[0],
            backgroundColor: PERSON_COLORS[0] + '18',
            color: PERSON_COLORS[0],
          }}
        >
          <span className="absolute top-4 left-3 max-w-[60px] leading-tight">{pA.name.split(' ')[0]}</span>
          <span className="absolute bottom-4 left-3 text-lg font-black">{connCounts[0]}</span>
        </div>
        {/* Circle B */}
        <div
          className="absolute rounded-full border-2 flex items-center justify-end pr-5 text-xs font-bold"
          style={{
            width: 160, height: 160,
            left: '50%',
            transform: 'translateX(-38%)',
            borderColor: PERSON_COLORS[1],
            backgroundColor: PERSON_COLORS[1] + '18',
            color: PERSON_COLORS[1],
          }}
        >
          <span className="absolute top-4 right-3 max-w-[60px] leading-tight text-right">{pB.name.split(' ')[0]}</span>
          <span className="absolute bottom-4 right-3 text-lg font-black">{connCounts[1]}</span>
        </div>
        {/* Overlap label */}
        <div className="relative z-10 flex flex-col items-center">
          <span className="text-xl font-black text-white">{shared.length}</span>
          <span className="text-xs text-text-muted">bersama</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 text-center mb-4">
        <div className="bg-bg-elevated rounded-lg p-2">
          <p className="text-lg font-bold" style={{ color: PERSON_COLORS[0] }}>{onlyA}</p>
          <p className="text-xs text-text-muted">Eksklusif {pA.name.split(' ')[0]}</p>
        </div>
        <div className="bg-bg-elevated rounded-lg p-2">
          <p className="text-lg font-bold text-white">{shared.length}</p>
          <p className="text-xs text-text-muted">Bersama</p>
        </div>
        <div className="bg-bg-elevated rounded-lg p-2">
          <p className="text-lg font-bold" style={{ color: PERSON_COLORS[1] }}>{onlyB}</p>
          <p className="text-xs text-text-muted">Eksklusif {pB.name.split(' ')[0]}</p>
        </div>
      </div>

      {/* Shared connections list */}
      {sharedPersons.length > 0 && (
        <div className="bg-bg-elevated rounded-xl p-3 mb-3">
          <p className="text-xs text-text-muted mb-2">
            <span className="font-semibold text-text-secondary">Keduanya terhubung dengan:</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {sharedPersons.map(p => (
              <div key={p.id} className="flex items-center gap-1.5 bg-bg-card rounded-full px-2 py-1">
                <Avatar name={p.name} photoUrl={p.photo_url} size="xs" />
                <span className="text-xs text-text-primary">{p.name.split(' ')[0]}</span>
              </div>
            ))}
            {shared.length > 6 && (
              <span className="text-xs text-text-muted flex items-center">+{shared.length - 6} lainnya</span>
            )}
          </div>
        </div>
      )}

      {/* Person C stats if present */}
      {pC && (
        <div className="border-t border-border pt-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary font-medium">{pC.name.split(' ')[0]}</span>
            <span className="text-sm font-bold" style={{ color: PERSON_COLORS[2] }}>
              {connCounts[2]} koneksi
            </span>
          </div>
          {connSets[2] && (
            <p className="text-xs text-text-muted mt-1">
              Berbagi {[...connSets[2]].filter(id => setA?.has(id)).length} koneksi dengan {pA.name.split(' ')[0]},
              &nbsp;{[...connSets[2]].filter(id => setB?.has(id)).length} dengan {pB.name.split(' ')[0]}
            </p>
          )}
        </div>
      )}
    </Card>
  )
}

// ─── PANEL 4: KASUS & KONTROVERSI ────────────────────────────────────────────

function KasusPanel({ persons }) {
  return (
    <Card className="p-5">
      <PanelHeader icon="⚠️" title="Kasus & Kontroversi" />
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${persons.length}, minmax(0, 1fr))` }}
      >
        {persons.map((person, i) => {
          const risk = person.analysis?.corruption_risk || 'rendah'
          const rc = RISK_CONFIG[risk] || RISK_CONFIG.rendah
          const kontroversi = getKontroversiList(person)
          const kpkCases = getKPKCases(person.id)

          return (
            <div key={person.id} className="bg-bg-elevated rounded-xl p-4">
              {/* Person header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: PERSON_COLORS[i] }} />
                <span className="text-sm font-bold text-text-primary truncate">{person.name.split(' ').slice(0, 2).join(' ')}</span>
              </div>

              {/* Risk badge */}
              <div
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold mb-3"
                style={{ backgroundColor: rc.bg, color: rc.text }}
              >
                {rc.label}
              </div>

              {/* KPK cases */}
              {kpkCases.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-red-400 mb-1.5">🔴 Kasus Hukum ({kpkCases.length})</p>
                  {kpkCases.map(c => (
                    <div key={c.id} className="text-xs text-text-secondary mb-1 pl-2 border-l-2 border-red-500/50">
                      <span className="font-medium text-red-400">[{c.status}]</span> {c.title.slice(0, 60)}{c.title.length > 60 ? '…' : ''}
                    </div>
                  ))}
                </div>
              )}

              {/* Kontroversi list */}
              <div>
                <p className="text-xs font-semibold text-text-secondary mb-1.5">📋 Catatan</p>
                {kontroversi.length === 0 ? (
                  <p className="text-xs text-text-muted italic">Tidak ada catatan tersedia.</p>
                ) : (
                  <ul className="space-y-1">
                    {kontroversi.map((item, j) => (
                      <li key={j} className="text-xs text-text-secondary flex gap-1.5">
                        <span className="text-text-muted flex-shrink-0 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

// ─── PANEL 5: KARIER TIMELINE ────────────────────────────────────────────────

function CareerTimelinePanel({ persons }) {
  return (
    <Card className="p-5">
      <PanelHeader icon="📅" title="Linimasa Karier" />
      <div className="space-y-6">
        {persons.map((person, i) => {
          const party = PARTY_MAP[person.party_id]
          const positions = (person.positions || [])
            .slice()
            .sort((a, b) => parseInt(b.start || b.year_start || 0) - parseInt(a.start || a.year_start || 0))
            .slice(0, 6)

          return (
            <div key={person.id}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: PERSON_COLORS[i] }} />
                <span className="text-sm font-bold" style={{ color: PERSON_COLORS[i] }}>
                  {person.name}
                </span>
                {party && (
                  <span className="text-xs px-1.5 py-0.5 rounded font-medium"
                    style={{ backgroundColor: party.color + '22', color: party.color }}>
                    {party.abbr}
                  </span>
                )}
              </div>
              {positions.length === 0 ? (
                <p className="text-xs text-text-muted italic pl-5">Data jabatan tidak tersedia</p>
              ) : (
                <div className="relative pl-5">
                  {/* Vertical line */}
                  <div className="absolute left-1.5 top-0 bottom-0 w-px bg-border" />
                  <div className="space-y-3">
                    {positions.map((pos, j) => {
                      const isCurrent = pos.is_current
                      const start = pos.start || pos.year_start || '?'
                      const end = isCurrent ? 'skrg' : (pos.end || pos.year_end || '?')
                      const dotColor = isCurrent ? PERSON_COLORS[i] : '#374151'

                      return (
                        <div key={j} className="relative flex items-start gap-3">
                          <div
                            className="absolute -left-3.5 w-3 h-3 rounded-full border-2 border-bg-base flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: dotColor, borderColor: isCurrent ? PERSON_COLORS[i] : '#374151' }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-semibold ${isCurrent ? 'text-text-primary' : 'text-text-secondary'}`}>
                              {pos.title}
                            </p>
                            <p className="text-xs text-text-muted">
                              {pos.institution || pos.org} · {start}–{end}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

// ─── PANEL 6: ANALISIS RINGKASAN ─────────────────────────────────────────────

function SummaryPanel({ persons, scores, connCounts }) {
  const text = useMemo(() => {
    if (persons.length < 2) return ''

    const sorted = persons
      .map((p, i) => ({ p, score: scores[i].total, conns: connCounts[i], lhkpn: p.lhkpn_latest || 0 }))
      .sort((a, b) => b.score - a.score)

    const names = persons.map(p => p.name.split(' ')[0]).join(', ')
    const highest = sorted[0]
    const lowest = sorted[sorted.length - 1]
    const mostConns = [...persons.map((p, i) => ({ p, conns: connCounts[i] }))].sort((a, b) => b.conns - a.conns)[0]
    const lhkpnSorted = [...persons.map(p => ({ p, lhkpn: p.lhkpn_latest || 0 }))].sort((a, b) => a.lhkpn - b.lhkpn)
    const lowestLHKPN = lhkpnSorted[0]

    const lines = [
      `Di antara ${names}, **${highest.p.name.split(' ')[0]}** memiliki skor pengaruh tertinggi (${Math.round(highest.score)}/100).`,
      lowestLHKPN.lhkpn > 0
        ? `**${lowestLHKPN.p.name.split(' ')[0]}** tercatat memiliki kekayaan LHKPN paling rendah (${formatRupiah(lowestLHKPN.lhkpn)}).`
        : `**${lowestLHKPN.p.name.split(' ')[0]}** belum memiliki data LHKPN tercatat.`,
      `**${mostConns.p.name.split(' ')[0]}** memiliki jaringan paling luas dengan ${mostConns.conns} koneksi terdata.`,
    ]

    if (persons.length === 3) {
      lines.push(`**${lowest.p.name.split(' ')[0]}** memiliki skor pengaruh terendah (${Math.round(lowest.score)}/100) di antara ketiganya.`)
    }

    return lines
  }, [persons, scores, connCounts])

  // Key stats summary
  const stats = useMemo(() => persons.map((p, i) => ({
    name: p.name.split(' ')[0],
    color: PERSON_COLORS[i],
    score: Math.round(scores[i].total),
    conns: connCounts[i],
    lhkpn: formatRupiah(p.lhkpn_latest),
    risk: p.analysis?.corruption_risk || 'rendah',
    party: PARTY_MAP[p.party_id]?.abbr || 'Independen',
  })), [persons, scores, connCounts])

  return (
    <Card className="p-5">
      <PanelHeader icon="📝" title="Analisis Ringkasan" />

      {/* Key stats grid */}
      <div
        className="grid gap-3 mb-5"
        style={{ gridTemplateColumns: `repeat(${persons.length}, minmax(0, 1fr))` }}
      >
        {stats.map((s, i) => (
          <div key={i} className="bg-bg-elevated rounded-xl p-4 border-t-2" style={{ borderColor: s.color }}>
            <p className="text-sm font-bold mb-3" style={{ color: s.color }}>{s.name}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Skor Total</span>
                <span className="font-bold text-text-primary">{s.score}/100</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Koneksi</span>
                <span className="font-bold text-text-primary">{s.conns}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">LHKPN</span>
                <span className="font-bold text-text-primary text-right max-w-[70%]">{s.lhkpn}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Partai</span>
                <span className="font-bold text-text-primary">{s.party}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Risiko</span>
                <span
                  className="font-bold capitalize"
                  style={{ color: RISK_CONFIG[s.risk]?.text || '#9CA3AF' }}
                >
                  {s.risk}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Auto-generated text */}
      <div className="bg-bg-elevated rounded-xl p-4 border-l-4 border-accent-red">
        <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">🤖 Analisis Otomatis</p>
        {Array.isArray(text) && text.map((line, i) => (
          <p key={i} className="text-sm text-text-secondary mb-2 leading-relaxed">
            {line.split(/\*\*(.+?)\*\*/).map((part, j) =>
              j % 2 === 1
                ? <strong key={j} className="text-text-primary font-semibold">{part}</strong>
                : part
            )}
          </p>
        ))}
      </div>
    </Card>
  )
}

// ─── SHARE BUTTON ─────────────────────────────────────────────────────────────

function ShareButton({ ids }) {
  const [copied, setCopied] = useState(false)

  const handleShare = useCallback(() => {
    const params = new URLSearchParams()
    if (ids[0]) params.set('a', ids[0])
    if (ids[1]) params.set('b', ids[1])
    if (ids[2]) params.set('c', ids[2])
    const url = `${window.location.origin}/perbandingan-tokoh?${params.toString()}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [ids])

  return (
    <Btn
      variant={copied ? 'secondary' : 'primary'}
      onClick={handleShare}
      className="flex items-center gap-2 text-sm"
    >
      {copied ? '✅ Link Tersalin!' : '🔗 Bagikan Perbandingan'}
    </Btn>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function PerbandinganPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [idA, setIdA] = useState(() => searchParams.get('a') || 'prabowo')
  const [idB, setIdB] = useState(() => searchParams.get('b') || 'anies')
  const [idC, setIdC] = useState(() => searchParams.get('c') || 'ahy')

  // Sync URL params when selection changes
  useEffect(() => {
    const params = new URLSearchParams()
    if (idA) params.set('a', idA)
    if (idB) params.set('b', idB)
    if (idC) params.set('c', idC)
    setSearchParams(params, { replace: true })
  }, [idA, idB, idC, setSearchParams])

  const personA = useMemo(() => idA ? PERSONS.find(p => p.id === idA) : null, [idA])
  const personB = useMemo(() => idB ? PERSONS.find(p => p.id === idB) : null, [idB])
  const personC = useMemo(() => idC ? PERSONS.find(p => p.id === idC) : null, [idC])

  const persons = useMemo(() => [personA, personB, personC].filter(Boolean), [personA, personB, personC])
  const hasEnough = persons.length >= 2

  const scores = useMemo(() =>
    persons.map(p => scoreIndividu(p, CONNECTIONS)),
    [persons]
  )

  const connSets = useMemo(() =>
    persons.map(p => getConnSet(p.id)),
    [persons]
  )

  const connCounts = useMemo(() =>
    connSets.map(s => s.size),
    [connSets]
  )

  const excludeA = useMemo(() => [idB, idC].filter(Boolean), [idB, idC])
  const excludeB = useMemo(() => [idA, idC].filter(Boolean), [idA, idC])
  const excludeC = useMemo(() => [idA, idB].filter(Boolean), [idA, idB])

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-8">
      <PageHeader
        title="⚖️ Bandingkan Tokoh"
        subtitle="Perbandingan mendalam 3 tokoh politik: skor pengaruh, kekayaan, jaringan, dan rekam jejak"
      />

      {/* Step 1: Selection */}
      <div className="bg-bg-card border border-border rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-red text-white text-xs font-bold flex items-center justify-center">1</span>
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Pilih Tokoh yang Akan Dibandingkan</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <PersonSelector
            label="Tokoh A"
            value={idA}
            onChange={setIdA}
            excludeIds={excludeA}
          />
          <div className="hidden md:flex items-center text-text-muted text-lg font-light self-center mt-6">vs</div>
          <PersonSelector
            label="Tokoh B"
            value={idB}
            onChange={setIdB}
            excludeIds={excludeB}
          />
          <div className="hidden md:flex items-center text-text-muted text-lg font-light self-center mt-6">vs</div>
          <PersonSelector
            label="Tokoh C"
            value={idC}
            onChange={setIdC}
            excludeIds={excludeC}
            optional
          />
        </div>
        {!hasEnough && (
          <p className="text-xs text-accent-red mt-3 text-center">⚠ Pilih minimal 2 tokoh untuk mulai perbandingan</p>
        )}
      </div>

      {/* Step 2: Dashboard */}
      {hasEnough && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-red text-white text-xs font-bold flex items-center justify-center">2</span>
              <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Dashboard Perbandingan</h2>
            </div>
            <ShareButton ids={[idA, idB, idC]} />
          </div>

          {/* Person chips */}
          <div className="flex flex-wrap gap-3 mb-6">
            {persons.map((p, i) => {
              const party = PARTY_MAP[p.party_id]
              return (
                <div key={p.id} className="flex items-center gap-2 bg-bg-card border border-border rounded-full pl-1 pr-3 py-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PERSON_COLORS[i] }} />
                  <Avatar name={p.name} photoUrl={p.photo_url} color={party?.color} size="xs" />
                  <span className="text-sm font-medium text-text-primary">{p.name}</span>
                  {party && (
                    <span className="text-xs px-1.5 py-0.5 rounded font-medium"
                      style={{ backgroundColor: party.color + '22', color: party.color }}>
                      {party.abbr}
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          <div className="space-y-5">
            {/* Panel 1: Radar */}
            <RadarPanel persons={persons} scores={scores} connCounts={connCounts} />

            {/* Panel 2: LHKPN */}
            <LHKPNPanel persons={persons} />

            {/* Panel 3: Network Overlap */}
            <NetworkPanel
              persons={persons}
              connSets={connSets}
              connCounts={connCounts}
            />

            {/* Panel 4: Kasus & Kontroversi */}
            <KasusPanel persons={persons} />

            {/* Panel 5: Career Timeline */}
            <CareerTimelinePanel persons={persons} />

            {/* Panel 6: Summary */}
            <SummaryPanel persons={persons} scores={scores} connCounts={connCounts} />
          </div>

          {/* Bottom share */}
          <div className="mt-6 flex justify-center">
            <ShareButton ids={[idA, idB, idC]} />
          </div>
        </>
      )}
    </div>
  )
}
