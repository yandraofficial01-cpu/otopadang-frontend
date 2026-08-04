'use client'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)

  // PENJAGA: Kalau belum login, paksa ke login
  useEffect(() => {
    const showroom_id = localStorage.getItem('showroom_id')
    if (!showroom_id) {
      window.location.href = '/login' // paksa redirect
    } else {
      setIsLoading(false)
    }
  }, [])

  // FUNGSI LOGOUT PAKSA
  const handleLogout = () => {
    localStorage.clear() // hapus semua data
    window.location.href = '/login' // paksa pindah halaman + refresh
  }

  if (isLoading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="p-8 bg-[#0B0B0F] min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-yellow-400">Dashboard Admin</h1>
        <button
          type="button"
          onClick={handleLogout}
          className="px-5 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 transition"
        >
          Logout
        </button>
      </div>

      {/* Statistik Cepat */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 border border-gray-800 rounded-xl bg-gray-900/50">
          <p className="text-sm text-gray-400">Total Rumah</p>
          <h2 className="text-2xl font-bold text-yellow-400">0</h2>
        </div>
        <div className="p-6 border-gray-800 rounded-xl bg-gray-900/50">
          <p className="text-sm text-gray-400">Total Mobil</p>
          <h2 className="text-2xl font-bold text-yellow-400">0</h2>
        </div>
        <div className="p-6 border border-gray-800 rounded-xl bg-gray-900/50">
          <p className="text-sm text-gray-400">Total Showroom</p>
          <h2 className="text-2xl font-bold text-yellow-400">0</h2>
        </div>
      </div>

      {/* Menu Aksi Cepat */}
      <h2 className="text-xl font-bold mb-4">Aksi Cepat</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <a href="/rumah/input" className="p-4 border border-gray-800 rounded-lg hover:bg-yellow-500 hover:text-black transition text-center font-semibold">
          + Input Rumah
        </a>
        <a href="/dashboard/mobil/input" className="p-4 border-gray-800 rounded-lg hover:bg-yellow-500 hover:text-black transition text-center font-semibold">
          + Input Mobil
        </a>
        <a href="/rumah" className="p-4 border-gray-800 rounded-lg hover:bg-yellow-500 hover:text-black transition text-center font-semibold">
          Kelola Rumah
        </a>
        <a href="/mobil" className="p-4 border-gray-800 rounded-lg hover:bg-yellow-500 hover:text-black transition text-center font-semibold">
          Kelola Mobil
        </a>
      </div>
    </div>
  )
}
