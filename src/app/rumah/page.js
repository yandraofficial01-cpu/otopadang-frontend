"use client"

import { useEffect, useState } from "react";

const API_URL = "https://otopadang-api.up.railway.app";

function ImageSlider({ images }) {
  const [current, setCurrent] = useState(0);
  const prev = (e) => { e.stopPropagation(); setCurrent(current === 0? images.length - 1 : current - 1); };
  const next = (e) => { e.stopPropagation(); setCurrent(current === images.length - 1? 0 : current + 1); };

  return (
    <div className="relative overflow-hidden">
      <img
        src={images[current] || 'https://placehold.co/600x400'}
        alt=""
        className="w-full h-48 object-cover group-hover:scale-110 transition duration-500"
      />
      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 active:scale-90">‹</button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 active:scale-90">›</button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => <div key={i} className={`w-2 h-2 rounded-full transition ${i === current? 'bg-yellow-400' : 'bg-white/50'}`}></div>)}
          </div>
        </>
      )}
    </div>
  )
}

export default function RumahPage() {
  const [rumahList, setRumahList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/rumah/`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Gagal ambil data Rumah');
        const result = await res.json();
        const data = Array.isArray(result)? result : result.data || [];
        setRumahList(data);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const pesanWA = (item) => {
    const noWa = item.wa_number || "62812PUSAT";
    const nama = item.nama_rumah;
    const text = `Halo Otopadang, saya tertarik dengan ${nama} seharga Rp ${item.harga?.toLocaleString('id-ID')}. Apakah masih tersedia?`;
    window.open(`https://wa.me/${noWa}?text=${encodeURIComponent(text)}`, '_blank');
  }

  return (
    <main className="min-h-screen bg-[#0B0B0F] container mx-auto max-w-7xl px-4 py-16">

      <div className="text-center mb-12 animate-fade-in-down">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          Temukan Rumah Impianmu
        </h1>
        <p className="text-gray-400 text-lg">
          Ratusan pilihan rumah terbaik di Padang. Dari subsidi sampai mewah, semua ada disini.
        </p>
      </div>

      {loading && <p className="text-gray-400 text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">Error: {error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {rumahList.map((r, i) => {
          const images = [r.foto_url_1, r.foto_url_2, r.foto_url_3, r.foto_url_4, r.foto_url_5].filter(Boolean);
          return (
            <div
              key={r.id}
              style={{ animationDelay: `${i * 100}ms` }}
              className={`bg-[#1A1A1F] rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-400 active:border-yellow-400 hover:shadow-2xl hover:shadow-yellow-500/20 active:shadow-yellow-500/20 hover:-translate-y-2 active:-translate-y-2 hover:scale-[1.02] active:scale-[1.02] transition-all duration-500 group animate-fade-in-up`}
            >
              <ImageSlider images={images} />
              <div className="p-4">
                <h3 className="font-bold text-lg text-white">{r.nama_rumah}</h3>
                <p className="text-gray-400 text-sm">{r.alamat}</p>
                <p className="text-yellow-400 font-bold text-xl mt-2">Rp {r.harga?.toLocaleString('id-ID')}</p>
                <p className="text-gray-400 text-sm mt-1">{r.luas_bangunan}m² | {r.tipe} | Tanah: {r.luas_tanah}m²</p>
                {r.badge_bonus && <span className="inline-block mt-2 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">{r.badge_bonus}</span>}
                <button
                  onClick={() => pesanWA(r)}
                  className="w-full mt-4 bg-green-600 hover:bg-green-500 active:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition active:scale-95">
                  Hubungi Penjual via WA
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
       .animate-fade-in-up { opacity: 0; animation: fadeInUp 0.6s ease-out forwards; }
       .animate-fade-in-down { animation: fadeInDown 0.8s ease-out forwards; }
      `}</style>
    </main>
  )
}
