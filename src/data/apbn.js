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
