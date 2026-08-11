import Link from "next/link";
import { useEffect, useState } from "react"; // TAMBAH INI

const API_URL = "https://otopadang-api.up.railway.app";

export default function HomePage() {
  const [mobil, setMobil] = useState([]); // state buat mobil
  const [rumah, setRumah] = useState([]); // state buat rumah
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil data mobil & rumah pas halaman load
    Promise.all([
      fetch(`${API_URL}/mobil`).then(res => res.json()),
      fetch(`${API_URL}/rumah`).then(res => res.json()) // INI PENTING
    ])
    .then(([dataMobil, dataRumah]) => {
      setMobil(dataMobil.slice(0, 4)); // ambil 4 terbaru
      setRumah(dataRumah.slice(0, 4)); // ambil 4 terbaru
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (
    <main className="min-h-screen bg-[#0B0B0F]">
      {/* HERO SECTION */}
      <section className="container mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold">
          <span className="text-yellow-400">Elegance</span> in Every Deal
        </h1>
        <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
          Portal #1 Jual Beli Mobil & Rumah di Padang. Terpercaya, Cepat, Aman.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link href="/mobil" className="px-8 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition">
            Cari Mobil
          </Link>
          <Link href="/rumah" className="px-8 py-3 border border-yellow-400 text-yellow-400 font-bold rounded-lg hover:bg-yellow-400 hover:text-black transition">
            Cari Rumah
          </Link>
        </div>
      </section>

      {/* LIST MOBIL TERBARU */}
      <section className="container mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-white">Mobil Terbaru di Padang</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? <p className="text-gray-400">Loading...</p> : 
            mobil.map(m => (
              <div key={m.id} className="bg-[#1A1A1F] rounded-xl overflow-hidden border-gray-800 hover:border-yellow-400 transition group">
                <img src={m.gambar || 'https://placehold.co/600x400'} alt={m.merk} className="w-full h-48 object-cover group-hover:scale-105 transition"/>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-white">{m.merk} {m.tipe} {m.tahun}</h3>
                  <p className="text-gray-400 text-sm">{m.lokasi}</p>
                  <p className="text-yellow-400 font-bold text-xl mt-2">Rp {m.harga?.toLocaleString('id-ID')}</p>
                </div>
              </div>
            ))
          }
        </div>
      </section>

      {/* LIST RUMAH TERBARU - INI YG BARU */}
      <section className="container mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-white">Rumah Terbaru di Padang</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? <p className="text-gray-400">Loading...</p> : 
            rumah.length === 0 ? <p className="text-gray-400">Belum ada data rumah</p> :
            rumah.map(r => (
              <div key={r.id} className="bg-[#1A1A1F] rounded-xl overflow-hidden border-gray-800 hover:border-yellow-400 transition group">
                <img src={r.gambar || 'https://placehold.co/600x400'} alt={r.judul} className="w-full h-48 object-cover group-hover:scale-105 transition"/>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-white">{r.judul}</h3>
                  <p className="text-gray-400 text-sm">{r.alamat}</p>
                  <p className="text-yellow-400 font-bold text-xl mt-2">Rp {r.harga?.toLocaleString('id-ID')}</p>
                  <p className="text-gray-400 text-sm mt-1">{r.kamar_tidur} KT | {r.kamar_mandi} KM | {r.luas_tanah}m²</p>
                </div>
              </div>
            ))
          }
        </div>
      </section>
    </main>
  )
}
