import { useState, Component } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { PERSONS } from '../../data/persons'
import { PARTY_MAP } from '../../data/parties'
import { CONNECTIONS } from '../../data/connections'
import { NEWS } from '../../data/news'
import { AGENDAS } from '../../data/agendas'
import NetworkGraph from '../../components/NetworkGraph'
import CharacterRadar from '../../components/CharacterRadar'
import WealthBar from '../../components/WealthBar'
import ConnectionBadge from '../../components/ConnectionBadge'
import NewsCard from '../../components/NewsCard'
import { Avatar, Badge, Tabs, Card, formatIDR, Tag, RiskDot, Btn } from '../../components/ui'

const MAX_WEALTH = Math.max(...PERSONS.filter(p => p.lhkpn_latest).map(p => p.lhkpn_latest))

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false } }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full text-text-secondary text-sm">
          Koneksi graph tidak tersedia
        </div>
      )
    }
    return this.props.children
  }
}

const TABS = [
  { id: 'profil',   label: '📋 Profil' },
  { id: 'koneksi',  label: '🕸️ Koneksi' },
  { id: 'lhkpn',   label: '💰 LHKPN' },
  { id: 'berita',   label: '📰 Berita' },
  { id: 'agenda',   label: '📋 Agenda' },
  { id: 'analisis', label: '🔬 Analisis' },
]

const STATUS_VARIANTS = {
  janji: 'status-janji',
  proses: 'status-proses',
  selesai: 'status-selesai',
  ingkar: 'status-ingkar',
  batal: 'status-batal',
}

export default function PersonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profil')

  const person = PERSONS.find(p => p.id === id)

  if (!person) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="text-6xl">🔍</div>
        <h2 className="text-xl font-semibold text-text-primary">Tokoh tidak ditemukan</h2>
        <p className="text-text-secondary">ID: {id}</p>
        <Btn onClick={() => navigate('/persons')}>← Kembali ke Daftar</Btn>
      </div>
    )
  }

  const party = person.party_id ? PARTY_MAP[person.party_id] : null
  const currentPos = person.positions?.find(p => p.is_current)
  const sortedPositions = [...(person.positions || [])].sort((a, b) => (b.start || 0) - (a.start || 0))

  // Connections involving this person
  const personConnections = CONNECTIONS.filter(c => c.from === person.id || c.to === person.id)
  const connectedPersonIds = new Set(personConnections.map(c => c.from === person.id ? c.to : c.from))
  const connectedPersons = PERSONS.filter(p => connectedPersonIds.has(p.id))
  const networkNodes = [person, ...connectedPersons]
  const networkEdges = personConnections.filter(c =>
    connectedPersonIds.has(c.from) || connectedPersonIds.has(c.to) ||
    c.from === person.id || c.to === person.id
  )
  const safeNodeIds = new Set(networkNodes.map(n => n.id))
  const safeEdges = networkEdges.filter(e => safeNodeIds.has(e.from) && safeNodeIds.has(e.to))

  // Related news
  const personNews = [...NEWS]
    .filter(n => n.person_ids?.includes(person.id))
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  // Related agendas
  const personAgendas = AGENDAS.filter(a => a.subject_id === person.id)

  const RISK_CONFIG = {
    rendah:    { label: '✓ Bersih',     cls: 'risk-rendah' },
    sedang:    { label: '⚠ Sedang',     cls: 'risk-sedang' },
    tinggi:    { label: '⚠ Tinggi',     cls: 'risk-tinggi' },
    tersangka: { label: '🔴 Tersangka', cls: 'risk-tersangka' },
    terpidana: { label: '⛔ Terpidana', cls: 'risk-terpidana' },
  }
  const riskKey = person.analysis?.corruption_risk || 'rendah'

  return (
    <div className="space-y-5">
      {/* Hero section */}
      <div
        className="relative rounded-2xl overflow-hidden p-6 md:p-8"
        style={{
          background: party
            ? `linear-gradient(135deg, ${party.color}22 0%, ${party.color}08 100%)`
            : 'var(--bg-elevated)',
          border: `1px solid ${party ? party.color + '33' : 'var(--border)'}`,
          borderLeft: party ? `4px solid ${party.color}` : undefined,
        }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Large avatar */}
          <Avatar
            name={person.name}
            photoUrl={person.photo_url}
            color={party?.color}
            size="xl"
            className="ring-4 ring-bg-card flex-shrink-0"
          />

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-text-secondary mb-2">
              <button
                onClick={() => navigate('/persons')}
                className="hover:text-text-primary transition-colors"
              >
                Tokoh
              </button>
              <span>/</span>
              <span className="text-text-primary">{person.name}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary">{person.name}</h1>
            {currentPos && (
              <p className="text-text-secondary mt-1">{currentPos.title} · {currentPos.institution}</p>
            )}

            <div className="flex flex-wrap gap-2 mt-3">
              {party && <Badge color={party.color}>{party.logo_emoji} {party.abbr}</Badge>}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${RISK_CONFIG[riskKey]?.cls}`}>
                {RISK_CONFIG[riskKey]?.label}
              </span>
              <Badge variant="role">{person.tier}</Badge>
              {person.tags?.map(t => <Tag key={t}>#{t}</Tag>)}
            </div>
            <div className="mt-4">
              <Btn onClick={() => navigate(`/compare/${person.id}`)} variant="secondary" size="sm">
                ⚖️ Bandingkan
              </Btn>
            </div>
          </div>

          {/* LHKPN quick stat */}
          {person.lhkpn_latest && (
            <div className="text-center flex-shrink-0 self-stretch flex flex-col justify-center bg-bg-card rounded-xl px-5 py-4 border border-border" style={{ boxShadow: 'var(--shadow-card)' }}>
              <p className="text-xs text-text-secondary uppercase tracking-wider">LHKPN {person.lhkpn_year}</p>
              <p className="text-2xl font-bold mt-1" style={{ color: 'var(--accent-gold)' }}>
                {formatIDR(person.lhkpn_latest)}
              </p>
            </div>
          )}
        </div>

        {/* Controversy alert banner */}
        {person.controversies?.length > 0 && (
          <div className="mt-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-3">
            <span className="text-red-500 flex-shrink-0 mt-0.5">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-red-800">Catatan Penting</p>
              <p className="text-xs text-red-700 mt-0.5">
                {person.controversies.length} kontroversi tercatat. Lihat tab Analisis untuk detail lengkap.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {/* Tab content */}
      <div className="mt-2">
        {/* PROFIL */}
        {activeTab === 'profil' && (
          <div className="space-y-5">
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-2">Bio</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{person.bio}</p>
            </Card>

            <Card className="p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Info</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {person.born && (
                  <div>
                    <p className="text-xs text-text-secondary mb-0.5">Lahir</p>
                    <p className="text-sm text-text-primary">{person.born}</p>
                    {person.born_place && <p className="text-xs text-text-secondary">{person.born_place}</p>}
                  </div>
                )}
                {person.religion && (
                  <div>
                    <p className="text-xs text-text-secondary mb-0.5">Agama</p>
                    <p className="text-sm text-text-primary">{person.religion}</p>
                  </div>
                )}
                {person.education && (
                  <div>
                    <p className="text-xs text-text-secondary mb-0.5">Pendidikan</p>
                    <p className="text-sm text-text-primary">{person.education}</p>
                  </div>
                )}
                {person.twitter && (
                  <div>
                    <p className="text-xs text-text-secondary mb-0.5">Twitter/X</p>
                    <p className="text-sm text-accent-blue">{person.twitter}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Career Timeline */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-4">Riwayat Karier</h3>
              <div className="relative pl-5 space-y-4">
                <div className="absolute left-1.5 top-0 bottom-0 w-0.5 bg-border" />
                {sortedPositions.map((pos, i) => (
                  <div key={i} className="relative">
                    <div
                      className="absolute -left-4 top-1 w-3 h-3 rounded-full border-2 border-bg-card"
                      style={{ backgroundColor: pos.is_current ? (party?.color || '#EF4444') : '#374151' }}
                    />
                    <div>
                      <p className="text-sm font-medium text-text-primary">{pos.title}</p>
                      <p className="text-xs text-text-secondary">{pos.institution}</p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {pos.start}{pos.end ? ` – ${pos.end}` : ' – Sekarang'}
                        {pos.is_current && <span className="ml-2 text-accent-green">● Aktif</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Controversies */}
            {person.controversies?.length > 0 && (
              <Card className="p-5 border-l-4 border-l-red-500">
                <h3 className="text-sm font-semibold text-red-400 mb-3">⚠️ Kontroversi</h3>
                <div className="space-y-3">
                  {person.controversies.map((c, i) => (
                    <div key={i} className="border border-red-500/20 rounded-lg p-3">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-medium text-text-primary">{c.title}</p>
                        {c.severity && (
                          <Badge variant={c.severity === 'berat' ? 'risk-tersangka' : 'risk-sedang'}>
                            {c.severity}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-text-secondary">{c.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* KONEKSI */}
        {activeTab === 'koneksi' && (
          <div className="space-y-5">
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-3">
                Graf Koneksi — {personConnections.length} relasi terpetakan
              </h3>
              <div style={{ height: 400 }}>
                <ErrorBoundary>
                  <NetworkGraph
                    nodes={networkNodes}
                    edges={safeEdges}
                    centerNodeId={person.id}
                  />
                </ErrorBoundary>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Daftar Koneksi</h3>
              {personConnections.length === 0 ? (
                <p className="text-text-secondary text-sm">Belum ada koneksi terpetakan.</p>
              ) : (
                <div className="space-y-2">
                  {personConnections.map((c, i) => {
                    const partnerId = c.from === person.id ? c.to : c.from
                    const partner = PERSONS.find(p => p.id === partnerId)
                    return (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-elevated transition-colors">
                        <ConnectionBadge type={c.type} />
                        <span className="text-sm text-text-secondary flex-1">{c.label}</span>
                        {partner ? (
                          <Link
                            to={`/persons/${partner.id}`}
                            className="text-sm text-accent-blue hover:underline font-medium"
                          >
                            {partner.name}
                          </Link>
                        ) : (
                          <span className="text-xs text-text-secondary">{partnerId}</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* LHKPN */}
        {activeTab === 'lhkpn' && (
          <Card className="p-5 space-y-5">
            <h3 className="text-sm font-semibold text-text-primary">Laporan Harta Kekayaan</h3>
            {person.lhkpn_latest ? (
              <>
                <div>
                  <p className="text-text-secondary text-xs mb-1">Total Kekayaan</p>
                  <p className="text-3xl font-bold text-accent-gold">{formatIDR(person.lhkpn_latest)}</p>
                  <p className="text-text-secondary text-xs mt-1">Tahun laporan: {person.lhkpn_year}</p>
                </div>
                <WealthBar amount={person.lhkpn_latest} max={MAX_WEALTH} label="Perbandingan dengan Tokoh Terkaya" />
                <a
                  href="https://elhkpn.kpk.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent-blue text-sm hover:underline"
                >
                  Lihat di KPK → elhkpn.kpk.go.id
                </a>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-400">
                  ℹ️ Data LHKPN adalah deklarasi mandiri. Pastikan cek langsung di situs KPK untuk data terkini dan terverifikasi.
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-text-secondary">
                <div className="text-4xl mb-3">📄</div>
                <p>Data LHKPN tidak tersedia untuk tokoh ini</p>
              </div>
            )}
          </Card>
        )}

        {/* BERITA */}
        {activeTab === 'berita' && (
          <div className="space-y-4">
            {personNews.length === 0 ? (
              <div className="text-center py-16 text-text-secondary">
                <div className="text-5xl mb-4">📰</div>
                <p className="font-medium">Belum ada berita untuk tokoh ini</p>
              </div>
            ) : (
              personNews.map(article => (
                <NewsCard key={article.id} article={article} />
              ))
            )}
          </div>
        )}

        {/* AGENDA */}
        {activeTab === 'agenda' && (
          <div className="space-y-4">
            {personAgendas.length === 0 ? (
              <div className="text-center py-16 text-text-secondary">
                <div className="text-5xl mb-4">📋</div>
                <p className="font-medium">Belum ada agenda terpantau</p>
              </div>
            ) : (
              personAgendas.map(a => (
                <Card key={a.id} className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="text-sm font-semibold text-text-primary">{a.title}</h4>
                    <Badge variant={STATUS_VARIANTS[a.status] || 'default'}>
                      {a.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-secondary mb-2">{a.description}</p>
                  {a.budget_idr && (
                    <p className="text-xs text-accent-gold">💰 Anggaran: {formatIDR(a.budget_idr)}</p>
                  )}
                  {a.source && (
                    <p className="text-xs text-text-secondary mt-1">Sumber: {a.source}</p>
                  )}
                </Card>
              ))
            )}
          </div>
        )}

        {/* ANALISIS */}
        {activeTab === 'analisis' && (
          <div className="space-y-5">
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Profil Karakter</h3>
              <CharacterRadar analysis={person.analysis} personName={person.name} />
            </Card>

            <Card className="p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Spektrum Ideologi</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-text-secondary mb-1">
                  <span>← Kiri</span>
                  <span>Tengah</span>
                  <span>Kanan →</span>
                </div>
                <div className="relative h-4 bg-gradient-to-r from-red-900 via-bg-elevated to-blue-900 rounded-full">
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-accent-red shadow-lg"
                    style={{
                      left: `calc(${((person.analysis?.ideology_score || 0) + 10) / 20 * 100}% - 8px)`
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-text-secondary">
                  <span>-10</span>
                  <span className="font-medium text-text-primary">
                    Skor: {person.analysis?.ideology_score ?? 'N/A'}
                  </span>
                  <span>+10</span>
                </div>
              </div>
            </Card>

            {person.analysis?.policy_direction && (
              <Card className="p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-2">Arah Kebijakan</h3>
                <p className="text-text-secondary text-sm">{person.analysis.policy_direction}</p>
              </Card>
            )}

            {person.analysis?.track_record && (
              <Card className="p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-2">Track Record</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{person.analysis.track_record}</p>
              </Card>
            )}

            <div className="bg-bg-elevated border border-border rounded-lg p-3 text-xs text-text-secondary">
              📊 Analisis berdasarkan rekam jejak publik dan data pemilihan. Diperbarui secara berkala oleh tim analis PetaPolitik.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
