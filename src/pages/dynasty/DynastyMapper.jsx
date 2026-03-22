import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { DYNASTIES, CROSS_DYNASTY_LINKS } from '../../data/dynasties'
import { PERSONS } from '../../data/persons'

const PERSONS_MAP = Object.fromEntries(PERSONS.map(p => [p.id, p]))

// ── Helpers ───────────────────────────────────────────────────────────────

function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase()
}

function getPowerColor(score, max = 10) {
  const pct = (score / max) * 100
  if (pct >= 75) return '#ef4444'
  if (pct >= 50) return '#f59e0b'
  return '#22c55e'
}

const RELATION_META = {
  patriarch: { label: 'Patriarch', bg: 'rgba(255,255,255,0.15)', icon: '👑' },
  anak:      { label: 'Anak',      bg: 'rgba(99,179,237,0.2)',   icon: '👤' },
  cucu:      { label: 'Cucu',      bg: 'rgba(154,205,50,0.2)',   icon: '👤' },
  cicit:     { label: 'Cicit',     bg: 'rgba(154,205,50,0.15)',  icon: '👤' },
  menantu:   { label: 'Menantu',   bg: 'rgba(236,72,153,0.2)',   icon: '💍' },
  keponakan: { label: 'Keponakan', bg: 'rgba(167,139,250,0.2)',  icon: '🤝' },
  loyalis:   { label: 'Loyalis',   bg: 'rgba(251,191,36,0.2)',   icon: '⚡' },
}

function calcNepotismeIndex(dynasty) {
  const generations = new Set(dynasty.members.map(m => m.generation ?? 0)).size
  const offices = dynasty.political_offices || dynasty.members.filter(m => !m.deceased).length
  return generations * offices
}

function getGenerationLabel(gen) {
  if (gen === 0) return 'G0 — Patriarch'
  if (gen === 1) return 'G1 — Anak / Menantu'
  if (gen === 2) return 'G2 — Cucu'
  return `G${gen} — Generasi ${gen}`
}

// ── Member Node ────────────────────────────────────────────────────────────

function MemberNode({ member, dynasty, compact = false }) {
  const navigate = useNavigate()
  const person = member.person_id ? PERSONS_MAP[member.person_id] : null
  const meta = RELATION_META[member.relation] || RELATION_META.anak
  const powerColor = getPowerColor(member.power || 5)
  const isClickable = !!person

  return (
    <div
      onClick={() => isClickable && navigate(`/persons/${member.person_id}`)}
      style={{
        border: `1px solid ${dynasty.color}44`,
        backgroundColor: 'var(--bg-card, #1e2532)',
        borderRadius: 10,
        padding: compact ? '8px 10px' : '12px 14px',
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'all 0.15s',
        minWidth: compact ? 120 : 150,
        maxWidth: 220,
        position: 'relative',
      }}
      onMouseEnter={e => {
        if (isClickable) {
          e.currentTarget.style.borderColor = dynasty.color
          e.currentTarget.style.transform = 'translateY(-1px)'
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = `${dynasty.color}44`
        e.currentTarget.style.transform = 'none'
      }}
    >
      {/* Avatar + name row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        {/* Avatar circle */}
        <div style={{
          width: compact ? 28 : 36,
          height: compact ? 28 : 36,
          borderRadius: '50%',
          backgroundColor: member.deceased ? '#4b5563' : dynasty.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: compact ? 10 : 12,
          fontWeight: 700,
          color: '#fff',
          flexShrink: 0,
          opacity: member.deceased ? 0.7 : 1,
        }}>
          {member.deceased ? '†' : getInitials(member.name)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: compact ? 11 : 12,
            fontWeight: 600,
            color: 'var(--text-primary, #e2e8f0)',
            lineHeight: 1.2,
            whiteSpace: 'normal',
            wordBreak: 'break-word',
          }}>
            {member.name}
          </div>
        </div>
      </div>

      {/* Relation badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
        <span style={{
          fontSize: 10,
          padding: '1px 6px',
          borderRadius: 10,
          background: meta.bg,
          color: 'var(--text-secondary, #94a3b8)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 3,
        }}>
          {meta.icon} {meta.label}
        </span>
      </div>

      {/* Position */}
      {!compact && (
        <div style={{
          fontSize: 10,
          color: 'var(--text-muted, #64748b)',
          lineHeight: 1.3,
          marginBottom: 6,
        }}>
          {member.position}
        </div>
      )}

      {/* Power score bar */}
      {!compact && member.power && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--text-muted, #64748b)', marginBottom: 2 }}>
            <span>Pengaruh</span>
            <span style={{ color: powerColor }}>{member.power}/10</span>
          </div>
          <div style={{ height: 3, background: '#ffffff10', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(member.power / 10) * 100}%`,
              background: powerColor,
              borderRadius: 3,
            }} />
          </div>
        </div>
      )}

      {/* Clickable indicator */}
      {isClickable && (
        <div style={{
          position: 'absolute', top: 6, right: 6,
          fontSize: 9, color: dynasty.color, opacity: 0.7,
        }}>→</div>
      )}
    </div>
  )
}

// ── CSS Family Tree ─────────────────────────────────────────────────────────
// Hierarchical layout using flex — no D3, no SVG

function CSSFamilyTree({ dynasty }) {
  const byGen = {}
  for (const m of dynasty.members) {
    const g = m.generation ?? 0
    if (!byGen[g]) byGen[g] = []
    byGen[g].push(m)
  }
  const maxGen = Math.max(...Object.keys(byGen).map(Number))
  const generations = Array.from({ length: maxGen + 1 }, (_, i) => i)

  const connectorColor = `${dynasty.color}55`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, overflowX: 'auto', paddingBottom: 8 }}>
      {generations.map((gen, genIdx) => (
        <div key={gen}>
          {/* Vertical connector from generation above */}
          {genIdx > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 0 }}>
              <div style={{ width: 2, height: 24, background: connectorColor }} />
            </div>
          )}

          {/* Generation label */}
          <div style={{
            textAlign: 'center',
            fontSize: 9,
            color: 'var(--text-muted, #64748b)',
            marginBottom: 6,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            {getGenerationLabel(gen)}
          </div>

          {/* Horizontal bar connector (if more than 1 member and there are children) */}
          {(byGen[gen] || []).length > 1 && genIdx > 0 && (
            <div style={{
              position: 'relative',
              height: 2,
              background: connectorColor,
              marginBottom: 6,
              width: '80%',
              marginLeft: 'auto',
              marginRight: 'auto',
            }} />
          )}

          {/* Members row */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            justifyContent: 'center',
          }}>
            {(byGen[gen] || []).map((m, idx) => (
              <MemberNode key={m.person_id || m.name || idx} member={m} dynasty={dynasty} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Timeline ─────────────────────────────────────────────────────────────────

function DynastyTimeline({ dynasty }) {
  if (!dynasty.timeline || dynasty.timeline.length === 0) return null
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary, #94a3b8)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
        ⏱ Kronologi Dinasti
      </div>
      <div style={{ position: 'relative', paddingLeft: 20 }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute', left: 6, top: 8, bottom: 8,
          width: 2, background: `${dynasty.color}44`,
        }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {dynasty.timeline.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              {/* Dot */}
              <div style={{
                position: 'absolute', left: 2,
                width: 10, height: 10, borderRadius: '50%',
                background: dynasty.color,
                marginTop: 3, flexShrink: 0,
                boxShadow: `0 0 0 2px ${dynasty.color}33`,
              }} />
              {/* Content */}
              <div style={{ paddingLeft: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: dynasty.color }}>
                  {item.year}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-secondary, #94a3b8)', marginLeft: 6 }}>
                  {item.event}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Dynasty Expanded Panel ────────────────────────────────────────────────────

function DynastyExpandedPanel({ dynasty }) {
  const [treeView, setTreeView] = useState(true)

  return (
    <div style={{
      border: `1px solid ${dynasty.color}44`,
      borderLeft: `4px solid ${dynasty.color}`,
      borderRadius: 12,
      overflow: 'hidden',
      background: 'var(--bg-card, #1e2532)',
      marginTop: 12,
    }}>
      {/* Panel header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px',
        borderBottom: '1px solid var(--border, #ffffff10)',
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary, #e2e8f0)' }}>
            {dynasty.name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary, #94a3b8)', marginTop: 2 }}>
            {dynasty.combined_influence}
          </div>
        </div>
        {/* View toggle */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[['tree', '🌳 Pohon'], ['list', '👥 Daftar']].map(([v, label]) => (
            <button
              key={v}
              onClick={() => setTreeView(v === 'tree')}
              style={{
                fontSize: 11, padding: '4px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: (treeView ? v === 'tree' : v === 'list') ? dynasty.color : 'var(--bg-elevated, #252d3d)',
                color: (treeView ? v === 'tree' : v === 'list') ? '#fff' : 'var(--text-secondary, #94a3b8)',
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '18px 18px 14px' }}>
        {/* Controversy callout */}
        {dynasty.controversy && (
          <div style={{
            padding: '10px 12px',
            borderRadius: 8,
            background: '#ef444415',
            border: '1px solid #ef444433',
            marginBottom: 16,
            display: 'flex', gap: 8, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>⚠️</span>
            <p style={{ fontSize: 11, color: 'var(--text-secondary, #94a3b8)', lineHeight: 1.5, margin: 0 }}>
              <strong style={{ color: '#ef4444' }}>Kontroversi: </strong>
              {dynasty.controversy}
            </p>
          </div>
        )}

        {/* Tree or list view */}
        {treeView ? (
          <CSSFamilyTree dynasty={dynasty} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {dynasty.members.map((m, i) => (
              <div key={m.person_id || m.name || i} style={{ display: 'flex', alignItems: 'stretch', gap: 10 }}>
                {/* Gen indicator */}
                <div style={{
                  width: 3, borderRadius: 4, flexShrink: 0,
                  background: dynasty.color,
                  opacity: 1 - (m.generation || 0) * 0.2,
                }} />
                <MemberNode member={m} dynasty={dynasty} key={m.person_id || m.name || i} />
              </div>
            ))}
          </div>
        )}

        {/* Timeline */}
        <DynastyTimeline dynasty={dynasty} />
      </div>
    </div>
  )
}

// ── Dynasty Card ────────────────────────────────────────────────────────────

function DynastyCard({ dynasty, isExpanded, onClick }) {
  const powerColor = getPowerColor(dynasty.influence_score)
  const nepIndex = calcNepotismeIndex(dynasty)
  const activeMembers = dynasty.members.filter(m => !m.deceased)
  const maxGen = Math.max(...dynasty.members.map(m => m.generation ?? 0))

  return (
    <div>
      <div
        onClick={onClick}
        style={{
          borderRadius: 12,
          overflow: 'hidden',
          background: 'var(--bg-card, #1e2532)',
          border: isExpanded
            ? `2px solid ${dynasty.color}`
            : '1px solid var(--border, #ffffff15)',
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: isExpanded ? `0 4px 24px ${dynasty.color}33` : 'none',
          transform: isExpanded ? 'translateY(-1px)' : 'none',
        }}
        onMouseEnter={e => {
          if (!isExpanded) e.currentTarget.style.borderColor = `${dynasty.color}88`
        }}
        onMouseLeave={e => {
          if (!isExpanded) e.currentTarget.style.borderColor = 'var(--border, #ffffff15)'
        }}
      >
        {/* Color accent bar */}
        <div style={{ height: 3, background: dynasty.color }} />

        <div style={{ padding: '14px 16px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
            {/* Patriarch avatar */}
            <div style={{
              width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
              background: dynasty.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: '#fff',
              boxShadow: `0 0 0 3px ${dynasty.color}33`,
            }}>
              {getInitials(dynasty.patriarch)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary, #e2e8f0)', lineHeight: 1.2 }}>
                {dynasty.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary, #94a3b8)', marginTop: 2, lineHeight: 1.3 }}>
                {dynasty.patriarch}
              </div>
            </div>
            {/* Influence score badge */}
            <div style={{
              padding: '3px 8px', borderRadius: 10, flexShrink: 0,
              background: `${powerColor}22`, color: powerColor,
              fontSize: 11, fontWeight: 700,
            }}>
              {dynasty.influence_score}/10
            </div>
          </div>

          {/* Influence score bar */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--text-muted, #64748b)', marginBottom: 3 }}>
              <span>Indeks Pengaruh</span>
              <span style={{ color: powerColor }}>{dynasty.influence_score}/10</span>
            </div>
            <div style={{ height: 4, background: '#ffffff10', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${dynasty.influence_score * 10}%`,
                background: `linear-gradient(90deg, ${dynasty.color}, ${powerColor})`,
                borderRadius: 4,
                transition: 'width 0.5s ease',
              }} />
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 12, fontSize: 10, color: 'var(--text-secondary, #94a3b8)', marginBottom: 10 }}>
            <span>👥 {dynasty.members.length} anggota</span>
            <span>⚡ {activeMembers.length} aktif</span>
            <span>🏛️ {dynasty.political_offices} jabatan</span>
            <span>📊 {maxGen + 1} generasi</span>
          </div>

          {/* Nepotisme Index chip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              fontSize: 10, padding: '2px 8px', borderRadius: 10,
              background: nepIndex >= 8 ? '#ef444420' : nepIndex >= 4 ? '#f59e0b20' : '#22c55e20',
              color: nepIndex >= 8 ? '#ef4444' : nepIndex >= 4 ? '#f59e0b' : '#22c55e',
            }}>
              🔗 Indeks Nepotisme: {nepIndex}
            </span>
          </div>

          {/* Expand hint */}
          <div style={{
            marginTop: 10, fontSize: 10, color: isExpanded ? dynasty.color : 'var(--text-muted, #64748b)',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            {isExpanded ? '▲ Tutup detail' : '▼ Lihat detail, pohon keluarga & kronologi'}
          </div>
        </div>
      </div>

      {/* Expanded panel rendered below the card */}
      {isExpanded && <DynastyExpandedPanel dynasty={dynasty} />}
    </div>
  )
}

// ── Peta Dinasti Overview Table ────────────────────────────────────────────

function PetaDinastiTable() {
  const rows = DYNASTIES.map(d => {
    const maxGen = Math.max(...d.members.map(m => m.generation ?? 0))
    const nepIndex = calcNepotismeIndex(d)
    const kontroLevel = d.influence_score >= 8 ? 'Tinggi' : d.influence_score >= 5 ? 'Sedang' : 'Rendah'
    const kontroColor = d.influence_score >= 8 ? '#ef4444' : d.influence_score >= 5 ? '#f59e0b' : '#22c55e'
    return { ...d, maxGen, nepIndex, kontroLevel, kontroColor }
  }).sort((a, b) => b.nepIndex - a.nepIndex)

  return (
    <div style={{
      background: 'var(--bg-card, #1e2532)',
      border: '1px solid var(--border, #ffffff15)',
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border, #ffffff10)' }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary, #94a3b8)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
          🗺 Peta Dinasti — Perbandingan Kekuatan
        </h2>
        <p style={{ fontSize: 11, color: 'var(--text-muted, #64748b)', marginTop: 4 }}>
          Indeks Nepotisme = Generasi × Jabatan Aktif
        </p>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr style={{ background: 'var(--bg-elevated, #252d3d)' }}>
              {['#', 'Dinasti', 'Patriarch', 'Gen.', 'Jabatan', 'Pengaruh', 'Nepotisme', 'Kontroversi'].map(h => (
                <th key={h} style={{
                  padding: '8px 12px', textAlign: h === '#' || h === 'Gen.' || h === 'Jabatan' || h === 'Pengaruh' || h === 'Nepotisme' ? 'center' : 'left',
                  color: 'var(--text-muted, #64748b)',
                  fontWeight: 600,
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                  borderBottom: '1px solid var(--border, #ffffff10)',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((d, idx) => (
              <tr
                key={d.id}
                style={{ borderBottom: '1px solid var(--border, #ffffff08)', transition: 'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated, #252d3d)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Rank */}
                <td style={{ padding: '10px 12px', textAlign: 'center', color: 'var(--text-muted, #64748b)', fontWeight: 700 }}>
                  {idx + 1}
                </td>
                {/* Dynasty name */}
                <td style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-primary, #e2e8f0)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {d.name}
                    </span>
                  </div>
                </td>
                {/* Patriarch */}
                <td style={{ padding: '10px 12px', color: 'var(--text-secondary, #94a3b8)', whiteSpace: 'nowrap' }}>
                  {d.patriarch}
                </td>
                {/* Generations */}
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                  <span style={{
                    padding: '2px 7px', borderRadius: 8,
                    background: `${d.color}22`, color: d.color,
                    fontWeight: 700, whiteSpace: 'nowrap',
                  }}>
                    {d.maxGen + 1}
                  </span>
                </td>
                {/* Offices */}
                <td style={{ padding: '10px 12px', textAlign: 'center', color: 'var(--text-secondary, #94a3b8)' }}>
                  {d.political_offices}
                </td>
                {/* Influence */}
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                    <div style={{ width: 48, height: 4, background: '#ffffff10', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${d.influence_score * 10}%`,
                        background: d.color, borderRadius: 4,
                      }} />
                    </div>
                    <span style={{ color: getPowerColor(d.influence_score), fontWeight: 700, minWidth: 20 }}>
                      {d.influence_score}
                    </span>
                  </div>
                </td>
                {/* Nepotisme Index */}
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                  <span style={{
                    padding: '2px 8px', borderRadius: 8, fontWeight: 700,
                    background: d.nepIndex >= 8 ? '#ef444420' : d.nepIndex >= 4 ? '#f59e0b20' : '#22c55e20',
                    color: d.nepIndex >= 8 ? '#ef4444' : d.nepIndex >= 4 ? '#f59e0b' : '#22c55e',
                  }}>
                    {d.nepIndex}
                  </span>
                </td>
                {/* Controversy level */}
                <td style={{ padding: '10px 12px' }}>
                  <span style={{
                    fontSize: 10, padding: '2px 8px', borderRadius: 8,
                    background: `${d.kontroColor}20`, color: d.kontroColor,
                    whiteSpace: 'nowrap',
                  }}>
                    {d.kontroLevel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Cross-Dynasty Connections ──────────────────────────────────────────────

function CrossDynastySection() {
  const getDynasty = id => DYNASTIES.find(d => d.id === id)

  return (
    <div style={{
      background: 'var(--bg-card, #1e2532)',
      border: '1px solid var(--border, #ffffff15)',
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border, #ffffff10)' }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary, #94a3b8)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
          🔗 Koneksi Antar-Dinasti
        </h2>
        <p style={{ fontSize: 11, color: 'var(--text-muted, #64748b)', marginTop: 4 }}>
          Tumpang tindih kepentingan, koalisi, dan hubungan kekeluargaan antar klan politik
        </p>
      </div>

      <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {CROSS_DYNASTY_LINKS.map((link, i) => {
          const from = getDynasty(link.from_dynasty)
          const to = getDynasty(link.to_dynasty)
          if (!from || !to) return null
          const isConflict = link.type.includes('Konflik') || link.type.includes('Eks')

          return (
            <div key={i} style={{
              padding: '12px 14px',
              borderRadius: 10,
              border: `1px solid ${isConflict ? '#ef444430' : '#22c55e30'}`,
              background: isConflict ? '#ef444408' : '#22c55e08',
              display: 'flex', alignItems: 'flex-start', gap: 12,
            }}>
              {/* Icon */}
              <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{link.icon}</span>

              {/* Dynasty badges + arrow */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                  <span style={{
                    fontSize: 10, padding: '2px 8px', borderRadius: 8, fontWeight: 600,
                    background: `${from.color}22`, color: from.color,
                  }}>
                    {from.name}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted, #64748b)' }}>—</span>
                  <span style={{
                    fontSize: 10, padding: '2px 8px', borderRadius: 8, fontWeight: 600,
                    background: isConflict ? '#ef444420' : '#ffffff15',
                    color: isConflict ? '#ef4444' : 'var(--text-secondary, #94a3b8)',
                  }}>
                    {link.type}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted, #64748b)' }}>—</span>
                  <span style={{
                    fontSize: 10, padding: '2px 8px', borderRadius: 8, fontWeight: 600,
                    background: `${to.color}22`, color: to.color,
                  }}>
                    {to.name}
                  </span>
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-secondary, #94a3b8)', margin: 0, lineHeight: 1.5 }}>
                  {link.description}
                </p>
              </div>

              {/* Weight dots */}
              <div style={{ display: 'flex', gap: 3, flexShrink: 0, marginTop: 3 }}>
                {Array.from({ length: 3 }, (_, j) => (
                  <div key={j} style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: j < link.weight
                      ? (isConflict ? '#ef4444' : '#22c55e')
                      : '#ffffff15',
                  }} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Power Chart Tooltip ─────────────────────────────────────────────────────

function PowerTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const dynasty = DYNASTIES.find(d => d.name === label)
  return (
    <div style={{
      background: 'var(--bg-card, #1e2532)',
      border: '1px solid var(--border, #ffffff20)',
      borderRadius: 8, padding: '8px 12px',
      fontSize: 11, boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
    }}>
      <p style={{ fontWeight: 700, color: 'var(--text-primary, #e2e8f0)', marginBottom: 4 }}>{label}</p>
      <p style={{ color: dynasty?.color || '#fff', margin: 0 }}>
        Pengaruh: {payload[0].value}/10
      </p>
      {dynasty && (
        <p style={{ color: 'var(--text-muted, #64748b)', margin: '4px 0 0', fontSize: 10 }}>
          Nepotisme Index: {calcNepotismeIndex(dynasty)}
        </p>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────

export default function DynastyMapper() {
  const [expandedId, setExpandedId] = useState(null)

  const chartData = DYNASTIES.map(d => ({
    name: d.name.replace('Dinasti ', '').replace('Keluarga ', '').replace(' (Soeharto)', '').replace(' (Sultan HB X)', '').replace(' (Fuad Amin)', ''),
    power: d.influence_score,
    color: d.color,
  }))

  const totalOffices = DYNASTIES.reduce((s, d) => s + d.political_offices, 0)
  const totalMembers = DYNASTIES.reduce((s, d) => s + d.members.length, 0)
  const avgNep = (DYNASTIES.reduce((s, d) => s + calcNepotismeIndex(d), 0) / DYNASTIES.length).toFixed(1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary, #e2e8f0)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            🌳 Peta Dinasti Politik Indonesia
          </h1>
          <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: 13, marginTop: 4, marginBottom: 0 }}>
            Jaringan kekuasaan keluarga — dari Orde Lama hingga Reformasi 2024
          </p>
        </div>
        {/* Quick stats */}
        <div style={{
          display: 'flex', gap: 10, flexWrap: 'wrap',
        }}>
          {[
            ['🏛️', DYNASTIES.length, 'Dinasti'],
            ['👥', totalMembers, 'Tokoh'],
            ['💼', totalOffices, 'Jabatan'],
            ['📊', avgNep, 'Avg. Nepotisme'],
          ].map(([icon, val, label]) => (
            <div key={label} style={{
              background: 'var(--bg-card, #1e2532)',
              border: '1px solid var(--border, #ffffff15)',
              borderRadius: 10, padding: '8px 14px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 16 }}>{icon}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary, #e2e8f0)', lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 1: Peta Dinasti Overview Table ── */}
      <PetaDinastiTable />

      {/* ── Section 2: Dynasty Cards ── */}
      <section>
        <h2 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary, #94a3b8)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
          Profil Dinasti — Klik untuk detail, pohon keluarga & kronologi
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 14,
        }}>
          {DYNASTIES.map(dynasty => (
            <DynastyCard
              key={dynasty.id}
              dynasty={dynasty}
              isExpanded={expandedId === dynasty.id}
              onClick={() => setExpandedId(expandedId === dynasty.id ? null : dynasty.id)}
            />
          ))}
        </div>
      </section>

      {/* ── Section 3: Power Comparison Chart ── */}
      <section style={{
        background: 'var(--bg-card, #1e2532)',
        border: '1px solid var(--border, #ffffff15)',
        borderRadius: 12,
        padding: '18px 18px 10px',
      }}>
        <h2 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary, #94a3b8)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16, margin: '0 0 16px' }}>
          📊 Perbandingan Indeks Pengaruh
        </h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 70 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#94a3b8', fontSize: 9 }}
              angle={-40}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              domain={[0, 10]}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              label={{ value: 'Pengaruh', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }}
            />
            <Tooltip content={<PowerTooltip />} />
            <Bar dataKey="power" radius={[4, 4, 0, 0]} maxBarSize={56}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* ── Section 4: Cross-Dynasty Connections ── */}
      <CrossDynastySection />

      {/* ── Section 5: Analyst Notes ── */}
      <section style={{
        background: 'var(--bg-card, #1e2532)',
        border: '1px solid var(--border, #ffffff15)',
        borderRadius: 12,
        padding: '18px',
      }}>
        <h2 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary, #94a3b8)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
          🔍 Catatan Analis
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            {
              icon: '⚠️', color: '#FF6B35',
              text: 'Dinasti Jokowi memiliki Nepotisme Index tertinggi di antara dinasti baru: Wakil Presiden, Gubernur Sumut, dan Ketum PSI — semua dari satu keluarga dalam 10 tahun.',
            },
            {
              icon: '👑', color: '#C8102E',
              text: 'Dinasti Soekarno adalah satu-satunya dinasti yang mencakup 3+ generasi aktif dalam jabatan formal sekaligus (Megawati, Puan, Prananda) — fondasi ideologis terkuat.',
            },
            {
              icon: '💀', color: '#5D4037',
              text: 'Keluarga Cendana membuktikan bahwa kejatuhan dinasti tidak harus berarti hilangnya pengaruh — bisnis Cendana masih relevan, dan Prabowo (ex-menantu) kini Presiden.',
            },
            {
              icon: '🏛️', color: '#795548',
              text: 'Pola dinasti lokal seperti Bangkalan menunjukkan bahwa korupsi tidak selalu menghentikan transmisi kekuasaan keluarga — basis massa keagamaan lebih kuat dari vonis pengadilan.',
            },
            {
              icon: '👑', color: '#FFD700',
              text: 'DIY adalah anomali demokrasi: satu-satunya provinsi di mana kepala daerah tidak dipilih rakyat — berdasarkan UU Keistimewaan 2012.',
            },
            {
              icon: '🔄', color: '#4CAF50',
              text: '"Bapak Reformasi" Amien Rais yang dulu menentang Soeharto kini membangun dinasti sendiri di PAN — ironi reformasi yang tidak selesai.',
            },
          ].map((note, i) => (
            <div key={i} style={{
              padding: '10px 12px',
              borderRadius: 8,
              border: `1px solid ${note.color}33`,
              background: `${note.color}0d`,
              display: 'flex', gap: 10, alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 15, flexShrink: 0 }}>{note.icon}</span>
              <p style={{ fontSize: 12, color: 'var(--text-secondary, #94a3b8)', lineHeight: 1.6, margin: 0 }}>{note.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
