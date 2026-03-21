// research/persons_research.js
// Key Person Deep Research — Indonesian Politics
// Sources: Wikipedia

export const persons = [
  {
    id: "gibran-rakabuming-raka",
    name: "Gibran Rakabuming Raka",
    dob: "1987-10-01",
    pob: "Surakarta, Indonesia",
    party: "Independent (formerly PDI-P, kicked out Dec 2024)",
    currentRole: "Vice President of Indonesia (since October 20, 2024)",
    background: "pengusaha/politisi",
    education: [
      "Singapore Management University (Business Management)",
      "Technological and Higher Education Institute of Hong Kong (Food Studies)"
    ],
    career: [
      "Founded Chilli Pari catering/event company in Surakarta",
      "Mayor of Surakarta, Central Java (2021-2024)",
      "Vice President of Indonesia (2024-present)"
    ],
    family: {
      father: "Joko Widodo (7th President of Indonesia)",
      mother: "Iriana",
      wife: "Selvi Ananda",
      children: "Sedah Mirah Widodo",
      sibling: "Kahiyang Ayu (married Bobby Nasution, Mayor of Medan), Kaesang Pangarep (PSI politician)"
    },
    controversies: [
      "Constitutional Court age manipulation: MK (Mahkamah Konstitusi) ruled in October 2023 to allow VP candidates under 40 if they have served as regional heads — specifically enabling Gibran (age 36) to run. The ruling was made by Chief Justice Anwar Usman, Gibran's own uncle (married to Jokowi's sister Idayati). Anwar Usman was later reprimanded by the MKMK (MK Ethics Council) and removed as chief justice for ethics violations.",
      "PDI-P split: Jokowi's support for Prabowo-Gibran ticket (against PDI-P's Ganjar Pranowo) led to expulsion of Jokowi, Gibran, and Bobby Nasution from PDI-P in December 2024",
      "Kaesang PSI controversy: Kaesang Pangarep (Gibran's brother) became PSI chairman and received private jet use — allegedly linked to state resources",
      "Critics point to dynastic politics as threat to Indonesian democracy"
    ],
    politicalDynasty: "Son of Jokowi, Mayor of Solo. Father-son presidential dynasty in first term — unprecedented in Indonesian democratic history."
  },

  {
    id: "anies-baswedan",
    name: "Anies Rasyid Baswedan",
    dob: "1969-05-07",
    pob: "Kuningan, West Java",
    party: "Independent (supported by PKS, Nasdem initially, PKB for 2024 election)",
    currentRole: "Former Governor of DKI Jakarta (2017-2022); 2024 presidential candidate",
    background: "akademisi/politisi",
    education: [
      "Gadjah Mada University (Economics, BA)",
      "University of Maryland, College Park (MSc Public Policy)",
      "Northern Illinois University (PhD Political Science)"
    ],
    career: [
      "Academic — taught at University of Indonesia",
      "Founder of Indonesia Mengajar (Teaching Indonesia) program",
      "Rector of Paramadina University",
      "Minister of Education and Culture under Jokowi (2014-2016) — fired after 2 years",
      "Governor of Jakarta (2017-2022)",
      "2024 Presidential Candidate (paired with Muhaimin Iskandar as VP) — ranked 3rd with ~24.95% votes"
    ],
    family: {
      father: "Rasyid Baswedan (prominent figure)",
      grandfather: "Abdurrahman Baswedan (nationalist, Indonesian independence figure)",
      wife: "Fery Farhati",
      children: "4"
    },
    controversies: [
      "2017 Jakarta election: Won against Ahok (Basuki Tjahaja Purnama) amid controversial blasphemy case against Ahok; Anies benefited from MUI fatwa and 212 movement. Critics said he exploited religious politics",
      "Jakarta governance: Critics accused him of populist but ineffective governance — 'Naik Pitam' policies, controversial Formula E Jakarta, unfinished sea wall reclamation reversal",
      "Formula E: Jakarta hosted Formula E race 2022 — Rp 560 billion cost; criticized as waste",
      "2024 election campaign: Supported by Nasdem, PKS, PKB (later PKB switched to support Prabowo after election). Lost to Prabowo",
      "Fired by Jokowi from Education Ministry in 2016 — officially for 'reorganization'; widely seen as political removal after Anies criticized Jokowi's education policies"
    ],
    significance: "Major opposition figure. 2024 presidential candidate. Strong support from urban educated middle class, Islamic conservative voters, anti-Jokowi voters."
  },

  {
    id: "megawati-sukarnoputri",
    name: "Diah Permata Megawati Setiawati Sukarnoputri",
    nickname: "Mega",
    dob: "1947-01-23",
    pob: "Djokjakarta (Yogyakarta), Indonesia",
    age: 79,
    party: "PDI-P (Indonesian Democratic Party of Struggle)",
    currentRole: "General Chairwoman of PDI-P (since 1999); Chairperson of BRIN Steering Committee; Chairperson of BPIP Steering Committee",
    pastRoles: [
      "5th President of Indonesia (July 23, 2001 – October 20, 2004)",
      "8th Vice President of Indonesia (October 21, 1999 – July 23, 2001)",
      "Member of DPR (1987-1999)"
    ],
    background: "politisi",
    education: [
      "Universitas Padjadjaran, Bandung (Agriculture — dropped out 1967)",
      "Universitas Indonesia (Psychology — dropped out 1972)"
    ],
    family: {
      father: "Sukarno (1st President of Indonesia)",
      mother: "Fatmawati",
      firstHusband: "Surindro Supjarso (died in air force accident)",
      secondHusband: "Hassan Gamal Ahmad Hassan (annulled 1972)",
      thirdHusband: "Taufiq Kiemas (died 2013) — MPR Speaker",
      children: ["Puan Maharani (only daughter, Speaker of DPR)", "2 sons"],
      halfSibling: "Rukmini Sukarno (half-sister)"
    },
    controversies: [
      "27 July 1996 incident: Government-backed attack on PDI headquarters she occupied",
      "Presidency (2001-2004): Criticized for economic mismanagement and indecisiveness",
      "2004 presidential defeat to SBY",
      "2009 paired with Prabowo — lost to SBY",
      "Megawati-Jokowi relationship: Megawati backed Jokowi in 2014 and 2019 but reportedly treated him as subordinate. Jokowi's support for Prabowo (and Gibran) in 2024 led to deep PDI-P split.",
      "Autocratic party leadership: Megawati has been PDI-P chairwoman since founding (1999) — over 25 years. No meaningful party democracy for successor selection.",
      "Nepotism criticism: Installed daughter Puan Maharani as DPR Speaker and potential successor"
    ],
    dynasty: "Sukarno dynasty: Megawati (daughter of Sukarno) → Puan Maharani (granddaughter of Sukarno) — two generations in top political positions"
  },

  {
    id: "muhaimin-iskandar",
    name: "Abdul Muhaimin Iskandar",
    nickname: "Cak Imin / Gus Imin",
    dob: "1966-09-24",
    pob: "Jombang, East Java",
    party: "PKB (National Awakening Party)",
    currentRole: "Coordinating Minister for Social Empowerment (since Oct 21, 2024); PKB Chairman (since 2005)",
    background: "politisi",
    education: [
      "Gadjah Mada University, Yogyakarta (Social & Political Science, Drs, 1992)",
      "University of Indonesia (Communications Management, M.Si, 2001)"
    ],
    career: [
      "Member of DPR (1999-2009, 2014-2024)",
      "Deputy Speaker of DPR (1999-2009)",
      "Minister of Manpower and Transmigration under SBY (2009-2014)",
      "Deputy Speaker of MPR (2018-2019)",
      "Deputy Speaker of DPR (2019-2024)",
      "2024 VP candidate (paired with Anies Baswedan) — Lost (24.95% total)",
      "Coordinating Minister for Social Empowerment in Prabowo cabinet (2024-)"
    ],
    family: {
      father: "Muhammad Iskandar (teacher at Mamba'ul Ma'arif pesantren)",
      mother: "Muhasonah Iskandar (later pesantren leader)",
      greatGrandfather: "Bisri Syamsuri (father-in-law of Hasyim Asy'ari, NU founder)",
      relationship_gusDur: "Nephew of Abdurrahman Wahid (Gus Dur, PKB founder and 4th President)",
      wife: "Rustini Murtadho",
      children: 3
    },
    controversies: [
      "PKB internal conflict: Expelled NU-backed figures from PKB; PBNU threatened takeover in 2024",
      "Manpower Ministry (2009-2014): Accused of mishandling labor issues",
      "Political flip-flopping: Ran against Prabowo in 2024 election, then joined Prabowo's coalition post-election as Coordinating Minister",
      "NU-PKB split: Relationship with PBNU under Yahya Staquf severely deteriorated"
    ],
    jatimConnection: "Born in Jombang (NU heartland). PKB's dominant figure in Jatim politics. Uncle of Gus Dur. Deep pesantren network connections."
  },

  {
    id: "puan-maharani",
    name: "Puan Maharani Nakshatra Kusyala Devi",
    dob: "1973-09-06",
    pob: "Jakarta",
    party: "PDI-P",
    currentRole: "Speaker of DPR/House of Representatives (since 2019); Member of DPR (since 2009)",
    background: "politisi",
    education: [
      "University of Indonesia (Mass Communication, BA 1997)"
    ],
    career: [
      "Head of PDI-P Public and Women's Empowerment Wing",
      "Member of DPR (2009-2014, 2019-present)",
      "Coordinating Minister for Human Development and Cultural Affairs under Jokowi (2014-2019)",
      "Speaker of DPR (2019-2024, 2024-present) — first woman to hold position"
    ],
    family: {
      grandfather: "Sukarno (1st President of Indonesia)",
      mother: "Megawati Sukarnoputri (5th President, PDI-P chair)",
      father: "Taufiq Kiemas (MPR Speaker 2009-2013, died 2013)",
      husband: "Hapsoro Sukmonohadi",
      children: 2
    },
    controversies: [
      "Revolusimental.go.id website: As Coordinating Minister, launched Rp 149 billion 'mental revolution' website that crashed 2 days after launch (Aug 2016)",
      "Setya Novanto testimony: In 2018, Novanto testified that Puan received $500,000 bribe from Masagung in e-KTP case. Never charged.",
      "Nepotism: Her political rise is directly attributed to being Megawati's daughter — 'Sukarno dynasty'",
      "PDI-P succession: Expected to succeed Megawati as PDI-P chairwoman, but her 2024 vote count declined"
    ],
    significance: "Potential next PDI-P chairman/chair. Sukarno dynasty third-generation politician. DPR Speaker gives her significant institutional power even with PDI-P in opposition."
  },

  {
    id: "joko-widodo",
    name: "Joko Widodo",
    birthName: "Mulyono",
    nickname: "Jokowi",
    dob: "1961-06-21",
    pob: "Surakarta, Central Java",
    party: "PSI (Indonesian Solidarity Party, since 2025); formerly PDI-P (2004-2024)",
    currentRole: "Former President of Indonesia (2014-2024)",
    background: "pengusaha/politisi",
    education: [
      "Gadjah Mada University (Forestry, Ir. 1985)"
    ],
    career: [
      "Furniture manufacturer/exporter (1980s-2005)",
      "Mayor of Surakarta, Central Java (2005-2012) — re-elected 2010",
      "Governor of Jakarta (2012-2014)",
      "7th President of Indonesia (October 20, 2014 – October 20, 2024)"
    ],
    family: {
      father: "Widjiatno Notomihardjo",
      wife: "Iriana",
      children: [
        "Gibran Rakabuming Raka (current VP of Indonesia)",
        "Kahiyang Ayu (married Bobby Nasution, Mayor of Medan → elected Governor of North Sumatra 2024)",
        "Kaesang Pangarep (PSI politician, party chairman)"
      ]
    },
    legacyAchievements: [
      "Largest infrastructure program in Indonesian history — 5,000km+ of toll roads, new airports, ports, dams",
      "Universal healthcare expansion (JKN)",
      "Nusantara new capital city project (East Kalimantan)",
      "Golden Indonesia 2045 Vision",
      "Steady economic growth ~5% annually"
    ],
    controversies: [
      "Democratic backsliding: Weakened KPK (2019 law revision), press freedom concerns",
      "Political dynasticism: Son as VP, daughter married to governor, son as party chairman",
      "MK age manipulation: Anwar Usman (Jokowi's brother-in-law) was MK Chief Justice who enabled Gibran's VP candidacy",
      "PDI-P betrayal: Supported Prabowo (his former rival) over PDI-P's Ganjar Pranowo in 2024",
      "Nusantara capital: Environmental concerns, legal challenges, cost overruns",
      "Left PDI-P December 2024; joined PSI (his son Kaesang's party) in 2025"
    ],
    connections: {
      toGerindra: "Prabowo was his opponent in 2014, 2019 — became Defense Minister under him 2019-2024; Jokowi effectively endorsed Prabowo-Gibran in 2024",
      toLuhutPandjaitan: "Luhut Binsar Pandjaitan (former general) was Jokowi's most powerful minister and closest advisor; called 'the real PM'",
      toPKB: "PKB supported Jokowi's coalition 2014, 2019",
      toNu: "Chose Ma'ruf Amin (NU senior ulama) as VP in 2019 to secure NU/Islamic vote"
    }
  },

  {
    id: "sri-mulyani-indrawati",
    name: "Sri Mulyani Indrawati",
    dob: "1962-08-26",
    pob: "Tanjung Karang (now Bandar Lampung), Lampung",
    party: "Independent",
    currentRole: "Former Minister of Finance (replaced Sept 8, 2025 by Purbaya Yudhi Sadewa)",
    background: "akademisi/teknokrat",
    education: [
      "University of Indonesia (BA Economics, 1986)",
      "University of Illinois at Urbana-Champaign (MSc Policy Economics, 1990)",
      "University of Illinois at Urbana-Champaign (PhD Economics, 1992)"
    ],
    career: [
      "Lecturer at University of Indonesia and Georgia State University",
      "IMF Executive Director representing 12 Southeast Asian economies (2002-2004)",
      "Minister of National Development Planning under SBY (2004-2005)",
      "Minister of Finance under SBY (2005-2010)",
      "Managing Director World Bank Group (2010-2016)",
      "Minister of Finance under Jokowi (2016-2024)",
      "Minister of Finance under Prabowo (2024-September 2025)"
    ],
    family: {
      husband: "Tonny Sumartono (married 1988)",
      father: "Satmoko (university lecturer)",
      mother: "Retno Sriningsih"
    },
    achievements: [
      "Named Finance Minister of the Year by Euromoney (2006)",
      "Multiple Forbes 100 Most Powerful Women lists",
      "Steered Indonesia through 2008 Global Financial Crisis",
      "First person to serve as Finance Minister under three successive presidents (SBY, Jokowi, Prabowo)",
      "Reduced corruption in tax and customs office"
    ],
    controversies: [
      "Bank Century Bailout (2008): Rp 6.76 trillion bailout of Bank Century; DPR held non-confidence vote on bailout warrant; Sri Mulyani and VP Boediono accused of policy failure/misconduct; Sri Mulyani resigned to take World Bank position",
      "Later tax policy controversies under Jokowi administration",
      "August-September 2025 protests: Home in South Tangerang looted during major Indonesian protests; replaced as Finance Minister Sept 8, 2025"
    ]
  },

  {
    id: "agus-harimurti-yudhoyono",
    name: "Agus Harimurti Yudhoyono",
    nickname: "AHY",
    dob: "1978-08-10",
    pob: "Bandung, West Java",
    party: "Demokrat (Democratic Party)",
    currentRole: "Coordinating Minister for Infrastructure and Regional Development (since Oct 21, 2024); Democratic Party Chairman (since 2020)",
    background: "militer/politisi",
    education: [
      "Taruna Nusantara High School (valedictorian)",
      "Indonesian Military Academy (AKMIL, graduated 2000 — top graduate, Adhi Makayasa award)",
      "Nanyang Technological University, Singapore (MSc Strategic Studies, 2006)",
      "Harvard University (MPA Master of Public Administration, 2010)",
      "Webster University (MA Leadership and Management)",
      "Airlangga University (PhD, Surabaya)"
    ],
    military: {
      service: "Indonesian Army 2000-2016",
      rank: "Major",
      unit: "Infantry, Kostrad",
      operations: ["Aceh counterinsurgency 2002", "UNIFIL Lebanon peacekeeping 2006"]
    },
    career: [
      "Army Major (Kostrad) 2000-2016",
      "Democratic Party chairman candidate, entered politics 2016",
      "2017 Jakarta Governor candidate (lost to Anies Baswedan)",
      "Demokrat Chairman (2020-present)",
      "Minister of Agrarian Affairs and Spatial Planning under Jokowi (Feb 21-Oct 20, 2024)",
      "Coordinating Minister for Infrastructure and Regional Development in Prabowo cabinet (2024-)"
    ],
    family: {
      father: "Susilo Bambang Yudhoyono (SBY) — 6th President of Indonesia",
      mother: "Ani Yudhoyono (née Kristiani Herrawati, died 2019)",
      grandfather: "Sarwo Edhie Wibowo (Lt. Gen., ret.)",
      wife: "Annisa Pohan",
      children: "Almira Tunggadewi Yudhoyono",
      brother: "Edhie Baskoro Yudhoyono (Ibas)"
    },
    controversies: [
      "Demokrat kongres luar biasa 2021: Pro-Moeldoko faction tried to stage coup against AHY's leadership; Jokowi government accused of supporting Moeldoko faction; AHY retained control",
      "Family dynasty: Father SBY and Ibas still influential in party; AHY seen as propped up by SBY's legacy",
      "2024 joining Jokowi cabinet then Prabowo cabinet — critics see this as opportunism"
    ],
    significance: "Represents military aristocracy entering civilian politics. Demokrat key coalition partner in Prabowo government. AHY's appointment as minister seen as Demokrat's buy-in to Prabowo coalition."
  }
];

export default persons;
