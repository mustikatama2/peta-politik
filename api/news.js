// api/news.js — Vercel Serverless Function
// Fetches Indonesian political RSS feeds, parses, tags with person IDs
// Supports query params: ?person_id=X&category=Y&source=Z&limit=60

const RSS_SOURCES = [
  { id: 'kompas',    name: 'Kompas',          url: 'https://rss.kompas.com/news/politik',                              bias: 'tengah' },
  { id: 'tempo',     name: 'Tempo',           url: 'https://rss.tempo.co/nasional',                                    bias: 'kritis' },
  { id: 'antara',    name: 'ANTARA',          url: 'https://www.antaranews.com/rss/terkini.xml',                        bias: 'pemerintah' },
  { id: 'detik',     name: 'Detik',           url: 'https://feed.detik.com/index.php/detikcom/news/news/politik',       bias: 'tengah' },
  { id: 'cnn',       name: 'CNN Indonesia',   url: 'https://www.cnnindonesia.com/nasional/rss',                         bias: 'tengah' },
  { id: 'republika', name: 'Republika',       url: 'https://www.republika.co.id/rss/berita/nasional',                  bias: 'konservatif' },
  { id: 'tribun',    name: 'Tribun',          url: 'https://www.tribunnews.com/nasional/feed',                          bias: 'tengah' },
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
  'puan': 'puan',
  'puan maharani': 'puan',
  'cak imin': 'cakimin',
  'muhaimin': 'cakimin',
  'ganjar': 'ganjar',
  'ganjar pranowo': 'ganjar',
  'bahlil': 'bahlil',
  'bahlil lahadalia': 'bahlil',
  'erick thohir': 'erick_thohir',
  'erick': 'erick_thohir',
  'ahy': 'ahy',
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
  'luhut': 'luhut', // frequently mentioned even if not in persons.js
  'sjafrie': 'sjafrie',
  'listyo': 'listyo_sigit',
  'listyo sigit': 'listyo_sigit',
  'kaesang': 'kaesang',
  'hashim': 'hashim',
  'nawawi': 'nawawi',
  'tom lembong': 'tom_lembong',
  'anwar usman': 'anwar_usman',
  'habiburokhman': 'habiburokhman',
  'hary tanoe': 'hary_tanoe',
  'gus yahya': 'gus_yahya',
  'ahmad luthfi': 'ahmad_luthfi',
  'andra soni': 'andra_soni',
  'kpk': null,      // institution tag, not person
  'pdip': null,
  'gerindra': null,
  'golkar': null,
};

// Simple CDATA-aware XML text extractor
function getTag(xml, tag) {
  const re = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([\\s\\S]*?))<\\/${tag}>`, 'i');
  const m = re.exec(xml);
  if (!m) return '';
  return (m[1] || m[2] || '').trim();
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

    // Auto-tag with person IDs
    const textLower = (title + ' ' + description).toLowerCase();
    const person_ids = [];
    for (const [name, id] of Object.entries(PERSON_NAME_INDEX)) {
      if (id && textLower.includes(name)) {
        if (!person_ids.includes(id)) person_ids.push(id);
      }
    }

    // Detect sentiment from keywords
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

  const { person_id, category, source, limit = 60 } = req.query || {};

  // Fetch all RSS feeds in parallel with 8s timeout each
  const results = await Promise.allSettled(
    RSS_SOURCES.map(async (src) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      try {
        const resp = await fetch(src.url, {
          signal: controller.signal,
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PetaPolitikBot/1.0)' },
        });
        clearTimeout(timeout);
        if (!resp.ok) return { source: src, articles: [] };
        const xml = await resp.text();
        return { source: src, articles: parseRSS(xml, src.id, src.name) };
      } catch (e) {
        clearTimeout(timeout);
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
