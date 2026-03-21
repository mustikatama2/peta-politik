import { useState } from 'react'
import { Link } from 'react-router-dom'
import { COALITION_ERAS } from '../../data/coalition_history'

// ── Party metadata ────────────────────────────────────────────────────────────
const PARTY_META = {
  pdip:    { name:'PDIP',     color:'#DC2626', bg:'bg-red-700'      },
  ger:     { name:'Gerindra', color:'#7F1D1D', bg:'bg-red-950'      },
  gol:     { name:'Golkar',   color:'#F59E0B', bg:'bg-yellow-500'   },
  pkb:     { name:'PKB',      color:'#16A34A', bg:'bg-green-700'    },
  nas:     { name:'NasDem',   color:'#2563EB', bg:'bg-blue-700'     },
  pks:     { name:'PKS',      color:'#EA580C', bg:'bg-orange-600'   },
  dem:     { name:'Demokrat', color:'#3B82F6', bg:'bg-blue-500'     },
  pan:     { name:'PAN',      color:'#CA8A04', bg:'bg-yellow-700'   },
  ppp:     { name:'PPP',      color:'#15803D', bg:'bg-green-800'    },
  pbb:     { name:'PBB',      color:'#1D4ED8', bg:'bg-blue-800'     },
  psi:     { name:'PSI',      color:'#EC4899', bg:'bg-pink-500'     },
  pkp:     { name:'PKP',      color:'#6B7280', bg:'bg-gray-500'     },
  ppb:     { name:'PPB',      color:'#374151', bg:'bg-gray-700'     },
  hanura:  { name:'Hanura',   color:'#7C3AED', bg:'bg-violet-700'   },
  pkb_pecahan: { name:'PKB-fraksional', color:'#4ADE80', bg:'bg-green-400' },
}

// ── Heatmap data: for each election, determine party role ─────────────────────
const HEATMAP_PARTIES = ['pdip','ger','gol','pkb','nas','pks','dem','pan','ppp']

function getPartyRole(era, partyId) {
  const isCoalition = era.coalition.parties.includes(partyId)
  const isOpposition = era.opposition.parties.includes(partyId)
  // coalition wins over opposition in case of overlap
  if (isCoalition) return 'coalition'
  if (isOpposition) return 'opposition'
  return 'neutral'
}

// ── Helper: year only from election string ────────────────────────────────────
function electionYear(str) {
  return str.replace('Pilpres ', '')
}

// ── Winner highlight style ────────────────────────────────────────────────────
const WINNER_COLORS = {
  sby:    { border:'border-blue-400', badge:'bg-blue-600', text:'Demokrat', emoji:'🏆' },
  jokowi: { border:'border-red-400',  badge:'bg-red-600',  text:'PDIP',     emoji:'🏆' },
  prabowo:{ border:'border-red-800',  badge:'bg-red-900',  text:'Gerindra', emoji:'🏆' },
  gibran: { border:'border-amber-400',badge:'bg-amber-500',text:'Wapres',   emoji:'⭐' },
}

export default function CoalitionPage() {
  const [activeIdx, setActiveIdx] = useState(4) // default to latest (2024)
  const era = COALITION_ERAS[activeIdx]

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">🤝 Sejarah Koalisi Pilpres</h1>
        <p className="text-text-muted mt-1">Dinamika koalisi dan oposisi Pilpres Indonesia 2004–2024</p>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1 — Election Timeline (horizontal scroll)
      ═══════════════════════════════════════════════════════════ */}
      <section>
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Linimasa Pilpres</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
          {COALITION_ERAS.map((e, i) => {
            const isActive = i === activeIdx
            const year = electionYear(e.election)
            return (
              <button
                key={e.election}
                onClick={() => setActiveIdx(i)}
                className={`snap-start flex-shrink-0 rounded-xl border-2 transition-all duration-200 text-left p-4 w-48
                  ${isActive
                    ? 'border-red-500 bg-bg-card shadow-lg shadow-red-900/20'
                    : 'border-border bg-bg-elevated hover:border-white/30'
                  }`}
              >
                <div className={`text-2xl font-black mb-1 ${isActive ? 'text-red-400' : 'text-text-muted'}`}>
                  {year}
                </div>
                <div className="text-xs font-bold text-text-primary truncate">{e.winner}</div>
                <div className="text-[10px] text-text-muted mt-1 truncate">{e.coalition.name}</div>
                <div className={`mt-2 inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold
                  ${e.winner_ids.includes('jokowi') ? 'bg-red-900/40 text-red-300' :
                    e.winner_ids.includes('prabowo') ? 'bg-red-950/60 text-red-200' :
                    'bg-blue-900/40 text-blue-300'}`}
                >
                  🏆 {e.coalition.seats} kursi
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2 — Active Detail Panel
      ═══════════════════════════════════════════════════════════ */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coalition card */}
        <div className="bg-bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs text-text-muted uppercase tracking-wider">{era.election}</div>
              <h3 className="text-lg font-bold text-text-primary mt-0.5">{era.winner}</h3>
              <div className="text-sm text-green-400 font-semibold">{era.coalition.name}</div>
            </div>
            <div className="flex-shrink-0 text-3xl">🏆</div>
          </div>

          {/* Coalition parties */}
          <div>
            <div className="text-xs font-semibold text-text-muted mb-2 uppercase">Partai Koalisi Pemenang · {era.coalition.seats} kursi DPR</div>
            <div className="flex flex-wrap gap-2">
              {era.coalition.parties.map(p => {
                const meta = PARTY_META[p] || { name: p.toUpperCase(), color:'#6B7280' }
                return (
                  <span
                    key={p}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold text-white"
                    style={{ backgroundColor: meta.color }}
                  >
                    {meta.name}
                  </span>
                )
              })}
            </div>
            <p className="text-xs text-text-muted mt-2 leading-relaxed">{era.coalition.notes}</p>
          </div>

          {/* Tokoh kunci */}
          <div>
            <div className="text-xs font-semibold text-text-muted mb-2 uppercase">Tokoh Kunci</div>
            <div className="flex flex-wrap gap-2">
              {era.winner_ids.map(id => (
                <Link
                  key={id}
                  to={`/persons/${id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-bg-elevated border border-border rounded-lg text-sm text-text-primary hover:border-red-500 hover:text-red-400 transition-colors"
                >
                  👤 {id.charAt(0).toUpperCase() + id.slice(1).replace(/_/g, ' ')}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Opposition + Key event */}
        <div className="space-y-4">
          {/* Opposition card */}
          <div className="bg-bg-card border border-red-900/30 rounded-xl p-5">
            <div className="text-xs font-semibold text-red-400 uppercase mb-3">⚔️ Oposisi / Koalisi Kalah</div>
            <div className="text-sm font-bold text-text-primary mb-2">{era.opposition.name}</div>
            <div className="flex flex-wrap gap-2 mb-3">
              {era.opposition.parties.map(p => {
                const meta = PARTY_META[p] || { name: p.toUpperCase(), color:'#6B7280' }
                return (
                  <span
                    key={p}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold text-white opacity-80"
                    style={{ backgroundColor: meta.color }}
                  >
                    {meta.name}
                  </span>
                )
              })}
            </div>
            <p className="text-xs text-text-muted leading-relaxed">{era.opposition.notes}</p>
          </div>

          {/* Key event callout */}
          <div className="bg-amber-900/20 border border-amber-700/40 rounded-xl p-5">
            <div className="text-xs font-semibold text-amber-400 uppercase mb-2">⚡ Momen Penting</div>
            <p className="text-sm text-text-primary leading-relaxed">{era.key_event}</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3 — Party Loyalty Heatmap
      ═══════════════════════════════════════════════════════════ */}
      <section>
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-1">Loyalitas Partai per Pilpres</h2>
        <div className="flex gap-4 text-xs text-text-muted mb-4">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-green-600 inline-block"></span> Koalisi Pemenang</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-700 inline-block"></span> Oposisi / Koalisi Kalah</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-gray-700 inline-block"></span> Tidak Ikut / Belum Ada</span>
        </div>

        <div className="bg-bg-card border border-border rounded-xl overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase w-28">Partai</th>
                {COALITION_ERAS.map(e => (
                  <th key={e.election} className="px-3 py-3 text-center text-text-muted font-semibold text-xs uppercase">
                    {electionYear(e.election)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HEATMAP_PARTIES.map((partyId, rowIdx) => {
                const meta = PARTY_META[partyId] || { name: partyId.toUpperCase(), color:'#6B7280' }
                return (
                  <tr
                    key={partyId}
                    className={`border-b border-border/50 ${rowIdx % 2 === 0 ? 'bg-bg-elevated/30' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <span
                        className="inline-block px-2 py-0.5 rounded text-xs font-bold text-white"
                        style={{ backgroundColor: meta.color }}
                      >
                        {meta.name}
                      </span>
                    </td>
                    {COALITION_ERAS.map(era => {
                      const role = getPartyRole(era, partyId)
                      const isActiveEra = COALITION_ERAS[activeIdx] === era
                      let cellBg, cellText, cellIcon
                      if (role === 'coalition') {
                        cellBg = isActiveEra ? 'bg-green-600' : 'bg-green-800/60'
                        cellText = 'text-green-100'
                        cellIcon = '🟢'
                      } else if (role === 'opposition') {
                        cellBg = isActiveEra ? 'bg-red-700' : 'bg-red-900/60'
                        cellText = 'text-red-100'
                        cellIcon = '🔴'
                      } else {
                        cellBg = 'bg-gray-800/40'
                        cellText = 'text-gray-500'
                        cellIcon = '—'
                      }
                      return (
                        <td key={era.election} className="px-3 py-3 text-center">
                          <button
                            onClick={() => setActiveIdx(COALITION_ERAS.indexOf(era))}
                            className={`w-10 h-8 rounded text-xs font-bold transition-all ${cellBg} ${cellText} hover:opacity-90`}
                            title={`${meta.name} ${era.election}: ${role === 'coalition' ? 'Koalisi pemenang' : role === 'opposition' ? 'Oposisi' : 'Tidak ikut'}`}
                          >
                            {cellIcon}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile scroll hint */}
        <p className="text-xs text-text-muted mt-2 text-center md:hidden">← Geser untuk melihat semua →</p>
      </section>
    </div>
  )
}
