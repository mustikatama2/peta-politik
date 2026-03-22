import { useState, useRef, useCallback } from 'react'
import { PERSONS } from '../data/persons'
import { CONNECTIONS } from '../data/connections'
import { scoreOnePerson } from '../lib/scoring'

// ─── CARD STYLE THEMES ────────────────────────────────────────────────────────

const CARD_THEMES = {
  gelap: {
    bg: '#0F172A',
    surface: '#1E293B',
    border: '#334155',
    text: '#F8FAFC',
    subtext: '#94A3B8',
    accent: '#F0C200',
    barFill: '#F0C200',
    barEmpty: '#334155',
    badgeBg: '#1E293B',
    badgeText: '#F0C200',
    footerText: '#64748B',
  },
  terang: {
    bg: '#F8FAFC',
    surface: '#FFFFFF',
    border: '#E2E8F0',
    text: '#0F172A',
    subtext: '#64748B',
    accent: '#2563EB',
    barFill: '#2563EB',
    barEmpty: '#E2E8F0',
    badgeBg: '#EFF6FF',
    badgeText: '#2563EB',
    footerText: '#94A3B8',
  },
  merah: {
    bg: '#3B0A0A',
    surface: '#500C0C',
    border: '#7F1D1D',
    text: '#FFF5F5',
    subtext: '#FCA5A5',
    accent: '#FCA5A5',
    barFill: '#EF4444',
    barEmpty: '#7F1D1D',
    badgeBg: '#7F1D1D',
    badgeText: '#FCA5A5',
    footerText: '#9CA3AF',
  },
}

// ─── RISK HELPERS ─────────────────────────────────────────────────────────────

function riskEmoji(risk) {
  if (risk === 'terpidana') return '🔴'
  if (risk === 'tersangka') return '🔴'
  if (risk === 'tinggi') return '🔴'
  if (risk === 'sedang') return '🟡'
  return '🟢'
}

function riskLabel(risk) {
  const map = {
    terpidana: 'Terpidana',
    tersangka: 'Tersangka',
    tinggi: 'Tinggi',
    sedang: 'Sedang',
    rendah: 'Rendah',
  }
  return map[risk] || 'Rendah'
}

function formatLHKPN(val) {
  if (!val) return 'N/A'
  if (val >= 1_000_000_000_000) return `Rp ${(val / 1_000_000_000_000).toFixed(1)} T`
  if (val >= 1_000_000_000) return `Rp ${(val / 1_000_000_000).toFixed(1)} M`
  if (val >= 1_000_000) return `Rp ${(val / 1_000_000).toFixed(1)} Jt`
  return `Rp ${val.toLocaleString('id-ID')}`
}

function getInitialsColor(name) {
  const colors = ['#E53E3E', '#D69E2E', '#38A169', '#3182CE', '#805AD5', '#DD6B20', '#00B5D8']
  let hash = 0
  for (const ch of (name || '')) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffffffff
  return colors[Math.abs(hash) % colors.length]
}

// ─── SCORE BAR ────────────────────────────────────────────────────────────────

function ScoreBar({ score, theme }) {
  const pct = Math.round(Math.max(0, Math.min(100, score)))
  const blocks = 10
  const filled = Math.round((pct / 100) * blocks)
  return (
    <span style={{ display: 'inline-flex', gap: 2, alignItems: 'center' }}>
      {Array.from({ length: blocks }, (_, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            width: 10,
            height: 10,
            borderRadius: 2,
            background: i < filled ? theme.barFill : theme.barEmpty,
          }}
        />
      ))}
    </span>
  )
}

// ─── PROFILE CARD (pure inline styles — no Tailwind) ─────────────────────────

function ProfileCard({ person, score, theme, connectionCount }) {
  const t = CARD_THEMES[theme]
  const currentPos = person.positions?.find(p => p.is_current)
  const title = currentPos?.title || person.positions?.[0]?.title || '—'
  const risk = person.analysis?.corruption_risk || 'rendah'
  const kpkFlag = risk === 'terpidana' || risk === 'tersangka'
  const initials = (person.photo_placeholder || person.name?.slice(0, 2) || '??').toUpperCase()
  const avatarColor = getInitialsColor(person.name)

  return (
    <div
      style={{
        width: 480,
        background: t.bg,
        border: `1px solid ${t.border}`,
        borderRadius: 16,
        padding: '24px 28px',
        boxSizing: 'border-box',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        color: t.text,
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
        {/* Avatar */}
        {person.photo_url ? (
          <img
            src={person.photo_url}
            alt={person.name}
            style={{
              width: 72,
              height: 72,
              borderRadius: 12,
              objectFit: 'cover',
              flexShrink: 0,
              border: `2px solid ${t.border}`,
            }}
            onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex' }}
          />
        ) : null}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 12,
            background: avatarColor,
            flexShrink: 0,
            display: person.photo_url ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            fontWeight: 700,
            color: '#fff',
          }}
        >
          {initials}
        </div>

        {/* Name + title */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.2, marginBottom: 4 }}>{person.name}</div>
          <div style={{ fontSize: 12, color: t.subtext, marginBottom: 6, lineHeight: 1.4 }}>{title}</div>
          {person.party_id && (
            <span style={{
              display: 'inline-block',
              fontSize: 11,
              fontWeight: 600,
              background: t.badgeBg,
              color: t.badgeText,
              borderRadius: 6,
              padding: '2px 8px',
              border: `1px solid ${t.border}`,
            }}>
              🔵 {(person.party_id || '').toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: t.border, marginBottom: 16 }} />

      {/* Skor Pengaruh */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: t.subtext, fontWeight: 500 }}>Skor Pengaruh</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: t.accent }}>{Math.round(score.total)}/100</span>
        </div>
        <ScoreBar score={score.total} theme={t} />
      </div>

      {/* LHKPN + Risk row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 120, background: t.surface, borderRadius: 8, padding: '8px 12px', border: `1px solid ${t.border}` }}>
          <div style={{ fontSize: 10, color: t.subtext, marginBottom: 2, fontWeight: 500 }}>LHKPN</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{formatLHKPN(person.lhkpn_latest)}</div>
        </div>
        <div style={{ flex: 1, minWidth: 120, background: t.surface, borderRadius: 8, padding: '8px 12px', border: `1px solid ${t.border}` }}>
          <div style={{ fontSize: 10, color: t.subtext, marginBottom: 2, fontWeight: 500 }}>Risiko</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{riskEmoji(risk)} {riskLabel(risk)}</div>
        </div>
      </div>

      {/* Koneksi + KPK row */}
      <div style={{ background: t.surface, borderRadius: 8, padding: '10px 14px', border: `1px solid ${t.border}`, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12 }}>
            <span style={{ color: t.subtext }}>Koneksi: </span>
            <span style={{ fontWeight: 700, color: t.accent }}>{connectionCount}</span>
          </span>
          <span style={{ fontSize: 12 }}>
            <span style={{ color: t.subtext }}>KPK: </span>
            <span style={{ fontWeight: 700, color: kpkFlag ? '#EF4444' : '#22C55E' }}>
              {kpkFlag ? `⚠️ ${riskLabel(risk)}` : '✓ Bersih'}
            </span>
          </span>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', fontSize: 11, color: t.footerText, letterSpacing: '0.05em' }}>
        peta-politik.vercel.app
      </div>
    </div>
  )
}

// ─── TOAST ────────────────────────────────────────────────────────────────────

function Toast({ message, visible }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 32,
      left: '50%',
      transform: `translate(-50%, ${visible ? 0 : 20}px)`,
      opacity: visible ? 1 : 0,
      transition: 'all 0.3s ease',
      background: '#22C55E',
      color: '#fff',
      padding: '10px 20px',
      borderRadius: 8,
      fontSize: 14,
      fontWeight: 600,
      boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
      zIndex: 9999,
      pointerEvents: 'none',
    }}>
      {message}
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function EmbedPage() {
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(PERSONS.find(p => p.tier !== 'historis')?.id || PERSONS[0]?.id)
  const [cardTheme, setCardTheme] = useState('gelap')
  const [toast, setToast] = useState({ visible: false, message: '' })
  const toastTimer = useRef(null)

  const showToast = useCallback((msg) => {
    setToast({ visible: true, message: msg })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2500)
  }, [])

  const filtered = PERSONS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const selected = PERSONS.find(p => p.id === selectedId) || PERSONS[0]
  const score = scoreOnePerson(selected, CONNECTIONS)
  const connCount = CONNECTIONS.filter(c => c.from === selected.id || c.to === selected.id).length

  function handleCopyLink() {
    const url = `https://peta-politik.vercel.app/persons/${selected.id}`
    navigator.clipboard.writeText(url).then(() => showToast('Link disalin! 📋'))
      .catch(() => showToast('Gagal menyalin link'))
  }

  function handleDownload() {
    showToast('Gunakan Ctrl+P / Screenshot untuk menyimpan 🖼️')
  }

  function handleShare() {
    const url = `https://peta-politik.vercel.app/persons/${selected.id}`
    if (navigator.share) {
      navigator.share({
        title: `${selected.name} — PetaPolitik`,
        text: `Profil ${selected.name} di PetaPolitik Indonesia`,
        url,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(url).then(() => showToast('Link disalin! 🔗'))
        .catch(() => showToast('Gagal menyalin link'))
    }
  }

  return (
    <div className="min-h-screen bg-bg-app">
      {/* Header */}
      <div className="px-4 py-6 md:px-8">
        <h1 className="text-2xl font-bold text-text-primary mb-1">🔗 Bagikan Profil Politisi</h1>
        <p className="text-text-secondary text-sm">Buat kartu profil yang bisa dibagikan ke media sosial.</p>
      </div>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-6 px-4 pb-12 md:px-8" style={{ minHeight: 0 }}>

        {/* ── Left Panel: Person Selector ── */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-3 border-b border-border">
              <input
                type="text"
                placeholder="Cari tokoh..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-red"
              />
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
              {filtered.length === 0 && (
                <div className="p-4 text-center text-text-secondary text-sm">Tidak ditemukan</div>
              )}
              {filtered.map(p => {
                const initials = (p.photo_placeholder || p.name?.slice(0, 2) || '??').toUpperCase()
                const avatarColor = getInitialsColor(p.name)
                const isActive = p.id === selectedId

                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all border-l-2 ${
                      isActive
                        ? 'bg-white/10 border-red-500'
                        : 'border-transparent hover:bg-white/5 hover:border-white/20'
                    }`}
                  >
                    {/* Avatar */}
                    {p.photo_url ? (
                      <img
                        src={p.photo_url}
                        alt={p.name}
                        className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                        onError={e => { e.currentTarget.style.display = 'none' }}
                      />
                    ) : (
                      <div
                        className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: avatarColor }}
                      >
                        {initials}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium truncate ${isActive ? 'text-white' : 'text-text-primary'}`}>{p.name}</div>
                      <div className="text-xs text-text-muted truncate">{(p.party_id || '').toUpperCase()}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Right Panel: Card Preview + Actions ── */}
        <div className="flex-1 flex flex-col items-center gap-6">

          {/* Style selector */}
          <div className="flex items-center gap-2 self-start">
            <span className="text-sm text-text-secondary mr-1">Gaya:</span>
            {[
              { key: 'gelap', label: '🌑 Gelap' },
              { key: 'terang', label: '☀️ Terang' },
              { key: 'merah', label: '🔴 Merah' },
            ].map(s => (
              <button
                key={s.key}
                onClick={() => setCardTheme(s.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  cardTheme === s.key
                    ? 'bg-accent-red border-accent-red text-white'
                    : 'border-border text-text-secondary hover:border-text-secondary'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Card preview */}
          <div className="flex justify-center">
            <ProfileCard
              person={selected}
              score={score}
              theme={cardTheme}
              connectionCount={connCount}
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-5 py-2.5 bg-bg-card border border-border rounded-xl text-sm font-semibold text-text-primary hover:bg-bg-elevated hover:border-accent-red transition-all"
            >
              📋 Salin Link
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 bg-bg-card border border-border rounded-xl text-sm font-semibold text-text-primary hover:bg-bg-elevated hover:border-accent-red transition-all"
            >
              🖼️ Unduh Gambar
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-5 py-2.5 bg-accent-red border border-accent-red rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all"
            >
              🔗 Bagikan
            </button>
          </div>

          {/* Info hint */}
          <p className="text-xs text-text-muted text-center max-w-sm">
            Klik <strong className="text-text-secondary">Salin Link</strong> untuk berbagi langsung, atau gunakan screenshot / Ctrl+P untuk menyimpan gambar kartu.
          </p>
        </div>
      </div>

      <Toast message={toast.message} visible={toast.visible} />
    </div>
  )
}
