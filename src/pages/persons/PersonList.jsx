import { useMemo, useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PERSONS } from '../../data/persons'
import { PARTIES } from '../../data/parties'
import PersonCard from '../../components/PersonCard'
import { SearchBar, Select, PageHeader } from '../../components/ui'

// ── Watchlist helpers ──────────────────────────────────────────────────────────
const getWatchlist = () => JSON.parse(localStorage.getItem('pp_watchlist') || '[]')
const saveWatchlist = (list) => localStorage.setItem('pp_watchlist', JSON.stringify(list))
const toggleWatchlistItem = (id) => {
  const w = getWatchlist()
  const idx = w.indexOf(id)
  if (idx >= 0) w.splice(idx, 1); else w.push(id)
  saveWatchlist(w)
  return [...w]
}

const RISK_ORDER = { rendah: 0, sedang: 1, tinggi: 2, tersangka: 3, terpidana: 4 }

// Island group → region_id prefixes / full IDs
const ISLAND_REGION_IDS = {
  Jawa: ['jawa-timur','jawa-barat','jawa-tengah','diy','dki-jakarta','banten'],
  Sumatera: ['aceh','sumatera-utara','sumatera-barat','riau','jambi','sumatera-selatan','bengkulu','lampung','bangka-belitung','kepri'],
  Kalimantan: ['kalimantan-barat','kalimantan-tengah','kalimantan-selatan','kalimantan-timur','kalimantan-utara'],
  Sulawesi: ['sulawesi-utara','sulawesi-tengah','sulawesi-selatan','sulawesi-tenggara','gorontalo','sulawesi-barat'],
  'Bali-Nusra': ['bali','nusa-tenggara-barat','nusa-tenggara-timur'],
  Maluku: ['maluku','maluku-utara'],
  Papua: ['papua-barat','papua-barat-daya','papua-tengah','papua-pegunungan','papua-selatan','papua'],
}

// Jabatan categorization based on position title
function getJabatan(person) {
  const title = (person.positions?.[0]?.title || '').toLowerCase()
  if (title.includes('presiden') && !title.includes('wakil')) return 'Presiden/Wapres'
  if (title.includes('wakil presiden')) return 'Presiden/Wapres'
  if (title.includes('menteri') || title.includes('menko') || title.includes('kepala badan') || title.includes('jaksa agung') || title.includes('kapolri')) return 'Menteri'
  if (title.includes('gubernur')) return 'Gubernur'
  if (title.includes('bupati') || title.includes('walikota')) return 'Bupati/Walikota'
  if (title.includes('anggota') || title.includes('dpr') || title.includes('mpr') || title.includes('dpd')) return 'DPR/MPR'
  // Check TNI/Polri by tags
  if (person.tags?.includes('eks-militer') || title.includes('jenderal') || title.includes('tni') || title.includes('polri') || title.includes('danjen') || title.includes('pangkostrad') || title.includes('kapolri')) return 'TNI/Polri'
  return null
}

export default function PersonList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [watchlist, setWatchlist] = useState(() => getWatchlist())
  const [showWatchlist, setShowWatchlist] = useState(false)

  const handleBookmark = useCallback((id) => {
    const updated = toggleWatchlistItem(id)
    setWatchlist(updated)
  }, [])

  const search       = searchParams.get('q')       || ''
  const filterTier   = searchParams.get('tier')    || ''
  const filterParty  = searchParams.get('party')   || ''
  const filterRisk   = searchParams.get('risk')    || ''
  const filterTag    = searchParams.get('tag')     || ''
  const filterWilayah = searchParams.get('wilayah') || ''
  const filterJabatan = searchParams.get('jabatan') || ''
  const sortBy       = searchParams.get('sort')    || 'name'

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next, { replace: true })
  }

  const setSearch       = (v) => setFilter('q', v)
  const setFilterTier   = (v) => setFilter('tier', v)
  const setFilterParty  = (v) => setFilter('party', v)
  const setFilterRisk   = (v) => setFilter('risk', v)
  const setFilterTag    = (v) => setFilter('tag', v)
  const setFilterWilayah = (v) => setFilter('wilayah', v)
  const setFilterJabatan = (v) => setFilter('jabatan', v)
  const setSortBy       = (v) => setFilter('sort', v === 'name' ? '' : v)

  const partyOptions = PARTIES.map(p => ({ value: p.id, label: `${p.logo_emoji} ${p.abbr}` }))

  const tierOptions = [
    { value: 'nasional', label: 'Nasional' },
    { value: 'provinsi', label: 'Provinsi' },
    { value: 'kabupaten', label: 'Kabupaten' },
  ]

  const riskOptions = [
    { value: 'rendah', label: '🟢 Rendah' },
    { value: 'sedang', label: '🟡 Sedang' },
    { value: 'tinggi', label: '🔴 Tinggi' },
    { value: 'tersangka', label: '⛔ Tersangka' },
    { value: 'terpidana', label: '🔴 Terpidana' },
  ]

  const tagOptions = [
    { value: 'eks-militer', label: '🎖️ Eks-Militer' },
    { value: 'pengusaha', label: '💼 Pengusaha' },
    { value: 'ulama', label: '📿 Ulama' },
    { value: 'perempuan', label: '👩 Perempuan' },
    { value: 'muda', label: '⚡ Muda' },
  ]

  const sortOptions = [
    { value: 'name', label: 'Nama A-Z' },
    { value: 'wealth', label: 'Kekayaan Tertinggi' },
    { value: 'risk', label: 'Risiko Korupsi' },
  ]

  const wilayahOptions = [
    { value: 'nasional', label: '🇮🇩 Nasional' },
    { value: 'Jawa', label: '🌏 Jawa' },
    { value: 'Sumatera', label: '🏝️ Sumatera' },
    { value: 'Kalimantan', label: '🌿 Kalimantan' },
    { value: 'Sulawesi', label: '🏔️ Sulawesi' },
    { value: 'Bali-Nusra', label: '🌺 Bali-Nusra' },
    { value: 'Maluku', label: '🌊 Maluku' },
    { value: 'Papua', label: '🦜 Papua' },
    { value: 'jawa-timur', label: '🗺️ Jawa Timur' },
  ]

  const jabatanOptions = [
    { value: 'Presiden/Wapres', label: '🏛️ Presiden/Wapres' },
    { value: 'Menteri', label: '📋 Menteri' },
    { value: 'Gubernur', label: '🗺️ Gubernur' },
    { value: 'Bupati/Walikota', label: '🏘️ Bupati/Walikota' },
    { value: 'DPR/MPR', label: '🏛️ DPR/MPR' },
    { value: 'TNI/Polri', label: '🎖️ TNI/Polri' },
  ]

  const filtered = useMemo(() => {
    let result = [...PERSONS]

    // Watchlist filter: if active, only show bookmarked persons
    if (showWatchlist) {
      result = result.filter(p => watchlist.includes(p.id))
    }

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.bio?.toLowerCase().includes(q) ||
        p.positions?.some(pos => pos.title?.toLowerCase().includes(q))
      )
    }

    if (filterTier) result = result.filter(p => p.tier === filterTier)
    if (filterParty) result = result.filter(p => p.party_id === filterParty)
    if (filterRisk) result = result.filter(p => p.analysis?.corruption_risk === filterRisk)
    if (filterTag) result = result.filter(p => p.tags?.includes(filterTag))

    // Wilayah filter
    if (filterWilayah) {
      if (filterWilayah === 'nasional') {
        result = result.filter(p => p.tier === 'nasional')
      } else if (filterWilayah === 'jawa-timur') {
        result = result.filter(p => p.region_id === 'jawa-timur')
      } else {
        const ids = ISLAND_REGION_IDS[filterWilayah] || []
        result = result.filter(p => ids.includes(p.region_id))
      }
    }

    // Jabatan filter
    if (filterJabatan) {
      result = result.filter(p => getJabatan(p) === filterJabatan)
    }

    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'wealth') return (b.lhkpn_latest || 0) - (a.lhkpn_latest || 0)
      if (sortBy === 'risk') {
        return (RISK_ORDER[b.analysis?.corruption_risk] || 0) - (RISK_ORDER[a.analysis?.corruption_risk] || 0)
      }
      return 0
    })

    return result
  }, [search, filterTier, filterParty, filterRisk, filterTag, filterWilayah, filterJabatan, sortBy, showWatchlist, watchlist])

  const hasActiveFilter = search || filterTier || filterParty || filterRisk || filterTag || filterWilayah || filterJabatan

  const resetAll = () => {
    setSearchParams({}, { replace: true })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <PageHeader
          title="👥 Tokoh Politik"
          subtitle={`${PERSONS.length} tokoh terdaftar`}
        />
        <button
          onClick={() => setShowWatchlist(v => !v)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
            showWatchlist
              ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
              : 'bg-bg-card border-border text-text-secondary hover:text-text-primary'
          }`}
        >
          {showWatchlist ? '⭐' : '☆'} Pantauan
          {watchlist.length > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold ${
              showWatchlist ? 'bg-yellow-500 text-black' : 'bg-bg-elevated text-text-secondary'
            }`}>{watchlist.length}</span>
          )}
        </button>
      </div>

      {/* Search */}
      <SearchBar value={search} onChange={setSearch} placeholder="Cari nama, jabatan, atau bio..." />

      {/* Filters — Row 1: Wilayah + Jabatan + Tier */}
      <div className="flex flex-wrap gap-3">
        <Select
          value={filterWilayah}
          onChange={setFilterWilayah}
          options={wilayahOptions}
          placeholder="🌏 Semua Wilayah"
          className="min-w-[160px]"
        />
        <Select
          value={filterJabatan}
          onChange={setFilterJabatan}
          options={jabatanOptions}
          placeholder="💼 Semua Jabatan"
          className="min-w-[160px]"
        />
        <Select
          value={filterTier}
          onChange={setFilterTier}
          options={tierOptions}
          placeholder="Semua Tingkat"
          className="min-w-[140px]"
        />
        <Select
          value={filterParty}
          onChange={setFilterParty}
          options={partyOptions}
          placeholder="Semua Partai"
          className="min-w-[140px]"
        />
        <Select
          value={filterRisk}
          onChange={setFilterRisk}
          options={riskOptions}
          placeholder="Semua Risiko"
          className="min-w-[140px]"
        />
        <Select
          value={filterTag}
          onChange={setFilterTag}
          options={tagOptions}
          placeholder="Semua Tag"
          className="min-w-[140px]"
        />
        <Select
          value={sortBy}
          onChange={setSortBy}
          options={sortOptions}
          placeholder="Urutkan"
          className="min-w-[160px]"
        />
        {hasActiveFilter && (
          <button
            onClick={resetAll}
            className="px-3 py-2 text-xs text-text-secondary hover:text-text-primary border border-border rounded-lg transition-colors"
          >
            ✕ Reset
          </button>
        )}
      </div>

      {/* Active filter chips */}
      {(filterWilayah || filterJabatan) && (
        <div className="flex flex-wrap gap-2">
          {filterWilayah && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
              🌏 {wilayahOptions.find(o => o.value === filterWilayah)?.label || filterWilayah}
              <button onClick={() => setFilterWilayah('')} className="hover:text-blue-200">×</button>
            </span>
          )}
          {filterJabatan && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full">
              💼 {filterJabatan}
              <button onClick={() => setFilterJabatan('')} className="hover:text-purple-200">×</button>
            </span>
          )}
        </div>
      )}

      {/* Count */}
      <p className="text-sm text-text-secondary">
        Menampilkan <span className="text-text-primary font-medium">{filtered.length}</span> dari{' '}
        <span className="text-text-primary font-medium">{PERSONS.length}</span> tokoh
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-text-secondary">
          <div className="text-5xl mb-4">{showWatchlist ? '⭐' : '🔍'}</div>
          <p className="font-medium">
            {showWatchlist ? 'Belum ada tokoh di pantauan' : '🔍 Tidak ada tokoh ditemukan untuk filter ini'}
          </p>
          <p className="text-sm mt-1">
            {showWatchlist
              ? 'Klik ☆ pada kartu tokoh untuk menambahkan ke pantauan'
              : 'Coba ubah filter atau kata kunci pencarian'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map(person => (
            <PersonCard
              key={person.id}
              person={person}
              bookmarked={watchlist.includes(person.id)}
              onBookmark={handleBookmark}
            />
          ))}
        </div>
      )}
    </div>
  )
}
