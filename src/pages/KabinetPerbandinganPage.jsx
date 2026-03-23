import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

// ─── Data ───────────────────────────────────────────────────────────────────
const CABINET_DATA = [
  {
    id: "habibie",
    name: "Kabinet Reformasi Pembangunan",
    president: "B.J. Habibie",
    period: "1998–1999",
    size: 36,
    notable_ministers: [
      { name: "Wiranto", jabatan: "Panglima ABRI / Menhan", notable: "Transisi damai" },
      { name: "Fuad Bawazier", jabatan: "Menteri Keuangan", notable: "Krisis fiskal" },
      { name: "Jusuf Habibie", jabatan: "Menristek (sebelumnya)", notable: "Teknokrat" }
    ],
    legacy: ["Kebebasan pers", "Referendum Timtim", "Pemilu 1999"],
    score: 7,
    color: "#F59E0B",
    civilian_pct: 60,
    military_pct: 40
  },
  {
    id: "gusdur",
    name: "Kabinet Persatuan Nasional",
    president: "Abdurrahman Wahid (Gus Dur)",
    period: "1999–2001",
    size: 35,
    notable_ministers: [
      { name: "Mahfud MD", jabatan: "Menteri Pertahanan", notable: "Reformasi TNI" },
      { name: "Alwi Shihab", jabatan: "Menlu", notable: "Diplomasi" },
      { name: "Sri Mulyani", jabatan: "Anggota Dewan Ekonomi", notable: "Ekonom" }
    ],
    legacy: ["Pisah TNI-Polri", "Pluralisme", "Desentralisasi"],
    score: 7,
    color: "#10B981",
    civilian_pct: 80,
    military_pct: 20
  },
  {
    id: "megawati",
    name: "Kabinet Gotong Royong",
    president: "Megawati Soekarnoputri",
    period: "2001–2004",
    size: 32,
    notable_ministers: [
      { name: "Dorodjatun Kuntjoro-Jakti", jabatan: "Menko Ekonomi", notable: "Stabilisasi" },
      { name: "Susilo Bambang Yudhoyono", jabatan: "Menko Polkam", notable: "Calon presiden" },
      { name: "Bambang Sudibyo", jabatan: "Menkeu", notable: "Fiskal" }
    ],
    legacy: ["KPK 2002", "UU Keuangan Negara", "Pemilu langsung 2004"],
    score: 6,
    color: "#DC2626",
    civilian_pct: 85,
    military_pct: 15
  },
  {
    id: "sby1",
    name: "Kabinet Indonesia Bersatu I",
    president: "Susilo Bambang Yudhoyono",
    period: "2004–2009",
    size: 36,
    notable_ministers: [
      { name: "Sri Mulyani", jabatan: "Menteri Keuangan", notable: "Reformasi fiskal" },
      { name: "Boediono", jabatan: "Menko Ekonomi", notable: "Pertumbuhan 6%" },
      { name: "Hasan Wirajuda", jabatan: "Menlu", notable: "Diplomasi aktif" }
    ],
    legacy: ["MoU Helsinki-Aceh", "KPK aktif", "Pertumbuhan 5-6%"],
    score: 8,
    color: "#3B82F6",
    civilian_pct: 75,
    military_pct: 25
  },
  {
    id: "sby2",
    name: "Kabinet Indonesia Bersatu II",
    president: "Susilo Bambang Yudhoyono",
    period: "2009–2014",
    size: 34,
    notable_ministers: [
      { name: "Boediono", jabatan: "Wakil Presiden", notable: "Teknokrat" },
      { name: "Hatta Rajasa", jabatan: "Menko Ekonomi", notable: "MP3EI" },
      { name: "Dahlan Iskan", jabatan: "Menteri BUMN", notable: "Transformasi BUMN" }
    ],
    legacy: ["BPJS 2014", "UU Desa", "Korupsi Demokrat meledak"],
    score: 6,
    color: "#2563EB",
    civilian_pct: 78,
    military_pct: 22
  },
  {
    id: "jokowi1",
    name: "Kabinet Kerja",
    president: "Joko Widodo",
    period: "2014–2019",
    size: 34,
    notable_ministers: [
      { name: "Sri Mulyani", jabatan: "Menteri Keuangan (2016)", notable: "Reformasi pajak" },
      { name: "Luhut Binsar Pandjaitan", jabatan: "Menko Kemaritiman", notable: "Infra masif" },
      { name: "Retno Marsudi", jabatan: "Menlu", notable: "Diplomasi aktif" }
    ],
    legacy: ["1.900 km tol", "BPJS diperluas", "Infrastruktur masif"],
    score: 7,
    color: "#DC2626",
    civilian_pct: 70,
    military_pct: 30
  },
  {
    id: "jokowi2",
    name: "Kabinet Indonesia Maju",
    president: "Joko Widodo",
    period: "2019–2024",
    size: 38,
    notable_ministers: [
      { name: "Prabowo Subianto", jabatan: "Menteri Pertahanan", notable: "Kandidat 2024" },
      { name: "Erick Thohir", jabatan: "Menteri BUMN", notable: "Danantara" },
      { name: "Nadiem Makarim", jabatan: "Mendikbud", notable: "Merdeka Belajar" }
    ],
    legacy: ["UU Cipta Kerja", "IKN", "Hilirisasi nikel"],
    score: 6,
    color: "#B91C1C",
    civilian_pct: 65,
    military_pct: 35
  },
  {
    id: "prabowo",
    name: "Kabinet Merah Putih",
    president: "Prabowo Subianto",
    period: "2024–kini",
    size: 48,
    notable_ministers: [
      { name: "Sri Mulyani", jabatan: "Menteri Keuangan", notable: "Kontinuitas" },
      { name: "Puan Maharani / AHY / dll", jabatan: "Berbagai pos", notable: "Koalisi besar" },
      { name: "Erick Thohir", jabatan: "Menteri BUMN", notable: "Danantara lanjut" }
    ],
    legacy: ["Kabinet terbesar sejarah", "MBG", "Efisiensi kontroversial"],
    score: 5,
    color: "#7C3AED",
    civilian_pct: 72,
    military_pct: 28
  }
];

// "Hall of fame" ministers — cross-cabinet appearances
const LINTAS_KABINET = [
  {
    name: "Sri Mulyani Indrawati",
    initials: "SM",
    color: "#3B82F6",
    count: 4,
    cabinets: ["Kabinet Kerja", "Kabinet Indonesia Maju", "Kabinet Merah Putih", "Dewan Ekonomi (Gus Dur)"],
    roles: "Menkeu (3x) + Dewan Ekonomi (1x)",
    note: "Menteri Keuangan terlama & paling berpengaruh era Reformasi"
  },
  {
    name: "Luhut Binsar Pandjaitan",
    initials: "LB",
    color: "#10B981",
    count: 2,
    cabinets: ["Kabinet Kerja", "Kabinet Indonesia Maju"],
    roles: "Menko Kemaritiman (2x)",
    note: "\"Menteri segala urusan\" era Jokowi"
  },
  {
    name: "Erick Thohir",
    initials: "ET",
    color: "#F59E0B",
    count: 2,
    cabinets: ["Kabinet Indonesia Maju", "Kabinet Merah Putih"],
    roles: "Menteri BUMN (2x)",
    note: "Pengawal Danantara & transformasi BUMN"
  }
];

// ─── Helper components ────────────────────────────────────────────────────────

function ScoreStars({ score }) {
  return (
    <span className="text-sm" title={`Skor legacy: ${score}/10`}>
      {[...Array(10)].map((_, i) => (
        <span key={i} className={i < score ? 'text-yellow-400' : 'text-gray-600'}>★</span>
      ))}
    </span>
  );
}

function Avatar({ president, color, size = 'md' }) {
  const initials = president
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();
  const sz = size === 'lg' ? 'w-14 h-14 text-xl' : 'w-10 h-10 text-base';
  return (
    <div
      className={`${sz} rounded-full flex items-center justify-center font-bold text-white shrink-0`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

function SizeMeter({ size, max = 50 }) {
  const pct = Math.round((size / max) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-text-secondary mb-1">
        <span>Ukuran kabinet</span>
        <span className="font-semibold text-text-primary">{size} menteri</span>
      </div>
      <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: '#EF4444' }}
        />
      </div>
    </div>
  );
}

// Custom tooltip for bar chart
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-bg-card border border-border rounded-xl p-3 shadow-lg text-sm max-w-xs">
      <p className="font-semibold text-text-primary mb-1">{d.name}</p>
      <p className="text-text-secondary text-xs mb-1">{d.president} · {d.period}</p>
      <p className="text-text-primary">🏛️ {d.size} menteri</p>
      <div className="mt-1 flex flex-wrap gap-1">
        {d.legacy.map(l => (
          <span key={l} className="text-xs bg-bg-elevated text-text-secondary px-1.5 py-0.5 rounded-full">{l}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function KabinetPerbandinganPage() {
  const [compareA, setCompareA] = useState('sby1');
  const [compareB, setCompareB] = useState('prabowo');

  const cabA = CABINET_DATA.find(c => c.id === compareA);
  const cabB = CABINET_DATA.find(c => c.id === compareB);

  // Stats
  const totalKabinet = CABINET_DATA.length;
  const largest = CABINET_DATA.reduce((a, b) => (a.size > b.size ? a : b));
  const smallest = CABINET_DATA.reduce((a, b) => (a.size < b.size ? a : b));
  const avgSize = Math.round(CABINET_DATA.reduce((s, c) => s + c.size, 0) / CABINET_DATA.length);

  // Chart data (horizontal bar — recharts layout="vertical")
  const chartData = CABINET_DATA.map(c => ({
    ...c,
    shortName: c.name.replace('Kabinet ', ''),
  }));

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      {/* ── Header ── */}
      <div className="border-b border-border bg-bg-card px-4 md:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">🏛️</span>
            <h1 className="text-2xl md:text-3xl font-bold">Perbandingan Kabinet Indonesia</h1>
          </div>
          <p className="text-text-secondary ml-12">
            Era Reformasi 1998–kini · 8 kabinet · komposisi, ukuran, warisan
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-10">

        {/* ── Section 1: Overview Stats ── */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Kabinet Reformasi', value: totalKabinet, suffix: 'kabinet', icon: '🏛️' },
              { label: 'Kabinet Terbesar', value: largest.size, suffix: 'menteri', sub: largest.name.replace('Kabinet ', ''), icon: '📈' },
              { label: 'Kabinet Terkecil', value: smallest.size, suffix: 'menteri', sub: smallest.name.replace('Kabinet ', ''), icon: '📉' },
              { label: 'Rata-rata Ukuran', value: avgSize, suffix: 'menteri', icon: '📊' },
            ].map(stat => (
              <div key={stat.label} className="bg-bg-card border border-border rounded-xl p-4 flex flex-col gap-1">
                <div className="text-2xl">{stat.icon}</div>
                <div className="text-3xl font-bold text-accent-red">{stat.value}</div>
                <div className="text-xs text-text-secondary">{stat.suffix}</div>
                <div className="text-sm font-medium text-text-primary leading-tight">{stat.label}</div>
                {stat.sub && <div className="text-xs text-text-secondary italic">{stat.sub}</div>}
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 2: Kabinet Cards Grid ── */}
        <section>
          <h2 className="text-xl font-bold mb-4">📋 Semua Kabinet Era Reformasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CABINET_DATA.map(cab => (
              <div key={cab.id} className="bg-bg-card border border-border rounded-xl p-4 hover:border-accent-red/50 transition-colors">
                {/* Header row */}
                <div className="flex items-start gap-3 mb-3">
                  <Avatar president={cab.president} color={cab.color} />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-base leading-snug">{cab.name}</div>
                    <div className="text-xs text-text-secondary">{cab.president}</div>
                    <div className="text-xs text-text-secondary mt-0.5">
                      <span className="bg-bg-elevated px-2 py-0.5 rounded-full">{cab.period}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-bold" style={{ color: cab.color }}>{cab.score}/10</div>
                    <div className="text-xs text-text-secondary">skor</div>
                  </div>
                </div>

                {/* Size meter */}
                <div className="mb-3">
                  <SizeMeter size={cab.size} />
                </div>

                {/* Stars */}
                <div className="mb-3">
                  <ScoreStars score={cab.score} />
                </div>

                {/* Composition bar */}
                <div className="flex h-2 rounded-full overflow-hidden mb-1">
                  <div
                    className="h-full"
                    style={{ width: `${cab.civilian_pct}%`, backgroundColor: '#3B82F6' }}
                    title={`Sipil: ${cab.civilian_pct}%`}
                  />
                  <div
                    className="h-full"
                    style={{ width: `${cab.military_pct}%`, backgroundColor: '#EF4444' }}
                    title={`Militer/Polisi: ${cab.military_pct}%`}
                  />
                </div>
                <div className="flex gap-3 text-xs text-text-secondary mb-3">
                  <span><span className="text-blue-400">■</span> Sipil {cab.civilian_pct}%</span>
                  <span><span className="text-red-400">■</span> Militer {cab.military_pct}%</span>
                </div>

                {/* Legacy tags */}
                <div className="flex flex-wrap gap-1">
                  {cab.legacy.map(tag => (
                    <span key={tag} className="text-xs bg-bg-elevated text-text-secondary px-2 py-0.5 rounded-full border border-border">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 3: Side-by-side Comparison ── */}
        <section>
          <h2 className="text-xl font-bold mb-4">⚖️ Perbandingan Detail</h2>
          <div className="bg-bg-card border border-border rounded-xl p-4 md:p-6">
            {/* Selectors */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { value: compareA, setter: setCompareA, other: compareB },
                { value: compareB, setter: setCompareB, other: compareA },
              ].map((sel, idx) => (
                <div key={idx}>
                  <label className="block text-xs text-text-secondary mb-1 font-medium">
                    Kabinet {idx + 1}
                  </label>
                  <select
                    className="w-full bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-red"
                    value={sel.value}
                    onChange={e => sel.setter(e.target.value)}
                  >
                    {CABINET_DATA.map(c => (
                      <option key={c.id} value={c.id} disabled={c.id === sel.other}>
                        {c.name} ({c.period})
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Side-by-side diff */}
            {cabA && cabB && (
              <div className="grid grid-cols-2 gap-4">
                {[cabA, cabB].map((cab, idx) => (
                  <div
                    key={cab.id}
                    className="rounded-xl border-2 p-4"
                    style={{ borderColor: cab.color + '80', backgroundColor: cab.color + '10' }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Avatar president={cab.president} color={cab.color} size="lg" />
                      <div>
                        <div className="font-bold text-sm leading-snug">{cab.name}</div>
                        <div className="text-xs text-text-secondary">{cab.president}</div>
                        <div className="text-xs text-text-secondary">{cab.period}</div>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Ukuran</span>
                        <span
                          className="font-bold"
                          style={{ color: (idx === 0 ? cabA.size > cabB.size : cabB.size > cabA.size) ? '#22C55E' : '#EF4444' }}
                        >
                          {cab.size} menteri
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Skor Legacy</span>
                        <span
                          className="font-bold"
                          style={{ color: (idx === 0 ? cabA.score >= cabB.score : cabB.score >= cabA.score) ? '#22C55E' : '#EF4444' }}
                        >
                          {cab.score}/10
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Sipil / Militer</span>
                        <span className="font-medium text-text-primary">{cab.civilian_pct}% / {cab.military_pct}%</span>
                      </div>
                    </div>

                    {/* Notable ministers */}
                    <div className="mb-3">
                      <div className="text-xs font-semibold text-text-secondary uppercase mb-1">Menteri Notable</div>
                      <ul className="space-y-1">
                        {cab.notable_ministers.map(m => (
                          <li key={m.name} className="text-xs">
                            <span className="font-medium text-text-primary">{m.name}</span>
                            <span className="text-text-secondary"> — {m.jabatan}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Legacy */}
                    <div>
                      <div className="text-xs font-semibold text-text-secondary uppercase mb-1">Warisan Utama</div>
                      <div className="flex flex-wrap gap-1">
                        {cab.legacy.map(tag => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ backgroundColor: cab.color + '30', color: cab.color }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Section 4: Timeline Bar Chart ── */}
        <section>
          <h2 className="text-xl font-bold mb-4">📊 Ukuran Kabinet — Timeline</h2>
          <div className="bg-bg-card border border-border rounded-xl p-4 md:p-6">
            <p className="text-xs text-text-secondary mb-4">Jumlah menteri per kabinet (hover untuk detail)</p>
            <ResponsiveContainer width="100%" height={340}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 0, right: 40, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 55]}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={{ stroke: '#334155' }}
                  tickLine={false}
                  label={{ value: 'Jumlah Menteri', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 11 }}
                />
                <YAxis
                  type="category"
                  dataKey="shortName"
                  width={160}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="size" radius={[0, 6, 6, 0]} maxBarSize={28}>
                  {chartData.map(c => (
                    <Cell key={c.id} fill={c.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* ── Section 5: Menteri Lintas Kabinet ── */}
        <section>
          <h2 className="text-xl font-bold mb-1">🌟 Menteri Lintas Kabinet</h2>
          <p className="text-sm text-text-secondary mb-4">Hall of fame — tokoh yang menjabat di lebih dari satu kabinet era Reformasi</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LINTAS_KABINET.map(m => (
              <div
                key={m.name}
                className="bg-bg-card border border-border rounded-xl p-5 hover:border-accent-red/50 transition-colors"
              >
                {/* Avatar + count badge */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-xl"
                      style={{ backgroundColor: m.color }}
                    >
                      {m.initials}
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-black">
                      {m.count}
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-sm">{m.name}</div>
                    <div className="text-xs text-text-secondary">{m.count}× kabinet</div>
                  </div>
                </div>

                <div className="text-xs font-semibold text-text-secondary uppercase mb-1">Peran</div>
                <p className="text-sm text-text-primary mb-3">{m.roles}</p>

                <div className="text-xs font-semibold text-text-secondary uppercase mb-1">Kabinet</div>
                <ul className="space-y-0.5 mb-3">
                  {m.cabinets.map(cab => (
                    <li key={cab} className="text-xs text-text-secondary flex items-center gap-1">
                      <span className="text-yellow-400">•</span> {cab}
                    </li>
                  ))}
                </ul>

                <p className="text-xs italic text-text-secondary border-t border-border pt-2">{m.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer note ── */}
        <div className="text-center text-xs text-text-secondary pb-4">
          Data: Sekretariat Kabinet RI · Reformasi 1998–2026 · PetaPolitik.id
        </div>

      </div>
    </div>
  );
}
