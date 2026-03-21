import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PERSONS } from '../../data/persons'
import { CONNECTIONS } from '../../data/connections'
import { PARTY_MAP } from '../../data/parties'

// Only persons that have at least one connection
const connectedIds = new Set([
  ...CONNECTIONS.map(c => c.from),
  ...CONNECTIONS.map(c => c.to),
])
const NETWORK_PERSONS = PERSONS.filter(p => connectedIds.has(p.id))

// BFS influence propagation — excludes 'konflik' links
function computeReach(personId, maxHops, connections) {
  const visited = new Set([personId])
  let frontier = [personId]
  const layers = []

  for (let hop = 0; hop < maxHops; hop++) {
    const nextFrontier = []
    frontier.forEach(id => {
      connections
        .filter(c => (c.from === id || c.to === id) && c.type !== 'konflik')
        .forEach(c => {
          const neighbor = c.from === id ? c.to : c.from
          if (!visited.has(neighbor)) {
            visited.add(neighbor)
            nextFrontier.push(neighbor)
          }
        })
    })
    layers.push([...nextFrontier])
    frontier = nextFrontier
    if (frontier.length === 0) break
  }

  return { total: visited.size - 1, layers, reachable: [...visited] }
}

// Resolve person object from id (may include non-network persons in results)
function getPerson(id) {
  return PERSONS.find(p => p.id === id)
}

const HOP_LABELS = ['tokoh langsung', 'tokoh via jaringan', 'tokoh tak langsung']

const HOP_COLORS = ['#3b82f6', '#8b5cf6', '#10b981']

export default function PengaruhPage() {
  const [selectedId, setSelectedId] = useState('prabowo')
  const [searchQuery, setSearchQuery] = useState('')
  const [maxHops, setMaxHops] = useState(2)
  const [result, setResult] = useState(null)
  const [hasComputed, setHasComputed] = useState(false)

  const totalPersons = NETWORK_PERSONS.length

  // Top 10 influence ranking (computed on demand — runs BFS for each network person)
  const top10 = useMemo(() => {
    const scores = NETWORK_PERSONS.map(p => {
      const r = computeReach(p.id, maxHops, CONNECTIONS)
      return { person: p, score: r.total }
    })
    scores.sort((a, b) => b.score - a.score)
    return scores.slice(0, 10)
  }, [maxHops])

  const maxScore = top10[0]?.score || 1

  const filteredPersons = useMemo(() => {
    if (!searchQuery) return NETWORK_PERSONS
    const q = searchQuery.toLowerCase()
    return NETWORK_PERSONS.filter(p => p.name.toLowerCase().includes(q))
  }, [searchQuery])

  function handleCompute() {
    if (!selectedId) return
    const r = computeReach(selectedId, maxHops, CONNECTIONS)
    setResult(r)
    setHasComputed(true)
  }

  const selectedPerson = getPerson(selectedId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">🌐 Simulasi Pengaruh</h1>
        <p className="text-text-secondary text-sm mt-1">
          Pilih seorang tokoh dan lihat seberapa jauh pengaruh mereka menjangkau jaringan politik Indonesia.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-bg-card border border-border rounded-xl p-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Person selector */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Tokoh
            </label>
            <input
              type="text"
              placeholder="Cari nama tokoh..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-sm bg-bg-elevated border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-blue-500 mb-1"
            />
            <select
              value={selectedId}
              onChange={e => { setSelectedId(e.target.value); setResult(null); setHasComputed(false) }}
              className="w-full text-sm bg-bg-elevated border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-blue-500"
              size={5}
            >
              {filteredPersons.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Hop selector + button */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Kedalaman Hop
              </label>
              <div className="flex gap-2">
                {[1, 2, 3].map(h => (
                  <button
                    key={h}
                    onClick={() => { setMaxHops(h); setResult(null); setHasComputed(false) }}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${
                      maxHops === h
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-bg-elevated border-border text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                    }`}
                  >
                    {h} hop
                  </button>
                ))}
              </div>
            </div>

            {/* Selected person preview */}
            {selectedPerson && (
              <div className="bg-bg-elevated rounded-lg p-3 space-y-1">
                <p className="text-sm font-semibold text-text-primary truncate">{selectedPerson.name}</p>
                <p className="text-xs text-text-secondary">
                  {PARTY_MAP[selectedPerson.party_id]?.abbr || selectedPerson.party_id || '–'}
                  {' · '}
                  {selectedPerson.tier}
                </p>
              </div>
            )}

            <button
              onClick={handleCompute}
              disabled={!selectedId}
              className="w-full py-3 rounded-xl bg-accent-red hover:bg-red-700 text-white font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              🔍 Hitung Pengaruh
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {hasComputed && result && (
        <div className="space-y-6 animate-fade-in">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-bg-card border border-border rounded-xl p-4 col-span-2 md:col-span-1">
              <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Total Terjangkau</p>
              <p className="text-3xl font-bold text-text-primary">{result.total}</p>
              <p className="text-xs text-text-secondary mt-1">tokoh</p>
            </div>
            <div className="bg-bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">% dari Jaringan</p>
              <p className="text-3xl font-bold text-blue-400">
                {totalPersons > 0 ? ((result.total / totalPersons) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-xs text-text-secondary mt-1">dari {totalPersons} tokoh</p>
            </div>
            <div className="bg-bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Koneksi Langsung</p>
              <p className="text-3xl font-bold text-purple-400">{result.layers[0]?.length || 0}</p>
              <p className="text-xs text-text-secondary mt-1">Hop 1</p>
            </div>
            <div className="bg-bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Kedalaman</p>
              <p className="text-3xl font-bold text-emerald-400">{result.layers.filter(l => l.length > 0).length}</p>
              <p className="text-xs text-text-secondary mt-1">level aktif</p>
            </div>
          </div>

          {/* Layer Breakdown */}
          <div className="bg-bg-card border border-border rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-text-primary">Rincian per Hop</h2>
            {result.layers.map((layer, idx) => {
              if (layer.length === 0) return null
              const color = HOP_COLORS[idx] || '#6b7280'
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: color }}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium text-text-primary">
                      Hop {idx + 1}: <span className="font-bold">{layer.length}</span>{' '}
                      <span className="text-text-secondary font-normal">{HOP_LABELS[idx] || 'tokoh'}</span>
                    </span>
                  </div>
                  {/* Person chips */}
                  <div className="flex flex-wrap gap-1.5 pl-8">
                    {layer.slice(0, 40).map(id => {
                      const p = getPerson(id)
                      if (!p) return null
                      const party = PARTY_MAP[p.party_id]
                      return (
                        <Link
                          key={id}
                          to={`/persons/${id}`}
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium hover:opacity-80 transition-opacity"
                          style={{
                            backgroundColor: party?.color ? `${party.color}22` : '#374151',
                            border: `1px solid ${party?.color || '#6b7280'}44`,
                            color: party?.color || '#9ca3af',
                          }}
                        >
                          {p.name.split(' ').slice(0, 2).join(' ')}
                        </Link>
                      )
                    })}
                    {layer.length > 40 && (
                      <span className="px-2 py-1 rounded-lg text-xs text-text-secondary bg-bg-elevated border border-border">
                        +{layer.length - 40} lainnya
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
            {result.total === 0 && (
              <p className="text-sm text-text-secondary text-center py-4">
                Tidak ada tokoh yang dapat dijangkau (hanya koneksi konflik atau tidak ada koneksi).
              </p>
            )}
          </div>
        </div>
      )}

      {/* Top 10 Influence Ranking */}
      <div className="bg-bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">🏆 Top 10 Tokoh Paling Berpengaruh</h2>
          <span className="text-xs text-text-secondary">
            Berdasarkan jangkauan {maxHops} hop
          </span>
        </div>
        <div className="space-y-2.5">
          {top10.map(({ person, score }, rank) => {
            const party = PARTY_MAP[person.party_id]
            const barWidth = maxScore > 0 ? (score / maxScore) * 100 : 0
            const isSelected = person.id === selectedId
            return (
              <Link
                key={person.id}
                to={`/persons/${person.id}`}
                className={`flex items-center gap-3 group rounded-lg p-2 transition-colors ${
                  isSelected ? 'bg-blue-900/20 border border-blue-500/30' : 'hover:bg-bg-elevated'
                }`}
              >
                {/* Rank */}
                <span className={`w-6 text-xs font-bold text-center flex-shrink-0 ${
                  rank === 0 ? 'text-yellow-400' :
                  rank === 1 ? 'text-gray-300' :
                  rank === 2 ? 'text-amber-600' : 'text-text-secondary'
                }`}>
                  {rank + 1}
                </span>

                {/* Name + party */}
                <div className="flex-shrink-0 w-36">
                  <p className="text-xs font-medium text-text-primary truncate group-hover:text-white">
                    {person.name.split(' ').slice(0, 2).join(' ')}
                  </p>
                  <p className="text-[10px] text-text-secondary">{party?.abbr || '–'}</p>
                </div>

                {/* Bar */}
                <div className="flex-1 h-5 bg-bg-elevated rounded overflow-hidden">
                  <div
                    className="h-full rounded flex items-center justify-end pr-1.5 transition-all"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: party?.color || '#3b82f6',
                      opacity: 0.75,
                      minWidth: score > 0 ? 24 : 0,
                    }}
                  >
                    <span className="text-[10px] font-bold text-white whitespace-nowrap">
                      {score}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
