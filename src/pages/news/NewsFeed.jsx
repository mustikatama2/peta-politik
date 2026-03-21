import { useState, useMemo } from 'react'
import { NEWS } from '../../data/news'
import NewsCard from '../../components/NewsCard'
import { SearchBar, PageHeader } from '../../components/ui'

const CATEGORIES = [
  { id: '', label: 'Semua' },
  { id: 'hukum', label: '⚖️ Hukum' },
  { id: 'eksekutif', label: '🏛️ Eksekutif' },
  { id: 'legislatif', label: '📜 Legislatif' },
  { id: 'pilkada', label: '🗳️ Pilkada' },
  { id: 'ekonomi', label: '💰 Ekonomi' },
]

const SENTIMENTS = [
  { id: '', label: 'Semua' },
  { id: 'positif', label: '🟢 Positif' },
  { id: 'negatif', label: '🔴 Negatif' },
  { id: 'netral', label: '⚪ Netral' },
]

export default function NewsFeed() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sentiment, setSentiment] = useState('')

  const filtered = useMemo(() => {
    let result = [...NEWS].sort((a, b) => new Date(b.date) - new Date(a.date))
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(n =>
        n.headline.toLowerCase().includes(q) ||
        n.summary?.toLowerCase().includes(q)
      )
    }
    if (category) result = result.filter(n => n.category === category)
    if (sentiment) result = result.filter(n => n.sentiment === sentiment)
    return result
  }, [search, category, sentiment])

  return (
    <div className="space-y-5">
      <PageHeader title="📰 Berita & Monitoring" subtitle={`${NEWS.length} artikel terpantau`} />

      {/* Search */}
      <SearchBar value={search} onChange={setSearch} placeholder="Cari judul berita..." />

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              category === c.id
                ? 'bg-accent-red text-white'
                : 'bg-bg-elevated text-text-secondary hover:text-text-primary border border-border'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Sentiment Filter */}
      <div className="flex flex-wrap gap-2">
        {SENTIMENTS.map(s => (
          <button
            key={s.id}
            onClick={() => setSentiment(s.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              sentiment === s.id
                ? 'bg-bg-elevated text-text-primary border border-text-secondary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-text-secondary">
        Menampilkan <span className="text-text-primary font-medium">{filtered.length}</span> dari{' '}
        <span className="text-text-primary font-medium">{NEWS.length}</span> berita
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-text-secondary">
          <div className="text-5xl mb-4">📰</div>
          <p className="font-medium">Tidak ada berita ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(article => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}
