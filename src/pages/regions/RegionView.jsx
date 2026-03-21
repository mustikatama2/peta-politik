import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import * as RegionsData from '../../data/regions'
import { PERSONS } from '../../data/persons'
import { PARTY_MAP } from '../../data/parties'
import { SearchBar, Card, Badge, PageHeader } from '../../components/ui'

// Safe fallbacks for data that may not exist yet
const JATIM_REGIONS = RegionsData.JATIM_REGIONS || []
const PROVINCES = RegionsData.PROVINCES || []

// Island group mapping (fallback if PROVINCES doesn't have island field)
const ISLAND_MAP = {
  'aceh':'Sumatera','sumatera-utara':'Sumatera','sumatera-barat':'Sumatera',
  'riau':'Sumatera','jambi':'Sumatera','sumatera-selatan':'Sumatera',
  'bengkulu':'Sumatera','lampung':'Sumatera','bangka-belitung':'Sumatera','kepri':'Sumatera',
  'dki-jakarta':'Jawa','jawa-barat':'Jawa','jawa-tengah':'Jawa',
  'diy':'Jawa','jawa-timur':'Jawa','banten':'Jawa',
  'kalimantan-barat':'Kalimantan','kalimantan-tengah':'Kalimantan',
  'kalimantan-selatan':'Kalimantan','kalimantan-timur':'Kalimantan','kalimantan-utara':'Kalimantan',
  'sulawesi-utara':'Sulawesi','sulawesi-tengah':'Sulawesi','sulawesi-selatan':'Sulawesi',
  'sulawesi-tenggara':'Sulawesi','gorontalo':'Sulawesi','sulawesi-barat':'Sulawesi',
  'bali':'Bali-Nusra','nusa-tenggara-barat':'Bali-Nusra','nusa-tenggara-timur':'Bali-Nusra',
  'maluku':'Maluku','maluku-utara':'Maluku',
  'papua-barat':'Papua','papua-barat-daya':'Papua','papua-tengah':'Papua',
  'papua-pegunungan':'Papua','papua-selatan':'Papua','papua':'Papua',
}

const ISLAND_COLORS = {
  Sumatera:'#F59E0B', Jawa:'#3B82F6', Kalimantan:'#10B981',
  Sulawesi:'#8B5CF6', 'Bali-Nusra':'#F97316', Maluku:'#06B6D4', Papua:'#EF4444',
}

const ISLAND_TABS = ['Semua','Sumatera','Jawa','Kalimantan','Sulawesi','Bali-Nusra','Maluku','Papua']

// Format population: 5500000 → "5.5 jt"
function formatPop(pop) {
  if (!pop) return '—'
  if (pop >= 1_000_000) return `${(pop / 1_000_000).toFixed(1)} jt`
  if (pop >= 1_000) return `${(pop / 1_000).toFixed(0)} rb`
  return String(pop)
}

// Build province list from PROVINCES or fallback to INDONESIA_PROVINCES
function buildProvinceList() {
  if (PROVINCES.length > 0) return PROVINCES
  // Fallback: use INDONESIA_PROVINCES with minimal data
  const base = RegionsData.INDONESIA_PROVINCES || []
  return base.map(p => ({
    id: p.id,
    name: p.name,
    capital: p.capital,
    island: ISLAND_MAP[p.id] || 'Lainnya',
    governor_name: null,
    governor_party_id: null,
    population: null,
    dpr_seats: null,
  }))
}

const MADURA_IDS = ['bangkalan', 'sampang', 'pamekasan', 'sumenep']

// Party distribution for Jatim
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
  const [selectedProvince, setSelectedProvince] = useState(null)
  const [islandFilter, setIslandFilter] = useState('Semua')
  const [kabSearch, setKabSearch] = useState('')

  const provinces = useMemo(() => buildProvinceList(), [])

  const filteredProvinces = useMemo(() => {
    let list = provinces
    if (islandFilter !== 'Semua') {
      list = list.filter(p => (p.island || ISLAND_MAP[p.id]) === islandFilter)
    }
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.capital?.toLowerCase().includes(q))
    }
    return list
  }, [provinces, islandFilter, search])

  const filteredKabupaten = useMemo(() => {
    if (!kabSearch) return JATIM_REGIONS
    const q = kabSearch.toLowerCase()
    return JATIM_REGIONS.filter(r => r.name.toLowerCase().includes(q))
  }, [kabSearch])

  // Province detail view
  if (selectedProvince) {
    const prov = selectedProvince
    const island = prov.island || ISLAND_MAP[prov.id] || 'Lainnya'
    const islandColor = ISLAND_COLORS[island] || '#6B7280'
    const govParty = PARTY_MAP[prov.governor_party_id]
    const isJatim = prov.id === 'jawa-timur'
    const jatimGov = PERSONS.find(p => p.id === 'khofifah')

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedProvince(null)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary border border-border rounded-lg hover:bg-bg-elevated transition-colors"
          >
            ← Kembali
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-text-primary">{prov.name}</h1>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: islandColor + '20', color: islandColor }}
              >
                {island}
              </span>
              {govParty && (
                <span
                  className="text-xs px-2 py-0.5 rounded font-medium"
                  style={{ backgroundColor: govParty.color + '20', color: govParty.color }}
                >
                  {govParty.abbr}
                </span>
              )}
            </div>
            <p className="text-sm text-text-secondary mt-0.5">
              Ibu Kota: {prov.capital || prov.ibu_kota}
              {prov.population && ` · Populasi: ${formatPop(prov.population)}`}
              {prov.dpr_seats && ` · DPR: ${prov.dpr_seats} kursi`}
            </p>
          </div>
        </div>

        {/* Governor info */}
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-3">👤 Gubernur</h3>
          {isJatim ? (
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: '#00A550' }}
              >
                KI
              </div>
              <div>
                <Link to="/persons/khofifah" className="text-base font-semibold text-accent-blue hover:underline">
                  Khofifah Indar Parawansa
                </Link>
                <p className="text-sm text-text-secondary">Gubernur Jawa Timur · PKB</p>
              </div>
            </div>
          ) : prov.governor_name ? (
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: govParty?.color || '#374151' }}
              >
                {prov.governor_name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="text-base font-semibold text-text-primary">{prov.governor_name}</p>
                <p className="text-sm text-text-secondary">
                  Gubernur {prov.name}{govParty ? ` · ${govParty.abbr}` : ''}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-text-secondary">Data gubernur belum tersedia</p>
          )}
        </Card>

        {/* Kabupaten/Kota section */}
        {isJatim ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text-primary">🏘️ 38 Kabupaten/Kota Jawa Timur</h3>
              <SearchBar value={kabSearch} onChange={setKabSearch} placeholder="Cari kab/kota..." className="w-64" />
            </div>

            {/* Mini pie chart */}
            {pieData.length > 0 && (
              <Card className="p-4">
                <h4 className="text-xs font-semibold text-text-secondary mb-3">Distribusi Partai Bupati/Walikota</h4>
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width={140} height={140}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" outerRadius={60} dataKey="value" labelLine={false}>
                        {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1E2235', border: '1px solid #2D3748', borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-2">
                    {pieData.map(d => (
                      <span key={d.name} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded"
                        style={{ backgroundColor: d.color + '20', color: d.color }}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                        {d.name}: {d.value}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredKabupaten.map(region => {
                const party = PARTY_MAP[region.party_id]
                const bupati = region.bupati_id ? PERSONS.find(p => p.id === region.bupati_id) : null
                const isMadura = MADURA_IDS.includes(region.id)
                const atRisk = bupati && ['tersangka','terpidana'].includes(bupati.analysis?.corruption_risk)
                return (
                  <div
                    key={region.id}
                    className="bg-bg-card border border-border rounded-xl p-4 hover:border-gray-600 transition-all"
                    style={party ? { borderLeftColor: party.color, borderLeftWidth: 3 } : {}}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-text-primary">{region.name}</p>
                          {atRisk && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Berisiko" />}
                        </div>
                        <p className="text-xs text-text-secondary mt-0.5">
                          {region.type === 'kota' ? '🏙️ Kota' : '🏘️ Kabupaten'}
                          {isMadura ? ' · 🌊 Madura' : ''}
                        </p>
                      </div>
                      {party && (
                        <span className="text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0"
                          style={{ backgroundColor: party.color + '20', color: party.color }}>
                          {party.abbr}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-text-secondary">
                      {bupati ? (
                        <Link to={`/persons/${bupati.id}`} className="text-accent-blue hover:underline">
                          {region.type === 'kota' ? 'Walikota' : 'Bupati'}: {bupati.name}
                        </Link>
                      ) : (
                        <span className="italic">Data tidak tersedia</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-text-secondary">IK: {region.ibu_kota}</p>
                      <p className="text-xs text-text-secondary">~{formatPop(region.pop)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <Card className="p-10 text-center">
            <div className="text-5xl mb-4">🏗️</div>
            <h3 className="text-base font-semibold text-text-primary mb-2">Data Segera Hadir</h3>
            <p className="text-sm text-text-secondary">
              Data kabupaten/kota {prov.name} sedang disiapkan.
            </p>
            {prov.population && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3 max-w-md mx-auto">
                <div className="bg-bg-elevated rounded-lg p-3">
                  <p className="text-lg font-bold text-text-primary">{formatPop(prov.population)}</p>
                  <p className="text-xs text-text-secondary">Populasi</p>
                </div>
                {prov.dpr_seats && (
                  <div className="bg-bg-elevated rounded-lg p-3">
                    <p className="text-lg font-bold text-text-primary">{prov.dpr_seats}</p>
                    <p className="text-xs text-text-secondary">Kursi DPR</p>
                  </div>
                )}
                {prov.island && (
                  <div className="bg-bg-elevated rounded-lg p-3">
                    <p className="text-lg font-bold" style={{ color: islandColor }}>{prov.island}</p>
                    <p className="text-xs text-text-secondary">Kepulauan</p>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}
      </div>
    )
  }

  // Level 1: Province Grid
  const provinceCount = filteredProvinces.length

  return (
    <div className="space-y-6">
      <PageHeader
        title="🗺️ Peta Wilayah Indonesia"
        subtitle="38 Provinsi · Klik provinsi untuk detail kabupaten/kota"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-text-primary">38</p>
          <p className="text-xs text-text-secondary">Provinsi</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-text-primary">38</p>
          <p className="text-xs text-text-secondary">Kab/Kota Jatim</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-text-primary">7</p>
          <p className="text-xs text-text-secondary">Kelompok Pulau</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-text-primary">275 jt</p>
          <p className="text-xs text-text-secondary">Populasi Indonesia</p>
        </Card>
      </div>

      {/* Island filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {ISLAND_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setIslandFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              islandFilter === tab
                ? 'bg-accent-red text-white'
                : 'bg-bg-card border border-border text-text-secondary hover:text-text-primary hover:border-gray-600'
            }`}
            style={tab !== 'Semua' && islandFilter === tab ? { backgroundColor: ISLAND_COLORS[tab] || undefined } : {}}
          >
            {tab === 'Semua' ? '🌏 Semua' : tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <SearchBar value={search} onChange={setSearch} placeholder="Cari provinsi..." />

      <p className="text-sm text-text-secondary">
        Menampilkan <span className="text-text-primary font-medium">{provinceCount}</span> dari 38 provinsi
      </p>

      {/* Province Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filteredProvinces.map(prov => {
          const island = prov.island || ISLAND_MAP[prov.id] || 'Lainnya'
          const islandColor = ISLAND_COLORS[island] || '#6B7280'
          const govParty = PARTY_MAP[prov.governor_party_id]
          const isJatim = prov.id === 'jawa-timur'

          return (
            <div
              key={prov.id}
              onClick={() => setSelectedProvince(prov)}
              className={`bg-bg-card border rounded-xl p-4 cursor-pointer transition-all hover:border-gray-500 hover:shadow-lg ${
                isJatim ? 'border-accent-red/50 ring-1 ring-accent-red/20' : 'border-border'
              }`}
              style={{ borderLeftColor: islandColor, borderLeftWidth: 3 }}
            >
              {/* Island badge + name */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0"
                      style={{ backgroundColor: islandColor + '20', color: islandColor }}
                    >
                      {island}
                    </span>
                    {isJatim && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-red/20 text-accent-red font-medium">Pilot</span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-text-primary leading-tight">{prov.name}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{prov.capital || prov.ibu_kota}</p>
                </div>
                {govParty && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0"
                    style={{ backgroundColor: govParty.color + '20', color: govParty.color }}
                  >
                    {govParty.abbr}
                  </span>
                )}
              </div>

              {/* Governor */}
              <div className="text-xs text-text-secondary mt-2">
                {isJatim ? (
                  <span>Gubernur: <span className="text-text-primary">Khofifah I.P.</span></span>
                ) : prov.governor_name ? (
                  <span>Gubernur: <span className="text-text-primary">{prov.governor_name}</span></span>
                ) : (
                  <span className="italic text-text-muted">Data gubernur menyusul</span>
                )}
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-3 mt-2 text-xs text-text-secondary">
                {prov.population && <span>👥 {formatPop(prov.population)}</span>}
                {prov.dpr_seats && <span>🏛️ {prov.dpr_seats} kursi</span>}
                {!prov.population && <span className="text-text-muted">—</span>}
              </div>

              <div className="mt-3 pt-2 border-t border-border/50 text-right">
                <span className="text-[10px] text-text-muted">Klik untuk detail →</span>
              </div>
            </div>
          )
        })}
      </div>

      {filteredProvinces.length === 0 && (
        <div className="text-center py-16 text-text-secondary">
          <div className="text-4xl mb-3">🔍</div>
          <p>Provinsi tidak ditemukan. Coba ubah filter.</p>
        </div>
      )}
    </div>
  )
}
