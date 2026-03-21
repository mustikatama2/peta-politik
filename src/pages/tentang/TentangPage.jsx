import { Link } from 'react-router-dom'

const FEATURES = [
  { icon: '🗺️', label: 'Peta Jaringan Kekuasaan', desc: 'Visualisasi koneksi antar tokoh, partai, dan lembaga secara interaktif.' },
  { icon: '👤', label: '134+ Profil Tokoh Politik', desc: 'Data biografi, jabatan, harta kekayaan, dan rekam jejak hukum.' },
  { icon: '📊', label: 'Analitik & Skor Pengaruh', desc: 'Pemeringkatan berbasis algoritma multi-faktor yang transparan.' },
  { icon: '📰', label: 'Berita Politik Real-time', desc: 'Agregasi berita dari Tempo, ANTARA, CNN Indonesia, dan sumber terpercaya lain.' },
  { icon: '🏛️', label: 'Tracker Kabinet & Parlemen', desc: 'Pantau susunan Kabinet Merah Putih dan komposisi fraksi DPR.' },
]

const SCORING = [
  {
    title: 'Skor Pengaruh Tokoh',
    range: '0–100',
    color: 'text-red-400',
    bg: 'bg-red-900/20 border-red-800/40',
    items: [
      { label: 'Posisi jabatan', weight: '40%' },
      { label: 'Jaringan koneksi', weight: '20%' },
      { label: 'Kekuatan partai', weight: '20%' },
      { label: 'LHKPN (kekayaan)', weight: '10%' },
      { label: 'Korupsi (penalti)', weight: '−35 maks' },
    ],
  },
  {
    title: 'Skor Partai',
    range: 'Komposit',
    color: 'text-blue-400',
    bg: 'bg-blue-900/20 border-blue-800/40',
    items: [
      { label: 'Kursi DPR', weight: 'bobot utama' },
      { label: 'Jabatan eksekutif', weight: '+bonus' },
      { label: 'Gubernur', weight: '+bonus' },
      { label: 'Status koalisi', weight: '+bonus' },
      { label: 'Kasus korupsi', weight: '−penalti' },
    ],
  },
  {
    title: 'Skor Provinsi',
    range: '0–100',
    color: 'text-green-400',
    bg: 'bg-green-900/20 border-green-800/40',
    items: [
      { label: 'Integritas gubernur', weight: '40%' },
      { label: 'Stabilitas koalisi', weight: '30%' },
      { label: 'Kepadatan penduduk', weight: '10%' },
      { label: 'Dana Otsus', weight: '20%' },
    ],
  },
  {
    title: 'Indeks Risiko Korupsi',
    range: 'Tinggi/Sedang/Rendah',
    color: 'text-orange-400',
    bg: 'bg-orange-900/20 border-orange-800/40',
    items: [
      { label: 'Status tersangka', weight: 'risiko tinggi' },
      { label: 'Status terdakwa', weight: 'risiko tinggi' },
      { label: 'Status terpidana', weight: 'risiko tinggi' },
      { label: 'Penyelidikan aktif', weight: 'risiko sedang' },
    ],
  },
]

const SOURCES = [
  { data: 'Profil Tokoh', sumber: 'Wikipedia, situs resmi partai, media nasional' },
  { data: 'LHKPN', sumber: 'KPK (Komisi Pemberantasan Korupsi)' },
  { data: 'Dana Kampanye', sumber: 'KPU (Komisi Pemilihan Umum)' },
  { data: 'Kasus Korupsi', sumber: 'KPK, Kejaksaan Agung, Pengadilan Tipikor' },
  { data: 'Berita', sumber: 'RSS Tempo, ANTARA, CNN Indonesia, dll.' },
  { data: 'Indikator Makro', sumber: 'BPS, Bank Indonesia, TI, EIU, RSF' },
]

export default function TentangPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-10">

      {/* ── Header ── */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">ℹ️ Tentang PetaPolitik</h1>
        <p className="text-text-muted text-base">Platform intelijen politik independen untuk memahami peta kekuasaan Indonesia.</p>
      </div>

      {/* ── Section 1: Apa itu PetaPolitik? ── */}
      <section className="bg-bg-card border border-border rounded-2xl p-6 space-y-5">
        <h2 className="text-xl font-semibold text-white">🎯 Apa itu PetaPolitik?</h2>
        <p className="text-text-secondary leading-relaxed text-base">
          PetaPolitik adalah platform intelijen politik independen untuk memahami peta kekuasaan Indonesia.
          Data disajikan secara transparan dan dapat diverifikasi.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {FEATURES.map(f => (
            <div key={f.label} className="flex items-start gap-3 p-4 bg-bg-elevated border border-border rounded-xl hover:border-red-500/40 transition-colors">
              <span className="text-2xl flex-shrink-0 mt-0.5">{f.icon}</span>
              <div>
                <p className="text-sm font-semibold text-white">{f.label}</p>
                <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 2: Metodologi ── */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">📐 Metodologi Penilaian</h2>
        <p className="text-text-muted text-sm">
          Semua skor dihitung menggunakan formula terbuka dan dapat direproduksi.
          Bobot dirancang untuk mencerminkan realitas kekuasaan politik Indonesia.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {SCORING.map(s => (
            <div key={s.title} className={`border rounded-2xl p-5 space-y-3 ${s.bg}`}>
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold text-sm ${s.color}`}>{s.title}</h3>
                <span className="text-xs text-text-muted bg-bg-elevated px-2 py-0.5 rounded-full">{s.range}</span>
              </div>
              <ul className="space-y-1.5">
                {s.items.map(item => (
                  <li key={item.label} className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary">{item.label}</span>
                    <span className={`font-mono font-semibold ${s.color}`}>{item.weight}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 3: Sumber Data ── */}
      <section className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-white">📚 Sumber Data</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 text-text-muted font-medium">Data</th>
                <th className="text-left py-2 text-text-muted font-medium">Sumber</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {SOURCES.map(row => (
                <tr key={row.data} className="hover:bg-bg-elevated transition-colors">
                  <td className="py-3 pr-4 font-medium text-white whitespace-nowrap">{row.data}</td>
                  <td className="py-3 text-text-secondary">{row.sumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Section 4: Disclaimer ── */}
      <section className="bg-yellow-900/15 border border-yellow-800/40 rounded-2xl p-6 space-y-2">
        <h2 className="text-xl font-semibold text-yellow-300">⚠️ Disclaimer</h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Data bersifat informatif dan edukatif. Beberapa data bersumber dari analisis redaksi.
          PetaPolitik tidak berafiliasi dengan partai atau lembaga pemerintah manapun.
          Diperbarui secara berkala.
        </p>
        <p className="text-xs text-text-muted">
          Skor dan indeks yang ditampilkan adalah interpretasi analitis berdasarkan data publik, bukan penilaian hukum.
          Untuk keperluan hukum, gunakan sumber resmi dari lembaga berwenang.
        </p>
      </section>

      {/* ── Section 5: Kontak ── */}
      <section className="bg-bg-card border border-border rounded-2xl p-6 space-y-3">
        <h2 className="text-xl font-semibold text-white">📬 Kontak & Kontribusi</h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Temukan kesalahan data? Kami terbuka terhadap masukan dan koreksi dari publik demi akurasi yang lebih baik.
        </p>
        <div className="flex flex-wrap gap-3 items-center">
          <a
            href="https://github.com/mustikatama2/peta-politik"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-elevated border border-border text-sm text-white hover:border-red-500/60 transition-colors"
          >
            <span>⬡</span> GitHub Repository
          </a>
          <span className="text-xs text-text-muted">Data per Maret 2025</span>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="text-center pt-4">
        <Link
          to="/persons"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-semibold text-base transition-all hover:scale-105 shadow-lg shadow-red-900/40"
        >
          Mulai Eksplorasi →
        </Link>
        <p className="text-xs text-text-muted mt-3">134+ tokoh · 18 partai · 38 provinsi</p>
      </div>
    </div>
  )
}
