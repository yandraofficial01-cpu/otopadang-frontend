"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';

const API_URL = 'https://otopadang-api.up.railway.app';

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('mobil');
  const [mobilList, setMobilList] = useState([]);
  const [rumahList, setRumahList] = useState([]);
  const [filters, setFilters] = useState({merek: '', min_harga: '', max_harga: '', lokasi: ''});
  const [slide, setSlide] = useState(0);

  const banners = [
    {img: 'https://i.ibb.co/banner1.jpg', title: 'Promo Akhir Tahun'},
    {img: 'https://i.ibb.co/banner2.jpg', title: 'Showroom Premium HOT'}
  ]

  useEffect(() => {
    const interval = setInterval(() => setSlide((prev) => (prev + 1) % banners.length), 5000);
    fetchData();
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    const query = new URLSearchParams(filters).toString();
    const resMobil = await fetch(`${API_URL}/mobil/?${query}&approved=true`);
    setMobilList(await resMobil.json());
    const resRumah = await fetch(`${API_URL}/rumah/`);
    setRumahList(await resRumah.json());
  };

  return (
    <main className="bg-gray-50">
      {/* NAVBAR TETAP */}
      <nav className="sticky top-0 z-50 bg-white shadow">...</nav>

      {/* SLIDER BANNER V3 */}
      <section className="relative h-64 md:h-96 overflow-hidden">
        {banners.map((b, i) => (
          <div key={i} className={`absolute w-full h-full transition-opacity duration-1000 ${i === slide? 'opacity-100' : 'opacity-0'}`}>
            <img src={b.img} className="w-full h-full object-cover"/>
            <div className="absolute bottom-0 left-0 p-8 bg-gradient-to-t from-black/70 to-transparent w-full">
              <h2 className="text-3xl font-bold text-white">{b.title}</h2>
            </div>
          </div>
        ))}
      </section>

      {/* FILTER V3 */}
      {activeTab === 'mobil' && (
        <div className="container mx-auto max-w-7xl px-4 py-4 bg-white shadow rounded-lg -mt-10 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <input placeholder="Merek" onChange={e => setFilters({...filters, merek: e.target.value})} className="border p-2 rounded"/>
            <input placeholder="Lokasi" onChange={e => setFilters({...filters, lokasi: e.target.value})} className="border p-2 rounded"/>
            <input type="number" placeholder="Harga Min" onChange={e => setFilters({...filters, min_harga: e.target.value})} className="border p-2 rounded"/>
            <input type="number" placeholder="Harga Max" onChange={e => setFilters({...filters, max_harga: e.target.value})} className="border p-2 rounded"/>
            <button onClick={fetchData} className="bg-blue-600 text-white rounded font-bold">Cari</button>
          </div>
        </div>
      )}

      {/* TAB + KARTU TETAP KAYA SEBELUMNYA TAPI KLIK KE DETAIL */}
      <section className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex border-b-2 border-gray-200 mb-6">
          <button onClick={() => setActiveTab('mobil')} className={`px-6 py-3 font-bold ${activeTab === 'mobil'? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-500'}`}>🚗 Mobil</button>
          <button onClick={() => setActiveTab('rumah')} className={`px-6 py-3 font-bold ${activeTab === 'rumah'? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-500'}`}>🏠 Rumah</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeTab === 'mobil' && mobilList.map(mobil => (
            <Link href={`/mobil/${mobil.id}`} key={mobil.id} className="bg-white border rounded-lg shadow p-4 hover:shadow-lg transition relative">
              {mobil.showroom?.is_premium && <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded animate-pulse">HOT</span>}
              <img src={mobil.foto1} className="w-full h-40 object-cover rounded mb-2"/>
              <h3 className="font-bold">{mobil.merek} {mobil.tipe}</h3>
              <p className="font-bold text-blue-600 text-lg">Rp{mobil.harga_tunai?.toLocaleString()}</p>
            </Link>
          ))}
          {activeTab === 'rumah' && rumahList.map(rumah => (
            <Link href={`/rumah/${rumah.id}`} key={rumah.id} className="bg-white border rounded-lg shadow p-4 hover:shadow-lg transition">
              <img src={rumah.foto1} className="w-full h-40 object-cover rounded mb-2"/>
              <h3 className="font-bold">Rumah {rumah.type_rumah}</h3>
              <p className="font-bold text-blue-600 text-lg">Rp{rumah.harga?.toLocaleString()}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
