'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_URL = 'https://otopadang-api.up.railway.app'

export default function AdminPage() {
  const [token, setToken] = useState('')
  const [mobilPending, setMobilPending] = useState([])
  const [showrooms, setShowrooms] = useState([])

  useEffect(() => {
    const t = localStorage.getItem('token')
    if (!t) return alert('Login dulu sebagai admin')
    setToken(t)
    fetchData(t)
  }, [])

  const fetchData = async (t) => {
    // 1. Ambil mobil yg belum di approve
    const resMobil = await fetch(`${API_URL}/mobil/pending`, {
      headers: { 'Authorization': `Bearer ${t}` }
    })
    setMobilPending(await resMobil.json())

    // 2. Ambil data semua showroom
    const resShowroom = await fetch(`${API_URL}/showroom/`, {
      headers: { 'Authorization': `Bearer ${t}` }
    })
    setShowrooms(await resShowroom.json())
  }

  const handleApprove = async (mobilId) => {
    await fetch(`${API_URL}/mobil/${mobilId}/approve`, {
      method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }
    })
    alert('Mobil disetujui!')
    fetchData(token)
  }

  const handleSetPremium = async (showroomId) => {
    await fetch(`${API_URL}/showroom/${showroomId}/premium`, {
      method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }
    })
    alert('Showroom jadi Premium!')
    fetchData(token)
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Panel Admin OTO PADANG</h1>
      
      {/* SECTION BARU: APPROVE CEPAT */}
      <div className="mb-8 p-4 border-2 border-green-500 rounded-lg">
        <h2 className="text-xl font-bold mb-3">🔥 Tugas Utama: Review Mobil Baru</h2>
        {mobilPending.length === 0 ? <p className="text-gray-500">Tidak ada mobil baru</p> : 
          mobilPending.slice(0, 3).map(mobil => ( // tampil 3 aja biar gak panjang
            <div key={mobil.id} className="border p-3 rounded mb-2 flex justify-between items-center bg-green-50">
              <div>
                <p className="font-bold">{mobil.merek} {mobil.tipe} {mobil.tahun}</p>
                <p className="text-sm">Dari: {mobil.showroom?.nama_showroom} | Rp{mobil.harga_tunai?.toLocaleString()}</p>
              </div>
              <button onClick={() => handleApprove(mobil.id)} className="bg-green-600 text-white px-4 py-2 rounded">Approve</button>
            </div>
          ))
        }
      </div>

      {/* SECTION BARU: PREMIUM SHOWROOM */}
      <div className="mb-8 p-4 border-2 border-yellow-500 rounded-lg">
        <h2 className="text-xl font-bold mb-3">👑 Manajemen Premium Showroom</h2>
        {showrooms.map(showroom => (
          <div key={showroom.id} className="border p-3 rounded mb-2 flex justify-between items-center">
            <div>
              <p className="font-bold">{showroom.nama_showroom} 
                {showroom.is_premium && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded">HOT</span>}
              </p>
              <p className="text-sm">Kuota: {showroom.jumlah_mobil}/{showroom.kuota_mobil} | WA: {showroom.no_hp}</p>
            </div>
            {!showroom.is_premium && 
              <button onClick={() => handleSetPremium(showroom.id)} className="bg-yellow-500 text-white px-4 py-2 rounded">Jadikan Premium</button>
            }
          </div>
        ))}
      </div>

      {/* MENU LAMA LU TETAP ADA */}
      <h2 className="text-xl font-bold mb-3">Menu Lainnya</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <Link href="/dashboard" className="p-4 border rounded hover:bg-gray-100">
          <h2 className="font-bold">Dashboard</h2>
          <p className="text-sm">Lihat statistik</p>
        </Link>

        <Link href="/rumah/input" className="p-4 border rounded hover:bg-gray-100">
          <h2 className="font-bold">Input Rumah</h2>
          <p className="text-sm">Tambah data rumah</p>
        </Link>

        <Link href="/dashboard/mobil/input" className="p-4 border rounded hover:bg-gray-100">
          <h2 className="font-bold">Input Mobil</h2>
          <p className="text-sm">Tambah data mobil</p>
        </Link>

        <Link href="/rumah" className="p-4 border rounded hover:bg-gray-100">
          <h2 className="font-bold">Kelola Rumah</h2>
          <p className="text-sm">Edit / Hapus rumah</p>
        </Link>

        <Link href="/mobil" className="p-4 border rounded hover:bg-gray-100">
          <h2 className="font-bold">Kelola Mobil</h2>
          <p className="text-sm">Edit / Hapus mobil</p>
        </Link>

        <Link href="/blog" className="p-4 border rounded hover:bg-gray-100">
          <h2 className="font-bold">Kelola Blog</h2>
          <p className="text-sm">Tulis artikel</p>
        </Link>
        
      </div>
    </div>
  )
}
