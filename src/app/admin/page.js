'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  ShieldCheck, Car, Home, FileText, Building2,
  LogOut, Check, X, Flame, Crown, Trash2, DollarSign,
  Loader2, RefreshCw, AlertTriangle
} from 'lucide-react'

const API_URL = 'https://otopadang-api.up.railway.app'

export default function AdminPage() {
  const [token, setToken] = useState('')
  const [allMobil, setAllMobil] = useState([])
  const [allRumah, setAllRumah] = useState([])
  const [allBlog, setAllBlog] = useState([])
  const [showrooms, setShowrooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchWithTimeout = async (url, t, timeout = 8000) => { // naikin ke 8s
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
    const safetyTimer = setTimeout(() => setLoading(false), 9000)

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

      setAllMobil(Array.isArray(mobil)? mobil : [])
      setShowrooms(Array.isArray(showroom)? showroom : [])
      setAllRumah(Array.isArray(rumah)? rumah : [])
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
    const t = localStorage.getItem('token') // FIX: Pake 1 key aja
    if (!t) {
      window.location.href = '/login-admin'
      return
    }
    setToken(t)
    fetchData(t)
  }, [fetchData])

  // ACTION MOBIL
  const handleApproveMobil = async (id) => {
    if(!confirm('Approve mobil ini?')) return
    const res = await fetch(`${API_URL}/admin/mobil/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'approved' })
    })
    if(res.ok) fetchData(token); else alert(await res.text())
  }

  const handleSoldMobil = async (id) => {
    if(!confirm('Tandai mobil ini SOLD?')) return
    const res = await fetch(`${API_URL}/admin/mobil/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'soldout' }) // FIX: BE pake 'soldout' bukan 'sold'
    })
    if(res.ok) fetchData(token); else alert(await res.text())
  }

  const handleDeleteMobil = async (id) => {
    if(!confirm('HAPUS PERMANEN? Data tidak bisa dikembalikan!')) return
    const res = await fetch(`${API_URL}/admin/mobil/${id}`, {
      method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
    })
    if(res.ok) fetchData(token); else alert(await res.text())
  }

  // ACTION RUMAH - BARU
  const handleTerjualRumah = async (id) => {
    if(!confirm('Tandai rumah ini TERJUAL?')) return
    const res = await fetch(`${API_URL}/admin/rumah/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'terjual' })
    })
    if(res.ok) fetchData(token); else alert(await res.text())
  }

  const handleDeleteRumah = async (id) => {
    if(!confirm('HAPUS PERMANEN RUMAH?')) return
    const res = await fetch(`${API_URL}/admin/rumah/${id}`, {
      method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
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

  const handleLogout = () => {
    localStorage.clear()
    document.cookie = "token=; path=/; max-age=0"
    window.location.href = '/login-admin'
  }

  if(loading) return (
    <div className="bg-[#0B0B0F] min-h-screen flex flex-col items-center justify-center gap-4 text-white">
      <Loader2 className="w-10 h-10 animate-spin text-yellow-400"/>
      <p className="animate-pulse font-semibold">Loading Panel Admin...</p>
      <p className="text-xs text-gray-500">Menghubungi Railway... max 9 detik</p>
      <button onClick={handleLogout} className="mt-4 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2"><LogOut size={18}/> Force Logout</button>
    </div>
  )

  const mobilPending = allMobil.filter(m => m.status === 'pending')
  const mobilApproved = allMobil.filter(m => m.status === 'approved')
  const mobilSold = allMobil.filter(m => m.status === 'soldout') // FIX: soldout

  const rumahAktif = allRumah.filter(r => r.status!== 'terjual')
  const rumahTerjual = allRumah.filter(r => r.status === 'terjual')

  const StatusBadge = ({status}) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      approved: 'bg-green-500/20 text-green-400 border-green-500/30',
      soldout: 'bg-blue-500/20 text-blue-400 border-blue-500/30', // FIX
      terjual: 'bg-purple-500/20 text-purple-400 border-purple-500/30', // BARU
      rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    }
    return <span className={`px-2 py-1 text-xs font-bold rounded-full border ${colors[status] || colors.pending}`}>{status?.toUpperCase()}</span>
  }

  return (
    <div className="p-6 md:p-10 bg-[#0B0B0F] min-h-screen text-white font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-bold text-yellow-400 flex items-center gap-3">
          <ShieldCheck size={32} className="text-yellow-400"/> Panel Admin OTO PADANG
        </h1>
        <button onClick={handleLogout} className="bg-red-600/20 hover:bg-red-600 border border-red-500/30 px-5 py-2 rounded-lg font-semibold transition flex items-center gap-2">
          <LogOut size={18}/> Logout
        </button>
      </div>

      {error && <div className="bg-red-900/50 border-red-500 p-3 rounded-lg mb-4 flex items-center gap-2"><AlertTriangle size={18}/> {error} <button onClick={()=>window.location.reload()} className="ml-2 bg-white text-black px-2 py-1 rounded text-xs flex items-center gap-1"><RefreshCw size={12}/> Refresh</button></div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#1a1a20] to-[#111] border-gray-800 p-5 rounded-2xl shadow-lg">
          <p className="text-gray-400 text-sm flex items-center gap-2"><Car size={16}/> Total Mobil</p>
          <p className="text-3xl font-bold mt-2">{allMobil.length}</p>
          <p className="text-xs text-yellow-400 mt-1">{mobilPending.length} pending</p>
        </div>
        <div className="bg-gradient-to-br from-[#1a1a20] to-[#111] border-gray-800 p-5 rounded-2xl shadow-lg">
          <p className="text-gray-400 text-sm flex items-center gap-2"><Building2 size={16}/> Showroom</p>
          <p className="text-3xl font-bold mt-2">{showrooms.length}</p>
        </div>
        <div className="bg-gradient-to-br from-[#1a1a20] to-[#111] border border-gray-800 p-5 rounded-2xl shadow-lg">
          <p className="text-gray-400 text-sm flex items-center gap-2"><Home size={16}/> Rumah</p>
          <p className="text-3xl font-bold mt-2">{allRumah.length}</p>
        </div>
        <div className="bg-gradient-to-br from-[#1a1a20] to-[#111] border border-gray-800 p-5 rounded-2xl shadow-lg">
          <p className="text-gray-400 text-sm flex items-center gap-2"><FileText size={16}/> Blog</p>
          <p className="text-3xl font-bold mt-2">{allBlog.length}</p>
        </div>
      </div>

      <div className="mb-8 p-6 border-yellow-500/30 rounded-2xl bg-gradient-to-br from-yellow-900/10 to-transparent">
        <h2 className="text-xl font-bold mb-4 text-yellow-400 flex items-center gap-2"><Flame size={20}/> Review Mobil Baru ({mobilPending.length})</h2>
        {mobilPending.length === 0? <p className="text-gray-500">Tidak ada mobil baru - Total di DB: {allMobil.length}</p> :
          mobilPending.slice(0, 10).map(m => (
            <div key={m.id} className="border border-gray-800 p-4 rounded-xl mb-3 flex flex-col md:flex-row justify-between items-start md:items-center bg-[#1a1a20]/50 hover:bg-[#1a1a20] transition">
              <div className="flex gap-3 w-full">
                <img src={m.foto_url_1 || 'https://via.placeholder.com/100x100.png?text=No+Image'} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" alt={m.nama_mobil} />
                <div className="flex-1">
                  <p className="font-bold text-lg">{m.merek} {m.nama_mobil} {m.tahun}</p>
                  <p className="text-sm text-gray-400">Dari: {m.showroom_nama} | ID: {m.id}</p>
                  <p className="text-yellow-400 font-bold">Rp{(m.harga || 0).toLocaleString('id-ID')}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3 md:mt-0 w-full md:w-auto">
                <button onClick={() => handleApproveMobil(m.id)} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 flex-1"><Check size={16}/> Approve</button>
                <button onClick={() => handleDeleteMobil(m.id)} className="bg-red-600/50 hover:bg-red-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 flex-1"><Trash2 size={16}/> Delete</button>
              </div>
            </div>
          ))
        }
      </div>

      <div className="mb-8 p-6 border border-green-500/30 rounded-2xl bg-gradient-to-br from-green-900/10 to-transparent">
        <h2 className="text-xl font-bold mb-4 text-green-400 flex items-center gap-2"><Check size={20}/> Mobil Aktif ({mobilApproved.length})</h2>
        {mobilApproved.slice(0, 5).map(m => (
          <div key={m.id} className="border border-gray-800 p-4 rounded-xl mb-3 flex flex-col md:flex-row justify-between items-start md:items-center bg-[#1a1a20]/50">
            <div className="flex gap-3">
              <img src={m.foto_url_1 || 'https://via.placeholder.com/80x80.png'} className="w-16 h-16 rounded-lg object-cover" />
              <div>
                <p className="font-bold">{m.merek} {m.nama_mobil}</p>
                <p className="text-sm text-gray-400">Dari: {m.showroom_nama}</p>
                <div className="flex items-center gap-2 mt-1"><StatusBadge status={m.status}/></div>
              </div>
            </div>
            <button onClick={() => handleSoldMobil(m.id)} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 mt-3 md:mt-0"><DollarSign size={16}/> Tandai SOLDOUT</button>
          </div>
        ))}
      </div>

      {/* BARU: LIST RUMAH */}
      <div className="mb-8 p-6 border border-purple-500/30 rounded-2xl bg-gradient-to-br from-purple-900/10 to-transparent">
        <h2 className="text-xl font-bold mb-4 text-purple-400 flex items-center gap-2"><Home size={20}/> Manajemen Rumah ({allRumah.length})</h2>
        {rumahAktif.slice(0, 5).map(r => (
          <div key={r.id} className="border border-gray-800 p-4 rounded-xl mb-3 flex flex-col md:flex-row justify-between items-start md:items-center bg-[#1a1a20]/50">
            <div>
              <p className="font-bold">{r.judul}</p>
              <p className="text-sm text-gray-400">Lokasi: {r.lokasi} | Harga: Rp{(r.harga || 0).toLocaleString('id-ID')}</p>
              <div className="flex items-center gap-2 mt-1"><StatusBadge status={r.status}/></div>
            </div>
            <div className="flex gap-2 mt-3 md:mt-0">
              <button onClick={() => handleTerjualRumah(r.id)} className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2"><DollarSign size={16}/> Tandai TERJUAL</button>
              <button onClick={() => handleDeleteRumah(r.id)} className="bg-red-600/50 hover:bg-red-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Trash2 size={16}/> Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8 p-6 border-purple-500/30 rounded-2xl bg-gradient-to-br from-purple-900/10 to-transparent">
        <h2 className="text-xl font-bold mb-4 text-purple-400 flex items-center gap-2"><Crown size={20}/> Manajemen Showroom ({showrooms.length})</h2>
        {showrooms.map(s => (
          <div key={s.id} className="border border-gray-800 p-4 rounded-xl mb-3 flex flex-col md:flex-row justify-between items-start md:items-center bg-[#1a1a20]/50">
            <div>
              <p className="font-bold flex items-center gap-2">
                {s.nama_showroom}
                {s.paket === 'Premium' && <span className="bg-gradient-to-r from-red-500 to-yellow-500 text-xs px-2 py-1 rounded-full font-bold">PREMIUM</span>}
              </p>
              <p className="text-sm text-gray-400">Status: {s.status} | WA: {s.wa_number}</p>
            </div>
            <div className="flex gap-2 mt-3 md:mt-0">
              {s.status === 'pending' && <button onClick={() => handleApproveShowroom(s.id)} className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-2 rounded-lg font-bold text-sm flex items-center gap-1"><Check size={14}/> Approve</button>}
              {s.paket!== 'Premium' && <button onClick={() => handleSetPremium(s.id)} className="bg-white hover:bg-gray-200 text-black px-3 py-2 rounded-lg font-bold text-sm flex items-center gap-1"><Crown size={14}/> Premium</button>}
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-4">Menu Lainnya</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/admin/upload-rumah" className="p-4 border border-gray-800 rounded-xl hover:border-yellow-400 hover:bg-yellow-400/10 transition flex flex-col items-center gap-2"><Home size={24}/> <h2 className="font-bold">Upload Rumah</h2></Link>
        <Link href="/admin/blog" className="p-4 border-gray-800 rounded-xl hover:border-yellow-400 hover:bg-yellow-400/10 transition flex flex-col items-center gap-2"><FileText size={24}/> <h2 className="font-bold">Kelola Blog</h2></Link>
        <Link href="/admin/register-showroom" className="p-4 border border-gray-800 rounded-xl hover:border-yellow-400 hover:bg-yellow-400/10 transition flex-col items-center gap-2"><Building2 size={24}/> <h2 className="font-bold">Daftar Showroom</h2></Link>
        <Link href="/admin/approve-showroom" className="p-4 border border-gray-800 rounded-xl hover:border-yellow-400 hover:bg-yellow-400/10 transition flex flex-col items-center gap-2"><ShieldCheck size={24}/> <h2 className="font-bold">Approve Showroom</h2></Link>
      </div>
    </div>
  )
}
