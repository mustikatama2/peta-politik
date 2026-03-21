# PetaPolitik — Phase 2 Roadmap
*Planned features for full accountability platform*

---

## 🎯 PHASE 2 FEATURES (Priority Order)

### 1. "Jalur Korupsi" — Corruption Flow Visualizer
A Sankey diagram showing how corruption money flows:
- Who authorized the budget (politician) → to which project → to which contractor → back to whom
- Seed with known cases: Jiwasraya, ASABRI, e-KTP, Hambalang
- For each KPK case: show the network of accused persons

### 2. "Kekayaan vs Gaji" — Wealth Explainer
For each official:
```
Jabatan: Bupati Sidoarjo
Gaji + tunjangan (official): ~Rp 12 juta/bulan
Total in 5 years: ~Rp 720 juta
LHKPN before: Rp X
LHKPN after: Rp Y
Unexplained increase: Rp Z (highlight in red if > 2x salary)
```
This is forensic accounting made visual. Powerful accountability tool.

### 3. "Berapa Derajat?" — Shortest Path Finder
Enter any two politicians → show shortest connection path
Example: "Prabowo ↔ Hanindhito?"
= Prabowo → Jokowi → Pramono Anung → Hanindhito (3 derajat)

Uses BFS/Dijkstra on the connections graph.

### 4. Dynasty Family Tree
Visual SVG family tree per political family:
- Soekarno → Megawati → Puan → (next generation?)
- Jokowi → Gibran → Kaesang
- SBY → AHY
- Fuad Amin → Ra Abd Latif (Bangkalan)

### 5. Real-Time News Integration (RSS + Supabase)
Supabase Edge Function (cron every 15 min):
```javascript
// Fetch from these RSS feeds:
const FEEDS = [
  'https://rss.tempo.co/nasional',
  'https://rss.kompas.com/nasional', 
  'https://news.detik.com/rss',
  'https://www.antaranews.com/rss/nasional.rss',
  'https://tirto.id/rss',
  'https://icw.or.id/feed',
]
// Parse articles → NLP tag persons mentioned → store in news_articles table
// Tag: match person names in article text against persons table
// Sentiment: simple positive/negative keyword scoring
```

### 6. "Siapa Pemilik Media" — Media Ownership Map
Who owns which media and their political connections:
- MNC Group (RCTI, Global TV, MNC TV, Okezone) → Hary Tanoesoedibjo → Perindo (Prabowo coalition)
- Trans Corp (Trans TV, CNN Indonesia) → Chairul Tanjung → PAN-adjacent
- Emtek (SCTV, Indosiar) → Sariaatmadja family → relatively neutral
- Kompas Gramedia → Jakob Oetama legacy → editorial independence maintained
- tvOne → Bakrie Group/ARB → Golkar-adjacent
- MetroTV → Surya Paloh → NasDem (founded NasDem, now Prabowo coalition)
- Jawa Pos → Dahlan Iskan legacy, now multiple owners

### 7. LHKPN API Integration
KPK provides elhkpn.kpk.go.id search API:
- Endpoint: https://elhkpn.kpk.go.id/portal/user/search_pn?search={name}
- Returns: LHKPN submission history, total wealth
- Plan: Supabase cron to check LHKPN for all tracked persons annually
- Compare year-over-year changes → flag unusual increases

### 8. KPU Election Results API
KPU provides open data:
- infopemilu.kpu.go.id has district-level election results
- Can get Pilpres 2024 results by kabupaten → overlay on regional map
- See: where did Jatim vote Prabowo vs Anies vs Ganjar by kabupaten?

### 9. Agenda Fulfillment Scoring
For each politician with > 12 months in office:
- List their campaign promises (from visi-misi documents)
- Assign status: Janji/Proses/Selesai/Ingkar/Batal
- Calculate "fulfillment rate" as percentage
- Compare across politicians of same tier
- Source: Jokowi's promises tracked by Janji Politik (janjipolitik.com)

### 10. "Waspada Dynasty" Alert System
Auto-flag when:
- A family member of a sitting official runs for election in same region
- A sitting official's company wins a government tender
- A person replaces a family member in the same position

### 11. Comparative Analysis Tool
Side-by-side comparison of any two politicians:
- Wealth trajectory
- Corruption risk
- Policy alignment score
- Career overlap (were they in same institution?)
- Network overlap (mutual connections)

### 12. Admin Data Management Panel
/admin route (separate password):
- Add/edit persons, parties, connections
- Upload photos to Supabase Storage
- Bulk import from CSV
- Approve/reject suggested edits (future crowdsourcing)

---

## 🗄️ SUPABASE SETUP GUIDE

Once Supabase credentials are available:

```bash
# 1. Create project at supabase.com
# 2. Copy URL and anon key to Vercel env vars:
#    VITE_SUPABASE_URL=https://xxx.supabase.co
#    VITE_SUPABASE_ANON_KEY=eyJhbGci...

# 3. Run schema:
psql $DATABASE_URL < supabase/schema.sql

# 4. Run seed:
psql $DATABASE_URL < supabase/seed.sql

# 5. Enable realtime for news_articles table in Supabase dashboard

# 6. Set up Edge Functions for RSS news fetching
supabase functions deploy fetch-news
supabase functions deploy sync-lhkpn
```

### Supabase Storage Buckets Needed:
- `person-photos` (public) — politician photos
- `party-logos` (public) — party logos
- `documents` (private) — LHKPN PDF uploads, legal documents

### Row Level Security (RLS):
```sql
-- Public can read everything
CREATE POLICY "public_read" ON persons FOR SELECT USING (true);
-- Only authenticated users can write
CREATE POLICY "auth_write" ON persons FOR ALL USING (auth.role() = 'authenticated');
```

---

## 📱 MOBILE CONSIDERATIONS

The platform should work well on mobile for rakyat access:
- Bottom navigation bar on mobile (<768px)
- PersonCard should be swipeable (swipe left = share, swipe right = save)
- Network graph: simplified on mobile (list view instead of D3)
- News feed: card stack, swipe to dismiss
- All tables: horizontal scroll with sticky first column

---

## 🤖 AI FEATURES (Future with AI API)

### "Tanya Politik" — NL Query Interface
"Siapa Gubernur Jawa Timur?"
"Berapa kekayaan Prabowo?"
"Siapa yang terlibat kasus korupsi di Jatim?"
→ AI searches the database and returns structured answer

### Auto-generated Political Summaries
For each person: "Generate a 3-paragraph balanced analysis of {person.name} based on their LHKPN, track record, connections, and public record"

### Trend Analysis
"What patterns emerge from corruption cases in Jatim over the last 10 years?"

### Connection Inference
"Based on known connections, who is likely to support {politician} in the 2029 election?"

---

## 🔐 DATA GOVERNANCE

For a platform about accountability, we must ourselves be accountable:

1. **Source citations required** for all controversy entries
2. **Clear distinction** between allegation (tersangka) and conviction (terpidana)
3. **Last updated** timestamp on all profiles
4. **"Report an error"** button on every profile page
5. **Data confidence scores** — how verified is this data?
   - ✅ KPK official record
   - 📰 News source (Tempo/Kompas/etc)
   - 📚 Wikipedia/academic
   - 🔍 Research note (needs verification)
6. **GDPR-equivalent**: private individuals not tracked; only public officials

---
*Phase 2 target: Q2 2026*
