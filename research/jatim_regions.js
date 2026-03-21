// research/jatim_regions.js
// All 38 Kabupaten/Kota in Jawa Timur with current officials
// Sources: Wikipedia East Java, List of Regencies and Cities, various regional election results
// NOTE: Some bupati/walikota names are post-2024 Pilkada winners installed Feb 2025.
// Many positions are still being finalized — mark uncertain ones with dataConfidence: "medium"

export const jatimRegions = [
  // === KABUPATEN (29) ===
  {
    name: "Kabupaten Bangkalan",
    type: "kabupaten",
    capital: "Bangkalan",
    island: "Madura",
    bupati: "Abdul Latif Amin Imron",
    bupatiParty: "PKB",
    notes: "Madura island. Historically PKB stronghold. Son of Ra Latif (previous bupati). Strong pesantren culture.",
    dataConfidence: "medium"
  },
  {
    name: "Kabupaten Banyuwangi",
    type: "kabupaten",
    capital: "Banyuwangi",
    bupati: "Ipuk Fiestiandani",
    bupatiParty: "PDI-P",
    notes: "Tourism hub (Ijen crater, Banyuwangi festival). Coffee/cacao plantations. Former bupati Abdullah Azwar Anas became Mayor of Surabaya? No — Azwar Anas became Coordinating Minister candidate. Ipuk is wife of Azwar Anas.",
    dataConfidence: "medium"
  },
  {
    name: "Kabupaten Blitar",
    type: "kabupaten",
    capital: "Kanigoro",
    bupati: "Rini Syarifah",
    bupatiParty: "PKB",
    notes: "Agricultural. Near Sukarno's tomb (in Blitar city). PKB area.",
    dataConfidence: "medium"
  },
  {
    name: "Kabupaten Bojonegoro",
    type: "kabupaten",
    capital: "Bojonegoro",
    bupati: "Teguh Haryono",
    bupatiParty: "PKB",
    notes: "Oil and gas area (Cepu block). Teak forest. Agriculture.",
    dataConfidence: "medium"
  },
  {
    name: "Kabupaten Bondowoso",
    type: "kabupaten",
    capital: "Bondowoso",
    bupati: "Salwa Arifin",
    bupatiParty: "PKB",
    notes: "Tobacco and coffee production. NU-PKB stronghold.",
    dataConfidence: "medium"
  },
  {
    name: "Kabupaten Gresik",
    type: "kabupaten",
    capital: "Gresik",
    bupati: "Fandi Akhmad Yani",
    bupatiParty: "PDI-P/Golkar",
    notes: "Industrial (PT Petrokimia Gresik, PT Semen Indonesia). Adjacent to Surabaya. Son of former bupati Sambari Halim Radianto.",
    dataConfidence: "medium"
  },
  {
    name: "Kabupaten Jember",
    type: "kabupaten",
    capital: "Jember",
    bupati: "Hendy Siswanto",
    bupatiParty: "PDI-P",
    notes: "Major tobacco and coffee producing regency. University town (Universitas Jember). Tourism (Papuma beach, Jember Fashion Carnival).",
    dataConfidence: "medium"
  },
  {
    name: "Kabupaten Jombang",
    type: "kabupaten",
    capital: "Jombang",
    bupati: "Mundjidah Wahab",
    bupatiParty: "PKB",
    notes: "NU HEARTLAND — home of Hasyim Asy'ari (NU founder), Abdurrahman Wahid family. Pesantren Tebuireng, Pesantren Bahrul Ulum. Birth city of Muhaimin Iskandar. Extremely strong PKB.",
    dataConfidence: "medium"
  },
  {
    name: "Kabupaten Kediri",
    type: "kabupaten",
    capital: "Pare (Kediri)",
    bupati: "Hanindhito Himawan Pramana",
    bupatiParty: "PDI-P",
    notes: "Hanindhito (Mas Dhito) was considered for 2024 Jatim Pilgub candidate. PT Gudang Garam (kretek cigarette giant) based here. Agricultural.",
    dataConfidence: "high"
  },
  {
    name: "Kabupaten Lamongan",
    type: "kabupaten",
    capital: "Lamongan",
    bupati: "Yuhronur Efendi",
    bupatiParty: "PKB",
    notes: "Fishing/coastal. Traditional PKB area.",
    dataConfidence: "medium"
  },
  {
    name: "Kabupaten Lumajang",
    type: "kabupaten",
    capital: "Lumajang",
    bupati: "Thoriqul Haq",
    bupatiParty: "PKB",
    notes: "Near Mt Semeru. Coffee, banana. Thoriqul Haq was also considered for 2024 Pilgub.",
    dataConfidence: "medium"
  },
  {
    name: "Kabupaten Madiun",
    type: "kabupaten",
    capital: "Mejayan",
    bupati: "Ahmad Dawami Ragil Saputro",
    bupatiParty: "PDI-P",
    notes: "Agricultural. Near Madiun city (PT INKA train manufacturer).",
    dataConfidence: "medium"
  },
  {
    name: "Kabupaten Magetan",
    type: "kabupaten",
    capital: "Magetan",
    bupati: "Suprawoto",
    bupatiParty: "PDI-P",
    notes: "High altitude agriculture. Leather goods industry.",
    dataConfidence: "medium"
  },
  {
    name: "Kabupaten Malang",
    type: "kabupaten",
    capital: "Kepanjen",
    bupati: "Sanusi",
    bupatiParty: "Gerindra",
    notes: "WARNING: Bupati Sanusi (Gerindra) was convicted by KPK in 2020 for APBD corruption. Re-elected despite conviction or served partial term. Verify current status. Large regency surrounding Malang city.",
    korrupsiFlag: true,
    kpkNote: "KPK convicted, sentenced 6 years 2020",
    dataConfidence: "medium"
  },
  {
    name: "Kabupaten Mojokerto",
    type: "kabupaten",
    capital: "Mojosari",
    bupati: "Muhammad Al Barra",
    bupatiParty: "PKB",
    notes: "Industrial area near Surabaya. Mojopahit Kingdom historical area.",
    dataConfidence: "medium"
  },
  {
    name: "Kabupaten Nganjuk",
    type: "kabupaten",
    capital: "Nganjuk",
    bupati: "Marhaen Djumadi",
    bupatiParty: "PKB",
    notes: "Agricultural. Onion production center.",
    dataConfidence: "medium"
  },
  {
    name: "Kabupaten Ngawi",
    type: "kabupaten",
    capital: "Ngawi",
    bupati: "Ony Anwar Harsono",
    bupatiParty: "PDI-P",
    notes: "Rice farming. Border with Central Java. Archaeological significance (Homo erectus fossils).",
    dataConfidence: "medium"
  },
  {
    name: "Kabupaten Pacitan",
    type: "kabupaten",
    capital: "Pacitan",
    bupati: "Indrata Nur Bayuaji",
    bupatiParty: "Demokrat",
    notes: "SBY's (Susilo Bambang Yudhoyono) hometown. Demokrat stronghold in Jatim. Coastal kabupaten.",
    dataConfidence: "medium"
  },
  {
    name: "Kabupaten Pamekasan",
    type: "kabupaten",
    capital: "Pamekasan",
    island: "Madura",
    bupati: "Badrut Tamam",
    bupatiParty: "PKB",
    notes: "Madura island. PKB stronghold. Tobacco/salt. Badrut Tamam was also 2024 Pilgub candidate consideration.",
    dataConfidence: "medium"
  },
  {
    name: "Kabupaten Pasuruan",
    type: "kabupaten",
    capital: "Pasuruan (town)",
    bupati: "Irsyad Yusuf",
    bupatiParty: "PKB",
    notes: "Industrial. Near Surabaya. Large Chinese-Indonesian business community in northern area. Tourism (Tretes, Prigen, Taman Safari).",
    dataConfidence: "medium"
  },
  {
    name: "Kabupaten Ponorogo",
    type: "kabupaten",
    capital: "Ponorogo",
    bupati: "Sugiri Sancoko",
    bupatiParty: "PKB",
    notes: "Reog Ponorogo (traditional art, UNESCO inscription process). Agricultural.",
    dataConfidence: "medium"
  },
  {
    name: "Kabupaten Probolinggo",
    type: "kabupaten",
    capital: "Kraksaan",
    bupati: "TBD — post-Hasan Aminuddin corruption case",
    bupatiParty: "PKB",
    notes: "CORRUPTION FLAG: Hasan Aminuddin (former bupati) and wife Puput Tantriana Sari (successor bupati) BOTH arrested and convicted by KPK in 2021 for selling civil service positions. Current bupati should be Plt (acting) or newly elected official. Requires update.",
    korrupsiFlag: true,
    kpkNote: "Both husband and wife convicted KPK 2021",
    dataConfidence: "low — needs update"
  },
  {
    name: "Kabupaten Sampang",
    type: "kabupaten",
    capital: "Sampang",
    island: "Madura",
    bupati: "Slamet Junaidi",
    bupatiParty: "PKB",
    notes: "Madura island. Salt production. PKB overwhelming majority. Most conservative of Madura kabupaten.",
    dataConfidence: "medium"
  },
  {
    name: "Kabupaten Sidoarjo",
    type: "kabupaten",
    capital: "Sidoarjo",
    bupati: "Ahmad Muhdlor Ali (Gus Muhdlor) — DETAINED by KPK",
    bupatiParty: "PKB",
    notes: "CORRUPTION FLAG: Gus Muhdlor (bupati) arrested by KPK Feb 2024 for salary deductions/gratification. Case ongoing. Adjacent to Surabaya. Also site of Lapindo Brantas mudflow 2006 (Lumpur Lapindo) — 60,000 displaced. Major industrial/commercial area.",
    korrupsiFlag: true,
    kpkNote: "Ahmad Muhdlor Ali arrested KPK Feb 2024, case ongoing",
    lapindoNote: "Lapindo mudflow 2006 — still ongoing, still displacing/compensating residents",
    dataConfidence: "medium"
  },
  {
    name: "Kabupaten Situbondo",
    type: "kabupaten",
    capital: "Situbondo",
    bupati: "Karna Suswandi",
    bupatiParty: "PKB/Independent",
    notes: "Coastal, fisheries. Coffee/cacao highlands. NU area.",
    dataConfidence: "medium"
  },
  {
    name: "Kabupaten Sumenep",
    type: "kabupaten",
    capital: "Sumenep",
    island: "Madura + outer islands",
    bupati: "Achmad Fauzi Wongsojudo",
    bupatiParty: "PDI-P",
    notes: "Madura's easternmost kabupaten. Island archipelago. Achmad Fauzi (PDI-P) — unusual for PKB-dominated Madura; was considered for 2024 Pilgub. Natural gas production (offshore).",
    dataConfidence: "medium"
  },
  {
    name: "Kabupaten Trenggalek",
    type: "kabupaten",
    capital: "Trenggalek",
    bupati: "Mochamad Nur Arifin",
    bupatiParty: "PKB",
    notes: "Emil Dardak's home kabupaten (he was bupati 2016-2019 before becoming Vice Governor). Coastal and highland. Prawn fisheries.",
    dataConfidence: "medium"
  },
  {
    name: "Kabupaten Tuban",
    type: "kabupaten",
    capital: "Tuban",
    bupati: "Aditya Halindra Faridzky",
    bupatiParty: "PKB",
    notes: "PT Semen Indonesia headquarters. Industrial coastal area. Petrochemical development.",
    dataConfidence: "medium"
  },
  {
    name: "Kabupaten Tulungagung",
    type: "kabupaten",
    capital: "Tulungagung",
    bupati: "Maryoto Birowo",
    bupatiParty: "PDI-P",
    notes: "Marble/onyx production. Agricultural. Former bupati was PDI-P.",
    dataConfidence: "medium"
  },

  // === KOTA (9) ===
  {
    name: "Kota Surabaya",
    type: "kota",
    walikota: "Eri Cahyadi",
    walikotaParty: "PDI-P",
    notes: "Provincial capital, Indonesia's 2nd largest city. Eri Cahyadi (PDI-P) was mayor 2021-2024. Re-elected 2024 Pilkada. Khofifah lost Surabaya to Risma's coalition in 2024 Pilgub. Major port (Tanjung Perak), industrial, financial center.",
    dataConfidence: "high"
  },
  {
    name: "Kota Malang",
    type: "kota",
    walikota: "Wahyu Hidayat",
    walikotaParty: "Gerindra/PKS",
    notes: "University city (Universitas Brawijaya, UIN Malang, Universitas Negeri Malang). Tourism, apples. Former Mayor Moch Anton (2013-2018) and Sutiaji (2018-2023). Wahyu Hidayat won 2024 Pilwalkot.",
    dataConfidence: "medium"
  },
  {
    name: "Kota Batu",
    type: "kota",
    walikota: "Nurochman",
    walikotaParty: "PKB",
    notes: "Tourism city near Malang (Jatim Park, Selecta, apple orchards). Former Walikota Dewanti Rumpoko.",
    dataConfidence: "medium"
  },
  {
    name: "Kota Blitar",
    type: "kota",
    walikota: "Santoso",
    walikotaParty: "PDI-P",
    notes: "Sukarno's burial place — major pilgrimage site. Nationalist/PDI-P stronghold.",
    dataConfidence: "medium"
  },
  {
    name: "Kota Kediri",
    type: "kota",
    walikota: "Ferry Silviana",
    walikotaParty: "PDI-P",
    notes: "Industrial. PT Gudang Garam HQ in Kediri area. Ferry Silviana (PDI-P) — first female Mayor of Kediri.",
    dataConfidence: "medium"
  },
  {
    name: "Kota Madiun",
    type: "kota",
    walikota: "Maidi",
    walikotaParty: "Independent/PDI-P",
    notes: "PT INKA (train manufacturer). Former military/police officers area. Pecel rice dish famous.",
    dataConfidence: "medium"
  },
  {
    name: "Kota Mojokerto",
    type: "kota",
    walikota: "Ika Puspitasari (Ning Ita)",
    walikotaParty: "PDI-P",
    notes: "Small city. Historically Mojopahit kingdom area. Leather/batik industry.",
    dataConfidence: "medium"
  },
  {
    name: "Kota Pasuruan",
    type: "kota",
    walikota: "Saifullah Yusuf (Gus Ipul)",
    walikotaParty: "PKB",
    notes: "Gus Ipul (NU Secretary General) was mayor since 2021. Also former Vice Governor of Jatim (2009-2019). Lost to Khofifah in 2018 Pilgub. Active NU figure.",
    dataConfidence: "high"
  },
  {
    name: "Kota Probolinggo",
    type: "kota",
    walikota: "Habib Hadi Zainal Abidin",
    walikotaParty: "PDI-P/Independent",
    notes: "Port city. Different from Kabupaten Probolinggo. Fishing, mango, tobacco.",
    dataConfidence: "medium"
  }
];

export const jatimSummary = {
  totalKabupaten: 29,
  totalKota: 9,
  totalRegions: 38,
  dominantParty: "PKB (holds most kabupaten, especially Madura and rural NU areas)",
  urbanParty: "PDI-P strong in major cities (Surabaya, Malang, Blitar, Kediri)",
  corruptionFlags: ["Sidoarjo (Muhdlor Ali, KPK 2024)", "Probolinggo (Hasan Aminuddin + wife, KPK 2021)", "Malang kabupaten (Sanusi, KPK 2020)"],
  dataNotes: "Bupati/walikota data is approximate. 2024 Pilkada serentak (simultaneous local elections) held Nov 27, 2024. Winners being installed Feb-March 2025. Requires verification against KPU Jatim official results for final confirmed names."
};

export default { jatimRegions, jatimSummary };
