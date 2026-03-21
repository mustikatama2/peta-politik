import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PERSONS } from '../data/persons'
import { PARTIES } from '../data/parties'
import { NEWS } from '../data/news'
import * as RegionsData from '../data/regions'

const ALL_PROVINCES = RegionsData.PROVINCES || []

// Build search index at module load
const SEARCH_INDEX = [
  ...PERSONS.map(p => ({
    id: p.id,
    type: 'person',
    icon: '👤',
    title: p.name,
    sub: p.positions?.find(x => x.is_current)?.title || p.tier || '',
    url: `/persons/${p.id}`,
    keywords: [p.name, p.party_id, p.region_id, ...(p.tags || [])].filter(Boolean).join(' ').toLowerCase(),
  })),
  ...PARTIES.map(p => ({
    id: p.id,
    type: 'party',
    icon: p.logo_emoji || '🎭',
    title: p.name,
    sub: `${p.abbr} · ${p.seats_2024 ?? '—'} kursi DPR`,
    url: `/parties/${p.id}`,
    keywords: [p.name, p.abbr, p.ideology, p.ketum].filter(Boolean).join(' ').toLowerCase(),
  })),
  ...NEWS.map(n => ({
    id: n.id,
    type: 'news',
    icon: '📰',
    title: n.headline,
    sub: `${n.source} · ${n.date}`,
    url: '/news',
    keywords: [n.headline, n.summary, n.source, n.category].filter(Boolean).join(' ').toLowerCase(),
  })),
  ...ALL_PROVINCES.map(p => ({
    id: p.id,
    type: 'province',
    icon: '🗺️',
    title: p.name,
    sub: `${p.island || ''} · Gov: ${p.gubernur || 'N/A'}`,
    url: '/regions',
    keywords: [p.name, p.gubernur, p.island].filter(Boolean).join(' ').toLowerCase(),
  })),
]

const TYPE_COLORS = {
  person: '#3b82f6',
  party: '#f59e0b',
  news: '#6b7280',
  province: '#10b981',
}

export default function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  // ⌘K / Ctrl+K opens
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(o => !o)
        setQuery('')
        setSelected(0)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  const filteredResults = useMemo(() => {
    if (!query.trim()) return SEARCH_INDEX.slice(0, 8)
    const q = query.toLowerCase().trim()
    return SEARCH_INDEX
      .filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.keywords.includes(q) ||
        item.keywords.split(' ').some(word => word.startsWith(q))
      )
      .slice(0, 12)
  }, [query])

  const handleSelect = (item) => {
    navigate(item.url)
    setOpen(false)
    setQuery('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected(s => Math.min(s + 1, filteredResults.length - 1))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected(s => Math.max(s - 1, 0))
    }
    if (e.key === 'Enter' && filteredResults[selected]) {
      handleSelect(filteredResults[selected])
    }
  }

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-elevated border border-border text-text-secondary text-sm hover:border-accent-red transition-colors"
    >
      <span>🔍</span>
      <span className="hidden md:inline text-xs">Cari...</span>
      <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-bg-base border border-border">
        ⌘K
      </kbd>
    </button>
  )

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4"
      onClick={() => setOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-xl bg-bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <span className="text-text-secondary text-lg">🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0) }}
            onKeyDown={handleKeyDown}
            placeholder="Cari tokoh, partai, provinsi, berita..."
            className="flex-1 bg-transparent text-text-primary placeholder-text-muted outline-none text-base"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              ✕
            </button>
          )}
          <kbd className="px-1.5 py-0.5 rounded text-xs bg-bg-elevated border border-border text-text-secondary">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {filteredResults.length === 0 ? (
            <div className="p-8 text-center text-text-secondary text-sm">
              Tidak ditemukan untuk &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredResults.map((item, i) => (
              <button
                key={`${item.id}-${item.type}`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelected(i)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  i === selected ? 'bg-bg-elevated' : 'hover:bg-bg-elevated/50'
                }`}
              >
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{item.title}</p>
                  <p className="text-xs text-text-secondary truncate">{item.sub}</p>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium"
                  style={{
                    backgroundColor: (TYPE_COLORS[item.type] || '#6b7280') + '22',
                    color: TYPE_COLORS[item.type] || '#6b7280',
                  }}
                >
                  {item.type}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-bg-elevated/50 text-xs text-text-muted">
          <span>↑↓ navigasi · Enter pilih · Esc tutup</span>
          <span>{filteredResults.length} hasil</span>
        </div>
      </div>
    </div>
  )
}
