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
    ],
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
    urls: ['https://www.jpnn.com/rss/news', 'https://www.jpnn.com/feed'],
    bias: 'tengah',
  },
  {
    id: 'suara',
    name: 'Suara.com',
    urls: ['https://www.suara.com/rss', 'https://www.suara.com/feed/nasional.rss'],
    bias: 'tengah',
  },
  {
    id: 'merdeka',
    name: 'Merdeka',
    urls: ['https://merdeka.com/feeds/rss.xml', 'https://www.merdeka.com/rss/peristiwa.xml'],
    bias: 'tengah',
  },
  {
    id: 'rmol',
    name: 'RMOL',
    urls: ['https://rmol.id/rss/nasional', 'https://rmol.id/feed'],
    bias: 'kritis',
  },
];

// Person name → ID index (hardcoded key names from persons.js data)
// These are the most newsworthy persons — map their searchable names
const PERSON_NAME_INDEX = {
  'prabowo': 'prabowo',
  'prabowo subianto': 'prabowo',
  'gibran': 'gibran',
  'gibran rakabuming': 'gibran',
  'jokowi': 'jokowi',
  'joko widodo': 'jokowi',
  'sri mulyani': 'sri_mulyani',
  'megawati': 'megawati',
  'airlangga': 'airlangga',
  'airlangga hartarto': 'airlangga',
  'anies': 'anies',
  'anies baswedan': 'anies',
  'hasto': 'hasto',
  'hasto kristiyanto': 'hasto',
  'mahfud': 'mahfud_md',
  'mahfud md': 'mahfud_md',
  // 'puan' removed — too short, matches "perempuan"; keep full name only
  'puan maharani': 'puan',
  // 'cak imin' removed — keep full name only
  'muhaimin': 'cakimin',
  'muhaimin iskandar': 'cakimin',
  'ganjar': 'ganjar',
  'ganjar pranowo': 'ganjar',
  'bahlil': 'bahlil',
  'bahlil lahadalia': 'bahlil',
  'erick thohir': 'erick_thohir',
  'erick': 'erick_thohir',
  // 'ahy' removed — too short; keep full names only
  'agus yudhoyono': 'ahy',
  'agus harimurti': 'ahy',
  'zulhas': 'zulhas',
  'zulkifli hasan': 'zulhas',
  'surya paloh': 'surya_paloh',
  'khofifah': 'khofifah',
  'khofifah indar': 'khofifah',
  'dedi mulyadi': 'dedi_mulyadi',
  'bobby nasution': 'bobby_nasution',
  'ridwan kamil': 'ridwan_kamil',
  'pramono': 'pramono_anung',
  'pramono anung': 'pramono_anung',
  'yusril': 'yusril',
  'budi gunawan': 'budi_gunawan',
  'budi arie': 'budi_arie',
  'meutya': 'meutya_hafid',
  'meutya hafid': 'meutya_hafid',
  'luhut': 'luhut',
  'luhut binsar': 'luhut',
  'luhut pandjaitan': 'luhut',
  'sjafrie': 'sjafrie',
  'listyo': 'listyo_sigit',
  'listyo sigit': 'listyo_sigit',
  'kaesang': 'kaesang',
  'hashim': 'hashim',
  'hashim djojohadikusumo': 'hashim',
  'nawawi': 'nawawi',
  'nawawi pomolango': 'nawawi',
  'ketua kpk': 'nawawi',
  'tom lembong': 'tom_lembong',
  'anwar usman': 'anwar_usman',
  'habiburokhman': 'habiburokhman',
  'hary tanoe': 'hary_tanoe',
  'gus yahya': 'gus_yahya',
  'ahmad luthfi': 'ahmad_luthfi',
  'andra soni': 'andra_soni',
  // 'sby' removed — keep full name only
  'susilo bambang yudhoyono': 'sby',
  // New politician names
  'agus subiyanto': 'agus_subiyanto',
  'panglima tni': 'agus_subiyanto',
  'misbakhun': 'misbakhun',
  'titiek soeharto': 'titiek_soeharto',
  'basuki hadimuljono': 'basuki',
  'muzakir manaf': 'muzakir_manaf',
  'andre rosiade': null,
  'budisatrio': null,
  'dandhy laksono': null,
  // institution tags — not persons
  'kpk': null,
  'pdip': null,
  'gerindra': null,
  'golkar': null,
};

// Fetch a list of URLs, returning first that returns valid RSS XML (contains <item>)
async function fetchWithFallback(urls, opts = {}) {
  for (const url of urls) {
    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 6000);
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
  while ((match = itemRe.exec(xml)) !== null && idx < 15) {
    const item = match[1];
    const title = getTag(item, 'title');
    const link = getTag(item, 'link') || getTag(item, 'guid');
    const description = getTag(item, 'description').replace(/<[^>]+>/g, '').slice(0, 300);
    const pubDate = getTag(item, 'pubDate') || getTag(item, 'dc:date') || '';

    if (!title || !link) { idx++; continue; }

    // Auto-tag with person IDs using improved tagger
    const fullText = title + ' ' + description;
    const person_ids = tagPersons(fullText);

    // Detect sentiment from keywords
    const textLower = fullText.toLowerCase();
    const negWords = ['korupsi','ditangkap','tersangka','ditahan','divonis','pecat','mundur','demo','protes','tolak','gagal','turun','kecam','kritik','skandal'];
    const posWords = ['berhasil','sukses','naik','terpilih','apresiasi','mendukung','menyetujui','pertumbuhan','meningkat'];
    const negScore = negWords.filter(w => textLower.includes(w)).length;
    const posScore = posWords.filter(w => textLower.includes(w)).length;
    const sentiment = negScore > posScore ? 'negatif' : posScore > negScore ? 'positif' : 'netral';

    // Detect category
    let cat = 'politik';
    if (textLower.match(/korupsi|kpk|kejagung|tipikor/))             cat = 'korupsi';
    else if (textLower.match(/ekonomi|apbn|pajak|inflasi|rupiah|harga/)) cat = 'ekonomi';
    else if (textLower.match(/militer|tni|polri|keamanan|bom|teroris/))  cat = 'keamanan';
    else if (textLower.match(/pemilu|pilkada|pilpres|suara|kpu/))        cat = 'pemilu';
    else if (textLower.match(/hukum|mk|ma|mahkamah|pengadilan|vonis/))   cat = 'hukum';

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
      tags: [sourceName.toLowerCase(), cat],
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

  const { person_id, category, source, limit = 60, q } = req.query || {};

  const fetchHeaders = {
    'User-Agent': 'Mozilla/5.0 (compatible; PetaPolitikBot/1.0)',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*',
    'Referer': 'https://www.google.com/',
  };

  // Fetch all RSS feeds in parallel, each with fallback URLs
  const results = await Promise.allSettled(
    RSS_SOURCES.map(async (src) => {
      try {
        const result = await fetchWithFallback(src.urls, { headers: fetchHeaders });
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
