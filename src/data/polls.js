// Indonesian political electability surveys 2022–2025
// Sources: LSI Denny JA, Indikator Politik Indonesia, SMRC, Charta Politika, Median Research

export const POLLSTERS = [
  { id: 'lsi',          name: 'LSI Denny JA',                bias: 'tengah', reliability: 8 },
  { id: 'indikator',    name: 'Indikator Politik Indonesia',  bias: 'tengah', reliability: 9 },
  { id: 'smrc',         name: 'SMRC',                         bias: 'tengah', reliability: 8 },
  { id: 'charta',       name: 'Charta Politika',              bias: 'tengah', reliability: 8 },
  { id: 'median',       name: 'Median Research',              bias: 'tengah', reliability: 7 },
  { id: 'saifulmujani', name: 'Saiful Mujani Research',       bias: 'tengah', reliability: 9 },
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
