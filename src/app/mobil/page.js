'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_URL = 'https://otopadang-api.up.railway.app'
const NOMOR_WA_SHOWROOM = "6281234567890"; 

export default function MobilPage() {
  const [allMobil, setAllMobil] = useState([])
  const [filteredMobil, setFilteredMobil] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [filterHarga, setFilterHarga] = useState('semua')
  const [filterTahun, setFilterTahun] = useState('semua')
  const [filterLokasi, setFilterLokasi] = useState('semua')

  // 1. FETCH DATA DARI API - UDAH FIX
  useEffect(() => {
    const fetchMobil = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_URL}/mobil/all-public`, { cache: 'no-store' }) // <--- INI YG DIGANTI
        if(!res.ok) throw new Error(`API Error: ${res.status}`)
        
        const data = await res.json()
        console.log("DATA DARI API:", data)

        // BE udah filter approved, jadi langsung set aja
        setAllMobil(data)
        setFilteredMobil(data)
      } catch (err) {
        console.error("Gagal fetch:", err)
        setError(err.message)
        setAllMobil([])
      } finally {
        setLoading(false)
      }
    }
    fetchMobil()
  }, [])

  // 2. AMBIL DATA UNIK BUAT DROPDOWN
  const listTahun = [...new Set(allMobil.map(m => m.tahun))].filter(Boolean).sort((a,b) => b-a)
  const listLokasi = [...new Set(allMobil.map(m => m.lokasi))].filter(Boolean).sort()

  // 3. FUNGSI FILTER - UDAH FIX ANGKA
  useEffect(() => {
    let result = [...allMobil]

    if(search) {
      result = result.filter(m => 
        m.nama_mobil?.toLowerCase().includes(search.toLowerCase()) ||
        m.merek?.toLowerCase().includes(search.toLowerCase())
      )
    }
    if(filterTahun !== 'semua') {
      result = result.filter(m => m.tahun == filterTahun)
    }
    if(filterLokasi !== 'semua') {
      result = result.filter(m => m.lokasi === filterLokasi)
    }
    if(filterHarga !== 'semua') {
      if(filterHarga === '100') result = result.filter(m => m.harga < 100000) // <100jt
      if(filterHarga === '200') result = result.filter(m => m.harga >= 100000 && m.harga < 200000) // 100-200jt
      if(filterHarga === '300') result = result.filter(m => m.harga >= 200000 && m.harga < 300000000) // 200-300jt
      if(filterHarga === '500') result = result.filter(m => m.harga >= 300000) // >300jt
    }
    
    setFilteredMobil(result)
  }, [search, filterHarga, filterTahun, filterLokasi, allMobil])

  if(loading) return <div className="text-center py-20 text-white">Loading mobil...</div>
  if(error) return <div className="text-center py-20 text-red-500">Error: {error}</div>

  return (
    <div className="container mx-auto px-4 py-6 bg-[#0B0B0F] min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Mobil Dijual di Padang</h1>
      
      {/* SEARCH FILTER */}
      <div className="bg-[#1a1a20] p-4 rounded-lg shadow mb-6 border-gray-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input 
            type="text" 
            placeholder="Cari merek, model..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-gray-700 bg-[#0B0B0F] rounded-lg px-3 py-2 text-white" 
          />
          <select value={filterHarga} onChange={(e) => setFilterHarga(e.target.value)} className="border-gray-700 bg-[#0B0B0F] rounded-lg px-3 py-2">
            <option value="semua">Semua Harga</option>
            <option value="100">Dibawah 100 Juta</option>
            <option value="200">100 - 200 Juta</option>
            <option value="300">200 - 300 Juta</option>
            <option value="500">Diatas 300 Juta</option>
          </select>
          <select value={filterTahun} onChange={(e) => setFilterTahun(e.target.value)} className="border-gray-700 bg-[#0B0B0F] rounded-lg px-3 py-2">
            <option value="semua">Semua Tahun</option>
            {listTahun.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filterLokasi} onChange={(e) => setFilterLokasi(e.target.value)} className="border-gray-700 bg-[#0B0B0F] rounded-lg px-3 py-2">
            <option value="semua">Semua Lokasi</option>
            {listLokasi.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* GRID CARD MOBIL */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredMobil.length === 0 && <p className="col-span-4 text-center text-gray-500 py-10">Mobil tidak ditemukan</p>}
        
        {filteredMobil.map((mobil) => (
          <Link href={`/mobil/${mobil.id}`} key={mobil.id} className="bg-[#1a1a20] rounded-lg shadow hover:shadow-lg transition overflow-hidden flex-col border-gray-800 hover:border-yellow-400">
            <img src={mobil.foto_url_1 || 'https://placehold.co/400x300'} alt={mobil.nama_mobil} className="w-full h-40 object-cover" />
            <div className="p-3 flex-grow">
              <p className="font-bold text-xl text-yellow-400">Rp {mobil.harga?.toLocaleString('id-ID')}</p>
              <p className="font-bold text-sm mt-1">{mobil.merek} {mobil.nama_mobil} {mobil.tahun}</p>
              
              {/* SPEK */}
              <div className="flex flex-wrap gap-1 my-2 text-xs text-gray-300">
                <span className="bg-gray-800 px-2 py-1 rounded">{mobil.tahun}</span>
                <span className="bg-gray-800 px-2 py-1 rounded">{mobil.kilometer?.toLocaleString('id-ID')} KM</span>
                <span className="bg-gray-800 px-2 py-1 rounded">{mobil.transmisi}</span>
              </div>

              <p className="text-xs text-gray-400 mt-2">{mobil.lokasi} | {mobil.showroom_nama || 'Admin'}</p>
            </div>

            {/* TOMBOL WA */}
            <div className="p-3 pt-0">
              <div className="w-full bg-green-500 hover:bg-green-600 text-white text-center py-2 rounded-lg font-semibold">
                Chat via WhatsApp
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
