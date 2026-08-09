'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const API_URL = 'https://otopadang-api.up.railway.app'

export default function AdminPage() {
  const [token, setToken] = useState('')
  const [mobilPending, setMobilPending] = useState([])
  const [showrooms, setShowrooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  const fetchData = useCallback(async (t, retry = 0) => {
    setLoading(true)
    setError('')
    try {
      const [resMobil, resShowroom] = await Promise.all([
        fetch(`${API_URL}/admin/mobil`, { headers: { 'Authorization': `Bearer ${t}` } }),
        fetch(`${API_URL}/admin/showrooms`, { headers: { 'Authorization': `Bearer ${t}` } })
      ])

      if(!resMobil.ok || !resShowroom.ok) throw new Error(`Gagal fetch: ${resMobil.status} ${resShowroom.status}`)

      const dataMobil = await resMobil.json()
      const dataShowroom = await resShowroom.json()
      
      setMobilPending(dataMobil.filter(m => m.status === "pending"))
      setShowrooms(dataShowroom)

    } catch (error) {
      console.error("Fetch error:", error)
      if(retry < 2){ 
        setTimeout(() => fetchData(t, retry + 1), 2000)
      } else {
        setError('Gagal konek ke server. Coba refresh atau cek token login.')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // FIX: Samain sama yang di login-admin, baca semua kemungkinan key
    const t = localStorage.getItem('access_token') || localStorage.getItem('token_admin') || localStorage.getItem('token')
    const role = localStorage.getItem('role')

    console.log('Token ketemu?', !!t, 'Role:', role)

    if (!t) {
      console.log('Token kosong, balik ke login')
      router.replace('/login-admin')
      return
    }
    
    if (role !== 'admin') {
      setError('Role kamu bukan admin: ' + role)
      setLoading(false)
      return
    }

    setToken(t)
    fetchData(t)
  }, [router, fetchData])

  const handleApprove = async (mobilId) => {
    if(!confirm('Yakin approve mobil ini?')) return
    try {
      const res = await fetch(`${API_URL}/admin/mobil/${mobilId}`, {
        method: 'PUT', 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: "approved" })
      })
      if(res.ok){
        fetchData(token)
      } else {
        setError('Gagal approve mobil')
      }
    } catch (err) {
      setError('Error saat approve')
    }
  }

  const handleSetPremium = async (showroomId) => {
    if(!confirm('Jadikan showroom ini Premium?')) return
    try {
      const res = await fetch(`${API_URL}/admin/showroom/${showroomId}`, {
        method: 'PUT', 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_premium: true, kuota_mobil: 100 })
      })
      if(res.ok){
        fetchData(token)
      } else {
        setError('Gagal set premium')
      }
    } catch (err) {
      setError('Error saat set premium')
    }
  }

  const handleLogout = () => {
    // Hapus semua key biar bersih
    localStorage.removeItem('access_token')
    localStorage.removeItem('token_admin')
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('email')
    document.cookie = "token=; path=/; max-age=0"
    router.replace('/login-admin')
  }

  if(loading) return <div className="p-10 text-center text-white bg-[#0B0B0F] min-h-screen">Loading data admin...</div>

  return (
    <div className="p-6 md:p-10 bg-[#0B0B0F] min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-yellow-400">Panel Admin OTO PADANG</h1>
        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold">Logout</button>
      </div>

      {error && <div className="bg-red-900/50 border border-red-500 p-3 rounded-lg mb-4">{error}</div>}

      <div className="mb-8 p-6 border border-green-500 rounded-xl bg-green-900/20">
        <h2 className="text-xl font-bold mb-4 text-green-400">🔥 Tugas Utama: Review Mobil Baru</h2>
        {mobilPending.length === 0? <p className="text-gray-500">Tidak ada mobil baru</p> :
          mobilPending.slice(0, 5).map(mobil => (
            <div key={mobil.id} className="border border-gray-700 p-4 rounded-lg mb-3 flex justify-between items-center bg-gray-900">
              <div>
                <p className="font-bold">{mobil.merek} {mobil.tipe} {mobil.tahun}</p>
                <p className="text-sm text-gray-400">Dari: {mobil.showroom?.nama_showroom || 'N/A'} | Rp{mobil.harga_tunai?.toLocaleString('id-ID')}</p>
              </div>
              <button onClick={() => handleApprove(mobil.id)} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-bold">Approve</button>
            </div>
          ))
        }
      </div>

      <div className="mb-8 p-6 border-yellow-500 rounded-xl bg-yellow-900/20">
        <h2 className="text-xl font-bold mb-4 text-yellow-400">👑 Manajemen Premium Showroom</h2>
        {showrooms.length === 0? <p className="text-gray-500">Belum ada showroom</p> :
          showrooms.map(showroom => (
            <div key={showroom.id} className="border border-gray-700 p-4 rounded-lg mb-3 flex justify-between items-center bg-gray-900">
              <div>
                <p className="font-bold">{showroom.nama_showroom}
                  {showroom.is_premium && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded">HOT</span>}
                </p>
                <p className="text-sm text-gray-400">Kuota: {showroom.jumlah_mobil || 0}/{showroom.kuota_mobil || 10} | WA: {showroom.no_hp}</p>
              </div>
              {!showroom.is_premium &&
                <button onClick={() => handleSetPremium(showroom.id)} className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded font-bold">Jadikan Premium</button>
              }
            </div>
          ))
        }
      </div>

      <h2 className="text-xl font-bold mb-4">Menu Lainnya</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/admin/upload-rumah" className="p-4 border border-gray-800 rounded-lg hover:bg-yellow-500 hover:text-black transition text-center">
          <h2 className="font-bold">Upload Rumah</h2>
        </Link>
        <Link href="/admin/blog" className="p-4 border border-gray-800 rounded-lg hover:bg-yellow-500 hover:text-black transition text-center">
          <h2 className="font-bold">Kelola Blog</h2>
        </Link>
        <Link href="/admin/register-showroom" className="p-4 border border-gray-800 rounded-lg hover:bg-yellow-500 hover:text-black transition text-center">
          <h2 className="font-bold">Daftar Showroom</h2>
        </Link>
        <Link href="/admin/approve-showroom" className="p-4 border border-gray-800 rounded-lg hover:bg-yellow-500 hover:text-black transition text-center">
          <h2 className="font-bold">Approve Showroom</h2>
        </Link>
      </div>
    </div>
  )
}
