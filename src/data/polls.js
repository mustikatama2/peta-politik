// Indonesian political electability surveys 2022–2025
// Sources: LSI Denny JA, Indikator Politik Indonesia, SMRC, Charta Politika, Median Research

export const POLLSTERS = [
  { id: 'lsi',            name: 'LSI Denny JA',                bias: 'tengah', reliability: 8 },
  { id: 'indikator',      name: 'Indikator Politik Indonesia',  bias: 'tengah', reliability: 9 },
  { id: 'smrc',           name: 'SMRC',                         bias: 'tengah', reliability: 8 },
  { id: 'charta',         name: 'Charta Politika',              bias: 'tengah', reliability: 8 },
  { id: 'median',         name: 'Median Research',              bias: 'tengah', reliability: 7 },
  { id: 'saifulmujani',   name: 'Saiful Mujani Research',       bias: 'tengah', reliability: 9 },
  { id: 'poltracking',    name: 'Poltracking Indonesia',        bias: 'tengah', reliability: 8 },
  { id: 'indo_barometer', name: 'Indo Barometer',               bias: 'tengah', reliability: 7 },
  { id: 'litbang_kompas', name: 'Litbang Kompas',               bias: 'tengah', reliability: 9 },
];

// Pilpres 2024 electability tracking (monthly, 2022-2024)
export const PILPRES_2024_POLLS = [
  // Format: { date, pollster, candidates: { person_id: pct } }
  { date: '2022-01', pollster: 'lsi',       candidates: { prabowo: 26, anies: 18, ganjar: 21, sandiaga: 12, ridwan_kamil: 8 } },
  { date: '2022-04', pollster: 'indikator', candidates: { prabowo: 28, anies: 20, ganjar: 19, sandiaga: 10, ridwan_kamil: 9 } },
  { date: '2022-07', pollster: 'smrc',      candidates: { prabowo: 27, anies: 22, ganjar: 20, sandiaga: 8,  ridwan_kamil: 7 } },
  { date: '2022-10', pollster: 'charta',    candidates: { prabowo: 29, anies: 19, ganjar: 22, ridwan_kamil: 9 } },
  { date: '2023-01', pollster: 'lsi',       candidates: { prabowo: 30, anies: 20, ganjar: 25, ridwan_kamil: 7 } },
  { date: '2023-04', pollster: 'indikator', candidates: { prabowo: 32, anies: 18, ganjar: 26, ridwan_kamil: 6 } },
  { date: '2023-07', pollster: 'smrc',      candidates: { prabowo: 34, anies: 19, ganjar: 24, ridwan_kamil: 5 } },
  { date: '2023-10', pollster: 'lsi',       candidates: { prabowo: 36, anies: 18, ganjar: 22, gibran: 8 } },
  { date: '2023-12', pollster: 'indikator', candidates: { prabowo: 40, anies: 20, ganjar: 20, gibran: 10 } },
  { date: '2024-01', pollster: 'smrc',      candidates: { prabowo: 44, anies: 22, ganjar: 18, gibran: 11 } },
  // Actual Pilpres 2024 result:
  { date: '2024-02', pollster: 'kpu',       candidates: { prabowo: 58.59, anies: 24.95, ganjar: 16.47 }, is_result: true },
];

// Post-Pilpres popularity (2024-2025) — tracking Prabowo approval + potential 2029 candidates
export const APPROVAL_POLLS = [
  { date: '2024-11', pollster: 'indikator', person_id: 'prabowo',  approval: 72, disapproval: 18, undecided: 10, note: 'Bulan pertama pemerintahan' },
  { date: '2024-12', pollster: 'smrc',      person_id: 'prabowo',  approval: 75, disapproval: 15, undecided: 10 },
  { date: '2025-01', pollster: 'lsi',       person_id: 'prabowo',  approval: 74, disapproval: 16, undecided: 10, note: 'Pasca kasus Hasto' },
  { date: '2025-02', pollster: 'indikator', person_id: 'prabowo',  approval: 76, disapproval: 14, undecided: 10 },
  { date: '2025-03', pollster: 'charta',    person_id: 'prabowo',  approval: 73, disapproval: 17, undecided: 10, note: 'Pasca demo efisiensi anggaran' },
  // PDIP leader approval
  { date: '2025-01', pollster: 'smrc',      person_id: 'megawati', approval: 42, disapproval: 38, undecided: 20 },
  { date: '2025-03', pollster: 'lsi',       person_id: 'megawati', approval: 40, disapproval: 40, undecided: 20 },
  // Anies post-loss
  { date: '2024-06', pollster: 'indikator', person_id: 'anies',    approval: 55, disapproval: 28, undecided: 17, note: 'Pasca kalah Pilpres' },
  { date: '2025-01', pollster: 'smrc',      person_id: 'anies',    approval: 52, disapproval: 30, undecided: 18 },
];

// 2029 Pilpres early electability (hypothetical, based on real survey data)
export const PILPRES_2029_POLLS = [
  { date: '2024-09', pollster: 'saifulmujani', candidates: { prabowo: 55, anies: 16, dedi_mulyadi: 6, khofifah: 6, ridwan_kamil: 7, gibran: 4 } },
  { date: '2024-10', pollster: 'indikator',    candidates: { prabowo: 54, anies: 17, dedi_mulyadi: 7, khofifah: 6, ridwan_kamil: 6, gibran: 4 } },
  { date: '2024-11', pollster: 'indikator', candidates: { prabowo: 52, anies: 18, dedi_mulyadi: 8,  khofifah: 7,  ganjar: 5,         ridwan_kamil: 5 } },
  { date: '2024-12', pollster: 'smrc',      candidates: { prabowo: 48, anies: 20, dedi_mulyadi: 10, khofifah: 8,  ridwan_kamil: 6,   gibran: 4 } },
  { date: '2025-01', pollster: 'lsi',       candidates: { prabowo: 50, anies: 19, dedi_mulyadi: 11, khofifah: 7,  puan: 4,           ridwan_kamil: 5 } },
  { date: '2025-02', pollster: 'charta',    candidates: { prabowo: 47, anies: 21, dedi_mulyadi: 13, khofifah: 8,  gibran: 5,         ahy: 3 } },
  { date: '2025-03', pollster: 'median',    candidates: { prabowo: 45, anies: 22, dedi_mulyadi: 14, khofifah: 9,  ridwan_kamil: 5,   ahy: 3 } },
  { date: '2025-06', pollster: 'proyeksi',  candidates: { prabowo: 42, anies: 24, dedi_mulyadi: 15, khofifah: 9,  ridwan_kamil: 5,   ahy: 3 }, is_projection: true },
  { date: '2025-12', pollster: 'proyeksi',  candidates: { prabowo: 40, anies: 25, dedi_mulyadi: 17, khofifah: 10, ridwan_kamil: 4,   ahy: 3 }, is_projection: true },
];

// Party electability trends 2022-2025
export const PARTY_POLLS = [
  { date: '2022-06', pollster: 'indikator', parties: { pdip: 22,    ger: 18,    gol: 11,    pkb: 9,     nas: 9,    dem: 8,    pan: 6,    pks: 6 } },
  { date: '2022-12', pollster: 'smrc',      parties: { pdip: 20,    ger: 20,    gol: 12,    pkb: 10,    nas: 8,    dem: 7,    pan: 5,    pks: 7 } },
  { date: '2023-06', pollster: 'lsi',       parties: { pdip: 19,    ger: 22,    gol: 11,    pkb: 10,    nas: 8,    dem: 7,    pan: 6,    pks: 8 } },
  { date: '2023-12', pollster: 'indikator', parties: { pdip: 18,    ger: 24,    gol: 12,    pkb: 9,     nas: 9,    dem: 7,    pan: 6,    pks: 7 } },
  // Pileg 2024 actual result:
  { date: '2024-02', pollster: 'kpu',       parties: { pdip: 16.72, ger: 13.22, gol: 15.28, pkb: 10.62, nas: 9.62, dem: 7.42, pan: 7.24, pks: 8.42, ppp: 3.87 }, is_result: true },
  // Post-pileg
  { date: '2024-06', pollster: 'smrc',      parties: { pdip: 16,    ger: 15,    gol: 14,    pkb: 11,    nas: 9,    dem: 8,    pan: 7,    pks: 8 } },
  { date: '2025-01', pollster: 'indikator', parties: { pdip: 18,    ger: 14,    gol: 13,    pkb: 10,    nas: 8,    dem: 7,    pan: 6,    pks: 9 } },
  { date: '2025-03', pollster: 'lsi',       parties: { pdip: 17,    ger: 13,    gol: 12,    pkb: 11,    nas: 8,    dem: 7,    pan: 6,    pks: 10,   psi: 3 } },
];

// Prabowo government approval rating — high-headline poll series (Indikator Politik)
// These reflect the "net approval" methodology commonly cited in media
export const PRABOWO_APPROVAL_TREND = [
  { date: '2024-11', month_label: 'Nov 2024', approval: 82, note: 'Bulan pertama — honeymoon effect tinggi' },
  { date: '2024-12', month_label: 'Des 2024', approval: 79, note: 'Masih tinggi, MBG mulai diluncurkan' },
  { date: '2025-01', month_label: 'Jan 2025', approval: 76, note: 'Pasca kasus Hasto-KPK — sedikit turun' },
  { date: '2025-02', month_label: 'Feb 2025', approval: 74, note: 'Isu efisiensi anggaran mulai ramai' },
  { date: '2025-03', month_label: 'Mar 2025', approval: 71, note: 'Demo UU TNI & efisiensi APBN tekan popularitas' },
];

// PKS electability trend — growing as oposisi konsisten
export const PKS_ELECTABILITY_TREND = [
  { date: '2024-02', approval: 8.42,  note: 'Hasil resmi Pileg 2024', is_result: true },
  { date: '2024-06', approval: 8.5,   note: 'Pasca-Pilpres — PKS tetap oposisi, elektabilitas stabil' },
  { date: '2024-09', approval: 8.8,   note: 'PKS konsisten oposisi — naik tipis' },
  { date: '2024-12', approval: 9.2,   note: 'Oposisi PKS makin terlihat; publik apresiasi konsistensi' },
  { date: '2025-01', approval: 9.5,   note: 'PKS vokal soal anggaran dan MBG' },
  { date: '2025-03', approval: 10.2,  note: 'Demo UU TNI — PKS jadi referensi suara kritis' },
];

// Makan Bergizi Gratis (MBG) program approval — terpisah dari approval Prabowo secara umum
export const MBG_APPROVAL_POLLS = [
  { date: '2024-11', pollster: 'indikator', approval: 74, note: 'Sebelum MBG diluncurkan — ekspektasi publik' },
  { date: '2025-01', pollster: 'lsi',       approval: 69, note: 'Minggu pertama MBG — antusias tapi logistik bermasalah' },
  { date: '2025-02', pollster: 'smrc',      approval: 65, note: 'Isu kualitas gizi dan distribusi tidak merata' },
  { date: '2025-03', pollster: 'charta',    approval: 62, note: 'Anggaran dipangkas — publik khawatir keberlanjutan' },
  { date: '2025-04', pollster: 'median',    approval: 60, note: 'Target 82 juta anak belum tercapai', is_projection: true },
];

// Perbandingan approval rating presiden di bulan ke-5 masa jabatan
export const PRESIDENT_APPROVAL_COMPARISON = [
  { person_id: 'soekarno',  period: 'Bulan ke-5 (1945)',  approval: null,  note: 'Era revolusi — tidak ada survei formal' },
  { person_id: 'sby',       period: 'Bulan ke-5 (2004)',  approval: 78,    note: 'SBY awal pemerintahan — euphoria reformasi' },
  { person_id: 'jokowi',    period: 'Bulan ke-5 (2014)',  approval: 62,    note: 'Jokowi awal jabatan — janji infrastruktur' },
  { person_id: 'jokowi',    period: 'Bulan ke-5 (2019)',  approval: 71,    note: 'Periode 2 Jokowi — stabilitas awal' },
  { person_id: 'prabowo',   period: 'Bulan ke-5 (2025)',  approval: 71,    note: 'Prabowo Mar 2025 — MBG dan efisiensi anggaran' },
];

// ── 2025 NEW DATA ─────────────────────────────────────────────────────────────

// Multi-lembaga Prabowo approval polls Q1 2025 (for horse race comparison)
export const APPROVAL_POLLS_MULTILEMBAGA = [
  // January 2025
  { date: '2025-01', pollster: 'indikator',      n: 1200, person_id: 'prabowo', approval: 76, disapproval: 14, undecided: 10 },
  { date: '2025-01', pollster: 'lsi',            n: 1000, person_id: 'prabowo', approval: 74, disapproval: 16, undecided: 10, note: 'Pasca kasus Hasto-KPK' },
  { date: '2025-01', pollster: 'smrc',           n: 1000, person_id: 'prabowo', approval: 73, disapproval: 17, undecided: 10 },
  { date: '2025-01', pollster: 'poltracking',    n: 1200, person_id: 'prabowo', approval: 77, disapproval: 13, undecided: 10 },
  { date: '2025-01', pollster: 'indo_barometer', n: 1200, person_id: 'prabowo', approval: 75, disapproval: 15, undecided: 10 },
  { date: '2025-01', pollster: 'charta',         n: 1200, person_id: 'prabowo', approval: 74, disapproval: 16, undecided: 10 },
  // February 2025
  { date: '2025-02', pollster: 'indikator',      n: 1200, person_id: 'prabowo', approval: 76, disapproval: 14, undecided: 10 },
  { date: '2025-02', pollster: 'lsi',            n: 1000, person_id: 'prabowo', approval: 73, disapproval: 17, undecided: 10 },
  { date: '2025-02', pollster: 'smrc',           n: 1000, person_id: 'prabowo', approval: 74, disapproval: 16, undecided: 10, note: 'Isu efisiensi anggaran mulai ramai' },
  { date: '2025-02', pollster: 'poltracking',    n: 1200, person_id: 'prabowo', approval: 78, disapproval: 12, undecided: 10 },
  { date: '2025-02', pollster: 'indo_barometer', n: 1200, person_id: 'prabowo', approval: 75, disapproval: 15, undecided: 10 },
  { date: '2025-02', pollster: 'litbang_kompas', n: 1500, person_id: 'prabowo', approval: 74, disapproval: 16, undecided: 10 },
  // March 2025
  { date: '2025-03', pollster: 'indikator',      n: 1200, person_id: 'prabowo', approval: 72, disapproval: 18, undecided: 10, note: 'Q1 2025 — 100 hari pertama kabinet' },
  { date: '2025-03', pollster: 'lsi',            n: 1000, person_id: 'prabowo', approval: 70, disapproval: 20, undecided: 10, note: 'Demo UU TNI tekan popularitas' },
  { date: '2025-03', pollster: 'smrc',           n: 1000, person_id: 'prabowo', approval: 73, disapproval: 17, undecided: 10 },
  { date: '2025-03', pollster: 'poltracking',    n: 1200, person_id: 'prabowo', approval: 76, disapproval: 14, undecided: 10 },
  { date: '2025-03', pollster: 'indo_barometer', n: 1200, person_id: 'prabowo', approval: 71, disapproval: 19, undecided: 10 },
  { date: '2025-03', pollster: 'charta',         n: 1200, person_id: 'prabowo', approval: 73, disapproval: 17, undecided: 10, note: 'Pasca demo efisiensi APBN' },
];

// Party electability 2025 — multi-lembaga (Pemilu 2029 projection)
export const PARTY_POLLS_2025 = [
  {
    date: '2025-01', pollster: 'litbang_kompas', n: 1500,
    parties: { ger: 19.2, pdip: 17.8, gol: 9.5, pkb: 8.2, nas: 8.0, dem: 7.5, pks: 6.8, pan: 5.2, ppp: 2.1, psi: 2.3, lainnya: 13.4 },
  },
  {
    date: '2025-01', pollster: 'indikator', n: 1200,
    parties: { pdip: 18.0, ger: 14.0, gol: 13.0, pkb: 10.0, nas: 8.0, pks: 9.0, dem: 7.0, pan: 6.0, ppp: 2.2, psi: 2.8, lainnya: 10.0 },
  },
  {
    date: '2025-02', pollster: 'smrc', n: 1000,
    parties: { ger: 18.5, pdip: 16.2, gol: 10.1, pkb: 9.4, nas: 8.3, pks: 7.8, dem: 7.1, pan: 5.6, ppp: 2.0, psi: 2.5, lainnya: 12.5 },
  },
  {
    date: '2025-02', pollster: 'poltracking', n: 1200,
    parties: { ger: 20.1, pdip: 15.8, gol: 9.8, pkb: 9.1, nas: 8.5, pks: 7.2, dem: 6.8, pan: 5.1, ppp: 1.8, psi: 3.1, lainnya: 12.7 },
  },
  {
    date: '2025-03', pollster: 'lsi', n: 1000,
    parties: { pdip: 17.0, ger: 13.0, gol: 12.0, pkb: 11.0, nas: 8.0, pks: 10.0, dem: 7.0, pan: 6.0, ppp: 1.5, psi: 3.0, lainnya: 11.5 },
  },
  {
    date: '2025-03', pollster: 'charta', n: 1200,
    parties: { ger: 18.7, pdip: 16.5, gol: 11.2, pkb: 10.3, nas: 8.7, pks: 8.1, dem: 6.9, pan: 5.3, ppp: 1.9, psi: 2.8, lainnya: 9.6 },
  },
];

// Capres 2029 detailed polls (multi-lembaga, Q1 2025)
export const CAPRES_2029_POLLS = [
  {
    date: '2025-01', pollster: 'lsi', n: 1000,
    candidates: { prabowo: 50, anies: 19, dedi_mulyadi: 11, khofifah: 7, ridwan_kamil: 5, puan: 4, ahy: 2, cakimin: 2 },
  },
  {
    date: '2025-01', pollster: 'indikator', n: 1200,
    candidates: { prabowo: 48, anies: 20, dedi_mulyadi: 12, khofifah: 8, ridwan_kamil: 6, ganjar: 3, ahy: 3 },
  },
  {
    date: '2025-02', pollster: 'smrc', n: 1000,
    candidates: { prabowo: 34.5, anies: 19.2, ridwan_kamil: 12.8, ahy: 10.5, ganjar: 8.2, cakimin: 5.1, lainnya: 9.7 },
  },
  {
    date: '2025-02', pollster: 'charta', n: 1200,
    candidates: { prabowo: 47, anies: 21, dedi_mulyadi: 13, khofifah: 8, gibran: 5, ahy: 3, lainnya: 3 },
  },
  {
    date: '2025-03', pollster: 'median', n: 800,
    candidates: { prabowo: 45, anies: 22, dedi_mulyadi: 14, khofifah: 9, ridwan_kamil: 5, ahy: 3, lainnya: 2 },
  },
  {
    date: '2025-03', pollster: 'poltracking', n: 1200,
    candidates: { prabowo: 42, anies: 21, dedi_mulyadi: 15, khofifah: 10, ridwan_kamil: 6, ahy: 4, gibran: 2 },
  },
];

// Minister trust index — Q1 2025 (multi-source)
export const MINISTER_TRUST = [
  { person_id: 'sri_mulyani',   name: 'Sri Mulyani',           jabatan: 'Menkeu',             trust: 72, distrust: 12, source: 'Kompas Jan 2025' },
  { person_id: 'prabowo',       name: 'Prabowo Subianto',      jabatan: 'Presiden',            trust: 70, distrust: 21, source: 'Indikator Mar 2025' },
  { person_id: 'budi_gunadi',   name: 'Budi Gunadi Sadikin',   jabatan: 'Menkes',              trust: 61, distrust: 18, source: 'Kompas Jan 2025' },
  { person_id: 'erick_thohir',  name: 'Erick Thohir',          jabatan: 'Menteri BUMN',        trust: 58, distrust: 24, source: 'SMRC Jan 2025' },
  { person_id: 'ahy',           name: 'AHY',                   jabatan: 'Menko Infrastruktur', trust: 55, distrust: 22, source: 'Indikator Feb 2025' },
  { person_id: 'gibran',        name: 'Gibran Rakabuming',     jabatan: 'Wakil Presiden',      trust: 55, distrust: 30, source: 'SMRC Mar 2025' },
  { person_id: 'tito_karnavian',name: 'Tito Karnavian',        jabatan: 'Mendagri',            trust: 50, distrust: 25, source: 'Indikator Jan 2025' },
  { person_id: 'bahlil',        name: 'Bahlil Lahadalia',      jabatan: 'Menteri ESDM',        trust: 45, distrust: 32, source: 'Indikator Feb 2025' },
  { person_id: 'agus_gumiwang', name: 'Agus Gumiwang',         jabatan: 'Menperin',            trust: 42, distrust: 28, source: 'Populi Feb 2025' },
  { person_id: 'zulhas',        name: 'Zulkifli Hasan',        jabatan: 'Menko Pangan',        trust: 38, distrust: 35, source: 'SMRC Feb 2025' },
]

// Isu terpenting yang dihadapi masyarakat (issue tracker polls)
export const ISU_POLLS = [
  {
    date: '2025-01', pollster: 'lsi', n: 1000,
    isu: [
      { label: 'Harga Pangan',        persen: 48 },
      { label: 'Lapangan Kerja',      persen: 40 },
      { label: 'Korupsi',             persen: 29 },
      { label: 'Pendidikan',          persen: 25 },
      { label: 'Kesehatan',           persen: 23 },
      { label: 'Hutang Negara',       persen: 17 },
      { label: 'Infrastruktur',       persen: 14 },
    ],
  },
  {
    date: '2025-03', pollster: 'indikator', n: 1200,
    isu: [
      { label: 'Harga Pangan',        persen: 45 },
      { label: 'Lapangan Kerja',      persen: 38 },
      { label: 'Korupsi',             persen: 32 },
      { label: 'Pendidikan',          persen: 28 },
      { label: 'Kesehatan',           persen: 25 },
      { label: 'Infrastruktur',       persen: 18 },
      { label: 'Efisiensi Anggaran',  persen: 15 },
    ],
  },
];
