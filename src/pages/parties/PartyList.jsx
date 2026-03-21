import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { PARTIES, KIM_PARTIES, OPPOSITION_PARTIES } from '../../data/parties'
import { PILEG_2024 } from '../../data/elections'
import { PERSONS } from '../../data/persons'
import { PageHeader, Card, Badge } from '../../components/ui'

const seatParties = PARTIES.filter(p => p.seats_2024 > 0)
  .sort((a, b) => b.seats_2024 - a.seats_2024)
const noSeatParties = PARTIES.filter(p => p.seats_2024 === 0)

const barData = seatParties.map(p => ({
  name: p.abbr,
  seats: p.seats_2024,
  fill: p.color,
}))

export default function PartyList() {
  const navigate = useNavigate()

  const kimTotal = KIM_PARTIES.reduce((sum, id) => {
    const p = PARTIES.find(x => x.id === id)
    return sum + (p?.seats_2024 || 0)
  }, 0)
  const oppTotal = OPPOSITION_PARTIES.reduce((sum, id) => {
    const p = PARTIES.find(x => x.id === id)
    return sum + (p?.seats_2024 || 0)
  }, 0)

  return (
    <div className="space-y-6">
      <PageHeader title="🎭 Partai Politik" subtitle="Hasil Pemilu 2024" />

      {/* Koalisi Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 border-l-4 border-l-blue-500">
          <h3 className="text-sm font-semibold text-blue-400 mb-3">🏛️ Koalisi Indonesia Maju Plus</h3>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {KIM_PARTIES.map(pid => {
              const p = PARTIES.find(x => x.id === pid)
              if (!p) return null
              return (
                <span
                  key={pid}
                  className="text-xs px-2 py-0.5 rounded"
                  style={{ backgroundColor: p.color + '20', color: p.color, border: `1px solid ${p.color}40` }}
                >
                  {p.logo_emoji} {p.abbr} {p.seats_2024 > 0 ? `(${p.seats_2024})` : ''}
                </span>
              )
            })}
          </div>
          <p className="text-2xl font-bold text-blue-400">{kimTotal} <span className="text-sm font-normal text-text-secondary">kursi DPR</span></p>
        </Card>

        <Card className="p-5 border-l-4 border-l-red-500">
          <h3 className="text-sm font-semibold text-red-400 mb-3">⚔️ Oposisi</h3>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {OPPOSITION_PARTIES.map(pid => {
              const p = PARTIES.find(x => x.id === pid)
              if (!p) return null
              return (
                <span
                  key={pid}
                  className="text-xs px-2 py-0.5 rounded"
                  style={{ backgroundColor: p.color + '20', color: p.color, border: `1px solid ${p.color}40` }}
                >
                  {p.logo_emoji} {p.abbr} ({p.seats_2024})
                </span>
              )
            })}
          </div>
          <p className="text-2xl font-bold text-red-400">{oppTotal} <span className="text-sm font-normal text-text-secondary">kursi DPR</span></p>
        </Card>
      </div>

      {/* Seat Distribution */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">📊 Distribusi Kursi DPR 2024</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
            <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1E2235', border: '1px solid #2D3748', borderRadius: 8 }}
              labelStyle={{ color: '#E5E7EB' }}
            />
            <Bar dataKey="seats" name="Kursi" radius={[4, 4, 0, 0]}>
              {barData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Party Cards with seats */}
      <div>
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
          ✅ Lolos Ambang Batas 4%
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {seatParties.map(party => {
            const ketum = PERSONS.find(p => p.party_id === party.id && p.party_role?.includes('Ketua'))
            const memberCount = PERSONS.filter(p => p.party_id === party.id).length
            return (
              <div
                key={party.id}
                className="bg-bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-gray-600 transition-all group"
                style={{ borderLeftColor: party.color, borderLeftWidth: 4 }}
                onClick={() => navigate(`/parties/${party.id}`)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{party.logo_emoji}</span>
                    <div>
                      <h4 className="text-lg font-bold group-hover:text-white transition-colors" style={{ color: party.color }}>
                        {party.abbr}
                      </h4>
                      <p className="text-xs text-text-secondary">{party.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-text-primary">{party.seats_2024}</p>
                    <p className="text-xs text-text-secondary">kursi</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-text-secondary">
                  <span>Ketum: <span className="text-text-primary">{party.ketum}</span></span>
                  <span>Berdiri: <span className="text-text-primary">{party.founded}</span></span>
                  <span>Suara: <span className="text-text-primary">{party.votes_2024}%</span></span>
                  <span>Tokoh: <span className="text-text-primary">{memberCount}</span></span>
                </div>
                <p className="text-xs text-text-secondary mt-2 line-clamp-1">{party.ideology}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* No threshold parties */}
      <div>
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
          ❌ Tidak Lolos Ambang Batas 4%
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 opacity-60">
          {noSeatParties.map(party => (
            <div
              key={party.id}
              className="bg-bg-card border border-border rounded-xl p-3 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => navigate(`/parties/${party.id}`)}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{party.logo_emoji}</span>
                <span className="font-bold text-sm text-text-secondary">{party.abbr}</span>
              </div>
              <p className="text-xs text-text-secondary">{party.votes_2024}% suara</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-text-secondary mt-2">
          ℹ️ PPP tidak lolos pertama kali sejak 1973. Partai-partai ini tidak mendapat kursi DPR 2024.
        </p>
      </div>
    </div>
  )
}
