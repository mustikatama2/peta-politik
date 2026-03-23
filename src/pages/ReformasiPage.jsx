import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PERSONS } from '../data/persons.js'

// ─── DATA ────────────────────────────────────────────────────────────────────

const ERAS = [
  {
    id: "habibie",
    label: "Habibie",
    year: "1998–1999",
    president: "B.J. Habibie",
    person_id: "habibie",
    color: "#F59E0B",
    tagline: "Reformasi: Kebebasan Pers & Pemilu Bebas",
    achievements: [
      "Membebaskan tahanan politik",
      "Mencabut pembredelan pers",
      "Referendum Timor-Timur",
      "Meletakkan dasar pemilu bebas 1999"
    ],
    controversies: [
      "Timor-Timur lepas — dianggap pengkhianatan oleh sebagian",
      "Ekonomi masih krisis pasca-1998",
      "Kalah voting kepercayaan MPR 1999"
    ],
    laws: ["UU Pers No. 40/1999", "UU Pemilu No. 3/1999"],
    duration_days: 517
  },
  {
    id: "gusdur",
    label: "Gus Dur",
    year: "1999–2001",
    president: "Abdurrahman Wahid",
    person_id: "gus_dur",
    color: "#10B981",
    tagline: "Pluralisme & Reformasi TNI/Polri",
    achievements: [
      "Pemisahan TNI-Polri",
      "Kebebasan etnis Tionghoa dan agama Kong Hu Cu",
      "Desentralisasi daerah",
      "Hubungan diplomatik Israel (dibatalkan)"
    ],
    controversies: [
      "Buloggate dan Bruneigate",
      "Pencopotan Kapolri tanpa persetujuan DPR",
      "Dicopot MPR setelah maklumat darurat"
    ],
    laws: ["UU Otonomi Daerah 22/1999", "Keppres 6/2000 (Tionghoa)"],
    duration_days: 604
  },
  {
    id: "megawati",
    label: "Megawati",
    year: "2001–2004",
    president: "Megawati Soekarnoputri",
    person_id: "megawati",
    color: "#DC2626",
    tagline: "Stabilisasi & Pemberantasan Korupsi Awal",
    achievements: [
      "Pembentukan KPK (2002)",
      "Penjualan aset BPPN pasca-krisis",
      "Penyelesaian konflik GAM (awal)",
      "Pemilihan presiden langsung (UU 23/2003)"
    ],
    controversies: [
      "Penjualan Indosat ke Temasek (Singapore)",
      "Bom Bali 2002 dan respons keamanan",
      "Pertumbuhan ekonomi lambat"
    ],
    laws: ["UU KPK No. 30/2002", "UU Pemda 32/2004"],
    duration_days: 1066
  },
  {
    id: "sby1",
    label: "SBY I",
    year: "2004–2009",
    president: "Susilo Bambang Yudhoyono",
    person_id: "susilo_bambang_yudhoyono",
    color: "#3B82F6",
    tagline: "Stabilitas & Pertumbuhan Ekonomi",
    achievements: [
      "Pertumbuhan ekonomi 5-6%",
      "Penyelesaian konflik Aceh (MoU Helsinki 2005)",
      "KPK aktif — kasus pertama besar",
      "Pemilihan kepala daerah langsung"
    ],
    controversies: [
      "Kasus Century (Wapres JK vs Boediono)",
      "Korupsi kader Demokrat mulai muncul",
      "Kriminalisasi pimpinan KPK (cicak vs buaya)"
    ],
    laws: ["UU 11/2008 ITE", "UU Anti Terorisme revisi"],
    duration_days: 1826
  },
  {
    id: "sby2",
    label: "SBY II",
    year: "2009–2014",
    president: "Susilo Bambang Yudhoyono",
    person_id: "susilo_bambang_yudhoyono",
    color: "#2563EB",
    tagline: "Korupsi Demokrat & Perlambatan",
    achievements: [
      "Pertumbuhan ekonomi 6% pada 2012",
      "BPJS Kesehatan (dipersiapkan)",
      "MP3EI Masterplan Percepatan Ekonomi"
    ],
    controversies: [
      "Hambalang (Anas, Andi Mallarangeng)",
      "Nazaruddin whistle-blower dari Kolombia",
      "Penolakan pilkada langsung akhir jabatan"
    ],
    laws: ["UU BPJS 24/2011", "UU Desa 6/2014"],
    duration_days: 1826
  },
  {
    id: "jokowi1",
    label: "Jokowi I",
    year: "2014–2019",
    president: "Joko Widodo",
    person_id: "jokowi",
    color: "#DC2626",
    tagline: "Infrastruktur Masif & Nawacita",
    achievements: [
      "Pembangunan jalan tol 1.900 km",
      "Program Kartu Indonesia Sehat & Pintar",
      "Proyek strategis nasional masif",
      "Rekonsiliasi Timor-Timur"
    ],
    controversies: [
      "Revisi UU KPK 2019 — dinilai pelemahan",
      "Pencapresan Jokowi oleh PDIP via 'restu Mega'",
      "Novel Baswedan disiram air keras (2017)"
    ],
    laws: ["UU KPK revisi 2019", "Omnibus Law UUCK (disiapkan)"],
    duration_days: 1826
  },
  {
    id: "jokowi2",
    label: "Jokowi II",
    year: "2019–2024",
    president: "Joko Widodo",
    person_id: "jokowi",
    color: "#B91C1C",
    tagline: "Omnibus Law, IKN & Kontroversial",
    achievements: [
      "UU Cipta Kerja (Omnibus Law)",
      "Pemindahan IKN ke Kalimantan Timur",
      "Vaksinasi COVID-19 terbesar",
      "Proyek Hilirisasi Nikel"
    ],
    controversies: [
      "MK ubah batas usia Cawapres (Gibran)",
      "Tom Lembong ditangkap",
      "Demo #IndonesiaGelap 2024",
      "PDIP pecah dengan Jokowi pasca-2023"
    ],
    laws: ["UU IKN 3/2022", "UU Cipta Kerja 11/2020", "UU TPKS 12/2022"],
    duration_days: 1826
  },
  {
    id: "prabowo",
    label: "Prabowo",
    year: "2024–kini",
    president: "Prabowo Subianto",
    person_id: "prabowo",
    color: "#7C3AED",
    tagline: "Ketahanan Pangan & Kabinet Besar",
    achievements: [
      "Kabinet terbesar dalam sejarah (48 menteri + 56 wakil)",
      "Program MBG (Makan Bergizi Gratis)",
      "Danantara — Super Holding BUMN",
      "UU TNI kontroversial 2025"
    ],
    controversies: [
      "UU TNI 2025 — TNI aktif masuk jabatan sipil",
      "Efisiensi anggaran Rp 306T — potong program sosial",
      "Demo #IndonesiaGelap gelombang 2",
      "PDIP jadi oposisi resmi"
    ],
    laws: ["UU TNI 2025", "Perpres Danantara 2025"],
    duration_days: null
  }
]

const AMENDMENTS = [
  {
    year: 1999,
    number: 1,
    color: "#F59E0B",
    changes: [
      "Pembatasan kekuasaan presiden",
      "Penguatan DPR",
      "Pencabutan kekuasaan legislatif presiden"
    ]
  },
  {
    year: 2000,
    number: 2,
    color: "#10B981",
    changes: [
      "Pemerintahan daerah",
      "DPR & DPRD",
      "HAM dalam konstitusi",
      "Bendera, bahasa, lambang negara"
    ]
  },
  {
    year: 2001,
    number: 3,
    color: "#3B82F6",
    changes: [
      "Pemilihan presiden langsung",
      "Pembentukan MK dan KY",
      "DPD (Dewan Perwakilan Daerah)",
      "Pemberhentian presiden"
    ]
  },
  {
    year: 2002,
    number: 4,
    color: "#8B5CF6",
    changes: [
      "Penghapusan MPR sebagai lembaga tertinggi",
      "Komposisi MPR baru",
      "Pendidikan dalam konstitusi",
      "Perekonomian nasional"
    ]
  }
]

const INSTITUTIONS = [
  { emoji: "⚖️", name: "KPK", year: 2002, func: "Komisi Pemberantasan Korupsi — Penindakan dan pencegahan korupsi", status: "dilemahkan", statusColor: "text-orange-500" },
  { emoji: "🏛️", name: "MK", year: 2003, func: "Mahkamah Konstitusi — Pengujian undang-undang terhadap UUD", status: "aktif", statusColor: "text-green-500" },
  { emoji: "👨‍⚖️", name: "KY", year: 2004, func: "Komisi Yudisial — Pengawasan perilaku hakim", status: "aktif", statusColor: "text-green-500" },
  { emoji: "🏛️", name: "DPD", year: 2004, func: "Dewan Perwakilan Daerah — Representasi daerah di parlemen", status: "aktif", statusColor: "text-green-500" },
  { emoji: "📋", name: "Ombudsman", year: 2008, func: "Pengawasan pelayanan publik dan maladministrasi", status: "aktif", statusColor: "text-green-500" },
  { emoji: "💰", name: "PPATK", year: 2002, func: "Pusat Pelaporan Analisis Transaksi Keuangan — Anti pencucian uang", status: "aktif", statusColor: "text-green-500" },
  { emoji: "🤝", name: "Komnas HAM", year: 1998, func: "Komisi Nasional Hak Asasi Manusia — diperkuat pasca-reformasi", status: "aktif", statusColor: "text-green-500" },
  { emoji: "🗳️", name: "Bawaslu", year: 2008, func: "Badan Pengawas Pemilihan Umum — Pengawas pemilu nasional", status: "aktif", statusColor: "text-green-500" },
]

const SCORECARD = [
  { area: "Kebebasan Pers", indicator: "🟡", color: "text-yellow-500", assessment: "Meningkat pesat 1999–2010, namun konsolidasi media oleh oligarki mengancam independensi sejak 2015." },
  { area: "Antikorupsi", indicator: "🔴", color: "text-red-500", assessment: "KPK aktif 2003–2019 namun dilemahkan sistematis lewat revisi UU 2019; korupsi masih endemik." },
  { area: "Desentralisasi", indicator: "✅", color: "text-green-500", assessment: "Otonomi daerah berhasil diimplementasikan; pilkada langsung memperkuat akuntabilitas lokal." },
  { area: "Hak Sipil", indicator: "✅", color: "text-green-500", assessment: "HAM masuk konstitusi; kebebasan berkumpul dan berpendapat jauh lebih baik dari era Orde Baru." },
  { area: "Otonomi Militer", indicator: "❌", color: "text-red-600", assessment: "UU TNI 2025 memperbolehkan perwira aktif di jabatan sipil — dianggap kemunduran kontrol sipil atas militer." },
  { area: "Peradilan Bersih", indicator: "🔴", color: "text-red-500", assessment: "Reformasi peradilan berjalan lambat; korupsi hakim dan mafia peradilan masih menjadi masalah serius." },
  { area: "Pemilu Bebas", indicator: "✅", color: "text-green-500", assessment: "Pemilu 1999 sampai 2024 diakui bebas dan kompetitif; KPU dan Bawaslu berfungsi relatif baik." },
]

const HERO_STATS = [
  { emoji: "🗳️", label: "Pemilu sejak 1999", value: "7", sub: "1999, 2004, 2009, 2014, 2019, 2024" },
  { emoji: "🏛️", label: "Presiden sejak 1998", value: "7", sub: "Habibie s/d Prabowo" },
  { emoji: "📜", label: "Amendemen UUD", value: "4", sub: "1999 · 2000 · 2001 · 2002" },
  { emoji: "⚖️", label: "Lembaga baru", value: "8+", sub: "KPK, MK, DPD, KY, Bawaslu..." },
]

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function ReformasiPage() {
  const [activeEra, setActiveEra] = useState("habibie")
  const [expandedAmend, setExpandedAmend] = useState(null)

  const era = ERAS.find(e => e.id === activeEra)
  const president = PERSONS.find(p => p.id === era?.person_id)

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* ── Page Header ── */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-medium mb-2">
          <span>🇮🇩</span> Sejarah Politik Indonesia
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary">Era Reformasi: 1998–Kini</h1>
        <p className="text-text-secondary text-lg">Perjalanan Demokrasi Indonesia</p>
        <p className="text-text-muted text-sm max-w-2xl mx-auto">
          26 tahun perjalanan demokrasi — dari runtuhnya Orde Baru hingga kabinet terbesar dalam sejarah.
          Telusuri setiap era, amandemen konstitusi, dan lembaga reformasi yang membentuk Indonesia modern.
        </p>
      </div>

      {/* ── Section 1: Hero Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {HERO_STATS.map((stat, i) => (
          <div key={i} className="bg-bg-card border border-border rounded-xl p-4 text-center hover:border-red-300 transition-all">
            <div className="text-3xl mb-1">{stat.emoji}</div>
            <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
            <div className="text-xs font-semibold text-text-secondary mt-1">{stat.label}</div>
            <div className="text-[10px] text-text-muted mt-1 leading-tight">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Section 2: Era Timeline ── */}
      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-text-primary">🕰️ Linimasa Era Kepresidenan</h2>
          <p className="text-text-muted text-sm mt-0.5">Klik era untuk melihat detail pencapaian dan kontroversi</p>
        </div>

        {/* Era Tabs — scrollable horizontal stepper */}
        <div className="overflow-x-auto border-b border-border">
          <div className="flex min-w-max">
            {ERAS.map((e, idx) => (
              <button
                key={e.id}
                onClick={() => setActiveEra(e.id)}
                className={`relative flex flex-col items-center px-4 py-3 min-w-[90px] transition-all border-b-2 ${
                  activeEra === e.id
                    ? 'border-b-[3px] bg-bg-elevated'
                    : 'border-transparent hover:bg-bg-hover'
                }`}
                style={{ borderBottomColor: activeEra === e.id ? e.color : 'transparent' }}
              >
                {/* Connector line */}
                {idx < ERAS.length - 1 && (
                  <div className="absolute right-0 top-1/2 w-full h-0.5 bg-border -translate-y-1/2 z-0 pointer-events-none" style={{ left: '50%' }} />
                )}
                {/* Dot */}
                <div
                  className="w-3 h-3 rounded-full border-2 border-white shadow-sm mb-1 z-10 relative"
                  style={{ backgroundColor: e.color }}
                />
                <span className={`text-xs font-semibold z-10 ${activeEra === e.id ? 'text-text-primary' : 'text-text-muted'}`}>{e.label}</span>
                <span className="text-[10px] text-text-muted z-10">{e.year}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Era Detail Card */}
        {era && (
          <div className="p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              {/* Left: era info */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-12 rounded-full flex-shrink-0" style={{ backgroundColor: era.color }} />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-text-primary">{era.president}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-bg-elevated text-text-muted border border-border">{era.year}</span>
                    </div>
                    <p className="text-sm text-text-secondary italic mt-0.5">{era.tagline}</p>
                    {era.duration_days ? (
                      <p className="text-xs text-text-muted mt-1">Masa jabatan: {era.duration_days.toLocaleString()} hari</p>
                    ) : (
                      <p className="text-xs text-text-muted mt-1">Masa jabatan: <span className="text-purple-400">Sedang berjalan</span></p>
                    )}
                  </div>
                </div>

                {/* Link to person profile */}
                {president && (
                  <Link
                    to={`/persons/${era.person_id}`}
                    className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-400 hover:underline"
                  >
                    👤 Lihat profil lengkap {era.president} →
                  </Link>
                )}
              </div>

              {/* Right: laws */}
              {era.laws.length > 0 && (
                <div className="md:w-64 flex-shrink-0">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">📜 Legislasi Kunci</p>
                  <div className="space-y-1">
                    {era.laws.map((law, i) => (
                      <div key={i} className="text-xs px-2.5 py-1.5 rounded-lg bg-bg-elevated border border-border text-text-secondary">
                        {law}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Achievements & Controversies */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Achievements */}
              <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-4 border border-green-200 dark:border-green-800">
                <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wider mb-3">✅ Pencapaian</p>
                <ul className="space-y-2">
                  {era.achievements.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="text-green-500 flex-shrink-0 mt-0.5">•</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Controversies */}
              <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-4 border border-red-200 dark:border-red-800">
                <p className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider mb-3">⚠️ Kontroversi</p>
                <ul className="space-y-2">
                  {era.controversies.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="text-red-500 flex-shrink-0 mt-0.5">•</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Section 3: Amandemen UUD 1945 ── */}
      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-text-primary">📜 Amandemen UUD 1945</h2>
          <p className="text-text-muted text-sm mt-0.5">4 kali amandemen dalam 4 tahun (1999–2002) — membentuk sistem ketatanegaraan modern Indonesia</p>
        </div>
        <div className="p-4 space-y-2">
          {AMENDMENTS.map(amend => (
            <div key={amend.number} className="border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedAmend(expandedAmend === amend.number ? null : amend.number)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-bg-elevated transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ backgroundColor: amend.color }}>
                    {amend.number}
                  </div>
                  <div>
                    <span className="font-semibold text-text-primary text-sm">Amandemen ke-{amend.number}</span>
                    <span className="text-text-muted text-xs ml-2">{amend.year}</span>
                  </div>
                </div>
                <span className="text-text-muted text-lg transition-transform" style={{ transform: expandedAmend === amend.number ? 'rotate(180deg)' : 'none' }}>
                  ▾
                </span>
              </button>
              {expandedAmend === amend.number && (
                <div className="px-4 pb-4 pt-1 bg-bg-elevated">
                  <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-2">Perubahan utama:</p>
                  <ul className="space-y-1.5">
                    {amend.changes.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="flex-shrink-0 mt-0.5" style={{ color: amend.color }}>◆</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 4: Lembaga Baru ── */}
      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-text-primary">🏛️ Lembaga Baru Pasca-Reformasi</h2>
          <p className="text-text-muted text-sm mt-0.5">Institusi yang lahir dari tuntutan reformasi 1998</p>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {INSTITUTIONS.map((inst, i) => (
            <div key={i} className="bg-bg-elevated border border-border rounded-xl p-4 hover:border-red-300 transition-all space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{inst.emoji}</span>
                  <div>
                    <p className="font-bold text-text-primary text-sm">{inst.name}</p>
                    <p className="text-[10px] text-text-muted">Est. {inst.year}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${
                  inst.status === 'aktif'
                    ? 'border-green-300 bg-green-50 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400'
                    : 'border-orange-300 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:border-orange-700 dark:text-orange-400'
                }`}>
                  {inst.status === 'aktif' ? '✓ Aktif' : '⚠ Dilemahkan'}
                </span>
              </div>
              <p className="text-xs text-text-muted leading-snug">{inst.func}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 5: Scorecard ── */}
      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-text-primary">📊 Rapor Reformasi</h2>
          <p className="text-text-muted text-sm mt-0.5">Seberapa jauh reformasi berhasil di berbagai bidang?</p>
        </div>
        <div className="p-4 space-y-2">
          {SCORECARD.map((item, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl bg-bg-elevated border border-border hover:border-red-200 transition-all">
              <span className="text-2xl flex-shrink-0">{item.indicator}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text-primary text-sm">{item.area}</p>
                <p className="text-xs text-text-muted mt-0.5 leading-snug">{item.assessment}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 pb-4">
          <p className="text-[11px] text-text-muted">
            ✅ Berhasil &nbsp;·&nbsp; 🟡 Kemajuan parsial &nbsp;·&nbsp; 🔴 Masalah serius &nbsp;·&nbsp; ❌ Kemunduran
          </p>
        </div>
      </div>

      {/* ── Footer note ── */}
      <div className="text-center text-xs text-text-muted pb-4 space-y-1">
        <p>Data historis berdasarkan dokumen publik, undang-undang, dan catatan sejarah Indonesia.</p>
        <p className="flex items-center justify-center gap-3">
          <Link to="/timeline-kekuasaan" className="text-red-400 hover:underline">↗ Lihat Sejarah Presiden Lengkap</Link>
          <Link to="/kpk" className="text-red-400 hover:underline">↗ KPK Cases</Link>
          <Link to="/hukum" className="text-red-400 hover:underline">↗ Legislasi</Link>
        </p>
      </div>
    </div>
  )
}
