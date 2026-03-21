import { PARTY_MAP } from '../data/parties'

export default function PartyBadge({ partyId, className = '' }) {
  const party = PARTY_MAP[partyId]
  if (!party) return <span className={`text-xs text-text-secondary ${className}`}>Nonpartisan</span>

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={{ backgroundColor: party.color + '22', color: party.color, border: `1px solid ${party.color}44` }}
    >
      <span>{party.logo_emoji}</span>
      {party.abbr}
    </span>
  )
}
