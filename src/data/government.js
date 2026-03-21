// ─── Executive Government Structure — Kabinet Merah Putih ────────────────────
// Prabowo-Gibran Administration, inaugurated 2024-10-20

export const CABINET_STRUCTURE = {
  president: {
    person_id: 'prabowo',
    name: 'Prabowo Subianto',
    title: 'Presiden Republik Indonesia',
    short_title: 'Presiden RI',
    since: '2024-10-20',
    party: 'ger',
    lhkpn_total: 1_995_000_000_000, // ~Rp 2T (kekayaan publik)
    photo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Prabowo_Subianto_2024_official_portrait.jpg/400px-Prabowo_Subianto_2024_official_portrait.jpg',
  },
  vice_president: {
    person_id: 'gibran',
    name: 'Gibran Rakabuming Raka',
    title: 'Wakil Presiden Republik Indonesia',
    short_title: 'Wakil Presiden RI',
    since: '2024-10-20',
    party: 'psi',
    lhkpn_total: 33_900_000_000, // ~Rp 33,9M
    photo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Gibran_Rakabuming_Raka_2024_official_portrait.jpg/400px-Gibran_Rakabuming_Raka_2024_official_portrait.jpg',
  },

  // ── Menteri Koordinator (7 total) ─────────────────────────────────────────
  coordinating_ministers: [
    {
      person_id: 'budi_gunawan',
      name: 'Budi Gunawan',
      title: 'Menko Bidang Politik dan Keamanan',
      ministry: 'Kemenko Polkam',
      since: '2024-10-21',
      party: null,
      notable: 'Eks Kepala BIN; pernah jadi tersangka KPK 2015 (SP3\'d)',
    },
    {
      person_id: 'airlangga',
      name: 'Airlangga Hartarto',
      title: 'Menko Bidang Perekonomian',
      ministry: 'Kemenko Ekonomi',
      since: '2024-10-21',
      party: 'gol',
      notable: 'Mantan Ketum Golkar; arsitek Omnibus Law',
    },
    {
      person_id: 'yusril',
      name: 'Yusril Ihza Mahendra',
      title: 'Menko Bidang Hukum, HAM, Imigrasi & Pemasyarakatan',
      ministry: 'Kemenko Kumham Imipas',
      since: '2024-10-21',
      party: 'pbb',
      notable: 'Ketum PBB; eks Mensesneg; pakar hukum tata negara',
    },
    {
      person_id: 'zulhas',
      name: 'Zulkifli Hasan',
      title: 'Menko Bidang Pangan',
      ministry: 'Kemenko Pangan',
      since: '2024-10-21',
      party: 'pan',
      notable: 'Ketum PAN; sebelumnya Mendag Jokowi',
    },
    {
      person_id: 'ahy',
      name: 'Agus Harimurti Yudhoyono',
      title: 'Menko Bidang Infrastruktur & Pembangunan Kewilayahan',
      ministry: 'Kemenko Infra',
      since: '2024-10-21',
      party: 'dem',
      notable: 'Ketum Demokrat; putra SBY; eks Perwira TNI AD',
    },
    {
      person_id: 'bahlil',
      name: 'Bahlil Lahadalia',
      title: 'Menko Bidang Energi',
      ministry: 'Kemenko Energi',
      since: '2024-10-21',
      party: 'gol',
      notable: 'Ketum Golkar (2024); eks Menteri Investasi; pengusaha Papua',
    },
    {
      person_id: 'cakimin',
      name: 'Muhaimin Iskandar',
      title: 'Menko Bidang Pemberdayaan Masyarakat',
      ministry: 'Kemenko PM',
      since: '2024-10-21',
      party: 'pkb',
      notable: 'Ketum PKB; Cawapres Anies 2024; eks Menakertrans',
    },
  ],

  // ── Menteri (34+ total) ───────────────────────────────────────────────────
  ministers: [
    // Ekonomi & Keuangan
    {
      person_id: 'sri_mulyani',
      name: 'Sri Mulyani Indrawati',
      title: 'Menteri Keuangan',
      ministry: 'Kemenkeu',
      since: '2024-10-21',
      party: null,
    },
    {
      person_id: 'erick_thohir',
      name: 'Erick Thohir',
      title: 'Menteri BUMN',
      ministry: 'Kemen-BUMN',
      since: '2024-10-21',
      party: 'ger',
    },
    {
      person_id: 'agus_gumiwang',
      name: 'Agus Gumiwang Kartasasmita',
      title: 'Menteri Perindustrian',
      ministry: 'Kemenperin',
      since: '2024-10-21',
      party: 'gol',
    },
    {
      person_id: null,
      name: 'Budi Santoso',
      title: 'Menteri Perdagangan',
      ministry: 'Kemendag',
      since: '2024-10-21',
      party: null,
    },
    {
      person_id: null,
      name: 'Thomas Djiwandono',
      title: 'Wakil Menteri Keuangan',
      ministry: 'Kemenkeu',
      since: '2024-10-21',
      party: 'ger',
    },
    {
      person_id: null,
      name: 'Luhut Binsar Pandjaitan',
      title: 'Ketua Dewan Ekonomi Nasional',
      ministry: 'DEN',
      since: '2024-10-21',
      party: null,
    },
    // Politik-Keamanan
    {
      person_id: 'sjafrie',
      name: 'Sjafrie Sjamsoeddin',
      title: 'Menteri Pertahanan',
      ministry: 'Kemhan',
      since: '2024-10-21',
      party: null,
    },
    {
      person_id: 'sugiono',
      name: 'Sugiono',
      title: 'Menteri Luar Negeri',
      ministry: 'Kemenlu',
      since: '2024-10-21',
      party: 'ger',
    },
    {
      person_id: null,
      name: 'Tito Karnavian',
      title: 'Menteri Dalam Negeri',
      ministry: 'Kemendagri',
      since: '2024-10-21',
      party: null,
    },
    {
      person_id: null,
      name: 'Supratman Andi Agtas',
      title: 'Menteri Hukum',
      ministry: 'Kemenkumham',
      since: '2024-10-21',
      party: 'ger',
    },
    // Pemerintahan & Layanan
    {
      person_id: 'meutya_hafid',
      name: 'Meutya Viada Hafid',
      title: 'Menteri Komunikasi dan Digital',
      ministry: 'Kemenkomdigi',
      since: '2024-10-21',
      party: 'gol',
    },
    {
      person_id: 'budi_arie',
      name: 'Budi Arie Setiadi',
      title: 'Menteri Koperasi',
      ministry: 'Kemenkop',
      since: '2024-10-21',
      party: 'ger',
    },
    {
      person_id: null,
      name: 'Abdullah Azwar Anas',
      title: 'Menteri PAN-RB',
      ministry: 'KemenPAN-RB',
      since: '2024-10-21',
      party: 'pkb',
    },
    {
      person_id: null,
      name: 'Satryo Soemantri Brodjonegoro',
      title: 'Menteri Pendidikan Tinggi, Sains & Teknologi',
      ministry: 'Kemendikti Saintek',
      since: '2024-10-21',
      party: null,
    },
    {
      person_id: null,
      name: "Abdul Mu'ti",
      title: 'Menteri Pendidikan Dasar dan Menengah',
      ministry: 'Kemendikdasmen',
      since: '2024-10-21',
      party: null,
    },
    {
      person_id: null,
      name: 'Budi Gunadi Sadikin',
      title: 'Menteri Kesehatan',
      ministry: 'Kemenkes',
      since: '2024-10-21',
      party: null,
    },
    // Infrastruktur & Lingkungan
    {
      person_id: 'basuki',
      name: 'Basuki Hadimuljono',
      title: 'Kepala Otorita IKN',
      ministry: 'OIKN',
      since: '2024-10-21',
      party: null,
    },
    {
      person_id: null,
      name: 'Dody Hanggodo',
      title: 'Menteri Pekerjaan Umum',
      ministry: 'Kemen-PU',
      since: '2024-10-21',
      party: 'ger',
    },
    {
      person_id: null,
      name: 'Maruarar Sirait',
      title: 'Menteri Perumahan & Kawasan Permukiman',
      ministry: 'Kemenpera',
      since: '2024-10-21',
      party: 'ger',
    },
    {
      person_id: null,
      name: 'Yassierli',
      title: 'Menteri Ketenagakerjaan',
      ministry: 'Kemnaker',
      since: '2024-10-21',
      party: null,
    },
    {
      person_id: null,
      name: 'Raja Juli Antoni',
      title: 'Menteri Kehutanan',
      ministry: 'Kemenhut',
      since: '2024-10-21',
      party: 'psi',
    },
    {
      person_id: null,
      name: 'Hanif Dhakiri',
      title: 'Menteri Pemuda dan Olahraga',
      ministry: 'Kemenpora',
      since: '2024-10-21',
      party: 'pkb',
    },
    // Sosial & Agama
    {
      person_id: null,
      name: 'Saifullah Yusuf (Gus Ipul)',
      title: 'Menteri Sosial',
      ministry: 'Kemensos',
      since: '2024-10-21',
      party: 'pkb',
    },
    {
      person_id: null,
      name: 'Nasaruddin Umar',
      title: 'Menteri Agama',
      ministry: 'Kemenag',
      since: '2024-10-21',
      party: null,
    },
    {
      person_id: null,
      name: 'Arifatul Choiri Fauzi',
      title: 'Menteri PPPA',
      ministry: 'KemenPPPA',
      since: '2024-10-21',
      party: 'pkb',
    },
    {
      person_id: null,
      name: 'Wihaji',
      title: 'Menteri Kependudukan & Pembangunan Keluarga',
      ministry: 'Kemenduk KB',
      since: '2024-10-21',
      party: 'ger',
    },
    {
      person_id: null,
      name: 'Wahyu Santoso',
      title: 'Menteri Desa & Pembangunan Daerah Tertinggal',
      ministry: 'Kemendesa PDT',
      since: '2024-10-21',
      party: 'pkb',
    },
    {
      person_id: null,
      name: 'Nusron Wahid',
      title: 'Menteri Agraria dan Tata Ruang / BPN',
      ministry: 'Kemen-ATR/BPN',
      since: '2024-10-21',
      party: 'gol',
    },
    {
      person_id: null,
      name: 'Fadli Zon',
      title: 'Menteri Kebudayaan',
      ministry: 'Kemenbud',
      since: '2024-10-21',
      party: 'ger',
    },
    {
      person_id: null,
      name: 'Budiman Sudjatmiko',
      title: 'Menteri Transmigrasi',
      ministry: 'Kementrans',
      since: '2024-10-21',
      party: 'ger',
    },
    {
      person_id: null,
      name: 'I Wayan Toni Eka Darmadi',
      title: 'Menteri Pariwisata',
      ministry: 'Kemenpar',
      since: '2024-10-21',
      party: null,
    },
    {
      person_id: null,
      name: 'Sakti Wahyu Trenggono',
      title: 'Menteri Kelautan dan Perikanan',
      ministry: 'KKP',
      since: '2024-10-21',
      party: null,
    },
    {
      person_id: null,
      name: 'Amran Sulaiman',
      title: 'Menteri Pertanian',
      ministry: 'Kementan',
      since: '2024-10-21',
      party: null,
    },
    {
      person_id: null,
      name: 'Abdul Halim Iskandar',
      title: 'Kepala Bappenas',
      ministry: 'Bappenas',
      since: '2024-10-21',
      party: 'pkb',
    },
  ],

  // ── Approval Ratings ──────────────────────────────────────────────────────
  approval_ratings: [
    { month: '2024-11', score: 82, label: 'Nov 2024' },
    { month: '2024-12', score: 79, label: 'Des 2024' },
    { month: '2025-01', score: 76, label: 'Jan 2025' },
    { month: '2025-02', score: 74, label: 'Feb 2025' },
    { month: '2025-03', score: 71, label: 'Mar 2025' },
  ],
}

// ─── Ministry Programs & Controversies ───────────────────────────────────────
export const MINISTRY_PROGRAMS = [
  {
    ministry: 'Kemenkeu',
    person_id: 'sri_mulyani',
    name: 'Sri Mulyani Indrawati',
    programs: [
      { name: 'Efisiensi Anggaran Rp306T', status: 'ongoing', controversy: true, desc: 'Pemangkasan besar-besaran APBN 2025 yang berimbas pada sektor kesehatan, pendidikan, dan infrastruktur' },
      { name: 'Coretax System DJP', status: 'ongoing', controversy: true, desc: 'Sistem perpajakan baru yang mengalami gangguan masif saat peluncuran Jan 2025' },
      { name: 'Reformasi Transfer ke Daerah', status: 'ongoing', controversy: false, desc: 'Efisiensi Dana Alokasi Umum & Dana Desa' },
    ],
  },
  {
    ministry: 'Kemhan',
    person_id: 'sjafrie',
    name: 'Sjafrie Sjamsoeddin',
    programs: [
      { name: 'Modernisasi Alutsista TNI', status: 'ongoing', controversy: false, desc: 'Program pengadaan senjata & kendaraan tempur baru' },
      { name: 'Anggaran Pertahanan Rp165T', status: 'ongoing', controversy: true, desc: 'Kenaikan anggaran Kemhan signifikan di tengah efisiensi nasional' },
    ],
  },
  {
    ministry: 'Kemen-BUMN',
    person_id: 'erick_thohir',
    name: 'Erick Thohir',
    programs: [
      { name: 'Danantara Sovereign Wealth Fund', status: 'ongoing', controversy: true, desc: 'Pembentukan SWF baru Feb 2025 dengan aset BUMN senilai Rp9.000T; isu tata kelola & akuntabilitas' },
      { name: 'Konsolidasi BUMN Karya', status: 'ongoing', controversy: false, desc: 'Penggabungan & restrukturisasi BUMN konstruksi' },
      { name: 'IPO Anak Usaha BUMN', status: 'ongoing', controversy: false, desc: 'Program melepas saham anak perusahaan BUMN ke pasar' },
    ],
  },
  {
    ministry: 'Kemenkomdigi',
    person_id: 'meutya_hafid',
    name: 'Meutya Viada Hafid',
    programs: [
      { name: 'Pemberantasan Judi Online', status: 'ongoing', controversy: false, desc: 'Pemblokiran situs judi online yang terus berkembang' },
      { name: 'Literasi Digital Nasional', status: 'ongoing', controversy: false, desc: 'Program edukasi digital masyarakat 2025' },
      { name: 'Revisi UU ITE', status: 'delayed', controversy: true, desc: 'Perubahan regulasi ITE yang berpotensi membatasi kebebasan berekspresi' },
    ],
  },
  {
    ministry: 'Kemenko Polkam',
    person_id: 'budi_gunawan',
    name: 'Budi Gunawan',
    programs: [
      { name: 'Operasi Pemberantasan Premanisme', status: 'ongoing', controversy: true, desc: 'Operasi nasional yang dinilai represif oleh organisasi HAM' },
      { name: 'Koordinasi Intelijen Nasional', status: 'ongoing', controversy: false, desc: 'Integrasi BIN-Polri-TNI di bawah Kemenko Polkam' },
    ],
  },
  {
    ministry: 'Kemenko Energi',
    person_id: 'bahlil',
    name: 'Bahlil Lahadalia',
    programs: [
      { name: 'Transisi Energi & EBT', status: 'ongoing', controversy: false, desc: 'Pengembangan energi terbarukan: PLTS, PLTA, panas bumi' },
      { name: 'Hilirisasi Nikel & Tambang', status: 'ongoing', controversy: true, desc: 'Lanjutan program hilirisasi; isu lingkungan di Papua & Sulawesi' },
      { name: 'BBM Satu Harga', status: 'ongoing', controversy: false, desc: 'Distribusi BBM bersubsidi ke daerah terpencil' },
    ],
  },
  {
    ministry: 'Kemenko Pangan',
    person_id: 'zulhas',
    name: 'Zulkifli Hasan',
    programs: [
      { name: 'Swasembada Pangan 2027', status: 'ongoing', controversy: false, desc: 'Target ketahanan pangan nasional: beras, jagung, kedelai' },
      { name: 'Food Estate Kalimantan & Papua', status: 'ongoing', controversy: true, desc: 'Lahan jutaan hektar; kritik: deforestasi & hak tanah adat' },
    ],
  },
  {
    ministry: 'Kemenko Infra',
    person_id: 'ahy',
    name: 'Agus Harimurti Yudhoyono',
    programs: [
      { name: 'Kelanjutan Pembangunan IKN', status: 'ongoing', controversy: false, desc: 'Koordinasi pembangunan ibu kota baru Nusantara' },
      { name: 'Tol & Infrastruktur Daerah', status: 'ongoing', controversy: false, desc: 'Percepatan konektivitas Jawa–luar Jawa' },
    ],
  },
  {
    ministry: 'Kemenkumham',
    person_id: null,
    name: 'Supratman Andi Agtas',
    programs: [
      { name: 'Revisi KUHP Nasional', status: 'ongoing', controversy: true, desc: 'Penerapan KUHP baru Jan 2026; pasal living law & penghinaan presiden kontroversial' },
      { name: 'Reformasi Lapas', status: 'ongoing', controversy: false, desc: 'Modernisasi sistem pemasyarakatan' },
    ],
  },
  {
    ministry: 'OIKN',
    person_id: 'basuki',
    name: 'Basuki Hadimuljono',
    programs: [
      { name: 'Konstruksi IKN Nusantara Fase 2', status: 'ongoing', controversy: false, desc: 'Pembangunan kawasan pemerintahan & hunian ASN' },
      { name: 'Pemindahan ASN ke IKN', status: 'delayed', controversy: false, desc: 'Jadwal pemindahan bertahap; sempat tertunda dari target 2024' },
    ],
  },
]

// ─── Helper: count programs / controversies per person ────────────────────────
export function getPersonPrograms(person_id) {
  const ministry = MINISTRY_PROGRAMS.find(m => m.person_id === person_id)
  if (!ministry) return { total: 0, controversies: 0, programs: [] }
  const controversies = ministry.programs.filter(p => p.controversy).length
  return { total: ministry.programs.length, controversies, programs: ministry.programs }
}

export function getMinistryPrograms(ministryKey) {
  return MINISTRY_PROGRAMS.find(m => m.ministry === ministryKey) || null
}
