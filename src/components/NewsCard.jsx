import { Badge } from './ui'
import { motion } from 'framer-motion'

const SENTIMENT_CONFIG = {
  positif: { label: '🟢 Positif', variant: 'status-selesai' },
  negatif: { label: '🔴 Negatif', variant: 'status-ingkar' },
  netral:  { label: '⚪ Netral',  variant: 'default' },
}

export default function NewsCard({ article }) {
  const sentiment = SENTIMENT_CONFIG[article.sentiment] || SENTIMENT_CONFIG.netral

  return (
    <motion.div
      whileHover={{ y: -1 }}
      className="bg-bg-card rounded-xl border border-border p-4 hover:border-gray-600 transition-colors"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <span className="font-medium text-accent-blue">{article.source}</span>
          <span>•</span>
          <span>{new Date(article.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
        <Badge variant={sentiment.variant}>{sentiment.label}</Badge>
      </div>

      <h3 className="text-sm font-semibold text-text-primary leading-snug mb-2">
        {article.headline}
      </h3>

      <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 mb-3">
        {article.summary}
      </p>

      {article.person_ids?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {article.person_ids.slice(0, 3).map(id => (
            <Badge key={id} variant="default">#{id}</Badge>
          ))}
        </div>
      )}
    </motion.div>
  )
}
