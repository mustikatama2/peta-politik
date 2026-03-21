// research/ormas.js
// Indonesian Mass Organizations (Ormas) & Religious Organizations
// Sources: Wikipedia - Nahdlatul Ulama, Muhammadiyah, Indonesian Ulema Council

export const ormas = [
  {
    id: "NU",
    name: "Nahdlatul Ulama",
    nameEn: "Revival of the Islamic Scholars",
    abbreviation: "NU",
    founded: "1926-01-31",
    foundedBy: "Hasyim Asy'ari",
    headquarters: "Jakarta / Jombang (historical)",
    membershipEstimate: "90-95 million (largest Islamic org in world by some counts)",
    ideology: "Sunni Islam (Shafi'i school), Traditionalist Islam, Aswaja (Ahlus Sunnah wal Jama'ah), Pancasila",
    currentLeader: "Yahya Cholil Staquf (Gus Yahya) — PBNU Chairman since 2022",
    previousLeaders: [
      "Hasyim Asy'ari (founder)",
      "Abdurrahman Wahid (Gus Dur) — later 4th President of Indonesia",
      "Said Aqil Siradj (2010-2021)",
      "Yahya Cholil Staquf (2021-present)"
    ],
    politicalAlignment: {
      historicalParty: "Masyumi (pre-independence), PPP (New Order), PKB (post-1998)",
      currentAlignment: "NU maintains formal independence but members spread across PKB, PKS, PDI-P, Gerindra",
      pkbRelationship: "PKB was founded as NU's political vehicle by Gus Dur (1998). Relationship strained under Muhaimin Iskandar (Cak Imin) who sidelined PBNU. NU threatened PKB takeover in July 2024.",
      jatimSignificance: "East Java is NU's heartland. Jombang is home of founding family (Hasyim Asy'ari, Wahid family). NU's pesantren network dominates rural East Java politics."
    },
    keyFigures: [
      { name: "Yahya Cholil Staquf", role: "PBNU Chairman", note: "Brother of Yaqut Cholil Qoumas (PKB, Menag)" },
      { name: "Muhaimin Iskandar", role: "PKB Chairman (NU-linked)", note: "Nephew of Gus Dur; relationship with PBNU deteriorated" },
      { name: "Khofifah Indar Parawansa", role: "Governor of East Java, former NU Women's Wing (Muslimat NU) chair" },
      { name: "Said Aqil Siradj", role: "Former PBNU Chair", note: "More PDI-P aligned, supported Jokowi" },
      { name: "Ma'ruf Amin", role: "Former MUI Chair, VP of Indonesia 2019-2024", note: "NU senior ulama" }
    ],
    assets: {
      pesantren: "Over 20,000 pesantren affiliated",
      universities: "600+ higher education institutions (LP Ma'arif network)",
      hospitals: "Significant health infrastructure",
      womenWing: "Muslimat NU — one of largest women's organizations in world",
      youthWing: "Ansor (GP Ansor) — militant youth wing with Banser (paramilitary arm)"
    },
    keyPositions: {
      pluralism: "Strong supporter of religious pluralism and Indonesian nationalism (NKRI)",
      antiRadicalism: "Actively opposes HTI, Wahabi extremism, and ISIS",
      corruptionStance: "Variable — NU-affiliated politicians have faced KPK cases",
      pancasila: "Strong Pancasila defender"
    }
  },

  {
    id: "Muhammadiyah",
    name: "Muhammadiyah",
    nameEn: "Followers of Muhammad",
    fullName: "Persyarikatan Muhammadiyah",
    founded: "1912-11-18",
    foundedBy: "Ahmad Dahlan",
    headquarters: "Yogyakarta and Jakarta",
    membershipEstimate: "60 million (2019)",
    ideology: "Sunni Islam (modernist/reformist), Ijtihad, anti-syncretism, Pancasila",
    currentChairman: "Haedar Nashir",
    currentSecretaryGeneral: "Abdul Mu'ti (now Minister of Education in Prabowo cabinet)",
    politicalAlignment: {
      formalParty: "None (Muhammadiyah does not formally affiliate with any party)",
      linkedParty: "PAN (National Mandate Party) — founded by Amien Rais (former Muhammadiyah chairman) in 1998, though PAN has no official relationship",
      memberSpread: "Members across PAN, PKS, PDI-P, Golkar",
      stance: "Formally apolitical but members encouraged to participate in politics"
    },
    keyFigures: [
      { name: "Ahmad Dahlan", role: "Founder (1912)" },
      { name: "Amien Rais", role: "Former Chairman, PAN founder", note: "Prominent reform-era politician" },
      { name: "Haedar Nashir", role: "Current Chairman" },
      { name: "Abdul Mu'ti", role: "Secretary-General → Minister of Education (Prabowo cabinet)" }
    ],
    assets: {
      universities: "172+ universities (2nd largest private university system in Indonesia)",
      hospitals: "457+ hospitals and clinics",
      schools: "Over 5,000 schools from elementary to high school level",
      characteristics: "Urban, middle-class, educated membership base"
    },
    keyPositions: {
      education: "Major educational institution operator",
      modernism: "Opposes syncretic practices, supports modern education",
      pluralism: "Supports religious tolerance but more conservative than NU on some issues",
      politics: "Formally neutral; some figures took anti-Jokowi stance in later years"
    },
    differenceFromNU: "Muhammadiyah = modernist/urban; NU = traditionalist/rural. NU uses mazhab system, Muhammadiyah encourages direct ijtihad. Historically competitive but both support Pancasila."
  },

  {
    id: "MUI",
    name: "Majelis Ulama Indonesia",
    nameEn: "Indonesian Ulema Council",
    abbreviation: "MUI",
    founded: "1975-07-26",
    foundedContext: "Founded by Suharto's New Order government to channel political Islam and legitimize state policies",
    headquarters: "Menteng, Central Jakarta",
    currentChairman: "Anwar Iskandar (since 2023)",
    members: "Umbrella body of NU, Muhammadiyah, LDII, Syarikat Islam, Perti, Al Washliyah, and other Muslim groups. Ahmadiyah and Shi'a NOT included.",
    pastChairmen: [
      { name: "Hamka (Abdul Malik Karim Abdullah)", years: "1975-1981" },
      { name: "Syukri Ghozali", years: "1981-1984" },
      { name: "Hasan Basri", years: "1984-1990" },
      { name: "Ali Yafie", years: "1990-2000" },
      { name: "Sahal Mahfudh", years: "2000-2014" },
      { name: "Din Syamsuddin", years: "2014-2015" },
      { name: "Ma'ruf Amin", years: "2015-2020", note: "Later VP of Indonesia 2019-2024" },
      { name: "Miftachul Achyar", years: "2020-2023" },
      { name: "Anwar Iskandar", years: "2023-present" }
    ],
    keyFunctions: [
      "Issuing Islamic fatwas (religious rulings)",
      "Halal certification for food, cosmetics, pharmaceuticals",
      "Government advisory on Islamic affairs",
      "Interface between government and Islamic community"
    ],
    notableFatwas: [
      "2005: Ahmadiyah declared deviant (lobbied for ban)",
      "Prohibition on forest burning",
      "Various fatwas on banking, lifestyle, political participation"
    ],
    politicalRole: {
      newOrder: "Tool of Suharto to legitimize policies and counter PKI",
      postReformasi: "More independent, sometimes challenging government",
      elections: "MUI fatwas have influenced voting behavior, especially in areas where ulama have authority",
      controversy: "Ma'ruf Amin used MUI platform to issue fatwas against Ahok (Basuki Tjahaja Purnama) in 2016 blasphemy case, which directly aided Anies Baswedan's victory and later Anies's 2024 presidential bid"
    }
  }
];

export default ormas;
