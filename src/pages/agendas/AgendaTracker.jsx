import { useState, useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { AGENDAS } from '../../data/agendas'
import { PERSONS } from '../../data/persons'
import { PARTY_MAP } from '../../data/parties'
import { PageHeader, Card, Badge, Select, formatIDR } from '../../components/ui'

const STATUS_CONFIG = {
  janji:   { label: '🔵 Janji',   color: '#3B82F6', variant: 'status-janji' },
  proses:  { label: '🟡 Proses',  color: '#F59E0B', variant: 'status-proses' },
  selesai: { label: '🟢 Selesai', color: '#10B981', variant: 'status-selesai' },
  ingkar:  { label: '🔴 Ingkar',  color: '#EF4444', variant: 'status-ingkar' },
  batal:   { label: '⚫ Batal',   color: '#6B7280', variant: 'status-batal' },
}

const statusCounts = Object.keys(STATUS_CONFIG).reduce((acc, s) => {
  acc[s] = AGENDAS.filter(a => a.status === s).length
  return acc
}, {})

const pieData = Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
  name: cfg.label,
  value: statusCounts[key] || 0,
  color: cfg.color,
})).filter(d => d.value > 0)

export default function AgendaTracker() {
  const [filterStatus, setFilterStatus] = useState('')
  const [filterSubject, setFilterSubject] = useState('')

  const subjectOptions = [...new Set(AGENDAS.map(a => a.subject_id))].map(id => {
    const person = PERSONS.find(p => p.id === id)
    const party = PARTY_MAP[id]
    return {
      value: id,
      label: person?.name || party?.abbr || id,
    }
  })

  const filtered = useMemo(() => {
    let result = [...AGENDAS]
    if (filterStatus) result = result.filter(a => a.status === filterStatus)
    if (filterSubject) result = result.filter(a => a.subject_id === filterSubject)
    return result
  }, [filterStatus, filterSubject])

  return (
    <div className="space-y-6">
      <PageHeader
        title="📋 Tracker Agenda & Janji Politik"
        subtitle={`${AGENDAS.length} agenda terpantau`}
      />

      {/* Traffic Light Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Status Ringkasan</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setFilterStatus(filterStatus === key ? '' : key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                  filterStatus === key
                    ? 'border-text-secondary bg-bg-elevated'
                    : 'border-border hover:border-gray-600'
                }`}
              >
                <span className="text-base">{cfg.label.split(' ')[0]}</span>
                <div>
                  <p className="text-lg font-bold text-text-primary">{statusCounts[key] || 0}</p>
                  <p className="text-xs text-text-secondary capitalize">{key}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-2">Distribusi Status</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={65}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1E2235', border: '1px solid #2D3748', borderRadius: 8 }}
                formatter={(v, name) => [v, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select
          value={filterStatus}
          onChange={setFilterStatus}
          options={Object.entries(STATUS_CONFIG).map(([k, v]) => ({ value: k, label: v.label }))}
          placeholder="Semua Status"
          className="min-w-[140px]"
        />
        <Select
          value={filterSubject}
          onChange={setFilterSubject}
          options={subjectOptions}
          placeholder="Semua Tokoh/Partai"
          className="min-w-[180px]"
        />
        {(filterStatus || filterSubject) && (
          <button
            onClick={() => { setFilterStatus(''); setFilterSubject('') }}
            className="px-3 py-2 text-xs text-text-secondary hover:text-text-primary border border-border rounded-lg transition-colors"
          >
            ✕ Reset
          </button>
        )}
      </div>

      <p className="text-xs text-text-secondary">
        Menampilkan <span className="text-text-primary font-medium">{filtered.length}</span> dari{' '}
        <span className="text-text-primary font-medium">{AGENDAS.length}</span> agenda
      </p>

      {/* Agenda Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-text-secondary">
          <div className="text-5xl mb-4">📋</div>
          <p className="font-medium">🔍 Tidak ada agenda ditemukan untuk filter ini</p>
          <p className="text-sm mt-1">Coba ubah filter status atau tokoh</p>
        </div>
      ) : null}
      <div className="space-y-3">
        {filtered.map(a => {
          const person = PERSONS.find(p => p.id === a.subject_id)
          const party = PARTY_MAP[a.subject_id]
          const statusCfg = STATUS_CONFIG[a.status] || STATUS_CONFIG.janji

          return (
            <Card key={a.id} className={`p-4 border-l-4`} style={{ borderLeftColor: statusCfg.color }}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                    {person && (
                      <span
                        className="text-xs px-2 py-0.5 rounded font-medium"
                        style={{
                          backgroundColor: (PARTY_MAP[person.party_id]?.color || '#6B7280') + '20',
                          color: PARTY_MAP[person.party_id]?.color || '#6B7280',
                        }}
                      >
                        {person.name}
                      </span>
                    )}
                    {party && (
                      <span
                        className="text-xs px-2 py-0.5 rounded font-medium"
                        style={{ backgroundColor: party.color + '20', color: party.color }}
                      >
                        {party.abbr}
                      </span>
                    )}
                    {a.year && <span className="text-xs text-text-secondary">{a.year}</span>}
                  </div>
                  <h4 className="text-sm font-semibold text-text-primary mb-1">{a.title}</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">{a.description}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-text-secondary">
                {a.budget_idr && (
                  <span>💰 Anggaran: <span className="text-accent-gold font-medium">{formatIDR(a.budget_idr)}</span></span>
                )}
                {a.source && (
                  <span>📌 Sumber: <span className="text-text-primary">{a.source}</span></span>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
