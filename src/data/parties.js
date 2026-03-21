export const PARTIES = [
  { id:"pkb",  no:1,  name:"Partai Kebangkitan Bangsa",       abbr:"PKB",      color:"#00A550", ideology:"Nasionalis-religius, berbasis NU",     ketum:"Muhaimin Iskandar",         founded:1998, seats_2024:68,  votes_2024:10.62, logo_emoji:"🌙" },
  { id:"ger",  no:2,  name:"Partai Gerindra",                  abbr:"Gerindra", color:"#8B0000", ideology:"Nasionalis, populis",                   ketum:"Prabowo Subianto",           founded:2008, seats_2024:86,  votes_2024:13.22, logo_emoji:"🦅" },
  { id:"pdip", no:3,  name:"PDI Perjuangan",                   abbr:"PDIP",     color:"#C8102E", ideology:"Nasionalis, Marhaenisme",               ketum:"Megawati Soekarnoputri",     founded:1999, seats_2024:94,  votes_2024:16.72, logo_emoji:"🐂" },
  { id:"gol",  no:4,  name:"Partai Golkar",                    abbr:"Golkar",   color:"#FFD700", ideology:"Nasionalis, pembangunan",               ketum:"Bahlil Lahadalia",           founded:1964, seats_2024:102, votes_2024:15.28, logo_emoji:"🌾" },
  { id:"nas",  no:5,  name:"Partai NasDem",                    abbr:"NasDem",   color:"#27AAE1", ideology:"Nasionalis, reformis",                  ketum:"Surya Paloh",                founded:2011, seats_2024:69,  votes_2024:9.66,  logo_emoji:"🌊" },
  { id:"bur",  no:6,  name:"Partai Buruh",                     abbr:"Buruh",    color:"#F44336", ideology:"Buruh, sosialis",                       ketum:"Said Iqbal",                 founded:2021, seats_2024:0,   votes_2024:0.51,  logo_emoji:"⚒️" },
  { id:"gel",  no:7,  name:"Partai Gelora Indonesia",           abbr:"Gelora",   color:"#FF9800", ideology:"Nasionalis-Islam, reformis",            ketum:"Anis Matta",                 founded:2019, seats_2024:0,   votes_2024:0.83,  logo_emoji:"🌅" },
  { id:"pks",  no:8,  name:"Partai Keadilan Sejahtera",        abbr:"PKS",      color:"#1B5E20", ideology:"Islam, keadilan sosial",                ketum:"Ahmad Syaikhu",              founded:1998, seats_2024:53,  votes_2024:8.44,  logo_emoji:"🌙" },
  { id:"pkn",  no:9,  name:"Partai Kebangkitan Nusantara",     abbr:"PKN",      color:"#607D8B", ideology:"Nasionalis",                            ketum:"Anas Urbaningrum",           founded:2022, seats_2024:0,   votes_2024:0.29,  logo_emoji:"🏝️" },
  { id:"han",  no:10, name:"Partai Hanura",                    abbr:"Hanura",   color:"#FF5722", ideology:"Nasionalis",                            ketum:"Oesman Sapta Odang",         founded:2006, seats_2024:0,   votes_2024:2.06,  logo_emoji:"🤝" },
  { id:"gar",  no:11, name:"Partai Garuda",                    abbr:"Garuda",   color:"#9C27B0", ideology:"Nasionalis",                            ketum:"Ahmad Ridha Sabana",         founded:2015, seats_2024:0,   votes_2024:0.37,  logo_emoji:"🦅" },
  { id:"pan",  no:12, name:"Partai Amanat Nasional",           abbr:"PAN",      color:"#FF6B35", ideology:"Nasionalis-Islam, Muhammadiyah",        ketum:"Zulkifli Hasan",             founded:1998, seats_2024:48,  votes_2024:7.24,  logo_emoji:"⚖️" },
  { id:"pbb",  no:13, name:"Partai Bulan Bintang",             abbr:"PBB",      color:"#009688", ideology:"Islam",                                 ketum:"Yusril Ihza Mahendra",       founded:1998, seats_2024:0,   votes_2024:0.53,  logo_emoji:"☪️" },
  { id:"dem",  no:14, name:"Partai Demokrat",                  abbr:"Demokrat", color:"#2196F3", ideology:"Nasionalis-religius",                   ketum:"Agus Harimurti Yudhoyono",   founded:2001, seats_2024:44,  votes_2024:7.44,  logo_emoji:"🔵" },
  { id:"psi",  no:15, name:"Partai Solidaritas Indonesia",     abbr:"PSI",      color:"#E91E63", ideology:"Pluralis, progresif",                   ketum:"Kaesang Pangarep",           founded:2014, seats_2024:0,   votes_2024:2.81,  logo_emoji:"💫" },
  { id:"per",  no:16, name:"Partai Perindo",                   abbr:"Perindo",  color:"#00BCD4", ideology:"Nasionalis",                            ketum:"Hary Tanoesoedibjo",         founded:2015, seats_2024:0,   votes_2024:1.33,  logo_emoji:"🌐" },
  { id:"ppp",  no:17, name:"Partai Persatuan Pembangunan",     abbr:"PPP",      color:"#4CAF50", ideology:"Islam",                                 ketum:"Mardiono",                   founded:1973, seats_2024:0,   votes_2024:3.87,  logo_emoji:"🕌" },
  { id:"umm",  no:18, name:"Partai Ummat",                     abbr:"Ummat",    color:"#8BC34A", ideology:"Islam",                                 ketum:"Ridho Rahmadi",              founded:2021, seats_2024:0,   votes_2024:0.42,  logo_emoji:"🌙" },
]

export const PARTY_MAP = Object.fromEntries(PARTIES.map(p => [p.id, p]))

export const KIM_PARTIES = ['ger','gol','dem','pan','pkb','nas','per','han','psi','pbb','pkn','bur','gel','gar','umm']
export const OPPOSITION_PARTIES = ['pdip','pks']
