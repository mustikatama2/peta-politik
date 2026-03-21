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
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#0A0E1A' }}
    >
      <div className="w-full max-w-sm">
        {/* Card */}
        <div
          className={`bg-bg-card border border-border rounded-2xl p-8 shadow-2xl ${shaking ? 'shake' : ''}`}
        >
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🗺️</div>
            <h1 className="text-2xl font-bold text-text-primary">PetaPolitik</h1>
            <p className="text-text-secondary text-sm mt-1">Platform Intelijen Politik Indonesia</p>
          </div>

          {/* Restricted access badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20">
              🔒 Akses Terbatas
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1.5 font-medium">
                Kata Sandi
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false) }}
                placeholder="Masukkan kata sandi..."
                className="pp-input"
                autoFocus
              />
              {error && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠️</span> Kata sandi salah
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-accent-red hover:bg-red-700 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
            >
              Masuk
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-text-secondary text-xs mt-6">
          Transparansi & Akuntabilitas untuk Rakyat Indonesia 🇮🇩
        </p>
      </div>
    </div>
  )
}
