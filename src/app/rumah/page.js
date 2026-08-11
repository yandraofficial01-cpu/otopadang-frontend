"use client"

import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL = "https://otopadang-api.up.railway.app";

export default function RumahPage() {
  const [rumahList, setRumahList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/rumah`)
    .then(res => res.json())
    .then(data => {
      setRumahList(data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Daftar Rumah di Padang</h1>
        <Link href="/rumah/input" className="bg-yellow-500 text-black px-4 py-2 rounded font-bold">
          + Jual Rumah
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-400 text-center">Loading...</p>
      ) : rumahList.length === 0 ? (
        <div className="border rounded-lg p-12 text-center">
          <p className="text-gray-500 text-lg">Belum ada data rumah</p>
          <p className="text-sm text-gray-400 mt-2">Jadilah yang pertama jual rumah di sini</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rumahList.map(r => (
            <div key={r.id} className="bg-[#1A1A1F] rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-400 transition">
              <img src={r.foto_url_1 || 'https://placehold.co/600x400'} alt={r.nama_rumah} className="w-full h-48 object-cover"/>
              <div className="p-4">
                <h3 className="font-bold text-lg text-white">{r.nama_rumah}</h3>
                <p className="text-gray-400 text-sm">{r.alamat}</p>
                <p className="text-yellow-400 font-bold text-xl mt-2">Rp {r.harga?.toLocaleString('id-ID')}</p>
                <p className="text-gray-400 text-sm mt-1">{r.kamar_tidur} KT | {r.kamar_mandi} KM | {r.luas_tanah}m²</p>
                <p className="text-xs text-gray-500 mt-2">{r.tipe}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
