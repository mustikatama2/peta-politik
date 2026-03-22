export const MEDIA_COVERAGE = [
  // Coverage data: how much each outlet covers each politician
  {
    outlet: "Tempo",
    slant: "oposisi",  // pro-pemerintah | oposisi | netral
    owner_affiliation: null,
    coverage: [
      { person_id: "prabowo", tone: "kritis", artikel_per_bulan: 45, sentiment_avg: -0.3 },
      { person_id: "anies", tone: "positif", artikel_per_bulan: 38, sentiment_avg: 0.5 },
      { person_id: "jokowi", tone: "campuran", artikel_per_bulan: 30, sentiment_avg: 0.1 },
      { person_id: "hasto_kristiyanto", tone: "investigatif", artikel_per_bulan: 22, sentiment_avg: -0.6 },
    ]
  },
  {
    outlet: "Kompas",
    slant: "netral",
    owner_affiliation: null,
    coverage: [
      { person_id: "prabowo", tone: "netral", artikel_per_bulan: 60, sentiment_avg: 0.1 },
      { person_id: "anies", tone: "netral", artikel_per_bulan: 35, sentiment_avg: 0.2 },
      { person_id: "jokowi", tone: "positif", artikel_per_bulan: 40, sentiment_avg: 0.4 },
    ]
  },
  {
    outlet: "Metro TV",
    slant: "pro-pemerintah",
    owner_affiliation: "surya_paloh",  // person_id of owner
    coverage: [
      { person_id: "prabowo", tone: "positif", artikel_per_bulan: 80, sentiment_avg: 0.6 },
      { person_id: "anies", tone: "campuran", artikel_per_bulan: 20, sentiment_avg: -0.1 },
      { person_id: "jokowi", tone: "sangat positif", artikel_per_bulan: 70, sentiment_avg: 0.7 },
    ]
  },
  {
    outlet: "tvOne",
    slant: "pro-pemerintah",
    owner_affiliation: "aburizal_bakrie",
    coverage: [
      { person_id: "prabowo", tone: "positif", artikel_per_bulan: 75, sentiment_avg: 0.5 },
      { person_id: "anies", tone: "kritis", artikel_per_bulan: 15, sentiment_avg: -0.4 },
    ]
  },
  {
    outlet: "CNN Indonesia",
    slant: "netral",
    owner_affiliation: null,
    coverage: [
      { person_id: "prabowo", tone: "netral", artikel_per_bulan: 55, sentiment_avg: 0.2 },
      { person_id: "anies", tone: "netral", artikel_per_bulan: 40, sentiment_avg: 0.3 },
      { person_id: "hasto_kristiyanto", tone: "kritis", artikel_per_bulan: 18, sentiment_avg: -0.5 },
    ]
  },
  {
    outlet: "Republika",
    slant: "islamis",
    owner_affiliation: null,
    coverage: [
      { person_id: "anies", tone: "positif", artikel_per_bulan: 50, sentiment_avg: 0.6 },
      { person_id: "prabowo", tone: "campuran", artikel_per_bulan: 35, sentiment_avg: 0.2 },
      { person_id: "cakimin", tone: "positif", artikel_per_bulan: 25, sentiment_avg: 0.5 },
    ]
  },
];

export const MEDIA_OWNERSHIP = [
  { outlet: "Metro TV", pemilik: "Surya Paloh", person_id: "surya_paloh", partai: "nas", jaringan: ["Media Indonesia"] },
  { outlet: "tvOne", pemilik: "Aburizal Bakrie", person_id: "aburizal_bakrie", partai: "gol", jaringan: ["ANTV", "Viva.co.id"] },
  { outlet: "MNC TV / RCTI", pemilik: "Hary Tanoesoedibjo", person_id: "hary_tanoe", partai: "hanura", jaringan: ["MNCTV","iNews","Okezone"] },
  { outlet: "Trans TV / Trans7", pemilik: "Chairul Tanjung", person_id: null, partai: null, jaringan: ["Detik.com","CNN Indonesia"] },
  { outlet: "Kompas TV", pemilik: "Keluarga Palgunadi", person_id: null, partai: null, jaringan: ["Kompas.com","Tribun Network"] },
  { outlet: "Tempo", pemilik: "Yayasan Tempo", person_id: null, partai: null, jaringan: ["Tempo.co"] },
];

export const NARRATIVE_FRAMES = [
  {
    topik: "Efisiensi Anggaran Prabowo",
    media_pro: ["Metro TV", "tvOne", "Kompas"],
    media_kritis: ["Tempo", "CNN Indonesia"],
    narasi_pro: "Langkah berani untuk perbaiki fiskal dan prioritaskan program strategis",
    narasi_kritis: "PHK massal, proyek mangkrak, ancaman resesi daerah",
    intensitas: 9,
  },
  {
    topik: "Hasto Kristiyanto & KPK",
    media_pro: ["Metro TV", "tvOne"],  // pro-KPK
    media_kritis: ["Republika", "Suara.com"],  // pro-PDIP
    narasi_pro: "KPK menjalankan fungsi pemberantasan korupsi tanpa pandang bulu",
    narasi_kritis: "Kriminalisasi politik — serangan terhadap oposisi PDIP",
    intensitas: 8,
  },
  {
    topik: "Program Makan Bergizi Gratis",
    media_pro: ["ANTV", "tvOne", "Metro TV"],
    media_kritis: ["Tempo", "Detik.com"],
    narasi_pro: "Revolusi gizi nasional — investasi SDM jangka panjang",
    narasi_kritis: "Implementasi kacau, anggaran bocor, tidak tepat sasaran",
    intensitas: 7,
  },
];

// Independensi scores (editorial independence, 0-10)
export const INDEPENDENSI_SCORES = {
  "Tempo": 8,
  "Kompas": 7,
  "CNN Indonesia": 6,
  "Republika": 5,
  "MNC TV / RCTI": 4,
  "Metro TV": 3,
  "tvOne": 2,
};
