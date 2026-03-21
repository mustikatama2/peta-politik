import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { to: '/',         label: 'Dashboard',         icon: '🏠' },
  { to: '/persons',  label: 'Tokoh',             icon: '👥' },
  { to: '/parties',  label: 'Partai',            icon: '🎭' },
  { to: '/network',  label: 'Jaringan Politik',  icon: '🕸️' },
  { to: '/regions',  label: 'Peta Wilayah',      icon: '🗺️' },
  { to: '/elections',label: 'Pemilu',            icon: '📊' },
  { to: '/lhkpn',   label: 'LHKPN',             icon: '💰' },
  { to: '/news',     label: 'Berita',            icon: '📰' },
  { to: '/agendas',  label: 'Agenda & Janji',    icon: '📋' },
  { to: '/ormas',    label: 'Ormas & Agama',     icon: '🏛️' },
]

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border/50">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🗺️</span>
          <div>
            <h1 className="text-base font-bold text-text-primary">PetaPolitik</h1>
            <p className="text-[10px] text-text-secondary leading-none">Platform Intelijen Politik Indonesia</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        {NAV_LINKS.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? 'bg-accent-red/10 text-accent-red border-l-2 border-accent-red pl-2.5 font-medium'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
              }`
            }
          >
            <span className="text-base">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-border/50 text-xs text-text-secondary">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-accent-red/20 flex items-center justify-center text-accent-red text-xs font-bold">A</div>
          <div>
            <p className="text-text-primary text-xs font-medium">Admin</p>
            <p className="text-[10px]">Analis Politik</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors"
        >
          <span>🚪</span> Keluar
        </button>
      </div>
    </>
  )

  return (
    <div className="flex h-screen bg-bg-app text-text-primary overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-bg-sidebar border-r border-border flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              className="fixed left-0 top-0 h-full z-50 w-64 flex flex-col bg-bg-sidebar border-r border-border lg:hidden"
              initial={{ x: -256 }} animate={{ x: 0 }} exit={{ x: -256 }}
              transition={{ type: 'tween', duration: 0.2 }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 bg-bg-sidebar border-b border-border flex items-center justify-between px-4 flex-shrink-0">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-bg-elevated text-text-secondary"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-red-900/20 border border-red-800/40 rounded-full text-xs text-red-400">
              Indonesia 🇮🇩
            </span>
            <span className="text-xs text-text-secondary hidden sm:block">
              {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <div className="w-8 h-8 rounded-full bg-accent-red/20 flex items-center justify-center text-accent-red text-xs font-bold">A</div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 max-w-screen-2xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
