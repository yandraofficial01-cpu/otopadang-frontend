"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const navLinks = [
  { name: "Mobil", href: "/mobil" },
  { name: "Rumah", href: "/rumah" },
  { name: "Blog", href: "/blog" },
  { name: "Tentang Kami", href: "/tentang" },
]

function ImageSlider({ images, theme }) {
  const [current, setCurrent] = useState(0);
  const [zoomImg, setZoomImg] = useState(null);
  const prev = (e) => { e.stopPropagation(); setCurrent(current === 0? images.length - 1 : current - 1); };
  const next = (e) => { e.stopPropagation(); setCurrent(current === images.length - 1? 0 : current + 1); };
  const bgColor = theme === 'dark'? 'bg-[#0B0B0F]' : 'bg-gray-200';
  return (
    <div className={`relative aspect-[16/9] ${bgColor} rounded-t-2xl overflow-hidden`}>
      <img src={images[current] || 'https://placehold.co/600x400'} alt="" className="w-full h-full object-cover cursor-zoom-in group-hover:scale-110 transition duration-500" onClick={() => setZoomImg(images[current])} />
      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/80 active:scale-90">‹</button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/80 active:scale-90">›</button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => <div key={i} className={`w-2 h-2 rounded-full transition ${i === current? 'bg-yellow-400' : 'bg-white/50'}`}></div>)}
          </div>
        </>
      )}
      {zoomImg && (<div onClick={() => setZoomImg(null)} className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-zoom-out"><img src={zoomImg} className="max-w-full max-h-full object-contain" /></div>)}
    </div>
  )
}

function CursorPointer() {
  return (<div className="absolute -bottom-6 left-1/2 -translate-x-1/2 pointer-events-none"><motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-yellow-400 drop-shadow-lg"><path d="M12 2L3 20L12 17L21 20L12 2Z" fill="currentColor" stroke="black" strokeWidth="1.5"/></svg></motion.div><div className="absolute top-1 left-1 w-7 h-7 border-2 border-yellow-400 rounded-full animate-ping"></div></div>)
}

export default function HomePage() {
  const [mobil, setMobil] = useState([]);
  const [rumah, setRumah] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeBtn, setActiveBtn] = useState('mobil');
  const [theme, setTheme] = useState('dark');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('otopadang-theme') || 'dark';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('otopadang-theme', theme);
  }, [theme]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBtn(prev => prev === 'mobil'? 'rumah' : 'mobil');
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const getData = async () => {
      setLoading(true); setError(null);
      try {
        const [resMobil, resRumah] = await Promise.all([
          fetch(`${API_URL}/cars/all-public`, { cache: 'no-store' }),
          fetch(`${API_URL}/rumah/all-public`, { cache: 'no-store' })
        ]);
        if (!resMobil.ok) throw new Error(`Mobil error: ${resMobil.status}`);
        if (!resRumah.ok) throw new Error(`Rumah error: ${resRumah.status}`);
        const dataMobil = await resMobil.json();
        const dataRumah = await resRumah.json();
        setMobil(Array.isArray(dataMobil)? dataMobil.slice(0, 8) : []);
        setRumah(Array.isArray(dataRumah)? dataRumah.slice(0, 8) : []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [API_URL]);

  const pesanWA = (item, tipe) => {
    const noWa = item.wa_showroom || item.wa_number || "62812PUSAT";
    const nama = tipe === 'rumah'? item.nama_rumah : item.nama_mobil || `${item.merek} ${item.tipe}`;
    const text = `Halo Otopadang, saya tertarik dengan ${nama} seharga Rp ${item.harga?.toLocaleString('id-ID')}. Apakah masih tersedia?`;
    window.open(`https://wa.me/${noWa}?text=${encodeURIComponent(text)}`, '_blank');
  }

  const bgMain = theme === 'dark'? 'bg-[#0B0B0F] text-white' : 'bg-gray-50 text-black';
  const bgCard = theme === 'dark'? 'bg-[#1A1A1F] border-gray-800' : 'bg-white border-gray-200';
  const bgHeader = theme === 'dark'? 'bg-[#0B0B0F]/80' : 'bg-gray-50/80';
  const textMuted = theme === 'dark'? 'text-gray-400' : 'text-gray-600';

  return (
    <main className={`min-h-screen transition-colors duration-300 ${bgMain}`}>

      {/* HEADER + BURGER MENU + LOGIN BUTTONS */}
      <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md ${bgHeader} border-b ${theme === 'dark'? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="container mx-auto max-w-7xl px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-yellow-400">Otopadang</Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link key={link.name} href={link.href} className="hover:text-yellow-400 transition">{link.name}</Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login-admin" className="px-3 py-2 text-xs font-semibold text-yellow-400 border-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black transition">
                Login Admin
              </Link>
              <Link href="/login-showroom" className="px-3 py-2 text-xs font-semibold text-white border-gray-600 rounded-lg hover:bg-gray-700 transition">
                Login Showroom
              </Link>
            </div>

            <button
              onClick={() => setTheme(theme === 'dark'? 'light' : 'dark')}
              className="px-4 py-2 rounded-full bg-yellow-400 text-black font-bold hover:scale-105 transition text-sm"
            >
              {theme === 'dark'? 'Mode Terang' : 'Mode Gelap'}
            </button>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
              {isMenuOpen?
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> :
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              }
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden border-t ${theme === 'dark'? 'border-gray-800' : 'border-gray-200'}`}
            >
              <nav className="flex flex-col p-4 gap-4">
                {navLinks.map(link => (
                  <Link key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-400 transition py-2">{link.name}</Link>
                ))}
                <div className="border-t pt-4 mt-2 flex-col gap-3">
                  <Link href="/login-admin" onClick={() => setIsMenuOpen(false)} className="block w-full text-center text-yellow-400 font-semibold border-yellow-400 py-3 rounded-lg hover:bg-yellow-400 hover:text-black transition">
                    Login Admin
                  </Link>
                  <Link href="/login-showroom" onClick={() => setIsMenuOpen(false)} className="block w-full text-center text-white font-semibold border-gray-600 py-3 rounded-lg hover:bg-gray-700 transition">
                    Login Showroom
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION */}
      <section className="container mx-auto max-w-7xl px-4 pt-28 pb-20 text-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl md:text-6xl font-bold mb-4"><span>Selamat Datang di </span><span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">Portal no 1 Urang Padang</span></motion.h1>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-2xl md:text-4xl font-semibold mb-6">Temukan Mobil & Rumah Impian Anda Disini</motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className={`${textMuted} mt-4 text-lg max-w-2xl mx-auto`}>Ratusan mobil & rumah terbaik di Padang udah nunggu Anda. Yuk mulai cari sekarang.</motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="mt-8 flex gap-4 justify-center relative">
          <div className="relative"><Link href="/mobil" className={`px-8 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all duration-300 ${activeBtn === 'mobil'? 'scale-95' : 'scale-100'}`}>Cari Mobil</Link>{activeBtn === 'mobil' && <CursorPointer />}</div>
          <div className="relative"><Link href="/rumah" className={`px-8 py-3 border-2 border-yellow-400 text-yellow-400 font-bold rounded-lg hover:bg-yellow-400 hover:text-black hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all duration-300 ${activeBtn === 'rumah'? 'scale-95' : 'scale-100'}`}>Cari Rumah</Link>{activeBtn === 'rumah' && <CursorPointer />}</div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className={`mt-16 flex-col items-center justify-center w-full ${textMuted}`}>
          <p className="text-sm mb-2">Geser ke bawah</p>
          <motion.svg animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></motion.svg>
        </motion.div>
      </section>

      {loading && <p className="text-center py-10">Loading data...</p>}
      {error && <p className="text-red-500 text-center my-4">Error: {error}</p>}

      {/* LIST MOBIL */}
      {!loading && mobil.length > 0 && (
        <section className="container mx-auto max-w-7xl px-4 py-12">
          <h2 className="text-3xl font-bold mb-8">Mobil Terbaru</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mobil.map(item => (
              <div key={item.id} className={`group rounded-2xl border ${bgCard} overflow-hidden shadow-lg hover:shadow-yellow-500/20 transition`}>
                <ImageSlider images={item.gambar || []} theme={theme} />
                <div className="p-5">
                  <h3 className="text-xl font-bold">{item.merek} {item.tipe}</h3>
                  <p className={`text-2xl font-bold text-yellow-400 my-2`}>Rp {item.harga?.toLocaleString('id-ID')}</p>
                  <p className={`${textMuted} text-sm mb-4`}>{item.tahun} • {item.transmisi} • {item.km?.toLocaleString('id-ID')} KM</p>
                  <button onClick={() => pesanWA(item, 'mobil')} className="w-full mt-2 bg-green-500 text-white font-bold py-2 rounded-lg hover:bg-green-600">Tanya via WA</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* LIST RUMAH */}
      {!loading && rumah.length > 0 && (
        <section className="container mx-auto max-w-7xl px-4 py-12">
          <h2 className="text-3xl font-bold mb-8">Rumah Terbaru</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rumah.map(item => (
              <div key={item.id} className={`group rounded-2xl border ${bgCard} overflow-hidden shadow-lg hover:shadow-yellow-500/20 transition`}>
                <ImageSlider images={item.gambar || []} theme={theme} />
                <div className="p-5">
                  <h3 className="text-xl font-bold">{item.nama_rumah}</h3>
                  <p className={`text-2xl font-bold text-yellow-400 my-2`}>Rp {item.harga?.toLocaleString('id-ID')}</p>
                  <p className={`${textMuted} text-sm mb-4`}>{item.luas_tanah}m² • {item.kamar_tidur} KT • {item.kamar_mandi} KM</p>
                  <button onClick={() => pesanWA(item, 'rumah')} className="w-full mt-2 bg-green-500 text-white font-bold py-2 rounded-lg hover:bg-green-600">Tanya via WA</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
