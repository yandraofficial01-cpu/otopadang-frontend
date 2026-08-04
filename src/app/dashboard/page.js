'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()

  // 1. PENJAGA: Kalau belum login, tendang ke /login
  useEffect(() => {
    const showroom_id = localStorage.getItem('showroom_id')
    if (!showroom_id) {
      router.push('/login')
    }
  }, [router])

  // 2. FUNGSI LOGOUT
  const handleLogout = () => {
    localStorage.removeItem('showroom_id')
    localStorage.removeItem('role')
    localStorage.removeItem('email')
    router.push('/login')
  }

  return (
    <div className="p-8 bg-[#0B0B0F] min-h-screen text-white">
      {/* HEADER + TOMBOL LOGOUT */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-yellow-400">Dashboard Admin</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition"
        >
          Logout
        </button>
      </div>

      {/* Statistik Cepat */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 border-gray-800 rounded-xl bg-gray-900/50">
          <p className="text-sm text-gray-400">Total Rumah</p>
          <h2 className="text-2xl font-bold text-yellow-400">0</h2>
        </div>
        <div className="p-6 border border-gray-800 rounded-xl bg-gray-900/50">
          <p className="text-sm text-gray-400">Total Mobil</p>
          <h2 className="text-2xl font-bold text-yellow-400">0</h2>
        </div>
        <div className="p-6 border-gray-800 rounded-xl bg-gray-900/50">
          <p className="text-sm text-gray-400">Total Showroom</p>
          <h2 className="text-2xl font-bold text-yellow-400">0</h2>
        </div>
      </div>

      {/* Menu Aksi Cepat */}
      <h2 className="text-xl font-bold mb-4">Aksi Cepat</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <a href="/rumah/input" className="p-4 border border-gray-800 rounded-lg hover:bg-yellow-500 hover:text-black hover:border-yellow-500 transition text-center font-semibold">
          + Input Rumah
        </a>
        <a href="/dashboard/mobil/input" className="p-4 border-gray-800 rounded-lg hover:bg-yellow-500 hover:text-black hover:border-yellow-500 transition text-center font-semibold">
          + Input Mobil
        </a>
        <a href="/rumah" className="p-4 border-gray-800 rounded-lg hover:bg-yellow-500 hover:text-black hover:border-yellow-500 transition text-center font-semibold">
          Kelola Rumah
        </a>
        <a href="/mobil" className="p-4 border-gray-800 rounded-lg hover:bg-yellow-500 hover:text-black hover:border-yellow-500 transition text-center font-semibold">
          Kelola Mobil
        </a>
      </div>

      {/* Aktivitas Terbaru */}
      <h2 className="text-xl font-bold mt-8 mb-4">Aktivitas Terbaru</h2>
      <div className="border border-gray-800 rounded-lg p-4 bg-gray-900/50">
        <p className="text-gray-500">Belum ada aktivitas</p>
      </div>
    </div>
  )
}
