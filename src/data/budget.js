// APBN 2025 — Efisiensi Anggaran Rp 306T
// Source: Instruksi Presiden No. 1/2025, Kemenkeu data, media coverage

export const APBN_2025 = {
  total_apbn: 3613000000000000,      // Rp 3.613T
  total_cut: 306000000000000,         // Rp 306T
  cut_pct: 8.47,
  signed_date: '2025-01-22',
  signed_by: 'prabowo',
  context: 'Instruksi Presiden (Inpres) No. 1 Tahun 2025 memerintahkan efisiensi Rp 306,69 triliun dari APBN 2025 untuk mendanai program prioritas seperti Makan Bergizi Gratis.',
};

export const MINISTRY_BUDGETS = [
  // { id, name, minister_id, budget_original, budget_after_cut, cut_amount, cut_pct, impact_note }
  { id: 'pupr',       name: 'Kementerian PUPR',           minister_id: null,             budget_original: 147300000000000, cut_amount: 81400000000000,  impact_note: 'Proyek infrastruktur besar ditunda; jalan/jembatan terhenti' },
  { id: 'polri',      name: 'Kepolisian RI (Polri)',       minister_id: 'listyo_sigit',   budget_original: 114100000000000, cut_amount: 63300000000000,  impact_note: 'Operasional dikurangi; rekrutmen dihentikan sementara' },
  { id: 'pendidikan', name: 'Kementerian Pendidikan',     minister_id: null,             budget_original: 98800000000000,  cut_amount: 8900000000000,   impact_note: 'BOS dan beasiswa tetap; anggaran operasional dipotong' },
  { id: 'kesehatan',  name: 'Kementerian Kesehatan',      minister_id: null,             budget_original: 57900000000000,  cut_amount: 18400000000000,  impact_note: 'RS vertikal terdampak; alat kesehatan ditunda' },
  { id: 'tni',        name: 'Tentara Nasional Indonesia', minister_id: 'agus_subiyanto', budget_original: 165400000000000, cut_amount: 26700000000000,  impact_note: 'Modernisasi alutsista ditunda' },
  { id: 'kemendag',   name: 'Kementerian Perdagangan',    minister_id: null,             budget_original: 2900000000000,   cut_amount: 1800000000000,   impact_note: 'Promosi ekspor dikurangi drastis' },
  { id: 'kemenperin', name: 'Kementerian Perindustrian',  minister_id: 'agus_gumiwang',  budget_original: 3200000000000,   cut_amount: 2000000000000,   impact_note: 'Program hilirisasi industri terhambat' },
  { id: 'kpk',        name: 'KPK',                        minister_id: 'nawawi',         budget_original: 1600000000000,   cut_amount: 650000000000,    impact_note: 'Kapasitas investigasi berkurang; penyidik terbatas' },
  { id: 'bin',        name: 'Badan Intelijen Negara',     minister_id: 'budi_gunawan',   budget_original: 5300000000000,   cut_amount: 2100000000000,   impact_note: 'Operasi intelijen dikurangi' },
  { id: 'brin',       name: 'BRIN',                       minister_id: null,             budget_original: 6700000000000,   cut_amount: 4200000000000,   impact_note: 'Penelitian nasional terhenti sebagian besar; lab tutup' },
  { id: 'kominfo',    name: 'Kemenkomdigi',               minister_id: 'meutya_hafid',   budget_original: 3800000000000,   cut_amount: 1200000000000,   impact_note: 'Program digitalisasi desa ditunda' },
  { id: 'kemenlu',    name: 'Kementerian Luar Negeri',    minister_id: 'sugiono',        budget_original: 7200000000000,   cut_amount: 2800000000000,   impact_note: 'Kedubes tertentu dikurangi staf' },
  { id: 'bumn',       name: 'Kementerian BUMN',           minister_id: 'erick_thohir',   budget_original: 1500000000000,   cut_amount: 200000000000,    impact_note: 'Danantara justru diperkuat; BUMN mandiri' },
  { id: 'kemenkeu',   name: 'Kementerian Keuangan',       minister_id: 'sri_mulyani',    budget_original: 45200000000000,  cut_amount: 9100000000000,   impact_note: 'Operasional dikurangi; DJP tetap beroperasi penuh' },
  { id: 'menpanrb',   name: 'KemenPAN-RB',                minister_id: 'azwar_anas',     budget_original: 1900000000000,   cut_amount: 900000000000,    impact_note: 'Rekrutmen ASN melambat' },
  { id: 'dpr',        name: 'DPR RI',                     minister_id: null,             budget_original: 6100000000000,   cut_amount: 1200000000000,   impact_note: 'Perjalanan dinas anggota DPR dipangkas' },
  { id: 'kemensos',   name: 'Kementerian Sosial',         minister_id: null,             budget_original: 79600000000000,  cut_amount: 2400000000000,   impact_note: 'Bansos tetap; efisiensi operasional' },
  { id: 'mahkamah',   name: 'Mahkamah Agung',             minister_id: 'sunarto',        budget_original: 12100000000000,  cut_amount: 3200000000000,   impact_note: 'Renovasi gedung pengadilan ditunda' },
];

// Compute derived fields
MINISTRY_BUDGETS.forEach(m => {
  m.budget_after_cut = m.budget_original - m.cut_amount;
  m.cut_pct = parseFloat((m.cut_amount / m.budget_original * 100).toFixed(1));
});

// Priority programs funded by savings
export const PRIORITY_PROGRAMS = [
  { name: 'Makan Bergizi Gratis (MBG)',     budget: 71000000000000,  beneficiaries: '82 juta anak sekolah',    status: 'berjalan' },
  { name: 'Swasembada Pangan',              budget: 58000000000000,  beneficiaries: 'Petani nasional',          status: 'berjalan' },
  { name: 'Pembangunan 3 Juta Rumah',       budget: 45000000000000,  beneficiaries: 'MBR & ASN',                status: 'berjalan' },
  { name: 'Hilirisasi Industri',            budget: 32000000000000,  beneficiaries: 'Industri nikel/sawit',     status: 'berjalan' },
  { name: 'Danantara (Sovereign Wealth)',   budget: 0,               beneficiaries: 'Investasi jangka panjang', status: 'berjalan', note: 'Modal dari dividen BUMN' },
];
