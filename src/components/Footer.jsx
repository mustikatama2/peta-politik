export default function Footer() {
  return (
    <footer className="mt-12 py-6 border-t border-border text-text-secondary text-sm">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between gap-4">
        <div>
          <p className="font-semibold text-text-primary">PetaPolitik Indonesia</p>
          <p>Data intelijen politik berbasis riset terbuka dan sumber publik.</p>
          <p className="mt-1 text-xs">⚠️ Platform ini bersifat edukatif. Data bersumber dari dokumen publik, LHKPN KPK, dan pemberitaan terverifikasi.</p>
        </div>
        <div className="text-right text-xs space-y-1">
          <p>Data: BPS • KPU • KPK LHKPN • Wikipedia • Media nasional</p>
          <p>Versi 2.0 • Diperbarui Maret 2026</p>
          <p>Dibuat dengan ❤️ untuk transparansi demokrasi</p>
          <p className="mt-2">
            <a href="https://github.com/mustikatama2/peta-politik" target="_blank" rel="noopener noreferrer"
               className="text-accent-red hover:underline">GitHub ↗</a>
            {' · '}
            <span>Login: peta2025</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
