import { useState, useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, BarChart, Bar, Cell
} from 'recharts'
import {
  POLLSTERS, PILPRES_2024_POLLS, APPROVAL_POLLS, PILPRES_2029_POLLS, PARTY_POLLS
} from '../../data/polls'
import { PARTY_MAP } from '../../data/parties'
import { PageHeader, Tabs, Card, KPICard } from '../../components/ui'

// ── Color maps ────────────────────────────────────────────────────────────────

const CANDIDATE_COLORS_2024 = {
  prabowo:     '#ef4444',  // red
  anies:       '#3b82f6',  // blue
  ganjar:      '#22c55e',  // green
  gibran:      '#f97316',  // orange
  sandiaga:    '#a855f7',  // purple
  ridwan_kamil:'#14b8a6',  // teal
}

const CANDIDATE_LABELS_2024 = {
  prabowo:     'Prabowo Subianto',
  anies:       'Anies Baswedan',
  ganjar:      'Ganjar Pranowo',
  gibran:      'Gibran Rakabuming',
  sandiaga:    'Sandiaga Uno',
  ridwan_kamil:'Ridwan Kamil',
}

const CANDIDATE_COLORS_2029 = {
  prabowo:      '#ef4444',
  anies:        '#3b82f6',
  dedi_mulyadi: '#22c55e',
  khofifah:     '#a855f7',
  ridwan_kamil: '#14b8a6',
  gibran:       '#f97316',
  ganjar:       '#84cc16',
  puan:         '#ec4899',
  ahy:          '#64748b',
}

const CANDIDATE_LABELS_2029 = {
  prabowo:      'Prabowo Subianto',
  anies:        'Anies Baswedan',
  dedi_mulyadi: 'Dedi Mulyadi',
  khofifah:     'Khofifah Indar Parawansa',
  ridwan_kamil: 'Ridwan Kamil',
  gibran:       'Gibran Rakabuming',
  ganjar:       'Ganjar Pranowo',
  puan:         'Puan Maharani',
  ahy:          'Agus Harimurti Yudhoyono',
}

const PERSON_LABELS = {
  prabowo:  'Prabowo Subianto',
  anies:    'Anies Baswedan',
  megawati: 'Megawati Soekarnoputri',
}

const PERSON_AVATARS = {
  prabowo:  '🔴',
  anies:    '🔵',
  megawati: '⚫',
}

const PARTY_COLORS_OVERRIDE = {
  pdip: '#ef4444',
  ger:  '#1d4ed8',
  gol:  '#eab308',
  pkb:  '#16a34a',
  nas:  '#7c3aed',
  dem:  '#0ea5e9',
  pan:  '#f97316',
  pks:  '#1e3a5f',
  ppp:  '#92400e',
  psi:  '#ec4899',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(d) {
  const [y, m] = d.split('-')
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']
  return `${months[parseInt(m) - 1]} '${y.slice(2)}`
}

/**
 * Flatten polls array into chart-ready format.
 * Returns array of { date, candidateA: val, candidateB: val, ... }
 */
function flattenPollsToChart(polls, candidateKey = 'candidates') {
  return polls.map(poll => ({
    date: formatDate(poll.date),
    rawDate: poll.date,
    pollster: poll.pollster,
    is_result: poll.is_result || false,
    ...poll[candidateKey],
  }))
}

function flattenPartyPolls(polls) {
  return polls.map(poll => ({
    date: formatDate(poll.date),
    rawDate: poll.date,
    pollster: poll.pollster,
    is_result: poll.is_result || false,
    ...poll.parties,
  }))
}

function getAllCandidates(polls, candidateKey = 'candidates') {
  const set = new Set()
  polls.forEach(p => Object.keys(p[candidateKey]).forEach(k => set.add(k)))
  return Array.from(set)
}

function getAllParties(polls) {
  const set = new Set()
  polls.forEach(p => Object.keys(p.parties).forEach(k => set.add(k)))
  return Array.from(set)
}

// Custom tooltip
function PollTooltip({ active, payload, label, pollsterMap }) {
  if (!active || !payload?.length) return null
  const entry = payload[0]?.payload
  return (
    <div className="bg-bg-card border border-border rounded-lg p-3 shadow-xl text-xs">
      <p className="font-bold text-text-primary mb-2">{label}</p>
      {entry?.pollster && (
        <p className="text-text-muted mb-1">
          {pollsterMap?.[entry.pollster] || entry.pollster}
          {entry.is_result && <span className="ml-2 text-yellow-500 font-bold">📋 Hasil Resmi</span>}
        </p>
      )}
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 mt-0.5">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-text-muted">{p.name}:</span>
          <span className="font-semibold text-text-primary">{p.value?.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  )
}

// ── Stat calculation ──────────────────────────────────────────────────────────

function computeStats() {
  const allDates = [
    ...PILPRES_2024_POLLS.map(p => p.date),
    ...APPROVAL_POLLS.map(p => p.date),
    ...PILPRES_2029_POLLS.map(p => p.date),
    ...PARTY_POLLS.map(p => p.date),
  ].sort()

  const latestDate = allDates[allDates.length - 1]

  const totalDataPoints =
    PILPRES_2024_POLLS.reduce((s, p) => s + Object.keys(p.candidates).length, 0) +
    APPROVAL_POLLS.length +
    PILPRES_2029_POLLS.reduce((s, p) => s + Object.keys(p.candidates).length, 0) +
    PARTY_POLLS.reduce((s, p) => s + Object.keys(p.parties).length, 0)

  const pollsterIds = new Set([
    ...PILPRES_2024_POLLS.map(p => p.pollster),
    ...APPROVAL_POLLS.map(p => p.pollster),
    ...PILPRES_2029_POLLS.map(p => p.pollster),
    ...PARTY_POLLS.map(p => p.pollster),
  ])
  pollsterIds.delete('kpu')

  return { latestDate, totalDataPoints, pollsterCount: pollsterIds.size }
}

// ── Chart components ──────────────────────────────────────────────────────────

function CandidateLegend({ candidates, colorMap, labelMap }) {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      {candidates.map(c => (
        <div key={c} className="flex items-center gap-1.5 text-xs">
          <div className="w-3 h-3 rounded-full" style={{ background: colorMap[c] || '#6b7280' }} />
          <span className="text-text-muted">{labelMap[c] || c}</span>
        </div>
      ))}
    </div>
  )
}

// ── Tab 1: Pilpres 2024 ───────────────────────────────────────────────────────

function Pilpres2024Tab() {
  const chartData = useMemo(() => flattenPollsToChart(PILPRES_2024_POLLS), [])
  const candidates = useMemo(() => getAllCandidates(PILPRES_2024_POLLS), [])
  const pollsterMap = Object.fromEntries(POLLSTERS.map(p => [p.id, p.name]))
  pollsterMap['kpu'] = 'KPU (Hasil Resmi)'

  // Find result date for reference line
  const resultEntry = PILPRES_2024_POLLS.find(p => p.is_result)
  const resultLabel = resultEntry ? formatDate(resultEntry.date) : null

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-1">Tren Elektabilitas Pilpres 2024</h3>
        <p className="text-xs text-text-muted mb-4">Survei berbagai lembaga, Jan 2022 – Feb 2024. Garis putus-putus merah = hasil resmi KPU.</p>

        <CandidateLegend
          candidates={candidates}
          colorMap={CANDIDATE_COLORS_2024}
          labelMap={CANDIDATE_LABELS_2024}
        />

        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="rgba(255,255,255,0.2)" />
            <YAxis
              domain={[0, 70]}
              tickFormatter={v => `${v}%`}
              tick={{ fontSize: 11 }}
              stroke="rgba(255,255,255,0.2)"
            />
            <Tooltip content={<PollTooltip pollsterMap={pollsterMap} />} />
            {resultLabel && (
              <ReferenceLine
                x={resultLabel}
                stroke="#fbbf24"
                strokeDasharray="6 3"
                strokeWidth={2}
                label={{ value: 'Hasil Pilpres', fill: '#fbbf24', fontSize: 10, position: 'insideTopLeft' }}
              />
            )}
            {candidates.map(c => (
              <Line
                key={c}
                type="monotone"
                dataKey={c}
                name={CANDIDATE_LABELS_2024[c] || c}
                stroke={CANDIDATE_COLORS_2024[c] || '#6b7280'}
                strokeWidth={c === 'prabowo' ? 3 : 2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Result summary */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">📋 Hasil Resmi Pilpres 2024 (KPU)</h3>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(resultEntry?.candidates || {}).map(([c, pct]) => (
            <div key={c} className="rounded-lg p-3 border border-border text-center" style={{ borderLeftColor: CANDIDATE_COLORS_2024[c], borderLeftWidth: 4 }}>
              <p className="text-xs text-text-muted">{CANDIDATE_LABELS_2024[c] || c}</p>
              <p className="text-2xl font-bold mt-1" style={{ color: CANDIDATE_COLORS_2024[c] || '#fff' }}>{pct}%</p>
              {c === 'prabowo' && <p className="text-xs text-yellow-400 mt-0.5">🏆 Menang</p>}
            </div>
          ))}
        </div>
      </Card>

      {/* Raw table */}
      <Card className="p-4 overflow-x-auto">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Data Survei Lengkap</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-3 text-text-muted">Tanggal</th>
              <th className="text-left py-2 pr-3 text-text-muted">Lembaga</th>
              <th className="text-right py-2 pr-3" style={{ color: CANDIDATE_COLORS_2024.prabowo }}>Prabowo</th>
              <th className="text-right py-2 pr-3" style={{ color: CANDIDATE_COLORS_2024.anies }}>Anies</th>
              <th className="text-right py-2 pr-3" style={{ color: CANDIDATE_COLORS_2024.ganjar }}>Ganjar</th>
              <th className="text-right py-2 pr-3" style={{ color: CANDIDATE_COLORS_2024.gibran }}>Gibran</th>
            </tr>
          </thead>
          <tbody>
            {PILPRES_2024_POLLS.map((poll, i) => (
              <tr key={i} className={`border-b border-border/50 ${poll.is_result ? 'bg-yellow-500/5' : ''}`}>
                <td className="py-1.5 pr-3 text-text-muted">{formatDate(poll.date)}</td>
                <td className="py-1.5 pr-3 text-text-primary">
                  {pollsterMap[poll.pollster] || poll.pollster}
                  {poll.is_result && <span className="ml-1 text-yellow-500">★</span>}
                </td>
                <td className="py-1.5 pr-3 text-right font-mono">{poll.candidates.prabowo ?? '—'}</td>
                <td className="py-1.5 pr-3 text-right font-mono">{poll.candidates.anies ?? '—'}</td>
                <td className="py-1.5 pr-3 text-right font-mono">{poll.candidates.ganjar ?? '—'}</td>
                <td className="py-1.5 pr-3 text-right font-mono">{poll.candidates.gibran ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

// ── Tab 2: Approval Ratings ───────────────────────────────────────────────────

function ApprovalBar({ label, approval, disapproval, undecided, color, note, date, pollster }) {
  const pollsterMap = Object.fromEntries(POLLSTERS.map(p => [p.id, p.name]))
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-text-primary flex items-center gap-2">
          <span>{PERSON_AVATARS[label] || '👤'}</span>
          {PERSON_LABELS[label] || label}
        </span>
        <span className="text-xs text-text-muted">{formatDate(date)} · {pollsterMap[pollster] || pollster}</span>
      </div>
      <div className="flex h-7 rounded-lg overflow-hidden text-xs font-bold">
        <div
          className="flex items-center justify-center text-white"
          style={{ width: `${approval}%`, background: color || '#22c55e' }}
        >
          {approval}%
        </div>
        <div
          className="flex items-center justify-center text-white"
          style={{ width: `${disapproval}%`, background: '#ef4444' }}
        >
          {disapproval}%
        </div>
        <div
          className="flex items-center justify-center text-white/60"
          style={{ width: `${undecided}%`, background: '#6b7280' }}
        >
          {undecided}%
        </div>
      </div>
      {note && <p className="text-xs text-text-muted mt-1 italic">📌 {note}</p>}
    </div>
  )
}

function ApprovalTab() {
  // Group by person, get latest per person
  const byPerson = useMemo(() => {
    const map = {}
    APPROVAL_POLLS.forEach(p => {
      if (!map[p.person_id]) map[p.person_id] = []
      map[p.person_id].push(p)
    })
    // Sort each person's polls by date
    Object.keys(map).forEach(k => map[k].sort((a, b) => a.date.localeCompare(b.date)))
    return map
  }, [])

  const prabowoData = useMemo(() =>
    (byPerson['prabowo'] || []).map(p => ({
      date: formatDate(p.date),
      rawDate: p.date,
      approval: p.approval,
      disapproval: p.disapproval,
      undecided: p.undecided,
      note: p.note,
    })), [byPerson])

  const pollsterMap = Object.fromEntries(POLLSTERS.map(p => [p.id, p.name]))

  return (
    <div className="space-y-6">
      {/* Summary bars — latest per person */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-1">Approval Rating Terkini</h3>
        <p className="text-xs text-text-muted mb-4">
          <span className="inline-block w-3 h-3 rounded mr-1 bg-green-500 align-middle"></span>Setuju &nbsp;
          <span className="inline-block w-3 h-3 rounded mr-1 bg-red-500 align-middle"></span>Tidak setuju &nbsp;
          <span className="inline-block w-3 h-3 rounded mr-1 bg-gray-500 align-middle"></span>Tidak tahu
        </p>
        {Object.entries(byPerson).map(([personId, polls]) => {
          const latest = polls[polls.length - 1]
          return (
            <ApprovalBar
              key={personId}
              label={personId}
              {...latest}
              date={latest.date}
              pollster={latest.pollster}
              color={personId === 'prabowo' ? '#ef4444' : personId === 'anies' ? '#3b82f6' : '#6b7280'}
            />
          )
        })}
      </Card>

      {/* Prabowo timeline chart */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-1">Tren Approval Prabowo (Nov 2024 – Mar 2025)</h3>
        <p className="text-xs text-text-muted mb-4">100 hari pertama pemerintahan Kabinet Merah Putih</p>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={prabowoData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="rgba(255,255,255,0.2)" />
            <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11 }} stroke="rgba(255,255,255,0.2)" />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                const d = payload[0]?.payload
                return (
                  <div className="bg-bg-card border border-border rounded-lg p-3 shadow-xl text-xs">
                    <p className="font-bold mb-1">{label}</p>
                    {d?.note && <p className="text-yellow-400 mb-2 italic">📌 {d.note}</p>}
                    {payload.map(p => (
                      <div key={p.dataKey} className="flex items-center gap-2 mt-0.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                        <span className="text-text-muted">{p.name}:</span>
                        <span className="font-semibold">{p.value}%</span>
                      </div>
                    ))}
                  </div>
                )
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="approval" name="Setuju" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 5 }} activeDot={{ r: 7 }} />
            <Line type="monotone" dataKey="disapproval" name="Tidak Setuju" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="undecided" name="Tidak Tahu" stroke="#6b7280" strokeWidth={1.5} dot={{ r: 3 }} strokeDasharray="4 2" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Detail cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(byPerson).map(([personId, polls]) => {
          const latest = polls[polls.length - 1]
          const prev = polls.length > 1 ? polls[polls.length - 2] : null
          const delta = prev ? latest.approval - prev.approval : null
          return (
            <Card key={personId} className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{PERSON_AVATARS[personId] || '👤'}</span>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{PERSON_LABELS[personId] || personId}</p>
                  <p className="text-xs text-text-muted">{polls.length} survei tercatat</p>
                </div>
              </div>
              <div className="text-center py-2">
                <p className="text-3xl font-bold text-green-400">{latest.approval}%</p>
                <p className="text-xs text-text-muted">Approval terkini</p>
                {delta !== null && (
                  <p className={`text-xs mt-1 ${delta > 0 ? 'text-green-400' : delta < 0 ? 'text-red-400' : 'text-text-muted'}`}>
                    {delta > 0 ? '▲' : delta < 0 ? '▼' : '►'} {Math.abs(delta)}pp dari survei sebelumnya
                  </p>
                )}
              </div>
              <div className="mt-2 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-text-muted">Tidak setuju</span>
                  <span className="text-red-400 font-medium">{latest.disapproval}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Tidak tahu</span>
                  <span className="text-gray-400">{latest.undecided}%</span>
                </div>
              </div>
              {latest.note && (
                <p className="text-xs text-yellow-400/80 mt-2 italic border-t border-border pt-2">📌 {latest.note}</p>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// ── Tab 3: Proyeksi 2029 ──────────────────────────────────────────────────────

function Pilpres2029Tab() {
  const chartData = useMemo(() => flattenPollsToChart(PILPRES_2029_POLLS), [])
  const candidates = useMemo(() => getAllCandidates(PILPRES_2029_POLLS), [])
  const pollsterMap = Object.fromEntries(POLLSTERS.map(p => [p.id, p.name]))

  // Latest poll rankings
  const latestPoll = PILPRES_2029_POLLS[PILPRES_2029_POLLS.length - 1]
  const rankings = Object.entries(latestPoll.candidates)
    .sort(([, a], [, b]) => b - a)

  return (
    <div className="space-y-6">
      <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-xs text-yellow-300">
        ⚠️ <strong>Catatan:</strong> Data berdasarkan survei awal 2024–2025; situasi dapat berubah drastis dalam 4 tahun menjelang Pilpres 2029.
      </div>

      <Card className="p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-1">Proyeksi Elektabilitas Pilpres 2029</h3>
        <p className="text-xs text-text-muted mb-4">Survei awal Nov 2024 – Mar 2025</p>

        <CandidateLegend
          candidates={candidates}
          colorMap={CANDIDATE_COLORS_2029}
          labelMap={CANDIDATE_LABELS_2029}
        />

        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="rgba(255,255,255,0.2)" />
            <YAxis
              domain={[0, 60]}
              tickFormatter={v => `${v}%`}
              tick={{ fontSize: 11 }}
              stroke="rgba(255,255,255,0.2)"
            />
            <Tooltip content={<PollTooltip pollsterMap={pollsterMap} />} />
            {candidates.map(c => (
              <Line
                key={c}
                type="monotone"
                dataKey={c}
                name={CANDIDATE_LABELS_2029[c] || c}
                stroke={CANDIDATE_COLORS_2029[c] || '#6b7280'}
                strokeWidth={c === 'prabowo' ? 3 : c === 'anies' ? 2.5 : 2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Latest rankings table */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          Ranking Terkini ({formatDate(latestPoll.date)} · {pollsterMap[latestPoll.pollster] || latestPoll.pollster})
        </h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-3 text-text-muted w-8">#</th>
              <th className="text-left py-2 pr-3 text-text-muted">Tokoh</th>
              <th className="text-right py-2 text-text-muted">Elektabilitas</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map(([candidate, pct], i) => (
              <tr key={candidate} className="border-b border-border/50">
                <td className="py-2 pr-3 text-text-muted font-mono">{i + 1}</td>
                <td className="py-2 pr-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: CANDIDATE_COLORS_2029[candidate] || '#6b7280' }} />
                    <span className="text-text-primary">{CANDIDATE_LABELS_2029[candidate] || candidate}</span>
                  </div>
                </td>
                <td className="py-2 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${(pct / rankings[0][1]) * 80}px`,
                        background: CANDIDATE_COLORS_2029[candidate] || '#6b7280'
                      }}
                    />
                    <span className="font-mono font-semibold" style={{ color: CANDIDATE_COLORS_2029[candidate] || '#fff' }}>
                      {pct}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

// ── Tab 4: Elektabilitas Partai ───────────────────────────────────────────────

function PartyElectabilityTab() {
  const chartData = useMemo(() => flattenPartyPolls(PARTY_POLLS), [])
  const parties = useMemo(() => getAllParties(PARTY_POLLS), [])
  const pollsterMap = Object.fromEntries(POLLSTERS.map(p => [p.id, p.name]))
  pollsterMap['kpu'] = 'KPU (Hasil Resmi)'

  // Result and latest
  const resultEntry = PARTY_POLLS.find(p => p.is_result)
  const resultLabel = resultEntry ? formatDate(resultEntry.date) : null
  const latestPoll = PARTY_POLLS[PARTY_POLLS.length - 1]

  const latestRankings = Object.entries(latestPoll.parties)
    .sort(([, a], [, b]) => b - a)

  function partyColor(id) {
    return PARTY_COLORS_OVERRIDE[id] || PARTY_MAP[id]?.color || '#6b7280'
  }

  function partyLabel(id) {
    return PARTY_MAP[id]?.abbr || PARTY_MAP[id]?.name || id.toUpperCase()
  }

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-1">Tren Elektabilitas Partai 2022–2025</h3>
        <p className="text-xs text-text-muted mb-4">Garis putus-putus kuning = hasil resmi Pileg 2024 (KPU)</p>

        {/* Party legend */}
        <div className="flex flex-wrap gap-2 mb-4">
          {parties.map(p => (
            <div key={p} className="flex items-center gap-1 text-xs">
              <div className="w-3 h-3 rounded-sm" style={{ background: partyColor(p) }} />
              <span className="text-text-muted">{partyLabel(p)}</span>
            </div>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={360}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="rgba(255,255,255,0.2)" />
            <YAxis
              domain={[0, 28]}
              tickFormatter={v => `${v}%`}
              tick={{ fontSize: 11 }}
              stroke="rgba(255,255,255,0.2)"
            />
            <Tooltip content={<PollTooltip pollsterMap={pollsterMap} />} />
            {resultLabel && (
              <ReferenceLine
                x={resultLabel}
                stroke="#fbbf24"
                strokeDasharray="6 3"
                strokeWidth={2}
                label={{ value: 'Pileg 2024', fill: '#fbbf24', fontSize: 10, position: 'insideTopLeft' }}
              />
            )}
            {parties.map(p => (
              <Line
                key={p}
                type="monotone"
                dataKey={p}
                name={partyLabel(p)}
                stroke={partyColor(p)}
                strokeWidth={p === 'pdip' || p === 'ger' || p === 'gol' ? 2.5 : 1.5}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Latest standings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">
            Survei Terkini ({formatDate(latestPoll.date)} · {pollsterMap[latestPoll.pollster] || latestPoll.pollster})
          </h3>
          <div className="space-y-2">
            {latestRankings.map(([partyId, pct]) => (
              <div key={partyId} className="flex items-center gap-3">
                <div className="w-10 text-xs text-right text-text-muted font-mono">{pct}%</div>
                <div className="flex-1 h-5 rounded overflow-hidden bg-bg-elevated">
                  <div
                    className="h-full rounded flex items-center px-1.5 text-[10px] text-white font-bold"
                    style={{
                      width: `${(pct / latestRankings[0][1]) * 100}%`,
                      background: partyColor(partyId),
                    }}
                  >
                    {partyLabel(partyId)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* vs Pileg 2024 result */}
        {resultEntry && (
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              📋 Hasil Resmi Pileg 2024 (KPU)
            </h3>
            <div className="space-y-2">
              {Object.entries(resultEntry.parties)
                .sort(([, a], [, b]) => b - a)
                .map(([partyId, pct]) => (
                  <div key={partyId} className="flex items-center gap-3">
                    <div className="w-14 text-xs text-right text-text-muted font-mono">{pct}%</div>
                    <div className="flex-1 h-5 rounded overflow-hidden bg-bg-elevated">
                      <div
                        className="h-full rounded flex items-center px-1.5 text-[10px] text-white font-bold"
                        style={{
                          width: `${(pct / 22) * 100}%`,
                          background: partyColor(partyId),
                        }}
                      >
                        {partyLabel(partyId)}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'pilpres2024', label: '🗳️ Pilpres 2024' },
  { id: 'approval',    label: '📊 Approval Rating' },
  { id: 'pilpres2029', label: '🔮 Proyeksi 2029' },
  { id: 'partai',      label: '🎭 Elektabilitas Partai' },
]

export default function SurveyPage() {
  const [activeTab, setActiveTab] = useState('pilpres2024')
  const { latestDate, totalDataPoints, pollsterCount } = useMemo(computeStats, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="📊 Survei & Polling"
        subtitle="Tren elektabilitas Pilpres, approval rating, dan proyeksi 2029 dari berbagai lembaga survei terpercaya"
      />

      {/* Header stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KPICard
          label="Update Terakhir"
          value={formatDate(latestDate)}
          icon="📅"
          color="blue"
        />
        <KPICard
          label="Total Data Survei"
          value={totalDataPoints}
          sub="data points"
          icon="📈"
          color="green"
        />
        <KPICard
          label="Lembaga Survei"
          value={pollsterCount}
          sub="pollsters dipantau"
          icon="🏛️"
          color="purple"
        />
        <KPICard
          label="Pemilihan Dipantau"
          value={3}
          sub="Pilpres 2024, 2029, Pileg"
          icon="🗳️"
          color="red"
        />
      </div>

      {/* Tabs */}
      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {/* Tab content */}
      {activeTab === 'pilpres2024' && <Pilpres2024Tab />}
      {activeTab === 'approval'    && <ApprovalTab />}
      {activeTab === 'pilpres2029' && <Pilpres2029Tab />}
      {activeTab === 'partai'      && <PartyElectabilityTab />}
    </div>
  )
}
