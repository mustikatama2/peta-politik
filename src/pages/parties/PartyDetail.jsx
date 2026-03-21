import { useParams, useNavigate } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { PARTIES, KIM_PARTIES, OPPOSITION_PARTIES } from '../../data/parties'
import { PERSONS } from '../../data/persons'
import { AGENDAS } from '../../data/agendas'
import { PILEG_HISTORY } from '../../data/elections'
import { NEWS } from '../../data/news'
import PersonCard from '../../components/PersonCard'
import { Card, Badge, Btn, KPICard } from '../../components/ui'

// Party ideology compass positions (ekonomi x: kiri=-10..kanan=10, sosial y: progresif=10..konservatif=-10)
const PARTY_COMPASS = {
  pkb:  { x: -1, y: -3 },
  ger:  { x:  4, y: -4 },
  pdip: { x: -3, y:  2 },
  gol:  { x:  3, y: -2 },
  nas:  { x:  1, y:  4 },
  pks:  { x: -1, y: -7 },
  pan:  { x:  0, y: -4 },
  dem:  { x:  2, y:  1 },
  psi:  { x:  0, y:  8 },
  pbb:  { x: -2, y: -8 },
  ppp:  { x: -1, y: -5 },
  bur:  { x: -7, y:  5 },
  gel:  { x: -1, y: -6 },
  per:  { x:  3, y:  0 },
  han:  { x:  1, y: -1 },
  gar:  { x:  2, y: -5 },
  pkn:  { x:  0, y:  0 },
  umm:  { x: -3, y: -7 },
}

const RISK_CONFIG = {
  rendah:    { label: 'Rendah',    color: 'bg-green-900 text-green-300' },
  sedang:    { label: 'Sedang',    color: 'bg-yellow-900 text-yellow-300' },
  tinggi:    { label: 'Tinggi',    color: 'bg-orange-900 text-orange-300' },
  tersangka: { label: 'Tersangka', color: 'bg-red-900 text-red-300' },
  terpidana: { label: 'Terpidana', color: 'bg-red-950 text-red-200' },
}

export default function PartyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const party = PARTIES.find(p => p.id === id)

  if (!party) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="text-6xl">🔍</div>
        <h2 className="text-xl font-semibold text-text-primary">Partai tidak ditemukan</h2>
        <Btn onClick={() => navigate('/parties')}>← Kembali ke Partai</Btn>
      </div>
    )
  }

  const members = PERSONS.filter(p => p.party_id === party.id)
  const ketum = members.find(p => p.party_role?.includes('Ketua'))
  const agendas = AGENDAS.filter(a => a.subject_id === party.id)

  // A. Coalition
  const isKIM = KIM_PARTIES.includes(party.id)
  const isOpp = OPPOSITION_PARTIES.includes(party.id)

  // B. Key current positions
  const currentPositions = members.flatMap(m =>
    (m.positions || []).filter(p => p.is_current).map(p => ({ person: m, position: p }))
  ).slice(0, 8)

  // C. Ideology Compass — scatter data
  const compassData = PARTIES.map(p => ({
    id: p.id,
    name: p.abbr,
    x: PARTY_COMPASS[p.id]?.x ?? 0,
    y: PARTY_COMPASS[p.id]?.y ?? 0,
    isThis: p.id === party.id,
    color: p.color,
  }))

  // D. Member Directory
  const nationals = members.filter(m => m.tier === 'nasional')
  const regionals = members.filter(m => m.tier === 'regional')

  // E. Recent News
  const partyNews = NEWS
    .filter(n =>
      n.party_ids?.includes(party.id) ||
      members.some(m => n.person_ids?.includes(m.id))
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  // F. Corruption Profile
  const riskCount = { rendah: 0, sedang: 0, tinggi: 0, tersangka: 0, terpidana: 0 }
  members.forEach(m => {
    const risk = m.analysis?.corruption_risk || 'rendah'
    if (riskCount.hasOwnProperty(risk)) riskCount[risk]++
  })

  // Historical seats
  const historyData = PILEG_HISTORY.map(yr => {
    const result = yr.results.find(r =>
      r.party.toLowerCase().includes(party.abbr.toLowerCase()) ||
      party.abbr.toLowerCase().includes(r.party.toLowerCase().slice(0, 4))
    )
    return { year: yr.year, seats: result?.seats || 0, votes: result?.votes_pct || 0 }
  }).reverse()

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/parties')}
        className="text-text-secondary hover:text-text-primary text-sm flex items-center gap-2 transition-colors"
      >
        ← Kembali ke Daftar Partai
      </button>

      {/* Header */}
      <Card className="p-5" style={{ borderLeftColor: party.color, borderLeftWidth: 4 }}>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{party.logo_emoji}</span>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: party.color }}>{party.abbr}</h1>
              <p className="text-text-secondary">{party.name}</p>
              <p className="text-xs text-text-secondary mt-1">{party.ideology}</p>
            </div>
          </div>
          {/* A. Coalition Badge */}
          <div className="flex gap-2 flex-wrap mt-1">
            {isKIM && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-900/60 text-amber-300 border border-amber-700">
                🏛️ Koalisi Indonesia Maju Plus
              </span>
            )}
            {isOpp && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-900/60 text-red-300 border border-red-700">
                ⚔️ Oposisi
              </span>
            )}
            {!isKIM && !isOpp && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-700/60 text-slate-300 border border-slate-600">
                🔘 Non-Koalisi
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Kursi 2024" value={party.seats_2024 || '0'} sub="Kursi DPR RI" icon="🏛️" />
        <KPICard label="Suara 2024" value={`${party.votes_2024}%`} sub="Suara nasional" icon="📊" />
        <KPICard label="Berdiri" value={party.founded} sub="Tahun pendirian" icon="📅" />
        <KPICard label="Tokoh Pantau" value={members.length} sub="Dalam database" icon="👥" />
      </div>

      {/* Ketum */}
      {ketum && (
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Ketua Umum</h3>
          <PersonCard person={ketum} />
        </Card>
      )}

      {/* B. Key Positions Held */}
      {currentPositions.length > 0 && (
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">⭐ Jabatan Strategis Kader</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {currentPositions.map(({ person, position }, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-bg-card border border-border-subtle cursor-pointer hover:border-border-default transition-colors"
                onClick={() => navigate(`/persons/${person.id}`)}
              >
                <div className="w-10 h-10 rounded-full bg-bg-page flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ color: party.color, border: `2px solid ${party.color}` }}>
                  {person.photo_url
                    ? <img src={person.photo_url} alt={person.name} className="w-full h-full rounded-full object-cover" />
                    : person.photo_placeholder
                  }
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-text-primary truncate">{person.name}</p>
                  <p className="text-xs text-text-secondary truncate">{position.title}</p>
                  <p className="text-xs text-text-secondary opacity-60 truncate">{position.institution}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* C. Ideology Compass */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-1">🧭 Kompas Ideologi</h3>
        <p className="text-xs text-text-secondary mb-4">Posisi relatif berdasarkan analisis ekonomi-sosial</p>
        <div className="relative w-full" style={{ paddingBottom: '56%' }}>
          <div className="absolute inset-0">
            {/* Axis lines */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-full h-px bg-border-subtle opacity-60" />
              <div className="absolute h-full w-px bg-border-subtle opacity-60" />
            </div>
            {/* Labels */}
            <span className="absolute left-1 top-1/2 -translate-y-1/2 text-xs text-text-secondary opacity-60">← Kiri</span>
            <span className="absolute right-1 top-1/2 -translate-y-1/2 text-xs text-text-secondary opacity-60">Kanan →</span>
            <span className="absolute top-1 left-1/2 -translate-x-1/2 text-xs text-text-secondary opacity-60">Progresif ↑</span>
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-text-secondary opacity-60">↓ Konservatif</span>
            {/* Dots */}
            {compassData.map(p => {
              const xPct = ((p.x + 10) / 20) * 100
              const yPct = ((10 - p.y) / 20) * 100
              const isThis = p.isThis
              return (
                <div
                  key={p.id}
                  className="absolute flex flex-col items-center"
                  style={{
                    left: `${xPct}%`,
                    top: `${yPct}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: isThis ? 10 : 1,
                  }}
                  title={p.name}
                >
                  <div
                    className={`rounded-full transition-all ${isThis ? 'w-4 h-4 ring-2 ring-white shadow-lg' : 'w-2.5 h-2.5 opacity-40'}`}
                    style={{ backgroundColor: p.color }}
                  />
                  {isThis && (
                    <span className="mt-1 text-xs font-bold whitespace-nowrap" style={{ color: p.color }}>
                      {p.name}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      {/* Election History */}
      {historyData.some(d => d.seats > 0) && (
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">📈 Tren Kursi DPR</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={historyData}>
              <CartesianGrid stroke="#1F2937" />
              <XAxis dataKey="year" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E2235', border: '1px solid #2D3748', borderRadius: 8 }}
                labelStyle={{ color: '#E5E7EB' }}
              />
              <Line
                type="monotone"
                dataKey="seats"
                name="Kursi"
                stroke={party.color}
                strokeWidth={2}
                dot={{ fill: party.color, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* F. Corruption Profile */}
      {members.length > 0 && (
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-3">🔎 Profil Risiko Korupsi Kader</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(riskCount).map(([risk, count]) => count > 0 && (
              <span
                key={risk}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${RISK_CONFIG[risk]?.color || 'bg-gray-700 text-gray-300'}`}
              >
                {RISK_CONFIG[risk]?.label || risk}
                <span className="font-bold text-sm">{count}</span>
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* D. Member Directory — Nationals */}
      {nationals.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-3">🏛️ Tokoh Nasional ({nationals.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {nationals.map(m => (
              <PersonCard key={m.id} person={m} />
            ))}
          </div>
        </div>
      )}

      {/* D. Member Directory — Regionals */}
      {regionals.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-3">🗺️ Tokoh Daerah ({regionals.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {regionals.map(m => (
              <PersonCard key={m.id} person={m} />
            ))}
          </div>
        </div>
      )}

      {/* E. Recent News */}
      {partyNews.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-3">📰 Berita Terkait ({partyNews.length})</h3>
          <div className="space-y-3">
            {partyNews.map(n => (
              <Card key={n.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary">{n.headline}</p>
                    <p className="text-xs text-text-secondary mt-1 line-clamp-2">{n.summary}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-text-secondary opacity-60">{n.source}</span>
                      <span className="text-xs text-text-secondary opacity-40">·</span>
                      <span className="text-xs text-text-secondary opacity-60">{n.date}</span>
                    </div>
                  </div>
                  <Badge
                    color={n.sentiment === 'positif' ? '#22c55e' : n.sentiment === 'negatif' ? '#ef4444' : '#94a3b8'}
                  >
                    {n.sentiment}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Agendas */}
      {agendas.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-3">📋 Platform & Agenda ({agendas.length})</h3>
          <div className="space-y-3">
            {agendas.map(a => (
              <Card key={a.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-text-primary">{a.title}</p>
                  <Badge variant={`status-${a.status}`}>{a.status}</Badge>
                </div>
                <p className="text-xs text-text-secondary mt-1">{a.description}</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
