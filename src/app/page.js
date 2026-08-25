"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Pake env biar fleksibel. Isi di Vercel: https://otopadang-api.vercel.app
const API_URL = process.env.NEXT_PUBLIC_API_URL;

function ImageSlider({ images }) {
  const [current, setCurrent] = useState(0);
  const [zoomImg, setZoomImg] = useState(null);
  const prev = (e) => { e.stopPropagation(); setCurrent(current === 0? images.length - 1 : current - 1); };
  const next = (e) => { e.stopPropagation(); setCurrent(current === images.length - 1? 0 : current + 1); };
  return (
    <div className="relative aspect-[16/9] bg-[#0B0B0F] rounded-t-2xl overflow-hidden">
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
        // INI YANG GUA BENERIN
        const [resMobil, resRumah] = await Promise.all([
          fetch(`${API_URL}/cars/all-public`, { cache: 'no-store' }), // DULU: /mobil
          fetch(`${API_URL}/houses/all-public`, { cache: 'no-store' }) // CEK DI SWAGGER LU. Kalo /rumah ganti jadi /rumah
        ]);
        
        if (!resMobil.ok ||!resRumah.ok) throw new Error('Gagal fetch data');

        const dataMobil = await resMobil.json(); 
        const dataRumah = await resRumah.json();

        const mobilArray = Array.isArray(dataMobil)? dataMobil : [];
        const rumahArray = Array.isArray(dataRumah)? dataRumah : [];

        setMobil(mobilArray.slice(0, 8)); 
        setRumah(rumahArray.slice(0, 8));
      } catch (err) { 
        console.error(err);
        setError(err.message); 
      } finally { 
        setLoading(false); 
      }
    }; 
    getData();
  }, []); // Tambah [API_URL] biar aman

  const pesanWA = (item, tipe) => { 
    const noWa = item.wa_showroom || item.wa_number || "62812PUSAT";
    const nama = tipe === 'rumah'? item.nama_rumah : item.nama_mobil || `${item.merek} ${item.tipe}`; 
    const text = `Halo Otopadang, saya tertarik dengan ${nama} seharga Rp ${item.harga?.toLocaleString('id-ID')}. Apakah masih tersedia?`; 
    window.open(`https://wa.me/${noWa}?text=${encodeURIComponent(text)}`, '_blank'); 
  }

  return (
    <main className="min-h-screen bg-[#0B0B0F] text-white">
      <section className="container mx-auto max-w-7xl px-4 py-20 text-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl md:text-6xl font-bold mb-4"><span>Selamat Datang di </span><span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">Portal no 1 Urang Padang</span></motion.h1>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-2xl md:text-4xl font-semibold mb-6">Temukan Mobil & Rumah Impian Anda Disini</motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">Ratusan mobil & rumah terbaik di Padang udah nunggu Anda. Yuk mulai cari sekarang.</motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="mt-8 flex gap-4 justify-center relative">
          <div className="relative"><Link href="/mobil" className={`px-8 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all duration-300 ${activeBtn === 'mobil'? 'scale-95' : 'scale-100'}`}>Cari Mobil</Link>{activeBtn === 'mobil' && <CursorPointer />}</div>
          <div className="relative"><Link href="/rumah" className={`px-8 py-3 border-2 border-yellow-400 text-yellow-400 font-bold rounded-lg hover:bg-yellow-400 hover:text-black hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all duration-300 ${activeBtn === 'rumah'? 'scale-95' : 'scale-100'}`}>Cari Rumah</Link>{activeBtn === 'rumah' && <CursorPointer />}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mt-16 flex-col items-center text-gray-500"><p className="text-sm mb-2">Geser ke bawah</p><motion.svg animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></motion.svg></motion.div>
      </section>

      {error && <p className="text-red-500 text-center my-4">Error: {error}</p>}

      {/* LIST MOBIL */}
      <section className="container mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl font-bold mb-2">Mobil Impian Urang Padang</h2>
        <p className="text-gray-400 mb-8">Update tiap hari. Harga langsung dari showroom</p>
        <div className="relative">
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0B0B0F] to-transparent pointer-events-none z-10"></div>
          <div className="flex gap-6 pb-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            {loading? Array.from({length:4}).map((_,i)=><div key={i} className="w-[300px] aspect-[3/4] bg-[#1A1A1F] rounded-2xl animate-pulse flex-shrink-0 snap-start"></div>) :
              mobil.length === 0? <p className="text-gray-500">Belum ada mobil</p> :
              mobil.map((m, i) => {
                const images = [m.foto_url_1, m.foto_url_2, m.foto_url_3, m.foto_url_4, m.foto_url_5].filter(Boolean);
                return (
                  <motion.div key={m.id} initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }}
                    className="w-[300px] flex-shrink-0 snap-start bg-[#1A1A1F] rounded-2xl overflow-hidden border border-gray-800 hover:border-yellow-400 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] hover:-translate-y-2 transition-all duration-500 group">
                    <ImageSlider images={images} />
                    <div className="p-4">
                      <h3 className="font-bold text-lg">{m.nama_mobil || `${m.merek} ${m.tipe}`} {m.tahun}</h3>
                      <p className="text-gray-400 text-sm">{m.lokasi} | {m.showroom_nama}</p>
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
        <p className="text-gray-400 mb-8">Langsung akad, tanpa ribet. Ada yg free canopy loh</p>
        <div className="relative">
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0B0B0F] to-transparent pointer-events-none z-10"></div>
          <div className="flex gap-6 pb-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            {loading? Array.from({length:4}).map((_,i)=><div key={i} className="w-[300px] aspect-[3/4] bg-[#1A1A1F] rounded-2xl animate-pulse flex-shrink-0 snap-start"></div>) :
              rumah.length === 0? <p className="text-gray-500">Belum ada rumah</p> :
              rumah.map((r, i) => {
                const images = [r.foto_url_1, r.foto_url_2, r.foto_url_3, r.foto_url_4, r.foto_url_5].filter(Boolean);
                return (
                  <motion.div key={r.id} initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }}
                    className="w-[300px] flex-shrink-0 snap-start bg-[#1A1A1F] rounded-2xl overflow-hidden border border-gray-800 hover:border-yellow-400 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] hover:-translate-y-2 transition-all duration-500 group">
                    <ImageSlider images={images} />
                    <div className="p-4">
                      <h3 className="font-bold text-lg">{r.nama_rumah}</h3>
                      <p className="text-gray-400 text-sm">{r.alamat}</p>
                      <p className="text-yellow-400 font-bold text-xl mt-2">Rp {r.harga?.toLocaleString('id-ID')}</p>
                      <p className="text-gray-400 text-sm mt-1">{r.luas_bangunan}m² | {r.tipe}</p>
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
