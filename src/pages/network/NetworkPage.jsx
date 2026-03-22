import { useState, useCallback, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { PERSONS } from '../../data/persons'
import { CONNECTIONS, CONNECTION_TYPES } from '../../data/connections'
import { PARTIES } from '../../data/parties'
import NetworkGraph from '../../components/NetworkGraph'
import PersonCard from '../../components/PersonCard'
import { Btn, Badge } from '../../components/ui'
import MetaTags from '../../components/MetaTags'

// Only nodes that have at least one connection
const connectedIds = new Set([
  ...CONNECTIONS.map(c => c.from),
  ...CONNECTIONS.map(c => c.to),
])
const NETWORK_NODES = PERSONS.filter(p => connectedIds.has(p.id))

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

// Type labels + colors (all types present in CONNECTIONS)
const TYPE_INFO = {
  koalisi:           { label: 'Koalisi',         color: '#3B82F6' },
  keluarga:          { label: 'Keluarga',         color: '#EC4899' },
  bisnis:            { label: 'Bisnis',           color: '#F59E0B' },
  konflik:           { label: 'Konflik',          color: '#EF4444' },
  rival:             { label: 'Rival',            color: '#DC2626' },
  'mentor-murid':    { label: 'Mentor-Murid',     color: '#8B5CF6' },
  kolega:            { label: 'Kolega',           color: '#64748B' },
  rekan:             { label: 'Rekan',            color: '#6B7280' },
  'mantan-koalisi':  { label: 'Mantan Koalisi',   color: '#D97706' },
  'atasan-bawahan':  { label: 'Atasan-Bawahan',   color: '#14B8A6' },
}
const ALL_TYPES = Object.keys(TYPE_INFO)

// Pre-compute count per connection type
const TYPE_COUNTS = ALL_TYPES.reduce((acc, type) => {
  acc[type] = CONNECTIONS.filter(c => c.type === type).length
  return acc
}, {})

// BFS shortest path
function findShortestPath(connections, startId, endId) {
  if (startId === endId) return [startId]
  const adj = {}
  connections.forEach(c => {
    if (!adj[c.from]) adj[c.from] = []
    if (!adj[c.to])   adj[c.to]   = []
    adj[c.from].push({ id: c.to,   edge: c })
    adj[c.to].push({   id: c.from, edge: c })
  })
  const visited = new Set([startId])
  const queue   = [[startId, [startId]]]
  while (queue.length) {
    const [current, path] = queue.shift()
    for (const { id } of (adj[current] || [])) {
      if (id === endId) return [...path, id]
      if (!visited.has(id)) {
        visited.add(id)
        queue.push([id, [...path, id]])
      }
    }
  }
  return null
}

export default function NetworkPage() {
  const navigate = useNavigate()

  // Filters
  const [visibleTypes, setVisibleTypes] = useState(ALL_TYPES)
  const [filterParty,  setFilterParty]  = useState(null)
  const [filterTier,   setFilterTier]   = useState(null)
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [showClusters, setShowClusters] = useState(false)

  // Shortest path
  const [pathStart, setPathStart] = useState('')
  const [pathEnd,   setPathEnd]   = useState('')
  const [path,      setPath]      = useState(undefined) // undefined = not searched

  // Focus node (search-to-zoom)
  const [focusNodeId, setFocusNodeId] = useState(null)
  const [searchValue, setSearchValue] = useState('')

  const handleNodeClick = useCallback(person => setSelectedPerson(person), [])

  const handleReset = () => {
    setVisibleTypes(ALL_TYPES)
    setFilterParty(null)
    setFilterTier(null)
    setSelectedPerson(null)
    setFocusNodeId(null)
    setSearchValue('')
  }

  const computePath = () => {
    if (!pathStart || !pathEnd) return
    setPath(findShortestPath(CONNECTIONS, pathStart, pathEnd))
  }

  // Live stats
  const stats = useMemo(() => {
    const visEdges = CONNECTIONS.filter(e => visibleTypes.includes(e.type))
    const activeNodeIds = new Set([...visEdges.map(e => e.from), ...visEdges.map(e => e.to)])
    return { visible: visEdges.length, total: CONNECTIONS.length, activeNodes: activeNodeIds.size }
  }, [visibleTypes])

  const connectionCounts = selectedPerson
    ? Object.keys(CONNECTION_TYPES).reduce((acc, type) => {
        const count = CONNECTIONS.filter(c =>
          (c.from === selectedPerson.id || c.to === selectedPerson.id) && c.type === type
        ).length
        if (count > 0) acc[type] = count
        return acc
      }, {})
    : {}

  const partiesWithConnections = PARTIES.filter(p =>
    NETWORK_NODES.some(n => n.party_id === p.id)
  )

  const highlightIds = Array.isArray(path) ? path : undefined

  const toggleType = type => {
    setVisibleTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-0 -m-4 md:-m-6 overflow-hidden">
      <MetaTags title="Jaringan Politik" description="Visualisasi jaringan hubungan antar tokoh politik Indonesia — koneksi, koalisi, dan pengaruh" />
      {/* ── Left Filter Panel ─────────────────────────────────────────── */}
      <div className="w-56 flex-shrink-0 bg-bg-sidebar border-r border-border overflow-y-auto p-4 space-y-5">

        {/* Search to focus */}
        <div>
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
            🔎 Cari Tokoh
          </h3>
          <select
            value={searchValue}
            onChange={e => {
              setSearchValue(e.target.value)
              setFocusNodeId(e.target.value || null)
            }}
            className="w-full text-xs bg-bg-elevated border border-border rounded px-2 py-1 text-text-primary"
          >
            <option value="">Cari tokoh...</option>
            {NETWORK_NODES.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
          </select>
        </div>

        {/* Cluster Toggle */}
        <div>
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
            Tampilan
          </h3>
          <button
            onClick={() => setShowClusters(v => !v)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors border ${
              showClusters
                ? 'bg-blue-900/30 border-blue-500/50 text-blue-300'
                : 'bg-bg-elevated border-border text-text-secondary hover:text-text-primary hover:bg-bg-hover'
            }`}
          >
            <span>🔵</span>
            <span>Tampilkan Cluster</span>
            {showClusters && <span className="ml-auto text-blue-400">✓</span>}
          </button>
        </div>

        {/* Filter Koneksi — checkboxes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Filter Koneksi
            </h3>
            <button
              onClick={() => setVisibleTypes(visibleTypes.length === ALL_TYPES.length ? [] : ALL_TYPES)}
              className="text-[10px] text-text-secondary hover:text-text-primary"
            >
              {visibleTypes.length === ALL_TYPES.length ? 'Semua' : 'Pilih Semua'}
            </button>
          </div>
          <div className="space-y-1.5">
            {ALL_TYPES.map(type => {
              const info = TYPE_INFO[type]
              const checked = visibleTypes.includes(type)
              const count = TYPE_COUNTS[type] || 0
              return (
                <label
                  key={type}
                  className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-lg hover:bg-bg-elevated transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleType(type)}
                    className="rounded accent-blue-500 w-3.5 h-3.5 flex-shrink-0"
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: info.color }}
                  />
                  <span className={`text-xs flex-1 ${checked ? 'text-text-primary' : 'text-text-secondary'}`}>
                    {info.label}
                  </span>
                  <span className="text-[10px] text-text-secondary tabular-nums">
                    {count}
                  </span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Live stats */}
        <div className="bg-bg-elevated rounded-lg p-3 space-y-1">
          <p className="text-xs text-text-secondary">
            <span className="font-semibold text-text-primary">{stats.visible}</span>
            {' / '}
            <span>{stats.total}</span>
            {' koneksi ditampilkan'}
          </p>
          <p className="text-xs text-text-secondary">
            <span className="font-semibold text-text-primary">{stats.activeNodes}</span>
            {' node aktif'}
          </p>
        </div>

        {/* Party filter */}
        <div>
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
            Partai
          </h3>
          <div className="space-y-1.5">
            {partiesWithConnections.slice(0, 10).map(party => (
              <button
                key={party.id}
                onClick={() => setFilterParty(filterParty === party.id ? null : party.id)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${
                  filterParty === party.id ? 'bg-bg-elevated' : 'hover:bg-bg-elevated'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: party.color }} />
                <span className={filterParty === party.id ? 'text-text-primary font-medium' : 'text-text-secondary'}>
                  {party.abbr}
                </span>
                {filterParty === party.id && <span className="ml-auto text-text-secondary">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Tier filter */}
        <div>
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
            Tingkat
          </h3>
          <div className="space-y-1.5">
            {['nasional', 'provinsi', 'kabupaten'].map(tier => (
              <button
                key={tier}
                onClick={() => setFilterTier(filterTier === tier ? null : tier)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors capitalize ${
                  filterTier === tier
                    ? 'bg-bg-elevated text-text-primary font-medium'
                    : 'text-text-secondary hover:bg-bg-elevated'
                }`}
              >
                {tier.charAt(0).toUpperCase() + tier.slice(1)}
                {filterTier === tier && <span className="ml-auto">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {(visibleTypes.length < ALL_TYPES.length || filterParty || filterTier) && (
          <button
            onClick={handleReset}
            className="w-full px-3 py-2 text-xs text-red-400 hover:bg-red-900/20 border border-red-700/30 rounded-lg transition-colors"
          >
            ✕ Reset Semua Filter
          </button>
        )}

        {/* Shortest path */}
        <div className="border-t border-border pt-4">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
            🔍 Jalur Terpendek
          </h3>
          <select
            value={pathStart}
            onChange={e => { setPathStart(e.target.value); setPath(undefined) }}
            className="w-full text-xs bg-bg-elevated border border-border rounded px-2 py-1 mb-1 text-text-primary"
          >
            <option value="">Dari...</option>
            {NETWORK_NODES.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
          </select>
          <select
            value={pathEnd}
            onChange={e => { setPathEnd(e.target.value); setPath(undefined) }}
            className="w-full text-xs bg-bg-elevated border border-border rounded px-2 py-1 mb-2 text-text-primary"
          >
            <option value="">Ke...</option>
            {NETWORK_NODES.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
          </select>
          <button
            onClick={computePath}
            disabled={!pathStart || !pathEnd}
            className="w-full text-xs bg-accent-red text-white rounded py-1.5 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Cari Jalur
          </button>
          {Array.isArray(path) && (
            <div className="mt-2 space-y-1.5">
              {/* Summary line */}
              <div className="text-xs text-yellow-400 font-medium bg-yellow-500/10 border border-yellow-500/20 rounded px-2 py-1.5">
                {(() => {
                  const startName = PERSONS.find(x => x.id === path[0])?.name || path[0]
                  const endName   = PERSONS.find(x => x.id === path[path.length - 1])?.name || path[path.length - 1]
                  const steps     = path.length - 1
                  const via       = path.slice(1, -1).map(id => PERSONS.find(x => x.id === id)?.name || id)
                  return (
                    <>
                      <span>{startName} → {endName}: <strong>{steps} langkah</strong></span>
                      {via.length > 0 && (
                        <span className="block text-yellow-300/80 text-[10px] mt-0.5">
                          via {via.join(', ')}
                        </span>
                      )}
                    </>
                  )
                })()}
              </div>
              {/* Step-by-step */}
              <div className="flex flex-wrap items-center gap-1">
                {path.map((id, i) => {
                  const p = PERSONS.find(x => x.id === id)
                  return (
                    <span key={id} className="flex items-center gap-1">
                      {i > 0 && <span className="text-accent-red text-[10px]">→</span>}
                      <span className="text-[10px] text-text-primary bg-bg-elevated rounded px-1.5 py-0.5">
                        {p?.name || id}
                      </span>
                    </span>
                  )
                })}
              </div>
              <button
                onClick={() => { setPath(undefined); setPathStart(''); setPathEnd('') }}
                className="w-full text-[10px] text-text-secondary hover:text-red-400 transition-colors mt-1"
              >
                ✕ Reset Jalur
              </button>
            </div>
          )}
          {path === null && pathStart && pathEnd && (
            <p className="text-xs text-red-400/80 mt-2">Tidak ada jalur ditemukan antara kedua tokoh ini.</p>
          )}
        </div>
      </div>

      {/* ── Main Graph Area ───────────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        {isMobile ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <p className="text-text-secondary text-sm mb-3">
              Graf tidak tersedia di layar kecil. Menampilkan daftar koneksi:
            </p>
            {NETWORK_NODES.slice(0, 40).map(node => {
              const nodeConns = CONNECTIONS.filter(c =>
                (c.from === node.id || c.to === node.id) &&
                visibleTypes.includes(c.type)
              )
              if (!nodeConns.length) return null
              return (
                <Link
                  key={node.id}
                  to={`/persons/${node.id}`}
                  className="block bg-bg-card rounded-lg p-3 border border-border hover:border-accent-red transition-colors"
                >
                  <p className="text-sm font-semibold text-text-primary mb-1.5">{node.name}</p>
                  <div className="flex flex-wrap gap-1">
                    {nodeConns.slice(0, 6).map((c, i) => {
                      const info = TYPE_INFO[c.type]
                      return (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded text-[10px] font-medium text-white"
                          style={{ backgroundColor: info?.color || '#6B7280' }}
                        >
                          {info?.label || c.type}
                        </span>
                      )
                    })}
                    {nodeConns.length > 6 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] text-text-secondary bg-bg-elevated">
                        +{nodeConns.length - 6} lagi
                      </span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="flex-1 relative">
            <NetworkGraph
              nodes={filterTier ? NETWORK_NODES.filter(n => n.tier === filterTier) : NETWORK_NODES}
              edges={CONNECTIONS}
              onNodeClick={handleNodeClick}
              filterParty={filterParty}
              visibleTypes={visibleTypes}
              highlightIds={highlightIds}
              focusNodeId={focusNodeId}
              showClusters={showClusters}
            />

            {/* Stats overlay */}
            <div className="absolute top-3 left-3 flex gap-2 pointer-events-none">
              <span className="px-2 py-1 bg-bg-card/90 border border-border rounded text-xs text-text-secondary">
                {stats.visible} / {stats.total} koneksi · {stats.activeNodes} node aktif
              </span>
              {Array.isArray(path) && (
                <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/40 rounded text-xs text-yellow-400">
                  ✨ Jalur: {path.length} tokoh
                </span>
              )}
            </div>
          </div>
        )}

        {/* ── Legend bar ──────────────────────────────────────────────── */}
        <div className="flex-shrink-0 border-t border-border bg-bg-sidebar px-4 py-2 flex flex-wrap gap-x-4 gap-y-1">
          {ALL_TYPES.map(type => {
            const info = TYPE_INFO[type]
            return (
              <span key={type} className="flex items-center gap-1.5 text-xs text-text-secondary">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: info.color }} />
                {info.label}
              </span>
            )
          })}
        </div>
      </div>

      {/* ── Right Info Panel ─────────────────────────────────────────── */}
      {selectedPerson && (
        <div className="w-72 flex-shrink-0 bg-bg-sidebar border-l border-border overflow-y-auto p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">Detail Tokoh</h3>
            <button
              onClick={() => setSelectedPerson(null)}
              className="text-text-secondary hover:text-text-primary text-lg"
            >
              ×
            </button>
          </div>

          <PersonCard person={selectedPerson} />

          <Btn
            variant="primary"
            className="w-full justify-center"
            onClick={() => navigate(`/persons/${selectedPerson.id}`)}
          >
            Lihat Profil Lengkap →
          </Btn>

          {Object.keys(connectionCounts).length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                Koneksi per Tipe
              </h4>
              <div className="space-y-1.5">
                {Object.entries(connectionCounts).map(([type, count]) => {
                  const info = TYPE_INFO[type] || CONNECTION_TYPES[type]
                  return (
                    <div key={type} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: info?.color }} />
                        <span className="text-text-secondary">{info?.label || type}</span>
                      </span>
                      <span className="font-medium text-text-primary">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
