// src/lib/search.js — Global fuzzy search across all data types

import { PERSONS } from '../data/persons.js'
import { PARTIES } from '../data/parties.js'
import { AGENDAS } from '../data/agendas.js'
import { KPK_CASES } from '../data/kpk_cases.js'
import { NEWS } from '../data/news.js'

export const SEARCH_TYPES = ['person', 'party', 'agenda', 'kpk', 'news']

/**
 * Score a query against a set of fields.
 * Higher score = better match.
 */
function scoreMatch(query, fields) {
  let score = 0
  const q = query.toLowerCase()
  // Escape regex special chars
  const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const wordBoundaryRe = new RegExp('\\b' + escapedQ + '\\b')

  fields.filter(Boolean).forEach(field => {
    const f = String(field).toLowerCase()
    if (f === q) score += 100
    else if (f.startsWith(q)) score += 50
    else if (f.includes(q)) score += 20
    // Word boundary bonus
    if (wordBoundaryRe.test(f)) score += 30
  })
  return score
}

/**
 * Global fuzzy search across persons, parties, agendas, kpk cases, and news.
 *
 * @param {string} query
 * @param {{ limit?: number, types?: string[] }} opts
 * @returns {Array<{ type, id, label, subtitle, url, score, data }>}
 */
export function globalSearch(query, { limit = 20, types = SEARCH_TYPES } = {}) {
  if (!query || query.trim().length < 2) return []
  const q = query.toLowerCase().trim()
  const results = []

  // ── Persons ───────────────────────────────────────────────────────────
  if (types.includes('person')) {
    PERSONS.forEach(p => {
      const score = scoreMatch(q, [
        p.name,
        p.party_id,
        p.bio,
        p.tags?.join(' '),
        p.analysis?.policy_direction,
        p.positions?.map(pos => pos.title).join(' '),
        p.region_id,
      ])
      if (score > 0) {
        const currentPos = p.positions?.find(pos => pos.is_current)
        results.push({
          type: 'person',
          id: p.id,
          label: p.name,
          subtitle: (currentPos?.title || p.tier || '—') + (p.party_id ? ' · ' + p.party_id.toUpperCase() : ''),
          url: '/persons/' + p.id,
          score,
          data: p,
        })
      }
    })
  }

  // ── Parties ────────────────────────────────────────────────────────────
  if (types.includes('party')) {
    PARTIES.forEach(p => {
      const score = scoreMatch(q, [p.name, p.abbr, p.ideology, p.ketum])
      if (score > 0) {
        results.push({
          type: 'party',
          id: p.id,
          label: p.name,
          subtitle: p.abbr + ' · ' + (p.seats_2024 ?? 0) + ' kursi',
          url: '/parties/' + p.id,
          score,
          data: p,
        })
      }
    })
  }

  // ── Agendas ────────────────────────────────────────────────────────────
  if (types.includes('agenda')) {
    AGENDAS.forEach(a => {
      const score = scoreMatch(q, [a.title, a.description, a.status, a.subject_id])
      if (score > 0) {
        results.push({
          type: 'agenda',
          id: a.id,
          label: a.title,
          subtitle: 'Status: ' + a.status + (a.subject_id ? ' · ' + a.subject_id : ''),
          url: '/agendas',
          score,
          data: a,
        })
      }
    })
  }

  // ── KPK Cases ──────────────────────────────────────────────────────────
  if (types.includes('kpk')) {
    KPK_CASES.forEach(k => {
      const score = scoreMatch(q, [k.title, k.charges, k.region, k.status, k.stage, k.suspects?.join(' ')])
      if (score > 0) {
        results.push({
          type: 'kpk',
          id: k.id,
          label: k.title,
          subtitle: k.status + ' · ' + (k.region || 'Nasional'),
          url: '/kpk',
          score,
          data: k,
        })
      }
    })
  }

  // ── News ───────────────────────────────────────────────────────────────
  if (types.includes('news')) {
    NEWS.forEach(n => {
      const score = scoreMatch(q, [n.headline, n.summary, n.source, n.category])
      if (score > 0) {
        results.push({
          type: 'news',
          id: n.id,
          label: n.headline,
          subtitle: n.source + ' · ' + n.date,
          url: '/news',
          score,
          data: n,
        })
      }
    })
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit)
}

/** Icon for each result type */
export const TYPE_ICON = {
  person: '👤',
  party: '🏛️',
  agenda: '📅',
  kpk: '⚖️',
  news: '📰',
}

/** Human-readable label for each type */
export const TYPE_LABEL = {
  person: 'Tokoh',
  party: 'Partai',
  agenda: 'Agenda',
  kpk: 'KPK',
  news: 'Berita',
}
