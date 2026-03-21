import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Login() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const ok = login(password)
    if (ok) {
      navigate('/')
    } else {
      setError(true)
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel (hidden on mobile) ── */}
      <div className="hidden md:flex md:w-2/3 flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 p-12">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Glow effect */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-slate-600/30 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 text-center">
          <div className="text-7xl mb-6">🗺️</div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">PetaPolitik</h1>
          <p className="text-white/70 text-lg mb-2">Platform Intelijen Politik Indonesia</p>
          <p className="text-white/40 text-sm mb-10">Transparansi &amp; Akuntabilitas untuk Rakyat Indonesia</p>

          {/* Stats */}
          <div className="flex items-center gap-8 justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">88</p>
              <p className="text-white/50 text-xs mt-1">Tokoh</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-bold text-white">18</p>
              <p className="text-white/50 text-xs mt-1">Partai</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-bold text-white">55</p>
              <p className="text-white/50 text-xs mt-1">Koneksi</p>
            </div>
          </div>
        </div>

        {/* Indonesian flag accent */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <span className="text-white/30 text-xs tracking-widest uppercase">Indonesia 🇮🇩</span>
        </div>
      </div>

      {/* ── Right panel (login form) ── */}
      <div className="w-full md:w-1/3 flex items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo (hidden on desktop) */}
          <div className="md:hidden text-center mb-8">
            <div className="text-5xl mb-3">🗺️</div>
            <h1 className="text-2xl font-bold text-slate-900">PetaPolitik</h1>
            <p className="text-slate-500 text-sm mt-1">Platform Intelijen Politik Indonesia</p>
          </div>

          <div className={shaking ? 'shake' : ''}>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Masuk</h2>
            <p className="text-slate-500 text-sm mb-8">Masukkan kata sandi untuk melanjutkan</p>

            {/* Restricted badge */}
            <div className="flex items-center gap-2 mb-6 px-3 py-2 rounded-lg bg-red-50 border border-red-100">
              <span className="text-red-500">🔒</span>
              <span className="text-sm text-red-600 font-medium">Akses Terbatas</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Kata Sandi
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(false) }}
                  placeholder="Masukkan kata sandi..."
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                  autoFocus
                />
                {error && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span>⚠️</span> Kata sandi salah. Coba lagi.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors text-sm shadow-sm"
              >
                Masuk →
              </button>
            </form>

            <p className="text-center text-slate-400 text-xs mt-6">
              Lupa kata sandi? Hubungi admin
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
