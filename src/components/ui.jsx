import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// ── Button ───────────────────────────────────────────────────────────────────
export function Btn({ variant = 'primary', className = '', children, 'aria-label': ariaLabel, ...props }) {
  const base = 'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-bg-card min-h-[44px] md:min-h-0'
  const variants = {
    primary:   'bg-accent-red hover:opacity-90 text-white focus:ring-accent-red',
    secondary: 'border border-border text-text-secondary hover:text-text-primary hover:bg-bg-hover bg-transparent focus:ring-border',
    ghost:     'text-text-secondary hover:text-text-primary hover:bg-bg-hover bg-transparent focus:ring-border',
    danger:    'bg-red-100 hover:bg-red-200 text-red-700 border border-red-200 focus:ring-red-500',
  }
  return (
    <button
      role="button"
      aria-label={ariaLabel}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

// ── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className = '', colorLeft, ...props }) {
  return (
    <div
      className={`bg-bg-card rounded-xl border border-border ${colorLeft ? 'border-l-4' : ''} ${className}`}
      style={colorLeft ? { borderLeftColor: colorLeft } : {}}
      {...props}
    >
      {children}
    </div>
  )
}

// ── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({ variant = 'default', color, children, className = '' }) {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
  if (color) {
    return (
      <span
        className={`${base} ${className}`}
        style={{ backgroundColor: color + '22', color: color, border: `1px solid ${color}44` }}
      >
        {children}
      </span>
    )
  }
  const variants = {
    default:         'bg-bg-elevated text-text-secondary border border-border',
    role:            'bg-blue-50 text-blue-700 border border-blue-200',
    'status-janji':  'status-janji',
    'status-proses': 'status-proses',
    'status-selesai':'status-selesai',
    'status-ingkar': 'status-ingkar animate-pulse-slow',
    'status-batal':  'status-batal',
    'risk-rendah':   'risk-rendah',
    'risk-sedang':   'risk-sedang',
    'risk-tinggi':   'risk-tinggi',
    'risk-tersangka':'risk-tersangka',
    'risk-terpidana':'risk-terpidana animate-pulse-slow',
  }
  return (
    <span className={`${base} ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  )
}

// ── KPICard ───────────────────────────────────────────────────────────────────
export function KPICard({ label, value, sub, icon, trend, color }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-bold text-text-primary" style={color ? { color } : {}}>{value}</p>
          {sub && <p className="text-xs text-text-secondary mt-1">{sub}</p>}
        </div>
        {icon && (
          <span className="text-2xl opacity-70">{icon}</span>
        )}
      </div>
      {trend && (
        <p className={`text-xs mt-2 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </p>
      )}
    </Card>
  )
}

// ── SearchBar ─────────────────────────────────────────────────────────────────
export function SearchBar({ value, onChange, placeholder = 'Cari...', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-bg-elevated border border-border rounded-lg pl-10 pr-4 py-2.5 text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-accent-red transition-colors"
      />
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, className = '', 'aria-label': ariaLabel }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel || title}
            className={`relative bg-bg-card border border-border rounded-2xl shadow-modal w-full max-w-lg max-h-[90vh] overflow-y-auto ${className}`}
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          >
            {title && (
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
                <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-xl" aria-label="Tutup modal">×</button>
              </div>
            )}
            <div className="p-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Avatar ────────────────────────────────────────────────────────────────────
export function Avatar({ name, photoUrl, color, size = 'md', className = '' }) {
  const initials = name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-16 h-16 text-xl', xl: 'w-24 h-24 text-3xl' }
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${className}`}
      style={{ backgroundColor: color || '#374151' }}
    >
      {photoUrl ? (
        <img src={photoUrl} alt={name} className="w-full h-full rounded-full object-cover" />
      ) : initials}
    </div>
  )
}

// ── PageHeader ────────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, actions, className = '' }) {
  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 ${className}`}>
      <div>
        <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
        {subtitle && <p className="text-text-secondary mt-1 text-sm">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange, className = '' }) {
  return (
    <div className={`flex gap-1 border-b border-border ${className}`}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
            active === tab.id
              ? 'border-accent-red text-accent-red'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

// ── Toast ─────────────────────────────────────────────────────────────────────
let _setToasts = null

export function ToastContainer() {
  const [toasts, setToasts] = useState([])
  _setToasts = setToasts

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 80 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium max-w-xs bg-bg-card border-border text-text-primary ${
              t.type === 'error'   ? 'border-l-4 !border-l-red-500'    :
              t.type === 'success' ? 'border-l-4 !border-l-green-500'  :
              t.type === 'warning' ? 'border-l-4 !border-l-yellow-400' :
              t.type === 'info'    ? 'border-l-4 !border-l-blue-400'   : ''
            }`}
          >
            <span>{
              t.type === 'error'   ? '❌' :
              t.type === 'success' ? '✅' :
              t.type === 'warning' ? '⚠️' :
              'ℹ️'
            }</span>
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function toast(message, type = 'info') {
  if (!_setToasts) return
  const id = Date.now()
  _setToasts(prev => [...prev, { id, message, type }])
  setTimeout(() => _setToasts(prev => prev.filter(t => t.id !== id)), 3000)
}

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className={`${sizes[size]} border-2 border-border border-t-accent-red rounded-full animate-spin ${className}`} />
  )
}

// ── EmptyState ────────────────────────────────────────────────────────────────
export function EmptyState({ icon = '🔍', title = 'Tidak ada data', message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4 opacity-60">{icon}</div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      {message && <p className="text-text-secondary text-sm mb-6 max-w-xs">{message}</p>}
      {action}
    </div>
  )
}

// ── Select ────────────────────────────────────────────────────────────────────
export function Select({ value, onChange, options, className = '', placeholder = 'Pilih...' }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`bg-bg-elevated border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-red ${className}`}
    >
      <option value="">{placeholder}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}

// ── Tag chip ──────────────────────────────────────────────────────────────────
export function Tag({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs bg-bg-elevated text-text-secondary border border-border ${className}`}>
      {children}
    </span>
  )
}

// ── Risk indicator ────────────────────────────────────────────────────────────
export function RiskDot({ risk }) {
  const dots = {
    rendah:    { color: '#10B981', label: 'Rendah' },
    sedang:    { color: '#F59E0B', label: 'Sedang' },
    tinggi:    { color: '#EF4444', label: 'Tinggi' },
    tersangka: { color: '#DC2626', label: 'Tersangka' },
    terpidana: { color: '#7F1D1D', label: 'Terpidana' },
  }
  const cfg = dots[risk] || dots.rendah
  return (
    <span className="flex items-center gap-1.5 text-xs" title={`Risiko Korupsi: ${cfg.label}`}>
      <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: cfg.color }} />
      <span style={{ color: cfg.color }}>{cfg.label}</span>
    </span>
  )
}

// ── Breadcrumb ────────────────────────────────────────────────────────────────
export function Breadcrumb({ items }) {
  // items = [{ label, to? }]
  return (
    <nav className="flex items-center gap-1.5 text-xs text-text-secondary mb-4 flex-wrap">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="opacity-40">/</span>}
          {item.to
            ? <Link to={item.to} className="hover:text-text-primary transition-colors">{item.label}</Link>
            : <span className="text-text-primary">{item.label}</span>
          }
        </span>
      ))}
    </nav>
  )
}

// ── Format IDR ────────────────────────────────────────────────────────────────
export function formatIDR(amount) {
  if (!amount) return 'Tidak tersedia'
  if (amount >= 1_000_000_000_000) return `Rp ${(amount / 1_000_000_000_000).toFixed(1)} T`
  if (amount >= 1_000_000_000) return `Rp ${(amount / 1_000_000_000).toFixed(0)} M`
  if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(0)} Jt`
  return `Rp ${amount.toLocaleString('id-ID')}`
}

// ── SkeletonCard ──────────────────────────────────────────────────────────────
export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="bg-bg-card border border-border rounded-lg p-4 animate-pulse">
      <div className="h-4 bg-bg-elevated rounded w-3/4 mb-3" />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-3 bg-bg-elevated rounded mb-2 ${i === lines - 1 ? 'w-1/2' : 'w-full'}`}
        />
      ))}
    </div>
  )
}

// ── Table ─────────────────────────────────────────────────────────────────────
export function Table({ children, label = 'Tabel data', className = '' }) {
  return (
    <div role="region" aria-label={label} className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm text-left">
        {children}
      </table>
    </div>
  )
}
