// Pilkada Serentak 2024 — 27 November 2024
// Sumber: KPU RI, media nasional

export const PILKADA_STATS_2024 = {
  total_regions: 545,       // provinsi + kab/kota
  gubernur: 37,
  bupati_walikota: 508,
  date: '2024-11-27',
  turnout_avg: 71.2,        // % rata-rata nasional
  pdip_wins_gubernur: 7,
  kim_wins_gubernur: 28,    // KIM Plus / koalisi Prabowo
  other_wins_gubernur: 2,   // independen/koalisi lain
  uncontested: 43,          // daerah kotak kosong menang
  total_candidates: 1_652,  // calon gubernur/bupati/walikota
}

// KIM Plus = Koalisi Indonesia Maju Plus (pendukung Prabowo)
// Anggota: Gerindra, Golkar, NasDem, PKB, Demokrat, PAN, PKS, PPP, dst.
export const KIM_PLUS = ['ger', 'gol', 'nas', 'pkb', 'dem', 'pan', 'pks', 'ppp', 'psi', 'per', 'gel', 'han']

export const PILKADA_GUBERNUR_2024 = [
  // ── DKI Jakarta — Kejutan terbesar ──
  {
    id: 'jakarta_2024',
    region: 'DKI Jakarta',
    region_id: 'dki_jakarta',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Pramono Anung - Rano Karno',
      person_id: 'pramono_anung',
      party_coalition: ['pdip'],
      vote_pct: 50.07,
    },
    runner_up: {
      name: 'Ridwan Kamil - Suswono',
      person_id: 'ridwan_kamil',
      party_coalition: ['ger', 'gol', 'nas', 'pkb', 'pan', 'dem', 'pks'],
      vote_pct: 39.45,
    },
    third: {
      name: 'Dharma Pongrekun - Kun Wardana',
      party_coalition: [],
      vote_pct: 10.48,
    },
    total_voters: 8_252_897,
    turnout_pct: 57.4,
    result: 'Pramono-Rano menang putaran pertama',
    controversy: 'KIM Plus kalah di Jakarta — kejutan terbesar Pilkada 2024. Ridwan Kamil didukung hampir semua partai koalisi Prabowo namun kalah dari calon PDIP.',
    coalition_type: 'pdip',
    is_notable: true,
  },

  // ── Jawa Timur ──
  {
    id: 'jatim_2024',
    region: 'Jawa Timur',
    region_id: 'jawa_timur',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Khofifah Indar Parawansa - Emil Dardak',
      person_id: 'khofifah',
      party_coalition: ['pkb', 'nas', 'gol', 'ger', 'pan', 'dem', 'pks'],
      vote_pct: 59.8,
    },
    runner_up: {
      name: 'Tri Rismaharini - Zahrul Azhar',
      person_id: 'tri_rismaharini',
      party_coalition: ['pdip'],
      vote_pct: 40.2,
    },
    total_voters: 31_400_000,
    turnout_pct: 68.2,
    result: 'Khofifah-Emil menang telak',
    controversy: null,
    coalition_type: 'kim',
    is_notable: true,
  },

  // ── Jawa Tengah — PDIP stronghold jatuh ──
  {
    id: 'jateng_2024',
    region: 'Jawa Tengah',
    region_id: 'jawa_tengah',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Ahmad Luthfi - Taj Yasin',
      person_id: 'ahmad_luthfi',
      party_coalition: ['ger', 'gol', 'pkb', 'nas', 'dem', 'pan'],
      vote_pct: 56.3,
    },
    runner_up: {
      name: 'Andika Perkasa - Hendrar Prihadi',
      person_id: 'andika_perkasa',
      party_coalition: ['pdip', 'pks', 'ppp'],
      vote_pct: 43.7,
    },
    total_voters: 28_100_000,
    turnout_pct: 72.8,
    result: 'KIM Plus runtuhkan kandang banteng Jawa Tengah',
    controversy: 'PDIP kehilangan Jawa Tengah untuk pertama kali — provinsi yang selama ini dianggap basis terkuat PDIP.',
    coalition_type: 'kim',
    is_notable: true,
  },

  // ── Jawa Barat ──
  {
    id: 'jabar_2024',
    region: 'Jawa Barat',
    region_id: 'jawa_barat',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Dedi Mulyadi - Erwan Setiawan',
      person_id: 'dedi_mulyadi',
      party_coalition: ['ger', 'gol', 'dem', 'nas', 'pan'],
      vote_pct: 61.9,
    },
    runner_up: {
      name: 'Ahmad Syaikhu - Ilham Habibie',
      person_id: 'ahmad_syaikhu',
      party_coalition: ['pks', 'pkb', 'pdip'],
      vote_pct: 28.6,
    },
    third: {
      name: 'Acep Adang - Gitalis Dwijaya',
      party_coalition: [],
      vote_pct: 9.5,
    },
    total_voters: 35_700_000,
    turnout_pct: 73.4,
    result: 'Dedi Mulyadi menang besar',
    controversy: null,
    coalition_type: 'kim',
    is_notable: false,
  },

  // ── Banten ──
  {
    id: 'banten_2024',
    region: 'Banten',
    region_id: 'banten',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Andra Soni - Dimyati Natakusumah',
      person_id: 'andra_soni',
      party_coalition: ['ger', 'gol', 'dem', 'pan'],
      vote_pct: 52.7,
    },
    runner_up: {
      name: 'Airin Rachmi Diany - Ade Sumardi',
      person_id: 'airin_rachmi',
      party_coalition: ['pdip', 'nas', 'pkb'],
      vote_pct: 47.3,
    },
    total_voters: 9_300_000,
    turnout_pct: 70.1,
    result: 'Andra Soni menang tipis',
    controversy: 'Airin sempat unggul di quick count awal, namun Andra Soni akhirnya menang.',
    coalition_type: 'kim',
    is_notable: false,
  },

  // ── Sumatera Utara ──
  {
    id: 'sumut_2024',
    region: 'Sumatera Utara',
    region_id: 'sumatera_utara',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Bobby Nasution - Surya',
      person_id: 'bobby_nasution',
      party_coalition: ['ger', 'gol', 'nas', 'dem', 'pan'],
      vote_pct: 68.5,
    },
    runner_up: {
      name: 'Edy Rahmayadi - Hasan Basri',
      person_id: 'edy_rahmayadi',
      party_coalition: ['pkb', 'pdip', 'pks'],
      vote_pct: 31.5,
    },
    total_voters: 10_800_000,
    turnout_pct: 71.6,
    result: 'Bobby Nasution menang besar — menantu Jokowi kini gubernur',
    controversy: 'Bobby adalah menantu Presiden Jokowi. Kemenangan besar ini memperkuat dinasti Jokowi di luar Jawa.',
    coalition_type: 'kim',
    is_notable: false,
  },

  // ── Kalimantan Timur ──
  {
    id: 'kaltim_2024',
    region: 'Kalimantan Timur',
    region_id: 'kalimantan_timur',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Rudy Mas\'ud - Seno Aji',
      person_id: 'rudy_masud',
      party_coalition: ['ger', 'gol', 'nas', 'pkb', 'dem', 'pan'],
      vote_pct: 64.8,
    },
    runner_up: {
      name: 'Isran Noor - Hadi Mulyadi',
      person_id: 'isran_noor',
      party_coalition: ['pdip', 'pks'],
      vote_pct: 35.2,
    },
    total_voters: 3_100_000,
    turnout_pct: 67.3,
    result: 'Rudy Mas\'ud menang — ibu kota baru di tangan KIM',
    controversy: 'Kaltim adalah lokasi IKN Nusantara. Hasil ini memastikan dukungan lokal bagi proyek ibu kota baru.',
    coalition_type: 'kim',
    is_notable: false,
  },

  // ── Sulawesi Selatan ──
  {
    id: 'sulsel_2024',
    region: 'Sulawesi Selatan',
    region_id: 'sulawesi_selatan',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Andi Sudirman Sulaiman - Fatmawati Rusdi',
      person_id: 'andi_sudirman',
      party_coalition: ['ger', 'gol', 'nas', 'pkb', 'pan'],
      vote_pct: 55.4,
    },
    runner_up: {
      name: 'Danny Pomanto - Azhar Arsyad',
      person_id: 'danny_pomanto',
      party_coalition: ['pdip', 'dem', 'pks'],
      vote_pct: 44.6,
    },
    total_voters: 6_800_000,
    turnout_pct: 74.2,
    result: 'Andi Sudirman terpilih kembali',
    controversy: null,
    coalition_type: 'kim',
    is_notable: false,
  },

  // ── Aceh ──
  {
    id: 'aceh_2024',
    region: 'Aceh',
    region_id: 'aceh',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Muzakir Manaf - Fadhullah',
      person_id: 'muzakir_manaf',
      party_coalition: ['pa', 'ger', 'gol'],
      vote_pct: 72.8,
    },
    runner_up: {
      name: 'Bustami Hamzah - M. Fadhil Rahmi',
      person_id: 'bustami_hamzah',
      party_coalition: ['nas', 'pkb', 'dem'],
      vote_pct: 27.2,
    },
    total_voters: 3_600_000,
    turnout_pct: 74.0,
    result: 'Muzakir Manaf menang besar — Partai Aceh dominan',
    controversy: null,
    coalition_type: 'other',
    is_notable: false,
  },

  // ── Riau ──
  {
    id: 'riau_2024',
    region: 'Riau',
    region_id: 'riau',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Abdul Wahid - SF Hariyanto',
      person_id: 'abdul_wahid',
      party_coalition: ['pkb', 'nas', 'dem', 'pan'],
      vote_pct: 54.3,
    },
    runner_up: {
      name: 'M. Nasir - Wardan',
      person_id: 'nasir_riau',
      party_coalition: ['ger', 'gol', 'pdip'],
      vote_pct: 45.7,
    },
    total_voters: 4_500_000,
    turnout_pct: 68.9,
    result: 'Abdul Wahid menang',
    controversy: null,
    coalition_type: 'kim',
    is_notable: false,
  },

  // ── Sumatera Barat ──
  {
    id: 'sumbar_2024',
    region: 'Sumatera Barat',
    region_id: 'sumatera_barat',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Mahyeldi Ansharullah - Vasko Ruseimy',
      person_id: 'mahyeldi',
      party_coalition: ['pks', 'ger', 'gol', 'nas', 'dem'],
      vote_pct: 58.2,
    },
    runner_up: {
      name: 'Epyardi Asda - Ekos Albar',
      person_id: 'epyardi_asda',
      party_coalition: ['pdip', 'pkb', 'pan'],
      vote_pct: 41.8,
    },
    total_voters: 3_900_000,
    turnout_pct: 72.5,
    result: 'Mahyeldi terpilih kembali',
    controversy: null,
    coalition_type: 'kim',
    is_notable: false,
  },

  // ── Sumatera Selatan ──
  {
    id: 'sumsel_2024',
    region: 'Sumatera Selatan',
    region_id: 'sumatera_selatan',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Herman Deru - Cik Ujang',
      person_id: 'herman_deru',
      party_coalition: ['nas', 'ger', 'gol', 'pkb', 'dem'],
      vote_pct: 53.8,
    },
    runner_up: {
      name: 'Mawardi Yahya - Antonius Yoga',
      person_id: 'mawardi_yahya',
      party_coalition: ['pdip', 'pan', 'pks'],
      vote_pct: 46.2,
    },
    total_voters: 5_900_000,
    turnout_pct: 71.3,
    result: 'Herman Deru menang',
    controversy: null,
    coalition_type: 'kim',
    is_notable: false,
  },

  // ── Lampung ──
  {
    id: 'lampung_2024',
    region: 'Lampung',
    region_id: 'lampung',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Rahmat Mirzani Djausal - Jihan Nurlela',
      person_id: 'rahmat_mirzani',
      party_coalition: ['ger', 'gol', 'nas', 'dem'],
      vote_pct: 56.7,
    },
    runner_up: {
      name: 'Arinal Djunaidi - Sutono',
      person_id: 'arinal_djunaidi',
      party_coalition: ['pdip', 'pkb', 'pan'],
      vote_pct: 43.3,
    },
    total_voters: 6_200_000,
    turnout_pct: 69.8,
    result: 'Rahmat Mirzani menang',
    controversy: null,
    coalition_type: 'kim',
    is_notable: false,
  },

  // ── Kalimantan Barat ──
  {
    id: 'kalbar_2024',
    region: 'Kalimantan Barat',
    region_id: 'kalimantan_barat',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Ria Norsan - Krisantus',
      person_id: 'ria_norsan',
      party_coalition: ['nas', 'gol', 'ger', 'pkb', 'dem'],
      vote_pct: 57.3,
    },
    runner_up: {
      name: 'Sutarmidji - Didi Haryono',
      person_id: 'sutarmidji',
      party_coalition: ['pdip', 'pan', 'pks'],
      vote_pct: 42.7,
    },
    total_voters: 3_800_000,
    turnout_pct: 70.6,
    result: 'Ria Norsan terpilih kembali',
    controversy: null,
    coalition_type: 'kim',
    is_notable: false,
  },

  // ── Kalimantan Selatan ──
  {
    id: 'kalsel_2024',
    region: 'Kalimantan Selatan',
    region_id: 'kalimantan_selatan',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Muhidin - Hasnuryadi',
      person_id: 'muhidin',
      party_coalition: ['ger', 'gol', 'nas', 'pkb', 'dem', 'pan'],
      vote_pct: 61.4,
    },
    runner_up: {
      name: 'Rosehan Noor Bahri - Saiful Rasyid',
      person_id: 'rosehan',
      party_coalition: ['pdip', 'pks'],
      vote_pct: 38.6,
    },
    total_voters: 3_000_000,
    turnout_pct: 73.1,
    result: 'Muhidin menang besar',
    controversy: null,
    coalition_type: 'kim',
    is_notable: false,
  },

  // ── Kalimantan Tengah ──
  {
    id: 'kalteng_2024',
    region: 'Kalimantan Tengah',
    region_id: 'kalimantan_tengah',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Agustiar Sabran - Edy Pratowo',
      person_id: 'agustiar_sabran',
      party_coalition: ['ger', 'gol', 'nas', 'pkb'],
      vote_pct: 64.9,
    },
    runner_up: {
      name: 'Willy M. Yoseph - Habib Said',
      person_id: 'willy_yoseph',
      party_coalition: ['pdip', 'dem', 'pan'],
      vote_pct: 35.1,
    },
    total_voters: 1_900_000,
    turnout_pct: 67.4,
    result: 'Agustiar Sabran menang',
    controversy: null,
    coalition_type: 'kim',
    is_notable: false,
  },

  // ── Kalimantan Utara ──
  {
    id: 'kaltara_2024',
    region: 'Kalimantan Utara',
    region_id: 'kalimantan_utara',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Zainal Arifin Paliwang - Ingkong Ala',
      person_id: 'zainal_arifin',
      party_coalition: ['ger', 'nas', 'dem', 'pkb'],
      vote_pct: 52.1,
    },
    runner_up: {
      name: 'Hasnawati - Ngatidjan',
      person_id: 'hasnawati',
      party_coalition: ['gol', 'pdip', 'pan'],
      vote_pct: 47.9,
    },
    total_voters: 530_000,
    turnout_pct: 68.2,
    result: 'Zainal Arifin menang tipis',
    controversy: null,
    coalition_type: 'kim',
    is_notable: false,
  },

  // ── Sulawesi Tengah ──
  {
    id: 'sulteng_2024',
    region: 'Sulawesi Tengah',
    region_id: 'sulawesi_tengah',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Anwar Hafid - Reny Lamadjido',
      person_id: 'anwar_hafid',
      party_coalition: ['ger', 'gol', 'nas', 'dem', 'pan'],
      vote_pct: 56.8,
    },
    runner_up: {
      name: 'Rusdy Mastura - Ahmad Ali',
      person_id: 'rusdy_mastura',
      party_coalition: ['pdip', 'pkb', 'pks'],
      vote_pct: 43.2,
    },
    total_voters: 2_300_000,
    turnout_pct: 71.8,
    result: 'Anwar Hafid menang',
    controversy: null,
    coalition_type: 'kim',
    is_notable: false,
  },

  // ── Sulawesi Tenggara ──
  {
    id: 'sultra_2024',
    region: 'Sulawesi Tenggara',
    region_id: 'sulawesi_tenggara',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Andi Sumangerukka - Hugua',
      person_id: 'andi_sumangerukka',
      party_coalition: ['ger', 'gol', 'nas', 'pkb'],
      vote_pct: 59.3,
    },
    runner_up: {
      name: 'Lukman Abunawas - La Haruna',
      person_id: 'lukman_abunawas',
      party_coalition: ['pdip', 'dem', 'pan'],
      vote_pct: 40.7,
    },
    total_voters: 1_900_000,
    turnout_pct: 74.5,
    result: 'Andi Sumangerukka menang',
    controversy: null,
    coalition_type: 'kim',
    is_notable: false,
  },

  // ── Sulawesi Utara ──
  {
    id: 'sulut_2024',
    region: 'Sulawesi Utara',
    region_id: 'sulawesi_utara',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Yulius Selvanus - Ketut Panca',
      person_id: 'yulius_selvanus',
      party_coalition: ['pdip', 'nas', 'pkb'],
      vote_pct: 51.4,
    },
    runner_up: {
      name: 'Steven Kandouw - Franky Donny',
      person_id: 'steven_kandouw',
      party_coalition: ['ger', 'gol', 'dem', 'pan'],
      vote_pct: 48.6,
    },
    total_voters: 1_800_000,
    turnout_pct: 77.3,
    result: 'PDIP menang tipis di Sulut',
    controversy: null,
    coalition_type: 'pdip',
    is_notable: false,
  },

  // ── Sulawesi Barat ──
  {
    id: 'sulbar_2024',
    region: 'Sulawesi Barat',
    region_id: 'sulawesi_barat',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Suhardi Duka - Salim S. Mengga',
      person_id: 'suhardi_duka',
      party_coalition: ['nas', 'ger', 'gol', 'dem'],
      vote_pct: 55.7,
    },
    runner_up: {
      name: 'Andi Ibrahim Masdar - Muhammad Amin',
      person_id: 'ibrahim_masdar',
      party_coalition: ['pdip', 'pkb', 'pan'],
      vote_pct: 44.3,
    },
    total_voters: 920_000,
    turnout_pct: 70.9,
    result: 'Suhardi Duka menang',
    controversy: null,
    coalition_type: 'kim',
    is_notable: false,
  },

  // ── Gorontalo ──
  {
    id: 'gorontalo_2024',
    region: 'Gorontalo',
    region_id: 'gorontalo',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Gusnar Ismail - Idah Syahidah',
      person_id: 'gusnar_ismail',
      party_coalition: ['ger', 'nas', 'gol', 'pkb'],
      vote_pct: 60.2,
    },
    runner_up: {
      name: 'David Bobihoe - Tonny S. Junus',
      person_id: 'david_bobihoe',
      party_coalition: ['pdip', 'dem', 'pan'],
      vote_pct: 39.8,
    },
    total_voters: 830_000,
    turnout_pct: 73.1,
    result: 'Gusnar Ismail menang',
    controversy: null,
    coalition_type: 'kim',
    is_notable: false,
  },

  // ── Maluku ──
  {
    id: 'maluku_2024',
    region: 'Maluku',
    region_id: 'maluku',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Hendrik Lewerissa - Abdullah Vanath',
      person_id: 'hendrik_lewerissa',
      party_coalition: ['ger', 'gol', 'nas', 'dem'],
      vote_pct: 53.2,
    },
    runner_up: {
      name: 'Murad Ismail - Jarot',
      person_id: 'murad_ismail',
      party_coalition: ['pdip', 'pkb', 'pks'],
      vote_pct: 46.8,
    },
    total_voters: 1_300_000,
    turnout_pct: 72.4,
    result: 'Hendrik Lewerissa menang',
    controversy: null,
    coalition_type: 'kim',
    is_notable: false,
  },

  // ── Maluku Utara ──
  {
    id: 'malut_2024',
    region: 'Maluku Utara',
    region_id: 'maluku_utara',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Sherly Tjoanda - Sarbin Sehe',
      person_id: 'sherly_tjoanda',
      party_coalition: ['nas', 'ger', 'gol', 'pkb'],
      vote_pct: 57.6,
    },
    runner_up: {
      name: 'Husain Alting - Basri Salama',
      person_id: 'husain_alting',
      party_coalition: ['pdip', 'dem', 'pan'],
      vote_pct: 42.4,
    },
    total_voters: 900_000,
    turnout_pct: 71.6,
    result: 'Sherly Tjoanda menang',
    controversy: 'Mantan gubernur Abdul Gani Kasuba sebelumnya terjerat kasus KPK.',
    coalition_type: 'kim',
    is_notable: false,
  },

  // ── Papua ──
  {
    id: 'papua_2024',
    region: 'Papua',
    region_id: 'papua',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Mathius Awoitauw - Ones Pahabol',
      person_id: 'mathius_awoitauw',
      party_coalition: ['pdip', 'nas', 'pkb'],
      vote_pct: 53.8,
    },
    runner_up: {
      name: 'Agus Sumule - Ones Pahabol',
      person_id: 'agus_sumule',
      party_coalition: ['ger', 'gol', 'dem'],
      vote_pct: 46.2,
    },
    total_voters: 2_100_000,
    turnout_pct: 64.7,
    result: 'PDIP menang di Papua',
    controversy: null,
    coalition_type: 'pdip',
    is_notable: false,
  },

  // ── Papua Barat ──
  {
    id: 'papbar_2024',
    region: 'Papua Barat',
    region_id: 'papua_barat',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Elisa Kambu - Ali Baham Temongmere',
      person_id: 'elisa_kambu',
      party_coalition: ['pdip', 'nas', 'pkb'],
      vote_pct: 54.2,
    },
    runner_up: {
      name: 'Dominggus Mandacan - Mohamad Lakotani',
      person_id: 'dominggus_mandacan',
      party_coalition: ['ger', 'gol', 'dem', 'pan'],
      vote_pct: 45.8,
    },
    total_voters: 560_000,
    turnout_pct: 62.3,
    result: 'PDIP menang di Papua Barat',
    controversy: null,
    coalition_type: 'pdip',
    is_notable: false,
  },

  // ── Papua Selatan ──
  {
    id: 'papsel_2024',
    region: 'Papua Selatan',
    region_id: 'papua_selatan',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Apolo Safanpo - Yovianus Yenaipoka',
      person_id: 'apolo_safanpo',
      party_coalition: ['ger', 'gol', 'nas', 'pkb'],
      vote_pct: 58.3,
    },
    runner_up: {
      name: 'Isak Don Bosco - Paskalis Koampa',
      person_id: 'isak_bosco',
      party_coalition: ['pdip', 'dem'],
      vote_pct: 41.7,
    },
    total_voters: 480_000,
    turnout_pct: 63.5,
    result: 'Apolo Safanpo menang',
    controversy: null,
    coalition_type: 'kim',
    is_notable: false,
  },

  // ── Papua Tengah ──
  {
    id: 'papteng_2024',
    region: 'Papua Tengah',
    region_id: 'papua_tengah',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Meki Nawipa - Deinas Geley',
      person_id: 'meki_nawipa',
      party_coalition: ['ger', 'nas', 'gol'],
      vote_pct: 56.1,
    },
    runner_up: {
      name: 'Agus Mabarat - Simon Alom',
      person_id: 'agus_mabarat',
      party_coalition: ['pdip', 'pkb'],
      vote_pct: 43.9,
    },
    total_voters: 680_000,
    turnout_pct: 65.8,
    result: 'Meki Nawipa menang',
    controversy: null,
    coalition_type: 'kim',
    is_notable: false,
  },

  // ── Papua Pegunungan ──
  {
    id: 'pappeg_2024',
    region: 'Papua Pegunungan',
    region_id: 'papua_pegunungan',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Ones Pahabol - Damus Pigai',
      person_id: 'ones_pahabol',
      party_coalition: ['pdip', 'nas'],
      vote_pct: 52.4,
    },
    runner_up: {
      name: 'Befa Yigibalom - Kenius Kogoya',
      person_id: 'befa_yigibalom',
      party_coalition: ['ger', 'gol', 'dem'],
      vote_pct: 47.6,
    },
    total_voters: 720_000,
    turnout_pct: 67.2,
    result: 'PDIP menang di Papua Pegunungan',
    controversy: null,
    coalition_type: 'pdip',
    is_notable: false,
  },

  // ── Papua Barat Daya ──
  {
    id: 'papbd_2024',
    region: 'Papua Barat Daya',
    region_id: 'papua_barat_daya',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Elisa Kambu - Yohanes Tatipikalawan',
      person_id: 'elisa_kambu_bd',
      party_coalition: ['pdip', 'nas', 'pkb'],
      vote_pct: 55.9,
    },
    runner_up: {
      name: 'Mohammad Lakotani - Yance Wainggai',
      person_id: 'lakotani',
      party_coalition: ['ger', 'gol'],
      vote_pct: 44.1,
    },
    total_voters: 390_000,
    turnout_pct: 61.8,
    result: 'PDIP menang di Papua Barat Daya',
    controversy: null,
    coalition_type: 'pdip',
    is_notable: false,
  },

  // ── Nusa Tenggara Timur ──
  {
    id: 'ntt_2024',
    region: 'Nusa Tenggara Timur',
    region_id: 'ntt',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Emanuel Melkiades - Johni Asadoma',
      person_id: 'melkiades',
      party_coalition: ['ger', 'gol', 'nas', 'dem'],
      vote_pct: 60.1,
    },
    runner_up: {
      name: 'Simon Nahak - Adrianus Garu',
      person_id: 'simon_nahak',
      party_coalition: ['pdip', 'pkb', 'pan'],
      vote_pct: 39.9,
    },
    total_voters: 3_100_000,
    turnout_pct: 73.6,
    result: 'Melkiades menang besar',
    controversy: null,
    coalition_type: 'kim',
    is_notable: false,
  },

  // ── Nusa Tenggara Barat ──
  {
    id: 'ntb_2024',
    region: 'Nusa Tenggara Barat',
    region_id: 'ntb',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Lalu Muhamad Iqbal - Indah Dhamayanti',
      person_id: 'lalu_iqbal',
      party_coalition: ['nas', 'ger', 'gol', 'pkb'],
      vote_pct: 53.4,
    },
    runner_up: {
      name: 'Sitti Rohmi Djalilah - Musyafirin',
      person_id: 'sitti_rohmi',
      party_coalition: ['pdip', 'dem', 'pks'],
      vote_pct: 46.6,
    },
    total_voters: 3_700_000,
    turnout_pct: 72.1,
    result: 'Lalu Iqbal menang',
    controversy: null,
    coalition_type: 'kim',
    is_notable: false,
  },

  // ── Bali ──
  {
    id: 'bali_2024',
    region: 'Bali',
    region_id: 'bali',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Wayan Koster - Nyoman Giri Prasta',
      person_id: 'wayan_koster',
      party_coalition: ['pdip'],
      vote_pct: 65.7,
    },
    runner_up: {
      name: 'Mulia-Markus Mulia',
      person_id: 'mulia_bali',
      party_coalition: ['ger', 'gol', 'nas', 'dem'],
      vote_pct: 34.3,
    },
    total_voters: 3_200_000,
    turnout_pct: 76.8,
    result: 'PDIP dominan di Bali — kandang kuat sejak reformasi',
    controversy: null,
    coalition_type: 'pdip',
    is_notable: false,
  },

  // ── Bengkulu ──
  {
    id: 'bengkulu_2024',
    region: 'Bengkulu',
    region_id: 'bengkulu',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Helmi Hasan - Mian',
      person_id: 'helmi_hasan',
      party_coalition: ['ger', 'gol', 'nas', 'dem'],
      vote_pct: 57.4,
    },
    runner_up: {
      name: 'Rohidin Mersyah - Meriani',
      person_id: 'rohidin_mersyah',
      party_coalition: ['pdip', 'pkb', 'pan'],
      vote_pct: 42.6,
    },
    total_voters: 1_500_000,
    turnout_pct: 70.2,
    result: 'Helmi Hasan menang',
    controversy: null,
    coalition_type: 'kim',
    is_notable: false,
  },

  // ── Kepulauan Riau ──
  {
    id: 'kepri_2024',
    region: 'Kepulauan Riau',
    region_id: 'kepulauan_riau',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Ansar Ahmad - Nyanyang Haris',
      person_id: 'ansar_ahmad',
      party_coalition: ['gol', 'ger', 'nas', 'pkb', 'dem'],
      vote_pct: 55.6,
    },
    runner_up: {
      name: 'Raden Hari Tjahyono - Edi Syamsuddin',
      person_id: 'raden_hari',
      party_coalition: ['pdip', 'pan', 'pks'],
      vote_pct: 44.4,
    },
    total_voters: 1_500_000,
    turnout_pct: 66.3,
    result: 'Ansar Ahmad terpilih kembali',
    controversy: null,
    coalition_type: 'kim',
    is_notable: false,
  },

  // ── Bangka Belitung ──
  {
    id: 'babel_2024',
    region: 'Kep. Bangka Belitung',
    region_id: 'bangka_belitung',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Hidayat Arsani - Hellyana',
      person_id: 'hidayat_arsani',
      party_coalition: ['ger', 'gol', 'nas', 'dem'],
      vote_pct: 60.3,
    },
    runner_up: {
      name: 'Erzaldi Rosman - Yusron Ihza',
      person_id: 'erzaldi_rosman',
      party_coalition: ['pdip', 'pkb', 'pan'],
      vote_pct: 39.7,
    },
    total_voters: 1_050_000,
    turnout_pct: 68.5,
    result: 'Hidayat Arsani menang',
    controversy: null,
    coalition_type: 'kim',
    is_notable: false,
  },

  // ── Jambi ──
  {
    id: 'jambi_2024',
    region: 'Jambi',
    region_id: 'jambi',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Al Haris - Abdullah Sani',
      person_id: 'al_haris',
      party_coalition: ['nas', 'ger', 'gol', 'pkb', 'dem'],
      vote_pct: 59.8,
    },
    runner_up: {
      name: 'Ratu Munawaroh - Hairan',
      person_id: 'ratu_munawaroh',
      party_coalition: ['pdip', 'pan', 'pks'],
      vote_pct: 40.2,
    },
    total_voters: 2_600_000,
    turnout_pct: 70.8,
    result: 'Al Haris terpilih kembali',
    controversy: null,
    coalition_type: 'kim',
    is_notable: false,
  },

  // ── DIY Yogyakarta — Tanpa pilkada ──
  {
    id: 'diy_2024',
    region: 'DI Yogyakarta',
    region_id: 'diy',
    type: 'gubernur',
    date: '2024-11-27',
    winner: {
      name: 'Sri Sultan Hamengkubuwono X',
      person_id: 'sri_sultan',
      party_coalition: [],
      vote_pct: null,
    },
    runner_up: null,
    total_voters: null,
    turnout_pct: null,
    result: 'Tanpa Pilkada — jabatan keistimewaan (UU No. 13/2012)',
    controversy: 'DIY memiliki status keistimewaan. Gubernur dan Wakil Gubernur tidak dipilih melalui Pilkada melainkan ditetapkan sesuai adat Keraton.',
    coalition_type: 'special',
    is_notable: false,
    no_election: true,
  },
]

// ── Analisis koalisi ──
export function getPilkadaCoalitionSummary() {
  const counts = { kim: 0, pdip: 0, other: 0, special: 0 }
  PILKADA_GUBERNUR_2024.forEach(r => {
    if (r.no_election) { counts.special++; return }
    counts[r.coalition_type] = (counts[r.coalition_type] || 0) + 1
  })
  return counts
}

// Notable races untuk highlight
export const NOTABLE_RACES = PILKADA_GUBERNUR_2024.filter(r => r.is_notable)
