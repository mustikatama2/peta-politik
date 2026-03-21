import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts'
import { PERSONS } from '../../data/persons'
import { PARTY_MAP } from '../../data/parties'
import { CONNECTIONS } from '../../data/connections'
import { BILLS } from '../../data/voting_records'
import { scoreIndividu } from '../../lib/scoring'
import { Avatar, Badge, Card, Btn, formatIDR, PageHeader } from '../../components/ui'

const POPULAR_IDS = ['prabowo', 'jokowi', 'anies', 'megawati', 'gibran', 'khofifah', 'ahy', 'ganjar']

const RISK_CONFIG = {
  rendah:    { label: '✓ Bersih',     cls: 'risk-rendah' },
  sedang:    { label: '⚠ Sedang',     cls: 'risk-sedang' },
  tinggi:    { label: '⚠ Tinggi',     cls: 'risk-tinggi' },
  tersangka: { label: '🔴 Tersangka', cls: 'risk-tersangka' },
  terpidana: { label: '⛔ Terpidana', cls: 'risk-terpidana' },
}

function corruptionToScore(person) {
  return {
    rendah: 9, sedang: 6, tinggi: 3, tersangka: 1, terpidana: 0
  }[person.analysis?.corruption_risk] ?? 5
}

function computeAge(born) {
  if (!born) return null
  const parts = born.split(' ')
  // Format: "17 Oct 1951"
  if (parts.length === 3) {
    const year = parseInt(parts[2])
    if (!isNaN(year)) return new Date().getFullYear() - year
  }
  const y = parseInt(born)
  if (!isNaN(y)) return new Date().getFullYear() - y
  return null
}

// ─── PERSON SELECTOR ─────────────────────────────────────────────────────────

function PersonSelector({ label, value, onChange, exclude }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const filtered = useMemo(() => {
    if (!query) return PERSONS.filter(p => p.id !== exclude).slice(0, 20)
    const q = query.toLowerCase()
    return PERSONS
      .filter(p => p.id !== exclude && (p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)))
      .slice(0, 15)
  }, [query, exclude])

  const selected = value ? PERSONS.find(p => p.id === value) : null
  const party = selected ? PARTY_MAP[selected.party_id] : null
  const currentPos = selected?.positions?.find(p => p.is_current)

  return (
    <div className="relative flex-1 min-w-0">
      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">{label}</p>
      {selected ? (
        <div
          className="flex items-center gap-3 p-3 bg-bg-card border border-border rounded-xl cursor-pointer hover:border-gray-500 transition-colors"
          onClick={() => { onChange(null); setQuery('') }}
        >
          <Avatar name={selected.name} photoUrl={selected.photo_url} color={party?.color} size="md" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">{selected.name}</p>
            {currentPos && <p className="text-xs text-text-secondary truncate">{currentPos.title}</p>}
          </div>
          <span className="text-text-muted text-xs">✕ ganti</span>
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
            placeholder="Cari nama tokoh..."
            className="w-full px-4 py-3 bg-bg-card border border-border rounded-xl text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-red transition-colors"
          />
          {open && filtered.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-bg-card border border-border rounded-xl shadow-xl z-20 max-h-64 overflow-y-auto">
              {filtered.map(p => {
                const pt = PARTY_MAP[p.party_id]
                const pos = p.positions?.find(x => x.is_current)
                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-bg-elevated cursor-pointer transition-colors"
                    onMouseDown={() => { onChange(p.id); setQuery(''); setOpen(false) }}
                  >
                    <Avatar name={p.name} photoUrl={p.photo_url} color={pt?.color} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{p.name}</p>
                      {pos && <p className="text-xs text-text-secondary truncate">{pos.title}</p>}
                    </div>
                    {pt && (
                      <span className="text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0"
                        style={{ backgroundColor: pt.color + '22', color: pt.color }}>
                        {pt.abbr}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── SECTION TITLE ────────────────────────────────────────────────────────────

function SectionTitle({ children }) {
  return (
    <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3 flex items-center gap-2">
      <span className="flex-1 h-px bg-border" />
      {children}
      <span className="flex-1 h-px bg-border" />
    </h3>
  )
}

// ─── MAIN COMPARE VIEW ────────────────────────────────────────────────────────

function CompareView({ personA, personB, onReset }) {
  const navigate = useNavigate()
  const partyA = PARTY_MAP[personA.party_id]
  const partyB = PARTY_MAP[personB.party_id]
  const posA = personA.positions?.find(p => p.is_current)
  const posB = personB.positions?.find(p => p.is_current)
  const riskA = personA.analysis?.corruption_risk || 'rendah'
  const riskB = personB.analysis?.corruption_risk || 'rendah'

  const colorA = partyA?.color || '#EF4444'
  const colorB = partyB?.color || '#3B82F6'

  // Scoring
  const scoreA = useMemo(() => scoreIndividu(personA, CONNECTIONS), [personA])
  const scoreB = useMemo(() => scoreIndividu(personB, CONNECTIONS), [personB])

  // Connections
  const aEdges = useMemo(() => CONNECTIONS.filter(c => c.from === personA.id || c.to === personA.id), [personA])
  const bEdges = useMemo(() => CONNECTIONS.filter(c => c.from === personB.id || c.to === personB.id), [personB])
  const aConns = useMemo(() => new Set(aEdges.map(c => c.from === personA.id ? c.to : c.from)), [aEdges, personA])
  const bConns = useMemo(() => new Set(bEdges.map(c => c.from === personB.id ? c.to : c.from)), [bEdges, personB])
  const directlyConnected = useMemo(() => aConns.has(personB.id) || bConns.has(personA.id), [aConns, bConns, personA, personB])
  const commonFriendIds = useMemo(() =>
    [...aConns].filter(id => bConns.has(id) && id !== personA.id && id !== personB.id),
    [aConns, bConns, personA, personB]
  )
  const commonFriends = useMemo(() =>
    commonFriendIds.map(id => PERSONS.find(p => p.id === id)).filter(Boolean).slice(0, 5),
    [commonFriendIds]
  )

  // Connection type breakdown
  const connTypesA = useMemo(() => {
    const types = {}
    aEdges.forEach(e => { types[e.type || 'lainnya'] = (types[e.type || 'lainnya'] || 0) + 1 })
    return types
  }, [aEdges])
  const connTypesB = useMemo(() => {
    const types = {}
    bEdges.forEach(e => { types[e.type || 'lainnya'] = (types[e.type || 'lainnya'] || 0) + 1 })
    return types
  }, [bEdges])
  const allConnTypes = useMemo(() => {
    return [...new Set([...Object.keys(connTypesA), ...Object.keys(connTypesB)])]
  }, [connTypesA, connTypesB])

  // Age
  const ageA = computeAge(personA.born)
  const ageB = computeAge(personB.born)

  // Radar data
  const radarData = useMemo(() => [
    { subject: 'Nasionalisme', A: personA.analysis?.nationalism || 5, B: personB.analysis?.nationalism || 5 },
    { subject: 'Religiusitas',  A: personA.analysis?.religiosity || 5,  B: personB.analysis?.religiosity || 5 },
    { subject: 'Populisme',     A: personA.analysis?.populism_score || 5, B: personB.analysis?.populism_score || 5 },
    { subject: 'Transparansi',  A: corruptionToScore(personA), B: corruptionToScore(personB) },
    { subject: 'Ideologi',      A: Math.max(0, Math.min(10, (personA.analysis?.ideology_score || 0) + 5)), B: Math.max(0, Math.min(10, (personB.analysis?.ideology_score || 0) + 5)) },
  ], [personA, personB])

  // Scoring breakdown chart
  const chartData = [
    { metric: 'Posisi', A: scoreA.position_score, B: scoreB.position_score },
    { metric: 'Jaringan', A: scoreA.network_score, B: scoreB.network_score },
    { metric: 'Partai', A: scoreA.party_score, B: scoreB.party_score },
    { metric: 'LHKPN', A: scoreA.lhkpn_score, B: scoreB.lhkpn_score },
  ]

  // Voting record comparison — based on party_id
  const votingComparison = useMemo(() => {
    return BILLS.map(bill => {
      const voteA = personA.party_id ? (bill.party_positions[personA.party_id] || null) : null
      const voteB = personB.party_id ? (bill.party_positions[personB.party_id] || null) : null
      const same = voteA && voteB && voteA === voteB
      return { bill, voteA, voteB, same }
    }).filter(r => r.voteA || r.voteB)
  }, [personA, personB])

  const agreementRate = useMemo(() => {
    const both = votingComparison.filter(r => r.voteA && r.voteB)
    if (both.length === 0) return null
    const agreed = both.filter(r => r.same).length
    return Math.round((agreed / both.length) * 100)
  }, [votingComparison])

  // Career timeline
  const timelineData = useMemo(() => {
    const years = []
    for (let y = 1990; y <= 2025; y++) {
      const positionsA = (personA.positions || []).filter(p => {
        const s = parseInt(p.start) || 0
        const e = parseInt(p.end) || 2025
        return y >= s && y <= e
      })
      const positionsB = (personB.positions || []).filter(p => {
        const s = parseInt(p.start) || 0
        const e = parseInt(p.end) || 2025
        return y >= s && y <= e
      })
      years.push({
        year: y,
        A: positionsA.length > 0 ? 1 : 0,
        B: positionsB.length > 0 ? 1 : 0,
        labelA: positionsA[0]?.title,
        labelB: positionsB[0]?.title,
      })
    }
    return years.filter(y => y.A > 0 || y.B > 0)
  }, [personA, personB])

  const ideologyA = personA.analysis?.ideology_score ?? null
  const ideologyB = personB.analysis?.ideology_score ?? null

  const nameA = personA.name.split(' ')[0]
  const nameB = personB.name.split(' ')[0]

  // Wealth comparison
  const wealthMax = Math.max(personA.lhkpn_latest || 0, personB.lhkpn_latest || 0, 1)

  // News mentions
  const [newsData, setNewsData] = useState(null)
  const [newsLoading, setNewsLoading] = useState(false)

  useEffect(() => {
    setNewsLoading(true)
    fetch('/api/news?limit=100')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        setNewsData(data)
        setNewsLoading(false)
      })
      .catch(() => setNewsLoading(false))
  }, [])

  const newsMentionsA = useMemo(() => {
    if (!newsData?.articles) return []
    const names = [personA.name, nameA, ...(personA.name.split(' ').slice(0, 2))]
    return newsData.articles.filter(a => {
      const text = `${a.title} ${a.summary || ''}`.toLowerCase()
      return names.some(n => text.includes(n.toLowerCase()))
    })
  }, [newsData, personA, nameA])

  const newsMentionsB = useMemo(() => {
    if (!newsData?.articles) return []
    const names = [personB.name, nameB, ...(personB.name.split(' ').slice(0, 2))]
    return newsData.articles.filter(a => {
      const text = `${a.title} ${a.summary || ''}`.toLowerCase()
      return names.some(n => text.includes(n.toLowerCase()))
    })
  }, [newsData, personB, nameB])

  const lastMentionA = newsMentionsA[0]?.published_at || newsMentionsA[0]?.date || null
  const lastMentionB = newsMentionsB[0]?.published_at || newsMentionsB[0]?.date || null

  // Key differences summary
  const p1Score = scoreA.total
  const p2Score = scoreB.total
  const p1Conns = aEdges.length
  const p2Conns = bEdges.length

  const summary = `${personA.name} ${p1Score > p2Score ? 'lebih berpengaruh' : 'kurang berpengaruh'} dari ${personB.name} berdasarkan skor kekuasaan (${p1Score} vs ${p2Score}). ${personA.name} memiliki ${p1Conns} koneksi vs ${p2Conns} koneksi ${personB.name}.${agreementRate !== null ? ` Tingkat kesamaan voting: ${agreementRate}%.` : ''}${personA.lhkpn_latest && personB.lhkpn_latest ? ` Kekayaan: ${nameA} ${formatIDR(personA.lhkpn_latest)} vs ${nameB} ${formatIDR(personB.lhkpn_latest)}.` : ''}`

  // Vote label helper
  const voteLabel = (vote) => {
    if (!vote) return { text: '—', cls: 'text-text-muted', icon: '' }
    if (vote === 'setuju') return { text: 'Setuju', cls: 'text-green-400', icon: '✅' }
    if (vote === 'menolak') return { text: 'Menolak', cls: 'text-red-400', icon: '❌' }
    if (vote === 'abstain') return { text: 'Abstain', cls: 'text-yellow-400', icon: '🟡' }
    return { text: vote, cls: 'text-text-muted', icon: '' }
  }

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <Btn variant="secondary" size="sm" onClick={onReset}>← Kembali</Btn>
        <div className="flex-1 text-center">
          <h1 className="text-lg font-bold text-text-primary">
            <span style={{ color: colorA }}>{personA.name}</span>
            <span className="text-text-muted mx-3">vs</span>
            <span style={{ color: colorB }}>{personB.name}</span>
          </h1>
        </div>
        <Btn
          variant="secondary"
          size="sm"
          onClick={() => navigate(`/compare/${personA.id}/${personB.id}`)}
        >
          🔗 Bagikan
        </Btn>
      </div>

      {/* ── SECTION 1: Side-by-side stat cards ── */}
      <div>
        <SectionTitle>📋 Profil</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          {[
            { p: personA, party: partyA, pos: posA, risk: riskA, score: scoreA, color: colorA, age: ageA, edges: aEdges },
            { p: personB, party: partyB, pos: posB, risk: riskB, score: scoreB, color: colorB, age: ageB, edges: bEdges },
          ].map(({ p, party, pos, risk, score, color, age, edges }) => (
            <Card key={p.id} className="p-5 flex flex-col items-center text-center gap-3"
              style={party ? { borderTopColor: color, borderTopWidth: 3 } : {}}>
              <Link to={`/persons/${p.id}`}>
                <Avatar name={p.name} photoUrl={p.photo_url} color={color} size="xl"
                  className="ring-4 ring-bg-card hover:ring-accent-red transition-all" />
              </Link>
              <div>
                <Link to={`/persons/${p.id}`}>
                  <h2 className="text-base font-bold text-text-primary hover:text-accent-blue transition-colors">{p.name}</h2>
                </Link>
                {pos && <p className="text-xs text-text-secondary mt-0.5">{pos.title}</p>}
                {pos?.region && <p className="text-xs text-text-muted">{pos.region}</p>}
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {party && <Badge color={color}>{party.logo_emoji} {party.abbr}</Badge>}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${RISK_CONFIG[risk]?.cls}`}>
                  {RISK_CONFIG[risk]?.label}
                </span>
                {p.tier && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-bg-elevated text-text-secondary border border-border">
                    {p.tier}
                  </span>
                )}
              </div>

              {/* Power Score */}
              <div className="w-full">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-text-secondary">Skor Pengaruh</span>
                  <span className="text-xl font-bold" style={{ color }}>{score.total}</span>
                </div>
                <div className="h-2 rounded-full bg-bg-elevated overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${score.total}%`, backgroundColor: color }} />
                </div>
                <div className="grid grid-cols-4 gap-1 mt-2">
                  {[
                    { label: 'Posisi', val: score.position_score },
                    { label: 'Jaringan', val: score.network_score },
                    { label: 'Partai', val: score.party_score },
                    { label: 'LHKPN', val: score.lhkpn_score },
                  ].map(({ label, val }) => (
                    <div key={label} className="text-center">
                      <div className="text-xs font-semibold text-text-primary">{val}</div>
                      <div className="text-[9px] text-text-muted">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Stats */}
              <div className="w-full space-y-1.5 text-xs text-left">
                {p.lhkpn_latest && (
                  <div className="flex justify-between">
                    <span className="text-text-muted">💰 LHKPN</span>
                    <span className="font-medium text-accent-gold">{formatIDR(p.lhkpn_latest)}</span>
                  </div>
                )}
                {age && (
                  <div className="flex justify-between">
                    <span className="text-text-muted">🎂 Usia</span>
                    <span className="font-medium text-text-primary">{age} tahun</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-text-muted">🕸 Koneksi</span>
                  <span className="font-medium text-text-primary">{edges.length}</span>
                </div>
                {p.party_role && (
                  <div className="flex justify-between">
                    <span className="text-text-muted">🏛 Peran</span>
                    <span className="font-medium text-text-primary truncate max-w-[120px]">{p.party_role}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ── SECTION 2: Radar Chart ── */}
      <div>
        <SectionTitle>🕸 Radar Karakter</SectionTitle>
        <Card className="p-5">
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 10]} tick={{ fill: '#6B7280', fontSize: 9 }} tickCount={6} />
                <Radar name={nameA} dataKey="A" stroke={colorA} fill={colorA} fillOpacity={0.2} strokeWidth={2} />
                <Radar name={nameB} dataKey="B" stroke={colorB} fill={colorB} fillOpacity={0.2} strokeWidth={2} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#9CA3AF' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E2235', border: '1px solid #2D3748', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(v) => [`${v}/10`, '']}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-5 gap-1 text-center">
            {radarData.map(d => (
              <div key={d.subject} className="text-[10px]">
                <div className="text-text-muted">{d.subject}</div>
                <div className="flex justify-center gap-2 mt-0.5">
                  <span style={{ color: colorA }}>{d.A}</span>
                  <span className="text-text-muted">/</span>
                  <span style={{ color: colorB }}>{d.B}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── SECTION 3: Wealth Bar Comparison ── */}
      {(personA.lhkpn_latest || personB.lhkpn_latest) && (
        <div>
          <SectionTitle>💰 Perbandingan Kekayaan (LHKPN)</SectionTitle>
          <Card className="p-5 space-y-4">
            <div className="text-center text-xs text-text-muted mb-2">
              {personA.lhkpn_latest && personB.lhkpn_latest
                ? (personA.lhkpn_latest > personB.lhkpn_latest
                  ? `${nameA} lebih kaya ${((personA.lhkpn_latest / personB.lhkpn_latest)).toFixed(1)}× lipat`
                  : `${nameB} lebih kaya ${((personB.lhkpn_latest / personA.lhkpn_latest)).toFixed(1)}× lipat`)
                : 'Bandingkan kekayaan berdasarkan LHKPN'}
            </div>
            {[
              { p: personA, color: colorA, name: nameA },
              { p: personB, color: colorB, name: nameB },
            ].map(({ p, color, name }) => {
              const pct = p.lhkpn_latest ? Math.min((p.lhkpn_latest / wealthMax) * 100, 100) : 0
              const isWinner = p.lhkpn_latest && (!personA.lhkpn_latest || !personB.lhkpn_latest || p.lhkpn_latest >= wealthMax)
              return (
                <div key={p.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium" style={{ color }}>{name}</span>
                    <div className="flex items-center gap-2">
                      {isWinner && personA.lhkpn_latest && personB.lhkpn_latest && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-gold/20 text-accent-gold border border-accent-gold/30">
                          🏆 Lebih kaya
                        </span>
                      )}
                      <span className="text-sm font-bold text-accent-gold">
                        {p.lhkpn_latest ? formatIDR(p.lhkpn_latest) : '—'}
                      </span>
                    </div>
                  </div>
                  <div className="h-4 rounded-full bg-bg-elevated overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(to right, ${color}88, ${color})`,
                      }}
                    />
                  </div>
                  {p.lhkpn_year && (
                    <div className="text-[10px] text-text-muted mt-0.5 text-right">Data {p.lhkpn_year}</div>
                  )}
                </div>
              )
            })}
          </Card>
        </div>
      )}

      {/* ── SECTION 4: Voting Record ── */}
      <div>
        <SectionTitle>🗳 Rekam Jejak Voting</SectionTitle>
        <Card className="p-5">
          {agreementRate !== null && (
            <div className="flex items-center justify-center gap-3 mb-4 p-3 rounded-xl bg-bg-elevated border border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-text-primary">{agreementRate}%</div>
                <div className="text-xs text-text-muted">Tingkat Kesamaan Voting</div>
              </div>
              <div className="w-24 h-24 relative">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none"
                    stroke={agreementRate >= 70 ? '#22C55E' : agreementRate >= 40 ? '#F59E0B' : '#EF4444'}
                    strokeWidth="3"
                    strokeDasharray={`${agreementRate} ${100 - agreementRate}`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          )}

          {votingComparison.length === 0 ? (
            <p className="text-sm text-text-muted italic text-center">Data voting partai tidak tersedia untuk kedua tokoh.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 text-text-muted font-semibold w-1/2">RUU / UU</th>
                    <th className="text-center py-2 px-2 text-text-muted font-semibold" style={{ color: colorA }}>{nameA}</th>
                    <th className="text-center py-2 px-2 text-text-muted font-semibold" style={{ color: colorB }}>{nameB}</th>
                  </tr>
                </thead>
                <tbody>
                  {votingComparison.map(({ bill, voteA, voteB, same }) => {
                    const la = voteLabel(voteA)
                    const lb = voteLabel(voteB)
                    const opposing = voteA && voteB && !same && voteA !== 'abstain' && voteB !== 'abstain'
                    return (
                      <tr
                        key={bill.id}
                        className={`border-b border-border/50 transition-colors ${
                          same ? 'bg-bg-elevated/30' : opposing ? 'bg-red-900/10' : ''
                        }`}
                      >
                        <td className="py-2 px-2">
                          <div className="font-medium text-text-primary">{bill.short}</div>
                          <div className="text-text-muted">{bill.date?.slice(0, 4)}</div>
                        </td>
                        <td className="py-2 px-2 text-center">
                          <span className={`font-medium ${la.cls}`}>
                            {la.icon} {la.text}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-center">
                          <span className={`font-medium ${lb.cls}`}>
                            {lb.icon} {lb.text}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-3 flex gap-3 text-[10px] text-text-muted flex-wrap">
            <span>🟦 Baris abu = Sama-sama setuju/menolak</span>
            <span>🟥 Baris merah = Berbeda posisi</span>
          </div>
        </Card>
      </div>

      {/* ── SECTION 5: Network Comparison ── */}
      <div>
        <SectionTitle>🕸 Perbandingan Jaringan</SectionTitle>
        <Card className="p-5 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-bg-elevated border border-border">
              <div className="text-2xl font-bold" style={{ color: colorA }}>{aEdges.length}</div>
              <div className="text-xs text-text-muted mt-1">Koneksi {nameA}</div>
            </div>
            <div className="p-3 rounded-xl bg-bg-elevated border border-border">
              <div className="text-lg font-bold text-text-primary">{commonFriendIds.length}</div>
              <div className="text-xs text-text-muted mt-1">Kenalan Bersama</div>
              <div className="text-[10px] text-green-400 mt-0.5">
                {directlyConnected ? '✅ Terhubung langsung' : '⭕ Tidak langsung'}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-bg-elevated border border-border">
              <div className="text-2xl font-bold" style={{ color: colorB }}>{bEdges.length}</div>
              <div className="text-xs text-text-muted mt-1">Koneksi {nameB}</div>
            </div>
          </div>

          {/* Common friends */}
          {commonFriends.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-text-secondary mb-2">Kenalan Bersama (top {commonFriends.length}):</p>
              <div className="flex flex-wrap gap-2">
                {commonFriends.map(p => {
                  const pt = PARTY_MAP[p.party_id]
                  return (
                    <Link key={p.id} to={`/persons/${p.id}`}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-bg-elevated border border-border hover:border-gray-500 transition-colors">
                      <Avatar name={p.name} photoUrl={p.photo_url} color={pt?.color} size="xs" />
                      <span className="text-xs text-text-primary">{p.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Connection type breakdown */}
          {allConnTypes.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-text-secondary mb-2">Tipe Koneksi:</p>
              <div className="space-y-1.5">
                {allConnTypes.map(type => {
                  const cA = connTypesA[type] || 0
                  const cB = connTypesB[type] || 0
                  const maxVal = Math.max(cA, cB, 1)
                  return (
                    <div key={type} className="grid grid-cols-[1fr_80px_1fr] gap-2 items-center">
                      <div className="flex justify-end">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-text-primary">{cA}</span>
                          <div className="h-2 rounded-full" style={{ width: `${(cA / maxVal) * 60}px`, backgroundColor: colorA }} />
                        </div>
                      </div>
                      <div className="text-[10px] text-text-muted text-center capitalize">{type}</div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 rounded-full" style={{ width: `${(cB / maxVal) * 60}px`, backgroundColor: colorB }} />
                        <span className="text-xs text-text-primary">{cB}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* ── SECTION 6: Scoring Breakdown ── */}
      <div>
        <SectionTitle>📊 Perbandingan Skor Pengaruh</SectionTitle>
        <Card className="p-5">
          <div className="grid grid-cols-3 mb-4 text-center">
            <div>
              <p className="text-2xl font-bold" style={{ color: colorA }}>{scoreA.total}</p>
              <p className="text-xs text-text-secondary">{nameA}</p>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-text-muted text-sm font-medium">vs</span>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: colorB }}>{scoreB.total}</p>
              <p className="text-xs text-text-secondary">{nameB}</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="metric" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E2235', border: '1px solid #2D3748', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="A" name={nameA} fill={colorA} radius={[3, 3, 0, 0]} />
              <Bar dataKey="B" name={nameB} fill={colorB} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ── SECTION 7: News Mentions ── */}
      <div>
        <SectionTitle>📰 Sebutan di Berita</SectionTitle>
        <Card className="p-5">
          {newsLoading ? (
            <div className="text-center text-text-muted text-sm py-4">Memuat berita...</div>
          ) : !newsData ? (
            <div className="text-center text-text-muted text-sm py-4 italic">Tidak dapat memuat berita saat ini.</div>
          ) : (
            <div className="space-y-4">
              {/* Count comparison */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { person: personA, mentions: newsMentionsA, lastMention: lastMentionA, color: colorA, name: nameA },
                  { person: personB, mentions: newsMentionsB, lastMention: lastMentionB, color: colorB, name: nameB },
                ].map(({ person, mentions, lastMention, color, name }) => (
                  <div key={person.id} className="p-3 rounded-xl bg-bg-elevated border border-border">
                    <div className="text-center mb-2">
                      <div className="text-3xl font-bold" style={{ color }}>{mentions.length}</div>
                      <div className="text-xs text-text-muted">artikel menyebut {name}</div>
                    </div>
                    {lastMention && (
                      <div className="text-[10px] text-text-muted text-center mb-2">
                        Terakhir: {lastMention.slice(0, 10)}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Recent articles for each */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { person: personA, mentions: newsMentionsA, color: colorA, name: nameA },
                  { person: personB, mentions: newsMentionsB, color: colorB, name: nameB },
                ].map(({ person, mentions, color, name }) => (
                  <div key={person.id}>
                    <p className="text-xs font-semibold mb-2" style={{ color }}>{name} — 3 artikel terbaru</p>
                    {mentions.slice(0, 3).length === 0 ? (
                      <p className="text-xs text-text-muted italic">Tidak ada berita ditemukan.</p>
                    ) : (
                      <div className="space-y-2">
                        {mentions.slice(0, 3).map((a, i) => (
                          <div key={i} className="border border-border rounded-lg p-2">
                            <a href={a.url} target="_blank" rel="noreferrer"
                              className="text-xs font-medium text-text-primary hover:text-accent-blue line-clamp-2 transition-colors">
                              {a.title}
                            </a>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-text-muted">
                              {a.source && <span>{a.source}</span>}
                              {(a.published_at || a.date) && <span>•</span>}
                              {(a.published_at || a.date) && <span>{(a.published_at || a.date).slice(0, 10)}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* ── QUICK STATS ROW ── */}
      <div>
        <SectionTitle>⚡ Statistik Cepat</SectionTitle>
        <div className="grid grid-cols-1 gap-3">
          {/* Ideology slider */}
          {(ideologyA !== null || ideologyB !== null) && (
            <Card className="p-4">
              <div className="grid grid-cols-3 items-center gap-2">
                <div className="text-center">
                  <p className="text-xs text-text-secondary mb-1">⬅ Ideologi {nameA}</p>
                  <p className="text-sm font-bold text-text-primary">{ideologyA ?? '—'}</p>
                </div>
                <div className="text-center text-xs text-text-muted">← Kiri / Kanan →</div>
                <div className="text-center">
                  <p className="text-xs text-text-secondary mb-1">Ideologi {nameB} ➡</p>
                  <p className="text-sm font-bold text-text-primary">{ideologyB ?? '—'}</p>
                </div>
              </div>
              <div className="mt-3 relative h-3 bg-gradient-to-r from-red-900 via-bg-elevated to-blue-900 rounded-full">
                {ideologyA !== null && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md"
                    style={{ left: `calc(${((ideologyA + 10) / 20) * 100}% - 8px)`, backgroundColor: colorA }}
                    title={`${nameA}: ${ideologyA}`}
                  />
                )}
                {ideologyB !== null && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md"
                    style={{ left: `calc(${((ideologyB + 10) / 20) * 100}% - 8px)`, backgroundColor: colorB }}
                    title={`${nameB}: ${ideologyB}`}
                  />
                )}
              </div>
              <div className="flex justify-between text-[10px] text-text-muted mt-1">
                <span>-10 (Kiri)</span><span>0</span><span>+10 (Kanan)</span>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* ── CAREER TIMELINE ── */}
      {timelineData.length > 0 && (
        <div>
          <SectionTitle>📅 Timeline Karier</SectionTitle>
          <Card className="p-5">
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
                  tickFormatter={v => v % 5 === 0 ? v : ''} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E2235', border: '1px solid #2D3748', borderRadius: 8, fontSize: 11 }}
                  formatter={(val, name, props) => {
                    if (val === 0) return ['Tidak aktif', name]
                    const label = name === nameA ? props.payload.labelA : props.payload.labelB
                    return [label || 'Aktif', name]
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line dataKey="A" name={nameA} stroke={colorA} strokeWidth={2} dot={false} type="stepAfter" />
                <Line dataKey="B" name={nameB} stroke={colorB} strokeWidth={2} dot={false} type="stepAfter" />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {[
                { p: personA, color: colorA, name: nameA },
                { p: personB, color: colorB, name: nameB },
              ].map(({ p, color, name }) => (
                <div key={p.id}>
                  <p className="text-xs font-semibold mb-2" style={{ color }}>{name}</p>
                  <div className="space-y-1.5">
                    {[...(p.positions || [])].sort((a, b) => (b.start || 0) - (a.start || 0)).map((pos, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                        <span className="text-text-primary truncate">{pos.title}</span>
                        <span className="text-text-muted flex-shrink-0">{pos.start}{pos.end ? `–${pos.end}` : '–kini'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── CONTROVERSIES ── */}
      <div>
        <SectionTitle>⚠ Kontroversi</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { p: personA, color: colorA, name: nameA },
            { p: personB, color: colorB, name: nameB },
          ].map(({ p, color, name }) => (
            <Card key={p.id} className="p-5">
              <h4 className="text-xs font-bold mb-3" style={{ color }}>{name}</h4>
              {p.controversies?.length > 0 ? (
                <div className="space-y-2">
                  {p.controversies.map((c, i) => (
                    <div key={i} className="border border-red-500/20 rounded-lg p-2.5">
                      <p className="text-xs font-medium text-text-primary">{c.title}</p>
                      <p className="text-xs text-text-secondary mt-0.5">{c.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-text-muted italic">Tidak ada kontroversi tercatat.</p>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* ── SECTION 7: Key Differences Summary ── */}
      <div>
        <SectionTitle>📝 Ringkasan Perbedaan</SectionTitle>
        <Card className="p-5">
          <div className="prose prose-sm prose-invert max-w-none">
            <p className="text-text-secondary leading-relaxed text-sm">{summary}</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              {
                label: 'Skor Pengaruh',
                winner: scoreA.total >= scoreB.total ? nameA : nameB,
                valA: scoreA.total,
                valB: scoreB.total,
              },
              {
                label: 'Jumlah Koneksi',
                winner: aEdges.length >= bEdges.length ? nameA : nameB,
                valA: aEdges.length,
                valB: bEdges.length,
              },
              ...(personA.lhkpn_latest && personB.lhkpn_latest ? [{
                label: 'Kekayaan LHKPN',
                winner: personA.lhkpn_latest >= personB.lhkpn_latest ? nameA : nameB,
                valA: formatIDR(personA.lhkpn_latest),
                valB: formatIDR(personB.lhkpn_latest),
              }] : []),
              ...(ageA && ageB ? [{
                label: 'Usia Lebih Muda',
                winner: ageA <= ageB ? nameA : nameB,
                valA: `${ageA}th`,
                valB: `${ageB}th`,
              }] : []),
            ].map(({ label, winner, valA, valB }) => (
              <div key={label} className="p-3 rounded-xl bg-bg-elevated border border-border">
                <div className="text-xs text-text-muted mb-1">{label}</div>
                <div className="flex justify-between items-center">
                  <span className="text-xs" style={{ color: colorA }}>{String(valA)}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-card border border-border text-text-muted">
                    🏆 {winner}
                  </span>
                  <span className="text-xs" style={{ color: colorB }}>{String(valB)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── BOTTOM CTA ── */}
      <div className="flex gap-3 justify-center flex-wrap pb-4">
        <Btn variant="secondary" onClick={onReset}>⬅ Bandingkan dengan Tokoh Lain</Btn>
        <Link to={`/persons/${personA.id}`}><Btn variant="ghost">Profil {nameA}</Btn></Link>
        <Link to={`/persons/${personB.id}`}><Btn variant="ghost">Profil {nameB}</Btn></Link>
        <Link to="/persons"><Btn variant="ghost">📋 Daftar Semua Tokoh</Btn></Link>
      </div>
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function ComparePage() {
  const { id1, id2 } = useParams()
  const navigate = useNavigate()

  const [selectedA, setSelectedA] = useState(id1 || null)
  const [selectedB, setSelectedB] = useState(id2 || null)

  useEffect(() => {
    if (id1) setSelectedA(id1)
    if (id2) setSelectedB(id2)
  }, [id1, id2])

  useEffect(() => {
    if (selectedA && selectedB) {
      navigate(`/compare/${selectedA}/${selectedB}`, { replace: true })
    } else if (selectedA) {
      navigate(`/compare/${selectedA}`, { replace: true })
    } else {
      navigate('/compare', { replace: true })
    }
  }, [selectedA, selectedB]) // eslint-disable-line react-hooks/exhaustive-deps

  const personA = selectedA ? PERSONS.find(p => p.id === selectedA) : null
  const personB = selectedB ? PERSONS.find(p => p.id === selectedB) : null

  const popularPersons = POPULAR_IDS.map(id => PERSONS.find(p => p.id === id)).filter(Boolean)

  if (personA && personB) {
    return (
      <CompareView
        personA={personA}
        personB={personB}
        onReset={() => { setSelectedA(null); setSelectedB(null) }}
      />
    )
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="⚖️ Perbandingan Tokoh"
        subtitle="Pilih dua tokoh untuk perbandingan mendalam side-by-side"
      />

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
          <PersonSelector
            label="Tokoh Pertama"
            value={selectedA}
            onChange={setSelectedA}
            exclude={selectedB}
          />
          <div className="flex items-center justify-center flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-text-muted text-sm font-bold">
              vs
            </div>
          </div>
          <PersonSelector
            label="Tokoh Kedua"
            value={selectedB}
            onChange={setSelectedB}
            exclude={selectedA}
          />
        </div>

        {selectedA && selectedB && (!personA || !personB) && (
          <p className="text-xs text-red-400 mt-3">Tokoh tidak ditemukan. Coba pilih lagi.</p>
        )}
      </Card>

      {/* Popular picks */}
      <div>
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
          Atau pilih dari daftar populer:
        </p>
        <div className="flex flex-wrap gap-2">
          {popularPersons.map(p => {
            const pt = PARTY_MAP[p.party_id]
            const isSelectedA = selectedA === p.id
            const isSelectedB = selectedB === p.id
            return (
              <button
                key={p.id}
                onClick={() => {
                  if (isSelectedA) { setSelectedA(null); return }
                  if (isSelectedB) { setSelectedB(null); return }
                  if (!selectedA) { setSelectedA(p.id); return }
                  if (!selectedB) { setSelectedB(p.id); return }
                  setSelectedA(p.id)
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                  isSelectedA || isSelectedB
                    ? 'border-accent-red bg-accent-red/10 text-text-primary'
                    : 'border-border bg-bg-card text-text-secondary hover:border-gray-500 hover:text-text-primary'
                }`}
              >
                <Avatar name={p.name} photoUrl={p.photo_url} color={pt?.color} size="xs" />
                <span>{p.name.split(' ')[0]}</span>
                {isSelectedA && <span className="text-xs text-accent-red">A</span>}
                {isSelectedB && <span className="text-xs text-blue-400">B</span>}
              </button>
            )
          })}
        </div>
      </div>

      {selectedA && !selectedB && personA && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
          <p className="text-sm text-blue-400">
            ✅ {personA.name} dipilih — sekarang pilih tokoh kedua untuk dibandingkan
          </p>
        </div>
      )}
    </div>
  )
}
