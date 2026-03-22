// src/pages/pencarian/PencarianPage.jsx — Global Search Results Page
// URL: /pencarian?q=<query>&type=<all|person|party|agenda|kpk|news>

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { globalSearch, SEARCH_TYPES, TYPE_ICON, TYPE_LABEL } from '../../lib/search.js'

const RECENT_SEARCHES_KEY = 'petapolitik_recent_searches'
const MAX_RECENT = 5

// ── Persist recent searches ────────────────────────────────────────────────
function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]')
  } catch {
    return []
  }
}

function addRecentSearch(term) {
  if (!term || term.trim().length < 2) return
  const prev = getRecentSearches().filter(s => s.toLowerCase() !== term.toLowerCase())
  const next = [term, ...prev].slice(0, MAX_RECENT)
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next))
}

function clearRecentSearches() {
  localStorage.removeItem(RECENT_SEARCHES_KEY)
}

// ── Highlight matching text ────────────────────────────────────────────────
function Highlight({ text, query }) {
  if (!query || !query.trim()) return <span>{text}</span>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <span>{text}</span>
  return (
    <span>
      {text.slice(0, idx)}
      <strong className="text-accent-red font-semibold bg-accent-red/10 rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </strong>
      {text.slice(idx + query.length)}
    </span>
  )
}

// ── Category filter tabs ───────────────────────────────────────────────────
const TABS = [
  { key: 'all',         label: 'Semua',       icon: '🔍', searchType: null },
  { key: 'person',      label: 'Tokoh',       icon: '👤', searchType: 'person' },
  { key: 'party',       label: 'Partai',      icon: '🏛️', searchType: 'party' },
  { key: 'kpk',        label: 'Kasus KPK',   icon: '⚖️', searchType: 'kpk' },
  { key: 'investigasi', label: 'Investigasi', icon: '🔎', searchType: null, link: '/investigasi' },
  { key: 'cek-fakta',  label: 'Cek Fakta',   icon: '✅', searchType: null, link: '/cek-fakta' },
  { key: 'agenda',     label: 'Agenda',       icon: '📅', searchType: 'agenda' },
  { key: 'news',       label: 'Peristiwa',    icon: '📰', searchType: 'news' },
]

// ── Related search suggestions ──────────────────────────────────────────────
const POPULAR = ['Prabowo', 'Jokowi', 'PKB', 'Korupsi', 'PDIP', 'Gibran']

function getRelatedSuggestions(query) {
  if (!query) return POPULAR.slice(0, 3)
  const q = query.toLowerCase()
  // Simple heuristic: pick popular terms that partially overlap
  const related = POPULAR.filter(p => {
    const pl = p.toLowerCase()
    return pl !== q && (pl.includes(q[0]) || q.includes(pl[0]))
  })
  // Fill with random from POPULAR if needed
  const fill = POPULAR.filter(p => !related.includes(p))
  return [...related, ...fill].slice(0, 3)
}

export default function PencarianPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const urlQuery = searchParams.get('q') || ''
  const urlType  = searchParams.get('type') || 'all'

  const [inputValue,   setInputValue]   = useState(urlQuery)
  const [activeType,   setActiveType]   = useState(urlType)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState([])
  const inputRef   = useRef(null)
  const resultsRef = useRef([])

  // Load recent searches from localStorage
  useEffect(() => {
    setRecentSearches(getRecentSearches())
  }, [urlQuery])

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Sync input when URL changes (e.g. browser back/forward)
  useEffect(() => {
    setInputValue(urlQuery)
    setActiveType(urlType)
    setFocusedIndex(-1)
  }, [urlQuery, urlType])

  // Compute results
  const activeTab = TABS.find(t => t.key === activeType) || TABS[0]
  const searchTypes = activeTab.searchType
    ? [activeTab.searchType]
    : activeType === 'all'
      ? SEARCH_TYPES
      : SEARCH_TYPES // fallback for nav-only tabs like investigasi
  const results = globalSearch(urlQuery, { limit: 50, types: searchTypes })

  // Filter out nav-only tabs from results (investigasi, cek-fakta)
  const filteredResults = activeTab.link ? [] : results

  // Commit search to URL
  const handleSearch = useCallback((q, type = activeType) => {
    if (q && q.trim().length >= 2) addRecentSearch(q.trim())
    const params = {}
    if (q) params.q = q
    if (type && type !== 'all') params.type = type
    setSearchParams(params, { replace: false })
    setRecentSearches(getRecentSearches())
  }, [activeType, setSearchParams])

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSearch(inputValue.trim(), activeType)
  }

  const handleTabChange = (tab) => {
    // Nav-only tabs redirect to their page
    if (tab.link) {
      navigate(tab.link)
      return
    }
    setActiveType(tab.key)
    handleSearch(urlQuery, tab.key)
  }

  const handlePopular = (term) => {
    setInputValue(term)
    handleSearch(term, 'all')
    setActiveType('all')
  }

  const handleClearRecent = () => {
    clearRecentSearches()
    setRecentSearches([])
  }

  // ── Keyboard navigation ────────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setInputValue('')
      setFocusedIndex(-1)
      inputRef.current?.focus()
      return
    }
    if (!filteredResults.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIndex(prev => {
        const next = Math.min(prev + 1, filteredResults.length - 1)
        resultsRef.current[next]?.scrollIntoView({ block: 'nearest' })
        return next
      })
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIndex(prev => {
        const next = Math.max(prev - 1, -1)
        if (next === -1) inputRef.current?.focus()
        else resultsRef.current[next]?.scrollIntoView({ block: 'nearest' })
        return next
      })
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault()
      const target = filteredResults[focusedIndex]
      if (target) navigate(target.url)
    }
  }

  const relatedSuggestions = getRelatedSuggestions(urlQuery)

  return (
    <div className="max-w-3xl mx-auto space-y-6" onKeyDown={handleKeyDown}>
      {/* ── Page title ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">🔍 Pencarian</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Cari tokoh, partai, agenda, kasus KPK, investigasi, dan berita
        </p>
      </div>

      {/* ── Search input ───────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none text-lg">
          🔍
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => { setInputValue(e.target.value); setFocusedIndex(-1) }}
          onKeyDown={e => {
            // Let form submit on Enter if no result focused
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || (e.key === 'Enter' && focusedIndex >= 0) || e.key === 'Escape') {
              handleKeyDown(e)
            }
          }}
          placeholder="Ketik nama tokoh, partai, atau kata kunci…"
          className="w-full bg-bg-elevated border border-border rounded-2xl pl-12 pr-28 py-3.5 text-base text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-red transition-colors shadow-sm"
          autoComplete="off"
        />
        {/* ⌘K hint */}
        <span className="absolute right-20 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded text-[10px] bg-bg-base border border-border text-text-muted">
            ⌘K
          </kbd>
        </span>
        {inputValue && (
          <button
            type="button"
            onClick={() => { setInputValue(''); setFocusedIndex(-1); inputRef.current?.focus() }}
            className="absolute right-[4.5rem] top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary text-xl transition-colors"
            title="Hapus (Esc)"
          >
            ×
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-accent-red text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors"
        >
          Cari
        </button>
      </form>

      {/* ── Keyboard hint ──────────────────────────────────────────────── */}
      {urlQuery && filteredResults.length > 0 && (
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-bg-elevated border border-border">↑↓</kbd> navigasi
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-bg-elevated border border-border">Enter</kbd> buka
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-bg-elevated border border-border">Esc</kbd> hapus
          </span>
        </div>
      )}

      {/* ── Category filter tabs ────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all border flex items-center gap-1 ${
              activeType === tab.key && !tab.link
                ? 'bg-accent-red text-white border-accent-red shadow-sm'
                : tab.link
                  ? 'bg-bg-elevated border-border text-text-secondary hover:border-purple-500 hover:text-purple-400'
                  : 'bg-bg-elevated border-border text-text-secondary hover:border-accent-red hover:text-accent-red'
            }`}
            title={tab.link ? `Buka halaman ${tab.label}` : undefined}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.link && <span className="text-[10px] opacity-60">↗</span>}
          </button>
        ))}
      </div>

      {/* ── Empty state — no query ──────────────────────────────────────── */}
      {!urlQuery && (
        <div className="bg-bg-card border border-border rounded-2xl p-8 text-center space-y-5">
          <p className="text-text-secondary text-sm">Mulai ketik untuk mencari</p>

          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-text-muted font-medium uppercase tracking-wider">
                  Pencarian terakhir
                </p>
                <button
                  onClick={handleClearRecent}
                  className="text-xs text-text-muted hover:text-text-secondary transition-colors"
                >
                  Hapus semua
                </button>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {recentSearches.map(term => (
                  <button
                    key={term}
                    onClick={() => handlePopular(term)}
                    className="px-3.5 py-1.5 rounded-full bg-bg-elevated border border-border text-sm text-text-secondary hover:border-accent-red hover:text-accent-red transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-xs opacity-60">🕐</span>
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular searches */}
          <div className="space-y-2">
            <p className="text-xs text-text-muted font-medium uppercase tracking-wider">
              Pencarian populer
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {POPULAR.map(term => (
                <button
                  key={term}
                  onClick={() => handlePopular(term)}
                  className="px-4 py-1.5 rounded-full bg-bg-elevated border border-border text-sm text-text-secondary hover:border-accent-red hover:text-accent-red transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Results ────────────────────────────────────────────────────── */}
      {urlQuery && (
        <>
          {/* Result count */}
          <p className="text-sm text-text-secondary">
            {filteredResults.length > 0
              ? <><span className="font-semibold text-text-primary">{filteredResults.length}</span> hasil untuk &ldquo;<span className="font-medium text-accent-red">{urlQuery}</span>&rdquo;</>
              : null
            }
          </p>

          {/* Nav-only tab selected */}
          {activeTab.link && (
            <div className="bg-bg-card border border-border rounded-2xl p-10 text-center space-y-4">
              <p className="text-4xl">{activeTab.icon}</p>
              <p className="text-text-primary font-medium">
                Kategori <strong>{activeTab.label}</strong> memiliki halaman khusus
              </p>
              <p className="text-sm text-text-secondary">
                Klik tombol di bawah untuk membuka halaman {activeTab.label} lengkap.
              </p>
              <Link
                to={activeTab.link}
                className="inline-block px-6 py-2.5 bg-accent-red text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors"
              >
                Buka {activeTab.label} →
              </Link>
            </div>
          )}

          {!activeTab.link && filteredResults.length === 0 && (
            /* ── "Tidak ditemukan" empty state ── */
            <div className="bg-bg-card border border-border rounded-2xl p-10 text-center space-y-5">
              <p className="text-4xl">🔎</p>
              <div>
                <p className="text-text-primary font-medium text-base">
                  Tidak ditemukan hasil untuk &ldquo;{urlQuery}&rdquo;
                </p>
                <p className="text-sm text-text-secondary mt-1">
                  Coba kata kunci yang berbeda, atau telusuri daftar tokoh.
                </p>
              </div>

              {/* Suggested searches */}
              <div className="space-y-2">
                <p className="text-xs text-text-muted font-medium uppercase tracking-wider">
                  Mungkin kamu mencari:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {relatedSuggestions.map(term => (
                    <button
                      key={term}
                      onClick={() => handlePopular(term)}
                      className="px-4 py-1.5 rounded-full bg-bg-elevated border border-border text-sm text-text-secondary hover:border-accent-red hover:text-accent-red transition-colors"
                    >
                      🔍 {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Browse link */}
              <div className="pt-2 border-t border-border">
                <p className="text-sm text-text-secondary mb-3">Atau telusuri semua tokoh secara manual:</p>
                <Link
                  to="/persons"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-bg-elevated border border-border text-sm text-text-secondary rounded-xl hover:border-accent-red hover:text-accent-red transition-colors"
                >
                  👥 Lihat Semua Tokoh →
                </Link>
              </div>
            </div>
          )}

          {!activeTab.link && filteredResults.length > 0 && (
            /* ── Result list ── */
            <div className="space-y-2">
              {filteredResults.map((result, idx) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  to={result.url}
                  ref={el => { resultsRef.current[idx] = el }}
                  tabIndex={0}
                  onFocus={() => setFocusedIndex(idx)}
                  className={`flex items-center gap-4 p-4 border rounded-xl transition-all group ${
                    focusedIndex === idx
                      ? 'bg-bg-elevated border-accent-red ring-1 ring-accent-red/30'
                      : 'bg-bg-card border-border hover:border-accent-red hover:bg-bg-elevated'
                  }`}
                >
                  {/* Type icon */}
                  <span className="text-2xl flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-bg-elevated group-hover:bg-bg-hover">
                    {TYPE_ICON[result.type]}
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate leading-snug">
                      <Highlight text={result.label} query={urlQuery} />
                    </p>
                    <p className="text-xs text-text-secondary truncate mt-0.5">
                      <Highlight text={result.subtitle} query={urlQuery} />
                    </p>
                  </div>

                  {/* Focused indicator */}
                  {focusedIndex === idx && (
                    <kbd className="flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] bg-bg-base border border-border text-text-muted">
                      Enter
                    </kbd>
                  )}

                  {/* Type badge */}
                  <span className={`
                    flex-shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-medium border
                    ${result.type === 'person'  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'   : ''}
                    ${result.type === 'party'   ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : ''}
                    ${result.type === 'agenda'  ? 'bg-green-500/10 text-green-400 border-green-500/20'  : ''}
                    ${result.type === 'kpk'     ? 'bg-red-500/10 text-red-400 border-red-500/20'       : ''}
                    ${result.type === 'news'    ? 'bg-gray-500/10 text-gray-400 border-gray-500/20'    : ''}
                  `}>
                    {TYPE_LABEL[result.type] || result.type}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
