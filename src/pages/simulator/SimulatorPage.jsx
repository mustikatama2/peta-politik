import { useState, useMemo, useEffect } from 'react'
import { PARTIES } from '../../data/parties'
import { PERSONS } from '../../data/persons'

// ─── DATA ─────────────────────────────────────────────────────────────────────

// Only parties with DPR seats
const SEAT_PARTIES = PARTIES.filter(p => p.seats_2024 > 0)
const TOTAL_SEATS = SEAT_PARTIES.reduce((s, p) => s + p.seats_2024, 0)

// High-influence persons (influence >= 8) for candidate picker
const TOP_PERSONS = PERSONS
  .filter(p => p.analysis?.influence >= 8 && p.tier !== 'historis')
  .sort((a, b) => (b.analysis?.influence || 0) - (a.analysis?.influence || 0))
  .slice(0, 20)

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getVotePct(partyIds) {
  const seats = partyIds.reduce((s, id) => {
    const p = PARTIES.find(p => p.id === id)
    return s + (p?.seats_2024 || 0)
  }, 0)
  return TOTAL_SEATS > 0 ? (seats / TOTAL_SEATS) * 100 : 0
}

function getWinLabel(pct) {
  if (pct > 50) return { icon: '✅', text: 'Menang Satu Putaran', cls: 'text-green-400 bg-green-500/10 border-green-500/30' }
  if (pct >= 40) return { icon: '⚠️', text: 'Kemungkinan Besar Menang', cls: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' }
  return { icon: '❌', text: 'Perlu Putaran Kedua', cls: 'text-red-400 bg-red-500/10 border-red-500/30' }
}

function loadSaved() {
  try {
    return JSON.parse(localStorage.getItem('peta_sim_saved') || '[]')
  } catch {
    return []
  }
}

// ─── PARTY CHIP ──────────────────────────────────────────────────────────────

function PartyChip({ party, assigned, onToggleA, onToggleB, inA, inB }) {
  return (
    <div
      className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border transition-all text-xs ${
        inA
          ? 'border-red-500/50 bg-red-500/10'
          : inB
          ? 'border-blue-500/50 bg-blue-500/10'
          : 'border-border bg-bg-elevated'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-base">{party.logo_emoji}</span>
        <div className="min-w-0">
          <span className="font-semibold text-text-primary">{party.abbr}</span>
          <span className="text-text-secondary ml-1.5">{party.seats_2024} kursi</span>
        </div>
      </div>
      <div className="flex gap-1 shrink-0">
        <button
          onClick={() => onToggleA(party.id)}
          title="Tambah ke Koalisi A"
          className={`w-6 h-6 rounded text-[10px] font-bold border transition-all ${
            inA
              ? 'bg-red-500 border-red-500 text-white'
              : 'border-border text-text-secondary hover:border-red-400 hover:text-red-400'
          }`}
        >
          A
        </button>
        <button
          onClick={() => onToggleB(party.id)}
          title="Tambah ke Koalisi B"
          className={`w-6 h-6 rounded text-[10px] font-bold border transition-all ${
            inB
              ? 'bg-blue-500 border-blue-500 text-white'
              : 'border-border text-text-secondary hover:border-blue-400 hover:text-blue-400'
          }`}
        >
          B
        </button>
      </div>
    </div>
  )
}

// ─── CANDIDATE PICKER ────────────────────────────────────────────────────────

function CandidatePicker({ label, color, value, onChange }) {
  return (
    <div>
      <label className="text-[10px] text-text-secondary uppercase tracking-wide">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full text-xs bg-bg-elevated border border-border rounded px-2 py-1.5 mt-0.5 text-text-primary"
        style={{ borderColor: value ? color + '60' : undefined }}
      >
        <option value="">— Pilih Kandidat —</option>
        {TOP_PERSONS.map(p => (
          <option key={p.id} value={p.id}>
            {p.name} ({p.analysis?.influence}/10)
          </option>
        ))}
      </select>
    </div>
  )
}

// ─── VOTE BAR ─────────────────────────────────────────────────────────────────

function VoteBar({ pctA, pctB }) {
  const pctNeither = Math.max(0, 100 - pctA - pctB)
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-text-secondary">
        <span style={{ color: '#EF4444' }}>Koalisi A: {pctA.toFixed(1)}%</span>
        <span className="text-text-secondary">Belum dipilih: {pctNeither.toFixed(1)}%</span>
        <span style={{ color: '#3B82F6' }}>Koalisi B: {pctB.toFixed(1)}%</span>
      </div>
      <div className="flex h-5 rounded-full overflow-hidden">
        <div
          className="transition-all duration-700"
          style={{ width: `${pctA}%`, backgroundColor: '#EF4444' }}
        />
        <div
          className="transition-all duration-700 bg-bg-elevated"
          style={{ width: `${pctNeither}%` }}
        />
        <div
          className="transition-all duration-700"
          style={{ width: `${pctB}%`, backgroundColor: '#3B82F6' }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-text-secondary">
        <span>← Koalisi A</span>
        <span>50% threshold</span>
        <span>Koalisi B →</span>
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function SimulatorPage() {
  const [coalitionA, setCoalitionA] = useState([])
  const [coalitionB, setCoalitionB] = useState([])
  const [candidateA, setCandidateA] = useState('')
  const [candidateB, setCandidateB] = useState('')
  const [savedScenarios, setSavedScenarios] = useState(loadSaved)
  const [saveLabel, setSaveLabel] = useState('')
  const [showSaved, setShowSaved] = useState(false)

  const pctA = useMemo(() => getVotePct(coalitionA), [coalitionA])
  const pctB = useMemo(() => getVotePct(coalitionB), [coalitionB])
  const winA = useMemo(() => getWinLabel(pctA), [pctA])
  const winB = useMemo(() => getWinLabel(pctB), [pctB])

  const toggleA = (id) => {
    setCoalitionA(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
    // Remove from B if present
    setCoalitionB(prev => prev.filter(x => x !== id))
  }

  const toggleB = (id) => {
    setCoalitionB(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
    // Remove from A if present
    setCoalitionA(prev => prev.filter(x => x !== id))
  }

  const handleReset = () => {
    setCoalitionA([])
    setCoalitionB([])
    setCandidateA('')
    setCandidateB('')
    setSaveLabel('')
  }

  const handleSave = () => {
    if (!coalitionA.length && !coalitionB.length) return
    const label = saveLabel.trim() || `Skenario ${new Date().toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}`
    const scenario = {
      id: Date.now(),
      label,
      coalitionA,
      coalitionB,
      candidateA,
      candidateB,
      pctA: parseFloat(pctA.toFixed(1)),
      pctB: parseFloat(pctB.toFixed(1)),
      savedAt: new Date().toISOString(),
    }
    const updated = [scenario, ...savedScenarios].slice(0, 10)
    setSavedScenarios(updated)
    localStorage.setItem('peta_sim_saved', JSON.stringify(updated))
    setSaveLabel('')
  }

  const handleLoadScenario = (sc) => {
    setCoalitionA(sc.coalitionA)
    setCoalitionB(sc.coalitionB)
    setCandidateA(sc.candidateA || '')
    setCandidateB(sc.candidateB || '')
  }

  const handleDeleteScenario = (id) => {
    const updated = savedScenarios.filter(s => s.id !== id)
    setSavedScenarios(updated)
    localStorage.setItem('peta_sim_saved', JSON.stringify(updated))
  }

  const personA = TOP_PERSONS.find(p => p.id === candidateA)
  const personB = TOP_PERSONS.find(p => p.id === candidateB)

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">⚙️ Simulator Koalisi 2029</h1>
        <p className="text-text-secondary text-sm mt-1">
          Bangun koalisi Pilpres 2029 kamu sendiri. Klik A atau B pada setiap partai untuk memasukkannya ke koalisi.
          Target: 50%+ kursi DPR untuk menang satu putaran.
        </p>
      </div>

      {/* Live Result Bar */}
      <div className="bg-bg-card border border-border rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-text-primary">📊 Hasil Simulasi Real-Time</h2>
        <VoteBar pctA={pctA} pctB={pctB} />
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Koalisi A', pct: pctA, win: winA, color: '#EF4444', parties: coalitionA, candidate: personA },
            { label: 'Koalisi B', pct: pctB, win: winB, color: '#3B82F6', parties: coalitionB, candidate: personB },
          ].map(({ label, pct, win, color, parties, candidate }) => (
            <div key={label} className="text-center space-y-1">
              <p className="text-xs text-text-secondary font-semibold">{label}</p>
              <p className="text-3xl font-bold" style={{ color }}>{pct.toFixed(1)}%</p>
              <p className="text-xs text-text-secondary">{parties.length} partai · {
                parties.reduce((s, id) => s + (PARTIES.find(p => p.id === id)?.seats_2024 || 0), 0)
              } kursi</p>
              {candidate && (
                <p className="text-xs font-medium text-text-primary">
                  {candidate.photo_placeholder || '👤'} {candidate.name}
                </p>
              )}
              <div className={`text-xs font-bold px-2 py-1 rounded border ${win.cls}`}>
                {win.icon} {win.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Builder */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Party Pool */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-semibold text-text-primary">🏛️ Partai DPR 2024</h2>
          <p className="text-xs text-text-secondary">
            Tekan tombol <span className="font-bold text-red-400">A</span> atau <span className="font-bold text-blue-400">B</span> untuk memasukkan partai ke koalisi masing-masing.
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {SEAT_PARTIES.map(party => (
              <PartyChip
                key={party.id}
                party={party}
                inA={coalitionA.includes(party.id)}
                inB={coalitionB.includes(party.id)}
                onToggleA={toggleA}
                onToggleB={toggleB}
              />
            ))}
          </div>
        </div>

        {/* Koalisi Panels */}
        <div className="space-y-4">
          {/* Koalisi A */}
          <div className="bg-bg-card border border-red-500/30 rounded-xl p-4 space-y-3 border-l-4 border-l-red-500">
            <h3 className="text-sm font-bold text-red-400">🔴 Koalisi A</h3>
            <CandidatePicker
              label="Kandidat Capres"
              color="#EF4444"
              value={candidateA}
              onChange={setCandidateA}
            />
            <div>
              <p className="text-[10px] text-text-secondary uppercase tracking-wide mb-1.5">Partai Anggota</p>
              {coalitionA.length === 0 ? (
                <p className="text-xs text-text-secondary italic">Belum ada partai. Klik A pada partai.</p>
              ) : (
                <div className="space-y-1">
                  {coalitionA.map(id => {
                    const p = PARTIES.find(x => x.id === id)
                    return p ? (
                      <div key={id} className="flex items-center justify-between text-xs py-1 border-b border-border/50">
                        <span className="flex items-center gap-1.5">
                          <span>{p.logo_emoji}</span>
                          <span className="font-medium text-text-primary">{p.abbr}</span>
                        </span>
                        <span className="text-text-secondary">{p.seats_2024} kursi</span>
                      </div>
                    ) : null
                  })}
                  <div className="flex justify-between text-xs font-bold pt-1">
                    <span className="text-text-primary">Total</span>
                    <span className="text-red-400">{pctA.toFixed(1)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Koalisi B */}
          <div className="bg-bg-card border border-blue-500/30 rounded-xl p-4 space-y-3 border-l-4 border-l-blue-500">
            <h3 className="text-sm font-bold text-blue-400">🔵 Koalisi B</h3>
            <CandidatePicker
              label="Kandidat Capres"
              color="#3B82F6"
              value={candidateB}
              onChange={setCandidateB}
            />
            <div>
              <p className="text-[10px] text-text-secondary uppercase tracking-wide mb-1.5">Partai Anggota</p>
              {coalitionB.length === 0 ? (
                <p className="text-xs text-text-secondary italic">Belum ada partai. Klik B pada partai.</p>
              ) : (
                <div className="space-y-1">
                  {coalitionB.map(id => {
                    const p = PARTIES.find(x => x.id === id)
                    return p ? (
                      <div key={id} className="flex items-center justify-between text-xs py-1 border-b border-border/50">
                        <span className="flex items-center gap-1.5">
                          <span>{p.logo_emoji}</span>
                          <span className="font-medium text-text-primary">{p.abbr}</span>
                        </span>
                        <span className="text-text-secondary">{p.seats_2024} kursi</span>
                      </div>
                    ) : null
                  })}
                  <div className="flex justify-between text-xs font-bold pt-1">
                    <span className="text-text-primary">Total</span>
                    <span className="text-blue-400">{pctB.toFixed(1)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nama skenario..."
                value={saveLabel}
                onChange={e => setSaveLabel(e.target.value)}
                className="flex-1 text-xs bg-bg-elevated border border-border rounded px-2 py-1.5 text-text-primary placeholder:text-text-secondary"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={!coalitionA.length && !coalitionB.length}
                className="flex-1 text-xs py-2 rounded-lg bg-accent-red text-white font-semibold disabled:opacity-40 hover:bg-red-500 transition-colors"
              >
                💾 Simpan Skenario
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-2 text-xs rounded-lg border border-border text-text-secondary hover:border-accent-red/50 hover:text-text-primary transition-colors"
              >
                🔄 Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Scenarios */}
      {savedScenarios.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-text-primary">📁 Skenario Tersimpan</h2>
            <button
              onClick={() => setShowSaved(!showSaved)}
              className="text-xs text-text-secondary hover:text-text-primary transition-colors"
            >
              {showSaved ? 'Sembunyikan' : `Tampilkan (${savedScenarios.length})`}
            </button>
          </div>
          {showSaved && (
            <div className="space-y-2">
              {savedScenarios.map(sc => (
                <div
                  key={sc.id}
                  className="bg-bg-card border border-border rounded-xl px-4 py-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">{sc.label}</p>
                    <p className="text-xs text-text-secondary">
                      A: <span className="text-red-400 font-semibold">{sc.pctA}%</span>
                      {' · '}
                      B: <span className="text-blue-400 font-semibold">{sc.pctB}%</span>
                      {' · '}
                      {new Date(sc.savedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleLoadScenario(sc)}
                      className="text-xs px-2 py-1 rounded border border-border text-text-secondary hover:text-text-primary hover:border-accent-red/50 transition-colors"
                    >
                      Muat
                    </button>
                    <button
                      onClick={() => handleDeleteScenario(sc.id)}
                      className="text-xs px-2 py-1 rounded border border-border text-red-400/70 hover:text-red-400 hover:border-red-400/50 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Info */}
      <div className="text-xs text-text-secondary bg-bg-elevated rounded-lg p-3 border border-border">
        ℹ️ Simulasi menggunakan kursi DPR 2024 sebagai proksi kekuatan koalisi. Total {TOTAL_SEATS} kursi DPR.
        Threshold resmi pencalonan Pilpres: 20% kursi DPR atau 25% suara pemilu. Simulasi ini bersifat ilustratif.
      </div>
    </div>
  )
}
