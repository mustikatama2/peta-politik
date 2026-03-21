import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis } from 'recharts'
import * as RegionsData from '../../data/regions'
import { PERSONS } from '../../data/persons'
import { PARTY_MAP } from '../../data/parties'
import { GDP_PROVINCES } from '../../data/gdp'
import { NEWS } from '../../data/news'
import { PILKADA_2024 } from '../../data/elections'
import { SearchBar, Card, Badge, PageHeader, Avatar } from '../../components/ui'

const KIM_PLUS = ['ger', 'gol', 'nas', 'pan', 'dem', 'pks', 'pbb', 'pkb']

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

const RISK_CONFIG = {
  rendah:    { label: '✓ Bersih',     cls: 'risk-rendah' },
  sedang:    { label: '⚠ Sedang',     cls: 'risk-sedang' },
  tinggi:    { label: '⚠ Tinggi',     cls: 'risk-tinggi' },
  tersangka: { label: '🔴 Tersangka', cls: 'risk-tersangka' },
  terpidana: { label: '⛔ Terpidana', cls: 'risk-terpidana' },
}

const SECTOR_ICONS = {
  'pertanian': '🌾', 'pertanian-perikanan': '🎣', 'pertanian-perdagangan': '🌾',
  'pertanian-perkebunan': '🌿', 'migas': '⛽', 'migas-sawit': '⛽', 'migas-batubara-ikn': '⛽',
  'migas-perikanan': '⛽', 'sawit-batubara': '🌿', 'sawit-bauksit': '🌿',
  'sawit-kakao': '🌿', 'batubara-sawit': '⚫', 'nikel-pertambangan': '⚙️',
  'nikel-pertanian': '⚙️', 'pertambangan': '⛏️', 'pertambangan-timah': '⛏️',
  'pertambangan-tembaga': '⛏️', 'emas-tembaga': '🥇', 'manufaktur': '🏭',
  'manufaktur-tekstil': '🏭', 'manufaktur-perdagangan': '🏭', 'manufaktur-industri': '🏭',
  'manufaktur-pertanian': '🏭', 'jasa-keuangan': '🏦', 'industri-perdagangan': '🏭',
  'pariwisata': '🏖️', 'pariwisata-perikanan': '🏖️', 'pendidikan-pariwisata': '🎓',
  'perikanan-gas': '🐟', 'perikanan-pariwisata': '🐟', 'pertanian-subsisten': '🌱',
}

function ProvinceDetail({ prov, islandColor }) {
  // GDP data — province IDs in PROVINCES use underscore, matching GDP_PROVINCES keys
  const gdp = GDP_PROVINCES[prov.id] || {}
  const govPerson = prov.governor_id ? PERSONS.find(p => p.id === prov.governor_id) : null
  const govParty = PARTY_MAP[prov.party_id]
  const govRisk = govPerson?.analysis?.corruption_risk || 'rendah'

  // Pilkada 2024 result — match by province name
  const pilkada = PILKADA_2024.find(p => p.region === prov.name)

  // Recent news — filtered by governor's person_id
  const regionNews = prov.governor_id
    ? NEWS
        .filter(n => n.person_ids?.includes(prov.governor_id))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3)
    : []

  // GDP sparkline data
  const sparkData = [
    { year: '2021', growth: gdp.growth_2021 ?? null },
    { year: '2022', growth: gdp.growth_2022 ?? null },
    { year: '2023', growth: gdp.growth_2023 ?? null },
  ].filter(d => d.growth !== null)

  const isKimPlus = KIM_PLUS.includes(prov.party_id)
  const sectorIcon = SECTOR_ICONS[gdp.sector] || '📊'

  return (
    <div className="space-y-5">
      {/* Section A: Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {prov.pop && (
          <div className="bg-bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-text-primary">{formatPop(prov.pop || prov.population)}</p>
            <p className="text-xs text-text-secondary mt-1">👥 Populasi</p>
          </div>
        )}
        {prov.dpr_seats && (
          <div className="bg-bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-text-primary">{prov.dpr_seats}</p>
            <p className="text-xs text-text-secondary mt-1">🏛️ Kursi DPR</p>
          </div>
        )}
        {gdp.pdrb_per_kapita_2023 && (
          <div className="bg-bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-text-primary">Rp {gdp.pdrb_per_kapita_2023}jt</p>
            <p className="text-xs text-text-secondary mt-1">💵 PDRB/Kapita</p>
          </div>
        )}
        {gdp.growth_2023 && (
          <div className="bg-bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-xl font-bold" style={{ color: gdp.growth_2023 > 5 ? '#22c55e' : gdp.growth_2023 > 3 ? '#f59e0b' : '#ef4444' }}>
              {gdp.growth_2023 > 0 ? '↑' : '↓'} {Math.abs(gdp.growth_2023)}%
            </p>
            <p className="text-xs text-text-secondary mt-1">📈 PDRB Growth 2023</p>
          </div>
        )}
      </div>

      {/* Section B: Economic Profile */}
      {Object.keys(gdp).length > 0 && (
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">📊 Profil Ekonomi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-3">
              {gdp.sector && (
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{sectorIcon}</span>
                  <div>
                    <p className="text-xs text-text-secondary">Sektor Dominan</p>
                    <p className="text-sm font-semibold text-text-primary capitalize">{gdp.sector.replace(/-/g, ' ')}</p>
                  </div>
                </div>
              )}
              {gdp.pdrb_per_kapita_2023 && (
                <div>
                  <p className="text-xs text-text-secondary">PDRB Per Kapita 2023</p>
                  <p className="text-lg font-bold text-accent-gold">Rp {gdp.pdrb_per_kapita_2023} juta</p>
                </div>
              )}
              {gdp.growth_2023 && (
                <div>
                  <p className="text-xs text-text-secondary">Pertumbuhan PDRB 2023</p>
                  <p className="text-lg font-bold" style={{ color: gdp.growth_2023 > 5 ? '#22c55e' : '#f59e0b' }}>
                    {gdp.growth_2023 > 0 ? '+' : ''}{gdp.growth_2023}%
                  </p>
                </div>
              )}
              {gdp.notes && (
                <p className="text-xs text-text-secondary leading-relaxed bg-bg-elevated rounded-lg p-3">
                  💡 {gdp.notes}
                </p>
              )}
            </div>
            {/* GDP Sparkline */}
            {sparkData.length > 1 && (
              <div>
                <p className="text-xs text-text-secondary mb-2">Tren Pertumbuhan PDRB</p>
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart data={sparkData}>
                    <XAxis dataKey="year" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                    <YAxis
                      tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
                      domain={['auto', 'auto']}
                      width={30}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1E2235', border: '1px solid #2D3748', borderRadius: 8, fontSize: 11 }}
                      formatter={(v) => [`${v}%`, 'Growth']}
                    />
                    <Line
                      dataKey="growth"
                      stroke={islandColor}
                      strokeWidth={2}
                      dot={{ fill: islandColor, r: 4 }}
                      type="monotone"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Section C: Political Profile */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">🏛️ Profil Politik</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Governor risk */}
          <div className="bg-bg-elevated rounded-lg p-3 text-center">
            <p className="text-xs text-text-secondary mb-2">Risiko Korupsi Gubernur</p>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${RISK_CONFIG[govRisk]?.cls}`}>
              {RISK_CONFIG[govRisk]?.label}
            </span>
          </div>
          {/* Coalition */}
          <div className="bg-bg-elevated rounded-lg p-3 text-center">
            <p className="text-xs text-text-secondary mb-2">Koalisi</p>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              isKimPlus
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
            }`}>
              {isKimPlus ? '✅ KIM Plus' : '⚠️ Oposisi/Independen'}
            </span>
          </div>
          {/* Party */}
          {govParty && (
            <div className="bg-bg-elevated rounded-lg p-3 text-center">
              <p className="text-xs text-text-secondary mb-2">Partai Gubernur</p>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: govParty.color + '22', color: govParty.color, border: `1px solid ${govParty.color}44` }}>
                {govParty.logo_emoji} {govParty.abbr}
              </span>
            </div>
          )}
          {/* DPR seats */}
          {prov.dpr_seats && (
            <div className="bg-bg-elevated rounded-lg p-3 text-center">
              <p className="text-xs text-text-secondary mb-2">Kursi DPR</p>
              <p className="text-xl font-bold text-text-primary">{prov.dpr_seats}</p>
            </div>
          )}
        </div>

        {/* Pilkada 2024 result */}
        {pilkada && (
          <div className="mt-4 border border-border rounded-xl p-4">
            <p className="text-xs font-semibold text-text-secondary mb-3">📊 Hasil Pilkada 2024</p>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-text-primary">🥇 {pilkada.winner.name}</span>
                  <span className="text-green-400 font-bold">{pilkada.winner.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-bg-elevated overflow-hidden">
                  <div className="h-full rounded-full bg-green-500" style={{ width: `${pilkada.winner.pct}%` }} />
                </div>
                <p className="text-[10px] text-text-muted mt-0.5">{pilkada.winner.party}</p>
              </div>
              {pilkada.runner_up && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-secondary">{pilkada.runner_up.name}</span>
                    <span className="text-text-secondary">{pilkada.runner_up.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-bg-elevated overflow-hidden">
                    <div className="h-full rounded-full bg-gray-500" style={{ width: `${pilkada.runner_up.pct}%` }} />
                  </div>
                  <p className="text-[10px] text-text-muted mt-0.5">{pilkada.runner_up.party}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Governor enhanced card */}
      {govPerson && (
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-3">👤 Gubernur — Profil Lengkap</h3>
          <div className="flex items-start gap-4">
            <Link to={`/persons/${govPerson.id}`}>
              <Avatar
                name={govPerson.name}
                photoUrl={govPerson.photo_url}
                color={govParty?.color}
                size="lg"
                className="ring-2 ring-bg-card flex-shrink-0 hover:ring-accent-blue transition-all"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/persons/${govPerson.id}`}>
                <h4 className="text-base font-bold text-accent-blue hover:underline">{govPerson.name}</h4>
              </Link>
              <p className="text-xs text-text-secondary mt-0.5">
                Gubernur {prov.name}
                {prov.wakil_gubernur && ` · Wakil: ${prov.wakil_gubernur}`}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {govParty && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: govParty.color + '22', color: govParty.color }}>
                    {govParty.logo_emoji} {govParty.abbr}
                  </span>
                )}
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${RISK_CONFIG[govRisk]?.cls}`}>
                  {RISK_CONFIG[govRisk]?.label}
                </span>
              </div>
              {govPerson.bio && (
                <p className="text-xs text-text-secondary mt-2 leading-relaxed line-clamp-3">{govPerson.bio}</p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Section D: Recent News */}
      {regionNews.length > 0 && (
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-3">📰 Berita Terkini</h3>
          <div className="space-y-3">
            {regionNews.map(n => (
              <div key={n.id} className="border-b border-border/50 pb-3 last:border-0 last:pb-0">
                <div className="flex items-start gap-2">
                  <span className={`mt-0.5 flex-shrink-0 w-1.5 h-1.5 rounded-full ${
                    n.sentiment === 'positif' ? 'bg-green-400' : n.sentiment === 'negatif' ? 'bg-red-400' : 'bg-gray-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary leading-snug">{n.headline}</p>
                    <p className="text-xs text-text-secondary mt-1 line-clamp-2">{n.summary}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-text-muted">
                      <span>{n.source}</span>
                      <span>·</span>
                      <span>{n.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* No data fallback */}
      {Object.keys(gdp).length === 0 && !pilkada && regionNews.length === 0 && (
        <Card className="p-6 text-center text-text-secondary">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-sm">Data ekonomi dan politik sedang dilengkapi untuk {prov.name}.</p>
        </Card>
      )}
    </div>
  )
}

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
    const govParty = PARTY_MAP[prov.governor_party_id || prov.party_id]
    const isJatim = prov.id === 'jawa-timur' || prov.id === 'jawa_timur'
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
              {(prov.pop || prov.population) && ` · Populasi: ${formatPop(prov.pop || prov.population)}`}
              {prov.dpr_seats && ` · DPR: ${prov.dpr_seats} kursi`}
            </p>
          </div>
        </div>

        {/* Governor info — only for Jatim (ProvinceDetail handles the rest) */}
        {isJatim && (
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-3">👤 Gubernur</h3>
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
          </Card>
        )}

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
          <ProvinceDetail prov={prov} islandColor={islandColor} govParty={govParty} />
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
          const govParty = PARTY_MAP[prov.governor_party_id || prov.party_id]
          const isJatim = prov.id === 'jawa-timur' || prov.id === 'jawa_timur'

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
                ) : (prov.governor_name || prov.gubernur) ? (
                  <span>Gubernur: <span className="text-text-primary">{prov.governor_name || prov.gubernur}</span></span>
                ) : (
                  <span className="italic text-text-muted">Data gubernur menyusul</span>
                )}
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-3 mt-2 text-xs text-text-secondary">
                {(prov.population || prov.pop) && <span>👥 {formatPop(prov.pop || prov.population)}</span>}
                {prov.dpr_seats && <span>🏛️ {prov.dpr_seats} kursi</span>}
                {!prov.population && !prov.pop && <span className="text-text-muted">—</span>}
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
