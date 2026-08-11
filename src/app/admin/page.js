'use client'
import { useState, useEffect, useCallback } from 'react'
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

  const fetchWithTimeout = async (url, t, timeout = 5000) => {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)
    try {
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${t}` },
        signal: controller.signal
      })
      clearTimeout(id)
      if(!res.ok) {
        const txt = await res.text()
        throw new Error(`${url.split('/').pop()} ${res.status}: ${txt.slice(0,100)}`)
      }
      return await res.json()
    } catch(e) {
      clearTimeout(id)
      throw e
    }
  }

  const fetchData = useCallback(async (t) => {
    setLoading(true)
    setError('')
    // Safety: paksa berhenti loading setelah 4 detik apapun yang terjadi
    const safetyTimer = setTimeout(() => setLoading(false), 4000)

    try {
      let mobil = [], showroom = [], rumah = [], blog = []

      try { mobil = await fetchWithTimeout(`${API_URL}/admin/mobil`, t) }
      catch(e){ console.log('Mobil error:', e.message) }

      try { showroom = await fetchWithTimeout(`${API_URL}/admin/showrooms`, t) }
      catch(e){ console.log('Showroom error:', e.message) }

      try { rumah = await fetchWithTimeout(`${API_URL}/admin/rumah`, t) }
      catch(e){ console.log('Rumah error:', e.message) }

      try { blog = await fetchWithTimeout(`${API_URL}/admin/blog`, t) }
      catch(e){ console.log('Blog error (skip):', e.message); blog = [] }

      setAllMobil(Array.isArray(mobil)? mobil : mobil?.data || [])
      setShowrooms(Array.isArray(showroom)? showroom : showroom?.data || [])
      setAllRumah(Array.isArray(rumah)? rumah : rumah?.data || [])
      setAllBlog(Array.isArray(blog)? blog : [])

      if(!mobil &&!showroom) {
        setError('Railway sleep / tidak merespon - data 0. Refresh lagi 30 detik.')
      }

    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      clearTimeout(safetyTimer)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const t = localStorage.getItem('access_token') || localStorage.getItem('token_admin') || localStorage.getItem('token')
    if (!t) {
      window.location.href = '/login-admin'
      return
    }
    setToken(t)
    fetchData(t)
  }, [fetchData])

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

  // FIX LOGOUT - pakai window.location.href bukan router.replace
  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('token')
    localStorage.removeItem('token_admin')
    localStorage.removeItem('role')
    localStorage.clear()
    document.cookie = "token=; path=/; max-age=0"
    document.cookie = "access_token=; path=/; max-age=0"
    document.cookie = "token_admin=; path=/; max-age=0"
    document.cookie = "role=; path=/; max-age=0"
    window.location.href = '/login-admin'
  }

  if(loading) return (
    <div className="p-10 text-center text-white bg-[#0B0B0F] min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="animate-pulse">Loading data admin...</p>
      <p className="text-xs text-gray-500">Menghubungi Railway... (max 4 detik)</p>
      <button onClick={handleLogout} className="mt-4 bg-red-600 px-6 py-3 rounded-xl font-bold">Force Logout</button>
    </div>
  )

  const mobilPending = allMobil.filter(m => m.status === 'pending')

  return (
    <div className="p-6 md:p-10 bg-[#0B0B0F] min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-yellow-400">Panel Admin OTO PADANG</h1>
        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-semibold transition">Logout</button>
      </div>

      {error && <div className="bg-red-900/50 border border-red-500 p-3 rounded-lg mb-4 break-all">{error} <button onClick={()=>window.location.reload()} className="ml-2 bg-white text-black px-2 py-1 rounded text-xs">Refresh</button></div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1a1a20] border border-gray-800 p-4 rounded-xl"><p className="text-gray-400 text-sm">Total Mobil</p><p className="text-2xl font-bold">{allMobil.length}</p><p className="text-xs text-green-400">{mobilPending.length} pending</p></div>
        <div className="bg-[#1a1a20] border border-gray-800 p-4 rounded-xl"><p className="text-gray-400 text-sm">Total Showroom</p><p className="text-2xl font-bold">{showrooms.length}</p></div>
        <div className="bg-[#1a1a20] border border-gray-800 p-4 rounded-xl"><p className="text-gray-400 text-sm">Total Rumah</p><p className="text-2xl font-bold">{allRumah.length}</p></div>
        <div className="bg-[#1a1a20] border border-gray-800 p-4 rounded-xl"><p className="text-gray-400 text-sm">Total Blog</p><p className="text-2xl font-bold">{allBlog.length}</p></div>
      </div>

      <div className="mb-8 p-6 border border-green-500 rounded-xl bg-green-900/10">
        <h2 className="text-xl font-bold mb-4 text-green-400">🔥 Tugas Utama: Review Mobil Baru ({mobilPending.length})</h2>
        {mobilPending.length === 0? <p className="text-gray-500">Tidak ada mobil baru - Total di DB: {allMobil.length}</p> :
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
              {s.paket!== 'Premium' && <button onClick={() => handleSetPremium(s.id)} className="bg-white text-black px-3 py-2 rounded font-bold text-sm">Premium</button>}
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
