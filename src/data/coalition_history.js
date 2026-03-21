export const COALITION_ERAS = [
  {
    election: 'Pilpres 2004',
    winner: 'SBY-JK',
    winner_ids: ['sby'],
    coalition: {
      name: 'Koalisi Kerakyatan',
      parties: ['dem','pks','pkb','pan','ppb'],
      seats: 305,
      notes: 'SBY menang lawan Megawati (PDIP) dalam putaran kedua. Demokrat baru berdiri, PKS kejutan raih 45 kursi.'
    },
    opposition: {
      name: 'PDIP + Golkar',
      parties: ['pdip','gol'],
      notes: 'Megawati-Hasyim Muzadi kalah 39.4% vs 60.6%'
    },
    key_event: 'Pertama kali Pilpres langsung. SBY memecah format koalisi besar.',
  },
  {
    election: 'Pilpres 2009',
    winner: 'SBY-Boediono',
    winner_ids: ['sby'],
    coalition: {
      name: 'Setgab Koalisi',
      parties: ['dem','gol','pkb','pan','pks','ppp'],
      seats: 423,
      notes: 'SBY menang satu putaran 60.8%. Demokrat raih 26.4% — puncak kejayaan.'
    },
    opposition: {
      name: 'PDIP + Gerindra',
      parties: ['pdip','ger'],
      notes: 'Mega-Prabowo 26.8%. Prabowo mulai relevansi nasional.'
    },
    key_event: 'Prabowo pertama kali maju di Pilpres sebagai cawapres. Demokrat di puncak.',
  },
  {
    election: 'Pilpres 2014',
    winner: 'Jokowi-JK',
    winner_ids: ['jokowi'],
    coalition: {
      name: 'Koalisi Indonesia Hebat',
      parties: ['pdip','nas','pkb','pkp','hanura'],
      seats: 207,
      notes: 'Jokowi menang 53.2% vs Prabowo. Koalisi kecil tapi menang. NasDem baru masuk DPR.'
    },
    opposition: {
      name: 'Koalisi Merah Putih (KMP)',
      parties: ['ger','gol','pan','ppp','pkb','dem'],
      notes: 'Prabowo-Hatta 46.9%. KMP kuasai DPR tapi kalah Pilpres.'
    },
    key_event: 'Drama Koalisi Merah Putih kuasai DPR tapi Jokowi tetap jadi Presiden. Golkar pecah.',
  },
  {
    election: 'Pilpres 2019',
    winner: 'Jokowi-Ma\'ruf',
    winner_ids: ['jokowi'],
    coalition: {
      name: 'Koalisi Indonesia Kerja',
      parties: ['pdip','gol','pkb','nas','ppp','ppb','hanura','psi'],
      seats: 347,
      notes: 'Jokowi-Ma\'ruf 55.5%. Golkar balik dukung Jokowi setelah 2014.'
    },
    opposition: {
      name: 'Koalisi Adil Makmur',
      parties: ['ger','dem','pan','pks','pkb_pecahan'],
      notes: 'Prabowo-Sandi 44.5%. Sengketa hasil diajukan ke MK, ditolak.'
    },
    key_event: 'Pasca-pilpres Prabowo masuk kabinet Jokowi sebagai Menhan. Koalisi nasional.',
  },
  {
    election: 'Pilpres 2024',
    winner: 'Prabowo-Gibran',
    winner_ids: ['prabowo', 'gibran'],
    coalition: {
      name: 'Koalisi Indonesia Maju (KIM Plus)',
      parties: ['ger','gol','nas','pan','dem','pks','pbb','pkb'],
      seats: 421,
      notes: 'Prabowo menang satu putaran 58.59%. PKS bergabung koalisi meski awalnya oposisi.'
    },
    opposition: {
      name: 'PDIP (satu-satunya oposisi)',
      parties: ['pdip'],
      notes: 'PDIP oposisi sendirian setelah NasDem, PKB, PKS bergabung pemerintah. 110 kursi DPR.'
    },
    key_event: 'Kontroversi MK No. 90/2023 — Anwar Usman ubah batas usia untuk Gibran. Demo besar "Peringatan Darurat".',
  },
]
