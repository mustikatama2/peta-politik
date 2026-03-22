import { AGENDAS }    from '../data/agendas.js'
import { KPK_CASES }  from '../data/kpk_cases.js'
import { PERSONS }    from '../data/persons.js'
import { CONNECTIONS } from '../data/connections.js'
import { QUICK_FACTS } from '../data/quick_facts.js'
import { scoreAllPersons } from './scoring.js'

/**
 * generateBriefing(date?)
 * Auto-generates all sections of the daily political briefing from static data.
 * No backend required — purely derived from the existing data layer.
 */
export function generateBriefing(date = new Date()) {
  const dateStr = date.toISOString().slice(0, 10)

  // ── Section A: Active agendas (janji / proses) ──────────────────────────
  // Agendas don't carry ISO dates — we treat 'janji' and 'proses' as "active/upcoming"
  const upcomingAgendas = AGENDAS
    .filter(a => a.status === 'janji' || a.status === 'proses')
    .slice(0, 5)

  // ── Section B: Persons associated with active agendas ──────────────────
  const personIdsInNews = [
    ...new Set(
      upcomingAgendas
        .filter(a => a.subject_type === 'person')
        .map(a => a.subject_id)
    ),
  ]
  const personsInNews = PERSONS
    .filter(p => personIdsInNews.includes(p.id))
    .slice(0, 5)

  // ── Section C: Daily fact (date-seeded) ────────────────────────────────
  const seed = date.getDate() + date.getMonth() * 31
  const fact = QUICK_FACTS[seed % QUICK_FACTS.length] || QUICK_FACTS[0]

  // ── Section D: Power ranking snapshot (top 10) ─────────────────────────
  const rankings = scoreAllPersons().slice(0, 10)

  // ── Section E: Active KPK cases (tersangka / terdakwa) ─────────────────
  // Data uses lowercase: 'tersangka', 'terpidana'
  const recentKPK = KPK_CASES
    .filter(c =>
      c.status === 'tersangka' ||
      c.status === 'terdakwa'  ||
      c.status === 'Tersangka' ||
      c.status === 'Terdakwa'
    )
    .slice(0, 4)

  // ── Section F: Coalition tension — top konflik connections ─────────────
  const coalitionTension = CONNECTIONS
    .filter(c => c.type === 'konflik')
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 3)

  return {
    date: dateStr,
    upcomingAgendas,
    personsInNews,
    fact,
    rankings,
    recentKPK,
    coalitionTension,
  }
}
