import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import MetaTags from '../../components/MetaTags'

// ─── FAQ Data ───────────────────────────────────────────────────────────────
const FAQ_SECTIONS = [
  {
    id: 'tentang',
    title: 'Tentang PetaPolitik',
    icon: '🗺️',
    items: [
      {
        q: 'Apa itu PetaPolitik?',
        a: 'PetaPolitik adalah platform intelijen politik independen untuk memahami peta kekuasaan Indonesia. Data disajikan secara transparan berdasarkan sumber publik.',
      },
      {
        q: 'Apakah PetaPolitik berafiliasi dengan partai politik tertentu?',
        a: 'Tidak. PetaPolitik adalah platform independen dan tidak berafiliasi dengan partai, pemerintah, atau lembaga manapun.',
      },
      {
        q: 'Seberapa akurat data di PetaPolitik?',
        a: 'Data bersumber dari Wikipedia, KPK, KPU, BPS, dan media nasional terpercaya. Kami berusaha memverifikasi setiap data, namun tetap mungkin ada ketidakakuratan. Gunakan sebagai referensi, bukan sumber resmi.',
      },
      {
        q: 'Seberapa sering data diperbarui?',
        a: 'Data konten statis diperbarui secara berkala oleh tim. Berita dari RSS feed diperbarui setiap 15 menit secara otomatis.',
      },
      {
        q: 'Siapa yang membuat PetaPolitik?',
        a: 'PetaPolitik dibuat oleh komunitas pengembang dan analis politik yang peduli terhadap transparansi dan literasi politik di Indonesia.',
      },
      {
        q: 'Apakah PetaPolitik gratis digunakan?',
        a: 'Ya, PetaPolitik sepenuhnya gratis untuk diakses. Tidak ada biaya berlangganan atau paywalls.',
      },
    ],
  },
  {
    id: 'cara-menggunakan',
    title: 'Cara Menggunakan',
    icon: '📖',
    items: [
      {
        q: 'Bagaimana cara mencari tokoh?',
        a: 'Gunakan kolom pencarian di halaman Tokoh, atau tekan Cmd+K / Ctrl+K dari mana saja untuk pencarian cepat.',
      },
      {
        q: 'Apa itu fitur Pantauan (Watchlist)?',
        a: 'Anda bisa menambahkan tokoh ke daftar pantauan. Jika tokoh tersebut muncul di berita, Anda akan mendapat notifikasi di Dashboard.',
      },
      {
        q: 'Bagaimana cara membandingkan dua tokoh?',
        a: 'Buka halaman tokoh, klik tombol "Bandingkan", lalu pilih tokoh kedua. Atau langsung akses /compare/tokoh1/tokoh2.',
      },
      {
        q: 'Apa itu Skor Pengaruh?',
        a: 'Skor 0-100 yang mengukur pengaruh politik berdasarkan: posisi jabatan (40%), jaringan koneksi (20%), kekuatan partai (20%), kekayaan LHKPN (10%), dan pengurangan untuk kasus korupsi (hingga -35).',
      },
      {
        q: 'Bagaimana cara melihat jaringan koneksi seorang tokoh?',
        a: 'Buka halaman detail tokoh, lalu klik tab "Jaringan". Anda dapat melihat visualisasi graf interaktif dari semua koneksi tokoh tersebut.',
      },
      {
        q: 'Bagaimana cara menggunakan fitur filter di halaman Tokoh?',
        a: 'Halaman Tokoh menyediakan filter berdasarkan partai, jabatan, provinsi asal, dan tingkat risiko korupsi. Gunakan dropdown filter di atas daftar untuk menyaring hasil.',
      },
      {
        q: 'Apa itu Briefing Harian?',
        a: 'Briefing Harian adalah ringkasan otomatis berita dan perkembangan politik terkini, disusun berdasarkan tokoh yang Anda pantau dan isu-isu prioritas.',
      },
    ],
  },
  {
    id: 'data-metodologi',
    title: 'Data & Metodologi',
    icon: '📊',
    items: [
      {
        q: 'Dari mana data LHKPN berasal?',
        a: 'Dari database KPK (Komisi Pemberantasan Korupsi) yang tersedia publik di elhkpn.kpk.go.id.',
      },
      {
        q: 'Apa artinya "risiko korupsi" tinggi/sedang/rendah?',
        a: '"Tinggi" berarti tokoh pernah berstatus tersangka, terdakwa, atau terpidana. "Sedang" berarti pernah diperiksa atau disebut dalam kasus. "Rendah" berarti tidak ada rekam jejak korupsi publik.',
      },
      {
        q: 'Bagaimana koneksi antar tokoh ditentukan?',
        a: 'Koneksi didasarkan pada hubungan yang terdokumentasi: koalisi partai, keluarga, relasi bisnis, mentor-murid, atau konflik politik yang dilaporkan media.',
      },
      {
        q: 'Apa itu skor ideologi (1-9)?',
        a: '1 = kiri/progresif/sosialis; 5 = tengah; 9 = kanan/konservatif/nasionalis. Berdasarkan analisis platform partai, pernyataan publik, dan voting record.',
      },
      {
        q: 'Dari mana data pemilu berasal?',
        a: 'Dari KPU (Komisi Pemilihan Umum) resmi di pemilu2024.kpu.go.id. Data mencakup hasil Pileg dan Pilpres 2024.',
      },
      {
        q: 'Apakah data dinasti politik sudah lengkap?',
        a: 'Data dinasti didasarkan pada laporan media dan dokumen publik. Beberapa hubungan keluarga mungkin belum terdokumentasi dengan lengkap. Kami terus memperbarui secara berkala.',
      },
      {
        q: 'Bagaimana skor "Indeks Risiko" provinsi dihitung?',
        a: 'Indeks Risiko provinsi dihitung berdasarkan kombinasi: kasus korupsi aktif, sengketa pilkada, tingkat kemiskinan, dan indeks kepercayaan publik terhadap pemerintah daerah.',
      },
    ],
  },
  {
    id: 'fitur-teknis',
    title: 'Fitur Teknis',
    icon: '⚙️',
    items: [
      {
        q: 'Apakah PetaPolitik bisa diakses offline?',
        a: 'Sebagian besar konten tersedia offline setelah first load karena PWA caching. Fitur berita live membutuhkan koneksi internet.',
      },
      {
        q: 'Apakah ada aplikasi mobile?',
        a: 'PetaPolitik adalah Progressive Web App (PWA). Di browser mobile, Anda bisa "Add to Home Screen" untuk pengalaman seperti aplikasi native.',
      },
      {
        q: 'Bagaimana cara mengekspor data?',
        a: 'Banyak halaman memiliki tombol Export CSV. Halaman Tokoh individual memiliki opsi Export JSON dan Print Profil.',
      },
      {
        q: 'Apa itu Cmd+K?',
        a: 'Shortcut keyboard untuk membuka pencarian global dari mana saja di aplikasi. Di Mac gunakan Cmd+K, di Windows/Linux gunakan Ctrl+K.',
      },
      {
        q: 'Apakah PetaPolitik mendukung mode gelap?',
        a: 'Ya! Klik ikon matahari/bulan di sudut kanan atas untuk beralih antara mode terang dan mode gelap. Preferensi Anda tersimpan secara lokal.',
      },
      {
        q: 'Browser apa yang direkomendasikan untuk PetaPolitik?',
        a: 'Chrome, Firefox, Safari, atau Edge versi terbaru. Untuk visualisasi jaringan yang optimal, gunakan browser desktop dengan layar lebih lebar.',
      },
    ],
  },
  {
    id: 'privasi-keamanan',
    title: 'Privasi & Keamanan',
    icon: '🔒',
    items: [
      {
        q: 'Apakah PetaPolitik menyimpan data pengguna?',
        a: 'Tidak ada data pengguna yang dikirim ke server. Semua preferensi (watchlist, tema, skenario tersimpan) disimpan di browser lokal Anda (localStorage).',
      },
      {
        q: 'Apakah PetaPolitik menggunakan cookies?',
        a: 'Tidak ada tracking cookies. Hanya session data untuk autentikasi demo.',
      },
      {
        q: 'Apakah data pribadi saya aman?',
        a: 'PetaPolitik tidak mengumpulkan informasi pribadi. Kami tidak meminta email, nama, atau data identitas apapun untuk menggunakan platform ini.',
      },
      {
        q: 'Apakah ada analitik atau tracking pihak ketiga?',
        a: 'Tidak ada Google Analytics, Facebook Pixel, atau tracker pihak ketiga lainnya. Privasi pengguna adalah prioritas kami.',
      },
    ],
  },
  {
    id: 'konten-hukum',
    title: 'Konten & Hukum',
    icon: '⚖️',
    items: [
      {
        q: 'Apakah data tokoh publik legal untuk ditampilkan?',
        a: 'Ya. Seluruh data yang ditampilkan adalah informasi publik yang tersedia secara legal dari sumber resmi pemerintah, KPU, KPK, dan media terpercaya. PetaPolitik tidak menampilkan data privat.',
      },
      {
        q: 'Bagaimana jika saya menemukan data yang tidak akurat?',
        a: 'Silakan laporkan melalui halaman Tentang atau buka isu di repositori GitHub kami. Kami akan meninjau dan memperbaiki dalam waktu 7 hari kerja.',
      },
      {
        q: 'Bisakah data PetaPolitik digunakan untuk penelitian?',
        a: 'Ya, data PetaPolitik dapat digunakan untuk penelitian akademis dan jurnalisme. Harap cantumkan kredit "PetaPolitik (petapolitik.id)" sebagai sumber.',
      },
      {
        q: 'Apakah ada API publik untuk PetaPolitik?',
        a: 'Saat ini belum ada API publik resmi. Data mentah dapat diakses melalui repositori GitHub kami di github.com/mustikatama2/peta-politik.',
      },
    ],
  },
]

// ─── Build flat item list with IDs ──────────────────────────────────────────
function buildFlatItems(sections) {
  const items = []
  sections.forEach(section => {
    section.items.forEach((item, idx) => {
      const id = `${section.id}-${idx}`
      items.push({ ...item, id, sectionId: section.id, sectionTitle: section.title })
    })
  })
  return items
}

const ALL_ITEMS = buildFlatItems(FAQ_SECTIONS)

// ─── Component ───────────────────────────────────────────────────────────────
export default function FAQPage() {
  const location = useLocation()
  const [openId, setOpenId] = useState(null)
  const [activeSection, setActiveSection] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Handle URL hash on mount / navigation
  useEffect(() => {
    if (location.hash) {
      const hashId = location.hash.slice(1) // remove #
      setOpenId(hashId)
      // Scroll to element after a small delay to allow render
      setTimeout(() => {
        const el = document.getElementById(hashId)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 200)
    }
  }, [location.hash])

  // Filtered items based on section + search
  const filteredItems = useMemo(() => {
    let items = ALL_ITEMS
    if (activeSection !== 'all') {
      items = items.filter(item => item.sectionId === activeSection)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      items = items.filter(
        item =>
          item.q.toLowerCase().includes(q) ||
          item.a.toLowerCase().includes(q)
      )
    }
    return items
  }, [activeSection, searchQuery])

  // Group filtered items back by section for display
  const groupedFiltered = useMemo(() => {
    const map = {}
    filteredItems.forEach(item => {
      if (!map[item.sectionId]) {
        const section = FAQ_SECTIONS.find(s => s.id === item.sectionId)
        map[item.sectionId] = { ...section, items: [] }
      }
      map[item.sectionId].items.push(item)
    })
    return Object.values(map)
  }, [filteredItems])

  const toggleItem = id => {
    setOpenId(prev => (prev === id ? null : id))
    // Update URL hash without reloading
    if (openId !== id) {
      window.history.replaceState(null, '', `#${id}`)
    } else {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }

  const totalItems = ALL_ITEMS.length

  return (
    <>
      <MetaTags
        title="FAQ — Pertanyaan yang Sering Diajukan | PetaPolitik"
        description="Temukan jawaban atas pertanyaan umum tentang PetaPolitik: cara penggunaan, sumber data, metodologi, privasi, dan fitur teknis."
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 py-4">
          <h1 className="text-3xl font-bold text-text-primary">
            ❓ Pertanyaan yang Sering Diajukan
          </h1>
          <p className="text-text-secondary text-base max-w-xl mx-auto">
            {totalItems} pertanyaan tersedia — temukan jawaban atas pertanyaan Anda tentang PetaPolitik.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-base pointer-events-none">
            🔍
          </span>
          <input
            type="text"
            placeholder="Cari pertanyaan atau kata kunci..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-bg-card text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red/30 focus:border-accent-red text-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary text-lg leading-none"
            >
              ×
            </button>
          )}
        </div>

        {/* Category filter buttons */}
        <div className="flex flex-wrap gap-2">
          <FilterButton
            active={activeSection === 'all'}
            onClick={() => setActiveSection('all')}
            icon="📋"
            label="Semua"
            count={totalItems}
          />
          {FAQ_SECTIONS.map(section => (
            <FilterButton
              key={section.id}
              active={activeSection === section.id}
              onClick={() => setActiveSection(section.id)}
              icon={section.icon}
              label={section.title}
              count={section.items.length}
            />
          ))}
        </div>

        {/* Results summary when searching */}
        {searchQuery && (
          <p className="text-sm text-text-secondary">
            {filteredItems.length > 0
              ? `${filteredItems.length} pertanyaan ditemukan untuk "${searchQuery}"`
              : `Tidak ada hasil untuk "${searchQuery}"`}
          </p>
        )}

        {/* FAQ Accordion */}
        {groupedFiltered.length > 0 ? (
          <div className="space-y-6">
            {groupedFiltered.map(section => (
              <div key={section.id} className="space-y-2">
                {/* Section header */}
                {(activeSection === 'all' || !searchQuery) && (
                  <h2 className="flex items-center gap-2 text-base font-semibold text-text-primary px-1 pt-2">
                    <span>{section.icon}</span>
                    <span>{section.title}</span>
                    <span className="ml-auto text-xs text-text-muted font-normal">
                      {section.items.length} pertanyaan
                    </span>
                  </h2>
                )}

                {/* Items */}
                <div className="rounded-xl border border-border bg-bg-card overflow-hidden divide-y divide-border">
                  {section.items.map(item => (
                    <AccordionItem
                      key={item.id}
                      item={item}
                      isOpen={openId === item.id}
                      onToggle={() => toggleItem(item.id)}
                      highlight={searchQuery.trim()}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-16 space-y-3">
            <div className="text-5xl">🤷</div>
            <p className="text-text-primary font-semibold">Tidak ada pertanyaan yang cocok</p>
            <p className="text-text-secondary text-sm">
              Coba kata kunci lain atau pilih kategori yang berbeda.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveSection('all') }}
              className="mt-2 px-4 py-2 rounded-lg bg-accent-red text-white text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* CTA Footer */}
        <div className="rounded-2xl bg-gradient-to-br from-red-900/20 to-red-800/10 border border-red-900/20 p-8 text-center space-y-4 mt-8">
          <div className="text-4xl">💬</div>
          <h3 className="text-xl font-bold text-text-primary">Masih punya pertanyaan?</h3>
          <p className="text-text-secondary text-sm max-w-sm mx-auto">
            Jika pertanyaan Anda belum terjawab di sini, kunjungi halaman Tentang untuk info lebih lanjut atau laporkan masalah di GitHub.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to="/tentang"
              className="px-5 py-2.5 rounded-xl bg-accent-red text-white font-semibold text-sm hover:bg-red-700 transition-colors"
            >
              ℹ️ Halaman Tentang
            </Link>
            <a
              href="https://github.com/mustikatama2/peta-politik/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-bg-elevated border border-border text-text-primary font-semibold text-sm hover:bg-bg-hover transition-colors"
            >
              🐛 Laporkan Masalah
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div className="pb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: '/glosarium', icon: '📖', label: 'Glosarium' },
            { to: '/tentang', icon: 'ℹ️', label: 'Tentang Kami' },
            { to: '/ranking', icon: '🏆', label: 'Power Rankings' },
            { to: '/persons', icon: '👥', label: 'Daftar Tokoh' },
          ].map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-bg-card hover:bg-bg-hover hover:border-accent-red/30 text-text-secondary hover:text-text-primary text-sm transition-all"
            >
              <span>{link.icon}</span>
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

// ─── Filter Button ────────────────────────────────────────────────────────────
function FilterButton({ active, onClick, icon, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
        active
          ? 'bg-accent-red text-white border-accent-red shadow-sm'
          : 'bg-bg-card text-text-secondary border-border hover:border-accent-red/40 hover:text-text-primary'
      }`}
    >
      <span>{icon}</span>
      <span className="hidden sm:inline">{label}</span>
      <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
        active ? 'bg-white/20 text-white' : 'bg-bg-elevated text-text-muted'
      }`}>
        {count}
      </span>
    </button>
  )
}

// ─── Accordion Item ───────────────────────────────────────────────────────────
function AccordionItem({ item, isOpen, onToggle, highlight }) {
  // Highlight matching text
  const highlightText = (text) => {
    if (!highlight) return text
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 text-yellow-900 rounded px-0.5">
          {part}
        </mark>
      ) : part
    )
  }

  return (
    <div id={item.id} className="scroll-mt-20">
      <button
        onClick={onToggle}
        className={`w-full flex items-start gap-3 px-5 py-4 text-left transition-colors ${
          isOpen ? 'bg-red-900/5' : 'hover:bg-bg-elevated'
        }`}
        aria-expanded={isOpen}
      >
        <span
          className={`flex-shrink-0 mt-0.5 text-base transition-transform duration-200 ${
            isOpen ? 'rotate-45 text-accent-red' : 'text-text-muted'
          }`}
        >
          ＋
        </span>
        <span className={`flex-1 text-sm font-medium leading-relaxed ${isOpen ? 'text-accent-red' : 'text-text-primary'}`}>
          {highlightText(item.q)}
        </span>
      </button>

      {/* Answer panel */}
      {isOpen && (
        <div className="px-5 pb-5 pt-0 ml-9">
          <p className="text-sm text-text-secondary leading-relaxed">
            {highlightText(item.a)}
          </p>
          {/* Permalink */}
          <a
            href={`#${item.id}`}
            className="inline-flex items-center gap-1 mt-3 text-xs text-text-muted hover:text-accent-red transition-colors"
            onClick={e => e.stopPropagation()}
          >
            🔗 Bagikan pertanyaan ini
          </a>
        </div>
      )}
    </div>
  )
}
