import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { JATIM_REGIONS, INDONESIA_PROVINCES } from '../../data/regions'
import { PERSONS } from '../../data/persons'
import { PARTY_MAP } from '../../data/parties'
import { SearchBar, Card, Badge, PageHeader } from '../../components/ui'

const MADURA_IDS = ['bangkalan', 'sampang', 'pamekasan', 'sumenep']

// Party distribution for Jatim regions
const partyDist = JATIM_REGIONS.reduce((acc, r) => {
  const pid = r.party_id
  acc[pid] = (acc[pid] || 0) + 1
  return acc
}, {})
const pieData = Object.entries(partyDist).map(([pid, count]) => ({
  name: PARTY_MAP[pid]?.abbr || pid,
  value: count,
  color: PARTY_MAP[pid]?.color || '#6B7280',
})).sort((a, b) => b.value - a.value)

export default function RegionView() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    if (!search) return JATIM_REGIONS
    const q = search.toLowerCase()
    return JATIM_REGIONS.filter(r => r.name.toLowerCase().includes(q))
  }, [search])

  const jatimPersons = PERSONS.filter(p => p.region_id === 'jawa-timur')
  const selectedPersons = selected
    ? PERSONS.filter(p => p.region_id === selected.id || p.positions?.some(pos => pos.region?.toLowerCase().includes(selected.ibu_kota?.toLowerCase())))
    : []

  return (
    <div className="space-y-6">
      <PageHeader
        title="🗺️ Peta Wilayah — Jawa Timur"
        subtitle="38 Kabupaten/Kota terpantau"
      />

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-text-primary">38</p>
          <p className="text-xs text-text-secondary">Kab/Kota</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-text-primary">{jatimPersons.length}</p>
          <p className="text-xs text-text-secondary">Tokoh Dipantau</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-400">PKB</p>
          <p className="text-xs text-text-secondary">Partai Dominan</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-text-primary">
            {JATIM_REGIONS.filter(r => PARTY_MAP[r.party_id]?.abbr === 'PDIP').length}
          </p>
          <p className="text-xs text-text-secondary">Daerah PDIP</p>
        </Card>
      </div>

      {/* Party Distribution Pie */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Distribusi Partai Bupati/Walikota</h3>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}:${value}`} labelLine={false}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1E2235', border: '1px solid #2D3748', borderRadius: 8 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2">
            {pieData.map(d => (
              <span
                key={d.name}
                className="flex items-center gap-1.5 text-xs px-2 py-1 rounded"
                style={{ backgroundColor: d.color + '20', color: d.color }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                {d.name}: {d.value}
              </span>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex gap-4">
        {/* Grid */}
        <div className="flex-1 space-y-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Cari kabupaten/kota..." />

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map(region => {
              const party = PARTY_MAP[region.party_id]
              const bupati = region.bupati_id ? PERSONS.find(p => p.id === region.bupati_id) : null
              const isMadura = MADURA_IDS.includes(region.id)
              const atRisk = bupati && ['tersangka','terpidana'].includes(bupati.analysis?.corruption_risk)
              return (
                <div
                  key={region.id}
                  className={`bg-bg-card border rounded-xl p-4 cursor-pointer transition-all hover:border-gray-600 ${
                    selected?.id === region.id ? 'border-accent-red' : 'border-border'
                  }`}
                  style={party ? { borderLeftColor: party.color, borderLeftWidth: 3 } : {}}
                  onClick={() => setSelected(selected?.id === region.id ? null : region)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-text-primary">{region.name}</p>
                        {atRisk && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Bupati berisiko" />}
                      </div>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {region.type === 'kota' ? '🏙️ Kota' : '🏘️ Kabupaten'}
                        {isMadura ? ' · 🌊 Madura' : ''}
                      </p>
                    </div>
                    {party && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded font-medium"
                        style={{ backgroundColor: party.color + '20', color: party.color }}
                      >
                        {party.abbr}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-text-secondary">
                    {bupati ? (
                      <span>{region.type === 'kota' ? 'Walikota' : 'Bupati'}: <span className="text-text-primary">{bupati.name}</span></span>
                    ) : (
                      <span className="italic">Data tidak tersedia</span>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-text-secondary">
                    Ibu Kota: {region.ibu_kota}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Side Detail Panel */}
        {selected && (
          <div className="w-72 flex-shrink-0 space-y-4">
            <Card className="p-4">
              <button
                onClick={() => setSelected(null)}
                className="text-text-secondary hover:text-text-primary text-xs mb-3 flex items-center gap-1"
              >
                × Tutup
              </button>
              <h3 className="text-sm font-semibold text-text-primary">{selected.name}</h3>
              <p className="text-xs text-text-secondary mb-3">{selected.type} · {selected.ibu_kota}</p>

              {(() => {
                const bupati = selected.bupati_id ? PERSONS.find(p => p.id === selected.bupati_id) : null
                const party = PARTY_MAP[selected.party_id]
                return bupati ? (
                  <div>
                    <p className="text-xs text-text-secondary mb-1">
                      {selected.type === 'kota' ? 'Walikota' : 'Bupati'}:
                    </p>
                    <div className="flex items-center gap-2 p-2 bg-bg-elevated rounded-lg">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: party?.color || '#374151' }}>
                        {bupati.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <Link
                          to={`/persons/${bupati.id}`}
                          className="text-sm font-medium text-accent-blue hover:underline"
                        >
                          {bupati.name}
                        </Link>
                        {bupati.analysis?.corruption_risk && (
                          <p className="text-xs">
                            Risiko: <span className={
                              ['tersangka','terpidana'].includes(bupati.analysis.corruption_risk)
                                ? 'text-red-400' : 'text-text-secondary'
                            }>{bupati.analysis.corruption_risk}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-text-secondary">Data pejabat tidak tersedia</p>
                )
              })()}

              <p className="text-xs text-text-secondary mt-3">
                Populasi: ~{(selected.pop / 1_000_000).toFixed(1)}jt
              </p>
            </Card>
          </div>
        )}
      </div>

      {/* National Section */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3">🗺️ Seluruh Provinsi Indonesia</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {INDONESIA_PROVINCES.map(prov => (
            <div
              key={prov.id}
              className={`p-2.5 rounded-lg border text-xs ${
                prov.id === 'jawa-timur'
                  ? 'bg-accent-red/10 border-accent-red/40 text-accent-red font-medium'
                  : 'bg-bg-card border-border text-text-secondary hover:border-gray-600 cursor-pointer'
              }`}
            >
              <p className="font-medium text-text-primary">{prov.name}</p>
              <p className="text-text-secondary">{prov.capital}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
