"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  const gradientOverlay = theme === 'dark'? 'from-[#0B0B0F]' : 'from-gray-50';

  return (
    <main className={`min-h-screen transition-colors duration-300 ${bgMain}`}>

      {/* HEADER BARU BIAR RAPI DAN GAK NUTUPIN */}
      <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md ${bgHeader} border-b ${theme==='dark'?'border-gray-800':'border-gray-200'}`}>
        <div className="container mx-auto max-w-7xl px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-yellow-400">Otopadang</h1>
          <button
            onClick={() => setTheme(theme === 'dark'? 'light' : 'dark')}
            className="px-4 py-2 rounded-full bg-yellow-400 text-black font-bold hover:scale-105 transition text-sm"
          >
            {theme === 'dark'? 'Mode Terang' : 'Mode Gelap'}
          </button>
        </div>
      </header>

      {/* KASIH pt-24 BIAR GAK KETUTUP HEADER */}
      <section className="container mx-auto max-w-7xl px-4 pt-24 pb-20 text-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl md:text-6xl font-bold mb-4"><span>Selamat Datang di </span><span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">Portal no 1 Urang Padang</span></motion.h1>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-2xl md:text-4xl font-semibold mb-6">Temukan Mobil & Rumah Impian Anda Disini</motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className={`${textMuted} mt-4 text-lg max-w-2xl mx-auto`}>Ratusan mobil & rumah terbaik di Padang udah nunggu Anda. Yuk mulai cari sekarang.</motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="mt-8 flex gap-4 justify-center relative">
          <div className="relative"><Link href="/mobil" className={`px-8 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all duration-300 ${activeBtn === 'mobil'? 'scale-95' : 'scale-100'}`}>Cari Mobil</Link>{activeBtn === 'mobil' && <CursorPointer />}</div>
          <div className="relative"><Link href="/rumah" className={`px-8 py-3 border-2 border-yellow-400 text-yellow-400 font-bold rounded-lg hover:bg-yellow-400 hover:text-black hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all duration-300 ${activeBtn === 'rumah'? 'scale-95' : 'scale-100'}`}>Cari Rumah</Link>{activeBtn === 'rumah' && <CursorPointer />}</div>
        </motion.div>

        {/* PANAH UDAH FIX: TAMBAH flex */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className={`mt-16 flex flex-col items-center ${textMuted}`}>
          <p className="text-sm mb-2">Geser ke bawah</p>
          <motion.svg animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></motion.svg>
        </motion.div>
      </section>

      {error && <p className="text-red-500 text-center my-4">Error: {error}</p>}

      {/* LIST MOBIL */}
      <section className="container mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl font-bold mb-2">Mobil Impian Urang Padang</h2>
        <p className={`${textMuted} mb-8`}>Update tiap hari. Harga langsung dari showroom</p>
        <div className="relative">
          <div className={`absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l ${gradientOverlay} to-transparent pointer-events-none z-10`}></div>
          <div className="flex gap-6 pb-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            {loading? Array.from({length:4}).map((_,i)=><div key={i} className={`w-[300px] aspect-[3/4] ${theme==='dark'?'bg-[#1A1A1F]':'bg-gray-200'} rounded-2xl animate-pulse flex-shrink-0 snap-start`}></div>) :
              mobil.length === 0? <p className={textMuted}>Belum ada mobil</p> :
              mobil.map((m, i) => {
                const images = [m.foto_url_1, m.foto_url_2, m.foto_url_3, m.foto_url_4, m.foto_url_5].filter(Boolean);
                return (
                  <motion.div key={m.id} initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }}
                    className={`w-[300px] flex-shrink-0 snap-start ${bgCard} rounded-2xl overflow-hidden hover:border-yellow-400 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] hover:-translate-y-2 transition-all duration-500 group`}>
                    <ImageSlider images={images} theme={theme} />
                    <div className="p-4">
                      <h3 className="font-bold text-lg">{m.nama_mobil || `${m.merek} ${m.tipe}`} {m.tahun}</h3>
                      <p className={`${textMuted} text-sm`}>{m.lokasi} | {m.showroom_nama}</p>
                      <p className="text-yellow-400 font-bold text-xl mt-2">Rp {m.harga?.toLocaleString('id-ID')}</p>
                      <button onClick={() => pesanWA(m, 'mobil')} className="w-full mt-4 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition active:scale-95">Hubungi via WA</button>
                    </div>
                  </motion.div>
                )
              })
            }
          </div>
        </div>
      </section>

      {/* LIST RUMAH */}
      <section className="container mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl font-bold mb-2">Rumah Ready di Padang</h2>
        <p className={`${textMuted} mb-8`}>Langsung akad, tanpa ribet. Ada yg free canopy loh</p>
        <div className="relative">
          <div className={`absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l ${gradientOverlay} to-transparent pointer-events-none z-10`}></div>
          <div className="flex gap-6 pb-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            {loading? Array.from({length:4}).map((_,i)=><div key={i} className={`w-[300px] aspect-[3/4] ${theme==='dark'?'bg-[#1A1A1F]':'bg-gray-200'} rounded-2xl animate-pulse flex-shrink-0 snap-start`}></div>) :
              rumah.length === 0? <p className={textMuted}>Belum ada rumah</p> :
              rumah.map((r, i) => {
                const images = [r.foto_url_1, r.foto_url_2, r.foto_url_3, r.foto_url_4, r.foto_url_5].filter(Boolean);
                return (
                  <motion.div key={r.id} initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }}
                    className={`w-[300px] flex-shrink-0 snap-start ${bgCard} rounded-2xl overflow-hidden hover:border-yellow-400 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] hover:-translate-y-2 transition-all duration-500 group`}>
                    <ImageSlider images={images} theme={theme} />
                    <div className="p-4">
                      <h3 className="font-bold text-lg">{r.nama_rumah}</h3>
                      <p className={`${textMuted} text-sm`}>{r.alamat}</p>
                      <p className="text-yellow-400 font-bold text-xl mt-2">Rp {r.harga?.toLocaleString('id-ID')}</p>
                      <p className={`${textMuted} text-sm mt-1`}>{r.luas_bangunan}m² | {r.tipe}</p>
                      {r.badge_bonus && <span className="inline-block mt-2 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">{r.badge_bonus}</span>}
                      <button onClick={() => pesanWA(r, 'rumah')} className="w-full mt-4 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition active:scale-95">Hubungi Penjual via WA</button>
                    </div>
                  </motion.div>
                )
              })
            }
          </div>
        </div>
      </section>
    </main>
  )
}
