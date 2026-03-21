// research/jatim_context.js
// Jawa Timur (East Java) Political Context
// Sources: Wikipedia - 2024 East Java gubernatorial election, 2018 election, PKB, NU

export const jatimContext = {
  province: "Jawa Timur (East Java)",
  capital: "Surabaya",
  area_km2: 47799.75,
  population2020: 40665696,
  registeredVoters2024: 31280418,
  kabupatenKota: 38, // 29 kabupaten + 9 kota

  economicStructure: {
    gdpRank: "2nd largest provincial economy in Indonesia (after DKI Jakarta)",
    keyIndustries: [
      "Manufacturing — Surabaya and Sidoarjo industrial zones",
      "Agriculture — sugarcane, tobacco, rice, coffee, cocoa (volcanic soil)",
      "Fisheries — Pasuruan, Probolinggo, Banyuwangi coastal areas",
      "Plantation — Jember (tobacco), Malang (apples, coffee), Banyuwangi (coffee, cacao)",
      "Petrochemicals — Gresik (PT Petrokimia Gresik)",
      "Cement — Tuban (PT Semen Indonesia)",
      "Shipping/Trade — Tanjung Perak port (Surabaya), 2nd busiest in Indonesia",
      "Tourism — Bali gateway, Bromo, Semeru, Kawah Ijen, Madura",
      "Livestock — East Java is major cattle production province"
    ],
    soePresentce: [
      "PT PAL Indonesia (naval shipbuilding) — Surabaya",
      "PT Petrokimia Gresik (fertilizer) — Gresik",
      "PT Semen Indonesia — Gresik/Tuban",
      "PT Pelindo III (port operator) — Surabaya",
      "PT INKA (train manufacturer) — Madiun"
    ]
  },

  pilgubHistory: {
    "2018": {
      winner: "Khofifah Indar Parawansa + Emil Dardak",
      winnerParties: "PKB (Khofifah) + Demokrat (Emil)",
      mainOpponent: "Syaifullah Yusuf (Gus Ipul, PKB) + Puti Guntur Soekarno (PDI-P)",
      result: "Khofifah 53.55% vs Gus Ipul 46.45%",
      turnout: "~73%",
      note: "Khofifah (PKB/NU-Muslimat) beat PKB's official candidate Gus Ipul in an intra-PKB split race. Highlighted that personal NU network stronger than party label."
    },
    "2024": {
      date: "2024-11-27",
      winner: "Khofifah Indar Parawansa + Emil Dardak",
      winnerVotes: 12192165,
      winnerPct: 58.81,
      winnerCoalition: "KIM Plus (Gerindra 21, Golkar 15, Demokrat 11, PAN 5, NasDem 10, PPP 4, PKS 5, PSI 1) — total 72/120 DPRD seats",
      winnerParty: "PKB (Khofifah personally affiliated)",
      candidate2: "Tri Rismaharini (PDI-P) + Zahrul Azhar Asumta",
      candidate2Votes: 6743095,
      candidate2Pct: 32.52,
      candidate2Support: "PDI-P (21 seats)",
      candidate3: "Luluk Nur Hamidah (PKB officially) + Lukmanul Khakim",
      candidate3Votes: 1797332,
      candidate3Pct: 8.67,
      candidate3Support: "PKB official (27 seats)",
      totalVotes: 20732592,
      registeredVoters: 31280418,
      turnout: "70.13%",
      analysis: "Remarkable: PKB officially backed Luluk (9th place), but PKB voters massively went to Khofifah (whose personal NU/Muslimat network and incumbency advantage overwhelmed party machinery). PDI-P isolated with only Risma. KIM Plus domination mirrors national Prabowo coalition.",
      keyDistricts: "Khofifah lost Surabaya but dominated rural kabupaten. Surabaya voted for Risma (former Mayor 2010-2020)."
    }
  },

  whyPKBStronghold: {
    reason1: "NU Heartland: Jombang (NU founding city) is in East Java. Over 30% of Indonesia's NU membership is in East Java. PKB was founded by NU cleric Abdurrahman Wahid as NU's political vehicle.",
    reason2: "Pesantren Network: Thousands of pesantren in East Java (especially in Jombang, Pasuruan, Probolinggo, Bondowoso) with kyai (clerics) who are PKB allies and mobilize votes.",
    reason3: "Rural East Java is NU country: Interior kabupaten (Jombang, Kediri, Blitar, Tulungagung, Trenggalek, Ngawi) are NU strongholds.",
    reason4: "Madura: The 4 Madura island kabupaten (Bangkalan, Sampang, Pamekasan, Sumenep) are the most PKB-voting in Indonesia — PKB wins 70-85% in some Madura districts.",
    reason5: "NU's anti-PKI legacy: NU was deeply anti-Communist (killed hundreds of thousands of PKI members in 1965-66). This created lasting conservative, religious-nationalist identity that aligns with PKB.",
    caveat: "PKB-NU relationship has strained: PBNU (NU executive board) threatened to take over PKB in 2024 due to Muhaimin's drift from NU values. But PKB's grassroots NU network remains strong regardless of leadership conflict."
  },

  nuInfluenceJatim: {
    membership: "~30 million NU members in East Java alone (out of 90-95M national)",
    keyFigures: [
      "Yahya Cholil Staquf (PBNU Chairman, born in Rembang but NU Jatim roots)",
      "Khofifah Indar Parawansa (former Muslimat NU chairwoman, Jatim Governor)",
      "Muhaimin Iskandar (PKB chairman, born Jombang)",
      "Saifullah Yusuf (Gus Ipul, NU Secretary General, Mayor of Pasuruan)",
      "Ansor/Banser: NU youth wing; strong in East Java; often provides informal security/enforcement"
    ],
    kyaiPolitics: "Kyai (pesantren leaders) in East Java play crucial role in directing votes. A kyai's endorsement can swing tens of thousands of votes in their subdistrict. PKB/NU candidates invest heavily in kyai relations.",
    pesantren: "Pesantren Tebuireng (Jombang) — historical home of Hasyim Asy'ari family; Pesantren Langitan (Tuban); Pesantren Lirboyo (Kediri); among hundreds of influential pesantren"
  },

  keyPowerFamilies: [
    {
      family: "Wahid/Hasyim Asy'ari family",
      location: "Jombang",
      significance: "Founding family of NU; Abdurrahman Wahid (Gus Dur) was Indonesia's 4th President, PKB founder",
      currentFigures: ["Yahya Cholil Staquf (PBNU Chairman, brother of PKB-linked Yaqut Cholil Qoumas)"]
    },
    {
      family: "Muhaimin family / Bisri Syamsuri line",
      location: "Jombang / Rembang",
      significance: "Muhaimin Iskandar's great-grandfather was Bisri Syamsuri (ulama, NU co-founder); PKB dominant family",
      currentFigures: ["Muhaimin Iskandar (PKB chairman)"]
    },
    {
      family: "Khofifah family network",
      location: "Surabaya/wider Jatim",
      significance: "Khofifah built personal NU-Muslimat network across Jatim over decades as Muslimat NU chairwoman; this network transcends party affiliation",
      currentFigures: ["Khofifah Indar Parawansa (Jatim Governor 2019-2024, re-elected 2024)"]
    },
    {
      family: "Aminuddin/Probolinggo dynasty",
      location: "Probolinggo",
      significance: "Hasan Aminuddin (former Deputy Governor) and wife Puput (former Bupati) — both KPK convicted. Example of family political dynasty corrupted.",
      status: "CONVICTED 2021"
    },
    {
      family: "Dardak family",
      location: "Trenggalek/East Java",
      significance: "Emil Dardak (Vice Governor) is son of Hermanto Dardak (former Deputy Minister); family has deep Trenggalek regional roots",
      currentFigures: ["Emil Elestianto Dardak (Vice Governor of East Java 2019-2024, 2024-)"]
    }
  ],

  dprdComposition2024: {
    totalSeats: 120,
    parties: [
      { party: "PKB", seats: 27, pct: 22.5 },
      { party: "PDI-P", seats: 21, pct: 17.5 },
      { party: "Gerindra", seats: 21, pct: 17.5 },
      { party: "Golkar", seats: 15, pct: 12.5 },
      { party: "Demokrat", seats: 11, pct: 9.2 },
      { party: "NasDem", seats: 10, pct: 8.3 },
      { party: "PKS", seats: 5, pct: 4.2 },
      { party: "PAN", seats: 5, pct: 4.2 },
      { party: "PPP", seats: 4, pct: 3.3 },
      { party: "PSI", seats: 1, pct: 0.8 }
    ]
  },

  pkbVsPdipDynamic: {
    summary: "PKB and PDI-P are the two main competitors for Jatim's political soul, but with different bases: PKB dominates rural kabupaten (especially Madura, NU heartland). PDI-P dominates urban areas (Surabaya, Malang, Kediri cities).",
    pkbStrength: "Rural, pesantren, NU networks, Madura (almost exclusive PKB territory)",
    pdipStrength: "Surabaya, Malang city, urban educated, secular nationalist voters",
    battlegrounds: "Jember, Lumajang, Pasuruan, Jombang — competitive between PKB and PDI-P",
    trend2024: "PKB dominates provincially (Khofifah landslide); PDI-P isolated after losing Jokowi's umbrella"
  }
};

export default jatimContext;
