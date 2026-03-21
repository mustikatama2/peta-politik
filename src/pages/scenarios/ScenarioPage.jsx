import { useState, useMemo } from 'react'
import { PARTIES, PARTY_MAP } from '../../data/parties'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend } from 'recharts'

const CANDIDATES_2029 = [
  { id: 'prabowo',      name: 'Prabowo Subianto',   party: 'ger',  electable: 70, note: 'Incumbent. Bisa maju 1x lagi.' },
  { id: 'gibran',       name: 'Gibran Rakabuming',  party: 'gol',  electable: 55, note: 'Wapres aktif, dilarang maju 2029 kecuali Prabowo tidak maju.' },
  { id: 'anies',        name: 'Anies Baswedan',     party: null,   electable: 65, note: 'Terkuat dari oposisi. Butuh partai pengusung.' },
  { id: 'dedi_mulyadi', name: 'Dedi Mulyadi',       party: 'ger',  electable: 60, note: 'Gubernur Jabar. Elektabilitas meningkat pesat.' },
  { id: 'pramono_anung',name: 'Pramono Anung',      party: 'pdip', electable: 45, note: 'Gubernur DKI. PDIP membutuhkan kandidat segar.' },
  { id: 'khofifah',     name: 'Khofifah I.P.',      party: 'pkb',  electable: 50, note: 'Gubernur Jatim dua periode. Basis NU kuat.' },
  { id: 'ahy',          name: 'Agus H. Yudhoyono',  party: 'dem',  electable: 42, note: 'Masih muda, pengalaman kabinet.' },
  { id: 'ridwan_kamil', name: 'Ridwan Kamil',        party: 'gol',  electable: 55, note: 'Kalah DKI 2024, masih populer.' },
  { id: 'ganjar',       name: 'Ganjar Pranowo',      party: 'pdip', electable: 40, note: 'Kalah Pilpres 2024. PDIP perlu evaluasi.' },
]

const TOTAL_SEATS = PARTIES.reduce((s, p) => s + (p.seats_2024 || 0), 0) // 580

const PASLON_COLORS = ['#EF4444', '#3B82F6', '#22C55E']
const PASLON_LABELS = ['Paslon 1', 'Paslon 2', 'Paslon 3']

const HISTORICAL = [
  { year: '2014', paslon1: 'Joko Widodo – JK', paslon2: 'Prabowo – Hatta', result: 'Jokowi (53.15%)', winner: 1 },
  { year: '2019', paslon1: 'Joko Widodo – Ma\'ruf', paslon2: 'Prabowo – Sandiaga', result: 'Jokowi (55.50%)', winner: 1 },
  { year: '2024', paslon1: 'Anies – Muhaimin', paslon2: 'Prabowo – Gibran', paslon3: 'Ganjar – Mahfud', result: 'Prabowo (58.59%)', winner: 2 },
]

const emptyPaslon = () => ({ capres: '', cawapres: '', parties: [] })

export default function ScenarioPage() {
  const [paslons, setPaslons] = useState([emptyPaslon(), emptyPaslon(), emptyPaslon()])

  const updatePaslon = (idx, field, value) => {
    setPaslons(prev => {
      const next = prev.map((p, i) => i === idx ? { ...p, [field]: value } : p)
      return next
    })
  }

  const toggleParty = (idx, partyId) => {
    setPaslons(prev => prev.map((p, i) => {
      if (i !== idx) return p
      const has = p.parties.includes(partyId)
      return { ...p, parties: has ? p.parties.filter(x => x !== partyId) : [...p.parties, partyId] }
    }))
  }

  const paslonStats = useMemo(() => {
    return paslons.map(p => {
      const capresData = CANDIDATES_2029.find(c => c.id === p.capres)
      const cawapresData = CANDIDATES_2029.find(c => c.id === p.cawapres)
      const seats = p.parties.reduce((s, pid) => s + (PARTY_MAP[pid]?.seats_2024 || 0), 0)
      const seatPct = TOTAL_SEATS > 0 ? (seats / TOTAL_SEATS * 100) : 0
      const votesPct = p.parties.reduce((s, pid) => s + (PARTY_MAP[pid]?.votes_2024 || 0), 0)
      const threshold = seatPct >= 20 || votesPct >= 25
      const electable = (capresData?.electable || 0) + Math.round((cawapresData?.electable || 0) * 0.3)
      return { capresData, cawapresData, seats, seatPct, votesPct, threshold, electable }
    })
  }, [paslons])

  // Chart data
  const chartData = paslons.map((p, i) => ({
    name: PASLON_LABELS[i],
    elektabilitas: paslonStats[i].electable,
    color: PASLON_COLORS[i],
    capres: paslonStats[i].capresData?.name || '—',
  }))

  // All used candidate IDs
  const usedCapres = paslons.map(p => p.capres).filter(Boolean)
  const usedCawapres = paslons.map(p => p.cawapres).filter(Boolean)

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">🔮 Skenario Pilpres 2029</h1>
        <p className="text-text-secondary text-sm mt-1">
          Bangun skenario "bagaimana jika" untuk Pemilihan Presiden 2029. Pilih kandidat, koalisi, dan lihat proyeksi.
        </p>
      </div>

      {/* Section 1: Candidate Selector */}
      <section>
        <h2 className="text-base font-semibold text-text-primary mb-4">
          🗳️ Bagian 1 — Susunan Paslon
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {paslons.map((paslon, idx) => (
            <div
              key={idx}
              className="bg-bg-card border rounded-xl p-4 space-y-3"
              style={{ borderColor: PASLON_COLORS[idx] + '40', borderLeftWidth: 3, borderLeftColor: PASLON_COLORS[idx] }}
            >
              <h3 className="text-sm font-semibold" style={{ color: PASLON_COLORS[idx] }}>
                {PASLON_LABELS[idx]}
              </h3>

              {/* Capres */}
              <div>
                <label className="text-[10px] text-text-secondary uppercase tracking-wide">Capres</label>
                <select
                  value={paslon.capres}
                  onChange={e => updatePaslon(idx, 'capres', e.target.value)}
                  className="w-full text-xs bg-bg-elevated border border-border rounded px-2 py-1.5 mt-0.5 text-text-primary"
                >
                  <option value="">Pilih Capres...</option>
                  {CANDIDATES_2029.filter(c => c.id !== paslon.cawapres && !usedCapres.filter((_, i) => i !== idx).includes(c.id)).map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {paslonStats[idx].capresData && (
                  <p className="text-[10px] text-text-secondary mt-1 italic">{paslonStats[idx].capresData.note}</p>
                )}
              </div>

              {/* Cawapres */}
              <div>
                <label className="text-[10px] text-text-secondary uppercase tracking-wide">Cawapres</label>
                <select
                  value={paslon.cawapres}
                  onChange={e => updatePaslon(idx, 'cawapres', e.target.value)}
                  className="w-full text-xs bg-bg-elevated border border-border rounded px-2 py-1.5 mt-0.5 text-text-primary"
                >
                  <option value="">Pilih Cawapres...</option>
                  {CANDIDATES_2029.filter(c => c.id !== paslon.capres && !usedCawapres.filter((_, i) => i !== idx).includes(c.id)).map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Elektabilitas preview */}
              {paslonStats[idx].capresData && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-text-secondary">Elektabilitas:</span>
                  <span className="font-bold" style={{ color: PASLON_COLORS[idx] }}>
                    {paslonStats[idx].electable}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Coalition Builder */}
      <section>
        <h2 className="text-base font-semibold text-text-primary mb-4">
          🏛️ Bagian 2 — Koalisi Partai
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {paslons.map((paslon, idx) => {
            const stats = paslonStats[idx]
            return (
              <div
                key={idx}
                className="bg-bg-card border rounded-xl p-4 space-y-3"
                style={{ borderColor: PASLON_COLORS[idx] + '40' }}
              >
                <h3 className="text-sm font-semibold" style={{ color: PASLON_COLORS[idx] }}>
                  Koalisi {PASLON_LABELS[idx]}
                </h3>

                {/* Party checkboxes */}
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {PARTIES.filter(p => p.seats_2024 > 0).map(party => (
                    <label key={party.id} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={paslon.parties.includes(party.id)}
                        onChange={() => toggleParty(idx, party.id)}
                        className="rounded accent-red-500"
                      />
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: party.color }}
                      />
                      <span className="text-xs text-text-primary group-hover:text-text-primary">{party.abbr}</span>
                      <span className="text-[10px] text-text-secondary ml-auto">{party.seats_2024} kursi</span>
                    </label>
                  ))}
                </div>

                {/* Threshold check */}
                <div className="border-t border-border pt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary">Total kursi:</span>
                    <span className="font-semibold text-text-primary">{stats.seats} ({stats.seatPct.toFixed(1)}%)</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary">Total suara:</span>
                    <span className="font-semibold text-text-primary">{stats.votesPct.toFixed(2)}%</span>
                  </div>
                  <div className={`mt-1.5 text-xs font-semibold px-2 py-1 rounded text-center ${
                    stats.threshold
                      ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                      : 'bg-red-500/10 text-red-400 border border-red-500/30'
                  }`}>
                    {stats.threshold ? '✅ Lolos threshold' : '❌ Tidak lolos (min 20% kursi atau 25% suara)'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Section 3: Projected Outcome */}
      <section>
        <h2 className="text-base font-semibold text-text-primary mb-4">
          📊 Bagian 3 — Proyeksi Hasil
        </h2>
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 4, right: 20, bottom: 4, left: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <YAxis domain={[0, 120]} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <Tooltip
                formatter={(v, n, p) => [`${v} poin`, `${p.payload.capres}`]}
                contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: 'var(--text-primary)' }}
              />
              <Bar dataKey="elektabilitas" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-text-secondary text-center mt-2">
            Skor elektabilitas gabungan Capres + bobot Cawapres (×0.3). Hanya estimasi.
          </p>
        </div>
      </section>

      {/* Section 4: Historical Context */}
      <section>
        <h2 className="text-base font-semibold text-text-primary mb-4">
          📜 Bagian 4 — Konteks Historis Pilpres
        </h2>
        <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg-elevated">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase">Tahun</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase">Paslon 1</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase">Paslon 2</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase">Paslon 3</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase">Pemenang</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {HISTORICAL.map(h => (
                <tr key={h.year} className="hover:bg-bg-elevated transition-colors">
                  <td className="px-4 py-3 font-bold text-text-primary">{h.year}</td>
                  <td className={`px-4 py-3 text-xs ${h.winner === 1 ? 'text-green-400 font-semibold' : 'text-text-secondary'}`}>
                    {h.paslon1}
                  </td>
                  <td className={`px-4 py-3 text-xs ${h.winner === 2 ? 'text-green-400 font-semibold' : 'text-text-secondary'}`}>
                    {h.paslon2}
                  </td>
                  <td className={`px-4 py-3 text-xs ${h.winner === 3 ? 'text-green-400 font-semibold' : 'text-text-secondary'}`}>
                    {h.paslon3 || '—'}
                  </td>
                  <td className="px-4 py-3 text-xs text-green-400 font-semibold">🏆 {h.result}</td>
                </tr>
              ))}
              <tr className="bg-accent-red/5 border-t-2 border-accent-red/30">
                <td className="px-4 py-3 font-bold text-accent-red">2029</td>
                <td className="px-4 py-3 text-xs text-text-secondary italic">
                  {paslonStats[0].capresData?.name || '(belum dipilih)'}
                </td>
                <td className="px-4 py-3 text-xs text-text-secondary italic">
                  {paslonStats[1].capresData?.name || '(belum dipilih)'}
                </td>
                <td className="px-4 py-3 text-xs text-text-secondary italic">
                  {paslonStats[2].capresData?.name || '(belum dipilih)'}
                </td>
                <td className="px-4 py-3 text-xs text-text-secondary italic">❓ Simulasi</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs text-text-secondary">
          <div className="bg-bg-elevated rounded p-2">
            <p className="font-semibold text-text-primary">2014</p>
            <p>Nasionalis vs Militer</p>
          </div>
          <div className="bg-bg-elevated rounded p-2">
            <p className="font-semibold text-text-primary">2019</p>
            <p>Rematch — margin melebar</p>
          </div>
          <div className="bg-bg-elevated rounded p-2">
            <p className="font-semibold text-text-primary">2024</p>
            <p>3 kandidat, menang 1 putaran</p>
          </div>
        </div>
      </section>

      <div className="text-xs text-text-secondary bg-bg-elevated rounded-lg p-3 border border-border">
        ⚠️ Simulasi ini bersifat spekulatif berdasarkan data elektabilitas publik 2024–2025. Bukan prediksi resmi.
        Aturan pilpres 2029 dapat berubah tergantung keputusan MK dan DPR.
      </div>
    </div>
  )
}
