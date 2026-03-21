import { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
import { ToastContainer } from './ui'
import GlobalSearch from './GlobalSearch'
import Footer from './Footer'
import { PERSONS } from '../data/persons'
import { CONNECTIONS } from '../data/connections'

const NAV = [
  { to:'/',         icon:'🏠', label:'Dashboard' },
  { to:'/ranking',  icon:'🏆', label:'Power Rankings' },
  { to:'/kabinet',  icon:'🏛️', label:'Kabinet Merah Putih' },
  { to:'/pemerintah', icon:'🏛️', label:'Pemerintahan' },
  { to:'/anggaran', icon:'💰', label:'Efisiensi APBN 2025' },
  { to:'/persons',  icon:'👥', label:'Tokoh' },
  { to:'/compare',  icon:'⚖️', label:'Bandingkan' },
  { to:'/parties',  icon:'🎭', label:'Partai' },
  { to:'/network',  icon:'🕸️', label:'Jaringan' },
  { to:'/regions',  icon:'🗺️', label:'Wilayah' },
  { to:'/elections',icon:'📊', label:'Pemilu' },
  { to:'/dapil',    icon:'🗳️', label:'Peta Dapil' },
  { to:'/koalisi',  icon:'🤝', label:'Sejarah Koalisi' },
  { to:'/survei',   icon:'📉', label:'Survei & Polling' },
  { to:'/analitik', icon:'📈', label:'Analitik' },
  { to:'/risk',     icon:'🚨', label:'Indeks Risiko' },
  { to:'/scenarios',icon:'🔮', label:'Skenario 2029' },
  { to:'/dynasty',  icon:'🌳', label:'Dinasti' },
  { to:'/timeline', icon:'📅', label:'Linimasa' },
  { to:'/voting',   icon:'🗳️', label:'Rekam Jejak Voting' },
  { to:'/kpk',      icon:'⚖️', label:'KPK Cases' },
  { to:'/investigasi', icon:'🔍', label:'Investigasi' },
  { to:'/coi',      icon:'🔍', label:'Konflik Kepentingan' },
  { to:'/media',    icon:'📡', label:'Kepemilikan Media' },
  { to:'/bisnis',   icon:'🏢', label:'Kepemilikan Bisnis' },
  { to:'/lhkpn',   icon:'💰', label:'LHKPN' },
  { to:'/news',     icon:'📰', label:'Berita' },
  { to:'/agendas',  icon:'📋', label:'Agenda' },
  { to:'/ormas',    icon:'🏛️', label:'Ormas' },
  { to:'/indikator',icon:'📊', label:'Indikator' },
]

// Bottom nav: 5 most important tabs for mobile
const MOBILE_NAV = [
  { to:'/',        icon:'🏠', label:'Beranda' },
  { to:'/persons', icon:'👥', label:'Tokoh' },
  { to:'/network', icon:'🕸️', label:'Jaringan' },
  { to:'/news',    icon:'📰', label:'Berita' },
]

// Remaining nav items shown in the "Lainnya" slide-up drawer
const NAV_LAINNYA = NAV.filter(n =>
  !['/', '/persons', '/network', '/news'].includes(n.to)
)

function BackToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  if (!visible) return null
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-20 right-4 z-50 w-10 h-10 rounded-full bg-accent-red text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform md:bottom-6"
      aria-label="Back to top"
    >
      ↑
    </button>
  )
}

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const { logout, user } = useAuth()
  const { toggleTheme, isDark } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  // Breadcrumb
  const pageLabel = NAV.find(n =>
    n.to !== '/' ? location.pathname.startsWith(n.to) : location.pathname === '/'
  )?.label || 'PetaPolitik'

  return (
    <div className="flex h-screen overflow-hidden bg-bg-app">
      {/* ── Desktop Sidebar ── */}
      <aside
        className="hidden md:flex flex-col flex-shrink-0 bg-bg-sidebar transition-all duration-300 overflow-hidden"
        style={{ width: collapsed ? 64 : 256 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
          <span className="text-2xl flex-shrink-0">🗺️</span>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-white leading-tight">PetaPolitik</h1>
              <p className="text-[10px] text-white/40 leading-none truncate">Intelijen Politik Indonesia</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5">
          {NAV.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              title={collapsed ? link.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group relative ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold border-l-2 border-red-500'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <span className="text-base flex-shrink-0">{link.icon}</span>
              {!collapsed && <span className="truncate">{link.label}</span>}
              {/* Tooltip when collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                  {link.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar footer — data info */}
        {!collapsed && (
          <div className="px-4 py-3 border-t border-white/5">
            <p className="text-xs text-white/30">PetaPolitik v1.0</p>
            <p className="text-xs text-white/30">Data: Maret 2026</p>
            <p className="text-xs text-white/30">{PERSONS.length} tokoh · {CONNECTIONS.length} koneksi</p>
            <a
              href="https://github.com/mustikatama2/peta-politik"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-red-400 hover:underline mt-1 block"
            >
              GitHub →
            </a>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 border-t border-white/5 space-y-1">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 text-xs transition-all"
          >
            <span className="text-base flex-shrink-0">{collapsed ? '→' : '←'}</span>
            {!collapsed && <span>Kecilkan</span>}
          </button>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-900/20 text-xs transition-all"
          >
            <span className="text-base flex-shrink-0">🚪</span>
            {!collapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="flex-shrink-0 h-14 flex items-center justify-between px-4 bg-bg-card border-b border-border shadow-sm">
          {/* Left: mobile menu + breadcrumb */}
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              className="md:hidden text-xl p-1 text-text-primary"
              onClick={() => setMobileOpen(!mobileOpen)}
            >☰</button>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-text-muted hidden sm:block">PetaPolitik</span>
              <span className="text-text-muted hidden sm:block">/</span>
              <span className="text-text-primary font-medium">{pageLabel}</span>
            </div>
          </div>

          {/* Right: search pill + theme + avatar */}
          <div className="flex items-center gap-2">
            {/* CPI badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs text-orange-700">
              <span>⚠️</span>
              <span>CPI 34/100</span>
            </div>

            {/* Global Search */}
            <GlobalSearch />

            {/* Pencarian link — full search results page */}
            <Link
              to="/pencarian"
              title="Halaman Pencarian Lengkap"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-bg-elevated hover:bg-bg-hover hover:border-accent-red text-text-secondary hover:text-accent-red text-xs font-medium transition-all"
            >
              🔎 <span>Pencarian</span>
            </Link>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg border border-border bg-bg-elevated hover:bg-bg-hover flex items-center justify-center text-base transition-all"
              title={isDark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* User avatar */}
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Mobile slide-out */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                className="fixed left-0 top-0 bottom-0 w-64 bg-bg-sidebar z-50 md:hidden flex flex-col"
                initial={{ x: -256 }} animate={{ x: 0 }} exit={{ x: -256 }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              >
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🗺️</span>
                    <span className="text-white font-bold text-sm">PetaPolitik</span>
                  </div>
                  <button onClick={() => setMobileOpen(false)} className="text-white/50 text-xl">×</button>
                </div>
                <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5">
                  {NAV.map(link => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.to === '/'}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                          isActive
                            ? 'bg-white/10 text-white border-l-2 border-red-500'
                            : 'text-white/50 hover:text-white hover:bg-white/5'
                        }`
                      }
                    >
                      <span>{link.icon}</span>{link.label}
                    </NavLink>
                  ))}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 animate-fade-in">
          {children}
          <Footer />
        </main>
      </div>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className="mobile-nav justify-around">
        {MOBILE_NAV.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-2 min-h-[44px] justify-center rounded-lg transition-all ${
                isActive
                  ? 'text-red-400 border-t-2 border-red-400'
                  : 'text-white/40 border-t-2 border-transparent'
              }`
            }
          >
            <span className="text-xl">{link.icon}</span>
            <span className="text-[10px]">{link.label}</span>
          </NavLink>
        ))}

        {/* ── Lainnya tab ── */}
        <button
          onClick={() => setMoreOpen(true)}
          className={`flex flex-col items-center gap-0.5 px-3 py-2 min-h-[44px] justify-center rounded-lg transition-all border-t-2 ${
            moreOpen ? 'text-red-400 border-red-400' : 'text-white/40 border-transparent'
          }`}
        >
          <span className="text-xl">☰</span>
          <span className="text-[10px]">Lainnya</span>
        </button>
      </nav>

      {/* ── Lainnya Slide-up Drawer ── */}
      <AnimatePresence>
        {moreOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMoreOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-bg-sidebar rounded-t-2xl"
              style={{ maxHeight: '75vh' }}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
                <span className="text-white font-semibold text-sm">Menu Lainnya</span>
                <button onClick={() => setMoreOpen(false)} className="text-white/50 text-xl p-1">×</button>
              </div>
              <div className="overflow-y-auto pb-6" style={{ maxHeight: 'calc(75vh - 80px)' }}>
                <div className="grid grid-cols-2 gap-1 p-3">
                  {NAV_LAINNYA.map(link => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.to === '/'}
                      onClick={() => setMoreOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
                          isActive
                            ? 'bg-white/10 text-white border-l-2 border-red-500'
                            : 'text-white/50 hover:text-white hover:bg-white/5'
                        }`
                      }
                    >
                      <span className="text-base flex-shrink-0">{link.icon}</span>
                      <span className="truncate text-xs">{link.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BackToTop />
      <ToastContainer />
    </div>
  )
}
