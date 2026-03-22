// APBN 2025 — Anggaran Pendapatan dan Belanja Negara
// Sumber: Perpres 201/2024 + realisasi Q1 estimasi

export const APBN_2025 = {
  tahun: 2025,
  pendapatan_target: 2996.9,    // Triliun Rp
  pendapatan_realisasi: 285.0,  // Q1 estimate
  belanja_target: 3621.3,
  belanja_realisasi: 420.0,     // Q1 estimate
  defisit_target: -624.4,
  defisit_realisasi: -135.0,
  sumber_data: "APBN 2025 Perpres 201/2024 + realisasi Q1 estimasi",
};

export const DEPARTEMEN = [
  {
    id: "kemendikbud",
    nama: "Kemendikbudristek",
    pagu: 98.9,
    realisasi: 18.2,
    persen: 18.4,
    menteri: "Abdul Mu'ti",
    partai: "dem",
    prioritas: ["merdeka belajar", "beasiswa KIP", "riset"],
  },
  {
    id: "kemenkes",
    nama: "Kemenkes",
    pagu: 90.5,
    realisasi: 15.8,
    persen: 17.5,
    menteri: "Budi Gunadi Sadikin",
    partai: null,
    prioritas: ["JKN", "puskesmas", "stunting"],
  },
  {
    id: "kemenpupr",
    nama: "Kemen PUPR",
    pagu: 110.9,
    realisasi: 12.0,
    persen: 10.8,
    menteri: "Dody Hanggodo",
    partai: "ger",
    prioritas: ["IKN", "jalan tol", "irigasi"],
  },
  {
    id: "kemenhan",
    nama: "Kemenhan",
    pagu: 165.9,
    realisasi: 28.5,
    persen: 17.2,
    menteri: "Sjafrie Sjamsoeddin",
    partai: null,
    prioritas: ["alutsista", "TNI modernisasi"],
  },
  {
    id: "kemenkeu",
    nama: "Kemenkeu",
    pagu: 52.1,
    realisasi: 9.8,
    persen: 18.8,
    menteri: "Sri Mulyani",
    partai: null,
    prioritas: ["pajak", "cukai", "fiskal"],
  },
  {
    id: "kemensos",
    nama: "Kemensos",
    pagu: 78.3,
    realisasi: 22.1,
    persen: 28.2,
    menteri: "Saifullah Yusuf",
    partai: "pkb",
    prioritas: ["bansos", "PKH", "BPNT"],
  },
  {
    id: "kemenhub",
    nama: "Kemenhub",
    pagu: 32.5,
    realisasi: 4.2,
    persen: 12.9,
    menteri: "Dudy Purwagandhi",
    partai: null,
    prioritas: ["kereta cepat", "pelabuhan", "airport"],
  },
  {
    id: "kementan",
    nama: "Kementan",
    pagu: 29.3,
    realisasi: 5.1,
    persen: 17.4,
    menteri: "Andi Amran Sulaiman",
    partai: "ger",
    prioritas: ["food estate", "pupuk", "irigasi"],
  },
  {
    id: "kemendagri",
    nama: "Kemendagri",
    pagu: 3.8,
    realisasi: 0.7,
    persen: 18.4,
    menteri: "Tito Karnavian",
    partai: null,
    prioritas: ["pilkada", "e-KTP", "daerah"],
  },
  {
    id: "bpk_bpn",
    nama: "Bappenas",
    pagu: 1.9,
    realisasi: 0.3,
    persen: 15.8,
    menteri: "Rachmat Pambudy",
    partai: "ger",
    prioritas: ["RPJMN", "IKN masterplan"],
  },
  {
    id: "makan_bergizi",
    nama: "Program Makan Bergizi Gratis",
    pagu: 71.0,
    realisasi: 8.5,
    persen: 12.0,
    menteri: "Dadan Hindayana (BPGF)",
    partai: null,
    prioritas: ["gizi anak sekolah", "ketahanan pangan"],
  },
  {
    id: "transfer_daerah",
    nama: "Transfer ke Daerah",
    pagu: 919.9,
    realisasi: 198.0,
    persen: 21.5,
    menteri: "DAU/DAK/Dana Desa",
    partai: null,
    prioritas: ["Dana Desa", "DAK Fisik", "DAU"],
  },
];

export const TREN_BULANAN = [
  { bulan: "Jan", pendapatan: 95.2,  belanja: 110.5, proyeksi: false },
  { bulan: "Feb", pendapatan: 98.8,  belanja: 145.2, proyeksi: false },
  { bulan: "Mar", pendapatan: 91.0,  belanja: 164.3, proyeksi: false },
  { bulan: "Apr", pendapatan: 102.5, belanja: 155.0, proyeksi: true  },
  { bulan: "Mei", pendapatan: 108.0, belanja: 160.2, proyeksi: true  },
  { bulan: "Jun", pendapatan: 115.3, belanja: 175.5, proyeksi: true  },
  { bulan: "Jul", pendapatan: 118.0, belanja: 180.0, proyeksi: true  },
  { bulan: "Agu", pendapatan: 112.5, belanja: 185.0, proyeksi: true  },
  { bulan: "Sep", pendapatan: 120.0, belanja: 195.0, proyeksi: true  },
  { bulan: "Okt", pendapatan: 125.0, belanja: 200.0, proyeksi: true  },
  { bulan: "Nov", pendapatan: 118.0, belanja: 210.0, proyeksi: true  },
  { bulan: "Des", pendapatan: 192.6, belanja: 240.6, proyeksi: true  },
];

export const SUMBER_PENDAPATAN = [
  { nama: "Pajak Penghasilan", nilai: 831.4, persen: 27.7, warna: "#ef4444" },
  { nama: "PPN & PPnBM",       nilai: 747.5, persen: 24.9, warna: "#f97316" },
  { nama: "Pajak Lainnya",     nilai: 88.2,  persen: 2.9,  warna: "#eab308" },
  { nama: "Cukai",             nilai: 244.2, persen: 8.2,  warna: "#22c55e" },
  { nama: "PNBP",              nilai: 513.6, persen: 17.1, warna: "#3b82f6" },
  { nama: "Hibah",             nilai: 3.7,   persen: 0.1,  warna: "#8b5cf6" },
  { nama: "Utang/Pembiayaan",  nilai: 624.4, persen: 20.8, warna: "#64748b" },
];

export const UTANG_NEGARA = {
  total: 8961.0,           // Triliun Rp
  rasio_pdb: 38.5,         // persen
  jatuh_tempo_2025: 800.3, // Triliun Rp
  kreditor: [
    { nama: "Domestik (SBN)",       nilai: 7200, persen: 80.3 },
    { nama: "Bilateral",            nilai: 480,  persen: 5.4  },
    { nama: "Multilateral (WB/ADB)",nilai: 680,  persen: 7.6  },
    { nama: "Komersial",            nilai: 601,  persen: 6.7  },
  ],
};

export const KONTEKS_POLITIK = [
  {
    id: "efisiensi",
    judul: "Efisiensi Anggaran Prabowo",
    nilai: "Rp 306 T",
    deskripsi: "Instruksi Presiden memotong anggaran kementerian/lembaga sebesar Rp 306,69 triliun. Fokus: belanja perjalanan dinas, seminar, dan konsultansi.",
    tag: "Pemotongan",
    ikon: "✂️",
    warna: "red",
  },
  {
    id: "mbg",
    judul: "Program Makan Bergizi Gratis",
    nilai: "Rp 71 T",
    deskripsi: "Flagship program Prabowo-Gibran. Target 82,9 juta penerima manfaat per hari. Dikelola Badan Gizi Nasional (BPGF).",
    tag: "Prioritas Presiden",
    ikon: "🍱",
    warna: "green",
  },
  {
    id: "ikn",
    judul: "IKN Budget 2025",
    nilai: "Rp 6,3 T",
    deskripsi: "Anggaran pembangunan Ibu Kota Nusantara (IKN) turun signifikan dari 2024 (Rp 43 T). Pemerintah mengutamakan efisiensi dan investasi swasta.",
    tag: "Infrastruktur",
    ikon: "🏙️",
    warna: "blue",
  },
  {
    id: "defisit",
    judul: "Defisit Anggaran 2025",
    nilai: "2,53% PDB",
    deskripsi: "Target defisit Rp 624,4 triliun atau 2,53% PDB. Masih dalam batas UU (3% PDB). Pembiayaan utama melalui penerbitan SBN domestik.",
    tag: "Fiskal",
    ikon: "📉",
    warna: "orange",
  },
];

// ── APBN 2026 ─────────────────────────────────────────────────────────────────

export const APBN_2026 = {
  tahun: 2026,
  pendapatan_target: 3005.1,  // Triliun Rp (estimasi RAPBN 2026)
  pendapatan_realisasi: null,  // belum ada data realisasi
  belanja_target: 3621.3,     // asumsi flat dari 2025 (RAPBN belum ditetapkan)
  belanja_realisasi: null,
  defisit_target: -616.2,
  defisit_realisasi: null,
  sumber_data: "RAPBN 2026 — proyeksi Kemenkeu (belum final, estimasi berdasarkan kebijakan fiskal 2025-2026)",
  status: "proyeksi",  // proyeksi | realisasi
  catatan: "APBN 2026 masih dalam tahap pembahasan. Angka mengacu pada KFIB dan nota keuangan 2026.",
};

export const DEPARTEMEN_2026 = [
  { id: "kemendikbud", nama: "Kemendikbudristek", pagu: 95.0, realisasi: null, persen: null, menteri: "Abdul Mu'ti", partai: "dem", catatan: "Efisiensi 4%" },
  { id: "kemenkes", nama: "Kemenkes", pagu: 92.0, realisasi: null, persen: null, menteri: "Budi Gunadi Sadikin", partai: null },
  { id: "kemenpupr", nama: "Kemen PUPR", pagu: 115.0, realisasi: null, persen: null, menteri: "Dody Hanggodo", partai: "ger", catatan: "IKN Fase 2" },
  { id: "kemenhan", nama: "Kemenhan", pagu: 170.0, realisasi: null, persen: null, menteri: "Sjafrie Sjamsoeddin", partai: null },
  { id: "kemenkeu", nama: "Kemenkeu", pagu: 48.5, realisasi: null, persen: null, menteri: "Sri Mulyani", partai: null },
  { id: "kemensos", nama: "Kemensos", pagu: 82.0, realisasi: null, persen: null, menteri: "Saifullah Yusuf", partai: "pkb" },
  { id: "makan_bergizi", nama: "Program Makan Bergizi Gratis", pagu: 140.0, realisasi: null, persen: null, menteri: "Dadan Hindayana", partai: null, catatan: "Naik 2x dari 2025 — ekspansi nasional" },
  { id: "transfer_daerah", nama: "Transfer ke Daerah", pagu: 950.0, realisasi: null, persen: null, menteri: "DAU/DAK/Dana Desa", partai: null },
  { id: "kemenhub", nama: "Kemenhub", pagu: 33.0, realisasi: null, persen: null, menteri: "Dudy Purwagandhi", partai: null },
  { id: "kementan", nama: "Kementan", pagu: 31.0, realisasi: null, persen: null, menteri: "Andi Amran Sulaiman", partai: "ger" },
];

export const PERBANDINGAN_TAHUNAN = [
  { tahun: 2023, pendapatan: 2774.3, belanja: 3163.5, defisit: -389.2, gdp_growth: 5.05, inflasi: 3.36 },
  { tahun: 2024, pendapatan: 2802.5, belanja: 3325.1, defisit: -522.6, gdp_growth: 5.03, inflasi: 2.84 },
  { tahun: 2025, pendapatan: 2996.9, belanja: 3621.3, defisit: -624.4, gdp_growth: 5.2,  inflasi: 3.0 },
  { tahun: 2026, pendapatan: 3005.1, belanja: 3621.3, defisit: -616.2, gdp_growth: null, inflasi: null, proyeksi: true },
];

export const TAHUN_OPTIONS = [2025, 2026];

export const PERUBAHAN_KUNCI_2026 = [
  {
    id: "mbg_naik",
    program: "Makan Bergizi Gratis",
    nilai_2025: 71.0,
    nilai_2026: 140.0,
    perubahan: "+97%",
    deskripsi: "Ekspansi nasional — dari program pilot menjadi cakupan penuh",
    ikon: "🍱",
    warna: "green",
  },
  {
    id: "kemenhan_naik",
    program: "Kemenhan",
    nilai_2025: 165.9,
    nilai_2026: 170.0,
    perubahan: "+2,5%",
    deskripsi: "Penguatan alutsista dan modernisasi TNI berlanjut",
    ikon: "🛡️",
    warna: "blue",
  },
  {
    id: "efisiensi_kemenkeu",
    program: "Efisiensi Kementerian",
    nilai_2025: null,
    nilai_2026: null,
    perubahan: "Dipangkas",
    deskripsi: "Sebagian kementerian mengalami pemangkasan — fokus ke program prioritas nasional",
    ikon: "✂️",
    warna: "red",
  },
  {
    id: "transfer_daerah",
    program: "Transfer ke Daerah",
    nilai_2025: 919.9,
    nilai_2026: 950.0,
    perubahan: "+3,3%",
    deskripsi: "Dana Desa, DAK, dan DAU meningkat untuk desentralisasi fiskal",
    ikon: "🏘️",
    warna: "orange",
  },
];
