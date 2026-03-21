import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { NEWS } from '../../data/news'
import { PERSONS } from '../../data/persons'
import { PARTY_MAP } from '../../data/parties'
import { NewsCardSkeleton } from '../../components/Skeleton'
import { fetchLiveNews, NEWS_SOURCES as API_SOURCES, REFRESH_INTERVAL_MS } from '../../lib/newsApi'

// Enrich NEWS_SOURCES with 'Semua' option at front
const NEWS_SOURCES = [
  { id: 'semua', name: 'Semua', color: null },
  ...API_SOURCES.filter(s => s.id !== 'semua').map(s => ({
    id: s.id,
    name: s.name,
    color: s.color || null,
  })),
]

const CATEGORIES = [
  { id: 'semua', label: 'Semua' },
  { id: 'politik', label: '🏛️ Politik' },
  { id: 'eksekutif', label: '🏛️ Eksekutif' },
  { id: 'legislatif', label: '📜 Legislatif' },
  { id: 'korupsi', label: '⚖️ Korupsi' },
  { id: 'hukum', label: '📋 Hukum' },
  { id: 'ekonomi', label: '💰 Ekonomi' },
  { id: 'keamanan', label: '🔒 Keamanan' },
  { id: 'pilkada', label: '🗳️ Pilkada' },
  { id: 'pemilu', label: '🗳️ Pemilu' },
]

// Convert static NEWS entries to the live article shape
function staticToLive(news) {
  return news.map(n => ({
    id: n.id,
    title: n.headline || n.title || '',
    url: n.url || '#',
    excerpt: n.summary || n.excerpt || '',
    date: n.date || new Date().toISOString(),
    source: n.source || 'Arsip',
    source_id: 'static',
    category: n.category || 'politik',
    sentiment: n.sentiment || 'netral',
    person_ids: n.person_ids || [],
    tags: n.tags || [],
  }))
}

// Format relative time in Indonesian
function relTime(dateStr) {
  try {
    const diff = Date.now() - new Date(dateStr).getTime()
    const min = Math.floor(diff / 60000)
    if (min < 1) return 'Baru saja'
    if (min < 60) return `${min} menit lalu`
    const hr = Math.floor(min / 60)
    if (hr < 24) return `${hr} jam lalu`
    const d = Math.floor(hr / 24)
    return `${d} hari lalu`
  } catch {
    return ''
  }
}

// Sentiment badge
function SentimentBadge({ s }) {
  const cfg = {
    positif: { label: '▲ Positif', cls: 'text-green-400 bg-green-400/10' },
    negatif: { label: '▼ Negatif', cls: 'text-red-400 bg-red-400/10' },
    netral:  { label: '● Netral',  cls: 'text-gray-400 bg-gray-400/10' },
  }
  const c = cfg[s] || cfg.netral
  return (
    <span className={`text-xs px-2 py-0.5 rounded font-medium ${c.cls}`}>
      {c.label}
    </span>
  )
}

// Source badge coloured by outlet
function SourceBadge({ sourceId, sourceName }) {
  const src = NEWS_SOURCES.find(s => s.id === sourceId)
  const color = src?.color || '#6B7280'
  return (
    <span
      className="text-xs font-bold px-2 py-0.5 rounded border"
      style={{ borderColor: color, color }}
    >
      {sourceName}
    </span>
  )
}

// Mini person pill linked to their profile
function PersonPill({ id }) {
  const p = PERSONS.find(x => x.id === id)
  if (!p) return null
  const party = PARTY_MAP[p.party_id]
  return (
    <Link
      to={`/persons/${id}`}
      onClick={e => e.stopPropagation()}
      className="text-xs px-2 py-0.5 rounded-full border border-border hover:border-accent-red transition-colors"
      style={{ borderColor: (party?.color || '#6B7280') + '60' }}
    >
      <span style={{ color: party?.color }}>●</span>{' '}
      {p.name.split(' ')[0]}
    </Link>
  )
}

// Article card — full or compact mode
function ArticleCard({ article, compact }) {
  const isLiveArticle = article.source_id !== 'static'

  if (compact) {
    return (
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex gap-3 p-3 rounded-lg border border-border hover:border-accent-red/50 hover:bg-bg-elevated transition-all group"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text-primary group-hover:text-accent-red line-clamp-2 transition-colors">
            {article.title}
          </p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs text-text-secondary">{relTime(article.date)}</span>
            <SourceBadge sourceId={article.source_id} sourceName={article.source} />
            {isLiveArticle && <span className="text-xs text-green-400">● LIVE</span>}
          </div>
        </div>
        <SentimentBadge s={article.sentiment} />
      </a>
    )
  }

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 rounded-xl border border-border bg-bg-card hover:border-accent-red/50 hover:bg-bg-elevated transition-all group"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent-red line-clamp-2 transition-colors leading-snug">
          {article.title}
        </h3>
        <SentimentBadge s={article.sentiment} />
      </div>
      {article.excerpt && (
        <p className="text-xs text-text-secondary line-clamp-2 mb-3">{article.excerpt}</p>
      )}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <SourceBadge sourceId={article.source_id} sourceName={article.source} />
          {isLiveArticle && (
            <span className="text-xs font-medium text-green-400">● LIVE</span>
          )}
          <span className="text-xs text-text-secondary">{relTime(article.date)}</span>
        </div>
        {article.person_ids?.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {article.person_ids.slice(0, 3).map(id => (
              <PersonPill key={id} id={id} />
            ))}
          </div>
        )}
      </div>
    </a>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function NewsFeed() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [isLive, setIsLive] = useState(false)
  const [fetchedAt, setFetchedAt] = useState(null)
  const [sourceStats, setSourceStats] = useState([])
  const [error, setError] = useState(null)

  // Filters
  const [category, setCategory] = useState('semua')
  const [source, setSource] = useState('semua')
  const [sentiment, setSentiment] = useState('semua')
  const [search, setSearch] = useState('')
  const [compact, setCompact] = useState(false)

  // Auto-refresh countdown
  const [nextRefresh, setNextRefresh] = useState(REFRESH_INTERVAL_MS)
  const refreshTimer = useRef(null)
  const countdownTimer = useRef(null)

  const loadNews = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchLiveNews({ limit: 100 })
      if (data && data.articles?.length > 0) {
        setArticles(data.articles)
        setIsLive(true)
        setFetchedAt(data.fetchedAt ? new Date(data.fetchedAt) : new Date())
        setSourceStats(data.sources || [])
      } else {
        setArticles(staticToLive(NEWS))
        setIsLive(false)
        setFetchedAt(new Date())
        setError('Menggunakan data arsip — API tidak tersedia')
      }
    } catch {
      setArticles(staticToLive(NEWS))
      setIsLive(false)
      setFetchedAt(new Date())
      setError('Fallback ke data statis')
    } finally {
      setLoading(false)
    }
    setNextRefresh(REFRESH_INTERVAL_MS)
  }, [])

  useEffect(() => {
    loadNews()
    refreshTimer.current = setInterval(loadNews, REFRESH_INTERVAL_MS)
    countdownTimer.current = setInterval(() => {
      setNextRefresh(prev => Math.max(0, prev - 1000))
    }, 1000)
    return () => {
      clearInterval(refreshTimer.current)
      clearInterval(countdownTimer.current)
    }
  }, [loadNews])

  // Client-side filtering
  const filtered = articles.filter(a => {
    if (category !== 'semua' && a.category !== category) return false
    if (source !== 'semua' && a.source_id !== source) return false
    if (sentiment !== 'semua' && a.sentiment !== sentiment) return false
    if (search) {
      const q = search.toLowerCase()
      if (
        !a.title.toLowerCase().includes(q) &&
        !a.excerpt?.toLowerCase().includes(q)
      )
        return false
    }
    return true
  })

  // Sentiment distribution across ALL articles (not filtered)
  const sentimentCounts = {
    positif: articles.filter(a => a.sentiment === 'positif').length,
    netral:  articles.filter(a => a.sentiment === 'netral').length,
    negatif: articles.filter(a => a.sentiment === 'negatif').length,
  }

  const nextRefreshMin = Math.floor(nextRefresh / 60000)
  const nextRefreshSec = Math.floor((nextRefresh % 60000) / 1000)

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* ── Bloomberg-style Header ──────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-text-primary">📡 Feed Berita Politik</h1>
              {isLive ? (
                <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/30">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-bold text-green-400">LIVE</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
                  <span className="text-xs font-bold text-amber-400">ARSIP</span>
                </span>
              )}
            </div>
            <p className="text-text-secondary text-sm">
              {fetchedAt
                ? `Diperbarui ${relTime(fetchedAt.toISOString())}`
                : 'Memuat...'}
              {isLive &&
                ` · Refresh dalam ${nextRefreshMin}:${String(nextRefreshSec).padStart(2, '0')}`}
              {' · '}
              {filtered.length} artikel
            </p>
            {error && (
              <p className="text-xs text-amber-400 mt-1">⚠️ {error}</p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={loadNews}
              className="px-3 py-1.5 text-xs rounded-lg border border-border hover:border-accent-red/50 text-text-secondary hover:text-text-primary transition-all"
            >
              🔄 Refresh
            </button>
            <button
              onClick={() => setCompact(v => !v)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                compact
                  ? 'border-accent-red text-accent-red'
                  : 'border-border text-text-secondary hover:border-accent-red/50'
              }`}
            >
              {compact ? '⊞ Kartu' : '☰ Kompak'}
            </button>
          </div>
        </div>

        {/* Sentiment filter pills with counts */}
        <div className="flex gap-3 mt-4 flex-wrap">
          {[
            {
              key: 'semua',
              label: `Semua (${articles.length})`,
              cls: 'border-border text-text-secondary',
            },
            {
              key: 'positif',
              label: `▲ Positif (${sentimentCounts.positif})`,
              cls: 'border-green-500/40 text-green-400',
            },
            {
              key: 'netral',
              label: `● Netral (${sentimentCounts.netral})`,
              cls: 'border-gray-500/40 text-gray-400',
            },
            {
              key: 'negatif',
              label: `▼ Negatif (${sentimentCounts.negatif})`,
              cls: 'border-red-500/40 text-red-400',
            },
          ].map(s => (
            <button
              key={s.key}
              onClick={() => setSentiment(s.key)}
              className={`px-3 py-1 text-xs rounded-full border font-medium transition-all ${s.cls} ${
                sentiment === s.key
                  ? 'bg-white/10 opacity-100'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Source status bar (only when live data available) ─────── */}
      {isLive && sourceStats.length > 0 && (
        <div className="mb-4 p-3 rounded-lg border border-border bg-bg-elevated">
          <p className="text-xs text-text-secondary mb-2">
            Status sumber ({sourceStats.filter(s => s.ok).length}/
            {sourceStats.length} aktif):
          </p>
          <div className="flex flex-wrap gap-2">
            {sourceStats.map(s => (
              <span
                key={s.id}
                className={`text-xs px-2 py-0.5 rounded border ${
                  s.ok
                    ? 'border-green-500/40 text-green-400'
                    : 'border-red-500/40 text-red-400 line-through'
                }`}
              >
                {s.ok ? '✓' : '✗'} {s.name} {s.ok ? `(${s.count})` : ''}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Filters ─────────────────────────────────────────────────── */}
      <div className="mb-4 space-y-3">
        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Cari berita..."
          className="w-full px-4 py-2.5 rounded-lg border border-border bg-bg-elevated text-text-primary text-sm placeholder-text-secondary/50 focus:outline-none focus:border-accent-red/50"
        />

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`px-3 py-1 text-xs rounded-full border transition-all ${
                category === c.id
                  ? 'border-accent-red text-accent-red bg-accent-red/10'
                  : 'border-border text-text-secondary hover:border-accent-red/50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Source filter */}
        <div className="flex gap-2 flex-wrap">
          {NEWS_SOURCES.map(s => (
            <button
              key={s.id}
              onClick={() => setSource(s.id)}
              className={`px-3 py-1 text-xs rounded-full border transition-all font-medium ${
                source === s.id ? 'opacity-100' : 'opacity-50 hover:opacity-80'
              }`}
              style={
                s.color
                  ? {
                      borderColor: s.color + '80',
                      color: source === s.id ? s.color : undefined,
                    }
                  : {
                      borderColor: 'var(--border)',
                      color: 'var(--text-secondary)',
                    }
              }
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Article Grid ─────────────────────────────────────────────── */}
      {loading ? (
        <div
          className={
            compact ? 'space-y-2' : 'grid grid-cols-1 md:grid-cols-2 gap-4'
          }
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-text-secondary">
          <p className="text-4xl mb-3">📰</p>
          <p className="text-lg font-medium">Tidak ada berita ditemukan</p>
          <p className="text-sm mt-1">Coba ubah filter atau refresh feed</p>
        </div>
      ) : (
        <div
          className={
            compact
              ? 'space-y-1.5'
              : 'grid grid-cols-1 md:grid-cols-2 gap-3'
          }
        >
          {filtered.map(article => (
            <ArticleCard
              key={article.id}
              article={article}
              compact={compact}
            />
          ))}
        </div>
      )}
    </div>
  )
}
