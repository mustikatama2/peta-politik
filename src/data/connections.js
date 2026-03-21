// type: "keluarga" | "koalisi" | "bisnis" | "konflik" | "mentor-murid" | "rekan" | "mantan-koalisi"
export const CONNECTIONS = [
  // ── Koalisi Prabowo (KIM Plus) ──────────────────────────────────────────
  { from:"prabowo",   to:"gibran",        type:"koalisi",        label:"Paslon Pilpres 2024",                    strength:10 },
  { from:"prabowo",   to:"airlangga",     type:"koalisi",        label:"Koalisi Indonesia Maju 2024",            strength:8  },
  { from:"prabowo",   to:"ahy",           type:"koalisi",        label:"Koalisi Indonesia Maju 2024",            strength:8  },
  { from:"prabowo",   to:"zulhas",        type:"koalisi",        label:"Koalisi Indonesia Maju 2024",            strength:7  },
  { from:"prabowo",   to:"bahlil",        type:"koalisi",        label:"Koalisi Indonesia Maju 2024",            strength:8  },
  { from:"prabowo",   to:"yusril",        type:"koalisi",        label:"PBB dukung Prabowo, Menko Hukum",        strength:8  },
  { from:"sufmi_dasco",to:"prabowo",      type:"koalisi",        label:"Sekjen Gerindra, loyalis Prabowo",       strength:9  },
  { from:"ahmad_muzani",to:"prabowo",     type:"koalisi",        label:"Ketua MPR, Sekjen lama Gerindra",        strength:9  },

  // ── Koalisi Perubahan (Anies-Imin) ──────────────────────────────────────
  { from:"anies",     to:"cakimin",       type:"koalisi",        label:"Paslon Pilpres 2024",                    strength:10 },
  { from:"anies",     to:"surya_paloh",   type:"koalisi",        label:"NasDem usung Anies 2024",                strength:8  },
  { from:"anies",     to:"ahmad_syaikhu", type:"koalisi",        label:"PKS dukung Anies 2024",                  strength:7  },
  { from:"anies",     to:"tom_lembong",   type:"rekan",          label:"Rekan politik; Lembong pendukung Anies", strength:8  },

  // ── PDI-P / Ganjar camp ──────────────────────────────────────────────────
  { from:"megawati",  to:"ganjar",        type:"koalisi",        label:"PDIP usung Ganjar 2024",                 strength:9  },
  { from:"megawati",  to:"puan",          type:"keluarga",       label:"Ibu-Anak",                               strength:10 },
  { from:"megawati",  to:"hasto",         type:"mentor-murid",   label:"Patron-loyalis; Hasto tangan kanan Megawati", strength:9 },
  { from:"megawati",  to:"jokowi",        type:"konflik",        label:"PDIP vs Jokowi — split 2023",            strength:2  },
  { from:"puan",      to:"megawati",      type:"keluarga",       label:"Anak-Ibu",                               strength:10 },
  { from:"puan",      to:"jokowi",        type:"mantan-koalisi", label:"PDIP dulu dukung Jokowi, kini oposisi",  strength:4  },

  // ── Keluarga Jokowi Dynasty ───────────────────────────────────────────────
  { from:"jokowi",    to:"gibran",        type:"keluarga",       label:"Bapak-Anak",                             strength:10 },
  { from:"jokowi",    to:"kaesang",       type:"keluarga",       label:"Bapak-Anak",                             strength:10 },
  { from:"jokowi",    to:"prabowo",       type:"mantan-koalisi", label:"Dukung Prabowo Pilpres 2024",            strength:7  },
  { from:"jokowi",    to:"anwar_usman",   type:"keluarga",       label:"Ipar — Anwar menikahi adik Jokowi, Idayati", strength:9 },
  { from:"jokowi",    to:"pramono_anung", type:"rekan",          label:"Loyalis Jokowi; Seskab 2014-2024",       strength:8  },
  { from:"gibran",    to:"jokowi",        type:"keluarga",       label:"Anak-Bapak",                             strength:10 },
  { from:"kaesang",   to:"gibran",        type:"keluarga",       label:"Kakak-Adik",                             strength:9  },

  // ── Keluarga Prabowo-Djojohadikusumo ─────────────────────────────────────
  { from:"prabowo",   to:"hashim",        type:"keluarga",       label:"Kakak-Adik Kandung (Djojohadikusumo)",   strength:10 },
  { from:"hashim",    to:"prabowo",       type:"bisnis",         label:"Arsari Group — funder Gerindra",         strength:9  },

  // ── Keluarga SBY-Yudhoyono ───────────────────────────────────────────────
  { from:"ahy",       to:"sby",           type:"keluarga",       label:"Anak-Bapak (SBY, Presiden RI ke-6)",     strength:10 },

  // ── Tokoh NU ─────────────────────────────────────────────────────────────
  { from:"khofifah",  to:"gus_yahya",     type:"rekan",          label:"Tokoh NU, basis massa sama",             strength:7  },
  { from:"khofifah",  to:"cakimin",       type:"konflik",        label:"Persaingan PKB vs independen NU Jatim",  strength:4  },
  { from:"khofifah",  to:"mahfud_md",     type:"rekan",          label:"Tokoh NU Jatim, berbeda arah politik 2024", strength:5 },
  { from:"khofifah",  to:"emil_dardak",   type:"rekan",          label:"Pasangan Gubernur-Wagub Jatim",          strength:9  },
  { from:"cakimin",   to:"gus_yahya",     type:"rekan",          label:"Keluarga besar NU; PBNU ≠ PKB otomatis", strength:6  },
  { from:"mundjidah", to:"gus_yahya",     type:"mentor-murid",   label:"Basis pesantren Jombang",                strength:6  },
  { from:"gus_yahya", to:"haedar_nashir", type:"rekan",          label:"Dua ormas Islam terbesar RI",            strength:5  },
  { from:"mahfud_md", to:"cakimin",       type:"konflik",        label:"Rival NU Jatim; beda arah 2024",         strength:4  },

  // ── Jawa Timur ───────────────────────────────────────────────────────────
  { from:"gus_muhdlor",to:"cakimin",      type:"rekan",          label:"Kader PKB Sidoarjo",                     strength:7  },
  { from:"ipuk",      to:"azwar_anas",    type:"keluarga",       label:"Istri-Suami; dynasty transfer Banyuwangi", strength:10 },
  { from:"hanindhito",to:"pramono_anung", type:"keluarga",       label:"Anak-Bapak; Bupati Kediri-Gubernur DKI", strength:10 },
  { from:"pramono_anung",to:"megawati",   type:"rekan",          label:"Kader senior PDIP",                      strength:7  },
  { from:"fandi_yani", to:"cakimin",      type:"rekan",          label:"Cucu Jend Yani, kader PKB Gresik",       strength:6  },

  // ── Keamanan ─────────────────────────────────────────────────────────────
  { from:"listyo_sigit",to:"jokowi",      type:"rekan",          label:"Kapolri pilihan Jokowi (2021)",          strength:7  },
  { from:"budi_gunawan",to:"jokowi",      type:"rekan",          label:"Kepala BIN era Jokowi, dilanjut Prabowo",strength:7  },
  { from:"agus_subiyanto",to:"prabowo",   type:"rekan",          label:"Panglima TNI di bawah Presiden Prabowo", strength:8  },

  // ── Keuangan & Bisnis ─────────────────────────────────────────────────────
  { from:"sri_mulyani",to:"jokowi",       type:"rekan",          label:"Menkeu 3x di kabinet Jokowi",            strength:8  },
  { from:"sri_mulyani",to:"prabowo",      type:"rekan",          label:"Dilanjutkan Prabowo sebagai Menkeu",     strength:7  },
  { from:"bahlil",     to:"jokowi",       type:"rekan",          label:"Dekat Jokowi era BKPM/ESDM",             strength:7  },
  { from:"said_iqbal", to:"anies",        type:"rekan",          label:"Buruh sempat dukung Anies Capres",       strength:4  },

  // ── Kasus Hukum ──────────────────────────────────────────────────────────
  { from:"hasto",      to:"anwar_usman",  type:"rekan",          label:"Keduanya tersangkut kasus institusional besar 2024-2025", strength:2 },

  // ── KPK/Korupsi — Relasi Politik ─────────────────────────────────────────
  { from:"gus_muhdlor", to:"prabowo",    type:"koalisi",  label:"PKB dukung KIM Plus 2024",                            strength:4 },
  { from:"gus_muhdlor", to:"cakimin",    type:"koalisi",  label:"PKB Sidoarjo — Muhdlor kader PKB",                    strength:7 },
  { from:"hasto",       to:"puan",       type:"rekan",    label:"Hasto loyalis PDIP; koordinasi dengan Puan",           strength:8 },
  { from:"hasto",       to:"anies",      type:"konflik",  label:"Kasus Harun Masiku — Anies basis oposisi",             strength:3 },
  { from:"tom_lembong", to:"anies",      type:"rekan",    label:"Tim Pemenangan Anies 2024 — Lembong co-captain",       strength:9 },
  { from:"tom_lembong", to:"jokowi",     type:"konflik",  label:"Ditangkap era Prabowo — diduga kriminalisasi oposan Jokowi lama", strength:5 },
  { from:"anwar_usman", to:"jokowi",     type:"keluarga", label:"Ipar Jokowi; menikahi Idayati adik Jokowi 2022",      strength:10 },
  { from:"anwar_usman", to:"gibran",     type:"keluarga", label:"Paman-Keponakan; putusan MK batas usia menguntungkan Gibran", strength:10 },
  { from:"budi_gunawan", to:"jokowi",    type:"rekan",    label:"Kepala BIN 2019-2024 di era Jokowi",                  strength:8 },
  { from:"budi_gunawan", to:"prabowo",   type:"rekan",    label:"Kepala BIN berlanjut era Prabowo",                    strength:7 },
]

export const CONNECTION_TYPES = {
  "keluarga":       { color:"#F59E0B", label:"Hubungan Keluarga" },
  "koalisi":        { color:"#3B82F6", label:"Koalisi Politik" },
  "bisnis":         { color:"#10B981", label:"Hubungan Bisnis" },
  "konflik":        { color:"#DC2626", label:"Konflik/Berseberangan" },
  "mentor-murid":   { color:"#8B5CF6", label:"Mentor-Murid/Guru-Santri" },
  "rekan":          { color:"#6B7280", label:"Rekan/Kolega" },
  "mantan-koalisi": { color:"#D97706", label:"Mantan Koalisi" },
}
