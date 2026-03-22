// src/data/legislation.js
// Legislation tracker data — 20+ bills from DPR RI

export const LEGISLATION_CATEGORIES = [
  { id: 'keamanan',    label: 'Keamanan & Pertahanan',  color: '#ef4444' },
  { id: 'hukum',       label: 'Hukum & Peradilan',       color: '#f97316' },
  { id: 'ekonomi',     label: 'Ekonomi & Bisnis',         color: '#eab308' },
  { id: 'sosial',      label: 'Sosial & Kesehatan',       color: '#22c55e' },
  { id: 'politik',     label: 'Politik & Pemilu',         color: '#3b82f6' },
  { id: 'lingkungan',  label: 'Lingkungan & SDA',         color: '#10b981' },
  { id: 'digital',     label: 'Digital & Teknologi',      color: '#8b5cf6' },
]

// Party short-name map
export const PARTY_NAMES = {
  ger:  'Gerindra',
  pdip: 'PDI-P',
  gol:  'Golkar',
  nas:  'NasDem',
  pkb:  'PKB',
  pks:  'PKS',
  pan:  'PAN',
  dem:  'Demokrat',
  han:  'Hanura',
  ppp:  'PPP',
  pkl:  'PKL',
}

export const BILLS = [
  // ─────────────────────────────────────────────────────────
  // 1. UU TNI REVISI 2025
  // ─────────────────────────────────────────────────────────
  {
    id: 'uu_tni_2025',
    title: 'UU TNI (Revisi 2025)',
    full_title: 'Undang-Undang Nomor 3 Tahun 2025 tentang Tentara Nasional Indonesia',
    category: 'keamanan',
    status: 'disahkan',
    date_submitted: '2025-01-15',
    date_passed: '2025-03-20',
    sponsor: ['pemerintah'],
    committee: 'Komisi I DPR',
    votes_for: 427,
    votes_against: 68,
    abstain: 12,
    party_votes: {
      ger: 'setuju', pdip: 'tolak', gol: 'setuju', nas: 'setuju',
      pkb: 'setuju', pks: 'tolak', pan: 'setuju', dem: 'setuju', han: 'setuju',
    },
    controversy_level: 9,
    key_provisions: [
      'TNI aktif dapat menduduki jabatan sipil (diperluas dari 10 menjadi 15 pos)',
      'Penambahan matra siber (Angkatan Siber)',
      'Perpanjangan usia pensiun perwira',
    ],
    criticism: [
      'Ancaman dwi fungsi ABRI era Orde Baru',
      'Tanpa pengawasan sipil yang kuat',
      'Disahkan tergesa-gesa tanpa konsultasi publik memadai',
    ],
    support: ['Modernisasi TNI', 'Kebutuhan keamanan siber', 'Efisiensi komando'],
    person_ids: ['prabowo'],
    demo_triggered: true,
    prolegnas_2025: true,
    source: 'DPR RI',
  },

  // ─────────────────────────────────────────────────────────
  // 2. UU CIPTA KERJA 2020
  // ─────────────────────────────────────────────────────────
  {
    id: 'uu_cipta_kerja_2020',
    title: 'UU Cipta Kerja (Omnibus Law)',
    full_title: 'Undang-Undang Nomor 11 Tahun 2020 tentang Cipta Kerja',
    category: 'ekonomi',
    status: 'disahkan',
    date_submitted: '2020-02-12',
    date_passed: '2020-10-05',
    sponsor: ['pemerintah'],
    committee: 'Badan Legislasi DPR',
    votes_for: 318,
    votes_against: 49,
    abstain: 12,
    party_votes: {
      ger: 'setuju', pdip: 'setuju', gol: 'setuju', nas: 'setuju',
      pkb: 'setuju', pks: 'tolak', pan: 'setuju', dem: 'setuju', han: 'setuju',
    },
    controversy_level: 10,
    key_provisions: [
      'Penyederhanaan 79 UU dalam satu UU omnibus',
      'Kemudahan perizinan berusaha (OSS)',
      'Perubahan ketentuan pesangon & kontrak kerja',
      'Relaksasi aturan lingkungan AMDAL',
    ],
    criticism: [
      'Melemahkan perlindungan buruh dan pesangon',
      'Memudahkan eksploitasi sumber daya alam',
      'Proses pembahasan tidak transparan & terburu-buru',
      'Dibatalkan sebagian oleh MK (inkonstitusional bersyarat, 2021)',
    ],
    support: [
      'Kemudahan investasi asing',
      'Penyederhanaan birokrasi perizinan',
      'Penciptaan lapangan kerja',
    ],
    person_ids: ['jokowi', 'airlangga'],
    demo_triggered: true,
    source: 'DPR RI',
  },

  // ─────────────────────────────────────────────────────────
  // 3. UU KPK REVISI 2019
  // ─────────────────────────────────────────────────────────
  {
    id: 'uu_kpk_2019',
    title: 'UU KPK (Revisi 2019)',
    full_title: 'Undang-Undang Nomor 19 Tahun 2019 tentang Komisi Pemberantasan Korupsi',
    category: 'hukum',
    status: 'disahkan',
    date_submitted: '2019-09-05',
    date_passed: '2019-09-17',
    sponsor: ['dpr'],
    committee: 'Komisi III DPR',
    votes_for: 289,
    votes_against: 0,
    abstain: 0,
    party_votes: {
      ger: 'setuju', pdip: 'setuju', gol: 'setuju', nas: 'setuju',
      pkb: 'setuju', pks: 'setuju', pan: 'setuju', dem: 'setuju', han: 'setuju',
    },
    controversy_level: 10,
    key_provisions: [
      'KPK menjadi lembaga pemerintah (bukan independen)',
      'Pembentukan Dewan Pengawas KPK',
      'Penyadapan harus seizin Dewan Pengawas',
      'SP3 (Surat Penghentian Penyidikan) bisa dikeluarkan',
    ],
    criticism: [
      'Melemahkan independensi KPK secara drastis',
      'Membuka celah kasus korupsi dihentikan via SP3',
      'Proses pembahasan kilat dalam 7 hari',
      'Memicu demonstrasi mahasiswa besar-besaran #ReformasiDikorupsi',
    ],
    support: [
      'Pengawasan KPK lebih akuntabel',
      'Koordinasi lebih baik dengan APH lain',
    ],
    person_ids: ['jokowi'],
    demo_triggered: true,
    source: 'DPR RI',
  },

  // ─────────────────────────────────────────────────────────
  // 4. UU ITE REVISI 2024
  // ─────────────────────────────────────────────────────────
  {
    id: 'uu_ite_2024',
    title: 'UU ITE (Revisi 2024)',
    full_title: 'Undang-Undang Nomor 1 Tahun 2024 tentang Perubahan Kedua UU ITE',
    category: 'digital',
    status: 'disahkan',
    date_submitted: '2023-11-01',
    date_passed: '2024-01-02',
    sponsor: ['pemerintah'],
    committee: 'Komisi I DPR',
    votes_for: 402,
    votes_against: 55,
    abstain: 8,
    party_votes: {
      ger: 'setuju', pdip: 'setuju', gol: 'setuju', nas: 'setuju',
      pkb: 'setuju', pks: 'tolak', pan: 'setuju', dem: 'setuju', han: 'setuju',
    },
    controversy_level: 7,
    key_provisions: [
      'Pasal "karet" ujaran kebencian tetap dipertahankan',
      'Penambahan ketentuan perlindungan data pribadi dasar',
      'Penghapusan pasal pencemaran nama baik (sebagian)',
      'Klarifikasi definisi konten ilegal',
    ],
    criticism: [
      'Masih banyak pasal yang dapat dikriminalisasi kritik',
      'Belum cukup melindungi kebebasan berekspresi',
      'Pasal pencemaran nama badan usaha tetap ada',
    ],
    support: [
      'Revisi dari UU ITE 2016 yang banyak disalahgunakan',
      'Lebih memberikan kepastian hukum digital',
    ],
    person_ids: ['jokowi'],
    demo_triggered: false,
    source: 'DPR RI',
  },

  // ─────────────────────────────────────────────────────────
  // 5. RUU PENYIARAN 2024 (ditunda)
  // ─────────────────────────────────────────────────────────
  {
    id: 'ruu_penyiaran_2024',
    title: 'RUU Penyiaran 2024',
    full_title: 'Rancangan Undang-Undang tentang Penyiaran (Revisi UU No. 32/2002)',
    category: 'digital',
    status: 'ditunda',
    date_submitted: '2024-03-15',
    date_passed: null,
    sponsor: ['dpr'],
    committee: 'Komisi I DPR',
    votes_for: 0,
    votes_against: 0,
    abstain: 0,
    party_votes: {},
    controversy_level: 9,
    key_provisions: [
      'Larangan media online/podcast memuat konten investigatif eksklusif',
      'KPI berwenang mengawasi konten streaming & media sosial',
      'Pembatasan siaran langsung demo/kerusuhan',
      'Kewajiban take-down konten dalam 1x24 jam atas perintah KPI',
    ],
    criticism: [
      'Ancaman serius kebebasan pers dan jurnalisme investigatif',
      'KPI dikritik tidak kompeten mengawasi platform digital',
      'Melarang tayangan investigasi eksklusif',
      'Ditentang keras oleh AJI, PWI, dan koalisi jurnalis',
    ],
    support: [
      'Regulasi konten penyiaran yang lebih modern',
      'Perlindungan dari konten berbahaya',
    ],
    person_ids: [],
    demo_triggered: true,
    prolegnas_2025: true,
    source: 'DPR RI',
  },

  // ─────────────────────────────────────────────────────────
  // 6. UU KESEHATAN 2023
  // ─────────────────────────────────────────────────────────
  {
    id: 'uu_kesehatan_2023',
    title: 'UU Kesehatan 2023',
    full_title: 'Undang-Undang Nomor 17 Tahun 2023 tentang Kesehatan',
    category: 'sosial',
    status: 'disahkan',
    date_submitted: '2023-02-13',
    date_passed: '2023-07-11',
    sponsor: ['pemerintah'],
    committee: 'Komisi IX DPR',
    votes_for: 350,
    votes_against: 21,
    abstain: 0,
    party_votes: {
      ger: 'setuju', pdip: 'setuju', gol: 'setuju', nas: 'setuju',
      pkb: 'setuju', pks: 'tolak', pan: 'setuju', dem: 'setuju', han: 'setuju',
    },
    controversy_level: 7,
    key_provisions: [
      'Dokter asing dapat praktik di Indonesia dengan syarat dipermudah',
      'Transformasi sistem kesehatan nasional',
      'Penghapusan rekomendasi organisasi profesi untuk SIP',
      'Pendanaan kesehatan dari cukai rokok diperkuat',
    ],
    criticism: [
      'IDI dan 5 organisasi profesi menentang keras',
      'Dinilai mengancam kualitas pelayanan kesehatan',
      'Tanpa konsultasi memadai dengan tenaga kesehatan',
      'Dokter asing ancam lapangan kerja dokter lokal',
    ],
    support: [
      'Mempercepat transformasi sistem kesehatan',
      'Meningkatkan akses layanan kesehatan',
      'Mengurangi dominasi monopolistik organisasi profesi',
    ],
    person_ids: ['budi_gunadi'],
    demo_triggered: true,
    source: 'DPR RI',
  },

  // ─────────────────────────────────────────────────────────
  // 7. UU MK REVISI 2023
  // ─────────────────────────────────────────────────────────
  {
    id: 'uu_mk_2023',
    title: 'UU MK (Revisi 2023)',
    full_title: 'Undang-Undang Nomor 7 Tahun 2020 tentang Perubahan Ketiga MK (direvisi 2023)',
    category: 'hukum',
    status: 'disahkan',
    date_submitted: '2023-08-21',
    date_passed: '2023-09-21',
    sponsor: ['dpr'],
    committee: 'Komisi III DPR',
    votes_for: 310,
    votes_against: 0,
    abstain: 0,
    party_votes: {
      ger: 'setuju', pdip: 'setuju', gol: 'setuju', nas: 'setuju',
      pkb: 'setuju', pks: 'setuju', pan: 'setuju', dem: 'setuju', han: 'setuju',
    },
    controversy_level: 10,
    key_provisions: [
      'Perubahan syarat usia minimum calon presiden & wapres dari MK (Putusan 90)',
      'Hakim konstitusi dapat menjabat hingga usia 70 tahun',
      'Mekanisme seleksi hakim MK diubah',
    ],
    criticism: [
      'Putusan MK (No. 90/2023) dianggap membuka jalan Gibran maju Pilpres',
      'Ketua MK Anwar Usman dicopot karena konflik kepentingan (paman Gibran)',
      'Proses revisi cepat diduga terkait agenda politik Pilpres 2024',
      'Merusak kepercayaan publik terhadap independensi MK',
    ],
    support: [
      'Memperkuat prinsip regenerasi kepemimpinan',
      'Modernisasi ketentuan hakim konstitusi',
    ],
    person_ids: ['gibran', 'jokowi', 'anwar_usman'],
    demo_triggered: true,
    source: 'DPR RI / MK',
  },

  // ─────────────────────────────────────────────────────────
  // 8. UU TPKS 2022
  // ─────────────────────────────────────────────────────────
  {
    id: 'uu_tpks_2022',
    title: 'UU TPKS 2022',
    full_title: 'Undang-Undang Nomor 12 Tahun 2022 tentang Tindak Pidana Kekerasan Seksual',
    category: 'hukum',
    status: 'disahkan',
    date_submitted: '2022-01-18',
    date_passed: '2022-04-12',
    sponsor: ['dpr'],
    committee: 'Komisi VIII DPR',
    votes_for: 500,
    votes_against: 0,
    abstain: 0,
    party_votes: {
      ger: 'setuju', pdip: 'setuju', gol: 'setuju', nas: 'setuju',
      pkb: 'setuju', pks: 'setuju', pan: 'setuju', dem: 'setuju', han: 'setuju',
    },
    controversy_level: 3,
    key_provisions: [
      'Definisi luas kekerasan seksual mencakup 9 jenis tindak pidana',
      'Perlindungan korban & pendampingan hukum',
      'Rehabilitasi psikologis bagi korban dan pelaku',
      'Restitusi dari pelaku ke korban',
    ],
    criticism: [
      'Ditunda bertahun-tahun sebelum akhirnya disahkan',
      'Beberapa fraksi awalnya menolak karena dianggap melegalkan zina',
    ],
    support: [
      'Memberikan perlindungan hukum bagi korban kekerasan seksual',
      'Langkah maju dalam hak perempuan',
      'Didukung aktivis perempuan & masyarakat sipil luas',
    ],
    person_ids: [],
    demo_triggered: false,
    source: 'DPR RI',
  },

  // ─────────────────────────────────────────────────────────
  // 9. RUU KUHP 2022
  // ─────────────────────────────────────────────────────────
  {
    id: 'ruu_kuhp_2022',
    title: 'KUHP Baru 2022',
    full_title: 'Undang-Undang Nomor 1 Tahun 2023 tentang Kitab Undang-Undang Hukum Pidana',
    category: 'hukum',
    status: 'disahkan',
    date_submitted: '2022-11-01',
    date_passed: '2022-12-06',
    sponsor: ['pemerintah'],
    committee: 'Komisi III DPR',
    votes_for: 422,
    votes_against: 0,
    abstain: 0,
    party_votes: {
      ger: 'setuju', pdip: 'setuju', gol: 'setuju', nas: 'setuju',
      pkb: 'setuju', pks: 'setuju', pan: 'setuju', dem: 'setuju', han: 'setuju',
    },
    controversy_level: 8,
    key_provisions: [
      'Kriminalisasi hubungan di luar nikah (living together)',
      'Penghinaan presiden dan lembaga negara dilarang',
      'Hukum adat (living law) diakui sebagai sumber pidana',
      'Berlaku penuh 3 tahun setelah disahkan (2026)',
    ],
    criticism: [
      'Pasal kohabitasi dianggap mengancam privasi & kebebasan',
      'Pasal penghinaan presiden dinilai sebagai kebangkitan lèse-majesté',
      'Pasal hukum adat berpotensi diskriminatif',
      'Ditentang oleh komunitas pers & NGO hak asasi',
    ],
    support: [
      'KUHP warisan Belanda sudah usang (147 tahun)',
      'Penguatan nilai-nilai Pancasila dalam hukum pidana',
    ],
    person_ids: ['yasonna'],
    demo_triggered: true,
    source: 'DPR RI',
  },

  // ─────────────────────────────────────────────────────────
  // 10. UU MINERBA 2020
  // ─────────────────────────────────────────────────────────
  {
    id: 'uu_minerba_2020',
    title: 'UU Minerba 2020',
    full_title: 'Undang-Undang Nomor 3 Tahun 2020 tentang Pertambangan Mineral dan Batubara',
    category: 'lingkungan',
    status: 'disahkan',
    date_submitted: '2020-02-01',
    date_passed: '2020-05-12',
    sponsor: ['pemerintah'],
    committee: 'Komisi VII DPR',
    votes_for: 416,
    votes_against: 0,
    abstain: 0,
    party_votes: {
      ger: 'setuju', pdip: 'setuju', gol: 'setuju', nas: 'setuju',
      pkb: 'setuju', pks: 'tolak', pan: 'setuju', dem: 'setuju', han: 'setuju',
    },
    controversy_level: 7,
    key_provisions: [
      'Perpanjangan otomatis IUP dan PKP2B tanpa lelang',
      'Pemerintah pusat sentralisasi perizinan (menghapus kewenangan daerah)',
      'Kewajiban pengolahan dan pemurnian di dalam negeri',
      'Organisasi kemasyarakatan keagamaan dapat mengelola tambang',
    ],
    criticism: [
      'Menghilangkan kewenangan daerah atas SDA mereka',
      'Perpanjangan otomatis berpotensi merugikan negara',
      'Membuka celah korupsi perizinan tambang',
      'Izin tambang untuk ormas keagamaan menuai kritik',
    ],
    support: [
      'Kepastian hukum bagi investor tambang',
      'Nilai tambah ekonomi dari hilirisasi mineral',
    ],
    person_ids: ['jokowi', 'prabowo'],
    demo_triggered: false,
    source: 'DPR RI',
  },

  // ─────────────────────────────────────────────────────────
  // 11. UU PDP 2022
  // ─────────────────────────────────────────────────────────
  {
    id: 'uu_pdp_2022',
    title: 'UU Perlindungan Data Pribadi',
    full_title: 'Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi',
    category: 'digital',
    status: 'disahkan',
    date_submitted: '2022-01-20',
    date_passed: '2022-10-17',
    sponsor: ['pemerintah'],
    committee: 'Komisi I DPR',
    votes_for: 447,
    votes_against: 0,
    abstain: 0,
    party_votes: {
      ger: 'setuju', pdip: 'setuju', gol: 'setuju', nas: 'setuju',
      pkb: 'setuju', pks: 'setuju', pan: 'setuju', dem: 'setuju', han: 'setuju',
    },
    controversy_level: 4,
    key_provisions: [
      'Definisi data pribadi dan kategori sensitif',
      'Kewajiban pengendali data untuk mendapatkan persetujuan',
      'Hak subjek data: akses, koreksi, penghapusan',
      'Sanksi pidana pelanggaran data hingga Rp 60 miliar',
    ],
    criticism: [
      'Lembaga pengawas PDP berada di bawah pemerintah, bukan independen',
      'Masa transisi 2 tahun dianggap terlalu singkat',
    ],
    support: [
      'Indonesia akhirnya memiliki UU PDP (tertinggal dari negara lain)',
      'Perlindungan warga dari kebocoran data masif',
    ],
    person_ids: [],
    demo_triggered: false,
    source: 'DPR RI',
  },

  // ─────────────────────────────────────────────────────────
  // 12. PERPPU CIPTA KERJA 2022
  // ─────────────────────────────────────────────────────────
  {
    id: 'perppu_cipta_kerja_2022',
    title: 'Perppu Cipta Kerja 2022',
    full_title: 'Peraturan Pemerintah Pengganti UU Nomor 2 Tahun 2022 tentang Cipta Kerja',
    category: 'ekonomi',
    status: 'disahkan',
    date_submitted: '2022-12-30',
    date_passed: '2023-03-21',
    sponsor: ['pemerintah'],
    committee: 'Badan Legislasi DPR',
    votes_for: 356,
    votes_against: 78,
    abstain: 0,
    party_votes: {
      ger: 'setuju', pdip: 'setuju', gol: 'setuju', nas: 'setuju',
      pkb: 'setuju', pks: 'tolak', pan: 'setuju', dem: 'tolak', han: 'setuju',
    },
    controversy_level: 8,
    key_provisions: [
      'Menggantikan UU Cipta Kerja yang dinyatakan inkonstitusional bersyarat',
      'Mempertahankan kluster ketenagakerjaan yang kontroversial',
      'Diterbitkan saat DPR reses (tanpa persetujuan DPR)',
    ],
    criticism: [
      'Diterbitkan diam-diam pada 30 Desember 2022 saat reses DPR',
      'Disebut sebagai "pembangkangan" terhadap putusan MK',
      'Serikat buruh dan aktivis terus menolak',
    ],
    support: [
      'Memberikan kepastian hukum pasca putusan MK',
      'Melanjutkan reformasi perizinan berusaha',
    ],
    person_ids: ['jokowi', 'airlangga'],
    demo_triggered: true,
    source: 'Presiden RI',
  },

  // ─────────────────────────────────────────────────────────
  // 13. RUU PERAMPASAN ASET (belum disahkan)
  // ─────────────────────────────────────────────────────────
  {
    id: 'ruu_perampasan_aset',
    title: 'RUU Perampasan Aset',
    full_title: 'Rancangan Undang-Undang tentang Perampasan Aset Tindak Pidana',
    category: 'hukum',
    status: 'pembahasan',
    date_submitted: '2023-05-10',
    date_passed: null,
    sponsor: ['pemerintah'],
    committee: 'Komisi III DPR',
    votes_for: 0,
    votes_against: 0,
    abstain: 0,
    party_votes: {},
    controversy_level: 8,
    key_provisions: [
      'Perampasan aset koruptor tanpa proses pidana (civil forfeiture)',
      'Pembuktian terbalik untuk aset yang tidak bisa dijelaskan asal-usulnya',
      'Pengelolaan aset rampasan oleh lembaga khusus',
    ],
    criticism: [
      'DPR dinilai sengaja mengulur-ulur pembahasan',
      'Dikhawatirkan disalahgunakan untuk persekusi politik',
      'Perdebatan soal due process of law',
    ],
    support: [
      'Alat efektif pemberantasan korupsi',
      'Dibutuhkan KPK dan APH untuk memulihkan kerugian negara',
      'Sudah ada di banyak negara maju',
    ],
    person_ids: [],
    demo_triggered: false,
    prolegnas_2025: true,
    source: 'Pemerintah / DPR RI',
  },

  // ─────────────────────────────────────────────────────────
  // 14. UU PEMILU (REVISI 2023 — ditolak)
  // ─────────────────────────────────────────────────────────
  {
    id: 'ruu_pemilu_2023',
    title: 'Revisi UU Pemilu 2023',
    full_title: 'Usulan Revisi Undang-Undang Nomor 7 Tahun 2017 tentang Pemilihan Umum',
    category: 'politik',
    status: 'ditolak',
    date_submitted: '2023-05-01',
    date_passed: null,
    sponsor: ['dpr'],
    committee: 'Komisi II DPR',
    votes_for: 0,
    votes_against: 0,
    abstain: 0,
    party_votes: {
      ger: 'tolak', pdip: 'setuju', gol: 'tolak', nas: 'tolak',
      pkb: 'tolak', pks: 'setuju', pan: 'tolak', dem: 'tolak', han: 'tolak',
    },
    controversy_level: 7,
    key_provisions: [
      'Usulan mengembalikan pemilu serentak menjadi terpisah',
      'Perubahan parliamentary threshold',
      'Potensi penundaan Pilkada 2024',
    ],
    criticism: [
      'Upaya partai-partai koalisi untuk melemahkan oposisi',
      'Perubahan aturan pemilu mendekati Pilpres 2024 dianggap tidak etis',
    ],
    support: [
      'Perbaikan teknis penyelenggaraan pemilu',
      'Argumen beban petugas KPPS terlalu berat',
    ],
    person_ids: [],
    demo_triggered: false,
    prolegnas_2025: true,
    source: 'DPR RI',
  },

  // ─────────────────────────────────────────────────────────
  // 15. UU KESEJAHTERAAN IBU DAN ANAK 2024
  // ─────────────────────────────────────────────────────────
  {
    id: 'uu_kia_2024',
    title: 'UU Kesejahteraan Ibu & Anak',
    full_title: 'Undang-Undang Nomor 4 Tahun 2024 tentang Kesejahteraan Ibu dan Anak',
    category: 'sosial',
    status: 'disahkan',
    date_submitted: '2024-01-15',
    date_passed: '2024-06-04',
    sponsor: ['pemerintah'],
    committee: 'Komisi VIII DPR',
    votes_for: 445,
    votes_against: 0,
    abstain: 0,
    party_votes: {
      ger: 'setuju', pdip: 'setuju', gol: 'setuju', nas: 'setuju',
      pkb: 'setuju', pks: 'setuju', pan: 'setuju', dem: 'setuju', han: 'setuju',
    },
    controversy_level: 3,
    key_provisions: [
      'Cuti melahirkan diperpanjang menjadi 6 bulan',
      'Cuti ayah (paternity leave) 40 hari',
      'Perlindungan menyusui di tempat kerja',
      'Jaminan sosial ibu & anak dari 0–2 tahun',
    ],
    criticism: [
      'Kekhawatiran pengusaha soal beban cuti panjang',
      'Implementasi di sektor informal belum jelas',
    ],
    support: [
      'Meningkatkan angka menyusui dan gizi anak',
      'Perlindungan hak perempuan pekerja',
      'Penurunan angka stunting nasional',
    ],
    person_ids: [],
    demo_triggered: false,
    source: 'DPR RI',
  },

  // ─────────────────────────────────────────────────────────
  // 16. UU DESA REVISI 2024
  // ─────────────────────────────────────────────────────────
  {
    id: 'uu_desa_2024',
    title: 'UU Desa (Revisi 2024)',
    full_title: 'Undang-Undang Nomor 3 Tahun 2024 tentang Perubahan Kedua UU Desa',
    category: 'politik',
    status: 'disahkan',
    date_submitted: '2024-01-20',
    date_passed: '2024-03-28',
    sponsor: ['dpr'],
    committee: 'Badan Legislasi DPR',
    votes_for: 467,
    votes_against: 0,
    abstain: 0,
    party_votes: {
      ger: 'setuju', pdip: 'setuju', gol: 'setuju', nas: 'setuju',
      pkb: 'setuju', pks: 'setuju', pan: 'setuju', dem: 'setuju', han: 'setuju',
    },
    controversy_level: 6,
    key_provisions: [
      'Masa jabatan kepala desa diperpanjang menjadi 8 tahun per periode',
      'Maksimal 2 periode jabatan kades (total 16 tahun)',
      'Dana desa ditingkatkan secara bertahap',
      'Badan Permusyawaratan Desa diperkuat',
    ],
    criticism: [
      'Perpanjangan masa jabatan dianggap membuka celah korupsi lokal',
      'Dinilai sebagai hadiah politik kepada asosiasi kepala desa',
      'Pengawasan atas kepala desa lemah',
    ],
    support: [
      'Stabilitas kepemimpinan desa lebih panjang',
      'Memberikan waktu lebih bagi pembangunan desa',
    ],
    person_ids: [],
    demo_triggered: true,
    source: 'DPR RI',
  },

  // ─────────────────────────────────────────────────────────
  // 17. UU APBN 2025
  // ─────────────────────────────────────────────────────────
  {
    id: 'uu_apbn_2025',
    title: 'UU APBN 2025',
    full_title: 'Undang-Undang Nomor 62 Tahun 2024 tentang Anggaran Pendapatan dan Belanja Negara Tahun 2025',
    category: 'ekonomi',
    status: 'disahkan',
    date_submitted: '2024-08-16',
    date_passed: '2024-09-26',
    sponsor: ['pemerintah'],
    committee: 'Badan Anggaran DPR',
    votes_for: 425,
    votes_against: 0,
    abstain: 0,
    party_votes: {
      ger: 'setuju', pdip: 'setuju', gol: 'setuju', nas: 'setuju',
      pkb: 'setuju', pks: 'setuju', pan: 'setuju', dem: 'setuju', han: 'setuju',
    },
    controversy_level: 6,
    key_provisions: [
      'Total anggaran Rp 3.613,1 triliun',
      'Program Makan Bergizi Gratis Rp 71 triliun',
      'Efisiensi belanja K/L yang kontroversial',
      'Defisit APBN 2,53% dari PDB',
    ],
    criticism: [
      'Anggaran MBG dianggap kurang realistis & boros',
      'Pemotongan anggaran kementerian berdampak pada layanan publik',
      'Transparansi program efisiensi dipertanyakan',
    ],
    support: [
      'Investasi besar pada gizi anak & generasi',
      'Penurunan defisit secara bertahap',
    ],
    person_ids: ['prabowo', 'sri_mulyani'],
    demo_triggered: false,
    source: 'DPR RI',
  },

  // ─────────────────────────────────────────────────────────
  // 18. UU ENERGI BARU TERBARUKAN (RUU EBT)
  // ─────────────────────────────────────────────────────────
  {
    id: 'ruu_ebt_2024',
    title: 'RUU Energi Baru Terbarukan',
    full_title: 'Rancangan Undang-Undang tentang Energi Baru dan Energi Terbarukan',
    category: 'lingkungan',
    status: 'pembahasan',
    date_submitted: '2023-07-01',
    date_passed: null,
    sponsor: ['pemerintah'],
    committee: 'Komisi VII DPR',
    votes_for: 0,
    votes_against: 0,
    abstain: 0,
    party_votes: {},
    controversy_level: 5,
    key_provisions: [
      'Peta jalan transisi energi ke 23% EBT pada 2025',
      'Insentif fiskal untuk pengembang EBT',
      'Nuklir masuk sebagai "energi baru" yang didorong',
      'PLTU batubara bertahap dihapus',
    ],
    criticism: [
      'Nuklir dimasukkan sebagai EBT dianggap menyesatkan',
      'Target EBT 23% sudah terlewat, tidak realistis',
      'Kepentingan batubara menghambat transisi',
    ],
    support: [
      'Landasan hukum transisi energi yang dibutuhkan',
      'Menarik investasi hijau ke Indonesia',
    ],
    person_ids: [],
    demo_triggered: false,
    prolegnas_2025: true,
    source: 'Pemerintah / DPR RI',
  },

  // ─────────────────────────────────────────────────────────
  // 19. UU POLRI REVISI 2025
  // ─────────────────────────────────────────────────────────
  {
    id: 'uu_polri_2025',
    title: 'UU Polri (Revisi 2025)',
    full_title: 'Undang-Undang Nomor 2 Tahun 2025 tentang Kepolisian Negara Republik Indonesia',
    category: 'keamanan',
    status: 'disahkan',
    date_submitted: '2025-01-15',
    date_passed: '2025-03-20',
    sponsor: ['pemerintah'],
    committee: 'Komisi III DPR',
    votes_for: 430,
    votes_against: 58,
    abstain: 12,
    party_votes: {
      ger: 'setuju', pdip: 'tolak', gol: 'setuju', nas: 'setuju',
      pkb: 'setuju', pks: 'tolak', pan: 'setuju', dem: 'setuju', han: 'setuju',
    },
    controversy_level: 8,
    key_provisions: [
      'Polri aktif dapat menduduki jabatan sipil diperluas',
      'Perpanjangan usia pensiun perwira Polri',
      'Kewenangan intelijen Polri diperluas',
    ],
    criticism: [
      'Disahkan bersamaan UU TNI — satu paket perluasan militer-sipil',
      'Ancaman otoritarianisme keamanan',
      'Tanpa reformasi Polri yang sesungguhnya',
    ],
    support: [
      'Modernisasi struktur kepolisian',
      'Koordinasi keamanan nasional lebih baik',
    ],
    person_ids: ['prabowo'],
    demo_triggered: true,
    prolegnas_2025: true,
    source: 'DPR RI',
  },

  // ─────────────────────────────────────────────────────────
  // 20. WACANA UU AMNESTI KORUPTOR 2025
  // ─────────────────────────────────────────────────────────
  {
    id: 'wacana_amnesti_koruptor_2025',
    title: 'Wacana Amnesti Koruptor 2025',
    full_title: 'Wacana Pemberian Amnesti / Pengampunan bagi Koruptor (Pernyataan Presiden Prabowo, Desember 2024)',
    category: 'hukum',
    status: 'ruu',
    date_submitted: '2024-12-18',
    date_passed: null,
    sponsor: ['pemerintah'],
    committee: null,
    votes_for: 0,
    votes_against: 0,
    abstain: 0,
    party_votes: {},
    controversy_level: 10,
    key_provisions: [
      'Presiden Prabowo menawarkan ampun bagi koruptor yang kembalikan uang',
      'Wacana disampaikan di forum internasional (KTT anti-korupsi)',
      'Mekanisme hukum masih belum jelas',
    ],
    criticism: [
      'Bertentangan langsung dengan pemberantasan korupsi',
      'Merusak efek jera terhadap koruptor',
      'KPK, ICW, dan akademisi hukum menentang keras',
      'Menciptakan preseden berbahaya',
    ],
    support: [
      'Pragmatisme: lebih baik uang dikembalikan daripada hilang',
      'Potensi pemulihan kerugian negara yang besar',
    ],
    person_ids: ['prabowo'],
    demo_triggered: false,
    source: 'Pernyataan Presiden RI',
  },

  // ─────────────────────────────────────────────────────────
  // 21. UU PERTANAHAN 2024
  // ─────────────────────────────────────────────────────────
  {
    id: 'uu_pertanahan_2024',
    title: 'UU Pertanahan 2024',
    full_title: 'Rancangan Undang-Undang tentang Pertanahan (dibahas 2024)',
    category: 'ekonomi',
    status: 'pembahasan',
    date_submitted: '2024-02-01',
    date_passed: null,
    sponsor: ['pemerintah'],
    committee: 'Komisi II DPR',
    votes_for: 0,
    votes_against: 0,
    abstain: 0,
    party_votes: {},
    controversy_level: 7,
    key_provisions: [
      'Sistem pendaftaran tanah terintegrasi elektronik',
      'Hak pengelolaan tanah negara diperluas',
      'Bank tanah untuk kepentingan nasional',
      'Penertiban tanah terlantar',
    ],
    criticism: [
      'Berpotensi mempermudah penggusuran masyarakat adat',
      'Bank tanah berpotensi digunakan untuk proyek pemerintah (IKN, dsb)',
      'Organisasi petani & masyarakat adat menolak',
    ],
    support: [
      'Reforma agraria lebih terstruktur',
      'Kepastian hukum kepemilikan tanah',
    ],
    person_ids: ['prabowo'],
    demo_triggered: false,
    source: 'Pemerintah / DPR RI',
  },
  // ─────────────────────────────────────────────────────────
  // 22. RUU KEIMIGRASIAN 2024
  // ─────────────────────────────────────────────────────────
  {
    id: 'uu_keimigrasian_2024',
    title: 'UU Keimigrasian (Revisi 2024)',
    full_title: 'Undang-Undang Nomor 63 Tahun 2024 tentang Perubahan atas UU Keimigrasian',
    category: 'hukum',
    status: 'disahkan',
    date_submitted: '2024-06-01',
    date_passed: '2024-09-17',
    sponsor: ['pemerintah'],
    committee: 'Komisi III DPR',
    votes_for: 380,
    votes_against: 20,
    abstain: 5,
    party_votes: {
      ger: 'setuju', pdip: 'setuju', gol: 'setuju', nas: 'setuju',
      pkb: 'setuju', pks: 'abstain', pan: 'setuju', dem: 'setuju', han: 'setuju',
    },
    controversy_level: 6,
    key_provisions: [
      'Pengetatan prosedur visa dan izin tinggal WNA',
      'Deportasi dipercepat untuk pelanggaran imigrasi',
      'Kewenangan cekal dan cegah diperluas',
      'Penegakan hukum di kawasan perbatasan diperkuat',
    ],
    criticism: [
      'Dianggap diskriminatif terhadap WNA tertentu',
      'Berpotensi hambat investor dan wisatawan asing',
      'Prosedur banding deportasi dianggap terlalu singkat',
    ],
    support: [
      'Keamanan nasional dan kedaulatan perbatasan',
      'Mencegah masuknya pelaku kejahatan transnasional',
      'Modernisasi sistem imigrasi digital',
    ],
    person_ids: [],
    demo_triggered: false,
    source: 'Pemerintah / DPR RI',
  },

  // ─────────────────────────────────────────────────────────
  // 23. RUU KEJAKSAAN 2025
  // ─────────────────────────────────────────────────────────
  {
    id: 'ruu_kejaksaan_2025',
    title: 'RUU Kejaksaan 2025',
    full_title: 'Rancangan Undang-Undang tentang Perubahan atas Undang-Undang Nomor 16 Tahun 2004 tentang Kejaksaan',
    category: 'hukum',
    status: 'pembahasan',
    date_submitted: '2025-01-20',
    date_passed: null,
    sponsor: ['pemerintah'],
    committee: 'Komisi III DPR',
    votes_for: 0,
    votes_against: 0,
    abstain: 0,
    party_votes: {},
    controversy_level: 7,
    key_provisions: [
      'Perluasan kewenangan Jaksa Agung dalam penuntutan',
      'Jaksa dapat menerbitkan surat perintah penghentian penuntutan (SKPP) lebih luas',
      'Koordinasi antar lembaga penegak hukum diperkuat',
      'Kewenangan kejaksaan bidang perdata dan tata usaha negara diperluas',
    ],
    criticism: [
      'Berpotensi politisasi Kejaksaan oleh eksekutif',
      'Diskresi SKPP yang luas rawan digunakan untuk lindungi pihak tertentu',
      'LSM antikorupsi khawatir melemahkan akuntabilitas jaksa',
      'Draf dibahas tanpa konsultasi publik yang luas',
    ],
    support: [
      'Modernisasi institusi kejaksaan yang sudah ketinggalan zaman',
      'Efisiensi penuntutan perkara',
      'Kejelasan kewenangan koordinasi dengan KPK dan Polri',
    ],
    person_ids: [],
    demo_triggered: false,
    prolegnas_2025: true,
    source: 'Pemerintah / DPR RI',
  },

  // ─────────────────────────────────────────────────────────
  // 24. UU IKN 2022 & REVISI 2024
  // ─────────────────────────────────────────────────────────
  {
    id: 'uu_ikn_2022',
    title: 'UU IKN (& Revisi 2024)',
    full_title: 'Undang-Undang Nomor 3 Tahun 2022 tentang Ibu Kota Negara, direvisi dengan UU Nomor 21 Tahun 2023',
    category: 'politik',
    status: 'disahkan',
    date_submitted: '2021-09-29',
    date_passed: '2022-01-18',
    sponsor: ['pemerintah'],
    committee: 'Panitia Khusus IKN DPR',
    votes_for: 360,
    votes_against: 94,
    abstain: 0,
    party_votes: {
      ger: 'setuju', pdip: 'setuju', gol: 'setuju', nas: 'setuju',
      pkb: 'setuju', pks: 'tolak', pan: 'setuju', dem: 'setuju', han: 'setuju',
    },
    controversy_level: 8,
    key_provisions: [
      'Pemindahan ibu kota RI ke Nusantara, Kalimantan Timur',
      'Pembentukan Otorita Ibu Kota Nusantara (OIKN)',
      'Revisi 2023: membuka kepemilikan lahan bagi investor asing di IKN',
      'Anggaran APBN + swasta + asing untuk pembiayaan',
    ],
    criticism: [
      'Proses legislasi kilat tanpa kajian dampak lingkungan memadai',
      'Ancaman terhadap masyarakat adat Kalimantan Timur',
      'Pembiayaan tidak jelas — investor asing banyak yang mundur',
      'Revisi 2023 dinilai menjual kedaulatan tanah kepada asing',
      'PKS dan sejumlah akademisi menolak sejak awal',
    ],
    support: [
      'Pemerataan pembangunan keluar dari Jawa',
      'Misi besar warisan Presiden Jokowi',
      'Potensi pusat ekonomi baru di Kalimantan',
    ],
    person_ids: ['jokowi', 'prabowo'],
    demo_triggered: false,
    source: 'Pemerintah / DPR RI',
  },

]

// ── Computed helpers ──────────────────────────────────────────────────────────

export function getBillsByStatus(status) {
  return BILLS.filter(b => b.status === status)
}

export function getTopControversial(n = 10) {
  return [...BILLS].sort((a, b) => b.controversy_level - a.controversy_level).slice(0, n)
}

export function getPartyRejectionCount() {
  const counts = {}
  BILLS.forEach(bill => {
    Object.entries(bill.party_votes || {}).forEach(([party, vote]) => {
      if (vote === 'tolak') {
        counts[party] = (counts[party] || 0) + 1
      }
    })
  })
  return Object.entries(counts)
    .map(([party, count]) => ({ party, count, name: PARTY_NAMES[party] || party }))
    .sort((a, b) => b.count - a.count)
}

export function getDemoTriggeredBills() {
  return BILLS.filter(b => b.demo_triggered)
}

export function getProlegnas2025Bills() {
  return BILLS.filter(b => b.prolegnas_2025 === true)
}

export function getProlegnas2025Stats() {
  const bills = getProlegnas2025Bills()
  const disahkan  = bills.filter(b => b.status === 'disahkan').length
  const dibahas   = bills.filter(b => ['ruu', 'pembahasan'].includes(b.status)).length
  const mandek    = bills.filter(b => ['ditunda', 'ditolak', 'dicabut'].includes(b.status)).length
  return { total: bills.length, disahkan, dibahas, mandek }
}
