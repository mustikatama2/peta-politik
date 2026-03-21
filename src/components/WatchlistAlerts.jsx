// src/components/WatchlistAlerts.jsx
// Watchlist alert banner — shows recent news matching user's watchlist

import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { fetchLiveNews, REFRESH_INTERVAL_MS } from '../lib/newsApi'
import { PERSONS } from '../data/persons'
import { PARTY_MAP } from '../data/parties'

const DISMISS_KEY = 'peta_watchlist_alerts_dismissed'
const WATCHLIST_KEY = 'peta_watchlist'

function getWatchlist() {
  try {
    return JSON.parse(localStorage.getItem(WATCHLIST_KEY) || '[]')
  } catch {
    return []
  }
}

function isDismissed() {
  return sessionStorage.getItem(DISMISS_KEY) === '1'
}

function formatRelativeTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'baru saja'
  if (diffMin < 60) return `${diffMin} mnt lalu`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr} jam lalu`
  const diffDay = Math.floor(diffHr / 24)
  return `${diffDay} hari lalu`
}

export default function WatchlistAlerts() {
  const [watchlist, setWatchlist] = useState(() => getWatchlist())
  const [matchedArticles, setMatchedArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [dismissed, setDismissed] = useState(() => isDismissed())
  const [hasLoaded, setHasLoaded] = useState(false)

  const fetchAlerts = useCallback(async () => {
    const wl = getWatchlist()
    setWatchlist(wl)
    if (wl.length === 0) return

    setLoading(true)
    const data = await fetchLiveNews({ limit: 100 })
    setLoading(false)
    setHasLoaded(true)

    if (!data?.articles) return

    const wlSet = new Set(wl)
    const matched = data.articles
      .filter(article => (article.person_ids || []).some(id => wlSet.has(id)))
      .slice(0, 5)
    setMatchedArticles(matched)
  }, [])

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, REFRESH_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [fetchAlerts])

  // Nothing to show if no watchlist items
  if (watchlist.length === 0) return null

  // Dismissed for this session
  if (dismissed) return null

  // Still loading first fetch
  if (!hasLoaded && loading) return null

  // No matches after loading
  if (hasLoaded && matchedArticles.length === 0) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-card border border-border text-sm text-text-secondary">
        <span className="text-base flex-shrink-0">🔕</span>
        <span>Tidak ada berita terbaru untuk pantauan Anda</span>
        <span className="ml-auto text-xs text-text-muted">{watchlist.length} tokoh dipantau</span>
      </div>
    )
  }

  if (matchedArticles.length === 0) return null

  return (
    <div className="rounded-xl bg-yellow-900/20 border border-yellow-600/40 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-yellow-600/30">
        <div className="flex items-center gap-2">
          <span className="text-base">🔔</span>
          <span className="text-sm font-bold text-yellow-300">Berita Terkini — Pantauan Anda</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            {matchedArticles.length} artikel
          </span>
        </div>
        <button
          onClick={() => {
            sessionStorage.setItem(DISMISS_KEY, '1')
            setDismissed(true)
          }}
          className="text-yellow-500/60 hover:text-yellow-300 transition-colors text-xl leading-none px-1"
          title="Tutup"
        >
          ×
        </button>
      </div>

      {/* Articles */}
      <div className="divide-y divide-yellow-600/20">
        {matchedArticles.map((article, i) => {
          // Find watchlisted persons mentioned in this article
          const wlSet = new Set(watchlist)
          const mentionedPersonIds = (article.person_ids || []).filter(id => wlSet.has(id))
          const mentionedPersons = mentionedPersonIds
            .map(id => PERSONS.find(p => p.id === id))
            .filter(Boolean)

          const party = mentionedPersons[0]?.party_id ? PARTY_MAP[mentionedPersons[0].party_id] : null

          return (
            <div key={article.id || i} className="flex flex-col sm:flex-row sm:items-start gap-2 px-4 py-3">
              {/* Person pills */}
              <div className="flex flex-wrap gap-1.5 sm:w-40 sm:flex-shrink-0">
                {mentionedPersons.slice(0, 2).map(person => {
                  const pParty = person.party_id ? PARTY_MAP[person.party_id] : null
                  return (
                    <Link
                      key={person.id}
                      to={`/persons/${person.id}`}
                      onClick={e => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold text-white hover:opacity-80 transition-opacity whitespace-nowrap"
                      style={{ backgroundColor: pParty?.color || '#78716C' }}
                    >
                      {person.name.split(' ')[0]}
                    </Link>
                  )
                })}
                {mentionedPersons.length > 2 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] text-yellow-400 bg-yellow-500/10 border border-yellow-500/20">
                    +{mentionedPersons.length - 2}
                  </span>
                )}
              </div>

              {/* Article info */}
              <div className="flex-1 min-w-0">
                <a
                  href={article.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-text-primary hover:text-yellow-300 transition-colors line-clamp-2 leading-snug block"
                >
                  {article.title}
                </a>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-bg-elevated border border-border text-text-secondary">
                    {article.source}
                  </span>
                  <span className="text-[11px] text-text-muted">
                    {formatRelativeTime(article.pub_date || article.date)}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-yellow-600/20 flex items-center justify-between">
        <span className="text-[11px] text-yellow-600/70">
          Auto-refresh setiap 15 menit
        </span>
        <Link
          to="/persons"
          className="text-[11px] text-yellow-400 hover:text-yellow-200 transition-colors"
        >
          Kelola pantauan →
        </Link>
      </div>
    </div>
  )
}
