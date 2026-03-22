import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend,
} from 'recharts'
import { Card, PageHeader, formatIDR } from '../components/ui'

// ─── DATA ────────────────────────────────────────────────────────────────────

const PRESIDEN_RI = [
  {
    urut: 1,
    nama: "Ir. Soekarno",
    person_id: "soekarno",
    periode: "1945–1967",
    partai: "PNI",
    era: "Kemerdekaan & Demokrasi Terpimpin",
    warna: "#16A34A",
    tahun_mulai: 1945,
    tahun_selesai: 1967,
    photo_url: "https://commons.wikimedia.org/wiki/Special:FilePath/Soekarno.jpg?width=200",
    pencapaian: [
      "Memproklamasikan kemerdekaan RI 17 Agustus 1945",
      "Mencetuskan ideologi Pancasila dan UUD 1945",
      "Membawa RI ke kancah internasional via Gerakan Non-Blok",
      "Pembebasan Irian Barat (1963)",
      "Pendirian Konfederasi Bangsa-Bangsa Asia Afrika",
    ],
    kontroversi: [
      "Demokrasi Terpimpin dianggap otoriter (1959–1965)",
      "Hiperinflasi hingga 600%+ akibat cetak uang masif",
      "Konfrontasi dengan Malaysia (1963–1966)",
      "Peristiwa G30S/PKI dan kekerasan massal 1965",
    ],
    catatan_lhkpn: "Tidak berlaku — LHKPN diberlakukan jauh setelah masa jabatannya.",
  },
  {
    urut: 2,
    nama: "H.M. Soeharto",
    person_id: "soeharto",
    periode: "1967–1998",
    partai: "Golkar",
    era: "Orde Baru",
    warna: "#DC2626",
    tahun_mulai: 1967,
    tahun_selesai: 1998,
    photo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Suharto.jpg/200px-Suharto.jpg",
    pencapaian: [
      "Swasembada pangan (1984) — penghargaan FAO",
      "Pertumbuhan ekonomi rata-rata 7% per tahun",
      "Industrialisasi & pembangunan infrastruktur masif",
      "Program Keluarga Berencana dan penurunan kemiskinan",
      "Stabilitas politik 32 tahun",
    ],
    kontroversi: [
      "Korupsi sistemik KKN — estimasi $15-35 miliar",
      "Pelanggaran HAM: Timor Timur, Aceh, Papua, Mei 1998",
      "Penghilangan aktivis dan wartawan",
      "Krisis moneter 1997–1998 yang memorakporandakan ekonomi",
      "Dinasti politik dan konglomerasi keluarga Cendana",
    ],
    catatan_lhkpn: "Tidak melaporkan LHKPN — kewajiban belum berlaku semasa menjabat.",
  },
  {
    urut: 3,
    nama: "B.J. Habibie",
    person_id: "habibie",
    periode: "1998–1999",
    partai: "Golkar",
    era: "Reformasi",
    warna: "#D97706",
    tahun_mulai: 1998,
    tahun_selesai: 1999,
    photo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Habibie.jpg/200px-Habibie.jpg",
    pencapaian: [
      "Membebaskan tahanan politik dan pers",
      "Melegalisasi partai politik dan serikat buruh",
      "Memberi kesempatan referendum Timor Timur",
      "Menstabilkan ekonomi pasca krisis moneter",
      "UU Otonomi Daerah — fondasi desentralisasi",
    ],
    kontroversi: [
      "Dikritik karena membiarkan lepasnya Timor Timur",
      "Tragedi Semanggi I & II tidak tuntas diusut",
      "Kasus Bank Bali dan dana Golkar",
      "Dianggap 'produk Soeharto' oleh sebagian aktivis reformasi",
    ],
    catatan_lhkpn: "LHKPN mulai diwajibkan; Habibie termasuk awal era keterbukaan.",
  },
  {
    urut: 4,
    nama: "Abdurrahman Wahid",
    person_id: "gus_dur",
    periode: "1999–2001",
    partai: "PKB",
    era: "Reformasi",
    warna: "#7C3AED",
    tahun_mulai: 1999,
    tahun_selesai: 2001,
    photo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Gus_dur.jpg/200px-Gus_dur.jpg",
    pencapaian: [
      "Rekonsiliasi nasional dan pluralisme agama",
      "Pembubaran Departemen Penerangan — kebebasan pers",
      "Pengakuan hak adat & budaya Tionghoa-Indonesia",
      "Reformasi TNI/Polri — pemisahan Polri dari ABRI",
      "Pendekatan dialog dengan Papua dan Aceh",
    ],
    kontroversi: [
      "Dua kali lolos dari mosi tidak percaya DPR",
      "Pencabutan Dekrit Presiden 2001 dinilai inkonstitusional",
      "Kasus Buloggate dan Bruneigate",
      "Gaya kepemimpinan dianggap tidak konsisten",
    ],
    catatan_lhkpn: "Presiden pertama yang memerintah di era penuh kewajiban LHKPN.",
  },
  {
    urut: 5,
    nama: "Megawati Soekarnoputri",
    person_id: "megawati",
    periode: "2001–2004",
    partai: "PDIP",
    era: "Reformasi",
    warna: "#DC2626",
    tahun_mulai: 2001,
    tahun_selesai: 2004,
    photo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Megawati_Soekarnoputri.jpg/200px-Megawati_Soekarnoputri.jpg",
    pencapaian: [
      "Stabilisasi ekonomi pasca Gus Dur",
      "Penjualan aset BPPN — recovery aset krisis",
      "Penyelesaian konflik Aceh (Helsinki 2005 dimulai masa ini)",
      "Penguatan lembaga anti-korupsi",
      "UU Pemilu langsung untuk Pilpres 2004",
    ],
    kontroversi: [
      "Penjualan kapal perang ke Korea Selatan",
      "Kebijakan dianggap stagnan dan tidak tegas",
      "Kasus korupsi BLBI tidak tuntas",
      "Dinilai kurang komunikatif dan jarang berpidato",
    ],
    catatan_lhkpn: "Kekayaan Megawati tercatat di LHKPN KPK.",
  },
  {
    urut: 6,
    nama: "Susilo Bambang Yudhoyono",
    person_id: "sby",
    periode: "2004–2014",
    partai: "Demokrat",
    era: "Konsolidasi Demokrasi",
    warna: "#2563EB",
    tahun_mulai: 2004,
    tahun_selesai: 2014,
    photo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/SBY_official_presidential_portrait.jpg/200px-SBY_official_presidential_portrait.jpg",
    pencapaian: [
      "Perdamaian Aceh — MoU Helsinki 2005",
      "Pertumbuhan ekonomi stabil 5–6% / tahun",
      "Pembentukan KPK yang kuat",
      "Bantuan Langsung Tunai (BLT) dan PNPM",
      "Pengendalian inflasi dan rasio utang yang sehat",
    ],
    kontroversi: [
      "Kasus Nazarudin dan korupsi Partai Demokrat",
      "Lamban merespons bencana dan krisis",
      "Dituding bersikap plin-plan dalam keputusan penting",
      "Skandal Century Bank Rp 6,7 triliun",
      "Isu penyadapan Australia/AS",
    ],
    catatan_lhkpn: "Melaporkan LHKPN secara konsisten selama 10 tahun menjabat.",
  },
  {
    urut: 7,
    nama: "Joko Widodo",
    person_id: "jokowi",
    periode: "2014–2024",
    partai: "PDIP",
    era: "Era Jokowi",
    warna: "#DC2626",
    tahun_mulai: 2014,
    tahun_selesai: 2024,
    photo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Joko_Widodo_2019_official_portrait.jpg/200px-Joko_Widodo_2019_official_portrait.jpg",
    pencapaian: [
      "Pembangunan infrastruktur masif: jalan tol, bandara, pelabuhan",
      "Pemindahan ibu kota ke IKN Nusantara",
      "Program Kartu Indonesia Sehat & Kartu Indonesia Pintar",
      "Hilirisasi nikel dan komoditas mineral",
      "Penanganan pandemi COVID-19 dan vaksinasi",
    ],
    kontroversi: [
      "UU Cipta Kerja — 'Omnibus Law' dikritik serikat buruh",
      "Putusan MK nepotisme Gibran untuk Pilpres 2024",
      "Pelemahan KPK melalui revisi UU KPK 2019",
      "Tambang dan proyek yang mengancam lingkungan",
      "Dugaan konflik kepentingan bisnis keluarga",
    ],
    catatan_lhkpn: "Kekayaan naik signifikan selama menjabat — tercatat di LHKPN KPK.",
  },
  {
    urut: 8,
    nama: "Prabowo Subianto",
    person_id: "prabowo",
    periode: "2024–sekarang",
    partai: "Gerindra",
    era: "Era Prabowo",
    warna: "#7C2D12",
    tahun_mulai: 2024,
    tahun_selesai: null,
    photo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Prabowo_Subianto_2023_official_portrait_%28cropped%29.jpg/200px-Prabowo_Subianto_2023_official_portrait_%28cropped%29.jpg",
    pencapaian: [
      "Program Makan Bergizi Gratis (MBG) nasional",
      "Lanjutkan pembangunan IKN Nusantara",
      "Kebijakan hilirisasi dan swasembada pangan",
      "Diplomasi aktif kawasan Indo-Pasifik",
      "Konsolidasi kekuatan militer nasional",
    ],
    kontroversi: [
      "Rekam jejak HAM era Orde Baru — penculikan aktivis 1997–1998",
      "Pemecatan dari TNI oleh Dewan Kehormatan Perwira",
      "Koalisi 'jumbo' dengan partai-partai penguasa",
      "Efisiensi anggaran yang memotong anggaran sosial",
      "Program MBG — kontroversi biaya dan implementasi",
    ],
    catatan_lhkpn: "Prabowo adalah salah satu tokoh terkaya dalam LHKPN KPK — di atas Rp 2 triliun.",
  },
]

export const EKONOMI_PER_PRESIDEN = [
  { person_id: "soekarno", gdp_start: 72, gdp_end: 105, inflasi_avg: 650, catatan: "Hiperinflasi era Demokrasi Terpimpin" },
  { person_id: "soeharto", gdp_start: 80, gdp_end: 1130, inflasi_avg: 15, catatan: "Pertumbuhan pesat, korupsi sistemik" },
  { person_id: "habibie",  gdp_start: 640, gdp_end: 800, inflasi_avg: 40, catatan: "Krisis moneter recovery awal" },
  { person_id: "gus_dur",  gdp_start: 800, gdp_end: 900, inflasi_avg: 9,  catatan: "Demokratisasi, stabilisasi" },
  { person_id: "megawati", gdp_start: 900, gdp_end: 1100, inflasi_avg: 9,  catatan: "Recovery stabil" },
  { person_id: "sby",      gdp_start: 1100, gdp_end: 3500, inflasi_avg: 7,  catatan: "Era booming komoditas" },
  { person_id: "jokowi",   gdp_start: 3500, gdp_end: 4900, inflasi_avg: 4,  catatan: "Infrastruktur masif, COVID impact" },
  { person_id: "prabowo",  gdp_start: 4900, gdp_end: null, inflasi_avg: null, catatan: "In progress" },
]

// Kebijakan scoring (1-10): ekonomi, ham, korupsi (rendah korupsi = baik), infrastruktur, stabilitas
const KEBIJAKAN_SCORES = [
  { nama: "Soekarno",  person_id:"soekarno",  ekonomi:4,  ham:5,  korupsi:7, infrastruktur:5, stabilitas:4 },
  { nama: "Soeharto",  person_id:"soeharto",  ekonomi:8,  ham:1,  korupsi:1, infrastruktur:7, stabilitas:7 },
  { nama: "Habibie",   person_id:"habibie",   ekonomi:5,  ham:7,  korupsi:6, infrastruktur:4, stabilitas:5 },
  { nama: "Gus Dur",   person_id:"gus_dur",   ekonomi:5,  ham:9,  korupsi:7, infrastruktur:4, stabilitas:4 },
  { nama: "Megawati",  person_id:"megawati",  ekonomi:6,  ham:6,  korupsi:6, infrastruktur:5, stabilitas:6 },
  { nama: "SBY",       person_id:"sby",       ekonomi:7,  ham:6,  korupsi:6, infrastruktur:6, stabilitas:8 },
  { nama: "Jokowi",    person_id:"jokowi",    ekonomi:7,  ham:5,  korupsi:5, infrastruktur:9, stabilitas:7 },
  { nama: "Prabowo",   person_id:"prabowo",   ekonomi:6,  ham:4,  korupsi:5, infrastruktur:7, stabilitas:7 },
]

// ─── SOEHARTO ORDE BARU TIMELINE ─────────────────────────────────────────────
const ORDE_BARU_EVENTS = [
  { tahun: 1967, label: "Soeharto resmi jadi Pejabat Presiden", tag: "politik" },
  { tahun: 1968, label: "Dilantik sebagai Presiden RI ke-2", tag: "politik" },
  { tahun: 1971, label: "Golkar menang Pemilu pertama Orde Baru (62.8%)", tag: "politik" },
  { tahun: 1974, label: "Peristiwa Malari — mahasiswa demo anti-Jepang, dibubarkan paksa", tag: "represi" },
  { tahun: 1975, label: "Invasi Timor Timur — awal pendudukan 24 tahun", tag: "represi" },
  { tahun: 1978, label: "NKK/BKK — kampus dilarang berpolitik, mahasiswa dibungkam", tag: "represi" },
  { tahun: 1984, label: "Swasembada pangan — Indonesia mandiri beras, penghargaan FAO", tag: "ekonomi" },
  { tahun: 1984, label: "Tragedi Tanjung Priok — penembakan massa Islam oleh tentara", tag: "represi" },
  { tahun: 1988, label: "Prabowo Subianto menikahi Titiek Soeharto — jaringan kekuasaan meluas", tag: "dinasti" },
  { tahun: 1991, label: "Pembantaian Santa Cruz, Dili — 271 orang tewas di Timor Timur", tag: "represi" },
  { tahun: 1993, label: "Soeharto ke-7 kalinya 'dipilih' MPR sebagai Presiden", tag: "politik" },
  { tahun: 1996, label: "Penyerangan kantor PDI — Megawati dikudeta Soeharto", tag: "represi" },
  { tahun: 1997, label: "Krisis moneter Asia — rupiah anjlok 80%, ekonomi kolaps", tag: "ekonomi" },
  { tahun: 1997, label: "Penculikan aktivis oleh Kopassus (Prabowo)", tag: "represi" },
  { tahun: 1998, label: "Kerusuhan Mei 1998 — 1.000+ meninggal, ribuan perempuan Tionghoa diperkosa", tag: "represi" },
  { tahun: 1998, label: "Soeharto mundur 21 Mei 1998 — 32 tahun kekuasaan berakhir", tag: "politik" },
]

const ORBA_CRONIES = [
  { nama: "Liem Sioe Liong", bisnis: "Salim Group — BCA, Indofood, Bogasari", hubungan: "Mitra bisnis utama Cendana" },
  { nama: "Bob Hasan", bisnis: "Monopoli kayu & plywood Indonesia", hubungan: "Sahabat golf Soeharto" },
  { nama: "Tommy Soeharto", bisnis: "Timor mobil nasional, tambang, properti", hubungan: "Anak bungsu Soeharto" },
  { nama: "Tutut Soeharto", bisnis: "Citra Lamtoro Gung, jalan tol", hubungan: "Anak sulung Soeharto" },
  { nama: "Prabowo Subianto", bisnis: "Hak kuasa hutan via menantu", hubungan: "Mantan menantu" },
]

// ─── "SEJARAH MENILAI" RATINGS ────────────────────────────────────────────
const SEJARAH_RATINGS = [
  { person_id: "soekarno",  rating: 7.1, label: "Soekarno",  catatan: "Bapak Bangsa, namun demokrasi terpimpin otoriter & ekonomi hancur", warna: "#16A34A" },
  { person_id: "soeharto",  rating: 5.2, label: "Soeharto",  catatan: "Ekonomi pesat, tapi korupsi masif & HAM kelam", warna: "#DC2626" },
  { person_id: "habibie",   rating: 7.8, label: "Habibie",   catatan: "Reformis sejati, kebebasan pers & demokratisasi", warna: "#D97706" },
  { person_id: "gus_dur",   rating: 7.5, label: "Gus Dur",   catatan: "Pluralisme & HAM kuat, namun singkat & kontroversial", warna: "#7C3AED" },
  { person_id: "megawati",  rating: 6.5, label: "Megawati",  catatan: "Stabilisasi pasca Gus Dur, tapi diam dan stagnan", warna: "#DC2626" },
  { person_id: "sby",       rating: 7.2, label: "SBY",       catatan: "Perdamaian Aceh & pertumbuhan stabil, korupsi partai jadi noda", warna: "#2563EB" },
  { person_id: "jokowi",    rating: 6.8, label: "Jokowi",    catatan: "Infrastruktur masif, tapi KPK dilemahkan & akhir masa jabatan kontroversial", warna: "#DC2626" },
  { person_id: "prabowo",   rating: null, label: "Prabowo",  catatan: "Masih menjabat — penilaian tertunda", warna: "#7C2D12" },
]

// ─── WARISAN VS LUKA DATA ─────────────────────────────────────────────────
const WARISAN_LUKA = PRESIDEN_RI.map(p => ({
  person_id: p.person_id,
  nama: p.nama.split(' ').slice(-1)[0],
  fullNama: p.nama,
  achievements: p.pencapaian.length,
  controversies: p.kontroversi.length,
  warna: p.warna,
}))

// ─── HELPER ──────────────────────────────────────────────────────────────────
function getDurasi(p) {
  const end = p.tahun_selesai || new Date().getFullYear()
  return end - p.tahun_mulai
}

function formatGDP(val) {
  if (val == null) return '—'
  return `$${val.toLocaleString('id-ID')}`
}

const TOTAL_YEARS = (() => {
  const end = Math.max(...PRESIDEN_RI.map(p => p.tahun_selesai || new Date().getFullYear()))
  return end - PRESIDEN_RI[0].tahun_mulai
})()

const RADAR_COLORS = [
  '#16A34A','#DC2626','#D97706','#7C3AED',
  '#EC4899','#2563EB','#F59E0B','#7C2D12',
]

// ─── CUSTOM TOOLTIP ──────────────────────────────────────────────────────────
function GDPTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const p = PRESIDEN_RI.find(x => x.nama.includes(label) || label?.includes(x.nama.split(' ')[0]))
  const e = EKONOMI_PER_PRESIDEN.find(x => x.person_id === p?.person_id)
  return (
    <div className="bg-bg-card border border-border rounded-xl p-3 text-xs shadow-xl max-w-[200px]">
      <p className="font-semibold text-text-primary mb-1">{label}</p>
      {e && <p className="text-text-secondary">{e.catatan}</p>}
      {e?.inflasi_avg != null && (
        <p className="text-orange-400 mt-1">Inflasi rata-rata: {e.inflasi_avg}%</p>
      )}
    </div>
  )
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function TimelineKekuasaanPage() {
  const [selectedId, setSelectedId]     = useState(null)
  const [activeTab, setActiveTab]       = useState('timeline')
  const [radarSelected, setRadarSelected] = useState(['jokowi','sby','soekarno'])

  const selectedPresident = PRESIDEN_RI.find(p => p.person_id === selectedId)

  // GDP bar chart data
  const gdpData = PRESIDEN_RI.map(p => {
    const e = EKONOMI_PER_PRESIDEN.find(x => x.person_id === p.person_id)
    return {
      name: p.nama.split(' ').slice(-1)[0], // last name
      fullName: p.nama,
      person_id: p.person_id,
      gdp_start: e?.gdp_start ?? null,
      gdp_end:   e?.gdp_end   ?? null,
      gain:      (e?.gdp_end ?? 0) - (e?.gdp_start ?? 0),
      warna: p.warna,
    }
  })

  // Radar data for selected persons
  const radarDimensions = ['ekonomi','ham','korupsi','infrastruktur','stabilitas']
  const radarData = radarDimensions.map(dim => {
    const row = { subject: dim.charAt(0).toUpperCase() + dim.slice(1) }
    radarSelected.forEach(id => {
      const score = KEBIJAKAN_SCORES.find(s => s.person_id === id)
      row[id] = score?.[dim] ?? 0
    })
    return row
  })

  const TABS = [
    { id: 'timeline',  label: '⏳ Linimasa' },
    { id: 'ekonomi',   label: '📈 Warisan Ekonomi' },
    { id: 'kebijakan', label: '🎯 Perbandingan Kebijakan' },
    { id: 'warisan',   label: '⚖️ Warisan & Penilaian' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="🏛️ Sejarah Presiden RI"
        subtitle="Linimasa kekuasaan & warisan kepemimpinan presidensial Indonesia"
      />

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-bg-elevated rounded-xl border border-border">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 text-xs py-2 px-3 rounded-lg font-medium transition-all ${
              activeTab === t.id
                ? 'bg-accent-gold text-bg-card'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══ TAB 1: TIMELINE ═══════════════════════════════════════════════ */}
      {activeTab === 'timeline' && (
        <>
          {/* Horizontal Timeline Bar */}
          <Card className="p-5 overflow-hidden">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Proporsi Masa Jabatan (1945–sekarang)</h3>
            <div className="overflow-x-auto pb-2">
              <div className="flex min-w-[700px] h-14 rounded-lg overflow-hidden gap-px">
                {PRESIDEN_RI.map(p => {
                  const dur = getDurasi(p)
                  const pct = (dur / TOTAL_YEARS) * 100
                  return (
                    <button
                      key={p.person_id}
                      onClick={() => setSelectedId(prev => prev === p.person_id ? null : p.person_id)}
                      title={`${p.nama} — ${p.periode} (${dur} tahun)`}
                      style={{ width: `${pct}%`, backgroundColor: p.warna, minWidth: 28 }}
                      className={`relative flex flex-col items-center justify-center text-white transition-all hover:opacity-90 hover:scale-y-110 ${
                        selectedId === p.person_id ? 'ring-2 ring-white ring-inset scale-y-110' : ''
                      }`}
                    >
                      <span className="text-[9px] font-bold leading-none truncate px-1 drop-shadow">
                        {dur >= 5 ? p.nama.split(' ').pop() : ''}
                      </span>
                      {dur >= 5 && (
                        <span className="text-[8px] opacity-80 leading-none">{p.periode}</span>
                      )}
                    </button>
                  )
                })}
              </div>
              {/* Year labels */}
              <div className="flex min-w-[700px] mt-1 px-px">
                {PRESIDEN_RI.map(p => {
                  const dur = getDurasi(p)
                  const pct = (dur / TOTAL_YEARS) * 100
                  return (
                    <div key={p.person_id} style={{ width: `${pct}%`, minWidth: 28 }} className="text-[8px] text-text-secondary text-left pl-0.5">
                      {p.tahun_mulai}
                    </div>
                  )
                })}
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-2">
              Klik segmen untuk melihat detail presiden. Lebar segmen proporsional dengan lama menjabat.
            </p>
          </Card>

          {/* Selected President Detail */}
          {selectedPresident && (
            <Card className="p-5 border-2" style={{ borderColor: selectedPresident.warna + '60' }}>
              <div className="flex items-start gap-4">
                {/* Photo */}
                <div
                  className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl font-bold text-white overflow-hidden"
                  style={{ backgroundColor: selectedPresident.warna }}
                >
                  <img
                    src={selectedPresident.photo_url}
                    alt={selectedPresident.nama}
                    className="w-full h-full object-cover"
                    onError={e => { e.currentTarget.style.display = 'none' }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h2 className="text-base font-bold text-text-primary">{selectedPresident.nama}</h2>
                      <p className="text-xs text-text-secondary mt-0.5">
                        Presiden ke-{selectedPresident.urut} · {selectedPresident.periode} · {selectedPresident.partai}
                      </p>
                    </div>
                    <span
                      className="text-xs px-2 py-1 rounded-full text-white font-medium"
                      style={{ backgroundColor: selectedPresident.warna }}
                    >
                      {selectedPresident.era}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Pencapaian */}
                    <div>
                      <p className="text-xs font-semibold text-green-400 mb-2">✅ Pencapaian Utama</p>
                      <ul className="space-y-1">
                        {selectedPresident.pencapaian.map((item, i) => (
                          <li key={i} className="text-xs text-text-secondary flex gap-1.5">
                            <span className="text-green-400 flex-shrink-0">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Kontroversi */}
                    <div>
                      <p className="text-xs font-semibold text-red-400 mb-2">⚠️ Kontroversi</p>
                      <ul className="space-y-1">
                        {selectedPresident.kontroversi.map((item, i) => (
                          <li key={i} className="text-xs text-text-secondary flex gap-1.5">
                            <span className="text-red-400 flex-shrink-0">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* LHKPN note */}
                  <div className="mt-3 p-2.5 bg-amber-900/20 border border-amber-700/30 rounded-lg">
                    <p className="text-xs text-amber-400">
                      💰 <strong>LHKPN:</strong> {selectedPresident.catatan_lhkpn}
                    </p>
                  </div>

                  {/* Economic snippet */}
                  {(() => {
                    const e = EKONOMI_PER_PRESIDEN.find(x => x.person_id === selectedPresident.person_id)
                    if (!e) return null
                    return (
                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-text-secondary">
                        <span>GDP Awal: <span className="text-text-primary font-medium">{formatGDP(e.gdp_start)}</span>/kapita</span>
                        {e.gdp_end && <span>GDP Akhir: <span className="text-text-primary font-medium">{formatGDP(e.gdp_end)}</span>/kapita</span>}
                        {e.inflasi_avg != null && <span>Inflasi Avg: <span className={e.inflasi_avg > 50 ? 'text-red-400 font-medium' : 'text-text-primary font-medium'}>{e.inflasi_avg}%</span></span>}
                      </div>
                    )
                  })()}
                </div>

                <button
                  onClick={() => setSelectedId(null)}
                  className="text-text-secondary hover:text-text-primary text-lg flex-shrink-0"
                >
                  ✕
                </button>
              </div>
            </Card>
          )}

          {/* President Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRESIDEN_RI.map(p => {
              const dur = getDurasi(p)
              const e = EKONOMI_PER_PRESIDEN.find(x => x.person_id === p.person_id)
              const selected = selectedId === p.person_id
              return (
                <button
                  key={p.person_id}
                  onClick={() => setSelectedId(prev => prev === p.person_id ? null : p.person_id)}
                  className={`text-left p-4 rounded-xl border transition-all hover:scale-[1.02] ${
                    selected
                      ? 'bg-bg-elevated border-2'
                      : 'bg-bg-elevated/50 border-border hover:bg-bg-elevated'
                  }`}
                  style={selected ? { borderColor: p.warna } : {}}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden"
                      style={{ backgroundColor: p.warna }}
                    >
                      <img
                        src={p.photo_url}
                        alt={p.nama}
                        className="w-full h-full object-cover"
                        onError={ev => { ev.currentTarget.style.display = 'none'; ev.currentTarget.parentElement.textContent = p.urut.toString() }}
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-primary line-clamp-1">{p.nama}</p>
                      <p className="text-xs text-text-secondary">{p.periode}</p>
                    </div>
                  </div>

                  <div
                    className="text-xs px-2 py-0.5 rounded-full text-white inline-block mb-2 font-medium"
                    style={{ backgroundColor: p.warna + 'BB' }}
                  >
                    {p.era}
                  </div>

                  <div className="flex justify-between text-xs text-text-secondary mt-1">
                    <span>⏱ {dur} thn</span>
                    {e?.gdp_end && (
                      <span className="text-green-400 font-medium">
                        GDP {formatGDP(e.gdp_end)}
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </>
      )}

      {/* ═══ TAB 2: WARISAN EKONOMI ════════════════════════════════════════ */}
      {activeTab === 'ekonomi' && (
        <>
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-1">📈 GDP Per Kapita: Awal vs Akhir Jabatan (USD)</h3>
            <p className="text-xs text-text-secondary mb-4">
              Perbandingan GDP per kapita (dalam USD) di awal dan akhir masa kepresidenan.
              Data historis berdasarkan World Bank / BPS.
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={gdpData.filter(d => d.gdp_start != null)}
                margin={{ top: 10, right: 20, left: 20, bottom: 30 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#9CA3AF', fontSize: 10 }}
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  tick={{ fill: '#9CA3AF', fontSize: 10 }}
                  tickFormatter={v => `$${v.toLocaleString('en')}`}
                  width={70}
                />
                <Tooltip content={<GDPTooltip />} />
                <Legend
                  formatter={name => <span style={{ color: '#D1D5DB', fontSize: 11 }}>{name === 'gdp_start' ? 'Awal Jabatan' : 'Akhir Jabatan'}</span>}
                />
                <Bar dataKey="gdp_start" name="gdp_start" fill="#6B7280" radius={[4,4,0,0]} />
                <Bar dataKey="gdp_end"   name="gdp_end"   radius={[4,4,0,0]}>
                  {gdpData.filter(d => d.gdp_start != null).map((entry, i) => (
                    <Cell key={i} fill={entry.warna} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* GDP Table */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-4">📊 Tabel Indikator Ekonomi per Presiden</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-text-secondary uppercase">
                    <th className="pb-2 text-left">Presiden</th>
                    <th className="pb-2 text-left">Periode</th>
                    <th className="pb-2 text-right">GDP Awal</th>
                    <th className="pb-2 text-right">GDP Akhir</th>
                    <th className="pb-2 text-right">Kenaikan</th>
                    <th className="pb-2 text-right">Inflasi Avg</th>
                    <th className="pb-2 text-left hidden md:table-cell">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {PRESIDEN_RI.map(p => {
                    const e = EKONOMI_PER_PRESIDEN.find(x => x.person_id === p.person_id)
                    const gain = e?.gdp_end && e?.gdp_start ? e.gdp_end - e.gdp_start : null
                    const gainPct = gain && e.gdp_start ? ((gain / e.gdp_start) * 100).toFixed(0) : null
                    return (
                      <tr key={p.person_id} className="hover:bg-bg-elevated/50">
                        <td className="py-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-5 rounded-sm flex-shrink-0"
                              style={{ backgroundColor: p.warna }}
                            />
                            <div>
                              <p className="text-xs font-medium text-text-primary">{p.nama}</p>
                              <p className="text-xs text-text-secondary">{p.partai}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-2 text-xs text-text-secondary">{p.periode}</td>
                        <td className="py-2 text-right text-xs text-text-secondary">
                          {e?.gdp_start ? `$${e.gdp_start.toLocaleString('en')}` : '—'}
                        </td>
                        <td className="py-2 text-right text-xs font-medium" style={{ color: p.warna }}>
                          {e?.gdp_end ? `$${e.gdp_end.toLocaleString('en')}` : 'In progress'}
                        </td>
                        <td className="py-2 text-right">
                          {gainPct ? (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-green-900/30 text-green-400 font-mono">
                              +{gainPct}%
                            </span>
                          ) : '—'}
                        </td>
                        <td className={`py-2 text-right text-xs font-medium ${
                          e?.inflasi_avg > 100 ? 'text-red-400' :
                          e?.inflasi_avg > 20  ? 'text-orange-400' :
                          'text-green-400'
                        }`}>
                          {e?.inflasi_avg != null ? `${e.inflasi_avg}%` : '—'}
                        </td>
                        <td className="py-2 hidden md:table-cell">
                          <p className="text-xs text-text-secondary">{e?.catatan || '—'}</p>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-text-secondary mt-3 pt-3 border-t border-border">
              Sumber: World Bank, BPS Indonesia. GDP per kapita dalam USD nominal.
              Data historis adalah estimasi berdasarkan sumber sekunder.
            </p>
          </Card>
        </>
      )}

      {/* ═══ TAB 4: WARISAN & PENILAIAN ════════════════════════════════════ */}
      {activeTab === 'warisan' && (
        <>
          {/* ── "Sejarah Menilai" Ratings ──────────────────────────────── */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-1">⭐ Sejarah Menilai — Rating Presidensial</h3>
            <p className="text-xs text-text-secondary mb-4">
              Skor komposit (skala 1–10) berdasarkan pertumbuhan ekonomi, rekam HAM, korupsi, dan stabilitas.
              Bersifat analitis — dikurasi dari sumber akademis & lembaga internasional.
            </p>
            <div className="space-y-3">
              {SEJARAH_RATINGS.map(r => (
                <div key={r.person_id} className="flex items-center gap-3">
                  <div className="w-20 text-xs font-medium text-text-secondary text-right flex-shrink-0">{r.label}</div>
                  <div className="flex-1 relative h-7 bg-bg-elevated rounded-lg overflow-hidden border border-border">
                    {r.rating != null ? (
                      <div
                        className="h-full rounded-lg flex items-center justify-end pr-2 transition-all"
                        style={{ width: `${(r.rating / 10) * 100}%`, backgroundColor: r.warna + 'CC' }}
                      >
                        <span className="text-xs font-bold text-white drop-shadow">{r.rating}</span>
                      </div>
                    ) : (
                      <div className="h-full flex items-center px-3">
                        <span className="text-xs text-text-muted italic">Masih menjabat…</span>
                      </div>
                    )}
                  </div>
                  <div className="w-6 text-xs font-bold text-text-primary flex-shrink-0 text-right">
                    {r.rating != null ? `${r.rating}` : '—'}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2">
              {SEJARAH_RATINGS.filter(r => r.rating != null).map(r => (
                <div key={r.person_id} className="flex items-start gap-2 text-xs text-text-secondary">
                  <div className="w-2 h-2 rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: r.warna }} />
                  <span><strong className="text-text-primary">{r.label}:</strong> {r.catatan}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* ── Warisan vs Luka Balance Meter ─────────────────────────── */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-1">⚖️ Warisan vs Luka — Balance Meter</h3>
            <p className="text-xs text-text-secondary mb-4">
              Jumlah pencapaian tercatat (hijau) vs kontroversi/pelanggaran (merah) per presiden.
              Panjang bar proporsional terhadap jumlah item.
            </p>
            <div className="space-y-4">
              {WARISAN_LUKA.map(item => {
                const total = item.achievements + item.controversies
                const achPct = (item.achievements / total) * 100
                const conPct = (item.controversies / total) * 100
                return (
                  <div key={item.person_id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-text-primary">{item.fullNama}</span>
                      <span className="text-xs text-text-secondary">
                        <span className="text-green-400 font-semibold">{item.achievements}</span> pencapaian ·{' '}
                        <span className="text-red-400 font-semibold">{item.controversies}</span> kontroversi
                      </span>
                    </div>
                    <div className="flex h-5 rounded-lg overflow-hidden gap-px">
                      <div
                        className="flex items-center justify-center text-white text-[10px] font-bold transition-all"
                        style={{ width: `${achPct}%`, backgroundColor: '#16A34A' }}
                        title={`${item.achievements} pencapaian (${achPct.toFixed(0)}%)`}
                      >
                        {achPct > 30 ? `${item.achievements}` : ''}
                      </div>
                      <div
                        className="flex items-center justify-center text-white text-[10px] font-bold transition-all"
                        style={{ width: `${conPct}%`, backgroundColor: '#DC2626' }}
                        title={`${item.controversies} kontroversi (${conPct.toFixed(0)}%)`}
                      >
                        {conPct > 20 ? `${item.controversies}` : ''}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs text-text-secondary">
              <span><span className="inline-block w-3 h-3 rounded bg-green-600 mr-1 align-middle" />Pencapaian</span>
              <span><span className="inline-block w-3 h-3 rounded bg-red-600 mr-1 align-middle" />Kontroversi</span>
              <span className="ml-auto italic">Data berdasarkan literatur publik & dokumentasi lembaga HAM.</span>
            </div>
          </Card>

          {/* ── Soeharto Orde Baru Deep Dive ──────────────────────────── */}
          <Card className="p-5 border-2 border-red-800/40">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-900/50 flex items-center justify-center text-xl flex-shrink-0">🔴</div>
              <div>
                <h3 className="text-sm font-bold text-red-400">Orde Baru — Deep Dive Soeharto (1967–1998)</h3>
                <p className="text-xs text-text-secondary">32 tahun kekuasaan: pembangunan ekonomi di atas fondasi represi</p>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {[
                { label: "Rata-rata pertumbuhan GDP", value: "7%/tahun", color: "text-green-400" },
                { label: "Estimasi korupsi KKN", value: "$15–35 M", color: "text-red-400" },
                { label: "Korban Timor Timur", value: "180.000+", color: "text-red-400" },
                { label: "Lama berkuasa", value: "32 tahun", color: "text-amber-400" },
              ].map(s => (
                <div key={s.label} className="bg-bg-elevated rounded-xl p-3 border border-border">
                  <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Cronies */}
            <div className="mb-5">
              <h4 className="text-xs font-semibold text-amber-400 mb-2">🕸️ Jaringan Kroni Utama (Cendana Network)</h4>
              <div className="space-y-2">
                {ORBA_CRONIES.map(c => (
                  <div key={c.nama} className="flex items-start gap-2 p-2.5 bg-bg-elevated rounded-lg border border-border">
                    <span className="text-amber-400 text-xs flex-shrink-0 mt-0.5">◈</span>
                    <div>
                      <p className="text-xs font-semibold text-text-primary">{c.nama}</p>
                      <p className="text-xs text-text-secondary">{c.bisnis}</p>
                      <p className="text-xs text-amber-500/80 italic">{c.hubungan}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
                <span className="text-xs text-text-secondary">Tokoh terkait:</span>
                {['soeharto','habibie','prabowo','wiranto'].map(id => (
                  <a
                    key={id}
                    href={`/persons/${id}`}
                    className="text-xs px-2 py-0.5 rounded-full bg-red-900/30 text-red-400 border border-red-800/40 hover:bg-red-900/50 transition-colors"
                  >
                    {id.charAt(0).toUpperCase() + id.slice(1)} →
                  </a>
                ))}
              </div>
            </div>

            {/* Mini Timeline Orde Baru */}
            <div>
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Linimasa Orde Baru</h4>
              <div className="relative pl-6 space-y-2">
                <div className="absolute left-2 top-0 bottom-0 w-px bg-red-900/40" />
                {ORDE_BARU_EVENTS.map((ev, i) => {
                  const tagColor = ev.tag === 'represi' ? 'text-red-400 bg-red-900/20 border-red-800/30'
                    : ev.tag === 'ekonomi' ? 'text-green-400 bg-green-900/20 border-green-800/30'
                    : ev.tag === 'dinasti' ? 'text-amber-400 bg-amber-900/20 border-amber-800/30'
                    : 'text-blue-400 bg-blue-900/20 border-blue-800/30'
                  return (
                    <div key={i} className="relative flex items-start gap-2">
                      <div className="absolute -left-4 top-1.5 w-2 h-2 rounded-full bg-red-700 border border-red-900" />
                      <div className="flex-shrink-0 w-8 text-xs font-mono text-text-muted">{ev.tahun}</div>
                      <p className="text-xs text-text-secondary flex-1 leading-relaxed">{ev.label}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border flex-shrink-0 ${tagColor}`}>
                        {ev.tag}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>
        </>
      )}

      {/* ═══ TAB 3: PERBANDINGAN KEBIJAKAN ════════════════════════════════ */}
      {activeTab === 'kebijakan' && (
        <>
          {/* Selector */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-2">🎯 Pilih Presiden untuk Dibandingkan</h3>
            <p className="text-xs text-text-secondary mb-3">
              Pilih hingga 3 presiden. Skor 1–10 berdasarkan evaluasi akademis dan historis.
              <span className="ml-1 text-amber-400">*Bersifat analitis, bukan penilaian definitif.</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {PRESIDEN_RI.map(p => {
                const selected = radarSelected.includes(p.person_id)
                return (
                  <button
                    key={p.person_id}
                    onClick={() => {
                      if (selected) {
                        setRadarSelected(prev => prev.filter(id => id !== p.person_id))
                      } else if (radarSelected.length < 3) {
                        setRadarSelected(prev => [...prev, p.person_id])
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs border transition-all font-medium"
                    style={{
                      borderColor: p.warna,
                      color: selected ? '#fff' : p.warna,
                      backgroundColor: selected ? p.warna + '40' : 'transparent',
                    }}
                  >
                    {p.nama.split(' ').pop()}
                  </button>
                )
              })}
            </div>
          </Card>

          {/* Radar Chart */}
          {radarSelected.length > 0 && (
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-1">📡 Radar Kebijakan</h3>
              <p className="text-xs text-text-secondary mb-4">
                Perbandingan multi-dimensi: Ekonomi, HAM, Transparansi Korupsi, Infrastruktur, Stabilitas (skala 1–10)
              </p>
              <ResponsiveContainer width="100%" height={360}>
                <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                  <PolarGrid stroke="#2D3748" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: '#9CA3AF', fontSize: 11 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 10]}
                    tick={{ fill: '#6B7280', fontSize: 9 }}
                  />
                  {radarSelected.map((id, idx) => {
                    const p = PRESIDEN_RI.find(x => x.person_id === id)
                    return (
                      <Radar
                        key={id}
                        name={p?.nama.split(' ').pop() || id}
                        dataKey={id}
                        stroke={RADAR_COLORS[PRESIDEN_RI.findIndex(x => x.person_id === id)]}
                        fill={RADAR_COLORS[PRESIDEN_RI.findIndex(x => x.person_id === id)]}
                        fillOpacity={0.15}
                        strokeWidth={2}
                      />
                    )
                  })}
                  <Legend
                    formatter={name => <span style={{ color: '#D1D5DB', fontSize: 11 }}>{name}</span>}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1E2235', border: '1px solid #2D3748', borderRadius: 8, fontSize: 12 }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Score Table */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-4">📋 Tabel Skor Kebijakan Lengkap</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-text-secondary uppercase">
                    <th className="pb-2 text-left">Presiden</th>
                    <th className="pb-2 text-center">Ekonomi</th>
                    <th className="pb-2 text-center">HAM</th>
                    <th className="pb-2 text-center">Anti-Korupsi</th>
                    <th className="pb-2 text-center">Infrastruktur</th>
                    <th className="pb-2 text-center">Stabilitas</th>
                    <th className="pb-2 text-center">Rata-rata</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {KEBIJAKAN_SCORES.map(s => {
                    const p = PRESIDEN_RI.find(x => x.person_id === s.person_id)
                    const avg = ((s.ekonomi + s.ham + s.korupsi + s.infrastruktur + s.stabilitas) / 5).toFixed(1)
                    function scoreColor(v) {
                      if (v >= 8) return 'text-green-400'
                      if (v >= 6) return 'text-yellow-400'
                      if (v >= 4) return 'text-orange-400'
                      return 'text-red-400'
                    }
                    return (
                      <tr key={s.person_id} className="hover:bg-bg-elevated/50">
                        <td className="py-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-5 rounded-sm flex-shrink-0" style={{ backgroundColor: p?.warna || '#6B7280' }} />
                            <p className="text-xs font-medium text-text-primary">{s.nama}</p>
                          </div>
                        </td>
                        {[s.ekonomi, s.ham, s.korupsi, s.infrastruktur, s.stabilitas].map((v, i) => (
                          <td key={i} className={`py-2 text-center text-xs font-mono font-bold ${scoreColor(v)}`}>
                            {v}/10
                          </td>
                        ))}
                        <td className="py-2 text-center">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            parseFloat(avg) >= 7 ? 'bg-green-900/40 text-green-400' :
                            parseFloat(avg) >= 5 ? 'bg-yellow-900/40 text-yellow-400' :
                            'bg-red-900/40 text-red-400'
                          }`}>
                            {avg}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-3 pt-3 border-t border-border space-y-1">
              <p className="text-xs text-text-secondary">
                ⚠️ <strong>Disclaimer:</strong> Skor ini bersifat analitis dan didasarkan pada literatur akademis,
                laporan lembaga internasional (Freedom House, Transparency International, World Bank),
                dan penilaian historis. Tidak bersifat definitif dan dapat diperdebatkan.
              </p>
              <p className="text-xs text-text-secondary">
                Skor "Anti-Korupsi" mencerminkan transparansi dan upaya pemberantasan korupsi (10 = paling bersih).
              </p>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
