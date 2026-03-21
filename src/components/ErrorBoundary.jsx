import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null, errorInfo: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('PetaPolitik page error:', error, info)
    this.setState({ errorInfo: info })
  }

  render() {
    if (this.state.error) {
      const isDev = import.meta.env.DEV

      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center" role="alert" aria-live="assertive">
          <div className="max-w-md w-full bg-bg-card border border-border rounded-2xl p-8 shadow-lg">
            {/* Icon */}
            <div className="text-5xl mb-4">💥</div>

            {/* Title */}
            <h2 className="text-xl font-bold text-text-primary mb-2">Terjadi Kesalahan</h2>

            {/* Description */}
            <p className="text-text-secondary text-sm mb-6 leading-relaxed">
              Halaman ini mengalami error tak terduga. Coba klik "Coba Lagi" atau kembali ke beranda.
            </p>

            {/* Actions */}
            <div className="flex gap-3 justify-center flex-wrap mb-6">
              <button
                onClick={() => this.setState({ error: null, errorInfo: null })}
                className="px-5 py-2.5 rounded-lg bg-accent-red text-white text-sm font-semibold hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-red focus:ring-offset-2 focus:ring-offset-bg-card"
              >
                🔄 Coba Lagi
              </button>
              <button
                onClick={() => { window.location.href = '/' }}
                className="px-5 py-2.5 rounded-lg bg-bg-elevated border border-border text-text-primary text-sm hover:bg-bg-hover transition-colors focus:outline-none focus:ring-2 focus:ring-border"
              >
                🏠 Ke Beranda
              </button>
            </div>

            {/* Report link */}
            <p className="text-text-muted text-xs">
              Masalah berlanjut?{' '}
              <a
                href="https://github.com/mustikatama2/peta-politik/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-red hover:underline"
              >
                Laporkan di GitHub →
              </a>
            </p>

            {/* Dev-only error details */}
            {isDev && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-xs text-text-secondary cursor-pointer hover:text-text-primary select-none">
                  🛠️ Detail error (development only)
                </summary>
                <div className="mt-2 p-3 rounded-lg bg-bg-base border border-border">
                  <p className="text-xs font-mono text-red-400 break-all leading-relaxed">
                    {this.state.error.message}
                  </p>
                  {this.state.error.stack && (
                    <pre className="text-[10px] font-mono text-text-muted mt-2 overflow-x-auto whitespace-pre-wrap break-all">
                      {this.state.error.stack}
                    </pre>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
