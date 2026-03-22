import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'
import * as RegionsData from '../../data/regions'
import { PROVINCE_ECON, risikoProvinsi } from '../../data/regions'
import { PERSONS } from '../../data/persons'
import { PARTY_MAP } from '../../data/parties'
import { GDP_PROVINCES } from '../../data/gdp'
import { NEWS } from '../../data/news'
import { PILKADA_2024 } from '../../data/elections'
import { SearchBar, Card, Badge, PageHeader, Avatar } from '../../components/ui'

const KIM_PLUS = ['ger', 'gol', 'nas', 'pan', 'dem', 'pks', 'pbb', 'pkb']

// Safe fallbacks — use enriched (with economic indicators) when available
const JATIM_REGIONS = RegionsData.JATIM_REGIONS || []
const PROVINCES_ENRICHED = RegionsData.PROVINCES_ENRICHED || RegionsData.PROVINCES || []
const PROVINCES = PROVINCES_ENRICHED

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

const COALITION_COLORS = {
  'KIM+': '#22c55e',
  'PDIP': '#ef4444',
  'Lainnya': '#6b7280',
}

// Geographic grid order for island groups (west → east, north → south roughly)
const GEO_ORDER = [
  // Sumatera
  'aceh','sumatera_utara','sumatera_barat','riau','kepulauan_riau',
  'jambi','sumatera_selatan','bengkulu','lampung','bangka_belitung',
  // Jawa
  'dki_jakarta','banten','jawa_barat','jawa_tengah','diy','jawa_timur',
  // Kalimantan
  'kalimantan_barat','kalimantan_tengah','kalimantan_selatan','kalimantan_timur','kalimantan_utara',
  // Bali-Nusra
  'bali','nusa_tenggara_barat','nusa_tenggara_timur',
  // Sulawesi
  'sulawesi_utara','gorontalo','sulawesi_barat','sulawesi_tengah','sulawesi_selatan','sulawesi_tenggara',
  // Maluku
  'maluku_utara','maluku',
  // Papua
  'papua_barat_daya','papua_barat','papua_tengah','papua_selatan','papua_pegunungan','papua',
]

function formatPop(pop) {
  if (!pop) return '—'
  if (pop >= 1_000_000) return `${(pop / 1_000_000).toFixed(1)} jt`
  if (pop >= 1_000) return `${(pop / 1_000).toFixed(0)} rb`
  return String(pop)
}

function formatGDP(v) {
  if (!v) return '—'
  return `$${v.toLocaleString('en-US')}`
}

function buildProvinceList() {
  if (PROVINCES.length > 0) {
    // sort by GEO_ORDER for default display
    return [...PROVINCES].sort((a, b) => {
      const ai = GEO_ORDER.indexOf(a.id)
      const bi = GEO_ORDER.indexOf(b.id)
      if (ai === -1 && bi === -1) return 0
      if (ai === -1) return 1
      if (bi === -1) return -1
      return ai - bi
    })
  }
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

// ── Statistik Nasional ─────────────────────────────────────────────────────
function NasionalStats({ provinces }) {
  const totalPop = provinces.reduce((s, p) => s + (p.population_2023 || p.pop || 0), 0)
  const maxPop = [...provinces].sort((a, b) => (b.population_2023||b.pop||0) - (a.population_2023||a.pop||0))[0]
  const avgHDI = provinces.filter(p => p.hdi).reduce((s, p, _, arr) => s + p.hdi / arr.length, 0)
  const kimCount = provinces.filter(p => p.pilkada_2024_coalition === 'KIM+').length
  const pdipCount = provinces.filter(p => p.pilkada_2024_coalition === 'PDIP').length
  const otherCount = provinces.filter(p => p.pilkada_2024_coalition === 'Lainnya').length
  const totalKPK = provinces.reduce((s, p) => s + (p.corruption_cases || 0), 0)

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">📊 Statistik Nasional</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-text-primary">{formatPop(totalPop)}</p>
          <p className="text-xs text-text-secondary mt-1">👥 Total Populasi</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-lg font-bold text-accent-blue leading-tight">{maxPop?.name}</p>
          <p className="text-xs text-text-secondary mt-1">🏆 Terpenduduk ({formatPop(maxPop?.population_2023 || maxPop?.pop)})</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-accent-gold">{avgHDI.toFixed(2)}</p>
          <p className="text-xs text-text-secondary mt-1">📈 Rata-Rata IPM</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{totalKPK}</p>
          <p className="text-xs text-text-secondary mt-1">⚖️ Total Kasus KPK</p>
        </Card>
      </div>

      {/* Coalition control bar */}
      <Card className="p-4">
        <p className="text-xs font-semibold text-text-secondary mb-3">🏛️ Kendali Koalisi Gubernur 2024</p>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-4 rounded-full overflow-hidden bg-bg-elevated flex">
            <div
              className="h-full transition-all"
              style={{ width: `${(kimCount/38)*100}%`, backgroundColor: COALITION_COLORS['KIM+'] }}
              title={`KIM+ ${kimCount}`}
            />
            <div
              className="h-full transition-all"
              style={{ width: `${(pdipCount/38)*100}%`, backgroundColor: COALITION_COLORS['PDIP'] }}
              title={`PDIP ${pdipCount}`}
            />
            <div
              className="h-full transition-all"
              style={{ width: `${(otherCount/38)*100}%`, backgroundColor: COALITION_COLORS['Lainnya'] }}
              title={`Lainnya ${otherCount}`}
            />
          </div>
        </div>
        <div className="flex gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{backgroundColor:COALITION_COLORS['KIM+']}} />
            <span className="text-text-primary font-semibold">KIM+</span>
            <span className="text-text-secondary">{kimCount} prov</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{backgroundColor:COALITION_COLORS['PDIP']}} />
            <span className="text-text-primary font-semibold">PDIP</span>
            <span className="text-text-secondary">{pdipCount} prov</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{backgroundColor:COALITION_COLORS['Lainnya']}} />
            <span className="text-text-primary font-semibold">Lainnya</span>
            <span className="text-text-secondary">{otherCount} prov</span>
          </span>
        </div>
      </Card>
    </div>
  )
}

// ── Province profile expanded card ─────────────────────────────────────────
function ProvinceProfilePanel({ prov, onClose }) {
  const island = prov.island || ISLAND_MAP[prov.id] || 'Lainnya'
  const islandColor = ISLAND_COLORS[island] || '#6B7280'
  const govParty = PARTY_MAP[prov.governor_party || prov.party_id]
  const coalitionColor = COALITION_COLORS[prov.pilkada_2024_coalition] || '#6B7280'
  const kpkCases = prov.corruption_cases || 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{backgroundColor:'rgba(0,0,0,0.7)'}}>
      <div
        className="bg-bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{borderTopColor: islandColor, borderTopWidth: 4}}
      >
        {/* Header */}
        <div className="sticky top-0 bg-bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-text-primary">{prov.name}</h2>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{backgroundColor:islandColor+'20', color:islandColor}}>
                {island}
              </span>
              {prov.pilkada_2024_coalition && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{backgroundColor:coalitionColor+'20', color:coalitionColor}}>
                  {prov.pilkada_2024_coalition}
                </span>
              )}
            </div>
            <p className="text-xs text-text-secondary mt-0.5">Ibu Kota: {prov.capital || prov.ibu_kota}</p>
          </div>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg-elevated transition-colors flex-shrink-0 text-xl"
          >×</button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Governor + Pilkada */}
          <div className="bg-bg-elevated rounded-xl p-4">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">👤 Gubernur</h3>
            <div className="flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{backgroundColor: govParty?.color || islandColor}}
              >
                {(prov.governor || prov.gubernur || '?').split(' ').map(w => w[0]).slice(0,2).join('')}
              </div>
              <div className="flex-1 min-w-0">
                {prov.governor_id ? (
                  <Link
                    to={`/persons/${prov.governor_id}`}
                    className="text-base font-bold text-accent-blue hover:underline block"
                    onClick={onClose}
                  >
                    {prov.governor || prov.gubernur}
                  </Link>
                ) : (
                  <p className="text-base font-bold text-text-primary">{prov.governor || prov.gubernur}</p>
                )}
                {prov.wakil_gubernur && (
                  <p className="text-xs text-text-secondary">Wakil: {prov.wakil_gubernur}</p>
                )}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {govParty && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{backgroundColor:govParty.color+'22', color:govParty.color}}>
                      {govParty.logo_emoji} {govParty.abbr}
                    </span>
                  )}
                  {prov.pilkada_2024_coalition && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{backgroundColor:coalitionColor+'20', color:coalitionColor}}>
                      Koalisi {prov.pilkada_2024_coalition}
                    </span>
                  )}
                </div>
              </div>
              {prov.pilkada_2024_winner_pct && (
                <div className="text-right flex-shrink-0">
                  <p className="text-xl font-bold" style={{color:coalitionColor}}>
                    {prov.pilkada_2024_winner_pct}%
                  </p>
                  <p className="text-[10px] text-text-muted">Pilkada 2024</p>
                  <div className="mt-1 w-16 h-1.5 rounded-full bg-bg-card overflow-hidden">
                    <div className="h-full rounded-full" style={{width:`${prov.pilkada_2024_winner_pct}%`, backgroundColor:coalitionColor}} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Key Stats grid */}
          <div>
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">📊 Statistik Provinsi</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-bg-elevated rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-text-primary">{formatPop(prov.population_2023 || prov.pop)}</p>
                <p className="text-[10px] text-text-secondary mt-0.5">👥 Penduduk</p>
              </div>
              <div className="bg-bg-elevated rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-text-primary">
                  {prov.area_km2 ? `${(prov.area_km2/1000).toFixed(0)}rb km²` : '—'}
                </p>
                <p className="text-[10px] text-text-secondary mt-0.5">📐 Luas Wilayah</p>
              </div>
              <div className="bg-bg-elevated rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-accent-gold">{formatGDP(prov.gdp_per_capita_usd)}</p>
                <p className="text-[10px] text-text-secondary mt-0.5">💵 GDP/Kapita</p>
              </div>
              <div className="bg-bg-elevated rounded-xl p-3 text-center">
                <p className="text-lg font-bold" style={{color: prov.hdi >= 75 ? '#22c55e' : prov.hdi >= 68 ? '#f59e0b' : '#ef4444'}}>
                  {prov.hdi ?? '—'}
                </p>
                <p className="text-[10px] text-text-secondary mt-0.5">📈 IPM</p>
              </div>
              {prov.dpr_seats && (
                <div className="bg-bg-elevated rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-text-primary">{prov.dpr_seats}</p>
                  <p className="text-[10px] text-text-secondary mt-0.5">🏛️ Kursi DPR</p>
                </div>
              )}
              {prov.dapil_count && (
                <div className="bg-bg-elevated rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-text-primary">{prov.dapil_count}</p>
                  <p className="text-[10px] text-text-secondary mt-0.5">🗺️ Dapil</p>
                </div>
              )}
              <div className="bg-bg-elevated rounded-xl p-3 text-center">
                <p className={`text-lg font-bold ${kpkCases > 3 ? 'text-red-400' : kpkCases > 1 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {kpkCases}
                </p>
                <p className="text-[10px] text-text-secondary mt-0.5">⚖️ Kasus KPK</p>
              </div>
            </div>
          </div>

          {/* Major Cities */}
          {prov.major_cities?.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">🏙️ Kota-Kota Utama</h3>
              <div className="flex flex-wrap gap-2">
                {prov.major_cities.map(city => (
                  <span key={city} className="text-xs px-2.5 py-1 rounded-lg bg-bg-elevated text-text-primary border border-border">
                    {city}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key Industries */}
          {prov.key_industries?.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">🏭 Industri Utama</h3>
              <div className="flex flex-wrap gap-2">
                {prov.key_industries.map(ind => (
                  <span key={ind} className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{backgroundColor:islandColor+'18', color:islandColor, border:`1px solid ${islandColor}30`}}>
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Political Notes */}
          {prov.political_notes && (
            <div className="bg-bg-elevated rounded-xl p-4">
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">📌 Catatan Politik</h3>
              <p className="text-sm text-text-primary leading-relaxed">{prov.political_notes}</p>
            </div>
          )}

          {/* KPK Cases badge */}
          {kpkCases > 0 && (
            <div className="flex items-center gap-3 p-3 rounded-xl"
              style={{backgroundColor: kpkCases > 3 ? '#ef444415' : '#f59e0b15', border:`1px solid ${kpkCases > 3 ? '#ef444430' : '#f59e0b30'}`}}>
              <span className="text-2xl">⚖️</span>
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  {kpkCases} Kasus KPK tercatat dari provinsi ini
                </p>
                <p className="text-xs text-text-secondary">Data historis pejabat daerah yang diproses KPK</p>
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            <Link
              to={`/scorecard?region=${prov.id}`}
              onClick={onClose}
              className="text-xs px-3 py-1.5 rounded-lg bg-accent-blue/10 text-accent-blue border border-accent-blue/20 hover:bg-accent-blue/20 transition-colors"
            >
              📋 Scorecard Provinsi →
            </Link>
            <Link
              to={`/persons?region=${prov.id}`}
              onClick={onClose}
              className="text-xs px-3 py-1.5 rounded-lg bg-bg-elevated text-text-secondary border border-border hover:text-text-primary transition-colors"
            >
              👤 Tokoh Provinsi →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Province Detail (full page, for Jatim kabupaten view) ──────────────────
function ProvinceDetail({ prov, islandColor }) {
  const gdp = GDP_PROVINCES[prov.id] || {}
  const govPerson = prov.governor_id ? PERSONS.find(p => p.id === prov.governor_id) : null
  const govParty = PARTY_MAP[prov.party_id]
  const govRisk = govPerson?.analysis?.corruption_risk || 'rendah'

  const pilkada = PILKADA_2024.find(p => p.region === prov.name)

  const regionNews = prov.governor_id
    ? NEWS
        .filter(n => n.person_ids?.includes(prov.governor_id))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3)
    : []

  const sparkData = [
    { year: '2021', growth: gdp.growth_2021 ?? null },
    { year: '2022', growth: gdp.growth_2022 ?? null },
    { year: '2023', growth: gdp.growth_2023 ?? null },
  ].filter(d => d.growth !== null)

  const isKimPlus = KIM_PLUS.includes(prov.party_id)
  const sectorIcon = SECTOR_ICONS[gdp.sector] || '📊'

  return (
    <div className="space-y-5">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(prov.population_2023 || prov.pop) && (
          <div className="bg-bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-text-primary">{formatPop(prov.population_2023 || prov.pop)}</p>
            <p className="text-xs text-text-secondary mt-1">👥 Populasi</p>
          </div>
        )}
        {prov.dpr_seats && (
          <div className="bg-bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-text-primary">{prov.dpr_seats}</p>
            <p className="text-xs text-text-secondary mt-1">🏛️ Kursi DPR</p>
          </div>
        )}
        {prov.gdp_per_capita_usd && (
          <div className="bg-bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-accent-gold">{formatGDP(prov.gdp_per_capita_usd)}</p>
            <p className="text-xs text-text-secondary mt-1">💵 GDP/Kapita</p>
          </div>
        )}
        {prov.hdi && (
          <div className="bg-bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-text-primary">{prov.hdi}</p>
            <p className="text-xs text-text-secondary mt-1">📈 IPM</p>
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

      {/* Province profile fields */}
      {(prov.major_cities?.length > 0 || prov.key_industries?.length > 0 || prov.political_notes) && (
        <Card className="p-5 space-y-4">
          {prov.major_cities?.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-text-secondary mb-2">🏙️ Kota Utama</h3>
              <div className="flex flex-wrap gap-2">
                {prov.major_cities.map(c => (
                  <span key={c} className="text-xs px-2.5 py-1 rounded-lg bg-bg-elevated text-text-primary border border-border">{c}</span>
                ))}
              </div>
            </div>
          )}
          {prov.key_industries?.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-text-secondary mb-2">🏭 Industri Utama</h3>
              <div className="flex flex-wrap gap-2">
                {prov.key_industries.map(i => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-full"
                    style={{backgroundColor:islandColor+'18', color:islandColor}}>{i}</span>
                ))}
              </div>
            </div>
          )}
          {prov.political_notes && (
            <div className="bg-bg-elevated rounded-lg p-3">
              <p className="text-xs text-text-secondary leading-relaxed">📌 {prov.political_notes}</p>
            </div>
          )}
        </Card>
      )}

      {/* Economic Profile */}
      {Object.keys(gdp).length > 0 && (
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">📊 Profil Ekonomi (PDRB)</h3>
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
            {sparkData.length > 1 && (
              <div>
                <p className="text-xs text-text-secondary mb-2">Tren Pertumbuhan PDRB</p>
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart data={sparkData}>
                    <XAxis dataKey="year" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                    <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} domain={['auto', 'auto']} width={30} />
                    <Tooltip contentStyle={{ backgroundColor: '#1E2235', border: '1px solid #2D3748', borderRadius: 8, fontSize: 11 }}
                      formatter={(v) => [`${v}%`, 'Growth']} />
                    <Line dataKey="growth" stroke={islandColor} strokeWidth={2} dot={{ fill: islandColor, r: 4 }} type="monotone" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Political Profile */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">🏛️ Profil Politik</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-bg-elevated rounded-lg p-3 text-center">
            <p className="text-xs text-text-secondary mb-2">Risiko Korupsi Gubernur</p>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${RISK_CONFIG[govRisk]?.cls}`}>
              {RISK_CONFIG[govRisk]?.label}
            </span>
          </div>
          <div className="bg-bg-elevated rounded-lg p-3 text-center">
            <p className="text-xs text-text-secondary mb-2">Koalisi</p>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
              style={{backgroundColor:(isKimPlus?'#22c55e':'#ef4444')+'15', color:(isKimPlus?'#22c55e':'#ef4444')}}>
              {prov.pilkada_2024_coalition || (isKimPlus ? '✅ KIM Plus' : '⚠️ Oposisi')}
            </span>
          </div>
          {govParty && (
            <div className="bg-bg-elevated rounded-lg p-3 text-center">
              <p className="text-xs text-text-secondary mb-2">Partai Gubernur</p>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: govParty.color + '22', color: govParty.color, border: `1px solid ${govParty.color}44` }}>
                {govParty.logo_emoji} {govParty.abbr}
              </span>
            </div>
          )}
          {prov.dpr_seats && (
            <div className="bg-bg-elevated rounded-lg p-3 text-center">
              <p className="text-xs text-text-secondary mb-2">Kursi DPR</p>
              <p className="text-xl font-bold text-text-primary">{prov.dpr_seats}</p>
            </div>
          )}
        </div>

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
              <Avatar name={govPerson.name} photoUrl={govPerson.photo_url} color={govParty?.color} size="lg"
                className="ring-2 ring-bg-card flex-shrink-0 hover:ring-accent-blue transition-all" />
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

      {/* Recent News */}
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
                      <span>{n.source}</span><span>·</span><span>{n.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {Object.keys(gdp).length === 0 && !pilkada && regionNews.length === 0 && (
        <Card className="p-6 text-center text-text-secondary">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-sm">Data ekonomi dan politik sedang dilengkapi untuk {prov.name}.</p>
        </Card>
      )}
    </div>
  )
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function RegionView() {
  const [search, setSearch] = useState('')
  const [selectedProvince, setSelectedProvince] = useState(null)
  const [profileProvince, setProfileProvince] = useState(null)
  const [islandFilter, setIslandFilter] = useState('Semua')
  const [coalitionFilter, setCoalitionFilter] = useState('Semua')
  const [sortBy, setSortBy] = useState('geo')
  const [kabSearch, setKabSearch] = useState('')

  const provinces = useMemo(() => buildProvinceList(), [])

  const filteredProvinces = useMemo(() => {
    let list = [...provinces]
    if (islandFilter !== 'Semua') {
      list = list.filter(p => (p.island || ISLAND_MAP[p.id]) === islandFilter)
    }
    if (coalitionFilter !== 'Semua') {
      list = list.filter(p => (p.pilkada_2024_coalition || 'Lainnya') === coalitionFilter)
    }
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q) || (p.capital||p.ibu_kota||'').toLowerCase().includes(q))
    }
    // Sort
    if (sortBy === 'pop') {
      list.sort((a, b) => (b.population_2023||b.pop||0) - (a.population_2023||a.pop||0))
    } else if (sortBy === 'hdi') {
      list.sort((a, b) => (b.hdi||0) - (a.hdi||0))
    } else if (sortBy === 'gdp') {
      list.sort((a, b) => (b.gdp_per_capita_usd||0) - (a.gdp_per_capita_usd||0))
    } else if (sortBy === 'kpk') {
      list.sort((a, b) => (b.corruption_cases||0) - (a.corruption_cases||0))
    }
    // 'geo' keeps GEO_ORDER (already applied in buildProvinceList)
    return list
  }, [provinces, islandFilter, coalitionFilter, search, sortBy])

  const filteredKabupaten = useMemo(() => {
    if (!kabSearch) return JATIM_REGIONS
    const q = kabSearch.toLowerCase()
    return JATIM_REGIONS.filter(r => r.name.toLowerCase().includes(q))
  }, [kabSearch])

  // ── Province full-page detail (for Jatim kab/kota view) ──
  if (selectedProvince) {
    const prov = selectedProvince
    const island = prov.island || ISLAND_MAP[prov.id] || 'Lainnya'
    const islandColor = ISLAND_COLORS[island] || '#6B7280'
    const govParty = PARTY_MAP[prov.governor_party || prov.governor_party_id || prov.party_id]
    const isJatim = prov.id === 'jawa-timur' || prov.id === 'jawa_timur'

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedProvince(null)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary border border-border rounded-lg hover:bg-bg-elevated transition-colors"
          >← Kembali</button>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-text-primary">{prov.name}</h1>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: islandColor + '20', color: islandColor }}>
                {island}
              </span>
              {govParty && (
                <span className="text-xs px-2 py-0.5 rounded font-medium"
                  style={{ backgroundColor: govParty.color + '20', color: govParty.color }}>
                  {govParty.abbr}
                </span>
              )}
              {prov.pilkada_2024_coalition && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{backgroundColor:COALITION_COLORS[prov.pilkada_2024_coalition]+'20', color:COALITION_COLORS[prov.pilkada_2024_coalition]}}>
                  {prov.pilkada_2024_coalition}
                </span>
              )}
            </div>
            <p className="text-sm text-text-secondary mt-0.5">
              Ibu Kota: {prov.capital || prov.ibu_kota}
              {(prov.population_2023 || prov.pop) && ` · Populasi: ${formatPop(prov.population_2023 || prov.pop)}`}
              {prov.dpr_seats && ` · DPR: ${prov.dpr_seats} kursi`}
            </p>
          </div>
        </div>

        {/* Jatim kabupaten/kota section */}
        {isJatim ? (
          <div className="space-y-4">
            <ProvinceDetail prov={prov} islandColor={islandColor} />
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text-primary">🏘️ 38 Kabupaten/Kota Jawa Timur</h3>
              <SearchBar value={kabSearch} onChange={setKabSearch} placeholder="Cari kab/kota..." className="w-64" />
            </div>
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
                  <div key={region.id}
                    className="bg-bg-card border border-border rounded-xl p-4 hover:border-gray-600 transition-all"
                    style={party ? { borderLeftColor: party.color, borderLeftWidth: 3 } : {}}>
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

  // ── Province Grid (main view) ──────────────────────────────────────────────
  const provinceCount = filteredProvinces.length

  return (
    <div className="space-y-6">
      <PageHeader
        title="🗺️ Peta Wilayah Indonesia"
        subtitle="38 Provinsi · Klik kartu untuk profil, klik Jawa Timur untuk detail kab/kota"
      />

      {/* National Stats */}
      <NasionalStats provinces={provinces} />

      {/* Filters row */}
      <div className="space-y-3">
        {/* Island filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {ISLAND_TABS.map(tab => (
            <button key={tab} onClick={() => setIslandFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                islandFilter === tab
                  ? 'text-white'
                  : 'bg-bg-card border border-border text-text-secondary hover:text-text-primary hover:border-gray-600'
              }`}
              style={islandFilter === tab
                ? { backgroundColor: tab === 'Semua' ? '#ef4444' : (ISLAND_COLORS[tab] || '#ef4444') }
                : {}}>
              {tab === 'Semua' ? '🌏 Semua' : tab}
            </button>
          ))}
        </div>

        {/* Coalition + Sort + Search row */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Coalition filter */}
          <div className="flex gap-1.5">
            {['Semua','KIM+','PDIP','Lainnya'].map(c => (
              <button key={c} onClick={() => setCoalitionFilter(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                  coalitionFilter === c
                    ? 'text-white border-transparent'
                    : 'bg-bg-card border-border text-text-secondary hover:text-text-primary'
                }`}
                style={coalitionFilter === c
                  ? { backgroundColor: c === 'Semua' ? '#4B5563' : COALITION_COLORS[c] }
                  : {}}>
                {c === 'KIM+' ? '🟢 KIM+' : c === 'PDIP' ? '🔴 PDIP' : c === 'Lainnya' ? '⚪ Lainnya' : '🏛️ Koalisi'}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-bg-card border border-border text-text-secondary focus:outline-none focus:border-gray-500 cursor-pointer"
          >
            <option value="geo">📍 Urutan Geografis</option>
            <option value="pop">👥 Populasi Terbesar</option>
            <option value="hdi">📈 IPM Tertinggi</option>
            <option value="gdp">💵 GDP/Kapita Tertinggi</option>
            <option value="kpk">⚖️ Kasus KPK Terbanyak</option>
          </select>

          {/* Search */}
          <div className="flex-1 min-w-48">
            <SearchBar value={search} onChange={setSearch} placeholder="Cari provinsi atau ibu kota..." />
          </div>
        </div>
      </div>

      <p className="text-sm text-text-secondary">
        Menampilkan <span className="text-text-primary font-medium">{provinceCount}</span> dari 38 provinsi
      </p>

      {/* Province Grid — geographic layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {filteredProvinces.map(prov => {
          const island = prov.island || ISLAND_MAP[prov.id] || 'Lainnya'
          const islandColor = ISLAND_COLORS[island] || '#6B7280'
          const govParty = PARTY_MAP[prov.governor_party || prov.governor_party_id || prov.party_id]
          const isJatim = prov.id === 'jawa-timur' || prov.id === 'jawa_timur'
          const coalition = prov.pilkada_2024_coalition || 'Lainnya'
          const coalitionColor = COALITION_COLORS[coalition] || '#6B7280'
          const kpkCases = prov.corruption_cases || 0

          return (
            <div
              key={prov.id}
              className={`bg-bg-card border rounded-xl p-3 cursor-pointer transition-all hover:border-gray-500 hover:shadow-lg hover:-translate-y-0.5 ${
                isJatim ? 'border-accent-red/50 ring-1 ring-accent-red/20' : 'border-border'
              }`}
              style={{ borderLeftColor: islandColor, borderLeftWidth: 3 }}
            >
              {/* Island badge + name */}
              <div
                className="flex items-start justify-between gap-1.5 mb-2"
                onClick={() => setProfileProvince(prov)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-0.5 flex-wrap">
                    <span className="text-[9px] px-1 py-0.5 rounded font-medium flex-shrink-0"
                      style={{ backgroundColor: islandColor + '20', color: islandColor }}>
                      {island}
                    </span>
                    {isJatim && (
                      <span className="text-[9px] px-1 py-0.5 rounded bg-accent-red/20 text-accent-red font-medium">Pilot</span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-text-primary leading-tight">{prov.name}</p>
                  <p className="text-[10px] text-text-secondary mt-0.5">{prov.capital || prov.ibu_kota}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  {govParty && (
                    <span className="text-[9px] px-1 py-0.5 rounded font-medium"
                      style={{ backgroundColor: govParty.color + '20', color: govParty.color }}>
                      {govParty.abbr}
                    </span>
                  )}
                  {kpkCases > 0 && (
                    <span className={`text-[9px] px-1 py-0.5 rounded font-medium ${
                      kpkCases > 3 ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>⚖️{kpkCases}</span>
                  )}
                </div>
              </div>

              {/* Coalition dot + stats */}
              <div
                className="space-y-1"
                onClick={() => setProfileProvince(prov)}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-text-secondary">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{backgroundColor:coalitionColor}} />
                  <span style={{color:coalitionColor}} className="font-medium">{coalition}</span>
                  {prov.pilkada_2024_winner_pct && (
                    <span className="text-text-muted">{prov.pilkada_2024_winner_pct}%</span>
                  )}
                </div>

                {(prov.population_2023 || prov.pop) && (
                  <div className="flex items-center gap-2 text-[10px] text-text-secondary">
                    <span>👥 {formatPop(prov.population_2023 || prov.pop)}</span>
                    {prov.hdi && <span>IPM {prov.hdi}</span>}
                  </div>
                )}

                {(prov.governor || prov.gubernur) && (
                  <p className="text-[10px] text-text-muted truncate">
                    {(prov.governor || prov.gubernur).split(' ').slice(0,3).join(' ')}
                  </p>
                )}
              </div>

              {/* Action row */}
              <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-between gap-1">
                <button
                  onClick={() => setProfileProvince(prov)}
                  className="text-[9px] text-accent-blue hover:underline"
                >
                  Profil →
                </button>
                {isJatim && (
                  <button
                    onClick={() => setSelectedProvince(prov)}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-accent-red/20 text-accent-red hover:bg-accent-red/30 transition-colors"
                  >
                    Kab/Kota →
                  </button>
                )}
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

      {/* Province Profile Modal */}
      {profileProvince && (
        <ProvinceProfilePanel
          prov={profileProvince}
          onClose={() => setProfileProvince(null)}
        />
      )}
    </div>
  )
}
