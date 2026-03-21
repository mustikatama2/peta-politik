import { PERSONS } from '../data/persons'
import { PARTIES, PARTY_MAP } from '../data/parties'
import { CONNECTIONS } from '../data/connections'
import { PROVINCES } from '../data/regions'
import { GDP_PROVINCES } from '../data/gdp'

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

export const POSITION_WEIGHTS = {
  'Presiden': 100,
  'Wakil Presiden': 90,
  'Menko': 75,
  'Menteri': 70,
  'Kepala BIN': 65,
  'Panglima TNI': 65,
  'Kapolri': 65,
  'Jaksa Agung': 65,
  'Ketua MPR': 60,
  'Ketua DPR': 60,
  'Ketua MK': 60,
  'Gubernur': 55,
  'Walikota': 35,
  'Bupati': 35,
  'Anggota DPR': 25,
  'Anggota DPD': 20,
  'default': 10,
}

export const CORRUPTION_PENALTIES = {
  terpidana: -40,
  tersangka: -30,
  tinggi:    -15,
  sedang:    -5,
  rendah:    0,
}

export const KIM_PLUS = ['ger', 'gol', 'nas', 'pan', 'dem', 'pks', 'pbb', 'pkb']

// ─── INDIVIDUAL PERSON SCORE (0–100) ────────────────────────────────────────

/**
 * Returns a score object for a single person.
 * Components:
 *   position_score  (0–40): weight of current position / 100 * 40
 *   network_score   (0–20): connection centrality
 *   party_score     (0–20): party DPR seat share
 *   lhkpn_score     (0–10): log-normalized wealth
 *   corruption_adj  (negative): penalty per risk level
 *   total           (0–100): clamped sum
 */
export function scoreIndividu(person, allConnections) {
  // 1. Position score
  const currentPos = person.positions?.find(p => p.is_current)
  let positionKey = 'default'
  if (currentPos) {
    const title = currentPos.title || ''
    positionKey = Object.keys(POSITION_WEIGHTS).find(k => title.includes(k)) || 'default'
  }
  const position_score = (POSITION_WEIGHTS[positionKey] / 100) * 40

  // 2. Network score — connections weighted by strength
  const myEdges = allConnections.filter(c => c.from === person.id || c.to === person.id)
  const totalStrength = myEdges.reduce((sum, c) => sum + (c.strength || 5), 0)
  const network_score = Math.min(20, (myEdges.length * 2) + (totalStrength / 10))

  // 3. Party score — DPR seat share normalized to 20
  const party = PARTY_MAP[person.party_id]
  const seats = party?.seats_2024 || 0
  const party_score = (seats / 580) * 20

  // 4. LHKPN score — log scale (Rp 1B = ~5, Rp 1T = ~10)
  const lhkpn = person.lhkpn_latest || 0
  const lhkpn_score = lhkpn > 0
    ? Math.min(10, Math.log10(lhkpn / 1_000_000_000) * 2.5)
    : 0

  // 5. Corruption adjustment
  const risk = person.analysis?.corruption_risk || 'rendah'
  const corruption_adj = CORRUPTION_PENALTIES[risk] || 0

  const raw = position_score + network_score + party_score + lhkpn_score + corruption_adj
  const total = Math.max(0, Math.min(100, raw))

  // Get current position title
  const currentTitle = currentPos?.title || '-'

  return {
    id: person.id,
    name: person.name,
    position_title: currentTitle,
    position_score: Math.round(position_score * 10) / 10,
    network_score:  Math.round(network_score * 10) / 10,
    party_score:    Math.round(party_score * 10) / 10,
    lhkpn_score:    Math.round(lhkpn_score * 10) / 10,
    corruption_adj,
    total:          Math.round(total * 10) / 10,
    tier: person.tier,
    party_id: person.party_id,
    region_id: person.region_id,
    corruption_risk: risk,
    photo_placeholder: person.photo_placeholder,
  }
}

export function scoreAllPersons() {
  return PERSONS
    .map(p => scoreIndividu(p, CONNECTIONS))
    .sort((a, b) => b.total - a.total)
}

// ─── PARTY SCORE (0–100) ─────────────────────────────────────────────────────

/**
 * Party score components:
 *   seat_score       (0–40): seats_2024 / 580 * 40
 *   executive_score  (0–30): president=30pts, VP=20pts, Menko=4pts, Menteri=2pts
 *   governor_score   (0–20): provinces governed / 38 * 20
 *   coalition_bonus  (0–10): KIM Plus = 10
 *   corruption_load  (-20–0): KPK cases per party
 *   total            (0–100)
 */
export function scoreParty(party, allPersons, allProvinces) {
  const members = allPersons.filter(p => p.party_id === party.id)

  // Seat score
  const seat_score = (party.seats_2024 / 580) * 40

  // Executive score
  let executive_score = 0
  members.forEach(p => {
    const cur = p.positions?.find(pos => pos.is_current)
    if (!cur) return
    if (cur.title.includes('Presiden RI')) executive_score += 30
    else if (cur.title.includes('Wakil Presiden')) executive_score += 20
    else if (cur.title.includes('Menko')) executive_score += 4
    else if (cur.title.includes('Menteri') || cur.title.includes('Kepala')) executive_score += 2
  })
  executive_score = Math.min(30, executive_score)

  // Governor score
  const provinces_held = (allProvinces || []).filter(prov => prov.party_id === party.id).length
  const governor_score = (provinces_held / 38) * 20

  // Coalition bonus
  const coalition_bonus = KIM_PLUS.includes(party.id) ? 10 : 0

  // Corruption load
  const corrupt_count = members.filter(p =>
    ['tersangka', 'terpidana', 'tinggi'].includes(p.analysis?.corruption_risk)
  ).length
  const corruption_load = -Math.min(20, corrupt_count * 5)

  const raw = seat_score + executive_score + governor_score + coalition_bonus + corruption_load
  const total = Math.max(0, Math.min(100, raw))

  return {
    id: party.id,
    abbr: party.abbr,
    name: party.name,
    color: party.color,
    logo_emoji: party.logo_emoji,
    seat_score:       Math.round(seat_score * 10) / 10,
    executive_score:  Math.round(executive_score * 10) / 10,
    governor_score:   Math.round(governor_score * 10) / 10,
    coalition_bonus,
    corruption_load,
    total:            Math.round(total * 10) / 10,
    provinces_held,
    seats: party.seats_2024,
    members_count: members.length,
  }
}

export function scoreAllParties(allPersons, allProvinces) {
  return PARTIES
    .map(p => scoreParty(p, allPersons, allProvinces))
    .sort((a, b) => b.total - a.total)
}

// ─── PROVINCE GOVERNANCE SCORE (0–100) ──────────────────────────────────────

/**
 * Province score components:
 *   integrity_score  (0–40): governor's corruption_risk
 *   stability_score  (0–30): KIM Plus alignment
 *   density_score    (0–10): placeholder (5)
 *   total            (0–100)
 */
export function scoreProvince(province, allPersons, gdpData) {
  // Governor integrity
  const gov = allPersons.find(p => p.id === province.governor_id)
  const govRisk = gov?.analysis?.corruption_risk || 'rendah'
  const integrity_map = { rendah: 40, sedang: 25, tinggi: 10, tersangka: 0, terpidana: 0 }
  const integrity_score = integrity_map[govRisk] ?? 20

  // Political stability
  const in_coalition = KIM_PLUS.includes(province.party_id)
  const is_pdip = province.party_id === 'pdip'
  const stability_score = in_coalition ? 30 : (is_pdip ? 10 : 15)

  // GDP data
  const gdp = gdpData?.[province.id]
  const gdp_growth = gdp?.growth_2023 ?? null
  const pdrb_per_kapita = gdp?.pdrb_per_kapita_2023 ?? null
  const sector = gdp?.sector ?? null

  // Density (placeholder)
  const density_score = 5

  const raw = integrity_score + stability_score + density_score
  const total = Math.max(0, Math.min(100, raw))

  return {
    id: province.id,
    name: province.name,
    island: province.island,
    party_id: province.party_id,
    governor: province.gubernur,
    governor_id: province.governor_id,
    integrity_score,
    stability_score,
    density_score,
    total,
    gdp_growth,
    pdrb_per_kapita,
    sector,
    gov_corruption_risk: govRisk,
    is_kim_plus: KIM_PLUS.includes(province.party_id),
    pop: province.pop,
  }
}

export function scoreAllProvincesFromData(allProvinces, allPersons, gdpData) {
  return allProvinces
    .map(prov => scoreProvince(prov, allPersons, gdpData))
    .sort((a, b) => b.total - a.total)
}

// ─── MATHEMATICAL CORRELATION ────────────────────────────────────────────────

/**
 * Pearson correlation coefficient
 * r = Σ((xi - x̄)(yi - ȳ)) / sqrt(Σ(xi-x̄)² · Σ(yi-ȳ)²)
 */
export function pearsonR(xs, ys) {
  const n = xs.length
  if (n < 3) return null
  const meanX = xs.reduce((a, b) => a + b, 0) / n
  const meanY = ys.reduce((a, b) => a + b, 0) / n
  let num = 0, denomX = 0, denomY = 0
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - meanX
    const dy = ys[i] - meanY
    num    += dx * dy
    denomX += dx * dx
    denomY += dy * dy
  }
  return denomX === 0 || denomY === 0 ? 0 : num / Math.sqrt(denomX * denomY)
}

/**
 * Simple linear regression: y = a + bx
 */
export function linearRegression(xs, ys) {
  const n = xs.length
  const meanX = xs.reduce((a, b) => a + b, 0) / n
  const meanY = ys.reduce((a, b) => a + b, 0) / n
  let num = 0, denom = 0
  for (let i = 0; i < n; i++) {
    num   += (xs[i] - meanX) * (ys[i] - meanY)
    denom += (xs[i] - meanX) ** 2
  }
  const slope = denom === 0 ? 0 : num / denom
  const intercept = meanY - slope * meanX
  const predicted = xs.map(x => slope * x + intercept)
  const r = pearsonR(xs, ys)
  return { slope, intercept, r2: r !== null ? r * r : 0, predicted, meanX, meanY }
}

/**
 * Spearman rank correlation
 */
export function spearmanR(xs, ys) {
  const n = xs.length
  const rankOf = arr => {
    const sorted = [...arr].map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v)
    const ranks = new Array(n)
    sorted.forEach((item, rank) => { ranks[item.i] = rank + 1 })
    return ranks
  }
  const rx = rankOf(xs)
  const ry = rankOf(ys)
  const d2sum = rx.reduce((sum, r, i) => sum + (r - ry[i]) ** 2, 0)
  return 1 - (6 * d2sum) / (n * (n * n - 1))
}

/**
 * Interpret correlation strength
 */
export function interpretR(r) {
  const abs = Math.abs(r)
  if (abs >= 0.7) return { label: r > 0 ? 'Korelasi Positif Kuat' : 'Korelasi Negatif Kuat',    strength: 'kuat',   color: '#22c55e' }
  if (abs >= 0.4) return { label: r > 0 ? 'Korelasi Positif Sedang' : 'Korelasi Negatif Sedang', strength: 'sedang', color: '#f59e0b' }
  if (abs >= 0.2) return { label: r > 0 ? 'Korelasi Positif Lemah' : 'Korelasi Negatif Lemah',   strength: 'lemah',  color: '#f97316' }
  return { label: 'Tidak Ada Korelasi Signifikan', strength: 'none', color: '#6b7280' }
}

/**
 * Descriptive statistics
 */
export function descStats(arr) {
  const n = arr.length
  if (n === 0) return { n: 0, mean: 0, min: 0, max: 0, median: 0, std: 0, variance: 0 }
  const mean = arr.reduce((a, b) => a + b, 0) / n
  const sorted = [...arr].sort((a, b) => a - b)
  const variance = arr.reduce((sum, x) => sum + (x - mean) ** 2, 0) / n
  const std = Math.sqrt(variance)
  return {
    n,
    mean:     Math.round(mean * 100) / 100,
    min:      sorted[0],
    max:      sorted[n - 1],
    median:   n % 2 === 0
                ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
                : sorted[Math.floor(n / 2)],
    std:      Math.round(std * 100) / 100,
    variance: Math.round(variance * 100) / 100,
  }
}
