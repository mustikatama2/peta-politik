import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend
} from 'recharts'
import { PERSONS } from '../../data/persons'
import { PARTY_MAP } from '../../data/parties'
import { CONNECTIONS } from '../../data/connections'
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

function SectionTitle({ children }) {
  return (
    <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3 flex items-center gap-2">
      <span className="flex-1 h-px bg-border" />
      {children}
      <span className="flex-1 h-px bg-border" />
    </h3>
  )
}

function CompareView({ personA, personB, onReset }) {
  const navigate = useNavigate()
  const partyA = PARTY_MAP[personA.party_id]
  const partyB = PARTY_MAP[personB.party_id]
  const posA = personA.positions?.find(p => p.is_current)
  const posB = personB.positions?.find(p => p.is_current)
  const riskA = personA.analysis?.corruption_risk || 'rendah'
  const riskB = personB.analysis?.corruption_risk || 'rendah'

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
    commonFriendIds.map(id => PERSONS.find(p => p.id === id)).filter(Boolean).slice(0, 8),
    [commonFriendIds]
  )

  // Chart data for scoring breakdown
  const chartData = [
    { metric: 'Posisi', A: scoreA.position_score, B: scoreB.position_score },
    { metric: 'Jaringan', A: scoreA.network_score, B: scoreB.network_score },
    { metric: 'Partai', A: scoreA.party_score, B: scoreB.party_score },
    { metric: 'LHKPN', A: scoreA.lhkpn_score, B: scoreB.lhkpn_score },
  ]

  // Career timeline data — collect all years both persons were active
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
    // Only include years where at least one has a position
    return years.filter(y => y.A > 0 || y.B > 0)
  }, [personA, personB])

  const ideologyA = personA.analysis?.ideology_score ?? null
  const ideologyB = personB.analysis?.ideology_score ?? null

  const nameA = personA.name.split(' ')[0]
  const nameB = personB.name.split(' ')[0]

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <Btn variant="secondary" size="sm" onClick={onReset}>← Kembali</Btn>
        <div className="flex-1 text-center">
          <h1 className="text-lg font-bold text-text-primary">
            <span style={{ color: partyA?.color || 'var(--accent-red)' }}>{personA.name}</span>
            <span className="text-text-muted mx-3">vs</span>
            <span style={{ color: partyB?.color || '#3B82F6' }}>{personB.name}</span>
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

      {/* ROW 1: Avatar Hero */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { p: personA, party: partyA, pos: posA, risk: riskA, score: scoreA },
          { p: personB, party: partyB, pos: posB, risk: riskB, score: scoreB },
        ].map(({ p, party, pos, risk, score }) => (
          <Card key={p.id} className="p-5 flex flex-col items-center text-center gap-3"
            style={party ? { borderLeftColor: party.color, borderLeftWidth: 3 } : {}}>
            <Link to={`/persons/${p.id}`}>
              <Avatar name={p.name} photoUrl={p.photo_url} color={party?.color} size="xl"
                className="ring-4 ring-bg-card hover:ring-accent-red transition-all" />
            </Link>
            <div>
              <Link to={`/persons/${p.id}`}>
                <h2 className="text-base font-bold text-text-primary hover:text-accent-blue transition-colors">
                  {p.name}
                </h2>
              </Link>
              {pos && <p className="text-xs text-text-secondary mt-0.5">{pos.title}</p>}
            </div>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {party && <Badge color={party.color}>{party.logo_emoji} {party.abbr}</Badge>}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${RISK_CONFIG[risk]?.cls}`}>
                {RISK_CONFIG[risk]?.label}
              </span>
            </div>
            <div className="mt-1">
              <p className="text-2xl font-bold" style={{ color: party?.color || 'var(--text-primary)' }}>
                {score.total}
              </p>
              <p className="text-xs text-text-secondary">Skor Pengaruh</p>
            </div>
          </Card>
        ))}
      </div>

      {/* ROW 2: Quick Stats */}
      <div>
        <SectionTitle>Statistik Cepat</SectionTitle>
        <div className="grid grid-cols-1 gap-3">
          {/* LHKPN */}
          <Card className="p-4">
            <div className="grid grid-cols-3 items-center gap-2">
              <div className="text-center">
                <p className="text-xs text-text-secondary mb-1">💰 LHKPN {nameA}</p>
                <p className="text-sm font-bold text-accent-gold">
                  {personA.lhkpn_latest ? formatIDR(personA.lhkpn_latest) : '—'}
                </p>
              </div>
              <div className="text-center">
                {personA.lhkpn_latest && personB.lhkpn_latest ? (
                  <span className="text-xs px-2 py-1 rounded-full bg-accent-gold/10 text-accent-gold border border-accent-gold/20">
                    {personA.lhkpn_latest > personB.lhkpn_latest
                      ? `${nameA} lebih kaya`
                      : `${nameB} lebih kaya`}
                  </span>
                ) : <span className="text-xs text-text-muted">💰 LHKPN</span>}
              </div>
              <div className="text-center">
                <p className="text-xs text-text-secondary mb-1">💰 LHKPN {nameB}</p>
                <p className="text-sm font-bold text-accent-gold">
                  {personB.lhkpn_latest ? formatIDR(personB.lhkpn_latest) : '—'}
                </p>
              </div>
            </div>
          </Card>

          {/* Connections */}
          <Card className="p-4">
            <div className="grid grid-cols-3 items-center gap-2">
              <div className="text-center">
                <p className="text-xs text-text-secondary mb-1">🕸 Koneksi {nameA}</p>
                <p className="text-sm font-bold text-text-primary">{aEdges.length}</p>
              </div>
              <div className="text-center">
                <span className="text-xs px-2 py-1 rounded-full bg-bg-elevated text-text-secondary border border-border">
                  {aEdges.length > bEdges.length
                    ? `${nameA} lebih terhubung`
                    : aEdges.length < bEdges.length
                    ? `${nameB} lebih terhubung`
                    : 'Setara'}
                </span>
              </div>
              <div className="text-center">
                <p className="text-xs text-text-secondary mb-1">🕸 Koneksi {nameB}</p>
                <p className="text-sm font-bold text-text-primary">{bEdges.length}</p>
              </div>
            </div>
          </Card>

          {/* Ideology */}
          {(ideologyA !== null || ideologyB !== null) && (
            <Card className="p-4">
              <div className="grid grid-cols-3 items-center gap-2">
                <div className="text-center">
                  <p className="text-xs text-text-secondary mb-1">⬅ Ideologi {nameA}</p>
                  <p className="text-sm font-bold text-text-primary">{ideologyA ?? '—'}</p>
                </div>
                <div className="text-center text-xs text-text-muted">
                  <span>← Kiri / Kanan →</span>
                </div>
                <div className="text-center">
                  <p className="text-xs text-text-secondary mb-1">Ideologi {nameB} ➡</p>
                  <p className="text-sm font-bold text-text-primary">{ideologyB ?? '—'}</p>
                </div>
              </div>
              {/* Visual slider */}
              <div className="mt-3 relative h-3 bg-gradient-to-r from-red-900 via-bg-elevated to-blue-900 rounded-full">
                {ideologyA !== null && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md"
                    style={{
                      left: `calc(${((ideologyA + 10) / 20) * 100}% - 8px)`,
                      backgroundColor: partyA?.color || '#EF4444',
                    }}
                    title={`${nameA}: ${ideologyA}`}
                  />
                )}
                {ideologyB !== null && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md"
                    style={{
                      left: `calc(${((ideologyB + 10) / 20) * 100}% - 8px)`,
                      backgroundColor: partyB?.color || '#3B82F6',
                    }}
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

      {/* ROW 3: Scoring Breakdown */}
      <div>
        <SectionTitle>Perbandingan Skor Pengaruh</SectionTitle>
        <Card className="p-5">
          <div className="grid grid-cols-3 mb-4 text-center">
            <div>
              <p className="text-2xl font-bold" style={{ color: partyA?.color || 'var(--accent-red)' }}>
                {scoreA.total}
              </p>
              <p className="text-xs text-text-secondary">{nameA}</p>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-text-muted text-sm font-medium">vs</span>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: partyB?.color || '#3B82F6' }}>
                {scoreB.total}
              </p>
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
              <Bar dataKey="A" name={nameA} fill={partyA?.color || '#EF4444'} radius={[3, 3, 0, 0]} />
              <Bar dataKey="B" name={nameB} fill={partyB?.color || '#3B82F6'} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ROW 4: Career Timeline */}
      {timelineData.length > 0 && (
        <div>
          <SectionTitle>Timeline Karier</SectionTitle>
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
                <Line
                  dataKey="A"
                  name={nameA}
                  stroke={partyA?.color || '#EF4444'}
                  strokeWidth={2}
                  dot={false}
                  type="stepAfter"
                />
                <Line
                  dataKey="B"
                  name={nameB}
                  stroke={partyB?.color || '#3B82F6'}
                  strokeWidth={2}
                  dot={false}
                  type="stepAfter"
                />
              </LineChart>
            </ResponsiveContainer>

            {/* Position blocks */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              {[
                { p: personA, party: partyA, name: nameA },
                { p: personB, party: partyB, name: nameB },
              ].map(({ p, party, name }) => (
                <div key={p.id}>
                  <p className="text-xs font-semibold mb-2" style={{ color: party?.color || 'var(--text-primary)' }}>
                    {name}
                  </p>
                  <div className="space-y-1.5">
                    {[...(p.positions || [])].sort((a, b) => (b.start || 0) - (a.start || 0)).map((pos, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: party?.color || '#6B7280' }} />
                        <span className="text-text-primary truncate">{pos.title}</span>
                        <span className="text-text-muted flex-shrink-0">
                          {pos.start}{pos.end ? `–${pos.end}` : '–kini'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ROW 5: Shared Connections */}
      <div>
        <SectionTitle>Koneksi Bersama</SectionTitle>
        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-secondary">Terhubung langsung:</span>
            <span className={`text-sm font-semibold ${directlyConnected ? 'text-green-400' : 'text-text-muted'}`}>
              {directlyConnected ? '✅ Ya' : '❌ Tidak'}
            </span>
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-2">
              {commonFriends.length} kenalan bersama:
            </p>
            {commonFriends.length === 0 ? (
              <p className="text-xs text-text-muted italic">Tidak ada kenalan bersama yang terpetakan.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {commonFriends.map(p => {
                  const pt = PARTY_MAP[p.party_id]
                  return (
                    <Link
                      key={p.id}
                      to={`/persons/${p.id}`}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-bg-elevated border border-border hover:border-gray-500 transition-colors"
                    >
                      <Avatar name={p.name} photoUrl={p.photo_url} color={pt?.color} size="xs" />
                      <span className="text-xs text-text-primary">{p.name}</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* ROW 6: Bio */}
      <div>
        <SectionTitle>Biografi</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[{ p: personA, party: partyA, name: nameA }, { p: personB, party: partyB, name: nameB }].map(({ p, party, name }) => (
            <Card key={p.id} className="p-5"
              style={party ? { borderLeftColor: party.color, borderLeftWidth: 3 } : {}}>
              <h4 className="text-xs font-bold mb-2" style={{ color: party?.color || 'var(--text-primary)' }}>
                {name}
              </h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                {p.bio || 'Tidak ada bio tersedia.'}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* ROW 7: Controversies */}
      <div>
        <SectionTitle>Kontroversi</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[{ p: personA, party: partyA, name: nameA }, { p: personB, party: partyB, name: nameB }].map(({ p, party, name }) => (
            <Card key={p.id} className="p-5">
              <h4 className="text-xs font-bold mb-3" style={{ color: party?.color || 'var(--text-primary)' }}>
                {name}
              </h4>
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

      {/* Bottom CTA */}
      <div className="flex gap-3 justify-center flex-wrap">
        <Btn variant="secondary" onClick={onReset}>⬅ Pilih Tokoh Lain</Btn>
        <Link to={`/persons/${personA.id}`}><Btn variant="ghost">Profil {nameA}</Btn></Link>
        <Link to={`/persons/${personB.id}`}><Btn variant="ghost">Profil {nameB}</Btn></Link>
      </div>
    </div>
  )
}

export default function ComparePage() {
  const { id1, id2 } = useParams()
  const navigate = useNavigate()

  const [selectedA, setSelectedA] = useState(id1 || null)
  const [selectedB, setSelectedB] = useState(id2 || null)

  // Sync URL params to state
  useEffect(() => {
    if (id1) setSelectedA(id1)
    if (id2) setSelectedB(id2)
  }, [id1, id2])

  // Update URL when selection changes
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

  // If both selected and found, show comparison
  if (personA && personB) {
    return (
      <CompareView
        personA={personA}
        personB={personB}
        onReset={() => { setSelectedA(null); setSelectedB(null) }}
      />
    )
  }

  // Selector step
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="⚖️ Bandingkan Tokoh"
        subtitle="Pilih dua tokoh untuk perbandingan mendalam side-by-side"
      />

      {/* Search dropdowns */}
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

        {selectedA && selectedB && personA && personB && (
          <div className="mt-4 text-center">
            <Btn onClick={() => {}}>
              ⚖️ Bandingkan Sekarang
            </Btn>
          </div>
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
                  // Replace A
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

      {/* Hint */}
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
