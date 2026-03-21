import { Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { PERSONS } from '../../data/persons'
import { PARTIES, PARTY_MAP, KIM_PARTIES } from '../../data/parties'
import { CONNECTIONS } from '../../data/connections'
import { PILEG_2024, PILPRES_2024 } from '../../data/elections'
import { NEWS } from '../../data/news'
import { AGENDAS } from '../../data/agendas'
import PersonCard from '../../components/PersonCard'
import NewsCard from '../../components/NewsCard'
import { KPICard, Card } from '../../components/ui'

const pillegData = [...PILEG_2024]
  .filter(d => d.seats > 0)
  .sort((a, b) => b.seats - a.seats)
  .map(d => ({
    name: PARTY_MAP[d.party_id]?.abbr || d.party_id,
    seats: d.seats,
    fill: PARTY_MAP[d.party_id]?.color || '#6B7280',
  }))

const pilpresData = PILPRES_2024.map(p => ({
  name: p.paslon,
  value: p.votes_pct,
}))
const PILPRES_COLORS = ['#8B0000', '#27AAE1', '#C8102E']

const atRiskPersons = PERSONS.filter(p =>
  ['tersangka', 'terpidana'].includes(p.analysis?.corruption_risk)
)

const recentNews = [...NEWS]
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 5)

const kimSeats = KIM_PARTIES.reduce((sum, id) => {
  const p = PARTY_MAP[id]
  return sum + (p?.seats_2024 || 0)
}, 0)
const pdipSeats = PARTY_MAP['pdip']?.seats_2024 || 0

export default function Dashboard() {
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  const jatimPersons = PERSONS.filter(p => p.region_id === 'jawa-timur')

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-bg-card to-bg-elevated border border-border rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-text-primary">
              Selamat datang, Admin 👋
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              Platform pemantauan transparansi &amp; akuntabilitas politik Indonesia
            </p>
          </div>
          <span className="text-text-secondary text-sm">{today}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-bg-card rounded-xl border border-border border-t-4 p-5" style={{ borderTopColor: '#3B82F6' }}>
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">Total Tokoh</p>
          <p className="text-3xl font-bold text-blue-400">{PERSONS.length}</p>
          <p className="text-xs text-text-secondary mt-1">Dipantau</p>
        </div>
        <div className="bg-bg-card rounded-xl border border-border border-t-4 p-5" style={{ borderTopColor: '#FFD700' }}>
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">Total Partai</p>
          <p className="text-3xl font-bold text-yellow-400">18</p>
          <p className="text-xs text-text-secondary mt-1">Pemilu 2024</p>
        </div>
        <div className="bg-bg-card rounded-xl border border-border border-t-4 p-5" style={{ borderTopColor: '#10B981' }}>
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">Total Koneksi</p>
          <p className="text-3xl font-bold text-green-400">{CONNECTIONS.length}</p>
          <p className="text-xs text-text-secondary mt-1">Relasi terpetakan</p>
        </div>
        <div className="bg-bg-card rounded-xl border border-border border-t-4 p-5" style={{ borderTopColor: '#EF4444' }}>
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">Perlu Perhatian</p>
          <p className="text-3xl font-bold text-red-400 flex items-center gap-2">
            {atRiskPersons.length}
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
          </p>
          <p className="text-xs text-text-secondary mt-1">Tersangka/Terpidana</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pileg BarChart */}
        <Card className="lg:col-span-2 p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-4">📊 Pileg DPR 2024 — Kursi Partai</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={pillegData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E2235', border: '1px solid #2D3748', borderRadius: 8 }}
                labelStyle={{ color: '#E5E7EB' }}
                itemStyle={{ color: '#9CA3AF' }}
              />
              <Bar dataKey="seats" name="Kursi" radius={[4, 4, 0, 0]}>
                {pillegData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Pilpres PieChart */}
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-4">🗳️ Pilpres 2024</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={pilpresData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
                label={({ value }) => `${value}%`}
                labelLine={false}
              >
                {pilpresData.map((_, i) => (
                  <Cell key={i} fill={PILPRES_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1E2235', border: '1px solid #2D3748', borderRadius: 8 }}
                formatter={(v) => `${v}%`}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">
            {pilpresData.map((p, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: PILPRES_COLORS[i] }} />
                <span className="text-text-secondary truncate">{p.name}</span>
                <span className="ml-auto font-medium text-text-primary">{p.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* At-Risk + Recent News */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-4">⚠️ Perlu Perhatian</h2>
          {atRiskPersons.length === 0 ? (
            <p className="text-text-secondary text-sm">Tidak ada tokoh berisiko tinggi.</p>
          ) : (
            <div className="space-y-3">
              {atRiskPersons.map(p => (
                <div key={p.id} className="border-l-2 border-red-500 pl-3">
                  <PersonCard person={p} />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-4">📰 Berita Terkini</h2>
          <div className="space-y-3">
            {recentNews.map(article => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </Card>
      </div>

      {/* Koalisi Bar */}
      <Card className="p-5">
        <h2 className="text-sm font-semibold text-text-primary mb-4">🏛️ Koalisi Indonesia Maju Plus</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {KIM_PARTIES.map(pid => {
            const p = PARTY_MAP[pid]
            if (!p) return null
            return (
              <div
                key={pid}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border"
                style={{ borderColor: p.color + '60', backgroundColor: p.color + '15', color: p.color }}
              >
                <span>{p.logo_emoji}</span>
                <span>{p.abbr}</span>
                {p.seats_2024 > 0 && <span className="opacity-70">({p.seats_2024})</span>}
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-4">
          <div>
            <p className="text-text-secondary text-xs mb-1">KIM Plus (Koalisi)</p>
            <p className="text-xl font-bold text-blue-400">{kimSeats} kursi</p>
          </div>
          <div className="flex-1 h-4 bg-bg-elevated rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${(kimSeats / 580) * 100}%` }}
            />
          </div>
          <div className="text-right">
            <p className="text-text-secondary text-xs mb-1">PDIP (Oposisi)</p>
            <p className="text-xl font-bold text-red-400">{pdipSeats} kursi</p>
          </div>
        </div>
        <p className="text-xs text-text-secondary mt-2">Total 580 kursi DPR RI</p>
      </Card>

      {/* Jatim Spotlight */}
      <Card className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-text-primary mb-1">🗺️ Jawa Timur — Provinsi Pilot</h2>
            <div className="flex flex-wrap gap-4 text-sm mt-2">
              <span className="text-text-secondary">
                <span className="text-text-primary font-semibold">{jatimPersons.length}</span> tokoh dipantau
              </span>
              <span className="text-text-secondary">
                <span className="text-text-primary font-semibold">38</span> kab/kota
              </span>
              <span className="text-text-secondary">
                <span className="text-text-primary font-semibold">PKB</span> dominan
              </span>
            </div>
          </div>
          <Link
            to="/regions"
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent-red hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Lihat Peta Wilayah →
          </Link>
        </div>
      </Card>
    </div>
  )
}
