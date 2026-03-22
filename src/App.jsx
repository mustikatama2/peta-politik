// Bundle audit R19:
// Before: main bundle 546KB (128KB gzip). Heavy: persons.js (~236KB raw), connections.js (~119KB raw), news.js (~55KB raw).
// Root cause: Dashboard was eagerly imported, pulling ALL its data deps into the main chunk.
// Fix applied: Dashboard → lazy(). Result: main bundle 389KB (86KB gzip), Dashboard 35KB (9KB gzip).
// Savings: ~157KB raw / ~42KB gzip off the main bundle (33% reduction).
// Further optimization: data files (persons, connections) are still shared across lazy chunks.
// Future TODO: move scoring computation to route-level workers to defer CPU cost.
import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import ErrorBoundary from './components/ErrorBoundary'
import Login from './pages/auth/Login'
import NotFound from './pages/NotFound'

// Lazy load all pages (including Dashboard — avoids pulling persons/connections into main bundle)
const Dashboard      = lazy(() => import('./pages/dashboard/Dashboard'))
// Lazy load all other pages
const PersonList     = lazy(() => import('./pages/persons/PersonList'))
const PersonDetail   = lazy(() => import('./pages/persons/PersonDetail'))
const PartyList      = lazy(() => import('./pages/parties/PartyList'))
const PartyDetail    = lazy(() => import('./pages/parties/PartyDetail'))
const NetworkPage    = lazy(() => import('./pages/network/NetworkPage'))
const PengaruhPage   = lazy(() => import('./pages/pengaruh/PengaruhPage'))
const RegionView     = lazy(() => import('./pages/regions/RegionView'))
const Elections      = lazy(() => import('./pages/elections/Elections'))
const LHKPNTracker   = lazy(() => import('./pages/lhkpn/LHKPNTracker'))
const NewsFeed       = lazy(() => import('./pages/news/NewsFeed'))
const AgendaTracker  = lazy(() => import('./pages/agendas/AgendaTracker'))
const OrmasList      = lazy(() => import('./pages/ormas/OrmasList'))
const MahasiswaPage  = lazy(() => import('./pages/mahasiswa/MahasiswaPage'))
const AnalitikPage   = lazy(() => import('./pages/analitik/AnalitikPage'))
const KPKCases       = lazy(() => import('./pages/kpk/KPKCases'))
const MediaOwnership = lazy(() => import('./pages/media/MediaOwnership'))
const DynastyMapper  = lazy(() => import('./pages/dynasty/DynastyMapper'))
const Timeline       = lazy(() => import('./pages/timeline/Timeline'))
const COIScanner     = lazy(() => import('./pages/coi/COIScanner'))
const ComparePage    = lazy(() => import('./pages/compare/ComparePage'))
const RiskIndex      = lazy(() => import('./pages/risk/RiskIndex'))
const ScenarioPage   = lazy(() => import('./pages/scenarios/ScenarioPage'))
const SimulatorPage  = lazy(() => import('./pages/simulator/SimulatorPage'))
const VotingPage     = lazy(() => import('./pages/voting/VotingPage'))
const HukumPage      = lazy(() => import('./pages/hukum/HukumPage'))
const BusinessPage   = lazy(() => import('./pages/business/BusinessPage'))
const KabinetPage    = lazy(() => import('./pages/kabinet/KabinetPage'))
const BudgetPage     = lazy(() => import('./pages/budget/BudgetPage'))
const SurveyPage     = lazy(() => import('./pages/surveys/SurveyPage'))
const RankingPage    = lazy(() => import('./pages/ranking/RankingPage'))
const CoalitionPage  = lazy(() => import('./pages/coalition/CoalitionPage'))
const PemerintahPage = lazy(() => import('./pages/pemerintah/PemerintahPage'))
const IndikatorPage  = lazy(() => import('./pages/indikator/IndikatorPage'))
const DapilPage      = lazy(() => import('./pages/dapil/DapilPage'))
const InvestigasiPage = lazy(() => import('./pages/investigasi/InvestigasiPage'))
const PencarianPage    = lazy(() => import('./pages/pencarian/PencarianPage'))
const PilkadaPage      = lazy(() => import('./pages/pilkada/PilkadaPage'))
const DanaKampanyePage = lazy(() => import('./pages/dana/DanaKampanyePage'))
const BUMNPage         = lazy(() => import('./pages/bumn/BUMNPage'))
const ArsipPage        = lazy(() => import('./pages/arsip/ArsipPage'))
const TentangPage      = lazy(() => import('./pages/tentang/TentangPage'))
const FramingPage      = lazy(() => import('./pages/framing/FramingPage'))
const MediaMonitorPage = lazy(() => import('./pages/MediaMonitorPage'))
const GlosariumPage    = lazy(() => import('./pages/glosarium/GlosariumPage'))
const FAQPage          = lazy(() => import('./pages/faq/FAQPage'))
const ScorecardPage    = lazy(() => import('./pages/scorecard/ScorecardPage'))
const QuickFactsPage   = lazy(() => import('./pages/quickfacts/QuickFactsPage'))
const BriefingPage     = lazy(() => import('./pages/briefing/BriefingPage'))
const APBNPage         = lazy(() => import('./pages/apbn/APBNPage'))
const PrediksiPage     = lazy(() => import('./pages/prediksi/PrediksiPage'))
const StatsPage        = lazy(() => import('./pages/stats/StatsPage'))
const EmbedPage        = lazy(() => import('./pages/EmbedPage'))

// Loading fallback — branded spinner + skeleton
function PageLoader() {
  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center gap-4">
      <div className="text-5xl mb-1 animate-bounce">🗺️</div>
      <div className="w-10 h-10 border-2 border-border border-t-accent-red rounded-full animate-spin" />
      <div className="text-center">
        <p className="text-text-primary font-semibold">PetaPolitik</p>
        <p className="text-text-secondary text-sm mt-0.5">Memuat PetaPolitik...</p>
      </div>
      <div className="mt-4 w-full max-w-lg px-6 space-y-3 animate-pulse">
        <div className="h-6 w-1/2 bg-bg-elevated rounded" />
        <div className="grid grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-bg-elevated rounded-xl" />)}
        </div>
        <div className="h-48 bg-bg-elevated rounded-xl" />
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
        <Route path="/" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><Dashboard /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/briefing" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><BriefingPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/ranking" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><RankingPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/persons" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><PersonList /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/persons/:id" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><PersonDetail /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/parties" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><PartyList /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/parties/:id" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><PartyDetail /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/network" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><NetworkPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/pengaruh" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><PengaruhPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/regions" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><RegionView /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/elections" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><Elections /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/dapil" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><DapilPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/dana-kampanye" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><DanaKampanyePage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/koalisi" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><CoalitionPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/survei" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><SurveyPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/lhkpn" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><LHKPNTracker /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/news" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><NewsFeed /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/agendas" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><AgendaTracker /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/ormas" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><OrmasList /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/mahasiswa" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><MahasiswaPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/analitik" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><AnalitikPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/kpk" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><KPKCases /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/investigasi" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><InvestigasiPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/media" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><MediaOwnership /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/media-monitor" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><MediaMonitorPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/framing" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><FramingPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/dynasty" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><DynastyMapper /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/timeline" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><Timeline /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/voting" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><VotingPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/hukum" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><HukumPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/coi" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><COIScanner /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/compare" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><ComparePage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/compare/:id1" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><ComparePage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/compare/:id1/:id2" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><ComparePage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/risk" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><RiskIndex /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/scorecard" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><ScorecardPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/scenarios" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><ScenarioPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/prediksi" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><PrediksiPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/simulator" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><SimulatorPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/bisnis" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><BusinessPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/bumn" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><BUMNPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/kabinet" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><KabinetPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/pemerintah" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><PemerintahPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/anggaran" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><BudgetPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/apbn" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><APBNPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/indikator" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><IndikatorPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/pencarian" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><PencarianPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/pilkada" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><PilkadaPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/tentang" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><TentangPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/glosarium" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><GlosariumPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/faq" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><FAQPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/arsip" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><ArsipPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/quick-facts" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><QuickFactsPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/embed" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><EmbedPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="/stats" element={<ProtectedRoute><ErrorBoundary><Suspense fallback={<PageLoader />}><StatsPage /></Suspense></ErrorBoundary></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
