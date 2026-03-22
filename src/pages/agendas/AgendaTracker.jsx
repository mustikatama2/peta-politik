import { useState, useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { AGENDAS } from '../../data/agendas'
import { PERSONS } from '../../data/persons'
import { PARTY_MAP } from '../../data/parties'
import { PageHeader, Card, Badge, Select, formatIDR } from '../../components/ui'

// ── Status config (display) ──────────────────────────────────────────────────
const STATUS_CONFIG = {
  janji:   { label: '🔵 Janji',   color: '#3B82F6', variant: 'status-janji' },
  proses:  { label: '🟡 Proses',  color: '#F59E0B', variant: 'status-proses' },
  selesai: { label: '🟢 Selesai', color: '#10B981', variant: 'status-selesai' },
  ingkar:  { label: '🔴 Ingkar',  color: '#EF4444', variant: 'status-ingkar' },
  batal:   { label: '⚫ Batal',   color: '#6B7280', variant: 'status-batal' },
}

// ── UI status tabs ─────────────────────────────────────────────────────────
const UI_STATUS_TABS = [
  { id: '',          label: 'Semua',      icon: '📋' },
  { id: 'mendatang', label: 'Mendatang',  icon: '⏳', filter: a => a.status === 'janji' },
  { id: 'berlangsung',label: 'Berlangsung',icon: '🔄', filter: a => a.status === 'proses' },
  { id: 'selesai',   label: 'Selesai',    icon: '✅', filter: a => a.status === 'selesai' },
  { id: 'tertunda',  label: 'Tertunda',   icon: '⚠️', filter: a => a.status === 'ingkar' || a.status === 'batal' },
]

const statusCounts = Object.keys(STATUS_CONFIG).reduce((acc, s) => {
  acc[s] = AGENDAS.filter(a => a.status === s).length
  return acc
}, {})

const pieData = Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
  name: cfg.label,
  value: statusCounts[key] || 0,
  color: cfg.color,
})).filter(d => d.value > 0)

// ── ICS export ────────────────────────────────────────────────────────────
function exportICS(agendas) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PetaPolitik//ID',
    ...agendas.map(a => [
      'BEGIN:VEVENT',
      `DTSTART:${String(a.year || new Date().getFullYear())}0101`,
      `SUMMARY:${(a.title || '').replace(/[\\;,]/g, '\\$&')}`,
      `DESCRIPTION:${(a.description || '').replace(/[\\;,\n]/g, ' ')}`,
      `CATEGORIES:${a.subject_id || ''}`,
      'END:VEVENT',
    ].join('\r\n')),
    'END:VCALENDAR',
  ]
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'peta-politik-agenda.ics'
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// ── Calendar helpers ──────────────────────────────────────────────────────
const MONTH_NAMES_ID = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const DAY_NAMES_ID   = ['Min','Sen','Sel','Rab','Kam','Jum','Sab']

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate() }
function getFirstDayOfMonth(year, month) { return new Date(year, month, 1).getDay() }

function CalendarView({ agendas }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedAgenda, setSelectedAgenda] = useState(null)

  // Group agendas by (year, month=0) since most only have year; default to month 0 (Jan)
  const agendaByDay = useMemo(() => {
    const map = {}
    agendas.forEach(a => {
      const aYear  = a.year || 2024
      const aMonth = typeof a.month === 'number' ? a.month - 1 : 0  // month is 0-indexed internally
      const aDay   = a.day || 1
      if (aYear === viewYear && aMonth === viewMonth) {
        const key = aDay
        if (!map[key]) map[key] = []
        map[key].push(a)
      }
    })
    return map
  }, [agendas, viewYear, viewMonth])

  // Also group agendas by just year (for "any date in this year" matching)
  const agendaByYear = useMemo(() => {
    const map = {}
    agendas.forEach(a => {
      const y = a.year || 2024
      if (!map[y]) map[y] = []
      map[y].push(a)
    })
    return map
  }, [agendas])

  const yearAgendas = agendaByYear[viewYear] || []

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay    = getFirstDayOfMonth(viewYear, viewMonth)

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const todayDate = today.getDate()
  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth()

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between bg-bg-card border border-border rounded-xl p-3">
        <button
          onClick={prevMonth}
          className="px-3 py-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors text-sm"
        >‹ Prev</button>
        <div className="text-center">
          <div className="font-bold text-text-primary">{MONTH_NAMES_ID[viewMonth]} {viewYear}</div>
          {yearAgendas.length > 0 && (
            <div className="text-xs text-text-secondary">{yearAgendas.length} agenda di tahun {viewYear}</div>
          )}
        </div>
        <button
          onClick={nextMonth}
          className="px-3 py-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors text-sm"
        >Next ›</button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1">
        {DAY_NAMES_ID.map(d => (
          <div key={d} className="text-center text-[10px] font-semibold text-text-muted py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />
          const dayAgendas = agendaByDay[day] || []
          const isToday = isCurrentMonth && day === todayDate
          return (
            <div
              key={day}
              className={`min-h-[56px] rounded-lg border p-1 transition-colors ${
                isToday
                  ? 'border-accent-red bg-accent-red/5'
                  : dayAgendas.length > 0
                    ? 'border-border bg-bg-card cursor-pointer hover:bg-bg-elevated'
                    : 'border-border/30 bg-bg-card/30'
              }`}
            >
              <div className={`text-[11px] font-medium mb-1 ${isToday ? 'text-accent-red' : 'text-text-secondary'}`}>
                {day}
              </div>
              <div className="space-y-0.5">
                {dayAgendas.slice(0, 3).map(a => {
                  const cfg = STATUS_CONFIG[a.status] || STATUS_CONFIG.janji
                  return (
                    <div
                      key={a.id}
                      onClick={() => setSelectedAgenda(a)}
                      title={a.title}
                      className="text-[9px] truncate px-1 py-0.5 rounded font-medium cursor-pointer hover:opacity-80"
                      style={{ backgroundColor: cfg.color + '30', color: cfg.color, borderLeft: `2px solid ${cfg.color}` }}
                    >
                      {a.title}
                    </div>
                  )
                })}
                {dayAgendas.length > 3 && (
                  <div className="text-[9px] text-text-muted text-center">+{dayAgendas.length - 3}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Year agendas list (since most agendas only have year, not month/day) */}
      {yearAgendas.length > 0 && (
        <div className="bg-bg-card border border-border rounded-xl p-4">
          <h4 className="text-xs font-semibold text-text-secondary mb-3 uppercase tracking-wider">
            📋 Agenda Tahun {viewYear} ({yearAgendas.length})
          </h4>
          <div className="space-y-2">
            {yearAgendas.map(a => {
              const cfg = STATUS_CONFIG[a.status] || STATUS_CONFIG.janji
              return (
                <button
                  key={a.id}
                  onClick={() => setSelectedAgenda(a)}
                  className="w-full text-left flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-bg-elevated transition-colors"
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cfg.color }}
                  />
                  <span className="text-xs text-text-primary truncate flex-1">{a.title}</span>
                  <span className="text-[10px] text-text-muted flex-shrink-0">{cfg.label.split(' ')[0]}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Modal for selected agenda */}
      {selectedAgenda && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedAgenda(null)}
        >
          <div
            className="bg-bg-card border border-border rounded-xl p-5 max-w-md w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <Badge variant={(STATUS_CONFIG[selectedAgenda.status] || STATUS_CONFIG.janji).variant}>
                {(STATUS_CONFIG[selectedAgenda.status] || STATUS_CONFIG.janji).label}
              </Badge>
              <button
                onClick={() => setSelectedAgenda(null)}
                className="text-text-muted hover:text-text-primary text-lg leading-none"
              >✕</button>
            </div>
            <h3 className="font-bold text-text-primary text-base mb-2">{selectedAgenda.title}</h3>
            <p className="text-xs text-text-secondary leading-relaxed mb-3">{selectedAgenda.description}</p>
            <div className="text-xs text-text-muted">
              {selectedAgenda.year && <span>📅 {selectedAgenda.year}</span>}
              {selectedAgenda.source && <span className="ml-3">📌 {selectedAgenda.source}</span>}
            </div>
            {selectedAgenda.budget_idr && (
              <div className="mt-2 text-xs">
                💰 Anggaran: <span className="text-accent-gold font-medium">{formatIDR(selectedAgenda.budget_idr)}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Countdown badge ───────────────────────────────────────────────────────
function CountdownBadge({ year }) {
  const now = new Date()
  const target = new Date(year, 0, 1)  // Jan 1 of target year
  const diffMs = target - now
  if (diffMs <= 0) return null
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}>
      ⏰ {diffDays} hari lagi
    </span>
  )
}

// ── Main component ────────────────────────────────────────────────────────
export default function AgendaTracker() {
  const [filterStatus,  setFilterStatus]  = useState('')
  const [filterSubject, setFilterSubject] = useState('')
  const [uiStatusTab,   setUiStatusTab]   = useState('')  // '' | 'mendatang' | 'berlangsung' | 'selesai' | 'tertunda'
  const [viewMode,      setViewMode]      = useState('list')  // 'list' | 'calendar'
  const [icsExported,   setIcsExported]   = useState(false)

  const subjectOptions = [...new Set(AGENDAS.map(a => a.subject_id))].map(id => {
    const person = PERSONS.find(p => p.id === id)
    const party  = PARTY_MAP[id]
    return { value: id, label: person?.name || party?.abbr || id }
  })

  const filtered = useMemo(() => {
    let result = [...AGENDAS]

    // UI tab filter (Mendatang/Berlangsung/etc.)
    if (uiStatusTab) {
      const tab = UI_STATUS_TABS.find(t => t.id === uiStatusTab)
      if (tab?.filter) result = result.filter(tab.filter)
    }

    // Legacy status select filter
    if (filterStatus) result = result.filter(a => a.status === filterStatus)

    // Subject filter
    if (filterSubject) result = result.filter(a => a.subject_id === filterSubject)

    return result
  }, [filterStatus, filterSubject, uiStatusTab])

  // Count per UI tab
  const uiTabCounts = useMemo(() => {
    const counts = { '': AGENDAS.length }
    UI_STATUS_TABS.forEach(tab => {
      if (tab.filter) counts[tab.id] = AGENDAS.filter(tab.filter).length
    })
    return counts
  }, [])

  const handleIcsExport = () => {
    const upcoming = filtered.filter(a => a.status === 'janji' || a.status === 'proses')
    exportICS(upcoming.length > 0 ? upcoming : filtered)
    setIcsExported(true)
    setTimeout(() => setIcsExported(false), 2000)
  }

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
                cx="50%" cy="50%"
                innerRadius={40} outerRadius={65}
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

      {/* UI Status tabs */}
      <div className="flex flex-wrap gap-2">
        {UI_STATUS_TABS.map(tab => {
          const isActive = uiStatusTab === tab.id
          const count = uiTabCounts[tab.id] || 0
          return (
            <button
              key={tab.id}
              onClick={() => { setUiStatusTab(tab.id); setFilterStatus('') }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                isActive
                  ? 'bg-accent-red text-white border-accent-red'
                  : 'border-border text-text-secondary bg-bg-card hover:border-text-secondary hover:text-text-primary'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-white/20' : 'bg-bg-elevated'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Toolbar: view toggle + subject filter + iCal export */}
      <div className="flex flex-wrap items-center gap-3">
        {/* View toggle */}
        <div className="flex rounded-lg overflow-hidden border border-border">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-accent-red text-white'
                : 'bg-bg-card text-text-secondary hover:text-text-primary'
            }`}
          >☰ List</button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1.5 text-xs font-medium transition-colors border-l border-border ${
              viewMode === 'calendar'
                ? 'bg-accent-red text-white'
                : 'bg-bg-card text-text-secondary hover:text-text-primary'
            }`}
          >🗓️ Kalender</button>
        </div>

        <Select
          value={filterSubject}
          onChange={setFilterSubject}
          options={subjectOptions}
          placeholder="Semua Tokoh/Partai"
          className="min-w-[180px]"
        />

        {(filterStatus || filterSubject || uiStatusTab) && (
          <button
            onClick={() => { setFilterStatus(''); setFilterSubject(''); setUiStatusTab('') }}
            className="px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary border border-border rounded-lg transition-colors"
          >✕ Reset</button>
        )}

        {/* iCal export */}
        <button
          onClick={handleIcsExport}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-bg-card border border-border rounded-lg text-text-secondary hover:text-text-primary hover:border-text-secondary transition-all"
        >
          {icsExported ? '✅ Tersimpan!' : '📅 Ekspor ke Kalender'}
        </button>
      </div>

      <p className="text-xs text-text-secondary">
        Menampilkan <span className="text-text-primary font-medium">{filtered.length}</span> dari{' '}
        <span className="text-text-primary font-medium">{AGENDAS.length}</span> agenda
      </p>

      {/* Calendar view */}
      {viewMode === 'calendar' && (
        <CalendarView agendas={filtered} />
      )}

      {/* List view */}
      {viewMode === 'list' && (
        <>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-text-secondary">
              <div className="text-5xl mb-4">📋</div>
              <p className="font-medium">🔍 Tidak ada agenda ditemukan untuk filter ini</p>
              <p className="text-sm mt-1">Coba ubah filter status atau tokoh</p>
            </div>
          ) : null}

          <div className="space-y-3">
            {filtered.map(a => {
              const person    = PERSONS.find(p => p.id === a.subject_id)
              const party     = PARTY_MAP[a.subject_id]
              const statusCfg = STATUS_CONFIG[a.status] || STATUS_CONFIG.janji
              const isJanji   = a.status === 'janji'
              const isFuture  = a.year && a.year > new Date().getFullYear()

              return (
                <Card key={a.id} className="p-4 border-l-4" style={{ borderLeftColor: statusCfg.color }}>
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
                        {/* Countdown for high-importance upcoming */}
                        {isJanji && isFuture && <CountdownBadge year={a.year} />}
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
        </>
      )}
    </div>
  )
}
