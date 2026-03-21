import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'

export default function CharacterRadar({ analysis, personName }) {
  if (!analysis) return null

  const corruptionScore = {
    rendah: 9, sedang: 6, tinggi: 3, tersangka: 1, terpidana: 0
  }[analysis.corruption_risk] || 5

  const data = [
    { subject: 'Nasionalisme', value: analysis.nationalism || 5, fullMark: 10 },
    { subject: 'Religiusitas',  value: analysis.religiosity || 5,  fullMark: 10 },
    { subject: 'Populisme',     value: analysis.populism_score || 5, fullMark: 10 },
    { subject: 'Transparansi',  value: corruptionScore,              fullMark: 10 },
    { subject: 'Track Record',  value: 7,                             fullMark: 10 },
  ]

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#1F2937" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
          <PolarRadiusAxis domain={[0, 10]} tick={{ fill: '#6B7280', fontSize: 9 }} tickCount={6} />
          <Radar
            name={personName || 'Tokoh'}
            dataKey="value"
            stroke="#DC2626"
            fill="#DC2626"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{ background: '#111827', border: '1px solid #1F2937', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: '#F9FAFB' }}
            formatter={(v) => [`${v}/10`, '']}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
