import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('PetaPolitik page error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-4">
          <div className="text-5xl">⚠️</div>
          <h2 className="text-xl font-bold text-text-primary">Terjadi Kesalahan</h2>
          <p className="text-text-secondary text-sm max-w-md">
            Halaman ini mengalami error. Coba refresh atau kembali ke beranda.
          </p>
          <p className="text-xs text-text-muted font-mono bg-bg-elevated px-3 py-1 rounded">
            {this.state.error.message}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => this.setState({ error: null })}
              className="px-4 py-2 rounded-lg bg-accent-red text-white text-sm hover:bg-red-700 transition-colors"
            >
              Coba Lagi
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 rounded-lg bg-bg-elevated border border-border text-text-primary text-sm hover:bg-bg-card transition-colors"
            >
              Ke Beranda
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
