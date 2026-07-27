"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';

const API_URL = 'https://otopadang-api.up.railway.app';

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('mobil');
  const [mobilList, setMobilList] = useState([]);
  const [rumahList, setRumahList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);

    // AMBIL DATA DARI API
    const fetchData = async () => {
      setLoading(true);
      try {
        const resMobil = await fetch(`${API_URL}/cars/`);
        const dataMobil = await resMobil.json();
        setMobilList(dataMobil);

        const resRumah = await fetch(`${API_URL}/houses/`);
        const dataRumah = await resRumah.json();
        setRumahList(dataRumah);
      } catch (error) {
        console.error("Gagal ambil data:", error)
      }
      setLoading(false);
    };
    fetchData();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="bg-gray-50">
      {/* NAVBAR */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-white'}`}>
        <div className="container mx-auto max-w-7xl px-4 py-3 flex justify-between items-center">
          
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 text-white font-bold text-xl p-2 rounded-lg">O</div>
            <span className="text-2xl font-bold text-blue-600">Otopadang</span>
          </Link>
          
          {/* MENU DESKTOP */}
          <div className="hidden lg:flex gap-4 items-center font-semibold">
            <button onClick={() => setActiveTab('mobil')} className={`${activeTab === 'mobil' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-600 hover:text-blue-600'}`}>Mobil</button>
            <button onClick={() => setActiveTab('rumah')} className={`${activeTab === 'rumah' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-600 hover:text-blue-600'}`}>Rumah</button>
            <Link href="/blog" className="text-gray-600 hover:text-blue-600">Blog</Link>
            
            <div className="h-6 border-l border-gray-300"></div>

            <Link href="/admin" className="text-sm text-gray-600 hover:text-red-500">Admin</Link>
            <Link href="/register-showroom" className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-600 shadow-md transition">Daftar Showroom</Link>
            <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-md transition">Login Showroom</Link>
            <a href="https://wa.me/628979879518" target="_blank" className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-600 transition">WA Admin</a>
          </div>

          {/* BURGER HP */}
          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* MENU HP NGELIPAT */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
          <div className="bg-white border-t px-4 py-3 flex-col gap-2">
            <button onClick={() => {setActiveTab('mobil'); setIsOpen(false)}} className="block py-2 font-semibold text-left">Mobil</button>
            <button onClick={() => {setActiveTab('rumah'); setIsOpen(false)}} className="block py-2 font-semibold text-left">Rumah</button>
            <Link href="/blog" onClick={() => setIsOpen(false)} className="block py-2 font-semibold">Blog</Link>
            <hr />
            <Link href="/admin" onClick={() => setIsOpen(false)} className="block py-2 font-semibold text-red-500">Admin</Link>
            <Link href="/register-showroom" onClick={() => setIsOpen(false)} className="block bg-orange-500 text-white px-4 py-2 rounded-lg font-bold text-center">Daftar Showroom</Link>
            <Link href="/login" onClick={() => setIsOpen(false)} className="block bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-center">Login Showroom</Link>
            <a href="https://wa.me/628979879518" target="_blank" onClick={() => setIsOpen(false)} className="block bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-center">WA Admin</a>
          </div>
        </div>
      </nav>

      {/* BANNER */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto max-w-7xl px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Otopadang.com</h1>
          <p className="text-lg mb-2 text-blue-100">Portal #1 Jual Beli Mobil Bekas & Rumah di Padang</p>
        </div>
      </section>

      {/* 2 TAB DENGAN DATA BENERAN */}
      <section className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex border-b-2 border-gray-200 mb-6">
          <button 
            onClick={() => setActiveTab('mobil')}
            className={`px-6 py-3 font-bold whitespace-nowrap ${activeTab === 'mobil' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-500'}`}
          >
            🚗 Mobil Bekas Semua Showroom
          </button>
          <button 
            onClick={() => setActiveTab('rumah')}
            className={`px-6 py-3 font-bold whitespace-nowrap ${activeTab === 'rumah' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-500'}`}
          >
            🏠 Rumah Developer
          </button>
        </div>

        {loading ? <p className="text-center">Loading data...</p> : (
          <>
            {/* ISI TAB MOBIL */}
            {activeTab === 'mobil' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Iklan Mobil Terbaru</h2>
                {mobilList.length === 0 ? <p>Belum ada mobil</p> : 
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {mobilList.map(mobil => (
                    <div key={mobil.id} className="bg-white border rounded-lg shadow p-4 hover:shadow-lg transition">
                      <img src={mobil.photo1 || 'https://placehold.co/400x300'} alt={mobil.type} className="w-full h-40 object-cover rounded mb-2"/>
                      <h3 className="font-bold">{mobil.brand} {mobil.type} {mobil.year}</h3>
                      <p className="text-sm text-gray-500">{mobil.mileage} KM</p>
                      <p className="font-bold text-blue-600 text-lg mt-1">Rp{mobil.cash_price?.toLocaleString()}</p>
                      <p className="text-xs">Showroom: {mobil.showroom?.name}</p>
                      <a href={`https://wa.me/${mobil.whatsapp}`} target="_blank" className="mt-2 w-full bg-green-500 text-white text-center py-2 rounded block font-bold">WA</a>
                    </div>
                  ))}
                </div>
                }
              </div>
            )}

            {/* ISI TAB RUMAH */}
            {activeTab === 'rumah' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Rumah Developer Terbaru</h2>
                {rumahList.length === 0 ? <p>Belum ada rumah</p> : 
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {rumahList.map(rumah => (
                    <div key={rumah.id} className="bg-white border rounded-lg shadow p-4 hover:shadow-lg transition">
                      <img src={rumah.photo1 || 'https://placehold.co/400x300'} alt={rumah.house_type} className="w-full h-40 object-cover rounded mb-2"/>
                      <h3 className="font-bold">Rumah {rumah.house_type}</h3>
                      <p className="text-sm text-gray-500">LT {rumah.land_size} m2 • {rumah.location}</p>
                      <p className="font-bold text-blue-600 text-lg mt-1">Rp{rumah.price?.toLocaleString()}</p>
                      <a href="https://wa.me/628979879518" target="_blank" className="mt-2 w-full bg-green-500 text-white text-center py-2 rounded block font-bold">WA Admin</a>
                    </div>
                  ))}
                </div>
                }
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
