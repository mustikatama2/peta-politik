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
