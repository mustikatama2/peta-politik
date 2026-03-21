import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'

// Lazy load all other pages
const PersonList     = lazy(() => import('./pages/persons/PersonList'))
const PersonDetail   = lazy(() => import('./pages/persons/PersonDetail'))
const PartyList      = lazy(() => import('./pages/parties/PartyList'))
const PartyDetail    = lazy(() => import('./pages/parties/PartyDetail'))
const NetworkPage    = lazy(() => import('./pages/network/NetworkPage'))
const RegionView     = lazy(() => import('./pages/regions/RegionView'))
const Elections      = lazy(() => import('./pages/elections/Elections'))
const LHKPNTracker   = lazy(() => import('./pages/lhkpn/LHKPNTracker'))
const NewsFeed       = lazy(() => import('./pages/news/NewsFeed'))
const AgendaTracker  = lazy(() => import('./pages/agendas/AgendaTracker'))
const OrmasList      = lazy(() => import('./pages/ormas/OrmasList'))
const AnalitikPage   = lazy(() => import('./pages/analitik/AnalitikPage'))
const KPKCases       = lazy(() => import('./pages/kpk/KPKCases'))
const MediaOwnership = lazy(() => import('./pages/media/MediaOwnership'))
const DynastyMapper  = lazy(() => import('./pages/dynasty/DynastyMapper'))
const Timeline       = lazy(() => import('./pages/timeline/Timeline'))

// Loading fallback
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-accent-red border-t-transparent rounded-full animate-spin" />
        <p className="text-text-secondary text-sm">Memuat...</p>
      </div>
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? <Layout>{children}</Layout> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/persons" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><PersonList /></Suspense></ProtectedRoute>} />
        <Route path="/persons/:id" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><PersonDetail /></Suspense></ProtectedRoute>} />
        <Route path="/parties" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><PartyList /></Suspense></ProtectedRoute>} />
        <Route path="/parties/:id" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><PartyDetail /></Suspense></ProtectedRoute>} />
        <Route path="/network" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><NetworkPage /></Suspense></ProtectedRoute>} />
        <Route path="/regions" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><RegionView /></Suspense></ProtectedRoute>} />
        <Route path="/elections" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><Elections /></Suspense></ProtectedRoute>} />
        <Route path="/lhkpn" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><LHKPNTracker /></Suspense></ProtectedRoute>} />
        <Route path="/news" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><NewsFeed /></Suspense></ProtectedRoute>} />
        <Route path="/agendas" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><AgendaTracker /></Suspense></ProtectedRoute>} />
        <Route path="/ormas" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><OrmasList /></Suspense></ProtectedRoute>} />
        <Route path="/analitik" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><AnalitikPage /></Suspense></ProtectedRoute>} />
        <Route path="/kpk" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><KPKCases /></Suspense></ProtectedRoute>} />
        <Route path="/media" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><MediaOwnership /></Suspense></ProtectedRoute>} />
        <Route path="/dynasty" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><DynastyMapper /></Suspense></ProtectedRoute>} />
        <Route path="/timeline" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><Timeline /></Suspense></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
