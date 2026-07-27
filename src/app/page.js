"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';

const API_URL = 'https://otopadang-api.up.railway.app';

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('mobil');
  const [mobilList, setMobilList] = useState([]);
  const [rumahList, setRumahList] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/mobil/`).then(res => res.json()).then(setMobilList).catch(console.error);
    fetch(`${API_URL}/rumah/`).then(res => res.json()).then(setRumahList).catch(console.error);
  }, []);

  return (
    <main className="bg-gray-50">
      {/* NAVBAR SIMPLE */}
      <nav className="sticky top-0 bg-white shadow p-4 flex justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">Otopadang</Link>
        <Link href="/admin" className="text-red-500 font-bold">Admin</Link>
      </nav>

      {/* BANNER SIMPLE */}
      <section className="bg-blue-600 text-white text-center py-10">
        <h1 className="text-3xl font-bold">Otopadang.com</h1>
        <p>Portal Jual Beli Mobil & Rumah Padang</p>
      </section>

      {/* TAB */}
      <div className="container mx-auto p-4">
        <div className="flex gap-4 border-b mb-4">
          <button onClick={() => setActiveTab('mobil')} className={activeTab === 'mobil' ? 'font-bold text-blue-600' : ''}>Mobil</button>
          <button onClick={() => setActiveTab('rumah')} className={activeTab === 'rumah' ? 'font-bold text-blue-600' : ''}>Rumah</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {activeTab === 'mobil' && mobilList.map(m => (
            <div key={m.id} className="border p-2 rounded">
              <p className="font-bold">{m.merek} {m.tipe}</p>
              <p>Rp{m.harga_tunai?.toLocaleString()}</p>
            </div>
          ))}
          {activeTab === 'rumah' && rumahList.map(r => (
            <div key={r.id} className="border p-2 rounded">
              <p className="font-bold">Rumah {r.type_rumah}</p>
              <p>Rp{r.harga?.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
