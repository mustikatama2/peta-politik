// src/components/QuickSearch.jsx
// Inline quick search box for Dashboard — search persons by name/party/issue
// Enter key → navigate to /pencarian?q=<query> for full results

import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { PERSONS } from '../data/persons'
import { PARTY_MAP } from '../data/parties'
import { Avatar } from './ui'

const MAX_RESULTS = 8

function searchPersons(query) {
  if (!query || query.trim().length < 1) return []
  const q = query.toLowerCase().trim()
  return PERSONS.filter(p => {
    if (p.name.toLowerCase().includes(q)) return true
    const party = p.party_id ? PARTY_MAP[p.party_id] : null
    if (party?.name?.toLowerCase().includes(q)) return true
    if (party?.abbr?.toLowerCase().includes(q)) return true
    if (p.positions?.some(pos => pos.title?.toLowerCase().includes(q))) return true
    if (p.tags?.some(tag => tag.toLowerCase().includes(q))) return true
    return false
  }).slice(0, MAX_RESULTS)
}

const TIER_LABEL = {
  nasional:  { label: 'Nasional',  cls: 'bg-blue-500/15 text-blue-400 border-blue-500/25' },
  provinsi:  { label: 'Provinsi',  cls: 'bg-green-500/15 text-green-400 border-green-500/25' },
  kabupaten: { label: 'Kab/Kota', cls: 'bg-purple-500/15 text-purple-400 border-purple-500/25' },
  historis:  { label: 'Historis',  cls: 'bg-gray-500/15 text-gray-400 border-gray-500/25' },
}

export default function QuickSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef(null)
  const containerRef = useRef(null)
  const navigate = useNavigate()

  // Update results whenever query changes
  useEffect(() => {
    const found = searchPersons(query)
    setResults(found)
    setActiveIndex(-1)
    setOpen(found.length > 0 && query.length > 0)
  }, [query])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // ⌘K / Ctrl+K → focus this input
  useEffect(() => {
    function handler(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        // GlobalSearch modal handles this; only focus QuickSearch if no modal is open
        const modal = document.querySelector('[data-global-search-modal]')
        if (modal) return
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const selectPerson = useCallback((person) => {
    setQuery('')
    setOpen(false)
    setActiveIndex(-1)
    navigate(`/persons/${person.id}`)
  }, [navigate])

  const goToFullSearch = useCallback(() => {
    if (!query.trim()) return
    setOpen(false)
    navigate(`/pencarian?q=${encodeURIComponent(query.trim())}`)
  }, [query, navigate])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, results.length - 1))
      setOpen(true)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && results[activeIndex]) {
        // Select highlighted person
        selectPerson(results[activeIndex])
      } else if (query.trim()) {
        // No item highlighted → go to full search page
        goToFullSearch()
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
      inputRef.current?.blur()
    }
  }, [open, results, activeIndex, query, selectPerson, goToFullSearch])

  // Determine if we should show the ⌘K hint (only when empty)
  const showKbdHint = !query

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      {/* Input */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm pointer-events-none">
          🔍
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (results.length > 0) setOpen(true) }}
          placeholder="Cari tokoh, partai, atau isu..."
          className="w-full bg-bg-elevated border border-border rounded-xl pl-9 pr-16 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-red transition-colors"
        />
        {/* ⌘K badge hint */}
        {showKbdHint && (
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-bg-base border border-border text-text-muted pointer-events-none">
            ⌘K
          </kbd>
        )}
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors text-base"
          >
            ×
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
          {results.map((person, i) => {
            const party = person.party_id ? PARTY_MAP[person.party_id] : null
            const tierCfg = TIER_LABEL[person.tier] || TIER_LABEL.nasional
            const currentPos = person.positions?.find(p => p.is_current)
            const isActive = i === activeIndex

            return (
              <button
                key={person.id}
                onMouseDown={e => { e.preventDefault(); selectPerson(person) }}
                onMouseEnter={() => setActiveIndex(i)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors border-b border-border last:border-0 ${
                  isActive ? 'bg-bg-elevated' : 'hover:bg-bg-elevated/50'
                }`}
              >
                {/* Avatar */}
                <Avatar
                  name={person.name}
                  photoUrl={person.photo_url}
                  color={party?.color}
                  size="sm"
                  className="flex-shrink-0"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate leading-snug">
                    {person.name}
                  </p>
                  {currentPos && (
                    <p className="text-xs text-text-secondary truncate">
                      {currentPos.title}
                    </p>
                  )}
                </div>

                {/* Badges */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {party && (
                    <span
                      className="px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: party.color }}
                    >
                      {party.abbr}
                    </span>
                  )}
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${tierCfg.cls}`}>
                    {tierCfg.label}
                  </span>
                </div>
              </button>
            )
          })}

          {/* Footer — navigate to full /pencarian page */}
          <div className="border-t border-border bg-bg-elevated/50">
            <button
              onMouseDown={e => { e.preventDefault(); goToFullSearch() }}
              className="w-full px-3 py-2 flex items-center justify-between text-xs text-text-secondary hover:text-accent-red hover:bg-bg-elevated transition-colors"
            >
              <span>↑↓ navigasi · Enter cari semua · Esc tutup</span>
              <span className="font-medium flex items-center gap-1">
                Cari semua hasil →
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
