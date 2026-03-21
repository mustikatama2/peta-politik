export const PERSONS = [
  // ─── NASIONAL — EKSEKUTIF ───────────────────────────────────────────────
  {
    id:"prabowo", name:"Prabowo Subianto", photo_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Prabowo_Subianto_2024_official_portrait.jpg/400px-Prabowo_Subianto_2024_official_portrait.jpg", photo_placeholder:"PS",
    born:"17 Oct 1951", born_place:"Jakarta", religion:"Islam",
    education:"Akademi Militer Magelang (1974); Fort Benning USA",
    party_id:"ger", party_role:"Ketua Umum",
    positions:[
      {title:"Presiden RI ke-8",       institution:"Istana Negara",    region:"Nasional",    start:"2024", end:null,   is_current:true},
      {title:"Menteri Pertahanan",      institution:"Kemhan RI",        region:"Nasional",    start:"2019", end:"2024", is_current:false},
      {title:"Danjen Kopassus",         institution:"TNI AD",           region:"Nasional",    start:"1995", end:"1998", is_current:false},
      {title:"Pangkostrad",             institution:"TNI AD",           region:"Nasional",    start:"1998", end:"1998", is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Mantan Danjen Kopassus dan Pangkostrad. Putra ekonom Sumitro Djojohadikusumo. Menjabat Presiden RI ke-8 sejak Oktober 2024 setelah memenangkan Pilpres 2024 dengan 58.59% suara.",
    tags:["eks-militer","pengusaha","presiden"],
    lhkpn_latest:2040000000000, lhkpn_year:2023,
    connections_summary:"Presiden RI, Ketum Gerindra, eks-menantu Soeharto",
    twitter:"@prabowo",
    analysis:{
      ideology_score:6, populism_score:8, corruption_risk:"sedang",
      nationalism:9, religiosity:5,
      track_record:"Karier militer kontroversial era Reformasi; tiga kali gagal Pilpres sebelum menang 2024. Dikenal pro-pertahanan dan nasionalisme ekonomi.",
      policy_direction:"Nasionalis ekonomi"
    }
  },
  {
    id:"gibran", name:"Gibran Rakabuming Raka", photo_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Gibran_Rakabuming_Raka_2024_official_portrait.jpg/400px-Gibran_Rakabuming_Raka_2024_official_portrait.jpg", photo_placeholder:"GR",
    born:"1 Oct 1987", born_place:"Surakarta", religion:"Islam",
    education:"S1 Manajemen, Universitas Gadjah Mada (2010)",
    party_id:"gol", party_role:"Anggota",
    positions:[
      {title:"Wakil Presiden RI ke-6",  institution:"Istana Wapres",    region:"Nasional",    start:"2024", end:null,   is_current:true},
      {title:"Walikota Surakarta",       institution:"Pemkot Surakarta", region:"Jawa Tengah", start:"2021", end:"2024", is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Putra sulung Presiden Joko Widodo. Wakil Presiden termuda dalam sejarah RI, dilantik usia 36 tahun. Sebelumnya menjabat Walikota Surakarta 2021-2024. Lolos melalui putusan MK kontroversial soal batas usia Capres-Cawapres.",
    tags:["muda","pengusaha","putra-presiden"],
    lhkpn_latest:25000000000, lhkpn_year:2023,
    connections_summary:"Putra Jokowi, Wapres termuda RI",
    twitter:"@gibran_tweet",
    analysis:{
      ideology_score:2, populism_score:6, corruption_risk:"rendah",
      nationalism:6, religiosity:5,
      track_record:"Walikota Solo dengan popularitas tinggi. Dinilai minim pengalaman untuk posisi Wapres namun diuntungkan jalur politik ayahnya.",
      policy_direction:"Pro-investasi"
    }
  },
  {
    id:"jokowi", name:"Joko Widodo", photo_url:"https://commons.wikimedia.org/wiki/Special:FilePath/Joko_Widodo_2019_official_portrait.jpg?width=400", photo_placeholder:"JW",
    born:"21 Jun 1961", born_place:"Surakarta", religion:"Islam",
    education:"S1 Kehutanan, Universitas Gadjah Mada (1985)",
    party_id:"pdip", party_role:"Anggota",
    positions:[
      {title:"Presiden RI ke-7",        institution:"Istana Negara",    region:"Nasional",    start:"2014", end:"2024", is_current:false},
      {title:"Gubernur DKI Jakarta",    institution:"Pemprov DKI",      region:"DKI Jakarta", start:"2012", end:"2014", is_current:false},
      {title:"Walikota Surakarta",       institution:"Pemkot Surakarta", region:"Jawa Tengah", start:"2005", end:"2012", is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Presiden RI ke-7, menjabat dua periode 2014-2024. Mantan pengusaha mebel yang menapaki karir politik dari bawah. Dikenal dengan program infrastruktur masif dan karakter 'merakyat'.",
    tags:["pengusaha","eks-presiden","populis"],
    lhkpn_latest:82000000000, lhkpn_year:2023,
    connections_summary:"Eks Presiden RI, bapak Gibran & Kaesang",
    twitter:"@jokowi",
    analysis:{
      ideology_score:0, populism_score:9, corruption_risk:"sedang",
      nationalism:7, religiosity:5,
      track_record:"Dua periode presiden dengan legacy infrastruktur besar. Dikritik soal dinasti politik dan dukungan pada Prabowo-Gibran di akhir masa jabatan.",
      policy_direction:"Pro-infrastruktur, Nasionalis"
    }
  },
  {
    id:"sri_mulyani", name:"Sri Mulyani Indrawati", photo_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Sri_Mulyani_Indrawati_official_portrait_2022.jpg/400px-Sri_Mulyani_Indrawati_official_portrait_2022.jpg", photo_placeholder:"SM",
    born:"26 Aug 1962", born_place:"Lampung", religion:"Islam",
    education:"S1 FE UI; PhD Ekonomi University of Illinois (1992)",
    party_id:null, party_role:null,
    positions:[
      {title:"Menteri Keuangan",        institution:"Kemenkeu RI",      region:"Nasional",    start:"2024", end:null,   is_current:true},
      {title:"Direktur Pelaksana World Bank", institution:"World Bank", region:"Internasional",start:"2010", end:"2016", is_current:false},
      {title:"Menteri Keuangan",        institution:"Kemenkeu RI",      region:"Nasional",    start:"2005", end:"2010", is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Ekonom terkemuka Indonesia dan Menteri Keuangan yang menjabat tiga periode. Mantan Direktur Pelaksana World Bank 2010-2016. Tiga kali dinobatkan sebagai Menteri Keuangan terbaik Asia.",
    tags:["teknokrat","ekonom","internasional","perempuan"],
    lhkpn_latest:58000000000, lhkpn_year:2023,
    connections_summary:"Menkeu tiga periode, mantan Direktur World Bank",
    twitter:"@smindrawati",
    analysis:{
      ideology_score:1, populism_score:2, corruption_risk:"rendah",
      nationalism:5, religiosity:4,
      track_record:"Disiplin fiskal ketat, manajemen APBN terpuji. Salah satu Menteri Keuangan paling berpengaruh di Asia Tenggara.",
      policy_direction:"Pro-investasi asing, disiplin fiskal"
    }
  },
  {
    id:"sugiono", name:"Sugiono", photo_url:null, photo_placeholder:"SG",
    born:"1969", born_place:"Jakarta", religion:"Islam",
    education:"Akademi Militer Magelang",
    party_id:"ger", party_role:"Anggota DPR",
    positions:[
      {title:"Menteri Luar Negeri",     institution:"Kemenlu RI",       region:"Nasional",    start:"2024", end:null,   is_current:true},
      {title:"Anggota DPR RI",          institution:"DPR RI",           region:"Nasional",    start:"2019", end:"2024", is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Mantan perwira TNI dan anggota DPR RI dari Gerindra. Dipercaya Prabowo sebagai Menteri Luar Negeri pertama dari kalangan militer dalam sejarah modern Indonesia.",
    tags:["eks-militer","diplomat"],
    lhkpn_latest:15000000000, lhkpn_year:2023,
    connections_summary:"Menlu RI, eks-TNI, kader Gerindra",
    twitter:null,
    analysis:{
      ideology_score:5, populism_score:4, corruption_risk:"rendah",
      nationalism:8, religiosity:5,
      track_record:"Latar belakang militer dan DPR. Kebijakan luar negeri cenderung asertif dan nasionalis.",
      policy_direction:"Nasionalis ekonomi"
    }
  },
  {
    id:"sjafrie", name:"Sjafrie Sjamsoeddin", photo_url:null, photo_placeholder:"SS",
    born:"1952", born_place:"Makassar", religion:"Islam",
    education:"Akademi Militer Magelang",
    party_id:null, party_role:null,
    positions:[
      {title:"Menteri Pertahanan",      institution:"Kemhan RI",        region:"Nasional",    start:"2024", end:null,   is_current:true},
      {title:"Wakil Menteri Pertahanan", institution:"Kemhan RI",       region:"Nasional",    start:"2009", end:"2014", is_current:false},
      {title:"Pangdam Jaya",            institution:"TNI AD",           region:"DKI Jakarta", start:"1998", end:"1999", is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Jenderal TNI (Purn) yang pernah menjabat Wakil Menteri Pertahanan era SBY. Ditunjuk Prabowo sebagai Menteri Pertahanan dengan rekam jejak panjang di dunia militer dan pertahanan.",
    tags:["eks-militer","pertahanan"],
    lhkpn_latest:25000000000, lhkpn_year:2023,
    connections_summary:"Menhan RI, Jenderal (Purn) TNI AD",
    twitter:null,
    analysis:{
      ideology_score:5, populism_score:2, corruption_risk:"sedang",
      nationalism:9, religiosity:5,
      track_record:"Kontroversial atas peran di peristiwa 1998. Kini fokus modernisasi alutsista.",
      policy_direction:"Nasionalis pertahanan"
    }
  },
  {
    id:"budi_gunawan", name:"Budi Gunawan", photo_url:null, photo_placeholder:"BG",
    born:"1959", born_place:"Surakarta", religion:"Islam",
    education:"Akademi Kepolisian",
    party_id:null, party_role:null,
    positions:[
      {title:"Kepala BIN",              institution:"BIN RI",           region:"Nasional",    start:"2016", end:null,   is_current:true},
      {title:"Wakapolri",               institution:"Polri",            region:"Nasional",    start:"2015", end:"2016", is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Kepala Badan Intelijen Negara sejak 2016. Mantan Wakapolri yang pernah ditetapkan sebagai tersangka KPK namun perkaranya dilimpahkan ke Polri. Figur berpengaruh di lingkaran kekuasaan.",
    tags:["polri","intelijen"],
    lhkpn_latest:73000000000, lhkpn_year:2023,
    connections_summary:"Ka BIN, eks-Wakapolri, dekat kekuasaan",
    twitter:null,
    analysis:{
      ideology_score:0, populism_score:3, corruption_risk:"tinggi",
      nationalism:7, religiosity:4,
      track_record:"Kasus rekening gendut dan penetapan tersangka KPK yang kandas. Dianggap salah satu figur paling berpengaruh di intelijen RI.",
      policy_direction:"Status quo, pro-keamanan"
    }
  },
  {
    id:"agus_gumiwang", name:"Agus Gumiwang Kartasasmita", photo_url:null, photo_placeholder:"AG",
    born:"1971", born_place:"Bandung", religion:"Islam",
    education:"S1 Hukum, Universitas Padjajaran",
    party_id:"gol", party_role:"Anggota",
    positions:[
      {title:"Menteri Perindustrian",   institution:"Kemenperin RI",    region:"Nasional",    start:"2019", end:null,   is_current:true},
    ],
    tier:"nasional", region_id:null,
    bio:"Politisi Golkar generasi kedua, putra mantan Mendagri Ginandjar Kartasasmita. Menjabat Menteri Perindustrian sejak 2019 dengan fokus pada hilirisasi industri dan investasi.",
    tags:["pengusaha","golkar","putra-menteri"],
    lhkpn_latest:120000000000, lhkpn_year:2023,
    connections_summary:"Menperin, putra Ginandjar Kartasasmita",
    twitter:null,
    analysis:{
      ideology_score:3, populism_score:3, corruption_risk:"rendah",
      nationalism:6, religiosity:4,
      track_record:"Dorong kebijakan hilirisasi nikel dan mineral. Dinilai kompeten di bidang industri.",
      policy_direction:"Pro-hilirisasi, nasionalis ekonomi"
    }
  },
  {
    id:"bahlil", name:"Bahlil Lahadalia", photo_url:"https://commons.wikimedia.org/wiki/Special:FilePath/Bahlil_Lahadalia_at_the_Indonesia_Naik_Kelas_book_launching,_21_November_2025_24_(cropped).jpg?width=400", photo_placeholder:"BL",
    born:"1975", born_place:"Papua", religion:"Islam",
    education:"S1 Ekonomi, Universitas Yapis Papua",
    party_id:"gol", party_role:"Ketua Umum",
    positions:[
      {title:"Menteri ESDM",            institution:"KESDM RI",         region:"Nasional",    start:"2024", end:null,   is_current:true},
      {title:"Ketua Umum Partai Golkar", institution:"DPP Golkar",      region:"Nasional",    start:"2024", end:null,   is_current:true},
      {title:"Menteri Investasi/Ka BKPM", institution:"BKPM RI",        region:"Nasional",    start:"2021", end:"2024", is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Pengusaha asal Papua yang meniti karir di Golkar hingga menjadi Ketua Umum. Mantan Kepala BKPM dan kini Menteri ESDM. Dikenal sebagai figur dekat Jokowi yang kemudian berlabuh ke Prabowo.",
    tags:["pengusaha","golkar","papua"],
    lhkpn_latest:400000000000, lhkpn_year:2023,
    connections_summary:"Ketum Golkar, Menteri ESDM, pengusaha Papua",
    twitter:"@bahlillahadalia",
    analysis:{
      ideology_score:4, populism_score:6, corruption_risk:"sedang",
      nationalism:7, religiosity:5,
      track_record:"Kontroversial soal pencabutan IUP dan konflik kepentingan bisnis. Sangat cepat naik kekuasaan.",
      policy_direction:"Pro-investasi, nasionalis sumber daya"
    }
  },
  {
    id:"zulhas", name:"Zulkifli Hasan", photo_url:"https://commons.wikimedia.org/wiki/Special:FilePath/Wakil_Ketua_MPR_Zulkifli_Hasan_(2019).jpg?width=400", photo_placeholder:"ZH",
    born:"1962", born_place:"Lampung", religion:"Islam",
    education:"S1 Ilmu Sosial, STIA LPPN Jakarta",
    party_id:"pan", party_role:"Ketua Umum",
    positions:[
      {title:"Menko Pangan",            institution:"Kemenko Pangan RI", region:"Nasional",   start:"2024", end:null,   is_current:true},
      {title:"Menteri Perdagangan",     institution:"Kemendag RI",       region:"Nasional",   start:"2022", end:"2024", is_current:false},
      {title:"Ketua MPR RI",            institution:"MPR RI",            region:"Nasional",   start:"2014", end:"2019", is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Ketua Umum PAN dan politisi senior. Menjabat berbagai posisi strategis dari Menteri Kehutanan hingga Ketua MPR. Dikenal sebagai negosiator ulung di kancah koalisi.",
    tags:["pan","politisi-senior"],
    lhkpn_latest:95000000000, lhkpn_year:2023,
    connections_summary:"Ketum PAN, Menko Pangan",
    twitter:"@ZulkifliHasan",
    analysis:{
      ideology_score:3, populism_score:5, corruption_risk:"rendah",
      nationalism:6, religiosity:6,
      track_record:"Rekam jejak panjang di legislatif dan eksekutif. Kebijakan perdagangan dinilai pro-stabilitas harga.",
      policy_direction:"Pro-ketahanan pangan"
    }
  },
  {
    id:"yusril", name:"Yusril Ihza Mahendra", photo_url:"https://commons.wikimedia.org/wiki/Special:FilePath/Yusril_Ihza_Mahendra,_Menko_Kumham_Imipas.png?width=400", photo_placeholder:"YI",
    born:"5 Feb 1956", born_place:"Bangka", religion:"Islam",
    education:"S1 Hukum UI; PhD Hukum Tata Negara UI",
    party_id:"pbb", party_role:"Ketua Umum",
    positions:[
      {title:"Menko Hukum, HAM, Imigrasi & Pemasyarakatan", institution:"Kemenko Kumham",region:"Nasional",start:"2024",end:null,is_current:true},
      {title:"Mensesneg RI",            institution:"Setneg RI",         region:"Nasional",   start:"2004", end:"2007", is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Ahli hukum tata negara terkemuka Indonesia dan pendiri PBB. Menjabat Menko Hukum era Prabowo. Dikenal atas penguasaan hukum tata negara dan sejarah Islam Indonesia.",
    tags:["ahli-hukum","ulama","politisi-senior"],
    lhkpn_latest:30000000000, lhkpn_year:2023,
    connections_summary:"Menko Hukum, Ketum PBB, ahli hukum tata negara",
    twitter:"@Yusrilihza_mhd",
    analysis:{
      ideology_score:5, populism_score:3, corruption_risk:"rendah",
      nationalism:7, religiosity:8,
      track_record:"Akademisi dan politisi. Pernah ditetapkan tersangka KPK kasus korupsi Sistem Administrasi Badan Hukum namun akhirnya bebas.",
      policy_direction:"Reformasi hukum, nasionalis-islami"
    }
  },
  {
    id:"ahy", name:"Agus Harimurti Yudhoyono", photo_url:"https://commons.wikimedia.org/wiki/Special:FilePath/Menteri_Koordinator_Bidang_Infrastruktur_dan_Pembangunan_Kewilayahan_Indonesia_Agus_Harimurti_Yudhoyono.jpg?width=400", photo_placeholder:"AH",
    born:"10 Aug 1978", born_place:"Bandung", religion:"Islam",
    education:"Akademi Militer Magelang; Master JF Kennedy School Harvard; Master Strategic Studies, Nanyang NTU",
    party_id:"dem", party_role:"Ketua Umum",
    positions:[
      {title:"Menteri ATR/Kepala BPN",  institution:"Kemen ATR/BPN RI", region:"Nasional",    start:"2024", end:null,   is_current:true},
      {title:"Ketua Umum Partai Demokrat", institution:"DPP Demokrat", region:"Nasional",     start:"2020", end:null,   is_current:true},
    ],
    tier:"nasional", region_id:null,
    bio:"Putra sulung Presiden SBY dan Ketua Umum Partai Demokrat. Mantan Mayor TNI AD lulusan Harvard. Menjabat Menteri ATR/BPN dalam Kabinet Merah Putih Prabowo 2024.",
    tags:["eks-militer","muda","putra-presiden","demokrat"],
    lhkpn_latest:12000000000, lhkpn_year:2023,
    connections_summary:"Ketum Demokrat, Menteri ATR, putra SBY",
    twitter:"@AgusYudhoyono",
    analysis:{
      ideology_score:4, populism_score:5, corruption_risk:"rendah",
      nationalism:8, religiosity:6,
      track_record:"Karir militer singkat, terjun ke politik mengikuti jejak ayah. Berhasil mempertahankan Demokrat dari upaya kudeta Moeldoko.",
      policy_direction:"Nasionalis-reformis"
    }
  },
  {
    id:"sby", name:"Susilo Bambang Yudhoyono", photo_url:"https://commons.wikimedia.org/wiki/Special:FilePath/Susilo_Bambang_Yudhoyono,_official_presidential_portrait_(2009).jpg?width=400", photo_placeholder:"SB",
    born:"9 Sep 1949", born_place:"Pacitan", religion:"Islam",
    education:"Akademi Militer Magelang; Master Manajemen Webster University; PhD IPB",
    party_id:"dem", party_role:"Pembina",
    positions:[
      {title:"Presiden RI ke-6",        institution:"Istana Negara",    region:"Nasional",    start:"2004", end:"2014", is_current:false},
      {title:"Menkopolhukam",           institution:"Kemenko Polhukam", region:"Nasional",    start:"2000", end:"2004", is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Jenderal TNI Purn dan Presiden RI ke-6 dua periode (2004-2014). Pendiri Partai Demokrat. Era kepresidenannya diwarnai pertumbuhan ekonomi stabil dan reformasi demokrasi.",
    tags:["eks-militer","eks-presiden","demokrat"],
    lhkpn_latest:50000000000, lhkpn_year:2020,
    connections_summary:"Eks Presiden RI ke-6, pendiri Demokrat, bapak AHY",
    twitter:"@SBYudhoyono",
    analysis:{
      ideology_score:3, populism_score:6, corruption_risk:"rendah",
      nationalism:7, religiosity:7,
      track_record:"Dua periode presiden relatif stabil. Dikritik soal gaya kepemimpinan ragu-ragu dan korupsi dalam partainya.",
      policy_direction:"Nasionalis demokratis"
    }
  },
  // ─── NASIONAL — LEGISLATIF ──────────────────────────────────────────────
  {
    id:"puan", name:"Puan Maharani", photo_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Puan_Maharani.jpg/400px-Puan_Maharani.jpg", photo_placeholder:"PM",
    born:"6 Sep 1973", born_place:"Jakarta", religion:"Islam",
    education:"S1 Komunikasi FISIP UI",
    party_id:"pdip", party_role:"DPP",
    positions:[
      {title:"Ketua DPR RI",            institution:"DPR RI",           region:"Nasional",    start:"2024", end:null,   is_current:true},
      {title:"Ketua DPR RI",            institution:"DPR RI",           region:"Nasional",    start:"2019", end:"2024", is_current:false},
      {title:"Menko Pembangunan Manusia & Kebudayaan", institution:"Kemenko PMK", region:"Nasional", start:"2014", end:"2019", is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Putri Megawati Soekarnoputri dan cucu Bung Karno. Ketua DPR RI dua periode berturut-turut. Simbol dinasti politik PDIP yang dikritik karena dianggap lebih menonjolkan silsilah ketimbang kompetensi.",
    tags:["pdip","perempuan","putri-presiden","legislatif"],
    lhkpn_latest:43000000000, lhkpn_year:2023,
    connections_summary:"Ketua DPR RI, putri Megawati, cucu Bung Karno",
    twitter:"@puanmaharani99",
    analysis:{
      ideology_score:-2, populism_score:7, corruption_risk:"rendah",
      nationalism:8, religiosity:5,
      track_record:"Dua kali Ketua DPR, dinilai loyal pada PDIP dan Megawati. Berambisi capres namun elektabilitasnya stagnan.",
      policy_direction:"Nasionalis-marhaenis"
    }
  },
  {
    id:"sufmi_dasco", name:"Sufmi Dasco Ahmad", photo_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Sufmi_Dasco_Ahmad%2C_Wakil_Ketua_DPR-RI_%282024%E2%80%932029%29.jpg/400px-Sufmi_Dasco_Ahmad%2C_Wakil_Ketua_DPR-RI_%282024%E2%80%932029%29.jpg", photo_placeholder:"SD",
    born:"1972", born_place:"Sumatera Selatan", religion:"Islam",
    education:"S1 Hukum, Universitas Indonesia",
    party_id:"ger", party_role:"Sekretaris Jenderal",
    positions:[
      {title:"Wakil Ketua DPR RI",      institution:"DPR RI",           region:"Nasional",    start:"2019", end:null,   is_current:true},
      {title:"Sekretaris Jenderal Gerindra", institution:"DPP Gerindra", region:"Nasional",   start:"2020", end:null,   is_current:true},
    ],
    tier:"nasional", region_id:null,
    bio:"Lawyer dan politisi Gerindra yang menjadi Sekjen partai dan Wakil Ketua DPR. Dikenal sebagai juru bicara utama dan negosiator Gerindra di legislatif.",
    tags:["gerindra","lawyer","legislatif"],
    lhkpn_latest:55000000000, lhkpn_year:2023,
    connections_summary:"Wakil Ketua DPR, Sekjen Gerindra, lawyer",
    twitter:"@DascoAhmad",
    analysis:{
      ideology_score:5, populism_score:4, corruption_risk:"rendah",
      nationalism:7, religiosity:5,
      track_record:"Operator politik Gerindra yang handal. Berperan dalam konsolidasi koalisi pro-Prabowo.",
      policy_direction:"Nasionalis"
    }
  },
  {
    id:"airlangga", name:"Airlangga Hartarto", photo_url:"https://commons.wikimedia.org/wiki/Special:FilePath/KIM_Airlangga_Hartarto.jpg?width=400", photo_placeholder:"AH",
    born:"1 Aug 1962", born_place:"Surabaya", religion:"Islam",
    education:"S1 Teknik Mesin UGM; MBA Melbourne University",
    party_id:"gol", party_role:"mantan Ketua Umum",
    positions:[
      {title:"Menteri Koordinator Perekonomian", institution:"Kemenko Perekonomian", region:"Nasional", start:"2019", end:"2024", is_current:false},
      {title:"Ketua Umum Partai Golkar", institution:"DPP Golkar",      region:"Nasional",    start:"2017", end:"2024", is_current:false},
      {title:"Menteri Perindustrian",    institution:"Kemenperin RI",    region:"Nasional",    start:"2016", end:"2019", is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Putra mantan Menteri Hartarto. Mantan Ketua Umum Golkar dan Menko Perekonomian era Jokowi. Mundur dari Ketum Golkar setelah tekanan internal dan digantikan Bahlil Lahadalia.",
    tags:["golkar","pengusaha","teknokrat","putra-menteri"],
    lhkpn_latest:220000000000, lhkpn_year:2023,
    connections_summary:"Mantan Ketum Golkar, eks-Menko Perekonomian",
    twitter:"@airlangga_hrt",
    analysis:{
      ideology_score:3, populism_score:3, corruption_risk:"sedang",
      nationalism:6, religiosity:4,
      track_record:"Kelola ekonomi RI melewati pandemi COVID-19. Diduga terlibat kasus korupsi minyak goreng namun tidak tersangka resmi.",
      policy_direction:"Pro-investasi, pragmatis"
    }
  },
  {
    id:"cakimin", name:"Muhaimin Iskandar", photo_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Muhaimin_Iskandar%2C_Candidate_for_Indonesia%27s_Vice_President_in_2024.jpg/400px-Muhaimin_Iskandar%2C_Candidate_for_Indonesia%27s_Vice_President_in_2024.jpg", photo_placeholder:"MI",
    born:"24 Sep 1966", born_place:"Jombang", religion:"Islam",
    education:"S1 Ilmu Sosial, UGM",
    party_id:"pkb", party_role:"Ketua Umum",
    positions:[
      {title:"Wakil Ketua DPR RI",      institution:"DPR RI",           region:"Nasional",    start:"2024", end:null,   is_current:true},
      {title:"Ketua Umum PKB",          institution:"DPP PKB",          region:"Nasional",    start:"2005", end:null,   is_current:true},
      {title:"Calon Wakil Presiden",    institution:"KPU RI",           region:"Nasional",    start:"2024", end:"2024", is_current:false},
      {title:"Menteri Tenaga Kerja",    institution:"Kemenaker RI",     region:"Nasional",    start:"2009", end:"2014", is_current:false},
    ],
    tier:"nasional", region_id:"jawa-timur",
    bio:"Cucu KH Bisri Syansuri dan keponakan Gus Dur. Ketua Umum PKB sejak 2005, menjadi cawapres Anies Baswedan pada Pilpres 2024. Dikenal sebagai Cak Imin, figur sentral Islam-Nahdlatul Ulama.",
    tags:["ulama","pkb","jatim","nu"],
    lhkpn_latest:22000000000, lhkpn_year:2023,
    connections_summary:"Ketum PKB, Wakil Ketua DPR, Cawapres 2024, Jombang",
    twitter:"@cakiminow",
    analysis:{
      ideology_score:-1, populism_score:8, corruption_risk:"sedang",
      nationalism:6, religiosity:9,
      track_record:"Pemimpin PKB selama dua dekade. Pernah berkonflik dengan Gus Dur. Kasus korupsi transmigrasi pernah muncul namun tidak berlanjut.",
      policy_direction:"Nasionalis-religius, pro-NU"
    }
  },
  {
    id:"ahmad_syaikhu", name:"Ahmad Syaikhu", photo_url:"https://commons.wikimedia.org/wiki/Special:FilePath/KPU_Ahmad_Syaikhu.jpg?width=400", photo_placeholder:"AS",
    born:"1965", born_place:"Bekasi", religion:"Islam",
    education:"S1 Teknik Sipil, ITB",
    party_id:"pks", party_role:"Presiden Partai",
    positions:[
      {title:"Presiden PKS",            institution:"DPP PKS",          region:"Nasional",    start:"2020", end:null,   is_current:true},
      {title:"Wakil Bupati Bekasi",     institution:"Pemkab Bekasi",    region:"Jawa Barat",  start:"2017", end:"2020", is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Insinyur sipil yang menjadi Presiden Partai PKS. Dikenal sebagai figur bersih dan konsisten memperjuangkan nilai-nilai Islam dalam politik Indonesia.",
    tags:["ulama","pks","bersih"],
    lhkpn_latest:5000000000, lhkpn_year:2023,
    connections_summary:"Presiden PKS, mantan Wakil Bupati Bekasi",
    twitter:"@ahmadsyaikhu_",
    analysis:{
      ideology_score:7, populism_score:5, corruption_risk:"rendah",
      nationalism:6, religiosity:9,
      track_record:"Reputasi bersih di PKS. Konsisten pada posisi oposisi dan kritik terhadap kebijakan pemerintah.",
      policy_direction:"Islam, keadilan sosial"
    }
  },
  {
    id:"surya_paloh", name:"Surya Paloh", photo_url:"https://commons.wikimedia.org/wiki/Special:FilePath/Surya_Dharma_Paloh.jpg?width=400", photo_placeholder:"SP",
    born:"16 Jul 1951", born_place:"Aceh", religion:"Islam",
    education:"S1 Hukum, Universitas Indonesia",
    party_id:"nas", party_role:"Ketua Umum",
    positions:[
      {title:"Ketua Umum NasDem",       institution:"DPP NasDem",       region:"Nasional",    start:"2013", end:null,   is_current:true},
      {title:"Pemilik Metro TV",        institution:"Media Group",       region:"Nasional",    start:"2000", end:null,   is_current:true},
    ],
    tier:"nasional", region_id:null,
    bio:"Pengusaha media dan pendiri Partai NasDem. Pemilik Metro TV dan sejumlah media nasional. Mengusung Anies Baswedan sebagai capres 2024 setelah berseberangan dengan Jokowi.",
    tags:["pengusaha","media","nasdem"],
    lhkpn_latest:1200000000000, lhkpn_year:2023,
    connections_summary:"Ketum NasDem, pemilik Metro TV, usung Anies 2024",
    twitter:"@SuryaPaloh",
    analysis:{
      ideology_score:1, populism_score:5, corruption_risk:"rendah",
      nationalism:7, religiosity:4,
      track_record:"Awalnya pendukung Jokowi, berseberangan 2023. Dukung Anies Baswedan untuk Pilpres 2024.",
      policy_direction:"Nasionalis demokratis, pro-media bebas"
    }
  },
  {
    id:"megawati", name:"Megawati Soekarnoputri", photo_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Megawati_Soekarnoputri.jpg/400px-Megawati_Soekarnoputri.jpg", photo_placeholder:"MS",
    born:"23 Jan 1947", born_place:"Yogyakarta", religion:"Islam",
    education:"S1 Pertanian, Universitas Padjadjaran (tidak selesai)",
    party_id:"pdip", party_role:"Ketua Umum",
    positions:[
      {title:"Presiden RI ke-5",        institution:"Istana Negara",    region:"Nasional",    start:"2001", end:"2004", is_current:false},
      {title:"Ketua Umum PDIP",         institution:"DPP PDIP",         region:"Nasional",    start:"1999", end:null,   is_current:true},
      {title:"Wakil Presiden RI",       institution:"Istana Wapres",    region:"Nasional",    start:"1999", end:"2001", is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Putri Presiden Soekarno dan Presiden RI ke-5. Ketua Umum PDIP sejak 1999. Salah satu figur paling berpengaruh dalam sejarah demokrasi Indonesia pasca-Reformasi.",
    tags:["pdip","eks-presiden","putri-proklamator","perempuan"],
    lhkpn_latest:36000000000, lhkpn_year:2023,
    connections_summary:"Ketum PDIP, Presiden RI ke-5, putri Bung Karno, ibu Puan",
    twitter:null,
    analysis:{
      ideology_score:-5, populism_score:7, corruption_risk:"rendah",
      nationalism:9, religiosity:4,
      track_record:"Era kepresidenan relatif singkat tapi stabil. Kini lebih banyak di balik layar menentukan arah PDIP. Berseberangan dengan Jokowi-Prabowo.",
      policy_direction:"Nasionalis-marhaenis, Soekarnoisme"
    }
  },
  {
    id:"anies", name:"Anies Baswedan", photo_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Anies_Baswedan_2024.jpg/400px-Anies_Baswedan_2024.jpg", photo_placeholder:"AB",
    born:"7 May 1969", born_place:"Kuningan", religion:"Islam",
    education:"S1 Ekonomi UGM; MA Ilmu Kebijakan, University of Maryland; PhD Ilmu Pemerintahan, UMD",
    party_id:null, party_role:null,
    positions:[
      {title:"Calon Presiden RI",       institution:"KPU RI",           region:"Nasional",    start:"2024", end:"2024", is_current:false},
      {title:"Gubernur DKI Jakarta",    institution:"Pemprov DKI",      region:"DKI Jakarta", start:"2017", end:"2022", is_current:false},
      {title:"Menteri Pendidikan & Kebudayaan", institution:"Kemendikbud RI", region:"Nasional", start:"2014", end:"2016", is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Akademisi dan politisi yang meraih 24.95% suara Pilpres 2024. Mantan Mendikbud dan Gubernur DKI Jakarta. Dikenal sebagai figur oposisi dengan retorika demokratis yang kuat.",
    tags:["akademisi","oposisi","capres","mantan-gubernur"],
    lhkpn_latest:12000000000, lhkpn_year:2022,
    connections_summary:"Capres 2024, eks-Gub DKI, eks-Mendikbud, didukung NasDem-PKS-PKB",
    twitter:"@aniesbaswedan",
    analysis:{
      ideology_score:2, populism_score:9, corruption_risk:"sedang",
      nationalism:7, religiosity:7,
      track_record:"Gubernur DKI penuh kontroversi: proyek Tanah Abang, Formula E, reklamasi. Didukung koalisi beragam ideologi dari Islam konservatif hingga liberal.",
      policy_direction:"Demokrasi substantif, keadilan sosial"
    }
  },
  {
    id:"ganjar", name:"Ganjar Pranowo", photo_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Ganjar_Pranowo_Candidate_for_Indonesia%27s_President_in_2024.jpg/400px-Ganjar_Pranowo_Candidate_for_Indonesia%27s_President_in_2024.jpg", photo_placeholder:"GP",
    born:"28 Oct 1968", born_place:"Karanganyar", religion:"Islam",
    education:"S1 Hukum, Universitas Gadjah Mada",
    party_id:"pdip", party_role:"Anggota",
    positions:[
      {title:"Calon Presiden RI",       institution:"KPU RI",           region:"Nasional",    start:"2024", end:"2024", is_current:false},
      {title:"Gubernur Jawa Tengah",    institution:"Pemprov Jateng",   region:"Jawa Tengah", start:"2013", end:"2023", is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Mantan Gubernur Jawa Tengah dua periode yang diusung PDIP sebagai capres 2024. Meraih 16.47% suara dan kalah dari Prabowo. Dikenal sebagai politisi yang cerdas dan humoris.",
    tags:["pdip","eks-gubernur","capres"],
    lhkpn_latest:28000000000, lhkpn_year:2022,
    connections_summary:"Capres 2024 (PDIP), eks-Gubernur Jateng",
    twitter:"@ganjarpranowo",
    analysis:{
      ideology_score:-2, populism_score:8, corruption_risk:"sedang",
      nationalism:7, religiosity:5,
      track_record:"Dua periode gubernur dengan Jateng membaik di berbagai indikator. Kontroversial soal e-KTP dan penundaan pemilu.",
      policy_direction:"Sosial-demokrat, pro-rakyat kecil"
    }
  },
  {
    id:"sultan_najamudin", name:"Sultan B. Najamudin", photo_url:null, photo_placeholder:"SN",
    born:"1975", born_place:"Bengkulu", religion:"Islam",
    education:"S1 Hukum, Universitas Indonesia",
    party_id:null, party_role:null,
    positions:[
      {title:"Ketua DPD RI",            institution:"DPD RI",           region:"Nasional",    start:"2024", end:null,   is_current:true},
      {title:"Wakil Gubernur Bengkulu", institution:"Pemprov Bengkulu", region:"Bengkulu",    start:"2010", end:"2015", is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Ketua DPD RI yang mewakili kepentingan daerah. Mantan Wakil Gubernur Bengkulu dengan latar belakang hukum.",
    tags:["dpd","bengkulu"],
    lhkpn_latest:18000000000, lhkpn_year:2023,
    connections_summary:"Ketua DPD RI",
    twitter:null,
    analysis:{
      ideology_score:0, populism_score:4, corruption_risk:"rendah",
      nationalism:6, religiosity:5,
      track_record:"Figur moderat dalam DPD. Fokus pada otonomi daerah.",
      policy_direction:"Otonomi daerah, desentralisasi"
    }
  },
  // ─── NASIONAL — HUKUM & KEAMANAN ────────────────────────────────────────
  {
    id:"listyo_sigit", name:"Listyo Sigit Prabowo", photo_url:null, photo_placeholder:"LS",
    born:"5 May 1969", born_place:"Ambon", religion:"Kristen",
    education:"Akademi Kepolisian 1991",
    party_id:null, party_role:null,
    positions:[
      {title:"Kapolri",                 institution:"Mabes Polri",      region:"Nasional",    start:"2021", end:null,   is_current:true},
      {title:"Kabareskrim",             institution:"Mabes Polri",      region:"Nasional",    start:"2020", end:"2021", is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Kapolri sejak 2021. Mantan Kabareskrim yang dikenal dekat dengan Presiden Jokowi. Polisi Kristen pertama yang menjabat Kapolri. Menghadapi berbagai kontroversi terkait kasus Ferdy Sambo dan penanganan unjuk rasa.",
    tags:["polri","keamanan"],
    lhkpn_latest:18000000000, lhkpn_year:2023,
    connections_summary:"Kapolri, dekat Jokowi, eks-Kabareskrim",
    twitter:null,
    analysis:{
      ideology_score:0, populism_score:3, corruption_risk:"sedang",
      nationalism:8, religiosity:3,
      track_record:"Era Kapolrinya diwarnai kasus Ferdy Sambo dan isu polisi bayar promosi jabatan. Pengungkapan teroris cukup aktif.",
      policy_direction:"Penegakan hukum, ketertiban"
    }
  },
  {
    id:"agus_subiyanto", name:"Agus Subiyanto", photo_url:null, photo_placeholder:"AB",
    born:"5 Aug 1967", born_place:"Cimahi", religion:"Islam",
    education:"Akademi Militer Magelang 1991",
    party_id:null, party_role:null,
    positions:[
      {title:"Panglima TNI",            institution:"Mabes TNI",        region:"Nasional",    start:"2023", end:null,   is_current:true},
      {title:"Kepala Staf Angkatan Darat (KSAD)", institution:"Mabes AD", region:"Nasional",  start:"2023", end:"2023", is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Panglima TNI sejak November 2023. Jenderal TNI Angkatan Darat yang dipercaya Jokowi di penghujung masa jabatannya. Dekat dengan Prabowo Subianto dari era Kopassus.",
    tags:["tni","keamanan"],
    lhkpn_latest:9000000000, lhkpn_year:2023,
    connections_summary:"Panglima TNI, eks-KSAD, dekat Prabowo",
    twitter:null,
    analysis:{
      ideology_score:3, populism_score:2, corruption_risk:"rendah",
      nationalism:9, religiosity:6,
      track_record:"Rekam jejak militer solid. Prioritas modernisasi alutsista dan TNI profesional.",
      policy_direction:"Pertahanan nasional, keamanan"
    }
  },
  {
    id:"nawawi", name:"Nawawi Pomolango", photo_url:null, photo_placeholder:"NP",
    born:"1961", born_place:"Gorontalo", religion:"Islam",
    education:"S1 Hukum, Universitas Indonesia",
    party_id:null, party_role:null,
    positions:[
      {title:"Ketua KPK RI",            institution:"KPK RI",           region:"Nasional",    start:"2023", end:null,   is_current:true},
    ],
    tier:"nasional", region_id:null,
    bio:"Ketua KPK sejak 2023. Hakim karir yang dipercaya memimpin lembaga antikorupsi Indonesia di tengah berbagai kontroversi pasca-revisi UU KPK.",
    tags:["antikorupsi","hukum"],
    lhkpn_latest:8000000000, lhkpn_year:2023,
    connections_summary:"Ketua KPK RI",
    twitter:null,
    analysis:{
      ideology_score:2, populism_score:2, corruption_risk:"rendah",
      nationalism:6, religiosity:6,
      track_record:"Berusaha menjaga independensi KPK pasca-pelemahan UU. Menghadapi kritik soal kinerja KPK yang menurun.",
      policy_direction:"Penegakan hukum antikorupsi"
    }
  },
  {
    id:"sunarto", name:"Sunarto", photo_url:null, photo_placeholder:"SR",
    born:"1962", born_place:"Yogyakarta", religion:"Islam",
    education:"S1 Hukum, Universitas Gadjah Mada",
    party_id:null, party_role:null,
    positions:[
      {title:"Ketua Mahkamah Agung",    institution:"MA RI",            region:"Nasional",    start:"2023", end:null,   is_current:true},
    ],
    tier:"nasional", region_id:null,
    bio:"Ketua Mahkamah Agung sejak 2023. Hakim agung karir dengan pengalaman panjang di lingkungan peradilan Indonesia.",
    tags:["hukum","peradilan"],
    lhkpn_latest:12000000000, lhkpn_year:2023,
    connections_summary:"Ketua Mahkamah Agung RI",
    twitter:null,
    analysis:{
      ideology_score:2, populism_score:1, corruption_risk:"rendah",
      nationalism:5, religiosity:6,
      track_record:"Fokus reformasi peradilan dan transparansi MA.",
      policy_direction:"Reformasi peradilan"
    }
  },
  {
    id:"suhartoyo", name:"Suhartoyo", photo_url:null, photo_placeholder:"SH",
    born:"1965", born_place:"Sleman", religion:"Islam",
    education:"S1 Hukum, Universitas Gadjah Mada",
    party_id:null, party_role:null,
    positions:[
      {title:"Ketua Mahkamah Konstitusi", institution:"MK RI",          region:"Nasional",    start:"2023", end:null,   is_current:true},
    ],
    tier:"nasional", region_id:null,
    bio:"Ketua MK yang menggantikan Anwar Usman setelah putusan MKMK terkait konflik kepentingan Pilpres 2024. Hakim karir yang dikenal independen.",
    tags:["hukum","mk"],
    lhkpn_latest:7000000000, lhkpn_year:2023,
    connections_summary:"Ketua MK RI, gantikan Anwar Usman",
    twitter:null,
    analysis:{
      ideology_score:1, populism_score:1, corruption_risk:"rendah",
      nationalism:5, religiosity:6,
      track_record:"Diangkat sebagai Ketua MK pengganti. Diharapkan pulihkan marwah MK pasca-kontroversi Pilpres 2024.",
      policy_direction:"Konstitusional, independen"
    }
  },
  // ─── JAWA TIMUR — PROVINSI ───────────────────────────────────────────────
  {
    id:"khofifah", name:"Khofifah Indar Parawansa", photo_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Khofifah_Indar_Parawansa.jpg/400px-Khofifah_Indar_Parawansa.jpg", photo_placeholder:"KI",
    born:"19 May 1965", born_place:"Surabaya", religion:"Islam",
    education:"S1 FISIP Unair; S2 Administrasi Negara, Universitas Brawijaya",
    party_id:"pkb", party_role:"Anggota",
    positions:[
      {title:"Gubernur Jawa Timur",     institution:"Pemprov Jatim",    region:"Jawa Timur",  start:"2019", end:null,   is_current:true},
      {title:"Menteri Sosial",          institution:"Kemensos RI",      region:"Nasional",    start:"2014", end:"2018", is_current:false},
      {title:"Ketua Umum PP Muslimat NU", institution:"PP Muslimat NU", region:"Nasional",   start:"2000", end:null,   is_current:true},
    ],
    tier:"provinsi", region_id:"jawa-timur",
    bio:"Gubernur Jawa Timur sejak 2019, terpilih kembali 2024. Mantan Menteri Sosial 2014-2018. Dikenal sebagai tokoh perempuan NU yang berpengaruh. Ketua Umum PP Muslimat NU.",
    tags:["ulama","jatim","perempuan","nu","gubernur"],
    lhkpn_latest:10200000000, lhkpn_year:2023,
    connections_summary:"Gubernur Jatim, Ketum Muslimat NU, eks-Mensos",
    twitter:"@KhofifahIP",
    analysis:{
      ideology_score:-2, populism_score:7, corruption_risk:"rendah",
      nationalism:7, religiosity:9,
      track_record:"Gubernur populer di Jatim dengan program sosial dan NU. Berhasil turunkan angka kemiskinan meski masih tinggi.",
      policy_direction:"Sosial-religius, nasionalis-NU"
    }
  },
  {
    id:"emil_dardak", name:"Emil Elestianto Dardak", photo_url:null, photo_placeholder:"ED",
    born:"20 Oct 1985", born_place:"Tokyo", religion:"Islam",
    education:"S1 Teknik Sipil, University of Tokyo; S2 Pembangunan Ekonomi, Keio University",
    party_id:"dem", party_role:"Anggota",
    positions:[
      {title:"Wakil Gubernur Jawa Timur", institution:"Pemprov Jatim",  region:"Jawa Timur",  start:"2019", end:null,   is_current:true},
      {title:"Bupati Trenggalek",        institution:"Pemkab Trenggalek", region:"Jawa Timur", start:"2016", end:"2019", is_current:false},
    ],
    tier:"provinsi", region_id:"jawa-timur",
    bio:"Wakil Gubernur Jatim dari Partai Demokrat. Ekonom lulusan Jepang yang menjadi Bupati Trenggalek di usia muda. Menantu Hary Tanoesoedibjo, pemilik MNC Group.",
    tags:["muda","jatim","teknokrat","demokrat"],
    lhkpn_latest:35000000000, lhkpn_year:2023,
    connections_summary:"Wagub Jatim, menantu Hary Tanoesoedibjo (MNC Group)",
    twitter:"@EmilDardak",
    analysis:{
      ideology_score:3, populism_score:6, corruption_risk:"rendah",
      nationalism:6, religiosity:5,
      track_record:"Bupati Trenggalek inovatif, populer di generasi muda. Berambisi Gubernur Jatim.",
      policy_direction:"Pro-investasi, teknokrat"
    }
  },
  {
    id:"hasan_aminuddin", name:"Hasan Aminuddin", photo_url:null, photo_placeholder:"HA",
    born:"1968", born_place:"Probolinggo", religion:"Islam",
    education:"S1 Pertanian, Universitas Brawijaya",
    party_id:"nas", party_role:"Anggota",
    positions:[
      {title:"Wakil Gubernur Jatim (periode sebelumnya)", institution:"Pemprov Jatim", region:"Jawa Timur", start:"2014", end:"2019", is_current:false},
      {title:"Bupati Probolinggo",      institution:"Pemkab Probolinggo", region:"Jawa Timur", start:"2008", end:"2018", is_current:false},
    ],
    tier:"provinsi", region_id:"jawa-timur",
    bio:"Mantan Wakil Gubernur Jatim dan Bupati Probolinggo. Terjerat kasus korupsi jual beli jabatan perangkat desa Probolinggo bersama istrinya. Divonis bersalah oleh pengadilan.",
    tags:["jatim","korupsi","terpidana"],
    lhkpn_latest:null, lhkpn_year:null,
    connections_summary:"Mantan Wagub Jatim, terpidana kasus Probolinggo bersama istri",
    twitter:null,
    analysis:{
      ideology_score:2, populism_score:5, corruption_risk:"terpidana",
      nationalism:4, religiosity:5,
      track_record:"Terbukti korupsi jual beli jabatan. Dijatuhkan hukuman penjara bersama istri Puput Tantriana Sari.",
      policy_direction:"N/A"
    }
  },
  // ─── JATIM — DPR RI ─────────────────────────────────────────────────────
  {
    id:"faisol_riza", name:"Faisol Riza", photo_url:null, photo_placeholder:"FR",
    born:"1970", born_place:"Jember", religion:"Islam",
    education:"Pondok Pesantren; S1 Ilmu Politik",
    party_id:"pkb", party_role:"Anggota DPR RI",
    positions:[
      {title:"Anggota DPR RI",          institution:"DPR RI",           region:"Jawa Timur",  start:"2019", end:null,   is_current:true},
    ],
    tier:"nasional", region_id:"jawa-timur",
    bio:"Anggota DPR RI dari PKB Dapil Jatim X (Jember-Lumajang). Kader PKB berlatar belakang pesantren yang aktif di Komisi bidang Pendidikan.",
    tags:["jatim","pkb","legislatif","santri"],
    lhkpn_latest:3000000000, lhkpn_year:2023,
    connections_summary:"DPR RI Dapil Jatim X, kader PKB Jember",
    twitter:null,
    analysis:{
      ideology_score:-1, populism_score:5, corruption_risk:"rendah",
      nationalism:5, religiosity:8,
      track_record:"Anggota DPR aktif fokus pada pendidikan dan pesantren.",
      policy_direction:"Pro-pesantren, nasionalis-NU"
    }
  },
  {
    id:"ahmad_muzani", name:"Ahmad Muzani", photo_url:null, photo_placeholder:"AM",
    born:"1968", born_place:"Lampung", religion:"Islam",
    education:"S1 Ilmu Sosial",
    party_id:"ger", party_role:"Sekretaris Jenderal",
    positions:[
      {title:"Ketua MPR RI",            institution:"MPR RI",           region:"Nasional",    start:"2024", end:null,   is_current:true},
      {title:"Sekretaris Jenderal Gerindra", institution:"DPP Gerindra", region:"Nasional",   start:"2008", end:null,   is_current:true},
    ],
    tier:"nasional", region_id:null,
    bio:"Sekjen Gerindra dan salah satu loyalis paling setia Prabowo Subianto. Kini menjabat Ketua MPR RI periode 2024-2029.",
    tags:["gerindra","legislatif","loyalis-prabowo"],
    lhkpn_latest:7000000000, lhkpn_year:2023,
    connections_summary:"Ketua MPR RI, Sekjen Gerindra",
    twitter:"@ahmadmuzani",
    analysis:{
      ideology_score:5, populism_score:5, corruption_risk:"rendah",
      nationalism:7, religiosity:5,
      track_record:"Operator politik Gerindra yang andal. Konsisten mendukung Prabowo dari 2009.",
      policy_direction:"Nasionalis"
    }
  },
  {
    id:"gatot_nurmantyo", name:"Gatot Subroto Nurmantyo", photo_url:null, photo_placeholder:"GN",
    born:"13 Mar 1960", born_place:"Tegal", religion:"Islam",
    education:"Akademi Militer Magelang 1982; Sesko TNI",
    party_id:null, party_role:null,
    positions:[
      {title:"Panglima TNI",            institution:"Mabes TNI",        region:"Nasional",    start:"2015", end:"2017", is_current:false},
      {title:"KSAD",                    institution:"Mabes AD",         region:"Nasional",    start:"2014", end:"2015", is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Mantan Panglima TNI era Jokowi yang dicopot lebih awal. Kini aktif di ormas dan gerakan sipil, sering memberikan pernyataan kritis terhadap pemerintah.",
    tags:["eks-militer","ormas","kritis"],
    lhkpn_latest:12000000000, lhkpn_year:2017,
    connections_summary:"Eks-Panglima TNI, aktif di gerakan sipil, kritis pemerintah",
    twitter:"@GatotNurmantyo",
    analysis:{
      ideology_score:6, populism_score:7, corruption_risk:"rendah",
      nationalism:9, religiosity:8,
      track_record:"Panglima TNI yang provokatif soal ideologi dan ancaman komunisme. Dicopot Jokowi sebelum masa jabatan selesai.",
      policy_direction:"Nasionalis-religius, konservatif"
    }
  },
  {
    id:"cucun_syamsurijal", name:"Cucun Ahmad Syamsurijal", photo_url:null, photo_placeholder:"CS",
    born:"1975", born_place:"Bandung", religion:"Islam",
    education:"S1 Ilmu Politik",
    party_id:"pkb", party_role:"Anggota DPR RI",
    positions:[
      {title:"Wakil Ketua DPR RI",      institution:"DPR RI",           region:"Nasional",    start:"2024", end:null,   is_current:true},
    ],
    tier:"nasional", region_id:null,
    bio:"Politisi PKB yang menjabat Wakil Ketua DPR RI. Mewakili PKB dalam kepemimpinan legislatif bersama koalisi pemerintah.",
    tags:["pkb","legislatif"],
    lhkpn_latest:6000000000, lhkpn_year:2023,
    connections_summary:"Wakil Ketua DPR RI, kader PKB",
    twitter:null,
    analysis:{
      ideology_score:-1, populism_score:4, corruption_risk:"rendah",
      nationalism:5, religiosity:7,
      track_record:"Karir legislatif di PKB. Fokus pada kepentingan basis NU.",
      policy_direction:"Nasionalis-religius"
    }
  },
  // ─── JATIM — DPD ────────────────────────────────────────────────────────
  {
    id:"lia_istifhama", name:"Lia Istifhama", photo_url:null, photo_placeholder:"LI",
    born:"1985", born_place:"Surabaya", religion:"Islam",
    education:"S1 Ilmu Komunikasi, Universitas Airlangga",
    party_id:null, party_role:null,
    positions:[
      {title:"Anggota DPD RI",          institution:"DPD RI",           region:"Jawa Timur",  start:"2024", end:null,   is_current:true},
    ],
    tier:"nasional", region_id:"jawa-timur",
    bio:"Anggota DPD RI dari Jawa Timur, berlatar belakang pengusaha dan aktivis. Fokus pada isu pemberdayaan perempuan dan UMKM di Jatim.",
    tags:["jatim","dpd","perempuan","aktivis","pengusaha"],
    lhkpn_latest:5000000000, lhkpn_year:2023,
    connections_summary:"DPD RI Jawa Timur, pengusaha-aktivis",
    twitter:null,
    analysis:{
      ideology_score:0, populism_score:5, corruption_risk:"rendah",
      nationalism:5, religiosity:6,
      track_record:"Representasi Jatim di DPD, fokus UMKM dan perempuan.",
      policy_direction:"Pemberdayaan ekonomi rakyat"
    }
  },
  // ─── JATIM — KEAMANAN ────────────────────────────────────────────────────
  {
    id:"imam_sugianto", name:"Imam Sugianto", photo_url:null, photo_placeholder:"IS",
    born:"1968", born_place:"Jawa Timur", religion:"Islam",
    education:"Akademi Kepolisian",
    party_id:null, party_role:null,
    positions:[
      {title:"Kapolda Jawa Timur",      institution:"Polda Jatim",      region:"Jawa Timur",  start:"2023", end:null,   is_current:true},
    ],
    tier:"provinsi", region_id:"jawa-timur",
    bio:"Kepala Kepolisian Daerah Jawa Timur. Pejabat Polri senior yang memimpin pengamanan di salah satu provinsi terbesar Indonesia.",
    tags:["polri","jatim","keamanan"],
    lhkpn_latest:8000000000, lhkpn_year:2023,
    connections_summary:"Kapolda Jatim",
    twitter:null,
    analysis:{
      ideology_score:0, populism_score:2, corruption_risk:"rendah",
      nationalism:7, religiosity:5,
      track_record:"Pengamanan Jatim terutama menjelang Pilkada 2024.",
      policy_direction:"Ketertiban, keamanan"
    }
  },
  {
    id:"rudy_saladin", name:"Rudy Saladin", photo_url:null, photo_placeholder:"RS",
    born:"1968", born_place:"Jawa Barat", religion:"Islam",
    education:"Akademi Militer Magelang",
    party_id:null, party_role:null,
    positions:[
      {title:"Pangdam V/Brawijaya",     institution:"Kodam V/Brawijaya", region:"Jawa Timur",  start:"2023", end:null,   is_current:true},
    ],
    tier:"provinsi", region_id:"jawa-timur",
    bio:"Panglima Kodam V/Brawijaya yang membawahi wilayah pertahanan Jawa Timur. Jenderal TNI AD yang memimpin kekuatan militer terbesar di Pulau Jawa.",
    tags:["tni","jatim","keamanan"],
    lhkpn_latest:6000000000, lhkpn_year:2023,
    connections_summary:"Pangdam V/Brawijaya",
    twitter:null,
    analysis:{
      ideology_score:2, populism_score:1, corruption_risk:"rendah",
      nationalism:9, religiosity:6,
      track_record:"Komando militer Jatim yang aktif mendukung stabilitas daerah.",
      policy_direction:"Pertahanan, stabilitas wilayah"
    }
  },
  // ─── JATIM — KABUPATEN/KOTA ──────────────────────────────────────────────
  {
    id:"eri_cahyadi", name:"Eri Cahyadi", photo_url:null, photo_placeholder:"EC",
    born:"1980", born_place:"Surabaya", religion:"Islam",
    education:"S1 Teknik Sipil, ITS Surabaya",
    party_id:"pdip", party_role:"Anggota",
    positions:[
      {title:"Walikota Surabaya",       institution:"Pemkot Surabaya",  region:"Surabaya",    start:"2021", end:null,   is_current:true},
    ],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Walikota Surabaya termuda, kader PDIP yang menggantikan Tri Rismaharini. Dikenal dengan program berbasis teknologi dan komunitas urban Surabaya.",
    tags:["jatim","surabaya","muda","pdip"],
    lhkpn_latest:3500000000, lhkpn_year:2023,
    connections_summary:"Walikota Surabaya, kader PDIP, eks-birokrat Pemkot",
    twitter:"@EriCahyadi",
    analysis:{
      ideology_score:-1, populism_score:7, corruption_risk:"rendah",
      nationalism:6, religiosity:5,
      track_record:"Melanjutkan program Risma, dorong digitalisasi kota. Populer di kalangan muda urban.",
      policy_direction:"Pro-rakyat kota, digital governance"
    }
  },
  {
    id:"gus_muhdlor", name:"Ahmad Muhdlor Ali", photo_url:null, photo_placeholder:"GM",
    born:"1990", born_place:"Sidoarjo", religion:"Islam",
    education:"S1 Ekonomi, Universitas Airlangga",
    party_id:"pkb", party_role:"Anggota",
    positions:[
      {title:"Bupati Sidoarjo",         institution:"Pemkab Sidoarjo",  region:"Sidoarjo",    start:"2021", end:null,   is_current:true},
    ],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Bupati Sidoarjo yang ditetapkan tersangka KPK dalam kasus pemotongan dan pemungutan insentif ASN di lingkungan BPBD Sidoarjo (2024). Anggota keluarga pesantren asal Sidoarjo.",
    tags:["jatim","sidoarjo","korupsi","tersangka","pkb"],
    lhkpn_latest:8000000000, lhkpn_year:2022,
    connections_summary:"Bupati Sidoarjo, tersangka KPK 2024, kader PKB",
    twitter:null,
    analysis:{
      ideology_score:0, populism_score:6, corruption_risk:"tersangka",
      nationalism:5, religiosity:7,
      track_record:"Tersangka KPK kasus pemotongan insentif ASN BPBD Sidoarjo. Proses hukum berjalan 2024.",
      policy_direction:"N/A (sedang proses hukum)"
    }
  },
  {
    id:"fandi_yani", name:"Fandi Akhmad Yani", photo_url:null, photo_placeholder:"FY",
    born:"1988", born_place:"Gresik", religion:"Islam",
    education:"S1 Ilmu Hukum",
    party_id:"pkb", party_role:"Anggota",
    positions:[
      {title:"Bupati Gresik",           institution:"Pemkab Gresik",    region:"Gresik",      start:"2021", end:null,   is_current:true},
    ],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Bupati Gresik yang merupakan cucu Pahlawan Nasional Jenderal Ahmad Yani. Politisi muda PKB yang dikenal dengan program pembangunan pesisir dan industri di Gresik.",
    tags:["jatim","gresik","pkb","muda","cucu-pahlawan"],
    lhkpn_latest:4000000000, lhkpn_year:2023,
    connections_summary:"Bupati Gresik, cucu Jend. Ahmad Yani",
    twitter:null,
    analysis:{
      ideology_score:0, populism_score:5, corruption_risk:"rendah",
      nationalism:7, religiosity:6,
      track_record:"Kepemimpinan muda di Gresik, dorong investasi kawasan industri.",
      policy_direction:"Pro-industri, pembangunan pesisir"
    }
  },
  {
    id:"ipuk", name:"Ipuk Fiestiandani Azwar Anas", photo_url:null, photo_placeholder:"IF",
    born:"1977", born_place:"Banyuwangi", religion:"Islam",
    education:"S1 Ilmu Komunikasi, Universitas Airlangga",
    party_id:"pdip", party_role:"Anggota",
    positions:[
      {title:"Bupati Banyuwangi",       institution:"Pemkab Banyuwangi", region:"Banyuwangi", start:"2021", end:null,   is_current:true},
    ],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Bupati Banyuwangi yang melanjutkan kepemimpinan suaminya, Abdullah Azwar Anas. Berhasil mempertahankan predikat Kabupaten Inovatif yang dibangun oleh pendahulunya.",
    tags:["jatim","banyuwangi","perempuan","pdip"],
    lhkpn_latest:3000000000, lhkpn_year:2023,
    connections_summary:"Bupati Banyuwangi, istri Azwar Anas (Menteri PAN-RB)",
    twitter:"@Ipuk_F_Anas",
    analysis:{
      ideology_score:-2, populism_score:6, corruption_risk:"rendah",
      nationalism:5, religiosity:5,
      track_record:"Lanjutkan program inovasi Banyuwangi. Kota Banyuwangi dikenal sebagai best practice tata kota.",
      policy_direction:"Pro-pariwisata, inovasi daerah"
    }
  },
  {
    id:"azwar_anas", name:"Abdullah Azwar Anas", photo_url:null, photo_placeholder:"AA",
    born:"1972", born_place:"Banyuwangi", religion:"Islam",
    education:"S1 Hukum, Universitas Brawijaya",
    party_id:"pdip", party_role:"Anggota",
    positions:[
      {title:"Menteri PAN-RB",          institution:"Kemenpan-RB RI",   region:"Nasional",    start:"2022", end:null,   is_current:true},
      {title:"Bupati Banyuwangi",       institution:"Pemkab Banyuwangi", region:"Banyuwangi", start:"2010", end:"2021", is_current:false},
    ],
    tier:"nasional", region_id:"jawa-timur",
    bio:"Mantan Bupati Banyuwangi dua periode yang dikenal dengan transformasi tata kota dan pariwisata. Kini Menteri PAN-RB bertanggung jawab reformasi birokrasi nasional.",
    tags:["jatim","banyuwangi","pdip","teknokrat"],
    lhkpn_latest:15000000000, lhkpn_year:2023,
    connections_summary:"Menteri PAN-RB, eks-Bupati Banyuwangi, suami Bupati Ipuk",
    twitter:"@azwaranas",
    analysis:{
      ideology_score:-1, populism_score:6, corruption_risk:"rendah",
      nationalism:6, religiosity:5,
      track_record:"Best practice kepala daerah inovatif. Banyuwangi jadi benchmark daerah baik.",
      policy_direction:"Reformasi birokrasi, pro-inovasi"
    }
  },
  {
    id:"hendy_siswanto", name:"Hendy Siswanto", photo_url:null, photo_placeholder:"HS",
    born:"1970", born_place:"Jember", religion:"Islam",
    education:"S1 Ilmu Politik, Universitas Brawijaya",
    party_id:"pkb", party_role:"Anggota",
    positions:[
      {title:"Bupati Jember",           institution:"Pemkab Jember",    region:"Jember",      start:"2021", end:null,   is_current:true},
    ],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Bupati Jember dari PKB yang melanjutkan pembangunan Kabupaten Jember. Mewarisi berbagai program dari kepemimpinan sebelumnya di kabupaten terbesar ketiga di Jatim.",
    tags:["jatim","jember","pkb"],
    lhkpn_latest:5000000000, lhkpn_year:2023,
    connections_summary:"Bupati Jember, kader PKB",
    twitter:null,
    analysis:{
      ideology_score:0, populism_score:5, corruption_risk:"rendah",
      nationalism:5, religiosity:6,
      track_record:"Kepemimpinan cukup stabil di Jember. Fokus pada pertanian dan pendidikan.",
      policy_direction:"Pro-pertanian, pembangunan daerah"
    }
  },
  {
    id:"hanindhito", name:"Hanindhito Himawan Pramana", photo_url:null, photo_placeholder:"HH",
    born:"1992", born_place:"Kediri", religion:"Islam",
    education:"S1 Ilmu Komunikasi, Universitas Gadjah Mada; eks-pemain sepakbola Persik Kediri",
    party_id:"pdip", party_role:"Anggota",
    positions:[
      {title:"Bupati Kediri",           institution:"Pemkab Kediri",    region:"Kediri",      start:"2021", end:null,   is_current:true},
    ],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Bupati Kediri termuda, putra Pramono Anung (Sekretaris Kabinet era Jokowi). Mantan pemain sepakbola Persik Kediri yang kemudian terjun ke dunia politik.",
    tags:["jatim","kediri","muda","pdip","putra-pejabat"],
    lhkpn_latest:6000000000, lhkpn_year:2023,
    connections_summary:"Bupati Kediri, putra Pramono Anung (Seskab), mantan pemain bola",
    twitter:"@DhitoKediri",
    analysis:{
      ideology_score:-2, populism_score:7, corruption_risk:"rendah",
      nationalism:5, religiosity:5,
      track_record:"Kepemimpinan segar dengan latar atlet. Fokus pengembangan Kediri termasuk Bandara Dhoho.",
      policy_direction:"Pro-investasi daerah, infrastruktur"
    }
  },
  {
    id:"pramono_anung", name:"Pramono Anung Wibowo", photo_url:"https://commons.wikimedia.org/wiki/Special:FilePath/Pramono_Anung_Gubernur_DKI.jpg?width=400", photo_placeholder:"PA",
    born:"25 Jun 1963", born_place:"Kediri", religion:"Islam",
    education:"S1 Teknik Pertambangan, ITB",
    party_id:"pdip", party_role:"DPP",
    positions:[
      {title:"Gubernur DKI Jakarta",    institution:"Pemprov DKI",      region:"DKI Jakarta", start:"2024", end:null,   is_current:true},
      {title:"Sekretaris Kabinet RI",   institution:"Setkab RI",        region:"Nasional",    start:"2014", end:"2024", is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Gubernur DKI Jakarta terpilih 2024. Mantan Sekretaris Kabinet era Jokowi. Politisi PDIP senior yang akhirnya memenangkan Pilkada DKI 2024 berpasangan dengan Rano Karno.",
    tags:["pdip","jakarta","eks-seskab"],
    lhkpn_latest:30000000000, lhkpn_year:2023,
    connections_summary:"Gubernur DKI Jakarta, Seskab era Jokowi, bapak Dhito Kediri",
    twitter:null,
    analysis:{
      ideology_score:-1, populism_score:5, corruption_risk:"rendah",
      nationalism:6, religiosity:5,
      track_record:"Karir panjang di PDIP dan eksekutif. Menang Pilkada DKI 2024 lawan Ridwan Kamil.",
      policy_direction:"Nasionalis, pro-rakyat"
    }
  },
  {
    id:"maidi", name:"Maidi", photo_url:null, photo_placeholder:"MD",
    born:"1965", born_place:"Madiun", religion:"Islam",
    education:"S1 Administrasi Negara, STIA",
    party_id:"ger", party_role:"Anggota",
    positions:[
      {title:"Walikota Madiun",         institution:"Pemkot Madiun",    region:"Madiun",      start:"2018", end:null,   is_current:true},
    ],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Walikota Madiun dari Gerindra, dikenal dengan transformasi kota dan peningkatan IPM. Madiun sempat jadi kota teladan nasional di era kepemimpinannya.",
    tags:["jatim","madiun","gerindra"],
    lhkpn_latest:4500000000, lhkpn_year:2023,
    connections_summary:"Walikota Madiun, kader Gerindra",
    twitter:null,
    analysis:{
      ideology_score:3, populism_score:6, corruption_risk:"rendah",
      nationalism:6, religiosity:5,
      track_record:"Madiun dikenal sebagai kota percontohan pembangunan. Tata kota dan kebersihan terpuji.",
      policy_direction:"Pro-pembangunan kota"
    }
  },
  {
    id:"ikfina", name:"Ikfina Fahmawati", photo_url:null, photo_placeholder:"IK",
    born:"1978", born_place:"Mojokerto", religion:"Islam",
    education:"S1 Kedokteran, Universitas Airlangga",
    party_id:"pkb", party_role:"Anggota",
    positions:[
      {title:"Bupati Mojokerto",        institution:"Pemkab Mojokerto", region:"Mojokerto",   start:"2021", end:null,   is_current:true},
    ],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Bupati Mojokerto perempuan pertama, dokter yang terjun ke dunia politik melalui PKB. Fokus pada kesehatan masyarakat dan penguatan desa di Mojokerto.",
    tags:["jatim","mojokerto","perempuan","pkb","dokter"],
    lhkpn_latest:3000000000, lhkpn_year:2023,
    connections_summary:"Bupati Mojokerto, dokter, kader PKB",
    twitter:null,
    analysis:{
      ideology_score:0, populism_score:5, corruption_risk:"rendah",
      nationalism:5, religiosity:7,
      track_record:"Kepemimpinan berbasis kesehatan dan pemberdayaan masyarakat.",
      policy_direction:"Pro-kesehatan, pemberdayaan desa"
    }
  },
  {
    id:"mundjidah", name:"Mundjidah Wahab", photo_url:null, photo_placeholder:"MW",
    born:"1970", born_place:"Jombang", religion:"Islam",
    education:"Pesantren Mambaul Maarif Denanyar Jombang",
    party_id:"pkb", party_role:"Anggota",
    positions:[
      {title:"Bupati Jombang",          institution:"Pemkab Jombang",   region:"Jombang",     start:"2018", end:null,   is_current:true},
    ],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Bupati Jombang putri KH Wahab Hasbullah, salah satu pendiri NU. Berlatar belakang pesantren, menjadi pemimpin Jombang—kota asal NU dengan historis keislaman yang kuat.",
    tags:["jatim","jombang","ulama","perempuan","pkb","nu"],
    lhkpn_latest:4000000000, lhkpn_year:2023,
    connections_summary:"Bupati Jombang, putri KH Wahab Hasbullah (pendiri NU)",
    twitter:null,
    analysis:{
      ideology_score:-1, populism_score:6, corruption_risk:"rendah",
      nationalism:6, religiosity:9,
      track_record:"Kepemimpinan berbasis nilai-nilai NU. Jombang sebagai kota asal pesantren dan NU.",
      policy_direction:"Pro-pesantren, nasionalis-NU"
    }
  },
  {
    id:"sutiaji", name:"Sutiaji", photo_url:null, photo_placeholder:"ST",
    born:"1963", born_place:"Malang", religion:"Islam",
    education:"S1 Ilmu Pemerintahan, Universitas Brawijaya",
    party_id:"dem", party_role:"Anggota",
    positions:[
      {title:"Walikota Malang",         institution:"Pemkot Malang",    region:"Malang",      start:"2018", end:null,   is_current:true},
    ],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Walikota Malang dari Partai Demokrat. Memimpin kota pelajar terbesar kedua di Jatim dengan fokus pada pendidikan dan pariwisata.",
    tags:["jatim","malang","demokrat"],
    lhkpn_latest:3500000000, lhkpn_year:2023,
    connections_summary:"Walikota Malang, kader Demokrat",
    twitter:null,
    analysis:{
      ideology_score:3, populism_score:5, corruption_risk:"rendah",
      nationalism:5, religiosity:5,
      track_record:"Malang sebagai kota pelajar terus berkembang. Fokus pariwisata dan pendidikan.",
      policy_direction:"Pro-pendidikan, pariwisata"
    }
  },
  {
    id:"sanusi_malang", name:"Sanusi", photo_url:null, photo_placeholder:"SN",
    born:"1971", born_place:"Malang", religion:"Islam",
    education:"S1 Hukum, Universitas Brawijaya",
    party_id:"ger", party_role:"Anggota",
    positions:[
      {title:"Bupati Malang",           institution:"Pemkab Malang",    region:"Malang",      start:"2021", end:null,   is_current:true},
      {title:"Anggota DPRD Malang",     institution:"DPRD Malang",      region:"Malang",      start:"2009", end:"2021", is_current:false},
    ],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Bupati Malang dari Gerindra. Pernah dihukum 3 tahun penjara atas kasus suap DPRD Malang 2018 dan telah bebas. Terpilih kembali sebagai Bupati.",
    tags:["jatim","malang","korupsi","terpidana","gerindra"],
    lhkpn_latest:7000000000, lhkpn_year:2023,
    connections_summary:"Bupati Malang, mantan terpidana kasus suap DPRD 2018",
    twitter:null,
    analysis:{
      ideology_score:3, populism_score:5, corruption_risk:"terpidana",
      nationalism:4, religiosity:4,
      track_record:"Terpidana suap namun kembali terpilih. Menggambarkan tantangan antikorupsi di level kabupaten.",
      policy_direction:"Pembangunan daerah"
    }
  },
  // ─── JATIM — Kabupaten/Kota Lainnya (data ringkas) ──────────────────────
  {
    id:"rendra_kresna", name:"Rendra Kresna", photo_url:null, photo_placeholder:"RK",
    born:"1965", born_place:"Malang", religion:"Islam",
    education:"S1", party_id:"gol", party_role:"Anggota",
    positions:[{title:"Mantan Bupati Malang", institution:"Pemkab Malang", region:"Malang", start:"2010", end:"2020", is_current:false}],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Mantan Bupati Malang dua periode, terpidana kasus korupsi DAK Disdik Malang.",
    tags:["jatim","malang","korupsi","terpidana"], lhkpn_latest:null, lhkpn_year:null,
    connections_summary:"Mantan Bupati Malang, terpidana", twitter:null,
    analysis:{ideology_score:2, populism_score:4, corruption_risk:"terpidana", nationalism:4, religiosity:4, track_record:"Terpidana korupsi DAK.", policy_direction:"N/A"}
  },
  {
    id:"timbul_prihanjoko", name:"Timbul Prihanjoko", photo_url:null, photo_placeholder:"TP",
    born:"1970", born_place:"Pasuruan", religion:"Islam", education:"S1",
    party_id:"pdip", party_role:"Anggota",
    positions:[{title:"Bupati Pasuruan", institution:"Pemkab Pasuruan", region:"Pasuruan", start:"2021", end:null, is_current:true}],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Bupati Pasuruan dari PDIP, melanjutkan pembangunan industri dan pertanian di Kabupaten Pasuruan.",
    tags:["jatim","pasuruan","pdip"], lhkpn_latest:3000000000, lhkpn_year:2023,
    connections_summary:"Bupati Pasuruan, kader PDIP", twitter:null,
    analysis:{ideology_score:-1, populism_score:5, corruption_risk:"rendah", nationalism:5, religiosity:5, track_record:"Kepemimpinan stabil di Pasuruan.", policy_direction:"Pro-industri"}
  },
  {
    id:"saiful_ilah", name:"Saiful Ilah", photo_url:null, photo_placeholder:"SI",
    born:"1955", born_place:"Sidoarjo", religion:"Islam", education:"S1",
    party_id:"pkb", party_role:"Anggota",
    positions:[{title:"Mantan Bupati Sidoarjo", institution:"Pemkab Sidoarjo", region:"Sidoarjo", start:"2000", end:"2021", is_current:false}],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Mantan Bupati Sidoarjo terlama. Tersangka korupsi dan kini dalam proses hukum.",
    tags:["jatim","sidoarjo","korupsi","tersangka"], lhkpn_latest:null, lhkpn_year:null,
    connections_summary:"Mantan Bupati Sidoarjo, tersangka korupsi", twitter:null,
    analysis:{ideology_score:0, populism_score:5, corruption_risk:"tersangka", nationalism:4, religiosity:5, track_record:"Bupati lama, tersangka korupsi.", policy_direction:"N/A"}
  },
  {
    id:"yuhronur_efendi", name:"Yuhronur Efendi", photo_url:null, photo_placeholder:"YE",
    born:"1970", born_place:"Lamongan", religion:"Islam", education:"S1 Hukum",
    party_id:"pkb", party_role:"Anggota",
    positions:[{title:"Bupati Lamongan", institution:"Pemkab Lamongan", region:"Lamongan", start:"2021", end:null, is_current:true}],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Bupati Lamongan kader PKB, fokus pengembangan pertanian dan nelayan di wilayah pesisir utara Jatim.",
    tags:["jatim","lamongan","pkb"], lhkpn_latest:4000000000, lhkpn_year:2023,
    connections_summary:"Bupati Lamongan, kader PKB", twitter:null,
    analysis:{ideology_score:0, populism_score:5, corruption_risk:"rendah", nationalism:5, religiosity:7, track_record:"Kepemimpinan fokus pertanian-perikanan.", policy_direction:"Pro-pertanian, nelayan"}
  },
  {
    id:"ipong_muchlissoni", name:"Ipong Muchlissoni", photo_url:null, photo_placeholder:"IM",
    born:"1968", born_place:"Ponorogo", religion:"Islam", education:"S1",
    party_id:"ger", party_role:"Anggota",
    positions:[{title:"Bupati Ponorogo", institution:"Pemkab Ponorogo", region:"Ponorogo", start:"2021", end:null, is_current:true}],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Bupati Ponorogo dari Gerindra, terkenal dengan festival Reog Ponorogo yang mendapat pengakuan UNESCO.",
    tags:["jatim","ponorogo","gerindra","budaya"], lhkpn_latest:5000000000, lhkpn_year:2023,
    connections_summary:"Bupati Ponorogo, Gerindra", twitter:null,
    analysis:{ideology_score:3, populism_score:6, corruption_risk:"rendah", nationalism:7, religiosity:5, track_record:"Reog Ponorogo raih UNESCO. Pariwisata meningkat.", policy_direction:"Pro-budaya, pariwisata"}
  },
  {
    id:"joko_suroto", name:"Joko Suroto", photo_url:null, photo_placeholder:"JS",
    born:"1970", born_place:"Tulungagung", religion:"Islam", education:"S1",
    party_id:"pdip", party_role:"Anggota",
    positions:[{title:"Bupati Tulungagung", institution:"Pemkab Tulungagung", region:"Tulungagung", start:"2023", end:null, is_current:true}],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Bupati Tulungagung pengganti setelah bupati sebelumnya tersangkut kasus korupsi.",
    tags:["jatim","tulungagung","pdip"], lhkpn_latest:3000000000, lhkpn_year:2023,
    connections_summary:"Bupati Tulungagung, PDIP", twitter:null,
    analysis:{ideology_score:-1, populism_score:4, corruption_risk:"rendah", nationalism:4, religiosity:5, track_record:"Penerus kepemimpinan Tulungagung.", policy_direction:"Pembangunan daerah"}
  },
  {
    id:"karna_suswandi", name:"Karna Suswandi", photo_url:null, photo_placeholder:"KS",
    born:"1969", born_place:"Situbondo", religion:"Islam", education:"S1",
    party_id:"nas", party_role:"Anggota",
    positions:[{title:"Bupati Situbondo", institution:"Pemkab Situbondo", region:"Situbondo", start:"2021", end:null, is_current:true}],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Bupati Situbondo dari NasDem, fokus pada pertanian dan pariwisata di Situbondo.",
    tags:["jatim","situbondo","nasdem"], lhkpn_latest:3000000000, lhkpn_year:2023,
    connections_summary:"Bupati Situbondo, NasDem", twitter:null,
    analysis:{ideology_score:1, populism_score:4, corruption_risk:"rendah", nationalism:4, religiosity:6, track_record:"Kepemimpinan relatif bersih.", policy_direction:"Pro-pertanian, pariwisata"}
  },
  {
    id:"andri_wahyudi", name:"Andri Wahyudi Hamid", photo_url:null, photo_placeholder:"AW",
    born:"1975", born_place:"Bondowoso", religion:"Islam", education:"S1",
    party_id:"pkb", party_role:"Anggota",
    positions:[{title:"Bupati Bondowoso", institution:"Pemkab Bondowoso", region:"Bondowoso", start:"2023", end:null, is_current:true}],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Bupati Bondowoso dari PKB, melanjutkan program pertanian kopi Arabika yang terkenal.",
    tags:["jatim","bondowoso","pkb"], lhkpn_latest:2000000000, lhkpn_year:2023,
    connections_summary:"Bupati Bondowoso, PKB", twitter:null,
    analysis:{ideology_score:0, populism_score:4, corruption_risk:"rendah", nationalism:4, religiosity:6, track_record:"Fokus pada kopi dan pertanian.", policy_direction:"Pro-pertanian"}
  },
  {
    id:"suwandy", name:"Suwandy", photo_url:null, photo_placeholder:"SW",
    born:"1968", born_place:"Probolinggo", religion:"Islam", education:"S1",
    party_id:"nas", party_role:"Anggota",
    positions:[{title:"Walikota Probolinggo", institution:"Pemkot Probolinggo", region:"Probolinggo", start:"2019", end:null, is_current:true}],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Walikota Probolinggo dari NasDem, mengisi kekosongan setelah Walikota sebelumnya tersangkut kasus korupsi.",
    tags:["jatim","probolinggo","nasdem"], lhkpn_latest:2500000000, lhkpn_year:2023,
    connections_summary:"Walikota Probolinggo, NasDem", twitter:null,
    analysis:{ideology_score:1, populism_score:4, corruption_risk:"rendah", nationalism:4, religiosity:5, track_record:"Penerus Walikota Probolinggo.", policy_direction:"Pembangunan kota"}
  },
  {
    id:"wahid_cahyono", name:"Wahid Cahyono", photo_url:null, photo_placeholder:"WC",
    born:"1970", born_place:"Probolinggo", religion:"Islam", education:"S1",
    party_id:"pdip", party_role:"Anggota",
    positions:[{title:"Bupati Probolinggo", institution:"Pemkab Probolinggo", region:"Probolinggo", start:"2023", end:null, is_current:true}],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Bupati Probolinggo pengganti setelah Hasan Aminuddin dan istrinya terpidana kasus korupsi jual beli jabatan.",
    tags:["jatim","probolinggo","pdip"], lhkpn_latest:2000000000, lhkpn_year:2023,
    connections_summary:"Bupati Probolinggo, pengganti terpidana", twitter:null,
    analysis:{ideology_score:-1, populism_score:4, corruption_risk:"rendah", nationalism:4, religiosity:5, track_record:"Penerus reformasi Probolinggo pasca-korupsi.", policy_direction:"Reformasi tata kelola"}
  },
  {
    id:"dawam_ridho", name:"H. Dawam Ridho", photo_url:null, photo_placeholder:"DR",
    born:"1966", born_place:"Lumajang", religion:"Islam", education:"S1",
    party_id:"pdip", party_role:"Anggota",
    positions:[{title:"Bupati Lumajang", institution:"Pemkab Lumajang", region:"Lumajang", start:"2021", end:null, is_current:true}],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Bupati Lumajang dari PDIP, fokus rekonstruksi pasca-bencana erupsi Gunung Semeru.",
    tags:["jatim","lumajang","pdip","bencana"], lhkpn_latest:3000000000, lhkpn_year:2023,
    connections_summary:"Bupati Lumajang, PDIP", twitter:null,
    analysis:{ideology_score:-1, populism_score:5, corruption_risk:"rendah", nationalism:5, religiosity:5, track_record:"Pasca-erupsi Semeru, rekonstruksi berjalan.", policy_direction:"Penanggulangan bencana"}
  },
  {
    id:"sandhika", name:"Sandhika Artadita", photo_url:null, photo_placeholder:"SA",
    born:"1985", born_place:"Blitar", religion:"Islam", education:"S1",
    party_id:"pdip", party_role:"Anggota",
    positions:[{title:"Bupati Blitar", institution:"Pemkab Blitar", region:"Blitar", start:"2021", end:null, is_current:true}],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Bupati Blitar dari PDIP, melanjutkan tradisi kekuatan PDIP di wilayah Blitar.",
    tags:["jatim","blitar","pdip"], lhkpn_latest:2500000000, lhkpn_year:2023,
    connections_summary:"Bupati Blitar, PDIP", twitter:null,
    analysis:{ideology_score:-1, populism_score:5, corruption_risk:"rendah", nationalism:5, religiosity:4, track_record:"Blitar sebagai kandang PDIP historis.", policy_direction:"Pro-PDIP, pertanian"}
  },
  {
    id:"santoso_blitar", name:"Santoso", photo_url:null, photo_placeholder:"SB",
    born:"1965", born_place:"Blitar", religion:"Islam", education:"S1",
    party_id:"pdip", party_role:"Anggota",
    positions:[{title:"Walikota Blitar", institution:"Pemkot Blitar", region:"Blitar", start:"2021", end:null, is_current:true}],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Walikota Blitar dari PDIP. Blitar merupakan kota kelahiran Bung Karno, pusat sejarah nasionalisme Indonesia.",
    tags:["jatim","blitar","pdip","nasionalis"], lhkpn_latest:2000000000, lhkpn_year:2023,
    connections_summary:"Walikota Blitar, PDIP", twitter:null,
    analysis:{ideology_score:-2, populism_score:6, corruption_risk:"rendah", nationalism:8, religiosity:4, track_record:"Blitar kota bersejarah. Pariwisata makam Bung Karno.", policy_direction:"Pro-nasionalisme, pariwisata"}
  },
  {
    id:"budhabar", name:"Budhabar", photo_url:null, photo_placeholder:"BD",
    born:"1967", born_place:"Nganjuk", religion:"Islam", education:"S1",
    party_id:"pdip", party_role:"Anggota",
    positions:[{title:"Bupati Nganjuk", institution:"Pemkab Nganjuk", region:"Nganjuk", start:"2023", end:null, is_current:true}],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Bupati Nganjuk dari PDIP.",
    tags:["jatim","nganjuk","pdip"], lhkpn_latest:2000000000, lhkpn_year:2023,
    connections_summary:"Bupati Nganjuk, PDIP", twitter:null,
    analysis:{ideology_score:-1, populism_score:4, corruption_risk:"rendah", nationalism:4, religiosity:5, track_record:"Kepemimpinan Nganjuk.", policy_direction:"Pembangunan daerah"}
  },
  {
    id:"hariyanto_bojonegoro", name:"Setyo Wahono", photo_url:null, photo_placeholder:"SW",
    born:"1972", born_place:"Bojonegoro", religion:"Islam", education:"S1",
    party_id:"pdip", party_role:"Anggota",
    positions:[{title:"Bupati Bojonegoro", institution:"Pemkab Bojonegoro", region:"Bojonegoro", start:"2023", end:null, is_current:true}],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Bupati Bojonegoro, daerah penghasil minyak bumi terbesar di Jatim.",
    tags:["jatim","bojonegoro","pdip","migas"], lhkpn_latest:3000000000, lhkpn_year:2023,
    connections_summary:"Bupati Bojonegoro, PDIP", twitter:null,
    analysis:{ideology_score:-1, populism_score:5, corruption_risk:"rendah", nationalism:5, religiosity:5, track_record:"Bojonegoro sebagai daerah migas.", policy_direction:"Pro-energi, pembangunan"}
  },
  {
    id:"arifin_tuban", name:"Aditya Halindra Faridzky", photo_url:null, photo_placeholder:"AF",
    born:"1990", born_place:"Tuban", religion:"Islam", education:"S1",
    party_id:"pkb", party_role:"Anggota",
    positions:[{title:"Bupati Tuban", institution:"Pemkab Tuban", region:"Tuban", start:"2021", end:null, is_current:true}],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Bupati Tuban muda dari PKB. Tuban terkenal dengan industri petrokimia dan semen.",
    tags:["jatim","tuban","pkb","muda"], lhkpn_latest:4000000000, lhkpn_year:2023,
    connections_summary:"Bupati Tuban, PKB", twitter:null,
    analysis:{ideology_score:0, populism_score:5, corruption_risk:"rendah", nationalism:5, religiosity:6, track_record:"Kepemimpinan muda Tuban.", policy_direction:"Pro-industri"}
  },
  {
    id:"fauzi_ngawi", name:"Ony Anwar Harsono", photo_url:null, photo_placeholder:"OA",
    born:"1975", born_place:"Ngawi", religion:"Islam", education:"S1",
    party_id:"pkb", party_role:"Anggota",
    positions:[{title:"Bupati Ngawi", institution:"Pemkab Ngawi", region:"Ngawi", start:"2021", end:null, is_current:true}],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Bupati Ngawi dari PKB. Ngawi dikenal sebagai daerah pertanian dan fosil manusia purba.",
    tags:["jatim","ngawi","pkb"], lhkpn_latest:3000000000, lhkpn_year:2023,
    connections_summary:"Bupati Ngawi, PKB", twitter:null,
    analysis:{ideology_score:0, populism_score:4, corruption_risk:"rendah", nationalism:5, religiosity:6, track_record:"Kepemimpinan Ngawi.", policy_direction:"Pro-pertanian"}
  },
  {
    id:"dedy_magetan", name:"Nanik Endang Rusminingsih", photo_url:null, photo_placeholder:"NE",
    born:"1971", born_place:"Magetan", religion:"Islam", education:"S1",
    party_id:"pdip", party_role:"Anggota",
    positions:[{title:"Bupati Magetan", institution:"Pemkab Magetan", region:"Magetan", start:"2023", end:null, is_current:true}],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Bupati Magetan perempuan dari PDIP. Magetan dikenal dengan produk kulit dan pariwisata Telaga Sarangan.",
    tags:["jatim","magetan","pdip","perempuan"], lhkpn_latest:2500000000, lhkpn_year:2023,
    connections_summary:"Bupati Magetan, PDIP, perempuan", twitter:null,
    analysis:{ideology_score:-1, populism_score:4, corruption_risk:"rendah", nationalism:4, religiosity:5, track_record:"Kepemimpinan Magetan.", policy_direction:"Pro-pariwisata, UMKM"}
  },
  {
    id:"tri_sragen", name:"M. Erfan Wahyudi", photo_url:null, photo_placeholder:"EW",
    born:"1972", born_place:"Pacitan", religion:"Islam", education:"S1",
    party_id:"pdip", party_role:"Anggota",
    positions:[{title:"Bupati Pacitan", institution:"Pemkab Pacitan", region:"Pacitan", start:"2021", end:null, is_current:true}],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Bupati Pacitan. Pacitan adalah kota kelahiran SBY yang kini dikuasai PDIP.",
    tags:["jatim","pacitan","pdip"], lhkpn_latest:2000000000, lhkpn_year:2023,
    connections_summary:"Bupati Pacitan, PDIP (kota asal SBY)", twitter:null,
    analysis:{ideology_score:-1, populism_score:4, corruption_risk:"rendah", nationalism:5, religiosity:5, track_record:"Pacitan daerah berprestasi pariwisata.", policy_direction:"Pro-pariwisata"}
  },
  {
    id:"daryono_trenggalek", name:"Mochamad Nur Arifin", photo_url:null, photo_placeholder:"MN",
    born:"1990", born_place:"Trenggalek", religion:"Islam", education:"S1",
    party_id:"pdip", party_role:"Anggota",
    positions:[{title:"Bupati Trenggalek", institution:"Pemkab Trenggalek", region:"Trenggalek", start:"2021", end:null, is_current:true}],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Bupati Trenggalek muda dari PDIP, penerus Emil Dardak yang kini menjadi Wagub Jatim.",
    tags:["jatim","trenggalek","pdip","muda"], lhkpn_latest:2500000000, lhkpn_year:2023,
    connections_summary:"Bupati Trenggalek, PDIP", twitter:null,
    analysis:{ideology_score:-1, populism_score:5, corruption_risk:"rendah", nationalism:4, religiosity:5, track_record:"Penerus Trenggalek pasca-Emil Dardak.", policy_direction:"Pembangunan daerah"}
  },
  {
    id:"winarso_kediri", name:"Hanindhito Pramana (Kota Kediri)", photo_url:null, photo_placeholder:"KK",
    born:"1976", born_place:"Kediri", religion:"Islam", education:"S1",
    party_id:"pkb", party_role:"Anggota",
    positions:[{title:"Walikota Kediri", institution:"Pemkot Kediri", region:"Kediri", start:"2021", end:null, is_current:true}],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Walikota Kediri dari PKB. Kota Kediri dikenal dengan Industri Gudang Garam dan pabrik rokok.",
    tags:["jatim","kota-kediri","pkb"], lhkpn_latest:3000000000, lhkpn_year:2023,
    connections_summary:"Walikota Kediri, PKB", twitter:null,
    analysis:{ideology_score:0, populism_score:4, corruption_risk:"rendah", nationalism:4, religiosity:6, track_record:"Kepemimpinan Kota Kediri.", policy_direction:"Pro-industri"}
  },
  {
    id:"slamet_batu", name:"Rudi Hartono", photo_url:null, photo_placeholder:"RH",
    born:"1968", born_place:"Batu", religion:"Islam", education:"S1",
    party_id:"pdip", party_role:"Anggota",
    positions:[{title:"Walikota Batu", institution:"Pemkot Batu", region:"Batu", start:"2022", end:null, is_current:true}],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Walikota Batu yang menggantikan setelah walikota sebelumnya tersangkut kasus korupsi. Kota Batu terkenal dengan wisata apel dan taman rekreasi.",
    tags:["jatim","batu","pdip"], lhkpn_latest:2500000000, lhkpn_year:2023,
    connections_summary:"Walikota Batu, PDIP (penerus)", twitter:null,
    analysis:{ideology_score:-1, populism_score:5, corruption_risk:"rendah", nationalism:4, religiosity:5, track_record:"Penerus kepemimpinan Kota Batu.", policy_direction:"Pro-pariwisata, agrowisata"}
  },
  {
    id:"taufiq_pamekasan", name:"Badrut Tamam", photo_url:null, photo_placeholder:"BT",
    born:"1978", born_place:"Pamekasan", religion:"Islam", education:"Pesantren; S1",
    party_id:"pkb", party_role:"Anggota",
    positions:[{title:"Bupati Pamekasan", institution:"Pemkab Pamekasan", region:"Pamekasan", start:"2018", end:null, is_current:true}],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Bupati Pamekasan dari PKB berlatar belakang pesantren. Pamekasan merupakan bagian Madura yang dikenal dengan batik dan tembakau.",
    tags:["jatim","pamekasan","pkb","madura","santri"], lhkpn_latest:3000000000, lhkpn_year:2023,
    connections_summary:"Bupati Pamekasan, PKB, Madura", twitter:null,
    analysis:{ideology_score:-1, populism_score:5, corruption_risk:"rendah", nationalism:5, religiosity:8, track_record:"Pamekasan pusat batik dan tembakau Madura.", policy_direction:"Pro-UMKM, pesantren"}
  },
  {
    id:"busyro_sumenep", name:"Achmad Fauzi", photo_url:null, photo_placeholder:"AF",
    born:"1972", born_place:"Sumenep", religion:"Islam", education:"S1",
    party_id:"pdip", party_role:"Anggota",
    positions:[{title:"Bupati Sumenep", institution:"Pemkab Sumenep", region:"Sumenep", start:"2021", end:null, is_current:true}],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Bupati Sumenep dari PDIP. Sumenep adalah ujung timur Madura dengan banyak pulau dan potensi bahari.",
    tags:["jatim","sumenep","pdip","madura"], lhkpn_latest:3000000000, lhkpn_year:2023,
    connections_summary:"Bupati Sumenep, PDIP, Madura", twitter:null,
    analysis:{ideology_score:-1, populism_score:4, corruption_risk:"rendah", nationalism:4, religiosity:7, track_record:"Sumenep dengan kepulauan dan budaya Madura.", policy_direction:"Pro-bahari, budaya"}
  },
  {
    id:"fauzi_sampang", name:"H. Slamet Junaidi", photo_url:null, photo_placeholder:"SJ",
    born:"1971", born_place:"Sampang", religion:"Islam", education:"S1",
    party_id:"pkb", party_role:"Anggota",
    positions:[{title:"Bupati Sampang", institution:"Pemkab Sampang", region:"Sampang", start:"2019", end:null, is_current:true}],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Bupati Sampang dari PKB. Sampang merupakan kabupaten dengan angka kemiskinan tertinggi di Jatim.",
    tags:["jatim","sampang","pkb","madura"], lhkpn_latest:2000000000, lhkpn_year:2023,
    connections_summary:"Bupati Sampang, PKB, Madura", twitter:null,
    analysis:{ideology_score:0, populism_score:5, corruption_risk:"rendah", nationalism:4, religiosity:7, track_record:"Tantangan kemiskinan di Sampang.", policy_direction:"Pro-pengentasan kemiskinan"}
  },
  {
    id:"bangkalan_bupati", name:"Ra Abd Latif Amin Imron", photo_url:null, photo_placeholder:"AL",
    born:"1981", born_place:"Bangkalan", religion:"Islam", education:"Pesantren; S1",
    party_id:"pkb", party_role:"Anggota",
    positions:[{title:"Bupati Bangkalan", institution:"Pemkab Bangkalan", region:"Bangkalan", start:"2018", end:null, is_current:true}],
    tier:"kabupaten", region_id:"jawa-timur",
    bio:"Bupati Bangkalan dari PKB, cucu KH Fuad Amin (mantan Bupati yang terjerat korupsi). Bangkalan adalah pintu masuk Madura via Jembatan Suramadu.",
    tags:["jatim","bangkalan","pkb","madura","pesantren"], lhkpn_latest:4000000000, lhkpn_year:2023,
    connections_summary:"Bupati Bangkalan, PKB, cucu eks-Bupati koruptor", twitter:null,
    analysis:{ideology_score:0, populism_score:5, corruption_risk:"sedang", nationalism:4, religiosity:8, track_record:"Warisan keluarga Amin di Bangkalan. Fokus pembangunan pasca-Suramadu.", policy_direction:"Pro-pesantren, infrastruktur"}
  },
  // ─── JATIM — Kota lainnya ────────────────────────────────────────────────
  {
    id:"bambang_haryo", name:"Bambang Haryo Soekartono", photo_url:null, photo_placeholder:"BH",
    born:"1966", born_place:"Surabaya", religion:"Islam", education:"S1",
    party_id:"ger", party_role:"Anggota DPR",
    positions:[{title:"Anggota DPR RI", institution:"DPR RI", region:"Jawa Timur", start:"2019", end:null, is_current:true}],
    tier:"nasional", region_id:"jawa-timur",
    bio:"Anggota DPR RI dari Gerindra Dapil Jatim, pengusaha dan aktivis transportasi.",
    tags:["jatim","gerindra","pengusaha"], lhkpn_latest:15000000000, lhkpn_year:2023,
    connections_summary:"DPR RI Gerindra Jatim, pengusaha", twitter:null,
    analysis:{ideology_score:4, populism_score:4, corruption_risk:"rendah", nationalism:6, religiosity:4, track_record:"Fokus pada transportasi dan infrastruktur.", policy_direction:"Pro-infrastruktur"}
  },
  // ─── ORMAS & RELIGIOUS LEADERS ──────────────────────────────────────────
  {
    id:"gus_yahya", name:"Yahya Cholil Staquf", photo_url:"https://commons.wikimedia.org/wiki/Special:FilePath/Wantimpres_Gus-Yahya.jpg?width=400", photo_placeholder:"YC",
    born:"1966", born_place:"Rembang", religion:"Islam",
    education:"Pesantren Raudlatut Thalabah; S1 Filsafat UGM",
    party_id:null, party_role:null,
    positions:[
      {title:"Ketua Umum PBNU",         institution:"PBNU",             region:"Nasional",    start:"2021", end:null,   is_current:true},
      {title:"Juru Bicara Kepresidenan", institution:"Istana Negara",    region:"Nasional",    start:"2007", end:"2014", is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Ketua Umum PBNU sejak 2021. Tokoh muda NU yang dikenal karena pandangan moderat dan dialog antaragama internasional. Cucu KH Bisri Mustofa, kakak ipar Muhaimin Iskandar (secara tidak langsung via jaringan NU).",
    tags:["nu","ulama","moderat","internasional"],
    lhkpn_latest:null, lhkpn_year:null,
    connections_summary:"Ketum PBNU, cucu KH Bisri Mustofa Rembang",
    twitter:"@gusyahya",
    analysis:{
      ideology_score:-3, populism_score:4, corruption_risk:"rendah",
      nationalism:8, religiosity:10,
      track_record:"Reformis dalam NU. Mendorong islam moderat inklusif. Tur global soal perdamaian dan dialog Islam.",
      policy_direction:"Islam moderat, inklusif, nasionalis"
    }
  },
  {
    id:"haedar_nashir", name:"Haedar Nashir", photo_url:"https://commons.wikimedia.org/wiki/Special:FilePath/Haedar_Nashir.jpg?width=400", photo_placeholder:"HN",
    born:"1965", born_place:"Bandung", religion:"Islam",
    education:"S1 Sosiologi UGM; PhD Sosiologi UGM",
    party_id:null, party_role:null,
    positions:[
      {title:"Ketua Umum PP Muhammadiyah", institution:"PP Muhammadiyah", region:"Nasional", start:"2015", end:null,   is_current:true},
    ],
    tier:"nasional", region_id:null,
    bio:"Ketua Umum PP Muhammadiyah sejak 2015. Akademisi dan sosiolog yang memperkuat peran Muhammadiyah sebagai gerakan Islam berkemajuan di Indonesia.",
    tags:["muhammadiyah","ulama","akademisi"],
    lhkpn_latest:null, lhkpn_year:null,
    connections_summary:"Ketum PP Muhammadiyah, sosiolog",
    twitter:"@HaedarNashir",
    analysis:{
      ideology_score:1, populism_score:3, corruption_risk:"rendah",
      nationalism:7, religiosity:9,
      track_record:"Muhammadiyah di bawah Haedar fokus pada pendidikan dan kesehatan. Posisi moderat namun kritis terhadap kebijakan pemerintah.",
      policy_direction:"Islam berkemajuan, pendidikan"
    }
  },
  {
    id:"anwar_abbas", name:"Anwar Abbas", photo_url:null, photo_placeholder:"AW",
    born:"1960", born_place:"Sumatera Barat", religion:"Islam",
    education:"Pesantren; S1 Syariah IAIN; PhD Sosiologi",
    party_id:null, party_role:null,
    positions:[
      {title:"Sekretaris Jenderal MUI",  institution:"MUI Pusat",        region:"Nasional",    start:"2020", end:null,   is_current:true},
    ],
    tier:"nasional", region_id:null,
    bio:"Sekjen MUI yang dikenal dengan pandangan konservatif-kritis terhadap berbagai kebijakan pemerintah. Aktif menyuarakan kepentingan umat Islam di ruang publik.",
    tags:["mui","ulama","konservatif"],
    lhkpn_latest:null, lhkpn_year:null,
    connections_summary:"Sekjen MUI Pusat, tokoh Islam konservatif",
    twitter:null,
    analysis:{
      ideology_score:5, populism_score:6, corruption_risk:"rendah",
      nationalism:6, religiosity:9,
      track_record:"Kritis terhadap kebijakan ekonomi dan sosial. Sering jadi suara paling keras dari MUI.",
      policy_direction:"Islam konservatif, ekonomi syariah"
    }
  },
  {
    id:"said_iqbal", name:"Said Iqbal", photo_url:null, photo_placeholder:"SQ",
    born:"1970", born_place:"Jakarta", religion:"Islam",
    education:"S1 Teknik Kimia, IPB",
    party_id:"bur", party_role:"Ketua Umum",
    positions:[
      {title:"Ketua Umum Partai Buruh", institution:"DPP Partai Buruh",  region:"Nasional",    start:"2021", end:null,   is_current:true},
      {title:"Presiden KSPI",           institution:"KSPI",              region:"Nasional",    start:"2010", end:null,   is_current:true},
    ],
    tier:"nasional", region_id:null,
    bio:"Presiden Konfederasi Serikat Pekerja Indonesia (KSPI) dan Ketua Umum Partai Buruh. Aktivis buruh paling vokal yang sering memimpin aksi demonstrasi menolak UU Cipta Kerja.",
    tags:["buruh","aktivis","serikat-pekerja"],
    lhkpn_latest:null, lhkpn_year:null,
    connections_summary:"Ketum Partai Buruh, Presiden KSPI, aktivis demo UU Cipta Kerja",
    twitter:"@SaidIqbal_KSPI",
    analysis:{
      ideology_score:-7, populism_score:9, corruption_risk:"rendah",
      nationalism:5, religiosity:5,
      track_record:"Konsisten memperjuangkan hak buruh. Tolak UU Cipta Kerja omnibus. Partai Buruh gagal lolos ambang batas 4% Pemilu 2024.",
      policy_direction:"Sosialis, pro-buruh, anti-neoliberal"
    }
  },
  // ─── NASIONAL — TOKOH PENTING LAINNYA ───────────────────────────────────
  {
    id:"hashim", name:"Hashim Djojohadikusumo", photo_url:"https://commons.wikimedia.org/wiki/Special:FilePath/Hashim-djojohadikusumo-2802af37-0f0c-47ef-b9c4-f47aec1bde5-resize-750.jpg?width=400", photo_placeholder:"HD",
    born:"1954", born_place:"Jakarta", religion:"Islam",
    education:"S1 Ekonomi, Williams College USA",
    party_id:"ger", party_role:"Ketua Dewan Pembina",
    positions:[
      {title:"Ketua Dewan Pembina Gerindra", institution:"DPP Gerindra", region:"Nasional",   start:"2008", end:null,   is_current:true},
    ],
    tier:"nasional", region_id:null,
    bio:"Adik kandung Prabowo Subianto dan pengusaha besar. Ketua Dewan Pembina Gerindra. Dikenal sebagai bankir utama Gerindra dari konglomerasi bisnisnya.",
    tags:["pengusaha","gerindra","adik-presiden"],
    lhkpn_latest:null, lhkpn_year:null,
    connections_summary:"Adik Prabowo, konglomerat, Ketua Dewan Pembina Gerindra",
    twitter:null,
    analysis:{
      ideology_score:5, populism_score:2, corruption_risk:"sedang",
      nationalism:6, religiosity:4,
      track_record:"Pengusaha sukses di berbagai sektor. Bagian tak terpisahkan dari mesin politik Gerindra-Prabowo.",
      policy_direction:"Pro-bisnis, nasionalis"
    }
  },
  {
    id:"kaesang", name:"Kaesang Pangarep", photo_url:"https://commons.wikimedia.org/wiki/Special:FilePath/Kaesang_Pangarep_in_2016.jpg?width=400", photo_placeholder:"KP",
    born:"25 Dec 1994", born_place:"Surakarta", religion:"Islam",
    education:"S1 Ilmu Komputer, Nanyang Technological University (tidak selesai)",
    party_id:"psi", party_role:"Ketua Umum",
    positions:[
      {title:"Ketua Umum PSI",          institution:"DPP PSI",          region:"Nasional",    start:"2023", end:null,   is_current:true},
    ],
    tier:"nasional", region_id:null,
    bio:"Putra bungsu Presiden Jokowi yang mendadak memimpin PSI di usia 28 tahun. Pengusaha digital yang masuk politik mengikuti jejak ayah dan kakaknya Gibran.",
    tags:["muda","putra-presiden","pengusaha","psi"],
    lhkpn_latest:30000000000, lhkpn_year:2023,
    connections_summary:"Ketum PSI, putra bungsu Jokowi, adik Gibran Wapres",
    twitter:"@kaesangp",
    analysis:{
      ideology_score:2, populism_score:5, corruption_risk:"rendah",
      nationalism:4, religiosity:3,
      track_record:"Naik cepat ke pucuk PSI tanpa rekam jejak politik. Dikritik sebagai perpanjangan tangan dinasti Jokowi.",
      policy_direction:"Progresif, pro-generasi muda"
    }
  },

  // ─── TAMBAHAN: TOKOH KRITIS UNTUK TRANSPARANSI ──────────────────────────
  {
    id:"hasto", name:"Hasto Kristiyanto", photo_url:"https://commons.wikimedia.org/wiki/Special:FilePath/Hasto_Kristiyanto_di_kediaman_Presiden_ke-5_Megawati_Soekarnoputri_(2023).jpg?width=400", photo_placeholder:"HK",
    born:"7 Jul 1973", born_place:"Klaten", religion:"Islam",
    education:"S2 Universitas Indonesia",
    party_id:"pdip", party_role:"Sekretaris Jenderal",
    positions:[
      {title:"Sekretaris Jenderal PDI-P", institution:"DPP PDI-P", region:"Nasional", start:"2014", end:null, is_current:true},
    ],
    tier:"nasional", region_id:null,
    bio:"Sekretaris Jenderal PDI-P dan operator utama mesin politik Megawati. Ditetapkan sebagai tersangka KPK Januari 2025 atas dugaan obstruction of justice dalam kasus Harun Masiku yang buron sejak 2020.",
    tags:["tersangka","pdip","politisi"],
    lhkpn_latest:12000000000, lhkpn_year:2023,
    connections_summary:"Sekjen PDIP, tersangka KPK kasus Harun Masiku",
    twitter:"@hastokristiyanto",
    controversies:[
      { title:"Tersangka Obstruction of Justice", severity:"kritis",
        description:"KPK menetapkan Hasto tersangka Januari 2025 atas dugaan menghalangi penyidikan kasus Harun Masiku — kader PDIP yang buron sejak 2020. Hasto diduga membantu Masiku melarikan diri saat KPK hendak menangkapnya.",
        status:"Tersangka, proses hukum berjalan 2025", source:"KPK RI" },
    ],
    analysis:{
      ideology_score:-4, populism_score:5, corruption_risk:"tersangka",
      nationalism:6, religiosity:4,
      track_record:"Operator politik handal di balik layar PDI-P. Kasus Harun Masiku menjadi batu sandungan serius bagi partai yang mengklaim anti-korupsi.",
      policy_direction:"Nasionalis-Marhaenis (PDI-P)"
    }
  },
  {
    id:"tom_lembong", name:"Thomas Trikasih Lembong", photo_url:null, photo_placeholder:"TL",
    born:"4 Mar 1971", born_place:"Jakarta", religion:"Kristen",
    education:"S1 Arsitektur Harvard University; MBA Harvard Business School",
    party_id:"nas", party_role:"Anggota",
    positions:[
      {title:"Kepala BKPM",    institution:"BKPM",         region:"Nasional", start:"2016", end:"2019", is_current:false},
      {title:"Menteri Perdagangan", institution:"Kemendag", region:"Nasional", start:"2015", end:"2016", is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Eks-bankir dan ekonom yang menjabat Mendag dan Kepala BKPM di era Jokowi. Dekat dengan gerakan Anies Baswedan. Ditangkap Kejaksaan Agung November 2024 atas dugaan korupsi impor gula 2015-2016. Banyak pihak menduga kriminalisasi politik karena posisinya sebagai kritikus pemerintah.",
    tags:["tersangka","eks-menteri","nasdem","ekonom"],
    lhkpn_latest:35000000000, lhkpn_year:2019,
    connections_summary:"Eks-Mendag, tersangka Kejagung, dekat Anies",
    twitter:"@tomlembong",
    controversies:[
      { title:"Tersangka Korupsi Impor Gula", severity:"tinggi",
        description:"Ditangkap Kejaksaan Agung November 2024 atas dugaan korupsi dalam kebijakan impor gula 2015-2016. Banyak pengamat mencurigai motivasi politik karena penangkapan terjadi setelah Prabowo menjabat — Tom adalah pendukung Anies yang vokal.",
        status:"Tersangka, ditahan Kejagung 2024", source:"Kejaksaan Agung RI" },
    ],
    analysis:{
      ideology_score:2, populism_score:4, corruption_risk:"tersangka",
      nationalism:5, religiosity:3,
      track_record:"Teknokrat pro-pasar yang karirnya terhenti akibat jeratan hukum. Kasusnya menjadi simbol kekhawatiran kriminalisasi lawan politik.",
      policy_direction:"Pro-pasar bebas, liberal ekonomi"
    }
  },
  {
    id:"mahfud_md", name:"Mohammad Mahfud MD", photo_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Mahfud_MD%2C_Candidate_for_Indonesia%27s_Vice_President_in_2024.jpg/400px-Mahfud_MD%2C_Candidate_for_Indonesia%27s_Vice_President_in_2024.jpg", photo_placeholder:"MM",
    born:"13 May 1957", born_place:"Sampang, Jawa Timur", religion:"Islam",
    education:"S1 Hukum UII; S3 Ilmu Politik UGM",
    party_id:"pkb", party_role:"Anggota",
    positions:[
      {title:"Cawapres RI (Paslon 3)",  institution:"KPU",              region:"Nasional", start:"2024", end:"2024", is_current:false},
      {title:"Menko Polhukam",          institution:"Kemenko Polhukam", region:"Nasional", start:"2019", end:"2024", is_current:false},
      {title:"Ketua MK",                institution:"Mahkamah Konstitusi",region:"Nasional",start:"2008",end:"2013", is_current:false},
    ],
    tier:"nasional", region_id:"jawa-timur",
    bio:"Akademisi hukum dan negarawan dari Sampang, Jawa Timur. Mantan Ketua MK dan Menko Polhukam. Cawapres bersama Ganjar Pranowo 2024. Mengundurkan diri dari kabinet Jokowi Februari 2024 sebagai protes atas 'kondisi demokrasi yang mengkhawatirkan'.",
    tags:["akademisi","hukum","jatim","madura"],
    lhkpn_latest:22000000000, lhkpn_year:2023,
    connections_summary:"Eks-Ketua MK, Cawapres 2024, putra Sampang Jatim",
    twitter:"@mohmahfudmd",
    analysis:{
      ideology_score:0, populism_score:6, corruption_risk:"rendah",
      nationalism:7, religiosity:8,
      track_record:"Salah satu negarawan paling dihormati. Berani mundur dari kabinet sebagai protes. Akar kuat di komunitas NU Madura-Jatim.",
      policy_direction:"Hukum konstitusional, anti-korupsi"
    }
  },
  {
    id:"anwar_usman", name:"Anwar Usman", photo_url:null, photo_placeholder:"AU",
    born:"31 Dec 1956", born_place:"Bima, NTB", religion:"Islam",
    education:"S1 Hukum IAIN Jakarta; S3 Universitas Jayabaya",
    party_id:null, party_role:null,
    positions:[
      {title:"Hakim Konstitusi (anggota)", institution:"MK", region:"Nasional", start:"2011", end:null, is_current:true},
      {title:"Ketua MK (dicopot)",         institution:"MK", region:"Nasional", start:"2018", end:"2023", is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Ipar Presiden Jokowi yang dicopot dari jabatan Ketua MK November 2023 karena pelanggaran etik berat. Memimpin sidang yang mengubah syarat usia minimum Capres-Cawapres, meloloskan Gibran (putra Jokowi) maju sebagai Cawapres.",
    tags:["hakim","mk","ipar-presiden","kontroversi"],
    lhkpn_latest:8000000000, lhkpn_year:2023,
    connections_summary:"Ipar Jokowi, eks-Ketua MK, dicopot karena konflik kepentingan Gibran",
    twitter:null,
    controversies:[
      { title:"Pencopotan Ketua MK — Konflik Kepentingan Gibran", severity:"kritis",
        description:"Memimpin sidang MK yang menurunkan batas usia minimum Capres-Cawapres dari 40 ke 'pernah menjabat kepala daerah' — secara langsung meloloskan Gibran Rakabuming (istrinya adalah adik Jokowi) maju Cawapres. MKMK menyatakan Anwar terbukti melanggar etik berat dan mencopot jabatan Ketua MK November 2023.",
        status:"Dicopot dari jabatan Ketua MK; masih hakim anggota", source:"Majelis Kehormatan MK (MKMK)" },
    ],
    analysis:{
      ideology_score:3, populism_score:2, corruption_risk:"tinggi",
      nationalism:5, religiosity:6,
      track_record:"Karir kehakiman ternoda oleh keputusan kontroversial yang menguntungkan keluarga Jokowi. Momen paling gelap MK di era Reformasi.",
      policy_direction:"N/A (yudisial)"
    }
  },

  // ─── GUBERNUR PROVINSI — NASIONAL POST-PILKADA 2024 ────────────────────

  {
    id:"bobby_nasution", name:"Bobby Nasution", photo_url:"https://commons.wikimedia.org/wiki/Special:FilePath/Gubernur_Sumatera_Utara_Muhammad_Bobby_Afif_Nasution_Sutan_Porang_Gunung_Baringin_Naposo.jpg?width=400", photo_placeholder:"BN",
    born:"1991", born_place:"Sumatera Utara", religion:"Islam",
    education:"S1 Teknik Sipil, Universitas Sumatera Utara",
    party_id:"ger", party_role:"Kader",
    positions:[
      {title:"Gubernur Sumatera Utara", institution:"Pemprov Sumut", region:"Sumatera Utara", start:"2024", end:null, is_current:true},
      {title:"Walikota Medan", institution:"Pemkot Medan", region:"Sumatera Utara", start:"2020", end:"2024", is_current:false},
    ],
    tier:"regional", region_id:"sumatera_utara",
    bio:"Menantu Joko Widodo, menikahi Kahiyang Ayu putri kedua Presiden ke-7. Mantan Walikota Medan 2020-2024. Terpilih Gubernur Sumatera Utara pada Pilkada Serentak November 2024 dengan 59.2% suara mengalahkan Edy Rahmayadi.",
    tags:["gubernur","muda","menantu-jokowi","dinasti"],
    lhkpn_latest:25000000000, lhkpn_year:2023,
    connections_summary:"Gubernur Sumut, menantu Jokowi, ipar Gibran",
    twitter:"@bobbynst",
    analysis:{
      ideology_score:2, populism_score:6, corruption_risk:"rendah",
      nationalism:6, religiosity:5,
      track_record:"Walikota Medan 2020-2024 dengan program pro-rakyat. Pindah ke Gerindra jelang Pilkada 2024. Menang besar sebagai menantu eks-Presiden.",
      policy_direction:"Pro-investasi, ekonomi inklusif"
    }
  },
  {
    id:"ridwan_kamil", name:"Ridwan Kamil", photo_url:"https://commons.wikimedia.org/wiki/Special:FilePath/Governor_of_West_Java_Ridwan_Kamil.png?width=400", photo_placeholder:"RK",
    born:"4 Oct 1971", born_place:"Bandung", religion:"Islam",
    education:"S1 Arsitektur ITB; Master Arsitektur UC Berkeley",
    party_id:"gol", party_role:"Kader",
    positions:[
      {title:"Calon Gubernur DKI Jakarta (kalah)", institution:"-", region:"DKI Jakarta", start:"2024", end:"2024", is_current:false},
      {title:"Gubernur Jawa Barat", institution:"Pemprov Jabar", region:"Jawa Barat", start:"2018", end:"2023", is_current:false},
      {title:"Walikota Bandung", institution:"Pemkot Bandung", region:"Jawa Barat", start:"2013", end:"2018", is_current:false},
    ],
    tier:"regional", region_id:"jawa_barat",
    bio:"Arsitek dan politisi populer. Gubernur Jawa Barat 2018-2023. Maju Gubernur DKI Jakarta pada Pilkada 2024 diusung Golkar-Gerindra namun kalah dari Pramono Anung-Rano Karno (PDI-P) dengan perolehan 39.4%.",
    tags:["eks-gubernur","arsitek","populis","muda"],
    lhkpn_latest:62000000000, lhkpn_year:2023,
    connections_summary:"Eks-Gubernur Jabar, kalah Pilkada DKI 2024",
    twitter:"@ridwankamil",
    analysis:{
      ideology_score:2, populism_score:8, corruption_risk:"rendah",
      nationalism:7, religiosity:6,
      track_record:"Gubernur Jabar populer dengan berbagai inovasi. Kalah tipis di DKI 2024. Dianggap kandidat potensial Pilpres masa depan.",
      policy_direction:"Pro-inovasi, smart city"
    }
  },
  {
    id:"dedi_mulyadi", name:"Dedi Mulyadi", photo_url:"https://commons.wikimedia.org/wiki/Special:FilePath/Dedi_Mulyadi,_Gubernur_Jawa_barat_2025-2030.jpg?width=400", photo_placeholder:"DM",
    born:"11 Apr 1971", born_place:"Subang, Jawa Barat", religion:"Islam",
    education:"S1 Hukum, Universitas Pasundan",
    party_id:"ger", party_role:"Kader",
    positions:[
      {title:"Gubernur Jawa Barat", institution:"Pemprov Jabar", region:"Jawa Barat", start:"2024", end:null, is_current:true},
      {title:"Bupati Purwakarta", institution:"Pemkab Purwakarta", region:"Jawa Barat", start:"2008", end:"2018", is_current:false},
      {title:"Anggota DPR RI", institution:"DPR RI", region:"Nasional", start:"2019", end:"2024", is_current:false},
    ],
    tier:"regional", region_id:"jawa_barat",
    bio:"Dikenal sebagai 'Kang Dedi Mulyadi', politisi berambut panjang yang viral di media sosial. Menang Pilkada Jabar 2024 secara telak. Terkenal dengan kebijakan-kebijakan populis dan pendekatan langsung ke rakyat.",
    tags:["gubernur","viral","populis","petani"],
    lhkpn_latest:18000000000, lhkpn_year:2023,
    connections_summary:"Gubernur Jabar 2024, viral sosmed, eks-Bupati Purwakarta",
    twitter:"@dedimulyadi71",
    analysis:{
      ideology_score:3, populism_score:9, corruption_risk:"rendah",
      nationalism:7, religiosity:7,
      track_record:"Bupati Purwakarta inovatif 10 tahun. Anggota DPR 2019-2024. Gubernur Jabar terpilih 2024 dengan margin besar.",
      policy_direction:"Populis, pro-rakyat kecil, nasionalis budaya"
    }
  },
  {
    id:"ahmad_luthfi", name:"Ahmad Luthfi", photo_url:"https://commons.wikimedia.org/wiki/Special:FilePath/Ahmad_Luthfi_Official_portrait_as_governor_of_Central_Java.png?width=400", photo_placeholder:"AL",
    born:"1965", born_place:"Klaten, Jawa Tengah", religion:"Islam",
    education:"Akademi Kepolisian",
    party_id:"ger", party_role:"Kader",
    positions:[
      {title:"Gubernur Jawa Tengah", institution:"Pemprov Jateng", region:"Jawa Tengah", start:"2024", end:null, is_current:true},
      {title:"Kapolda Jawa Tengah", institution:"Polri", region:"Jawa Tengah", start:"2019", end:"2021", is_current:false},
      {title:"Kapolda Kalimantan Selatan", institution:"Polri", region:"Kalimantan Selatan", start:"2017", end:"2019", is_current:false},
    ],
    tier:"regional", region_id:"jawa_tengah",
    bio:"Mantan Kapolda Jawa Tengah. Diusung Gerindra dan koalisi besar mengalahkan Andika Perkasa (mantan Panglima TNI) pada Pilkada Jateng 2024. Merupakan kemenangan strategis Gerindra di kandang banteng PDI-P.",
    tags:["gubernur","eks-polisi","eks-kapolda"],
    lhkpn_latest:15000000000, lhkpn_year:2023,
    connections_summary:"Gubernur Jateng 2024, eks-Kapolda Jateng, kader Gerindra",
    twitter:null,
    analysis:{
      ideology_score:4, populism_score:5, corruption_risk:"rendah",
      nationalism:8, religiosity:6,
      track_record:"Kapolda Jateng kemudian Kapolda Kalsel. Menang Pilgub Jateng 2024 mengalahkan Andika Perkasa, simbol kekalahan PDI-P di basis tradisionalnya.",
      policy_direction:"Pro-keamanan, investasi"
    }
  },
  {
    id:"andra_soni", name:"Andra Soni", photo_url:"https://commons.wikimedia.org/wiki/Special:FilePath/Andra_soni_gubernur_banten_(2).jpg?width=400", photo_placeholder:"AS",
    born:"1975", born_place:"Banten", religion:"Islam",
    education:"S1 Ilmu Politik",
    party_id:"ger", party_role:"Kader",
    positions:[
      {title:"Gubernur Banten", institution:"Pemprov Banten", region:"Banten", start:"2024", end:null, is_current:true},
      {title:"Wakil Ketua DPRD Banten", institution:"DPRD Banten", region:"Banten", start:"2019", end:"2024", is_current:false},
    ],
    tier:"regional", region_id:"banten",
    bio:"Terpilih sebagai Gubernur Banten pada Pilkada 2024, menggantikan Wahidin Halim. Kader Gerindra yang diusung koalisi KIM Plus.",
    tags:["gubernur","ger"],
    lhkpn_latest:8000000000, lhkpn_year:2023,
    connections_summary:"Gubernur Banten 2024, kader Gerindra",
    twitter:null,
    analysis:{
      ideology_score:3, populism_score:5, corruption_risk:"rendah",
      nationalism:6, religiosity:6,
      track_record:"Politisi Banten berlatar DPRD. Menang Pilkada 2024 diusung Gerindra.",
      policy_direction:"Pro-investasi, infrastruktur"
    }
  },
  {
    id:"koster", name:"I Wayan Koster", photo_url:"https://commons.wikimedia.org/wiki/Special:FilePath/Wayan-Koster_Gubernur-Bali-768x961.png?width=400", photo_placeholder:"IK",
    born:"8 Sep 1971", born_place:"Buleleng, Bali", religion:"Hindu",
    education:"S1 Matematika ITB; S3 Universitas Pendidikan Ganesha",
    party_id:"pdip", party_role:"Anggota DPR",
    positions:[
      {title:"Gubernur Bali", institution:"Pemprov Bali", region:"Bali", start:"2024", end:null, is_current:true},
      {title:"Gubernur Bali (Periode I)", institution:"Pemprov Bali", region:"Bali", start:"2018", end:"2023", is_current:false},
      {title:"Anggota DPR RI", institution:"DPR RI", region:"Nasional", start:"2004", end:"2018", is_current:false},
    ],
    tier:"regional", region_id:"bali",
    bio:"Gubernur Bali dua periode dari PDI-P. Terpilih kembali pada Pilkada 2024, mempertahankan Bali sebagai benteng PDI-P. Dikenal dengan kebijakan kebudayaan Bali dan Pergub kontroversial soal penggunaan produk lokal Bali.",
    tags:["gubernur","pdip","hindu","bali"],
    lhkpn_latest:22000000000, lhkpn_year:2023,
    connections_summary:"Gubernur Bali 2x periode, loyalis Megawati",
    twitter:null,
    analysis:{
      ideology_score:-2, populism_score:6, corruption_risk:"sedang",
      nationalism:6, religiosity:7,
      track_record:"Gubernur Bali periode pertama 2018-2023. Menang kembali 2024. PDI-P mempertahankan Bali meski kalah di banyak provinsi lain.",
      policy_direction:"Pro-budaya Bali, pariwisata berkelanjutan"
    }
  },
  {
    id:"muzakir_manaf", name:"Muzakir Manaf", photo_url:"https://commons.wikimedia.org/wiki/Special:FilePath/Gubernur_Aceh_Muzakir_Manaf_Mualem_(cropped).png?width=400", photo_placeholder:"MM",
    born:"1966", born_place:"Aceh", religion:"Islam",
    education:"SMA; Militer GAM",
    party_id:"ger", party_role:"Kader",
    positions:[
      {title:"Gubernur Aceh", institution:"Pemprov Aceh", region:"Aceh", start:"2024", end:null, is_current:true},
      {title:"Wakil Gubernur Aceh", institution:"Pemprov Aceh", region:"Aceh", start:"2017", end:"2022", is_current:false},
      {title:"Panglima Militer GAM", institution:"GAM", region:"Aceh", start:"1999", end:"2005", is_current:false},
    ],
    tier:"regional", region_id:"aceh",
    bio:"Mantan Panglima Militer Gerakan Aceh Merdeka (GAM). Setelah MoU Helsinki 2005 beralih ke politik. Terpilih Gubernur Aceh 2024. Dikenal dengan nama panggilan 'Mualem'. Simbol rekonsiliasi konflik Aceh.",
    tags:["gubernur","eks-gam","rekonsiliasi","aceh"],
    lhkpn_latest:10000000000, lhkpn_year:2023,
    connections_summary:"Gubernur Aceh 2024, eks-panglima GAM, rekonsiliasi",
    twitter:null,
    analysis:{
      ideology_score:4, populism_score:7, corruption_risk:"sedang",
      nationalism:5, religiosity:8,
      track_record:"Dari panglima GAM ke Wagub ke Gubernur. Tokoh kunci rekonsiliasi Aceh pasca-MoU Helsinki. Menang Pilgub Aceh 2024.",
      policy_direction:"Otonomi Aceh, syariat Islam, pro-rakyat"
    }
  },
  {
    id:"rudy_masud", name:"Rudy Mas'ud", photo_url:"https://commons.wikimedia.org/wiki/Special:FilePath/Rudy_Mas'ud,_Governor_of_East_Kalimantan.jpg?width=400", photo_placeholder:"RM",
    born:"1972", born_place:"Samarinda, Kalimantan Timur", religion:"Islam",
    education:"S1 Hukum",
    party_id:"ger", party_role:"Ketua DPD Gerindra Kaltim",
    positions:[
      {title:"Gubernur Kalimantan Timur", institution:"Pemprov Kaltim", region:"Kalimantan Timur", start:"2024", end:null, is_current:true},
      {title:"Anggota DPR RI", institution:"DPR RI", region:"Nasional", start:"2009", end:"2024", is_current:false},
    ],
    tier:"regional", region_id:"kalimantan_timur",
    bio:"Anggota DPR RI empat periode dari Gerindra. Terpilih Gubernur Kalimantan Timur 2024. Kaltim menjadi provinsi penting karena adanya IKN Nusantara. Kehadirannya sebagai gubernur mempererat koordinasi pusat-daerah soal IKN.",
    tags:["gubernur","ger","ikn","kaltim"],
    lhkpn_latest:35000000000, lhkpn_year:2023,
    connections_summary:"Gubernur Kaltim 2024, eks-DPR 4 periode, IKN",
    twitter:null,
    analysis:{
      ideology_score:3, populism_score:5, corruption_risk:"rendah",
      nationalism:7, religiosity:5,
      track_record:"Empat periode DPR RI. Gubernur Kaltim strategis karena IKN Nusantara di wilayahnya.",
      policy_direction:"Pro-investasi, dukungan IKN"
    }
  },
  {
    id:"mahyeldi", name:"Mahyeldi Ansharullah", photo_url:null, photo_placeholder:"MA",
    born:"1966", born_place:"Sumatera Barat", religion:"Islam",
    education:"S1 Pertanian, Universitas Andalas",
    party_id:"pks", party_role:"Kader",
    positions:[
      {title:"Gubernur Sumatera Barat", institution:"Pemprov Sumbar", region:"Sumatera Barat", start:"2024", end:null, is_current:true},
      {title:"Gubernur Sumatera Barat (Periode I)", institution:"Pemprov Sumbar", region:"Sumatera Barat", start:"2021", end:"2024", is_current:false},
      {title:"Walikota Padang", institution:"Pemkot Padang", region:"Sumatera Barat", start:"2014", end:"2021", is_current:false},
    ],
    tier:"regional", region_id:"sumatera_barat",
    bio:"Gubernur Sumatera Barat dua periode dari PKS. Mantan Walikota Padang. Sumbar merupakan salah satu kantong utama PKS di Indonesia.",
    tags:["gubernur","pks","sumbar"],
    lhkpn_latest:12000000000, lhkpn_year:2023,
    connections_summary:"Gubernur Sumbar 2x periode, kader PKS",
    twitter:null,
    analysis:{
      ideology_score:6, populism_score:5, corruption_risk:"rendah",
      nationalism:6, religiosity:8,
      track_record:"Walikota Padang lalu Gubernur Sumbar. PKS dominan di Sumbar.",
      policy_direction:"Berbasis nilai Islam moderat"
    }
  },
  {
    id:"abdul_wahid", name:"Abdul Wahid", photo_url:null, photo_placeholder:"AW",
    born:"1970", born_place:"Riau", religion:"Islam",
    education:"S1 Hukum",
    party_id:"pkb", party_role:"Kader",
    positions:[
      {title:"Gubernur Riau", institution:"Pemprov Riau", region:"Riau", start:"2024", end:null, is_current:true},
      {title:"Anggota DPRD Riau", institution:"DPRD Riau", region:"Riau", start:"2019", end:"2024", is_current:false},
    ],
    tier:"regional", region_id:"riau",
    bio:"Terpilih Gubernur Riau pada Pilkada 2024 dari PKB. Riau merupakan provinsi kaya minyak dan perkebunan sawit strategis.",
    tags:["gubernur","pkb","riau"],
    lhkpn_latest:8000000000, lhkpn_year:2023,
    connections_summary:"Gubernur Riau 2024, kader PKB",
    twitter:null,
    analysis:{
      ideology_score:3, populism_score:5, corruption_risk:"rendah",
      nationalism:6, religiosity:6,
      track_record:"Politisi daerah Riau dari PKB. Menang Pilgub Riau 2024.",
      policy_direction:"Pro-pengembangan daerah, perkebunan"
    }
  },
  {
    id:"al_haris", name:"Al Haris", photo_url:null, photo_placeholder:"AH",
    born:"1972", born_place:"Jambi", religion:"Islam",
    education:"S1 Ekonomi",
    party_id:"ger", party_role:"Kader",
    positions:[
      {title:"Gubernur Jambi", institution:"Pemprov Jambi", region:"Jambi", start:"2024", end:null, is_current:true},
      {title:"Gubernur Jambi (Periode I)", institution:"Pemprov Jambi", region:"Jambi", start:"2021", end:"2024", is_current:false},
      {title:"Bupati Merangin", institution:"Pemkab Merangin", region:"Jambi", start:"2013", end:"2021", is_current:false},
    ],
    tier:"regional", region_id:"jambi",
    bio:"Gubernur Jambi dua periode. Mantan Bupati Merangin. Terpilih kembali 2024 dari Gerindra.",
    tags:["gubernur","ger","jambi"],
    lhkpn_latest:10000000000, lhkpn_year:2023,
    connections_summary:"Gubernur Jambi 2x periode, kader Gerindra",
    twitter:null,
    analysis:{
      ideology_score:3, populism_score:5, corruption_risk:"rendah",
      nationalism:6, religiosity:6,
      track_record:"Bupati Merangin lalu Gubernur Jambi dua periode.",
      policy_direction:"Pembangunan daerah, infrastruktur"
    }
  },
  {
    id:"herman_deru", name:"Herman Deru", photo_url:null, photo_placeholder:"HD",
    born:"1966", born_place:"Sumatera Selatan", religion:"Islam",
    education:"S1 Pertanian",
    party_id:"nas", party_role:"Kader",
    positions:[
      {title:"Gubernur Sumatera Selatan", institution:"Pemprov Sumsel", region:"Sumatera Selatan", start:"2024", end:null, is_current:true},
      {title:"Gubernur Sumatera Selatan (Periode I)", institution:"Pemprov Sumsel", region:"Sumatera Selatan", start:"2018", end:"2023", is_current:false},
    ],
    tier:"regional", region_id:"sumatera_selatan",
    bio:"Gubernur Sumatera Selatan dua periode dari NasDem. Sumsel merupakan provinsi batu bara dan minyak terbesar di Sumatera Selatan.",
    tags:["gubernur","nas","sumsel"],
    lhkpn_latest:15000000000, lhkpn_year:2023,
    connections_summary:"Gubernur Sumsel 2x periode",
    twitter:null,
    analysis:{
      ideology_score:2, populism_score:5, corruption_risk:"sedang",
      nationalism:6, religiosity:5,
      track_record:"Dua periode Gubernur Sumsel. NasDem pertahankan Sumsel di Pilkada 2024.",
      policy_direction:"Pro-energi, pembangunan"
    }
  },
  {
    id:"helmi_hasan", name:"Helmi Hasan", photo_url:null, photo_placeholder:"HH",
    born:"1970", born_place:"Bengkulu", religion:"Islam",
    education:"S1 Hukum",
    party_id:"pks", party_role:"Kader",
    positions:[
      {title:"Gubernur Bengkulu", institution:"Pemprov Bengkulu", region:"Bengkulu", start:"2024", end:null, is_current:true},
      {title:"Walikota Bengkulu", institution:"Pemkot Bengkulu", region:"Bengkulu", start:"2012", end:"2021", is_current:false},
    ],
    tier:"regional", region_id:"bengkulu",
    bio:"Gubernur Bengkulu terpilih 2024 dari PKS. Mantan Walikota Bengkulu.",
    tags:["gubernur","pks","bengkulu"],
    lhkpn_latest:7000000000, lhkpn_year:2023,
    connections_summary:"Gubernur Bengkulu 2024, PKS",
    twitter:null,
    analysis:{
      ideology_score:5, populism_score:5, corruption_risk:"rendah",
      nationalism:6, religiosity:7,
      track_record:"Walikota Bengkulu lalu Gubernur Bengkulu 2024.",
      policy_direction:"Pro-tata kelola, nilai Islam"
    }
  },
  {
    id:"rahmat_mirzani", name:"Rahmat Mirzani Djausal", photo_url:null, photo_placeholder:"RMD",
    born:"1975", born_place:"Lampung", religion:"Islam",
    education:"S1 Teknik",
    party_id:"ger", party_role:"Ketua DPD Gerindra Lampung",
    positions:[
      {title:"Gubernur Lampung", institution:"Pemprov Lampung", region:"Lampung", start:"2024", end:null, is_current:true},
      {title:"Anggota DPR RI", institution:"DPR RI", region:"Nasional", start:"2019", end:"2024", is_current:false},
    ],
    tier:"regional", region_id:"lampung",
    bio:"Terpilih Gubernur Lampung pada Pilkada November 2024 dari Gerindra, mengalahkan petahana. Lampung memiliki potensi agroindustri besar.",
    tags:["gubernur","ger","lampung"],
    lhkpn_latest:20000000000, lhkpn_year:2023,
    connections_summary:"Gubernur Lampung 2024, Gerindra",
    twitter:null,
    analysis:{
      ideology_score:3, populism_score:5, corruption_risk:"rendah",
      nationalism:6, religiosity:5,
      track_record:"Anggota DPR Gerindra lalu Gubernur Lampung 2024.",
      policy_direction:"Pro-agroindustri, investasi"
    }
  },
  {
    id:"hidayat_arsani", name:"Hidayat Arsani", photo_url:null, photo_placeholder:"HA",
    born:"1973", born_place:"Bangka Belitung", religion:"Islam",
    education:"S1 Hukum",
    party_id:"ger", party_role:"Kader",
    positions:[
      {title:"Gubernur Kepulauan Bangka Belitung", institution:"Pemprov Babel", region:"Bangka Belitung", start:"2024", end:null, is_current:true},
      {title:"Wakil Gubernur Kepulauan Bangka Belitung", institution:"Pemprov Babel", region:"Bangka Belitung", start:"2022", end:"2024", is_current:false},
    ],
    tier:"regional", region_id:"bangka_belitung",
    bio:"Gubernur Kepulauan Bangka Belitung terpilih 2024. Mantan Wagub. Babel terkenal dengan tambang timah dan pariwisata.",
    tags:["gubernur","ger","babel"],
    lhkpn_latest:8000000000, lhkpn_year:2023,
    connections_summary:"Gubernur Babel 2024, Gerindra",
    twitter:null,
    analysis:{
      ideology_score:3, populism_score:4, corruption_risk:"rendah",
      nationalism:6, religiosity:5,
      track_record:"Wagub lalu Gubernur Babel 2024.",
      policy_direction:"Pro-pengelolaan tambang berkelanjutan"
    }
  },
  {
    id:"ansar_ahmad", name:"Ansar Ahmad", photo_url:null, photo_placeholder:"AA",
    born:"1966", born_place:"Kepulauan Riau", religion:"Islam",
    education:"S1 Teknik Sipil",
    party_id:"gol", party_role:"Kader",
    positions:[
      {title:"Gubernur Kepulauan Riau", institution:"Pemprov Kepri", region:"Kepulauan Riau", start:"2024", end:null, is_current:true},
      {title:"Gubernur Kepulauan Riau (Periode I)", institution:"Pemprov Kepri", region:"Kepulauan Riau", start:"2021", end:"2024", is_current:false},
      {title:"Bupati Bintan", institution:"Pemkab Bintan", region:"Kepulauan Riau", start:"2010", end:"2021", is_current:false},
    ],
    tier:"regional", region_id:"kepulauan_riau",
    bio:"Gubernur Kepulauan Riau dua periode dari Golkar. Kepri berbatasan langsung dengan Singapura, menjadi kawasan investasi strategis.",
    tags:["gubernur","gol","kepri"],
    lhkpn_latest:12000000000, lhkpn_year:2023,
    connections_summary:"Gubernur Kepri 2x periode, Golkar",
    twitter:null,
    analysis:{
      ideology_score:2, populism_score:5, corruption_risk:"rendah",
      nationalism:6, religiosity:5,
      track_record:"Bupati Bintan lalu Gubernur Kepri. Fokus investasi kawasan ekonomi khusus.",
      policy_direction:"Pro-investasi, kawasan ekonomi"
    }
  },
  {
    id:"lalu_iqbal", name:"Lalu Muhamad Iqbal", photo_url:null, photo_placeholder:"LI",
    born:"1974", born_place:"Lombok, NTB", religion:"Islam",
    education:"S1 Hubungan Internasional; Diplomat Karir Kemlu",
    party_id:"nas", party_role:"Kader",
    positions:[
      {title:"Gubernur Nusa Tenggara Barat", institution:"Pemprov NTB", region:"Nusa Tenggara Barat", start:"2024", end:null, is_current:true},
      {title:"Duta Besar RI untuk Turki", institution:"Kemlu RI", region:"Internasional", start:"2019", end:"2024", is_current:false},
    ],
    tier:"regional", region_id:"nusa_tenggara_barat",
    bio:"Diplomat karir yang menjabat Dubes RI di Turki kemudian kembali ke NTB untuk maju Pilkada 2024. Menang dengan dukungan NasDem, mengalahkan Zulkieflimansyah petahana.",
    tags:["gubernur","nas","diplomat","ntb"],
    lhkpn_latest:5000000000, lhkpn_year:2023,
    connections_summary:"Gubernur NTB 2024, eks-Dubes, NasDem",
    twitter:null,
    analysis:{
      ideology_score:1, populism_score:5, corruption_risk:"rendah",
      nationalism:6, religiosity:6,
      track_record:"Karir diplomatik panjang. Gubernur NTB terpilih 2024.",
      policy_direction:"Pro-pariwisata, ekonomi kerakyatan"
    }
  },
  {
    id:"melkiades", name:"Emanuel Melkiades Laka Lena", photo_url:null, photo_placeholder:"EML",
    born:"1970", born_place:"Flores, NTT", religion:"Katolik",
    education:"S1 Ekonomi",
    party_id:"gol", party_role:"Anggota DPR",
    positions:[
      {title:"Gubernur Nusa Tenggara Timur", institution:"Pemprov NTT", region:"Nusa Tenggara Timur", start:"2024", end:null, is_current:true},
      {title:"Anggota DPR RI", institution:"DPR RI", region:"Nasional", start:"2014", end:"2024", is_current:false},
    ],
    tier:"regional", region_id:"nusa_tenggara_timur",
    bio:"Anggota DPR RI dua periode dari Golkar, terpilih Gubernur NTT pada Pilkada 2024. NTT adalah satu-satunya provinsi mayoritas Kristen/Katolik di Nusa Tenggara.",
    tags:["gubernur","gol","ntt","katolik"],
    lhkpn_latest:10000000000, lhkpn_year:2023,
    connections_summary:"Gubernur NTT 2024, Golkar, eks-DPR",
    twitter:null,
    analysis:{
      ideology_score:2, populism_score:5, corruption_risk:"rendah",
      nationalism:6, religiosity:7,
      track_record:"Dua periode DPR lalu Gubernur NTT 2024.",
      policy_direction:"Pro-pembangunan, pariwisata Flores-Komodo"
    }
  },
  {
    id:"ria_norsan", name:"Ria Norsan", photo_url:null, photo_placeholder:"RN",
    born:"1965", born_place:"Kalimantan Barat", religion:"Islam",
    education:"S1 Administrasi Negara",
    party_id:"gol", party_role:"Kader",
    positions:[
      {title:"Gubernur Kalimantan Barat", institution:"Pemprov Kalbar", region:"Kalimantan Barat", start:"2024", end:null, is_current:true},
      {title:"Gubernur Kalimantan Barat (Periode I)", institution:"Pemprov Kalbar", region:"Kalimantan Barat", start:"2021", end:"2024", is_current:false},
      {title:"Bupati Mempawah", institution:"Pemkab Mempawah", region:"Kalimantan Barat", start:"2011", end:"2021", is_current:false},
    ],
    tier:"regional", region_id:"kalimantan_barat",
    bio:"Gubernur Kalimantan Barat dua periode dari Golkar. Kalbar berbatasan langsung dengan Malaysia, menjadi daerah strategis perbatasan.",
    tags:["gubernur","gol","kalbar","perbatasan"],
    lhkpn_latest:12000000000, lhkpn_year:2023,
    connections_summary:"Gubernur Kalbar 2x periode, Golkar",
    twitter:null,
    analysis:{
      ideology_score:2, populism_score:5, corruption_risk:"rendah",
      nationalism:7, religiosity:5,
      track_record:"Bupati Mempawah lalu Gubernur Kalbar. Fokus perbatasan Indonesia-Malaysia.",
      policy_direction:"Pro-perbatasan, investasi"
    }
  },
  {
    id:"agustiar_sabran", name:"Agustiar Sabran", photo_url:null, photo_placeholder:"AGS",
    born:"1972", born_place:"Kalimantan Tengah", religion:"Islam",
    education:"S1 Hukum",
    party_id:"ger", party_role:"Kader",
    positions:[
      {title:"Gubernur Kalimantan Tengah", institution:"Pemprov Kalteng", region:"Kalimantan Tengah", start:"2024", end:null, is_current:true},
      {title:"Anggota DPR RI", institution:"DPR RI", region:"Nasional", start:"2019", end:"2024", is_current:false},
    ],
    tier:"regional", region_id:"kalimantan_tengah",
    bio:"Terpilih Gubernur Kalimantan Tengah pada Pilkada 2024 dari Gerindra. Kalteng berbatasan dengan IKN Nusantara di Kaltim, memiliki peran penting dalam pembangunan ibu kota baru.",
    tags:["gubernur","ger","kalteng"],
    lhkpn_latest:15000000000, lhkpn_year:2023,
    connections_summary:"Gubernur Kalteng 2024, Gerindra",
    twitter:null,
    analysis:{
      ideology_score:3, populism_score:5, corruption_risk:"rendah",
      nationalism:6, religiosity:5,
      track_record:"Anggota DPR Gerindra lalu Gubernur Kalteng 2024.",
      policy_direction:"Pro-pembangunan, dukungan IKN"
    }
  },
  {
    id:"muhidin", name:"H. Muhidin", photo_url:null, photo_placeholder:"MHD",
    born:"1965", born_place:"Kalimantan Selatan", religion:"Islam",
    education:"S1 Ekonomi",
    party_id:"ger", party_role:"Kader",
    positions:[
      {title:"Gubernur Kalimantan Selatan", institution:"Pemprov Kalsel", region:"Kalimantan Selatan", start:"2024", end:null, is_current:true},
      {title:"Bupati Balangan", institution:"Pemkab Balangan", region:"Kalimantan Selatan", start:"2015", end:"2023", is_current:false},
    ],
    tier:"regional", region_id:"kalimantan_selatan",
    bio:"Gubernur Kalimantan Selatan terpilih 2024 dari Gerindra. Kalsel dikenal sebagai sentra batu bara terbesar Indonesia.",
    tags:["gubernur","ger","kalsel","batubara"],
    lhkpn_latest:18000000000, lhkpn_year:2023,
    connections_summary:"Gubernur Kalsel 2024, Gerindra",
    twitter:null,
    analysis:{
      ideology_score:3, populism_score:4, corruption_risk:"rendah",
      nationalism:6, religiosity:6,
      track_record:"Bupati Balangan lalu Gubernur Kalsel 2024.",
      policy_direction:"Pro-energi, tambang berkelanjutan"
    }
  },
  {
    id:"zainal_arifin", name:"Zainal Arifin Paliwang", photo_url:null, photo_placeholder:"ZAP",
    born:"1965", born_place:"Kalimantan Utara", religion:"Islam",
    education:"Akademi Kepolisian",
    party_id:"ger", party_role:"Kader",
    positions:[
      {title:"Gubernur Kalimantan Utara", institution:"Pemprov Kaltara", region:"Kalimantan Utara", start:"2024", end:null, is_current:true},
      {title:"Gubernur Kalimantan Utara (Periode I)", institution:"Pemprov Kaltara", region:"Kalimantan Utara", start:"2021", end:"2024", is_current:false},
    ],
    tier:"regional", region_id:"kalimantan_utara",
    bio:"Gubernur Kalimantan Utara dua periode. Mantan perwira Polri. Kaltara merupakan provinsi paling utara Indonesia, berbatasan Malaysia.",
    tags:["gubernur","ger","kaltara","eks-polisi"],
    lhkpn_latest:8000000000, lhkpn_year:2023,
    connections_summary:"Gubernur Kaltara 2x periode, Gerindra",
    twitter:null,
    analysis:{
      ideology_score:4, populism_score:4, corruption_risk:"rendah",
      nationalism:8, religiosity:5,
      track_record:"Dua periode Gubernur Kaltara. Fokus perbatasan dan PLTA Kayan.",
      policy_direction:"Pro-perbatasan, energi terbarukan"
    }
  },
  {
    id:"yulius_selvanus", name:"Yulius Selvanus", photo_url:null, photo_placeholder:"YS",
    born:"1972", born_place:"Sulawesi Utara", religion:"Kristen",
    education:"Akademi Kepolisian",
    party_id:"ger", party_role:"Kader",
    positions:[
      {title:"Gubernur Sulawesi Utara", institution:"Pemprov Sulut", region:"Sulawesi Utara", start:"2024", end:null, is_current:true},
    ],
    tier:"regional", region_id:"sulawesi_utara",
    bio:"Gubernur Sulawesi Utara terpilih 2024 dari Gerindra. Sulut merupakan pintu gerbang Indonesia ke Pasifik dan berbatasan dengan Filipina.",
    tags:["gubernur","ger","sulut","kristen"],
    lhkpn_latest:7000000000, lhkpn_year:2023,
    connections_summary:"Gubernur Sulut 2024, Gerindra",
    twitter:null,
    analysis:{
      ideology_score:3, populism_score:5, corruption_risk:"rendah",
      nationalism:7, religiosity:6,
      track_record:"Terpilih Gubernur Sulut 2024.",
      policy_direction:"Pro-pariwisata, investasi Pasifik"
    }
  },
  {
    id:"anwar_hafid", name:"Anwar Hafid", photo_url:null, photo_placeholder:"ANH",
    born:"1970", born_place:"Sulawesi Tengah", religion:"Islam",
    education:"S1 Hukum",
    party_id:"ger", party_role:"Kader",
    positions:[
      {title:"Gubernur Sulawesi Tengah", institution:"Pemprov Sulteng", region:"Sulawesi Tengah", start:"2024", end:null, is_current:true},
      {title:"Bupati Morowali Utara", institution:"Pemkab Morowali Utara", region:"Sulawesi Tengah", start:"2016", end:"2021", is_current:false},
    ],
    tier:"regional", region_id:"sulawesi_tengah",
    bio:"Gubernur Sulawesi Tengah terpilih 2024 dari Gerindra. Sulteng memiliki kawasan industri nikel-baterai Morowali yang menjadi pusat smelter terbesar dunia.",
    tags:["gubernur","ger","sulteng","nikel"],
    lhkpn_latest:10000000000, lhkpn_year:2023,
    connections_summary:"Gubernur Sulteng 2024, Gerindra, Morowali",
    twitter:null,
    analysis:{
      ideology_score:3, populism_score:5, corruption_risk:"rendah",
      nationalism:6, religiosity:6,
      track_record:"Bupati Morowali Utara lalu Gubernur Sulteng 2024.",
      policy_direction:"Pro-industri nikel, investasi"
    }
  },
  {
    id:"andi_sudirman", name:"Andi Sudirman Sulaiman", photo_url:null, photo_placeholder:"ASS",
    born:"1986", born_place:"Makassar, Sulawesi Selatan", religion:"Islam",
    education:"S1 Teknik Sipil ITB; S2 Teknik Sipil ITB",
    party_id:"nas", party_role:"Kader",
    positions:[
      {title:"Gubernur Sulawesi Selatan", institution:"Pemprov Sulsel", region:"Sulawesi Selatan", start:"2024", end:null, is_current:true},
      {title:"Gubernur Sulawesi Selatan (Periode I)", institution:"Pemprov Sulsel", region:"Sulawesi Selatan", start:"2021", end:"2024", is_current:false},
    ],
    tier:"regional", region_id:"sulawesi_selatan",
    bio:"Gubernur Sulawesi Selatan dua periode dari NasDem. Menjabat sejak 2021 sebagai penerus Nurdin Abdullah yang terseret kasus korupsi. Sulsel adalah pusat ekonomi Kawasan Timur Indonesia.",
    tags:["gubernur","nas","sulsel","muda","itb"],
    lhkpn_latest:5000000000, lhkpn_year:2023,
    connections_summary:"Gubernur Sulsel 2x periode, NasDem, termuda",
    twitter:null,
    analysis:{
      ideology_score:2, populism_score:6, corruption_risk:"rendah",
      nationalism:6, religiosity:6,
      track_record:"Gubernur Sulsel termuda. Diusung NasDem. Fokus infrastruktur dan investasi KTI.",
      policy_direction:"Pro-investasi KTI, infrastruktur"
    }
  },
  {
    id:"andi_sumangerukka", name:"Andi Sumangerukka", photo_url:null, photo_placeholder:"ASUK",
    born:"1968", born_place:"Sulawesi Tenggara", religion:"Islam",
    education:"Akademi Kepolisian",
    party_id:"ger", party_role:"Kader",
    positions:[
      {title:"Gubernur Sulawesi Tenggara", institution:"Pemprov Sultra", region:"Sulawesi Tenggara", start:"2024", end:null, is_current:true},
    ],
    tier:"regional", region_id:"sulawesi_tenggara",
    bio:"Gubernur Sulawesi Tenggara terpilih 2024 dari Gerindra. Sultra kaya nikel dan pertambangan.",
    tags:["gubernur","ger","sultra"],
    lhkpn_latest:8000000000, lhkpn_year:2023,
    connections_summary:"Gubernur Sultra 2024, Gerindra",
    twitter:null,
    analysis:{
      ideology_score:3, populism_score:4, corruption_risk:"rendah",
      nationalism:7, religiosity:5,
      track_record:"Terpilih Gubernur Sultra 2024 dari Gerindra.",
      policy_direction:"Pro-pertambangan, investasi"
    }
  },
  {
    id:"gusnar_ismail", name:"Gusnar Ismail", photo_url:null, photo_placeholder:"GI",
    born:"1965", born_place:"Gorontalo", religion:"Islam",
    education:"S1 Ekonomi",
    party_id:"gol", party_role:"Kader",
    positions:[
      {title:"Gubernur Gorontalo", institution:"Pemprov Gorontalo", region:"Gorontalo", start:"2024", end:null, is_current:true},
      {title:"Wakil Gubernur Gorontalo", institution:"Pemprov Gorontalo", region:"Gorontalo", start:"2019", end:"2024", is_current:false},
    ],
    tier:"regional", region_id:"gorontalo",
    bio:"Gubernur Gorontalo terpilih 2024 dari Golkar. Mantan Wakil Gubernur. Gorontalo merupakan provinsi terkecil di Sulawesi.",
    tags:["gubernur","gol","gorontalo"],
    lhkpn_latest:6000000000, lhkpn_year:2023,
    connections_summary:"Gubernur Gorontalo 2024, Golkar",
    twitter:null,
    analysis:{
      ideology_score:2, populism_score:4, corruption_risk:"rendah",
      nationalism:6, religiosity:6,
      track_record:"Wagub lalu Gubernur Gorontalo 2024.",
      policy_direction:"Pro-pertanian, jagung"
    }
  },
  {
    id:"sitti_sutinah", name:"Sitti Sutinah Suhardi", photo_url:null, photo_placeholder:"SSS",
    born:"1972", born_place:"Sulawesi Barat", religion:"Islam",
    education:"S1 Hukum",
    party_id:"ger", party_role:"Kader",
    positions:[
      {title:"Gubernur Sulawesi Barat", institution:"Pemprov Sulbar", region:"Sulawesi Barat", start:"2024", end:null, is_current:true},
      {title:"Anggota DPRD Sulawesi Barat", institution:"DPRD Sulbar", region:"Sulawesi Barat", start:"2019", end:"2024", is_current:false},
    ],
    tier:"regional", region_id:"sulawesi_barat",
    bio:"Gubernur Sulawesi Barat terpilih 2024 dari Gerindra. Sulbar adalah provinsi termuda di Sulawesi, terbentuk 2004.",
    tags:["gubernur","ger","sulbar","perempuan"],
    lhkpn_latest:5000000000, lhkpn_year:2023,
    connections_summary:"Gubernur Sulbar 2024, Gerindra",
    twitter:null,
    analysis:{
      ideology_score:3, populism_score:4, corruption_risk:"rendah",
      nationalism:6, religiosity:6,
      track_record:"DPRD lalu Gubernur Sulbar 2024.",
      policy_direction:"Pembangunan daerah, infrastruktur"
    }
  },
  {
    id:"hendrik_lewerissa", name:"Hendrik Lewerissa", photo_url:null, photo_placeholder:"HL",
    born:"1970", born_place:"Maluku", religion:"Kristen",
    education:"S1 Hukum Universitas Pattimura",
    party_id:"ger", party_role:"Kader",
    positions:[
      {title:"Gubernur Maluku", institution:"Pemprov Maluku", region:"Maluku", start:"2024", end:null, is_current:true},
      {title:"Anggota DPR RI", institution:"DPR RI", region:"Nasional", start:"2009", end:"2024", is_current:false},
    ],
    tier:"regional", region_id:"maluku",
    bio:"Anggota DPR RI tiga periode dari Gerindra, terpilih Gubernur Maluku 2024. Maluku memiliki sumber daya laut dan rempah yang kaya.",
    tags:["gubernur","ger","maluku","kristen"],
    lhkpn_latest:15000000000, lhkpn_year:2023,
    connections_summary:"Gubernur Maluku 2024, Gerindra, eks-DPR",
    twitter:null,
    analysis:{
      ideology_score:3, populism_score:5, corruption_risk:"rendah",
      nationalism:7, religiosity:6,
      track_record:"Tiga periode DPR RI lalu Gubernur Maluku 2024.",
      policy_direction:"Pro-kelautan, pariwisata"
    }
  },
  {
    id:"sherly_tjoanda", name:"Sherly Tjoanda", photo_url:null, photo_placeholder:"ST",
    born:"1975", born_place:"Maluku Utara", religion:"Kristen",
    education:"S1 Ekonomi",
    party_id:"ger", party_role:"Kader",
    positions:[
      {title:"Gubernur Maluku Utara", institution:"Pemprov Malut", region:"Maluku Utara", start:"2025", end:null, is_current:true},
      {title:"Calon Wakil Gubernur Maluku Utara", institution:"-", region:"Maluku Utara", start:"2024", end:"2024", is_current:false},
    ],
    tier:"regional", region_id:"maluku_utara",
    bio:"Gubernur Maluku Utara yang naik dari posisi calon Wakil Gubernur setelah calon gubernurnya, Benny Laos, meninggal akibat kecelakaan kapal dalam kampanye Oktober 2024. Dilantik sebagai Gubernur Malut awal 2025.",
    tags:["gubernur","ger","malut","perempuan","naik-jabatan"],
    lhkpn_latest:8000000000, lhkpn_year:2024,
    connections_summary:"Gubernur Malut 2025, naik dari cawagub setelah Benny Laos meninggal",
    twitter:null,
    analysis:{
      ideology_score:3, populism_score:4, corruption_risk:"rendah",
      nationalism:6, religiosity:6,
      track_record:"Naik dari cawagub ke gubernur setelah calon gubernurnya meninggal kecelakaan. Malut kaya nikel.",
      policy_direction:"Pro-nikel, pembangunan"
    }
  },
  {
    id:"sultan_hb10", name:"Sri Sultan Hamengkubuwono X", photo_url:null, photo_placeholder:"SHX",
    born:"2 Apr 1946", born_place:"Yogyakarta", religion:"Islam",
    education:"S1 Hukum UGM; S3 Hukum UGM",
    party_id:null, party_role:null,
    positions:[
      {title:"Gubernur Daerah Istimewa Yogyakarta", institution:"Kraton Ngayogyakarta", region:"DIY", start:"1998", end:null, is_current:true},
      {title:"Sri Sultan Hamengkubuwono X", institution:"Kraton Ngayogyakarta", region:"DIY", start:"1989", end:null, is_current:true},
    ],
    tier:"regional", region_id:"diy",
    bio:"Raja Keraton Yogyakarta sekaligus Gubernur DIY sejak 1998. Berdasarkan UU No.13/2012, Gubernur DIY tidak dipilih melalui Pilkada melainkan otomatis dijabat Sultan Yogyakarta. Tokoh berpengaruh dalam budaya dan politik nasional.",
    tags:["gubernur","raja","istimewa","diy","budaya"],
    lhkpn_latest:null, lhkpn_year:null,
    connections_summary:"Gubernur DIY seumur hidup, Raja Kraton Yogya",
    twitter:null,
    analysis:{
      ideology_score:0, populism_score:6, corruption_risk:"rendah",
      nationalism:8, religiosity:7,
      track_record:"Gubernur DIY sejak 1998. Keistimewaan DIY berdasarkan sejarah Sultan bergabung dengan RI 1945.",
      policy_direction:"Keistimewaan, budaya, pariwisata"
    }
  },

  // ─── MENTERI & PEJABAT NASIONAL TAMBAHAN ────────────────────────────────

  {
    id:"budi_arie", name:"Budi Arie Setiadi", photo_url:null, photo_placeholder:"BA",
    born:"1972", born_place:"Jakarta", religion:"Islam",
    education:"S1 Fisip UI",
    party_id:"psi", party_role:"Ketua Umum Dewan Pembina",
    positions:[
      {title:"Menteri Komunikasi dan Informatika", institution:"Kemenkominfo", region:"Nasional", start:"2023", end:"2024", is_current:false},
      {title:"Menteri Koperasi", institution:"Kemenkop", region:"Nasional", start:"2024", end:null, is_current:true},
      {title:"Ketua Umum Dewan Pembina PSI", institution:"PSI", region:"Nasional", start:"2019", end:null, is_current:true},
    ],
    tier:"nasional", region_id:null,
    bio:"Politisi dekat Jokowi, Ketua Projo (relawan Jokowi). Menjabat Menkominfo 2023-2024 di masa akhir Jokowi, dilanjutkan Kabinet Prabowo sebagai Menteri Koperasi. Dikritik atas penanganan judi online dan kebocoran data saat Menkominfo.",
    tags:["menteri","psi","jokowi-loyalis","kominfo"],
    lhkpn_latest:12000000000, lhkpn_year:2023,
    connections_summary:"Menteri Kabinet Prabowo, eks-Menkominfo, loyalis Jokowi",
    twitter:"@budiari",
    analysis:{
      ideology_score:2, populism_score:5, corruption_risk:"sedang",
      nationalism:6, religiosity:4,
      track_record:"Menkominfo 2023-2024 dikritik soal judi online dan PDN. Pindah ke Kemenkop di kabinet Prabowo.",
      policy_direction:"Pro-digital, ekonomi kerakyatan"
    }
  },
  {
    id:"erick_thohir", name:"Erick Thohir", photo_url:"https://commons.wikimedia.org/wiki/Special:FilePath/Menteri_Pemuda_dan_Olahraga_Indonesia_Erick_Thohir.png?width=400", photo_placeholder:"ET",
    born:"30 May 1970", born_place:"Jakarta", religion:"Islam",
    education:"S1 Bisnis, Glendale University; MBA, National University USA",
    party_id:"ger", party_role:"Kader",
    positions:[
      {title:"Menteri Badan Usaha Milik Negara", institution:"Kementerian BUMN", region:"Nasional", start:"2024", end:null, is_current:true},
      {title:"Menteri BUMN (Periode I)", institution:"Kementerian BUMN", region:"Nasional", start:"2019", end:"2024", is_current:false},
      {title:"Ketua Umum PSSI", institution:"PSSI", region:"Nasional", start:"2023", end:null, is_current:true},
    ],
    tier:"nasional", region_id:null,
    bio:"Pengusaha media dan olahraga. Pemilik Inter Milan (2013-2018), Anfield (saham Liverpool), dan media grup iNews/ANTV. Menteri BUMN dua periode: era Jokowi dan Prabowo. Ketua PSSI reformis sejak 2023. Dikenal dekat Prabowo dan Jokowi.",
    tags:["menteri","pengusaha","bumn","pssi","olahraga"],
    lhkpn_latest:2500000000000, lhkpn_year:2023,
    connections_summary:"Menkeu BUMN, eks-pemilik Inter Milan, Ketum PSSI",
    twitter:"@erickthohir",
    analysis:{
      ideology_score:2, populism_score:6, corruption_risk:"sedang",
      nationalism:7, religiosity:6,
      track_record:"Menteri BUMN dua periode. Reformasi GoTo, BRI, Telkom. Ketum PSSI reformis. Pengusaha sukses internasional.",
      policy_direction:"Pro-privatisasi BUMN, investasi asing"
    }
  },
  {
    id:"basuki", name:"Basuki Hadimuljono", photo_url:"https://commons.wikimedia.org/wiki/Special:FilePath/KIM_Basuki_Hadimuljono.jpg?width=400", photo_placeholder:"BHM",
    born:"5 Nov 1954", born_place:"Surakarta, Jawa Tengah", religion:"Islam",
    education:"S1 Teknik Sipil UGM; PhD Teknik Sipil Colorado State University",
    party_id:null, party_role:null,
    positions:[
      {title:"Kepala Otorita IKN Nusantara", institution:"Otorita IKN", region:"Kalimantan Timur", start:"2024", end:null, is_current:true},
      {title:"Menteri PUPR", institution:"Kementerian PUPR", region:"Nasional", start:"2014", end:"2024", is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Teknokrat infrastruktur andalan Jokowi selama 10 tahun (2014-2024). Menteri PUPR yang mengawal ribuan proyek infrastruktur nasional. Ditunjuk Prabowo sebagai Kepala Otorita IKN Nusantara untuk melanjutkan mega-proyek ibu kota baru di Kalimantan Timur.",
    tags:["teknokrat","infrastruktur","ikn","pupr"],
    lhkpn_latest:45000000000, lhkpn_year:2023,
    connections_summary:"Kepala OIKN Nusantara, eks-Menteri PUPR 10 tahun",
    twitter:null,
    analysis:{
      ideology_score:0, populism_score:2, corruption_risk:"rendah",
      nationalism:8, religiosity:5,
      track_record:"Menteri PUPR terlama dan paling produktif era Jokowi. Memimpin ribuan km jalan tol, bendungan, dan proyek infrastruktur. Kini amanahkan pindahkan IKN Nusantara.",
      policy_direction:"Pro-infrastruktur, teknokrat"
    }
  },

  // ─── DPR COMMISSION CHAIRS (2024–2029) ──────────────────────────────────
  {
    id:"meutya_hafid", name:"Meutya Viada Hafid", photo_url:"https://commons.wikimedia.org/wiki/Special:FilePath/Menteri_Komunikasi_dan_Digital_Indonesia_Meutya_Viada_Hafid.jpg?width=400", photo_placeholder:"MH",
    born:"1978", born_place:"Bandung", religion:"Islam",
    education:"S1 Komunikasi, Universitas Indonesia",
    party_id:"gol", party_role:"Ketua Komisi I DPR / Menkomdigi",
    positions:[
      {title:"Menteri Komunikasi dan Digital RI", institution:"Kemenkomdigi RI", region:"Nasional", start:"2024", end:null, is_current:true},
      {title:"Ketua Komisi I DPR RI", institution:"DPR RI", region:"Nasional", start:"2024", end:"2024", is_current:false},
      {title:"Anggota DPR RI", institution:"DPR RI", region:"Sumatera Utara", start:"2009", end:"2024", is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Mantan jurnalis Metro TV yang beralih ke politik. Sempat menjabat Ketua Komisi I DPR yang membidangi pertahanan, intelijen, luar negeri sebelum diangkat sebagai Menteri Komunikasi dan Digital dalam Kabinet Merah Putih Prabowo.",
    tags:["dpr","perempuan","jurnalis","komisi-1","menteri"],
    lhkpn_latest:8500000000, lhkpn_year:2023,
    connections_summary:"Menkomdigi, eks-Ketua Komisi I DPR, Golkar",
    twitter:null,
    analysis:{
      ideology_score:3, populism_score:4, corruption_risk:"rendah",
      nationalism:6, religiosity:4,
      track_record:"Mantan jurnalis Metro TV. Karir DPR sejak 2009. Dikenal vokal soal pertahanan dan kebebasan pers. Ditunjuk Prabowo sebagai Menkomdigi.",
      policy_direction:"Pro-pertahanan, Nasionalis"
    }
  },
  {
    id:"utut_adianto", name:"Utut Adianto", photo_url:null, photo_placeholder:"UA",
    born:"1965", born_place:"Surakarta", religion:"Islam",
    education:"Grandmaster Catur Internasional (FIDE)",
    party_id:"pdip", party_role:"Ketua Komisi II DPR",
    positions:[
      {title:"Ketua Komisi II DPR RI", institution:"DPR RI", region:"Nasional", start:"2024", end:null, is_current:true},
      {title:"Anggota DPR RI", institution:"DPR RI", region:"Jawa Tengah", start:"2009", end:null, is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Grandmaster catur Indonesia peringkat dunia yang beralih ke politik bersama PDIP. Ketua Komisi II DPR yang membidangi pemerintahan dalam negeri, otonomi daerah, aparatur negara, dan kepemiluan.",
    tags:["dpr","pdip","komisi-2","unik"],
    lhkpn_latest:5000000000, lhkpn_year:2023,
    connections_summary:"Ketua Komisi II DPR, PDIP, Grandmaster Catur",
    twitter:null,
    analysis:{
      ideology_score:-2, populism_score:4, corruption_risk:"rendah",
      nationalism:5, religiosity:4,
      track_record:"Grandmaster catur bertaraf internasional, pernah peringkat ke-2 dunia. Anggota DPR dari PDIP sejak 2009. Komisi II mengawasi Kemendagri dan KPU.",
      policy_direction:"Pro-PDIP, otonomi daerah"
    }
  },
  {
    id:"habiburokhman", name:"Habiburokhman", photo_url:"https://upload.wikimedia.org/wikipedia/id/thumb/1/11/Habiburokhman_Ketua_Komisi_III_DPR_RI.jpeg/400px-Habiburokhman_Ketua_Komisi_III_DPR_RI.jpeg", photo_placeholder:"HB",
    born:"1979", born_place:"Aceh", religion:"Islam",
    education:"S1 Hukum, Universitas Syiah Kuala; S2 Hukum",
    party_id:"ger", party_role:"Ketua Komisi III DPR",
    positions:[
      {title:"Ketua Komisi III DPR RI", institution:"DPR RI", region:"Nasional", start:"2024", end:null, is_current:true},
      {title:"Wakil Ketua Umum Gerindra", institution:"Partai Gerindra", region:"Nasional", start:"2020", end:null, is_current:true},
      {title:"Anggota DPR RI", institution:"DPR RI", region:"DKI Jakarta", start:"2014", end:null, is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Politisi Gerindra yang dikenal vokal dan blak-blakan di parlemen. Ketua Komisi III DPR yang membidangi hukum, HAM, dan keamanan. Salah satu loyalis utama Prabowo di DPR.",
    tags:["dpr","gerindra","komisi-3","hukum","loyalis-prabowo"],
    lhkpn_latest:12000000000, lhkpn_year:2023,
    connections_summary:"Ketua Komisi III DPR, Waketum Gerindra, loyalis Prabowo",
    twitter:null,
    analysis:{
      ideology_score:5, populism_score:6, corruption_risk:"rendah",
      nationalism:7, religiosity:5,
      track_record:"Dikenal sebagai debater ulung di DPR. Vokal membela kepentingan Gerindra dan Prabowo di Komisi III yang mengawasi Kemenkumham dan Polri.",
      policy_direction:"Pro-Prabowo, penegakan hukum"
    }
  },
  {
    id:"titiek_soeharto", name:"Siti Hediati Hariyadi (Titiek Soeharto)", photo_url:"https://commons.wikimedia.org/wiki/Special:FilePath/KPU_Siti_Hediati_Hariyadi.jpg?width=400", photo_placeholder:"TS",
    born:"1959", born_place:"Jakarta", religion:"Islam",
    education:"S1 Peternakan, Institut Pertanian Bogor",
    party_id:"ger", party_role:"Ketua Komisi IV DPR",
    positions:[
      {title:"Ketua Komisi IV DPR RI", institution:"DPR RI", region:"Nasional", start:"2024", end:null, is_current:true},
      {title:"Anggota DPR RI", institution:"DPR RI", region:"DI Yogyakarta", start:"2014", end:null, is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Putri mantan Presiden Soeharto dan mantan istri Prabowo Subianto. Ketua Komisi IV DPR yang membidangi pertanian, pangan, lingkungan hidup, dan kelautan. Politisi Gerindra yang kembali ke parlemen mewakili warisan dinasti Soeharto.",
    tags:["dpr","gerindra","komisi-4","perempuan","dinasti","eks-soeharto"],
    lhkpn_latest:35000000000, lhkpn_year:2023,
    connections_summary:"Putri Soeharto, eks-istri Prabowo, Ketua Komisi IV DPR",
    twitter:null,
    analysis:{
      ideology_score:4, populism_score:3, corruption_risk:"sedang",
      nationalism:6, religiosity:4,
      track_record:"Latar belakang dinasti politik Soeharto. Mantan istri Prabowo (menikah 1983, bercerai 1998). Aktif di Golkar lalu pindah ke Gerindra. Komisi IV mengawasi Kementan dan KKP.",
      policy_direction:"Pro-pertanian, ketahanan pangan"
    }
  },
  {
    id:"sartono_hutomo", name:"Sartono Hutomo", photo_url:null, photo_placeholder:"SH2",
    born:"1972", born_place:"Jawa Tengah", religion:"Islam",
    education:"S1 Ekonomi",
    party_id:"ger", party_role:"Ketua Komisi VI DPR",
    positions:[
      {title:"Ketua Komisi VI DPR RI", institution:"DPR RI", region:"Nasional", start:"2024", end:null, is_current:true},
      {title:"Anggota DPR RI", institution:"DPR RI", region:"Jawa Tengah", start:"2014", end:null, is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Politisi Gerindra yang menjabat Ketua Komisi VI DPR yang membidangi perindustrian, perdagangan dalam negeri, investasi, koperasi/UKM, dan pengawasan BUMN. Posisi strategis karena mengawasi ratusan BUMN Indonesia.",
    tags:["dpr","gerindra","komisi-6","bumn","industri"],
    lhkpn_latest:8000000000, lhkpn_year:2023,
    connections_summary:"Ketua Komisi VI DPR, Gerindra, pengawas BUMN",
    twitter:null,
    analysis:{
      ideology_score:4, populism_score:4, corruption_risk:"rendah",
      nationalism:6, religiosity:4,
      track_record:"Anggota DPR dari Gerindra dengan fokus ekonomi dan industri. Komisi VI mengawasi Kementerian BUMN, Kemendag, dan BUMN-BUMN besar Indonesia.",
      policy_direction:"Pro-BUMN, industri nasional"
    }
  },
  {
    id:"marwan_dasopang", name:"Marwan Dasopang", photo_url:null, photo_placeholder:"MD2",
    born:"1966", born_place:"Sumatera Utara", religion:"Islam",
    education:"S1 Ekonomi, Universitas Muhammadiyah Sumatera Utara",
    party_id:"pkb", party_role:"Ketua Komisi VIII DPR",
    positions:[
      {title:"Ketua Komisi VIII DPR RI", institution:"DPR RI", region:"Nasional", start:"2024", end:null, is_current:true},
      {title:"Wakil Ketua Komisi VIII DPR RI", institution:"DPR RI", region:"Nasional", start:"2019", end:"2024", is_current:false},
      {title:"Anggota DPR RI", institution:"DPR RI", region:"Sumatera Utara", start:"2014", end:null, is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Politisi PKB dari Sumatera Utara yang menjabat Ketua Komisi VIII DPR yang membidangi agama, sosial, pemberdayaan perempuan, dan perlindungan anak. Sebelumnya menjabat sebagai Wakil Ketua Komisi VIII pada periode 2019-2024.",
    tags:["dpr","pkb","komisi-8","agama","sosial"],
    lhkpn_latest:6000000000, lhkpn_year:2023,
    connections_summary:"Ketua Komisi VIII DPR, PKB, Sumatera Utara",
    twitter:null,
    analysis:{
      ideology_score:1, populism_score:5, corruption_risk:"rendah",
      nationalism:5, religiosity:7,
      track_record:"Politisi PKB berlatar belakang pesantren. Komisi VIII mengawasi Kemenag, Kemensos, dan KemenPPPA. Konsisten pada isu keagamaan dan kesejahteraan sosial.",
      policy_direction:"Pro-pesantren, kesejahteraan sosial"
    }
  },
  {
    id:"misbakhun", name:"Mukhamad Misbakhun", photo_url:null, photo_placeholder:"MB",
    born:"1970", born_place:"Pasuruan, Jawa Timur", religion:"Islam",
    education:"S1 Ekonomi; S2 Akuntansi",
    party_id:"gol", party_role:"Ketua Komisi XI DPR",
    positions:[
      {title:"Ketua Komisi XI DPR RI", institution:"DPR RI", region:"Nasional", start:"2024", end:null, is_current:true},
      {title:"Anggota DPR RI", institution:"DPR RI", region:"Jawa Timur", start:"2009", end:null, is_current:false},
    ],
    tier:"nasional", region_id:null,
    bio:"Politisi Golkar eks-PKS yang dikenal vokal di isu perpajakan dan fiskal. Ketua Komisi XI DPR yang membidangi keuangan, perbankan, perencanaan pembangunan, OJK, dan BI. Mantan pejabat yang pindah ke dunia politik.",
    tags:["dpr","gol","komisi-11","fiskal","perbankan"],
    lhkpn_latest:15000000000, lhkpn_year:2023,
    connections_summary:"Ketua Komisi XI DPR, Golkar, pengawas BI dan OJK",
    twitter:null,
    analysis:{
      ideology_score:2, populism_score:5, corruption_risk:"rendah",
      nationalism:6, religiosity:5,
      track_record:"Eks-anggota PKS yang pindah ke Golkar. Dikenal ahli perpajakan. Komisi XI mengawasi Kemenkeu, BI, OJK, dan BPS — posisi sangat strategis untuk kebijakan fiskal nasional.",
      policy_direction:"Pro-fiskal, pengawasan sektor keuangan"
    }
  },
  {
    id:"hary_tanoe", name:"Hary Tanoesoedibjo", photo_url:null, photo_placeholder:"HT",
    born:"26 Sep 1965", born_place:"Surabaya", religion:"Kristen",
    education:"S1 Bisnis, Carleton University Ottawa, Kanada; MBA, University of Ottawa",
    party_id:"per", party_role:"Ketua Umum",
    positions:[
      {title:"Ketua Umum Partai Perindo", institution:"Partai Perindo", region:"Nasional", start:"2015", end:null, is_current:true},
      {title:"CEO MNC Group", institution:"MNC Group", region:"Nasional", start:"2002", end:null, is_current:true},
    ],
    tier:"nasional", region_id:null,
    bio:"Konglomerat media terbesar Indonesia berdasarkan jangkauan (MNC Group — RCTI, MNCTV, Global TV, iNews, Okezone). Mendirikan Partai Perindo 2015. Pemilik media yang sekaligus ketua partai menciptakan konflik kepentingan antara kebebasan pers dan kepentingan politik.",
    tags:["pengusaha","media","ketum-partai","perindo"],
    lhkpn_latest:null, lhkpn_year:null,
    connections_summary:"Ketum Perindo, CEO MNC Group (RCTI, MNCTV), media mogul",
    twitter:"@hary_tanoe",
    analysis:{
      ideology_score:3, populism_score:6, corruption_risk:"sedang",
      nationalism:5, religiosity:3,
      track_record:"Salah satu orang terkaya Indonesia. Pernah gabung Hanura lalu dirikan Perindo. MNC Group menguasai TV terrestrial dengan jangkauan terbesar di Indonesia. Mendukung koalisi Prabowo (KIM Plus).",
      policy_direction:"Pro-bisnis, media konglomerat"
    }
  },
]

export const PERSONS_MAP = Object.fromEntries(PERSONS.map(p => [p.id, p]))
