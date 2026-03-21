// research/parties_detail.js
// Indonesian Political Parties Deep Dive
// Sources: Wikipedia - PDI-P, Gerindra, PKB, Golkar

export const parties = [
  {
    id: "PDIP",
    name: "Partai Demokrasi Indonesia Perjuangan",
    nameEn: "Indonesian Democratic Party of Struggle",
    abbreviation: "PDI-P",
    color: "#CC0000",
    founded: "1999-02-15",
    predecessor: "PDI (Indonesian Democratic Party, 1973)",
    chairman: "Megawati Sukarnoputri",
    secretaryGeneral: "Hasto Kristiyanto",
    dprGroupLeader: "Utut Adianto",
    headquarters: "Menteng, Central Jakarta",
    membership2024: 472643,
    ideology: ["Pancasila", "Indonesian nationalism", "Sukarnoism", "Marhaenism", "Social democracy", "Populism", "Secularism", "Economic nationalism"],
    politicalPosition: "Centre to centre-left",
    internationalAffiliation: ["Progressive Alliance", "Council of Asian Liberals and Democrats", "Network of Social Democracy in Asia"],
    ballotNumber2024: 3,

    electoralHistory: [
      { year: 1999, votes: 35689073, pct: 33.74, seats: 154, outcome: "Largest party; Megawati became VP, later President" },
      { year: 2004, votes: 21026629, pct: 18.53, seats: 109, outcome: "Lost presidency to SBY" },
      { year: 2009, votes: 14600091, pct: 14.03, seats: 95, outcome: "Opposition under SBY" },
      { year: 2014, votes: 23681471, pct: 18.95, seats: 109, outcome: "Jokowi elected president, PDI-P leading coalition" },
      { year: 2019, votes: 27503961, pct: 19.33, seats: 128, outcome: "Jokowi re-elected; largest party" },
      { year: 2024, votes: null, pct: null, seats: 110, outcome: "Largest party but Ganjar Pranowo lost presidential to Prabowo; opposition after Dec 2024" }
    ],

    keyHistory: [
      "Founded after Megawati was ousted from PDI chairmanship by Suharto's backing (1996 Medan congress)",
      "27 July 1996 incident: Megawati supporters attacked at PDI headquarters by government-backed Suryadi faction",
      "After Suharto's fall, PDI-P won 1999 elections with 33%",
      "Megawati became VP under Gus Dur, then President 2001-2004 after Gus Dur's impeachment",
      "Lost to SBY in 2004 and 2009 elections",
      "Nominated Jokowi for president 2014 — outsider candidate who transformed Indonesian politics",
      "2024: Jokowi perceived to support Prabowo (running with Jokowi's son Gibran); Jokowi, Gibran, and Bobby Nasution (son-in-law, Mayor Medan) kicked out of PDI-P in December 2024"
    ],

    internalConflicts: [
      "Megawati's autocratic leadership style — no party congress to replace her; she has led PDI-P since founding",
      "2024 split: Jokowi faction vs Mega faction; Jokowi expelled after perceived betrayal",
      "Hasto Kristiyanto (Sekjen) named KPK suspect in 2025 in DPT vote manipulation case",
      "Tension between Megawati and Puan Maharani (succession)",
      "2009: Megawati chose Prabowo as VP pair, which surprised many"
    ],

    coalitionHistory: [
      { year: 1999, coalition: "Closely aligned with Gus Dur's PKB" },
      { year: 2004, coalition: "National Coalition (lost to SBY/JK)" },
      { year: 2009, coalition: "Mega-Prabowo coalition (lost)" },
      { year: 2014, coalition: "Koalisi Indonesia Hebat (won — Jokowi/JK)" },
      { year: 2019, coalition: "Onward Indonesia Coalition (won — Jokowi/Ma'ruf)" },
      { year: 2024, coalition: "Alliance of Parties Supporting Ganjar Pranowo (lost); PDI-P now in opposition" }
    ],

    jatimPresence: "21 seats in East Java DPRD (2024). PDI-P candidate Risma got 32.52% in 2024 Pilgub Jatim. Historically strong in Surabaya city (Risma was mayor 2010-2020)."
  },

  {
    id: "Gerindra",
    name: "Partai Gerakan Indonesia Raya",
    nameEn: "Great Indonesia Movement Party",
    abbreviation: "Gerindra",
    color: "#CC0000",
    founded: "2008-02-06",
    chairman: "Prabowo Subianto",
    secretaryGeneral: "Ahmad Muzani",
    headquarters: "Jakarta",
    ideology: ["Pancasila", "Indonesian nationalism", "Economic nationalism", "Developmentalism", "National conservatism", "Protectionism"],
    politicalPosition: "Centre to centre-right / right-wing nationalist",
    ballotNumber2024: 6,

    electoralHistory: [
      { year: 2009, votes: 4646406, pct: 4.46, seats: 26, outcome: "First election; Prabowo ran as Megawati's VP candidate" },
      { year: 2014, votes: 14760371, pct: 11.81, seats: 73, outcome: "Prabowo lost presidential race to Jokowi" },
      { year: 2019, votes: 17594839, pct: 12.57, seats: 78, outcome: "Prabowo lost again to Jokowi; joined Jokowi coalition later" },
      { year: 2024, votes: null, pct: null, seats: 86, outcome: "Prabowo won presidency; Gerindra leads governing coalition" }
    ],

    keyHistory: [
      "Founded by Prabowo Subianto in 2008 after failing to get leadership in Golkar and Hanura",
      "Prabowo ran as Megawati's VP in 2009 presidential election",
      "2014 and 2019: Lost narrowly to Jokowi each time; disputed results in both elections",
      "After 2019 loss, Prabowo accepted post as Defense Minister under Jokowi (2019-2024)",
      "2024: Won presidential election with Gibran Rakabuming Raka (Jokowi's son) as VP",
      "Gerindra is now the party of the president; coordinates the 'Advanced Indonesia Coalition' (KIM Plus)"
    ],

    keyFigures: [
      { name: "Prabowo Subianto", role: "Founder & Chairman, President of Indonesia since Oct 2024", born: 1951 },
      { name: "Sandiaga Uno", role: "Former VP candidate 2019, later Tourism Minister; left for PPP", born: 1969 },
      { name: "Ahmad Muzani", role: "Secretary General, MPR Speaker", born: 1966 },
      { name: "Titiek Sukarno", role: "Former spouse of Prabowo, Sukarno's daughter" }
    ],

    humanRightsBackground: "Prabowo served in Kopassus special forces. Investigated for human rights abuses: 1998 student activist kidnappings (13 still missing), 1998 Jakarta riots, 1997 East Timor (Liquica massacre). Discharged from military in 1998 by SBY-era military honor council. Never charged criminally.",

    internalConflicts: "Relatively cohesive under Prabowo's strong personal leadership. Key tension: post-presidency party management.",

    jatimPresence: "21 seats in East Java DPRD. Strong in military-heavy areas and nationalist communities."
  },

  {
    id: "PKB",
    name: "Partai Kebangkitan Bangsa",
    nameEn: "National Awakening Party",
    abbreviation: "PKB",
    color: "#006600",
    founded: "1998-07-09",
    foundedBy: "Abdurrahman Wahid (Gus Dur)",
    chairman: "Muhaimin Iskandar (Cak Imin)",
    secretaryGeneral: "Hasanuddin Wahid",
    dprGroupLeader: "Jazilul Fawaid",
    headquarters: "Jakarta",
    membership2022: 388638,
    ideology: ["Pancasila", "Islamic democracy", "Pluralism", "Liberalism", "Indonesian nationalism", "Centrism"],
    politicalPosition: "Centre",
    internationalAffiliation: ["Centrist Democrat International", "Council of Asian Liberals and Democrats"],
    ballotNumber2024: 1,

    electoralHistory: [
      { year: 1999, votes: 13336982, pct: 12.61, seats: 51, outcome: "Strong debut; Gus Dur elected President" },
      { year: 2004, votes: 11989564, pct: 10.57, seats: 52, outcome: "Decline; backed SBY" },
      { year: 2009, votes: 5146302, pct: 4.94, seats: 28, outcome: "Major decline; Muhaimin era controversies" },
      { year: 2014, votes: 11298957, pct: 9.04, seats: 47, outcome: "Recovery; supported Jokowi" },
      { year: 2019, votes: 13570097, pct: 9.69, seats: 58, outcome: "Growth; supported Jokowi/Ma'ruf" },
      { year: 2024, votes: 16115358, pct: 10.62, seats: 68, outcome: "Best result under Muhaimin era; Muhaimin ran as Anies's VP but lost; PKB joined Prabowo coalition post-election" }
    ],

    keyHistory: [
      "Founded as political vehicle for NU (Nahdlatul Ulama) constituency after Suharto's fall",
      "72 original founders signed party platform, representing age of NU organization",
      "Gus Dur (Abdurrahman Wahid) elected Indonesia's 4th President through MPR vote 1999",
      "Gus Dur impeached 2001 due to alleged incompetence and impropriety",
      "Muhaimin Iskandar took party leadership 2005 — gradually distanced from NU establishment",
      "2023: PKB initially in 'Coalition of Change' (Anies/Muhaimin), but later Muhaimin became Anies's VP choice",
      "Post-2024 election: PKB shifted to support Prabowo's governing coalition; Muhaimin became Coordinating Minister",
      "2024: PBNU (NU executive board) announced plans to take over PKB leadership due to drift from NU values"
    ],

    nuPkbRelationship: {
      tension: "Critical: PBNU under Yahya Staquf moved against PKB under Muhaimin in 2024",
      reason: "PKB prioritizing Muhaimin's political interests over NU's organizational interests",
      takeoverThreat: "July 2024: PBNU announced intent to establish control over PKB or form new party"
    },

    jatimDominance: {
      note: "PKB is strongest in East Java — NU heartland. East Java DPRD 2024: 27/120 seats, making PKB the single largest party",
      pilgub2024: "PKB had 2 candidates: Khofifah (won 58.81%) and Luluk (8.67%) — split PKB support, but Khofifah ran under KIM Plus coalition",
      stronghold: "Jombang, Probolinggo, Pasuruan, Bondowoso, Bangkalan, Sampang, Pamekasan, Sumenep (Madura island especially strong for PKB)"
    }
  },

  {
    id: "Golkar",
    name: "Partai Golongan Karya",
    nameEn: "Party of Functional Groups",
    abbreviation: "Golkar",
    color: "#FFD700",
    founded: "1964-10-20",
    founder: "Suharto (as political vehicle for New Order)",
    chairman: "Bahlil Lahadalia (since 2024)",
    secretaryGeneral: "Muhammad Sarmuji",
    headquarters: "Jakarta",
    membership2024: 832842,
    ideology: ["Pancasila", "Conservatism", "National conservatism", "Developmentalism", "Economic liberalism", "Secularism", "Indonesian nationalism"],
    politicalPosition: "Centre to centre-right",
    ballotNumber2024: 4,

    electoralHistory: [
      { year: 1971, votes: null, pct: 62.8, seats: 236, outcome: "Dominant New Order party" },
      { year: 1977, votes: null, pct: 62.1, seats: 232, outcome: "New Order dominance" },
      { year: 1982, votes: null, pct: 64.2, seats: 242, outcome: "" },
      { year: 1987, votes: null, pct: 73.2, seats: 299, outcome: "" },
      { year: 1992, votes: null, pct: 68.1, seats: 282, outcome: "" },
      { year: 1997, votes: null, pct: 74.5, seats: 325, outcome: "Last Suharto election" },
      { year: 1999, votes: 23741749, pct: 22.44, seats: 120, outcome: "Post-Suharto decline but still 2nd largest" },
      { year: 2004, votes: 24480757, pct: 21.58, seats: 128, outcome: "Largest party; Jusuf Kalla elected VP" },
      { year: 2009, votes: 15037757, pct: 14.45, seats: 107, outcome: "2nd largest; Jusuf Kalla ran for president but lost to SBY" },
      { year: 2014, votes: 18432312, pct: 14.75, seats: 91, outcome: "Supported Prabowo initially, switched to Jokowi 2016" },
      { year: 2019, votes: 17229789, pct: 12.31, seats: 85, outcome: "Supported Jokowi" },
      { year: 2024, votes: null, pct: null, seats: 102, outcome: "2nd largest; supports Prabowo coalition (KIM Plus)" }
    ],

    keyHistory: [
      "Founded 1964 as Joint Secretariat of Functional Groups (Sekber Golkar) — not yet a party",
      "Suharto used Golkar as New Order political machine from 1968 onward",
      "Dominated Indonesian politics 1971-1998 as ruling party",
      "After Suharto's fall 1998, reconstituted as genuine political party",
      "JK (Jusuf Kalla) elected VP under SBY 2004, 2009 JK ran for president but lost",
      "Setya Novanto era: multiple corruption scandals; e-KTP (national ID card) scandal",
      "2014-2016: Joined opposition (Red-White Coalition) against Jokowi, then switched to support Jokowi",
      "2024: Airlangga Hartarto era ended; Bahlil Lahadalia (Papua entrepreneur, energy minister) elected chairman",
      "Golkar has been in government for 53 consecutive years in some form"
    ],

    keyFigures: [
      { name: "Suharto", role: "Original patron (1968-1998)", born: 1921 },
      { name: "Akbar Tandjung", role: "Post-Suharto reform era chairman" },
      { name: "Jusuf Kalla (JK)", role: "Former VP of Indonesia twice", born: 1942 },
      { name: "Aburizal Bakrie", role: "Chairman 2009-2016; Lapindo mudflow scandal" },
      { name: "Setya Novanto", role: "Chairman 2016-2017; jailed for e-KTP corruption (Rp 2.3 trillion)", born: 1955 },
      { name: "Airlangga Hartarto", role: "Chairman 2017-2024; Coordinating Minister for Economy", born: 1963 },
      { name: "Bahlil Lahadalia", role: "Current chairman; Energy Minister", born: 1977 }
    ],

    majorCorruptionCases: [
      "Setya Novanto: e-KTP (electronic national ID card) scandal — Rp 2.3 trillion corruption; convicted 2018, 15 years prison (later reduced)",
      "Aburizal Bakrie: Lapindo Brantas mudflow 2006 — 60,000 people displaced; debated whether natural disaster or negligence; Bakrie family owned Lapindo",
      "Airlangga Hartarto: CPO (crude palm oil) export permit scandal 2023 — investigated but not charged"
    ],

    jatimPresence: "15 seats in East Java DPRD 2024. Historically has strong network in bureaucracy and business community. Supported Khofifah's 2024 Pilgub campaign."
  }
];

export default parties;
