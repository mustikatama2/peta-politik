import { useNavigate } from 'react-router-dom'
import { Avatar, Badge, formatIDR, RiskDot } from './ui'
import { PARTY_MAP } from '../data/parties'
import { motion } from 'framer-motion'

export default function PersonCard({ person }) {
  const navigate = useNavigate()
  const party = person.party_id ? PARTY_MAP[person.party_id] : null
  const currentPos = person.positions?.find(p => p.is_current)

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="bg-bg-card rounded-xl border border-border hover:border-gray-600 cursor-pointer transition-colors group overflow-hidden"
      style={party ? { borderLeftColor: party.color, borderLeftWidth: 3 } : {}}
      onClick={() => navigate(`/persons/${person.id}`)}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Avatar
            name={person.name}
            photoUrl={person.photo_url}
            color={party?.color}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-text-primary group-hover:text-white truncate">
                  {person.name}
                </h3>
                {currentPos && (
                  <p className="text-xs text-text-secondary truncate mt-0.5">{currentPos.title}</p>
                )}
              </div>
              <RiskDot risk={person.analysis?.corruption_risk} />
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {party && (
            <Badge color={party.color}>{party.abbr}</Badge>
          )}
          {person.tier === 'nasional' && (
            <Badge variant="role">Nasional</Badge>
          )}
          {person.region_id === 'jawa-timur' && (
            <Badge variant="role">Jatim</Badge>
          )}
          {person.tags?.slice(0, 2).map(tag => (
            <Badge key={tag} variant="default">#{tag}</Badge>
          ))}
        </div>

        {person.lhkpn_latest && (
          <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
            <span className="text-xs text-text-secondary">LHKPN</span>
            <span className="text-xs font-medium text-accent-gold">{formatIDR(person.lhkpn_latest)}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
