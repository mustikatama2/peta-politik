// src/pages/pencarian/PencarianPage.jsx — Global Search Results Page
// URL: /pencarian?q=<query>&type=<all|person|party|agenda|kpk|news>

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { globalSearch, SEARCH_TYPES, TYPE_ICON, TYPE_LABEL } from '../../lib/search.js'

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

// ── Type filter tabs ───────────────────────────────────────────────────────
const TABS = [
  { key: 'all', label: 'Semua' },
  { key: 'person', label: 'Tokoh' },
  { key: 'party', label: 'Partai' },
  { key: 'agenda', label: 'Agenda' },
  { key: 'kpk', label: 'KPK' },
  { key: 'news', label: 'Berita' },
]

// ── Popular search suggestions ─────────────────────────────────────────────
const POPULAR = ['Prabowo', 'Jokowi', 'PKB', 'Korupsi', 'PDIP', 'Gibran']

export default function PencarianPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const urlQuery = searchParams.get('q') || ''
  const urlType = searchParams.get('type') || 'all'

  const [inputValue, setInputValue] = useState(urlQuery)
  const [activeType, setActiveType] = useState(urlType)
  const inputRef = useRef(null)

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Sync input when URL changes (e.g. browser back/forward)
  useEffect(() => {
    setInputValue(urlQuery)
    setActiveType(urlType)
  }, [urlQuery, urlType])

  // Compute results
  const types = activeType === 'all' ? SEARCH_TYPES : [activeType]
  const results = globalSearch(urlQuery, { limit: 50, types })

  // Commit search to URL (debounced via form submit)
  const handleSearch = useCallback((q, type = activeType) => {
    const params = {}
    if (q) params.q = q
    if (type && type !== 'all') params.type = type
    setSearchParams(params, { replace: false })
  }, [activeType, setSearchParams])

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSearch(inputValue.trim(), activeType)
  }

  const handleTabChange = (tab) => {
    setActiveType(tab)
    handleSearch(urlQuery, tab)
  }

  const handlePopular = (term) => {
    setInputValue(term)
    handleSearch(term, 'all')
    setActiveType('all')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* ── Page title ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">🔍 Pencarian</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Cari tokoh, partai, agenda, kasus KPK, dan berita
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
          onChange={e => setInputValue(e.target.value)}
          placeholder="Ketik nama tokoh, partai, atau kata kunci…"
          className="w-full bg-bg-elevated border border-border rounded-2xl pl-12 pr-28 py-3.5 text-base text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-red transition-colors shadow-sm"
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
            onClick={() => { setInputValue(''); inputRef.current?.focus() }}
            className="absolute right-[4.5rem] top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary text-xl transition-colors"
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

      {/* ── Type filter tabs ────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all border ${
              activeType === tab.key
                ? 'bg-accent-red text-white border-accent-red shadow-sm'
                : 'bg-bg-elevated border-border text-text-secondary hover:border-accent-red hover:text-accent-red'
            }`}
          >
            {tab.key !== 'all' && <span className="mr-1">{TYPE_ICON[tab.key]}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Empty state — no query ──────────────────────────────────────── */}
      {!urlQuery && (
        <div className="bg-bg-card border border-border rounded-2xl p-8 text-center space-y-4">
          <p className="text-text-secondary text-sm">Mulai ketik untuk mencari</p>
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
            {results.length > 0
              ? <><span className="font-semibold text-text-primary">{results.length}</span> hasil untuk &ldquo;<span className="font-medium text-accent-red">{urlQuery}</span>&rdquo;</>
              : null
            }
          </p>

          {results.length === 0 ? (
            /* Empty state — no results */
            <div className="bg-bg-card border border-border rounded-2xl p-10 text-center space-y-4">
              <p className="text-4xl">🔎</p>
              <p className="text-text-primary font-medium">
                Tidak ditemukan hasil untuk &ldquo;{urlQuery}&rdquo;
              </p>
              <p className="text-sm text-text-secondary">Coba kata kunci lain.</p>
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                {POPULAR.map(term => (
                  <button
                    key={term}
                    onClick={() => handlePopular(term)}
                    className="px-3 py-1 rounded-full bg-bg-elevated border border-border text-xs text-text-secondary hover:border-accent-red hover:text-accent-red transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Result list */
            <div className="space-y-2">
              {results.map(result => (
                <Link
                  key={`${result.type}-${result.id}`}
                  to={result.url}
                  className="flex items-center gap-4 p-4 bg-bg-card border border-border rounded-xl hover:border-accent-red hover:bg-bg-elevated transition-all group"
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
