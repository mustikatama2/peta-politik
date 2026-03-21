// coiDetector.js — Auto-scan for Conflict of Interest signals
// Cross-references persons, connections, business ties, and KPK cases

import { PERSONS } from '../data/persons.js'
import { CONNECTIONS } from '../data/connections.js'
import { COMPANIES, POLITICAL_BUSINESS_TIES } from '../data/business.js'
import { KPK_CASES } from '../data/kpk_cases.js'

// NOTE: government.js may not exist — CABINET_STRUCTURE defaults to empty
// If government.js is added later, import CABINET_STRUCTURE from it here.
const CABINET_STRUCTURE = []

// ── Helpers ───────────────────────────────────────────────────────────────────
const CABINET_KEYWORDS = [
  'menteri', 'menko', 'kepala badan', 'jaksa agung', 'kapolri',
  'presiden', 'wakil presiden', 'utusan khusus presiden',
]

function isCabinetPerson(person) {
  const pos0 = (person.positions?.[0]?.title || '').toLowerCase()
  return CABINET_KEYWORDS.some(k => pos0.includes(k))
}

function getPersonBusinessSectors(personId) {
  const ties = POLITICAL_BUSINESS_TIES.filter(t => t.person_id === personId)
  const sectors = new Set()
  ties.forEach(t => {
    const company = COMPANIES.find(c => c.id === t.company_id)
    if (company?.sector) sectors.add(company.sector)
  })
  return [...sectors]
}

function getMinistryOversightSectors(person) {
  const title = (person.positions?.[0]?.title || '').toLowerCase()
  const sectors = []
  if (title.includes('esdm') || title.includes('energi') || title.includes('pertambangan')) {
    sectors.push('pertambangan', 'energi')
  }
  if (title.includes('komunikasi') || title.includes('kominfo')) {
    sectors.push('media')
  }
  if (title.includes('bumn')) {
    sectors.push('keuangan', 'energi', 'infrastruktur', 'media')
  }
  if (title.includes('perekonomian') || title.includes('perdagangan')) {
    sectors.push('perdagangan')
  }
  if (title.includes('kehutanan') || title.includes('lingkungan')) {
    sectors.push('agribisnis')
  }
  if (title.includes('pertanian') || title.includes('pangan')) {
    sectors.push('agribisnis')
  }
  if (title.includes('infrastruktur') || title.includes('pekerjaan umum') || title.includes('pu')) {
    sectors.push('infrastruktur', 'properti')
  }
  if (title.includes('keuangan') || title.includes('bank')) {
    sectors.push('keuangan')
  }
  // Presiden/Wapres oversee all sectors
  if (title.includes('presiden')) {
    sectors.push('pertambangan', 'energi', 'media', 'keuangan', 'infrastruktur', 'agribisnis', 'properti')
  }
  return sectors
}

// ── Rule 1: Minister + business ownership in same sector ──────────────────────
function rule1_BusinessConflict() {
  const alerts = []
  PERSONS.forEach(person => {
    if (!isCabinetPerson(person)) return
    const businessSectors = getPersonBusinessSectors(person.id)
    if (businessSectors.length === 0) return
    const cabinetSectors = getMinistryOversightSectors(person)
    const overlapping = businessSectors.filter(s => cabinetSectors.includes(s))
    if (overlapping.length === 0) return

    const ties = POLITICAL_BUSINESS_TIES.filter(t => t.person_id === person.id)
    alerts.push({
      person_id: person.id,
      person_name: person.name,
      type: 'business_conflict',
      severity: 'high',
      description: `${person.name} menjabat posisi pemerintahan yang mengawasi sektor ${overlapping.join(', ')}, sambil memiliki kepentingan bisnis di sektor yang sama.`,
      evidence: ties.map(t => t.description),
    })
  })
  return alerts
}

// ── Rule 2: Family member connections between minister and business owner ──────
function rule2_FamilyTie() {
  const alerts = []
  const cabinetPersonIds = new Set(PERSONS.filter(isCabinetPerson).map(p => p.id))
  const businessPersonIds = new Set(
    POLITICAL_BUSINESS_TIES.filter(t => t.person_id).map(t => t.person_id)
  )

  CONNECTIONS.forEach(conn => {
    if (conn.type !== 'keluarga') return
    const fromInCabinet = cabinetPersonIds.has(conn.from)
    const toInCabinet = cabinetPersonIds.has(conn.to)
    const fromInBusiness = businessPersonIds.has(conn.from)
    const toInBusiness = businessPersonIds.has(conn.to)

    // Only flag if one is in cabinet AND the other has business interests
    if (!((fromInCabinet && toInBusiness) || (toInCabinet && fromInBusiness))) return
    // Avoid if both are in cabinet (would be double-counted)
    if (fromInCabinet && toInCabinet) return

    const ministerPid = fromInCabinet ? conn.from : conn.to
    const businessPid = fromInBusiness ? conn.from : conn.to
    const minister = PERSONS.find(p => p.id === ministerPid)
    const businessPerson = PERSONS.find(p => p.id === businessPid)
    const ties = POLITICAL_BUSINESS_TIES.filter(t => t.person_id === businessPid)

    alerts.push({
      person_id: ministerPid,
      person_name: minister?.name || ministerPid,
      type: 'family_tie',
      severity: 'high',
      description: `${minister?.name || ministerPid} (pejabat pemerintah) memiliki hubungan keluarga dengan ${businessPerson?.name || businessPid} yang memiliki kepentingan bisnis terkait.`,
      evidence: [
        `Relasi keluarga: ${conn.label}`,
        ...ties.map(t => t.description),
      ],
    })
  })
  return alerts
}

// ── Rule 3: Former KPK suspect now in cabinet ─────────────────────────────────
function rule3_KPKHistory() {
  const alerts = []
  PERSONS.forEach(person => {
    if (!isCabinetPerson(person)) return
    const cases = KPK_CASES.filter(c =>
      c.suspects?.includes(person.id) && ['tersangka', 'terpidana'].includes(c.status)
    )
    if (cases.length === 0) return
    alerts.push({
      person_id: person.id,
      person_name: person.name,
      type: 'kpk_history',
      severity: cases.some(c => c.status === 'terpidana') ? 'high' : 'medium',
      description: `${person.name} pernah/sedang menjadi tersangka KPK atau Kejaksaan, namun saat ini menjabat posisi pemerintahan.`,
      evidence: cases.map(c => `[${c.status.toUpperCase()}] ${c.title} — ${c.charges}`),
    })
  })
  return alerts
}

// ── Rule 4: Same-party business ties in regulated sectors ─────────────────────
function rule4_PartyBusinessTies() {
  const alerts = []
  const processedPairs = new Set()

  POLITICAL_BUSINESS_TIES.forEach(tie => {
    if (!tie.person_id || tie.risk !== 'tinggi') return
    const person = PERSONS.find(p => p.id === tie.person_id)
    if (!person?.party_id) return

    // Find other party members with cabinet positions
    const cabinetPartyMembers = PERSONS.filter(p =>
      p.id !== tie.person_id &&
      p.party_id === person.party_id &&
      isCabinetPerson(p)
    )
    if (cabinetPartyMembers.length === 0) return

    const pairKey = `${person.party_id}_${tie.company_id}`
    if (processedPairs.has(pairKey)) return
    processedPairs.add(pairKey)

    const company = COMPANIES.find(c => c.id === tie.company_id)
    alerts.push({
      person_id: tie.person_id,
      person_name: person.name,
      type: 'party_business',
      severity: 'medium',
      description: `${person.name} menguasai ${company?.name || tie.company_id} (sektor ${company?.sector || '?'}), sementara rekan separtai menjabat posisi pemerintahan di sektor terkait.`,
      evidence: [
        tie.description,
        `Rekan partai dengan jabatan: ${cabinetPartyMembers.map(p => p.name).join(', ')}`,
      ],
    })
  })
  return alerts
}

// ── Rule 5: Revolving door — private sector → ministry in same industry ───────
function rule5_RevolvingDoor() {
  const alerts = []
  const PRIVATE_SECTOR_TITLES = [
    'direktur utama', 'direktur', 'ceo', 'komisaris utama', 'komisaris',
    'presdir', 'president director', 'chairman', 'managing director',
  ]

  PERSONS.forEach(person => {
    if (!isCabinetPerson(person)) return
    const prevPositions = person.positions?.slice(1) || []
    const currentSectors = getMinistryOversightSectors(person)
    if (currentSectors.length === 0) return

    prevPositions.forEach(prev => {
      const prevTitle = (prev.title || '').toLowerCase()
      const wasPrivateSector = PRIVATE_SECTOR_TITLES.some(t => prevTitle.includes(t))
      if (!wasPrivateSector) return

      const prevSectors = getMinistryOversightSectors({ positions: [{ title: prevTitle }] })
      const overlapping = prevSectors.filter(s => currentSectors.includes(s))
      if (overlapping.length === 0) return

      alerts.push({
        person_id: person.id,
        person_name: person.name,
        type: 'revolving_door',
        severity: 'medium',
        description: `${person.name} berpindah dari posisi eksekutif swasta (${prev.title}) ke jabatan pemerintahan yang mengawasi industri yang sama.`,
        evidence: [
          `Jabatan sebelumnya: ${prev.title}${prev.period ? ` (${prev.period})` : ''}`,
          `Jabatan sekarang: ${person.positions?.[0]?.title || '?'}`,
          `Sektor overlap: ${overlapping.join(', ')}`,
        ],
      })
    })
  })
  return alerts
}

// ── Main export ───────────────────────────────────────────────────────────────
export function detectCOI() {
  const allAlerts = [
    ...rule1_BusinessConflict(),
    ...rule2_FamilyTie(),
    ...rule3_KPKHistory(),
    ...rule4_PartyBusinessTies(),
    ...rule5_RevolvingDoor(),
  ]

  // Deduplicate by person_id + type
  const seen = new Set()
  const unique = allAlerts.filter(a => {
    const key = `${a.person_id}_${a.type}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  // Sort: high → medium → low
  const severityOrder = { high: 0, medium: 1, low: 2 }
  unique.sort((a, b) => (severityOrder[a.severity] ?? 2) - (severityOrder[b.severity] ?? 2))

  return unique.map(a => ({
    id: `coi_${a.person_id}_${a.type}`,
    person_id: a.person_id,
    person_name: a.person_name,
    type: a.type,
    severity: a.severity,
    description: a.description,
    evidence: a.evidence || [],
  }))
}
