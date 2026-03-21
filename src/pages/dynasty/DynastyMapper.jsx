import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import * as d3 from 'd3'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { DYNASTIES } from '../../data/dynasties'
import { PERSONS } from '../../data/persons'

const PERSONS_MAP = Object.fromEntries(PERSONS.map(p => [p.id, p]))

// Build a d3-compatible hierarchy from flat dynasty members
function buildHierarchyData(dynasty) {
  const members = dynasty.members
  const byGen = {}
  for (const m of members) {
    if (!byGen[m.generation]) byGen[m.generation] = []
    byGen[m.generation].push(m)
  }

  const gen0 = byGen[0] || []
  const gen1 = byGen[1] || []
  const gen2 = byGen[2] || []

  // Distribute gen2 among gen1 as children (round-robin)
  const gen1WithChildren = gen1.map((m, i) => ({
    ...m,
    children: gen2.filter((_, j) => j % gen1.length === i)
  }))

  // If single root, attach gen1 directly; if multiple gen0, use virtual root
  if (gen0.length === 1) {
    return {
      ...gen0[0],
      id: gen0[0].person_id,
      children: gen1WithChildren.length > 0 ? gen1WithChildren : undefined
    }
  }

  // Multiple gen0: virtual root node
  return {
    person_id: dynasty.id,
    id: dynasty.id,
    relation: dynasty.name,
    _virtual: true,
    children: gen0.map(m => ({
      ...m,
      children: gen1WithChildren.length > 0 && m.is_root ? gen1WithChildren : undefined
    }))
  }
}

function getPowerColor(value) {
  if (value >= 75) return '#ef4444'
  if (value >= 50) return '#f59e0b'
  return '#22c55e'
}

// ── D3 Tree Component ──────────────────────────────────────────────────────
function DynastyTree({ dynasty }) {
  const svgRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!svgRef.current || !dynasty) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const container = svgRef.current.parentElement
    const W = container.clientWidth || 700
    const H = 380
    const margin = { top: 40, right: 20, bottom: 20, left: 20 }
    const innerW = W - margin.left - margin.right
    const innerH = H - margin.top - margin.bottom

    svg.attr('width', W).attr('height', H)

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const hierarchyData = buildHierarchyData(dynasty)
    const root = d3.hierarchy(hierarchyData, d => d.children)

    const treeLayout = d3.tree().size([innerW, innerH - 40])
    treeLayout(root)

    // Links
    g.selectAll('.link')
      .data(root.links())
      .join('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', dynasty.color + '55')
      .attr('stroke-width', 2)
      .attr('d', d3.linkVertical()
        .x(d => d.x)
        .y(d => d.y)
      )

    // Nodes
    const node = g.selectAll('.node')
      .data(root.descendants())
      .join('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .style('cursor', d => !d.data._virtual ? 'pointer' : 'default')
      .on('click', (event, d) => {
        if (!d.data._virtual && d.data.person_id) {
          const person = PERSONS_MAP[d.data.person_id]
          if (person) navigate(`/persons/${d.data.person_id}`)
        }
      })

    // Circle
    node.append('circle')
      .attr('r', d => d.depth === 0 ? 18 : d.depth === 1 ? 13 : 10)
      .attr('fill', d => d.data.deceased ? '#6b7280' : dynasty.color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('opacity', d => d.data._virtual ? 0 : 1)

    // Name label
    node.append('text')
      .attr('dy', d => d.depth === 0 ? -24 : -16)
      .attr('text-anchor', 'middle')
      .attr('font-size', d => d.depth === 0 ? 12 : 10)
      .attr('font-weight', d => d.depth === 0 ? 'bold' : 'normal')
      .attr('fill', '#e2e8f0')
      .text(d => {
        if (d.data._virtual) return ''
        const person = PERSONS_MAP[d.data.person_id]
        const name = person?.name || d.data.person_id
        // Truncate long names
        return name.length > 14 ? name.slice(0, 12) + '…' : name
      })

    // Relation label (below circle)
    node.append('text')
      .attr('dy', d => d.depth === 0 ? 32 : 26)
      .attr('text-anchor', 'middle')
      .attr('font-size', 8)
      .attr('fill', '#94a3b8')
      .each(function(d) {
        if (d.data._virtual) return
        const relation = d.data.relation || ''
        // Split long relations to 2 lines
        const words = relation.split(' ')
        const mid = Math.ceil(words.length / 2)
        const line1 = words.slice(0, mid).join(' ')
        const line2 = words.slice(mid).join(' ')
        d3.select(this).text(line1)
        if (line2) {
          d3.select(this.parentNode).append('text')
            .attr('dy', d.depth === 0 ? 42 : 36)
            .attr('text-anchor', 'middle')
            .attr('font-size', 8)
            .attr('fill', '#94a3b8')
            .text(line2)
        }
      })

    // Deceased marker
    node.filter(d => d.data.deceased)
      .append('text')
      .attr('dy', 4)
      .attr('text-anchor', 'middle')
      .attr('font-size', 9)
      .attr('fill', '#fff')
      .text('†')

  }, [dynasty, navigate])

  return (
    <div className="w-full overflow-x-auto">
      <svg ref={svgRef} className="w-full" />
    </div>
  )
}

// ── Dynasty Card ──────────────────────────────────────────────────────────
function DynastyCard({ dynasty, isSelected, onClick }) {
  const powerColor = getPowerColor(dynasty.power_index)
  const currentMembers = dynasty.members.filter(m => !m.deceased)

  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl border cursor-pointer transition-all duration-200 overflow-hidden ${
        isSelected
          ? 'border-2 shadow-lg scale-[1.02]'
          : 'border-border hover:border-border-strong hover:shadow-md'
      } bg-bg-card`}
      style={isSelected ? { borderColor: dynasty.color, boxShadow: `0 4px 24px ${dynasty.color}33` } : {}}
    >
      {/* Color accent top bar */}
      <div className="h-1.5 w-full" style={{ backgroundColor: dynasty.color }} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-bold text-text-primary text-sm leading-tight">{dynasty.name}</h3>
            <p className="text-xs text-text-secondary mt-0.5 leading-snug">{dynasty.description}</p>
          </div>
          <span
            className="text-xs font-bold px-2 py-1 rounded-full flex-shrink-0"
            style={{ backgroundColor: powerColor + '22', color: powerColor }}
          >
            {dynasty.power_index}
          </span>
        </div>

        {/* Power index bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-[10px] text-text-muted mb-1">
            <span>Power Index</span>
            <span style={{ color: powerColor }}>{dynasty.power_index}/100</span>
          </div>
          <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${dynasty.power_index}%`, backgroundColor: powerColor }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs text-text-secondary mb-3">
          <span>👥 {dynasty.members.length} anggota</span>
          <span>⚡ {currentMembers.length} aktif</span>
          <span>🏛️ {dynasty.key_positions.length} posisi</span>
        </div>

        {/* Key positions */}
        <div className="space-y-1">
          {dynasty.key_positions.slice(0, 2).map((pos, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[11px] text-text-secondary">
              <span style={{ color: dynasty.color }}>▸</span>
              <span className="truncate">{pos}</span>
            </div>
          ))}
          {dynasty.key_positions.length > 2 && (
            <div className="text-[10px] text-text-muted">+{dynasty.key_positions.length - 2} lainnya</div>
          )}
        </div>

        {/* Notes (expanded) */}
        {isSelected && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-text-secondary italic leading-relaxed">{dynasty.notes}</p>
          </div>
        )}
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div
          className="absolute top-3 right-3 w-2 h-2 rounded-full"
          style={{ backgroundColor: dynasty.color }}
        />
      )}
    </div>
  )
}

// ── Member List ───────────────────────────────────────────────────────────
function MemberList({ dynasty }) {
  const navigate = useNavigate()

  return (
    <div className="space-y-2">
      {dynasty.members.map(member => {
        const person = PERSONS_MAP[member.person_id]
        const name = person?.name || member.person_id.replace(/_/g, ' ')
        const currentPos = person?.positions?.find(p => p.is_current)

        return (
          <div
            key={member.person_id}
            onClick={() => person && navigate(`/persons/${member.person_id}`)}
            className={`flex items-center gap-3 p-3 rounded-lg border border-border bg-bg-elevated transition-all ${
              person ? 'cursor-pointer hover:border-border-strong hover:bg-bg-hover' : 'opacity-60'
            }`}
          >
            {/* Generation badge */}
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: dynasty.color + (member.generation === 0 ? 'ff' : member.generation === 1 ? 'cc' : '88') }}
            >
              G{member.generation}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-text-primary truncate">{name}</span>
                {member.deceased && <span className="text-xs text-text-muted">†</span>}
                {member.is_root && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: dynasty.color + '22', color: dynasty.color }}>
                    Patriarch
                  </span>
                )}
              </div>
              <p className="text-xs text-text-secondary truncate">{member.relation}</p>
              {currentPos && (
                <p className="text-[11px] text-text-muted truncate">{currentPos.title}</p>
              )}
            </div>

            {person && <span className="text-text-muted text-xs">→</span>}
            {!person && <span className="text-[10px] text-text-muted">Data tidak tersedia</span>}
          </div>
        )
      })}
    </div>
  )
}

// ── Custom Tooltip ─────────────────────────────────────────────────────────
function PowerTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const dynasty = DYNASTIES.find(d => d.name === label)
  return (
    <div className="bg-bg-card border border-border rounded-lg px-3 py-2 shadow-lg text-xs">
      <p className="font-bold text-text-primary mb-1">{label}</p>
      <p style={{ color: dynasty?.color || '#fff' }}>Power Index: {payload[0].value}/100</p>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function DynastyMapper() {
  const [selected, setSelected] = useState(null)
  const [tab, setTab] = useState('tree') // 'tree' | 'members'

  const chartData = DYNASTIES.map(d => ({ name: d.name, power: d.power_index, color: d.color }))

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            🌳 Peta Dinasti Politik
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Jaringan kekuasaan keluarga dalam politik Indonesia
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-text-muted bg-bg-elevated border border-border rounded-lg px-3 py-2">
          <span>📊</span>
          <span>{DYNASTIES.length} dinasti · {DYNASTIES.reduce((s, d) => s + d.members.length, 0)} anggota</span>
        </div>
      </div>

      {/* ── Section 1: Dynasty Cards ── */}
      <section>
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
          Profil Dinasti
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DYNASTIES.map(dynasty => (
            <DynastyCard
              key={dynasty.id}
              dynasty={dynasty}
              isSelected={selected?.id === dynasty.id}
              onClick={() => setSelected(selected?.id === dynasty.id ? null : dynasty)}
            />
          ))}
        </div>
      </section>

      {/* ── Section 2: D3 Tree + Member List (when selected) ── */}
      {selected && (
        <section className="bg-bg-card border border-border rounded-xl overflow-hidden">
          {/* Section header */}
          <div
            className="flex items-center justify-between px-5 py-4 border-b border-border"
            style={{ borderLeftWidth: 4, borderLeftColor: selected.color, borderLeftStyle: 'solid' }}
          >
            <div>
              <h2 className="font-bold text-text-primary">{selected.name}</h2>
              <p className="text-xs text-text-secondary mt-0.5">{selected.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTab('tree')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  tab === 'tree'
                    ? 'text-white'
                    : 'text-text-secondary hover:text-text-primary bg-bg-elevated'
                }`}
                style={tab === 'tree' ? { backgroundColor: selected.color } : {}}
              >
                🌳 Pohon
              </button>
              <button
                onClick={() => setTab('members')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  tab === 'members'
                    ? 'text-white'
                    : 'text-text-secondary hover:text-text-primary bg-bg-elevated'
                }`}
                style={tab === 'members' ? { backgroundColor: selected.color } : {}}
              >
                👥 Anggota
              </button>
            </div>
          </div>

          <div className="p-5">
            {tab === 'tree' ? (
              <div>
                <p className="text-xs text-text-muted mb-4">
                  Klik node untuk melihat profil. † = sudah wafat.
                </p>
                <DynastyTree dynasty={selected} />
              </div>
            ) : (
              <MemberList dynasty={selected} />
            )}
          </div>
        </section>
      )}

      {/* ── Section 3: Power Comparison Chart ── */}
      <section className="bg-bg-card border border-border rounded-xl p-5">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
          Perbandingan Kekuatan Dinasti
        </h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              label={{ value: 'Power', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }}
            />
            <Tooltip content={<PowerTooltip />} />
            <Bar dataKey="power" radius={[4, 4, 0, 0]} maxBarSize={64}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* ── Section 4: Analyst Notes ── */}
      <section className="bg-bg-card border border-border rounded-xl p-5">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
          <span>🔍</span> Catatan Analis
        </h2>
        <div className="space-y-3">
          {[
            {
              icon: '⚠️',
              color: '#FF6B35',
              text: 'Sebanyak 4 dari 5 posisi eksekutif tertinggi RI (Presiden, Wakil Presiden, Gubernur Sumut, Gubernur DKI) dikuasai figur yang terhubung dengan dinasti Jokowi.'
            },
            {
              icon: '🏛️',
              color: '#795548',
              text: 'Pola dinasti lokal seperti Bangkalan menunjukkan bahwa korupsi tidak selalu menghentikan transmisi kekuasaan keluarga.'
            },
            {
              icon: '👑',
              color: '#FFD700',
              text: 'DIY adalah satu-satunya provinsi Indonesia di mana kepala daerah tidak dipilih rakyat — berdasarkan UU Keistimewaan 2012.'
            },
          ].map((note, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg border"
              style={{ borderColor: note.color + '44', backgroundColor: note.color + '0d' }}
            >
              <span className="text-lg flex-shrink-0">{note.icon}</span>
              <p className="text-sm text-text-secondary leading-relaxed">{note.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
