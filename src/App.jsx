import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'
import PersonList from './pages/persons/PersonList'
import PersonDetail from './pages/persons/PersonDetail'
import PartyList from './pages/parties/PartyList'
import PartyDetail from './pages/parties/PartyDetail'
import NetworkPage from './pages/network/NetworkPage'
import RegionView from './pages/regions/RegionView'
import Elections from './pages/elections/Elections'
import LHKPNTracker from './pages/lhkpn/LHKPNTracker'
import NewsFeed from './pages/news/NewsFeed'
import AgendaTracker from './pages/agendas/AgendaTracker'
import OrmasList from './pages/ormas/OrmasList'
import AnalitikPage from './pages/analitik/AnalitikPage'
import DynastyMapper from './pages/dynasty/DynastyMapper'

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? <Layout>{children}</Layout> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/persons" element={<ProtectedRoute><PersonList /></ProtectedRoute>} />
      <Route path="/persons/:id" element={<ProtectedRoute><PersonDetail /></ProtectedRoute>} />
      <Route path="/parties" element={<ProtectedRoute><PartyList /></ProtectedRoute>} />
      <Route path="/parties/:id" element={<ProtectedRoute><PartyDetail /></ProtectedRoute>} />
      <Route path="/network" element={<ProtectedRoute><NetworkPage /></ProtectedRoute>} />
      <Route path="/regions" element={<ProtectedRoute><RegionView /></ProtectedRoute>} />
      <Route path="/elections" element={<ProtectedRoute><Elections /></ProtectedRoute>} />
      <Route path="/lhkpn" element={<ProtectedRoute><LHKPNTracker /></ProtectedRoute>} />
      <Route path="/news" element={<ProtectedRoute><NewsFeed /></ProtectedRoute>} />
      <Route path="/agendas" element={<ProtectedRoute><AgendaTracker /></ProtectedRoute>} />
      <Route path="/ormas" element={<ProtectedRoute><OrmasList /></ProtectedRoute>} />
      <Route path="/analitik" element={<ProtectedRoute><AnalitikPage /></ProtectedRoute>} />
      <Route path="/dynasty" element={<ProtectedRoute><DynastyMapper /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
