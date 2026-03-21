import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import ErrorBoundary from './components/ErrorBoundary'
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
        <Route path="/" element={<ProtectedRoute><ErrorBoundary><Dashboard /></ErrorBoundary></ProtectedRoute>} />
        <Route path="/persons" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><PersonList /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/persons/:id" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><PersonDetail /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/parties" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><PartyList /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/parties/:id" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><PartyDetail /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/network" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><NetworkPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/regions" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><RegionView /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/elections" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><Elections /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/lhkpn" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><LHKPNTracker /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/news" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><NewsFeed /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/agendas" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><AgendaTracker /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/ormas" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><OrmasList /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/analitik" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><AnalitikPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/kpk" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><KPKCases /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/media" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><MediaOwnership /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/dynasty" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><DynastyMapper /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/timeline" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><Timeline /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
