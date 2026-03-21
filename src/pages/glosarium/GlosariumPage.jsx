import { useState, useMemo } from 'react'

const CATEGORIES = ['Semua', 'Umum', 'Legislatif', 'Eksekutif', 'Pemilu', 'Hukum & Korupsi', 'Ekonomi & Fiskal', 'Organisasi']

const TERMS = [
  // ── Umum ──
  { term: 'Reformasi', definition: 'Gerakan perubahan besar-besaran di Indonesia yang dimulai 1998, menandai berakhirnya Orde Baru dan awal era demokrasi multipartai.', category: 'Umum' },
  { term: 'Orba', definition: 'Orde Baru — rezim pemerintahan Soeharto (1966–1998) yang dicirikan oleh otoritarianisme, pembangunan ekonomi, dan kontrol ketat atas politik.', category: 'Umum' },
  { term: 'Pancasila', definition: 'Dasar ideologi negara Indonesia yang terdiri dari lima sila: Ketuhanan, Kemanusiaan, Persatuan, Demokrasi, dan Keadilan Sosial.', category: 'Umum' },
  { term: 'UUD 1945', definition: 'Undang-Undang Dasar Negara Republik Indonesia Tahun 1945 — konstitusi dasar yang mengatur struktur pemerintahan dan hak-hak warga negara.', category: 'Umum' },
  { term: 'Koalisi', definition: 'Gabungan partai atau kelompok politik yang bekerja sama untuk mencapai tujuan bersama, biasanya untuk memenangkan pemilu atau membentuk pemerintahan.', category: 'Umum' },
  { term: 'Oposisi', definition: 'Pihak atau partai yang tidak berada dalam koalisi pemerintahan dan berperan mengawasi, mengkritisi, serta mengoreksi kebijakan pemerintah.', category: 'Umum' },
  { term: 'Dwi Fungsi ABRI', definition: 'Doktrin era Orde Baru yang memberikan peran ganda kepada Angkatan Bersenjata: fungsi pertahanan dan fungsi sosial-politik. Dihapuskan pasca-Reformasi 1998.', category: 'Umum' },
  { term: 'Desentralisasi', definition: 'Pelimpahan kewenangan pemerintahan dari pusat ke daerah, diperkuat melalui UU Otonomi Daerah pasca-Reformasi.', category: 'Umum' },
  { term: 'KKN', definition: 'Korupsi, Kolusi, dan Nepotisme — frasa kunci Reformasi yang merujuk pada penyalahgunaan kekuasaan dalam tiga bentuk utama.', category: 'Umum' },

  // ── Legislatif ──
  { term: 'Fraksi', definition: 'Kelompok anggota DPR yang berasal dari satu partai atau gabungan partai, bertugas menyampaikan pandangan partai di parlemen.', category: 'Legislatif' },
  { term: 'DPR', definition: 'Dewan Perwakilan Rakyat — lembaga legislatif tingkat nasional beranggotakan 580 orang yang dipilih melalui pemilu legislatif.', category: 'Legislatif' },
  { term: 'DPD', definition: 'Dewan Perwakilan Daerah — lembaga legislatif yang mewakili kepentingan provinsi, dipilih per provinsi (4 kursi masing-masing).', category: 'Legislatif' },
  { term: 'MPR', definition: 'Majelis Permusyawaratan Rakyat — gabungan DPR dan DPD, berwenang mengubah UUD dan melantik presiden.', category: 'Legislatif' },
  { term: 'Pansus', definition: 'Panitia Khusus — tim kerja ad hoc DPR yang dibentuk untuk membahas RUU atau isu tertentu, dibubarkan setelah tugasnya selesai.', category: 'Legislatif' },
  { term: 'Panja', definition: 'Panitia Kerja — sub-tim dalam fraksi atau pansus DPR yang membahas detail teknis suatu RUU atau agenda legislasi.', category: 'Legislatif' },
  { term: 'Interpelasi', definition: 'Hak DPR untuk meminta keterangan kepada pemerintah mengenai kebijakan penting yang berdampak luas bagi masyarakat.', category: 'Legislatif' },
  { term: 'Hak Angket', definition: 'Hak DPR untuk melakukan penyelidikan terhadap kebijakan pemerintah yang diduga melanggar hukum.', category: 'Legislatif' },
  { term: 'Hak Menyatakan Pendapat', definition: 'Hak DPR sebagai lembaga untuk menyatakan pendapat terhadap kebijakan pemerintah atau kejadian luar biasa.', category: 'Legislatif' },
  { term: 'Prolegnas', definition: 'Program Legislasi Nasional — daftar prioritas RUU yang akan dibahas dan disahkan DPR dalam suatu periode.', category: 'Legislatif' },
  { term: 'Omnibus Law', definition: 'Undang-undang yang merevisi banyak UU sekaligus dalam satu produk hukum. Di Indonesia dikenal melalui UU Cipta Kerja 2020.', category: 'Legislatif' },

  // ── Eksekutif ──
  { term: 'Kabinet', definition: 'Kumpulan menteri yang dipilih presiden untuk memimpin kementerian dan membantu pelaksanaan pemerintahan.', category: 'Eksekutif' },
  { term: 'Perppu', definition: 'Peraturan Pemerintah Pengganti Undang-Undang — produk hukum yang dikeluarkan presiden dalam keadaan mendesak tanpa melalui DPR terlebih dahulu.', category: 'Eksekutif' },
  { term: 'PP', definition: 'Peraturan Pemerintah — aturan yang diterbitkan presiden untuk melaksanakan undang-undang.', category: 'Eksekutif' },
  { term: 'Keppres', definition: 'Keputusan Presiden — produk hukum presiden yang bersifat konkret, individual, dan final untuk hal-hal tertentu.', category: 'Eksekutif' },
  { term: 'Inpres', definition: 'Instruksi Presiden — arahan presiden kepada bawahan (menteri, kepala lembaga) untuk melaksanakan tugas tertentu.', category: 'Eksekutif' },
  { term: 'Gubernur', definition: 'Kepala daerah tingkat provinsi, dipilih langsung melalui Pilkada sejak era otonomi daerah.', category: 'Eksekutif' },
  { term: 'Bupati/Wali Kota', definition: 'Kepala daerah tingkat kabupaten atau kota, dipilih langsung melalui Pilkada.', category: 'Eksekutif' },
  { term: 'Amdal', definition: 'Analisis Mengenai Dampak Lingkungan — kajian wajib sebelum proyek besar dijalankan, menjadi instrumen kebijakan eksekutif.', category: 'Eksekutif' },

  // ── Pemilu ──
  { term: 'Pilkada', definition: 'Pemilihan Kepala Daerah — pemilihan langsung gubernur/bupati/wali kota yang diselenggarakan serentak setiap lima tahun.', category: 'Pemilu' },
  { term: 'Pilpres', definition: 'Pemilihan Presiden — pemilihan langsung pasangan presiden dan wakil presiden yang diselenggarakan setiap lima tahun.', category: 'Pemilu' },
  { term: 'Pileg', definition: 'Pemilihan Legislatif — pemilihan anggota DPR, DPD, dan DPRD yang diselenggarakan bersamaan dengan Pilpres.', category: 'Pemilu' },
  { term: 'Dapil', definition: 'Daerah Pemilihan — wilayah yang memilih sejumlah anggota legislatif sesuai jumlah kursi yang tersedia.', category: 'Pemilu' },
  { term: 'Presidential Threshold', definition: 'Ambang batas pencalonan presiden — persentase kursi DPR atau suara sah nasional yang harus dimiliki koalisi pengusung calon presiden. Dihapus MK 2025.', category: 'Pemilu' },
  { term: 'Parliamentary Threshold', definition: 'Ambang batas parlemen — persentase suara nasional minimum (4%) yang harus diraih partai agar mendapat kursi DPR.', category: 'Pemilu' },
  { term: 'Ambang Batas', definition: 'Batas minimum perolehan suara atau kursi yang harus dicapai peserta pemilu untuk mendapatkan representasi.', category: 'Pemilu' },
  { term: 'Kotak Kosong', definition: 'Kolom pilihan dalam surat suara Pilkada yang memungkinkan pemilih menolak calon tunggal. Kemenangan kotak kosong berarti daerah dipimpin pejabat sementara.', category: 'Pemilu' },
  { term: 'Calon Tunggal', definition: 'Kondisi di mana hanya ada satu pasangan calon dalam Pilkada, sehingga pemilih diberi pilihan antara calon tersebut atau "kotak kosong".', category: 'Pemilu' },
  { term: 'Formulir C1', definition: 'Berita acara dan sertifikat hasil penghitungan suara di TPS, menjadi dokumen sumber utama rekapitulasi pemilu.', category: 'Pemilu' },
  { term: 'Rekapitulasi', definition: 'Proses penjumlahan dan verifikasi perolehan suara secara berjenjang dari TPS hingga KPU Pusat.', category: 'Pemilu' },
  { term: 'DPS', definition: 'Daftar Pemilih Sementara — daftar calon pemilih sebelum diverifikasi dan disahkan menjadi DPT.', category: 'Pemilu' },
  { term: 'DPT', definition: 'Daftar Pemilih Tetap — daftar resmi pemilih yang telah diverifikasi dan berhak memberikan suara dalam pemilu.', category: 'Pemilu' },
  { term: 'KPU', definition: 'Komisi Pemilihan Umum — lembaga penyelenggara pemilu yang bersifat nasional, tetap, dan mandiri.', category: 'Pemilu' },
  { term: 'Bawaslu', definition: 'Badan Pengawas Pemilihan Umum — lembaga yang bertugas mengawasi penyelenggaraan pemilu dan menangani pelanggaran.', category: 'Pemilu' },

  // ── Hukum & Korupsi ──
  { term: 'LHKPN', definition: 'Laporan Harta Kekayaan Penyelenggara Negara — dokumen wajib yang melaporkan kekayaan pejabat publik kepada KPK.', category: 'Hukum & Korupsi' },
  { term: 'OTT', definition: 'Operasi Tangkap Tangan — penangkapan yang dilakukan KPK saat tindak pidana korupsi sedang berlangsung.', category: 'Hukum & Korupsi' },
  { term: 'KPK', definition: 'Komisi Pemberantasan Korupsi — lembaga negara independen yang bertugas memberantas korupsi melalui pencegahan dan penindakan.', category: 'Hukum & Korupsi' },
  { term: 'Gratifikasi', definition: 'Pemberian dalam arti luas kepada pegawai negeri atau penyelenggara negara yang berhubungan dengan jabatannya; wajib dilaporkan ke KPK.', category: 'Hukum & Korupsi' },
  { term: 'Suap', definition: 'Tindak pidana pemberian atau penerimaan uang/hadiah sebagai imbalan atas perbuatan atau kebijakan tertentu dari pejabat.', category: 'Hukum & Korupsi' },
  { term: 'Pemerasan', definition: 'Tindak pidana memaksa seseorang menyerahkan sesuatu dengan ancaman kekerasan atau kekuasaan jabatan.', category: 'Hukum & Korupsi' },
  { term: 'TPPU', definition: 'Tindak Pidana Pencucian Uang — kejahatan menyembunyikan asal-usul uang hasil kejahatan melalui transaksi keuangan berlapis.', category: 'Hukum & Korupsi' },
  { term: 'TPDK', definition: 'Tindak Pidana Di bidang Kehutanan — kejahatan terkait pengelolaan hutan secara ilegal yang sering tumpang tindih dengan korupsi.', category: 'Hukum & Korupsi' },
  { term: 'Tipikor', definition: 'Tindak Pidana Korupsi — istilah hukum yang merujuk pada kejahatan korupsi sebagaimana diatur UU 31/1999 dan UU 20/2001.', category: 'Hukum & Korupsi' },
  { term: 'Tersangka', definition: 'Status hukum seseorang yang berdasarkan bukti permulaan cukup diduga melakukan tindak pidana.', category: 'Hukum & Korupsi' },
  { term: 'Terdakwa', definition: 'Status hukum seseorang yang sudah diajukan ke persidangan karena didakwa melakukan tindak pidana.', category: 'Hukum & Korupsi' },
  { term: 'Terpidana', definition: 'Status hukum seseorang yang telah dinyatakan bersalah dan dijatuhi hukuman oleh pengadilan berkekuatan hukum tetap.', category: 'Hukum & Korupsi' },

  // ── Ekonomi & Fiskal ──
  { term: 'APBN', definition: 'Anggaran Pendapatan dan Belanja Negara — rencana keuangan tahunan pemerintah pusat yang ditetapkan melalui UU.', category: 'Ekonomi & Fiskal' },
  { term: 'APBD', definition: 'Anggaran Pendapatan dan Belanja Daerah — rencana keuangan tahunan pemerintah daerah yang ditetapkan melalui Perda.', category: 'Ekonomi & Fiskal' },
  { term: 'Dana Desa', definition: 'Dana yang bersumber dari APBN dan dialokasikan langsung ke desa untuk pembangunan dan pemberdayaan masyarakat desa.', category: 'Ekonomi & Fiskal' },
  { term: 'Dana Otsus', definition: 'Dana Otonomi Khusus — alokasi dana APBN untuk Papua dan Aceh sebagai bentuk afirmasi atas status otonomi khusus mereka.', category: 'Ekonomi & Fiskal' },
  { term: 'BOK', definition: 'Bantuan Operasional Kesehatan — dana dari pemerintah pusat untuk mendukung operasional puskesmas dan fasilitas kesehatan daerah.', category: 'Ekonomi & Fiskal' },
  { term: 'BLT', definition: 'Bantuan Langsung Tunai — program bantuan uang tunai dari pemerintah kepada masyarakat miskin, sering digunakan dalam situasi krisis.', category: 'Ekonomi & Fiskal' },
  { term: 'Bansos', definition: 'Bantuan Sosial — program perlindungan sosial pemerintah dalam berbagai bentuk (tunai, sembako, dll.) untuk kelompok rentan.', category: 'Ekonomi & Fiskal' },

  // ── Organisasi ──
  { term: 'NasDem', definition: 'Partai Nasional Demokrat — partai yang didirikan 2011 oleh Surya Paloh, berideologi nasionalisme demokratis. Salah satu partai koalisi pemerintahan.', category: 'Organisasi' },
  { term: 'PKS', definition: 'Partai Keadilan Sejahtera — partai Islam berideologi Islam moderat yang berakar dari gerakan tarbiyah. Dikenal dengan disiplin kader dan basis pemilih perkotaan terdidik.', category: 'Organisasi' },
  { term: 'Hanura', definition: 'Hati Nurani Rakyat — partai yang didirikan 2006 oleh mantan Panglima TNI Wiranto. Berideologi nasionalisme dan Pancasila.', category: 'Organisasi' },
  { term: 'NU', definition: 'Nahdlatul Ulama — organisasi Islam terbesar di Indonesia dengan jutaan anggota, berhaluan Islam Ahlus Sunnah wal Jamaah dan berpengaruh besar dalam politik.', category: 'Organisasi' },
  { term: 'Muhammadiyah', definition: 'Organisasi Islam terbesar kedua di Indonesia, didirikan 1912, berhaluan modernis dan fokus pada pendidikan serta kesehatan.', category: 'Organisasi' },
  { term: 'TNI', definition: 'Tentara Nasional Indonesia — angkatan bersenjata negara yang terdiri dari Angkatan Darat, Angkatan Laut, dan Angkatan Udara.', category: 'Organisasi' },
  { term: 'Polri', definition: 'Kepolisian Negara Republik Indonesia — institusi kepolisian nasional yang bertanggung jawab langsung kepada Presiden.', category: 'Organisasi' },
  { term: 'BIN', definition: 'Badan Intelijen Negara — lembaga intelijen negara yang bertugas mengumpulkan, mengolah, dan menyampaikan informasi kepada presiden.', category: 'Organisasi' },
]

function getCategoryColor(cat) {
  const colors = {
    'Umum':           'bg-gray-700/50 text-gray-300 border-gray-600/50',
    'Legislatif':     'bg-blue-900/40 text-blue-300 border-blue-700/50',
    'Eksekutif':      'bg-purple-900/40 text-purple-300 border-purple-700/50',
    'Pemilu':         'bg-green-900/40 text-green-300 border-green-700/50',
    'Hukum & Korupsi':'bg-red-900/40 text-red-300 border-red-700/50',
    'Ekonomi & Fiskal':'bg-yellow-900/40 text-yellow-300 border-yellow-700/50',
    'Organisasi':     'bg-orange-900/40 text-orange-300 border-orange-700/50',
  }
  return colors[cat] || 'bg-gray-700/50 text-gray-300'
}

function getCategoryPillColor(cat, active) {
  if (!active) return 'bg-bg-elevated border border-border text-text-muted hover:text-white hover:border-white/30'
  const colors = {
    'Semua':           'bg-white text-gray-900',
    'Umum':            'bg-gray-600 text-white',
    'Legislatif':      'bg-blue-700 text-white',
    'Eksekutif':       'bg-purple-700 text-white',
    'Pemilu':          'bg-green-700 text-white',
    'Hukum & Korupsi': 'bg-red-700 text-white',
    'Ekonomi & Fiskal':'bg-yellow-600 text-white',
    'Organisasi':      'bg-orange-700 text-white',
  }
  return colors[cat] || 'bg-white text-gray-900'
}

export default function GlosariumPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return TERMS.filter(t => {
      const matchCat = activeCategory === 'Semua' || t.category === activeCategory
      const matchSearch = !q || t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [search, activeCategory])

  // Group by first letter
  const grouped = useMemo(() => {
    const map = {}
    const sorted = [...filtered].sort((a, b) => a.term.localeCompare(b.term, 'id'))
    for (const item of sorted) {
      const letter = item.term[0].toUpperCase()
      if (!map[letter]) map[letter] = []
      map[letter].push(item)
    }
    return map
  }, [filtered])

  const letters = Object.keys(grouped).sort()

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">

      {/* ── Header ── */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-white">📖 Glosarium Politik Indonesia</h1>
        <p className="text-text-muted text-sm">{TERMS.length} istilah · Referensi cepat terminologi politik dan hukum Indonesia</p>
      </div>

      {/* ── Search ── */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm">🔍</span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari istilah atau definisi..."
          className="w-full pl-10 pr-4 py-3 bg-bg-card border border-border rounded-xl text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-red-500/60 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white text-lg"
          >×</button>
        )}
      </div>

      {/* ── Category Pills ── */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${getCategoryPillColor(cat, activeCategory === cat)}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Results count ── */}
      {(search || activeCategory !== 'Semua') && (
        <p className="text-xs text-text-muted">
          {filtered.length} istilah ditemukan
          {search && <span> untuk "<strong className="text-white">{search}</strong>"</span>}
          {activeCategory !== 'Semua' && <span> dalam <strong className="text-white">{activeCategory}</strong></span>}
        </p>
      )}

      {/* ── Alphabetical Groups ── */}
      {letters.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">Istilah tidak ditemukan</p>
          <p className="text-xs mt-1">Coba kata kunci lain atau ubah filter kategori</p>
        </div>
      ) : (
        <div className="space-y-8">
          {letters.map(letter => (
            <div key={letter} id={`letter-${letter}`}>
              {/* Letter heading */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl font-black text-red-500 w-8 flex-shrink-0">{letter}</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              {/* Terms */}
              <div className="space-y-3">
                {grouped[letter].map(item => (
                  <div
                    key={item.term}
                    className="bg-bg-card border border-border rounded-xl p-4 hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-bold text-white text-base">{item.term}</h3>
                      <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full border ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">{item.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Quick jump ── */}
      {letters.length > 3 && (
        <div className="sticky bottom-4 flex justify-center pointer-events-none">
          <div className="flex flex-wrap gap-1 bg-bg-sidebar/90 backdrop-blur border border-border rounded-2xl px-3 py-2 pointer-events-auto shadow-xl max-w-sm justify-center">
            {letters.map(l => (
              <a
                key={l}
                href={`#letter-${l}`}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold text-text-muted hover:bg-bg-elevated hover:text-white transition-all"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
