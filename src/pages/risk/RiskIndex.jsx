import { useMemo } from 'react'
import { PROVINCES } from '../../data/regions'
import { PERSONS } from '../../data/persons'
import { PARTY_MAP } from '../../data/parties'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

// Risk tier config
const RISK_TIERS = [
  { max: 25,  label: 'Rendah', color: '#22C55E', bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
  { max: 50,  label: 'Sedang', color: '#F59E0B', bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
  { max: 75,  label: 'Tinggi', color: '#F97316', bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' },
  { max: 100, label: 'Kritis', color: '#EF4444', bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
]

function getTier(score) {
  return RISK_TIERS.find(t => score <= t.max) || RISK_TIERS[RISK_TIERS.length - 1]
}

function provinceRisk(province, persons) {
  const gov = persons.find(p => p.id === province.governor_id)
  const corruptionRisk = { rendah: 0, sedang: 25, tinggi: 50, tersangka: 80, terpidana: 100 }
  const govScore = corruptionRisk[gov?.analysis?.corruption_risk || 'rendah'] ?? 0
  const stabilityPenalty = province.party_id === 'pdip' ? 20 : 0
  const dataRisk = !province.governor_id ? 30 : 0
  return Math.min(100, govScore + stabilityPenalty + dataRisk)
}

function MiniIndicator({ label, value, good }) {
  return (
    <div className="flex items-center justify-between text-[10px]">
      <span className="text-text-secondary">{label}</span>
      <span className={good ? 'text-green-400' : 'text-red-400'}>{value}</span>
    </div>
  )
}

export default function RiskIndex() {
  const provincesWithRisk = useMemo(() => {
    return PROVINCES.map(prov => {
      const score = provinceRisk(prov, PERSONS)
      const tier = getTier(score)
      const gov = PERSONS.find(p => p.id === prov.governor_id)
      const party = prov.party_id ? PARTY_MAP[prov.party_id] : null
      const corruptionRisk = gov?.analysis?.corruption_risk || 'rendah'
      const hasData = !!prov.governor_id
      const isOpposition = prov.party_id === 'pdip'

      return { ...prov, score, tier, gov, party, corruptionRisk, hasData, isOpposition }
    }).sort((a, b) => b.score - a.score)
  }, [])

  // Summary counts
  const counts = useMemo(() => {
    const c = { Rendah: 0, Sedang: 0, Tinggi: 0, Kritis: 0 }
    provincesWithRisk.forEach(p => { c[p.tier.label] = (c[p.tier.label] || 0) + 1 })
    return c
  }, [provincesWithRisk])

  // Island breakdown
  const islandRisk = useMemo(() => {
    const islands = {}
    provincesWithRisk.forEach(p => {
      if (!islands[p.island]) islands[p.island] = []
      islands[p.island].push(p.score)
    })
    return Object.entries(islands)
      .map(([island, scores]) => ({
        island,
        avg: scores.reduce((a, b) => a + b, 0) / scores.length,
      }))
      .sort((a, b) => b.avg - a.avg)
  }, [provincesWithRisk])

  const highestRiskIsland = islandRisk[0]

  // Chart data (sorted by score desc, top 20 for readability)
  const chartData = [...provincesWithRisk].slice(0, 38).map(p => ({
    name: p.name.length > 14 ? p.name.slice(0, 14) + '…' : p.name,
    score: p.score,
    color: p.tier.color,
  }))

  const CORRUPTION_LABEL = {
    rendah: 'Bersih', sedang: 'Sedang', tinggi: 'Tinggi',
    tersangka: 'Tersangka', terpidana: 'Terpidana',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">🔴 Indeks Risiko Politik Provinsi</h1>
        <p className="text-text-secondary text-sm mt-1">
          Penilaian risiko politik berdasarkan integritas gubernur, stabilitas koalisi, dan kelengkapan data.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {RISK_TIERS.map(t => (
          <div key={t.label} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${t.bg} border ${t.border}`}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
            <span className={`text-xs font-medium ${t.text}`}>{t.label}</span>
            <span className="text-xs text-text-secondary">
              {t.label === 'Rendah' ? '0–25' : t.label === 'Sedang' ? '26–50' : t.label === 'Tinggi' ? '51–75' : '76–100'}
            </span>
          </div>
        ))}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {RISK_TIERS.map(t => (
          <div key={t.label} className={`p-4 rounded-xl border ${t.border} ${t.bg}`}>
            <p className={`text-2xl font-bold ${t.text}`}>{counts[t.label] || 0}</p>
            <p className="text-xs text-text-secondary mt-0.5">{t.label}</p>
          </div>
        ))}
      </div>

      {highestRiskIsland && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
          ⚠️ <strong>{highestRiskIsland.island}</strong> memiliki rata-rata risiko tertinggi:{' '}
          <span className="font-bold">{Math.round(highestRiskIsland.avg)}/100</span>
          {' '}— {islandRisk.map(i => `${i.island} (${Math.round(i.avg)})`).join(', ')}
        </div>
      )}

      {/* Province Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {provincesWithRisk.map(prov => {
          const t = prov.tier
          return (
            <div
              key={prov.id}
              className={`p-3 rounded-xl border ${t.border} ${t.bg} space-y-2`}
            >
              {/* Province name + island */}
              <div>
                <div className="flex items-start justify-between gap-1">
                  <p className="text-xs font-semibold text-text-primary leading-tight">{prov.name}</p>
                  <span className="text-[9px] bg-bg-elevated px-1.5 py-0.5 rounded text-text-secondary shrink-0">{prov.island}</span>
                </div>
                {prov.gubernur && (
                  <p className="text-[10px] text-text-secondary mt-0.5">{prov.gubernur}</p>
                )}
                {prov.party && (
                  <span
                    className="inline-flex items-center px-1.5 py-0 rounded text-[9px] font-semibold text-white mt-0.5"
                    style={{ backgroundColor: prov.party.color }}
                  >
                    {prov.party.abbr}
                  </span>
                )}
              </div>

              {/* Risk score */}
              <div className="flex items-end justify-between">
                <div>
                  <span className={`text-3xl font-bold ${t.text}`}>{prov.score}</span>
                  <span className="text-xs text-text-secondary">/100</span>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${t.bg} ${t.text} border ${t.border}`}>
                  {t.label}
                </span>
              </div>

              {/* Mini indicators */}
              <div className="space-y-0.5 border-t border-border/50 pt-1">
                <MiniIndicator
                  label="Integritas Gov"
                  value={CORRUPTION_LABEL[prov.corruptionRisk]}
                  good={prov.corruptionRisk === 'rendah'}
                />
                <MiniIndicator
                  label="Stabilitas"
                  value={prov.isOpposition ? 'Oposisi' : 'Koalisi'}
                  good={!prov.isOpposition}
                />
                <MiniIndicator
                  label="Data"
                  value={prov.hasData ? 'Lengkap' : 'Tidak ada'}
                  good={prov.hasData}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Bar Chart */}
      <div className="bg-bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">
          📊 Skor Risiko Semua Provinsi
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 80, left: 0 }}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 9, fill: '#9CA3AF' }}
              angle={-60}
              textAnchor="end"
              interval={0}
            />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
            <Tooltip
              formatter={(v) => [`${v}/100`, 'Skor Risiko']}
              contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: 'var(--text-primary)' }}
            />
            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-xs text-text-secondary bg-bg-elevated rounded-lg p-3 border border-border">
        ℹ️ Skor risiko dihitung berdasarkan: risiko korupsi gubernur, stabilitas koalisi politik, dan kelengkapan data publik. Bukan merupakan penilaian resmi.
      </div>
    </div>
  )
}
