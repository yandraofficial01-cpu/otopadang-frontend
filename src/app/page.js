"use client"

import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL = "https://otopadang-api.up.railway.app";

// COMPONENT SLIDER + ZOOM
function ImageSlider({ images }) {
  const [current, setCurrent] = useState(0);
  const [zoomImg, setZoomImg] = useState(null);

  const prev = () => setCurrent(current === 0? images.length - 1 : current - 1);
  const next = () => setCurrent(current === images.length - 1? 0 : current + 1);

  return (
    <div className="relative">
      <img
        src={images[current] || 'https://placehold.co/600x400'}
        alt=""
        className="w-full h-48 object-cover cursor-zoom-in group-hover:scale-105 transition duration-300"
        onClick={() => setZoomImg(images[current])}
      />
      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80">‹</button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80">›</button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => <div key={i} className={`w-2 h-2 rounded-full ${i === current? 'bg-yellow-400' : 'bg-white/50'}`}></div>)}
          </div>
        </>
      )}

      {/* ZOOM MODAL */}
      {zoomImg && (
        <div onClick={() => setZoomImg(null)} className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-zoom-out">
          <img src={zoomImg} className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </div>
  )
}

// KOMPONEN KURSOR ANIMASI
function CursorPointer() {
  return (
    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 pointer-events-none">
      {/* Kursor */}
      <div className="animate-bounce">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-yellow-400 drop-shadow-lg">
          <path d="M12 2L3 20L12 17L21 20L12 2Z" fill="currentColor" stroke="black" strokeWidth="1.5"/>
        </svg>
      </div>
      {/* Lingkaran ping */}
      <div className="absolute top-1 left-1 w-7 h-7 border-2 border-yellow-400 rounded-full animate-ping"></div>
    </div>
  )
}

export default function HomePage() {
  const [mobil, setMobil] = useState([]);
  const [rumah, setRumah] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeBtn, setActiveBtn] = useState('mobil'); // 'mobil' atau 'rumah'

  // Animasi gantian tiap 2 detik, gak berhenti
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBtn(prev => prev === 'mobil'? 'rumah' : 'mobil');
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      setError(null);
      try {
        const resMobil = await fetch(`${API_URL}/mobil/`, { cache: 'no-store' });
        if (!resMobil.ok) throw new Error('Gagal ambil data Mobil');
        const dataMobil = await resMobil.json();
        setMobil(dataMobil.slice(0, 4));

        const resRumah = await fetch(`${API_URL}/rumah/`, { cache: 'no-store' });
        if (!resRumah.ok) throw new Error('Gagal ambil data Rumah');
        const dataRumah = await resRumah.json();
        setRumah(dataRumah.slice(0, 4));

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const pesanWA = (item, tipe) => {
    const noWa = item.wa_number || "62812PUSAT";
    const nama = tipe === 'rumah'? item.nama_rumah : `${item.merk} ${item.tipe}`;
    const text = `Halo Otopadang, saya tertarik dengan ${nama} seharga Rp ${item.harga?.toLocaleString('id-ID')}. Apakah masih tersedia?`;
    window.open(`https://wa.me/${noWa}?text=${encodeURIComponent(text)}`, '_blank');
  }

  return (
    <main className="min-h-screen bg-[#0B0B0F]">
      {/* HERO SECTION */}
      <section className="container mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="text-white">Selamat Datang di </span>
          <span className="text-yellow-400">Portal no 1 Urang Padang</span>
        </h1>

        <h2 className="text-2xl md:text-4xl font-semibold text-white mb-6">
          Temukan Mobil & Rumah Impian Anda Disini
        </h2>

        <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
          Ratusan mobil & rumah terbaik di Padang udah nunggu Anda. Yuk mulai cari sekarang, siapa tau impian Anda ada disini.
        </p>

        <div className="mt-8 flex gap-4 justify-center relative">
          {/* BUTTON CARI MOBIL */}
          <div className="relative">
            <Link
              href="/mobil"
              className={`px-8 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/20 duration-300 ${
                activeBtn === 'mobil'? 'scale-95' : 'scale-100'
              }`}
            >
              Cari Mobil
            </Link>
            {activeBtn === 'mobil' && <CursorPointer />}
          </div>

          {/* BUTTON CARI RUMAH */}
          <div className="relative">
            <Link
              href="/rumah"
              className={`px-8 py-3 border-2 border-yellow-400 text-yellow-400 font-bold rounded-lg hover:bg-yellow-400 hover:text-black transition duration-300 ${
                activeBtn === 'rumah'? 'scale-95' : 'scale-100'
              }`}
            >
              Cari Rumah
            </Link>
            {activeBtn === 'rumah' && <CursorPointer />}
          </div>
        </div>
      </section>

      {error && <p className="text-red-500 text-center my-4">Error: {error}</p>}

      {/* LIST MOBIL TERBARU */}
      <section className="container mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-white">Temukan Mobil Impian disini!!!</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading? <p className="text-gray-400 col-span-full">Loading...</p> :
            mobil.length === 0? <p className="text-gray-400 col-span-full">Belum ada data mobil</p> :
            mobil.map(m => {
              const images = [m.foto_url_1, m.foto_url_2, m.foto_url_3, m.foto_url_4, m.foto_url_5].filter(Boolean);
              return (
                <div key={m.id} className="bg-[#1A1A1F] rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 group">
                  <ImageSlider images={images} />
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-white">{m.merk} {m.tipe} {m.tahun}</h3>
                    <p className="text-gray-400 text-sm">{m.lokasi || m.alamat}</p>
                    <p className="text-yellow-400 font-bold text-xl mt-2">Rp {m.harga?.toLocaleString('id-ID')}</p>
                    <button
                      onClick={() => pesanWA(m, 'mobil')}
                      className="w-full mt-4 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition">
                      Hubungi via WA
                    </button>
                  </div>
                </div>
              )
            })
          }
        </div>
      </section>

      {/* LIST RUMAH TERBARU */}
      <section className="container mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-white">Rumah Terbaru di Padang</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading? <p className="text-gray-400 col-span-full">Loading...</p> :
            rumah.length === 0? <p className="text-gray-400 col-span-full">Belum ada data rumah</p> :
            rumah.map(r => {
              const images = [r.foto_url_1, r.foto_url_2, r.foto_url_3, r.foto_url_4, r.foto_url_5].filter(Boolean);
              return (
                <div key={r.id} className="bg-[#1A1A1F] rounded-xl overflow-hidden border-gray-800 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 group">
                  <ImageSlider images={images} />
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-white">{r.nama_rumah}</h3>
                    <p className="text-gray-400 text-sm">{r.alamat}</p>
                    <p className="text-yellow-400 font-bold text-xl mt-2">Rp {r.harga?.toLocaleString('id-ID')}</p>
                    <p className="text-gray-400 text-sm mt-1">{r.luas_bangunan}m² | {r.tipe} | Tanah: {r.luas_tanah}m²</p>
                    {r.badge_bonus && <span className="inline-block mt-2 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">{r.badge_bonus}</span>}
                    <button
                      onClick={() => pesanWA(r, 'rumah')}
                      className="w-full mt-4 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition">
                      Hubungi Penjual via WA
                    </button>
                  </div>
                </div>
              )
            })
          }
        </div>
      </section>
    </main>
  )
}
