import { useState, useMemo } from 'react'
import { PERSONS } from '../../data/persons'
import { PARTIES } from '../../data/parties'
import PersonCard from '../../components/PersonCard'
import { SearchBar, Select, PageHeader } from '../../components/ui'

const RISK_ORDER = { rendah: 0, sedang: 1, tinggi: 2, tersangka: 3, terpidana: 4 }

export default function PersonList() {
  const [search, setSearch] = useState('')
  const [filterTier, setFilterTier] = useState('')
  const [filterParty, setFilterParty] = useState('')
  const [filterRisk, setFilterRisk] = useState('')
  const [filterTag, setFilterTag] = useState('')
  const [sortBy, setSortBy] = useState('name')

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

  const filtered = useMemo(() => {
    let result = [...PERSONS]

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

    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'wealth') return (b.lhkpn_latest || 0) - (a.lhkpn_latest || 0)
      if (sortBy === 'risk') {
        return (RISK_ORDER[b.analysis?.corruption_risk] || 0) - (RISK_ORDER[a.analysis?.corruption_risk] || 0)
      }
      return 0
    })
    return result
  }, [search, filterTier, filterParty, filterRisk, filterTag, sortBy])

  return (
    <div className="space-y-5">
      <PageHeader
        title="👥 Tokoh Politik"
        subtitle={`${PERSONS.length} tokoh terdaftar`}
      />

      {/* Search */}
      <SearchBar value={search} onChange={setSearch} placeholder="Cari nama, jabatan, atau bio..." />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
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
        {(search || filterTier || filterParty || filterRisk || filterTag) && (
          <button
            onClick={() => { setSearch(''); setFilterTier(''); setFilterParty(''); setFilterRisk(''); setFilterTag('') }}
            className="px-3 py-2 text-xs text-text-secondary hover:text-text-primary border border-border rounded-lg transition-colors"
          >
            ✕ Reset
          </button>
        )}
      </div>

      {/* Count */}
      <p className="text-sm text-text-secondary">
        Menampilkan <span className="text-text-primary font-medium">{filtered.length}</span> dari{' '}
        <span className="text-text-primary font-medium">{PERSONS.length}</span> tokoh
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-text-secondary">
          <div className="text-5xl mb-4">🔍</div>
          <p className="font-medium">Tidak ada tokoh ditemukan</p>
          <p className="text-sm mt-1">Coba ubah filter atau kata kunci pencarian</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(person => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      )}
    </div>
  )
}
