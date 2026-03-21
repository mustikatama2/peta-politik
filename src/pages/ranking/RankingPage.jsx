import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { scoreAllPersons } from '../../lib/scoring'
import { PERSONS } from '../../data/persons'
import { PARTY_MAP } from '../../data/parties'
import { exportToCSV } from '../../lib/exportUtils'
import ShareButton from '../../components/ShareButton'

// ─── Static trending data ──────────────────────────────────────────────────────
const RISING = [
  { id: 'dedi_mulyadi', label: 'Dedi Mulyadi', delta: '+5' },
  { id: 'pramono_anung', label: 'Pramono Anung', delta: '+4' },
  { id: 'khofifah', label: 'Khofifah I.P.', delta: '+3' },
  { id: 'erick_thohir', label: 'Erick Thohir', delta: '+2' },
  { id: 'zulhas', label: 'Zulkifli Hasan', delta: '+2' },
]

const FALLING = [
  { id: 'hasto', label: 'Hasto Kristiyanto', delta: '-8' },
  { id: 'gus_muhdlor', label: 'Gus Muhdlor', delta: '-6' },
  { id: 'tom_lembong', label: 'Tom Lembong', delta: '-5' },
  { id: 'anwar_usman', label: 'Anwar Usman', delta: '-4' },
  { id: 'budi_gunawan', label: 'Budi Gunawan', delta: '-3' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getParty(partyId) {
  return PARTY_MAP[partyId] || { abbr: '—', color: '#6b7280', logo_emoji: '—' }
}

function Avatar({ person, scored, size = 'md' }) {
  const party = getParty(scored?.party_id || person?.party_id)
  const sizeClass = size === 'lg' ? 'w-20 h-20 text-2xl' : size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'
  const photoUrl = person?.photo_url || scored?.photo_url
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={scored?.name || person?.name}
        className={`${sizeClass} rounded-full object-cover object-top flex-shrink-0 border-2 border-white/10`}
        onError={e => { e.target.style.display = 'none'; e.target.nextSibling && (e.target.nextSibling.style.display = 'flex') }}
      />
    )
  }
  const initials = (scored?.photo_placeholder || person?.photo_placeholder || '??')
  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}
      style={{ backgroundColor: party.color + 'cc' }}
    >
      {initials}
    </div>
  )
}

function ScoreBar({ value, max = 100, color = '#ef4444', label, compact = false }) {
  const pct = Math.min(100, (value / max) * 100)
  if (compact) {
    return (
      <div className="flex items-center gap-1 min-w-0">
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
        </div>
        <span className="text-[10px] text-white/50 tabular-nums w-6 text-right">{value}</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-2 text-xs">
      {label && <span className="text-white/50 w-16 flex-shrink-0">{label}</span>}
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-white/50 tabular-nums w-8 text-right">{value}</span>
    </div>
  )
}

function CorruptionBadge({ risk }) {
  const map = {
    rendah:    { label: 'Rendah',    bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
    sedang:    { label: 'Sedang',    bg: 'bg-amber-500/20',   text: 'text-amber-400' },
    tinggi:    { label: 'Tinggi',    bg: 'bg-orange-500/20',  text: 'text-orange-400' },
    tersangka: { label: 'Tersangka', bg: 'bg-red-500/20',     text: 'text-red-400' },
    terpidana: { label: 'Terpidana', bg: 'bg-red-900/40',     text: 'text-red-300' },
  }
  const s = map[risk] || map.rendah
  return (
    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  )
}

function TrendArrow({ risk }) {
  if (risk === 'tersangka' || risk === 'terpidana') {
    return <span className="text-red-400 text-xs">↓</span>
  }
  if (risk === 'rendah') {
    return <span className="text-emerald-400 text-xs">↑</span>
  }
  return <span className="text-white/30 text-xs">—</span>
}

// ─── Podium Card ──────────────────────────────────────────────────────────────

function PodiumCard({ scored, rank, person, tall }) {
  const navigate = useNavigate()
  const medals = ['🥇', '🥈', '🥉']
  const party = getParty(scored.party_id)
  const tierColors = {
    nasional: 'bg-blue-500/20 text-blue-300',
    provinsi: 'bg-purple-500/20 text-purple-300',
    kabupaten: 'bg-green-500/20 text-green-300',
    historis: 'bg-gray-500/20 text-gray-400',
  }

  return (
    <div
      onClick={() => navigate(`/persons/${scored.id}`)}
      className={`relative flex flex-col items-center p-6 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] hover:border-white/30
        ${tall ? 'border-yellow-500/40 bg-yellow-500/5 pt-8' : 'border-white/10 bg-white/3 mt-8'}
      `}
      style={{ minHeight: tall ? 360 : 320 }}
    >
      {/* Medal */}
      <div className="absolute -top-5 text-4xl">{medals[rank - 1]}</div>

      {/* Avatar */}
      <div className="mt-4 mb-3">
        <Avatar scored={scored} person={person} size="lg" />
      </div>

      {/* Rank number */}
      <div className="text-xs text-white/40 mb-1">#{rank}</div>

      {/* Name */}
      <h3 className="text-sm font-bold text-white text-center leading-tight mb-1">
        {scored.name}
      </h3>
      <p className="text-[11px] text-white/50 text-center mb-3 line-clamp-2 px-2">
        {scored.position_title}
      </p>

      {/* Score */}
      <div className={`text-4xl font-black mb-3 ${tall ? 'text-yellow-400' : 'text-white/90'}`}>
        {scored.total}
      </div>

      {/* Badges */}
      <div className="flex gap-1.5 flex-wrap justify-center mb-4">
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
          style={{ backgroundColor: party.color + 'cc' }}
        >
          {party.abbr}
        </span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${tierColors[scored.tier] || tierColors.nasional}`}>
          {scored.tier}
        </span>
        <CorruptionBadge risk={scored.corruption_risk} />
      </div>

      {/* Score breakdown bars */}
      <div className="w-full space-y-1">
        <ScoreBar label="Posisi" value={scored.position_score} max={40} color="#ef4444" />
        <ScoreBar label="Jaringan" value={scored.network_score} max={20} color="#f97316" />
        <ScoreBar label="Partai" value={scored.party_score} max={20} color="#8b5cf6" />
        <ScoreBar label="Kekayaan" value={scored.lhkpn_score} max={10} color="#22c55e" />
        {scored.corruption_adj < 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-white/50 w-16 flex-shrink-0">Penalti</span>
            <div className="flex-1 h-1.5 bg-red-500/20 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.abs(scored.corruption_adj) / 40 * 100}%` }} />
            </div>
            <span className="text-red-400 tabular-nums w-8 text-right">{scored.corruption_adj}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Score Distribution Histogram ─────────────────────────────────────────────

function ScoreHistogram({ allScored }) {
  const buckets = useMemo(() => {
    const data = Array.from({ length: 10 }, (_, i) => ({
      range: `${i * 10}–${i * 10 + 9}`,
      count: 0,
      min: i * 10,
    }))
    allScored.forEach(s => {
      const idx = Math.min(9, Math.floor(s.total / 10))
      data[idx].count++
    })
    return data
  }, [allScored])

  const maxCount = Math.max(...buckets.map(b => b.count), 1)

  return (
    <div className="bg-bg-elevated rounded-xl p-6 border border-white/5">
      <h3 className="text-sm font-semibold text-white mb-1">Distribusi Skor</h3>
      <p className="text-xs text-white/40 mb-4">Sebaran skor kekuasaan seluruh politisi dalam database</p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={buckets} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="range" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
          <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
          <Tooltip
            contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
            labelStyle={{ color: 'rgba(255,255,255,0.8)' }}
            itemStyle={{ color: '#ef4444' }}
            formatter={(v) => [v, 'Politisi']}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {buckets.map((b, i) => (
              <Cell key={i} fill={b.min >= 50 ? '#ef4444' : b.min >= 30 ? '#f97316' : '#6b7280'} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── Methodology Accordion ────────────────────────────────────────────────────

function Methodology() {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-bg-elevated rounded-xl border border-white/5 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
      >
        <span>📐 Metodologi Penilaian</span>
        <span className="text-white/40 text-lg">{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div className="px-6 pb-6 space-y-4 text-sm text-white/70 border-t border-white/5 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/3 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <span className="w-6 h-6 bg-red-500/20 text-red-400 rounded flex items-center justify-center text-xs font-bold">40</span>
                Skor Posisi (40%)
              </h4>
              <ul className="space-y-1 text-xs">
                <li>• Presiden: 100pts → skor 40</li>
                <li>• Wakil Presiden: 90pts → skor 36</li>
                <li>• Menko: 75pts → skor 30</li>
                <li>• Menteri/Kapolri/BIN: 65–70pts</li>
                <li>• Gubernur: 55pts → skor 22</li>
                <li>• Anggota DPR: 25pts → skor 10</li>
              </ul>
            </div>
            <div className="bg-white/3 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <span className="w-6 h-6 bg-orange-500/20 text-orange-400 rounded flex items-center justify-center text-xs font-bold">20</span>
                Skor Jaringan (20%)
              </h4>
              <ul className="space-y-1 text-xs">
                <li>• Jumlah koneksi × 2</li>
                <li>• Ditambah total strength / 10</li>
                <li>• Maks 20 poin</li>
                <li>• Lebih banyak hubungan = lebih berpengaruh</li>
              </ul>
            </div>
            <div className="bg-white/3 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <span className="w-6 h-6 bg-purple-500/20 text-purple-400 rounded flex items-center justify-center text-xs font-bold">20</span>
                Skor Partai (20%)
              </h4>
              <ul className="space-y-1 text-xs">
                <li>• Kursi DPR 2024 / 580 × 20</li>
                <li>• Golkar (102 kursi): skor ~3.5</li>
                <li>• PDIP (94 kursi): skor ~3.2</li>
                <li>• Gerindra (86 kursi): skor ~3.0</li>
              </ul>
            </div>
            <div className="bg-white/3 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <span className="w-6 h-6 bg-emerald-500/20 text-emerald-400 rounded flex items-center justify-center text-xs font-bold">10</span>
                Skor Kekayaan (10%)
              </h4>
              <ul className="space-y-1 text-xs">
                <li>• Log10(LHKPN / 1B) × 2.5</li>
                <li>• Rp 1 Miliar → ~2.5 poin</li>
                <li>• Rp 1 Triliun → ~10 poin</li>
                <li>• Maks 10 poin</li>
              </ul>
            </div>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <h4 className="font-semibold text-red-400 mb-2">⚠️ Penalti Korupsi</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div><span className="text-red-300 font-bold">Terpidana: −40</span></div>
              <div><span className="text-red-400 font-bold">Tersangka: −35</span></div>
              <div><span className="text-orange-400 font-bold">Tinggi: −15</span></div>
              <div><span className="text-amber-400 font-bold">Sedang: −5</span></div>
            </div>
          </div>
          <p className="text-xs text-white/40">
            Skor total dikunci pada rentang 0–100. Data diperbarui secara berkala berdasarkan posisi jabatan aktif,
            data LHKPN KPK, putusan pengadilan, dan status penyelidikan.
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Trending Sidebar ─────────────────────────────────────────────────────────

function TrendingSidebar({ allScored }) {
  const navigate = useNavigate()
  const personMap = useMemo(() => Object.fromEntries(PERSONS.map(p => [p.id, p])), [])

  return (
    <div className="space-y-4">
      {/* Rising */}
      <div className="bg-bg-elevated rounded-xl border border-white/5 p-4">
        <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          🔥 <span>Rising</span>
        </h3>
        <div className="space-y-2">
          {RISING.map(item => {
            const s = allScored.find(x => x.id === item.id)
            const p = personMap[item.id]
            return (
              <button
                key={item.id}
                onClick={() => s && navigate(`/persons/${item.id}`)}
                className="w-full flex items-center gap-2 hover:bg-white/5 rounded-lg p-1.5 transition-colors text-left"
              >
                {p ? <Avatar scored={s} person={p} size="sm" /> : (
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/40">?</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white truncate">{item.label}</div>
                  {s && <div className="text-[10px] text-white/40">Skor: {s.total}</div>}
                </div>
                <span className="text-emerald-400 text-xs font-bold flex-shrink-0">{item.delta}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Falling */}
      <div className="bg-bg-elevated rounded-xl border border-white/5 p-4">
        <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          📉 <span>Falling</span>
        </h3>
        <div className="space-y-2">
          {FALLING.map(item => {
            const s = allScored.find(x => x.id === item.id)
            const p = personMap[item.id]
            return (
              <button
                key={item.id}
                onClick={() => s && navigate(`/persons/${item.id}`)}
                className="w-full flex items-center gap-2 hover:bg-white/5 rounded-lg p-1.5 transition-colors text-left"
              >
                {p ? <Avatar scored={s} person={p} size="sm" /> : (
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/40">?</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white truncate">{item.label}</div>
                  {s && <div className="text-[10px] text-white/40">Skor: {s.total}</div>}
                </div>
                <span className="text-red-400 text-xs font-bold flex-shrink-0">{item.delta}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TIER_FILTERS = [
  { key: 'all',       label: 'Semua' },
  { key: 'nasional',  label: 'Nasional' },
  { key: 'provinsi',  label: 'Provinsi' },
  { key: 'kabupaten', label: 'Kabupaten' },
  { key: 'historis',  label: 'Historis' },
]

export default function RankingPage() {
  const navigate = useNavigate()
  const [tierFilter, setTierFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showMethodology, setShowMethodology] = useState(false)

  // Build person lookup
  const personMap = useMemo(() => Object.fromEntries(PERSONS.map(p => [p.id, p])), [])

  // Score & sort all
  const allScored = useMemo(() => scoreAllPersons(), [])
  const top50 = useMemo(() => allScored.slice(0, 50), [allScored])

  // Top 3 always from full unfiltered list
  const podium = top50.slice(0, 3)

  // Filter + search (applies to rank 4-50)
  const filtered = useMemo(() => {
    let list = top50.slice(3) // rank 4-50
    if (tierFilter !== 'all') {
      list = list.filter(s => s.tier === tierFilter)
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(s => s.name.toLowerCase().includes(q))
    }
    return list
  }, [top50, tierFilter, search])

  // Global rank for display (rank in original top50 list)
  const rankMap = useMemo(() => {
    const m = {}
    top50.forEach((s, i) => { m[s.id] = i + 1 })
    return m
  }, [top50])

  const lastUpdated = new Date().toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <div className="space-y-6 pb-12">
      {/* ── Section 1: Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            🏆 Power Rankings
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Top 50 Politisi Paling Berpengaruh Indonesia
          </p>
          <p className="text-white/40 text-xs mt-0.5">
            Berdasarkan posisi, jaringan, kekayaan, dan integritas
          </p>
          <p className="text-white/30 text-[11px] mt-1.5">
            Diperbarui: {lastUpdated} · {allScored.length} politisi terindeks
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportToCSV(
              top50.map((r, i) => ({
                rank: i + 1,
                nama: r.name,
                partai: r.party_id || '—',
                skor: r.total,
                tier: r.tier,
              })),
              'peta-politik-ranking'
            )}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 text-white/60 text-xs hover:bg-white/5 transition-colors"
          >
            ⬇️ Export CSV
          </button>
          <ShareButton title="PetaPolitik — Power Rankings" />
          <button
            onClick={() => setShowMethodology(v => !v)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 text-white/60 text-xs hover:bg-white/5 transition-colors"
          >
            📐 Metodologi {showMethodology ? '▴' : '▾'}
          </button>
        </div>
      </div>

      {/* Inline methodology (top) */}
      {showMethodology && (
        <div className="bg-bg-elevated rounded-xl border border-white/5 p-4">
          <p className="text-xs text-white/70 mb-3">
            Skor 0–100 dihitung dari 4 komponen utama dengan penalti korupsi:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-white/70">
            <div className="bg-red-500/10 rounded-lg p-2">
              <div className="text-red-400 font-bold mb-1">Posisi 40%</div>
              <div>Presiden=40, Menteri=28, Gubernur=22, DPR=10</div>
            </div>
            <div className="bg-orange-500/10 rounded-lg p-2">
              <div className="text-orange-400 font-bold mb-1">Jaringan 20%</div>
              <div>Koneksi × strength. Maks 20 poin</div>
            </div>
            <div className="bg-purple-500/10 rounded-lg p-2">
              <div className="text-purple-400 font-bold mb-1">Partai 20%</div>
              <div>Kursi DPR / 580 × 20</div>
            </div>
            <div className="bg-emerald-500/10 rounded-lg p-2">
              <div className="text-emerald-400 font-bold mb-1">Kekayaan 10%</div>
              <div>Log skala LHKPN. Maks 10 poin</div>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-red-400/80">
            Penalti: Terpidana −40 | Tersangka −35 | Risiko Tinggi −15 | Sedang −5
          </div>
        </div>
      )}

      {/* ── Section 2: Top 3 Podium ── */}
      <div>
        <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">🎖 Podium Teratas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* #2 */}
          <PodiumCard
            scored={podium[1]}
            rank={2}
            person={personMap[podium[1]?.id]}
            tall={false}
          />
          {/* #1 — center, taller */}
          <PodiumCard
            scored={podium[0]}
            rank={1}
            person={personMap[podium[0]?.id]}
            tall={true}
          />
          {/* #3 */}
          <PodiumCard
            scored={podium[2]}
            rank={3}
            person={personMap[podium[2]?.id]}
            tall={false}
          />
        </div>
      </div>

      {/* ── Main content + sidebar ── */}
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 min-w-0 space-y-4">
          {/* ── Filter + Search Bar ── */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Tier pills */}
            <div className="flex flex-wrap gap-1.5">
              {TIER_FILTERS.map(f => (
                <button
                  key={f.key}
                  onClick={() => setTierFilter(f.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    tierFilter === f.key
                      ? 'bg-red-500 text-white'
                      : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            {/* Search */}
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama politisi..."
                className="w-full bg-bg-elevated border border-white/10 rounded-lg pl-8 pr-4 py-1.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-red-500/50"
              />
            </div>
          </div>

          {/* ── Section 3: Rankings Table (rank 4–50) ── */}
          <div className="bg-bg-elevated rounded-xl border border-white/5 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">
                Peringkat #{tierFilter === 'all' && !search ? '4–50' : 'Terfilter'}
              </h2>
              <span className="text-xs text-white/40">{filtered.length} tokoh</span>
            </div>

            {/* Table header — hidden on mobile */}
            <div className="hidden md:grid grid-cols-[3rem_2fr_2fr_1fr_auto_auto] gap-3 px-4 py-2 border-b border-white/5 text-[10px] uppercase tracking-wider text-white/30">
              <div>#</div>
              <div>Tokoh</div>
              <div>Jabatan</div>
              <div>Skor</div>
              <div>Komponen</div>
              <div>Risiko</div>
            </div>

            <div className="divide-y divide-white/5">
              {filtered.length === 0 && (
                <div className="py-12 text-center text-white/30 text-sm">
                  Tidak ada hasil ditemukan
                </div>
              )}
              {filtered.map(scored => {
                const person = personMap[scored.id]
                const rank = rankMap[scored.id]
                const party = getParty(scored.party_id)

                return (
                  <div
                    key={scored.id}
                    onClick={() => navigate(`/persons/${scored.id}`)}
                    className="flex md:grid md:grid-cols-[3rem_2fr_2fr_1fr_auto_auto] items-center gap-3 px-4 py-3 hover:bg-white/3 cursor-pointer transition-colors"
                  >
                    {/* Rank */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-xs font-bold text-white/60 w-5 text-right">{rank}</span>
                      <TrendArrow risk={scored.corruption_risk} />
                    </div>

                    {/* Person */}
                    <div className="flex items-center gap-2 min-w-0 flex-1 md:flex-none">
                      <Avatar scored={scored} person={person} size="sm" />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate">{scored.name}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span
                            className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white"
                            style={{ backgroundColor: party.color + 'cc' }}
                          >
                            {party.abbr}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Jabatan — hidden on mobile */}
                    <div className="hidden md:block min-w-0">
                      <p className="text-xs text-white/50 truncate">{scored.position_title}</p>
                    </div>

                    {/* Skor */}
                    <div className="flex-shrink-0 flex flex-col items-center gap-1 min-w-[56px]">
                      <span className="text-sm font-black text-white">{scored.total}</span>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${scored.total}%`,
                            backgroundColor: scored.total >= 60 ? '#ef4444' : scored.total >= 40 ? '#f97316' : '#6b7280',
                          }}
                        />
                      </div>
                    </div>

                    {/* Component pills — hidden on mobile */}
                    <div className="hidden md:flex items-center gap-1">
                      {[
                        { v: scored.position_score, c: '#ef4444', t: 'P' },
                        { v: scored.network_score,  c: '#f97316', t: 'N' },
                        { v: scored.party_score,    c: '#8b5cf6', t: 'Pa' },
                        { v: scored.lhkpn_score,    c: '#22c55e', t: 'K' },
                      ].map(({ v, c, t }) => (
                        <div key={t} className="text-center">
                          <div
                            className="text-[9px] font-bold px-1 py-0.5 rounded"
                            style={{ backgroundColor: c + '22', color: c }}
                          >
                            {t}:{v}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Corruption Risk */}
                    <div className="hidden md:flex flex-shrink-0">
                      <CorruptionBadge risk={scored.corruption_risk} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Section 4: Score Distribution ── */}
          <ScoreHistogram allScored={allScored} />

          {/* ── Section 5: Methodology Accordion ── */}
          <Methodology />
        </div>

        {/* ── Sidebar: Trending ── */}
        <div className="w-full xl:w-64 flex-shrink-0">
          <TrendingSidebar allScored={allScored} />
        </div>
      </div>
    </div>
  )
}
