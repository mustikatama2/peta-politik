import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { PERSONS } from '../../data/persons'
import { CONNECTIONS, CONNECTION_TYPES } from '../../data/connections'
import { PARTIES } from '../../data/parties'
import NetworkGraph from '../../components/NetworkGraph'
import PersonCard from '../../components/PersonCard'
import { Btn, Badge } from '../../components/ui'

// Only nodes that have at least one connection
const connectedIds = new Set([
  ...CONNECTIONS.map(c => c.from),
  ...CONNECTIONS.map(c => c.to),
])
const NETWORK_NODES = PERSONS.filter(p => connectedIds.has(p.id))

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

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
  const queue = [[startId, [startId]]]
  while (queue.length) {
    const [current, path] = queue.shift()
    const neighbors = adj[current] || []
    for (const { id } of neighbors) {
      if (id === endId) return [...path, id]
      if (!visited.has(id)) {
        visited.add(id)
        queue.push([id, [...path, id]])
      }
    }
  }
  return null // no path found
}

export default function NetworkPage() {
  const navigate = useNavigate()
  const [filterType, setFilterType] = useState(null)
  const [filterParty, setFilterParty] = useState(null)
  const [filterTier, setFilterTier] = useState(null)
  const [selectedPerson, setSelectedPerson] = useState(null)

  // Shortest path state
  const [pathStart, setPathStart] = useState('')
  const [pathEnd, setPathEnd] = useState('')
  const [path, setPath] = useState(undefined) // undefined = not searched yet, null = no path

  const handleNodeClick = useCallback((person) => {
    setSelectedPerson(person)
  }, [])

  const handleReset = () => {
    setFilterType(null)
    setFilterParty(null)
    setFilterTier(null)
    setSelectedPerson(null)
  }

  const computePath = () => {
    if (!pathStart || !pathEnd) return
    const result = findShortestPath(CONNECTIONS, pathStart, pathEnd)
    setPath(result)
  }

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

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-0 -m-4 md:-m-6 overflow-hidden">
      {/* Left Filter Panel */}
      <div className="w-56 flex-shrink-0 bg-bg-sidebar border-r border-border overflow-y-auto p-4 space-y-5">
        <div>
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
            Jenis Koneksi
          </h3>
          <div className="space-y-1.5">
            {Object.entries(CONNECTION_TYPES).map(([type, cfg]) => (
              <button
                key={type}
                onClick={() => setFilterType(filterType === type ? null : type)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${
                  filterType === type ? 'bg-bg-elevated' : 'hover:bg-bg-elevated'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: filterType === type ? cfg.color : cfg.color + '80' }}
                />
                <span className={filterType === type ? 'text-text-primary font-medium' : 'text-text-secondary'}>
                  {cfg.label}
                </span>
                {filterType === type && <span className="ml-auto text-text-secondary">✓</span>}
              </button>
            ))}
          </div>
        </div>

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
                  filterTier === tier ? 'bg-bg-elevated text-text-primary font-medium' : 'text-text-secondary hover:bg-bg-elevated'
                }`}
              >
                {tier.charAt(0).toUpperCase() + tier.slice(1)}
                {filterTier === tier && <span className="ml-auto">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {(filterType || filterParty || filterTier) && (
          <button
            onClick={handleReset}
            className="w-full px-3 py-2 text-xs text-red-400 hover:bg-red-900/20 border border-red-700/30 rounded-lg transition-colors"
          >
            ✕ Reset Filter
          </button>
        )}

        {/* Shortest Path section */}
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
            <div className="mt-2 space-y-1">
              <p className="text-xs text-text-secondary">{path.length - 1} derajat pemisah:</p>
              {path.map((id, i) => {
                const p = PERSONS.find(x => x.id === id)
                return (
                  <div key={id} className="flex items-center gap-1">
                    {i > 0 && <span className="text-accent-red text-xs">→</span>}
                    <span className="text-xs text-text-primary">{p?.name || id}</span>
                  </div>
                )
              })}
            </div>
          )}
          {path === null && pathStart && pathEnd && (
            <p className="text-xs text-text-secondary mt-2">Tidak ada jalur ditemukan</p>
          )}
        </div>

        {/* Legend */}
        <div>
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
            Legenda
          </h3>
          <div className="space-y-1">
            {Object.entries(CONNECTION_TYPES).map(([type, cfg]) => (
              <div key={type} className="flex items-center gap-2 text-xs text-text-secondary">
                <span className="inline-block w-5 h-0.5" style={{ backgroundColor: cfg.color }} />
                {cfg.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Network Graph / Mobile fallback */}
      <div className="flex-1 relative overflow-y-auto">
        {isMobile ? (
          <div className="p-4 space-y-2">
            <p className="text-text-secondary text-sm mb-3">Graf tidak tersedia di layar kecil. Menampilkan daftar koneksi:</p>
            {NETWORK_NODES.slice(0, 30).map(node => {
              const nodeConns = CONNECTIONS.filter(c => c.from === node.id || c.to === node.id)
              if (!nodeConns.length) return null
              return (
                <div key={node.id} className="bg-bg-card rounded-lg p-3 border border-border">
                  <p className="text-sm font-semibold text-text-primary">{node.name}</p>
                  <p className="text-xs text-text-secondary">{nodeConns.length} koneksi</p>
                </div>
              )
            })}
          </div>
        ) : (
          <>
            <NetworkGraph
              nodes={filterTier ? NETWORK_NODES.filter(n => n.tier === filterTier) : NETWORK_NODES}
              edges={CONNECTIONS}
              onNodeClick={handleNodeClick}
              filterType={filterType}
              filterParty={filterParty}
              highlightIds={highlightIds}
            />
            {/* Stats overlay */}
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="px-2 py-1 bg-bg-card/90 border border-border rounded text-xs text-text-secondary">
                {NETWORK_NODES.length} tokoh · {CONNECTIONS.length} koneksi
              </span>
              {Array.isArray(path) && (
                <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/40 rounded text-xs text-yellow-400">
                  ✨ Jalur disorot: {path.length} tokoh
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Right Info Panel */}
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
                  const cfg = CONNECTION_TYPES[type]
                  return (
                    <div key={type} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                        <span className="text-text-secondary">{cfg.label}</span>
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
