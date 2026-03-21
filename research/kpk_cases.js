// research/kpk_cases.js
// KPK (Komisi Pemberantasan Korupsi) Notable Cases
// Sources: Wikipedia, public records

export const kpkContext = {
  name: "Komisi Pemberantasan Korupsi",
  nameEn: "Corruption Eradication Commission",
  established: "2002-12-27",
  headquarters: "Jakarta",
  website: "kpk.go.id",
  transparency: {
    cpiScore2023: 34,
    cpiRank2023: "115 out of 180 countries",
    cpiTrend: "Declining — Indonesia scored 40 in 2019, declined to 34 by 2023",
    source: "Transparency International"
  },
  institutionalNotes: "KPK's independence has been undermined since 2019. Controversial revision of KPK Law (Oct 2019) placed KPK under executive supervision and weakened its independence. Many senior KPK investigators departed. Critics say KPK has been tamed under Jokowi era to protect coalition partners."
};

export const kpkCases = [
  {
    id: "muhdlor-ali-sidoarjo",
    suspect: "Ahmad Muhdlor Ali",
    title: "Bupati Sidoarjo (2021-2024)",
    party: "PKB (National Awakening Party)",
    case: "Gratification and corruption",
    year: 2024,
    description: "Ahmad Muhdlor Ali, popularly known as Gus Muhdlor, was named KPK suspect in February 2024. Accused of receiving illegal gratuities from 'cutting' the salaries of Sidoarjo Regency employees. The scheme involved deductions from BPJS (social security) and mandatory contributions from civil servants routed to Muhdlor Ali's accounts. The case was notable as it occurred just before the 2024 general elections.",
    amount: "Billions of rupiah in salary deductions",
    status: "Arrested and detained by KPK; trial in progress as of 2024",
    politicalContext: "Muhdlor Ali is son of KH Ali Maschan Moesa, a prominent NU cleric in Sidoarjo. The case is significant because Sidoarjo is adjacent to Surabaya (East Java's capital) and involves PKB's local stronghold. His father was also connected to the 2005 Sidoarjo mudflow (Lumpur Lapindo) compensation distribution controversies.",
    significance: "HIGH — Active 2024 case; incumbent bupati arrested during election year; demonstrates local-level corruption by PKB-affiliated official",
    sources: ["KPK official press releases", "Tempo.co", "Kompas.com"]
  },

  {
    id: "hasan-aminuddin-probolinggo",
    suspect: "Hasan Aminuddin",
    title: "Former Bupati Probolinggo; former Deputy Governor of East Java (2003-2008)",
    party: "PKB",
    case: "Jual beli jabatan (selling civil service positions)",
    year: 2021,
    description: "Hasan Aminuddin and his wife Puput Tantriana Sari (who succeeded him as Bupati Probolinggo) were arrested by KPK in August 2021 in a massive jual beli jabatan (selling of government positions) case. Civil servants were charged Rp 25-100 million for promotions or position assignments. This is one of the most notable political dynasties caught in a corruption case — husband and wife both serving as bupati.",
    amount: "Hundreds of millions of rupiah",
    status: "Convicted; sentenced to prison",
    politicalContext: "Hasan Aminuddin served as Deputy Governor of East Java 2003-2008. The couple ran Probolinggo kabupaten as a political dynasty. Case exposed the pervasive jual beli jabatan practice in local governments.",
    significance: "HIGH — Notable because it caught both husband (former bupati) and wife (incumbent bupati) simultaneously; also former Deputy Governor of Jatim",
    relatedPersons: ["Puput Tantriana Sari (wife, convicted)"]
  },

  {
    id: "sanusi-malang",
    suspect: "Sanusi",
    title: "Bupati Malang (2015-2021)",
    party: "Gerindra / Independent",
    case: "Bribery related to Malang budget (APBD) allocation",
    year: 2020,
    description: "Sanusi, Bupati Malang, was arrested in connection with manipulation of Malang Kabupaten's regional budget (APBD). The case involved bribery to legislators for approval of budget allocations. KPK arrested him based on Operation Tangkap Tangan (OTT — caught red-handed).",
    amount: "Rp 5 billion+",
    status: "Convicted; sentenced to 6 years prison (2020)",
    significance: "MEDIUM — Notable case of DPRD-executive collusion in regional budget manipulation; common pattern in Indonesian regional governance",
    note: "Not to be confused with Sanusi (DKI Jakarta DPRD member who was caught in reclamation bribery case)"
  },

  {
    id: "setya-novanto-ektp",
    suspect: "Setya Novanto",
    title: "Speaker of DPR; Chairman of Golkar",
    party: "Golkar",
    case: "e-KTP (Electronic National ID Card) corruption",
    year: 2017,
    description: "Massive procurement corruption involving the national electronic ID card (e-KTP) project worth Rp 5.9 trillion. Setya Novanto and dozens of other DPR members received kickbacks. Total state loss estimated at Rp 2.3 trillion. Case implicated virtually the entire DPR leadership and many ministers.",
    amount: "Rp 2.3 trillion total state loss; Novanto received USD 7.3 million",
    status: "Convicted 2018; sentenced to 15 years (later reduced to 12.5 years in appeal)",
    politicalImpact: "Exposed systemic corruption in DPR. Several sitting members implicated. Novanto tried to avoid arrest (hospital escape attempt). Widely covered scandal.",
    significance: "VERY HIGH — Largest single DPR corruption case; implicated dozens of politicians across parties"
  },

  {
    id: "budi-gunawan-kkn-suspect",
    suspect: "Budi Gunawan",
    title: "Chief of BIN (State Intelligence Agency); Former National Police Chief Nominee",
    party: "Independent (close to PDI-P/Megawati era)",
    case: "Alleged bribery/gratuity as Police Chief (2015 KPK nomination)",
    year: 2015,
    description: "KPK named Budi Gunawan as suspect in bribery case related to his role as Head of Career Development of the National Police in January 2015, just before Jokowi was about to nominate him as National Police Chief. Pre-trial (praperadilan) court ruled the KPK nomination was procedurally flawed. Jokowi withdrew the nomination. Case was effectively halted through legal and political maneuvering. Budi Gunawan was later appointed Chief of BIN by Jokowi in September 2016.",
    amount: "Alleged 'red accounts' (rekening gendut) — unexplained wealth",
    status: "Case dropped/suspended via praperadilan ruling; Budi Gunawan never tried",
    politicalContext: "Budi Gunawan was seen as Megawati's ally in the police. The KPK naming of BG was seen by some as politically motivated by Jokowi allies. The subsequent retaliatory 'criminalization' of KPK leaders (KPK vs Polri war) severely weakened both institutions. Now serves as Coordinating Minister for Polhukam in Prabowo cabinet.",
    significance: "VERY HIGH — Watershed moment in KPK vs Polri institutional war; undermined KPK independence",
    currentRole: "Coordinating Minister for Political, Legal, and Security Affairs in Kabinet Merah Putih (2024-)"
  },

  {
    id: "hasto-kristiyanto-pdip",
    suspect: "Hasto Kristiyanto",
    title: "Secretary General of PDI-P",
    party: "PDI-P",
    case: "Alleged obstruction of KPK / electoral manipulation (Harun Masiku case)",
    year: 2024,
    description: "Hasto Kristiyanto named KPK suspect in 2025 related to Harun Masiku case — a PDI-P legislative candidate who bribed KPU members for a DPR seat in 2019. Harun Masiku has been a fugitive since 2020. Hasto allegedly instructed Masiku to destroy evidence and flee. Case intensified after PDI-P became opposition following 2024 elections.",
    amount: "Bribery of KPU members",
    status: "Named suspect by KPK in 2024/2025; Harun Masiku still fugitive",
    politicalContext: "Timing of Hasto's case suspicious to PDI-P supporters — named suspect after PDI-P became opposition. PDI-P alleges political persecution by Prabowo government. However, Harun Masiku case pre-dates the political conflict.",
    significance: "HIGH — PDI-P Sekjen as KPK suspect; political implications for opposition leadership"
  },

  {
    id: "akhmad-muhdlor-ali-context",
    suspect: "Context: Sidoarjo Regency corruption pattern",
    note: "Sidoarjo has been a hotspot for corruption cases — also home of Lumpur Lapindo (Lapindo Brantas mudflow) controversy which displaced 60,000 people. Sanggahan Bupati Sidoarjo: Ahmad Muhdlor Ali is the son of a prominent NU cleric. PKB dominates Sidoarjo DPRD. Cases show intersection of religious/cultural legitimacy and political corruption."
  },

  {
    id: "rohidin-mersyah",
    suspect: "Rohidin Mersyah",
    title: "Governor of Bengkulu",
    party: "Golkar",
    case: "Money politics / salary extortion from subordinates for political campaign funding",
    year: 2024,
    description: "Arrested October 2024 by KPK in OTT. Accused of extorting civil servants' salaries to fund his re-election campaign as Bengkulu governor.",
    status: "Arrested 2024",
    significance: "MEDIUM — Pattern similar to Muhdlor Ali case (salary cutting/extortion)"
  }
];

export const kpkInstitutionalTimeline = [
  { year: 2002, event: "KPK established by Law No. 30/2002" },
  { year: 2003, event: "KPK begins operations" },
  { year: 2009, event: "'Cicak vs Buaya' (KPK vs Polri) — first major institutional conflict; KPK commissioners criminalized" },
  { year: 2015, event: "'Cicak vs Buaya II' — Budi Gunawan case; KPK commissioners arrested; KPK temporarily weakened" },
  { year: 2019, event: "KPK Law revised by DPR/Jokowi govt — KPK placed under executive oversight; KPK employees required to become civil servants; TWK (national insight test) used to fire 57 senior investigators in 2021" },
  { year: 2021, event: "57 senior KPK investigators fired after controversial TWK (Test Wawasan Kebangsaan) — widely seen as purge of independent investigators" },
  { year: 2024, event: "CPI score down to 34; KPK still active but capacity diminished" }
];

export default { kpkContext, kpkCases, kpkInstitutionalTimeline };
