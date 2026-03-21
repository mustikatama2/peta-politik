export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl mb-4">🗺️</div>
      <h1 className="text-4xl font-bold text-text-primary mb-2">404</h1>
      <p className="text-xl text-accent-red font-semibold mb-2">Halaman Tidak Ditemukan</p>
      <p className="text-text-secondary mb-8 max-w-md">
        Peta yang Anda cari tidak ada dalam arsip kami.
        Mungkin tokoh ini belum terdaftar, atau URL salah.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <a
          href="/"
          className="bg-accent-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
        >
          🏠 Kembali ke Beranda
        </a>
        <a
          href="/persons"
          className="bg-bg-card border border-border text-text-primary px-6 py-3 rounded-lg hover:bg-bg-elevated transition-colors"
        >
          👤 Cari Tokoh
        </a>
      </div>
      <p className="text-text-secondary text-sm mt-8">
        Coba gunakan{' '}
        <a href="/pencarian" className="text-accent-red hover:underline">
          pencarian global
        </a>{' '}
        untuk menemukan yang Anda cari.
      </p>
    </div>
  )
}
