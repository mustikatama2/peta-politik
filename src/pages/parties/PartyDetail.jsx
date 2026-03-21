import { useParams, useNavigate } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import { PARTIES } from '../../data/parties'
import { PERSONS } from '../../data/persons'
import { AGENDAS } from '../../data/agendas'
import { PILEG_HISTORY } from '../../data/elections'
import PersonCard from '../../components/PersonCard'
import { Card, Badge, PageHeader, Btn, KPICard, formatIDR } from '../../components/ui'

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

  // Historical seats for this party's abbr
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
        <div className="flex items-center gap-4">
          <span className="text-5xl">{party.logo_emoji}</span>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: party.color }}>{party.abbr}</h1>
            <p className="text-text-secondary">{party.name}</p>
            <p className="text-xs text-text-secondary mt-1">{party.ideology}</p>
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

      {/* Members */}
      {members.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-3">👥 Tokoh ({members.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {members.map(m => (
              <PersonCard key={m.id} person={m} />
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
