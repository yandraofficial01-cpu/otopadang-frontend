'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const API_URL = 'https://otopadang-api.up.railway.app'

export default function AdminPage() {
  const [token, setToken] = useState('')
  const [mobilPending, setMobilPending] = useState([])
  const [showrooms, setShowrooms] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const t = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    // FIX 1: PENJAGA ROLE ADMIN
    if (!t || role!== 'admin') {
      alert('Akses ditolak. Login sebagai admin dulu')
      return router.replace('/login-admin')
    }
    setToken(t)
    fetchData(t)
  }, [router])

  const fetchData = async (t) => {
    setLoading(true)
    try {
      // FIX 2: KASIH TRY CATCH BIAR GA CRASH
      const [resMobil, resShowroom] = await Promise.all([
        fetch(`${API_URL}/mobil/pending`, { headers: { 'Authorization': `Bearer ${t}` } }),
        fetch(`${API_URL}/showroom/`, { headers: { 'Authorization': `Bearer ${t}` } })
      ])

      if(!resMobil.ok ||!resShowroom.ok) throw new Error('Gagal fetch data')

      setMobilPending(await resMobil.json())
      setShowrooms(await resShowroom.json())
    } catch (error) {
      alert('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (mobilId) => {
    if(!confirm('Yakin approve mobil ini?')) return
    await fetch(`${API_URL}/mobil/${mobilId}/approve`, {
      method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }
    })
    alert('Mobil disetujui!')
    fetchData(token)
  }

  const handleSetPremium = async (showroomId) => {
    if(!confirm('Jadikan showroom ini Premium?')) return
    await fetch(`${API_URL}/showroom/${showroomId}/premium`, {
      method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }
    })
    alert('Showroom jadi Premium!')
    fetchData(token)
  }

  const handleLogout = () => {
    localStorage.clear()
    router.push('/login-admin')
  }

  if(loading) return <div className="p-10 text-center text-white">Loading data admin...</div>

  return (
    <div className="p-6 md:p-10 bg-[#0B0B0F] min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-yellow-400">Panel Admin OTO PADANG</h1>
        <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded-lg">Logout</button>
      </div>

      {/* SECTION 1: APPROVE CEPAT */}
      <div className="mb-8 p-6 border border-green-500 rounded-xl bg-green-900/20">
        <h2 className="text-xl font-bold mb-4 text-green-400">🔥 Tugas Utama: Review Mobil Baru</h2>
        {mobilPending.length === 0? <p className="text-gray-500">Tidak ada mobil baru</p> :
          mobilPending.slice(0, 5).map(mobil => (
            <div key={mobil.id} className="border-gray-700 p-4 rounded-lg mb-3 flex justify-between items-center bg-gray-900">
              <div>
                <p className="font-bold">{mobil.merek} {mobil.tipe} {mobil.tahun}</p>
                <p className="text-sm text-gray-400">Dari: {mobil.showroom?.nama_showroom} | Rp{mobil.harga_tunai?.toLocaleString('id-ID')}</p>
              </div>
              <button onClick={() => handleApprove(mobil.id)} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-bold">Approve</button>
            </div>
          ))
        }
      </div>

      {/* SECTION 2: PREMIUM SHOWROOM */}
      <div className="mb-8 p-6 border border-yellow-500 rounded-xl bg-yellow-900/20">
        <h2 className="text-xl font-bold mb-4 text-yellow-400">👑 Manajemen Premium Showroom</h2>
        {showrooms.map(showroom => (
          <div key={showroom.id} className="border-gray-700 p-4 rounded-lg mb-3 flex justify-between items-center bg-gray-900">
            <div>
              <p className="font-bold">{showroom.nama_showroom}
                {showroom.is_premium && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded">HOT</span>}
              </p>
              <p className="text-sm text-gray-400">Kuota: {showroom.jumlah_mobil}/{showroom.kuota_mobil} | WA: {showroom.no_hp}</p>
            </div>
            {!showroom.is_premium &&
              <button onClick={() => handleSetPremium(showroom.id)} className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded font-bold">Jadikan Premium</button>
            }
          </div>
        ))}
      </div>

      {/* SECTION 3: MENU LAINNYA */}
      <h2 className="text-xl font-bold mb-4">Menu Lainnya</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/admin/upload-rumah" className="p-4 border-gray-800 rounded-lg hover:bg-yellow-500 hover:text-black transition text-center">
          <h2 className="font-bold">Upload Rumah</h2>
        </Link>
        <Link href="/admin/blog" className="p-4 border-gray-800 rounded-lg hover:bg-yellow-500 hover:text-black transition text-center">
          <h2 className="font-bold">Kelola Blog</h2>
        </Link>
        <Link href="/admin/register-showroom" className="p-4 border-gray-800 rounded-lg hover:bg-yellow-500 hover:text-black transition text-center">
          <h2 className="font-bold">Daftar Showroom</h2>
        </Link>
        <Link href="/admin/approve-showroom" className="p-4 border-gray-800 rounded-lg hover:bg-yellow-500 hover:text-black transition text-center">
          <h2 className="font-bold">Approve Showroom</h2>
        </Link>
      </div>
    </div>
  )
}
