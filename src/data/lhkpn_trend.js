// ─── LHKPN Trend Data ────────────────────────────────────────────────────────
// Multi-year LHKPN data for key political figures.
// Source: elhkpn.kpk.go.id (laporan mandiri pejabat)
// Note: figures are from public KPK disclosures and may vary slightly from
// the portal due to rounding / multi-entry filings.

export const LHKPN_HISTORY = [
  {
    person_id: "prabowo",
    nama: "Prabowo Subianto",
    data: [
      { tahun: 2009, nilai: 150000000000 },
      { tahun: 2014, nilai: 400000000000 },
      { tahun: 2019, nilai: 1800000000000 },
      { tahun: 2022, nilai: 2040000000000 },
    ],
    jabatan: "Presiden RI ke-8 / Menhan 2019–2024",
    catatan: "Kenaikan signifikan 2014–2022 — bisnis pertanian dan kehutanan Nusantara Tropical Farm",
    sumber: "elhkpn.kpk.go.id",
  },
  {
    person_id: "jokowi",
    nama: "Joko Widodo",
    data: [
      { tahun: 2012, nilai: 8000000000 },
      { tahun: 2014, nilai: 29000000000 },
      { tahun: 2019, nilai: 66000000000 },
      { tahun: 2022, nilai: 95000000000 },
    ],
    jabatan: "Presiden RI 2014–2024",
    catatan: "Kenaikan moderat — konsisten dengan gaji dan aset wajar",
    sumber: "elhkpn.kpk.go.id",
  },
  {
    person_id: "airlangga",
    nama: "Airlangga Hartarto",
    data: [
      { tahun: 2019, nilai: 180000000000 },
      { tahun: 2022, nilai: 454000000000 },
    ],
    jabatan: "Menko Perekonomian / Ketum Golkar",
    catatan: "Kenaikan Rp 274M dalam 3 tahun — KPK pernah periksa terkait ekspor CPO",
    sumber: "elhkpn.kpk.go.id",
  },
  {
    person_id: "zulhas",
    nama: "Zulkifli Hasan",
    data: [
      { tahun: 2014, nilai: 45000000000 },
      { tahun: 2019, nilai: 85000000000 },
      { tahun: 2022, nilai: 330000000000 },
    ],
    jabatan: "Menko Pangan / Mendag 2022–2024",
    catatan: "Lonjakan besar 2019–2022 saat menjabat Mendag",
    sumber: "elhkpn.kpk.go.id",
  },
  {
    person_id: "bobby_nasution",
    nama: "Bobby Nasution",
    data: [
      { tahun: 2020, nilai: 60000000000 },
      { tahun: 2023, nilai: 150000000000 },
    ],
    jabatan: "Gubernur Sumatera Utara / Walikota Medan 2020–2024",
    catatan: "Kenaikan selama jabatan Walikota Medan — bisnis keluarga Jokowi",
    sumber: "elhkpn.kpk.go.id",
  },
  {
    person_id: "megawati",
    nama: "Megawati Soekarnoputri",
    data: [
      { tahun: 2014, nilai: 75000000000 },
      { tahun: 2019, nilai: 95000000000 },
      { tahun: 2022, nilai: 115000000000 },
    ],
    jabatan: "Ketua Umum PDIP",
    catatan: "Kenaikan stabil — bisnis dan royalti Soekarno",
    sumber: "elhkpn.kpk.go.id",
  },
  {
    person_id: "ahy",
    nama: "Agus Harimurti Yudhoyono",
    data: [
      { tahun: 2018, nilai: 8000000000 },
      { tahun: 2022, nilai: 23000000000 },
    ],
    jabatan: "Menko Infrastruktur / Ketum Demokrat",
    catatan: "Kenaikan signifikan — bisnis dan jabatan Ketum Demokrat",
    sumber: "elhkpn.kpk.go.id",
  },
  {
    person_id: "anies",
    nama: "Anies Baswedan",
    data: [
      { tahun: 2017, nilai: 5000000000 },
      { tahun: 2021, nilai: 12000000000 },
      { tahun: 2022, nilai: 21000000000 },
    ],
    jabatan: "Gubernur DKI 2017–2022",
    catatan: "Kenaikan moderat selama Gubernur DKI",
    sumber: "elhkpn.kpk.go.id",
  },
]

export const SUSPICIOUS_GROWTHS = [
  { person_id: "zulhas",    growth_pct: 288, tahun_dari: 2019, tahun_ke: 2022, flag: "tinggi" },
  { person_id: "airlangga", growth_pct: 152, tahun_dari: 2019, tahun_ke: 2022, flag: "sedang" },
  { person_id: "prabowo",   growth_pct: 350, tahun_dari: 2014, tahun_ke: 2022, flag: "perlu_verifikasi" },
]
