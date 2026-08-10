'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const API_URL = 'https://otopadang-api.up.railway.app'

export default function AdminPage() {
  const [token, setToken] = useState('')
  const [allMobil, setAllMobil] = useState([])
  const [allRumah, setAllRumah] = useState([])
  const [allBlog, setAllBlog] = useState([])
  const [showrooms, setShowrooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  const fetchData = useCallback(async (t) => {
    setLoading(true)
    setError('')
    try {
      const [resMobil, resShowroom, resRumah, resBlog] = await Promise.all([
        fetch(`${API_URL}/admin/mobil`, { headers: { 'Authorization': `Bearer ${t}` } }),
        fetch(`${API_URL}/admin/showrooms`, { headers: { 'Authorization': `Bearer ${t}` } }),
        fetch(`${API_URL}/admin/rumah`, { headers: { 'Authorization': `Bearer ${t}` } }),
        fetch(`${API_URL}/admin/blog`, { headers: { 'Authorization': `Bearer ${t}` } })
      ])

      if(!resMobil.ok) throw new Error(`Mobil ${resMobil.status}: ${await resMobil.text()}`)
      if(!resShowroom.ok) throw new Error(`Showroom ${resShowroom.status}: ${await resShowroom.text()}`)

      const dataMobil = await resMobil.json()
      const dataShowroom = await resShowroom.json()
      const dataRumah = resRumah.ok ? await resRumah.json() : []
      const dataBlog = resBlog.ok ? await resBlog.json() : []

      setAllMobil(Array.isArray(dataMobil) ? dataMobil : [])
      setShowrooms(Array.isArray(dataShowroom) ? dataShowroom : [])
      setAllRumah(Array.isArray(dataRumah) ? dataRumah : [])
      setAllBlog(Array.isArray(dataBlog) ? dataBlog : [])

    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const t = localStorage.getItem('access_token') || localStorage.getItem('token_admin') || localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!t) { router.replace('/login-admin'); return }
    if (role !== 'admin') { setError('Role bukan admin: '+role); setLoading(false); return }
    setToken(t)
    fetchData(t)
  }, [router, fetchData])

  const handleApproveMobil = async (id) => {
    if(!confirm('Approve mobil ini?')) return
    const res = await fetch(`${API_URL}/admin/mobil/${id}`, {
      method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: "approved" })
    })
    if(res.ok) fetchData(token); else alert(await res.text())
  }

  const handleApproveShowroom = async (id) => {
    if(!confirm('Approve showroom ini?')) return
    const res = await fetch(`${API_URL}/admin/showrooms/${id}/approve`, {
      method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }
    })
    if(res.ok) fetchData(token); else alert(await res.text())
  }

  const handleSetPremium = async (id) => {
    if(!confirm('Jadikan Premium?')) return
    const res = await fetch(`${API_URL}/admin/showrooms/${id}/premium`, {
      method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }
    })
    if(res.ok) fetchData(token); else alert(await res.text())
  }

  const handleLogout = () => { localStorage.clear(); document.cookie="token=; path=/; max-age=0"; router.replace('/login-admin') }

  if(loading) return <div className="p-10 text-center text-white bg-[#0B0B0F] min-h-screen">Loading data admin...</div>

  const mobilPending = allMobil.filter(m => m.status === 'pending')

  return (
    <div className="p-6 md:p-10 bg-[#0B0B0F] min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-yellow-400">Panel Admin OTO PADANG</h1>
        <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded-lg font-semibold">Logout</button>
      </div>

      {error && <div className="bg-red-900/50 border border-red-500 p-3 rounded-lg mb-4 break-all">{error}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1a1a20] border border-gray-800 p-4 rounded-xl"><p className="text-gray-400 text-sm">Total Mobil</p><p className="text-2xl font-bold">{allMobil.length}</p><p className="text-xs text-green-400">{mobilPending.length} pending</p></div>
        <div className="bg-[#1a1a20] border border-gray-800 p-4 rounded-xl"><p className="text-gray-400 text-sm">Total Showroom</p><p className="text-2xl font-bold">{showrooms.length}</p></div>
        <div className="bg-[#1a1a20] border border-gray-800 p-4 rounded-xl"><p className="text-gray-400 text-sm">Total Rumah</p><p className="text-2xl font-bold">{allRumah.length}</p></div>
        <div className="bg-[#1a1a20] border border-gray-800 p-4 rounded-xl"><p className="text-gray-400 text-sm">Total Blog</p><p className="text-2xl font-bold">{allBlog.length}</p></div>
      </div>

      <div className="mb-8 p-6 border border-green-500 rounded-xl bg-green-900/10">
        <h2 className="text-xl font-bold mb-4 text-green-400">🔥 Tugas Utama: Review Mobil Baru ({mobilPending.length})</h2>
        {mobilPending.length === 0 ? <p className="text-gray-500">Tidak ada mobil baru - Total di DB: {allMobil.length}</p> :
          mobilPending.slice(0, 10).map(m => (
            <div key={m.id} className="border border-gray-800 p-4 rounded-lg mb-3 flex justify-between items-center bg-[#1a1a20]">
              <div><p className="font-bold">{m.merek || m.brand} {m.tipe} {m.tahun}</p><p className="text-sm text-gray-400">ID: {m.id} | Rp{(m.harga_tunai || m.price || 0).toLocaleString('id-ID')}</p></div>
              <button onClick={() => handleApproveMobil(m.id)} className="bg-green-600 px-4 py-2 rounded font-bold">Approve</button>
            </div>
          ))
        }
      </div>

      <div className="mb-8 p-6 border border-yellow-500 rounded-xl bg-yellow-900/10">
        <h2 className="text-xl font-bold mb-4 text-yellow-400">👑 Manajemen Showroom ({showrooms.length})</h2>
        {showrooms.map(s => (
          <div key={s.id} className="border border-gray-800 p-4 rounded-lg mb-3 flex justify-between items-center bg-[#1a1a20]">
            <div><p className="font-bold">{s.nama_showroom} {s.paket === 'Premium' && <span className="ml-2 bg-red-500 text-xs px-2 py-1 rounded">HOT</span>}</p><p className="text-sm text-gray-400">Status: {s.status} | Paket: {s.paket} | WA: {s.wa_number}</p></div>
            <div className="flex gap-2">
              {s.status === 'pending' && <button onClick={() => handleApproveShowroom(s.id)} className="bg-yellow-500 text-black px-3 py-2 rounded font-bold text-sm">Approve</button>}
              {s.paket !== 'Premium' && <button onClick={() => handleSetPremium(s.id)} className="bg-white text-black px-3 py-2 rounded font-bold text-sm">Premium</button>}
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-4">Menu Lainnya</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/admin/upload-rumah" className="p-4 border border-gray-800 rounded-lg hover:bg-yellow-500 hover:text-black transition text-center"><h2 className="font-bold">Upload Rumah</h2></Link>
        <Link href="/admin/blog" className="p-4 border border-gray-800 rounded-lg hover:bg-yellow-500 hover:text-black transition text-center"><h2 className="font-bold">Kelola Blog ({allBlog.length})</h2></Link>
        <Link href="/admin/register-showroom" className="p-4 border border-gray-800 rounded-lg hover:bg-yellow-500 hover:text-black transition text-center"><h2 className="font-bold">Daftar Showroom</h2></Link>
        <Link href="/admin/approve-showroom" className="p-4 border border-gray-800 rounded-lg hover:bg-yellow-500 hover:text-black transition text-center"><h2 className="font-bold">Approve Showroom</h2></Link>
      </div>
    </div>
  )
}
