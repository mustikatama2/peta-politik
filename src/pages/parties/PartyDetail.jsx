import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend,
} from 'recharts'
import { PARTIES, KIM_PARTIES, OPPOSITION_PARTIES } from '../../data/parties'
import { PERSONS } from '../../data/persons'
import { CONNECTIONS } from '../../data/connections'
import { KPK_CASES } from '../../data/kpk_cases'
import PersonCard from '../../components/PersonCard'
import { Card, Badge, Btn, KPICard, Breadcrumb } from '../../components/ui'

// ── helpers ──────────────────────────────────────────────────────────────────

function trendLabel(history) {
  if (!history || history.length < 2) return null
  const first = history[0].votes_pct
  const last  = history[history.length - 1].votes_pct
  const delta = last - first
  if (delta >  3) return { label: '📈 Tren Naik',   color: 'text-green-400' }
  if (delta < -3) return { label: '📉 Tren Turun',  color: 'text-red-400'   }
  return               { label: '➡️ Stabil',          color: 'text-yellow-400' }
}

function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

const SEVERITY_CONFIG = {
  ringan:  { label: 'Ringan',  bg: 'bg-blue-900/60 text-blue-300 border-blue-700' },
  sedang:  { label: 'Sedang',  bg: 'bg-yellow-900/60 text-yellow-300 border-yellow-700' },
  berat:   { label: 'Berat',   bg: 'bg-orange-900/60 text-orange-300 border-orange-700' },
  kritis:  { label: 'Kritis',  bg: 'bg-red-900/60 text-red-300 border-red-700' },
}

// Severity guesser: if it mentions korupsi/OTT/terpidana → berat, otherwise sedang/ringan
function guessSeverity(text = '') {
  const t = text.toLowerCase()
  if (t.includes('terpidana') || t.includes('ott') || t.includes('obstruction') || t.includes('korupsi')) return 'berat'
  if (t.includes('dugaan') || t.includes('dinasti') || t.includes('konflik')) return 'sedang'
  return 'ringan'
}

const KPK_STATUS_COLOR = {
  tersangka: 'bg-orange-900/60 text-orange-300 border-orange-700',
  terpidana: 'bg-red-900/60 text-red-300 border-red-700',
  bebas:     'bg-green-900/60 text-green-300 border-green-700',
  sp3:       'bg-slate-700/60 text-slate-300 border-slate-600',
}

// ── Tab button ────────────────────────────────────────────────────────────────
function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap
        ${active
          ? 'bg-bg-card text-text-primary border border-border-default shadow'
          : 'text-text-secondary hover:text-text-primary hover:bg-bg-card/50'}`}
    >
      {children}
    </button>
  )
}

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-bg-card border border-border-default rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="text-text-secondary mb-1 font-semibold">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <span className="font-bold">{p.value}</span></p>
      ))}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function PartyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)

  const party = PARTIES.find(p => p.id === id)

  useEffect(() => {
    if (party) document.title = `${party.abbr} — PetaPolitik`
    return () => { document.title = 'PetaPolitik Indonesia' }
  }, [party])

  if (!party) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="text-6xl">🔍</div>
        <h2 className="text-xl font-semibold text-text-primary">Partai tidak ditemukan</h2>
        <Btn onClick={() => navigate('/parties')}>← Kembali ke Partai</Btn>
      </div>
    )
  }

  // ── Derived data ────────────────────────────────────────────────────────────
  const isKIM = KIM_PARTIES.includes(party.id)
  const isOpp = OPPOSITION_PARTIES.includes(party.id)

  const members = PERSONS
    .filter(p => p.party_id === party.id)
    .sort((a, b) => (b.analysis?.influence || 0) - (a.analysis?.influence || 0))

  // KPK cases: match suspect id against party members
  const memberIds = new Set(members.map(m => m.id))
  const partyCases = KPK_CASES.filter(c =>
    (c.suspects || []).some(s => memberIds.has(s))
  )

  // Connections for coalition/conflict tabs
  const partyConns = CONNECTIONS.filter(c =>
    c.from === party.id || c.to === party.id
  )
  const currentCoalitions = partyConns.filter(c => c.type === 'koalisi')
  const historicalCoalitions = partyConns.filter(c => c.type === 'mantan-koalisi')
  const conflicts = partyConns.filter(c => c.type === 'konflik')

  // Ideology radar data
  const radarData = party.ideology_scores ? [
    { axis: 'Nasionalisme', value: party.ideology_scores.nasionalisme },
    { axis: 'Religiusitas', value: party.ideology_scores.religiusitas },
    { axis: 'Populisme',    value: party.ideology_scores.populisme },
    { axis: 'Liberalisme',  value: party.ideology_scores.liberalisme },
    { axis: 'Sosialisme',   value: party.ideology_scores.sosialisme },
  ] : []

  const trend = trendLabel(party.election_history)

  const TABS = ['📊 Profil', '📈 Sejarah Pemilu', '👥 Tokoh', '🔗 Koalisi & Konflik', '⚠️ Kontroversi']

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <Breadcrumb items={[
        { label: 'Beranda', to: '/' },
        { label: 'Partai', to: '/parties' },
        { label: party.abbr },
      ]} />

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <Card className="p-5" style={{ borderLeftColor: party.color, borderLeftWidth: 4 }}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          {/* Logo + name */}
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-extrabold flex-shrink-0 shadow-lg"
              style={{ backgroundColor: party.color + '22', border: `2px solid ${party.color}`, color: party.color }}
            >
              {party.abbr.slice(0, 4)}
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: party.color }}>{party.abbr}</h1>
              <p className="text-text-secondary text-sm">{party.name}</p>
              <div className="flex flex-wrap gap-2 mt-1.5">
                <span className="text-xs px-2 py-0.5 rounded-full border border-border-subtle text-text-secondary">
                  📅 Berdiri {party.founded}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full border border-border-subtle text-text-secondary">
                  💡 {party.ideology}
                </span>
              </div>
            </div>
          </div>

          {/* Coalition badge */}
          <div className="flex gap-2 flex-wrap">
            {isKIM && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-900/60 text-amber-300 border border-amber-700">
                🏛️ KIM+ Koalisi
              </span>
            )}
            {isOpp && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-900/60 text-red-300 border border-red-700">
                ⚔️ Oposisi
              </span>
            )}
            {!isKIM && !isOpp && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-700/60 text-slate-300 border border-slate-600">
                🔘 Non-Koalisi
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* ── TABS ───────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {TABS.map((label, i) => (
          <TabBtn key={i} active={tab === i} onClick={() => setTab(i)}>{label}</TabBtn>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 0 — PROFIL
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === 0 && (
        <div className="space-y-5">
          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KPICard label="Kursi 2024" value={party.seats_2024 ?? '–'} sub="Kursi DPR RI" icon="🏛️" />
            <KPICard label="Ketua Umum" value={party.ketum?.split(' ').slice(0,2).join(' ')} sub={party.ketum} icon="👤" />
            <KPICard label="Berdiri" value={party.founded} sub="Tahun pendirian" icon="📅" />
            <KPICard label="Markas" value={party.headquarters ?? '–'} sub="Kantor DPP" icon="📍" />
          </div>

          {/* Sejarah Singkat */}
          {party.sejarah && (
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-2">📖 Sejarah Singkat</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{party.sejarah}</p>
            </Card>
          )}

          {/* Basis Pemilih & Kekuatan Wilayah */}
          {(party.kekuatan_utama?.length > 0 || party.pemilih_utama || party.sumber_dana) && (
            <Card className="p-5 space-y-4">
              <h3 className="text-sm font-semibold text-text-primary">🗺️ Basis Pemilih & Wilayah</h3>
              {party.kekuatan_utama?.length > 0 && (
                <div>
                  <p className="text-xs text-text-secondary mb-2 font-medium">💪 Basis Kuat:</p>
                  <div className="flex flex-wrap gap-2">
                    {party.kekuatan_utama.map((r, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-900/40 text-green-300 border border-green-700/50">
                        ✓ {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {party.kelemahan?.length > 0 && (
                <div>
                  <p className="text-xs text-text-secondary mb-2 font-medium">⚡ Wilayah Lemah:</p>
                  <div className="flex flex-wrap gap-2">
                    {party.kelemahan.map((r, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-900/30 text-red-400 border border-red-800/40">
                        – {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {party.pemilih_utama && (
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-text-secondary font-medium whitespace-nowrap">👥 Segmen:</span>
                  <span className="text-text-secondary">{party.pemilih_utama}</span>
                </div>
              )}
              {party.sumber_dana && (
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-text-secondary font-medium whitespace-nowrap">💰 Dana:</span>
                  <span className="text-text-secondary">{party.sumber_dana}</span>
                </div>
              )}
            </Card>
          )}

          {/* Ideology Radar */}
          {radarData.length > 0 && (
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-1">🧭 Radar Ideologi</h3>
              <p className="text-xs text-text-secondary mb-3">{party.ideology_detail}</p>
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#2D3748" />
                  <PolarAngleAxis dataKey="axis" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: '#6B7280', fontSize: 9 }} />
                  <Radar
                    name={party.abbr}
                    dataKey="value"
                    stroke={party.color}
                    fill={party.color}
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#9CA3AF' }} />
                  <Tooltip content={<ChartTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Description + Key Achievements */}
          {party.key_achievements?.length > 0 && (
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-3">🏆 Pencapaian Utama</h3>
              <ul className="space-y-1.5">
                {party.key_achievements.map((ach, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="text-green-400 mt-0.5">✓</span>
                    {ach}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Sayap */}
          {(party.youth_wing || party.women_wing) && (
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-3">🌿 Sayap Organisasi</h3>
              <div className="flex flex-wrap gap-2">
                {party.youth_wing && party.youth_wing !== '-' && (
                  <span className="px-3 py-1.5 rounded-full text-xs border border-border-default text-text-secondary bg-bg-page">
                    👶 {party.youth_wing}
                  </span>
                )}
                {party.women_wing && party.women_wing !== '-' && (
                  <span className="px-3 py-1.5 rounded-full text-xs border border-border-default text-text-secondary bg-bg-page">
                    👩 {party.women_wing}
                  </span>
                )}
                {party.website && party.website !== '-' && (
                  <a
                    href={party.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-full text-xs border border-border-default text-text-secondary bg-bg-page hover:text-text-primary transition-colors"
                  >
                    🌐 {party.website.replace('https://', '')}
                  </a>
                )}
              </div>
            </Card>
          )}

          {/* Chairman History */}
          {party.chairman_history?.length > 0 && (
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-3">📜 Sejarah Ketua Umum</h3>
              <div className="space-y-2">
                {party.chairman_history.map((ch, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: party.color }} />
                    <span className="text-sm text-text-primary font-medium">{ch.name}</span>
                    <span className="text-xs text-text-secondary ml-auto">{ch.period}</span>
                  </div>
                ))}
              </div>
              {party.founder && (
                <p className="text-xs text-text-secondary mt-3 pt-3 border-t border-border-subtle">
                  Pendiri: <span className="text-text-primary">{party.founder}</span>
                </p>
              )}
            </Card>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 1 — SEJARAH PEMILU
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === 1 && (
        <div className="space-y-5">
          {party.election_history?.length > 0 ? (
            <>
              {/* Trend */}
              {trend && (
                <div className={`text-sm font-semibold ${trend.color}`}>{trend.label}</div>
              )}

              {/* Line chart — vote % */}
              <Card className="p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-4">📊 Perolehan Suara (%) per Pemilu</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={party.election_history}>
                    <CartesianGrid stroke="#1F2937" strokeDasharray="3 3" />
                    <XAxis dataKey="year" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} unit="%" domain={[0, 'auto']} />
                    <Tooltip content={<ChartTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="votes_pct"
                      name="Suara %"
                      stroke={party.color}
                      strokeWidth={2.5}
                      dot={{ fill: party.color, r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* Bar chart — seats */}
              <Card className="p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-4">🏛️ Kursi DPR per Pemilu</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={party.election_history}>
                    <CartesianGrid stroke="#1F2937" strokeDasharray="3 3" />
                    <XAxis dataKey="year" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar
                      dataKey="seats"
                      name="Kursi"
                      fill={party.color}
                      fillOpacity={0.8}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Table */}
              <Card className="p-5 overflow-x-auto">
                <h3 className="text-sm font-semibold text-text-primary mb-4">📋 Tabel Lengkap</h3>
                <table className="w-full text-xs text-text-secondary">
                  <thead>
                    <tr className="text-left border-b border-border-subtle">
                      <th className="pb-2 pr-4 font-semibold text-text-primary">Tahun</th>
                      <th className="pb-2 pr-4 font-semibold text-text-primary">Suara %</th>
                      <th className="pb-2 pr-4 font-semibold text-text-primary">Kursi</th>
                      <th className="pb-2 font-semibold text-text-primary">Peringkat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {party.election_history.map((row, i) => (
                      <tr key={i} className="border-b border-border-subtle/40 hover:bg-bg-card/30 transition-colors">
                        <td className="py-2 pr-4 font-medium">{row.year}</td>
                        <td className="py-2 pr-4">
                          <span className="font-bold" style={{ color: party.color }}>{row.votes_pct}%</span>
                        </td>
                        <td className="py-2 pr-4">{row.seats}</td>
                        <td className="py-2">
                          <span className={`px-1.5 py-0.5 rounded text-xs ${row.rank <= 3 ? 'bg-amber-900/60 text-amber-300' : 'bg-slate-700/40 text-slate-400'}`}>
                            #{row.rank}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-text-secondary text-sm">Belum ada data sejarah pemilu untuk partai ini.</p>
            </Card>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 2 — TOKOH
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === 2 && (
        <div className="space-y-4">
          {/* Key Figures Grid */}
          {party.key_figures?.length > 0 && (() => {
            const keyPersons = party.key_figures
              .map(id => PERSONS.find(p => p.id === id))
              .filter(Boolean)
            if (!keyPersons.length) return null
            return (
              <Card className="p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-3">⭐ Tokoh Kunci</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {keyPersons.map(p => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-bg-page border border-border-subtle hover:border-border-default transition-colors cursor-pointer"
                      onClick={() => navigate(`/persons/${p.id}`)}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ backgroundColor: party.color + '22', border: `1.5px solid ${party.color}`, color: party.color }}
                      >
                        {initials(p.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-text-primary truncate">{p.name.split(' ').slice(0, 2).join(' ')}</p>
                        <p className="text-xs text-text-secondary truncate">{p.jabatan || p.role || '–'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )
          })()}

          {/* All Members */}
          {members.length > 0 ? (
            <>
              <p className="text-xs text-text-secondary">{members.length} tokoh terdaftar · diurutkan berdasarkan skor pengaruh</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {members.map(m => (
                  <div
                    key={m.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/persons/${m.id}`)}
                  >
                    <PersonCard person={m} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-text-secondary text-sm">Belum ada tokoh terdaftar untuk partai ini.</p>
            </Card>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 3 — KOALISI & KONFLIK
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === 3 && (
        <div className="space-y-5">
          {/* Current Coalitions */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-3">🤝 Koalisi Aktif</h3>
            {currentCoalitions.length > 0 ? (
              <div className="space-y-2">
                {currentCoalitions.map((conn, i) => {
                  const otherId = conn.from === party.id ? conn.to : conn.from
                  const other = PARTIES.find(p => p.id === otherId)
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg bg-bg-page border border-border-subtle hover:border-border-default transition-colors cursor-pointer"
                      onClick={() => other && navigate(`/parties/${other.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        {other ? (
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{ backgroundColor: other.color + '22', border: `1.5px solid ${other.color}`, color: other.color }}
                          >
                            {other.abbr.slice(0, 3)}
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">?</div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-text-primary">{other?.abbr ?? otherId}</p>
                          <p className="text-xs text-text-secondary">{conn.label}</p>
                        </div>
                      </div>
                      <div className="text-xs text-text-secondary opacity-60">Kekuatan: {conn.strength}/10</div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-text-secondary">Tidak ada data koalisi aktif tercatat.</p>
            )}
          </Card>

          {/* Historical Coalitions */}
          {historicalCoalitions.length > 0 && (
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-3">📜 Mantan Koalisi</h3>
              <div className="space-y-2">
                {historicalCoalitions.map((conn, i) => {
                  const otherId = conn.from === party.id ? conn.to : conn.from
                  const other = PARTIES.find(p => p.id === otherId)
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-bg-page border border-border-subtle">
                      <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs opacity-60">
                        {other ? other.abbr.slice(0, 2) : '?'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-secondary">{other?.abbr ?? otherId}</p>
                        <p className="text-xs text-text-secondary opacity-70">{conn.label}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}

          {/* Conflicts */}
          {conflicts.length > 0 && (
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-3">⚔️ Konflik Tercatat</h3>
              <div className="space-y-2">
                {conflicts.map((conn, i) => {
                  const otherId = conn.from === party.id ? conn.to : conn.from
                  const other = PARTIES.find(p => p.id === otherId)
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-red-950/30 border border-red-900/50">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: other?.color + '22' || '#ef444422', border: `1.5px solid ${other?.color || '#ef4444'}`, color: other?.color || '#ef4444' }}
                      >
                        {other?.abbr?.slice(0, 3) ?? otherId?.slice(0, 3)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{other?.abbr ?? otherId}</p>
                        <p className="text-xs text-text-secondary">{conn.label}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}

          {currentCoalitions.length === 0 && historicalCoalitions.length === 0 && conflicts.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-text-secondary text-sm">Belum ada data koalisi atau konflik antar-tokoh tercatat.</p>
            </Card>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 4 — KONTROVERSI
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === 4 && (
        <div className="space-y-5">
          {/* Controversies */}
          {party.controversies?.length > 0 && (
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-3">⚠️ Kontroversi Partai</h3>
              <div className="space-y-2">
                {party.controversies.map((c, i) => {
                  const sev = guessSeverity(c)
                  const cfg = SEVERITY_CONFIG[sev] || SEVERITY_CONFIG.sedang
                  return (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-bg-page border border-border-subtle">
                      <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full border font-semibold mt-0.5 ${cfg.bg}`}>
                        {cfg.label}
                      </span>
                      <p className="text-sm text-text-secondary">{c}</p>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}

          {/* KPK Cases */}
          {partyCases.length > 0 && (
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-3">🔎 Kasus Hukum Kader</h3>
              <div className="space-y-3">
                {partyCases.map((c) => {
                  const suspect = members.find(m => (c.suspects || []).includes(m.id))
                  return (
                    <div key={c.id} className="p-3 rounded-lg bg-bg-page border border-border-subtle space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-text-primary">{c.title}</p>
                        <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full border font-semibold ${KPK_STATUS_COLOR[c.status] || 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                          {c.status}
                        </span>
                      </div>
                      {suspect && (
                        <p className="text-xs text-text-secondary">👤 {suspect.name}</p>
                      )}
                      <p className="text-xs text-text-secondary">{c.charges}</p>
                      {c.losses_idr && (
                        <p className="text-xs text-red-400">
                          💰 Kerugian: Rp {(c.losses_idr / 1_000_000_000).toFixed(1)} M
                        </p>
                      )}
                      {c.notes && (
                        <p className="text-xs text-text-secondary opacity-70 italic">{c.notes}</p>
                      )}
                      <p className="text-xs text-text-secondary opacity-50">📅 {c.date_start} · {c.institution}</p>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}

          {(!party.controversies?.length && partyCases.length === 0) && (
            <Card className="p-8 text-center">
              <p className="text-text-secondary text-sm">Tidak ada kontroversi atau kasus hukum tercatat untuk partai ini.</p>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
