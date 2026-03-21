// api/news.js — Vercel Serverless Function
// Fetches Indonesian political RSS feeds, parses, tags with person IDs
// Supports query params: ?person_id=X&category=Y&source=Z&limit=60&q=search

const RSS_SOURCES = [
  {
    id: 'kompas',
    name: 'Kompas',
    urls: [
      'https://rss.kompas.com/nasional/berita/nasional',
      'https://rss.kompas.com/news/politik',
      'https://indeks.kompas.com/?site=nasional&format=rss',
      'https://rss.kompas.com/nasional',
      'https://news.kompas.com/nasional/rss',
      'https://www.kompas.com/rss/nasional.xml',
      'https://rss.kompas.com/index.xml',
      'https://kompas.com/rss/nasional',
    ],
    headers: {
      'Accept': 'text/xml, application/xml, application/rss+xml, */*',
      'Accept-Language': 'id-ID,id;q=0.9',
      'Cache-Control': 'no-cache',
    },
    bias: 'tengah',
  },
  {
    id: 'tempo',
    name: 'Tempo',
    urls: ['https://rss.tempo.co/nasional'],
    bias: 'kritis',
  },
  {
    id: 'antara',
    name: 'ANTARA',
    urls: ['https://www.antaranews.com/rss/terkini.xml'],
    bias: 'pemerintah',
  },
  {
    id: 'detik',
    name: 'Detik',
    urls: [
      'https://rss.detik.com/index.php/detikcom/news/news',
      'https://news.detik.com/rss',
      'https://feed.detik.com/index.php/detikcom/news/news/politik',
    ],
    bias: 'tengah',
  },
  {
    id: 'cnn',
    name: 'CNN Indonesia',
    urls: ['https://www.cnnindonesia.com/nasional/rss'],
    bias: 'tengah',
  },
  {
    id: 'republika',
    name: 'Republika',
    urls: ['https://www.republika.co.id/rss/berita/nasional'],
    bias: 'konservatif',
  },
  {
    id: 'tribun',
    name: 'Tribun',
    urls: [
      'https://www.tribunnews.com/rss',
      'https://nasional.tribunnews.com/rss',
      'https://www.tribunnews.com/nasional/feed',
    ],
    bias: 'tengah',
  },
  {
    id: 'jpnn',
    name: 'JPNN',
    urls: [
      'https://www.jpnn.com/rss',
      'https://www.jpnn.com/rss/news',
      'https://www.jpnn.com/feed',
      'https://www.jpnn.com/feed/nasional',
      'https://jpnn.com/rss',
    ],
    bias: 'tengah',
  },
  {
    id: 'suara',
    name: 'Suara.com',
    urls: [
      'https://www.suara.com/rss',
      'https://www.suara.com/feed/nasional.rss',
      'https://suara.com/rss',
      'https://www.suara.com/feed',
      'https://www.suara.com/nasional/feed.rss',
    ],
    bias: 'tengah',
  },
  {
    id: 'merdeka',
    name: 'Merdeka',
    urls: [
      'https://merdeka.com/feeds/rss.xml',
      'https://www.merdeka.com/rss/peristiwa.xml',
      'https://merdeka.com/rss.xml',
      'https://rss.merdeka.com/',
    ],
    bias: 'tengah',
  },
  {
    id: 'rmol',
    name: 'RMOL',
    urls: ['https://www.rmol.id/rss', 'https://rmol.id/rss/nasional', 'https://rmol.id/feed'],
    bias: 'kritis',
  },
  {
    id: 'kumparan',
    name: 'Kumparan',
    urls: [
      'https://kumparan.com/feed/nasional',
      'https://kumparan.com/kumparannews/rss',
      'https://kumparan.com/feed',
    ],
    bias: 'tengah',
  },
  {
    id: 'okezone',
    name: 'Okezone',
    urls: [
      'https://news.okezone.com/rss/nasional.xml',
      'https://okezone.com/rss/nasional',
      'https://news.okezone.com/feed',
    ],
    bias: 'tengah',
  },
  {
    id: 'inews',
    name: 'iNews',
    urls: [
      'https://www.inews.id/feed/nasional',
      'https://inews.id/rss/nasional',
      'https://www.inews.id/rss',
    ],
    bias: 'tengah',
  },
  {
    id: 'tirto',
    name: 'Tirto.id',
    urls: [
      'https://tirto.id/rss',
      'https://tirto.id/feed',
      'https://tirto.id/rss/politik',
    ],
    bias: 'kritis',
  },
  {
    id: 'katadata',
    name: 'Katadata',
    urls: [
      'https://katadata.co.id/rss',
      'https://katadata.co.id/feed',
      'https://katadata.co.id/rss/nasional',
    ],
    bias: 'tengah',
  },
];

// Person name → ID index (hardcoded key names from persons.js data)
// These are the most newsworthy persons — map their searchable names
const PERSON_NAME_INDEX = {
  // ── PRESIDEN / WAPRES ─────────────────────────────────────────────
  'prabowo': 'prabowo',
  'prabowo subianto': 'prabowo',
  'presiden prabowo': 'prabowo',
  'gibran': 'gibran',
  'gibran rakabuming': 'gibran',
  'wapres gibran': 'gibran',

  // ── MANTAN PRESIDEN ───────────────────────────────────────────────
  'jokowi': 'jokowi',
  'joko widodo': 'jokowi',
  'presiden jokowi': 'jokowi',
  'soekarno': 'soekarno',
  'bung karno': 'soekarno',
  'ir soekarno': 'soekarno',
  'susilo bambang yudhoyono': 'sby',
  'presiden sby': 'sby',
  'megawati': 'megawati',
  'megawati soekarnoputri': 'megawati',
  'bu mega': 'megawati',

  // ── MENKO / MENTERI ───────────────────────────────────────────────
  'sri mulyani': 'sri_mulyani',
  'menkeu': 'sri_mulyani',
  'menteri keuangan sri mulyani': 'sri_mulyani',
  'airlangga': 'airlangga',
  'airlangga hartarto': 'airlangga',
  'menko ekonomi': 'airlangga',
  'bahlil': 'bahlil',
  'bahlil lahadalia': 'bahlil',
  'menko energi': 'bahlil',
  'yusril': 'yusril',
  'yusril ihza mahendra': 'yusril',
  'menko hukum': 'yusril',
  'budi gunawan': 'budi_gunawan',
  'menko polkam': 'budi_gunawan',
  'sjafrie': 'sjafrie',
  'sjafrie sjamsoeddin': 'sjafrie',
  'menhan': 'sjafrie',
  'menteri pertahanan': 'sjafrie',
  'agus gumiwang': 'agus_gumiwang',
  'menteri perindustrian': 'agus_gumiwang',
  'erick thohir': 'erick_thohir',
  'menteri bumn': 'erick_thohir',
  'sugiono': 'sugiono',
  'menlu': 'sugiono',
  'menteri luar negeri': 'sugiono',
  'meutya hafid': 'meutya_hafid',
  'menkominfo': 'meutya_hafid',
  'menteri komunikasi': 'meutya_hafid',
  'zulkifli hasan': 'zulhas',
  'zulhas': 'zulhas',
  'menko pangan': 'zulhas',
  'agus harimurti yudhoyono': 'ahy',
  'agus harimurti': 'ahy',
  'ahy': 'ahy',
  'menko infrastruktur': 'ahy',
  'azwar anas': 'azwar_anas',
  'menpan rb': 'azwar_anas',
  'budi arie': 'budi_arie',
  'menkop': 'budi_arie',
  'menteri koperasi': 'budi_arie',
  'basuki hadimuljono': 'basuki',
  'kepala oikn': 'basuki',
  'basuki': 'basuki',
  'hashim': 'hashim',
  'hashim djojohadikusumo': 'hashim',
  'supratman': 'supratman',
  'supratman andi agtas': 'supratman',
  'menkumham': 'supratman',
  'hanafi rais': 'hanafi_rais',
  'ketua pan': 'hanafi_rais',

  // ── KAPOLRI / TNI / KPK / MA ──────────────────────────────────────
  'listyo sigit': 'listyo_sigit',
  'listyo sigit prabowo': 'listyo_sigit',
  'kapolri': 'listyo_sigit',
  'agus subiyanto': 'agus_subiyanto',
  'panglima tni': 'agus_subiyanto',
  'nawawi': 'nawawi',
  'nawawi pomolango': 'nawawi',
  'ketua kpk': 'nawawi',
  'kepala bin': 'budi_gunawan',
  'anwar usman': 'anwar_usman',
  'mantan ketua mk': 'anwar_usman',
  'suhartoyo': 'suhartoyo',
  'ketua mk': 'suhartoyo',
  'sunarto': 'sunarto',
  'ketua ma': 'sunarto',

  // ── PARTAI / DPR / MPR ───────────────────────────────────────────
  'puan maharani': 'puan',
  'ketua dpr': 'puan',
  'sufmi dasco': 'sufmi_dasco',
  'dasco': 'sufmi_dasco',
  'wakil ketua dpr': 'sufmi_dasco',
  'ahmad muzani': 'ahmad_muzani',
  'ketua mpr': 'ahmad_muzani',
  'muzani': 'ahmad_muzani',
  'sultan najamudin': 'sultan_najamudin',
  'cucun syamsurijal': 'cucun_syamsurijal',
  'cucun': 'cucun_syamsurijal',
  'sartono': 'sartono_hutomo',
  'sartono hutomo': 'sartono_hutomo',
  'habiburokhman': 'habiburokhman',
  'ketua komisi iii': 'habiburokhman',
  'utut adianto': 'utut_adianto',
  'misbakhun': 'misbakhun',
  'ketua komisi xi': 'misbakhun',
  'titiek soeharto': 'titiek_soeharto',
  'titiek': 'titiek_soeharto',
  'marwan dasopang': 'marwan_dasopang',
  'hary tanoe': 'hary_tanoe',
  'hary tanoesoedibjo': 'hary_tanoe',

  // ── KETUM PARTAI ─────────────────────────────────────────────────
  'surya paloh': 'surya_paloh',
  'ketua umum nasdem': 'surya_paloh',
  'ahmad syaikhu': 'ahmad_syaikhu',
  'ketua umum pks': 'ahmad_syaikhu',
  'muhaimin iskandar': 'cakimin',
  'muhaimin': 'cakimin',
  'ketua umum pkb': 'cakimin',
  'cak imin': 'cakimin',

  // ── OPOSISI / CAPRES ─────────────────────────────────────────────
  'anies baswedan': 'anies',
  'anies': 'anies',
  'ganjar pranowo': 'ganjar',
  'ganjar': 'ganjar',
  'mahfud md': 'mahfud_md',
  'mahfud': 'mahfud_md',
  'prof mahfud': 'mahfud_md',
  'hasto kristiyanto': 'hasto',
  'hasto': 'hasto',
  'sekjen pdip': 'hasto',
  'tom lembong': 'tom_lembong',
  'thomas lembong': 'tom_lembong',
  'gatot nurmantyo': 'gatot_nurmantyo',
  'gatot': 'gatot_nurmantyo',

  // ── GUBERNUR ─────────────────────────────────────────────────────
  'khofifah': 'khofifah',
  'khofifah indar parawansa': 'khofifah',
  'gubernur jatim': 'khofifah',
  'dedi mulyadi': 'dedi_mulyadi',
  'gubernur jabar': 'dedi_mulyadi',
  'ahmad luthfi': 'ahmad_luthfi',
  'gubernur jateng': 'ahmad_luthfi',
  'pramono anung': 'pramono_anung',
  'gubernur dki': 'pramono_anung',
  'pramono': 'pramono_anung',
  'bobby nasution': 'bobby_nasution',
  'gubernur sumut': 'bobby_nasution',
  'ridwan kamil': 'ridwan_kamil',
  'kang emil': 'ridwan_kamil',
  'andra soni': 'andra_soni',
  'gubernur banten': 'andra_soni',
  'muzakir manaf': 'muzakir_manaf',
  'gubernur aceh': 'muzakir_manaf',
  'mahyeldi': 'mahyeldi',
  'gubernur sumbar': 'mahyeldi',
  'koster': 'koster',
  'gubernur bali': 'koster',
  'lalu iqbal': 'lalu_iqbal',
  'gubernur ntb': 'lalu_iqbal',
  'sultan hamengkubuwono': 'sultan_hb10',
  'sri sultan': 'sultan_hb10',
  'gubernur diy': 'sultan_hb10',

  // ── DINASTI / KELUARGA ───────────────────────────────────────────
  'kaesang': 'kaesang',
  'kaesang pangarep': 'kaesang',
  'ketua umum psi': 'kaesang',
  'prananda': 'prananda',
  'prananda prabowo': 'prananda',
  'guruh': 'guruh',
  'guruh soekarnoputra': 'guruh',
  'sumitro': 'sumitro',
  'sumitro djojohadikusumo': 'sumitro',

  // ── ORMAS ────────────────────────────────────────────────────────
  'gus yahya': 'gus_yahya',
  'yahya cholil': 'gus_yahya',
  'ketua umum pbnu': 'gus_yahya',
  'haedar nashir': 'haedar_nashir',
  'ketua umum muhammadiyah': 'haedar_nashir',
  'said iqbal': 'said_iqbal',
  'anwar abbas': 'anwar_abbas',

  // ── NULL (institution/party tags — for filtering only) ───────────
  'luhut': null,
  'luhut binsar': null,
  'luhut pandjaitan': null,
  'menperin': null,
  'kpk': null,
  'pdip': null,
  'gerindra': null,
  'golkar': null,
  'pkb': null,
  'nasdem': null,
  'pks': null,
  'demokrat': null,
  'pan': null,
};

// Topics → maps to article tags/subtopics
// Used for: (a) relevance filtering, (b) richer article.tags
const TOPIC_KEYWORDS = {
  // ── POLITIK NASIONAL ─────────────────────────────────────────────
  'kabinet': 'kabinet',
  'kabinet merah putih': 'kabinet',
  'reshuffle': 'kabinet',
  'dpr': 'legislatif',
  'mpr': 'legislatif',
  'dprd': 'legislatif',
  'fraksi': 'legislatif',
  'rancangan undang': 'legislatif',
  'undang-undang': 'legislatif',
  'omnibus': 'legislatif',
  'oposisi': 'oposisi',
  'koalisi': 'koalisi',
  'kim plus': 'koalisi',
  'koalisi indonesia maju': 'koalisi',
  'pilkada': 'pemilu',
  'pilpres': 'pemilu',
  'pemilihan umum': 'pemilu',
  'pemilu': 'pemilu',
  'kpu': 'pemilu',
  'bawaslu': 'pemilu',
  'paslon': 'pemilu',
  'capres': 'pemilu',
  'cawapres': 'pemilu',
  'elektabilitas': 'pemilu',
  'survei politik': 'pemilu',
  // ── HUKUM & KORUPSI ──────────────────────────────────────────────
  'tipikor': 'korupsi',
  'kejaksaan agung': 'korupsi',
  'tersangka': 'korupsi',
  'terdakwa': 'korupsi',
  'terpidana': 'korupsi',
  'korupsi': 'korupsi',
  'suap': 'korupsi',
  'gratifikasi': 'korupsi',
  'pencucian uang': 'korupsi',
  'ott kpk': 'korupsi',
  'operasi tangkap tangan': 'korupsi',
  'lhkpn': 'korupsi',
  'mahkamah konstitusi': 'hukum',
  'mahkamah agung': 'hukum',
  'putusan mk': 'hukum',
  'hakim': 'hukum',
  'vonis': 'hukum',
  'persidangan': 'hukum',
  'polri': 'hukum',
  // ── EKONOMI & KEUANGAN ───────────────────────────────────────────
  'apbn': 'ekonomi',
  'apbd': 'ekonomi',
  'anggaran': 'ekonomi',
  'efisiensi anggaran': 'ekonomi',
  'inflasi': 'ekonomi',
  'rupiah': 'ekonomi',
  'pajak': 'ekonomi',
  'pajak pertambahan nilai': 'ekonomi',
  'ppn': 'ekonomi',
  'bea cukai': 'ekonomi',
  'investasi': 'ekonomi',
  'bkpm': 'ekonomi',
  'bumn': 'ekonomi',
  'danantara': 'ekonomi',
  'sovereign wealth fund': 'ekonomi',
  'pertamina': 'ekonomi',
  'pln': 'ekonomi',
  'hilirisasi': 'ekonomi',
  'nikel': 'ekonomi',
  'batu bara': 'ekonomi',
  'sawit': 'ekonomi',
  'ekspor': 'ekonomi',
  'impor': 'ekonomi',
  'subsidi': 'ekonomi',
  'bbm': 'ekonomi',
  'pertalite': 'ekonomi',
  // ── MILITER & KEAMANAN ───────────────────────────────────────────
  'tni': 'keamanan',
  'panglima': 'keamanan',
  'kopassus': 'keamanan',
  'densus 88': 'keamanan',
  'teroris': 'keamanan',
  'terorisme': 'keamanan',
  'separatis': 'keamanan',
  'papua': 'keamanan',
  'kkb': 'keamanan',
  'ksad': 'keamanan',
  'ksal': 'keamanan',
  'ksau': 'keamanan',
  // ── SOSIAL & KEBIJAKAN ───────────────────────────────────────────
  'makan bergizi gratis': 'sosial',
  'mbg': 'sosial',
  'program makan': 'sosial',
  'bansos': 'sosial',
  'pkh': 'sosial',
  'stunting': 'sosial',
  'kemiskinan': 'sosial',
  'pengangguran': 'sosial',
  'umk': 'sosial',
  'ump': 'sosial',
  'upah minimum': 'sosial',
  'buruh': 'sosial',
  'guru': 'sosial',
  'pppk': 'sosial',
  'asn': 'sosial',
  // ── INFRASTRUKTUR & TATA RUANG ──────────────────────────────────
  'ikn': 'infrastruktur',
  'ibu kota nusantara': 'infrastruktur',
  'nusantara': 'infrastruktur',
  'oikn': 'infrastruktur',
  'tol': 'infrastruktur',
  'kereta cepat': 'infrastruktur',
  'mrt': 'infrastruktur',
  'lrt': 'infrastruktur',
  'bandara': 'infrastruktur',
  'pelabuhan': 'infrastruktur',
  // ── MEDIA & DIGITAL ──────────────────────────────────────────────
  'judi online': 'media',
  'judol': 'media',
  'kominfo': 'media',
  'komdigi': 'media',
  'siaran pers': 'media',
  'hoaks': 'media',
  'disinformasi': 'media',
  'medsos': 'media',
  'pinjol': 'media',
  // ── LINGKUNGAN ───────────────────────────────────────────────────
  'kebakaran hutan': 'lingkungan',
  'deforestasi': 'lingkungan',
  'reklamasi': 'lingkungan',
  'tambang ilegal': 'lingkungan',
  'amdal': 'lingkungan',
  'perubahan iklim': 'lingkungan',
  // ── TAMBAHAN KEYWORD POLITIK ─────────────────────────────────────
  'omnibus law': 'legislatif',
  'perppu': 'legislatif',
  'amandemen': 'legislatif',
  'pilkada serentak': 'pemilu',
  'money politics': 'pemilu',
  'serangan fajar': 'pemilu',
  'bansos': 'sosial',
  'dana desa': 'sosial',
  'oligarki': 'politik',
  'dinasti': 'politik',
  'reshuffle kabinet': 'kabinet',
  'paripurna': 'legislatif',
  'interpelasi': 'legislatif',
  'hak angket': 'legislatif',
  'pemakzulan': 'hukum',
  'pengadilan tipikor': 'korupsi',
  'polda': 'keamanan',
  'polres': 'keamanan',
};

// Minimum political keywords required to consider article relevant
const MIN_POLITICAL_KEYWORDS = 1;

// Fetch a list of URLs, returning first that returns valid RSS XML (contains <item>)
async function fetchWithFallback(urls, opts = {}) {
  for (const url of urls) {
    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 10000);
      const r = await fetch(url, { ...opts, signal: controller.signal });
      clearTimeout(t);
      if (r.ok) {
        const text = await r.text();
        if (text.includes('<item>')) return { url, text };
      }
    } catch (e) {
      /* try next URL */
    }
  }
  return null;
}

// Simple CDATA-aware XML text extractor
function getTag(xml, tag) {
  const re = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([\\s\\S]*?))<\\/${tag}>`, 'i');
  const m = re.exec(xml);
  if (!m) return '';
  return (m[1] || m[2] || '').trim();
}

// Improved person tagger: uses word-boundary regex, skips short single-word names
function tagPersons(text) {
  const found = [];
  for (const [name, id] of Object.entries(PERSON_NAME_INDEX)) {
    if (!id) continue;
    // Skip short single-word names (< 5 chars) — too many false positives
    if (name.split(' ').length === 1 && name.length < 5) continue;
    const re = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (re.test(text) && !found.includes(id)) {
      found.push(id);
    }
  }
  return found;
}

// Parse RSS XML into article array (max 15 items per source)
function parseRSS(xml, sourceId, sourceName) {
  const articles = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  let idx = 0;
  while ((match = itemRe.exec(xml)) !== null && idx < 20) {
    const item = match[1];
    const title = getTag(item, 'title');
    const link = getTag(item, 'link') || getTag(item, 'guid');
    const description = getTag(item, 'description').replace(/<[^>]+>/g, '').slice(0, 300);
    const pubDate = getTag(item, 'pubDate') || getTag(item, 'dc:date') || '';

    if (!title || !link) { idx++; continue; }

    // Auto-tag with person IDs using improved tagger
    const fullText = title + ' ' + description;
    const person_ids = tagPersons(fullText);

    // Tag with topic keywords
    const topicTags = [];
    const topicCategories = new Set();
    for (const [keyword, topicCat] of Object.entries(TOPIC_KEYWORDS)) {
      const re = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (re.test(fullText)) {
        topicTags.push(keyword);
        topicCategories.add(topicCat);
      }
    }

    // Determine primary category (priority order)
    let cat = 'politik';
    if (topicCategories.has('korupsi'))            cat = 'korupsi';
    else if (topicCategories.has('pemilu'))        cat = 'pemilu';
    else if (topicCategories.has('hukum'))         cat = 'hukum';
    else if (topicCategories.has('ekonomi'))       cat = 'ekonomi';
    else if (topicCategories.has('keamanan'))      cat = 'keamanan';
    else if (topicCategories.has('sosial'))        cat = 'sosial';
    else if (topicCategories.has('infrastruktur')) cat = 'infrastruktur';
    else if (topicCategories.has('media'))         cat = 'media';
    else if (topicCategories.has('lingkungan'))    cat = 'lingkungan';

    // Broader political relevance check
    const POLITICAL_SIGNAL_WORDS = [
      'pemerintah','presiden','menteri','gubernur','bupati','walikota',
      'dpr','mpr','dprd','partai','politik','kebijakan','peraturan',
      'undang-undang','anggaran','apbn','korupsi','kpk','pemilu',
      'kabinet','senator','parlemen','legislatif','eksekutif',
      'negara','republik','indonesia','nasional','daerah',
    ];
    const textLower = fullText.toLowerCase();
    const hasPoliticalSignal = POLITICAL_SIGNAL_WORDS.some(w => textLower.includes(w));
    // Relevance filter: skip article if no person_ids AND no topic keywords AND no signal words
    const hasPoliticalContent = person_ids.length > 0 || topicTags.length > 0 || hasPoliticalSignal;
    if (!hasPoliticalContent) {
      idx++;
      continue; // skip non-political articles (traffic, crime, sports, etc.)
    }

    // Enhanced sentiment (40+ keywords each direction)
    const negWords = [
      'korupsi','ditangkap','tersangka','ditahan','divonis','pecat','mundur',
      'demo','protes','tolak','gagal','turun','kecam','kritik','skandal',
      'suap','gratifikasi','bocor','kebocoran','manipulasi','penipuan',
      'ott','operasi tangkap tangan','terdakwa','terpidana','dipenjara',
      'dipecat','dicopot','dihukum','dihentikan',
      'runtuh','ambruk','anjlok','merosot','terpuruk','krisis',
      'pelanggaran','penyimpangan','penyalahgunaan','abuse',
      'intimidasi','ancaman','kekerasan','konflik','bentrokan',
    ];
    const posWords = [
      'berhasil','sukses','naik','terpilih','apresiasi','mendukung',
      'menyetujui','pertumbuhan','meningkat','positif','baik',
      'tumbuh','bangkit','pulih','membaik','optimis','harapan',
      'prestasi','penghargaan','award','pencapaian','rekor',
      'dilantik','diluncurkan','diresmikan','disepakati','ditandatangani',
      'kerjasama','kolaborasi','sinergi','inovasi','terobosan',
      'melesat','melonjak','rebound','surplus','untung',
    ];
    const negScore = negWords.filter(w => textLower.includes(w)).length;
    const posScore = posWords.filter(w => textLower.includes(w)).length;
    const sentiment = negScore > posScore ? 'negatif' : posScore > negScore ? 'positif' : 'netral';

    articles.push({
      id: `${sourceId}_${idx}_${Date.now()}`,
      title,
      url: link.startsWith('http') ? link : `https://${link}`,
      excerpt: description,
      date: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
      source: sourceName,
      source_id: sourceId,
      category: cat,
      sentiment,
      person_ids,
      tags: [...new Set([sourceName.toLowerCase(), cat, ...topicTags.slice(0, 5)])],
      topic_categories: [...topicCategories],
    });
    idx++;
  }
  return articles;
}

export default async function handler(req, res) {
  // Allow CORS just in case
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // Cache at Vercel edge for 15 minutes
  res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=1800');

  const { person_id, category, source, limit = 60, q, topic } = req.query || {};

  const fetchHeaders = {
    'User-Agent': 'Mozilla/5.0 (compatible; PetaPolitikBot/1.0)',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*',
    'Referer': 'https://www.google.com/',
  };

  // Fetch all RSS feeds in parallel, each with fallback URLs
  const results = await Promise.allSettled(
    RSS_SOURCES.map(async (src) => {
      try {
        const srcHeaders = src.headers ? { ...fetchHeaders, ...src.headers } : fetchHeaders;
        const result = await fetchWithFallback(src.urls, { headers: srcHeaders });
        if (!result) return { source: src, articles: [], error: 'all URLs failed' };
        return { source: src, articles: parseRSS(result.text, src.id, src.name) };
      } catch (e) {
        return { source: src, articles: [], error: e.message };
      }
    })
  );

  // Flatten and sort by date (newest first)
  let articles = results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value.articles);

  articles.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Apply filters
  if (person_id) {
    articles = articles.filter(a => a.person_ids.includes(person_id));
  }
  if (category && category !== 'semua') {
    articles = articles.filter(a => a.category === category);
  }
  if (source && source !== 'semua') {
    articles = articles.filter(a => a.source_id === source);
  }

  // Topic filter
  if (topic && topic !== 'semua') {
    articles = articles.filter(a => a.topic_categories?.includes(topic));
  }

  // Text search filter
  if (q) {
    const searchLower = q.toLowerCase();
    articles = articles.filter(a =>
      a.title.toLowerCase().includes(searchLower) ||
      a.excerpt.toLowerCase().includes(searchLower)
    );
  }

  // Deduplicate by title prefix (simple, handles cross-source reposts)
  const seen = new Set();
  articles = articles.filter(a => {
    const key = a.title.toLowerCase().slice(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const sources_status = results.map((r, i) => ({
    id: RSS_SOURCES[i].id,
    name: RSS_SOURCES[i].name,
    bias: RSS_SOURCES[i].bias,
    ok: r.status === 'fulfilled' && !r.value.error,
    count: r.status === 'fulfilled' ? r.value.articles.length : 0,
    error: r.status === 'fulfilled' ? (r.value.error || null) : r.reason?.message,
  }));

  return res.json({
    articles: articles.slice(0, parseInt(limit)),
    total: articles.length,
    sources: sources_status,
    fetchedAt: new Date().toISOString(),
    cached: false,
  });
}
