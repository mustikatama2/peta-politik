// ─── Business & Corporate Ownership Data ────────────────────────────────────
// Maps Indonesian oligarchs to company holdings, sector exposure, and political
// conflicts of interest. owner_ids reference PERSONS array where available.

export const OLIGARCH_SECTORS = [
  "pertambangan",
  "media",
  "properti",
  "energi",
  "keuangan",
  "agribisnis",
  "infrastruktur",
]

export const COMPANIES = [
  // ── PERTAMBANGAN ─────────────────────────────────────────────────────────
  {
    id: "arsari_group",
    name: "Arsari Group",
    owner_ids: ["hashim", "prabowo"],
    owner_names: { hashim: "Hashim Djojohadikusumo", prabowo: "Prabowo Subianto" },
    sector: "pertambangan",
    description: "Konglomerat pertambangan batu bara dan perkebunan kelapa sawit milik Hashim Djojohadikusumo, adik Presiden Prabowo.",
    revenue_estimate: "Rp 15T",
    employees: 8000,
    founded: 1994,
    key_assets: [
      "Bumi Resources (saham minoritas)",
      "Tambang Batu Bara Kalimantan Timur",
      "Perkebunan Sawit Sumatera Selatan",
      "PT Arsari Tambang",
    ],
    controversies: [
      "Konflik lahan adat Kalimantan",
      "Dugaan transfer pricing ke entitas luar negeri",
    ],
    political_link:
      "Hashim adalah adik kandung Presiden Prabowo Subianto; Arsari Group mendanai kampanye Gerindra secara signifikan.",
    coi_risk: "tinggi",
  },
  {
    id: "barito_pacific",
    name: "Barito Pacific Group",
    owner_ids: [],
    owner_names: { prajogo_pangestu: "Prajogo Pangestu" },
    sector: "pertambangan",
    description: "Konglomerat petrokimia dan energi terbesar milik Prajogo Pangestu. Menguasai Chandra Asri Petrochemical dan Star Energy.",
    revenue_estimate: "Rp 85T",
    employees: 18000,
    founded: 1979,
    key_assets: [
      "Chandra Asri Petrochemical (pabrik petrokimia terbesar RI)",
      "Star Energy Geothermal (panas bumi)",
      "PT Barito Pacific Timber",
      "Krakatau Chandra Energi",
    ],
    controversies: [
      "Monopoli industri petrokimia nasional",
      "Konflik kepentingan konsesi panas bumi",
    ],
    political_link:
      "Prajogo Pangestu masuk daftar 10 orang terkaya Indonesia; dekat dengan lingkaran kabinet Prabowo melalui sektor energi strategis.",
    coi_risk: "sedang",
  },
  {
    id: "bakrie_group",
    name: "Bakrie Group",
    owner_ids: [],
    owner_names: { aburizal_bakrie: "Aburizal Bakrie" },
    sector: "pertambangan",
    description: "Konglomerat milik keluarga Bakrie — mencakup batu bara (Bumi Resources), properti, dan telekomunikasi. Sempat terlilit utang besar pasca 2008.",
    revenue_estimate: "Rp 25T",
    employees: 12000,
    founded: 1942,
    key_assets: [
      "Bumi Resources (batu bara terbesar RI)",
      "Bakrie Telecom (Esia)",
      "Visi Media Asia (ANTV, tvOne)",
      "Bakrie Land",
    ],
    controversies: [
      "Lumpur Lapindo Sidoarjo — kerugian sosial-lingkungan Rp 15T+",
      "Gagal bayar obligasi 2013",
      "Kasus korupsi perpajakan",
    ],
    political_link:
      "Aburizal Bakrie mantan Ketua Umum Golkar; ANTV dan tvOne secara konsisten mendukung koalisi pemerintah yang melibatkan Golkar.",
    coi_risk: "tinggi",
  },

  // ── MEDIA ────────────────────────────────────────────────────────────────
  {
    id: "mnc_group",
    name: "MNC Group",
    owner_ids: ["hary_tanoe"],
    owner_names: { hary_tanoe: "Hary Tanoesoedibjo" },
    sector: "media",
    description: "Konglomerat media terbesar Indonesia milik Hary Tanoesoedibjo — menguasai empat channel TV nasional, radio, surat kabar, dan platform digital.",
    revenue_estimate: "Rp 20T",
    employees: 15000,
    founded: 1990,
    key_assets: [
      "RCTI (TV nasional #1 pemirsa)",
      "MNCTV",
      "GTV (Global TV)",
      "iNews TV",
      "Koran Sindo",
      "MNC Sky Vision (Indovision)",
      "OKEZONE.com",
    ],
    controversies: [
      "Konflik regulasi penyiaran dengan KPI",
      "Penggunaan siaran untuk kepentingan Perindo",
      "Dugaan konten kampanye terselubung 2019 & 2024",
    ],
    political_link:
      "Hary Tanoe = Ketua Umum Perindo (Partai Persatuan Indonesia); empat saluran TV-nya secara konsisten mendukung pemerintahan koalisi.",
    coi_risk: "tinggi",
  },
  {
    id: "media_group",
    name: "Media Group / Metro TV",
    owner_ids: ["surya_paloh"],
    owner_names: { surya_paloh: "Surya Paloh" },
    sector: "media",
    description: "Kelompok media milik Surya Paloh — Ketua Umum NasDem. Menguasai Metro TV (TV berita) dan Media Indonesia (harian nasional).",
    revenue_estimate: "Rp 3.5T",
    employees: 4000,
    founded: 2000,
    key_assets: [
      "Metro TV (TV berita 24 jam)",
      "Media Indonesia (koran nasional)",
      "Lampung Post",
    ],
    controversies: [
      "Liputan Metro TV dinilai memihak NasDem dan koalisi Prabowo",
      "Konflik kepentingan editorial vs kepemilikan partai",
    ],
    political_link:
      "Surya Paloh = Ketua Umum NasDem. Metro TV berperan kunci mendukung pencalonan Anies Baswedan sebelum berbalik mendukung koalisi Prabowo.",
    coi_risk: "tinggi",
  },
  {
    id: "ct_corp_media",
    name: "Trans Media (CT Corp)",
    owner_ids: [],
    owner_names: { chairul_tanjung: "Chairul Tanjung" },
    sector: "media",
    description: "Divisi media CT Corp milik Chairul Tanjung — menguasai Trans TV, Trans7, dan CNN Indonesia.",
    revenue_estimate: "Rp 8T",
    employees: 7000,
    founded: 2001,
    key_assets: [
      "Trans TV",
      "Trans7",
      "CNN Indonesia",
      "Detik.com",
      "Grid Network",
    ],
    controversies: [
      "Akuisisi Detik.com mengurangi independensi redaksi",
      "Konten berita dianggap lunak terhadap kebijakan pemerintah",
    ],
    political_link:
      "Chairul Tanjung dekat dengan lingkaran PDIP dan Jokowi. Trans Media mendapat eksklusivitas siaran berbagai acara pemerintah.",
    coi_risk: "sedang",
  },

  // ── PROPERTI ──────────────────────────────────────────────────────────────
  {
    id: "agung_sedayu",
    name: "Agung Sedayu Group",
    owner_ids: [],
    owner_names: { aguan: "Aguan (Sugianto Kusuma)" },
    sector: "properti",
    description: "Konglomerat properti terbesar Jakarta milik Aguan (Sugianto Kusuma). Menguasai PIK 2 dan kawasan reklamasi Pantai Indah Kapuk.",
    revenue_estimate: "Rp 30T",
    employees: 10000,
    founded: 1971,
    key_assets: [
      "Pantai Indah Kapuk 2 (PIK2) — proyek SHGB 2000 ha",
      "Pantai Mutiara",
      "Green Bay Pluit",
      "The Riviera at Puri",
    ],
    controversies: [
      "Proyek PIK2 ditetapkan sebagai Proyek Strategis Nasional (PSN) — dugaan konflik kepentingan",
      "Penggusuran warga nelayan Tangerang untuk PIK2",
      "Keterlibatan proyek IKN Nusantara",
    ],
    political_link:
      "Aguan disebut masuk dalam 'lingkaran kepercayaan' Presiden Prabowo. PIK2 menjadi PSN di bawah pemerintahan Jokowi dan dilanjutkan Prabowo.",
    coi_risk: "tinggi",
  },
  {
    id: "mnc_land",
    name: "MNC Land",
    owner_ids: ["hary_tanoe"],
    owner_names: { hary_tanoe: "Hary Tanoesoedibjo" },
    sector: "properti",
    description: "Divisi properti MNC Group — mengelola kawasan terpadu MNC City, MNC Bali Resort, dan hotel-hotel bintang lima.",
    revenue_estimate: "Rp 5T",
    employees: 3000,
    founded: 2004,
    key_assets: [
      "MNC City Kebon Jeruk Jakarta",
      "MNC Bali Resort (IKN Eco Tourism)",
      "Hotel MNC Lido",
      "MNC Play (media cable)",
    ],
    controversies: [
      "Proyek MNC Lido Lakes sempat terhenti izin lingkungan",
    ],
    political_link:
      "MNC Land mendapat kemudahan perizinan di era Jokowi dan Prabowo melalui jaringan politik Hary Tanoe di Perindo.",
    coi_risk: "sedang",
  },

  // ── ENERGI ────────────────────────────────────────────────────────────────
  {
    id: "toba_sejahtra",
    name: "Toba Sejahtra Group",
    owner_ids: [],
    owner_names: { luhut_pandjaitan: "Luhut Binsar Pandjaitan" },
    sector: "energi",
    description: "Konglomerat energi dan pertambangan milik Luhut Binsar Pandjaitan — mantan Menteri Koordinator Bidang Kemaritiman dan Investasi.",
    revenue_estimate: "Rp 12T",
    employees: 6000,
    founded: 1997,
    key_assets: [
      "PT Toba Bara Sejahtra (batu bara Kaltim)",
      "TBS Energi Utama (IPO 2021)",
      "PT Kutai Energi",
      "Investasi EV battery (nikel)",
    ],
    controversies: [
      "Konflik kepentingan saat menjabat Menteri Koordinator dan mengurus kebijakan nikel/batu bara",
      "Dugaan suap izin tambang Kalimantan",
    ],
    political_link:
      "Luhut menjabat Menkomarves selama 9 tahun (2015–2024); bisnis Toba Group bersinggungan langsung dengan kebijakan nikel, batu bara, dan hilirisasi yang diputuskannya.",
    coi_risk: "tinggi",
  },
  {
    id: "medco_energi",
    name: "Medco Energi International",
    owner_ids: [],
    owner_names: { arifin_panigoro: "Arifin Panigoro" },
    sector: "energi",
    description: "Perusahaan minyak dan gas terbesar swasta Indonesia milik Arifin Panigoro. Beroperasi di Indonesia, Timur Tengah, dan Afrika.",
    revenue_estimate: "Rp 22T",
    employees: 5000,
    founded: 1980,
    key_assets: [
      "Blok Rimau (Sumatera Selatan)",
      "Blok South Sumatera",
      "Blok Ophir Energy (internasional)",
      "Medco Power Indonesia",
    ],
    controversies: [
      "Dugaan front-running saham MedcoEnergi 2008",
    ],
    political_link:
      "Arifin Panigoro lama dekat dengan PDIP. Medco mendapat konsesi blok migas strategis berulang kali sejak era Megawati.",
    coi_risk: "sedang",
  },

  // ── KEUANGAN ─────────────────────────────────────────────────────────────
  {
    id: "bca_djarum",
    name: "BCA & Djarum Group",
    owner_ids: [],
    owner_names: {
      budi_hartono: "Robert Budi Hartono",
      michael_hartono: "Michael Bambang Hartono",
    },
    sector: "keuangan",
    description: "Keluarga Hartono (Djarum) adalah pemilik mayoritas Bank BCA — bank swasta terbesar RI — serta bisnis rokok Djarum dan Global TV.",
    revenue_estimate: "Rp 200T",
    employees: 32000,
    founded: 1957,
    key_assets: [
      "Bank BCA (aset Rp 1.000T+)",
      "Djarum (produsen rokok #2 RI)",
      "Global TV / GTV (divested ke MNC)",
      "Saham Indofood, BRI Life",
    ],
    controversies: [
      "Pemberhentian beasiswa Djarum dihubungkan dengan agenda rekrutmen bisnis",
    ],
    political_link:
      "Robert & Michael Hartono adalah orang terkaya #1 & #2 Indonesia. Posisi BCA yang dominan menjadikan keluarga ini memiliki pengaruh sistemik di sektor keuangan nasional.",
    coi_risk: "rendah",
  },
  {
    id: "ct_corp_keuangan",
    name: "CT Corp — Divisi Keuangan",
    owner_ids: [],
    owner_names: { chairul_tanjung: "Chairul Tanjung" },
    sector: "keuangan",
    description: "Divisi keuangan CT Corp milik Chairul Tanjung — Bank Mega, Asuransi Jiwa Mega Life, dan TransVision.",
    revenue_estimate: "Rp 30T",
    employees: 12000,
    founded: 1969,
    key_assets: [
      "Bank Mega (top-10 bank nasional)",
      "Mega Insurance",
      "Asuransi Jiwa Mega Life",
      "TransVision (pay TV)",
    ],
    controversies: [
      "Bank Mega tersangkut kasus Sarana Buana Raya 2011",
    ],
    political_link:
      "Chairul Tanjung (CT) adalah tokoh bisnis yang dekat lintas pemerintahan. Bank Mega adalah partner strategis BUMN di berbagai proyek.",
    coi_risk: "rendah",
  },
  {
    id: "saratoga_recapital",
    name: "Saratoga Investama Sedaya",
    owner_ids: [],
    owner_names: {
      sandiaga_uno: "Sandiaga Uno",
      edwin_soeryadjaya: "Edwin Soeryadjaya",
    },
    sector: "keuangan",
    description: "Perusahaan investasi co-founded oleh Sandiaga Uno dan Edwin Soeryadjaya. Portofolio mencakup tambang, telekomunikasi, dan consumer goods.",
    revenue_estimate: "Rp 18T",
    employees: 2000,
    founded: 1998,
    key_assets: [
      "Tower Bersama Group (menara telekomunikasi)",
      "Adaro Energy (batu bara)",
      "Merdeka Copper Gold",
      "Provident Agro",
    ],
    controversies: [
      "Sandiaga mundur setelah maju sebagai Cawapres 2019",
      "Dugaan konflik kepentingan saat menjabat Menteri Pariwisata",
    ],
    political_link:
      "Sandiaga Uno — mantan Wagub DKI, Cawapres 2019, Menparekraf 2021–2024 — mendirikan Saratoga bersama Edwin. Kebijakan pariwisata & investasi bersinggungan dengan portofolionya.",
    coi_risk: "tinggi",
  },

  // ── AGRIBISNIS ───────────────────────────────────────────────────────────
  {
    id: "wilmar_indonesia",
    name: "Wilmar International (Indonesia)",
    owner_ids: [],
    owner_names: { martua_sitorus: "Martua Sitorus" },
    sector: "agribisnis",
    description: "Operasi Indonesia Wilmar International — perusahaan agribisnis sawit terbesar dunia, co-founded oleh Martua Sitorus dari Tapanuli.",
    revenue_estimate: "Rp 120T",
    employees: 90000,
    founded: 1991,
    key_assets: [
      "Perkebunan sawit 250.000 ha (Kalimantan, Sumatera)",
      "Pabrik CPO dan oleokimia",
      "PT Agro Palindo Sakti",
      "Goodman Fielder (consumer foods)",
    ],
    controversies: [
      "Deforestasi dan kebakaran lahan 2015",
      "Pelanggaran RSPO terkait lahan gambut",
      "Konflik tanah dengan masyarakat adat Dayak",
    ],
    political_link:
      "Wilmar mendapat konsesi skala besar di berbagai kabupaten; ekspansi berlangsung tanpa hambatan lintas pemerintahan.",
    coi_risk: "sedang",
  },
  {
    id: "sinar_mas_agro",
    name: "Sinar Mas Agribusiness & Food",
    owner_ids: [],
    owner_names: {
      eka_tjipta_widjaja: "Eka Tjipta Widjaja (alm.)",
      franky_widjaja: "Franky Oesman Widjaja",
    },
    sector: "agribisnis",
    description: "Divisi agribisnis Sinar Mas Group — menguasai 600.000 ha kebun sawit, pabrik minyak goreng Filma & Kunci Mas, dan pulp kertas APP.",
    revenue_estimate: "Rp 80T",
    employees: 120000,
    founded: 1962,
    key_assets: [
      "Perkebunan sawit 600.000+ ha",
      "Smart Tbk (minyak goreng)",
      "Asia Pulp & Paper (APP)",
      "Golden Agri-Resources",
    ],
    controversies: [
      "APP Indonesia terlibat kasus deforestasi Riau",
      "Moratorium sawit berulang kali dilanggar",
      "Kebakaran lahan Kalimantan 2019",
    ],
    political_link:
      "Sinar Mas Group sangat berpengaruh di sektor perkebunan. Lobinya ke pemerintah untuk moratorium sawit dan kebijakan B35/B40 dinilai sangat kuat.",
    coi_risk: "sedang",
  },

  // ── INFRASTRUKTUR ─────────────────────────────────────────────────────────
  {
    id: "erick_thohir_bumn",
    name: "Holding BUMN — Era Erick Thohir",
    owner_ids: ["erick_thohir"],
    owner_names: { erick_thohir: "Erick Thohir" },
    sector: "infrastruktur",
    description: "Erick Thohir sebagai Menteri BUMN (2019–2024) mengelola 47 BUMN dengan total aset Rp 10.000T+. Sebelumnya pemilik Mahaka Group (media & olahraga).",
    revenue_estimate: "Rp 10.000T (aset BUMN)",
    employees: 800000,
    founded: 2019,
    key_assets: [
      "PT PLN (listrik nasional)",
      "PT Pertamina (minyak & gas)",
      "PT Telkom Indonesia",
      "PT Wijaya Karya (konstruksi)",
      "Mahaka Group (media, eks-milik Erick)",
    ],
    controversies: [
      "Reorganisasi BUMN dinilai sarat konflik kepentingan",
      "Mahaka Group dijual setelah masuk kabinet — validitas dipertanyakan",
      "Proyek IKN BUMN merugi",
    ],
    political_link:
      "Erick Thohir memiliki saham Mahaka Group sebelum menjabat Menteri BUMN; diangkat kembali oleh Prabowo sebagai Menteri Koordinator Bidang Infrastruktur.",
    coi_risk: "tinggi",
  },
  {
    id: "jasa_marga_network",
    name: "Jasa Marga & Toll Road Network",
    owner_ids: [],
    owner_names: {
      salim_group: "Anthoni Salim (Salim Group)",
      astra_infra: "Astra International (Infrastruktur)",
    },
    sector: "infrastruktur",
    description: "Jaringan jalan tol Indonesia melibatkan dua pemain dominan swasta: Salim Group dan Astra Infra — di samping BUMN Jasa Marga.",
    revenue_estimate: "Rp 40T",
    employees: 8000,
    founded: 1978,
    key_assets: [
      "Jasa Marga (BUMN tol, 1.000+ km)",
      "Astra Infra Toll Road (500+ km)",
      "Lintas Marga Sedaya (Salim Group)",
      "Nusantara Infrastructure",
    ],
    controversies: [
      "Tarif tol ditetapkan tanpa transparansi regulasi",
      "Pembebasan lahan menyebabkan penggusuran massal di Jawa Barat",
    ],
    political_link:
      "Astra dan Salim Group mendapat konsesi tol strategis melalui program infrastruktur Jokowi; berlanjut di era Prabowo dengan percepatan PSN.",
    coi_risk: "sedang",
  },
]

// ── Political Business Ties ─────────────────────────────────────────────────
export const POLITICAL_BUSINESS_TIES = [
  {
    company_id: "mnc_group",
    person_id: "hary_tanoe",
    tie_type: "kepemilikan",
    description:
      "Hary Tanoe = pemilik MNC Group (RCTI, MNCTV, GTV, iNews) dan Ketua Umum Perindo. Empat saluran TV miliknya secara konsisten mendukung koalisi pemerintah dan menguntungkan posisi politiknya.",
    risk: "tinggi",
  },
  {
    company_id: "arsari_group",
    person_id: "hashim",
    tie_type: "kepemilikan",
    description:
      "Hashim Djojohadikusumo = pemilik Arsari Group dan adik kandung Presiden Prabowo. Bisnis pertambangan bersinggungan dengan kebijakan sektor pertambangan yang ditetapkan pemerintah.",
    risk: "tinggi",
  },
  {
    company_id: "arsari_group",
    person_id: "prabowo",
    tie_type: "hubungan_keluarga",
    description:
      "Prabowo Subianto = kakak kandung Hashim (pemilik Arsari Group). Sebagai Presiden RI, kebijakan pertambangan batu bara dan kelapa sawit berpotensi menguntungkan bisnis keluarganya.",
    risk: "tinggi",
  },
  {
    company_id: "media_group",
    person_id: "surya_paloh",
    tie_type: "kepemilikan",
    description:
      "Surya Paloh = pemilik Metro TV & Media Indonesia sekaligus Ketua Umum NasDem. Editorial media bersinggungan langsung dengan kepentingan partainya dalam koalisi pemerintahan.",
    risk: "tinggi",
  },
  {
    company_id: "bakrie_group",
    person_id: null,
    person_name: "Aburizal Bakrie",
    tie_type: "kepemilikan",
    description:
      "Aburizal Bakrie = eks-Ketua Umum Golkar dan pemilik Bakrie Group. ANTV dan tvOne (Bakrie) mendukung Golkar. Kasus Lumpur Lapindo tak pernah dituntaskan secara hukum.",
    risk: "tinggi",
  },
  {
    company_id: "toba_sejahtra",
    person_id: null,
    person_name: "Luhut Binsar Pandjaitan",
    tie_type: "kepemilikan",
    description:
      "Luhut menjabat Menkomarves 2015–2024 sambil memiliki Toba Sejahtra Group (batu bara, nikel). Kebijakan hilirisasi nikel yang ia dorong menguntungkan langsung portofolio bisnisnya.",
    risk: "tinggi",
  },
  {
    company_id: "agung_sedayu",
    person_id: null,
    person_name: "Aguan (Sugianto Kusuma)",
    tie_type: "kontrak_pemerintah",
    description:
      "PIK2 milik Aguan ditetapkan sebagai Proyek Strategis Nasional era Jokowi; Aguan disebut dekat dengan Prabowo. Penetapan PSN memberi kemudahan perizinan dan anggaran infrastruktur dari APBN.",
    risk: "tinggi",
  },
  {
    company_id: "saratoga_recapital",
    person_id: null,
    person_name: "Sandiaga Uno",
    tie_type: "konflik_jabatan",
    description:
      "Sandiaga adalah co-founder Saratoga Investama saat menjabat Menteri Pariwisata (2021–2024). Portofolio Saratoga di sektor wisata dan investasi bersinggungan langsung dengan kebijakan kementeriannya.",
    risk: "tinggi",
  },
  {
    company_id: "erick_thohir_bumn",
    person_id: "erick_thohir",
    tie_type: "konflik_jabatan",
    description:
      "Erick Thohir memiliki Mahaka Group (Inter Milan, beIN Sports Indonesia) sebelum menjadi Menteri BUMN. Proses divestasi tidak sepenuhnya transparan; ia kini Menteri Koordinator Infrastruktur.",
    risk: "sedang",
  },
  {
    company_id: "ct_corp_media",
    person_id: null,
    person_name: "Chairul Tanjung",
    tie_type: "pengaruh_kebijakan",
    description:
      "CT Corp menguasai Trans TV, Trans7, CNN Indonesia, dan Detik.com. Chairul Tanjung dekat dengan PDIP dan Jokowi; media CT cenderung lunak terhadap pemerintah selama dua periode Jokowi.",
    risk: "sedang",
  },
  {
    company_id: "wilmar_indonesia",
    person_id: null,
    person_name: "Martua Sitorus",
    tie_type: "konsesi",
    description:
      "Wilmar Indonesia mendapat konsesi sawit 250.000+ ha secara bertahap; lobi kebijakan sawit (B35, B40) dinilai menguntungkan Wilmar yang mendominasi rantai pasok CPO nasional.",
    risk: "sedang",
  },
  {
    company_id: "bca_djarum",
    person_id: null,
    person_name: "Robert Budi & Michael Hartono",
    tie_type: "kepemilikan",
    description:
      "Keluarga Hartono adalah orang terkaya Indonesia. BCA sebagai bank swasta terbesar memiliki pengaruh sistemik terhadap kebijakan moneter dan likuiditas perbankan nasional.",
    risk: "rendah",
  },
]
