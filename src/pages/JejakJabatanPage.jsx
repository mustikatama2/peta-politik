import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend,
} from 'recharts'
import { Card, PageHeader, Badge } from '../components/ui'
import { PERSONS } from '../data/persons'

// ── Sector config ─────────────────────────────────────────────────────────────
const SECTORS = {
  militer:      { label: 'Militer',      color: '#4D4D00', bg: '#4D4D00', text: '#fff', icon: '⚔️' },
  politik:      { label: 'Politik',      color: '#DC2626', bg: '#DC2626', text: '#fff', icon: '🎭' },
  bisnis:       { label: 'Bisnis',       color: '#D97706', bg: '#D97706', text: '#fff', icon: '💼' },
  pemerintahan: { label: 'Pemerintahan', color: '#2563EB', bg: '#2563EB', text: '#fff', icon: '🏛️' },
  akademik:     { label: 'Akademik',     color: '#16A34A', bg: '#16A34A', text: '#fff', icon: '🎓' },
  hukum:        { label: 'Hukum',        color: '#7C3AED', bg: '#7C3AED', text: '#fff', icon: '⚖️' },
  organisasi:   { label: 'Organisasi',   color: '#0891B2', bg: '#0891B2', text: '#fff', icon: '🤝' },
  lainnya:      { label: 'Lainnya',      color: '#6B7280', bg: '#6B7280', text: '#fff', icon: '📌' },
}

// ── Career Data (hardcoded for 15 prominent persons) ─────────────────────────
const CAREER_DATA = [
  {
    person_id: 'prabowo',
    career: [
      { year: '1970–1998', title: 'Karier Militer TNI AD', org: 'TNI Angkatan Darat', sector: 'militer', note: 'Pangkat terakhir: Letjen, Danjen Kopassus & Pangkostrad' },
      { year: '2008', title: 'Ketua Umum HKTI', org: 'HKTI', sector: 'organisasi', note: 'Bidang pertanian dan agribisnis' },
      { year: '2008–kini', title: 'Ketua Umum Partai Gerindra', org: 'Partai Gerindra', sector: 'politik', note: 'Mendirikan Gerindra setelah keluar Golkar' },
      { year: '2014', title: 'Calon Presiden', org: 'KPU', sector: 'politik', note: 'Kalah dari Jokowi 46.85% vs 53.15%' },
      { year: '2019', title: 'Calon Presiden', org: 'KPU', sector: 'politik', note: 'Kalah lagi dari Jokowi 44.5% vs 55.5%' },
      { year: '2019–2024', title: 'Menteri Pertahanan', org: 'Kabinet Indonesia Maju', sector: 'pemerintahan', note: 'Di bawah Presiden Jokowi' },
      { year: '2024–kini', title: 'Presiden RI ke-8', org: 'Negara RI', sector: 'pemerintahan', note: 'Menang Pilpres 2024 dengan 58.59%' },
    ],
  },
  {
    person_id: 'jokowi',
    career: [
      { year: '1998–2005', title: 'Pengusaha Mebel & Ekspor', org: 'CV Rakabu', sector: 'bisnis', note: 'Membangun bisnis furnitur Solo' },
      { year: '2005–2012', title: 'Walikota Solo', org: 'Pemkot Surakarta', sector: 'pemerintahan', note: '2 periode, terkenal relokasi PKL humanis' },
      { year: '2012–2014', title: 'Gubernur DKI Jakarta', org: 'Pemprov DKI', sector: 'pemerintahan', note: 'Berhenti di tengah jabatan untuk maju Pilpres' },
      { year: '2014–2019', title: 'Presiden RI ke-7', org: 'Negara RI', sector: 'pemerintahan', note: 'Periode pertama — infrastruktur masif' },
      { year: '2019–2024', title: 'Presiden RI ke-7', org: 'Negara RI', sector: 'pemerintahan', note: 'Periode kedua — IKN, Omnibus Law' },
      { year: '2024–kini', title: 'Warga Negara Biasa', org: '–', sector: 'lainnya', note: 'Purna tugas, menetap di Solo' },
    ],
  },
  {
    person_id: 'megawati',
    career: [
      { year: '1987–1999', title: 'Anggota DPR', org: 'DPR RI', sector: 'politik', note: 'Fraksi PDI era Orde Baru' },
      { year: '1993', title: 'Ketua Umum PDI', org: 'PDI', sector: 'politik', note: 'Terpilih, lalu dikudeta Soerjadi 1996' },
      { year: '1998', title: 'Mendirikan PDIP', org: 'PDIP', sector: 'politik', note: 'Pasca reformasi 1998' },
      { year: '1999–2001', title: 'Wakil Presiden RI', org: 'Negara RI', sector: 'pemerintahan', note: 'Wapres di bawah Gus Dur' },
      { year: '2001–2004', title: 'Presiden RI ke-5', org: 'Negara RI', sector: 'pemerintahan', note: 'Naik pasca SI MPR copot Gus Dur' },
      { year: '2004–kini', title: 'Ketua Umum PDIP', org: 'PDIP', sector: 'politik', note: 'Ketua umum terlama sejarah PDIP' },
    ],
  },
  {
    person_id: 'susilo_bambang_yudhoyono',
    career: [
      { year: '1973–2000', title: 'Karier Militer TNI AD', org: 'TNI Angkatan Darat', sector: 'militer', note: 'Pangkat akhir: Jenderal, Kepala Staf Sosial-Politik TNI' },
      { year: '1999–2001', title: 'Menteri Pertambangan', org: 'Kabinet Gus Dur', sector: 'pemerintahan', note: '' },
      { year: '2001–2004', title: 'Menko Polkam', org: 'Kabinet Megawati', sector: 'pemerintahan', note: 'Mundur sebelum Pilpres 2004' },
      { year: '2004–2009', title: 'Presiden RI ke-6', org: 'Negara RI', sector: 'pemerintahan', note: 'Periode pertama, fokus pemberantasan korupsi' },
      { year: '2009–2014', title: 'Presiden RI ke-6', org: 'Negara RI', sector: 'pemerintahan', note: 'Periode kedua, era pertumbuhan ekonomi 6%' },
      { year: '2013–kini', title: 'Ketua Majelis Tinggi Demokrat', org: 'Partai Demokrat', sector: 'politik', note: 'Sebelumnya Ketua Umum 2013–2020' },
    ],
  },
  {
    person_id: 'ahy',
    career: [
      { year: '2000–2016', title: 'Perwira TNI AD', org: 'TNI Angkatan Darat', sector: 'militer', note: 'Terakhir: Mayor Infanteri, penugasan Timor Leste & Poso' },
      { year: '2017', title: 'Calon Gubernur DKI Jakarta', org: 'KPU DKI', sector: 'politik', note: 'Kalah di putaran pertama' },
      { year: '2020–2024', title: 'Ketua Umum Demokrat', org: 'Partai Demokrat', sector: 'politik', note: 'Menggantikan ayahnya SBY' },
      { year: '2024–kini', title: 'Menko Infrastruktur', org: 'Kabinet Merah Putih', sector: 'pemerintahan', note: 'Bergabung koalisi Prabowo' },
    ],
  },
  {
    person_id: 'luhut',
    career: [
      { year: '1970–1999', title: 'Karier Militer TNI AD', org: 'TNI Angkatan Darat', sector: 'militer', note: 'Pangkat terakhir: Letjen, Pangkostrad' },
      { year: '2004–2014', title: 'Pengusaha & Investor', org: 'Toba Sejahtera Group', sector: 'bisnis', note: 'Investasi pertambangan dan energi' },
      { year: '2014–2015', title: 'Kepala Staf KSP', org: 'KSP Jokowi', sector: 'pemerintahan', note: 'Menteri de facto Jokowi' },
      { year: '2015–2016', title: 'Menko Polkam', org: 'Kabinet Kerja', sector: 'pemerintahan', note: '' },
      { year: '2016–2024', title: 'Menko Maritim & Investasi', org: 'Kabinet Jokowi', sector: 'pemerintahan', note: "Sektor terluas, dijuluki 'Menteri Segala Urusan'" },
    ],
  },
  {
    person_id: 'anies',
    career: [
      { year: '1990an', title: 'Akademisi & Aktivis', org: 'UI & KNPI', sector: 'akademik', note: 'Doktor kebijakan publik' },
      { year: '2007', title: 'Capres Konvensi Demokrat', org: 'Demokrat', sector: 'politik', note: 'Tidak berhasil' },
      { year: '2014–2016', title: 'Menteri Pendidikan', org: 'Kabinet Kerja Jokowi', sector: 'pemerintahan', note: 'Dipecat 2016, konflik kebijakan' },
      { year: '2017–2022', title: 'Gubernur DKI Jakarta', org: 'Pemprov DKI', sector: 'pemerintahan', note: 'Bersama Sandiaga Uno' },
      { year: '2024', title: 'Calon Presiden', org: 'KPU', sector: 'politik', note: 'Urutan ke-2 dengan 24.95%' },
    ],
  },
  {
    person_id: 'moeldoko',
    career: [
      { year: '1981–2015', title: 'Karier Militer TNI AD', org: 'TNI Angkatan Darat', sector: 'militer', note: 'Pangkat akhir: Jenderal, Panglima TNI 2013–2015' },
      { year: '2018–2024', title: 'Kepala Staf KSP', org: 'KSP Jokowi', sector: 'pemerintahan', note: 'Salah satu figur paling berpengaruh di istana' },
    ],
  },
  {
    person_id: 'erick_thohir',
    career: [
      { year: '1990an–2019', title: 'Pengusaha & Media', org: 'Mahaka Group', sector: 'bisnis', note: 'Media, olahraga, properti' },
      { year: '2013–2014', title: 'Presiden Inter Milan FC', org: 'Inter Milan', sector: 'bisnis', note: 'Momen internasional' },
      { year: '2019–2024', title: 'Menteri BUMN', org: 'Kabinet Jokowi', sector: 'pemerintahan', note: 'Restrukturisasi BUMN, Danantara' },
      { year: '2024–kini', title: 'Menteri BUMN (lanjut)', org: 'Kabinet Merah Putih', sector: 'pemerintahan', note: 'Berlanjut di kabinet Prabowo' },
    ],
  },
  {
    person_id: 'hasto_kristiyanto',
    career: [
      { year: '2004–2019', title: 'Kader & Fungsionaris PDIP', org: 'PDIP', sector: 'politik', note: 'Berkarir naik di struktur PDIP' },
      { year: '2019–2024', title: 'Sekjen PDIP', org: 'PDIP', sector: 'politik', note: 'Orang kepercayaan Megawati' },
      { year: '2025–kini', title: 'Tersangka KPK', org: 'KPK', sector: 'hukum', note: 'Kasus Harun Masiku — rintangi penyidikan' },
    ],
  },
  {
    person_id: 'sandiaga_uno',
    career: [
      { year: '1993–2015', title: 'Pengusaha Swasta', org: 'Saratoga Capital & lainnya', sector: 'bisnis', note: 'Membangun portofolio bisnis besar' },
      { year: '2017–2018', title: 'Wakil Gubernur DKI Jakarta', org: 'Pemprov DKI', sector: 'pemerintahan', note: 'Bersama Anies Baswedan' },
      { year: '2019', title: 'Calon Wakil Presiden', org: 'KPU', sector: 'politik', note: 'Pasangan Prabowo, kalah dari Jokowi' },
      { year: '2021–2024', title: 'Menteri Pariwisata & Ekonomi Kreatif', org: 'Kabinet Jokowi', sector: 'pemerintahan', note: 'Aktif promosi pariwisata digital' },
      { year: '2024–kini', title: 'Ketua Umum PPP', org: 'PPP', sector: 'politik', note: 'Pimpin PPP yang gagal lolos parlemen' },
    ],
  },
  {
    person_id: 'wiranto',
    career: [
      { year: '1968–1999', title: 'Karier Militer TNI', org: 'TNI', sector: 'militer', note: 'Pangkat terakhir: Jenderal, Panglima TNI 1998–1999' },
      { year: '1999–2000', title: 'Menko Polkam', org: 'Kabinet Gus Dur', sector: 'pemerintahan', note: '' },
      { year: '2000', title: 'Menteri Pertahanan', org: 'Kabinet Gus Dur', sector: 'pemerintahan', note: 'Dipecat Gus Dur' },
      { year: '2004', title: 'Capres', org: 'KPU', sector: 'politik', note: 'Maju Pilpres 2004, gugur di putaran pertama' },
      { year: '2009–2014', title: 'Ketua Umum Hanura', org: 'Hanura', sector: 'politik', note: 'Mendirikan & memimpin Hanura' },
      { year: '2016–2019', title: 'Menko Polhukam', org: 'Kabinet Jokowi', sector: 'pemerintahan', note: 'Ke-3 kalinya sebagai menteri' },
    ],
  },
  {
    person_id: 'puan_maharani',
    career: [
      { year: '2009–2014', title: 'Anggota DPR RI', org: 'DPR RI', sector: 'politik', note: 'Fraksi PDIP' },
      { year: '2014–2019', title: 'Menko Pembangunan Manusia', org: 'Kabinet Jokowi', sector: 'pemerintahan', note: 'Menteri perempuan pertama di kabinet Jokowi' },
      { year: '2019–2024', title: 'Ketua DPR RI', org: 'DPR RI', sector: 'politik', note: 'Ketua DPR perempuan pertama' },
      { year: '2024–kini', title: 'Ketua DPR RI', org: 'DPR RI', sector: 'politik', note: 'Periode kedua' },
    ],
  },
  {
    person_id: 'nadiem',
    career: [
      { year: '2010–2019', title: 'Pengusaha Startup', org: 'Gojek', sector: 'bisnis', note: 'Mendirikan & memimpin Gojek menjadi decacorn' },
      { year: '2019–2024', title: 'Menteri Pendidikan & Kebudayaan', org: 'Kabinet Jokowi', sector: 'pemerintahan', note: 'Menteri termuda 37 tahun, Merdeka Belajar' },
    ],
  },
  {
    person_id: 'muhaimin_iskandar',
    career: [
      { year: '1999–2019', title: 'Anggota & Pimpinan DPR', org: 'DPR RI', sector: 'politik', note: 'Fraksi PKB' },
      { year: '2002–2024', title: 'Ketua Umum PKB', org: 'PKB', sector: 'politik', note: 'Ketua Umum terlama PKB' },
      { year: '2009–2014', title: 'Menteri Tenaga Kerja', org: 'Kabinet SBY', sector: 'pemerintahan', note: '' },
      { year: '2024', title: 'Calon Wakil Presiden', org: 'KPU', sector: 'politik', note: 'Pasangan Anies, urutan ke-2 Pilpres 2024' },
      { year: '2024–kini', title: 'Wakil Ketua DPR RI', org: 'DPR RI', sector: 'politik', note: '' },
    ],
  },
]

// ── Power Pathways ─────────────────────────────────────────────────────────────
const PATHWAYS = [
  {
    id: 'militer-menteri',
    label: 'TNI/Polri → Menteri → Presiden/Wapres',
    icon: '⚔️',
    steps: ['Militer', 'Menteri/Menko', 'Presiden/Wapres'],
    color: '#4D4D00',
    persons: ['prabowo', 'susilo_bambang_yudhoyono', 'moeldoko', 'wiranto', 'luhut'],
    desc: 'Jalur klasik jenderal menjadi pemimpin sipil',
  },
  {
    id: 'dprd-dpr-menteri',
    label: 'DPRD/DPR → Menteri',
    icon: '🎭',
    steps: ['DPR/DPRD', 'Menteri', 'Ketua Partai'],
    color: '#DC2626',
    persons: ['puan_maharani', 'muhaimin_iskandar', 'hasto_kristiyanto'],
    desc: 'Tangga legislatif ke eksekutif',
  },
  {
    id: 'pengusaha-menteri',
    label: 'Pengusaha → Menteri',
    icon: '💼',
    steps: ['Pengusaha', 'Menteri/Gubernur', 'Ketua Partai'],
    color: '#D97706',
    persons: ['erick_thohir', 'sandiaga_uno', 'jokowi', 'nadiem'],
    desc: 'Pengusaha masuk jalur politik/pemerintahan',
  },
  {
    id: 'akademisi-menteri',
    label: 'Akademisi → Menteri → Gubernur',
    icon: '🎓',
    steps: ['Akademisi/Aktivis', 'Menteri', 'Gubernur/Capres'],
    color: '#16A34A',
    persons: ['anies'],
    desc: 'Intelektual masuk pemerintahan via penunjukan',
  },
]

// ── Records ────────────────────────────────────────────────────────────────────
const RECORDS = [
  { icon: '🎖️', label: 'Menteri Termuda', value: 'Nadiem Makarim', sub: '37 tahun (2019)', color: '#16A34A' },
  { icon: '📋', label: 'Jabatan Terbanyak', value: 'Wiranto', sub: '6+ posisi berbeda', color: '#DC2626' },
  { icon: '🔄', label: 'Paling Sering Berganti', value: 'Luhut Binsar', sub: '5 jabatan berbeda di Jokowi era', color: '#D97706' },
  { icon: '⭐', label: 'Hanya Presiden dari Militer', value: 'SBY', sub: 'Jenderal → Presiden 2× periode', color: '#4D4D00' },
  { icon: '👩‍💼', label: 'Ketua Umum Terlama', value: 'Megawati', sub: 'PDIP sejak 2001 — 25+ tahun', color: '#7C3AED' },
  { icon: '🚀', label: 'Karir Tercepat', value: 'Prabowo', sub: 'Letjen → Presiden dalam 26 tahun', color: '#2563EB' },
]

// ── Sector bar chart data builder ─────────────────────────────────────────────
function buildSectorData(careerEntry) {
  const counts = {}
  for (const step of (careerEntry?.career || [])) {
    const s = step.sector || 'lainnya'
    counts[s] = (counts[s] || 0) + 1
  }
  return Object.entries(counts).map(([sector, count]) => ({
    sector: SECTORS[sector]?.label || sector,
    count,
    color: SECTORS[sector]?.color || '#6B7280',
  }))
}

// ── Sector Dot ─────────────────────────────────────────────────────────────────
function SectorDot({ sector }) {
  const s = SECTORS[sector] || SECTORS.lainnya
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ background: s.bg, color: s.text }}
    >
      {s.icon} {s.label}
    </span>
  )
}

// ── Timeline Step ─────────────────────────────────────────────────────────────
function TimelineStep({ step, index, total }) {
  const s = SECTORS[step.sector] || SECTORS.lainnya
  const isLast = index === total - 1
  return (
    <div className="flex gap-3 relative">
      {/* Connector line */}
      {!isLast && (
        <div
          className="absolute left-[17px] top-9 w-0.5 bottom-0"
          style={{ background: `${s.color}40`, minHeight: 24 }}
        />
      )}
      {/* Dot */}
      <div
        className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-base shadow-lg border-2 border-white/10 z-10"
        style={{ background: s.bg }}
      >
        {s.icon}
      </div>
      {/* Content */}
      <div className="flex-1 pb-6">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-[11px] text-text-secondary font-mono bg-bg-elevated px-2 py-0.5 rounded">{step.year}</span>
          <SectorDot sector={step.sector} />
        </div>
        <p className="text-text-primary font-semibold text-sm leading-snug">{step.title}</p>
        <p className="text-text-secondary text-xs mt-0.5">{step.org}</p>
        {step.note && (
          <p className="text-text-muted text-xs mt-1 italic leading-relaxed">{step.note}</p>
        )}
      </div>
    </div>
  )
}

// ── Custom bar tooltip ─────────────────────────────────────────────────────────
function CustomBarTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-bg-card border border-border rounded-lg px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-text-primary">{payload[0]?.payload?.sector}</p>
      <p className="text-text-secondary">{payload[0]?.value} posisi</p>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function JejakJabatanPage() {
  const [selectedId, setSelectedId] = useState('prabowo')
  const [filterSector, setFilterSector] = useState('semua')

  // Only persons we have career data for
  const availableIds = useMemo(() => CAREER_DATA.map(c => c.person_id), [])
  const availablePersons = useMemo(
    () => PERSONS.filter(p => availableIds.includes(p.id)),
    [availableIds]
  )

  const person = PERSONS.find(p => p.id === selectedId)
  const careerEntry = CAREER_DATA.find(c => c.person_id === selectedId)

  const filteredCareer = useMemo(() => {
    if (!careerEntry) return []
    if (filterSector === 'semua') return careerEntry.career
    return careerEntry.career.filter(s => s.sector === filterSector)
  }, [careerEntry, filterSector])

  const sectorData = useMemo(() => buildSectorData(careerEntry), [careerEntry])

  // Sector count for all persons (for Section 2 overview)
  const allSectorData = useMemo(() => {
    return CAREER_DATA.map(cd => {
      const p = PERSONS.find(x => x.id === cd.person_id)
      const counts = {}
      for (const step of cd.career) {
        const s = step.sector || 'lainnya'
        counts[s] = (counts[s] || 0) + 1
      }
      return { name: p?.name?.split(' ')[0] || cd.person_id, ...counts, total: cd.career.length }
    }).sort((a, b) => b.total - a.total)
  }, [])

  // All sector keys present in data
  const allSectorKeys = useMemo(() => {
    const keys = new Set()
    CAREER_DATA.forEach(cd => cd.career.forEach(s => keys.add(s.sector)))
    return [...keys]
  }, [])

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <PageHeader
        title="🗂️ Jejak Jabatan"
        subtitle="Lacak perjalanan karir dan trajektori kekuasaan para tokoh politik Indonesia"
      />

      {/* ── Person Selector ──────────────────────────────────────────────────── */}
      <Card className="p-4">
        <p className="text-text-secondary text-xs mb-2 font-medium uppercase tracking-wider">Pilih Tokoh</p>
        <div className="flex flex-wrap gap-2">
          {availablePersons.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                selectedId === p.id
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-bg-elevated text-text-secondary border-border hover:text-text-primary hover:border-border-strong'
              }`}
            >
              {p.name.split(' ')[0]}{p.name.split(' ').length > 1 ? ' ' + p.name.split(' ').slice(1, 2).join('') : ''}
            </button>
          ))}
        </div>
      </Card>

      {/* ── Section 1: Perjalanan Karir ──────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-bold text-text-primary">📍 Perjalanan Karir</h2>
          {person && (
            <Link to={`/persons/${person.id}`} className="text-xs text-red-400 hover:underline">
              Lihat profil lengkap →
            </Link>
          )}
        </div>

        {person && (
          <Card className="p-4 mb-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Photo */}
              <div className="w-14 h-14 rounded-full overflow-hidden bg-bg-elevated flex-shrink-0 border-2 border-border">
                {person.photo_url ? (
                  <img
                    src={person.photo_url}
                    alt={person.name}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.style.display = 'none' }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-text-secondary">
                    {person.photo_placeholder || person.name[0]}
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="flex-1">
                <h3 className="text-text-primary font-bold text-base">{person.name}</h3>
                <p className="text-text-secondary text-xs">{person.bio?.slice(0, 100)}…</p>
              </div>
              {/* Sector filter */}
              <div className="flex flex-wrap gap-1.5 mt-2 w-full">
                <button
                  onClick={() => setFilterSector('semua')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                    filterSector === 'semua'
                      ? 'bg-bg-hover text-text-primary border-border-strong'
                      : 'text-text-muted border-border hover:text-text-primary'
                  }`}
                >
                  🔍 Semua
                </button>
                {allSectorKeys.filter(sk => careerEntry?.career.some(c => c.sector === sk)).map(sk => {
                  const s = SECTORS[sk] || SECTORS.lainnya
                  return (
                    <button
                      key={sk}
                      onClick={() => setFilterSector(sk)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                        filterSector === sk ? 'border-transparent' : 'border-border hover:border-border-strong'
                      }`}
                      style={filterSector === sk ? { background: s.bg, color: s.text, borderColor: s.bg } : {}}
                    >
                      {s.icon} {s.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </Card>
        )}

        <Card className="p-5">
          {filteredCareer.length === 0 ? (
            <p className="text-text-muted text-sm italic">Tidak ada data karir untuk filter ini.</p>
          ) : (
            <div className="relative">
              {filteredCareer.map((step, i) => (
                <TimelineStep key={i} step={step} index={i} total={filteredCareer.length} />
              ))}
            </div>
          )}
        </Card>
      </section>

      {/* ── Section 2: Pola Karir ─────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-bold text-text-primary mb-4">📊 Pola Karir — Distribusi Sektor</h2>

        {/* Current person's sector breakdown */}
        <Card className="p-5 mb-4">
          <p className="text-text-secondary text-sm mb-3 font-medium">
            Distribusi jabatan {person?.name} per sektor
          </p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData} layout="vertical" margin={{ left: 16, right: 16, top: 0, bottom: 0 }}>
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="sector" width={96} tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {sectorData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* All persons comparison */}
        <Card className="p-5">
          <p className="text-text-secondary text-sm mb-3 font-medium">Total jabatan — semua tokoh (diurutkan)</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={allSectorData} margin={{ left: 0, right: 16, top: 0, bottom: 32 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val, name) => [val, SECTORS[name]?.label || name]}
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                />
                {allSectorKeys.map(sk => (
                  <Bar key={sk} dataKey={sk} stackId="a" fill={SECTORS[sk]?.color || '#6B7280'} name={sk} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-2 mt-4">
            {allSectorKeys.map(sk => {
              const s = SECTORS[sk] || SECTORS.lainnya
              return (
                <span
                  key={sk}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{ background: s.bg + '30', color: s.color, border: `1px solid ${s.color}50` }}
                >
                  {s.icon} {s.label}
                </span>
              )
            })}
          </div>
        </Card>
      </section>

      {/* ── Section 3: Jalur Kekuasaan ───────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-bold text-text-primary mb-4">🛤️ Jalur Kekuasaan</h2>
        <p className="text-text-secondary text-sm mb-4">
          Pola berulang bagaimana tokoh mencapai puncak kekuasaan
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PATHWAYS.map(pathway => {
            const pathPersons = PERSONS.filter(p => pathway.persons.includes(p.id))
            return (
              <Card key={pathway.id} className="p-4" colorLeft={pathway.color}>
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{pathway.icon}</span>
                  <div>
                    <h3 className="text-text-primary font-semibold text-sm leading-snug">{pathway.label}</h3>
                    <p className="text-text-muted text-xs mt-0.5">{pathway.desc}</p>
                  </div>
                </div>
                {/* Steps */}
                <div className="flex items-center gap-1.5 flex-wrap mb-3">
                  {pathway.steps.map((step, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-semibold"
                        style={{ background: pathway.color + '25', color: pathway.color, border: `1px solid ${pathway.color}40` }}
                      >
                        {step}
                      </span>
                      {i < pathway.steps.length - 1 && (
                        <span className="text-text-muted text-xs">→</span>
                      )}
                    </span>
                  ))}
                </div>
                {/* Person chips */}
                <div className="flex flex-wrap gap-1.5">
                  {pathPersons.map(p => (
                    <Link
                      key={p.id}
                      to={`/persons/${p.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-bg-elevated border border-border text-text-primary text-xs hover:text-red-400 hover:border-red-500 transition-colors"
                    >
                      👤 {p.name.split(' ')[0]}
                    </Link>
                  ))}
                  {pathway.persons.filter(id => !PERSONS.find(p => p.id === id)).map(id => (
                    <span key={id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-bg-elevated border border-border text-text-muted text-xs italic">
                      👤 {id}
                    </span>
                  ))}
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      {/* ── Section 4: Rekor ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-bold text-text-primary mb-4">🏆 Rekor & Milestone</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RECORDS.map((rec, i) => (
            <Card key={i} className="p-4" colorLeft={rec.color}>
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{rec.icon}</span>
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-wider font-medium mb-0.5">{rec.label}</p>
                  <p className="text-text-primary font-bold text-base leading-tight">{rec.value}</p>
                  <p className="text-text-secondary text-xs mt-1">{rec.sub}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Footer note ─────────────────────────────────────────────────────── */}
      <Card className="p-4 border-amber-600/20">
        <p className="text-text-muted text-xs leading-relaxed">
          ⚠️ Data karir bersifat kuratif dan disederhanakan untuk visualisasi. Beberapa jabatan non-formal atau transisional mungkin tidak tercantum. 
          Untuk data lengkap, kunjungi <a href="https://www.kpu.go.id" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">KPU</a>, 
          {' '}<a href="https://www.tniad.mil.id" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">TNI AD</a>, 
          atau Wikipedia.
        </p>
      </Card>
    </div>
  )
}
