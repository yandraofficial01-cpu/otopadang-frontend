"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('mobil'); // State buat tab

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
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
          <div className="hidden lg:flex gap-6 items-center font-semibold">
            <Link href="#" className="text-blue-600 border-b-2 border-blue-600 pb-1">Mobil</Link>
            <Link href="#" className="text-gray-600 hover:text-blue-600">Rumah</Link>
            <Link href="#" className="text-gray-600 hover:text-blue-600">Blog</Link>
            
            <div className="h-6 border-l border-gray-300"></div>

            <Link href="/register-showroom" className="text-sm text-gray-600 hover:text-red-500">Admin</Link>
            <Link href="/login-showroom" className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-md transition">Login Showroom</Link>
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
          <div className="bg-white border-t px-4 py-3 flex flex-col gap-2">
            <Link href="#" onClick={() => setIsOpen(false)} className="block py-2 font-semibold text-blue-600">Mobil</Link>
            <Link href="#" onClick={() => setIsOpen(false)} className="block py-2 font-semibold text-gray-600">Rumah</Link>
            <Link href="#" onClick={() => setIsOpen(false)} className="block py-2 font-semibold text-gray-600">Blog</Link>
            <hr />
            <Link href="/register-showroom" onClick={() => setIsOpen(false)} className="block py-2 font-semibold text-red-500">Admin</Link>
            <Link href="/login-showroom" onClick={() => setIsOpen(false)} className="block mt-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-center">Login Showroom</Link>
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

      {/* 2 TAB DENGAN FUNGSI */}
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

        {/* ISI TAB MOBIL */}
        {activeTab === 'mobil' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Iklan Mobil Terbaru</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border rounded-lg shadow p-4 hover:shadow-lg transition">Contoh Kartu Mobil 1</div>
              <div className="bg-white border rounded-lg shadow p-4 hover:shadow-lg transition">Contoh Kartu Mobil 2</div>
            </div>
          </div>
        )}

        {/* ISI TAB RUMAH */}
        {activeTab === 'rumah' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Rumah Developer Terbaru</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border rounded-lg shadow p-4 hover:shadow-lg transition">Contoh Kartu Rumah 1</div>
            </div>
          </div>
        )}
      </section>

    </main>
  );
}