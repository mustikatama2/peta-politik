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

  // ── Dinasti Bobby Nasution ──────────────────────────────────────────────
  { from:"bobby_nasution", to:"jokowi",    type:"keluarga",  label:"Menantu-Mertua; Bobby menikahi Kahiyang Ayu putri Jokowi", strength:10 },
  { from:"bobby_nasution", to:"gibran",    type:"keluarga",  label:"Ipar; sesama anak-menantu Jokowi", strength:8 },
  { from:"bobby_nasution", to:"prabowo",   type:"koalisi",   label:"Gerindra; dukung Prabowo, Gubernur Sumut 2024", strength:7 },
  { from:"jokowi",         to:"bobby_nasution", type:"keluarga", label:"Mertua-Menantu; Kahiyang Ayu menikah Bobby", strength:10 },
  { from:"gibran",         to:"bobby_nasution", type:"keluarga", label:"Ipar; keduanya anak-menantu Jokowi", strength:8 },

  // ── Gubernur Gerindra ke Prabowo ─────────────────────────────────────────
  { from:"dedi_mulyadi",   to:"prabowo",   type:"koalisi",   label:"Gerindra Jabar; Gubernur Jabar 2024", strength:8 },
  { from:"ahmad_luthfi",   to:"prabowo",   type:"koalisi",   label:"Gerindra Jateng; eks-Kapolda diusung Prabowo", strength:8 },
  { from:"andra_soni",     to:"prabowo",   type:"koalisi",   label:"Gerindra Banten; Gubernur Banten 2024", strength:7 },
  { from:"muzakir_manaf",  to:"prabowo",   type:"koalisi",   label:"Gerindra Aceh; eks-GAM, Gubernur Aceh 2024", strength:7 },
  { from:"rudy_masud",     to:"prabowo",   type:"koalisi",   label:"Gerindra Kaltim; Gubernur IKN-strategis 2024", strength:7 },
  { from:"hendrik_lewerissa",to:"prabowo", type:"koalisi",   label:"Gerindra Maluku; Gubernur Maluku 2024", strength:7 },
  { from:"anwar_hafid",    to:"prabowo",   type:"koalisi",   label:"Gerindra Sulteng; Gubernur Sulteng 2024", strength:7 },
  { from:"muhidin",        to:"prabowo",   type:"koalisi",   label:"Gerindra Kalsel; Gubernur Kalsel 2024", strength:6 },
  { from:"agustiar_sabran",to:"prabowo",   type:"koalisi",   label:"Gerindra Kalteng; Gubernur Kalteng 2024", strength:6 },
  { from:"zainal_arifin",  to:"prabowo",   type:"koalisi",   label:"Gerindra Kaltara; Gubernur Kaltara 2x periode", strength:6 },

  // ── PDI-P Gubernur ───────────────────────────────────────────────────────
  { from:"pramono_anung",  to:"megawati",  type:"koalisi",   label:"PDI-P; loyalis Megawati, Gubernur DKI 2024", strength:8 },
  { from:"koster",         to:"megawati",  type:"koalisi",   label:"PDI-P; loyalis Megawati, Gubernur Bali 2x periode", strength:8 },

  // ── Koster-Pramono vs Nasional ───────────────────────────────────────────
  { from:"ridwan_kamil",   to:"prabowo",   type:"mantan-koalisi", label:"Diusung KIM Plus DKI; kalah Pilkada DKI 2024", strength:5 },
  { from:"ridwan_kamil",   to:"megawati",  type:"konflik",        label:"Rival Pramono-Rano (PDIP) di Pilkada DKI 2024", strength:3 },

  // ── Pramono Anung ekstra ─────────────────────────────────────────────────
  { from:"pramono_anung",  to:"jokowi",    type:"rekan",     label:"Seskab Jokowi 2014-2024; loyalis eks-presiden", strength:8 },
  { from:"hanindhito",     to:"pramono_anung", type:"keluarga", label:"Anak-Bapak; Bupati Kediri-Gubernur DKI", strength:10 },

  // ── Menteri Kabinet Merah Putih ──────────────────────────────────────────
  { from:"erick_thohir",   to:"prabowo",   type:"koalisi",   label:"Menteri BUMN Kabinet Merah Putih", strength:7 },
  { from:"erick_thohir",   to:"jokowi",    type:"rekan",     label:"Menteri BUMN Kabinet Jokowi 2019-2024", strength:8 },
  { from:"budi_arie",      to:"jokowi",    type:"rekan",     label:"Menkominfo 2023-2024, loyalis Projo-Jokowi", strength:8 },
  { from:"budi_arie",      to:"prabowo",   type:"koalisi",   label:"Menteri Koperasi Kabinet Merah Putih 2024", strength:6 },

  // ── IKN Nusantara ────────────────────────────────────────────────────────
  { from:"basuki",         to:"jokowi",    type:"rekan",     label:"Menteri PUPR andalan Jokowi 10 tahun (2014-2024)", strength:9 },
  { from:"basuki",         to:"prabowo",   type:"rekan",     label:"Kepala OIKN Nusantara di Kabinet Prabowo", strength:7 },
  { from:"basuki",         to:"rudy_masud",type:"rekan",     label:"Kepala OIKN-Gubernur Kaltim, koordinasi IKN", strength:7 },

  // ── Keamanan nasional ────────────────────────────────────────────────────
  { from:"ahmad_luthfi",   to:"listyo_sigit", type:"rekan",  label:"Eks-Kapolda Jateng; jaringan Polri", strength:6 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH: Gubernur → Ketum Partai (Pilkada 2024) ───────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  // Gerindra gubernur → prabowo (presiden/patron) + sufmi_dasco (Sekjen, Plt Ketum)
  { from:"al_haris",        to:"prabowo",      type:"koalisi", label:"Gerindra — Gubernur Jambi 2024",                strength:7 },
  { from:"al_haris",        to:"sufmi_dasco",   type:"koalisi", label:"Gerindra — Sekjen Gerindra, koordinasi Jambi", strength:6 },
  { from:"rahmat_mirzani",  to:"prabowo",       type:"koalisi", label:"Gerindra — Gubernur Lampung 2024",              strength:7 },
  { from:"rahmat_mirzani",  to:"sufmi_dasco",   type:"koalisi", label:"Gerindra — Sekjen Gerindra, koordinasi Lampung",strength:6 },
  { from:"hidayat_arsani",  to:"prabowo",       type:"koalisi", label:"Gerindra — Gubernur Babel 2024",                strength:6 },
  { from:"hidayat_arsani",  to:"sufmi_dasco",   type:"koalisi", label:"Gerindra — Sekjen Gerindra, koordinasi Babel",  strength:5 },
  { from:"yulius_selvanus", to:"prabowo",       type:"koalisi", label:"Gerindra — Gubernur Sulut 2024",               strength:6 },
  { from:"yulius_selvanus", to:"sufmi_dasco",   type:"koalisi", label:"Gerindra — Sekjen Gerindra, koordinasi Sulut", strength:5 },
  { from:"andi_sumangerukka",to:"prabowo",      type:"koalisi", label:"Gerindra — Gubernur Sultra 2024",              strength:6 },
  { from:"andi_sumangerukka",to:"sufmi_dasco",  type:"koalisi", label:"Gerindra — Sekjen Gerindra, koordinasi Sultra",strength:5 },
  { from:"sitti_sutinah",   to:"prabowo",       type:"koalisi", label:"Gerindra — Gubernur Sulbar 2024",              strength:6 },
  { from:"sitti_sutinah",   to:"sufmi_dasco",   type:"koalisi", label:"Gerindra — Sekjen Gerindra, koordinasi Sulbar",strength:5 },
  { from:"sherly_tjoanda",  to:"prabowo",       type:"koalisi", label:"Gerindra — Gubernur Malut 2025",               strength:6 },
  { from:"sherly_tjoanda",  to:"sufmi_dasco",   type:"koalisi", label:"Gerindra — Sekjen Gerindra, koordinasi Malut", strength:5 },
  // Gerindra Sulsel sudah ada, tambah sufmi_dasco
  { from:"muzakir_manaf",   to:"sufmi_dasco",   type:"koalisi", label:"Gerindra — Sekjen Gerindra, koordinasi Aceh",  strength:6 },
  { from:"bobby_nasution",  to:"sufmi_dasco",   type:"koalisi", label:"Gerindra — Sekjen Gerindra, koordinasi Sumut", strength:6 },
  { from:"dedi_mulyadi",    to:"sufmi_dasco",   type:"koalisi", label:"Gerindra — Sekjen Gerindra, koordinasi Jabar", strength:6 },
  { from:"ahmad_luthfi",    to:"sufmi_dasco",   type:"koalisi", label:"Gerindra — Sekjen Gerindra, koordinasi Jateng",strength:6 },
  { from:"andra_soni",      to:"sufmi_dasco",   type:"koalisi", label:"Gerindra — Sekjen Gerindra, koordinasi Banten",strength:6 },
  { from:"rudy_masud",      to:"sufmi_dasco",   type:"koalisi", label:"Gerindra — Sekjen Gerindra, koordinasi Kaltim",strength:6 },
  { from:"agustiar_sabran", to:"sufmi_dasco",   type:"koalisi", label:"Gerindra — Sekjen Gerindra, koordinasi Kalteng",strength:5 },
  { from:"muhidin",         to:"sufmi_dasco",   type:"koalisi", label:"Gerindra — Sekjen Gerindra, koordinasi Kalsel",strength:5 },
  { from:"zainal_arifin",   to:"sufmi_dasco",   type:"koalisi", label:"Gerindra — Sekjen Gerindra, koordinasi Kaltara",strength:5 },
  { from:"anwar_hafid",     to:"sufmi_dasco",   type:"koalisi", label:"Gerindra — Sekjen Gerindra, koordinasi Sulteng",strength:5 },
  { from:"hendrik_lewerissa",to:"sufmi_dasco",  type:"koalisi", label:"Gerindra — Sekjen Gerindra, koordinasi Maluku",strength:5 },

  // Golkar gubernur → bahlil (Ketua Umum baru sejak 2024)
  { from:"ansar_ahmad",     to:"bahlil",        type:"koalisi", label:"Golkar — Gubernur Kepri 2x periode",           strength:7 },
  { from:"ansar_ahmad",     to:"airlangga",     type:"koalisi", label:"Golkar — Mantan Ketum Golkar era Kepri I",     strength:6 },
  { from:"melkiades",       to:"bahlil",        type:"koalisi", label:"Golkar — Gubernur NTT 2024",                   strength:6 },
  { from:"ria_norsan",      to:"bahlil",        type:"koalisi", label:"Golkar — Gubernur Kalbar 2x periode",          strength:7 },
  { from:"ria_norsan",      to:"airlangga",     type:"koalisi", label:"Golkar — era Mantan Ketum Golkar",            strength:5 },
  { from:"gusnar_ismail",   to:"bahlil",        type:"koalisi", label:"Golkar — Gubernur Gorontalo 2024",             strength:6 },

  // PKB gubernur → cakimin
  { from:"khofifah",        to:"cakimin",       type:"koalisi", label:"PKB — Gubernur Jatim 2024, kader PKB",        strength:7 },
  { from:"abdul_wahid",     to:"cakimin",       type:"koalisi", label:"PKB — Gubernur Riau 2024",                     strength:7 },

  // PKS gubernur → ahmad_syaikhu
  { from:"mahyeldi",        to:"ahmad_syaikhu", type:"koalisi", label:"PKS — Gubernur Sumbar 2x periode",             strength:8 },
  { from:"helmi_hasan",     to:"ahmad_syaikhu", type:"koalisi", label:"PKS — Gubernur Bengkulu 2024",                 strength:7 },

  // NasDem gubernur → surya_paloh
  { from:"herman_deru",     to:"surya_paloh",   type:"koalisi", label:"NasDem — Gubernur Sumsel 2x periode",          strength:7 },
  { from:"lalu_iqbal",      to:"surya_paloh",   type:"koalisi", label:"NasDem — Gubernur NTB 2024, eks-Dubes",        strength:7 },
  { from:"andi_sudirman",   to:"surya_paloh",   type:"koalisi", label:"NasDem — Gubernur Sulsel 2x periode",          strength:7 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH: Menteri Kabinet Merah Putih → Prabowo ─────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  { from:"sugiono",         to:"prabowo",       type:"koalisi", label:"Menteri Luar Negeri — Kabinet Merah Putih",    strength:8 },
  { from:"sjafrie",         to:"prabowo",       type:"koalisi", label:"Menteri Pertahanan — Kabinet Merah Putih",     strength:8 },
  { from:"agus_gumiwang",   to:"prabowo",       type:"koalisi", label:"Menteri Perindustrian — Kabinet Merah Putih",  strength:7 },
  { from:"azwar_anas",      to:"prabowo",       type:"koalisi", label:"Menteri PAN-RB — Kabinet Merah Putih",         strength:7 },
  { from:"nawawi",          to:"prabowo",       type:"rekan",   label:"Ketua KPK — koordinasi pemberantasan korupsi", strength:5 },
  { from:"basuki",          to:"prabowo",       type:"koalisi", label:"Kepala OIKN Nusantara — Kabinet Prabowo",      strength:7 },
  { from:"agus_subiyanto",  to:"prabowo",       type:"koalisi", label:"Panglima TNI — di bawah Presiden Prabowo",     strength:8 },
  { from:"listyo_sigit",    to:"prabowo",       type:"koalisi", label:"Kapolri — bertugas di era Presiden Prabowo",   strength:7 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH: Keluarga & Dinasti ────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  // SBY-AHY
  { from:"sby",             to:"ahy",           type:"keluarga", label:"Bapak-Anak (Agus Harimurti Yudhoyono)",      strength:10 },
  { from:"sby",             to:"agus_subiyanto", type:"rekan",   label:"Era SBY — jaringan militer AD",               strength:5 },

  // Jokowi dynasty ekstra
  { from:"jokowi",          to:"anwar_usman",   type:"keluarga", label:"Ipar — Anwar menikahi adik Jokowi",          strength:9 },
  { from:"anwar_usman",     to:"gibran",        type:"keluarga", label:"Paman — putusan MK batas usia Cawapres",     strength:10 },

  // Megawati-Puan ekstra
  { from:"puan",            to:"hasto",         type:"rekan",   label:"Rekan senior PDIP; koordinasi partai",         strength:7 },
  { from:"puan",            to:"ganjar",        type:"koalisi", label:"PDIP — Puan usung Ganjar Capres 2024",         strength:8 },

  // Hashim bisnis
  { from:"hashim",          to:"erick_thohir",  type:"bisnis",  label:"Lingkaran pengusaha Prabowo — bisnis bersama", strength:5 },
  { from:"hashim",          to:"sufmi_dasco",   type:"rekan",   label:"Dewan Pembina-Sekjen Gerindra; koordinasi partai", strength:7 },

  // Emil Dardak → Hary Tanoe (mertua)
  { from:"emil_dardak",     to:"ahy",           type:"koalisi", label:"Demokrat — Wagub Jatim kader Demokrat",       strength:7 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH: Bisnis & Konflik ──────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  { from:"surya_paloh",     to:"anies",         type:"rekan",   label:"NasDem usung Anies; Paloh patron Anies 2024",  strength:8 },
  { from:"anies",           to:"pramono_anung", type:"konflik", label:"Rival Pilkada DKI 2024 — Anies kalah",         strength:3 },
  { from:"ridwan_kamil",    to:"pramono_anung", type:"konflik", label:"Rival Pilkada DKI 2024 — RK kalah",            strength:3 },
  { from:"budi_gunawan",    to:"megawati",      type:"konflik", label:"BIN vs PDIP — BG calon Kapolri gagal era PDIP",strength:4 },
  { from:"anies",           to:"hasto",         type:"konflik", label:"Oposisi vs PDIP internal — beda visi perubahan",strength:3 },
  { from:"tom_lembong",     to:"megawati",      type:"rekan",   label:"NasDem-PDIP, koalisi Anies 2024",              strength:4 },
  { from:"anies",           to:"ahmad_syaikhu", type:"koalisi", label:"PKS dukung Anies Capres 2024",                 strength:7 },
  { from:"mahfud_md",       to:"ganjar",        type:"koalisi", label:"Paslon Capres-Cawapres 2024 (Paslon 3)",       strength:10 },
  { from:"ganjar",          to:"megawati",      type:"koalisi", label:"PDIP usung Ganjar Capres 2024",                strength:9 },
  { from:"ganjar",          to:"hasto",         type:"rekan",   label:"Hasto koordinator kampanye Ganjar-Mahfud 2024",strength:7 },
  { from:"said_iqbal",      to:"cakimin",       type:"rekan",   label:"Buruh-PKB, basis massa pekerja & NU",          strength:5 },
  { from:"gus_yahya",       to:"cakimin",       type:"konflik", label:"PBNU tidak otomatis mendukung PKB — tensi 2024",strength:4 },
  { from:"haedar_nashir",   to:"anies",         type:"rekan",   label:"Muhammadiyah — basis massa Anies Capres 2024", strength:5 },
  { from:"anwar_abbas",     to:"prabowo",       type:"rekan",   label:"MUI — dukung stabilitas pemerintah Prabowo",   strength:5 },

  // ── KPK dan tersangka ───────────────────────────────────────────────────
  { from:"gus_muhdlor",     to:"khofifah",      type:"rekan",   label:"Bupati Sidoarjo di bawah pemerintahan Gubernur Jatim", strength:6 },
  { from:"saiful_ilah",     to:"gus_muhdlor",   type:"rekan",   label:"Mantan-Bupati ke Bupati Sidoarjo; warisan pemerintahan", strength:5 },
  { from:"hasan_aminuddin", to:"cakimin",       type:"rekan",   label:"NasDem Probolinggo; bersinggungan dengan PKB", strength:4 },
  { from:"sanusi_malang",   to:"prabowo",       type:"koalisi", label:"Gerindra — Bupati Malang dari Gerindra",       strength:6 },

  // ── Jawa Timur ekstra ───────────────────────────────────────────────────
  { from:"eri_cahyadi",     to:"megawati",      type:"koalisi", label:"PDIP — Walikota Surabaya kader PDIP",          strength:7 },
  { from:"timbul_prihanjoko",to:"megawati",     type:"koalisi", label:"PDIP — Bupati Pasuruan kader PDIP",            strength:6 },
  { from:"dawam_ridho",     to:"megawati",      type:"koalisi", label:"PDIP — Bupati Lumajang kader PDIP",            strength:6 },
  { from:"ipuk",            to:"megawati",      type:"koalisi", label:"PDIP — Bupati Banyuwangi kader PDIP",          strength:6 },
  { from:"hanindhito",      to:"megawati",      type:"koalisi", label:"PDIP — Bupati Kediri kader PDIP",              strength:6 },
  { from:"azwar_anas",      to:"megawati",      type:"koalisi", label:"PDIP — Menteri PAN-RB kader PDIP",             strength:6 },
  { from:"fandi_yani",      to:"cakimin",       type:"koalisi", label:"PKB — Bupati Gresik kader PKB",                strength:7 },
  { from:"hendy_siswanto",  to:"cakimin",       type:"koalisi", label:"PKB — Bupati Jember kader PKB",                strength:6 },
  { from:"ikfina",          to:"cakimin",       type:"koalisi", label:"PKB — Bupati Mojokerto kader PKB",             strength:6 },
  { from:"mundjidah",       to:"cakimin",       type:"koalisi", label:"PKB — Bupati Jombang kader PKB; basis NU",     strength:7 },
  { from:"yuhronur_efendi", to:"cakimin",       type:"koalisi", label:"PKB — Bupati Lamongan kader PKB",              strength:6 },
  { from:"fauzi_ngawi",     to:"cakimin",       type:"koalisi", label:"PKB — Bupati Ngawi kader PKB",                 strength:6 },
  { from:"andri_wahyudi",   to:"cakimin",       type:"koalisi", label:"PKB — Bupati Bondowoso kader PKB",             strength:6 },
  { from:"bangkalan_bupati",to:"cakimin",       type:"koalisi", label:"PKB — Bupati Bangkalan kader PKB",             strength:6 },
  { from:"fauzi_sampang",   to:"cakimin",       type:"koalisi", label:"PKB — Bupati Sampang kader PKB",               strength:6 },
  { from:"taufiq_pamekasan",to:"cakimin",       type:"koalisi", label:"PKB — Bupati Pamekasan kader PKB; Madura",     strength:6 },
  { from:"winarso_kediri",  to:"cakimin",       type:"koalisi", label:"PKB — Walikota Kediri kader PKB",              strength:6 },
  { from:"arifin_tuban",    to:"cakimin",       type:"koalisi", label:"PKB — Bupati Tuban kader PKB",                 strength:6 },
  { from:"karna_suswandi",  to:"surya_paloh",   type:"koalisi", label:"NasDem — Bupati Situbondo kader NasDem",       strength:6 },
  { from:"suwandy",         to:"surya_paloh",   type:"koalisi", label:"NasDem — Walikota Probolinggo kader NasDem",   strength:6 },
  { from:"maidi",           to:"prabowo",       type:"koalisi", label:"Gerindra — Walikota Madiun kader Gerindra",    strength:6 },
  { from:"maidi",           to:"sufmi_dasco",   type:"koalisi", label:"Gerindra — koordinasi partai",                 strength:5 },
  { from:"ipong_muchlissoni",to:"prabowo",      type:"koalisi", label:"Gerindra — Bupati Ponorogo kader Gerindra",    strength:6 },
  { from:"ipong_muchlissoni",to:"sufmi_dasco",  type:"koalisi", label:"Gerindra — koordinasi partai",                 strength:5 },
  { from:"sutiaji",         to:"ahy",           type:"koalisi", label:"Demokrat — Walikota Malang kader Demokrat",   strength:6 },
  { from:"busyro_sumenep",  to:"megawati",      type:"koalisi", label:"PDIP — Bupati Sumenep kader PDIP",             strength:6 },

  // ── Analitik & Koalisi Besar ────────────────────────────────────────────
  { from:"prabowo",         to:"sufmi_dasco",   type:"koalisi", label:"Presiden-Sekjen Gerindra; Prabowo patron Dasco",strength:9 },
  { from:"prabowo",         to:"bahlil",        type:"koalisi", label:"Golkar bergabung KIM Plus; Bahlil menteri ESDM",strength:8 },
  { from:"prabowo",         to:"cakimin",       type:"koalisi", label:"PKB bergabung KIM Plus setelah Pilpres",       strength:7 },
  { from:"prabowo",         to:"surya_paloh",   type:"mantan-koalisi", label:"NasDem sempat bergabung, kemudian jarak",strength:4 },
  { from:"prabowo",         to:"ahmad_syaikhu", type:"mantan-koalisi", label:"PKS gabung KIM Plus setelah Pilpres 2024",strength:5 },
  { from:"airlangga",       to:"bahlil",        type:"konflik", label:"Pergantian Ketum Golkar — Bahlil gantikan Airlangga 2024", strength:5 },
  { from:"cakimin",         to:"anies",         type:"konflik", label:"Paslon 2024 gagal; PKB kemudian gabung KIM Plus", strength:4 },

  // ── DPR Commission Chairs ─────────────────────────────────────────────────
  { from:"meutya_hafid",    to:"airlangga",     type:"koalisi", label:"Golkar — Meutya Ketua Komisi I, kini Menkomdigi",   strength:8 },
  { from:"utut_adianto",    to:"megawati",      type:"koalisi", label:"PDIP — Utut Ketua Komisi II DPR, kader PDIP",       strength:7 },
  { from:"habiburokhman",   to:"prabowo",       type:"koalisi", label:"Gerindra — Habiburokhman Ketua Komisi III, loyalis", strength:9 },
  { from:"titiek_soeharto", to:"prabowo",       type:"keluarga",label:"Mantan istri Prabowo; keduanya di Gerindra",         strength:6 },
  { from:"titiek_soeharto", to:"prabowo",       type:"koalisi", label:"Gerindra — Titiek Ketua Komisi IV DPR",              strength:7 },
  { from:"sartono_hutomo",  to:"prabowo",       type:"koalisi", label:"Gerindra — Sartono Ketua Komisi VI DPR",             strength:7 },
  { from:"marwan_dasopang", to:"cakimin",       type:"koalisi", label:"PKB — Marwan Ketua Komisi VIII DPR",                 strength:7 },
  { from:"misbakhun",       to:"airlangga",     type:"koalisi", label:"Golkar — Misbakhun Ketua Komisi XI DPR",             strength:7 },
  { from:"hary_tanoe",      to:"prabowo",       type:"koalisi", label:"Perindo dukung KIM Plus; MNC Group pro-pemerintah",  strength:6 },

  // ── DPR Commission Chairs → Overseen Ministers (pengawasan) ─────────────
  { from:"meutya_hafid",    to:"budi_arie",     type:"rekan",   label:"Komisi I DPR mengawasi Kemenkomdigi (Meutya kini Menkomdigi, Budi Arie Menkominfo sebelumnya)", strength:6 },
  { from:"habiburokhman",   to:"yusril",        type:"rekan",   label:"Komisi III DPR (Hukum) mengawasi Kemenkopolhukam — Yusril Menko Hukum", strength:6 },
  { from:"misbakhun",       to:"sri_mulyani",   type:"rekan",   label:"Komisi XI DPR mengawasi Kemenkeu dan BI — Sri Mulyani Menkeu", strength:7 },
  { from:"utut_adianto",    to:"megawati",      type:"koalisi", label:"PDIP — Ketua Komisi II DPR loyalis Megawati; pengawasan otonomi daerah & pemerintahan", strength:8 },
  { from:"titiek_soeharto", to:"prabowo",       type:"keluarga",label:"Mantan suami-istri; bercerai tapi tetap satu partai Gerindra", strength:5 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH 9: Gubernur → Ketum Partai (tambahan) ─────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  // PKB gubernur → cakimin
  { from:"muzakir_manaf",   to:"cakimin",       type:"koalisi",  label:"PKB — Gubernur Aceh, dukungan PKB",                         strength:8 },
  { from:"lalu_iqbal",      to:"cakimin",       type:"koalisi",  label:"PKB — Gubernur NTB 2024",                                   strength:8 },

  // Demokrat gubernur → AHY
  { from:"andra_soni",      to:"ahy",           type:"koalisi",  label:"Demokrat usung Andra Soni Gubernur Banten 2024",            strength:8 },

  // PDIP → Puan lintas daerah
  { from:"koster",          to:"puan",          type:"rekan",    label:"PDIP — Koster Gubernur Bali, koordinasi PDIP DPR",          strength:6 },

  // Gerindra gubernur → prabowo (yang belum ada)
  { from:"mahyeldi",        to:"prabowo",       type:"koalisi",  label:"Gerindra — Gubernur Sumbar 2024",                           strength:8 },
  { from:"herman_deru",     to:"prabowo",       type:"koalisi",  label:"KIM Plus — Gubernur Sumsel 2x periode",                     strength:7 },
  { from:"helmi_hasan",     to:"prabowo",       type:"koalisi",  label:"KIM Plus — Gubernur Bengkulu 2024",                         strength:7 },
  { from:"melkiades",       to:"prabowo",       type:"koalisi",  label:"KIM Plus — Gubernur NTT 2024",                              strength:7 },
  { from:"andi_sudirman",   to:"prabowo",       type:"koalisi",  label:"Gerindra — Gubernur Sulsel 2x periode",                     strength:8 },
  { from:"gusnar_ismail",   to:"prabowo",       type:"koalisi",  label:"KIM Plus — Gubernur Gorontalo 2024",                        strength:7 },
  { from:"dedi_mulyadi",    to:"airlangga",     type:"koalisi",  label:"Golkar — Gubernur Jabar 2024, kader Golkar",                strength:8 },

  // Golkar gubernur → airlangga (yang belum ada)
  { from:"mahyeldi",        to:"airlangga",     type:"koalisi",  label:"Golkar koalisi Sumbar — KIM Plus 2024",                     strength:6 },
  { from:"rudy_masud",      to:"airlangga",     type:"koalisi",  label:"Golkar — Gubernur Kaltim, kader Golkar",                    strength:8 },
  { from:"al_haris",        to:"airlangga",     type:"koalisi",  label:"Golkar — Gubernur Jambi 2024, kader Golkar",                strength:8 },
  { from:"rahmat_mirzani",  to:"airlangga",     type:"koalisi",  label:"Golkar — Gubernur Lampung 2024",                            strength:8 },

  // DIY
  { from:"sultan_hb10",     to:"prabowo",       type:"koalisi",  label:"DIY — Sultan HB X mendukung pemerintahan Prabowo",          strength:6 },
  { from:"sultan_hb10",     to:"megawati",      type:"rekan",    label:"Pertemuan politisi senior; Sultan-Megawati",                strength:5 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH 10: DPR Chairs → Menteri & Presiden ────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  { from:"meutya_hafid",    to:"sjafrie",       type:"rekan",    label:"Komisi I DPR — mitra Menhan Sjafrie di bidang pertahanan",  strength:7 },
  { from:"meutya_hafid",    to:"prabowo",       type:"koalisi",  label:"Golkar loyalis Prabowo; Meutya Menkomdigi",                 strength:8 },
  { from:"habiburokhman",   to:"listyo_sigit",  type:"rekan",    label:"Komisi III DPR (Hukum) mengawasi Kapolri Listyo Sigit",     strength:6 },
  { from:"misbakhun",       to:"prabowo",       type:"koalisi",  label:"Golkar loyalis — Misbakhun Ketua Komisi XI",                strength:8 },
  { from:"misbakhun",       to:"sri_mulyani",   type:"konflik",  label:"Komisi XI DPR vs Kemenkeu — konflik anggaran efisiensi",    strength:7 },
  { from:"hary_tanoe",      to:"airlangga",     type:"rekan",    label:"Perindo-Golkar — KIM Plus koalisi; rekan pengusaha media",  strength:6 },
  { from:"cucun_syamsurijal",to:"cakimin",      type:"koalisi",  label:"PKB — Cucun Wakil Ketua DPR, loyalis Cak Imin",            strength:9 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH 11: Ormas → Partai & Pemerintah ────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  { from:"gus_yahya",       to:"cakimin",       type:"rekan",    label:"NU-PKB hubungan historis; Gus Yahya PBNU, Cak Imin PKB",    strength:7 },
  { from:"gus_yahya",       to:"prabowo",       type:"rekan",    label:"NU-pemerintah — PBNU dukung stabilitas Prabowo",            strength:6 },
  { from:"gus_yahya",       to:"jokowi",        type:"rekan",    label:"PBNU dukungan Jokowi; hubungan NU-Istana 10 tahun",         strength:7 },
  { from:"haedar_nashir",   to:"ahy",           type:"rekan",    label:"Muhammadiyah-Demokrat dialog; Haedar-AHY interaksi",        strength:5 },
  { from:"haedar_nashir",   to:"prabowo",       type:"rekan",    label:"Muhammadiyah-pemerintah — Haedar dialog dengan Prabowo",    strength:6 },
  { from:"anwar_abbas",     to:"cakimin",       type:"rekan",    label:"MUI-PKB hubungan ulama-partai Islam",                       strength:6 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH 12: Bisnis & Oligarki ──────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  { from:"hashim",          to:"prabowo",       type:"keluarga", label:"Adik kandung — Hashim Djojohadikusumo",                     strength:10 },
  { from:"hashim",          to:"airlangga",     type:"bisnis",   label:"Koneksi bisnis tambang; lingkaran oligarki KIM Plus",       strength:6 },
  { from:"erick_thohir",    to:"gibran",        type:"rekan",    label:"BUMN-pemerintahan baru; Erick koordinasi kabinet Prabowo",  strength:7 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH 13: Konflik & Drama Politik ────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  { from:"anwar_usman",     to:"jokowi",        type:"rekan",    label:"MK ubah aturan usia Cawapres — membantu Gibran putra Jokowi",strength:8 },
  { from:"anwar_usman",     to:"gibran",        type:"rekan",    label:"Keputusan MK batas usia menguntungkan Gibran",              strength:7 },
  { from:"tom_lembong",     to:"jokowi",        type:"rekan",    label:"Menteri Perdagangan era Jokowi 2015-2016",                  strength:8 },
  { from:"hasto",           to:"puan",          type:"koalisi",  label:"PDIP — Hasto Sekjen, Puan Ketua DPR; koordinasi partai",    strength:7 },
  { from:"gatot_nurmantyo", to:"prabowo",       type:"konflik",  label:"Rival eks-militer — beda blok politik pasca-Reformasi",     strength:4 },
  { from:"gatot_nurmantyo", to:"jokowi",        type:"konflik",  label:"Dicopot Jokowi 2017 — pangkat Panglima TNI bermasalah",     strength:6 },
  { from:"mahfud_md",       to:"jokowi",        type:"rekan",    label:"Menko Polhukam 2019-2024 → mundur Februari 2024",           strength:7 },
  { from:"mahfud_md",       to:"megawati",      type:"koalisi",  label:"PDIP usung Ganjar-Mahfud Capres-Cawapres 2024",             strength:8 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH 14: Jaringan Jatim & Regional ──────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  { from:"khofifah",        to:"prabowo",       type:"koalisi",  label:"Gubernur Jatim KIM Plus 2024; Khofifah dukung Prabowo",     strength:8 },
  { from:"khofifah",        to:"jokowi",        type:"rekan",    label:"Menteri Sosial Kabinet Jokowi 2018-2023",                   strength:8 },
  { from:"eri_cahyadi",     to:"puan",          type:"koalisi",  label:"PDIP — Wali Kota Surabaya koordinasi PDIP Jatim",           strength:7 },
  { from:"azwar_anas",      to:"jokowi",        type:"rekan",    label:"Kepala BKN Kabinet Jokowi — dilanjut Prabowo",              strength:8 },
  { from:"hanindhito",      to:"puan",          type:"rekan",    label:"PDIP muda — Bupati Kediri koordinasi dengan Puan",          strength:7 },
  { from:"fandi_yani",      to:"megawati",      type:"koalisi",  label:"PDIP — eks-Bupati Bojonegoro kader PDIP",                  strength:6 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH 15: Rantai Karir & Patron-Klient ───────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  { from:"sby",             to:"prabowo",       type:"konflik",  label:"Rival Pilpres 2009 — SBY menang, Prabowo kalah",            strength:5 },
  { from:"sby",             to:"megawati",      type:"konflik",  label:"Rival Pilpres 2004 — SBY menang, Megawati kalah",           strength:4 },
  { from:"ganjar",          to:"pramono_anung", type:"rekan",    label:"PDIP Jateng-DKI — Ganjar Gubernur, Pramono Seskab/Gubernur",strength:7 },
  { from:"agus_subiyanto",  to:"jokowi",        type:"rekan",    label:"Panglima TNI ditunjuk Jokowi Oktober 2023",                 strength:9 },
  { from:"nawawi",          to:"jokowi",        type:"rekan",    label:"Ketua KPK Nawawi dipilih era Jokowi",                       strength:7 },
  { from:"budi_gunawan",    to:"megawati",      type:"rekan",    label:"Kepala BIN dekat PDIP; dicalonkan Kapolri oleh PDIP-Jokowi",strength:8 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH 16: Koneksi Silang Tambahan ────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  { from:"airlangga",       to:"prabowo",       type:"koalisi",  label:"Golkar KIM Plus — Airlangga Menko Ekonomi Prabowo",         strength:8 },
  { from:"airlangga",       to:"jokowi",        type:"rekan",    label:"Menko Ekonomi Kabinet Jokowi 2019-2024",                    strength:8 },
  { from:"sjafrie",         to:"jokowi",        type:"rekan",    label:"Wamenhan era Jokowi; jaringan militer-politik",             strength:6 },
  { from:"sjafrie",         to:"prabowo",       type:"rekan",    label:"Sesama eks-Kopassus; rekan militer senior",                 strength:8 },
  { from:"agus_gumiwang",   to:"airlangga",     type:"rekan",    label:"Golkar — Agus Gumiwang kader Golkar, era Airlangga Ketum",  strength:8 },
  { from:"bahlil",          to:"prabowo",       type:"koalisi",  label:"Menko Ekonomi Kabinet Prabowo; Ketum Golkar KIM Plus",      strength:9 },
  { from:"zulhas",          to:"prabowo",       type:"koalisi",  label:"PAN KIM Plus — Zulhas Menteri era Prabowo",                 strength:8 },
  { from:"zulhas",          to:"jokowi",        type:"rekan",    label:"Menteri Perdagangan Kabinet Jokowi 2022-2024",               strength:7 },
  { from:"cakimin",         to:"megawati",      type:"mantan-koalisi", label:"PKB-PDIP pernah berkoalisi; kini beda arah pasca-2024",strength:5 },
  { from:"surya_paloh",     to:"jokowi",        type:"rekan",    label:"NasDem dukung Jokowi 2014 & 2019; kemudian renggang",       strength:8 },
  { from:"surya_paloh",     to:"prabowo",       type:"konflik",  label:"NasDem awalnya oposisi Prabowo, lalu masuk KIM Plus",       strength:5 },
  { from:"ahmad_syaikhu",   to:"prabowo",       type:"mantan-koalisi", label:"PKS oposi Prabowo 2024, lalu masuk KIM Plus pasca-Pilpres", strength:6 },
  { from:"sultan_najamudin",to:"prabowo",       type:"koalisi",  label:"KIM Plus — Wakil Ketua MPR, koordinasi legislatif",         strength:7 },
  { from:"sunarto",         to:"prabowo",       type:"rekan",    label:"Ketua Mahkamah Agung era Prabowo",                          strength:6 },
  { from:"suhartoyo",       to:"anwar_usman",   type:"rekan",    label:"MK sesama Hakim Konstitusi; Suhartoyo gantikan Anwar Usman",strength:5 },
  { from:"suhartoyo",       to:"prabowo",       type:"rekan",    label:"Ketua MK era Presiden Prabowo",                             strength:6 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH 17: Inter-Minister Cabinet Ties ────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  { from:"sjafrie",         to:"agus_subiyanto", type:"rekan",   label:"Menhan-Panglima TNI koordinasi pertahanan",                 strength:8 },
  { from:"sjafrie",         to:"listyo_sigit",   type:"rekan",   label:"Menko Polkam-Kapolri koordinasi keamanan",                  strength:7 },
  { from:"budi_gunawan",    to:"listyo_sigit",   type:"rekan",   label:"Menkopolkam-Kapolri koordinasi Polri",                      strength:8 },
  { from:"budi_gunawan",    to:"agus_subiyanto", type:"rekan",   label:"Menkopolkam-Panglima TNI koordinasi",                       strength:8 },
  { from:"erick_thohir",    to:"bahlil",         type:"rekan",   label:"BUMN-Menko Energi koordinasi BUMN energi",                  strength:7 },
  { from:"erick_thohir",    to:"airlangga",      type:"rekan",   label:"BUMN-Menko Ekonomi koordinasi investasi",                   strength:7 },
  { from:"bahlil",          to:"airlangga",      type:"rekan",   label:"Sesama Menko kabinet ekonomi — Golkar eks Ketum",           strength:7 },
  { from:"sri_mulyani",     to:"airlangga",      type:"rekan",   label:"Kemenkeu-Menko Ekonomi koordinasi fiskal",                  strength:8 },
  { from:"meutya_hafid",    to:"sugiono",        type:"rekan",   label:"Kemenkomdigi-Kemenlu koordinasi diplomasi digital",         strength:6 },
  { from:"yusril",          to:"prabowo",        type:"koalisi", label:"PBB dukung Prabowo; Yusril Menko Hukum Kabinet Merah Putih",strength:8 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH 18: Party Internal Hierarchy ───────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  { from:"sufmi_dasco",     to:"airlangga",      type:"rekan",   label:"DPR-Golkar koordinasi legislatif",                          strength:6 },
  { from:"sufmi_dasco",     to:"cakimin",        type:"rekan",   label:"DPR lintas fraksi Gerindra-PKB",                            strength:5 },
  { from:"ahmad_muzani",    to:"sufmi_dasco",    type:"rekan",   label:"MPR Ketua-DPR, sesama pimpinan legislatif",                 strength:7 },
  { from:"ahmad_muzani",    to:"airlangga",      type:"rekan",   label:"MPR-Golkar koordinasi KIM Plus",                            strength:6 },
  { from:"cucun_syamsurijal",to:"megawati",      type:"konflik", label:"PKB berseberangan PDIP; pertemuan lintas blok terbatas",    strength:4 },
  { from:"sultan_najamudin", to:"airlangga",     type:"rekan",   label:"Wakil Ketua MPR — Golkar; koordinasi parlemen",             strength:6 },
  { from:"sunarto",         to:"nawawi",         type:"rekan",   label:"MA-KPK koordinasi penegakan hukum",                         strength:5 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH 19: Jatim Deep Network ─────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  { from:"khofifah",        to:"eri_cahyadi",    type:"rekan",   label:"Gubernur Jatim-Walikota Surabaya koordinasi regional",      strength:7 },
  { from:"khofifah",        to:"gus_muhdlor",    type:"rekan",   label:"Gubernur Jatim-Bupati Sidoarjo; OTT KPK terjadi",          strength:6 },
  { from:"khofifah",        to:"hanindhito",     type:"rekan",   label:"Gubernur Jatim-Bupati Kediri; koordinasi PDIP-PKB Jatim",  strength:6 },
  { from:"khofifah",        to:"azwar_anas",     type:"rekan",   label:"Gubernur Jatim-Mantan Bupati Banyuwangi; eks-tetangga",    strength:7 },
  { from:"khofifah",        to:"ipuk",           type:"rekan",   label:"Gubernur Jatim-Bupati Banyuwangi koordinasi regional",     strength:7 },
  { from:"eri_cahyadi",     to:"gus_muhdlor",    type:"rekan",   label:"Walikota Surabaya-Bupati Sidoarjo; tetangga kota",         strength:6 },
  { from:"gus_muhdlor",     to:"hasto",          type:"konflik", label:"OTT KPK 2024 — PDIP lewat Hasto terseret isu suap",        strength:5 },
  { from:"gus_muhdlor",     to:"nawawi",         type:"konflik", label:"OTT KPK — Gus Muhdlor tersangka KPK era Nawawi",           strength:8 },
  { from:"ipuk",            to:"puan",           type:"rekan",   label:"PDIP perempuan Jatim; Ipuk Bupati Banyuwangi-Puan DPR",   strength:6 },
  { from:"fandi_yani",      to:"airlangga",      type:"rekan",   label:"Golkar Jatim — Fandi Yani Bojonegoro koneksi Golkar",      strength:7 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH 20: National Cross-Links ───────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  { from:"hasto",           to:"prabowo",        type:"konflik", label:"PDIP oposisi — Hasto Sekjen PDIP berseberangan Prabowo",   strength:8 },
  { from:"mahfud_md",       to:"nawawi",         type:"rekan",   label:"Eks Menko Polhukam-Ketua KPK; koordinasi antikorupsi",     strength:7 },
  { from:"mahfud_md",       to:"hasto",          type:"rekan",   label:"PDIP eks mitra kampanye Ganjar-Mahfud 2024",               strength:7 },
  { from:"anwar_usman",     to:"suhartoyo",      type:"rekan",   label:"MK sesama hakim; Suhartoyo gantikan Anwar Usman 2023",     strength:6 },
  { from:"tom_lembong",     to:"sri_mulyani",    type:"konflik", label:"Eks menteri — rivalisasi kebijakan era Jokowi",             strength:5 },
  { from:"gatot_nurmantyo", to:"agus_subiyanto", type:"konflik", label:"Eks Panglima TNI vs Panglima baru; berbeda blok",          strength:4 },
  { from:"gatot_nurmantyo", to:"listyo_sigit",   type:"rekan",   label:"Eks pimpinan militer-Kapolri; jaringan keamanan nasional", strength:5 },
  { from:"budi_gunawan",    to:"hasto",          type:"rekan",   label:"BIN-PDIP era Jokowi; koordinasi intel-partai",             strength:7 },
  { from:"budi_gunawan",    to:"nawawi",         type:"konflik", label:"BIN-KPK historical tension; beda lembaga penegak hukum",   strength:7 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH 21: Sumatra Network ─────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  { from:"bobby_nasution",  to:"dedi_mulyadi",   type:"rekan",   label:"Gubernur baru KIM Plus sepantaran 2024",                   strength:5 },
  { from:"bobby_nasution",  to:"ahmad_luthfi",   type:"rekan",   label:"Gubernur baru KIM Plus sepantaran 2024",                   strength:5 },
  { from:"bobby_nasution",  to:"andra_soni",     type:"rekan",   label:"Gubernur baru KIM Plus sepantaran 2024",                   strength:5 },
  { from:"mahyeldi",        to:"cakimin",        type:"rekan",   label:"PKS-PKB pernah koalisi Sumbar; lintas partai Islam",       strength:5 },
  { from:"ansar_ahmad",     to:"prabowo",        type:"koalisi", label:"KIM Plus — Gubernur Kepri Golkar dukung Prabowo",          strength:7 },
  { from:"herman_deru",     to:"airlangga",      type:"rekan",   label:"NasDem-Golkar koordinasi Sumsel; rekan KIM Plus",          strength:7 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH 22: Kalimantan-Sulawesi Network ────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  { from:"rudy_masud",      to:"bahlil",         type:"rekan",   label:"Golkar Kaltim-Bahlil Ketum Golkar; IKN koordinasi",        strength:6 },
  { from:"agustiar_sabran", to:"airlangga",      type:"koalisi", label:"Golkar Kalteng — koalisi KIM Plus",                        strength:7 },
  { from:"zainal_arifin",   to:"airlangga",      type:"koalisi", label:"Golkar Kaltara — koordinasi partai",                       strength:7 },
  { from:"andi_sudirman",   to:"sjafrie",        type:"rekan",   label:"NasDem Sulsel-Menhan; koordinasi keamanan regional",       strength:5 },
  { from:"andi_sudirman",   to:"airlangga",      type:"rekan",   label:"KIM Plus Sulsel — Golkar-NasDem koordinasi",               strength:7 },
  { from:"andi_sumangerukka",to:"airlangga",     type:"koalisi", label:"KIM Plus Sultra — Gerindra-Golkar koordinasi",             strength:6 },
  { from:"gusnar_ismail",   to:"airlangga",      type:"koalisi", label:"Golkar Gorontalo — koordinasi partai KIM Plus",            strength:7 },
  { from:"lalu_iqbal",      to:"prabowo",        type:"koalisi", label:"NTB KIM Plus — Gubernur NTB dukung pemerintahan Prabowo",  strength:7 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH 23: Ormas Deeper Ties ──────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  { from:"gus_yahya",       to:"megawati",       type:"rekan",   label:"NU-PDIP kolaborasi historis; Gus Yahya-Megawati dialog",   strength:6 },
  { from:"gus_yahya",       to:"puan",           type:"rekan",   label:"PBNU-PDIP era; Gus Yahya-Puan pertemuan",                  strength:5 },
  { from:"gus_yahya",       to:"mahfud_md",      type:"rekan",   label:"NU-Menko era Jokowi; Gus Yahya-Mahfud dialog",             strength:7 },
  { from:"haedar_nashir",   to:"surya_paloh",    type:"rekan",   label:"Muhammadiyah-NasDem dialog publik",                        strength:4 },
  { from:"haedar_nashir",   to:"sri_mulyani",    type:"rekan",   label:"Muhammadiyah-Kemenkeu dialog kebijakan ekonomi",           strength:5 },
  { from:"said_iqbal",      to:"megawati",       type:"rekan",   label:"KSPI-PDIP — buruh dan partai tenaga kerja",                strength:6 },
  { from:"said_iqbal",      to:"hasto",          type:"rekan",   label:"KSPI-PDIP koordinasi — Said Iqbal dekat Sekjen PDIP",      strength:6 },
  { from:"anwar_abbas",     to:"megawati",       type:"rekan",   label:"MUI-PDIP dialog; Anwar Abbas-Megawati pertemuan",          strength:5 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH 24: Dynasty / Family Additional ────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  { from:"kaesang",         to:"jokowi",         type:"keluarga","label":"Anak-Bapak; Kaesang putra bungsu Jokowi",                strength:10 },
  { from:"kaesang",         to:"prabowo",        type:"koalisi", label:"PSI bergabung KIM Plus; Kaesang Ketum PSI dukung Prabowo", strength:7 },
  { from:"kaesang",         to:"airlangga",      type:"rekan",   label:"PSI-Golkar koalisi KIM Plus; Kaesang-Airlangga koordinasi",strength:6 },
  { from:"titiek_soeharto", to:"sby",            type:"rekan",   label:"Demokrat-Golkar lintas fraksi; Titiek anggota DPR",        strength:5 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH I: Academic/Technocrat Network ─────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════
  { from:"nawawi",          to:"hasto",          type:"konflik",  label:"KPK vs PDIP — Harun Masiku; Hasto tersangka obstruction of justice", strength:8 },
  { from:"anwar_usman",     to:"megawati",       type:"konflik",  label:"PDIP kritik keras putusan MK 90/2023 yang menguntungkan Gibran",     strength:7 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH J: Opposition Network ──────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════
  { from:"anies",           to:"mahfud_md",      type:"rekan",    label:"Sesama oposisi Prabowo; mantan capres-cawapres yang kalah 2024",      strength:6 },
  { from:"anies",           to:"ganjar",         type:"rekan",    label:"Sesama capres yang kalah Pilpres 2024",                               strength:5 },
  { from:"mahfud_md",       to:"listyo_sigit",   type:"rekan",    label:"Menko Polhukam-Kapolri koordinasi keamanan dan penegakan hukum",      strength:7 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH K: Religious/Civil Society ─────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════
  { from:"gus_yahya",       to:"anies",          type:"rekan",    label:"NU-Anies dialog pemilu 2024; basis massa Islam moderat",              strength:6 },
  { from:"haedar_nashir",   to:"mahfud_md",      type:"rekan",    label:"Muhammadiyah-eks Menko dialog kebijakan publik",                      strength:6 },
  { from:"said_iqbal",      to:"ganjar",         type:"rekan",    label:"KSPI-PDIP koalisi buruh; Said Iqbal dukung Ganjar 2024",              strength:6 },
  { from:"anwar_abbas",     to:"airlangga",      type:"rekan",    label:"MUI-Golkar dialog ekonomi syariah dan kebijakan",                     strength:5 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH L: Regional Cross-Links ────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════
  { from:"dedi_mulyadi",    to:"khofifah",       type:"rekan",    label:"Gubernur Jabar-Jatim; koordinasi antar-gubernur pulau Jawa",          strength:6 },
  { from:"dedi_mulyadi",    to:"pramono_anung",  type:"rekan",    label:"Gubernur Jabar-DKI; koordinasi Jabodetabek dan isu bersama",          strength:6 },
  { from:"ahmad_luthfi",    to:"khofifah",       type:"rekan",    label:"Gubernur Jateng-Jatim; tetangga provinsi, koordinasi regional",       strength:7 },
  { from:"ahmad_luthfi",    to:"dedi_mulyadi",   type:"rekan",    label:"Gubernur tiga provinsi besar Jawa; koordinasi nasional",              strength:6 },
  { from:"andra_soni",      to:"dedi_mulyadi",   type:"rekan",    label:"Gubernur Banten-Jabar; tetangga provinsi, isu bersama Jabodetabek",   strength:6 },
  { from:"bobby_nasution",  to:"muzakir_manaf",  type:"rekan",    label:"Gubernur Sumut-Aceh; tetangga provinsi Sumatera utara",               strength:5 },
  { from:"mahyeldi",        to:"muzakir_manaf",  type:"rekan",    label:"Gubernur Sumbar-Aceh; tetangga provinsi Sumatera barat-utara",        strength:5 },
  { from:"koster",          to:"mahyeldi",       type:"rekan",    label:"Gubernur Bali-Sumbar; pertemuan forum gubernur nasional",              strength:4 },
  { from:"sultan_hb10",     to:"koster",         type:"rekan",    label:"Gubernur DIY-Bali; dialog budaya dan pariwisata antar-gubernur",      strength:5 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH M: Business-Politics ────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════
  { from:"hary_tanoe",      to:"jokowi",         type:"rekan",    label:"MNC Group media relasi era Jokowi 2014-2024",                         strength:7 },
  { from:"hashim",          to:"jokowi",         type:"konflik",  label:"Bisnis tambang-Djojohadikusumo vs lingkaran PDIP era konflik",        strength:4 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH N: DPR Internal Ties ────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════
  { from:"puan",            to:"sufmi_dasco",    type:"rekan",    label:"Ketua DPR-Ketua Harian DPR; koordinasi lintas fraksi PDIP-Gerindra",  strength:6 },
  { from:"puan",            to:"cucun_syamsurijal", type:"rekan", label:"Ketua DPR-Wakil Ketua DPR lintas fraksi PDIP-PKB",                   strength:5 },
  { from:"meutya_hafid",    to:"habiburokhman",  type:"rekan",    label:"Sesama Golkar/Gerindra DPR; Komisi I-III lintas koordinasi",          strength:6 },
  { from:"sartono_hutomo",  to:"sufmi_dasco",    type:"rekan",    label:"Gerindra DPR; Sartono Ketua Komisi VI-Dasco Ketua Harian DPR",        strength:7 },
  { from:"utut_adianto",    to:"puan",           type:"koalisi",  label:"PDIP DPR — Utut Ketua Komisi II koordinasi dengan Puan Ketua DPR",    strength:7 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH O: Historical/Dynasty ──────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════
  { from:"soekarno",        to:"megawati",       type:"keluarga", label:"Ayah-Anak kandung; Soekarno Presiden RI ke-1, Megawati ke-5",         strength:10 },
  { from:"soekarno",        to:"guruh",          type:"keluarga", label:"Ayah-Anak kandung; Guruh putra bungsu Soekarno dari Fatmawati",       strength:10 },
  { from:"soekarno",        to:"prananda",       type:"keluarga", label:"Kakek-Cucu; Prananda cucu Soekarno melalui Megawati",                 strength:8  },
  { from:"sumitro",         to:"prabowo",        type:"keluarga", label:"Ayah-Anak kandung; Sumitro ekonom besar, Prabowo Presiden ke-8",      strength:10 },
  { from:"sumitro",         to:"hashim",         type:"keluarga", label:"Ayah-Anak kandung; Hashim pengusaha Arsari Group",                    strength:10 },
  { from:"prananda",        to:"puan",           type:"keluarga", label:"Kakak-Adik kandung; keduanya anak Megawati, kader PDIP",              strength:9  },
  { from:"prananda",        to:"megawati",       type:"keluarga", label:"Anak-Ibu; Prananda putra Megawati, pengelola digital PDIP",           strength:10 },
  { from:"guruh",           to:"megawati",       type:"keluarga", label:"Adik-Kakak kandung; keduanya anak Soekarno-Fatmawati",                strength:9  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH P: Extra Cross-Links (push to 400+) ─────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════
  { from:"prabowo",         to:"megawati",       type:"konflik",  label:"Rival Pilpres 2009 (Mega-Prabowo kalah), beda blok 2024",             strength:4 },
  { from:"anies",           to:"prabowo",        type:"konflik",  label:"Rival Pilpres 2024 — Anies kalah 24.95% vs Prabowo 58.59%",           strength:7 },
  { from:"ganjar",          to:"prabowo",        type:"konflik",  label:"Rival Pilpres 2024 — Ganjar kalah 16.47% vs Prabowo 58.59%",          strength:7 },
  { from:"zulhas",          to:"airlangga",      type:"rekan",    label:"PAN-Golkar KIM Plus; Zulhas-Airlangga koordinasi koalisi",            strength:6 },
  { from:"anwar_usman",     to:"prabowo",        type:"rekan",    label:"Putusan MK batas usia Cawapres membantu Gibran/Prabowo menang",        strength:5 },
  { from:"kaesang",         to:"megawati",       type:"konflik",  label:"PSI vs PDIP — Kaesang Ketum PSI berseberangan partai Megawati",       strength:3 },
  { from:"nawawi",          to:"listyo_sigit",   type:"rekan",    label:"KPK-Polri koordinasi penegakan hukum dan pemberantasan korupsi",      strength:6 },
  { from:"pramono_anung",   to:"hasto",          type:"rekan",    label:"PDIP — Gubernur DKI-Sekjen PDIP; koordinasi partai",                  strength:6 },
  { from:"khofifah",        to:"airlangga",      type:"rekan",    label:"Gubernur Jatim berkoalisi KIM Plus; Golkar-PKB koordinasi Jatim",     strength:6 },
  { from:"surya_paloh",     to:"megawati",       type:"mantan-koalisi", label:"NasDem-PDIP pernah berkoalisi; kini renggang pasca-split Anies", strength:5 },
  { from:"ganjar",          to:"jokowi",         type:"rekan",    label:"Eks-Gubernur Jateng didukung Jokowi; loyalis Jokowi dalam PDIP",      strength:7 },
  { from:"anies",           to:"sby",            type:"rekan",    label:"Sesama mantan pejabat; oposisi bersama pasca-Pilpres 2024",           strength:5 },
  { from:"dedi_mulyadi",    to:"cakimin",        type:"rekan",    label:"Gubernur Jabar-Ketum PKB; Jabar punya basis PKB besar",               strength:5 },
  { from:"ahmad_luthfi",    to:"cakimin",        type:"rekan",    label:"Gubernur Jateng-Ketum PKB; Jateng basis PKB signifikan",              strength:5 },
  { from:"ahmad_luthfi",    to:"airlangga",      type:"koalisi",  label:"KIM Plus Jateng; Gerindra-Golkar koalisi di Jawa Tengah",             strength:7 },
  { from:"andra_soni",      to:"airlangga",      type:"koalisi",  label:"KIM Plus Banten; Demokrat-Golkar koalisi di Banten",                  strength:6 },
  { from:"muzakir_manaf",   to:"airlangga",      type:"koalisi",  label:"KIM Plus Aceh; Gerindra-Golkar koordinasi di Aceh",                   strength:5 },
  { from:"khofifah",        to:"megawati",       type:"konflik",  label:"PKB vs PDIP Jatim 2024; persaingan basis massa dan gubernur",         strength:4 },
  { from:"mahfud_md",       to:"prabowo",        type:"konflik",  label:"Rival Pilpres 2024 — Ganjar-Mahfud kalah dari Prabowo",               strength:6 },
  { from:"nawawi",          to:"megawati",       type:"konflik",  label:"KPK vs PDIP-Megawati atas kasus Harun Masiku dan Hasto",              strength:7 },
  { from:"tom_lembong",     to:"prabowo",        type:"konflik",  label:"Ditangkap Kejagung era Prabowo — diduga kriminalisasi oposan",        strength:6 },
  { from:"jokowi",          to:"hasto",          type:"konflik",  label:"Jokowi vs PDIP; Hasto Sekjen yang menentang perpanjangan masa jabatan",strength:5 },
  { from:"anies",           to:"mahyeldi",       type:"rekan",    label:"PKS usung keduanya; Anies Capres, Mahyeldi Gubernur Sumbar PKS",      strength:5 },
  { from:"sri_mulyani",     to:"gibran",         type:"rekan",    label:"Menkeu-Wakil Presiden koordinasi fiskal kabinet Prabowo",             strength:7 },
  { from:"ahy",             to:"megawati",       type:"konflik",  label:"Demokrat-PDIP berseberangan; AHY pro-Prabowo, Mega oposisi",          strength:4 },
  { from:"basuki",          to:"airlangga",      type:"rekan",    label:"Kepala OIKN-Menko Ekonomi; koordinasi pembangunan IKN Nusantara",     strength:6 },
  { from:"prabowo",         to:"sby",            type:"rekan",    label:"Eks-rival Pilpres 2009; bersama lagi di kabinet-koalisi pasca-2024",  strength:5 },
  { from:"megawati",        to:"anies",          type:"konflik",  label:"PDIP tidak usung Anies; Megawati dukung Ganjar melawan Anies",        strength:5 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH Q: Fix 16 Isolated Persons ──────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  // faisol_riza — PKB DPR RI Jatim
  { from:"faisol_riza",          to:"cakimin",         type:"koalisi",        label:"PKB — Faisol Riza Anggota DPR RI Jatim, kader PKB",                  strength:8 },
  { from:"faisol_riza",          to:"khofifah",        type:"rekan",          label:"DPR RI Jatim — koordinasi dengan Gubernur Jatim",                    strength:5 },

  // lia_istifhama — DPD RI Jatim, non-partisan
  { from:"lia_istifhama",        to:"khofifah",        type:"rekan",          label:"DPD RI Jatim — koordinasi dengan Gubernur Jawa Timur",               strength:5 },
  { from:"lia_istifhama",        to:"puan",            type:"rekan",          label:"DPD RI-DPR RI — legislatif nasional lintas kamar",                   strength:4 },

  // imam_sugianto — Kapolda Jatim
  { from:"imam_sugianto",        to:"listyo_sigit",    type:"rekan",          label:"Kapolda Jatim bawahan langsung Kapolri Listyo Sigit",                strength:8 },
  { from:"imam_sugianto",        to:"khofifah",        type:"rekan",          label:"Kapolda Jatim — koordinasi keamanan dengan Gubernur Jatim",          strength:6 },

  // rudy_saladin — Pangdam V/Brawijaya
  { from:"rudy_saladin",         to:"agus_subiyanto",  type:"rekan",          label:"Pangdam V/Brawijaya bawahan langsung Panglima TNI",                  strength:8 },
  { from:"rudy_saladin",         to:"khofifah",        type:"rekan",          label:"Pangdam V/Brawijaya — koordinasi keamanan Gubernur Jatim",           strength:6 },

  // rendra_kresna — Mantan Bupati Malang, Golkar, terpidana
  { from:"rendra_kresna",        to:"airlangga",       type:"koalisi",        label:"Golkar — mantan Bupati Malang kader Golkar",                         strength:5 },
  { from:"rendra_kresna",        to:"khofifah",        type:"rekan",          label:"Mantan Bupati Malang era Gubernur Jatim Khofifah",                   strength:4 },

  // joko_suroto — Bupati Tulungagung, PDIP
  { from:"joko_suroto",          to:"megawati",        type:"koalisi",        label:"PDIP — Bupati Tulungagung kader PDIP",                               strength:6 },
  { from:"joko_suroto",          to:"khofifah",        type:"rekan",          label:"Bupati Tulungagung — koordinasi Gubernur Jatim",                     strength:5 },

  // wahid_cahyono — Bupati Probolinggo, PDIP
  { from:"wahid_cahyono",        to:"megawati",        type:"koalisi",        label:"PDIP — Bupati Probolinggo kader PDIP",                               strength:6 },
  { from:"wahid_cahyono",        to:"khofifah",        type:"rekan",          label:"Bupati Probolinggo — koordinasi Gubernur Jatim",                     strength:5 },

  // sandhika — Bupati Blitar, PDIP
  { from:"sandhika",             to:"megawati",        type:"koalisi",        label:"PDIP — Bupati Blitar kader PDIP; Blitar kandang PDIP historis",       strength:7 },
  { from:"sandhika",             to:"khofifah",        type:"rekan",          label:"Bupati Blitar — koordinasi Gubernur Jatim",                           strength:5 },

  // santoso_blitar — Walikota Blitar, PDIP
  { from:"santoso_blitar",       to:"megawati",        type:"koalisi",        label:"PDIP — Walikota Blitar kader PDIP; Blitar kota historis PDIP",        strength:7 },
  { from:"santoso_blitar",       to:"soekarno",        type:"rekan",          label:"Blitar kota kelahiran Soekarno; Walikota Blitar menjaga warisan Bung Karno", strength:6 },

  // budhabar — Bupati Nganjuk, PDIP
  { from:"budhabar",             to:"megawati",        type:"koalisi",        label:"PDIP — Bupati Nganjuk kader PDIP",                                   strength:6 },
  { from:"budhabar",             to:"khofifah",        type:"rekan",          label:"Bupati Nganjuk — koordinasi Gubernur Jatim",                         strength:5 },

  // hariyanto_bojonegoro — Bupati Bojonegoro, PDIP
  { from:"hariyanto_bojonegoro", to:"megawati",        type:"koalisi",        label:"PDIP — Bupati Bojonegoro kader PDIP",                                strength:6 },
  { from:"hariyanto_bojonegoro", to:"khofifah",        type:"rekan",          label:"Bupati Bojonegoro — koordinasi Gubernur Jatim",                      strength:5 },

  // dedy_magetan — Bupati Magetan, PDIP
  { from:"dedy_magetan",         to:"megawati",        type:"koalisi",        label:"PDIP — Bupati Magetan kader PDIP",                                   strength:6 },
  { from:"dedy_magetan",         to:"khofifah",        type:"rekan",          label:"Bupati Magetan — koordinasi Gubernur Jatim",                         strength:5 },

  // tri_sragen — Bupati Pacitan, PDIP
  { from:"tri_sragen",           to:"megawati",        type:"koalisi",        label:"PDIP — Bupati Pacitan kader PDIP; Pacitan kota asal SBY dikuasai PDIP", strength:6 },
  { from:"tri_sragen",           to:"sby",             type:"rekan",          label:"Pacitan kota asal SBY; PDIP berkuasa di kandang SBY",                strength:4 },

  // daryono_trenggalek — Bupati Trenggalek, PDIP
  { from:"daryono_trenggalek",   to:"megawati",        type:"koalisi",        label:"PDIP — Bupati Trenggalek kader PDIP, penerus Emil Dardak",           strength:6 },
  { from:"daryono_trenggalek",   to:"khofifah",        type:"rekan",          label:"Bupati Trenggalek — koordinasi Gubernur Jatim",                      strength:5 },

  // slamet_batu — Walikota Batu, PDIP
  { from:"slamet_batu",          to:"megawati",        type:"koalisi",        label:"PDIP — Walikota Batu kader PDIP",                                    strength:6 },
  { from:"slamet_batu",          to:"khofifah",        type:"rekan",          label:"Walikota Batu — koordinasi Gubernur Jatim",                          strength:5 },

  // bambang_haryo — DPR RI Gerindra Jatim
  { from:"bambang_haryo",        to:"prabowo",         type:"koalisi",        label:"Gerindra — Bambang Haryo DPR RI Jatim, loyalis Prabowo",             strength:7 },
  { from:"bambang_haryo",        to:"sufmi_dasco",     type:"koalisi",        label:"Gerindra DPR RI — kader Gerindra koordinasi Ketua Dewan",            strength:6 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH R: Institution Ties + Cross-Party Historical ────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  { from:"sri_mulyani",          to:"azwar_anas",      type:"rekan",          label:"Kemenkeu-KemenPAN koordinasi reformasi birokrasi dan fiskal",         strength:6 },
  { from:"basuki",               to:"sjafrie",         type:"rekan",          label:"OIKN-Kemhan koordinasi keamanan dan pertahanan IKN Nusantara",        strength:5 },
  { from:"meutya_hafid",         to:"agus_subiyanto",  type:"rekan",          label:"Kominfo-TNI koordinasi pertahanan siber dan komunikasi strategis",    strength:5 },
  { from:"nawawi",               to:"anwar_usman",     type:"konflik",        label:"KPK mengusut dugaan konflik kepentingan putusan MK Anwar Usman",      strength:6 },
  { from:"anies",                to:"jokowi",          type:"konflik",        label:"Jokowi copot Anies sebagai Gubernur DKI 2022 — perseteruan politik",  strength:7 },
  { from:"utut_adianto",         to:"jokowi",          type:"rekan",          label:"PDIP DPR — Utut Ketua Komisi II, loyalis Jokowi era kepemimpinan",   strength:7 },
  { from:"marwan_dasopang",      to:"prabowo",         type:"mantan-koalisi", label:"PKB bergabung KIM Plus 2024; Marwan Ketua Komisi VIII DPR",           strength:6 },
  { from:"cucun_syamsurijal",    to:"prabowo",         type:"koalisi",        label:"PKB KIM Plus — Cucun Wakil Ketua DPR dukung pemerintahan Prabowo",    strength:7 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH S: Extra Density — Jatim + National Network ────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  { from:"ipuk",                 to:"khofifah",        type:"rekan",          label:"Bupati Banyuwangi — koordinasi Gubernur Jatim",                      strength:5 },
  { from:"azwar_anas",           to:"khofifah",        type:"rekan",          label:"MenPAN-RB mantan Bupati Banyuwangi; jaringan Jatim bersama Khofifah", strength:6 },
  { from:"eri_cahyadi",          to:"jokowi",          type:"rekan",          label:"Walikota Surabaya PDIP — loyalis Jokowi di Jatim",                   strength:6 },
  { from:"habiburokhman",        to:"sufmi_dasco",     type:"koalisi",        label:"Gerindra DPR RI — Habiburokhman Komisi III, sesama loyalis Dasco",    strength:7 },
  { from:"prananda",             to:"hasto",           type:"rekan",          label:"PDIP internal — Prananda ketua tim digital, Hasto Sekjen koordinasi", strength:7 },
  { from:"gibran",               to:"prabowo",         type:"koalisi",        label:"Wakil Presiden — bersama dalam pasangan Pilpres 2024",                strength:10 },
  { from:"cakimin",              to:"prabowo",         type:"koalisi",        label:"PKB KIM Plus — Cak Imin dukung pemerintahan Prabowo",                 strength:7 },
  { from:"sby",                  to:"jokowi",          type:"konflik",        label:"Demokrat vs PDIP-Jokowi; SBY dan Demokrat berseberangan dengan Jokowi 2014-2019", strength:4 },
  { from:"hasto",                to:"nawawi",          type:"konflik",        label:"KPK vs PDIP — Hasto Kristiyanto ditetapkan tersangka oleh KPK Nawawi", strength:8 },
  { from:"puan",                 to:"jokowi",          type:"konflik",        label:"PDIP split — Puan-Megawati berseberangan dengan Jokowi pasca 2023",    strength:5 },
  { from:"erick_thohir",         to:"gibran",          type:"rekan",          label:"Sesama Kabinet Merah Putih; Erick Thohir Menkes, Gibran Wapres",       strength:6 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH BISNIS: Oligarch-Media-Politik + DPR-Instansi ──────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  { from:"hary_tanoe",   to:"airlangga",   type:"bisnis", label:"MNC Group — Golkar media relasi",                             strength:7 },
  { from:"hary_tanoe",   to:"prabowo",     type:"bisnis", label:"Perindo-KIM Plus — media mendukung pemerintah",               strength:7 },
  { from:"hary_tanoe",   to:"jokowi",      type:"bisnis", label:"MNC media relasi positif era Jokowi",                         strength:6 },
  { from:"erick_thohir", to:"prabowo",     type:"bisnis", label:"Tim Pemenangan 2024 → Menteri BUMN",                          strength:8 },
  { from:"erick_thohir", to:"jokowi",      type:"bisnis", label:"Ketua Tim Pemenangan Jokowi 2019",                            strength:9 },
  { from:"surya_paloh",  to:"anies",       type:"bisnis", label:"Metro TV — NasDem usung Anies; media dan politik",            strength:8 },
  { from:"surya_paloh",  to:"jokowi",      type:"bisnis", label:"Metro TV dukung Jokowi 2014-2019",                            strength:7 },
  { from:"airlangga",    to:"erick_thohir",type:"bisnis", label:"Koordinasi Golkar-BUMN kebijakan industri",                   strength:6 },
  { from:"bahlil",       to:"erick_thohir",type:"bisnis", label:"Menko Energi-Menteri BUMN koordinasi Danantara",              strength:7 },
  { from:"bahlil",       to:"prabowo",     type:"bisnis", label:"Konsesi tambang nikel — kontroversi izin usaha",              strength:7 },
  { from:"hary_tanoe",   to:"cakimin",     type:"bisnis", label:"MNC-PKB media pendukung koalisi",                             strength:5 },
  { from:"basuki",       to:"erick_thohir",type:"bisnis", label:"OIKN-BUMN koordinasi pembangunan IKN",                       strength:7 },
  { from:"sri_mulyani",  to:"airlangga",   type:"bisnis", label:"Kemenkeu-Menko Ekonomi — koordinasi APBN",                   strength:8 },
  { from:"erick_thohir", to:"bahlil",      type:"bisnis", label:"BUMN Energi — Danantara investasi sektor energi",             strength:7 },
  { from:"misbakhun",    to:"sri_mulyani", type:"bisnis", label:"Komisi XI DPR mengawasi Kemenkeu",                            strength:6 },
  { from:"habiburokhman",to:"yusril",      type:"bisnis", label:"Komisi III DPR mengawasi Kemenko Hukum",                      strength:6 },
  { from:"utut_adianto", to:"sjafrie",     type:"bisnis", label:"Komisi I DPR mengawasi Kemhan",                               strength:6 },
  { from:"surya_paloh",  to:"megawati",    type:"bisnis", label:"Metro TV — relasi NasDem-PDIP media coverage",                strength:5 },
  { from:"hary_tanoe",   to:"megawati",    type:"bisnis", label:"MNC terkait Perindo dalam konstelasi PDIP-KIM",               strength:4 },
  { from:"erick_thohir", to:"airlangga",   type:"bisnis", label:"BUMN-Golkar koordinasi kebijakan industri nasional",          strength:6 },
  { from:"sri_mulyani",  to:"erick_thohir",type:"bisnis", label:"Kemenkeu-BUMN koordinasi Danantara dan APBN",                 strength:7 },
  { from:"bahlil",       to:"airlangga",   type:"bisnis", label:"Golkar — Bahlil penerus kepemimpinan Golkar dari Airlangga",  strength:7 },
  { from:"hashim",       to:"jokowi",      type:"bisnis", label:"Jaringan bisnis Djojohadikusumo — relasi koalisi pemerintahan",strength:5 },
  { from:"sjafrie",      to:"prabowo",     type:"bisnis", label:"Jaringan TNI-bisnis pertahanan; Sjafrie Menhan di bawah Prabowo", strength:6 },
  { from:"agus_subiyanto",to:"prabowo",    type:"bisnis", label:"Panglima TNI di bawah kepresidenan Prabowo",                  strength:7 },
  { from:"surya_paloh",  to:"hary_tanoe",  type:"bisnis", label:"Sesama taipan media — koordinasi posisi media nasional",      strength:5 },
  { from:"tom_lembong",  to:"jokowi",      type:"bisnis", label:"Kepala BKPM era Jokowi 2015-2016",                            strength:7 },
  { from:"agus_gumiwang",to:"prabowo",     type:"bisnis", label:"Koordinasi Kemenperin-pemerintahan Prabowo",                  strength:6 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BATCH MENTOR-MURID: Patronase Politik & Dinasti ───────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  { from:"megawati",    to:"ganjar",        type:"mentor-murid", label:"PDIP — Megawati mengorbitkan Ganjar Capres 2024",      strength:9 },
  { from:"megawati",    to:"puan",          type:"mentor-murid", label:"PDIP — ibu-anak, Megawati pewaris kepemimpinan PDIP", strength:10 },
  { from:"jokowi",      to:"gibran",        type:"mentor-murid", label:"Ayah-anak, jalur politik Wali Kota→Wapres",           strength:10 },
  { from:"jokowi",      to:"bobby_nasution",type:"mentor-murid", label:"Mertua-menantu, jalur politik ke Gubernur Sumut",     strength:9 },
  { from:"jokowi",      to:"pramono_anung", type:"mentor-murid", label:"Jokowi dorong Pramono jadi Gubernur DKI",             strength:8 },
  { from:"sby",         to:"ahy",           type:"mentor-murid", label:"Ayah-anak, SBY bangun Demokrat untuk AHY",            strength:10 },
  { from:"prabowo",     to:"hashim",        type:"mentor-murid", label:"Kakak membimbing adik ke bisnis dan Gerindra",        strength:7 },
  { from:"prabowo",     to:"sufmi_dasco",   type:"mentor-murid", label:"Prabowo mengorbitkan Dasco jadi Ketua DPR",           strength:9 },
  { from:"prabowo",     to:"ahmad_muzani",  type:"mentor-murid", label:"Prabowo mengorbitkan Muzani jadi Ketua MPR",          strength:9 },
  { from:"airlangga",   to:"bahlil",        type:"mentor-murid", label:"Airlangga senior Golkar; Bahlil penerus Golkar",      strength:7 },
  { from:"mahfud_md",   to:"nawawi",        type:"mentor-murid", label:"Mahfud senior hukum; Nawawi eks bawahan di MK",       strength:6 },
  { from:"surya_paloh", to:"anies",         type:"mentor-murid", label:"NasDem mengorbitkan Anies Gubernur→Capres 2024",      strength:8 },
  { from:"khofifah",    to:"dedi_mulyadi",  type:"mentor-murid", label:"Senior gubernur — berbagi pengalaman tata kelola",    strength:5 },
  { from:"gus_yahya",   to:"cakimin",       type:"mentor-murid", label:"NU membimbing PKB — Gus Yahya pengaruhi basis PKB",   strength:7 },
  { from:"soekarno",    to:"megawati",      type:"mentor-murid", label:"Ayah-anak — warisan ideologi Marhaenisme ke Megawati",  strength:10 },
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
