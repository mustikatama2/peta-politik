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

const SORT_OPTIONS = [
  { id: 'newest', label: 'Terbaru' },
  { id: 'oldest', label: 'Terlama' },
  { id: 'relevant', label: 'Paling Relevan' },
]

const CATEGORY_STATS = [
  { id: 'politik', label: '📊 Politik', match: ['politik'] },
  { id: 'hukum', label: '⚖️ Hukum', match: ['hukum'] },
  { id: 'ekonomi', label: '💰 Ekonomi', match: ['ekonomi'] },
  { id: 'pilkada', label: '🗳️ Pemilu', match: ['pilkada', 'pemilu'] },
  { id: 'eksekutif', label: '🌐 Eksekutif', match: ['eksekutif', 'legislatif'] },
]

export default function NewsFeed() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sentiment, setSentiment] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('card') // 'card' | 'compact'

  // Compute category counts from NEWS data
  const categoryCounts = useMemo(() => NEWS.reduce((acc, n) => {
    acc[n.category] = (acc[n.category] || 0) + 1
    return acc
  }, {}), [])

  const filtered = useMemo(() => {
    let result = [...NEWS]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(n =>
        n.headline.toLowerCase().includes(q) ||
        n.summary?.toLowerCase().includes(q)
      )
    }
    if (category) result = result.filter(n => n.category === category)
    if (sentiment) result = result.filter(n => n.sentiment === sentiment)

    // Sort
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.date) - new Date(a.date))
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.date) - new Date(b.date))
    } else if (sortBy === 'relevant') {
      // Sort by category match (same category first), then by date
      result.sort((a, b) => {
        if (category) {
          if (a.category === category && b.category !== category) return -1
          if (b.category === category && a.category !== category) return 1
        }
        return new Date(b.date) - new Date(a.date)
      })
    }
    return result
  }, [search, category, sentiment, sortBy])

  return (
    <div className="space-y-5">
      <PageHeader title="📰 Berita & Monitoring" subtitle={`${NEWS.length} artikel terpantau`} />

      {/* Category stats bar */}
      <div className="flex flex-wrap gap-2 pb-1">
        {CATEGORY_STATS.map(cs => {
          const count = cs.match.reduce((sum, m) => sum + (categoryCounts[m] || 0), 0)
          if (count === 0) return null
          return (
            <span
              key={cs.id}
              className="px-3 py-1 bg-bg-elevated border border-border rounded-full text-xs text-text-secondary cursor-pointer hover:text-text-primary hover:border-text-secondary transition-colors"
              onClick={() => setCategory(cs.match[0])}
            >
              {cs.label} <span className="font-semibold text-text-primary">({count})</span>
            </span>
          )
        })}
      </div>

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

      {/* Sentiment Filter + Sort + View Toggle */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Sentiment */}
        <div className="flex gap-1.5">
          {SENTIMENTS.map(s => (
            <button
              key={s.id}
              onClick={() => setSentiment(s.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                sentiment === s.id
                  ? 'bg-bg-elevated text-text-primary border-text-secondary'
                  : 'text-text-secondary hover:text-text-primary border-transparent'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Sort */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-text-muted">Urut:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="text-xs bg-bg-elevated border border-border rounded-lg px-2 py-1.5 text-text-primary focus:outline-none focus:border-accent-red"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* View toggle */}
        <div className="flex gap-1 bg-bg-elevated border border-border rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('card')}
            title="Card view"
            className={`px-2 py-1 rounded text-sm transition-colors ${
              viewMode === 'card'
                ? 'bg-bg-card text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            ⊞
          </button>
          <button
            onClick={() => setViewMode('compact')}
            title="Compact view"
            className={`px-2 py-1 rounded text-sm transition-colors ${
              viewMode === 'compact'
                ? 'bg-bg-card text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            ☰
          </button>
        </div>
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
      ) : viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(article => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        /* Compact list view */
        <div className="bg-bg-card border border-border rounded-xl divide-y divide-border">
          {filtered.map(article => (
            <div key={article.id} className="flex items-center gap-3 px-4 py-3 hover:bg-bg-elevated transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary line-clamp-1">{article.headline}</p>
                <p className="text-xs text-text-secondary mt-0.5">{article.source}</p>
              </div>
              <div className="flex-shrink-0 flex items-center gap-2">
                {article.category && (
                  <span className="text-xs bg-bg-elevated border border-border px-2 py-0.5 rounded-full text-text-secondary hidden sm:block">
                    {article.category}
                  </span>
                )}
                <span className="text-xs text-text-muted whitespace-nowrap">{article.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
