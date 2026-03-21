import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import MetaTags from '../../components/MetaTags'
import { QUICK_FACTS, FACT_CATEGORIES, CATEGORY_META } from '../../data/quick_facts'
import { PERSONS } from '../../data/persons'
import { PARTY_MAP } from '../../data/parties'

// ─── Helpers ──────────────────────────────────────────────────────────────

function formatValue(fact) {
  const { visual_type, value, prev_value, unit } = fact
  if (value === null || value === undefined) return null

  if (visual_type === 'number') {
    // Format large numbers
    if (value >= 1_000_000_000_000) {
      const t = (value / 1_000_000_000_000).toFixed(2).replace(/\.?0+$/, '')
      return { primary: `Rp ${t}T`, unit: unit || '' }
    }
    if (value >= 1_000_000_000) {
      const m = (value / 1_000_000_000).toFixed(1).replace(/\.?0+$/, '')
      return { primary: `${m} M`, unit: unit || '' }
    }
    if (value >= 1_000_000) {
      const jt = (value / 1_000_000).toFixed(1).replace(/\.?0+$/, '')
      return { primary: `${jt} juta`, unit: unit || '' }
    }
    return { primary: value.toLocaleString('id-ID'), unit: unit || '' }
  }

  if (visual_type === 'trend' || visual_type === 'comparison') {
    return {
      primary: typeof value === 'number' ? value.toLocaleString('id-ID') : value,
      prev: prev_value,
      unit: unit || '',
      direction: prev_value !== undefined && value < prev_value ? 'down' : 'up',
    }
  }

  return null
}

function copyToClipboard(text, onDone) {
  navigator.clipboard?.writeText(text).then(onDone).catch(() => {
    // fallback
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    onDone?.()
  })
}

// ─── Visual Indicator ─────────────────────────────────────────────────────

function VisualIndicator({ fact }) {
  const meta = CATEGORY_META[fact.category] || {}
  const fmt = formatValue(fact)
  if (!fmt) return null

  const color = meta.color || '#6B7280'

  if (fact.visual_type === 'trend' || fact.visual_type === 'comparison') {
    const isDown = fmt.direction === 'down'
    return (
      <div className="flex items-center gap-2 mt-2">
        <span className="text-2xl font-black" style={{ color }}>
          {fmt.primary} {fmt.unit}
        </span>
        {fmt.prev !== undefined && (
          <span className={`flex items-center gap-0.5 text-sm font-semibold ${isDown ? 'text-red-500' : 'text-green-500'}`}>
            {isDown ? '↓' : '↑'} dari {fmt.prev} {fmt.unit}
          </span>
        )}
      </div>
    )
  }

  if (fact.visual_type === 'number') {
    return (
      <div className="mt-2">
        <span className="text-2xl font-black" style={{ color }}>{fmt.primary}</span>
        {fmt.unit && !['IDR', 'IDR/tahun', 'IDR kerugian'].includes(fmt.unit) && (
          <span className="text-sm text-gray-400 ml-1">{fmt.unit}</span>
        )}
      </div>
    )
  }

  return null
}

// ─── Person Chips ─────────────────────────────────────────────────────────

function PersonChips({ personIds }) {
  if (!personIds?.length) return null
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {personIds.map(id => {
        const person = PERSONS.find(p => p.id === id)
        if (!person) return null
        const party = PARTY_MAP[person.party_id]
        return (
          <Link
            key={id}
            to={`/persons/${id}`}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border transition-all hover:opacity-80"
            style={{
              borderColor: (party?.color || '#6B7280') + '60',
              backgroundColor: (party?.color || '#6B7280') + '15',
              color: party?.color || '#9CA3AF',
            }}
          >
            <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
              style={{ background: party?.color || '#374151' }}>
              {person.photo_placeholder?.[0] || person.name[0]}
            </span>
            {person.name.split(' ')[0]}
          </Link>
        )
      })}
    </div>
  )
}

// ─── Fact Card ────────────────────────────────────────────────────────────

function FactCard({ fact, hero = false }) {
  const [copied, setCopied] = useState(false)
  const meta = CATEGORY_META[fact.category] || { color: '#6B7280', bg: '#F3F4F6', icon: '📌' }

  const handleCopy = useCallback(() => {
    copyToClipboard(
      `${fact.fact}\n\nSumber: ${fact.source}\n— PetaPolitik.id`,
      () => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    )
  }, [fact])

  const handleShare = useCallback(() => {
    const text = `${fact.fact}\n\nSumber: ${fact.source}`
    if (navigator.share) {
      navigator.share({ title: 'PetaPolitik — Fakta Cepat', text, url: window.location.href }).catch(() => {})
    } else {
      copyToClipboard(`${text}\n${window.location.href}`, () => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }, [fact])

  return (
    <div
      className={`bg-bg-card border border-border rounded-xl p-4 flex flex-col gap-2 group transition-all hover:shadow-lg hover:border-opacity-60 break-inside-avoid ${
        hero ? 'border-l-4 p-5' : ''
      }`}
      style={hero ? { borderLeftColor: meta.color } : {}}
    >
      {/* Header: category badge + importance */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
          style={{ background: meta.bg, color: meta.color }}
        >
          <span>{meta.icon}</span>
          {fact.category}
        </span>
        {fact.importance === 'high' && (
          <span className="text-[10px] font-semibold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200">
            🔥 Penting
          </span>
        )}
      </div>

      {/* Visual indicator */}
      <VisualIndicator fact={fact} />

      {/* Fact text */}
      <p className={`text-text-primary leading-relaxed ${hero ? 'text-base' : 'text-sm'}`}>
        {fact.fact}
      </p>

      {/* Person chips */}
      <PersonChips personIds={fact.person_ids} />

      {/* Footer: source + actions */}
      <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-border">
        <span className="text-[11px] text-text-muted truncate">📌 {fact.source}</span>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-all"
            title="Salin fakta"
          >
            {copied ? '✅' : '📋'} Salin
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-all"
            title="Bagikan fakta"
          >
            🔗 Bagikan
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────

export default function QuickFactsPage() {
  const [activeCategory, setActiveCategory] = useState('Semua')

  const filteredFacts = activeCategory === 'Semua'
    ? QUICK_FACTS
    : QUICK_FACTS.filter(f => f.category === activeCategory)

  // Featured fact = first high-importance fact
  const featuredFact = QUICK_FACTS.find(f => f.importance === 'high')

  // Rest of facts (exclude featured from the grid)
  const gridFacts = filteredFacts.filter(f => f.id !== featuredFact?.id || activeCategory !== 'Semua')

  const totalFacts = QUICK_FACTS.length

  return (
    <div className="space-y-6">
      <MetaTags
        title="Fakta Cepat"
        description="Fakta-fakta politik Indonesia yang terverifikasi — korupsi, kekayaan pejabat, pemilu, dan lebih banyak lagi."
      />

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-bg-card to-bg-elevated border border-border rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
              ⚡ Fakta Cepat Politik Indonesia
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              Angka dan data politik Indonesia yang terverifikasi — mudah dibagikan.
            </p>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-xs text-text-muted">
              <span className="font-semibold text-text-secondary">{totalFacts} fakta terverifikasi</span>
              {' · '}Diperbarui Maret 2025
            </p>
          </div>
        </div>
      </div>

      {/* ── Featured Hero Card ── */}
      {activeCategory === 'Semua' && featuredFact && (
        <div>
          <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
            ⭐ Fakta Utama
          </h2>
          <FactCard fact={featuredFact} hero />
        </div>
      )}

      {/* ── Category Filter Pills ── */}
      <div className="flex flex-wrap gap-2">
        {['Semua', ...FACT_CATEGORIES].map(cat => {
          const meta = CATEGORY_META[cat]
          const isActive = activeCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all"
              style={
                isActive
                  ? {
                      background: meta?.color || '#374151',
                      color: '#fff',
                      borderColor: meta?.color || '#374151',
                    }
                  : {
                      background: 'transparent',
                      color: meta?.color || '#9CA3AF',
                      borderColor: (meta?.color || '#6B7280') + '50',
                    }
              }
            >
              {meta?.icon || '📌'} {cat}
              <span className="text-xs opacity-70">
                ({cat === 'Semua' ? totalFacts : QUICK_FACTS.filter(f => f.category === cat).length})
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Masonry Grid ── */}
      <div
        style={{
          columns: 'var(--fact-cols, 1)',
          gap: '1rem',
        }}
        className="[--fact-cols:1] sm:[--fact-cols:2] lg:[--fact-cols:3]"
      >
        {gridFacts.map(fact => (
          <div key={fact.id} className="mb-4">
            <FactCard fact={fact} />
          </div>
        ))}
      </div>

      {filteredFacts.length === 0 && (
        <div className="text-center py-12 text-text-secondary">
          <div className="text-4xl mb-2">🔍</div>
          <p>Tidak ada fakta untuk kategori ini.</p>
        </div>
      )}

      {/* ── Footer note ── */}
      <div className="border border-border rounded-xl p-4 bg-bg-elevated text-center">
        <p className="text-xs text-text-muted">
          Semua fakta bersumber dari data publik yang dapat diverifikasi.
          Sumber tercantum di setiap kartu.{' '}
          <Link to="/" className="text-accent-blue hover:underline">← Kembali ke Dashboard</Link>
        </p>
      </div>
    </div>
  )
}
