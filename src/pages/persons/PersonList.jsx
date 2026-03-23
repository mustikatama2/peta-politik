import { useMemo, useState, useCallback, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { PERSONS } from '../../data/persons'
import { PARTIES } from '../../data/parties'
import { CONNECTIONS } from '../../data/connections'
import { KPK_CASES } from '../../data/kpk_cases'
import { AGENDAS } from '../../data/agendas'
import PersonCard from '../../components/PersonCard'
import { SearchBar, Select, PageHeader, toast, SkeletonCard } from '../../components/ui'
import MetaTags from '../../components/MetaTags'

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

// ── Pre-computed lookups ───────────────────────────────────────────────────────
const RISK_ORDER = { rendah: 0, sedang: 1, tinggi: 2, tersangka: 3, terpidana: 4 }

const KPK_SUSPECT_IDS = new Set(KPK_CASES.flatMap(c => c.suspects || []))

const CONNECTION_COUNTS = {}
CONNECTIONS.forEach(c => {
  CONNECTION_COUNTS[c.from] = (CONNECTION_COUNTS[c.from] || 0) + 1
  CONNECTION_COUNTS[c.to] = (CONNECTION_COUNTS[c.to] || 0) + 1
})

// Agenda appearances per person
const AGENDA_COUNTS = {}
AGENDAS.forEach(a => {
  if (a.subject_type === 'person') {
    AGENDA_COUNTS[a.subject_id] = (AGENDA_COUNTS[a.subject_id] || 0) + 1
  }
})

// Island group → region IDs
const ISLAND_REGION_IDS = {
  Jawa: ['jawa-timur','jawa-barat','jawa-tengah','diy','dki-jakarta','banten'],
  Sumatera: ['aceh','sumatera-utara','sumatera-barat','riau','jambi','sumatera-selatan','bengkulu','lampung','bangka-belitung','kepri'],
  Kalimantan: ['kalimantan-barat','kalimantan-tengah','kalimantan-selatan','kalimantan-timur','kalimantan-utara'],
  Sulawesi: ['sulawesi-utara','sulawesi-tengah','sulawesi-selatan','sulawesi-tenggara','gorontalo','sulawesi-barat'],
  'Bali-Nusra': ['bali','nusa-tenggara-barat','nusa-tenggara-timur'],
  Maluku: ['maluku','maluku-utara'],
  Papua: ['papua-barat','papua-barat-daya','papua-tengah','papua-pegunungan','papua-selatan','papua'],
}

function getJabatan(person) {
  const title = (person.positions?.[0]?.title || '').toLowerCase()
  if (title.includes('presiden') && !title.includes('wakil')) return 'Presiden/Wapres'
  if (title.includes('wakil presiden')) return 'Presiden/Wapres'
  if (title.includes('menteri') || title.includes('menko') || title.includes('kepala badan') || title.includes('jaksa agung') || title.includes('kapolri')) return 'Menteri'
  if (title.includes('gubernur')) return 'Gubernur'
  if (title.includes('bupati') || title.includes('walikota')) return 'Bupati/Walikota'
  if (title.includes('anggota') || title.includes('dpr') || title.includes('mpr') || title.includes('dpd')) return 'DPR/MPR'
  if (person.tags?.includes('eks-militer') || title.includes('jenderal') || title.includes('tni') || title.includes('polri') || title.includes('danjen') || title.includes('pangkostrad') || title.includes('kapolri')) return 'TNI/Polri'
  return null
}

const PAGE_SIZE = 50

function fmtLhkpn(val) {
  if (!val) return '—'
  const m = val / 1e9
  if (m >= 1000) return `Rp ${(m / 1000).toFixed(1)} T`
  return `Rp ${m.toFixed(0)} M`
}

function getPartyAbbr(partyId) {
  const p = PARTIES.find(x => x.id === partyId)
  return p ? `${p.logo_emoji} ${p.abbr}` : (partyId || '—')
}

const TIER_LABEL = { nasional: 'Nasional', provinsi: 'Regional', kabupaten: 'Kabupaten', historis: 'Historis' }
const RISK_COLOR = { rendah: 'text-green-400', sedang: 'text-yellow-400', tinggi: 'text-red-400', tersangka: 'text-red-500', terpidana: 'text-red-600' }

// ── "Tokoh Terpanas" — top 6 by controversy_level ─────────────────────────────
const HOT_PERSONS = PERSONS
  .filter(p => p.tier !== 'historis')
  .map(p => ({ person: p, score: p.analysis?.controversy_level || 0 }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 6)
  .map(x => x.person)

// ── KPI Stats ─────────────────────────────────────────────────────────────────
const STATS = {
  total:    PERSONS.length,
  nasional: PERSONS.filter(p => p.tier === 'nasional').length,
  tersangka: PERSONS.filter(p => (p.analysis?.controversy_level || 0) >= 8 || KPK_SUSPECT_IDS.has(p.id)).length,
  aktif:    PERSONS.filter(p => p.positions?.some(pos => pos.is_current)).length,
}

// ── LocalStorage sort preference ───────────────────────────────────────────────
const getSavedSort = () => localStorage.getItem('pp_sort') || 'name'
const saveSort = (v) => localStorage.setItem('pp_sort', v)

export default function PersonList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [watchlist, setWatchlist] = useState(() => getWatchlist())
  const [showWatchlist, setShowWatchlist] = useState(false)
  const [livePersonIds, setLivePersonIds] = useState(new Set())
  const [compareP1, setCompareP1] = useState(() => localStorage.getItem('compare_p1') || null)
  const [isLoading, setIsLoading] = useState(true)

  // View state
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('pp_view') || 'grid')
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [page, setPage] = useState(1)

  // Advanced filter state
  const [advParties, setAdvParties] = useState([])          // array of party IDs
  const [advIdeology, setAdvIdeology] = useState(null)       // null = off, 1-9 active
  const [advLhkpnMin, setAdvLhkpnMin] = useState('')         // in Miliar
  const [advLhkpnMax, setAdvLhkpnMax] = useState('')         // in Miliar
  const [advOnlyPhoto, setAdvOnlyPhoto] = useState(false)
  const [advOnlyKpk, setAdvOnlyKpk] = useState(false)

  // Extended sort (localStorage)
  const [sortBy, setSortByState] = useState(() => getSavedSort())

  const setSortBy = (v) => {
    setSortByState(v)
    saveSort(v)
    setPage(1)
  }

  const setViewModeAndPersist = (v) => {
    setViewMode(v)
    localStorage.setItem('pp_view', v)
  }

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    fetch('/api/news?limit=100')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data?.articles) return
        const ids = new Set(data.articles.flatMap(a => a.person_ids || []))
        setLivePersonIds(ids)
      })
      .catch(() => {})
  }, [])

  const handleBookmark = useCallback((id) => {
    const updated = toggleWatchlistItem(id)
    setWatchlist(updated)
  }, [])

  const handleCompare = useCallback((personId) => {
    const existing = localStorage.getItem('compare_p1')
    if (!existing) {
      localStorage.setItem('compare_p1', personId)
      setCompareP1(personId)
      toast('Pilih satu lagi untuk dibandingkan', 'info')
    } else if (existing === personId) {
      localStorage.removeItem('compare_p1')
      setCompareP1(null)
    } else {
      localStorage.removeItem('compare_p1')
      setCompareP1(null)
      navigate(`/compare/${existing}/${personId}`)
    }
  }, [navigate])

  // URL-based filters (basic)
  const search        = searchParams.get('q')       || ''
  const filterTier    = searchParams.get('tier')    || ''
  const filterParty   = searchParams.get('party')   || ''
  const filterRisk    = searchParams.get('risk')    || ''
  const filterTag     = searchParams.get('tag')     || ''
  const filterWilayah     = searchParams.get('wilayah')      || ''
  const filterJabatan     = searchParams.get('jabatan')      || ''
  const filterActive      = searchParams.get('active')       || ''
  const filterControversy = searchParams.get('controversy')  || ''

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value); else next.delete(key)
    setSearchParams(next, { replace: true })
    setPage(1)
  }

  const setSearch        = (v) => setFilter('q', v)
  const setFilterTier    = (v) => setFilter('tier', v)
  const setFilterParty   = (v) => setFilter('party', v)
  const setFilterRisk    = (v) => setFilter('risk', v)
  const setFilterTag     = (v) => setFilter('tag', v)
  const setFilterWilayah     = (v) => setFilter('wilayah', v)
  const setFilterJabatan     = (v) => setFilter('jabatan', v)
  const setFilterActive      = (v) => setFilter('active', v)
  const setFilterControversy = (v) => setFilter('controversy', v)

  // Toggle party in advanced multi-select
  const toggleAdvParty = (pid) => {
    setAdvParties(prev => prev.includes(pid) ? prev.filter(x => x !== pid) : [...prev, pid])
    setPage(1)
  }

  const resetAdvanced = () => {
    setAdvParties([])
    setAdvIdeology(null)
    setAdvLhkpnMin('')
    setAdvLhkpnMax('')
    setAdvOnlyPhoto(false)
    setAdvOnlyKpk(false)
    setPage(1)
  }

  // Active advanced filter count
  const advActiveCount = useMemo(() => {
    let n = 0
    if (advParties.length) n++
    if (advIdeology !== null) n++
    if (advLhkpnMin !== '') n++
    if (advLhkpnMax !== '') n++
    if (advOnlyPhoto) n++
    if (advOnlyKpk) n++
    return n
  }, [advParties, advIdeology, advLhkpnMin, advLhkpnMax, advOnlyPhoto, advOnlyKpk])

  // ── Options ──────────────────────────────────────────────────────────────────
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
    { value: 'name', label: 'Nama A→Z' },
    { value: 'name_desc', label: 'Nama Z→A' },
    { value: 'influence', label: 'Skor Pengaruh ↓' },
    { value: 'wealth', label: 'LHKPN Terkaya ↓' },
    { value: 'connections', label: 'Koneksi Terbanyak ↓' },
    { value: 'controversy', label: 'Kontroversi Tertinggi ↓' },
    { value: 'risk', label: 'Risiko Korupsi ↓' },
    { value: 'birth_year', label: 'Tahun Lahir ↑' },
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

  const activeOptions = [
    { value: 'aktif',       label: '✅ Aktif' },
    { value: 'tidak-aktif', label: '❌ Tidak Aktif' },
  ]

  const controversyOptions = [
    { value: 'rendah', label: '🟢 Rendah (<4)' },
    { value: 'sedang', label: '🟡 Sedang (4–6)' },
    { value: 'tinggi', label: '🔴 Tinggi (>6)' },
  ]

  const jabatanOptions = [
    { value: 'Presiden/Wapres', label: '🏛️ Presiden/Wapres' },
    { value: 'Menteri', label: '📋 Menteri' },
    { value: 'Gubernur', label: '🗺️ Gubernur' },
    { value: 'Bupati/Walikota', label: '🏘️ Bupati/Walikota' },
    { value: 'DPR/MPR', label: '🏛️ DPR/MPR' },
    { value: 'TNI/Polri', label: '🎖️ TNI/Polri' },
  ]

  // ── Filtered & sorted list ────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = [...PERSONS]

    if (showWatchlist) result = result.filter(p => watchlist.includes(p.id))

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.bio?.toLowerCase().includes(q) ||
        p.positions?.some(pos => pos.title?.toLowerCase().includes(q))
      )
    }

    // Basic URL filters
    if (filterTier)    result = result.filter(p => p.tier === filterTier)
    if (filterParty)   result = result.filter(p => p.party_id === filterParty)
    if (filterRisk)    result = result.filter(p => p.analysis?.corruption_risk === filterRisk)
    if (filterTag)     result = result.filter(p => p.tags?.includes(filterTag))

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

    if (filterJabatan) result = result.filter(p => getJabatan(p) === filterJabatan)

    if (filterActive === 'aktif')       result = result.filter(p => p.positions?.some(pos => pos.is_current))
    if (filterActive === 'tidak-aktif') result = result.filter(p => !p.positions?.some(pos => pos.is_current))

    if (filterControversy === 'rendah') result = result.filter(p => (p.analysis?.controversy_level || 0) < 4)
    if (filterControversy === 'sedang') result = result.filter(p => { const v = p.analysis?.controversy_level || 0; return v >= 4 && v <= 6 })
    if (filterControversy === 'tinggi') result = result.filter(p => (p.analysis?.controversy_level || 0) > 6)

    // Advanced filters
    if (advParties.length) result = result.filter(p => advParties.includes(p.party_id))

    if (advIdeology !== null) {
      const lo = advIdeology - 1, hi = advIdeology + 1
      result = result.filter(p => {
        const s = p.analysis?.ideology_score
        return s != null && s >= lo && s <= hi
      })
    }

    if (advLhkpnMin !== '') {
      const min = parseFloat(advLhkpnMin) * 1e9
      result = result.filter(p => (p.lhkpn_latest || 0) >= min)
    }
    if (advLhkpnMax !== '') {
      const max = parseFloat(advLhkpnMax) * 1e9
      result = result.filter(p => (p.lhkpn_latest || 0) <= max)
    }

    if (advOnlyPhoto) result = result.filter(p => !!p.photo_url)
    if (advOnlyKpk)   result = result.filter(p => KPK_SUSPECT_IDS.has(p.id))

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':        return a.name.localeCompare(b.name)
        case 'name_desc':   return b.name.localeCompare(a.name)
        case 'influence':   return (b.analysis?.influence || 0) - (a.analysis?.influence || 0)
        case 'wealth':      return (b.lhkpn_latest || 0) - (a.lhkpn_latest || 0)
        case 'connections': return (CONNECTION_COUNTS[b.id] || 0) - (CONNECTION_COUNTS[a.id] || 0)
        case 'controversy': return (b.analysis?.controversy_level || 0) - (a.analysis?.controversy_level || 0)
        case 'risk':        return (RISK_ORDER[b.analysis?.corruption_risk] || 0) - (RISK_ORDER[a.analysis?.corruption_risk] || 0)
        case 'birth_year': {
          const getYear = p => { const m = (p.born || '').match(/\d{4}/); return m ? parseInt(m[0]) : 9999 }
          return getYear(a) - getYear(b)
        }
        default:            return a.name.localeCompare(b.name)
      }
    })

    return result
  }, [search, filterTier, filterParty, filterRisk, filterTag, filterWilayah, filterJabatan,
      filterActive, filterControversy,
      sortBy, showWatchlist, watchlist,
      advParties, advIdeology, advLhkpnMin, advLhkpnMax, advOnlyPhoto, advOnlyKpk])

  const visiblePersons = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page])
  const hasMore = filtered.length > page * PAGE_SIZE

  const hasActiveFilter = search || filterTier || filterParty || filterRisk || filterTag || filterWilayah || filterJabatan || filterActive || filterControversy || advActiveCount

  const resetAll = () => {
    setSearchParams({}, { replace: true })
    resetAdvanced()
    setPage(1)
  }

  // Tier button for advanced filter — maps to tier values
  const ADV_TIER_OPTS = [
    { label: 'Semua', value: '' },
    { label: 'Nasional', value: 'nasional' },
    { label: 'Regional', value: 'provinsi' },
    { label: 'Kabupaten', value: 'kabupaten' },
  ]

  const ADV_RISK_OPTS = [
    { label: 'Semua', value: '' },
    { label: '🟢 Rendah', value: 'rendah' },
    { label: '🟡 Sedang', value: 'sedang' },
    { label: '🔴 Tinggi', value: 'tinggi' },
  ]

  return (
    <div className="space-y-5">
      <MetaTags title="Tokoh Politik" description="Direktori tokoh-tokoh politik Indonesia — profil, jabatan, kekayaan, dan rekam jejak" />

      {/* ── Stats Bar ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Tokoh',        value: STATS.total,     icon: '👥', color: 'text-text-primary' },
          { label: 'Tokoh Nasional',     value: STATS.nasional,  icon: '🏛️',  color: 'text-blue-400' },
          { label: 'Tersangka/Terdakwa', value: STATS.tersangka, icon: '⚖️',  color: 'text-red-400' },
          { label: 'Aktif Menjabat',     value: STATS.aktif,     icon: '✅',  color: 'text-green-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-bg-card border border-border rounded-xl p-3 flex flex-col items-center justify-center gap-1">
            <div className={`text-2xl font-bold tabular-nums ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-text-secondary text-center">{stat.icon} {stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── Tokoh Terpanas ──────────────────────────────────────────────────── */}
      <div className="bg-bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            🔥 Tokoh Terpanas (Kontroversi Tertinggi)
          </h2>
          <Link to="/persons?controversy=tinggi" className="text-xs text-accent hover:underline">Lihat semua →</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'thin' }}>
          {HOT_PERSONS.map((p, i) => {
            const controversy = p.analysis?.controversy_level || 0
            const flameCount = Math.min(Math.ceil(controversy / 2), 5)
            const flames = '🔥'.repeat(flameCount)
            return (
              <Link key={p.id} to={`/persons/${p.id}`}
                className="flex-shrink-0 w-32 flex flex-col items-center gap-1.5 p-3 rounded-xl bg-bg-elevated hover:bg-bg-hover border border-border/50 hover:border-orange-500/40 transition-all group">
                <div className="relative">
                  {p.photo_url ? (
                    <img src={p.photo_url} alt={p.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-orange-500/40" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-orange-500/15 border-2 border-orange-500/40 flex items-center justify-center text-sm font-bold text-orange-400">
                      {p.photo_placeholder || p.name[0]}
                    </div>
                  )}
                  <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center shadow">
                    {i + 1}
                  </span>
                </div>
                <p className="text-xs font-medium text-text-primary text-center truncate w-full group-hover:text-accent transition-colors leading-tight">
                  {p.name.split(' ').slice(0, 2).join(' ')}
                </p>
                <p className="text-[11px] text-orange-400 font-medium tracking-wide">{flames}</p>
                <p className="text-[10px] text-text-muted text-center truncate w-full leading-tight">
                  {(p.positions?.[0]?.title || '—').split(' ').slice(0, 3).join(' ')}
                </p>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <PageHeader
          title="👥 Tokoh Politik"
          subtitle={`${PERSONS.length} tokoh terdaftar`}
        />
        <div className="flex items-center gap-2 flex-wrap">
          {/* View toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setViewModeAndPersist('grid')}
              className={`px-3 py-2 text-sm transition-colors ${viewMode === 'grid' ? 'bg-accent/20 text-accent' : 'bg-bg-card text-text-secondary hover:text-text-primary'}`}
              title="Grid View"
            >⊞</button>
            <button
              onClick={() => setViewModeAndPersist('list')}
              className={`px-3 py-2 text-sm transition-colors ${viewMode === 'list' ? 'bg-accent/20 text-accent' : 'bg-bg-card text-text-secondary hover:text-text-primary'}`}
              title="List View"
            >☰</button>
          </div>

          {/* Watchlist */}
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
      </div>

      {/* ── Search + Sort ────────────────────────────────────────────────────── */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <SearchBar value={search} onChange={setSearch} placeholder="Cari nama, jabatan, atau bio..." />
        </div>
        <Select
          value={sortBy}
          onChange={setSortBy}
          options={sortOptions}
          placeholder="Urutkan"
          className="min-w-[200px]"
        />
      </div>

      {/* ── Basic Filters ────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        <Select value={filterWilayah} onChange={setFilterWilayah} options={wilayahOptions} placeholder="🌏 Semua Wilayah" className="min-w-[160px]" />
        <Select value={filterJabatan} onChange={setFilterJabatan} options={jabatanOptions} placeholder="💼 Semua Jabatan" className="min-w-[160px]" />
        <Select value={filterTier}    onChange={setFilterTier}    options={tierOptions}    placeholder="Semua Tingkat"   className="min-w-[140px]" />
        <Select value={filterParty}   onChange={setFilterParty}   options={partyOptions}   placeholder="Semua Partai"   className="min-w-[140px]" />
        <Select value={filterRisk}        onChange={setFilterRisk}        options={riskOptions}        placeholder="Semua Risiko"    className="min-w-[140px]" />
        <Select value={filterTag}         onChange={setFilterTag}         options={tagOptions}         placeholder="Semua Tag"       className="min-w-[140px]" />
        <Select value={filterActive}      onChange={setFilterActive}      options={activeOptions}      placeholder="Aktif / Tidak"   className="min-w-[140px]" />
        <Select value={filterControversy} onChange={setFilterControversy} options={controversyOptions} placeholder="Kontroversi"     className="min-w-[140px]" />

        {/* Filter Lanjutan toggle */}
        <button
          onClick={() => setAdvancedOpen(v => !v)}
          className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
            advancedOpen || advActiveCount > 0
              ? 'bg-accent/15 text-accent border-accent/40'
              : 'bg-bg-card border-border text-text-secondary hover:text-text-primary'
          }`}
        >
          🔬 Filter Lanjutan
          {advActiveCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
              {advActiveCount}
            </span>
          )}
        </button>

        {hasActiveFilter && (
          <button onClick={resetAll} className="px-3 py-2 text-xs text-text-secondary hover:text-text-primary border border-border rounded-lg transition-colors">
            ✕ Reset
          </button>
        )}
      </div>

      {/* ── Advanced Filter Panel ─────────────────────────────────────────────── */}
      {advancedOpen && (
        <div className="bg-bg-card border border-border rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">🔬 Filter Lanjutan</h3>
            {advActiveCount > 0 && (
              <button onClick={resetAdvanced} className="text-xs text-text-secondary hover:text-accent transition-colors">
                Reset filter ini
              </button>
            )}
          </div>

          {/* Partai multi-select */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-2">Partai (pilih beberapa)</label>
            <div className="flex flex-wrap gap-1.5">
              {PARTIES.map(party => (
                <button
                  key={party.id}
                  onClick={() => toggleAdvParty(party.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                    advParties.includes(party.id)
                      ? 'bg-accent/20 text-accent border-accent/50'
                      : 'bg-bg-elevated border-border text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {party.logo_emoji} {party.abbr}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Tier buttons */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2">Tingkat</label>
              <div className="flex gap-1.5 flex-wrap">
                {ADV_TIER_OPTS.map(opt => (
                  <button key={opt.value}
                    onClick={() => { setFilterTier(opt.value); setPage(1) }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      filterTier === opt.value
                        ? 'bg-accent/20 text-accent border-accent/50'
                        : 'bg-bg-elevated border-border text-text-secondary hover:text-text-primary'
                    }`}
                  >{opt.label}</button>
                ))}
              </div>
            </div>

            {/* Risk buttons */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2">Risiko Korupsi</label>
              <div className="flex gap-1.5 flex-wrap">
                {ADV_RISK_OPTS.map(opt => (
                  <button key={opt.value}
                    onClick={() => { setFilterRisk(opt.value); setPage(1) }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      filterRisk === opt.value
                        ? 'bg-accent/20 text-accent border-accent/50'
                        : 'bg-bg-elevated border-border text-text-secondary hover:text-text-primary'
                    }`}
                  >{opt.label}</button>
                ))}
              </div>
            </div>

            {/* LHKPN range */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2">LHKPN (Miliar Rp)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={advLhkpnMin}
                  onChange={e => { setAdvLhkpnMin(e.target.value); setPage(1) }}
                  placeholder="Min"
                  className="w-full px-3 py-1.5 bg-bg-elevated border border-border rounded-lg text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
                />
                <span className="text-text-secondary text-xs shrink-0">—</span>
                <input
                  type="number"
                  value={advLhkpnMax}
                  onChange={e => { setAdvLhkpnMax(e.target.value); setPage(1) }}
                  placeholder="Max"
                  className="w-full px-3 py-1.5 bg-bg-elevated border border-border rounded-lg text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          {/* Ideology slider */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-2">
              Ideologi (skala 1–9)
              {advIdeology !== null && (
                <span className="ml-2 text-accent font-semibold">
                  {advIdeology} <span className="text-text-secondary font-normal">(±1 dari nilai ini)</span>
                </span>
              )}
            </label>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-text-secondary w-16 text-right">Kiri (1)</span>
              <input
                type="range" min="1" max="9" step="1"
                value={advIdeology ?? 5}
                onChange={e => { setAdvIdeology(parseInt(e.target.value)); setPage(1) }}
                className="flex-1 accent-accent"
              />
              <span className="text-[10px] text-text-secondary w-16">Kanan (9)</span>
              {advIdeology !== null && (
                <button onClick={() => { setAdvIdeology(null); setPage(1) }} className="text-[10px] text-text-secondary hover:text-accent ml-1">✕</button>
              )}
            </div>
            {advIdeology === null && (
              <p className="text-[10px] text-text-muted mt-1">Geser slider untuk mengaktifkan filter ideologi</p>
            )}
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={advOnlyPhoto} onChange={e => { setAdvOnlyPhoto(e.target.checked); setPage(1) }}
                className="accent-accent w-4 h-4" />
              <span className="text-xs text-text-secondary">📷 Hanya dengan foto</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={advOnlyKpk} onChange={e => { setAdvOnlyKpk(e.target.checked); setPage(1) }}
                className="accent-accent w-4 h-4" />
              <span className="text-xs text-text-secondary">⚖️ Hanya dengan kasus KPK</span>
            </label>
          </div>
        </div>
      )}

      {/* ── Active filter chips ──────────────────────────────────────────────── */}
      {(filterWilayah || filterJabatan || advParties.length > 0) && (
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
          {advParties.map(pid => {
            const p = PARTIES.find(x => x.id === pid)
            return p ? (
              <span key={pid} className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-accent/10 text-accent border border-accent/20 rounded-full">
                {p.logo_emoji} {p.abbr}
                <button onClick={() => toggleAdvParty(pid)} className="hover:opacity-70">×</button>
              </span>
            ) : null
          })}
          {advOnlyKpk && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded-full">
              ⚖️ Kasus KPK
              <button onClick={() => setAdvOnlyKpk(false)} className="hover:opacity-70">×</button>
            </span>
          )}
        </div>
      )}

      {/* ── Count ────────────────────────────────────────────────────────────── */}
      <p className="text-sm text-text-secondary">
        Menampilkan{' '}
        <span className="text-text-primary font-medium">{Math.min(visiblePersons.length, filtered.length)}</span>
        {' '}dari{' '}
        <span className="text-text-primary font-medium">{filtered.length}</span>
        {filtered.length !== PERSONS.length && (
          <> (total <span className="text-text-primary font-medium">{PERSONS.length}</span>)</>
        )}{' '}tokoh
      </p>

      {/* ── Content ──────────────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-text-secondary">
          <div className="text-5xl mb-4">{showWatchlist ? '⭐' : '🔍'}</div>
          <p className="font-medium">
            {showWatchlist ? 'Belum ada tokoh di pantauan' : 'Tidak ada tokoh ditemukan untuk filter ini'}
          </p>
          <p className="text-sm mt-1">
            {showWatchlist
              ? 'Klik ☆ pada kartu tokoh untuk menambahkan ke pantauan'
              : 'Coba ubah filter atau kata kunci pencarian'}
          </p>
        </div>
      ) : viewMode === 'list' ? (
        /* ── List View ─────────────────────────────────────────────────────── */
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-elevated">
                <th className="px-3 py-2.5 text-left text-xs font-medium text-text-secondary w-10">#</th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-text-secondary">Nama</th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-text-secondary hidden sm:table-cell">Partai</th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-text-secondary hidden md:table-cell">Tingkat</th>
                <th className="px-3 py-2.5 text-right text-xs font-medium text-text-secondary hidden lg:table-cell">LHKPN</th>
                <th className="px-3 py-2.5 text-right text-xs font-medium text-text-secondary hidden lg:table-cell">Pengaruh</th>
                <th className="px-3 py-2.5 text-right text-xs font-medium text-text-secondary hidden xl:table-cell">Koneksi</th>
                <th className="px-3 py-2.5 text-center text-xs font-medium text-text-secondary hidden xl:table-cell">KPK</th>
              </tr>
            </thead>
            <tbody>
              {visiblePersons.map((person, idx) => {
                const isSelected = compareP1 === person.id
                const hasKpk = KPK_SUSPECT_IDS.has(person.id)
                const connCount = CONNECTION_COUNTS[person.id] || 0
                const risk = person.analysis?.corruption_risk
                return (
                  <tr key={person.id}
                    className={`border-b border-border/50 hover:bg-bg-elevated/60 transition-colors cursor-pointer ${isSelected ? 'bg-blue-500/10' : ''}`}
                    onClick={() => navigate(`/persons/${person.id}`)}
                  >
                    <td className="px-3 py-2.5 text-text-secondary text-xs w-10">{idx + 1}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        {person.photo_url ? (
                          <img src={person.photo_url} alt={person.name}
                            className="w-8 h-8 rounded-full object-cover border border-border shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-bg-hover border border-border flex items-center justify-center text-[10px] font-bold text-text-secondary shrink-0">
                            {person.photo_placeholder || person.name[0]}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-text-primary truncate text-sm">{person.name}</p>
                          <p className="text-[10px] text-text-secondary truncate hidden sm:block">
                            {person.positions?.[0]?.title || ''}
                          </p>
                        </div>
                        {livePersonIds.has(person.id) && (
                          <span className="shrink-0 w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Ada berita terbaru" />
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 hidden sm:table-cell">
                      <span className="text-xs text-text-secondary">{getPartyAbbr(person.party_id)}</span>
                    </td>
                    <td className="px-3 py-2.5 hidden md:table-cell">
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-bg-elevated border border-border text-text-secondary">
                        {TIER_LABEL[person.tier] || person.tier}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right hidden lg:table-cell">
                      <span className="text-xs text-text-secondary">{fmtLhkpn(person.lhkpn_latest)}</span>
                    </td>
                    <td className="px-3 py-2.5 text-right hidden lg:table-cell">
                      <span className="text-xs font-mono text-text-primary">{person.analysis?.influence ?? '—'}</span>
                    </td>
                    <td className="px-3 py-2.5 text-right hidden xl:table-cell">
                      <span className="text-xs text-text-secondary">{connCount}</span>
                    </td>
                    <td className="px-3 py-2.5 text-center hidden xl:table-cell">
                      {hasKpk ? (
                        <span className="text-red-400 text-xs" title="Ada kasus KPK">⚖️</span>
                      ) : (
                        <span className="text-text-muted text-xs">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* ── Grid View ─────────────────────────────────────────────────────── */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {visiblePersons.map(person => {
            const isSelected = compareP1 === person.id
            return (
              <div key={person.id} className="relative flex flex-col">
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 z-20 flex justify-center pointer-events-none">
                    <span className="mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500 text-white shadow">
                      Terpilih ✓
                    </span>
                  </div>
                )}
                <PersonCard
                  person={person}
                  bookmarked={watchlist.includes(person.id)}
                  onBookmark={handleBookmark}
                  hasLiveNews={livePersonIds.has(person.id)}
                />
                <button
                  onClick={() => handleCompare(person.id)}
                  className={`mt-1 w-full py-1 rounded-lg text-[11px] font-medium border transition-all ${
                    isSelected
                      ? 'bg-blue-500/20 border-blue-500/40 text-blue-400 hover:bg-blue-500/30'
                      : 'bg-bg-elevated border-border text-text-secondary hover:text-text-primary hover:border-border/80'
                  }`}
                  title={isSelected ? 'Batalkan pilihan' : 'Bandingkan tokoh ini'}
                >
                  {isSelected ? '✓ Terpilih — pilih satu lagi' : '⚖️ Bandingkan'}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Pagination: Muat Lebih Banyak ─────────────────────────────────── */}
      {hasMore && (
        <div className="flex flex-col items-center gap-2 pt-2 pb-4">
          <p className="text-xs text-text-secondary">
            Menampilkan {visiblePersons.length} dari {filtered.length} tokoh
          </p>
          <button
            onClick={() => setPage(p => p + 1)}
            className="px-6 py-2.5 bg-bg-card border border-border rounded-lg text-sm font-medium text-text-primary hover:bg-bg-elevated hover:border-accent/50 transition-all"
          >
            Muat Lebih Banyak ({filtered.length - visiblePersons.length} tersisa)
          </button>
        </div>
      )}
    </div>
  )
}
