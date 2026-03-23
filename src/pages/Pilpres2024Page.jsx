import { PERSONS } from '../data/persons.js'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { PageHeader, Card, Badge, KPICard } from '../components/ui'
import { Link } from 'react-router-dom'

// ── Data ─────────────────────────────────────────────────────────────────────

const RESULTS = [
  {
    number: 1,
    candidate: 'Anies Baswedan – Muhaimin Iskandar',
    person_id_capres: 'anies',
    person_id_cawapres: 'cakimin',
    votes_pct: 24.95,
    votes_abs: '40.97 juta',
    parties: ['PKB', 'NasDem', 'PKS', 'Hanura', 'Ummat'],
    color: '#3B82F6',
    result: 'Kalah',
    provinces_won: 5,
    strongholds: ['Aceh', 'NTB', 'Sumatera Barat', 'DKI Jakarta', 'Kalbar'],
  },
  {
    number: 2,
    candidate: 'Prabowo Subianto – Gibran Rakabuming',
    person_id_capres: 'prabowo',
    person_id_cawapres: 'gibran',
    votes_pct: 58.59,
    votes_abs: '96.21 juta',
    parties: ['Gerindra', 'Golkar', 'Demokrat', 'PAN', 'PKB(akhir)', 'NasDem(akhir)', 'PPP', 'Hanura'],
    color: '#DC2626',
    result: 'Menang',
    provinces_won: 36,
    strongholds: ['Jawa Tengah', 'Jawa Barat', 'Sumatera Utara', 'Kalimantan', 'Papua'],
  },
  {
    number: 3,
    candidate: 'Ganjar Pranowo – Mahfud MD',
    person_id_capres: 'ganjar',
    person_id_cawapres: 'mahfud_md',
    votes_pct: 16.47,
    votes_abs: '27.04 juta',
    parties: ['PDIP', 'PPP(awal)', 'Perindo', 'Hanura(awal)'],
    color: '#DC143C',
    result: 'Kalah',
    provinces_won: 2,
    strongholds: ['DI Yogyakarta', 'Bali'],
  },
]

const PROVINCE_TABLE = {
  anies: [
    'Aceh', 'Sumatera Barat', 'DKI Jakarta', 'NTB', 'Kalimantan Barat',
    'Bengkulu*', 'Riau*', 'Maluku*', 'Sulawesi Tenggara*', 'Kep. Riau*',
  ],
  prabowo: [
    'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Sumatera Utara',
    'Sulawesi Selatan', 'Kalimantan Timur', 'Papua', 'NTT', 'Lampung',
    'Sumatera Selatan',
  ],
  ganjar: [
    'DI Yogyakarta', 'Bali', '—', '—', '—', '—', '—', '—', '—', '—',
  ],
}

const KEY_EVENTS = [
  {
    date: 'Okt 2023',
    event: 'Gibran Ditetapkan Cawapres',
    desc: 'MK ubah batas usia — jalan Gibran terbuka',
    icon: '⚖️',
  },
  {
    date: 'Nov 2023',
    event: 'Koalisi Indonesia Maju Solid',
    desc: 'Golkar, PAN, Demokrat bergabung',
    icon: '🤝',
  },
  {
    date: 'Jan 2024',
    event: 'Debat Capres Viral',
    desc: 'Gibran vs Mahfud — meme Kanjeng Dimas',
    icon: '📺',
  },
  {
    date: '14 Feb 2024',
    event: 'Hari Pemungutan Suara',
    desc: 'Prabowo menang 58.59% satu putaran',
    icon: '🗳️',
  },
  {
    date: 'Apr 2024',
    event: 'MK Tolak Gugatan Anies & Ganjar',
    desc: 'Hasil final — Prabowo presiden terpilih',
    icon: '✅',
  },
  {
    date: '20 Okt 2024',
    event: 'Pelantikan Prabowo-Gibran',
    desc: 'Kabinet Merah Putih dilantik',
    icon: '🏛️',
  },
]

const REKONSILIASI = [
  {
    icon: '🔄',
    title: 'NasDem & PKB Masuk Koalisi',
    desc: 'Kedua partai pendukung Anies akhirnya bergabung ke koalisi Prabowo pasca pilpres.',
  },
  {
    icon: '🏛️',
    title: 'PDIP Jadi Oposisi Resmi',
    desc: 'Pertama kali sejak era Reformasi, PDIP menjadi oposisi murni tanpa jabatan di kabinet.',
  },
  {
    icon: '🔒',
    title: 'PKS Tetap Oposisi',
    desc: 'PKS konsisten menolak bergabung ke koalisi pemerintah dan memilih jalur oposisi.',
  },
  {
    icon: '👤',
    title: 'Mahfud Mundur dari Kabinet',
    desc: 'Mahfud MD mundur dari posisi Menkopolhukam (Maret 2024) sebelum hari pemungutan suara.',
  },
  {
    icon: '🌿',
    title: 'Sandiaga ke PPP',
    desc: 'Sandiaga Uno — mantan cawapres Prabowo 2019, kemudian ke Koalisi — pindah ke PPP.',
  },
]

const INSIGHTS = [
  {
    icon: '🗳️',
    label: 'Angka Partisipasi',
    value: '81.79%',
    sub: 'Tertinggi sejak 2009',
    color: '#10B981',
  },
  {
    icon: '📊',
    label: 'Menang 1 Putaran',
    value: '58.59%',
    sub: 'Pertama sejak sistem 2 putaran berlaku',
    color: '#DC2626',
  },
  {
    icon: '🔥',
    label: 'Basis Kemenangan',
    value: 'Gen Z & Millenial',
    sub: 'Ditambah dukungan TNI/Polri',
    color: '#F59E0B',
  },
  {
    icon: '🏛️',
    label: 'Faktor MK',
    value: 'Putusan Batas Usia',
    sub: 'Kontroversi putusan syarat usia Cawapres',
    color: '#8B5CF6',
  },
]

const CHART_DATA = RESULTS.map(r => ({
  name: `Paslon ${r.number}`,
  pct: r.votes_pct,
  color: r.color,
  label: r.candidate.split('–')[0].trim(),
}))

// ── Sub-components ────────────────────────────────────────────────────────────

function PersonAvatar({ personId, size = 14 }) {
  const person = PERSONS.find(p => p.id === personId)
  if (!person) return null
  return (
    <Link to={`/persons/${personId}`} title={person.name}>
      <img
        src={person.photo_url}
        alt={person.name}
        className={`w-${size} h-${size} rounded-full object-cover border-2 border-white/20 hover:border-accent-red transition-all`}
        onError={e => {
          e.currentTarget.style.display = 'none'
        }}
      />
    </Link>
  )
}

function ResultCard({ r }) {
  const isWinner = r.result === 'Menang'
  return (
    <Card
      className={`relative overflow-hidden transition-all ${isWinner ? 'ring-2' : ''}`}
      style={isWinner ? { '--tw-ring-color': r.color } : {}}
    >
      {/* color bar top */}
      <div className="h-1.5 w-full rounded-t-xl" style={{ backgroundColor: r.color }} />

      <div className="p-5">
        {/* header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full mb-1 inline-block"
              style={{ backgroundColor: r.color + '20', color: r.color }}
            >
              Paslon {r.number}
            </span>
            <h3 className="text-sm font-bold text-text-primary leading-snug mt-1">
              {r.candidate}
            </h3>
          </div>
          {isWinner && (
            <span className="text-2xl flex-shrink-0" title="Pemenang">🏆</span>
          )}
        </div>

        {/* avatars */}
        <div className="flex gap-3 mb-4">
          <div className="flex flex-col items-center gap-1">
            <PersonAvatar personId={r.person_id_capres} size={12} />
            <span className="text-[10px] text-text-muted">Capres</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <PersonAvatar personId={r.person_id_cawapres} size={12} />
            <span className="text-[10px] text-text-muted">Cawapres</span>
          </div>
        </div>

        {/* votes */}
        <div className="mb-4">
          <div className="flex items-end gap-2 mb-1">
            <span className="text-3xl font-black" style={{ color: r.color }}>
              {r.votes_pct}%
            </span>
            <span className="text-sm text-text-secondary mb-1">{r.votes_abs} suara</span>
          </div>
          {/* vote bar */}
          <div className="h-2.5 w-full bg-bg-elevated rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${r.votes_pct}%`, backgroundColor: r.color }}
            />
          </div>
        </div>

        {/* stats row */}
        <div className="flex gap-4 text-xs text-text-secondary mb-4">
          <span>🏙️ {r.provinces_won} provinsi</span>
          <span
            className="font-semibold"
            style={{ color: isWinner ? '#10B981' : '#EF4444' }}
          >
            {isWinner ? '✅' : '❌'} {r.result}
          </span>
        </div>

        {/* parties */}
        <div className="mb-3">
          <p className="text-[10px] text-text-muted uppercase tracking-wide mb-1.5">Koalisi</p>
          <div className="flex flex-wrap gap-1">
            {r.parties.map(p => (
              <span
                key={p}
                className="text-[10px] px-1.5 py-0.5 rounded bg-bg-elevated text-text-secondary border border-border"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* strongholds */}
        <div>
          <p className="text-[10px] text-text-muted uppercase tracking-wide mb-1.5">Basis Kuat</p>
          <div className="flex flex-wrap gap-1">
            {r.strongholds.map(s => (
              <span
                key={s}
                className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                style={{ backgroundColor: r.color + '15', color: r.color }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-bg-elevated border border-border rounded-xl px-4 py-3 shadow-xl text-sm">
      <p className="font-bold text-text-primary">{d.label}</p>
      <p className="text-text-secondary mt-0.5" style={{ color: d.color }}>
        {d.pct}% suara
      </p>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Pilpres2024Page() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-10">
      <PageHeader
        title="🗳️ Pilpres 2024"
        subtitle="Analisis komprehensif Pemilihan Presiden Indonesia 14 Februari 2024"
      />

      {/* ── Section 1: Headline Results ── */}
      <section>
        <h2 className="text-lg font-bold text-text-primary mb-4">📋 Hasil Pilpres 2024</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {RESULTS.map(r => <ResultCard key={r.number} r={r} />)}
        </div>
      </section>

      {/* ── Section 6: Chart (moved up for visual impact) ── */}
      <section>
        <h2 className="text-lg font-bold text-text-primary mb-4">📊 Head to Head Perolehan Suara</h2>
        <Card className="p-5">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={CHART_DATA}
              layout="vertical"
              margin={{ top: 4, right: 60, left: 20, bottom: 4 }}
            >
              <XAxis
                type="number"
                domain={[0, 70]}
                tickFormatter={v => `${v}%`}
                tick={{ fontSize: 11, fill: 'var(--color-text-secondary, #888)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={70}
                tick={{ fontSize: 12, fill: 'var(--color-text-secondary, #888)' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="pct" radius={[0, 6, 6, 0]} label={{ position: 'right', formatter: v => `${v}%`, fontSize: 12, fill: '#888' }}>
                {CHART_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-4 justify-center mt-2">
            {RESULTS.map(r => (
              <div key={r.number} className="flex items-center gap-1.5 text-xs text-text-secondary">
                <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: r.color }} />
                {r.candidate.split('–')[0].trim()}
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* ── Section 3: Analisis Kemenangan ── */}
      <section>
        <h2 className="text-lg font-bold text-text-primary mb-4">🔍 Analisis Kemenangan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INSIGHTS.map(ins => (
            <KPICard
              key={ins.label}
              icon={ins.icon}
              label={ins.label}
              value={ins.value}
              sub={ins.sub}
              color={ins.color}
            />
          ))}
        </div>
      </section>

      {/* ── Section 2: Peta Kemenangan ── */}
      <section>
        <h2 className="text-lg font-bold text-text-primary mb-4">🗺️ Peta Kemenangan Provinsi</h2>
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {RESULTS.map(r => (
                  <th
                    key={r.number}
                    className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide"
                    style={{ color: r.color }}
                  >
                    Paslon {r.number} · {r.candidate.split('–')[0].trim()}
                    <span className="ml-1 text-text-muted font-normal normal-case">
                      ({r.provinces_won} prov)
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 10 }).map((_, i) => (
                <tr
                  key={i}
                  className="border-b border-border/50 hover:bg-bg-elevated/50 transition-colors"
                >
                  <td className="px-4 py-2 text-text-secondary">
                    {PROVINCE_TABLE.anies[i] || '—'}
                  </td>
                  <td className="px-4 py-2 text-text-secondary">
                    {PROVINCE_TABLE.prabowo[i] || '—'}
                  </td>
                  <td className="px-4 py-2 text-text-muted italic">
                    {PROVINCE_TABLE.ganjar[i]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[11px] text-text-muted px-4 pb-3 pt-1">* Estimasi/rekap tidak resmi. Sumber: KPU RI.</p>
        </Card>
      </section>

      {/* ── Section 4: Timeline Faktor Kemenangan ── */}
      <section>
        <h2 className="text-lg font-bold text-text-primary mb-4">📅 Faktor Kemenangan Prabowo — Timeline</h2>
        <div className="relative pl-8">
          {/* vertical line */}
          <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-5">
            {KEY_EVENTS.map((ev, i) => (
              <div key={i} className="relative">
                {/* dot */}
                <div
                  className="absolute -left-[18px] w-4 h-4 rounded-full border-2 border-bg-base flex items-center justify-center text-[10px]"
                  style={{ backgroundColor: '#DC2626', top: '2px' }}
                >
                  <span className="text-[8px]">{i + 1}</span>
                </div>

                <Card className="p-4 hover:ring-1 hover:ring-accent-red/30 transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-mono text-text-muted bg-bg-elevated px-2 py-0.5 rounded">
                          {ev.date}
                        </span>
                        <span className="text-base">{ev.icon}</span>
                      </div>
                      <p className="text-sm font-bold text-text-primary">{ev.event}</p>
                      <p className="text-xs text-text-secondary mt-0.5">{ev.desc}</p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: Pasca Pilpres ── */}
      <section>
        <h2 className="text-lg font-bold text-text-primary mb-4">🤝 Pasca Pilpres: Rekonsiliasi & Konstelasi Baru</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REKONSILIASI.map(item => (
            <Card key={item.title} className="p-4 flex gap-3">
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="text-sm font-bold text-text-primary mb-0.5">{item.title}</p>
                <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Section 7: Sumber Data ── */}
      <section>
        <h2 className="text-lg font-bold text-text-primary mb-3">📚 Sumber Data</h2>
        <Card className="p-5">
          <ul className="space-y-2">
            {[
              { label: 'KPU RI', url: 'https://kpu.go.id', desc: 'Komisi Pemilihan Umum — hasil resmi rekapitulasi nasional' },
              { label: 'Litbang Kompas', url: 'https://kompas.id', desc: 'Analisis dan infografis pasca-pemilu' },
              { label: 'SMRC Exit Poll', url: 'https://smrc.or.id', desc: 'Exit poll dan analisis perilaku pemilih 2024' },
            ].map(s => (
              <li key={s.label} className="flex items-start gap-3">
                <span className="text-accent-red mt-0.5">→</span>
                <div>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-accent-red hover:underline"
                  >
                    {s.label}
                  </a>
                  <p className="text-xs text-text-secondary">{s.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  )
}
